create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  role text not null default 'member' check (role in ('member', 'coordinator', 'admin')),
  department text,
  avatar_url text,
  skills text not null default '[]',
  total_xp integer not null default 0 check (total_xp >= 0),
  current_level text not null default 'Newcomer',
  portfolio_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  base_xp integer not null check (base_xp >= 0),
  color_hex varchar(7) not null check (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  is_active boolean not null default true
);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  title varchar(150) not null,
  description text not null,
  project_event_name varchar(100) not null,
  evidence_type text not null check (evidence_type in ('url', 'file', 'github')),
  evidence_url text not null,
  status text not null default 'pending' check (status in ('draft', 'pending', 'verified', 'rejected', 'clarification')),
  points_awarded integer not null default 0 check (points_awarded >= 0),
  reviewer_id uuid references public.users(id),
  reviewer_notes text,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create table if not exists public.clarification_messages (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.contributions(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null,
  description text not null,
  icon_key varchar(50) not null,
  criteria_type text not null check (criteria_type in ('xp_threshold', 'count_category', 'streak')),
  criteria_threshold integer not null check (criteria_threshold >= 0),
  unique (name)
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.users(id) on delete cascade,
  action varchar(50) not null,
  target_entity varchar(50) not null,
  target_id uuid,
  payload text,
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx on public.users(role);
create index if not exists contributions_user_id_idx on public.contributions(user_id);
create index if not exists contributions_category_id_idx on public.contributions(category_id);
create index if not exists contributions_status_idx on public.contributions(status);
create index if not exists contributions_created_at_idx on public.contributions(created_at desc);
create index if not exists clarification_messages_contribution_id_idx on public.clarification_messages(contribution_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.contributions enable row level security;
alter table public.clarification_messages enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.audit_logs enable row level security;

insert into public.categories (name, base_xp, color_hex) values
  ('Technical', 30, '#6366F1'),
  ('Design', 15, '#EC4899'),
  ('Event', 40, '#F59E0B'),
  ('Marketing', 15, '#10B981'),
  ('Mentoring', 20, '#8B5CF6'),
  ('Leadership', 50, '#EF4444'),
  ('Sponsorship', 40, '#06B6D4'),
  ('Media', 20, '#3B82F6')
on conflict (name) do update set base_xp = excluded.base_xp, color_hex = excluded.color_hex;

insert into public.badges (name, description, icon_key, criteria_type, criteria_threshold) values
  ('First Steps', 'Submitted and verified your first contribution!', 'award', 'xp_threshold', 10),
  ('Code Contributor', 'Pushed verified technical code or PR to the club repository.', 'code', 'count_category', 1),
  ('Event Architect', 'Successfully lead or organized a campus event.', 'calendar', 'count_category', 1),
  ('Century Club', 'Crossed the 100 Total XP contribution milestone.', 'zap', 'xp_threshold', 100),
  ('Core Member', 'Achieved Tier 4 Core Member standing in the club.', 'shield-check', 'xp_threshold', 300)
on conflict (name) do update set
  description = excluded.description,
  icon_key = excluded.icon_key,
  criteria_type = excluded.criteria_type,
  criteria_threshold = excluded.criteria_threshold;