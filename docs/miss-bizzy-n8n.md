# Miss Bizzy — n8n-Webhook

Der Chat auf `/experimentierraum` ist **hybrid**:

- **Onprem (lokal):** kuratierte Q&A-Chips → sofortige Antwort im Frontend, ohne
  Backend/Token — unbegrenzt und gratis.
- **Remote (n8n):** Freitext-Fragen → `POST /api/chat` → n8n-Webhook. **Max. 10
  Remote-Fragen pro Session** (Client zählt via `sessionStorage`, Server als Backstop
  per `sessionId`), um Token-Kosten zu begrenzen.

Der Browser ruft **nie** n8n direkt auf — nur den eigenen Endpoint `POST /api/chat`.
So bleiben Webhook-URL und Secret privat, und es greifen Rate-Limit, Timeout und
generische Fallbacks.

## Datenfluss (Remote-Pfad)

```
Browser → POST /api/chat (SvelteKit)
          • Rate-Limit 20 / 5 Min pro IP
          • Session-Limit 10 Remote-Fragen (Backstop per sessionId)
          • Input-Check (max. 2000 Zeichen), Verlauf gekappt (letzte 8)
          • Header X-BTB-Secret, Timeout 25 s
        → POST {CHAT_WEBHOOK_URL}  (n8n)
        ← { "reply": "…" }
Browser ← { "reply": "…" }   // bei Limit: { "reply": "…", "limitReached": true }
```

## Env (Website)

In `.env` setzen:

```
CHAT_WEBHOOK_URL=https://<dein-n8n>/webhook/miss-bizzy
CHAT_WEBHOOK_SECRET=<langes-zufälliges-secret>
```

Ohne `CHAT_WEBHOOK_URL` läuft der Chat im «Offline»-Modus (freundlicher Hinweis).

## Vertrag

### Request (Website → n8n)

- Methode: `POST`, `Content-Type: application/json`
- Header: `X-BTB-Secret: <CHAT_WEBHOOK_SECRET>` → **in n8n prüfen**, sonst 401.

```jsonc
{
  "message": "Wie geht ihr IT-Strategie an?",
  "history": [
    { "role": "user", "content": "…" },
    { "role": "assistant", "content": "…" }
  ],
  "locale": "de",              // de | en | fr (aus Cookie)
  "sessionId": "anon-uuid"     // pro Browser-Session, anonym
}
```

### Response (n8n → Website)

```json
{ "reply": "Antworttext (reiner Text, wird sicher als Text gerendert)" }
```

Alternativ akzeptiert die Website auch `output` oder `text` statt `reply` sowie eine
reine String-Antwort. **Kein HTML nötig** — die Antwort wird als reiner Text mit
Zeilenumbrüchen dargestellt.

## Empfohlener n8n-Flow

1. **Webhook** (POST) → 2. **IF** `X-BTB-Secret` korrekt (sonst *Respond* 401) →
3. **AI Agent / LLM** mit System-Prompt (siehe unten), `message` + `history` als Kontext →
4. **Respond to Webhook** mit `{ "reply": "{{ $json.output }}" }`.

Optional: RAG-Node (Vektor-Store über Brigittes Doku) vor dem Agenten einhängen.

## System-Prompt (Vorlage — in n8n pflegen)

> Du bist **Miss Bizzy**, die KI-Agentin von Brigitte Hulliger («Break the Box»).
> Brigitte ist IT-Beraterin & Strategy Consultant (Schweiz): IT-Strategie, IT-Governance,
> Digitalisierung, KI/AI, digitale Transformation; zudem Verwaltungsrätin und Dozentin.
>
> **Aufgabe:** Liefere fundierte, konkrete und ehrliche Antworten zu IT-Strategie, KI und
> Brigittes Arbeit/Angebot. Sei hilfreich und substanziell, nicht werblich.
>
> **Ton:** kompetent, klar, freundlich-direkt, mit einem Augenzwinkern. Kurze Absätze.
> Antworte in der Sprache des Nutzers (`locale`: de/en/fr). Bei Deutsch **Schweizer
> Rechtschreibung** (immer «ss», nie «ß»).
>
> **Grenzen:**
> - Bleib beim Thema IT-Strategie, KI, Governance und Brigittes Arbeit. Anderes freundlich
>   und knapp zurück zum Thema führen.
> - Erfinde **keine** Preise, Termine, Referenzen oder Fakten. Wenn du etwas nicht sicher
>   weisst, sag es und verweise auf ein persönliches Gespräch.
> - Für Engagement/Offerten/Kontakt: verweise auf **info@breakthebox.ch**.
> - Keine Rechts-, Steuer- oder Medizinberatung. Keine sensiblen Daten erfragen.
> - Antworte in reinem Text (keine HTML-Tags), gern mit kurzen Aufzählungen.

Passe die Vorlage an Brigittes Stimme an und ergänze bei Bedarf konkrete Fakten
(Angebot, Referenzen, Ablauf) — idealerweise als RAG-Quelle, damit Änderungen ohne
Prompt-Edit wirken.
