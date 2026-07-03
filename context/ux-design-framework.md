# Cappella — UX/UI Design Framework
> Sistema de Agenda Música Joinville
> Document version 1.0 | For UI creation agent consumption

---

## TABLE OF CONTENTS

1. [Lean Inception](#lean-inception)
2. [Empathy Maps](#empathy-maps)
3. [User Journey Maps](#user-journey-maps)
4. [Service Blueprint](#service-blueprint)
5. [Tone of Voice](#tone-of-voice)
6. [Design System](#design-system)
7. [Visual Design](#visual-design)
8. [UX Writing Guidelines](#ux-writing-guidelines)

---

# 1. LEAN INCEPTION

## 1.1 Product Vision

```
FOR     Everton (event coordinator) and professional musicians
WHO     struggle with scheduling chaos, double-booking, and manual WhatsApp coordination
THE     Cappella platform
IS A    smart scheduling and allocation system
THAT    centralizes events, detects conflicts automatically, and lets musicians confirm gigs in seconds
UNLIKE  Excel spreadsheets and WhatsApp groups
OUR     product eliminates scheduling errors, saves hours per week, and gives everyone a single source of truth
```

---

## 1.2 Product IS / IS NOT / DOES / DOES NOT

| IS | IS NOT |
|---|---|
| A scheduling & allocation tool | A payment platform |
| A conflict detection engine | A marketplace for new musicians |
| A mobile-first confirmation app | A booking system for external clients |
| A real-time calendar for the team | An accounting or invoicing tool |
| A communication layer (email + push) | A WhatsApp replacement (for MVP) |

| DOES | DOES NOT |
|---|---|
| Creates and manages events | Generates invoices or NF |
| Detects musician schedule conflicts | Handle client-facing booking |
| Sends notifications (email + push) | Rate or rank musicians |
| Lets musicians confirm/reject gigs | Manage financial payments |
| Syncs with Google Calendar (Phase 3) | Replace human judgment on allocation |

---

## 1.3 Personas

### Persona 1 — Everton (The Coordinator)

```
Name:        Everton
Role:        Business owner / Music coordinator
Age:         35–45
Context:     Manages 30–35 musicians, 300+ events/year in Joinville
Pain Points:
  - Spends 4–5h/week on spreadsheets & WhatsApp
  - Double-books musicians constantly
  - No single view of what's happening next week
  - Afraid musicians miss gigs due to miscommunication
Goals:
  - See ALL events in ONE place
  - Allocate musicians in < 1 minute
  - Zero double-booking conflicts
  - Impress his musicians with a professional tool
Tech Level: Moderate (uses smartphone, Excel, WhatsApp)
Device:      Primarily mobile, sometimes desktop
```

---

### Persona 2 — The Musician (Lucas / Ana)

```
Name:        Lucas (or Ana) — representative musician
Role:        Freelance instrumentalist / vocalist
Age:         22–40
Context:     Works for multiple music groups and clients simultaneously
Pain Points:
  - Receives gig requests via WhatsApp — easy to miss
  - Doesn't know their own schedule at a glance
  - Confirms gigs manually, sometimes forgets
  - Accidentally double-books with another client
Goals:
  - See MY gigs quickly without scrolling through chats
  - Confirm or reject a gig in ONE tap
  - Know pay/time/location at a glance
  - Request days off without calling anyone
Tech Level: High (digital native, heavy smartphone user)
Device:      Exclusively mobile
```

---

## 1.4 Feature Brainstorm (MUST / SHOULD / COULD)

### MUST (Phase 0–2, MVP)
| # | Feature | User | Value |
|---|---------|------|-------|
| F01 | Create / Edit event | Everton | Core workflow |
| F02 | Year / Month / Week / Day calendar views | Everton | Single source of truth |
| F03 | Allocate musician to event | Everton | Replaces spreadsheet |
| F04 | Auto conflict detection | Everton | #1 pain point solved |
| F05 | Email notification to musician | System | Loop closing |
| F06 | Musician confirm / reject gig | Musician | Confirmation loop |
| F07 | Auth (email + password) | Both | Security baseline |
| F08 | My schedule view | Musician | Personal calendar |
| F09 | Event status tracking | Everton | Visibility |

### SHOULD (Phase 2–3)
| # | Feature | User | Value |
|---|---------|------|-------|
| F10 | Mobile app (React Native) | Musician | Professional UX |
| F11 | Push notifications | Both | Faster loop |
| F12 | Request day off | Musician | Reduces conflicts |
| F13 | Google Calendar sync | Both | Zero-friction input |

### COULD (Phase v1.2+)
| # | Feature | User | Value |
|---|---------|------|-------|
| F14 | Financial dashboard | Everton | Business intelligence |
| F15 | WhatsApp notifications | Both | Reach |
| F16 | Performance reports | Everton | Insights |

---

## 1.5 MVP Sequencing

```
Sprint 0 (Week 1–2):  F07 → F01 → F02
Sprint 1 (Week 3–4):  F09 → F02 (enhanced)
Sprint 2 (Week 5–6):  F03 → F04 → F05 → F06  ← CRITICAL PATH
Sprint 3 (Week 7–8):  F10 → F08 → F11
Sprint 4 (Week 9–10): F12 → polish → deploy
Sprint 5 (Week 11–12): F13
```

---

## 1.6 Information Architecture

### Full Screen Map

```
ROOT
├── /login                        Auth — Login
├── /forgot-password              Auth — Password reset
├── /reset-password/:token        Auth — Set new password
│
├── [COORDINATOR — Everton]
│   ├── /dashboard                Início (Dashboard)
│   ├── /agenda/:view             Agenda (year/month/week/day)
│   │   └── /agenda/day/:date     Day view — specific date
│   ├── /eventos/novo             Create Event (form)
│   ├── /eventos/:id              Event Detail
│   │   ├── /eventos/:id/editar   Edit Event (form)
│   │   └── /eventos/:id/escalar  Allocation Panel
│   │       └── [conflict modal]  Conflict Resolution
│   ├── /escalacoes               All Allocations (list + filters)
│   ├── /musicos                  Musician Roster
│   │   ├── /musicos/novo         Add / Invite Musician
│   │   └── /musicos/:id          Musician Profile (view)
│   ├── /notificacoes             Notification Center
│   └── /perfil                   Settings / Profile
│
└── [MUSICIAN]
    ├── /inicio                   Meus Eventos (upcoming list)
    ├── /agenda                   My Calendar (Week default)
    │   └── /agenda/day/:date     Day view
    ├── /eventos/:id              Event Detail (read-only + confirm/decline)
    ├── /folga                    Request Day Off
    └── /perfil                   Profile / Settings
```

### Navigation Transition Rules

```
Trigger                                Transition
────────────────────────────────────────────────────────────────────
List item → detail screen              Push (slide from right)
Back / dismiss / cancel                Pop (slide to right)
Tab switch                             Cross-fade (no slide)
FAB → Create form                      Sheet slides up from bottom
Event detail → Allocation Panel        Right drawer slides in (desktop)
                                       Push (mobile)
Conflict modal opens                   Fade + scale(0.95 → 1) backdrop
Bottom sheet open                      Slide up from bottom
Bottom sheet close                     Slide down + fade backdrop
Calendar view change (Mês → Semana)    Cross-fade
Notification tap → deep link           Replace stack to target screen
```

### Role-Based Access Control

```
Screen / Action                  Coordinator   Musician
─────────────────────────────────────────────────────────
Create event                          ✅           ❌
Edit event                            ✅           ❌
Cancel event                          ✅           ❌
Allocate musician to event            ✅           ❌
Force allocation (override conflict)  ✅           ❌
View full musician roster             ✅           ❌
Add / invite musician                 ✅           ❌
View any event detail                 ✅           ❌
View own event detail                 ✅           ✅
Confirm gig                           ❌           ✅ (own only)
Decline gig                           ❌           ✅ (own only)
Request day off                       ✅ (on behalf) ✅
View own schedule                     ✅           ✅
See other musicians' schedule         ✅           ❌
```

---

# 2. EMPATHY MAPS

## 2.1 Everton — The Coordinator

```
┌─────────────────────────────────────────────────────────────────┐
│                         EVERTON                                  │
├──────────────────────────┬──────────────────────────────────────┤
│         THINKS           │              FEELS                   │
│  "Will Lucas be free      │  Anxious before every event         │
│   on Saturday?"           │  Frustrated by Excel chaos          │
│  "Did he see my message?" │  Proud when events go perfectly     │
│  "I need to check 3       │  Overwhelmed by the manual load     │
│   spreadsheets again"     │  Responsible for everyone           │
├──────────────────────────┼──────────────────────────────────────┤
│         SAYS             │              DOES                    │
│  "I'll double check later"│  Opens 3 spreadsheets at once       │
│  "Did you confirm?"       │  Sends WhatsApp messages at 11pm    │
│  "I think that day is     │  Calls musicians when urgent        │
│   free but let me check"  │  Copies/pastes between sheets       │
│  "I need everything       │  Keeps mental notes of who's free   │
│   in one place"           │                                     │
├──────────────────────────┬──────────────────────────────────────┤
│         PAINS            │              GAINS                   │
│  Double-booking musicians │  One calendar for everything        │
│  Hours lost per week      │  Conflict detected before it hurts  │
│  Fear of missing events   │  Looks professional to musicians    │
│  Spreadsheet dependency   │  Gets time back for music/growth    │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## 2.2 Musician (Lucas / Ana)

```
┌─────────────────────────────────────────────────────────────────┐
│                    MUSICIAN (Lucas/Ana)                          │
├──────────────────────────┬──────────────────────────────────────┤
│         THINKS           │              FEELS                   │
│  "When's my next gig?"   │  Excited about music, not admin      │
│  "Did I already confirm  │  Annoyed by unclear confirmations    │
│   that Saturday?"        │  Nervous about missing gigs          │
│  "Is this conflicting    │  Proud of being a professional       │
│   with my other job?"    │  Wants to be seen as reliable        │
├──────────────────────────┼──────────────────────────────────────┤
│         SAYS             │              DOES                    │
│  "I'll check my phone"   │  Scrolls WhatsApp looking for dates  │
│  "Just send me the       │  Screenshots confirmation messages   │
│   details on WhatsApp"   │  Keeps manual notes or phone reminders│
│  "I wasn't sure if       │  Works for multiple groups at once   │
│   I was confirmed"       │                                     │
├──────────────────────────┬──────────────────────────────────────┤
│         PAINS            │              GAINS                   │
│  Missing gig invitations │  All MY gigs in one tap             │
│  Accidental double-book  │  Confirm/reject with one tap        │
│  Unclear event details   │  Know location + pay upfront        │
│  Unprofessional process  │  Professional app = professional job │
└──────────────────────────┴──────────────────────────────────────┘
```

---

# 3. USER JOURNEY MAPS

## 3.1 Everton — Creating an Event & Allocating Musicians

```
STAGE         │ Awareness    │ Creation      │ Allocation    │ Confirmation  │ Event Day
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
ACTION        │ Opens app    │ Taps "New     │ Selects       │ Checks app    │ Views day's
              │ sees calendar│ Event" fills  │ musicians     │ for confirmed │ roster on
              │              │ form          │ from list     │ status        │ calendar
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
TOUCHPOINT    │ Mobile app   │ Event form    │ Musician list │ Dashboard     │ Event detail
              │ dashboard    │ UI            │ + conflict    │ notification  │ screen
              │              │               │ indicator     │ badge         │
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
EMOTION       │ 😌 Calm      │ 😊 Productive │ 😰 Tense      │ 😌 Relieved   │ 😎 Confident
              │ organized    │ in control    │ (will it      │ everyone      │ ready
              │              │               │ conflict?)    │ confirmed     │
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
PAIN POINTS   │ —            │ Too many      │ Unclear who   │ Waiting for   │ Someone
              │              │ fields        │ is free       │ confirmation  │ didn't show
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
OPPORTUNITIES │ Quick-view   │ Smart defaults│ Visual        │ Auto-reminder │ One-tap
              │ pending      │ (repeat event)│ conflict      │ if not        │ event brief
              │ confirmations│               │ highlight     │ confirmed 48h │ share
```

---

## 3.2 Musician — Receiving & Confirming a Gig

```
STAGE         │ Notification │ Review        │ Decision      │ Confirmation  │ Pre-Event
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
ACTION        │ Receives     │ Opens app     │ Checks own    │ Taps          │ Gets push
              │ push / email │ sees event    │ calendar      │ "Confirm" or  │ reminder
              │ notification │ details       │ for conflicts │ "Decline"     │ 24h before
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
TOUCHPOINT    │ Push notif   │ Event card    │ My Schedule   │ Confirm CTA   │ Event
              │ email        │ (date, time,  │ view          │ button        │ reminder
              │              │ venue, pay)   │               │               │ notification
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
EMOTION       │ 🔔 Curious   │ 😊 Interested │ 🤔 Checking   │ 😊 Done!      │ 😎 Ready
              │              │               │               │ easy          │ professional
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
PAIN POINTS   │ Notification │ Missing       │ Can't see     │ No undo if    │ Forgetting
              │ ignored      │ key info      │ own schedule  │ misclick      │ event
              │ in clutter   │ (pay, dress   │ side by side  │               │ details
              │              │ code)         │               │               │
──────────────┼──────────────┼───────────────┼───────────────┼───────────────┼───────────
OPPORTUNITIES │ Rich push    │ Single-screen │ Conflict      │ Swipe gesture │ Deep-link
              │ with CTA     │ all details   │ badge inline  │ confirm UX    │ to map/brief
```

---

# 4. SERVICE BLUEPRINT

## Channels, Actions & Systems

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CUSTOMER ACTIONS                                     │
│  Everton: Creates Event → Allocates Musician → Monitors Confirmations           │
│  Musician: Receives Notif → Reviews Details → Confirms / Declines               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                             FRONTSTAGE (UI)                                     │
│  Web app (Everton)         Mobile app (Musician)       Email (both)             │
│  - Event form              - Push notification          - Gig invitation        │
│  - Calendar view           - Event detail card          - Confirmation receipt  │
│  - Allocation panel        - My Schedule screen         - Reminder email        │
│  - Conflict alert badge    - Confirm / Decline CTA                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                             BACKSTAGE (Logic)                                   │
│  Conflict Engine           Notification Service         Auth Service            │
│  - Check musician          - Email dispatch             - JWT tokens            │
│    existing allocations    - FCM push dispatch          - Role-based access     │
│  - Flag overlapping        - 48h reminder trigger       - Session management    │
│    events                  - Confirmation webhook                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                           SUPPORT PROCESSES                                     │
│  MongoDB Atlas             Railway (API)                Vercel (Web)            │
│  - Events collection       - REST endpoints             - React SPA             │
│  - Musicians collection    - Auth middleware             - SSR if needed        │
│  - Allocations collection  - Error logging              - CDN assets            │
│  - Indexes on date/musId   - Rate limiting                                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Service Blueprint — Conflict Detection Flow

```
TRIGGER: Everton allocates musician X to Event Y
          │
          ▼
API: POST /allocations { musicianId, eventId }
          │
          ▼
Conflict Engine:
  QUERY: Find all allocations where:
    musician_id = X
    AND event_date = Y.date
    AND event_time overlaps Y.time window
          │
    ┌─────┴─────┐
    │ CONFLICT  │ NO CONFLICT
    │           │
    ▼           ▼
Return 409   Return 201
+ conflict   allocation saved
details      │
    │        notification dispatched
    ▼
UI shows:
  ⚠ "Lucas already has an event
     on Saturday at 18:00 (Igreja São João)"
  [Force anyway]  [Cancel]
```

---

# 5. TONE OF VOICE

## Brand Personality

Cappella occupies a rare intersection: **precision and passion**. The brand serves people who are creative by vocation but need business-grade reliability. The voice must feel like a trusted colleague — competent, warm, and direct.

## Voice Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| **Direct** | Gets to the point fast. No filler words. | "Evento salvo." not "Seu evento foi salvo com sucesso!" |
| **Warm** | Human, not robotic. Respects the artist. | "Lucas confirmou. Tudo certo para sábado." |
| **Confident** | No hedging language. System is certain. | "Conflito detectado." not "Pode haver um conflito..." |
| **Calm** | Even in errors, does not panic the user. | "Não foi possível salvar. Tente novamente." |
| **Professional** | Treats musicians as professionals, not employees. | "Escalação enviada para Lucas." not "Notificamos Lucas." |

## Tone Sliders

```
Formal    ──────●────────  Casual
Serious   ─────────●─────  Playful
Technical ──────●────────  Simple
Cold      ───────────────●  Warm
```

## Do / Don't

| ✅ DO | ❌ DON'T |
|------|---------|
| Use active voice | Use passive constructions |
| Use musician's first name | Use generic "o usuário" |
| Confirm with clarity ("Confirmado!") | Over-celebrate small actions |
| Give context in errors ("O que fazer?") | Show technical error codes to users |
| Use Portuguese BR naturally | Mix PT/EN unless it's a product term |
| Keep labels to 1–3 words max | Write essays in tooltips |

---

# 6. DESIGN SYSTEM

## 6.1 Color Palette

> Derived from Cappella brand identity: deep burgundy/wine with white typographic contrast.

### Brand Colors

```
PRIMARY
──────────────────────────────────────────────────────
Name: Cappella Red           Hex: #7A1515
Name: Cappella Dark          Hex: #3D0808
Name: Cappella Medium        Hex: #991C1C
Name: Cappella Light (tint)  Hex: #C4494980 (50% opacity)

NEUTRALS
──────────────────────────────────────────────────────
Name: White                  Hex: #FFFFFF
Name: Off-White              Hex: #FAF5F5
Name: Cream                  Hex: #F2E8E8
Name: Mist                   Hex: #E8D5D5  (subtle borders on light bg)
Name: Stone                  Hex: #9E7E7E  (secondary text)
Name: Smoke                  Hex: #3A1A1A  (dark mode surface)
Name: Ink                    Hex: #1A0505  (dark mode background)

SEMANTIC COLORS
──────────────────────────────────────────────────────
Name: Success                Hex: #2D7A4A  (confirmed status)
Name: Success Light          Hex: #E6F4EC
Name: Warning                Hex: #B87414  (pending/conflict)
Name: Warning Light          Hex: #FEF3DE
Name: Danger                 Hex: #C0392B  (errors / declined)
Name: Danger Light           Hex: #FDECEA
Name: Info                   Hex: #2563EB
Name: Info Light             Hex: #EFF6FF
```

### Color Usage Rules

```
Background (dark mode):      Ink       #1A0505
Surface (dark mode):         Smoke     #3A1A1A
Surface elevated:            #4D2020
Primary action:              Cappella Red  #7A1515
Primary hover:               Cappella Medium  #991C1C
Primary text on dark:        White     #FFFFFF
Secondary text on dark:      Mist      #E8D5D5
Borders (dark mode):         #5C2A2A
Background (light mode):     Off-White  #FAF5F5
Surface (light mode):        White      #FFFFFF
Border (light mode):         Cream      #F2E8E8
Primary text on light:       Ink        #1A0505
Secondary text on light:     Stone      #9E7E7E
```

---

## 6.2 Typography

> All fonts are free, open-source, available on Google Fonts.

### Font Stack

```
DISPLAY / HERO HEADINGS
Font: Cormorant Garamond
Weights used: 600 (SemiBold), 700 (Bold)
Use case: App name, hero titles, event names, section headers
Google Fonts URL:
  https://fonts.google.com/specimen/Cormorant+Garamond

BODY / UI TEXT
Font: Inter
Weights used: 400 (Regular), 500 (Medium), 600 (SemiBold)
Use case: Body copy, labels, descriptions, form fields, all interactive UI
Google Fonts URL:
  https://fonts.google.com/specimen/Inter

LABELS / TAGS / BADGES
Font: DM Sans
Weights used: 400 (Regular), 500 (Medium)
Use case: Status badges, chips, tags, metadata, secondary information
Google Fonts URL:
  https://fonts.google.com/specimen/DM+Sans
```

### Type Scale

```
Token         Font               Size   Weight  Line-H  Use
────────────────────────────────────────────────────────────────────
display-xl    Cormorant Garamond  48px   700     52px    Hero / Splash
display-lg    Cormorant Garamond  36px   700     40px    Page titles
display-md    Cormorant Garamond  28px   600     34px    Section headers
display-sm    Cormorant Garamond  22px   600     28px    Card headers / Event name
────────────────────────────────────────────────────────────────────
body-xl       Inter               18px   500     28px    Lead text
body-lg       Inter               16px   400     24px    Primary body
body-md       Inter               14px   400     20px    Secondary body / descriptions
body-sm       Inter               12px   400     16px    Captions / hints
────────────────────────────────────────────────────────────────────
label-lg      DM Sans             14px   500     20px    Form labels / section tags
label-md      DM Sans             12px   500     16px    Status badges / chips
label-sm      DM Sans             10px   400     14px    Metadata / timestamps
────────────────────────────────────────────────────────────────────
```

### Typeface Pairing Example

```
Event Card:
  "Casamento Silva & Fernanda"  ← display-sm / Cormorant Garamond 22px 600
  "Sábado, 12 de jul · 18:00"  ← body-md / Inter 14px 400
  "Igreja São João, Joinville"  ← body-sm / Inter 12px 400 / Stone color
  [CONFIRMADO]                  ← label-md / DM Sans 12px 500 / Success badge
```

---

## 6.3 Spacing System

```
Base unit: 4px

Token    Value    Use case
sp-1     4px      Icon padding, inline gap
sp-2     8px      Form field internal padding, icon margin
sp-3     12px     Small element padding, compact list items
sp-4     16px     Default padding, card internal padding
sp-5     20px     Section gap, form group spacing
sp-6     24px     Card margin, modal padding
sp-8     32px     Section margin, large gaps
sp-10    40px     Page-level vertical padding
sp-12    48px     Hero padding
sp-16    64px     Splash screens, empty state
```

---

## 6.4 Border Radius

```
Token       Value    Use case
radius-xs   4px      Badges, chips, tags
radius-sm   8px      Inputs, selects, buttons (small)
radius-md   12px     Cards, modal panels, dropdowns
radius-lg   16px     Bottom sheets, large cards
radius-xl   24px     Modals, sheets (mobile)
radius-full 9999px   Pills, avatar, circular buttons
```

---

## 6.5 Elevation (Shadows)

```
Token        Shadow                         Use case
────────────────────────────────────────────────────────────
elevation-0  none                           Flat surfaces
elevation-1  0 1px 3px rgba(26,5,5,0.12)   Inputs, subtle cards
elevation-2  0 4px 12px rgba(26,5,5,0.16)  Cards, dropdowns
elevation-3  0 8px 24px rgba(26,5,5,0.20)  Modals, bottom sheets
elevation-4  0 16px 48px rgba(26,5,5,0.24) Overlays, drawers
```

---

## 6.6 Iconography

```
Icon library: Lucide Icons (free, open-source, MIT license)
Source: https://lucide.dev

Style:         Line icons, 1.5px stroke weight
Sizes:
  sm: 16px   (inline with text)
  md: 20px   (buttons, list items)
  lg: 24px   (nav, headers)
  xl: 32px   (feature highlights, empty states)

Key icons used:
  Calendar     → lucide:calendar
  Event/Gig    → lucide:music
  Musician     → lucide:user
  Conflict     → lucide:alert-triangle
  Confirm      → lucide:check-circle-2
  Decline      → lucide:x-circle
  Add/New      → lucide:plus-circle
  Settings     → lucide:settings-2
  Notifications→ lucide:bell
  Home/Dash    → lucide:layout-dashboard
  Location     → lucide:map-pin
  Clock        → lucide:clock
  Money        → lucide:banknote
  Phone        → lucide:phone
  Day-off      → lucide:umbrella
```

---

## 6.7 Component Specifications

### Button

```
PRIMARY BUTTON
  Background:    #7A1515 (Cappella Red)
  Text:          #FFFFFF, Inter 14px 600
  Padding:       12px 24px
  Border-radius: radius-sm (8px)
  Height:        44px (mobile tap target ≥ 44px)
  Hover:         Background → #991C1C
  Active:        Background → #3D0808, scale(0.98)
  Disabled:      Background → #E8D5D5, Text → #9E7E7E
  Shadow:        elevation-1

SECONDARY BUTTON
  Background:    transparent
  Border:        1.5px solid #7A1515
  Text:          #7A1515, Inter 14px 600
  Padding:       12px 24px
  Border-radius: radius-sm (8px)
  Height:        44px
  Hover:         Background → #FAF5F5

GHOST / TEXT BUTTON
  Background:    transparent
  Text:          #7A1515, Inter 14px 500
  Padding:       8px 12px
  Underline:     on hover

DANGER BUTTON
  Background:    #C0392B
  Text:          #FFFFFF
  (same geometry as Primary)

ICON BUTTON (circular)
  Background:    #7A1515
  Size:          44×44px
  Border-radius: radius-full
  Icon:          20px, #FFFFFF
```

---

### Status Badge / Chip

```
CONFIRMADO  (Confirmed)
  Background:  #E6F4EC
  Text:        #2D7A4A  /  DM Sans 12px 500
  Border:      1px solid #2D7A4A40

PENDENTE    (Pending)
  Background:  #FEF3DE
  Text:        #B87414  /  DM Sans 12px 500
  Border:      1px solid #B8741440

RECUSADO    (Declined)
  Background:  #FDECEA
  Text:        #C0392B  /  DM Sans 12px 500
  Border:      1px solid #C0392B40

CONFLITO    (Conflict)
  Background:  #FEF3DE
  Text:        #B87414  /  DM Sans 12px 500
  Icon:        lucide:alert-triangle (inline, left)
  Border:      1px solid #B87414

REALIZADO   (Completed)
  Background:  #E8D5D5
  Text:        #3A1A1A  /  DM Sans 12px 500

All badges: padding 4px 10px / border-radius: radius-xs (4px)
```

---

### Event Card

```
Container:
  Background:  #FFFFFF (light) / #3A1A1A (dark)
  Border:      1px solid #F2E8E8 (light) / #5C2A2A (dark)
  Border-radius: radius-md (12px)
  Padding:     16px
  Shadow:      elevation-2
  Min-height:  80px

Left accent bar:
  Width:       3px
  Height:      100%
  Color:       #7A1515 (default)  |  #C0392B (conflict)  |  #2D7A4A (confirmed)
  Border-radius: 3px 0 0 3px

Content layout:
  Row 1: [Event name]               [Status badge]
         Cormorant 18px 600         right-aligned

  Row 2: [Clock icon] [Time]  [Pin icon] [Venue]
         lucide 16px  Inter 13px 400  Stone color

  Row 3: [Users icon] [Musicians count / names]
         If conflict: [Alert icon + "Conflito detectado"]

  Row 4 (actions): [Edit]  [View details]
         Ghost buttons / only visible on hover (web) / always (mobile)

Swipe actions (mobile):
  Left swipe  → Danger zone: "Cancelar evento"
  Right swipe → Quick action: "Ver escalação"
```

---

### Form Input

```
Container:
  Display:       block, full-width
  Margin-bottom: sp-5 (20px)

Label:
  Font:          DM Sans 12px 500 (label-lg)
  Color:         #3A1A1A (light) / #E8D5D5 (dark)
  Margin-bottom: sp-1 (4px)

Input field:
  Height:        44px (≥ 44px for mobile accessibility)
  Background:    #FFFFFF (light) / #2A1010 (dark)
  Border:        1.5px solid #E8D5D5 (default)
               1.5px solid #7A1515 (focus)
               1.5px solid #C0392B (error)
  Border-radius: radius-sm (8px)
  Padding:       0 12px
  Font:          Inter 14px 400
  Color:         #1A0505 (light) / #FFFFFF (dark)
  Placeholder:   Stone color #9E7E7E

Focus state:
  Border:  1.5px solid #7A1515
  Shadow:  0 0 0 3px rgba(122,21,21,0.15)

Error state:
  Border:  1.5px solid #C0392B
  Helper text: Inter 12px 400 / Danger color

Helper / hint text:
  Font:   Inter 12px 400
  Color:  Stone #9E7E7E
  MT:     sp-1 (4px)
```

---

### Navigation (Mobile Bottom Nav)

```
Container:
  Background:    #1A0505
  Border-top:    1px solid #3A1A1A
  Height:        60px + safe-area-inset-bottom
  Padding:       0 sp-4

Tab items (4 tabs):
  Width:         25% each
  Layout:        icon (20px) + label (DM Sans 10px 400)
  Color inactive: #9E7E7E
  Color active:   #FFFFFF
  Active indicator: 2px top border, #7A1515, full width of tab

Tabs:
  1. Início / Home    → lucide:layout-dashboard
  2. Agenda           → lucide:calendar
  3. Escalação        → lucide:users    (Everton) / Meus Eventos (Musician)
  4. Perfil           → lucide:user
```

---

### Avatar Component

```
Sizes:
  sm:   24×24px  (event cards, compact lists)
  md:   32×32px  (sidebar user zone, top bar)
  lg:   40×40px  (musician roster rows)
  xl:   56×56px  (musician profile header)

Default (with photo):
  Shape:         circle (border-radius: radius-full)
  Object-fit:    cover
  Border:        1.5px solid #5C2A2A

Fallback (initials, no photo):
  Background:    #7A1515
  Text:          Initials (1–2 letters), DM Sans, White
                 Font size = avatar size × 0.4

Online indicator (optional, coordinator view):
  Size:          8px circle, bottom-right of avatar
  Background:    #2D7A4A
  Border:        2px solid #1A0505 (matches background)
```

---

### Bottom Sheet / Modal Drawer

```
Use cases:
  - Event detail quick-view (from calendar cell tap)
  - Confirm / Decline gig (musician)
  - Day-off request form
  - "+ N more" events overflow from calendar

Backdrop:
  Background:  rgba(0, 0, 0, 0.6)
  Tap dismiss: yes (unless form has unsaved changes)

Sheet container:
  Background:    #1E0808
  Border-radius: radius-xl radius-xl 0 0  (top corners only)
  Padding:       sp-6
  Max-height:    90vh (mobile) / 80vh (tablet)

Handle bar (drag indicator):
  Width:         40px
  Height:        4px
  Background:    #5C2A2A
  Border-radius: radius-full
  Margin:        0 auto sp-4

Header row:
  Title:     Cormorant 20px 600, White
  Close [X]: lucide:x 20px, #9E7E7E — right-aligned, 44×44px

Snap points (mobile):
  Half:  50% viewport height (quick peek)
  Full:  90% viewport height (expanded)
  Swipe down from handle → dismiss

Animation:
  Open:  translateY(100% → 0) + backdrop fade-in  /  240ms ease-out
  Close: translateY(0 → 100%) + backdrop fade-out /  200ms ease-in
```

---

### Search Bar

```
Container:
  Height:        44px
  Background:    #2A1010
  Border:        1.5px solid #5C2A2A
  Border-radius: radius-sm (8px)
  Padding:       0 sp-3
  Display:       flex row, align-center

Left icon:     lucide:search, 16px, #9E7E7E
Input field:   Inter 14px 400, White, flex: 1, no border
Placeholder:   "Buscar eventos ou músicos..." / #9E7E7E
Clear button:  lucide:x 16px, #9E7E7E (visible only when input has value)

Focus state:
  Border:  1.5px solid #7A1515
  Shadow:  0 0 0 3px rgba(122,21,21,0.15)

Search overlay (web desktop):
  Trigger:   Search icon in top bar
  Overlay:   Full-width panel slides down from top bar
             Background #150303, shadow elevation-3
  Results:   Grouped by type: Eventos / Músicos
  Keyboard:  /  shortcut opens, Escape closes
  Empty:     "Nenhum resultado para '[query]'"

Search results item:
  Height:    48px
  Icon:      lucide:music (event) / lucide:user (musician), 16px
  Primary:   Inter 14px 400, White
  Secondary: DM Sans 12px, Stone (date or instrument)
```

---

### Toast / Snackbar

```
Position:   Fixed bottom-center (mobile) / bottom-right (desktop)
            Bottom: 80px mobile (above bottom nav) / 24px desktop
Width:      calc(100% - 32px) mobile / 320px desktop
Max-width:  400px

Container:
  Background:    #2A1010
  Border-radius: radius-md (12px)
  Padding:       12px 16px
  Shadow:        elevation-3
  Display:       flex row, align-center, gap sp-2

Left icon (16px, colored by type):
  Success:  lucide:check-circle-2   #2D7A4A
  Warning:  lucide:alert-triangle   #B87414
  Danger:   lucide:x-circle         #C0392B
  Info:     lucide:info             #2563EB

Text:       Inter 13px 400, #E8D5D5, flex: 1
Action:     Optional — DM Sans 13px 500, #7A1515 underlined (e.g. "Desfazer")
Close:      lucide:x 14px, #9E7E7E (only on persistent toasts)

Duration:
  Auto-dismiss: 3000ms (info/success) / 5000ms (warning/error)
  Persistent:   No auto-dismiss (requires user close)

Animation:
  Enter: translateY(20px → 0) + opacity(0 → 1) / 200ms ease-out
  Exit:  translateY(0 → 20px) + opacity(1 → 0) / 180ms ease-in
  Stack: Multiple toasts stack upward with 8px gap
```

---

### Skeleton Loading State

```
When to use:
  - First load of calendar, event list, musician roster
  - After pull-to-refresh (before data arrives)
  - Never for actions < 200ms (show spinner instead)

Skeleton element:
  Background:  #2A1010
  Shimmer:     Linear gradient overlay sweeping left → right
               Colors: #2A1010 → #3D1A1A → #2A1010
               Width:  200% of element
               Duration: 1.4s infinite ease-in-out
  Border-radius: match actual component

Skeleton patterns per screen:

  Event list (3 skeleton cards):
    Card height: 80px, radius-md
    Inside: 2 skeleton lines (60% width + 40% width)

  Calendar Month:
    Day cells: no skeleton (grid renders immediately)
    Event pills: 1–2 skeleton pills per cell where events expected
    Width: randomized 40%–80% per pill

  Musician Roster (6 skeleton rows):
    Avatar circle: 40×40px
    Name line: 120px wide
    Tag line: 80px wide

  Dashboard stat cards (3):
    Full card skeleton: 80px tall
```

---

### Dropdown / Select

```
Trigger button:
  Height:        44px
  Background:    #2A1010
  Border:        1.5px solid #5C2A2A
  Border-radius: radius-sm (8px)
  Padding:       0 sp-3
  Icon-right:    lucide:chevron-down, 16px, #9E7E7E
  Font:          Inter 14px 400
  Selected text: White
  Placeholder:   Stone #9E7E7E

Dropdown panel:
  Background:    #2A1010
  Border:        1px solid #5C2A2A
  Border-radius: radius-md (12px)
  Shadow:        elevation-3
  Max-height:    240px (scrollable inside)
  Z-index:       50

Option item:
  Height:        40px
  Padding:       0 sp-3
  Font:          Inter 14px 400, White
  Hover:         Background #3D1A1A
  Selected:      Background #3A1A1A, text #FFFFFF, lucide:check right 16px #7A1515
```

---

### Date / Time Picker

```
Date input:
  Tap trigger → opens Bottom Sheet with month-grid calendar
  Sheet title: "Selecionar data"
  Grid:        Same as Month view (simplified, no events)
  CTA:         "Confirmar" Primary button full-width

Time input:
  Tap trigger → opens Bottom Sheet with drum-roll scroll picker
  Columns:     [Hour] : [Minute]
  Increments:  15-minute steps (00, 15, 30, 45)
  CTA:         "Confirmar" Primary button full-width

Desktop fallback:
  Use native HTML <input type="date"> / <input type="time">
  Styled to match input spec (override browser appearance)
```

---

### Conflict Alert (Critical Component)

```
Inline alert (inside allocation panel):
  Background:  #FEF3DE
  Border:      1px solid #B87414
  Border-left: 4px solid #B87414
  Border-radius: radius-sm (8px)
  Padding:     12px 16px
  Icon:        lucide:alert-triangle, 20px, #B87414 (left)

Title:         Inter 14px 600 / #B87414
               "Conflito de agenda detectado"
Body:          Inter 13px 400 / #3A1A1A
               "[Musician name] já está escalado para [Event name] em [Date/Time]"
Actions:       [Forçar mesmo assim] (text, Danger) | [Escolher outro músico] (Primary)
```

---

### Calendar View — Shared Header (all 4 views)

```
Chrome:
  Background:      #1A0505 (dark) / #FAF5F5 (light)
  Top bar height:  56px (mobile) / 64px (desktop)

View toggle (segmented control, 4 segments):
  Labels:   [Ano] [Mês] [Semana] [Dia]
  Font:     DM Sans 12px 500
  Style:    Pill-shaped container — Background #3A1A1A
            Active segment: Background #7A1515, Text #FFFFFF
            Inactive: Text #9E7E7E
  Position: Centered in top bar (mobile) / Left of nav arrows (desktop)

Navigation arrows:
  Icon:    lucide:chevron-left / lucide:chevron-right, 20px
  Size:    36×36px tap target
  Color:   #E8D5D5
  Action:  Advance by 1 unit of current view (1 year / 1 month / 1 week / 1 day)

"Hoje" / "Today" button:
  Font:    DM Sans 12px 500
  Color:   #7A1515
  Style:   Ghost, no border
  Action:  Jump to current date in any view

Title (center, between arrows):
  Year view:   "2026" — Cormorant 22px 600, White
  Month view:  "Julho 2026" — Cormorant 22px 600, White
  Week view:   "Jun 28 – Jul 4, 2026" — Cormorant 20px 600, White
  Day view:    "Quinta, 2 de julho" — Cormorant 20px 600, White
```

---

### Calendar View — YEAR (Vista Anual)

> Reference: Google Calendar year view — 12 mini-calendars in a 4×3 grid (desktop) / scrollable 2-column (mobile).
> Purpose: Everton sees at a glance which months are busiest. No event details — density only.

```
Layout (desktop):
  Grid:        4 columns × 3 rows of mini-month calendars
  Gap:         sp-6 (24px) horizontal, sp-8 (32px) vertical
  Padding:     sp-8 all sides

Layout (mobile):
  Grid:        2 columns × 6 rows
  Gap:         sp-4 (16px)
  Padding:     sp-4 horizontal
  Scroll:      Vertical

Mini-month calendar block:
  Width:       ~280px (desktop) / calc(50vw - 24px) (mobile)
  Background:  #3A1A1A (dark) / #FFFFFF (light)
  Border:      1px solid #5C2A2A (dark) / #F2E8E8 (light)
  Border-radius: radius-md (12px)
  Padding:     sp-4 (16px)

  Month header:
    Font:      DM Sans 13px 500, White
    MT-bottom: sp-2 (8px)

  Day-of-week row:
    Labels:    S M T W T F S (abbreviated)
    Font:      DM Sans 10px 400, #9E7E7E
    Height:    20px

  Day cells:
    Size:      min 28×28px, equal grid
    Font:      Inter 11px 400, #E8D5D5

    TODAY:
      Background:  #7A1515
      Text:        #FFFFFF
      Border-radius: radius-full

    HAS EVENTS (dot indicator):
      Show a 5px dot BELOW the day number
      Color priority (if multiple statuses that day):
        1st: #C0392B (conflict)  ← always takes priority
        2nd: #B87414 (pending)
        3rd: #2D7A4A (confirmed)
      Max 1 dot per cell (priority wins)

    HIGH DENSITY day (3+ events):
      Dot color:   #7A1515
      Dot size:    7px (slightly larger)

    OTHER MONTH days:
      Opacity: 0% (hidden in mini view — cleaner)

  Event count badge (optional, bottom of block):
    "8 eventos" — DM Sans 10px 400, #9E7E7E
    Only shown on desktop mini-calendar blocks

Interaction:
  Tap/click on a mini-month header → jumps to Month view for that month
  Tap/click on a day cell with events → jumps to Day view for that day
  Tap/click on empty day cell → opens "Novo evento" form prefilled with that date
```

---

### Calendar View — MONTH (Vista Mensal)

> Reference: Google Calendar month view — full 7-column grid, events as pills.
> Purpose: Primary scheduling overview for Everton.

```
Layout:
  Grid:        7 columns (Sun–Sat header row + day cells)
  Rows:        5–6 weeks visible
  Cell height: min 100px (desktop) / 64px (mobile)
  Background:  #1A0505

Day-of-week header row:
  Font:        DM Sans 11px 500, #9E7E7E, uppercase
  Height:      32px
  Border-bottom: 1px solid #3A1A1A

Day cell:
  Border:      1px solid #3A1A1A (grid lines)
  Padding:     4px 6px

  Day number:
    Font:      Inter 13px 400, #E8D5D5
    Position:  top-right of cell

  TODAY:
    Day number background: #7A1515 circle (24×24px)
    Day number text: #FFFFFF, 600

  OTHER MONTH:
    Day number color: #5C2A2A (very muted)
    Background: #150303 (slightly darker than grid)

  SELECTED day:
    Border: 1.5px solid #7A1515

Event pills (inside day cells):
  Height:        22px
  Border-radius: radius-xs (4px)
  Padding:       0 6px
  Font:          Inter 11px 500, truncated with ellipsis
  Max per cell:  3 pills visible

  Color by status:
    Confirmed:  Background #1A3D2A, Text #4ADE80, left-border 2px #2D7A4A
    Pending:    Background #3D2E0A, Text #FCD34D, left-border 2px #B87414
    Conflict:   Background #3D100A, Text #F87171, left-border 2px #C0392B
    Default:    Background #3A1A1A, Text #E8D5D5, left-border 2px #7A1515

  Overflow indicator:
    "+2 mais" — DM Sans 11px 400, #9E7E7E
    Tap → expand cell or open day view

  Multi-day events (e.g. travel blocks):
    Span across columns with rounded left/right ends
    Background: semi-transparent #7A151540
    Text: truncated on first cell only

Interaction:
  Tap empty cell → open "Novo evento" form prefilled with date
  Tap event pill → open Event Detail sheet (bottom sheet on mobile)
  Long-press cell → context menu: [Novo evento] [Ver dia]
```

---

### Calendar View — WEEK (Vista Semanal)

> Reference: Google Calendar week view — 7 columns with hour rows on the left.
> Purpose: Everton sees full day detail; spot time gaps and allocate precisely.

```
Layout:
  Left axis:    56px wide (time labels)
  Content area: 7 equal-width columns (Sun–Sat)
  Row height:   60px per hour (= 1px per minute)
  Total height: 24 × 60px = 1440px (scrollable)
  Default scroll: jump to 7 AM on load

Column headers (sticky at top):
  Height:       64px
  Day name:     DM Sans 11px 500, #9E7E7E, uppercase  ("DOM", "SEG"…)
  Day number:   Inter 20px 400, #E8D5D5

  TODAY column header:
    Day number:  Background #7A1515 circle (36×36px)
    Day name:    Color #7A1515

Time axis (left column, sticky):
  Labels:       "7 AM", "8 AM" … "11 PM"
  Font:         DM Sans 10px 400, #9E7E7E
  Alignment:    top of each hour row

Hour grid lines:
  Full hour:    1px solid #3A1A1A
  Half hour:    1px dashed #2A1010 (lighter, subtler)

All-day row (top of column area, above hour grid):
  Height:       auto (expands with all-day events)
  Background:   #150303
  Border-bottom: 1px solid #3A1A1A
  Events:       Same pill style as Month view

Current time indicator:
  Horizontal red line across all columns at current time
  Left dot:     6px circle, #C0392B
  Line:         1px solid #C0392B
  (Only visible in current week)

Event blocks (inside hour grid):
  Width:        90% of column width (5% margin each side)
  Min-height:   22px (even for very short events)
  Border-radius: radius-xs (4px)
  Padding:      4px 6px

  Content:
    Line 1: Event name — Inter 12px 600, truncated
    Line 2: Time range — Inter 11px 400, opacity 80%
    Line 3 (if tall enough): Venue — Inter 11px 400, opacity 60%

  Color by status: same left-border + background as Month view pills

  Overlapping events:
    Split column width equally among overlapping events
    Each event gets (100% / N) - 4px width
    Slight horizontal offset so borders are visible

Interaction:
  Tap empty slot → open "Novo evento" form prefilled with date + time
  Tap event block → open Event Detail bottom sheet
  Drag event block (desktop only) → reschedule (Phase 3+)
  Pinch-zoom (mobile) → increase row height for more time precision
```

---

### Calendar View — DAY (Vista Diária)

> Reference: Google Calendar day view — single column, full hour breakdown.
> Purpose: Deep dive into one day. Used on event-heavy days or pre-event prep.

```
Layout:
  Left axis:    56px (time labels, identical to week view)
  Content area: Single column, full remaining width
  Row height:   60px per hour
  Default scroll: 7 AM

Header (sticky):
  Height:       72px
  Day name:     DM Sans 14px 500, #9E7E7E
  Day number:   Cormorant 36px 700, White
  TODAY:        Day number color #7A1515 (no circle needed — full screen)
  Weekday full: "Quinta-feira" — Inter 13px 400, #9E7E7E below the number

All-day / multi-day row:
  Same as Week view all-day row

Hour grid:
  Full hour lines: 1px solid #3A1A1A
  Half-hour lines: 1px dashed #2A1010
  Time labels:     DM Sans 10px 400, #9E7E7E (every full hour)

Current time indicator:
  Same red line + dot as Week view

Event blocks:
  Width:        calc(100% - 12px) with 6px left margin
  Left border:  3px solid (status color)
  Border-radius: radius-sm (8px)
  Padding:      8px 12px
  Min-height:   44px
  Background:   semi-transparent status-tinted dark

  Content (more room than week view):
    Line 1: Event name — Inter 15px 600, White
    Line 2: "18:00 – 22:00" — Inter 13px 400, #E8D5D5
    Line 3: Venue — Inter 12px 400, #9E7E7E with lucide:map-pin (12px)
    Line 4: Musicians count — "3 músicos" with lucide:users (12px), #9E7E7E
    Status badge: Absolute top-right of block

  Overlapping events:
    Side-by-side split (same logic as week view)

Timeline summary bar (horizontal, above grid):
  Compact pill-row showing event names in chronological order
  Height: 32px, scrollable horizontally
  Useful for quick scan before scrolling the grid
  Pills: same status color coding

Interaction:
  Tap empty slot → "Novo evento" form prefilled
  Tap event block → Event Detail bottom sheet
  Swipe left/right → previous/next day
  Long-press on event block → quick actions: [Editar] [Escalar músico] [Cancelar]
```

---

# 7. VISUAL DESIGN

## 7.0 Application Shell

### Overview

The platform runs on two surfaces with different navigation paradigms:

| Surface | Primary user | Device | Navigation pattern |
|---------|-------------|--------|-------------------|
| Web App (React) | Everton | Desktop / Laptop | Fixed left sidebar + optional right drawer panel |
| Mobile App (React Native Expo) | Musicians + Everton on-the-go | Smartphone | Bottom tabs + nested stack |

---

### Web Desktop Shell (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixed)     │  MAIN AREA (flex: 1)                       │
│  Background: #0F0303       │  Background: #1A0505                       │
│  Border-right:             │                                            │
│    1px solid #3A1A1A       │  ┌─────────────────────────────────────┐   │
│                            │  │  TOP BAR  (64px, sticky)            │   │
│  ┌──────────────────────┐  │  │  [Page title]    [Search][Bell]     │   │
│  │ Cappella wordmark    │  │  │                          [Avatar]   │   │
│  │ white, 120px wide    │  │  └─────────────────────────────────────┘   │
│  └──────────────────────┘  │                                            │
│                            │  ┌─────────────────────────────────────┐   │
│  ── PRIMARY NAV ─────────  │  │  CONTENT AREA (scrollable)          │   │
│  Início                    │  │  Padding: 32px                      │   │
│  Agenda                    │  │  Max-width: 1200px, centered        │   │
│  Escalação                 │  │                                     │   │
│  Músicos                   │  │  [Page-specific content]            │   │
│                            │  └─────────────────────────────────────┘   │
│  ── SECONDARY NAV ───────  │                                            │
│  Notificações  [badge]     │  RIGHT DRAWER PANEL (optional, z-layer):   │
│  Perfil                    │  Width: 400px                              │
│                            │  Slides in from right edge                 │
│  ── BOTTOM ─────────────   │  Background: #150303                       │
│  [Avatar] Name             │  Border-left: 1px solid #3A1A1A            │
│  [Collapse icon]           │  Used for: Allocation Panel,               │
│                            │  Event quick-view, Day-off review          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Sidebar Spec
```
Dimensions:
  Expanded:     240px
  Collapsed:    64px (icons only, labels hidden)
  Transition:   width 220ms ease-out

Logo area:
  Height:       72px
  Expanded:     Cappella SVG wordmark, white, 120px wide
  Collapsed:    Treble clef mark only, 32×32px
  Padding:      0 sp-5

Nav item (each):
  Height:        44px
  Border-radius: radius-sm (8px)
  Margin:        4px sp-3
  Padding:       0 sp-3
  Icon:          20px (Lucide), left
  Label:         Inter 14px (hidden when collapsed)

  INACTIVE:  Icon #9E7E7E  /  Label Inter 14px 400 #9E7E7E
  ACTIVE:    Background #3A1A1A  /  Left border 3px solid #7A1515
             Icon #FFFFFF  /  Label Inter 14px 500 #FFFFFF
  HOVER:     Background #2A1010
  COLLAPSED: Icon only centered; tooltip on hover shows label

Notification badge (on Notificações):
  Size:       16×16px circle, absolute top-right of icon
  Background: #C0392B
  Font:       DM Sans 10px 500, White
  Shows "9+" when count > 9

User zone (pinned bottom, above collapse toggle):
  Avatar:  32×32px
  Name:    Inter 13px 400 #E8D5D5   (hidden collapsed)
  Role:    DM Sans 10px #9E7E7E     (hidden collapsed)
  Padding: sp-4

Collapse toggle (very bottom):
  Height:  44px full width
  Icon:    lucide:panel-left-close (expanded) / lucide:panel-left-open (collapsed)
  Color:   #9E7E7E / hover #E8D5D5
  Border-top: 1px solid #3A1A1A
```

#### Top Bar Spec (inside main area)
```
  Height:        64px
  Background:    #1A0505
  Border-bottom: 1px solid #3A1A1A
  Position:      sticky, top: 0, z-index: 10

  LEFT:    Page title — Cormorant 22px 600, White
  RIGHT:   [Search icon 20px → opens search overlay]
           [Bell icon 20px + badge if unread notifications]
           [Avatar 32px → tap opens profile dropdown menu]
  Padding: 0 sp-8

Profile dropdown (from avatar tap):
  Background:    #2A1010
  Border:        1px solid #5C2A2A
  Border-radius: radius-md
  Width:         200px
  Items:         "Perfil" / "Configurações" / divider / "Sair"
  Item height:   40px / Inter 14px 400
```

#### Right Drawer Panel Spec
```
  Width:       400px
  Background:  #150303
  Border-left: 1px solid #3A1A1A
  Shadow:      -8px 0 24px rgba(0,0,0,0.3)
  Transition:  transform 260ms ease-out (translateX(400px → 0))
  Z-index:     20

  When open:   Content area width shrinks by 400px
  Close:       [X] top-right (lucide:x 20px) OR press Escape
  Header:      32px handle bar (title + close button)

  Used for:
    - Allocation Panel (/eventos/:id/escalar)
    - Event quick-view (tap event pill in calendar)
```

---

### Web Tablet Shell (768px–1023px)

```
Sidebar:    Collapsed by default (64px icons-only)
            Opens as full overlay drawer (240px) on hamburger tap
Top bar:    Height 56px
            Far left: lucide:menu (24px) opens sidebar overlay
            Center:   Page title
            Right:    [Bell] [Avatar]
Drawer:     Slides over content (does NOT push)
            Backdrop: rgba(0,0,0,0.6)
            Dismiss:  Tap backdrop or swipe left on drawer
Right panel: Becomes full bottom sheet (not side drawer)
Content:    Full width when sidebar collapsed
```

---

### Mobile Shell (React Native Expo)

```
NAVIGATOR TREE:

  RootStack                         ← handles auth gate + deep links
  ├── AuthStack
  │   ├── LoginScreen
  │   └── ForgotPasswordScreen
  └── AppTabs  (Bottom Tab Navigator — authenticated)
      ├── Tab 1: Início
      │   └── HomeStack
      │       ├── DashboardScreen
      │       └── NotificationCenterScreen
      ├── Tab 2: Agenda
      │   └── AgendaStack
      │       ├── CalendarScreen       ← Year/Month/Week/Day toggle
      │       ├── EventDetailScreen
      │       └── EventEditScreen
      ├── Tab 3: Escalação (Everton) / Eventos (Musician)
      │   └── EscalacaoStack
      │       ├── AllocationListScreen    (Everton)
      │       ├── AllocationPanelScreen   (Everton)
      │       ├── ConflictResolutionScreen
      │       ├── MyEventsScreen          (Musician)
      │       └── EventDetailScreen       (Musician, read-only)
      └── Tab 4: Perfil
          └── ProfileStack
              ├── ProfileScreen
              ├── SettingsScreen
              └── DayOffRequestScreen

SCREEN HEADER (all stack screens):
  Background:    #1A0505
  Height:        56px + statusBarHeight (safe area)
  Title:         Cormorant 20px 600, White, centered
  Back button:   lucide:arrow-left 20px, #E8D5D5 — 44×44px tap area
  Right action:  Context-specific per screen (see each screen spec below)
  Border-bottom: 1px solid #3A1A1A

SAFE AREAS:
  Every screen root: <SafeAreaView edges={['top','bottom']}>
  Use useSafeAreaInsets() for fine-grained control (e.g. FAB offset)

SCROLL:
  Long lists:     <FlatList> — never <ScrollView> for lists
  Pull-to-refresh: <RefreshControl tintColor="#7A1515">
  Tap active tab: scrollToTop via ref

KEYBOARD (all forms):
  <KeyboardAvoidingView behavior="padding"> (iOS)
                        behavior="height"  (Android)
  Scroll to focused input automatically
```

---

### Layout Grid

```
Surface     Columns   Gutter   Margin    Max content
────────────────────────────────────────────────────────────
Mobile        4        16px     16px      full width
Tablet        8        16px     24px      full width
Desktop      12        24px     32px      1200px (centered)
Wide         12        24px     32px      1200px (centered)

Common page column spans (desktop):
  Full-width page (calendar, lists): col-span-12
  Centered narrow (forms):           col-span-6 offset-3 (or max-w 640px)
  Two-column (content + panel):      col-span-8 + col-span-4
  Three-column (roster grid):        repeat(3, col-span-4)
```

---

## 7.1 Design Direction

```
Style:     Modern Elegant Minimal
Mood:      Professional, warm, trustworthy, premium
Reference: Music industry meets hospitality tech
Approach:  Dark-first (musicians work at night events)
           Light mode available (Everton in office)
```

---

## 7.2 Design Principles

1. **One action per screen** — Every screen has one obvious next step.
2. **Confirm with 1 tap** — Musician confirmation must never require more than 1 tap from the notification.
3. **Conflict is unmissable** — Conflict alerts use color, icon, and text. Never just one signal.
4. **Data density is a feature** — Everton needs to scan many events quickly. Cards must be scannable.
5. **Mobile is primary** — Design mobile first, then expand to desktop.
6. **Dark mode default** — Core UX is designed on dark background, matching brand identity.

---

## 7.3 Screen Layout Specifications

### Splash / Login Screen
```
Background:    Gradient: #1A0505 (top) → #3D0808 (bottom)
Logo:          Centered, white SVG, 120×120px
App name:      "Cappella" — Cormorant Garamond 36px 700, White, below logo
Tagline:       "Sua agenda musical, organizada." — Inter 14px 400, Mist
Form:          Floating card — Background #3A1A1A, radius-xl, shadow elevation-3
               MT from tagline: sp-8
               Inputs: email + password (dark input variant)
               CTA: Primary button full-width "Entrar"
               Link: "Esqueci minha senha" — Ghost link, Stone color
Padding:       sp-10 horizontal
```

### Dashboard — Everton
```
Top bar:
  Left:   "Olá, Everton" — Inter 16px 500, White
  Right:  Notification bell (lucide:bell) + Avatar
Background: #1A0505

Summary row (horizontal scroll):
  Cards: [Eventos esta semana: 4] [Pendentes: 2] [Conflitos: 1]
  Card style: #3A1A1A background, Cappella Red left border (3px)
  Font: DM Sans 12px label / Cormorant 28px 700 number

Calendar strip (horizontal):
  7-day strip showing current week
  Active day: #7A1515 pill
  Event dot indicators below each day

Upcoming events list:
  Section header: "Próximos eventos" — Inter 16px 500, Mist
  Event cards (see Card spec above)

FAB:
  Position:    Fixed, bottom-right, 24px margin
  Icon:        lucide:plus (24px)
  Background:  #7A1515
  Size:        56×56px
  Shadow:      elevation-3
```

### Event Detail Screen
```
Header:
  Background:    #3D0808
  Padding:       sp-6
  Event name:    Cormorant 28px 700, White
  Date/time:     Inter 14px 400, Mist, with lucide:calendar icon

Info sections (cards):
  Venue, Budget, Type, Status
  Background #3A1A1A, padding sp-4, radius-md

Musicians allocated section:
  Header: "Músicos escalados"
  Each musician row: Avatar + Name + Instrument + Status badge
  Add musician: Ghost button with lucide:user-plus

Actions bar (bottom, sticky):
  [Editar]  [Cancelar evento]  [Compartilhar]
```

### Musician — My Events Screen
```
Top bar:
  "Meus Eventos" — Cormorant 24px 600, White
  Month picker pill

Filter chips (horizontal scroll):
  [Todos] [Confirmados] [Pendentes] [Recusados]
  Active chip: Cappella Red background, White text
  Inactive: #3A1A1A background, Stone text

Event list:
  Each card shows:
    Left accent (status color)
    Event name + date/time
    Venue (brief)
    Pay info (if available)
    [Confirmar] / [Recusar] CTAs (only if pending)

Empty state:
  Illustration: minimalist treble clef line art (white on dark)
  Text: "Nenhum evento por aqui ainda."
  Subtext: "Aguarde sua próxima escalação."
```

### Calendar Screen — View Toggle Behavior

```
Navigation between views:
  State is preserved when switching:
    - Selected date stays selected across all 4 views
    - Switching Year → Month → Week → Day always zooms into same date
    - Switching back (Day → Week → Month → Year) zooms back out

URL / routing (web) — React Router:
  /agenda/year          → Year view, current year
  /agenda/month         → Month view, current month
  /agenda/week          → Week view, current week
  /agenda/day           → Day view, today
  /agenda/day/2026-07-04 → Day view, specific date

Deep-link from notification → always opens Day view for event's date
Deep-link from event card   → always opens Event Detail (bottom sheet over Day view)

Default view by role:
  Everton (coordinator): Month view default
  Musician:              Week view default (sees upcoming gigs at a glance)
```

---

### Conflict Resolution Screen
```
Background: #1A0505 (full screen overlay / modal)
Header:     lucide:alert-triangle (32px, Warning color)
            "Conflito detectado" — Cormorant 24px 600, White
Body:
  Conflicting event card 1 (existing)
  VS divider — "⚠" centered
  Conflicting event card 2 (new)

Resolution options:
  [Escolher outro músico]  ← Primary (full width)
  [Forçar escalação]       ← Outlined Danger (full width)
  [Cancelar]               ← Ghost
```

---

### Event Creation / Edit Form

```
Route:        /eventos/novo  (create) / /eventos/:id/editar  (edit)
Mobile:       Full screen push from FAB or top bar action
Desktop:      Centered card, max-width 640px, in main content area

Header:
  Title:       "Novo Evento" / "Editar Evento"
  Right:       [Salvar] primary button (top bar on mobile)

Field order (single scroll, not multi-step):
  1. Nome do evento *       text input
  2. Data *                 date picker → Bottom Sheet
  3. Horário de início *    time picker → Bottom Sheet (15-min steps)
  4. Horário de término     time picker (optional, defaults +2h)
  5. Local *                text input with lucide:map-pin left icon
                            Future: Google Places autocomplete
  6. Tipo de evento         dropdown: [Cerimônia / Jantar / Show / Ensaio / Outro]
  7. Cachê total (R$)       numeric input, R$ prefix
  8. Observações            textarea, 4 rows, optional

Form validation:
  Required fields: Nome, Data, Horário início, Local
  Inline error below each field on blur or submit attempt
  Submit button disabled until all required fields valid

Save behavior:
  Success → navigate to Event Detail screen + Toast "Evento salvo."
  Error   → Toast danger + fields remain intact

Edit form pre-fill:
  All existing values pre-filled
  "Cancelar" ghost button → confirm discard if changes made
  Bottom: [Cancelar evento] destructive action — requires confirm dialog
```

---

### Allocation Panel — Escalar Músico

```
Route:    /eventos/:id/escalar
Desktop:  Right Drawer Panel (400px) — slides in while calendar stays visible
Mobile:   Full-screen push (stack nav)

Panel Header:
  Title:   "Escalar músicos" — Cormorant 20px 600, White
  Sub:     Event name — Inter 13px 400, #9E7E7E
  Close:   lucide:x (desktop drawer only)

Already allocated section:
  Title: "Escalados" — DM Sans 12px 500, Stone
  List:  Each row: [Avatar sm] [Name] [Instrument tag] [Status badge] [Remove icon]
         Remove icon: lucide:x 16px, #9E7E7E — tap opens confirm

Add musician section:
  Title: "Adicionar músico" — DM Sans 12px 500, Stone

  Search input (see Search Bar spec):
    Placeholder: "Buscar por nome ou instrumento"
    Results:     Filter musician roster inline (no new screen)

  Musician result row:
    Height:    56px
    Left:      [Avatar md] + [Name Inter 14px] + [Instrument DM Sans 12px Stone]
    Right:     Availability indicator + [Escalar] ghost button

    AVAILABILITY INDICATOR:
      ✅ Livre       — green dot + "Livre neste horário"
      ⚠️ Conflito   — amber dot + "Ocupado às 18:00"
      ❌ Indisponível— red dot + "Folga registrada"

    Tapping [Escalar] on a FREE musician:
      → Immediate allocation
      → Row shows CONFIRMADO badge
      → Toast: "[Name] escalado."

    Tapping [Escalar] on a CONFLICT musician:
      → Opens Conflict Resolution modal (see spec)

Empty state (no musicians match search):
  Text: "Nenhum músico encontrado"
  Sub:  "Tente outro nome ou instrumento."

Bottom action (desktop drawer):
  [Concluir] Primary button — closes panel, returns to calendar
```

---

### Musician Roster Screen

```
Route:    /musicos
Desktop:  Main content area, 3-column grid or sortable table
Mobile:   Full-screen list

Header:
  Title: "Músicos"
  Right: [+ Convidar músico] Primary button

Search + filter bar:
  [Search input] [Filter: Instrumento ▾] [Filter: Status ▾]

Desktop — Table view:
  Columns: [Avatar + Name] [Instrument] [Events (total)] [Status] [Actions]
  Row height: 56px
  Sortable columns: Name, Events
  Row hover: background #2A1010
  Row actions (on hover): [Ver perfil] [Ver agenda]

Mobile — Card list view:
  Each row: Avatar lg + Name + Instrument + event count badge
  Swipe right → [Ver agenda]
  Tap → Musician Profile screen

Musician status:
  Ativo     — DM Sans green badge
  Inativo   — DM Sans grey badge

Invite Musician form (/musicos/novo):
  Fields:   Nome *, E-mail *, Instrumento * (dropdown), Telefone
  Action:   Send invite email with login link
  Toast:    "Convite enviado para [email]."

Musician Profile screen (/musicos/:id):
  Header:   Avatar xl + Name (Cormorant 28px 600) + Instrument
  Stats:    [Total eventos] [Confirmados] [Recusados]
  Calendar: Mini month-view showing their allocations (read-only)
  History:  List of past events (scrollable)
  Actions:  [Editar dados] [Ver agenda completa]
```

---

### Notification Center Screen

```
Route:    /notificacoes
Mobile:   Full-screen push from bell icon
Desktop:  Opens as dropdown panel under bell icon in top bar
          Width: 380px, max-height: 480px, scrollable

Desktop dropdown:
  Background:    #1E0808
  Border:        1px solid #5C2A2A
  Border-radius: radius-md
  Shadow:        elevation-3
  Header:        "Notificações" DM Sans 14px 500 White
                 [Marcar tudo como lido] Ghost button right

Notification item:
  Height:        min 64px
  Padding:       sp-4
  Layout:        [Dot] [Icon] [Content] [Time]

  Unread dot:    6px circle, #7A1515, left-most
  Icon:          16px in colored circle (24px)
                 New gig → lucide:music / #7A1515 bg
                 Conflict → lucide:alert-triangle / #B87414 bg
                 Confirmed → lucide:check-circle-2 / #2D7A4A bg
                 Declined  → lucide:x-circle / #C0392B bg
  Title:         Inter 13px 500, White (unread) / #9E7E7E (read)
  Body:          Inter 12px 400, Stone — truncated 2 lines
  Time:          DM Sans 11px, Stone — relative ("há 2h", "Ontem")

  Tap → navigate to relevant screen (event detail, allocation panel)

  Unread:    Background #1E0808 (slightly lighter)
  Read:      Background transparent
  Hover:     Background #2A1010

Group by date:
  Section headers: "Hoje" / "Ontem" / "Esta semana"
  DM Sans 11px 500, Stone, uppercase

Empty state:
  Icon: lucide:bell-off, 32px, Stone
  Text: "Nenhuma notificação"
```

---

### Profile & Settings Screen

```
Route:    /perfil

Header section:
  Background:   #3D0808
  Avatar:       xl (56px)
  Name:         Cormorant 24px 600, White
  Role:         DM Sans 12px, Stone ("Coordenador" / "Músico")
  Edit button:  lucide:edit 16px, Ghost button

Settings sections (grouped list):

  CONTA:
    Nome completo          → edit inline
    E-mail                 → edit (requires re-auth)
    Telefone               → edit inline
    Alterar senha          → push to change-password screen

  PREFERÊNCIAS:
    Tema                   → [Escuro ● / Claro] toggle
    Idioma                 → Português (BR) — fixed for MVP
    Vista padrão da agenda → dropdown [Mês / Semana / Dia]

  NOTIFICAÇÕES:
    E-mail para escalações    → toggle
    Push: nova escalação      → toggle
    Push: lembrete 24h        → toggle
    Push: músico recusou      → toggle (Everton only)

  SOBRE:
    Versão do app          → "v1.0.0"
    Política de privacidade→ external link
    Termos de uso          → external link

  SAIR:
    [Sair da conta] — Danger text button
    Confirm dialog: "Tem certeza?" [Cancelar] [Sair]

Settings list item:
  Height:        52px
  Padding:       0 sp-4
  Border-bottom: 1px solid #2A1010
  Left:          Label Inter 14px 400, White
  Right:         Value (Stone) + lucide:chevron-right 16px
  Toggle items:  Switch component (red when active)
```

---

### Musician — Gig Confirmation Screen

> Critical flow. Must be reachable in ONE tap from notification.

```
Entry points:
  A) Push notification → deep link opens this screen directly
  B) Email CTA button → web link, opens Bottom Sheet over My Events
  C) My Events list → tap pending event card → this screen

Layout (Bottom Sheet — half-height by default, expandable):

  Handle bar (drag to expand)

  Event summary block:
    Name:     Cormorant 22px 600, White
    Date:     Inter 15px 500, White   — "Sábado, 12 de julho"
    Time:     Inter 14px 400, Mist    — "18:00 → 22:00"
    Venue:    lucide:map-pin + Inter 14px 400, Stone
    Fee:      lucide:banknote + Inter 14px 500, White — "R$ 200,00"

  Divider: 1px solid #3A1A1A

  Own schedule check (auto-loaded):
    If NO conflict:  "✅ Você está livre neste horário."
                     DM Sans 13px, Success color
    If CONFLICT:     "⚠ Você já tem outro evento às 18:00."
                     DM Sans 13px, Warning color
                     Shows conflicting event name

  CTA row:
    [Confirmar presença]   ← Primary full-width   44px
    [Não posso ir]         ← Outlined Danger full-width  44px
    Gap: sp-3 between buttons

  After confirming:
    Buttons replaced by: "✅ Presença confirmada!"
    Cormorant 20px 600, Success color
    Auto-dismiss sheet after 1.5s
    Toast: "Presença confirmada!"

  After declining:
    Optional textarea: "Motivo (opcional)" — 2 rows
    [Confirmar recusa] Primary
    Toast: "Escalação recusada."
```

---

### Day-Off Request Screen

```
Route:    /folga
Mobile:   Full-screen push from Profile tab
Desktop:  Bottom Sheet or centered modal

Header:
  Title: "Solicitar folga"
  Back:  lucide:arrow-left

Form:
  1. Data início *        date picker
  2. Data fim             date picker (defaults = início, for range)
  3. Motivo               text input (optional)
                          Placeholder: "Ex: Viagem, compromisso pessoal..."

Mini calendar preview:
  Shows selected range highlighted in #7A1515 on mini-month
  If conflicts with allocated events:
    Warning banner: "Você tem [N] eventos neste período."
    Lists conflicting event names
    [Continuar assim mesmo] / [Alterar datas]

Submit:
  [Solicitar folga] Primary full-width
  Toast success: "Folga registrada."
  Navigates back to Profile

Everton view (in Musician Profile /musicos/:id):
  Day-off requests show as blocks in musician's mini-calendar
  DM Sans 11px "Folga" label in grey
  [Aprovar] / [Recusar] actions (future — MVP auto-approves)
```

---

### First-Time Onboarding (Empty State Experience)

```
Trigger:
  First login after account creation
  Dashboard has zero events AND zero musicians

Onboarding is NOT a modal wizard. It is inline progressive disclosure:

STEP 1 — Dashboard empty state:
  Illustration: Minimalist treble clef + calendar icon (line art, white)
  Headline:     "Bem-vindo à Cappella, Everton!"
               Cormorant 28px 600, White
  Body:         "Comece criando seu primeiro evento."
               Inter 15px 400, Mist
  CTA:          [Criar primeiro evento] Primary button
  Skip link:    "Explorar depois" Ghost — dismisses onboarding

STEP 2 — After first event created:
  Contextual banner in Event Detail:
  "Agora escale os músicos para este evento."
  [Escalar músicos] inline CTA
  Banner dismisses after first allocation

STEP 3 — After first allocation:
  Contextual tooltip on Músicos nav item:
  "Adicione todos os seus músicos aqui para
   escalá-los rapidamente."
  Tooltip style: dark callout bubble, #3D0808, arrow pointing to nav item
  Dismisses on click

Progress indicator (optional, desktop only):
  Top of sidebar: 3-step progress bar
  Step labels: "Evento" → "Músico" → "Escalação"
  Background: #2A1010, filled #7A1515
  Disappears after all 3 steps completed
```

---

## 7.4 Animation & Motion

```
Principle: Purposeful motion only. Never decorative delays.

Page transitions:     Slide from right (push), slide to right (pop)
                      Duration: 280ms / Easing: ease-out-quart
                      (React Native: native stack navigator)

Cards appearance:     Fade + translateY(8px → 0)
                      Duration: 200ms / Easing: ease-out
                      Stagger: 40ms between items

Conflict alert:       Shake + pulse border once
                      Duration: 400ms / Easing: ease-in-out-back

Button press:         scale(0.97) / Duration: 100ms
Swipe delete:         Spring / friction: 10 / tension: 100

Status badge change:  Cross-fade + scale(1.05 → 1)
                      Duration: 180ms

Loading states:       Skeleton shimmer (Cappella Red tint)
                      Animation: left-to-right gradient sweep, 1.2s loop
```

---

# 8. UX WRITING GUIDELINES

## 8.1 UI Copy Principles

- **Lead with the outcome**, not the action: "Evento salvo" not "Salvar evento foi concluído"
- **No more than 5 words per label**
- **Status = verb in past tense**: Confirmado, Recusado, Realizado, Criado
- **CTAs = verb in infinitive**: Confirmar, Recusar, Salvar, Adicionar

---

## 8.2 Microcopy Library

### Navigation Labels
| Screen | PT-BR Label | Notes |
|--------|------------|-------|
| Dashboard | Início | Short, familiar |
| Calendar | Agenda | Not "Calendário" (too formal) |
| Allocations | Escalação | Industry term musicians know |
| Profile | Perfil | Standard |

### Action Labels (Buttons & CTAs)
| Action | PT-BR Label | Context |
|--------|------------|---------|
| Create event | Novo evento | FAB / menu |
| Save event | Salvar | Form submit |
| Allocate musician | Escalar músico | Allocation panel |
| Confirm gig | Confirmar | Musician CTA |
| Decline gig | Recusar | Musician CTA |
| Request day off | Solicitar folga | Musician settings |
| View details | Ver detalhes | Card action |
| Edit | Editar | Universal |
| Cancel event | Cancelar evento | Destructive |
| Log in | Entrar | Auth screen |
| Log out | Sair | Profile menu |
| Force allocation | Forçar mesmo assim | Conflict resolution |
| Choose another | Escolher outro músico | Conflict resolution |

### Status Labels
| Status | PT-BR | Color token |
|--------|-------|-------------|
| Confirmed | Confirmado | Success |
| Pending confirmation | Aguardando confirmação | Warning |
| Declined | Recusado | Danger |
| Completed | Realizado | Neutral |
| Conflict | Conflito | Warning |
| Created | Criado | Info |

### Form Field Labels & Placeholders
| Field | Label | Placeholder |
|-------|-------|-------------|
| Event name | Nome do evento | Ex: Casamento Silva & Costa |
| Date | Data | dd/mm/aaaa |
| Start time | Horário | 18:00 |
| Venue | Local | Nome ou endereço |
| Event type | Tipo | Cerimônia, Jantar, Show... |
| Budget / Fee | Cachê | R$ 0,00 |
| Notes | Observações | Informações adicionais |

### Toast / Feedback Messages
| Trigger | Message | Type |
|---------|---------|------|
| Event saved | "Evento salvo." | Success |
| Event deleted | "Evento removido." | Neutral |
| Musician allocated | "Lucas escalado para o evento." | Success |
| Conflict detected | "Conflito detectado. Lucas já tem evento neste horário." | Warning |
| Gig confirmed | "Presença confirmada!" | Success |
| Gig declined | "Escalação recusada." | Neutral |
| Network error | "Sem conexão. Tente novamente." | Danger |
| Generic error | "Algo deu errado. Tente novamente." | Danger |
| Day off saved | "Folga registrada." | Success |

### Empty States
| Screen | Headline | Subtext | CTA |
|--------|----------|---------|-----|
| No events | "Nenhum evento criado" | "Comece criando o primeiro evento da agenda." | "Novo evento" |
| No musicians allocated | "Nenhum músico escalado" | "Adicione músicos a este evento." | "Escalar músico" |
| No pending confirmations | "Tudo confirmado!" | "Todos os músicos responderam." | — |
| Musician - no upcoming gigs | "Nenhum evento por aqui" | "Aguarde sua próxima escalação." | — |

### Error Messages
| Error | User-facing message | Avoid |
|-------|--------------------|----|
| 401 Unauthorized | "Sessão expirada. Faça login novamente." | "Error 401" |
| 409 Conflict | "Este músico já tem evento neste horário." | "Conflict detected on allocation endpoint" |
| 404 Not found | "Este evento não existe ou foi removido." | "404 Not Found" |
| 500 Server | "Erro no servidor. Tente em alguns instantes." | "Internal server error" |
| Validation | "[Campo] é obrigatório." | "Null reference exception" |

---

## 8.3 Notification Copy

### Push Notifications

```
NEW GIG INVITATION
  Title: "Nova escalação 🎵"
  Body:  "[Event name] · [Date] · [Time] · [Venue]"
  CTA:   Deep-link → event detail with confirm/decline

48H REMINDER (unconfirmed)
  Title: "Aguardando sua confirmação"
  Body:  "[Event name] é [dia-da-semana]. Confirme sua presença."
  CTA:   Deep-link → confirm screen

EVENT REMINDER (24h before)
  Title: "Evento amanhã 🎶"
  Body:  "[Event name] · [Time] · [Venue]"
  CTA:   Deep-link → event detail

MUSICIAN CONFIRMED (to Everton)
  Title: "[Musician name] confirmou"
  Body:  "Presença confirmada para [Event name]."

MUSICIAN DECLINED (to Everton)
  Title: "[Musician name] recusou"
  Body:  "Você precisa escalar outro músico para [Event name]."
  CTA:   Deep-link → allocation panel
```

### Email Templates (Plain language)

```
GIG INVITATION SUBJECT:
  "Escalação: [Event name] - [Date]"

GIG INVITATION BODY STRUCTURE:
  Greeting: "Olá, [First name]."
  Main: "Você foi escalado para o evento abaixo:"
  Event block: Name / Date / Time / Venue / Fee
  CTA button: "Confirmar presença" [link]
  Secondary: "Não pode ir? Clique aqui para recusar." [link]
  Footer: "Cappella · Música para Eventos · Joinville"

CONFIRMATION RECEIPT SUBJECT:
  "Confirmado: [Event name] - [Date]"
```

---

## 8.4 Accessibility (a11y) Writing Notes

```
All icons must have aria-label in PT-BR:
  lucide:bell            → aria-label="Notificações"
  lucide:plus-circle     → aria-label="Novo evento"
  lucide:alert-triangle  → aria-label="Conflito detectado"
  lucide:check-circle-2  → aria-label="Confirmado"
  lucide:x-circle        → aria-label="Recusado"

Status badges must include text (not just color):
  ✅ "● Confirmado"   ← color + word
  ❌ Green dot only   ← fails color-blind users

Error messages must say WHAT and HOW TO FIX:
  ✅ "Data obrigatória. Selecione uma data para continuar."
  ❌ "Campo inválido."

Touch targets: All interactive elements ≥ 44×44px
```

---

# AGENT IMPLEMENTATION REFERENCE

> This section is a compact lookup table for the UI creation agent.

## Quick Token Reference

```yaml
# COLORS
color-brand-primary:     "#7A1515"
color-brand-dark:        "#3D0808"
color-brand-medium:      "#991C1C"
color-bg-dark:           "#1A0505"
color-surface-dark:      "#3A1A1A"
color-surface-elevated:  "#4D2020"
color-text-primary:      "#FFFFFF"
color-text-secondary:    "#E8D5D5"
color-text-muted:        "#9E7E7E"
color-border-dark:       "#5C2A2A"
color-bg-light:          "#FAF5F5"
color-surface-light:     "#FFFFFF"
color-text-light:        "#1A0505"
color-success:           "#2D7A4A"
color-success-bg:        "#E6F4EC"
color-warning:           "#B87414"
color-warning-bg:        "#FEF3DE"
color-danger:            "#C0392B"
color-danger-bg:         "#FDECEA"

# TYPOGRAPHY
font-display:  "Cormorant Garamond"
font-body:     "Inter"
font-label:    "DM Sans"
font-weights:  [400, 500, 600, 700]

# SPACING (base 4px)
sp-1: 4px   sp-2: 8px   sp-3: 12px  sp-4: 16px
sp-5: 20px  sp-6: 24px  sp-8: 32px  sp-10: 40px

# RADIUS
radius-xs: 4px   radius-sm: 8px   radius-md: 12px
radius-lg: 16px  radius-xl: 24px  radius-full: 9999px

# TAP TARGET MINIMUM
min-touch-target: 44px

# ICON LIBRARY
icons: "lucide-react" (web) / "lucide-react-native" (mobile)

# GOOGLE FONTS IMPORTS
"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap"
```

---

*Document authored for the Cappella platform — Música para Eventos, Joinville.*
*Designed for fast, practical, elegant delivery to musicians and coordinators.*
