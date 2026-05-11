# Weather Analytics Pipeline

Projeto completo de engenharia de dados para ingestão, armazenamento, modelagem, disponibilização via API e visualização de dados meteorológicos históricos.

A solução consome dados da API pública da Open-Meteo, armazena em PostgreSQL, expõe dados tratados por meio de uma API FastAPI e apresenta os indicadores em um dashboard React.

## Objetivo

Construir uma solução de dados ponta a ponta para análise climática entre cidades brasileiras, permitindo comparar temperatura, precipitação e vento em diferentes períodos.

## Arquitetura

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

## Tecnologias Utilizadas

### Engenharia de Dados

- Python
- Pandas
- Requests
- SQLAlchemy
- PostgreSQL
- Docker

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy

### Frontend

- React
- Vite
- Axios
- Recharts

### Documentação e Versionamento

- Git
- GitHub
- Markdown
- Conventional Commits

## Estrutura do Projeto

```text
weather-analytics-pipeline/
├── backend/
│   ├── main.py
│   ├── database.py
│   └── routes/
│       └── weather.py
│
├── database/
│   ├── schema.sql
│   └── seeds.sql
│
├── docs/
│   ├── architecture.md
│   └── ai-usage.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── ingestion/
│   ├── api/
│   ├── load/
│   ├── transform/
│   ├── utils/
│   ├── config.py
│   └── main.py
│
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Funcionalidades

### Pipeline de Dados

- Consumo da Open-Meteo Historical API
- Coleta para múltiplas cidades brasileiras
- Validação da resposta da API
- Transformação dos dados em formato tabular
- Carga em PostgreSQL
- Carga idempotente com `ON CONFLICT`
- Logs estruturados
- Tratamento de erros por cidade
- Parâmetros de data via linha de comando

### Banco de Dados

Modelo dimensional simples:

```text
dim_location
dim_date
fact_weather_daily
```

Views analíticas:

```text
vw_weather_daily
vw_weather_summary_by_location
vw_weather_comparison_by_period
```

### API

Endpoints disponíveis:

```text
GET /
GET /health
GET /weather/locations
GET /weather/daily
GET /weather/summary
GET /weather/comparison
```

### Dashboard

O dashboard web permite:

- Visualizar indicadores gerais
- Filtrar dados por cidade
- Filtrar dados por período
- Selecionar variável climática
- Comparar temperatura média por cidade
- Visualizar evolução diária de temperatura, precipitação ou vento
- Consultar tabela diária filtrada
- Consultar resumo por cidade

## Cidades Monitoradas

- Recife
- São Paulo
- Rio de Janeiro
- Brasília
- Manaus
- Porto Alegre

## Variáveis Climáticas

- Temperatura máxima diária
- Temperatura mínima diária
- Temperatura média diária
- Precipitação acumulada diária
- Velocidade máxima do vento diária

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/DilleyAndrade/weather-analytics-pipeline.git
cd weather-analytics-pipeline
```

### 2. Criar ambiente virtual Python

```bash
python -m venv .venv
```

Ativar no Git Bash ou Linux/Mac:

```bash
source .venv/Scripts/activate
```

Em alguns ambientes Linux/Mac:

```bash
source .venv/bin/activate
```

### 3. Instalar dependências Python

```bash
pip install -r requirements.txt
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
POSTGRES_DB=weather_db
POSTGRES_USER=weather_user
POSTGRES_PASSWORD=weather_password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433

OPEN_METEO_BASE_URL=https://archive-api.open-meteo.com/v1/archive
```

### 5. Subir PostgreSQL com Docker

```bash
docker compose up -d
```

Validar container:

```bash
docker ps
```

### 6. Executar pipeline de ingestão

```bash
python -m ingestion.main --start-date 2025-01-01 --end-date 2025-01-07
```

Resultado esperado:

```text
Successful locations: 6
Failed locations: 0
Total rows loaded: 42
```

### 7. Rodar backend FastAPI

```bash
uvicorn backend.main:app --reload
```

A API ficará disponível em:

```text
http://127.0.0.1:8000
```

Documentação automática:

```text
http://127.0.0.1:8000/docs
```

### 8. Rodar frontend React

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O dashboard ficará disponível em:

```text
http://localhost:5173
```

## Exemplos de Uso da API

### Health Check

```bash
curl http://127.0.0.1:8000/health
```

### Listar localidades

```bash
curl http://127.0.0.1:8000/weather/locations
```

### Consultar dados diários

```bash
curl "http://127.0.0.1:8000/weather/daily?location_id=1&start_date=2025-01-01&end_date=2025-01-07&limit=7"
```

### Consultar resumo por cidade

```bash
curl http://127.0.0.1:8000/weather/summary
```

### Consultar comparação por período

```bash
curl "http://127.0.0.1:8000/weather/comparison?year=2025&month=1"
```

## Validações Implementadas

### Pipeline

- Validação de formato de data
- Validação de data inicial menor ou igual à data final
- Validação dos campos obrigatórios da resposta da API
- Validação de consistência no tamanho das listas retornadas
- Tratamento de erro por cidade

### API

- Validação de `location_id`
- Validação de `start_date` e `end_date`
- Validação de `limit`
- Validação de `year`
- Validação de `month`

## Documentação Complementar

- [Arquitetura da Solução](docs/architecture.md)
- [Uso de Inteligência Artificial](docs/ai-usage.md)

## Status do Projeto

Projeto em desenvolvimento.

Funcionalidades já implementadas:

- Pipeline de ingestão
- Modelagem dimensional
- Views analíticas
- API FastAPI
- Dashboard React
- Filtros e gráficos
- Documentação técnica inicial

## Autor

Dilley Andrade