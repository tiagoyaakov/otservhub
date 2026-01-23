# Implementação da Coluna e Filtro de Temas

## Alterações Realizadas

### 1. Mock Data (`src/data/mockServers.ts`)

- Adicionada a propriedade `theme` à interface `Server`.
- Adicionado o campo `theme` a todos os servidores de mock, com valores como "Tibia", "Pokemon", "Naruto", "Dragonball", etc.

### 2. Filtros de Busca (`src/components/home/SearchFilters.tsx`)

- Adicionado campo `theme` à interface `FilterState`.
- Criado um novo grupo de filtro "TEMA" com as opções: "Todos", "Tibia", "Pokemon", "Naruto", "Dragonball", "Outros".
- O filtro de tema foi posicionado antes do filtro de Versão para destaque.

### 3. Lógica da Home (`src/app/page.tsx`)

- Atualizada a função `mapDbServerToUi` para mapear `dbServer.theme` para a propriedade `theme` da interface `Server`.
- Atualizada a função `filterServers` para implementar a lógica de filtragem por tema:
  - Se `theme` for "Outros", busca servidores que NÃO sejam Tibia, Pokemon, Naruto ou Dragonball.
  - Caso contrário, busca correspondência exata.
- Inicializado o estado `theme` como "Todos" no hook `useState`.

### 4. Tabela de Servidores (`src/components/home/ServerTable.tsx`)

- Adicionada coluna "Tema" no cabeçalho da tabela.
- Adicionada célula "Tema" na linha do servidor (`ServerRow`), exibindo um badge colorido:
  - **Tibia**: Azul
  - **Pokemon**: Amarelo
  - **Naruto**: Laranja
  - **Dragonball**: Vermelho
  - **Outros**: Cinza

## Como Testar

1. Acesse a Home Page.
2. Verifique a nova coluna "Tema" na tabela de servidores.
3. Utilize o filtro "TEMA" e selecione "Pokemon". A lista deve mostrar apenas servidores de Pokemon.
4. Selecione "Todos" para limpar o filtro.
