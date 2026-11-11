/* ==========================================================================
   模拟数据：药品目录（中心药房维度）
   ========================================================================== */
window.MOCK = {
  total: 9,
  kinds: ["西药", "中成药", "中药饮片", "生物制品"],

  /* 商品名映射（药品名称字段展示用） */
  tradeNames: { d1: "阿莫仙", d2: "再林", d5: "西力欣", d6: "芬必得" },

  /* 医保药品分类：级联叶子节点 + 完整路径（查看页展示叶子，hover 展示路径） */
  insMap: {
    d1: { leaf: "广谱青霉素类", path: "抗微生物药 / 全身用抗菌药 / 青霉素类 / 广谱青霉素类" },
    d2: { leaf: "广谱青霉素类", path: "抗微生物药 / 全身用抗菌药 / 青霉素类 / 广谱青霉素类" },
    d3: { leaf: "广谱青霉素类", path: "抗微生物药 / 全身用抗菌药 / 青霉素类 / 广谱青霉素类" },
    d4: { leaf: "青霉素类复方制剂", path: "抗微生物药 / 全身用抗菌药 / 青霉素类 / 青霉素类复方制剂" },
    d5: { leaf: "第二代头孢菌素", path: "抗微生物药 / 全身用抗菌药 / 头孢菌素类 / 第二代头孢菌素" },
    d6: { leaf: "丙酸类", path: "抗炎和抗风湿药 / 非甾体抗炎药 / 丙酸衍生物 / 丙酸类" },
    d7: { leaf: "清热解毒剂", path: "中成药 / 清热剂 / 清热解毒剂" },
    d8: { leaf: "清热解毒药", path: "中药饮片 / 清热药 / 清热解毒药" },
    d9: { leaf: "质子泵抑制剂", path: "消化道和代谢方面的药物 / 治疗胃酸相关类疾病的药物 / 治疗消化性溃疡病和胃食道反流病的药物 / 质子泵抑制剂" }
  },

  /* 医保药品分类级联树（新增/编辑药品时使用，保存叶子节点） */
  insTree: [
    { name: "抗微生物药", children: [
      { name: "全身用抗菌药", children: [
        { name: "青霉素类", children: [{ name: "广谱青霉素类" }, { name: "耐酶青霉素类" }, { name: "青霉素类复方制剂" }] },
        { name: "头孢菌素类", children: [{ name: "第一代头孢菌素" }, { name: "第二代头孢菌素" }, { name: "第三代头孢菌素" }] }
      ] },
      { name: "喹诺酮类抗菌药", children: [{ name: "氟喹诺酮类" }] }
    ] },
    { name: "消化道和代谢方面的药物", children: [
      { name: "口腔科制剂" },
      { name: "治疗胃酸相关类疾病的药物", children: [
        { name: "抗酸药" },
        { name: "治疗消化性溃疡病和胃食道反流病的药物", children: [{ name: "H2-受体拮抗剂" }, { name: "质子泵抑制剂" }] }
      ] }
    ] },
    { name: "抗炎和抗风湿药", children: [
      { name: "非甾体抗炎药", children: [{ name: "丙酸衍生物", children: [{ name: "丙酸类" }] }] }
    ] },
    { name: "中成药", children: [{ name: "清热剂", children: [{ name: "清热解毒剂" }] }] },
    { name: "中药饮片", children: [{ name: "清热药", children: [{ name: "清热解毒药" }] }] }
  ],

  /* 药品种类（字典） */
  drugKinds: ["西药", "中成药", "中药饮片", "疫苗", "配方颗粒"],

  /* 药品分类级联树（WS/T 778—2021，仅叶子可选） */
  classTree: [
    { name: "化学药品", children: [
      { name: "抗生素类药物", children: [
        { name: "青霉素类" }, { name: "头孢菌素类" }, { name: "碳青霉烯类" }, { name: "四环素类" }
      ] },
      { name: "化学合成的抗菌药", children: [
        { name: "磺胺类" }, { name: "喹诺酮类" }, { name: "大环内酯类" }
      ] },
      { name: "抗真菌药物", children: [{ name: "唑类抗真菌药" }, { name: "多烯类抗真菌药" }] }
    ] },
    { name: "生物制品", children: [
      { name: "疫苗", children: [{ name: "病毒类疫苗" }, { name: "细菌类疫苗" }] },
      { name: "血液制品", children: [{ name: "人血白蛋白" }, { name: "免疫球蛋白" }] }
    ] },
    { name: "中成药", children: [
      { name: "解表剂", children: [{ name: "辛温解表剂" }, { name: "辛凉解表剂" }] },
      { name: "清热剂", children: [{ name: "清热解毒剂" }] }
    ] }
  ],

  /* 剂型级联树（WS/T 364.16—2023） */
  formTree: [
    { name: "口服常释普通片剂", children: [{ name: "片剂" }, { name: "肠溶片" }, { name: "分散片" }, { name: "咀嚼片" }] },
    { name: "口服普通胶囊剂", children: [{ name: "硬胶囊" }, { name: "软胶囊" }] },
    { name: "颗粒剂", children: [{ name: "常规颗粒剂" }, { name: "混悬颗粒剂" }, { name: "泡腾颗粒剂" }] },
    { name: "丸剂", children: [{ name: "常规丸剂" }, { name: "滴丸" }, { name: "糖丸" }, { name: "水丸" }] },
    { name: "注射剂", children: [{ name: "注射液" }, { name: "注射用无菌粉末" }] }
  ],

  /* 企业库（生产企业选择来源；批准文号等为系统自动带出） */
  vendors: [
    { name: "华北制药股份有限公司", approval: "H13023917", nationalId: "86900010000123", nationalName: "阿莫西林胶囊", imported: "否", standardCode: "8690001000012301" },
    { name: "哈药集团制药总厂", approval: "H23021568", nationalId: "86900020000456", nationalName: "阿莫西林胶囊", imported: "否", standardCode: "8690002000045602" },
    { name: "石药集团中诺药业（石家庄）有限公司", approval: "H13021234", nationalId: "86900030000789", nationalName: "阿莫西林胶囊", imported: "否", standardCode: "8690003000078903" },
    { name: "山东鲁抗医药股份有限公司", approval: "H37023344", nationalId: "86900040000221", nationalName: "阿莫西林胶囊", imported: "否", standardCode: "8690004000022104" },
    { name: "珠海联邦制药股份有限公司中山分公司", approval: "H44021045", nationalId: "86900050000666", nationalName: "阿莫西林胶囊", imported: "否", standardCode: "8690005000066605" },
    { name: "上海信谊药厂有限公司", approval: "H31020315", nationalId: "86900060000321", nationalName: "头孢克肟分散片", imported: "否", standardCode: "8690006000032106" },
    { name: "GLAXOSMITHKLINE S.p.A.", approval: "H20150321", nationalId: "86900070000777", nationalName: "阿莫西林克拉维酸钾片", imported: "是", standardCode: "8690007000077707" }
  ],

  drugs: [
    {
      id: "d1",
      name: "阿莫西林胶囊",
      code: "1210500301",
      py: "AMXLJN",
      en: "Amoxicillin Capsules",
      kind: "西药",
      category: "化学药品 / 抗微生物药 / 青霉素类",
      form: "胶囊剂",
      ddd: "1.5",
      dddUnit: "g",
      insClass: "甲类",
      insCode: "XJ01CA0401010101032",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "限制使用级", antitumor: "", highAlert: "",
        allergy: ["青霉素类"], skinTest: true, longTerm: false,
        otc: false, essential: true, ins: true,
        centralized: "国家集采", negotiated: false,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: true
      },
      specs: [
        {
          code: "1010400101", title: "0.25g * 24粒/盒",
          formSpec: "0.25g", basicDose: "0.25", doseUnit: "g", prepUnit: "粒",
          minFactor: "24", pkgUnit: "盒", pkgFactor: "24", pkgSpec: "24粒/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01CA0401010101032",
          splitUnit: "粒", splitFactor: "24", status: "on",
          vendors: [
            { name: "华北制药股份有限公司", approval: "H13023917", imported: "否", purchase: "国家集中采购" },
            { name: "哈药集团制药总厂", approval: "H23021568", imported: "否", purchase: "阳光采购" },
            { name: "石药集团中诺药业（石家庄）有限公司", approval: "H20033293", imported: "否", purchase: "省级集中采购" },
            { name: "珠海联邦制药股份有限公司中山分公司", approval: "H20033458", imported: "否", purchase: "阳光采购" },
            { name: "山东鲁抗医药股份有限公司", approval: "H37021153", imported: "否", purchase: "阳光采购" }
          ]
        },
        {
          code: "1010400102", title: "0.5g * 12粒/盒",
          formSpec: "0.5g", basicDose: "0.5", doseUnit: "g", prepUnit: "粒",
          minFactor: "12", pkgUnit: "盒", pkgFactor: "12", pkgSpec: "12粒/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01CA0401010102032",
          splitUnit: "粒", splitFactor: "12", status: "on",
          vendors: [
            { name: "石药集团中诺药业（石家庄）有限公司", approval: "H20033293", imported: "否", purchase: "省级集中采购" },
            { name: "珠海联邦制药股份有限公司中山分公司", approval: "H20033458", imported: "否", purchase: "阳光采购" },
            { name: "山东鲁抗医药股份有限公司", approval: "H37021153", imported: "否", purchase: "阳光采购" }
          ]
        },
        {
          code: "1010400103", title: "0.25g * 12粒/盒",
          formSpec: "0.25g", basicDose: "0.25", doseUnit: "g", prepUnit: "粒",
          minFactor: "12", pkgUnit: "盒", pkgFactor: "12", pkgSpec: "12粒/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01CA0401010101032",
          splitUnit: "粒", splitFactor: "12", status: "off",
          vendors: [
            { name: "广州白云山制药股份有限公司", approval: "H44021234", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d2",
      name: "阿莫西林颗粒",
      code: "1210500302",
      py: "AMXLKL",
      en: "Amoxicillin Granules",
      kind: "西药",
      category: "化学药品 / 抗微生物药 / 青霉素类",
      form: "颗粒剂",
      ddd: "1.5",
      dddUnit: "g",
      insClass: "甲类",
      insCode: "XJ01CA0401020101032",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "限制使用级", antitumor: "", highAlert: "",
        allergy: ["青霉素类"], skinTest: true, longTerm: false,
        otc: false, essential: true, ins: true,
        centralized: "省级集采", negotiated: false,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: false
      },
      specs: [
        {
          code: "1010400201", title: "0.125g * 20袋/盒",
          formSpec: "0.125g", basicDose: "0.125", doseUnit: "g", prepUnit: "袋",
          minFactor: "20", pkgUnit: "盒", pkgFactor: "20", pkgSpec: "20袋/盒",
          pkgMaterial: "复合膜", insCode: "XJ01CA0401020101032",
          splitUnit: "袋", splitFactor: "20", status: "on",
          vendors: [
            { name: "先声药业有限公司", approval: "H20054132", imported: "否", purchase: "省级集中采购" },
            { name: "海南三叶制药厂有限公司", approval: "H46020567", imported: "否", purchase: "阳光采购" }
          ]
        },
        {
          code: "1010400202", title: "0.25g * 12袋/盒",
          formSpec: "0.25g", basicDose: "0.25", doseUnit: "g", prepUnit: "袋",
          minFactor: "12", pkgUnit: "盒", pkgFactor: "12", pkgSpec: "12袋/盒",
          pkgMaterial: "复合膜", insCode: "XJ01CA0401020102032",
          splitUnit: "袋", splitFactor: "12", status: "on",
          vendors: [
            { name: "华北制药股份有限公司", approval: "H13024018", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d3",
      name: "注射用阿莫西林钠",
      code: "1210500303",
      py: "ZSYAMXLN",
      en: "Amoxicillin Sodium for Injection",
      kind: "西药",
      category: "化学药品 / 抗微生物药 / 青霉素类",
      form: "注射用无菌粉末",
      ddd: "3",
      dddUnit: "g",
      insClass: "乙类",
      insCode: "XJ01CA0403010101032",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "限制使用级", antitumor: "", highAlert: "B级",
        allergy: ["青霉素类"], skinTest: true, longTerm: false,
        otc: false, essential: false, ins: true,
        centralized: "", negotiated: false,
        emergency: true, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: false
      },
      specs: [
        {
          code: "1010400301", title: "0.5g * 10支/盒",
          formSpec: "0.5g", basicDose: "0.5", doseUnit: "g", prepUnit: "支",
          minFactor: "10", pkgUnit: "盒", pkgFactor: "10", pkgSpec: "10支/盒",
          pkgMaterial: "西林瓶", insCode: "XJ01CA0403010102032",
          splitUnit: "支", splitFactor: "10", status: "on",
          vendors: [
            { name: "哈药集团制药总厂", approval: "H23023104", imported: "否", purchase: "阳光采购" },
            { name: "山东鲁抗医药股份有限公司", approval: "H37022318", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d4",
      name: "阿莫西林克拉维酸钾片",
      code: "1210500304",
      py: "AMXLKLWSJP",
      en: "Amoxicillin and Clavulanate Potassium Tablets",
      kind: "西药",
      category: "化学药品 / 抗微生物药 / 青霉素类复方制剂",
      form: "片剂",
      ddd: "1.5",
      dddUnit: "g",
      insClass: "乙类",
      insCode: "XJ01CR0201010101032",
      status: "off",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "限制使用级", antitumor: "", highAlert: "",
        allergy: ["青霉素类"], skinTest: true, longTerm: false,
        otc: false, essential: false, ins: true,
        centralized: "国家集采", negotiated: false,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: true
      },
      specs: [
        {
          code: "1010400401", title: "0.457g * 12片/盒",
          formSpec: "0.457g", basicDose: "0.457", doseUnit: "g", prepUnit: "片",
          minFactor: "12", pkgUnit: "盒", pkgFactor: "12", pkgSpec: "12片/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01CR0201010101032",
          splitUnit: "片", splitFactor: "12", status: "on",
          vendors: [
            { name: "珠海联邦制药股份有限公司中山分公司", approval: "H20033218", imported: "否", purchase: "国家集中采购" }
          ]
        },
        {
          code: "1010400402", title: "0.2285g * 24片/盒",
          formSpec: "0.2285g", basicDose: "0.2285", doseUnit: "g", prepUnit: "片",
          minFactor: "24", pkgUnit: "盒", pkgFactor: "24", pkgSpec: "24片/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01CR0201010102032",
          splitUnit: "片", splitFactor: "24", status: "off",
          vendors: [
            { name: "华北制药股份有限公司", approval: "H13022871", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d5",
      name: "头孢呋辛酯片",
      code: "1210500305",
      py: "TBFXZP",
      en: "Cefuroxime Axetil Tablets",
      kind: "西药",
      category: "化学药品 / 抗微生物药 / 头孢菌素类",
      form: "片剂",
      ddd: "0.5",
      dddUnit: "g",
      insClass: "乙类",
      insCode: "XJ01DC0201010101032",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "限制使用级", antitumor: "", highAlert: "",
        allergy: ["头孢菌素类"], skinTest: false, longTerm: false,
        otc: false, essential: true, ins: true,
        centralized: "国家集采", negotiated: false,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: true
      },
      specs: [
        {
          code: "1010400501", title: "0.25g * 12片/盒",
          formSpec: "0.25g", basicDose: "0.25", doseUnit: "g", prepUnit: "片",
          minFactor: "12", pkgUnit: "盒", pkgFactor: "12", pkgSpec: "12片/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01DC0201010101032",
          splitUnit: "片", splitFactor: "12", status: "on",
          vendors: [
            { name: "国药集团致君（深圳）制药有限公司", approval: "H20043318", imported: "否", purchase: "国家集中采购" },
            { name: "丽珠集团丽珠制药厂", approval: "H20044712", imported: "否", purchase: "阳光采购" }
          ]
        },
        {
          code: "1010400502", title: "0.125g * 24片/盒",
          formSpec: "0.125g", basicDose: "0.125", doseUnit: "g", prepUnit: "片",
          minFactor: "24", pkgUnit: "盒", pkgFactor: "24", pkgSpec: "24片/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XJ01DC0201010102032",
          splitUnit: "片", splitFactor: "24", status: "on",
          vendors: [
            { name: "广州白云山制药股份有限公司", approval: "H44020866", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d6",
      name: "布洛芬缓释胶囊",
      code: "1210500306",
      py: "BLFHSJN",
      en: "Ibuprofen Sustained-release Capsules",
      kind: "西药",
      category: "化学药品 / 解热镇痛抗炎药 / 非甾体抗炎药",
      form: "缓释胶囊",
      ddd: "0.6",
      dddUnit: "g",
      insClass: "甲类",
      insCode: "XM01AE0101010101032",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "", antitumor: "", highAlert: "",
        allergy: [], skinTest: false, longTerm: true,
        otc: true, essential: true, ins: true,
        centralized: "国家集采", negotiated: false,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: false
      },
      specs: [
        {
          code: "1010400601", title: "0.3g * 20粒/盒",
          formSpec: "0.3g", basicDose: "0.3", doseUnit: "g", prepUnit: "粒",
          minFactor: "20", pkgUnit: "盒", pkgFactor: "20", pkgSpec: "20粒/盒",
          pkgMaterial: "铝塑泡罩", insCode: "XM01AE0101010101032",
          splitUnit: "粒", splitFactor: "20", status: "on",
          vendors: [
            { name: "中美天津史克制药有限公司", approval: "H10900089", imported: "否", purchase: "国家集中采购" },
            { name: "哈药集团制药总厂", approval: "H23025117", imported: "否", purchase: "阳光采购" },
            { name: "石药集团欧意药业有限公司", approval: "H13022894", imported: "否", purchase: "省级集中采购" },
            { name: "葵花药业集团股份有限公司", approval: "H23022015", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d7",
      name: "连花清瘟胶囊",
      code: "1210500307",
      py: "LHQWJN",
      en: "Lianhua Qingwen Capsules",
      kind: "中成药",
      category: "中成药 / 清热解毒剂",
      form: "胶囊剂",
      ddd: "",
      dddUnit: "",
      insClass: "甲类",
      insCode: "ZT04AAAL0001010101032",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "", antitumor: "", highAlert: "",
        allergy: [], skinTest: false, longTerm: false,
        otc: true, essential: false, ins: true,
        centralized: "", negotiated: true,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: false
      },
      specs: [
        {
          code: "1010400701", title: "0.35g * 24粒/盒",
          formSpec: "0.35g", basicDose: "0.35", doseUnit: "g", prepUnit: "粒",
          minFactor: "24", pkgUnit: "盒", pkgFactor: "24", pkgSpec: "24粒/盒",
          pkgMaterial: "铝塑泡罩", insCode: "ZT04AAAL0001010101032",
          splitUnit: "粒", splitFactor: "24", status: "on",
          vendors: [
            { name: "石家庄以岭药业股份有限公司", approval: "Z20040063", imported: "否", purchase: "国家谈判" }
          ]
        }
      ]
    },

    {
      id: "d8",
      name: "金银花",
      code: "1210500308",
      py: "JYH",
      en: "Lonicerae Japonicae Flos",
      kind: "中药饮片",
      category: "中药饮片 / 清热解毒类",
      form: "饮片",
      ddd: "",
      dddUnit: "",
      insClass: "甲类",
      insCode: "T0001000001",
      status: "on",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "", antitumor: "", highAlert: "",
        allergy: [], skinTest: false, longTerm: false,
        otc: false, essential: false, ins: true,
        centralized: "", negotiated: false,
        emergency: false, keyMonitor: false, rare: false,
        valuable: false, defaultSplit: true
      },
      specs: [
        {
          code: "1010400801", title: "1kg/袋",
          formSpec: "统货", basicDose: "1", doseUnit: "kg", prepUnit: "千克",
          minFactor: "1", pkgUnit: "袋", pkgFactor: "1", pkgSpec: "1kg/袋",
          pkgMaterial: "编织袋", insCode: "T0001000001",
          splitUnit: "g", splitFactor: "1000", status: "on",
          vendors: [
            { name: "亳州市沪谯药业有限公司", approval: "皖20160234", imported: "否", purchase: "阳光采购" },
            { name: "安徽协和成药业饮片有限公司", approval: "皖20170519", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    },

    {
      id: "d9",
      name: "注射用生长抑素",
      code: "1210500309",
      py: "ZSYSCYS",
      en: "Somatostatin for Injection",
      kind: "西药",
      category: "化学药品 / 消化系统用药 / 抑酸及胰腺用药",
      form: "注射用无菌粉末",
      ddd: "6",
      dddUnit: "mg",
      insClass: "乙类",
      insCode: "XH01CB0201010101032",
      status: "off",
      marks: {
        spirit: "", toxic: false, narcotic: false,
        antibiotic: "", antitumor: "", highAlert: "",
        allergy: [], skinTest: false, longTerm: false,
        otc: false, essential: false, ins: true,
        centralized: "", negotiated: false,
        emergency: false, keyMonitor: true, rare: false,
        valuable: true, defaultSplit: false
      },
      specs: [
        {
          code: "1010400901", title: "3mg * 1支/盒",
          formSpec: "3mg", basicDose: "3", doseUnit: "mg", prepUnit: "支",
          minFactor: "1", pkgUnit: "盒", pkgFactor: "1", pkgSpec: "1支/盒",
          pkgMaterial: "西林瓶", insCode: "XH01CB0201010101032",
          splitUnit: "支", splitFactor: "1", status: "off",
          vendors: [
            { name: "深圳市翰宇药业股份有限公司", approval: "H20053872", imported: "否", purchase: "阳光采购" }
          ]
        }
      ]
    }
  ]
};

/* 规格级「基药 / 医保」标识：未单独指定时沿用品种级 */
window.MOCK.drugs.forEach(function (d) {
  d.specs.forEach(function (s) {
    if (s.essential === undefined) s.essential = d.marks.essential;
    if (s.ins === undefined) s.ins = d.marks.ins;
  });
});

/* 演示：同一品种下不同规格的标识差异 */
window.MOCK.drugs[0].specs[2].ins = false;        // 阿莫西林 0.25g*12粒：未纳入医保
window.MOCK.drugs[4].specs[1].essential = false;  // 头孢呋辛酯 0.125g：非基药

/* ==========================================================================
   机构维度扩展（机构药品目录 / 选择药品 页使用）
   ========================================================================== */

/* 机构列表 */
window.MOCK.orgs = [
  { id: "org-c",  name: "中心药房",               current: false },
  { id: "org-a1", name: "XX 社区卫生服务中心",     current: true  },
  { id: "org-a2", name: "YY 人民医院",           current: false },
  { id: "org-a3", name: "ZZ 中西医结合医院",       current: false }
];

/* 厂商行稳定键：drugId + "_" + specIdx + "_" + vendorIdx
   例：d1_0_3 = 阿莫西林胶囊(d1) 第0个规格 第3家厂商 */
window.MOCK.vkey = function (drugId, si, vi) {
  return drugId + "_" + si + "_" + vi;
};

/* 机构→厂商行集合：预设几条，页面一打开就有内容 */
window.MOCK.orgDrugs = {};

/* 全部中心目录厂商行键的生成器（中心药房默认全选） */
window.MOCK.allVendorKeys = function () {
  var arr = [];
  window.MOCK.drugs.forEach(function (d) {
    d.specs.forEach(function (s, si) {
      s.vendors.forEach(function (v, vi) {
        arr.push(window.MOCK.vkey(d.id, si, vi));
      });
    });
  });
  return arr;
};

/* 构造厂商行键的便捷写法 */
function mk(drugId, pairs) {
  var out = [];
  pairs.forEach(function (p) {
    for (var v = 0; v < p[1]; v++) out.push(window.MOCK.vkey(drugId, p[0], v));
  });
  return out;
}

/* org-c 中心药房：全部厂商行 */
window.MOCK.orgDrugs["org-c"] = window.MOCK.allVendorKeys();

/* org-a1 XX 社区：d1 阿莫西林全部规格厂商(9) + d2 阿莫西林颗粒全部(3) + d6 芬必得全部(4) */
window.MOCK.orgDrugs["org-a1"] = [].concat(
  mk("d1", [[0, 5], [1, 3], [2, 1]]),   // 9 行
  mk("d2", [[0, 2], [1, 1]]),           // 3 行（d2 仅 3 家厂商）
  mk("d6", [[0, 4]])                    // 4 行
);

/* org-a2 YY 医院：d4 + d5 + d7 */
window.MOCK.orgDrugs["org-a2"] = [].concat(
  mk("d4", [[0, 1], [1, 1]]),           // 2 行（d4 每个规格 1 家）
  mk("d5", [[0, 2], [1, 1]]),           // 3 行（d5 spec0 2 家, spec1 1 家）
  mk("d7", [[0, 1]])                    // 1 行
);

/* org-a3 ZZ 中西医：d8 金银花 + d9 生长抑素 */
window.MOCK.orgDrugs["org-a3"] = [].concat(
  mk("d8", [[0, 2]]),
  mk("d9", [[0, 1]])
);

/* 工具：根据键返回 { drug, spec, vendor, si, vi } */
window.MOCK.parseVkey = function (key) {
  var parts = key.split("_");
  if (parts.length !== 3) return null;
  var drugId = parts[0], si = parseInt(parts[1], 10), vi = parseInt(parts[2], 10);
  var drug = null, spec = null, vendor = null;
  for (var i = 0; i < window.MOCK.drugs.length; i++) {
    if (window.MOCK.drugs[i].id === drugId) { drug = window.MOCK.drugs[i]; break; }
  }
  if (drug && drug.specs[si]) { spec = drug.specs[si]; if (spec.vendors[vi]) vendor = spec.vendors[vi]; }
  return { drug: drug, spec: spec, vendor: vendor, si: si, vi: vi, drugId: drugId };
};


/* ==========================================================================
   药品目录遴选：演示账号与申请数据
   role: village=村室发起人 member=成员机构 center=中心药房 pharmacist=中心药房·发起人 his=HIS对接人员
   status: draft/member/center/rejected/approved
   ========================================================================== */
MOCK.users = [
  { id: "u1", account: "wangfang", password: "123456", name: "王芳", org: "青河村卫生室", role: "village", roleName: "村室发起人" },
  { id: "u2", account: "liqiang", password: "123456", name: "李强", org: "城东社区卫生服务中心", role: "member", roleName: "成员机构（可发起、可审核）" },
  { id: "u3", account: "zhaomin", password: "123456", name: "赵敏", org: "区域中心药房", role: "center", roleName: "中心药房审核人" },
  { id: "u5", account: "sunlei", password: "123456", name: "孙磊", org: "信息中心 · HIS 对接", role: "his", roleName: "HIS 对接人员" },
  { id: "u6", account: "zhouwen", password: "123456", name: "周雯", org: "县域医共体药学专家库", role: "expert", roleName: "药学专家" },
  { id: "u7", account: "fengtao", password: "123456", name: "冯涛", org: "县域医共体药学专家库", role: "expert", roleName: "临床专家" },
  { id: "u8", account: "liuyun", password: "123456", name: "刘芸", org: "区域中心药房", role: "narcoticAuditor", roleName: "毒麻精药房审核专员" }
];

MOCK.selections = [
  {
    id: "s1", title: "2026年四季度常用药品补充申请", orgType: "village",
    applicantId: "u1", applicant: "王芳", org: "青河村卫生室",
    createdAt: "2026-10-28 09:12", status: "draft",
    desc: "补充秋冬季高频使用的感冒、止咳类药品。",
    items: [
      { cat: "化学药品", name: "布洛芬缓释胶囊", spec: "0.3g*20粒/盒", vendor: "中美天津史克制药有限公司", approval: "国药准字H10900089" },
      { cat: "化学药品", name: "氨溴索口服液", spec: "100ml:0.6g/瓶", vendor: "上海勃林格殷格翰药业有限公司", approval: "国药准字H20031314" }
    ],
    records: [
      { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-24 10:05" },
      { node: "撤销审核", org: "青河村卫生室", person: "王芳", result: "已撤销", opinion: "—", time: "2026-10-24 15:40" }
    ]
  },
  {
    id: "s2", title: "急救药品增补申请", orgType: "village",
    applicantId: "u1", applicant: "王芳", org: "青河村卫生室",
    createdAt: "2026-10-27 14:30", status: "member",
    desc: "村卫生室急救箱药品临期更换与补充。",
    items: [
      { cat: "化学药品", name: "肾上腺素注射液", spec: "1ml:1mg/支", vendor: "天津金耀药业有限公司", approval: "国药准字H12020526" },
      { cat: "化学药品", name: "硝酸甘油片", spec: "0.5mg*100片/瓶", vendor: "北京益民药业有限公司", approval: "国药准字H11021022" },
      { cat: "化学药品", name: "多巴胺注射液", spec: "2ml:20mg/支", vendor: "上海禾丰制药有限公司", approval: "国药准字H31021174" }
    ],
    records: [
      { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-27 14:30" }
    ]
  },
  {
    id: "s3", title: "抗菌药物目录调整申请", orgType: "village",
    applicantId: "u1", applicant: "王芳", org: "青河村卫生室",
    createdAt: "2026-10-25 16:02", status: "rejected",
    desc: "申请增补两种口服抗菌药物。",
    items: [
      { cat: "化学药品", name: "头孢克肟分散片", spec: "100mg*12片/盒", vendor: "广州白云山医药集团股份有限公司", approval: "国药准字H20041488" },
      { cat: "化学药品", name: "左氧氟沙星片", spec: "0.5g*7片/盒", vendor: "第一三共制药（北京）有限公司", approval: "国药准字H20040091" }
    ],
    records: [
      { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-25 16:02" },
      { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", result: "拒绝", opinion: "头孢克肟分散片超出村室抗菌药物使用权限，请调整后重新提交。", time: "2026-10-26 09:18" }
    ]
  },
  {
    id: "s4", title: "慢性病用药补充申请", orgType: "village",
    applicantId: "u1", applicant: "王芳", org: "青河村卫生室",
    createdAt: "2026-10-26 10:44", status: "center",
    desc: "高血压、糖尿病长期用药补充。",
    items: [
      { cat: "化学药品", name: "苯磺酸氨氯地平片", spec: "5mg*28片/盒", vendor: "辉瑞制药有限公司", approval: "国药准字H10950224" },
      { cat: "化学药品", name: "缬沙坦胶囊", spec: "80mg*28粒/盒", vendor: "北京诺华制药有限公司", approval: "国药准字H20040217" },
      { cat: "化学药品", name: "盐酸二甲双胍缓释片", spec: "0.5g*30片/瓶", vendor: "中美上海施贵宝制药有限公司", approval: "国药准字H20023370" },
      { cat: "化学药品", name: "格列美脲片", spec: "2mg*15片/盒", vendor: "赛诺菲（北京）制药有限公司", approval: "国药准字H20057672" }
    ],
    records: [
      { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-26 10:44" },
      { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", result: "同意", opinion: "符合村室慢性病用药目录范围。", time: "2026-10-27 09:05" }
    ]
  },
  {
    id: "s5", title: "基本药物常规补充申请", orgType: "village",
    applicantId: "u1", applicant: "王芳", org: "青河村卫生室",
    createdAt: "2026-10-20 08:50", status: "approved",
    desc: "常规基药补充。",
    items: [
      { cat: "化学药品", name: "阿莫西林胶囊", spec: "0.25g*24粒/盒", vendor: "华北制药股份有限公司", approval: "国药准字H13020726" },
      { cat: "化学药品", name: "对乙酰氨基酚片", spec: "0.5g*16片/盒", vendor: "地奥集团成都药业股份有限公司", approval: "国药准字H51021457" },
      { cat: "化学药品", name: "蒙脱石散", spec: "3g*10袋/盒", vendor: "博福-益普生（天津）制药有限公司", approval: "国药准字H20000690" },
      { cat: "化学药品", name: "口服补液盐Ⅲ", spec: "5.125g*6袋/盒", vendor: "西安安健药业有限公司", approval: "国药准字H61023544" },
      { cat: "化学药品", name: "开塞露", spec: "20ml/支", vendor: "上海运佳黄浦制药有限公司", approval: "国药准字H31021363" }
    ],
    records: [
      { node: "提交", org: "青河村卫生室", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-20 08:50" },
      { node: "成员机构审核", org: "城东社区卫生服务中心", person: "李强", result: "同意", opinion: "—", time: "2026-10-21 10:12" },
      { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "同意", opinion: "—", time: "2026-10-22 14:26" }
    ]
  },
  {
    id: "s6", title: "中心药品目录同步申请", orgType: "member",
    applicantId: "u2", applicant: "李强", org: "城东社区卫生服务中心",
    createdAt: "2026-10-28 11:20", status: "center",
    desc: "将中心新增的 3 个品规同步至社区目录。",
    items: [
      { cat: "化学药品", name: "阿托伐他汀钙片", spec: "20mg*14片/盒", vendor: "辉瑞制药有限公司", approval: "国药准字H20051408" },
      { cat: "化学药品", name: "氯吡格雷片", spec: "75mg*7片/盒", vendor: "赛诺菲（杭州）制药有限公司", approval: "国药准字J20180029" },
      { cat: "化学药品", name: "美托洛尔缓释片", spec: "47.5mg*7片/盒", vendor: "阿斯利康制药有限公司", approval: "国药准字J20150044" }
    ],
    records: [
      { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-10-28 11:20" }
    ]
  },
  {
    id: "s7", title: "季节性流感用药储备申请", orgType: "member",
    applicantId: "u2", applicant: "李强", org: "城东社区卫生服务中心",
    createdAt: "2026-10-18 15:36", status: "approved",
    desc: "流感季储备抗病毒与解热镇痛药品。",
    items: [
      { cat: "化学药品", name: "奥司他韦胶囊", spec: "75mg*10粒/盒", vendor: "宜昌东阳光长江药业股份有限公司", approval: "国药准字H20065415" },
      { cat: "中成药", name: "连花清瘟胶囊", spec: "0.35g*24粒/盒", vendor: "石家庄以岭药业股份有限公司", approval: "国药准字Z20040063" }
    ],
    records: [
      { node: "提交", org: "城东社区卫生服务中心", person: "李强", result: "已提交", opinion: "—", time: "2026-10-18 15:36" },
      { node: "中心药房审核", org: "区域中心药房", person: "赵敏", result: "同意", opinion: "—", time: "2026-10-19 09:41" }
    ]
  },
  {
    id: "s8", title: "精神类药品增补申请", orgType: "member",
    applicantId: "u2", applicant: "李强", org: "城东社区卫生服务中心",
    createdAt: "2026-10-29 09:02", status: "draft",
    desc: "",
    items: [
      { cat: "化学药品", name: "艾司唑仑片", spec: "1mg*20片/盒", vendor: "华中药业股份有限公司", approval: "国药准字H42021539" }
    ],
    records: []
  }
];

/* ==========================================================================
   药品目录遴选：专家打分标准（附件3 化学药品 / 附件4 中成药）
   kind: "single" 单选 / "multi" 可多选；v=分值 t=细则描述
   ========================================================================== */
MOCK.scoreRules = {
  chem: {
    name: "化学药品",
    ref: "附件3《县域医共体中心药房用药目录遴选指标参照表（化学药品部分）》",
    groups: [
      { no: "1", name: "药学特性", max: 20, subs: [
        { no: "1.1", name: "适应证", max: 20, kind: "single", opts: [
          { v: 20, t: "临床必需，首选 / 一线用药" },
          { v: 10, t: "临床需要，次选 / 二线用药" },
          { v: 5, t: "可选 / 替代药品较多" }
        ] }
      ] },
      { no: "2", name: "安全性", max: 10, subs: [
        { no: "2.1", name: "不良反应分级或依据 CTCAE 分级", max: 3.5, kind: "single", opts: [
          { v: 3.5, t: "轻度（症状轻微，无需治疗）或 CTCAE1 级" },
          { v: 3, t: "轻度（症状较轻，需要干预）或 CTCAE2 级" },
          { v: 2.5, t: "中度（症状明显，需要干预）或 CTCAE3 级" },
          { v: 2, t: "重度（症状严重，危及生命）或 CTCAE4–5 级，发生率 <0.1%" },
          { v: 1.5, t: "重度（症状严重，危及生命）或 CTCAE4–5 级，发生率 0.1%–1%" },
          { v: 1, t: "重度（症状严重，危及生命）或 CTCAE4–5 级，发生率 1%–10%" },
          { v: 0.5, t: "重度（症状严重，危及生命）或 CTCAE4–5 级，发生率 ≥10%" }
        ] },
        { no: "2.2", name: "特殊人群", max: 3.5, kind: "multi", opts: [
          { v: 1, t: "儿童可用" },
          { v: 0.5, t: "老人可用" },
          { v: 0.5, t: "孕妇可用" },
          { v: 0.5, t: "哺乳期妇女可用" },
          { v: 0.5, t: "肝功能异常可用" },
          { v: 0.5, t: "肾功能异常可用" }
        ] },
        { no: "2.3", name: "药物相互作用", max: 1.5, kind: "single", opts: [
          { v: 1.5, t: "轻中度：一般无需调整用药剂量" },
          { v: 1, t: "重度：需要调整剂量" },
          { v: 0.5, t: "禁忌：禁止在同一时段使用" }
        ] },
        { no: "2.4", name: "其他", max: 1.5, kind: "multi", opts: [
          { v: 0.5, t: "不良反应均为可逆性" },
          { v: 0.5, t: "无致畸、致癌" },
          { v: 0.5, t: "无特别用药警示" }
        ] }
      ] },
      { no: "3", name: "有效性", max: 5, subs: [
        { no: "3.1", name: "有效性评价", max: 5, kind: "single", opts: [
          { v: 5, t: "诊疗规范推荐（国家卫生健康行政部门）" },
          { v: 4.5, t: "指南 I 级推荐（A 级证据 18，B 级证据 17，C 级证据 16，其他 15）" },
          { v: 3.5, t: "指南 II 级及以下推荐（A 级证据 14，B 级证据 13，C 级证据 12，其他 11）" },
          { v: 2.5, t: "专家共识推荐" },
          { v: 2, t: "纳入临床诊疗路径用药" },
          { v: 1.5, t: "无以上推荐，临床使用效果被认可" },
          { v: 0.25, t: "无以上推荐，无临床使用经验或效果不被认可" }
        ] }
      ] },
      { no: "4", name: "经济性", max: 20, subs: [
        { no: "4.1", name: "同通用名药品", max: 10, kind: "single", opts: [
          { v: 10, t: "日均治疗费用最低" },
          { v: 8, t: "日均治疗费用低于中位数" },
          { v: 6, t: "日均治疗费用居中" },
          { v: 4, t: "日均治疗费用高于中位数" },
          { v: 2, t: "日均治疗费用最高" }
        ] },
        { no: "4.2", name: "主要适应证可替代药品", max: 10, kind: "single", opts: [
          { v: 10, t: "日均治疗费用最低" },
          { v: 8, t: "日均治疗费用低于中位数" },
          { v: 6, t: "日均治疗费用居中" },
          { v: 4, t: "日均治疗费用高于中位数" },
          { v: 2, t: "日均治疗费用最高" }
        ] }
      ] },
      { no: "5", name: "创新性", max: 10, subs: [
        { no: "5.1", name: "技术特性", max: 5, kind: "single", opts: [
          { v: 5, t: "填补临床诊疗空白" },
          { v: 3, t: "补充临床诊疗需求" },
          { v: 1, t: "可选 / 替代药品较多" }
        ] },
        { no: "5.2", name: "一致性评价", max: 5, kind: "single", opts: [
          { v: 5, t: "原研药 / 仿制药参比制剂" },
          { v: 5, t: "通过一致性评价的仿制药" },
          { v: 0, t: "未通过一致性评价的仿制药" }
        ] }
      ] },
      { no: "6", name: "适宜性", max: 9, subs: [
        { no: "6.1", name: "药剂学 / 使用方法", max: 3, kind: "multi", opts: [
          { v: 1, t: "主要成分及辅料明确" },
          { v: 1, t: "剂型适宜" },
          { v: 1, t: "使用方法简便" }
        ] },
        { no: "6.2", name: "用药依从性", max: 3, kind: "single", opts: [
          { v: 3, t: "给药剂量、频次适宜，依从性好" },
          { v: 2, t: "给药剂量、频次常规要求，依从性一般" },
          { v: 1, t: "使用方法有特殊要求" }
        ] },
        { no: "6.3", name: "药品有效期", max: 3, kind: "single", opts: [
          { v: 3, t: ">36 个月" },
          { v: 2, t: "24–36 个月" },
          { v: 1, t: "<24 个月" }
        ] }
      ] },
      { no: "7", name: "可及性", max: 26, subs: [
        { no: "7.1", name: "国家基本药物目录收录情况", max: 12, kind: "single", opts: [
          { v: 12, t: "在《国家基本药物目录》中，没有 △ 要求" },
          { v: 8, t: "在《国家基本药物目录》中，有 △ 要求" },
          { v: 0, t: "不在《国家基本药物目录》中" }
        ] },
        { no: "7.2", name: "国家医保目录收录情况", max: 8, kind: "single", opts: [
          { v: 8, t: "国家医保目录甲类，且没有限制条件（含国家医保谈判成功药品或省际联盟带量采购中选药品）" },
          { v: 6, t: "国家医保目录甲类，有限制条件" },
          { v: 4, t: "国家医保目录乙类，且没有限制条件" },
          { v: 2, t: "国家医保目录乙类，有限制条件" },
          { v: 0, t: "不在国家医保目录" }
        ] },
        { no: "7.3", name: "国家和省组织药品集中带量采购情况", max: 6, kind: "single", opts: [
          { v: 6, t: "国家组织药品集中带量采购中选产品" },
          { v: 4, t: "省际联盟集中带量采购中选产品" },
          { v: 0, t: "非国家或省际联盟带量采购中选产品" }
        ] },
        { no: "7.5", name: "生产企业状况", max: 1, kind: "single", opts: [
          { v: 1, t: "生产企业在工业和信息化部医药工业百强榜" },
          { v: 0.5, t: "其他企业" }
        ] }
      ] }
    ]
  },
  tcm: {
    name: "中成药",
    ref: "附件4《县域医共体中心药房用药目录遴选指标参照表（中成药部分）》",
    groups: [
      { no: "1", name: "药学特性", max: 20, subs: [
        { no: "1.1", name: "适应证", max: 8, kind: "single", opts: [
          { v: 8, t: "临床需要，无同类品种" },
          { v: 4, t: "可选药品较多" }
        ] },
        { no: "1.2", name: "药效学", max: 6, kind: "single", opts: [
          { v: 6, t: "临床疗效确切" },
          { v: 4, t: "临床疗效尚可" },
          { v: 2, t: "临床疗效一般" },
          { v: 0, t: "临床疗效不确定" }
        ] },
        { no: "1.3", name: "处方来源", max: 6, kind: "multi", opts: [
          { v: 2, t: "古代经典名方" },
          { v: 2, t: "真实世界研究" },
          { v: 2, t: "人用经验" }
        ] }
      ] },
      { no: "2", name: "安全性", max: 9, subs: [
        { no: "2.1", name: "不良反应分级或依据 CTCAE 分级", max: 3, kind: "single", opts: [
          { v: 3, t: "轻度（症状轻微，无需治疗）或 CTCAE1 级" },
          { v: 2.5, t: "轻度（症状较轻，需要干预）或 CTCAE2 级" },
          { v: 2, t: "中度（症状明显，需要干预）或 CTCAE3 级" },
          { v: 1.5, t: "重度（症状严重，危及生命）或 CTCAE4–5 级" },
          { v: 1, t: "未提供 ADR 发生数据" }
        ] },
        { no: "2.2", name: "特殊人群", max: 3, kind: "multi", opts: [
          { v: 1, t: "儿童可用" },
          { v: 0.5, t: "老人可用" },
          { v: 0.25, t: "妊娠期、哺乳期妇女可用" },
          { v: 0.25, t: "肝、肾功能异常可用" }
        ] },
        { no: "2.3", name: "药物相互作用", max: 1, kind: "single", opts: [
          { v: 1, t: "轻度：一般无需调整用药剂量" },
          { v: 0.5, t: "重度：需要调整剂量" },
          { v: 0, t: "禁忌：禁止在同一时段使用" }
        ] },
        { no: "2.4", name: "其他", max: 2, kind: "multi", opts: [
          { v: 0.5, t: "不良反应均为可逆性" },
          { v: 0.5, t: "无致畸、致癌" },
          { v: 0.5, t: "无特别用药警示" },
          { v: 0.5, t: "不含有毒中药成分" }
        ] }
      ] },
      { no: "3", name: "有效性", max: 13, subs: [
        { no: "3.1", name: "有效性评价", max: 13, kind: "single", opts: [
          { v: 13, t: "诊疗规范推荐（国家卫生健康行政部门）" },
          { v: 11, t: "指南 I 级推荐（A 级证据 18，B 级证据 17，C 级证据 16，其他 15）" },
          { v: 9, t: "指南 II 级及以下推荐（A 级证据 14，B 级证据 13，C 级证据 12，其他 11）" },
          { v: 7, t: "专家共识推荐" },
          { v: 5, t: "纳入临床诊疗路径用药" },
          { v: 3, t: "无以上推荐，临床使用效果被认可" },
          { v: 1, t: "无以上推荐，无临床使用经验或效果不被认可" }
        ] }
      ] },
      { no: "4", name: "经济性", max: 16, subs: [
        { no: "4.1", name: "同通用名药品", max: 8, kind: "single", opts: [
          { v: 8, t: "日均治疗费用最低" },
          { v: 6, t: "日均治疗费用低于中位数" },
          { v: 4, t: "日均治疗费用居中" },
          { v: 2, t: "日均治疗费用高于中位数" },
          { v: 1, t: "日均治疗费用最高" }
        ] },
        { no: "4.2", name: "主要适应证可替代药品", max: 8, kind: "single", opts: [
          { v: 8, t: "日均治疗费用最低" },
          { v: 6, t: "日均治疗费用低于中位数" },
          { v: 4, t: "日均治疗费用居中" },
          { v: 2, t: "日均治疗费用高于中位数" },
          { v: 1, t: "日均治疗费用最高" }
        ] }
      ] },
      { no: "5", name: "创新性", max: 6, subs: [
        { no: "5.1", name: "临床创新性", max: 3, kind: "single", opts: [
          { v: 3, t: "填补临床诊疗空白" },
          { v: 2, t: "补充临床诊疗需求" },
          { v: 1, t: "可选 / 替代药品较多" }
        ] },
        { no: "5.2", name: "产业创新性", max: 3, kind: "multi", opts: [
          { v: 1, t: "获得国内外发明专利" },
          { v: 1, t: "新型辅料及新型载药释药技术" },
          { v: 1, t: "先进的制造技术" }
        ] }
      ] },
      { no: "6", name: "适宜性", max: 18, subs: [
        { no: "6.1", name: "药剂学 / 使用依从性", max: 12, kind: "multi", opts: [
          { v: 2, t: "主要成分与辅料明确（二者均明确 2，仅一项明确 1）" },
          { v: 1, t: "规格便于临床应用及剂量调整" },
          { v: 1, t: "包装便于临床应用及剂量调整" },
          { v: 2, t: "剂型适宜（口服 / 吸入 / 外用 2；皮下 / 肌内注射 1.5；静滴 / 静脉注射 1）" },
          { v: 2, t: "给药剂量适宜（固定剂量 2；过程中需调整 1.5；按体重或体表面积计算 1）" },
          { v: 2, t: "给药频次适宜（≤1 次/天 2；2 次/天 1.5；≥3 次/天及其他 1）" },
          { v: 2, t: "使用方便（可自行给药 2；他人帮助或训练后自行给药 1.5；医务人员给药 1）" }
        ] },
        { no: "6.2", name: "药品有效期", max: 6, kind: "single", opts: [
          { v: 6, t: ">36 个月" },
          { v: 4, t: "24–36 个月" },
          { v: 2, t: "<24 个月" }
        ] }
      ] },
      { no: "7", name: "可及性", max: 18, subs: [
        { no: "7.1", name: "国家基本药物目录收录情况", max: 6, kind: "single", opts: [
          { v: 6, t: "在《国家基本药物目录》中，没有 △ 要求" },
          { v: 4, t: "在《国家基本药物目录》中，有 △ 要求" },
          { v: 0, t: "不在《国家基本药物目录》中" }
        ] },
        { no: "7.2", name: "国家医保目录收录情况", max: 5, kind: "single", opts: [
          { v: 5, t: "国家医保目录甲类，且没有限制条件（含国家医保谈判成功药品或省际联盟带量采购中选药品）" },
          { v: 4, t: "国家医保目录甲类，有限制条件" },
          { v: 3, t: "国家医保目录乙类，且没有限制条件" },
          { v: 2, t: "国家医保目录乙类，有限制条件" },
          { v: 0, t: "不在国家医保目录" }
        ] },
        { no: "7.3", name: "国家和省组织药品集中带量采购情况", max: 3, kind: "single", opts: [
          { v: 3, t: "国家组织药品集中带量采购中选产品" },
          { v: 2, t: "省际联盟集中带量采购中选产品" },
          { v: 0, t: "非国家或省际联盟带量采购中选产品" }
        ] },
        { no: "7.4", name: "全球上市情况", max: 2, kind: "single", opts: [
          { v: 2, t: "国内外市场均已上市销售" },
          { v: 1, t: "仅国内市场上市销售" }
        ] },
        { no: "7.5", name: "生产企业状况", max: 2, kind: "single", opts: [
          { v: 2, t: "生产企业在工业和信息化部医药工业百强榜" },
          { v: 1, t: "其他企业" }
        ] }
      ] }
    ]
  }
};

/* 专家打分演示种子：s5、s7（审核通过）已有专家打分记录 */
(function () {
  function score(cat, ids, time) {
    var picks = {}, total = 0;
    MOCK.scoreRules[cat].groups.forEach(function (g) {
      g.subs.forEach(function (sub) {
        var v = ids[sub.no];
        if (v === undefined) return;
        picks[sub.no] = v;
        total += Array.isArray(v) ? v.reduce(function (a, b) { return a + b; }, 0) : v;
      });
    });
    return { picks: picks, total: Math.round(total * 100) / 100, time: time };
  }
  function byId(id) {
    return MOCK.selections.filter(function (a) { return a.id === id; })[0];
  }

  /* s5 基本药物常规补充申请（5 个化学药品，前 3 个已有打分） */
  byId("s5").scores = {
    0: {
      u6: score("chem", { "1.1": 20, "2.1": 3.5, "2.2": [1, 0.5], "2.3": 1.5, "2.4": [0.5, 0.5], "3.1": 5, "4.1": 10, "4.2": 8, "5.1": 5, "5.2": 5, "6.1": [1, 1, 1], "6.2": 3, "6.3": 3, "7.1": 12, "7.2": 8, "7.3": 6, "7.5": 1 }, "2026-10-23 09:40"),
      u7: score("chem", { "1.1": 20, "2.1": 3, "2.2": [1, 0.5, 0.5], "2.3": 1.5, "2.4": [0.5], "3.1": 4.5, "4.1": 8, "4.2": 8, "5.1": 3, "5.2": 5, "6.1": [1, 1], "6.2": 2, "6.3": 3, "7.1": 12, "7.2": 6, "7.3": 4, "7.5": 1 }, "2026-10-23 15:12")
    },
    1: {
      u6: score("chem", { "1.1": 20, "2.1": 3, "2.2": [1, 0.5], "2.3": 1.5, "2.4": [0.5, 0.5], "3.1": 4.5, "4.1": 10, "4.2": 10, "5.1": 3, "5.2": 5, "6.1": [1, 1, 1], "6.2": 3, "6.3": 2, "7.1": 12, "7.2": 8, "7.3": 6, "7.5": 1 }, "2026-10-23 09:52")
    },
    2: {
      u6: score("chem", { "1.1": 10, "2.1": 3.5, "2.2": [0.5], "2.3": 1.5, "2.4": [0.5, 0.5, 0.5], "3.1": 4.5, "4.1": 8, "4.2": 6, "5.1": 1, "5.2": 5, "6.1": [1, 1], "6.2": 3, "6.3": 3, "7.1": 8, "7.2": 8, "7.3": 0, "7.5": 0.5 }, "2026-10-23 10:05")
    }
  };

  /* s7 季节性流感用药储备申请（奥司他韦=化学药品、连花清瘟=中成药） */
  byId("s7").scores = {
    0: {
      u6: score("chem", { "1.1": 20, "2.1": 3, "2.2": [1, 0.5], "2.3": 1.5, "2.4": [0.5, 0.5], "3.1": 5, "4.1": 8, "4.2": 8, "5.1": 3, "5.2": 5, "6.1": [1, 1, 1], "6.2": 3, "6.3": 3, "7.1": 8, "7.2": 8, "7.3": 6, "7.5": 1 }, "2026-10-19 10:12"),
      u7: score("chem", { "1.1": 20, "2.1": 3.5, "2.2": [1, 0.5, 0.5], "2.3": 1.5, "2.4": [0.5], "3.1": 4.5, "4.1": 10, "4.2": 8, "5.1": 3, "5.2": 5, "6.1": [1, 1], "6.2": 3, "6.3": 3, "7.1": 12, "7.2": 8, "7.3": 4, "7.5": 1 }, "2026-10-19 16:40")
    },
    1: {
      u6: score("tcm", { "1.1": 8, "1.2": 6, "1.3": [2], "2.1": 2.5, "2.2": [1, 0.5], "2.3": 1, "2.4": [0.5, 0.5], "3.1": 9, "4.1": 6, "4.2": 6, "5.1": 2, "5.2": [1], "6.1": [2, 1, 1, 2, 2, 2, 2], "6.2": 4, "7.1": 4, "7.2": 5, "7.3": 0, "7.4": 1, "7.5": 2 }, "2026-10-19 10:30")
    }
  };
})();

/* ==========================================================================
   药品调价：演示账号（发起人）、批次库存、调价单
   role: pharmacist=中心药房发起人（审核人复用 u3 赵敏 role:center）
   ========================================================================== */
MOCK.users.push({ id: "u4", account: "chenjing", password: "123456", name: "陈静", org: "区域中心药房", role: "pharmacist", roleName: "中心药房·发起人" });

/* 批次库存：键 = drugId + "_" + 规格下标（如 d1_0 = 阿莫西林胶囊 第0个规格） */
MOCK.batches = {
  "d1_0": [
    { batchNo: "P260301", stock: 320, purchase: 6.80, retail: 12.50, prodDate: "2026-03-12", expDate: "2028-03-11", vendor: "华北制药股份有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H13023917" },
    { batchNo: "P260502", stock: 150, purchase: 6.95, retail: 12.80, prodDate: "2026-05-08", expDate: "2028-05-07", vendor: "哈药集团制药总厂", supplier: "华润医药商业集团有限公司", approval: "国药准字H23021568" },
    { batchNo: "P260603", stock: 0, purchase: 6.90, retail: 12.80, prodDate: "2026-06-21", expDate: "2028-06-20", vendor: "石药集团中诺药业（石家庄）有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H20033293" }
  ],
  "d1_1": [
    { batchNo: "P260710", stock: 86, purchase: 5.60, retail: 10.20, prodDate: "2026-07-02", expDate: "2028-07-01", vendor: "珠海联邦制药股份有限公司中山分公司", supplier: "九州通医药集团股份有限公司", approval: "国药准字H20033458" },
    { batchNo: "P260811", stock: 210, purchase: 5.45, retail: 10.20, prodDate: "2026-08-15", expDate: "2028-08-14", vendor: "山东鲁抗医药股份有限公司", supplier: "南京医药股份有限公司", approval: "国药准字H37021153" }
  ],
  "d2_0": [
    { batchNo: "P260401", stock: 420, purchase: 8.20, retail: 15.60, prodDate: "2026-04-10", expDate: "2028-04-09", vendor: "先声药业有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H20054132" },
    { batchNo: "P260902", stock: 0, purchase: 8.35, retail: 15.60, prodDate: "2026-09-05", expDate: "2028-09-04", vendor: "海南三叶制药厂有限公司", supplier: "华润医药商业集团有限公司", approval: "国药准字H46020567" }
  ],
  "d5_0": [
    { batchNo: "P260215", stock: 260, purchase: 9.80, retail: 18.60, prodDate: "2026-02-18", expDate: "2028-02-17", vendor: "国药集团致君（深圳）制药有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H20043318" },
    { batchNo: "P260620", stock: 175, purchase: 9.60, retail: 18.60, prodDate: "2026-06-30", expDate: "2028-06-29", vendor: "丽珠集团丽珠制药厂", supplier: "九州通医药集团股份有限公司", approval: "国药准字H20044712" }
  ],
  "d6_0": [
    { batchNo: "P260110", stock: 540, purchase: 7.50, retail: 13.80, prodDate: "2026-01-20", expDate: "2028-01-19", vendor: "中美天津史克制药有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H10900089" },
    { batchNo: "P260315", stock: 320, purchase: 7.65, retail: 13.80, prodDate: "2026-03-25", expDate: "2028-03-24", vendor: "哈药集团制药总厂", supplier: "华润医药商业集团有限公司", approval: "国药准字H23025117" },
    { batchNo: "P260420", stock: 90, purchase: 7.58, retail: 14.20, prodDate: "2026-04-28", expDate: "2028-04-27", vendor: "石药集团欧意药业有限公司", supplier: "南京医药股份有限公司", approval: "国药准字H13022894" }
  ],
  "d7_0": [
    { batchNo: "P260520", stock: 680, purchase: 11.20, retail: 21.50, prodDate: "2026-05-16", expDate: "2028-05-15", vendor: "石家庄以岭药业股份有限公司", supplier: "九州通医药集团股份有限公司", approval: "国药准字Z20040063" },
    { batchNo: "P260825", stock: 230, purchase: 11.35, retail: 21.50, prodDate: "2026-08-26", expDate: "2028-08-25", vendor: "石家庄以岭药业股份有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字Z20040063" }
  ],
  /* 阿莫西林克拉维酸钾片 第2个规格：拆零关闭，仅录入整盒 */
  "d4_1": [
    { batchNo: "P260912", stock: 120, purchase: 12.60, retail: 24.00, prodDate: "2026-09-14", expDate: "2028-09-13", vendor: "华北制药股份有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H13022871" }
  ]
};

/*
 * 调价单
 * auditStatus: draft=草稿 pending=待审核 approved=审核通过 rejected=已拒绝
 * adjustStatus: pending=未调价 adjusted=已调价
 * effectType: immediate=立即生效 scheduled=定时生效
 * records: { node: 提交/审核/撤回, person, result, opinion, time }，仅已发生，时间正序
 */
MOCK.priceAdjusts = [
  {
    id: "pa1", code: "TJ20261031001",
    reason: "政策性调价", range: "全院",
    effectType: "immediate", planTime: "", actualTime: "",
    auditStatus: "draft", adjustStatus: "pending",
    creatorId: "u4", creator: "陈静", createdAt: "2026-10-31 09:20",
    items: [
      { key: "d1_0_P260301", drugId: "d1", si: 0, drugCode: "1210500301", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", specCode: "1010400101", vendor: "华北制药股份有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H13023917", batchNo: "P260301", stock: 320, prodDate: "2026-03-12", expDate: "2028-03-11", oldPurchase: 6.80, oldRetail: 12.50, newPurchase: 7.20, newRetail: 13.50 }
    ],
    records: []
  },
  {
    id: "pa2", code: "TJ20261031002",
    reason: "政策性调价", range: "全院",
    effectType: "scheduled", planTime: "2026-11-04 09:00", actualTime: "",
    auditStatus: "pending", adjustStatus: "pending",
    creatorId: "u4", creator: "陈静", createdAt: "2026-10-31 10:05",
    items: [
      { key: "d6_0_P260110", drugId: "d6", si: 0, drugCode: "1210500306", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", specCode: "1010400601", vendor: "中美天津史克制药有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H10900089", batchNo: "P260110", stock: 540, prodDate: "2026-01-20", expDate: "2028-01-19", oldPurchase: 7.50, oldRetail: 13.80, newPurchase: 7.85, newRetail: 14.50 },
      { key: "d7_0_P260520", drugId: "d7", si: 0, drugCode: "1210500307", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", specCode: "1010400701", vendor: "石家庄以岭药业股份有限公司", supplier: "九州通医药集团股份有限公司", approval: "国药准字Z20040063", batchNo: "P260520", stock: 680, prodDate: "2026-05-16", expDate: "2028-05-15", oldPurchase: 11.20, oldRetail: 21.50, newPurchase: 11.80, newRetail: 22.80 }
    ],
    records: [
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-10-31 10:05" }
    ]
  },
  {
    id: "pa3", code: "TJ20261101001",
    reason: "政策性调价", range: "全院",
    effectType: "immediate", planTime: "", actualTime: "",
    auditStatus: "pending", adjustStatus: "pending",
    creatorId: "u4", creator: "陈静", createdAt: "2026-11-01 14:40",
    items: [
      { key: "d5_0_P260215", drugId: "d5", si: 0, drugCode: "1210500305", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", specCode: "1010400501", vendor: "国药集团致君（深圳）制药有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H20043318", batchNo: "P260215", stock: 260, prodDate: "2026-02-18", expDate: "2028-02-17", oldPurchase: 9.80, oldRetail: 18.60, newPurchase: 10.20, newRetail: 19.80 }
    ],
    records: [
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-11-01 14:40" }
    ]
  },
  {
    id: "pa4", code: "TJ20261028001",
    reason: "政策性调价", range: "全院",
    effectType: "immediate", planTime: "", actualTime: "2026-10-29 09:30",
    auditStatus: "approved", adjustStatus: "adjusted",
    creatorId: "u4", creator: "陈静", createdAt: "2026-10-28 16:12",
    items: [
      { key: "d1_1_P260710", drugId: "d1", si: 1, drugCode: "1210500301", drugName: "阿莫西林胶囊", spec: "0.5g * 12粒/盒", specCode: "1010400102", vendor: "珠海联邦制药股份有限公司中山分公司", supplier: "九州通医药集团股份有限公司", approval: "国药准字H20033458", batchNo: "P260710", stock: 86, prodDate: "2026-07-02", expDate: "2028-07-01", oldPurchase: 5.60, oldRetail: 10.20, newPurchase: 5.95, newRetail: 11.00 }
    ],
    records: [
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-10-28 16:12" },
      { node: "审核", person: "赵敏", result: "通过", opinion: "—", time: "2026-10-29 09:30" }
    ]
  },
  {
    id: "pa5", code: "TJ20261029001",
    reason: "政策性调价", range: "全院",
    effectType: "scheduled", planTime: "2026-11-01 09:00", actualTime: "",
    auditStatus: "approved", adjustStatus: "pending",
    creatorId: "u4", creator: "陈静", createdAt: "2026-10-29 10:36",
    items: [
      { key: "d2_0_P260401", drugId: "d2", si: 0, drugCode: "1210500302", drugName: "阿莫西林颗粒", spec: "0.125g * 20袋/盒", specCode: "1010400201", vendor: "先声药业有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字H20054132", batchNo: "P260401", stock: 420, prodDate: "2026-04-10", expDate: "2028-04-09", oldPurchase: 8.20, oldRetail: 15.60, newPurchase: 8.60, newRetail: 16.50 },
      { key: "d6_0_P260420", drugId: "d6", si: 0, drugCode: "1210500306", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", specCode: "1010400601", vendor: "石药集团欧意药业有限公司", supplier: "南京医药股份有限公司", approval: "国药准字H13022894", batchNo: "P260420", stock: 90, prodDate: "2026-04-28", expDate: "2028-04-27", oldPurchase: 7.58, oldRetail: 14.20, newPurchase: 7.90, newRetail: 14.80 }
    ],
    records: [
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-10-29 10:36" },
      { node: "审核", person: "赵敏", result: "通过", opinion: "—", time: "2026-10-30 11:20" }
    ]
  },
  {
    id: "pa6", code: "TJ20261026001",
    reason: "政策性调价", range: "全院",
    effectType: "immediate", planTime: "", actualTime: "",
    auditStatus: "rejected", adjustStatus: "pending",
    creatorId: "u4", creator: "陈静", createdAt: "2026-10-26 09:48",
    items: [
      { key: "d7_0_P260825", drugId: "d7", si: 0, drugCode: "1210500307", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", specCode: "1010400701", vendor: "石家庄以岭药业股份有限公司", supplier: "国药控股江苏有限公司", approval: "国药准字Z20040063", batchNo: "P260825", stock: 230, prodDate: "2026-08-26", expDate: "2028-08-25", oldPurchase: 11.35, oldRetail: 21.50, newPurchase: 12.10, newRetail: 23.00 }
    ],
    records: [
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-10-26 09:48" },
      { node: "审核", person: "赵敏", result: "拒绝", opinion: "调价幅度超过政策规定上限，请重新测算。", time: "2026-10-26 15:20" },
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-10-27 10:02" },
      { node: "审核", person: "赵敏", result: "拒绝", opinion: "调后零售价与医保支付标准不一致，请核对后再次提交。", time: "2026-10-27 16:45" }
    ]
  },
  {
    id: "pa7", code: "TJ20261030001",
    reason: "政策性调价", range: "全院",
    effectType: "scheduled", planTime: "2026-11-06 09:00", actualTime: "",
    auditStatus: "draft", adjustStatus: "pending",
    creatorId: "u4", creator: "陈静", createdAt: "2026-10-30 11:26",
    items: [
      { key: "d5_0_P260620", drugId: "d5", si: 0, drugCode: "1210500305", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", specCode: "1010400501", vendor: "丽珠集团丽珠制药厂", supplier: "九州通医药集团股份有限公司", approval: "国药准字H20044712", batchNo: "P260620", stock: 175, prodDate: "2026-06-30", expDate: "2028-06-29", oldPurchase: 9.60, oldRetail: 18.60, newPurchase: 9.95, newRetail: 19.20 }
    ],
    records: [
      { node: "提交", person: "陈静", result: "已提交", opinion: "—", time: "2026-10-30 11:26" },
      { node: "撤回", person: "陈静", result: "已撤回", opinion: "—", time: "2026-10-30 17:08" }
    ]
  }
];

/* ==========================================================================
   采购管理 · 采购申请
   发起人：村室（王芳）；审核人：成员机构（李强）；中心药房不查看该页面
   status: draft/pending/approved/rejected
   items: { key, drugCode, drugName, spec, pkgSpec, vendor, qty }
   records: { node: 提交/审核/撤回, person, result, opinion, time }，仅已发生，时间正序
   ========================================================================== */
MOCK.purchaseRequests = [
  {
    id: "pr1", code: "PR20261022001",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-10-22 11:15", status: "approved",
    items: [
      { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", pkgSpec: "24粒/盒", vendor: "华北制药股份有限公司", qty: 30 },
      { key: "d2_0_0", drugCode: "1010400201", drugName: "阿莫西林颗粒", spec: "0.125g * 20袋/盒", pkgSpec: "20袋/盒", vendor: "先声药业有限公司", qty: 20 },
      { key: "d6_0_0", drugCode: "1010400601", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", pkgSpec: "20粒/盒", vendor: "中美天津史克制药有限公司", qty: 15 },
      { key: "d7_0_0", drugCode: "1010400701", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", pkgSpec: "24粒/盒", vendor: "石家庄以岭药业股份有限公司", qty: 40 }
    ],
    records: [
      { node: "提交", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-22 11:15" },
      { node: "成员机构审核", person: "李强", result: "通过", opinion: "品种与数量符合村室用药需求。", time: "2026-10-23 09:20" }
    ]
  },
  {
    id: "pr2", code: "PR20261026002",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-10-26 09:12", status: "approved",
    items: [
      { key: "d5_0_0", drugCode: "1010400501", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", pkgSpec: "12片/盒", vendor: "国药集团致君（深圳）制药有限公司", qty: 12 }
    ],
    records: [
      { node: "提交", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-26 09:12" },
      { node: "成员机构审核", person: "李强", result: "通过", opinion: "—", time: "2026-10-26 15:30" }
    ]
  },
  {
    id: "pr3", code: "PR20261028003",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-10-28 14:30", status: "pending",
    items: [
      { key: "d1_1_0", drugCode: "1010400102", drugName: "阿莫西林胶囊", spec: "0.5g * 12粒/盒", pkgSpec: "12粒/盒", vendor: "石药集团中诺药业（石家庄）有限公司", qty: 25 },
      { key: "d2_1_0", drugCode: "1010400202", drugName: "阿莫西林颗粒", spec: "0.25g * 12袋/盒", pkgSpec: "12袋/盒", vendor: "华北制药股份有限公司", qty: 18 },
      { key: "d6_0_0", drugCode: "1010400601", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", pkgSpec: "20粒/盒", vendor: "中美天津史克制药有限公司", qty: 10 }
    ],
    records: [
      { node: "提交", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-28 14:30" }
    ]
  },
  {
    id: "pr4", code: "PR20261029004",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-10-29 10:05", status: "rejected",
    items: [
      { key: "d7_0_0", drugCode: "1010400701", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", pkgSpec: "24粒/盒", vendor: "石家庄以岭药业股份有限公司", qty: 60 },
      { key: "d5_0_0", drugCode: "1010400501", drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒", pkgSpec: "12片/盒", vendor: "国药集团致君（深圳）制药有限公司", qty: 20 }
    ],
    records: [
      { node: "提交", person: "王芳", result: "已提交", opinion: "—", time: "2026-10-29 10:05" },
      { node: "成员机构审核", person: "李强", result: "拒绝", opinion: "连花清瘟胶囊申请量超出村室季度用量，请核减后重新提交。", time: "2026-10-29 16:48" }
    ]
  },
  {
    id: "pr5", code: "PR20261030005",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-10-30 16:20", status: "draft",
    items: [
      { key: "d1_0_0", drugCode: "1010400101", drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", pkgSpec: "24粒/盒", vendor: "华北制药股份有限公司", qty: 20 }
    ],
    records: []
  },
  {
    id: "pr6", code: "PR20261101006",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-11-01 09:40", status: "pending",
    items: [
      { key: "d7_0_0", drugCode: "1010400701", drugName: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", pkgSpec: "24粒/盒", vendor: "石家庄以岭药业股份有限公司", qty: 30 }
    ],
    records: [
      { node: "提交", person: "王芳", result: "已提交", opinion: "—", time: "2026-11-01 09:40" }
    ]
  },
  {
    id: "pr7", code: "PR20261102007",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-11-02 08:30", status: "draft",
    items: [
      { key: "d2_0_0", drugCode: "1010400201", drugName: "阿莫西林颗粒", spec: "0.125g * 20袋/盒", pkgSpec: "20袋/盒", vendor: "先声药业有限公司", qty: 12 },
      { key: "d6_0_0", drugCode: "1010400601", drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", pkgSpec: "20粒/盒", vendor: "中美天津史克制药有限公司", qty: 8 }
    ],
    records: []
  }
];

/* ==========================================================================
   调拨管理：药房、库位、追溯码、调拨单
   ========================================================================== */

/* 机构 → 药房映射 */
MOCK.pharmacies = {
  "org-c":  [{ id: "ph-c1", name: "中心药房·一号库" }, { id: "ph-c2", name: "中心药房·二号库" }],
  "org-a1": [{ id: "ph-a1-1", name: "XX社区·门诊药房" }, { id: "ph-a1-2", name: "XX社区·急诊药房" }],
  "org-a2": [{ id: "ph-a2-1", name: "YY人民医院·住院药房" }, { id: "ph-a2-2", name: "YY人民医院·门诊药房" }],
  "org-a3": [{ id: "ph-a3-1", name: "ZZ中西医·中药房" }],
  "village-1": [{ id: "ph-v1", name: "青河村卫生室·药房" }],
  "member-1": [{ id: "ph-m1-1", name: "城东社区·门诊药房" }, { id: "ph-m1-2", name: "城东社区·公共卫生药房" }]
};

/* 药房 → 库位映射 */
MOCK.locations = {
  "ph-c1":   [{ id: "loc-c1-A", name: "A区-01" }, { id: "loc-c1-B", name: "B区-03" }],
  "ph-c2":   [{ id: "loc-c2-A", name: "A区-05" }],
  "ph-a1-1": [{ id: "loc-a1-1-A", name: "门诊区-A1" }, { id: "loc-a1-1-B", name: "门诊区-B2" }],
  "ph-a1-2": [{ id: "loc-a1-2-A", name: "急诊区-A1" }],
  "ph-a2-1": [{ id: "loc-a2-1-A", name: "住院区-A1" }, { id: "loc-a2-1-B", name: "住院区-B2" }],
  "ph-a2-2": [{ id: "loc-a2-2-A", name: "门诊区-A1" }],
  "ph-a3-1": [{ id: "loc-a3-1-A", name: "中药区-A1" }],
  "ph-v1":   [{ id: "loc-v1-A", name: "西药柜-A1" }, { id: "loc-v1-B", name: "中成药柜-B2" }],
  "ph-m1-1": [{ id: "loc-m1-1-A", name: "门诊区-A1" }, { id: "loc-m1-1-B", name: "门诊区-B2" }],
  "ph-m1-2": [{ id: "loc-m1-2-A", name: "公卫区-A1" }]
};

/* 追溯码：键 = drugId + "_" + 规格下标 + "_" + 批次号 */
(function buildTraceCodes() {
  MOCK.traceCodes = {};
  var batches = MOCK.batches || {};
  Object.keys(batches).forEach(function (k) {
    batches[k].forEach(function (b) {
      var key = k + "_" + b.batchNo;
      var codes = [];
      for (var i = 1; i <= Math.min(b.stock, 80); i++) {
        codes.push("TRC" + b.batchNo + String(i).padStart(4, "0"));
      }
      MOCK.traceCodes[key] = codes;
    });
  });
})();

/*
 * 调拨单种子数据
 * auditStatus: draft/member/center/approved/rejected
 * transferStatus: 待调拨/待签收/已完成
 * createType: village/member
 * nextStep: direct-outbound/center-review
 */
MOCK.transfers = [
  {
    id: "t1", code: "DB20261101001",
    createType: "village",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    applyPharmacy: "ph-v1", applyPharmacyName: "青河村卫生室·药房",
    applyLocation: "loc-v1-A", applyLocationName: "西药柜-A1",
    shortageDesc: "近期村民就诊量增加，阿莫西林库存不足",
    createdAt: "2026-11-01 09:30",
    auditStatus: "member", transferStatus: "",
    outOrg: "", outOrgName: "", outPharmacy: "", outLocation: "",
    outCode: "", inCode: "", nextStep: "",
    items: [
      { drugId: "d1", drugCode: "1210500301", drugName: "阿莫西林胶囊", specCode: "1010400101", spec: "0.25g * 24粒/盒", stock: 23, applyQty: 50 },
      { drugId: "d6", drugCode: "1210500306", drugName: "布洛芬缓释胶囊", specCode: "1010400601", spec: "0.3g * 20粒/盒", stock: 8, applyQty: 30 }
    ], batches: [], records: [
      { node: "提交", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-11-01 09:30" }
    ]
  },
  {
    id: "t2", code: "DB20261030002",
    createType: "village",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    applyPharmacy: "ph-v1", applyPharmacyName: "青河村卫生室·药房",
    applyLocation: "loc-v1-A", applyLocationName: "西药柜-A1",
    shortageDesc: "",
    createdAt: "2026-10-30 14:15",
    auditStatus: "center", transferStatus: "",
    outOrg: "", outOrgName: "", outPharmacy: "", outLocation: "",
    outCode: "", inCode: "", nextStep: "center-review",
    items: [
      { drugId: "d1", drugCode: "1210500301", drugName: "阿莫西林胶囊", specCode: "1010400101", spec: "0.25g * 24粒/盒", stock: 15, applyQty: 40 },
      { drugId: "d2", drugCode: "1210500302", drugName: "阿莫西林颗粒", specCode: "1010400201", spec: "0.125g * 20袋/盒", stock: 0, applyQty: 20 }
    ], batches: [], records: [
      { node: "提交", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-10-30 14:15" },
      { node: "成员机构审核", person: "李强", org: "城东社区卫生服务中心", result: "同意", opinion: "同意，转中心药房复核。", time: "2026-10-31 09:20" }
    ]
  },
  {
    id: "t3", code: "DB20261028003",
    createType: "member",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    applyPharmacy: "ph-m1-1", applyPharmacyName: "城东社区·门诊药房",
    applyLocation: "loc-m1-1-A", applyLocationName: "门诊区-A1",
    shortageDesc: "冬季流感高发，布洛芬库存告急",
    createdAt: "2026-10-28 10:00",
    auditStatus: "rejected", transferStatus: "",
    outOrg: "", outOrgName: "", outPharmacy: "", outLocation: "",
    outCode: "", inCode: "", nextStep: "",
    items: [
      { drugId: "d6", drugCode: "1210500306", drugName: "布洛芬缓释胶囊", specCode: "1010400601", spec: "0.3g * 20粒/盒", stock: 0, applyQty: 100 },
      { drugId: "d7", drugCode: "1210500307", drugName: "连花清瘟胶囊", specCode: "1010400701", spec: "0.35g * 24粒/盒", stock: 5, applyQty: 80 }
    ], batches: [], records: [
      { node: "提交", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-10-28 10:00" },
      { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "拒绝", opinion: "布洛芬缓释胶囊近期有大量调拨申请，请各机构按需提报，避免占用公共库存资源。", time: "2026-10-29 15:40" }
    ]
  },
  {
    id: "t4", code: "DB20261025004",
    createType: "village",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    applyPharmacy: "ph-v1", applyPharmacyName: "青河村卫生室·药房",
    applyLocation: "loc-v1-B", applyLocationName: "中成药柜-B2",
    shortageDesc: "",
    createdAt: "2026-10-25 08:45",
    auditStatus: "approved", transferStatus: "待调拨",
    outOrg: "member-1", outOrgName: "城东社区卫生服务中心", outPharmacy: "ph-m1-2", outPharmacyName: "城东社区·公共卫生药房", outLocation: "loc-m1-2-A", outLocationName: "公卫区-A1",
    outCode: "", inCode: "", nextStep: "direct-outbound",
    items: [
      { drugId: "d7", drugCode: "1210500307", drugName: "连花清瘟胶囊", specCode: "1010400701", spec: "0.35g * 24粒/盒", stock: 2, applyQty: 30 }
    ], batches: [], records: [
      { node: "提交", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-10-25 08:45" },
      { node: "成员机构审核", person: "李强", org: "城东社区卫生服务中心", result: "同意（直接出库）", opinion: "村室流感备药合理，我机构直接出库。", time: "2026-10-25 15:10" }
    ]
  },
  {
    id: "t5", code: "DB20261022005",
    createType: "member",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    applyPharmacy: "ph-m1-1", applyPharmacyName: "城东社区·门诊药房",
    applyLocation: "loc-m1-1-B", applyLocationName: "门诊区-B2",
    shortageDesc: "儿童抗生素需求增加",
    createdAt: "2026-10-22 16:30",
    auditStatus: "approved", transferStatus: "待签收",
    outOrg: "org-c", outOrgName: "区域中心药房", outPharmacy: "ph-c1", outPharmacyName: "中心药房·一号库", outLocation: "loc-c1-A", outLocationName: "A区-01",
    outCode: "CK20261024001", inCode: "", nextStep: "",
    items: [
      { drugId: "d1", drugCode: "1210500301", drugName: "阿莫西林胶囊", specCode: "1010400101", spec: "0.25g * 24粒/盒", stock: 35, applyQty: 80 },
      { drugId: "d2", drugCode: "1210500302", drugName: "阿莫西林颗粒", specCode: "1010400201", spec: "0.125g * 20袋/盒", stock: 12, applyQty: 40 }
    ],
    batches: [
      { key: "d1_0", drugId: "d1", si: 0, drugCode: "1210500301", drugName: "阿莫西林胶囊", specCode: "1010400101", spec: "0.25g * 24粒/盒", applyQty: 80,
        rows: [
          { batchNo: "P260301", vendor: "华北制药股份有限公司", stock: 320, purchase: 6.80, retail: 12.50, expDate: "2028-03-11", outQty: 50, traceCodes: ["TRCP2603010001","TRCP2603010002","TRCP2603010003","TRCP2603010004","TRCP2603010005","TRCP2603010006","TRCP2603010007","TRCP2603010008","TRCP2603010009","TRCP2603010010","TRCP2603010011","TRCP2603010012","TRCP2603010013","TRCP2603010014","TRCP2603010015","TRCP2603010016","TRCP2603010017","TRCP2603010018","TRCP2603010019","TRCP2603010020","TRCP2603010021","TRCP2603010022","TRCP2603010023","TRCP2603010024","TRCP2603010025","TRCP2603010026","TRCP2603010027","TRCP2603010028","TRCP2603010029","TRCP2603010030","TRCP2603010031","TRCP2603010032","TRCP2603010033","TRCP2603010034","TRCP2603010035","TRCP2603010036","TRCP2603010037","TRCP2603010038","TRCP2603010039","TRCP2603010040","TRCP2603010041","TRCP2603010042","TRCP2603010043","TRCP2603010044","TRCP2603010045","TRCP2603010046","TRCP2603010047","TRCP2603010048","TRCP2603010049","TRCP2603010050"] },
          { batchNo: "P260502", vendor: "哈药集团制药总厂", stock: 150, purchase: 6.95, retail: 12.80, expDate: "2028-05-07", outQty: 30, traceCodes: ["TRCP2605020001","TRCP2605020002","TRCP2605020003","TRCP2605020004","TRCP2605020005","TRCP2605020006","TRCP2605020007","TRCP2605020008","TRCP2605020009","TRCP2605020010","TRCP2605020011","TRCP2605020012","TRCP2605020013","TRCP2605020014","TRCP2605020015","TRCP2605020016","TRCP2605020017","TRCP2605020018","TRCP2605020019","TRCP2605020020","TRCP2605020021","TRCP2605020022","TRCP2605020023","TRCP2605020024","TRCP2605020025","TRCP2605020026","TRCP2605020027","TRCP2605020028","TRCP2605020029","TRCP2605020030"] }
        ]
      },
      { key: "d2_0", drugId: "d2", si: 0, drugCode: "1210500302", drugName: "阿莫西林颗粒", specCode: "1010400201", spec: "0.125g * 20袋/盒", applyQty: 40,
        rows: [
          { batchNo: "P260401", vendor: "先声药业有限公司", stock: 420, purchase: 8.20, retail: 15.60, expDate: "2028-04-09", outQty: 40, traceCodes: ["TRCP2604010001","TRCP2604010002","TRCP2604010003","TRCP2604010004","TRCP2604010005","TRCP2604010006","TRCP2604010007","TRCP2604010008","TRCP2604010009","TRCP2604010010","TRCP2604010011","TRCP2604010012","TRCP2604010013","TRCP2604010014","TRCP2604010015","TRCP2604010016","TRCP2604010017","TRCP2604010018","TRCP2604010019","TRCP2604010020","TRCP2604010021","TRCP2604010022","TRCP2604010023","TRCP2604010024","TRCP2604010025","TRCP2604010026","TRCP2604010027","TRCP2604010028","TRCP2604010029","TRCP2604010030","TRCP2604010031","TRCP2604010032","TRCP2604010033","TRCP2604010034","TRCP2604010035","TRCP2604010036","TRCP2604010037","TRCP2604010038","TRCP2604010039","TRCP2604010040"] }
        ]
      }
    ], records: [
      { node: "提交", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-10-22 16:30" },
      { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "同意", opinion: "—", time: "2026-10-23 09:15" },
      { node: "出库", person: "赵敏", org: "区域中心药房", result: "出库完成", opinion: "—", time: "2026-10-24 14:20" }
    ]
  },
  {
    id: "t6", code: "DB20261018006",
    createType: "village",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    applyPharmacy: "ph-v1", applyPharmacyName: "青河村卫生室·药房",
    applyLocation: "loc-v1-A", applyLocationName: "西药柜-A1",
    shortageDesc: "",
    createdAt: "2026-10-18 11:00",
    auditStatus: "approved", transferStatus: "已完成",
    outOrg: "org-c", outOrgName: "区域中心药房", outPharmacy: "ph-c1", outPharmacyName: "中心药房·一号库", outLocation: "loc-c1-A", outLocationName: "A区-01",
    outCode: "CK20261019001", inCode: "RK20261020001", nextStep: "",
    items: [
      { drugId: "d5", drugCode: "1210500305", drugName: "头孢呋辛酯片", specCode: "1010400501", spec: "0.25g * 12片/盒", stock: 18, applyQty: 30 }
    ],
    batches: [
      { key: "d5_0", drugId: "d5", si: 0, drugCode: "1210500305", drugName: "头孢呋辛酯片", specCode: "1010400501", spec: "0.25g * 12片/盒", applyQty: 30,
        rows: [
          { batchNo: "P260215", vendor: "国药集团致君（深圳）制药有限公司", stock: 260, purchase: 9.80, retail: 18.60, expDate: "2028-02-17", outQty: 30, traceCodes: ["TRCP2602150001","TRCP2602150002","TRCP2602150003","TRCP2602150004","TRCP2602150005","TRCP2602150006","TRCP2602150007","TRCP2602150008","TRCP2602150009","TRCP2602150010","TRCP2602150011","TRCP2602150012","TRCP2602150013","TRCP2602150014","TRCP2602150015","TRCP2602150016","TRCP2602150017","TRCP2602150018","TRCP2602150019","TRCP2602150020","TRCP2602150021","TRCP2602150022","TRCP2602150023","TRCP2602150024","TRCP2602150025","TRCP2602150026","TRCP2602150027","TRCP2602150028","TRCP2602150029","TRCP2602150030"], inQty: 29, badQty: 1, badReason: "包装不合格", badCodes: ["TRCP2602150015"] }
        ]
      }
    ], records: [
      { node: "提交", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-10-18 11:00" },
      { node: "成员机构审核", person: "李强", org: "城东社区卫生服务中心", result: "同意", opinion: "—", time: "2026-10-18 15:20" },
      { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "同意", opinion: "—", time: "2026-10-19 09:30" },
      { node: "出库", person: "赵敏", org: "区域中心药房", result: "出库完成", opinion: "—", time: "2026-10-19 16:00" },
      { node: "入库", person: "王芳", org: "青河村卫生室", result: "入库完成", opinion: "—", time: "2026-10-20 10:15" }
    ]
  },
  {
    id: "t7", code: "DB20261102007",
    createType: "village",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    applyPharmacy: "ph-v1", applyPharmacyName: "青河村卫生室·药房",
    applyLocation: "loc-v1-A", applyLocationName: "西药柜-A1",
    shortageDesc: "慢性病常用药库存不足",
    createdAt: "2026-11-02 10:20",
    auditStatus: "draft", transferStatus: "",
    outOrg: "", outOrgName: "", outPharmacy: "", outLocation: "",
    outCode: "", inCode: "", nextStep: "",
    items: [
      { drugId: "d1", drugCode: "1210500301", drugName: "阿莫西林胶囊", specCode: "1010400101", spec: "0.25g * 24粒/盒", stock: 5, applyQty: 25 }
    ], batches: [], records: []
  },
  {
    id: "t8", code: "DB20261103008",
    createType: "member",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    applyPharmacy: "ph-m1-1", applyPharmacyName: "城东社区·门诊药房",
    applyLocation: "loc-m1-1-A", applyLocationName: "门诊区-A1",
    shortageDesc: "",
    createdAt: "2026-11-03 08:50",
    auditStatus: "draft", transferStatus: "",
    outOrg: "", outOrgName: "", outPharmacy: "", outLocation: "",
    outCode: "", inCode: "", nextStep: "",
    items: [], batches: [], records: []
  }
];

/* ==========================================================================
   药品预警 · 药品高低储设置
   ========================================================================== */

/* 自动更新规则（库存上下限 = 日均销量 × 系数）
   使用方式：spec 级引用，ruleUseCount 记录被引用次数 */
MOCK.stockRules = [
  { id: "r1", name: "感冒类药品自动补货规则", updateType: "sales", timeMode: "days", days: 30, startDate: "", endDate: "", upperCoef: 4.2, lowerCoef: 1.5 },
  { id: "r2", name: "常用慢性病药品补货规则", updateType: "sales", timeMode: "days", days: 90, startDate: "", endDate: "", upperCoef: 5.0, lowerCoef: 2.0 },
  { id: "r3", name: "抗生素类药品补货规则", updateType: "sales", timeMode: "range", days: 0, startDate: "2026-08-01", endDate: "2026-10-31", upperCoef: 3.8, lowerCoef: 1.2 }
];

/* 规则被引用次数统计（规则管理抽屉删除时使用） */
MOCK.ruleRefCount = { r1: 2, r2: 3, r3: 0 };

/* AI 建议原因模板（根据药品消耗、当前库存、配送周期等推导） */
MOCK.aiReasonTemplates = [
  {
    summary: "建议适当提高该药品的最低库存和最高库存。近期该药品消耗量呈增长趋势，当前最低库存设置偏低，结合药品配送周期，存在一定的缺货风险。",
    points: [
      "近期药品消耗量持续增长：近30天消耗量为{recent}，日均消耗{daily}；近90天日均消耗约{prevDaily}，近期消耗水平较此前增长约{growth}。",
      "当前库存上下限偏低：近期日均消耗{daily}，按{cycle}天的库存保障周期计算，建议最高库存为{aiMax}。当前最高库存{curMax}，可能无法满足近期需求增长情况下的库存储备需要。"
    ]
  },
  {
    summary: "建议适当下调该药品的库存上限。近90天消耗量呈平稳或下降趋势，当前库存上限偏高，占用了不必要的仓储空间和资金。",
    points: [
      "近期药品消耗量较为平稳：近30天日均消耗{daily}，近90天日均消耗约{prevDaily}，整体消耗水平稳定。",
      "当前库存上限偏高：建议最高库存为{aiMax}，当前设置{curMax}，存在一定库存积压风险。"
    ]
  },
  {
    summary: "当前库存上下限设置基本合理，AI微调建议如下：基于近期销售趋势和配送周期，建议小幅调整以优化库存周转效率。",
    points: [
      "近期消耗平稳：近30天日均消耗{daily}，近90天日均消耗约{prevDaily}。",
      "建议小幅调整：将库存上限从{curMax}调整为{aiMax}，下限从{curMin}调整为{aiMin}。"
    ]
  }
];

/* AI 建议原因详情：每行一条，上下限共用同一条原因 */
MOCK.aiReasons = {
  "d1_0": { tpl: 0, recent: "180盒", daily: "6盒", prevDaily: "4盒", growth: "50%", cycle: "20", aiMax: 120, aiMin: 30 },
  "d1_1": { tpl: 2, recent: "60盒", daily: "2盒", prevDaily: "2盒", growth: "0%", cycle: "15", aiMax: 40, aiMin: 8 },
  "d2_0": { tpl: 0, recent: "240盒", daily: "8盒", prevDaily: "5盒", growth: "60%", cycle: "15", aiMax: 120, aiMin: 40 },
  "d5_0": { tpl: 0, recent: "90盒", daily: "3盒", prevDaily: "2盒", growth: "50%", cycle: "20", aiMax: 70, aiMin: 20 },
  "d6_0": { tpl: 0, recent: "300盒", daily: "10盒", prevDaily: "6盒", growth: "67%", cycle: "15", aiMax: 160, aiMin: 50 },
  "d7_0": { tpl: 0, recent: "450盒", daily: "15盒", prevDaily: "8盒", growth: "88%", cycle: "15", aiMax: 240, aiMin: 80 },
  "d8_0": { tpl: 1, recent: "80袋", daily: "2.7袋", prevDaily: "3袋", growth: "-10%", cycle: "30", aiMax: 60, aiMin: 10 },
  "d5_1": { tpl: 2, recent: "45盒", daily: "1.5盒", prevDaily: "1.5盒", growth: "0%", cycle: "20", aiMax: 30, aiMin: 8 }
};

/*
 * 品规级高低储数据
 * key = drugId + "_" + specIdx
 * updateMode: manual / auto / ai
 * ruleId: auto 时关联 MOCK.stockRules 的 id
 */
MOCK.stockLevels = {
  "d1_0": { stock: 180, upper: 100, lower: 20, unit: "盒", updateMode: "manual", ruleId: "", aiUpper: 120, aiLower: 30 },
  "d1_1": { stock: 86,  upper: 40,  lower: 10, unit: "盒", updateMode: "auto",   ruleId: "r3", aiUpper: 40, aiLower: 8 },
  "d2_0": { stock: 420, upper: 200, lower: 50, unit: "盒", updateMode: "ai",     ruleId: "",    aiUpper: 120, aiLower: 40 },
  "d2_1": { stock: 0,   upper: 30,  lower: 5,  unit: "盒", updateMode: "manual", ruleId: "",    aiUpper: 24, aiLower: 6 },
  "d3_0": { stock: 15,  upper: 20,  lower: 5,  unit: "盒", updateMode: "auto",   ruleId: "r2", aiUpper: 18, aiLower: 4 },
  "d4_0": { stock: 0,   upper: 15,  lower: 3,  unit: "盒", updateMode: "manual", ruleId: "",    aiUpper: 12, aiLower: 3 },
  "d5_0": { stock: 435, upper: 80,  lower: 15, unit: "盒", updateMode: "auto",   ruleId: "r1", aiUpper: 70, aiLower: 20 },
  "d5_1": { stock: 175, upper: 35,  lower: 8,  unit: "盒", updateMode: "ai",     ruleId: "",    aiUpper: 30, aiLower: 8 },
  "d6_0": { stock: 950, upper: 300, lower: 80, unit: "盒", updateMode: "manual", ruleId: "",    aiUpper: 160, aiLower: 50 },
  "d7_0": { stock: 910, upper: 400, lower: 100,unit: "盒", updateMode: "ai",     ruleId: "",    aiUpper: 240, aiLower: 80 },
  "d8_0": { stock: 25,  upper: 80,  lower: 15, unit: "袋", updateMode: "auto",   ruleId: "r2", aiUpper: 60, aiLower: 10 }
};

/* 高低储预警页补充数据（仅新增 key，不动上方已有数据）：
   d1_2 实际超下限但 AI 判未超限（不一致样例）；d4_1 双未超限；d9_0 实际未超限但 AI 判超上限（不一致样例） */
Object.assign(MOCK.stockLevels, {
  "d1_2": { stock: 4,  upper: 30, lower: 8,  unit: "盒", updateMode: "manual", ruleId: "",    aiUpper: 25, aiLower: 2 },
  "d4_1": { stock: 22, upper: 40, lower: 10, unit: "盒", updateMode: "auto",   ruleId: "r1",  aiUpper: 35, aiLower: 12 },
  "d9_0": { stock: 26, upper: 30, lower: 5,  unit: "盒", updateMode: "manual", ruleId: "",    aiUpper: 20, aiLower: 8 }
});

Object.assign(MOCK.aiReasons, {
  "d2_1": { tpl: 0, recent: "20盒", daily: "0.8盒", prevDaily: "0.6盒", growth: "33%", cycle: "15", aiMax: 24, aiMin: 6 },
  "d3_0": { tpl: 2, recent: "45盒", daily: "1.5盒", prevDaily: "1.5盒", growth: "0%", cycle: "20", aiMax: 18, aiMin: 4 },
  "d4_0": { tpl: 0, recent: "15盒", daily: "0.5盒", prevDaily: "0.4盒", growth: "25%", cycle: "20", aiMax: 12, aiMin: 3 },
  "d1_2": { tpl: 2, recent: "30盒", daily: "1盒", prevDaily: "1盒", growth: "0%", cycle: "15", aiMax: 25, aiMin: 2 },
  "d4_1": { tpl: 2, recent: "66盒", daily: "2.2盒", prevDaily: "2盒", growth: "10%", cycle: "15", aiMax: 35, aiMin: 12 },
  "d9_0": { tpl: 1, recent: "78盒", daily: "2.6盒", prevDaily: "2.4盒", growth: "8%", cycle: "15", aiMax: 20, aiMin: 8 }
});

/* ==========================================================================
   处方管理 · 西药处方开具
   rxDrugs：门诊处方药品字典（price 为包装单位零售价，pkgFactor 为每包装单位可拆零数）
   rxOrders：演示医嘱数据
     status  unsent=未发送 / pending=待审核 / sent=已发送 / void=已作废
     mark    西药 / 成药（中成药）
   ========================================================================== */
MOCK.rxDrugs = [
  { key: "rx1", name: "六神丸", spec: "10粒*12支/盒", specCode: "311013830201", kind: "中成药", py: "LSL",
    pkgUnit: "盒", pkgFactor: 120, doseUnit: "粒", price: 26.45, stock: 24,
    insClass: "甲类", insFlag: "YB", insCode: "ZT04AAS0184010102766", insName: "六神丸" },
  { key: "rx2", name: "阿胶片", spec: "复方*20片/袋", specCode: "311013831202", kind: "西药", py: "AJP",
    pkgUnit: "袋", pkgFactor: 20, doseUnit: "片", price: 12.12, stock: 58,
    insClass: "甲类", insFlag: "YB", insCode: "XB03BAF0532010102766", insName: "复方阿胶浆" },
  { key: "rx3", name: "阿莫西林胶囊", spec: "0.25g*24粒/盒", specCode: "311013830301", kind: "西药", py: "AMXLJN",
    pkgUnit: "盒", pkgFactor: 24, doseUnit: "粒", price: 12.50, stock: 180,
    insClass: "甲类", insFlag: "YB", insCode: "XJ01CA0401010101032", insName: "阿莫西林胶囊" },
  { key: "rx4", name: "头孢呋辛酯片", spec: "0.125g*12片/盒", specCode: "311013830401", kind: "西药", py: "TBFXZP",
    pkgUnit: "盒", pkgFactor: 12, doseUnit: "片", price: 18.60, stock: 96,
    insClass: "乙类", insFlag: "YB", insCode: "XJ01DC0201010101032", insName: "头孢呋辛酯片" },
  { key: "rx5", name: "布洛芬缓释胶囊", spec: "0.3g*20粒/盒", specCode: "311013830501", kind: "西药", py: "BLFHSJN",
    pkgUnit: "盒", pkgFactor: 20, doseUnit: "粒", price: 13.80, stock: 950,
    insClass: "甲类", insFlag: "YB", insCode: "XM01AE0101010101032", insName: "布洛芬缓释胶囊" },
  { key: "rx6", name: "连花清瘟胶囊", spec: "0.35g*24粒/盒", specCode: "311013830601", kind: "中成药", py: "LHQWJN",
    pkgUnit: "盒", pkgFactor: 24, doseUnit: "粒", price: 21.50, stock: 910,
    insClass: "甲类", insFlag: "YB", insCode: "ZT04AAAL0001010101032", insName: "连花清瘟胶囊" },
  { key: "rx7", name: "蒙脱石散", spec: "3g*10袋/盒", specCode: "311013830701", kind: "西药", py: "MTSS",
    pkgUnit: "盒", pkgFactor: 10, doseUnit: "袋", price: 16.80, stock: 126,
    insClass: "甲类", insFlag: "YB", insCode: "XA07BC0501010101032", insName: "蒙脱石散" },
  { key: "rx8", name: "维生素C片", spec: "100mg*100片/瓶", specCode: "311013830801", kind: "西药", py: "WSSCP",
    pkgUnit: "瓶", pkgFactor: 100, doseUnit: "片", price: 8.90, stock: 210,
    insClass: "自费", insFlag: "自费", insCode: "", insName: "维生素C片" },
  { key: "rx9", name: "甲硝唑片", spec: "0.2g*100片/瓶", specCode: "311013830901", kind: "西药", py: "JXZP",
    pkgUnit: "瓶", pkgFactor: 100, doseUnit: "片", price: 6.50, stock: 88,
    insClass: "甲类", insFlag: "YB", insCode: "XJ01XD0101010101032", insName: "甲硝唑片" },
  { key: "rx10", name: "藿香正气水", spec: "10ml*10支/盒", specCode: "311013831001", kind: "中成药", py: "HXZQS",
    pkgUnit: "盒", pkgFactor: 10, doseUnit: "支", price: 9.80, stock: 64,
    insClass: "甲类", insFlag: "YB", insCode: "ZT02AAF0001010101032", insName: "藿香正气水" }
];

MOCK.rxOrders = [
  { id: "rxo1", status: "unsent", mark: "成药", time: "2026-11-04 19:06:45",
    drugKey: "rx1", drugName: "六神丸", spec: "10粒*12支/盒", specCode: "311013830201",
    groupNo: "", dose: 10, doseUnit: "粒", freq: "qd", route: "口服", days: 1,
    drip: "", dripUnit: "滴/分", total: 1, totalUnit: "盒",
    price: 26.45, amount: 26.45, pharmacy: "中药房",
    insFlag: "YB", insClass: "甲类", insCode: "ZT04AAS0184010102766", insName: "六神丸", note: "" },
  { id: "rxo2", status: "pending", mark: "西药", time: "2026-11-04 19:07:59",
    drugKey: "rx2", drugName: "阿胶片", spec: "复方*20片/袋", specCode: "311013831202",
    groupNo: "", dose: 5, doseUnit: "片", freq: "tid", route: "口服", days: 5,
    drip: "", dripUnit: "滴/分", total: 4, totalUnit: "袋",
    price: 12.12, amount: 48.48, pharmacy: "西药房",
    insFlag: "YB", insClass: "甲类", insCode: "XB03BAF0532010102766", insName: "复方阿胶浆", note: "" }
];

/* 药品选择弹窗的补充展示字段（剂型 / 拆零 / 属性 / 抗菌素级别 / 自付比例 / 基药 / 医保说明） */
var RX_EXTRA = {
  rx1:  { form: "丸剂",   split: "是", essential: "是", anti: "非抗生素",    selfPay: 0,   insDesc: "限儿童" },
  rx2:  { form: "片剂",   split: "是", essential: "是", anti: "非抗生素",    selfPay: 0,   insDesc: "限贫血" },
  rx3:  { form: "胶囊剂", split: "是", essential: "是", anti: "限制使用级",  selfPay: 0,   insDesc: "无" },
  rx4:  { form: "片剂",   split: "是", essential: "是", anti: "限制使用级",  selfPay: 0.1, insDesc: "限二线用药" },
  rx5:  { form: "胶囊剂", split: "是", essential: "否", anti: "非抗生素",    selfPay: 0,   insDesc: "无" },
  rx6:  { form: "胶囊剂", split: "是", essential: "是", anti: "非抗生素",    selfPay: 0,   insDesc: "限流感" },
  rx7:  { form: "散剂",   split: "是", essential: "是", anti: "非抗生素",    selfPay: 0,   insDesc: "无" },
  rx8:  { form: "片剂",   split: "是", essential: "否", anti: "非抗生素",    selfPay: 0,   insDesc: "全自费" },
  rx9:  { form: "片剂",   split: "是", essential: "是", anti: "非抗生素",    selfPay: 0,   insDesc: "无" },
  rx10: { form: "口服液", split: "否", essential: "是", anti: "非抗生素",    selfPay: 0,   insDesc: "无" }
};
MOCK.rxDrugs.forEach(function (d) {
  var e = RX_EXTRA[d.key] || {};
  d.form = e.form || "片剂";
  d.split = e.split || "否";
  d.model = "—";
  d.location = d.kind === "中成药" ? "中药房" : "西药房";
  /* 药品所属药房：仅所选药房的药品可在医嘱中被检索、选择 */
  d.pharm = d.location;
  d.attr = "普通";
  d.antibiotic = e.anti || "非抗生素";
  d.selfPay = e.selfPay === undefined ? 0 : e.selfPay;
  d.essential = e.essential || "否";
  d.insDesc = e.insDesc || "无";
});

/* ==========================================================================
   处方管理 · 中医药处方开具
   tcmHerbs：中药药品字典（price 为每 g / 每袋零售价）
     kind   中药饮片 / 配方颗粒 / 中药直服饮片
     unit   g（饮片） / 袋（颗粒、直服饮片）
   tcmUsage：药味脚注（煎服法），下拉单选
   diagnoses：门诊诊断（中医），下拉来源
   tcmSeed：演示用处方草稿（6 味药，剂数 3，药品重量 36g）
   ========================================================================== */
MOCK.tcmUsage = ["炒焦", "冲服", "布包", "后下", "炒", "炙", "杵", "吸氧用", "研粉浴足", "两日一剂", "熏药", "外用"];

MOCK.tcmHerbs = [
  /* 中药饮片（规格 1g/g，价格元/g） */
  { key: "tcm01", name: "白芷",   spec: "1g/g", kind: "中药饮片", py: "BZ",  price: 0.092, stock: 243,  attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "安徽道源堂中药饮片有限公司" },
  { key: "tcm02", name: "薄荷",   spec: "1g/g", kind: "中药饮片", py: "BH",  price: 0.022, stock: 199,  attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "安徽华鼎堂中药饮片有限公司" },
  { key: "tcm03", name: "藁本",   spec: "1g/g", kind: "中药饮片", py: "GB",  price: 0.135, stock: 410,  attr: "普通药品", insLevel: "乙类", insNote: "—", vendor: "安徽省金芙蓉中药饮片有限公司" },
  { key: "tcm04", name: "白薇",   spec: "1g/g", kind: "中药饮片", py: "BW",  price: 0.026, stock: 770,  attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "安徽华鼎堂中药饮片有限公司" },
  { key: "tcm05", name: "白英",   spec: "1g/g", kind: "中药饮片", py: "BY",  price: 0.016, stock: 1360, attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "安徽道源堂中药饮片有限公司" },
  { key: "tcm06", name: "黄柏",   spec: "1g/g", kind: "中药饮片", py: "HB",  price: 0.135, stock: 1011, attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "江苏紫石中药饮片有限公司" },
  { key: "tcm07", name: "卷柏",   spec: "1g/g", kind: "中药饮片", py: "JB",  price: 0.019, stock: 790,  attr: "普通药品", insLevel: "乙类", insNote: "—", vendor: "亳州药材有限公司" },
  { key: "tcm08", name: "马勃",   spec: "1g/g", kind: "中药饮片", py: "MB",  price: 0.105, stock: 546,  attr: "普通药品", insLevel: "乙类", insNote: "—", vendor: "安徽颐生中药饮片有限公司" },
  { key: "tcm09", name: "荜茇",   spec: "1g/g", kind: "中药饮片", py: "BB",  price: 0.127, stock: 860,  attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "安徽省万牛中药饮片有限公司" },
  { key: "tcm10", name: "百合",   spec: "1g/g", kind: "中药饮片", py: "BH",  price: 0.100, stock: 1280, attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "亳州市圣海中药饮片有限公司" },
  { key: "tcm11", name: "板蓝根", spec: "1g/g", kind: "中药饮片", py: "BLG", price: 0.045, stock: 2100, attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "安徽道源堂中药饮片有限公司" },
  { key: "tcm12", name: "丁香",   spec: "1g/g", kind: "中药饮片", py: "DX",  price: 0.280, stock: 320,  attr: "普通药品", insLevel: "乙类", insNote: "—", vendor: "安徽华鼎堂中药饮片有限公司" },
  { key: "tcm13", name: "葛花",   spec: "1g/g", kind: "中药饮片", py: "GH",  price: 0.300, stock: 180,  attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "亳州药材有限公司" },
  { key: "tcm14", name: "金银花", spec: "1g/g", kind: "中药饮片", py: "JYH", price: 0.320, stock: 960,  attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "江苏紫石中药饮片有限公司" },
  { key: "tcm15", name: "甘草",   spec: "1g/g", kind: "中药饮片", py: "GC",  price: 0.120, stock: 1500, attr: "普通药品", insLevel: "甲类", insNote: "—", vendor: "安徽省金芙蓉中药饮片有限公司" },
  /* 配方颗粒（价格元/袋） */
  { key: "tcm16", name: "黄芪配方颗粒", spec: "1g/袋", kind: "配方颗粒", py: "HQ",  price: 0.85, stock: 600, attr: "普通药品", insLevel: "乙类", insNote: "限门诊统筹", vendor: "广东一方制药有限公司" },
  { key: "tcm17", name: "当归配方颗粒", spec: "1g/袋", kind: "配方颗粒", py: "DG",  price: 0.92, stock: 540, attr: "普通药品", insLevel: "乙类", insNote: "限门诊统筹", vendor: "江阴天江药业有限公司" },
  { key: "tcm18", name: "党参配方颗粒", spec: "1g/袋", kind: "配方颗粒", py: "DS",  price: 0.68, stock: 480, attr: "普通药品", insLevel: "乙类", insNote: "限门诊统筹", vendor: "广东一方制药有限公司" },
  { key: "tcm19", name: "白术配方颗粒", spec: "1g/袋", kind: "配方颗粒", py: "BZU", price: 0.55, stock: 420, attr: "普通药品", insLevel: "乙类", insNote: "限门诊统筹", vendor: "华润三九现代中药制药有限公司" },
  { key: "tcm20", name: "茯苓配方颗粒", spec: "1g/袋", kind: "配方颗粒", py: "FL",  price: 0.48, stock: 510, attr: "普通药品", insLevel: "乙类", insNote: "限门诊统筹", vendor: "江阴天江药业有限公司" },
  /* 中药直服饮片（价格元/袋） */
  { key: "tcm21", name: "三七粉",       spec: "3g/袋", kind: "中药直服饮片", py: "SQP", price: 4.50, stock: 200, attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "云南七丹药业股份有限公司" },
  { key: "tcm22", name: "川贝母粉",     spec: "2g/袋", kind: "中药直服饮片", py: "CBMF", price: 6.80, stock: 150, attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "四川新荷花中药饮片股份有限公司" },
  { key: "tcm23", name: "灵芝孢子粉",   spec: "2g/袋", kind: "中药直服饮片", py: "LZBZF", price: 9.60, stock: 90,  attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "浙江寿仙谷药业股份有限公司" },
  { key: "tcm24", name: "西洋参粉",     spec: "1g/袋", kind: "中药直服饮片", py: "XYSF", price: 3.20, stock: 130, attr: "普通药品", insLevel: "自费", insNote: "—", vendor: "北京同仁堂股份有限公司" }
];

MOCK.diagnoses = [
  { code: "ZY01", name: "风寒感冒" },
  { code: "ZY02", name: "风热感冒" },
  { code: "ZY03", name: "咳嗽（风燥伤肺）" },
  { code: "ZY04", name: "胃脘痛" },
  { code: "ZY05", name: "泄泻" },
  { code: "ZY06", name: "便秘" },
  { code: "ZY07", name: "不寐" },
  { code: "ZY08", name: "眩晕" },
  { code: "ZY09", name: "头痛" },
  { code: "ZY10", name: "月经不调" },
  { code: "ZY11", name: "痛经" },
  { code: "ZY12", name: "痹证（关节疼痛）" }
];

MOCK.tcmSeed = {
  herbs: [
    { key: "tcm11", qty: 3, usage: "" },
    { key: "tcm12", qty: 3, usage: "炒焦" },
    { key: "tcm13", qty: 1, usage: "" },
    { key: "tcm14", qty: 2, usage: "后下" },
    { key: "tcm15", qty: 2, usage: "炙" },
    { key: "tcm02", qty: 1, usage: "后下" }
  ],
  doses: 3, usage: "水煎温服", freq: "每日一剂", route: "口服",
  ml: 200, timing: "饭后服用", diag: "", note: ""
};

/* ==========================================================================
   处方管理 · 处方发药（门诊处方发药）
   rxDisp：进入本列表的处方均已收费（未摆药 / 已摆药 两个 tab）
     prepared     是否已摆药（tab 划分依据：未摆药 / 已摆药）
     prepareUser / prepareTime   摆药人 / 摆药时间（摆药完成后回填）
     narcotic     是否涉及毒麻精类药品（审核在独立的毒麻精发药审核页面完成）
     auditStatus  毒麻精处方审核状态：approved=审核通过（仅审核通过的处方进入本列表）
     auditUser / auditTime       审核人 / 审核时间（仅毒麻精处方，审核通过后回填）
     dispensed    是否已发药（发药后移出本列表）
   ========================================================================== */
MOCK.rxDisp = [
  {
    id: "dp1", rxNo: "M202611000005A", rxType: "中成药处方", decoct: "否",
    name: "冯小容", py: "FXR", idNo: "370102198202030028",
    gender: "女性", age: "44岁", medicalNo: "260430000000001", outpatientNo: "202611040002",
    insNo: "2604300000000001", dept: "内科门诊", doctor: "林落落", pharmacy: "中药房", diagnose: "痤疮; 虚证; 痤疮",
    rxTime: "2026-11-04 19:40:21", chargeTime: "2026-11-04 19:59:57", phone: "13309608869",
    allergic: "青霉素类抗生素", agreement: "—", feeType: "自费", amount: 26.45,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "—",
    prepared: false, prepareUser: "", prepareTime: "",
    narcotic: false, auditUser: "", auditTime: "",
    dispensed: false,
    items: [
      { drugCode: "304032060201", name: "六神丸", category: "中成药", qty: "1盒", route: "口服", dose: "10粒", freq: "qd",
        days: 1, spec: "10粒*12支/盒", amount: 26.45, price: 26.45, insLevel: "", essential: "否",
        vendor: "雷允上药业集团有限公司", loc: "", batch: "UA18005B", stock: "11.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false }
    ]
  },
  {
    id: "dp2", rxNo: "M202611000007A", rxType: "中成药处方", decoct: "否",
    name: "冯小容", py: "FXR", idNo: "370102198202030028",
    gender: "女性", age: "44岁", medicalNo: "260430000000001", outpatientNo: "202611040003",
    insNo: "2604300000000002", dept: "内科门诊", doctor: "林落落", pharmacy: "中药房", diagnose: "风热感冒; 咳嗽",
    rxTime: "2026-11-04 19:52:18", chargeTime: "2026-11-04 20:05:36", phone: "13309608869",
    allergic: "青霉素类抗生素", agreement: "—", feeType: "自费", amount: 26.54,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "患者自述青霉素过敏，用药后如有不适请及时就诊",
    prepared: false, prepareUser: "", prepareTime: "",
    narcotic: false, auditUser: "", auditTime: "",
    dispensed: false,
    items: [
      { drugCode: "311013830601", name: "连花清瘟胶囊", category: "中成药", qty: "1盒", route: "口服", dose: "4粒", freq: "tid",
        days: 5, spec: "0.35g*24粒/盒", amount: 21.50, price: 21.50, insLevel: "甲类", essential: "是",
        vendor: "石家庄以岭药业股份有限公司", loc: "", batch: "A240912", stock: "42.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false },
      { drugCode: "311013830701", name: "蒙脱石散", category: "西药", qty: "3袋", route: "口服", dose: "3g", freq: "tid",
        days: 1, spec: "3g*10袋/盒", amount: 5.04, price: 1.68, insLevel: "甲类", essential: "是",
        vendor: "博福-益普生（天津）制药有限公司", loc: "", batch: "B250311", stock: "2.8000盒",
        insCode: "", insName: "", dispUnit: "袋", factor: 10, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 0, splitNeed: 3, splitAllowed: true }
    ]
  },
  {
    id: "dp3", rxNo: "M202611000009A", rxType: "中药饮片处方", decoct: "是",
    name: "王秀兰", py: "WXL", idNo: "370102196505120046",
    gender: "女性", age: "61岁", medicalNo: "260430000000028", outpatientNo: "202611040006",
    insNo: "2604300000000028", dept: "妇产科门诊", doctor: "周敏", pharmacy: "中药房", diagnose: "月经不调; 气血两虚",
    rxTime: "2026-11-04 20:12:05", chargeTime: "2026-11-04 20:20:15", phone: "13805411234",
    allergic: "—", agreement: "—", feeType: "职工医保", amount: 23.00,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    doses: 5, usage: "水煎服，每日一剂，分两次温服",
    remark: "先煎后下，饭后温服，忌辛辣",
    prepared: false, prepareUser: "", prepareTime: "",
    narcotic: false, auditUser: "", auditTime: "",
    dispensed: false,
    items: [
      { drugCode: "120101010101", name: "黄芪", category: "中药饮片", qty: "75g", route: "口服", dose: "15g", freq: "qd",
        days: 5, spec: "净制饮片", amount: 6.50, price: 1.30, insLevel: "甲类", essential: "是",
        vendor: "亳州市永刚饮片厂有限公司", loc: "", batch: "YP251102", stock: "860.0000g",
        insCode: "", insName: "", dispUnit: "g", factor: 1, dispQty: "", goodsName: "", bulk: "" },
      { drugCode: "120101010201", name: "当归", category: "中药饮片", qty: "50g", route: "口服", dose: "10g", freq: "qd",
        days: 5, spec: "净制饮片", amount: 12.00, price: 2.40, insLevel: "甲类", essential: "是",
        vendor: "亳州市永刚饮片厂有限公司", loc: "", batch: "YP251018", stock: "520.0000g",
        insCode: "", insName: "", dispUnit: "g", factor: 1, dispQty: "", goodsName: "", bulk: "" },
      { drugCode: "120101010301", name: "川芎", category: "中药饮片", qty: "30g", route: "口服", dose: "6g", freq: "qd",
        days: 5, spec: "净制饮片", amount: 4.50, price: 0.90, insLevel: "甲类", essential: "否",
        vendor: "亳州市永刚饮片厂有限公司", loc: "", batch: "YP251025", stock: "410.0000g",
        insCode: "", insName: "", dispUnit: "g", factor: 1, dispQty: "", goodsName: "", bulk: "" }
    ]
  },
  {
    id: "dp4", rxNo: "M202611000011A", rxType: "西药处方", decoct: "否",
    name: "李建国", py: "LJG", idNo: "370102195811230031",
    gender: "男性", age: "68岁", medicalNo: "260430000000035", outpatientNo: "202611040008",
    insNo: "2604300000000035", dept: "内科门诊", doctor: "陈涛", pharmacy: "中药房", diagnose: "上呼吸道感染; 咽喉肿痛",
    rxTime: "2026-11-04 20:25:44", chargeTime: "—", phone: "13969012345",
    allergic: "—", agreement: "—", feeType: "居民医保", amount: 31.40,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "—",
    prepared: false, prepareUser: "", prepareTime: "",
    narcotic: true, auditUser: "孙浩", auditTime: "2026-11-04 21:02:33",
    auditStatus: "approved",
    dispensed: false,
    items: [
      { drugCode: "311013830101", name: "阿莫西林胶囊", category: "西药", qty: "2盒", route: "口服", dose: "0.5g", freq: "tid",
        days: 5, spec: "0.25g*24粒/盒", amount: 25.20, price: 12.60, insLevel: "甲类", essential: "是",
        vendor: "联邦制药（中国）有限公司", loc: "", batch: "F251023", stock: "36.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 2, splitNeed: 0, splitAllowed: false },
      { drugCode: "311014090101", name: "地西泮片", category: "西药", qty: "1盒", route: "口服", dose: "5mg", freq: "qn",
        days: 7, spec: "5mg*24片/盒", amount: 6.20, price: 6.20, insLevel: "甲类", essential: "否",
        vendor: "华中药业股份有限公司", loc: "", batch: "E250605", stock: "18.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false }
    ]
  },
  {
    id: "dp5", rxNo: "M202611000013A", rxType: "西药处方", decoct: "否",
    name: "陈志强", py: "CZQ", idNo: "370102197506170037",
    gender: "男性", age: "51岁", medicalNo: "260430000000041", outpatientNo: "202611050003",
    insNo: "2604300000000041", dept: "骨科门诊", doctor: "陈涛", pharmacy: "中药房", diagnose: "腰腿痛",
    rxTime: "2026-11-05 08:30:12", chargeTime: "2026-11-05 08:41:50", phone: "13605317890",
    allergic: "—", agreement: "—", feeType: "职工医保", amount: 18.60,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "—",
    prepared: true, prepareUser: "赵敏", prepareTime: "2026-11-05 08:55:12",
    narcotic: false, auditUser: "", auditTime: "",
    dispensed: false,
    items: [
      { drugCode: "311013920101", name: "布洛芬缓释胶囊", category: "西药", qty: "1盒", route: "口服", dose: "0.3g", freq: "bid",
        days: 5, spec: "0.3g*20粒/盒", amount: 18.60, price: 18.60, insLevel: "甲类", essential: "是",
        vendor: "中美天津史克制药有限公司", loc: "", batch: "D251028", stock: "56.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false }
    ]
  },
  {
    id: "dp6", rxNo: "M202611000015A", rxType: "西药处方", decoct: "否",
    name: "刘晓梅", py: "LXM", idNo: "370102198310220019",
    gender: "女性", age: "43岁", medicalNo: "260430000000046", outpatientNo: "202611050006",
    insNo: "2604300000000046", dept: "疼痛门诊", doctor: "周敏", pharmacy: "中药房", diagnose: "神经病理性疼痛",
    rxTime: "2026-11-05 08:58:30", chargeTime: "2026-11-05 09:06:44", phone: "13864015678",
    allergic: "磺胺类抗菌药", agreement: "—", feeType: "职工医保", amount: 22.80,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "精神类药品，凭处方发药",
    prepared: true, prepareUser: "赵敏", prepareTime: "2026-11-05 09:18:47",
    narcotic: true, auditUser: "孙浩", auditTime: "2026-11-05 09:10:05",
    auditStatus: "approved",
    dispensed: false,
    items: [
      { drugCode: "311014100101", name: "盐酸曲马多缓释片", category: "西药", qty: "1盒", route: "口服", dose: "100mg", freq: "q12h",
        days: 3, spec: "100mg*6片/盒", amount: 22.80, price: 22.80, insLevel: "自费", essential: "否",
        vendor: "北京萌蒂制药有限公司", loc: "", batch: "C251002", stock: "9.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false }
    ]
  }
];

/* ==========================================================================
   处方管理 · 毒麻精发药审核（narcotic-audit.html）
   rxAudit：涉及毒麻精类药品的处方，须药房专人审核通过后方可摆药、发药
     auditStatus  pending=待审核 / approved=审核通过 / rejected=审核拒绝
     auditUser / auditTime       审核人 / 审核时间
     auditOpinion                审核意见（拒绝时必填，通过时可为空）
   ========================================================================== */
MOCK.rxAudit = [
  {
    id: "na1", rxNo: "M202611000017A", rxType: "西药处方", decoct: "否",
    name: "赵国栋", py: "ZGD", idNo: "370102196209120041",
    gender: "男性", age: "64岁", medicalNo: "260430000000052", outpatientNo: "202611050012",
    insNo: "2604300000000052", dept: "急诊内科", doctor: "林落落", pharmacy: "中药房", diagnose: "剧烈疼痛",
    rxTime: "2026-11-05 10:12:40", chargeTime: "2026-11-05 10:20:18", phone: "13791126543",
    allergic: "—", agreement: "—", feeType: "职工医保", amount: 34.00,
    temp: "36.5", pulse: "82", resp: "18", height: "—", weight: "—", bp: "138/86",
    remark: "麻醉药品，凭麻醉处方笺发药",
    narcotic: true,
    auditStatus: "pending", auditUser: "", auditTime: "", auditOpinion: "",
    items: [
      { drugCode: "311014200101", name: "盐酸哌替啶注射液", category: "西药", qty: "2支", route: "注射", dose: "100mg", freq: "st",
        days: 1, spec: "50mg*1ml/支", amount: 34.00, price: 17.00, insLevel: "自费", essential: "否",
        vendor: "东北制药集团股份有限公司", loc: "", batch: "A251020", stock: "24.0000支",
        insCode: "", insName: "", dispUnit: "支", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 2, splitNeed: 0, splitAllowed: false }
    ]
  },
  {
    id: "na2", rxNo: "M202611000015A", rxType: "西药处方", decoct: "否",
    name: "刘晓梅", py: "LXM", idNo: "370102198310220019",
    gender: "女性", age: "43岁", medicalNo: "260430000000046", outpatientNo: "202611050006",
    insNo: "2604300000000046", dept: "疼痛门诊", doctor: "周敏", pharmacy: "中药房", diagnose: "神经病理性疼痛",
    rxTime: "2026-11-05 08:58:30", chargeTime: "2026-11-05 09:06:44", phone: "13864015678",
    allergic: "磺胺类抗菌药", agreement: "—", feeType: "职工医保", amount: 22.80,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "精神类药品，凭处方发药",
    narcotic: true,
    auditStatus: "approved", auditUser: "孙浩", auditTime: "2026-11-05 09:10:05", auditOpinion: "",
    items: [
      { drugCode: "311014100101", name: "盐酸曲马多缓释片", category: "西药", qty: "1盒", route: "口服", dose: "100mg", freq: "q12h",
        days: 3, spec: "100mg*6片/盒", amount: 22.80, price: 22.80, insLevel: "自费", essential: "否",
        vendor: "北京萌蒂制药有限公司", loc: "", batch: "C251002", stock: "9.0000盒",
        insCode: "", insName: "", dispUnit: "盒", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false }
    ]
  },
  {
    id: "na3", rxNo: "M202611000019A", rxType: "西药处方", decoct: "否",
    name: "孙丽", py: "SL", idNo: "370102197812250044",
    gender: "女性", age: "48岁", medicalNo: "260430000000055", outpatientNo: "202611050015",
    insNo: "2604300000000055", dept: "神经内科", doctor: "陈涛", pharmacy: "中药房", diagnose: "癫痫",
    rxTime: "2026-11-05 10:35:22", chargeTime: "2026-11-05 10:44:09", phone: "13905319876",
    allergic: "—", agreement: "—", feeType: "居民医保", amount: 15.60,
    temp: "", pulse: "—", resp: "", height: "—", weight: "—", bp: "—",
    remark: "—",
    narcotic: true,
    auditStatus: "rejected", auditUser: "赵敏", auditTime: "2026-11-05 11:02:36",
    auditOpinion: "单次剂量超说明书上限，退回医师修订后重新提交",
    items: [
      { drugCode: "311014210101", name: "苯巴比妥片", category: "西药", qty: "1盒", route: "口服", dose: "90mg", freq: "qn",
        days: 7, spec: "30mg*100片/瓶", amount: 15.60, price: 15.60, insLevel: "甲类", essential: "否",
        vendor: "上海上药信谊药厂有限公司", loc: "", batch: "B250918", stock: "31.0000瓶",
        insCode: "", insName: "", dispUnit: "瓶", factor: 1, dispQty: "", goodsName: "", bulk: "",
        wholeNeed: 1, splitNeed: 0, splitAllowed: false }
    ]
  }
];

/* ==========================================================================
   处方管理 · 处方退药（门诊处方退药 · 中药房）
   rxReturns：已发药的处方，可申请退药
     status       pending=已发药未申请 / returnPending=退药申请待审核
                  approved=审核通过待退药 / rejected=审核已拒绝 / returned=已退药
     applyBy / applyTime     退药申请人 / 申请时间（发起申请时记录）
     applyReason             退药申请原因（发起申请时必填）
     auditBy / auditTime     审核人 / 审核时间（审核时记录）
     auditResult             approved=同意 / rejected=拒绝
     auditOpinion            审核意见（拒绝时必填）
     rxCat        处方类别：中药饮片处方 / 中成药处方 / 西药处方
                  中药饮片处方不展示追溯码列、退药无需录码
     dispenseTime 发药时间（左侧「发药时间」区间过滤依据）
     items        dispenser/dispenseTime=发药人/发药时间
                  traceCodes=发药追溯码（发药时生成，每最小销售单元一码）
                  returnCodes=退药追溯码（退药录码后回填）
                  returnQty / returnAmount / remainQty / remainAmount 由页面计算
   ========================================================================== */
MOCK.rxReturns = [
  {
    id: "rt1", rxNo: "M20261100000A", name: "冯小容", gender: "女性", age: "44岁",
    outpatientNo: "202611040002", medicalNo: "26043000000001", insNo: "—",
    dept: "内科门诊", doctor: "林落落", pharmacy: "中药房", feeType: "自费",
    rxCat: "中成药处方",
    amount: "26.4492", diagnose: "痤疮；虚证：痤疮", rxTime: "2026-11-04 19:40:21",
    temp: "", resp: "", pulse: "—", allergic: "青霉素类抗生素", bp: "—",
    doses: 1, observation: false, status: "pending", dispenseTime: "2026-11-04 19:59:57",
    items: [
      { drugCode: "304032060201", name: "六神丸", spec: "10粒*12支/盒",
        vendor: "雷允上药业集团有限公司", loc: "", unit: "盒", price: 26.45, qty: 1,
        batch: "202611A3", traceCodes: ["TRC202611A30001"],
        dispenser: "陈静", dispenseTime: "2026-11-04 19:59:57",
        cashier: "林落落", cashTime: "2026-11-04 19:59:57" }
    ]
  },
  {
    id: "rt2", rxNo: "M202611000007A", name: "冯小容", gender: "女性", age: "44岁",
    outpatientNo: "202611040003", medicalNo: "26043000000001", insNo: "—",
    dept: "内科门诊", doctor: "林落落", pharmacy: "中药房", feeType: "自费",
    rxCat: "中成药处方",
    amount: "38.30", diagnose: "风热感冒；咳嗽", rxTime: "2026-11-04 19:52:18",
    temp: "", resp: "", pulse: "—", allergic: "青霉素类抗生素", bp: "—",
    doses: 2, observation: false, status: "approved", dispenseTime: "2026-11-04 20:05:36",
    applyBy: "陈静", applyTime: "2026-11-04 21:02:10", applyReason: "患者对青霉素类药物过敏，医师调整用药方案后换药",
    auditBy: "赵敏", auditTime: "2026-11-04 21:30:45", auditResult: "approved",
    auditOpinion: "核对发药记录无误，同意退药",
    items: [
      { drugCode: "311013830601", name: "连花清瘟胶囊", spec: "0.35g*24粒/盒",
        vendor: "石家庄以岭药业股份有限公司", loc: "", unit: "盒", price: 21.50, qty: 1,
        batch: "202611B6", traceCodes: ["TRC202611B60001"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:05:36",
        cashier: "林落落", cashTime: "2026-11-04 20:05:36" },
      { drugCode: "311013830701", name: "蒙脱石散", spec: "3g*10袋/盒",
        vendor: "博福-益普生（天津）制药有限公司", loc: "", unit: "盒", price: 16.80, qty: 1,
        batch: "202610C2", traceCodes: ["TRC202610C20014"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:05:36",
        cashier: "林落落", cashTime: "2026-11-04 20:05:36" }
    ]
  },
  {
    id: "rt3", rxNo: "M202611000009A", name: "王秀兰", gender: "女性", age: "61岁",
    outpatientNo: "202611040006", medicalNo: "260430000000028", insNo: "—",
    dept: "妇产科门诊", doctor: "周敏", pharmacy: "中药房", feeType: "职工医保",
    rxCat: "中成药处方",
    amount: "42.94", diagnose: "月经不调；气血两虚", rxTime: "2026-11-04 20:12:05",
    temp: "", resp: "", pulse: "—", allergic: "—", bp: "—",
    doses: 3, observation: false, status: "returned",
    applyBy: "陈静", applyTime: "2026-11-04 20:33:12", applyReason: "患者用药后出现不适，医师要求停用并退药",
    auditBy: "赵敏", auditTime: "2026-11-04 20:35:20", auditResult: "approved",
    auditOpinion: "同意退药",
    dispenseTime: "2026-11-04 20:20:15", returnTime: "2026-11-04 20:36:40",
    items: [
      { drugCode: "311013831202", name: "阿胶片", spec: "复方*20片/袋",
        vendor: "山东东阿阿胶股份有限公司", loc: "", unit: "袋", price: 12.12, qty: 2,
        batch: "202611D1", traceCodes: ["TRC202611D10021", "TRC202611D10022"],
        returnCodes: ["TRC202611D10021"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:20:15",
        cashier: "林落落", cashTime: "2026-11-04 20:20:15" },
      { drugCode: "311013831001", name: "藿香正气水", spec: "10ml*10支/盒",
        vendor: "太极集团重庆涪陵制药厂有限公司", loc: "", unit: "盒", price: 9.80, qty: 1,
        batch: "202610E4", traceCodes: ["TRC202610E40008"],
        returnCodes: ["TRC202610E40008"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:20:15",
        cashier: "林落落", cashTime: "2026-11-04 20:20:15" },
      { drugCode: "311013830801", name: "维生素C片", spec: "100mg*100片/瓶",
        vendor: "华中药业股份有限公司", loc: "", unit: "瓶", price: 8.90, qty: 1,
        batch: "202609F2", traceCodes: ["TRC202609F20033"],
        returnCodes: ["TRC202609F20033"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:20:15",
        cashier: "林落落", cashTime: "2026-11-04 20:20:15" }
    ]
  },
  {
    id: "rt4", rxNo: "M202611000011A", name: "李建国", gender: "男性", age: "68岁",
    outpatientNo: "202611040008", medicalNo: "260430000000035", insNo: "—",
    dept: "内科门诊", doctor: "陈涛", pharmacy: "中药房", feeType: "居民医保",
    rxCat: "中成药处方",
    amount: "90.95", diagnose: "感冒；咽喉肿痛", rxTime: "2026-11-04 20:25:44",
    temp: "", resp: "", pulse: "—", allergic: "—", bp: "—",
    doses: 2, observation: true, status: "rejected", dispenseTime: "2026-11-04 20:36:05",
    applyBy: "陈静", applyTime: "2026-11-04 21:10:33", applyReason: "收费项目重复，实际需退部分药品",
    auditBy: "赵敏", auditTime: "2026-11-04 21:35:12", auditResult: "rejected",
    auditOpinion: "退药数量与收费记录不符，请核对后重新申请",
    items: [
      { drugCode: "304032060201", name: "六神丸", spec: "10粒*12支/盒",
        vendor: "雷允上药业集团有限公司", loc: "", unit: "盒", price: 26.45, qty: 1,
        batch: "202611A3", traceCodes: ["TRC202611A30002"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:36:05",
        cashier: "林落落", cashTime: "2026-11-04 20:36:05" },
      { drugCode: "311013830601", name: "连花清瘟胶囊", spec: "0.35g*24粒/盒",
        vendor: "石家庄以岭药业股份有限公司", loc: "", unit: "盒", price: 21.50, qty: 3,
        batch: "202611B6", traceCodes: ["TRC202611B60002", "TRC202611B60003", "TRC202611B60004"],
        dispenser: "陈静", dispenseTime: "2026-11-04 20:36:05",
        cashier: "林落落", cashTime: "2026-11-04 20:36:05" }
    ]
  },
  {
    id: "rt5", rxNo: "M202611030056A", name: "陈志远", gender: "男性", age: "35岁",
    outpatientNo: "202611030056", medicalNo: "260430000000056", insNo: "—",
    dept: "急诊科", doctor: "孙浩", pharmacy: "中药房", feeType: "自费",
    rxCat: "中药饮片处方",
    amount: "19.60", diagnose: "暑湿感冒", rxTime: "2026-11-03 20:55:10",
    temp: "", resp: "", pulse: "—", allergic: "—", bp: "—",
    doses: 2, observation: false, status: "returnPending", dispenseTime: "2026-11-03 21:10:20",
    applyBy: "陈静", applyTime: "2026-11-04 21:18:02", applyReason: "患者因故离院，剩余饮片不再服用",
    items: [
      { drugCode: "3105100011", name: "当归", spec: "统片 0.3cm 以上",
        vendor: "亳州市京皖中药饮片有限公司", loc: "", unit: "g", price: 0.12, qty: 45,
        dispenser: "陈静", dispenseTime: "2026-11-03 21:10:20",
        cashier: "林落落", cashTime: "2026-11-03 21:10:20" },
      { drugCode: "3105100124", name: "白芍", spec: "统片",
        vendor: "亳州市京皖中药饮片有限公司", loc: "", unit: "g", price: 0.10, qty: 40,
        dispenser: "陈静", dispenseTime: "2026-11-03 21:10:20",
        cashier: "林落落", cashTime: "2026-11-03 21:10:20" },
      { drugCode: "3105100167", name: "茯苓", spec: "统块",
        vendor: "亳州市京皖中药饮片有限公司", loc: "", unit: "g", price: 0.09, qty: 30,
        dispenser: "陈静", dispenseTime: "2026-11-03 21:10:20",
        cashier: "林落落", cashTime: "2026-11-03 21:10:20" },
      { drugCode: "3105100189", name: "白术", spec: "统片",
        vendor: "亳州市京皖中药饮片有限公司", loc: "", unit: "g", price: 0.11, qty: 30,
        dispenser: "陈静", dispenseTime: "2026-11-03 21:10:20",
        cashier: "林落落", cashTime: "2026-11-03 21:10:20" },
      { drugCode: "3105100233", name: "甘草", spec: "统片",
        vendor: "亳州市京皖中药饮片有限公司", loc: "", unit: "g", price: 0.07, qty: 20,
        dispenser: "陈静", dispenseTime: "2026-11-03 21:10:20",
        cashier: "林落落", cashTime: "2026-11-03 21:10:20" },
      { drugCode: "3105100301", name: "陈皮", spec: "统丝",
        vendor: "亳州市京皖中药饮片有限公司", loc: "", unit: "g", price: 0.10, qty: 28,
        dispenser: "陈静", dispenseTime: "2026-11-03 21:10:20",
        cashier: "林落落", cashTime: "2026-11-03 21:10:20" }
    ]
  }
];

/* ==========================================================================
   库存查询：批次数据（stock-query.html）
   ========================================================================== */

/* 展平批次列表，每项带完整维度字段，便于查询页面直接过滤 */
MOCK.stockBatches = [

  /* ===== 中心药房 / ph-c1 一号库 / loc-c1-A ===== */
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d1", si:0, batchNo:"P260301",
    vendor:"华北制药股份有限公司",
    stock:320, stopQty:24, preQty:0,
    purchase:6.80, retail:12.50,
    expDate:"2028-03-11", inTime:"2026-03-12 09:20" },
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d1", si:0, batchNo:"P260502",
    vendor:"哈药集团制药总厂",
    stock:150, stopQty:0, preQty:12,
    purchase:6.95, retail:12.80,
    expDate:"2028-05-07", inTime:"2026-05-08 14:15" },
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d1", si:0, batchNo:"P260603",
    vendor:"石药集团中诺药业（石家庄）有限公司",
    stock:0, stopQty:0, preQty:0,
    purchase:6.90, retail:12.80,
    expDate:"2028-06-20", inTime:"2026-06-21 10:00" },

  /* d1 另一个规格 */
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d1", si:1, batchNo:"P260710",
    vendor:"珠海联邦制药股份有限公司中山分公司",
    stock:86, stopQty:0, preQty:14,
    purchase:5.60, retail:10.20,
    expDate:"2028-07-01", inTime:"2026-07-02 11:40" },

  /* 布洛芬 */
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d6", si:0, batchNo:"P260110",
    vendor:"中美天津史克制药有限公司",
    stock:540, stopQty:0, preQty:0,
    purchase:7.50, retail:13.80,
    expDate:"2028-01-19", inTime:"2026-01-20 08:30" },
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d6", si:0, batchNo:"P260315",
    vendor:"哈药集团制药总厂",
    stock:320, stopQty:60, preQty:20,
    purchase:7.65, retail:13.80,
    expDate:"2028-03-24", inTime:"2026-03-25 16:05" },

  /* 连花清瘟 */
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-A",
    drugId:"d7", si:0, batchNo:"P260520",
    vendor:"石家庄以岭药业股份有限公司",
    stock:680, stopQty:48, preQty:72,
    purchase:11.20, retail:21.50,
    expDate:"2028-05-15", inTime:"2026-05-16 09:10" },

  /* ===== 中心药房 / ph-c1 一号库 / loc-c1-B ===== */
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-B",
    drugId:"d5", si:0, batchNo:"P260215",
    vendor:"国药集团致君（深圳）制药有限公司",
    stock:260, stopQty:0, preQty:0,
    purchase:9.80, retail:18.60,
    expDate:"2028-02-17", inTime:"2026-02-18 13:20" },
  { orgId:"org-c", pharmacyId:"ph-c1", locationId:"loc-c1-B",
    drugId:"d5", si:0, batchNo:"P260620",
    vendor:"丽珠集团丽珠制药厂",
    stock:175, stopQty:12, preQty:7,
    purchase:9.60, retail:18.60,
    expDate:"2028-06-29", inTime:"2026-06-30 10:40" },

  /* ===== 中心药房 / ph-c2 二号库 / loc-c2-A ===== */
  { orgId:"org-c", pharmacyId:"ph-c2", locationId:"loc-c2-A",
    drugId:"d2", si:0, batchNo:"P260401",
    vendor:"先声药业有限公司",
    stock:420, stopQty:20, preQty:40,
    purchase:8.20, retail:15.60,
    expDate:"2028-04-09", inTime:"2026-04-10 08:55" },
  { orgId:"org-c", pharmacyId:"ph-c2", locationId:"loc-c2-A",
    drugId:"d2", si:0, batchNo:"P260902",
    vendor:"海南三叶制药厂有限公司",
    stock:0, stopQty:0, preQty:0,
    purchase:8.35, retail:15.60,
    expDate:"2028-09-04", inTime:"2026-09-05 11:30" },

  /* ===== XX社区 / ph-a1-1 门诊药房（无库位筛选或 loc-m1-1-A） ===== */
  { orgId:"org-a1", pharmacyId:"ph-a1-1", locationId:"loc-m1-1-A",
    drugId:"d1", si:0, batchNo:"P260301",
    vendor:"华北制药股份有限公司",
    stock:120, stopQty:24, preQty:0,
    purchase:6.80, retail:12.50,
    expDate:"2028-03-11", inTime:"2026-03-15 10:00" },
  { orgId:"org-a1", pharmacyId:"ph-a1-1", locationId:"loc-m1-1-A",
    drugId:"d6", si:0, batchNo:"P260110",
    vendor:"中美天津史克制药有限公司",
    stock:80, stopQty:0, preQty:35,
    purchase:7.50, retail:13.80,
    expDate:"2028-01-19", inTime:"2026-01-22 14:20" },
  { orgId:"org-a1", pharmacyId:"ph-a1-1", locationId:"loc-m1-1-A",
    drugId:"d6", si:0, batchNo:"P260315",
    vendor:"哈药集团制药总厂",
    stock:60, stopQty:0, preQty:0,
    purchase:7.65, retail:13.80,
    expDate:"2027-11-30", inTime:"2026-03-28 09:40" },

  /* XX社区 过期批次 */
  { orgId:"org-a1", pharmacyId:"ph-a1-1", locationId:"loc-m1-1-A",
    drugId:"d1", si:0, batchNo:"P240101",
    vendor:"华北制药股份有限公司",
    stock:0, stopQty:0, preQty:0,
    purchase:6.80, retail:12.50,
    expDate:"2024-12-31", inTime:"2024-01-05 10:00" },

  /* ===== YY人民医院 / ph-a2-1 住院药房（无库位数据，页面允许留空） ===== */
  { orgId:"org-a2", pharmacyId:"ph-a2-1", locationId:"",
    drugId:"d4", si:0, batchNo:"P260815",
    vendor:"珠海联邦制药股份有限公司中山分公司",
    stock:96, stopQty:0, preQty:0,
    purchase:14.20, retail:26.80,
    expDate:"2028-08-14", inTime:"2026-08-16 11:05" },
  { orgId:"org-a2", pharmacyId:"ph-a2-1", locationId:"",
    drugId:"d7", si:0, batchNo:"P260520",
    vendor:"石家庄以岭药业股份有限公司",
    stock:120, stopQty:0, preQty:24,
    purchase:11.20, retail:21.50,
    expDate:"2028-05-15", inTime:"2026-05-18 15:45" },

  /* ===== ZZ中西医 / ph-a3-1 中药房 ===== */
  { orgId:"org-a3", pharmacyId:"ph-a3-1", locationId:"",
    drugId:"d8", si:0, batchNo:"P260715",
    vendor:"亳州市沪谯药业有限公司",
    stock:5, stopQty:0, preQty:1,
    purchase:220.00, retail:320.00,
    expDate:"2028-07-14", inTime:"2026-07-16 08:20" },

  /* ===== 城东社区 member-1 / ph-m1-1 门诊药房 ===== */
  { orgId:"member-1", pharmacyId:"ph-m1-1", locationId:"loc-m1-1-A",
    drugId:"d1", si:0, batchNo:"P260301",
    vendor:"华北制药股份有限公司",
    stock:168, stopQty:48, preQty:24,
    purchase:6.80, retail:12.50,
    expDate:"2028-03-11", inTime:"2026-03-18 09:30" },
  { orgId:"member-1", pharmacyId:"ph-m1-1", locationId:"loc-m1-1-A",
    drugId:"d6", si:0, batchNo:"P260420",
    vendor:"石药集团欧意药业有限公司",
    stock:90, stopQty:20, preQty:10,
    purchase:7.58, retail:14.20,
    expDate:"2028-04-27", inTime:"2026-04-29 13:10" },
  { orgId:"member-1", pharmacyId:"ph-m1-1", locationId:"loc-m1-1-B",
    drugId:"d7", si:0, batchNo:"P260825",
    vendor:"石家庄以岭药业股份有限公司",
    stock:46, stopQty:0, preQty:0,
    purchase:11.35, retail:21.50,
    expDate:"2028-08-25", inTime:"2026-08-27 16:55" },

  /* ===== 青河村卫生室 village-1 / ph-v1 ===== */
  { orgId:"village-1", pharmacyId:"ph-v1", locationId:"loc-v1-A",
    drugId:"d1", si:0, batchNo:"P260301",
    vendor:"华北制药股份有限公司",
    stock:48, stopQty:0, preQty:24,
    purchase:6.80, retail:12.50,
    expDate:"2028-03-11", inTime:"2026-03-20 10:10" },
  { orgId:"village-1", pharmacyId:"ph-v1", locationId:"loc-v1-B",
    drugId:"d7", si:0, batchNo:"P260825",
    vendor:"石家庄以岭药业股份有限公司",
    stock:23, stopQty:0, preQty:0,
    purchase:11.35, retail:21.50,
    expDate:"2028-08-25", inTime:"2026-08-28 14:40" }
];

/* 辅助：根据 drugId+si 查出 { drug, spec } */
MOCK.findDrugSpec = function (drugId, si) {
  for (var i = 0; i < MOCK.drugs.length; i++) {
    if (MOCK.drugs[i].id === drugId) {
      var d = MOCK.drugs[i];
      if (d.specs[si]) return { drug: d, spec: d.specs[si] };
    }
  }
  return null;
};

/* ==========================================================================
   医保目录映射 + 供应商（medical-insurance-mapping.html / supplier-allocation.html）
   ========================================================================== */

window.MOCK.insVersion = { name: "2025 版", effective: "2025-01-01" };

/* 医保药品目录：字段与系统字段的绑定关系——
   医保名称 ↔ 药品名称、医保规格 ↔ 药品规格、生产企业 ↔ 生产企业、
   批准文号 ↔ 批准文号、剂型 ↔ 剂型、最小包装单位(pkgUnit) ↔ 最小包装单位、系数(conv) ↔ 系数 */
window.MOCK.insCatalog = [
  { code: "XJ01CA0401010101032", name: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", conv: "24", form: "胶囊剂", pkgUnit: "盒", vendor: "华北制药股份有限公司", approval: "H13023917", level: "甲类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0401010102032", name: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", conv: "24", form: "胶囊剂", pkgUnit: "盒", vendor: "哈药集团制药总厂", approval: "H23021568", level: "甲类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0401010103032", name: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", conv: "24", form: "胶囊剂", pkgUnit: "盒", vendor: "石药集团中诺药业（石家庄）有限公司", approval: "H20033293", level: "乙类", packMat: "铝塑泡罩", limitFlag: "1", limitScope: "限二级及以上医疗机构", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0401020101032", name: "阿莫西林胶囊", spec: "0.5g * 12粒/盒", conv: "12", form: "胶囊剂", pkgUnit: "盒", vendor: "石药集团中诺药业（石家庄）有限公司", approval: "H20033293", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0401030101032", name: "阿莫西林胶囊", spec: "0.25g * 12粒/盒", conv: "12", form: "胶囊剂", pkgUnit: "盒", vendor: "广州白云山制药股份有限公司", approval: "H44021234", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0402010101032", name: "阿莫西林颗粒", spec: "0.125g * 20袋/盒", conv: "20", form: "颗粒剂", pkgUnit: "盒", vendor: "先声药业有限公司", approval: "H20054132", level: "甲类", packMat: "复合膜袋", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0402010102032", name: "阿莫西林颗粒", spec: "0.125g * 20袋/盒", conv: "20", form: "颗粒剂", pkgUnit: "盒", vendor: "海南三叶制药厂有限公司", approval: "H46020567", level: "甲类", packMat: "复合膜袋", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0402020101032", name: "阿莫西林颗粒", spec: "0.25g * 12袋/盒", conv: "12", form: "颗粒剂", pkgUnit: "盒", vendor: "华北制药股份有限公司", approval: "H13024018", level: "乙类", packMat: "复合膜袋", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0403010101032", name: "注射用阿莫西林钠", spec: "0.5g * 10支/盒", conv: "10", form: "注射用无菌粉末", pkgUnit: "盒", vendor: "哈药集团制药总厂", approval: "H23023104", level: "乙类", packMat: "西林瓶", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0403010102032", name: "注射用阿莫西林钠", spec: "0.5g * 10支/盒", conv: "1", form: "注射用无菌粉末", pkgUnit: "盒", vendor: "哈药集团制药总厂", approval: "H23023104", level: "乙类", packMat: "西林瓶", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CA0403020101032", name: "注射用阿莫西林钠", spec: "0.5g * 10支/盒", conv: "10", form: "注射用无菌粉末", pkgUnit: "盒", vendor: "山东鲁抗医药股份有限公司", approval: "H37022318", level: "乙类", packMat: "西林瓶", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CR0201010101032", name: "阿莫西林克拉维酸钾片", spec: "0.457g * 12片/盒", conv: "12", form: "片剂", pkgUnit: "盒", vendor: "珠海联邦制药股份有限公司中山分公司", approval: "H20033218", level: "乙类", packMat: "铝塑泡罩", limitFlag: "1", limitScope: "限青霉素类药物过敏史患者禁用", selfPay: "20%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01CR0201020101032", name: "阿莫西林克拉维酸钾片", spec: "0.2285g * 24片/盒", conv: "24", form: "片剂", pkgUnit: "盒", vendor: "华北制药股份有限公司", approval: "H13022871", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01DC0201010101032", name: "头孢呋辛酯片", spec: "0.25g * 12片/盒", conv: "12", form: "片剂", pkgUnit: "盒", vendor: "国药集团致君（深圳）制药有限公司", approval: "H20043318", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XJ01DC0201020101032", name: "头孢呋辛酯片", spec: "0.125g * 24片/盒", conv: "24", form: "片剂", pkgUnit: "盒", vendor: "广州白云山制药股份有限公司", approval: "H44020866", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XM01AE0101010101032", name: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", conv: "20", form: "缓释胶囊", pkgUnit: "盒", vendor: "中美天津史克制药有限公司", approval: "H10900089", level: "甲类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "XM01AE0101010102032", name: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒", conv: "20", form: "缓释胶囊", pkgUnit: "盒", vendor: "哈药集团制药总厂", approval: "H23025117", level: "甲类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "西成药" },
  { code: "ZT04AAAL0001010101032", name: "连花清瘟胶囊", spec: "0.35g * 24粒/盒", conv: "24", form: "胶囊剂", pkgUnit: "盒", vendor: "石家庄以岭药业股份有限公司", approval: "Z20040063", level: "甲类", packMat: "铝塑泡罩", limitFlag: "1", limitScope: "限新型冠状病毒感染患者", selfPay: "0%", version: "2025", feeType: "国家医保", category: "中成药" },
  { code: "T0001000001", name: "金银花", spec: "1kg/袋", conv: "1", form: "饮片", pkgUnit: "袋", vendor: "亳州市沪谯药业有限公司", approval: "皖20160234", level: "甲类", packMat: "塑料袋", limitFlag: "0", limitScope: "—", selfPay: "0%", version: "2025", feeType: "国家医保", category: "中药饮片" },
  { code: "XH01CB0201010101032", name: "注射用生长抑素", spec: "3mg * 1支/盒", conv: "1", form: "注射用无菌粉末", pkgUnit: "盒", vendor: "深圳市翰宇药业股份有限公司", approval: "H20053872", level: "乙类", packMat: "西林瓶", limitFlag: "1", limitScope: "限胰腺手术后并发症", selfPay: "20%", version: "2025", feeType: "国家医保", category: "西成药" },
  /* 省医保目录：切换收费种类后参与匹配 */
  { code: "SXJ01CA0401010101", name: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", conv: "24", form: "胶囊剂", pkgUnit: "盒", vendor: "华北制药股份有限公司", approval: "H13023917", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "省医保", category: "西成药" },
  { code: "SXJ01CA0401010102", name: "阿莫西林胶囊", spec: "0.25g * 24粒/盒", conv: "24", form: "胶囊剂", pkgUnit: "盒", vendor: "哈药集团制药总厂", approval: "H23021568", level: "乙类", packMat: "铝塑泡罩", limitFlag: "0", limitScope: "—", selfPay: "10%", version: "2025", feeType: "省医保", category: "西成药" }
];

/* 对码关系：vkey -> { insCode, upload(none|done|fail), failReason, failOnce, exception, reason }
   演示数据：已上传 1 条、已对码未上传 1 条、首次上传会失败 1 条，其余未对码 */
window.MOCK.miMaps = {
  "d1_0_0": { insCode: "XJ01CA0401010101032", upload: "done" },
  "d1_1_0": { insCode: "XJ01CA0401020101032", upload: "none" },
  "d5_0_0": {
    insCode: "XJ01DC0201010101032", upload: "fail", failOnce: true,
    failReason: "医保平台返回：药品编码与定点机构信息校验不通过（错误码 YB-1002）"
  }
};

/* ==========================================================================
   供应商（配送企业）库 + 药品供应关系（供应商分配页使用）
   ========================================================================== */

/* 供应商主数据：来自「系统维护 → 企业维护」 */
window.MOCK.suppliers = [
  {
    code: "GYS0001", name: "国药控股江苏有限公司", type: "配送企业",
    credit: "91320100134905821X", contact: "王磊", phone: "025-8320 6688",
    area: "江苏省南京市", expire: "2028-06-30", status: "on"
  },
  {
    code: "GYS0002", name: "华润医药商业集团上海有限公司", type: "配送企业",
    credit: "91310101132200974K", contact: "李静", phone: "021-6288 3311",
    area: "上海市", expire: "2027-12-31", status: "on"
  },
  {
    code: "GYS0003", name: "九州通医药集团股份有限公司", type: "配送企业",
    credit: "91420100717919526R", contact: "陈伟", phone: "027-8446 9900",
    area: "湖北省武汉市", expire: "2029-03-15", status: "on"
  },
  {
    code: "GYS0004", name: "上海医药集团股份有限公司", type: "配送企业",
    credit: "91310000132229641L", contact: "张伟", phone: "021-6373 1000",
    area: "上海市", expire: "2027-09-30", status: "on"
  },
  {
    code: "GYS0005", name: "江苏亚邦医药商业有限公司", type: "配送企业",
    credit: "91320400724127005F", contact: "吴敏", phone: "0519-8660 2233",
    area: "江苏省常州市", expire: "2026-11-30", status: "on"
  },
  {
    code: "GYS0006", name: "浙江英特药业有限责任公司", type: "配送企业",
    credit: "91330000142921931M", contact: "赵磊", phone: "0571-8707 5566",
    area: "浙江省杭州市", expire: "2025-12-31", status: "on"
  },
  {
    code: "GYS0007", name: "华北制药股份有限公司", type: "生产企业直供",
    credit: "91130000104321845T", contact: "刘洋", phone: "0311-8599 1122",
    area: "河北省石家庄市", expire: "2028-01-31", status: "on"
  },
  {
    code: "GYS0008", name: "南京医药股份有限公司", type: "配送企业",
    credit: "91320100134787152Y", contact: "孙浩", phone: "025-8441 0099",
    area: "江苏省南京市", expire: "2027-05-20", status: "off"
  }
];

/* 供应关系：vkey（品种_规格下标_厂商下标）-> { supplier, updated }
   同一药品规格·厂家只允许一家供应商；约 20% 的厂商行预置为未分配 */
window.MOCK.supplies = {};
(function () {
  var pool = ["GYS0001", "GYS0002", "GYS0003", "GYS0004", "GYS0005", "GYS0007"];
  window.MOCK.drugs.forEach(function (d, di) {
    d.specs.forEach(function (s, si) {
      s.vendors.forEach(function (v, vi) {
        var seed = di * 13 + si * 7 + vi * 5 + 3;
        if (seed % 9 === 0 || seed % 9 === 1) return;   // 未分配
        var code = pool[seed % pool.length];
        if (seed % 23 === 0) code = "GYS0006";          // 资质已过期
        if (seed % 17 === 0) code = "GYS0008";          // 供应商已停用
        var day = (seed % 28) + 1;
        window.MOCK.supplies[window.MOCK.vkey(d.id, si, vi)] = {
          supplier: code,
          updated: "2026-09-" + (day < 10 ? "0" + day : day) + " 15:20"
        };
      });
    });
  });
})();

/* 供应商快捷查询 */
window.MOCK.supplierOf = function (code) {
  for (var i = 0; i < window.MOCK.suppliers.length; i++) {
    if (window.MOCK.suppliers[i].code === code) return window.MOCK.suppliers[i];
  }
  return null;
};


/* ==========================================================================
   药房维护（pharmacy-maintenance.html）
   ========================================================================== */

/* 所属机构 = 负责机构（区县卫健部门）；管理机构 = 托管/委托机构（医院） */
window.MOCK.pharmacyOrgs = [
  "济南市历下区卫生健康局",
  "济南市历城区卫生健康局",
  "济南市市中区卫生健康局",
  "扬州市江都区卫生健康局",
  "北京市东城区卫生健康委员会"
];
window.MOCK.pharmacyMgrs = [
  "山东大学齐鲁医院",
  "山东大学齐鲁医院（东院区）",
  "济南市中心医院",
  "城东社区卫生服务中心",
  "扬州市江都区人民医院"
];

/* 区域位置：省 / 市 / 区 / 镇（街道）四级 */
window.MOCK.addressTree = [
  { name: "山东省", children: [
    { name: "济南市", children: [
      { name: "历下区", children: [{ name: "文化东路街道" }, { name: "甸柳新村街道" }, { name: "姚家街道" }, { name: "智远街道" }] },
      { name: "历城区", children: [{ name: "山大路街道" }, { name: "洪家楼街道" }, { name: "东风街道" }] },
      { name: "市中区", children: [{ name: "经八路街道" }, { name: "大观园街道" }, { name: "六里山街道" }] },
      { name: "槐荫区", children: [{ name: "振兴街街道" }, { name: "道德街街道" }] }
    ] },
    { name: "青岛市", children: [
      { name: "市南区", children: [{ name: "八大峡街道" }, { name: "云南路街道" }] },
      { name: "市北区", children: [{ name: "辽宁路街道" }, { name: "延安路街道" }] }
    ] }
  ] },
  { name: "江苏省", children: [
    { name: "扬州市", children: [
      { name: "江都区", children: [{ name: "仙女镇" }, { name: "大桥镇" }, { name: "邵伯镇" }] },
      { name: "广陵区", children: [{ name: "东关街道" }, { name: "汶河街道" }] }
    ] },
    { name: "南京市", children: [
      { name: "鼓楼区", children: [{ name: "宁海路街道" }, { name: "华侨路街道" }] },
      { name: "玄武区", children: [{ name: "梅园新村街道" }, { name: "新街口街道" }] }
    ] }
  ] },
  { name: "北京市", children: [
    { name: "北京市", children: [
      { name: "东城区", children: [{ name: "东华门街道" }, { name: "景山街道" }] },
      { name: "西城区", children: [{ name: "西长安街街道" }, { name: "新街口街道" }] }
    ] }
  ] }
];

/* 库位类型 + 可管理的药品分类（多选） */
window.MOCK.slotTypes = ["中药", "西药"];
window.MOCK.slotCategories = ["西药", "藏药", "中成药", "疫苗", "配方颗粒", "中药饮片", "中药直服饮片"];

/* 药房档案列表（pharmacy-maintenance.html）——与调拨模块的 pharmacies 映射表区分 */
window.MOCK.pharmacyFacilities = [
  {
    code: "YF0001",
    org: "济南市历下区卫生健康局", mgr: "山东大学齐鲁医院", name: "中心药房",
    province: "山东省", city: "济南市", district: "历下区", town: "文化东路街道",
    address: "文化西路107号", contact: "张明远", phone: "13800001234", enabled: true,
    slots: [
      { name: "西药库位A", type: "西药", cats: ["西药", "中成药", "疫苗"] },
      { name: "中药库位B", type: "中药", cats: ["中药饮片", "中药直服饮片", "配方颗粒"] }
    ]
  },
  {
    code: "YF0002",
    org: "济南市历下区卫生健康局", mgr: "山东大学齐鲁医院", name: "门诊西药房",
    province: "山东省", city: "济南市", district: "历下区", town: "文化东路街道",
    address: "文化西路107号门诊楼1层", contact: "李静", phone: "13900002345", enabled: true,
    slots: [
      { name: "门诊西药库位", type: "西药", cats: ["西药", "中成药", "疫苗"] }
    ]
  },
  {
    code: "YF0003",
    org: "济南市历城区卫生健康局", mgr: "山东大学齐鲁医院（东院区）", name: "东院区住院药房",
    province: "山东省", city: "济南市", district: "历城区", town: "洪家楼街道",
    address: "经十路东段", contact: "王海涛", phone: "13700003456", enabled: true,
    slots: [
      { name: "住院西药库位", type: "西药", cats: ["西药", "中成药"] },
      { name: "住院中药库位", type: "中药", cats: ["中药饮片", "配方颗粒"] }
    ]
  },
  {
    code: "YF0004",
    org: "济南市历下区卫生健康局", mgr: "城东社区卫生服务中心", name: "社区中心药房",
    province: "山东省", city: "济南市", district: "历下区", town: "姚家街道",
    address: "城东路12号", contact: "陈晓", phone: "13500004567", enabled: false,
    slots: []
  },
  {
    code: "YF0005",
    org: "济南市市中区卫生健康局", mgr: "济南市中心医院", name: "住院部药房",
    province: "山东省", city: "济南市", district: "市中区", town: "经八路街道",
    address: "经八路5号", contact: "赵强", phone: "13600005678", enabled: true,
    slots: [
      { name: "注射剂库位", type: "西药", cats: ["西药", "疫苗"] }
    ]
  },
  {
    code: "YF0006",
    org: "扬州市江都区卫生健康局", mgr: "扬州市江都区人民医院", name: "门诊中药房",
    province: "江苏省", city: "扬州市", district: "江都区", town: "仙女镇",
    address: "龙川北路88号", contact: "孙丽", phone: "13300006789", enabled: true,
    slots: [
      { name: "饮片库位", type: "中药", cats: ["中药饮片", "中药直服饮片"] }
    ]
  }
];

/* ==========================================================================
   处方查询（prescription-query.html）
   ========================================================================== */

MOCK.rxQuery = [
  {
    "id": "q1",
    "rxNo": "M20261028000061A",
    "rxType": "中药饮片处方",
    "rxStatus": "已发药",
    "name": "徐明远",
    "py": "XMY",
    "gender": "男性",
    "age": "65岁",
    "outpatientNo": "202610270004",
    "medicalNo": "261027000000005",
    "insNo": "—",
    "dept": "骨伤科门诊",
    "doctor": "张建军",
    "pharmacy": "中药房",
    "feeType": "职工医保",
    "diagnose": "腰椎间盘突出症; 肾虚腰痛",
    "allergic": "—",
    "rxTime": "2026-10-28 14:46:53",
    "chargeTime": "2026-10-28 14:47:08",
    "dispenseTime": "2026-10-28 15:12:30",
    "auditTime": "2026-10-28 14:48:12",
    "auditBy": "王丽华",
    "dispensingTime": "2026-10-28 15:02:41",
    "dispensingBy": "陈静",
    "feeTime": "2026-10-28 14:47:08",
    "amount": 88.6,
    "phone": "15583379297",
    "doses": 7,
    "usage": "水煎服，每日一剂，早晚分服",
    "remark": "忌生冷油腻",
"agreementRx": "独活寄生汤",
    "items": [
      {
        "seq": 1,
        "drugCode": "120101010101",
        "name": "黄芪",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP251102",
        "price": 1.3,
        "single": 15,
        "times": "qd",
        "days": 7,
        "qty": "105g",
        "unit": "g",
        "amount": 13.65,
        "manufacturer": "安徽康和中药饮片有限公司",
        "dispenseQty": "105",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 2,
        "drugCode": "120101010201",
        "name": "当归",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP251018",
        "price": 2.4,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 16.8,
        "manufacturer": "甘肃岷县当归饮片厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 3,
        "drugCode": "120101010301",
        "name": "川芎",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP251025",
        "price": 0.9,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 6.3,
        "manufacturer": "四川新荷花中药饮片股份有限公司",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 4,
        "drugCode": "120101010401",
        "name": "杜仲",
        "goodsName": "—",
        "spec": "盐炙饮片",
        "batch": "YP250911",
        "price": 0.8,
        "single": 12,
        "times": "qd",
        "days": 7,
        "qty": "84g",
        "unit": "g",
        "amount": 6.72,
        "manufacturer": "湖南金太阳杜仲饮片有限公司",
        "dispenseQty": "84",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 5,
        "drugCode": "120101010501",
        "name": "牛膝",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP251002",
        "price": 1.5,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 10.5,
        "manufacturer": "河南四大怀药饮片有限公司",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 6,
        "drugCode": "120101010601",
        "name": "桑寄生",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250825",
        "price": 0.7,
        "single": 15,
        "times": "qd",
        "days": 7,
        "qty": "105g",
        "unit": "g",
        "amount": 7.35,
        "manufacturer": "广东康美药业股份有限公司",
        "dispenseQty": "105",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 7,
        "drugCode": "120101010701",
        "name": "独活",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250718",
        "price": 0.85,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 5.95,
        "manufacturer": "甘肃独一味生物制药股份有限公司",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 8,
        "drugCode": "120101010801",
        "name": "羌活",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250620",
        "price": 0.95,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 6.65,
        "manufacturer": "青海正心堂中药饮片有限公司",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 9,
        "drugCode": "120101010901",
        "name": "秦艽",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250515",
        "price": 1.2,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 8.4,
        "manufacturer": "陕西正北药业有限公司",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 10,
        "drugCode": "120101011001",
        "name": "防风",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250403",
        "price": 1.1,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 7.7,
        "manufacturer": "河北安国饮片厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      }
    ],
    "dispenser": "陈静",
    "rxCategory": "普通处方",
    "rxAmount": 88.6
  },
  {
    "id": "q2",
    "rxNo": "M20261028000062A",
    "rxType": "中成药处方",
    "rxStatus": "已发药",
    "name": "徐明远",
    "py": "XMY",
    "gender": "男性",
    "age": "65岁",
    "outpatientNo": "202610270005",
    "medicalNo": "261027000000005",
    "insNo": "—",
    "dept": "骨伤科门诊",
    "doctor": "张建军",
    "pharmacy": "中药房",
    "feeType": "职工医保",
    "diagnose": "腰椎间盘突出症",
    "allergic": "—",
    "rxTime": "2026-10-28 14:50:12",
    "chargeTime": "2026-10-28 14:51:05",
    "dispenseTime": "2026-10-28 15:15:40",
    "auditTime": "2026-10-28 14:52:18",
    "auditBy": "陈静",
    "dispensingTime": "2026-10-28 15:08:33",
    "dispensingBy": "林落落",
    "feeTime": "2026-10-28 14:51:05",
    "amount": 45.8,
    "phone": "15583379297",
    "remark": "—",
"agreementRx": "—",
    "items": [
      {
        "seq": 1,
        "drugCode": "311013830601",
        "name": "连花清瘟胶囊",
        "goodsName": "—",
        "spec": "0.35g*24粒/盒",
        "batch": "A240912",
        "price": 21.5,
        "single": 4,
        "times": "tid",
        "days": 5,
        "qty": "1盒",
        "unit": "盒",
        "amount": 21.5,
        "manufacturer": "石家庄以岭药业股份有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      },
      {
        "seq": 2,
        "drugCode": "304032060201",
        "name": "六神丸",
        "goodsName": "—",
        "spec": "10粒*12支/盒",
        "batch": "UA18005B",
        "price": 24.3,
        "single": 10,
        "times": "qd",
        "days": 1,
        "qty": "1盒",
        "unit": "盒",
        "amount": 24.3,
        "manufacturer": "雷允上药业集团有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      }
    ],
    "dispenser": "林落落",
    "rxCategory": "普通处方",
    "rxAmount": 45.8
  },
  {
    "id": "q3",
    "rxNo": "M20261028000063A",
    "rxType": "西药处方",
    "rxStatus": "未发药",
    "name": "徐明远",
    "py": "XMY",
    "gender": "男性",
    "age": "65岁",
    "outpatientNo": "202610270006",
    "medicalNo": "261027000000005",
    "insNo": "—",
    "dept": "心内科门诊",
    "doctor": "王丽华",
    "pharmacy": "中药房",
    "feeType": "职工医保",
    "diagnose": "高血压病2级; 冠心病",
    "allergic": "青霉素类",
    "rxTime": "2026-10-28 15:02:33",
    "chargeTime": "2026-10-28 15:03:20",
    "dispenseTime": "",
    "auditTime": "2026-10-28 15:04:02",
    "auditBy": "赵敏",
    "dispensingTime": "—",
    "dispensingBy": "—",
    "feeTime": "2026-10-28 15:03:20",
    "amount": 78.9,
    "phone": "15583379297",
    "remark": "—",
"agreementRx": "—",
    "items": [
      {
        "seq": 1,
        "drugCode": "311013830101",
        "name": "阿莫西林胶囊",
        "goodsName": "—",
        "spec": "0.25g*24粒/盒",
        "batch": "F251023",
        "price": 12.6,
        "single": 1,
        "times": "qd",
        "days": 5,
        "qty": "2盒",
        "unit": "盒",
        "amount": 25.2,
        "manufacturer": "珠海联邦制药股份有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "口服"
      },
      {
        "seq": 2,
        "drugCode": "311013830201",
        "name": "硝苯地平控释片",
        "goodsName": "—",
        "spec": "30mg*7片/盒",
        "batch": "N251101",
        "price": 32.5,
        "single": 1,
        "times": "qd",
        "days": 30,
        "qty": "1盒",
        "unit": "盒",
        "amount": 32.5,
        "manufacturer": "拜耳医药保健有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "口服"
      },
      {
        "seq": 3,
        "drugCode": "311013830301",
        "name": "阿司匹林肠溶片",
        "goodsName": "—",
        "spec": "100mg*30片/盒",
        "batch": "A251015",
        "price": 21.2,
        "single": 1,
        "times": "qd",
        "days": 30,
        "qty": "1盒",
        "unit": "盒",
        "amount": 21.2,
        "manufacturer": "拜耳医药保健有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "口服"
      }
    ],
    "dispenser": "—",
    "rxCategory": "普通处方",
    "rxAmount": 78.9
  },
  {
    "id": "q4",
    "rxNo": "M20261028000064A",
    "rxType": "中药饮片处方",
    "rxStatus": "已发药",
    "name": "李秀英",
    "py": "LXY",
    "gender": "女性",
    "age": "58岁",
    "outpatientNo": "202610270007",
    "medicalNo": "261027000000007",
    "insNo": "—",
    "dept": "中医科门诊",
    "doctor": "陈志远",
    "pharmacy": "中药房",
    "feeType": "居民医保",
    "diagnose": "更年期综合征; 失眠",
    "allergic": "—",
    "rxTime": "2026-10-28 16:12:44",
    "chargeTime": "2026-10-28 16:13:55",
    "dispenseTime": "2026-10-28 16:30:18",
    "auditTime": "2026-10-28 16:14:47",
    "auditBy": "王丽华",
    "dispensingTime": "2026-10-28 16:22:09",
    "dispensingBy": "陈静",
    "feeTime": "2026-10-28 16:13:55",
    "amount": 125.4,
    "phone": "13853124567",
    "doses": 14,
    "usage": "水煎服，每日一剂，睡前温服",
    "remark": "避免睡前饮茶",
"agreementRx": "附子理中汤",
    "items": [
      {
        "seq": 1,
        "drugCode": "120201010101",
        "name": "酸枣仁",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250301",
        "price": 3.5,
        "single": 20,
        "times": "qd",
        "days": 14,
        "qty": "280g",
        "unit": "g",
        "amount": 98,
        "manufacturer": "河北安国酸枣仁饮片厂",
        "dispenseQty": "280",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 2,
        "drugCode": "120201010201",
        "name": "茯神",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250412",
        "price": 1.2,
        "single": 15,
        "times": "qd",
        "days": 14,
        "qty": "210g",
        "unit": "g",
        "amount": 25.2,
        "manufacturer": "山西万荣茯神加工厂",
        "dispenseQty": "210",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 3,
        "drugCode": "120201010301",
        "name": "远志",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250520",
        "price": 0.8,
        "single": 10,
        "times": "qd",
        "days": 14,
        "qty": "140g",
        "unit": "g",
        "amount": 11.2,
        "manufacturer": "山西道地中药材饮片厂",
        "dispenseQty": "140",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 4,
        "drugCode": "120201010401",
        "name": "五味子",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250611",
        "price": 2.1,
        "single": 6,
        "times": "qd",
        "days": 14,
        "qty": "84g",
        "unit": "g",
        "amount": 17.64,
        "manufacturer": "辽宁五味子饮片有限公司",
        "dispenseQty": "84",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 5,
        "drugCode": "120201010501",
        "name": "柏子仁",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250708",
        "price": 1.8,
        "single": 12,
        "times": "qd",
        "days": 14,
        "qty": "168g",
        "unit": "g",
        "amount": 30.24,
        "manufacturer": "山东柏子仁加工厂",
        "dispenseQty": "168",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      }
    ],
    "dispenser": "王丽华",
    "rxCategory": "急诊处方",
    "rxAmount": 125.4
  },
  {
    "id": "q5",
    "rxNo": "M20261027000058A",
    "rxType": "中成药处方",
    "rxStatus": "已退药未退费",
    "name": "王建国",
    "py": "WJG",
    "gender": "男性",
    "age": "52岁",
    "outpatientNo": "202610260008",
    "medicalNo": "261026000000003",
    "insNo": "—",
    "dept": "呼吸科门诊",
    "doctor": "孙浩",
    "pharmacy": "中药房",
    "feeType": "自费",
    "diagnose": "慢性支气管炎; 急性发作期",
    "allergic": "—",
    "rxTime": "2026-10-27 09:22:15",
    "chargeTime": "2026-10-27 09:23:40",
    "dispenseTime": "2026-10-27 09:45:12",
    "auditTime": "2026-10-27 09:24:15",
    "auditBy": "孙浩",
    "dispensingTime": "2026-10-27 09:38:52",
    "dispensingBy": "孙浩",
    "feeTime": "2026-10-27 09:23:40",
    "amount": 56.3,
    "phone": "13969012345",
    "remark": "患者反馈服用后有轻微头晕，申请退药",
"agreementRx": "—",
    "items": [
      {
        "seq": 1,
        "drugCode": "311013830401",
        "name": "川贝枇杷膏",
        "goodsName": "—",
        "spec": "150ml/瓶",
        "batch": "B250815",
        "price": 28.8,
        "single": 15,
        "times": "tid",
        "days": 7,
        "qty": "1瓶",
        "unit": "瓶",
        "amount": 28.8,
        "manufacturer": "京都念慈菴总厂有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "瓶",
        "dispenseConv": 1,
        "usage": "口服"
      },
      {
        "seq": 2,
        "drugCode": "311013830501",
        "name": "急支糖浆",
        "goodsName": "—",
        "spec": "200ml/瓶",
        "batch": "J250722",
        "price": 27.5,
        "single": 20,
        "times": "tid",
        "days": 7,
        "qty": "1瓶",
        "unit": "瓶",
        "amount": 27.5,
        "manufacturer": "太极集团重庆涪陵制药厂有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "瓶",
        "dispenseConv": 1,
        "usage": "口服"
      }
    ],
    "dispenser": "孙浩",
    "rxCategory": "儿科处方",
    "rxAmount": 56.3
  },
  {
    "id": "q6",
    "rxNo": "M20261027000059A",
    "rxType": "西药处方",
    "rxStatus": "已发药",
    "name": "王建国",
    "py": "WJG",
    "gender": "男性",
    "age": "52岁",
    "outpatientNo": "202610260009",
    "medicalNo": "261026000000003",
    "insNo": "—",
    "dept": "呼吸科门诊",
    "doctor": "孙浩",
    "pharmacy": "中药房",
    "feeType": "自费",
    "diagnose": "急性上呼吸道感染",
    "allergic": "—",
    "rxTime": "2026-10-27 09:30:58",
    "chargeTime": "2026-10-27 09:32:10",
    "dispenseTime": "2026-10-27 09:50:30",
    "auditTime": "2026-10-27 09:33:28",
    "auditBy": "陈静",
    "dispensingTime": "2026-10-27 09:44:15",
    "dispensingBy": "陈静",
    "feeTime": "2026-10-27 09:32:10",
    "amount": 34.5,
    "phone": "13969012345",
    "remark": "—",
"agreementRx": "—",
    "items": [
      {
        "seq": 1,
        "drugCode": "311013830701",
        "name": "蒙脱石散",
        "goodsName": "—",
        "spec": "3g*10袋/盒",
        "batch": "B250311",
        "price": 1.68,
        "single": 3,
        "times": "tid",
        "days": 1,
        "qty": "3袋",
        "unit": "袋",
        "amount": 5.04,
        "manufacturer": "博福-益普生(天津)制药有限公司",
        "dispenseQty": "3",
        "dispenseUnit": "袋",
        "dispenseConv": 1,
        "usage": "冲服"
      },
      {
        "seq": 2,
        "drugCode": "311013830801",
        "name": "维生素C片",
        "goodsName": "—",
        "spec": "100mg*100片/瓶",
        "batch": "E250605",
        "price": 0.09,
        "single": 1,
        "times": "qd",
        "days": 5,
        "qty": "5片",
        "unit": "片",
        "amount": 0.45,
        "manufacturer": "东北制药集团股份有限公司",
        "dispenseQty": "5",
        "dispenseUnit": "片",
        "dispenseConv": 1,
        "usage": "口服"
      },
      {
        "seq": 3,
        "drugCode": "311013830901",
        "name": "布洛芬缓释胶囊",
        "goodsName": "—",
        "spec": "0.3g*10粒/盒",
        "batch": "I250910",
        "price": 12.8,
        "single": 1,
        "times": "bid",
        "days": 3,
        "qty": "1盒",
        "unit": "盒",
        "amount": 12.8,
        "manufacturer": "中美天津史克制药有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      },
      {
        "seq": 4,
        "drugCode": "311013831001",
        "name": "复方氨酚烷胺胶囊",
        "goodsName": "—",
        "spec": "12粒/盒",
        "batch": "F251028",
        "price": 16.21,
        "single": 1,
        "times": "bid",
        "days": 3,
        "qty": "1盒",
        "unit": "盒",
        "amount": 16.21,
        "manufacturer": "仁和药业股份有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      }
    ],
    "dispenser": "陈静",
    "rxCategory": "普通处方",
    "rxAmount": 34.5
  },
  {
    "id": "q7",
    "rxNo": "M20261028000065A",
    "rxType": "中药饮片处方",
    "rxStatus": "未发药",
    "name": "冯小容",
    "py": "FXR",
    "gender": "女性",
    "age": "44岁",
    "outpatientNo": "202610270010",
    "medicalNo": "261027000000001",
    "insNo": "—",
    "dept": "皮肤科门诊",
    "doctor": "林落落",
    "pharmacy": "中药房",
    "feeType": "职工医保",
    "diagnose": "痤疮; 内分泌失调",
    "allergic": "青霉素类抗生素",
    "rxTime": "2026-10-28 10:05:21",
    "chargeTime": "2026-10-28 10:06:45",
    "dispenseTime": "",
    "auditTime": "2026-10-28 10:08:31",
    "auditBy": "赵敏",
    "dispensingTime": "—",
    "dispensingBy": "—",
    "feeTime": "2026-10-28 10:06:45",
    "amount": 96.8,
    "phone": "13309608869",
    "doses": 10,
    "usage": "水煎服，每日一剂，分两次饭后温服",
    "remark": "忌辛辣油腻，保证充足睡眠",
"agreementRx": "玉屏风散",
    "items": [
      {
        "seq": 1,
        "drugCode": "120301010101",
        "name": "金银花",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250812",
        "price": 0.85,
        "single": 15,
        "times": "qd",
        "days": 10,
        "qty": "150g",
        "unit": "g",
        "amount": 12.75,
        "manufacturer": "河南封丘金银花饮片有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 2,
        "drugCode": "120301010201",
        "name": "连翘",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250905",
        "price": 0.9,
        "single": 15,
        "times": "qd",
        "days": 10,
        "qty": "150g",
        "unit": "g",
        "amount": 13.5,
        "manufacturer": "山西道地连翘饮片有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 3,
        "drugCode": "120301010301",
        "name": "黄芩",
        "goodsName": "—",
        "spec": "酒炙饮片",
        "batch": "YP250718",
        "price": 0.75,
        "single": 10,
        "times": "qd",
        "days": 10,
        "qty": "100g",
        "unit": "g",
        "amount": 7.5,
        "manufacturer": "河北黄芩饮片有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 4,
        "drugCode": "120301010401",
        "name": "黄连",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250622",
        "price": 2.3,
        "single": 6,
        "times": "qd",
        "days": 10,
        "qty": "60g",
        "unit": "g",
        "amount": 13.8,
        "manufacturer": "四川峨嵋黄连饮片厂",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 5,
        "drugCode": "120301010501",
        "name": "黄柏",
        "goodsName": "—",
        "spec": "盐炙饮片",
        "batch": "YP250503",
        "price": 0.65,
        "single": 10,
        "times": "qd",
        "days": 10,
        "qty": "100g",
        "unit": "g",
        "amount": 6.5,
        "manufacturer": "四川黄柏饮片有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 6,
        "drugCode": "120301010601",
        "name": "丹参",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250415",
        "price": 1.4,
        "single": 15,
        "times": "qd",
        "days": 10,
        "qty": "150g",
        "unit": "g",
        "amount": 21,
        "manufacturer": "安徽亳州丹参饮片厂",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 7,
        "drugCode": "120301010701",
        "name": "赤芍",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250308",
        "price": 0.95,
        "single": 12,
        "times": "qd",
        "days": 10,
        "qty": "120g",
        "unit": "g",
        "amount": 11.4,
        "manufacturer": "安徽赤芍饮片有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 8,
        "drugCode": "120301010801",
        "name": "白芷",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250218",
        "price": 0.7,
        "single": 10,
        "times": "qd",
        "days": 10,
        "qty": "100g",
        "unit": "g",
        "amount": 7,
        "manufacturer": "河北白芷饮片厂",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      },
      {
        "seq": 9,
        "drugCode": "120301010901",
        "name": "桑白皮",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250120",
        "price": 0.55,
        "single": 12,
        "times": "qd",
        "days": 10,
        "qty": "120g",
        "unit": "g",
        "amount": 6.6,
        "manufacturer": "江苏桑白皮饮片厂",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "水煎服"
      }
    ],
    "dispenser": "—",
    "rxCategory": "普通处方",
    "rxAmount": 96.8
  },
  {
    "id": "q8",
    "rxNo": "M20261026000055A",
    "rxType": "中成药处方",
    "rxStatus": "未收费",
    "name": "赵晓燕",
    "py": "ZXY",
    "gender": "女性",
    "age": "32岁",
    "outpatientNo": "202610250012",
    "medicalNo": "261025000000008",
    "insNo": "—",
    "dept": "妇科门诊",
    "doctor": "周敏",
    "pharmacy": "中药房",
    "feeType": "自费",
    "diagnose": "月经不调; 气血虚弱",
    "allergic": "—",
    "rxTime": "2026-10-26 08:55:33",
    "chargeTime": "",
    "dispenseTime": "",
    "auditTime": "—",
    "auditBy": "—",
    "dispensingTime": "—",
    "dispensingBy": "—",
    "feeTime": "",
    "amount": 68,
    "phone": "18678901234",
    "remark": "—",
"agreementRx": "—",
    "items": [
      {
        "seq": 1,
        "drugCode": "311013831101",
        "name": "乌鸡白凤丸",
        "goodsName": "—",
        "spec": "9g*10丸/盒",
        "batch": "W251015",
        "price": 32.5,
        "single": 1,
        "times": "bid",
        "days": 15,
        "qty": "1盒",
        "unit": "盒",
        "amount": 32.5,
        "manufacturer": "北京同仁堂科技发展股份有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "口服"
      },
      {
        "seq": 2,
        "drugCode": "311013831201",
        "name": "阿胶补血口服液",
        "goodsName": "—",
        "spec": "10ml*12支/盒",
        "batch": "E250922",
        "price": 35.5,
        "single": 1,
        "times": "tid",
        "days": 10,
        "qty": "1盒",
        "unit": "盒",
        "amount": 35.5,
        "manufacturer": "山东东阿阿胶股份有限公司",
        "dispenseQty": "—",
        "dispenseUnit": "—",
        "dispenseConv": "—",
        "usage": "口服"
      }
    ],
    "dispenser": "—",
    "rxCategory": "普通处方",
    "rxAmount": 68
  },
  {
    "id": "q9",
    "rxNo": "M20261028000066A",
    "rxType": "西药处方",
    "rxStatus": "已发药",
    "name": "陈志远",
    "py": "CZY",
    "gender": "男性",
    "age": "35岁",
    "outpatientNo": "202610270015",
    "medicalNo": "261027000000012",
    "insNo": "—",
    "dept": "急诊科",
    "doctor": "孙浩",
    "pharmacy": "中药房",
    "feeType": "居民医保",
    "diagnose": "急性阑尾炎术后恢复期",
    "allergic": "—",
    "rxTime": "2026-10-28 17:22:10",
    "chargeTime": "2026-10-28 17:23:45",
    "dispenseTime": "2026-10-28 17:45:22",
    "auditTime": "2026-10-28 17:24:50",
    "auditBy": "王丽华",
    "dispensingTime": "2026-10-28 17:37:16",
    "dispensingBy": "王丽华",
    "feeTime": "2026-10-28 17:23:45",
    "amount": 156.7,
    "phone": "13700001234",
    "remark": "按时换药，注意伤口卫生",
"agreementRx": "—",
    "items": [
      {
        "seq": 1,
        "drugCode": "311013831301",
        "name": "头孢克肟胶囊",
        "goodsName": "—",
        "spec": "0.1g*6粒/盒",
        "batch": "C251101",
        "price": 28.5,
        "single": 1,
        "times": "bid",
        "days": 7,
        "qty": "2盒",
        "unit": "盒",
        "amount": 57,
        "manufacturer": "广州白云山制药股份有限公司",
        "dispenseQty": "2",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      },
      {
        "seq": 2,
        "drugCode": "311013831401",
        "name": "甲硝唑片",
        "goodsName": "—",
        "spec": "0.2g*12片/盒",
        "batch": "J251022",
        "price": 18.9,
        "single": 2,
        "times": "tid",
        "days": 7,
        "qty": "1盒",
        "unit": "盒",
        "amount": 18.9,
        "manufacturer": "东北制药集团股份有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      },
      {
        "seq": 3,
        "drugCode": "311013831501",
        "name": "双氯芬酸钠缓释片",
        "goodsName": "—",
        "spec": "75mg*10片/盒",
        "batch": "S250918",
        "price": 36.4,
        "single": 1,
        "times": "qd",
        "days": 5,
        "qty": "1盒",
        "unit": "盒",
        "amount": 36.4,
        "manufacturer": "诺华制药有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      },
      {
        "seq": 4,
        "drugCode": "311013831601",
        "name": "奥美拉唑肠溶胶囊",
        "goodsName": "—",
        "spec": "20mg*14粒/盒",
        "batch": "A251105",
        "price": 22.8,
        "single": 1,
        "times": "qd",
        "days": 14,
        "qty": "1盒",
        "unit": "盒",
        "amount": 22.8,
        "manufacturer": "阿斯利康制药有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      },
      {
        "seq": 5,
        "drugCode": "311013831701",
        "name": "氯化钾缓释片",
        "goodsName": "—",
        "spec": "0.5g*24片/盒",
        "batch": "K251020",
        "price": 21.6,
        "single": 1,
        "times": "tid",
        "days": 7,
        "qty": "1盒",
        "unit": "盒",
        "amount": 21.6,
        "manufacturer": "中国大冢制药有限公司",
        "dispenseQty": "1",
        "dispenseUnit": "盒",
        "dispenseConv": 10,
        "usage": "口服"
      }
    ],
    "dispenser": "王丽华",
    "rxCategory": "急诊处方",
    "rxAmount": 156.7
  },
  {
    "id": "q10",
    "rxNo": "M20261025000052A",
    "rxType": "中药饮片处方",
    "rxStatus": "已退药未退费",
    "name": "李老太",
    "py": "LLT",
    "gender": "女性",
    "age": "72岁",
    "outpatientNo": "202610240003",
    "medicalNo": "261024000000015",
    "insNo": "—",
    "dept": "老年病门诊",
    "doctor": "王丽华",
    "pharmacy": "中药房",
    "feeType": "职工医保",
    "diagnose": "脾胃虚弱证; 慢性胃肠炎",
    "allergic": "—",
    "rxTime": "2026-10-25 11:30:05",
    "chargeTime": "2026-10-25 11:31:40",
    "dispenseTime": "2026-10-25 11:55:28",
    "auditTime": "2026-10-25 11:32:26",
    "auditBy": "孙浩",
    "dispensingTime": "2026-10-25 11:47:03",
    "dispensingBy": "孙浩",
    "feeTime": "2026-10-25 11:31:40",
    "amount": 78.2,
    "phone": "13500005678",
    "doses": 7,
    "usage": "水煎服，每日一剂，饭前温服",
    "remark": "患者服药后出现腹泻，经沟通退药",
"agreementRx": "四物汤",
    "items": [
      {
        "seq": 1,
        "drugCode": "120401010101",
        "name": "党参",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250820",
        "price": 1.8,
        "single": 15,
        "times": "qd",
        "days": 7,
        "qty": "105g",
        "unit": "g",
        "amount": 18.9,
        "manufacturer": "山西潞党参饮片有限公司",
        "dispenseQty": "105",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 2,
        "drugCode": "120401010201",
        "name": "白术",
        "goodsName": "—",
        "spec": "麸炒饮片",
        "batch": "YP250715",
        "price": 0.95,
        "single": 12,
        "times": "qd",
        "days": 7,
        "qty": "84g",
        "unit": "g",
        "amount": 7.98,
        "manufacturer": "浙江磐安白术饮片厂",
        "dispenseQty": "84",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 3,
        "drugCode": "120401010301",
        "name": "茯苓",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250608",
        "price": 0.6,
        "single": 15,
        "times": "qd",
        "days": 7,
        "qty": "105g",
        "unit": "g",
        "amount": 6.3,
        "manufacturer": "云南茯苓饮片有限公司",
        "dispenseQty": "105",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 4,
        "drugCode": "120401010401",
        "name": "山药",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250512",
        "price": 0.85,
        "single": 15,
        "times": "qd",
        "days": 7,
        "qty": "105g",
        "unit": "g",
        "amount": 8.93,
        "manufacturer": "河南焦作山药饮片有限公司",
        "dispenseQty": "105",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 5,
        "drugCode": "120401010501",
        "name": "炙甘草",
        "goodsName": "—",
        "spec": "蜜炙饮片",
        "batch": "YP250405",
        "price": 0.55,
        "single": 6,
        "times": "qd",
        "days": 7,
        "qty": "42g",
        "unit": "g",
        "amount": 2.31,
        "manufacturer": "内蒙古甘草饮片厂",
        "dispenseQty": "42",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 6,
        "drugCode": "120401010601",
        "name": "陈皮",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250315",
        "price": 0.7,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 4.9,
        "manufacturer": "广东新会陈皮饮片厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 7,
        "drugCode": "120401010701",
        "name": "砂仁",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250228",
        "price": 1.5,
        "single": 6,
        "times": "qd",
        "days": 7,
        "qty": "42g",
        "unit": "g",
        "amount": 6.3,
        "manufacturer": "广东阳春砂仁饮片有限公司",
        "dispenseQty": "42",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 8,
        "drugCode": "120401010801",
        "name": "木香",
        "goodsName": "—",
        "spec": "净制饮片",
        "batch": "YP250110",
        "price": 0.8,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 5.6,
        "manufacturer": "云南木香饮片有限公司",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 9,
        "drugCode": "120401010901",
        "name": "鸡内金",
        "goodsName": "—",
        "spec": "砂炒饮片",
        "batch": "YP241218",
        "price": 1.2,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 8.4,
        "manufacturer": "河北鸡内金加工厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 10,
        "drugCode": "120401011001",
        "name": "焦山楂",
        "goodsName": "—",
        "spec": "炒焦饮片",
        "batch": "YP241105",
        "price": 0.65,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 4.55,
        "manufacturer": "山东山楂饮片加工厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 11,
        "drugCode": "120401011101",
        "name": "麦芽",
        "goodsName": "—",
        "spec": "炒焦饮片",
        "batch": "YP241022",
        "price": 0.4,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 2.8,
        "manufacturer": "甘肃麦芽加工厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      },
      {
        "seq": 12,
        "drugCode": "120401011201",
        "name": "神曲",
        "goodsName": "—",
        "spec": "炒焦饮片",
        "batch": "YP240915",
        "price": 0.55,
        "single": 10,
        "times": "qd",
        "days": 7,
        "qty": "70g",
        "unit": "g",
        "amount": 3.85,
        "manufacturer": "陕西神曲加工厂",
        "dispenseQty": "70",
        "dispenseUnit": "g",
        "dispenseConv": 1,
        "usage": "水煎服"
      }
    ],
    "dispenser": "孙浩",
    "rxCategory": "儿科处方",
    "rxAmount": 78.2
  }
];

/* ==========================================================================
   基层缺药：缺药登记种子数据
   status: draft 草稿 / pending 待受理 / accepted 已受理 / rejected 已拒绝 / resolved 已解决
   category: catalog 药品目录缺失 / stock 库存不足
   ========================================================================== */
MOCK.shortages = [
  {
    id: "sy1", code: "QY20261107001",
    category: "stock", urgency: "urgent",
    drugId: "d1", si: 0, drugCode: "1210500301",
    drugName: "阿莫西林胶囊", spec: "0.25g * 24粒/盒",
    vendor: "华北制药股份有限公司", approval: "H13023917",
    qty: 50, reason: "库存不足", reasonOther: "",
    remark: "近期呼吸道感染就诊量大，阿莫西林胶囊库存告急，仅够 3 天用量。",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-11-07 09:20", submitTime: "2026-11-07 09:20",
    status: "pending",
    records: [
      { node: "提交登记", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-11-07 09:20" }
    ]
  },
  {
    id: "sy2", code: "QY20261105002",
    category: "catalog", urgency: "normal",
    drugId: "", si: -1, drugCode: "",
    drugName: "布洛芬混悬液", spec: "100ml:2g/瓶",
    vendor: "上海强生制药有限公司", approval: "国药准字H19990114",
    qty: 30, reason: "临床新增需求", reasonOther: "",
    remark: "儿科退热用药需求增加，现行药品目录中无儿童适用剂型，申请增补。",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    createdAt: "2026-11-05 14:05", submitTime: "2026-11-05 14:05",
    status: "accepted",
    records: [
      { node: "提交登记", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-11-05 14:05" },
      { node: "中心药房受理", person: "赵敏", org: "区域中心药房", result: "受理", opinion: "情况属实，纳入处理队列。", time: "2026-11-06 09:30" }
    ]
  },
  {
    id: "sy3", code: "QY20261103003",
    category: "stock", urgency: "normal",
    drugId: "d5", si: 0, drugCode: "1210500305",
    drugName: "头孢呋辛酯片", spec: "0.25g * 12片/盒",
    vendor: "广州白云山制药股份有限公司", approval: "H44021234",
    qty: 20, reason: "季节性需求", reasonOther: "",
    remark: "秋冬季呼吸科用药量上升，需补充库存。",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-11-02 10:12", submitTime: "2026-11-02 10:12",
    status: "resolved", solveMethod: "center-transfer", solveDesc: "已安排中心药房调拨 20 盒，11 月 4 日到货签收。",
    records: [
      { node: "提交登记", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-11-02 10:12" },
      { node: "中心药房受理", person: "赵敏", org: "区域中心药房", result: "受理", opinion: "—", time: "2026-11-03 09:00" },
      { node: "解决登记", person: "赵敏", org: "区域中心药房", result: "已解决", opinion: "解决方式：中心调拨；已安排中心药房调拨 20 盒，11 月 4 日到货签收。", time: "2026-11-03 15:40" }
    ]
  },
  {
    id: "sy4", code: "QY20261101004",
    category: "catalog", urgency: "urgent",
    drugId: "", si: -1, drugCode: "",
    drugName: "对乙酰氨基酚栓", spec: "0.15g * 10粒/盒",
    vendor: "湖北东信药业有限公司", approval: "国药准字H42021488",
    qty: 40, reason: "其他", reasonOther: "冬季儿童退热需求激增，现有剂型不适合婴幼儿使用",
    remark: "",
    creatorId: "u1", creator: "王芳", creatorOrg: "青河村卫生室",
    createdAt: "2026-11-01 16:30", submitTime: "2026-11-01 16:30",
    status: "rejected",
    records: [
      { node: "提交登记", person: "王芳", org: "青河村卫生室", result: "已提交", opinion: "—", time: "2026-11-01 16:30" },
      { node: "中心药房受理", person: "赵敏", org: "区域中心药房", result: "拒绝", opinion: "该品种不在区域基础用药目录遴选范围内，请先走药品目录遴选流程。", time: "2026-11-02 10:15" }
    ]
  },
  {
    id: "sy5", code: "QY20261108005",
    category: "stock", urgency: "normal",
    drugId: "d6", si: 0, drugCode: "1210500306",
    drugName: "布洛芬缓释胶囊", spec: "0.3g * 20粒/盒",
    vendor: "中美天津史克制药有限公司", approval: "H10900089",
    qty: 15, reason: "库存不足", reasonOther: "",
    remark: "",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    createdAt: "2026-11-08 11:45", submitTime: "2026-11-08 11:45",
    status: "draft",
    records: []
  },
  {
    id: "sy6", code: "QY20261106006",
    category: "catalog", urgency: "normal",
    drugId: "", si: -1, drugCode: "",
    drugName: "氯雷他定糖浆", spec: "100ml:50mg/瓶",
    vendor: "开封康诺药业有限公司", approval: "国药准字H20050280",
    qty: 10, reason: "季节性需求", reasonOther: "",
    remark: "秋季过敏性鼻炎患儿增多，目录内缺少儿童用抗组胺剂型。",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    createdAt: "2026-11-06 15:20", submitTime: "2026-11-06 15:20",
    status: "pending",
    records: [
      { node: "提交登记", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-11-06 15:20" }
    ]
  }
];

/* ==========================================================================
   横向调拨（成员机构 ⇄ 成员机构，中心药房仅审核）
   追加：第二家成员机构（member-2 城西社区卫生服务中心）的药房 / 库位 / 演示账号，
   以及横向调拨种子单据。单号前缀 HB，与纵向 DB 区分。
   ========================================================================== */

MOCK.pharmacies["member-2"] = [{ id: "ph-m2-1", name: "城西社区·门诊药房" }];
MOCK.locations["ph-m2-1"] = [
  { id: "loc-m2-1-A", name: "门诊区-A1" },
  { id: "loc-m2-1-B", name: "门诊区-B2" }
];

/* 成员机构 B 方演示账号（城西社区卫生服务中心，可发起横向调拨、执行出库） */
MOCK.users.push({
  id: "u6", account: "zhouting", name: "周婷",
  org: "城西社区卫生服务中心", role: "member",
  roleName: "成员机构（可发起、可审核）"
});

/* 横向调拨种子数据：createType = "horizontal"，outOrg 在创建时即确定为供应成员机构 */
[].push.apply(MOCK.transfers, [
  {
    id: "h1", code: "HB20261105001",
    createType: "horizontal",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    applyOrg: "member-1", applyOrgName: "城东社区卫生服务中心",
    applyPharmacy: "ph-m1-1", applyPharmacyName: "城东社区·门诊药房",
    applyLocation: "loc-m1-1-A", applyLocationName: "门诊区-A1",
    shortageDesc: "门诊阿莫西林消耗加快，向城西社区申请横向调剂。",
    createdAt: "2026-11-05 09:40", submitTime: "2026-11-05 09:40",
    auditStatus: "center", transferStatus: "",
    outOrg: "member-2", outOrgName: "城西社区卫生服务中心",
    outPharmacy: "", outPharmacyName: "", outLocation: "", outLocationName: "",
    outCode: "", inCode: "", nextStep: "",
    items: [
      { drugId: "d1", si: 0, drugCode: "1210500301", drugName: "阿莫西林胶囊", specCode: "1010400101", spec: "0.25g * 24粒/盒", applyQty: 20 },
      { drugId: "d2", si: 0, drugCode: "1210500302", drugName: "阿莫西林颗粒", specCode: "1010400201", spec: "0.125g * 20袋/盒", applyQty: 30 }
    ], batches: [], records: [
      { node: "提交", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-11-05 09:40" }
    ]
  },
  {
    id: "h2", code: "HB20261104002",
    createType: "horizontal",
    creatorId: "u6", creator: "周婷", creatorOrg: "城西社区卫生服务中心",
    applyOrg: "member-2", applyOrgName: "城西社区卫生服务中心",
    applyPharmacy: "ph-m2-1", applyPharmacyName: "城西社区·门诊药房",
    applyLocation: "loc-m2-1-A", applyLocationName: "门诊区-A1",
    shortageDesc: "头孢呋辛酯片采购在途，先向城东社区临时调剂。",
    createdAt: "2026-11-04 15:20", submitTime: "2026-11-04 15:20",
    auditStatus: "approved", transferStatus: "out",
    outOrg: "member-1", outOrgName: "城东社区卫生服务中心",
    outPharmacy: "", outPharmacyName: "", outLocation: "", outLocationName: "",
    outCode: "", inCode: "", nextStep: "direct-outbound",
    items: [
      { drugId: "d5", si: 0, drugCode: "1210500305", drugName: "头孢呋辛酯片", specCode: "1010400501", spec: "0.25g * 12片/盒", applyQty: 12 }
    ], batches: [], records: [
      { node: "提交", person: "周婷", org: "城西社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-11-04 15:20" },
      { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "同意", opinion: "—", time: "2026-11-05 10:05" }
    ]
  },
  {
    id: "h3", code: "HB20261103003",
    createType: "horizontal",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    applyOrg: "member-1", applyOrgName: "城东社区卫生服务中心",
    applyPharmacy: "ph-m1-1", applyPharmacyName: "城东社区·门诊药房",
    applyLocation: "loc-m1-1-B", applyLocationName: "门诊区-B2",
    shortageDesc: "连花清瘟胶囊申请横向调剂 60 盒。",
    createdAt: "2026-11-03 11:10", submitTime: "2026-11-03 11:10",
    auditStatus: "rejected", transferStatus: "",
    outOrg: "member-2", outOrgName: "城西社区卫生服务中心",
    outPharmacy: "", outPharmacyName: "", outLocation: "", outLocationName: "",
    outCode: "", inCode: "", nextStep: "",
    items: [
      { drugId: "d7", si: 0, drugCode: "1210500307", drugName: "连花清瘟胶囊", specCode: "1010400701", spec: "0.35g * 24粒/盒", applyQty: 60 }
    ], batches: [], records: [
      { node: "提交", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-11-03 11:10" },
      { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "拒绝", opinion: "出库机构该规格库存不足，请与城西社区线下协调后另行申请。", time: "2026-11-04 09:30" }
    ]
  },
  {
    id: "h4", code: "HB20261030004",
    createType: "horizontal",
    creatorId: "u2", creator: "李强", creatorOrg: "城东社区卫生服务中心",
    applyOrg: "member-1", applyOrgName: "城东社区卫生服务中心",
    applyPharmacy: "ph-m1-1", applyPharmacyName: "城东社区·门诊药房",
    applyLocation: "loc-m1-1-A", applyLocationName: "门诊区-A1",
    shortageDesc: "",
    createdAt: "2026-10-30 14:00", submitTime: "2026-10-30 14:00",
    auditStatus: "approved", transferStatus: "done",
    outOrg: "member-2", outOrgName: "城西社区卫生服务中心",
    outPharmacy: "ph-m2-1", outPharmacyName: "城西社区·门诊药房",
    outLocation: "loc-m2-1-A", outLocationName: "门诊区-A1",
    outCode: "CK20261031002", inCode: "RK20261101003",
    outTime: "2026-10-31 16:20", inTime: "2026-11-01 09:50",
    nextStep: "",
    items: [
      { drugId: "d6", si: 0, drugCode: "1210500306", drugName: "布洛芬缓释胶囊", specCode: "1010400601", spec: "0.3g * 20粒/盒", applyQty: 10 }
    ],
    batches: [
      { key: "d6_0", drugId: "d6", si: 0, drugCode: "1210500306", drugName: "布洛芬缓释胶囊", specCode: "1010400601", spec: "0.3g * 20粒/盒", applyQty: 10,
        rows: [
          { batchNo: "P260502", vendor: "哈药集团制药总厂", stock: 150, purchase: 6.95, retail: 12.80, expDate: "2028-05-07", outQty: 10 }
        ]
      }
    ], records: [
      { node: "提交", person: "李强", org: "城东社区卫生服务中心", result: "已提交", opinion: "—", time: "2026-10-30 14:00" },
      { node: "中心药房审核", person: "赵敏", org: "区域中心药房", result: "同意", opinion: "—", time: "2026-10-30 17:40" },
      { node: "出库", person: "周婷", org: "城西社区卫生服务中心", result: "出库完成", opinion: "出库单号 CK20261031002", time: "2026-10-31 16:20" },
      { node: "入库", person: "李强", org: "城东社区卫生服务中心", result: "入库完成", opinion: "—", time: "2026-11-01 09:50" }
    ]
  }
]);
