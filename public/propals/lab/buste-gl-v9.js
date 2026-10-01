/* Buste en points (WebGL), variante B choisie par Charles le 01/10.
   API : window.Buste = { init(canvas), dessine(lm, t, opts), etat }
     lm   : { points: 478 x {x,y,z} (normalises), w, h } | tableau de points | null (visage par defaut)
     t    : temps en secondes
     opts : { genre: 'f' | 'h' | null, cheveux: { masque: Float32Array, mw, mh } | null, zoom: 0..1 }  (facultatif)
            genre 'h' = mannequin masculin, 'f' = silhouette feminine de couture, null = entre-deux ; absent = 'h'.
            cheveux = masque de confiance du segmenteur (categorie 1), coordonnees de l'image camera, non miroir,
                      les memes que les landmarks ; absent/null = crane nu.
            zoom 0 = buste entier, 1 = gros plan sur le visage (~70 % de la hauteur).
            photo = { image: HTMLVideoElement | HTMLCanvasElement, miroir: false } : la vraie image de la camera, projetee
                    sur l'avant du visage ; sa luminosite module la taille et l'opacite des points (sourcils, yeux, bouche,
                    barbe se lisent). miroir: true seulement si cette image est retournee par rapport a celle qui a servi
                    aux landmarks. A passer a chaque image ; sans photo, rendu sculpte seul.
            revele 0..1 : la forme se construit point par point, du haut du crane au bas du torse (front irregulier,
                    chaque point nait en ~0,6 s si revele va de 0 a 1 en 7 s) ; les grappes du bas arrivent a la fin ; absent = 1.
            tourne 0 = mouvement lent habituel, 1 = la tete (et un peu le buste) pivote +-28 degres, aller-retour ~6 s.
            Tout est lisse dans le temps (genre, cheveux, zoom, tourne) : on peut passer des valeurs en marches. */
(function(){

/* ------------------------------------------------------------------ */
/*  GLSL commun (SDF du mannequin)                                     */
/* ------------------------------------------------------------------ */
const COMMUN = `
uniform vec2  uRes;
uniform vec2  uPP;
uniform float uT;
uniform vec3  uCam;
uniform mat3  uCamM;
uniform float uFocal;
uniform mat3  uBody;
uniform mat3  uHead;
uniform vec3  uHeadPos;
uniform sampler2D uFace;
uniform float uS;
uniform float uCut;
uniform float uDbg;
uniform float uDot;
uniform mat3 uScan;
uniform float uWave;
uniform float uFem;
uniform float uZoom;
uniform sampler2D uPhoto;  /* r = sombre (egalise sur le visage), g = poids (dans l'ovale), b = pilosite (barbe, moustache) */
uniform float uPhotoA;
uniform float uPhotoM;
uniform float uRevele;  /* 0 = rien, 1 = tout : chaque point nait a son seuil (hauteur + bruit) */   /* ton moyen du visage, pour raccorder le reste de la tete */
uniform mat3 uHeadY;   /* rotation de la tete autour de la verticale seulement (pour la longueur des cheveux) */
uniform float uHeadS;
uniform vec4 uHairA;   /* quantite, volume dessus, largeur cotes, frange */
uniform vec4 uHairB;   /* longueur sous le centre de la tete (m), balancement */

float sdE(vec3 p, vec3 r){ float k0=length(p/r); float k1=length(p/(r*r)); return k0*(k0-1.0)/max(k1,1e-6); }
float sdC(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
float smin(float a, float b, float k){ float h=max(k-abs(a-b),0.)/k; return min(a,b)-h*h*k*0.25; }
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }

/* tete etoilee : rayon lu dans une carte equirectangulaire (visage reel devant, crane de base derriere) */
float sHead(vec3 q){
  vec3 v = q - vec3(0.,-0.012,-0.039);
  float r = length(v); vec3 dn = v/max(r,1e-5);
  vec2 uv = vec2(atan(dn.x, dn.z)/6.2831853+0.5, asin(clamp(dn.y,-1.,1.))/3.1415927+0.5);
  float R = textureLod(uFace, uv, 0.).r;
  return (r - R)*0.5;
}
float cutY(vec3 p){
  return uCut - 0.22*p.x + 0.045*(vnoise(p.xz*vec2(16.,22.)+vec2(0.,uT*0.12))-0.5) + 0.012*sin(p.x*31.+uT*0.5);
}
float fbm2(vec2 p){ return 0.6*vnoise(p) + 0.3*vnoise(p*2.03+7.1) + 0.1*vnoise(p*4.1+3.3); }
/* bras : partage entre le corps et le masque de coupure */
float sArm(vec3 m){
  float F = uFem;
  return sdC(m, vec3(mix(0.245,0.198,F),1.37,-0.016), vec3(mix(0.28,0.228,F),0.55,-0.06), mix(0.056,0.04,F));
}
float sBody(vec3 p){
  float F = uFem, M = 1.-F;
  vec3 m = vec3(abs(p.x), p.y, p.z);
  float br = 1.0 + 0.006*sin(uT*1.25);
  float chest = sdE(p-vec3(0.,1.262,-0.025), mix(vec3(0.19,0.2,0.112), vec3(0.152,0.198,0.1), F)*br);
  /* pectoraux (h) / poitrine en volumes doux, sans detail (f) */
  float pecH  = sdE(m-vec3(0.086,1.322,0.05), vec3(0.096,0.066,0.052)*br);
  float pecF  = sdE(m-vec3(0.072,1.285,0.04), vec3(0.064,0.06,0.05)*br);
  float ab    = sdE(p-vec3(0.,1.08,-0.012), mix(vec3(0.16,0.19,0.102), vec3(0.126,0.19,0.093), F));
  float d = smin(chest, mix(pecH, pecF, F), mix(0.045,0.09,F));
  d = smin(d, ab, 0.06);
  /* sillon sternal et ligne blanche (h seulement) */
  d += M*0.0035*exp(-p.x*p.x/0.0001)*smoothstep(1.44,1.36,p.y);
  /* abdominaux / dentele (h seulement) */
  float abm = smoothstep(1.27,1.22,p.y)*(1.-smoothstep(0.08,0.12,abs(p.x)));
  d -= M*0.006*abm*(0.5+0.5*cos((p.y-1.24)*6.2832/0.055))*(0.5+0.5*sin(abs(p.x)*6.2832/0.13+0.6));
  /* bord inferieur des pectoraux, marque (h seulement) */
  d += M*0.005*exp(-pow((p.y-1.258+0.03*abs(p.x))/0.01,2.))*(1.-smoothstep(0.03,0.18,abs(p.x)));
  /* fibres : relief qui fait onduler les rangees (tres adouci en f) */
  float fr = smoothstep(-0.02,0.06,p.z)*(1.-smoothstep(1.43,1.47,p.y));
  d -= fr*mix(0.016,0.005,F)*(fbm2(vec2(p.x*19., p.y*23.) + vec2(uT*0.03, 0.)) - 0.45);
  float clav = sdC(m, vec3(0.028,1.452,0.052), vec3(mix(0.175,0.15,F),mix(1.465,1.455,F),0.0), mix(0.013,0.0075,F));
  d = smin(d, clav, mix(0.03,0.022,F));
  float trap = sdC(m, vec3(0.03,1.475,-0.045), vec3(mix(0.205,0.165,F),mix(1.435,1.42,F),-0.03), mix(0.034,0.024,F));
  d = smin(d, trap, 0.06);
  float del = sdE(m-vec3(mix(0.232,0.192,F),mix(1.384,1.39,F),-0.004), mix(vec3(0.072,0.09,0.076), vec3(0.05,0.064,0.054), F));
  d = smin(d, del, 0.05);
  float arm = sArm(m);
  d = smin(d, arm, 0.02);
  float scm = sdC(m, vec3(0.016,1.455,0.045), vec3(mix(0.046,0.034,F),mix(1.6,1.63,F),0.008), mix(0.017,0.009,F));
  float nr = mix(0.06, 0.044, F);
  float neck = sdC(p, vec3(0.,1.42,-0.02), vec3(0.,mix(1.6,1.635,F),0.0), nr - nr*clamp((p.y-1.45)/0.4,0.,1.)*0.2);
  neck = smin(neck, scm, 0.02);
  d = smin(d, neck, mix(0.04,0.05,F));
  /* dissolution du bas : seulement le tronc, pas le bras proche */
  float mt = p.x < 0. ? smoothstep(0.0, 0.006, arm) : 1.;
  d = max(d, mix(-1., cutY(p)-p.y, mt));
  return d;
}
/* cheveux : calotte (repere de la tete) + longueur qui tombe (repere du corps), d'apres le masque */
float smax(float a, float b, float k){ return -smin(-a, -b, k); }
float sHairCap(vec3 q){
  float A = uHairA.x;
  float top = uHairA.y*A, side = uHairA.z*A, fr = uHairA.w*A, L = uHairB.x*A;
  vec3 c = vec3(0., 0.014 + top*0.45, -0.034);
  vec3 r = vec3(0.081 + side, 0.1 + top*0.55, 0.1 + side*0.3)*mix(0.86, 1.0, A);
  float cap = sdE(q - c, r);
  /* meches : sur le dessus elles vont d'avant en arriere, sur les cotes elles descendent */
  float dessus = smoothstep(0.02, 0.07, q.y);
  cap += 0.0012*mix(sin(q.z*170. + q.y*40.), sin(q.x*170.), dessus);
  float hl = mix(0.066, 0.018, fr);                        /* ligne du front (frange : plus bas) */
  float zb = mix(0.006, -0.01, clamp(1.-side*6.,0.,1.));   /* devant les oreilles */
  float ybot = mix(-0.02, -0.1, clamp(L/0.12, 0., 1.));    /* bas de la calotte */
  float d = smax(cap, min(hl + 5.*q.x*q.x - q.y, q.z - zb + 0.3*(q.y - 0.02)), 0.012);
  return smax(d, ybot - q.y, 0.02);
}
float sHairLong(vec3 hp){
  float A = uHairA.x, L = uHairB.x*A, side = uHairA.z*A;
  if(L < 0.03) return 1.;
  float tY = clamp(-hp.y/max(L,0.01), 0., 1.);
  float sw = uHairB.y*sin(uT*0.7 + hp.y*6.)*0.004*tY;      /* leger balancement */
  vec3 h = transpose(uHeadY)*hp - vec3(sw, 0., 0.);
  /* colonne elliptique qui prolonge la calotte vers le bas, evidee devant (visage, cou) : la chevelure tombe en U */
  float rx = 0.088 + side*0.8 + 0.028*tY, rz = 0.088 + 0.012*tY, cz = -0.062;
  float e = (length(vec2(h.x/rx, (h.z - cz)/rz)) - 1.)*min(rx, rz);
  float bas = -L*(1. - 0.1*vnoise(vec2(h.x*55., 3.1)));     /* pointes de longueurs inegales */
  float col = smax(smax(e, bas - h.y, 0.02), h.y - 0.0, 0.03);
  float creux = smax(abs(h.x) - (0.062 + 0.012*tY), -(h.z + 0.085 - 0.02*tY), 0.02);
  col = smax(col, -creux, 0.018);
  /* meches qui passent devant les epaules (cheveux longs) */
  float lf = smoothstep(0.2, 0.32, L);
  vec3 hm = vec3(abs(h.x), h.y, h.z);
  float front = sdC(hm, vec3(0.078+side*0.7, -0.06, -0.05), vec3(0.096+side*0.7, -L*0.92, -0.015), 0.018 + 0.004*tY);
  col = mix(col, smin(col, front, 0.035), lf);
  col += 0.0016*sin(h.x*230. + h.z*120. + sin(h.y*30.)*2.5);  /* meches */
  return col;
}
float sHair(vec3 p){
  if(uHairA.x < 0.02) return 1.;
  vec3 hp = p - uHeadPos;
  /* boite englobante : on ne calcule les cheveux que pres de la tete (gros gain sur le torse) */
  float Lb = uHairB.x*uHairA.x;
  vec3 bq = abs(hp - vec3(0., (0.17 - Lb - 0.06)*0.5, -0.03)) - vec3(0.2, (0.17 + Lb + 0.06)*0.5, 0.19);
  float bb = length(max(bq,0.)) + min(max(bq.x,max(bq.y,bq.z)),0.);
  if(bb > 0.02) return bb;
  float cap = sHairCap(transpose(uHead)*hp/uHeadS)*uHeadS;
  float lng = sHairLong(hp);
  float d = min(cap, lng);
  return max(d, cutY(p) - p.y);
}
float mapBH(vec3 p){
  float b = sBody(p);
  vec3 hp = p - uHeadPos;
  float hb = length(hp) - 0.175;
  float h = hb > 0.04 ? hb : sHead(transpose(uHead)*hp/uHeadS)*uHeadS;
  return smin(b, h, 0.016);
}
float mapS(vec3 p){ return min(mapBH(p), sHair(p)); }
vec2 proj(vec3 w){
  vec3 c = transpose(uCamM)*(w-uCam);
  return uRes*0.5 + uPP + c.xy*uFocal/c.z;
}
`;

const VS_PLEIN = `#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos,0.,1.); }`;

const FS_BUSTE = `#version 300 es
precision highp float;
${COMMUN}
out vec4 o;

vec3 nrm(vec3 p){
  const vec2 k = vec2(1.,-1.); float e = 0.0007;
  return normalize(k.xyy*mapS(p+k.xyy*e) + k.yyx*mapS(p+k.yyx*e) + k.yxy*mapS(p+k.yxy*e) + k.xxx*mapS(p+k.xxx*e));
}
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc/uRes;
  /* fond aqua (mesure sur la reference) */
  vec3 bg = mix(vec3(0.553,0.784,0.824), vec3(0.557,0.796,0.812), smoothstep(0.,1.,uv.y));
  vec2 dq = (uv-vec2(0.30,0.62))*vec2(uRes.x/uRes.y,1.);
  bg = mix(bg, vec3(0.675,0.824,0.866), 0.85*exp(-dot(dq,dq)/0.06));
  vec2 dq2 = (uv-vec2(0.62,0.12))*vec2(uRes.x/uRes.y,1.);
  bg = mix(bg, vec3(0.62,0.80,0.82), 0.5*exp(-dot(dq2,dq2)/0.05));
  vec3 col = bg;

  vec3 rdw = normalize(uCamM*vec3((fc-uRes*0.5-uPP)/uFocal, 1.));
  vec3 ro = transpose(uBody)*uCam;
  vec3 rd = transpose(uBody)*rdw;
  vec3 bmin = vec3(-0.38,0.55,-0.26), bmax = vec3(0.38,1.95,0.3);
  vec3 t0 = (bmin-ro)/rd, t1 = (bmax-ro)/rd;
  vec3 tmn = min(t0,t1), tmx = max(t0,t1);
  float tn = max(max(tmn.x,tmn.y),tmn.z), tf = min(min(tmx.x,tmx.y),tmx.z);
  if(tf > max(tn,0.)){
    float t = max(tn,0.); bool hit=false; vec3 p;
    for(int i=0;i<130;i++){
      p = ro+rd*t; float d = mapS(p);
      if(d < 0.00025*t){ hit=true; break; }
      t += d*0.85;
      if(t>tf) break;
    }
    if(hit){
      vec3 n = nrm(p);
      vec3 nw = uBody*n;
      vec3 L = normalize(mix(vec3(-0.75,0.6,0.22), vec3(-0.5,0.5,0.7), uZoom));   /* en gros plan, un peu plus de face : le visage garde son modele */
      float lam = max(dot(nw,L),0.);
      float fac = clamp(dot(nw,-rdw),0.,1.);
      float fres = 1.-fac;
      float ao = clamp(mapS(p+n*0.016)/0.008, 0., 1.);
      float dark = clamp(1.1 - 1.3*lam + 0.45*fres*fres + 1.2*(1.-ao), 0., 1.);
      float band = clamp((p.y-cutY(p))/0.055, 0., 1.);
      float mt = p.x > 0. ? 1. : smoothstep(0.0, 0.006, sArm(vec3(abs(p.x),p.y,p.z)));
      /* matiere cheveux : points etires en traits verticaux (on lit des meches) */
      float isH = (uHairA.x > 0.02 && sHair(p) <= mapBH(p) + 0.0005) ? 1. : 0.;
      /* photo projetee sur l'avant du visage : la trame suit les sombres et les clairs de la vraie personne */
      float wP = 0., pil = 0.;
      if(uPhotoA > 0.01 && isH < 0.5){
        vec3 hp = p - uHeadPos;
        if(dot(hp,hp) < 0.045){
          vec3 f = transpose(uHead)*hp/uHeadS - vec3(0.,-0.012,-0.004);
          vec2 uvp = vec2((f.x+0.085)/0.17, (f.y+0.14)/0.24);
          if(f.z > -0.03 && uvp.x > 0. && uvp.y > 0. && uvp.x < 1. && uvp.y < 1.){
            vec3 ph = textureLod(uPhoto, uvp, 0.).rgb;
            wP = ph.y*uPhotoA*smoothstep(-0.03, 0.015, f.z);
            /* la photo module l'ombrage du relief autour du ton moyen du visage : au bord de l'ovale (poids -> 0)
               on retombe exactement sur le rendu par le relief, sans liseré clair */
            float dev = ph.x - uPhotoM;
            dark = clamp(dark + wP*(dev > 0. ? 1.25*dev : 0.4*dev), 0., 1.);   /* fonce franchement, eclaircit peu : pas de blanc */
            /* pilosite : barbe et moustache en points plus denses, plus gros, plus fonces */
            pil = ph.z*wP;
            dark = mix(dark, 1., pil*0.85);
          }
        }
      }
      band = mix(1., band, mt);
      /* grille de balayage : reguliere vue du capteur (axe uScan), puis vue de biais par la camera :
         les colonnes restent droites, les rangees ondulent avec le relief et se tassent la ou la surface fuit */
      float s = uS;
      vec3 ps = uScan*p, ns = uScan*n;
      float nz = ns.z >= 0. ? max(ns.z, 0.07) : min(ns.z, -0.07);
      vec2 g0 = floor(ps.xy/s);
      float cov = 0., brAp = 0.;
      float rr = uDot*mix(mix(0.19, 0.15, wP), mix(0.33, 0.46, wP), dark)*(1. + 0.18*pil);
      float al = mix(0.12, 1.0, smoothstep(0.1,0.6,dark));
      float sx = fract(ps.x/s) < 0.5 ? -1. : 1.;
      float wv = uWave*(1.-smoothstep(1.43,1.5,p.y))*smoothstep(-0.06,0.04,n.z)*(1.-isH);
      float ety = mix(1., mix(0.62, 0.42, smoothstep(0.05, 0.15, uHairB.x*uHairA.x)), isH);   /* courts : traits plus courts */
      for(int jy=-2; jy<=2; jy++){
        for(int jx=0; jx<=1; jx++){
          vec2 g = g0 + vec2(float(jx)*sx, float(jy));
          vec2 cxy = (g+0.5)*s;
          float dz = clamp(-(ns.x*(cxy.x-ps.x) + ns.y*(cxy.y-ps.y))/nz, -2.5*s, 2.5*s);
          vec3 cs = vec3(cxy, ps.z + dz);
          /* houle du balayage : la profondeur de chaque point ondule (rangees en vagues) */
          cs.z += wv*(fbm2(cxy*vec2(19.,23.) + vec2(uT*0.05, -uT*0.03)) - 0.45);
          float hh = h21(g*0.731+3.1);
          float r = rr*(1.+0.08*sin(uT*1.6+hh*6.28));
          float keep = 1.;
          if(band < 1.){
            /* pres de la coupure : grains plus gros, plus sombres, qui se detachent et tombent */
            cs.y -= (1.-band)*(0.3+1.2*hh)*s*(0.8+0.4*sin(uT*0.9+hh*6.28));
            r *= mix(1.6, 1., band);
            keep = step(hh, 0.2+0.8*band);
          }
          /* revelation : seuil par point = hauteur (haut du crane d'abord) + bruit, front irregulier */
          float ap = 1.;
          if(uRevele < 0.999){
            vec3 c0 = transpose(uScan)*cs;
            float th = clamp((1.84 - c0.y)/0.72, 0., 1.)*0.78 + 0.13*vnoise(c0.xz*9. + c0.y*7.) + 0.09*h21(g*1.913+7.7);
            ap = clamp((uRevele*1.12 - th)/0.085, 0., 1.);
            float e = 1. - ap;
            cs.y += e*e*1.8*s; cs.x += e*e*(h21(g*3.1+1.3)-0.5)*3.*s;   /* il se pose a sa place */
            r *= ap*(2.-ap);
            brAp += keep*ap*(1.-ap)*4.*(1.-smoothstep(r-0.6, r+0.6, length(proj(uBody*(transpose(uScan)*cs))-fc)));
          }
          vec3 c = transpose(uScan)*cs;
          vec2 dd = proj(uBody*c)-fc;
          float dpx = length(vec2(dd.x, dd.y*ety));
          cov += keep*min(1., ap*1.6)*(1.-smoothstep(r-0.6, r+0.6, dpx));
        }
      }
      float dk = clamp(dark + (1.-band)*0.4 + isH*0.12, 0., 1.);
      vec3 cl = mix(vec3(0.20,0.58,0.62), vec3(0.11,0.48,0.52), smoothstep(0.,0.6,dk));
      cl = mix(cl, vec3(0.0,0.30,0.33), clamp((cov-1.)*0.7 + 0.45*smoothstep(0.7,1.,dk), 0., 1.));
      /* les points au bord du front d'apparition brillent un peu : on voit la forme se construire */
      float brille = clamp(brAp/max(cov, 1e-3), 0., 1.);
      cl = mix(cl, vec3(0.80,0.98,0.97), 0.7*brille);
      col = mix(col, cl, min(cov,1.)*mix(al, 1., brille));
      if(uDbg>1.5) col = vec3(1.-dark); else if(uDbg>0.5) col = vec3(0.15+0.85*lam)*(0.6+0.4*fac);
    }
  }
  o = vec4(col,1.);
}`;

const VS_PART = `#version 300 es
precision highp float;
${COMMUN}
in vec4 aP;   /* theta, dy, phase, taille */
in vec3 aO;   /* decalage dans la grappe */
out float vA; out float vD;
void main(){
  float th = aP.x;
  vec3 dir = vec3(cos(th),0.,sin(th));
  vec3 base = vec3(mix(0.152,0.128,uFem)*cos(th), 0., mix(0.098,0.09,uFem)*sin(th)-0.008);
  base.y = cutY(base) + aP.y;
  float ph = fract(uT*0.06 + aP.z);
  vec3 pos = base + aO + dir*(0.003+ph*0.008) + vec3(0., -ph*ph*0.05 - ph*0.01, 0.);
  vec3 w = uBody*pos;
  float face = dot(uBody*dir, normalize(uCam-w));
  vA = smoothstep(0.,0.06,ph)*pow(1.-ph,1.4)*smoothstep(-0.05,0.25,face)*smoothstep(0.86, 1.0, uRevele);
  vD = aP.w;
  vec2 sp = proj(w);
  gl_Position = vec4(sp/uRes*2.-1., 0., 1.);
  gl_PointSize = aP.w*(1.+ph*0.35)*(uFocal/1400.)*1.2;
}`;
const FS_PART = `#version 300 es
precision highp float;
in float vA; in float vD; out vec4 o;
void main(){
  vec2 q = gl_PointCoord*2.-1.; float r = dot(q,q);
  float a = (1.-smoothstep(0.55,1.,r))*vA;
  vec3 c = mix(vec3(0.122,0.490,0.525), vec3(0.051,0.353,0.384), clamp((vD-2.)/2.5,0.,1.));
  o = vec4(c, a*0.92);
}`;

/* ------------------------------------------------------------------ */
/*  Carte de profondeur du visage                                     */
/* ------------------------------------------------------------------ */
const N = 64;
const X0 = -0.085, XW = 0.17, Y0 = -0.14, YH = 0.24, ZMAX = 0.12;
/* tete de base (meme formule que le shader), en coordonnees du visage */
function sdE3(px,py,pz,rx,ry,rz){ const k0=Math.hypot(px/rx,py/ry,pz/rz), k1=Math.hypot(px/(rx*rx),py/(ry*ry),pz/(rz*rz)); return k0*(k0-1)/Math.max(k1,1e-6); }
function smin1(a,b,k){ const h=Math.max(k-Math.abs(a-b),0)/k; return Math.min(a,b)-h*h*k*0.25; }
/* tete etoilee : rayon depuis le centre de la tete, carte equirectangulaire NT x NP */
const NT = 192, NP = 96, OC = [0, 0.0, -0.035];
const dirTex = (i,j) => { const th = -Math.PI + 2*Math.PI*(i+0.5)/NT, ph = -Math.PI/2 + Math.PI*(j+0.5)/NP;
  return [Math.cos(ph)*Math.sin(th), Math.sin(ph), Math.cos(ph)*Math.cos(th), th]; };
function teteBaseH(x,y,z){ return smin1(sdE3(x,y-0.022,z+0.025,0.08,0.1,0.1), sdE3(x,y+0.062,z-0.002,0.07,0.068,0.078), 0.035); }
/* f : crane un peu plus petit, machoire plus etroite et plus douce */
function teteBaseF(x,y,z){ return smin1(sdE3(x,y-0.024,z+0.026,0.077,0.098,0.098), sdE3(x,y+0.058,z-0.0,0.06,0.064,0.07), 0.045); }
const baseRad = tb => { const b = new Float32Array(NT*NP);
  for(let j=0;j<NP;j++) for(let i=0;i<NT;i++){ const d = dirTex(i,j); let r = 0;
    const f = r => tb(OC[0]+d[0]*r, OC[1]+d[1]*r, OC[2]+d[2]*r);
    for(; r<0.2; r+=0.004){ if(f(r) > 0) break; }
    let a = r-0.004, c = r; for(let k=0;k<14;k++){ const mid=(a+c)/2; if(f(mid) > 0) c = mid; else a = mid; }
    b[j*NT+i] = (a+c)/2; }
  return b; };
const BASER_H = baseRad(teteBaseH), BASER_F = baseRad(teteBaseF);
let BASER = BASER_H;
function baseMix(fem){ const b = new Float32Array(NT*NP); for(let k=0;k<NT*NP;k++) b[k] = BASER_H[k]*(1-fem) + BASER_F[k]*fem; BASER = b; }
let dernierHM = null, REPERE = null;   /* REPERE : repere du visage dans l'image (pour la photo) */   /* derniere carte (hauteurs, masque) pour reconstruire quand le genre change */
function echant(a, x, y){ /* bilineaire sur la grille du visage, -1 hors domaine */
  const gx = (x-X0)/XW*N-0.5, gy = (y-Y0)/YH*N-0.5;
  if(gx < 0 || gy < 0 || gx > N-1 || gy > N-1) return -1;
  const i = Math.floor(gx), j = Math.floor(gy), fx = gx-i, fy = gy-j, i1 = Math.min(i+1,N-1), j1 = Math.min(j+1,N-1);
  return (a[j*N+i]*(1-fx)+a[j*N+i1]*fx)*(1-fy) + (a[j1*N+i]*(1-fx)+a[j1*N+i1]*fx)*fy;
}
function versRadial(h, m){
  dernierHM = [h, m];
  const R = BASER.slice();
  for(let j=0;j<NP;j++) for(let i=0;i<NT;i++){
    const d = dirTex(i,j); if(Math.abs(d[3]) > 1.7 || d[2] <= 0.05) continue;
    const g = r => { const x = OC[0]+d[0]*r, y = OC[1]+d[1]*r, z = OC[2]+d[2]*r; const hz = echant(h, x, y); return hz < -0.5 ? 1 : z - hz; };
    let r0 = 0.02, r1 = -1, g0 = g(r0);
    if(g0 > 0) continue;
    for(let r=0.022; r<0.17; r+=0.002){ const v = g(r); if(v > 0){ r1 = r; break; } r0 = r; }
    if(r1 < 0) continue;
    for(let k=0;k<7;k++){ const rm = (r0+r1)/2; if(g(rm) > 0) r1 = rm; else r0 = rm; }
    const rr = (r0+r1)/2, x = OC[0]+d[0]*rr, y = OC[1]+d[1]*rr;
    /* fondu large entre le visage et le crane : de profil, plus de bord de masque */
    const r2 = (x/0.08)**2 + ((y+0.022)/0.126)**2;
    let w = Math.min(1, Math.max(0, (1-r2)/0.8)); w = w*w*(3-2*w);
    const mm = Math.max(0, echant(m, x, y));
    const wm = w*mm, k = j*NT+i;
    R[k] = R[k]*(1-wm) + Math.max(R[k]*0.86, rr)*wm;
  }
  /* lissage leger de la carte (supprime l'escalier du balayage) */
  const Q = R.slice();
  for(let j=2;j<NP-2;j++) for(let i=0;i<NT;i++){ let sm=0, n=0;
    for(let b=-2;b<=2;b++) for(let a=-2;a<=2;a++){ const ii=(i+a+NT)%NT, w=(a||b)?(Math.abs(a)+Math.abs(b) > 2 ? 0.5 : 1):4; sm += R[(j+b)*NT+ii]*w; n += w; }
    Q[j*NT+i] = sm/n; }
  return Q;
}
const DETAIL = new Float32Array(N*N);
function visageParDefaut(){
  const h = new Float32Array(N*N), mk = new Float32Array(N*N);
  const g = (x,y,cx,cy,sx,sy) => Math.exp(-(((x-cx)/sx)**2 + ((y-cy)/sy)**2));
  for(let j=0;j<N;j++) for(let i=0;i<N;i++){
    const x = X0 + XW*(i+0.5)/N, y = Y0 + YH*(j+0.5)/N, ax = Math.abs(x);
    const ov = (x/0.074)**2 + ((y+0.03)/0.108)**2;
    const mask = Math.min(1, Math.max(0, (1.1-ov)/0.35));
    let base = 0.064*Math.pow(Math.max(0, 1 - (x/0.078)**2 - ((y+0.02)/0.15)**2*0.6), 0.75);
    base -= 0.012*Math.max(0, y-0.03)/0.04;              /* front fuyant */
    base -= 0.010*Math.max(0, -0.085-y)/0.04;            /* sous le menton */
    let f = 0;
    f -= 0.013*g(ax,y,0.031,0.002,0.016,0.010);          /* orbites */
    f += 0.007*g(ax,y,0.029,0.019,0.024,0.007);          /* arcades */
    f += 0.009*g(ax,y,0.047,-0.018,0.016,0.016);         /* pommettes */
    f -= 0.006*g(ax,y,0.040,-0.050,0.014,0.020);         /* creux des joues */
    /* nez : arete puis pointe */
    const tn = Math.min(1, Math.max(0, (0.012-y)/0.054));
    const wn = 0.0065 + 0.0075*tn;
    const inN = y < 0.016 && y > -0.05 ? 1 : 0;
    f += inN*(0.004 + 0.03*Math.pow(tn,1.2))*Math.exp(-((x/wn)**2))*(y<-0.042 ? Math.max(0,1-(-0.042-y)/0.008) : 1);
    f += 0.008*g(ax,y,0.014,-0.04,0.007,0.006);          /* ailes du nez */
    f += 0.006*g(x,y,0,-0.057,0.012,0.006);              /* philtrum */
    f += 0.009*g(x,y,0,-0.064,0.022,0.0055);             /* levre sup */
    f -= 0.004*g(x,y,0,-0.0705,0.02,0.0022);             /* commissure */
    f += 0.008*g(x,y,0,-0.077,0.019,0.006);              /* levre inf */
    f -= 0.003*g(x,y,0,-0.088,0.016,0.005);              /* creux sous la levre */
    f += 0.010*g(x,y,0,-0.104,0.022,0.012);              /* menton */
    h[j*N+i] = base+f; mk[j*N+i] = mask*mask*(3-2*mask);
    /* details sculpturaux (sans le nez) reutilises pour accentuer le vrai visage */
    DETAIL[j*N+i] = (-0.013*g(ax,y,0.031,0.002,0.016,0.010) + 0.007*g(ax,y,0.029,0.019,0.024,0.007) + 0.009*g(ax,y,0.047,-0.018,0.016,0.016)
      - 0.006*g(ax,y,0.040,-0.050,0.014,0.020) + 0.009*g(x,y,0,-0.064,0.022,0.0055) - 0.004*g(x,y,0,-0.0705,0.02,0.0022)
      + 0.008*g(x,y,0,-0.077,0.019,0.006) - 0.003*g(x,y,0,-0.088,0.016,0.005) + 0.006*g(x,y,0,-0.104,0.022,0.012))*mask;
  }
  return versRadial(h, mk);
}

const LM_GAUCHE = 234, LM_DROITE = 454, LM_HAUT = 10, LM_MENTON = 152;
function visageDepuisPoints(lm, W, H){
  const P = lm.map(p => [p.x*W, p.y*H, p.z*W]);
  const sub = (a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const nor = a => { const l=Math.hypot(a[0],a[1],a[2])||1; return [a[0]/l,a[1]/l,a[2]/l]; };
  const cr = (a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const L = P[LM_GAUCHE], R = P[LM_DROITE];
  let X = sub(R,L); const fw = Math.hypot(X[0],X[1],X[2]); if(fw < 1) return null; X = nor(X);
  let Y = sub(P[LM_HAUT], P[LM_MENTON]); const yx = dot(Y,X); Y = nor([Y[0]-X[0]*yx, Y[1]-X[1]*yx, Y[2]-X[2]*yx]);
  const Z = cr(X,Y);
  const c = [(L[0]+R[0])/2, (L[1]+R[1])/2, (L[2]+R[2])/2];
  const sc = 0.14/fw;
  const acc = new Float32Array(N*N), wsum = new Float32Array(N*N), accF = new Float32Array(N*N), wF = new Float32Array(N*N);
  const sig = 2.4, rad = 8, sigF = 1.3;
  for(const p of P){
    const d = sub(p,c);
    const lx = -dot(d,X)*sc, ly = dot(d,Y)*sc, lz = dot(d,Z)*sc;
    const gx = (lx-X0)/XW*N-0.5, gy = (ly-Y0)/YH*N-0.5;
    const i0 = Math.round(gx), j0 = Math.round(gy);
    for(let j=j0-rad;j<=j0+rad;j++){ if(j<0||j>=N) continue;
      for(let i=i0-rad;i<=i0+rad;i++){ if(i<0||i>=N) continue;
        const r2 = (i-gx)**2+(j-gy)**2;
        const w = Math.exp(-r2/(2*sig*sig)), wf = Math.exp(-r2/(2*sigF*sigF));
        acc[j*N+i] += w*lz; wsum[j*N+i] += w; accF[j*N+i] += wf*lz; wF[j*N+i] += wf; } }
  }
  for(let k=0;k<N*N;k++){ if(wsum[k] > 0){ const t = 0; acc[k] = (acc[k]/wsum[k])*(1-t) + (wF[k]>1e-4 ? accF[k]/wF[k] : 0)*t; acc[k] *= wsum[k]; } }
  const h = new Float32Array(N*N), mk = new Float32Array(N*N);
  REPERE = { c, X, Y, Z, sc, W, H, hRaw: h, mk, P };
  let mx = 0;
  for(let k=0;k<N*N;k++){
    const w = wsum[k]; if(w < 0.015){ h[k]=0; mk[k]=0; continue; }
    const m = Math.min(1, Math.max(0, (w-0.015)/0.12)); mk[k] = m*m*(3-2*m);
    h[k] = acc[k]/w + 0.004; if(m > 0.5) mx = Math.max(mx, h[k]);
  }
  /* l'echelle de profondeur du detecteur varie : on ramene le nez a ~9,5 cm du plan des pommettes */
  REPERE.hRaw = h.slice();
  if(mx > 0){ const sc = Math.min(1.6, Math.max(0.5, 0.095/mx)); for(let k=0;k<N*N;k++) h[k] *= sc; }
  const e0 = h;
  /* un flou leger */
  const o = new Float32Array(N*N);
  for(let j=0;j<N;j++) for(let i=0;i<N;i++){
    let s=0, n=0; for(let b=-1;b<=1;b++) for(let a=-1;a<=1;a++){ const ii=i+a, jj=j+b; if(ii<0||jj<0||ii>=N||jj>=N) continue; const w=(a||b)?1:2; s+=e0[jj*N+ii]*w; n+=w; }
    o[j*N+i] = s/n;
  }
  /* accentue le relief (masque flou) : visage plus sculpte */
  /* deux bandes : fine (arcades, narines, levres) et large (nez, pommettes, menton, machoire) : le profil n'est plus plat */
  const flouBoite = (src, r) => { const t = new Float32Array(N*N), u = new Float32Array(N*N);
    for(let j=0;j<N;j++){ let acc=0, n=0; for(let i=-r;i<N+r;i++){ if(i+r < N && i+r >= 0){ acc += src[j*N+i+r]; n++; } if(i-r-1 >= 0 && i-r-1 < N){ acc -= src[j*N+i-r-1]; n--; } if(i>=0 && i<N) t[j*N+i] = acc/Math.max(n,1); } }
    for(let i=0;i<N;i++){ let acc=0, n=0; for(let j=-r;j<N+r;j++){ if(j+r < N && j+r >= 0){ acc += t[(j+r)*N+i]; n++; } if(j-r-1 >= 0 && j-r-1 < N){ acc -= t[(j-r-1)*N+i]; n--; } if(j>=0 && j<N) u[j*N+i] = acc/Math.max(n,1); } }
    return u; };
  const fin = flouBoite(o, 3), large = flouBoite(o, 8);
  const o2 = new Float32Array(N*N);
  for(let k=0;k<N*N;k++){ const m3 = mk[k]**3;
    o2[k] = o[k] + 1.3*(o[k] - fin[k])*m3 + 0.55*(fin[k] - large[k])*m3 + 0.5*DETAIL[k]*mk[k]; }
  return versRadial(o2, mk);
}

/* ------------------------------------------------------------------ */
/*  Photo : la vraie image projetee sur la grille du visage           */
/* ------------------------------------------------------------------ */
const NPX = 128, NPY = 180;
const OVALE = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
let pcv = null, pctx = null;
/* renvoie Float32Array 4*NPX*NPY : [sombre, poids, pilosite, 1] par cellule (+ .moyenne), ou null */
function photoVersGrille(img, miroir, ch){
  const R = REPERE; if(!R) return null;
  const iw = img.videoWidth || img.width, ih = img.videoHeight || img.height; if(!iw || !ih) return null;
  const pw = 256, ph = Math.max(1, Math.round(256*ih/iw));
  if(!pcv){ pcv = document.createElement('canvas'); pctx = pcv.getContext('2d', { willReadFrequently:true }); }
  if(pcv.width !== pw || pcv.height !== ph){ pcv.width = pw; pcv.height = ph; }
  try { pctx.drawImage(img, 0, 0, pw, ph); } catch(e){ return null; }
  let px; try { px = pctx.getImageData(0, 0, pw, ph).data; } catch(e){ return null; }
  const lum = (x, y) => { x = Math.min(pw-1.001, Math.max(0, x)); y = Math.min(ph-1.001, Math.max(0, y));
    const i = Math.floor(x), j = Math.floor(y), fx = x-i, fy = y-j;
    const L = k => 0.2126*px[k*4] + 0.7152*px[k*4+1] + 0.0722*px[k*4+2];
    return (L(j*pw+i)*(1-fx) + L(j*pw+i+1)*fx)*(1-fy) + (L((j+1)*pw+i)*(1-fx) + L((j+1)*pw+i+1)*fx)*fy; };
  const { c, X, Y, Z, sc, W, H, hRaw, P } = R;
  /* ovale du visage dans la grille (lx, ly) */
  const loc = q => { const d = [q[0]-c[0], q[1]-c[1], q[2]-c[2]]; return [-(d[0]*X[0]+d[1]*X[1]+d[2]*X[2])*sc, (d[0]*Y[0]+d[1]*Y[1]+d[2]*Y[2])*sc]; };
  const OV = OVALE.map(i => loc(P[i]));
  const lyNez = loc(P[2])[1];
  const dans = (u, v) => { let ins = false; for(let i=0, j=OV.length-1; i<OV.length; j=i++){ const a = OV[i], b = OV[j];
    if((a[1] > v) !== (b[1] > v) && u < (b[0]-a[0])*(v-a[1])/(b[1]-a[1]) + a[0]) ins = !ins; } return ins; };
  const n = NPX*NPY, Lu = new Float32Array(n), Wt = new Float32Array(n), Bb = new Float32Array(n), Py = new Float32Array(n);
  const M = ch && ch.masque, mw = ch && ch.mw, mh = ch && ch.mh;
  for(let j=0;j<NPY;j++) for(let i=0;i<NPX;i++){
    const lx = X0 + XW*(i+0.5)/NPX, ly = Y0 + YH*(j+0.5)/NPY, k = j*NPX+i; Py[k] = ly;
    let lz = echant(hRaw, lx, ly); if(lz < -0.5) lz = 0;
    const dx = (-lx*X[0] + ly*Y[0] + lz*Z[0])/sc, dy = (-lx*X[1] + ly*Y[1] + lz*Z[1])/sc;
    let xn = (c[0] + dx)/W, yn = (c[1] + dy)/H; if(miroir) xn = 1 - xn;
    Lu[k] = lum(xn*pw - 0.5, yn*ph - 0.5);
    Wt[k] = (xn > 0 && yn > 0 && xn < 1 && yn < 1 && dans(lx, ly)) ? 1 : 0;
    /* barbe : le masque du segmenteur sous le nez, dans l'ovale (meme repere que les landmarks, non miroir) */
    if(M && Wt[k] && ly < lyNez + 0.004){ const x0 = (c[0] + dx)/W, y0 = (c[1] + dy)/H;
      if(x0 > 0 && y0 > 0 && x0 < 1 && y0 < 1) Bb[k] = M[Math.floor(y0*mh)*mw + Math.floor(x0*mw)]; }
  }
  /* contraste : egalisation d'histogramme sur le seul ovale (un eclairage faible ou fort donne le meme rendu),
     melangee a une normalisation 5-95 pour garder les valeurs, puis contraste local (masque flou) */
  const vals = []; for(let k=0;k<n;k++) if(Wt[k]) vals.push(Lu[k]);
  if(vals.length < 200) return null;
  vals.sort((a,b)=>a-b);
  const nv = vals.length, p5 = vals[Math.floor(nv*0.05)], p95 = vals[Math.floor(nv*0.95)], ec = Math.max(6, p95 - p5);
  const rang = L => { let lo = 0, hi = nv; while(lo < hi){ const m = (lo+hi)>>1; if(vals[m] < L) lo = m+1; else hi = m; } return lo/nv; };
  const D = new Float32Array(n);
  for(let k=0;k<n;k++){ const lin = Math.min(1, Math.max(0, (p95 - Lu[k])/ec)), eq = 1 - rang(Lu[k]); D[k] = 0.65*eq + 0.35*lin; }
  /* bord doux de l'ovale */
  let w2 = Wt; for(let it=0; it<3; it++){ const t = new Float32Array(n);
    for(let j=0;j<NPY;j++) for(let i=0;i<NPX;i++){ let s=0, m=0; for(let b=-1;b<=1;b++) for(let a=-1;a<=1;a++){ const ii=i+a, jj=j+b; if(ii<0||jj<0||ii>=NPX||jj>=NPY) continue; s += w2[jj*NPX+ii]; m++; } t[j*NPX+i] = s/m; }
    w2 = t; }
  /* contraste local : sourcils, yeux, narines ressortent */
  const fl = new Float32Array(n), r = 5;
  for(let j=0;j<NPY;j++) for(let i=0;i<NPX;i++){ let s=0, m=0; for(let b=-r;b<=r;b+=2) for(let a=-r;a<=r;a+=2){ const ii=i+a, jj=j+b; if(ii<0||jj<0||ii>=NPX||jj>=NPY || !Wt[jj*NPX+ii]) continue; s += D[jj*NPX+ii]; m++; } fl[j*NPX+i] = m ? s/m : D[j*NPX+i]; }
  const out = new Float32Array(4*n); let somme = 0, nb = 0;
  for(let k=0;k<n;k++){
    let d = Math.min(1, Math.max(0, D[k] + 0.7*(D[k] - fl[k])));
    /* pilosite du visage : sous le nez, dans l'ovale, sombre sur la photo (et poil vu par le segmenteur s'il est la) */
    const sousNez = Py[k] < lyNez + 0.004 ? 1 : 0;
    let pil = 0;
    if(sousNez && Wt[k]){ const sombre = Math.min(1, Math.max(0, (D[k] - 0.55)/0.3));
      pil = M ? Math.max(sombre*0.6, sombre*Math.min(1, Bb[k]*1.4)) : sombre*0.6; }
    out[4*k] = d; out[4*k+1] = Math.min(1, Math.max(0, (w2[k] - 0.15)/0.7)); out[4*k+2] = pil; out[4*k+3] = 1;
    if(Wt[k]){ somme += d; nb++; }
  }
  out.moyenne = nb ? somme/nb : 0.5;
  return out;
}

/* ------------------------------------------------------------------ */
/*  Cheveux : parametres simples d'apres le masque du segmenteur      */
/* ------------------------------------------------------------------ */
/* retourne { quantite, dessus, cotes, longueur, frange } (metres, relatifs au visage) ou null.
   02/10 : la barbe et la moustache ne sont pas la chevelure (le segmenteur les classe en cheveux) :
   tout ce qui est sous le nez entre les joues, et sous le menton, est ignore. La longueur ne se mesure
   qu'a l'exterieur des joues ; en cas de doute : court (et plus exigeant encore pour un homme). */
function paramsCheveux(lm, W, H, ch, fem){
  const M = ch.masque, mw = ch.mw, mh = ch.mh; if(!M || !mw || !mh || !lm || lm.length < 455) return null;
  const P = i => [lm[i].x*W, lm[i].y*H];
  const L = P(234), R = P(454), hi = P(10), lo = P(152), ne = P(2);
  let X = [R[0]-L[0], R[1]-L[1]]; const fw = Math.hypot(X[0], X[1]); if(fw < 4) return null; X = [X[0]/fw, X[1]/fw];
  let Y = [hi[0]-lo[0], hi[1]-lo[1]]; const yx = Y[0]*X[0]+Y[1]*X[1]; Y = [Y[0]-X[0]*yx, Y[1]-X[1]*yx]; const yl = Math.hypot(Y[0],Y[1]) || 1; Y = [Y[0]/yl, Y[1]/yl];
  const c = [(L[0]+R[0])/2, (L[1]+R[1])/2];
  const vDe = q => ((q[0]-c[0])*Y[0] + (q[1]-c[1])*Y[1])/fw;
  const v10 = vDe(hi), vNez = vDe(ne), vMenton = vDe(lo);
  /* zone de barbe : l'interieur de l'ovale du visage (elargi d'une marge) sous le nez, et une bande sous la machoire.
     Les cheveux qui tombent a cote des joues sont a l'exterieur de l'ovale : ils restent. */
  const OV = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109]
    .map(i => { const q = P(i), dx = q[0]-c[0], dy = q[1]-c[1]; return [(dx*X[0]+dy*X[1])/fw*1.1, (dx*Y[0]+dy*Y[1])/fw*1.06 - 0.02]; });
  const dansOvale = (u, v) => { let ins = false;
    for(let i=0, j=OV.length-1; i<OV.length; j=i++){ const a = OV[i], b = OV[j];
      if((a[1] > v) !== (b[1] > v) && u < (b[0]-a[0])*(v-a[1])/(b[1]-a[1]) + a[0]) ins = !ins; }
    return ins; };
  /* bas de l'ovale (machoire) a l'abscisse u, ou null hors de sa largeur */
  const machoire = u => { let best = null;
    for(let i=0, j=OV.length-1; i<OV.length; j=i++){ const a = OV[i], b = OV[j];
      if((a[0] > u) !== (b[0] > u)){ const v = a[1] + (b[1]-a[1])*(u-a[0])/(b[0]-a[0]); if(v < 0 && (best === null || v < best)) best = v; } }
    return best; };
  const barbe = (u, v) => { if(v < vNez + 0.05 && dansOvale(u, v)) return true;
    const vj = machoire(u); return vj !== null && v < vj + 0.02 && v > vj - 0.4; };
  /* valeur du masque au point (u,v) du repere du visage (unites = largeur du visage) ; -1 hors image */
  const val = (u, v) => { const x = (c[0] + (X[0]*u + Y[0]*v)*fw)/W, y = (c[1] + (X[1]*u + Y[1]*v)*fw)/H;
    if(x < 0 || y < 0 || x >= 1 || y >= 1) return -1; if(barbe(u, v)) return 0; return M[Math.floor(y*mh)*mw + Math.floor(x*mw)]; };
  const S = 0.5;
  /* presence : anneau juste a l'exterieur du visage, du haut du crane aux tempes (l'image peut couper le haut) */
  let n = 0, o = 0;
  for(let k=0; k<=24; k++){ const an = Math.PI*k/24;
    for(const e of [1.12, 1.25, 1.4]){ const u = Math.cos(an)*0.52*e, v = 0.05 + Math.sin(an)*(v10 + 0.22)*e; const a = val(u, v); if(a < 0) continue; n++; if(a > S) o++; } }
  const pres = n >= 6 ? o/n : 0;
  /* parcours le long d'une direction : derniere position de cheveux (petits trous toleres) et arrivee au bord de l'image */
  const parcours = (u0, v0, du, dv, pas, maxi, trou) => { let last = null, vide = 0, bord = false;
    for(let k=0; k*pas <= maxi; k++){ const u = u0 + du*k*pas, v = v0 + dv*k*pas, a = val(u, v);
      if(a < 0){ bord = last !== null && vide === 0; break; }
      if(a > S){ last = k*pas; vide = 0; } else { vide += pas; if(last !== null && vide > trou) break; if(last === null && k*pas > trou) break; } }
    return { last, bord }; };
  /* volume au-dessus du crane (boucles, chignon...) */
  let tops = [], coupe = 0; for(const u of [-0.15, 0, 0.15]){ const r = parcours(u, v10-0.05, 0, 1, 0.02, 1.0, 0.08); if(r.last !== null){ tops.push(v10 - 0.05 + r.last); if(r.bord) coupe++; } }
  const topV = tops.length ? tops.reduce((a,b)=>a+b,0)/tops.length : v10;
  const dessus = coupe >= 2 ? 0.018 : Math.min(0.06, Math.max(0, (topV - v10)*0.14 - 0.047));
  /* largeur sur les cotes, au niveau des tempes et du front (hors barbe) */
  let sides = []; for(const v of [0.15, 0.3, 0.45]) for(const sg of [-1, 1]){ const r = parcours(sg*0.42, v, sg, 0, 0.02, 1.2, 0.1); if(r.last !== null) sides.push(0.42 + r.last); }
  const sideU = sides.length ? sides.reduce((a,b)=>a+b,0)/sides.length : 0.5;
  const cotes = Math.min(0.05, Math.max(0, (sideU - 0.56)*0.14));
  /* longueur : seulement a l'exterieur des joues ; il faut une chevelure continue depuis les tempes */
  const cols = [-1.05, -0.9, -0.75, -0.62, 0.62, 0.75, 0.9, 1.05];
  let nLong = 0, nLoin = 0, nMi = 0, bas = [];
  for(const u of cols){
    /* la chevelure doit commencer au-dessus du nez (tempes, oreilles) puis descendre sans interruption :
       une barbe qui deborde sous la machoire ne peut pas lancer une colonne */
    let v0 = null; for(let v = 0.25; v > vNez; v -= 0.03){ if(val(u, v) > S){ v0 = v; break; } }
    if(v0 === null) continue;
    const r = parcours(u, v0, 0, -1, 0.03, 4.2, 0.12);
    if(r.last === null) continue;
    let v = v0 - r.last;
    if(r.bord) v = Math.min(v - 0.6, -2.3);           /* coupe par le bas de l'image en pleine chevelure : longs */
    bas.push(v);
    if(v < vMenton - 0.2){ nLong++; if(Math.abs(u) >= 0.75) nLoin++; }
    else if(v < vNez - 0.05) nMi++;
  }
  bas.sort((a,b)=>a-b);
  /* un homme : il faut que plusieurs colonnes, dont des colonnes bien a l'exterieur, le montrent */
  const long = fem < 0.5 ? (nLong >= 3 && nLoin >= 2) : (nLong >= 2 && nLoin >= 1);
  let longueur = 0;
  if(long){ const k = Math.min(bas.length, nLong); const lowV = bas.slice(0, k).reduce((a,b)=>a+b,0)/k; longueur = Math.min(0.45, Math.max(0.16, -lowV*0.14 + 0.012)); }
  /* au carre, jusqu'a la machoire : jamais pour un homme (favoris + barbe donnent ce motif) */
  else if(fem >= 0.5 && nLong + nMi >= 3) longueur = 0.1;
  /* frange : cheveux sur le front, sous le point 10 */
  n = 0; o = 0; for(let u=-0.25; u<=0.26; u+=0.05) for(let v=v10-0.35; v<=v10-0.1; v+=0.04){ const a = val(u,v); if(a < 0) continue; n++; if(a > S) o++; }
  const fr = n ? o/n : 0;
  const ss = (a,b,x) => { const t = Math.min(1, Math.max(0, (x-a)/(b-a))); return t*t*(3-2*t); };
  return { quantite: ss(0.12, 0.4, pres), dessus, cotes, longueur, frange: ss(0.2, 0.6, fr), nLong, nLoin, nMi };
}

/* ------------------------------------------------------------------ */
/*  Rendu                                                             */
/* ------------------------------------------------------------------ */
const rotY = a => { const c=Math.cos(a), s=Math.sin(a); return [c,0,-s, 0,1,0, s,0,c]; };
const rotX = a => { const c=Math.cos(a), s=Math.sin(a); return [1,0,0, 0,c,s, 0,-s,c]; };
const mul3 = (A,B) => { const R=new Array(9); for(let c=0;c<3;c++) for(let r=0;r<3;r++){ let s=0; for(let k=0;k<3;k++) s+=A[k*3+r]*B[c*3+k]; R[c*3+r]=s; } return R; };

const Buste = (() => {
  let gl, cv, progB, progP, uB, uP, texFace, vaoB, vaoP, nPart = 0;
  const cible = visageParDefaut(), cour = cible.slice();
  let texPhoto = null, photoCible = null, photoCour = null, photoOctets = null, photoA = 0, tPh = 0, photoMoy = 0.5;
  let dernierLm = null, tPrec = -1, fem = 0, femBati = 0, zoomC = 0, tCh = 0, tourneC = 0;
  const chev = { quantite:0, dessus:0, cotes:0, longueur:0, frange:0 }, chevCible = { quantite:0, dessus:0, cotes:0, longueur:0, frange:0 };
  const perf = { n:0, t0:0, lents:0, rapides:0 };
  const etat = { echelle: 1, temps: [], r: { yaw:0.52, hyaw:0.18, hpitch:0.16, visH:0.72, dist:1.2, pitch:0.3, T:[-0.05,1.465,0.0], headPos:[0.0,1.67,0.075], esp:0.0068, cut:1.19, scan:0.2, scanP:0.2, wave:0.045 } };

  function compile(vs, fs){
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  function uniformes(p){
    const u = {}; for(const n of ['uRes','uPP','uT','uCam','uCamM','uFocal','uBody','uHead','uHeadPos','uFace','uS','uCut','uDbg','uDot','uScan','uWave','uFem','uZoom','uHeadY','uHeadS','uHairA','uHairB','uPhoto','uPhotoA','uPhotoM','uRevele']) u[n] = gl.getUniformLocation(p, n);
    return u;
  }
  function particules(){
    /* grappes accrochees au bord de la coupure, sur l'avant du tronc */
    const A = [], O = []; let seed = 7;
    const rnd = () => (seed = (seed*16807) % 2147483647) / 2147483647;
    for(let g=0; g<340; g++){
      const th = 0.12*Math.PI + rnd()*0.76*Math.PI;
      const nb = 4 + Math.floor(rnd()*rnd()*16);
      const ph = rnd(), dy = -0.004 + rnd()*0.01;
      const sx = 0.004+rnd()*0.009;
      for(let k=0;k<nb;k++){
        A.push(th, dy, ph + rnd()*0.05, 2.6 + rnd()*2.8);
        O.push((rnd()-0.5)*sx*2, (rnd()-0.5)*sx*1.4, (rnd()-0.5)*sx);
      }
    }
    nPart = A.length/4;
    return { A: new Float32Array(A), O: new Float32Array(O) };
  }

  function init(canvas){
    cv = canvas;
    gl = cv.getContext('webgl2', { antialias:false, alpha:false, premultipliedAlpha:false, powerPreference:'high-performance' });
    if(!gl) throw new Error('WebGL2 indisponible');
    progB = compile(VS_PLEIN, FS_BUSTE); uB = uniformes(progB);
    progP = compile(VS_PART, FS_PART); uP = uniformes(progP);

    vaoB = gl.createVertexArray(); gl.bindVertexArray(vaoB);
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const la = gl.getAttribLocation(progB, 'aPos'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);

    const pd = particules();
    vaoP = gl.createVertexArray(); gl.bindVertexArray(vaoP);
    const pa = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pa); gl.bufferData(gl.ARRAY_BUFFER, pd.A, gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(progP, 'aP'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 4, gl.FLOAT, false, 0, 0);
    const po = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, po); gl.bufferData(gl.ARRAY_BUFFER, pd.O, gl.STATIC_DRAW);
    const lo = gl.getAttribLocation(progP, 'aO'); gl.enableVertexAttribArray(lo); gl.vertexAttribPointer(lo, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    texPhoto = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texPhoto);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    photoOctets = new Uint8Array(4*NPX*NPY);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, NPX, NPY, 0, gl.RGBA, gl.UNSIGNED_BYTE, photoOctets);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texFace = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texFace);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, NT, NP, 0, gl.RED, gl.FLOAT, cour);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return Buste;
  }

  function taille(){
    const w = Math.max(1, Math.round(cv.clientWidth*etat.echelle)), h = Math.max(1, Math.round(cv.clientHeight*etat.echelle));
    if(cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; }
    return [w, h];
  }

  function dessine(landmarks, t, opts){
    if(!gl) return;
    opts = opts || {};
    const now = performance.now();
    const dt = tPrec < 0 ? 0.016 : Math.min(0.1, Math.max(0.001, (now - tPrec)/1000)); tPrec = now;
    const lisse = v => 1 - Math.exp(-dt*v);
    /* resolution adaptative : si la machine peine, on calcule moins de pixels (et on remonte si elle respire) */
    if(etat.auto !== false){ perf.n++; if(!perf.t0) perf.t0 = now;
      if(now - perf.t0 > 1000){ const fps = perf.n*1000/(now - perf.t0); etat.fps = Math.round(fps); perf.n = 0; perf.t0 = now;
        if(fps < 40){ perf.lents++; perf.rapides = 0; } else if(fps > 57){ perf.rapides++; perf.lents = 0; } else { perf.lents = 0; perf.rapides = 0; }
        if(perf.lents >= 2 && etat.echelle > 0.6){ etat.echelle = Math.round((etat.echelle-0.1)*10)/10; perf.lents = 0; }
        if(perf.rapides >= 6 && etat.echelle < 1){ etat.echelle = Math.round((etat.echelle+0.1)*10)/10; perf.rapides = 0; } } }
    /* genre : fondu continu (h = 0, f = 1, null = 0,5 ; absent = h) */
    const g = opts.genre === undefined ? 'h' : opts.genre;
    const femC = g === 'f' ? 1 : g === 'h' ? 0 : 0.5;
    if(!etat.demarre){ fem = femC; etat.demarre = true; }   /* premier appel : pas de fondu depuis 'h' */
    fem += (femC - fem)*lisse(2.2); if(Math.abs(femC - fem) < 0.002) fem = femC;
    if(Math.abs(fem - femBati) > 0.04 || (fem === femC && fem !== femBati)){ femBati = fem; baseMix(fem); if(dernierHM) cible.set(versRadial(dernierHM[0], dernierHM[1])); }
    /* visage : nouvelle cible si nouveaux points, puis lissage */
    if(etat.r.sansVisage){ landmarks = null; if(!etat.defaut || etat.defautFem !== femBati){ etat.defaut = visageParDefaut(); etat.defautFem = femBati; } cible.set(etat.defaut); }
    if(landmarks && landmarks !== dernierLm){
      dernierLm = landmarks;
      const lm = landmarks.points || landmarks;
      const v = visageDepuisPoints(lm, landmarks.w || 480, landmarks.h || 360);
      if(v) cible.set(v);
    }
    for(let k=0;k<NT*NP;k++) cour[k] += (cible[k]-cour[k])*0.12;
    gl.bindTexture(gl.TEXTURE_2D, texFace);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, NT, NP, gl.RED, gl.FLOAT, cour);
    /* cheveux : parametres recalcules ~8 fois par seconde, puis lisses */
    if(!opts.cheveux) chevCible.quantite = 0;
    else if(now - tCh > 120 && dernierLm){ tCh = now;
      const lm = dernierLm.points || dernierLm;
      const pc = paramsCheveux(lm, dernierLm.w || 480, dernierLm.h || 360, opts.cheveux, fem);
      if(pc){ etat.mesureCheveux = pc; chevCible.quantite = pc.quantite; chevCible.dessus = pc.dessus; chevCible.cotes = pc.cotes; chevCible.longueur = pc.longueur; chevCible.frange = pc.frange; } }
    /* photo : ~12 fois par seconde, puis lissee */
    const ph = opts.photo && opts.photo.image;
    if(ph && REPERE && now - tPh > 80){ tPh = now;
      const g2 = photoVersGrille(ph, !!opts.photo.miroir, opts.cheveux);
      if(g2){ photoCible = g2; if(!photoCour) photoCour = g2.slice(); } }
    photoA += ((ph && photoCible ? 1 : 0) - photoA)*lisse(2.5);
    if(photoCour && photoCible){ const kp = lisse(8);
      for(let k=0;k<photoCour.length;k++){ photoCour[k] += (photoCible[k] - photoCour[k])*kp; photoOctets[k] = Math.round(photoCour[k]*255); }
      gl.bindTexture(gl.TEXTURE_2D, texPhoto); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, NPX, NPY, gl.RGBA, gl.UNSIGNED_BYTE, photoOctets); }
    if(photoCible) photoMoy += ((photoCible.moyenne || 0.5) - photoMoy)*lisse(3);
    etat.photo = photoA;
    const kc = lisse(2.0);
    for(const k in chev) chev[k] += (chevCible[k] - chev[k])*kc;
    if(chevCible.quantite > 0.02){ /* la forme suit vite quand les cheveux apparaissent */ }
    etat.cheveux = chev; etat.genre = fem;
    /* zoom : glisse en douceur */
    const zc = Math.min(1, Math.max(0, +opts.zoom || 0));
    zoomC += (zc - zoomC)*lisse(4.0); if(Math.abs(zc - zoomC) < 0.0005) zoomC = zc;
    const z = zoomC*zoomC*(3 - 2*zoomC);
    etat.zoom = zoomC;
    /* tourne : la tete (et un peu le buste) pivote de gauche a droite, +-28 degres, aller-retour ~6 s */
    const tc = Math.min(1, Math.max(0, +opts.tourne || 0));
    tourneC += (tc - tourneC)*lisse(1.6); if(Math.abs(tc - tourneC) < 0.0005) tourneC = tc;
    const wT = tourneC*tourneC*(3 - 2*tourneC);
    const pivot = Math.sin(t*2*Math.PI/6);
    etat.tourne = tourneC;
    /* revele : pilote de l'exterieur (absent = 1) */
    const revele = opts.revele === undefined || opts.revele === null ? 1 : Math.min(1, Math.max(0, +opts.revele || 0));
    etat.revele = revele;

    const [W, H] = taille();
    /* cadrage : la composition de reference (portrait 0.72) tient dans l'ecran */
    const R = etat.r;
    /* mouvement lent : rotation aller-retour */
    const yaw = R.yaw + 0.07*Math.sin(t*0.33)*(1 - wT) + 0.1*wT*pivot;
    const body = rotY(yaw);
    const headS = 0.88 + (0.85 - 0.88)*fem;
    const headPos = [R.headPos[0], R.headPos[1] + 0.03*fem*0.5, R.headPos[2]];
    /* cible du gros plan : le centre du visage, dans le monde */
    const hc = [headPos[0], headPos[1] - 0.02, headPos[2] + 0.03];
    const hw = [body[0]*hc[0] + body[3]*hc[1] + body[6]*hc[2], body[1]*hc[0] + body[4]*hc[1] + body[7]*hc[2], body[2]*hc[0] + body[5]*hc[1] + body[8]*hc[2]];
    const visH = Math.exp(Math.log(R.visH) + (Math.log(R.visHZoom || 0.29) - Math.log(R.visH))*z);
    const ppu = Math.min(H/visH, W/(visH*0.56));      /* pixels par unite au point vise */
    const ppy = Math.max(0, (H - visH*ppu)*0.32)*(1 - z);   /* ecran etroit : on garde la tete en haut */
    const dist = R.dist;
    const focal = ppu*dist;
    const pitch = R.pitch + ((R.pitchZoom || 0.14) - R.pitch)*z;   /* plongee */
    const T = [R.T[0] + (hw[0] - R.T[0])*z, R.T[1] + (hw[1] - R.T[1])*z, R.T[2] + (hw[2] - R.T[2])*z];
    const cam = [T[0], T[1] + dist*Math.sin(pitch), T[2] + dist*Math.cos(pitch)];
    const f = [T[0]-cam[0], T[1]-cam[1], T[2]-cam[2]]; const fl = Math.hypot(...f); f[0]/=fl; f[1]/=fl; f[2]/=fl;
    const rl = Math.hypot(f[0], f[2]); const r = [-f[2]/rl, 0, f[0]/rl];   /* cross(f, haut) */
    const u = [r[1]*f[2]-r[2]*f[1], r[2]*f[0]-r[0]*f[2], r[0]*f[1]-r[1]*f[0]];
    const camM = [r[0],r[1],r[2], u[0],u[1],u[2], f[0],f[1],f[2]];
    const hyaw = R.hyaw + 0.05*Math.sin(t*0.33+0.6)*(1 - wT) + wT*(0.489*pivot - 0.1*pivot);   /* total tete ~ +-28 degres */
    const head = mul3(rotY(hyaw), rotX(R.hpitch + 0.02*Math.sin(t*0.27)));
    const s = R.esp*H/ppu;

    gl.viewport(0, 0, W, H);
    const set = (u) => {
      gl.uniform2f(u.uRes, W, H); gl.uniform2f(u.uPP, 0, ppy); gl.uniform1f(u.uT, t);
      gl.uniform3fv(u.uCam, cam); gl.uniformMatrix3fv(u.uCamM, false, camM); gl.uniform1f(u.uFocal, focal);
      gl.uniformMatrix3fv(u.uBody, false, body); gl.uniformMatrix3fv(u.uHead, false, head); gl.uniform3fv(u.uHeadPos, headPos);
      gl.uniform1i(u.uFace, 0); gl.uniform1f(u.uS, s); gl.uniform1f(u.uCut, R.cut); gl.uniform1f(u.uDbg, R.dbg||0); gl.uniform1f(u.uDot, R.esp*H); gl.uniformMatrix3fv(u.uScan, false, mul3(rotX(R.scanP), rotY(R.scan))); gl.uniform1f(u.uWave, R.wave*(1 - 0.6*z));
      gl.uniform1f(u.uFem, fem); gl.uniform1f(u.uZoom, z); gl.uniformMatrix3fv(u.uHeadY, false, rotY(hyaw)); gl.uniform1f(u.uHeadS, headS);
      gl.uniform1i(u.uPhoto, 1); gl.uniform1f(u.uPhotoA, photoA); gl.uniform1f(u.uPhotoM, photoMoy); gl.uniform1f(u.uRevele, revele);
      gl.uniform4f(u.uHairA, chev.quantite, chev.dessus, chev.cotes, chev.frange); gl.uniform4f(u.uHairB, chev.longueur, 1, 0, 0);
    };
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texPhoto);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texFace);
    gl.disable(gl.BLEND);
    gl.useProgram(progB); set(uB); gl.bindVertexArray(vaoB); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(progP); set(uP); gl.bindVertexArray(vaoP); gl.drawArrays(gl.POINTS, 0, nPart);
    gl.bindVertexArray(null);

    return Buste;
  }
  return { init, dessine, etat };
})();
window.Buste = Buste;
})();
