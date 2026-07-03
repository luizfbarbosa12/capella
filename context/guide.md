---

# 🎵 Sistema de Agenda Música Joinville

---

# 1️⃣ ESTRATÉGIA DE DELIVERY: FASES DE VALUE

Ao invés de esperar 10 semanas pelo "MVP completo", vamos entregar **valor a cada 2 semanas**.

## Fase 0: MVP "Scary Skeleton" (Semana 1-2)

**Objetivo:** Prova de conceito | Everton consegue criar evento + ver calendário

**Escopo:**

- Login básico (email + senha)
- Criar evento (form com: data, hora, local, tipo, orçamento)
- Calendário mostrando eventos criados
- Editar evento

**Value:**

- ✅ Everton vê agenda centralizada (em 1 lugar ao invés de 3 planilhas)
- Reduz 30% do trabalho mental (encontrar eventos é rápido)

**Não tem:**

- ❌ Alocação de músicos
- ❌ Detecção de conflitos
- ❌ App mobile

**Risco:** "Isso não é o MVP real?" → Não, mas Everton **já vai pagar menos caro** pelo benefício

---

## Fase 1: MVP "Agenda + Alocação" (Semana 3-6)

**Objetivo:** Fluxo completo de escalação | Músico consegue confirmar

**Escopo:**

- Alocar músicos a eventos
- Detecção de conflito automática
- Notificação por email + link (não WhatsApp automático ainda)
- Músico clica no link e confirma/rejeita (sem app, apenas web)

**Value:**

- ✅ Everton aloca músicos 10x mais rápido (já sem retrabalho de conflito)
- ✅ Músicos recebem escalação clara
- ✅ Reduz 70% dos erros de alocação

**Por que não app mobile ainda?** Porque musico pode confirmar via email/web por enquanto

---

## Fase 2: MVP "Mobile + Calendário" (Semana 7-10)

**Objetivo:** Experiência móvel | Músico vê seus eventos num app bonito

**Escopo:**

- App mobile (React Native Expo)
- Músico vê meus eventos em calendário
- Solicitar folga (form simples)
- Notificação push básica

**Value:**

- ✅ Músico tem experiência profissional (app, não emails)
- ✅ Folga registrada automaticamente (menos conflitos)
- ✅ Everton vê "algo visual" que impressiona cliente

---

## Fase 3: MVP v1.1 "Google Calendar" (Semana 11-12)

**Objetivo:** Integração com calendário existente | Não precisa mais preencher formulário

**Escopo:**

- Google Calendar sync (automático)
- Sincronização bi-direcional
- Músico bloqueia dias automaticamente

**Value:**

- ✅ Músico **não preenche nada** (sua agenda Google = nossa agenda)
- ✅ Everton vê disponibilidade real em tempo real
- ✅ Sistema escala para 300+ eventos/ano

---

## Roadmap Visuação: Value Delivery

```
Semana 1-2  ▓▓  Fase 0: Calendário
Semana 3-6  ▓▓▓▓  Fase 1: Alocação + Conflitos
Semana 7-10 ▓▓▓▓  Fase 2: Mobile + Experiência
Semana 11-12 ▓▓  Fase 3: Google Calendar

Total: 12 semanas (vs 10 proposto antes)
Value entregue: A cada 2 semanas (não só no final)
```

---

# 2️⃣ PRIORIZAÇÃO MOSCOW

## MUST HAVE (MVP Fase 0-2)

### Calendário de Eventos

- [P0] Criar evento (data, hora, local, tipo, budget)
- [P0] Ver calendário visual (mensal/semanal)
- [P0] Editar evento
- [P0] Status do evento (Criado → Confirmado → Realizado)

### Alocação de Músicos

- [P0] Alocar músico a evento
- [P0] **Detectar conflito automático** (o motivo principal do projeto!)
- [P0] Notificar músico
- [P0] Músico confirmar/rejeitar

### Autenticação

- [P0] Login Everton (email + senha)
- [P0] Login músico (email + senha)
- [P0] Logout
- [P1] Lembrar-me (remember me)

---

## SHOULD HAVE (MVP Fase 2-3)

### Experiência Mobile

- [P1] App mobile profissional (React Native)
- [P1] Meus eventos (lista/calendário)
- [P1] Confirmar escalação via app
- [P1] Solicitar folga

### Google Calendar

- [P2] Sincronização Google Calendar
- [P2] Mostrar disponibilidade em tempo real
- [P2] Bloquear dias automaticamente

### Notificações

- [P2] Push notification no mobile
- [P2] Email notification
- [P2] WhatsApp (quando tiver API)

---

## COULD HAVE (Fase v1.2+)

### Financeiro

- [ ]  Dashboard financeiro (quanto cada músico ganhou)
- [ ]  Registrar pagamentos
- [ ]  Gerar relatórios

### Relatórios

- [ ]  Análise de eventos (top músicos, ganhos, etc)
- [ ]  Exportar dados
- [ ]  Gráficos de performance

### Integrações Futuras

- [ ]  WhatsApp automático (Twilio)
- [ ]  Stripe/PayPal
- [ ]  Integração com CRM do cliente

---

## WON'T HAVE (MVP v1.0)

- ❌ Sistema de pagamento integrado
- ❌ Geração de NF/Recibo automático
- ❌ Rating de músicos
- ❌ App do cliente (casal) ver evento
- ❌ Marketplace de músicos
- ❌ Video call com músicos
- ❌ Integração contábil

---

# 3️⃣ RISCOS & MITIGAÇÕES

## Risco Alto: Everton Não Quer Usar o Sistema

**Probabilidade:** Média

**Impacto:** Catastrófico (projeto falha)

**Sinais de Alerta:**

- Everton continua usando Excel depois do deploy
- Reclamações sobre "sistema lento" ou "complicado"

**Mitigação:**

- ✅ **Envolver Everton em TODAS as decisões de UI** (wireframes aprovados por ele)
- ✅ **Implementar isso paralelo a uma das planilhas** (não deixa Excel morrer de repente)
- ✅ **Migração de dados** de Excel para sistema (não perde histórico)
- ✅ **Suporte em tempo real** (Luiz disponível para ajudar as primeiras 2 semanas)

---

## Risco Alto: Conflito de Horários Não Detectado

**Probabilidade:** Baixa (mas crítico)

**Impacto:** Alto (refaz alocações, perde tempo)

**Mitigação:**

- ✅ **Teste exaustivo de conflitos** (unit tests específicos)
- ✅ **Alertas visuais bem claros** (não deixa passar despercebido)
- ✅ **Log de conflitos** (se acontecer, tem rastro para debug)
- ✅ **Fallback manual** (Everton pode forçar se necessário)

---

## Risco Médio: Google Calendar Não Sincroniza

**Probabilidade:** Média

**Impacto:** Médio (volta a preencher form manual)

**Mitigação:**

- ✅ **Não é MVP** (vem em Fase 3, não bloqueia ninguém)
- ✅ **Form manual é fallback** (sempre funciona)
- ✅ **Teste de integração no staging** (antes de prod)

---

## Risco Médio: Músicos Não Confirmam via App

**Probabilidade:** Média

**Impacto:** Médio (Everton precisa seguir manualmente)

**Mitigação:**

- ✅ **Notificação push + email + SMS futuramente**
- ✅ **Link direto no email** (não obriga abrir app)
- ✅ **Confirmação pode ser via email se quiser**
- ✅ **Gamificação futura** (badge, histórico de confirmações)

---

## Risco Técnico: Performance em Queries de Sobreposição Temporal (PostgreSQL)

**Probabilidade:** Baixa

**Impacto:** Baixo (detecção de conflito fica lenta em alto volume)

**Mitigação:**

- ✅ **Índices compostos em `(dateStart, dateEnd)` e `date`** (cobre as queries de overlap temporal)
- ✅ **Cache de calendário** (Redis futuro)
- ✅ **Pagination** (não carrega todos eventos de uma vez)

---

# 4️⃣ DEPENDÊNCIAS & BLOCKERS

## Dependências Externas

| Item | Status | Timeline | Impacto |
| --- | --- | --- | --- |
| **Stack** | ✅ Confirmado | — | NestJS + PostgreSQL + Prisma · React + Vite · React Native Expo |
| **Repositório GitHub** | ⏳ Aguardando | Amanhã | Médio - Bloqueia dev |
| **PostgreSQL (Neon/Supabase)** | ✅ Free tier | Imediato | Baixo - Pode criar agora |
| **Everton Feedback UI** | ⏳ Aguardando | Essa semana | Alto - Garante adoção |

---

## Dependências Internas

| Tarefa | Depende | Timeline |
| --- | --- | --- |
| Sprint 2 (CRUD) | Sprint 1 (Auth) | Semana 3 |
| Sprint 3 (Conflitos) | Sprint 2 (Dados) | Semana 5 |
| Sprint 4 (Mobile) | Sprint 3 (API) | Semana 7 |

---

# 5️⃣ MÉTRICAS DE SUCESSO

## Métrica 1: Tempo Economizado por Semana

**Baseline:** Everton gasta 4-5h/semana em tarefas administrativas

**Target MVP Fase 2:** Reduzir para 1h/semana

**Como medir:** Perguntar a Everton (survey simples)

**Sucesso:** Se reduzir 75% do tempo

---

## Métrica 2: Taxa de Erros (Conflitos)

**Baseline:** ~2-3 conflitos por mês (retrabalho)

**Target:** 0 conflitos (ou alertar antes)

**Como medir:** Log do sistema + feedback Everton

**Sucesso:** 0 conflitos não detectados

---

## Métrica 3: Adoção Músicos

**Baseline:** Músicos não têm app, apenas WhatsApp

**Target MVP Fase 2:** 80% dos músicos confirmando via app

**Como medir:** Tracking de confirmações (app vs email)

**Sucesso:** >70% das confirmações via app

---

## Métrica 4: Time-to-Allocate

**Baseline:** Everton leva 5-10 min para alocar 1 músico (checando conflitos manual)

**Target:** Alocar em <1 min (com conflito automático)

**Como medir:** Cronometrar Everton antes/depois

**Sucesso:** <2 min por alocação

---

## Métrica 5: NPS (Net Promoter Score)

**Baseline:** N/A (sistema novo)

**Target:** NPS > 50 após Fase 2

**Como medir:** Survey simples (1 pergunta: "Recomendaria?"  0-10)

**Sucesso:** Se >50% responde 9-10

---

# 6️⃣ PRIORIZAÇÃO DE FEATURES

## Matriz Value vs Complexity

```
HIGH VALUE / LOW COMPLEXITY (FAZER PRIMEIRO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Calendário visual                  (US-009)
✓ Criar/editar evento                (US-001, US-002)
✓ Detectar conflito                  (US-004) ← CRITICAL
✓ Alocar músico                      (US-003)

HIGH VALUE / HIGH COMPLEXITY (FAZER DEPOIS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
? Google Calendar sync               (FASE 3)
? App mobile completa                (FASE 2)

LOW VALUE / LOW COMPLEXITY (NICE TO HAVE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Solicitar folga                    (US-008) → Fase 2
- Lembrar-me (remember me)           (US-011)

LOW VALUE / HIGH COMPLEXITY (NUNCA FAZER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗ Dashboard financeiro completo
✗ Relatórios avançados
✗ WhatsApp automático (MVP)
```

---

# 7️⃣ GO-TO-MARKET STRATEGY

## Fase 0: Soft Launch (Semana 1-2)

**Audiência:** Apenas Everton

**Objetivo:** Feedback antes de expor muito

**Comunicação:** Reunião 1x por semana (pessoal)

---

## Fase 1: Closed Beta (Semana 3-6)

**Audiência:** Everton + 2-3 músicos de confiança

**Objetivo:** Testar fluxo de confirmação

**Comunicação:**

- Email: "Você foi selecionado para testar novo sistema"
- Link de teste
- Suporte via WhatsApp direto (Luiz)

---

## Fase 2: Soft Launch Geral (Semana 7-10)

**Audiência:** Todos os 30-35 músicos

**Objetivo:** Experiência completa (com app mobile)

**Comunicação:**

- Email: "Novo sistema de agenda está pronto"
- Video 2 min: "Como confirmar sua escalação"
- Suporte no app (chat)

---

## Fase 3: Stable Release (Semana 11-12+)

**Audiência:** Todos

**Objetivo:** Operação normal

**Comunicação:** Atualizações de features

---

# 8️⃣ ESTIMATIVAS & TIMELINE REALISTA

## Sprint Breakdown (Revisado)

| Sprint | Foco | Semanas | Esforço | Status |
| --- | --- | --- | --- | --- |
| **Sprint 0** | Setup + Auth | 1-2 | 21 SP | P0 |
| **Sprint 1** | Calendário + CRUD | 3-4 | 21 SP | P0 |
| **Sprint 2** | Alocação + Conflito | 5-6 | 21 SP | P0 ⚠️ Critical |
| **Sprint 3** | Mobile App | 7-8 | 21 SP | P1 |
| **Sprint 4** | Polish + Deploy | 9-10 | 16 SP | P1 |
| **Sprint 5** | Google Calendar | 11-12 | 13 SP | P2 |
|  | **TOTAL MVP** | **12 semanas** | **113 SP** | ✅ |

---

## Buffer & Contingency

- **Buffer:** 10% (1 semana para bugs/refactoring)
- **Contingency:** Não estava planejado inicialmente
- **Real Timeline:** 12-13 semanas (confortável)

---

# 9️⃣ STAKEHOLDER ALIGNMENT

## Everton (Product Owner)

**Prioridade #1:** Não duplicar músicos (conflitos)

**Prioridade #2:** Visão geral de tudo

**Prioridade #3:** Não quer aprender novo sistema complexo

**Comunicação:** 1x/semana (segunda) 30 min

---

## Músicos (End Users)

**Prioridade #1:** Saber quando toca

**Prioridade #2:** Confirmar fácil (não quer aprender)

**Prioridade #3:** App bonito e profissional

**Comunicação:** Email + Notificação (não chat direto)

---

## Luiz (Tech Lead)

**Prioridade #1:** Arquitetura escalável

**Prioridade #2:** Deadlines realistas

**Prioridade #3:** Code quality

**Comunicação:** Daily standup (15 min) + Planning (Sprint)

---

## Cliente Potencial Futuro (Se Expandir)

**Prioridade:** Segurança de dados + Profissionalismo

**Foco agora:** Não, vamos lançar com Everton primeiro

---

# 🔟 PLANO B: CENÁRIOS DE RISCO

## Cenário 1: "Everton Não Consegue Usar o Sistema"

**Ação:**

- Week 1: Migrar para UI 100% igual ao Excel (se necessário)
- Week 2: Criar tutorial em vídeo passo a passo
- Week 3: Suporte 1:1 com Everton

---

## Cenário 2: "Surge Novo Requisito Crítico"

**Ação:**

- Entender impacto (não fazer scope creep)
- Atrasar Fase 3 se necessário
- Priorizar value delivery nas fases anteriores

---

## Cenário 3: "Google Calendar Sincronização Muito Complexa"

**Ação:**

- Pular Google Calendar de Fase 3
- Manter form manual (já funciona bem)
- Tentar Google Calendar em Fase 4

---

# 1️⃣1️⃣ DECISÕES JÁ TOMADAS

✅ **Stack confirmado:** Node.js + Express + React + React Native Expo + MongoDB Atlas

✅ **Autenticação:** JWT + Email/Senha (não SSO agora)

✅ **Deploy:** Railway (backend) + Vercel (frontend)

✅ **Notificações:** Email + Push (Google FCM) | WhatsApp manual MVP

✅ **Google Calendar:** Fase 3 (não MVP v1.0)

✅ **Financeiro:** Fase v1.2+ (não MVP)

---

# 1️⃣2️⃣ PRÓXIMOS PASSOS

## Esta Semana

- [ ]  Apresentar escopo ao Everton (aprovação final)
- [ ]  Mostrar UI/UX mockups (pra cliente ver algo visual)
- [ ]  Confirmar 8 decisões técnicas
- [ ]  Criar repositório GitHub + setup monorepo