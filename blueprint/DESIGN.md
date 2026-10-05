---
name: Islamic Educational Attendance
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#404941'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#717970'
  outline-variant: '#c0c9be'
  surface-tint: '#2e6a41'
  primary: '#003b1b'
  on-primary: '#ffffff'
  primary-container: '#14532d'
  on-primary-container: '#87c695'
  inverse-primary: '#96d5a3'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#002b7b'
  on-tertiary: '#ffffff'
  tertiary-container: '#003fab'
  on-tertiary-container: '#9eb5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f2be'
  primary-fixed-dim: '#96d5a3'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#12512c'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies a modern, purposeful, and dignified aesthetic tailored for contemporary Islamic educational institutions, universities, and madrasahs. It synthesizes institutional gravitas with the streamlined efficiency of modern SaaS utility. The emotional tone evokes trustworthiness, calm order, discipline, and clarity—essential qualities for academic record-keeping and student presence tracking.

The design philosophy adopts a refined **Minimalist & Utilitarian Modern** direction:
- **Clean Structure & Restraint:** Visual noise is stripped away to prioritize tabular data, status indicators, and operational speed.
- **Dignified Islamic Identity:** Rather than relying on overt ornamental motifs, the visual identity draws from deep forest evergreens and refined emerald accents, reflecting growth, integrity, and tradition in a contemporary frame.
- **Accessibility & Contrast:** Every interaction satisfies WCAG AA contrast standards. Status markers are never conveyed through color alone; every indicator combines distinct iconography with localized, explicit labeling.

## Colors

The color palette is built on high contrast, institutional clarity, and functional semantic signaling.

### Primary & Accent
- **Primary (`#14532D`):** Deep Forest Islamic Green. Used for major institutional navigation surfaces, brand markers, primary action buttons, and dominant table headers.
- **Secondary (`#059669`):** Refined Emerald. Used for focused states, subtle interactive highlights, active tab underscores, and supporting badges.
- **Tertiary (`#2563EB`):** Structured Blue. Reserved for administrative utilities, external duty badges, informational banners, and auxiliary operational tags.

### Status Tiers (Strict BRD Protocol)
- **Hadir (Present):** Background `#ECFDF5`, Border `#A7F3D0`, Text/Icon `#047857` (Emerald 700 / `#10B981` core).
- **Terlambat (Late):** Background `#FFFBEB`, Border `#FDE68A`, Text/Icon `#B45309` (Amber 700 / `#F59E0B` core).
- **Izin / Sakit / Dinas Luar (Excused / Sick / Official Duty):** Background `#EFF6FF`, Border `#BFDBFE`, Text/Icon `#1D4ED8` (Blue 700 / `#2563EB` core).
- **Alpa (Absent / Unexcused):** Background `#FEF2F2`, Border `#FECACA`, Text/Icon `#B91C1C` (Crimson / `#EF4444` core).

### Neutrals & Canvas
- **Background App:** `#F8FAFC` (Slate 50) creates a soft, low-glare working surface.
- **Surface / Cards:** `#FFFFFF` (Pure White).
- **Subtle Surface (Table Head / Striping):** `#F1F5F9` (Slate 100).
- **Borders & Dividers:** `#E2E8F0` (Slate 200) for standard 1px container frames.
- **Text Hierarchy:** High-contrast neutral `#0F172A` (Slate 900) for primary headers/body, `#475569` (Slate 600) for secondary metadata, and `#94A3B8` (Slate 400) for disabled elements.

## Typography

The typographic hierarchy is organized into three defined tiers: **Judul** (Headers), **Isi** (Body), and **Keterangan** (Labels & Metadata).

### Hierarchy Rules
1. **Tier 1: Judul (Headings - Plus Jakarta Sans)**
   - `headline-lg` / `headline-lg-mobile`: Page headings, institutional reporting titles, and high-level attendance metric summaries.
   - `headline-md`: Card titles, section headers, modular widget anchors.
   - `headline-sm`: Subsection titles, table group headers, modal dialog titles.
2. **Tier 2: Isi (Body Text - Inter)**
   - `body-lg`: Lead introductory paragraphs, prompt dialog instructions.
   - `body-md`: Standard interface text, table cell primary values (e.g., student name, matriculation ID), input fields.
   - `body-sm`: Compact data rows, secondary table columns (e.g., timestamps, location coordinates).
3. **Tier 3: Keterangan (Badges, Meta, Labels - Inter)**
   - `label-md`: Status badges, field labels, tab triggers, button text.
   - `label-sm`: Micro-indicators, time-ago metadata, footnotes, legal attributions.

All numbers in attendance percentages, timestamps, and counts should utilize tabular numerals (`font-feature-settings: 'tnum' on`) for strict vertical alignment.

## Layout & Spacing

The layout is built around a predictable, high-density **Fluid Grid** that maintains legibility on tablet displays in lecture halls and administrative desktop dashboards.

### Grid & Breakpoints
- **Desktop (1024px and above):** 12-column layout with 24px (`1.5rem`) gutters and 32px (`2rem`) outer margin. The primary navigation sits in a fixed vertical rail or collapsible sidebar (width: 260px expanded, 72px collapsed).
- **Tablet (768px – 1023px):** 8-column layout with 16px (`1rem`) gutters and 24px (`1.5rem`) margins. Attendance grids switch to horizontal swipe or stacked-cell cards.
- **Mobile (below 768px):** 4-column layout with 16px (`1rem`) gutters and 16px (`1rem`) outer margin. Single-column stacked cards for attendance check-ins.

### Spatial Rhythm
- Multiples of `4px` and `8px` govern internal component alignment.
- Forms, filters, and bulk action toolbars must utilize `space-md` gaps.
- Data tables preserve a strict `space-sm` top/bottom cell padding and `space-md` left/right padding to maintain high information density without visual crowding.

## Elevation & Depth

To avoid visual fatigue and maintain clarity during continuous administrative shifts, depth is established via **low-contrast outlines** paired with **micro-diffused ambient shadows**.

### Elevation Scale
- **Flat (Level 0):** Used for base surfaces (`#F8FAFC`), nested table containers, and disabled panels. Defined with `border: 1px solid #E2E8F0` and no shadow.
- **Raised / Card (Level 1):** Main data cards, attendance panels, and summary metric tiles. 
  - Style: `background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.05);`
- **Floating / Dropdown (Level 2):** Action menus, datepickers, filter dropdowns, and batch action popovers.
  - Style: `background: #FFFFFF; border: 1px solid #CBD5E1; box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05);`
- **Overlay / Modal (Level 3):** Verification dialogues, student photo inspection modals, manual attendance adjustment dialogs.
  - Style: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05); backdrop-filter: blur(4px);`

## Shapes

The design system adopts **Rounded (`roundedness: 2`)** geometry, balancing structural rigor with approachable ergonomics:
- **Base Components:** Standard buttons, text inputs, dropdown triggers, and card containers use `0.5rem` (8px) border radius.
- **Structural Groups:** Large dashboard summary cards and parent table wrappers use `1rem` (16px) border radius (`rounded-lg`).
- **Modal Dialogs:** Main overlay surfaces use `1rem` (16px) or `1.5rem` (24px) for prominent floating containers.
- **Badges & Chips:** Status chips utilize full pill-shaped radiuses (`9999px`) to create an immediate visual distinction from rectangular interactive inputs and rectangular data cells.

## Components

### Buttons
- **Primary:** Background `#14532D`, text `#FFFFFF`, border none. Hover state: `#166534`. Active state: `#0F3D21`. Disabled: `#E2E8F0` background with `#94A3B8` text.
- **Secondary / Outline:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`. Hover: `#F8FAFC` background with border `#CBD5E1`.
- **Tertiary / Ghost:** Background transparent, text `#14532D`. Hover: `#ECFDF5`.
- **Destructive:** Background `#EF4444`, text `#FFFFFF`. Hover: `#DC2626`.
- **Padding:** `0.5rem 1rem` (Medium), `0.375rem 0.75rem` (Small). Icons use a 1.5px or 2px outline stroke matching the label text size (16px or 20px icon box).

### Status Badges & Chips (PK-A to PK-F Mandate)
Every status badge must include both a semantic 16px outline stroke icon and localized text label. No badge may rely on color alone.
- **Hadir (Present):** 
  - Background `#ECFDF5`, text `#047857`, border `1px solid #A7F3D0`. Icon: Checkmark-circle outline (`CheckCircle`).
- **Terlambat (Late):** 
  - Background `#FFFBEB`, text `#B45309`, border `1px solid #FDE68A`. Icon: Clock outline (`Clock`).
- **Izin / Sakit / Dinas Luar:** 
  - Background `#EFF6FF`, text `#1D4ED8`, border `1px solid #BFDBFE`. Icon: Document or shield outline (`FileText` or `ShieldCheck`).
- **Alpa (Absent):** 
  - Background `#FEF2F2`, text `#B91C1C`, border `1px solid #FECACA`. Icon: X-circle or alert outline (`XCircle`).
- **Construction:** Height 24px, padding `2px 8px`, border radius `9999px`, gap `4px`, font `label-md`.

### Input Fields & Selects
- **Base State:** Background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`, placeholder `#94A3B8`. Radius: `0.5rem`.
- **Focus State:** Border `#059669`, ring outline `2px solid rgba(5, 150, 105, 0.2)`.
- **Error State:** Border `#EF4444`, ring outline `2px solid rgba(239, 68, 68, 0.2)`. Error text displayed underneath in `label-md` with an alert circle icon.
- **Leading/Trailing Icons:** Outline icons sized at 18px positioned `12px` from edges.

### Checkboxes & Radio Buttons
- **Checkbox:** 18x18px square with `4px` radius. Unchecked: `border: 1.5px solid #CBD5E1`. Checked: `background: #14532D; border-color: #14532D; icon: white checkmark`.
- **Radio Button:** 18x18px circle. Unchecked: `border: 1.5px solid #CBD5E1`. Checked: `border: 5px solid #14532D; background: #FFFFFF`.

### Cards & Data Panels
- **Structure:** `1px solid #E2E8F0` border, `1rem` radius, white background.
- **Header Section:** Separated by a bottom border `1px solid #F1F5F9`, internal padding `space-md` to `space-lg`.
- **KPI Summary Cards:** Contain an icon wrapper (`40x40px`, background `#ECFDF5`, icon `#14532D`), headline number in `headline-lg` tabular numerals, and category title in `label-md` `#475569`.

### Data Tables (Attendance Registry)
- **Header Row:** Background `#F8FAFC`, text `#475569`, font `label-md`, border-bottom `1px solid #E2E8F0`.
- **Body Rows:** Background `#FFFFFF`, alternating hover state `#F8FAFC`. Vertical padding `12px`, horizontal padding `16px`.
- **Cell Content:** Student identification with avatar and secondary sub-label ID; attendance status chip cleanly aligned in designated status column; inline quick-action dropdown button.