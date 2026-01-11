-- ==============================================================================
-- SCHEMA DE BANCO DE DADOS - OTSERVHUB (MVP)
-- Plataforma: Supabase (PostgreSQL)
-- Versão: 1.2
-- ==============================================================================

-- 1. HABILITAR EXTENSÕES NECESSÁRIAS
-- Gera UUIDs randômicos para chaves primárias
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. DEFINIÇÃO DE TIPOS (ENUMS)
-- Garante integridade nos valores permitidos
-- ==============================================================================

-- Tipos de interação de Hype
create type hype_type as enum ('WAITING', 'GOING', 'MAYBE');

-- Tipos de mundo do Tibia
create type server_pvp_type as enum ('PVP', 'NO_PVP', 'PVP_ENFORCED', 'RETRO_PVP');

-- Status do pagamento do patrocínio
create type payment_status_type as enum ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- Status do agendamento do patrocínio
create type sponsorship_status_type as enum ('SCHEDULED', 'ACTIVE', 'EXPIRED');

-- ==============================================================================
-- 3. TABELAS PRINCIPAIS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Tabela: PROFILES
-- Sincronizada automaticamente com auth.users via Trigger
-- ------------------------------------------------------------------------------
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  is_admin boolean default false, -- Role simples para MVP
  tos_accepted_at timestamp with time zone, -- Compliance Jurídico
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- ------------------------------------------------------------------------------
-- Tabela: GAME_VERSIONS (Domínio)
-- Padronização da lista de versões do Tibia
-- ------------------------------------------------------------------------------
create table public.game_versions (
  id serial primary key,
  value text unique not null, -- Ex: "8.60", "12.0"
  label text not null, -- Ex: "8.60 - The Forgotten Server"
  display_order int default 0
);

-- ------------------------------------------------------------------------------
-- Tabela: SERVERS
-- O coração da plataforma. Contém dados estáticos (cadastro) e dinâmicos (ping/status).
-- ------------------------------------------------------------------------------
create table public.servers (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) not null, -- Dono do servidor
  
  -- Identificação e SEO
  name text not null,
  slug text not null unique, -- URL amigável (ex: baiak-wars-2)
  
  -- Conexão
  ip_address text not null,
  port int default 7171,
  version_id int references public.game_versions(id) not null, -- FK Obrigatória
  client_link text, -- External Link Only. Hospedagem de .exe proibida
  website_url text,
  
  -- Detalhes do Jogo
  description text,
  map_type text, -- Ex: "Global", "Baiak", "Custom"
  pvp_type server_pvp_type default 'PVP',
  exp_rate text, -- Texto livre para exibir "500x" ou "Stages"
  
  -- Lançamento e Hype
  launch_date timestamp with time zone not null,
  hype_score int default 0, -- Calculado via Trigger
  
  -- Verificação e Segurança
  verification_token text default uuid_generate_v4()::text, -- Token para colocar no MOTD/Site
  is_verified boolean default false, -- Se true, aparece nas listas públicas
  
  -- Status em Tempo Real (Atualizado via Cron Job / Edge Function)
  is_online boolean default false,
  online_count int default 0,
  max_players int default 0,
  last_ping timestamp with time zone default now(),
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ------------------------------------------------------------------------------
-- Tabela: HYPES
-- Registra a intenção do usuário em jogar. Um usuário = Um voto por servidor.
-- ------------------------------------------------------------------------------
create table public.hypes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  server_id uuid references public.servers(id) on delete cascade not null,
  interaction_type hype_type not null,
  created_at timestamp with time zone default now(),
  
  -- Garante que o usuário só pode dar 1 hype por servidor
  constraint unique_user_server_hype unique (user_id, server_id)
);

-- ------------------------------------------------------------------------------
-- Tabela: AD_SLOTS (INVENTÁRIO)
-- Define os espaços publicitários disponíveis no site (Dashboard Self-Service).
-- ------------------------------------------------------------------------------
create table public.ad_slots (
  id serial primary key,
  name text not null, -- Ex: "Hero Banner - Home"
  position_code text unique not null, -- Código interno: "HOME_HERO", "SIDEBAR_TOP"
  price decimal(10,2) not null, -- Preço fixo no MVP
  duration_days int not null default 7, -- Quanto tempo dura o anúncio
  dimensions text, -- Ex: "1920x400"
  is_active boolean default true -- Se o slot está disponível para venda
);

-- ------------------------------------------------------------------------------
-- Tabela: SPONSORSHIPS (COMPRAS)
-- Registra a compra e agendamento de um slot.
-- ------------------------------------------------------------------------------
create table public.sponsorships (
  id uuid default uuid_generate_v4() primary key,
  server_id uuid references public.servers(id) on delete cascade not null,
  slot_id int references public.ad_slots(id) not null,
  buyer_id uuid references public.profiles(id) not null, -- Quem comprou
  
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  
  banner_url text, -- URL da imagem no Storage
  
  status sponsorship_status_type default 'SCHEDULED',
  payment_status payment_status_type default 'PENDING',
  
  created_at timestamp with time zone default now(),
  
  -- Evita sobreposição de datas no mesmo slot (Regra de Negócio Crítica)
  -- Evita sobreposição de datas no mesmo slot (Regra de Negócio Crítica)
  -- Nota: No PostgreSQL puro faríamos uma EXCLUDE constraint, mas para manter compatibilidade simples com Supabase UI,
  -- validaremos disponibilidade via função RPC antes de inserir.
  constraint valid_dates check (end_date > start_date)

  -- REGRAS DE NEGÓCIO (Aplicar via Edge Function / Application Logic):
  -- 1. Max Purchase Duration: Máximo 4 semanas (28 dias) por transação.
  -- 2. Scarcity Horizon: Não permitir compras com start_date > 6 meses no futuro.
  -- 3. First-Come-First-Serve: Não existe reserva. O primeiro a pagar (PENDING -> PAID) leva.
  -- 4. Cool-down (Opcional v2): Impedir que o mesmo server_id ocupe o mesmo slot por > 2 ciclos consecutivos se houver demanda.
);

-- ------------------------------------------------------------------------------
-- Tabela: REPORTS (Moderação)
-- Denúncias de usuários sobre servidores
-- ------------------------------------------------------------------------------
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  server_id uuid references public.servers(id) not null,
  reporter_id uuid references public.profiles(id) not null,
  reason text not null, -- Ex: "SCAM", "OFFLINE_FAKE", "IMPROPER_CONTENT"
  details text,
  status text default 'PENDING', -- PENDING, RESOLVED, DISMISSED
  created_at timestamp with time zone default now()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) - POLÍTICAS DE SEGURANÇA
-- ==============================================================================

-- Habilita RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.servers enable row level security;
alter table public.hypes enable row level security;
alter table public.ad_slots enable row level security;
alter table public.sponsorships enable row level security;

-- --- POLÍTICAS: PROFILES ---
create policy "Perfis são públicos para leitura" 
  on public.profiles for select using (true);

create policy "Usuários podem editar seu próprio perfil" 
  on public.profiles for update using (auth.uid() = id);

-- --- POLÍTICAS: SERVERS ---
create policy "Servidores verificados são públicos" 
  on public.servers for select 
  using (is_verified = true);

create policy "Dono vê seus servidores (mesmo não verificados)" 
  on public.servers for select 
  using (auth.uid() = owner_id);

create policy "Usuários autenticados podem criar servidores" 
  on public.servers for insert 
  with check (auth.uid() = owner_id);

create policy "Dono pode atualizar seu servidor" 
  on public.servers for update 
  using (auth.uid() = owner_id);

create policy "Dono pode deletar seu servidor" 
  on public.servers for delete 
  using (auth.uid() = owner_id);

-- --- POLÍTICAS: HYPES ---
create policy "Hypes são públicos para leitura" 
  on public.hypes for select using (true);

create policy "Usuário pode criar hype (um por server)" 
  on public.hypes for insert 
  with check (auth.uid() = user_id);

create policy "Usuário pode alterar seu hype" 
  on public.hypes for update 
  using (auth.uid() = user_id);

create policy "Usuário pode remover seu hype" 
  on public.hypes for delete 
  using (auth.uid() = user_id);

-- --- POLÍTICAS: AD_SLOTS ---
create policy "Slots são públicos para leitura" 
  on public.ad_slots for select using (true);

-- Apenas Admins podem criar/editar slots (Requer role de admin ou check direto no email, simplificado aqui para false)
create policy "Apenas admin edita slots" 
  on public.ad_slots for all 
  using (false); -- Defina sua lógica de admin aqui posteriormente

-- --- POLÍTICAS: SPONSORSHIPS ---
create policy "Público vê patrocínios ativos (para exibir no site)" 
  on public.sponsorships for select 
  using (status = 'ACTIVE' and payment_status = 'PAID');

create policy "Dono vê seus próprios patrocínios (histórico)" 
  on public.sponsorships for select 
  using (auth.uid() = buyer_id);

create policy "Dono pode criar pedido de patrocínio" 
  on public.sponsorships for insert 
  with check (auth.uid() = buyer_id);

-- ==============================================================================
-- 5. FUNÇÕES E TRIGGERS (AUTOMAÇÃO)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Função: handle_new_user
-- Cria um perfil na tabela public.profiles assim que um usuário se cadastra no Auth
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name', -- Pega do Google/Discord metadata
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para disparar a função acima
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ------------------------------------------------------------------------------
-- Função: calculate_hype_score
-- Recalcula o hype_score na tabela SERVERS sempre que um HYPE é adicionado/removido.
-- Peso: GOING = 3 pontos, WAITING = 2 pontos, MAYBE = 1 ponto.
-- ------------------------------------------------------------------------------
create or replace function public.update_hype_score()
returns trigger as $$
declare
  server_id_target uuid;
  new_score int;
begin
  -- Determina qual servidor foi afetado
  if (TG_OP = 'DELETE') then
    server_id_target := OLD.server_id;
  else
    server_id_target := NEW.server_id;
  end if;

  -- SOMA APENAS INTERAÇÕES DOS ÚLTIMOS 30 DIAS (Decaimento Temporal)
  select coalesce(sum(
    case 
      when interaction_type = 'GOING' then 3
      when interaction_type = 'WAITING' then 2
      else 1 
    end
  ), 0)
  into new_score
  from public.hypes
  where server_id = server_id_target
    and created_at > (now() - interval '30 days'); -- Votos antigos expiram

  -- Atualiza tabela servers
  update public.servers
  set hype_score = new_score
  where id = server_id_target;

  return null;
end;
$$ language plpgsql security definer;

-- Trigger para Hypes
create trigger trigger_update_hype
  after insert or update or delete on public.hypes
  for each row execute procedure public.update_hype_score();


-- ------------------------------------------------------------------------------
-- Função: check_hype_limit
-- Garante escassez de Hype: GOING (Max 3), WAITING (Max 5), MAYBE (Ilimitado)
-- ------------------------------------------------------------------------------
create or replace function public.check_hype_limit()
returns trigger as $$
declare
  current_count int;
  max_limit int;
begin
  if NEW.interaction_type = 'GOING' then
    max_limit := 3;
  elsif NEW.interaction_type = 'WAITING' then
    max_limit := 5;
  else
    return NEW; -- 'MAYBE' é ilimitado
  end if;

  select count(*) into current_count
  from public.hypes
  where user_id = NEW.user_id 
    and interaction_type = NEW.interaction_type;

  if current_count >= max_limit then
    raise exception 'Limite atingido! Você só pode marcar "%" em % servidores.', 
      NEW.interaction_type, max_limit;
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger trigger_check_hype_limit
  before insert on public.hypes
  for each row execute procedure public.check_hype_limit();


-- ------------------------------------------------------------------------------
-- Função: auto_revoke_verification
-- Segurança: Se o IP ou Site mudar, remove o selo de verificação imediatamente.
-- ------------------------------------------------------------------------------
create or replace function public.auto_revoke_verification()
returns trigger as $$
begin
  if (NEW.ip_address <> OLD.ip_address) or (NEW.website_url <> OLD.website_url) then
    NEW.is_verified := false;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_critical_server_update
  before update on public.servers
  for each row
  execute procedure public.auto_revoke_verification();


-- ------------------------------------------------------------------------------
-- Função RPC: check_slot_availability
-- Usada pelo Frontend para verificar se um Slot está livre numa data.
-- Retorna TRUE se disponível, FALSE se ocupado.
-- ------------------------------------------------------------------------------
create or replace function check_slot_availability(
  p_slot_id int,
  p_start_date timestamp with time zone,
  p_end_date timestamp with time zone
)
returns boolean as $$
declare
  overlap_count int;
begin
  select count(*)
  into overlap_count
  from public.sponsorships
  where slot_id = p_slot_id
    and status in ('ACTIVE', 'SCHEDULED')
    and payment_status in ('PAID', 'PENDING') -- Considera pendentes para evitar race condition na compra
    and (start_date, end_date) overlaps (p_start_date, p_end_date);
    
  return overlap_count = 0;
end;
$$ language plpgsql;

-- ==============================================================================
-- 6. ÍNDICES (PERFORMANCE)
-- ==============================================================================

-- Busca rápida por slug (usado nas páginas de detalhes)
create index idx_servers_slug on public.servers(slug);

-- Ordenação da Home (Lançamentos e Hype)
create index idx_servers_launch_date on public.servers(launch_date);
create index idx_servers_hype_score on public.servers(hype_score desc);
create index idx_servers_verified_online on public.servers(is_verified, is_online);

-- Busca rápida de patrocínios ativos
create index idx_sponsorships_active on public.sponsorships(slot_id, start_date, end_date) 
where status = 'ACTIVE';