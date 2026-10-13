/* Moteur de la propale G WOW : copie de dictee.js (qui reste intacte pour les autres propales),
   avec des points d'accroche pour la mise en scene (VYD.fx) :
   fx.etape(n,total)            chaque nouvelle question (progression)
   fx.poser(n,et)               les reponses viennent d'etre posees
   fx.choisi(bouton,et)         le clic, avant l'envol
   fx.vol(bouton,cible,duree)   le mot quitte la colonne et vole jusqu'a sa place dans la phrase
   fx.compter(el)               un compteur vient de changer (les nombres roulent)
   fx.fin(compte)               le perimetre est pret
   fx.lancer(compte)            « Lancer mon scan »
   Le deroule, les comptes reels et le filtrage des reponses a 0 produit sont ceux de dictee.js. */
window.VYD=(function(){
  var P={age:null,goals:[],univers:[],origine:[],marques:[],pourqui:'',budget:[]};
  var $=function(s){return document.getElementById(s);};
  var REDUIT=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* les quatre questions, dans la langue de la page (langues.js) */
  var L=window.VYL, Q=L.d.q, X=L.x;
  function liste(cle,ordre){ return ordre.map(function(v){ return [v, L.mot(cle,v)].concat(cle==='univers'&&L.EX[v]?[L.EX[v]]:[]); }); }
  var ETAPES=[
    {k:'goals', multi:true, max:3, t:Q[0][0], e:Q[0][1], av:Q[0][2], ap:Q[0][3], opt:liste('goals',['antiage','glow','hydration','redness','pores','acne','pigmentation','sebum','yeux'])},   /* 11/10 : « Boutons, acné » */
    {k:'age', multi:false, t:Q[1][0], e:Q[1][1], av:Q[1][2], ap:Q[1][3], opt:liste('age',['','u25','25','35','45','55'])},
    {k:'univers', multi:false, t:Q[2][0], e:Q[2][1], av:Q[2][2], ap:Q[2][3], opt:liste('univers',['','luxe','pharmacie','normal','petit-prix'])},
    {k:'origine', multi:false, t:Q[3][0], e:Q[3][1], av:Q[3][2], ap:Q[3][3], opt:[['',L.mot('pays','')]]},
    /* 13/10 (Charles) : pour qui, vos marques (cases a cocher, recherche, « toutes »), puis le budget */
    {k:'pourqui', multi:false, t:X.pq[0], e:X.pq[1], av:X.pq[2], ap:X.pq[3], opt:['','femme','homme'].map(function(v){ return [v, X.pourqui[v][0]]; }),
      lab:{'':X.pourqui[''][1], femme:X.pourqui.femme[1], homme:X.pourqui.homme[1]}},
    {k:'marques', liste:true, t:X.mq[0], e:X.mq[1], av:X.mq[2], ap:X.mq[3], opt:[]},
    {k:'budget', multi:true, max:3, t:X.bq[0], e:X.bq[1], av:X.bq[2], ap:X.bq[3], opt:[['',X.budget[''][0]]], lab:{'':X.budget[''][1]}}
  ];
  /* les tranches du budget : celles du cerveau commun (vy-choix.js), dites dans la langue de la page */
  (function(){
    var T=(window.VyChoix&&VyChoix.TRANCHES&&VyChoix.TRANCHES.peau)||[], B=ETAPES[6];
    T.forEach(function(t){
      var m=t[1]<=0?X.moins:(t[2]===Infinity?X.plus:X.entre), v={a:L.fmt(t[1]),b:L.fmt(t[2])};
      var f=function(x){ for(var y in v) x=x.split('{'+y+'}').join(v[y]); return x; };
      B.opt.push([t[0], f(m[0])]); B.lab[t[0]]=f(m[1]);
    });
  })();
  var dernier=null, n=0, ecrit='', bloque=false, api;
  function FX(nom){ var f=api&&api.fx&&api.fx[nom]; return f?f.apply(null,[].slice.call(arguments,1)):undefined; }
  /* 11/10 (Charles : « on n'est pas oblige de cocher plusieurs choix ») : apres chaque choix, la question passe seule
     a la suite en 2,5 s ; un nouveau choix relance le delai, tout decocher l'annule, Continuer reste cliquable.
     Petite jauge sur Continuer, sans animation si l'appareil demande moins de mouvement (le passage reste). */
  var COMPTE_MS=2500, compteT=null;
  function arreterCompte(){ clearTimeout(compteT); compteT=null; var ok=$('ok'); if(ok) ok.classList.remove('compte'); }
  function lancerCompte(){
    arreterCompte(); var ok=$('ok'), ici=n;
    if(ok){ ok.style.setProperty('--d',COMPTE_MS+'ms'); void ok.offsetWidth; ok.classList.add('compte'); }
    var partir=function(){
      if(n!==ici) return; var et=ETAPES[n]; if(!et||!et.multi||!choix(et).length) return;
      if(bloque){ compteT=setTimeout(partir,200); return; }
      compteT=null; bloque=true; var d=dernier; FX('choisi', d, et); setTimeout(function(){ valider(d); }, REDUIT?120:260);
    };
    compteT=setTimeout(partir,COMPTE_MS);
  }

  /* le texte coule : chaque lettre sort du flou en cascade (decal = attente de l'envol), le cadre defile vers le haut */
  function lettres(txt, base, decal){
    var k=0;
    if(L.lieParMot) return txt.split(/( )/).map(function(m){
      if(m===' '||!m) return m;
      return '<span class="mo"><span class="ch" style="animation-delay:'+((decal||0)+(base+(k++))*70)+'ms">'+m+'</span></span>';
    }).join('');
    if(L.cjk) return txt.split('').map(function(c){
      return '<span class="ch" style="animation-delay:'+((decal||0)+(base+(k++))*34)+'ms">'+c+'</span>';
    }).join('');
    return txt.split(/( )/).map(function(m){
      if(m===' ') return ' ';
      if(!m) return '';
      return '<span class="mo">'+m.split('').map(function(c){
        return '<span class="ch" style="animation-delay:'+((decal||0)+(base+(k++))*22)+'ms">'+c+'</span>';
      }).join('')+'</span>';
    }).join('');
  }
  /* renvoie le decalage vertical final du texte dans son cadre */
  function defiler(){
    var t=$('texte'), c=t.parentNode; if(!c||!c.classList.contains('cadre')) return 0;
    if(c.classList.contains('ouvert')){ c.style.height=''; return 0; }
    var lh=parseFloat(getComputedStyle(t).lineHeight)||40;
    c.style.height=(5*lh)+'px';
    var trop=t.scrollHeight-5*lh;
    c.classList.toggle('defile', trop>2);
    t.style.transform='translateY('+(-Math.max(0,trop))+'px)';
    return -Math.max(0,trop);
  }
  /* ou atterrira la premiere lettre du mot neuf, une fois le defilement termine (coordonnees de la page) */
  function cibleDe(t, ty){
    var ch=t.querySelector('b.neuf .ch'); if(!ch) return null;
    var avant=getComputedStyle(t).transform;
    t.style.transition='none'; t.style.transform='translateY('+ty+'px)';
    var r=ch.getBoundingClientRect(), cs=getComputedStyle(t);
    t.style.transform=avant==='none'?'':avant; void t.offsetWidth;
    t.style.transition=''; t.style.transform='translateY('+ty+'px)';
    return {x:r.left+scrollX, y:r.top+scrollY, h:r.height, fs:parseFloat(cs.fontSize), fw:cs.fontWeight};
  }
  function couler(txt, mot, fin, decal){
    bloque=true; decal=decal||0;
    var t=$('texte'), anim=mot?'<b class="neuf">'+lettres(txt,0,decal)+'</b>':lettres(txt,0,0);
    t.innerHTML=ecrit+anim+'<span class="cur"></span>';
    ecrit+=mot?'<b data-e="'+(n-1)+'">'+txt+'</b>':txt;
    var ty=defiler(), cible=mot?cibleDe(t,ty):null;
    setTimeout(function(){
      /* une fois sorti du flou, le mot passe a sa matiere : degrade vivant, trait lumineux */
      if(mot){ t.innerHTML=ecrit+'<span class="cur"></span>'; var d=t.querySelector('b[data-e="'+(n-1)+'"]'); if(d) d.classList.add('arrive'); }
      bloque=false; if(fin) fin();
    }, decal+txt.length*22+(mot?480:260));
    return cible;
  }
  function poserValeur(et,v){
    if(et.multi && !v){ P[et.k]=[]; return; }
    if(et.multi){ var i=P[et.k].indexOf(v); if(i>=0) P[et.k].splice(i,1); else if(P[et.k].length<(et.max||3)) P[et.k].push(v); return; }
    if(et.k==='pourqui'){ P.pourqui=v||''; return; }
    P[et.k]= et.k==='age' ? (v||null) : (v?[v]:[]); }
  function choix(et){ if(et.k==='pourqui') return P.pourqui||''; if(et.k==='marques') return P.marques; return et.k==='age'?P.age:(et.multi?P[et.k]:(P[et.k][0]||'')); }
  /* combien de produits resteraient si on choisissait cette reponse */
  function simule(et,v){
    var c=copie();
    if(et.k==='pourqui') c.pourqui=v||'';
    else if(et.k!=='age') c[et.k]=v?[v]:[];
    return VYQ.compte(c);
  }
  function copie(){ return {age:P.age,goals:P.goals.slice(),univers:P.univers.slice(),origine:P.origine.slice(),marques:P.marques.slice(),pourqui:P.pourqui,budget:P.budget.slice()}; }
  /* les marques dans la phrase : « parmi La Roche-Posay et Avène », au-dela de trois « et 2 autres » */
  function motMarques(){
    if(!P.marques.length) return X.tm[0];
    var l=P.marques.map(function(s){ return VYQ.nom(s); });
    if(l.length>3) l=l.slice(0,3).concat([L.xt('autres',{n:L.fmt(l.length-3)})]);
    return L.xt('parmi',{l:L.lie(l)});
  }
  function motDe(et){
    if(et.k==='marques') return motMarques();
    var v=choix(et);
    if(et.multi && !v.length) return et.opt[0][1];
    if(et.multi){ var l=v.map(function(x){ var o=et.opt.filter(function(y){return y[0]===x;})[0]; return o?o[1]:x; }); return L.lie(l); }
    var o=et.opt.filter(function(x){return x[0]===v;})[0];
    return o?o[1]:et.opt[0][1];
  }
  function opts(et){
    if(et.k==='age'||et.k==='goals') return et.opt;
    return et.opt.map(function(o){
      if(!o[0]) return [o[0],o[1]];
      var c=simule(et,o[0]);
      if(et.k==='pourqui' && o[0]==='homme'){ var h=VYQ.hommes(copie()); return [o[0],o[1],h?L.xt('hn',{n:L.fmt(h)}):'',c.produits]; }
      return c.produits?[o[0],o[1],L.mais(c.marques)+' · '+L.fmt(c.produits)+' '+L.t('prod'),c.produits]:null;
    }).filter(Boolean);
  }
  function ambiance(k){
    document.body.setAttribute('data-etape', k);
    if(!$('halo')){ var h=document.createElement('div'); h.id='halo'; document.body.appendChild(h); }
  }
  function poser(){
    arreterCompte();
    var et=ETAPES[n];
    ambiance(n); FX('etape', n, ETAPES.length);
    $('boite').classList.remove('vue');
    if($('ret')) $('ret').style.visibility=n?'visible':'hidden';
    /* 13/10 : un repere invisible au debut de chaque question ; revenir ou toucher un mot coupe la phrase ici
       (avant : au premier av identique, faux des que deux questions commencent pareil) */
    ecrit+='<i class="qm" data-q="'+n+'"></i>';
    couler(et.av, false, function(){
      $('qt').textContent=et.t; if($('qe')) $('qe').textContent=et.multi?(et.k==='goals'?L.t('trois'):et.e+' · '+L.t('trois')):et.e;
      if(et.liste){ poserMarques(); FX('poser', n, et); return; }
      if($('pts')) $('pts').innerHTML=ETAPES.map(function(_,i){return '<i class="'+(i<n?'on':i===n?'on ici':'')+'"></i>';}).join('');
      var r=$('rep'); r.innerHTML=''; r.className='rep';
      /* les reponses sont comptees dans le contexte deja choisi : on n'affiche jamais une porte qui ne mene nulle part */
      opts(et).forEach(function(o){ r.insertAdjacentHTML('beforeend', api.option(o,et)); });
      [].slice.call(r.children).forEach(function(x,i){ x.classList.add('monte'); x.style.animationDelay=(i*55)+'ms'; x.style.setProperty('--k',i); });
      peindre(); $('boite').classList.add('vue');
      FX('poser', n, et);
    });
  }
  function valider(b){
    arreterCompte();
    var et=ETAPES[n]; n++;
    if((et.multi||et.liste) && $('suite')){ $('suite').classList.remove('vue'); $('ok').onclick=null; }
    var duree=(!REDUIT && api.fx && api.fx.vol && b)?720:0;
    var cible=couler(motDe(et), true, function(){
      if(et.ap){ ecrit+=et.ap; $('texte').innerHTML=ecrit; }
      setTimeout(n<ETAPES.length?poser:fin, 160);
    }, duree);
    if(duree) FX('vol', b, cible, duree, et);
    $('boite').classList.remove('vue');
  }
  function fin(){
    /* chaque mot choisi redevient touchable : on reprend la question sans tout refaire */
    $('texte').innerHTML=ecrit.replace(/<b data-e/g,'<b class="rep-mot" data-e');
    ambiance('fin'); FX('etape', ETAPES.length, ETAPES.length);
    var cad=$('texte').parentNode; if(cad.classList.contains('cadre')){ cad.classList.add('ouvert'); $('texte').style.transform='none'; }
    var c=VYQ.compte(P);
    $('qt').textContent=L.t('perim'); if($('qe')) $('qe').textContent='';
    if($('pts')) $('pts').innerHTML=ETAPES.map(function(){return '<i class="on"></i>';}).join('');
    $('rep').className='rep';
    $('rep').innerHTML='<div class="bilan">'+L.t('bilan',{p:'<b>'+L.fmt(c.produits)+'</b>',m:'<b>'+L.mais(c.marques)+'</b>',r:L.retenue(c.marques)})+'</div>';
    $('suite').classList.add('vue'); $('ok').textContent=L.t('lancer'); if($('cpt')) $('cpt').innerHTML=L.t('toucher');
    $('ok').onclick=function(){ if(api.fx&&api.fx.lancer) FX('lancer', c); else void 0; };
    $('boite').classList.add('vue');
    if($('bas')){ $('bas').innerHTML=L.t('pret',{p:'<b class="n" data-n="'+c.produits+'">'+L.fmt(c.produits)+'</b>'}); FX('compter',$('bas')); }
    FX('fin', c, P);
  }
  function peindre(){
    var et=ETAPES[n], v=choix(et);
    if(et.liste){ peindreMarques(); dire(); return; }
    [].slice.call($('rep').querySelectorAll('[data-v]')).forEach(function(b){
      b.setAttribute('aria-pressed',String(et.multi?v.indexOf(b.dataset.v)>=0:b.dataset.v===v));
    });
    /* plusieurs choix : « Continuer · 2 / 3 » apparait des le premier */
    if(et.multi && $('suite')){
      $('suite').classList.toggle('vue', v.length>0);
      var enCours=$('ok').classList.contains('compte');
      $('ok').textContent=L.t('continuer')+' · '+v.length+' / '+(et.max||3);
      $('ok').insertAdjacentHTML('beforeend','<i class="vy-jauge" aria-hidden="true"></i>');
      if(enCours && !v.length) arreterCompte();
      $('ok').onclick=function(){ if(!bloque && choix(ETAPES[n]).length) { arreterCompte(); bloque=true; var d=dernier; FX('choisi', d, ETAPES[n]); setTimeout(function(){ valider(d); }, REDUIT?120:260); } };
    }
    dire();
  }
  function nb(k){ return '<b class="n" data-n="'+k+'">'+L.fmt(k)+'</b>'; }
  function dire(txt){
    var c=VYQ.compte(P), el=$('bas'); if(!el) return;
    el.innerHTML= txt || L.t('question',{n:Math.min(n+1,ETAPES.length),t:ETAPES.length,p:nb(c.produits)});
    FX('compter', el);
  }
  /* au survol, la reponse s'essaie deja dans la phrase, en fantome */
  function fantome(txt){
    if(bloque||n>=ETAPES.length) return;
    $('texte').innerHTML=ecrit+(txt?'<span class="fantome">'+txt+'</span>':'')+'<span class="cur"></span>'; defiler();
  }
  document.addEventListener('mouseover',function(e){
    var b=e.target.closest('#rep [data-v]'); if(!b||n>=ETAPES.length||bloque) return;
    var et=ETAPES[n], o=et.opt.filter(function(x){return x[0]===b.dataset.v;})[0];
    if(o){ if(et.multi){ var sel=choix(et).filter(function(x){return x!==o[0];}).map(function(x){ var y=et.opt.filter(function(z){return z[0]===x;})[0]; return y?y[1]:x; }); fantome(L.lie(sel.concat([o[1]]))); } else fantome(o[1]); }
    if(et.k==='age'||et.k==='goals') return;
    var c=simule(et,b.dataset.v);
    dire(L.t('laisse',{p:nb(c.produits),m:L.mais(c.marques,nb)}));
  });
  document.addEventListener('mouseout',function(e){ if(!bloque&&e.target.closest('#rep [data-v]')){ dire(); fantome(''); } });
  document.addEventListener('click',function(e){
    if(bloque) return;
    var b=e.target.closest('#rep [data-v]');
    if(b){
      var et=ETAPES[n], v=b.dataset.v;
      if(et.multi && !v){
        /* « Tous les prix » : seul, et on avance */
        arreterCompte(); bloque=true; poserValeur(et,v); peindre(); FX('choisi', b, et);
        setTimeout(function(){ valider(b); }, REDUIT?200:260); return;
      }
      if(et.multi){
        /* jusqu'a 3 reponses : chaque clic ajoute ou retire ; au 3e, on avance tout seul */
        poserValeur(et,v); dernier=b; peindre();
        if(choix(et).length>=(et.max||3)){ arreterCompte(); bloque=true; FX('choisi', b, et); setTimeout(function(){ valider(b); }, REDUIT?200:420); }
        else if(choix(et).length) lancerCompte();
        else arreterCompte();
        return;
      }
      bloque=true; /* un seul choix par question, meme en double-clic */
      poserValeur(et,v); peindre(); FX('choisi', b, et);
      setTimeout(function(){ valider(b); }, REDUIT?200:260);
      return;
    }
    var m=e.target.closest('.rep-mot');
    if(m){ var k=+m.dataset.e; n=k; ecrit=couper(k);
      var cad=$('texte').parentNode; cad.classList.remove('ouvert');
      $('suite').classList.remove('vue'); $('ok').onclick=null; FX('retour'); poser(); return; }
    if(e.target.id==='ret'&&n){ n--;
      ecrit=couper(n);
      var cad2=$('texte').parentNode; cad2.classList.remove('ouvert');
      $('suite').classList.remove('vue'); $('ok').onclick=null; FX('retour'); poser();
    }
  });
  function couper(k){ var i=ecrit.indexOf('<i class="qm" data-q="'+k+'"></i>'); return i>=0?ecrit.slice(0,i):ecrit; }
  /* ---------- 13/10 : « Vos marques » ----------
     Toutes les marques du catalogue, par ordre alphabetique, avec leur nombre de produits dans le perimetre deja
     choisi (pour qui, famille, pays). Une marque a 0 produit dans ce perimetre reste visible mais ne se coche pas :
     on le dit, et on propose d'elargir (tous pays, tous univers). On valide soi-meme (pas de passage automatique). */
  var sansAccent=function(x){ return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); };
  function esc(x){ return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function poserMarques(){
    var r=$('rep'), cpt=VYQ.parMarque(copie()), M={}, tout=VYQ.parMarque({});
    /* seulement les maisons qui ont des produits en ligne dans le catalogue */
    Object.keys(VYQ.marques()).forEach(function(s){ if(tout[s]>0) M[s]=1; });
    /* une marque cochee qui sort du perimetre (apres un retour en arriere) n'est plus gardee */
    P.marques=P.marques.filter(function(s){ return cpt[s]>0; });
    var tri=function(a,b){ return sansAccent(VYQ.nom(a))<sansAccent(VYQ.nom(b))?-1:1; };
    var dans=Object.keys(M).filter(function(s){ return cpt[s]>0; }).sort(tri);
    var hors=Object.keys(M).filter(function(s){ return !(cpt[s]>0); }).sort(tri);
    var tot=VYQ.compte(Object.assign(copie(),{marques:[]}));
    var ligne=function(s,on){ return '<label class="mq-l'+(on?'':' off')+'" data-nom="'+esc(sansAccent(VYQ.nom(s)))+'"><input type="checkbox" value="'+esc(s)+'"'+(on?'':' disabled')+(P.marques.indexOf(s)>=0?' checked':'')+'>'+
      '<s class="mq-b" aria-hidden="true"></s><span class="mq-n">'+esc(VYQ.nom(s))+'</span><i class="mq-c">'+L.fmt(cpt[s]||0)+'</i></label>'; };
    r.className='rep rep-marques';
    r.innerHTML='<div class="mq-panel">'+
      '<div class="mq-haut"><input type="search" class="mq-cherche" id="mq-cherche" autocomplete="off" placeholder="'+esc(L.xt('cherche'))+'" aria-label="'+esc(L.xt('cherche'))+'">'+
      '<button type="button" class="mq-toutes" id="mq-toutes">'+esc(X.tm[1])+'<i>'+L.fmt(tot.produits)+'</i></button></div>'+
      '<div class="mq-liste" id="mq-liste" role="group" aria-label="'+esc(X.mq[0])+'">'+dans.map(function(s){ return ligne(s,true); }).join('')+
      (hors.length?'<div class="mq-hors"><span>'+esc(L.xt('hors'))+'</span><button type="button" class="mq-elargir" id="mq-elargir">'+esc(L.xt('elargir'))+'</button></div>'+hors.map(function(s){ return ligne(s,false); }).join(''):'')+
      '<p class="mq-vide" id="mq-vide" hidden>'+esc(L.xt('aucune'))+'</p></div></div>';
    $('mq-liste').addEventListener('change',function(e){
      var c=e.target; if(!c||c.type!=='checkbox'||c.disabled) return;
      var i=P.marques.indexOf(c.value); if(c.checked&&i<0) P.marques.push(c.value); if(!c.checked&&i>=0) P.marques.splice(i,1);
      peindreMarques(); dire();
    });
    $('mq-cherche').addEventListener('input',function(){
      var q=sansAccent(this.value.trim()), vus=0;
      [].forEach.call(r.querySelectorAll('.mq-l'),function(l){ var ok=!q||l.dataset.nom.indexOf(q)>=0; l.hidden=!ok; if(ok) vus++; });
      var h=r.querySelector('.mq-hors'); if(h) h.hidden=!!q;
      $('mq-vide').hidden=vus>0;
    });
    $('mq-toutes').onclick=function(){ P.marques=[]; [].forEach.call(r.querySelectorAll('.mq-l input'),function(c){ c.checked=false; }); peindreMarques(); dire(); };
    if($('mq-elargir')) $('mq-elargir').onclick=elargir;
    peindreMarques(); $('boite').classList.add('vue'); dire();
  }
  /* « Elargir » : pays et univers repassent a « tous », la phrase le dit, la liste se recompte */
  function elargir(){
    P.univers=[]; P.origine=[];
    ETAPES.forEach(function(et,i){ if(et.k!=='univers'&&et.k!=='origine') return;
      ecrit=ecrit.replace(new RegExp('(<b data-e="'+i+'">)[^<]*(</b>)'),'$1'+et.opt[0][1]+'$2'); });
    $('texte').innerHTML=ecrit+'<span class="cur"></span>'; defiler();
    poserMarques();
  }
  function peindreMarques(){
    var ok=$('ok'), k=P.marques.length;
    if($('mq-toutes')) $('mq-toutes').setAttribute('aria-pressed',String(!k));
    $('suite').classList.add('vue');
    ok.textContent=L.xt('valider')+(k?' · '+L.xt('nsel',{n:L.fmt(k)}):' · '+X.tm[1]);
    ok.onclick=function(){ if(bloque) return; arreterCompte(); bloque=true; setTimeout(function(){ valider(null); }, REDUIT?60:160); };
  }
  api={
    P:P, etapes:ETAPES, fx:{}, reduit:REDUIT,
    option:function(o){ return '<button class="vy-chip" type="button" data-v="'+o[0]+'">'+o[1].charAt(0).toUpperCase()+o[1].slice(1)+(o[2]?'<i>'+o[2]+'</i>':'')+'</button>'; },
    demarrer:function(rendu){
      if(rendu) api.option=rendu;
      var t=$('texte'); if(t && !t.parentNode.classList.contains('cadre')){
        var c=document.createElement('div'); c.className='cadre'; t.parentNode.insertBefore(c,t); c.appendChild(t);
      }
      VYQ.pret(function(){
        ETAPES[3].opt=[['',L.mot('pays','')]].concat(VYQ.origines().map(function(o){
          return [o.v, L.mot('pays',o.v), L.mais(o.maisons)];
        }));
        var tt=VYQ.compte({}); if($('tete')){ $('tete').innerHTML=L.t('tete',{p:nb(tt.produits),m:L.mais(tt.marques,nb)}); FX('compter',$('tete'),true); }
        poser();
      });
    }
  };
  return api;
})();
