> Convención de UX

* **List pages**: `Table` + filtros arriba + acciones a la derecha.
* **Detail pages**: `Header + Tabs` y dentro `Cards` con secciones.
* **Create/Edit**: **Modal** o **Drawer** (si no tienes drawer nativo, usas `Modal` “placement=right” estilo drawer).
* **Selectors**: `Autocomplete` para Owners/Areas/Entities (evita selects largos).
* **Status**: `Chip` + `Dropdown` para cambiar rápido.

---

# 0) Componentes base reutilizables (para todas las pantallas)

## Layout

* **Sidebar**: `Card` + `Button` (links) + `Divider`
* **Topbar**: `Navbar`, `Dropdown` (perfil), `Avatar`, `Button` (Create), `Input` (search)
* **Page shell**: `Breadcrumbs`, `Spacer`, `Card` (contenedor de contenido)

## UI helpers

* `Chip` (status / role / tags)
* `Tooltip` (acciones)
* `Skeleton` (carga)
* `Pagination` (listas)
* `Modal` (create/edit)
* `Popover` (acciones rápidas)
* `Sonner` toast para feedback

## Formularios (pattern)

* `react-hook-form` + `zod`
* Campos: `Input`, `Textarea`, `Autocomplete`, `Select`, `DateInput/DatePicker` (según tu setup), `Switch`, `Slider` (confidence), `Button`

---

# 1) Auth

## /login

**Componentes**

* `Card` (contenedor)
* `Input` email
* `Input` password
* `Button` “Ingresar”
* `Link` “Olvidé mi contraseña”
* `Divider` (opcional)
* `Button` “Magic Link” (opcional)

## /reset

* `Card`
* `Input` email
* `Button` “Enviar reset”
* `Toast` confirmación

---

# 2) Dashboard

## /dashboard (CEO view y Area view con filtros)

**Header**

* `Breadcrumbs`
* `Select` o `Autocomplete` “Ciclo”
* `Autocomplete` “Área” (si no eres CEO, preseleccionado)
* `Button` “Crear Check-in” (quick)

**Resumen (cards)**

* `Card` x 4–8

  * `Chip` status + número (objetivos on track, krs on track, iniciativas bloqueadas, riesgos abiertos)
* Dentro: `Progress`/`CircularProgress` (si la versión lo soporta) o texto

**Tablas**

* `Tabs`: “Prioridades”, “Bloqueados”, “Sin evidencia”, “Riesgos”
* Cada tab: `Table` + `Pagination`

---

# 3) Cycles

## /cycles (lista)

* `Input` search
* `Select` status (planned/active/closed)
* `Button` “Nuevo ciclo”
* `Table` columnas: cycle_id, name, fechas, status, acciones
* `Pagination`

**Create/Edit Modal**

* `Modal`
* `Input` cycle_id
* `Input` name
* `DatePicker` start/end
* `Select` status
* `Textarea` notes
* `Button` Guardar

## /cycles/[cycleId] (detalle)

**Header**

* `Card` resumen (name, fechas, status)
* `Chip` status + botones “Activar/Cerrar”

**Tabs**

1. Overview: `Card` + campos
2. Objectives: `Table`
3. Initiatives: `Table`
4. Health: `Card` KPIs + `Table` bloqueados

---

# 4) Objectives

## /objectives (lista)

**Filtros**

* `Autocomplete` ciclo
* `Autocomplete` área
* `Autocomplete` owner
* `Select` status
* `Select` type (company/area)
* `Select` priority (1–5)
* `Button` “Nuevo objetivo”

**Lista**

* `Table` columnas: title, type, status(Chip), confidence, owner, area, priority, acciones
* `Pagination`

**Create/Edit Modal (1:1)**

* `Modal`
* `Input` objective_key
* `Autocomplete` cycle_id
* `Autocomplete` area_id
* `Input` title
* `Textarea` description
* `Select` objective_type
* `Autocomplete` owner_id
* `Select` priority
* `Select` status
* `Slider` confidence (0–100) + `Input` number
* `Button` Guardar

## /objectives/[objectiveId] (detalle)

**Header**

* `Card`:

  * Title
  * `Chip` status
  * `Slider` confidence quick edit
  * `Autocomplete` owner
  * `Chip` priority
  * Acciones: `Button` Edit, `Button` Add KR, `Button` Add Check-in

**Tabs**

1. **Overview**

   * `Card` (campos completos + edit inline)
2. **Key Results**

   * `Table` + `Button` “Nuevo KR”
   * KR Row actions: Edit (Modal), Update current_value quick (`Input`)
3. **Initiatives (link/unlink)**

   * `Input` search initiatives
   * `Table` iniciativas vinculadas con columnas: relation_type, weight, status, owner
   * `Button` “Vincular iniciativa” abre `Modal`:

     * `Autocomplete` iniciativa
     * `Select` relation_type
     * `Slider` weight (0..1)
4. **Check-ins**

   * `Button` “Nuevo check-in”
   * Lista timeline: `Card` repetida por checkin (fecha, status, confidence, blockers)
5. **Evidence**

   * `Button` “Adjuntar evidencia”
   * `Table`/`List` con `Link` + `Chip` type
6. **Risks**

   * `Table` riesgos + `Button` crear
7. **Dependencies**

   * `Table` dependencias + `Button` crear
8. **Decisions**

   * `Table` decisions + `Button` crear

---

# 5) Key Results (si haces página global opcional)

## /krs (opcional)

* Mismos filtros que objectives + `Autocomplete` objective
* `Table`
* Modal create/edit 1:1

---

# 6) Initiatives

## /initiatives (lista)

**Filtros**

* `Autocomplete` ciclo
* `Autocomplete` área
* `Autocomplete` owner
* `Select` status
* `Select` effort (S/M/L)
* `Select` impact (1–5)
* `Select` priority (1–5)
* `Button` “Nueva iniciativa”

**Tabla**

* name, status, owner, area, dates, effort, impact, priority, acciones
* `Pagination`

**Create/Edit Modal (1:1)**

* `Modal`
* `Input` initiative_key
* `Autocomplete` cycle_id
* `Input` name
* `Textarea` problem_statement
* `Textarea` expected_outcome
* `Autocomplete` owner_id
* `Autocomplete` area_id
* `DatePicker` start_date / due_date
* `Select` status
* `Select` priority
* `Select` effort
* `Select` impact
* `Textarea` notes
* `Button` Guardar

## /initiatives/[initiativeId] (detalle)

**Header**

* `Card` (name)
* `Chip` status
* `Chip` effort + `Chip` impact
* Owner/Area quick edit (`Autocomplete`)
* Acciones: Edit, New WorkItem, New Check-in, Add Evidence

**Tabs**

1. Overview
2. Work Items (Table + optional Kanban)
3. Objectives vinculados (bridge reverse)
4. Check-ins (timeline)
5. Evidence
6. Risks
7. Dependencies
8. Budget
9. Decisions

---

# 7) Work Items

## /work-items (lista global)

**Filtros**

* `Autocomplete` ciclo (derivado por initiative.cycle_id)
* `Autocomplete` iniciativa
* `Autocomplete` owner
* `Select` status (todo/doing/blocked/done)
* `Select` type (task/deliverable/experiment/meeting/automation)
* `Select` priority
* `DatePicker` due_date range (opcional)
* `Button` “Nuevo work item”

**Vista**

* `Tabs`: Table / Kanban (si haces Kanban)
* Table columnas: title, type, status(Chip), owner, due_date, estimate_hours, actual_hours, link, acciones

**Create/Edit Modal (1:1)**

* `Input` workitem_key
* `Autocomplete` initiative_id
* `Input` title
* `Select` type
* `Autocomplete` owner_id
* `Select` status
* `Select` priority
* `DatePicker` start_date / due_date
* `Input` estimate_hours
* `Input` actual_hours
* `Input` link_to_tool
* `Textarea` acceptance_criteria
* `DatePicker/DateTime` completed_at
* `Button` Guardar

## /work-items/[workitemId] (detalle)

* `Card` header + quick status + owner + due_date
* `Tabs`: Overview / Evidence / History (opcional)

---

# 8) Check-ins

## /checkins (lista)

**Filtros**

* `Select` entity_type
* `Autocomplete` entity_id (dependiente del type)
* `DatePicker` range
* `Select` status
* `Button` Nuevo check-in

**Tabla**

* date, entity_type, entity_title (lookup), status, confidence, blockers, acciones

**Create Modal (1:1)**

* `Select` entity_type
* `Autocomplete` entity_id
* `DatePicker` checkin_date
* `Select` status
* `Slider` confidence
* `Textarea` progress_note
* `Textarea` next_actions
* `Textarea` blockers
* `Button` Guardar

---

# 9) Evidence

## /evidence (lista)

**Filtros**

* `Select` entity_type
* `Autocomplete` entity_id
* `Select` type (report/dashboard/demo/…)
* `DatePicker` range
* `Button` Adjuntar evidencia

**Lista**

* `Table` con title, type(Chip), url(Link), created_at, entity, acciones

**Create Modal**

* `Select` entity_type
* `Autocomplete` entity_id
* `Input` title
* `Input` url
* `Select` type
* `Button` Guardar

---

# 10) Risks

## /risks (lista)

**Filtros**

* entity_type + entity_id
* status
* owner
* prob/impact ranges (opcional)
* `Button` Nuevo riesgo

**Table**

* description, probability, impact, score badge, mitigation, owner, status, acciones

**Create/Edit Modal**

* entity_type/entity_id
* description
* probability (Select 1–5)
* impact (Select 1–5)
* mitigation (Textarea)
* owner_id (Autocomplete)
* status (Select)
* Guardar

---

# 11) Dependencies

## /dependencies (lista)

**Filtros**

* from_type/from_id
* to_type/to_id
* dependency_type
* `Button` Nueva dependencia

**Create/Edit Modal**

* from_type (Select)
* from_id (Autocomplete)
* to_type (Select)
* to_id (Autocomplete)
* dependency_type (Select blocks/relates/requires)
* notes (Textarea)

---

# 12) Budget

## /budget (lista)

**Filtros**

* initiative_id
* category
* date range
* vendor
* currency
* `Button` Nuevo item

**Table**

* initiative, category, planned, actual, vendor, spend_date, acciones

**Create/Edit Modal**

* initiative_id (Autocomplete)
* category (Input/Select)
* planned_amount (Input)
* actual_amount (Input)
* currency (Select)
* vendor (Input)
* spend_date (DatePicker)
* Guardar

---

# 13) Decision Log

## /decisions (lista)

**Filtros**

* date range
* owner
* entity_type/entity_id
* `Button` Nueva decisión

**Table**

* date, title, owner, entity, evidence_url, acciones

**Create/Edit Modal**

* decision_date (DatePicker)
* title (Input)
* context (Textarea)
* decision (Textarea)
* owner_id (Autocomplete)
* entity_type (Select)
* entity_id (Autocomplete)
* evidence_url (Input)
* Guardar

---

# 14) Admin

արար: solo CEO/CTO/PM

## /admin/areas

* Table + Create/Edit Modal (ya descrito)

## /admin/owners

* Table + Create/Edit Modal (ya descrito)

## /admin/settings

* Cards con:

  * ciclo por defecto
  * reglas (por ejemplo “evidencia requerida”)
  * toggles (Switch)

---

# 15) Componentes “killer” (UX extra que vale oro)

## A) Global Search (⌘K)

* `Modal` + `Input` + results list (Card list)
* Busca en objectives/initiatives/workitems

## B) Quick Edit inline

En detail pages:

* `Chip` status clickeable abre `Dropdown`
* `Slider` confidence inline
* owner/area con `Autocomplete` inline

## C) “Sin evidencia reciente”

* `Card` en dashboard + tabla:

  * iniciativas sin evidencia en 7/14 días
* Esto cambia comportamiento del equipo.

---