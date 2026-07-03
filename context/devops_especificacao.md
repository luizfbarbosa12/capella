# Cappella — DevOps: Especificação Técnica

**Documento:** Especificação DevOps / CI / Release  
**Data:** 02 de julho de 2026  
**Status:** CI implementado · CD pendente (detalhes de infra em definição)

---

## 1. Visão Geral

> **Escopo atual: apenas CI.** O pipeline de CD (deploy automatizado) será adicionado quando os detalhes de infraestrutura e plataforma de deploy estiverem definidos.

```
PR aberta (feature → staging) ou (staging → main)
        │
        ▼
  ci.yml (CI)
  lint + type-check + test + build
        │
        └── Passou? ──────────▶  PR liberada para aprovação e merge
                                          │
                                          └── Deploy feito MANUALMENTE
                                              (CD será adicionado futuramente)
```

---

## 2. Estratégia de Branches

**Modelo: 2 branches permanentes** — `main` (produção) e `staging` (integração).

```
main         ← produção — só recebe merges de staging via PR
└── staging  ← integração — feature branches nascem e morrem aqui
     ├── feat/event-crud
     ├── feat/allocation-panel
     ├── fix/conflict-detection
     └── chore/update-deps
```

### Regras

| Regra | Detalhe |
|---|---|
| Feature branches nascem de `staging` | `git checkout -b feat/x staging` |
| Feature branches mergeiam em `staging` | Nunca direto em `main` |
| `staging` → `main` via PR | Representa uma promoção para produção |
| `main` é sempre o que está em produção | Nunca commitar direto em main |
| Squash merge obrigatório | Histórico linear e legível |
| Branch deletada após merge | Sem acúmulo de branches mortas |
| Conventional Commits | `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `ci:` |

### Branch Protection Rules em `main`

- ✅ Require pull request before merging
- ✅ Require 1 approving review
- ✅ Dismiss stale reviews on new push
- ✅ Require status checks to pass (`ci / lint-and-type-check`, `ci / test`, `ci / build`)
- ✅ Require branches to be up to date before merging
- ❌ Allow force pushes (nunca)
- ❌ Allow deletions of main

### Branch Protection Rules em `staging`

- ✅ Require pull request before merging
- ✅ Require status checks to pass (`ci / lint-and-type-check`, `ci / test`, `ci / build`)
- ❌ Allow force pushes (nunca)

---

## 3. Ambientes

| Ambiente | Branch | Propósito |
|---|---|---|
| **Staging** | `staging` | Integração de features; validação antes de promover para produção |
| **Production** | `main` | Código validado; representa o que está no ar |

> Deploy de ambos os ambientes é **manual por enquanto**. Quando o CD for implementado, staging deployará a cada merge em `staging` e produção a cada tag `v*.*.*`.

### Variáveis de ambiente por ambiente

Nunca compartilhar `DATABASE_URL` de produção com staging.

| Variável | Staging | Production |
|---|---|---|
| `DATABASE_URL` | DB de staging | DB de produção |
| `JWT_SECRET` | Secret dedicado | Secret forte gerado |
| `NODE_ENV` | `staging` | `production` |
| `VITE_API_URL` | URL da API staging | URL da API prod |

---

## 4. Workflows GitHub Actions

### 4.1 `ci.yml` — Integração Contínua

**Trigger:** push em `staging` + PRs para `staging` ou `main`  
**Objetivo:** garantir que todo código integrado passou por lint, type-check, testes e build

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches:
      - staging     # CI roda após cada merge em staging
  pull_request:
    branches:
      - staging     # PRs de feature → staging
      - main        # PR de staging → main (promoção para produção)

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: 'apps/web/package-lock.json' }
      - run: npm ci
        working-directory: apps/web
      - run: npm run lint
        working-directory: apps/web
      - run: npm run type-check
        working-directory: apps/web

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: 'apps/web/package-lock.json' }
      - run: npm ci
        working-directory: apps/web
      - run: npm run test:run
        working-directory: apps/web

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, test]   # só builda se lint + test passarem
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: 'apps/web/package-lock.json' }
      - run: npm ci
        working-directory: apps/web
      - run: npm run build
        working-directory: apps/web
        env:
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}
          VITE_APP_ENV: staging
```

---

> **Workflows de deploy (`deploy-staging.yml`, `deploy-production.yml`) não implementados ainda.** Serão adicionados quando os detalhes de infraestrutura estiverem definidos. O release tag pode ser criado agora; o deploy após a tag permanece manual.

---

### 4.2 `release.yml` — Release Automático com semantic-release

**Trigger:** push em `main` (a cada merge de `staging` → `main`)  
**Objetivo:** analisar os commits desde a última tag, determinar o bump de versão automaticamente e criar a tag + GitHub Release

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0              # histórico completo obrigatório para semantic-release
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run semantic-release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Configuração em `.releaserc.json` na raiz do repositório:
```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github"
  ]
}
```

> **`GITHUB_TOKEN` é injetado automaticamente pelo GitHub Actions** — nenhum secret manual necessário para o release funcionar. Se os commits do merge contiverem apenas `chore:`, `docs:` ou `test:`, nenhuma tag é criada (comportamento esperado).

O deploy para produção continua **manual** até que o CD seja implementado.

---

## 5. Versionamento — Semantic Versioning Automático

O semantic-release lê os **Conventional Commits** desde a última tag e determina o bump automaticamente. Não é necessário decidir a versão manualmente.

### Como o commit determina o bump

| Tipo de commit | Bump | Exemplo |
|---|---|---|
| `fix:` | PATCH | `v1.0.0` → `v1.0.1` |
| `feat:` | MINOR | `v1.0.0` → `v1.1.0` |
| `feat!:` ou `BREAKING CHANGE:` no rodapé | MAJOR | `v1.0.0` → `v2.0.0` |
| `chore:`, `docs:`, `refactor:`, `test:`, `ci:` | **Nenhum** | Sem tag criada |

> Se um merge em `main` contiver apenas `chore:` e `docs:`, o semantic-release não cria nenhuma tag. É o comportamento correto.

### Formato: `vMAJOR.MINOR.PATCH`

| Tipo | Significado |
|---|---|
| `MAJOR` | Breaking change — ex: novo sistema de auth, mudança de API |
| `MINOR` | Nova feature backward-compatible — ex: vista semanal do calendário |
| `PATCH` | Bug fix, correção, ajuste visual |

### Faseamento do Projeto

| Fase | Versão esperada | Conteúdo |
|---|---|---|
| Fase 0 — Scary Skeleton | `v0.1.0` | Auth + Criar evento + Calendário mensal |
| Fase 1 — Alocação | `v0.2.0` | Alocação + Conflito + Email |
| MVP estável | `v1.0.0` | Fase 0 + Fase 1 validados em produção |
| Fase 2 — Mobile | `v1.1.0` | App React Native |
| Fase 3 — Google Calendar | `v1.2.0` | Sync Google Calendar |

---

## 6. Secrets — O que configurar no GitHub

Acessar em: **GitHub repo → Settings → Secrets and variables → Actions**

> Secrets de deploy (Vercel tokens, DATABASE_URL de produção, etc.) serão adicionados quando o CD for implementado. Por enquanto, apenas o `GITHUB_TOKEN` nativo do Actions é necessário para o `release.yml`.

| Secret | Onde usar | Status |
|---|---|---|
| `GITHUB_TOKEN` | `release.yml` — criar tags e releases | ✅ Automático (GitHub injeta) |
| `VERCEL_TOKEN` | Deploy workflows (futuro) | ⏳ Pendente |
| `VERCEL_ORG_ID` | Deploy workflows (futuro) | ⏳ Pendente |
| `VERCEL_WEB_PROJECT_ID` | Deploy web (futuro) | ⏳ Pendente |
| `STAGING_API_URL` | CI build + deploy staging (futuro) | ⏳ Pendente |
| `PRODUCTION_API_URL` | Deploy production (futuro) | ⏳ Pendente |

**Nunca commitar secrets em arquivos.**

---

## 7. GitHub Environments

Criar em: **GitHub repo → Settings → Environments** — configurar quando o CD for implementado.

### `staging` (futuro)
- No protection rules (deploy automático no merge em staging)
- Environment URL: `https://staging.cappella.app`

### `production` (futuro)
- Required reviewers: 1
- Environment URL: `https://cappella.app`
- Secrets próprios: `DATABASE_URL` de produção

---

## 8. Fluxo Completo — Do Código ao Usuário

```
1. Developer cria branch de staging:
   git checkout -b feat/event-crud staging

2. Developer faz commits:
   git commit -m "feat: create event endpoint"
   git commit -m "feat: add calendar month view"

3. Abre PR: feat/event-crud → staging
   → ci.yml dispara (lint + type-check + test + build)
   → Revisão do código
   → PR aprovada → merge em staging

4. Staging acumulou features suficientes para release?
   → Abrir PR: staging → main
   → ci.yml dispara novamente (garantia extra)
   → PR aprovada → merge em main

5. Release automático:
   → release.yml dispara após o merge em main
   → semantic-release lê os commits desde a última tag
   → Determina o bump (patch / minor / major) pelos tipos de commit
   → Cria a tag (ex: v0.2.0) e o GitHub Release com changelog
   → Se só há chore:/docs: nos commits, nenhuma tag é criada

6. Deploy manual (por enquanto):
   → ⚠️ CD não implementado ainda
   → Deploy feito manualmente via Vercel CLI ou dashboard
   → Quando CD for adicionado, a tag disparará o deploy automaticamente
```

---

## 9. Checklist de Configuração Inicial

### GitHub — Fazer agora
- [ ] Criar branch `staging` a partir de `main`
- [ ] Configurar branch protection em `main` (Settings → Branches)
- [ ] Configurar branch protection em `staging` (Settings → Branches)
- [ ] Ativar "Automatically delete head branches" (Settings → General)
- [ ] Criar `.github/workflows/ci.yml`
- [ ] Criar `.github/workflows/release.yml` (semantic-release — já criado)
- [ ] Criar `.releaserc.json` na raiz do repositório (já criado)

### GitHub — Fazer quando CD for implementado
- [ ] Criar environments `staging` e `production` (Settings → Environments)
- [ ] Adicionar secrets de deploy (Settings → Secrets and variables → Actions)
- [ ] Criar `.github/workflows/deploy-staging.yml`
- [ ] Criar `.github/workflows/deploy-production.yml`

### Vercel — Fazer quando CD for implementado
- [ ] Criar dois projetos: `cappella-web-staging` e `cappella-web-production`
- [ ] Configurar env vars por ambiente
- [ ] Desativar deploy automático do Vercel via Git (deixar apenas para o Actions)
