/**
 * VYVRE — dictionnaire chinois simplifié des pages Next (marques, accuracy, pricing, légal).
 *
 * Le français est la source : toute clé ajoutée ici doit l'être dans les onze
 * autres fichiers de /lib/i18n/dict. Ce qui ne se traduit jamais reste dans le
 * JSX : noms de marques, « VYVRE », « skin intelligence », titres de papiers
 * scientifiques, noms de revues, extraits de code, chiffres et prix en euros.
 */

const zh = {
  /* ─────────── commun : en-tête, pied de page, sélecteur ─────────── */
  'lang.aria': '选择语言',
  'nav.manifeste': '宣言',
  'nav.method': '方法',
  'nav.demo': '试用扫描',
  'nav.pricing': '价格',

  'footer.city': 'VYVRE · 巴黎',
  'footer.cityFull': 'VYVRE · 法国巴黎',
  'footer.book': '预约 20 分钟 →',
  'footer.manifeste': '宣言',
  'footer.method': '方法论',
  'footer.cgv': '销售条款',
  'footer.legal': '法律声明',
  'footer.privacy': '隐私',
  'footer.privacyGdpr': '隐私 · GDPR',
  'footer.dpa': 'DPA',
  'footer.contact': '联系',
  'footer.home': '首页',
  'footer.rights': '版权所有',
  'footer.company': '注册资本 1,000 € 的 SAS · 法国巴黎 · SIREN 登记中',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — 可测量的肌肤诊断，为护肤品牌而生',
  'home.meta.desc':
    '唯一公开标价的肌肤诊断。基础设施位于法国，原生符合 GDPR，在设备端处理，不上传任何照片。',

  'home.hero.eyebrow': '可测量的肌肤诊断',
  'home.hero.h1a': '贵品牌专属的',
  'home.hero.h1b': '肌肤诊断。',
  'home.hero.p':
    '不到十秒的摄像。逐像素读取的八项测量。一套仅取自贵方目录的护肤方案。',
  'home.hero.cta1': '试用扫描',
  'home.hero.cta2': '为我的品牌配置',

  'home.stat1': '肌肤测量',
  'home.stat2': '扫描时长',
  'home.stat3': '上线',
  'home.stat4': '照片留存',

  'home.man.h2a': '测量得出，',
  'home.man.h2b': '而非猜测。',
  'home.man.p':
    '引擎将面部的每个区域转换为 CIE L*a*b* 坐标，再换算为皮肤学指数。不是依据滤镜作出的估计：这是一次可重复、有据可查的光学读取。',
  'home.man.link': '阅读方法论 →',

  'home.mes.h2a': '八项测量。',
  'home.mes.h2b': '一次读取。',
  'home.mes.1.n': '肤色',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': '光泽',
  'home.mes.2.u': 'L* 明度',
  'home.mes.3.n': '泛红',
  'home.mes.3.u': '红斑指数',
  'home.mes.4.n': '均匀度',
  'home.mes.4.u': '色度标准差',
  'home.mes.5.n': '肌理',
  'home.mes.5.u': '局部微对比度',
  'home.mes.6.n': '毛孔',
  'home.mes.6.u': '极小值密度',
  'home.mes.7.n': '油脂',
  'home.mes.7.u': '镜面反射',
  'home.mes.8.n': '水润度',
  'home.mes.8.u': '光学 TEWL 代理指标',

  'home.steps.h2a': '三个步骤。',
  'home.steps.h2b': '零阻力。',
  'home.step1.t': '顾客完成扫描',
  'home.step1.d':
    '手机或柜台顾问终端的摄像头。无需安装，无需上传：图像经处理后即被删除。',
  'home.step2.t': '引擎生成方案',
  'home.step2.d':
    '一套源自贵方目录的早晚护肤方案，按测量结果与您的商业优先级排序。',
  'home.step3.t': '您正式上线',
  'home.step3.d':
    '在您的网站加入一行脚本，采用您的色彩与字体。您这边无需投入任何开发人员。',

  'home.groupe.eyebrow': '面向集团',
  'home.groupe.h2a': '一个集团，十个品牌，',
  'home.groupe.h2b': '同一个引擎。',
  'home.socle1.t': '多品牌',
  'home.socle1.d':
    '每个品牌一个独立空间：目录、视觉规范、推荐规则与统计数据各自分开。',
  'home.socle2.t': '数据主权',
  'home.socle2.d':
    '法国托管，原生符合 GDPR，签署 DPA，不保存任何图像，无第三方追踪像素。',
  'home.socle3.t': '门店与电商',
  'home.socle3.d':
    '同一引擎既用于柜台平板，也用于商品页面，共用同一套测量基准。',

  'home.price.h2a': '299 €/月起。',
  'home.price.h2b': '价格公开。',
  'home.price.cta': '查看方案',

  'home.faq.h2': '问题。',
  'home.faq1.q': '我的产品目录如何进入引擎？',
  'home.faq1.a':
    '通过 CSV 数据流或贵方电商平台的 API（Shopify、Salesforce Commerce、Centra）。无需管理员权限，每晚同步一次。',
  'home.faq2.q': '顾客的图像会怎样？',
  'home.faq2.a':
    '图像在内存中完成分析后即被删除：不存储也不传输任何照片。法国托管，可提供 DPA。',
  'home.faq3.q': '引擎会推荐竞争对手的产品吗？',
  'home.faq3.a':
    '不会。方案仅在贵方目录中生成，并遵循您设定的优先级。',
  'home.faq4.q': '需要什么设备？',
  'home.faq4.a':
    '一个 720p 摄像头即可，手机和电脑皆可。较新的传感器能让结果更为细致。',

  'home.cta.h2': '在您的目录上看看这个扫描。',
  'home.cta.1': '启动演示',
  'home.cta.2': '预约演示',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': '方法论与精度 · VYVRE',
  'acc.meta.desc':
    '同行评审来源（引用 5 篇，路线图 4 篇）、计算方法、置信区间、局限。VYVRE 引擎背后的科学透明度。',

  'acc.hero.eyebrow': '方法论 · 来源 · 局限',
  'acc.hero.h1a': '扫描背后的',
  'acc.hero.h1b': '科学依据。',
  'acc.hero.p':
    '从图像中读取的八项测量。此处说明：科学来源、计算方法、置信区间以及引擎的局限。',
  'acc.hero.note1':
    '估计精度 ±5 岁生物学年龄 · ±4 岁感知年龄（95% 置信区间 · 内部队列 n=12）',
  'acc.hero.note2':
    'n=100 外部验证计划于 2026 年底 · 2026 年 5 月内部审核后重做',

  'acc.s1.eyebrow': '01 · 文献 · 已应用来源',
  'acc.s1.h2a': '5 项同行评审来源',
  'acc.s1.h2b': '以及引擎实际采用的部分。',
  'acc.s1.p1': '这 5 篇文献各自为引擎提供的内容，可在代码中核对（见',
  'acc.s1.p2': '，函数',
  'acc.s1.p3': '和',
  'acc.s1.p4': '）。自 2026 年 10 月起，八项测量均不依赖肤色或图像亮度：每项测量都在同一张图像上将皮肤与其自身比较。',
  'acc.s1.foot1': '引擎 v10.13 — 相对测量，2026 年 10 月',
  'acc.s1.foot2': '已应用来源可逐行核对于',

  'acc.src1.c':
    'ITA°（个体类型角）—— Fitzpatrick I-VI 光型自动判定的基础',
  'acc.src2.c':
    '黑色素指数和红斑指数仅作参考计算。泛红以脸颊的 a*（CIE L*a*b*）读取；色斑相对于本人的肤色测量（比自身皮肤暗 10 % 的区域）。',
  'acc.src3.c':
    '旧指标 σL*（水润与毛孔）已于 2026 年 10 月取消：它主要读取的是面部起伏的阴影。水润：脸颊最细的微纹理（不含毛孔），相对于皮肤自身亮度。毛孔：从周围肤质中凸显出来的小暗点。',
  'acc.src4.c':
    '镜面反光 → 皮脂，阈值相对于脸颊皮肤亮度。光泽不再读取原始亮度：颧骨和额头光线的均匀度、颧骨柔和的光泽，均相对于本人皮肤。',
  'acc.src5.c':
    '感知年龄与生物学年龄之差（高加索人群队列约 1,700 名受试者）。v7：差值随年龄变化（按生物学年龄为 −2 至 −6 岁），与光型无关。',

  'acc.s2.eyebrow': '02 · 文献 · 2026 年底路线图',
  'acc.s2.h2a': '4 项已引用来源',
  'acc.s2.h2b': '尚未完全应用。',
  'acc.s2.p':
    '这些来源出于透明与公开路线图的考虑而列出。其完整系数尚未纳入计算公式 —— 提取与验证计划于 2026 年底与一位皮肤科医生合作完成。',
  'acc.rm.appliedLabel': '部分应用：',
  'acc.rm.roadmapLabel': '路线图：',
  'acc.rm1.a':
    '锚定年龄 40（成人队列中位数）+ 眶周皱纹与年龄的相关性 r=0.78',
  'acc.rm1.r':
    '图像提取 → 形态学分级 0-5（Bazin 量表）尚未实现。计划于 2026 年底完成。',
  'acc.rm2.a': '对 IV-VI 光型的生物学年龄作 −4% 至 −8% 的温和调整',
  'acc.rm2.r':
    '按光型区分的皱纹 / 紧致度 / 色素沉着完整系数尚未提取。',
  'acc.rm3.a': '为多族裔背景而引用',
  'acc.rm3.r':
    '专属系数尚未提取。多族裔队列验证计划于 2026 年底进行。',
  'acc.rm4.a': '引用 TEWL 临床标准（健康 ≤ 15 g/m²/h，受损 ≥ 25）',
  'acc.rm4.r':
    'σL* → TEWL 的数值计算遵循 Stamatas 2011（而非 Akdeniz）。交叉验证已列入计划。',

  'acc.bench.eyebrow': '公开基准 · UTKFace · 2026 年 5 月 26 日',
  'acc.bench.h2a': '公开对比',
  'acc.bench.h2b': '3 个开源参照。',
  'acc.bench.p':
    'VYVRE v7.0 在 300 张 UTKFace 公开人脸（按 18-80 岁分层）上与 DeepFace、InsightFace 及 OpenCV DNN 同场测试。结论原样公布，代码可复现，5 个脚本，运行 4 分钟。',
  'acc.bench.k1.l': '30-44（目标）',
  'acc.bench.k1.n': 'MAE —— 优于 OpenCV（8.66 岁）',
  'acc.bench.k2.l': '整体（18-80）',
  'acc.bench.k2.n': 'MAE —— 落后于深度网络',
  'acc.bench.k3.l': '有符号偏差',
  'acc.bench.k3.n': '四款引擎中最中性',
  'acc.bench.cta': '查看完整基准 →',

  'acc.s3.eyebrow': '03 · 色度标准（基础）',
  'acc.s3.p':
    '底层规范标准 —— 并非同行评审论文，而是处理链中实际生效的技术规范。',
  'acc.s3.std1': 'sRGB 色彩空间（伽马解码）',
  'acc.s3.std2': 'Rec. 709 RGB 原色',
  'acc.s3.std3': 'XYZ → L*a*b* 转换',
  'acc.s3.std4': '按 ITA° 划分的 Fitzpatrick 界限',
  'acc.s3.std5': 'YCbCr 皮肤像素检测',
  'acc.s3.std6': '拉普拉斯清晰度测量',
  'acc.s3.std7':
    '已不再使用：自 2026 年 10 月起，紧致度不再依赖肤色（鼻唇沟的起伏、下半脸轮廓、嘴角）。',

  'acc.s4.eyebrow': '04 · 处理链',
  'acc.s4.h2': '计算方法。',
  'acc.st1.t': '图像采集',
  'acc.st1.d':
    '标准摄像头（≥ 720p）。采集不足 10 秒，保留 8 帧。由 face-api.js 检测人脸（68 个特征点）。裁剪面部区域并校正光照。',
  'acc.st2.t': '色度转换',
  'acc.st2.d':
    'sRGB → XYZ → CIE L*a*b* 转换链（IEC 61966-2-1、CIE 015:2004）。每次扫描对 6 种参考色自检。像素级精度。',
  'acc.st3.t': '信号提取',
  'acc.st3.d':
    '颜色（L*a*b*：肤型用 ITA°，泛红用 a*）、反光（皮脂）以及相对纹理：小暗点（毛孔）、微纹理（水润）、眼角和额头的褶皱（皱纹）、鼻唇沟和下半脸（紧致度）、光线均匀度（光泽）。脸颊、鼻子、额头、眼周。',
  'acc.st4.t': '转换为生物标志物',
  'acc.st4.d':
    '每个信号都是同一张图像上皮肤相对于自身的偏差：绝不是肤色或绝对亮度。通过命名常数换算为 0-100 分（常数基于测试照片调整，并如实标注）；无法读取的测量给出中性分数并加以标注。',
  'acc.st5.t': '光型判定',
  'acc.st5.d':
    '按 ITA° 进行 Fitzpatrick I-VI 分型（Chardon 1991），仅供参考显示。八项测量均不使用肤型或肤色。',
  'acc.st6.t': '年龄估算 + 区间',
  'acc.st6.d':
    '不显示年龄：各项测量的组合尚不能可靠地反映真实年龄。只有在已知年龄的面孔上完成验证后才会显示。',

  'acc.s5.eyebrow': '05 · 肌肤年龄 · v7 方法',
  'acc.s5.h2a': '感知肌肤年龄',
  'acc.s5.h2b': '还是原始生物学年龄。',
  'acc.s5.p': '系统计算两个数字，只显示其中一个。原因如下。',
  'acc.age.l.tag': '显示 —— 肌肤年龄',
  'acc.age.l.h3': '视觉感知年龄',
  'acc.age.l.p':
    '人类观察者在社交场合感知到的平均年龄。依据 Vierkötter & Krutmann 2012（高加索人群队列约 1,700 名受试者）校准，其差值',
  'acc.age.l.pEm': '随年龄变化',
  'acc.age.l.li1': '生物学年龄 < 30 岁 → −2 岁',
  'acc.age.l.li2': '生物学年龄 30-45 岁 → −4 岁',
  'acc.age.l.li3': '生物学年龄 45-60 岁 → −5 岁',
  'acc.age.l.li4': '生物学年龄 60 岁及以上 → −5 至 −6 岁',
  'acc.age.l.note':
    'v7 取消了 v6 中按光型的对应关系，该关系在原始来源中并不存在。光型影响的是生物学年龄（Diridollou），而非社会感知。',
  'acc.age.r.tag': '内部 —— 生物学年龄',
  'acc.age.r.h3': '原始生物学年龄',
  'acc.age.r.p':
    '通过主导皱纹评分（眶周皱纹，Bazin 2007）直接估计肌肤的物理状态。在影棚照片上与实际年龄的相关性 r=0.78。',
  'acc.age.r.note1': 'v7 公式：',
  'acc.age.r.note2':
    '0.85 这一系数（JPEG 摄像头惩罚项）是一项明确承认的经验补偿；计划于 2026 年底在更大队列上验证。',
  'acc.age.prec1': '估计精度：',
  'acc.age.prec.bio': '±5 岁生物学年龄',
  'acc.age.prec.perc': '±4 岁感知年龄',
  'acc.age.prec2': '（95% 置信区间，内部队列 n=12）',
  'acc.age.prec3': 'n=100 外部验证计划于 2026 年底',

  'acc.s6.eyebrow': '06 · 按质量分级的行为 · v7',
  'acc.s6.h2a': '3 个置信等级。',
  'acc.s6.h2b': '绝不美化修饰。',
  'acc.s6.p':
    'v7 取消了 v6.2 的修正项，它会人为让质量较差的扫描显得更年轻（「引擎看得越少，说得越好听」的悖论）。取而代之的是 3 个明确的置信等级。',
  'acc.q1.tag': '质量 < 40',
  'acc.q1.h3': '拒绝扫描',
  'acc.q1.p1': '不发布任何估算。提示信息为',
  'acc.q1.p2':
    '，并建议在更好的光线下重新扫描。估算值根本不会被计算。',
  'acc.q2.tag': '40 ≤ 质量 < 60',
  'acc.q2.h3': '低置信度',
  'acc.q2.p1': '发布尽力而为的估算，但会标注为',
  'acc.q2.p2':
    '。区间扩大至 ±7 岁（标准为 ±5）。估算保持诚实，不作偏移。',
  'acc.q3.tag': '质量 ≥ 60',
  'acc.q3.h3': '标准',
  'acc.q3.p1': '标准估算，附带',
  'acc.q3.p2':
    '。区间 ±5 岁（95%，内部队列 n=12）。在光线良好的高清摄像头下为标称表现。',
  'acc.s6.foot1': '已移除 v6.2 修正项：质量较差的扫描（质量 < 45）减 5 岁',
  'acc.s6.foot2':
    'v7 选择扩大区间，而不是偏移估算值（诚实优先于奉承）',

  'acc.s7.eyebrow': '07 · 方差测试',
  'acc.s7.h2': '可重复性。',
  'acc.s7.p':
    '测试：同一受试者在 10 种不同光照条件下扫描 10 次。测量各项得分的标准差。内部队列 n=12。',
  'acc.var1': '皱纹',
  'acc.var2': '紧致度',
  'acc.var3': '色素沉着',
  'acc.var4': '水润度',
  'acc.var5': '光泽',
  'acc.var6': '毛孔',
  'acc.var7': '泛红',
  'acc.var8': '感知年龄',
  'acc.var.unitPts': '分/100',
  'acc.var.unitYears': '岁',
  'acc.s7.foot1':
    '内部队列 · n=12 名 I-IV 光型受试者 · 每人 10 次扫描 · 光照可变 · 720p 高清摄像头',
  'acc.s7.foot2':
    'V-VI 光型：基于 Diridollou 2007 的外推 —— 专门队列验证计划于 2026 年底',
  'acc.s7.foot3': 'n=100 外部验证计划于 2026 年底',

  'acc.s8.eyebrow': '08 · 验证路线图',
  'acc.s8.h2a': '我们承诺',
  'acc.s8.h2b': '验证的内容。',
  'acc.q.late2026': '2026 年底',
  'acc.q.q42026': '2026 Q4',
  'acc.rd1.t': 'n=100 外部队列验证',
  'acc.rd1.b':
    '招募 100 名背景各异的受试者（20-75 岁，I-VI 光型）。测量与 Visia / Antera 参考设备的一致性。发表方法学论文。',
  'acc.rd2.t': 'Bazin 形态学分级 0-5',
  'acc.rd2.b':
    '从图像中提取 Bazin 形态学分级（图谱第 1 卷第 4 章）—— 目前仅使用锚定年龄 40 与相关性 r=0.78。将实现皱纹深度检测与 0-5 分级。',
  'acc.rd3.t': '按光型区分的系数（Diridollou + Flament）',
  'acc.rd3.b':
    '提取 Diridollou 2007 与 Flament 2023 中按光型区分的皱纹 / 紧致度 / 色素沉着系数。v7 目前仅对 IV-VI 光型的生物学年龄作 −4% 至 −8% 的温和调整；目标是按光型与来源系数完全对应。',
  'acc.rd4.t': '同行评审发表',
  'acc.rd4.b':
    '提交一篇方法学论文，描述 VYVRE 的处理链（消费级摄像头 → CIE L*a*b* 生物标志物 → 年龄估算），并附 n=100 队列验证。目标期刊：Int J Cosmet Sci 或 Skin Res Technol。',

  'acc.s9.eyebrow': '09 · 局限',
  'acc.s9.h2a': 'VYVRE',
  'acc.s9.h2b': '不做什么。',
  'acc.s9.p':
    '与其兜售幻想，我们宁愿对引擎测量不到的东西保持彻底坦诚。',
  'acc.lim1.t': 'VYVRE 不是医疗器械',
  'acc.lim1.b':
    '引擎不作出任何医学诊断。它不检测皮肤病理（皮肤癌、黑色素瘤、皮炎、银屑病等）。如有任何医学方面的顾虑，请咨询皮肤科医生。',
  'acc.lim2.t': '标准摄像头不是专业扫描仪',
  'acc.lim2.b':
    '专业皮肤科扫描仪使用偏振光、紫外荧光和 3D 传感器。VYVRE 依靠的是标准摄像头和不受控的光线。方差 ±8%（诊室内为 ±2%）。',
  'acc.lim3.t': '不进行皱纹的 3D 检测',
  'acc.lim3.b':
    '皱纹的真实深度需要立体传感器。VYVRE 通过阴影的色度分析估计严重程度（2D 方法）。对明显皱纹可靠，对初生细纹精度较低。',
  'acc.lim4.t': '深层色素沉着无法检测',
  'acc.lim4.b':
    '表皮下的色斑（深层黄褐斑、陈旧性日光性色斑）在可见光下不可见。这需要紫外荧光相机（不包含在内）。',
  'acc.lim5.t': 'V-VI 光型：明确承认的外推',
  'acc.lim5.b':
    '内部队列 n=12 主要为 I-IV 光型。V-VI 的调整依据 Diridollou 2007 的数据外推（生物学年龄 −4% 至 −8%）。专门队列验证计划于 2026 年底。',
  'acc.lim6.t': '化妆、眼镜、口罩',
  'acc.lim6.b':
    '引擎会检测这些遮挡并降低质量分。若质量过低（< 40），扫描将被拒绝。在 40 至 60 之间，结果会在明确标注低置信度并扩大区间的前提下发布。',
  'acc.lim7.t': '内部队列 n=12 规模很小 —— 我们坦然承认',
  'acc.lim7.b':
    '经验系数（JPEG 摄像头惩罚项、区间宽度）基于 12 名受试者校准。这是一个测试小组，而非临床队列。n=100 外部验证已列入 2026 年底的路线图。',

  'acc.s10.eyebrow': '10 · 附加模块 · 皮肤状况（v1 仅供参考）',
  'acc.s10.h2a': '4 种状况的视觉识别',
  'acc.s10.h2b': '仅供参考，绝非医疗。',
  'acc.s10.p1': '独立模块',
  'acc.s10.p2':
    '（v1.0.0-heuristic）—— 可在任意演示上选择性加载。通过图像启发式规则识别 4 种常见的可见状况，并提出针对性的护肤方案，不涉及处方。',
  'acc.s10.p3': '本模块不作出任何医学诊断。',
  'acc.cond.sens': '灵敏度',
  'acc.cond.spec': '特异度',
  'acc.cond.cohort': '合成队列 n=12',
  'acc.cond1.a': '模块 · 痤疮',
  'acc.cond1.t': '局部 CIELAB a* 红斑 + L* 纹理方差',
  'acc.cond1.c':
    '检测 T 区（额头、鼻、下巴）上集中于离散点位的红斑像素。输出：概率 + 严重程度（极轻、轻、中、重）。',
  'acc.cond2.a': '模块 · 玫瑰痤疮',
  'acc.cond2.t': '脸颊与鼻部 a* 中位数高于基线 + 双侧对称性',
  'acc.cond2.c':
    '脸颊与鼻部持续性的双侧红斑。两颊之间的对称性会对评分加权（玫瑰痤疮为双侧性）。',
  'acc.cond3.a': '模块 · 黄褐斑',
  'acc.cond3.t': '额头与上唇 ΔL* 对比脸颊 L* 高四分位 + Δb*（黑色素）',
  'acc.cond3.c':
    '面部中央（额头、上唇、颧骨）的对称性色素沉着。区分弥漫性黄褐斑与离散色斑。',
  'acc.cond4.a': '模块 · 日光性色斑',
  'acc.cond4.t': '色斑检测（大小 5-200 px²，紧实度 ≥ 0.45）',
  'acc.cond4.c':
    '脸颊与额头上轮廓清晰的孤立色斑。合格色斑数量按皮肤面积折算（每 1,000 像素的密度）。',
  'acc.s10.why.t': '为何采用启发式规则而非神经网络？',
  'acc.s10.why1':
    'ISIC / DermNet 数据集包含的是偏振光下、以皮损为中心的临床近距离图像。其分布与 50 厘米外、光线不受控的消费级摄像头相去甚远：在其上训练的模型若不在 VYVRE 专属队列上重新学习，迁移效果不佳。',
  'acc.s10.why2':
    '启发式规则可逐行审计，不透明的模型则做不到。这与各大集团对可解释性的要求相符。',
  'acc.s10.why3':
    '无需下载任何模型（0 MB），无需图形处理器，可在所有浏览器上于 200 毫秒内运行。',
  'acc.s10.why4a': '架构稳定：v2 可在同一接口背后换上经过学习的模型',
  'acc.s10.why4b': '而不破坏现有的集成。',
  'acc.s10.disc.t': '医学免责声明（任何展示中均须显示）',
  'acc.s10.disc.b':
    '本模块不是医疗器械。它不作出任何诊断。返回的概率只是需要关注区域的指示，用于推荐针对性的护肤方案。如有任何真实的皮肤顾虑，请咨询皮肤科医生。',
  'acc.s10.cta1': '查看「皮肤状况」演示 →',
  'acc.s10.cta2': '模块源代码',

  'acc.s11.eyebrow': '11 · 质量防线 · 诚实承诺',
  'acc.s11.h2a': '宁可诚实，',
  'acc.s11.h2b': '也不要虚假的精确。',
  'acc.s11.p1':
    'v7.0 取消了 v6.2 中人为讨好用户的修正项：在画质差的摄像头下暗中减去 5 岁、把 80 岁受试者拉回 50 岁的 [20, 50] 上下限、以及来源之外杜撰的按光型对应关系。',
  'acc.s11.p2':
    '如果在皮肤科医生看来用户的皮肤是 38 岁，引擎就应该说 38。不是 28（讨好式的谎言）。也不是 44（虚假的严厉）。而是一个真实的估算。',

  'acc.cta.h2a': '有技术问题？',
  'acc.cta.h2b': '索取完整 DPA。',
  'acc.cta.p':
    '我们可应要求向数据保护官、顾问皮肤科医生和研发团队发送：DPA、详细方法论、精度报告、经审计的引擎源代码。',
  'acc.cta.1': '索取资料 →',
  'acc.cta.2': '← 返回',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': '价格 · VYVRE',
  'pri.meta.desc':
    '可测量的肌肤诊断，托管于法国。Pilot 免费，Starter 每月 299 €，Growth 每月 499 €，Enterprise 每月 699 € 起。',

  'pri.banner1': '您刚刚体验了 {brand} 的演示',
  'pri.banner2': '—— 选择您的方案，即可在您的网站上启用。',

  'pri.hero.eyebrow': '定价 · VYVRE Business',
  'pri.hero.h1a': '价格',
  'pri.hero.h1b': '就写在页面上。',
  'pri.hero.p': '法国托管 · 原生符合 GDPR · 不保存任何照片',

  'pri.toggle.monthly': '按月',
  'pri.toggle.annual': '按年',
  'pri.theme.label': '您的模块主题',
  'pri.theme.dark': '黑',
  'pri.theme.light': '白',
  'pri.theme.note': '您的诊断将以该主题显示 · 之后可随时更改',

  'pri.card.plan': '方案',
  'pri.card.recommended': '推荐',
  'pri.per.month': '/月',

  'pri.pilot.price': '免费',
  'pri.pilot.sub': '30 天 · 无需承诺',
  'pri.pilot.f1': '每月 1,000 次扫描',
  'pri.pilot.f2': 'Web SDK',
  'pri.pilot.f3': 'VYVRE 标识',
  'pri.pilot.f4': '48 小时内邮件支持',
  'pri.pilot.f5': '法国基础设施',
  'pri.pilot.cta': '免费开始',

  'pri.starter.subA': '2,990 € / 年 · 赠 2 个月',
  'pri.starter.subM': '每月 5,000 次扫描',
  'pri.starter.f1': '每月 5,000 次扫描',
  'pri.starter.f2': '超出部分每次扫描 0.02 €',
  'pri.starter.f3': 'Web + iOS + Android SDK',
  'pri.starter.f4': '完整白标',
  'pri.starter.f5': 'SLA 99.9% · 优先支持',
  'pri.starter.cta': '开始免费试用',

  'pri.growth.subA': '4,990 € / 年 · 赠 2 个月',
  'pri.growth.subM': '每月 15,000 次扫描',
  'pri.growth.f1': '每月 15,000 次扫描',
  'pri.growth.f2': '超出部分每次扫描 0.015 €',
  'pri.growth.f3': '包含 Starter 全部内容，另加：',
  'pri.growth.f4': '多品牌（最多 5 个）',
  'pri.growth.f5': '专属客户经理',
  'pri.growth.cta': '选择 Growth',

  'pri.ent.subA': '起价 · 定制合同',
  'pri.ent.subM': '起价 · 无需承诺',
  'pri.ent.f1': '每月 25,000 次扫描',
  'pri.ent.f2': '超出部分每次扫描 0.01 €',
  'pri.ent.f3': '门店网络数量不限',
  'pri.ent.f4': '原生移动应用',
  'pri.ent.f5': 'SLA 99.99% · 7×24 值班',
  'pri.ent.cta': '联系我们',

  'pri.trust': '价格公开 · 增值税另计 · 随时可取消',

  'pri.args.eyebrow': '为何选择我们',
  'pri.args.h2a': '为什么是 VYVRE，',
  'pri.args.h2b': '而不是其他？',
  'pri.arg1.e': '法国制造',
  'pri.arg1.t': '唯一完全由法国出品的肌肤诊断模块',
  'pri.arg1.b': '基础设施托管于法国，团队位于巴黎，签署 DPA。',
  'pri.arg1.n': '同类方案均托管于欧盟境外。',
  'pri.arg2.e': '账单降低 90%',
  'pri.arg2.t1': '价格最多低至',
  'pri.arg2.t2': '竞争对手的十分之一',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': '每月 299 € 起',
  'pri.arg2.b3':
    '（每年 3,588 €）。SkinConsult AI 起价约每年 50,000 €，另加 30,000 € 部署费；Perfect Corp 约每年 30,000 €。',
  'pri.arg2.n': '详细对比表见本页下方。',
  'pri.arg3.e': '48 小时上线',
  'pri.arg3.t': '付款后即发送集成代码',
  'pri.arg3.b1': '您把',
  'pri.arg3.b2': '粘贴到您的网站上，即刻上线。',
  'pri.arg3.n': '无需启动会议，无需支付第三方集成商。',
  'pri.arg4.e': '无需承诺',
  'pri.arg4.t': '一键解约',
  'pri.arg4.b':
    '在您的控制台即可降级、升级或解约。没有合同锁定，没有违约金。',
  'pri.arg4.n': '您可保留并导出全部扫描数据。',
  'pri.arg5.e': '完全白标',
  'pri.arg5.t': '是您的品牌，不是我们的',
  'pri.arg5.b':
    '标志、色彩、字体、推荐产品 —— 一切均按贵方视觉规范设置。',
  'pri.arg5.n': '自 Starter 方案起即不强制出现「Powered by VYVRE」字样。',
  'pri.arg6.e': '同行评审的科学',
  'pri.arg6.t': '是一次测量，不是一次模拟',
  'pri.arg6.b':
    'CIE L*a*b* 色度学、68 个面部特征点、源自皮肤学文献的各项指数。',
  'pri.arg6.n': '参考文献：Flament、Chardon、Stamatas、Takiwaki、Yamamoto。',

  'pri.tbl.caption': '市场对比 · 2025 年公开价格',
  'pri.tbl.h1': '方案',
  'pri.tbl.h2': '年费（入门）',
  'pri.tbl.h3': '部署 / 集成',
  'pri.tbl.h4': '托管地',
  'pri.tbl.h5': '上线',
  'pri.tbl.from': '起价',
  'pri.tbl.month': '/月',
  'pri.tbl.year': '/年',
  'pri.tbl.fromApprox': '起价约',
  'pri.tbl.onQuote': '按报价',
  'pri.tbl.france': '法国',
  'pri.tbl.w812': '8-12 周',
  'pri.tbl.w12': '12 周以上',
  'pri.tbl.w68': '6-8 周',
  'pri.tbl.note':
    '竞品价格：公开可见的数量级（2024-2025 年化妆品牌招标）。',

  'pri.del.eyebrow': '启用 · 从付款那一秒起',
  'pri.del.h2a': '您所获得的一切，',
  'pri.del.h2b': '在 Stripe 确认之后。',
  'pri.del1.t': '欢迎邮件',
  'pri.del1.b': '内含您的专属管理链接与登录凭据。',
  'pri.del2.t': '可直接粘贴的集成代码',
  'pri.del3.t': '预填的产品目录',
  'pri.del3.b':
    '从您的网站选取 30 至 60 款产品，已与生物标志物关联。',
  'pri.del4.t': '贵品牌的外观',
  'pri.del4.b':
    '标志、配色与品牌名称已应用于模块和控制台。',
  'pri.del5.t': '数据分析控制台',
  'pri.del5.b':
    '每日扫描量、转化率、平均生物标志物、被推荐最多的产品。',
  'pri.del6.t': '完整的 GDPR 导出',
  'pri.del6.b':
    '您保留全部扫描数据，可随时导出为 CSV。',

  'pri.faq.eyebrow': '常见问题',
  'pri.faq.h2a': '您想知道的',
  'pri.faq.h2b': '一切。',
  'pri.faq1.q': '如果超出扫描配额会怎样？',
  'pri.faq1.a':
    '服务继续运行。超出的每次扫描按方案收取 0.01 € 至 0.02 €，计入次月账单。',
  'pri.faq2.q': '用户数据存储在哪里？',
  'pri.faq2.a':
    '仅存于法国。不保存任何照片，不向欧盟境外传输，已签署 DPA。',
  'pri.faq3.q': '中途可以更换方案吗？',
  'pri.faq3.a':
    '可以，随时在您的控制台操作。升级立即按比例计费，降级于次月生效。',
  'pri.faq4.q': '技术支持到什么程度？',
  'pri.faq4.a':
    '所有方案均提供 48 小时内的邮件支持。Growth 起提供带专属客户经理的优先支持。',
  'pri.faq5.q': '推荐的产品可以自行设置吗？',
  'pri.faq5.a':
    '可以。您的目录完全可修改：可在控制台添加、移除和调整产品。',

  'pri.cal.eyebrow': '还没准备好？',
  'pri.cal.h2': '预约一次 20 分钟的演示',
  'pri.cal.p':
    '创始人 Charles 将通过视频会议为您演示模块，并解答您所有的技术与合同问题。',
  'pri.cal.cta': '预约 20 分钟 →',

  /* ─────────── pages légales ─────────── */
  'legal.notice.t': '以法文版本为准',
  'legal.notice.b':
    '以下文本刻意保留法文：本文件仅法文版本具有合同效力。标题已翻译以便阅读。如需礼节性译本，可致函 charles@symphonydrive.com 索取。',
  'legal.updated': '最后更新：',
  'legal.version': '版本 1.0 ——',

  'cgv.meta.title': '销售条款 · VYVRE',
  'cgv.meta.desc':
    'VYVRE Business 销售通用条款 —— 面向化妆品牌的 B2B SaaS 订阅。',
  'cgv.eyebrow': '销售通用条款',
  'cgv.h1': '销售条款。',
  'cgv.a1': '第 1 条 — 目的',
  'cgv.a2': '第 2 条 — 订阅与启用',
  'cgv.a3': '第 3 条 — 价格',
  'cgv.a4': '第 4 条 — 付款方式',
  'cgv.a5': '第 5 条 — 期限与解约',
  'cgv.a6': '第 6 条 — 服务承诺（SLA）',
  'cgv.a7': '第 7 条 — 数据所有权',
  'cgv.a8': '第 8 条 — 责任限制',
  'cgv.a9': '第 9 条 — 保密与 GDPR',
  'cgv.a10': '第 10 条 — 适用法律与管辖',

  'conf.meta.title': '隐私政策 · VYVRE',
  'conf.meta.desc':
    'VYVRE 隐私政策与个人数据保护。符合 GDPR。',
  'conf.eyebrow': '数据保护 · GDPR',
  'conf.h1': '隐私。',
  'conf.b1': '数据控制者',
  'conf.b2': '肌肤扫描收集的数据',
  'conf.b3': '数据托管',
  'conf.b4': '网站收集的数据',
  'conf.b5': '购买时收集的数据',
  'conf.b6': '处理的法律依据',
  'conf.b7': '保存期限',
  'conf.b8': '您的 GDPR 权利',
  'conf.b9': 'DPA（数据处理协议）',

  'ml.meta.title': '法律声明 · VYVRE',
  'ml.meta.desc': 'VYVRE / Symphony Drive SAS 的法律声明。',
  'ml.eyebrow': '法律信息',
  'ml.h1': '法律声明。',
  'ml.b1': '网站发布者',
  'ml.b2': '出版负责人',
  'ml.b3': '托管',
  'ml.b4': '知识产权',
  'ml.b5': '责任限制',
  'ml.b6': '超链接',
  'ml.b7': '适用法律',

  'dpa.meta.title': 'DPA · 数据处理协议 · VYVRE',
  'dpa.meta.desc':
    'VYVRE 与 B2B 客户之间的数据处理协议（GDPR 第 28 条）。',
  'dpa.eyebrow': 'GDPR 第 28 条 · 处理者',
  'dpa.h1a': '数据处理',
  'dpa.h1b': '协议。',
  'dpa.b1': '1. 各方',
  'dpa.b2': '2. 处理的目的',
  'dpa.b3': '3. 所处理的数据类别',
  'dpa.b4': '4. 数据主体类别',
  'dpa.b5': '5. 处理期限',
  'dpa.b6': '6. 处理者的义务',
  'dpa.b7': '7. 安全措施（GDPR 第 32 条）',
  'dpa.b8': '8. 次级处理者',
  'dpa.b9': '9. 欧盟境外传输',
  'dpa.b10': '10. 审计与检查',
  'dpa.b11': '11. 数据泄露通知',
  'dpa.b12': '12. 数据返还与删除',
} as const;

export default zh;
