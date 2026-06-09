# 🎵 Music Downloader

Sistema para gerenciamento de biblioteca musical pessoal, permitindo organizar playlists, processar downloads, gerar arquivos MP3 e gerenciar músicas de forma centralizada.

## 📖 Sobre o Projeto

O Music Downloader foi criado com o objetivo de facilitar a organização de músicas em playlists e automatizar o processamento de arquivos de áudio.

A aplicação será composta por um backend responsável pelo gerenciamento das playlists, fila de processamento e biblioteca musical, além de um frontend para administração e acompanhamento dos downloads.

## ✨ Funcionalidades

### Implementadas

* Estrutura inicial do projeto
* Ambiente Docker
* PostgreSQL
* Redis
* Backend FastAPI

### Planejadas

* Gerenciamento de playlists
* Gerenciamento de músicas
* Fila de processamento
* Processamento assíncrono com Celery
* Conversão e gerenciamento de arquivos MP3
* Gerenciamento de capas
* Metadados das músicas
* Biblioteca musical
* Dashboard com métricas
* Download em lote
* Exportação de playlists em ZIP
* Interface web moderna

## 🛠️ Tecnologias

### Backend

* Python 3.13
* FastAPI
* SQLAlchemy 2.0
* Alembic
* PostgreSQL
* Redis
* Celery
* Docker

### Frontend (Planejado)

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query

## 📂 Estrutura do Projeto

```text
music-downloader/
│
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── ...
│
├── frontend/
│   └── (futuro)
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Como Executar

### Clonar o repositório

```bash
git clone <url-do-repositorio>
cd music-downloader
```

### Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### Subir os serviços

```bash
docker compose up -d
```

### Verificar containers

```bash
docker ps
```

## 🗺️ Roadmap

### Fase 1 — Infraestrutura

* [x] Estrutura inicial do projeto
* [x] Configuração do Docker
* [x] PostgreSQL
* [x] Redis

### Fase 2 — Banco de Dados

* [ ] Configuração do SQLAlchemy
* [ ] Configuração do Alembic
* [ ] Criação das entidades

### Fase 3 — Playlists

* [ ] CRUD de playlists
* [ ] Organização das músicas por playlist

### Fase 4 — Biblioteca Musical

* [ ] Cadastro de músicas
* [ ] Biblioteca local
* [ ] Gerenciamento de arquivos

### Fase 5 — Processamento

* [ ] Redis
* [ ] Celery
* [ ] Workers
* [ ] Fila de processamento

### Fase 6 — Áudio

* [ ] Processamento de arquivos
* [ ] Gerenciamento de metadados
* [ ] Capas das músicas

### Fase 7 — Frontend

* [ ] Dashboard
* [ ] Gerenciamento de playlists
* [ ] Biblioteca musical
* [ ] Monitoramento da fila

### Fase 8 — Deploy

* [ ] Deploy da API
* [ ] Deploy do frontend
* [ ] Monitoramento
* [ ] Otimizações

## 📌 Objetivo

O objetivo principal do projeto é servir como uma biblioteca musical pessoal, permitindo organizar playlists, processar músicas de forma automatizada e manter uma coleção local organizada através de uma interface moderna e intuitiva.

## 📄 Licença

Projeto desenvolvido para fins pessoais e educacionais.
