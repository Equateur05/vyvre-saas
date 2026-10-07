/* ===========================================================================
   VYVRE · LE WRAP · SERIE X, LA VRAIE 3D  (07/10/2026, nuit)
   Module ES charge a la demande par vy-wrap.js (window.__VYWX.creer).
     X1 · Ton visage en lumiere : la vignette du scan devient des milliers de particules 3D
          (profondeur : forme du visage + luminance + reperes du visage s'ils existent) ;
          sans photo, une sphere abstraite (jamais un visage invente).
     X2 · Chrome liquide : une goutte de metal iridescent qui ondule ; la phrase sort en lettres chromees.
     X3 · Le flacon de verre : un flacon en verre (transmission, refraction), la lumiere tourne,
          la phrase apparait dans le verre ; puis les soins en lumiere de pub.
     X4 · Typo geante : des lettres extrudees que la camera traverse ; les vrais chiffres en volume.
   Le meme arc pour les quatre (18 temps) : accroche, montee, revelation (temps 4), preuve,
   les soins (temps 7 a 13), « Et toi ? » (13 a 16), retour a l'accroche (boucle parfaite).
   Rendu : WebGL a resolution interne reduite (720 x 1280, 360 x 640 en apercu) pose dans le
   canvas 2D du Wrap, puis le texte net par-dessus. Sans WebGL : repli 2D, meme arc.
   three.js r186 (MIT) : vendor/three-vyvre.min.js (sous-ensemble, voir vendor/LICENSE-three.txt).
   Polices 3D : contours tires des polices OFL du dossier fonts/ (fonts/3d/*.json).
   Bruit simplex 3D : Ian McEwan, Ashima Arts (licence MIT).
   =========================================================================== */
import * as THREE from './vendor/three-vyvre.min.js?v=1';

const W = 1080, H = 1920, PXU = 960 / (12 * Math.tan(15 * Math.PI / 180));   /* pixels par unite a z = 0 (camera a 12, champ 30°) */
const wy = py => (960 - py) / PXU, wx = px => (px - 540) / PXU;
const CX = 520;   /* le centre de la composition (zones de securite TikTok / Reels : un peu a gauche) */

/* ------------------------------------------------------------- outils */
function srgb(c, k = 1){ return new THREE.Color().setRGB(c[0] / 255 * k, c[1] / 255 * k, c[2] / 255 * k, THREE.SRGBColorSpace); }
function mel(c1, c2, p){ return [c1[0] + (c2[0] - c1[0]) * p, c1[1] + (c2[1] - c1[1]) * p, c1[2] + (c2[2] - c1[2]) * p].map(Math.round); }
function alea(graine){ let a = graine >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function lisse(a, b, x){ const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function chargeImg(src){ return new Promise(r => { const im = new Image(); im.onload = () => r(im.naturalWidth ? im : null); im.onerror = () => r(null); im.src = src; setTimeout(() => r(null), 6000); }); }
function canvas(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function texCanvas(c){ const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t; }
/* un halo doux (radial), une fois */
let HALO = null;
function halo(){ if (HALO) return HALO; const c = canvas(128, 128), g = c.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.25, 'rgba(255,255,255,.45)'); rg.addColorStop(.6, 'rgba(255,255,255,.08)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128); HALO = c; return c; }
function spriteHalo(couleur, opacite){
  const m = new THREE.SpriteMaterial({ map:texCanvas(halo()), color:couleur, transparent:true, opacity:opacite, blending:THREE.AdditiveBlending, depthWrite:false, depthTest:false });
  return new THREE.Sprite(m);
}
/* ---------- 07/10 (soir) : le Wrap des ALIMENTS passe en clair, comme l'interface « Aliments pour ma peau »
   (fond blanc casse, texte gris-noir, typo sans serif serree, petites capitales grises, les aliments qui flottent) */
const CLAIR = { encre:[37, 38, 34], gris:[104, 106, 97], trait:[216, 220, 209] };   /* gris un peu plus fonce que #77796f : 5:1 sur le blanc, meme pour les petites capitales */
const SANS = '"VY Inter",Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif';
let INTER = null, INTER_OK = false;
function chargeInter(){
  if (INTER) return INTER;
  if (!window.FontFace || !document.fonts) return (INTER = Promise.resolve(false));
  const un = (w, f) => new FontFace('VY Inter', 'url("' + new URL('fonts/' + f + '?v=1', import.meta.url).href + '") format("woff2")', { weight:w, style:'normal' }).load().then(l => { document.fonts.add(l); });
  INTER = Promise.race([Promise.all([un('400', 'inter-400.woff2'), un('500', 'inter-500.woff2')]).then(() => { INTER_OK = true; return true; }), new Promise(r => setTimeout(() => r(false), 5000))]).catch(() => false);
  return INTER;
}
function fontS(size, poids){ return (poids || 400) + ' ' + Math.round(size) + 'px ' + SANS; }
/* le fond de l'interface aliments : #fafafa, un degrade radial du blanc (60 % / 40 %) vers #f5f5f4 */
function peintFondClair(g, w, h){
  g.fillStyle = '#fafafa'; g.fillRect(0, 0, w, h);
  const rg = g.createRadialGradient(w * .6, h * .4, 0, w * .6, h * .4, h * .78);
  rg.addColorStop(0, '#ffffff'); rg.addColorStop(.42, '#fcfcfb'); rg.addColorStop(1, '#f2f2f0');
  g.fillStyle = rg; g.fillRect(0, 0, w, h);
}
function fondClair(){ const c = canvas(270, 480); peintFondClair(c.getContext('2d'), 270, 480); return texCanvas(c); }
/* une ombre portee douce (au sol), en melange normal : elle se voit sur le blanc */
let OMBRE = null;
function ombre(){ if (OMBRE) return OMBRE; const c = canvas(128, 128), g = c.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(37,31,19,1)'); rg.addColorStop(.45, 'rgba(37,31,19,.45)'); rg.addColorStop(1, 'rgba(37,31,19,0)'); g.fillStyle = rg; g.fillRect(0, 0, 128, 128); OMBRE = c; return c; }
function spriteOmbre(opacite){ return new THREE.Sprite(new THREE.SpriteMaterial({ map:texCanvas(ombre()), color:0xffffff, transparent:true, opacity:opacite, depthWrite:false, depthTest:false })); }
/* la couleur d'un aliment : la moyenne de ses pixels, ponderee par la saturation (la peau de l'avocat, pas son reflet) */
function rgbHsl(c){ const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn){ const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  return [h, s, l]; }
function hslRgb(h, s, l){ const f = (p, q, t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  if (!s) return [l, l, l].map(v => Math.round(v * 255)); const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [f(p, q, h + 1 / 3), f(p, q, h), f(p, q, h - 1 / 3)].map(v => Math.round(v * 255)); }
function couleurAliment(im){
  /* la teinte dominante (histogramme de teintes pondere par la chroma) : l'orange de la carotte, pas le vert de ses fanes */
  try {
    const src = im.brut || im, c = canvas(64, 64), g = c.getContext('2d', { willReadFrequently:true }); g.drawImage(src, 0, 0, 64, 64);
    const p = g.getImageData(0, 0, 64, 64).data, B = []; for (let i = 0; i < 24; i++) B.push([0, 0, 0, 0]);
    for (let i = 0; i < p.length; i += 4){
      if (p[i + 3] < 200) continue;
      const hsl = rgbHsl([p[i], p[i + 1], p[i + 2]]), l = hsl[2]; if (l < .08 || l > .94) continue;
      const k = Math.pow(hsl[1] * (1 - Math.abs(2 * l - 1)), 2.5), b = B[Math.floor(hsl[0] * 24) % 24];
      b[0] += p[i] * k; b[1] += p[i + 1] * k; b[2] += p[i + 2] * k; b[3] += k;
    }
    let m = 0, best = -1; for (let i = 0; i < 24; i++){ const t = B[i][3] + .5 * B[(i + 23) % 24][3] + .5 * B[(i + 1) % 24][3]; if (t > best){ best = t; m = i; } }
    let r = 0, gg = 0, bb = 0, w = 0; for (const j of [(m + 23) % 24, m, (m + 1) % 24]){ r += B[j][0]; gg += B[j][1]; bb += B[j][2]; w += B[j][3]; }
    return w > 1e-4 ? [r / w, gg / w, bb / w].map(Math.round) : null;
  } catch(e){ return null; }
}
const COUL_REPLI = [[104, 150, 64], [226, 124, 44], [206, 86, 80], [150, 112, 190]];
function lumR(c){ const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
/* vive : la couleur pour la 3D (saturee, ni trop claire ni trop sombre) ; texte : la meme, assez sombre pour se lire sur le blanc (contraste >= 4,5) */
function palAliments(imgs, n){
  const out = { vives:[], textes:[], pastels:[], prim:0 }; let chroma = -1;
  for (let k = 0; k < Math.max(1, n); k++){
    const c0 = (imgs && imgs[k] && couleurAliment(imgs[k])) || COUL_REPLI[k % 4], hsl = rgbHsl(c0), ch = hsl[1] * (1 - Math.abs(2 * hsl[2] - 1));
    if (ch > chroma){ chroma = ch; out.prim = k; }   /* l'accent : l'aliment le plus colore (l'huile d'olive plutot que le gris-bleu du maquereau) */
    const s = Math.max(hsl[1], .5), l = Math.min(.56, Math.max(.4, hsl[2]));
    const vive = hslRgb(hsl[0], Math.min(.85, s), l); let lt = l, t = vive;
    while (lumR(t) > .16 && lt > .12){ lt -= .02; t = hslRgb(hsl[0], Math.min(.8, s), lt); }
    out.vives.push(vive); out.textes.push(t); out.pastels.push(mel(vive, [255, 255, 255], .88));
  }
  return out;
}
/* l'aliment detoure, pret a dessiner net (720 px de haut au plus) et son reflet (retourne, qui s'efface) */
function prepAliment(im){
  if (!im) return null;
  const src = im.brut || im, iw = src.naturalWidth || src.width, ih = src.naturalHeight || src.height; if (!iw || !ih) return null;
  const k = Math.min(1, 720 / ih, 900 / iw), w = Math.max(1, Math.round(iw * k)), h = Math.max(1, Math.round(ih * k));
  const net = canvas(w, h); net.getContext('2d').drawImage(src, 0, 0, w, h);
  const rh = Math.round(h * .42), rf = canvas(w, rh), g = rf.getContext('2d');
  g.save(); g.translate(0, h); g.scale(1, -1); g.drawImage(net, 0, 0); g.restore();
  g.globalCompositeOperation = 'destination-in'; const gr = g.createLinearGradient(0, 0, 0, rh); gr.addColorStop(0, 'rgba(0,0,0,.65)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, rh);
  return { net, rf, w, h };
}

/* un fond en degrade vertical (texture), pour scene.background */
function fondDegrade(stops){ const c = canvas(4, 512), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512);
  stops.forEach(s => gr.addColorStop(s[0], 'rgb(' + s[1].join(',') + ')')); g.fillStyle = gr; g.fillRect(0, 0, 4, 512); return texCanvas(c); }

/* ------------------------------------------------------------- le texte en volume */
const POL3D = {};
function police3D(nom){ return POL3D[nom] || (POL3D[nom] = fetch(new URL('fonts/3d/' + nom + '.json?v=1', import.meta.url)).then(r => { if (!r.ok) throw new Error('police ' + nom); return r.json(); })); }
const CSS3D = { 'bodoni-600':'600 100px "VY Bodoni Moda"', 'bodoni-400-italic':'italic 400 100px "VY Bodoni Moda"', 'jost-500':'500 100px "VY Jost"', 'inter-400':'400 100px "VY Inter"' };
const TRACK3D = { 'inter-400':-.045 };   /* l'approche serree de l'interface aliments (letter-spacing negatif), en em */
let MES = null;
const espaceFin = c => c === ' ' || c === ' ' ? ' ' : c;
/* la position de chaque lettre (en em) : mesuree par le navigateur sur la meme police (crenage compris) ; sinon les avances du fichier */
function avances(font, nom, txt, V){
  const ch = Array.from(txt).map(espaceFin), x = [], tr = TRACK3D[nom] || 0, nn = Math.max(0, ch.length - 1);
  if (nom === 'inter-400' ? INTER_OK : V.polEtat() === 'ok'){
    MES = MES || canvas(4, 4).getContext('2d'); MES.font = CSS3D[nom];
    let acc = '';
    for (const c of ch){ acc += c; x.push((MES.measureText(acc).width - MES.measureText(c).width) / 100 + tr * x.length); }
    return { x, tot:MES.measureText(ch.join('')).width / 100 + tr * nn };
  }
  let p = 0; for (const c of ch){ x.push(p + tr * x.length); const g = font.glyphs[c]; p += (g ? g.ha : font.resolution * .3) / font.resolution; }
  return { x, tot:p + tr * nn };
}
function formesGlyphe(font, c, taille){
  const g = font.glyphs[c]; if (!g || !g.o) return [];
  const sc = taille / font.resolution, o = g._o || (g._o = g.o.split(' ')), p = new THREE.ShapePath();
  for (let i = 0; i < o.length;){
    const a = o[i++];
    if (a === 'm') p.moveTo(o[i++] * sc, o[i++] * sc);
    else if (a === 'l') p.lineTo(o[i++] * sc, o[i++] * sc);
    else if (a === 'q'){ const x = o[i++] * sc, y = o[i++] * sc, cx = o[i++] * sc, cy = o[i++] * sc; p.quadraticCurveTo(cx, cy, x, y); }
    else if (a === 'b'){ const x = o[i++] * sc, y = o[i++] * sc, c1x = o[i++] * sc, c1y = o[i++] * sc, c2x = o[i++] * sc, c2y = o[i++] * sc; p.bezierCurveTo(c1x, c1y, c2x, c2y, x, y); }
  }
  return p.toShapes();
}
/* le meilleur decoupage (1 a 3 lignes) : les plus grandes lettres, sans finir une ligne sur un petit mot */
function coupe3D(font, nom, txt, maxW, maxH, fmax, nmax, lh, V){
  const mots = String(txt).split(/\s+/).filter(Boolean), cands = [[mots.join(' ')]];
  if (nmax >= 2) for (let i = 1; i < mots.length; i++) cands.push([mots.slice(0, i).join(' '), mots.slice(i).join(' ')]);
  if (nmax >= 3) for (let i = 1; i < mots.length; i++) for (let j = i + 1; j < mots.length; j++) cands.push([mots.slice(0, i).join(' '), mots.slice(i, j).join(' '), mots.slice(j).join(' ')]);
  let best = null;
  for (const ls of cands){
    const n = ls.length; let f = fmax;
    for (const l of ls) f = Math.min(f, maxW / Math.max(.01, avances(font, nom, l, V).tot));
    f = Math.min(f, maxH / (n * lh));
    let sc = f * [0, 1, .9, .78][n];
    if (n > 1 && ls.slice(0, -1).some(l => { const m = l.split(' '); return m.length > 1 && m[m.length - 1].replace(/[’']/g, '').length <= 3; })) sc *= .8;
    if (n > 1 && ls.some(l => l.replace(/[.,’'? ]/g, '').length <= 2)) sc *= .78;
    if (!best || sc > best.sc) best = { ls, f, sc };
  }
  return best;
}
/* le bloc de texte : une piece par lettre (pour les animer une a une), centre sur (0, 0) */
function bloc3D(font, nom, lay, mat, o, V){
  const f = lay.f, n = lay.ls.length, lh = (o.lh || 1.06) * f, cap = (font.capHeight || font.resolution * .7) / font.resolution * f;
  const g = new THREE.Group(), lettres = [], top = ((n - 1) * lh + cap) / 2; let larg = 0;
  lay.ls.forEach((l, li) => {
    const pos = avances(font, nom, l, V), w = pos.tot * f, x0 = -w / 2, yb = top - cap - li * lh; larg = Math.max(larg, w);
    Array.from(l).map(espaceFin).forEach((c, ci) => {
      if (c === ' ') return;
      const shapes = formesGlyphe(font, c, f); if (!shapes.length) return;
      const geo = new THREE.ExtrudeGeometry(shapes, { depth:(o.depth || .1) * f, curveSegments:o.seg || 5, bevelEnabled:!!o.bevel, bevelThickness:(o.bevel || 0) * f, bevelSize:(o.bevelSize != null ? o.bevelSize : (o.bevel || 0)) * f, bevelSegments:o.bevelSeg || 2 });
      geo.computeBoundingBox(); const bb = geo.boundingBox, cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
      geo.translate(-cx, -cy, -cz);
      /* typo serree (Inter) : deux lettres voisines peuvent se toucher (« tt ») ; un decalage infime en profondeur evite qu'elles se disputent le meme plan */
      if (TRACK3D[nom]) geo.translate(0, 0, (lettres.length % 2) * .006 * f);
      const m = new THREE.Mesh(geo, mat), px = x0 + pos.x[ci] * f + cx, py = yb + cy;
      m.position.set(px, py, 0); m.userData = { x:px, y:py, i:lettres.length, li, n:0 };
      g.add(m); lettres.push(m);
    });
  });
  lettres.forEach(m => { m.userData.n = lettres.length; });
  return { groupe:g, lettres, larg, haut:(n - 1) * lh + cap, f };
}

/* ------------------------------------------------------------- les soins en 3D */
const VS_PROD = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const FS_PROD = `uniform sampler2D map; uniform float uA, uSweep, uLum, uRefl; varying vec2 vUv;
void main(){
  vec4 c = texture2D(map, vUv);
  float a = c.a * uA;
  if (uRefl > 0.5) a *= (1.0 - smoothstep(0.0, 0.24, vUv.y)) * 0.2;
  if (a < 0.004) discard;
  float s = smoothstep(0.16, 0.0, abs(vUv.x * 0.75 + vUv.y * 0.55 - uSweep)) * 0.6;
  gl_FragColor = vec4(c.rgb * uLum + s * vec3(1.0, 0.97, 0.92), a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
/* la photo detouree en texture (512 px au plus) ; un packshot avec son fond est pose sur une carte claire */
function texProduit(im, fond){
  const src = im.brut || im, iw = src.naturalWidth || src.width, ih = src.naturalHeight || src.height, k = Math.min(1, 512 / Math.max(iw, ih));
  const p = fond ? 28 : 0, c = canvas(Math.round(iw * k) + 2 * p, Math.round(ih * k) + 2 * p), g = c.getContext('2d');
  if (fond){ g.fillStyle = '#f4f0e8'; const r = 22, w = c.width, h = c.height; g.beginPath(); g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.closePath(); g.fill(); }
  g.drawImage(src, p, p, iw * k, ih * k);
  const t = texCanvas(c); t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
  return { t, asp:c.width / c.height };
}
function planProduit(tex, asp, haut, refl){
  const m = new THREE.ShaderMaterial({ uniforms:{ map:{ value:tex }, uA:{ value:0 }, uSweep:{ value:-1 }, uLum:{ value:1 }, uRefl:{ value:refl ? 1 : 0 } },
    vertexShader:VS_PROD, fragmentShader:FS_PROD, transparent:true, depthWrite:false, side:THREE.DoubleSide });
  const w = Math.min(haut * asp, haut * 1.15), h = w / asp;
  const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2, 0);   /* l'origine au sol */
  const mesh = new THREE.Mesh(geo, m); mesh.userData.h = h; mesh.userData.w = w;
  if (refl) mesh.scale.y = -1;
  return mesh;
}

/* ------------------------------------------------------------- bruit simplex 3D (Ashima Arts, MIT) */
const NOISE = `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0); m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}`;

/* un environnement de studio (reflets du chrome et du verre), calcule une fois */
function studio(renderer, ciel, panneaux){
  const es = new THREE.Scene();
  const sky = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), new THREE.ShaderMaterial({ side:THREE.BackSide, depthWrite:false,
    uniforms:{ cH:{ value:ciel[0] }, cM:{ value:ciel[1] }, cB:{ value:ciel[2] } },
    vertexShader:'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader:'uniform vec3 cH, cM, cB; varying vec3 vP; void main(){ float y = vP.y; vec3 c = y > 0.0 ? mix(cM, cH, pow(y, 0.7)) : mix(cM, cB, pow(-y, 0.5)); gl_FragColor = vec4(c, 1.0); }' }));
  es.add(sky);
  panneaux.forEach(p => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), new THREE.MeshBasicMaterial({ color:p.c, side:THREE.DoubleSide }));
    m.position.set(p.x, p.y, p.z); m.lookAt(0, p.y * .3, 0); es.add(m);
  });
  const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromScene(es, .02);
  pm.dispose(); es.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  return rt;
}

/* ------------------------------------------------------------- les textes du Wrap */
function textesX(d, V, R){
  const L = V.T(), X = L.x, B = d.B, LX = d.LX, n1 = B.liste[0], l1 = LX.liste[0];
  return { kicker:X.kicker[d.type] + '   ·   ' + R.date, hook:X.hook[d.type] + '…', mien:X.mien[d.type],
    gros:String(n1.gros || '').replace(/[.…]+$/, ''), titre:l1.titre, constat:n1.constat || '', preuve:l1.preuve,
    aussi:LX.liste.slice(1, 3).map(e => e.titre), produits:X.produits[d.type], cta:LX.cta, etToi:X.etToi, site:L.site, aussiMot:X.aussi, photo:X.photo };
}

/* ===================================================================== la base commune */
let WEBGL2 = null;   /* teste une fois (un contexte de test est rendu aussitot) */
class Base {
  constructor(R, d, o){
    this.R = R; this.d = d; this.V = o.V; this.ap = !!o.apercu; this.P = d.PX; this.n = d.items.length;
    this.K = this.V.couleurs(d); this.KL = this.V.couleursL(d);
    this.tx = textesX(d, this.V, R);
    this.jetables = [];
    this.lay = { kickY:300, hookY:1268, constatY:820, preuveY:1300, autY:1410, titreY:318, legY:1170, ctaY:760 };
    this.encre = [244, 238, 226]; this.acc = this.KL.acc;
    /* les aliments : en clair, la palette tiree au hasard est ignoree ; les couleurs viennent des 4 aliments retenus */
    this.clair = d.type === 'aliment';
    if (this.clair){
      this.AL = palAliments(R.imgs, this.n);
      this.K = { c1:this.AL.vives[0], c2:this.AL.vives[1 % this.AL.vives.length] };
      this.KL = Object.assign({}, this.KL, { noir:[250, 250, 249], ivoire:CLAIR.encre, or:[190, 152, 88], acc:this.AL.textes[0] });
      const pr = this.AL.prim; this.encre = CLAIR.encre; this.acc = this.AL.textes[pr];
      this.KL.acc = this.acc; this.K = { c1:this.AL.vives[pr], c2:this.AL.vives[(pr + 1) % this.AL.vives.length] };
      this.al2 = (R.imgs || []).slice(0, this.n).map(prepAliment);
      this.heroH = 1.95; this.ctaEtagere = true;
    }
  }
  async init(){
    this.rw = this.ap ? 360 : 720; this.rh = this.ap ? 640 : 1280;
    this.gl = null;
    if (this.permet3D()){
      try {
        const cv = canvas(this.rw, this.rh);
        this.gl = new THREE.WebGLRenderer({ canvas:cv, antialias:true, alpha:false, powerPreference:'high-performance', preserveDrawingBuffer:false, stencil:false });
        this.gl.setPixelRatio(1); this.gl.setSize(this.rw, this.rh, false); this.gl.outputColorSpace = THREE.SRGBColorSpace;
      } catch(e){ this.gl = null; }
    }
    if (this.gl){
      this.scene = new THREE.Scene();
      this.cam = new THREE.PerspectiveCamera(30, 9 / 16, .1, 200); this.cam.position.set(0, 0, 12); this.cam.lookAt(0, 0, 0);
      await this.construire();
      await this.produits3D();
      this.gl.compile(this.scene, this.cam);
    } else { this.cta3D = false; await this.construire2D(); }
    this.pret = true;
    return this;
  }
  permet3D(){
    if (/[?&]x2d=1(&|$)/.test(location.search)) return false;
    if (WEBGL2 === null){ try { const g = canvas(2, 2).getContext('webgl2'); WEBGL2 = !!g; const lc = g && g.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); } catch(e){ WEBGL2 = false; } }
    return WEBGL2;
  }
  /* les soins : une texture par photo detouree ; sans photo, un ecrin vide (jamais une image inventee) */
  async produits3D(){
    if (this.clair){ this.prods = null; return; }   /* en clair, les aliments sont dessines nets par-dessus la 3D (aliments2D) */
    this.prods = [];
    for (let k = 0; k < this.n; k++){
      const im = this.R.imgs && this.R.imgs[k], it = this.d.items[k], g = new THREE.Group();
      let p = null, r = null;
      if (im){ const tp = texProduit(im, it.fond); this.jetables.push(tp.t); p = planProduit(tp.t, tp.asp, 1.6, false); r = planProduit(tp.t, tp.asp, 1.6, true); g.add(r); g.add(p); }
      else {
        const anneau = new THREE.Mesh(new THREE.TorusGeometry(.42, .012, 8, 96), new THREE.MeshBasicMaterial({ color:srgb(this.KL.or), transparent:true, opacity:0 }));
        anneau.position.y = .72; g.add(anneau); p = anneau;
      }
      const h = spriteHalo(srgb(this.acc), 0); h.scale.set(2.6, 2.6, 1); h.position.set(0, .8, -.3); g.add(h);
      g.visible = false; this.scene.add(g);
      this.prods.push({ g, p, r, h, img:!!im });
    }
  }
  /* ou en est le soin k : entree, heros, puis il rejoint l'etagere du haut */
  etatProduit(k, q){
    const P = this.P, s = P.prod + k * P.dp, e = s + P.dp, V = this.V;
    const entre = V.eOut3(V.seg(q, s - .12, s + .38)), part = k < this.n - 1 ? V.eInOut(V.seg(q, e - .15, e + .3)) : 0;
    const fin = 1 - V.seg(q, P.cta - .35, P.cta + .05);
    return { a:entre * fin, heros:1 - part, etagere:part, actif:q >= s - .12 && q < e + .3 && q < P.cta, e:q - s, s };
  }
  /* « Et toi ? » : les aliments se posent en rang sous la question, comme sur l'accueil aliments */
  posCta(k){ const n = this.n, pas = Math.min(215, 820 / Math.max(1, n)); return { x:wx(CX + (k - (n - 1) / 2) * pas), y:wy(this.ctaSol || 1395), z:1.2, h:.4 }; }
  posEtagere(k){ const n = this.n, pas = this.clair ? Math.min(205, 800 / Math.max(1, n)) : Math.min(160, 760 / Math.max(1, n)); return { x:wx(CX + (k - (n - 1) / 2) * pas), y:wy(this.clair ? 500 : 492), z:1.2, h:this.clair ? .42 : .34 }; }
  majProduits(q, heros){
    this._heros = heros;
    if (!this.prods) return;
    const V = this.V, P = this.P;
    this.prods.forEach((pr, k) => {
      const st = this.etatProduit(k, q);
      if (!this.n || q < P.prod - .2 || q > P.cta + .1 || st.a <= .001){ pr.g.visible = false; return; }
      pr.g.visible = true;
      const E = this.posEtagere(k), hp = heros, u = st.etagere, ent = st.a;
      const x = V.lerp(hp.x, E.x, u), y = V.lerp(hp.y, E.y, u), z = V.lerp(hp.z, E.z, u), s = V.lerp(hp.h, E.h, u) / 1.6;
      const arr = 1 - V.eOut3(V.seg(q, st.s - .12, st.s + .38));
      pr.g.position.set(x + (hp.dx || 0) * arr, y + (hp.dy || 0) * arr, z - (hp.dz || 1.5) * arr);
      pr.g.scale.setScalar(s * (1 - .12 * arr));
      pr.g.rotation.y = (hp.ry || .35) * arr + .06 * Math.sin(st.e * .9) * (1 - u);
      const lum = 1 - .25 * u;
      if (pr.img){ pr.p.material.uniforms.uA.value = ent; pr.p.material.uniforms.uLum.value = lum; pr.r.material.uniforms.uA.value = ent * (1 - u);
        pr.p.material.uniforms.uSweep.value = V.lerp(-.6, 1.8, V.seg(st.e, .05, .75)); }
      else pr.p.material.opacity = ent * .8;
      pr.h.material.opacity = ent * (1 - u) * (hp.halo != null ? hp.halo : .35);
    });
  }
  /* ---------- le dessin d'une image : la 3D, puis le texte net */
  dessine(tAbs){
    const R = this.R; R.debutL();
    const q = R.tempoL(tAbs);
    if (this.gl){ this.maj(q); this.gl.render(this.scene, this.cam); const x = R.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.drawImage(this.gl.domElement, 0, 0, W, H); }
    else this.dessine2D(q);
    if (this.clair) this.aliments2D(q);
    this.surcouche(q);
    this.flash(q);
    if (this.clair) this.signe(); else R.signeL(this.encreA(q), .9);
  }
  /* ---------- les aliments, en clair : nets (pleine resolution), qui flottent, ombre douce au sol et leger reflet (comme l'accueil aliments) */
  aliments2D(q){
    const P = this.P, V = this.V, x = this.R.x, n = this.n;
    if (!n || !this.al2 || q < P.prod - .2 || q > P.retour + .5) return;
    const hp = this._heros || { x:wx(CX), y:wy(1100), z:.6 }, H0 = this.heroH || 1.95, ph = q / 18 * 6.2832;
    const vers = this.ctaEtagere ? V.eInOut(V.seg(q, P.cta - .45, P.cta + .35)) : 0;
    const garde = this.ctaEtagere ? 1 - V.seg(q, P.retour - .1, P.retour + .45) : 1 - V.seg(q, P.cta - .35, P.cta + .05);
    const ordre = []; for (let k = 0; k < n; k++) ordre.push(k);
    ordre.sort((a, b) => this.etatProduit(b, q).etagere - this.etatProduit(a, q).etagere);   /* le heros par-dessus l'etagere */
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over';
    for (const k of ordre){
      const A = this.al2[k], st = this.etatProduit(k, q), s0 = st.s;
      const entre = V.eOut3(V.seg(q, s0 - .12, s0 + .38)), a = entre * garde;
      if (a <= .003) continue;
      const E = this.posEtagere(k), u = st.etagere, Cx = this.posCta ? this.posCta(k) : E;
      let X = V.lerp(hp.x, E.x, u), Y = V.lerp(hp.y, E.y, u), Z = V.lerp(hp.z, E.z, u), h = V.lerp(H0, E.h, u);
      if (vers > 0){ X = V.lerp(X, Cx.x, vers); Y = V.lerp(Y, Cx.y, vers); Z = V.lerp(Z, Cx.z, vers); h = V.lerp(h, Cx.h * (this.ctaH || 1.15), vers); }
      const kz = 12 / (12 - Z), px = 540 + X * PXU * kz, sol = 960 - Y * PXU * kz + 38 * (1 - entre), sc = .93 + .07 * entre;
      let hh = h * PXU * kz * sc;
      const flot = (5 + 7 * (1 - u) * (1 - vers)) * (Math.sin(ph * 3 + k * 1.7) * .5 + .5), rot = .021 * Math.sin(ph * 3 + k * 1.7 + .6) * (1 - u * .6);
      if (!A){
        /* sans photo (licence) : un ecrin vide, jamais une image inventee */
        x.globalAlpha = a * .7; x.strokeStyle = V.rgba(CLAIR.trait, 1); x.lineWidth = 2; x.beginPath(); x.arc(px, sol - hh * .5 - flot, hh * .32, 0, 6.2832); x.stroke(); x.globalAlpha = 1; continue;
      }
      let w = hh * A.w / A.h; const wMax = Math.min(hh * 1.6, (this.largeMax || 860) * (1 - .55 * u * (1 - vers)) ); if (w > wMax){ hh *= wMax / w; w = wMax; }
      /* l'ombre au sol : plus petite et plus legere quand l'aliment monte */
      const oy = sol + 4, ow = w * (.66 - .08 * flot / 12), oh = Math.max(7, hh * .05);
      x.save(); x.globalAlpha = a * (.26 - .1 * flot / 12); x.translate(px, oy); x.scale(1, oh / ow);
      const og = x.createRadialGradient(0, 0, 0, 0, 0, ow / 2); og.addColorStop(0, 'rgba(37,31,19,1)'); og.addColorStop(.5, 'rgba(37,31,19,.42)'); og.addColorStop(1, 'rgba(37,31,19,0)');
      x.fillStyle = og; x.beginPath(); x.arc(0, 0, ow / 2, 0, 6.2832); x.fill(); x.restore();
      /* le reflet (retourne, 9 %) */
      x.globalAlpha = a * .1 * (1 - .5 * u); x.drawImage(A.rf, px - w / 2, sol + 2 + flot * .4, w, hh * .42); x.globalAlpha = 1;
      /* l'aliment */
      x.save(); x.globalAlpha = a; x.translate(px, sol - flot); x.rotate(rot); x.drawImage(A.net, -w / 2, -hh, w, hh); x.restore();
    }
    x.globalAlpha = 1;
  }
  /* ---------- le texte, en clair (typo de l'interface aliments) */
  caps(txt, cx, y, size, col, a, o){
    o = o || {}; if (!this.clair) return this.R.capsL(txt, cx, y, size, col, a, o);
    if (a <= 0) return 0;
    const x = this.R.x, V = this.V, t = V.maj(txt), nc = Array.from(t).length, maxW = o.maxW || 800, poids = o.poids || 500; let s = size * .92, sp = o.spC != null ? o.spC : .2;
    const larg = () => { x.font = fontS(s, poids); return x.measureText(t).width + sp * s * (nc - 1); };
    while (larg() > maxW && sp > .06) sp -= .02;
    while (larg() > maxW && s > size * .55) s -= 1;
    x.globalAlpha = Math.max(0, Math.min(1, a)); x.fillStyle = V.rgba(col, 1); const w = V.traceL(x, t, cx, y, sp * s, o.align); x.globalAlpha = 1; return w;
  }
  sans(txt, cx, y, size, col, a, o){
    o = o || {}; if (a <= 0) return size;
    const x = this.R.x, V = this.V, t = String(txt), nc = Array.from(t).length, maxW = o.maxW || 820, poids = o.poids || 400, tr = o.tr != null ? o.tr : -.045; let s = size;
    const larg = () => { x.font = fontS(s, poids); return x.measureText(t).width + tr * s * (nc - 1); };
    while (larg() > maxW && s > size * .5) s -= 2;
    x.globalAlpha = Math.max(0, Math.min(1, a)); x.fillStyle = V.rgba(col, 1); V.traceL(x, t, cx, y, tr * s, o.align); x.globalAlpha = 1; return s;
  }
  /* un texte en lignes (au plus n), qui reduit pour tenir ; les espaces fines (« assiette ? ») ne coupent pas */
  lignes(txt, cx, y, size, lh, col, a, o){
    o = o || {}; const x = this.R.x, maxW = o.maxW || 820, n = o.n || 2, poids = o.poids || 400, tr = o.tr != null ? o.tr : -.045, mots = String(txt).split(/[ \t\n]+/).filter(Boolean);
    let s = size, ls = [];
    const w = t => x.measureText(t).width + tr * s * (Array.from(t).length - 1);
    for (;;){
      x.font = fontS(s, poids); ls = []; let cur = '';
      for (const m of mots){ const t = cur ? cur + ' ' + m : m; if (!cur || w(t) <= maxW) cur = t; else { ls.push(cur); cur = m; } }
      if (cur) ls.push(cur);
      if ((ls.length <= n && ls.every(l => w(l) <= maxW)) || s <= size * .5) break;
      s -= 2;
    }
    /* une ligne ne finit pas sur un petit mot : on le passe a la ligne suivante */
    for (let i = 0; i < ls.length - 1; i++){ const m = ls[i].split(' '); if (m.length > 1 && m[m.length - 1].replace(/[’']/g, '').length <= 3){ const nx = m.pop() + ' ' + ls[i + 1]; x.font = fontS(s, poids); if (w(nx) <= maxW){ ls[i] = m.join(' '); ls[i + 1] = nx; } } }
    if (a > 0) ls.forEach((l, i) => this.sans(l, cx, y + i * lh * s / size, s, col, a, { maxW, poids, tr }));
    return { n:ls.length, s };
  }
  signe(){
    const V = this.V; this.R.x.setTransform(1, 0, 0, 1, 0, 0); this.R.x.globalCompositeOperation = 'source-over';
    this.caps((this.d.exemple ? V.T().exemple + '   ·   ' : '') + this.R.L.site, CX, 1500, 23, CLAIR.gris, .95, { spC:.24 });
  }
  /* le repli 2D en clair : le fond, la phrase */
  dessine2DC(q){
    const x = this.R.x, V = this.V, P = this.P; x.setTransform(1, 0, 0, 1, 0, 0); peintFondClair(x, W, H);
    if (q >= P.rev && q < (this.n ? P.prod : P.cta)) this.lignes(this.tx.titre, CX, 1000, 130, 130, CLAIR.encre, V.eOut3(V.seg(q, P.rev, P.rev + .4)), { n:2, maxW:820 });
    this._heros = { x:wx(CX), y:wy(1100), z:.6 };
  }
  encreA(){ return this.encre; }
  /* le flash de la revelation : un seul, doux (moins de 3 par seconde, toujours) */
  flash(q){ const e = q - this.P.rev; if (e < 0 || e > .22) return; const x = this.R.x;
    if (this.clair){   /* sur le blanc : une seule bouffee douce de la couleur du premier aliment */
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = .22 * (1 - e / .22); const rg = x.createRadialGradient(CX, 900, 0, CX, 900, 900);
      rg.addColorStop(0, this.V.rgba(this.AL.pastels[this.AL.prim], 1)); rg.addColorStop(1, this.V.rgba(this.AL.pastels[this.AL.prim], 0)); x.fillStyle = rg; x.fillRect(0, 0, W, H); x.globalAlpha = 1; return; } x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = .32 * (1 - e / .22); x.globalCompositeOperation = 'lighter'; x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; }
  aHook(q){ const V = this.V; return q < 2 ? 1 - V.seg(q, .78, 1.12) : V.seg(q, 16.5, 17.45); }
  /* la pastille de la preuve : LIBELLE (capitales fines) + valeur (Didone) ; la note dessous */
  pastille(pr, cy, a, ink, fondPill){
    if (!pr || a <= 0) return; const R = this.R, V = this.V, x = R.x;
    if (this.clair) return this.pastilleC(pr, cy, a, ink);
    const lab = pr.label ? V.maj(pr.label) : '', val = pr.label ? pr.val : '';
    x.font = V.fontJ(24, 500); const wl = lab ? x.measureText(lab).width + 24 * .3 * (Array.from(lab).length - 1) : 0;
    x.font = V.fontJ(60, 500); const wv = val ? x.measureText(val).width : 0;
    let w = pr.label ? wl + 30 + wv + 90 : 0;
    if (!pr.label){ x.font = V.fontJ(24, 500); w = x.measureText(V.maj(pr.texte || '')).width + 24 * .3 * Array.from(pr.texte || '').length + 90; }
    w = Math.min(820, w); const h = 104;
    x.save(); x.globalAlpha = a * .62; x.fillStyle = V.rgba(fondPill || [0, 0, 0], 1); V.rond(x, CX - w / 2, cy - h / 2, w, h, h / 2); x.fill();
    x.globalAlpha = a * .5; x.strokeStyle = V.rgba(ink, 1); x.lineWidth = 1.5; x.stroke(); x.restore();
    if (pr.label){
      const k = Math.min(1, (w - 90) / (wl + 30 + wv)), x0 = CX - (wl + 30 + wv) * k / 2;
      x.save(); x.translate(x0, cy + 22); x.scale(k, k);
      x.globalAlpha = .85 * a; x.fillStyle = V.rgba(ink, 1); x.font = V.fontJ(24, 500); V.traceL(x, lab, 0, -8, 24 * .3, 'left');
      x.globalAlpha = a; x.font = V.fontJ(60, 500); x.textAlign = 'left'; x.fillText(val, wl + 30, -2); x.restore(); x.textAlign = 'center';
    } else R.capsL(pr.texte || '', CX, cy + 9, 24, ink, a, { sp:.3, maxW:w - 80 });
    if (pr.note){ const bas = pr.note === V.maj(pr.note); if (bas) R.capsL(pr.note, CX, cy + h / 2 + 46, 21, ink, .8 * a, { sp:.34 }); else R.garaL(pr.note, CX, cy + h / 2 + 52, 40, ink, .85 * a, { it:true }); }
  }
  /* la preuve en clair : une pilule blanche au filet fin (comme les choix de l'interface), libelle gris + valeur */
  pastilleC(pr, cy, a, ink){
    const V = this.V, x = this.R.x, G = CLAIR.gris;
    const lab = pr.label ? V.maj(pr.label) : '', val = pr.label ? String(pr.val) : '';
    x.font = fontS(21, 500); const wl = lab ? x.measureText(lab).width + 21 * .18 * (Array.from(lab).length - 1) : 0;
    x.font = fontS(58, 400); const wv = val ? x.measureText(val).width - 58 * .04 * (Array.from(val).length - 1) : 0;
    let w = pr.label ? wl + 28 + wv + 96 : 0;
    if (!pr.label){ x.font = fontS(21, 500); w = x.measureText(V.maj(pr.texte || '')).width + 21 * .18 * Array.from(pr.texte || '').length + 96; }
    w = Math.min(820, w); const h = 104;
    x.save(); x.globalAlpha = a * .94; x.fillStyle = '#ffffff'; V.rond(x, CX - w / 2, cy - h / 2, w, h, h / 2); x.fill();
    x.globalAlpha = a; x.strokeStyle = V.rgba(CLAIR.trait, 1); x.lineWidth = 2; x.stroke(); x.restore();
    if (pr.label){
      const k = Math.min(1, (w - 96) / (wl + 28 + wv)), x0 = CX - (wl + 28 + wv) * k / 2;
      x.save(); x.translate(x0, cy + 20); x.scale(k, k);
      x.globalAlpha = a; x.fillStyle = V.rgba(G, 1); x.font = fontS(21, 500); V.traceL(x, lab, 0, -6, 21 * .18, 'left');
      x.fillStyle = V.rgba(ink, 1); x.font = fontS(58, 400); V.traceL(x, val, wl + 28, 0, -58 * .04, 'left'); x.restore(); x.textAlign = 'center';
    } else this.caps(pr.texte || '', CX, cy + 8, 22, G, a, { spC:.18, maxW:w - 80 });
    if (pr.note){ const bas = pr.note === V.maj(pr.note); if (bas) this.caps(pr.note, CX, cy + h / 2 + 46, 20, G, a, { spC:.2 }); else this.sans(pr.note, CX, cy + h / 2 + 52, 40, G, a); }
  }
  /* ---------- le texte en clair : la meme chronologie, la typo et les couleurs de l'interface aliments */
  surcoucheC(q){
    const V = this.V, P = this.P, tx = this.tx, L = this.lay, ink = this.encreA(q), acc = this.accA ? this.accA(q) : this.acc, G = CLAIR.gris;
    const aH = this.aHook(q);
    if (aH > 0){
      this.caps(tx.kicker, CX, L.kickY, 21, G, aH, { spC:.2 });
      if (!this.hook3D){
        const m = tx.hook.split(' '), c = Math.ceil(m.length / 2);
        this.sans(m.slice(0, c).join(' '), CX, L.hookY - (1 - aH) * 12, 94, ink, aH, { maxW:820 });
        this.sans(m.slice(c).join(' '), CX, L.hookY + 98 - (1 - aH) * 12, 94, ink, aH, { maxW:820 });
      }
    }
    const fin1 = this.n ? P.prod : P.cta, sortie = 1 - V.seg(q, fin1 - .3, fin1 - .02);
    if (q >= P.rev && q < fin1){
      const ac = V.eOut3(V.seg(q, P.rev + .2, P.rev + .55)) * sortie;
      if (tx.constat && ac > 0 && !this.sansConstat) this.caps(tx.constat, CX, L.constatY + (1 - ac) * 14, 26, acc, ac, { spC:.2 });
      const ap = V.eOut3(V.seg(q, P.preuve, P.preuve + .35)) * sortie;
      this.pastille(tx.preuve, L.preuveY + (1 - ap) * 16, ap, ink);
      const aa = V.eOut3(V.seg(q, P.aut, P.aut + .35)) * sortie;
      if (tx.aussi.length && aa > 0){
        this.caps(tx.aussiMot, CX, L.autY - 48, 19, G, aa, { spC:.2 });
        this.sans(tx.aussi.join('   '), CX, L.autY + 8, 44, ink, aa, { maxW:820 });
      }
    }
    if (this.n && q >= P.prod - .2 && q < P.cta + .1){
      const k = Math.max(0, Math.min(this.n - 1, Math.floor((q - P.prod) / P.dp)));
      const at = V.eOut3(V.seg(q, P.prod - .2, P.prod + .2)) * (1 - V.seg(q, P.cta - .3, P.cta));
      const num = n => (n < 10 ? '0' : '') + n;
      this.caps(V.maj(tx.produits) + '   ·   ' + num(k + 1) + ' / ' + num(this.n), CX, L.titreY, 21, G, at, { spC:.2 });
      for (let j = 0; j < this.n; j++){
        const st = this.etatProduit(j, q), s0 = st.s, e = s0 + P.dp;
        const la = V.seg(q, s0 + .08, s0 + .34) * (j < this.n - 1 ? 1 - V.seg(q, e - .22, e - .02) : 1 - V.seg(q, P.cta - .3, P.cta));
        if (la > 0) this.legendeC(j, L.legY, la, ink);
      }
    }
    if (q >= P.cta - .05 && q < P.retour + .6) this.ctaC(q, ink, acc);
  }
  legendeC(k, y, a, ink){
    const it = this.d.items[k], G = CLAIR.gris;
    const haut = [it.marque, it.etape].filter(Boolean).join('  ·  ');
    if (haut) this.caps(haut, CX, y, 20, G, a, { spC:.2 });
    const r = this.lignes(it.nom, CX, y + 74, 62, 64, ink, a, { n:2, maxW:820 });
    const yb = y + 74 + (r.n - 1) * 64 * r.s / 62;
    if (it.credit) this.caps(this.tx.photo + ' · ' + it.credit, CX, yb + 44, 15, G, .85 * a, { spC:.1, maxW:760 });
  }
  ctaC(q, ink, acc){
    const V = this.V, P = this.P, tx = this.tx, L = this.lay;
    const a = V.eOut3(V.seg(q, P.cta + .15, P.cta + .55)) * (1 - V.seg(q, P.retour - .1, P.retour + .45));
    const a2 = V.eOut3(V.seg(q, P.cta + .35, P.cta + .8)) * (1 - V.seg(q, P.retour - .1, P.retour + .45));
    if (a <= 0) return;
    if (!this.cta3D) this.sans(tx.cta[0], CX, L.ctaY, 118, ink, a);
    const y1 = L.ctaY + (this.cta3D ? 215 : 140), r = this.lignes(tx.cta[1], CX, y1, 84, 90, ink, a2, { n:2, maxW:800 });
    this.caps(tx.site, CX, y1 + (r.n - 1) * 90 * r.s / 84 + 96, 32, acc, a2, { spC:.24 });
  }
  /* ---------- le texte, par-dessus la 3D (commun ; chaque variante regle les positions) */
  surcouche(q){
    if (this.clair) return this.surcoucheC(q);
    const R = this.R, V = this.V, P = this.P, tx = this.tx, L = this.lay, ink = this.encreA(q), acc = this.accA ? this.accA(q) : this.acc;
    /* l'accroche */
    const aH = this.aHook(q);
    if (aH > 0){
      R.capsL(tx.kicker, CX, L.kickY, 21, ink, .85 * aH, { sp:.36 });
      if (!this.hook3D){
        const m = tx.hook.split(' '), c = Math.ceil(m.length / 2);
        R.garaL(m.slice(0, c).join(' '), CX, L.hookY - (1 - aH) * 12, 96, ink, aH, { it:true, maxW:820 });
        R.garaL(m.slice(c).join(' '), CX, L.hookY + 100 - (1 - aH) * 12, 96, ink, aH, { it:true, maxW:820 });
      }
    }
    /* le constat, la preuve, les autres besoins */
    const fin1 = this.n ? P.prod : P.cta, sortie = 1 - V.seg(q, fin1 - .3, fin1 - .02);
    if (q >= P.rev && q < fin1){
      const ac = V.eOut3(V.seg(q, P.rev + .2, P.rev + .55)) * sortie;
      if (tx.constat && ac > 0 && !this.sansConstat) R.capsL(tx.constat, CX, L.constatY + (1 - ac) * 14, 28, acc, ac, { sp:.34 });
      const ap = V.eOut3(V.seg(q, P.preuve, P.preuve + .35)) * sortie;
      this.pastille(tx.preuve, L.preuveY + (1 - ap) * 16, ap, ink, this.fondPill);
      const aa = V.eOut3(V.seg(q, P.aut, P.aut + .35)) * sortie;
      if (tx.aussi.length && aa > 0){
        const t = tx.aussi.join('   ');
        R.capsL(tx.aussiMot, CX, L.autY - 46, 19, acc, .85 * aa, { sp:.34 });
        R.garaL(t, CX, L.autY + 8, 46, ink, aa, { it:true, maxW:820 });
      }
    }
    /* les soins */
    if (this.n && q >= P.prod - .2 && q < P.cta + .1){
      const k = Math.max(0, Math.min(this.n - 1, Math.floor((q - P.prod) / P.dp)));
      const at = V.eOut3(V.seg(q, P.prod - .2, P.prod + .2)) * (1 - V.seg(q, P.cta - .3, P.cta));
      const num = n => (n < 10 ? '0' : '') + n;
      R.capsL(V.maj(tx.produits) + '   ·   ' + num(k + 1) + ' / ' + num(this.n), CX, L.titreY, 22, ink, .9 * at, { sp:.36 });
      for (let j = 0; j < this.n; j++){
        const st = this.etatProduit(j, q), s = st.s, e = s + P.dp;
        const la = V.seg(q, s + .08, s + .34) * (j < this.n - 1 ? 1 - V.seg(q, e - .22, e - .02) : 1 - V.seg(q, P.cta - .3, P.cta));
        if (la > 0) this.legende(j, L.legY, la, ink, acc);
      }
    }
    /* « Et toi ? » */
    if (q >= P.cta - .05 && q < P.retour + .6) this.cta(q, ink, acc);
  }
  legende(k, y, a, ink, acc){
    const R = this.R, V = this.V, it = this.d.items[k];
    const haut = this.d.type === 'aliment' ? [it.marque, it.etape].filter(Boolean).join(' · ') : it.etape;
    if (haut) R.capsL(haut, CX, y, 21, acc, .95 * a, { sp:.32 });
    const nl = R.lignesL(it.nom, CX, y + 70, 56, 60, ink, a, { n:2, maxW:820 });
    let yb = y + 70 + nl * 60 - 12;
    if (it.marque && this.d.type !== 'aliment'){ R.capsL(it.marque, CX, yb + 22, 21, ink, .8 * a, { sp:.34 }); yb += 34; }
    if (it.credit) R.capsL(this.tx.photo + ' · ' + it.credit, CX, yb + 30, 15, ink, .6 * a, { sp:.12, maxW:760 });
  }
  cta(q, ink, acc){
    const R = this.R, V = this.V, P = this.P, tx = this.tx, L = this.lay;
    const a = V.eOut3(V.seg(q, P.cta + .15, P.cta + .55)) * (1 - V.seg(q, P.retour - .1, P.retour + .45));
    const a2 = V.eOut3(V.seg(q, P.cta + .35, P.cta + .8)) * (1 - V.seg(q, P.retour - .1, P.retour + .45));
    if (a <= 0) return;
    if (!this.cta3D) R.garaL(tx.cta[0], CX, L.ctaY, 118, ink, a, { it:true });
    const lay = R.uneL(tx.cta[1], 800, 280, 128, { nmax:2 }); R.dessineUneL(lay, CX, L.ctaY + (this.cta3D ? 250 : 170), ink, null, a2);
    R.capsL(tx.site, CX, L.ctaY + (this.cta3D ? 470 : 400), 40, acc, a2, { sp:.34 });
  }
  /* ---------- le repli 2D (sans WebGL) : un fond, une forme, le meme texte */
  async construire2D(){}
  dessine2D(q){ const x = this.R.x; x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = this.V.rgba(this.KL.noir, 1); x.fillRect(0, 0, W, H); }
  /* le soin en 2D (repli) : la photo, posee comme dans la 3D */
  produits2D(q, heros){
    if (this.clair) return;
    const R = this.R, V = this.V, x = R.x, P = this.P;
    if (!this.n || q < P.prod - .2 || q > P.cta + .1) return;
    for (let k = 0; k < this.n; k++){
      const st = this.etatProduit(k, q); if (st.a <= .001) continue;
      const im = R.imgs && R.imgs[k], E = this.posEtagere(k), u = st.etagere;
      const px = V.lerp(CX + (heros.x || 0) * PXU, 540 + E.x * PXU, u), py = V.lerp(960 - heros.y * PXU, 960 - E.y * PXU, u), h = V.lerp(480, 125, u);
      x.globalAlpha = st.a;
      if (im){ const s = h / (im.boite ? im.boite.h : im.height), w = (im.boite ? im.boite.w : im.width) * s; x.drawImage(im.brut || im, px - w / 2, py - h, w, h); }
      else { x.strokeStyle = V.rgba(this.KL.or, 1); x.lineWidth = 2; x.beginPath(); x.arc(px, py - h * .45, h * .25, 0, 6.283); x.stroke(); }
      x.globalAlpha = 1;
    }
  }
  liberer(){
    if (!this.gl) return;
    try {
      this.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material){ [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); if (m.matcap) m.matcap.dispose(); m.dispose(); }); } });
      if (this.scene.background && this.scene.background.dispose) this.scene.background.dispose();
      this.jetables.forEach(j => { try { j.dispose(); } catch(e){} });
      this.gl.dispose(); this.gl.forceContextLoss();
    } catch(e){}
    this.gl = null;
  }
}

/* ===================================================================== X1 · TON VISAGE EN LUMIERE */
const VS_PART = `uniform float uPh, uDisp, uSwirl, uSize, uMix, uAlpha, uPulse, uImp, uFres, uClair;
uniform vec3 uC1, uC2;
attribute vec3 aFace; attribute vec3 aCloud; attribute vec3 aCol; attribute vec4 aRnd;
varying vec3 vCol; varying float vA;
void main(){
  float k = clamp((uDisp - aRnd.x * 0.35) / 0.65, 0.0, 1.0); k = k * k * (3.0 - 2.0 * k);
  vec3 c = aCloud * uImp;
  float ang = uSwirl * (0.55 + aRnd.z);
  float cs = cos(ang), sn = sin(ang); c.xz = mat2(cs, -sn, sn, cs) * c.xz;
  c.y += sin(uPh * 2.0 + aRnd.w * 6.283) * 0.18 * k;
  vec3 f = aFace + vec3(sin(uPh * 3.0 + aRnd.w * 40.0), cos(uPh * 2.0 + aRnd.z * 30.0), sin(uPh + aRnd.y * 20.0)) * 0.006;
  vec3 p = mix(f, c, k);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.65 + aRnd.y * 0.7) * (1.0 + uPulse * 0.5 + k * 0.6) / -mv.z;
  vec3 pal = mix(uC1, uC2, aRnd.z);
  vCol = mix(aCol, pal, clamp(uMix + k * 0.7 * (1.0 - uClair), 0.0, 1.0)) * mix(1.0 + uPulse * 0.8 + k * 0.5, 1.0, uClair);
  vec3 nv = normalize((modelViewMatrix * vec4(normalize(aFace + vec3(0.0001)), 0.0)).xyz);
  float fr = 1.0 - abs(nv.z);
  vA = uAlpha * (0.72 + 0.28 * sin(uPh * 4.0 + aRnd.w * 50.0)) * mix(1.0, 0.35 + 1.5 * fr * fr, uFres * (1.0 - k));
}`;
const FS_PART = `varying vec3 vCol; varying float vA;
void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.1, d) * vA; if (a < 0.003) discard; gl_FragColor = vec4(vCol * a, 1.0); }`;
/* en clair : des points fins et colores, en melange normal (une lueur blanche disparaitrait sur le blanc) */
const FS_PART_C = `varying vec3 vCol; varying float vA;
void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.32, d) * vA; if (a < 0.003) discard; gl_FragColor = vec4(vCol, a);
  #include <colorspace_fragment>
}`;

/* la vignette du scan -> des points 3D (dans le repere du visage : hauteur du visage = 2) */
async function echantillonVisage(vis, N, graine, clair){
  const im = await chargeImg(vis.src); if (!im) return null;
  const w = 360, h = Math.round(360 * im.naturalHeight / im.naturalWidth), c = canvas(w, h), g = c.getContext('2d', { willReadFrequently:true });
  g.drawImage(im, 0, 0, w, h); let px; try { px = g.getImageData(0, 0, w, h).data; } catch(e){ return null; }
  let cx, cy, rx, ry, nez = null, yeux = [], bouche = null;
  if (vis.pts){
    const P = vis.pts.map(p => [p[0] * w, p[1] * h]), jaw = P.slice(0, 17), br = P.slice(17, 27);
    const mnx = Math.min(...jaw.map(p => p[0])), mxx = Math.max(...jaw.map(p => p[0])), chin = P[8][1], by = Math.min(...br.map(p => p[1])), fh = chin - by, top = by - .62 * fh;
    cx = (mnx + mxx) / 2; cy = (top + chin) / 2; ry = (chin - top) / 2 * 1.04; rx = (mxx - mnx) / 2 * 1.1;
    nez = P[30]; const moy = a => [a.reduce((s, p) => s + p[0], 0) / a.length, a.reduce((s, p) => s + p[1], 0) / a.length];
    yeux = [moy(P.slice(36, 42)), moy(P.slice(42, 48))]; bouche = moy(P.slice(48, 60));
  } else if (vis.box){ const b = vis.box; cx = (b.x + b.w / 2) * w; cy = (b.y + b.h * .42) * h; rx = b.w * w * .62; ry = b.h * h * .8; }
  else { cx = w * .5; cy = h * .46; ry = h * .32; rx = ry * .78; }
  if (vis.sujet === 'cheveux'){ rx *= 1.75; ry *= 1.42; cy -= ry * .1; }
  const rnd = alea(graine), face = new Float32Array(N * 3), col = new Float32Array(N * 3), lum = new Float32Array(N);
  const gauss = (x, y, p, s) => { if (!p) return 0; const dx = (x - p[0]) / ry, dy = (y - p[1]) / ry; return Math.exp(-(dx * dx + dy * dy) / (2 * s * s)); };
  /* la luminance du visage, etiree entre ses 5 % et 95 % (une photo terne garde des traits lisibles) */
  const ech = []; for (let k = 0; k < 900; k++){ const a = rnd() * 6.2832, rr = Math.sqrt(rnd()) * .85, X = (cx + Math.cos(a) * rx * rr) | 0, Y = (cy + Math.sin(a) * ry * rr) | 0; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; const j = (Y * w + X) * 4; ech.push((.299 * px[j] + .587 * px[j + 1] + .114 * px[j + 2]) / 255); }
  ech.sort((a, b) => a - b); const lo = ech.length ? ech[Math.floor(ech.length * .05)] : 0, hi = ech.length ? ech[Math.floor(ech.length * .95)] : 1;
  let n = 0, essais = 0;
  while (n < N && essais < N * 40){
    essais++;
    const x = cx + (rnd() * 2 - 1) * rx * 1.1, y = cy + (rnd() * 2 - 1) * ry * 1.1;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const ex = (x - cx) / rx, ey = (y - cy) / ry, e = Math.sqrt(ex * ex + ey * ey); if (e > 1.1) continue;
    const i = ((y | 0) * w + (x | 0)) * 4, r = px[i] / 255, gg = px[i + 1] / 255, b = px[i + 2] / 255, l = .299 * r + .587 * gg + .114 * b;
    const ln = Math.min(1, Math.max(0, (l - lo) / Math.max(.05, hi - lo)));
    /* en clair, une gravure : les points se serrent dans les ombres (sourcils, yeux, contours), la peau claire respire */
    const p = lisse(1.1, .8, e) * (clair ? .1 + .9 * Math.pow(1 - ln, 1.15) : vis.sujet === 'cheveux' ? .4 + .6 * ln : .08 + .92 * Math.pow(ln, 1.3));
    if (rnd() > p) continue;
    let z = .62 * Math.sqrt(Math.max(0, 1 - Math.min(1, e) ** 2)) + .1 * (l - .5);
    z += .22 * gauss(x, y, nez, .1) - .07 * gauss(x, y, yeux[0], .07) - .07 * gauss(x, y, yeux[1], .07) + .03 * gauss(x, y, bouche, .08);
    face[n * 3] = (x - cx) / ry; face[n * 3 + 1] = -(y - cy) / ry; face[n * 3 + 2] = z;
    /* la couleur de la photo, un peu plus lumineuse (c'est de la lumiere) */
    const kk = (.3 + .62 * ln) / Math.max(.08, l);
    col[n * 3] = Math.min(1, r * kk * 1.04); col[n * 3 + 1] = Math.min(1, gg * kk); col[n * 3 + 2] = Math.min(1, b * kk * .96); lum[n] = ln;
    n++;
  }
  if (n < N * .3) return null;
  return { face, col, lum, n };
}
/* sans photo : une sphere de lumiere, modulee par les vraies mesures (aucun trait de visage) */
function nuageAbstrait(N, vals, c1, c2, graine){
  const rnd = alea(graine), face = new Float32Array(N * 3), col = new Float32Array(N * 3), V = vals && vals.length ? vals : [.6, .8, .5, .7, .9];
  for (let i = 0; i < N; i++){
    const y = 1 - 2 * (i + .5) / N, r0 = Math.sqrt(1 - y * y), th = i * 2.399963;
    const u = ((th / 6.2832) % 1 + 1) % 1 * V.length, j = Math.floor(u), f = u - j, m = V[j % V.length] * (1 - f) + V[(j + 1) % V.length] * f;
    const R = .92 * (1 + .06 * (m - .5) + .015 * Math.sin(y * 18)) * (rnd() < .18 ? Math.pow(rnd(), .35) : 1);
    face[i * 3] = Math.cos(th) * r0 * R; face[i * 3 + 1] = y * R; face[i * 3 + 2] = Math.sin(th) * r0 * R;
    const k = (y + 1) / 2, c = mel(c1, c2, k), w = rnd() < .08 ? .5 : 0;
    col[i * 3] = Math.min(1, c[0] / 255 + w); col[i * 3 + 1] = Math.min(1, c[1] / 255 + w); col[i * 3 + 2] = Math.min(1, c[2] / 255 + w);
  }
  return { face, col, n:N };
}
class X1 extends Base {
  constructor(R, d, o){ super(R, d, o); this.lay = Object.assign(this.lay, { constatY:1080, preuveY:1335, autY:330, hookY:1250 }); this.fondPill = [0, 0, 0]; this.aussiHaut = true; }
  async construire(){
    const s = this.scene, K = this.KL, V = this.V;
    const C = this.clair;
    s.background = C ? fondClair() : srgb(mel(K.noir, [0, 0, 0], .4));
    const N = this.ap ? (C ? 7000 : 9000) : (C ? 20000 : 26000), graine = 7 + this.d.type.length * 31;
    let pts = this.d.visage ? await echantillonVisage(this.d.visage, N, graine, C) : null;
    this.abstrait = !pts;
    const c1 = this.K.c1, c2 = this.K.c2;
    if (!pts) pts = nuageAbstrait(N, this.R.vals, mel(c1, [255, 255, 255], .25), mel(c2, [255, 255, 255], .25), graine);
    if (C){
      /* chaque point prend la couleur d'un des aliments retenus (plus sombre dans les ombres du visage) */
      const rc = alea(graine + 5), Vv = this.AL.vives, lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
      for (let i = 0; i < pts.n; i++){
        /* sur la sphere : quatre zones de couleur qui se fondent (elles tournent avec elle) ; sur un visage : un pointille melange */
        let ix = Math.floor(rc() * Vv.length) % Vv.length;
        if (!pts.lum){ const fx = pts.face[i * 3], fy = pts.face[i * 3 + 1], fz = pts.face[i * 3 + 2], t = ((Math.atan2(fz, fx) / 6.2832 + .5) + .1 * fy + (rc() - .5) * .16 + 1) % 1; ix = Math.floor(t * Vv.length) % Vv.length; }
        const base = Vv[ix], fonce = pts.lum ? .45 * (1 - pts.lum[i]) : .12 * rc(), c = mel(base, CLAIR.encre, fonce);
        pts.col[i * 3] = lin(c[0]); pts.col[i * 3 + 1] = lin(c[1]); pts.col[i * 3 + 2] = lin(c[2]);
      }
    }
    const n = pts.n, rnd = alea(graine + 1), cloud = new Float32Array(n * 3), rr = new Float32Array(n * 4);
    for (let i = 0; i < n; i++){
      /* une galaxie : un disque incline a deux bras (la lumiere tourbillonne avant de reformer le visage) */
      const r = .25 + 1.25 * Math.pow(rnd(), .7), bras = (rnd() < .5 ? 0 : Math.PI) + r * 2.6 + (rnd() - .5) * .7, ep = (rnd() - .5) * (.3 - .12 * r);
      cloud[i * 3] = Math.cos(bras) * r; cloud[i * 3 + 2] = Math.sin(bras) * r; cloud[i * 3 + 1] = ep + cloud[i * 3 + 2] * .75;
      rr[i * 4] = rnd(); rr[i * 4 + 1] = rnd(); rr[i * 4 + 2] = rnd(); rr[i * 4 + 3] = rnd();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pts.face.slice(0, n * 3), 3));
    geo.setAttribute('aFace', new THREE.BufferAttribute(pts.face.slice(0, n * 3), 3));
    geo.setAttribute('aCloud', new THREE.BufferAttribute(cloud, 3));
    geo.setAttribute('aCol', new THREE.BufferAttribute(pts.col.slice(0, n * 3), 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rr, 4));
    this.u = { uPh:{ value:0 }, uDisp:{ value:0 }, uSwirl:{ value:0 }, uSize:{ value:(this.abstrait ? 46 : 40) * this.rw / 720 * (C ? .74 : 1) }, uMix:{ value:C ? 0 : this.abstrait ? .2 : .12 },
               uAlpha:{ value:.95 }, uPulse:{ value:0 }, uImp:{ value:1 }, uFres:{ value:this.abstrait ? (C ? .25 : 1) : 0 }, uClair:{ value:C ? 1 : 0 }, uC1:{ value:srgb(mel(c1, [255, 255, 255], .3)) }, uC2:{ value:srgb(mel(c2, [255, 255, 255], .3)) } };
    const mat = C ? new THREE.ShaderMaterial({ uniforms:this.u, vertexShader:VS_PART, fragmentShader:FS_PART_C, transparent:true, depthWrite:false, blending:THREE.NormalBlending })
                  : new THREE.ShaderMaterial({ uniforms:this.u, vertexShader:VS_PART, fragmentShader:FS_PART, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending });
    this.points = new THREE.Points(geo, mat); this.points.frustumCulled = false;
    this.tete = new THREE.Group(); this.tete.add(this.points); s.add(this.tete);
    this.sTete = this.abstrait ? 1.08 : 1.27;
    /* le halo derriere la tete */
    this.haloT = spriteHalo(srgb(mel(this.acc, [255, 255, 255], .2)), .14); this.haloT.scale.set(7, 7, 1); this.haloT.position.set(0, 0, -2); this.tete.add(this.haloT);
    if (C){ this.haloT.visible = false; this.ombreT = spriteOmbre(0); s.add(this.ombreT); }
    /* la phrase, en lettres de lumiere (Didone), devant le visage ; en clair, la typo de l'interface, en gris-noir */
    const nomP = C ? 'inter-400' : 'bodoni-600', font = await police3D(nomP);
    const lay = coupe3D(font, nomP, this.tx.titre, 2.75, .8, C ? .6 : .56, 3, 1.08, V);
    const mt = new THREE.MeshBasicMaterial({ color:C ? srgb(CLAIR.encre) : srgb([255, 246, 228], 1.15), transparent:true, opacity:0, toneMapped:false });
    this.phrase = bloc3D(font, nomP, lay, mt, { depth:.06, seg:6 }, V);
    const yP = 1182; this.phrase.groupe.position.set(wx(CX), wy(yP), 0); s.add(this.phrase.groupe); this.matPhrase = mt;
    this.haloP = spriteHalo(srgb(this.acc), 0); this.haloP.scale.set(4.6, 1.8, 1); this.haloP.position.set(wx(CX), wy(yP), -.3); s.add(this.haloP); if (C) this.haloP.visible = false;
    const dem = this.phrase.haut / 2 * PXU;
    this.lay.constatY = yP - dem - 46; this.lay.preuveY = Math.min(1338, yP + dem + 84);
  }
  maj(q){
    const V = this.V, P = this.P, u = this.u;
    u.uPh.value = q / 18 * 6.2832;
    const disp = q < P.rev ? V.eInOut(V.seg(q, 1.55, 3.45)) : 1 - V.eOutExpo(V.seg(q, P.rev, P.rev + .5));
    u.uDisp.value = disp;
    u.uSwirl.value = 2.6 * V.eIn3(V.seg(q, 1.55, 4)) * (q < P.rev + .5 ? 1 : 0);
    u.uImp.value = q < P.rev ? 1 - .22 * V.eIn3(V.seg(q, 3.4, 4)) : 1;
    u.uPulse.value = Math.max(0, 1 - (q - P.rev) / .8) * (q >= P.rev ? 1 : 0);
    const prod = this.n ? V.seg(q, P.prod - .3, P.prod + .3) * (1 - V.seg(q, P.cta - .3, P.cta + .4)) : 0;
    const cta = V.seg(q, P.cta - .2, P.cta + .3) * (1 - V.seg(q, P.retour, P.retour + .6));
    u.uAlpha.value = this.clair ? (.86 + .1 * disp) * (1 - .82 * prod) * (1 - .86 * cta) : (.8 + .5 * disp) * (1 - .8 * prod) * (1 - .68 * cta);
    u.uMix.value = (this.abstrait ? .2 : .12) + .5 * prod;
    /* la camera tourne lentement autour du visage (periodique sur la boucle) */
    const yaw = .34 * Math.sin(q / 18 * 6.2832), dz = -1.1 * V.eInOut(V.seg(q, 1, 3.75)) * (q < P.rev ? 1 : 0);
    this.tete.rotation.y = yaw + (this.abstrait ? q / 18 * 6.2832 : 0); this.tete.rotation.x = this.abstrait ? .35 : .05 * Math.sin(q / 18 * 12.566);
    this.tete.position.set(wx(CX), wy(680) + .45 * prod, dz - 2.2 * prod);
    this.tete.scale.setScalar(this.sTete * (1 + .03 * Math.sin(q / 18 * 6.2832 * 2)));
    this.haloT.material.opacity = (.12 + .1 * u.uPulse.value) * (1 - .6 * prod);
    if (this.ombreT){   /* l'ombre douce au sol, sous la sphere (ou le visage) ; elle s'efface quand la lumiere tourbillonne */
      const p = this.tete.position, sc = this.sTete * this.tete.scale.x / this.sTete;
      this.ombreT.position.set(p.x, p.y - 1.28 * sc, p.z - .2); this.ombreT.scale.set(2.3 * sc, .3 * sc, 1);
      const finP = this.n ? P.prod : P.cta, txt = q >= P.rev - .1 && q < finP + .3 ? 1 : 0;   /* pas d'ombre sous la phrase */
      this.ombreT.material.opacity = .2 * (1 - disp) * (1 - .85 * prod) * (1 - cta) * (1 - txt);
    }
    /* la phrase : lettres qui montent de la profondeur, une a une */
    const fin = this.n ? P.prod : P.cta, out = V.seg(q, fin - .3, fin + .05);
    this.phrase.lettres.forEach((m, i) => {
      const e = V.eOut3(V.seg(q, P.rev + .02 + i * .025, P.rev + .5 + i * .025));
      m.position.z = -.9 * (1 - e) + .3 * out; m.position.y = m.userData.y - .12 * (1 - e) + .2 * out; m.scale.setScalar(.94 + .06 * e);
    });
    this.matPhrase.opacity = q >= P.rev ? V.eOut3(V.seg(q, P.rev, P.rev + .4)) * (1 - out) : 0;
    this.phrase.groupe.visible = this.matPhrase.opacity > .001;
    this.phrase.groupe.rotation.y = .06 * Math.sin(q / 18 * 6.2832);
    this.haloP.material.opacity = .16 * this.matPhrase.opacity;
    this.majProduits(q, { x:wx(CX), y:wy(1100), z:.6, h:1.42, dz:2, dy:-.2, ry:.5, halo:.3 });
  }
  /* le repli 2D : les memes points, projetes a la main (moins nombreux) */
  async construire2D(){
    const N = 2600, g = 7 + this.d.type.length * 31;
    let pts = this.d.visage ? await echantillonVisage(this.d.visage, N, g) : null; this.abstrait = !pts;
    if (!pts) pts = nuageAbstrait(N, this.R.vals, this.K.c1, this.K.c2, g);
    this.p2 = pts;
  }
  dessine2D(q){
    if (this.clair) return this.dessine2DC(q);
    const x = this.R.x, V = this.V, P = this.P, p = this.p2; x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = V.rgba(mel(this.KL.noir, [0, 0, 0], .4), 1); x.fillRect(0, 0, W, H);
    const disp = q < P.rev ? V.eInOut(V.seg(q, 1.55, 3.45)) : 1 - V.eOutExpo(V.seg(q, P.rev, P.rev + .5)), yaw = .34 * Math.sin(q / 18 * 6.2832), cs = Math.cos(yaw), sn = Math.sin(yaw);
    const prod = this.n ? V.seg(q, P.prod - .3, P.prod + .3) * (1 - V.seg(q, P.cta - .3, P.cta + .4)) : 0, S = (this.abstrait ? 1.25 : 1.45) * PXU, cy = 745 - 140 * prod;
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < p.n; i++){
      let a = p.face[i * 3], b = p.face[i * 3 + 1], c = p.face[i * 3 + 2];
      const r = 2.6 * ((i * 7919) % 101) / 101 + 1.4, th = i * 2.4 + 2.6 * V.eIn3(V.seg(q, 1.55, 4)) * (q < P.rev + .5 ? 1 : 0);
      a = V.lerp(a, Math.cos(th) * r, disp); b = V.lerp(b, (((i * 31) % 97) / 97 - .5) * 3, disp); c = V.lerp(c, Math.sin(th) * r * .8, disp);
      const X = a * cs + c * sn, Z = -a * sn + c * cs, k = 12 / (12 - Z);
      x.globalAlpha = (.55 - .4 * prod); x.fillStyle = 'rgb(' + Math.round(p.col[i * 3] * 255) + ',' + Math.round(p.col[i * 3 + 1] * 255) + ',' + Math.round(p.col[i * 3 + 2] * 255) + ')';
      x.fillRect(CX + X * S * k - 2, cy - b * S * k - 2, 4, 4);
    }
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    if (q >= P.rev && q < (this.n ? P.prod : P.cta)){ const a = V.eOut3(V.seg(q, P.rev, P.rev + .4)); const lay = this.R.uneL(this.tx.titre, 820, 150, 130, {}); this.R.dessineUneL(lay, CX, 1182, [255, 246, 228], null, a); }
    this.produits2D(q, { x:0, y:wy(1110) });
  }
}

/* ===================================================================== X2 · CHROME LIQUIDE */
class X2 extends Base {
  constructor(R, d, o){ super(R, d, o); this.lay = Object.assign(this.lay, { constatY:842, preuveY:1312, autY:262, hookY:1300, ctaY:760 }); this.cta3D = true; this.fondPill = [6, 6, 10]; }
  async construire(){
    const s = this.scene, K = this.K, KL = this.KL, V = this.V, gl = this.gl;
    const C = this.clair;
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05;
    const n0 = KL.noir;
    if (C){
      /* en clair : un studio blanc (fond infini), deux drapeaux sombres qui dessinent le metal, et la couleur des aliments en reflets */
      s.background = fondClair();
      const AV = this.AL.vives;
      this.env = studio(gl, [srgb([255, 255, 255], 1.2), srgb([214, 214, 210]), srgb([92, 92, 88])], [
        { c:srgb([255, 255, 255], 4), x:0, y:7, z:3, w:7, h:1.6 }, { c:srgb([255, 255, 255], 3), x:-7, y:1, z:2, w:2, h:12 },
        { c:srgb([255, 255, 255], 2.2), x:5, y:-1, z:-6, w:3, h:6 } ]);
    } else {
    s.background = fondDegrade([[0, mel([8, 8, 10], K.c1, .16)], [.5, [6, 6, 8]], [1, mel([4, 4, 6], K.c2, .12)]]);
    const ciel = [srgb([150, 155, 170], .9), srgb([28, 28, 34]), srgb([4, 4, 6])];
    this.env = studio(gl, ciel, [
      { c:srgb([255, 255, 255], 6), x:0, y:7, z:3, w:7, h:1.6 }, { c:srgb([255, 255, 255], 4), x:-7, y:1, z:2, w:2, h:12 }, { c:srgb([255, 255, 255], 3.5), x:7, y:0, z:-1, w:2, h:12 },
      { c:srgb(K.c1, 3), x:4, y:-3, z:6, w:5, h:3 }, { c:srgb(K.c2, 3), x:-5, y:-4, z:-5, w:6, h:3 }, { c:srgb([120, 210, 255], 2.5), x:2, y:3, z:-8, w:4, h:5 } ]);
    }
    this.jetables.push(this.env);
    s.environment = this.env.texture;
    /* la goutte : une sphere deformee par un bruit qui boucle (meme forme au debut et a la fin) */
    this.u = { uOff:{ value:new THREE.Vector3() }, uOff2:{ value:new THREE.Vector3() }, uAmp:{ value:.12 }, uFreq:{ value:1.1 } };
    const mb = new THREE.MeshPhysicalMaterial({ color:0xffffff, metalness:1, roughness:C ? .06 : .04, iridescence:C ? .55 : 1, iridescenceIOR:1.7, iridescenceThicknessRange:[280, 900], envMapIntensity:C ? 1 : 1.25 });
    mb.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, this.u);
      sh.vertexShader = 'uniform vec3 uOff, uOff2; uniform float uAmp, uFreq;\n' + NOISE +
        '\nvec3 vyDisp(vec3 p){ float n = snoise(p * uFreq + uOff); float n2 = snoise(p * uFreq * 1.9 + uOff2); return p * (1.0 + uAmp * (n + 0.22 * n2)); }\n' + sh.vertexShader;
      sh.vertexShader = sh.vertexShader.replace('#include <beginnormal_vertex>', `
        vec3 vyT = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 vyB = normalize(cross(normal, vyT));
        vec3 vyP0 = vyDisp(position);
        vec3 vyPa = vyDisp(position + vyT * 0.012); vec3 vyPb = vyDisp(position + vyB * 0.012);
        vec3 objectNormal = normalize(cross(vyPa - vyP0, vyPb - vyP0));
        if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;`);
      sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = vyP0;');
    };
    const seg = this.ap ? [96, 64] : [160, 112];
    this.goutte = new THREE.Mesh(new THREE.SphereGeometry(1, seg[0], seg[1]), mb); s.add(this.goutte);
    this.haloG = spriteHalo(srgb(K.c1), .18); this.haloG.scale.set(6, 6, 1); s.add(this.haloG);
    if (C){ this.haloG.visible = false; this.ombreG = spriteOmbre(0); s.add(this.ombreG); }
    /* la phrase, en lettres chromees (Didone capitales) ; en clair, une laque gris-noir brillante, dans la typo de l'interface */
    const nomP = C ? 'inter-400' : 'bodoni-600', font = await police3D(nomP);
    const mc = C ? new THREE.MeshPhysicalMaterial({ color:srgb([30, 31, 28]), metalness:.1, roughness:.34, clearcoat:1, clearcoatRoughness:.14, envMapIntensity:.55 })
                 : new THREE.MeshPhysicalMaterial({ color:0xffffff, metalness:1, roughness:.16, iridescence:.5, iridescenceIOR:1.5, iridescenceThicknessRange:[200, 600], envMapIntensity:2.4 });
    const lay = C ? coupe3D(font, nomP, this.tx.titre, 2.85, 1.3, .9, 2, 1.02, V) : coupe3D(font, 'bodoni-600', this.tx.gros, 2.85, 1.45, .95, 3, 1.04, V);
    this.phrase = bloc3D(font, nomP, lay, mc, { depth:C ? .2 : .26, bevel:.026, bevelSize:C ? .01 : .016, bevelSeg:3, seg:6 }, V);
    this.phrase.groupe.position.set(wx(CX), wy(1060), 0); s.add(this.phrase.groupe);
    this.lay.constatY = 1060 - this.phrase.haut / 2 * PXU - 58; this.lay.preuveY = Math.min(1340, Math.max(1290, 1060 + this.phrase.haut / 2 * PXU + 92));
    /* « Et toi ? » en chrome aussi */
    const tE = C ? V.phraseCas(this.tx.etToi) : this.tx.etToi, lc = coupe3D(font, nomP, tE, 2.8, .9, .9, 1, 1.04, V);
    this.etToi = bloc3D(font, nomP, lc, mc, { depth:.22, bevel:.018, bevelSize:.012, seg:6 }, V);
    this.etToi.groupe.position.set(wx(CX), wy(this.lay.ctaY - 40), 0); s.add(this.etToi.groupe);
    /* un anneau chrome derriere chaque soin */
    this.anneau = new THREE.Mesh(new THREE.TorusGeometry(1.05, .045, 24, 160), C ? new THREE.MeshPhysicalMaterial({ color:0xffffff, metalness:1, roughness:.12, envMapIntensity:1 }) : mc); this.anneau.visible = false; s.add(this.anneau);
  }
  posGoutte(q){
    const V = this.V, P = this.P, rev = V.eInOut(V.seg(q, P.rev - .05, P.rev + .6)), ret = V.eInOut(V.seg(q, P.retour, P.fin - .3));
    const prod = this.n ? V.seg(q, P.prod - .4, P.prod + .3) : 0, cta = V.seg(q, P.cta - .3, P.cta + .3);
    let y = wy(820), s = 1.12, z = 0;
    const yr = wy(470), sr = .5;
    const k = Math.min(1, rev) * (1 - ret);
    y = V.lerp(y, yr, k); s = V.lerp(s, sr, k);
    z = -1.5 * prod * (1 - cta) * (1 - ret);
    return { y, s:s * (1 - .25 * prod * (1 - cta)), z };
  }
  maj(q){
    const V = this.V, P = this.P, u = this.u, ph = q / 18 * 6.2832;
    u.uOff.value.set(1.6 * Math.cos(ph), 1.6 * Math.sin(ph), .6 * Math.sin(2 * ph));
    u.uOff2.value.set(1.1 * Math.cos(2 * ph + 1), 1.1 * Math.sin(2 * ph + 1), 3.0);
    const tens = V.eIn3(V.seg(q, 1, 3.75)) * (q < P.rev ? 1 : 0), choc = q >= P.rev ? Math.max(0, 1 - (q - P.rev) / .7) : 0;
    u.uAmp.value = .16 + .2 * tens + .28 * choc * choc;
    u.uFreq.value = .62 + .55 * tens;
    const g = this.posGoutte(q), sil = q >= 3.75 && q < P.rev ? .92 : 1;
    this.goutte.position.set(wx(CX), g.y, g.z); this.goutte.scale.setScalar(g.s * sil * (1 + .25 * choc));
    this.goutte.rotation.y = ph; this.goutte.rotation.x = .3 * Math.sin(ph);
    this.haloG.position.set(wx(CX), g.y, g.z - 1.5); this.haloG.material.opacity = .14 + .2 * tens + .25 * choc;
    if (this.ombreG){ const r = g.s * sil * (1 + .25 * choc), haut = .5 + .25 * Math.sin(ph * 2); this.ombreG.position.set(wx(CX), g.y - r * (1.15 + haut * .3) - .25, g.z - .3); this.ombreG.scale.set(2.5 * r, .34 * r, 1); this.ombreG.material.opacity = .26 * (1 - .4 * haut) * (q < P.retour ? 1 - V.seg(q, P.cta - .4, P.cta) : V.seg(q, P.retour, P.fin - .4)); }
    this.scene.environmentRotation.y = ph; this.scene.environmentRotation.x = .25 * Math.sin(ph);
    /* les lettres sortent de la goutte, une a une, et prennent leur place */
    const fin = this.n ? P.prod : P.cta, out = V.eIn3(V.seg(q, fin - .35, fin + .1));
    const gp = new THREE.Vector3(wx(CX), g.y, g.z), base = this.phrase.groupe.position;
    this.phrase.groupe.visible = q >= P.rev && q < fin + .1;
    this.phrase.lettres.forEach((m, i) => {
      const e = V.seg(q, P.rev + .04 + i * .035, P.rev + .62 + i * .035), eb = V.eOutBack(e), ud = m.userData;
      m.position.set(V.lerp(gp.x - base.x, ud.x, eb), V.lerp(gp.y - base.y, ud.y, eb) - 1.6 * out, V.lerp(gp.z, 0, eb) + 1.2 * out);
      m.scale.setScalar(Math.max(.001, V.lerp(.05, 1, Math.min(1, eb * 1.1)) * (1 - out)));
      m.rotation.y = (1 - V.eOut3(e)) * Math.PI * 1.2 + .1 * Math.sin(ph * 2 + i);
      m.rotation.x = .05 * Math.sin(ph * 3 + i * .7);
    });
    /* et toi ? */
    const ac = V.eOut3(V.seg(q, P.cta, P.cta + .55)), ao = V.eIn3(V.seg(q, P.retour - .1, P.retour + .45));
    this.etToi.groupe.visible = q >= P.cta && q < P.retour + .5;
    this.etToi.lettres.forEach((m, i) => { const e = V.eOutBack(V.seg(q, P.cta + i * .04, P.cta + .5 + i * .04)); m.scale.setScalar(Math.max(.001, e * (1 - ao))); m.rotation.y = (1 - Math.min(1, e)) * 2 + .08 * Math.sin(ph * 2 + i); m.position.y = m.userData.y + .5 * ao; });
    /* les soins, devant un anneau chrome */
    const heros = { x:wx(CX), y:wy(1100), z:1.6, h:1.65, dz:2.5, dy:-.3, ry:.6, halo:.25 };
    this.majProduits(q, heros);
    const actif = this.n && q >= P.prod - .2 && q < P.cta;
    this.anneau.visible = !!actif;
    if (actif){ const a = V.eOut3(V.seg(q, P.prod - .2, P.prod + .3)) * (1 - V.seg(q, P.cta - .35, P.cta)); this.anneau.position.set(wx(CX), wy(860), .4); this.anneau.scale.setScalar(Math.max(.001, a)); this.anneau.rotation.set(.25 * Math.sin(ph * 2), ph * 2, 0); }
  }
  async construire2D(){}
  dessine2D(q){
    if (this.clair) return this.dessine2DC(q);
    const x = this.R.x, V = this.V, P = this.P, K = this.K; x.setTransform(1, 0, 0, 1, 0, 0);
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, V.rgba(mel(this.KL.noir, K.c1, .22), 1)); bg.addColorStop(.55, V.rgba(this.KL.noir, 1)); bg.addColorStop(1, V.rgba(mel(this.KL.noir, K.c2, .14), 1));
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const g = this.posGoutte(q), cy = 960 - g.y * PXU, r = 330 * g.s / 1.12, ph = q / 18 * 6.2832, tens = V.eIn3(V.seg(q, 1, 3.75)) * (q < P.rev ? 1 : 0);
    x.beginPath(); for (let i = 0; i <= 64; i++){ const a = i / 64 * 6.2832, rr = r * (1 + (.06 + .12 * tens) * Math.sin(3 * a + ph * 2) + .04 * Math.cos(5 * a - ph)); const px = CX + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    const gr = x.createLinearGradient(CX - r, cy - r, CX + r, cy + r); gr.addColorStop(0, '#f6f7fb'); gr.addColorStop(.3, V.rgba(K.c2, 1)); gr.addColorStop(.5, '#20232b'); gr.addColorStop(.7, V.rgba(K.c1, 1)); gr.addColorStop(1, '#e9ecf3');
    x.fillStyle = gr; x.fill();
    if (q >= P.rev && q < (this.n ? P.prod : P.cta)){ const a = V.eOut3(V.seg(q, P.rev, P.rev + .4)), lay = this.R.uneL(this.tx.gros, 860, 420, 260, { caps:true, poids:600 }); const og = x.createLinearGradient(0, 900, 0, 1220); og.addColorStop(0, '#ffffff'); og.addColorStop(.5, '#8c93a3'); og.addColorStop(1, '#f2f4f8'); this.R.dessineUneL(lay, CX, 1060, og, null, a); }
    this.produits2D(q, { x:0, y:wy(1100) });
  }
}

/* ===================================================================== X3 · LE FLACON DE VERRE */
class X3 extends Base {
  constructor(R, d, o){ super(R, d, o); this.lay = Object.assign(this.lay, { constatY:1252, preuveY:1345, autY:236, hookY:1262, ctaY:1300 }); this.fondPill = [8, 7, 6]; }
  async construire(){
    const s = this.scene, K = this.K, KL = this.KL, V = this.V, gl = this.gl;
    const C = this.clair;
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = C ? 1 : 1.1;
    s.background = C ? fondClair() : fondDegrade([[0, mel(KL.noir, [0, 0, 0], .5)], [.62, mel(KL.noir, this.acc, .1)], [1, mel(KL.noir, [0, 0, 0], .6)]]);
    if (C){
      /* en clair : un studio blanc ; deux bandes sombres sur les cotes dessinent le bord du verre (fond clair, eclairage de packshot) */
      this.env = studio(gl, [srgb([236, 236, 233]), srgb([206, 205, 200]), srgb([120, 118, 112])], [
        { c:srgb([255, 252, 246], 3.5), x:-5, y:1, z:3, w:1, h:10 }, { c:srgb([255, 252, 246], 3), x:5, y:1, z:3, w:1, h:10 },
        { c:srgb([20, 20, 19]), x:-6, y:0, z:-1.5, w:2.4, h:14 }, { c:srgb([20, 20, 19]), x:6, y:0, z:-1.5, w:2.4, h:14 },
        { c:srgb([40, 40, 38]), x:0, y:0, z:-8, w:3, h:14 }, { c:srgb([255, 250, 240], 2.2), x:0, y:7, z:0, w:6, h:6 } ]);
    } else {
    const ciel = [srgb([30, 28, 26]), srgb([6, 6, 6]), srgb([2, 2, 2])];
    this.env = studio(gl, ciel, [
      { c:srgb([255, 250, 240], 6), x:-5, y:1, z:3, w:1.2, h:10 }, { c:srgb([255, 250, 240], 5), x:5, y:1, z:3, w:1.2, h:10 },
      { c:srgb([255, 244, 226], 3), x:0, y:7, z:0, w:6, h:6 }, { c:srgb(this.acc, 3), x:-2, y:0, z:-7, w:5, h:5 }, { c:srgb([255, 255, 255], 3.5), x:3, y:2, z:-5, w:1, h:8 } ]);
    }
    this.jetables.push(this.env); s.environment = this.env.texture;
    /* le flacon : un profil tourne (lathe), verre plein, et son bouchon d'or */
    const prof = [[0, -1.3], [.6, -1.3], [.68, -1.26], [.71, -1.16], [.71, .52], [.69, .66], [.6, .8], [.44, .9], [.27, .97], [.22, 1.03], [.22, 1.22], [0, 1.22]].map(p => new THREE.Vector2(p[0], p[1]));
    const seg = this.ap ? 48 : 96;
    const verre = new THREE.MeshPhysicalMaterial({ color:0xffffff, metalness:0, roughness:.03, transmission:1, thickness:C ? 1.2 : .9, ior:C ? 1.5 : 1.45, attenuationColor:srgb(mel(C ? this.AL.vives[0] : this.acc, [255, 255, 255], C ? .72 : .55)), attenuationDistance:C ? 5 : 4,
      specularIntensity:1, clearcoat:1, clearcoatRoughness:.04, envMapIntensity:C ? 1 : 1.5 });
    this.flacon = new THREE.Group();
    const corps = new THREE.Mesh(new THREE.LatheGeometry(prof, seg), verre); this.flacon.add(corps);
    const or = new THREE.MeshStandardMaterial({ color:srgb([214, 178, 112]), metalness:1, roughness:.22, envMapIntensity:1.3 });
    const bouchon = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .62, seg, 1), or); bouchon.position.y = 1.53; this.flacon.add(bouchon);
    const bague = new THREE.Mesh(new THREE.TorusGeometry(.3, .025, 12, seg), or); bague.rotation.x = Math.PI / 2; bague.position.y = 1.22; this.flacon.add(bague);
    this.flacon.position.set(wx(CX), wy(800), 0); s.add(this.flacon);
    this.sF = .92; this.flacon.scale.setScalar(this.sF);
    /* le reflet au sol (sans transmission : il ne coute presque rien) */
    const mr = new THREE.MeshStandardMaterial({ color:srgb(mel(this.acc, [255, 255, 255], .5)), metalness:1, roughness:.12, transparent:true, opacity:C ? .045 : .07, envMapIntensity:1.2, depthWrite:false });
    this.reflet = new THREE.Mesh(corps.geometry, mr); this.reflet.scale.y = -1; this.reflet.position.y = -2.6; this.flacon.add(this.reflet);
    if (C){ this.flaque = spriteOmbre(.3); this.flaque.scale.set(2.6, .3, 1); this.flaque.position.set(0, -1.31, .1); }
    else { this.flaque = spriteHalo(srgb([255, 240, 220]), .2); this.flaque.scale.set(3.6, .55, 1); this.flaque.position.set(0, -1.32, .2); }
    this.flacon.add(this.flaque);
    /* la lumiere dans le verre, avant la phrase (en clair : une teinte douce du premier aliment) */
    if (C){ this.lueur = new THREE.Sprite(new THREE.SpriteMaterial({ map:texCanvas(halo()), color:srgb(mel(this.AL.vives[0], [255, 255, 255], .2)), transparent:true, opacity:0, depthWrite:false, depthTest:false })); }
    else this.lueur = spriteHalo(srgb(mel(this.acc, [255, 255, 255], .45)), 0);
    this.lueur.scale.set(1.6, 2.4, 1); this.lueur.position.set(0, -.2, 0); this.flacon.add(this.lueur);
    /* la phrase, DANS le verre (opaque : le verre la refracte) */
    const nomP = C ? 'inter-400' : 'bodoni-400-italic', font = await police3D(nomP);
    /* la phrase est dessinee apres le verre (sans refraction : elle reste lisible), comme une lumiere prise dedans */
    const mt = new THREE.MeshBasicMaterial({ color:C ? srgb(CLAIR.encre) : srgb(mel(this.KL.noir, [70, 50, 26], .7)), transparent:true, opacity:C ? .96 : .92, depthTest:false, depthWrite:false, toneMapped:!C });
    const lay = coupe3D(font, nomP, this.tx.titre, 1.3, 1.3, C ? .56 : .64, 3, 1.08, V);
    this.phrase = bloc3D(font, nomP, lay, mt, { depth:.03, seg:6 }, V);
    this.phrase.groupe.position.set(0, -.18, .2); this.phrase.groupe.renderOrder = 10; this.phrase.lettres.forEach(m => { m.renderOrder = 10; }); this.flacon.add(this.phrase.groupe);
    const lc = coupe3D(font, nomP, this.tx.cta[0].replace(/,$/, '') + (V.langue() === 'fr' ? '\u202f?' : '?'), 1.0, .6, .5, 1, 1.1, V);
    this.etToi = bloc3D(font, nomP, lc, mt, { depth:.03, seg:6 }, V);
    this.etToi.groupe.position.set(0, -.18, .2); this.etToi.lettres.forEach(m => { m.renderOrder = 10; }); this.flacon.add(this.etToi.groupe);
    /* le fond de studio : un mur eclaire derriere le flacon (c'est lui que le verre refracte) */
    const cm = canvas(512, 512), gm = cm.getContext('2d'), rg = gm.createRadialGradient(256, 230, 10, 256, 256, 300), ca = mel(this.acc, [255, 240, 220], .45);
    if (C){ rg.addColorStop(0, '#ffffff'); rg.addColorStop(.45, '#fbfbfa'); rg.addColorStop(1, '#f1f1ee');
      gm.fillStyle = rg; gm.fillRect(0, 0, 512, 512);   /* le fond infini : le mur blanc qui s'arrondit en sol a peine plus gris (le verre refracte cette ligne douce) */
      const sol = gm.createLinearGradient(0, 300, 0, 512); sol.addColorStop(0, 'rgba(232,231,226,0)'); sol.addColorStop(.25, 'rgba(232,231,226,.75)'); sol.addColorStop(1, 'rgba(238,237,233,1)'); gm.fillStyle = sol; gm.fillRect(0, 300, 512, 212); }
    else {
      rg.addColorStop(0, 'rgb(' + mel(ca, [255, 255, 255], .2).join(',') + ')'); rg.addColorStop(.2, 'rgb(' + mel(ca, KL.noir, .35).join(',') + ')'); rg.addColorStop(.48, 'rgb(' + mel(ca, KL.noir, .9).join(',') + ')'); rg.addColorStop(1, 'rgb(' + mel(KL.noir, [0, 0, 0], .6).join(',') + ')');
      gm.fillStyle = rg; gm.fillRect(0, 0, 512, 512); }
    this.mur = new THREE.Mesh(new THREE.PlaneGeometry(13, 13), new THREE.MeshBasicMaterial({ map:texCanvas(cm), toneMapped:false })); this.mur.position.set(wx(CX), wy(760), -5); s.add(this.mur);
    this.cta3D = true;
    /* un rai de lumiere pour les soins (lumiere de pub) */
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(.12, 1.25, 4.6, 48, 1, true), new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
      uniforms:{ uA:{ value:0 }, uC:{ value:srgb([255, 244, 224]) } },
      vertexShader:'varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader:'uniform float uA; uniform vec3 uC; varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(abs(dot(vN, vV)), 1.6); float a = uA * f * smoothstep(0.0, 0.9, vUv.y) * 0.22; gl_FragColor = vec4(uC * a, a); }' }));
    cone.position.set(wx(CX), wy(860) + 1.6, .6); this.cone = cone; s.add(cone);
    this.lay.ctaY = 1330;
    if (C){ this.ctaEtagere = false; this.heroH = 1.75; this.lay.kickY = 1428; this.largeMax = 500;   /* le bouchon cachait l'edition : elle passe sous l'accroche */ this.posEtagere = k => { const pas = Math.min(150, 600 / Math.max(1, this.n)); return { x:wx(CX + 150 + (k - (this.n - 1) / 2) * pas), y:wy(500), z:1.2, h:.38 }; }; }
  }
  maj(q){
    const V = this.V, P = this.P, ph = q / 18 * 6.2832;
    /* la lumiere tourne (plus vite pendant la montee) */
    const tens = V.eIn3(V.seg(q, 1, 3.75)) * (q < P.rev ? 1 : 0);
    this.rot = ph + 1.4 * V.eInOut(V.seg(q, 1, 4)) - 1.4 * V.eInOut(V.seg(q, 4, 18));
    this.scene.environmentRotation.y = this.rot;
    const prod = this.n ? V.eInOut(V.seg(q, P.prod - .4, P.prod + .3)) * (1 - V.eInOut(V.seg(q, P.cta - .4, P.cta + .3))) : 0;
    this.flacon.position.set(wx(CX) - 1.15 * prod, wy(800) + .2 * prod, -3.2 * prod);
    this.flacon.rotation.y = .5 * Math.sin(ph) + .9 * tens;
    this.flacon.rotation.z = .03 * Math.sin(ph * 2);
    const choc = q >= P.rev ? Math.max(0, 1 - (q - P.rev) / .6) : 0;
    this.lueur.material.opacity = ((.12 + .5 * tens) * (q < P.rev ? 1 : 0) + .6 * choc + .08 * (q < P.rev ? 0 : 1) * (1 - prod)) * (this.clair ? .55 : 1);
    this.lueur.scale.set(1.5 + .5 * tens, 2.3 + .8 * tens, 1);
    const fin = this.n ? P.prod : P.cta, out = V.seg(q, fin - .4, fin);
    this.phrase.groupe.visible = q >= P.rev && q < fin + .05;
    this.phrase.lettres.forEach((m, i) => { const e = V.eOut3(V.seg(q, P.rev + i * .03, P.rev + .55 + i * .03)); m.scale.setScalar(Math.max(.001, e * (1 - out))); m.position.z = -.25 * (1 - e); });
    this.phrase.groupe.rotation.y = -this.flacon.rotation.y * .85;   /* la phrase reste face a nous dans le verre */
    const ac = V.eOut3(V.seg(q, P.cta + .1, P.cta + .6)), ao = V.seg(q, P.retour - .2, P.retour + .4);
    this.etToi.groupe.visible = q >= P.cta && q < P.retour + .45;
    this.etToi.lettres.forEach((m, i) => { const e = V.eOut3(V.seg(q, P.cta + .1 + i * .03, P.cta + .6 + i * .03)); m.scale.setScalar(Math.max(.001, e * (1 - ao))); });
    this.etToi.groupe.rotation.y = -this.flacon.rotation.y * .85;
    this.cone.material.uniforms.uA.value = prod;
    this.cone.visible = prod > .001 && !this.clair;
    this.majProduits(q, { x:wx(CX) + (this.clair ? .62 : .35) * prod, y:wy(1100), z:.6, h:1.42, dz:1.5, dy:0, ry:.4, halo:.22 });
    this.mur.position.x = wx(CX) - .6 * prod;
    this.flacon.visible = true;
  }
  dessine2D(q){
    if (this.clair) return this.dessine2DC(q);
    const x = this.R.x, V = this.V, P = this.P; x.setTransform(1, 0, 0, 1, 0, 0);
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#050505'); bg.addColorStop(.62, V.rgba(mel(this.KL.noir, this.acc, .12), 1)); bg.addColorStop(1, '#040404'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const prod = this.n ? V.eInOut(V.seg(q, P.prod - .4, P.prod + .3)) * (1 - V.eInOut(V.seg(q, P.cta - .4, P.cta + .3))) : 0;
    x.save(); x.globalAlpha = 1 - .7 * prod; x.translate(CX - 300 * prod, 0);
    const top = 470, bot = 1190, w = 390, sweep = ((q / 18) * 1.5 % 1) * 2 - .5;
    const g = x.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(Math.max(0, Math.min(1, sweep)), 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(255,255,255,.22)');
    x.fillStyle = g; V.rond(x, -w / 2, top, w, bot - top, 60); x.fill(); x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 2; x.stroke();
    x.fillStyle = 'rgba(214,178,112,1)'; x.fillRect(-55, top - 150, 110, 150);
    if (q >= P.rev && q < (this.n ? P.prod : P.cta)){ const lay = this.R.uneL(this.tx.titre, 320, 300, 120, { ital:'tout' }); this.R.dessineUneL(lay, 0, 860, [255, 244, 222], null, V.eOut3(V.seg(q, P.rev, P.rev + .5))); }
    x.restore();
    this.produits2D(q, { x:0, y:wy(1110) });
  }
  cta(q, ink, acc){
    const R = this.R, V = this.V, P = this.P, tx = this.tx;
    const a2 = V.eOut3(V.seg(q, P.cta + .35, P.cta + .8)) * (1 - V.seg(q, P.retour - .1, P.retour + .45));
    if (a2 <= 0) return;
    if (!this.gl) R.garaL(tx.cta[0].replace(/,$/, '') + (V.langue() === 'fr' ? '\u202f?' : '?'), CX, 880, 92, [255, 244, 222], a2, { it:true, maxW:330 });
    const lay = R.uneL(tx.cta[1], 800, 170, 92, { nmax:2 }); R.dessineUneL(lay, CX, 1330, ink, null, a2);
  }
  aHook(q){ const V = this.V; return q < 2 ? 1 - V.seg(q, .78, 1.12) : V.seg(q, 16.5, 17.45); }
  ctaC(q, ink, acc){
    const V = this.V, P = this.P, tx = this.tx;
    const a2 = V.eOut3(V.seg(q, P.cta + .35, P.cta + .8)) * (1 - V.seg(q, P.retour - .1, P.retour + .45));
    if (a2 <= 0) return;
    if (!this.gl) this.sans(tx.cta[0].replace(/,$/, '') + (V.langue() === 'fr' ? '\u202f?' : '?'), CX, 880, 92, ink, a2, { maxW:330 });
    this.lignes(tx.cta[1], CX, 1312, 74, 80, ink, a2, { n:2, maxW:800 });
  }
}

/* ===================================================================== X4 · TYPO GEANTE */
function matcap(c){
  const s = 256, cv = canvas(s, s), g = cv.getContext('2d'), V = c;
  g.fillStyle = 'rgb(' + mel(V, [0, 0, 0], .55).join(',') + ')'; g.fillRect(0, 0, s, s);
  g.save(); g.beginPath(); g.arc(s / 2, s / 2, s / 2, 0, 6.2832); g.clip();
  let r = g.createRadialGradient(s * .42, s * .36, 4, s * .5, s * .5, s * .52);
  r.addColorStop(0, 'rgb(' + mel(V, [255, 255, 255], .55).join(',') + ')'); r.addColorStop(.35, 'rgb(' + V.join(',') + ')'); r.addColorStop(.85, 'rgb(' + mel(V, [0, 0, 0], .45).join(',') + ')'); r.addColorStop(1, 'rgb(' + mel(V, [255, 255, 255], .25).join(',') + ')');
  g.fillStyle = r; g.fillRect(0, 0, s, s);
  r = g.createRadialGradient(s * .36, s * .3, 0, s * .36, s * .3, s * .16); r.addColorStop(0, 'rgba(255,255,255,.85)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, s, s);
  g.restore(); return texCanvas(cv);
}
class X4 extends Base {
  constructor(R, d, o){ super(R, d, o); this.hook3D = true; this.cta3D = true; this.lay = Object.assign(this.lay, { constatY:640, preuveY:1290, autY:1396, legY:1222, ctaY:760, kickY:300 }); }
  /* les vrais chiffres que la camera traverse : l'indice phare, puis les mesures des besoins (la plus basse en dernier) */
  nombres(){
    const d = this.d, V = this.V, out = [], vus = new Set();
    const ajoute = c => { if (!c || V.num(c.valeur) === null) return; const k = c.label + '|' + c.valeur; if (vus.has(k)) return; vus.add(k); out.push({ v:V.valTxt(c), label:V.maj(c.label) + (c.unite === '/100' ? '  /100' : '') }); };
    if (d.type === 'aliment'){ d.chiffres.filter(c => c.cle === 'revue').forEach(ajoute); d.chiffres.filter(c => c.cle === 'indice2').forEach(ajoute); d.chiffres.filter(c => c.cle === 'indice').forEach(ajoute); }
    else if (d.type === 'cheveux'){ d.chiffres.filter(c => c.cle === 'boucle' || /boucle|curl/i.test(c.label)).forEach(ajoute); d.chiffres.filter(c => c.cle === 'routine' || /routine/i.test(c.label)).forEach(ajoute); }
    else { ajoute(d.phare); d.B.liste.slice(0, 2).reverse().forEach(e => { if (e.ref && typeof e.ref === 'object') ajoute(e.ref); }); }
    return out.slice(0, 3);
  }
  couleursPhase(){
    if (this.clair){   /* en clair : le blanc de l'interface ; la revelation et « Et toi ? » a peine teintees par les aliments */
      const b = [250, 250, 249], A = this.AL.pastels;
      return { hook:b, nombres:b, rev:mel(A[this.AL.prim], [252, 252, 251], .55), prod:b, cta:b };   /* cta = hook : la boucle retombe sur la premiere image */
    }
    const K = this.K, noir = this.KL.noir.map(v => Math.min(v, 14));
    return { hook:K.c1, nombres:noir, rev:K.c2, prod:noir, cta:K.c1 };
  }
  fondA(q){
    const P = this.P, C = this.couleursPhase(), V = this.V, x = (a, b, t0) => mel(a, b, V.seg(q, t0, t0 + .14));
    if (q < 1.2) return x(C.hook, C.nombres, 1.06);
    if (q < P.rev - .5) return C.nombres;
    if (q < (this.n ? P.prod - .2 : P.cta - .2)) return x(C.nombres, C.rev, P.rev);
    if (q < P.cta - .2) return x(C.rev, C.prod, P.prod - .14);
    if (q < P.retour) return x(this.n ? C.prod : C.rev, C.cta, P.cta - .14);
    return C.cta;
  }
  encreA(q){ if (this.clair) return CLAIR.encre; const f = this.fondA(q), V = this.V; return V.lumRel(f) > .32 ? [12, 12, 12] : [252, 248, 240]; }
  accA(q){ return this.clair ? this.acc : this.encreA(q); }
  async construire(){
    const CL = this.clair, nomF = CL ? 'inter-400' : 'jost-500';
    const s = this.scene, K = this.K, V = this.V, font = await police3D(nomF);
    this.font = font; s.background = new THREE.Color();
    const C = this.couleursPhase(), AV = CL ? this.AL.vives : null;
    const mk = c => { const m = new THREE.MeshMatcapMaterial({ matcap:matcap(c) }); return m; };
    const ink = c => CL ? [44, 45, 40] : V.lumRel(c) > .32 ? [16, 16, 16] : [250, 246, 238];
    const op = { depth:CL ? .42 : .55, bevel:CL ? .024 : .035, bevelSize:CL ? .012 : .02, bevelSeg:2, seg:4 };
    /* en clair : la typo de l'interface aliments (sans serif serree, bas de casse) */
    const casse = t => CL ? V.phraseCas(t) : t;
    /* l'accroche : MA / PEAU, enorme */
    const lh = coupe3D(font, nomF, casse(this.tx.mien), 2.95, 3.2, 1.9, 2, .96, V);
    this.hook = bloc3D(font, nomF, lh, mk(ink(C.hook)), Object.assign({ lh:.96 }, op), V); s.add(this.hook.groupe);
    /* les chiffres (en clair : chacun dans la couleur d'un aliment) */
    this.nb = this.nombres().map((c, i) => { const l = coupe3D(font, nomF, c.v, 3.0, 2.2, 2.4, 1, 1, V); const b = bloc3D(font, nomF, l, mk(CL ? AV[i % AV.length] : i % 2 ? K.c2 : K.c1), op, V); s.add(b.groupe); b.c = c; return b; });
    this.passages = [1.05]; const nN = this.nb.length; this.nb.forEach((b, i) => this.passages.push(1.75 + i * (1.5 / Math.max(1, nN - 1 || 1)) * (nN > 1 ? 1 : 0)));
    if (nN === 1) this.passages[1] = 2.6;
    this.d.PX.passages = this.passages.slice();
    /* la phrase */
    const lp = CL ? coupe3D(font, nomF, this.tx.titre, 2.9, 2.3, 1.3, 3, .98, V) : coupe3D(font, 'jost-500', this.tx.gros, 2.9, 2.3, 1.45, 3, .98, V);
    this.phrase = bloc3D(font, nomF, lp, mk(CL ? this.acc : ink(C.rev)), Object.assign({ lh:.98 }, op), V); s.add(this.phrase.groupe);
    this.phrase.groupe.position.set(wx(CX), wy(960), 0);
    this.lay.constatY = 960 - this.phrase.haut / 2 * PXU - 64; this.lay.preuveY = Math.min(1340, Math.max(1290, 960 + this.phrase.haut / 2 * PXU + 95)); this.lay.autY = 330;
    /* et toi ? */
    const lc = coupe3D(font, nomF, casse(this.tx.etToi), 2.9, 1.2, 1.2, 1, 1, V);
    this.etToi = bloc3D(font, nomF, lc, mk(ink(C.cta)), op, V); this.etToi.groupe.position.set(wx(CX), wy(this.lay.ctaY - 30), 0); s.add(this.etToi.groupe);
    /* les numeros geants des soins (en clair : le numero prend la couleur de son aliment, en retrait derriere la photo) */
    this.nums = [];
    for (let k = 0; k < this.n; k++){ const l = coupe3D(font, nomF, '0' + (k + 1), 4.4, 3.2, 3.4, 1, 1, V); const b = bloc3D(font, nomF, l, mk(CL ? mel(AV[k % AV.length], [255, 255, 255], .18) : k % 2 ? K.c2 : K.c1), op, V); s.add(b.groupe); this.nums.push(b); }
    /* la vitesse : des eclats qui filent */
    const N = this.ap ? 250 : 600, rnd = alea(11), pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++){ const a = rnd() * 6.2832, r = 2 + rnd() * 5; pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.sin(a) * r * 1.6; pos[i * 3 + 2] = -rnd() * 60; }
    const gp = new THREE.BufferGeometry(); gp.setAttribute('position', new THREE.BufferAttribute(pos, 3)); this.pos0 = pos.slice();
    /* en clair : chaque lettre a sa matiere (pour s'effacer quand elle fonce vers nous : jamais un ecran rempli d'un coup) */
    if (CL) [this.hook, this.phrase, this.etToi].concat(this.nb).forEach(b => b.lettres.forEach(m => { m.material = m.material.clone(); }));
    this.eclats = new THREE.Points(gp, new THREE.PointsMaterial({ color:CL ? srgb([150, 152, 144]) : 0xffffff, size:(CL ? 2.4 : 3) * this.rw / 720, sizeAttenuation:false, transparent:true, opacity:.7 })); this.eclats.frustumCulled = false; s.add(this.eclats);
  }
  /* un objet qui fonce vers la camera et la traverse a l'instant qp */
  traverse(g, q, qp, avance, sx){ const dz = qp - q; const z = 12.6 - 34 * Math.sign(dz) * Math.pow(Math.abs(dz), 1.25); g.position.z = Math.min(13, z); g.visible = dz > -.05 && dz < avance; g.position.x = wx(CX) + (sx || 0) * (1 - Math.min(1, Math.max(0, dz)) ) ; }
  maj(q){
    const V = this.V, P = this.P, ph = q / 18 * 6.2832, f = this.fondA(q);
    this.scene.background.setRGB(f[0] / 255, f[1] / 255, f[2] / 255, THREE.SRGBColorSpace);
    /* l'accroche : posee, puis la camera la traverse ; elle revient pour la boucle */
    const hg = this.hook.groupe;
    if (q < (this.nb.length ? 1.6 : 3.3)){ hg.visible = true; hg.position.set(wx(CX), wy(900), 0); const t0 = this.nb.length ? .8 : 2.5, z = q < t0 ? .6 * q / t0 * .8 : .48 + 13 * V.eIn3(V.seg(q, t0, t0 + .32)); hg.position.z = Math.min(12.4, z); hg.rotation.set(0, .08 * Math.sin(ph), 0); hg.visible = z < 12.3; }
    else if (q >= P.retour){ const e = V.eOut3(V.seg(q, P.retour + .2, P.fin - .05)); hg.visible = true; hg.position.set(wx(CX), wy(900), -40 * (1 - e)); hg.rotation.set(0, .08 * Math.sin(ph), 0); }
    else hg.visible = false;
    this.hook.lettres.forEach((m, i) => { m.rotation.x = .04 * Math.sin(ph * 2 + i); });
    /* les chiffres traversent, un par un */
    this.nb.forEach((b, i) => { const qp = this.passages[i + 1]; b.groupe.position.y = wy(930); this.traverse(b.groupe, q, qp, 1.1, 0); b.groupe.rotation.z = .12 * (i % 2 ? 1 : -1) * Math.min(1, Math.max(0, qp - q)); });
    /* les eclats de vitesse (pendant la traversee) */
    const vit = V.seg(q, .8, 1.1) * (1 - V.seg(q, 3.55, 3.75)), pa = this.eclats.geometry.attributes.position.array;
    this.eclats.visible = vit > .01;
    if (this.eclats.visible){ for (let i = 0; i < pa.length; i += 3){ pa[i + 2] = ((this.pos0[i + 2] + q * 60) % 60 + 60) % 60 - 60 + 12; } this.eclats.geometry.attributes.position.needsUpdate = true; this.eclats.material.opacity = .7 * vit; }
    /* la phrase claque : les lettres arrivent de derriere la camera */
    const fin = this.n ? P.prod : P.cta, out = V.eIn3(V.seg(q, fin - .3, fin + .05));
    this.phrase.groupe.visible = q >= P.rev - .02 && q < fin + .1;
    const choc = q >= P.rev ? Math.max(0, 1 - (q - P.rev) / .5) : 0;
    this.phrase.groupe.position.x = wx(CX) + .05 * choc * Math.sin(q * 90); this.phrase.groupe.position.y = wy(960) + .04 * choc * Math.cos(q * 77);
    this.phrase.lettres.forEach((m, i) => { const e = V.eOut3(V.seg(q, P.rev + i * .018, P.rev + .32 + i * .018)), ud = m.userData; m.position.z = 14 * (1 - e) - 14 * out; m.position.x = ud.x * (1 + .8 * (1 - e)); m.position.y = ud.y; m.rotation.y = .05 * Math.sin(ph * 2 + i) + .6 * (1 - e); m.visible = m.position.z < 12.2; });
    this.phrase.groupe.rotation.y = .1 * Math.sin(ph);
    /* les soins : un numero geant derriere chacun */
    const heros = { x:wx(CX), y:wy(this.clair ? 1110 : 1100), z:1, h:1.42, dz:2.5, dy:0, ry:.0, halo:.0 };
    this.majProduits(q, heros);
    this.nums.forEach((b, k) => { const st = this.etatProduit(k, q), a = st.a * st.heros; b.groupe.scale.setScalar(Math.max(.001, st.a)); b.groupe.visible = a > .01 && q >= P.prod - .2 && q < P.cta; b.groupe.position.set(wx(CX), wy(860), -4 - 14 * (1 - V.eOut3(V.seg(q, st.s - .15, st.s + .3))) - 8 * V.eIn3(st.etagere)); b.groupe.scale.multiplyScalar(1 - st.etagere); b.groupe.rotation.y = .15 * Math.sin(ph * 2 + k); });
    /* et toi ? */
    const ac = V.eOutBack(V.seg(q, P.cta, P.cta + .45)), ao = V.eIn3(V.seg(q, P.retour - .1, P.retour + .3));
    this.etToi.groupe.visible = q >= P.cta && q < P.retour + .35;
    this.etToi.lettres.forEach((m, i) => { const e = V.eOut3(V.seg(q, P.cta + i * .03, P.cta + .35 + i * .03)); m.position.z = 10 * (1 - e) + 12 * ao; m.visible = m.position.z < 12.2; });
    this.etToi.groupe.scale.setScalar(Math.max(.001, ac));
    /* en clair : ce qui s'approche trop de la camera se dissout (au lieu de la traverser) ; moins de 3 variations fortes par seconde */
    if (this.clair) [this.hook, this.phrase, this.etToi].concat(this.nb).forEach(b => { const g = b.groupe, sc = g.scale.z, z0 = b === this.hook ? 1 : this.nb.indexOf(b) >= 0 ? 1.4 : 2.6, z1 = b === this.hook ? 3.6 : this.nb.indexOf(b) >= 0 ? 4.8 : 6;
      b.lettres.forEach(m => { const z = g.position.z + m.position.z * sc, o = 1 - V.seg(z, z0, z1); m.material.opacity = o; m.material.transparent = o < .999;
        if (b === this.hook || this.nb.indexOf(b) >= 0) m.visible = o > .01; else if (o <= .01) m.visible = false; }); });
  }
  dessine2D(q){
    if (this.clair) return this.dessine2DC(q);
    const x = this.R.x, V = this.V, P = this.P, f = this.fondA(q), ink = this.encreA(q); x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = V.rgba(f, 1); x.fillRect(0, 0, W, H);
    const big = (t, y, s, a) => { if (a <= 0) return; x.save(); x.globalAlpha = a; x.font = V.fontJ(260, 500); const k = Math.min(1, 900 / Math.max(1, x.measureText(t).width)); x.translate(CX, y); x.scale(s * k, s * k); x.textAlign = 'center'; x.fillStyle = V.rgba(ink, 1); x.fillText(t, 0, 90); x.restore(); };
    if (q < 1.2) big(this.tx.mien, 960, 1 + 6 * V.eIn3(V.seg(q, .8, 1.15)), 1 - V.seg(q, 1.05, 1.15));
    else if (q < P.rev) { const nb = this.nombres(); nb.forEach((c, i) => { const qp = 1.75 + i * .75, dz = qp - q; if (dz > -.05 && dz < 1) big(c.v, 960, 1 / Math.max(.15, dz * 1.5), 1); }); }
    else if (q < (this.n ? P.prod : P.cta)) big(this.tx.gros, 960, V.eOut3(V.seg(q, P.rev, P.rev + .3)) + .001, 1);
    else if (q >= P.retour) big(this.tx.mien, 960, V.eOut3(V.seg(q, P.retour, P.fin)), 1);
    this.produits2D(q, { x:0, y:wy(1110) });
  }
  surcouche(q){
    super.surcouche(q);
    /* le libelle de chaque chiffre traverse */
    const R = this.R, V = this.V, ink = this.encreA(q);
    (this.nb || []).forEach((b, i) => { const qp = this.passages[i + 1], a = V.seg(q, qp - .75, qp - .45) * (1 - V.seg(q, qp - .2, qp - .02)); if (a > 0) this.caps(b.c.label, CX, 1250, 36, this.clair ? CLAIR.gris : ink, a, { sp:.28, spC:.16 }); });
  }
  ctaC(q, ink, acc){
    const V = this.V, P = this.P, tx = this.tx;
    const a2 = V.eOut3(V.seg(q, P.cta + .3, P.cta + .7)) * (1 - V.seg(q, P.retour - .1, P.retour + .35));
    if (a2 <= 0) return;
    if (!this.gl) this.sans(V.phraseCas(tx.etToi), CX, 800, 150, ink, a2, { maxW:880 });
    const r = this.lignes(tx.cta[1], CX, 1040, 84, 90, ink, a2, { n:2, maxW:840 });
    this.caps(tx.site, CX, 1040 + (r.n - 1) * 90 * r.s / 84 + 110, 34, this.acc, a2, { spC:.24 });
  }
  cta(q, ink, acc){
    const R = this.R, V = this.V, P = this.P, tx = this.tx;
    const a2 = V.eOut3(V.seg(q, P.cta + .3, P.cta + .7)) * (1 - V.seg(q, P.retour - .1, P.retour + .35));
    if (a2 <= 0) return;
    if (!this.gl) R.capsL(tx.etToi, CX, 800, 150, ink, a2, { sp:.02, maxW:880, poids:500 });
    const m = V.maj(tx.cta[1]).split(' '), c = Math.ceil(m.length / 2);
    R.capsL(m.slice(0, c).join(' '), CX, 1030, 74, ink, a2, { sp:.04, maxW:860, poids:500 });
    R.capsL(m.slice(c).join(' '), CX, 1118, 74, ink, a2, { sp:.04, maxW:860, poids:500 });
    R.capsL(tx.site, CX, 1250, 40, ink, a2, { sp:.34 });
  }
}

const CLASSES = { X1, X2, X3, X4 };
export async function creer(R, d, o){
  const V = o.V;
  await V.policesL();
  if (d.type === 'aliment') await chargeInter();
  const C = CLASSES[d.style] || X1;
  const sc = new C(R, d, o);
  await sc.init();
  return sc;
}
window.__VYWX = { creer, REVISION:THREE.REVISION };
