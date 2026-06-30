# SoundVault — Music Library Manager

Frontend completo para gerenciamento de biblioteca musical pessoal.

## Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 15** | App Router, Server/Client Components, API Routes |
| **TypeScript** | Tipagem completa end-to-end |
| **@phosphor-icons/react** | Ícones com pesos duotone, fill e bold |
| **TanStack React Query v5** | Fetching, cache, polling e mutations |
| **CSS Global + Inline Styles** | Dark mode por padrão |

## Como rodar

```bash
pnpm install
pnpm dev
```

Acesse: http://localhost:3000 (redireciona para /dashboard)

## Integração com FastAPI

Edite `src/services/api.ts`:

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
```
