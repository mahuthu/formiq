# FormIQ — Product Requirements Document
Version 1.0 | Document Digitization Platform

---

## 1. Product Vision

FormIQ is a SaaS document digitization platform that converts printed and handwritten paperwork into structured, searchable digital data. Targeted at governments, hospitals, schools, and financial institutions in emerging markets where paper-based workflows remain dominant.

**One-liner:** Upload any document — get structured data instantly.

---

## 2. Problem Statement

Organizations across Africa and the developing world process millions of paper documents daily — invoices, lab results, admission forms, KYC documents, CVs, certificates. Manual data entry is:
- Slow: 3–10 minutes per document
- Error-prone: 5–10% error rate in manual transcription
- Expensive: Requires dedicated data entry staff
- Not searchable: Paper records cannot be queried or analyzed

FormIQ eliminates this by using AI vision to read any document — printed or handwritten — and extract structured data in seconds.

---

## 3. Target Markets

| Segment | Use Case | Key Pain |
|---|---|---|
| Government agencies | Digitize citizen records, forms, permits | Massive paper backlogs |
| Hospitals / clinics | Lab results, OPD forms, referral letters | Patient data silos |
| Schools / universities | Admission forms, transcripts, CVs | Manual enrollment processing |
| Banks / SACCOs / MFIs | KYC docs, loan applications, payslips | Compliance & onboarding speed |
| Law firms | Contracts, affidavits, court forms | Document management |
| NGOs | Survey forms, beneficiary records | Field data digitization |

---

## 4. Core User Personas

**Persona 1 — Data Entry Clerk (Primary user)**
- Uploads documents daily, wants speed and accuracy
- Non-technical, needs simple UI
- Cares about: ease of correction, export formats

**Persona 2 — Department Head / Admin**
- Reviews digitized records, manages users
- Cares about: accuracy reports, team activity, data integrity

**Persona 3 — IT Administrator**
- Sets up the system, manages integrations
- Cares about: API access, security, SSO, audit logs

**Persona 4 — C-Suite / Decision Maker (Buyer)**
- Approves procurement
- Cares about: ROI, compliance, uptime, pricing

---

## 5. Feature Scope

### 5.1 MVP Features (v1.0)

#### Document Upload
- [ ] Drag-and-drop or file picker upload
- [ ] Supported formats: JPG, PNG, PDF (single and multi-page)
- [ ] Batch upload (up to 20 documents per job)
- [ ] Image quality feedback (blur detection, low-light warning)
- [ ] Mobile camera capture (PWA)

#### Document Templates
- [ ] Pre-built templates: Invoice, Lab Result, Certificate, CV/Resume, KYC/ID, Medical Form, Business Form, Admission Form
- [ ] Custom templates: user-defined field sets
- [ ] Template saving and sharing within organization
- [ ] Field types: text, number, date, currency, list, boolean

#### AI Extraction Engine
- [ ] OCR + structured extraction via Claude Vision API
- [ ] Confidence scoring per field (high / medium / low)
- [ ] Handwriting support
- [ ] Multi-language support (English, Swahili — v1.0; French, Arabic — v1.1)
- [ ] Extraction from multi-page PDFs (merge into single record)

#### Review & Correction UI
- [ ] Side-by-side view: original document + extracted fields
- [ ] Click-to-highlight: click a field to see where it was found on doc
- [ ] Inline editing of all extracted fields
- [ ] Flag for human review
- [ ] Approval workflow (extract → review → approve)

#### Records Management
- [ ] Searchable records database
- [ ] Filter by: date, document type, status, uploaded by
- [ ] Record versioning (track edits)
- [ ] Bulk operations (export, delete, tag)

#### Export & Integrations
- [ ] Export: JSON, CSV, Excel, PDF summary
- [ ] REST API with API key auth
- [ ] Webhook support (POST extracted data to external URL)
- [ ] Google Sheets integration (v1.1)
- [ ] Zapier connector (v1.1)

#### Multi-tenancy & Auth
- [ ] Organization accounts (tenants)
- [ ] Role-based access: Owner, Admin, Reviewer, Uploader
- [ ] Email/password auth + Google SSO
- [ ] Invite-based team management

#### Billing (SaaS)
- [ ] Free tier: 50 documents/month
- [ ] Starter: 500 docs/month — $49/month
- [ ] Professional: 5,000 docs/month — $199/month
- [ ] Enterprise: Unlimited + on-prem — Custom
- [ ] Usage metering and overage alerts
- [ ] Stripe integration

### 5.2 v1.1 Roadmap
- Bulk CSV import of scanned document batches
- HMIS / EMR integration (Kenya: KHIS, Daktari)
- eTIMS invoice auto-submission (KRA Kenya)
- Mobile app (React Native)
- On-premise / air-gapped deployment option
- Training mode: fine-tune extraction on org's own documents

---

## 6. Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  Next.js 14 (App Router) + Tailwind + shadcn/ui     │
│  PWA-enabled, mobile-first                          │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / REST + WebSocket
┌────────────────────▼────────────────────────────────┐
│                    API LAYER                         │
│  Node.js + Express + TypeScript                     │
│  JWT Auth | Rate limiting | Multi-tenant middleware │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│  PostgreSQL  │ │  Redis   │ │   S3/R2    │
│  (records,  │ │  (queue, │ │  (document │
│   users,    │ │  cache)  │ │   storage) │
│   orgs)     │ └──────────┘ └────────────┘
└─────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│                 AI EXTRACTION SERVICE                │
│  Claude Vision API (Anthropic)                      │
│  Queue-based processing (Bull + Redis)              │
│  Retry logic, confidence scoring, fallback OCR      │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui | Fast, SEO, great DX |
| Backend | Node.js, Express, TypeScript | Familiar, fast iteration |
| Database | PostgreSQL + Prisma ORM | Relational, multi-tenant safe |
| Cache / Queue | Redis + BullMQ | Job processing, rate limiting |
| File Storage | Cloudflare R2 (or AWS S3) | Cheap egress, global CDN |
| AI | Anthropic Claude API (Vision) | Best handwriting + structured extraction |
| Auth | NextAuth.js + JWT | SSO-ready |
| Payments | Stripe | Industry standard |
| Deployment | Docker + Railway / Render / DigitalOcean | Simple, affordable |
| Monitoring | Sentry + Posthog | Errors + product analytics |

---

## 7. Data Model

### Organizations (Tenants)
```
id, name, slug, plan, document_quota, documents_used,
stripe_customer_id, created_at
```

### Users
```
id, org_id, email, name, role (owner|admin|reviewer|uploader),
avatar_url, last_active_at, created_at
```

### Templates
```
id, org_id, name, document_type, fields (JSON), is_system,
created_by, created_at
```

### Documents
```
id, org_id, uploaded_by, template_id, original_filename,
storage_key, status (pending|processing|review|approved|failed),
page_count, created_at
```

### Extractions
```
id, document_id, template_id, fields (JSON), confidence_scores (JSON),
processing_time_ms, model_version, created_at
```

### Records
```
id, org_id, document_id, extraction_id, data (JSON),
reviewed_by, approved_by, approved_at, tags, created_at
```

---

## 8. API Design

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### Documents
```
POST   /api/documents/upload          # Upload document(s)
GET    /api/documents                 # List documents
GET    /api/documents/:id             # Get document + extraction
PATCH  /api/documents/:id/fields      # Update extracted fields
POST   /api/documents/:id/approve     # Approve record
DELETE /api/documents/:id
```

### Templates
```
GET    /api/templates                 # List (system + org)
POST   /api/templates                 # Create custom template
PUT    /api/templates/:id
DELETE /api/templates/:id
```

### Records
```
GET    /api/records                   # Search/filter records
GET    /api/records/:id
GET    /api/records/export?format=csv # Bulk export
```

### Webhooks
```
POST   /api/webhooks                  # Register webhook
GET    /api/webhooks
DELETE /api/webhooks/:id
```

### Admin
```
GET    /api/org/usage
GET    /api/org/members
POST   /api/org/invite
```

---

## 9. Security Requirements

- All files encrypted at rest (AES-256) and in transit (TLS 1.3)
- Files stored in private S3/R2 buckets — accessed via signed URLs only
- Per-organization data isolation at DB level (org_id on all queries)
- API rate limiting: 100 req/min per API key
- OWASP Top 10 compliance
- SOC 2 Type II roadmap (v2.0)
- GDPR-ready: data deletion, export, consent tracking
- Kenyan DPA (2019) compliance

---

## 10. Pricing & Business Model

| Plan | Price | Docs/month | Users | API | Support |
|---|---|---|---|---|---|
| Free | $0 | 50 | 2 | No | Community |
| Starter | $49/mo | 1000 | 5 | Yes | Email |
| Professional | $99/mo | 5,000 | 20 | Yes | Priority |
| Enterprise | Custom | Unlimited | Unlimited | Yes | SLA + CSM |

**Unit economics target:**
- COGS per document: ~$0.003 (API + storage + compute)
- Gross margin: 80%+ at Professional tier
- Target payback: <6 months CAC

---

## 11. Go-to-Market Strategy

**Phase 1 (Months 1–3): Validation**
- 10 pilot customers in Kenya (2 hospitals, 2 schools, 3 SACCOs, 3 SMEs)
- Free tier + white-glove onboarding
- Build case studies

**Phase 2 (Months 4–6): Launch**
- Product Hunt launch
- Kenya tech community (iHub, Nairobi Dev Community)
- Partnerships: Savannah Fund portfolio companies, Odoo Kenya ecosystem
- Content: "Going paperless" guides for target segments

**Phase 3 (Months 7–12): Scale**
- East Africa expansion (Uganda, Tanzania, Rwanda)
- Government tenders (procurement via G2G channels)
- Channel partners (IT resellers, system integrators)
- Enterprise sales motion

---

## 12. Success Metrics

| Metric | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| Active organizations | 10 | 50 | 200 |
| Documents processed/month | 5,000 | 50,000 | 500,000 |
| MRR | $500 | $5,000 | $25,000 |
| Avg extraction accuracy | 90% | 93% | 95% |
| Churn rate | <10% | <7% | <5% |

---

## 13. Open Questions / Risks

| Risk | Mitigation |
|---|---|
| Anthropic API cost at scale | Negotiate volume pricing; explore open-source OCR fallback |
| Poor image quality from field users | Client-side image quality checks before upload |
| Data privacy concerns (hospitals) | On-prem option; GDPR/DPA compliance; data processing agreements |
| Offline usage in low-connectivity areas | PWA with offline queue; mobile app v1.1 |
| Competition from large players | Focus on Africa-specific docs (Swahili, local forms); local support |

---

*Document version: 1.0 | Status: Draft for review*
