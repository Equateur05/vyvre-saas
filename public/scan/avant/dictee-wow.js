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
  var P={age:null,goals:[],univers:[],origine:[],marques:[]};
  var $=function(s){return document.getElementById(s);};
  var REDUIT=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* les quatre questions, dans la langue de la page (langues.js) */
  var L=window.VYL, Q=L.d.q;
  function liste(cle,ordre){ return ordre.map(function(v){ return [v, L.mot(cle,v)].concat(cle==='univers'&&L.EX[v]?[L.EX[v]]:[]); }); }
  var ETAPES=[
    {k:'goals', multi:true, max:3, t:Q[0][0], e:Q[0][1], av:Q[0][2], ap:Q[0][3], opt:liste('goals',['antiage','glow','hydration','redness','pores','pigmentation','sebum'])},
    {k:'age', multi:false, t:Q[1][0], e:Q[1][1], av:Q[1][2], ap:Q[1][3], opt:liste('age',['','u25','25','35','45','55'])},
    {k:'univers', multi:false, t:Q[2][0], e:Q[2][1], av:Q[2][2], ap:Q[2][3], opt:liste('univers',['','luxe','pharmacie','normal','petit-prix'])},
    {k:'origine', multi:false, t:Q[3][0], e:Q[3][1], av:Q[3][2], ap:Q[3][3], opt:[['',L.mot('pays','')]]}
  ];
  var dernier=null, n=0, ecrit='', bloque=false, api;
  function FX(nom){ var f=api&&api.fx&&api.fx[nom]; return f?f.apply(null,[].slice.call(arguments,1)):undefined; }

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
    if(et.multi){ var i=P[et.k].indexOf(v); if(i>=0) P[et.k].splice(i,1); else if(P[et.k].length<(et.max||3)) P[et.k].push(v); return; }
    P[et.k]= et.k==='age' ? (v||null) : (v?[v]:[]); }
  function choix(et){ return et.k==='age'?P.age:(et.multi?P[et.k]:(P[et.k][0]||'')); }
  /* combien de produits resteraient si on choisissait cette reponse */
  function simule(et,v){
    var c={age:P.age,goals:P.goals.slice(),univers:P.univers.slice(),origine:P.origine.slice(),marques:[]};
    if(et.k!=='age') c[et.k]=v?[v]:[];
    return VYQ.compte(c);
  }
  function motDe(et){
    var v=choix(et);
    if(et.multi){ var l=v.map(function(x){ var o=et.opt.filter(function(y){return y[0]===x;})[0]; return o?o[1]:x; }); return L.lie(l); }
    var o=et.opt.filter(function(x){return x[0]===v;})[0];
    return o?o[1]:et.opt[0][1];
  }
  function opts(et){
    if(et.k==='age'||et.k==='goals') return et.opt;
    return et.opt.map(function(o){
      if(!o[0]) return [o[0],o[1]];
      var c=simule(et,o[0]);
      return c.produits?[o[0],o[1],L.mais(c.marques)+' · '+L.fmt(c.produits)+' '+L.t('prod'),c.produits]:null;
    }).filter(Boolean);
  }
  function ambiance(k){
    document.body.setAttribute('data-etape', k);
    if(!$('halo')){ var h=document.createElement('div'); h.id='halo'; document.body.appendChild(h); }
  }
  function poser(){
    var et=ETAPES[n];
    ambiance(n); FX('etape', n, ETAPES.length);
    $('boite').classList.remove('vue');
    if($('ret')) $('ret').style.visibility=n?'visible':'hidden';
    couler(et.av, false, function(){
      $('qt').textContent=et.t; if($('qe')) $('qe').textContent=et.multi?L.t('trois'):et.e;
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
    var et=ETAPES[n]; n++;
    if(et.multi && $('suite')){ $('suite').classList.remove('vue'); $('ok').onclick=null; }
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
    [].slice.call($('rep').querySelectorAll('[data-v]')).forEach(function(b){
      b.setAttribute('aria-pressed',String(et.multi?v.indexOf(b.dataset.v)>=0:b.dataset.v===v));
    });
    /* plusieurs choix : « Continuer · 2 / 3 » apparait des le premier */
    if(et.multi && $('suite')){
      $('suite').classList.toggle('vue', v.length>0);
      $('ok').textContent=L.t('continuer')+' · '+v.length+' / '+(et.max||3);
      $('ok').onclick=function(){ if(!bloque && choix(ETAPES[n]).length) { bloque=true; var d=dernier; FX('choisi', d, ETAPES[n]); setTimeout(function(){ valider(d); }, REDUIT?120:260); } };
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
      if(et.multi){
        /* jusqu'a 3 reponses : chaque clic ajoute ou retire ; au 3e, on avance tout seul */
        poserValeur(et,v); dernier=b; peindre();
        if(choix(et).length>=(et.max||3)){ bloque=true; FX('choisi', b, et); setTimeout(function(){ valider(b); }, REDUIT?200:420); }
        return;
      }
      bloque=true; /* un seul choix par question, meme en double-clic */
      poserValeur(et,v); peindre(); FX('choisi', b, et);
      setTimeout(function(){ valider(b); }, REDUIT?200:260);
      return;
    }
    var m=e.target.closest('.rep-mot');
    if(m){ var k=+m.dataset.e; n=k; ecrit=ecrit.slice(0, ecrit.indexOf(ETAPES[k].av));
      var cad=$('texte').parentNode; cad.classList.remove('ouvert');
      $('suite').classList.remove('vue'); $('ok').onclick=null; FX('retour'); poser(); return; }
    if(e.target.id==='ret'&&n){ n--; var et2=ETAPES[n];
      ecrit=ecrit.slice(0, ecrit.lastIndexOf(et2.av));
      var cad2=$('texte').parentNode; cad2.classList.remove('ouvert');
      $('suite').classList.remove('vue'); $('ok').onclick=null; FX('retour'); poser();
    }
  });
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
