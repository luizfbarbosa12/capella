# Cappella — Épicos de Desenvolvimento
> Avaliação PO Senior | Baseado em: guide.md · backend_especificacao_completa.md · ux-design-framework.md  
> Data de referência: 02 de julho de 2026

---

## LEGENDA

| Símbolo | Significado |
|---|---|
| 🔴 P0 | Bloqueante — não entrega sem isso |
| 🟠 P1 | Alta prioridade — entrega degradada sem isso |
| 🟡 P2 | Média prioridade — melhoria significativa |
| 🟢 P3 | Baixa prioridade — nice-to-have |
| F0–F3 | Fase de entrega (0 = Scary Skeleton … 3 = Google Calendar) |
| ⚪ | Não iniciado |
| 🟡 | Em andamento (parcialmente implementado) |
| 🟢 | Concluído |

---

## STATUS DE IMPLEMENTAÇÃO
> Atualizado em: 03 de julho de 2026

| Épico | Status | Notas de implementação |
|---|---|---|
| EP-DO03 | 🟢 Concluído | `ci.yml`, `release.yml` e `.releaserc.json` implementados e corretos. Branch protection pendente (GitHub Settings). |
| EP-DO01 | 🟡 Em andamento | Estrutura de pastas criada (`apps/api`, `apps/web`, `apps/mobile`, `packages/types`). `.gitignore` e `.env.example` configurados. Docker/Prisma/migrations/seeder pendentes — `apps/api` vazio. |
| EP-DO02 | 🟡 Em andamento | Prettier + ESLint (TypeScript + `no-explicit-any` + `no-restricted-imports`) + Husky/lint-staged configurados. Vitest + RTL + MSW instalados. Testes não escritos ainda. |
| EP-DS01 | 🟡 Em andamento | Tokens CSS (`globals.css`) + Tailwind config (cores, fontes, radius, shadows) + Google Fonts (preload + `display=swap`) prontos. Dark mode padrão (`class="dark"` no `<html>`). Figma e documentação formal pendentes. |
| EP-F01 | 🟡 Em andamento | Vite + React + TS inicializado. Design tokens aplicados. Path aliases configurados. `vercel.json` criado. Dependências instaladas (React Router, TanStack Query, Zustand, Axios, RHF+Zod, Radix UI, Lucide, date-fns). Shell (sidebar, topbar, rotas) **não implementado**. |
| EP-B01 – EP-B07 | ⚪ Não iniciado | `apps/api/` vazio (apenas `.gitkeep`). |
| EP-F02 – EP-F09 | ⚪ Não iniciado | Subpastas de `src/` criadas, todas com apenas `.gitkeep`. |
| EP-M01 – EP-M07 | ⚪ Não iniciado | `apps/mobile/` vazio (apenas `.gitkeep`). |
| EP-DO04 · EP-DO05 | ⚪ Não iniciado | — |
| EP-DS02 – EP-DS05 | ⚪ Não iniciado | — |

---

## STACK CONFIRMADA

> **Backend:** NestJS · PostgreSQL 15 · Prisma ORM · TypeScript (strict)  
> **Frontend Web:** React + Vite (SPA)  
> **Mobile:** React Native Expo  
> Todos os documentos do projeto refletem esta stack.

---

# ÉPICOS — BACKEND

---

## EP-B01 · Autenticação e Autorização
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado  
**Módulo NestJS:** `auth/` + `users/`

### Objetivo
Permitir que coordenadores e músicos acessem o sistema com segurança, com controle de permissões por papel (role).

### Funcionalidades
- Login com e-mail e senha (`POST /auth/login`)
- Emissão de Access Token (JWT, 24h) e Refresh Token (JWT, 7d)
- Renovação de tokens via refresh (`POST /auth/refresh`) com rotação obrigatória — ao usar um refresh token, o anterior é invalidado
- Logout com invalidação do refresh token (`POST /auth/logout`)
- Hash de senhas com bcrypt (rounds: 10) — senha nunca retornada em responses
- Guard JWT aplicado globalmente; rotas públicas marcadas com decorator explícito
- Controle de roles via decorator: `ADMIN` (Everton) e `MUSICIAN`
- Músicos só podem operar em suas próprias alocações
- Tabela `refresh_tokens` com TTL, indexada por `userId`

### Entidades envolvidas
`User` · `RefreshToken`

### Critérios de aceite
- [ ] Login com credenciais válidas retorna par de tokens e dados do usuário
- [ ] Login com senha inválida retorna HTTP 401
- [ ] Rota protegida sem token retorna HTTP 401
- [ ] Refresh token rotaciona corretamente (token antigo invalidado)
- [ ] Refresh token expirado retorna HTTP 401
- [ ] Senha não aparece em nenhum response

### Dependências
- Nenhuma (é o pré-requisito de todos os outros épicos)

---

## EP-B02 · Módulo de Eventos
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado  
**Módulo NestJS:** `events/`

### Objetivo
CRUD completo de eventos com rastreamento de alterações e ciclo de vida por status.

### Funcionalidades
- Criar evento (`POST /events`) — apenas ADMIN
- Listar eventos com filtros opcionais: `status`, `date` (range), `type` (`GET /events`)
- Buscar evento por ID com alocações e histórico incluídos (`GET /events/:id`)
- Atualizar evento (`PUT /events/:id`) — registra alterações em `EventHistory`
- Remover evento (`DELETE /events/:id`)
- Ciclo de status: `CREATED → IN_SELECTION → CONFIRMED → REALIZED → FINISHED | CANCELED`
- Tipos de evento: `C` (Casamento), `J` (Jantar), `CO` (Corporativo)
- Índices em `date` e `status` para performance de queries de calendário

### Entidades envolvidas
`Event` · `EventHistory` · `User` (criador)

### Regras de negócio
- Toda alteração em `Event` gera registro em `EventHistory` com campo, valor anterior e novo valor
- `timeEnd` deve ser posterior a `timeStart`
- `budgetTotal` deve ser positivo

### Critérios de aceite
- [ ] Evento criado com todos os campos obrigatórios retorna HTTP 201
- [ ] Criação com campos obrigatórios ausentes retorna HTTP 400 com detalhes por campo
- [ ] Atualização gera registros em `EventHistory` para cada campo alterado
- [ ] Listagem com filtro `status=CONFIRMED` retorna apenas eventos confirmados
- [ ] Listagem com filtro de range de data funciona corretamente

### Dependências
- EP-B01 (autenticação)

---

## EP-B03 · Módulo de Músicos
**Fase:** F1 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado  
**Módulo NestJS:** `musicians/`

### Objetivo
Gerenciar o cadastro de músicos, seus instrumentos e períodos de indisponibilidade.

### Funcionalidades
- Listar músicos ativos (`GET /musicians`) — apenas ADMIN
- Buscar músico por ID (`GET /musicians/:id`) — apenas ADMIN
- Atualizar dados do músico (`PUT /musicians/:id`) — apenas ADMIN
- Registrar indisponibilidade (`POST /musicians/:id/unavailability`) — ADMIN ou o próprio MUSICIAN
- Remover indisponibilidade (`DELETE /musicians/:id/unavailability/:uid`) — ADMIN ou o próprio MUSICIAN
- Campo `instruments` como array de strings (suporte nativo PostgreSQL)
- Status do músico: `ACTIVE | INACTIVE`
- Índices em `musicianId` e `(dateStart, dateEnd)` na tabela `unavailability`

### Entidades envolvidas
`Musician` · `User` (1:1) · `Unavailability`

### Critérios de aceite
- [ ] MUSICIAN só consegue registrar/remover sua própria indisponibilidade
- [ ] ADMIN consegue registrar indisponibilidade em nome de qualquer músico
- [ ] Músico inativo não aparece na listagem de músicos disponíveis para alocação
- [ ] Indisponibilidade com `dateStart > dateEnd` retorna HTTP 400

### Dependências
- EP-B01 (autenticação e roles)

---

## EP-B04 · Módulo de Alocações e Detecção de Conflito
**Fase:** F1 | **Prioridade:** 🔴 P0 — CRÍTICO | **Status:** ⚪ Não iniciado  
**Módulo NestJS:** `allocations/`

### Objetivo
Escalar músicos para eventos com detecção automática de conflito de horário, gerenciamento do ciclo de confirmação e registro de presença.

### Funcionalidades
- Escalar músico (`POST /allocations`) — apenas ADMIN
- Músico confirma participação (`PUT /allocations/:id/confirm`) — apenas MUSICIAN (própria alocação)
- Músico recusa participação (`PUT /allocations/:id/reject`) — apenas MUSICIAN (própria alocação)
- Admin cancela alocação (`PUT /allocations/:id/cancel`)
- Registrar presença ou ausência pós-evento (`PUT /allocations/:id/attendance`)
- Constraint única `(eventId, musicianId)` — músico só pode ser escalado uma vez por evento
- Ciclo de status: `PROPOSED → CONFIRMED | REJECTED | CANCELED → REALIZED | NOT_ATTENDED`

### Regras de negócio críticas

**Detecção de conflito (5.1):**
Ao criar alocação, verificar se o músico já possui alocação com status `PROPOSED` ou `CONFIRMED` com sobreposição temporal:
```
timeStart_nova < timeEnd_existente AND timeEnd_nova > timeStart_existente
```
Se houver conflito → retornar HTTP 409 com dados do evento conflitante na resposta.

**Verificação de indisponibilidade (5.2):**
Antes de confirmar, verificar `Unavailability` onde `dateStart <= eventDate <= dateEnd`.
Se existir → retornar HTTP 400.

**Campos de alocação:**
- `instruments[]` — instrumentos específicos para este evento
- `cacheValue` — valor a receber
- `helpCost` / `helpCostType` (`FIXED | PER_KM | FOOD`) — opcional
- `rejectionReason` — preenchido no reject

### Critérios de aceite
- [ ] Alocação criada com sucesso quando não há conflito de horário (HTTP 201)
- [ ] Alocação rejeitada com HTTP 409 + detalhes do evento conflitante quando há sobreposição
- [ ] Alocação rejeitada com HTTP 400 quando músico tem indisponibilidade registrada na data
- [ ] Músico não consegue confirmar/rejeitar alocação de outro músico (HTTP 403)
- [ ] Segundo `POST /allocations` com mesmo `(eventId, musicianId)` retorna HTTP 409
- [ ] `confirmedAt` e `rejectedAt` são preenchidos com timestamp correto

### Dependências
- EP-B01 · EP-B02 · EP-B03

---

## EP-B05 · Notificações
**Fase:** F1 (email) · F2 (push) | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado  
**Módulo NestJS:** `notifications/` (a criar)

### Objetivo
Notificar músicos sobre escalações e lembrar sobre eventos pendentes de confirmação.

### Funcionalidades — Fase 1 (Email)
- Trigger assíncrono: alocação criada com sucesso → enviar email ao músico
- Conteúdo do email: nome do evento, data, horário, local, valor do cachê
- Link direto para confirmar/recusar (deep link web)
- Template: "Escalação: [Nome do evento] - [Data]"
- Lembrete 48h para alocações `PROPOSED` sem resposta

### Funcionalidades — Fase 2 (Push)
- Integração com FCM (Firebase Cloud Messaging)
- Push: nova escalação, lembrete 48h, lembrete 24h antes do evento
- Push para Everton: músico confirmou / músico recusou (com deep link para painel de alocação)

### Variáveis de ambiente
`SMTP_HOST` · `SMTP_PORT` · `SMTP_USER` · `SMTP_PASS`

### Critérios de aceite
- [ ] Email disparado após `POST /allocations` bem-sucedido (modo assíncrono, não bloqueia response)
- [ ] Email contém link funcional para confirmação
- [ ] Falha no envio de email não retorna erro para o caller da alocação (fire-and-forget com log)
- [ ] Push notification entregue em < 5s após trigger

### Dependências
- EP-B04

---

## EP-B06 · Módulo de Usuários (Perfil)
**Fase:** F0 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado  
**Módulo NestJS:** `users/`

### Funcionalidades
- Retornar perfil do usuário autenticado (`GET /users/me`)
- Atualizar perfil próprio (`PUT /users/me`) — nome, whatsapp
- Alteração de e-mail exige re-autenticação

### Critérios de aceite
- [ ] `GET /users/me` retorna dados do usuário sem `password`
- [ ] Atualização de e-mail para e-mail já cadastrado retorna HTTP 409

### Dependências
- EP-B01

---

## EP-B07 · Integração Google Calendar
**Fase:** F3 | **Prioridade:** 🟡 P2 | **Status:** ⚪ Não iniciado

### Objetivo
Sincronizar a agenda do músico com o Google Calendar para detecção automática de disponibilidade.

### Funcionalidades
- OAuth 2.0 com Google (Client ID + Secret)
- Sincronização bidirecional: eventos Cappella → Google Calendar do músico
- Músico bloqueia dias automaticamente via Google Calendar
- Campo `googleCalendarToken` na entidade `Musician`
- `availabilityType`: `MANUAL | GOOGLE_CALENDAR`

### Critérios de aceite
- [ ] Músico consegue conectar Google Calendar via OAuth flow
- [ ] Evento criado no Cappella aparece no Google Calendar do músico em < 1 min
- [ ] Evento bloqueado no Google Calendar aparece como indisponibilidade no Cappella

### Dependências
- EP-B03 · EP-B04 · Variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

---

# ÉPICOS — FRONTEND (Web — React)

---

## EP-F01 · Setup e Shell da Aplicação Web
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** 🟡 Em andamento

### Objetivo
Estrutura base da aplicação web com navegação, autenticação de rota e shell visual responsivo.

### Funcionalidades
- Monorepo configurado (`apps/web/`)
- React Router com rotas protegidas por role (`ADMIN` e `MUSICIAN`)
- Sidebar fixa 240px (desktop) / drawer overlay (tablet) com collapse para 64px (ícones)
- Top bar sticky (64px desktop / 56px tablet) com título, busca e avatar
- Right drawer panel (400px) para Allocation Panel e Event quick-view
- Layout grid responsivo: 12 col desktop / 8 col tablet / 4 col mobile
- Dark mode como padrão, light mode disponível via toggle
- Google Fonts carregados: Cormorant Garamond 600/700, Inter 400/500/600, DM Sans 400/500
- Tokens CSS aplicados (cores, espaçamento, radius, elevação) conforme design system

### Critérios de aceite
- [ ] Sidebar com active state correto por rota
- [ ] Sidebar colapsa/expande com transição `width 220ms ease-out`
- [ ] Usuário não autenticado é redirecionado para `/login`
- [ ] Usuário MUSICIAN não acessa rotas exclusivas de ADMIN
- [ ] Right drawer abre/fecha sem scroll da página principal
- [ ] Google Fonts carregados sem FOUT (preload + display=swap)

### Dependências
- EP-B01 (API de autenticação)

---

## EP-F02 · Autenticação Web
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado

### Telas
- `/login` — Splash + formulário de login
- `/forgot-password` — Solicitar reset de senha
- `/reset-password/:token` — Definir nova senha

### Especificação visual
- Background: gradiente `#1A0505 → #3D0808`
- Logo SVG Cappella centralizado (120×120px)
- "Cappella" em Cormorant Garamond 36px 700 branco
- Tagline: "Sua agenda musical, organizada." — Inter 14px 400, `#E8D5D5`
- Card flutuante `#3A1A1A`, `radius-xl`, `elevation-3`
- Campos: e-mail + senha com variante dark
- CTA: botão primário full-width "Entrar"
- Link "Esqueci minha senha" (ghost, Stone color)

### Critérios de aceite
- [ ] Login com credenciais válidas redireciona para `/dashboard` (ADMIN) ou `/inicio` (MUSICIAN)
- [ ] Erro de credenciais exibe toast danger "Credenciais inválidas."
- [ ] Campo senha com toggle de visibilidade
- [ ] "Esqueci minha senha" envia email e exibe feedback de confirmação
- [ ] Access token armazenado em memória; refresh token em httpOnly cookie

### Dependências
- EP-B01 · EP-F01

---

## EP-F03 · Dashboard — Coordenador
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado  
**Rota:** `/dashboard`

### Funcionalidades
- Saudação "Olá, Everton" com avatar e sino de notificações
- Summary row (scroll horizontal): cards [Eventos esta semana], [Pendentes], [Conflitos]
- Cards com borda esquerda 3px Cappella Red e número em Cormorant 28px 700
- Strip semanal (7 dias) com dot indicators de eventos por dia
- Lista "Próximos eventos" com Event Cards (accent bar por status, nome, data/hora, local, músicos)
- FAB fixo bottom-right (56×56px, `#7A1515`, `lucide:plus`)
- Empty state com onboarding progressivo (Passo 1 de 3)

### Critérios de aceite
- [ ] Cards de resumo refletem dados reais em tempo real (ou cache < 60s)
- [ ] FAB navega para `/eventos/novo`
- [ ] Evento card com status `CONFLITO` exibe accent bar vermelha e ícone `alert-triangle`
- [ ] Skeleton loading exibido no primeiro load (3 card skeletons)

### Dependências
- EP-B02 · EP-B04 · EP-F01 · EP-F02

---

## EP-F04 · Agenda — 4 Visualizações de Calendário
**Fase:** F0 (Month) · F1 (Week/Day) · F1 (Year) | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado  
**Rota base:** `/agenda/:view` → `/agenda/year`, `/agenda/month`, `/agenda/week`, `/agenda/day`

### Funcionalidades

**Header compartilhado (todas as views):**
- Segmented control: [Ano] [Mês] [Semana] [Dia] — active pill `#7A1515`
- Setas de navegação por período (`chevron-left / chevron-right`)
- Botão "Hoje" ghost `#7A1515`
- Título em Cormorant 22px 600 (ex: "Julho 2026")
- Estado de data selecionada preservado ao alternar entre views

**Vista Anual:**
- Grid 4×3 (desktop) / 2×6 (mobile) de mini-calendários
- Dot indicator por célula (cor por prioridade: conflito > pendente > confirmado)
- Tap no header do mês → navega para Month view
- Tap em célula com evento → navega para Day view

**Vista Mensal:**
- Grid 7 colunas × 5-6 semanas, cell height min 100px (desktop) / 64px (mobile)
- Event pills (h:22px) com cor por status (confirmed / pending / conflict / default)
- Máx 3 pills por célula + "+N mais"
- Tap em célula vazia → `/eventos/novo` pré-preenchido com data
- Tap em pill → Event Detail bottom sheet
- Multi-day events com span entre colunas

**Vista Semanal:**
- 7 colunas, eixo de tempo (60px/hora), scroll para 7 AM no load
- All-day row no topo
- Indicador de horário atual (linha vermelha + dot `#C0392B`)
- Eventos sobrepostos dividem a largura da coluna proporcionalmente
- Tap em slot vazio → `/eventos/novo` pré-preenchido com data+hora

**Vista Diária:**
- Coluna única, eixo de tempo igual à weekly
- Blocos de evento mais altos (min 44px) com mais detalhes visíveis (venue, músicos)
- Timeline summary bar horizontal (pills cronológicos) acima do grid
- Swipe left/right → dia anterior/próximo (mobile)
- Long-press em bloco → quick actions: [Editar] [Escalar músico] [Cancelar]

**Roteamento web:**
- `/agenda/year` · `/agenda/month` · `/agenda/week` · `/agenda/day` · `/agenda/day/2026-07-04`
- Deep link de notificação → Day view da data do evento

### Critérios de aceite
- [ ] Alternar entre views mantém data selecionada
- [ ] Hoje sempre destacado com fundo `#7A1515` circular
- [ ] Eventos do mês anterior/próximo aparecem esmaecidos na vista mensal
- [ ] Pull-to-refresh funciona em mobile com `RefreshControl tintColor="#7A1515"`
- [ ] Vista anual: dot de conflito sobrepõe dot de pendente (regra de prioridade)
- [ ] Vista semanal: linha de horário atual visível apenas na semana corrente
- [ ] Vista padrão por role: Month (ADMIN) / Week (MUSICIAN)

### Dependências
- EP-B02 · EP-F03

---

## EP-F05 · Gestão de Eventos — CRUD
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado

### Telas
- `/eventos/novo` — Formulário de criação
- `/eventos/:id` — Detalhe do evento
- `/eventos/:id/editar` — Formulário de edição

### Formulário (criação e edição)
Campos em ordem de rolagem única (não multi-step):
1. Nome do evento * (text)
2. Data * (date picker → bottom sheet mobile / native html desktop)
3. Horário de início * (time picker → drum-roll scroll, steps 15 min)
4. Horário de término (opcional, default +2h)
5. Local * (text + `lucide:map-pin`)
6. Tipo de evento (dropdown: Cerimônia / Jantar / Show / Ensaio / Outro)
7. Cachê total (R$) (numeric, prefixo R$)
8. Observações (textarea 4 linhas)

**Validação:**
- Campos obrigatórios marcados com *
- Erro inline abaixo do campo no blur ou submit
- Botão Salvar desabilitado até todos os obrigatórios preenchidos

**Save behavior:**
- Sucesso → navega para Event Detail + toast "Evento salvo."
- Erro → toast danger, campos intactos

**Tela de detalhe:**
- Header com background `#3D0808`, nome em Cormorant 28px 700
- Cards de info: Venue, Budget, Type, Status
- Seção "Músicos escalados" com avatar, nome, instrumento, status badge
- Actions bar sticky: [Editar] [Cancelar evento] [Compartilhar]
- Cancelar evento → confirm dialog antes de executar

### Critérios de aceite
- [ ] Formulário de edição pré-preenchido com valores existentes
- [ ] "Cancelar" na edição exibe confirm dialog se há mudanças não salvas
- [ ] "Cancelar evento" na tela de detalhe exige confirmação explícita
- [ ] Data picker abre bottom sheet no mobile; input nativo no desktop
- [ ] Time picker em steps de 15 minutos

### Dependências
- EP-B02 · EP-F04

---

## EP-F06 · Painel de Alocação (Escalar Músico)
**Fase:** F1 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado  
**Rota:** `/eventos/:id/escalar`

### Funcionalidades
- Right drawer 400px (desktop) / full-screen push (mobile)
- Seção "Escalados": lista de músicos já alocados com avatar, nome, instrumento, status badge e botão remover
- Seção "Adicionar músico":
  - Search bar filtrado inline (sem nova tela)
  - Cada resultado mostra: avatar, nome, instrumento, indicador de disponibilidade
    - `✅ Livre neste horário` (dot verde)
    - `⚠ Ocupado às 18:00` (dot âmbar)
    - `❌ Folga registrada` (dot vermelho)
  - Toque em [Escalar] em músico **livre** → alocação imediata + toast "[Nome] escalado."
  - Toque em [Escalar] em músico **com conflito** → abre modal de Conflict Resolution

### Tela de Resolução de Conflito
- Overlay full-screen
- Ícone `alert-triangle` 32px, Warning color
- "Conflito detectado" — Cormorant 24px 600
- Card do evento existente VS card do novo evento
- [Escolher outro músico] Primary full-width
- [Forçar escalação] Outlined Danger full-width
- [Cancelar] Ghost

### Critérios de aceite
- [ ] Indicador de disponibilidade calculado em tempo real ao abrir o painel
- [ ] Músico escalado aparece imediatamente na seção "Escalados" sem reload
- [ ] Conflict modal exibe nome do evento conflitante, data e horário
- [ ] "Forçar escalação" cria alocação mesmo com conflito e exibe toast warning
- [ ] Remover músico do painel abre confirm antes de executar

### Dependências
- EP-B04 · EP-F05

---

## EP-F07 · Gestão de Músicos (Roster)
**Fase:** F1 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado  
**Rotas:** `/musicos` · `/musicos/novo` · `/musicos/:id`

### Funcionalidades
**Roster `/musicos`:**
- Desktop: tabela com colunas [Avatar+Nome] [Instrumento] [Eventos total] [Status] [Ações]
- Mobile: lista de cards com avatar lg + nome + instrumento + badge de eventos
- Search + filtros: instrumento, status (Ativo/Inativo)
- Hover em row (desktop): [Ver perfil] [Ver agenda]
- Swipe right (mobile): [Ver agenda]
- Botão "+ Convidar músico" → `/musicos/novo`

**Convidar `/musicos/novo`:**
- Campos: Nome *, E-mail *, Instrumento * (dropdown), Telefone
- Submit → envia convite por e-mail com link de login
- Toast: "Convite enviado para [email]."

**Perfil `/musicos/:id`:**
- Header: Avatar xl + Nome Cormorant 28px 600 + Instrumento
- Stats: [Total eventos] [Confirmados] [Recusados]
- Mini-calendário mensal read-only com alocações do músico
- Histórico de eventos scrollable
- [Editar dados] [Ver agenda completa]

### Critérios de aceite
- [ ] Tabela desktop com ordenação por Nome e por Eventos
- [ ] Músico inativo exibe badge cinza e não aparece no painel de alocação
- [ ] Mini-calendário do perfil reflete alocações reais do músico

### Dependências
- EP-B03 · EP-F01

---

## EP-F08 · Central de Notificações Web
**Fase:** F1 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado  
**Rota:** `/notificacoes`

### Funcionalidades
- Desktop: dropdown 380px sob o ícone de sino, max-height 480px com scroll
- Mobile: tela full-screen
- Notificação não lida com dot `#7A1515` e texto em branco
- Notificação lida com fundo transparente e texto `#9E7E7E`
- Ícone colorido por tipo: gig (roxo/vermelho), conflito (âmbar), confirmação (verde), recusa (vermelho)
- Timestamp relativo: "há 2h", "Ontem"
- Agrupamento por seção: "Hoje" / "Ontem" / "Esta semana"
- [Marcar tudo como lido] ghost button
- Tap → deep link para tela relevante
- Empty state: `lucide:bell-off` 32px + "Nenhuma notificação"

### Critérios de aceite
- [ ] Badge no sino reflete contagem de não lidas em tempo real (ou polling 30s)
- [ ] Badge mostra "9+" quando há mais de 9 não lidas
- [ ] Deep link de notificação de conflito abre painel de alocação do evento correto

### Dependências
- EP-B05 · EP-F01

---

## EP-F09 · Perfil e Configurações Web
**Fase:** F0 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado  
**Rota:** `/perfil`

### Funcionalidades
- Header com avatar xl, nome Cormorant 24px 600, role, botão editar
- Seções: Conta, Preferências, Notificações, Sobre, Sair
- Toggle tema escuro/claro
- Vista padrão da agenda (dropdown: Mês / Semana / Dia)
- Toggles de notificação (email e push) por tipo
- "Alterar senha" → tela dedicada
- "Sair" → confirm dialog → invalida tokens e redireciona para `/login`

### Critérios de aceite
- [ ] Toggle de tema aplica imediatamente sem reload
- [ ] Preferência de tema persiste entre sessões (localStorage)
- [ ] "Sair" invalida o refresh token via `POST /auth/logout` antes de redirecionar

### Dependências
- EP-B01 · EP-B06 · EP-F01

---

# ÉPICOS — FRONTEND (Mobile — React Native Expo)

---

## EP-M01 · Setup e Shell do App Mobile
**Fase:** F2 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado

### Objetivo
Estrutura base do app React Native Expo com navegação, safe areas, design system aplicado e stack configurada.

### Funcionalidades
- Expo SDK configurado em `apps/mobile/`
- Navigator tree completo:
  - `RootStack` (auth gate + deep links)
  - `AuthStack` (Login, ForgotPassword)
  - `AppTabs` (Bottom Tab Navigator, 4 abas)
  - Stacks aninhadas por aba (Home, Agenda, Escalação/Eventos, Perfil)
- Bottom Tab Navigator: Início, Agenda, Escalação/Eventos, Perfil
  - Background `#1A0505`, border-top `1px #3A1A1A`, height 60px + safe area
  - Tab inativo: ícone + label `#9E7E7E`; ativo: `#FFFFFF` + indicador top 2px `#7A1515`
- Screen header: background `#1A0505`, título Cormorant 20px 600, back `arrow-left`
- `SafeAreaView` em todos os screens com edges `['top','bottom']`
- Fontes carregadas com `expo-font` (Cormorant Garamond, Inter, DM Sans)
- Lucide React Native para ícones
- `KeyboardAvoidingView` em todos os formulários

### Critérios de aceite
- [ ] Deep link de push notification abre a tela correta do app
- [ ] Tap na aba ativa faz scroll para o topo da lista (via ref)
- [ ] Back gesture (iOS) e botão back (Android) funcionam corretamente
- [ ] Safe area respeitada em todos os devices testados (iPhone notch, Android cutout)

### Dependências
- EP-B01

---

## EP-M02 · Autenticação Mobile
**Fase:** F2 | **Prioridade:** 🔴 P0 (para o app) | **Status:** ⚪ Não iniciado

### Telas
- `LoginScreen` — formulário de login
- `ForgotPasswordScreen` — solicitar reset

### Critérios de aceite
- [ ] Access token armazenado com `expo-secure-store`
- [ ] Auto-login na abertura do app se token válido no storage
- [ ] Sessão expirada redireciona para Login com toast "Sessão expirada."

### Dependências
- EP-B01 · EP-M01

---

## EP-M03 · Meus Eventos — Tela Principal do Músico
**Fase:** F2 | **Prioridade:** 🔴 P0 (para músico) | **Status:** ⚪ Não iniciado  
**Tela:** `MyEventsScreen`

### Funcionalidades
- Título "Meus Eventos", picker de mês
- Filter chips: [Todos] [Confirmados] [Pendentes] [Recusados]
- `FlatList` de event cards com:
  - Accent bar esquerda (cor por status)
  - Nome do evento + data/hora + local + valor do cachê
  - CTAs [Confirmar] / [Recusar] apenas para status `PROPOSED`
- Empty state: ícone clave de sol + "Nenhum evento por aqui ainda."
- Pull-to-refresh

### Critérios de aceite
- [ ] Chip ativo com fundo Cappella Red e texto branco
- [ ] CTAs de confirmação/recusa abrem a tela de confirmação de gig
- [ ] Pull-to-refresh atualiza lista sem piscar a UI

### Dependências
- EP-B04 · EP-M01 · EP-M02

---

## EP-M04 · Confirmação de Gig — Tela Crítica do Músico
**Fase:** F2 | **Prioridade:** 🔴 P0 (CRÍTICO — 1 tap da notificação) | **Status:** ⚪ Não iniciado

### Entry points
- Push notification → deep link direto
- E-mail CTA → link web → bottom sheet
- Tap em event card pendente na lista

### Layout (Bottom Sheet)
- Handle bar para drag
- Nome do evento (Cormorant 22px 600), data, horário, local, cachê
- Verificação de conflito inline (auto-carregada):
  - `✅ Você está livre neste horário.`
  - `⚠ Você já tem outro evento às 18:00. ([Nome do evento])`
- [Confirmar presença] Primary full-width 44px
- [Não posso ir] Outlined Danger full-width 44px
- Pós-confirmação: botões substituídos por "✅ Presença confirmada!", auto-dismiss 1.5s
- Pós-recusa: textarea opcional "Motivo" + [Confirmar recusa]

### Critérios de aceite
- [ ] Tela acessível em 1 tap a partir da push notification
- [ ] Confirmação reflete status `CONFIRMED` instantaneamente na lista de eventos
- [ ] Conflito inline exibido antes de qualquer ação do usuário
- [ ] Toast exibido após confirmação e após recusa

### Dependências
- EP-B04 · EP-M03 · EP-B05

---

## EP-M05 · Calendário Mobile
**Fase:** F2 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado  
**Tela:** `CalendarScreen`

### Funcionalidades
- Vista padrão: Week view para MUSICIAN
- Segmented control (Mês / Semana / Dia)
- Implementação das 3 views (Month, Week, Day) conforme especificação web
- Swipe left/right na Day view → dia anterior/próximo
- Pinch-zoom na Week view → aumenta row height

### Critérios de aceite
- [ ] Performance: 60fps na rolagem do grid de horas (usar `FlatList` otimizada ou `FlashList`)
- [ ] Linha de horário atual visível e atualizada em tempo real

### Dependências
- EP-B02 · EP-M01

---

## EP-M06 · Solicitação de Folga
**Fase:** F2 | **Prioridade:** 🟡 P2 | **Status:** ⚪ Não iniciado  
**Tela:** `DayOffRequestScreen`

### Funcionalidades
- Campos: data início *, data fim (default = início), motivo (opcional)
- Mini-calendário preview com range selecionado destacado em `#7A1515`
- Warning se há eventos alocados no período selecionado
- [Solicitar folga] → toast "Folga registrada." + volta para Perfil

### Critérios de aceite
- [ ] Warning exibe nomes dos eventos conflitantes com o período de folga
- [ ] `dateEnd` não pode ser anterior a `dateStart`

### Dependências
- EP-B03 · EP-M01

---

## EP-M07 · Push Notifications Mobile
**Fase:** F2 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado

### Funcionalidades
- Integração FCM via `expo-notifications`
- Solicitação de permissão na primeira abertura
- Deep links por tipo de notificação:
  - Nova escalação → `EventDetailScreen` com bottom sheet de confirmação
  - Músico confirmou/recusou (Everton) → `AllocationPanelScreen`
  - Lembrete 24h → `EventDetailScreen`

### Critérios de aceite
- [ ] Notificação recebida com app em background abre a tela correta ao tocar
- [ ] Notificação recebida com app em foreground exibe in-app toast
- [ ] Token FCM atualizado no backend ao ser regenerado pelo SO

### Dependências
- EP-B05 · EP-M01

---

# ÉPICOS — DEVOPS

---

## EP-DO01 · Setup de Infraestrutura Local e Monorepo
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** 🟡 Em andamento

### Objetivo
Ambiente de desenvolvimento funcional desde o dia 1, com banco de dados, variáveis de ambiente e estrutura de monorepo configurados.

### Funcionalidades
- Monorepo com estrutura `apps/api`, `apps/web`, `apps/mobile`, `packages/types`
- Docker Compose com PostgreSQL 15 para desenvolvimento local
- `.env.example` com todas as variáveis documentadas (sem valores reais)
- Arquivos `.env.development`, `.env.test`, `.env.production` separados
- Nenhum arquivo `.env` com dados reais commitado (`.gitignore` configurado)
- Prisma conectado e `prisma/schema.prisma` aplicado
- Migrations geradas para todos os modelos (User, Musician, Event, Allocation, Unavailability, EventHistory, RefreshToken)
- Seeder de desenvolvimento: 1 admin (Everton) + 2 músicos + 1 evento com alocações
- Scripts NPM configurados: `start:dev`, `build`, `test`, `test:cov`, `test:e2e`, `lint`, `format`, `db:migrate`, `db:push`, `db:seed`, `db:studio`

### Critérios de aceite
- [ ] `docker-compose up` sobe PostgreSQL sem erros
- [ ] `npm run db:migrate` aplica todas as migrations sem conflito
- [ ] `npm run db:seed` cria dados de desenvolvimento idempotentemente
- [ ] `npm run db:studio` abre Prisma Studio com dados visíveis
- [ ] `npm run start:dev` inicia a API com hot-reload

### Dependências
- Repositório GitHub criado

---

## EP-DO02 · Qualidade de Código — Linting, Formatação e Testes
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** 🟡 Em andamento

### Objetivo
Garantir consistência de código e cobertura mínima de testes antes de qualquer CI/CD.

### Funcionalidades
- Prettier configurado: semicolons, trailing commas, single quotes, print-width 80, tab-width 2, LF line endings
- ESLint com plugin TypeScript: `no-explicit-any` como warning
- ESLint frontend: regra `no-restricted-imports` para proibir imports entre domínios (`domains/*`)
- Conventional Commits como padrão: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`
- Cobertura mínima: ≥ 80% nas services do **backend** (Jest) · ≥ 70% nos hooks de domínio do **frontend** (Vitest + React Testing Library)
- Testes E2E backend: Jest + Supertest cobrindo fluxos principais
- Testes E2E frontend: Playwright cobrindo fluxos de login, criação de evento e confirmação de gig

### Casos de teste obrigatórios

**Auth:**
- Login válido retorna tokens
- Login inválido retorna 401
- Rota protegida sem token retorna 401
- Refresh rotaciona corretamente

**Events:**
- Criação com dados válidos retorna 201
- Criação sem campos obrigatórios retorna 400

**Allocations:**
- Alocação criada sem conflito retorna 201
- Alocação com conflito de horário retorna 409 + detalhes do conflito
- Alocação com indisponibilidade registrada retorna 400
- Músico confirma com sucesso
- Músico rejeita com motivo

### Critérios de aceite
- [x] `npm run lint` sem erros
- [x] `npm run format` sem diff após execução
- [ ] `npm run test:cov` reporta ≥ 80% de cobertura nas services do backend
- [ ] Vitest reporta ≥ 70% de cobertura nos hooks de domínio do frontend
- [ ] Todos os casos de teste obrigatórios passando

### Dependências
- EP-DO01

---

## EP-DO03 · Pipeline CI — GitHub Actions
**Fase:** F0 | **Prioridade:** 🔴 P0

### Objetivo
Pipeline de CI automatizado que garante qualidade em todo push e PR. Deploy é **manual** até que o CD seja implementado em fase futura.

### Pipeline de CI (`ci.yml`)
Disparado em: push em `staging` + PRs para `staging` ou `main`

| Job | Ações | Depende de |
|---|---|---|
| `lint-and-type-check` | ESLint + Prettier check + `tsc --noEmit` | — |
| `test` | Unit tests + coverage | — |
| `build` | Compila TypeScript → `dist/` (backend) / `vite build` (frontend) | `lint-and-type-check`, `test` |

### Release Automático (`release.yml`)
Disparado em: push no `main` — semantic-release lê os commits desde a última tag e cria tag + GitHub Release automaticamente.
- Requer `.releaserc.json` na raiz com plugins: `commit-analyzer`, `release-notes-generator`, `github`
- `GITHUB_TOKEN` é injetado automaticamente pelo GitHub Actions (nenhum secret manual necessário)
- Se commits contiverem apenas `chore:` / `docs:`, nenhuma tag é criada (comportamento esperado)

> **CD não implementado.** Deploy para `staging` e `production` é **manual** via Vercel CLI ou dashboard. Workflows de deploy (`deploy-staging.yml`, `deploy-production.yml`) serão adicionados quando a infraestrutura estiver definida. Secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` estão ⏳ pendentes.

### Branch Protection — `main`
- Todos os status checks devem passar antes do merge (`ci / lint-and-type-check`, `ci / test`, `ci / build`)
- Mínimo 1 aprovação de revisor
- Aprovações descartadas em novo push
- Branch deve estar atualizada com a base
- Force push e deleção proibidos

### Branch Protection — `staging`
- Status checks obrigatórios: `ci / lint-and-type-check`, `ci / test`, `ci / build`
- Force push e deleção proibidos

### Critérios de aceite
- [ ] PR sem testes passando não pode ser mergeado em `staging` ou `main`
- [ ] PR sem aprovação não pode ser mergeado em `main`
- [x] Merge em `main` gera tag e GitHub Release automático via semantic-release
- [x] Segredos (JWT secrets, `DATABASE_URL`) nunca aparecem em logs

### Dependências
- EP-DO01 · EP-DO02 · Repositório GitHub configurado com branches `main` e `staging`

---

## EP-DO04 · Segurança e Variáveis de Ambiente de Produção
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado

### Objetivo
Garantir que a aplicação em produção seja segura, sem credenciais expostas e com CORS configurado corretamente.

### Funcionalidades
- Todas as variáveis obrigatórias configuradas no Vercel por ambiente:
  - **Backend:** `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRATION`
  - **Backend:** `NODE_ENV=production`, `PORT`, `CORS_ORIGIN`, `LOG_LEVEL`
  - **Frontend:** `VITE_API_URL` (URL da API por ambiente), `VITE_APP_ENV=production`
  - **Opcionais:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `WHATSAPP_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- CORS configurado via `CORS_ORIGIN` (lista de origens permitidas separadas por vírgula)
- `npm audit` sem vulnerabilidades críticas ou high
- Senhas hasheadas com bcrypt (rounds: 10) — nunca armazenadas em plain text
- Variáveis sensíveis nunca hardcoded no código-fonte
- Banco de produção provisionado com `prisma migrate deploy` (nunca `migrate dev` em prod)

### Critérios de aceite
- [ ] `npm audit --audit-level=high` retorna zero vulnerabilidades
- [ ] Request de origem não-listada em `CORS_ORIGIN` retorna HTTP 403
- [ ] Nenhuma chave ou senha aparece em commits ou logs

### Dependências
- EP-DO03

---

## EP-DO05 · Monitoramento e Observabilidade
**Fase:** F2 | **Prioridade:** 🟡 P2 | **Status:** ⚪ Não iniciado

### Funcionalidades
- Log estruturado por nível (`LOG_LEVEL`): debug, info, warn, error
- Log de conflitos detectados (para auditoria e debug)
- Error tracking (Sentry ou equivalente — a definir)
- Health check endpoint `GET /health` (pública, retorna status da API e do DB)
- Swagger/OpenAPI habilitado em `NODE_ENV !== production` (opcional, recomendado pelo spec)

### Critérios de aceite
- [ ] `GET /health` retorna `{ status: "ok", db: "connected" }` quando tudo está saudável
- [ ] Erros 5xx são capturados e enviados ao error tracker com stack trace
- [ ] Swagger disponível em `/api/docs` em ambiente de desenvolvimento

### Dependências
- EP-DO04

---

# ÉPICOS — DESIGN

---

## EP-DS01 · Design System Foundation
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** 🟡 Em andamento

### Objetivo
Estabelecer os tokens de design e a linguagem visual base antes de qualquer tela ser prototipada.

### Entregáveis

**Paleta de cores:**
- Primary: `#7A1515` (Cappella Red), `#3D0808`, `#991C1C`
- Neutros: `#FFFFFF`, `#FAF5F5`, `#F2E8E8`, `#E8D5D5`, `#9E7E7E`, `#3A1A1A`, `#1A0505`
- Semânticos: Success `#2D7A4A`, Warning `#B87414`, Danger `#C0392B`, Info `#2563EB`
- Documento de uso por contexto (dark mode / light mode)

**Tipografia:**
- Cormorant Garamond 600/700 — display/hero
- Inter 400/500/600 — body/UI
- DM Sans 400/500 — labels/badges
- Scale completa documentada (display-xl a label-sm)

**Sistema de espaçamento:**
- Base 4px: sp-1 (4px) até sp-16 (64px)

**Border radius:** radius-xs (4px) a radius-full (9999px)

**Elevação (shadows):** elevation-0 a elevation-4

**Iconografia:** Lucide Icons, stroke 1.5px, tamanhos sm/md/lg/xl

**Arquivo de variáveis CSS / tokens exportáveis para código**

### Critérios de aceite
- [ ] Todos os tokens com nome, valor e uso documentados
- [ ] Variáveis CSS exportadas e utilizáveis no projeto web
- [ ] Paleta acessível: contraste AA mínimo para texto sobre fundos usados
- [ ] Arquivo Figma/Figma-como com estilos de cor, texto e efeito criados

### Dependências
- Nenhuma (fundação de tudo)

---

## EP-DS02 · Biblioteca de Componentes
**Fase:** F0 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado

### Objetivo
Documentar e prototipar todos os componentes reutilizáveis antes da implementação das telas.

### Componentes a especificar (todos já detalhados no ux-design-framework.md)

| Componente | Variantes |
|---|---|
| Button | Primary, Secondary, Ghost, Danger, Icon (circular) |
| Status Badge | Confirmado, Pendente, Recusado, Conflito, Realizado |
| Event Card | Default, Conflict, Confirmed, Swipe actions |
| Form Input | Default, Focus, Error, Disabled + Label + Helper text |
| Navigation Bottom (mobile) | 4 tabs, estados ativo/inativo |
| Avatar | sm/md/lg/xl, com foto, fallback com iniciais, indicator online |
| Bottom Sheet / Modal | Half-snap, Full-snap, animações open/close |
| Search Bar | Default, Focus, Com valor, Overlay desktop |
| Toast / Snackbar | Success, Warning, Danger, Info, Persistente |
| Skeleton Loading | Event list, Calendar Month, Musician Roster, Dashboard cards |
| Dropdown / Select | Default, Com seleção, Aberto |
| Date/Time Picker | Mobile bottom sheet, Desktop nativo estilizado |
| Conflict Alert | Inline (allocation panel) |
| Calendar Header | Segmented control 4 views + navegação |
| Availability Indicator | Livre, Conflito, Indisponível |

### Critérios de aceite
- [ ] Cada componente com todas as variantes de estado documentadas
- [ ] Tap targets de no mínimo 44×44px em todos os elementos interativos
- [ ] Componentes reutilizáveis entre mobile e web (onde aplicável)
- [ ] Todos os ícones com `aria-label` em PT-BR documentado

### Dependências
- EP-DS01

---

## EP-DS03 · Telas Web — Wireframes e Protótipos
**Fase:** F0–F1 | **Prioridade:** 🔴 P0 | **Status:** ⚪ Não iniciado

### Objetivo
Entregar protótipos navegáveis de todas as telas web antes da implementação de cada fase.

### Telas por fase

**Fase 0:**
- Splash / Login
- Dashboard (Everton) — com onboarding vazio
- Agenda Month view
- Criar/Editar Evento (form)
- Evento Detalhe
- Perfil e Configurações

**Fase 1:**
- Agenda Year / Week / Day views
- Painel de Alocação (right drawer)
- Conflict Resolution (modal)
- Roster de Músicos
- Perfil do Músico
- Central de Notificações

### Critérios de aceite
- [ ] Protótipos navegáveis aprovados por Everton antes da implementação de cada fase
- [ ] Transições definidas: push (slide right), pop (slide left), cross-fade (tab switch), sheet up/down
- [ ] Versões light e dark mode prototipadas para telas principais
- [ ] Telas responsivas: desktop (≥1024px), tablet (768px–1023px), mobile (<768px)

### Dependências
- EP-DS01 · EP-DS02

---

## EP-DS04 · Telas Mobile — Wireframes e Protótipos
**Fase:** F2 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado

### Telas

- Login Mobile
- Meus Eventos (lista com filter chips)
- Confirmação de Gig (Bottom Sheet — CRÍTICO)
- Calendário Mobile (Month/Week/Day)
- Event Detail (read-only para músico)
- Solicitação de Folga
- Perfil Mobile
- Onboarding / Empty States

### Critérios de aceite
- [ ] Fluxo de confirmação de gig prototipado e testado com pelo menos 1 músico real
- [ ] Todos os estados da bottom sheet documentados (half / full / dismiss)
- [ ] Animações especificadas: open 240ms ease-out, close 200ms ease-in
- [ ] Safe areas documentadas para iPhone (notch) e Android

### Dependências
- EP-DS01 · EP-DS02

---

## EP-DS05 · UX Writing e Microcopy
**Fase:** F0 | **Prioridade:** 🟠 P1 | **Status:** ⚪ Não iniciado

### Objetivo
Garantir consistência de linguagem em toda a plataforma conforme a voz da marca Cappella.

### Entregáveis

**Microcopy Library (PT-BR):**
- Labels de navegação: Início, Agenda, Escalação, Perfil
- Labels de ação: Novo evento, Salvar, Escalar músico, Confirmar, Recusar, Solicitar folga, Forçar mesmo assim, Escolher outro músico
- Status labels: Confirmado, Aguardando confirmação, Recusado, Realizado, Conflito, Criado
- Placeholders de formulário: Ex: Casamento Silva & Costa, 18:00, R$ 0,00
- Toast messages por trigger (sucesso, erro, warning)
- Empty states (headline + subtext + CTA) por tela
- Mensagens de erro por código HTTP (401, 400, 409, 404, 500)
- Templates de notificação push e e-mail

**Tom de Voz:**
- Direto, Quente, Confiante, Calmo, Profissional
- Voz ativa, primeira pessoa do músico, confirmações claras sem exagero
- Português BR natural; termos técnicos do setor em PT (escalação, cachê)

**Acessibilidade:**
- `aria-label` em PT-BR para todos os ícones interativos
- Status badges sempre com texto + cor (nunca só cor)
- Mensagens de erro com contexto e instrução de resolução

### Critérios de aceite
- [ ] Nenhum texto de erro expõe código técnico ou stack trace ao usuário
- [ ] Todos os ícones interativos têm `aria-label` documentado
- [ ] Labels respeitam limite de 1–3 palavras (botões) / 1–5 palavras (títulos de seção)
- [ ] Microcopy library aprovada por Everton antes da implementação

### Dependências
- EP-DS01

---

# RESUMO EXECUTIVO — MAPA DE ÉPICOS

## Por Fase de Entrega

| Fase | Semanas | Épicos Obrigatórios | Épicos Opcionais |
|---|---|---|---|
| **F0 — Scary Skeleton** | 1–2 | EP-B01, EP-B02, EP-B06, EP-F01, EP-F02, EP-F03, EP-F04 (parcial), EP-F09, EP-DO01, EP-DO02, EP-DO03, EP-DO04, EP-DS01, EP-DS02, EP-DS03 (F0 screens), EP-DS05 | — |
| **F1 — Agenda + Alocação** | 3–6 | EP-B03, EP-B04, EP-B05 (email), EP-F04 (completo), EP-F05, EP-F06, EP-F07, EP-F08, EP-DS03 (F1 screens) | — |
| **F2 — Mobile + Experiência** | 7–10 | EP-M01, EP-M02, EP-M03, EP-M04, EP-M05, EP-M07, EP-B05 (push), EP-DS04 | EP-M06, EP-DO05 |
| **F3 — Google Calendar** | 11–12 | EP-B07 | — |

## Por Área

| Área | Total de Épicos | P0 | P1 | P2+ |
|---|---|---|---|---|
| Backend | 7 | 4 | 2 | 1 |
| Frontend Web | 9 | 5 | 3 | 1 |
| Frontend Mobile | 7 | 3 | 3 | 1 |
| DevOps | 5 | 4 | 0 | 1 |
| Design | 5 | 3 | 2 | 0 |
| **Total** | **33** | **19** | **10** | **4** |

## Caminho Crítico

```
EP-DO01 (infra local)
  └── EP-B01 (auth)
        ├── EP-B02 (eventos)
        │     └── EP-F03 (dashboard)
        │           └── EP-F04 (calendário) ← Entrega F0
        │
        ├── EP-B03 (músicos)
        │     └── EP-B04 (alocações + conflito) ← CRÍTICO
        │           ├── EP-F05 (painel alocação)
        │           └── EP-B05 (notificações) ← Entrega F1
        │                 └── EP-M04 (confirmação gig) ← Entrega F2
        │
        └── EP-DO03 (CI/CD)
              └── EP-DO04 (segurança prod)
```

---

*Documento gerado por análise de: guide.md · backend_especificacao_completa.md · frontend_especificacao_completa.md · devops_especificacao.md · ux-design-framework.md*  
*Cappella — Música para Eventos, Joinville · 02 de julho de 2026 · Revisado: 03 de julho de 2026*
