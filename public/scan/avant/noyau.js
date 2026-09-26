/* Noyau commun aux propales de questionnaire avant-scan.
   Vraies donnees : /scan/catalogue/marques.json + all.json. Aucun prix affiche. */
window.VYQ=(function(){
  var EU={DE:1,CH:1,SE:1,BE:1,NL:1,ES:1,IT:1,AT:1,DK:1,PT:1,MC:1,HU:1,IE:1,PL:1};
  var M={}, P=[], prets=[], ok=false;
  Promise.all([
    fetch('/scan/catalogue/marques.json').then(function(r){return r.json();}).then(function(j){M=j.marques||{};}),
    fetch('/scan/catalogue/all.json').then(function(r){return r.json();}).then(function(j){P=j.products||[];})
  ]).then(function(){ ok=true; prets.forEach(function(f){f();}); prets=[]; });

  function region(s){var b=M[s]; if(!b) return null; return EU[b.pays]?'EU':(b.pays==='AU'?'AU':b.pays);}
  function garde(sel,b,slug){
    if(!b) return false;
    if(sel.marques && sel.marques.length) return sel.marques.indexOf(slug)>=0;
    if(sel.univers && sel.univers.length && sel.univers.indexOf(b.univers)<0) return false;
    if(sel.origine && sel.origine.length && sel.origine.indexOf(region(slug))<0) return false;
    return true;
  }
  return {
    pret:function(f){ ok?f():prets.push(f); },
    marques:function(){return M;},
    produits:function(){return P;},
    region:region,
    /* liste des slugs de marques dans le perimetre */
    perimetre:function(sel){ return Object.keys(M).filter(function(s){return garde(sel,M[s],s);}); },
    /* {produits, marques} reellement comptes */
    compte:function(sel){
      /* on ne compte que les maisons qui ont au moins un produit en ligne */
      var g={}, vus={}, n=0; this.perimetre(sel).forEach(function(s){g[s]=1;});
      for(var i=0;i<P.length;i++) if(g[P[i].brand]){ n++; vus[P[i].brand]=1; }
      return {produits:n, marques:Object.keys(vus).length, total:P.length, totalM:Object.keys(M).length};
    },
    nom:function(s){return (M[s]||{}).nom||s;},
    /* 1 maison, 2 maisons */
    mais:function(k){return k+' maison'+(k>1?'s':'');},
    /* Les provenances, construites sur les vraies donnees : aucun pays invente, aucun oublie. */
    origines:function(){
      var L={FR:['France','Paris, Lyon, Provence'],KR:['Corée du Sud','Le soin coréen, K-beauty'],
             US:['États-Unis','New York, Californie'],GB:['Royaume-Uni','Londres'],JP:['Japon','Tokyo, Kyoto'],
             EU:['Europe','Allemagne, Suisse, Italie, Espagne'],AU:['Australie','Melbourne, Sydney'],CA:['Canada',''],BR:['Brésil',''],IL:['Israël','']};
      var acc={}, self=this;
      Object.keys(M).forEach(function(s){ var r=self.region(s)||'??'; (acc[r]=acc[r]||{v:r,maisons:0,produits:0}).maisons++; });
      P.forEach(function(p){ var r=self.region(p.brand); if(r&&acc[r]) acc[r].produits++; });
      return Object.keys(acc).map(function(r){
        var l=L[r]||[r,''];
        acc[r].nom=l[0]; acc[r].sous=l[1]; return acc[r];
      }).filter(function(o){return o.produits>0;}).sort(function(a,b){return b.maisons-a.maisons;});
    },
    /* nombre formate a la francaise */
    fmt:function(n){ if(window.VYL) return VYL.fmt(n); return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
  };
})();
