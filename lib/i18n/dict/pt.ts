/**
 * VYVRE — dicionário português das páginas Next (marques, accuracy, pricing, legal).
 *
 * O francês é a fonte: qualquer chave acrescentada nesse ficheiro deve sê-lo nos
 * onze outros ficheiros de /lib/i18n/dict. O que nunca se traduz permanece no
 * JSX: nomes de marcas, « VYVRE », « skin intelligence », títulos de artigos
 * científicos, nomes de revistas, excertos de código, números e preços em euros.
 */

const pt = {
  /* ─────────── comum: cabeçalho, rodapé, seletor ─────────── */
  'lang.aria': 'Escolher o idioma',
  'nav.manifeste': 'Manifesto',
  'nav.method': 'Método',
  'nav.demo': 'Testar o scan',
  'nav.pricing': 'Preços',

  'footer.city': 'VYVRE · Paris',
  'footer.cityFull': 'VYVRE · Paris, França',
  'footer.book': 'Marcar 20 min →',
  'footer.manifeste': 'Manifesto',
  'footer.method': 'Metodologia',
  'footer.cgv': 'Condições gerais de venda',
  'footer.legal': 'Aviso legal',
  'footer.privacy': 'Privacidade',
  'footer.privacyGdpr': 'Privacidade · RGPD',
  'footer.dpa': 'DPA',
  'footer.contact': 'Contacto',
  'footer.home': 'Início',
  'footer.rights': 'Todos os direitos reservados',
  'footer.company': 'SAS com capital de 1 000 € · Paris, França · SIREN em curso',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Diagnóstico de pele medido, para as marcas de cuidados de pele',
  'home.meta.desc':
    'O único diagnóstico de pele com um preço público. Infraestrutura em França, RGPD nativo, processamento no aparelho, nenhuma fotografia carregada.',

  'home.hero.eyebrow': 'Diagnóstico de pele medido',
  'home.hero.h1a': 'O diagnóstico de pele',
  'home.hero.h1b': 'da sua casa.',
  'home.hero.p':
    'Menos de dez segundos de câmara. Oito medições lidas pixel a pixel. Uma rotina composta apenas no seu catálogo.',
  'home.hero.cta1': 'Testar o scan',
  'home.hero.cta2': 'Equipar a minha marca',

  'home.stat1': 'Medições de pele',
  'home.stat2': 'Duração do scan',
  'home.stat3': 'Entrada em linha',
  'home.stat4': 'Foto conservada',

  'home.man.h2a': 'Medida,',
  'home.man.h2b': 'não adivinhada.',
  'home.man.p':
    'O motor converte cada zona do rosto em coordenadas CIE L*a*b*, depois em índices dermatológicos. Não é uma estimativa a partir de um filtro: uma leitura ótica, reproduzível, documentada.',
  'home.man.link': 'Ler a metodologia →',

  'home.mes.h2a': 'Oito medições.',
  'home.mes.h2b': 'Uma única leitura.',
  'home.mes.1.n': 'Carnação',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Luminosidade',
  'home.mes.2.u': 'Luminância L*',
  'home.mes.3.n': 'Vermelhidão',
  'home.mes.3.u': 'Índice de eritema',
  'home.mes.4.n': 'Uniformidade',
  'home.mes.4.u': 'Desvio-padrão cromático',
  'home.mes.5.n': 'Textura',
  'home.mes.5.u': 'Microcontraste local',
  'home.mes.6.n': 'Poros',
  'home.mes.6.u': 'Densidade dos mínimos',
  'home.mes.7.n': 'Sebo',
  'home.mes.7.u': 'Reflexão especular',
  'home.mes.8.n': 'Hidratação',
  'home.mes.8.u': 'Proxy TEWL ótico',

  'home.steps.h2a': 'Três etapas.',
  'home.steps.h2b': 'Zero atrito.',
  'home.step1.t': 'A cliente faz o scan',
  'home.step1.d':
    'Câmara do telemóvel ou do posto de aconselhamento. Nada para instalar, nada para carregar: a imagem é processada e depois apagada.',
  'home.step2.t': 'O motor compõe',
  'home.step2.d':
    'Uma rotina de manhã e de noite proveniente apenas do seu catálogo, hierarquizada segundo as medições e as suas prioridades comerciais.',
  'home.step3.t': 'Fica online',
  'home.step3.d':
    'Uma linha de script no seu site, as suas cores, a sua tipografia. Nenhum programador mobilizado do seu lado.',

  'home.groupe.eyebrow': 'Para os grupos',
  'home.groupe.h2a': 'Uma casa, dez marcas,',
  'home.groupe.h2b': 'um único motor.',
  'home.socle1.t': 'Multimarca',
  'home.socle1.d':
    'Um espaço por marca: catálogo, identidade visual, regras de recomendação e estatísticas separados.',
  'home.socle2.t': 'Soberania',
  'home.socle2.d':
    'Alojamento em França, RGPD nativo, DPA assinado, nenhuma imagem conservada, nenhum pixel de terceiros.',
  'home.socle3.t': 'Loja e e-shop',
  'home.socle3.d':
    'O mesmo motor ao balcão em tablet e na ficha de produto, com o mesmo referencial de medições.',

  'home.price.h2a': 'A partir de 299 €/mês.',
  'home.price.h2b': 'Preço afixado.',
  'home.price.cta': 'Ver os planos',

  'home.faq.h2': 'Perguntas.',
  'home.faq1.q': 'Como é que o meu catálogo entra no motor?',
  'home.faq1.a':
    'Através de um fluxo CSV ou da API do seu e-commerce (Shopify, Salesforce Commerce, Centra). Sem acesso de administrador, sincronização todas as noites.',
  'home.faq2.q': 'O que acontece à imagem da cliente?',
  'home.faq2.a':
    'É analisada em memória e depois apagada: nenhuma fotografia é armazenada nem transmitida. Alojamento em França, DPA disponível.',
  'home.faq3.q': 'O motor pode recomendar um concorrente?',
  'home.faq3.a':
    'Não. A rotina é composta exclusivamente no seu catálogo, com as prioridades que definir.',
  'home.faq4.q': 'Que equipamento é necessário?',
  'home.faq4.a':
    'Basta uma câmara 720p, tanto no telemóvel como no computador. Os resultados ganham em finura com os sensores recentes.',

  'home.cta.h2': 'Ver o scan no seu catálogo.',
  'home.cta.1': 'Iniciar a demonstração',
  'home.cta.2': 'Pedir uma demonstração',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Metodologia e precisão · VYVRE',
  'acc.meta.desc':
    'Fontes revistas por pares (5 citadas, 4 no roteiro), método de cálculo, intervalos de confiança, limites. A transparência científica por trás do motor VYVRE.',

  'acc.hero.eyebrow': 'Metodologia · Fontes · Limites',
  'acc.hero.h1a': 'A ciência',
  'acc.hero.h1b': 'por trás do scan.',
  'acc.hero.p':
    'Oito medições lidas a partir da imagem. Aqui: as fontes científicas, o método de cálculo, os intervalos de confiança e os limites do motor.',
  'acc.hero.note1':
    'Precisão estimada ±5 anos idade biológica · ±4 anos idade percebida (IC 95 % · coorte interna n=12)',
  'acc.hero.note2':
    'Validação externa n=100 prevista para o final de 2026 · revisão em maio de 2026 após auditoria interna',

  'acc.s1.eyebrow': '01 · Bibliografia · Fontes aplicadas',
  'acc.s1.h2a': '5 fontes revistas por pares',
  'acc.s1.h2b': 'e o que o motor aplica delas.',
  'acc.s1.p1': 'O que cada uma destas 5 fontes contribui para o motor, verificável no código (ver',
  'acc.s1.p2': ', função',
  'acc.s1.p3': 'e',
  'acc.s1.p4': '). Desde outubro de 2026, nenhuma das oito medidas depende da cor da pele nem do brilho da imagem: cada medida compara a pele consigo mesma, na mesma imagem.',
  'acc.s1.foot1': 'Motor v10.13 — medidas relativas, outubro de 2026',
  'acc.s1.foot2': 'Fontes aplicadas verificáveis linha a linha em',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — base da deteção automática do fototipo Fitzpatrick I-VI',
  'acc.src2.c':
    'Índice de melanina e índice de eritema: calculados a título informativo. A vermelhidão é lida como a* (CIE L*a*b*) nas bochechas; a pigmentação é medida em relação ao tom da própria pessoa (zonas 10 % mais escuras do que a sua pele).',
  'acc.src3.c':
    'Antigo indicador σL* (hidratação e poros), retirado em outubro de 2026: lia sobretudo a sombra do relevo. Hidratação: microtextura mais fina das bochechas, sem os poros, relativa ao nível da pele. Poros: pequenos pontos escuros que se destacam do grão vizinho.',
  'acc.src4.c':
    'Reflexos especulares → sebo, com um limiar relativo ao nível da pele das bochechas. A luminosidade já não lê o brilho bruto: uniformidade da luz nas maçãs do rosto e na testa, reflexo suave das maçãs do rosto, relativos à pele da pessoa.',
  'acc.src5.c':
    'Desvio idade percebida / idade biológica (coorte caucasiana ~1 700 indivíduos). v7: desvio dependente da idade (−2 a −6 anos consoante a idade biológica), não ligado ao fototipo.',

  'acc.s2.eyebrow': '02 · Bibliografia · Roteiro final de 2026',
  'acc.s2.h2a': '4 fontes referenciadas',
  'acc.s2.h2b': 'ainda não plenamente aplicadas.',
  'acc.s2.p':
    'Estas fontes são citadas por transparência e para o roteiro público. Os seus coeficientes completos ainda não estão integrados nas fórmulas — extração e validação previstas para o final de 2026 com um parceiro dermatologista.',
  'acc.rm.appliedLabel': 'Aplicado parcialmente: ',
  'acc.rm.roadmapLabel': 'Roteiro: ',
  'acc.rm1.a':
    'Idade de ancoragem 40 (mediana da coorte adulta) + correlação r=0,78 rugas periorbitais ↔ idade',
  'acc.rm1.r':
    'Extração de imagens → grau morfológico 0-5 (escala Bazin) ainda não implementada. Prevista para o final de 2026.',
  'acc.rm2.a': 'Ajuste modesto de −4 % a −8 % sobre a idade biológica para os fototipos IV-VI',
  'acc.rm2.r':
    'Coeficientes completos por fototipo para rugas / firmeza / pigmentação ainda não extraídos.',
  'acc.rm3.a': 'Citado para o contexto multiétnico',
  'acc.rm3.r':
    'Coeficientes específicos ainda não extraídos. Validação em coorte multiétnica prevista para o final de 2026.',
  'acc.rm4.a': 'Normas clínicas TEWL referenciadas (saudável ≤ 15 g/m²/h, alterado ≥ 25)',
  'acc.rm4.r':
    'O cálculo numérico σL* → TEWL segue Stamatas 2011 (e não Akdeniz). Validação cruzada prevista.',

  'acc.bench.eyebrow': 'Benchmark público · UTKFace · 26 de maio de 2026',
  'acc.bench.h2a': 'Comparado publicamente',
  'acc.bench.h2b': 'com 3 referências open source.',
  'acc.bench.p':
    'VYVRE v7.0 testado em 300 rostos públicos UTKFace (estratificados 18-80 anos) ao lado de DeepFace, InsightFace e OpenCV DNN. Veredito publicado sem retoques, código reproduzível, 5 scripts, 4 min de execução.',
  'acc.bench.k1.l': '30-44 (alvo)',
  'acc.bench.k1.n': 'MAE — à frente do OpenCV (8,66 anos)',
  'acc.bench.k2.l': 'Conjunto (18-80)',
  'acc.bench.k2.n': 'MAE — atrás das redes profundas',
  'acc.bench.k3.l': 'Viés com sinal',
  'acc.bench.k3.n': 'O mais neutro dos 4 motores',
  'acc.bench.cta': 'Ver o benchmark completo →',

  'acc.s3.eyebrow': '03 · Normas colorimétricas (fundações)',
  'acc.s3.p':
    'Normas subjacentes — não são artigos revistos por pares, mas especificações técnicas ativas na cadeia de processamento.',
  'acc.s3.std1': 'Espaço colorimétrico sRGB (descodificação gama)',
  'acc.s3.std2': 'Primárias RGB Rec. 709',
  'acc.s3.std3': 'Conversão XYZ → L*a*b*',
  'acc.s3.std4': 'Limites Fitzpatrick por ITA°',
  'acc.s3.std5': 'Deteção dos pixels de pele YCbCr',
  'acc.s3.std6': 'Medição de nitidez laplaciana',
  'acc.s3.std7':
    'deixou de ser usado: desde outubro de 2026, a firmeza já não depende da cor da pele (relevo do sulco nasogeniano, contorno da parte inferior do rosto, cantos da boca).',

  'acc.s4.eyebrow': '04 · Cadeia de processamento',
  'acc.s4.h2': 'Método de cálculo.',
  'acc.st1.t': 'Captura da imagem',
  'acc.st1.d':
    'Webcam padrão (≥ 720p). Menos de 10 segundos de captura, 8 imagens retidas. Deteção do rosto por face-api.js (68 pontos de referência). Recorte da zona facial e correção de luz.',
  'acc.st2.t': 'Conversão colorimétrica',
  'acc.st2.d':
    'Cadeia sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Autoteste em 6 cores de referência a cada scan. Precisão ao pixel.',
  'acc.st3.t': 'Extração dos sinais',
  'acc.st3.d':
    'Cor (L*a*b*: ITA° para o fototipo, a* para a vermelhidão), reflexos (sebo) e texturas relativas: pequenos pontos escuros (poros), microtextura (hidratação), pregas do contorno dos olhos e da testa (rugas), sulco nasogeniano e parte inferior do rosto (firmeza), uniformidade da luz (luminosidade). Bochechas, nariz, testa, contorno dos olhos.',
  'acc.st4.t': 'Conversão em biomarcadores',
  'acc.st4.d':
    'Cada sinal é um desvio da pele em relação a si mesma, na mesma imagem: nunca uma cor de pele nem um brilho absoluto. Conversão numa pontuação 0-100 com constantes nomeadas, ajustadas em fotos de teste e assinaladas como tal; uma medida ilegível dá uma pontuação neutra, assinalada.',
  'acc.st5.t': 'Deteção do fototipo',
  'acc.st5.d':
    'Classificação Fitzpatrick I-VI por ITA° (Chardon 1991), mostrada a título informativo. Nenhuma das oito medidas usa o fototipo nem a cor da pele.',
  'acc.st6.t': 'Estimativa da idade + intervalo',
  'acc.st6.d':
    'A idade não é mostrada: a combinação das medidas ainda não acompanha a idade real de forma fiável. Só será mostrada após uma validação em rostos de idade conhecida.',

  'acc.s5.eyebrow': '05 · Idade da pele · Método v7',
  'acc.s5.h2a': 'Idade da pele percebida',
  'acc.s5.h2b': 'ou idade biológica bruta.',
  'acc.s5.p': 'São calculados dois números, apenas um é apresentado. Eis porquê.',
  'acc.age.l.tag': 'Apresentado — Idade da pele',
  'acc.age.l.h3': 'Idade percebida visualmente',
  'acc.age.l.p':
    'Idade média percebida socialmente por um observador humano. Calibrada em Vierkötter & Krutmann 2012 (coorte caucasiana ~1 700 indivíduos) com um desvio',
  'acc.age.l.pEm': 'dependente da idade',
  'acc.age.l.li1': '< 30 anos bio → −2 anos',
  'acc.age.l.li2': '30-45 anos bio → −4 anos',
  'acc.age.l.li3': '45-60 anos bio → −5 anos',
  'acc.age.l.li4': '60 anos e + bio → −5 a −6 anos',
  'acc.age.l.note':
    'A v7 retira a correspondência por fototipo da v6, ausente da fonte de origem. O fototipo influencia a idade biológica (Diridollou), não a perceção social.',
  'acc.age.r.tag': 'Interno — Idade biológica',
  'acc.age.r.h3': 'Idade biológica bruta',
  'acc.age.r.p':
    'Estimativa direta do estado físico da pele através da pontuação de rugas dominante (rugas periorbitais, Bazin 2007). Correlação r=0,78 com a idade cronológica em fotografias de estúdio.',
  'acc.age.r.note1': 'Fórmula v7:',
  'acc.age.r.note2':
    'O fator 0,85 (penalização webcam JPEG) é uma compensação empírica assumida; validação em coorte alargada prevista para o final de 2026.',
  'acc.age.prec1': 'Precisão estimada:',
  'acc.age.prec.bio': '±5 anos idade biológica',
  'acc.age.prec.perc': '±4 anos idade percebida',
  'acc.age.prec2': '(IC 95 % em coorte interna n=12)',
  'acc.age.prec3': 'Validação externa n=100 prevista para o final de 2026',

  'acc.s6.eyebrow': '06 · Comportamento consoante a qualidade · v7',
  'acc.s6.h2a': '3 níveis de confiança.',
  'acc.s6.h2b': 'Nenhum arranjo lisonjeiro.',
  'acc.s6.p':
    'A v7 retira o corretivo v6.2 que rejuvenescia artificialmente os scans degradados (paradoxo « quanto menos o motor vê, mais lisonjeia »). Em vez disso, 3 níveis de confiança explícitos.',
  'acc.q1.tag': 'Qualidade < 40',
  'acc.q1.h3': 'Recusa do scan',
  'acc.q1.p1': 'Nenhuma estimativa publicada. Mensagem',
  'acc.q1.p2':
    'com recomendação de repetir o scan com melhor luz. A estimativa não é calculada.',
  'acc.q2.tag': '40 ≤ Qualidade < 60',
  'acc.q2.h3': 'Confiança baixa',
  'acc.q2.p1': 'Estimativa publicada na melhor das hipóteses, mas assinalada',
  'acc.q2.p2':
    '. Intervalo alargado para ±7 anos (contra ±5 em modo padrão). A estimativa mantém-se honesta, não desviada.',
  'acc.q3.tag': 'Qualidade ≥ 60',
  'acc.q3.h3': 'Padrão',
  'acc.q3.p1': 'Estimativa padrão com',
  'acc.q3.p2':
    '. Intervalo ±5 anos (95 % em coorte interna n=12). Comportamento nominal para uma webcam HD bem iluminada.',
  'acc.s6.foot1': 'Corretivo v6.2 retirado: −5 anos num scan degradado (qualidade < 45)',
  'acc.s6.foot2':
    'A v7 alarga o intervalo em vez de desviar a estimativa (a honestidade em vez da lisonja)',

  'acc.s7.eyebrow': '07 · Testes de variância',
  'acc.s7.h2': 'Reprodutibilidade.',
  'acc.s7.p':
    'Teste: mesmo indivíduo digitalizado 10 vezes em 10 condições de luz diferentes. Medição do desvio-padrão das pontuações. Coorte interna n=12.',
  'acc.var1': 'Rugas',
  'acc.var2': 'Firmeza',
  'acc.var3': 'Pigmentação',
  'acc.var4': 'Hidratação',
  'acc.var5': 'Luminosidade',
  'acc.var6': 'Poros',
  'acc.var7': 'Vermelhidão',
  'acc.var8': 'Idade percebida',
  'acc.var.unitPts': 'pts/100',
  'acc.var.unitYears': 'anos',
  'acc.s7.foot1':
    'Coorte interna · n=12 indivíduos fototipos I-IV · 10 scans/indivíduo · luz variável · webcam HD 720p',
  'acc.s7.foot2':
    'Fototipos V-VI: extrapolação Diridollou 2007 — validação em coorte dedicada prevista para o final de 2026',
  'acc.s7.foot3': 'Validação externa n=100 prevista para o final de 2026',

  'acc.s8.eyebrow': '08 · Roteiro de validação',
  'acc.s8.h2a': 'Aquilo que nos comprometemos',
  'acc.s8.h2b': 'a validar.',
  'acc.q.late2026': 'final de 2026',
  'acc.q.q42026': 'T4 2026',
  'acc.rd1.t': 'Validação em coorte externa n=100',
  'acc.rd1.b':
    'Recrutamento de 100 indivíduos variados (20-75 anos, fototipos I-VI). Medição da concordância com os aparelhos de referência Visia / Antera. Publicação metodológica.',
  'acc.rd2.t': 'Grau morfológico Bazin 0-5',
  'acc.rd2.b':
    'Extração a partir das imagens do grau morfológico Bazin (atlas vol. 1, cap. 4) — hoje apenas a idade de ancoragem 40 e a correlação r=0,78 são utilizadas. Implementação da deteção da profundidade das rugas e da classificação 0-5.',
  'acc.rd3.t': 'Coeficientes por fototipo (Diridollou + Flament)',
  'acc.rd3.b':
    'Extração dos coeficientes de Diridollou 2007 e Flament 2023 para rugas / firmeza / pigmentação por fototipo. A v7 aplica hoje um ajuste modesto de −4 % a −8 % sobre a idade biológica dos fototipos IV-VI; objetivo: correspondência completa por fototipo com os coeficientes de origem.',
  'acc.rd4.t': 'Publicação revista por pares',
  'acc.rd4.b':
    'Submissão de um artigo metodológico que descreve a cadeia VYVRE (webcam de grande consumo → biomarcadores CIE L*a*b* → estimativa de idade) com validação em coorte n=100. Alvo: Int J Cosmet Sci ou Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Limites',
  'acc.s9.h2a': 'O que a VYVRE',
  'acc.s9.h2b': 'não faz.',
  'acc.s9.p':
    'Preferimos ser radicalmente honestos sobre o que o motor não mede, em vez de vender ilusões.',
  'acc.lim1.t': 'A VYVRE não é um dispositivo médico',
  'acc.lim1.b':
    'O motor não faz qualquer diagnóstico médico. Não deteta patologias dermatológicas (cancro cutâneo, melanoma, dermatite, psoríase, etc.). Para qualquer preocupação médica, consulte um dermatologista.',
  'acc.lim2.t': 'Uma webcam padrão não é um scanner profissional',
  'acc.lim2.b':
    'Um scanner dermatológico profissional utiliza luz polarizada, fluorescência UV e sensor 3D. A VYVRE apoia-se numa webcam padrão e numa luz não controlada. Variância ±8 % (contra ±2 % em consultório).',
  'acc.lim3.t': 'Sem deteção 3D das rugas',
  'acc.lim3.b':
    'A profundidade real das rugas exige um sensor estereoscópico. A VYVRE estima a severidade pela análise colorimétrica das sombras (abordagem 2D). Fiável nas rugas marcadas, menos precisa nas rugas finas iniciais.',
  'acc.lim4.t': 'Hiperpigmentação profunda não detetada',
  'acc.lim4.b':
    'As manchas pigmentares subepidérmicas (melasma profundo, manchas actínicas antigas) não são visíveis em luz visível. Seria necessária uma câmara de fluorescência UV (não incluída).',
  'acc.lim5.t': 'Fototipos V-VI: extrapolação assumida',
  'acc.lim5.b':
    'A coorte interna n=12 contém sobretudo fototipos I-IV. Os ajustes para V-VI são extrapolados dos dados de Diridollou 2007 (−4 % a −8 % sobre a idade biológica). Validação em coorte dedicada prevista para o final de 2026.',
  'acc.lim6.t': 'Maquilhagem, óculos, máscara',
  'acc.lim6.b':
    'O motor deteta estas obstruções e baixa a pontuação de qualidade. Se a qualidade for demasiado baixa (< 40), o scan é recusado. Entre 40 e 60, o resultado é publicado com uma indicação explícita de confiança baixa e um intervalo alargado.',
  'acc.lim7.t': 'A coorte interna n=12 é pequena — assumimo-lo',
  'acc.lim7.b':
    'Os coeficientes empíricos (penalização webcam JPEG, largura do intervalo) são calibrados em 12 indivíduos. É um grupo de teste, não uma coorte clínica. A validação externa n=100 está inscrita no roteiro para o final de 2026.',

  'acc.s10.eyebrow': '10 · Módulo complementar · Condições cutâneas (v1 indicativo)',
  'acc.s10.h2a': 'Deteção visual de 4 condições',
  'acc.s10.h2b': 'indicativa, nunca médica.',
  'acc.s10.p1': 'Módulo separado',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — carregamento opcional em qualquer demonstração. Deteta por heurísticas de imagem 4 condições visuais frequentes e propõe uma rotina cosmética específica, fora de prescrição.',
  'acc.s10.p3': 'Este módulo não faz qualquer diagnóstico médico.',
  'acc.cond.sens': 'Sensibilidade',
  'acc.cond.spec': 'Especificidade',
  'acc.cond.cohort': 'coorte de síntese n=12',
  'acc.cond1.a': 'Módulo · Acne',
  'acc.cond1.t': 'Eritema a* CIELAB localizado + variância de textura L*',
  'acc.cond1.c':
    'Deteção de pixels eritematosos concentrados em pontos distintos na zona T (testa, nariz, queixo). Saída: probabilidade + severidade (mínima, baixa, média, elevada).',
  'acc.cond2.a': 'Módulo · Rosácea',
  'acc.cond2.t': 'Excesso mediano a* faces + nariz em relação à base + simetria bilateral',
  'acc.cond2.c':
    'Eritema persistente e bilateral nas faces e no nariz. A simetria entre as faces pondera a pontuação (a rosácea é bilateral).',
  'acc.cond3.a': 'Módulo · Melasma',
  'acc.cond3.t': 'ΔL* testa e lábio superior vs quartil alto L* das faces + Δb* (melanina)',
  'acc.cond3.c':
    'Hiperpigmentação simétrica do centro do rosto (testa, lábio superior, maçãs do rosto). Distingue um melasma difuso de manchas distintas.',
  'acc.cond4.a': 'Módulo · Lentigos',
  'acc.cond4.t': 'Deteção de manchas (tamanho 5-200 px², compacidade ≥ 0,45)',
  'acc.cond4.c':
    'Manchas pigmentares isoladas, de contornos nítidos, nas faces e na testa. Número de manchas qualificadas relacionado com a superfície de pele (densidade por 1 000 pixels).',
  'acc.s10.why.t': 'Porquê heurísticas em vez de uma rede neuronal?',
  'acc.s10.why1':
    'Os conjuntos de dados ISIC / DermNet contêm imagens clínicas em grande plano, em luz polarizada, centradas na lesão. Uma distribuição muito afastada de uma webcam de grande consumo a 50 cm sob luz não controlada: um modelo treinado nesses dados transferiria mal sem nova aprendizagem numa coorte VYVRE dedicada.',
  'acc.s10.why2':
    'As heurísticas continuam auditáveis linha a linha, o que um modelo opaco não é. Compatível com as exigências de explicabilidade das grandes casas.',
  'acc.s10.why3':
    'Nenhum modelo para descarregar (0 MB), nenhum processador gráfico necessário, funciona em todos os navegadores em menos de 200 ms.',
  'acc.s10.why4a': 'Arquitetura estável: uma v2 poderá substituir um modelo aprendido por trás da mesma interface',
  'acc.s10.why4b': 'sem quebrar as integrações existentes.',
  'acc.s10.disc.t': 'Aviso médico (obrigatório em qualquer apresentação)',
  'acc.s10.disc.b':
    'Este módulo não é um dispositivo médico. Não faz qualquer diagnóstico. As probabilidades devolvidas são indicadores de zonas de atenção, destinados a recomendar uma rotina cosmética específica. Para qualquer preocupação cutânea real, consulte um dermatologista.',
  'acc.s10.cta1': 'Ver a demonstração Condições →',
  'acc.s10.cta2': 'Código-fonte do módulo',

  'acc.s11.eyebrow': '11 · Salvaguarda de qualidade · Compromisso de honestidade',
  'acc.s11.h2a': 'Preferir a honestidade',
  'acc.s11.h2b': 'à falsa precisão.',
  'acc.s11.p1':
    'A v7.0 retira os corretivos v6.2 que lisonjeavam artificialmente o utilizador: rejuvenescimento oculto de 5 anos em webcam degradada, limites [20, 50] que reduziam um indivíduo de 80 anos a 50, correspondência por fototipo inventada fora da fonte.',
  'acc.s11.p2':
    'Se a pele real do utilizador tem 38 anos para um dermatologista, o motor deve dizer 38. Não 28 (mentira lisonjeira). Não 44 (falsa brutalidade). Uma estimativa verdadeira.',

  'acc.cta.h2a': 'Questões técnicas?',
  'acc.cta.h2b': 'Peça o DPA completo.',
  'acc.cta.p':
    'Enviamos mediante pedido aos DPO, dermatologistas consultores e equipas de I&D: DPA, metodologia detalhada, relatório de precisão, código-fonte do motor auditado.',
  'acc.cta.1': 'Pedir a documentação →',
  'acc.cta.2': '← Voltar',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Preços · VYVRE',
  'pri.meta.desc':
    'Diagnóstico de pele medido, alojado em França. Pilot gratuito, Starter 299 €/mês, Growth 499 €/mês, Enterprise a partir de 699 €/mês.',

  'pri.banner1': 'Acabou de testar a demonstração {brand}',
  'pri.banner2': '— Escolha o seu plano para a ativar no seu site.',

  'pri.hero.eyebrow': 'Tarifário · VYVRE Business',
  'pri.hero.h1a': 'O preço está',
  'pri.hero.h1b': 'na página.',
  'pri.hero.p': 'Alojamento em França · RGPD nativo · Nenhuma fotografia conservada',

  'pri.toggle.monthly': 'Mensal',
  'pri.toggle.annual': 'Anual',
  'pri.theme.label': 'Tema do seu widget',
  'pri.theme.dark': 'Preto',
  'pri.theme.light': 'Branco',
  'pri.theme.note': 'O seu diagnóstico será apresentado neste tema · alterável depois',

  'pri.card.plan': 'Plano',
  'pri.card.recommended': 'Recomendado',
  'pri.per.month': '/mês',

  'pri.pilot.price': 'Gratuito',
  'pri.pilot.sub': '30 dias · sem compromisso',
  'pri.pilot.f1': '1 000 scans / mês',
  'pri.pilot.f2': 'SDK Web',
  'pri.pilot.f3': 'Marcação VYVRE',
  'pri.pilot.f4': 'Apoio por e-mail em 48 h',
  'pri.pilot.f5': 'Infraestrutura em França',
  'pri.pilot.cta': 'Começar gratuitamente',

  'pri.starter.subA': '2 990 € / ano · 2 meses oferecidos',
  'pri.starter.subM': '5 000 scans / mês',
  'pri.starter.f1': '5 000 scans / mês',
  'pri.starter.f2': '0,02 € por scan adicional',
  'pri.starter.f3': 'SDK Web + iOS + Android',
  'pri.starter.f4': 'Marca branca completa',
  'pri.starter.f5': 'SLA 99,9 % · apoio prioritário',
  'pri.starter.cta': 'Iniciar o teste gratuito',

  'pri.growth.subA': '4 990 € / ano · 2 meses oferecidos',
  'pri.growth.subM': '15 000 scans / mês',
  'pri.growth.f1': '15 000 scans / mês',
  'pri.growth.f2': '0,015 € por scan adicional',
  'pri.growth.f3': 'Tudo do Starter, mais:',
  'pri.growth.f4': 'Multimarca (até 5)',
  'pri.growth.f5': 'Gestor de conta dedicado',
  'pri.growth.cta': 'Escolher Growth',

  'pri.ent.subA': 'a partir de · contrato à medida',
  'pri.ent.subM': 'a partir de · sem compromisso',
  'pri.ent.f1': '25 000 scans / mês',
  'pri.ent.f2': '0,01 € por scan adicional',
  'pri.ent.f3': 'Rede de lojas ilimitada',
  'pri.ent.f4': 'Aplicação móvel nativa',
  'pri.ent.f5': 'SLA 99,99 % · piquete 24/7',
  'pri.ent.cta': 'Contacte-nos',

  'pri.trust': 'Tarifário público · IVA não incluído · Cancelamento a qualquer momento',

  'pri.args.eyebrow': 'Porquê escolher-nos',
  'pri.args.h2a': 'Porquê a VYVRE',
  'pri.args.h2b': 'e não as outras?',
  'pri.arg1.e': 'Feito em França',
  'pri.arg1.t': 'O único módulo de diagnóstico de pele inteiramente francês',
  'pri.arg1.b': 'Infraestrutura alojada em França, equipa em Paris, DPA assinado.',
  'pri.arg1.n': 'As soluções comparáveis estão alojadas fora da União Europeia.',
  'pri.arg2.e': '−90 % na fatura',
  'pri.arg2.t1': 'Até 10× mais barato',
  'pri.arg2.t2': 'do que a concorrência',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'a partir de 299 € / mês',
  'pri.arg2.b3':
    '(3 588 € / ano). O SkinConsult AI começa em ~50 000 € / ano + 30 000 € de implementação, a Perfect Corp em ~30 000 € / ano.',
  'pri.arg2.n': 'Quadro comparativo detalhado mais abaixo nesta página.',
  'pri.arg3.e': 'Ativação em 48 h',
  'pri.arg3.t': 'Código de integração enviado após o pagamento',
  'pri.arg3.b1': 'Basta colar',
  'pri.arg3.b2': 'no seu site e está online.',
  'pri.arg3.n': 'Sem reunião de arranque, sem integrador externo faturado.',
  'pri.arg4.e': 'Sem compromisso',
  'pri.arg4.t': 'Cancelamento num clique',
  'pri.arg4.b':
    'Mudança para um plano inferior ou superior, ou cancelamento, a partir do seu painel de controlo. Sem bloqueio contratual, sem penalização.',
  'pri.arg4.n': 'Mantém a exportação de todos os seus dados de scan.',
  'pri.arg5.e': 'Marca branca total',
  'pri.arg5.t': 'A sua marca, não a nossa',
  'pri.arg5.b':
    'Logótipo, cores, tipografia, produtos recomendados — tudo é ajustado à sua identidade visual.',
  'pri.arg5.n': 'Nenhuma menção « Powered by VYVRE » imposta a partir do plano Starter.',
  'pri.arg6.e': 'Ciência revista por pares',
  'pri.arg6.t': 'Uma medição, não uma simulação',
  'pri.arg6.b':
    'Colorimetria CIE L*a*b*, 68 pontos de referência do rosto, índices derivados da literatura dermatológica.',
  'pri.arg6.n': 'Bibliografia: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Comparativo de mercado · preços públicos observados em 2025',
  'pri.tbl.h1': 'Solução',
  'pri.tbl.h2': 'Preço anual (entrada)',
  'pri.tbl.h3': 'Implementação / integração',
  'pri.tbl.h4': 'Alojamento',
  'pri.tbl.h5': 'Ativação',
  'pri.tbl.from': 'A partir de',
  'pri.tbl.month': '/mês',
  'pri.tbl.year': '/ano',
  'pri.tbl.fromApprox': 'a partir de',
  'pri.tbl.onQuote': 'sob consulta',
  'pri.tbl.france': 'França',
  'pri.tbl.w812': '8-12 sem.',
  'pri.tbl.w12': '12 sem. e +',
  'pri.tbl.w68': '6-8 sem.',
  'pri.tbl.note':
    'Preços da concorrência: ordens de grandeza públicas observadas (concursos de marcas cosméticas 2024-2025).',

  'pri.del.eyebrow': 'Arranque · desde o segundo do pagamento',
  'pri.del.h2a': 'O que recebe,',
  'pri.del.h2b': 'logo após a confirmação Stripe.',
  'pri.del1.t': 'E-mail de boas-vindas',
  'pri.del1.b': 'Com o seu link de administração pessoal e as suas credenciais.',
  'pri.del2.t': 'Código de integração pronto a colar',
  'pri.del3.t': 'Catálogo de produtos pré-preenchido',
  'pri.del3.b':
    '30 a 60 dos seus produtos recolhidos do seu site, já associados aos biomarcadores.',
  'pri.del4.t': 'Identidade visual da sua marca',
  'pri.del4.b':
    'Logótipo, paleta de cores e nome da marca aplicados ao módulo e ao painel de controlo.',
  'pri.del5.t': 'Painel de controlo analítico',
  'pri.del5.b':
    'Scans por dia, taxa de conversão, biomarcadores médios, produtos mais recomendados.',
  'pri.del6.t': 'Exportação RGPD completa',
  'pri.del6.b':
    'Mantém a totalidade dos seus dados de scan, exportáveis em CSV a qualquer momento.',

  'pri.faq.eyebrow': 'Perguntas frequentes',
  'pri.faq.h2a': 'Tudo o que quer',
  'pri.faq.h2b': 'saber.',
  'pri.faq1.q': 'O que acontece se ultrapassar a minha quota de scans?',
  'pri.faq1.a':
    'O serviço continua. Cada scan adicional é faturado entre 0,01 € e 0,02 € consoante o seu plano, na fatura do mês seguinte.',
  'pri.faq2.q': 'Onde são armazenados os dados das utilizadoras?',
  'pri.faq2.a':
    'Exclusivamente em França. Nenhuma fotografia conservada, nenhuma transferência fora da União Europeia, DPA assinado.',
  'pri.faq3.q': 'Posso mudar de plano a meio do percurso?',
  'pri.faq3.a':
    'Sim, a qualquer momento a partir do seu painel de controlo. Passagem ao plano superior com pro rata imediato, passagem ao plano inferior no mês seguinte.',
  'pri.faq4.q': 'Que nível de apoio técnico?',
  'pri.faq4.a':
    'Apoio por e-mail em 48 h em todos os planos. Apoio prioritário com gestor de conta dedicado a partir do Growth.',
  'pri.faq5.q': 'Os produtos recomendados são configuráveis?',
  'pri.faq5.a':
    'Sim. O seu catálogo é totalmente modificável: adiciona, retira e altera os produtos a partir do painel de controlo.',

  'pri.cal.eyebrow': 'Ainda não está pronto?',
  'pri.cal.h2': 'Marque uma demonstração de 20 minutos',
  'pri.cal.p':
    'Charles, fundador, mostra-lhe o módulo por videoconferência e responde a todas as suas questões técnicas e contratuais.',
  'pri.cal.cta': 'Marcar 20 min →',

  /* ─────────── páginas legais ─────────── */
  'legal.notice.t': 'Versão francesa fazendo fé',
  'legal.notice.b':
    'O texto abaixo é deixado deliberadamente em francês: apenas a versão francesa deste documento tem valor contratual. Os títulos são traduzidos para facilitar a leitura. Pode ser pedida uma tradução de cortesia para charles@symphonydrive.com.',
  'legal.updated': 'Última atualização:',
  'legal.version': 'Versão 1.0 —',

  'cgv.meta.title': 'Condições gerais de venda · VYVRE',
  'cgv.meta.desc':
    'Condições gerais de venda VYVRE Business — subscrições SaaS B2B para as marcas cosméticas.',
  'cgv.eyebrow': 'Condições gerais de venda',
  'cgv.h1': 'Condições gerais de venda.',
  'cgv.a1': 'Artigo 1 — Objeto',
  'cgv.a2': 'Artigo 2 — Subscrição e ativação',
  'cgv.a3': 'Artigo 3 — Preços',
  'cgv.a4': 'Artigo 4 — Modalidades de pagamento',
  'cgv.a5': 'Artigo 5 — Duração e rescisão',
  'cgv.a6': 'Artigo 6 — Compromisso de serviço (SLA)',
  'cgv.a7': 'Artigo 7 — Propriedade dos dados',
  'cgv.a8': 'Artigo 8 — Limitação de responsabilidade',
  'cgv.a9': 'Artigo 9 — Confidencialidade e RGPD',
  'cgv.a10': 'Artigo 10 — Lei aplicável e foro competente',

  'conf.meta.title': 'Política de privacidade · VYVRE',
  'conf.meta.desc':
    'Política de privacidade e proteção de dados pessoais VYVRE. Conformidade RGPD.',
  'conf.eyebrow': 'Proteção de dados · RGPD',
  'conf.h1': 'Privacidade.',
  'conf.b1': 'Responsável pelo tratamento',
  'conf.b2': 'Dados recolhidos pelo scan de pele',
  'conf.b3': 'Alojamento dos dados',
  'conf.b4': 'Dados recolhidos pelo sítio web',
  'conf.b5': 'Dados recolhidos aquando de uma compra',
  'conf.b6': 'Base legal do tratamento',
  'conf.b7': 'Prazo de conservação',
  'conf.b8': 'Os seus direitos RGPD',
  'conf.b9': 'DPA (acordo de tratamento de dados)',

  'ml.meta.title': 'Aviso legal · VYVRE',
  'ml.meta.desc': 'Aviso legal da VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Informações legais',
  'ml.h1': 'Aviso legal.',
  'ml.b1': 'Editor do sítio',
  'ml.b2': 'Diretor de publicação',
  'ml.b3': 'Alojamento',
  'ml.b4': 'Propriedade intelectual',
  'ml.b5': 'Limitação de responsabilidade',
  'ml.b6': 'Ligações hipertexto',
  'ml.b7': 'Lei aplicável',

  'dpa.meta.title': 'DPA · Acordo de tratamento de dados · VYVRE',
  'dpa.meta.desc':
    'Acordo de tratamento de dados (artigo 28.º do RGPD) entre a VYVRE e os clientes B2B.',
  'dpa.eyebrow': 'Artigo 28.º RGPD · Subcontratante',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Partes',
  'dpa.b2': '2. Objeto do tratamento',
  'dpa.b3': '3. Categorias de dados tratados',
  'dpa.b4': '4. Categorias de titulares dos dados',
  'dpa.b5': '5. Duração do tratamento',
  'dpa.b6': '6. Obrigações do subcontratante',
  'dpa.b7': '7. Medidas de segurança (artigo 32.º do RGPD)',
  'dpa.b8': '8. Subcontratantes ulteriores',
  'dpa.b9': '9. Transferências fora da União Europeia',
  'dpa.b10': '10. Auditoria e controlo',
  'dpa.b11': '11. Notificação de violação de dados',
  'dpa.b12': '12. Restituição e eliminação dos dados',
} as const;

export default pt;
