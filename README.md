# 🎵 SoundDesk

<p align="center">
    <img src="https://skillicons.dev/icons?i=python,fastapi,nextjs,react,ts,tailwind,postgres,redis,docker" />
</p>

<p align="center">
Um sistema moderno para gerenciamento, importação e download de músicas, desenvolvido com arquitetura desacoplada utilizando <strong>FastAPI</strong>, <strong>Next.js</strong>, <strong>Celery</strong>, <strong>Redis</strong> e <strong>PostgreSQL</strong>.
</p>

---

## ✨ Visão Geral

O **SoundDesk** nasceu com o objetivo de centralizar todo o gerenciamento de músicas em uma única plataforma.

O sistema permite:

* criar playlists;
* importar playlists do YouTube e Spotify;
* baixar músicas de forma assíncrona;
* gerenciar downloads;
* exportar playlists;
* administrar a conta do usuário;
* acompanhar estatísticas através de um dashboard.

Toda a arquitetura foi desenvolvida pensando em separação de responsabilidades, escalabilidade e boas práticas de desenvolvimento backend.

---

# 📦 Estrutura do Projeto

```text
SoundDesk/

├── backend/          → Backend FastAPI
├── frontend/          → Frontend Next.js
│
├── docker-compose.yml
│
├── README.md
│
└── .env.example
```

---

# 🏗 Arquitetura

```text
                     Next.js
                        │
                        ▼
                 FastAPI REST API
                        │
      ┌─────────────────┼────────────────┐
      ▼                 ▼                ▼
 PostgreSQL          Redis          Celery Worker
      │                                  │
      └──────────────┬───────────────────┘
                     ▼
            Download / Import Services
```

---

# 🚀 Funcionalidades

## 👤 Autenticação

* Login
* Cadastro
* JWT Authentication
* Refresh Token Rotation
* Verificação de e-mail
* Recuperação de senha
* Alteração de senha
* Alteração de e-mail
* Upload de avatar
* Endpoint `/me`
* Proteção de rotas

---

## 🎵 Playlists

* Criar playlists
* Atualizar playlists
* Excluir playlists
* Adicionar músicas
* Remover músicas
* Exportar playlists

---

## 📥 Downloads

* Download individual
* Download em lote
* Download de playlists
* Processamento assíncrono
* Histórico
* Status em tempo real

---

## 🌐 Importação

### YouTube

* Playlist
* Música individual

### Spotify

* Playlist
* Correspondência automática para YouTube

---

## 📊 Dashboard

* Total de playlists
* Total de músicas
* Downloads recentes
* Estatísticas do usuário

---

## 📧 Sistema de Emails

* Boas-vindas
* Verificação de conta
* Recuperação de senha
* Alteração de e-mail
* Confirmação de alteração de senha

---

## 🛡 Segurança

* JWT
* Refresh Tokens
* Password Hashing
* Email Verification
* Rate Limiting
* Health Check
* Readiness Check

---

# 🛠 Tecnologias

## Backend

| Tecnologia   | Uso                      |
| ------------ | ------------------------ |
| FastAPI      | API REST                 |
| SQLAlchemy 2 | ORM                      |
| Alembic      | Migrations               |
| PostgreSQL   | Banco de dados           |
| Redis        | Broker                   |
| Celery       | Processamento assíncrono |
| yt-dlp       | Download de mídias       |
| JWT          | Autenticação             |
| SMTP         | Envio de emails          |

---

## Frontend

| Tecnologia   | Uso             |
| ------------ | --------------- |
| Next.js      | Framework React |
| React        | Interface       |
| TypeScript   | Linguagem       |
| Tailwind CSS | Estilização     |

---

## DevOps

* Docker
* Docker Compose

---

# 📂 Documentação

Cada aplicação possui sua própria documentação.

| Projeto    | Descrição                    |
|------------| ---------------------------- |
| [`backend`](./backend/README.md)  | Documentação completa da API |
| [`frontend`](./frontend/README.md) | Documentação do Frontend     |

---

# ⚙ Como executar

## 1. Clone o projeto

```bash
git clone 'https://github.com/Ts-Joao/SoundDesk.git'

cd SoundDesk
```

---

## 2. Configure as variáveis

```bash
cp .env.example .env
```

---

## 3. Inicie os containers

```bash
docker compose up -d
```

---

## 4. Execute as migrations

```bash
docker compose exec backend alembic upgrade head
```

---

## 5. (Opcional) Criar usuário de demonstração

Caso não queira configurar SMTP apenas para testar a aplicação:

```bash
python scripts/seed.py
```

Credenciais:

```text
Email:
demo@sounddesk.dev

Senha:
demo123
```

---

# 📌 Roadmap

## ✅ Versão 2.0

* [x] Sistema de autenticação
* [x] Dashboard
* [x] Download de músicas
* [x] Download de playlists
* [x] Exportação
* [x] Importação YouTube
* [x] Importação Spotify
* [x] Sistema de Emails
* [x] Upload de Avatar
* [x] Health Check
* [x] Rate Limiting

---

## 🚧 Versão 2.1

* [ ] Deploy em produção
* [ ] Storage em nuvem
* [ ] Testes automatizados
* [ ] Paginação
* [ ] CI/CD
* [ ] Observabilidade
* [ ] Monitoramento

---

# 🤝 Contribuindo

Contribuições são bem-vindas.

1. Faça um Fork.
2. Crie uma branch para sua feature.

```bash
git checkout -b feature/minha-feature
```

3. Faça o commit.

```bash
git commit -m "feat: minha feature"
```

4. Envie para seu fork.

```bash
git push origin feature/minha-feature
```

5. Abra um Pull Request.

---

# 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

---

# 👨‍💻 Autor

Desenvolvido por **João Teixeira**.

Se este projeto foi útil para você, considere deixar uma ⭐ no repositório.
