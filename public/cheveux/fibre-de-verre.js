/* ==========================================================================
   FIBRE DE VERRE — le rendu de la propale 01, detache de sa planche pour
   tourner derriere le VRAI scan (camera reelle, moteur ICE, catalogue).
   Source : public/propals/cheveux/a.html, recopie telle quelle : on ne
   « reinterprete » pas une direction que Charles a validee.
   API : FIBRE.monter(canvas) · FIBRE.moment(m, p)   m = 0 questions,
         1 cadrage, 2 analyse, 3 resultats ; p = avancement 0..1
   ========================================================================== */
(function(){
'use strict';
const TAU = Math.PI * 2;
const clamp = (v,a,b) => v < a ? a : v > b ? b : v;
const lerp  = (a,b,t) => a + (b-a) * t;
const smooth= t => t*t*(3-2*t);
const eOut  = t => 1 - Math.pow(1-t, 3);
const eOut5 = t => 1 - Math.pow(1-t, 5);
const eIn   = t => t*t*t;
const eInOut= t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const sat   = t => clamp(t,0,1);
const seg   = (p,a,b) => sat((p-a)/(b-a));

const MOBILE = matchMedia('(max-width: 860px)').matches || (navigator.maxTouchPoints||0) > 1;

function hsh(n){ const s = Math.sin(n*127.1) * 43758.5453; return s - Math.floor(s); }
function nz(x){ const i = Math.floor(x), f = x - i; return lerp(hsh(i), hsh(i+1), smooth(f)); }
function fbm(x){ return nz(x)*.55 + nz(x*2.07+11.3)*.29 + nz(x*4.11+29.7)*.16; }

/* --- éclairage anisotrope du cheveu (Kajiya-Kay, deux lobes) --- */
function lightSetup(lx,ly,lz){
  const l = Math.hypot(lx,ly,lz)||1; const L=[lx/l,ly/l,lz/l];
  const hx=L[0], hy=L[1], hz=L[2]+1; const hn=Math.hypot(hx,hy,hz)||1;
  return { L, H:[hx/hn, hy/hn, hz/hn] };
}
/* renvoie [r,g,b] pour une tangente 2D (tx,ty) */
function hairShade(tx,ty,o,k){
  const H=o.lit.H, L=o.lit.L;
  const th = tx*H[0] + ty*H[1];
  const s1 = Math.pow(Math.max(0, 1-th*th), o.e1*.5);
  const sh = o.shift, n = Math.hypot(tx,ty,sh)||1;
  const th2 = (tx*H[0] + ty*H[1] + sh*H[2]) / n;
  const s2 = Math.pow(Math.max(0, 1-th2*th2), o.e2*.5);
  const tl = tx*L[0] + ty*L[1];
  const df = Math.sqrt(Math.max(0, 1-tl*tl));
  const b=o.base, c1=o.c1, c2=o.c2, kd=o.kd*k, k1=o.k1*k, k2=o.k2*k;
  return [
    clamp(b[0]*df*kd + c1[0]*s1*k1 + c2[0]*s2*k2, 0, 255),
    clamp(b[1]*df*kd + c1[1]*s1*k1 + c2[1]*s2*k2, 0, 255),
    clamp(b[2]*df*kd + c1[2]*s1*k1 + c2[2]*s2*k2, 0, 255)
  ];
}
/* trace une mèche : dégradé longitudinal calculé sur 5 échantillons */
function strandPath(ctx, pts){
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length-1;i++){
    const mx=(pts[i].x+pts[i+1].x)*.5, my=(pts[i].y+pts[i+1].y)*.5;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  ctx.lineTo(pts[pts.length-1].x, pts[pts.length-1].y);
}
function drawStrand(ctx, pts, o){
  const n = pts.length, a = pts[0], b = pts[n-1];
  const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
  const K = 5;
  for(let k=0;k<K;k++){
    const u = k/(K-1);
    const i = Math.min(n-2, Math.floor(u*(n-1)));
    let tx = pts[i+1].x-pts[i].x, ty = pts[i+1].y-pts[i].y;
    const l = Math.hypot(tx,ty)||1; tx/=l; ty/=l;
    let fall = o.fall ? lerp(o.fall[0], o.fall[1], u) : 1;
    if(o.shine){ const d=(u-o.shine[0])/o.shine[1]; fall *= 1 + o.shine[2]*Math.exp(-d*d); }
    const c = hairShade(tx, ty, o, fall);
    g.addColorStop(u, 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+(o.a*(o.aFall?lerp(1,o.aFall,u):1)).toFixed(3)+')');
  }
  ctx.strokeStyle = g; ctx.lineWidth = o.w; ctx.lineCap = 'round';
  strandPath(ctx, pts); ctx.stroke();
}

/* --- grain argentique --- */
let GRAIN = null;
function grainTile(){
  if(GRAIN) return GRAIN;
  const s = 180, c = document.createElement('canvas'); c.width=c.height=s;
  const x = c.getContext('2d'), d = x.createImageData(s,s);
  for(let i=0;i<s*s;i++){
    const v = 118 + (Math.random()-.5)*150;
    d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=v; d.data[i*4+3]=255;
  }
  x.putImageData(d,0,0); GRAIN=c; return c;
}
function grain(ctx,w,h,amt,mode){
  const t = grainTile();
  ctx.save();
  ctx.globalCompositeOperation = mode || 'overlay';
  ctx.globalAlpha = amt;
  const p = ctx.createPattern(t,'repeat');
  ctx.translate((Math.random()*180)|0, (Math.random()*180)|0);
  ctx.fillStyle = p; ctx.fillRect(-180,-180,w+360,h+360);
  ctx.restore();
}
function vignette(ctx,w,h,inner,outer,col){
  const g = ctx.createRadialGradient(w*.5,h*.5,Math.min(w,h)*inner,w*.5,h*.5,Math.max(w,h)*outer);
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,col);
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}
function glow(ctx,x,y,r,col,a){
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,col.replace('%A%',a)); g.addColorStop(.45,col.replace('%A%',a*.34));
  g.addColorStop(1,col.replace('%A%',0));
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,TAU); ctx.fill();
}
/* silhouette de tête + chevelure, vue de dessus/face, tracé vectoriel */
function headPath(ctx,cx,cy,r,turn){
  const sq = 1 - Math.abs(turn)*.34;
  ctx.beginPath();
  ctx.ellipse(cx + turn*r*.12, cy, r*.62*sq, r*.80, 0, 0, TAU);
}

function offc(S,key,w,h){
  S._o = S._o || {}; let o = S._o[key];
  if(!o){ o = {cv:document.createElement('canvas')}; o.ctx = o.cv.getContext('2d'); S._o[key]=o; }
  w = Math.max(1, w|0); h = Math.max(1, h|0);
  if(o.cv.width!==w || o.cv.height!==h){ o.cv.width=w; o.cv.height=h; }
  o.ctx.setTransform(1,0,0,1,0,0); o.ctx.clearRect(0,0,w,h); return o;
}
function offcKeep(S,key,w,h){
  S._o = S._o || {}; let o = S._o[key];
  w = Math.max(1,w|0); h = Math.max(1,h|0);
  if(!o){ o = {cv:document.createElement('canvas')}; o.ctx = o.cv.getContext('2d'); S._o[key]=o; o.fresh=true; }
  else if(o.cv.width!==w || o.cv.height!==h){ o.cv.width=w; o.cv.height=h; o.fresh=true; }
  else o.fresh=false;
  return o;
}
function brackets(ctx,x,y,w,h,L,col,lw,a){
  ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.globalAlpha=a; ctx.beginPath();
  ctx.moveTo(x,y+L); ctx.lineTo(x,y); ctx.lineTo(x+L,y);
  ctx.moveTo(x+w-L,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w,y+L);
  ctx.moveTo(x+w,y+h-L); ctx.lineTo(x+w,y+h); ctx.lineTo(x+w-L,y+h);
  ctx.moveTo(x+L,y+h); ctx.lineTo(x,y+h); ctx.lineTo(x,y+h-L);
  ctx.stroke(); ctx.restore();
}
function padX(w){ return clamp(w*.06, 24, 110); }

function makeHair(S, mode){
  const N  = mode==='thumb' ? 88 : (MOBILE ? 110 : 250);
  const CL = mode==='thumb' ? 9  : 15;
  const cl = [];
  for(let i=0;i<CL;i++) cl.push({ a:(i+.5)/CL*2-1 + (Math.random()-.5)*.05,
    w:.55+Math.random()*.8, ph:Math.random()*TAU, fr:.6+Math.random()*.8 });
  S.h=[];
  for(let i=0;i<N;i++){
    const c = cl[(Math.random()*CL)|0];
    const a = clamp(c.a + (Math.random()*2-1)*.085*c.w, -1, 1);
    S.h.push({ a, c, z:Math.random(),
      len:.84 + Math.random()*.30 - a*a*.12,
      w:.32 + Math.pow(Math.random(),2.1)*2.0,
      seed:Math.random()*130, ph:Math.random()*TAU,
      fr:.55+Math.random()*1.0, amp:.35+Math.random()*1.25,
      curl:(Math.random()*2-1), fly:Math.random()<.07 });
  }
  S.seg = mode==='thumb' ? 13 : 20;
  S._pt = new Array(S.seg+1);
}
function hairPts(s, t, C, out){
  const N=C.seg, dome=Math.sqrt(Math.max(0,1-s.a*s.a));
  const tx = C.cx + s.a*C.R*.50, ty = C.cy - dome*C.R*.42;
  const L = C.L*s.len;
  for(let j=0;j<=N;j++){
    const u=j/N, sp=.26+.74*Math.pow(u,.5);
    const sway=Math.sin(t*C.sp*s.fr + s.ph + s.c.ph + u*2.1)*C.sway*s.amp*(u*u*.85+.10);
    const wob=(fbm(s.seed+u*2.4+t*C.dr)-.5)*C.nz*(.16+u);
    out[j]={ x: tx + s.a*C.R*.66*sp + sway + wob + s.curl*u*u*C.curl,
             y: ty + L*u };
  }
  return out;
}
function drawHair(S, ctx, w, h, C, O, mode, each){
  /* volume sourd derrière les mèches */
  if(O.body){
    ctx.save();
    const g=ctx.createRadialGradient(C.cx, C.cy+C.L*.40, 0, C.cx, C.cy+C.L*.40, C.R*1.5);
    g.addColorStop(0, O.body[0]); g.addColorStop(.62, O.body[1]); g.addColorStop(1, O.body[2]);
    ctx.fillStyle=g;
    ctx.save(); ctx.translate(C.cx, C.cy+C.L*.40); ctx.scale(1, C.L*.60/(C.R*1.5));
    ctx.translate(-C.cx, -(C.cy+C.L*.40));
    ctx.beginPath(); ctx.arc(C.cx, C.cy+C.L*.40, C.R*1.5, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  const bo = offc(S,'body', Math.round(w*.5), Math.round(h*.5));
  const bx = bo.ctx; bx.scale(.5,.5); bx.lineCap='round';
  const P = S._pt;
  for(let i=0;i<S.h.length;i++){
    const s=S.h[i];
    hairPts(s,C.t,C,P);
    const crisp = s.fly || s.z>.66;
    const o = Object.assign({}, O.st);
    const zz = s.z;
    o.w = s.w*(.5+zz*1.2)*C.wk*(crisp?1:1.5);
    o.a = O.st.a*(.16+.9*zz)*(crisp?1:.85);
    o.kd = O.st.kd*(.5+.75*zz); o.k1 = O.st.k1*(.30+1.05*zz); o.k2 = O.st.k2*(.3+.9*zz);
    if(each) each(s,o,P);
    drawStrand(crisp?ctx:bx, P, o);
  }
  bx.setTransform(1,0,0,1,0,0);
  ctx.save();
  ctx.globalCompositeOperation = O.add ? 'lighter' : 'source-over';
  ctx.globalAlpha = O.bodyA==null ? .95 : O.bodyA;
  ctx.filter = 'blur(' + (mode==='thumb'?2.5:5) + 'px)';
  ctx.drawImage(bo.cv, 0, 0, w, h);
  ctx.filter='none'; ctx.restore();
}

const W1 = {
  init(S, mode){ makeHair(S,mode); S.pulse=[]; S.lit=lightSetup(-.52,-.74,.42); },
  cfg(w,h,m,TH){
    if(m===0) return {cx:TH?w*.5:w*.68, cy:h*.06, R:TH?w*.26:w*.20, L:h*1.12};
    if(m===1) return {cx:TH?w*.5:w*.46, cy:h*.10, R:Math.min(TH?w*.30:w*.26,h*.40), L:h*1.02};
    return {cx:TH?w*.5:w*.78, cy:-h*.04, R:TH?w*.26:w*.20, L:h*1.25};
  },
  draw(S, ctx, w, h, m, p, t, mode){
    ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
    if(m===2){ this.tunnel(S,ctx,w,h,p,t); grain(ctx,w,h,.05,'overlay'); return; }
    const c = this.cfg(w,h,m,mode==='thumb');
    const C = { cx:c.cx, cy:c.cy, R:c.R, L:c.L, seg:S.seg, t,
                sway:w*.020, sp:.00015, dr:.000035, nz:w*.035, curl:w*.035,
                wk: m===3?.85:1 };
    const dim = m===3 ? .42 : 1;
    const O = { st:{ lit:S.lit, base:[22,40,58], c1:[210,244,255], c2:[46,120,170],
                     e1:110, e2:24, shift:.30, kd:1, k1:1.15, k2:.6, a:.92*dim,
                     fall:[1,.58], shine:[.34,.19,1.5] },
                body:['rgba(16,34,52,'+(.50*dim)+')','rgba(8,18,30,'+(.30*dim)+')','rgba(0,0,0,0)'],
                bodyA:.95*dim, add:false };
    drawHair(S,ctx,w,h,C,O,mode);

    /* impulsions dans la fibre */
    const rate = m===1 ? .85 : .30;
    if(Math.random()<rate){
      for(let k=0;k<(m===1?3:1);k++) S.pulse.push({i:(Math.random()*S.h.length)|0, u:-.08, v:.008+Math.random()*.010});
    }
    ctx.save(); ctx.globalCompositeOperation='lighter';
    const P=new Array(S.seg+1);
    for(let k=S.pulse.length-1;k>=0;k--){
      const q=S.pulse[k]; q.u+=q.v; if(q.u>1.2){ S.pulse.splice(k,1); continue; }
      const s=S.h[q.i]; if(!s) continue;
      hairPts(s,t,C,P);
      const n=P.length-1, a0=clamp(q.u-.16,0,1), a1=clamp(q.u,0,1); if(a1<=a0) continue;
      const i0=Math.floor(a0*n), i1=Math.min(n, Math.ceil(a1*n));
      const A=P[i0], B=P[i1];
      const fade=(.45+.55*s.z)*dim*(1-seg(q.u,.85,1.2));
      const g=ctx.createLinearGradient(A.x,A.y,B.x,B.y);
      g.addColorStop(0,'rgba(110,200,255,0)');
      g.addColorStop(.7,'rgba(170,232,255,'+(.42*fade).toFixed(3)+')');
      g.addColorStop(1,'rgba(248,254,255,'+(.92*fade).toFixed(3)+')');
      ctx.strokeStyle=g; ctx.lineWidth=s.w*(.5+s.z)+.45; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(A.x,A.y);
      for(let j=i0+1;j<=i1;j++) ctx.lineTo(P[j].x,P[j].y);
      ctx.stroke();
      if(s.z>.7 && mode!=='thumb') glow(ctx,B.x,B.y,20,'rgba(150,222,255,%A%)',.13*fade);
    }
    ctx.restore();

    if(m===1) this.cadre(S,ctx,w,h,p,C,mode);
    if(m===3) this.signals(S,ctx,w,h,p);
    vignette(ctx,w,h,.20,.70,'rgba(0,0,0,.92)');
    grain(ctx,w,h, mode==='thumb'?.035:.052,'overlay');
  },
  cadre(S,ctx,w,h,p,C,mode){
    const bw=Math.min(w*.52,h*.86), bh=h*.74, bx=C.cx-bw*.5, by=h*.09;
    brackets(ctx,bx,by,bw,bh,Math.min(34,bw*.09),'#7fd8ff',1,.45);
    const sw=(p*3.15)%1, y=by+bh*sw;
    ctx.save(); ctx.globalCompositeOperation='lighter';
    const g=ctx.createLinearGradient(0,y-46,0,y+2);
    g.addColorStop(0,'rgba(127,216,255,0)'); g.addColorStop(.75,'rgba(150,226,255,.10)');
    g.addColorStop(1,'rgba(214,246,255,.30)');
    ctx.fillStyle=g; ctx.fillRect(bx,y-46,bw,48);
    ctx.strokeStyle='rgba(226,249,255,.55)'; ctx.lineWidth=.8;
    ctx.beginPath(); ctx.moveTo(bx,y); ctx.lineTo(bx+bw,y); ctx.stroke();
    ctx.restore();
    if(mode!=='thumb'){
      ctx.save(); ctx.globalAlpha=.42; ctx.fillStyle='#7fd8ff';
      ctx.font='400 10px "IBM Plex Mono", monospace';
      ctx.fillText('MASSE — 100 %', bx, by-10);
      ctx.textAlign='right'; ctx.fillText('VISAGE — IGNORÉ', bx+bw, by-10);
      ctx.restore();
    }
  },
  signals(S,ctx,w,h,p){
    const px=padX(w), gw=(w-px*2)/4;
    /* dans le vrai scan : chaque trait monte dans la colonne de SON produit */
    const COL = window.FIBRE_COLONNES ? window.FIBRE_COLONNES() : null;
    ctx.save(); ctx.globalCompositeOperation='lighter';
    for(let i=0;i<4;i++){
      let x=px+gw*i+gw*.5, top=h*.30, bot=h*.96;
      if(COL && COL[i]){ x=COL[i].x; top=COL[i].top; bot=COL[i].bot; }
      const on=seg(p,.06+i*.055,.40+i*.055);
      ctx.strokeStyle='rgba(127,216,255,.08)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x,bot); ctx.lineTo(x,top); ctx.stroke();
      const y=lerp(bot,top,eOut(on));
      const g=ctx.createLinearGradient(0,y,0,y+130);
      g.addColorStop(0,'rgba(214,246,255,'+(.5*(1-on*.45)).toFixed(3)+')');
      g.addColorStop(1,'rgba(127,216,255,0)');
      ctx.strokeStyle=g; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+130); ctx.stroke();
      if(on>0&&on<1) glow(ctx,x,y,26,'rgba(160,228,255,%A%)',.20);
    }
    ctx.restore();
  },
  tunnel(S,ctx,w,h,p,t){
    const cx=w*.5, cy=h*.5, R=Math.hypot(w,h)*.62;
    ctx.save(); ctx.globalCompositeOperation='lighter';
    const N=MOBILE?70:150;
    for(let i=0;i<N;i++){
      const j=hsh(i*3.3), a=(i/N)*TAU + j*.05;
      const r0=R*(.14+j*.95);
      const u=((t*.00042*(.6+j*.9)+j+p*1.4)%1);
      const rr=lerp(r0,R*.04,eIn(u)), rr2=lerp(r0,R*.04,eIn(clamp(u+.10,0,1)));
      const x1=cx+Math.cos(a)*rr, y1=cy+Math.sin(a)*rr*.88;
      const x2=cx+Math.cos(a)*rr2, y2=cy+Math.sin(a)*rr2*.88;
      const g=ctx.createLinearGradient(x1,y1,x2,y2);
      const al=(1-u)*.8*(.25+j*.75);
      g.addColorStop(0,'rgba(80,170,230,0)');
      g.addColorStop(1,'rgba(234,252,255,'+al.toFixed(3)+')');
      ctx.strokeStyle=g; ctx.lineWidth=.45+j*1.7;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
    const core=.10+eIn(p)*.9;
    glow(ctx,cx,cy,R*(.05+core*.22),'rgba(150,224,255,%A%)',.30+core*.45);
    glow(ctx,cx,cy,R*(.02+core*.07),'rgba(255,255,255,%A%)',.30+core*.5);
    ctx.restore();
    if(p>.90){ ctx.fillStyle='rgba(255,255,255,'+(seg(p,.90,.965)*.8*(1-seg(p,.965,1))).toFixed(3)+')'; ctx.fillRect(0,0,w,h); }
    vignette(ctx,w,h,.12,.66,'rgba(0,0,0,.94)');
  }
};

var S = {}, cv = null, ctx = null, M = 0, P = 0, T0 = performance.now(), actif = false, pret = false;
function taille(){
  if(!cv) return;
  var r = Math.min(window.devicePixelRatio || 1, 2);
  var W = cv.clientWidth || innerWidth, H = cv.clientHeight || innerHeight;
  if(cv.width !== Math.round(W*r) || cv.height !== Math.round(H*r)){
    cv.width = Math.round(W*r); cv.height = Math.round(H*r);
  }
  ctx.setTransform(r,0,0,r,0,0);
  return { W:W, H:H };
}
function image(now){
  if(!actif) return;
  requestAnimationFrame(image);
  var d = taille(); if(!d) return;
  try { W1.draw(S, ctx, d.W, d.H, M, P, now - T0, 'full'); } catch(e){ window.__fibreErreur = e.message; }
}
window.FIBRE = {
  monter: function(canvas){
    cv = canvas; ctx = cv.getContext('2d');
    if(!pret){ W1.init(S, 'full'); pret = true; }
    actif = true; requestAnimationFrame(image);
  },
  moment: function(m, p){ M = m; P = (p == null ? P : p); },
  arreter: function(){ actif = false; }
};
})();
