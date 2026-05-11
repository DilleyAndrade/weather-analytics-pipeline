# Arquitetura da Solução

## Visão Geral

Este projeto implementa um pipeline completo de dados meteorológicos, desde a ingestão via API pública até a visualização em um dashboard web interativo.

A solução permite comparar dados climáticos entre cidades brasileiras, considerando temperatura, precipitação e vento em diferentes períodos.

## Fluxo da Solução

```text
Open-Meteo Historical API
        ↓
Python Ingestion Pipeline
        ↓
PostgreSQL
        ↓
Views Analíticas SQL
        ↓
FastAPI Backend
        ↓
React Dashboard
```

## Componentes

### 1. Fonte de Dados

A fonte de dados utilizada é a API pública da Open-Meteo, por meio do endpoint histórico:

```text
https://archive-api.open-meteo.com/v1/archive
```

Variáveis coletadas:

- Temperatura máxima diária
- Temperatura mínima diária
- Temperatura média diária
- Precipitação acumulada diária
- Velocidade máxima do vento diária

### 2. Pipeline de Ingestão

O pipeline foi desenvolvido em Python e executa as seguintes etapas:

```text
coleta → validação → transformação → carga
```

Responsabilidades principais:

- Buscar localidades cadastradas no banco
- Consultar a API Open-Meteo para cada cidade
- Validar a resposta da API
- Transformar o JSON em estrutura tabular
- Carregar dados na dimensão de datas
- Carregar dados na tabela fato meteorológica
- Evitar duplicidades com `ON CONFLICT`
- Registrar logs de execução
- Tratar falhas por cidade sem interromper todo o pipeline

### 3. Banco de Dados

O banco utilizado é PostgreSQL, executado localmente via Docker.

A modelagem segue uma abordagem dimensional simples:

```text
dim_location
dim_date
fact_weather_daily
```

#### dim_location

Armazena as cidades monitoradas:

- cidade
- estado
- país
- latitude
- longitude
- timezone

#### dim_date

Armazena os atributos de calendário:

- data
- ano
- mês
- dia
- dia da semana
- trimestre

#### fact_weather_daily

Armazena as medições meteorológicas diárias:

- temperatura máxima
- temperatura mínima
- temperatura média
- precipitação
- velocidade máxima do vento
- fonte dos dados

### 4. Views Analíticas

Foram criadas views SQL para facilitar o consumo dos dados pelo backend:

```text
vw_weather_daily
vw_weather_summary_by_location
vw_weather_comparison_by_period
```

#### vw_weather_daily

Fornece os dados diários já enriquecidos com cidade e data.

#### vw_weather_summary_by_location

Fornece indicadores agregados por cidade.

#### vw_weather_comparison_by_period

Fornece indicadores comparativos por cidade, ano e mês.

### 5. Backend

O backend foi desenvolvido com FastAPI.

Principais rotas:

```text
GET /
GET /health
GET /weather/locations
GET /weather/daily
GET /weather/summary
GET /weather/comparison
```

Responsabilidades:

- Expor dados meteorológicos para o frontend
- Validar parâmetros de consulta
- Consultar views analíticas no PostgreSQL
- Permitir filtros por cidade, data, ano e mês
- Habilitar CORS para integração com o frontend local

### 6. Frontend

O dashboard foi desenvolvido com React + Vite.

Funcionalidades principais:

- Cards gerais do projeto
- Cards baseados nos filtros aplicados
- Filtro por cidade
- Filtro por período
- Seletor de variável climática
- Gráfico comparativo de temperatura média por cidade
- Gráfico de linha para evolução diária
- Tabela diária filtrável
- Tabela de resumo por cidade

Bibliotecas utilizadas:

- React
- Axios
- Recharts
- Vite

## Execução Local

A solução roda localmente com três serviços principais:

```text
PostgreSQL via Docker
FastAPI Backend
React Frontend
```

## Decisões Técnicas

### Uso de PostgreSQL

PostgreSQL foi escolhido por ser um banco relacional robusto, amplamente usado em projetos de dados e adequado para modelagem dimensional.

### Uso de Docker para o banco

Docker facilita a reprodução do ambiente local e evita a necessidade de instalação manual do PostgreSQL.

### Uso de FastAPI

FastAPI permite criar APIs simples, rápidas e com documentação automática via `/docs`.

### Uso de React

React permite construir um dashboard web próprio, atendendo ao requisito de não utilizar ferramentas prontas como Power BI ou Looker.

### Uso de Views SQL

As views reduzem a complexidade do backend e centralizam parte da lógica analítica no banco.

## Estrutura Simplificada

```text
weather-analytics-pipeline/
├── backend/
├── database/
├── docs/
├── frontend/
├── ingestion/
├── docker-compose.yml
├── requirements.txt
└── README.md
```