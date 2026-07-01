# SoundDesk

SoundDesk é uma plataforma para gerenciamento de bibliotecas musicais, permitindo organizar playlists, baixar músicas a partir do YouTube, acompanhar o processamento em tempo real e exportar playlists em arquivos ZIP.

O projeto é dividido em duas aplicações independentes:

* **Backend:** API REST desenvolvida com FastAPI.
* **Frontend:** Interface web desenvolvida com Next.js.

---

## Arquitetura

```text
Frontend (Next.js)
        │
        ▼
 Backend (FastAPI)
        │
 ┌──────┴──────┐
 ▼             ▼
PostgreSQL   Redis
                │
                ▼
             Celery
                │
                ▼
      yt-dlp + FFmpeg
```

---

## Estrutura do Projeto

```text
SoundDesk/
├── backend/
├── frontend/
└── README.md
```

---

## Tecnologias

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Alembic
* Celery
* Redis
* yt-dlp
* FFmpeg
* Docker

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* TanStack Query

---

## Funcionalidades

* Gerenciamento de playlists
* Gerenciamento de músicas
* Download assíncrono de músicas
* Download automático de capas
* Conversão para MP3
* Exportação de playlists em ZIP
* Cancelamento de tarefas
* Retry de tarefas com falha
* Dashboard com estatísticas
* Interface responsiva
* Sistema de cores para playlists

---

## Executando o Projeto

### Backend

```bash
cd backend
docker compose up --build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Documentação

* Backend: `backend/README.md`
* Frontend: `frontend/README.md`

---

## Objetivo

Este projeto foi desenvolvido para estudo e prática de desenvolvimento Full Stack, explorando arquitetura em camadas, processamento assíncrono, manipulação de arquivos, integração com serviços externos e construção de interfaces modernas.
