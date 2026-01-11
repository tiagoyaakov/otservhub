Relatório de Inteligência e Definição Estratégica: OtservHub

1. O Veredito Executivo

A lista Otservlist.org continua sendo o principal diretório de servidores Open Tibia (OTServer), mas é vista pela comunidade como um monopólio desatualizado e mercenário. O projeto mantém tecnologias da década passada (PHP, jQuery 1.4.3) e infraestrutura simples, confiando fortemente na Cloudflare. Esses aspectos deixam lacunas de segurança e atrapalham a inovação. Ao mesmo tempo, a lista coleta dados sensíveis (IPs dos jogadores) sem transparência e utiliza um modelo de monetização “pague para subir”, criando conflitos de interesse e desconfiança.

Para a criação do OtservHub, esse contexto sugere oportunidades claras:

Fornecer uma experiência moderna com UI/UX atualizada, filtragem avançada e cadastros sociais.

Transparência na coleta de dados, tratamento de privacidade e métricas de hype para servidores.

Combater as práticas de spoofing e multi‑cliente por meio de validações abertas e auditorias.

Posicionar-se como alternativa confiável, aproveitando o descontentamento da comunidade.

2. Raio‑X Técnico & Infraestrutura (Concorrente: Otservlist)

Stack Real

Tecnologias: PHP legado, jQuery 1.4.3 (2010), HTML estático. Alto débito técnico e risco de XSS/CSRF.

Infraestrutura: Cloudflare para CDN/DDoS. Domínio registrado em 2005.

Coleta de Dados: Exige envio de IPs de jogadores para calcular "players únicos", levantando sérios riscos de privacidade e compliance (GDPR/LGPD).

Pontos de Falha

Dependência Centralizada: Operação focada em um único mantenedor (Xinn).

Monetização Viciada: Venda de "pontos extras" e contagem regressiva corrompem o ranking orgânico.

Ausência de API: Obriga o uso de scrapers, sobrecarregando o sistema.

3. O Pulso da Comunidade

Sentimento: 2/10 (Desfavorável).

Queixas Principais: Spoofing (números falsos), design arcaico (15 anos sem update), censura arbitrária e modelo "Pay-to-Win".

Oportunidade: A comunidade clama por modernização (reviews, busca avançada, login social).

4. Matriz de Vulnerabilidade

A dependência de tecnologia obsoleta e a coleta obscura de dados são os maiores vetores de risco do concorrente. O OtservHub deve mitigar isso utilizando stacks modernas (Next.js, Supabase) e transparência total.

5. Planejamento Estratégico OtservHub: Escopo e Funcionalidades

Com base na análise de inteligência e nas diretrizes de negócio, definimos abaixo o escopo do projeto, separando estritamente o que compõe o Produto Mínimo Viável (MVP) do que será desenvolvido em versões futuras.

5.1. Estratégia de Monetização (MVP vs. Futuro)

No MVP (Lançamento):
A monetização será simplificada e direta, focada na venda de espaços de destaque pré-definidos.

Modelo: Venda de posições estáticas de destaque na Home e no topo das listas de categorias.

Precificação: Tabelada (Flat fee). Cada local terá um valor fixo baseado em sua visibilidade e importância (ex: Banner Hero, Destaque Gold, Destaque Silver).

Justificativa: Reduz a complexidade de desenvolvimento inicial e oferece previsibilidade de receita.

Pós-MVP (Roadmap):

Sistema de Leilão (Bidding): A lógica de leilão para disputar posições (quem paga mais aparece mais alto ou em melhores locais) será implementada apenas em uma segunda fase, quando houver volume suficiente de servidores concorrendo por espaço.

5.2. Funcionalidades de Comunidade e Guildas

No MVP (Lançamento):

O foco será exclusivamente na listagem e descoberta de Servidores.

Funcionalidades sociais básicas (comentários/reviews validados).

Pós-MVP (Roadmap):

Guild Recruitment (Recrutamento de Guildas): O sistema dedicado para guildas buscarem membros ou jogadores buscarem times fica fora do escopo inicial.

Funcionalidades Sociais Avançadas: Ferramentas complexas de interação entre usuários (detalhadas anteriormente como item 5.2) ficam para o futuro.

5.3. Publicidade e Sponsors

No MVP (Lançamento):

Publicidade Nativa: Utilizaremos espaços estratégicos no layout do site desenhados especificamente para anúncios de servidores.

Restrição: Não utilizaremos redes de anúncios genéricos (Google AdSense, etc.) ou sponsors não-nativos nesta fase. O foco é manter a identidade visual limpa e endêmica à comunidade de Tibia/OT.

6. Integrações e Notificações

6.1. Webhooks e Automação

No MVP (Lançamento):

O sistema não contará com disparos automáticos de Webhooks para terceiros.

Pós-MVP (Roadmap):

Webhooks de Notificação (Item 6.4): A funcionalidade para notificar donos de servidores ou comunidades no Discord/Slack sobre alterações de status (Server Offline/Online) ou mudanças de ranking será desenvolvida posteriormente.

7. Itens Despriorizados (Backlog)

(O item 7 mencionado anteriormente foi removido do escopo de análise atual por não ser pertinente ao lançamento).

8. Próximos Passos Técnicos

Para viabilizar este MVP com a segurança que falta ao concorrente, a stack recomendada é:

Frontend: Next.js + Tailwind CSS (Moderna, rápida, responsiva).

Backend/Database: Supabase ou Node.js + PostgreSQL (Segurança de dados e escalabilidade).

Segurança: Implementação de validação de IP robusta (sem armazenar dados brutos desnecessariamente) e proteção contra bots na camada de aplicação (ex: Cloudflare Turnstile).

Este plano garante um lançamento mais rápido (Time-to-Market), focado no diferencial central (uma lista confiável e bonita) e com um modelo de receita claro e simples de gerir.