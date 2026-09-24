/**
 * VYVRE — dictionnaire espagnol des pages Next (marques, accuracy, pricing, légal).
 *
 * Le français est la source : toute clé ajoutée ici doit l'être dans les onze
 * autres fichiers de /lib/i18n/dict. Ce qui ne se traduit jamais reste dans le
 * JSX : noms de marques, « VYVRE », « skin intelligence », titres de papiers
 * scientifiques, noms de revues, extraits de code, chiffres et prix en euros.
 */

const es = {
  /* ─────────── commun : en-tête, pied de page, sélecteur ─────────── */
  'lang.aria': 'Elegir idioma',
  'nav.manifeste': 'Manifiesto',
  'nav.method': 'Método',
  'nav.demo': 'Probar el escaneo',
  'nav.pricing': 'Tarifas',

  'footer.city': 'VYVRE · París',
  'footer.cityFull': 'VYVRE · París, Francia',
  'footer.book': 'Reservar 20 min →',
  'footer.manifeste': 'Manifiesto',
  'footer.method': 'Metodología',
  'footer.cgv': 'Condiciones generales de venta',
  'footer.legal': 'Aviso legal',
  'footer.privacy': 'Privacidad',
  'footer.privacyGdpr': 'Privacidad · RGPD',
  'footer.dpa': 'DPA',
  'footer.contact': 'Contacto',
  'footer.home': 'Inicio',
  'footer.rights': 'Todos los derechos reservados',
  'footer.company': 'SAS con un capital de 1.000 € · París, Francia · SIREN en trámite',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Diagnóstico de piel medido, para las marcas de cuidado',
  'home.meta.desc':
    'El único diagnóstico de piel con precio público. Infraestructura en Francia, RGPD nativo, procesamiento en el dispositivo, ninguna foto subida.',

  'home.hero.eyebrow': 'Diagnóstico de piel medido',
  'home.hero.h1a': 'El diagnóstico de piel',
  'home.hero.h1b': 'de su firma.',
  'home.hero.p':
    'Menos de diez segundos de cámara. Ocho medidas leídas píxel a píxel. Una rutina compuesta únicamente con su catálogo.',
  'home.hero.cta1': 'Probar el escaneo',
  'home.hero.cta2': 'Equipar mi marca',

  'home.stat1': 'Medidas de piel',
  'home.stat2': 'Duración del escaneo',
  'home.stat3': 'Puesta en línea',
  'home.stat4': 'Foto conservada',

  'home.man.h2a': 'Medida,',
  'home.man.h2b': 'no adivinada.',
  'home.man.p':
    'El motor convierte cada zona del rostro en coordenadas CIE L*a*b* y luego en índices dermatológicos. Nada de estimaciones a partir de un filtro: una lectura óptica, reproducible, documentada.',
  'home.man.link': 'Leer la metodología →',

  'home.mes.h2a': 'Ocho medidas.',
  'home.mes.h2b': 'Una sola lectura.',
  'home.mes.1.n': 'Tez',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Luminosidad',
  'home.mes.2.u': 'Luminancia L*',
  'home.mes.3.n': 'Rojeces',
  'home.mes.3.u': 'Índice de eritema',
  'home.mes.4.n': 'Uniformidad',
  'home.mes.4.u': 'Desviación típica cromática',
  'home.mes.5.n': 'Textura',
  'home.mes.5.u': 'Microcontraste local',
  'home.mes.6.n': 'Poros',
  'home.mes.6.u': 'Densidad de mínimos',
  'home.mes.7.n': 'Sebo',
  'home.mes.7.u': 'Reflexión especular',
  'home.mes.8.n': 'Hidratación',
  'home.mes.8.u': 'Proxy TEWL óptico',

  'home.steps.h2a': 'Tres pasos.',
  'home.steps.h2b': 'Cero fricción.',
  'home.step1.t': 'La clienta escanea',
  'home.step1.d':
    'Cámara del teléfono o del puesto de asesoramiento. Nada que instalar, nada que subir: la imagen se procesa y después se borra.',
  'home.step2.t': 'El motor compone',
  'home.step2.d':
    'Una rutina de mañana y de noche extraída únicamente de su catálogo, jerarquizada según las medidas y sus prioridades comerciales.',
  'home.step3.t': 'Usted se pone en línea',
  'home.step3.d':
    'Una línea de script en su sitio, sus colores, su tipografía. Ningún desarrollador movilizado en su empresa.',

  'home.groupe.eyebrow': 'Para los grupos',
  'home.groupe.h2a': 'Una casa, diez marcas,',
  'home.groupe.h2b': 'un solo motor.',
  'home.socle1.t': 'Multimarca',
  'home.socle1.d':
    'Un espacio por marca: catálogo, identidad, reglas de recomendación y estadísticas separados.',
  'home.socle2.t': 'Soberanía',
  'home.socle2.d':
    'Alojamiento en Francia, RGPD nativo, DPA firmado, ninguna imagen conservada, ningún píxel de terceros.',
  'home.socle3.t': 'Tienda y e-shop',
  'home.socle3.d':
    'El mismo motor en el mostrador con tableta y en la ficha de producto, con el mismo referencial de medidas.',

  'home.price.h2a': 'Desde 299 €/mes.',
  'home.price.h2b': 'Precio a la vista.',
  'home.price.cta': 'Ver los planes',

  'home.faq.h2': 'Preguntas.',
  'home.faq1.q': '¿Cómo llega mi catálogo al motor?',
  'home.faq1.a':
    'Mediante un flujo CSV o la API de su e-commerce (Shopify, Salesforce Commerce, Centra). Sin acceso de administrador, sincronización cada noche.',
  'home.faq2.q': '¿Qué ocurre con la imagen de la clienta?',
  'home.faq2.a':
    'Se analiza en memoria y después se borra: ninguna foto se almacena ni se transmite. Alojamiento en Francia, DPA disponible.',
  'home.faq3.q': '¿Puede el motor recomendar a un competidor?',
  'home.faq3.a':
    'No. La rutina se compone exclusivamente con su catálogo, según las prioridades que usted fija.',
  'home.faq4.q': '¿Qué material hace falta?',
  'home.faq4.a':
    'Basta con una cámara de 720p, tanto en móvil como en ordenador. Los resultados ganan en finura con los sensores recientes.',

  'home.cta.h2': 'Ver el escaneo sobre su catálogo.',
  'home.cta.1': 'Lanzar la demostración',
  'home.cta.2': 'Solicitar una demostración',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Metodología y precisión · VYVRE',
  'acc.meta.desc':
    'Fuentes revisadas por pares (5 aplicadas, 4 en hoja de ruta), método de cálculo, intervalos de confianza, límites. La transparencia científica detrás del motor VYVRE v7.0.',

  'acc.hero.eyebrow': 'Metodología · Fuentes · Límites',
  'acc.hero.h1a': 'La ciencia',
  'acc.hero.h1b': 'detrás del escaneo.',
  'acc.hero.p':
    'Ocho medidas leídas desde la imagen. Aquí: las fuentes científicas, el método de cálculo, los intervalos de confianza y los límites del motor.',
  'acc.hero.note1':
    'Precisión estimada ±5 años de edad biológica · ±4 años de edad percibida (IC 95 % · cohorte interna n=12)',
  'acc.hero.note2':
    'Validación externa n=100 prevista para finales de 2026 · rediseño en mayo de 2026 tras auditoría interna',

  'acc.s1.eyebrow': '01 · Bibliografía · Fuentes aplicadas',
  'acc.s1.h2a': '5 fuentes revisadas por pares',
  'acc.s1.h2b': 'aplicadas activamente.',
  'acc.s1.p1': 'Estas 5 fuentes se utilizan directamente en las fórmulas de cálculo del motor (véase',
  'acc.s1.p2': ', función',
  'acc.s1.p3': 'y',
  'acc.s1.p4': '). Cada biomarcador es trazable hasta un artículo científico indexado en PubMed.',
  'acc.s1.foot1': 'Motor v7 — rediseño en mayo de 2026',
  'acc.s1.foot2': 'Fuentes aplicadas verificables línea por línea en',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — base de la detección automática del fototipo Fitzpatrick I-VI',
  'acc.src2.c':
    'Melanin Index (MI) y Erythema Index (EI) — cuantificación de la pigmentación y del enrojecimiento',
  'acc.src3.c':
    'Proxy TEWL (pérdida insensible de agua) mediante σL* → índices de hidratación y poros. Regresión tabla 3.',
  'acc.src4.c':
    'Reflejos especulares → luminosidad / sebo. Detección de los reflejos especulares en el rostro',
  'acc.src5.c':
    'Diferencia entre edad percibida y edad biológica (cohorte caucásica ~1.700 sujetos). v7: diferencia dependiente de la edad (−2 a −6 años según la edad biológica), no ligada al fototipo.',

  'acc.s2.eyebrow': '02 · Bibliografía · Hoja de ruta finales de 2026',
  'acc.s2.h2a': '4 fuentes referenciadas',
  'acc.s2.h2b': 'aún no plenamente aplicadas.',
  'acc.s2.p':
    'Estas fuentes se citan por transparencia y para la hoja de ruta pública. Sus coeficientes completos aún no están integrados en las fórmulas: extracción y validación previstas para finales de 2026 con un dermatólogo asociado.',
  'acc.rm.appliedLabel': 'Aplicado parcialmente: ',
  'acc.rm.roadmapLabel': 'Hoja de ruta: ',
  'acc.rm1.a':
    'Edad de anclaje 40 (mediana de la cohorte adulta) + correlación r=0,78 arrugas periorbitarias ↔ edad',
  'acc.rm1.r':
    'Extracción de imágenes → grado morfológico 0-5 (escala Bazin) aún no implementada. Prevista para finales de 2026.',
  'acc.rm2.a': 'Ajuste moderado de −4 % a −8 % sobre la edad biológica para los fototipos IV-VI',
  'acc.rm2.r':
    'Coeficientes completos por fototipo para arrugas / firmeza / pigmentación aún no extraídos.',
  'acc.rm3.a': 'Citado para el contexto multiétnico',
  'acc.rm3.r':
    'Coeficientes específicos aún no extraídos. Validación en cohorte multiétnica prevista para finales de 2026.',
  'acc.rm4.a': 'Normas clínicas TEWL referenciadas (sana ≤ 15 g/m²/h, alterada ≥ 25)',
  'acc.rm4.r':
    'El cálculo numérico σL* → TEWL sigue a Stamatas 2011 (y no a Akdeniz). Validación cruzada prevista.',

  'acc.bench.eyebrow': 'Benchmark público · UTKFace · 26 de mayo de 2026',
  'acc.bench.h2a': 'Comparado públicamente',
  'acc.bench.h2b': 'con 3 referencias de código abierto.',
  'acc.bench.p':
    'VYVRE v7.0 probado con 300 rostros públicos de UTKFace (estratificados 18-80 años) junto a DeepFace, InsightFace y OpenCV DNN. Veredicto publicado sin retoques, código reproducible, 5 scripts, 4 min de ejecución.',
  'acc.bench.k1.l': '30-44 (objetivo)',
  'acc.bench.k1.n': 'MAE — por delante de OpenCV (8,66 años)',
  'acc.bench.k2.l': 'Conjunto (18-80)',
  'acc.bench.k2.n': 'MAE — por detrás de las redes profundas',
  'acc.bench.k3.l': 'Sesgo con signo',
  'acc.bench.k3.n': 'El más neutro de los 4 motores',
  'acc.bench.cta': 'Ver el benchmark completo →',

  'acc.s3.eyebrow': '03 · Estándares colorimétricos (fundamentos)',
  'acc.s3.p':
    'Estándares normativos subyacentes: no son artículos revisados por pares, sino especificaciones técnicas activas en la cadena de procesamiento.',
  'acc.s3.std1': 'Espacio colorimétrico sRGB (decodificación gamma)',
  'acc.s3.std2': 'Primarios RGB Rec. 709',
  'acc.s3.std3': 'Conversión XYZ → L*a*b*',
  'acc.s3.std4': 'Límites Fitzpatrick por ITA°',
  'acc.s3.std5': 'Detección de píxeles de piel YCbCr',
  'acc.s3.std6': 'Medida de nitidez laplaciana',
  'acc.s3.std7':
    'Correlación firmeza ↔ edad percibida (r=0,65 entre distancia ITA° y firmeza percibida)',

  'acc.s4.eyebrow': '04 · Cadena de procesamiento',
  'acc.s4.h2': 'Método de cálculo.',
  'acc.st1.t': 'Captura de la imagen',
  'acc.st1.d':
    'Webcam estándar (≥ 720p). Menos de 10 segundos de captura, 8 imágenes retenidas. Detección del rostro con face-api.js (68 puntos de referencia). Recorte de la zona facial y corrección de luz.',
  'acc.st2.t': 'Conversión colorimétrica',
  'acc.st2.d':
    'Cadena sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Autotest sobre 6 colores de referencia en cada escaneo. Precisión al píxel.',
  'acc.st3.t': 'Extracción de las señales',
  'acc.st3.d':
    'ITA° + Melanin Index + Erythema Index + proxy TEWL + ratio especular. 4 zonas del rostro analizadas (frente, mejillas izquierda y derecha, zona T).',
  'acc.st4.t': 'Conversión en biomarcadores',
  'acc.st4.d':
    'Cada señal bruta se convierte en una puntuación de 0-100 mediante fórmulas revisadas por pares (citas más arriba). Constantes nombradas con su fuente, o señaladas como empíricas.',
  'acc.st5.t': 'Detección del fototipo',
  'acc.st5.d':
    'Clasificación automática Fitzpatrick I-VI por ITA° (Chardon 1991). Límites de pigmentación adaptados al fototipo para evitar el sesgo en pieles oscuras.',
  'acc.st6.t': 'Estimación de la edad + intervalo',
  'acc.st6.d':
    'Fórmula de biomarcador único (arrugas periorbitarias dominantes, Bazin 2007). Diferencia de edad percibida dependiente de la edad (Vierkötter 2012). Intervalo ±5 años (95 %, cohorte interna n=12).',

  'acc.s5.eyebrow': '05 · Edad de la piel · Método v7',
  'acc.s5.h2a': 'Edad de piel percibida',
  'acc.s5.h2b': 'o edad biológica bruta.',
  'acc.s5.p': 'Se calculan dos números, solo se muestra uno. He aquí por qué.',
  'acc.age.l.tag': 'Mostrada — Edad de la piel',
  'acc.age.l.h3': 'Edad percibida visualmente',
  'acc.age.l.p':
    'Edad media percibida socialmente por un observador humano. Calibrada según Vierkötter y Krutmann 2012 (cohorte caucásica ~1.700 sujetos) con una diferencia',
  'acc.age.l.pEm': 'dependiente de la edad',
  'acc.age.l.li1': '< 30 años bio → −2 años',
  'acc.age.l.li2': '30-45 años bio → −4 años',
  'acc.age.l.li3': '45-60 años bio → −5 años',
  'acc.age.l.li4': '60 años o más bio → −5 a −6 años',
  'acc.age.l.note':
    'La v7 retira la correspondencia por fototipo de la v6, ausente de la fuente original. El fototipo influye en la edad biológica (Diridollou), no en la percepción social.',
  'acc.age.r.tag': 'Interna — Edad biológica',
  'acc.age.r.h3': 'Edad biológica bruta',
  'acc.age.r.p':
    'Estimación directa del estado físico de la piel mediante la puntuación de arrugas dominante (arrugas periorbitarias, Bazin 2007). Correlación r=0,78 con la edad cronológica en fotos de estudio.',
  'acc.age.r.note1': 'Fórmula v7:',
  'acc.age.r.note2':
    'El factor 0,85 (penalización webcam JPEG) es una compensación empírica asumida; validación en una cohorte amplia prevista para finales de 2026.',
  'acc.age.prec1': 'Precisión estimada:',
  'acc.age.prec.bio': '±5 años de edad biológica',
  'acc.age.prec.perc': '±4 años de edad percibida',
  'acc.age.prec2': '(IC 95 % sobre cohorte interna n=12)',
  'acc.age.prec3': 'Validación externa n=100 prevista para finales de 2026',

  'acc.s6.eyebrow': '06 · Comportamiento según la calidad · v7',
  'acc.s6.h2a': '3 niveles de confianza.',
  'acc.s6.h2b': 'Ningún arreglo halagador.',
  'acc.s6.p':
    'La v7 retira el correctivo v6.2 que rejuvenecía artificialmente los escaneos degradados (la paradoja «cuanto menos ve el motor, más halaga»). En su lugar, 3 niveles de confianza explícitos.',
  'acc.q1.tag': 'Calidad < 40',
  'acc.q1.h3': 'Escaneo rechazado',
  'acc.q1.p1': 'Ninguna estimación publicada. Mensaje',
  'acc.q1.p2':
    'con la recomendación de repetir el escaneo con mejor luz. La estimación no se calcula.',
  'acc.q2.tag': '40 ≤ Calidad < 60',
  'acc.q2.h3': 'Confianza baja',
  'acc.q2.p1': 'Estimación publicada en el mejor de los casos, pero señalada',
  'acc.q2.p2':
    '. Intervalo ampliado a ±7 años (frente a ±5 estándar). La estimación sigue siendo honesta, no desplazada.',
  'acc.q3.tag': 'Calidad ≥ 60',
  'acc.q3.h3': 'Estándar',
  'acc.q3.p1': 'Estimación estándar con',
  'acc.q3.p2':
    '. Intervalo ±5 años (95 % sobre cohorte interna n=12). Comportamiento nominal para una webcam HD bien iluminada.',
  'acc.s6.foot1': 'Correctivo v6.2 retirado: −5 años en un escaneo degradado (calidad < 45)',
  'acc.s6.foot2':
    'La v7 amplía el intervalo en lugar de desplazar la estimación (la honestidad antes que la adulación)',

  'acc.s7.eyebrow': '07 · Pruebas de varianza',
  'acc.s7.h2': 'Reproducibilidad.',
  'acc.s7.p':
    'Prueba: el mismo sujeto escaneado 10 veces en 10 condiciones de luz diferentes. Medida de la desviación típica de las puntuaciones. Cohorte interna n=12.',
  'acc.var1': 'Arrugas',
  'acc.var2': 'Firmeza',
  'acc.var3': 'Pigmentación',
  'acc.var4': 'Hidratación',
  'acc.var5': 'Luminosidad',
  'acc.var6': 'Poros',
  'acc.var7': 'Enrojecimiento',
  'acc.var8': 'Edad percibida',
  'acc.var.unitPts': 'pts/100',
  'acc.var.unitYears': 'años',
  'acc.s7.foot1':
    'Cohorte interna · n=12 sujetos fototipos I-IV · 10 escaneos/sujeto · luz variable · webcam HD 720p',
  'acc.s7.foot2':
    'Fototipos V-VI: extrapolación Diridollou 2007 — validación en cohorte dedicada prevista para finales de 2026',
  'acc.s7.foot3': 'Validación externa n=100 prevista para finales de 2026',

  'acc.s8.eyebrow': '08 · Hoja de ruta de validación',
  'acc.s8.h2a': 'Lo que nos comprometemos',
  'acc.s8.h2b': 'a validar.',
  'acc.q.late2026': 'finales de 2026',
  'acc.q.q42026': 'T4 2026',
  'acc.rd1.t': 'Validación en cohorte externa n=100',
  'acc.rd1.b':
    'Reclutamiento de 100 sujetos variados (20-75 años, fototipos I-VI). Medida de la concordancia con los equipos Visia / Antera de referencia. Publicación metodológica.',
  'acc.rd2.t': 'Grado morfológico Bazin 0-5',
  'acc.rd2.b':
    'Extracción desde las imágenes del grado morfológico Bazin (atlas vol. 1, cap. 4) — hoy solo se utilizan la edad de anclaje 40 y la correlación r=0,78. Implementación de la detección de profundidad de las arrugas y de la clasificación 0-5.',
  'acc.rd3.t': 'Coeficientes por fototipo (Diridollou + Flament)',
  'acc.rd3.b':
    'Extracción de los coeficientes de Diridollou 2007 y Flament 2023 para arrugas / firmeza / pigmentación por fototipo. Hoy la v7 aplica un ajuste moderado de −4 % a −8 % sobre la edad biológica de los fototipos IV-VI; objetivo: correspondencia completa por fototipo con los coeficientes de origen.',
  'acc.rd4.t': 'Publicación revisada por pares',
  'acc.rd4.b':
    'Presentación de un artículo metodológico que describe la cadena VYVRE (webcam de consumo → biomarcadores CIE L*a*b* → estimación de edad) con validación en cohorte n=100. Objetivo: Int J Cosmet Sci o Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Límites',
  'acc.s9.h2a': 'Lo que VYVRE',
  'acc.s9.h2b': 'no hace.',
  'acc.s9.p':
    'Preferimos ser radicalmente honestos sobre lo que el motor no mide, antes que vender ilusiones.',
  'acc.lim1.t': 'VYVRE no es un dispositivo médico',
  'acc.lim1.b':
    'El motor no emite ningún diagnóstico médico. No detecta patologías dermatológicas (cáncer cutáneo, melanoma, dermatitis, psoriasis, etc.). Ante cualquier preocupación médica, consulte a un dermatólogo.',
  'acc.lim2.t': 'Una webcam estándar no es un escáner profesional',
  'acc.lim2.b':
    'Un escáner dermatológico profesional utiliza luz polarizada, fluorescencia UV y sensor 3D. VYVRE se apoya en una webcam estándar y una luz no controlada. Varianza ±8 % (frente a ±2 % en consulta).',
  'acc.lim3.t': 'Sin detección 3D de las arrugas',
  'acc.lim3.b':
    'La profundidad real de las arrugas requiere un sensor estereoscópico. VYVRE estima la severidad mediante el análisis colorimétrico de las sombras (enfoque 2D). Fiable en arrugas marcadas, menos preciso en líneas finas incipientes.',
  'acc.lim4.t': 'Hiperpigmentación profunda no detectada',
  'acc.lim4.b':
    'Las manchas pigmentarias subepidérmicas (melasma profundo, manchas actínicas antiguas) no son visibles con luz visible. Haría falta una cámara de fluorescencia UV (no incluida).',
  'acc.lim5.t': 'Fototipos V-VI: extrapolación asumida',
  'acc.lim5.b':
    'La cohorte interna n=12 contiene sobre todo fototipos I-IV. Los ajustes para V-VI se extrapolan de los datos de Diridollou 2007 (−4 % a −8 % sobre la edad biológica). Validación en cohorte dedicada prevista para finales de 2026.',
  'acc.lim6.t': 'Maquillaje, gafas, mascarilla',
  'acc.lim6.b':
    'El motor detecta estas obstrucciones y baja la puntuación de calidad. Si la calidad es demasiado baja (< 40), el escaneo se rechaza. Entre 40 y 60, el resultado se publica con una indicación explícita de confianza baja y un intervalo ampliado.',
  'acc.lim7.t': 'La cohorte interna n=12 es pequeña — lo asumimos',
  'acc.lim7.b':
    'Los coeficientes empíricos (penalización webcam JPEG, anchura del intervalo) están calibrados sobre 12 sujetos. Es un grupo de prueba, no una cohorte clínica. La validación externa n=100 está inscrita en la hoja de ruta de finales de 2026.',

  'acc.s10.eyebrow': '10 · Módulo complementario · Afecciones cutáneas (v1 indicativo)',
  'acc.s10.h2a': 'Detección visual de 4 afecciones',
  'acc.s10.h2b': 'indicativa, nunca médica.',
  'acc.s10.p1': 'Módulo separado',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — carga opcional en cualquier demostración. Detecta mediante heurísticas de imagen 4 afecciones visuales frecuentes y propone una rutina cosmética específica, fuera de toda prescripción.',
  'acc.s10.p3': 'Este módulo no emite ningún diagnóstico médico.',
  'acc.cond.sens': 'Sensibilidad',
  'acc.cond.spec': 'Especificidad',
  'acc.cond.cohort': 'cohorte de síntesis n=12',
  'acc.cond1.a': 'Módulo · Acné',
  'acc.cond1.t': 'Eritema a* CIELAB localizado + varianza de textura L*',
  'acc.cond1.c':
    'Detección de píxeles eritematosos concentrados en puntos distintos de la zona T (frente, nariz, mentón). Salida: probabilidad + severidad (mínima, baja, media, alta).',
  'acc.cond2.a': 'Módulo · Rosácea',
  'acc.cond2.t': 'Exceso mediano de a* en mejillas + nariz respecto a la base + simetría bilateral',
  'acc.cond2.c':
    'Eritema persistente y bilateral en las mejillas y la nariz. La simetría entre las mejillas pondera la puntuación (la rosácea es bilateral).',
  'acc.cond3.a': 'Módulo · Melasma',
  'acc.cond3.t': 'ΔL* frente y labio superior vs cuartil alto L* de las mejillas + Δb* (melanina)',
  'acc.cond3.c':
    'Hiperpigmentación simétrica del centro del rostro (frente, labio superior, pómulos). Distingue un melasma difuso de manchas distintas.',
  'acc.cond4.a': 'Módulo · Léntigos',
  'acc.cond4.t': 'Detección de manchas (tamaño 5-200 px², compacidad ≥ 0,45)',
  'acc.cond4.c':
    'Manchas pigmentarias aisladas, de contornos nítidos, en las mejillas y la frente. Número de manchas cualificadas en relación con la superficie de piel (densidad por 1.000 píxeles).',
  'acc.s10.why.t': '¿Por qué heurísticas en lugar de una red neuronal?',
  'acc.s10.why1':
    'Los conjuntos de datos ISIC / DermNet contienen imágenes clínicas en primer plano, con luz polarizada, centradas en la lesión. Una distribución muy alejada de una webcam de consumo a 50 cm bajo luz no controlada: un modelo entrenado con ellas transferiría mal sin reentrenamiento en una cohorte VYVRE dedicada.',
  'acc.s10.why2':
    'Las heurísticas siguen siendo auditables línea por línea, cosa que un modelo opaco no es. Compatible con las exigencias de explicabilidad de las grandes casas.',
  'acc.s10.why3':
    'Ningún modelo que descargar (0 MB), ningún procesador gráfico necesario, funciona en todos los navegadores en menos de 200 ms.',
  'acc.s10.why4a': 'Arquitectura estable: una v2 podrá sustituirlo por un modelo aprendido tras la misma interfaz',
  'acc.s10.why4b': 'sin romper las integraciones existentes.',
  'acc.s10.disc.t': 'Advertencia médica (obligatoria en toda presentación)',
  'acc.s10.disc.b':
    'Este módulo no es un dispositivo médico. No emite ningún diagnóstico. Las probabilidades devueltas son indicadores de zonas de atención, destinados a recomendar una rutina cosmética específica. Ante cualquier preocupación cutánea real, consulte a un dermatólogo.',
  'acc.s10.cta1': 'Ver la demostración Afecciones →',
  'acc.s10.cta2': 'Código fuente del módulo',

  'acc.s11.eyebrow': '11 · Salvaguarda de calidad · Compromiso de honestidad',
  'acc.s11.h2a': 'Preferir la honestidad',
  'acc.s11.h2b': 'a la falsa precisión.',
  'acc.s11.p1':
    'La v7.0 retira los correctivos v6.2 que halagaban artificialmente al usuario: rejuvenecimiento oculto de 5 años con webcam degradada, topes [20, 50] que devolvían a un sujeto de 80 años a 50, correspondencia por fototipo inventada fuera de toda fuente.',
  'acc.s11.p2':
    'Si la piel real del usuario tiene 38 años para un dermatólogo, el motor debe decir 38. No 28 (mentira halagadora). No 44 (falsa brutalidad). Una estimación real.',

  'acc.cta.h2a': '¿Preguntas técnicas?',
  'acc.cta.h2b': 'Solicite el DPA completo.',
  'acc.cta.p':
    'Enviamos bajo petición a los DPO, dermatólogos consultores y equipos de I+D: DPA, metodología detallada, informe de precisión, código fuente del motor auditado.',
  'acc.cta.1': 'Solicitar la documentación →',
  'acc.cta.2': '← Volver',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Tarifas · VYVRE',
  'pri.meta.desc':
    'Diagnóstico de piel medido, alojado en Francia. Pilot gratuito, Starter 299 €/mes, Growth 499 €/mes, Enterprise desde 699 €/mes.',

  'pri.banner1': 'Acaba de probar la demostración {brand}',
  'pri.banner2': '— Elija su plan para activarla en su sitio.',

  'pri.hero.eyebrow': 'Tarifas · VYVRE Business',
  'pri.hero.h1a': 'El precio está',
  'pri.hero.h1b': 'en la página.',
  'pri.hero.p': 'Alojamiento en Francia · RGPD nativo · Ninguna foto conservada',

  'pri.toggle.monthly': 'Mensual',
  'pri.toggle.annual': 'Anual',
  'pri.theme.label': 'Tema de su widget',
  'pri.theme.dark': 'Negro',
  'pri.theme.light': 'Blanco',
  'pri.theme.note': 'Su diagnóstico se mostrará con este tema · modificable después',

  'pri.card.plan': 'Plan',
  'pri.card.recommended': 'Recomendado',
  'pri.per.month': '/mes',

  'pri.pilot.price': 'Gratuito',
  'pri.pilot.sub': '30 días · sin compromiso',
  'pri.pilot.f1': '1.000 escaneos / mes',
  'pri.pilot.f2': 'SDK Web',
  'pri.pilot.f3': 'Marca VYVRE',
  'pri.pilot.f4': 'Soporte por correo en 48 h',
  'pri.pilot.f5': 'Infraestructura en Francia',
  'pri.pilot.cta': 'Empezar gratis',

  'pri.starter.subA': '2.990 € / año · 2 meses gratis',
  'pri.starter.subM': '5.000 escaneos / mes',
  'pri.starter.f1': '5.000 escaneos / mes',
  'pri.starter.f2': '0,02 € por escaneo adicional',
  'pri.starter.f3': 'SDK Web + iOS + Android',
  'pri.starter.f4': 'Marca blanca completa',
  'pri.starter.f5': 'SLA 99,9 % · soporte prioritario',
  'pri.starter.cta': 'Empezar la prueba gratuita',

  'pri.growth.subA': '4.990 € / año · 2 meses gratis',
  'pri.growth.subM': '15.000 escaneos / mes',
  'pri.growth.f1': '15.000 escaneos / mes',
  'pri.growth.f2': '0,015 € por escaneo adicional',
  'pri.growth.f3': 'Todo Starter, y además:',
  'pri.growth.f4': 'Multimarca (hasta 5)',
  'pri.growth.f5': 'Responsable de cuenta dedicado',
  'pri.growth.cta': 'Elegir Growth',

  'pri.ent.subA': 'desde · contrato a medida',
  'pri.ent.subM': 'desde · sin compromiso',
  'pri.ent.f1': '25.000 escaneos / mes',
  'pri.ent.f2': '0,01 € por escaneo adicional',
  'pri.ent.f3': 'Red de tiendas ilimitada',
  'pri.ent.f4': 'Aplicación móvil nativa',
  'pri.ent.f5': 'SLA 99,99 % · guardia 24/7',
  'pri.ent.cta': 'Contactar',

  'pri.trust': 'Tarifas públicas · IVA no incluido · Cancelación en cualquier momento',

  'pri.args.eyebrow': 'Por qué elegirnos',
  'pri.args.h2a': '¿Por qué VYVRE',
  'pri.args.h2b': 'y no los demás?',
  'pri.arg1.e': 'Made in France',
  'pri.arg1.t': 'El único módulo de diagnóstico de piel íntegramente francés',
  'pri.arg1.b': 'Infraestructura alojada en Francia, equipo en París, DPA firmado.',
  'pri.arg1.n': 'Las soluciones comparables están alojadas fuera de la Unión Europea.',
  'pri.arg2.e': '−90 % en la factura',
  'pri.arg2.t1': 'Hasta 10× más barato',
  'pri.arg2.t2': 'que la competencia',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'desde 299 € / mes',
  'pri.arg2.b3':
    '(3.588 € / año). SkinConsult AI empieza en ~50.000 € / año + 30.000 € de puesta en marcha, Perfect Corp en ~30.000 € / año.',
  'pri.arg2.n': 'Tabla comparativa detallada más abajo en esta página.',
  'pri.arg3.e': 'Activación en 48 h',
  'pri.arg3.t': 'Código de integración enviado tras el pago',
  'pri.arg3.b1': 'Usted pega',
  'pri.arg3.b2': 'en su sitio y ya está en línea.',
  'pri.arg3.n': 'Sin reunión de arranque, sin integrador externo facturado.',
  'pri.arg4.e': 'Sin compromiso',
  'pri.arg4.t': 'Cancelación en un clic',
  'pri.arg4.b':
    'Cambio a un plan inferior o superior, o cancelación, desde su panel de control. Ningún bloqueo contractual, ninguna penalización.',
  'pri.arg4.n': 'Conserva la exportación de todos sus datos de escaneo.',
  'pri.arg5.e': 'Marca blanca total',
  'pri.arg5.t': 'Su marca, no la nuestra',
  'pri.arg5.b':
    'Logotipo, colores, tipografía, productos recomendados: todo se ajusta a su identidad.',
  'pri.arg5.n': 'Ninguna mención «Powered by VYVRE» impuesta desde el plan Starter.',
  'pri.arg6.e': 'Ciencia revisada por pares',
  'pri.arg6.t': 'Una medida, no una simulación',
  'pri.arg6.b':
    'Colorimetría CIE L*a*b*, 68 puntos de referencia faciales, índices derivados de la literatura dermatológica.',
  'pri.arg6.n': 'Bibliografía: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Comparativa de mercado · precios públicos constatados 2025',
  'pri.tbl.h1': 'Solución',
  'pri.tbl.h2': 'Tarifa anual (entrada)',
  'pri.tbl.h3': 'Puesta en marcha / integración',
  'pri.tbl.h4': 'Alojamiento',
  'pri.tbl.h5': 'Activación',
  'pri.tbl.from': 'Desde',
  'pri.tbl.month': '/mes',
  'pri.tbl.year': '/año',
  'pri.tbl.fromApprox': 'desde',
  'pri.tbl.onQuote': 'a presupuesto',
  'pri.tbl.france': 'Francia',
  'pri.tbl.w812': '8-12 sem.',
  'pri.tbl.w12': '12 sem. y más',
  'pri.tbl.w68': '6-8 sem.',
  'pri.tbl.note':
    'Tarifas de la competencia: órdenes de magnitud públicos constatados (licitaciones de marcas cosméticas 2024-2025).',

  'pri.del.eyebrow': 'Puesta en marcha · desde el segundo del pago',
  'pri.del.h2a': 'Lo que usted obtiene,',
  'pri.del.h2b': 'desde la confirmación de Stripe.',
  'pri.del1.t': 'Correo de bienvenida',
  'pri.del1.b': 'Con su enlace de administración personal y sus credenciales.',
  'pri.del2.t': 'Código de integración listo para pegar',
  'pri.del3.t': 'Catálogo de productos precargado',
  'pri.del3.b':
    '30 a 60 de sus productos tomados de su sitio, ya asociados a los biomarcadores.',
  'pri.del4.t': 'Personalización con su marca',
  'pri.del4.b':
    'Logotipo, paleta de colores y nombre de marca aplicados al módulo y al panel de control.',
  'pri.del5.t': 'Panel de analítica',
  'pri.del5.b':
    'Escaneos por día, tasa de conversión, biomarcadores medios, productos más recomendados.',
  'pri.del6.t': 'Exportación RGPD completa',
  'pri.del6.b':
    'Conserva la totalidad de sus datos de escaneo, exportables en CSV en cualquier momento.',

  'pri.faq.eyebrow': 'Preguntas frecuentes',
  'pri.faq.h2a': 'Todo lo que quiere',
  'pri.faq.h2b': 'saber.',
  'pri.faq1.q': '¿Qué ocurre si supero mi cuota de escaneos?',
  'pri.faq1.a':
    'El servicio continúa. Cada escaneo adicional se factura entre 0,01 € y 0,02 € según su plan, en la factura del mes siguiente.',
  'pri.faq2.q': '¿Dónde se almacenan los datos de las usuarias?',
  'pri.faq2.a':
    'Exclusivamente en Francia. Ninguna foto conservada, ninguna transferencia fuera de la Unión Europea, DPA firmado.',
  'pri.faq3.q': '¿Puedo cambiar de plan sobre la marcha?',
  'pri.faq3.a':
    'Sí, en cualquier momento desde su panel de control. El paso a un plan superior se prorratea de inmediato, el paso a un plan inferior se aplica el mes siguiente.',
  'pri.faq4.q': '¿Qué nivel de soporte técnico?',
  'pri.faq4.a':
    'Soporte por correo en 48 h en todos los planes. Soporte prioritario con responsable de cuenta dedicado a partir de Growth.',
  'pri.faq5.q': '¿Se pueden configurar los productos recomendados?',
  'pri.faq5.a':
    'Sí. Su catálogo es totalmente modificable: usted añade, retira y modifica los productos desde el panel de control.',

  'pri.cal.eyebrow': '¿Aún no está listo?',
  'pri.cal.h2': 'Reserve una demostración de 20 minutos',
  'pri.cal.p':
    'Charles, fundador, le muestra el módulo en videoconferencia y responde a todas sus preguntas técnicas y contractuales.',
  'pri.cal.cta': 'Reservar 20 min →',

  /* ─────────── pages légales ─────────── */
  'legal.notice.t': 'La versión francesa da fe',
  'legal.notice.b':
    'El texto siguiente se deja deliberadamente en francés: solo la versión francesa de este documento tiene valor contractual. Los títulos están traducidos para facilitar la lectura. Puede solicitarse una traducción de cortesía en charles@symphonydrive.com.',
  'legal.updated': 'Última actualización:',
  'legal.version': 'Versión 1.0 —',

  'cgv.meta.title': 'Condiciones generales de venta · VYVRE',
  'cgv.meta.desc':
    'Condiciones generales de venta de VYVRE Business — suscripciones SaaS B2B para marcas cosméticas.',
  'cgv.eyebrow': 'Condiciones generales de venta',
  'cgv.h1': 'Condiciones de venta.',
  'cgv.a1': 'Artículo 1 — Objeto',
  'cgv.a2': 'Artículo 2 — Suscripción y activación',
  'cgv.a3': 'Artículo 3 — Tarifas',
  'cgv.a4': 'Artículo 4 — Modalidades de pago',
  'cgv.a5': 'Artículo 5 — Duración y resolución',
  'cgv.a6': 'Artículo 6 — Compromiso de servicio (SLA)',
  'cgv.a7': 'Artículo 7 — Propiedad de los datos',
  'cgv.a8': 'Artículo 8 — Limitación de responsabilidad',
  'cgv.a9': 'Artículo 9 — Confidencialidad y RGPD',
  'cgv.a10': 'Artículo 10 — Ley aplicable y jurisdicción',

  'conf.meta.title': 'Política de privacidad · VYVRE',
  'conf.meta.desc':
    'Política de privacidad y protección de datos personales de VYVRE. Conformidad con el RGPD.',
  'conf.eyebrow': 'Protección de datos · RGPD',
  'conf.h1': 'Privacidad.',
  'conf.b1': 'Responsable del tratamiento',
  'conf.b2': 'Datos recogidos por el escaneo de piel',
  'conf.b3': 'Alojamiento de los datos',
  'conf.b4': 'Datos recogidos por el sitio web',
  'conf.b5': 'Datos recogidos en una compra',
  'conf.b6': 'Base jurídica del tratamiento',
  'conf.b7': 'Plazo de conservación',
  'conf.b8': 'Sus derechos RGPD',
  'conf.b9': 'DPA (acuerdo de tratamiento de datos)',

  'ml.meta.title': 'Aviso legal · VYVRE',
  'ml.meta.desc': 'Aviso legal de VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Información legal',
  'ml.h1': 'Aviso legal.',
  'ml.b1': 'Editor del sitio',
  'ml.b2': 'Director de la publicación',
  'ml.b3': 'Alojamiento',
  'ml.b4': 'Propiedad intelectual',
  'ml.b5': 'Limitación de responsabilidad',
  'ml.b6': 'Enlaces de hipertexto',
  'ml.b7': 'Ley aplicable',

  'dpa.meta.title': 'DPA · Acuerdo de tratamiento de datos · VYVRE',
  'dpa.meta.desc':
    'Acuerdo de tratamiento de datos (artículo 28 del RGPD) entre VYVRE y los clientes B2B.',
  'dpa.eyebrow': 'Artículo 28 RGPD · Encargado del tratamiento',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Partes',
  'dpa.b2': '2. Objeto del tratamiento',
  'dpa.b3': '3. Categorías de datos tratados',
  'dpa.b4': '4. Categorías de interesados',
  'dpa.b5': '5. Duración del tratamiento',
  'dpa.b6': '6. Obligaciones del encargado del tratamiento',
  'dpa.b7': '7. Medidas de seguridad (artículo 32 del RGPD)',
  'dpa.b8': '8. Subencargados del tratamiento',
  'dpa.b9': '9. Transferencias fuera de la Unión Europea',
  'dpa.b10': '10. Auditoría y control',
  'dpa.b11': '11. Notificación de violación de datos',
  'dpa.b12': '12. Restitución y supresión de los datos',
} as const;

export default es;
