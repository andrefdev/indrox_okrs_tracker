# 1) Stack final para construir rápido con UI/UX top (HeroUI)

## Frontend

* **Next.js (App Router) + TypeScript**
* **HeroUI v3**
* **Tailwind CSS** (HeroUI está construido sobre Tailwind) ([HeroUI (Previously NextUI)][2])

## UI/UX

* `@heroui/react` (componentes) ([npm][3])
* Tailwind + HeroUI setup oficial (incluye archivo `hero.ts` y config) ([HeroUI (Previously NextUI)][2])
* `framer-motion` (microinteracciones)
* `next-themes` (dark/light)
* `sonner` (toasts)

## Formularios + Validación

* `react-hook-form`
* `zod`
* `@hookform/resolvers`

## Data

* Supabase Auth + Postgres
* `@supabase/supabase-js`
* `@supabase/ssr` (session en server / cookies)

> Nota importante: **HeroUI es el rebrand de NextUI**. Si ves docs o ejemplos de NextUI, migran directo a HeroUI. ([HeroUI (Previously NextUI)][4])

---

# 2) Instalación rápida (sin inventos)

## Paquetes (mínimo)

```bash
pnpm add @heroui/react @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers framer-motion next-themes sonner
```

## Setup HeroUI (Next.js)

Sigue el flujo oficial para Next.js: Tailwind + `hero.ts` + importar styles/config. ([HeroUI (Previously NextUI)][2])

> Si quieres lo más rápido posible: usa **HeroUI CLI** para iniciar el proyecto y evitar glue code. ([HeroUI (Previously NextUI)][5])

---

# 3) Modelo de usuarios y roles (con tus roles)

Roles: `CEO/CMO/CTO/PM/Dev/Devops/UI Designer`

✅ Recomendación práctica:

* En DB, usa `core.owner.role` como enum:

  * `CEO`, `CMO`, `CTO`, `PM`, `DEV`, `DEVOPS`, `UI_DESIGNER`
* `core.owner.auth_user_id` referencia el usuario de Supabase Auth (no FK directo, pero coincide el UUID).

## Reglas de permisos (simples y efectivas)

* **CEO**: todo (admin total)
* **CMO/CTO/PM**: crean/editan estrategia (objectives, krs, initiatives) + ven todo
* **DEV/DEVOPS/UI_DESIGNER**:

  * ven todo (transparencia)
  * editan **sus WorkItems**
  * pueden crear Check-ins / Evidence (si decides permitirlo)

Esto lo aplicas en:

* **RLS en Supabase** (seguridad real)
* UI (oculta acciones según rol)

---

# 4) Arquitectura Next.js (para avanzar rápido)

## Estructura de rutas (App Router)

```
/app
  /(auth)
    /login
    /reset
  /(app)
    /dashboard
    /cycles
      /[cycleId]
    /objectives
      /[objectiveId]
    /initiatives
      /[initiativeId]
    /work-items
      /[workitemId]
    /checkins
    /evidence
    /risks
    /dependencies
    /budget
    /decisions
    /admin
      /owners
      /areas
      /settings
```

## Patrón UI (para que sea SaaS “top”)

* Layout: Sidebar + Topbar
* Páginas: **List + Detail**
* Crear/Editar: **Modal/Drawer**
* Tabs en detalle: Overview / Relaciones / Check-ins / Evidence / Risks / Budget / Decisions

---

# 5) Pantallas 1:1 con tus tablas (Opción 2 completa)

Abajo te detallo **cada tabla** y cómo debe verse / editarse.

## A) `okr.okr_cycle`

**List:** tabla con `cycle_id`, `name`, `start_date`, `end_date`, `status`
**Create/Edit:** todos los campos + botón “Activar ciclo” / “Cerrar ciclo”
**Detail (`/cycles/[id]`):**

* Resumen del ciclo
* Objetivos del ciclo (tabla)
* Iniciativas del ciclo (tabla)
* Vista “salud del ciclo” (counts por status)

Campos:

* `cycle_id`, `name`, `start_date`, `end_date`, `status`, `notes`

---

## B) `core.area`

**Admin > Areas**

* CRUD completo
* Campos: `area_key`, `code`, `name`, `lead_owner_id`
* Select de lead_owner con búsqueda (HeroUI Select/Autocomplete)

---

## C) `core.owner`

**Admin > Owners**

* CRUD completo
* Campos: `owner_key`, `full_name`, `role`, `email`, `area_id`, `is_active`, `auth_user_id`
* Acción especial: “Vincular con usuario Supabase” (pegar UUID)
* Vista: owners por área

---

## D) `okr.objective`

**List:** filtros por `cycle`, `area`, `owner`, `status`, `priority`
Columnas: title, type, status, confidence, owner, area, priority
**Create/Edit:** todos los campos
**Detail:** Tabs:

1. **Overview** (todos los campos + quick edit)
2. **Key Results** (tabla + add/edit)
3. **Initiatives (M:N)** (tabla + “link/unlink”)
4. **Check-ins** (timeline)
5. **Evidence** (lista)
6. **Risks**
7. **Dependencies**
8. **Decision Log**

Campos:

* `objective_key`, `cycle_id`, `area_id`, `title`, `description`, `objective_type`, `owner_id`, `priority`, `status`, `confidence`

---

## E) `okr.key_result`

**En detalle del objetivo** o también list global por ciclo
**Create/Edit:** todos los campos

* `baseline_value`, `target_value`, `current_value` (como text/num)
* `unit`, `scoring_method`, `status`, `confidence`
  **Mejor UX:** slider o input number para `confidence`, chips para status.

Campos:

* `kr_key`, `objective_id`, `title`, `metric_name`, `baseline_value`, `target_value`, `current_value`, `unit`, `scoring_method`, `status`, `confidence`

---

## F) `okr.initiative`

**List:** filtros por ciclo, área, owner, status, effort, impact, priority
**Create/Edit:** todos los campos
**Detail Tabs:**

1. Overview
2. Work Items
3. Objectives vinculados (desde bridge)
4. Check-ins
5. Evidence
6. Risks
7. Dependencies
8. Budget
9. Decisions

Campos:

* `initiative_key`, `cycle_id`, `name`, `problem_statement`, `expected_outcome`, `owner_id`, `area_id`, `start_date`, `due_date`, `status`, `priority`, `effort`, `impact`, `notes`

---

## G) `okr.objective_initiative` (bridge M:N)

Esto debe ser UI “Linker”, no CRUD feo.

**En Objective → tab Initiatives**

* Search initiatives del mismo ciclo
* Link con:

  * `relation_type` (primary/secondary)
  * `weight` (0..1)
* Unlink

**En Initiative → tab Objectives**

* Igual en reversa

Campos:

* `objective_id`, `initiative_id`, `relation_type`, `weight`

---

## H) `okr.work_item`

**Vista global** tipo “tareas”:

* filtros por ciclo, iniciativa, owner, status, type, due_date
* switch: Table / Kanban (Kanban si te da tiempo)

**Create/Edit:** todo (1:1)
Campos:

* `workitem_key`, `initiative_id`, `title`, `type`, `owner_id`, `status`, `priority`, `start_date`, `due_date`, `estimate_hours`, `actual_hours`, `link_to_tool`, `acceptance_criteria`, `completed_at`

**Detalle WorkItem**

* Overview
* Evidence link rápido
* Quick check-in (si decides permitir checkin por work item en futuro)

---

## I) `okr.checkin`

**List:** filtros por entity_type, ciclo (derivado), owner (derivado)
**Create:** (modal rápido)

* `entity_type` (objective/kr/initiative)
* `entity_id` (selector depende del tipo)
* `checkin_date`, `status`, `confidence`, `progress_note`, `next_actions`, `blockers`

**UX clave:**

* “Create check-in” siempre visible en Objective/Initiative/KR.

---

## J) `okr.evidence`

**Create (rápido):**

* `entity_type`, `entity_id`, `title`, `url`, `type`
  **Vista:**
* Por entidad
* Global “sin evidencia reciente” (últimos 7/14 días)

---

## K) `okr.dependency`

CRUD normal con selectores:

* from_type/from_id → to_type/to_id
* dependency_type
* notes

---

## L) `okr.risk`

CRUD + scoring:

* `probability (1–5)`
* `impact (1–5)`
* computed badge “risk_score = prob*impact” (solo UI)
* mitigation, owner_id, status

---

## M) `okr.budget_item`

CRUD + filtros por initiative y fecha:

* category, planned_amount, actual_amount, currency, vendor, spend_date

---

## N) `okr.decision_log`

CRUD:

* decision_date, title, context, decision, owner_id, entity_type/entity_id, evidence_url

---

# 6) Componentes HeroUI que vas a usar (para construir como fábrica)

* Layout: `Navbar`, `Button`, `Dropdown`, `Avatar`
* Navegación: `Tabs`, `Breadcrumbs`
* Inputs: `Input`, `Textarea`, `Select`, `Autocomplete`, `DatePicker` *(según tu versión)*
* Feedback: `Chip` (status), `Tooltip`, `Modal`, `Toast (sonner)`
* Datos: `Table`, `Pagination`, `Skeleton`, `Card`

(La API exacta depende de v2/v3; por velocidad, usa **v2 estable**. ([GitHub][1]))

---

# 7) Data layer para ir rápido (sin API routes)

## Recomendación

* Usa **Server Actions** para mutations (create/update/delete)
* Usa Server Components para lists/details
* Revalidación: `revalidatePath("/objectives")`

## Tip clave para velocidad

Genera tipos desde Supabase:

```bash
supabase gen types typescript --project-id YOUR_ID > src/lib/db.types.ts
```

Así evitas errores y la IA puede codear más rápido.

---

# 8) Autenticación Supabase (SSR) — implementación recomendada

* Middleware para proteger `(app)`
* `createServerClient` con `@supabase/ssr`
* En login: `signInWithPassword`
* En server: `supabase.auth.getUser()` y mapear a `core.owner`

**Pantalla “First login setup”**
Si el user existe en auth pero no en `core.owner`:

* mostrar un mensaje: “Tu usuario aún no está habilitado, contacta a PM/CTO”.

---

# 9) RLS (seguridad real) mínimo para tu caso single-org

Ya tienes una base, pero para que sea **perfecta para app** te recomiendo añadir:

### Columns recomendadas (para control fino)

* `created_by uuid` en `okr.checkin`, `okr.evidence`, `okr.work_item` (opcional)
* `updated_at` en todas (si no está)

Así logras:

* “el que crea puede editar”
* historial más auditado

Si quieres, te puedo entregar el bloque exacto de SQL para:

* agregar `created_by`
* policies por rol
* policies “owner puede editar lo suyo”

---

# 10) Plan de ejecución para sacar el sistema rápido (con Opción 2)

## Sprint 0 (setup)

1. Next + Tailwind + HeroUI setup ([HeroUI (Previously NextUI)][2])
2. Supabase auth SSR
3. Layout + navegación + theming

## Sprint 1 (core OKR)

4. Cycles (CRUD)
5. Objectives (CRUD) + KRs (CRUD embebido)
6. Initiatives (CRUD) + WorkItems (CRUD)

## Sprint 2 (gobernanza)

7. Objective-Initiative link/unlink
8. Check-ins + Evidence
9. Risks + Dependencies
10. Budget + Decision log

## Sprint 3 (UX killer)

11. Dashboard CEO / Dashboard por área
12. Search global + filtros guardados
13. Vista “Sin evidencia en X días” + “Bloqueados”

---

# 11) Entregable que te faltaba para “todo completo”

Para que puedas construir sin fricción con IA, lo ideal es que cierres estas 2 decisiones (son rápidas):

1. **¿Usarás HeroUI v2 estable o v3 beta?**

   * Yo recomiendo **v2** para ir rápido y evitar cambios. ([GitHub][1])
2. **¿Quieres permitir que DEV/DEVOPS/UI_DESIGNER editen check-ins/evidence o solo leads?**

   * Recomendación: **todos pueden crear check-ins/evidence**, solo leads pueden borrar.

---
