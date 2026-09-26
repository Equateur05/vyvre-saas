/* Les douze langues de l'ecran « Avant votre scan ».
   Chaque langue ecrit SA phrase : av = ce qui precede la reponse, ap = ce qui la suit.
   Chaque reponse : [mot dans la phrase, libelle du bouton]. Les exemples de marques restent des noms propres. */
window.VYL=(function(){
  var q=new URLSearchParams(location.search), lang=(q.get('lang')||'fr').slice(0,2).toLowerCase();
  var EX={luxe:'Chanel, Dior, Sisley',pharmacie:'Vichy, La Roche-Posay',normal:'Clarins, Kiehl’s, Aesop','petit-prix':'The Ordinary, COSRX'};
  var D={
  fr:{
    q:[['Ce que vous cherchez','la caméra mesurera le reste','Cherchez-moi un soin ',''],
       ['Votre âge','une seule réponse',', pour une peau de ',''],
       ['La famille de maisons','aucun prix ne sera affiché, ni ici ni dans vos résultats',', chez des maisons ',''],
       ['Le pays d’origine','compté dans le catalogue réel',', venant ','.']],
    goals:{antiage:['anti-âge','Anti-âge'],glow:['d’éclat','D’éclat'],hydration:['hydratant','Hydratant'],redness:['apaisant','Apaisant'],pores:['affinant les pores','Affinant les pores'],pigmentation:['anti-taches','Anti-taches'],sebum:['matifiant','Matifiant']},
    age:{'':['tout âge','Tout âge'],u25:['moins de 25 ans','Moins de 25 ans'],'25':['25 à 34 ans','25 à 34 ans'],'35':['35 à 44 ans','35 à 44 ans'],'45':['45 à 54 ans','45 à 54 ans'],'55':['55 ans et plus','55 ans et plus']},
    univers:{'':['de tous les univers','De tous les univers'],luxe:['de luxe','De luxe'],pharmacie:['de pharmacie','De pharmacie'],normal:['du quotidien','Du quotidien'],'petit-prix':['à petit prix','À petit prix']},
    pays:{'':['du monde entier','Du monde entier'],FR:['de France','De France'],US:['des États-Unis','Des États-Unis'],KR:['de Corée','De Corée'],EU:['d’Europe','D’Europe'],GB:['du Royaume-Uni','Du Royaume-Uni'],JP:['du Japon','Du Japon'],AU:['d’Australie','D’Australie'],CA:['du Canada','Du Canada']},
    ui:{head:'Avant le scan',revenir:'← Revenir',son:'Son',off:'coupé',on:'actif',passer:'Passer, montrez-moi tout',fermer:'Fermer',lancer:'Lancer mon scan',continuer:'Continuer',
      toucher:'ou touchez un mot de la phrase pour le changer',perim:'Votre périmètre',pret:'Périmètre prêt · {p} produits',demarre:'Le scan démarre',
      question:'Question {n} sur {t} · {p} produits dans votre périmètre',laisse:'Ce choix laisse {p} produits · {m}',tete:'{p} produits · {m}',
      bilan:'{p} produits · {m} {r} pour votre scan',lancerP:'{p} produits · {m} dans votre périmètre',prod:'produits',sous:'produits · {m} {r} pour votre scan'},
    mais:function(k,n){return n(k)+' maison'+(k>1?'s':'');}, retenue:function(k){return k>1?'retenues':'retenue';}
  },
  en:{
    q:[['What you are looking for','the camera will measure the rest','Find me ',''],
       ['Your age','one answer only',', for someone ',''],
       ['The kind of brand','no price is ever shown, here or in your results',', from ',''],
       ['Country of origin','counted in the real catalogue',', made ','.']],
    goals:{antiage:['an anti-ageing treatment','Anti-ageing'],glow:['a radiance treatment','Radiance'],hydration:['a hydrating treatment','Hydrating'],redness:['a soothing treatment','Soothing'],pores:['a pore-refining treatment','Pore-refining'],pigmentation:['an anti-dark-spot treatment','Dark spots'],sebum:['a mattifying treatment','Mattifying']},
    age:{'':['of any age','Any age'],u25:['under 25','Under 25'],'25':['aged 25 to 34','25 to 34'],'35':['aged 35 to 44','35 to 44'],'45':['aged 45 to 54','45 to 54'],'55':['aged 55 and over','55 and over']},
    univers:{'':['every kind of brand','Every kind'],luxe:['luxury houses','Luxury'],pharmacie:['pharmacy brands','Pharmacy'],normal:['everyday brands','Everyday'],'petit-prix':['affordable brands','Affordable']},
    pays:{'':['anywhere in the world','Anywhere'],FR:['in France','France'],US:['in the United States','United States'],KR:['in Korea','Korea'],EU:['elsewhere in Europe','Europe'],GB:['in the UK','United Kingdom'],JP:['in Japan','Japan'],AU:['in Australia','Australia'],CA:['in Canada','Canada']},
    ui:{head:'Before your scan',revenir:'← Back',son:'Sound',off:'off',on:'on',passer:'Skip, show me everything',fermer:'Close',lancer:'Start my scan',continuer:'Continue',
      toucher:'or tap a word in the sentence to change it',perim:'Your selection',pret:'Selection ready · {p} products',demarre:'Your scan is starting',
      question:'Question {n} of {t} · {p} products in your selection',laisse:'This choice leaves {p} products · {m}',tete:'{p} products · {m}',
      bilan:'{p} products · {m} selected for your scan',lancerP:'{p} products · {m} in your selection',prod:'products',sous:'products · {m} selected for your scan'},
    mais:function(k,n){return n(k)+' brand'+(k>1?'s':'');}
  },
  es:{
    q:[['Lo que busca','la cámara medirá el resto','Búsqueme un tratamiento ',''],
       ['Su edad','una sola respuesta',', para una piel de ',''],
       ['El tipo de marca','nunca se muestra ningún precio, ni aquí ni en sus resultados',', de ',''],
       ['País de origen','contado en el catálogo real',', procedente ','.']],
    goals:{antiage:['antiedad','Antiedad'],glow:['iluminador','Luminosidad'],hydration:['hidratante','Hidratante'],redness:['calmante','Calmante'],pores:['que afine los poros','Poros'],pigmentation:['antimanchas','Antimanchas'],sebum:['matificante','Matificante']},
    age:{'':['cualquier edad','Cualquier edad'],u25:['menos de 25 años','Menos de 25 años'],'25':['25 a 34 años','25 a 34 años'],'35':['35 a 44 años','35 a 44 años'],'45':['45 a 54 años','45 a 54 años'],'55':['55 años o más','55 años o más']},
    univers:{'':['cualquier tipo de marca','Todas'],luxe:['marcas de lujo','Lujo'],pharmacie:['marcas de farmacia','Farmacia'],normal:['marcas de uso diario','Día a día'],'petit-prix':['marcas asequibles','Asequibles']},
    pays:{'':['de todo el mundo','Todo el mundo'],FR:['de Francia','Francia'],US:['de Estados Unidos','Estados Unidos'],KR:['de Corea','Corea'],EU:['del resto de Europa','Europa'],GB:['del Reino Unido','Reino Unido'],JP:['de Japón','Japón'],AU:['de Australia','Australia'],CA:['de Canadá','Canadá']},
    ui:{head:'Antes de su escaneo',revenir:'← Volver',son:'Sonido',off:'apagado',on:'activo',passer:'Omitir, mostrarme todo',fermer:'Cerrar',lancer:'Iniciar mi escaneo',continuer:'Continuar',
      toucher:'o toque una palabra de la frase para cambiarla',perim:'Su selección',pret:'Selección lista · {p} productos',demarre:'Su escaneo comienza',
      question:'Pregunta {n} de {t} · {p} productos en su selección',laisse:'Esta opción deja {p} productos · {m}',tete:'{p} productos · {m}',
      bilan:'{p} productos · {m} para su escaneo',lancerP:'{p} productos · {m} en su selección',prod:'productos',sous:'productos · {m} para su escaneo'},
    mais:function(k,n){return n(k)+' marca'+(k>1?'s':'');}
  },
  it:{
    q:[['Cosa cerca','la fotocamera misurerà il resto','Mi trovi un trattamento ',''],
       ['La sua età','una sola risposta',', per una pelle di ',''],
       ['Il tipo di marca','nessun prezzo viene mai mostrato, né qui né nei risultati',', di ',''],
       ['Paese di origine','contato nel catalogo reale',', proveniente ','.']],
    goals:{antiage:['anti-età','Anti-età'],glow:['illuminante','Luminosità'],hydration:['idratante','Idratante'],redness:['lenitivo','Lenitivo'],pores:['che affini i pori','Pori'],pigmentation:['anti-macchie','Anti-macchie'],sebum:['opacizzante','Opacizzante']},
    age:{'':['ogni età','Ogni età'],u25:['meno di 25 anni','Meno di 25 anni'],'25':['25-34 anni','25-34 anni'],'35':['35-44 anni','35-44 anni'],'45':['45-54 anni','45-54 anni'],'55':['55 anni e oltre','55 anni e oltre']},
    univers:{'':['ogni tipo di marca','Tutte'],luxe:['marche di lusso','Lusso'],pharmacie:['marche da farmacia','Farmacia'],normal:['marche di tutti i giorni','Quotidiano'],'petit-prix':['marche accessibili','Accessibili']},
    pays:{'':['da tutto il mondo','Tutto il mondo'],FR:['dalla Francia','Francia'],US:['dagli Stati Uniti','Stati Uniti'],KR:['dalla Corea','Corea'],EU:['dal resto d’Europa','Europa'],GB:['dal Regno Unito','Regno Unito'],JP:['dal Giappone','Giappone'],AU:['dall’Australia','Australia'],CA:['dal Canada','Canada']},
    ui:{head:'Prima della scansione',revenir:'← Indietro',son:'Suono',off:'spento',on:'attivo',passer:'Salta, mostrami tutto',fermer:'Chiudi',lancer:'Avvia la mia scansione',continuer:'Continua',
      toucher:'oppure tocchi una parola della frase per cambiarla',perim:'La sua selezione',pret:'Selezione pronta · {p} prodotti',demarre:'La scansione sta per iniziare',
      question:'Domanda {n} di {t} · {p} prodotti nella sua selezione',laisse:'Questa scelta lascia {p} prodotti · {m}',tete:'{p} prodotti · {m}',
      bilan:'{p} prodotti · {m} per la sua scansione',lancerP:'{p} prodotti · {m} nella sua selezione',prod:'prodotti',sous:'prodotti · {m} per la sua scansione'},
    mais:function(k,n){return n(k)+(k>1?' marche':' marca');}
  },
  de:{
    q:[['Was Sie suchen','die Kamera misst den Rest','Finden Sie mir eine Pflege ',''],
       ['Ihr Alter','nur eine Antwort',', für Haut ',''],
       ['Die Art der Marke','es wird nie ein Preis angezeigt, weder hier noch in Ihren Ergebnissen',', von ',''],
       ['Herkunftsland','im echten Katalog gezählt',', aus ','.']],
    goals:{antiage:['gegen Hautalterung','Anti-Aging'],glow:['für mehr Ausstrahlung','Ausstrahlung'],hydration:['mit viel Feuchtigkeit','Feuchtigkeit'],redness:['zur Beruhigung','Beruhigend'],pores:['für feinere Poren','Poren'],pigmentation:['gegen Pigmentflecken','Pigmentflecken'],sebum:['zum Mattieren','Mattierend']},
    age:{'':['jeden Alters','Jedes Alter'],u25:['unter 25 Jahren','Unter 25'],'25':['von 25 bis 34 Jahren','25 bis 34'],'35':['von 35 bis 44 Jahren','35 bis 44'],'45':['von 45 bis 54 Jahren','45 bis 54'],'55':['ab 55 Jahren','Ab 55']},
    univers:{'':['Marken jeder Art','Alle'],luxe:['Luxusmarken','Luxus'],pharmacie:['Apothekenmarken','Apotheke'],normal:['Alltagsmarken','Alltag'],'petit-prix':['günstigen Marken','Günstig']},
    pays:{'':['aller Welt','Aller Welt'],FR:['Frankreich','Frankreich'],US:['den USA','USA'],KR:['Korea','Korea'],EU:['dem übrigen Europa','Europa'],GB:['Großbritannien','Großbritannien'],JP:['Japan','Japan'],AU:['Australien','Australien'],CA:['Kanada','Kanada']},
    ui:{head:'Vor Ihrem Scan',revenir:'← Zurück',son:'Ton',off:'aus',on:'an',passer:'Überspringen, alles zeigen',fermer:'Schließen',lancer:'Meinen Scan starten',continuer:'Weiter',
      toucher:'oder tippen Sie auf ein Wort im Satz, um es zu ändern',perim:'Ihre Auswahl',pret:'Auswahl bereit · {p} Produkte',demarre:'Ihr Scan startet',
      question:'Frage {n} von {t} · {p} Produkte in Ihrer Auswahl',laisse:'Diese Wahl lässt {p} Produkte · {m}',tete:'{p} Produkte · {m}',
      bilan:'{p} Produkte · {m} für Ihren Scan',lancerP:'{p} Produkte · {m} in Ihrer Auswahl',prod:'Produkte',sous:'Produkte · {m} für Ihren Scan'},
    mais:function(k,n){return n(k)+(k>1?' Marken':' Marke');}
  },
  pt:{
    q:[['O que procura','a câmara medirá o resto','Encontre-me um cuidado ',''],
       ['A sua idade','uma só resposta',', para uma pele de ',''],
       ['O tipo de marca','nunca é mostrado nenhum preço, nem aqui nem nos seus resultados',', de ',''],
       ['País de origem','contado no catálogo real',', vindo ','.']],
    goals:{antiage:['antienvelhecimento','Antienvelhecimento'],glow:['iluminador','Luminosidade'],hydration:['hidratante','Hidratante'],redness:['calmante','Calmante'],pores:['que afine os poros','Poros'],pigmentation:['antimanchas','Antimanchas'],sebum:['matificante','Matificante']},
    age:{'':['qualquer idade','Qualquer idade'],u25:['menos de 25 anos','Menos de 25 anos'],'25':['25 a 34 anos','25 a 34 anos'],'35':['35 a 44 anos','35 a 44 anos'],'45':['45 a 54 anos','45 a 54 anos'],'55':['55 anos ou mais','55 anos ou mais']},
    univers:{'':['qualquer tipo de marca','Todas'],luxe:['marcas de luxo','Luxo'],pharmacie:['marcas de farmácia','Farmácia'],normal:['marcas do dia a dia','Dia a dia'],'petit-prix':['marcas acessíveis','Acessíveis']},
    pays:{'':['de todo o mundo','Todo o mundo'],FR:['de França','França'],US:['dos Estados Unidos','Estados Unidos'],KR:['da Coreia','Coreia'],EU:['do resto da Europa','Europa'],GB:['do Reino Unido','Reino Unido'],JP:['do Japão','Japão'],AU:['da Austrália','Austrália'],CA:['do Canadá','Canadá']},
    ui:{head:'Antes do seu scan',revenir:'← Voltar',son:'Som',off:'desligado',on:'ligado',passer:'Saltar, mostrar tudo',fermer:'Fechar',lancer:'Iniciar o meu scan',continuer:'Continuar',
      toucher:'ou toque numa palavra da frase para a mudar',perim:'A sua seleção',pret:'Seleção pronta · {p} produtos',demarre:'O seu scan vai começar',
      question:'Pergunta {n} de {t} · {p} produtos na sua seleção',laisse:'Esta escolha deixa {p} produtos · {m}',tete:'{p} produtos · {m}',
      bilan:'{p} produtos · {m} para o seu scan',lancerP:'{p} produtos · {m} na sua seleção',prod:'produtos',sous:'produtos · {m} para o seu scan'},
    mais:function(k,n){return n(k)+' marca'+(k>1?'s':'');}
  },
  nl:{
    q:[['Wat u zoekt','de camera meet de rest','Zoek voor mij een ',''],
       ['Uw leeftijd','één antwoord',', voor een huid van ',''],
       ['Het soort merk','er wordt nooit een prijs getoond, hier noch in uw resultaten',', van ',''],
       ['Land van herkomst','geteld in de echte catalogus',', uit ','.']],
    goals:{antiage:['anti-aging verzorging','Anti-aging'],glow:['verzorging voor meer glans','Glans'],hydration:['hydraterende verzorging','Hydraterend'],redness:['kalmerende verzorging','Kalmerend'],pores:['poriënverfijnende verzorging','Poriën'],pigmentation:['verzorging tegen pigmentvlekken','Pigmentvlekken'],sebum:['matterende verzorging','Matterend']},
    age:{'':['elke leeftijd','Elke leeftijd'],u25:['jonger dan 25','Jonger dan 25'],'25':['25 tot 34 jaar','25 tot 34 jaar'],'35':['35 tot 44 jaar','35 tot 44 jaar'],'45':['45 tot 54 jaar','45 tot 54 jaar'],'55':['55 jaar en ouder','55 jaar en ouder']},
    univers:{'':['elk soort merk','Alle'],luxe:['luxemerken','Luxe'],pharmacie:['apotheekmerken','Apotheek'],normal:['merken voor elke dag','Dagelijks'],'petit-prix':['betaalbare merken','Betaalbaar']},
    pays:{'':['de hele wereld','Hele wereld'],FR:['Frankrijk','Frankrijk'],US:['de Verenigde Staten','Verenigde Staten'],KR:['Korea','Korea'],EU:['de rest van Europa','Europa'],GB:['het Verenigd Koninkrijk','Verenigd Koninkrijk'],JP:['Japan','Japan'],AU:['Australië','Australië'],CA:['Canada','Canada']},
    ui:{head:'Voor uw scan',revenir:'← Terug',son:'Geluid',off:'uit',on:'aan',passer:'Overslaan, toon alles',fermer:'Sluiten',lancer:'Start mijn scan',continuer:'Verder',
      toucher:'of tik op een woord in de zin om het te wijzigen',perim:'Uw selectie',pret:'Selectie klaar · {p} producten',demarre:'Uw scan begint',
      question:'Vraag {n} van {t} · {p} producten in uw selectie',laisse:'Deze keuze laat {p} producten · {m}',tete:'{p} producten · {m}',
      bilan:'{p} producten · {m} voor uw scan',lancerP:'{p} producten · {m} in uw selectie',prod:'producten',sous:'producten · {m} voor uw scan'},
    mais:function(k,n){return n(k)+(k>1?' merken':' merk');}
  },
  ru:{
    q:[['Что вы ищете','остальное измерит камера','Подберите мне ',''],
       ['Ваш возраст','только один ответ',', для кожи ',''],
       ['Тип марки','цены не показываются нигде — ни здесь, ни в результатах',', от ',''],
       ['Страна происхождения','посчитано по реальному каталогу',', из ','.']],
    goals:{antiage:['антивозрастной уход','Антивозрастной'],glow:['уход для сияния кожи','Сияние'],hydration:['увлажняющий уход','Увлажнение'],redness:['успокаивающий уход','Успокаивающий'],pores:['уход для сужения пор','Поры'],pigmentation:['уход против пигментных пятен','Пигментация'],sebum:['матирующий уход','Матирующий']},
    age:{'':['любого возраста','Любой возраст'],u25:['до 25 лет','До 25 лет'],'25':['25–34 лет','25–34 года'],'35':['35–44 лет','35–44 года'],'45':['45–54 лет','45–54 года'],'55':['от 55 лет','От 55 лет']},
    univers:{'':['марок любого типа','Все'],luxe:['люксовых марок','Люкс'],pharmacie:['аптечных марок','Аптечные'],normal:['марок на каждый день','Повседневные'],'petit-prix':['доступных марок','Доступные']},
    pays:{'':['любой страны мира','Весь мир'],FR:['Франции','Франция'],US:['США','США'],KR:['Кореи','Корея'],EU:['других стран Европы','Европа'],GB:['Великобритании','Великобритания'],JP:['Японии','Япония'],AU:['Австралии','Австралия'],CA:['Канады','Канада']},
    ui:{head:'Перед сканированием',revenir:'← Назад',son:'Звук',off:'выкл.',on:'вкл.',passer:'Пропустить, показать всё',fermer:'Закрыть',lancer:'Начать сканирование',continuer:'Далее',
      toucher:'или нажмите на слово во фразе, чтобы изменить его',perim:'Ваш выбор',pret:'Выбор готов · средств: {p}',demarre:'Сканирование начинается',
      question:'Вопрос {n} из {t} · средств в вашем выборе: {p}',laisse:'Этот выбор оставляет средств: {p} · {m}',tete:'Средств: {p} · {m}',
      bilan:'Средств: {p} · {m} для сканирования',lancerP:'Средств: {p} · {m}',prod:'средств',sous:'средств · {m} для сканирования'},
    mais:function(k,n){return 'марок: '+n(k);}
  },
  ar:{
    q:[['ما تبحثون عنه','ستقيس الكاميرا الباقي','ابحثوا لي عن عناية ',''],
       ['عمركم','إجابة واحدة فقط','، لبشرة ',''],
       ['نوع العلامة','لن يُعرض أي سعر، لا هنا ولا في نتائجكم','، من ',''],
       ['بلد المنشأ','محسوب من الكتالوج الحقيقي','، مصدرها ','.']],
    goals:{antiage:['مضادة للشيخوخة','مضاد للشيخوخة'],glow:['تمنح الإشراقة','الإشراقة'],hydration:['مرطبة','الترطيب'],redness:['مهدئة','مهدئ'],pores:['تنقّي المسام','المسام'],pigmentation:['مضادة للبقع','البقع'],sebum:['مطفئة للمعان','مطفئ للمعان']},
    age:{'':['من أي عمر','أي عمر'],u25:['دون 25 عامًا','دون 25'],'25':['من 25 إلى 34 عامًا','25 إلى 34'],'35':['من 35 إلى 44 عامًا','35 إلى 44'],'45':['من 45 إلى 54 عامًا','45 إلى 54'],'55':['من 55 عامًا فما فوق','55 فما فوق']},
    univers:{'':['كل أنواع العلامات','الكل'],luxe:['علامات فاخرة','فاخرة'],pharmacie:['علامات الصيدليات','صيدلية'],normal:['علامات للاستخدام اليومي','يومية'],'petit-prix':['علامات بأسعار معقولة','بأسعار معقولة']},
    pays:{'':['من كل أنحاء العالم','كل العالم'],FR:['فرنسا','فرنسا'],US:['الولايات المتحدة','الولايات المتحدة'],KR:['كوريا','كوريا'],EU:['بقية أوروبا','أوروبا'],GB:['المملكة المتحدة','المملكة المتحدة'],JP:['اليابان','اليابان'],AU:['أستراليا','أستراليا'],CA:['كندا','كندا']},
    ui:{head:'قبل الفحص',revenir:'رجوع →',son:'الصوت',off:'مطفأ',on:'مفعّل',passer:'تخطٍّ، اعرض كل شيء',fermer:'إغلاق',lancer:'ابدأ الفحص',continuer:'متابعة',
      toucher:'أو المس كلمة في الجملة لتغييرها',perim:'اختياركم',pret:'الاختيار جاهز · المنتجات: {p}',demarre:'يبدأ الفحص الآن',
      question:'السؤال {n} من {t} · المنتجات في اختياركم: {p}',laisse:'هذا الخيار يُبقي المنتجات: {p} · {m}',tete:'المنتجات: {p} · {m}',
      bilan:'المنتجات: {p} · {m} لفحصكم',lancerP:'المنتجات: {p} · {m}',prod:'منتجات',sous:'منتجات · {m} لفحصكم'},
    mais:function(k,n){return 'العلامات: '+n(k);}
  },
  ja:{
    q:[['お探しのケア','あとはカメラが測定します','探しているのは、','のスキンケア'],
       ['年齢','ひとつだけ選択','、','の肌向け'],
       ['ブランドのタイプ','価格は一切表示しません','、','ブランドの'],
       ['原産国','実際のカタログで集計','、','。']],
    goals:{antiage:['エイジングケア','エイジングケア'],glow:['透明感','透明感'],hydration:['保湿','保湿'],redness:['鎮静','鎮静'],pores:['毛穴ケア','毛穴ケア'],pigmentation:['シミ対策','シミ対策'],sebum:['皮脂コントロール','皮脂コントロール']},
    age:{'':['あらゆる年代','すべての年代'],u25:['25歳未満','25歳未満'],'25':['25〜34歳','25〜34歳'],'35':['35〜44歳','35〜44歳'],'45':['45〜54歳','45〜54歳'],'55':['55歳以上','55歳以上']},
    univers:{'':['あらゆるタイプの','すべてのタイプ'],luxe:['ラグジュアリー','ラグジュアリー'],pharmacie:['ファーマシー','ファーマシー'],normal:['デイリー','デイリー'],'petit-prix':['プチプラ','プチプラ']},
    pays:{'':['産地を問わないもの','世界中'],FR:['フランス製のもの','フランス'],US:['アメリカ製のもの','アメリカ'],KR:['韓国製のもの','韓国'],EU:['ヨーロッパ製のもの','ヨーロッパ'],GB:['イギリス製のもの','イギリス'],JP:['日本製のもの','日本'],AU:['オーストラリア製のもの','オーストラリア'],CA:['カナダ製のもの','カナダ']},
    ui:{head:'スキャンの前に',revenir:'← 戻る',son:'サウンド',off:'オフ',on:'オン',passer:'スキップしてすべて表示',fermer:'閉じる',lancer:'スキャンを開始',continuer:'次へ',
      toucher:'文中の言葉をタップすると変更できます',perim:'あなたの条件',pret:'条件がそろいました · {p}点',demarre:'スキャンを開始します',
      question:'質問 {n} / {t} · 条件内の製品 {p}点',laisse:'この選択で {p}点 · {m}',tete:'{p}点 · {m}',
      bilan:'{p}点 · {m}でスキャンします',lancerP:'{p}点 · {m}',prod:'点',sous:'点 · {m}でスキャン'},
    mais:function(k,n){return n(k)+'ブランド';}
  },
  ko:{
    q:[['찾으시는 케어','나머지는 카메라가 측정합니다','저에게 ',' 케어를'],
       ['연령','하나만 선택',', ',' 피부에 맞게'],
       ['브랜드 유형','가격은 어디에도 표시되지 않습니다',', ',' 브랜드 중에서'],
       ['원산지','실제 카탈로그 기준',', ',' 제품으로 찾아 주세요.']],
    goals:{antiage:['안티에이징','안티에이징'],glow:['광채','광채'],hydration:['보습','보습'],redness:['진정','진정'],pores:['모공','모공'],pigmentation:['잡티','잡티'],sebum:['피지 조절','피지 조절']},
    age:{'':['모든 연령대','모든 연령대'],u25:['25세 미만','25세 미만'],'25':['25~34세','25~34세'],'35':['35~44세','35~44세'],'45':['45~54세','45~54세'],'55':['55세 이상','55세 이상']},
    univers:{'':['모든 유형의','모든 유형'],luxe:['럭셔리','럭셔리'],pharmacie:['약국','약국'],normal:['데일리','데일리'],'petit-prix':['합리적인 가격대의','합리적인 가격대']},
    pays:{'':['전 세계','전 세계'],FR:['프랑스','프랑스'],US:['미국','미국'],KR:['한국','한국'],EU:['유럽','유럽'],GB:['영국','영국'],JP:['일본','일본'],AU:['호주','호주'],CA:['캐나다','캐나다']},
    ui:{head:'스캔 전에',revenir:'← 이전',son:'사운드',off:'끔',on:'켬',passer:'건너뛰고 모두 보기',fermer:'닫기',lancer:'스캔 시작',continuer:'다음',
      toucher:'문장의 단어를 누르면 바꿀 수 있습니다',perim:'선택한 범위',pret:'범위 준비 완료 · 제품 {p}개',demarre:'스캔을 시작합니다',
      question:'질문 {n} / {t} · 범위 내 제품 {p}개',laisse:'이 선택으로 제품 {p}개 · {m}',tete:'제품 {p}개 · {m}',
      bilan:'제품 {p}개 · {m}로 스캔합니다',lancerP:'제품 {p}개 · {m}',prod:'개',sous:'개 제품 · {m}로 스캔'},
    mais:function(k,n){return '브랜드 '+n(k)+'개';}
  },
  zh:{
    q:[['您要找的护理','其余交给镜头测量','请为我找一款','护肤品'],
       ['您的年龄','只选一项','，适合','的肌肤'],
       ['品牌类型','任何地方都不会显示价格','，来自','品牌'],
       ['原产地','按真实目录统计','，产自','。']],
    goals:{antiage:['抗老','抗老'],glow:['提亮','提亮'],hydration:['保湿','保湿'],redness:['舒缓','舒缓'],pores:['细致毛孔','细致毛孔'],pigmentation:['淡斑','淡斑'],sebum:['控油','控油']},
    age:{'':['各个年龄段','各个年龄段'],u25:['25岁以下','25岁以下'],'25':['25–34岁','25–34岁'],'35':['35–44岁','35–44岁'],'45':['45–54岁','45–54岁'],'55':['55岁及以上','55岁及以上']},
    univers:{'':['各类','各类'],luxe:['奢华','奢华'],pharmacie:['药妆','药妆'],normal:['日常','日常'],'petit-prix':['平价','平价']},
    pays:{'':['世界各地','世界各地'],FR:['法国','法国'],US:['美国','美国'],KR:['韩国','韩国'],EU:['欧洲其他国家','欧洲'],GB:['英国','英国'],JP:['日本','日本'],AU:['澳大利亚','澳大利亚'],CA:['加拿大','加拿大']},
    ui:{head:'扫描之前',revenir:'← 返回',son:'声音',off:'关',on:'开',passer:'跳过，全部显示',fermer:'关闭',lancer:'开始扫描',continuer:'继续',
      toucher:'或点击句中的词语进行修改',perim:'您的范围',pret:'范围已就绪 · {p} 款产品',demarre:'扫描即将开始',
      question:'第 {n} 题，共 {t} 题 · 范围内 {p} 款产品',laisse:'此选择保留 {p} 款产品 · {m}',tete:'{p} 款产品 · {m}',
      bilan:'{p} 款产品 · {m}，用于您的扫描',lancerP:'{p} 款产品 · {m}',prod:'款',sous:'款产品 · {m}，用于扫描'},
    mais:function(k,n){return n(k)+' 个品牌';}
  }
  };
  if(!D[lang]) lang='fr';
  var d=D[lang];
  function fmt(x){ if(lang==='fr') return String(x).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
    try{ return new Intl.NumberFormat(lang==='ar'?'ar-u-nu-latn':lang).format(x);}catch(e){return String(x);} }
  function t(k,v){ var s=d.ui[k]||D.fr.ui[k]||k; if(v) for(var x in v) s=s.split('{'+x+'}').join(v[x]); return s; }
  return {
    lang:lang, d:d, rtl:lang==='ar', cjk:/^(ja|zh)$/.test(lang), lieParMot:lang==='ar', EX:EX, fmt:fmt, t:t,
    mais:function(k,n){ return d.mais(k,n||fmt); },
    retenue:function(k){ return d.retenue?d.retenue(k):''; },
    mot:function(cle,v){ var m=(d[cle]||{})[v]; return m?m[0]:v; },
    label:function(cle,v){ var m=(d[cle]||{})[v]; return m?m[1]:null; }
  };
})();
if(window.VYL.rtl){ document.documentElement.setAttribute('dir','rtl'); }
document.documentElement.setAttribute('lang', window.VYL.lang);
