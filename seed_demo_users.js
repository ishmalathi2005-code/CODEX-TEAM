require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('./src/config/db');

const demoUsers = [
  {
    name: 'Alex Rivera',
    email: 'alex@codex.ai',
    password: 'Password123!',
    profile: {
      bio: 'Senior Full Stack Developer passionate about React, Node.js, and System Architecture.',
      experience_years: 3,
      target_role: 'Senior Full Stack Engineer',
      target_companies: ['Google', 'Meta', 'Stripe'],
      preferred_interview_type: 'mixed',
      skills: [
        { name: 'React.js', level: 'advanced' },
        { name: 'Node.js', level: 'advanced' },
        { name: 'System Design', level: 'intermediate' },
        { name: 'Data Structures', level: 'intermediate' },
        { name: 'Tailwind CSS', level: 'expert' }
      ]
    }
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@codex.ai',
    password: 'Password123!',
    profile: {
      bio: 'Frontend Engineer focused on accessible UI/UX, state management, and web performance.',
      experience_years: 2,
      target_role: 'Frontend Software Engineer',
      target_companies: ['Airbnb', 'Vercel', 'Figma'],
      preferred_interview_type: 'technical',
      skills: [
        { name: 'React.js', level: 'advanced' },
        { name: 'JavaScript (ES6+)', level: 'expert' },
        { name: 'TypeScript', level: 'intermediate' },
        { name: 'CSS Architecture', level: 'advanced' },
        { name: 'GraphQL', level: 'beginner' }
      ]
    }
  }
];

(async () => {
  console.log('🌱 Seeding 2 Demo Users into Supabase...\n');

  for (const u of demoUsers) {
    // 1. Check if existing
    let { data: existingUser } = await supabase.from('users').select('id, email').eq('email', u.email).maybeSingle();
    let userId;

    if (existingUser) {
      console.log(`ℹ️  User '${u.email}' already exists. Updating password & profile...`);
      userId = existingUser.id;
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      await supabase.from('users').update({ name: u.name, password: hashedPassword, is_active: true }).eq('id', userId);
    } else {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({ name: u.name, email: u.email, password: hashedPassword, is_active: true, is_email_verified: true })
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create user '${u.email}':`, error.message);
        continue;
      }
      userId = newUser.id;
      console.log(`✅ Created User: ${u.name} (${u.email}) [ID: ${userId}]`);
    }

    // 2. Create/Update Profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: userId,
      ...u.profile
    }, { onConflict: 'user_id' });

    if (profileError) {
      console.error(`⚠️  Failed to set profile for '${u.email}':`, profileError.message);
    } else {
      console.log(`✅ Configured Profile for: ${u.name}`);
    }

    // 3. Create Sample Completed Interview for Demo User
    const { data: sampleInterview } = await supabase.from('interviews').insert({
      candidate_id: userId,
      title: `${u.profile.target_role} Sprint`,
      type: 'technical',
      difficulty: 'medium',
      domain: 'React.js & Architecture',
      duration_minutes: 30,
      total_questions: 3,
      status: 'completed',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      ended_at: new Date().toISOString()
    }).select().single();

    if (sampleInterview) {
      // Create Result record
      await supabase.from('results').upsert({
        interview_id: sampleInterview.id,
        candidate_id: userId,
        total_score: u.email.includes('alex') ? 88.0 : 92.5,
        grade: u.email.includes('alex') ? 'A' : 'A+',
        passed: true,
        questions_attempted: 3,
        questions_correct: 3,
        total_time_taken_seconds: 1250,
        category_breakdown: [
          { category: 'Technical Depth', score: 9.0, maxScore: 10 },
          { category: 'Communication', score: 8.5, maxScore: 10 },
          { category: 'Problem Solving', score: 9.2, maxScore: 10 }
        ]
      }, { onConflict: 'interview_id' });

      console.log(`✅ Added Sample Interview & Result for: ${u.name}`);
    }
  }

  console.log('\n🎉 DEMO USERS SEEDED SUCCESSFULLY!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 DEMO USER 1:');
  console.log('   Email    : alex@codex.ai');
  console.log('   Password : Password123!');
  console.log('');
  console.log('👤 DEMO USER 2:');
  console.log('   Email    : sarah@codex.ai');
  console.log('   Password : Password123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
})();
