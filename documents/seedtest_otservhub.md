-- ==============================================================================
-- SEED DATA - OTSERVHUB (DADOS FICTÍCIOS PARA TESTE)
-- Execute este script no SQL Editor do Supabase após criar o Schema.
-- ==============================================================================

-- 1. CRIAR USUÁRIOS FICTÍCIOS (Simulando auth.users)
-- Nota: Em produção, usuários vêm do Auth. Aqui inserimos direto em profiles para teste de UI.
-- Para funcionar, você pode precisar desabilitar temporariamente a FK de auth.users ou criar users reais.
-- Vamos assumir que inserimos apenas em 'profiles' para popular a UI, mas o ideal é criar users no Auth painel.

insert into public.profiles (id, username, avatar_url)
values 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'AdminUser', 'https://i.pravatar.cc/150?u=admin'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'BaiakKing', 'https://i.pravatar.cc/150?u=baiak'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'GlobalLover', 'https://i.pravatar.cc/150?u=global');

-- 2. CRIAR SERVIDORES
insert into public.servers 
(id, owner_id, name, slug, ip_address, version, map_type, launch_date, is_verified, is_online, online_count, description)
values
-- Servidor 1: Vai Lançar (Hype alto)
(
  uuid_generate_v4(), 
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 
  'Baiak Wars 24h', 
  'baiak-wars-24h', 
  'go.baiakwars.com', 
  '8.60', 
  'Baiak', 
  now() + interval '2 days', -- Lança em 2 dias
  true, 
  false, 
  0, 
  'O melhor Baiak do Brasil com eventos diários e Castle 24h!'
),
-- Servidor 2: Online Agora (Top Server)
(
  uuid_generate_v4(), 
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 
  'Aura Global', 
  'aura-global', 
  'aura-global.net', 
  '12.80', 
  'Global', 
  now() - interval '30 days', -- Lançou mês passado
  true, 
  true, 
  452, -- 452 Players online
  'Servidor Global Full RL Map com Client Próprio e zero lag.'
),
-- Servidor 3: Não Verificado (Teste)
(
  uuid_generate_v4(), 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
  'Teste Server Local', 
  'teste-server', 
  '127.0.0.1', 
  '13.10', 
  'Custom', 
  now() + interval '5 days', 
  false, 
  false, 
  0, 
  'Servidor em fase de testes.'
);

-- 3. CRIAR INVENTÁRIO DE ADS (SLOTS)
insert into public.ad_slots (name, position_code, price, dimensions)
values
  ('Hero Banner - Home', 'HOME_HERO', 150.00, '1200x400'),
  ('Sidebar - Top Destaque', 'SIDEBAR_TOP', 80.00, '300x250'),
  ('Destaque Categoria Baiak', 'CAT_BAIAK_SPOTLIGHT', 50.00, 'Card Highlight');

-- 4. SIMULAR HYPES (VOTOS)
-- Vamos pegar o ID do Servidor 1 (Vai Lançar) dinamicamente seria melhor, mas para seed usaremos subquery
insert into public.hypes (user_id, server_id, interaction_type)
select 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', id, 'GOING' 
from public.servers where slug = 'baiak-wars-24h';

insert into public.hypes (user_id, server_id, interaction_type)
select 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', id, 'WAITING' 
from public.servers where slug = 'baiak-wars-24h';

-- O trigger 'update_hype_score' deve rodar automaticamente e atualizar o score do servidor 'Baiak Wars'.