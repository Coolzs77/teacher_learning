/**
 * 琪琪专属 · 英语六级真题突破实战训练数据库
 * 专门配合：
 * 1. 选词填空四步法（词性快判、槽位预判、单空秒杀、整篇演练）
 * 2. 汉译英台阶演练工坊（主谓宾拆解、核心词汇提示、句型匹配、自测对比）
 * 3. 六级真题重难语法实景突击（非谓语动词、从句、倒装句、虚拟语气）
 * 4. 错题本归因与攻坚
 */

// ================= 1. 选词填空实战训练数据 =================

export interface PosDrillWord {
  id: string;
  word: string;
  correctPos: 'N' | 'V' | 'Adj' | 'Adv';
  posLabel: string;
  suffix: string;
  meaning: string;
  ruleExplanation: string;
}

export interface SlotDrillQuestion {
  id: string;
  sentenceBefore: string;
  blankPlaceholder: string;
  sentenceAfter: string;
  correctPos: 'N' | 'V' | 'Adj' | 'Adv';
  posLabel: string;
  grammarClue: string;
  reason: string;
}

export interface SingleBlankDrill {
  id: string;
  sentence: string; // 包含 [___]
  targetPos: 'N' | 'V' | 'Adj' | 'Adv';
  targetPosLabel: string;
  options: { letter: string; word: string; pos: 'N' | 'V' | 'Adj' | 'Adv'; meaning: string }[];
  correctLetter: string;
  step1SlotAnalysis: string;
  step2Elimination: string;
  step3ContextCheck: string;
}

export interface FullClozeExam {
  id: string;
  title: string;
  source: string;
  instruction: string;
  quickPickupTip: string; // 哪些空是 4 分钟必拿分的
  passageTokens: { text: string; isBlank?: boolean; blankIndex?: number; correctLetter?: string }[];
  options: { letter: string; word: string; pos: string; meaning: string }[];
  blankExplanations: Record<number, {
    correctLetter: string;
    word: string;
    pos: string;
    difficulty: '送分题 (必做)' | '中等题' | '难题 (建议果断蒙)';
    analysis: string;
  }>;
}

// 词性速判词汇库 (覆盖六级高频考点词缀)
export const POS_DRILL_WORDS: PosDrillWord[] = [
  {
    id: "pw-1",
    word: "vulnerable",
    correctPos: "Adj",
    posLabel: "形容词 (Adjective)",
    suffix: "-able / -ible (可...的，易受...的)",
    meaning: "脆弱的，易受伤害的",
    ruleExplanation: "以 -able 结尾通常为形容词。六级常考搭配：be vulnerable to (易受...影响/伤害)。"
  },
  {
    id: "pw-2",
    word: "subsidize",
    correctPos: "V",
    posLabel: "动词 (Verb)",
    suffix: "-ize / -ise (使...化，给...资助)",
    meaning: "资助，补贴",
    ruleExplanation: "以 -ize 结尾绝大多数为动词。常考：subsidize renewable energy (补贴可再生能源)。"
  },
  {
    id: "pw-3",
    word: "deterioration",
    correctPos: "N",
    posLabel: "名词 (Noun)",
    suffix: "-tion / -sion (动作或状态名词)",
    meaning: "恶化，变坏",
    ruleExplanation: "以 -tion 结尾必为名词。常作主语或介词宾语，如 the deterioration of the environment。"
  },
  {
    id: "pw-4",
    word: "spontaneously",
    correctPos: "Adv",
    posLabel: "副词 (Adverb)",
    suffix: "-ly (绝大多数由形容词加ly构成的副词)",
    meaning: "自发地，自然而然地",
    ruleExplanation: "形容词 spontaneous + ly 构成副词，在句中通常修饰动词或整句。"
  },
  {
    id: "pw-5",
    word: "reconciliation",
    correctPos: "N",
    posLabel: "名词 (Noun)",
    suffix: "-tion (名词后缀)",
    meaning: "和解，调和",
    ruleExplanation: "名词后缀 -tion，由动词 reconcile 衍生而来。"
  },
  {
    id: "pw-6",
    word: "perpetual",
    correctPos: "Adj",
    posLabel: "形容词 (Adjective)",
    suffix: "-al (形容词后缀)",
    meaning: "长期的，永久的",
    ruleExplanation: "-al 既可作名词也可作形容词，在六级中 perpetual 修饰名词如 perpetual struggle。"
  },
  {
    id: "pw-7",
    word: "allocate",
    correctPos: "V",
    posLabel: "动词 (Verb)",
    suffix: "-ate (通常为动词后缀)",
    meaning: "分配，配给",
    ruleExplanation: "-ate 为典型动词后缀。常考搭配：allocate resources to... (向...分配资源)。"
  },
  {
    id: "pw-8",
    word: "drastically",
    correctPos: "Adv",
    posLabel: "副词 (Adverb)",
    suffix: "-ly (副词后缀)",
    meaning: "剧烈地，彻底地",
    ruleExplanation: "修饰动词 increase, reduce, drop 等表示变化幅度的六级高频副词。"
  },
  {
    id: "pw-9",
    word: "prevalent",
    correctPos: "Adj",
    posLabel: "形容词 (Adjective)",
    suffix: "-ent / -ant (形容词后缀)",
    meaning: "流行的，普遍存在的",
    ruleExplanation: "-ent 结尾通常为形容词。常考：be prevalent among young people。"
  },
  {
    id: "pw-10",
    word: "manifest",
    correctPos: "V",
    posLabel: "动词 (Verb)",
    suffix: "动词词根 (也可作形容词)",
    meaning: "显现，表明",
    ruleExplanation: "在六级选词填空中，常作为及物动词考察：manifest itself in... (在...中显现出来)。"
  }
];

// 槽位语法预判题库
export const SLOT_DRILL_QUESTIONS: SlotDrillQuestion[] = [
  {
    id: "sd-1",
    sentenceBefore: "The government has recently implemented strict policies to",
    blankPlaceholder: "[ 1 ]",
    sentenceAfter: "carbon emissions in heavy industries.",
    correctPos: "V",
    posLabel: "动词原形 (Verb Base)",
    grammarClue: "不定式符号 to + 动词原形 + 宾语 (carbon emissions)",
    reason: "空前是不定式标志 to，空后是名词短语 carbon emissions（作宾语），此处必定需要一个及物动词原形！"
  },
  {
    id: "sd-2",
    sentenceBefore: "There is a growing",
    blankPlaceholder: "[ 2 ]",
    sentenceAfter: "among educators that hands-on skills should be given equal weight.",
    correctPos: "N",
    posLabel: "单数名词 (Noun Singular)",
    grammarClue: "不定冠词 a + 形容词 growing + [单数名词] + 介词短语",
    reason: "冠词 a 修饰后面的名词，growing 为形容词修饰语，因此空格内必须是单数可数名词或不可数名词！"
  },
  {
    id: "sd-3",
    sentenceBefore: "Technological innovation has made remote communication significantly more",
    blankPlaceholder: "[ 3 ]",
    sentenceAfter: "for global teams.",
    correctPos: "Adj",
    posLabel: "形容词 (Adjective)",
    grammarClue: "make + 宾语 (remote communication) + 比较级 (more + [形容词])",
    reason: "make sth + adj 为极高频结构，more + adj 构成宾语补足语，空格处必须填入形容词原级！"
  },
  {
    id: "sd-4",
    sentenceBefore: "The young researcher",
    blankPlaceholder: "[ 4 ]",
    sentenceAfter: "verified the experimental data before publishing the paper.",
    correctPos: "Adv",
    posLabel: "副词 (Adverb)",
    grammarClue: "主语 (The researcher) + [副词] + 谓语动词 (verified)",
    reason: "主谓之间修饰动词 verified，语法槽位只能是副词 (Adv)！"
  },
  {
    id: "sd-5",
    sentenceBefore: "Without financial subsidies, the small enterprise is highly",
    blankPlaceholder: "[ 5 ]",
    sentenceAfter: "to market volatility.",
    correctPos: "Adj",
    posLabel: "形容词 (Adjective)",
    grammarClue: "系动词 is + 副词 highly + [形容词] + 介词 to",
    reason: "系动词 is 后面需要形容词作表语，搭配 be ... to，此处必填形容词！"
  }
];

// 单空秒杀演练库
export const SINGLE_BLANK_DRILLS: SingleBlankDrill[] = [
  {
    id: "sbd-1",
    sentence: "Experts suggest that universities should allocate more resources to cultivate students' [___] thinking rather than rote learning.",
    targetPos: "Adj",
    targetPosLabel: "形容词 (修饰名词 thinking)",
    options: [
      { letter: "A", word: "critical", pos: "Adj", meaning: "批判性的，关键的" },
      { letter: "B", word: "criticize", pos: "V", meaning: "批评，指责" },
      { letter: "C", word: "critically", pos: "Adv", meaning: "批判性地" },
      { letter: "D", word: "criticism", pos: "N", meaning: "批评，评论" }
    ],
    correctLetter: "A",
    step1SlotAnalysis: "空格位于名词所有格 students' 与名词 thinking 之间，起定语修饰作用，必须填入【形容词】。",
    step2Elimination: "扫视选项：B 是动词(-ize)，C 是副词(-ly)，D 是名词(-ism)，只有 A (critical) 是形容词！直接排除 B/C/D！",
    step3ContextCheck: "代入 critical thinking（批判性思维），与后文的 rote learning（死记硬背）形成完美对仗，15秒拿下！"
  },
  {
    id: "sbd-2",
    sentence: "Facing fierce international competition, domestic brands must [___] their research investments to stay ahead.",
    targetPos: "V",
    targetPosLabel: "动词原形 (情态动词 must 之后)",
    options: [
      { letter: "A", word: "substantially", pos: "Adv", meaning: "大幅度地" },
      { letter: "B", word: "accelerate", pos: "V", meaning: "加速，加大" },
      { letter: "C", word: "acceleration", pos: "N", meaning: "加速" },
      { letter: "D", word: "accessible", pos: "Adj", meaning: "可进入的" }
    ],
    correctLetter: "B",
    step1SlotAnalysis: "空格前是情态动词 must，空后是宾语 their research investments，必须填入【及物动词原形】。",
    step2Elimination: "选项中 A 是副词，C 是名词，D 是形容词，唯一的动词原形就是 B (accelerate)！",
    step3ContextCheck: "accelerate investments 意为“加大/加速投资”，搭配完全通顺，20秒锁定！"
  },
  {
    id: "sbd-3",
    sentence: "The newly built community library provides a quiet and [___] environment for neighborhood residents.",
    targetPos: "Adj",
    targetPosLabel: "形容词 (and 连接同等成分: quiet and ___)",
    options: [
      { letter: "A", word: "comfortable", pos: "Adj", meaning: "舒适的" },
      { letter: "B", word: "comfort", pos: "N", meaning: "安慰，舒适" },
      { letter: "C", word: "comfortably", pos: "Adv", meaning: "舒适地" },
      { letter: "D", word: "conform", pos: "V", meaning: "遵从，符合" }
    ],
    correctLetter: "A",
    step1SlotAnalysis: "并列连词 and 前面是形容词 quiet，后面修饰名词 environment，所以空格必须同样是【形容词】。",
    step2Elimination: "选项 A 是形容词(-able)，B 为名/动词，C 为副词(-ly)，D 为动词。立即锁定 A！",
    step3ContextCheck: "a quiet and comfortable environment 意思为“安静舒适的环境”，句意毫无瑕疵！"
  }
];

// 整篇真题演练（真实六级难度 · 标注4道送分题）
export const FULL_CLOZE_EXAM: FullClozeExam = {
  id: "full-cloze-2026",
  title: "2026年真题同源演练：人工智能与未来工作模式重塑",
  source: "大学英语六级 Section A Banked Cloze 精选真题",
  instruction: "选词填空共 10 空，每题 3.55 分。琪琪考场战术：先标词性，抓取标有【送分题】的 3~4 题，用时严格控制在 4 分钟以内！",
  quickPickupTip: "第 26 题（系表结构）、第 28 题（情态动词后动词原形）、第 31 题（修饰动词的副词）、第 33 题（名词所有格后名词）是四大绝对送分题，必须稳稳拿分！",
  passageTokens: [
    { text: "As artificial intelligence continues to reshape industries worldwide, workplace dynamics have become increasingly " },
    { text: "[ 26 ]", isBlank: true, blankIndex: 26, correctLetter: "B" },
    { text: ". Traditional job roles are undergoing profound changes, forcing workers to " },
    { text: "[ 27 ]", isBlank: true, blankIndex: 27, correctLetter: "G" },
    { text: " their existing skill sets. Experts note that automated tools can readily " },
    { text: "[ 28 ]", isBlank: true, blankIndex: 28, correctLetter: "E" },
    { text: " repetitive tasks, but human traits such as creativity and empathy remain " },
    { text: "[ 29 ]", isBlank: true, blankIndex: 29, correctLetter: "M" },
    { text: ". Consequently, organizations must create a more " },
    { text: "[ 30 ]", isBlank: true, blankIndex: 30, correctLetter: "A" },
    { text: " learning atmosphere. Employees who " },
    { text: "[ 31 ]", isBlank: true, blankIndex: 31, correctLetter: "H" },
    { text: " embrace lifelong learning will maintain their competitive edge. However, the psychological " },
    { text: "[ 32 ]", isBlank: true, blankIndex: 32, correctLetter: "J" },
    { text: " of constant technological disruption cannot be overlooked. Company leaders should accurately evaluate each employee's " },
    { text: "[ 33 ]", isBlank: true, blankIndex: 33, correctLetter: "K" },
    { text: " and provide targeted training programs. Only by fostering collaborative environments can businesses " },
    { text: "[ 34 ]", isBlank: true, blankIndex: 34, correctLetter: "N" },
    { text: " both productivity and employee well-being, paving a " },
    { text: "[ 35 ]", isBlank: true, blankIndex: 35, correctLetter: "D" },
    { text: " way for sustainable development." }
  ],
  options: [
    { letter: "A", word: "flexible", pos: "Adj", meaning: "灵活的，有弹性的" },
    { letter: "B", word: "complex", pos: "Adj", meaning: "复杂的" },
    { letter: "C", word: "spontaneously", pos: "Adv", meaning: "自发地" },
    { letter: "D", word: "smooth", pos: "Adj", meaning: "平稳的，顺利的" },
    { letter: "E", word: "execute", pos: "V", meaning: "执行，实施" },
    { letter: "F", word: "hesitate", pos: "V", meaning: "犹豫" },
    { letter: "G", word: "upgrade", pos: "V", meaning: "升级，提升" },
    { letter: "H", word: "proactively", pos: "Adv", meaning: "积极主动地" },
    { letter: "I", word: "deterioration", pos: "N", meaning: "恶化" },
    { letter: "J", word: "impact", pos: "N", meaning: "影响，冲击" },
    { letter: "K", word: "competence", pos: "N", meaning: "能力，胜任力" },
    { letter: "L", word: "vulnerable", pos: "Adj", meaning: "脆弱的" },
    { letter: "M", word: "irreplaceable", pos: "Adj", meaning: "不可替代的" },
    { letter: "N", word: "sustain", pos: "V", meaning: "维持，保持" },
    { letter: "O", word: "drastically", pos: "Adv", meaning: "剧烈地" }
  ],
  blankExplanations: {
    26: {
      correctLetter: "B",
      word: "complex",
      pos: "Adj",
      difficulty: "送分题 (必做)",
      analysis: "【送分破局】空前为 have become increasingly（系动词+副词），空后句号，必定缺少形容词表语。可选 Adj: flexible, complex, smooth, vulnerable, irreplaceable。结合上下文‘传统角色发生深刻变化’，说明职场变得更加‘复杂’(complex)。"
    },
    27: {
      correctLetter: "G",
      word: "upgrade",
      pos: "V",
      difficulty: "中等题",
      analysis: "空前为 force sb. to，需要及物动词原形。空后为其现有技能 (skill sets)，搭配升级技能选 upgrade。"
    },
    28: {
      correctLetter: "E",
      word: "execute",
      pos: "V",
      difficulty: "送分题 (必做)",
      analysis: "【送分破局】情态动词 can + 副词 readily + [动词原形] + 宾语 repetitive tasks。执行重复性任务，搭配 execute tasks 极其经典，秒选 E。"
    },
    29: {
      correctLetter: "M",
      word: "irreplaceable",
      pos: "Adj",
      difficulty: "中等题",
      analysis: "空前为系动词 remain，空后句号，需要形容词。前文提到机器做重复工作，人类的创造力与同理心仍然‘不可替代’(irreplaceable)。"
    },
    30: {
      correctLetter: "A",
      word: "flexible",
      pos: "Adj",
      difficulty: "中等题",
      analysis: "a more [Adj] learning atmosphere，修饰名词 atmosphere，灵活的学习氛围选 flexible。"
    },
    31: {
      correctLetter: "H",
      word: "proactively",
      pos: "Adv",
      difficulty: "送分题 (必做)",
      analysis: "【送分破局】定语从句 who [Adv] embrace...，修饰动词 embrace，需要副词。选项中只有 proactively 和 drastically 等，主动拥抱终身学习，秒选 H (proactively)！"
    },
    32: {
      correctLetter: "J",
      word: "impact",
      pos: "N",
      difficulty: "中等题",
      analysis: "定冠词 the + 形容词 psychological + [名词] + 介词 of，心理层面的冲击与影响选 impact。"
    },
    33: {
      correctLetter: "K",
      word: "competence",
      pos: "N",
      difficulty: "送分题 (必做)",
      analysis: "【送分破局】名词所有格 each employee's [名词] 作 evaluate 的宾语。评估员工的‘能力’(competence)，词尾 -ence 为典型名词标志，必拿分题！"
    },
    34: {
      correctLetter: "N",
      word: "sustain",
      pos: "V",
      difficulty: "中等题",
      analysis: "情态动词 can 后接动词原形 sustain both productivity and well-being，维持生产力和幸福感。"
    },
    35: {
      correctLetter: "D",
      word: "smooth",
      pos: "Adj",
      difficulty: "中等题",
      analysis: "paving a [Adj] way for...，为...铺平道路，修饰名词 way 选 smooth (平坦/顺畅的)。"
    }
  }
};


// ================= 2. 汉译英台阶演练工坊数据 =================

export interface SteppingSentence {
  id: string;
  chinese: string;
  mainSubject: string;
  mainPredicate: string;
  mainObject: string;
  modifiersInfo: string;
  keyVocabList: { chn: string; eng: string }[];
  patternId: number;
  patternTitle: string;
  standardTranslation: string;
  pitfallWarning: string;
}

export interface TranslationTopicStepping {
  id: string;
  themeTitle: string;
  icon: string;
  background: string;
  sentences: SteppingSentence[];
}

export const TRANSLATION_STEPPING_DATA: TranslationTopicStepping[] = [
  {
    id: "ts-railway",
    themeTitle: "中国高铁与现代交通网络 (2025/2026同源真题)",
    icon: "🚄",
    background: "六级最常考的当代科技与国家发展主题，考查大跨度主干提炼与伴随状语。",
    sentences: [
      {
        id: "ts-r-1",
        chinese: "随着中国高速铁路网络的迅速扩张，人们的出行方式发生了深刻变化。",
        mainSubject: "人们的出行方式 (people's travel patterns)",
        mainPredicate: "发生了 (have undergone / have experienced)",
        mainObject: "深刻变化 (profound changes)",
        modifiersInfo: "时间/伴随状语：随着...迅速扩张 (With the rapid expansion of...)",
        keyVocabList: [
          { chn: "高速铁路网络", eng: "high-speed railway network" },
          { chn: "迅速扩张", eng: "rapid expansion" },
          { chn: "出行方式", eng: "travel patterns / way of traveling" },
          { chn: "发生深刻变化", eng: "undergo profound changes" }
        ],
        patternId: 1,
        patternTitle: "With the development/expansion of..., ...undergo profound changes",
        standardTranslation: "With the rapid expansion of China's high-speed railway network, people's travel patterns have undergone profound changes.",
        pitfallWarning: "千万不要写成 ‘Along with China high train become fast...’。记住用 With + 名词短语作状语，谓语动词用 undergo 或 change profoundly。"
      },
      {
        id: "ts-r-2",
        chinese: "高铁不仅极大地缩短了城市之间的旅行时间，而且有力地促进了沿线区域经济的发展。",
        mainSubject: "高铁 (High-speed rail)",
        mainPredicate: "不仅缩短...而且促进... (not only shortens... but also promotes...)",
        mainObject: "旅行时间与区域经济 (travel time & regional economic development)",
        modifiersInfo: "状语：极大地 (greatly/substantially)、有力地 (vigorously/effectively)、沿线 (along the routes)",
        keyVocabList: [
          { chn: "缩短旅行时间", eng: "shorten travel time" },
          { chn: "促进经济发展", eng: "promote / foster economic development" },
          { chn: "沿线区域", eng: "regions along the railway routes" }
        ],
        patternId: 5,
        patternTitle: "not only... but also... 复合句型",
        standardTranslation: "High-speed rail not only greatly shortens travel time between cities, but also vigorously promotes the economic development of regions along the routes.",
        pitfallWarning: "注意 not only ... but also 连接两个并列谓语动词 shortens 和 promotes，单复数要与主语 High-speed rail 保持一致。"
      }
    ]
  },
  {
    id: "ts-taichi",
    themeTitle: "太极拳与传统哲学养生 (非物质文化遗产精选)",
    icon: "☯️",
    background: "六级传统文化必考高频题材，重点考查被动语态、起源追溯与精神内涵表达。",
    sentences: [
      {
        id: "ts-t-1",
        chinese: "太极拳作为中国传统武术的瑰宝，已被列入联合国教科文组织非物质文化遗产名录。",
        mainSubject: "太极拳 (Tai Chi)",
        mainPredicate: "已被列入 (has been inscribed / included on)",
        mainObject: "非物质文化遗产名录 (the Intangible Cultural Heritage List)",
        modifiersInfo: "同位语/介词短语：作为中国传统武术的瑰宝 (as a treasure of traditional Chinese martial arts)",
        keyVocabList: [
          { chn: "传统武术瑰宝", eng: "a treasure of traditional Chinese martial arts" },
          { chn: "被列入", eng: "be inscribed on / be listed as" },
          { chn: "联合国教科文组织", eng: "UNESCO" },
          { chn: "非物质文化遗产", eng: "intangible cultural heritage" }
        ],
        patternId: 3,
        patternTitle: "be widely recognized / inscribed as... 权威认证句型",
        standardTranslation: "As a treasure of traditional Chinese martial arts, Tai Chi has been inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity.",
        pitfallWarning: "‘被列入名录’注意要用现在完成时被动语态 has been inscribed on 或 has been included on。"
      },
      {
        id: "ts-t-2",
        chinese: "它体现了人与自然和谐共生的古老智慧，在世界各地受到越来越多人的喜爱。",
        mainSubject: "它 (It)",
        mainPredicate: "体现了...且受到喜爱 (embodies... and becomes popular)",
        mainObject: "古老智慧 (ancient wisdom)",
        modifiersInfo: "修饰语：人与自然和谐共生 (the harmonious coexistence between human and nature)；在世界各地 (around the world)",
        keyVocabList: [
          { chn: "体现深邃智慧", eng: "embody ancient wisdom" },
          { chn: "和谐共生", eng: "harmonious coexistence" },
          { chn: "受到越来越多人喜爱", eng: "become increasingly popular among..." }
        ],
        patternId: 9,
        patternTitle: "become increasingly popular among... 普及句型",
        standardTranslation: "It embodies the ancient wisdom of harmonious coexistence between humanity and nature, and has become increasingly popular among people worldwide.",
        pitfallWarning: "‘和谐共生’写成 harmonious coexistence 即可拿满分，‘越来越受欢迎’优先用 become increasingly popular among。"
      }
    ]
  }
];


// ================= 3. 六级真题重难高频语法实战突击 =================

export interface Cet6GrammarQuestion {
  id: string;
  category: '非谓语动词' | '定语从句' | '虚拟语气与状语从句' | '倒装与强调句';
  sentencePrompt: string; // 题目句子（带空格）
  options: { label: string; text: string }[];
  correctAnswer: string;
  examClue: string;
  analysis: string;
  wrongDistractorWhy: string;
}

export const CET6_GRAMMAR_QUESTIONS: Cet6GrammarQuestion[] = [
  {
    id: "gq-1",
    category: "非谓语动词",
    sentencePrompt: "______ in the laboratory for several months, the new vaccine proved to be remarkably effective against the virus.",
    options: [
      { label: "A", text: "Having tested" },
      { label: "B", text: "Having been tested" },
      { label: "C", text: "Testing" },
      { label: "D", text: "To test" }
    ],
    correctAnswer: "B",
    examClue: "主语是 the new vaccine（疫苗），与动词 test 是被动关系，且‘被测试数月’发生在主句谓语 proved 之前，必须用完成被动分词！",
    analysis: "分词短语作状语时，其逻辑主语就是主句的主语。疫苗不能自己测试自己，必须是被测试（被动）；同时几个月的测试发生在证明有效之前（完成时），故选 Having been tested。",
    wrongDistractorWhy: "A 缺少 been 是主动完成式；C 是主动进行式；D 是不定式表目的，均逻辑不符。"
  },
  {
    id: "gq-2",
    category: "定语从句",
    sentencePrompt: "The historic town retains many ancient dwellings, ______ date back to the Ming and Qing dynasties.",
    options: [
      { label: "A", text: "most of them" },
      { label: "B", text: "most of which" },
      { label: "C", text: "that" },
      { label: "D", text: "where" }
    ],
    correctAnswer: "B",
    examClue: "逗号后没有连词 (and/but)，两句话不能仅用代词 them 连接，必须用定语从句关系代词 which 连接！",
    analysis: "非限制性定语从句修饰先行词 ancient dwellings（古民居），介词 of 后面指物只能用 which，构成 ‘most of which’ 作为从句主语。",
    wrongDistractorWhy: "A 选项 most of them 会造成两个独立句子无连词连接的逗号连接错误（Comma Splice）；C 选项 that 不能引导非限制性定语从句；D 选项 where 是副词不能作主语。"
  },
  {
    id: "gq-3",
    category: "倒装与强调句",
    sentencePrompt: "Only when we respect ecological laws and protect biodiversity ______ achieve sustainable economic development.",
    options: [
      { label: "A", text: "we can" },
      { label: "B", text: "can we" },
      { label: "C", text: "we should" },
      { label: "D", text: "did we" }
    ],
    correctAnswer: "B",
    examClue: "‘Only + 状语从句’ 位于句首时，主句必须采用部分倒装（助动词/情态动词置于主语之前）！",
    analysis: "六级作文和阅读极高频的经典倒装结构：Only when... can we do sth.，用来表达‘只有……才能……’，将情态动词 can 提到主语 we 之前。",
    wrongDistractorWhy: "A 和 C 都没有倒装；D 时态为过去时 did 与前面的一般现在时 respect 不符。"
  },
  {
    id: "gq-4",
    category: "虚拟语气与状语从句",
    sentencePrompt: "______ for the timely warning issued by the meteorological station, the coastal city would have suffered catastrophic losses in the typhoon.",
    options: [
      { label: "A", text: "If it is not" },
      { label: "B", text: "Were it not" },
      { label: "C", text: "Had it not been" },
      { label: "D", text: "Should it not be" }
    ],
    correctAnswer: "C",
    examClue: "主句是 would have suffered（与过去事实相反），从句省略 if 倒装，表示‘若非当时的及时预警’！",
    analysis: "与过去事实相反的虚拟语气从句原为：If it had not been for...。在考场上经常省略 if，并将 had 提前倒装，变形为 Had it not been for...。",
    wrongDistractorWhy: "B 是与现在事实相反；A 是真实条件句与主句 would have 冲突；D 是与将来事实相反。"
  }
];


// ================= 4. 错题本数据结构与种子数据 =================

export type MistakeReason = 
  | 'pos_error'       // 词性判断错误
  | 'meaning_error'   // 句意理解偏差
  | 'vocab_unknown'   // 词汇盲区
  | 'careless'        // 粗心大意
  | 'time_short';     // 考场时间不足

export interface Cet6MistakeItem {
  id: string;
  type: 'cloze' | 'translation' | 'syntax' | 'grammar';
  typeLabel: string;
  title: string;
  sourceContext: string;
  myMistake: string;
  correctAnswer: string;
  reason: MistakeReason;
  reasonLabel: string;
  qiqiInsight: string; // 提分点悟
  createdAt: string;
  isMastered: boolean;
}

export const INITIAL_CET6_MISTAKES: Cet6MistakeItem[] = [
  {
    id: "mis-seed-1",
    type: "cloze",
    typeLabel: "选词填空",
    title: "词尾 -ive 误判为动词导致排除错误",
    sourceContext: "The government took ______ measures to curb inflation. (选项: A. proactive)",
    myMistake: "误认为 proactive 是动词原形，在名词 measures 前不敢选",
    correctAnswer: "proactive 是形容词 (-ive 后缀)，修饰 measures 正好需要形容词",
    reason: "pos_error",
    reasonLabel: "🏷️ 词性判断错误",
    qiqiInsight: "记住 -ive (active, attractive, proactive) 绝大多数是形容词！空格在冠词与名词之间，必定是形容词！",
    createdAt: "2026-06-15",
    isMastered: false
  },
  {
    id: "mis-seed-2",
    type: "translation",
    typeLabel: "汉译英",
    title: "“随着...”写成 Along with 引发中式英语语病",
    sourceContext: "随着经济的快速发展，人们对生活质量的要求越来越高。",
    myMistake: "Along with economy grow fast, people require high life quality.",
    correctAnswer: "With the rapid development of the economy, people have set higher standards for their quality of life.",
    reason: "meaning_error",
    reasonLabel: "🏷️ 句意理解偏差",
    qiqiInsight: "牢记 10 大句型第 1 句：With the rapid development of...，千万别自己生造 Along with 动词句！",
    createdAt: "2026-06-16",
    isMastered: false
  },
  {
    id: "mis-seed-3",
    type: "grammar",
    typeLabel: "核心语法",
    title: "虚拟语气省略 if 倒装反应迟钝",
    sourceContext: "Had it not been for your assistance, we could not have finished the project on time.",
    myMistake: "看到 Had 放在句首以为是疑问句，纠结了 2 分钟没读懂",
    correctAnswer: "Had it not been for... = If it had not been for...（若非你的帮助）",
    reason: "vocab_unknown",
    reasonLabel: "🏷️ 词汇/句式盲区",
    qiqiInsight: "看到没有问号且 Had/Were/Should 放在句首的句子，1秒判定为虚拟语气省略 if 倒装！",
    createdAt: "2026-06-17",
    isMastered: false
  }
];
