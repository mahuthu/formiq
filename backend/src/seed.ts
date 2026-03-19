import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_TEMPLATES = [
  {
    name: 'Invoice',
    documentType: 'Invoice / Bill',
    description: 'Standard business invoices and bills',
    fields: [
      { name: 'Invoice Number', type: 'TEXT', required: true },
      { name: 'Invoice Date', type: 'DATE', required: true },
      { name: 'Due Date', type: 'DATE' },
      { name: 'Vendor Name', type: 'TEXT', required: true },
      { name: 'Vendor Address', type: 'TEXT' },
      { name: 'Vendor Phone', type: 'PHONE' },
      { name: 'Client Name', type: 'TEXT', required: true },
      { name: 'Client Address', type: 'TEXT' },
      { name: 'Line Items', type: 'TEXT', description: 'List of items/services billed' },
      { name: 'Subtotal', type: 'CURRENCY' },
      { name: 'Tax Amount', type: 'CURRENCY' },
      { name: 'Total Amount', type: 'CURRENCY', required: true },
      { name: 'Currency', type: 'TEXT' },
      { name: 'Payment Terms', type: 'TEXT' },
      { name: 'PO Number', type: 'TEXT' },
      { name: 'Bank Details', type: 'TEXT' },
    ],
  },
  {
    name: 'Lab Result',
    documentType: 'Medical Laboratory Result',
    description: 'Hospital and clinic lab test results',
    fields: [
      { name: 'Patient Name', type: 'TEXT', required: true },
      { name: 'Patient ID', type: 'TEXT' },
      { name: 'Date of Birth', type: 'DATE' },
      { name: 'Gender', type: 'TEXT' },
      { name: 'Test Date', type: 'DATE', required: true },
      { name: 'Ordering Physician', type: 'TEXT' },
      { name: 'Lab Name', type: 'TEXT' },
      { name: 'Accession Number', type: 'TEXT' },
      { name: 'Test Name', type: 'TEXT', required: true },
      { name: 'Result Value', type: 'TEXT', required: true },
      { name: 'Reference Range', type: 'TEXT' },
      { name: 'Units', type: 'TEXT' },
      { name: 'Interpretation', type: 'TEXT', description: 'Normal / Abnormal / Critical' },
      { name: 'Specimen Type', type: 'TEXT' },
      { name: 'Report Date', type: 'DATE' },
      { name: 'Comments', type: 'TEXT' },
    ],
  },
  {
    name: 'KYC / ID Document',
    documentType: 'Identity Document',
    description: 'National ID, passport, driving licence',
    fields: [
      { name: 'Full Name', type: 'TEXT', required: true },
      { name: 'ID Number', type: 'TEXT', required: true },
      { name: 'Date of Birth', type: 'DATE', required: true },
      { name: 'Gender', type: 'TEXT' },
      { name: 'Nationality', type: 'TEXT' },
      { name: 'ID Type', type: 'TEXT', description: 'National ID / Passport / Driving Licence' },
      { name: 'Issue Date', type: 'DATE' },
      { name: 'Expiry Date', type: 'DATE' },
      { name: 'Issuing Country', type: 'TEXT' },
      { name: 'Issuing Authority', type: 'TEXT' },
      { name: 'Address', type: 'TEXT' },
      { name: 'Place of Birth', type: 'TEXT' },
    ],
  },
  {
    name: 'CV / Resume',
    documentType: 'Curriculum Vitae',
    description: 'Job applications and resumes',
    fields: [
      { name: 'Full Name', type: 'TEXT', required: true },
      { name: 'Email', type: 'EMAIL' },
      { name: 'Phone', type: 'PHONE' },
      { name: 'Address', type: 'TEXT' },
      { name: 'LinkedIn / Website', type: 'TEXT' },
      { name: 'Objective / Summary', type: 'TEXT' },
      { name: 'Education', type: 'TEXT' },
      { name: 'Work Experience', type: 'TEXT', required: true },
      { name: 'Skills', type: 'TEXT' },
      { name: 'Languages', type: 'TEXT' },
      { name: 'Certifications', type: 'TEXT' },
      { name: 'References', type: 'TEXT' },
    ],
  },
  {
    name: 'Medical / OPD Form',
    documentType: 'Medical Patient Form',
    description: 'Outpatient, admission, and medical forms',
    fields: [
      { name: 'Patient Name', type: 'TEXT', required: true },
      { name: 'Patient ID', type: 'TEXT' },
      { name: 'Date of Birth', type: 'DATE' },
      { name: 'Gender', type: 'TEXT' },
      { name: 'Visit Date', type: 'DATE', required: true },
      { name: 'Chief Complaint', type: 'TEXT' },
      { name: 'Diagnosis', type: 'TEXT' },
      { name: 'Blood Pressure', type: 'TEXT' },
      { name: 'Temperature', type: 'TEXT' },
      { name: 'Weight (kg)', type: 'NUMBER' },
      { name: 'Height (cm)', type: 'NUMBER' },
      { name: 'Medications Prescribed', type: 'TEXT' },
      { name: 'Allergies', type: 'TEXT' },
      { name: 'Doctor Name', type: 'TEXT' },
      { name: 'Follow-up Date', type: 'DATE' },
      { name: 'Notes', type: 'TEXT' },
    ],
  },
  {
    name: 'Certificate',
    documentType: 'Certificate / Award',
    description: 'Academic, professional, or training certificates',
    fields: [
      { name: 'Certificate Type', type: 'TEXT', required: true },
      { name: 'Recipient Name', type: 'TEXT', required: true },
      { name: 'Issuing Institution', type: 'TEXT', required: true },
      { name: 'Issue Date', type: 'DATE', required: true },
      { name: 'Expiry Date', type: 'DATE' },
      { name: 'Certificate Number', type: 'TEXT' },
      { name: 'Course / Program', type: 'TEXT' },
      { name: 'Grade / Score', type: 'TEXT' },
      { name: 'Signatory Name', type: 'TEXT' },
      { name: 'Signatory Title', type: 'TEXT' },
      { name: 'Verification URL', type: 'TEXT' },
    ],
  },
  {
    name: 'School Admission Form',
    documentType: 'Student Admission Form',
    description: 'School and university admission applications',
    fields: [
      { name: 'Student Name', type: 'TEXT', required: true },
      { name: 'Date of Birth', type: 'DATE', required: true },
      { name: 'Gender', type: 'TEXT' },
      { name: 'Nationality', type: 'TEXT' },
      { name: 'Parent / Guardian Name', type: 'TEXT', required: true },
      { name: 'Parent Phone', type: 'PHONE' },
      { name: 'Parent Email', type: 'EMAIL' },
      { name: 'Home Address', type: 'TEXT' },
      { name: 'Previous School', type: 'TEXT' },
      { name: 'Grade / Form Applying', type: 'TEXT' },
      { name: 'Entry Date', type: 'DATE' },
      { name: 'Medical Conditions', type: 'TEXT' },
      { name: 'Documents Submitted', type: 'TEXT' },
    ],
  },
  {
    name: 'Business / General Form',
    documentType: 'General Business Document',
    description: 'Purchase orders, delivery notes, receipts, general forms',
    fields: [
      { name: 'Company Name', type: 'TEXT', required: true },
      { name: 'Registration Number', type: 'TEXT' },
      { name: 'Document Date', type: 'DATE', required: true },
      { name: 'Reference Number', type: 'TEXT' },
      { name: 'Contact Person', type: 'TEXT' },
      { name: 'Email', type: 'EMAIL' },
      { name: 'Phone', type: 'PHONE' },
      { name: 'Address', type: 'TEXT' },
      { name: 'Description', type: 'TEXT' },
      { name: 'Amount', type: 'CURRENCY' },
      { name: 'Authorized By', type: 'TEXT' },
      { name: 'Stamp / Seal Present', type: 'BOOLEAN' },
    ],
  },
];

async function seed() {
  console.log('Seeding system templates...');

  for (const tpl of SYSTEM_TEMPLATES) {
    await prisma.template.upsert({
      where: { id: `system-${tpl.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: { fields: tpl.fields as any },
      create: {
        id: `system-${tpl.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: tpl.name,
        documentType: tpl.documentType,
        description: tpl.description,
        fields: tpl.fields as any,
        isSystem: true,
      },
    });
    console.log(`  ✓ ${tpl.name}`);
  }

  console.log('✅ Seed complete');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
