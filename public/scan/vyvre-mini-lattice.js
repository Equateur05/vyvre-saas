/* ============================================================================
   VYVRE MINI LATTICE — Logo VIVANT 3D
   Mini-version of the scan-page lattice for the brand-mark logo.
   - LATTICE_G = 4  (≈ 250 nodes vs 1500 of full version)
   - Auto-rotate continu, no flag needed
   - Background TRANSPARENT (CSS circle behind)
   - 30 FPS throttled to save CPU
   - Optimized for ~36x36px display (72x72 buffer × DPR)
   - Multiple instances supported safely
   ============================================================================ */
(function () {
  'use strict';

  // ── Shared geometry (built once) ─────────────────────────────────────
  const LATTICE_G = 4;
  const NODES = [];
  const EDGES = [];

  (function build() {
    for (let i = -LATTICE_G; i <= LATTICE_G; i++)
      for (let j = -LATTICE_G; j <= LATTICE_G; j++)
        for (let k = -LATTICE_G; k <= LATTICE_G; k++) {
          const d = Math.sqrt(i * i + j * j + k * k);
          if (d > LATTICE_G) continue;
          NODES.push({ i, j, k, d });
        }
    const idxOf = new Map();
    NODES.forEach((n, idx) => idxOf.set(n.i + ',' + n.j + ',' + n.k, idx));
    const dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (let a = 0; a < NODES.length; a++) {
      const A = NODES[a];
      for (const [di, dj, dk] of dirs) {
        const b = idxOf.get((A.i + di) + ',' + (A.j + dj) + ',' + (A.k + dk));
        if (b !== undefined) EDGES.push([a, b]);
      }
    }
  })();

  // ── Single animation loop driving all instances ──────────────────────
  const instances = [];
  let rafId = null;
  let lastTick = 0;
  const FRAME_MS = 1000 / 30; // 30 FPS

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (now - lastTick < FRAME_MS) return;
    lastTick = now;

    const angY = now * 0.0006;
    const angX = now * 0.0004 + 0.18;
    const cosY = Math.cos(angY), sinY = Math.sin(angY);
    const cosX = Math.cos(angX), sinX = Math.sin(angX);
    const wavePhase = now * 0.0022;
    const firePhase = now * 0.0014;

    for (const inst of instances) {
      drawOne(inst, cosY, sinY, cosX, sinX, wavePhase, firePhase);
    }
  }

  function drawOne(inst, cosY, sinY, cosX, sinX, wavePhase, firePhase) {
    const { ctx, canvas, dpr } = inst;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    // Clear fully (transparent — let CSS circle show through)
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) * 0.085;

    // Project nodes
    const proj = inst.proj;
    for (let n = 0; n < NODES.length; n++) {
      const nd = NODES[n];
      const wave = Math.sin(nd.i * 0.5 + nd.k * 0.5 + wavePhase) * 0.5;
      const x = nd.i, y = nd.j + wave, z = nd.k;
      const x2 = x * cosY + z * sinY;
      const z2 = -x * sinY + z * cosY;
      const y2 = y * cosX - z2 * sinX;
      const z3 = y * sinX + z2 * cosX;
      const persp = 1 / (1 + z3 * 0.08);
      const p = proj[n];
      p.sx = cx + x2 * scale * persp;
      p.sy = cy + y2 * scale * persp;
      p.z = z3;
      p.persp = persp;
      p.fire = Math.sin(firePhase - nd.d * 0.7);
    }

    // Edges — très subtils
    ctx.lineWidth = 0.4;
    for (let e = 0; e < EDGES.length; e++) {
      const A = proj[EDGES[e][0]], B = proj[EDGES[e][1]];
      const fAvg = (A.fire + B.fire) / 2;
      const lit = fAvg > 0 ? fAvg : 0;
      const depth = (A.persp + B.persp) / 2;
      const alpha = (0.04 + lit * 0.11) * depth; // max ≈ 0.15
      ctx.strokeStyle = 'rgba(232,224,208,' + alpha + ')';
      ctx.beginPath();
      ctx.moveTo(A.sx, A.sy);
      ctx.lineTo(B.sx, B.sy);
      ctx.stroke();
    }

    // Nodes (back-to-front)
    const sorted = inst.sortedIdx;
    for (let i = 0; i < proj.length; i++) sorted[i] = i;
    sorted.sort((a, b) => proj[b].z - proj[a].z);
    for (let s = 0; s < sorted.length; s++) {
      const p = proj[sorted[s]];
      const lit = p.fire > 0 ? p.fire : 0;
      const onFire = lit > 0.86;
      const r = (0.5 + p.persp * 0.9) * (onFire ? 1.25 : 1);
      // No shadowBlur — too costly + blurs on small canvas
      const alpha = (0.4 + lit * 0.5) * p.persp; // 0.4 → 0.9
      ctx.fillStyle = onFire
        ? 'rgba(245,239,224,' + Math.min(0.95, alpha + 0.15) + ')'
        : 'rgba(232,224,208,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Public init ──────────────────────────────────────────────────────
  function initMiniLattice(canvas) {
    if (!canvas || canvas.__miniLattice) return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) {
      // Fallback: replace canvas with text "V"
      const fb = document.createElement('div');
      fb.textContent = 'V';
      fb.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:11px;color:#E8E0D0';
      canvas.parentNode && canvas.parentNode.replaceChild(fb, canvas);
      return;
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    // Buffer = attribute width/height; CSS sizing happens via container
    // We ensure crisp render by scaling context once.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Pre-alloc proj array for this instance
    const proj = new Array(NODES.length);
    for (let i = 0; i < NODES.length; i++) proj[i] = { sx: 0, sy: 0, z: 0, persp: 1, fire: 0 };

    instances.push({
      canvas: canvas,
      ctx: ctx,
      dpr: dpr,
      proj: proj,
      sortedIdx: new Array(NODES.length),
    });
    canvas.__miniLattice = true;

    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  window.initMiniLattice = initMiniLattice;

  // ── Auto-init on DOM ready ───────────────────────────────────────────
  function autoInit() {
    const list = document.querySelectorAll('canvas.v-mini');
    list.forEach(function (c) { initMiniLattice(c); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
