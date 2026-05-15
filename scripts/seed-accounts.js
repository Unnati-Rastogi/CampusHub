/**
 * CampusHub — Test Account Seeder
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates two Firebase Auth accounts and their Firestore user profiles:
 *
 *   Role            │ Email                    │ Password
 *   ────────────────┼──────────────────────────┼──────────────
 *   Club Rep        │ rep@nie.ac.in             │ campus123
 *   Authority/Head  │ admin@nie.ac.in           │ campus123
 *
 * Usage:
 *   node scripts/seed-accounts.js
 *
 * Requirements:
 *   • .env configured with your Firebase keys
 *   • Firebase Authentication must have Email/Password enabled
 *   • Firestore must be created (test mode is fine)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── 1. Load .env manually (no dotenv needed) ─────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = resolve(__dirname, '../.env');

let envVars = {};
try {
  const raw = readFileSync(envPath, 'utf-8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key   = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
} catch {
  console.error('❌  Could not read .env file. Make sure it exists at the project root.');
  process.exit(1);
}

const API_KEY    = envVars['VITE_FIREBASE_API_KEY'];
const PROJECT_ID = envVars['VITE_FIREBASE_PROJECT_ID'];

if (!API_KEY || !PROJECT_ID) {
  console.error('❌  Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

// ── 2. Firebase REST API helpers ─────────────────────────────────────────────
const AUTH_URL      = `https://identitytoolkit.googleapis.com/v1`;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function signUp(email, password, displayName) {
  const res = await fetch(`${AUTH_URL}/accounts:signUp?key=${API_KEY}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  // Update display name
  await fetch(`${AUTH_URL}/accounts:update?key=${API_KEY}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ idToken: data.idToken, displayName, returnSecureToken: false }),
  });

  return { uid: data.localId, idToken: data.idToken };
}

async function setFirestoreDoc(uid, idToken, fields) {
  const fieldMask = Object.keys(fields).join(',');
  const url = `${FIRESTORE_URL}/users/${uid}?updateMask.fieldPaths=${encodeURIComponent(fieldMask)}`;

  const firestoreFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === null)             firestoreFields[k] = { nullValue: null };
    else if (typeof v === 'boolean') firestoreFields[k] = { booleanValue: v };
    else                        firestoreFields[k] = { stringValue: String(v) };
  }

  const res = await fetch(url, {
    method:  'PATCH',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ fields: firestoreFields }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Firestore: ${data.error.message}`);
  return data;
}

// ── 3. Accounts to create ────────────────────────────────────────────────────
const ACCOUNTS = [
  {
    email:       'rep@nie.ac.in',
    password:    'campus123',
    displayName: 'Club Representative',
    role:        'club_rep',
    label:       'Club Representative',
  },
  {
    email:       'admin@nie.ac.in',
    password:    'campus123',
    displayName: 'Campus Authority',
    role:        'authority',
    label:       'Authority / Head',
  },
];

// ── 4. Run ───────────────────────────────────────────────────────────────────
console.log('\n🌱  CampusHub — Test Account Seeder');
console.log('────────────────────────────────────────');
console.log(`   Project: ${PROJECT_ID}\n`);

let created = 0;
let skipped = 0;
let errors  = 0;
const results = [];

for (const account of ACCOUNTS) {
  process.stdout.write(`   [${account.label}] ${account.email}\n`);

  // Step 1: Create Auth user
  let uid, idToken;
  process.stdout.write('     → Creating Auth account … ');
  try {
    ({ uid, idToken } = await signUp(account.email, account.password, account.displayName));
    console.log(`✅  uid: ${uid}`);
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS') {
      console.log('⚠️   Already exists — will skip Firestore write');
      skipped++;
      results.push({ ...account, status: 'skipped' });
      console.log('');
      continue;
    }
    console.log(`❌  ${err.message}`);
    errors++;
    results.push({ ...account, status: 'error', error: err.message });
    console.log('');
    continue;
  }

  // Step 2: Write Firestore profile
  process.stdout.write('     → Writing Firestore profile … ');
  try {
    await setFirestoreDoc(uid, idToken, {
      email:       account.email,
      displayName: account.displayName,
      role:        account.role,
      clubId:      'null',   // stored as string null placeholder
    });
    console.log('✅  Done');
    created++;
    results.push({ ...account, uid, status: 'created' });
  } catch (err) {
    console.log(`⚠️   ${err.message}`);
    console.log('     ℹ️   Auth account was created. Set role in Firestore manually.');
    console.log(`          Collection: users / Document: ${uid}`);
    console.log(`          Fields: { role: "${account.role}", email: "${account.email}", displayName: "${account.displayName}" }`);
    created++; // Auth was created
    results.push({ ...account, uid, status: 'auth-only', error: err.message });
  }
  console.log('');
}

// ── 5. Summary ───────────────────────────────────────────────────────────────
console.log('────────────────────────────────────────');
console.log(`   ✅ Created: ${created}   ⚠️  Skipped: ${skipped}   ❌ Errors: ${errors}`);
console.log('\n   Test credentials:');
console.log('   ┌────────────────────────────────────────────────────┐');
console.log('   │  Role          Email                  Password     │');
console.log('   │  ────────────  ─────────────────────  ──────────── │');
console.log('   │  Club Rep      rep@nie.ac.in           campus123   │');
console.log('   │  Authority     admin@nie.ac.in         campus123   │');
console.log('   └────────────────────────────────────────────────────┘');

// Show manual Firestore steps if needed
const authOnly = results.filter(r => r.status === 'auth-only');
if (authOnly.length > 0) {
  console.log('\n   ⚠️  Firestore REST API is disabled for this project.');
  console.log('   Complete these steps to enable it:\n');
  console.log('   1. Go to: https://console.firebase.google.com/project/' + PROJECT_ID + '/firestore');
  console.log('   2. Create a Firestore database (if not already done — choose "test mode")');
  console.log('   3. Re-run this script: node scripts/seed-accounts.js\n');
  console.log('   OR set the user documents manually in Firebase Console:');
  for (const r of authOnly) {
    console.log(`\n      ${r.label} (uid: ${r.uid})`);
    console.log(`      Firestore → users → ${r.uid}`);
    console.log(`      { role: "${r.role}", email: "${r.email}", displayName: "${r.displayName}", clubId: null }`);
  }
}

console.log('\n   👉  Login at http://localhost:5173/login\n');
