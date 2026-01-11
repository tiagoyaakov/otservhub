Relatório de Inteligência sobre Otservlist.org e a comunidade OTServer
1. O veredito executivo

A lista Otservlist.org continua sendo o principal diretório de servidores Open Tibia (OTServer), mas é vista pela comunidade como um monopólio desatualizado e mercenário. O projeto mantém tecnologias da década passada (PHP, jQuery 1.4.3) e infraestrutura simples, confiando fortemente na Cloudflare. Esses aspectos deixam lacunas de segurança e atrapalham a inovação. Ao mesmo tempo, a lista coleta dados sensíveis (IPs dos jogadores) sem transparência e utiliza um modelo de monetização “pague para subir”, criando conflitos de interesse e desconfiança. Apesar da reputação negativa, a base de utilizadores e a autoridade do domínio ainda são valiosas.

Para a criação de OtservHub, esse contexto sugere oportunidades claras:

Fornecer uma experiência moderna com UI/UX atualizada, filtragem avançada e cadastros sociais.

Transparência na coleta de dados, tratamento de privacidade e métricas de hype para servidores.

Combater as práticas de spoofing e multi‑cliente por meio de validações abertas e auditorias de servidores.

Posicionar-se como alternativa confiável à Otservlist, aproveitando o descontentamento da comunidade.

2. Raio‑X técnico & infraestrutura
Stack real

Tecnologias da web – O site otservlist.org utiliza PHP para renderização server-side; folhas de estilo e scripts são servidos via arquivos .css.php e .js.php. O frontend usa jQuery 1.4.3 (lançada em 2010) e estático HTML com poucos recursos modernos. Esse uso de versões antigas indica débito técnico e possíveis vulnerabilidades conhecidas (XSS, CSRF).

Hospedagem e DNS – O domínio otservlist.org é registrado via Key‑Systems GmbH, protegido por Whois privacy e usa nameservers da Cloudflare (ivan.ns.cloudflare.com e ruth.ns.cloudflare.com) com data de registro em 2005 e renovação até 2026. A Cloudflare provê CDN e mitigação de DDoS, mas também impede a obtenção de cabeçalhos de servidor (retorna 403).

Coleta de dados – Nos detalhes de servidor, a lista exibe métricas como “unique players” e “multi‑clients”; isso significa que os administradores enviam IP addresses dos jogadores para calcular números únicos. Políticas de privacidade de servidores OT relatam que compartilham nome do personagem e IP com Otservlist para marketing e para comprovar números. A coleta de IPs é feita sem transparência sobre armazenamento ou uso futuro, levantando preocupações de proteção de dados.

Pontos de falha técnica

Dependência de um único mantenedor – A propriedade e operação parecem centralizadas em uma pessoa (conhecida como Xinn). Ataques pessoais, inatividade ou decisões arbitrárias de Xinn já impactaram a lista no passado.

Bibliotecas obsoletas – o uso de jQuery 1.4.3 e PHP sem framework moderno deixa o site suscetível a vulnerabilidades conhecidas. Scripts de terceiros (links para jquery.chaosdl.js) podem estar desatualizados.

Práticas de monetização que alteram ranking – Clientes podem comprar destaques (caixa amarela, featured server) e pontos extras na lista; o anúncio de “countdown” custa €90/dia e dá prioridade total. Essa mistura de ranqueamento pago com ranqueamento orgânico cria incentivos para abuso e corrupção das métricas.

Coleta de dados centralizada – A verificação de jogadores únicos exige o envio de logs IP do servidor para o proprietário. A comunidade teme que esses logs possam ser comercializados ou vazados.

Ausência de API pública – Não há API oficial documentada; projetos de terceiros tentam extrair dados via scraping (p.ex. otservlist-scraping) devido à falta de endpoints formais, o que provoca carga desnecessária no servidor e riscos de bloqueio.

Repositórios relacionados e concorrentes

Alternativas no GitHub – O repositório Johncorex/otservlistbr é um clone brasileiro construído com o framework Meteor e tem como objetivo promover servidores pequenos e de alta qualidade, além de verificar contagem real de jogadores.

OTArchive/OT-Server-List – projeto que reúne servidores e jogadores e serve como arquivo histórico.

Scripts de usuários – A comunidade criou melhorias como o script Better otservlist.org no Greasy Fork para filtrar, ordenar e esconder anúncios, evidenciando carência de recursos no site oficial.

Concorrente ativo (ots-list.org) – Esse site mostra milhares de jogadores e possui seção starting soon com mais informações sobre servers. Ele prova que existe demanda por alternativas mais modernas.

3. O pulso da comunidade (real vs. artificial)
Sentimento geral: 2/10 (desfavorável)

A maior parte dos tópicos em fóruns como OTLand expressa forte insatisfação com a Otservlist. Usuários chamam o site de “scam”, “máfia” e “desatualizado”. Muitos relatam que servidores com poucos jogadores exibem centenas de players online graças a multi‑clientes e bots. Outros apontam que o site não mudou em 15 anos e que o dono lucra com destaques pagos enquanto mantém algoritmos obscuros.

Principais queixas com evidências
Queixa  Evidência
Spoofing e multi‑cliente  Posts acusam servidores de inflar números com trainers; a contagem real seria 10 vezes menor. Regras da lista exigem limitar multi‑clients, mas moderadores não conseguem fiscalizar todos.
Monopólio e visual desatualizado  Usuários reclamam que a lista não mudou em 15 anos, tem design ruim e é a única opção porque “sempre foi assim”.
Censura e abuso Servidores foram banidos sem explicação; um proprietário relatou que doou para destacar o servidor e mesmo assim foi banido de forma arbitrária.
Coleta de IP e falta de transparência Tópicos recentes revelam que, para calcular jogadores únicos, a Otservlist exige logs com endereço IP de cada jogador; membros temem que esses dados sejam vendidos ou vazados.
Pay‑to‑win  Os pacotes de publicidade dão pontos extras e influenciam diretamente o ranking; usuários chamam o site de “máquina de moedas”.
Ausência de inovação  Propostas de novos sites (como “Tibian – An OTServ List for 2020”) sugerem recursos modernos como reviews, busca avançada, screenshots e cadastros sociais, evidenciando que a Otservlist não acompanha as demandas.
Red flags em discussões

Histórico de conflitos – No passado, o dono da Otservlist e o criador do The Forgotten Server se envolveram em guerra de banimentos e DDoS, demonstrando instabilidade e práticas antiéticas.

Desconfiança geral – Em tópicos recentes, os usuários dizem que têm medo de usar a Otservlist porque ela pode vender dados dos jogadores e extorquir servidores.

Negligência de moderadores – Mesmo após o retorno do fórum hospedado, usuários relatam que reportar spoofers é um trabalho constante e a equipe não consegue dar conta.

4. A matriz de vulnerabilidade
Categoria Risco Detalhes
Crítico Dependência de tecnologia obsoleta  O uso de jQuery 1.4.3 e PHP sem atualização regular pode conter vulnerabilidades conhecidas; scripts desprotegidos podem permitir XSS, CSRF ou injeção.
  Privacidade e coleta de dados A exigência de logs de IP e jogadores únicos sem transparência representa risco de violação de leis de proteção de dados (LGPD/GDPR).
  Concentração de controle  A operação centralizada em um único administrador deixa o projeto vulnerável a decisões arbitrárias, inatividade ou má conduta.
  Monetização conflituosa A venda de posições privilegiadas e pontos adicionais compromete a integridade do ranking e pode afastar usuários.
Moderado  Reputação em declínio A comunidade vê a Otservlist como obsoleta e corrupta; isso dificulta a aquisição de novos servidores e patrocinadores.
  Falta de escalabilidade A ausência de API pública e de filtros avançados exige scraping, prejudicando performance e limitando integrações.
  Segurança de rede Embora a Cloudflare proteja contra DDoS, depender apenas desse serviço sem segurança no código server-side deixa o site suscetível a ataques de aplicação.
  Compliance  Possíveis violações de direitos autorais (por hospedar conteúdo de fãs sem licença) e de privacidade podem resultar em processos ou bloqueios regionais.
Vetores de alto valor

Base de dados de servidores e jogadores – O site possui uma base extensa de dados históricos de servidores OTServer, com número de jogadores, picos de usuários e comentários. Esses dados, se analisados, podem permitir insights sobre padrões de lançamento e interesse da comunidade.

Autoridade de domínio – Apesar da má reputação, otservlist.org está bem ranqueado nos motores de busca; qualquer parceria ou redirecionamento pode transferir tráfego considerável para um novo projeto.

Necessidade de alternativas – A comunidade clama por uma plataforma moderna com recursos como cadastros via Google/Discord, reviews, busca por mapa e status “pré‑lançamento”, abrindo espaço para arbitragem.

5. Pontos cegos e obscuridade

Código fechado e invisibilidade – Não há repositório oficial público; o código está fechado, dificultando auditoria e correção colaborativa. O histórico de commits, correções e testes não é visível, o que esconde a verdadeira saúde do projeto.

Infraestrutura fragmentada – Além do domínio principal, a Otservlist utiliza subdomínios (custom.otservlist.org, usa.otservlist.org) e CDN própria (img-cdn1.otservlist.org), mas não há transparência sobre onde os dados são armazenados. Essa fragmentação pode esconder serviços vulneráveis e diferentes níveis de segurança.

Ausência de política de privacidade – O site não expõe claramente como são tratados os dados de usuários e servidores. Servidores parceiros relatam que precisam enviar IPs, mas não existe política de consentimento explícito.

Algoritmo de ranking – Não há documentação de como se calcula a pontuação (combinação de jogadores online, uptime, votos, destaques pagos). Isso permite manipulação e dificulta a confiança dos usuários.

Falta de adoção de melhores práticas de DevSecOps – A inexistência de automação de segurança, testes contínuos ou pipelines de auditoria deixa o sistema propenso a configurações inseguros, vazamentos ou downtime prolongado.

Autocrítica e próximos passos

Durante esta pesquisa foram usados motores de busca, análises de código de repositórios semelhantes e discussões em fóruns. Foram ignorados relatos superficiais e buscadas fontes primárias, inclusive políticas de privacidade de servidores que revelam a partilha de IPs e depoimentos de usuários impactados. Entretanto, algumas fontes (Discords e Reddit privados) não puderam ser consultadas por restrição de acesso, e isso pode esconder opiniões extremas ou provas de fraudes mais graves. Recomenda-se:

Busca contínua por vazamentos e CVEs relacionados a versões antigas de jQuery/PHP utilizadas.

Monitoramento de comunidades (Reddit/Discord) para capturar novos incidentes e tendências.

Análise técnica aprofundada quando o código ou APIs forem descobertos, para verificar injection points e segurança de dados.

Consulta a especialistas legais para avaliar riscos de LGPD/GDPR no processamento de IPs.

Preparação para migração – O novo projeto OtservHub deve utilizar stack moderna (p.ex. Next.js, Tailwind, Supabase) com práticas DevSecOps, políticas de privacidade e transparência de algoritmos para conquistar a confiança da comunidade.