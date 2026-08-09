const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bdpqgizcwoawmsexqvfy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'demo_key';

const realSupabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// In-Memory Database Store for fallback when Supabase API key is invalid or offline
const memoryDB = {
  users: [],
  profiles: [],
  interviews: [],
  interview_questions: [],
  questions: [],
  answers: [],
  evaluations: [],
  results: [],
  skill_recommendations: []
};

class MemoryQueryBuilder {
  constructor(table) {
    this.table = table;
    if (!memoryDB[table]) memoryDB[table] = [];
    this.filters = [];
    this.action = 'select';
    this.insertData = null;
    this.updateData = null;
    this.selectCols = '*';
    this.isSingle = false;
    this.isMaybeSingle = false;
    this.sortCol = null;
    this.sortAsc = true;
    this.rangeFrom = 0;
    this.rangeTo = Infinity;
    this.limitVal = Infinity;
  }

  select(cols = '*') {
    if (this.action !== 'insert' && this.action !== 'update' && this.action !== 'upsert') {
      this.action = 'select';
    }
    this.selectCols = cols;
    return this;
  }

  insert(data) {
    this.action = 'insert';
    this.insertData = data;
    return this;
  }

  update(data) {
    this.action = 'update';
    this.updateData = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  upsert(data) {
    this.action = 'upsert';
    this.insertData = data;
    return this;
  }

  eq(col, val) {
    this.filters.push(item => item[col] == val);
    return this;
  }

  gt(col, val) {
    this.filters.push(item => item[col] > val);
    return this;
  }

  gte(col, val) {
    this.filters.push(item => item[col] >= val);
    return this;
  }

  in(col, arr) {
    this.filters.push(item => Array.isArray(arr) && arr.includes(item[col]));
    return this;
  }

  ilike(col, pattern) {
    const raw = String(pattern).replace(/%/g, '').toLowerCase();
    this.filters.push(item => String(item[col] || '').toLowerCase().includes(raw));
    return this;
  }

  order(col, opts = {}) {
    this.sortCol = col;
    this.sortAsc = opts.ascending !== false;
    return this;
  }

  range(from, to) {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  limit(n) {
    this.limitVal = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }

  async exec() {
    const tableData = memoryDB[this.table];

    if (this.action === 'insert' || this.action === 'upsert') {
      const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted = items.map((item) => {
        let existingIndex = -1;
        if (this.action === 'upsert') {
          existingIndex = tableData.findIndex(row => 
            (item.id && row.id === item.id) ||
            (item.interview_id && row.interview_id === item.interview_id && (!item.question_id || row.question_id === item.question_id))
          );
        }

        if (existingIndex >= 0) {
          const updatedItem = { ...tableData[existingIndex], ...item, updated_at: new Date().toISOString() };
          tableData[existingIndex] = updatedItem;
          return updatedItem;
        } else {
          const newItem = {
            id: item.id || `${this.table}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            role: 'candidate',
            is_email_verified: true,
            status: this.table === 'interviews' ? (item.status || 'in_progress') : item.status,
            ...item
          };
          memoryDB[this.table].push(newItem);
          return newItem;
        }
      });
      const resultData = Array.isArray(this.insertData) ? inserted : (this.isSingle ? inserted[0] : inserted);
      return { data: resultData, error: null };
    }

    let rows = tableData.filter(item => this.filters.every(fn => fn(item)));

    if (this.action === 'update') {
      rows.forEach(item => {
        Object.assign(item, this.updateData, { updated_at: new Date().toISOString() });
      });
      const res = this.isSingle ? (rows[0] || null) : rows;
      return { data: res, error: null };
    }

    if (this.action === 'delete') {
      memoryDB[this.table] = tableData.filter(item => !this.filters.every(fn => fn(item)));
      return { data: null, error: null };
    }

    if (this.sortCol) {
      rows.sort((a, b) => {
        if (a[this.sortCol] < b[this.sortCol]) return this.sortAsc ? -1 : 1;
        if (a[this.sortCol] > b[this.sortCol]) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    const count = rows.length;
    if (this.rangeFrom > 0 || this.rangeTo < Infinity) {
      rows = rows.slice(this.rangeFrom, this.rangeTo + 1);
    }
    if (this.limitVal < Infinity) {
      rows = rows.slice(0, this.limitVal);
    }

    // Process joined relations based on selectCols
    const processedRows = rows.map(r => {
      const copy = { ...r };
      if (this.selectCols.includes('users')) {
        copy.users = memoryDB.users.find(u => u.id === r.user_id || u.id === r.candidate_id || u.id === r.created_by_id) || null;
      }
      if (this.selectCols.includes('questions')) {
        copy.questions = memoryDB.questions.find(q => q.id === r.question_id) || null;
      }
      if (this.selectCols.includes('interviews')) {
        copy.interviews = memoryDB.interviews.find(i => i.id === r.interview_id) || null;
      }
      if (this.selectCols.includes('evaluations')) {
        copy.evaluations = memoryDB.evaluations.find(e => e.interview_id === r.interview_id || e.id === r.evaluation_id) || null;
      }
      if (this.selectCols.includes('results')) {
        copy.results = memoryDB.results.find(res => res.interview_id === r.interview_id || res.id === r.result_id) || null;
      }
      if (this.selectCols.includes('evaluation_answers')) {
        copy.evaluation_answers = memoryDB.evaluation_answers.filter(ea => ea.evaluation_id === r.id).map(ea => ({
          ...ea,
          questions: memoryDB.questions.find(q => q.id === ea.question_id) || null,
          answers: memoryDB.answers.find(a => a.id === ea.answer_id) || null
        }));
      }
      if (this.selectCols.includes('interview_questions')) {
        copy.interview_questions = memoryDB.interview_questions.filter(iq => iq.interview_id === r.id).map(iq => ({
          ...iq,
          questions: memoryDB.questions.find(q => q.id === iq.question_id) || null
        }));
      }
      return copy;
    });

    if (this.isSingle) {
      if (processedRows.length === 0) return { data: null, error: { message: 'Row not found' } };
      return { data: processedRows[0], error: null, count };
    }
    if (this.isMaybeSingle) {
      return { data: processedRows[0] || null, error: null, count };
    }
    return { data: processedRows, error: null, count };
  }
}

function createSmartBuilder(table) {
  const calls = [];
  let realBuilder = realSupabase.from(table);

  const proxy = new Proxy({}, {
    get(target, prop) {
      if (prop === 'then') {
        return function(resolve, reject) {
          realBuilder.then(res => {
            if (res.error && (res.error.message.includes('API key') || res.error.message.includes('JWT') || res.error.message.includes('Invalid') || res.error.code === '42P01' || res.error.message.includes('fetch'))) {
              const memBuilder = new MemoryQueryBuilder(table);
              for (const call of calls) {
                if (typeof memBuilder[call.method] === 'function') {
                  memBuilder[call.method](...call.args);
                }
              }
              memBuilder.exec().then(resolve, reject);
            } else {
              resolve(res);
            }
          }).catch(() => {
            const memBuilder = new MemoryQueryBuilder(table);
            for (const call of calls) {
              if (typeof memBuilder[call.method] === 'function') {
                memBuilder[call.method](...call.args);
              }
            }
            memBuilder.exec().then(resolve, reject);
          });
        };
      }
      if (prop === 'catch') {
        return function(reject) {
          return proxy.then(undefined, reject);
        };
      }
      return function(...args) {
        calls.push({ method: prop, args });
        if (typeof realBuilder[prop] === 'function') {
          realBuilder = realBuilder[prop](...args);
        }
        return proxy;
      };
    }
  });
  return proxy;
}

const supabase = {
  from(tableName) {
    return createSmartBuilder(tableName);
  },
  rpc() {
    return Promise.resolve({ data: null, error: null });
  }
};

const connectDB = async () => {
  try {
    const { error } = await realSupabase.from('users').select('count').limit(1).maybeSingle();
    if (error && (error.message.includes('API key') || error.message.includes('JWT') || error.message.includes('Invalid') || error.message.includes('fetch'))) {
      console.log('ℹ️  Supabase Cloud credentials not set or invalid. Active Mode: Local In-Memory Database.');
      return;
    }
    console.log('✅ Supabase connected:', SUPABASE_URL);
  } catch (err) {
    console.log('ℹ️  Active Mode: Local In-Memory Database.');
  }
};

process.on('SIGINT', () => { console.log('📴 Supabase client closed'); process.exit(0); });
process.on('SIGTERM', () => { console.log('📴 Supabase client closed'); process.exit(0); });

module.exports = { supabase, connectDB };

