/**
 * CampusHub — Firestore Domain Updater
 * ─────────────────────────────────────────────────────────────────────────────
 * Updates all club contact emails in Firestore to use the @nie.ac.in domain.
 *
 * Usage:
 *   node scripts/update-domains.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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
  console.error('❌  Could not read .env file.');
  process.exit(1);
}

const API_KEY    = envVars['VITE_FIREBASE_API_KEY'];
const PROJECT_ID = envVars['VITE_FIREBASE_PROJECT_ID'];

if (!API_KEY || !PROJECT_ID) {
  console.error('❌  Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function updateClubs() {
  console.log('🔍 Fetching clubs...');
  const res = await fetch(`${FIRESTORE_URL}/clubs?key=${API_KEY}`);
  const data = await res.json();

  if (!data.documents) {
    console.log('⚠️ No clubs found.');
    return;
  }

  for (const doc of data.documents) {
    const clubId = doc.name.split('/').pop();
    const fields = doc.fields;
    let updated = false;

    if (fields.contactEmail && fields.contactEmail.stringValue) {
      const oldEmail = fields.contactEmail.stringValue;
      if (oldEmail.endsWith('@campushub.edu')) {
        const newEmail = oldEmail.replace('@campushub.edu', '@nie.ac.in');
        fields.contactEmail.stringValue = newEmail;
        updated = true;
        console.log(`✅ Updating ${clubId}: ${oldEmail} -> ${newEmail}`);
      }
    }

    if (fields.socialLinks && fields.socialLinks.mapValue) {
      const links = fields.socialLinks.mapValue.fields;
      if (links.website && links.website.stringValue) {
        const oldUrl = links.website.stringValue;
        if (oldUrl.includes('campushub.edu')) {
          const newUrl = oldUrl.replace('campushub.edu', 'nie.ac.in');
          links.website.stringValue = newUrl;
          updated = true;
          console.log(`✅ Updating website for ${clubId}: ${oldUrl} -> ${newUrl}`);
        }
      }
    }

    if (updated) {
      await fetch(`${FIRESTORE_URL}/clubs/${clubId}?key=${API_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });
    }
  }
  console.log('✨ All done!');
}

updateClubs().catch(console.error);
