#!/usr/bin/env node
/**
 * VYVRE — Upload POCs to Supabase Storage
 *
 * Migration Firebase Hosting → Supabase Storage (bucket public "vyvre-demos").
 * Firebase reste actif en backup — pas de suppression.
 *
 * Usage :
 *   cd /Users/charles/Documents/vyvre/saas
 *   npm install   # si pas encore fait
 *   # Fill .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   node scripts/upload-pocs-to-storage.mjs
 *
 * Le script :
 * 1. Crée le bucket "vyvre-demos" public si pas existant
 * 2. Upload tous les .html depuis /docs/pocs/dist/ avec Content-Type=text/html
 * 3. Idempotent : skip si fichier déjà identique (via hash size)
 * 4. Affiche les URLs publiques générées
 * 5. Test HEAD sur 3 URLs (Vinothérapie, Sisley, Chanel)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { config } from 'dotenv';

// Load .env.local
config({ path: new URL('../.env.local', import.meta.url).pathname });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Missing env vars in .env.local :');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxx (PAS l\'anon key)');
  console.error('\nRécupère-les sur https://supabase.com/dashboard/project/<projet>/settings/api');
  process.exit(1);
}

const BUCKET = 'vyvre-demos';
const DIST_DIR = new URL('../../docs/pocs/dist/', import.meta.url).pathname;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureBucket() {
  console.log(`\n📦 Vérification du bucket "${BUCKET}"...`);
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) {
    console.log(`   ✓ Bucket "${BUCKET}" existe déjà`);
    return;
  }

  console.log(`   + Création du bucket "${BUCKET}" en mode public...`);
  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: '5MB',
    allowedMimeTypes: ['text/html', 'text/css', 'application/javascript', 'image/png', 'image/jpeg', 'image/svg+xml'],
  });
  if (createErr) throw createErr;
  console.log(`   ✓ Bucket créé`);
}

async function uploadFile(filename, fullPath) {
  const buffer = readFileSync(fullPath);
  const size = buffer.byteLength;

  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: 'text/html; charset=utf-8',
    cacheControl: '300',  // 5 min cache
    upsert: true,  // overwrite if exists
  });

  if (error) {
    console.log(`   ❌ ${filename}  (${size} bytes) — ${error.message}`);
    return { filename, success: false, error: error.message };
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  console.log(`   ✓ ${filename}  (${size} bytes)`);
  return { filename, success: true, url: publicUrl, size };
}

async function uploadAll() {
  console.log(`\n📤 Upload depuis ${DIST_DIR}`);
  const files = readdirSync(DIST_DIR).filter((f) => f.endsWith('.html'));
  console.log(`   Found ${files.length} HTML files\n`);

  const results = [];
  for (const f of files) {
    const fullPath = join(DIST_DIR, f);
    if (statSync(fullPath).isDirectory()) continue;
    const r = await uploadFile(f, fullPath);
    results.push(r);
  }
  return results;
}

async function verifyHttp(urls) {
  console.log(`\n🔍 Vérification HTTP 200 + Content-Type sur 3 URLs pilotes...`);
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const ct = res.headers.get('content-type') || '(none)';
      const ok = res.status === 200 && ct.includes('text/html');
      console.log(`   ${ok ? '✓' : '⚠'} ${res.status} · ${ct} · ${url.replace(SUPABASE_URL, '')}`);
    } catch (err) {
      console.log(`   ❌ FAIL ${url} — ${err.message}`);
    }
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  VYVRE — POCs migration to Supabase Storage');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Project URL : ${SUPABASE_URL}`);

  await ensureBucket();

  const results = await uploadAll();
  const ok = results.filter((r) => r.success);
  const ko = results.filter((r) => !r.success);

  console.log(`\n═══ Bilan ═══`);
  console.log(`✓ Uploaded : ${ok.length}`);
  console.log(`❌ Failed  : ${ko.length}`);

  if (ko.length > 0) {
    console.log(`\nFailed files:`);
    ko.forEach((r) => console.log(`  · ${r.filename} — ${r.error}`));
  }

  // Test the 3 priority POCs
  const priorityFiles = ['SCAN_LIVE_DEMO_VINOTHERAPIE.html', 'VYVRE_SISLEY.html', 'VYVRE_CHANEL.html'];
  const priorityUrls = ok.filter((r) => priorityFiles.includes(r.filename)).map((r) => r.url);
  await verifyHttp(priorityUrls);

  // Print canonical URL list
  console.log(`\n═══ URLs canoniques Supabase ═══`);
  console.log(`Base: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/\n`);
  ok.slice(0, 5).forEach((r) => console.log(`  ${r.url}`));
  if (ok.length > 5) console.log(`  ... (+${ok.length - 5} autres)`);

  console.log(`\n═══ Backup Firebase (reste actif) ═══`);
  console.log(`Base: https://vyvre-demos.web.app/\n`);

  console.log(`\n✅ Migration terminée.`);
  console.log(`Tu peux maintenant updater les emails prospection avec ces URLs Supabase.\n`);
}

main().catch((err) => {
  console.error('\n❌ Fatal:', err);
  process.exit(1);
});
