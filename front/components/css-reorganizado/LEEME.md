# CSS reorganizado — David Martínez Estilista Unisex

## Qué se corrigió

1. **Variables sin coincidencia real**: `buttons.css`, `forms.css`, `table.css`,
   `navbar.css` usaban `--accent-color`, `--border-color`, `--primary-color`,
   `--card-bg` — nombres que no existían en ningún `:root`. Se corrigieron
   para usar los nombres reales de `variables.css` (`--color-primary`,
   `--color-border`, etc).

2. **`:root` triplicado**: `turno.css`, `empleadoyservicio.css` y `style.css`
   tenían el mismo bloque de variables del tema claro copiado y pegado.
   Ahora vive una sola vez en `theme-public.css`.

3. **`.main-content` con dos valores distintos** (250px en `dashboard.css`,
   260px en `sidebar.css`, mientras `variables.css` decía 280px). Ahora hay
   una sola definición en `sidebar.css`, usando `var(--sidebar-width)`.

4. **Responsive de la home**: reemplacé tamaños de fuente fijos
   (`font-size: 60px`) por `clamp()`, y `flex-wrap: nowrap` en
   `.services-grid` por `wrap`, para que no rompa en mobile.

## Dos temas, no lo mezcles

- **theme-public.css** → sitio público (home, turnos, clientes). Colores
  crema/dorado, los que ya tenías.
- **variables.css** → paneles internos (admin, barbero, cliente, etc — los
  de tus mockups). Colores oscuros.

No cargues los dos en la misma página salvo que sepas que uno pisa al otro
(ambos usan `:root`, pero con nombres de variable distintos, así que en
realidad conviven sin problema — simplemente no tiene sentido cargar el
tema público en un panel oscuro y viceversa).

## Orden de carga

### Páginas públicas (index.html, turnos.html, clientes.html)
```html
<link rel="stylesheet" href="css/theme-public.css">
<link rel="stylesheet" href="css/home.css">        <!-- solo en index.html -->
<link rel="stylesheet" href="css/turno.css">       <!-- solo en turnos.html -->
<link rel="stylesheet" href="css/empleadoyservicio.css"> <!-- solo donde aplique -->
```

### Paneles (dashboard admin, barbero, cliente, peluquero, colorista...)
```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/components/sidebar.css">
<link rel="stylesheet" href="css/components/navbar.css">
<link rel="stylesheet" href="css/components/cards.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/forms.css">
<link rel="stylesheet" href="css/components/table.css">
<link rel="stylesheet" href="css/components/modal.css">
<link rel="stylesheet" href="css/components/schedule.css"> <!-- si esa página usa agenda/horarios -->
<link rel="stylesheet" href="css/responsive.css">  <!-- siempre al final -->
```

## Pendiente de tu parte (no lo toqué, necesito que decidas)

- **`agenda.css`** estaba vacío. No lo incluí en la reorganización — decime
  para qué lo ibas a usar (¿la vista "Mi agenda" de barbero/peluquero de
  los mockups?) y lo armamos.
- **`style_copy.css`** parece un backup viejo en versión oscura de la home.
  No lo incluí. Si todavía lo necesitás como referencia, avisame y lo
  reintegro; si no, se puede borrar del proyecto.

## Estructura final

```
css/
├── variables.css          (tema oscuro — paneles)
├── theme-public.css       (tema claro — sitio público)
├── global.css             (reset + tipografía base, paneles)
├── home.css                (index.html)
├── turno.css                (turnos.html)
├── empleadoyservicio.css    (gestión de empleados/servicios)
├── dashboard.css            (layout shell de los paneles)
├── responsive.css           (breakpoints generales de paneles)
└── components/
    ├── navbar.css
    ├── sidebar.css
    ├── buttons.css
    ├── forms.css
    ├── cards.css
    ├── table.css
    ├── modal.css
    └── schedule.css
```
