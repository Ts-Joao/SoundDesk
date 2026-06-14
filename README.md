# SoundDesk

API para gerenciamento de playlists e músicas, com download assíncrono de conteúdo via YouTube, processamento em background com Celery + Redis e exportação de playlists em arquivos ZIP.

## Tecnologias

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Redis
- Celery
- Docker
- yt-dlp
- FFmpeg

## Funcionalidades

### Playlists
- Criar, listar, buscar, atualizar e remover playlists
- Adicionar e remover tracks de uma playlist
- Listar tracks de uma playlist

### Tracks
- Criar, listar, buscar, atualizar e remover tracks
- Download assíncrono via Celery
- Extração automática de metadados (título, artista, duração)
- Download da capa
- Conversão para MP3 com FFmpeg

### Download Jobs
- Criar e consultar status de jobs
- Cancelar download em andamento
- Reprocessar downloads com falha (retry)
- Histórico de execuções

### Exportação de Playlists
- Exportação assíncrona em ZIP
- Download do arquivo exportado
- Cancelamento de exportação
- Reprocessamento de exportações com falha

### Gerenciamento de Arquivos
- Armazenamento local de MP3, capas e ZIPs
- Remoção automática dos arquivos físicos ao excluir registros relacionados

## Arquitetura

```text
Client
   │
   ▼
FastAPI
   │
   ├── Services
   ├── Repositories
   └── PostgreSQL
   │
   ▼
Redis
   │
   ▼
Celery Workers
   │
   ├── Download Processing
   ├── Metadata Extraction
   ├── Cover Download
   └── Playlist Export
```

## Estrutura do Projeto

```text
backend/
├── app/
│   ├── api/
│   ├── database/
│   ├── enums/
│   ├── exceptions/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── workers/
│   └── main.py
├── storage/
│   ├── downloads/
│   ├── covers/
│   └── exports/
├── .env
└── .env.example
```

## Fluxo de Download

```text
Track criada
      │
      ▼
Download Job criado (PENDING)
      │
      ▼
PROCESSING
      │
      ├── Obtém metadados
      ├── Faz download do áudio
      ├── Converte para MP3
      └── Baixa a capa
      │
      ▼
COMPLETED
```

**Estados:** `PENDING` → `PROCESSING` → `COMPLETED` | `FAILED` | `CANCELLED`

## Fluxo de Exportação

```text
Playlist
    │
    ▼
Export Job criado (PENDING)
    │
    ▼
PROCESSING
    │
    ▼
ZIP gerado
    │
    ▼
COMPLETED
```

**Estados:** `PENDING` → `PROCESSING` → `COMPLETED` | `FAILED` | `CANCELLED`

## Instalação

### Pré-requisitos

- Docker e Docker Compose instalados
- Git

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/Ts-Joao/SoundDesk.git
cd SoundDesk
```

2. Acesse o diretório `backend` e crie o arquivo `.env` com base no `.env.example`:

```bash
cd backend
cp .env.example .env
```

3. Configure a variável de ambiente no `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/sound
```

4. Volte para a raiz do projeto e suba os containers:

```bash
cd ..
docker compose up --build
```

Esse comando inicia a API, o banco de dados PostgreSQL, o Redis e o worker Celery.

5. Em outro terminal, execute as migrations do banco de dados:

```bash
docker compose exec api alembic upgrade head
```

6. A API estará disponível em:

```text
http://localhost:8000
```

### Parar os containers

```bash
docker compose down
```

### Rodar novamente (sem rebuild)

```bash
docker compose up
```

## Documentação

Após iniciar a aplicação, acesse:

```text
http://localhost:8000/docs
```

Swagger UI disponível para testes interativos da API.

## Objetivo

Projeto desenvolvido com foco em estudo e demonstração de:

- Arquitetura em camadas (Services / Repositories)
- Processamento assíncrono com filas
- Integração com serviços externos (YouTube via yt-dlp)
- Manipulação de arquivos
- APIs REST com FastAPI
- Containerização com Docker
- Persistência de dados com PostgreSQL
- Background Jobs com Celery e Redis