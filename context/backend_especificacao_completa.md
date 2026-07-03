# Backend: Especificação Técnica — Guia de Referência

**Documento:** Especificação Backend  
**Data:** 02 de julho de 2026  
**Tech Stack:** NestJS · PostgreSQL · Prisma ORM · TypeScript  
**Status:** Pronto para implementação

---

## 1. Stack & Decisões Técnicas

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Runtime | Node.js 20.x LTS | LTS estável, suporte a ES modules modernos |
| Framework | NestJS | Arquitetura modular, DI nativo, suporte a decorators |
| Linguagem | TypeScript (strict) | Type safety end-to-end, melhor DX com Prisma |
| ORM | Prisma | Schema-first, migrations declarativas, type-safe client |
| Banco | PostgreSQL 15 | Suporte a arrays nativos (instruments[]), JSONB, índices robustos |
| Autenticação | JWT (Access + Refresh Token) | Stateless, compatível com mobile e web |
| Hash de senha | bcrypt (rounds: 10) | Padrão da indústria |
| Validação | class-validator + class-transformer | Integrado com NestJS pipes |
| Testes | Jest + Supertest | Unit tests e E2E |
| CI/CD | GitHub Actions | Pipeline automatizado por branch |
| Deploy | Vercel (backend serverless) | Integração direta com GitHub |

---

## 2. Estrutura de Pastas

```
musica-joinville/
├── .github/
│   └── workflows/
│       ├── test-and-build.yml     # Pipeline principal
│       └── deploy.yml             # Deploy para produção
│
├── apps/
│   ├── api/                       # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/           # Funcionalidades organizadas por domínio
│   │   │   │   ├── auth/
│   │   │   │   ├── events/
│   │   │   │   ├── musicians/
│   │   │   │   ├── allocations/
│   │   │   │   └── users/
│   │   │   ├── common/            # Guards, decorators, filtros, interceptors, pipes
│   │   │   ├── config/            # Configurações de DB, JWT e variáveis de ambiente
│   │   │   ├── database/          # Migrations SQL e seeders
│   │   │   └── types/             # Tipos TypeScript globais compartilhados
│   │   ├── prisma/
│   │   │   └── schema.prisma      # Fonte de verdade do modelo de dados
│   │   ├── test/                  # Testes E2E
│   │   └── [config files]         # .env, .prettierrc, .eslintrc, jest.config, tsconfig, package.json
│   │
   ├── web/                       # Frontend React + Vite
│   └── mobile/                    # React Native Expo
│
└── packages/
    └── core/                      # Tipos compartilhados entre apps
```

### Estrutura interna de cada módulo

Cada módulo em `src/modules/` segue a mesma convenção:

```
<módulo>/
├── <módulo>.controller.ts    # Rotas HTTP e decorators
├── <módulo>.service.ts       # Regras de negócio
├── <módulo>.module.ts        # Registro NestJS do módulo
├── dtos/                     # Data Transfer Objects (entrada e saída)
└── entities/                 # Tipos de entidade (para uso interno e tipagem)
```

---

## 3. Modelo de Dados

### 3.1 Entidades e Relacionamentos

```
User ──────────────┐
  │                │ 1:1
  │          Musician ──────────────────┐
  │                │ 1:N               │ 1:N
  │           Allocation          Unavailability
  │ 1:N           │
Event ─────────────┘
  │ 1:N
  ├── Allocation
  └── EventHistory
```

---

### 3.2 Entidade: `User`

Tabela: `users`

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `email` | String | Único, obrigatório | Login principal |
| `password` | String | Obrigatório | Armazenado como hash bcrypt |
| `name` | String | Obrigatório | Nome completo |
| `role` | Enum `UserRole` | Default: `MUSICIAN` | `ADMIN` ou `MUSICIAN` |
| `whatsapp` | String | Opcional | Número com DDD |
| `createdAt` | DateTime | Auto | — |
| `updatedAt` | DateTime | Auto | — |

**Relacionamentos:**
- 1:1 → `Musician` (opcional, apenas para role `MUSICIAN`)
- 1:N → `Event` (eventos criados pelo usuário)
- 1:N → `Allocation` (alocações registradas pelo usuário)
- 1:N → `Unavailability`

**Enum `UserRole`:** `ADMIN` | `MUSICIAN`

---

### 3.3 Entidade: `Musician`

Tabela: `musicians`

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `userId` | String | FK → User, Único | Cascade delete |
| `instruments` | String[] | Obrigatório | Array de nomes de instrumentos |
| `status` | Enum `MusicianStatus` | Default: `ACTIVE` | — |
| `availabilityType` | Enum `AvailabilityType` | Default: `MANUAL` | — |
| `googleCalendarToken` | String | Opcional | Para integração futura |
| `createdAt` | DateTime | Auto | — |
| `updatedAt` | DateTime | Auto | — |

**Relacionamentos:**
- 1:1 → `User` (pai)
- 1:N → `Allocation`
- 1:N → `Unavailability`

**Enum `MusicianStatus`:** `ACTIVE` | `INACTIVE`

**Enum `AvailabilityType`:** `MANUAL` | `GOOGLE_CALENDAR`

---

### 3.4 Entidade: `Event`

Tabela: `events`

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `createdById` | String | FK → User | Quem criou o evento |
| `type` | Enum `EventType` | Obrigatório | Tipo de evento |
| `clientName` | String | Obrigatório | Nome do cliente/contratante |
| `date` | DateTime | Obrigatório | Data do evento (indexado) |
| `timeStart` | DateTime | Obrigatório | Horário de início |
| `timeEnd` | DateTime | Obrigatório | Horário de término |
| `location` | String | Obrigatório | Nome do local |
| `city` | String | Obrigatório | Cidade |
| `neighborhood` | String | Opcional | Bairro |
| `budgetTotal` | Float | Obrigatório | Orçamento total do evento |
| `notes` | String | Opcional | Observações gerais |
| `status` | Enum `EventStatus` | Default: `CREATED` | Indexado |
| `createdAt` | DateTime | Auto | — |
| `updatedAt` | DateTime | Auto | — |

**Índices:** `date`, `status`

**Relacionamentos:**
- N:1 → `User` (criador)
- 1:N → `Allocation`
- 1:N → `EventHistory`

**Enum `EventType`:** `C` (Casamento) | `J` (Jantar) | `CO` (Corporativo)

**Enum `EventStatus`:** `CREATED` → `IN_SELECTION` → `CONFIRMED` → `REALIZED` → `FINISHED` | `CANCELED`

---

### 3.5 Entidade: `Allocation`

Tabela: `allocations`  
Representa um músico escalado para um evento.

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `eventId` | String | FK → Event | Cascade delete |
| `musicianId` | String | FK → Musician | Cascade delete |
| `userId` | String | FK → User | Quem fez a alocação |
| `instruments` | String[] | Obrigatório | Instrumentos específicos para este evento |
| `cacheValue` | Float | Obrigatório | Valor a receber pelo músico |
| `helpCost` | Float | Opcional | Custo de ajuda de custo |
| `helpCostType` | Enum `HelpCostType` | Opcional | Tipo do custo adicional |
| `status` | Enum `AllocationStatus` | Default: `PROPOSED` | Indexado |
| `confirmedAt` | DateTime | Opcional | Preenchido na confirmação |
| `rejectedAt` | DateTime | Opcional | Preenchido na rejeição |
| `rejectionReason` | String | Opcional | Motivo da recusa |
| `attended` | Boolean | Opcional | Presença no evento |
| `attendedAt` | DateTime | Opcional | Data/hora de registro da presença |
| `notes` | String | Opcional | Observações da alocação |
| `createdAt` | DateTime | Auto | — |
| `updatedAt` | DateTime | Auto | — |

**Constraint única:** `(eventId, musicianId)` — um músico só pode ser escalado uma vez por evento.

**Índices:** `musicianId`, `status`

**Enum `AllocationStatus`:** `PROPOSED` | `CONFIRMED` | `REJECTED` | `CANCELED` | `REALIZED` | `NOT_ATTENDED`

**Enum `HelpCostType`:** `FIXED` | `PER_KM` | `FOOD`

---

### 3.6 Entidade: `Unavailability`

Tabela: `unavailability`  
Bloqueia datas em que um músico não está disponível.

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `musicianId` | String | FK → Musician | Cascade delete |
| `dateStart` | DateTime | Obrigatório | Início do período de indisponibilidade |
| `dateEnd` | DateTime | Obrigatório | Fim do período de indisponibilidade |
| `reason` | String | Opcional | Motivo |
| `createdAt` | DateTime | Auto | — |

**Índices:** `musicianId`, `(dateStart, dateEnd)`

---

### 3.7 Entidade: `EventHistory`

Tabela: `event_history`  
Trilha de auditoria de alterações em eventos.

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `eventId` | String | FK → Event | Cascade delete |
| `field` | String | Obrigatório | Nome do campo que foi alterado |
| `oldValue` | String | Opcional | Valor anterior |
| `newValue` | String | Opcional | Novo valor |
| `changedBy` | String | Obrigatório | ID ou email do usuário que fez a alteração |
| `createdAt` | DateTime | Auto | — |

**Índices:** `eventId`, `createdAt`

---

### 3.8 Entidade: `RefreshToken`

Tabela: `refresh_tokens`  
Controle de refresh tokens ativos por usuário.

| Campo | Tipo | Restrições | Notas |
|---|---|---|---|
| `id` | String (CUID) | PK | Auto-gerado |
| `userId` | String | FK → User | Indexado |
| `token` | String | Único | Hash do refresh token |
| `expiresAt` | DateTime | Obrigatório | TTL: 7 dias |
| `createdAt` | DateTime | Auto | — |

**Política:** ao gerar um novo refresh token, todos os tokens anteriores do mesmo usuário devem ser invalidados (rotação de tokens).

---

## 4. Endpoints da API

### 4.1 Autenticação — `/auth`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Pública | Login com email e senha |
| POST | `/auth/refresh` | Pública | Troca refresh token por novo par de tokens |
| POST | `/auth/logout` | JWT | Invalida refresh token atual |

**Login — Request:**
- `email` (string, obrigatório)
- `password` (string, mínimo 6 caracteres)

**Login — Response:**
- `accessToken` — JWT de curta duração (24h)
- `refreshToken` — JWT de longa duração (7d)
- `user` — `{ id, email, name, role }`

---

### 4.2 Eventos — `/events`

Todos os endpoints exigem autenticação JWT.

| Método | Rota | Roles | Descrição |
|---|---|---|---|
| POST | `/events` | ADMIN | Criar evento |
| GET | `/events` | ADMIN | Listar eventos (com filtros opcionais) |
| GET | `/events/:id` | ADMIN | Buscar evento por ID (inclui alocações e histórico) |
| PUT | `/events/:id` | ADMIN | Atualizar evento (registra no histórico) |
| DELETE | `/events/:id` | ADMIN | Remover evento |

**Filtros disponíveis em GET `/events`:** `status`, `date` (range), `type`

**Corpo de criação/atualização:**
- `type` — Enum `EventType`
- `clientName` — string
- `date` — ISO 8601
- `timeStart` — ISO 8601
- `timeEnd` — ISO 8601
- `location` — string
- `city` — string
- `neighborhood` — string, opcional
- `budgetTotal` — número
- `notes` — string, opcional

---

### 4.3 Músicos — `/musicians`

| Método | Rota | Roles | Descrição |
|---|---|---|---|
| GET | `/musicians` | ADMIN | Listar músicos ativos |
| GET | `/musicians/:id` | ADMIN | Buscar músico por ID |
| PUT | `/musicians/:id` | ADMIN | Atualizar dados do músico |
| POST | `/musicians/:id/unavailability` | ADMIN, MUSICIAN | Registrar indisponibilidade |
| DELETE | `/musicians/:id/unavailability/:uid` | ADMIN, MUSICIAN | Remover indisponibilidade |

---

### 4.4 Alocações — `/allocations`

| Método | Rota | Roles | Descrição |
|---|---|---|---|
| POST | `/allocations` | ADMIN | Escalar músico para evento |
| PUT | `/allocations/:id/confirm` | MUSICIAN | Músico confirma participação |
| PUT | `/allocations/:id/reject` | MUSICIAN | Músico recusa participação |
| PUT | `/allocations/:id/cancel` | ADMIN | Admin cancela alocação |
| PUT | `/allocations/:id/attendance` | ADMIN | Registrar presença ou ausência |

**Corpo de criação:**
- `eventId` — string
- `musicianId` — string
- `instruments` — string[] (instrumentos específicos para este evento)
- `cacheValue` — número
- `helpCost` — número, opcional
- `helpCostType` — Enum `HelpCostType`, opcional

---

### 4.5 Usuários — `/users`

| Método | Rota | Roles | Descrição |
|---|---|---|---|
| GET | `/users/me` | ADMIN, MUSICIAN | Retorna perfil do usuário autenticado |
| PUT | `/users/me` | ADMIN, MUSICIAN | Atualizar perfil próprio |

---

## 5. Regras de Negócio

### 5.1 Detecção de Conflito de Horário

Ao criar uma alocação, o sistema deve verificar se o músico já possui outra alocação com status `PROPOSED` ou `CONFIRMED` que se sobreponha ao horário do evento sendo criado. A sobreposição é verificada na mesma `date` usando a lógica: `timeStart_nova < timeEnd_existente AND timeEnd_nova > timeStart_existente`.

Se houver conflito, a operação deve ser rejeitada com HTTP 409, incluindo os dados do evento conflitante na resposta.

### 5.2 Verificação de Indisponibilidade

Antes de confirmar uma alocação, verificar se existe um registro em `Unavailability` para aquele músico que cubra a data do evento (`dateStart <= eventDate <= dateEnd`). Se existir, rejeitar com HTTP 400.

### 5.3 Notificação ao Músico

Após uma alocação ser criada com sucesso, o sistema deve notificar o músico. O canal de notificação é definido nos detalhes de implementação, mas os dados necessários são: email, whatsapp, detalhes do evento (data, horário, local) e valor do cache. Esta funcionalidade pode ser implementada de forma assíncrona.

### 5.4 Histórico de Alterações

Toda alteração em um `Event` deve gerar um registro em `EventHistory` indicando qual campo foi modificado, o valor anterior e o novo valor.

### 5.5 Rotação de Refresh Tokens

Ao usar um refresh token, o token antigo deve ser invalidado e um novo par de tokens (access + refresh) deve ser emitido.

---

## 6. Segurança

### Autenticação
- JWT com dois tokens: access token (24h) e refresh token (7d)
- Senhas armazenadas com bcrypt (rounds: 10)
- Refresh tokens armazenados em banco com TTL explícito

### Autorização
- Guard JWT aplicado globalmente; rotas públicas marcadas explicitamente
- Controle de roles via decorator: `ADMIN` e `MUSICIAN` com permissões distintas
- Músicos só podem confirmar/rejeitar suas próprias alocações

### Dados e Transporte
- Validação de entrada em todos os endpoints (DTOs com class-validator)
- Senhas nunca retornadas em responses
- CORS configurado por variável de ambiente com lista de origens permitidas
- Variáveis sensíveis exclusivamente via variáveis de ambiente (nunca hardcoded)

---

## 7. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | Connection string PostgreSQL |
| `JWT_SECRET` | Sim | Chave do access token |
| `JWT_REFRESH_SECRET` | Sim | Chave do refresh token |
| `JWT_EXPIRATION` | Sim | Duração do access token (ex: `24h`) |
| `NODE_ENV` | Sim | `development`, `production` ou `test` |
| `PORT` | Sim | Porta do servidor (padrão: 3000) |
| `CORS_ORIGIN` | Sim | Lista de origens permitidas separadas por vírgula |
| `LOG_LEVEL` | Sim | `debug`, `info`, `warn`, `error` |
| `SMTP_HOST` | Opcional | Servidor SMTP para emails |
| `SMTP_PORT` | Opcional | Porta SMTP |
| `SMTP_USER` | Opcional | Usuário SMTP |
| `SMTP_PASS` | Opcional | Senha SMTP |
| `WHATSAPP_API_KEY` | Opcional | Chave da API de WhatsApp |
| `GOOGLE_CLIENT_ID` | Opcional | OAuth Google Calendar |
| `GOOGLE_CLIENT_SECRET` | Opcional | OAuth Google Calendar |

Deve existir um arquivo `.env.example` com todas as chaves acima e valores de exemplo. Nunca commitar arquivos `.env` com dados reais.

Ambientes necessários: `.env.development`, `.env.test`, `.env.production`

---

## 8. Banco de Dados

### Migrations

- Gerenciadas via Prisma Migrate
- Cada migration é versionada e commitada no repositório
- Em produção: `prisma migrate deploy` (nunca `migrate dev`)
- Schema declarativo em `prisma/schema.prisma` como única fonte de verdade

### Índices

Índices a serem criados além das PKs e FKs:

| Tabela | Campo(s) | Motivo |
|---|---|---|
| `events` | `date` | Filtragem e ordenação por data |
| `events` | `status` | Filtros por status |
| `allocations` | `musicianId` | Busca de alocações por músico |
| `allocations` | `status` | Filtros de alocações ativas |
| `unavailability` | `musicianId` | Consulta de indisponibilidade |
| `unavailability` | `(dateStart, dateEnd)` | Overlap queries |
| `event_history` | `eventId` | Consulta do histórico de um evento |
| `event_history` | `createdAt` | Ordenação cronológica |
| `refresh_tokens` | `userId` | Consulta/invalidação por usuário |

### Seeder

Deve existir um seeder de desenvolvimento que crie:
- 1 usuário admin (Everton)
- Ao menos 2 músicos com instrumentos variados
- 1 evento de exemplo com alocações

---

## 9. Testes

### Estratégia

| Tipo | Ferramenta | Cobertura mínima |
|---|---|---|
| Unit tests | Jest | 80% nas services |
| E2E tests | Jest + Supertest | Fluxos principais |

### Casos obrigatórios a cobrir

**Auth:**
- Login com credenciais válidas retorna tokens
- Login com senha inválida retorna 401
- Rota protegida sem token retorna 401
- Refresh token rotaciona corretamente

**Events:**
- Criação de evento com dados válidos
- Tentativa de criação com campos obrigatórios ausentes retorna 400

**Allocations:**
- Alocação criada com sucesso quando não há conflito
- Alocação rejeitada com 409 quando há conflito de horário
- Alocação rejeitada com 400 quando músico está com indisponibilidade registrada
- Músico confirma alocação com sucesso
- Músico rejeita alocação com motivo

---

## 10. CI/CD Pipeline

### Pipeline Principal (`test-and-build.yml`)

Disparado em: push e PR para `main` e `develop`

**Jobs em sequência:**

| Etapa | O que faz | Dependências |
|---|---|---|
| `lint-and-format` | Prettier check + ESLint | — |
| `test` | Unit tests + coverage; sobe PostgreSQL via service container | — |
| `build` | Compila TypeScript para `dist/` | `lint-and-format`, `test` |
| `e2e-tests` | Testes E2E contra banco de dados real | `build` |
| `security-scan` | npm audit + OWASP Dependency Check | — |
| `merge-check` | Confirma que todos os jobs passaram | Todos acima |

### Pipeline de Deploy (`deploy.yml`)

Disparado em: push na `main` com sucesso no pipeline principal

- Instala Vercel CLI
- Deploy para produção usando `VERCEL_TOKEN` e `VERCEL_ORG_ID` (secrets do repositório)

### Branch Protection Rules — `main`

- Exigir que todos os status checks do pipeline passem antes do merge
- Exigir aprovação de ao menos 1 revisor
- Dismissal de aprovações ao receber novo push
- Branch deve estar atualizada com a base antes do merge

---

## 11. Padrões de Código

### Formatter
Prettier configurado com: semi, trailing commas, single quotes, print width 80, tab width 2, LF line endings.

### Linter
ESLint com plugin TypeScript. Regras principais: `no-explicit-any` como warning, sem exigência de return type explícito.

### Conventional Commits

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `refactor:` | Refatoração sem mudança de comportamento |
| `test:` | Adição ou atualização de testes |
| `chore:` | Atualização de dependências ou config |
| `ci:` | Mudanças no pipeline |

---

## 12. Scripts NPM

| Script | Ação |
|---|---|
| `start:dev` | Inicia servidor em modo watch |
| `build` | Compila para `dist/` |
| `test` | Roda unit tests |
| `test:cov` | Roda tests com coverage report |
| `test:e2e` | Roda testes E2E |
| `lint` | Roda ESLint com auto-fix |
| `format` | Roda Prettier com write |
| `db:migrate` | Gera e aplica migration (dev) |
| `db:push` | Aplica schema sem migration (prototipação) |
| `db:seed` | Executa seeder de desenvolvimento |
| `db:studio` | Abre Prisma Studio (UI do banco) |

---

## 13. Checklist de Implementação

### Infraestrutura
- [ ] PostgreSQL rodando localmente via Docker Compose
- [ ] `.env.development` configurado
- [ ] Prisma conectado e schema aplicado
- [ ] Migrations geradas para todos os modelos
- [ ] Seeder funcionando com dados de desenvolvimento

### Backend
- [ ] Módulo de Auth completo (login, refresh, logout)
- [ ] Módulo de Events com CRUD completo
- [ ] Módulo de Musicians com busca e indisponibilidade
- [ ] Módulo de Allocations com detecção de conflito
- [ ] Guards JWT aplicados corretamente
- [ ] Controle de roles implementado
- [ ] Histórico de eventos registrado nas alterações
- [ ] Validação de DTOs em todos os endpoints

### Qualidade
- [ ] Cobertura de testes >= 80% nas services
- [ ] Testes E2E cobrindo os fluxos principais
- [ ] Prettier e ESLint sem erros
- [ ] npm audit sem vulnerabilidades críticas

### CI/CD
- [ ] GitHub Actions pipeline configurada
- [ ] Branch protection rules aplicadas no `main`
- [ ] Secrets do Vercel configurados no repositório
- [ ] Deploy automático funcionando após merge no `main`

### Produção
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Banco de produção provisionado e migration aplicada
- [ ] Swagger/OpenAPI habilitado (opcional, recomendado)
