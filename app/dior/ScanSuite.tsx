'use client';

/**
 * VYVRE × DIOR — Suite de scans (le hub de l'app, après l'onboarding).
 * Skin Longevity (existant) + Multi-Zoom + Nutri Skin + Skin Resonance + Scan Hair.
 * Ne touche NI le POC NI le widget.
 */

import { useState } from 'react';
import type { Product } from '@/lib/scan-types';
import DiorScanClient from './DiorScanClient';
import MultiZoomScan from './scans/MultiZoomScan';
import NutriSkin from './scans/NutriSkin';
import SkinResonance from './scans/SkinResonance';
import HairScan from './scans/HairScan';

type Mode = 'hub' | 'skin' | 'multizoom' | 'nutri' | 'resonance' | 'hair';

const SCANS: { id: Mode; tag: string; title: string; desc: string }[] = [
  { id: 'skin', tag: '01 · Signature', title: 'Skin Longevity', desc: 'Diagnostic complet : 8 biomarqueurs, âge cellulaire, score de longévité.' },
  { id: 'multizoom', tag: '02 · Macro', title: 'Multi-Zoom', desc: 'Zoom automatique sur 6 zones du visage. Une macro-photo par zone.' },
  { id: 'nutri', tag: '03 · Nutrition', title: 'Nutri Skin', desc: 'Vos carences lues sur la peau → aliments ciblés & recettes.' },
  { id: 'resonance', tag: '04 · Sensoriel', title: 'Skin Resonance', desc: 'Fréquences sonores accordées à votre peau. Séance de 90 s.' },
  { id: 'hair', tag: '05 · Capillaire', title: 'Scan Hair', desc: 'Densité, brillance, fibre et santé du cuir chevelu.' },
];

export default function ScanSuite({ products }: { products: Product[] }) {
  const [mode, setMode] = useState<Mode>('hub');
  const back = () => setMode('hub');

  if (mode === 'skin') return <DiorScanClient products={products} onBack={back} />;
  if (mode === 'multizoom') return <MultiZoomScan onBack={back} />;
  if (mode === 'nutri') return <NutriSkin onBack={back} />;
  if (mode === 'resonance') return <SkinResonance onBack={back} />;
  if (mode === 'hair') return <HairScan onBack={back} />;

  return (
    <div className="dior-app scan-module scrollable">
      <div className="ambient-light" />
      <header className="dior-header">
        <div className="brand">
          <div className="brand-logo">
            <span style={{ fontWeight: 100, fontSize: 14 }}>V</span>
          </div>
          <span className="brand-vyvre">VYVRE</span>
          <span className="brand-x">×</span>
          <span className="brand-partner">DIOR</span>
        </div>
        <div className="label-sm">Ateliers DIOR · Accès AI</div>
      </header>

      <div className="hub-wrap">
        <div className="label-sm" style={{ textAlign: 'center', marginBottom: 18 }}>
          Suite d&apos;analyse · 5 protocoles
        </div>
        <h1 className="hub-title">
          Votre laboratoire <em>de la peau</em>.
        </h1>
        <p className="hub-sub">Choisissez votre protocole. Chaque scan tourne en local, sur votre appareil.</p>

        <div className="hub-grid">
          {SCANS.map((s) => (
            <button key={s.id} className="hub-card" onClick={() => setMode(s.id)}>
              <span className="hub-card-tag">{s.tag}</span>
              <h3 className="hub-card-title">{s.title}</h3>
              <p className="hub-card-desc">{s.desc}</p>
              <span className="hub-card-cta">Lancer →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
