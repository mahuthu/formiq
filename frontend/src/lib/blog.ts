export type BlogTag = 'tax' | 'health' | 'data';

export type BlogPost = {
  slug: string;
  title: string;
  lede: string;
  excerpt: string;
  monthYear: string;
  readTime: string;
  author: string;
  tag: BlogTag;
  tagLabel: string;
  body: Array<
    | { type: 'h2'; text: string }
    | { type: 'h3'; text: string }
    | { type: 'p'; text: string }
    | { type: 'ul'; items: Array<string> }
    | { type: 'callout'; tone?: 'default' | 'warn' | 'danger'; title: string; text: string }
    | { type: 'divider' }
    | { type: 'cta'; title: string; text: string; href: string; label: string }
  >;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'etims-2026',
    tag: 'tax',
    tagLabel: 'Tax compliance',
    title: "eTIMS is now law. Here's what every Kenyan business must do before March 31, 2026",
    author: 'FormIQ Editorial',
    monthYear: 'March 2026',
    readTime: '8 min read',
    excerpt:
      "KRA is validating every expense claim against eTIMS data. Non-compliant invoices are now non-deductible — costing businesses real money.",
    lede:
      "Since January 1, 2026, the Kenya Revenue Authority has been cross-checking every income and expense entry in your tax return against eTIMS records. If your supplier's invoice wasn't generated through eTIMS, you cannot deduct that expense. The window to fix this closes on March 31, 2026.",
    body: [
      { type: 'h2', text: 'What happened and when' },
      {
        type: 'p',
        text:
          'The Electronic Tax Invoice Management System — eTIMS — has been in development since 2021, but most Kenyan businesses treated it as optional or a problem for large companies. That changed decisively through a series of KRA public notices and legislative moves in 2023, 2024, and 2025.',
      },
      {
        type: 'p',
        text: 'The key milestones are:',
      },
      {
        type: 'ul',
        items: [
          '<strong>September 1, 2023:</strong> eTIMS became mandatory for all businesses — not just VAT-registered entities. Every company, partnership, sole proprietor, NGO, or individual conducting business in Kenya was required to onboard.',
          '<strong>January 1, 2024:</strong> Any business expenditure not backed by a valid eTIMS invoice became non-deductible for income tax. This was the moment paper invoices stopped being legally sufficient.',
          '<strong>March 2024:</strong> Legal Notice No. 64 of 2024 cemented the regulations, removing ambiguity and closing the remaining exceptions for smaller traders.',
          '<strong>January 1, 2026:</strong> KRA began actively validating income and expenses in submitted tax returns against eTIMS data, withholding tax records, and customs import data. Passive non-compliance became active enforcement.',
          '<strong>March 31, 2026:</strong> The final compliance window. After this date, enforcement measures escalate significantly.',
        ],
      },
      {
        type: 'callout',
        tone: 'danger',
        title: 'The immediate financial risk',
        text:
          'If you paid a supplier KSh 500,000 for inventory without an eTIMS invoice, that entire amount may be disallowed as a deductible expense — directly increasing your taxable income and your tax bill. At a 30% corporate tax rate, a KSh 500,000 disallowed expense costs you KSh 150,000 in additional tax.',
      },
      { type: 'h2', text: "This isn't just about VAT anymore" },
      {
        type: 'p',
        text:
          'A persistent misconception is that eTIMS only matters for VAT-registered businesses. It doesn\'t. The law explicitly covers all persons engaged in business — including hospitals supplying medical services, schools supplying education services, NGOs, tour operators, and small traders whose annual turnover falls below the VAT threshold of KSh 5 million.',
      },
      {
        type: 'p',
        text:
          'The logic is straightforward: if you are someone else\'s expense, your invoice must be eTIMS-compliant for them to deduct it. So even if you personally don\'t care about deductions, your clients do — and they will stop transacting with you if you can\'t issue a compliant invoice. Non-compliance is no longer only a tax risk. It is a commercial development risk that directly affects whether you win or lose business.',
      },
      { type: 'h2', text: 'The supply chain effect' },
      {
        type: 'p',
        text:
          'Large companies in Kenya have begun refusing to engage suppliers who cannot issue eTIMS invoices. When a procurement manager at a bank or a hospital sees that your invoice is not eTIMS-validated, they face a choice: process the payment and lose the tax deduction, or find a compliant supplier. In a competitive market, they will find a compliant supplier.',
      },
      {
        type: 'p',
        text:
          'This is creating a cascading compliance pressure down every supply chain in Kenya. SMEs that serve large corporates, government, or NGOs are facing this pressure right now. SMEs that have not yet onboarded risk being quietly dropped from supplier lists without a formal notification.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'The TCC risk',
        text:
          'As of October 2025, eTIMS compliance is now a mandatory condition for obtaining a Tax Compliance Certificate (TCC). Without a TCC, you cannot participate in government tenders or public procurement. For any business that counts government contracts as a revenue stream, non-compliance has just become existential.',
      },
      { type: 'h2', text: 'What SMEs need to do right now' },
      {
        type: 'p',
        text: 'KRA has provided several routes depending on your business size and transaction volume:',
      },
      {
        type: 'ul',
        items: [
          '<strong>eTIMS Lite USSD (*222#):</strong> For sole proprietors and individuals with minimal transactions. No internet required.',
          '<strong>eTIMS Lite Web (eCitizen portal):</strong> A web-based solution for small businesses. Free to use.',
          '<strong>eTIMS Client:</strong> Downloadable software for businesses dealing in goods and services. Supports multiple branches and pay points.',
          '<strong>VSCU / OSCU integration:</strong> For businesses already running an ERP or invoicing system — these allow direct system-to-system API integration with KRA, so invoices are generated and transmitted automatically without manual steps.',
        ],
      },
      {
        type: 'p',
        text:
          'The most sustainable path for any business with moderate transaction volume is ERP or invoicing software that integrates directly with eTIMS via the VSCU API. This means invoices are automatically eTIMS-compliant at the point of generation — no separate submission step, no manual reconciliation.',
      },
      { type: 'h2', text: 'The document backlog problem' },
      {
        type: 'p',
        text: 'Here is the part most compliance guides ignore. Getting onto eTIMS going forward is relatively straightforward. The harder problem is the backlog.',
      },
      {
        type: 'p',
        text: 'Thousands of Kenyan businesses have been operating partially on paper — receiving supplier invoices as physical documents, filing them manually, and only entering summary figures into accounting systems. Now, for every past transaction they wish to claim as a deduction for the 2025 year of income, they need to verify that the invoice exists in KRA\'s eTIMS database.',
      },
      {
        type: 'p',
        text: 'This audit work — scanning through physical invoice files, identifying non-compliant ones, chasing suppliers to retrospectively issue compliant replacements — is enormously labour-intensive if done manually. It is the exact kind of high-volume, structured document problem that FormIQ was designed to solve: upload physical invoices, extract the key fields (supplier name, amount, date, PIN, invoice number), cross-reference against eTIMS records, and generate an audit-ready report.',
      },
      { type: 'divider' },
      { type: 'h2', text: 'The bigger picture: Kenya is building a real-time tax infrastructure' },
      {
        type: 'p',
        text:
          'eTIMS is not a standalone compliance exercise. It is the foundation of a broader shift to real-time, data-driven tax administration. By late 2024, KRA had already begun auto-filling VAT returns using invoice data submitted through TIMS. The pre-filled return was piloted for late 2024 filings and is now the default for 2025.',
      },
      {
        type: 'p',
        text:
          'The direction of travel is clear: KRA is building a tax system where your transactions are already in the government\'s database before you file your return. The return becomes a confirmation, not a disclosure. Businesses that have clean, structured, digitally-submitted transaction records will find this system frictionless. Businesses that are still reconciling paper files at year-end will find it impossible.',
      },
      {
        type: 'p',
        text:
          'The smartest businesses in Kenya are treating eTIMS compliance not as a regulatory burden but as a forcing function to modernize their financial operations — one that, done properly, actually reduces their compliance workload over time.',
      },
      {
        type: 'cta',
        title: 'FormIQ can help with your invoice backlog',
        text:
          'Upload physical or scanned invoices and extract supplier name, PIN, amount, date, and invoice number in seconds. Export to CSV for eTIMS reconciliation.',
        href: '/register',
        label: 'Start free — 50 documents/month',
      },
    ],
  },
  {
    slug: 'digital-health-act',
    tag: 'health',
    tagLabel: 'Digital health',
    title: 'The Digital Health Agency is coming for paper records. Is your hospital ready?',
    author: 'FormIQ Editorial',
    monthYear: 'March 2026',
    readTime: '7 min read',
    excerpt:
      "Kenya's Digital Health Act (2023) and new 2025 regulations require all health facilities to digitize patient records and connect to national systems — with a 24-month deadline.",
    lede:
      "Kenya's Digital Health Act (2023) and the Digital Health (Health Information Management Procedures) Regulations 2025 require every health facility in the country to digitize patient records and connect to a national health information system. Health facilities have 24 months from the operationalization of County Health Data Banks to migrate all legacy data. The clock is running.",
    body: [
      { type: 'h2', text: 'What the law actually says' },
      {
        type: 'p',
        text:
          'The Digital Health Act, signed into law in October 2023, established the Digital Health Agency (DHA) as the custodian of all health data in Kenya. It is not a guideline or a recommendation. It is legislation, with criminal penalties for non-compliance.',
      },
      {
        type: 'p',
        text:
          'The 2025 Health Information Management Regulations, gazetted in April 2025, translate the Act into operational requirements. The key obligations for health facilities include:',
      },
      {
        type: 'ul',
        items: [
          'All patient data must be submitted to the DHA in a prescribed digital format.',
          'Institutions already using a digital health system must migrate their legacy data to County Health Data Banks within 24 months of the banks becoming operational.',
          'Health facilities that fail to migrate legacy data commit an offence under the Act.',
          'Digital health solutions used by facilities must be certified by the DHA.',
          'Health data breaches must be reported to the DHA within 48 hours.',
        ],
      },
      {
        type: 'callout',
        tone: 'danger',
        title: '301 facilities have already been downgraded',
        text:
          'for non-compliance with digital health requirements, according to a June 2025 statement from CS Aden Duale. This is not a future consequence — it is happening now.',
      },
      { type: 'h2', text: 'The scale of what\'s being built' },
      {
        type: 'p',
        text:
          'The government is not asking facilities to digitize in isolation. It is building a national health data infrastructure that every facility must plug into. This includes:',
      },
      {
        type: 'ul',
        items: [
          '<strong>Afya Yangu platform:</strong> Enables patient data to be accessed across different health facilities. A patient who visits Aga Khan today and Kenyatta National Hospital next week should have a single, portable health record.',
          '<strong>Comprehensive Integrated Health Information System (CIHIS):</strong> As of June 2025, the CIHIS is operational in 17 counties including Nairobi, Mombasa, and Nandi, with rollout expanding across the country.',
          '<strong>SHA e-claims system:</strong> The Social Health Authority\'s digital claims processing requires that service records be captured in a structured digital format. Facilities still submitting paper-based claims face payment delays.',
          '<strong>Drug track-and-trace:</strong> Every pharmaceutical transaction must be digitally recorded to prevent counterfeit drug distribution and the diversion of publicly funded medicine.',
        ],
      },
      {
        type: 'p',
        text: 'In Mombasa County, the TaifaCare System has digitized 91% of health facilities. The Ministry of Health\'s target is universal coverage — no facility operating on paper.',
      },
      { type: 'h2', text: "The real barrier isn't willingness — it's legacy data" },
      {
        type: 'p',
        text:
          'Most hospital administrators understand that digitization is necessary. The barrier is almost always the same: years of patient records, lab results, OPD forms, and referral letters stored in physical files that need to be converted to structured digital data before they can be uploaded into any system.',
      },
      {
        type: 'p',
        text:
          'A medium-sized facility might have a decade of patient records. A large referral hospital has significantly more. Converting these manually — data entry clerk by data entry clerk — is both expensive and slow. A 400-bed hospital with 200 daily OPD visits accumulates roughly 70,000 paper records a year. Clearing a five-year backlog manually at 4 minutes per document is approximately 9,300 person-hours of work — the equivalent of five full-time employees for an entire year, doing nothing else.',
      },
      {
        type: 'callout',
        tone: 'default',
        title: 'The faster path',
        text:
          'Scan the documents and use AI extraction to convert them to structured data. At 8 seconds per document, that same 350,000-document backlog takes under 800 hours of processing time — and produces clean, structured records ready for upload to the CIHIS.',
      },
      { type: 'h2', text: 'What data the system requires' },
      {
        type: 'p',
        text:
          'The DHA\'s Health Information Management Regulations specify that health data must be submitted in "applicable format" as determined by the Agency. In practice, this means structured, machine-readable data — not scanned PDFs or image files. The specific fields required vary by record type, but for OPD records typically include patient identifier, date of visit, diagnosis (ICD-10 coded), prescriptions, and attending clinician identifier.',
      },
      {
        type: 'p',
        text:
          'This is exactly where most health facilities run into trouble. Their paper records contain all this information — but in inconsistent formats, varying handwriting, different abbreviations, and non-standardized layouts. Getting from a stack of hand-filled OPD forms to ICD-10-coded, structured digital records is not a trivial conversion exercise. It requires intelligent extraction, not just scanning.',
      },
      { type: 'h2', text: 'Private facilities face additional commercial pressure' },
      {
        type: 'p',
        text:
          'Beyond regulatory compliance, private hospitals and clinics face a direct commercial incentive. The Social Health Authority\'s (SHA) reimbursement model — the successor to NHIF — requires digital claims submission with structured, verifiable service records. Facilities that cannot provide this data will face slower reimbursements, claim rejections, or exclusion from the SHA provider network entirely.',
      },
      {
        type: 'p',
        text:
          'The SHA has already eliminated over 3 million fraudulent beneficiary records that were previously listed under NHIF. The direction of travel is towards increasingly strict data verification. Facilities with clean, structured patient records will be rewarded with faster claims processing. Facilities without them will find themselves on the wrong side of every audit.',
      },
      { type: 'h2', text: 'The 24-month window' },
      {
        type: 'p',
        text:
          'The Regulations give facilities 24 months from the operationalization of County Health Data Banks to migrate legacy data. The CIHIS is already live in 17 counties. Facilities in those counties are likely already within their compliance window — or close to entering it.',
      },
      {
        type: 'p',
        text:
          'This is not a comfortable 24 months. The data migration itself takes time. Certifying your digital health solution with DHA takes time. Training staff takes time. And the actual conversion of legacy paper records — the hardest part — has to happen before any of that.',
      },
      {
        type: 'p',
        text:
          'Facilities that start this process now will meet the deadline with time to spare. Facilities that wait until the final year will be scrambling — and facilities that wait until enforcement will face the same fate as the 301 already downgraded.',
      },
      {
        type: 'cta',
        title: 'Digitize your patient records before the deadline',
        text:
          'FormIQ is built for health facilities. Upload lab results, OPD forms, referral letters, and discharge summaries. Get structured data ready for your HMIS in seconds.',
        href: '/register',
        label: 'Start free — 50 documents/month',
      },
    ],
  },
  {
    slug: 'africa-structured-data',
    tag: 'data',
    tagLabel: 'Data & AI',
    title: "Africa's data problem: why structured records are the foundation of every AI future",
    author: 'FormIQ Editorial',
    monthYear: 'March 2026',
    readTime: '9 min read',
    excerpt:
      "Kenya launched its AI Strategy 2025–2030 — but AI needs clean, structured data first.",
    lede:
      "Kenya has launched one of Africa's most ambitious AI strategies, positioning itself as a continental leader in artificial intelligence by 2030. But AI runs on data. Specifically, it runs on clean, structured, machine-readable data. And most of Africa's most critical data — health records, financial transactions, land records, court filings — is still locked inside paper forms sitting in filing cabinets.",
    body: [
      { type: 'h2', text: "Kenya's AI strategy and the data gap it exposes" },
      {
        type: 'p',
        text:
          'On March 27, 2025, Kenya officially launched its National Artificial Intelligence Strategy 2025–2030, becoming one of the first African nations with a structured, government-led AI roadmap. The strategy sets ambitious targets across healthcare, agriculture, financial services, and public administration — positioning Kenya as a regional hub for AI research, development, and commercialization.',
      },
      {
        type: 'p',
        text:
          'The strategy is impressive. But buried within it is an acknowledgement that is rarely discussed openly: Kenya\'s AI ambitions are constrained by a data infrastructure problem. You cannot train machine learning models on data that doesn\'t exist in machine-readable form. You cannot build predictive health systems on patient records stored as physical files in a clinic in Kisumu. You cannot detect patterns in economic activity that has never been captured in a database.',
      },
      {
        type: 'callout',
        tone: 'default',
        title: 'The core tension',
        text:
          'Kenya wants to use AI to improve healthcare outcomes, optimize resource allocation, and detect fraud — but the underlying data that would feed those AI systems is largely unstructured, inaccessible, or non-existent in digital form.',
      },
      { type: 'h2', text: 'What "structured data" actually means — and why it matters' },
      {
        type: 'p',
        text:
          'There is a meaningful difference between having data and having <em>useful</em> data. A scanned image of a lab result is data. A structured record with fields for patient name, test date, test type, result value, reference range, and attending physician — stored in a queryable database — is useful data.',
      },
      {
        type: 'p',
        text:
          'The difference determines almost everything about what you can do with that information:',
      },
      {
        type: 'ul',
        items: [
          '<strong>Unstructured data (a scanned PDF)</strong> can be stored and retrieved, but not searched, aggregated, or analyzed at scale.',
          '<strong>Semi-structured data (text extracted via OCR)</strong> can be searched, but without consistent field labels, it cannot be aggregated meaningfully.',
          '<strong>Structured data (consistent fields in a database)</strong> can be searched, aggregated, cross-referenced, used to train AI models, fed into dashboards, analyzed for trends, and audited for compliance — all automatically.',
        ],
      },
      {
        type: 'p',
        text:
          'Every additional institution that converts its paper records to structured digital data makes the entire national data ecosystem slightly more useful. These effects are not additive — they are multiplicative. A disease surveillance system that has structured records from 100 hospitals is not 10x more useful than one with 10 hospitals — it is potentially 100x more useful, because the patterns only emerge at scale.',
      },
      { type: 'h2', text: 'Healthcare: what structured data makes possible' },
      {
        type: 'p',
        text:
          'Consider what becomes possible when Kenya\'s health system has complete, structured records for the majority of patient interactions across the country:',
      },
      {
        type: 'ul',
        items: [
          '<strong>Disease surveillance:</strong> An outbreak of an unusual respiratory illness in Nakuru can be detected within days, not weeks, by observing patterns in structured OPD records. The difference between 3 days and 3 weeks can be hundreds of lives.',
          '<strong>Drug supply optimization:</strong> Structured prescription data tells KEMSA exactly which drugs are being consumed where, enabling demand-driven supply chain management instead of calendar-based batch ordering.',
          '<strong>Maternal and child health:</strong> Tracking structured antenatal care records identifies which women are at highest risk and haven\'t attended follow-up appointments — enabling targeted outreach rather than blanket campaigns.',
          '<strong>Resource allocation:</strong> A county health department can see, in real time, which facilities are overloaded and which are underutilized — and adjust staffing and resource allocation accordingly.',
          '<strong>Clinical research:</strong> Kenyan researchers can conduct studies using local patient data instead of relying on data from Western populations — producing insights that are actually relevant to Kenyan disease profiles and genetic backgrounds.',
        ],
      },
      {
        type: 'p',
        text:
          'None of these applications require cutting-edge AI. They require structured data at scale. The AI makes the analysis faster and more sophisticated — but the data is the prerequisite.',
      },
      { type: 'h2', text: 'Financial services: the credit invisible problem' },
      {
        type: 'p',
        text:
          'Approximately 70% of Africans lack access to formal credit. A significant reason is that they lack verifiable financial histories — not because they don\'t have financial histories, but because those histories exist as paper receipts, physical passbooks, and handwritten ledgers that no credit-scoring algorithm can read.',
      },
      {
        type: 'p',
        text:
          'SACCOs across Kenya hold enormous amounts of member financial data. Loan applications, repayment records, share accumulation, salary deductions — all of it exists, but typically in paper form or in legacy systems that cannot export structured data. When a member applies for a loan at a commercial bank, the bank cannot verify that SACCO history because it\'s not in a machine-readable format that integrates with credit bureaus.',
      },
      {
        type: 'p',
        text:
          'Digitizing this data — converting member records, loan applications, and transaction histories into structured digital formats — is the first step towards giving millions of Kenyans a verifiable financial identity that works within the formal financial system.',
      },
      { type: 'h2', text: 'Government: from intuition-based to evidence-based policy' },
      {
        type: 'p',
        text:
          'Kenya\'s government makes policy decisions affecting 55 million people. Many of those decisions are made on the basis of surveys, estimates, and partial data — because comprehensive, real-time data simply doesn\'t exist.',
      },
      {
        type: 'p',
        text:
          'The eTIMS system, now fully operational for tax invoicing, is already producing something that didn\'t exist before: a near-complete picture of formal economic activity in Kenya, updated in real time. KRA can now see every invoice issued between businesses, the flow of goods and services across sectors, and the distribution of economic activity across regions — because the invoices that record those transactions are being submitted digitally.',
      },
      {
        type: 'p',
        text:
          'This is transformative for economic policymaking. But it is just one sector. Imagine the same level of structured data visibility applied to land transactions, court proceedings, healthcare utilization, school enrolment and completion rates, and SACCO membership and lending — all the systems where critical decisions are made but data is sparse or inaccessible.',
      },
      {
        type: 'callout',
        tone: 'default',
        title: 'The Digital Health Act\'s data governance ambition',
        text:
          'The Act explicitly designates health data as "a strategic national asset." This is significant language — it signals that the government views structured health data not just as a tool for service delivery, but as an economic and strategic resource in its own right.',
      },
      { type: 'h2', text: 'The AI layer comes after the data layer' },
      {
        type: 'p',
        text:
          'It is tempting to skip straight to AI — to deploy machine learning models and expect them to solve problems. But AI models trained on poor quality, incomplete, or unstructured data produce poor quality, unreliable outputs. In healthcare, that can mean diagnostic errors. In finance, it can mean biased credit decisions. In public policy, it can mean resources allocated based on patterns that reflect the limitations of the data rather than reality.',
      },
      {
        type: 'p',
        text:
          'The organizations and institutions that will benefit most from AI in the next decade are not those that adopt AI tools the fastest. They are those that invest now in the unglamorous work of structuring and cleaning their existing data — converting paper records to structured digital formats, standardizing field names and data types, and building the databases that AI systems will eventually run on.',
      },
      {
        type: 'p',
        text:
          'Kenya\'s AI Strategy 2025–2030 explicitly identifies data infrastructure as a foundational pillar alongside digital infrastructure, talent, and governance. The strategy recognizes that data availability and quality are as important as the AI algorithms themselves. This is the right framing.',
      },
      { type: 'h2', text: 'What this means for institutions today' },
      {
        type: 'p',
        text:
          'For any institution operating in Kenya — a hospital, SACCO, school, or government office — the question is not whether to digitize. The regulatory mandates from eTIMS and the Digital Health Act have already answered that question. The question is whether to digitize reactively, under compliance pressure, with a rushed process that produces messy data — or proactively, with a deliberate process that produces structured, high-quality data that becomes a long-term institutional asset.',
      },
      {
        type: 'p',
        text:
          'The institutions that treat digitization as a compliance checkbox will get compliance. The institutions that treat it as an opportunity to build a clean, structured data foundation will get compliance plus the ability to use that data to make better decisions, qualify for new financial products, access government services more efficiently, and eventually deploy AI tools that actually work.',
      },
      {
        type: 'p',
        text:
          'The data layer is being built right now, across Kenya and across Africa. The question is whether your institution will be part of it — or left trying to catch up when everyone else has already built a five-year head start.',
      },
      {
        type: 'cta',
        title: 'Build your structured data foundation today',
        text:
          'FormIQ converts paper documents — any document type, printed or handwritten — into clean, structured, exportable data. Start with 50 free documents.',
        href: '/register',
        label: 'Start for free →',
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

