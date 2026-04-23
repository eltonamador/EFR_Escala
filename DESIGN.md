---
name: Tactical Precision UI
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#161c22'
  on-tertiary-container: '#7e848c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-sm:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 16px
---

## Brand & Style

The design system is engineered for high-stakes operational environments, specifically for the management of Live Fire Exercises (EFR - Exercício com Fogo Real). The brand personality is authoritative, reliable, and meticulously organized, evoking a sense of "command and control." It prioritizes efficiency over decoration, ensuring that technical data is digestible under pressure.

The aesthetic follows a **Corporate/Modern** movement with a **Technical/Minimalist** edge. It utilizes a structured, grid-based approach that mimics military instrumentation—precise, functional, and devoid of unnecessary flourishes. The goal is to instill confidence through clarity, using a disciplined visual hierarchy that highlights critical scheduling conflicts and safety statuses immediately.

## Colors

The color palette is anchored in "Deep Slate" and "Navy Blue" to establish a professional, institutional foundation. The background utilizes varying shades of cool whites and grays to segment data without using heavy lines.

**Functional Color Application:**
- **Primary (#0F172A):** Used for navigation headers, primary actions, and high-level typography.
- **Secondary (#334155):** Reserved for sub-headers and secondary UI elements.
- **Status (Semantic):** These are non-negotiable indicators. 
    - **Sucesso (Verde):** Indicates validated schedules or safety cleared.
    - **Alerta (Laranja):** Critical warnings or high-priority attention required.
    - **Conflito (Vermelho):** Overlapping schedules or safety violations.
    - **Incompleto (Cinza):** Draft states or pending data.

## Typography

This design system employs a multi-font strategy to differentiate between administrative text and operational data.

- **Public Sans** is used for the primary UI shell and headings, providing a clean, institutional clarity that is highly legible.
- **Inter** handles the bulk of the body text and form inputs, chosen for its neutral tone and exceptional readability in data-heavy tables.
- **Space Grotesk** is introduced for labels and technical data points (times, coordinates, unit IDs). Its geometric, slightly technical character helps technical information stand out from descriptive text.

*Note: All technical labels should use the `label-caps` style to differentiate descriptors from the data they represent.*

## Layout & Spacing

The layout utilizes a **12-column Fixed Grid** for main dashboard views, switching to a fluid model for internal data tables. 

**Logic:**
- **Density:** The design system adopts a "Compact" density model to maximize information density without sacrificing legibility. 
- **Rhythm:** A 4px baseline grid ensures vertical consistency. 
- **Data Tables:** Tables are the heart of the EFR application. They must use a "Zebra-stripe" pattern with subtle `tertiary` fills and 8px cell padding (sm).
- **Dashboards:** Use a "Card-on-Gray" approach, where the main background is `neutral` (#F8FAFC) and individual modules are housed in white cards with distinct margins (`lg`).

## Elevation & Depth

To maintain a "clean and technical" feel, the design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Low-contrast Outlines**.

1.  **Level 0 (Surface):** The application background (#F8FAFC).
2.  **Level 1 (Card):** White surfaces (#FFFFFF) with a 1px solid border (#E2E8F0). No shadow.
3.  **Level 2 (Overlay/Modal):** White surfaces with a very soft, diffused ambient shadow (0px 8px 24px rgba(15, 23, 42, 0.08)) to indicate temporary interaction.
4.  **Interaction:** Hover states on interactive rows or cards should use a subtle tint change (Background: #F1F5F9) rather than an elevation increase.

## Shapes

The shape language is "Soft" (4px radius). This provides a modern touch while maintaining the rigid, disciplined feel required for military applications. 

- **Primary Buttons & Inputs:** 4px (0.25rem) corner radius.
- **Status Badges:** 2px corner radius or fully squared to emphasize their "tag" nature.
- **Data Cards:** 8px (0.5rem) for larger containers to create a clear container-to-content relationship.

## Components

**Buttons:**
- **Primary:** Solid `primary` color with white text. High contrast for "Confirmar Exercício" or "Salvar".
- **Secondary:** Outlined with `secondary` border. Used for "Editar" or "Filtrar".
- **Ghost:** No border, used for navigation within tables.

**Status Badges (Badges de Status):**
- Small, uppercase text using `label-caps`. 
- Use a "Subtle" style: A light background tint of the status color with high-contrast text of the same hue (e.g., Success: Light green background with dark green text).

**Data Tables (Tabelas de Dados):**
- Headers: Sticky, `secondary` text color, 12px `label-caps`.
- Rows: High-contrast text. Hover state required. 
- Conflicts: A row in a "Conflict" state should have a 4px left-border highlight in `conflict` (Red).

**Cards de Calendário (Scheduling Cards):**
- Must display time, unit name, and location clearly.
- Use a vertical color bar on the left edge of the card to indicate the current status (OK/Alerta/Conflito).

**Inputs:**
- Simple 1px borders. Focus state uses a 2px `primary` border. 
- Error state uses a 1px `conflict` (Red) border with supporting help text.

**Additional Recommended Components:**
- **Timeline/Gantt View:** A custom view for visualizing "Fogo Real" windows across multiple ranges.
- **Resource Conflict Banner:** A persistent top-bar notification when overlapping assets are detected.