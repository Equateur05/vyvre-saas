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
      /* 07/10 (X) : les besoins tels que la page les transmet (memes seuils que sa phrase), avec le nom de la mesure */
      besoins:[ { cle:'secheresse', source:'lecture', label:'Sécheresse' }, { cle:'frizz', source:'reponses', label:'Frisottis' } ],
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
      /* 07/10 (X) : comme sur la vraie page, la revelation est le besoin lu sur la peau (Core.indices), la preuve sa valeur ;
         les photos ne sont prises que si leur licence permet la reutilisation (credits.json), avec leur credit */
      type:'aliment', prenom:'Léa', titre:'Mes aliments peau', exemple:true,
      lecture:{ i1:'hydratation', n1:58, niv1:'prioritaire', i2:'eclat', n2:66, niv2:'surveiller', entretien:false, bas:'hydratation' },
      phare:{ label:'Hydratation', valeur:58, unite:'/100', cle:'indice' },
      chiffres:[ { label:'Hydratation', valeur:58, unite:'/100', cle:'indice' }, { label:'Éclat', valeur:66, unite:'/100', cle:'indice2' },
                 { label:'Aliments passés en revue', valeur:312, unite:'', cle:'revue' }, { label:'Écartés pour vous', valeur:41, unite:'', cle:'surmesure' },
                 { label:'De saison', valeur:3, unite:'', cle:'saison' }, { label:'Retenus', valeur:4, unite:'', cle:'selection' } ],
      items:[
        { nom:'Myrtille', marque:'Fruit', etape:'125 g', image:'/scan/aliment/photos/myrtille.png', credit:'Foodie Factor · CC0 1.0' },
        { nom:'Avocat', marque:'Fruit', etape:'Un demi', image:'/scan/aliment/photos/avocat.png', credit:'Ivar Leidus · CC BY-SA 4.0' },
        { nom:'Épinard', marque:'Légume', etape:'Une assiette', image:'/scan/aliment/photos/epinard.png', credit:'Merstel007 · CC0 1.0' },
        { nom:'Carotte', marque:'Légume', etape:'Une carotte', image:'/scan/aliment/photos/carotte.png', credit:'Evan-Amos · Domaine public' }
      ]
    }
  };
})();
