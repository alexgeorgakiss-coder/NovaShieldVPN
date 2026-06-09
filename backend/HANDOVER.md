# Handover Checklist — STEM Robotics AI Content System

Οδηγός παράδοσης για τον πελάτη. Όλος ο κώδικας είναι έτοιμος· εδώ είναι όσα χρειάζονται **οι δικοί σας λογαριασμοί & κλειδιά** για να λειτουργήσει το σύστημα end-to-end.

---

## 1. Λογαριασμοί που πρέπει να ανοίξετε

| Υπηρεσία | Σκοπός | Κόστος |
|---|---|---|
| **OpenAI** | gpt-4o (άρθρα) + DALL·E 3 (εικόνες) | Pay-as-you-go (ανά χρήση) |
| **Airtable** | Αποθήκευση SEO keywords + ιστορικό chat | Δωρεάν plan επαρκεί στην αρχή |
| **n8n** | Ο "εγκέφαλος" / αυτοματοποίηση | Cloud (συνδρομή) ή self-hosted (δωρεάν) |
| **Vercel** | Φιλοξενία frontend (chat app) | Δωρεάν Hobby plan |
| **WordPress** | Το site όπου δημοσιεύονται τα άρθρα | (υπάρχον site σας) |
| **Social Media API** *(προαιρετικό)* | Auto-posting (Meta/Buffer) | Ανάλογα την υπηρεσία |

> 💡 Συνιστάται να ανοιχτούν **στο όνομα της επιχείρησης** (όχι προσωπικό email developer), ώστε η χρέωση και η ιδιοκτησία να είναι δικά σας.

---

## 2. Κλειδιά που πρέπει να βγάλετε

### 🔑 OpenAI API Key
1. platform.openai.com → **API Keys** → **Create new secret key**
2. Προσθέστε **payment method** (κάρτα) + ένα usage limit για ασφάλεια
3. Αντιγράψτε το key (`sk-...`)

### 🔑 Airtable Token + Base ID
1. airtable.com → **Developer Hub → Personal Access Tokens → Create**
2. Scopes: `data.records:read`, `data.records:write`
3. Προσθέστε το Base σας → αντιγράψτε το token (`pat...`)
4. **Base ID**: από το URL του base → `airtable.com/`**`appXXXXXXXX`**`/...`

### 🔑 WordPress Application Password
1. WordPress Admin → **Χρήστες → Προφίλ**
2. Κάτω-κάτω: **Application Passwords** → δώστε όνομα → **Add New**
3. Αντιγράψτε τον κωδικό (εμφανίζεται **μία φορά**)

---

## 3. Πού μπαίνουν τα κλειδιά

### Στο Vercel (frontend)
**Project → Settings → Environment Variables:**

| Variable | Τιμή |
|---|---|
| `VITE_N8N_WEBHOOK_URL` | Το Production URL του n8n Webhook |
| `VITE_AIRTABLE_API_KEY` | Το Airtable token (`pat...`) |
| `VITE_AIRTABLE_BASE_ID` | Το Base ID (`app...`) |
| `VITE_AIRTABLE_TABLE_NAME` | `Chat History` |

### Στο n8n (backend)
Μέσα στο workflow, σε κάθε node → **Credentials**:
- OpenAI (Chat Model + DALL-E nodes)
- Airtable (read + write nodes)
- WordPress (publish node)

*(Αναλυτικά: δείτε `backend/README.md`)*

---

## 4. Airtable — Δομή πινάκων

**Table: `SEO Keywords`**
| Πεδίο | Τύπος |
|---|---|
| keyword | Single line text |
| meta_description | Long text |

**Table: `Chat History`**
| Πεδίο | Τύπος |
|---|---|
| chat_id | Single line text |
| user_message | Long text |
| ai_response | Long text |
| wp_link | URL |
| timestamp | Date/time |

---

## 5. Σειρά ενεργοποίησης

1. ☐ Ανοίξτε τους λογαριασμούς (ενότητα 1)
2. ☐ Βγάλτε τα κλειδιά (ενότητα 2)
3. ☐ Φτιάξτε τους 2 Airtable πίνακες (ενότητα 4)
4. ☐ Import το `backend/n8n-workflow.json` στο n8n
5. ☐ Συνδέστε τα credentials στα n8n nodes
6. ☐ Αντιγράψτε το Webhook URL από το n8n
7. ☐ Βάλτε τα 4 env vars στο Vercel → **Redeploy**
8. ☐ Test: στείλτε μήνυμα από το chat app

---

## 6. Ασφάλεια ⚠️

- Τα κλειδιά **ποτέ** δεν μπαίνουν στον κώδικα — μόνο σε Environment Variables / n8n Credentials.
- Τα `.env` αρχεία **δεν ανεβαίνουν** στο GitHub (είναι στο `.gitignore`).
- Αν κάποιος developer είδε τα κλειδιά κατά την ανάπτυξη, κάντε **rotate** (επανέκδοση) μετά την παράδοση.
- Βάλτε **usage limit** στο OpenAI για να αποφύγετε απρόσμενες χρεώσεις.

---

## 7. Εκτίμηση κόστους λειτουργίας (ενδεικτικά)

| Υπηρεσία | Μηνιαίο κόστος |
|---|---|
| OpenAI (gpt-4o + DALL·E) | ~ ανάλογα τον όγκο (π.χ. $0.01–0.05 ανά άρθρο για το μοντέλο, ~$0.04 ανά εικόνα) |
| Airtable | $0 (Free) έως ~$20 |
| n8n Cloud | από ~€20/μήνα (ή $0 self-hosted) |
| Vercel | $0 (Hobby) |

*Οι τιμές OpenAI αλλάζουν — επιβεβαιώστε στο openai.com/pricing.*
