# Frontend: Especificação Técnica — Guia de Referência

**Documento:** Especificação Frontend  
**Data:** 02 de julho de 2026  
**Tech Stack:** React · Vite · TypeScript · TanStack Query · Zustand  
**Status:** Pronto para implementação

---

## 1. Stack & Decisões Técnicas

| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| Framework UI | React | 18.x | Componentes declarativos, ecossistema maduro |
| Build tool | Vite | 5.x | HMR instantâneo, build otimizado, native ESM |
| Linguagem | TypeScript (strict) | 5.x | Type safety end-to-end com `packages/types` |
| Roteamento | React Router | 6.x | Nested routes, loaders, proteção declarativa |
| Estado servidor | TanStack Query | 5.x | Cache, refetch, mutations — sem boilerplate |
| Estado cliente | Zustand | 4.x | Auth session e UI state com zero overhead |
| HTTP Client | Axios | 1.x | Interceptors para token refresh automático |
| Formulários | React Hook Form + Zod | — | Validação performática + schema compartilhável |
| Estilização | Tailwind CSS | 3.x | Utility-first, tokens via CSS variables |
| Componentes base | Radix UI | — | Primitivos acessíveis (modais, drawers, dropdowns) |
| Ícones | Lucide React | — | Linha consistente, MIT, tree-shakeable |
| Datas | date-fns | 3.x | Leve, imutável, sem side effects |
| Testes unit | Vitest + React Testing Library | — | Nativo ao Vite, mesma API do Jest |
| Testes E2E | Playwright | — | Cross-browser, CI-friendly |
| Deploy | Vercel (SPA estático) | — | Integração direta com GitHub, CDN global |

### Padrão de Arquitetura

**Domain-Driven Feature Folders** — o frontend espelha os módulos do backend NestJS.  
Cada domínio (`auth`, `events`, `musicians`, `allocations`, `users`, `notifications`) é uma pasta vertical isolada com seus próprios componentes, hooks e serviço de API. Dependências cruzadas entre domínios são proibidas; código compartilhado vai para `components/`, `lib/` ou `store/`.

---

## 2. Estrutura de Pastas

```
apps/web/
├── src/
│   ├── app/                  # Providers, router config, global styles
│   ├── components/           # Design system compartilhado (Button, Badge, Input…)
│   ├── domains/              # Lógica de negócio por domínio
│   │   ├── auth/
│   │   ├── events/
│   │   ├── musicians/
│   │   ├── allocations/
│   │   ├── users/
│   │   └── notifications/    # Fase 1+
│   ├── layouts/              # Shell, Sidebar, Topbar, RightDrawer
│   ├── lib/                  # API client, date utils, formatters, constantes
│   ├── pages/                # Componentes de rota (finos — só compõem)
│   └── store/                # Zustand stores (auth, UI)
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── vercel.json               # Rewrite SPA: /* → /index.html
├── .env.example
├── package.json
└── tsconfig.json
```

### Convenção interna de cada domínio

```
domains/<domínio>/
├── components/       # Componentes React específicos do domínio
├── hooks/            # Hooks TanStack Query (useEvents, useCreateEvent…)
└── services/         # Funções Axios que chamam a API (events.service.ts)
```

### Convenção de nomes de arquivo

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componente React | PascalCase | `EventCard.tsx` |
| Hook | camelCase prefixado `use` | `useEvents.ts` |
| Service | camelCase sufixado `.service` | `events.service.ts` |
| Store Zustand | camelCase sufixado `.store` | `auth.store.ts` |
| Types locais | camelCase sufixado `.types` | `events.types.ts` |
| Página | PascalCase sufixado `Page` | `DashboardPage.tsx` |

---

## 3. Camadas de Estado

### 3.1 Estado de Servidor — TanStack Query

Gerencia todos os dados que vêm da API: cache, loading, erro, refetch e invalidação.  
Os hooks ficam em `domains/<domínio>/hooks/`.

```ts
// Exemplo: domains/events/hooks/useEvents.ts
export const useEvents = (filters?: EventFilters) =>
  useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsService.list(filters),
  })

export const useCreateEvent = () =>
  useMutation({
    mutationFn: eventsService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
```

**Regras:**
- `queryKey` sempre começa com o nome do domínio em array: `['events']`, `['musicians']`
- Mutations invalidam as queries relacionadas em `onSuccess`
- `staleTime` padrão: 30s para listas, 60s para detalhes
- Erros HTTP 401 no interceptor Axios disparam logout automático

### 3.2 Estado de Cliente — Zustand

Gerencia estado que existe apenas no browser: sessão autenticada e estado de UI.

```
store/
├── auth.store.ts    # user, accessToken, isAuthenticated, login(), logout()
└── ui.store.ts      # sidebarCollapsed, rightDrawerOpen, activeModal
```

**Regra:** nunca colocar dados da API no Zustand. Se vem do servidor, usa TanStack Query.

### 3.3 Estado de Formulário — React Hook Form + Zod

Formulários locais (criar evento, alocar músico, solicitar folga) gerenciados com React Hook Form.  
Schemas Zod compartilham tipos com `packages/types` para garantir contrato com a API.

---

## 4. Roteamento & Proteção de Rotas

### 4.1 Mapa de Rotas Completo

```
/login                          → Público
/forgot-password                → Público
/reset-password/:token          → Público

[ADMIN — Everton]
/dashboard                      → Protegido (ADMIN)
/agenda/:view                   → Protegido (ADMIN) — view: year|month|week|day
/agenda/day/:date               → Protegido (ADMIN)
/eventos/novo                   → Protegido (ADMIN)
/eventos/:id                    → Protegido (ADMIN)
/eventos/:id/editar             → Protegido (ADMIN)
/eventos/:id/escalar            → Protegido (ADMIN)
/escalacoes                     → Protegido (ADMIN)
/musicos                        → Protegido (ADMIN)
/musicos/novo                   → Protegido (ADMIN)
/musicos/:id                    → Protegido (ADMIN)
/notificacoes                   → Protegido (ADMIN)
/perfil                         → Protegido (ADMIN | MUSICIAN)

[MUSICIAN]
/inicio                         → Protegido (MUSICIAN)
/agenda                         → Protegido (MUSICIAN)
/agenda/day/:date               → Protegido (MUSICIAN)
/eventos/:id                    → Protegido (MUSICIAN) — read-only + confirm/decline
/folga                          → Protegido (MUSICIAN)
/perfil                         → Protegido (ADMIN | MUSICIAN)
```

### 4.2 Proteção de Rotas

```ts
// Componente ProtectedRoute verifica:
// 1. isAuthenticated (Zustand) → redireciona /login se false
// 2. user.role ∈ allowedRoles → redireciona /unauthorized se false
<ProtectedRoute allowedRoles={['ADMIN']}>
  <DashboardPage />
</ProtectedRoute>
```

### 4.3 Redirecionamentos por Role após Login

| Role | Redireciona para |
|---|---|
| `ADMIN` | `/dashboard` |
| `MUSICIAN` | `/inicio` |

---

## 5. Integração com API

### 5.1 Cliente HTTP — Axios

```
lib/
└── api.client.ts     # instância Axios configurada com interceptors
```

**Configuração da instância:**
- `baseURL`: `import.meta.env.VITE_API_URL`
- Header `Authorization: Bearer <accessToken>` injetado automaticamente via interceptor de request
- Interceptor de response: se status 401 e há refresh token no cookie, dispara `POST /auth/refresh`, substitui o access token em memória (Zustand) e reexecuta a request original
- Se o refresh também falhar → `logout()` + redirect para `/login`

### 5.2 Serviços por Domínio

Cada domínio expõe um arquivo `<domínio>.service.ts` com funções puras que chamam o cliente HTTP.

```ts
// Exemplo: domains/events/services/events.service.ts
export const eventsService = {
  list: (filters?: EventFilters) =>
    api.get<EventResponse[]>('/events', { params: filters }).then(r => r.data),

  getById: (id: string) =>
    api.get<EventResponse>(`/events/${id}`).then(r => r.data),

  create: (data: CreateEventDto) =>
    api.post<EventResponse>('/events', data).then(r => r.data),

  update: (id: string, data: UpdateEventDto) =>
    api.put<EventResponse>(`/events/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    api.delete(`/events/${id}`),
}
```

**Tipos importados de `packages/types`** — nunca redefinir DTOs no frontend.

---

## 6. Autenticação no Cliente

### 6.1 Estratégia de Tokens

| Token | Armazenamento | Duração | Motivo |
|---|---|---|---|
| Access Token (JWT) | Memória (Zustand) | 24h | Não persiste entre tabs; não acessível via JS em XSS |
| Refresh Token (JWT) | httpOnly Cookie | 7d | Inacessível via JS; enviado automaticamente pelo browser |

**Fluxo de login:**

1. `POST /auth/login` → API retorna `{ accessToken, user }` e seta cookie httpOnly com refresh token
2. Frontend armazena `accessToken` e `user` no Zustand (`auth.store`)
3. Axios injeta `accessToken` em todas as requests subsequentes

**Fluxo de refresh:**

1. Interceptor detecta 401
2. Dispara `POST /auth/refresh` (cookie enviado automaticamente)
3. API retorna novo `accessToken`
4. Zustand atualizado; request original reexecutada

**Persistência de sessão (reload de página):**

Ao recarregar a página, o `accessToken` em memória é perdido. O interceptor faz uma chamada silenciosa a `POST /auth/refresh` no mount do `app/` — se o cookie ainda for válido, a sessão é restaurada sem redirecionamento para login.

### 6.2 Logout

1. `POST /auth/logout` → API invalida o refresh token no banco
2. `auth.store.logout()` → limpa `accessToken` e `user` do Zustand
3. TanStack Query client é resetado (`.clear()`)
4. Redirect para `/login`

---

## 7. Design System

### 7.1 Tokens CSS (CSS Variables)

Definidos em `src/app/globals.css` e mapeados no `tailwind.config.ts`.

```css
:root {
  /* Brand */
  --color-primary:          #7A1515;
  --color-primary-hover:    #991C1C;
  --color-primary-dark:     #3D0808;

  /* Neutrals */
  --color-bg:               #FAF5F5;
  --color-surface:          #FFFFFF;
  --color-border:           #F2E8E8;
  --color-text:             #1A0505;
  --color-text-secondary:   #9E7E7E;

  /* Semantic */
  --color-success:          #2D7A4A;
  --color-warning:          #B87414;
  --color-danger:           #C0392B;
  --color-info:             #2563EB;
}

.dark {
  --color-bg:               #1A0505;
  --color-surface:          #3A1A1A;
  --color-border:           #5C2A2A;
  --color-text:             #FFFFFF;
  --color-text-secondary:   #E8D5D5;
}
```

**Modo padrão: dark.** Toggle disponível via `ui.store.ts`.

### 7.2 Tipografia

| Token | Fonte | Tamanho | Peso | Uso |
|---|---|---|---|---|
| `display-xl` | Cormorant Garamond | 48px | 700 | Hero / Splash |
| `display-lg` | Cormorant Garamond | 36px | 700 | Títulos de página |
| `display-md` | Cormorant Garamond | 28px | 600 | Cabeçalhos de seção |
| `display-sm` | Cormorant Garamond | 22px | 600 | Nome de eventos, cards |
| `body-lg` | Inter | 16px | 400 | Corpo principal |
| `body-md` | Inter | 14px | 400 | Corpo secundário |
| `body-sm` | Inter | 12px | 400 | Legendas, hints |
| `label-lg` | DM Sans | 14px | 500 | Labels de formulário |
| `label-md` | DM Sans | 12px | 500 | Status badges, chips |
| `label-sm` | DM Sans | 10px | 400 | Metadados, timestamps |

Fontes carregadas via Google Fonts com `<link rel="preload">` + `display=swap` (sem FOUT).

### 7.3 Espaçamento

Base unit: **4px**. Tokens: `sp-1` (4px) → `sp-2` (8px) → `sp-4` (16px) → `sp-6` (24px) → `sp-8` (32px) → `sp-16` (64px).

### 7.4 Componentes Base (components/)

| Componente | Descrição |
|---|---|
| `Button` | Variantes: primary, secondary, ghost, danger; tamanhos: sm, md, lg |
| `Badge` | Status visual: CONFIRMADO, PENDENTE, RECUSADO, CANCELADO, CONFLITO |
| `Input` / `Textarea` | Campos de formulário com erro inline |
| `Select` | Dropdown acessível (Radix UI) |
| `Modal` | Overlay com backdrop, animação fade+scale |
| `Drawer` | Right drawer 400px (desktop) / full-screen (mobile) |
| `BottomSheet` | Sheet que sobe do rodapé (mobile) |
| `Toast` | Notificações temporárias: success, danger, warning |
| `Skeleton` | Placeholder de loading para cards e listas |
| `Avatar` | Foto ou iniciais do músico, tamanhos: sm/md/lg |
| `FAB` | Botão de ação flutuante 56×56px |

### 7.5 Ícones

**Lucide React** — `import { Calendar, Music, AlertTriangle } from 'lucide-react'`  
Tamanhos: 16px (inline), 20px (botões/listas), 24px (nav), 32px (empty states).

---

## 8. Variáveis de Ambiente

Arquivo `.env.example` com todas as chaves. Nunca commitar `.env` com dados reais.  
Prefixo obrigatório `VITE_` para exposição ao browser.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | Sim | Base URL da API (ex: `https://api.cappella.app`) |
| `VITE_APP_ENV` | Sim | `development`, `staging` ou `production` |

Ambientes: `.env.development`, `.env.staging`, `.env.production`

---

## 9. Testes

### Estratégia

| Tipo | Ferramenta | Cobertura mínima |
|---|---|---|
| Unit tests (hooks + services) | Vitest + React Testing Library | 70% nos hooks de domínio |
| Testes de componente | React Testing Library | Componentes de formulário e estados críticos |
| E2E | Playwright | Fluxos principais por role |

### Casos obrigatórios a cobrir

**Auth:**
- Login com credenciais válidas redireciona para rota correta por role
- Login com credenciais inválidas exibe toast de erro
- Rota protegida sem autenticação redireciona para `/login`
- Refresh token restaura sessão ao recarregar página

**Events:**
- Formulário de criação valida campos obrigatórios antes de submeter
- Evento criado aparece no calendário sem reload manual

**Allocations:**
- Conflito detectado exibe modal de resolução com dados do evento conflitante
- Músico confirma alocação; badge de status atualiza imediatamente

### Setup de Testes

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

MSW (Mock Service Worker) para interceptar requests Axios nos testes de hook.

---

## 10. CI/CD Pipeline

### Pipeline Principal (`ci.yml`)

Disparado em: push e PR para `main` e `develop`

| Etapa | O que faz |
|---|---|
| `lint` | ESLint + Prettier check |
| `type-check` | `tsc --noEmit` |
| `test` | Vitest com coverage report |
| `build` | `vite build` — valida que o bundle compila sem erros |
| `e2e` | Playwright contra preview deployment do Vercel |

### Deploy (`deploy.yml`)

Disparado em: push na `main`

- Vercel CLI faz deploy automático via `VERCEL_TOKEN` (secret do repositório)
- URL de preview gerada em PRs automaticamente

### `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 11. Padrões de Código

### Formatter
Prettier: mesma configuração do backend — semi, trailing commas, single quotes, print width 80, tab width 2, LF.

### Linter
ESLint com `@typescript-eslint` + plugin React + plugin React Hooks.  
Regra adicional: proibir imports entre domínios (`no-restricted-imports` configurado no `.eslintrc`).

### Imports
Usar path aliases configurados no `tsconfig.json` e `vite.config.ts`:

| Alias | Aponta para |
|---|---|
| `@/app` | `src/app` |
| `@/components` | `src/components` |
| `@/domains` | `src/domains` |
| `@/layouts` | `src/layouts` |
| `@/lib` | `src/lib` |
| `@/pages` | `src/pages` |
| `@/store` | `src/store` |
| `@types` | `packages/types/src` |

### Conventional Commits
Mesma convenção do backend: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`.

---

## 12. Scripts NPM

| Script | Ação |
|---|---|
| `dev` | Inicia Vite dev server (HMR) |
| `build` | Build de produção para `dist/` |
| `preview` | Serve o build de produção localmente |
| `type-check` | Verifica tipos sem emitir arquivos |
| `lint` | Roda ESLint com auto-fix |
| `format` | Roda Prettier com write |
| `test` | Roda Vitest em modo watch |
| `test:run` | Roda Vitest uma vez (CI) |
| `test:cov` | Roda Vitest com coverage |
| `e2e` | Roda Playwright |

---

## 13. Checklist de Implementação

### Setup Base
- [ ] Vite + React + TypeScript inicializado
- [ ] Tailwind CSS configurado com tokens CSS do design system
- [ ] Path aliases configurados (`@/components`, `@/domains`…)
- [ ] `packages/types` linkado via pnpm workspace
- [ ] Prettier + ESLint configurados (regra de cross-domain import)
- [ ] `.env.development` configurado com `VITE_API_URL` apontando para API local

### Autenticação
- [ ] `auth.store.ts` com `user`, `accessToken`, `login()`, `logout()`
- [ ] Instância Axios com interceptor de request (inject token) e response (refresh automático)
- [ ] `ProtectedRoute` com verificação de role
- [ ] Restauração silenciosa de sessão no mount (`POST /auth/refresh`)

### Layout
- [ ] Shell responsivo: Sidebar 240px (desktop) / drawer overlay (mobile)
- [ ] Sidebar colapsa para 64px com transição `width 220ms ease-out`
- [ ] Topbar sticky 64px com título, busca e avatar
- [ ] Right drawer 400px (desktop) / push full-screen (mobile)
- [ ] Modo dark como padrão; toggle funcional

### Domínios
- [ ] `domains/events/` com hooks, service e componentes de card/form
- [ ] `domains/musicians/` com hooks e service
- [ ] `domains/allocations/` com hooks, service e conflict modal
- [ ] `domains/auth/` com formulário de login e fluxo de reset de senha
- [ ] `domains/users/` com hooks para `/users/me`

### Calendário
- [ ] Vista Mensal funcional (Fase 0)
- [ ] Vista Semanal com eixo de tempo (Fase 1)
- [ ] Vista Diária (Fase 1)
- [ ] Vista Anual (Fase 1)
- [ ] Indicador de horário atual (linha vermelha)
- [ ] Navegação por período com setas e botão "Hoje"

### Qualidade
- [ ] 70% de cobertura nos hooks de domínio
- [ ] Fluxos de login e criação de evento cobertos por Playwright
- [ ] `tsc --noEmit` sem erros
- [ ] `npm run build` sem warnings de bundle
- [ ] Lighthouse performance ≥ 85 no build de produção

### CI/CD
- [ ] GitHub Actions configurado (lint + type-check + test + build)
- [ ] Deploy automático na Vercel ao merge na `main`
- [ ] Preview URLs funcionando em PRs
- [ ] `VITE_API_URL` configurado nos ambientes do Vercel
