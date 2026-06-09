# n8n Backend — STEM Robotics AI Content

Ο "εγκέφαλος" του συστήματος. Δέχεται μηνύματα από το frontend, παράγει SEO άρθρα με GPT-4o ή εικόνες με DALL·E 3, δημοσιεύει σε WordPress και σώζει ιστορικό στο Airtable.

## Ροή (Workflow)

```
Webhook  →  Switch (model)
                │
    ┌───────────┴────────────┐
    │ dall-e-3                │ gpt-4o
    ▼                         ▼
DALL-E 3              Airtable (read SEO)
    │                         ▼
    ▼                  AI Agent (gpt-4o)  ←─ OpenAI Chat Model
Respond-Image                │            ←─ Window Buffer Memory (session = chat_id)
                             ▼
                      JS Parser (clean HTML / dedupe H2 / extract SEO)
                             ▼
                      WordPress (publish: slug + content)
                             ▼
                      Airtable (write history)
                             ▼
                      Respond-Article (→ frontend: wp_link, html, seo)
```

## Εγκατάσταση

### 1. Import το workflow
- Άνοιξε το n8n → **Workflows** → **Import from File**
- Διάλεξε το `n8n-workflow.json`

### 2. Σύνδεσε Credentials
Το workflow έχει placeholders (`YOUR_..._CRED_ID`). Σε κάθε node, διάλεξε/φτιάξε το credential:

| Node | Credential | Πώς |
|---|---|---|
| OpenAI Chat Model, DALL-E 3 | **OpenAI API** | API key από platform.openai.com |
| Airtable (read/write) | **Airtable Personal Access Token** | airtable.com/create/tokens |
| WordPress - Publish | **WordPress API** | URL + username + **Application Password** |

### 3. Ρύθμισε τα Airtable IDs
Αντικατέστησε το `YOUR_AIRTABLE_BASE_ID` (2 σημεία) με το δικό σου Base ID (`app...`).

Χρειάζεσαι **2 tables** στο Airtable:

**`SEO Keywords`** (read-only για τον agent)
| Πεδίο | Τύπος |
|---|---|
| keyword | Single line text |
| meta_description | Long text |

**`Chat History`** (write)
| Πεδίο | Τύπος |
|---|---|
| chat_id | Single line text |
| user_message | Long text |
| ai_response | Long text |
| wp_link | URL |
| timestamp | Date/time |

### 4. Πάρε το Webhook URL
- Άνοιξε το **Webhook** node → αντίγραψε το **Production URL**
- Βάλ' το στο Vercel ως `VITE_N8N_WEBHOOK_URL`

### 5. Ενεργοποίησε
Πάτα **Active** (πάνω δεξιά) και κάνε ένα test μήνυμα από το frontend.

## Payload που δέχεται

```json
{ "message": "Γράψε άρθρο για ρομποτική", "chat_id": "uuid-xyz", "model": "gpt-4o" }
```

- `model: "gpt-4o"` → πλήρης ροή άρθρου + WordPress
- `model: "dall-e-3"` → μόνο δημιουργία εικόνας

## Σημειώσεις

- **Vector Store / Knowledge Base**: μπορείς να προσθέσεις ένα Vector Store tool στον AI Agent (Pinecone/Supabase) αν θες RAG από δικό σου υλικό.
- **Social Media**: προσθέτεις node (Meta Graph / Buffer) μετά το WordPress, με IF που ενεργοποιείται μόνο όταν ο χρήστης δώσει έγκριση στο chat.
- Οι DALL·E εικόνες: το prompt απαγορεύει ρητά ανθρώπους, κείμενο, watermarks.
