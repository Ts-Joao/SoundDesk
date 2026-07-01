# SoundDesk Frontend

Interface web para gerenciamento de playlists, biblioteca musical, downloads e exportações.

## Stack

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* TanStack Query

---

## Estrutura

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── types/
└── providers/
```

---

## Funcionalidades

### Dashboard

* Estatísticas
* Últimas playlists
* Últimos downloads

### Playlists

* Criar
* Editar
* Excluir
* Cor personalizada
* Exportar ZIP

### Biblioteca

* Todas as músicas
* Busca
* Filtros

### Downloads

* Fila de processamento
* Retry
* Cancelamento

### Configurações

* Tema escuro
* Cor de destaque
* Idioma

---

## Componentes

* Sidebar
* Header
* Cards
* Badges
* Progress Bars
* Skeleton Loaders
* Empty States
* Modais reutilizáveis

---

## Integração

A aplicação consome a API do backend utilizando TanStack Query.

Variáveis de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Executando

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm run dev
```

Build:

```bash
npm run build
npm start
```

---

## Recursos

* Interface responsiva
* Dark Mode
* Sistema de cores para playlists
* Skeleton Loading
* Empty States
* Busca
* Filtros
* Componentização
* Tipagem completa com TypeScript
* Integração com SoundDesk Backend

---

## Objetivo

O frontend foi desenvolvido para fornecer uma interface moderna e intuitiva para gerenciamento da biblioteca musical, integrando-se ao backend para acompanhar downloads, exportações e organização de playlists em tempo real.
