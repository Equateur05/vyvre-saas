'use client';

/**
 * VYVRE × DIOR — App de scan (porté du POC DIOR V3).
 *
 * Flow : hero → scanner (face-api + lidar) → process (lattice 3D) → results.
 * Le moteur réel est `window.VYVRE_SCAN_ENGINE` (chargé via <Script> dans page.tsx).
 * Les produits Dior sont passés en prop (fetch server-side Supabase), avec
 * fallback fetch('/api/products?brand=dior') puis fallback hardcodé du markup.
 */

import { useEffect, useRef } from 'react';
import { matchProducts, CONCERN_LABELS } from '@/lib/product-matching';
import type { Product, ScanResult, ScanScores } from '@/lib/scan-types';
import './dior-scan.css';

interface Props {
  products: Product[];
  onBack?: () => void;
}

export default function DiorScanClient({ products, onBack }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const capturedImgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const epiCanvasRef = useRef<HTMLCanvasElement>(null);
  const productsRef = useRef<Product[]>(products);
  productsRef.current = products;

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const epiCanvas = epiCanvasRef.current;
    if (!root || !video || !overlay || !epiCanvas) return;

    const q = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector(sel) as T | null;

    const ctxO = overlay.getContext('2d')!;
    const eCtx = epiCanvas.getContext('2d')!;
    const videoContainer = q('#thermal-vid-container')!;
    const depthUI = q('#depth-ui')!;

    // ── État local (équivalent du STATE global du POC) ──
    const STATE: {
      modelsLoaded: boolean;
      scanning: boolean;
      thermalMode: boolean;
      box: { x: number; y: number; width: number; height: number } | null;
      landmarks: { x: number; y: number }[] | null;
      stream: MediaStream | null;
    } = { modelsLoaded: false, scanning: false, thermalMode: false, box: null, landmarks: null, stream: null };

    let calibFrames = 0;
    let consecutiveDetections = 0;
    let lastAtlasCaptureMs = 0;
    let computationActive = false;
    let dashboardShown = false;
    let disposed = false;
    let lidarStart: number | null = null;
    const intervals: ReturnType<typeof setInterval>[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const faceBoxHistory: { x: number; y: number; width: number; height: number; t: number }[] = [];
    let lastScanResult: ScanResult | null = null;

    const setTO = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const setText = (sel: string, txt: string) => {
      const el = q(sel);
      if (el) el.textContent = txt;
    };

    // ── View controller (scopé à .dior-app) ──
    function switchView(viewId: string) {
      root!.querySelectorAll('.view-state').forEach((el) => el.classList.remove('active'));
      const v = q('#' + viewId);
      if (v) v.classList.add('active');
      if (viewId === 'view-results') root!.classList.add('scrollable');
    }

    // ── face-api ──
    async function loadAI(): Promise<boolean> {
      if (STATE.modelsLoaded) return true;
      const faceapi = window.faceapi;
      setText('#hud-status', 'Booting...');
      if (!faceapi) {
        // poll quelques fois si le script CDN n'est pas encore prêt
        for (let i = 0; i < 40 && !window.faceapi; i++) {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      try {
        const URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
        await window.faceapi.nets.tinyFaceDetector.loadFromUri(URL);
        await window.faceapi.nets.faceLandmark68Net.loadFromUri(URL);
        STATE.modelsLoaded = true;
        setText('#hud-status', 'Optics Rdy');
        return true;
      } catch {
        setText('#hud-status', 'Sys Error');
        return false;
      }
    }

    let FACE_OPTS: unknown = null;
    function faceOpts() {
      if (!FACE_OPTS && window.faceapi) {
        FACE_OPTS = new window.faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.45 });
      }
      return FACE_OPTS;
    }

    function detectAndDraw() {
      if (disposed || !STATE.modelsLoaded || video!.paused) return;
      const faceapi = window.faceapi;
      if (!faceapi) return;
      faceapi
        .detectSingleFace(video, faceOpts())
        .withFaceLandmarks()
        .then((res: { detection: { box: { x: number; y: number; width: number; height: number } }; landmarks: { positions: { x: number; y: number }[] } } | undefined) => {
          if (res) {
            STATE.box = res.detection.box;
            STATE.landmarks = res.landmarks.positions;
            consecutiveDetections++;
            setText('#hud-nodes', String(STATE.landmarks.length));
            handleCalibration();
            const nowMs = performance.now();
            if (!STATE.thermalMode && nowMs - lastAtlasCaptureMs > 1200) {
              lastAtlasCaptureMs = nowMs;
              captureScanFaceForAtlas();
            }
          } else {
            consecutiveDetections = 0;
          }
        })
        .catch(() => {});
    }

    function generateMockData(w: number, h: number) {
      const cx = w / 2,
        cy = h / 2,
        fw = w * 0.4,
        fh = h * 0.5;
      STATE.box = { x: cx - fw / 2, y: cy - fh / 2, width: fw, height: fh };
      STATE.landmarks = [];
      for (let i = 0; i < 68; i++) {
        const a = (i / 68) * Math.PI * 2;
        STATE.landmarks.push({ x: cx + Math.cos(a) * (fw / 2) + (Math.random() * 6 - 3), y: cy + Math.sin(a) * (fh / 2) + (Math.random() * 6 - 3) });
      }
      setText('#hud-nodes', '68');
      setText('#hud-status', 'Locked');
      setTO(() => {
        if (!STATE.scanning) {
          STATE.scanning = true;
          startThermalScan();
        }
      }, 1200);
    }

    const LIDAR_CYCLE = 3000;
    function renderThermalTopography() {
      if (disposed) return;
      ctxO.clearRect(0, 0, overlay!.width, overlay!.height);

      if (STATE.thermalMode && STATE.box) {
        const fx = STATE.box.x,
          fy = STATE.box.y,
          fw = STATE.box.width,
          fh = STATE.box.height;
        const cx = fx + fw / 2,
          cy = fy + fh / 2;

        ctxO.strokeStyle = 'rgba(240,199,128,0.18)';
        ctxO.lineWidth = 0.8;
        ctxO.beginPath();
        ctxO.ellipse(cx, cy, fw * 0.52, fh * 0.62, 0, 0, Math.PI * 2);
        ctxO.stroke();

        if (!lidarStart) lidarStart = performance.now();
        const cycle = ((performance.now() - lidarStart) % LIDAR_CYCLE) / LIDAR_CYCLE;

        const hY = fy - fh * 0.1 + cycle * (fh * 1.2);
        ctxO.strokeStyle = 'rgba(240,199,128,0.7)';
        ctxO.lineWidth = 0.8;
        ctxO.shadowBlur = 12;
        ctxO.shadowColor = 'rgba(240,199,128,1)';
        ctxO.beginPath();
        ctxO.moveTo(fx - fw * 0.15, hY);
        ctxO.lineTo(fx + fw * 1.15, hY);
        ctxO.stroke();

        const vX = fx - fw * 0.1 + ((cycle + 0.5) % 1) * (fw * 1.2);
        ctxO.beginPath();
        ctxO.moveTo(vX, fy - fh * 0.15);
        ctxO.lineTo(vX, fy + fh * 1.15);
        ctxO.stroke();
        ctxO.shadowBlur = 0;

        const G = 14;
        for (let i = 1; i < G; i++) {
          for (let j = 1; j < G; j++) {
            const x = fx + (i / G) * fw;
            const y = fy + (j / G) * fh;
            const dx = (x - cx) / (fw * 0.52);
            const dy = (y - cy) / (fh * 0.62);
            if (dx * dx + dy * dy > 1) continue;
            const seen = y < hY && x < vX;
            ctxO.fillStyle = `rgba(240,199,128,${seen ? 0.75 : 0.22})`;
            ctxO.beginPath();
            ctxO.arc(x, y, seen ? 1.2 : 0.8, 0, Math.PI * 2);
            ctxO.fill();
            if (seen && Math.abs(y - hY) < 14 && Math.abs(x - vX) < 14) {
              ctxO.shadowBlur = 10;
              ctxO.shadowColor = 'rgba(255,229,176,1)';
              ctxO.fillStyle = 'rgba(255,229,176,1)';
              ctxO.beginPath();
              ctxO.arc(x, y, 2.2, 0, Math.PI * 2);
              ctxO.fill();
              ctxO.shadowBlur = 0;
            }
          }
        }
      } else if (STATE.landmarks && STATE.box) {
        ctxO.strokeStyle = 'rgba(255,255,255,0.2)';
        ctxO.lineWidth = 0.5;
        ctxO.beginPath();
        for (let i = 0; i < STATE.landmarks.length - 1; i++) {
          ctxO.moveTo(STATE.landmarks[i].x, STATE.landmarks[i].y);
          ctxO.lineTo(STATE.landmarks[i + 1].x, STATE.landmarks[i + 1].y);
        }
        ctxO.stroke();
        ctxO.fillStyle = 'rgba(255,255,255,0.5)';
        STATE.landmarks.forEach((pt) => {
          ctxO.beginPath();
          ctxO.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
          ctxO.fill();
        });
      }

      if ((!STATE.scanning || STATE.thermalMode) && !disposed) requestAnimationFrame(renderThermalTopography);
    }

    function handleCalibration() {
      if (STATE.scanning) return;
      setText('#hud-status', 'Locked');
      calibFrames++;
      if (calibFrames > 15) {
        STATE.scanning = true;
        startThermalScan();
      }
    }

    function startThermalScan() {
      STATE.thermalMode = true;
      videoContainer.classList.add('thermal-active');
      setText('#hud-status', 'Phase Thermique');
      q('#scan-laser')?.classList.add('scanning');
      depthUI.classList.add('show');
      const layers = [q('#lyr-1'), q('#lyr-2'), q('#lyr-3')];
      layers.forEach((lyr, idx) => {
        setTO(() => {
          layers.forEach((l) => l?.classList.remove('active'));
          lyr?.classList.add('active');
          if (idx === layers.length - 1) setTO(executeCapture, 1500);
        }, idx * 1000);
      });
    }

    async function executeCapture() {
      await captureScanFaceForAtlas();
      const flash = document.createElement('div');
      flash.style.cssText = 'position:absolute; inset:0; background:#FFF; z-index:100; opacity:1; transition:opacity 0.4s;';
      videoContainer.appendChild(flash);
      setTO(() => {
        flash.style.opacity = '0';
        setTO(() => flash.remove(), 400);
        launchComputation();
      }, 100);
    }

    // ── Capture visage pour l'atlas (localStorage) ──
    async function captureScanFaceForAtlas(): Promise<boolean> {
      try {
        let source: CanvasImageSource | null = null;
        let srcW = 0,
          srcH = 0;

        if (STATE.stream && typeof (window as { ImageCapture?: unknown }).ImageCapture !== 'undefined') {
          try {
            const track = STATE.stream.getVideoTracks()[0];
            if (track && track.readyState === 'live') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const ic = new (window as any).ImageCapture(track);
              const frame = await ic.grabFrame();
              source = frame;
              srcW = frame.width;
              srcH = frame.height;
            }
          } catch {
            /* fallback video */
          }
        }
        if (!source) {
          if (!video!.videoWidth || video!.readyState < 2) return false;
          await new Promise((r) => requestAnimationFrame(r));
          source = video!;
          srcW = video!.videoWidth;
          srcH = video!.videoHeight;
        }

        const cap = document.createElement('canvas');
        const w = 640,
          h = 512;
        cap.width = w;
        cap.height = h;
        const cctx = cap.getContext('2d')!;
        const targetAspect = w / h;
        let cropX: number, cropY: number, cropW: number, cropH: number;

        if (STATE.box && STATE.box.width > 30) {
          faceBoxHistory.push({ ...STATE.box, t: performance.now() });
        }
        const now = performance.now();
        const hist = faceBoxHistory.filter((b) => now - b.t < 3000).slice(-3);

        if (hist.length > 0) {
          const avg = {
            x: hist.reduce((s, b) => s + b.x, 0) / hist.length,
            y: hist.reduce((s, b) => s + b.y, 0) / hist.length,
            width: hist.reduce((s, b) => s + b.width, 0) / hist.length,
            height: hist.reduce((s, b) => s + b.height, 0) / hist.length,
          };
          const faceCX = avg.x + avg.width / 2;
          const faceCY = avg.y + avg.height / 2;
          const facePct = avg.height / srcH;
          let cropMultH: number;
          if (facePct < 0.3) cropMultH = 2.0;
          else if (facePct < 0.5) cropMultH = 1.7;
          else if (facePct < 0.7) cropMultH = 1.45;
          else cropMultH = 1.25;
          cropH = Math.min(srcH, avg.height * cropMultH);
          cropW = Math.min(srcW, cropH * targetAspect);
          cropX = Math.max(0, Math.min(srcW - cropW, faceCX - cropW / 2));
          cropY = Math.max(0, Math.min(srcH - cropH, faceCY - cropH * 0.5));
        } else {
          cropH = Math.min(srcH, srcH * 0.85);
          cropW = Math.min(srcW, cropH * targetAspect);
          cropX = (srcW - cropW) / 2;
          cropY = (srcH - cropH) / 2;
        }

        cctx.save();
        cctx.scale(-1, 1);
        cctx.translate(-w, 0);
        cctx.fillStyle = '#000';
        cctx.fillRect(0, 0, w, h);
        cctx.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, w, h);
        cctx.restore();

        const sample = cctx.getImageData(160, 100, 320, 256).data;
        let sumR = 0,
          sumG = 0,
          sumB = 0,
          count = 0;
        for (let i = 0; i < sample.length; i += 16) {
          sumR += sample[i];
          sumG += sample[i + 1];
          sumB += sample[i + 2];
          count++;
        }
        if (sumR / count < 6 && sumG / count < 6 && sumB / count < 6) return false;

        const dataURL = cap.toDataURL('image/jpeg', 0.92);
        try {
          localStorage.setItem('vyvre_scan_face', dataURL);
        } catch {
          /* quota / private mode */
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((source as any).close) (source as any).close();
        return true;
      } catch {
        return false;
      }
    }

    // ── Lattice 3D épigénétique ──
    const LATTICE_G = 7;
    const latticeNodes: { i: number; j: number; k: number; d: number }[] = [];
    const latticeEdges: [number, number][] = [];
    let latticeInited = false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function initEpigeneticVisualizer() {
      const w = epiCanvas!.offsetWidth || epiCanvas!.parentElement!.clientWidth;
      const h = epiCanvas!.offsetHeight || epiCanvas!.parentElement!.clientHeight;
      epiCanvas!.width = w * dpr;
      epiCanvas!.height = h * dpr;
      epiCanvas!.style.width = w + 'px';
      epiCanvas!.style.height = h + 'px';
      eCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (latticeInited) return;
      for (let i = -LATTICE_G; i <= LATTICE_G; i++)
        for (let j = -LATTICE_G; j <= LATTICE_G; j++)
          for (let k = -LATTICE_G; k <= LATTICE_G; k++) {
            const d = Math.sqrt(i * i + j * j + k * k);
            if (d > LATTICE_G) continue;
            latticeNodes.push({ i, j, k, d });
          }
      const idxOf = new Map<string, number>();
      latticeNodes.forEach((n, idx) => idxOf.set(`${n.i},${n.j},${n.k}`, idx));
      const dirs = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
      for (let a = 0; a < latticeNodes.length; a++) {
        const A = latticeNodes[a];
        for (const [di, dj, dk] of dirs) {
          const b = idxOf.get(`${A.i + di},${A.j + dj},${A.k + dk}`);
          if (b !== undefined) latticeEdges.push([a, b]);
        }
      }
      latticeInited = true;
    }

    function drawEpigeneticMatrix() {
      if (!computationActive || disposed) return;
      const now = performance.now();
      const W = epiCanvas!.offsetWidth || epiCanvas!.parentElement!.clientWidth;
      const H = epiCanvas!.offsetHeight || epiCanvas!.parentElement!.clientHeight;
      // palette adaptative au thème (clair = fond clair + or/sombre, sombre = crème)
      const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('vyvre-light');
      const C = isLight
        ? { trail: 'rgba(243,243,241,0.34)', litEdge: '150,112,40', coolEdge: '120,135,150', fire: '168,129,47', warm: '95,76,32', cool: '70,72,86', core: '168,129,47' }
        : { trail: 'rgba(5,6,8,0.22)', litEdge: '232,224,208', coolEdge: '140,200,210', fire: '245,239,224', warm: '232,224,208', cool: '220,225,235', core: '245,239,224' };
      eCtx.fillStyle = C.trail;
      eCtx.fillRect(0, 0, W, H);
      const cx = W / 2,
        cy = H / 2;
      const scale = Math.min(W, H) * 0.032;
      const angY = now * 0.0006,
        angX = now * 0.0004 + 0.18;
      const cosY = Math.cos(angY),
        sinY = Math.sin(angY),
        cosX = Math.cos(angX),
        sinX = Math.sin(angX);
      const wavePhase = now * 0.0022,
        firePhase = now * 0.0014;

      const proj: { sx: number; sy: number; z: number; persp: number; fire: number }[] = [];
      for (const n of latticeNodes) {
        const wave = Math.sin(n.i * 0.5 + n.k * 0.5 + wavePhase) * 0.7;
        const x = n.i,
          y = n.j + wave,
          z = n.k;
        const x2 = x * cosY + z * sinY;
        const z2 = -x * sinY + z * cosY;
        const y2 = y * cosX - z2 * sinX;
        const z3 = y * sinX + z2 * cosX;
        const persp = 1 / (1 + z3 * 0.055);
        proj.push({ sx: cx + x2 * scale * persp, sy: cy + y2 * scale * persp, z: z3, persp, fire: Math.sin(firePhase - n.d * 0.7) });
      }

      eCtx.lineWidth = 0.3;
      for (const e of latticeEdges) {
        const A = proj[e[0]],
          B = proj[e[1]];
        const fAvg = (A.fire + B.fire) / 2;
        const lit = Math.max(0, fAvg);
        const depth = (A.persp + B.persp) / 2;
        const alpha = (0.025 + lit * 0.18) * depth;
        eCtx.strokeStyle = lit > 0.5 ? `rgba(${C.litEdge},${alpha})` : `rgba(${C.coolEdge},${alpha * 0.4})`;
        eCtx.beginPath();
        eCtx.moveTo(A.sx, A.sy);
        eCtx.lineTo(B.sx, B.sy);
        eCtx.stroke();
      }

      proj.sort((a, b) => b.z - a.z);
      for (const p of proj) {
        const lit = Math.max(0, p.fire);
        const onFire = lit > 0.86;
        const r = (0.6 + p.persp * 1.1) * (onFire ? 1.3 : 1);
        if (onFire) {
          eCtx.fillStyle = `rgba(${C.fire},${0.55 * p.persp})`;
          eCtx.shadowBlur = 3;
          eCtx.shadowColor = `rgba(${C.fire},0.45)`;
        } else {
          const c = lit > 0.35 ? `rgba(${C.warm},` : `rgba(${C.cool},`;
          eCtx.fillStyle = c + (0.15 + lit * 0.35) * p.persp + ')';
          eCtx.shadowBlur = 0;
        }
        eCtx.beginPath();
        eCtx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        eCtx.fill();
      }
      eCtx.shadowBlur = 0;

      const corePulse = 0.7 + 0.3 * Math.sin(now * 0.005);
      const Rc = Math.min(W, H) * 0.03 * corePulse;
      const halo = eCtx.createRadialGradient(cx, cy, 0, cx, cy, Rc * 2.5);
      halo.addColorStop(0, `rgba(${C.fire},0.08)`);
      halo.addColorStop(0.5, `rgba(${C.warm},0.025)`);
      halo.addColorStop(1, `rgba(${C.warm},0)`);
      eCtx.fillStyle = halo;
      eCtx.beginPath();
      eCtx.arc(cx, cy, Rc * 2.5, 0, Math.PI * 2);
      eCtx.fill();
      eCtx.fillStyle = `rgba(${C.core},0.85)`;
      eCtx.shadowBlur = 4;
      eCtx.shadowColor = `rgba(${C.core},0.6)`;
      eCtx.beginPath();
      eCtx.arc(cx, cy, 1.2, 0, Math.PI * 2);
      eCtx.fill();
      eCtx.shadowBlur = 0;

      requestAnimationFrame(drawEpigeneticMatrix);
    }

    // ── Scan depuis image (upload) ──
    async function scanFromImage(imgEl: HTMLImageElement): Promise<ScanResult | null> {
      const eng = window.VYVRE_SCAN_ENGINE;
      if (!eng || !imgEl || !imgEl.naturalWidth) return null;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = imgEl.naturalWidth;
        canvas.height = imgEl.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(imgEl, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const roi = await eng.detectFaceROI(imageData);
        const cheekPixels = eng
          .samplePixelsInROI(imageData, roi, 'cheekL', 3)
          .concat(eng.samplePixelsInROI(imageData, roi, 'cheekR', 3));
        const tzonePixels = eng.samplePixelsInROI(imageData, roi, 'tzone', 3);
        const foreheadPixels = eng.samplePixelsInROI(imageData, roi, 'forehead', 3);
        const allPixels = cheekPixels.concat(tzonePixels, foreheadPixels);
        eng.assessFrameQuality(allPixels);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const labArr = cheekPixels.map((p: any) => eng.rgbToLab(p.r, p.g, p.b));
        let sumL = 0,
          sumA = 0,
          sumB = 0,
          sumR = 0,
          sumG = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const lab of labArr) {
          sumL += lab.L;
          sumA += lab.a;
          sumB += lab.b;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const p of cheekPixels) {
          sumR += p.r / 255;
          sumG += p.g / 255;
        }
        const n = labArr.length;
        if (n === 0) return null;
        const avgL = sumL / n,
          avgA = sumA / n,
          avgB = sumB / n;
        const avgRed = sumR / cheekPixels.length,
          avgGreen = sumG / cheekPixels.length;
        const avgLum = 0.5;
        const itaAngle = eng.ita(avgL, avgB);
        const raw = {
          L: avgL,
          a: avgA,
          b: avgB,
          ita: itaAngle,
          fitz: eng.itaToFitzpatrick(itaAngle),
          MI: eng.melaninIndex(avgRed),
          EI: eng.erythemaIndex(avgRed, avgGreen),
          sebum: eng.sebumProxy(tzonePixels, avgLum, 0.05),
          tewl: eng.tewlProxy(labArr),
          avgRed,
          avgGreen,
          avgLum,
        };
        const scores = eng.mapToScores(raw);
        if (eng.updateBiomarkerBars) eng.updateBiomarkerBars(scores);
        return { scores, raw, framesAccepted: 1, framesAttempted: 1, source: 'image' };
      } catch {
        return null;
      }
    }

    async function deriveScoresFromPixels(src: HTMLVideoElement | HTMLImageElement | null): Promise<ScanResult | null> {
      const eng = window.VYVRE_SCAN_ENGINE;
      if (!eng || !src) return null;
      try {
        const canvas = document.createElement('canvas');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = (src as any).videoWidth || (src as any).naturalWidth || 480;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const h = (src as any).videoHeight || (src as any).naturalHeight || 640;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(src, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const roi = await eng.detectFaceROI(imageData);
        const cheekPixels = eng
          .samplePixelsInROI(imageData, roi, 'cheekL', 3)
          .concat(eng.samplePixelsInROI(imageData, roi, 'cheekR', 3));
        const tzonePixels = eng.samplePixelsInROI(imageData, roi, 'tzone', 3);
        if (cheekPixels.length === 0) return null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const labArr = cheekPixels.map((p: any) => eng.rgbToLab(p.r, p.g, p.b));
        let sumL = 0,
          sumA = 0,
          sumB = 0,
          sumR = 0,
          sumG = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const lab of labArr) {
          sumL += lab.L;
          sumA += lab.a;
          sumB += lab.b;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const p of cheekPixels) {
          sumR += p.r / 255;
          sumG += p.g / 255;
        }
        const nn = labArr.length;
        const avgL = sumL / nn,
          avgA = sumA / nn,
          avgB = sumB / nn;
        const avgRed = sumR / cheekPixels.length,
          avgGreen = sumG / cheekPixels.length;
        const itaAngle = eng.ita(avgL, avgB);
        const raw = {
          L: avgL,
          a: avgA,
          b: avgB,
          ita: itaAngle,
          fitz: eng.itaToFitzpatrick(itaAngle),
          MI: eng.melaninIndex(avgRed),
          EI: eng.erythemaIndex(avgRed, avgGreen),
          sebum: eng.sebumProxy(tzonePixels, 0.5, 0.05),
          tewl: eng.tewlProxy(labArr),
          avgRed,
          avgGreen,
          avgLum: 0.5,
        };
        return { scores: eng.mapToScores(raw), raw, framesAccepted: 1, framesAttempted: 1, source: 'fallback' };
      } catch {
        return null;
      }
    }

    function launchComputation() {
      setTO(() => captureScanFaceForAtlas(), 2500);
      setTO(() => captureScanFaceForAtlas(), 4500);
      setTO(() => captureScanFaceForAtlas(), 6500);

      switchView('view-process');
      initEpigeneticVisualizer();
      computationActive = true;
      drawEpigeneticMatrix();

      const scanSource: HTMLVideoElement | HTMLImageElement =
        video!.style.display !== 'none' && video!.videoWidth ? video! : capturedImgRef.current!;

      let realScanPromise: Promise<ScanResult | null> | null = null;
      if (window.VYVRE_SCAN_ENGINE && scanSource) {
        if (scanSource.tagName === 'IMG') {
          realScanPromise = scanFromImage(scanSource as HTMLImageElement);
        } else {
          realScanPromise = window.VYVRE_SCAN_ENGINE.runRealScan(scanSource).catch(() => null);
        }
      }

      // Safety net 9s
      setTO(async () => {
        if (!dashboardShown && q('#view-process.active')) {
          await captureScanFaceForAtlas();
          if (STATE.stream) {
            try {
              STATE.stream.getTracks().forEach((t) => t.stop());
            } catch {
              /* noop */
            }
            STATE.stream = null;
          }
          if (!lastScanResult) {
            lastScanResult = await deriveScoresFromPixels(scanSource);
          }
          computationActive = false;
          showFinalDashboard();
        }
      }, 9000);

      const steps = [q('#step-1'), q('#step-2'), q('#step-3')];
      steps.forEach((step, idx) => {
        setTO(() => {
          steps.forEach((s) => s?.classList.remove('active'));
          step?.classList.add('active');
          if (idx === steps.length - 1) {
            setTO(async () => {
              if (realScanPromise) {
                try {
                  const result = await Promise.race<ScanResult | null>([
                    realScanPromise,
                    new Promise<null>((r) => setTimeout(() => r(null), 15000)),
                  ]);
                  if (result) {
                    result._scanMode = 'real_cie_lab';
                    lastScanResult = result;
                  } else {
                    lastScanResult = await deriveScoresFromPixels(scanSource);
                    if (lastScanResult) lastScanResult._scanMode = 'fallback_pixels';
                  }
                } catch {
                  lastScanResult = await deriveScoresFromPixels(scanSource);
                  if (lastScanResult) lastScanResult._scanMode = 'fallback_pixels_after_error';
                }
              } else {
                lastScanResult = await deriveScoresFromPixels(scanSource);
                if (lastScanResult) lastScanResult._scanMode = 'fallback_pixels_no_promise';
              }
              await captureScanFaceForAtlas();
              if (STATE.stream) STATE.stream.getTracks().forEach((t) => t.stop());
              computationActive = false;
              showFinalDashboard();
            }, 400);
          }
        }, idx * 1000);
      });
    }

    // ── Results ──
    function showFinalDashboard() {
      if (dashboardShown) return;
      dashboardShown = true;
      switchView('view-results');

      const result = lastScanResult;
      window.vyvreLastScanResult = result;
      let globalScore = 91,
        cellAge = 29,
        hydration = 88;
      let ageMethod = 'estimation';

      if (result && result.scores) {
        const s = result.scores;
        const sebumScore = 100 - (s.sebum ?? 50);
        const pigmentScore = 100 - (s.pigmentation ?? 50);
        globalScore = Math.round(
          (s.hydration ?? 50) * 0.2 +
            (s.wrinkles ?? 50) * 0.15 +
            pigmentScore * 0.1 +
            (s.pores ?? 50) * 0.08 +
            (s.glow ?? 50) * 0.17 +
            (s.firmness ?? 50) * 0.15 +
            (s.redness ?? 50) * 0.08 +
            sebumScore * 0.07,
        );
        globalScore = Math.max(20, Math.min(99, globalScore));

        // Âge : préférer l'estimation du MOTEUR (CNN-aware si TF.js chargé).
        // Sinon fallback dermato à plage ÉLARGIE (≈18-85, vs ~28-48 avant, qui
        // rajeunissait tout le monde — cf. audit clinique CLINICAL_AGE_VALIDATION.md).
        const engineAge = typeof s.cellAge === 'number' && isFinite(s.cellAge) ? (s.cellAge as number) : null;
        const cnnMethod = String(s.cellAgeMethod ?? s.cnnMethod ?? '').toLowerCase();
        const usedCnn = /cnn|ensemble|advanced/.test(cnnMethod);
        if (engineAge != null) {
          cellAge = Math.round(engineAge);
        } else {
          const pigmentationYouth = 100 - (s.pigmentation ?? 50);
          const youthScore = (s.wrinkles ?? 50) * 0.37 + (s.firmness ?? 50) * 0.37 + pigmentationYouth * 0.18 + (s.glow ?? 50) * 0.08;
          cellAge = Math.round(58 - (youthScore - 50) * 0.9);
        }
        cellAge = Math.max(18, Math.min(85, cellAge));
        ageMethod = usedCnn ? 'CNN' : 'estimation';

        hydration = Math.round(s.hydration ?? 50);
        hydration = Math.max(25, Math.min(85, hydration));
      }

      root!.querySelectorAll('[data-vyvre-score]').forEach((el) => ((el as HTMLElement).dataset.target = String(globalScore)));
      root!.querySelectorAll('[data-vyvre-score-large]').forEach((el) => ((el as HTMLElement).dataset.target = String(globalScore)));
      root!.querySelectorAll('[data-vyvre-age]').forEach((el) => ((el as HTMLElement).dataset.target = String(cellAge)));
      root!.querySelectorAll('[data-vyvre-hydration]').forEach((el) => ((el as HTMLElement).dataset.target = String(hydration)));

      // Note honnête : FOURCHETTE (pas un chiffre faussement précis) + méthode
      const ageNote = q('#vyvre-age-note');
      if (ageNote) {
        const delta = ageMethod === 'CNN' ? 4 : 8;
        const lo = Math.max(18, cellAge - delta);
        const hi = Math.min(90, cellAge + delta);
        ageNote.textContent =
          ageMethod === 'CNN'
            ? `Âge cellulaire ≈ ${lo}–${hi} ans · réseau de neurones (CNN)`
            : `Âge cellulaire ≈ ${lo}–${hi} ans · estimation colorimétrique`;
      }

      // Lien protocole + localStorage
      try {
        const protocolLink = q<HTMLAnchorElement>('#vyvre-protocol-link');
        const scanPayload =
          result && result.scores
            ? {
                hydration: Math.round(result.scores.hydration ?? 50),
                wrinkles: Math.round(result.scores.wrinkles ?? 50),
                firmness: Math.round(result.scores.firmness ?? 50),
                glow: Math.round(result.scores.glow ?? 50),
                redness: Math.round(result.scores.redness ?? 50),
                pores: Math.round(result.scores.pores ?? 50),
                sebum: Math.round(result.scores.sebum ?? 50),
                pigmentation: Math.round(result.scores.pigmentation ?? 50),
                globalScore,
                cellAge,
              }
            : null;
        if (protocolLink) {
          const params = new URLSearchParams({ score: String(globalScore), age: String(cellAge), hyd: String(hydration), from: 'dior' });
          if (scanPayload) {
            try {
              params.set('scores', btoa(JSON.stringify(scanPayload)));
            } catch {
              /* noop */
            }
          }
          // protocole : version blanche si thème clair, noire sinon (originale intacte)
          const protoFile =
            typeof document !== 'undefined' && document.documentElement.classList.contains('vyvre-light')
              ? '/PROTOCOL_DIOR_BLANC.html'
              : '/PROTOCOL_DIOR.html';
          protocolLink.href = protoFile + '?' + params.toString();
        }
        localStorage.setItem('vyvre_score', String(globalScore));
        localStorage.setItem('vyvre_age', String(cellAge));
        localStorage.setItem('vyvre_hyd', String(hydration));
        if (scanPayload) {
          localStorage.setItem('vyvre_scan_scores', JSON.stringify(scanPayload));
          localStorage.setItem('vyvre_scan_brand', 'dior');
          localStorage.setItem('vyvre_scan_ts', String(Date.now()));
        }
      } catch {
        /* noop */
      }

      // Compteurs animés
      root!.querySelectorAll('.vyvre-v6 [data-target]').forEach((el) => {
        const target = parseInt((el as HTMLElement).getAttribute('data-target') || '');
        if (isNaN(target)) return;
        const duration = 1500;
        const start = performance.now();
        function tick(now: number) {
          if (disposed) return;
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          (el as HTMLElement).innerText = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
          else (el as HTMLElement).innerText = String(target);
        }
        requestAnimationFrame(tick);
      });

      if (result && result.scores) renderMatchedProducts(result.scores);

      // notifie le tracker (localStorage history)
      try {
        window.dispatchEvent(new CustomEvent('vyvre:scan-complete', { detail: { ...result, brand: 'dior' } }));
      } catch {
        /* noop */
      }
    }

    // ── Matching produits (prop server → fallback API → hardcodé) ──
    async function renderMatchedProducts(scores: ScanScores) {
      let pool = productsRef.current;
      if (!pool || pool.length === 0) {
        try {
          const resp = await fetch('/api/products?brand=dior&_t=' + Date.now());
          if (resp.ok) {
            const data = await resp.json();
            pool = data.products || [];
          }
        } catch {
          /* garde le hardcodé */
        }
      }
      if (!pool || pool.length === 0) return;

      const selected = matchProducts(scores, pool, 3);
      selected.forEach((p, idx) => {
        const card = q<HTMLElement>(`[data-vyvre-prod-slot="${idx}"]`);
        if (!card) return;
        const primaryTarget = (p.targets || [])[0] || 'wrinkles';
        const lblEl = card.querySelector('.v6lbl');
        const h3 = card.querySelector('h3');
        const pEl = card.querySelector('p');
        const img = card.querySelector('img') as HTMLImageElement | null;
        const price = card.querySelector('.v6price');
        if (lblEl) lblEl.textContent = CONCERN_LABELS[primaryTarget] || 'Soin Premium';
        if (h3) h3.textContent = p.name;
        if (pEl) {
          const words = (p.targets || []).map((t) => CONCERN_LABELS[t] || t).join(' · ');
          pEl.textContent = `Action ciblée : ${words}.`;
        }
        if (img && p.image_url) {
          img.src = p.image_url;
          img.alt = p.name;
          img.style.display = '';
        }
        if (price && p.price_eur != null) price.textContent = p.price_eur.toFixed(2).replace('.', ',') + ' €';
        if (p.url) {
          card.style.cursor = 'pointer';
          card.onclick = (e) => {
            e.preventDefault();
            window.open(p.url!, '_blank', 'noopener,noreferrer');
          };
        }
      });
    }

    // ── Handlers boutons ──
    const onScanClick = async () => {
      switchView('view-scanner');
      await loadAI();
      try {
        STATE.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = STATE.stream;
        const atlasTimer = setInterval(() => {
          if (STATE.thermalMode || !STATE.stream || !STATE.stream.active) {
            clearInterval(atlasTimer);
            return;
          }
          if (video.videoWidth > 0 && video.readyState >= 2) captureScanFaceForAtlas();
        }, 1500);
        intervals.push(atlasTimer);
        setTO(() => clearInterval(atlasTimer), 12000);
        video.onloadedmetadata = () => {
          overlay.width = video.videoWidth;
          overlay.height = video.videoHeight;
          setText('#hud-status', 'Tracking');
          const di = setInterval(detectAndDraw, 100);
          intervals.push(di);
          renderThermalTopography();
        };
      } catch {
        setText('#hud-status', 'Cam Offline');
      }
    };

    const onUploadClick = () => fileInputRef.current?.click();
    const onFileChange = async (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (!input.files || !input.files[0]) return;
      switchView('view-scanner');
      await loadAI();
      video.style.display = 'none';
      const img = capturedImgRef.current!;
      img.style.display = 'block';
      img.src = URL.createObjectURL(input.files[0]);
      img.onload = () => {
        overlay.width = img.naturalWidth || 480;
        overlay.height = img.naturalHeight || 640;
        generateMockData(overlay.width, overlay.height);
        renderThermalTopography();
        setText('#hud-status', 'Extracting');
      };
    };

    const btnScan = q('#btn-scan');
    const btnUpload = q('#btn-upload');
    const fileInput = fileInputRef.current;
    btnScan?.addEventListener('click', onScanClick);
    btnUpload?.addEventListener('click', onUploadClick);
    fileInput?.addEventListener('change', onFileChange);

    // ── Cleanup (StrictMode / navigation) ──
    return () => {
      disposed = true;
      btnScan?.removeEventListener('click', onScanClick);
      btnUpload?.removeEventListener('click', onUploadClick);
      fileInput?.removeEventListener('change', onFileChange);
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
      try {
        STATE.stream?.getTracks().forEach((t) => t.stop());
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <div className="dior-app" ref={rootRef}>
      <div className="ambient-light" />

      {onBack && (
        <button className="scan-back" onClick={onBack}>
          ← Suite
        </button>
      )}

      <header className="dior-header">
        <div className="brand">
          <div className="brand-logo">
            <canvas className="v-mini" width={72} height={72}>
              V
            </canvas>
          </div>
          <span className="brand-vyvre">VYVRE</span>
          <span className="brand-x">×</span>
          <span className="brand-partner">DIOR</span>
        </div>
        <div className="label-sm">Ateliers DIOR · Accès AI</div>
      </header>

      {/* 1. HERO */}
      <section id="view-hero" className="view-state active">
        <div className="hero-content">
          <div className="label-sm" style={{ marginBottom: 30 }}>
            Topologie Moléculaire DeepTech
          </div>
          <h1>
            La longévité.
            <br />
            Quantifiée.
          </h1>
          <p>
            Une analyse thermique et topologique profonde traitée par notre réseau de neurones convolutifs. Le futur de la
            science cellulaire DIOR commence ici.
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
            <button className="spatial-btn" id="btn-scan">
              Démarrer le scan
            </button>
            <button className="spatial-btn secondary" id="btn-upload">
              Importer ma photo
            </button>
            <input type="file" id="file-input" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} />
          </div>
        </div>
      </section>

      {/* 2. SCANNER */}
      <section id="view-scanner" className="view-state">
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="label-sm" style={{ marginBottom: 15 }}>
            Phase 01
          </div>
          <h2>Analyse du Visage</h2>
        </div>
        <div className="spatial-panel scanner-module">
          <div className="video-container" id="thermal-vid-container">
            <video id="liveVideo" className="thermal-base" autoPlay muted playsInline ref={videoRef} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="capturedImg" className="thermal-base" alt="" ref={capturedImgRef} style={{ display: 'none' }} />
            <div className="thermal-color-map" />
            <canvas id="liveOverlay" className="live-overlay" ref={overlayRef} />
            <div className="depth-indicator" id="depth-ui">
              <div className="depth-layer" id="lyr-1">
                L01: ÉPIDERME
              </div>
              <div className="depth-layer" id="lyr-2">
                L02: MATRICE DERMIQUE
              </div>
              <div className="depth-layer" id="lyr-3">
                L03: THERMO-RÉSEAU
              </div>
            </div>
            <div className="lidar-sweep" id="scan-laser" />
            <div className="scan-hud">
              <div className="hud-item">
                <span className="label-sm">Points de Mesure</span>
                <span className="val" id="hud-nodes">
                  --
                </span>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
              <div className="hud-item">
                <span className="label-sm">Optique</span>
                <span className="val" id="hud-status">
                  Recherche
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPUTATION */}
      <section id="view-process" className="view-state">
        <div className="computation-layout">
          <div className="label-sm" style={{ marginBottom: 40, position: 'absolute', top: 0 }}>
            Calcul Neuronal en cours
          </div>
          <canvas id="epigenetic-canvas" className="epigenetic-canvas" ref={epiCanvasRef} />
          <div className="process-steps" style={{ position: 'absolute', bottom: 0 }}>
            <div className="step-text" id="step-1">
              Analyse de la peau...
            </div>
            <div className="step-text" id="step-2">
              Lecture des indicateurs...
            </div>
            <div className="step-text" id="step-3">
              Création de votre routine...
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESULTS */}
      <section id="view-results" className="view-state">
        <section className="vyvre-v6">
          <div className="v6grid">
            <div className="v6r3">
              <div className="v6card">
                <span className="v6lbl">Cible : Énergie cellulaire</span>
                <h3>Énergie Cellulaire</h3>
                <div className="v6num">
                  <span data-vyvre-score data-target="91">
                    91
                  </span>
                  <span className="v6unit">/100</span>
                </div>
              </div>
              <div className="v6card">
                <span className="v6lbl">Cible : Âge peau</span>
                <h3>Âge peau</h3>
                <div className="v6num">
                  <span data-vyvre-age data-target="29">
                    29
                  </span>
                  <span className="v6unit">ans</span>
                </div>
              </div>
              <div className="v6card">
                <span className="v6lbl">Cible : Hydratation</span>
                <h3>Barrière Hydrique</h3>
                <div className="v6num">
                  <span data-vyvre-hydration data-target="88">
                    88
                  </span>
                  <span className="v6unit">%</span>
                </div>
              </div>
            </div>

            <div className="v6r1">
              <div className="v6card v6score">
                <div className="v6num">
                  <span data-vyvre-score-large data-target="91">
                    91
                  </span>
                </div>
              </div>
            </div>

            <div className="vyvre-age-note" id="vyvre-age-note">
              Âge cellulaire · estimation — indicatif
            </div>

            <div className="v6r3" id="vyvre-product-row">
              <div className="v6card v6prod" data-vyvre-prod-slot="0">
                <span className="v6lbl">Chargement...</span>
                <h3>Capture Totale Le Sérum</h3>
                <p>Action ciblée anti-rides haute performance.</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="v6photo"
                  src="https://vyvre-demos.web.app/products/dior/capture-totale-le-serum.jpg"
                  alt="Capture Totale Le Sérum"
                />
                <div className="v6price">190,00 €</div>
              </div>
              <div className="v6card v6prod" data-vyvre-prod-slot="1">
                <span className="v6lbl">Chargement...</span>
                <h3>Capture Totale Crème</h3>
                <p>Ingénierie cellulaire végétale, fermeté restaurée.</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="v6photo"
                  src="https://vyvre-demos.web.app/products/dior/capture-totale-creme-anti-age-universelle.jpg"
                  alt="Capture Totale Crème"
                />
                <div className="v6price">230,00 €</div>
              </div>
              <div className="v6card v6prod" data-vyvre-prod-slot="2">
                <span className="v6lbl">Chargement...</span>
                <h3>Super Potent Yeux</h3>
                <p>Sérum yeux global : poches, cernes, ridules.</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="v6photo"
                  src="https://vyvre-demos.web.app/products/dior/capture-totale-super-potent-serum-yeux.jpg"
                  alt="Super Potent Yeux"
                />
                <div className="v6price">110,00 €</div>
              </div>
            </div>

            <div className="v6protocol-cta">
              <a id="vyvre-protocol-link" href="/PROTOCOL_DIOR.html" className="v6protocol-btn" target="_blank" rel="noopener">
                <span className="v6protocol-main">Protocole complet</span>
                <span className="v6protocol-arrow">→</span>
              </a>
            </div>

            <div className="v6tagline">
              <div className="v6tagline-eyebrow">VYVRE × DIOR · DISPONIBLE IMMÉDIATEMENT</div>
              <h2 className="v6tagline-title">
                Construisons ensemble
                <br />
                l&apos;avenir de la <em>skincare augmentée</em>.
              </h2>
            </div>

            <div className="v6r3">
              <div className="v6card">
                <span className="v6lbl">Standard : 01</span>
                <h3>Traitement local</h3>
                <p>WebAssembly in-browser. Aucune photo transmise au-delà de l&apos;écran.</p>
              </div>
              <div className="v6card v6fr-flag">
                <span className="v6lbl">Standard : 02</span>
                <h3>Hébergement souverain</h3>
                <p>Datacenter OVH Roubaix · SecNumCloud + ISO 27001.</p>
              </div>
              <div className="v6card">
                <span className="v6lbl">Standard : 03</span>
                <h3>RGPD natif</h3>
                <p>Aucune CCT. DPIA pré-remplie sur simple demande.</p>
              </div>
            </div>

            <div className="v6r2">
              <a href="https://vyvre.fr/pricing?from=dior" className="v6cta v6primary">
                Démarrer le pilote →
              </a>
              <a href="https://vyvre.fr/pricing?from=dior" className="v6cta v6secondary">
                Voir les tarifs
              </a>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
