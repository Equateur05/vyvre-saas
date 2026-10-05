/* Les douze langues de l'ecran « Avant votre scan ».
   Chaque langue ecrit SA phrase : av = ce qui precede la reponse, ap = ce qui la suit.
   Chaque reponse : [mot dans la phrase, libelle du bouton]. Les exemples de marques restent des noms propres. */
window.VYL=(function(){
  var q=new URLSearchParams(location.search), lang=(q.get('lang')||'fr').slice(0,2).toLowerCase();
  var EX={luxe:'Chanel, Dior, Sisley',pharmacie:'Vichy, La Roche-Posay',normal:'Clarins, Kiehl’s, Aesop','petit-prix':'The Ordinary, COSRX'};
  /* pluriels : russe (1 / 2-4 / 5+) et arabe (1, 2, 3-10, 11-99, 100…) */
  var RU_S=['средство','средства','средств'];
  function ruP(n,f){ n=Math.abs(n)%100; var u=n%10; if(n>10&&n<20) return f[2]; if(u===1) return f[0]; if(u>1&&u<5) return f[1]; return f[2]; }
  var AR_P={un:'منتج واحد',deux:'منتجان',peu:'منتجات',bcp:'منتجًا',autre:'منتج'},
      AR_M={un:'علامة تجارية واحدة',deux:'علامتان تجاريتان',peu:'علامات تجارية',bcp:'علامة تجارية',autre:'علامة تجارية'};
  function arP(n,f,aff){ if(n===1) return f.un; if(n===2) return f.deux; var r=n%100; return aff+' '+(r>=3&&r<=10?f.peu:(r>=11?f.bcp:f.autre)); }
  var D={
  fr:{
    q:[['Ce que vous cherchez','la caméra mesurera le reste','Cherchez-moi un soin ',''],
       ['Votre âge','une seule réponse',', pour une peau de ',''],
       ['La famille de maisons','aucun prix ne sera affiché, ni ici ni dans vos résultats',', chez des maisons ',''],
       ['Le pays d’origine','compté dans le catalogue réel',', venant ','.']],
    goals:{antiage:['anti-âge','Anti-âge'],glow:['d’éclat','D’éclat'],hydration:['hydratant','Hydratant'],redness:['apaisant','Apaisant'],pores:['affinant les pores','Affinant les pores'],pigmentation:['anti-taches','Anti-taches'],sebum:['matifiant','Matifiant'],yeux:['contour des yeux','Contour des yeux']},
    age:{'':['tout âge','Tout âge'],u25:['moins de 25 ans','Moins de 25 ans'],'25':['25 à 34 ans','25 à 34 ans'],'35':['35 à 44 ans','35 à 44 ans'],'45':['45 à 54 ans','45 à 54 ans'],'55':['55 ans et plus','55 ans et plus']},
    univers:{'':['de tous les univers','De tous les univers'],luxe:['de luxe','De luxe'],pharmacie:['de pharmacie','De pharmacie'],normal:['du quotidien','Du quotidien'],'petit-prix':['à petit prix','À petit prix']},
    pays:{'':['du monde entier','Du monde entier'],FR:['de France','De France'],US:['des États-Unis','Des États-Unis'],KR:['de Corée','De Corée'],EU:['du reste de l’Europe','D’Europe'],GB:['du Royaume-Uni','Du Royaume-Uni'],JP:['du Japon','Du Japon'],AU:['d’Australie','D’Australie'],CA:['du Canada','Du Canada']},
    ui:{head:'Avant le scan',revenir:'← Revenir',son:'Son',off:'coupé',on:'actif',passer:'Passer, montrez-moi tout',fermer:'Fermer',lancer:'Lancer mon scan',continuer:'Continuer',trois:'jusqu’à 3 choix',
      toucher:'ou touchez un mot de la phrase pour le changer',perim:'Votre périmètre',pret:'Périmètre prêt · {p} produits',demarre:'Le scan démarre',
      question:'Question {n} sur {t} · {p} produits dans votre périmètre',laisse:'Ce choix laisse {p} produits · {m}',tete:'{p} produits · {m}',
      bilan:'{p} produits · {m} {r} pour votre scan',lancerP:'{p} produits · {m} dans votre périmètre',prod:'produits',sous:'produits · {m} {r} pour votre scan'},
    mais:function(k,n){return n(k)+' maison'+(k>1?'s':'');}, retenue:function(k){return k>1?'retenues':'retenue';}
  },
  en:{
    q:[['What you are looking for','the camera will measure the rest','Find me ',''],
       ['Your age','one answer only',', for someone ',''],
       ['The kind of brand','no price is ever shown, here or in your results',', from ',''],
       ['Country of origin','counted in the real catalogue',', originating ','.']],
    goals:{antiage:['an anti-ageing treatment','Anti-ageing'],glow:['a radiance treatment','Radiance'],hydration:['a hydrating treatment','Hydrating'],redness:['a soothing treatment','Soothing'],pores:['a pore-refining treatment','Pore-refining'],pigmentation:['a dark-spot treatment','Dark spots'],sebum:['a mattifying treatment','Mattifying'],yeux:['an eye-contour treatment','Eye contour']},
    age:{'':['of any age','Any age'],u25:['under 25','Under 25'],'25':['aged 25 to 34','25 to 34'],'35':['aged 35 to 44','35 to 44'],'45':['aged 45 to 54','45 to 54'],'55':['aged 55 and over','55 and over']},
    univers:{'':['all kinds of brands','All kinds'],luxe:['luxury houses','Luxury'],pharmacie:['pharmacy brands','Pharmacy'],normal:['everyday brands','Everyday'],'petit-prix':['affordable brands','Affordable']},
    pays:{'':['anywhere in the world','Anywhere'],FR:['in France','France'],US:['in the United States','United States'],KR:['in Korea','Korea'],EU:['elsewhere in Europe','Europe'],GB:['in the UK','United Kingdom'],JP:['in Japan','Japan'],AU:['in Australia','Australia'],CA:['in Canada','Canada']},
    ui:{head:'Before your scan',revenir:'← Back',son:'Sound',off:'off',on:'on',passer:'Skip, show me everything',fermer:'Close',lancer:'Start my scan',continuer:'Continue',trois:'up to 3 choices',
      toucher:'or tap a word in the sentence to change it',perim:'Your selection',pret:'Selection ready · {p} products',demarre:'Your scan is starting',
      question:'Question {n} of {t} · {p} products in your selection',laisse:'This choice leaves {p} products · {m}',tete:'{p} products · {m}',
      bilan:'{p} products · {m} selected for your scan',lancerP:'{p} products · {m} in your selection',prod:'products',sous:'products · {m} selected for your scan'},
    mais:function(k,n){return n(k)+' brand'+(k!==1?'s':'');}
  },
  es:{
    q:[['Lo que busca','la cámara medirá el resto','Búsqueme un tratamiento ',''],
       ['Su edad','una sola respuesta',', para una piel de ',''],
       ['El tipo de marca','nunca se muestra ningún precio, ni aquí ni en sus resultados',', de ',''],
       ['País de origen','contado en el catálogo real',', procedente ','.']],
    goals:{antiage:['antiedad','Antiedad'],glow:['iluminador','Luminosidad'],hydration:['hidratante','Hidratante'],redness:['calmante','Calmante'],pores:['que afine los poros','Poros'],pigmentation:['antimanchas','Antimanchas'],sebum:['matificante','Matificante'],yeux:['para el contorno de ojos','Contorno de ojos']},
    age:{'':['cualquier edad','Cualquier edad'],u25:['menos de 25 años','Menos de 25 años'],'25':['25 a 34 años','25 a 34 años'],'35':['35 a 44 años','35 a 44 años'],'45':['45 a 54 años','45 a 54 años'],'55':['55 años o más','55 años o más']},
    univers:{'':['cualquier tipo de marca','Todas'],luxe:['marcas de lujo','Lujo'],pharmacie:['marcas de farmacia','Farmacia'],normal:['marcas de uso diario','Día a día'],'petit-prix':['marcas asequibles','Asequibles']},
    pays:{'':['de todo el mundo','Todo el mundo'],FR:['de Francia','Francia'],US:['de Estados Unidos','Estados Unidos'],KR:['de Corea','Corea'],EU:['del resto de Europa','Europa'],GB:['del Reino Unido','Reino Unido'],JP:['de Japón','Japón'],AU:['de Australia','Australia'],CA:['de Canadá','Canadá']},
    ui:{head:'Antes de su escaneo',revenir:'← Volver',son:'Sonido',off:'apagado',on:'activo',passer:'Omitir y ver todo',fermer:'Cerrar',lancer:'Iniciar mi escaneo',continuer:'Continuar',trois:'hasta 3 opciones',
      toucher:'o toque una palabra de la frase para cambiarla',perim:'Su selección',pret:'Selección lista · {p} productos',demarre:'Su escaneo comienza',
      question:'Pregunta {n} de {t} · {p} productos en su selección',laisse:'Con esta opción quedan {p} productos · {m}',tete:'{p} productos · {m}',
      bilan:'{p} productos · {m} para su escaneo',lancerP:'{p} productos · {m} en su selección',prod:'productos',sous:'productos · {m} para su escaneo'},
    mais:function(k,n){return n(k)+' marca'+(k!==1?'s':'');}
  },
  it:{
    q:[['Cosa cerca','la fotocamera misurerà il resto','Mi trovi un trattamento ',''],
       ['La sua età','una sola risposta',', per una pelle di ',''],
       ['Il tipo di marca','nessun prezzo viene mai mostrato, né qui né nei risultati',', di ',''],
       ['Paese di origine','contato nel catalogo reale',', proveniente ','.']],
    goals:{antiage:['anti-età','Anti-età'],glow:['illuminante','Luminosità'],hydration:['idratante','Idratante'],redness:['lenitivo','Lenitivo'],pores:['che affini i pori','Pori'],pigmentation:['antimacchia','Antimacchia'],sebum:['opacizzante','Opacizzante'],yeux:['per il contorno occhi','Contorno occhi']},
    age:{'':['ogni età','Ogni età'],u25:['meno di 25 anni','Meno di 25 anni'],'25':['25-34 anni','25-34 anni'],'35':['35-44 anni','35-44 anni'],'45':['45-54 anni','45-54 anni'],'55':['55 anni e oltre','55 anni e oltre']},
    univers:{'':['ogni tipo di marca','Tutte'],luxe:['marche di lusso','Lusso'],pharmacie:['marche da farmacia','Farmacia'],normal:['marche di tutti i giorni','Quotidiano'],'petit-prix':['marche accessibili','Accessibili']},
    pays:{'':['da tutto il mondo','Tutto il mondo'],FR:['dalla Francia','Francia'],US:['dagli Stati Uniti','Stati Uniti'],KR:['dalla Corea','Corea'],EU:['dal resto d’Europa','Europa'],GB:['dal Regno Unito','Regno Unito'],JP:['dal Giappone','Giappone'],AU:['dall’Australia','Australia'],CA:['dal Canada','Canada']},
    ui:{head:'Prima della scansione',revenir:'← Indietro',son:'Suono',off:'spento',on:'attivo',passer:'Salta e mostra tutto',fermer:'Chiudi',lancer:'Avvia la mia scansione',continuer:'Continua',trois:'fino a 3 scelte',
      toucher:'oppure tocchi una parola della frase per cambiarla',perim:'La sua selezione',pret:'Selezione pronta · {p} prodotti',demarre:'La scansione sta per iniziare',
      question:'Domanda {n} di {t} · {p} prodotti nella sua selezione',laisse:'Con questa scelta restano {p} prodotti · {m}',tete:'{p} prodotti · {m}',
      bilan:'{p} prodotti · {m} per la sua scansione',lancerP:'{p} prodotti · {m} nella sua selezione',prod:'prodotti',sous:'prodotti · {m} per la sua scansione'},
    mais:function(k,n){return n(k)+(k!==1?' marche':' marca');}
  },
  de:{
    q:[['Was Sie suchen','die Kamera misst den Rest','Finden Sie für mich eine Pflege ',''],
       ['Ihr Alter','nur eine Antwort',', für Haut ',''],
       ['Die Art der Marke','es wird nie ein Preis angezeigt, weder hier noch in Ihren Ergebnissen',', von ',''],
       ['Herkunftsland','im echten Katalog gezählt',', aus ','.']],
    goals:{antiage:['gegen Hautalterung','Anti-Aging'],glow:['für mehr Ausstrahlung','Ausstrahlung'],hydration:['für mehr Feuchtigkeit','Feuchtigkeit'],redness:['zur Beruhigung','Beruhigend'],pores:['für feinere Poren','Poren'],pigmentation:['gegen Pigmentflecken','Pigmentflecken'],sebum:['zum Mattieren','Mattierend'],yeux:['für die Augenpartie','Augenpartie']},
    age:{'':['jeden Alters','Jedes Alter'],u25:['unter 25 Jahren','Unter 25'],'25':['von 25 bis 34 Jahren','25 bis 34'],'35':['von 35 bis 44 Jahren','35 bis 44'],'45':['von 45 bis 54 Jahren','45 bis 54'],'55':['ab 55 Jahren','Ab 55']},
    univers:{'':['Marken jeder Art','Alle'],luxe:['Luxusmarken','Luxus'],pharmacie:['Apothekenmarken','Apotheke'],normal:['Alltagsmarken','Alltag'],'petit-prix':['günstigen Marken','Günstig']},
    pays:{'':['aller Welt','Aller Welt'],FR:['Frankreich','Frankreich'],US:['den USA','USA'],KR:['Korea','Korea'],EU:['dem übrigen Europa','Europa'],GB:['Großbritannien','Großbritannien'],JP:['Japan','Japan'],AU:['Australien','Australien'],CA:['Kanada','Kanada']},
    ui:{head:'Vor Ihrem Scan',revenir:'← Zurück',son:'Ton',off:'aus',on:'an',passer:'Überspringen, alles zeigen',fermer:'Schließen',lancer:'Meinen Scan starten',continuer:'Weiter',trois:'bis zu 3 Antworten',
      toucher:'oder tippen Sie auf ein Wort im Satz, um es zu ändern',perim:'Ihre Auswahl',pret:'Auswahl bereit · {p} Produkte',demarre:'Ihr Scan startet',
      question:'Frage {n} von {t} · {p} Produkte in Ihrer Auswahl',laisse:'Mit dieser Wahl bleiben {p} Produkte · {m}',tete:'{p} Produkte · {m}',
      bilan:'{p} Produkte · {m} für Ihren Scan',lancerP:'{p} Produkte · {m} in Ihrer Auswahl',prod:'Produkte',sous:'Produkte · {m} für Ihren Scan'},
    mais:function(k,n){return n(k)+(k!==1?' Marken':' Marke');}
  },
  pt:{
    q:[['O que procura','a câmara medirá o resto','Encontre-me um cuidado ',''],
       ['A sua idade','uma só resposta',', para uma pele de ',''],
       ['O tipo de marca','nunca é mostrado nenhum preço, nem aqui nem nos seus resultados',', de ',''],
       ['País de origem','contado no catálogo real',', vindo ','.']],
    goals:{antiage:['antienvelhecimento','Antienvelhecimento'],glow:['iluminador','Luminosidade'],hydration:['hidratante','Hidratante'],redness:['calmante','Calmante'],pores:['que afine os poros','Poros'],pigmentation:['antimanchas','Antimanchas'],sebum:['matificante','Matificante'],yeux:['para o contorno dos olhos','Contorno dos olhos']},
    age:{'':['qualquer idade','Qualquer idade'],u25:['menos de 25 anos','Menos de 25 anos'],'25':['25 a 34 anos','25 a 34 anos'],'35':['35 a 44 anos','35 a 44 anos'],'45':['45 a 54 anos','45 a 54 anos'],'55':['55 anos ou mais','55 anos ou mais']},
    univers:{'':['qualquer tipo de marca','Todas'],luxe:['marcas de luxo','Luxo'],pharmacie:['marcas de farmácia','Farmácia'],normal:['marcas do dia a dia','Dia a dia'],'petit-prix':['marcas acessíveis','Acessíveis']},
    pays:{'':['de todo o mundo','Todo o mundo'],FR:['de França','França'],US:['dos Estados Unidos','Estados Unidos'],KR:['da Coreia','Coreia'],EU:['do resto da Europa','Europa'],GB:['do Reino Unido','Reino Unido'],JP:['do Japão','Japão'],AU:['da Austrália','Austrália'],CA:['do Canadá','Canadá']},
    ui:{head:'Antes do seu scan',revenir:'← Voltar',son:'Som',off:'desligado',on:'ligado',passer:'Saltar, mostrar tudo',fermer:'Fechar',lancer:'Iniciar o meu scan',continuer:'Continuar',trois:'até 3 escolhas',
      toucher:'ou toque numa palavra da frase para a mudar',perim:'A sua seleção',pret:'Seleção pronta · {p} produtos',demarre:'O seu scan vai começar',
      question:'Pergunta {n} de {t} · {p} produtos na sua seleção',laisse:'Com esta escolha ficam {p} produtos · {m}',tete:'{p} produtos · {m}',
      bilan:'{p} produtos · {m} para o seu scan',lancerP:'{p} produtos · {m} na sua seleção',prod:'produtos',sous:'produtos · {m} para o seu scan'},
    mais:function(k,n){return n(k)+' marca'+(k!==1?'s':'');}
  },
  nl:{
    q:[['Wat u zoekt','de camera meet de rest','Zoek voor mij een ',''],
       ['Uw leeftijd','één antwoord',', voor een huid ',''],
       ['Het soort merk','er wordt nergens een prijs getoond, niet hier en niet in uw resultaten',', van ',''],
       ['Land van herkomst','geteld in de echte catalogus',', uit ','.']],
    goals:{antiage:['anti-agingproduct','Anti-aging'],glow:['product voor meer glans','Glans'],hydration:['hydraterend product','Hydraterend'],redness:['kalmerend product','Kalmerend'],pores:['poriënverfijnend product','Poriën'],pigmentation:['product tegen pigmentvlekken','Pigmentvlekken'],sebum:['matterend product','Matterend'],yeux:['product voor de oogcontour','Oogcontour']},
    age:{'':['van elke leeftijd','Elke leeftijd'],u25:['jonger dan 25 jaar','Jonger dan 25'],'25':['van 25 tot 34 jaar','25 tot 34 jaar'],'35':['van 35 tot 44 jaar','35 tot 44 jaar'],'45':['van 45 tot 54 jaar','45 tot 54 jaar'],'55':['van 55 jaar en ouder','55 jaar en ouder']},
    univers:{'':['elk soort merk','Alle'],luxe:['luxemerken','Luxe'],pharmacie:['apotheekmerken','Apotheek'],normal:['merken voor elke dag','Dagelijks'],'petit-prix':['betaalbare merken','Betaalbaar']},
    pays:{'':['de hele wereld','Hele wereld'],FR:['Frankrijk','Frankrijk'],US:['de Verenigde Staten','Verenigde Staten'],KR:['Korea','Korea'],EU:['de rest van Europa','Europa'],GB:['het Verenigd Koninkrijk','Verenigd Koninkrijk'],JP:['Japan','Japan'],AU:['Australië','Australië'],CA:['Canada','Canada']},
    ui:{head:'Voor uw scan',revenir:'← Terug',son:'Geluid',off:'uit',on:'aan',passer:'Overslaan en alles tonen',fermer:'Sluiten',lancer:'Start mijn scan',continuer:'Verder',trois:'tot 3 keuzes',
      toucher:'of tik op een woord in de zin om het te wijzigen',perim:'Uw selectie',pret:'Selectie klaar · {p} producten',demarre:'Uw scan begint',
      question:'Vraag {n} van {t} · {p} producten in uw selectie',laisse:'Met deze keuze blijven {p} producten over · {m}',tete:'{p} producten · {m}',
      bilan:'{p} producten · {m} voor uw scan',lancerP:'{p} producten · {m} in uw selectie',prod:'producten',sous:'producten · {m} voor uw scan'},
    mais:function(k,n){return n(k)+(k!==1?' merken':' merk');}
  },
  ru:{
    q:[['Что вы ищете','остальное измерит камера','Подберите мне ',''],
       ['Ваш возраст','выберите один вариант',', для кожи ',''],
       ['Тип бренда','цены не показываются ни здесь, ни в результатах',', среди ',''],
       ['Страна происхождения','посчитано по реальному каталогу',', родом ','.']],
    goals:{antiage:['антивозрастной уход','Антивозрастной'],glow:['уход для сияния','Сияние'],hydration:['увлажняющий уход','Увлажнение'],redness:['успокаивающий уход','Успокаивающий'],pores:['уход для сужения пор','Поры'],pigmentation:['уход против пигментных пятен','Пигментные пятна'],sebum:['матирующий уход','Матирующий'],yeux:['уход для кожи вокруг глаз','Кожа вокруг глаз']},
    age:{'':['любого возраста','Любой возраст'],u25:['до 25 лет','До 25 лет'],'25':['25–34 лет','25–34 года'],'35':['35–44 лет','35–44 года'],'45':['45–54 лет','45–54 года'],'55':['от 55 лет','От 55 лет']},
    univers:{'':['брендов любого типа','Все'],luxe:['люксовых брендов','Люкс'],pharmacie:['аптечных брендов','Аптечные'],normal:['брендов на каждый день','Повседневные'],'petit-prix':['доступных брендов','Доступные']},
    pays:{'':['из любой страны','Весь мир'],FR:['из Франции','Франция'],US:['из США','США'],KR:['из Кореи','Корея'],EU:['из других стран Европы','Европа'],GB:['из Великобритании','Великобритания'],JP:['из Японии','Япония'],AU:['из Австралии','Австралия'],CA:['из Канады','Канада']},
    /* vrais pluriels russes : 1 средство, 2 средства, 5 средств ; 1 бренд, 2 бренда, 5 брендов */
    ui:{head:'Перед сканированием',revenir:'← Назад',son:'Звук',off:'выкл.',on:'вкл.',passer:'Пропустить и показать всё',fermer:'Закрыть',lancer:'Начать сканирование',continuer:'Далее',trois:'до 3 вариантов',
      toucher:'или нажмите на слово во фразе, чтобы его изменить',perim:'Ваша подборка',demarre:'Сканирование начинается',
      pret:function(v,N){return 'Подборка готова · '+v.p+' '+ruP(N(v.p),RU_S);},
      question:function(v,N){return 'Вопрос '+v.n+' из '+v.t+' · в подборке '+v.p+' '+ruP(N(v.p),RU_S);},
      laisse:function(v,N){return 'При этом выборе останется '+v.p+' '+ruP(N(v.p),RU_S)+' · '+v.m;},
      tete:function(v,N){return v.p+' '+ruP(N(v.p),RU_S)+' · '+v.m;},
      bilan:function(v,N){return v.p+' '+ruP(N(v.p),RU_S)+' · '+v.m+' для вашего сканирования';},
      lancerP:function(v,N){return v.p+' '+ruP(N(v.p),RU_S)+' · '+v.m+' в вашей подборке';},
      prod:function(v,N,dernier){return ruP(dernier,RU_S);},
      sous:'в подборке для вашего сканирования · {m}'},
    mais:function(k,n){return n(k)+' '+ruP(k,['бренд','бренда','брендов']);}
  },
  ar:{
    q:[['ما تبحثون عنه','ستقيس الكاميرا الباقي','ابحثوا لي عن عناية ',''],
       ['عمركم','إجابة واحدة فقط','، لبشرة ',''],
       ['نوع العلامة التجارية','لن يُعرض أي سعر، لا هنا ولا في نتائجكم','، من ',''],
       ['بلد المنشأ','محسوب من الكتالوج الحقيقي','، قادمة من ','.']],
    goals:{antiage:['مضادة للشيخوخة','مكافحة الشيخوخة'],glow:['تمنح البشرة إشراقة','الإشراقة'],hydration:['مرطبة','الترطيب'],redness:['مهدئة','التهدئة'],pores:['تقلّص المسام','المسام'],pigmentation:['مضادة للبقع الداكنة','البقع الداكنة'],sebum:['تضبط اللمعان','ضبط اللمعان'],yeux:['لمحيط العينين','محيط العينين']},
    age:{'':['في أي عمر','أي عمر'],u25:['دون 25 عامًا','دون 25'],'25':['بين 25 و34 عامًا','من 25 إلى 34'],'35':['بين 35 و44 عامًا','من 35 إلى 44'],'45':['بين 45 و54 عامًا','من 45 إلى 54'],'55':['في سن 55 فما فوق','55 فما فوق']},
    univers:{'':['كل أنواع العلامات التجارية','الكل'],luxe:['علامات فاخرة','فاخرة'],pharmacie:['علامات صيدلانية','صيدلانية'],normal:['علامات للاستخدام اليومي','يومية'],'petit-prix':['علامات بأسعار معقولة','بأسعار معقولة']},
    pays:{'':['أي مكان في العالم','العالم كله'],FR:['فرنسا','فرنسا'],US:['الولايات المتحدة','الولايات المتحدة'],KR:['كوريا','كوريا'],EU:['بقية أوروبا','أوروبا'],GB:['المملكة المتحدة','المملكة المتحدة'],JP:['اليابان','اليابان'],AU:['أستراليا','أستراليا'],CA:['كندا','كندا']},
    /* vrais pluriels arabes : منتج واحد، منتجان، 3–10 منتجات، 11–99 منتجًا، 100 منتج */
    ui:{head:'قبل الفحص',revenir:'رجوع →',son:'الصوت',off:'مكتوم',on:'مفعّل',passer:'تخطّي وعرض كل شيء',fermer:'إغلاق',lancer:'بدء الفحص',continuer:'متابعة',trois:'حتى 3 اختيارات',
      toucher:'أو المسوا كلمة في الجملة لتغييرها',perim:'اختياركم',demarre:'يبدأ الفحص الآن',
      pret:function(v,N){return 'الاختيار جاهز · '+arP(N(v.p),AR_P,v.p);},
      question:function(v,N){return 'السؤال '+v.n+' من '+v.t+' · '+arP(N(v.p),AR_P,v.p)+' في اختياركم';},
      laisse:function(v,N){return 'مع هذا الخيار يبقى '+arP(N(v.p),AR_P,v.p)+' · '+v.m;},
      tete:function(v,N){return arP(N(v.p),AR_P,v.p)+' · '+v.m;},
      bilan:function(v,N){return arP(N(v.p),AR_P,v.p)+' · '+v.m+' لفحصكم';},
      lancerP:function(v,N){return arP(N(v.p),AR_P,v.p)+' · '+v.m+' في اختياركم';},
      prod:function(v,N,dernier){var r=dernier%100; return r>=3&&r<=10?'منتجات':(r>=11?'منتجًا':'منتج');},
      sous:'ضمن اختياركم لهذا الفحص · {m}'},
    mais:function(k,n){return arP(k,AR_M,n(k));}
  },
  ja:{
    /* chaque av doit etre unique dans la phrase (le retour et le clic sur un mot coupent la phrase a av) :
       la fin de chaque groupe est donc portee par l'av suivant */
    q:[['お探しのケア','あとはカメラが測定します','探しているのは、',''],
       ['年齢','ひとつお選びください','アイテム。',''],
       ['ブランドのタイプ','価格はここにも結果にも表示されません','の肌に向けて、',''],
       ['原産国','実際のカタログで集計','ブランドの中から、','のものをお願いします。']],
    goals:{antiage:['エイジングケア','エイジングケア'],glow:['透明感ケア','透明感'],hydration:['保湿','保湿'],redness:['鎮静ケア','鎮静'],pores:['毛穴ケア','毛穴ケア'],pigmentation:['シミ対策','シミ対策'],sebum:['皮脂ケア','皮脂ケア'],yeux:['目元ケア','目元ケア']},
    age:{'':['あらゆる年代','すべての年代'],u25:['25歳未満','25歳未満'],'25':['25〜34歳','25〜34歳'],'35':['35〜44歳','35〜44歳'],'45':['45〜54歳','45〜54歳'],'55':['55歳以上','55歳以上']},
    univers:{'':['すべての','すべて'],luxe:['ラグジュアリー','ラグジュアリー'],pharmacie:['ダーマコスメ','ダーマコスメ'],normal:['日常使いの','デイリー'],'petit-prix':['プチプラ','プチプラ']},
    pays:{'':['世界中','世界中'],FR:['フランス発','フランス'],US:['アメリカ発','アメリカ'],KR:['韓国発','韓国'],EU:['フランス以外のヨーロッパ発','ヨーロッパ'],GB:['イギリス発','イギリス'],JP:['日本発','日本'],AU:['オーストラリア発','オーストラリア'],CA:['カナダ発','カナダ']},
    ui:{head:'スキャンの前に',revenir:'← 戻る',son:'サウンド',off:'オフ',on:'オン',passer:'スキップしてすべて表示',fermer:'閉じる',lancer:'スキャンを開始',continuer:'次へ',trois:'3つまで選べます',
      toucher:'文中の言葉をタップすると変更できます',perim:'選択した条件',pret:'条件がそろいました · {p}点',demarre:'スキャンを開始します',
      question:'質問 {n} / {t} · 条件に合う製品 {p}点',laisse:'この選択で残るのは {p}点 · {m}',tete:'{p}点 · {m}',
      bilan:'{p}点 · {m}がスキャンの対象です',lancerP:'{p}点 · {m}',prod:'点',sous:'アイテム · {m}がスキャンの対象です'},
    mais:function(k,n){return n(k)+'ブランド';}
  },
  ko:{
    /* chaque av doit etre unique dans la phrase : la fin de chaque groupe est portee par l'av suivant */
    q:[['찾으시는 케어','나머지는 카메라가 측정합니다','저를 위한 ',''],
       ['연령','하나만 선택해 주세요',' 케어를, ',''],
       ['브랜드 유형','가격은 여기에도, 결과에도 표시되지 않습니다',' 피부에 맞게, ',''],
       ['원산지','실제 카탈로그 기준',' 브랜드 중에서, ',' 제품으로 찾아 주세요.']],
    goals:{antiage:['안티에이징','안티에이징'],glow:['광채','광채'],hydration:['보습','보습'],redness:['진정','진정'],pores:['모공','모공'],pigmentation:['잡티','잡티'],sebum:['피지 조절','피지 조절'],yeux:['눈가','눈가 케어']},
    age:{'':['모든 연령대','모든 연령대'],u25:['25세 미만','25세 미만'],'25':['25~34세','25~34세'],'35':['35~44세','35~44세'],'45':['45~54세','45~54세'],'55':['55세 이상','55세 이상']},
    univers:{'':['모든 유형의','모든 유형'],luxe:['럭셔리','럭셔리'],pharmacie:['더마 코스메틱','더마 코스메틱'],normal:['데일리','데일리'],'petit-prix':['합리적인 가격대의','합리적인 가격대']},
    pays:{'':['전 세계','전 세계'],FR:['프랑스','프랑스'],US:['미국','미국'],KR:['한국','한국'],EU:['프랑스 외 유럽','유럽'],GB:['영국','영국'],JP:['일본','일본'],AU:['호주','호주'],CA:['캐나다','캐나다']},
    ui:{head:'스캔 전에',revenir:'← 이전',son:'사운드',off:'끔',on:'켬',passer:'건너뛰고 모두 보기',fermer:'닫기',lancer:'스캔 시작',continuer:'다음',trois:'최대 3개 선택',
      toucher:'문장의 단어를 누르면 바꿀 수 있습니다',perim:'선택한 범위',pret:'범위 준비 완료 · 제품 {p}개',demarre:'스캔을 시작합니다',
      question:'질문 {n} / {t} · 범위 내 제품 {p}개',laisse:'이 선택 시 남는 제품 {p}개 · {m}',tete:'제품 {p}개 · {m}',
      bilan:'제품 {p}개 · {m}가 스캔 대상입니다',lancerP:'제품 {p}개 · {m}',prod:'개 제품',sous:'제품 · {m}가 스캔 대상입니다'},
    mais:function(k,n){return '브랜드 '+n(k)+'개';}
  },
  zh:{
    q:[['您要找的护理','其余交给镜头测量','请为我找一款','护肤品'],
       ['您的年龄','只选一项','，适合','的肌肤'],
       ['品牌类型','此处与结果中均不显示价格','，来自','品牌'],
       ['原产地','按真实目录统计','，源自','。']],
    goals:{antiage:['抗老','抗老'],glow:['提亮','提亮'],hydration:['保湿','保湿'],redness:['舒缓','舒缓'],pores:['细致毛孔','细致毛孔'],pigmentation:['淡斑','淡斑'],sebum:['控油','控油'],yeux:['眼周','眼周护理']},
    age:{'':['各个年龄段','各个年龄段'],u25:['25岁以下','25岁以下'],'25':['25–34岁','25–34岁'],'35':['35–44岁','35–44岁'],'45':['45–54岁','45–54岁'],'55':['55岁及以上','55岁及以上']},
    univers:{'':['各类','全部类型'],luxe:['奢华','奢华'],pharmacie:['药妆','药妆'],normal:['日常','日常'],'petit-prix':['平价','平价']},
    pays:{'':['世界各地','世界各地'],FR:['法国','法国'],US:['美国','美国'],KR:['韩国','韩国'],EU:['欧洲其他国家','欧洲'],GB:['英国','英国'],JP:['日本','日本'],AU:['澳大利亚','澳大利亚'],CA:['加拿大','加拿大']},
    ui:{head:'扫描之前',revenir:'← 返回',son:'声音',off:'关',on:'开',passer:'跳过，全部显示',fermer:'关闭',lancer:'开始扫描',continuer:'继续',trois:'最多可选 3 项',
      toucher:'或点击句中的词语进行修改',perim:'您的范围',pret:'范围已就绪 · {p} 款产品',demarre:'扫描即将开始',
      question:'第 {n} 题，共 {t} 题 · 范围内 {p} 款产品',laisse:'此选择保留 {p} 款产品 · {m}',tete:'{p} 款产品 · {m}',
      bilan:'{p} 款产品 · {m}，纳入本次扫描',lancerP:'{p} 款产品 · {m}',prod:'款产品',sous:'产品 · {m}，纳入本次扫描'},
    mais:function(k,n){return n(k)+' 个品牌';}
  }
  };
  if(!D[lang]) lang='fr';
  var d=D[lang];
  /* dernier : le dernier nombre formate. ui.prod est toujours lu juste apres fmt(nombre de produits),
     c'est ainsi que le russe et l'arabe accordent « produits » sans toucher aux moteurs */
  var dernier=0;
  function fmt(x){ dernier=+x||0; if(lang==='fr') return String(x).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
    try{ return new Intl.NumberFormat(lang==='ar'?'ar-u-nu-latn':lang).format(x);}catch(e){return String(x);} }
  /* le nombre contenu dans une valeur deja mise en forme (texte ou <b class="n" data-n="…">) */
  function nombre(x){ var s=String(x==null?'':x), m=s.match(/data-n="(\d+)"/); if(m) return +m[1];
    return +(s.replace(/<[^>]*>/g,'').replace(/[^0-9]/g,''))||0; }
  function t(k,v){ var s=d.ui[k]||D.fr.ui[k]||k; v=v||{};
    if(typeof s==='function') return s(v,nombre,dernier);
    for(var x in v) s=s.split('{'+x+'}').join(v[x]); return s; }
  return {
    lang:lang, d:d, rtl:lang==='ar', cjk:/^(ja|zh)$/.test(lang), lieParMot:lang==='ar', EX:EX, fmt:fmt, t:t,
    mais:function(k,n){ return d.mais(k,n||fmt); },
    retenue:function(k){ return d.retenue?d.retenue(k):''; },
    /* plusieurs reponses dans la phrase : « anti-âge, d’éclat et hydratant » ; en japonais, coréen et chinois, un séparateur */
    lie:function(l){ var J={fr:' et ',en:' and ',es:' y ',it:' e ',de:' und ',pt:' e ',nl:' en ',ru:' и ',ar:' و'}, S={ja:'・',ko:', ',zh:'、'};
      if(l.length<2) return l[0]||''; if(S[lang]) return l.join(S[lang]);
      return l.slice(0,-1).join(lang==='ar'?'، ':', ')+(J[lang]||' & ')+l[l.length-1]; },
    mot:function(cle,v){ var m=(d[cle]||{})[v]; return m?m[0]:v; },
    label:function(cle,v){ var m=(d[cle]||{})[v]; return m?m[1]:null; }
  };
})();
if(window.VYL.rtl){ document.documentElement.setAttribute('dir','rtl'); }
document.documentElement.setAttribute('lang', window.VYL.lang);
