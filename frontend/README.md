# 🌐 SoundDesk Web

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" />
</p>

<p align="center">
Frontend do <strong>SoundDesk</strong>, desenvolvido com <strong>Next.js</strong>, <strong>React</strong> e <strong>Tailwind CSS</strong>, consumindo a API do projeto para oferecer uma experiência moderna e responsiva.
</p>

---

# 📖 Sobre

O SoundDesk Web é responsável por toda a experiência do usuário.

A aplicação permite:

* autenticação;
* gerenciamento de playlists;
* download de músicas;
* importação de playlists;
* dashboard;
* gerenciamento da conta;
* configurações do perfil.

Toda comunicação acontece através da API REST do SoundDesk.

---

# 🏗 Arquitetura

```text
                   Browser

                      │

                 Next.js App

                      │

        ┌─────────────┼──────────────┐
        ▼             ▼              ▼

      Pages        Components      Hooks

                      │

                Services (Axios)

                      │

                SoundDesk API
```

---

# 📂 Estrutura

```text
src/

├── app/
│
├── components/
│
├── hooks/
│
├── services/
│
├── contexts/
│
├── lib/
│
├── types/
│
└── middleware.ts
```

---

# ✨ Funcionalidades

## 🔐 Autenticação

* Login
* Cadastro
* Logout
* Refresh Token automático
* Persistência da sessão
* Rotas protegidas
* Recuperação de senha
* Verificação de e-mail

---

## 👤 Perfil

* Informações da conta
* Upload de avatar
* Alteração de senha
* Alteração de e-mail
* Confirmação de senha para operações sensíveis

---

## 🎵 Playlists

* Criar playlists
* Editar playlists
* Excluir playlists
* Adicionar músicas
* Remover músicas
* Exportar playlists

---

## 📥 Downloads

* Download individual
* Download de playlists
* Histórico
* Status em tempo real
* Indicadores visuais

---

## 🌐 Importação

* Importação por URL

### Plataformas suportadas

* YouTube
* Spotify

---

## 📊 Dashboard

* Total de playlists
* Total de músicas
* Downloads recentes
* Estatísticas do usuário

---

## 📧 Fluxos de Email

Interface para:

* Verificação de conta
* Recuperação de senha
* Alteração de e-mail

---

# 🛠 Tecnologias

## Framework

* Next.js

## UI

* React
* Tailwind CSS

## Linguagem

* TypeScript

## Comunicação

* Axios

## Gerenciamento de Estado

* React Context
* React Hooks

---

# 🎨 Interface

O frontend foi desenvolvido seguindo princípios de:

* Design moderno
* Responsividade
* Componentização
* Reutilização de código
* Boa experiência do usuário

---

# 🔄 Fluxo da Aplicação

```text
Usuário

↓

Login

↓

JWT

↓

Dashboard

↓

Playlists

↓

Downloads

↓

Importação

↓

Conta
```

---

# 📦 Organização

Cada funcionalidade é organizada em componentes reutilizáveis.

Exemplo:

```text
components/

├── ui/
├── layout/
├── forms/
├── dashboard/
├── playlists/
├── downloads/
├── tracks/
├── profile/
└── settings/
```

---

# 🔐 Autenticação

O frontend trabalha com:

* Access Token
* Refresh Token
* Renovação automática da sessão
* Middleware de proteção
* Redirecionamento automático

---

# 🌐 Comunicação com a API

Todos os dados são obtidos através da API do SoundDesk.

Principais módulos consumidos:

* Auth
* Users
* Dashboard
* Playlists
* Tracks
* Downloads
* Imports

---

# ⚙️ Configuração

## Clonar

```bash
git clone 'https://github.com/Ts-Joao/SoundDesk.git'
```

---

## Instalar dependências

```bash
npm install
```

ou

```bash
pnpm install
```

---

## Configurar ambiente

```bash
cp .env.example .env.local
```

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Executar

```bash
npm run dev
```

ou

```bash
pnpm dev
```

---

# 📌 Páginas

<details>

<summary><strong>Autenticação</strong></summary>

* Login
* Cadastro
* Recuperar senha
* Redefinir senha
* Verificar e-mail

</details>

<details>

<summary><strong>Aplicação</strong></summary>

* Dashboard
* Playlists
* Playlist
* Downloads
* Perfil
* Configurações

</details>

---

# 🚀 Funcionalidades Futuras

* Tema escuro
* Internacionalização (i18n)
* Upload por Drag & Drop
* PWA
* Notificações em tempo real

---

# 📱 Responsividade

A interface foi desenvolvida para funcionar em:

* Desktop
* Notebook
* Tablet
* Smartphone

---

# 🤝 Contribuindo

1. Faça um Fork.

2. Crie uma branch.

```bash
git checkout -b feature/minha-feature
```

3. Commit.

```bash
git commit -m "feat: minha feature"
```

4. Push.

```bash
git push origin feature/minha-feature
```

5. Abra um Pull Request.

---

# 👨‍💻 Desenvolvedor

Desenvolvido por **João Teixeira** como parte do projeto **SoundDesk**.

Para mais informações sobre a arquitetura completa, consulte o **README** do repositório principal.
