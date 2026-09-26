/* Moteur commun des propales « une question a la fois » :
   la phrase s'ecrit toute seule, le conteneur en dessous pose la question,
   la reponse ecrit le mot suivant, jusqu'au scan.
   La page fournit : #texte #boite #qt #qe #pts #rep #suite #ok #cpt #bas #ret #tete
   et peut surcharger VYD.option(o, et) pour dessiner ses propres reponses. */
window.VYD=(function(){
  var P={age:null,goals:[],univers:[],origine:[],marques:[]};
  var $=function(s){return document.getElementById(s);};
  var ETAPES=[
    {k:'goals', multi:false, t:'Ce que vous cherchez', e:'la caméra mesurera le reste',
     av:'Cherchez-moi un soin ', ap:'',
     opt:[['antiage','anti-âge'],['glow','d’éclat'],['hydration','hydratant'],['redness','apaisant'],['pores','affinant les pores'],['pigmentation','anti-taches'],['sebum','matifiant']]},
    {k:'age', multi:false, t:'Votre âge', e:'une seule réponse',
     av:', pour une peau de ', ap:'',
     opt:[['','tout âge'],['u25','moins de 25 ans'],['25','25 à 34 ans'],['35','35 à 44 ans'],['45','45 à 54 ans'],['55','55 ans et plus']]},
    {k:'univers', multi:false, t:'La famille de maisons', e:'aucun prix ne sera affiché, ni ici ni dans vos résultats',
     av:', chez des maisons ', ap:'',
     opt:[['','de tous les univers'],['luxe','de luxe','Chanel, Dior, Sisley'],['pharmacie','de pharmacie','Vichy, La Roche-Posay'],['normal','du quotidien','Clarins, Kiehl’s, Aesop'],['petit-prix','à petit prix','The Ordinary, COSRX']]},
    {k:'origine', multi:false, t:'Le pays d’origine', e:'compté dans le catalogue réel',
     av:', venant ', ap:'.',
     opt:[['','du monde entier']]}
  ];
  var n=0, ecrit='', bloque=false, api, RB=0;

  /* le texte coule : chaque lettre sort du flou en cascade, le cadre defile vers le haut */
  function lettres(txt, base){
    var k=0;
    return txt.split(/( )/).map(function(m){
      if(m===' ') return ' ';
      if(!m) return '';
      return '<span class="mo">'+m.split('').map(function(c){
        return '<span class="ch" style="animation-delay:'+((base+(k++))*22)+'ms">'+c+'</span>';
      }).join('')+'</span>';
    }).join('');
  }
  function defiler(){
    var t=$('texte'), c=t.parentNode; if(!c||!c.classList.contains('cadre')) return;
    if(c.classList.contains('ouvert')){ c.style.height=''; return; }
    var lh=parseFloat(getComputedStyle(t).lineHeight)||40;
    c.style.height=(5*lh)+'px';
    var trop=t.scrollHeight-5*lh;
    c.classList.toggle('defile', trop>2);
    t.style.transform='translateY('+(-Math.max(0,trop))+'px)';
  }
  function couler(txt, mot, fin){
    bloque=true;
    var t=$('texte'), anim=mot?'<b class="neuf">'+lettres(txt,0)+'</b>':lettres(txt,0);
    t.innerHTML=ecrit+anim+'<span class="cur"></span>';
    ecrit+=mot?'<b data-e="'+(n-1)+'">'+txt+'</b>':txt;
    defiler();
    setTimeout(function(){
      /* une fois sorti du flou, le mot passe a sa matiere : degrade vivant, trait lumineux */
      if(mot){ t.innerHTML=ecrit+'<span class="cur"></span>'; var d=t.querySelector('b[data-e="'+(n-1)+'"]'); if(d) d.classList.add('arrive'); }
      bloque=false; if(fin) fin();
    }, txt.length*22+560);
  }
  function poserValeur(et,v){ P[et.k]= et.k==='age' ? (v||null) : (v?[v]:[]); }
  function choix(et){ return et.k==='age'?P.age:(P[et.k][0]||''); }
  /* combien de produits resteraient si on choisissait cette reponse */
  function simule(et,v){
    var c={age:P.age,goals:P.goals.slice(),univers:P.univers.slice(),origine:P.origine.slice(),marques:[]};
    if(et.k!=='age') c[et.k]=v?[v]:[];
    return VYQ.compte(c);
  }
  function motDe(et){
    var v=choix(et), o=et.opt.filter(function(x){return x[0]===v;})[0];
    return o?o[1]:et.opt[0][1];
  }
  function opts(et){
    if(et.k==='age'||et.k==='goals') return et.opt;
    return et.opt.map(function(o){
      if(!o[0]) return [o[0],o[1]];
      var c=simule(et,o[0]);
      return c.produits?[o[0],o[1],VYQ.mais(c.marques)+' · '+VYQ.fmt(c.produits)+' produits',c.produits]:null;
    }).filter(Boolean);
  }
  /* chaque question a sa lumiere : la fumee change de teinte et avance d'un pas */
  function ambiance(k){
    document.body.setAttribute('data-etape', k);
    if(!$('halo')){ var h=document.createElement('div'); h.id='halo'; document.body.appendChild(h); }
  }
  function poser(){
    var et=ETAPES[n];
    ambiance(n);
    $('boite').classList.remove('vue');
    if($('ret')) $('ret').style.visibility=n?'visible':'hidden';
    couler(et.av, false, function(){
      $('qt').textContent=et.t; if($('qe')) $('qe').textContent=et.e;
      if($('pts')) $('pts').innerHTML=ETAPES.map(function(_,i){return '<i class="'+(i<=n?'on':'')+'"></i>';}).join('');
      var r=$('rep'); r.innerHTML='';
      /* les reponses sont comptees dans le contexte deja choisi : on n'affiche jamais une porte qui ne mene nulle part */
      opts(et).forEach(function(o){ r.insertAdjacentHTML('beforeend', api.option(o,et)); });
      [].slice.call(r.children).forEach(function(x,i){ x.classList.add('monte'); x.style.animationDelay=(i*45)+'ms'; });
      peindre(); $('boite').classList.add('vue');
    });
  }
  function valider(){
    var et=ETAPES[n];
    $('boite').classList.remove('vue'); n++;
    couler(motDe(et), true, function(){
      if(et.ap){ ecrit+=et.ap; $('texte').innerHTML=ecrit; }
      setTimeout(n<ETAPES.length?poser:fin, 160);
    });
  }
  function fin(){
    /* chaque mot choisi redevient touchable : on reprend la question sans tout refaire */
    $('texte').innerHTML=ecrit.replace(/<b data-e/g,'<b class="rep-mot" data-e');
    ambiance('fin');
    var cad=$('texte').parentNode; if(cad.classList.contains('cadre')){ cad.classList.add('ouvert'); $('texte').style.transform='none'; }
    var c=VYQ.compte(P);
    $('qt').textContent='Votre périmètre'; if($('qe')) $('qe').textContent='';
    if($('pts')) $('pts').innerHTML=ETAPES.map(function(){return '<i class="on"></i>';}).join('');
    $('rep').innerHTML='<div class="bilan"><b>'+VYQ.fmt(c.produits)+'</b> produits · <b>'+VYQ.mais(c.marques)+'</b>'+(c.marques>1?' retenues':' retenue')+' pour votre scan</div>';
    $('suite').classList.add('vue'); $('ok').textContent='Lancer mon scan'; if($('cpt')) $('cpt').innerHTML='ou touchez un mot de la phrase pour le changer';
    $('ok').onclick=function(){ alert('→ le scan démarre avec ce périmètre'); };
    $('boite').classList.add('vue');
    if($('bas')) $('bas').innerHTML='Périmètre prêt · <b>'+VYQ.fmt(c.produits)+'</b> produits';
  }
  function peindre(){
    var et=ETAPES[n], v=choix(et);
    [].slice.call($('rep').querySelectorAll('[data-v]')).forEach(function(b){
      b.setAttribute('aria-pressed',String(b.dataset.v===v));
    });
    dire();
  }
  function dire(txt){
    var c=VYQ.compte(P);
    if($('bas')) $('bas').innerHTML= txt || ('Question '+(Math.min(n+1,ETAPES.length))+' sur '+ETAPES.length+' · <b>'+VYQ.fmt(c.produits)+'</b> produits dans votre périmètre');
  }
  /* au survol, la reponse s'essaie deja dans la phrase, en fantome */
  function fantome(txt){
    if(bloque||n>=ETAPES.length) return;
    $('texte').innerHTML=ecrit+(txt?'<span class="fantome">'+txt+'</span>':'')+'<span class="cur"></span>'; defiler();
  }
  document.addEventListener('mouseover',function(e){
    var b=e.target.closest('#rep [data-v]'); if(!b||n>=ETAPES.length) return;
    var et=ETAPES[n], o=et.opt.filter(function(x){return x[0]===b.dataset.v;})[0];
    if(o) fantome(o[1]);
    if(et.k==='age'||et.k==='goals') return;
    var c=simule(et,b.dataset.v);
    dire('Ce choix laisse <b>'+VYQ.fmt(c.produits)+'</b> produits · <b>'+c.marques+'</b> maisons');
  });
  document.addEventListener('mouseout',function(e){ if(e.target.closest('#rep [data-v]')){ dire(); fantome(''); } });
  document.addEventListener('click',function(e){
    if(bloque) return;
    var b=e.target.closest('#rep [data-v]');
    if(b){
      var et=ETAPES[n], v=b.dataset.v;
      if(!v){ poserValeur(et,''); peindre(); setTimeout(valider,380); return; }
      poserValeur(et,v); peindre(); setTimeout(valider,420);
      return;
    }
    var m=e.target.closest('.rep-mot');
    if(m){ var k=+m.dataset.e; n=k; ecrit=ecrit.slice(0, ecrit.indexOf(ETAPES[k].av));
      var cad=$('texte').parentNode; cad.classList.remove('ouvert');
      $('suite').classList.remove('vue'); $('ok').onclick=null; poser(); return; }
    if(e.target.id==='ret'&&n){ n--; var et=ETAPES[n];
      ecrit=ecrit.slice(0, ecrit.lastIndexOf(et.av));
      $('suite').classList.remove('vue'); $('ok').textContent='Continuer'; $('ok').onclick=null; poser();
    }
  });
  api={
    P:P, etapes:ETAPES,
    /* rendu par defaut : une pastille */
    option:function(o){ return '<button class="vy-chip" type="button" data-v="'+o[0]+'">'+o[1].charAt(0).toUpperCase()+o[1].slice(1)+(o[2]?'<i>'+o[2]+'</i>':'')+'</button>'; },
    demarrer:function(rendu){
      if(rendu) api.option=rendu;
      var t=$('texte'); if(t && !t.parentNode.classList.contains('cadre')){
        var c=document.createElement('div'); c.className='cadre'; t.parentNode.insertBefore(c,t); c.appendChild(t);
      }
      VYQ.pret(function(){
        ETAPES[3].opt=[['','du monde entier']].concat(VYQ.origines().map(function(o){
          return [o.v, o.v==='FR'?'de France':o.v==='EU'?'d’Europe':o.v==='GB'?'du Royaume-Uni':o.v==='US'?'des États-Unis':
                  o.v==='KR'?'de Corée':o.v==='JP'?'du Japon':o.v==='AU'?'d’Australie':o.v==='CA'?'du Canada':'de '+o.nom, VYQ.mais(o.maisons)];
        }));
        var t=VYQ.compte({}); if($('tete')) $('tete').innerHTML=VYQ.fmt(t.produits)+' produits · '+t.marques+' maisons';
        poser();
      });
    }
  };
  return api;
})();
