# SoundDesk Backend

API REST responsável pelo gerenciamento de playlists, músicas, downloads e exportações.

## Stack

* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* Redis
* Celery
* yt-dlp
* FFmpeg
* Docker

---

## Arquitetura

```text
API
│
├── Routers
├── Services
├── Repositories
├── Models
├── Schemas
└── Workers
```

---

## Estrutura

```text
app/
├── api/
├── database/
├── enums/
├── exceptions/
├── models/
├── repositories/
├── schemas/
├── services/
├── workers/
└── main.py

storage/
├── covers/
├── downloads/
└── exports/
```

---

## Funcionalidades

### Playlists

* Criar
* Listar
* Atualizar
* Excluir
* Cor personalizada

### Tracks

* CRUD completo
* Associação com playlists

### Downloads

* Download assíncrono
* Extração de metadados
* Download de capa
* Conversão para MP3
* Retry
* Cancelamento
* Histórico de jobs

### Exportações

* Exportação em ZIP
* Download do ZIP
* Retry
* Cancelamento

### Gerenciamento de Arquivos

* Remoção automática de MP3
* Remoção automática de capas
* Remoção automática de ZIPs

---

## Fluxo de Download

```text
Track
   │
   ▼
Download Job
   │
   ▼
PENDING
   │
   ▼
PROCESSING
   │
   ├── Metadata
   ├── MP3
   ├── Cover
   └── Database
   ▼
COMPLETED
```

---

## Fluxo de Exportação

```text
Playlist
    │
    ▼
Export Job
    │
    ▼
PENDING
    │
    ▼
PROCESSING
    │
    ▼
ZIP
    │
    ▼
COMPLETED
```

---

## Como executar

Instalar dependências:

```bash
pip install -r requirements.txt
```

Ou utilizando Docker:

```bash
docker compose up --build
```

Aplicar migrations:

```bash
docker compose exec backend alembic upgrade head
```

---

## Documentação da API

Após iniciar o projeto:

```text
http://localhost:8000/docs
```

---

## Recursos Implementados

* CRUD de Playlists
* CRUD de Tracks
* Download assíncrono
* Download de capas
* Conversão para MP3
* Exportação ZIP
* Retry
* Cancelamento
* Dashboard
* Docker
* Celery
* Redis
* Alembic
