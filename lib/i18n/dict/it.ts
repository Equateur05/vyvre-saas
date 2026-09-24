/**
 * VYVRE — dizionario italiano delle pagine Next (marchi, accuracy, pricing, legale).
 *
 * Il francese è la fonte: ogni chiave aggiunta lì va aggiunta anche negli altri
 * undici file di /lib/i18n/dict. Ciò che non si traduce mai resta nel
 * JSX: nomi di marchi, « VYVRE », « skin intelligence », titoli di articoli
 * scientifici, nomi di riviste, estratti di codice, cifre e prezzi in euro.
 */

const it = {
  /* ─────────── comune: intestazione, piè di pagina, selettore ─────────── */
  'lang.aria': 'Scegli la lingua',
  'nav.manifeste': 'Manifesto',
  'nav.method': 'Metodo',
  'nav.demo': 'Prova lo scan',
  'nav.pricing': 'Prezzi',

  'footer.city': 'VYVRE · Parigi',
  'footer.cityFull': 'VYVRE · Parigi, Francia',
  'footer.book': 'Prenota 20 min →',
  'footer.manifeste': 'Manifesto',
  'footer.method': 'Metodologia',
  'footer.cgv': 'Condizioni generali di vendita',
  'footer.legal': 'Note legali',
  'footer.privacy': 'Privacy',
  'footer.privacyGdpr': 'Privacy · GDPR',
  'footer.dpa': 'DPA',
  'footer.contact': 'Contatto',
  'footer.home': 'Home',
  'footer.rights': 'Tutti i diritti riservati',
  'footer.company': 'SAS con capitale di 1.000 € · Parigi, Francia · SIREN in corso',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Diagnosi della pelle misurata, per i marchi di cosmesi',
  'home.meta.desc':
    'L’unica diagnosi della pelle con un prezzo pubblico. Infrastruttura in Francia, GDPR nativo, elaborazione sul dispositivo, nessuna foto caricata.',

  'home.hero.eyebrow': 'Diagnosi della pelle misurata',
  'home.hero.h1a': 'La diagnosi della pelle',
  'home.hero.h1b': 'della vostra maison.',
  'home.hero.p':
    'Meno di dieci secondi di fotocamera. Otto misure lette pixel per pixel. Una routine composta unicamente nel vostro catalogo.',
  'home.hero.cta1': 'Prova lo scan',
  'home.hero.cta2': 'Dotare il mio marchio',

  'home.stat1': 'Misure della pelle',
  'home.stat2': 'Durata dello scan',
  'home.stat3': 'Messa online',
  'home.stat4': 'Foto conservata',

  'home.man.h2a': 'Misurata,',
  'home.man.h2b': 'non indovinata.',
  'home.man.p':
    'Il motore converte ogni zona del viso in coordinate CIE L*a*b*, poi in indici dermatologici. Nessuna stima a partire da un filtro: una lettura ottica, riproducibile, documentata.',
  'home.man.link': 'Leggi la metodologia →',

  'home.mes.h2a': 'Otto misure.',
  'home.mes.h2b': 'Una sola lettura.',
  'home.mes.1.n': 'Carnagione',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Luminosità',
  'home.mes.2.u': 'Luminanza L*',
  'home.mes.3.n': 'Rossori',
  'home.mes.3.u': 'Indice di eritema',
  'home.mes.4.n': 'Uniformità',
  'home.mes.4.u': 'Deviazione standard cromatica',
  'home.mes.5.n': 'Texture',
  'home.mes.5.u': 'Micro-contrasto locale',
  'home.mes.6.n': 'Pori',
  'home.mes.6.u': 'Densità dei minimi',
  'home.mes.7.n': 'Sebo',
  'home.mes.7.u': 'Riflessione speculare',
  'home.mes.8.n': 'Idratazione',
  'home.mes.8.u': 'Proxy TEWL ottico',

  'home.steps.h2a': 'Tre passaggi.',
  'home.steps.h2b': 'Zero attrito.',
  'home.step1.t': 'La cliente esegue lo scan',
  'home.step1.d':
    'Fotocamera dello smartphone o della postazione consulenza. Niente da installare, niente da caricare: l’immagine viene elaborata e poi cancellata.',
  'home.step2.t': 'Il motore compone',
  'home.step2.d':
    'Una routine mattino e sera tratta unicamente dal vostro catalogo, ordinata secondo le misure e le vostre priorità commerciali.',
  'home.step3.t': 'Andate online',
  'home.step3.d':
    'Una riga di script sul vostro sito, i vostri colori, il vostro carattere tipografico. Nessuno sviluppatore da mobilitare da voi.',

  'home.groupe.eyebrow': 'Per i gruppi',
  'home.groupe.h2a': 'Una maison, dieci marchi,',
  'home.groupe.h2b': 'un solo motore.',
  'home.socle1.t': 'Multi-marchio',
  'home.socle1.d':
    'Uno spazio per marchio: catalogo, identità visiva, regole di raccomandazione e statistiche separati.',
  'home.socle2.t': 'Sovranità',
  'home.socle2.d':
    'Hosting in Francia, GDPR nativo, DPA firmato, nessuna immagine conservata, nessun pixel di terze parti.',
  'home.socle3.t': 'Boutique ed e-shop',
  'home.socle3.d':
    'Lo stesso motore al banco su tablet e sulla scheda prodotto, con lo stesso riferimento di misure.',

  'home.price.h2a': 'Da 299 €/mese.',
  'home.price.h2b': 'Prezzo esposto.',
  'home.price.cta': 'Vedi i piani',

  'home.faq.h2': 'Domande.',
  'home.faq1.q': 'Come arriva il mio catalogo nel motore?',
  'home.faq1.a':
    'Tramite un flusso CSV o l’API del vostro e-commerce (Shopify, Salesforce Commerce, Centra). Nessun accesso amministratore, sincronizzazione ogni notte.',
  'home.faq2.q': 'Che fine fa l’immagine della cliente?',
  'home.faq2.a':
    'Viene analizzata in memoria e poi cancellata: nessuna foto viene archiviata né trasmessa. Hosting in Francia, DPA disponibile.',
  'home.faq3.q': 'Il motore può raccomandare un concorrente?',
  'home.faq3.a':
    'No. La routine è composta esclusivamente nel vostro catalogo, con le priorità che stabilite voi.',
  'home.faq4.q': 'Quale attrezzatura serve?',
  'home.faq4.a':
    'Basta una fotocamera 720p, su mobile come su computer. I risultati guadagnano in finezza sui sensori recenti.',

  'home.cta.h2': 'Vedere lo scan sul vostro catalogo.',
  'home.cta.1': 'Avvia la demo',
  'home.cta.2': 'Richiedi una demo',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Metodologia e precisione · VYVRE',
  'acc.meta.desc':
    'Fonti con revisione paritaria (5 applicate, 4 in roadmap), metodo di calcolo, intervalli di confidenza, limiti. La trasparenza scientifica dietro il motore VYVRE v7.0.',

  'acc.hero.eyebrow': 'Metodologia · Fonti · Limiti',
  'acc.hero.h1a': 'La scienza',
  'acc.hero.h1b': 'dietro lo scan.',
  'acc.hero.p':
    'Otto misure lette dall’immagine. Qui: le fonti scientifiche, il metodo di calcolo, gli intervalli di confidenza e i limiti del motore.',
  'acc.hero.note1':
    'Precisione stimata ±5 anni età biologica · ±4 anni età percepita (IC 95 % · coorte interna n=12)',
  'acc.hero.note2':
    'Validazione esterna n=100 prevista per fine 2026 · revisione maggio 2026 dopo audit interno',

  'acc.s1.eyebrow': '01 · Bibliografia · Fonti applicate',
  'acc.s1.h2a': '5 fonti con revisione paritaria',
  'acc.s1.h2b': 'attivamente applicate.',
  'acc.s1.p1': 'Queste 5 fonti sono utilizzate direttamente nelle formule di calcolo del motore (cfr.',
  'acc.s1.p2': ', funzione',
  'acc.s1.p3': 'e',
  'acc.s1.p4': '). Ogni biomarcatore è tracciabile fino a un articolo scientifico indicizzato su PubMed.',
  'acc.s1.foot1': 'Motore v7 — revisione maggio 2026',
  'acc.s1.foot2': 'Fonti applicate verificabili riga per riga in',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — base del rilevamento automatico del fototipo Fitzpatrick I-VI',
  'acc.src2.c':
    'Melanin Index (MI) ed Erythema Index (EI) — quantificazione della pigmentazione e del rossore',
  'acc.src3.c':
    'Proxy TEWL (perdita insensibile di acqua) tramite σL* → indici idratazione e pori. Regressione tabella 3.',
  'acc.src4.c':
    'Riflessi speculari → luminosità / sebo. Rilevamento dei riflessi speculari sul viso',
  'acc.src5.c':
    'Scarto età percepita / età biologica (coorte caucasica ~1.700 soggetti). v7: scarto dipendente dall’età (da −2 a −6 anni secondo l’età biologica), non legato al fototipo.',

  'acc.s2.eyebrow': '02 · Bibliografia · Roadmap fine 2026',
  'acc.s2.h2a': '4 fonti citate',
  'acc.s2.h2b': 'non ancora pienamente applicate.',
  'acc.s2.p':
    'Queste fonti sono citate per trasparenza e per la roadmap pubblica. I loro coefficienti completi non sono ancora integrati nelle formule — estrazione e validazione previste per fine 2026 con un dermatologo partner.',
  'acc.rm.appliedLabel': 'Applicato parzialmente: ',
  'acc.rm.roadmapLabel': 'Roadmap: ',
  'acc.rm1.a':
    'Età di ancoraggio 40 (mediana della coorte adulta) + correlazione r=0,78 rughe periorbitali ↔ età',
  'acc.rm1.r':
    'Estrazione immagini → grado morfologico 0-5 (scala Bazin) non ancora implementata. Prevista per fine 2026.',
  'acc.rm2.a': 'Aggiustamento moderato da −4 % a −8 % sull’età biologica per i fototipi IV-VI',
  'acc.rm2.r':
    'Coefficienti completi per fototipo per rughe / tonicità / pigmentazione non ancora estratti.',
  'acc.rm3.a': 'Citato per il contesto multietnico',
  'acc.rm3.r':
    'Coefficienti specifici non ancora estratti. Validazione su coorte multietnica prevista per fine 2026.',
  'acc.rm4.a': 'Norme cliniche TEWL di riferimento (sana ≤ 15 g/m²/h, alterata ≥ 25)',
  'acc.rm4.r':
    'Il calcolo numerico σL* → TEWL segue Stamatas 2011 (e non Akdeniz). Validazione incrociata prevista.',

  'acc.bench.eyebrow': 'Benchmark pubblico · UTKFace · 26 maggio 2026',
  'acc.bench.h2a': 'Confrontato pubblicamente',
  'acc.bench.h2b': 'con 3 riferimenti open source.',
  'acc.bench.p':
    'VYVRE v7.0 testato su 300 volti pubblici UTKFace (stratificati 18-80 anni) accanto a DeepFace, InsightFace e OpenCV DNN. Verdetto pubblicato senza ritocchi, codice riproducibile, 5 script, 4 min di esecuzione.',
  'acc.bench.k1.l': '30-44 (obiettivo)',
  'acc.bench.k1.n': 'MAE — davanti a OpenCV (8,66 anni)',
  'acc.bench.k2.l': 'Insieme (18-80)',
  'acc.bench.k2.n': 'MAE — dietro alle reti profonde',
  'acc.bench.k3.l': 'Bias con segno',
  'acc.bench.k3.n': 'Il più neutro dei 4 motori',
  'acc.bench.cta': 'Vedi il benchmark completo →',

  'acc.s3.eyebrow': '03 · Standard colorimetrici (fondamenta)',
  'acc.s3.p':
    'Standard normativi sottostanti — non articoli con revisione paritaria, ma specifiche tecniche attive nella catena di elaborazione.',
  'acc.s3.std1': 'Spazio colorimetrico sRGB (decodifica gamma)',
  'acc.s3.std2': 'Primari RGB Rec. 709',
  'acc.s3.std3': 'Conversione XYZ → L*a*b*',
  'acc.s3.std4': 'Limiti Fitzpatrick per ITA°',
  'acc.s3.std5': 'Rilevamento dei pixel di pelle YCbCr',
  'acc.s3.std6': 'Misura di nitidezza laplaciana',
  'acc.s3.std7':
    'Correlazione tonicità ↔ età percepita (r=0,65 tra distanza ITA° e tonicità percepita)',

  'acc.s4.eyebrow': '04 · Catena di elaborazione',
  'acc.s4.h2': 'Metodo di calcolo.',
  'acc.st1.t': 'Acquisizione dell’immagine',
  'acc.st1.d':
    'Webcam standard (≥ 720p). Meno di 10 secondi di acquisizione, 8 immagini trattenute. Rilevamento del viso con face-api.js (68 punti di riferimento). Ritaglio della zona facciale e correzione della luce.',
  'acc.st2.t': 'Conversione colorimetrica',
  'acc.st2.d':
    'Catena sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Autotest su 6 colori di riferimento a ogni scan. Precisione al pixel.',
  'acc.st3.t': 'Estrazione dei segnali',
  'acc.st3.d':
    'ITA° + Melanin Index + Erythema Index + proxy TEWL + rapporto speculare. 4 zone del viso analizzate (fronte, guance sinistra e destra, zona T).',
  'acc.st4.t': 'Conversione in biomarcatori',
  'acc.st4.d':
    'Ogni segnale grezzo convertito in un punteggio 0-100 da formule con revisione paritaria (citazioni qui sopra). Costanti nominate con la loro fonte, o segnalate come empiriche.',
  'acc.st5.t': 'Rilevamento del fototipo',
  'acc.st5.d':
    'Classificazione automatica Fitzpatrick I-VI tramite ITA° (Chardon 1991). Soglie di pigmentazione adattate al fototipo per evitare il bias sulle pelli scure.',
  'acc.st6.t': 'Stima dell’età + intervallo',
  'acc.st6.d':
    'Formula a biomarcatore unico (rughe periorbitali dominanti, Bazin 2007). Scarto di età percepita dipendente dall’età (Vierkötter 2012). Intervallo ±5 anni (95 %, coorte interna n=12).',

  'acc.s5.eyebrow': '05 · Età della pelle · Metodo v7',
  'acc.s5.h2a': 'Età della pelle percepita',
  'acc.s5.h2b': 'o età biologica grezza.',
  'acc.s5.p': 'Due numeri vengono calcolati, uno solo viene mostrato. Ecco perché.',
  'acc.age.l.tag': 'Mostrata — Età della pelle',
  'acc.age.l.h3': 'Età percepita visivamente',
  'acc.age.l.p':
    'Età media percepita socialmente da un osservatore umano. Calibrata su Vierkötter & Krutmann 2012 (coorte caucasica ~1.700 soggetti) con uno scarto',
  'acc.age.l.pEm': 'dipendente dall’età',
  'acc.age.l.li1': '< 30 anni bio → −2 anni',
  'acc.age.l.li2': '30-45 anni bio → −4 anni',
  'acc.age.l.li3': '45-60 anni bio → −5 anni',
  'acc.age.l.li4': '60 anni e + bio → da −5 a −6 anni',
  'acc.age.l.note':
    'La v7 elimina la corrispondenza per fototipo della v6, assente dalla fonte originale. Il fototipo influenza l’età biologica (Diridollou), non la percezione sociale.',
  'acc.age.r.tag': 'Interna — Età biologica',
  'acc.age.r.h3': 'Età biologica grezza',
  'acc.age.r.p':
    'Stima diretta dello stato fisico della pelle tramite il punteggio di rughe dominante (rughe periorbitali, Bazin 2007). Correlazione r=0,78 con l’età cronologica su foto in studio.',
  'acc.age.r.note1': 'Formula v7:',
  'acc.age.r.note2':
    'Il fattore 0,85 (penalità webcam JPEG) è una compensazione empirica dichiarata; validazione su coorte ampia prevista per fine 2026.',
  'acc.age.prec1': 'Precisione stimata:',
  'acc.age.prec.bio': '±5 anni età biologica',
  'acc.age.prec.perc': '±4 anni età percepita',
  'acc.age.prec2': '(IC 95 % su coorte interna n=12)',
  'acc.age.prec3': 'Validazione esterna n=100 prevista per fine 2026',

  'acc.s6.eyebrow': '06 · Comportamento secondo la qualità · v7',
  'acc.s6.h2a': '3 livelli di confidenza.',
  'acc.s6.h2b': 'Nessun compromesso lusinghiero.',
  'acc.s6.p':
    'La v7 elimina la correzione v6.2 che ringiovaniva artificialmente gli scan degradati (paradosso « meno il motore vede, più lusinga »). Al suo posto, 3 livelli di confidenza espliciti.',
  'acc.q1.tag': 'Qualità < 40',
  'acc.q1.h3': 'Scan rifiutato',
  'acc.q1.p1': 'Nessuna stima pubblicata. Messaggio',
  'acc.q1.p2':
    'con la raccomandazione di rifare lo scan con una luce migliore. La stima non viene calcolata.',
  'acc.q2.tag': '40 ≤ Qualità < 60',
  'acc.q2.h3': 'Confidenza bassa',
  'acc.q2.p1': 'Stima al meglio pubblicata, ma segnalata',
  'acc.q2.p2':
    '. Intervallo allargato a ±7 anni (contro ±5 di standard). La stima resta onesta, non spostata.',
  'acc.q3.tag': 'Qualità ≥ 60',
  'acc.q3.h3': 'Standard',
  'acc.q3.p1': 'Stima standard con',
  'acc.q3.p2':
    '. Intervallo ±5 anni (95 % su coorte interna n=12). Comportamento nominale per una webcam HD ben illuminata.',
  'acc.s6.foot1': 'Correzione v6.2 rimossa: −5 anni su uno scan degradato (qualità < 45)',
  'acc.s6.foot2':
    'La v7 allarga l’intervallo invece di spostare la stima (l’onestà invece della lusinga)',

  'acc.s7.eyebrow': '07 · Test di varianza',
  'acc.s7.h2': 'Riproducibilità.',
  'acc.s7.p':
    'Test: stesso soggetto scansionato 10 volte in 10 condizioni di luce differenti. Misura della deviazione standard dei punteggi. Coorte interna n=12.',
  'acc.var1': 'Rughe',
  'acc.var2': 'Tonicità',
  'acc.var3': 'Pigmentazione',
  'acc.var4': 'Idratazione',
  'acc.var5': 'Luminosità',
  'acc.var6': 'Pori',
  'acc.var7': 'Rossore',
  'acc.var8': 'Età percepita',
  'acc.var.unitPts': 'pt/100',
  'acc.var.unitYears': 'anni',
  'acc.s7.foot1':
    'Coorte interna · n=12 soggetti fototipi I-IV · 10 scan/soggetto · luce variabile · webcam HD 720p',
  'acc.s7.foot2':
    'Fototipi V-VI: estrapolazione Diridollou 2007 — validazione su coorte dedicata prevista per fine 2026',
  'acc.s7.foot3': 'Validazione esterna n=100 prevista per fine 2026',

  'acc.s8.eyebrow': '08 · Roadmap di validazione',
  'acc.s8.h2a': 'Ciò che ci impegniamo',
  'acc.s8.h2b': 'a validare.',
  'acc.q.late2026': 'fine 2026',
  'acc.q.q42026': 'Q4 2026',
  'acc.rd1.t': 'Validazione su coorte esterna n=100',
  'acc.rd1.b':
    'Reclutamento di 100 soggetti diversi (20-75 anni, fototipi I-VI). Misura della concordanza con gli apparecchi di riferimento Visia / Antera. Pubblicazione metodologica.',
  'acc.rd2.t': 'Grado morfologico Bazin 0-5',
  'acc.rd2.b':
    'Estrazione dalle immagini del grado morfologico Bazin (atlante vol. 1, cap. 4) — oggi sono utilizzati solo l’età di ancoraggio 40 e la correlazione r=0,78. Implementazione del rilevamento della profondità delle rughe e della classificazione 0-5.',
  'acc.rd3.t': 'Coefficienti per fototipo (Diridollou + Flament)',
  'acc.rd3.b':
    'Estrazione dei coefficienti di Diridollou 2007 e Flament 2023 per rughe / tonicità / pigmentazione per fototipo. Oggi la v7 applica un aggiustamento moderato da −4 % a −8 % sull’età biologica dei fototipi IV-VI; obiettivo: corrispondenza completa per fototipo con i coefficienti delle fonti.',
  'acc.rd4.t': 'Pubblicazione con revisione paritaria',
  'acc.rd4.b':
    'Sottomissione di un articolo metodologico che descrive la catena VYVRE (webcam di largo consumo → biomarcatori CIE L*a*b* → stima dell’età) con validazione su coorte n=100. Obiettivo: Int J Cosmet Sci o Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Limiti',
  'acc.s9.h2a': 'Ciò che VYVRE',
  'acc.s9.h2b': 'non fa.',
  'acc.s9.p':
    'Preferiamo essere radicalmente onesti su ciò che il motore non misura, piuttosto che vendere illusioni.',
  'acc.lim1.t': 'VYVRE non è un dispositivo medico',
  'acc.lim1.b':
    'Il motore non formula alcuna diagnosi medica. Non rileva le patologie dermatologiche (tumore cutaneo, melanoma, dermatite, psoriasi, ecc.). Per qualsiasi preoccupazione medica, consultate un dermatologo.',
  'acc.lim2.t': 'Una webcam standard non è uno scanner professionale',
  'acc.lim2.b':
    'Uno scanner dermatologico professionale utilizza luce polarizzata, fluorescenza UV e sensore 3D. VYVRE si appoggia a una webcam standard e a una luce non controllata. Varianza ±8 % (contro ±2 % in ambulatorio).',
  'acc.lim3.t': 'Nessun rilevamento 3D delle rughe',
  'acc.lim3.b':
    'La profondità reale delle rughe richiede un sensore stereoscopico. VYVRE stima la severità tramite l’analisi colorimetrica delle ombre (approccio 2D). Affidabile sulle rughe marcate, meno preciso sulle rughe sottili appena formate.',
  'acc.lim4.t': 'Iperpigmentazione profonda non rilevata',
  'acc.lim4.b':
    'Le macchie pigmentarie sotto-epidermiche (melasma profondo, macchie attiniche datate) non sono visibili in luce visibile. Servirebbe una fotocamera a fluorescenza UV (non inclusa).',
  'acc.lim5.t': 'Fototipi V-VI: estrapolazione dichiarata',
  'acc.lim5.b':
    'La coorte interna n=12 contiene soprattutto fototipi I-IV. Gli aggiustamenti per V-VI sono estrapolati dai dati di Diridollou 2007 (da −4 % a −8 % sull’età biologica). Validazione su coorte dedicata prevista per fine 2026.',
  'acc.lim6.t': 'Trucco, occhiali, mascherina',
  'acc.lim6.b':
    'Il motore rileva queste ostruzioni e abbassa il punteggio di qualità. Se la qualità è troppo bassa (< 40), lo scan viene rifiutato. Tra 40 e 60, il risultato viene pubblicato con una segnalazione esplicita di confidenza bassa e un intervallo allargato.',
  'acc.lim7.t': 'La coorte interna n=12 è piccola — lo dichiariamo',
  'acc.lim7.b':
    'I coefficienti empirici (penalità webcam JPEG, ampiezza dell’intervallo) sono calibrati su 12 soggetti. È un gruppo di test, non una coorte clinica. La validazione esterna n=100 è iscritta nella roadmap fine 2026.',

  'acc.s10.eyebrow': '10 · Modulo complementare · Condizioni cutanee (v1 indicativo)',
  'acc.s10.h2a': 'Rilevamento visivo di 4 condizioni',
  'acc.s10.h2b': 'indicativo, mai medico.',
  'acc.s10.p1': 'Modulo separato',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — caricamento opzionale su qualsiasi dimostrazione. Rileva tramite euristiche d’immagine 4 condizioni visive frequenti e propone una routine cosmetica mirata, al di fuori di ogni prescrizione.',
  'acc.s10.p3': 'Questo modulo non formula alcuna diagnosi medica.',
  'acc.cond.sens': 'Sensibilità',
  'acc.cond.spec': 'Specificità',
  'acc.cond.cohort': 'coorte di sintesi n=12',
  'acc.cond1.a': 'Modulo · Acne',
  'acc.cond1.t': 'Eritema a* CIELAB localizzato + varianza di texture L*',
  'acc.cond1.c':
    'Rilevamento di pixel eritematosi concentrati in punti distinti sulla zona T (fronte, naso, mento). Risultato: probabilità + severità (minima, bassa, media, elevata).',
  'acc.cond2.a': 'Modulo · Rosacea',
  'acc.cond2.t': 'Eccesso mediano a* guance + naso rispetto alla base + simmetria bilaterale',
  'acc.cond2.c':
    'Eritema persistente e bilaterale su guance e naso. La simmetria tra le guance pondera il punteggio (la rosacea è bilaterale).',
  'acc.cond3.a': 'Modulo · Melasma',
  'acc.cond3.t': 'ΔL* fronte e labbro superiore vs quartile alto L* delle guance + Δb* (melanina)',
  'acc.cond3.c':
    'Iperpigmentazione simmetrica del centro del viso (fronte, labbro superiore, zigomi). Distingue un melasma diffuso da macchie distinte.',
  'acc.cond4.a': 'Modulo · Lentigo',
  'acc.cond4.t': 'Rilevamento di macchie (dimensione 5-200 px², compattezza ≥ 0,45)',
  'acc.cond4.c':
    'Macchie pigmentarie isolate, dai contorni netti, su guance e fronte. Numero di macchie qualificate rapportato alla superficie di pelle (densità per 1.000 pixel).',
  'acc.s10.why.t': 'Perché euristiche invece di una rete neurale?',
  'acc.s10.why1':
    'I set di dati ISIC / DermNet contengono immagini cliniche in primo piano, in luce polarizzata, centrate sulla lesione. Una distribuzione molto lontana da una webcam di largo consumo a 50 cm sotto luce non controllata: un modello addestrato su di essi si trasferirebbe male senza un nuovo addestramento su una coorte VYVRE dedicata.',
  'acc.s10.why2':
    'Le euristiche restano verificabili riga per riga, cosa che un modello opaco non è. Compatibile con i requisiti di spiegabilità delle grandi maison.',
  'acc.s10.why3':
    'Nessun modello da scaricare (0 MB), nessun processore grafico richiesto, funziona su tutti i browser in meno di 200 ms.',
  'acc.s10.why4a': 'Architettura stabile: una v2 potrà sostituire un modello addestrato dietro la stessa interfaccia',
  'acc.s10.why4b': 'senza rompere le integrazioni esistenti.',
  'acc.s10.disc.t': 'Avvertenza medica (obbligatoria su ogni visualizzazione)',
  'acc.s10.disc.b':
    'Questo modulo non è un dispositivo medico. Non formula alcuna diagnosi. Le probabilità restituite sono indicatori di zone di attenzione, destinati a raccomandare una routine cosmetica mirata. Per qualsiasi preoccupazione cutanea reale, consultate un dermatologo.',
  'acc.s10.cta1': 'Vedi la dimostrazione Condizioni →',
  'acc.s10.cta2': 'Codice sorgente del modulo',

  'acc.s11.eyebrow': '11 · Salvaguardia qualità · Impegno di onestà',
  'acc.s11.h2a': 'Preferire l’onestà',
  'acc.s11.h2b': 'alla falsa precisione.',
  'acc.s11.p1':
    'La v7.0 elimina le correzioni v6.2 che lusingavano artificialmente l’utente: ringiovanimento nascosto di 5 anni su webcam degradata, limiti [20, 50] che riportavano un soggetto di 80 anni a 50, corrispondenza per fototipo inventata al di fuori delle fonti.',
  'acc.s11.p2':
    'Se la pelle reale dell’utente ha 38 anni per un dermatologo, il motore deve dire 38. Non 28 (menzogna lusinghiera). Non 44 (falsa brutalità). Una stima vera.',

  'acc.cta.h2a': 'Domande tecniche?',
  'acc.cta.h2b': 'Richiedete il DPA completo.',
  'acc.cta.p':
    'Inviamo su richiesta a DPO, dermatologi consulenti e team R&S: DPA, metodologia dettagliata, rapporto di precisione, codice sorgente del motore sottoposto ad audit.',
  'acc.cta.1': 'Richiedere la documentazione →',
  'acc.cta.2': '← Indietro',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Prezzi · VYVRE',
  'pri.meta.desc':
    'Diagnosi della pelle misurata, ospitata in Francia. Pilot gratuito, Starter 299 €/mese, Growth 499 €/mese, Enterprise a partire da 699 €/mese.',

  'pri.banner1': 'Avete appena provato la dimostrazione {brand}',
  'pri.banner2': '— Scegliete il vostro piano per attivarla sul vostro sito.',

  'pri.hero.eyebrow': 'Tariffe · VYVRE Business',
  'pri.hero.h1a': 'Il prezzo è',
  'pri.hero.h1b': 'sulla pagina.',
  'pri.hero.p': 'Hosting in Francia · GDPR nativo · Nessuna foto conservata',

  'pri.toggle.monthly': 'Mensile',
  'pri.toggle.annual': 'Annuale',
  'pri.theme.label': 'Tema del vostro widget',
  'pri.theme.dark': 'Nero',
  'pri.theme.light': 'Bianco',
  'pri.theme.note': 'La vostra diagnosi apparirà in questo tema · modificabile in seguito',

  'pri.card.plan': 'Piano',
  'pri.card.recommended': 'Consigliato',
  'pri.per.month': '/mese',

  'pri.pilot.price': 'Gratuito',
  'pri.pilot.sub': '30 giorni · senza impegno',
  'pri.pilot.f1': '1.000 scan / mese',
  'pri.pilot.f2': 'SDK Web',
  'pri.pilot.f3': 'Branding VYVRE',
  'pri.pilot.f4': 'Supporto e-mail entro 48 h',
  'pri.pilot.f5': 'Infrastruttura in Francia',
  'pri.pilot.cta': 'Inizia gratuitamente',

  'pri.starter.subA': '2.990 € / anno · 2 mesi in omaggio',
  'pri.starter.subM': '5.000 scan / mese',
  'pri.starter.f1': '5.000 scan / mese',
  'pri.starter.f2': '0,02 € per scan supplementare',
  'pri.starter.f3': 'SDK Web + iOS + Android',
  'pri.starter.f4': 'White label completo',
  'pri.starter.f5': 'SLA 99,9 % · supporto prioritario',
  'pri.starter.cta': 'Inizia la prova gratuita',

  'pri.growth.subA': '4.990 € / anno · 2 mesi in omaggio',
  'pri.growth.subM': '15.000 scan / mese',
  'pri.growth.f1': '15.000 scan / mese',
  'pri.growth.f2': '0,015 € per scan supplementare',
  'pri.growth.f3': 'Tutto Starter, più:',
  'pri.growth.f4': 'Multi-marchio (fino a 5)',
  'pri.growth.f5': 'Account manager dedicato',
  'pri.growth.cta': 'Scegli Growth',

  'pri.ent.subA': 'a partire da · contratto su misura',
  'pri.ent.subM': 'a partire da · senza impegno',
  'pri.ent.f1': '25.000 scan / mese',
  'pri.ent.f2': '0,01 € per scan supplementare',
  'pri.ent.f3': 'Rete di boutique illimitata',
  'pri.ent.f4': 'Applicazione mobile nativa',
  'pri.ent.f5': 'SLA 99,99 % · reperibilità 24/7',
  'pri.ent.cta': 'Contattaci',

  'pri.trust': 'Tariffe pubbliche · IVA esclusa · Disdetta in qualsiasi momento',

  'pri.args.eyebrow': 'Perché sceglierci',
  'pri.args.h2a': 'Perché VYVRE',
  'pri.args.h2b': 'e non gli altri?',
  'pri.arg1.e': 'Made in France',
  'pri.arg1.t': 'L’unico modulo di diagnosi della pelle interamente francese',
  'pri.arg1.b': 'Infrastruttura ospitata in Francia, team a Parigi, DPA firmato.',
  'pri.arg1.n': 'Le soluzioni comparabili sono ospitate fuori dall’Unione europea.',
  'pri.arg2.e': '−90 % sulla fattura',
  'pri.arg2.t1': 'Fino a 10× meno caro',
  'pri.arg2.t2': 'della concorrenza',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'a partire da 299 € / mese',
  'pri.arg2.b3':
    '(3.588 € / anno). SkinConsult AI parte da ~50.000 € / anno + 30.000 € di messa in opera, Perfect Corp da ~30.000 € / anno.',
  'pri.arg2.n': 'Tabella comparativa dettagliata più in basso in questa pagina.',
  'pri.arg3.e': 'Attivazione in 48 h',
  'pri.arg3.t': 'Codice di integrazione inviato dopo il pagamento',
  'pri.arg3.b1': 'Incollate',
  'pri.arg3.b2': 'sul vostro sito, è online.',
  'pri.arg3.n': 'Nessuna riunione di avvio, nessun integratore esterno da pagare.',
  'pri.arg4.e': 'Senza impegno',
  'pri.arg4.t': 'Disdetta in un clic',
  'pri.arg4.b':
    'Passaggio a un piano inferiore o superiore, o disdetta, dalla vostra dashboard. Nessun vincolo contrattuale, nessuna penale.',
  'pri.arg4.n': 'Conservate l’export di tutti i vostri dati di scan.',
  'pri.arg5.e': 'White label totale',
  'pri.arg5.t': 'Il vostro marchio, non il nostro',
  'pri.arg5.b':
    'Logo, colori, tipografia, prodotti raccomandati — tutto è regolato sulla vostra identità visiva.',
  'pri.arg5.n': 'Nessuna dicitura « Powered by VYVRE » imposta già dal piano Starter.',
  'pri.arg6.e': 'Scienza con revisione paritaria',
  'pri.arg6.t': 'Una misura, non una simulazione',
  'pri.arg6.b':
    'Colorimetria CIE L*a*b*, 68 punti di riferimento del viso, indici derivati dalla letteratura dermatologica.',
  'pri.arg6.n': 'Bibliografia: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Comparativo di mercato · prezzi pubblici rilevati 2025',
  'pri.tbl.h1': 'Soluzione',
  'pri.tbl.h2': 'Tariffa annuale (ingresso)',
  'pri.tbl.h3': 'Messa in opera / integrazione',
  'pri.tbl.h4': 'Hosting',
  'pri.tbl.h5': 'Attivazione',
  'pri.tbl.from': 'A partire da',
  'pri.tbl.month': '/mese',
  'pri.tbl.year': '/anno',
  'pri.tbl.fromApprox': 'a partire da',
  'pri.tbl.onQuote': 'su preventivo',
  'pri.tbl.france': 'Francia',
  'pri.tbl.w812': '8-12 sett.',
  'pri.tbl.w12': '12 sett. e +',
  'pri.tbl.w68': '6-8 sett.',
  'pri.tbl.note':
    'Tariffe dei concorrenti: ordini di grandezza pubblici rilevati (gare d’appalto di marchi cosmetici 2024-2025).',

  'pri.del.eyebrow': 'Avvio · dal secondo del pagamento',
  'pri.del.h2a': 'Ciò che ottenete,',
  'pri.del.h2b': 'dalla conferma Stripe.',
  'pri.del1.t': 'E-mail di benvenuto',
  'pri.del1.b': 'Con il vostro link di amministrazione personale e le vostre credenziali.',
  'pri.del2.t': 'Codice di integrazione pronto da incollare',
  'pri.del3.t': 'Catalogo prodotti precompilato',
  'pri.del3.b':
    'Da 30 a 60 dei vostri prodotti ripresi dal vostro sito, già associati ai biomarcatori.',
  'pri.del4.t': 'Veste grafica del vostro marchio',
  'pri.del4.b':
    'Logo, palette di colori e nome del marchio applicati al modulo e alla dashboard.',
  'pri.del5.t': 'Dashboard analitica',
  'pri.del5.b':
    'Scan al giorno, tasso di conversione, biomarcatori medi, prodotti più raccomandati.',
  'pri.del6.t': 'Export GDPR completo',
  'pri.del6.b':
    'Conservate l’integralità dei vostri dati di scan, esportabili in CSV in qualsiasi momento.',

  'pri.faq.eyebrow': 'Domande frequenti',
  'pri.faq.h2a': 'Tutto ciò che volete',
  'pri.faq.h2b': 'sapere.',
  'pri.faq1.q': 'Che cosa succede se supero la mia quota di scan?',
  'pri.faq1.a':
    'Il servizio continua. Ogni scan supplementare è fatturato tra 0,01 € e 0,02 € secondo il vostro piano, sulla fattura del mese successivo.',
  'pri.faq2.q': 'Dove sono archiviati i dati delle utenti?',
  'pri.faq2.a':
    'Esclusivamente in Francia. Nessuna foto conservata, nessun trasferimento fuori dall’Unione europea, DPA firmato.',
  'pri.faq3.q': 'Posso cambiare piano in corso d’opera?',
  'pri.faq3.a':
    'Sì, in qualsiasi momento dalla vostra dashboard. Passaggio al piano superiore con rateo immediato, passaggio al piano inferiore dal mese successivo.',
  'pri.faq4.q': 'Quale livello di supporto tecnico?',
  'pri.faq4.a':
    'Supporto e-mail entro 48 h su tutti i piani. Supporto prioritario con account manager dedicato a partire da Growth.',
  'pri.faq5.q': 'I prodotti raccomandati sono configurabili?',
  'pri.faq5.a':
    'Sì. Il vostro catalogo è interamente modificabile: aggiungete, togliete e modificate i prodotti dalla dashboard.',

  'pri.cal.eyebrow': 'Non ancora pronti?',
  'pri.cal.h2': 'Prenotate una dimostrazione di 20 minuti',
  'pri.cal.p':
    'Charles, fondatore, vi mostra il modulo in videoconferenza e risponde a tutte le vostre domande tecniche e contrattuali.',
  'pri.cal.cta': 'Prenota 20 min →',

  /* ─────────── pagine legali ─────────── */
  'legal.notice.t': 'Fa fede la versione francese',
  'legal.notice.b':
    'Il testo qui sotto è volutamente lasciato in francese: solo la versione francese di questo documento ha valore contrattuale. I titoli sono tradotti per facilitarne la lettura. Una traduzione di cortesia può essere richiesta a charles@symphonydrive.com.',
  'legal.updated': 'Ultimo aggiornamento:',
  'legal.version': 'Versione 1.0 —',

  'cgv.meta.title': 'Condizioni generali di vendita · VYVRE',
  'cgv.meta.desc':
    'Condizioni generali di vendita VYVRE Business — abbonamenti SaaS B2B per i marchi cosmetici.',
  'cgv.eyebrow': 'Condizioni generali di vendita',
  'cgv.h1': 'Condizioni generali.',
  'cgv.a1': 'Articolo 1 — Oggetto',
  'cgv.a2': 'Articolo 2 — Sottoscrizione e attivazione',
  'cgv.a3': 'Articolo 3 — Tariffe',
  'cgv.a4': 'Articolo 4 — Modalità di pagamento',
  'cgv.a5': 'Articolo 5 — Durata e risoluzione',
  'cgv.a6': 'Articolo 6 — Impegno di servizio (SLA)',
  'cgv.a7': 'Articolo 7 — Proprietà dei dati',
  'cgv.a8': 'Articolo 8 — Limitazione di responsabilità',
  'cgv.a9': 'Articolo 9 — Riservatezza e GDPR',
  'cgv.a10': 'Articolo 10 — Legge applicabile e foro competente',

  'conf.meta.title': 'Informativa sulla privacy · VYVRE',
  'conf.meta.desc':
    'Informativa sulla privacy e protezione dei dati personali VYVRE. Conformità GDPR.',
  'conf.eyebrow': 'Protezione dei dati · GDPR',
  'conf.h1': 'Privacy.',
  'conf.b1': 'Titolare del trattamento',
  'conf.b2': 'Dati raccolti dallo scan della pelle',
  'conf.b3': 'Hosting dei dati',
  'conf.b4': 'Dati raccolti dal sito web',
  'conf.b5': 'Dati raccolti in caso di acquisto',
  'conf.b6': 'Base giuridica del trattamento',
  'conf.b7': 'Periodo di conservazione',
  'conf.b8': 'I vostri diritti GDPR',
  'conf.b9': 'DPA (accordo sul trattamento dei dati)',

  'ml.meta.title': 'Note legali · VYVRE',
  'ml.meta.desc': 'Note legali di VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Informazioni legali',
  'ml.h1': 'Note legali.',
  'ml.b1': 'Editore del sito',
  'ml.b2': 'Direttore della pubblicazione',
  'ml.b3': 'Hosting',
  'ml.b4': 'Proprietà intellettuale',
  'ml.b5': 'Limitazione di responsabilità',
  'ml.b6': 'Collegamenti ipertestuali',
  'ml.b7': 'Legge applicabile',

  'dpa.meta.title': 'DPA · Accordo sul trattamento dei dati · VYVRE',
  'dpa.meta.desc':
    'Accordo sul trattamento dei dati (articolo 28 del GDPR) tra VYVRE e i clienti B2B.',
  'dpa.eyebrow': 'Articolo 28 GDPR · Responsabile del trattamento',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Parti',
  'dpa.b2': '2. Oggetto del trattamento',
  'dpa.b3': '3. Categorie di dati trattati',
  'dpa.b4': '4. Categorie di interessati',
  'dpa.b5': '5. Durata del trattamento',
  'dpa.b6': '6. Obblighi del responsabile del trattamento',
  'dpa.b7': '7. Misure di sicurezza (articolo 32 del GDPR)',
  'dpa.b8': '8. Sub-responsabili del trattamento',
  'dpa.b9': '9. Trasferimenti fuori dall’Unione europea',
  'dpa.b10': '10. Audit e controllo',
  'dpa.b11': '11. Notifica di violazione dei dati',
  'dpa.b12': '12. Restituzione e cancellazione dei dati',
} as const;

export default it;
