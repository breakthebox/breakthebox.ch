# Break the Box — Design Style Guide & Visual Identity

**Version:** 3.0 · April 2026
**Marke:** Break the Box GmbH · Brigitte Hulliger
**Zweck:** Grundlage für alle visuellen Auftritte — Webseite, Präsentationen, Social Media, Drucksachen
**Quelle der Wahrheit:** `src/app.css` (Design-Tokens) + `src/routes/(public)/+page.svelte` (Page-Patterns)
**Visuelle Referenz:** [`breakthebox-design-system-v3.html`](./breakthebox-design-system-v3.html)

---

## 1. Markenkern

### Positionierung
IT-Beratung, Strategieentwicklung und Governance für Schweizer KMU — mit echtem Technologieverständnis und dem Mut, selbst zu bauen.

### Markenpersönlichkeit
| Eigenschaft | Ausprägung |
|---|---|
| Kompetent | Fundiert, nicht akademisch. EMBA, CAS VR, drei VR-Mandate — aber immer praxisnah. |
| Hands-on | Nicht nur beraten, sondern bauen. Eigene KI-Plattformen, AI-Agent-Ökosystem. |
| Visuell | Komplexität greifbar machen. Sketch-Stil als Markenzeichen. |
| Neugierig | "Because there's more…" — immer weiterlernen, weiterentwickeln. |
| Nahbar | Du-Form, direkt, keine Berater-Arroganz. Aber mit Gravitas. |

### Claim
**Because there's more …**

---

## 2. Farbpalette — Signal (Steel + Teal)

Die Palette heisst **Signal** und ersetzt die frühere Gold/Cream-Richtung. Steel bleibt die Leitfarbe, Teal (statt Gold) ist die neue Akzent-/Signal-Farbe — ruhiger, tech-näher und besser für Dual-Mode geeignet. Alle Tokens leben in `src/app.css`.

### Brand-Farben

| Rolle | Token | Hex | Verwendung |
|---|---|---|---|
| **Primary** | `--btb-steel` | **#527A98** | Buttons, Navigation, Nummernkreise, Primär-Headlines, Keyword-Underlines in hellen Sektionen. |
| Primary Light | `--btb-steel-light` | #6A94B2 | Hover, sekundäre Links. |
| Primary Hover | `--btb-steel-hover` | #628EA8 | Button-Hover. |
| Primary Subtle | `--btb-steel-subtle` | rgba(82,122,152,.15) | Flächige Hintergrundakzente, Tag-Backgrounds. |
| **Accent** | `--btb-teal` | **#2B8A78** | Sketch-Labels, Keyword-Underlines in dunklen Sektionen, Badges, CTAs auf Dark-BG. |
| Accent Light | `--btb-teal-light` | #DBF0EB | Tag-Hintergründe, Hover-States. |
| Accent Dark | `--btb-teal-dark` | #1A6557 | Text auf Teal-Light. |
| Accent Subtle | `--btb-teal-subtle` | rgba(43,138,120,.12) | Kategorie-Hintergründe. |

### Flächen — Light Mode

| Rolle | Token | Hex |
|---|---|---|
| Seite | `--bg-page` | #F5F5F2 |
| Karte / Surface | `--bg-surface` | #FFFFFF |
| Alternative Sektion | `--bg-section-alt` | #F0F1EE |
| Elevated (Icon-Container) | `--bg-elevated` | #EAEAE5 |
| Border | `--border` | #DDDDD8 |
| Border Subtle | `--border-subtle` | rgba(0,0,0,.06) |

### Flächen — Dark Mode (CTA, Footer, Feature-Sektionen)

| Rolle | Token | Hex |
|---|---|---|
| Seite | `--bg-page-dark` | #0F1420 |
| Elevated | `--bg-elevated-dark` | #0F1729 |
| Surface (glassig) | `--bg-surface-dark` | rgba(255,255,255,.04) |
| Border | `--border-dark` | rgba(255,255,255,.08) |
| Navy (Metriken, Kontakt) | `--navy` | #1B344D |

### Text

| Rolle | Token (Light / Dark) | Hex |
|---|---|---|
| Primär | `--text-primary` / `--text-primary-dark` | #262626 / #E8EDF5 |
| Sekundär | `--text-secondary` / `--text-secondary-dark` | #64748B / #94A3B8 |
| Muted | `--text-muted` / `--text-muted-dark` | #94A3B8 / #64748B |
| Heading | `--text-heading` / `--text-heading-dark` | #1A2332 / #FFFFFF |

### Semantische Farben

| Rolle | Token | Hex |
|---|---|---|
| Erfolg | `--color-success` | #34D399 |
| Warnung | `--color-warning` | #FBBF24 |
| Fehler | `--color-error` | #FB7185 |
| Info | `--color-info` | #527A98 |

### Kategorie-Farben (optional, für Diagramme/Tags)
`--cat-steel`, `--cat-teal`, `--cat-violet` (#8B5CF6), `--cat-amber` (#F59E0B), `--cat-emerald` (#10B981), `--cat-rose` (#F43F5E) — jeweils mit .12–.15 Alpha. Nur wenn wirklich mehrere Kategorien unterschieden werden müssen.

### Farbregeln
- **Steel ist die Leitfarbe** — dominiert in jeder Ansicht Buttons, Nummernkreise, Underlines auf Light-BG.
- **Teal ist die Signatur-Akzentfarbe** — Sketch-Labels, Underlines auf Dark-BG, Badges, CTAs in Navy-Sektionen. Sparsam einsetzen (≤15–20 % Flächenanteil).
- **Kein Gold, kein Cream mehr.** Frühere Gold-Ramps (#E8AF30 etc.) sind entfernt.
- **Navy `#1B344D`** ist für Metriken-Leiste und Kontakt-Sektion reserviert.
- **Dual Mode:** Helle Sektionen nutzen `--bg-page`, dunkle nutzen `--bg-page-dark` oder `--navy`. Section-Abfolge auf der Landingpage wechselt bewusst (hell → dunkel → hell → dunkel).
- **Keine hardcodierten Farben in Komponenten** — immer Tokens via `var(--btb-steel)` oder Tailwind-Arbitrary-Values `bg-[var(--btb-steel)]`.

---

## 3. Typografie

### Primäre Schriftarten

| Rolle | Font | Token | Gewichte | Verwendung |
|---|---|---|---|---|
| **UI / Body / Headlines** | **Plus Jakarta Sans** | `--ff-ui` | 300, 400, 500, 600, 700, 800 | Alles ausser Handschrift und Code. Ersetzt Outfit. |
| **Sketch / Handschrift** | **Shadows Into Light** | `--ff-sketch` | 400 (nur dieser Schnitt) | Sketch-Labels, Notizen, Claim. Ersetzt Caveat. |
| **Code / Daten** | **JetBrains Mono** | `--ff-mono` | 400, 500 | Code-Snippets, monospaced Zahlen. |

### Schrifthierarchie

| Element | Font | Grösse | Gewicht | Farbe |
|---|---|---|---|---|
| Hero Title (H1) | Plus Jakarta Sans | `clamp(2.4rem, 5vw, 3.4rem)` | 800 | `--text-heading` / Steel |
| Section Title (H2) | Plus Jakarta Sans | `clamp(1.6rem, 3vw, 2.2rem)` | 800 | `--text-heading` |
| Card Title (H3) | Plus Jakarta Sans | 1.2–1.4rem | 700 | `--text-heading` |
| Sketch-Label | Shadows Into Light | 1.3–1.4rem | 400 | `--btb-teal` |
| Sketch-Notiz / Claim | Shadows Into Light | 1.0–1.6rem | 400 | `--btb-teal` / `--btb-teal-dark` |
| Body | Plus Jakarta Sans | 1rem–1.05rem | 400–500 | `--text-primary` |
| Small / Tag | Plus Jakarta Sans | 0.78–0.88rem | 500–700 | `--text-secondary` / `--btb-steel` |
| Metadata / Uppercase-Label | Plus Jakarta Sans | 0.72–0.78rem | 600–700 + `letter-spacing: 0.1em; text-transform: uppercase` | `--text-muted` oder `--btb-teal` |

### Signature-Pattern: Keyword Underlines

Das definierende Typo-Pattern der Marke: ein oder zwei Keywords pro Headline werden durch einen farbigen Unterstrich betont, oft zusätzlich kursiv.

```html
<h1>Deine <em class="underline-steel">Strategie</em>.</h1>
```

```css
em {
  font-style: italic;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 4px;
  text-decoration-color: var(--btb-steel); /* Light-BG */
  /* Dark-BG → var(--btb-teal) */
}
```

- **Light-Sektion** → Unterstrich in Steel.
- **Dark-Sektion** → Unterstrich in Teal.
- Maximal **ein** unterstrichenes Keyword pro Headline. Niemals ganze Sätze unterstreichen.

### Typografie-Regeln
- **Shadows Into Light nur für handschriftliche Elemente** — Labels, Notizen, Claim. Niemals für Buttons, Navigation, Fliesstext oder mehr als ~6 Wörter am Stück.
- **Plus Jakarta Sans als Arbeitstier** — 400 für Body, 500 für UI, 600 für Betonung, 700 für Card-Titel, 800 für Headlines.
- **Zeilenhöhe:** Body 1.6, Headlines 1.1, Sketch 1.4.
- **Letter-Spacing:** Headlines `-0.02em` bis `-0.03em` (enger), Uppercase-Labels `0.1em` (weiter).
- **Schweizer Rechtschreibung:** ss statt ß, Umlaute ä/ö/ü immer als Unicode (nie ae/oe/ue).

---

## 4. Sketch-Stil — Das Markenzeichen

### Prinzip
Der Sketch-Stil ist kein dekoratives Element — er transportiert Brigittes Arbeitsweise: visuell denken, Komplexität greifbar machen, mit Stift und Papier starten. Er unterscheidet Break the Box von jeder generischen Beratungswebseite.

### Elemente des Sketch-Stils

| Element | Beschreibung | Einsatz |
|---|---|---|
| **Sketch-Labels** | Handschrift-Text in Shadows Into Light, Teal-Farbe, oft eingeleitet mit „→" | Section-Labels, Zwischen-Überschriften, persönliche Kommentare |
| **Wellenlinien-Divider** | SVG-Pfade als weiche Übergänge zwischen hellen und dunklen Sektionen; Reverse-Variante für Dark → Light | Zwischen allen Hauptsektionen der Landingpage |
| **Nummernkreise** | Kreisförmige Steel-Badges mit Ziffer (1–4), flankieren Section-Titel der vier Pillars | Pillar-Karten, Schritt-Listen |
| **Wolken-Illustrationen** | `hero_clouds.svg` als Signatur-Illustration im Hero | Hero-Hintergrund, animiert |
| **Whiteboard-Prozesse** | `Frame.svg` (Prozessfluss auf Whiteboard) | Methodik-Erklärungen, Über-mich |
| **Flippable Pillar-Cards** | 3D-Flip beim Hover/Tap — Vorderseite zeigt Bild + Titel + Tags, Rückseite zeigt Beispiele | Pillars-Sektion |

### Sketch-Regeln
- **Sketch-Elemente ergänzen, ersetzen nicht** — der Hauptinhalt bleibt klar und professionell.
- **Maximal 2–3 Sketch-Elemente pro Viewport** — nicht überladen.
- **Sketch-Farben:** Shadows-Into-Light-Labels in `--btb-teal` (Light-BG) oder `--btb-teal-light` (Dark-BG). Nummernkreise in `--btb-steel`.
- **Keine Rotation mehr.** Frühere Regel „Sketch-Notizen ±5° gedreht" ist entfernt — der aktuelle Look ist gerade und ruhig, die Handschrift allein trägt den Charakter.

---

## 5. Logo

### Bestehendes Logo
Das Logo zeigt einen **aufgebrochenen Würfel** (3D-Box mit Bruchlinien) neben dem Schriftzug "BREAK THE BOX GMBH". Der Würfel symbolisiert das Aufbrechen von Denkmustern und konventionellen Ansätzen.

### Logo-Varianten (zu erstellen)

| Variante | Beschreibung | Einsatz |
|---|---|---|
| **Full Logo** | Würfel + Schriftzug | Webseite Header, Briefpapier, Präsentationen |
| **Icon Only** | Nur der Würfel | Favicon, Social-Media-Profilbild, App-Icon |
| **Horizontal** | Würfel links + Schriftzug rechts (wie heute) | Header, E-Mail-Signatur |
| **Stacked** | Würfel oben + Schriftzug darunter | Quadratische Formate, Visitenkarten |
| **Monochrom** | Einfarbig (Steel oder Weiss) | Auf dunklem Hintergrund, Prägung |

### Logo-Farben

| Kontext | Würfel | Schrift |
|---|---|---|
| Auf `--bg-page` (#F5F5F2) | #262626 | #262626 |
| Auf Navy / Dark | #E8EDF5 | #E8EDF5 |
| Akzentuiert | #527A98 (Steel) | #262626 |
| Inverse | #FFFFFF | #FFFFFF |

### Logo-Schutzzone
Mindestabstand = Höhe des Würfels zu allen Seiten. Kein Text, Bild oder andere Elemente innerhalb der Schutzzone.

---

## 6. Layout & Spacing

### Grid-System
- **Max-Width:** 1160–1180px (Content-Bereich).
- **Seitenränder:** 32px Desktop, 16–24px Mobile.
- **Haupt-Grids:** 2-spaltig für Pillars und About, 5-spaltig für Metriken (Desktop → 1-spaltig Mobile), Marquee für References.

### Spacing-Scale (aus `src/app.css`)

| Token | Wert |
|---|---|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |
| `--space-4xl` | 96px |

### Border-Radius (aus `src/app.css`)

| Token | Wert | Verwendung |
|---|---|---|
| `--radius-sm` | 8px | Kleine UI-Elemente, Input |
| `--radius-md` | 12px | Standard-Flächen |
| `--radius-button` | 10px | Buttons |
| `--radius-card` | 16px | Karten |
| `--radius-card-lg` | 20px | Grosse Feature-Karten |
| `--radius-pill` | 9999px | Pills, Tags, Nummernkreise |

### Shadows

| Token | Wert | Verwendung |
|---|---|---|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,.05)` | Karten im Ruhezustand |
| `--shadow-card-hover` | `0 4px 16px rgba(0,0,0,.07)` | Karten-Hover |

### Z-Index-Skala (aus `src/app.css` / CLAUDE.md)

`--z-dropdown: 100` → `--z-sidebar: 200` → `--z-sticky: 400` → `--z-overlay: 500` → `--z-modal: 1000` → `--z-toast: 2000`. Immer Tokens verwenden — nie hardcodierte Zahlen.

### Transitions
- `--t-fast: 150ms ease` — Hover, kleine State-Wechsel.
- `--t-normal: 250ms ease` — Karten-Flip, Fade-Übergänge.
- Reveal-Animationen: 700ms `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 7. Komponenten & Patterns

### Buttons

| Typ | Hintergrund | Text | Border | Einsatz |
|---|---|---|---|---|
| **Primary** | `--btb-steel` | #FFF | — | Haupt-CTA in Light-Sektionen: „Strategiegespräch vereinbaren". Hover → `--btb-steel-hover`. |
| **Primary Dark** | `--btb-teal` | #FFF | — | Haupt-CTA in Navy/Dark-Sektionen. |
| **Secondary** | transparent | `--text-primary` | 1.5px `--border` | Neben-CTA, „Mehr erfahren". |
| **Ghost** | transparent | `--btb-steel` | — | Inline-Links, Navigation. |

Alle Buttons: `border-radius: var(--radius-button)` (10px), Padding ~12px 24px, Font 500–600, Transition `--t-fast`.

### Karten
- Hintergrund: `--bg-surface` (Light) / `--bg-surface-dark` (Dark).
- Border: `1px solid var(--border)` / `var(--border-dark)`.
- Radius: `--radius-card` (16px), grosse Feature-Karten `--radius-card-lg` (20px).
- Shadow: `--shadow-card` ruhend, `--shadow-card-hover` bei Hover.
- Padding: 24–32px.

### Tags / Badges
- **Steel-Tag:** `background: var(--btb-steel-subtle); color: var(--btb-steel); border-radius: var(--radius-pill); padding: 4px 11px; font: 500 0.78rem/1 'Plus Jakarta Sans';`
- **Teal-Tag:** `background: var(--btb-teal-light); color: var(--btb-teal-dark);` — Rest analog.
- **Kategorie-Badge:** kleine Pill mit `--cat-*` Hintergrund, passendem Vollton als Text.

### Nummernkreise (Brand Signature)
- 48–64px Kreis in `--btb-steel`, weisse Ziffer, Font 700, flankiert den Section-Titel der vier Pillars.
- Variante auf Dark-BG: `--btb-teal` statt Steel.

### Sketch-Labels (als Komponente)
- Font: Shadows Into Light 400, 1.3–1.4rem.
- Farbe: `--btb-teal` (Light-BG) / `--btb-teal-light` (Dark-BG).
- Oft eingeleitet mit „→ " oder „← ".
- Keine Rotation (bewusste Änderung gegenüber früheren Versionen).

### Metriken-Leiste
- Hintergrund: `--navy` (#1B344D).
- Zahlen: Plus Jakarta Sans 800, `clamp(2rem, 4vw, 3rem)`, Weiss, mit Count-up-Animation bei Scroll.
- Labels: Plus Jakarta Sans 600, 0.78rem, `rgba(255,255,255,.6)`, Uppercase, Letter-Spacing 0.1em.

### Pillar-Flip-Cards
- 3D-CSS-Flip bei Hover (Desktop) / Tap (Mobile).
- Vorderseite: Bild oben (fixe Höhe Desktop, auto Mobile), Titel, Beschreibung, Tags.
- Rückseite: Steel-Hintergrund, Beispiele als Liste.
- Radius `--radius-card-lg`, Transition `transform 600ms`.

### Reveal-Animationen
- Scroll-getriggerte Einblendung via `.reveal` / `.reveal.is-visible`.
- Staggered Varianten mit `.reveal-stagger` + `--stagger` CSS-Variable (100ms pro Step).
- **PFLICHT:** `prefers-reduced-motion: reduce` respektieren — `src/app.css` deaktiviert dann alle Animationen und Reveals.

### Wavy Dividers
- SVG-Pfad zwischen Light- und Dark-Sektionen.
- Eigene `reverse`-Variante für Dark → Light Übergang.
- Immer in der Füllfarbe der nächsten Sektion.

### Vorhandene Svelte-Komponenten (`src/lib/components/`)
- **ImageUpload.svelte** — Datei-Upload mit Vorschau (Admin).
- **BlockEditor.svelte** — Blockbasierter Content-Editor (Admin).
- **BlockRenderer.svelte** — Rendert Content-Blöcke auf öffentlichen Seiten.
- **AiAssistPanel.svelte** — Panel für Claude-gestützte Inhalts-Generierung im Admin.

> Die Landingpage nutzt bewusst Inline-CSS-Klassen (`.pillar-flip`, `.section-light`, `.section-dark`, `.section-navy`) statt einer Component-Library — das hält den Code nah an `+page.svelte` und erlaubt schnelle Iteration.

---

## 8. Bildsprache

### Fotografie
- **Brigitte selbst**: Professionell, aber nahbar. Nicht im Studio-Porträt-Stil, eher in Aktion (Whiteboard, Workshop, Gespräch)
- **Kein Stock**: Keine generischen Business-Fotos
- **Warm**: Passt zur Cream-Hintergrundwelt

### Illustrationen
- **Sketch-Stil beibehalten**: Handgezeichnete Elemente im Stil von hero_clouds.svg und Frame.svg
- **Neue Illustrationen**: Können in recraft.ai erstellt werden — im gleichen Stil
- **Farben in Illustrationen**: #262626 für Linien, #527A98 für Sketch-Hintergründe/Schatten, #E8AF30 für Akzente

---

## 9. Tone of Voice

| Dimension | Ausprägung |
|---|---|
| Anrede | **Du-Form** — konsequent, auch auf der Webseite |
| Register | **Professionell-nahbar** — kein Berater-Deutsch, aber auch kein Kumpel-Ton |
| Komplexität | **Klar und direkt** — keine verschachtelten Sätze, keine Buzzwords ohne Substanz |
| Persönlichkeit | **Sketch-Notizen als persönliche Stimme** — z.B. "→ mein Kerngeschäft seit 10 Jahren" |
| Humor | **Dosiert** — z.B. "Kaffee geht auch ☕" auf der Kontaktseite, aber nicht überall |
| Fachsprache | **Wo nötig, mit Erklärung** — DCIA, HERMES, Shadow AI → kurze Einordnung dazu |

---

## 10. Anwendungsbeispiele

### Webseite — Landingpage-Struktur (`src/routes/(public)/+page.svelte`)

Die Landingpage wechselt bewusst zwischen hellen und dunklen Sektionen, getrennt durch Wavy Dividers:

| # | Sektion | ID | BG | Kerninhalt |
|---|---|---|---|---|
| 1 | **Hero** | — | Light | Logo-Box, Headline mit Steel- und Teal-Underlines, zwei CTAs, animierte Wolken |
| 2 | **Metriken-Leiste** | — | Navy | 5 Stats mit Count-up (10 Jahre · 50+ Kunden · 3 VR · 2 Unis · 80+ Projekte) |
| 3 | **Pillars** | `#pillars` | Light | Vier Flip-Karten mit Bild, Titel, Tags — Rückseite zeigt Beispiele |
| 4 | **About** | `#about` | Dark | Zweispaltig: Text + Qualifikationen links, Avatar + Video + Rollen rechts |
| 5 | **Walk the Talk** | `#walkthetalk` | Light | Plattformen-Grid (2-spaltig bei nur 2 Einträgen) + Avatar |
| 6 | **References** | `#references` | Dark | Kunden-Logos als zweireihige Marquee |
| 7 | **Blog** | `#blog` | Light | Neueste Posts-Grid, Back-Button nutzt Browser-History |
| 8 | **Contact** | `#contact` | Navy | CTA-Sektion mit Avatar (links positioniert, um Textüberlappung zu vermeiden) |

### Webseite — Allgemein
- `--bg-page` als Basis, Buttons in Steel, Sketch-Labels in Teal.
- Shadows Into Light nur für Section-Labels, Notizen und den Claim.
- Logo im Header (horizontal), Wolken im Hero, Wavy Dividers zwischen Sektionen.

### LinkedIn
- Banner: Steel- oder Navy-Hintergrund, Text in `--text-primary-dark`, Teal-Akzent.
- Profilbild: Professionelles Foto (kein Logo als Profilbild).

### Präsentationen
- Titelfolie: Navy-Hintergrund, weisser Text, Teal-Akzent.
- Inhaltsfolien: `--bg-page`, Steel-Überschriften.
- Sketch-Elemente als Dekoration, nicht als Inhalt.
- Logo auf jeder Folie (klein, unten rechts).

### Visitenkarte
- Vorderseite: `--bg-page`, Logo, Name, Titel.
- Rückseite: Steel-Hintergrund, Kontaktdaten in Weiss.
- Teal als Akzentlinie.

### E-Mail-Signatur
- Name: Plus Jakarta Sans 700, `--text-primary`.
- Titel: Plus Jakarta Sans 400, `--text-secondary`.
- Logo: Klein, horizontal.
- Trennlinie: Steel (`--btb-steel`).

---

## 11. Do's and Don'ts

### Do's ✓
- Steel `#527A98` als Leitfarbe, Teal `#2B8A78` als Signatur-Akzent in allen Medien verwenden.
- Design-Tokens (`var(--btb-steel)`, `var(--bg-page)`, …) statt hardcodierter Werte — auch in Tailwind via `bg-[var(--btb-steel)]`.
- Sketch-Labels (Shadows Into Light, Teal) und Wavy Dividers als Brand-Signatures einsetzen.
- Keyword Underlines: ein Wort pro Headline, Steel auf Light, Teal auf Dark.
- Klare Hierarchie: Headline → Sketch-Label → Body.
- Dual-Mode-Wechsel: bewusste Abfolge Light → Dark → Light → Navy.
- `prefers-reduced-motion` respektieren — alle Reveals und Flips fallen dann weg.
- Den Würfel als Logo-Element beibehalten.

### Don'ts ✗
- **Kein Gold (#E8AF30) und kein Cream (#F5EED6) mehr** — veraltete v1/v2-Palette, durch Teal + `#F5F5F2` ersetzt.
- **Kein Outfit, kein Caveat** — ersetzt durch Plus Jakarta Sans und Shadows Into Light.
- Reines Weiss als Seiten-BG verwenden (nur für Karten-Surfaces).
- Mehr als ~3 Farben pro Viewport.
- Shadows Into Light für Buttons, Navigation, Fliesstext oder längere Absätze.
- Hardcodierte Hex-Werte oder z-index-Zahlen in Komponenten.
- Rotierte Sketch-Notizen (alte v1/v2-Regel, bewusst entfernt).
- Übermässig viele Sketch-Elemente (max. 2–3 pro Viewport).
- Generische Stock-Fotos, Gradient-Hintergründe, Neon-Effekte.
- Das Logo ohne den Würfel verwenden.

---

---

# Recraft.ai — Logo-Prompts für Break the Box

## Vorbereitung in Recraft

1. **Stil wählen**: "Sharp Drawn Logo" oder "Geometric Logo" (im Style-Selektor nach "logo" suchen)
2. **Farbpalette setzen**: Lade die Farben #527A98 (Steel), #2B8A78 (Teal), #F5F5F2 (Page-BG), #1B344D (Navy), #262626 (Ink) als Custom-Palette
3. **Referenzbild hochladen**: Lade dein bestehendes Logo (logo.png oder logo_komplett.png) als Style-Referenz hoch
4. **Format**: Quadratisch (1:1) für Icon-Variante, 3:1 für Horizontal-Variante

---

## Prompt-Varianten

### Variante A — Modernisierter gebrochener Würfel (treu zum Original)

```
Minimalist logo mark of a three-dimensional cube with visible crack lines 
breaking through its surface, as if the box is shattering open from within. 
Clean geometric construction with hand-drawn imperfect edges suggesting a 
sketch style. The crack pattern radiates from the center of the front face. 
Single color, steel blue tone. No text. White background. Vector style, 
scalable, modern yet approachable. The cube should feel solid but breaking 
apart — symbolizing breaking out of conventional thinking.
```

### Variante B — Würfel mit Sketch-Charakter (stärkerer Handzeichnungs-Stil)

```
Logo of a cracked open cube drawn in a hand-sketched illustration style 
with slightly imperfect lines and organic edges. The cube is three-dimensional 
with visible depth. Crack lines run across the front face creating an 
asymmetric break pattern. Style reminiscent of whiteboard sketches or 
visual facilitation drawings. Monochrome dark charcoal lines on white 
background. Minimalist, no shading, no gradients. Vector art, clean and 
professional but with character and warmth.
```

### Variante C — Abstrahierter Würfel (moderner, reduzierter)

```
Abstract geometric logo mark: a cube shape constructed from clean lines 
with one face deliberately broken or displaced, creating negative space 
where the break occurs. The displacement suggests something emerging 
or breaking free. Minimal line weight, precise geometry with one area 
of intentional imperfection. Steel blue color (#527A98) on white 
background. Modern, professional, tech-forward but human. No text. 
Suitable for favicon and large format alike.
```

### Variante D — Würfel mit Teal-Akzent (zweifarbig)

```
Minimalist logo of a three-dimensional cube outline in dark charcoal
with crack lines breaking through the surface. The cracks reveal a
cool teal glow from inside, suggesting light or energy breaking through.
Two-color design: dark charcoal (#262626) for the cube structure,
teal (#2B8A78) for the light emerging from the cracks. Off-white
background (#F5F5F2). Clean vector lines, slightly hand-drawn quality.
No text. Symbolizes innovation breaking through conventional structures.
```

### Variante E — Logotype mit Würfel (Komplett-Logo mit Text)

```
Horizontal logo design: on the left, a three-dimensional cube with 
crack lines breaking through its surface in a hand-sketched style. 
On the right, bold sans-serif text reading "BREAK THE BOX" in two 
stacked lines with "THE" smaller between "BREAK" and "BOX". 
Below in smaller text "GMBH". Dark charcoal color throughout. 
Clean vector style with the cube having slightly organic, 
hand-drawn line quality contrasting with the precise typography. 
White background.
```

---

## Tipps für die Iteration in Recraft

1. **Starte mit Variante A oder B** — sie sind am nächsten an deinem bestehenden Logo
2. **Wenn der Würfel zu perfekt wird**: Füge "hand-drawn", "slightly imperfect lines", "organic edges" hinzu
3. **Wenn der Würfel zu chaotisch wird**: Füge "clean", "geometric", "precise construction" hinzu
4. **Farbpalette in Recraft setzen** bevor du generierst — so bleibt Steel als Primärfarbe
5. **Variante D** (mit Gold-Akzent) eignet sich besonders für Social-Media-Profile und Favicon
6. **Nach der Generierung**: Nutze "Remove Background" und "Convert to SVG" in Recraft
7. **Teste Skalierung**: Ein gutes Logo muss bei 32×32px (Favicon) und bei 400px Breite funktionieren
8. **Iteriere**: Die erste Generation ist selten die beste. Verfeinere den Prompt basierend auf den Ergebnissen — z.B. "more angular cracks" oder "softer line weight"

---

## Zusätzliche Recraft-Prompts für Brand-Illustrationen

### Sketch-Stil-Illustrationen (für Webseite/Präsentationen)

```
Hand-drawn whiteboard-style illustration of [THEMA], sketched with 
thin charcoal lines on off-white paper background (#F5F5F2). Simple, clean,
visual facilitation style. Small colored accents in steel blue (#527A98)
and teal (#2B8A78). No gradients, no shading. Professional but warm 
and approachable, like a sketch from a strategy workshop.
```

Ersetze [THEMA] mit:
- "a strategy roadmap with milestones and arrows"
- "a boardroom table with diverse people discussing"
- "connected nodes representing a digital ecosystem"
- "a lighthouse guiding ships, symbolizing strategic direction"
- "puzzle pieces coming together"
- "a bridge connecting two cliffs, symbolizing digital transformation"

### Icon-Set (für Webseite-Säulen)

```
Minimalist hand-drawn icon of [OBJEKT], single line weight, 
slightly imperfect organic lines, steel blue color on white 
background. Simple, recognizable at small sizes. Visual 
facilitation sketch style.
```

Ersetze [OBJEKT] mit:
- "a compass pointing upward" (Strategieberatung)
- "a shield with a checkmark" (Governance)
- "stacked books with a lightbulb above" (Lehre)
- "a gear with a spark or lightning bolt" (KI-Innovation)
