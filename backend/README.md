# ⚡ SoundDesk API

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,fastapi,postgres,redis,docker" />
</p>

<p align="center">
Backend do <strong>SoundDesk</strong>, desenvolvido com <strong>FastAPI</strong>, utilizando arquitetura modular, processamento assíncrono com Celery e autenticação JWT.
</p>

---

# 📖 Sobre

A API do SoundDesk é responsável por todo o processamento da aplicação.

Entre suas responsabilidades estão:

* autenticação;
* gerenciamento de usuários;
* gerenciamento de playlists;
* downloads assíncronos;
* importação de playlists;
* envio de e-mails;
* dashboard;
* upload de avatar;
* filas de processamento.

Todo o projeto foi desenvolvido utilizando princípios de separação de responsabilidades, serviços desacoplados e organização modular.

---

# 🏗 Arquitetura

```text
                 FastAPI

                    │

        ┌───────────┼────────────┐
        ▼           ▼            ▼

     Services   Repositories   Schemas

        │           │

        └────── Models ─────────┘

                    │

               PostgreSQL

                    │

            Celery + Redis

                    │

         Download / Import Jobs
```

---

# 📂 Estrutura

```text
app/

├── auth/
├── common/
├── config/
├── dashboard/
├── downloads/
├── emails/
├── exceptions/
├── health/
├── imports/
├── matching/
├── playlists/
├── storage/
├── tokens/
├── tracks/
├── users/
├── workers/
│
└── main.py
```

---

# 🚀 Funcionalidades

## 👤 Autenticação

* Cadastro
* Login
* Logout
* Refresh Token
* JWT Authentication
* Refresh Token Rotation
* Verificação de e-mail
* Recuperação de senha
* Alteração de senha
* Alteração de e-mail
* Endpoint `/me`

---

## 👥 Usuários

* Perfil
* Upload de avatar
* Atualização de informações
* Alteração de senha
* Alteração de e-mail
* Verificação de senha

---

## 🎵 Playlists

* Criar
* Editar
* Excluir
* Listar
* Exportar ZIP

---

## 🎧 Tracks

* Cadastro
* Atualização
* Download
* Associação com playlists
* Controle de status

---

## 📥 Downloads

* Download individual
* Download em lote
* Download de playlists
* Histórico
* Filas
* Controle de status

---

## 🌐 Importação

### YouTube

* Playlist

### Spotify

* Playlist

Além disso, músicas importadas do Spotify são automaticamente localizadas no YouTube para posterior download.

---

## 📧 Sistema de Emails

* Welcome
* Verify Email
* Reset Password
* Change Email
* Password Changed

Todos os e-mails são enviados de forma assíncrona utilizando Celery.

---

## 📊 Dashboard

* Total de playlists
* Total de músicas
* Downloads recentes
* Estatísticas do usuário

---

## ❤️ Health

* `/health`
* `/ready`
* `/version`

---

# ⚙️ Stack

## Framework

* FastAPI

## ORM

* SQLAlchemy 2

## Banco

* PostgreSQL

## Migrations

* Alembic

## Filas

* Celery

## Broker

* Redis

## Download

* yt-dlp

## Upload

* Multipart

## Email

* FastAPI-Mail

## Autenticação

* JWT
* Refresh Tokens
* Password Hashing

---

# 📦 Organização das Camadas

Cada módulo segue aproximadamente a seguinte estrutura:

```text
module/

├── models.py
├── schemas.py
├── repository.py
├── service.py
├── router.py
└── dependencies.py
```

Essa separação facilita manutenção, testes e evolução do projeto.

---

# 🔄 Fluxo de Download

```text
Usuário

↓

Cria Download

↓

Download Job

↓

Celery Worker

↓

yt-dlp

↓

Atualização da Track

↓

Download Finalizado
```

---

# 🌐 Fluxo de Importação

```text
URL

↓

Provider Factory

↓

YouTube Provider
        ou
Spotify Provider

↓

Matching Service

↓

Playlist

↓

Tracks

↓

Download Jobs
```

---

# 🔒 Segurança

* JWT Authentication
* Refresh Token Rotation
* Password Hashing
* Email Verification
* Rate Limiting
* Protected Routes
* Token de recuperação
* Token de alteração de e-mail

---

# 📋 Endpoints

<details>

<summary><strong>Autenticação</strong></summary>

```http
POST   /auth/register
POST   /auth/login
POST   /auth/logout

POST   /auth/refresh

GET    /auth/verify-email

POST   /auth/forgot-password
POST   /auth/reset-password

POST   /auth/verify-password

PATCH  /auth/change-email
PATCH  /auth/change-password
```

</details>

<details>

<summary><strong>Usuários</strong></summary>

```http
GET    /users/me

PATCH  /users/profile
PATCH  /users/avatar
```

</details>

<details>

<summary><strong>Playlists</strong></summary>

```http
GET
POST
PATCH
DELETE
```

</details>

<details>

<summary><strong>Tracks</strong></summary>

```http
GET
POST
PATCH
DELETE
```

</details>

<details>

<summary><strong>Downloads</strong></summary>

```http
POST
GET
```

</details>

<details>

<summary><strong>Importação</strong></summary>

```http
POST /imports/playlist
```

</details>

<details>

<summary><strong>Dashboard</strong></summary>

```http
GET /dashboard
```

</details>

<details>

<summary><strong>Health</strong></summary>

```http
GET /health
GET /ready
GET /version
```

</details>

---

# 🚀 Executando o Projeto

## Clonar

```bash
git clone 'https://github.com/Ts-Joao/SoundDesk.git'
```

## Configurar ambiente

```bash
cp .env.example .env
```

## Subir containers

```bash
docker compose up -d
```

## Executar migrations

```bash
alembic upgrade head
```

## Criar usuário de demonstração

```bash
python scripts/seed.py
```

---

# 📌 Próximos Passos

* Deploy
* Storage em nuvem
* Testes automatizados
* Paginação
* CI/CD
* Monitoramento

---

# 👨‍💻 Desenvolvedor

Desenvolvido por **João Teixeira** como parte do projeto **SoundDesk**.
