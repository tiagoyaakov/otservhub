%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#ffffff',
      'primaryTextColor': '#1e293b',
      'primaryBorderColor': '#e2e8f0',
      'lineColor': '#94a3b8',
      'secondaryColor': '#f8fafc',
      'tertiaryColor': '#ffffff',
      'fontFamily': 'Inter, sans-serif'
    }
  }
}%%

flowchart TD
    %% Classes de Estilo para refletir o tema Minimalista Gamer
    classDef start fill:#007AFF,color:#fff,stroke:none,rx:5,ry:5;
    classDef page fill:#ffffff,stroke:#e2e8f0,stroke-width:2px,color:#1e293b,rx:5,ry:5;
    classDef action fill:#f1f5f9,stroke:#cbd5e1,stroke-width:1px,color:#334155,rx:5,ry:5,stroke-dasharray: 5 5;
    classDef system fill:#0f172a,stroke:#334155,stroke-width:0px,color:#fff,rx:0,ry:0;
    classDef decision fill:#ffffff,stroke:#007AFF,stroke-width:2px,color:#007AFF,rx:5,ry:5,shape:diamond;
    classDef database fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,color:#475569,shape:cylinder;

    %% --- INÍCIO DO FLUXO ---
    Start([🚀 Acesso ao OtservHub]) --> Home
    class Start start

    subgraph PublicArea [🌐 Área Pública & Descoberta]
        Home[🏠 Home Page<br/>Listagem Countdown & Online]:::page
        Search[🔍 Busca & Filtros<br/>Versão, Mapa, Tipo]:::action
        AdDisplay[🖼️ Vitrine de Sponsors<br/>Hero Banner & Spotlights]:::page
        
        Home --> Search
        Home --> AdDisplay
        Search --> ServerList[📋 Lista de Resultados]:::page
        ServerList --> ServerCard[📄 Card do Servidor]:::page
        AdDisplay --> ServerCard
    end

    ServerCard -- Clica em Detalhes --> ServerDetails[ℹ️ Detalhes do Servidor<br/>Info, Vídeo, Galeria]:::page

    subgraph AuthModule [🔐 Autenticação]
        direction TB
        LoginCheck{Autenticado?}:::decision
        SocialLogin[🔑 Login Social<br/>Google / Discord]:::action
        AuthSuccess([✅ Sessão Criada]):::start
        
        LoginCheck -- Não --> SocialLogin
        SocialLogin --> AuthSuccess
    end

    ServerDetails --> HypeSystem
    ServerDetails --> Download[📥 Download Cliente]:::action

    subgraph Interaction [🔥 Sistema de Hype & Interação]
        HypeSystem{Interagir?}:::decision
        VoteHype[🗳️ Votar: Vou Jogar / Aguardando]:::action
        CalcHype[⚙️ System: Recalcular Hype Score]:::system
        
        HypeSystem -- Sim --> LoginCheck
        AuthSuccess --> VoteHype
        VoteHype --> CalcHype
        CalcHype --> ServerDetails
    end

    subgraph OwnerArea [👑 Área do Dono de Servidor]
        direction TB
        UserMenu[👤 Menu do Usuário]:::page
        RegisterBtn[➕ Cadastrar Servidor]:::action
        MyServers[📂 Meus Servidores]:::page
        
        LoginCheck -- Sim --> UserMenu
        UserMenu --> RegisterBtn
        UserMenu --> MyServers

        %% Fluxo de Cadastro e Verificação
        subgraph VerificationFlow [🛡️ Cadastro e Verificação]
            FormRegister[📝 Preencher Dados<br/>Nome, IP, Versão, Site]:::page
            GenToken[⚙️ System: Gerar Token Único]:::system
            Instruction[📌 Instrução:<br/>Adicionar Token no MOTD ou Site]:::page
            VerifyAction[🔎 Clicar 'Verificar Agora']:::action
            Pinger[📡 System: Ping no IP/Site]:::system
            CheckToken{Token Encontrado?}:::decision
            
            RegisterBtn --> FormRegister
            FormRegister --> GenToken
            GenToken --> Instruction
            Instruction --> VerifyAction
            VerifyAction --> Pinger
            Pinger --> CheckToken
            
            CheckToken -- Sim --> Verified[✅ Servidor Verificado & Listado]:::start
            CheckToken -- Não --> Retry[❌ Erro: Tentar Novamente]:::action
            Retry --> Instruction
        end
        
        %% Novo Fluxo de Ads Dashboard
        subgraph AdsModule [💎 Dashboard de Patrocínio Self-Service]
            AdsDash[📊 Painel de Ads]:::page
            Inventory[🗺️ Mapa de Slots<br/>Ver espaços livres/ocupados]:::page
            SlotDetail[📄 Detalhes do Slot<br/>Preço e Duração]:::page
            CheckAvail{Disponível?}:::decision
            UploadBanner[📤 Upload de Banner]:::action
            Payment[💳 Checkout / Pagamento]:::action
            ActiveAd[✅ Anúncio Agendado/Ativo]:::start
            NotifyWait[🔔 Avise-me quando liberar]:::action

            MyServers -- Gerenciar Ads --> AdsDash
            AdsDash --> Inventory
            Inventory -- Seleciona Slot --> SlotDetail
            SlotDetail --> CheckAvail
            
            CheckAvail -- Sim (Verde) --> UploadBanner
            UploadBanner --> Payment
            Payment --> ActiveAd
            
            CheckAvail -- Não (Vermelho) --> NotifyWait
        end
    end

    subgraph Backend [⚙️ Processos de Background]
        CronJob[⏰ Cron Job: Server Pinger]:::system
        UpdateOnline[📈 Atualizar Players Online]:::database
        
        CronJob -- A cada 5min --> UpdateOnline
        UpdateOnline -.-> Home
    end

    %% Conexões Finais
    Verified --> MyServers
    ActiveAd -.-> AdDisplay