/* Donnees d'exemple du Wrap (pages demo et propales). Elles sont annoncees comme telles : exemple:true. */
(function(){
  window.VYW_EXEMPLES = {
    peau: {
      type:'peau', prenom:'Camille', titre:'Ma peau', exemple:true,
      /* comme sur la vraie page : le phare est l'indice global affiche en grand (ici une valeur d'exemple) */
      phare:{ label:'Indice global', valeur:72, unite:'/100' },
      chiffres:[ { label:'Hydratation', valeur:82, unite:'/100' }, { label:'Éclat', valeur:71, unite:'/100' },
                 { label:'Apaisement', valeur:66, unite:'/100' }, { label:'Fermeté', valeur:74, unite:'/100' },
                 { label:'Pores', valeur:58, unite:'/100' }, { label:'Uniformité', valeur:69, unite:'/100' } ],
      items:[
        { nom:'Cleansing Oil', marque:'111SKIN', etape:'Nettoyer', image:'/scan/products/111skin/v2/cutout/cleansing-oil.webp' },
        { nom:'Repair Serum NAC Y²', marque:'111SKIN', etape:'Éclat', image:'/scan/products/111skin/v2/cutout/repair-serum-nac-y.webp' },
        { nom:'Crème légère dermatologique hydratante', marque:'A-Derma', etape:'Hydratation', image:'/scan/products/a-derma/v2/cutout/creme-legere-dermatologique-hydratante.webp' },
        { nom:'Repair Sunscreen SPF50+', marque:'111SKIN', etape:'Protection solaire', image:'/scan/products/111skin/v2/cutout/repair-sunscreen-spf50.webp' }
      ]
    },
    cheveux: {
      type:'cheveux', prenom:'', titre:'Mes cheveux', exemple:true,
      phare:{ label:'La boucle', valeur:64, unite:'/100' },
      chiffres:[ { label:'La boucle', valeur:64, unite:'/100' }, { label:'La couleur', valeur:'Châtain', unite:'' },
                 { label:'La prise', valeur:88, unite:'/100' }, { label:'La routine', valeur:4, unite:'gestes' } ],
      items:[
        { nom:'Daily Hydro Hydrating Shampoo', marque:'Act+Acre', etape:'01 · Lavage', image:'/scan/products-cheveux/act-and-acre/cutout/daily-hydro-hydrating-shampoo.webp' },
        { nom:'Daily Hydro Hydrating Conditioner', marque:'Act+Acre', etape:'02 · Soin rincé', image:'/scan/products-cheveux/act-and-acre/cutout/daily-hydro-hydrating-conditioner.webp' },
        { nom:'Huile pour cheveux Tendre Passion', marque:'Activilong', etape:'03 · Sans-rinçage', image:'/scan/products-cheveux/activilong/cutout/huile-pour-cheveux-tendre-passion.webp' },
        { nom:'Image absente (test)', marque:'Exemple', etape:'04 · Traitement ciblé', image:'/scan/products-cheveux/nexiste-pas.webp' }
      ]
    },
    aliment: {
      type:'aliment', prenom:'Léa', titre:'Mon assiette', exemple:true,
      phare:{ label:'Aliments passés en revue', valeur:312, unite:'' },
      chiffres:[ { label:'Aliments passés en revue', valeur:312, unite:'' }, { label:'Écartés pour vous', valeur:41, unite:'' },
                 { label:'De saison', valeur:3, unite:'' }, { label:'Retenus', valeur:4, unite:'' } ],
      items:[
        { nom:'Myrtille', marque:'Fruit', etape:'125 g', image:'/scan/aliment/photos/myrtille.png' },
        { nom:'Avocat', marque:'Fruit', etape:'Un demi', image:'/scan/aliment/photos/avocat.png' },
        { nom:'Épinard', marque:'Légume', etape:'Une assiette', image:'/scan/aliment/photos/epinard.png' },
        { nom:'Carotte', marque:'Légume', etape:'Une carotte', image:'/scan/aliment/photos/carotte.png' }
      ]
    }
  };
})();
