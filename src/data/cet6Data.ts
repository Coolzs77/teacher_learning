/**
 * 琪琪专属 · 英语六级真题突破备战数据库 (388分 ➔ 425+ 战术冲刺)
 * 深度整合了 ExamCraft 语法树拆解、真题长难句切片、四步词性分类选词填空秒杀法、
 * 以及 5 段万能底层逻辑作文骨架与八大主题翻译预测语料。
 */

export interface ScoreDiagnosis {
  candidateName: string;
  historyScores: {
    examDate: string;
    total: number;
    listening: number;
    reading: number;
    writingAndTranslation: number;
    summary: string;
  }[];
  targetScore: number;
  gapScore: number;
  tacticalPlan: {
    module: string;
    currentScore: string;
    targetScore: string;
    pointsGain: string;
    coreProblem: string;
    breakthroughStrategy: string;
    roiLevel: '极高 (考场提分主力)' | '高' | '中等 (维稳为主)';
  }[];
  timeManagementRules: {
    stage: string;
    timeRange: string;
    durationMinutes: number;
    action: string;
    examinerWarning: string;
  }[];
}

export interface BankedClozeTechnique {
  step: number;
  title: string;
  rule: string;
  example: string;
  suffixRules: {
    pos: 'Noun (名词)' | 'Verb (动词)' | 'Adjective (形容词)' | 'Adverb (副词)';
    suffixes: string[];
    tips: string;
  }[];
  sentenceSlots: {
    slotPattern: string;
    targetPos: string;
    explanation: string;
  }[];
}

export interface ComplexSentenceSlice {
  id: string;
  examSource: string;
  paragraphSnippet: string;
  originalSentence: string;
  syntaxHighlight: {
    mainSubject: string;
    mainPredicate: string;
    mainObjectOrComplement: string;
    modifiers: {
      type: '定语从句' | '状语从句' | '非谓语分词短语' | '同位语' | '插入语';
      content: string;
      role: string;
    }[];
  };
  translation: string;
  quickReadingRule: string; // 考场5秒速读法（抓核心、略支节）
  cet6KeyVocab: { word: string; meaning: string }[];
}

export interface WritingFramework {
  universalLogicTitle: string;
  universalFiveParagraphs: {
    paraIndex: number;
    layerTitle: string;
    layerBadge: string;
    englishTemplate: string;
    chineseTranslation: string;
    fillSlots: { slotId: string; slotPrompt: string; slotExample: string }[];
  }[];
  realExamEssays: {
    id: string;
    title: string;
    examPrompt: string;
    chineseTopic: string;
    studentSampleEssay: {
      para1Eng: string;
      para1Chn: string;
      para2Eng: string;
      para2Chn: string;
      para3Eng: string;
      para3Chn: string;
      para4Eng: string;
      para4Chn: string;
      para5Eng: string;
      para5Chn: string;
    };
  }[];
  pluginVocabBanks: {
    category: string;
    icon: string;
    tags: string[];
    themeColor: string;
    phrases: { eng: string; chn: string }[];
  }[];
}

export interface TranslationFramework {
  tenUniversalSentencePatterns: {
    id: number;
    chinesePattern: string;
    englishPattern: string;
    exampleChn: string;
    exampleEng: string;
  }[];
  eightCoreThemes: {
    id: string;
    themeName: string;
    icon: string;
    badgeColor: string;
    keywords: { chn: string; eng: string }[];
    advancedExpressions: string[];
  }[];
  advancedVocabularyReplacements: {
    originalWord: string;
    meaning: string;
    upgradedWords: string;
    exampleUsage: string;
  }[];
}

export interface EmergencyRescuePack {
  exampleFallbacks: {
    level: string;
    eng: string;
    chn: string;
  }[];
  blankMindGuaranteedFiveSteps: {
    step: string;
    slotTitle: string;
    eng: string;
    chn: string;
  }[];
  lastTwentyMinutesEssentialTen: {
    index: number;
    eng: string;
    chn: string;
  }[];
}

// 1. 琪琪成绩诊断与得分模型
export const QIQI_SCORE_DIAGNOSIS: ScoreDiagnosis = {
  candidateName: "琪琪",
  historyScores: [
    {
      examDate: "2025 年 12 月",
      total: 374,
      listening: 109,
      reading: 155,
      writingAndTranslation: 110,
      summary: "首次试水，听力失分较多，选词填空因时间紧迫全部蒙同一选项，写作翻译依靠临时背诵。"
    },
    {
      examDate: "2026 年 6 月",
      total: 388,
      listening: 115,
      reading: 164,
      writingAndTranslation: 109,
      summary: "第二次备考总分上涨 14 分，阅读基本盘稳健（164分），但选词填空仍然全部放弃，写作翻译未系统化维持在 109 分。"
    }
  ],
  targetScore: 425,
  gapScore: 37,
  tacticalPlan: [
    {
      module: "选词填空 (Section A)",
      currentScore: "目前约 0 分",
      targetScore: "目标 14.2 分 (做对4题)",
      pointsGain: "+14 分",
      coreProblem: "以前看都不看直接全蒙 C，白白扔掉了 35 分。",
      breakthroughStrategy: "花 4 分钟看词尾（名/动/形/副），挑 4 道最简单的送分题做，剩下的全蒙。稳拿 14 分！",
      roiLevel: "极高 (考场提分主力)"
    },
    {
      module: "写作模块 (Writing)",
      currentScore: "目前约 55 分",
      targetScore: "目标 75 分",
      pointsGain: "+20 分",
      coreProblem: "考场硬憋句子，句式单调还容易拼错单词、错语法。",
      breakthroughStrategy: "背熟固定的 5 段框架直接默写，把题目单词填进去，稳稳写满 180 词。",
      roiLevel: "极高 (考场提分主力)"
    },
    {
      module: "翻译模块 (Translation)",
      currentScore: "目前约 54 分",
      targetScore: "目标 70 分",
      pointsGain: "+16 分",
      coreProblem: "看到中文不会断句，逐字硬翻译成中式英语。",
      breakthroughStrategy: "先找准主语和动词，套用 10 个常用好句型，少犯语法错，稳拿 70 分。",
      roiLevel: "极高 (考场提分主力)"
    },
    {
      module: "长篇阅读与仔细阅读 (Reading)",
      currentScore: "目前 164 分 (底子不错)",
      targetScore: "目标 175 分",
      pointsGain: "+11 分",
      coreProblem: "碰到修饰多的长句子就发懵，反复读浪费大把时间。",
      breakthroughStrategy: "跳过长修饰，先抓谁做了什么。仔细阅读一题 14.2 分，每篇多对 1 题就稳过了！",
      roiLevel: "高"
    },
    {
      module: "听力理解 (Listening)",
      currentScore: "目前 115 分",
      targetScore: "目标 120 分 (稳住即可)",
      pointsGain: "+5 分",
      coreProblem: "语速一快脑子容易发懵，总想听懂每个单词导致后面全漏。",
      breakthroughStrategy: "不搞题海战术。盯紧 but/however 转折词后面的句子，必须边听边涂答题卡！",
      roiLevel: "中等 (维稳为主)"
    }
  ],
  timeManagementRules: [
    {
      stage: "阶段一：发卷与填信息",
      timeRange: "09:00 - 09:10",
      durationMinutes: 10,
      action: "核对试卷完整性，填好姓名和准考证号。",
      examinerWarning: "千万别提前动笔写正文，可以先默读作文题想想写什么。"
    },
    {
      stage: "阶段二：写短文作文",
      timeRange: "09:10 - 09:40",
      durationMinutes: 30,
      action: "在答题卡 1 上直接默写背好的 5 段作文，填入题目关键词，写够 180 词。",
      examinerWarning: "30分钟一到必须停笔，绝不能占用听力时间！"
    },
    {
      stage: "阶段三：听力考试",
      timeRange: "09:40 - 10:05",
      durationMinutes: 25,
      action: "边听边涂答题卡 1！录音放完监考老师立刻收答题卡 1，无补涂时间。",
      examinerWarning: "千万不要等听完全部再涂卡！必须边听边在卡 1 上涂黑！"
    },
    {
      stage: "阶段四：先做仔细阅读",
      timeRange: "10:10 - 10:35",
      durationMinutes: 25,
      action: "趁精力最好先做完两篇仔细阅读（共10题，每题14.2分，总分142分！）。",
      examinerWarning: "分值最高！先做仔细阅读，别留到最后慌乱瞎猜！"
    },
    {
      stage: "阶段五：长篇匹配阅读",
      timeRange: "10:35 - 10:50",
      durationMinutes: 15,
      action: "先读 10 道题干圈出专有名词、人名、数字，再回原文扫读段落首尾句定位。",
      examinerWarning: "切忌逐字通读全文，完全靠关键词快速定位段落！"
    },
    {
      stage: "阶段六：选词填空（只做4分钟）",
      timeRange: "10:50 - 10:55",
      durationMinutes: 5,
      action: "看词尾挑出最有把握的 3~4 道送分题填上，剩余题目全部快速蒙同一个选项。",
      examinerWarning: "绝不纠结超过 5 分钟！做对 4 题就是白赚 14.2 分！"
    },
    {
      stage: "阶段七：汉译英翻译",
      timeRange: "10:55 - 11:20",
      durationMinutes: 25,
      action: "划出主谓宾，套用 10 个常用好句型，句子写简单通顺即可，不用生僻词。",
      examinerWarning: "宁可写结构清晰的简单句，也绝不要写语法残缺的错句！"
    },
    {
      stage: "阶段八：全面检查收卷",
      timeRange: "11:20 - 11:25",
      durationMinutes: 5,
      action: "检查答题卡 2 是否填涂完整无漏涂、错位，确认准考证号无误。",
      examinerWarning: "稳住心态，仔细检查答题卡！"
    }
  ]
};

// 2. 选词填空4步快选与高频词尾技巧
export const BANKED_CLOZE_RULES: BankedClozeTechnique = {
  step: 1,
  title: "看词尾挑送分题（4分钟拿14分）",
  rule: "绝不先读文章！先看选项最后几个字母标出词性（N名词、V动词、Adj形容词、Adv副词），再看空格前后需要什么词，范围立刻缩小到2~3个词。",
  example: "例：空格前是 ‘play a _____ role in’，这里必然缺形容词修饰 role。直接在标了 Adj 的词里挑，选出 crucial / vital / significant！",
  suffixRules: [
    {
      pos: "Noun (名词)",
      suffixes: ["-tion / -sion (education, decision)", "-ment (development, achievement)", "-ity / -ty (activity, diversity)", "-ance / -ence (importance, significance)", "-er / -or (researcher, creator)", "-ness (awareness, darkness)"],
      tips: "常出现在冠词 (a/the)、形容词、介词后，或作句子主语/宾语。"
    },
    {
      pos: "Verb (动词)",
      suffixes: ["-ate (cultivate, stimulate)", "-ize / -ise (realize, recognize)", "-ify (simplify, identify)", "-en (strengthen, broaden)", "-ed (过去式/过去分词/被动)", "-ing (现在分词/动名词)"],
      tips: "缺少谓语、情态动词 (can/should/will) 后用动词原形；助动词 have/has 后接 done。"
    },
    {
      pos: "Adjective (形容词)",
      suffixes: ["-ive (innovative, competitive)", "-ous (continuous, prosperous)", "-ful (successful, meaningful)", "-able / -ible (sustainable, flexible)", "-al (cultural, traditional)", "-ic (economic, historic)"],
      tips: "常放在名词前作定语，或放在 be / become / seem / remain 等系动词后作表语。"
    },
    {
      pos: "Adverb (副词)",
      suffixes: ["-ly (increasingly, effectively, dramatically)", "-ward / -wards (forward, backwards)"],
      tips: "15个词中副词通常只有 2-3 个！出现‘逗号放在句首’或‘修饰动词/形容词’时闭着眼睛选副词！"
    }
  ],
  sentenceSlots: [
    {
      slotPattern: "a / an / the + [ 空格 ] + of / in",
      targetPos: "名词 (Noun)",
      explanation: "被冠词限定，后面紧跟介词短语，空格 100% 填入名词单数或复数。"
    },
    {
      slotPattern: "主语 + 情态动词 (can / may / must / should) + [ 空格 ]",
      targetPos: "动词原形 (Verb Base)",
      explanation: "情态动词后面必须接动词原形，在 15 个选项中找标注为 V(原) 的词。"
    },
    {
      slotPattern: "be / become / seem + [ 空格 ]",
      targetPos: "形容词 (Adjective) 或 过去分词 (V-ed)",
      explanation: "系表结构，表示状态或被动语态。"
    },
    {
      slotPattern: "[ 空格 ], 主语 + 谓语 + 宾语 (位于句首且有逗号隔开)",
      targetPos: "副词 (Adverb)",
      explanation: "修饰整个主句的评注性副词，如 Interestingly, Surprisingly, Fortunately。"
    }
  ]
};

// 3. 真题长难句抓主谓宾拆解
export const COMPLEX_SENTENCE_SLICES: ComplexSentenceSlice[] = [
  {
    id: "syntax-1",
    examSource: "2026年6月六级真题 · 仔细阅读第2篇",
    paragraphSnippet: "Passage 2 discusses how generative artificial intelligence reshaping intellectual labor and higher education.",
    originalSentence: "The rapid integration of sophisticated algorithms into the workplace, which was once thought to threaten only routine manual labor, is now fundamentally transforming complex decision-making processes across diverse industries.",
    syntaxHighlight: {
      mainSubject: "The rapid integration of sophisticated algorithms into the workplace",
      mainPredicate: "is now fundamentally transforming",
      mainObjectOrComplement: "complex decision-making processes across diverse industries",
      modifiers: [
        {
          type: "定语从句",
          content: "which was once thought to threaten only routine manual labor",
          role: "修饰主语 integration，说明这种整合过去曾被认为只威胁常规体力劳动。"
        },
        {
          type: "非谓语分词短语",
          content: "sophisticated (复杂的) 作定语修饰 algorithms",
          role: "限定算法的复杂性质。"
        }
      ]
    },
    translation: "高端算法向工作场所的迅猛渗透（曾经被认为只威胁常规的体力劳动），如今正在从根本上重塑各个行业复杂的决策流程。",
    quickReadingRule: "跳读定语从句！先抓主干：Integration is transforming decision-making processes（技术整合正在改变决策），5秒搞定核心句意！",
    cet6KeyVocab: [
      { word: "integration", meaning: "n. 融合，结合" },
      { word: "sophisticated", meaning: "adj. 精密的，复杂的，高阶的" },
      { word: "fundamentally", meaning: "adv. 根本上，从本质上" }
    ]
  },
  {
    id: "syntax-2",
    examSource: "2025年12月六级真题 · 仔细阅读第1篇",
    paragraphSnippet: "Environmental economics and sustainable urban development.",
    originalSentence: "Although conventional economic metrics fail to account for ecological degradation, a growing number of policymakers are beginning to recognize that long-term prosperity cannot be achieved at the expense of environmental sustainability.",
    syntaxHighlight: {
      mainSubject: "a growing number of policymakers",
      mainPredicate: "are beginning to recognize",
      mainObjectOrComplement: "that long-term prosperity cannot be achieved at the expense of environmental sustainability (宾语从句)",
      modifiers: [
        {
          type: "状语从句",
          content: "Although conventional economic metrics fail to account for ecological degradation",
          role: "让步状语从句，说明传统经济指标未能计入生态退化。"
        }
      ]
    },
    translation: "尽管传统的经济指标未能将生态退化考虑在内，但越来越多的政策制定者开始意识到，长期的繁荣绝不能以牺牲环境可持续性为代价。",
    quickReadingRule: "Although从句非重点，重心在主句！抓住 policymakers recognize prosperity cannot sacrifice environment（决策者意识到繁荣不能牺牲环境）。",
    cet6KeyVocab: [
      { word: "conventional", meaning: "adj. 传统的，常规的" },
      { word: "degradation", meaning: "n. 退化，降解" },
      { word: "at the expense of", meaning: "以……为代价" }
    ]
  },
  {
    id: "syntax-3",
    examSource: "2025年12月六级真题 · 选词填空与长篇阅读",
    paragraphSnippet: "Higher education research on resilience and mental health among university students.",
    originalSentence: "Students who are capable of maintaining emotional resilience in the face of academic pressure generally demonstrate a higher degree of cognitive adaptability when confronted with unforeseen challenges.",
    syntaxHighlight: {
      mainSubject: "Students",
      mainPredicate: "demonstrate",
      mainObjectOrComplement: "a higher degree of cognitive adaptability",
      modifiers: [
        {
          type: "定语从句",
          content: "who are capable of maintaining emotional resilience in the face of academic pressure",
          role: "修饰主语 Students，定义具备抗压情绪韧性的学生群体。"
        },
        {
          type: "状语从句",
          content: "when confronted with unforeseen challenges (分词状语)",
          role: "时间状语，表示当面对不可预见的挑战时。"
        }
      ]
    },
    translation: "那些在学业压力面前能够保持情绪韧性的学生，在遭遇突发意外挑战时，通常表现出更高水平的认知适应能力。",
    quickReadingRule: "把 who ... 从句在脑海中画括号，主干就是 Students demonstrate adaptability（抗压学生更具适应力）。",
    cet6KeyVocab: [
      { word: "resilience", meaning: "n. 韧性，弹力，恢复力" },
      { word: "cognitive", meaning: "adj. 认知的" },
      { word: "confronted with", meaning: "面临，面对" }
    ]
  },
  {
    id: "syntax-4",
    examSource: "经典六级真题 · 科技与伦理探讨",
    paragraphSnippet: "Discussion on the boundaries of algorithmic recommendation systems.",
    originalSentence: "It is widely acknowledged that the pervasive influence of social media algorithms, while enhancing connectivity and communication, has inadvertently fostered echo chambers that amplify societal polarization.",
    syntaxHighlight: {
      mainSubject: "It (形式主语) / the pervasive influence of social media algorithms (从句主语)",
      mainPredicate: "has inadvertently fostered",
      mainObjectOrComplement: "echo chambers",
      modifiers: [
        {
          type: "状语从句",
          content: "while enhancing connectivity and communication (让步状语插入语)",
          role: "对比算法带来的便利与负面效应。"
        },
        {
          type: "定语从句",
          content: "that amplify societal polarization",
          role: "修饰先行词 echo chambers (信息茧房/回音室)。"
        }
      ]
    },
    translation: "人们普遍认为，社交媒体算法的广泛影响，在增进人际联结与沟通的同时，也无意中促成了加剧社会两极分化的‘信息回音室’。",
    quickReadingRule: "It is widely acknowledged that... 是固定客观套话，直接看 that 后的核心：Algorithms foster echo chambers that amplify polarization（算法形成信息茧房并放大两极分化）。",
    cet6KeyVocab: [
      { word: "pervasive", meaning: "adj. 无处不在的，弥漫的" },
      { word: "inadvertently", meaning: "adv. 无意地，非故意地" },
      { word: "polarization", meaning: "n. 两极分化" }
    ]
  }
];

// 4. 核心写作万能骨架与真题演练 (整合自 user artifact `code_artifact (9).html`)
export const WRITING_FRAMEWORK_DATA: WritingFramework = {
  universalLogicTitle: "作文 5 段思路：引出话题 ➔ 个人影响 ➔ 他人例子 ➔ 社会价值 ➔ 总结呼吁",
  universalFiveParagraphs: [
    {
      paraIndex: 1,
      layerTitle: "第 1 段 · 引入段（引出话题，确立基调）",
      layerBadge: "引入层",
      englishTemplate: "[抄写考卷上给出的固定首句]. I find this statement both insightful and convincing. From my perspective, the message it conveys deserves serious consideration, especially among young people who are shaping their future.",
      chineseTranslation: "[抄写考卷上给出的固定首句]。我觉得这句话既有深刻见地又极具说服力。在我看来，它传达的信息值得认真思考，特别是在正在塑造自己未来的年轻人当中。",
      fillSlots: [
        {
          slotId: "slot-prompt",
          slotPrompt: "抄写考卷上给出的固定首句",
          slotExample: "Living in an increasingly competitive world, college students should better prepare themselves to confront various challenges."
        }
      ]
    },
    {
      paraIndex: 2,
      layerTitle: "第 2 段 · 个人成长层（First and foremost...）",
      layerBadge: "个人层",
      englishTemplate: "First and foremost, __第一空：填入对个人的正面影响__. It not only enables individuals to [动词原形短语 A], but also equips them with the ability to [动词原形短语 B]. As a result, they can better adapt to the ever-changing society and cope with various challenges in life.",
      chineseTranslation: "首先，__第一空：填入对个人的正面影响__。它不仅使个人能够 [做到某事 A]，而且赋予他们 [做到某事 B] 的能力。因此，他们能更好地适应不断变化的社会，应对生活中的各种挑战。",
      fillSlots: [
        {
          slotId: "slot-p2-influence",
          slotPrompt: "第一空：填入对个人的正面影响",
          slotExample: "adequate preparation enables students to improve their competence and resilience"
        },
        {
          slotId: "slot-p2-verbA",
          slotPrompt: "动词原形短语 A",
          slotExample: "acquire professional knowledge and practical skills"
        },
        {
          slotId: "slot-p2-verbB",
          slotPrompt: "动词原形短语 B",
          slotExample: "deal with uncertainty and pressure"
        }
      ]
    },
    {
      paraIndex: 3,
      layerTitle: "第 3 段 · 他人影响层（In addition... + 万能举例）",
      layerBadge: "他人层",
      englishTemplate: "In addition, __第二空：填入对他人的积极影响__. People who possess this quality are generally more likely to [动词原形短语 C], thereby creating a positive impact on those around them. A relevant example can be found in our daily lives, where many ordinary individuals achieve extraordinary progress through [名词或 V-ing 短语 D].",
      chineseTranslation: "此外，__第二空：填入对他人的积极影响__。拥有这种品质的人通常更有可能 [做到某事 C]，从而对周围的人产生积极影响。在我们的日常生活中可以找到一个相关的例子，许多普通人通过 [某种行为 D] 取得了非凡的进步。",
      fillSlots: [
        {
          slotId: "slot-p3-influence",
          slotPrompt: "第二空：填入对他人的积极影响",
          slotExample: "students who are well prepared tend to cooperate more effectively with others and make wiser decisions"
        },
        {
          slotId: "slot-p3-verbC",
          slotPrompt: "动词原形短语 C",
          slotExample: "inspire those around them to strive for excellence"
        },
        {
          slotId: "slot-p3-nounD",
          slotPrompt: "名词或 V-ing 短语 D (万能举例落地)",
          slotExample: "accumulating experience and continuously improving themselves during college years"
        }
      ]
    },
    {
      paraIndex: 4,
      layerTitle: "第 4 段 · 社会价值层（Last but not least...）",
      layerBadge: "社会层",
      englishTemplate: "Last but not least, __第三空：填入对社会的价值__. In the long run, it contributes not only to personal growth but also to the advancement of society as a whole.",
      chineseTranslation: "最后，__第三空：填入对社会的价值__。从长远来看，它不仅有助于个人成长，也有助于整个社会的全面进步。",
      fillSlots: [
        {
          slotId: "slot-p4-social",
          slotPrompt: "第三空：填入对社会的价值",
          slotExample: "a generation equipped with sufficient knowledge, skills and a growth mindset will inject positive energy into society"
        }
      ]
    },
    {
      paraIndex: 5,
      layerTitle: "第 5 段 · 总结升华段（Taking all these factors into account...）",
      layerBadge: "总结层",
      englishTemplate: "Taking all these factors into account, I firmly believe that this idea should be valued and put into practice. Only by doing so can we become a better version of ourselves and embrace a more promising future.",
      chineseTranslation: "考虑到所有这些因素，我坚信这个想法应该受到重视并付诸实践。只有这样，我们才能成为更好的自己，拥抱更有希望的未来。",
      fillSlots: []
    }
  ],
  realExamEssays: [
    {
      id: "essay-1",
      title: "2025年12月真题一：中国梦与青年奋斗",
      examPrompt: "Directions: For this part, you are allowed 30 minutes to write an essay on 'The Chinese Dream and Youth Responsibility'. You should write at least 150 words but no more than 200 words.",
      chineseTopic: "中国梦与青年担当（个人理想融入国家伟业）",
      studentSampleEssay: {
        para1Eng: "The Chinese Dream is a shared aspiration for national rejuvenation, which requires the active participation of contemporary youth. I find this statement both insightful and convincing. From my perspective, the message it conveys deserves serious consideration, especially among young people who are shaping their future.",
        para1Chn: "中国梦是实现民族复兴的共同心愿，需要当代青年的积极参与。我觉得这句话既有深刻见地又极具说服力。在我看来，它传达的信息值得认真思考，特别是在正在塑造未来的年轻人当中。",
        para2Eng: "First and foremost, striving for the Chinese Dream inspires individuals to pursue their aspirations with determination. It not only enables them to realize their full potential, but also equips them with the ability to overcome setbacks and embrace challenges. As a result, they can better adapt to the ever-changing society and cope with various challenges in life.",
        para2Chn: "首先，为中国梦而奋斗激励个人坚定地追求抱负。它不仅使他们能够实现自身潜能，而且赋予他们克服挫折和迎接挑战的能力。因此，他们能更好地适应不断变化的社会，应对生活中的各种挑战。",
        para3Eng: "In addition, dedicated young people can set positive examples for their peers. People who possess this quality are generally more likely to inspire those around them to strive for excellence, thereby creating a positive impact on those around them. A relevant example can be found in our daily lives, where many ordinary individuals achieve extraordinary progress through persistent effort and selfless contribution.",
        para3Chn: "此外，专注敬业的年轻人能为同龄人树立积极榜样。具备这种品质的人通常更有可能激励周围的人追求卓越，从而产生积极影响。在日常生活中可以找到例证，许多普通人通过坚持不懈的努力和无私奉献取得了非凡进步。",
        para4Eng: "Last but not least, youth responsibility provides an inexhaustible momentum for the prosperity of the nation. In the long run, it contributes not only to personal growth but also to the advancement of society as a whole.",
        para4Chn: "最后，青年的责任担当为国家繁荣提供了源源不断的动力。从长远来看，它不仅有助于个人成长，也有助于整个社会的全面进步。",
        para5Eng: "Taking all these factors into account, I firmly believe that this idea should be valued and put into practice. Only by doing so can we become a better version of ourselves and embrace a more promising future.",
        para5Chn: "考虑到所有这些因素，我坚信这个想法应该受到重视并付诸实践。只有这样，我们才能成为更好的自己，拥抱更有希望的未来。"
      }
    },
    {
      id: "essay-2",
      title: "2025年12月真题二：优秀教师的深远影响",
      examPrompt: "Directions: Write an essay on the importance of great teachers in shaping students' character and intellectual growth.",
      chineseTopic: "优秀教师的影响力（传道受业与灵魂塑造）",
      studentSampleEssay: {
        para1Eng: "Teachers play a pivotal role in guiding students along the path of knowledge and personal growth. I find this statement both insightful and convincing. From my perspective, the message it conveys deserves serious consideration, especially in today's educational reform.",
        para1Chn: "教师在引导学生走向知识和个人成长的道路上扮演着至关重要的角色。我觉得这句话既有深刻见地又极具说服力。在我看来，它传达的信息值得认真思考。",
        para2Eng: "First and foremost, outstanding educators cultivate students' critical thinking and curiosity. It not only enables individuals to acquire academic knowledge, but also equips them with the ability to distinguish right from wrong. As a result, they can better adapt to the ever-changing society and cope with various challenges in life.",
        para2Chn: "首先，优秀的教育工作者培养学生的批判性思维和好奇心。它不仅使个人能够获取学科知识，而且赋予他们辨别是非的能力。因此，他们能更好地适应变化并应对挑战。",
        para3Eng: "In addition, caring teachers foster emotional resilience and positive values. People who receive such guidance are generally more likely to show empathy towards others, thereby creating a positive impact on those around them. A relevant example can be found in our daily lives, where many ordinary individuals achieve extraordinary progress through teachers' encouraging words and patient guidance.",
        para3Chn: "此外，富有爱心的教师培养学生的情绪韧性和积极价值观。受到这种指导的人通常更有可能对他人生发同理心。日常生活中许多普通人正是在老师耐心的鼓励下取得了非凡进步。",
        para4Eng: "Last but not least, a strong teaching force lays the foundation for a civilization that cherishes knowledge and wisdom. In the long run, it contributes not only to personal growth but also to the advancement of society as a whole.",
        para4Chn: "最后，强大的师资队伍为崇尚知识与智慧的文明奠定了基石。从长远来看，它不仅有助于个人成长，也有助于整个社会的全面进步。",
        para5Eng: "Taking all these factors into account, I firmly believe that this idea should be valued and put into practice. Only by doing so can we become a better version of ourselves and embrace a more promising future.",
        para5Chn: "考虑到所有这些因素，我坚信这个理念应该受到重视并付诸实践。只有这样，我们才能成为更好的自己，拥抱更有希望的未来。"
      }
    },
    {
      id: "essay-3",
      title: "2026年6月真题三：迎接未来挑战的准备",
      examPrompt: "Directions: College students should better prepare themselves to confront various challenges in a competitive world.",
      chineseTopic: "大学生应对竞争与挑战（能力储备与成长型思维）",
      studentSampleEssay: {
        para1Eng: "Living in an increasingly competitive world, college students should better prepare themselves to confront various challenges. I find this statement both insightful and convincing. From my perspective, the message it conveys deserves serious consideration, especially among university students.",
        para1Chn: "生活在竞争日益激烈的世界中，大学生应更好地准备自己以应对各种挑战。我觉得这句话既有深刻见地又极具说服力。在我看来，它传达的信息值得认真思考，特别是在大学生群体中。",
        para2Eng: "First and foremost, adequate preparation enables students to improve their competence and resilience. It not only helps them acquire professional knowledge and practical skills, but also equips them with the confidence to deal with uncertainty and pressure. As a result, they are more likely to seize opportunities and overcome obstacles.",
        para2Chn: "首先，充分的准备使学生能够提高自身能力和抗压弹性。它不仅帮助他们获取专业知识和实用技能，而且赋予他们应对不确定性和压力的信心。因此，他们更有可能抓住机遇并克服障碍。",
        para3Eng: "In addition, students who are well prepared tend to cooperate more effectively with others and make wiser decisions. They are generally more adaptable and capable of contributing to team success. A relevant example can be found in our daily lives, where many graduates stand out in the job market because they have accumulated experience and continuously improved themselves during college years.",
        para3Chn: "此外，准备充分的学生往往能更有效地与他人合作并做出更明智的决策。他们通常适应性更强。在日常生活中许多毕业生在就业市场脱颖而出，正是因为他们在大学期间积累了经验并不断提升自我。",
        para4Eng: "Last but not least, a generation equipped with sufficient knowledge, skills and a growth mindset will inject positive energy into society. In the long run, it contributes not only to personal success but also to sustainable social development.",
        para4Chn: "最后，具备充足知识、技能和成长型思维的一代人将为社会注入正能量。从长远来看，它不仅有助于个人成功，也有助于社会的可持续发展。",
        para5Eng: "Taking all these factors into account, I firmly believe that college students should prepare themselves for future challenges. Only by doing so can they become a better version of ourselves and embrace a more promising future.",
        para5Chn: "考虑到所有这些因素，我坚信大学生应该为未来的挑战做好准备。只有这样，他们才能成为更好的自己，拥抱更有希望的未来。"
      }
    }
  ],
  pluginVocabBanks: [
    {
      category: "梦想与奋斗类 (Dream & Aspiration)",
      icon: "☁️",
      tags: ["青年担当", "梦想奋斗", "中国梦", "实现潜能"],
      themeColor: "sky",
      phrases: [
        { eng: "inspires people to pursue their aspirations with determination", chn: "激励人们坚定地追求自己的抱负" },
        { eng: "realize their full potential", chn: "实现他们的全部潜能" },
        { eng: "overcome setbacks and embrace challenges", chn: "克服挫折并迎接挑战" },
        { eng: "set positive examples for others", chn: "为他人树立积极榜样" },
        { eng: "strive for excellence with persistent efforts", chn: "通过坚持不懈的努力追求卓越" }
      ]
    },
    {
      category: "创新与批判性思维 (Innovation & Critical Thinking)",
      icon: "💡",
      tags: ["科技创新", "批判思维", "理性判断", "解决问题"],
      themeColor: "purple",
      phrases: [
        { eng: "cultivates creativity and independent thinking", chn: "培养创造力和独立思考能力" },
        { eng: "make rational judgments under complex circumstances", chn: "在复杂情况下做出理性判断" },
        { eng: "solve problems from multidisciplinary perspectives", chn: "从跨学科不同角度解决问题" },
        { eng: "foster an open-minded and exploratory spirit", chn: "培养开明包容和勇于探索的精神" }
      ]
    },
    {
      category: "挑战与竞争适应 (Challenge & Resilience)",
      icon: "⚡",
      tags: ["抗挫力", "不确定性", "压力管理", "脱颖而出"],
      themeColor: "amber",
      phrases: [
        { eng: "deal with uncertainty and psychological pressure", chn: "应对不确定性与心理压力" },
        { eng: "stand out in the fiercely competitive job market", chn: "在竞争激烈的就业市场中脱颖而出" },
        { eng: "enhance professional competence and soft skills", chn: "提高专业素养和综合软实力" },
        { eng: "adapt flexibly to rapidly evolving environments", chn: "灵活适应快速变化的环境" }
      ]
    },
    {
      category: "责任品德与合作 (Responsibility & Cooperation)",
      icon: "🤝",
      tags: ["同理心", "团队协作", "社会责任", "积极正能量"],
      themeColor: "emerald",
      phrases: [
        { eng: "shoulder social responsibilities willingly", chn: "主动承担社会责任" },
        { eng: "foster empathy and effective mutual communication", chn: "培养同理心与高效的人际沟通" },
        { eng: "inject positive momentum into sustainable development", chn: "为社会可持续发展注入正面动力" },
        { eng: "cooperate harmoniously towards shared visions", chn: "朝着共同愿景和谐协作" }
      ]
    }
  ]
};

// 5. 考场急救包与考前20分钟必背10句
export const EMERGENCY_PACK_DATA: EmergencyRescuePack = {
  exampleFallbacks: [
    {
      level: "最推荐 · 适用99%话题",
      eng: "Many ordinary individuals have achieved extraordinary progress through persistence and dedication.",
      chn: "许多普通人通过坚持和奉献取得了非凡成就。"
    },
    {
      level: "适用：教育、梦想、科技、个人成长",
      eng: "Many successful people attribute their achievements to this valuable quality.",
      chn: "很多成功人士将他们的成就归因于这种宝贵的品质。"
    },
    {
      level: "极简保底版（大脑卡壳时）",
      eng: "This can also be widely observed in our daily lives.",
      chn: "这一现象在我们的日常生活中也屡见不鲜。"
    }
  ],
  blankMindGuaranteedFiveSteps: [
    {
      step: "第 1 步 · 填入个人层影响",
      slotTitle: "第一空",
      eng: "it helps individuals realize their potential and pursue a meaningful life",
      chn: "它帮助个人实现潜能并追求有意义的生活。"
    },
    {
      step: "第 2 步 · 填入 not only 补充句",
      slotTitle: "双动词补充",
      eng: "It not only enables individuals to improve themselves, but also equips them with the ability to cope with various challenges.",
      chn: "它不仅使个人能够提升自我，而且赋予他们应对各种挑战的能力。"
    },
    {
      step: "第 3 步 · 填入他人层影响",
      slotTitle: "第二空",
      eng: "it encourages people to influence others in a positive way",
      chn: "它鼓励人们以积极的方式影响他人。"
    },
    {
      step: "第 4 步 · 填入举例落地",
      slotTitle: "万能例子",
      eng: "Many ordinary individuals have achieved extraordinary progress through persistence and dedication.",
      chn: "许多普通人通过坚持和奉献取得了非凡成就。"
    },
    {
      step: "第 5 步 · 填入社会价值",
      slotTitle: "第三空",
      eng: "it contributes to the progress and prosperity of society as a whole",
      chn: "它有助于整个社会的进步与繁荣。"
    }
  ],
  lastTwentyMinutesEssentialTen: [
    { index: 1, eng: "it helps individuals realize their potential and pursue a meaningful life", chn: "它帮助个人实现潜能并追求有意义的生活。" },
    { index: 2, eng: "overcome setbacks and embrace challenges", chn: "克服挫折并迎接挑战。" },
    { index: 3, eng: "deal with uncertainty and pressure", chn: "应对不确定性和压力。" },
    { index: 4, eng: "cultivate perseverance and critical thinking", chn: "培养毅力和批判性思维。" },
    { index: 5, eng: "it encourages people to influence others in a positive way", chn: "它鼓励人们以积极的方式影响他人。" },
    { index: 6, eng: "inspire those around them to strive for excellence", chn: "激励周围的人追求卓越。" },
    { index: 7, eng: "Many ordinary individuals have achieved extraordinary progress through persistence and dedication.", chn: "许多普通人通过坚持和奉献取得了非凡成就。" },
    { index: 8, eng: "Many successful people attribute their achievements to this valuable quality.", chn: "很多成功人士将成就归因于这种品质。" },
    { index: 9, eng: "it contributes to the progress and prosperity of society", chn: "它有助于社会的进步与繁荣。" },
    { index: 10, eng: "Only by doing so can we become a better version of ourselves and embrace a more promising future.", chn: "只有这样，我们才能成为更好的自己，拥抱更有希望的未来。" }
  ]
};

// 6. 翻译预测与八大主题语料库 (整合自 user artifact `code_artifact (9).html`)
export const TRANSLATION_DATA: TranslationFramework = {
  tenUniversalSentencePatterns: [
    {
      id: 1,
      chinesePattern: "随着……的发展 / 随着……的推行",
      englishPattern: "With the development / advancement / implementation of...",
      exampleChn: "随着数字经济的发展，人们的生活方式发生了深刻变革。",
      exampleEng: "With the development of the digital economy, people's lifestyles have undergone profound changes."
    },
    {
      id: 2,
      chinesePattern: "……在……中发挥着至关重要的作用",
      englishPattern: "...play a vital / crucial / significant role in...",
      exampleChn: "教育在推动社会全面进步中发挥着关键作用。",
      exampleEng: "Education plays a crucial role in promoting the overall progress of society."
    },
    {
      id: 3,
      chinesePattern: "被普遍认为是……",
      englishPattern: "be widely regarded / recognized / considered as...",
      exampleChn: "中医被认为是中国传统文化的重要瑰宝。",
      exampleEng: "Traditional Chinese Medicine is widely regarded as a precious treasure of traditional Chinese culture."
    },
    {
      id: 4,
      chinesePattern: "致力于…… / 致力于做某事",
      englishPattern: "be committed / dedicated to (doing) sth.",
      exampleChn: "中国政府致力于推进生态文明建设和绿色低碳转型。",
      exampleEng: "The Chinese government is committed to promoting ecological civilization and green low-carbon transformation."
    },
    {
      id: 5,
      chinesePattern: "不仅……而且……（连接主谓或句子）",
      englishPattern: "not only... but also... (可结合倒装：Not only does ... but it also ...)",
      exampleChn: "高铁不仅缩短了城市之间的距离，而且促进了区域经济协调发展。",
      exampleEng: "High-speed rail not only shortens the distance between cities, but also promotes coordinated regional economic growth."
    },
    {
      id: 6,
      chinesePattern: "使……能够做到……",
      englishPattern: "enable sb. / sth. to do sth.",
      exampleChn: "移动支付技术的普及使人们能够享受更加便捷高效的日常生活。",
      exampleEng: "The popularity of mobile payment technology enables people to enjoy more convenient and efficient daily lives."
    },
    {
      id: 7,
      chinesePattern: "对……产生深远的影响",
      englishPattern: "exert a profound / far-reaching influence / impact on...",
      exampleChn: "人工智能技术的快速突破对现代教育模式产生了深远影响。",
      exampleEng: "Rapid breakthroughs in artificial intelligence exert a profound impact on modern education models."
    },
    {
      id: 8,
      chinesePattern: "有助于…… / 为……做出贡献",
      englishPattern: "contribute to (doing) sth. / facilitate...",
      exampleChn: "传统节日的传承有助于增强中华民族的文化凝聚力和认同感。",
      exampleEng: "Inheriting traditional festivals contributes to enhancing the cultural cohesion and identity of the Chinese nation."
    },
    {
      id: 9,
      chinesePattern: "变得越来越…… / 日益受到欢迎",
      englishPattern: "become increasingly popular / gain growing popularity among...",
      exampleChn: "国潮产品和传统手工艺品日益受到当代年轻消费者的喜爱。",
      exampleEng: "China-chic products and traditional handicrafts have become increasingly popular among contemporary young consumers."
    },
    {
      id: 10,
      chinesePattern: "被广泛应用于……领域",
      englishPattern: "be widely applied / used in the field of...",
      exampleChn: "5G 与大数据技术已被广泛应用于现代智慧医疗与交通管理中。",
      exampleEng: "5G and big data technologies have been widely applied in smart healthcare and modern traffic management."
    }
  ],
  eightCoreThemes: [
    {
      id: "theme-culture",
      themeName: "传统文化与非遗",
      icon: "🏮",
      badgeColor: "rose",
      keywords: [
        { chn: "中国传统文化", eng: "traditional Chinese culture" },
        { chn: "非物质文化遗产", eng: "intangible cultural heritage" },
        { chn: "京剧 / 昆曲", eng: "Beijing / Kunqu Opera" },
        { chn: "书法 / 国画", eng: "Chinese calligraphy / traditional painting" },
        { chn: "中医 / 针灸", eng: "Traditional Chinese Medicine (TCM) / acupuncture" },
        { chn: "茶文化 / 武术", eng: "tea culture / martial arts" },
        { chn: "剪纸 / 陶瓷", eng: "paper-cutting / porcelain" }
      ],
      advancedExpressions: [
        "have a long and illustrious history dating back to... (历史悠久可以追溯到)",
        "be passed down from generation to generation (代代相传)",
        "embody the profound wisdom and aesthetic pursuit of... (体现深邃智慧与审美追求)"
      ]
    },
    {
      id: "theme-festivals",
      themeName: "传统节日与民俗",
      icon: "🧧",
      badgeColor: "orange",
      keywords: [
        { chn: "春节 / 元宵节", eng: "the Spring Festival / the Lantern Festival" },
        { chn: "清明节 / 端午节", eng: "Qingming Festival / Dragon Boat Festival" },
        { chn: "中秋节 / 重阳节", eng: "Mid-Autumn Festival / Double Ninth Festival" },
        { chn: "阖家团圆", eng: "family reunion" },
        { chn: "祭祀祖先", eng: "pay tribute / homage to ancestors" },
        { chn: "赏月 / 赛龙舟", eng: "admire the full moon / dragon boat racing" },
        { chn: "吃粽子 / 挂菖蒲", eng: "eat sticky rice dumplings / hang calamus" }
      ],
      advancedExpressions: [
        "symbolize reunion, harmony and happiness (象征团圆、和谐与幸福)",
        "strengthen family bonds and emotional ties (增进家庭纽带与情感联系)",
        "convey good wishes and hopes for a bountiful harvest (寄托风调雨顺的祈愿)"
      ]
    },
    {
      id: "theme-architecture",
      themeName: "历史名胜与建筑古迹",
      icon: "🏛️",
      badgeColor: "stone",
      keywords: [
        { chn: "长城 / 故宫", eng: "the Great Wall / the Forbidden City" },
        { chn: "秦始皇兵马俑", eng: "the Terracotta Warriors" },
        { chn: "京杭大运河", eng: "the Grand Canal" },
        { chn: "丝绸之路", eng: "the Silk Road" },
        { chn: "世界文化遗产地", eng: "World Cultural Heritage Site" },
        { chn: "古代建筑典范", eng: "a masterpiece of ancient architecture" }
      ],
      advancedExpressions: [
        "witness the rise and prosperity of Chinese civilization (见证中华文明的兴盛)",
        "stand as a testament to the ingenuity of ancient builders (见证古代工匠的智慧)",
        "attract millions of tourists from home and abroad (吸引海内外数百万游客)"
      ]
    },
    {
      id: "theme-technology",
      themeName: "科技创新与数字强国",
      icon: "🚀",
      badgeColor: "purple",
      keywords: [
        { chn: "人工智能 (AI)", eng: "artificial intelligence (AI)" },
        { chn: "大数据 / 云计算", eng: "big data / cloud computing" },
        { chn: "数字经济 / 电子商务", eng: "digital economy / e-commerce" },
        { chn: "高速铁路 (高铁)", eng: "high-speed railway (HSR)" },
        { chn: "新能源汽车", eng: "new energy vehicles (NEVs)" },
        { chn: "移动支付 / 智慧城市", eng: "mobile payment / smart city" },
        { chn: "载人航天 / 月球探测", eng: "manned spaceflight / lunar exploration" }
      ],
      advancedExpressions: [
        "drive sustainable economic growth and industrial upgrading (驱动经济增长与产业升级)",
        "transform traditional industries through technological breakthroughs (以技术突破重塑传统产业)",
        "provide unprecedented convenience for public life (为民众生活提供前所未有的便利)"
      ]
    },
    {
      id: "theme-ecology",
      themeName: "生态保护与绿色低碳",
      icon: "🌱",
      badgeColor: "emerald",
      keywords: [
        { chn: "绿色发展 / 低碳生活", eng: "green development / low-carbon lifestyle" },
        { chn: "生态环境保护", eng: "ecological and environmental conservation" },
        { chn: "绿水青山就是金山银山", eng: "lucid waters and lush mountains are invaluable assets" },
        { chn: "可再生能源 (风电/光伏)", eng: "renewable energy (wind / solar power)" },
        { chn: "碳达峰与碳中和", eng: "carbon peaking and carbon neutrality (dual carbon goals)" },
        { chn: "垃圾分类与资源循环", eng: "waste sorting and resource recycling" }
      ],
      advancedExpressions: [
        "strike a balance between economic progress and environmental stewardship (在发展与环保间求得平衡)",
        "minimize the ecological footprint of urban areas (最大限度减少城市生态足迹)",
        "build a beautiful China where human and nature coexist harmoniously (建设人与自然和谐共生的美丽中国)"
      ]
    },
    {
      id: "theme-rural",
      themeName: "乡村振兴与共同富裕",
      icon: "🌾",
      badgeColor: "amber",
      keywords: [
        { chn: "乡村振兴战略", eng: "rural revitalization strategy" },
        { chn: "精准脱贫", eng: "targeted poverty alleviation" },
        { chn: "共同富裕", eng: "common prosperity" },
        { chn: "农村基础设施建设", eng: "rural infrastructure construction" },
        { chn: "特色农业与乡村旅游", eng: "specialized agriculture and rural tourism" },
        { chn: "提高农民人均收入", eng: "increase the per capita income of farmers" }
      ],
      advancedExpressions: [
        "narrow the development gap between urban and rural areas (缩小城乡发展差距)",
        "unleash the immense consumption potential of rural markets (释放农村市场的巨大消费潜力)",
        "create favorable conditions for rural entrepreneurship (为乡村创业创造有利条件)"
      ]
    },
    {
      id: "theme-education",
      themeName: "教育现代化与青年人才",
      icon: "🎓",
      badgeColor: "blue",
      keywords: [
        { chn: "素质教育", eng: "quality-oriented education" },
        { chn: "终身学习理念", eng: "concept of lifelong learning" },
        { chn: "拔尖创新人才培养", eng: "cultivation of top-tier innovative talents" },
        { chn: "职业教育与技能培训", eng: "vocational education and skills training" },
        { chn: "促进教育公平", eng: "promote educational equity and equality" },
        { chn: "青年一代的时代使命", eng: "the historical mission of the younger generation" }
      ],
      advancedExpressions: [
        "empower students with forward-looking visions and practical skills (赋予学生前瞻视野与实践能力)",
        "nurture a creative mindset adaptable to future uncertainties (孕育适应未来不确定性的创新思维)",
        "shoulder the responsibility of national rejuvenation (勇敢肩负起民族复兴的历史重任)"
      ]
    },
    {
      id: "theme-tourism",
      themeName: "文化文旅与城市形象",
      icon: "🌉",
      badgeColor: "indigo",
      keywords: [
        { chn: "文旅融合发展", eng: "integrated development of culture and tourism" },
        { chn: "著名历史文化名城", eng: "renowned historical and cultural city" },
        { chn: "独特的自然风光", eng: "unique natural landscape and scenery" },
        { chn: "促进文明互鉴与交流", eng: "promote mutual learning and cultural exchanges" },
        { chn: "展示现代城市活力与魅力", eng: "showcase the vitality and charm of modern cities" }
      ],
      advancedExpressions: [
        "offer tourists immersive and unforgettable cultural experiences (为游客提供沉浸式难忘体验)",
        "serve as an important bridge for international dialogue (作为国际文明对话的重要桥梁)",
        "boost local employment and stimulate the service industry (带动地方就业并刺激服务业发展)"
      ]
    }
  ],
  advancedVocabularyReplacements: [
    {
      originalWord: "important",
      meaning: "重要的",
      upgradedWords: "vital, crucial, indispensable, essential, pivotal",
      exampleUsage: "play a pivotal role in promoting social harmony"
    },
    {
      originalWord: "help",
      meaning: "帮助，促进",
      upgradedWords: "enable, facilitate, foster, promote, cultivate",
      exampleUsage: "facilitate deep mutual understanding between different civilizations"
    },
    {
      originalWord: "make / do",
      meaning: "提高，增强",
      upgradedWords: "enhance, elevate, boost, sharpen, strengthen",
      exampleUsage: "enhance the core competence of young professionals"
    },
    {
      originalWord: "show",
      meaning: "表明，展示",
      upgradedWords: "demonstrate, showcase, manifest, reflect, illustrate",
      exampleUsage: "showcase China's remarkable technological achievements"
    },
    {
      originalWord: "give",
      meaning: "提供，赋予",
      upgradedWords: "equip...with, endow...with, furnish, provide",
      exampleUsage: "endow young graduates with strong resilience and problem-solving abilities"
    }
  ]
};

// 7. 考场应急保底锦囊 (贴地气、好背诵、卡壳急救)
export const EMERGENCY_RESCUE_PACK: EmergencyRescuePack = {
  exampleFallbacks: [
    {
      level: "入门级：自身经历法（好记不忘、容易上手）",
      eng: "Take my own college life as a vivid case. When I first encountered academic difficulties, it was persistent practice that enabled me to overcome frustration and build self-confidence.",
      chn: "拿我自己的大学生活来说。刚开始遇到学业困难时，正是坚持不懈的练习帮助我战胜了挫败感并建立了自信。（适用于意志品质、学习方法、坚持、挑战等话题）"
    },
    {
      level: "进阶级：日常科技与生活习惯（自然贴切、有话可说）",
      eng: "A notable illustration can be found in our everyday routines. With the widespread popularity of mobile applications and digital platforms, individuals are able to acquire knowledge more efficiently than ever before.",
      chn: "日常生活中就能找到生动的例子。随着手机应用和数字化平台的普及，人们能够比以往任何时候都更高效地获取知识。（适用于科技创新、数字生活、时间管理、信息获取等话题）"
    },
    {
      level: "稳妥级：援引调查研究与社会现象（客观规范、给分更稳）",
      eng: "Recent surveys conducted by educational institutions have revealed that an overwhelming majority of undergraduates consider hands-on experience just as crucial as theoretical knowledge.",
      chn: "教育机构近期的调查显示，绝大多数本科生认为动手实践经验与理论知识同样重要。（适用于实践能力、实习就业、大学教育、全面发展等话题）"
    }
  ],
  blankMindGuaranteedFiveSteps: [
    {
      step: "第 1 步：引出热点现象",
      slotTitle: "点明主题，说明当前引起大家关注",
      eng: "In recent years, the issue regarding [填入主题词汇，如 digital literacy / artificial intelligence / mental health] has aroused extensive public concern across the nation.",
      chn: "近年来，关于……的问题在全国范围内引起了广泛的社会关注。"
    },
    {
      step: "第 2 步：亮出鲜明观点",
      slotTitle: "给出自我立场，不模棱两可",
      eng: "From my own perspective, although it brings certain inevitable challenges, its positive influence on our personal growth far outweighs the potential downsides.",
      chn: "在我看来，尽管它带来了一些不可避免的挑战，但它对我们个人成长的积极影响远远超过了潜在弊端。"
    },
    {
      step: "第 3 步：剖析根本原因",
      slotTitle: "主干论述，支撑观点",
      eng: "Primary among the driving forces behind this trend is that it equips young individuals with practical competence, thereby broadening their horizons in a competitive society.",
      chn: "促成这一趋势的核心原因在于，它赋予了青年人实用能力，从而在竞争激烈的社会中拓宽了他们的视野。"
    },
    {
      step: "第 4 步：联系实际生活",
      slotTitle: "结合身边现实，避免空洞说教",
      eng: "Furthermore, this development exerts a profound and lasting impact on our daily life, encouraging students to actively step out of their comfort zones.",
      chn: "此外，这一发展对我们的日常生活产生了深远持久的影响，鼓励学生积极走出自己的舒适圈。"
    },
    {
      step: "第 5 步：收尾总结呼吁",
      slotTitle: "用规范句式总结展望，考场稳妥拿分",
      eng: "Taking all these aspects into account, only when we embrace new changes with a rational mindset can we create a promising and fulfilling future.",
      chn: "综合考虑上述各个方面，只有当我们以理性的心态拥抱新变化时，才能创造一个充满希望、充实丰盈的未来。"
    }
  ],
  lastTwentyMinutesEssentialTen: [
    {
      index: 1,
      eng: "With the rapid advancement of modern society, tremendous changes have taken place in people's lifestyles.",
      chn: "随着现代社会的快速进步，人们的生活方式发生了巨大的变化。（万能首句，适合各类社会/科技/生活变化类作文）"
    },
    {
      index: 2,
      eng: "It is universally acknowledged that persistent effort plays an indispensable role in achieving personal goals.",
      chn: "大家公认的是，坚持不懈的努力在实现个人目标中起着不可或缺的作用。（万能肯定句，主语和宾语可随意替换）"
    },
    {
      index: 3,
      eng: "There is no denying that innovative thinking exerts a profound and lasting influence on youth development.",
      chn: "不可否认的是，创新思维对青年成长有着深远而持久的影响。（客观强调句型，比 think / believe 更规范）"
    },
    {
      index: 4,
      eng: "Only when we fully realize the significance of time management can we allocate our energy effectively.",
      chn: "只有当我们充分意识到时间管理的重要性时，我们才能有效地分配精力。（Only+时间状语从句引起的倒装句，语法加分项）"
    },
    {
      index: 5,
      eng: "Under no circumstances should we ignore the importance of mental health during tough challenges.",
      chn: "在任何情况下，我们在面对艰难挑战时都不应忽视心理健康的重要性。（否定词放句首的部分倒装，考场点睛之笔）"
    },
    {
      index: 6,
      eng: "Instead of passively complaining about obstacles, contemporary college students ought to actively explore solutions.",
      chn: "与其消极抱怨障碍，当代大学生更应当积极探寻解决之道。（对比句式，展示积极向上的思想境界）"
    },
    {
      index: 7,
      eng: "It is high time that both colleges and students attached greater importance to practical capabilities.",
      chn: "大学和学生双方是时候更加重视实践能力了。（It is high time that + 过去式，标准虚拟语气句型）"
    },
    {
      index: 8,
      eng: "Compared with traditional approaches, modern educational tools endow learners with unprecedented convenience.",
      chn: "与传统方法相比，现代教育工具赋予了学习者前所未有的便利。（分词短语作状语+endow...with高级搭配）"
    },
    {
      index: 9,
      eng: "Not only does volunteer work cultivate a sense of responsibility, but it also enriches our social experience.",
      chn: "志愿服务不仅培养了责任感，而且丰富了我们的社会阅历。（Not only置于句首的经典倒装句，考官非常喜欢看）"
    },
    {
      index: 10,
      eng: "Taking all the factors into consideration, we can safely arrive at the conclusion that self-discipline leads to true freedom.",
      chn: "综合考虑所有因素，我们可以稳妥地得出结论：自律通往真正的自由。（万能收尾总结句，结尾段直接默写）"
    }
  ]
};
