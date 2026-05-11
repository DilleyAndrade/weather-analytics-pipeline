# Uso de Inteligência Artificial no Projeto

## Visão Geral

Durante o desenvolvimento deste projeto, ferramentas de Inteligência Artificial foram utilizadas como apoio ao planejamento, implementação, revisão e documentação da solução.

A IA foi usada como uma ferramenta auxiliar, não como substituta da validação técnica. Todas as implementações foram testadas manualmente durante o desenvolvimento.

## Como a IA foi utilizada

### 1. Planejamento da solução

A IA foi utilizada para apoiar a definição da arquitetura inicial do projeto, incluindo:

- Separação entre ingestão, banco de dados, backend, frontend e documentação
- Escolha de uma estrutura de pastas organizada
- Definição de etapas incrementais de desenvolvimento
- Sugestão de uma modelagem dimensional simples para dados meteorológicos

### 2. Modelagem de dados

A IA auxiliou na proposta inicial das tabelas:

- `dim_location`
- `dim_date`
- `fact_weather_daily`

Também apoiou a criação das views analíticas:

- `vw_weather_daily`
- `vw_weather_summary_by_location`
- `vw_weather_comparison_by_period`

As estruturas foram revisadas e validadas durante a execução no PostgreSQL.

### 3. Desenvolvimento do pipeline de ingestão

A IA apoiou a implementação incremental do pipeline Python, incluindo:

- Configuração de variáveis de ambiente
- Conexão com PostgreSQL
- Consumo da API histórica da Open-Meteo
- Transformação do JSON da API em dados tabulares
- Carga dos dados no PostgreSQL
- Uso de `ON CONFLICT` para evitar duplicidades
- Validação de parâmetros de data
- Logs de execução
- Tratamento de erros por cidade

### 4. Desenvolvimento do backend

A IA foi utilizada para estruturar o backend em FastAPI, incluindo:

- Criação dos endpoints iniciais
- Conexão com PostgreSQL
- Consulta às views analíticas
- Validação de parâmetros de query
- Habilitação de CORS para integração com o frontend
- Documentação automática via `/docs`

### 5. Desenvolvimento do frontend

A IA auxiliou na construção do dashboard em React, incluindo:

- Estrutura inicial da interface
- Consumo da API com Axios
- Criação de cards de indicadores
- Criação de filtros por cidade, período e variável climática
- Implementação de gráficos com Recharts
- Tabelas de dados diários e resumo por cidade
- Refatoração em componentes reutilizáveis
- Tratamento visual de estados de loading, erro e vazio

### 6. Revisão e boas práticas

A IA foi utilizada para revisar decisões de implementação e sugerir melhorias como:

- Commits pequenos e frequentes
- Mensagens de commit no padrão Conventional Commits
- Separação de responsabilidades entre módulos
- Validação antes de cada commit
- Documentação da arquitetura
- Organização do projeto para apresentação técnica

## Exemplos de decisões validadas manualmente

Durante o desenvolvimento, os seguintes pontos foram testados manualmente:

- Subida do PostgreSQL via Docker
- Criação das tabelas e views no banco
- Execução do pipeline de ingestão
- Carga idempotente dos dados
- Retorno dos endpoints da API
- Funcionamento do `/docs` do FastAPI
- Integração entre frontend e backend
- Renderização dos cards, gráficos, filtros e tabelas
- Build de produção do frontend

## Limitações do uso de IA

A IA não foi usada para substituir a compreensão técnica do projeto.

Todas as sugestões foram avaliadas, adaptadas e testadas. Quando ocorreram erros, como problemas de conexão, CORS, tela branca no React ou ordem incorreta de criação das views SQL, eles foram diagnosticados e corrigidos durante o desenvolvimento.

## Conclusão

O uso de IA acelerou o desenvolvimento e ajudou na organização do projeto, mas a validação final foi feita por meio de testes práticos, execução local e versionamento incremental com Git.

A IA atuou como apoio técnico para planejamento, implementação e revisão, enquanto as decisões finais foram confirmadas por testes e validações manuais.