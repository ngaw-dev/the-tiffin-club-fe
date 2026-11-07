web application/stitch/projects/11693958260952717944/screens/bc8a1884418e49d4857b4f9b1e5b9d63
# One Dish — Design System & Guidelines (`design.md`)

An elevated culinary design language derived from **One Dish** ("No menu · No options · No negotiations"), restructured with **shadcn/ui** token architectures, component primitives, micro-interactions, and refined editorial typography.

---

## 1. Brand Philosophy & Identity

- **Concept**: Radical simplicity. One daily crafted dish in limited portions. Sold out means sold out.
- **Tone & Mood**: Editorial, confident, warm, artisanal yet surgically precise.
- **Design Metaphor**: A daily printed chalkboard menu meets modernist culinary magazine typography and tactile utilitarian components.

---

## 2. Color Palette & Semantic Tokens (shadcn/ui HSL/Hex Mapping)

Designed around a warm paper background (`cream`), high-contrast typographic dark tone (`ink`), an incandescent ember accent (`ember`), and supporting culinary tones.

### Base Colors & Tokens
| Token | Value | Description & Intent |
| :--- | :--- | :--- |
| `--background` | `#FAF6EF` (Warm Cream) | Main canvas, evoking artisanal raw parchment |
| `--foreground` | `#1E1B16` (Deep Ink) | Primary typographic layer with high readability |
| `--card` | `#FFFFFF` (Pure White) | Elevated container cards, structured order forms |
| `--card-foreground` | `#1E1B16` (Deep Ink) | Content text inside cards |
| `--popover` | `#FFFFFF` | Dropdowns, dialogs, floating tooltips |
| `--popover-foreground` | `#1E1B16` | Text within popovers |
| `--primary` | `#D9401F` (Ember Ochre) | Brand CTA, hero highlights, sold-out alerts |
| `--primary-foreground`| `#FFFFFF` (Crisp White) | Text over primary interactive elements |
| `--secondary` | `#F4EFE6` (Soft Stone Tint)| Subtle secondary action surfaces, counters |
| `--secondary-foreground`| `#1E1B16` | Text over secondary buttons/tags |
| `--muted` | `#F0EAE0` (Neutral Sand) | Dividers, disabled state backgrounds |
| `--muted-foreground` | `#6F675C` (Smoked Stone) | Metadata, subheaders, counters, captions |
| `--accent` | `#E8A13A` (Saffron Harvest) | Portion counters, step indicators, accents |
| `--accent-foreground` | `#1E1B16` | Text over saffron accent containers |
| `--destructive` | `#B91C1C` | Critical cancellation or error states |
| `--border` | `rgba(30, 27, 22, 0.10)` | Crisp 1px structural outlines |
| `--input` | `rgba(30, 27, 22, 0.15)` | Form input borders |
| `--ring` | `#D9401F` | Accessible keyboard focus outline ring (offset 2px) |

---

## 3. Typography & Hierarchy

Combining **Fraunces** (optical serif, warm editorial character with soft italics) and **Inter** (precision sans-serif for functional UI & forms).

### Typefaces
- **Display Serif**: `Fraunces, serif` (`font-display`) — Headline weights 500, 600, 700 with optical sizing `opsz: 9..144`.
- **UI / Body Sans**: `Inter, sans-serif` (`font-sans`) — Weights 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold).
- **Tabular Figures**: `font-variant-numeric: tabular-nums` for timers, prices (`$14.00`), and daily counter stamps (`No. 042`).

### Typographic Scale
| Level | Font & Weight | Size / Line-height | Tracking / Case | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Eyebrow / Kicker** | Inter 600 | `0.75rem` (12px) / 1rem | `+0.25em` UPPERCASE | Badges, category stamp, daily date |
| **Hero Title (H1)** | Fraunces 600 | `4rem` (64px) / 1.05 | `-0.03em` Normal | "The menu is *already decided.*" |
| **Section Title (H2)**| Fraunces 600 | `2.25rem` (36px) / 1.15| `-0.02em` Normal | "Today's dish", "Why one dish?" |
| **Component Title (H3)**| Fraunces 600 | `1.35rem` (22px) / 1.3 | `-0.01em` Normal | Dish names, feature headers, FAQs |
| **Lead / Subhead** | Inter 400 | `1.125rem` (18px) / 1.6 | Normal | Hero intros, dish tasting notes |
| **Body (Default)** | Inter 400 | `0.9375rem` (15px) / 1.6 | Normal | Narrative copy, FAQ responses |
| **Body Small / Meta**| Inter 500 | `0.8125rem` (13px) / 1.5 | Normal | Form labels, inventory tally |
| **Button / Action** | Inter 600 | `0.875rem` (14px) / 1 | `+0.01em` Normal | CTAs, submit triggers, interactive tabs |

---

## 4. Spacing, Elevation & Radii

Following shadcn's atomic geometry with cohesive softness matching the culinary brand:

### Radii Tokens
- `--radius-sm`: `6px` (`rounded-md`) — Form inputs, tags, micro-badges
- `--radius-md`: `12px` (`rounded-xl`) — Standard buttons, dropdowns, tooltips
- `--radius-lg`: `16px` (`rounded-2xl`) — Bento feature cards, FAQ accordions
- `--radius-xl`: `24px` (`rounded-3xl`) — Hero dish showcase card, CTA containers
- `--radius-full`: `9999px` (`rounded-full`) — Pill CTA buttons, quantity pills, avatars

### Shadows & Elevation
- **Card Subtle**: `0 1px 3px 0 rgba(30, 27, 22, 0.04), 0 1px 2px -1px rgba(30, 27, 22, 0.04)`
- **Elevation Medium (Soft)**: `0 8px 30px -4px rgba(30, 27, 22, 0.08)`
- **Elevation Floating**: `0 20px 40px -8px rgba(30, 27, 22, 0.14)`

---

## 5. shadcn/ui Component Specifications

### 5.1. Button Variants (`<Button />`)

#### Primary (Ember Glow)
- **Style**: Solid `#D9401F`, text `#FFFFFF`, font Inter 600, rounded-full.
- **Hover**: Background `#1E1B16`, smooth transition (`transition-all duration-200 ease-out`).
- **Active / Pressed**: Scale `0.98`, shadow inset.
- **Focus**: `ring-2 ring-primary ring-offset-2 ring-offset-background`.

#### Secondary / Dark (`variant="default"` in dark surface)
- **Style**: Background `#1E1B16`, text `#FAF6EF`, rounded-full.
- **Hover**: Background `#D9401F`, text `#FFFFFF`.

#### Outline (`variant="outline"`)
- **Style**: Border `1px solid rgba(30, 27, 22, 0.15)`, background transparent, text `#1E1B16`.
- **Hover**: Background `rgba(30, 27, 22, 0.05)`, border-color `#1E1B16`.

#### Sold Out / Disabled State
- **Style**: Background `rgba(30, 27, 22, 0.06)`, text `#6F675C`, cursor `not-allowed`, opacity `0.85`.
- **Copy**: *"Sold out — see you tomorrow at 9am"*

---

### 5.2. Form Inputs (`<Input />`, `<Label />`)

- **Container**: Minimal stacked layout with semantic `<Label />` in `font-semibold text-sm text-foreground`.
- **Field**: Height `48px`, padding `0 18px`, `border: 1px solid rgba(30, 27, 22, 0.18)`, background `#FFFFFF`, radius `rounded-xl` or `rounded-full`.
- **States**:
  - *Default*: Soft border, placeholder color `#6F675C/60`.
  - *Focus*: Border `#D9401F`, box-shadow `0 0 0 3px rgba(217, 64, 31, 0.12)`, outline none.
  - *Error*: Border `#B91C1C`, box-shadow `0 0 0 3px rgba(185, 28, 28, 0.12)`.

---

### 5.3. Badges & Indicators (`<Badge />`)

- **Status Active**: Dark `#1E1B16` fill, `#FAF6EF` text, tracking `0.1em`, uppercase 11px, `rounded-full px-3 py-1`.
  - *Text*: `AVAILABLE UNTIL SOLD OUT` or `PORTIONS: 37 / 60 LEFT`
- **Price Badge**: Background `rgba(217, 64, 31, 0.10)`, text `#D9401F`, Fraunces 600, `text-2xl px-5 py-2 rounded-full`.
- **Counter Badge**: Background `#E8A13A` with ink text, tabular numbers for daily serials (`No. 042`).

---

### 5.4. Card & Feature Showcase (`<Card />`)

- **Structure**:
  - `Card`: Background `#FFFFFF`, border `1px solid rgba(30, 27, 22, 0.06)`, shadow `shadow-soft`, radius `rounded-3xl` or `rounded-2xl`.
  - `CardHeader`: Generous padding `p-7` or `p-10`, flex layout with category tag and price display.
  - `CardContent`: Editorial description, ingredient spotlight, and real-time portion gauge.
  - `CardFooter`: Direct CTA with full-width primary button.
- **Interactions**: Subtle lift on hover (`transform: translateY(-2px)`, shadow transition).

---

### 5.5. Accordion (`<Accordion />` for FAQ)

- **Trigger**: Native `<details>` or Radix Accordion with `Fraunces 600` question header, chevron icon with `transition-transform duration-200 rotate-180`.
- **Content**: Clean sand-toned paragraph (`#6F675C`) with 16px top spacing and clear reading line-length.
- **Border**: Highlight border on expand (`open:border-primary/40`).

---

## 6. Iconography & Design Asset Guidelines

- **Style**: Minimalist mono-line or duotone vector icons with 1.75px stroke, rounded caps and joins (`stroke-linecap="round" stroke-linejoin="round"`).
- **Core Visual Assets**:
  - `Culinary Pot / Small Batch`: Precision line work illustrating single-pot cooking.
  - `Chalkboard / Daily Stamp`: Crisp geometric badge for edition numbering (`No. 042`).
  - `Decision Fatigue Glyph`: Clean crossed-out menu iconography representing radical choice reduction.
  - `Clock / Cutoff Countdown`: 4:00 PM ordering deadline indicator.

---

## 7. Responsive Behavior & Layout Grid

- **Max Container Width**: `max-w-5xl` (1024px) for content narrative, `max-w-xl` for focused transactional order form.
- **Padding Standards**: Mobile `px-5 py-12`, Tablet/Desktop `px-8 py-20`.
- **Mobile Adaptations**:
  - Hero converts to single-column centered block.
  - Dish showcase splits image on top (aspect `4/3`), order actions on bottom.
  - Nav collapses sticky actions into a prominent floating pill bar.
