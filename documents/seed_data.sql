-- ==============================================================================
-- SEED DATA - OTSERVHUB
-- Dados iniciais para popular o banco de dados
-- ==============================================================================

-- 1. Versões do Tibia (Game Versions)
INSERT INTO public.game_versions (value, label, display_order) VALUES
('7.4', '7.4 - Old School', 10),
('7.6', '7.6 - The Legend', 20),
('7.72', '7.72 - Realots Style', 30),
('8.0', '8.0 - Arizon', 40),
('8.60', '8.60 - The King (Baiak)', 50),
('10.98', '10.98 - Modern', 60),
('12.x', '12.x - Falcon/Cobra', 70),
('13.x', '13.x - Soul War / Gnomprona', 80),
('custom', 'Custom Client / Sprite', 99)
ON CONFLICT (value) DO NOTHING;

-- 2. Slots de Publicidade (Ad Slots)
-- Preços simbólicos para MVP
INSERT INTO public.ad_slots (name, position_code, price, duration_days, dimensions, is_active) VALUES
('Hero Banner - Home', 'HOME_HERO', 150.00, 7, '1200x400', true),
('Sidebar Top', 'SIDEBAR_TOP', 80.00, 7, '300x250', true),
('Spotlight Card 1', 'HOME_SPOTLIGHT_1', 100.00, 7, 'Card Highlight', true),
('Spotlight Card 2', 'HOME_SPOTLIGHT_2', 100.00, 7, 'Card Highlight', true),
('Spotlight Card 3', 'HOME_SPOTLIGHT_3', 100.00, 7, 'Card Highlight', true)
ON CONFLICT (position_code) DO NOTHING;

-- 3. Inserir um Servidor de Exemplo (Opcional - Requer um user_id válido, então deixarei comentado)
-- Para testar visualização, crie um usuário primeiro e depois descomente/ajuste o ID.
/*
INSERT INTO public.servers (owner_id, name, slug, ip_address, version_id, launch_date, is_verified, is_online, online_count)
VALUES 
('SEU_UUID_AQUI', 'Baiak Wars Legend', 'baiak-wars-legend', 'go.baiakwars.com', 5, now() + interval '2 days', true, true, 450);
*/
