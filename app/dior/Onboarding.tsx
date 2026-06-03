'use client';

/**
 * VYVRE × DIOR — Onboarding (intro de l'app, AVANT le scan).
 *
 * 1) Création de compte (email + mot de passe via Supabase Auth) — optionnel (skip).
 * 2) Quiz 4 questions repris du protocole : peau / âge / priorité / intention.
 *
 * À la fin : sauvegarde le profil en localStorage (lu par le scan / protocole) et,
 * si l'utilisateur est connecté, dans ses user_metadata Supabase. Puis onComplete().
 */

import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import './dior-scan.css';

export interface OnboardingProfile {
  skin?: string;
  ageRange?: string;
  priority?: string;
  intention?: string;
  email?: string | null;
}

interface QuizStep {
  key: keyof OnboardingProfile;
  question: React.ReactNode;
  options: { value: string; num: string; label: string }[];
}

const QUIZ: QuizStep[] = [
  {
    key: 'skin',
    question: (
      <>
        Votre <em>peau</em>.
      </>
    ),
    options: [
      { value: 'sèche', num: '01', label: 'Sèche' },
      { value: 'normale', num: '02', label: 'Normale' },
      { value: 'mixte', num: '03', label: 'Mixte' },
      { value: 'grasse', num: '04', label: 'Grasse' },
    ],
  },
  {
    key: 'ageRange',
    question: (
      <>
        Votre <em>âge</em>.
      </>
    ),
    options: [
      { value: '20-30', num: 'A', label: '20 – 30' },
      { value: '30-40', num: 'B', label: '30 – 40' },
      { value: '40-50', num: 'C', label: '40 – 50' },
      { value: '50+', num: 'D', label: '50 +' },
    ],
  },
  {
    key: 'priority',
    question: (
      <>
        Votre <em>priorité</em>.
      </>
    ),
    options: [
      { value: 'anti-age', num: 'I', label: 'Anti-âge' },
      { value: 'hydratation', num: 'II', label: 'Hydratation' },
      { value: 'eclat', num: 'III', label: 'Éclat' },
      { value: 'taches', num: 'IV', label: 'Taches' },
    ],
  },
  {
    key: 'intention',
    question: (
      <>
        Votre <em>intention</em>.
      </>
    ),
    options: [
      { value: 'prevention', num: 'α', label: 'Prévention' },
      { value: 'reparation', num: 'β', label: 'Réparation' },
      { value: 'lifting', num: 'γ', label: 'Lifting' },
      { value: 'confort', num: 'δ', label: 'Confort' },
    ],
  },
];

type Stage = 'account' | 'quiz';

export default function Onboarding({ onComplete }: { onComplete: (p: OnboardingProfile) => void }) {
  const [stage, setStage] = useState<Stage>('account');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'info'; text: string } | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingProfile>({});

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!email || !password) {
      setMsg({ type: 'error', text: 'Email et mot de passe requis.' });
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setMsg({ type: 'error', text: 'Mot de passe : 6 caractères minimum.' });
      return;
    }
    setBusy(true);
    try {
      const supa = getSupabaseBrowser();
      if (mode === 'signup') {
        const { data, error } = await supa.auth.signUp({ email, password });
        if (error) throw error;
        setAccountEmail(email);
        if (data.session) {
          setStage('quiz'); // session active → on enchaîne
        } else {
          // confirmation email requise : on informe mais on laisse continuer
          setMsg({ type: 'info', text: 'Compte créé ✓ Vérifiez votre email pour confirmer. Vous pouvez continuer.' });
          setTimeout(() => setStage('quiz'), 1400);
        }
      } else {
        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAccountEmail(email);
        setStage('quiz');
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setMsg({ type: 'error', text });
    } finally {
      setBusy(false);
    }
  }

  function selectOption(value: string) {
    const k = QUIZ[step].key;
    const next = { ...answers, [k]: value };
    setAnswers(next);
    // avancement synchrone et fiable (pas de setTimeout qui pouvait perdre des clics)
    if (step < QUIZ.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish(next);
    }
  }

  async function finish(profile: OnboardingProfile) {
    const full: OnboardingProfile = { ...profile, email: accountEmail };
    try {
      localStorage.setItem('vyvre_profile', JSON.stringify(full));
      localStorage.setItem('vyvre_onboarded_ts', String(Date.now()));
    } catch {
      /* private mode */
    }
    // persiste dans les user_metadata si connecté
    try {
      const supa = getSupabaseBrowser();
      const { data } = await supa.auth.getSession();
      if (data.session) await supa.auth.updateUser({ data: full });
    } catch {
      /* noop */
    }
    onComplete(full);
  }

  return (
    <div className="dior-app dior-onboarding">
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

      {stage === 'account' && (
        <div className="ob-wrap">
          <div className="label-sm" style={{ marginBottom: 22 }}>
            {mode === 'signup' ? 'Étape 00 · Votre accès' : 'Connexion'}
          </div>
          <h2 className="ob-title">
            {mode === 'signup' ? (
              <>
                Créez votre <em>compte</em>.
              </>
            ) : (
              <>
                Bon retour <em>parmi nous</em>.
              </>
            )}
          </h2>
          <p className="ob-sub">
            Sauvegardez votre diagnostic, suivez l&apos;évolution de votre peau et retrouvez votre protocole personnalisé.
          </p>

          <form className="ob-form" onSubmit={handleAuth}>
            <input
              className="ob-input"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="ob-input"
              type="password"
              placeholder="Mot de passe"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {msg && <div className={`ob-msg ob-msg-${msg.type}`}>{msg.text}</div>}
            <button className="spatial-btn ob-primary" type="submit" disabled={busy}>
              {busy ? '…' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </form>

          <div className="ob-links">
            <button
              className="ob-textlink"
              type="button"
              onClick={() => {
                setMsg(null);
                setMode(mode === 'signup' ? 'login' : 'signup');
              }}
            >
              {mode === 'signup' ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer'}
            </button>
            <button className="ob-textlink ob-skip" type="button" onClick={() => setStage('quiz')}>
              Passer cette étape →
            </button>
          </div>
        </div>
      )}

      {stage === 'quiz' && (
        <div className="ob-wrap">
          <div className="ob-progress">
            {QUIZ.map((_, i) => (
              <div key={i} className={`ob-pill${i <= step ? ' active' : ''}`} />
            ))}
          </div>
          <div className="ob-step-index">
            <span>
              0{step + 1} / 0{QUIZ.length}
            </span>
          </div>
          <h2 className="ob-title ob-question">{QUIZ[step].question}</h2>
          <div className="ob-options">
            {QUIZ[step].options.map((opt) => {
              const selected = answers[QUIZ[step].key] === opt.value;
              return (
                <button
                  key={opt.value}
                  className={`ob-chip${selected ? ' selected' : ''}`}
                  type="button"
                  onClick={() => selectOption(opt.value)}
                >
                  <span className="ob-chip-num">{opt.num}</span>
                  <span className="ob-chip-label">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <div className="ob-links">
            {step > 0 ? (
              <button className="ob-textlink" type="button" onClick={() => setStep(step - 1)}>
                ← Précédent
              </button>
            ) : (
              <span />
            )}
            <button className="ob-textlink ob-skip" type="button" onClick={() => finish(answers)}>
              Passer →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
