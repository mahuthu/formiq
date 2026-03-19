# FormIQ — Document Digitization Platform

Convert printed and handwritten documents into structured, searchable data using AI.
Built for governments, hospitals, schools, and financial institutions.

---

## What it does

Upload any paper document — invoices, lab results, KYC forms, CVs, certificates — and FormIQ extracts structured data fields in seconds using Claude Vision AI. Results are editable, approvable, exportable to CSV/JSON, and queryable via REST API.

---

## Architecture

```
frontend (Next.js 14)
    └── backend (Node.js + Express)
            ├── PostgreSQL  (records, users, orgs)
            ├── Redis       (job queue, caching)
            ├── S3/R2       (document file storage)
            └── Anthropic   (Claude Vision AI)
```

---

## Quick start (Docker)

**Prerequisites:** Docker + Docker Compose, Anthropic API key, S3/R2 bucket

```bash
# 1. Clone and configure
git clone https://github.com/your-org/formiq
cd formiq
cp .env.example .env
```

Edit `.env` with your credentials:
```env
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your-32-char-random-string
S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=formiq-documents
```

```bash
# 2. Start everything
docker-compose up -d

# 3. Open the app
open http://localhost:3000
```

That's it. Migrations and seeding run automatically on first boot.

---

## Manual setup (development)

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Backend

```bash
cd backend
npm install
cp .env.example .env    # Fill in your values

# Database
npx prisma migrate dev
npm run db:seed         # Seeds system templates

# Start dev server
npm run dev             # Runs on :3001
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env

npm run dev             # Runs on :3000
```

---

## Deployment

### Railway (recommended for v1)

```bash
# Install Railway CLI
npm i -g @railway/cli
railway login

# Deploy
railway up
```

Set environment variables in Railway dashboard. Add PostgreSQL and Redis plugins.

### Render

1. Create a new Web Service pointing to `/backend`
2. Build command: `npm install && npx prisma generate && npm run build`
3. Start command: `./entrypoint.sh`
4. Add PostgreSQL and Redis add-ons

### DigitalOcean App Platform

Use the provided `docker-compose.yml`. Push to GitHub and connect via App Platform.
Set env vars in the App Platform dashboard.

### Self-hosted VPS

```bash
# On your server
git clone https://github.com/your-org/formiq
cd formiq
cp .env.example .env
# Edit .env

docker-compose -f docker-compose.yml up -d

# Set up Nginx reverse proxy (example)
# frontend :3000 -> yourdomain.com
# backend  :3001 -> api.yourdomain.com
```

---

## File storage setup

### Cloudflare R2 (recommended — free egress)
1. Create an R2 bucket in Cloudflare dashboard
2. Create API token with R2 permissions
3. Set `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`

### AWS S3
1. Create S3 bucket (private)
2. Create IAM user with S3 permissions
3. Set `S3_ENDPOINT=` (leave empty for AWS)
4. Set `S3_REGION=us-east-1` (or your region)

---

## API Reference

All endpoints require `Authorization: Bearer <token>` or `Authorization: ApiKey <key>`.

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Documents

```
POST   /api/documents/upload
       Body: multipart/form-data
       Fields: files[] (image/pdf), templateId

GET    /api/documents
       Query: status, templateId, search, page, limit

GET    /api/documents/:id
       Returns: document + extraction + signedUrl

PATCH  /api/documents/:id/fields
       Body: { fields: { "Invoice Number": "INV-001", ... } }

POST   /api/documents/:id/approve

DELETE /api/documents/:id
```

### Templates

```
GET    /api/templates
POST   /api/templates
       Body: { name, documentType, description, fields: [{ name, type, required }] }
PUT    /api/templates/:id
DELETE /api/templates/:id
```

### Records

```
GET    /api/records
       Query: templateId, from, to, page, limit

GET    /api/records/export?format=csv|json
GET    /api/records/:id
```

### Organization

```
GET    /api/org/usage
GET    /api/org/members
POST   /api/org/invite
DELETE /api/org/members/:id
GET    /api/org/profile
PATCH  /api/org/profile
```

### Webhooks

```
GET    /api/webhooks
PUT    /api/webhooks      Body: { webhookUrl, webhookSecret }
POST   /api/webhooks/test
```

### Webhook payload format

```json
{
  "event": "document.extracted",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "documentId": "uuid",
    "status": "REVIEW",
    "confidence": 87,
    "fields": {
      "Invoice Number": "INV-2024-001",
      "Total Amount": "45000",
      "Vendor Name": "Acme Ltd"
    }
  }
}
```

Requests include `X-FormIQ-Signature: sha256=<hmac>` header when a secret is configured.

---

## User roles

| Role | Upload | Review | Approve | Manage team | Settings |
|---|---|---|---|---|---|
| Owner | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reviewer | ✓ | ✓ | ✓ | — | — |
| Uploader | ✓ | — | — | — | — |

---

## Supported document types (built-in)

| Template | Key fields |
|---|---|
| Invoice | Invoice #, dates, vendor/client, line items, totals |
| Lab Result | Patient, test name, result value, reference range |
| KYC / ID | Full name, ID number, DOB, expiry |
| CV / Resume | Contact info, education, experience, skills |
| Medical / OPD | Patient, vitals, diagnosis, medications |
| Certificate | Recipient, institution, issue/expiry dates |
| Admission Form | Student, parent, previous school, program |
| Business Form | Company, reference number, amount, authorized by |

Custom templates can be created with any field names and types (TEXT, NUMBER, DATE, CURRENCY, BOOLEAN, LIST, EMAIL, PHONE).

---

## Plans and limits

| Plan | Docs/month | Users | API | Price |
|---|---|---|---|---|
| Free | 50 | 2 | No | $0 |
| Starter | 500 | 5 | Yes | $49/mo |
| Professional | 5,000 | 20 | Yes | $199/mo |
| Enterprise | Unlimited | Unlimited | Yes | Custom |

---

## Project structure

```
formiq/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express app entry
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT + API key auth
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── documents.ts
│   │   │   ├── templates.ts
│   │   │   ├── records.ts
│   │   │   ├── org.ts
│   │   │   └── webhooks.ts
│   │   ├── services/
│   │   │   ├── extraction.ts     # Claude Vision AI
│   │   │   ├── worker.ts         # BullMQ job processor
│   │   │   ├── storage.ts        # S3/R2 abstraction
│   │   │   └── webhook.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   ├── redis.ts
│   │   │   ├── logger.ts
│   │   │   └── utils.ts
│   │   └── seed.ts               # System templates
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── entrypoint.sh
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/      # Protected pages
│   │   │   │   ├── layout.tsx    # Sidebar + auth guard
│   │   │   │   ├── dashboard/
│   │   │   │   ├── upload/
│   │   │   │   ├── documents/
│   │   │   │   ├── templates/
│   │   │   │   ├── records/
│   │   │   │   └── settings/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   └── lib/
│   │       └── api.ts            # Typed API client
│   └── Dockerfile
│
├── docs/
│   └── PRD.md                    # Full product requirements
├── docker-compose.yml
└── .env.example
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✓ | Claude Vision API key |
| `JWT_SECRET` | ✓ | 32+ char random string |
| `DATABASE_URL` | ✓ | PostgreSQL connection string |
| `REDIS_URL` | ✓ | Redis connection string |
| `S3_ENDPOINT` | ✓ | R2/S3 endpoint URL |
| `S3_ACCESS_KEY_ID` | ✓ | Storage access key |
| `S3_SECRET_ACCESS_KEY` | ✓ | Storage secret |
| `S3_BUCKET` | ✓ | Bucket name |
| `FRONTEND_URL` | ✓ | Frontend origin (for CORS) |
| `NEXT_PUBLIC_API_URL` | ✓ | API URL for browser |
| `STRIPE_SECRET_KEY` | — | Billing (optional) |

---

## Roadmap

- [ ] Google Sheets sync
- [ ] Bulk CSV import
- [ ] eTIMS/KRA invoice auto-submission (Kenya)
- [ ] KHIS / EMR integration (Kenya health systems)
- [ ] Mobile app (React Native)
- [ ] Swahili + French document support
- [ ] On-premise / air-gapped deployment
- [ ] SSO (SAML, Google Workspace)
- [ ] Fine-tuning on org-specific document formats

---

## License

Proprietary. All rights reserved.
Contact: formiq@tiba.health
