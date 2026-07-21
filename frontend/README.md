# SoundDesk — Frontend v2

Plataforma multiusuário para gerenciamento de bibliotecas musicais.

## O que foi adicionado nesta versão

### Autenticação completa
- Login, Cadastro, Recuperação de senha, Redefinição de senha, Verificação de e-mail
- JWT com refresh automático via interceptor no `services/api.ts`
- Cookies HTTPOnly para armazenar tokens
- Middleware Next.js protegendo todas as rotas privadas

### Novas páginas
| Rota | Descrição |
|---|---|
| `/login` | Login com validação |
| `/register` | Cadastro |
| `/forgot-password` | Recuperação por e-mail |
| `/reset-password` | Redefinição com token |
| `/verify-email` | Verificação de e-mail |
| `/downloads` | Gerenciamento de downloads com retry/cancel |
| `/exports` | Histórico de exportações ZIP |
| `/shared` | Playlists compartilhadas |
| `/favorites` | Favoritos |
| `/profile` | Perfil, avatar, senha, exclusão de conta |
| `/notifications` | Central de notificações |

### Componentes novos
- `AppHeader` — busca global, sino de notificações, user menu com avatar
- `NotificationPanel` — dropdown estilo GitHub
- `GlobalSearch` — overlay com busca instantânea (⌘K)
- `AuthCard`, `AuthInput`, `AuthLink` — componentes de auth
- Toast system — notificações globais (success/error/warning/info)
- `ProfileView` — avatar upload, dados pessoais, alterar senha

### Gráficos no Dashboard
- Area chart de downloads por semana (Recharts)
- Pie chart de armazenamento (Recharts)
- 6 cards de estatísticas

## Como rodar

```bash
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL com a URL do seu FastAPI

pnpm install
pnpm dev
```

## Estrutura das pastas novas

```
src/
├── app/
│   ├── (auth)/              ← Rotas públicas (sem sidebar)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify-email/
│   └── (app)/               ← Rotas privadas (com sidebar + header)
│       ├── downloads/
│       ├── exports/
│       ├── shared/
│       ├── favorites/
│       ├── profile/
│       └── notifications/
│
├── contexts/
│   ├── AuthContext.tsx       ← Provider global de auth
│   └── ToastContext.tsx      ← Provider global de toasts
│
├── components/
│   ├── auth/AuthCard.tsx     ← Componentes base de auth
│   ├── notifications/        ← NotificationPanel
│   ├── search/GlobalSearch.tsx
│   └── layout/AppHeader.tsx  ← Header com busca e user menu
│
├── services/
│   ├── auth.service.ts       ← Login, register, refresh, etc.
│   ├── user.service.ts       ← Perfil, avatar, senha
│   ├── notification.service.ts
│   └── dashboard.service.ts
│
├── hooks/
│   ├── notifications/useNotifications.ts
│   ├── profile/useProfile.ts
│   └── dashboard/useDashboard.ts
│
├── lib/auth/
│   └── tokenManager.ts       ← Gerenciamento de cookies JWT
│
├── middleware.ts              ← Proteção de rotas
└── types/
    ├── auth.ts
    ├── notifications.ts
    └── dashboard.ts
```

## Integração com FastAPI

O frontend espera os seguintes endpoints:

### Auth
- `POST /api/auth/login` → `{ access_token, refresh_token }`
- `POST /api/auth/register`
- `POST /api/auth/refresh` → `{ access_token, refresh_token }`
- `POST /api/auth/logout`
- `GET  /api/auth/me` → `{ id, name, email, avatar }`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-email`

### Usuário
- `GET    /api/users/me`
- `PATCH  /api/users/me`
- `POST   /api/users/me/avatar`
- `POST   /api/users/me/change-password`
- `DELETE /api/users/me`

### Notificações
- `GET   /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/:id`
