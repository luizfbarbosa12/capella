# Cappella

Sistema de agenda e escalação de músicos para eventos — desenvolvido para centralizar o gerenciamento que antes era feito em planilhas.

## Visão Geral

O Cappella permite que coordenadores criem e gerenciem eventos musicais, aloquem músicos, detectem conflitos de agenda automaticamente e enviem notificações de confirmação. Músicos podem confirmar ou rejeitar alocações diretamente pelo app mobile ou web.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS · PostgreSQL 15 · Prisma ORM · TypeScript |
| Web | React 18 · Vite · TanStack Query · Zustand · Tailwind CSS |
| Mobile | React Native · Expo |
| Tipos compartilhados | `packages/types` (TypeScript) |
| Deploy | Vercel |

## Estrutura do Monorepo

```
apps/
  api/        # Backend NestJS (REST API)
  web/        # SPA React + Vite
  mobile/     # App React Native Expo
packages/
  types/      # Tipos TypeScript compartilhados entre apps
context/      # Documentação de especificações e épicos
```

## Fases de Entrega

| Fase | Nome | Objetivo |
|---|---|---|
| F0 | Scary Skeleton | Login + criar eventos + calendário |
| F1 | Agenda + Alocação | Alocar músicos, detecção de conflitos, notificações por e-mail |
| F2 | App Mobile | Músicos confirmam via app nativo |
| F3 | Google Calendar | Sincronização com calendário externo |

## Desenvolvimento Local

### Pré-requisitos

- Node.js 20.x LTS
- PostgreSQL 15
- pnpm (gerenciador de pacotes)

### Instalação

```bash
pnpm install
```

### Variáveis de Ambiente

Copie os arquivos de exemplo e preencha com suas credenciais:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### Rodando os apps

```bash
# Backend
pnpm --filter api dev

# Web
pnpm --filter web dev

# Mobile
pnpm --filter mobile start
```

## Autenticação

JWT com Access Token (24h) e Refresh Token (7d) com rotação obrigatória. Dois papéis: `ADMIN` (coordenador) e `MUSICIAN`.

## Documentação

Especificações detalhadas disponíveis em [`context/`](context/):

- [`guide.md`](context/guide.md) — Estratégia de delivery e fases
- [`backend_especificacao_completa.md`](context/backend_especificacao_completa.md) — Arquitetura e módulos da API
- [`frontend_especificacao_completa.md`](context/frontend_especificacao_completa.md) — Stack e estrutura do frontend
- [`epicos.md`](context/epicos.md) — Épicos e critérios de aceite
- [`ux-design-framework.md`](context/ux-design-framework.md) — Diretrizes de UX/UI
