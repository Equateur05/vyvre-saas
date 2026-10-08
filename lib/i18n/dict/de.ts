/**
 * VYVRE — deutsches Wörterbuch der Next-Seiten (Marken, accuracy, pricing, Recht).
 *
 * Französisch ist die Quelle: Jeder dort hinzugefügte Schlüssel muss auch in den
 * elf anderen Dateien in /lib/i18n/dict ergänzt werden. Was nie übersetzt wird,
 * bleibt im JSX: Markennamen, « VYVRE », « skin intelligence », Titel
 * wissenschaftlicher Arbeiten, Zeitschriftennamen, Codeauszüge, Zahlen und Preise in Euro.
 */

const de = {
  /* ─────────── gemeinsam: Kopfzeile, Fußzeile, Auswahl ─────────── */
  'lang.aria': 'Sprache wählen',
  'nav.manifeste': 'Manifest',
  'nav.method': 'Methode',
  'nav.demo': 'Scan testen',
  'nav.pricing': 'Preise',

  'footer.city': 'VYVRE · Paris',
  'footer.cityFull': 'VYVRE · Paris, Frankreich',
  'footer.book': '20 Min. buchen →',
  'footer.manifeste': 'Manifest',
  'footer.method': 'Methodik',
  'footer.cgv': 'AGB',
  'footer.legal': 'Impressum',
  'footer.privacy': 'Datenschutz',
  'footer.privacyGdpr': 'Datenschutz · DSGVO',
  'footer.dpa': 'DPA',
  'footer.contact': 'Kontakt',
  'footer.home': 'Startseite',
  'footer.rights': 'Alle Rechte vorbehalten',
  'footer.company': 'SAS mit 1.000 € Kapital · Paris, Frankreich · SIREN in Eintragung',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Gemessene Hautdiagnose für Pflegemarken',
  'home.meta.desc':
    'Die einzige Hautdiagnose mit öffentlichem Preis. Infrastruktur in Frankreich, DSGVO ab Werk, Verarbeitung auf dem Gerät, kein Foto wird hochgeladen.',

  'home.hero.eyebrow': 'Gemessene Hautdiagnose',
  'home.hero.h1a': 'Die Hautdiagnose',
  'home.hero.h1b': 'Ihres Hauses.',
  'home.hero.p':
    'Weniger als zehn Sekunden Kamera. Acht Messwerte, Pixel für Pixel gelesen. Eine Routine, komponiert allein aus Ihrem Katalog.',
  'home.hero.cta1': 'Scan testen',
  'home.hero.cta2': 'Meine Marke ausstatten',

  'home.stat1': 'Hautmesswerte',
  'home.stat2': 'Dauer des Scans',
  'home.stat3': 'Livegang',
  'home.stat4': 'Gespeichertes Foto',

  'home.man.h2a': 'Gemessen,',
  'home.man.h2b': 'nicht geraten.',
  'home.man.p':
    'Der Motor wandelt jede Zone des Gesichts in CIE-L*a*b*-Koordinaten um, dann in dermatologische Indizes. Keine Schätzung aus einem Filter: eine optische, reproduzierbare, dokumentierte Messung.',
  'home.man.link': 'Methodik lesen →',

  'home.mes.h2a': 'Acht Messwerte.',
  'home.mes.h2b': 'Eine einzige Erfassung.',
  'home.mes.1.n': 'Teint',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Leuchtkraft',
  'home.mes.2.u': 'Luminanz L*',
  'home.mes.3.n': 'Rötungen',
  'home.mes.3.u': 'Erythem-Index',
  'home.mes.4.n': 'Ebenmäßigkeit',
  'home.mes.4.u': 'Chromatische Standardabweichung',
  'home.mes.5.n': 'Textur',
  'home.mes.5.u': 'Lokaler Mikrokontrast',
  'home.mes.6.n': 'Poren',
  'home.mes.6.u': 'Dichte der Minima',
  'home.mes.7.n': 'Talg',
  'home.mes.7.u': 'Spiegelnde Reflexion',
  'home.mes.8.n': 'Feuchtigkeit',
  'home.mes.8.u': 'Optischer TEWL-Proxy',

  'home.steps.h2a': 'Drei Schritte.',
  'home.steps.h2b': 'Null Reibung.',
  'home.step1.t': 'Die Kundin scannt',
  'home.step1.d':
    'Kamera des Telefons oder des Beratungsplatzes. Nichts zu installieren, nichts hochzuladen: Das Bild wird verarbeitet und danach gelöscht.',
  'home.step2.t': 'Der Motor komponiert',
  'home.step2.d':
    'Eine Morgen- und Abendroutine allein aus Ihrem Katalog, gewichtet nach den Messwerten und Ihren kommerziellen Prioritäten.',
  'home.step3.t': 'Sie gehen live',
  'home.step3.d':
    'Eine Skriptzeile auf Ihrer Website, Ihre Farben, Ihre Typografie. Kein Entwickler bei Ihnen gebunden.',

  'home.groupe.eyebrow': 'Für Konzerne',
  'home.groupe.h2a': 'Ein Haus, zehn Marken,',
  'home.groupe.h2b': 'ein einziger Motor.',
  'home.socle1.t': 'Multi-Marken',
  'home.socle1.d':
    'Ein Bereich je Marke: Katalog, Gestaltungsrichtlinie, Empfehlungsregeln und Statistiken getrennt.',
  'home.socle2.t': 'Souveränität',
  'home.socle2.d':
    'Hosting in Frankreich, DSGVO ab Werk, DPA unterzeichnet, kein Bild gespeichert, kein Pixel Dritter.',
  'home.socle3.t': 'Boutique und E-Shop',
  'home.socle3.d':
    'Derselbe Motor am Tresen auf dem Tablet und auf der Produktseite, mit derselben Messreferenz.',

  'home.price.h2a': 'Ab 299 €/Monat.',
  'home.price.h2b': 'Preis sichtbar.',
  'home.price.cta': 'Pläne ansehen',

  'home.faq.h2': 'Fragen.',
  'home.faq1.q': 'Wie gelangt mein Katalog in den Motor?',
  'home.faq1.a':
    'Über einen CSV-Feed oder die API Ihres E-Commerce (Shopify, Salesforce Commerce, Centra). Kein Administratorzugang, Synchronisation jede Nacht.',
  'home.faq2.q': 'Was geschieht mit dem Bild der Kundin?',
  'home.faq2.a':
    'Es wird im Arbeitsspeicher ausgewertet und danach gelöscht: Kein Foto wird gespeichert oder übertragen. Hosting in Frankreich, DPA verfügbar.',
  'home.faq3.q': 'Kann der Motor einen Wettbewerber empfehlen?',
  'home.faq3.a':
    'Nein. Die Routine wird ausschließlich aus Ihrem Katalog zusammengestellt, mit den Prioritäten, die Sie festlegen.',
  'home.faq4.q': 'Welche Ausstattung ist nötig?',
  'home.faq4.a':
    'Eine 720p-Kamera genügt, mobil wie am Computer. Auf neueren Sensoren gewinnen die Ergebnisse an Feinheit.',

  'home.cta.h2': 'Den Scan auf Ihrem Katalog sehen.',
  'home.cta.1': 'Demo starten',
  'home.cta.2': 'Demo anfragen',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Methodik & Präzision · VYVRE',
  'acc.meta.desc':
    'Begutachtete Quellen (5 zitiert, 4 auf der Roadmap), Berechnungsmethode, Konfidenzintervalle, Grenzen. Die wissenschaftliche Transparenz hinter der VYVRE-Engine.',

  'acc.hero.eyebrow': 'Methodik · Quellen · Grenzen',
  'acc.hero.h1a': 'Die Wissenschaft',
  'acc.hero.h1b': 'hinter dem Scan.',
  'acc.hero.p':
    'Acht Messwerte, aus dem Bild gelesen. Hier: die wissenschaftlichen Quellen, die Berechnungsmethode, die Konfidenzintervalle und die Grenzen des Motors.',
  'acc.hero.note1':
    'Geschätzte Präzision ±5 Jahre biologisches Alter · ±4 Jahre gefühltes Alter (95 % Konfidenzintervall · interne Kohorte n=12)',
  'acc.hero.note2':
    'Externe Validierung n=100 für Ende 2026 geplant · Überarbeitung Mai 2026 nach internem Audit',

  'acc.s1.eyebrow': '01 · Bibliografie · Angewandte Quellen',
  'acc.s1.h2a': '5 peer-reviewte Quellen',
  'acc.s1.h2b': 'und was die Engine davon anwendet.',
  'acc.s1.p1': 'Was jede dieser 5 Quellen zur Engine beiträgt, im Code überprüfbar (siehe',
  'acc.s1.p2': ', Funktion',
  'acc.s1.p3': 'und',
  'acc.s1.p4': '). Seit Oktober 2026 hängt keine der acht Messungen von der Hautfarbe oder der Bildhelligkeit ab: Jede Messung vergleicht die Haut mit sich selbst, auf demselben Bild.',
  'acc.s1.foot1': 'Engine v10.13 — relative Messungen, Oktober 2026',
  'acc.s1.foot2': 'Angewandte Quellen Zeile für Zeile überprüfbar in',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — Grundlage der automatischen Erkennung des Fitzpatrick-Hauttyps I-VI',
  'acc.src2.c':
    'Melanin- und Erythem-Index – nur zur Information berechnet. Rötung wird als a* (CIE L*a*b*) auf den Wangen gelesen; Pigmentierung wird am eigenen Hautton der Person gemessen (Bereiche, die 10 % dunkler sind als die eigene Haut).',
  'acc.src3.c':
    'Früherer σL*-Indikator (Feuchtigkeit und Poren), im Oktober 2026 entfernt: Er las vor allem den Schatten des Reliefs. Feuchtigkeit: feinste Mikrotextur der Wangen, ohne Poren, bezogen auf das Niveau der Haut. Poren: kleine dunkle Punkte, die sich von der umgebenden Hautstruktur abheben.',
  'acc.src4.c':
    'Spiegelnde Glanzpunkte → Talg, mit einer Schwelle relativ zum Hautniveau der Wangen. Ausstrahlung liest keine rohe Helligkeit mehr: Gleichmäßigkeit des Lichts auf Wangenknochen und Stirn, weicher Glanz der Wangenknochen, bezogen auf die eigene Haut.',
  'acc.src5.c':
    'Abstand gefühltes Alter / biologisches Alter (kaukasische Kohorte ~1.700 Probanden). v7: altersabhängiger Abstand (−2 bis −6 Jahre je nach biologischem Alter), nicht an den Hauttyp gebunden.',

  'acc.s2.eyebrow': '02 · Bibliografie · Roadmap Ende 2026',
  'acc.s2.h2a': '4 referenzierte Quellen',
  'acc.s2.h2b': 'noch nicht vollständig angewandt.',
  'acc.s2.p':
    'Diese Quellen werden aus Gründen der Transparenz und für die öffentliche Roadmap genannt. Ihre vollständigen Koeffizienten sind noch nicht in die Formeln eingebunden — Extraktion und Validierung für Ende 2026 mit einem Dermatologen als Partner geplant.',
  'acc.rm.appliedLabel': 'Teilweise angewandt: ',
  'acc.rm.roadmapLabel': 'Roadmap: ',
  'acc.rm1.a':
    'Ankeralter 40 (Median der erwachsenen Kohorte) + Korrelation r=0,78 periorbitale Falten ↔ Alter',
  'acc.rm1.r':
    'Extraktion aus Bildern → morphologischer Grad 0-5 (Bazin-Skala) noch nicht umgesetzt. Für Ende 2026 geplant.',
  'acc.rm2.a': 'Moderate Anpassung von −4 % bis −8 % beim biologischen Alter für die Hauttypen IV-VI',
  'acc.rm2.r':
    'Vollständige Koeffizienten je Hauttyp für Falten / Festigkeit / Pigmentierung noch nicht extrahiert.',
  'acc.rm3.a': 'Zitiert für den multiethnischen Kontext',
  'acc.rm3.r':
    'Spezifische Koeffizienten noch nicht extrahiert. Validierung an einer multiethnischen Kohorte für Ende 2026 geplant.',
  'acc.rm4.a': 'Klinische TEWL-Normwerte referenziert (gesund ≤ 15 g/m²/h, gestört ≥ 25)',
  'acc.rm4.r':
    'Die numerische Berechnung σL* → TEWL folgt Stamatas 2011 (und nicht Akdeniz). Kreuzvalidierung geplant.',

  'acc.bench.eyebrow': 'Öffentlicher Benchmark · UTKFace · 26. Mai 2026',
  'acc.bench.h2a': 'Öffentlich verglichen',
  'acc.bench.h2b': 'mit 3 Open-Source-Referenzen.',
  'acc.bench.p':
    'VYVRE v7.0 an 300 öffentlichen UTKFace-Gesichtern getestet (stratifiziert 18-80 Jahre), neben DeepFace, InsightFace und OpenCV DNN. Ergebnis ohne Retusche veröffentlicht, reproduzierbarer Code, 5 Skripte, 4 Min. Laufzeit.',
  'acc.bench.k1.l': '30-44 (Ziel)',
  'acc.bench.k1.n': 'MAE — vor OpenCV (8,66 Jahre)',
  'acc.bench.k2.l': 'Gesamt (18-80)',
  'acc.bench.k2.n': 'MAE — hinter den tiefen Netzen',
  'acc.bench.k3.l': 'Bias mit Vorzeichen',
  'acc.bench.k3.n': 'Der neutralste der 4 Motoren',
  'acc.bench.cta': 'Vollständigen Benchmark ansehen →',

  'acc.s3.eyebrow': '03 · Farbmetrische Standards (Fundament)',
  'acc.s3.p':
    'Zugrunde liegende normative Standards — keine peer-reviewten Artikel, sondern technische Spezifikationen, die in der Verarbeitungskette aktiv sind.',
  'acc.s3.std1': 'Farbraum sRGB (Gamma-Dekodierung)',
  'acc.s3.std2': 'RGB-Primärfarben Rec. 709',
  'acc.s3.std3': 'Umrechnung XYZ → L*a*b*',
  'acc.s3.std4': 'Fitzpatrick-Grenzen nach ITA°',
  'acc.s3.std5': 'Erkennung von Hautpixeln in YCbCr',
  'acc.s3.std6': 'Laplace-Schärfemessung',
  'acc.s3.std7':
    'wird nicht mehr verwendet: Seit Oktober 2026 hängt die Festigkeit nicht mehr von der Hautfarbe ab (Relief der Nasolabialfalte, Kontur des unteren Gesichts, Mundwinkel).',

  'acc.s4.eyebrow': '04 · Verarbeitungskette',
  'acc.s4.h2': 'Berechnungsmethode.',
  'acc.st1.t': 'Bildaufnahme',
  'acc.st1.d':
    'Standard-Webcam (≥ 720p). Weniger als 10 Sekunden Aufnahme, 8 Bilder behalten. Gesichtserkennung durch face-api.js (68 Landmarken). Zuschnitt der Gesichtszone und Lichtkorrektur.',
  'acc.st2.t': 'Farbmetrische Umrechnung',
  'acc.st2.d':
    'Kette sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Selbsttest an 6 Referenzfarben bei jedem Scan. Pixelgenau.',
  'acc.st3.t': 'Extraktion der Signale',
  'acc.st3.d':
    'Farbe (L*a*b*: ITA° für den Hauttyp, a* für Rötung), Glanz (Talg) und relative Texturen: kleine dunkle Punkte (Poren), Mikrotextur (Feuchtigkeit), Falten an den Augenwinkeln und der Stirn (Falten), Nasolabialfalte und unteres Gesicht (Festigkeit), Gleichmäßigkeit des Lichts (Ausstrahlung). Wangen, Nase, Stirn, Augenpartie.',
  'acc.st4.t': 'Umwandlung in Biomarker',
  'acc.st4.d':
    'Jedes Signal ist eine Abweichung der Haut von sich selbst, auf demselben Bild: nie eine Hautfarbe oder eine absolute Helligkeit. Umrechnung in einen Wert von 0-100 mit benannten Konstanten, an Testfotos eingestellt und als solche gekennzeichnet; eine nicht lesbare Messung ergibt einen neutralen, gekennzeichneten Wert.',
  'acc.st5.t': 'Erkennung des Hauttyps',
  'acc.st5.d':
    'Fitzpatrick-Klassifikation I-VI über ITA° (Chardon 1991), nur zur Information angezeigt. Keine der acht Messungen verwendet den Hauttyp oder die Hautfarbe.',
  'acc.st6.t': 'Altersschätzung + Intervall',
  'acc.st6.d':
    'Das Alter wird nicht angezeigt: Die Kombination der Messungen folgt dem tatsächlichen Alter noch nicht zuverlässig. Es wird erst nach einer Validierung an Gesichtern bekannten Alters angezeigt.',

  'acc.s5.eyebrow': '05 · Hautalter · Methode v7',
  'acc.s5.h2a': 'Gefühltes Hautalter',
  'acc.s5.h2b': 'oder rohes biologisches Alter.',
  'acc.s5.p': 'Zwei Zahlen werden berechnet, nur eine wird angezeigt. Hier ist der Grund.',
  'acc.age.l.tag': 'Angezeigt — Hautalter',
  'acc.age.l.h3': 'Visuell wahrgenommenes Alter',
  'acc.age.l.p':
    'Durchschnittliches Alter, das ein menschlicher Betrachter sozial wahrnimmt. Kalibriert nach Vierkötter & Krutmann 2012 (kaukasische Kohorte ~1.700 Probanden) mit einem Abstand,',
  'acc.age.l.pEm': 'der vom Alter abhängt',
  'acc.age.l.li1': '< 30 Jahre bio → −2 Jahre',
  'acc.age.l.li2': '30-45 Jahre bio → −4 Jahre',
  'acc.age.l.li3': '45-60 Jahre bio → −5 Jahre',
  'acc.age.l.li4': '60 Jahre und mehr bio → −5 bis −6 Jahre',
  'acc.age.l.note':
    'Die v7 entfernt die Hauttyp-Zuordnung der v6, die in der Originalquelle fehlt. Der Hauttyp beeinflusst das biologische Alter (Diridollou), nicht die soziale Wahrnehmung.',
  'acc.age.r.tag': 'Intern — Biologisches Alter',
  'acc.age.r.h3': 'Rohes biologisches Alter',
  'acc.age.r.p':
    'Direkte Schätzung des physischen Hautzustands über den dominanten Faltenwert (periorbitale Falten, Bazin 2007). Korrelation r=0,78 mit dem chronologischen Alter auf Studiofotos.',
  'acc.age.r.note1': 'Formel v7:',
  'acc.age.r.note2':
    'Der Faktor 0,85 (JPEG-Webcam-Abschlag) ist eine bewusst empirische Kompensation; Validierung an einer großen Kohorte für Ende 2026 geplant.',
  'acc.age.prec1': 'Geschätzte Präzision:',
  'acc.age.prec.bio': '±5 Jahre biologisches Alter',
  'acc.age.prec.perc': '±4 Jahre gefühltes Alter',
  'acc.age.prec2': '(95 % Konfidenzintervall an interner Kohorte n=12)',
  'acc.age.prec3': 'Externe Validierung n=100 für Ende 2026 geplant',

  'acc.s6.eyebrow': '06 · Verhalten nach Bildqualität · v7',
  'acc.s6.h2a': '3 Konfidenzstufen.',
  'acc.s6.h2b': 'Keine schmeichelnden Zugeständnisse.',
  'acc.s6.p':
    'Die v7 entfernt die Korrektur v6.2, die degradierte Scans künstlich verjüngte (Paradox „je weniger der Motor sieht, desto mehr schmeichelt er“). Stattdessen 3 explizite Konfidenzstufen.',
  'acc.q1.tag': 'Qualität < 40',
  'acc.q1.h3': 'Scan abgelehnt',
  'acc.q1.p1': 'Keine Schätzung veröffentlicht. Meldung',
  'acc.q1.p2':
    'mit der Empfehlung, den Scan bei besserem Licht zu wiederholen. Die Schätzung wird nicht berechnet.',
  'acc.q2.tag': '40 ≤ Qualität < 60',
  'acc.q2.h3': 'Geringe Konfidenz',
  'acc.q2.p1': 'Schätzung bestenfalls veröffentlicht, aber gekennzeichnet',
  'acc.q2.p2':
    '. Intervall auf ±7 Jahre erweitert (statt ±5 im Standard). Die Schätzung bleibt ehrlich, nicht verschoben.',
  'acc.q3.tag': 'Qualität ≥ 60',
  'acc.q3.h3': 'Standard',
  'acc.q3.p1': 'Standardschätzung mit',
  'acc.q3.p2':
    '. Intervall ±5 Jahre (95 % an interner Kohorte n=12). Nominales Verhalten für eine gut ausgeleuchtete HD-Webcam.',
  'acc.s6.foot1': 'Korrektur v6.2 entfernt: −5 Jahre bei einem degradierten Scan (Qualität < 45)',
  'acc.s6.foot2':
    'Die v7 erweitert das Intervall, statt die Schätzung zu verschieben (Ehrlichkeit statt Schmeichelei)',

  'acc.s7.eyebrow': '07 · Varianztests',
  'acc.s7.h2': 'Reproduzierbarkeit.',
  'acc.s7.p':
    'Test: derselbe Proband 10-mal unter 10 verschiedenen Lichtbedingungen gescannt. Messung der Standardabweichung der Werte. Interne Kohorte n=12.',
  'acc.var1': 'Falten',
  'acc.var2': 'Festigkeit',
  'acc.var3': 'Pigmentierung',
  'acc.var4': 'Feuchtigkeit',
  'acc.var5': 'Leuchtkraft',
  'acc.var6': 'Poren',
  'acc.var7': 'Rötung',
  'acc.var8': 'Gefühltes Alter',
  'acc.var.unitPts': 'Pkt./100',
  'acc.var.unitYears': 'Jahre',
  'acc.s7.foot1':
    'Interne Kohorte · n=12 Probanden Hauttypen I-IV · 10 Scans/Proband · wechselndes Licht · HD-Webcam 720p',
  'acc.s7.foot2':
    'Hauttypen V-VI: Extrapolation Diridollou 2007 — Validierung an dedizierter Kohorte für Ende 2026 geplant',
  'acc.s7.foot3': 'Externe Validierung n=100 für Ende 2026 geplant',

  'acc.s8.eyebrow': '08 · Validierungs-Roadmap',
  'acc.s8.h2a': 'Was wir uns verpflichten',
  'acc.s8.h2b': 'zu validieren.',
  'acc.q.late2026': 'Ende 2026',
  'acc.q.q42026': 'Q4 2026',
  'acc.rd1.t': 'Validierung an externer Kohorte n=100',
  'acc.rd1.b':
    'Rekrutierung von 100 unterschiedlichen Probanden (20-75 Jahre, Hauttypen I-VI). Messung der Übereinstimmung mit den Referenzgeräten Visia / Antera. Methodische Veröffentlichung.',
  'acc.rd2.t': 'Morphologischer Bazin-Grad 0-5',
  'acc.rd2.b':
    'Extraktion des morphologischen Bazin-Grades aus den Bildern (Atlas Bd. 1, Kap. 4) — heute werden nur das Ankeralter 40 und die Korrelation r=0,78 genutzt. Umsetzung der Erkennung der Faltentiefe und der Klassifizierung 0-5.',
  'acc.rd3.t': 'Koeffizienten je Hauttyp (Diridollou + Flament)',
  'acc.rd3.b':
    'Extraktion der Koeffizienten von Diridollou 2007 und Flament 2023 für Falten / Festigkeit / Pigmentierung je Hauttyp. Die v7 wendet heute eine moderate Anpassung von −4 % bis −8 % auf das biologische Alter der Hauttypen IV-VI an; Ziel: vollständige Zuordnung je Hauttyp mit den Koeffizienten der Quellen.',
  'acc.rd4.t': 'Peer-reviewte Veröffentlichung',
  'acc.rd4.b':
    'Einreichung eines methodischen Artikels, der die VYVRE-Kette beschreibt (Consumer-Webcam → CIE-L*a*b*-Biomarker → Altersschätzung), mit Validierung an einer Kohorte n=100. Ziel: Int J Cosmet Sci oder Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Grenzen',
  'acc.s9.h2a': 'Was VYVRE',
  'acc.s9.h2b': 'nicht leistet.',
  'acc.s9.p':
    'Wir sind lieber radikal ehrlich darüber, was der Motor nicht misst, als Illusionen zu verkaufen.',
  'acc.lim1.t': 'VYVRE ist kein Medizinprodukt',
  'acc.lim1.b':
    'Der Motor stellt keine medizinische Diagnose. Er erkennt keine dermatologischen Erkrankungen (Hautkrebs, Melanom, Dermatitis, Psoriasis usw.). Bei jedem medizinischen Anliegen wenden Sie sich an eine Hautärztin oder einen Hautarzt.',
  'acc.lim2.t': 'Eine Standard-Webcam ist kein professioneller Scanner',
  'acc.lim2.b':
    'Ein professioneller dermatologischer Scanner nutzt polarisiertes Licht, UV-Fluoreszenz und einen 3D-Sensor. VYVRE stützt sich auf eine Standard-Webcam und unkontrolliertes Licht. Varianz ±8 % (gegenüber ±2 % in der Praxis).',
  'acc.lim3.t': 'Keine 3D-Erkennung der Falten',
  'acc.lim3.b':
    'Die tatsächliche Faltentiefe erfordert einen stereoskopischen Sensor. VYVRE schätzt den Schweregrad über die farbmetrische Analyse der Schatten (2D-Ansatz). Zuverlässig bei ausgeprägten Falten, weniger genau bei beginnenden Fältchen.',
  'acc.lim4.t': 'Tiefe Hyperpigmentierung nicht erkannt',
  'acc.lim4.b':
    'Subepidermale Pigmentflecken (tiefes Melasma, alte aktinische Flecken) sind im sichtbaren Licht nicht erkennbar. Dafür wäre eine UV-Fluoreszenzkamera nötig (nicht enthalten).',
  'acc.lim5.t': 'Hauttypen V-VI: bewusste Extrapolation',
  'acc.lim5.b':
    'Die interne Kohorte n=12 enthält überwiegend die Hauttypen I-IV. Die Anpassungen für V-VI sind aus den Daten von Diridollou 2007 extrapoliert (−4 % bis −8 % beim biologischen Alter). Validierung an dedizierter Kohorte für Ende 2026 geplant.',
  'acc.lim6.t': 'Make-up, Brille, Maske',
  'acc.lim6.b':
    'Der Motor erkennt diese Verdeckungen und senkt den Qualitätswert. Ist die Qualität zu gering (< 40), wird der Scan abgelehnt. Zwischen 40 und 60 wird das Ergebnis mit einem ausdrücklichen Hinweis auf geringe Konfidenz und einem erweiterten Intervall veröffentlicht.',
  'acc.lim7.t': 'Die interne Kohorte n=12 ist klein — wir stehen dazu',
  'acc.lim7.b':
    'Die empirischen Koeffizienten (JPEG-Webcam-Abschlag, Intervallbreite) sind an 12 Probanden kalibriert. Das ist eine Testgruppe, keine klinische Kohorte. Die externe Validierung n=100 steht auf der Roadmap für Ende 2026.',

  'acc.s10.eyebrow': '10 · Zusatzmodul · Hautzustände (v1 indikativ)',
  'acc.s10.h2a': 'Visuelle Erkennung von 4 Zuständen',
  'acc.s10.h2b': 'indikativ, niemals medizinisch.',
  'acc.s10.p1': 'Separates Modul',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — optionales Laden in jeder Demonstration. Erkennt über Bildheuristiken 4 häufige sichtbare Zustände und schlägt eine gezielte kosmetische Routine vor, ohne jede Verschreibung.',
  'acc.s10.p3': 'Dieses Modul stellt keine medizinische Diagnose.',
  'acc.cond.sens': 'Sensitivität',
  'acc.cond.spec': 'Spezifität',
  'acc.cond.cohort': 'synthetische Kohorte n=12',
  'acc.cond1.a': 'Modul · Akne',
  'acc.cond1.t': 'Lokalisiertes a*-Erythem CIELAB + Texturvarianz L*',
  'acc.cond1.c':
    'Erkennung erythematöser Pixel, die sich in einzelnen Punkten in der T-Zone konzentrieren (Stirn, Nase, Kinn). Ausgabe: Wahrscheinlichkeit + Schweregrad (minimal, gering, mittel, hoch).',
  'acc.cond2.a': 'Modul · Rosazea',
  'acc.cond2.t': 'Medianer a*-Überschuss Wangen + Nase gegenüber der Basis + beidseitige Symmetrie',
  'acc.cond2.c':
    'Anhaltendes, beidseitiges Erythem auf Wangen und Nase. Die Symmetrie zwischen den Wangen gewichtet den Wert (Rosazea tritt beidseitig auf).',
  'acc.cond3.a': 'Modul · Melasma',
  'acc.cond3.t': 'ΔL* Stirn und Oberlippe vs. oberes L*-Quartil der Wangen + Δb* (Melanin)',
  'acc.cond3.c':
    'Symmetrische Hyperpigmentierung der Gesichtsmitte (Stirn, Oberlippe, Wangenknochen). Unterscheidet ein diffuses Melasma von einzelnen Flecken.',
  'acc.cond4.a': 'Modul · Lentigines',
  'acc.cond4.t': 'Fleckenerkennung (Größe 5-200 px², Kompaktheit ≥ 0,45)',
  'acc.cond4.c':
    'Einzelne Pigmentflecken mit scharfen Rändern auf Wangen und Stirn. Anzahl qualifizierter Flecken bezogen auf die Hautfläche (Dichte je 1.000 Pixel).',
  'acc.s10.why.t': 'Warum Heuristiken statt eines neuronalen Netzes?',
  'acc.s10.why1':
    'Die Datensätze ISIC / DermNet enthalten klinische Nahaufnahmen bei polarisiertem Licht, zentriert auf die Läsion. Eine Verteilung, die weit entfernt ist von einer Consumer-Webcam auf 50 cm bei unkontrolliertem Licht: Ein darauf trainiertes Modell ließe sich ohne erneutes Training an einer dedizierten VYVRE-Kohorte schlecht übertragen.',
  'acc.s10.why2':
    'Die Heuristiken bleiben Zeile für Zeile prüfbar, was ein undurchsichtiges Modell nicht ist. Vereinbar mit den Erklärbarkeitsanforderungen der großen Häuser.',
  'acc.s10.why3':
    'Kein Modell zum Herunterladen (0 MB), kein Grafikprozessor erforderlich, läuft in allen Browsern in weniger als 200 ms.',
  'acc.s10.why4a': 'Stabile Architektur: Eine v2 kann hinter derselben Schnittstelle ein gelerntes Modell einsetzen',
  'acc.s10.why4b': 'ohne bestehende Integrationen zu brechen.',
  'acc.s10.disc.t': 'Medizinischer Hinweis (bei jeder Anzeige verpflichtend)',
  'acc.s10.disc.b':
    'Dieses Modul ist kein Medizinprodukt. Es stellt keine Diagnose. Die zurückgegebenen Wahrscheinlichkeiten sind Hinweise auf Aufmerksamkeitszonen und dienen dazu, eine gezielte kosmetische Routine zu empfehlen. Bei jedem tatsächlichen Hautanliegen wenden Sie sich an eine Hautärztin oder einen Hautarzt.',
  'acc.s10.cta1': 'Demonstration Hautzustände ansehen →',
  'acc.s10.cta2': 'Quellcode des Moduls',

  'acc.s11.eyebrow': '11 · Qualitätssicherung · Ehrlichkeitsversprechen',
  'acc.s11.h2a': 'Lieber ehrlich',
  'acc.s11.h2b': 'als falsch präzise.',
  'acc.s11.p1':
    'Die v7.0 entfernt die Korrekturen v6.2, die der Nutzerin künstlich schmeichelten: verstecktes Verjüngen um 5 Jahre bei degradierter Webcam, Grenzen [20, 50], die einen 80-jährigen Probanden auf 50 zurückbrachten, eine ohne Quelle erfundene Zuordnung je Hauttyp.',
  'acc.s11.p2':
    'Wenn die tatsächliche Haut der Nutzerin für eine Hautärztin 38 Jahre alt ist, muss der Motor 38 sagen. Nicht 28 (schmeichelnde Lüge). Nicht 44 (falsche Härte). Eine echte Schätzung.',

  'acc.cta.h2a': 'Technische Fragen?',
  'acc.cta.h2b': 'Fordern Sie das vollständige DPA an.',
  'acc.cta.p':
    'Wir versenden auf Anfrage an Datenschutzbeauftragte, beratende Hautärzte und F&E-Teams: DPA, ausführliche Methodik, Präzisionsbericht, geprüfter Quellcode des Motors.',
  'acc.cta.1': 'Dokumentation anfordern →',
  'acc.cta.2': '← Zurück',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Preise · VYVRE',
  'pri.meta.desc':
    'Gemessene Hautdiagnose, gehostet in Frankreich. Pilot kostenlos, Starter 299 €/Monat, Growth 499 €/Monat, Enterprise ab 699 €/Monat.',

  'pri.banner1': 'Sie haben gerade die Demonstration {brand} getestet',
  'pri.banner2': '— Wählen Sie Ihren Plan, um sie auf Ihrer Website zu aktivieren.',

  'pri.hero.eyebrow': 'Preise · VYVRE Business',
  'pri.hero.h1a': 'Der Preis steht',
  'pri.hero.h1b': 'auf der Seite.',
  'pri.hero.p': 'Hosting in Frankreich · DSGVO ab Werk · Kein Foto gespeichert',

  'pri.toggle.monthly': 'Monatlich',
  'pri.toggle.annual': 'Jährlich',
  'pri.theme.label': 'Theme Ihres Widgets',
  'pri.theme.dark': 'Schwarz',
  'pri.theme.light': 'Weiß',
  'pri.theme.note': 'Ihre Diagnose erscheint in diesem Theme · später änderbar',

  'pri.card.plan': 'Plan',
  'pri.card.recommended': 'Empfohlen',
  'pri.per.month': '/Monat',

  'pri.pilot.price': 'Kostenlos',
  'pri.pilot.sub': '30 Tage · ohne Bindung',
  'pri.pilot.f1': '1.000 Scans / Monat',
  'pri.pilot.f2': 'SDK Web',
  'pri.pilot.f3': 'VYVRE-Branding',
  'pri.pilot.f4': 'E-Mail-Support binnen 48 h',
  'pri.pilot.f5': 'Infrastruktur in Frankreich',
  'pri.pilot.cta': 'Kostenlos starten',

  'pri.starter.subA': '2.990 € / Jahr · 2 Monate gratis',
  'pri.starter.subM': '5.000 Scans / Monat',
  'pri.starter.f1': '5.000 Scans / Monat',
  'pri.starter.f2': '0,02 € je zusätzlichem Scan',
  'pri.starter.f3': 'SDK Web + iOS + Android',
  'pri.starter.f4': 'Vollständiges White Label',
  'pri.starter.f5': 'SLA 99,9 % · Priority-Support',
  'pri.starter.cta': 'Gratis-Test starten',

  'pri.growth.subA': '4.990 € / Jahr · 2 Monate gratis',
  'pri.growth.subM': '15.000 Scans / Monat',
  'pri.growth.f1': '15.000 Scans / Monat',
  'pri.growth.f2': '0,015 € je zusätzlichem Scan',
  'pri.growth.f3': 'Alles aus Starter, plus:',
  'pri.growth.f4': 'Multi-Marken (bis zu 5)',
  'pri.growth.f5': 'Fester Ansprechpartner',
  'pri.growth.cta': 'Growth wählen',

  'pri.ent.subA': 'ab · maßgeschneiderter Vertrag',
  'pri.ent.subM': 'ab · ohne Bindung',
  'pri.ent.f1': '25.000 Scans / Monat',
  'pri.ent.f2': '0,01 € je zusätzlichem Scan',
  'pri.ent.f3': 'Unbegrenztes Boutique-Netz',
  'pri.ent.f4': 'Native Mobile-App',
  'pri.ent.f5': 'SLA 99,99 % · Rufbereitschaft 24/7',
  'pri.ent.cta': 'Kontakt aufnehmen',

  'pri.trust': 'Öffentliche Preise · zzgl. MwSt. · Jederzeit kündbar',

  'pri.args.eyebrow': 'Warum wir',
  'pri.args.h2a': 'Warum VYVRE',
  'pri.args.h2b': 'und nicht die anderen?',
  'pri.arg1.e': 'Made in France',
  'pri.arg1.t': 'Das einzige vollständig französische Modul zur Hautdiagnose',
  'pri.arg1.b': 'Infrastruktur in Frankreich gehostet, Team in Paris, DPA unterzeichnet.',
  'pri.arg1.n': 'Vergleichbare Lösungen werden außerhalb der Europäischen Union gehostet.',
  'pri.arg2.e': '−90 % auf der Rechnung',
  'pri.arg2.t1': 'Bis zu 10× günstiger',
  'pri.arg2.t2': 'als der Wettbewerb',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'ab 299 € / Monat',
  'pri.arg2.b3':
    '(3.588 € / Jahr). SkinConsult AI startet bei ~50.000 € / Jahr + 30.000 € Einrichtung, Perfect Corp bei ~30.000 € / Jahr.',
  'pri.arg2.n': 'Ausführliche Vergleichstabelle weiter unten auf dieser Seite.',
  'pri.arg3.e': 'Aktivierung in 48 h',
  'pri.arg3.t': 'Integrationscode nach Zahlung zugesendet',
  'pri.arg3.b1': 'Sie fügen',
  'pri.arg3.b2': 'auf Ihrer Website ein, und es ist online.',
  'pri.arg3.n': 'Kein Kick-off-Meeting, kein bezahlter externer Integrator.',
  'pri.arg4.e': 'Ohne Bindung',
  'pri.arg4.t': 'Kündigung mit einem Klick',
  'pri.arg4.b':
    'Wechsel in einen niedrigeren oder höheren Plan oder Kündigung, direkt aus Ihrem Dashboard. Keine vertragliche Bindung, keine Strafgebühr.',
  'pri.arg4.n': 'Sie behalten den Export all Ihrer Scan-Daten.',
  'pri.arg5.e': 'Volles White Label',
  'pri.arg5.t': 'Ihre Marke, nicht unsere',
  'pri.arg5.b':
    'Logo, Farben, Typografie, empfohlene Produkte — alles folgt Ihrer Gestaltungsrichtlinie.',
  'pri.arg5.n': 'Kein aufgezwungener Hinweis „Powered by VYVRE“, schon ab dem Plan Starter.',
  'pri.arg6.e': 'Peer-reviewte Wissenschaft',
  'pri.arg6.t': 'Eine Messung, keine Simulation',
  'pri.arg6.b':
    'Farbmetrik CIE L*a*b*, 68 Gesichtslandmarken, aus der dermatologischen Literatur abgeleitete Indizes.',
  'pri.arg6.n': 'Bibliografie: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Marktvergleich · öffentlich erfasste Preise 2025',
  'pri.tbl.h1': 'Lösung',
  'pri.tbl.h2': 'Jahrespreis (Einstieg)',
  'pri.tbl.h3': 'Einrichtung / Integration',
  'pri.tbl.h4': 'Hosting',
  'pri.tbl.h5': 'Aktivierung',
  'pri.tbl.from': 'Ab',
  'pri.tbl.month': '/Monat',
  'pri.tbl.year': '/Jahr',
  'pri.tbl.fromApprox': 'ab',
  'pri.tbl.onQuote': 'auf Anfrage',
  'pri.tbl.france': 'Frankreich',
  'pri.tbl.w812': '8-12 Wo.',
  'pri.tbl.w12': '12 Wo. und mehr',
  'pri.tbl.w68': '6-8 Wo.',
  'pri.tbl.note':
    'Preise des Wettbewerbs: öffentlich erfasste Größenordnungen (Ausschreibungen von Kosmetikmarken 2024-2025).',

  'pri.del.eyebrow': 'Start · ab der Sekunde der Zahlung',
  'pri.del.h2a': 'Was Sie erhalten,',
  'pri.del.h2b': 'ab der Stripe-Bestätigung.',
  'pri.del1.t': 'Willkommens-E-Mail',
  'pri.del1.b': 'Mit Ihrem persönlichen Administrationslink und Ihren Zugangsdaten.',
  'pri.del2.t': 'Integrationscode zum Einfügen',
  'pri.del3.t': 'Vorbefüllter Produktkatalog',
  'pri.del3.b':
    '30 bis 60 Ihrer Produkte von Ihrer Website übernommen, bereits den Biomarkern zugeordnet.',
  'pri.del4.t': 'Gestaltung in Ihrer Marke',
  'pri.del4.b':
    'Logo, Farbpalette und Markenname auf Modul und Dashboard angewendet.',
  'pri.del5.t': 'Analyse-Dashboard',
  'pri.del5.b':
    'Scans pro Tag, Konversionsrate, durchschnittliche Biomarker, meistempfohlene Produkte.',
  'pri.del6.t': 'Vollständiger DSGVO-Export',
  'pri.del6.b':
    'Sie behalten Ihre gesamten Scan-Daten, jederzeit als CSV exportierbar.',

  'pri.faq.eyebrow': 'Häufige Fragen',
  'pri.faq.h2a': 'Alles, was Sie wissen',
  'pri.faq.h2b': 'möchten.',
  'pri.faq1.q': 'Was passiert, wenn ich mein Scan-Kontingent überschreite?',
  'pri.faq1.a':
    'Der Dienst läuft weiter. Jeder zusätzliche Scan wird je nach Plan mit 0,01 € bis 0,02 € auf der Rechnung des Folgemonats abgerechnet.',
  'pri.faq2.q': 'Wo werden die Daten der Nutzerinnen gespeichert?',
  'pri.faq2.a':
    'Ausschließlich in Frankreich. Kein Foto gespeichert, keine Übermittlung außerhalb der Europäischen Union, DPA unterzeichnet.',
  'pri.faq3.q': 'Kann ich den Plan unterwegs wechseln?',
  'pri.faq3.a':
    'Ja, jederzeit aus Ihrem Dashboard. Wechsel in den höheren Plan sofort und anteilig, Wechsel in den niedrigeren Plan zum Folgemonat.',
  'pri.faq4.q': 'Welches Niveau an technischem Support?',
  'pri.faq4.a':
    'E-Mail-Support binnen 48 h in allen Plänen. Priority-Support mit festem Ansprechpartner ab Growth.',
  'pri.faq5.q': 'Sind die empfohlenen Produkte konfigurierbar?',
  'pri.faq5.a':
    'Ja. Ihr Katalog ist vollständig bearbeitbar: Sie fügen Produkte hinzu, entfernen und ändern sie im Dashboard.',

  'pri.cal.eyebrow': 'Noch nicht bereit?',
  'pri.cal.h2': 'Buchen Sie eine Demonstration von 20 Minuten',
  'pri.cal.p':
    'Charles, der Gründer, zeigt Ihnen das Modul in einer Videokonferenz und beantwortet alle Ihre technischen und vertraglichen Fragen.',
  'pri.cal.cta': '20 Min. buchen →',

  /* ─────────── Rechtsseiten ─────────── */
  'legal.notice.t': 'Maßgeblich ist die französische Fassung',
  'legal.notice.b':
    'Der nachstehende Text bleibt bewusst auf Französisch: Nur die französische Fassung dieses Dokuments ist vertraglich verbindlich. Die Überschriften sind zum leichteren Lesen übersetzt. Eine unverbindliche Übersetzung kann unter charles@symphonydrive.com angefragt werden.',
  'legal.updated': 'Letzte Aktualisierung:',
  'legal.version': 'Version 1.0 —',

  'cgv.meta.title': 'AGB · VYVRE',
  'cgv.meta.desc':
    'Allgemeine Geschäftsbedingungen VYVRE Business — B2B-SaaS-Abonnements für Kosmetikmarken.',
  'cgv.eyebrow': 'Allgemeine Geschäftsbedingungen',
  'cgv.h1': 'AGB.',
  'cgv.a1': 'Artikel 1 — Gegenstand',
  'cgv.a2': 'Artikel 2 — Abschluss und Aktivierung',
  'cgv.a3': 'Artikel 3 — Preise',
  'cgv.a4': 'Artikel 4 — Zahlungsmodalitäten',
  'cgv.a5': 'Artikel 5 — Laufzeit und Kündigung',
  'cgv.a6': 'Artikel 6 — Servicezusage (SLA)',
  'cgv.a7': 'Artikel 7 — Eigentum an den Daten',
  'cgv.a8': 'Artikel 8 — Haftungsbeschränkung',
  'cgv.a9': 'Artikel 9 — Vertraulichkeit und DSGVO',
  'cgv.a10': 'Artikel 10 — Anwendbares Recht und Gerichtsstand',

  'conf.meta.title': 'Datenschutzerklärung · VYVRE',
  'conf.meta.desc':
    'Datenschutzerklärung und Schutz personenbezogener Daten von VYVRE. DSGVO-konform.',
  'conf.eyebrow': 'Datenschutz · DSGVO',
  'conf.h1': 'Datenschutz.',
  'conf.b1': 'Verantwortlicher',
  'conf.b2': 'Beim Hautscan erhobene Daten',
  'conf.b3': 'Hosting der Daten',
  'conf.b4': 'Von der Website erhobene Daten',
  'conf.b5': 'Bei einem Kauf erhobene Daten',
  'conf.b6': 'Rechtsgrundlage der Verarbeitung',
  'conf.b7': 'Speicherdauer',
  'conf.b8': 'Ihre Rechte nach der DSGVO',
  'conf.b9': 'DPA (Auftragsverarbeitungsvertrag)',

  'ml.meta.title': 'Impressum · VYVRE',
  'ml.meta.desc': 'Impressum von VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Rechtliche Angaben',
  'ml.h1': 'Impressum.',
  'ml.b1': 'Herausgeber der Website',
  'ml.b2': 'Verantwortlich für die Veröffentlichung',
  'ml.b3': 'Hosting',
  'ml.b4': 'Geistiges Eigentum',
  'ml.b5': 'Haftungsbeschränkung',
  'ml.b6': 'Hyperlinks',
  'ml.b7': 'Anwendbares Recht',

  'dpa.meta.title': 'DPA · Auftragsverarbeitungsvertrag · VYVRE',
  'dpa.meta.desc':
    'Auftragsverarbeitungsvertrag (Artikel 28 DSGVO) zwischen VYVRE und den B2B-Kunden.',
  'dpa.eyebrow': 'Artikel 28 DSGVO · Auftragsverarbeiter',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Parteien',
  'dpa.b2': '2. Gegenstand der Verarbeitung',
  'dpa.b3': '3. Kategorien verarbeiteter Daten',
  'dpa.b4': '4. Kategorien betroffener Personen',
  'dpa.b5': '5. Dauer der Verarbeitung',
  'dpa.b6': '6. Pflichten des Auftragsverarbeiters',
  'dpa.b7': '7. Sicherheitsmaßnahmen (Artikel 32 DSGVO)',
  'dpa.b8': '8. Weitere Auftragsverarbeiter',
  'dpa.b9': '9. Übermittlungen außerhalb der Europäischen Union',
  'dpa.b10': '10. Audit und Kontrolle',
  'dpa.b11': '11. Meldung von Datenschutzverletzungen',
  'dpa.b12': '12. Rückgabe und Löschung der Daten',
} as const;

export default de;
