/* 30/09 (Charles) : pendant le scan aliment, la cartographie du visage des propales laser.
   D'abord la TOPOGRAPHIE (modele 28 : courbes de niveau du vrai relief, cotes chiffrees),
   puis elle devient le GRATICULE (modele 29 : parallèles et meridiens poses sur le relief,
   un curseur qui donne ses coordonnees). Couleur : or champagne, plus sobre que le rouge labo.
   Le module se pose tout seul sur la camera ou la photo du scan (.camera video / .camera img).
   Il ne touche pas au moteur de lecture de peau : il lit le visage de son cote (MediaPipe, 478 points). */
import { FilesetResolver, FaceLandmarker } from '/cheveux/vendor/mediapipe/vision_bundle.mjs';

const TEINTES = {
  or:    { halo:'214,176,112', trait:'226,194,138', coeur:'255,247,230', texte:'255,246,228' },
  sauge: { halo:'150,176,140', trait:'182,204,170', coeur:'240,248,236', texte:'240,248,236' },
  nacre: { halo:'205,214,232', trait:'232,236,245', coeur:'255,255,255', texte:'255,255,255' } };
const K = TEINTES[new URLSearchParams(location.search).get('carto')] || TEINTES.or;
const rgba = (c, a) => 'rgba(' + c + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')';
const OVALE = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const TOPO = 5.5, FONDU = 1.4;   // secondes de topographie, puis fondu vers le graticule

let face = null, facePromesse = null, ARETES = null;
function moteur(){
  if(facePromesse) return facePromesse;
  facePromesse = (async () => {
    const fs = await FilesetResolver.forVisionTasks('/cheveux/vendor/mediapipe/wasm');
    const o = d => ({ baseOptions:{ modelAssetPath:'/cheveux/vendor/mediapipe/modeles/face_landmarker.task', delegate:d }, runningMode:'VIDEO', numFaces:1 });
    try { face = await FaceLandmarker.createFromOptions(fs, o('GPU')); } catch(e){ face = await FaceLandmarker.createFromOptions(fs, o('CPU')); }
    ARETES = FaceLandmarker.FACE_LANDMARKS_TESSELATION; return face;
  })();
  return facePromesse;
}

/* 07/10 (Charles) : l'animation V1 « Maillage lumineux » des propositions (/propals/visage), a valider.
   Active avec ?visage=v1 (garde ensuite sur cet appareil ; ?visage=0 revient a l'ancienne).
   Elle ne change que le DESSIN : les mesures en direct et le declenchement de la lecture restent ceux d'ici. */
let MODE_V1 = false;
try { const qv = (location.search.match(/[?&]visage=(v1|0)\b/) || [])[1]; if(qv) localStorage.setItem('vy-visage', qv); MODE_V1 = (qv || localStorage.getItem('vy-visage')) === 'v1'; } catch(e){ MODE_V1 = /[?&]visage=v1\b/.test(location.search); }
let V1M = null, ARETES2 = null;
if(MODE_V1) import('/propals/visage/variantes.js?v=4').then(m => { V1M = m; }).catch(() => { MODE_V1 = false; });
function aretes2(){ if(ARETES2) return ARETES2; const vu = new Set(); ARETES2 = []; for(const e of ARETES){ const a = Math.min(e.start, e.end), b = Math.max(e.start, e.end), k = a*1000 + b; if(!vu.has(k)){ vu.add(k); ARETES2.push([a, b]); } } return ARETES2; }
function dedansV(p, poly){ let c = false; for(let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const a = poly[i], b = poly[j]; if((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x)*(p.y - a.y)/(b.y - a.y) + a.x) c = !c; } return c; }
const tailleV = (c, w, h) => { w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h)); if(c.width !== w || c.height !== h){ c.width = w; c.height = h; } };
const GV = { g1:document.createElement('canvas'), g2:document.createElement('canvas'), g3:document.createElement('canvas'), dk:document.createElement('canvas') };
let MESV = [], tMesV = 0;
function mesurerV(L){
  let d; try { d = cg.getImageData(0, 0, copie.width, copie.height).data; } catch(e){ return; }
  const W = copie.width, H = copie.height;
  MESV = V1M.ETAPES.map(e => { let r = 0, g = 0, b = 0, n = 0;
    e.polys.forEach(ids => { const cxp = ids.reduce((q, i) => q + L[i].x, 0)/ids.length*W, cyp = ids.reduce((q, i) => q + L[i].y, 0)/ids.length*H;
      [[cxp, cyp], ...ids.filter((_, q) => q % 2 === 0).map(i => [cxp + (L[i].x*W - cxp)*.45, cyp + (L[i].y*H - cyp)*.45])].forEach(([px, py]) => {
        for(let dy = -1; dy <= 1; dy++) for(let dx = -1; dx <= 1; dx++){ const x = Math.round(px + dx), y = Math.round(py + dy); if(x < 0 || y < 0 || x >= W || y >= H) continue; const k = (y*W + x)*4; r += d[k]; g += d[k + 1]; b += d[k + 2]; n++; } }); });
    if(!n) return null; const v = lab(r/n, g/n, b/n); return { L:v.L, a:v.a }; });
}
function bulleV(x, F, b, teinte){
  const s = F.s, pad = 8*s;
  x.font = '600 ' + (10.5*s).toFixed(1) + 'px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
  const w1 = x.measureText(b.titre).width + b.titre.length*1.6*s;
  x.font = '500 ' + (10*s).toFixed(1) + 'px "IBM Plex Mono", ui-monospace, Menlo, monospace';
  const w2 = b.sous ? x.measureText(b.sous).width : 0, pw = Math.max(w1, w2) + pad*2 + 3*s, ph = (b.sous ? 32 : 20)*s + pad*.6;
  let lx = F.box.x1 + 16*s; if(lx + pw > F.W - 8) lx = F.W - 8 - pw;
  let ly = Math.max(8, Math.min(F.H - 8 - ph, b.ancre.y - ph/2));
  const ax = b.ancre.x, ay = b.ancre.y, ey = Math.max(ly + 4, Math.min(ly + ph - 4, ay));
  if(lx > ax + 6){ x.beginPath(); x.moveTo(ax, ay); x.lineTo(lx, ey); x.lineWidth = .7*F.lw; x.strokeStyle = 'rgba(255,255,255,.7)'; x.stroke(); }
  x.beginPath(); x.arc(ax, ay, 1.8*F.lw, 0, 7); x.fillStyle = 'rgba(255,255,255,.95)'; x.fill();
  x.beginPath(); x.roundRect ? x.roundRect(lx, ly, pw, ph, 4*s) : x.rect(lx, ly, pw, ph); x.fillStyle = 'rgba(8,10,12,.55)'; x.fill();
  x.fillStyle = 'rgba(' + teinte.halo + ',.95)'; x.fillRect(lx, ly + 4*s, 1.4*s, ph - 8*s);
  x.textBaseline = 'middle'; x.textAlign = 'left';
  x.font = '600 ' + (10.5*s).toFixed(1) + 'px -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'; x.fillStyle = '#fff';
  if('letterSpacing' in x) x.letterSpacing = (1.6*s) + 'px'; x.fillText(b.titre, lx + pad + 3*s, ly + pad*.6 + 7*s); if('letterSpacing' in x) x.letterSpacing = '0px';
  if(b.sous){ x.font = '500 ' + (10*s).toFixed(1) + 'px "IBM Plex Mono", ui-monospace, Menlo, monospace'; x.fillStyle = 'rgba(228,234,232,.9)'; x.fillText(b.sous, lx + pad + 3*s, ly + pad*.6 + 21*s); }
}
function dessinerV1(a, now, sw, sh){
  const M = V1M, V = M.VARIANTES[0], r = a.boite.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1), W = r.width, H = r.height;
  if(a.cv.width !== Math.round(W*d)){ a.cv.width = Math.round(W*d); a.cv.height = Math.round(H*d); }
  const x = a.x; x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W, H);
  const vivant = a.L && now - a.vu < 1500; a.cv.style.opacity = vivant ? '1' : '0'; if(!a.L || !sw) return;
  const cs = getComputedStyle(a.media), op = (cs.objectPosition || '50% 50%').split(' ').map(v => parseFloat(v)/100);
  const s = Math.max(W/sw, H/sh), dw = sw*s, dh = sh*s, ox = (W - dw)*(isNaN(op[0]) ? .5 : op[0]), oy = (H - dh)*(isNaN(op[1]) ? .5 : op[1]);
  const mir = a.media.tagName === 'VIDEO', L = a.L, n = L.length, m = a.memV || (a.memV = {});
  if(!m.P || m.P.length !== n){ m.P = L.map(() => ({ x:0, y:0 })); m.Z = new Float32Array(n); m.N = new Float32Array(n); m.topo = null; }
  const P = m.P, Z = m.Z, N = m.N; let zmin = 1e9, zmax = -1e9;
  for(let i = 0; i < n; i++){ P[i].x = ox + (mir ? 1 - L[i].x : L[i].x)*dw; P[i].y = oy + L[i].y*dh; Z[i] = L[i].z*dw; if(Z[i] < zmin) zmin = Z[i]; if(Z[i] > zmax) zmax = Z[i]; }
  for(let i = 0; i < n; i++) N[i] = (zmax - Z[i])/((zmax - zmin) || 1);
  if(!m.topo){ const zone = new Int8Array(n).fill(-1); M.ETAPES.forEach((e, j) => e.polys.forEach(ids => { const poly = ids.map(i => ({ x:L[i].x, y:L[i].y })); for(let i = 0; i < n; i++) if(zone[i] < 0 && dedansV(L[i], poly)) zone[i] = j; ids.forEach(i => { if(zone[i] < 0) zone[i] = j; }); })); m.topo = { zone }; }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, zr = 0;
  for(const i of M.OVALE){ const p = P[i]; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); zr += Z[i]; }
  const box = { x0, y0, x1, y1, w:x1 - x0, h:y1 - y0, cx:(x0 + x1)/2, cy:(y0 + y1)/2 };
  let u = { x:P[263].x - P[33].x, y:P[263].y - P[33].y }; const ul = Math.hypot(u.x, u.y) || 1; u = { x:u.x/ul, y:u.y/ul }; if(u.x < 0) u = { x:-u.x, y:-u.y };
  const v = { x:-u.y, y:u.x }, ech = Math.hypot(P[10].x - P[152].x, P[10].y - P[152].y);
  const zones = M.ETAPES.map(e => { const polys = e.polys.map(ids => ids.map(i => P[i]));
    const csz = e.polys.map(ids => { let q = 0, b = 0, c = 0; ids.forEach(i => { q += P[i].x; b += P[i].y; c += Z[i]; }); return { x:q/ids.length, y:b/ids.length, z:c/ids.length }; });
    const c = { x:csz.reduce((q, p) => q + p.x, 0)/csz.length, y:csz.reduce((q, p) => q + p.y, 0)/csz.length }, droite = csz.reduce((q, b) => b.x > q.x ? b : q);
    return { nom:e.nom, polys, cs:csz, c, droite }; });
  const f1 = q => q.toFixed(1).replace('.', ','), mesTxt = j => { const q = MESV[j]; return q ? 'L* ' + f1(q.L) + '  ·  a* ' + f1(q.a) : 'lecture…'; };
  const t = (now - a.debut)/1000;
  const F = { P, Z, zpx:Z, N, W, H, box, u, v, ech, zref:zr/M.OVALE.length, zones, aretes:aretes2(), topo:m.topo, lec:M.lecture(t), mesTxt,
    lw:Math.max(.75, Math.min(1.7, ech/230)), s:Math.max(.78, Math.min(1.15, Math.min(W, H)/430)) };
  if(V.voile){ x.save(); x.translate(box.cx, box.cy); x.rotate(Math.atan2(u.y, u.x)); x.scale(1, box.h/box.w*1.02);
    const Rr = box.w*.5, gr = x.createRadialGradient(0, 0, Rr*1.05, 0, 0, Rr*2.3); gr.addColorStop(0, 'rgba(4,6,8,0)'); gr.addColorStop(1, 'rgba(4,6,8,' + V.voile + ')');
    x.fillStyle = gr; x.fillRect(-W*3, -H*3, W*6, H*6); x.restore(); }
  V.prep(F, t, m);
  const g1w = Math.ceil(W/3), g1h = Math.ceil(H/3);
  tailleV(GV.g1, g1w, g1h); tailleV(GV.g2, g1w/2, g1h/2); tailleV(GV.g3, g1w/6, g1h/6); tailleV(GV.dk, g1w/2, g1h/2);
  const g = GV.g1.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, g1w, g1h); g.setTransform(1/3, 0, 0, 1/3, 0, 0);
  V.lueur(g, F, t, m);
  const g2 = GV.g2.getContext('2d'); g2.globalCompositeOperation = 'copy'; g2.drawImage(GV.g1, 0, 0, GV.g2.width, GV.g2.height);
  const g3 = GV.g3.getContext('2d'); g3.globalCompositeOperation = 'copy'; g3.drawImage(GV.g2, 0, 0, GV.g3.width, GV.g3.height);
  const dk = GV.dk.getContext('2d'); dk.globalCompositeOperation = 'copy'; dk.drawImage(GV.g2, 0, 0); dk.globalCompositeOperation = 'source-in'; dk.fillStyle = '#000'; dk.fillRect(0, 0, GV.dk.width, GV.dk.height);
  x.globalAlpha = V.ombre; x.drawImage(GV.dk, 0, ech*.012, W, H);
  x.globalCompositeOperation = 'lighter'; x.globalAlpha = .9; x.drawImage(GV.g3, 0, 0, W, H); x.globalAlpha = .85; x.drawImage(GV.g2, 0, 0, W, H); x.globalAlpha = .45; x.drawImage(GV.g1, 0, 0, W, H);
  x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
  V.trait(x, F, t, m);
  /* pas de « lecture complete » ici : la vraie fin de lecture, c'est le moteur qui la dit */
  const lec = F.lec; if(!lec.fini) bulleV(x, F, { ancre:zones[lec.i].droite, titre:zones[lec.i].nom, sous:mesTxt(lec.i), k:lec.k }, V.teinte);
}

let actif = null;   // { boite, media, cv, x, L, PC, debut, t0 }
const copie = document.createElement('canvas'), cg = copie.getContext('2d');
/* ---- 30/09 (Charles : « a droite, des trucs en temps reel au lieu d'infos a la con ») ----
   Des mesures optiques reelles, lues dans les pixels du visage : lumiere, cadrage, stabilite, relief,
   et pour le front, les joues et le menton : clarte L*, rougeur a*, angle ITA. Rien n'est simule. */
function lin(c){ c /= 255; return c <= .04045 ? c/12.92 : Math.pow((c + .055)/1.055, 2.4); }
function lab(r, g, b){ r = lin(r); g = lin(g); b = lin(b);
  let X = (r*.4124 + g*.3576 + b*.1805)/.95047, Y = r*.2126 + g*.7152 + b*.0722, Z = (r*.0193 + g*.1192 + b*.9505)/1.08883;
  const f = t => t > .008856 ? Math.cbrt(t) : 7.787*t + 16/116; X = f(X); Y = f(Y); Z = f(Z); return { L:116*Y - 16, a:500*(X - Y), b:200*(Y - Z) }; }
const ZONES = { Front:[151, 9, 108, 337], Joues:[50, 280, 205, 425], Menton:[152, 199, 175] };
let MES = null, prec = null;
function mesurer(L){
  let d; try { d = cg.getImageData(0, 0, copie.width, copie.height).data; } catch(e){ return; }
  const W = copie.width, H = copie.height, out = {};
  const pix = (x, y) => { const k = ((y|0)*W + (x|0))*4; return [d[k], d[k + 1], d[k + 2]]; };
  let tot = { L:0, n:0 };
  for(const [nom, ids] of Object.entries(ZONES)){ let r = 0, g = 0, b = 0, n = 0;
    ids.forEach(i => { const cx = L[i].x*W, cy = L[i].y*H; for(let dy = -3; dy <= 3; dy++) for(let dx = -3; dx <= 3; dx++){ const x = cx + dx, y = cy + dy; if(x < 0 || y < 0 || x >= W || y >= H) continue; const p = pix(x, y); r += p[0]; g += p[1]; b += p[2]; n++; } });
    if(!n) continue; const c = lab(r/n, g/n, b/n); out[nom] = { L:c.L, a:c.a, b:c.b }; tot.L += c.L; tot.n++; }
  let x0 = 1, x1 = 0, zmin = 1e9, zmax = -1e9; for(const p of L){ if(p.x < x0) x0 = p.x; if(p.x > x1) x1 = p.x; if(p.z < zmin) zmin = p.z; if(p.z > zmax) zmax = p.z; }
  let bouge = 0; if(prec){ for(let i = 0; i < L.length; i += 12) bouge += Math.hypot((L[i].x - prec[i].x)*W, (L[i].y - prec[i].y)*H); bouge /= Math.ceil(L.length/12); }
  prec = L.map(p => ({ x:p.x, y:p.y }));
  const lisse = (k, v) => MES && MES[k] != null ? MES[k] + (v - MES[k])*.25 : v;
  /* 01/10 : de face ? (le nez a egale distance des deux joues) ; sert a declencher la lecture au bon moment */
  const dG = Math.hypot(L[1].x - L[234].x, L[1].y - L[234].y), dD = Math.hypot(L[1].x - L[454].x, L[1].y - L[454].y), lacet = (dG - dD)/((dG + dD) || 1);
  const tang = Math.abs(L[33].y - L[263].y)/(Math.abs(L[33].x - L[263].x) || 1);
  /* 04/10 (contour des yeux) : l'ombre sous l'oeil en direct, INDICATIVE : clarte L* juste sous la paupiere
     inferieure (MediaPipe 229-230 et 449-450) comparee a la joue du meme cote (50 et 280). Elle ne choisit rien :
     le soin contour des yeux suit la mesure du moteur de lecture (result.yeux), pas cet affichage. */
  const tache = (ids) => { let r = 0, g = 0, b = 0, n = 0; const cx = ids.reduce((s1, i) => s1 + L[i].x, 0)/ids.length*W, cy = ids.reduce((s1, i) => s1 + L[i].y, 0)/ids.length*H;
    for(let dy = -2; dy <= 2; dy++) for(let dx = -2; dx <= 2; dx++){ const x = cx + dx, y = cy + dy; if(x < 0 || y < 0 || x >= W || y >= H) continue; const p = pix(x, y); r += p[0]; g += p[1]; b += p[2]; n++; }
    return n ? lab(r/n, g/n, b/n).L : null; };
  const oG = tache([229, 230]), jG = tache([50]), oD = tache([449, 450]), jD = tache([280]);
  const dOmbre = [oG != null && jG != null ? jG - oG : null, oD != null && jD != null ? jD - oD : null].filter(v => v != null);
  window.__vyMES = MES = { lacet, roulis:tang, lumiere:lisse('lumiere', tot.n ? tot.L/tot.n : 0), cadrage:lisse('cadrage', (x1 - x0)*100), stabilite:lisse('stabilite', bouge), relief:lisse('relief', (zmax - zmin)*1000), points:L.length, zones:out, ombre:dOmbre.length ? lisse('ombre', dOmbre.reduce((s1, v) => s1 + v, 0)/dOmbre.length) : null };
  MES.pret = Math.abs(MES.lacet) < .16 && MES.roulis < .12 && MES.stabilite < 2.2 && MES.cadrage > 30 && MES.cadrage < 75 && MES.lumiere > 36 && MES.lumiere < 84;
  MES.conseil = Math.abs(MES.lacet) >= .16 || MES.roulis >= .12 ? 'Regardez droit vers la caméra.' : MES.stabilite >= 2.2 ? 'Ne bougez plus.' : MES.cadrage <= 30 ? 'Rapprochez-vous un peu.' : MES.cadrage >= 75 ? 'Reculez un peu.' : MES.lumiere <= 36 ? 'Un peu plus de lumière.' : MES.lumiere >= 84 ? 'Évitez le contre-jour.' : 'Parfait, on lit votre peau.';
}
let tPanneau = 0;
function panneau(now){
  const el = document.getElementById('vyLive'); if(!el || !MES || now - tPanneau < 130) return; tPanneau = now;
  const f1 = v => v.toFixed(1).replace('.', ','), ligne = (k, v, etat, pct) => `<div class="lv"><span>${k}</span><b>${v}</b><i style="--p:${Math.max(0, Math.min(100, pct))}%"></i><em>${etat}</em></div>`;
  const lu = MES.lumiere, ca = MES.cadrage, st = MES.stabilite;
  let h = ligne('Lumière', 'L* ' + f1(lu), lu < 38 ? 'trop sombre' : lu > 82 ? 'trop vive' : 'bonne', lu)
    + ligne('Cadrage', f1(ca) + ' %', ca < 32 ? 'rapprochez-vous' : ca > 72 ? 'reculez' : 'bon', ca)
    + ligne('Stabilité', f1(st) + ' px', st > 2.5 ? 'bougez moins' : 'stable', 100 - st*20)
    + ligne('Points suivis', String(MES.points), 'maillage 3D', 100)
    + ligne('Relief', f1(MES.relief), 'profondeur relative', MES.relief)
    + (MES.ombre != null ? ligne('Ombre sous l’œil', 'ΔL* ' + f1(MES.ombre), 'indicatif, selon la lumière', MES.ombre*6) : '');
  h += '<div class="lz">' + Object.entries(MES.zones).map(([z, v]) => `<div><span>${z}</span><b>L* ${f1(v.L)}</b><b>a* ${f1(v.a)}</b><b>b* ${f1(v.b)}</b></div>`).join('') + '</div>';
  el.innerHTML = '<div class="overline">Mesures en direct</div>' + h + '<p class="fine">Mesures optiques de l’image, calculées sur cet appareil. Pas un diagnostic.</p>';
}
function taillesSource(m){ return m.tagName === 'VIDEO' ? [m.videoWidth, m.videoHeight] : [m.naturalWidth, m.naturalHeight]; }
function image(m){ const [sw, sh] = taillesSource(m); const w = 480, h = Math.round(w*sh/sw); if(copie.width !== w || copie.height !== h){ copie.width = w; copie.height = h; } cg.drawImage(m, 0, 0, w, h); return copie; }

function poser(boite, media){
  if(actif && actif.media === media) return;
  arreter();
  const cv = document.createElement('canvas'); cv.className = 'vy-carto'; cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:0;transition:opacity .8s';
  boite.appendChild(cv);
  actif = { boite, media, cv, x:cv.getContext('2d'), L:null, PC:[], debut:null, ts:0, vu:0 };
  moteur().then(() => { if(actif && actif.cv === cv) requestAnimationFrame(boucle); }).catch(() => {});
}
function arreter(){ if(actif){ actif.cv.remove(); actif = null; } }

function boucle(now){
  const a = actif; if(!a) return;
  if(!a.boite.isConnected || !a.media.isConnected){ arreter(); return; }
  const [sw, sh] = taillesSource(a.media);
  if(sw && sh && now - a.ts > 90){   /* 01/10 : 11 lectures par seconde suffisent ; la video reste fluide */
    a.ts = now;
    let r = null; try { r = face.detectForVideo(image(a.media), now); } catch(e){}
    const n = r && r.faceLandmarks && r.faceLandmarks[0];
    if(n){ if(!a.L) a.L = n.map(p => ({ x:p.x, y:p.y, z:p.z }));
      else for(let i = 0; i < a.L.length; i++){ a.L[i].x += (n[i].x - a.L[i].x)*.45; a.L[i].y += (n[i].y - a.L[i].y)*.45; a.L[i].z += (n[i].z - a.L[i].z)*.45; }
      a.vu = now; if(a.debut === null) a.debut = now; mesurer(a.L); }
  }
  if(MODE_V1 && V1M){ if(now - tMesV > 400 && a.L){ tMesV = now; mesurerV(a.L); } dessinerV1(a, now, sw, sh); } else dessiner(a, now, sw, sh);
  panneau(now);
  requestAnimationFrame(boucle);
}

function dessiner(a, now, sw, sh){
  const r = a.boite.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1), W = r.width, H = r.height;
  if(a.cv.width !== Math.round(W*d)){ a.cv.width = Math.round(W*d); a.cv.height = Math.round(H*d); }
  const x = a.x; x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W, H);
  const vivant = a.L && now - a.vu < 1500; a.cv.style.opacity = vivant ? '1' : '0'; if(!a.L || !sw) return;
  // la meme mise en page que la photo : object-fit cover, object-position lue sur l'element, miroir pour la camera
  const cs = getComputedStyle(a.media), op = (cs.objectPosition || '50% 50%').split(' ').map(v => parseFloat(v)/100);
  const s = Math.max(W/sw, H/sh), dw = sw*s, dh = sh*s, ox = (W - dw)*(isNaN(op[0]) ? .5 : op[0]), oy = (H - dh)*(isNaN(op[1]) ? .5 : op[1]);
  const miroir = a.media.tagName === 'VIDEO';
  const L = a.L; if(a.PC.length !== L.length) a.PC = L.map(() => ({ x:0, y:0 }));
  for(let i = 0; i < L.length; i++){ a.PC[i].x = ox + (miroir ? 1 - L[i].x : L[i].x)*dw; a.PC[i].y = oy + L[i].y*dh; }
  const PC = a.PC;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; OVALE.forEach(i => { const p = PC[i]; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
  const w = x1 - x0, h = y1 - y0, cx0 = (x0 + x1)/2, cy0 = (y0 + y1)/2, t = (now - a.debut)/1000;
  const vie = .86 + .14*Math.sin(t*.9);
  const mix = Math.min(1, Math.max(0, (t - TOPO)/FONDU)), topo = 1 - mix, grat = mix;
  const texte = (s2, px, py, al, al2) => { x.font = '400 10.5px "IBM Plex Mono", ui-monospace, monospace'; x.textAlign = al; x.fillStyle = rgba(K.texte, al2); x.fillText(s2, px, py); };
  const f0 = n => n.toFixed(0);
  // une ombre tres douce sous les traits, pour qu'ils restent lisibles sur une peau claire
  x.shadowColor = 'rgba(40,30,15,.35)'; x.shadowBlur = 2;

  if(topo > 0){
    let zmin = 1e9, zmax = -1e9; for(const p of L){ if(p.z < zmin) zmin = p.z; if(p.z > zmax) zmax = p.z; }
    const N = 12, pas = (zmax - zmin)/N, bal = y0 + (.5 + .5*Math.sin(t*1.1 - 1.57))*h;
    for(let n = 1; n < N; n++){ const lv = zmin + n*pas, maitre = n % 3 === 0; let lab = null;
      for(const e of ARETES){ const za = L[e.start].z, zb = L[e.end].z; if((za - lv)*(zb - lv) >= 0) continue;
        const k = (lv - za)/(zb - za), p = PC[e.start], q = PC[e.end], qx = p.x + (q.x - p.x)*k, qy = p.y + (q.y - p.y)*k;
        const g = Math.exp(-Math.pow((qy - bal)/(h*.12), 2)); x.fillStyle = rgba(g > .6 ? K.coeur : K.trait, ((maitre ? .6 : .34) + .35*g)*vie*topo);
        const sz = maitre ? 1.6 : 1.15; x.fillRect(qx - sz/2, qy - sz/2, sz, sz);
        if(maitre && (!lab || qx > lab.x)) lab = { x:qx, y:qy }; }
      if(lab) texte(f0((1 - n/N)*100), lab.x + 6, lab.y + 3, 'left', .6*topo); }
    texte('RELIEF · COURBES DE NIVEAU', 16, 24, 'left', .7*topo);
  }
  if(grat > 0){
    const coupe = (nx, ny, c) => { const pts = [], kz = dw*.3, tx = -ny, ty = nx;
      for(const e of ARETES){ const p = PC[e.start], q = PC[e.end], sa = p.x*nx + p.y*ny - c, sb = q.x*nx + q.y*ny - c;
        if(sa*sb < 0){ const k = sa/(sa - sb), z = L[e.start].z + (L[e.end].z - L[e.start].z)*k, px = p.x + (q.x - p.x)*k, py = p.y + (q.y - p.y)*k;
          pts.push({ x:px - nx*z*kz, y:py - ny*z*kz, s:px*tx + py*ty }); } }
      pts.sort((u, v) => u.s - v.s); const o = []; for(const p of pts) if(!o.length || p.s - o[o.length - 1].s > 1.2) o.push(p);
      return o.map((p, i) => { const w5 = o.slice(Math.max(0, i - 2), i + 3).map(q => q.x*nx + q.y*ny).sort((u, v) => u - v), dd = w5[w5.length >> 1] - (p.x*nx + p.y*ny); return { x:p.x + nx*dd, y:p.y + ny*dd }; }); };
    const trace = pts => { x.beginPath(); x.moveTo(pts[0].x, pts[0].y); for(let i = 1; i < pts.length - 1; i++) x.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x)/2, (pts[i].y + pts[i + 1].y)/2); x.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y); };
    // les lignes se deroulent depuis le centre pendant le fondu
    const deroule = Math.min(1, mix*1.2);
    x.setLineDash([2, 3]);
    for(let n = 1; n < 8; n++){ if(Math.abs(n - 4) > deroule*4 + .01) continue;
      [coupe(0, 1, y0 + n*h/8), coupe(1, 0, x0 + n*w/8)].forEach(pts => { if(pts.length > 3){ trace(pts); x.strokeStyle = rgba(K.trait, (n === 4 ? .9 : .62)*vie*grat); x.lineWidth = .8; x.stroke(); } });
      const lo = Math.asin(Math.max(-1, Math.min(1, (x0 + n*w/8 - cx0)/(w/2))))*180/Math.PI;
      if(w > 300 || n % 2 === 0) texte(f0(Math.abs(lo)) + '°' + (lo < 0 ? 'O' : lo > 0 ? 'E' : ''), x0 + n*w/8, y0 - 8, 'center', .6*grat); }
    x.setLineDash([]);
    const tt = t - TOPO, cur = { x:cx0 + w*.3*Math.sin(tt*.55), y:cy0 + h*.28*Math.sin(tt*.83 + 1) };
    const dms = v => { const dg = Math.abs(v), g = Math.floor(dg), m = Math.round((dg - g)*60); return g + '°' + String(m).padStart(2, '0') + '′'; };
    const la = Math.asin(Math.max(-1, Math.min(1, (cy0 - cur.y)/(h/2))))*180/Math.PI, lo2 = Math.asin(Math.max(-1, Math.min(1, (cur.x - cx0)/(w/2))))*180/Math.PI;
    x.strokeStyle = rgba(K.trait, .75*vie*grat); x.lineWidth = .7; x.beginPath();
    x.moveTo(cur.x - 14, cur.y); x.lineTo(cur.x - 4, cur.y); x.moveTo(cur.x + 4, cur.y); x.lineTo(cur.x + 14, cur.y); x.moveTo(cur.x, cur.y - 14); x.lineTo(cur.x, cur.y - 4); x.moveTo(cur.x, cur.y + 4); x.lineTo(cur.x, cur.y + 14); x.stroke();
    [[10, .05], [5, .12], [2, .35]].forEach(([rr, al]) => { x.fillStyle = rgba(K.halo, al*grat); x.beginPath(); x.arc(cur.x, cur.y, rr, 0, 7); x.fill(); });
    x.fillStyle = rgba(K.coeur, .9*grat); x.beginPath(); x.arc(cur.x, cur.y, .9, 0, 7); x.fill();
    texte((la >= 0 ? 'N ' : 'S ') + dms(la) + '  ' + (lo2 >= 0 ? 'E ' : 'O ') + dms(lo2), cur.x + 18, cur.y - 6, 'left', .8*grat);
    texte('GRATICULE · COORDONNÉES DU VISAGE', 16, 24, 'left', .7*grat);
  }
  x.shadowBlur = 0;
}

/* on se pose sur la camera ou la photo du scan des qu'elles apparaissent */
function chercher(){
  const m = document.querySelector('.camera video, .camera img#scanImage, .camera img');
  if(!m){ if(actif) arreter(); return; }
  const pret = m.tagName === 'VIDEO' ? m.readyState >= 2 && m.videoWidth : m.complete && m.naturalWidth;
  if(pret) poser(m.closest('.camera'), m);
  else if(!m.__vyCarto){ m.__vyCarto = 1; m.addEventListener(m.tagName === 'VIDEO' ? 'playing' : 'load', chercher, { once:true }); }
}
window.vyCartoPrechauffe = () => moteur().catch(() => {});   /* chargement anticipe pendant les questions */
new MutationObserver(chercher).observe(document.documentElement, { childList:true, subtree:true });
chercher();
