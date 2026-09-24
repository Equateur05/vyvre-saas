/**
 * VYVRE — Nederlands woordenboek van de Next-pagina’s (marques, accuracy, pricing, juridisch).
 *
 * Het Frans is de bron: elke sleutel die daar wordt toegevoegd, moet ook in de
 * elf andere bestanden van /lib/i18n/dict staan. Wat nooit vertaald wordt, blijft
 * in de JSX: merknamen, « VYVRE », « skin intelligence », titels van
 * wetenschappelijke artikelen, tijdschriftnamen, codefragmenten, cijfers en prijzen in euro.
 */

const nl = {
  /* ─────────── gemeenschappelijk: hoofding, voettekst, keuzemenu ─────────── */
  'lang.aria': 'Taal kiezen',
  'nav.manifeste': 'Manifest',
  'nav.method': 'Methode',
  'nav.demo': 'Scan testen',
  'nav.pricing': 'Tarieven',

  'footer.city': 'VYVRE · Parijs',
  'footer.cityFull': 'VYVRE · Parijs, Frankrijk',
  'footer.book': '20 min boeken →',
  'footer.manifeste': 'Manifest',
  'footer.method': 'Methodologie',
  'footer.cgv': 'Algemene verkoopvoorwaarden',
  'footer.legal': 'Juridische informatie',
  'footer.privacy': 'Privacy',
  'footer.privacyGdpr': 'Privacy · AVG',
  'footer.dpa': 'DPA',
  'footer.contact': 'Contact',
  'footer.home': 'Start',
  'footer.rights': 'Alle rechten voorbehouden',
  'footer.company': 'SAS met een kapitaal van 1 000 € · Parijs, Frankrijk · SIREN in aanvraag',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Gemeten huiddiagnose, voor huidverzorgingsmerken',
  'home.meta.desc':
    'De enige huiddiagnose met een openbare prijs. Infrastructuur in Frankrijk, AVG van nature, verwerking op het toestel, geen enkele foto geüpload.',

  'home.hero.eyebrow': 'Gemeten huiddiagnose',
  'home.hero.h1a': 'De huiddiagnose',
  'home.hero.h1b': 'van uw huis.',
  'home.hero.p':
    'Minder dan tien seconden camera. Acht metingen, pixel voor pixel gelezen. Eén routine, samengesteld uit uitsluitend uw catalogus.',
  'home.hero.cta1': 'Scan testen',
  'home.hero.cta2': 'Mijn merk uitrusten',

  'home.stat1': 'Huidmetingen',
  'home.stat2': 'Duur van de scan',
  'home.stat3': 'Livegang',
  'home.stat4': 'Bewaarde foto',

  'home.man.h2a': 'Gemeten,',
  'home.man.h2b': 'niet geraden.',
  'home.man.p':
    'De motor zet elke zone van het gezicht om in CIE L*a*b*-coördinaten en vervolgens in dermatologische indices. Geen schatting op basis van een filter: een optische, reproduceerbare, gedocumenteerde aflezing.',
  'home.man.link': 'Lees de methodologie →',

  'home.mes.h2a': 'Acht metingen.',
  'home.mes.h2b': 'Eén enkele aflezing.',
  'home.mes.1.n': 'Teint',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Stralendheid',
  'home.mes.2.u': 'Luminantie L*',
  'home.mes.3.n': 'Roodheid',
  'home.mes.3.u': 'Erytheemindex',
  'home.mes.4.n': 'Egaliteit',
  'home.mes.4.u': 'Chromatische standaardafwijking',
  'home.mes.5.n': 'Textuur',
  'home.mes.5.u': 'Lokaal microcontrast',
  'home.mes.6.n': 'Poriën',
  'home.mes.6.u': 'Dichtheid van de minima',
  'home.mes.7.n': 'Talg',
  'home.mes.7.u': 'Speculaire reflectie',
  'home.mes.8.n': 'Hydratatie',
  'home.mes.8.u': 'Optische TEWL-proxy',

  'home.steps.h2a': 'Drie stappen.',
  'home.steps.h2b': 'Nul frictie.',
  'home.step1.t': 'De klant scant',
  'home.step1.d':
    'Camera van de telefoon of van de adviesbalie. Niets te installeren, niets te uploaden: het beeld wordt verwerkt en daarna gewist.',
  'home.step2.t': 'De motor stelt samen',
  'home.step2.d':
    'Een ochtend- en avondroutine uit uitsluitend uw catalogus, geordend volgens de metingen en uw commerciële prioriteiten.',
  'home.step3.t': 'U gaat live',
  'home.step3.d':
    'Eén regel script op uw site, uw kleuren, uw typografie. Geen enkele ontwikkelaar ingezet bij u.',

  'home.groupe.eyebrow': 'Voor groepen',
  'home.groupe.h2a': 'Eén huis, tien merken,',
  'home.groupe.h2b': 'één motor.',
  'home.socle1.t': 'Multimerk',
  'home.socle1.d':
    'Eén ruimte per merk: catalogus, huisstijl, aanbevelingsregels en statistieken gescheiden.',
  'home.socle2.t': 'Soevereiniteit',
  'home.socle2.d':
    'Hosting in Frankrijk, AVG van nature, ondertekende DPA, geen enkel beeld bewaard, geen enkele pixel van derden.',
  'home.socle3.t': 'Winkel en e-shop',
  'home.socle3.d':
    'Dezelfde motor aan de toonbank op tablet en op de productpagina, met hetzelfde meetreferentiekader.',

  'home.price.h2a': 'Vanaf 299 €/maand.',
  'home.price.h2b': 'Prijs zichtbaar.',
  'home.price.cta': 'Bekijk de plannen',

  'home.faq.h2': 'Vragen.',
  'home.faq1.q': 'Hoe komt mijn catalogus in de motor terecht?',
  'home.faq1.a':
    'Via een CSV-feed of de API van uw e-commerce (Shopify, Salesforce Commerce, Centra). Geen beheerderstoegang, elke nacht synchronisatie.',
  'home.faq2.q': 'Wat gebeurt er met het beeld van de klant?',
  'home.faq2.a':
    'Het wordt in het geheugen geanalyseerd en daarna gewist: geen enkele foto wordt opgeslagen of doorgestuurd. Hosting in Frankrijk, DPA beschikbaar.',
  'home.faq3.q': 'Kan de motor een concurrent aanbevelen?',
  'home.faq3.a':
    'Nee. De routine wordt uitsluitend uit uw catalogus samengesteld, met de prioriteiten die u vastlegt.',
  'home.faq4.q': 'Welk materiaal is nodig?',
  'home.faq4.a':
    'Een 720p-camera volstaat, zowel op mobiel als op de computer. De resultaten worden fijner met recente sensoren.',

  'home.cta.h2': 'Bekijk de scan op uw catalogus.',
  'home.cta.1': 'Demo starten',
  'home.cta.2': 'Demo aanvragen',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Methodologie & precisie · VYVRE',
  'acc.meta.desc':
    'Peer-reviewed bronnen (5 toegepast, 4 op de roadmap), berekeningsmethode, betrouwbaarheidsintervallen, beperkingen. De wetenschappelijke transparantie achter de VYVRE v7.0-motor.',

  'acc.hero.eyebrow': 'Methodologie · Bronnen · Beperkingen',
  'acc.hero.h1a': 'De wetenschap',
  'acc.hero.h1b': 'achter de scan.',
  'acc.hero.p':
    'Acht metingen afgelezen uit het beeld. Hier: de wetenschappelijke bronnen, de berekeningsmethode, de betrouwbaarheidsintervallen en de grenzen van de motor.',
  'acc.hero.note1':
    'Geschatte precisie ±5 jaar biologische leeftijd · ±4 jaar waargenomen leeftijd (BI 95 % · intern cohort n=12)',
  'acc.hero.note2':
    'Externe validatie n=100 voorzien eind 2026 · herziening mei 2026 na interne audit',

  'acc.s1.eyebrow': '01 · Bibliografie · Toegepaste bronnen',
  'acc.s1.h2a': '5 peer-reviewed bronnen',
  'acc.s1.h2b': 'actief toegepast.',
  'acc.s1.p1': 'Deze 5 bronnen worden rechtstreeks gebruikt in de berekeningsformules van de motor (zie',
  'acc.s1.p2': ', functie',
  'acc.s1.p3': 'en',
  'acc.s1.p4': '). Elke biomarker is traceerbaar tot een wetenschappelijk artikel dat op PubMed geïndexeerd is.',
  'acc.s1.foot1': 'Motor v7 — herziening mei 2026',
  'acc.s1.foot2': 'Toegepaste bronnen regel voor regel verifieerbaar in',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — basis van de automatische detectie van het Fitzpatrick I-VI-fototype',
  'acc.src2.c':
    'Melanin Index (MI) en Erythema Index (EI) — kwantificering van de pigmentatie en de roodheid',
  'acc.src3.c':
    'TEWL-proxy (transepidermaal waterverlies) via σL* → indices hydratatie en poriën. Regressie tabel 3.',
  'acc.src4.c':
    'Speculaire reflecties → stralendheid / talg. Detectie van speculaire reflecties op het gezicht',
  'acc.src5.c':
    'Verschil waargenomen leeftijd / biologische leeftijd (Kaukasisch cohort ~1 700 personen). v7: leeftijdsafhankelijk verschil (−2 tot −6 jaar naargelang de biologische leeftijd), niet gebonden aan het fototype.',

  'acc.s2.eyebrow': '02 · Bibliografie · Roadmap eind 2026',
  'acc.s2.h2a': '4 vermelde bronnen',
  'acc.s2.h2b': 'nog niet volledig toegepast.',
  'acc.s2.p':
    'Deze bronnen worden vermeld omwille van de transparantie en de openbare roadmap. Hun volledige coëfficiënten zijn nog niet in de formules verwerkt — extractie en validatie voorzien eind 2026 met een dermatoloog als partner.',
  'acc.rm.appliedLabel': 'Gedeeltelijk toegepast: ',
  'acc.rm.roadmapLabel': 'Roadmap: ',
  'acc.rm1.a':
    'Ankerleeftijd 40 (mediaan van het volwassen cohort) + correlatie r=0,78 periorbitale rimpels ↔ leeftijd',
  'acc.rm1.r':
    'Extractie uit beelden → morfologische graad 0-5 (schaal van Bazin) nog niet geïmplementeerd. Voorzien eind 2026.',
  'acc.rm2.a': 'Bescheiden correctie van −4 % tot −8 % op de biologische leeftijd voor de fototypes IV-VI',
  'acc.rm2.r':
    'Volledige coëfficiënten per fototype voor rimpels / stevigheid / pigmentatie nog niet geëxtraheerd.',
  'acc.rm3.a': 'Vermeld voor de multi-etnische context',
  'acc.rm3.r':
    'Specifieke coëfficiënten nog niet geëxtraheerd. Validatie op een multi-etnisch cohort voorzien eind 2026.',
  'acc.rm4.a': 'Klinische TEWL-normen vermeld (gezond ≤ 15 g/m²/u, aangetast ≥ 25)',
  'acc.rm4.r':
    'De numerieke berekening σL* → TEWL volgt Stamatas 2011 (en niet Akdeniz). Kruisvalidatie voorzien.',

  'acc.bench.eyebrow': 'Openbare benchmark · UTKFace · 26 mei 2026',
  'acc.bench.h2a': 'Publiek vergeleken',
  'acc.bench.h2b': 'met 3 opensourcereferenties.',
  'acc.bench.p':
    'VYVRE v7.0 getest op 300 openbare UTKFace-gezichten (gestratificeerd 18-80 jaar) naast DeepFace, InsightFace en OpenCV DNN. Verdict zonder retouche gepubliceerd, reproduceerbare code, 5 scripts, 4 min uitvoering.',
  'acc.bench.k1.l': '30-44 (doel)',
  'acc.bench.k1.n': 'MAE — vóór OpenCV (8,66 jaar)',
  'acc.bench.k2.l': 'Geheel (18-80)',
  'acc.bench.k2.n': 'MAE — achter de diepe netwerken',
  'acc.bench.k3.l': 'Bias met teken',
  'acc.bench.k3.n': 'De meest neutrale van de 4 motoren',
  'acc.bench.cta': 'Bekijk de volledige benchmark →',

  'acc.s3.eyebrow': '03 · Colorimetrische standaarden (fundamenten)',
  'acc.s3.p':
    'Onderliggende normatieve standaarden — geen peer-reviewed artikelen, maar technische specificaties die actief zijn in de verwerkingsketen.',
  'acc.s3.std1': 'sRGB-kleurruimte (gammadecodering)',
  'acc.s3.std2': 'RGB-primaries Rec. 709',
  'acc.s3.std3': 'Conversie XYZ → L*a*b*',
  'acc.s3.std4': 'Fitzpatrick-grenzen per ITA°',
  'acc.s3.std5': 'Detectie van huidpixels YCbCr',
  'acc.s3.std6': 'Laplaciaanse scherptemeting',
  'acc.s3.std7':
    'Correlatie stevigheid ↔ waargenomen leeftijd (r=0,65 tussen ITA°-afstand en waargenomen stevigheid)',

  'acc.s4.eyebrow': '04 · Verwerkingsketen',
  'acc.s4.h2': 'Berekeningsmethode.',
  'acc.st1.t': 'Opname van het beeld',
  'acc.st1.d':
    'Standaardwebcam (≥ 720p). Minder dan 10 seconden opname, 8 beelden behouden. Gezichtsdetectie door face-api.js (68 herkenningspunten). Uitsnede van de gezichtszone en lichtcorrectie.',
  'acc.st2.t': 'Colorimetrische conversie',
  'acc.st2.d':
    'Keten sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Zelftest op 6 referentiekleuren bij elke scan. Precisie op pixelniveau.',
  'acc.st3.t': 'Extractie van de signalen',
  'acc.st3.d':
    'ITA° + Melanin Index + Erythema Index + TEWL-proxy + speculaire ratio. 4 zones van het gezicht geanalyseerd (voorhoofd, linker- en rechterwang, T-zone).',
  'acc.st4.t': 'Omzetting in biomarkers',
  'acc.st4.d':
    'Elk ruw signaal omgezet in een score 0-100 door peer-reviewed formules (citaten hierboven). Constanten benoemd met hun bron, of aangeduid als empirisch.',
  'acc.st5.t': 'Detectie van het fototype',
  'acc.st5.d':
    'Automatische Fitzpatrick I-VI-classificatie via ITA° (Chardon 1991). Pigmentatiegrenzen aangepast aan het fototype om bias op donkere huid te vermijden.',
  'acc.st6.t': 'Leeftijdsschatting + interval',
  'acc.st6.d':
    'Formule met één biomarker (dominante periorbitale rimpels, Bazin 2007). Leeftijdsafhankelijk verschil van de waargenomen leeftijd (Vierkötter 2012). Interval ±5 jaar (95 %, intern cohort n=12).',

  'acc.s5.eyebrow': '05 · Huidleeftijd · Methode v7',
  'acc.s5.h2a': 'Waargenomen huidleeftijd',
  'acc.s5.h2b': 'of ruwe biologische leeftijd.',
  'acc.s5.p': 'Er worden twee getallen berekend, slechts één wordt getoond. Dit is waarom.',
  'acc.age.l.tag': 'Getoond — Huidleeftijd',
  'acc.age.l.h3': 'Visueel waargenomen leeftijd',
  'acc.age.l.p':
    'Gemiddelde leeftijd zoals sociaal waargenomen door een menselijke waarnemer. Gekalibreerd op Vierkötter & Krutmann 2012 (Kaukasisch cohort ~1 700 personen) met een verschil',
  'acc.age.l.pEm': 'afhankelijk van de leeftijd',
  'acc.age.l.li1': '< 30 jaar bio → −2 jaar',
  'acc.age.l.li2': '30-45 jaar bio → −4 jaar',
  'acc.age.l.li3': '45-60 jaar bio → −5 jaar',
  'acc.age.l.li4': '60 jaar en + bio → −5 tot −6 jaar',
  'acc.age.l.note':
    'v7 schrapt de fototypetoewijzing van v6, die in de oorspronkelijke bron ontbrak. Het fototype beïnvloedt de biologische leeftijd (Diridollou), niet de sociale waarneming.',
  'acc.age.r.tag': 'Intern — Biologische leeftijd',
  'acc.age.r.h3': 'Ruwe biologische leeftijd',
  'acc.age.r.p':
    'Rechtstreekse schatting van de fysieke toestand van de huid via de dominante rimpelscore (periorbitale rimpels, Bazin 2007). Correlatie r=0,78 met de chronologische leeftijd op studiofoto’s.',
  'acc.age.r.note1': 'Formule v7:',
  'acc.age.r.note2':
    'De factor 0,85 (JPEG-webcamstraf) is een bewust empirische compensatie; validatie op een breed cohort voorzien eind 2026.',
  'acc.age.prec1': 'Geschatte precisie:',
  'acc.age.prec.bio': '±5 jaar biologische leeftijd',
  'acc.age.prec.perc': '±4 jaar waargenomen leeftijd',
  'acc.age.prec2': '(BI 95 % op intern cohort n=12)',
  'acc.age.prec3': 'Externe validatie n=100 voorzien eind 2026',

  'acc.s6.eyebrow': '06 · Gedrag naargelang de kwaliteit · v7',
  'acc.s6.h2a': '3 betrouwbaarheidsniveaus.',
  'acc.s6.h2b': 'Geen enkele vleiende schikking.',
  'acc.s6.p':
    'v7 schrapt de correctie v6.2 die gedegradeerde scans kunstmatig verjongde (paradox « hoe minder de motor ziet, hoe meer hij vleit »). In de plaats komen 3 expliciete betrouwbaarheidsniveaus.',
  'acc.q1.tag': 'Kwaliteit < 40',
  'acc.q1.h3': 'Weigering van de scan',
  'acc.q1.p1': 'Geen enkele schatting gepubliceerd. Bericht',
  'acc.q1.p2':
    'met de aanbeveling om de scan in beter licht opnieuw te doen. De schatting wordt niet berekend.',
  'acc.q2.tag': '40 ≤ Kwaliteit < 60',
  'acc.q2.h3': 'Lage betrouwbaarheid',
  'acc.q2.p1': 'Schatting in het beste geval gepubliceerd, maar aangeduid als',
  'acc.q2.p2':
    '. Interval verbreed tot ±7 jaar (tegenover ±5 standaard). De schatting blijft eerlijk, niet verschoven.',
  'acc.q3.tag': 'Kwaliteit ≥ 60',
  'acc.q3.h3': 'Standaard',
  'acc.q3.p1': 'Standaardschatting met',
  'acc.q3.p2':
    '. Interval ±5 jaar (95 % op intern cohort n=12). Nominaal gedrag voor een goed verlichte HD-webcam.',
  'acc.s6.foot1': 'Correctie v6.2 geschrapt: −5 jaar op een gedegradeerde scan (kwaliteit < 45)',
  'acc.s6.foot2':
    'v7 verbreedt het interval in plaats van de schatting te verschuiven (eerlijkheid boven vleierij)',

  'acc.s7.eyebrow': '07 · Variantietests',
  'acc.s7.h2': 'Reproduceerbaarheid.',
  'acc.s7.p':
    'Test: dezelfde persoon 10 keer gescand in 10 verschillende lichtomstandigheden. Meting van de standaardafwijking van de scores. Intern cohort n=12.',
  'acc.var1': 'Rimpels',
  'acc.var2': 'Stevigheid',
  'acc.var3': 'Pigmentatie',
  'acc.var4': 'Hydratatie',
  'acc.var5': 'Stralendheid',
  'acc.var6': 'Poriën',
  'acc.var7': 'Roodheid',
  'acc.var8': 'Waargenomen leeftijd',
  'acc.var.unitPts': 'pts/100',
  'acc.var.unitYears': 'jaar',
  'acc.s7.foot1':
    'Intern cohort · n=12 personen fototypes I-IV · 10 scans/persoon · wisselend licht · HD-webcam 720p',
  'acc.s7.foot2':
    'Fototypes V-VI: extrapolatie Diridollou 2007 — validatie op een specifiek cohort voorzien eind 2026',
  'acc.s7.foot3': 'Externe validatie n=100 voorzien eind 2026',

  'acc.s8.eyebrow': '08 · Validatieroadmap',
  'acc.s8.h2a': 'Wat wij ons ertoe verbinden',
  'acc.s8.h2b': 'te valideren.',
  'acc.q.late2026': 'eind 2026',
  'acc.q.q42026': 'Q4 2026',
  'acc.rd1.t': 'Validatie op een extern cohort n=100',
  'acc.rd1.b':
    'Rekrutering van 100 uiteenlopende personen (20-75 jaar, fototypes I-VI). Meting van de overeenstemming met de referentieapparaten Visia / Antera. Methodologische publicatie.',
  'acc.rd2.t': 'Morfologische graad Bazin 0-5',
  'acc.rd2.b':
    'Extractie uit de beelden van de morfologische graad Bazin (atlas vol. 1, hfst. 4) — vandaag worden enkel de ankerleeftijd 40 en de correlatie r=0,78 gebruikt. Implementatie van de detectie van de rimpeldiepte en van de classificatie 0-5.',
  'acc.rd3.t': 'Coëfficiënten per fototype (Diridollou + Flament)',
  'acc.rd3.b':
    'Extractie van de coëfficiënten van Diridollou 2007 en Flament 2023 voor rimpels / stevigheid / pigmentatie per fototype. v7 past vandaag een bescheiden correctie van −4 % tot −8 % toe op de biologische leeftijd van de fototypes IV-VI; doel: volledige toewijzing per fototype met de coëfficiënten uit de bronnen.',
  'acc.rd4.t': 'Peer-reviewed publicatie',
  'acc.rd4.b':
    'Indiening van een methodologisch artikel dat de VYVRE-keten beschrijft (consumentenwebcam → CIE L*a*b*-biomarkers → leeftijdsschatting) met validatie op een cohort n=100. Doel: Int J Cosmet Sci of Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Beperkingen',
  'acc.s9.h2a': 'Wat VYVRE',
  'acc.s9.h2b': 'niet doet.',
  'acc.s9.p':
    'Wij zijn liever radicaal eerlijk over wat de motor niet meet, dan luchtkastelen te verkopen.',
  'acc.lim1.t': 'VYVRE is geen medisch hulpmiddel',
  'acc.lim1.b':
    'De motor stelt geen enkele medische diagnose. Hij detecteert geen dermatologische aandoeningen (huidkanker, melanoom, dermatitis, psoriasis, enz.). Raadpleeg bij elke medische bezorgdheid een dermatoloog.',
  'acc.lim2.t': 'Een standaardwebcam is geen professionele scanner',
  'acc.lim2.b':
    'Een professionele dermatologische scanner gebruikt gepolariseerd licht, UV-fluorescentie en een 3D-sensor. VYVRE steunt op een standaardwebcam en op niet-gecontroleerd licht. Variantie ±8 % (tegenover ±2 % in een klinische praktijk).',
  'acc.lim3.t': 'Geen 3D-detectie van rimpels',
  'acc.lim3.b':
    'De werkelijke diepte van rimpels vraagt een stereoscopische sensor. VYVRE schat de ernst via de colorimetrische analyse van de schaduwen (2D-benadering). Betrouwbaar bij uitgesproken rimpels, minder precies bij beginnende fijne lijntjes.',
  'acc.lim4.t': 'Diepe hyperpigmentatie niet gedetecteerd',
  'acc.lim4.b':
    'Sub-epidermale pigmentvlekken (diep melasma, oude actinische vlekken) zijn niet zichtbaar in zichtbaar licht. Daarvoor zou een UV-fluorescentiecamera nodig zijn (niet inbegrepen).',
  'acc.lim5.t': 'Fototypes V-VI: bewuste extrapolatie',
  'acc.lim5.b':
    'Het interne cohort n=12 bevat vooral fototypes I-IV. De correcties voor V-VI zijn geëxtrapoleerd uit de gegevens van Diridollou 2007 (−4 % tot −8 % op de biologische leeftijd). Validatie op een specifiek cohort voorzien eind 2026.',
  'acc.lim6.t': 'Make-up, bril, masker',
  'acc.lim6.b':
    'De motor detecteert deze obstructies en verlaagt de kwaliteitsscore. Is de kwaliteit te laag (< 40), dan wordt de scan geweigerd. Tussen 40 en 60 wordt het resultaat gepubliceerd met een expliciete melding van lage betrouwbaarheid en een verbreed interval.',
  'acc.lim7.t': 'Het interne cohort n=12 is klein — wij nemen dat op ons',
  'acc.lim7.b':
    'De empirische coëfficiënten (JPEG-webcamstraf, intervalbreedte) zijn gekalibreerd op 12 personen. Het is een testgroep, geen klinisch cohort. De externe validatie n=100 staat op de roadmap voor eind 2026.',

  'acc.s10.eyebrow': '10 · Aanvullende module · Huidaandoeningen (v1 indicatief)',
  'acc.s10.h2a': 'Visuele detectie van 4 aandoeningen',
  'acc.s10.h2b': 'indicatief, nooit medisch.',
  'acc.s10.p1': 'Aparte module',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — optioneel te laden op om het even welke demonstratie. Detecteert via beeldheuristieken 4 frequente visuele aandoeningen en stelt een gerichte cosmetische routine voor, buiten elk voorschrift.',
  'acc.s10.p3': 'Deze module stelt geen enkele medische diagnose.',
  'acc.cond.sens': 'Gevoeligheid',
  'acc.cond.spec': 'Specificiteit',
  'acc.cond.cohort': 'synthetisch cohort n=12',
  'acc.cond1.a': 'Module · Acne',
  'acc.cond1.t': 'Gelokaliseerd CIELAB a*-erytheem + textuurvariantie L*',
  'acc.cond1.c':
    'Detectie van erythemateuze pixels die geconcentreerd zijn in afzonderlijke punten op de T-zone (voorhoofd, neus, kin). Uitvoer: waarschijnlijkheid + ernst (minimaal, laag, gemiddeld, hoog).',
  'acc.cond2.a': 'Module · Rosacea',
  'acc.cond2.t': 'Mediaan a*-overschot wangen + neus ten opzichte van de basis + bilaterale symmetrie',
  'acc.cond2.c':
    'Aanhoudend en bilateraal erytheem op de wangen en de neus. De symmetrie tussen de wangen weegt mee in de score (rosacea is bilateraal).',
  'acc.cond3.a': 'Module · Melasma',
  'acc.cond3.t': 'ΔL* voorhoofd en bovenlip vs hoog L*-kwartiel van de wangen + Δb* (melanine)',
  'acc.cond3.c':
    'Symmetrische hyperpigmentatie van het midden van het gezicht (voorhoofd, bovenlip, jukbeenderen). Onderscheidt een diffuus melasma van afzonderlijke vlekken.',
  'acc.cond4.a': 'Module · Lentigines',
  'acc.cond4.t': 'Detectie van vlekken (grootte 5-200 px², compactheid ≥ 0,45)',
  'acc.cond4.c':
    'Geïsoleerde pigmentvlekken met scherpe contouren, op de wangen en het voorhoofd. Het aantal gekwalificeerde vlekken wordt afgezet tegen het huidoppervlak (dichtheid per 1 000 pixels).',
  'acc.s10.why.t': 'Waarom heuristieken in plaats van een neuraal netwerk?',
  'acc.s10.why1':
    'De datasets ISIC / DermNet bevatten klinische close-upbeelden, in gepolariseerd licht, gecentreerd op het letsel. Een verdeling die heel ver af staat van een consumentenwebcam op 50 cm onder niet-gecontroleerd licht: een model dat daarop getraind is, zou slecht overdraagbaar zijn zonder nieuwe training op een specifiek VYVRE-cohort.',
  'acc.s10.why2':
    'De heuristieken blijven regel voor regel controleerbaar, wat een ondoorzichtig model niet is. Verenigbaar met de eisen inzake uitlegbaarheid van de grote huizen.',
  'acc.s10.why3':
    'Geen model om te downloaden (0 MB), geen grafische processor nodig, werkt in alle browsers in minder dan 200 ms.',
  'acc.s10.why4a': 'Stabiele architectuur: een v2 zal achter dezelfde interface een aangeleerd model kunnen inzetten',
  'acc.s10.why4b': 'zonder de bestaande integraties te breken.',
  'acc.s10.disc.t': 'Medische waarschuwing (verplicht bij elke weergave)',
  'acc.s10.disc.b':
    'Deze module is geen medisch hulpmiddel. Hij stelt geen enkele diagnose. De teruggegeven waarschijnlijkheden zijn indicatoren van aandachtszones, bedoeld om een gerichte cosmetische routine aan te bevelen. Raadpleeg bij elke werkelijke huidbezorgdheid een dermatoloog.',
  'acc.s10.cta1': 'Bekijk de demonstratie Aandoeningen →',
  'acc.s10.cta2': 'Broncode van de module',

  'acc.s11.eyebrow': '11 · Kwaliteitsbewaking · Eerlijkheidsbelofte',
  'acc.s11.h2a': 'Eerlijkheid verkiezen',
  'acc.s11.h2b': 'boven valse precisie.',
  'acc.s11.p1':
    'v7.0 schrapt de correcties v6.2 die de gebruiker kunstmatig vleiden: verborgen verjonging van 5 jaar bij een gedegradeerde webcam, plafonds [20, 50] die een persoon van 80 jaar tot 50 terugbrachten, een fototypetoewijzing die buiten de bron verzonnen was.',
  'acc.s11.p2':
    'Als de werkelijke huid van de gebruiker 38 jaar is voor een dermatoloog, dan moet de motor 38 zeggen. Niet 28 (vleiende leugen). Niet 44 (valse hardheid). Een echte schatting.',

  'acc.cta.h2a': 'Technische vragen?',
  'acc.cta.h2b': 'Vraag de volledige DPA aan.',
  'acc.cta.p':
    'Wij sturen op aanvraag naar DPO’s, consulterende dermatologen en R&D-teams: DPA, gedetailleerde methodologie, precisierapport, broncode van de geauditeerde motor.',
  'acc.cta.1': 'Documentatie aanvragen →',
  'acc.cta.2': '← Terug',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Tarieven · VYVRE',
  'pri.meta.desc':
    'Gemeten huiddiagnose, gehost in Frankrijk. Pilot gratis, Starter 299 €/maand, Growth 499 €/maand, Enterprise vanaf 699 €/maand.',

  'pri.banner1': 'U hebt zopas de demonstratie {brand} getest',
  'pri.banner2': '— Kies uw plan om ze op uw site te activeren.',

  'pri.hero.eyebrow': 'Tarifering · VYVRE Business',
  'pri.hero.h1a': 'De prijs staat',
  'pri.hero.h1b': 'op de pagina.',
  'pri.hero.p': 'Hosting in Frankrijk · AVG van nature · Geen enkele foto bewaard',

  'pri.toggle.monthly': 'Maandelijks',
  'pri.toggle.annual': 'Jaarlijks',
  'pri.theme.label': 'Thema van uw widget',
  'pri.theme.dark': 'Zwart',
  'pri.theme.light': 'Wit',
  'pri.theme.note': 'Uw diagnose wordt in dit thema weergegeven · nadien aanpasbaar',

  'pri.card.plan': 'Plan',
  'pri.card.recommended': 'Aanbevolen',
  'pri.per.month': '/maand',

  'pri.pilot.price': 'Gratis',
  'pri.pilot.sub': '30 dagen · zonder verbintenis',
  'pri.pilot.f1': '1 000 scans / maand',
  'pri.pilot.f2': 'SDK Web',
  'pri.pilot.f3': 'VYVRE-vermelding',
  'pri.pilot.f4': 'E-mailondersteuning binnen 48 u',
  'pri.pilot.f5': 'Infrastructuur in Frankrijk',
  'pri.pilot.cta': 'Gratis beginnen',

  'pri.starter.subA': '2 990 € / jaar · 2 maanden gratis',
  'pri.starter.subM': '5 000 scans / maand',
  'pri.starter.f1': '5 000 scans / maand',
  'pri.starter.f2': '0,02 € per extra scan',
  'pri.starter.f3': 'SDK Web + iOS + Android',
  'pri.starter.f4': 'Volledige white label',
  'pri.starter.f5': 'SLA 99,9 % · prioritaire ondersteuning',
  'pri.starter.cta': 'Gratis proef starten',

  'pri.growth.subA': '4 990 € / jaar · 2 maanden gratis',
  'pri.growth.subM': '15 000 scans / maand',
  'pri.growth.f1': '15 000 scans / maand',
  'pri.growth.f2': '0,015 € per extra scan',
  'pri.growth.f3': 'Alles van Starter, plus:',
  'pri.growth.f4': 'Multimerk (tot 5)',
  'pri.growth.f5': 'Toegewijde accountmanager',
  'pri.growth.cta': 'Growth kiezen',

  'pri.ent.subA': 'vanaf · contract op maat',
  'pri.ent.subM': 'vanaf · zonder verbintenis',
  'pri.ent.f1': '25 000 scans / maand',
  'pri.ent.f2': '0,01 € per extra scan',
  'pri.ent.f3': 'Onbeperkt winkelnetwerk',
  'pri.ent.f4': 'Native mobiele app',
  'pri.ent.f5': 'SLA 99,99 % · wachtdienst 24/7',
  'pri.ent.cta': 'Contacteer ons',

  'pri.trust': 'Openbare tarieven · Btw niet inbegrepen · Op elk moment opzegbaar',

  'pri.args.eyebrow': 'Waarom voor ons kiezen',
  'pri.args.h2a': 'Waarom VYVRE',
  'pri.args.h2b': 'en niet de anderen?',
  'pri.arg1.e': 'Gemaakt in Frankrijk',
  'pri.arg1.t': 'De enige volledig Franse module voor huiddiagnose',
  'pri.arg1.b': 'Infrastructuur gehost in Frankrijk, team in Parijs, ondertekende DPA.',
  'pri.arg1.n': 'Vergelijkbare oplossingen worden buiten de Europese Unie gehost.',
  'pri.arg2.e': '−90 % op de factuur',
  'pri.arg2.t1': 'Tot 10× goedkoper',
  'pri.arg2.t2': 'dan de concurrentie',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'vanaf 299 € / maand',
  'pri.arg2.b3':
    '(3 588 € / jaar). SkinConsult AI begint bij ~50 000 € / jaar + 30 000 € opzetkosten, Perfect Corp bij ~30 000 € / jaar.',
  'pri.arg2.n': 'Gedetailleerde vergelijkende tabel verderop op deze pagina.',
  'pri.arg3.e': 'Activering binnen 48 u',
  'pri.arg3.t': 'Integratiecode verstuurd na de betaling',
  'pri.arg3.b1': 'U plakt',
  'pri.arg3.b2': 'op uw site en het staat online.',
  'pri.arg3.n': 'Geen kick-offvergadering, geen gefactureerde externe integrator.',
  'pri.arg4.e': 'Zonder verbintenis',
  'pri.arg4.t': 'Opzeggen met één klik',
  'pri.arg4.b':
    'Overstap naar een lager of hoger plan, of opzegging, vanuit uw dashboard. Geen contractuele vergrendeling, geen boete.',
  'pri.arg4.n': 'U behoudt de export van al uw scangegevens.',
  'pri.arg5.e': 'Volledige white label',
  'pri.arg5.t': 'Uw merk, niet het onze',
  'pri.arg5.b':
    'Logo, kleuren, typografie, aanbevolen producten — alles is afgestemd op uw huisstijl.',
  'pri.arg5.n': 'Geen opgelegde vermelding « Powered by VYVRE » vanaf het Starter-plan.',
  'pri.arg6.e': 'Peer-reviewed wetenschap',
  'pri.arg6.t': 'Een meting, geen simulatie',
  'pri.arg6.b':
    'Colorimetrie CIE L*a*b*, 68 herkenningspunten van het gezicht, indices afgeleid uit de dermatologische literatuur.',
  'pri.arg6.n': 'Bibliografie: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Marktvergelijking · vastgestelde openbare prijzen 2025',
  'pri.tbl.h1': 'Oplossing',
  'pri.tbl.h2': 'Jaartarief (instap)',
  'pri.tbl.h3': 'Opzet / integratie',
  'pri.tbl.h4': 'Hosting',
  'pri.tbl.h5': 'Activering',
  'pri.tbl.from': 'Vanaf',
  'pri.tbl.month': '/maand',
  'pri.tbl.year': '/jaar',
  'pri.tbl.fromApprox': 'vanaf',
  'pri.tbl.onQuote': 'op offerte',
  'pri.tbl.france': 'Frankrijk',
  'pri.tbl.w812': '8-12 wk.',
  'pri.tbl.w12': '12 wk. en +',
  'pri.tbl.w68': '6-8 wk.',
  'pri.tbl.note':
    'Tarieven van concurrenten: vastgestelde openbare grootteordes (aanbestedingen van cosmeticamerken 2024-2025).',

  'pri.del.eyebrow': 'Opstart · vanaf de seconde van de betaling',
  'pri.del.h2a': 'Wat u krijgt,',
  'pri.del.h2b': 'vanaf de bevestiging door Stripe.',
  'pri.del1.t': 'Welkomstmail',
  'pri.del1.b': 'Met uw persoonlijke beheerlink en uw inloggegevens.',
  'pri.del2.t': 'Integratiecode klaar om te plakken',
  'pri.del3.t': 'Vooraf ingevulde productcatalogus',
  'pri.del3.b':
    '30 tot 60 van uw producten overgenomen van uw site, al gekoppeld aan de biomarkers.',
  'pri.del4.t': 'Vormgeving in uw merk',
  'pri.del4.b':
    'Logo, kleurenpalet en merknaam toegepast op de module en op het dashboard.',
  'pri.del5.t': 'Analytisch dashboard',
  'pri.del5.b':
    'Scans per dag, conversiepercentage, gemiddelde biomarkers, meest aanbevolen producten.',
  'pri.del6.t': 'Volledige AVG-export',
  'pri.del6.b':
    'U behoudt al uw scangegevens, op elk moment exporteerbaar in CSV.',

  'pri.faq.eyebrow': 'Veelgestelde vragen',
  'pri.faq.h2a': 'Alles wat u wilt',
  'pri.faq.h2b': 'weten.',
  'pri.faq1.q': 'Wat gebeurt er als ik mijn scanquotum overschrijd?',
  'pri.faq1.a':
    'De dienst gaat door. Elke extra scan wordt gefactureerd tussen 0,01 € en 0,02 € naargelang uw plan, op de factuur van de volgende maand.',
  'pri.faq2.q': 'Waar worden de gegevens van de gebruiksters opgeslagen?',
  'pri.faq2.a':
    'Uitsluitend in Frankrijk. Geen enkele foto bewaard, geen enkele overdracht buiten de Europese Unie, ondertekende DPA.',
  'pri.faq3.q': 'Kan ik onderweg van plan veranderen?',
  'pri.faq3.a':
    'Ja, op elk moment vanuit uw dashboard. Overstap naar een hoger plan onmiddellijk pro rata, overstap naar een lager plan de volgende maand.',
  'pri.faq4.q': 'Welk niveau van technische ondersteuning?',
  'pri.faq4.a':
    'E-mailondersteuning binnen 48 u op alle plannen. Prioritaire ondersteuning met een toegewijde accountmanager vanaf Growth.',
  'pri.faq5.q': 'Zijn de aanbevolen producten instelbaar?',
  'pri.faq5.a':
    'Ja. Uw catalogus is volledig aanpasbaar: u voegt producten toe, verwijdert ze en wijzigt ze vanuit het dashboard.',

  'pri.cal.eyebrow': 'Nog niet klaar?',
  'pri.cal.h2': 'Boek een demonstratie van 20 minuten',
  'pri.cal.p':
    'Charles, oprichter, toont u de module via videoconferentie en beantwoordt al uw technische en contractuele vragen.',
  'pri.cal.cta': '20 min boeken →',

  /* ─────────── juridische pagina’s ─────────── */
  'legal.notice.t': 'De Franse versie is rechtsgeldig',
  'legal.notice.b':
    'De onderstaande tekst blijft bewust in het Frans: alleen de Franse versie van dit document heeft contractuele waarde. De titels zijn vertaald om het lezen te vergemakkelijken. Een vertaling uit hoffelijkheid kan worden aangevraagd via charles@symphonydrive.com.',
  'legal.updated': 'Laatste bijwerking:',
  'legal.version': 'Versie 1.0 —',

  'cgv.meta.title': 'Algemene verkoopvoorwaarden · VYVRE',
  'cgv.meta.desc':
    'Algemene verkoopvoorwaarden VYVRE Business — SaaS-abonnementen B2B voor cosmeticamerken.',
  'cgv.eyebrow': 'Algemene verkoopvoorwaarden',
  'cgv.h1': 'Algemene verkoopvoorwaarden.',
  'cgv.a1': 'Artikel 1 — Voorwerp',
  'cgv.a2': 'Artikel 2 — Inschrijving en activering',
  'cgv.a3': 'Artikel 3 — Tarieven',
  'cgv.a4': 'Artikel 4 — Betalingsvoorwaarden',
  'cgv.a5': 'Artikel 5 — Duur en opzegging',
  'cgv.a6': 'Artikel 6 — Dienstverbintenis (SLA)',
  'cgv.a7': 'Artikel 7 — Eigendom van de gegevens',
  'cgv.a8': 'Artikel 8 — Beperking van aansprakelijkheid',
  'cgv.a9': 'Artikel 9 — Vertrouwelijkheid en AVG',
  'cgv.a10': 'Artikel 10 — Toepasselijk recht en bevoegde rechtbank',

  'conf.meta.title': 'Privacybeleid · VYVRE',
  'conf.meta.desc':
    'Privacybeleid en bescherming van persoonsgegevens VYVRE. AVG-conformiteit.',
  'conf.eyebrow': 'Gegevensbescherming · AVG',
  'conf.h1': 'Privacy.',
  'conf.b1': 'Verwerkingsverantwoordelijke',
  'conf.b2': 'Gegevens verzameld door de huidscan',
  'conf.b3': 'Hosting van de gegevens',
  'conf.b4': 'Gegevens verzameld door de website',
  'conf.b5': 'Gegevens verzameld bij een aankoop',
  'conf.b6': 'Rechtsgrond van de verwerking',
  'conf.b7': 'Bewaartermijn',
  'conf.b8': 'Uw AVG-rechten',
  'conf.b9': 'DPA (verwerkersovereenkomst)',

  'ml.meta.title': 'Juridische informatie · VYVRE',
  'ml.meta.desc': 'Juridische informatie van VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Juridische informatie',
  'ml.h1': 'Juridische informatie.',
  'ml.b1': 'Uitgever van de site',
  'ml.b2': 'Directeur van de publicatie',
  'ml.b3': 'Hosting',
  'ml.b4': 'Intellectuele eigendom',
  'ml.b5': 'Beperking van aansprakelijkheid',
  'ml.b6': 'Hyperlinks',
  'ml.b7': 'Toepasselijk recht',

  'dpa.meta.title': 'DPA · Verwerkersovereenkomst · VYVRE',
  'dpa.meta.desc':
    'Verwerkersovereenkomst (artikel 28 AVG) tussen VYVRE en de B2B-klanten.',
  'dpa.eyebrow': 'Artikel 28 AVG · Verwerker',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Partijen',
  'dpa.b2': '2. Voorwerp van de verwerking',
  'dpa.b3': '3. Categorieën van verwerkte gegevens',
  'dpa.b4': '4. Categorieën van betrokkenen',
  'dpa.b5': '5. Duur van de verwerking',
  'dpa.b6': '6. Verplichtingen van de verwerker',
  'dpa.b7': '7. Beveiligingsmaatregelen (artikel 32 AVG)',
  'dpa.b8': '8. Subverwerkers',
  'dpa.b9': '9. Doorgiften buiten de Europese Unie',
  'dpa.b10': '10. Audit en controle',
  'dpa.b11': '11. Melding van datalekken',
  'dpa.b12': '12. Teruggave en verwijdering van de gegevens',
} as const;

export default nl;
