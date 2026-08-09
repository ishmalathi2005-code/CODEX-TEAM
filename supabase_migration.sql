-- ============================================================
-- CODEX AI Interview Simulator — Supabase SQL Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  email varchar(255) unique not null,
  password text not null,
  role varchar(20) default 'user' check (role in ('user', 'admin')),
  is_active boolean default true,
  is_email_verified boolean default false,
  refresh_token text,
  password_reset_token text,
  password_reset_expires timestamptz,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── PROFILES ─────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references users(id) on delete cascade,
  bio varchar(500),
  avatar text,
  phone varchar(30),
  location varchar(100),
  linked_in text,
  github text,
  skills jsonb default '[]',
  experience_years int default 0,
  target_role varchar(100),
  target_companies text[] default '{}',
  preferred_interview_type varchar(30) default 'mixed',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── INTERVIEWS ────────────────────────────────────────────────
create table if not exists interviews (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references users(id) on delete cascade,
  title varchar(200) not null,
  type varchar(30) not null check (type in ('technical','behavioral','mixed','coding','system_design')),
  difficulty varchar(10) default 'medium' check (difficulty in ('easy','medium','hard')),
  status varchar(20) default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled')),
  domain varchar(100),
  total_questions int default 0,
  duration_minutes int default 30,
  started_at timestamptz,
  ended_at timestamptz,
  notes varchar(1000),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── QUESTIONS ─────────────────────────────────────────────────
create table if not exists questions (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  type varchar(30) not null check (type in ('technical','behavioral','coding','system_design','mcq')),
  category varchar(100) not null,
  difficulty varchar(10) default 'medium' check (difficulty in ('easy','medium','hard')),
  tags text[] default '{}',
  expected_answer text,
  scoring_rubric text,
  mcq_options jsonb,
  code_language varchar(50),
  starter_code text,
  hints text[] default '{}',
  created_by_id uuid references users(id),
  is_active boolean default true,
  usage_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_questions_type_category on questions(type, category, difficulty);

-- ─── INTERVIEW QUESTIONS (junction) ────────────────────────────
create table if not exists interview_questions (
  interview_id uuid not null references interviews(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  "order" int default 0,
  primary key (interview_id, question_id)
);

-- ─── ANSWERS ──────────────────────────────────────────────────
create table if not exists answers (
  id uuid primary key default uuid_generate_v4(),
  interview_id uuid not null references interviews(id) on delete cascade,
  question_id uuid not null references questions(id),
  candidate_id uuid not null references users(id),
  answer_text text,
  code_answer text,
  selected_option int,
  time_taken_seconds int default 0,
  is_skipped boolean default false,
  audio_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(interview_id, question_id)
);

-- ─── EVALUATIONS ───────────────────────────────────────────────
create table if not exists evaluations (
  id uuid primary key default uuid_generate_v4(),
  interview_id uuid unique not null references interviews(id) on delete cascade,
  candidate_id uuid not null references users(id),
  status varchar(20) default 'pending' check (status in ('pending','processing','completed','failed')),
  overall_feedback text,
  technical_score numeric(4,1),
  communication_score numeric(4,1),
  problem_solving_score numeric(4,1),
  evaluated_at timestamptz,
  ai_provider varchar(50) default 'openai',
  tokens_used int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── EVALUATION ANSWERS ────────────────────────────────────────
create table if not exists evaluation_answers (
  id uuid primary key default uuid_generate_v4(),
  evaluation_id uuid not null references evaluations(id) on delete cascade,
  answer_id uuid unique not null references answers(id) on delete cascade,
  question_id uuid not null references questions(id),
  score numeric(4,1),
  feedback text,
  strengths text[] default '{}',
  improvements text[] default '{}',
  ai_model varchar(50),
  created_at timestamptz default now()
);

-- ─── RESULTS ──────────────────────────────────────────────────
create table if not exists results (
  id uuid primary key default uuid_generate_v4(),
  interview_id uuid unique not null references interviews(id) on delete cascade,
  candidate_id uuid not null references users(id),
  evaluation_id uuid unique references evaluations(id),
  total_score numeric(5,1),
  percentile numeric(5,1),
  grade varchar(5),
  passed boolean,
  questions_attempted int,
  questions_correct int,
  total_time_taken_seconds int,
  category_breakdown jsonb,
  badge varchar(20),
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── SKILL RECOMMENDATIONS ─────────────────────────────────────
create table if not exists skill_recommendations (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references users(id) on delete cascade,
  based_on_interview_id uuid references interviews(id),
  recommendations jsonb not null default '[]',
  generated_by varchar(20) default 'ai',
  is_stale boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── AUTO-UPDATE updated_at TRIGGER ───────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to all tables
do $$ declare t text;
begin
  foreach t in array array['users','profiles','interviews','questions','answers','evaluations','results','skill_recommendations']
  loop
    execute format('drop trigger if exists trg_updated_at on %I', t);
    execute format('create trigger trg_updated_at before update on %I for each row execute function update_updated_at()', t);
  end loop;
end $$;

-- Disable RLS for backend access (enable and configure later for frontend)
alter table users disable row level security;
alter table profiles disable row level security;
alter table interviews disable row level security;
alter table questions disable row level security;
alter table interview_questions disable row level security;
alter table answers disable row level security;
alter table evaluations disable row level security;
alter table evaluation_answers disable row level security;
alter table results disable row level security;
alter table skill_recommendations disable row level security;

select 'CODEX AI Interview Simulator — All tables created successfully! ✅' as status;
