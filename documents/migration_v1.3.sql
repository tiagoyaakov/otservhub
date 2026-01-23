-- ==============================================================================
-- MIGRATION V1.3 - SERVER REGISTRATION UPDATES
-- ==============================================================================

-- 1. Update SERVERS table with new columns
alter table public.servers
  add column if not exists download_link text,
  add column if not exists theme text, -- "Pokemon", "Naruto", "Dragonball", "Tibia" or Custom
  add column if not exists custom_version text,
  add column if not exists custom_map_type text, -- For "Other" map types
  add column if not exists is_release_date_tba boolean default false,
  add column if not exists discord_invite_link text,
  add column if not exists whatsapp_group_link text,
  add column if not exists timezone text default 'UTC',
  alter column version_id drop not null; -- Allow null if using custom version

-- 2. Create SYSTEMS table (for tagging)
create table if not exists public.systems (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  is_custom boolean default false,
  is_approved boolean default true, -- Admin approval for custom tags
  created_at timestamp with time zone default now()
);

-- 3. Create SERVER_SYSTEMS junction table
create table if not exists public.server_systems (
  server_id uuid references public.servers(id) on delete cascade not null,
  system_id uuid references public.systems(id) on delete cascade not null,
  primary key (server_id, system_id)
);

-- 4. RLS Policies for new tables

-- SYSTEMS policies
alter table public.systems enable row level security;

create policy "Systems are readable by everyone"
  on public.systems for select using (true);

create policy "Authenticated users can create custom systems"
  on public.systems for insert
  with check (auth.role() = 'authenticated');

-- SERVER_SYSTEMS policies
alter table public.server_systems enable row level security;

create policy "Server systems are readable by everyone"
  on public.server_systems for select using (true);

create policy "Server owners can manage their systems"
  on public.server_systems for all
  using (
    exists (
      select 1 from public.servers
      where id = server_systems.server_id
      and owner_id = auth.uid()
    )
  );

create policy "Server owners can link systems on creation"
  on public.server_systems for insert
  with check (
    exists (
      select 1 from public.servers
      where id = server_systems.server_id
      and owner_id = auth.uid()
    )
  );

-- Populate initial standard systems
insert into public.systems (name, is_custom, is_approved) values
  ('Quest System', false, true),
  ('Task System', false, true),
  ('Cast System', false, true),
  ('Auto Loot', false, true),
  ('VIP System', false, true),
  ('Imbuement', false, true),
  ('Prey System', false, true),
  ('Events', false, true),
  ('War System', false, true),
  ('Guild System', false, true),
  ('Dungeons', false, true),
  ('Daily Reward', false, true),
  ('Bestiary', false, true)
on conflict (name) do nothing;
