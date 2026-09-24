/**
 * VYVRE — dictionnaire coréen des pages Next (marques, accuracy, pricing, légal).
 *
 * Le français est la source : toute clé ajoutée ici doit l'être dans les onze
 * autres fichiers de /lib/i18n/dict. Ce qui ne se traduit jamais reste dans le
 * JSX : noms de marques, « VYVRE », « skin intelligence », titres de papiers
 * scientifiques, noms de revues, extraits de code, chiffres et prix en euros.
 */

const ko = {
  /* ─────────── commun : en-tête, pied de page, sélecteur ─────────── */
  'lang.aria': '언어 선택',
  'nav.manifeste': '매니페스토',
  'nav.method': '방법론',
  'nav.demo': '스캔 체험',
  'nav.pricing': '요금제',

  'footer.city': 'VYVRE · 파리',
  'footer.cityFull': 'VYVRE · 프랑스 파리',
  'footer.book': '20분 예약하기 →',
  'footer.manifeste': '매니페스토',
  'footer.method': '방법론',
  'footer.cgv': '판매 약관',
  'footer.legal': '법적 고지',
  'footer.privacy': '개인정보',
  'footer.privacyGdpr': '개인정보 · GDPR',
  'footer.dpa': 'DPA',
  'footer.contact': '문의',
  'footer.home': '홈',
  'footer.rights': '모든 권리 보유',
  'footer.company': '자본금 1 000 € SAS · 프랑스 파리 · SIREN 등록 진행 중',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — 스킨케어 브랜드를 위한 측정 기반 피부 진단',
  'home.meta.desc':
    '가격을 공개하는 유일한 피부 진단. 프랑스 인프라, GDPR 기본 준수, 기기 내 처리, 사진 업로드 없음.',

  'home.hero.eyebrow': '측정 기반 피부 진단',
  'home.hero.h1a': '귀사의 메종을 위한',
  'home.hero.h1b': '피부 진단.',
  'home.hero.p':
    '카메라는 10초 미만. 픽셀 단위로 읽어 내는 여덟 가지 측정. 오직 귀사의 카탈로그로만 구성되는 루틴.',
  'home.hero.cta1': '스캔 체험하기',
  'home.hero.cta2': '우리 브랜드에 도입하기',

  'home.stat1': '피부 측정',
  'home.stat2': '스캔 시간',
  'home.stat3': '공개까지',
  'home.stat4': '사진 보관',

  'home.man.h2a': '측정합니다,',
  'home.man.h2b': '추측하지 않습니다.',
  'home.man.p':
    '엔진은 얼굴의 각 영역을 CIE L*a*b* 좌표로, 이어서 피부과학 지표로 변환합니다. 필터에 기반한 추정이 아니라 재현 가능하고 문서화된 광학적 판독입니다.',
  'home.man.link': '방법론 읽기 →',

  'home.mes.h2a': '여덟 가지 측정.',
  'home.mes.h2b': '단 한 번의 판독.',
  'home.mes.1.n': '피부 톤',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': '광채',
  'home.mes.2.u': '휘도 L*',
  'home.mes.3.n': '붉은기',
  'home.mes.3.u': '홍반 지수',
  'home.mes.4.n': '균일도',
  'home.mes.4.u': '색도 표준편차',
  'home.mes.5.n': '결',
  'home.mes.5.u': '국소 미세 대비',
  'home.mes.6.n': '모공',
  'home.mes.6.u': '극솟값 밀도',
  'home.mes.7.n': '피지',
  'home.mes.7.u': '정반사',
  'home.mes.8.n': '수분',
  'home.mes.8.u': '광학적 TEWL 대리 지표',

  'home.steps.h2a': '세 단계.',
  'home.steps.h2b': '마찰은 없습니다.',
  'home.step1.t': '고객이 스캔합니다',
  'home.step1.d':
    '휴대폰 또는 상담 단말의 카메라. 설치도 업로드도 필요 없습니다. 이미지는 처리된 뒤 삭제됩니다.',
  'home.step2.t': '엔진이 구성합니다',
  'home.step2.d':
    '오직 귀사의 카탈로그에서, 측정 결과와 귀사의 상업적 우선순위에 따라 위계를 정한 아침과 저녁 루틴을 구성합니다.',
  'home.step3.t': '귀사가 공개합니다',
  'home.step3.d':
    '귀사 사이트에 스크립트 한 줄. 귀사의 색, 귀사의 서체. 개발자 투입은 필요 없습니다.',

  'home.groupe.eyebrow': '그룹을 위해',
  'home.groupe.h2a': '하나의 메종, 열 개의 브랜드,',
  'home.groupe.h2b': '하나의 엔진.',
  'home.socle1.t': '멀티 브랜드',
  'home.socle1.d':
    '브랜드마다 별도의 공간. 카탈로그, 브랜드 가이드, 추천 규칙, 통계를 분리해 관리합니다.',
  'home.socle2.t': '데이터 주권',
  'home.socle2.d':
    '프랑스 호스팅, GDPR 기본 준수, DPA 체결, 이미지 미보관, 제3자 픽셀 없음.',
  'home.socle3.t': '매장과 온라인 스토어',
  'home.socle3.d':
    '매장 태블릿에서도 제품 페이지에서도 같은 엔진, 같은 측정 기준으로.',

  'home.price.h2a': '월 299 €부터.',
  'home.price.h2b': '가격은 공개합니다.',
  'home.price.cta': '요금제 보기',

  'home.faq.h2': '질문.',
  'home.faq1.q': '카탈로그는 어떻게 엔진에 반영되나요?',
  'home.faq1.a':
    'CSV 피드 또는 귀사 이커머스의 API(Shopify, Salesforce Commerce, Centra)로 연동합니다. 관리자 권한은 필요 없으며 매일 밤 동기화됩니다.',
  'home.faq2.q': '고객의 이미지는 어떻게 되나요?',
  'home.faq2.a':
    '메모리에서 분석된 뒤 삭제됩니다. 사진은 저장되지도 전송되지도 않습니다. 프랑스 호스팅, DPA 제공.',
  'home.faq3.q': '엔진이 경쟁사 제품을 추천할 수 있나요?',
  'home.faq3.a':
    '아니요. 루틴은 오직 귀사의 카탈로그 안에서, 귀사가 정한 우선순위에 따라 구성됩니다.',
  'home.faq4.q': '어떤 장비가 필요한가요?',
  'home.faq4.a':
    '720p 카메라면 모바일에서도 PC에서도 충분합니다. 최신 센서일수록 결과가 정밀해집니다.',

  'home.cta.h2': '귀사의 카탈로그로 스캔을 확인해 보세요.',
  'home.cta.1': '데모 실행',
  'home.cta.2': '데모 신청',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': '방법론과 정확도 · VYVRE',
  'acc.meta.desc':
    '동료 심사 출처(적용 5건, 로드맵 4건), 계산 방법, 신뢰구간, 한계. VYVRE 엔진 v7.0을 뒷받침하는 과학적 투명성.',

  'acc.hero.eyebrow': '방법론 · 출처 · 한계',
  'acc.hero.h1a': '스캔 뒤에 있는',
  'acc.hero.h1b': '과학.',
  'acc.hero.p':
    '이미지에서 읽어 내는 여덟 가지 측정. 여기에서는 과학적 출처, 계산 방법, 신뢰구간, 그리고 엔진의 한계를 밝힙니다.',
  'acc.hero.note1':
    '추정 정확도 ±5년 생물학적 나이 · ±4년 인지 나이(95 % 신뢰구간 · 내부 코호트 n=12)',
  'acc.hero.note2':
    '외부 검증 n=100은 2026년 말 예정 · 내부 감사 후 2026년 5월 전면 개편',

  'acc.s1.eyebrow': '01 · 참고문헌 · 적용된 출처',
  'acc.s1.h2a': '동료 심사를 거친 다섯 건의 출처를',
  'acc.s1.h2b': '실제로 적용합니다.',
  'acc.s1.p1': '이 다섯 건의 출처는 엔진의 계산식에 직접 사용됩니다(참조:',
  'acc.s1.p2': ', 함수',
  'acc.s1.p3': '및',
  'acc.s1.p4': '). 각 바이오마커는 PubMed에 등재된 과학 논문까지 추적할 수 있습니다.',
  'acc.s1.foot1': '엔진 v7 — 2026년 5월 전면 개편',
  'acc.s1.foot2': '적용된 출처는 다음 파일에서 한 줄씩 확인할 수 있습니다',

  'acc.src1.c':
    'ITA°(Individual Typology Angle) — Fitzpatrick I-VI 광형 자동 판별의 기초',
  'acc.src2.c':
    'Melanin Index(MI)와 Erythema Index(EI) — 색소 침착과 붉은기의 정량화',
  'acc.src3.c':
    'σL*를 통한 TEWL 대리 지표(경피 수분 손실) → 수분과 모공 지표. 표 3의 회귀식.',
  'acc.src4.c':
    '정반사 → 광채 / 피지. 얼굴의 정반사 검출',
  'acc.src5.c':
    '인지 나이와 생물학적 나이의 차이(백인 코호트 약 1,700명). v7: 차이는 나이에 따라 달라지며(생물학적 나이에 따라 −2 ~ −6년), 광형과는 무관합니다.',

  'acc.s2.eyebrow': '02 · 참고문헌 · 2026년 말 로드맵',
  'acc.s2.h2a': '참조한 네 건의 출처는',
  'acc.s2.h2b': '아직 완전히 적용되지 않았습니다.',
  'acc.s2.p':
    '이 출처들은 투명성과 공개 로드맵을 위해 인용했습니다. 전체 계수는 아직 계산식에 반영되지 않았으며, 추출과 검증은 피부과 전문의 파트너와 함께 2026년 말에 예정되어 있습니다.',
  'acc.rm.appliedLabel': '부분 적용: ',
  'acc.rm.roadmapLabel': '로드맵: ',
  'acc.rm1.a':
    '기준 나이 40세(성인 코호트 중앙값) + 눈가 주름과 나이의 상관 r=0.78',
  'acc.rm1.r':
    '이미지 추출 → 형태학적 등급 0-5(Bazin 척도)는 아직 구현되지 않았습니다. 2026년 말 예정입니다.',
  'acc.rm2.a': '광형 IV-VI의 생물학적 나이에 대한 −4 % ~ −8 %의 완만한 보정',
  'acc.rm2.r':
    '주름 / 탄력 / 색소 침착에 대한 광형별 전체 계수는 아직 추출되지 않았습니다.',
  'acc.rm3.a': '다인종 맥락을 위해 인용',
  'acc.rm3.r':
    '고유 계수는 아직 추출되지 않았습니다. 다인종 코호트 검증은 2026년 말 예정입니다.',
  'acc.rm4.a': 'TEWL 임상 기준치 참조(정상 ≤ 15 g/m²/h, 손상 ≥ 25)',
  'acc.rm4.r':
    'σL* → TEWL 수치 계산은 Stamatas 2011을 따릅니다(Akdeniz가 아닙니다). 교차 검증을 예정하고 있습니다.',

  'acc.bench.eyebrow': '공개 벤치마크 · UTKFace · 2026년 5월 26일',
  'acc.bench.h2a': '세 가지 오픈소스 기준과',
  'acc.bench.h2b': '공개적으로 비교했습니다.',
  'acc.bench.p':
    'VYVRE v7.0을 UTKFace 공개 얼굴 300장(18-80세 층화)에서 DeepFace, InsightFace, OpenCV DNN과 함께 시험했습니다. 결과는 손대지 않고 공개, 재현 가능한 코드, 스크립트 5개, 실행 시간 4분.',
  'acc.bench.k1.l': '30-44(목표 구간)',
  'acc.bench.k1.n': 'MAE — OpenCV(8.66년)보다 우수',
  'acc.bench.k2.l': '전체(18-80)',
  'acc.bench.k2.n': 'MAE — 심층 신경망에는 못 미침',
  'acc.bench.k3.l': '부호 있는 편향',
  'acc.bench.k3.n': '네 엔진 중 가장 중립적',
  'acc.bench.cta': '전체 벤치마크 보기 →',

  'acc.s3.eyebrow': '03 · 색채 측정 표준(기반)',
  'acc.s3.p':
    '바탕이 되는 규격 — 동료 심사 논문이 아니라, 처리 과정에서 실제로 사용되는 기술 사양입니다.',
  'acc.s3.std1': 'sRGB 색공간(감마 디코딩)',
  'acc.s3.std2': 'Rec. 709 RGB 원색',
  'acc.s3.std3': 'XYZ → L*a*b* 변환',
  'acc.s3.std4': 'ITA° 기준 Fitzpatrick 경계값',
  'acc.s3.std5': 'YCbCr 피부 픽셀 검출',
  'acc.s3.std6': '라플라시안 선명도 측정',
  'acc.s3.std7':
    '탄력과 인지 나이의 상관(ITA° 거리와 인지된 탄력 사이 r=0.65)',

  'acc.s4.eyebrow': '04 · 처리 과정',
  'acc.s4.h2': '계산 방법.',
  'acc.st1.t': '이미지 촬영',
  'acc.st1.d':
    '일반 웹캠(720p 이상). 10초 미만 촬영, 8장 채택. face-api.js로 얼굴 검출(68개 특징점). 얼굴 영역 크롭과 조명 보정.',
  'acc.st2.t': '색채 변환',
  'acc.st2.d':
    'sRGB → XYZ → CIE L*a*b* 과정(IEC 61966-2-1, CIE 015:2004). 스캔마다 기준색 6가지로 자가 점검. 픽셀 단위 정밀도.',
  'acc.st3.t': '신호 추출',
  'acc.st3.d':
    'ITA° + Melanin Index + Erythema Index + TEWL 대리 지표 + 정반사 비율. 얼굴 4개 영역(이마, 좌우 볼, T존)을 분석합니다.',
  'acc.st4.t': '바이오마커 변환',
  'acc.st4.d':
    '각 원신호를 동료 심사를 거친 공식(위 인용)으로 0-100 점수로 변환합니다. 상수에는 출처를 명시하거나 경험적임을 표시합니다.',
  'acc.st5.t': '광형 판별',
  'acc.st5.d':
    'ITA°에 따른 Fitzpatrick I-VI 자동 분류(Chardon 1991). 어두운 피부에서의 편향을 피하기 위해 색소 침착 기준값을 광형에 맞춰 조정합니다.',
  'acc.st6.t': '나이 추정 + 구간',
  'acc.st6.d':
    '단일 바이오마커 공식(눈가 주름이 지배적, Bazin 2007). 인지 나이 차이는 나이에 따라 달라집니다(Vierkötter 2012). 구간 ±5년(95 %, 내부 코호트 n=12).',

  'acc.s5.eyebrow': '05 · 피부 나이 · v7 방법',
  'acc.s5.h2a': '인지되는 피부 나이인가,',
  'acc.s5.h2b': '순수한 생물학적 나이인가.',
  'acc.s5.p': '두 개의 수치를 계산하지만 표시하는 것은 하나뿐입니다. 그 이유는 다음과 같습니다.',
  'acc.age.l.tag': '표시 — 피부 나이',
  'acc.age.l.h3': '시각적으로 인지되는 나이',
  'acc.age.l.p':
    '사람이 보았을 때 사회적으로 인지되는 평균 나이. Vierkötter & Krutmann 2012(백인 코호트 약 1,700명)으로 보정했으며, 그 차이는',
  'acc.age.l.pEm': '나이에 따라 달라집니다',
  'acc.age.l.li1': '생물학적 나이 30세 미만 → −2년',
  'acc.age.l.li2': '생물학적 나이 30-45세 → −4년',
  'acc.age.l.li3': '생물학적 나이 45-60세 → −5년',
  'acc.age.l.li4': '생물학적 나이 60세 이상 → −5 ~ −6년',
  'acc.age.l.note':
    'v7은 원 출처에 없던 v6의 광형별 대응을 삭제했습니다. 광형은 생물학적 나이에 영향을 주지만(Diridollou), 사회적 인지에는 영향을 주지 않습니다.',
  'acc.age.r.tag': '내부 — 생물학적 나이',
  'acc.age.r.h3': '순수한 생물학적 나이',
  'acc.age.r.p':
    '지배적인 주름 점수(눈가 주름, Bazin 2007)를 통한 피부의 물리적 상태 직접 추정. 스튜디오 촬영 사진에서 실제 나이와 r=0.78의 상관.',
  'acc.age.r.note1': 'v7 공식:',
  'acc.age.r.note2':
    '계수 0.85(웹캠 JPEG 페널티)는 경험적 보정임을 인정합니다. 대규모 코호트 검증은 2026년 말 예정입니다.',
  'acc.age.prec1': '추정 정확도:',
  'acc.age.prec.bio': '생물학적 나이 ±5년',
  'acc.age.prec.perc': '인지 나이 ±4년',
  'acc.age.prec2': '(내부 코호트 n=12 기준 95 % 신뢰구간)',
  'acc.age.prec3': '외부 검증 n=100은 2026년 말 예정',

  'acc.s6.eyebrow': '06 · 품질에 따른 동작 · v7',
  'acc.s6.h2a': '세 단계의 신뢰도.',
  'acc.s6.h2b': '듣기 좋은 보정은 없습니다.',
  'acc.s6.p':
    'v7은 품질이 낮은 스캔을 인위적으로 젊게 만들던 v6.2 보정(‘엔진이 덜 볼수록 더 칭찬한다’는 역설)을 삭제했습니다. 대신 명시적인 세 단계의 신뢰도를 둡니다.',
  'acc.q1.tag': '품질 < 40',
  'acc.q1.h3': '스캔 거부',
  'acc.q1.p1': '어떠한 추정치도 제공하지 않습니다. 메시지',
  'acc.q1.p2':
    '와 함께 더 좋은 조명에서 다시 스캔할 것을 안내합니다. 추정은 계산되지 않습니다.',
  'acc.q2.tag': '40 ≤ 품질 < 60',
  'acc.q2.h3': '낮은 신뢰도',
  'acc.q2.p1': '추정치는 제공하되 다음과 같이 표시합니다',
  'acc.q2.p2':
    '. 구간은 ±7년으로 넓힙니다(표준은 ±5년). 추정치는 그대로 정직하게 두고 옮기지 않습니다.',
  'acc.q3.tag': '품질 ≥ 60',
  'acc.q3.h3': '표준',
  'acc.q3.p1': '표준 추정치에 다음을 덧붙입니다',
  'acc.q3.p2':
    '. 구간 ±5년(95 %, 내부 코호트 n=12). 조명이 충분한 HD 웹캠에서의 기본 동작입니다.',
  'acc.s6.foot1': 'v6.2 보정 삭제: 품질이 낮은 스캔(품질 < 45)에서 −5년',
  'acc.s6.foot2':
    'v7은 추정치를 옮기는 대신 구간을 넓힙니다(아첨이 아니라 정직)',

  'acc.s7.eyebrow': '07 · 분산 시험',
  'acc.s7.h2': '재현성.',
  'acc.s7.p':
    '시험: 동일 피험자를 서로 다른 열 가지 조명 조건에서 10회 스캔. 점수의 표준편차를 측정. 내부 코호트 n=12.',
  'acc.var1': '주름',
  'acc.var2': '탄력',
  'acc.var3': '색소 침착',
  'acc.var4': '수분',
  'acc.var5': '광채',
  'acc.var6': '모공',
  'acc.var7': '붉은기',
  'acc.var8': '인지 나이',
  'acc.var.unitPts': 'pts/100',
  'acc.var.unitYears': '년',
  'acc.s7.foot1':
    '내부 코호트 · 피험자 n=12, 광형 I-IV · 1인당 10회 스캔 · 가변 조명 · HD 웹캠 720p',
  'acc.s7.foot2':
    '광형 V-VI: Diridollou 2007 기반 외삽 — 전용 코호트 검증은 2026년 말 예정',
  'acc.s7.foot3': '외부 검증 n=100은 2026년 말 예정',

  'acc.s8.eyebrow': '08 · 검증 로드맵',
  'acc.s8.h2a': '우리가 검증하겠다고',
  'acc.s8.h2b': '약속하는 것.',
  'acc.q.late2026': '2026년 말',
  'acc.q.q42026': '2026년 4분기',
  'acc.rd1.t': '외부 코호트 n=100 검증',
  'acc.rd1.b':
    '다양한 피험자 100명(20-75세, 광형 I-VI) 모집. 기준 장비인 Visia / Antera와의 일치도 측정. 방법론 공개.',
  'acc.rd2.t': 'Bazin 형태학적 등급 0-5',
  'acc.rd2.b':
    '이미지에서 Bazin 형태학적 등급(아틀라스 1권 4장)을 추출 — 현재는 기준 나이 40세와 상관 r=0.78만 사용합니다. 주름 깊이 검출과 0-5 분류를 구현합니다.',
  'acc.rd3.t': '광형별 계수(Diridollou + Flament)',
  'acc.rd3.b':
    'Diridollou 2007과 Flament 2023에서 주름 / 탄력 / 색소 침착의 광형별 계수를 추출합니다. v7은 현재 광형 IV-VI의 생물학적 나이에 −4 % ~ −8 %의 완만한 보정을 적용합니다. 목표는 출처 계수에 따른 광형별 완전한 대응입니다.',
  'acc.rd4.t': '동료 심사 논문 발표',
  'acc.rd4.b':
    'VYVRE의 처리 과정(일반 웹캠 → CIE L*a*b* 바이오마커 → 나이 추정)을 기술하고 n=100 코호트로 검증한 방법론 논문을 투고합니다. 목표 학술지: Int J Cosmet Sci 또는 Skin Res Technol.',

  'acc.s9.eyebrow': '09 · 한계',
  'acc.s9.h2a': 'VYVRE가',
  'acc.s9.h2b': '하지 않는 것.',
  'acc.s9.p':
    '엔진이 측정하지 못하는 것에 대해서는 꿈을 파는 대신 철저히 정직하고자 합니다.',
  'acc.lim1.t': 'VYVRE는 의료기기가 아닙니다',
  'acc.lim1.b':
    '엔진은 어떠한 의학적 진단도 내리지 않습니다. 피부 질환(피부암, 흑색종, 피부염, 건선 등)을 검출하지 않습니다. 의학적으로 염려되는 점이 있다면 피부과 전문의와 상담하십시오.',
  'acc.lim2.t': '일반 웹캠은 전문 스캐너가 아닙니다',
  'acc.lim2.b':
    '전문 피부과 스캐너는 편광, UV 형광, 3D 센서를 사용합니다. VYVRE는 일반 웹캠과 통제되지 않은 조명에 의존합니다. 분산 ±8 %(진료실에서는 ±2 %).',
  'acc.lim3.t': '주름의 3D 검출은 하지 않습니다',
  'acc.lim3.b':
    '주름의 실제 깊이를 재려면 입체 센서가 필요합니다. VYVRE는 그림자의 색채 분석으로 정도를 추정합니다(2D 접근). 뚜렷한 주름에는 신뢰할 만하지만, 이제 생기는 잔주름에서는 정밀도가 떨어집니다.',
  'acc.lim4.t': '깊은 색소 침착은 검출되지 않습니다',
  'acc.lim4.b':
    '표피 아래 색소 반점(깊은 기미, 오래된 일광 흑자)은 가시광선에서는 보이지 않습니다. UV 형광 카메라가 필요합니다(포함되지 않음).',
  'acc.lim5.t': '광형 V-VI: 외삽임을 인정합니다',
  'acc.lim5.b':
    '내부 코호트 n=12는 주로 광형 I-IV로 이루어져 있습니다. V-VI를 위한 보정은 Diridollou 2007 데이터에서 외삽한 것입니다(생물학적 나이에 −4 % ~ −8 %). 전용 코호트 검증은 2026년 말 예정입니다.',
  'acc.lim6.t': '메이크업, 안경, 마스크',
  'acc.lim6.b':
    '엔진은 이러한 가림을 감지하고 품질 점수를 낮춥니다. 품질이 너무 낮으면(40 미만) 스캔을 거부합니다. 40에서 60 사이에서는 낮은 신뢰도를 명시하고 구간을 넓혀 결과를 제공합니다.',
  'acc.lim7.t': '내부 코호트 n=12는 작습니다 — 이를 인정합니다',
  'acc.lim7.b':
    '경험적 계수(웹캠 JPEG 페널티, 구간 폭)는 12명을 기준으로 보정되었습니다. 임상 코호트가 아니라 테스트 그룹입니다. 외부 검증 n=100은 2026년 말 로드맵에 올라 있습니다.',

  'acc.s10.eyebrow': '10 · 추가 모듈 · 피부 상태(v1 참고용)',
  'acc.s10.h2a': '네 가지 상태의 시각적 검출',
  'acc.s10.h2b': '참고일 뿐, 의학적 판단이 아닙니다.',
  'acc.s10.p1': '별도 모듈',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — 어떤 데모에서도 선택적으로 불러올 수 있습니다. 이미지 휴리스틱으로 흔한 네 가지 시각적 상태를 검출하고, 처방이 아닌 맞춤 화장품 루틴을 제안합니다.',
  'acc.s10.p3': '이 모듈은 어떠한 의학적 진단도 내리지 않습니다.',
  'acc.cond.sens': '민감도',
  'acc.cond.spec': '특이도',
  'acc.cond.cohort': '합성 코호트 n=12',
  'acc.cond1.a': '모듈 · 여드름',
  'acc.cond1.t': '국소적인 CIELAB a* 홍반 + 텍스처 L* 분산',
  'acc.cond1.c':
    'T존(이마, 코, 턱)에 점 형태로 집중된 홍반 픽셀 검출. 출력: 확률 + 중증도(매우 경미, 경미, 중간, 높음).',
  'acc.cond2.a': '모듈 · 주사',
  'acc.cond2.t': '볼과 코의 a* 중앙값이 기준선을 초과하는 정도 + 좌우 대칭성',
  'acc.cond2.c':
    '볼과 코에 지속되는 양측성 홍반. 볼 사이의 대칭성이 점수에 가중치를 줍니다(주사는 양측성입니다).',
  'acc.cond3.a': '모듈 · 기미',
  'acc.cond3.t': '이마와 윗입술의 ΔL*와 볼 L* 상위 사분위 비교 + Δb*(멜라닌)',
  'acc.cond3.c':
    '얼굴 중앙부(이마, 윗입술, 광대)의 좌우 대칭 색소 침착. 확산형 기미와 뚜렷한 반점을 구분합니다.',
  'acc.cond4.a': '모듈 · 일광 흑자',
  'acc.cond4.t': '반점 검출(크기 5-200 px², 조밀도 ≥ 0.45)',
  'acc.cond4.c':
    '볼과 이마에 나타나는 윤곽이 뚜렷한 고립 색소 반점. 해당 반점 수를 피부 면적에 대비해 나타냅니다(1,000픽셀당 밀도).',
  'acc.s10.why.t': '신경망이 아니라 휴리스틱을 쓰는 이유',
  'acc.s10.why1':
    'ISIC / DermNet 데이터셋은 편광 조명 아래 병변을 중심으로 찍은 임상 근접 촬영 이미지로 이루어져 있습니다. 통제되지 않은 조명에서 50 cm 떨어진 일반 웹캠과는 분포가 크게 달라, 그 위에서 학습한 모델은 VYVRE 전용 코호트로 재학습하지 않으면 잘 전이되지 않습니다.',
  'acc.s10.why2':
    '휴리스틱은 한 줄씩 감사할 수 있지만, 불투명한 모델은 그렇지 않습니다. 대형 메종이 요구하는 설명 가능성 요건에도 부합합니다.',
  'acc.s10.why3':
    '내려받을 모델이 없고(0 Mo), 그래픽 처리 장치도 필요 없으며, 모든 브라우저에서 200 ms 미만으로 동작합니다.',
  'acc.s10.why4a': '안정적인 아키텍처: v2에서는 같은 인터페이스 뒤에 학습된 모델로 대체할 수 있습니다',
  'acc.s10.why4b': '기존 연동을 깨뜨리지 않고.',
  'acc.s10.disc.t': '의학적 고지(모든 표시에 필수)',
  'acc.s10.disc.b':
    '이 모듈은 의료기기가 아닙니다. 어떠한 진단도 내리지 않습니다. 반환되는 확률은 주의가 필요한 부위를 알리는 지표이며, 맞춤 화장품 루틴을 제안하기 위한 것입니다. 피부에 실제로 염려되는 점이 있다면 피부과 전문의와 상담하십시오.',
  'acc.s10.cta1': '피부 상태 데모 보기 →',
  'acc.s10.cta2': '모듈 소스 코드',

  'acc.s11.eyebrow': '11 · 품질 안전장치 · 정직함의 약속',
  'acc.s11.h2a': '거짓된 정밀함보다',
  'acc.s11.h2b': '정직함을.',
  'acc.s11.p1':
    'v7.0은 사용자를 인위적으로 기쁘게 하던 v6.2 보정을 삭제했습니다. 품질이 낮은 웹캠에서의 숨은 5년 젊어짐, 80세 피험자를 50세로 되돌리던 상한 [20, 50], 출처에 없는 임의의 광형별 대응입니다.',
  'acc.s11.p2':
    '사용자의 실제 피부가 피부과 전문의가 보기에 38세라면, 엔진은 38이라고 말해야 합니다. 28이 아니라(아첨하는 거짓말). 44도 아니라(거짓된 가혹함). 진짜 추정치를.',

  'acc.cta.h2a': '기술적인 질문이 있으신가요?',
  'acc.cta.h2b': 'DPA 전문을 요청하십시오.',
  'acc.cta.p':
    'DPO, 자문 피부과 전문의, R&D 팀에는 요청에 따라 DPA, 상세 방법론, 정확도 보고서, 감사받은 엔진 소스 코드를 보내 드립니다.',
  'acc.cta.1': '자료 요청하기 →',
  'acc.cta.2': '← 돌아가기',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': '요금 · VYVRE',
  'pri.meta.desc':
    '프랑스에서 호스팅되는 측정 기반 피부 진단. Pilot 무료, Starter 월 299 €, Growth 월 499 €, Enterprise 월 699 €부터.',

  'pri.banner1': '{brand} 데모를 방금 체험하셨습니다',
  'pri.banner2': '— 플랜을 선택하시면 귀사 사이트에서 활성화할 수 있습니다.',

  'pri.hero.eyebrow': '요금 · VYVRE Business',
  'pri.hero.h1a': '가격은',
  'pri.hero.h1b': '이 페이지에 있습니다.',
  'pri.hero.p': '프랑스 호스팅 · GDPR 기본 준수 · 사진 미보관',

  'pri.toggle.monthly': '월간',
  'pri.toggle.annual': '연간',
  'pri.theme.label': '위젯 테마',
  'pri.theme.dark': '블랙',
  'pri.theme.light': '화이트',
  'pri.theme.note': '진단은 이 테마로 표시됩니다 · 이후 변경 가능',

  'pri.card.plan': '플랜',
  'pri.card.recommended': '추천',
  'pri.per.month': '/월',

  'pri.pilot.price': '무료',
  'pri.pilot.sub': '30일 · 약정 없음',
  'pri.pilot.f1': '월 1,000회 스캔',
  'pri.pilot.f2': 'Web SDK',
  'pri.pilot.f3': 'VYVRE 표기',
  'pri.pilot.f4': '48시간 이내 이메일 지원',
  'pri.pilot.f5': '프랑스 인프라',
  'pri.pilot.cta': '무료로 시작하기',

  'pri.starter.subA': '2 990 € / 년 · 2개월 무료',
  'pri.starter.subM': '월 5,000회 스캔',
  'pri.starter.f1': '월 5,000회 스캔',
  'pri.starter.f2': '추가 스캔 1회당 0,02 €',
  'pri.starter.f3': 'Web + iOS + Android SDK',
  'pri.starter.f4': '완전한 화이트 라벨',
  'pri.starter.f5': 'SLA 99.9 % · 우선 지원',
  'pri.starter.cta': '무료 체험 시작하기',

  'pri.growth.subA': '4 990 € / 년 · 2개월 무료',
  'pri.growth.subM': '월 15,000회 스캔',
  'pri.growth.f1': '월 15,000회 스캔',
  'pri.growth.f2': '추가 스캔 1회당 0,015 €',
  'pri.growth.f3': 'Starter의 모든 기능, 그리고:',
  'pri.growth.f4': '멀티 브랜드(최대 5개)',
  'pri.growth.f5': '전담 어카운트 매니저',
  'pri.growth.cta': 'Growth 선택',

  'pri.ent.subA': '시작가 · 맞춤 계약',
  'pri.ent.subM': '시작가 · 약정 없음',
  'pri.ent.f1': '월 25,000회 스캔',
  'pri.ent.f2': '추가 스캔 1회당 0,01 €',
  'pri.ent.f3': '매장 수 무제한',
  'pri.ent.f4': '네이티브 모바일 앱',
  'pri.ent.f5': 'SLA 99.99 % · 연중무휴 24시간 대기',
  'pri.ent.cta': '문의하기',

  'pri.trust': '요금 공개 · 부가세 별도 · 언제든 해지 가능',

  'pri.args.eyebrow': '선택하는 이유',
  'pri.args.h2a': '왜 다른 곳이 아니라',
  'pri.args.h2b': 'VYVRE인가?',
  'pri.arg1.e': 'Made in France',
  'pri.arg1.t': '완전히 프랑스에서 만든 유일한 피부 진단 모듈',
  'pri.arg1.b': '프랑스 내 인프라, 파리의 팀, 체결된 DPA.',
  'pri.arg1.n': '비슷한 솔루션들은 유럽연합 밖에서 호스팅됩니다.',
  'pri.arg2.e': '청구액 −90 %',
  'pri.arg2.t1': '경쟁사보다 최대 10배',
  'pri.arg2.t2': '저렴합니다',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': '월 299 €부터',
  'pri.arg2.b3':
    '(연 3 588 €). SkinConsult AI는 연 약 50 000 € + 도입비 30 000 €부터, Perfect Corp은 연 약 30 000 €부터입니다.',
  'pri.arg2.n': '자세한 비교표는 이 페이지 아래에 있습니다.',
  'pri.arg3.e': '48시간 내 활성화',
  'pri.arg3.t': '결제 후 연동 코드를 보내 드립니다',
  'pri.arg3.b1': '귀사 사이트에',
  'pri.arg3.b2': '를 붙이면 바로 공개됩니다.',
  'pri.arg3.n': '킥오프 회의도, 외부 통합 업체 비용도 없습니다.',
  'pri.arg4.e': '약정 없음',
  'pri.arg4.t': '한 번의 클릭으로 해지',
  'pri.arg4.b':
    '하위 또는 상위 플랜으로의 변경도, 해지도 대시보드에서 하실 수 있습니다. 계약상 잠금도 위약금도 없습니다.',
  'pri.arg4.n': '모든 스캔 데이터를 내보내 보관하실 수 있습니다.',
  'pri.arg5.e': '완전한 화이트 라벨',
  'pri.arg5.t': '우리 브랜드가 아니라 귀사 브랜드로',
  'pri.arg5.b':
    '로고, 색상, 서체, 추천 제품 — 모두 귀사의 브랜드 가이드에 맞춰집니다.',
  'pri.arg5.n': 'Starter 플랜부터 ‘Powered by VYVRE’ 표기 의무가 없습니다.',
  'pri.arg6.e': '동료 심사를 거친 과학',
  'pri.arg6.t': '시뮬레이션이 아니라 측정',
  'pri.arg6.b':
    'CIE L*a*b* 색채 측정, 얼굴 특징점 68개, 피부과학 문헌에서 도출한 지표.',
  'pri.arg6.n': '참고문헌: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': '시장 비교 · 2025년 공개 가격',
  'pri.tbl.h1': '솔루션',
  'pri.tbl.h2': '연간 요금(입문)',
  'pri.tbl.h3': '도입 / 연동',
  'pri.tbl.h4': '호스팅',
  'pri.tbl.h5': '활성화',
  'pri.tbl.from': '최소',
  'pri.tbl.month': '/월',
  'pri.tbl.year': '/년',
  'pri.tbl.fromApprox': '최소',
  'pri.tbl.onQuote': '견적 문의',
  'pri.tbl.france': '프랑스',
  'pri.tbl.w812': '8-12주',
  'pri.tbl.w12': '12주 이상',
  'pri.tbl.w68': '6-8주',
  'pri.tbl.note':
    '경쟁사 요금: 공개적으로 확인된 대략적인 수준입니다(2024-2025년 화장품 브랜드 입찰 기준).',

  'pri.del.eyebrow': '도입 · 결제되는 순간부터',
  'pri.del.h2a': 'Stripe 결제가 확인되는 순간',
  'pri.del.h2b': '받으시는 것.',
  'pri.del1.t': '환영 이메일',
  'pri.del1.b': '전용 관리 링크와 접속 정보를 함께 보내 드립니다.',
  'pri.del2.t': '붙여 넣기만 하면 되는 연동 코드',
  'pri.del3.t': '미리 채워진 제품 카탈로그',
  'pri.del3.b':
    '귀사 사이트에서 가져온 제품 30~60개가 이미 바이오마커와 연결되어 있습니다.',
  'pri.del4.t': '귀사 브랜드에 맞춘 디자인',
  'pri.del4.b':
    '로고, 색상 팔레트, 브랜드명이 모듈과 대시보드에 적용됩니다.',
  'pri.del5.t': '분석 대시보드',
  'pri.del5.b':
    '일별 스캔 수, 전환율, 평균 바이오마커, 가장 많이 추천된 제품.',
  'pri.del6.t': 'GDPR 전체 내보내기',
  'pri.del6.b':
    '모든 스캔 데이터는 귀사의 것이며 언제든 CSV로 내보낼 수 있습니다.',

  'pri.faq.eyebrow': '자주 묻는 질문',
  'pri.faq.h2a': '알고 싶으신',
  'pri.faq.h2b': '모든 것.',
  'pri.faq1.q': '스캔 한도를 초과하면 어떻게 되나요?',
  'pri.faq1.a':
    '서비스는 계속됩니다. 초과분은 플랜에 따라 스캔 1회당 0,01 € ~ 0,02 €로 다음 달 청구서에 반영됩니다.',
  'pri.faq2.q': '이용자 데이터는 어디에 저장되나요?',
  'pri.faq2.a':
    '오직 프랑스에만 저장됩니다. 사진은 보관하지 않으며 유럽연합 밖으로 이전하지 않습니다. DPA 체결.',
  'pri.faq3.q': '중간에 플랜을 바꿀 수 있나요?',
  'pri.faq3.a':
    '네, 대시보드에서 언제든 가능합니다. 상위 플랜으로는 일할 계산으로 즉시, 하위 플랜으로는 다음 달부터 적용됩니다.',
  'pri.faq4.q': '기술 지원 수준은 어떻게 되나요?',
  'pri.faq4.a':
    '모든 플랜에서 48시간 이내 이메일 지원. Growth부터는 전담 어카운트 매니저의 우선 지원이 제공됩니다.',
  'pri.faq5.q': '추천 제품을 설정할 수 있나요?',
  'pri.faq5.a':
    '네. 카탈로그는 전부 수정할 수 있으며, 대시보드에서 제품을 추가하거나 삭제하고 변경하실 수 있습니다.',

  'pri.cal.eyebrow': '아직 결정이 어려우신가요?',
  'pri.cal.h2': '20분 데모를 예약하세요',
  'pri.cal.p':
    '창업자 Charles가 화상으로 모듈을 보여 드리고 기술과 계약에 관한 질문에 모두 답해 드립니다.',
  'pri.cal.cta': '20분 예약하기 →',

  /* ─────────── pages légales ─────────── */
  'legal.notice.t': '프랑스어본이 정본입니다',
  'legal.notice.b':
    '아래 본문은 의도적으로 프랑스어로 두었습니다. 계약적 효력을 갖는 것은 프랑스어본뿐입니다. 제목은 읽기 편하도록 번역했습니다. 참고용 번역이 필요하시면 charles@symphonydrive.com으로 요청하실 수 있습니다.',
  'legal.updated': '최종 수정:',
  'legal.version': '버전 1.0 —',

  'cgv.meta.title': '판매 약관 · VYVRE',
  'cgv.meta.desc':
    'VYVRE Business 판매 약관 — 화장품 브랜드를 위한 B2B SaaS 구독.',
  'cgv.eyebrow': '판매 약관',
  'cgv.h1': '판매 약관.',
  'cgv.a1': '제1조 — 목적',
  'cgv.a2': '제2조 — 신청과 활성화',
  'cgv.a3': '제3조 — 요금',
  'cgv.a4': '제4조 — 결제 방법',
  'cgv.a5': '제5조 — 기간과 해지',
  'cgv.a6': '제6조 — 서비스 수준 약정(SLA)',
  'cgv.a7': '제7조 — 데이터의 소유권',
  'cgv.a8': '제8조 — 책임의 제한',
  'cgv.a9': '제9조 — 비밀 유지와 GDPR',
  'cgv.a10': '제10조 — 준거법과 관할',

  'conf.meta.title': '개인정보 처리방침 · VYVRE',
  'conf.meta.desc':
    'VYVRE의 개인정보 처리방침과 개인정보 보호. GDPR 준수.',
  'conf.eyebrow': '데이터 보호 · GDPR',
  'conf.h1': '개인정보.',
  'conf.b1': '개인정보 처리자',
  'conf.b2': '피부 스캔으로 수집되는 데이터',
  'conf.b3': '데이터 호스팅',
  'conf.b4': '웹사이트에서 수집되는 데이터',
  'conf.b5': '구매 시 수집되는 데이터',
  'conf.b6': '처리의 법적 근거',
  'conf.b7': '보관 기간',
  'conf.b8': 'GDPR에 따른 이용자의 권리',
  'conf.b9': 'DPA(데이터 처리 계약)',

  'ml.meta.title': '법적 고지 · VYVRE',
  'ml.meta.desc': 'VYVRE / Symphony Drive SAS의 법적 고지.',
  'ml.eyebrow': '법적 정보',
  'ml.h1': '법적 고지.',
  'ml.b1': '사이트 발행인',
  'ml.b2': '발행 책임자',
  'ml.b3': '호스팅',
  'ml.b4': '지식재산권',
  'ml.b5': '책임의 제한',
  'ml.b6': '하이퍼링크',
  'ml.b7': '준거법',

  'dpa.meta.title': 'DPA · 데이터 처리 계약 · VYVRE',
  'dpa.meta.desc':
    'VYVRE와 B2B 고객 간의 데이터 처리 계약(GDPR 제28조).',
  'dpa.eyebrow': 'GDPR 제28조 · 수탁처리자',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. 당사자',
  'dpa.b2': '2. 처리의 목적',
  'dpa.b3': '3. 처리하는 데이터의 유형',
  'dpa.b4': '4. 정보주체의 유형',
  'dpa.b5': '5. 처리 기간',
  'dpa.b6': '6. 수탁처리자의 의무',
  'dpa.b7': '7. 보안 조치(GDPR 제32조)',
  'dpa.b8': '8. 재위탁처리자',
  'dpa.b9': '9. 유럽연합 밖으로의 이전',
  'dpa.b10': '10. 감사와 점검',
  'dpa.b11': '11. 데이터 유출 통지',
  'dpa.b12': '12. 데이터의 반환과 삭제',
} as const;

export default ko;
