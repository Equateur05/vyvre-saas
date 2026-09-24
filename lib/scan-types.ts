/**
 * VYVRE — Types partagés pour le moteur de scan et le matching produits.
 *
 * Le moteur `window.VYVRE_SCAN_ENGINE` (public/engine/vyvre-scan-engine.js) n'est
 * pas typé : on le décrit ici de façon souple via `declare global`.
 */

export interface ScanScores {
  hydration: number;
  wrinkles: number;
  glow: number;
  redness: number;
  pores: number;
  sebum: number;
  pigmentation: number;
  firmness: number;
  quality?: number;
  /**
   * v11.1 — contrat d'affichage de l'âge. Le moteur décide seul s'il est lisible.
   * Aucune UI ne doit recalculer un âge dans son coin : on lit `ageDisplay`
   * quand `ageReadable` vaut true, sinon on n'affiche pas de chiffre.
   */
  ageReadable?: boolean;
  /** fourchette prête à afficher, ex. « 32–41 ans » ; null quand l'image ne permet pas de la lire */
  ageDisplay?: string | null;
  ageClass?: string;
  ageClassLabel?: string;
  ageClassHint?: string;
  /** âge ponctuel — null quand le moteur refuse. Ne pas afficher seul. */
  cellAge?: number | null;
  cellAgeRange?: [number, number] | null;
  cellAgeMethod?: string;
  confidence?: number;
  // le moteur peut ajouter d'autres clés (perceivedAge, globalScore…)
  [key: string]: number | string | boolean | null | undefined | [number, number];
}

export interface ClinicalConditions {
  acne?: number;
  rosacea?: number;
  melasma?: number;
  lentigos?: number;
  [key: string]: number | undefined;
}

export interface ScanRaw {
  L?: number;
  a?: number;
  b?: number;
  ita?: number;
  fitz?: string;
  MI?: number;
  EI?: number;
  sebum?: number;
  tewl?: number;
  avgRed?: number;
  avgGreen?: number;
  avgLum?: number;
  [key: string]: number | string | undefined;
}

export interface ScanResult {
  scores: ScanScores;
  raw?: ScanRaw;
  clinical?: ClinicalConditions;
  framesAccepted?: number;
  framesAttempted?: number;
  source?: string;
  _scanMode?: string;
}

export interface Product {
  id: string;
  brand_id?: string;
  name: string;
  image_url?: string | null;
  url?: string | null;
  price_eur?: number | null;
  currency?: string | null;
  targets?: string[] | null;
  concern_scores?: Record<string, number> | null;
  position?: number | null;
  /** ajouté par matchProducts() */
  matchScore?: number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VYVRE_SCAN_ENGINE?: any;
    VYVRE_CNN_MODEL_URL?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VYVRE_LOADER?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    faceapi?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vyvreLastScanResult?: ScanResult | null;
  }
}

export {};
