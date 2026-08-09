-- Run this single statement in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pxgquqnwgmksbdbuccth/sql/new

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

select 'Row Level Security disabled for backend API access! ✅' as status;
