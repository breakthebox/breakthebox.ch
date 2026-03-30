# Break the Box — Design System v2

## 1. Brand Identity

Break the Box ist eine Schweizer Beratungsboutique fuer IT-Strategie, digitale Transformation und Organisationsentwicklung. Die Marke verbindet **professionelle Serioesitaet** mit **kreativer Verspieltheit** — symbolisiert durch das Logo einer aufgebrochenen Box und handgezeichnete (sketchy) Illustrationen.

**Stichworte**: Premium-Consulting, Strategisch, Sketchy-Kreativ, Schweizer Qualitaet, Vertrauenswuerdig

**Markenversprechen**: "Because there's more..." — es gibt immer mehr zu entdecken, wenn man out-of-the-box denkt.

### Dual-Mode-Design

Die Marke unterstuetzt **zwei gleichwertige visuelle Modi**:

| Modus | Primaerer Einsatz | Hintergrund | Text |
|---|---|---|---|
| **Dark Mode** | CTA-Sektionen, Footer, Hero-Bereiche, App-Sidebar | `#0f1420` Slate-Dark | `#e8edf5` Hell |
| **Light Mode** | Content-Sektionen, Features, Pricing, Formulare | `#f0f4f8` Cool-Gray | `#1a2332` Dunkel |

Beide Modi koennen auf derselben Seite koexistieren (z.B. essentials.breakthebox.ch: Light-Content mit Dark-CTA und Dark-Footer).

---

## 2. Farbpalette

### Primaerfarben

| Token | Name | Hex | RGB | Verwendung |
|---|---|---|---|---|
| `--btb-steel` | BTB Steel | `#527a98` | `82, 122, 152` | Primaer-Akzent, CTA-Buttons, Links, Login, Nummernkreise |
| `--btb-steel-light` | Steel Light | `#6a94b2` | `106, 148, 178` | Hover-States, sekundaere Links |
| `--btb-steel-subtle` | Steel Subtle | `rgba(82, 122, 152, 0.2)` | — | Hintergrund-Akzent, Icon-Badges |
| `--btb-steel-hover` | Steel Hover | `#628ea8` | `98, 142, 168` | Button-Hover, Focus-Ring |
| `--btb-copper` | BTB Copper | `#c4856a` | `196, 133, 106` | Sekundaer-Akzent: AI-Aktionen, Empfohlen-Badge, Feature-Highlights |
| `--btb-copper-light` | Copper Light | `#d4a08a` | `212, 160, 138` | Hover auf Copper-Elementen |
| `--btb-copper-subtle` | Copper Subtle | `rgba(196, 133, 106, 0.15)` | — | Hintergrund-Akzent fuer AI-Features |

### Dark Mode — Neutraltoene

| Token | Name | Hex | Verwendung |
|---|---|---|---|
| `--bg-page-dark` | Page Background | `#0f1420` | Seitenhintergrund dunkel |
| `--bg-surface-dark` | Surface | `rgba(255, 255, 255, 0.04)` | Karten, Feature-Boxes |
| `--bg-surface-hover-dark` | Surface Hover | `rgba(255, 255, 255, 0.06)` | Karten bei Hover |
| `--bg-elevated-dark` | Elevated | `#0f1729` | Footer, Navbar, erhoehte Flaechen |
| `--bg-card-dark` | Card | `rgba(255, 255, 255, 0.04)` | Feature-Cards auf Dark |
| `--bg-overlay-dark` | Overlay | `rgba(15, 23, 41, 0.92)` | Mobile-Nav-Overlay |
| `--border-dark` | Border | `rgba(255, 255, 255, 0.08)` | Card-Borders, Trennlinien |
| `--border-dark-subtle` | Border Subtle | `rgba(255, 255, 255, 0.06)` | Feinere Trennlinien |
| `--text-primary-dark` | Text Primary | `#e8edf5` | Haupttext auf Dark |
| `--text-secondary-dark` | Text Secondary | `#94a3b8` | Nav-Links, Beschreibungen |
| `--text-muted-dark` | Text Muted | `#64748b` | Tertiaertext, Footer-Links |
| `--text-heading-dark` | Heading | `#ffffff` | Headings, CTAs auf Dark |

### Light Mode — Neutraltoene

| Token | Name | Hex | Verwendung |
|---|---|---|---|
| `--bg-page-light` | Page Background | `#f0f4f8` | Seitenhintergrund hell |
| `--bg-surface-light` | Surface | `#ffffff` | Karten, Feature-Cards |
| `--bg-section-light` | Section Alt | `#f8fafb` | Alternierende Sektionen |
| `--bg-elevated-light` | Elevated | `#edf1f5` | Benefit-Bereich, Hintergruende |
| `--border-light` | Border | `#e2e8f0` | Card-Borders (1.5px solid) |
| `--border-light-subtle` | Border Subtle | `rgba(0, 0, 0, 0.06)` | Navbar-Border, feine Trennlinien |
| `--text-primary-light` | Text Primary | `#1a2332` | Haupttext, Headings hell |
| `--text-secondary-light` | Text Secondary | `#64748b` | Nav-Links, Beschreibungen |
| `--text-muted-light` | Text Muted | `#94a3b8` | Platzhalter, dezente Labels |
| `--text-heading-light` | Heading | `#1a2332` | Headings auf Light |

### Navbar (Light Mode — Glassmorphism)

```css
.navbar-light {
  background: rgba(248, 250, 251, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
```

### Feature-Icon-Farben (Category Colors)

| Token | Name | Background | Icon-Farbe | Verwendung |
|---|---|---|---|---|
| `--cat-blue` | Blue | `rgba(82, 122, 152, 0.2)` | `#527a98` | Dashboard, Analyse, Standard |
| `--cat-copper` | Copper | `rgba(196, 133, 106, 0.15)` | `#c4856a` | AI-Features, KI-gesteuert |
| `--cat-violet` | Violet | `rgba(139, 92, 246, 0.15)` | `#a78bfa` | Reports, Dokumente, Gruppen |
| `--cat-amber` | Amber | `rgba(245, 158, 11, 0.15)` | `#fbbf24` | Beteiligung, Workshops |
| `--cat-emerald` | Emerald | `rgba(16, 185, 129, 0.15)` | `#34d399` | Review, Abschluss, Erfolg |
| `--cat-rose` | Rose | `rgba(244, 63, 94, 0.15)` | `#fb7185` | Tracking, Sicherheit |

### Semantische Farben

| Token | Name | Hex | Verwendung |
|---|---|---|---|
| `--color-success` | Success | `#34d399` | Erfolg, abgeschlossen, Checkmarks |
| `--color-warning` | Warning | `#fbbf24` | Warnung, Review erforderlich |
| `--color-error` | Error | `#fb7185` | Fehler, kritisch, Loeschen |
| `--color-info` | Info | `#527a98` | Info-Meldungen (= Steel) |
| `--color-ai` | AI Accent | `#c4856a` | KI-Features, Empfehlungen (= Copper) |

### CSS Custom Properties

```css
:root {
  /* ─── Brand ─── */
  --btb-steel: #527a98;
  --btb-steel-light: #6a94b2;
  --btb-steel-subtle: rgba(82, 122, 152, 0.2);
  --btb-steel-hover: #628ea8;
  --btb-copper: #c4856a;
  --btb-copper-light: #d4a08a;
  --btb-copper-subtle: rgba(196, 133, 106, 0.15);

  /* ─── Dark Mode Surfaces ─── */
  --bg-page-dark: #0f1420;
  --bg-surface-dark: rgba(255, 255, 255, 0.04);
  --bg-surface-hover-dark: rgba(255, 255, 255, 0.06);
  --bg-elevated-dark: #0f1729;
  --bg-card-dark: rgba(255, 255, 255, 0.04);
  --bg-overlay-dark: rgba(15, 23, 41, 0.92);
  --border-dark: rgba(255, 255, 255, 0.08);
  --border-dark-subtle: rgba(255, 255, 255, 0.06);

  /* ─── Dark Mode Text ─── */
  --text-primary-dark: #e8edf5;
  --text-secondary-dark: #94a3b8;
  --text-muted-dark: #64748b;
  --text-heading-dark: #ffffff;

  /* ─── Light Mode Surfaces ─── */
  --bg-page-light: #f0f4f8;
  --bg-surface-light: #ffffff;
  --bg-section-light: #f8fafb;
  --bg-elevated-light: #edf1f5;
  --border-light: #e2e8f0;
  --border-light-subtle: rgba(0, 0, 0, 0.06);

  /* ─── Light Mode Text ─── */
  --text-primary-light: #1a2332;
  --text-secondary-light: #64748b;
  --text-muted-light: #94a3b8;
  --text-heading-light: #1a2332;

  /* ─── Category Colors ─── */
  --cat-blue: rgba(82, 122, 152, 0.2);
  --cat-copper: rgba(196, 133, 106, 0.15);
  --cat-violet: rgba(139, 92, 246, 0.15);
  --cat-amber: rgba(245, 158, 11, 0.15);
  --cat-emerald: rgba(16, 185, 129, 0.15);
  --cat-rose: rgba(244, 63, 94, 0.15);

  /* ─── Semantic ─── */
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-error: #fb7185;
  --color-info: #527a98;
  --color-ai: #c4856a;

  /* ─── Shadows (Dark) ─── */
  --shadow-card-dark: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-card-hover-dark: 0 4px 16px rgba(0, 0, 0, 0.4);

  /* ─── Shadows (Light) ─── */
  --shadow-card-light: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-card-hover-light: 0 4px 16px rgba(0, 0, 0, 0.08);

  /* ─── Shared ─── */
  --shadow-dropdown: 0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-modal: 0 16px 48px rgba(0, 0, 0, 0.2);

  /* ─── Border Radius ─── */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-card: 16px;
  --radius-card-lg: 20px;
  --radius-button: 12px;
  --radius-pill: 9999px;
  --radius-icon-badge: 14px;
  --radius-circle: 50%;

  /* ─── Spacing ─── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* ─── Transitions ─── */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;

  /* ─── Z-Index ─── */
  --z-dropdown: 100;
  --z-sidebar: 200;
  --z-sticky: 400;
  --z-overlay: 500;
  --z-modal: 1000;
  --z-toast: 2000;
}
```

---

## 3. Typografie

### Schriftarten

| Font | Verwendung | Google Fonts |
|---|---|---|
| **Plus Jakarta Sans** | Primaer: Alle UI-Texte, Headings, Body | `Plus+Jakarta+Sans:wght@400;500;600;700;800` |
| **JetBrains Mono** | IDs, Codes, technische Werte, Preise | `JetBrains+Mono:wght@400;500` |

### Typografie-Skala

| Element | Groesse | Gewicht | Letter-Spacing | Kontext |
|---|---|---|---|---|
| Hero H1 | `3.5rem` (56px) | 800 | `-0.03em` | Hauptueberschrift |
| Section H2 | `2.5rem` (40px) | 800 | `-0.02em` | Sektions-Titel |
| Card H3 | `1.125rem` (18px) | 700 | `-0.01em` | Card-Ueberschriften |
| Subheading H4 | `1rem` (16px) | 700 | `0` | Unter-Ueberschriften |
| Body | `0.95rem` (15px) | 400 | `0` | Fliesstext |
| Small/Label | `0.82rem` (13px) | 600 | `0` | Labels, Tags |
| Caption | `0.75rem` (12px) | 700 | `0.12em` | Uppercase-Kategorien |
| Mono | `0.82rem` | 500 | `0` | Code, Preise |

### Signature: Italic Highlight

Das Break-the-Box-Markenzeichen in Headings: Ein einzelnes Wort wird **kursiv** gesetzt mit einer farbigen Unterstreichung.

```css
.highlight {
  font-style: italic;
  text-decoration: underline;
  text-decoration-color: var(--btb-steel);
  text-decoration-thickness: 3px;
  text-underline-offset: 4px;
}
.highlight--copper {
  text-decoration-color: var(--btb-copper);
}
```

**Beispiel**: "Ihre *Strategie*. Unsere Plattform." — "Strategie" ist italic mit Steel-Unterstreichung.

---

## 4. Nummernkreise (Brand-Signature)

Das **Markenzeichen** von Break the Box: Nummerierte Kreise als Prozess-Schrittanzeiger. Verwendet fuer Ablaeufe, Anleitungen, Feature-Listen und ueberall wo eine numerische Reihenfolge kommuniziert wird.

### Aufbau

```
  [Sketchy Icon]      ← Optionale Illustration darueber (Line-Art in grauem Kreis)
       |
   ╭───────╮
   │   1   │          ← Gefuellter Steel-Kreis mit weisser Nummer
   ╰───────╯
  Step-Label           ← Fetter Titel darunter
  Beschreibung         ← Optionaler Erklaertext
```

### CSS

```css
.step-number {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-circle); /* 50% */
  background: var(--btb-steel);
  color: #ffffff;
  font-size: 1.1rem; /* 17.6px */
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

### Varianten

| Variante | Groesse | Verwendung |
|---|---|---|
| **Standard** | `44px` | Prozess-Steps, "So funktioniert es" |
| **Compact** | `32px` | Inline-Listen, Feature-Erklaerungen |
| **Large** | `56px` | Hero-Bereiche, grosse Prozess-Darstellungen |

```css
.step-number--compact {
  width: 32px;
  height: 32px;
  font-size: 0.88rem;
  font-weight: 700;
}
.step-number--large {
  width: 56px;
  height: 56px;
  font-size: 1.4rem;
}
```

### Prozess-Step-Layout (horizontal)

```css
.process-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--space-xl);
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 240px;
  gap: var(--space-md);
}

/* Optional: Sketchy Icon ueber dem Nummernkreis */
.process-step-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-circle);
  background: var(--bg-elevated-light); /* #edf1f5 */
  border: 2px solid var(--border-light); /* #e2e8f0 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Verbindungspfeil zwischen Steps */
.process-step-arrow {
  color: var(--text-muted-light);
  font-size: 1.2rem;
  align-self: center;
  margin-top: 40px; /* Auf Hoehe der Icons */
}
```

### Nummernkreis in Listen (vertikal)

```css
.numbered-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.numbered-list-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.numbered-list-item .step-number {
  margin-top: 2px; /* Alignment mit Textzeile */
}
```

### HTML-Beispiel

```html
<!-- Horizontaler Prozess -->
<div class="process-steps">
  <div class="process-step">
    <div class="process-step-icon">📧</div>
    <div class="step-number">1</div>
    <h3>Einladung erhalten</h3>
    <p>Ihr Berater richtet Ihr Projekt ein und laedt Sie zur Plattform ein.</p>
  </div>
  <span class="process-step-arrow">→</span>
  <div class="process-step">
    <div class="process-step-icon">📄</div>
    <div class="step-number">2</div>
    <h3>Kontext beisteuern</h3>
    <p>Beantworten Sie Fragen und teilen Sie Ihre strategische Ausgangslage.</p>
  </div>
  <!-- ... Steps 3, 4 -->
</div>

<!-- Vertikale Nummernliste -->
<div class="numbered-list">
  <div class="numbered-list-item">
    <div class="step-number step-number--compact">1</div>
    <div>
      <strong>Situationsanalyse</strong>
      <p>Bestandsaufnahme der aktuellen IT-Landschaft</p>
    </div>
  </div>
  <!-- ... weitere Items -->
</div>
```

---

## 5. Buttons

### Primary CTA

```css
/* Identisch auf Dark und Light */
.btn-primary {
  background: var(--btb-steel);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-button); /* 12px */
  padding: 14px 32px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-primary:hover {
  background: var(--btb-steel-light);
  transform: translateY(-1px);
}
```

### Secondary / Ghost CTA

```css
/* Dark Mode */
.btn-ghost-dark {
  background: transparent;
  color: var(--text-secondary-dark);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-button);
  padding: 14px 32px;
  font-weight: 600;
  font-size: 0.92rem;
}
.btn-ghost-dark:hover {
  border-color: var(--btb-steel);
  color: var(--text-heading-dark);
}

/* Light Mode */
.btn-ghost-light {
  background: transparent;
  color: var(--text-secondary-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-button);
  padding: 14px 32px;
  font-weight: 600;
  font-size: 0.92rem;
}
.btn-ghost-light:hover {
  border-color: var(--btb-steel);
  color: var(--text-primary-light);
}
```

### Login/Nav Button

```css
.btn-login {
  background: var(--btb-steel);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-sm); /* 8px */
  padding: 8px 20px;
  font-weight: 600;
  font-size: 0.88rem;
}
```

### Pill-Tags (Strategie-Typen)

```css
/* Dark Mode */
.tag-pill-dark {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-secondary-dark);
  font-size: 0.78rem;
  font-weight: 500;
}

/* Light Mode */
.tag-pill-light {
  border-color: var(--border-light);
  color: var(--text-secondary-light);
}
```

### EMPFOHLEN-Badge

```css
.badge-recommended {
  background: var(--btb-copper);
  color: #ffffff;
  padding: 5px 18px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

---

## 6. Cards

### Feature Card (Dark Mode)

```css
.feature-card-dark {
  background: var(--bg-surface-dark);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-card); /* 16px */
  padding: var(--space-xl);
  transition: all var(--transition-normal);
}
.feature-card-dark:hover {
  background: var(--bg-surface-hover-dark);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
```

### Feature Card (Light Mode)

```css
.feature-card-light {
  background: var(--bg-surface-light); /* #ffffff */
  border: 1.5px solid var(--border-light); /* #e2e8f0 */
  border-radius: var(--radius-card-lg); /* 20px */
  padding: var(--space-xl);
  transition: all var(--transition-normal);
}
.feature-card-light:hover {
  border-color: var(--btb-steel-subtle);
  box-shadow: var(--shadow-card-hover-light);
  transform: translateY(-2px);
}
```

### Pricing Card (Light Mode)

```css
.pricing-card {
  background: var(--bg-surface-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card-lg); /* 20px */
  padding: var(--space-2xl);
}
.pricing-card--featured {
  border: 2px solid var(--btb-copper);
  box-shadow: 0 8px 32px rgba(196, 133, 106, 0.12);
}
```

### Icon Badge (in Feature Cards)

```css
.icon-badge {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-icon-badge); /* 14px */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: var(--space-md);
}
.icon-badge--blue { background: var(--cat-blue); color: #527a98; }
.icon-badge--copper { background: var(--cat-copper); color: #c4856a; }
.icon-badge--violet { background: var(--cat-violet); color: #a78bfa; }
.icon-badge--amber { background: var(--cat-amber); color: #fbbf24; }
.icon-badge--emerald { background: var(--cat-emerald); color: #34d399; }
.icon-badge--rose { background: var(--cat-rose); color: #fb7185; }
```

---

## 7. Sektionen & Layout

### Dark Section

```css
.section-dark {
  background: var(--bg-page-dark);
  color: var(--text-primary-dark);
  padding: var(--space-4xl) var(--space-xl);
}
```

### Light Section

```css
.section-light {
  background: var(--bg-page-light); /* #f0f4f8 */
  color: var(--text-primary-light);
  padding: var(--space-4xl) var(--space-xl);
}
```

### Light Section (alternierend)

```css
.section-light-alt {
  background: var(--bg-section-light); /* #f8fafb */
}
```

### Section Divider (Wavy/Curved)

Weiche, geschwungene Uebergaenge zwischen Sektionen:

```html
<div class="section-divider">
  <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
    <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,60 L0,60 Z"
          fill="currentColor" opacity="0.3"/>
  </svg>
</div>
```

```css
/* Dark → Light Transition */
.section-divider--to-light {
  color: var(--bg-page-light);
  background: var(--bg-page-dark);
}
/* Light → Dark Transition */
.section-divider--to-dark {
  color: var(--bg-page-dark);
  background: var(--bg-page-light);
}
```

### Content Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}
.container--narrow {
  max-width: 800px;
}
```

---

## 8. Navigation

### Navbar (Light Mode — Standard)

```css
.navbar-light {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: var(--z-sticky);
  background: rgba(248, 250, 251, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light-subtle);
  padding: 0 var(--space-xl);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-link-light {
  color: var(--text-secondary-light);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
}
.nav-link-light:hover,
.nav-link-light.active {
  color: var(--text-primary-light);
}
```

### Navbar (Dark Mode)

```css
.navbar-dark {
  background: var(--bg-elevated-dark);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-dark-subtle);
}

.nav-link-dark {
  color: var(--text-secondary-dark);
}
.nav-link-dark:hover,
.nav-link-dark.active {
  color: var(--text-heading-dark);
}
```

### Language Switcher

```css
.lang-switch {
  display: flex;
  gap: 4px;
  font-size: 0.82rem;
}
/* Aktive Sprache fett, Rest gedaempft */
.lang-switch a { color: var(--text-muted-light); text-decoration: none; }
.lang-switch a.active { color: var(--text-primary-light); font-weight: 600; }
.lang-switch .separator { color: var(--text-muted-light); }
```

---

## 9. Sketchy Illustrationen

### Konzept

Die Break-the-Box-Marke verwendet **handgezeichnete Illustrationen** als visuelle Signatur:

- Schwarz-weiss oder monochrom mit leichtem Steel-Blue-Akzent
- Skizzenhafter Strichstil (wie Whiteboard-Zeichnungen)
- Zeigen Personen in Beratungssituationen (Whiteboard, Praesentationen, Workshops)
- Verwendet in Hero-Bereichen, Feature-Sektionen, Prozess-Steps und als dekorative Elemente

### Arten von Illustrationen

1. **Hero Illustration**: Szene mit Personen vor Whiteboards mit Flussdiagrammen
2. **Benefit Icons**: Einfache Line-Art-Icons (Tachometer, Balkendiagramm, Gehirn/AI, Wachstumskurve) in kreisfoermigen Containern
3. **Process Icons**: Briefumschlag, Dokument, Zahnrad/Diagramm, Checkliste — in runden Containern ueber den Nummernkreisen
4. **Decorative**: Gluehbirne, Stern, Sprechblase, Haken — leicht transparent als Hintergrund-Elemente (CTA-Sektion)

### Stilregeln

- **Strichstaerke**: 1.5–2px
- **Farbe**: `currentColor` (erbt von Container) oder `#527a98` fuer Akzente
- **Container**: Runder Kreis mit hellem Hintergrund (`var(--bg-elevated-light)`) und subtiler Border (`var(--border-light)`)
- **Keine Fuellfarben** in den Zeichnungen — nur Konturen und leichte Schattierungen

---

## 10. Footer

Der Footer ist **immer im Dark Mode**, auch auf Light-Mode-Seiten.

```css
.footer {
  background: var(--bg-elevated-dark); /* #0f1729 */
  color: rgba(255, 255, 255, 0.7);
  padding: var(--space-3xl) var(--space-xl) var(--space-xl);
}

.footer-brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-heading-dark);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.footer-heading {
  font-size: 0.82rem; /* 13px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: var(--space-md);
}

.footer-link {
  color: #ffffff;
  font-size: 0.88rem;
  text-decoration: none;
}
.footer-link:hover { color: var(--btb-steel-light); }

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
}

.swiss-badge {
  display: flex;
  align-items: center;
  gap: 6px;
}
.swiss-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}
```

---

## 11. CTA-Sektion

Die CTA-Sektion ist **immer im Dark Mode** mit dem dunklen Hintergrund und dekorativen Sketchy-Elementen.

```css
.cta-section {
  background: var(--bg-elevated-dark);
  color: var(--text-heading-dark);
  padding: var(--space-4xl) var(--space-xl);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section .btn-primary {
  padding: 16px 40px;
  border-radius: 14px;
  font-size: 1rem;
}

/* Dekorative Elemente (Sketchy Icons halbtransparent) */
.cta-decorative {
  position: absolute;
  opacity: 0.08;
  color: var(--text-heading-dark);
}
```

---

## 12. Signature Patterns (Zusammenfassung)

| Pattern | Beschreibung |
|---|---|
| **Dual-Mode** | Light + Dark koexistieren auf derselben Seite |
| **Steel Accent** | `#527a98` als primaere Akzentfarbe fuer alle Aktionen |
| **Copper Highlights** | `#c4856a` fuer AI/KI-Features und Empfohlen-Badge |
| **Nummernkreise** | Steel-gefuellte Kreise (44px) mit weisser Nummer — Markenzeichen |
| **Italic Underline** | Keyword in Headings: kursiv + farbige Unterstreichung |
| **Sketchy Icons** | Handgezeichnete Line-Art-Illustrationen in runden Containern |
| **Glass Cards** | Dark: Semi-transparente Karten (rgba white 0.04); Light: Weisse Karten mit Border |
| **Glassmorphism Navbar** | Light: `rgba(248,250,251,0.92)` + backdrop-blur |
| **Wavy Dividers** | Geschwungene SVG-Trennlinien zwischen Sektionen |
| **Category Badges** | Farbige halbtransparente Icon-Badges (6 Farben) |
| **Pill Tags** | Runde Tags mit Border fuer Strategie-Typen |
| **Always-Dark Footer** | Footer und CTA-Sektion sind immer im Dark Mode |
| **Swiss Quality** | "Made in Switzerland" im Footer mit rotem Punkt |
| **Language Switcher** | DE \| EN \| FR im Navbar |

---

## 13. Responsive Breakpoints

```css
@media (min-width: 640px)  { /* sm: Tablets */ }
@media (min-width: 768px)  { /* md: Tablets landscape */ }
@media (min-width: 1024px) { /* lg: Desktop */ }
@media (min-width: 1280px) { /* xl: Wide Desktop */ }
```

### Mobile Anpassungen

- Navbar wird zu Burger-Menu mit Overlay
- Feature-Grid: 1 Spalte statt 3
- Pricing-Cards: Vertikal gestapelt
- Process-Steps: Vertikal gestapelt statt horizontal
- Hero: Text zentriert, Illustration darunter
- Nummernkreise: Vertikale Anordnung mit Linie statt Pfeilen
- Padding reduziert auf `--space-lg`

---

## 14. Do's und Don'ts

### Do's
- Steel (`#527a98`) fuer primaere Aktionen und Nummernkreise
- Copper (`#c4856a`) fuer AI-bezogene Features und Empfehlungen
- Beide Modi (Light + Dark) auf derselben Seite nutzen wo sinnvoll
- Sketchy Illustrationen fuer Personality
- Nummernkreise fuer alle nummerierten Prozesse/Listen
- Pill-Tags fuer Kategorisierungen
- Italic-Highlight fuer Keyword in Headings
- "Made in Switzerland" im Footer
- Footer und CTA immer im Dark Mode

### Don'ts
- Keine grellen Farben (insbesondere kein Teal/Cyan)
- Keine harten Kanten (immer border-radius >= 8px)
- Keine reinen schwarzen (#000) Hintergruende — immer Slate-Blue
- Auf Dark: Keine Schatten auf Karten — stattdessen Borders
- Auf Light: Keine schweren Schatten — subtil halten
- Nicht mehr als 2 Akzentfarben pro Sektion
- Keine Stock Photos — nur Sketchy-Illustrationen oder UI-Mockups
- Niemals einfache Bullet Points wo Nummernkreise passen wuerden
