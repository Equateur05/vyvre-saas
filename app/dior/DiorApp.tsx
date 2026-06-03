'use client';

/**
 * VYVRE × DIOR — Wrapper de l'app : onboarding (compte + quiz) PUIS scan.
 * Si l'utilisateur a déjà fait l'onboarding (localStorage), on va direct au scan.
 */

import { useEffect, useState } from 'react';
import Onboarding from './Onboarding';
import ScanSuite from './ScanSuite';
import ThemeToggle from './ThemeToggle';
import type { Product } from '@/lib/scan-types';

export default function DiorApp({ products }: { products: Product[] }) {
  const [onboarded, setOnboarded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('vyvre_profile')) setOnboarded(true);
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  return (
    <>
      {onboarded ? <ScanSuite products={products} /> : <Onboarding onComplete={() => setOnboarded(true)} />}
      <ThemeToggle />
    </>
  );
}
