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

const clubData = {
  fields: {
    id: { stringValue: 'issa-nie' },
    name: { stringValue: 'ISSA NIE' },
    slug: { stringValue: 'issa-nie' },
    tagline: { stringValue: 'Empowering Cyber Minds, Forging Secure Futures: ISSA NIE Student Chapter' },
    description: { stringValue: 'ISSA NIE is a student chapter focused on cybersecurity, networking, and digital forensics. We aim to empower students with the knowledge and skills needed to forge secure futures.' },
    logo: { stringValue: 'https://api.dicebear.com/7.x/shapes/svg?seed=issa&backgroundColor=0d9488' },
    banner: { stringValue: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop' },
    tags: { arrayValue: { values: [{ stringValue: 'Coding' }, { stringValue: 'Hackathon' }] } },
    facultyCoordinator: { stringValue: 'Dr. Cyber Sec' },
    president: { 
      mapValue: { 
        fields: {
          name: { stringValue: 'DEENA KIRAN M K' },
          department: { stringValue: 'ISE' },
          year: { stringValue: '3rd Year' }
        } 
      } 
    },
    contactEmail: { stringValue: 'issa@nie.ac.in' },
    memberCount: { integerValue: '232' },
    foundedYear: { integerValue: '2023' },
    socialLinks: { 
      mapValue: { 
        fields: { 
          instagram: { stringValue: 'https://instagram.com/issa_nie' } 
        } 
      } 
    },
    recentActivities: { arrayValue: { values: [] } }
  }
};

async function addIssaClub() {
  console.log('🔍 Adding ISSA NIE club...');
  const res = await fetch(`${FIRESTORE_URL}/clubs?documentId=issa-nie&key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clubData)
  });
  
  if (res.ok) {
    console.log('✅ ISSA NIE added successfully!');
  } else {
    // If it already exists, patch it
    if (res.status === 409) {
      console.log('⚠️ Club already exists, updating it...');
      const patchRes = await fetch(`${FIRESTORE_URL}/clubs/issa-nie?key=${API_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clubData)
      });
      if (patchRes.ok) {
        console.log('✅ ISSA NIE updated successfully!');
      } else {
        const errorText = await patchRes.text();
        console.error('❌ Failed to update:', errorText);
      }
    } else {
      const errorText = await res.text();
      console.error('❌ Failed to add:', errorText);
    }
  }
}

addIssaClub().catch(console.error);
