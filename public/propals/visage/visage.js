/* 07/10/2026 — page de propositions : l'animation posee sur le visage pendant le scan.
   La camera (ou une photo de test) est lue sur l'appareil par MediaPipe FaceLandmarker
   (478 points). L'image n'est jamais envoyee. Les valeurs L* a* affichees sont mesurees
   dans les pixels de l'image, zone par zone.
   Parametres : ?photo=p_192 · ?v=1..4 · ?mode=quad · ?nu=1 (la scene seule) · ?debug=1 */
import { FilesetResolver, FaceLandmarker } from '/cheveux/vendor/mediapipe/vision_bundle.mjs';
import { VARIANTES, ETAPES, OVALE, lecture, rgba, lisse } from '/propals/visage/variantes.js';

const Q = new URLSearchParams(location.search);
const DEBUG = Q.has('debug');
const $ = s => document.querySelector(s);
const SANS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const PHOTOS = ['p_073', 'p_192', 'p_330', 'p_284', 'p_232', 'p_081'];

/* ---------------- le moteur de points du visage ---------------- */
let face = null, promesse = null, ARETES = null;
function moteur(){
  if(promesse) return promesse;
  promesse = (async () => {
    const fs = await FilesetResolver.forVisionTasks('/cheveux/vendor/mediapipe/wasm');
    const o = d => ({ baseOptions:{ modelAssetPath:'/cheveux/vendor/mediapipe/modeles/face_landmarker.task', delegate:d }, runningMode:'VIDEO', numFaces:1 });
    try { face = await FaceLandmarker.createFromOptions(fs, o('GPU')); } catch(e){ face = await FaceLandmarker.createFromOptions(fs, o('CPU')); }
    const vu = new Set(); ARETES = [];
    for(const e of FaceLandmarker.FACE_LANDMARKS_TESSELATION){ const a = Math.min(e.start, e.end), b = Math.max(e.start, e.end), k = a*1000 + b; if(!vu.has(k)){ vu.add(k); ARETES.push([a, b]); } }
    return face;
  })();
  promesse.catch(() => { promesse = null; });
  return promesse;
}

/* ---------------- l'etat ---------------- */
const S = {
  mode: Q.get('mode') === 'quad' ? 'quad' : 'seul',
  v: Math.max(0, Math.min(3, (parseInt(Q.get('v'), 10) || 1) - 1)),
  src: null, cible: null, L: null, vu: -1e9, t0: null, topo: null, mes: [], mesT: 0,
  dernDet: 0, dernTs: 0, neuf: false, message: 'Chargement des points du visage…',
};
const ana = document.createElement('canvas'), actx = ana.getContext('2d', { willReadFrequently:true });
const perf = { n:0, ms:0, nDet:0, msDet:0, t:performance.now(), ips:0, det:0, dessin:0, lecture:0 };
window.__perf = perf;

/* ---------------- les scenes (une par variante) ---------------- */
const scenes = VARIANTES.map((V, j) => {
  const el = document.createElement('figure'); el.className = 'scene'; el.dataset.v = j;
  el.innerHTML = '<video playsinline muted autoplay></video><canvas class="fond"></canvas><canvas class="ov" aria-hidden="true"></canvas>'
    + '<figcaption><b>V' + (j + 1) + '</b> ' + V.nom + '</figcaption>';
  $('#scenes').appendChild(el);
  const sc = { j, V, el, video:el.querySelector('video'), fond:el.querySelector('.fond'), ov:el.querySelector('.ov'), W:0, H:0, cle:'', mem:{} };
  sc.x = sc.ov.getContext('2d'); sc.fx = sc.fond.getContext('2d');
  sc.g1 = document.createElement('canvas'); sc.g1x = sc.g1.getContext('2d');
  sc.g2 = document.createElement('canvas'); sc.g2x = sc.g2.getContext('2d');
  sc.g3 = document.createElement('canvas'); sc.g3x = sc.g3.getContext('2d');
  sc.dk = document.createElement('canvas'); sc.dkx = sc.dk.getContext('2d');
  new ResizeObserver(() => { const r = el.getBoundingClientRect(); sc.W = r.width; sc.H = r.height; sc.cle = ''; }).observe(el);
  el.addEventListener('click', () => { if(S.mode === 'quad'){ S.mode = 'seul'; S.v = j; majUI(); } });
  return sc;
});
const visibles = () => S.mode === 'quad' ? scenes : [scenes[S.v]];

/* ---------------- interface ---------------- */
function majUI(){
  document.body.classList.toggle('quad', S.mode === 'quad');
  scenes.forEach(sc => sc.el.classList.toggle('on', S.mode === 'quad' || sc.j === S.v));
  document.querySelectorAll('[data-v]').forEach(b => { if(b.tagName === 'BUTTON') b.classList.toggle('on', S.mode === 'seul' && +b.dataset.v === S.v); });
  const bq = $('#bQuad'); if(bq) bq.classList.toggle('on', S.mode === 'quad');
  const V = VARIANTES[S.v];
  $('#iNom').textContent = S.mode === 'quad' ? 'Les quatre côte à côte' : 'V' + (S.v + 1) + ' · ' + V.nom;
  $('#iTxt').textContent = S.mode === 'quad' ? 'Touchez une variante pour l’agrandir.' : V.texte;
  document.querySelectorAll('[data-photo]').forEach(b => b.classList.toggle('on', S.src && S.src.type === 'photo' && S.src.nom === b.dataset.photo));
  $('#bCam').classList.toggle('on', !!(S.src && S.src.type === 'cam'));
  document.body.classList.toggle('src-cam', !!(S.src && S.src.type === 'cam'));
}
document.querySelectorAll('button[data-v]').forEach(b => b.addEventListener('click', () => { S.mode = 'seul'; S.v = +b.dataset.v; majUI(); }));
$('#bQuad').addEventListener('click', () => { S.mode = 'quad'; majUI(); });
document.querySelectorAll('[data-photo]').forEach(b => b.addEventListener('click', () => ouvrirPhoto(b.dataset.photo)));
$('#bCam').addEventListener('click', ouvrirCam);
if(Q.has('nu')) document.body.classList.add('nu');

function remettre(){ S.cible = S.L = S.topo = null; S.t0 = null; S.mes = []; S.vu = -1e9; scenes.forEach(sc => { sc.cle = ''; sc.mem = {}; }); }
function arreterCam(){ if(S.src && S.src.type === 'cam'){ S.src.stream.getTracks().forEach(t => t.stop()); scenes.forEach(sc => { sc.video.srcObject = null; }); } }

async function ouvrirCam(){
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user', width:{ ideal:1280 }, height:{ ideal:720 } }, audio:false }); }
  catch(e){ S.message = 'Caméra refusée ou indisponible. Essayez une photo de test.'; return; }
  arreterCam(); remettre();
  S.src = { type:'cam', stream }; S.message = 'Placez votre visage face à la caméra';
  scenes.forEach(sc => { sc.video.srcObject = stream; sc.video.play().catch(() => {}); });
  majUI();
  moteur().catch(() => { S.message = 'Les points du visage n’ont pas pu se charger.'; });
}

async function ouvrirPhoto(nom){
  if(!/^[a-z0-9_]+$/.test(nom)) return;
  arreterCam(); remettre();
  S.message = 'Lecture de la photo…';
  const img = new Image(); img.src = '/_test_masque/' + nom + '.jpg';
  try { await img.decode(); } catch(e){ S.message = 'Photo introuvable.'; return; }
  const pc = document.createElement('canvas'); pc.width = img.naturalWidth; pc.height = img.naturalHeight;
  const px = pc.getContext('2d', { willReadFrequently:true }); px.drawImage(img, 0, 0);
  S.src = { type:'photo', nom, img, pc, px };
  majUI();
  try { await moteur(); } catch(e){ S.message = 'Les points du visage n’ont pas pu se charger.'; return; }
  if(!S.src || S.src.pc !== pc) return;
  let n = null;
  for(let k = 0; k < 2 && !n; k++){ const ts = Math.max(performance.now(), S.dernTs + 1); S.dernTs = ts;
    try { const r = face.detectForVideo(pc, ts); n = r.faceLandmarks && r.faceLandmarks[0]; } catch(e){} }
  if(!n){ S.message = 'Aucun visage trouvé sur cette photo.'; return; }
  S.cible = n; S.L = n.map(p => ({ x:p.x, y:p.y, z:p.z })); S.vu = 1e15; S.t0 = performance.now();
  S.topo = topologie(n, pc.width, pc.height); mesurer();
}

/* ---------------- la topologie : quelle zone pour chaque point (calculee une fois par visage) ---------------- */
function dedans(p, poly){ let c = false; for(let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const a = poly[i], b = poly[j];
  if((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x)*(p.y - a.y)/(b.y - a.y) + a.x) c = !c; } return c; }
function topologie(L, sw, sh){
  const Px = L.map(p => ({ x:p.x*sw, y:p.y*sh })), zone = new Int8Array(L.length).fill(-1);
  ETAPES.forEach((e, j) => e.polys.forEach(ids => { const poly = ids.map(i => Px[i]);
    for(let i = 0; i < L.length; i++) if(zone[i] < 0 && dedans(Px[i], poly)) zone[i] = j;
    ids.forEach(i => { if(zone[i] < 0) zone[i] = j; }); }));
  const T = { zone };
  VARIANTES.forEach(V => { if(V.init) V.init(T, Px); });
  return T;
}

/* ---------------- les mesures reelles : L* et a* de chaque zone, lus dans les pixels ---------------- */
function lin(c){ c /= 255; return c <= .04045 ? c/12.92 : Math.pow((c + .055)/1.055, 2.4); }
function lab(r, g, b){ r = lin(r); g = lin(g); b = lin(b);
  let X = (r*.4124 + g*.3576 + b*.1805)/.95047, Y = r*.2126 + g*.7152 + b*.0722, Z = (r*.0193 + g*.1192 + b*.9505)/1.08883;
  const f = t => t > .008856 ? Math.cbrt(t) : 7.787*t + 16/116; X = f(X); Y = f(Y); Z = f(Z); return { L:116*Y - 16, a:500*(X - Y), b:200*(Y - Z) }; }
function mesurer(){
  if(!S.L || !S.src) return;
  const c = S.src.type === 'cam' ? ana : S.src.pc, cx = S.src.type === 'cam' ? actx : S.src.px;
  const W = c.width, H = c.height; if(!W) return;
  let d; try { d = cx.getImageData(0, 0, W, H).data; } catch(e){ return; }
  const L = S.L;
  S.mes = ETAPES.map(e => { let r = 0, g = 0, b = 0, n = 0;
    e.polys.forEach(ids => { const cxp = ids.reduce((s, i) => s + L[i].x, 0)/ids.length*W, cyp = ids.reduce((s, i) => s + L[i].y, 0)/ids.length*H;
      const pts = [[cxp, cyp], ...ids.filter((_, q) => q % 2 === 0).map(i => [cxp + (L[i].x*W - cxp)*.45, cyp + (L[i].y*H - cyp)*.45])];
      const rr = Math.max(1, Math.round(W/320));
      for(const [px, py] of pts) for(let dy = -rr; dy <= rr; dy++) for(let dx = -rr; dx <= rr; dx++){ const x = Math.round(px + dx), y = Math.round(py + dy); if(x < 0 || y < 0 || x >= W || y >= H) continue; const k = (y*W + x)*4; r += d[k]; g += d[k + 1]; b += d[k + 2]; n++; } });
    if(!n) return null; const v = lab(r/n, g/n, b/n); return { L:v.L, a:v.a }; });
}
const f1 = v => v.toFixed(1).replace('.', ',');
const mesTxt = j => { const m = S.mes[j]; return m ? 'L* ' + f1(m.L) + '  ·  a* ' + f1(m.a) : 'lecture…'; };

/* ---------------- la camera : lecture des points a chaque nouvelle image ---------------- */
let rvVideo = null;
const videoActive = () => (S.mode === 'quad' ? scenes[0] : scenes[S.v]).video;
function suivreImages(){
  const vid = videoActive(); if(!vid.requestVideoFrameCallback || rvVideo === vid) return;
  rvVideo = vid; const cb = () => { if(rvVideo !== vid) return; S.neuf = true; vid.requestVideoFrameCallback(cb); };
  vid.requestVideoFrameCallback(cb);
}
let dernTemps = -1;
function lireCam(now){
  const vid = videoActive(); if(!face || !vid.videoWidth) return;
  if(vid.requestVideoFrameCallback){ suivreImages(); if(!S.neuf) return; S.neuf = false; }
  else { if(vid.currentTime === dernTemps) return; dernTemps = vid.currentTime; }
  if(now - S.dernDet < 30) return; S.dernDet = now;
  const w = 480, h = Math.round(w*vid.videoHeight/vid.videoWidth);
  if(ana.width !== w || ana.height !== h){ ana.width = w; ana.height = h; }
  actx.drawImage(vid, 0, 0, w, h);
  const ts = Math.max(now, S.dernTs + 1); S.dernTs = ts;
  const t0 = performance.now(); let r; try { r = face.detectForVideo(ana, ts); } catch(e){ return; }
  perf.msDet += performance.now() - t0; perf.nDet++;
  const n = r.faceLandmarks && r.faceLandmarks[0];
  if(n){ S.cible = n; S.vu = now; if(S.t0 == null) S.t0 = now; if(!S.topo) S.topo = topologie(n, vid.videoWidth, vid.videoHeight); }
}
function lisser(dt){
  const c = S.cible; if(!c) return;
  if(!S.L || S.src.type === 'photo'){ if(!S.L) S.L = c.map(p => ({ x:p.x, y:p.y, z:p.z })); return; }
  const a = 1 - Math.exp(-dt/40);
  for(let i = 0; i < S.L.length; i++){ const p = S.L[i], q = c[i]; p.x += (q.x - p.x)*a; p.y += (q.y - p.y)*a; p.z += (q.z - p.z)*a; }
}

/* ---------------- textes en petites capitales (mis en cache) ---------------- */
const sprites = new Map();
function sprite(txt, px, poids, famille, track, rgb, d){
  const k = [txt, px, poids, famille, rgb, d].join('|'); let s = sprites.get(k); if(s) return s;
  if(sprites.size > 300) sprites.clear();
  const c = document.createElement('canvas'), x = c.getContext('2d'), font = poids + ' ' + px + 'px ' + famille; x.font = font;
  const ch = [...txt], ws = ch.map(q => x.measureText(q).width), tr = px*track;
  const w = ws.reduce((a, b) => a + b, 0) + tr*(ch.length - 1) + 2, h = Math.ceil(px*1.35);
  c.width = Math.ceil(w*d); c.height = Math.ceil(h*d);
  const y = c.getContext('2d'); y.scale(d, d); y.font = font; y.fillStyle = 'rgb(' + rgb + ')'; y.textBaseline = 'middle';
  let cx = 1; ch.forEach((q, i) => { y.fillText(q, cx, h/2 + .5); cx += ws[i] + tr; });
  s = { c, w, h }; sprites.set(k, s); return s;
}
function pastille(x, X, Y, w, h, r){ x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }

/* l'etiquette de la zone lue : un fil part de la zone, une pastille sombre a cote du visage */
function bulle(x, F, b, teinte, d){
  const s = F.s, t1 = sprite(b.titre, Math.round(10.5*s*10)/10, 600, SANS, .16, '255,255,255', d), t2 = b.sous ? sprite(b.sous, Math.round(10*s*10)/10, 500, MONO, 0, '228,234,232', d) : null;
  const pad = 8*s, pw = Math.max(t1.w, t2 ? t2.w : 0) + pad*2 + 3*s, ph = t1.h + (t2 ? t2.h + 2*s : 0) + pad*1.3 + 3*s;
  let lx = F.box.x1 + 16*s; if(lx + pw > F.W - 8) lx = F.W - 8 - pw;
  let ly = b.ancre.y - ph/2; ly = Math.max(8, Math.min(F.H - 8 - ph, ly));
  const ax = b.ancre.x, ay = b.ancre.y, ex = lx, ey = Math.max(ly + 4, Math.min(ly + ph - 4, ay));
  if(ex > ax + 6){
    x.beginPath(); x.moveTo(ax, ay); x.lineTo(ex, ey); x.lineCap = 'round';
    x.lineWidth = 2*F.lw; x.strokeStyle = 'rgba(0,0,0,.35)'; x.stroke();
    x.lineWidth = .8*F.lw; x.strokeStyle = rgba(teinte.coeur, .85); x.stroke();
  }
  x.beginPath(); x.arc(ax, ay, 3.4*F.lw, 0, 7); x.fillStyle = 'rgba(0,0,0,.35)'; x.fill();
  x.beginPath(); x.arc(ax, ay, 2*F.lw, 0, 7); x.fillStyle = rgba(teinte.coeur, 1); x.fill();
  pastille(x, lx, ly, pw, ph, 4*s); x.fillStyle = 'rgba(8,10,12,.62)'; x.fill();
  x.fillStyle = rgba(teinte.halo, .95); x.fillRect(lx, ly + 4*s, 1.6*s, ph - 8*s);
  x.drawImage(t1.c, lx + pad + 3*s, ly + pad*.65, t1.w, t1.h);
  if(t2) x.drawImage(t2.c, lx + pad + 3*s, ly + pad*.65 + t1.h + 2*s, t2.w, t2.h);
  const bw = pw - pad*2 - 3*s; x.fillStyle = 'rgba(255,255,255,.14)'; x.fillRect(lx + pad + 3*s, ly + ph - 4*s, bw, 1.4*s);
  x.fillStyle = rgba(teinte.coeur, .95); x.fillRect(lx + pad + 3*s, ly + ph - 4*s, bw*Math.max(0, Math.min(1, b.k)), 1.4*s);
}

/* ---------------- le rendu d'une scene ---------------- */
function tailler(c, w, h){ w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h)); if(c.width !== w || c.height !== h){ c.width = w; c.height = h; } }

function cadrePhoto(sc){
  const { img } = S.src, iw = img.naturalWidth, ih = img.naturalHeight, W = sc.W, H = sc.H;
  let x0 = 1, x1 = 0, y0 = 1, y1 = 0; for(const i of OVALE){ const p = S.cible[i]; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const fw = (x1 - x0)*iw, fh = (y1 - y0)*ih, fcx = (x0 + x1)/2*iw, fcy = (y0 + y1)/2*ih;
  const cover = Math.max(W/iw, H/ih); let s = Math.min(.5*H/fh, .6*W/fw, 4); if(s < cover) s = cover;
  let ox = W/2 - fcx*s, oy = H*.47 - fcy*s;
  ox = iw*s >= W ? Math.min(0, Math.max(W - iw*s, ox)) : (W - iw*s)/2;
  oy = ih*s >= H ? Math.min(0, Math.max(H - ih*s, oy)) : (H - ih*s)/2;
  return { s, ox, oy, sw:iw, sh:ih };
}

function rendre(sc, t, now){
  const W = sc.W, H = sc.H; if(!W || !H) return;
  const d = Math.min(S.mode === 'quad' ? 1.5 : 2, devicePixelRatio || 1);
  tailler(sc.ov, W*d, H*d);
  const x = sc.x; x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W, H);
  const cam = S.src && S.src.type === 'cam', vid = sc.video;
  /* la photo : posee une fois par taille, cadree sur le visage */
  if(S.src && S.src.type === 'photo'){
    const cle = W + 'x' + H + S.src.nom + (S.cible ? 1 : 0);
    if(sc.cle !== cle){ sc.cle = cle; tailler(sc.fond, W*d, H*d); const f = sc.fx; f.setTransform(d, 0, 0, d, 0, 0); f.fillStyle = '#0b0c0d'; f.fillRect(0, 0, W, H);
      if(S.cible){ sc.map = cadrePhoto(sc); f.drawImage(S.src.img, sc.map.ox, sc.map.oy, sc.map.sw*sc.map.s, sc.map.sh*sc.map.s); }
      else { const iw = S.src.img.naturalWidth, ih = S.src.img.naturalHeight, s = Math.max(W/iw, H/ih); f.drawImage(S.src.img, (W - iw*s)/2, (H - ih*s)/2, iw*s, ih*s); } }
  }
  const present = S.L && (cam ? now - S.vu < 900 : true);
  if(!present || (cam && !vid.videoWidth)){ attente(x, W, H, t, sc, d); return; }
  /* la correspondance image -> ecran (comme object-fit: cover, miroir pour la camera) */
  let sw, sh, s, ox, oy, mir;
  if(cam){ sw = vid.videoWidth; sh = vid.videoHeight; s = Math.max(W/sw, H/sh); ox = (W - sw*s)/2; oy = (H - sh*s)/2; mir = true; }
  else { ({ sw, sh, s, ox, oy } = sc.map); mir = false; }
  const L = S.L, n = L.length, dw = sw*s, dh = sh*s;
  const m = sc.mem; if(!m.P || m.P.length !== n){ m.P = L.map(() => ({ x:0, y:0 })); m.Z = new Float32Array(n); m.N = new Float32Array(n); }
  const P = m.P, Z = m.Z, N = m.N; let zmin = 1e9, zmax = -1e9;
  for(let i = 0; i < n; i++){ P[i].x = ox + (mir ? 1 - L[i].x : L[i].x)*dw; P[i].y = oy + L[i].y*dh; Z[i] = L[i].z*dw; if(Z[i] < zmin) zmin = Z[i]; if(Z[i] > zmax) zmax = Z[i]; }
  for(let i = 0; i < n; i++) N[i] = (zmax - Z[i])/((zmax - zmin) || 1);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, zr = 0;
  for(const i of OVALE){ const p = P[i]; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); zr += Z[i]; }
  const box = { x0, y0, x1, y1, w:x1 - x0, h:y1 - y0, cx:(x0 + x1)/2, cy:(y0 + y1)/2 };
  let u = { x:P[263].x - P[33].x, y:P[263].y - P[33].y }; const ul = Math.hypot(u.x, u.y) || 1; u = { x:u.x/ul, y:u.y/ul }; if(u.x < 0) u = { x:-u.x, y:-u.y };
  const v = { x:-u.y, y:u.x };
  const ech = Math.hypot(P[10].x - P[152].x, P[10].y - P[152].y);
  const zones = ETAPES.map((e, j) => { const polys = e.polys.map(ids => ids.map(i => P[i]));
    const cs = e.polys.map(ids => { let a = 0, b = 0, c = 0; ids.forEach(i => { a += P[i].x; b += P[i].y; c += Z[i]; }); return { x:a/ids.length, y:b/ids.length, z:c/ids.length }; });
    const c = { x:cs.reduce((q, p) => q + p.x, 0)/cs.length, y:cs.reduce((q, p) => q + p.y, 0)/cs.length };
    const droite = cs.reduce((a, b) => b.x > a.x ? b : a);
    return { nom:e.nom, polys, cs, c, droite }; });
  const F = { P, Z, zpx:Z, N, W, H, box, u, v, ech, zref:zr/OVALE.length, zones, aretes:ARETES, topo:S.topo, lec:lecture(t), mesTxt,
    lw:Math.max(.75, Math.min(1.7, ech/230)), s:Math.max(.78, Math.min(1.15, Math.min(W, H)/430)) };
  const V = sc.V;

  /* 1. le voile : assombrit doucement autour du visage, jamais la peau */
  if(V.voile){ x.save(); x.translate(box.cx, box.cy); x.rotate(Math.atan2(u.y, u.x)); x.scale(1, box.h/box.w*1.02);
    const R = box.w*.5, gr = x.createRadialGradient(0, 0, R*1.05, 0, 0, R*2.3);
    gr.addColorStop(0, 'rgba(4,6,8,0)'); gr.addColorStop(1, 'rgba(4,6,8,' + V.voile + ')');
    x.fillStyle = gr; x.fillRect(-W*3, -H*3, W*6, H*6); x.restore(); }

  V.prep(F, t, m);
  /* 2. la lumiere : dessinee petit (1/3), floutee en la reduisant, posee en lumiere additive */
  const g1w = Math.ceil(W/3), g1h = Math.ceil(H/3);
  tailler(sc.g1, g1w, g1h); tailler(sc.g2, g1w/2, g1h/2); tailler(sc.g3, g1w/6, g1h/6); tailler(sc.dk, g1w/2, g1h/2);
  const g = sc.g1x; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, g1w, g1h); g.setTransform(1/3, 0, 0, 1/3, 0, 0);
  V.lueur(g, F, t, m);
  const g2 = sc.g2x; g2.globalCompositeOperation = 'copy'; g2.drawImage(sc.g1, 0, 0, sc.g2.width, sc.g2.height);
  const g3 = sc.g3x; g3.globalCompositeOperation = 'copy'; g3.drawImage(sc.g2, 0, 0, sc.g3.width, sc.g3.height);
  const dk = sc.dkx; dk.globalCompositeOperation = 'copy'; dk.drawImage(sc.g2, 0, 0); dk.globalCompositeOperation = 'source-in'; dk.fillStyle = '#000'; dk.fillRect(0, 0, sc.dk.width, sc.dk.height);
  /* l'ombre portee de la lumiere : un halo sombre, un peu plus bas, qui detache le trait de la peau */
  x.globalAlpha = V.ombre; x.drawImage(sc.dk, 0, ech*.012, W, H);
  x.globalCompositeOperation = 'lighter';
  x.globalAlpha = .9; x.drawImage(sc.g3, 0, 0, W, H);
  x.globalAlpha = .85; x.drawImage(sc.g2, 0, 0, W, H);
  x.globalAlpha = .45; x.drawImage(sc.g1, 0, 0, W, H);
  x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
  /* 3. les traits nets */
  V.trait(x, F, t, m);
  /* 4. ce qui se passe : la zone lue, sa mesure */
  let b = V.bulle ? V.bulle(F, t, m) : undefined;
  if(b === undefined){ const lec = F.lec; b = lec.fini ? { ancre:P[152], titre:'LECTURE COMPLÈTE', sous:'4 zones lues', k:1 } : { ancre:zones[lec.i].droite, titre:zones[lec.i].nom, sous:mesTxt(lec.i), k:lec.k }; }
  if(V.bulle && b === null && F.lec.fini) b = { ancre:P[152], titre:'LECTURE COMPLÈTE', sous:'4 zones lues', k:1 };
  if(b) bulle(x, F, b, V.teinte, d);
  if(DEBUG) debug(x, F);
}

function attente(x, W, H, t, sc, d){
  const cx = W/2, cy = H*.47, rx = Math.min(W*.3, H*.24), ry = rx*1.3;
  x.save(); x.setLineDash([2, 5]); x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7);
  x.lineWidth = 2.4; x.strokeStyle = 'rgba(0,0,0,.25)'; x.stroke(); x.lineWidth = 1; x.strokeStyle = 'rgba(255,255,255,' + (.55 + .2*Math.sin(t*2)) + ')'; x.stroke(); x.restore();
  const msg = face || !S.src ? (S.src ? S.message : 'Ouvrez la caméra ou choisissez une photo') : 'Chargement des points du visage…';
  const s = sprite(msg.toUpperCase(), 10.5, 600, SANS, .14, '255,255,255', d), pw = s.w + 20, ph = s.h + 12;
  pastille(x, cx - pw/2, cy + ry + 18, pw, ph, 4); x.fillStyle = 'rgba(8,10,12,.6)'; x.fill();
  x.drawImage(s.c, cx - s.w/2, cy + ry + 24, s.w, s.h);
}

function debug(x, F){
  x.font = '9px ' + MONO; x.fillStyle = '#ff0';
  F.zones.forEach(z => z.polys.forEach(p => { x.beginPath(); p.forEach((q, i) => i ? x.lineTo(q.x, q.y) : x.moveTo(q.x, q.y)); x.closePath(); x.strokeStyle = '#ff0'; x.lineWidth = 1; x.stroke(); }));
  ETAPES.forEach(e => e.polys.forEach(ids => ids.forEach(i => x.fillText(i, F.P[i].x + 2, F.P[i].y - 2))));
}

/* ---------------- la boucle ---------------- */
let dern = 0;
function boucle(now){
  requestAnimationFrame(boucle);
  const dt = Math.min(100, now - (dern || now)); dern = now;
  if(S.src && S.src.type === 'cam') lireCam(now);
  lisser(dt);
  if(S.L && now - S.mesT > 400){ S.mesT = now; mesurer(); }
  const t = typeof window.__T === 'number' ? window.__T : (S.t0 != null ? (now - S.t0)/1000 : now/1000);
  const t0 = performance.now();
  for(const sc of visibles()) rendre(sc, t, now);
  perf.ms += performance.now() - t0; perf.n++;
  if(now - perf.t > 1000){
    const k = 1000/(now - perf.t);
    perf.ips = Math.round(perf.n*k); perf.det = Math.round(perf.nDet*k); perf.dessin = perf.n ? perf.ms/perf.n : 0; perf.lecture = perf.nDet ? perf.msDet/perf.nDet : 0;
    perf.n = perf.ms = perf.nDet = perf.msDet = 0; perf.t = now;
    const el = $('#iPerf'); if(el) el.textContent = 'Fluidité : ' + perf.ips + ' images/s · dessin ' + f1(perf.dessin) + ' ms' + (S.src && S.src.type === 'cam' ? ' · points du visage lus ' + perf.det + ' fois/s' : '');
  }
}

/* pour les captures : choisir la variante et figer l'instant */
window.__regler = (v, T, mode) => { if(mode) S.mode = mode; if(v != null){ S.v = v; } window.__T = T; majUI(); return true; };
window.__pret = () => !!(S.L && S.topo);

majUI();
requestAnimationFrame(boucle);
moteur().then(() => { if(!S.src) S.message = 'Ouvrez la caméra ou choisissez une photo'; }).catch(() => { S.message = 'Les points du visage n’ont pas pu se charger.'; });
const ph = Q.get('photo');
if(Q.get('cam') === '1') ouvrirCam();
else ouvrirPhoto(ph || 'p_073');
