/* G — LA COLONNE · WOW : la mise en scene, branchee sur les accroches de dictee-wow.js (VYD.fx).
   Lumiere qui suit la souris, magnetisme, envol du mot jusque dans la phrase, poussiere d'or,
   onde dans la fumee, compteurs qui roulent, finale, micro-sons (coupes par defaut). Aucune bibliotheque. */
window.VYW=(function(){
  var D=window.VYD, F=window.VYF||{onde:function(){},pouls:function(){}};
  var R=D.reduit, body=document.body, $=function(s){return document.getElementById(s);};
  var C={g1:'#f6d27a',g2:'#fff3cf',g3:'#4de6dc',g4:'#18c6d8'};
  var fin=null; /* le compte du perimetre une fois pret */

  /* ================= poussiere d'or (canvas 2D, additif, ne tourne que s'il y a des grains) ================= */
  var cv=document.createElement('canvas'); cv.id='poussiere'; body.appendChild(cv);
  var cx=cv.getContext('2d'), dpr=Math.min(devicePixelRatio||1,2), W=0, H=0, grains=[], tourne=false, dernier=0, sprites={};
  function taille(){ W=innerWidth; H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; cx.setTransform(dpr,0,0,dpr,0,0); }
  taille(); addEventListener('resize',taille);
  function sprite(col){
    var s=document.createElement('canvas'); s.width=s.height=64; var g=s.getContext('2d');
    var r=g.createRadialGradient(32,32,0,32,32,32);
    r.addColorStop(0,'rgba(255,255,255,1)'); r.addColorStop(.12,col); r.addColorStop(.35,col.replace(/^#(..)(..)(..)$/,function(_,a,b,c){return 'rgba('+parseInt(a,16)+','+parseInt(b,16)+','+parseInt(c,16)+',.35)';}));
    r.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=r; g.fillRect(0,0,64,64); return s;
  }
  function teinte(){
    var cs=getComputedStyle(body);
    ['g1','g2','g3','g4'].forEach(function(k){ var v=cs.getPropertyValue('--'+k).trim(); if(/^#[0-9a-f]{6}$/i.test(v)) C[k]=v; });
    sprites={g1:sprite(C.g1),g2:sprite(C.g2),g3:sprite(C.g3),g4:sprite(C.g4),w:sprite('#ffffff')};
  }
  teinte();
  var PALETTE=['g1','g1','g2','g3','g3','w','g4'];
  function grain(o){
    if(R||grains.length>520) return;
    grains.push({x:o.x,y:o.y,vx:o.vx||0,vy:o.vy||0,age:0,vie:o.vie||1.2,s:o.s||3,c:o.c||PALETTE[(Math.random()*PALETTE.length)|0],
      g:o.g==null?-10:o.g,fr:o.fr==null?.93:o.fr,cible:o.cible||null,k:o.k||0,tw:6+Math.random()*10,ph:Math.random()*6.3});
    if(!tourne){ tourne=true; dernier=performance.now(); requestAnimationFrame(boucle); }
  }
  function eclat(x,y,n,force,rayon){
    for(var i=0;i<n;i++){
      var a=Math.random()*6.283, v=(force||1)*(30+Math.random()*Math.random()*260), r0=Math.random()*(rayon||4);
      grain({x:x+Math.cos(a)*r0,y:y+Math.sin(a)*r0*.5,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.62-20,vie:.7+Math.random()*1.1,s:1.2+Math.random()*Math.random()*4.2});
    }
  }
  function boucle(now){
    var dt=Math.min(.05,(now-dernier)/1000); dernier=now;
    cx.clearRect(0,0,W,H); cx.globalCompositeOperation='lighter';
    for(var i=grains.length-1;i>=0;i--){
      var p=grains[i]; p.age+=dt;
      if(p.cible){
        var dx=p.cible.x-p.x, dy=p.cible.y-p.y, d=Math.hypot(dx,dy);
        var k=p.k*(.4+p.age*2.2); p.vx+=dx*k*dt; p.vy+=dy*k*dt;
        if(d<16){ p.age=p.vie; if(p.cible.arrive) p.cible.arrive(); }
      }
      var f=Math.pow(p.fr,dt*60); p.vx*=f; p.vy*=f; p.vy+=p.g*dt;
      p.x+=p.vx*dt; p.y+=p.vy*dt;
      if(p.age>=p.vie){ grains.splice(i,1); continue; }
      var t=p.age/p.vie, a=(t<.12?t/.12:1)*Math.pow(1-t,1.4)*(.65+.35*Math.sin(p.age*p.tw+p.ph)), s=p.s*3.2*(1-t*.35);
      cx.globalAlpha=a; cx.drawImage(sprites[p.c],p.x-s,p.y-s,s*2,s*2);
    }
    cx.globalAlpha=1;
    if(grains.length) requestAnimationFrame(boucle); else { tourne=false; cx.clearRect(0,0,W,H); }
  }

  /* ================= micro-sons (Web Audio, coupes par defaut) ================= */
  var S={on:false,ctx:null,sec:null,hum:null,dernier:0};
  function audio(){
    if(S.ctx) return S.ctx;
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
    var a=new AC(), comp=a.createDynamicsCompressor(), m=a.createGain(); m.gain.value=.55;
    comp.threshold.value=-18; comp.ratio.value=3; comp.connect(m); m.connect(a.destination);
    /* une petite salle : reponse impulsionnelle de bruit qui decroit */
    var len=a.sampleRate*2.4, ir=a.createBuffer(2,len,a.sampleRate);
    for(var ch=0;ch<2;ch++){ var d=ir.getChannelData(ch); for(var i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
    var cvl=a.createConvolver(); cvl.buffer=ir; var wet=a.createGain(); wet.gain.value=.34; cvl.connect(wet); wet.connect(comp);
    S.ctx=a; S.sec=comp; S.hum=cvl; return a;
  }
  function cloche(f,quand,duree,vol){
    var a=S.ctx, t=a.currentTime+(quand||0);
    [[1,1],[2.76,.28],[5.4,.08]].forEach(function(p){
      var o=a.createOscillator(), g=a.createGain(); o.type='sine'; o.frequency.value=f*p[0];
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol*p[1],t+.006); g.gain.exponentialRampToValueAtTime(.0001,t+duree/(p[0]>1?p[0]*.6:1));
      o.connect(g); g.connect(S.sec); g.connect(S.hum); o.start(t); o.stop(t+duree+.1);
    });
  }
  function souffle(duree,vol){
    var a=S.ctx, t=a.currentTime, n=a.sampleRate*duree, b=a.createBuffer(1,n,a.sampleRate), d=b.getChannelData(0);
    for(var i=0;i<n;i++) d[i]=Math.random()*2-1;
    var s=a.createBufferSource(), bp=a.createBiquadFilter(), g=a.createGain(); s.buffer=b; bp.type='bandpass'; bp.Q.value=1.4;
    bp.frequency.setValueAtTime(380,t); bp.frequency.exponentialRampToValueAtTime(4200,t+duree*.85);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+duree*.6); g.gain.exponentialRampToValueAtTime(.0001,t+duree);
    s.connect(bp); bp.connect(g); g.connect(S.sec); g.connect(S.hum); s.start(t); s.stop(t+duree);
  }
  var GAMME=[587.33,659.25,739.99,880,987.77];
  function son(q,i){
    if(!S.on||!S.ctx) return;
    if(q==='survol'){ var n=performance.now(); if(n-S.dernier<90) return; S.dernier=n; cloche(GAMME[(i||0)%5]*2,0,.35,.018); }
    if(q==='choix') cloche(GAMME[Math.min(i||0,4)],0,1.6,.07);
    if(q==='pose'){ [1760,2217.46,2637.02].forEach(function(f,k){ cloche(f,k*.05,.8,.022); }); cloche(GAMME[Math.min(i||0,4)]/2,0,2.2,.045); }
    if(q==='fin') [293.66,440,554.37,659.25,739.99,880,1108.73].forEach(function(f,k){ cloche(f,k*.085,3.4,.055); });
    if(q==='lance'){ souffle(1.1,.06); cloche(146.83,.05,3,.07); cloche(1174.66,.35,2.4,.03); }
  }
  $('son').addEventListener('click',function(){
    S.on=!S.on; this.setAttribute('aria-pressed',String(S.on)); this.innerHTML=VYL.t('son')+' <b>'+VYL.t(S.on?'on':'off')+'</b>';
    if(S.on){ var a=audio(); if(a&&a.resume) a.resume(); setTimeout(function(){ son('choix',2); },30); }
  });

  /* ================= lumiere qui suit la souris + magnetisme ================= */
  var fin_=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var actif=null, mag=new Map(), magTourne=false;
  function rep(){ return $('rep'); }
  function poseActif(li){
    if(actif===li) return;
    if(actif){ actif.classList.remove('actif'); cibleMag(actif,0,0); }
    actif=li;
    if(li){ li.classList.add('actif'); son('survol',[].indexOf.call(li.parentNode.children,li)); }
    rep().classList.toggle('survol',!!li);
  }
  function cibleMag(li,x,y){
    var m=mag.get(li)||{x:0,y:0,tx:0,ty:0}; m.tx=x; m.ty=y; mag.set(li,m);
    if(!magTourne&&!R){ magTourne=true; requestAnimationFrame(magBoucle); }
  }
  function magBoucle(){
    var vivant=false;
    mag.forEach(function(m,li){
      m.x+=(m.tx-m.x)*.16; m.y+=(m.ty-m.y)*.16;
      var lt=li.querySelector('.lt'); if(lt){ lt.style.setProperty('--tx',m.x.toFixed(2)+'px'); lt.style.setProperty('--ty',m.y.toFixed(2)+'px'); }
      if(Math.abs(m.tx-m.x)>.05||Math.abs(m.ty-m.y)>.05) vivant=true; else if(!m.tx&&!m.ty){ mag.delete(li); }
    });
    if(vivant) requestAnimationFrame(magBoucle); else magTourne=false;
  }
  document.addEventListener('pointermove',function(e){
    var r=rep(); if(!r||r.classList.contains('sortie')) return;
    var li=e.target.closest&&e.target.closest('#rep .li');
    if(!li){ if(actif) poseActif(null); return; }
    var b=li.getBoundingClientRect(), rb=r.getBoundingClientRect(), x=e.clientX-b.left, y=e.clientY-b.top;
    li.style.setProperty('--mx',x+'px'); li.style.setProperty('--my',y+'px');
    r.style.setProperty('--cx',(e.clientX-rb.left)+'px'); r.style.setProperty('--cy',(e.clientY-rb.top)+'px');
    poseActif(li);
    if(fin_) cibleMag(li,Math.max(-12,Math.min(12,(x-b.width*.35)*.045)),Math.max(-4,Math.min(4,(y-b.height/2)*.2)));
  },{passive:true});
  document.addEventListener('pointerleave',function(){ if(actif) poseActif(null); });
  document.addEventListener('focusin',function(e){ var li=e.target.closest&&e.target.closest('#rep .li'); if(li) poseActif(li); });

  /* ================= les nombres roulent ================= */
  function ease(t){ return 1-Math.pow(1-t,3); }
  function rouler(b,de,a,duree){
    if(R||de===a){ b.textContent=VYQ.fmt(a); return; }
    var t0=performance.now(); b._rid=(b._rid||0)+1; var id=b._rid;
    (function pas(n){ if(b._rid!==id) return; var t=Math.min(1,(n-t0)/duree); b.textContent=VYQ.fmt(Math.round(de+(a-de)*ease(t))); if(t<1) requestAnimationFrame(pas); })(t0);
  }
  function compter(el,depuisZero){
    var v=el._v||[], nv=[];
    [].forEach.call(el.querySelectorAll('.n[data-n]'),function(b,i){
      var a=+b.dataset.n, de=depuisZero?0:(v[i]!=null?v[i]:0); nv[i]=a; rouler(b,de,a,depuisZero?1600:650);
    });
    el._v=nv;
  }

  /* ================= la question : les lettres du titre se posent ================= */
  function lettresTitre(){
    var q=$('qt'), t=q.textContent; if(R||(window.VYL&&VYL.lieParMot)) return; /* l'arabe ne se decoupe pas en lettres */
    var L=Math.max(1,t.length-1); q.classList.add('lettres');
    /* chaque lettre porte sa part du degrade (un degrade clippe ne traverse pas des lettres animees) */
    q.innerHTML=t.split('').map(function(c,i){ return c===' '?' ':'<span class="l" style="animation-delay:'+(i*18)+'ms;color:color-mix(in srgb,var(--g1) '+Math.round(100-i/L*85)+'%,var(--g3))">'+c+'</span>'; }).join('');
  }

  /* ================= l'envol du mot ================= */
  function courbe(t){ return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
  function vol(b,cible,duree,et){
    var lt=b.querySelector('.lt'); if(!lt||!cible){ return; }
    var r=lt.getBoundingClientRect(), cs=getComputedStyle(lt), fs=parseFloat(cs.fontSize), lhS=parseFloat(getComputedStyle(b).lineHeight)/fs||1.18;
    var texte=$('texte'), tcs=getComputedStyle(texte), L=parseFloat(tcs.lineHeight)/parseFloat(tcs.fontSize)||1.46;
    var k=cible.fs/fs;
    var el=document.createElement('div'); el.className='vol';
    el.style.font=cs.fontWeight+' '+fs+'px/'+L+' '+cs.fontFamily;
    var la=document.createElement('span'); la.className='a'; la.textContent=lt.textContent;
    var lb=document.createElement('span'); lb.className='b'; lb.textContent=texte.querySelector('b.neuf')?texte.querySelector('b.neuf').textContent:lt.textContent.toLowerCase();
    lb.style.fontWeight='400';
    el.appendChild(la); el.appendChild(lb); body.appendChild(el);
    b.classList.add('envole');
    var S0={x:r.left+scrollX, y:r.top+scrollY-(L-lhS)*fs/2}, E={x:cible.x, y:cible.y};
    /* un arc : le point de controle est souleve perpendiculairement au trajet, toujours vers le haut */
    var dx=E.x-S0.x, dy=E.y-S0.y, dist=Math.hypot(dx,dy)||1, nx=-dy/dist, ny=dx/dist; if(ny>0){ nx=-nx; ny=-ny; }
    var Cc={x:(S0.x+E.x)/2+nx*dist*.28, y:(S0.y+E.y)/2+ny*dist*.28};
    var wB=lb.getBoundingClientRect().width||la.getBoundingClientRect().width;
    /* sur telephone, la phrase est en haut : on y remonte pendant le vol */
    if(scrollY>40) try{ scrollTo({top:0,behavior:'smooth'}); }catch(e){ scrollTo(0,0); }
    var t0=performance.now(), total=duree+240, pose=false, emis=0;
    F.pouls(.5);
    (function pas(now){
      var u=Math.min(1,(now-t0)/duree), e=courbe(u), iu=1-e;
      var x=iu*iu*S0.x+2*iu*e*Cc.x+e*e*E.x, y=iu*iu*S0.y+2*iu*e*Cc.y+e*e*E.y, s=1+(k-1)*e;
      var tt=(now-t0)/total, op=u<1?1:Math.max(0,1-((now-t0)-duree)/240);
      el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) scale('+s.toFixed(4)+')';
      el.style.opacity=op;
      var m=Math.max(0,Math.min(1,(u-.32)/.2)); la.style.opacity=1-m; lb.style.opacity=m;
      /* une traine de poussiere derriere le mot */
      if(u<1){ var n=u<.9?2:1; for(var i=0;i<n;i++){ emis++;
        grain({x:x-scrollX+Math.random()*wB*s*.9, y:y-scrollY+cible.fs*L*.5+(Math.random()-.5)*cible.fs*.6, vx:(Math.random()-.5)*30, vy:(Math.random()-.5)*30+8,
               vie:.5+Math.random()*.8, s:.8+Math.random()*1.8, g:6, fr:.9}); } }
      if(u>=1&&!pose){ pose=true;
        var px=E.x-scrollX+wB*k*.5, py=E.y-scrollY+cible.fs*L*.5;
        eclat(px,py,70,1.1,wB*k*.5); F.onde(px,py,1); F.pouls(.9); son('pose',D.etapes.indexOf(et));
      }
      if(tt<1) requestAnimationFrame(pas); else el.remove();
    })(t0);
  }

  /* ================= la finale ================= */
  function finale(c){
    fin=c;
    var r=$('rep');
    r.innerHTML='<div class="bilan-w"><div class="gros"><b class="n" data-n="'+c.produits+'">0</b></div>'+
      '<div class="sous">'+VYL.t('sous',{m:'<b>'+VYL.mais(c.marques)+'</b>',r:VYL.retenue(c.marques)})+'</div></div>';
    rouler(r.querySelector('.n'),0,c.produits,R?0:2000);
    if(R) return;
    [].forEach.call($('texte').querySelectorAll('b[data-e]'),function(w,i){ w.style.setProperty('--d',(.15+i*.2)+'s'); w.classList.add('flash'); });
    var tr=$('texte').getBoundingClientRect(); F.onde(tr.left+tr.width*.5,tr.top+tr.height*.5,1.2); F.pouls(1);
    son('fin');
    /* chaque mot de la phrase lache sa poussiere, qui converge vers le bouton */
    setTimeout(function(){
      var ok=$('ok').getBoundingClientRect(), cible={x:ok.left+ok.width/2,y:ok.top+ok.height/2}, arrive=false;
      cible.arrive=function(){ if(arrive) return; arrive=true;
        setTimeout(function(){ eclat(cible.x,cible.y,110,1.3,ok.width*.4); F.onde(cible.x,cible.y,1.3); F.pouls(1.1); son('pose',4); },120); };
      [].forEach.call($('texte').querySelectorAll('b[data-e]'),function(w){
        [].forEach.call(w.getClientRects(),function(q){
          for(var i=0;i<22;i++){ var a=Math.random()*6.283;
            grain({x:q.left+Math.random()*q.width,y:q.top+q.height*(.3+Math.random()*.5),vx:Math.cos(a)*80,vy:-40-Math.random()*90,
                   vie:1.8+Math.random()*.9,s:1+Math.random()*2.2,g:0,fr:.94,cible:cible,k:3.2+Math.random()*2}); }
        });
      });
    },650);
  }
  function lancer(c){
    var ok=$('ok').getBoundingClientRect(), x=ok.left+ok.width/2, y=ok.top+ok.height/2;
    son('lance');
    if(!R){ eclat(x,y,160,1.8,ok.width*.5); F.onde(x,y,1.6); F.pouls(1.4); }
    body.classList.add('part');
    var v=document.createElement('div'); v.className='voile';
    v.innerHTML='<p>'+VYL.t('demarre')+'</p><span>'+VYL.t('lancerP',{p:VYL.fmt(c.produits),m:VYL.mais(c.marques)})+'</span>';
    body.appendChild(v);
    setTimeout(function(){ v.classList.add('vue'); },R?0:700);
    /* production : on rend la main a /scan avec les reponses, le vrai scan demarre */
    setTimeout(function(){ if(window.vyAvantDire) vyAvantDire('lancer',{prefs:JSON.parse(JSON.stringify(window.VYD.P))}); }, R?150:1300);
  }

  /* ================= branchements ================= */
  D.fx={
    etape:function(n,total){ var p=$('prog'); if(!p) return; p.style.width=(n/total*100)+'%'; p.classList.toggle('va',n>0&&n<total); },
    poser:function(n,et){ actif=null; lettresTitre(); },
    choisi:function(b,et){
      var r=rep(); poseActif(b); b.classList.add('choisi'); r.classList.add('sortie'); r.classList.remove('survol');
      var q=b.getBoundingClientRect(); son('choix',D.etapes.indexOf(et));
      if(!R){ eclat(q.left+Math.min(q.width*.3,140),q.top+q.height/2,22,.6,20); F.pouls(.4); }
    },
    vol:vol,
    compter:compter,
    fin:finale,
    lancer:lancer,
    retour:function(){ F.pouls(.5); }
  };
  return {teinte:teinte, eclat:eclat, son:son};
})();
