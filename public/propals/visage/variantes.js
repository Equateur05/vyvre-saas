/* 07/10/2026 — propositions d'animation sur le visage pendant le scan (V1 a V4).
   Chaque variante dessine en deux temps :
     lueur(g, …)  : les formes qui doivent rayonner, dans une toile basse resolution
                    (le moteur la floute en la reduisant, puis la pose en lumiere additive) ;
     trait(x, …)  : les traits nets, toujours doubles d'un liseré sombre dessous,
                    pour rester lisibles sur une peau claire comme sur une peau foncee.
   Tout part des vrais points du visage (MediaPipe, 478 points) : rien n'est plaque. */

export const OVALE = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];

/* les zones lues, dans l'ordre de la lecture (de haut en bas) */
export const ETAPES = [
  { nom:'FRONT', polys:[[54,103,67,109,10,338,297,332,284,300,293,334,296,336,9,107,66,105,63,70]] },
  { nom:'SOUS LES YEUX', polys:[
      [226,31,228,229,230,231,232,233,245,128,121,120,119,118,117,111,143],
      [446,261,448,449,450,451,452,453,465,357,350,349,348,347,346,340,372]] },
  { nom:'JOUES', polys:[
      [116,117,118,119,100,36,203,206,216,207,187,123],
      [345,346,347,348,329,266,423,426,436,427,411,352]] },
  { nom:'MENTON', polys:[[106,182,83,18,313,406,335,400,377,152,148,176]] },
];

export const PAS = 1.6, FIN = 1.8, CYCLE = PAS*ETAPES.length + FIN;
/* ou en est la lecture a l'instant t (secondes) : zone i, avancee k (0..1), ou « fini » */
export function lecture(t){
  const c = ((t % CYCLE) + CYCLE) % CYCLE, D = PAS*ETAPES.length;
  if(c < D){ const i = Math.floor(c/PAS); return { i, k:(c - i*PAS)/PAS, fini:false, c }; }
  return { i:-1, k:(c - D)/FIN, fini:true, c };
}

const TAU = Math.PI*2;
export const rgba = (c, a) => 'rgba(' + c + ',' + (a < 0 ? 0 : a > 1 ? 1 : Math.round(a*1000)/1000) + ')';
const hash = i => { const s = Math.sin(i*127.1 + 311.7)*43758.5453; return s - Math.floor(s); };
const sm = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a)/(b - a))); return t*t*(3 - 2*t); };

/* courbe douce passant par les milieux des segments */
export function lisse(x, pts, ferme){
  const n = pts.length; if(n < 2) return;
  if(ferme){
    x.moveTo((pts[n-1].x + pts[0].x)/2, (pts[n-1].y + pts[0].y)/2);
    for(let i = 0; i < n; i++){ const p = pts[i], q = pts[(i + 1) % n]; x.quadraticCurveTo(p.x, p.y, (p.x + q.x)/2, (p.y + q.y)/2); }
    x.closePath();
  } else {
    x.moveTo(pts[0].x, pts[0].y);
    for(let i = 1; i < n - 1; i++) x.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i+1].x)/2, (pts[i].y + pts[i+1].y)/2);
    x.lineTo(pts[n-1].x, pts[n-1].y);
  }
}
function seg(x, P, liste){ for(const e of liste){ const a = P[e[0]], b = P[e[1]]; x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); } }
function perimetre(p){ let L = 0; for(let i = 0; i < p.length; i++){ const a = p[i], b = p[(i + 1) % p.length]; L += Math.hypot(b.x - a.x, b.y - a.y); } return L; }

/* la coupe du maillage par un plan (n·p = c) : la ligne que trace une lumiere rasante
   sur le relief. Le point est deplace selon sa profondeur : le nez la fait monter. */
function coupe(F, nx, ny, c, kz){
  const P = F.P, Z = F.zpx, zr = F.zref, tx = -ny, ty = nx, pts = [], lo = -.07*F.ech, hi = .025*F.ech;
  for(const e of F.aretes){ const a = e[0], b = e[1];
    const sa = P[a].x*nx + P[a].y*ny - c, sb = P[b].x*nx + P[b].y*ny - c;
    if(sa*sb < 0){ const k = sa/(sa - sb), z = Z[a] + (Z[b] - Z[a])*k - zr, px = P[a].x + (P[b].x - P[a].x)*k, py = P[a].y + (P[b].y - P[a].y)*k;
      const dz = Math.max(lo, Math.min(hi, z*kz)); pts.push({ x:px + nx*dz, y:py + ny*dz, s:px*tx + py*ty }); } }
  pts.sort((u, v) => u.s - v.s);
  const o = []; for(const p of pts) if(!o.length || p.s - o[o.length - 1].s > 1.5) o.push(p);
  /* on lisse les petits sauts (mediane glissante sur 5 points, le long de la normale) */
  return o.map((p, i) => { const w = o.slice(Math.max(0, i - 2), i + 3).map(q => q.x*nx + q.y*ny).sort((u, v) => u - v), d = w[w.length >> 1] - (p.x*nx + p.y*ny); return { x:p.x + nx*d, y:p.y + ny*d }; });
}

/* 07/10 (Charles : « la 1 et la 2, plus stylé ») : un vrai retro-eclairage, commun a V1 et V2.
   La silhouette du visage est bordee de lumiere, et un reflet tourne lentement autour,
   comme une source placee derriere la tete. Toujours sur les vrais points du contour. */
function rimLueur(g, F, t, col, fort){
  const P = F.P, lw = F.lw, cx = F.box.cx, cy = F.box.cy, R = Math.max(F.box.w, F.box.h), a = t*.55 - 1.2;
  g.save(); g.beginPath(); lisse(g, OVALE.map(i => P[i]), true);
  g.lineWidth = 3*lw; g.strokeStyle = rgba(col, .12*fort); g.stroke();
  const gx = cx + Math.cos(a)*R*.62, gy = cy + Math.sin(a)*R*.62, gr = g.createRadialGradient(gx, gy, 0, gx, gy, R*.75);
  gr.addColorStop(0, rgba(col, fort)); gr.addColorStop(1, rgba(col, 0));
  g.lineWidth = 2.2*lw; g.strokeStyle = gr; g.stroke(); g.restore();
}
function rimTrait(x, F, t, col){
  const P = F.P, lw = F.lw, cx = F.box.cx, cy = F.box.cy, R = Math.max(F.box.w, F.box.h), a = t*.55 - 1.2;
  const gx = cx + Math.cos(a)*R*.62, gy = cy + Math.sin(a)*R*.62, gr = x.createRadialGradient(gx, gy, 0, gx, gy, R*.8);
  gr.addColorStop(0, 'rgba(255,255,255,.85)'); gr.addColorStop(.4, rgba(col, .3)); gr.addColorStop(1, rgba(col, 0));
  x.save(); x.beginPath(); lisse(x, OVALE.map(i => P[i]), true); x.lineJoin = 'round';
  x.lineWidth = 1.2*lw; x.strokeStyle = 'rgba(0,0,0,.08)'; x.stroke();
  x.lineWidth = .5*lw; x.strokeStyle = gr; x.stroke(); x.restore();
}
/* le reflet irise de V1 : la teinte glisse sur le maillage comme sur un film holographique */
const IRIS = ['120,225,255', '150,170,255', '205,150,255', '255,160,220'];

/* ======================= V1 — MAILLAGE LUMINEUX ======================= */
const V1 = {
  nom:'Maillage lumineux', court:'Maillage',
  texte:'Le vrai maillage du visage, éclairé de l’intérieur. Une vague de lumière part de la zone lue et traverse la peau ; la zone lue reste allumée.',
  teinte:{ halo:'60,190,255', coeur:'226,247,255' }, voile:.18, ombre:.3,
  prep(F, t, m){
    const P = F.P, Z = F.zpx, n = P.length, lec = F.lec, E = F.ech, zone = F.topo.zone;
    if(!m.I || m.I.length !== n) m.I = new Float32Array(n);
    const I = m.I; let O, r, amp; const k = lec.k;
    if(!lec.fini){ O = F.zones[lec.i].cs; const kk = (k*1.5) % 1; r = (.03 + .26*kk)*E; amp = 1 - sm(.55, 1, kk); }
    else { O = [{ x:P[1].x, y:P[1].y, z:Z[1] }]; r = k*1.15*E; amp = 1 - .5*k; }
    const sg = .045*E;
    for(let i = 0; i < n; i++){
      let d = 1e9; for(const o of O){ const dd = Math.hypot(P[i].x - o.x, P[i].y - o.y, Z[i] - o.z); if(dd < d) d = dd; }
      const w = (d - r)/sg; let v = Math.exp(-w*w)*amp;
      const dans = lec.fini ? zone[i] >= 0 : zone[i] === lec.i;
      if(dans) v = Math.max(v, (lec.fini ? .3*(1 - k) : .34*sm(0, .2, k)) + .06*Math.sin(t*2.6 + i*.7));
      I[i] = v;
    }
    const B = m.B || (m.B = [[], [], []]); B[0].length = B[1].length = B[2].length = 0;
    for(const e of F.aretes){ const v = (I[e[0]] + I[e[1]])*.5; if(v > .1) B[v > .62 ? 2 : v > .3 ? 1 : 0].push(e); }
    /* le reflet irise : chaque arete prend une teinte selon sa place et le temps */
    const H = m.H || (m.H = IRIS.map(() => [])); H.forEach(h => h.length = 0); const u = F.u, vv = F.v;
    for(let q = 0; q < F.aretes.length; q += 2){ const e = F.aretes[q], a = P[e[0]], b = P[e[1]], mx = (a.x + b.x)/2 - F.box.cx, my = (a.y + b.y)/2 - F.box.cy;
      const ph = ((mx*u.x + my*u.y)*.8 + (mx*vv.x + my*vv.y)*.5)/E*1.6 + t*.22, f = ph - Math.floor(ph); H[Math.floor(f*IRIS.length)].push(e); }
  },
  lueur(g, F, t, m){
    const P = F.P, A = [.1, .2, .42], lw = F.lw;
    rimLueur(g, F, t, this.teinte.halo, .85);
    g.lineCap = 'round';
    m.B.forEach((b, j) => { if(!b.length) return; g.beginPath(); seg(g, P, b); g.lineWidth = (.9 + .4*j)*lw; g.strokeStyle = rgba(this.teinte.halo, A[j]); g.stroke(); });
  },
  trait(x, F, t, m){
    const P = F.P, c = this.teinte.coeur, lw = F.lw, I = m.I;
    x.lineCap = 'round';
    /* le maillage entier, fin : un liseré sombre puis un fil clair */
    x.beginPath(); for(let q = 0; q < F.aretes.length; q += 2){ const e = F.aretes[q]; x.moveTo(P[e[0]].x, P[e[0]].y); x.lineTo(P[e[1]].x, P[e[1]].y); }
    x.lineWidth = .8*lw; x.strokeStyle = 'rgba(0,0,0,.06)'; x.stroke();
    m.H.forEach((h, j) => { if(!h.length) return; x.beginPath(); seg(x, P, h); x.lineWidth = .3*lw; x.strokeStyle = rgba(IRIS[j], .26); x.stroke(); });
    rimTrait(x, F, t, this.teinte.halo);
    const A = [.32, .55, .85];
    m.B.forEach((b, j) => { if(!b.length) return; x.beginPath(); seg(x, P, b);
      x.lineWidth = (1 + .2*j)*lw; x.strokeStyle = rgba('0,10,20', .08 + .04*j); x.stroke();
      x.lineWidth = (.35 + .15*j)*lw; x.strokeStyle = rgba(c, A[j]); x.stroke(); });
    /* les sommets traverses par la vague scintillent */
    x.beginPath(); const r = .7*lw;
    for(let i = 0; i < P.length; i++) if(I[i] > .55){ x.moveTo(P[i].x + r, P[i].y); x.arc(P[i].x, P[i].y, r, 0, TAU); }
    x.fillStyle = 'rgba(255,255,255,.8)'; x.fill();
  },
};

/* ======================= V2 — LUMIERE RASANTE ======================= */
const V2 = {
  nom:'Lumière rasante', court:'Rasante',
  texte:'Un faisceau chaud balaie le visage de haut en bas. La ligne de lumière épouse le vrai relief (elle monte sur le nez) et les points du relief restent allumés après son passage.',
  teinte:{ halo:'255,172,84', coeur:'255,240,218' }, voile:.2, ombre:.3,
  prep(F, t, m){
    const P = F.P, v = F.v, E = F.ech, C = { x:F.box.cx, y:F.box.cy }, n = P.length;
    const pr = p => (p.x - C.x)*v.x + (p.y - C.y)*v.y;
    const top = pr(P[10]) - .06*E, bot = pr(P[152]) + .03*E, D = PAS*ETAPES.length;
    const ct = ((t % CYCLE) + CYCLE) % CYCLE, scan = ct < D, s = Math.min(1, ct/D), vb = top + s*(bot - top);
    Object.assign(m, { top, bot, vb, scan, s, ct, C });
    if(!m.H || m.H.length !== n) m.H = new Float32Array(n);
    for(let i = 0; i < n; i++){
      const pi = pr(P[i]), ti = (pi - top)/(bot - top)*D; let h = 0;
      if(ct >= ti) h = Math.exp(-(ct - ti)/1.5);
      if(scan){ const w = (pi - vb)/(.028*E); h = Math.max(h, Math.exp(-w*w)*1.15); }
      m.H[i] = F.N[i] < .3 ? 0 : h*(.1 + .9*F.N[i]*F.N[i]);   /* le relief : ce qui avance vers la camera s'allume plus */
    }
    m.ligne = scan && s > .01 && s < .99 ? coupe(F, v.x, v.y, C.x*v.x + C.y*v.y + vb, .3) : null;
    /* les lignes de relief laissees derriere le faisceau, comme un releve en 3D : elles s'effacent en s'eloignant */
    m.topo = []; if(scan){ const pasL = .034*E; for(let y = vb - pasL; y > top && m.topo.length < 16; y -= pasL){ const l = coupe(F, v.x, v.y, C.x*v.x + C.y*v.y + y, .3); if(l.length > 3) m.topo.push({ l, a:Math.max(0, 1 - (vb - y)/(.42*E)) }); } }
    m.nez = scan ? Math.exp(-Math.pow((pr(P[1]) - vb)/(.05*E), 2)) : 0;
    /* la zone que le faisceau traverse */
    let best = 0, bd = 1e9; F.zones.forEach((z, j) => { const d = Math.abs(pr(z.c) - vb); if(d < bd){ bd = d; best = j; } });
    m.zone = best;
  },
  lueur(g, F, t, m){
    const P = F.P, u = F.u, v = F.v, E = F.ech, lw = F.lw, h = this.teinte.halo, C = m.C;
    rimLueur(g, F, t, h, .5);
    for(const k of m.topo){ if(k.a < .05) continue; g.beginPath(); lisse(g, k.l, false); g.lineWidth = .9*lw; g.strokeStyle = rgba(h, .16*k.a); g.stroke(); }
    if(m.nez > .05){ const n = P[1], rg = g.createRadialGradient(n.x, n.y, 0, n.x, n.y, .16*E); rg.addColorStop(0, rgba('255,236,200', .45*m.nez)); rg.addColorStop(1, rgba(h, 0)); g.fillStyle = rg; g.fillRect(n.x - .2*E, n.y - .2*E, .4*E, .4*E);
      /* trait anamorphique : un eclat horizontal le long du faisceau */
      const L = F.box.w*.7, a = { x:n.x - u.x*L, y:n.y - u.y*L }, b = { x:n.x + u.x*L, y:n.y + u.y*L }, gl = g.createLinearGradient(a.x, a.y, b.x, b.y);
      gl.addColorStop(0, rgba(h, 0)); gl.addColorStop(.5, rgba('255,240,215', .45*m.nez)); gl.addColorStop(1, rgba(h, 0)); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineWidth = 1.2*lw; g.strokeStyle = gl; g.stroke(); }
    if(m.scan){
      /* la lumiere deborde un peu au-dessus du faisceau, seulement sur le visage */
      g.save(); g.beginPath(); lisse(g, OVALE.map(i => P[i]), true); g.clip();
      const a = { x:C.x + v.x*(m.vb - .3*E), y:C.y + v.y*(m.vb - .3*E) }, b = { x:C.x + v.x*(m.vb + .02*E), y:C.y + v.y*(m.vb + .02*E) };
      const gr = g.createLinearGradient(a.x, a.y, b.x, b.y);
      gr.addColorStop(0, rgba(h, 0)); gr.addColorStop(.85, rgba(h, .07)); gr.addColorStop(1, rgba(h, 0));
      g.fillStyle = gr; g.fillRect(F.box.x0 - E*.2, F.box.y0 - E*.2, F.box.w + E*.4, F.box.h + E*.4);
      g.restore();
      const L = F.box.w*.95, B0 = { x:C.x + v.x*m.vb - u.x*L, y:C.y + v.y*m.vb - u.y*L }, B1 = { x:C.x + v.x*m.vb + u.x*L, y:C.y + v.y*m.vb + u.y*L };
      const gl = g.createLinearGradient(B0.x, B0.y, B1.x, B1.y); gl.addColorStop(0, rgba(h, 0)); gl.addColorStop(.5, rgba(h, .3)); gl.addColorStop(1, rgba(h, 0));
      g.beginPath(); g.moveTo(B0.x, B0.y); g.lineTo(B1.x, B1.y); g.lineWidth = 1.2*lw; g.strokeStyle = gl; g.stroke();
      if(m.ligne && m.ligne.length > 3){ g.beginPath(); lisse(g, m.ligne, false); g.lineWidth = 1.6*lw; g.lineCap = 'round'; g.strokeStyle = rgba(h, 1); g.stroke(); }
    }
    /* les braises du relief */
    const H = m.H, Bk = [.2, .45, .7, .9];
    for(let j = 0; j < 4; j++){ g.beginPath(); const lo = Bk[j], hi = j < 3 ? Bk[j+1] : 9;
      for(let i = 0; i < P.length; i++){ const v2 = H[i]; if(v2 < lo || v2 >= hi) continue; const r = (.8 + 1*F.N[i])*lw; g.moveTo(P[i].x + r, P[i].y); g.arc(P[i].x, P[i].y, r, 0, TAU); }
      g.fillStyle = rgba(h, .12 + .08*j); g.fill(); }
  },
  trait(x, F, t, m){
    const P = F.P, u = F.u, v = F.v, lw = F.lw, c = this.teinte.coeur, C = m.C, H = m.H, Bk = [.12, .3, .55, .8];
    rimTrait(x, F, t, this.teinte.halo);
    x.lineCap = 'round'; for(const k of m.topo){ if(k.a < .05) continue; x.beginPath(); lisse(x, k.l, false); x.lineWidth = .32*lw; x.strokeStyle = rgba(c, .42*k.a); x.stroke(); }
    for(let j = 0; j < 4; j++){ const lo = Bk[j], hi = j < 3 ? Bk[j+1] : 9, pts = [];
      for(let i = 0; i < P.length; i++){ const v2 = H[i]; if(v2 >= lo && v2 < hi) pts.push(i); }
      if(!pts.length) continue;
      const rr = i => (.3 + .45*F.N[i])*lw*(.8 + .2*j);
      x.beginPath(); for(const i of pts){ const r = rr(i) + .45*lw; x.moveTo(P[i].x + r, P[i].y); x.arc(P[i].x, P[i].y, r, 0, TAU); }
      x.fillStyle = rgba('25,10,0', .06 + .04*j); x.fill();
      x.beginPath(); for(const i of pts){ const r = rr(i); x.moveTo(P[i].x + r, P[i].y); x.arc(P[i].x, P[i].y, r, 0, TAU); }
      x.fillStyle = rgba(c, .32 + .14*j); x.fill(); }
    if(m.scan){
      const L = F.box.w*.95, B0 = { x:C.x + v.x*m.vb - u.x*L, y:C.y + v.y*m.vb - u.y*L }, B1 = { x:C.x + v.x*m.vb + u.x*L, y:C.y + v.y*m.vb + u.y*L };
      const gl = x.createLinearGradient(B0.x, B0.y, B1.x, B1.y); gl.addColorStop(0, rgba(c, 0)); gl.addColorStop(.3, rgba(c, .75)); gl.addColorStop(.7, rgba(c, .75)); gl.addColorStop(1, rgba(c, 0));
      x.beginPath(); x.moveTo(B0.x, B0.y); x.lineTo(B1.x, B1.y); x.lineWidth = .4*lw; x.strokeStyle = gl; x.stroke();
      if(m.ligne && m.ligne.length > 3){ x.lineCap = 'round'; x.lineJoin = 'round';
        x.beginPath(); lisse(x, m.ligne, false); x.lineWidth = 1.3*lw; x.strokeStyle = 'rgba(40,16,0,.2)'; x.stroke();
        x.lineWidth = .55*lw; x.strokeStyle = rgba(c, .92); x.stroke(); }
    }
  },
  bulle(F, t, m){
    if(!m.scan) return null;
    const z = F.zones[m.zone];
    return { ancre:z.droite, titre:z.nom, sous:F.mesTxt(m.zone), k:m.s };
  },
};

/* ======================= V3 — CONTOURS ET ZONES ======================= */
const V3 = {
  nom:'Contours et zones', court:'Zones',
  texte:'Les zones mesurées sont dessinées sur le visage. Chacune s’allume au moment où elle est lue, avec son nom ; une zone lue reste tracée.',
  teinte:{ halo:'70,226,160', coeur:'230,255,243' }, voile:.26, ombre:.6,
  prep(){},
  lueur(g, F, t, m){
    const lec = F.lec, lw = F.lw, h = this.teinte.halo;
    F.zones.forEach((z, j) => {
      if(!(lec.fini || j === lec.i)) return;
      const a = lec.fini ? 1 - sm(.45, 1, lec.k) : sm(0, .15, lec.k), trace = lec.fini ? 1 : sm(0, .4, lec.k);
      z.polys.forEach(p => {
        g.beginPath(); lisse(g, p, true);
        g.fillStyle = rgba(h, (lec.fini ? .1 : .13)*a*trace); g.fill();
        if(trace < 1){ const L = perimetre(p)*1.05; g.setLineDash([L*trace, L]); }
        g.lineWidth = 3.6*lw; g.strokeStyle = rgba(h, a); g.stroke(); g.setLineDash([]);
      });
    });
  },
  trait(x, F, t, m){
    const lec = F.lec, lw = F.lw, c = this.teinte.coeur;
    x.lineJoin = 'round'; x.lineCap = 'round';
    F.zones.forEach((z, j) => {
      const actif = lec.fini || j === lec.i, lu = lec.fini || j < lec.i;
      z.polys.forEach(p => {
        x.beginPath(); lisse(x, p, true);
        if(actif && !lec.fini){
          const trace = sm(0, .4, lec.k);
          x.fillStyle = rgba(c, .07*trace); x.fill();
          if(trace < 1){ const L = perimetre(p)*1.05; x.setLineDash([L*trace, L]); }
          x.lineWidth = 2.8*lw; x.strokeStyle = 'rgba(0,18,10,.45)'; x.stroke();
          x.lineWidth = 1.35*lw; x.strokeStyle = rgba(c, 1); x.stroke(); x.setLineDash([]);
        } else if(lu){
          x.lineWidth = 2*lw; x.strokeStyle = 'rgba(0,18,10,.32)'; x.stroke();
          x.lineWidth = .95*lw; x.strokeStyle = rgba(c, .8); x.stroke();
        } else {
          x.setLineDash([1.2*lw, 3.4*lw]);
          x.lineWidth = 1.9*lw; x.strokeStyle = 'rgba(0,18,10,.25)'; x.stroke();
          x.lineWidth = .85*lw; x.strokeStyle = rgba(c, .62); x.stroke(); x.setLineDash([]);
        }
      });
      /* une zone lue garde un petit repere */
      if(lu && !(actif && !lec.fini)){ const q = z.droite, r = 1.8*lw;
        x.beginPath(); x.arc(q.x, q.y, r + 1*lw, 0, TAU); x.fillStyle = 'rgba(0,18,10,.4)'; x.fill();
        x.beginPath(); x.arc(q.x, q.y, r, 0, TAU); x.fillStyle = rgba(c, .95); x.fill(); }
    });
  },
};

/* ======================= V4 — CONSTELLATION ======================= */
const SOURCILS = [70,63,105,66,107,336,296,334,293,300];
const YEUX = [33,160,158,133,153,144,263,387,385,362,380,373];
const NEZ = [168,6,197,195,5,4,1,98,327,129,358];
const LEVRES = [61,40,37,0,267,270,291,321,314,17,84,91];
const V4 = {
  nom:'Constellation', court:'Constellation',
  texte:'Les points du visage deviennent des étoiles reliées par des fils. Plus un point est proche de la caméra, plus il est grand et chaud ; la zone lue s’illumine.',
  teinte:{ halo:'190,206,255', coeur:'255,250,240' }, voile:.5, ombre:.5,
  init(T, Px){
    const H0 = Math.hypot(Px[10].x - Px[152].x, Px[10].y - Px[152].y) || 1, pris = [];
    const loin = (i, dmin) => pris.every(j => Math.hypot(Px[i].x - Px[j].x, Px[i].y - Px[j].y) >= dmin*H0);
    for(const i of [...OVALE, ...SOURCILS, ...YEUX, ...NEZ, ...LEVRES]) if(!pris.includes(i) && loin(i, .028)) pris.push(i);
    for(let i = 0; i < 468; i += 3) if(!pris.includes(i) && loin(i, .07)) pris.push(i);
    const fils = new Set(), ajout = (a, b) => fils.add(a < b ? a + ',' + b : b + ',' + a);
    for(const i of pris){
      const d = pris.filter(j => j !== i).map(j => [j, Math.hypot(Px[i].x - Px[j].x, Px[i].y - Px[j].y)]).sort((a, b) => a[1] - b[1]);
      for(let q = 0; q < 2; q++) if(d[q] && d[q][1] < .16*H0) ajout(i, d[q][0]);
    }
    const ov = OVALE.filter(i => pris.includes(i)); ov.forEach((i, q) => ajout(i, ov[(q + 1) % ov.length]));
    this.T = { etoiles:pris, fils:[...fils].map(s => s.split(',').map(Number)), h1:pris.map(hash), h2:pris.map(i => hash(i + 91)) };
  },
  prep(F, t, m){
    const T = this.T, lec = F.lec, zone = F.topo.zone, N = F.N, n = T.etoiles.length;
    if(!m.R || m.R.length !== n){ m.R = new Float32Array(n); m.A = new Float32Array(n); m.B = new Float32Array(n); }
    for(let q = 0; q < n; q++){ const i = T.etoiles[q];
      const tw = .62 + .38*Math.sin(t*(1.2 + 2.4*T.h1[q]) + TAU*T.h2[q]);
      let b = 0;
      if(!lec.fini && zone[i] === lec.i) b = sm(0, .2, lec.k)*(1 - .35*sm(.8, 1, lec.k));
      else if(lec.fini && zone[i] >= 0) b = Math.max(0, 1 - Math.abs((F.P[i].y - F.box.y0)/F.box.h - lec.k*1.3)*3.5)*.9;
      m.B[q] = b; m.A[q] = Math.min(1, (.4 + .6*N[i])*tw + b*.6);
      m.R[q] = (.6 + 1.5*N[i])*F.lw*(.85 + .25*tw)*(1 + .3*b);
    }
  },
  lueur(g, F, t, m){
    const T = this.T, P = F.P, h = this.teinte.halo, lw = F.lw, zone = F.topo.zone, lec = F.lec;
    g.lineCap = 'round';
    g.beginPath(); for(const [a, b] of T.fils){ g.moveTo(P[a].x, P[a].y); g.lineTo(P[b].x, P[b].y); }
    g.lineWidth = 1.3*lw; g.strokeStyle = rgba(h, .2); g.stroke();
    if(!lec.fini){ g.beginPath(); for(const [a, b] of T.fils) if(zone[a] === lec.i && zone[b] === lec.i){ g.moveTo(P[a].x, P[a].y); g.lineTo(P[b].x, P[b].y); }
      g.lineWidth = 2.6*lw; g.strokeStyle = rgba(h, .75*sm(0, .2, lec.k)); g.stroke(); }
    T.etoiles.forEach((i, q) => { g.beginPath(); g.arc(P[i].x, P[i].y, m.R[q]*2.2 + 1.2*lw, 0, TAU); g.fillStyle = rgba(h, .4*m.A[q] + .3*m.B[q]); g.fill(); });
  },
  trait(x, F, t, m){
    const T = this.T, P = F.P, N = F.N, lw = F.lw, zone = F.topo.zone, lec = F.lec;
    /* les fils : trois intensites selon la profondeur */
    const paq = [[], [], []];
    for(const f of T.fils){ const nn = (N[f[0]] + N[f[1]])/2; paq[nn > .66 ? 2 : nn > .33 ? 1 : 0].push(f); }
    x.lineCap = 'round';
    paq.forEach((l, j) => { if(!l.length) return; x.beginPath(); seg(x, P, l);
      x.lineWidth = 1.5*lw; x.strokeStyle = rgba('0,4,20', .16 + .05*j); x.stroke();
      x.lineWidth = .65*lw; x.strokeStyle = rgba(j === 2 ? '255,246,232' : j === 1 ? '228,232,255' : '190,205,255', .42 + .14*j); x.stroke(); });
    /* des eclats de lumiere glissent le long des fils de la zone lue */
    if(!lec.fini){ x.beginPath(); let q = 0;
      for(const [a, b] of T.fils){ if(zone[a] !== lec.i || zone[b] !== lec.i) continue; const f = (t*.9 + hash(a*7 + b)) % 1, px = P[a].x + (P[b].x - P[a].x)*f, py = P[a].y + (P[b].y - P[a].y)*f, r = 1.3*lw;
        x.moveTo(px + r, py); x.arc(px, py, r, 0, TAU); q++; }
      if(q){ x.fillStyle = rgba('255,255,255', .9*sm(0, .2, lec.k)); x.fill(); } }
    /* les etoiles : liseré sombre, coeur dont la couleur suit la profondeur, eclat en croix pour les plus proches */
    T.etoiles.forEach((i, q) => {
      const p = P[i], r = m.R[q], a = m.A[q], n = N[i];
      x.beginPath(); x.arc(p.x, p.y, r + 1*lw, 0, TAU); x.fillStyle = rgba('0,4,20', .32*a); x.fill();
      const col = n > .66 || m.B[q] > .3 ? '255,248,236' : n > .33 ? '232,236,255' : '188,204,255';
      x.beginPath(); x.arc(p.x, p.y, r, 0, TAU); x.fillStyle = rgba(col, Math.min(1, a + .15)); x.fill();
      if((n > .72 && a > .8) || m.B[q] > .6){ const L = r*(3 + 1.2*m.B[q]);
        x.beginPath(); x.moveTo(p.x - L, p.y); x.lineTo(p.x + L, p.y); x.moveTo(p.x, p.y - L); x.lineTo(p.x, p.y + L);
        x.lineWidth = .6*lw; x.strokeStyle = rgba('255,252,244', .55*a); x.stroke(); }
    });
  },
};

export const VARIANTES = [V1, V2, V3, V4];
