import { Lesson, Genre } from '../types';

export interface LessonCustomData {
  importScript?: string;
  keyPoints?: string;
  difficulties?: string;
  sliceTitle?: string;
  sliceRange?: string;
  teacherQuestion?: string;
  studentAnswer?: string;
  teacherFeedback?: string;
  mainBoard?: string;
  updatedAt?: string;
}

export interface VariantInfo {
  id: number;
  name: string;
  tagline: string;
  badgeColor: string;
}

export const LESSON_VARIANTS: VariantInfo[] = [
  {
    id: 0,
    name: '考纲标准标杆版',
    tagline: '标准一课一得 · 紧扣教参考点与考场常规',
    badgeColor: 'bg-bamboo-100 text-bamboo-800 border-bamboo-200'
  },
  {
    id: 1,
    name: '情境感知与美读品析型',
    tagline: '以读促悟 · 声情并茂 · 咬文嚼字品味语言之妙',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 2,
    name: '主问题导学与微任务链型',
    tagline: '思维进阶 · 任务驱动 · 以核心问题串联探究课堂',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 3,
    name: '考场速通与核心切片冲刺型',
    tagline: '直击评分项 · 精准控时 · 10分钟高分结构化呈现',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  }
];

// Helper to generate pedagogical variant based on genre and variant id
export function getLessonWithVariant(baseLesson: Lesson, variantId: number): Lesson {
  if (variantId === 0) {
    return baseLesson;
  }

  const { title, author, genre } = baseLesson;
  const isAncient = genre === '文言文' || genre === '古诗词';
  const isNarrative = genre === '叙事散文/小说';
  const isExpository = genre === '说明文/新闻/活动';
  const isArgumentative = genre === '议论文/思辨文本';

  // Variant 1: 情境感知与美读品析型
  if (variantId === 1) {
    let leadIn = '';
    let readingFocus = '';
    let question = '';
    let answer = '';
    let feedback = '';
    let keyPoint = '';
    let mainBoard = '';

    if (isAncient) {
      leadIn = `同学们，上课！请坐。中国古典文学浩瀚如海，每一个字背后都藏着古人的风骨与情致。今天，让我们轻扣历史的门扉，走进${author}的《${title}》。请大家先合上书，听老师范读前两句，注意体会其中的音韵停连与节奏变化……（教师深情范读）`;
      readingFocus = `指导学生掌握古汉语的“四声顿挫”与“虚词拖腔”，通过由浅入深的“读准节奏-读懂句意-读出情味”三阶美读法体悟文心。`;
      question = `请同学们在自由诵读的基础上，找出一处最能触动你心灵的字眼或长句，试着标出朗读停连与重音，并向同桌说说你为什么这样读？`;
      answer = `生：老师，我觉得这一句应当重读核心动词，语气要舒缓而深沉，表现作者当时内心的波澜。`;
      feedback = `非常好！你的语感非常敏锐。注意看黑板上的范例，如果我们把这个字读成轻声拖长，是不是更能传达出那种言有尽而意无穷的韵味？大家全体起立，跟着这位同学的节拍一起齐读一遍！`;
      keyPoint = `通过多轮声情并茂的诵读品味，掌握关键虚实词的文化内涵与句读节奏。`;
      mainBoard = `《${title}》美读品析图\n一读准字音节奏 ── 句读明晰\n二读通文意文脉 ── 文白对照\n三读悟作者情思 ── 虚实相生\n【主旨凝练】：情景交融 · 韵味悠长`;
    } else if (isNarrative) {
      leadIn = `上课！同学们好，请坐。生活中我们常与形形色色的人擦肩而过，但总有那么一个眼神、一个背影或一句话，长久地镌刻在我们心底。今天，就让我们跟随${author}细腻的笔触，走进《${title}》的世界，去定格那些直击人心的生活细节。`;
      readingFocus = `抓住课文中具有强烈画面感与心理波动的细节描写，通过“朗读停顿-语速微调-细节放大”三维沉浸法展开切片研读。`;
      question = `请大家细读文章的核心段落，圈画出作者对人物动作、神态或语言最传神的那两三处词语，试着带着你的理解，给全班同学朗读示范一下！`;
      answer = `生：老师，我觉得这一处的动作描写写得很克制，读的时候语速要放慢，甚至要带一点微微的颤音，才能读出人物内心的隐忍与关爱。`;
      feedback = `听你的朗读，老师的眼前仿佛浮现出了真实的画面！这就是细节描写以少胜多的力量。大家注意到没有，他读到这一句时特意做了一个微小的停顿，给听众留下了联想的空间，这正是高水平朗读的精妙之处！`;
      keyPoint = `品味人物细节描写的传神之笔，学会抓住关键词句通过抑扬顿挫的朗读体悟人物的精神世界。`;
      mainBoard = `《${title}》细节特写研读\n【镜头定格】：动作微观 · 神态传神\n【语调体悟】：缓急有致 · 声情合一\n【情感内核】：以小见大 · 动人心弦`;
    } else if (isExpository || isArgumentative) {
      leadIn = `同学们好，请坐！大千世界充满未知，用严谨的眼光审视客观规律，是人类智慧的结晶。今天我们一同学习${author}的《${title}》，看看作者是如何化深奥为通俗、化纷繁为井然的。`;
      readingFocus = `聚焦文本语言的“准确性与科学性”，通过朗读对比（替换词语前后对比读）切片，体会论述/说明语言的分寸感。`;
      question = `请同学们默读核心切片，找出一处含有副词（如“极”、“几乎”、“往往”）或关键逻辑过渡句的地方，如果把这个词删去，再大声朗读一遍，语意和表达效果有什么显著不同？`;
      answer = `生：如果删去这个限定副词，句子就显得过于绝对，违背了事实客观性；保留它，读起来更体现出严密审慎的思维逻辑。`;
      feedback = `一语中的！语文的魅力就在于一字之差。请全班同学把这个句子保留与删去副词的两种版本连起来对比朗读一遍，在声音中体悟语言的分寸感！`;
      keyPoint = `品味概念界定与修饰限定词的精准表达，在对比研读与朗读中养成严谨客观的科学思辨素养。`;
      mainBoard = `《${title}》语言思辨与结构探微\n【严谨之美】：修饰限定 · 恰到好处\n【逻辑之美】：层层递进 · 井然有序\n【文风品格】：求真务实 · 深入浅出`;
    } else {
      // General Prose / Writing
      leadIn = `上课！同学们好，请坐。有人说，语文课就是一场发现美、感悟美的旅程。今天让我们随着${author}的脚步，在《${title}》中开启一段与文字的深情对话。请大家轻声自由朗读，找寻文章中那抹最动人的亮色。`;
      readingFocus = `抓取经典写景或抒情句式，通过重音标注、节奏快慢与语气轻重的朗读切片，引导学生在声音中步入文本意境。`;
      question = `请同学们在自由朗读中选取你最喜欢的一个修辞句或写景句，试着标出重音和语调，并为我们深情朗读，告诉大家你仿佛看到了怎样的画面？`;
      answer = `生：我选了这一句，重音落在形容词上，语调微微上扬，读出一种生机勃勃的欣喜感。`;
      feedback = `读得真美！重音找得准，感情充沛，老师仿佛也能闻到文字里散发出的清香。全班女同学起立，我们一起用这样优美的语调把这一句再诵读一遍！`;
      keyPoint = `掌握抓修辞、抓意象的语言赏析方法，能在朗读中再现生动画面与真挚情感。`;
      mainBoard = `《${title}》美读入情板书\n【景物画卷】：色彩鲜明 · 动静结合\n【语言品味】：妙用修辞 · 音韵谐美\n【情感归宿】：以情入景 · 寄情于物`;
    }

    return {
      ...baseLesson,
      goldenSlice: {
        ...baseLesson.goldenSlice,
        sliceTitle: `【美读品析方案】聚焦典型语言片段与情感声韵切片`,
        oneGain: `一课一得：掌握“圈点批注+分层美读”品析文本核心语言与情感密码的方法。`
      },
      speedPlan: {
        ...baseLesson.speedPlan,
        keyPoints: keyPoint,
        difficulties: `体会作者在字里行间所寄托的深沉情感，并能通过恰如其分的朗读声调加以呈现。`
      },
      verbatimScript: {
        ...baseLesson.verbatimScript,
        importStage: {
          teacherLines: leadIn,
          actionNotes: '面带微笑，目光巡视全场考官，声音富有感染力，伴随亲切的指引手势。'
        },
        deepDiveStage: {
          ...baseLesson.verbatimScript.deepDiveStage,
          title: '二、潜心沉浸，精读品味（核心微格研读切片）',
          readingGuidance: readingFocus,
          teacherQuestion: question,
          studentAnswer: answer,
          teacherFeedback: feedback
        }
      },
      blackboard: {
        ...baseLesson.blackboard,
        mainBoard: mainBoard
      }
    };
  }

  // Variant 2: 主问题导学与微任务链型
  if (variantId === 2) {
    let leadIn = '';
    let taskChain = '';
    let question = '';
    let answer = '';
    let feedback = '';
    let keyPoint = '';
    let mainBoard = '';

    if (isAncient) {
      leadIn = `同学们上课！请坐。古人写文章，常在看似寻常的记叙中暗藏治国修身的大智慧。今天我们学习${author}的《${title}》，老师在课前研读时产生了一个巨大的疑问，作者身处逆境，为何能在文末迸发出如此震颤古今的情怀？让我们带着这个主问题，开启今天的探究之旅！`;
      taskChain = `设计“任务一：辨字正音，梳理文脉” -> “任务二：知人论世，破译主旨密码” -> “任务三：文化涵泳，古今对话”三大驱动任务。`;
      question = `任务驱动探究：请大家精读文本核心切片，小组合作思考：作者在文中描绘这幅图景，表面是在写物/写景，其真正想托物言志表达的心声是什么？请从文中找到两处互为呼应的文言依据。`;
      answer = `生：我们小组讨论认为，作者通过前后反差对比，表面赞美客体，实则是自抒胸臆，展现了超越个人荣辱的高远理想。依据在核心段落的倒数第二句。`;
      feedback = `见解极为深刻！抓住了文眼所在。大家看投影与黑板，我们把这两句摘录出来并列对比，立刻就能看清作者行文的暗线交织。掌声送给第二合作小组！`;
      keyPoint = `通过结构化主问题驱动，掌握文言文“以物载道”、“托物言志”的思维建构与行文逻辑。`;
      mainBoard = `《${title}》主问题思辨探究图\n【核心主问题】：逆境何以生豪情？\n├─ 任务1：析字理脉 ── 景中寓情\n├─ 任务2：知人论世 ── 心系天下\n└─ 任务3：文化回响 ── 精神丰碑\n【探究结论】：超越小我 · 家国胸怀`;
    } else if (isNarrative) {
      leadIn = `同学们，上课！请坐。优秀的小说和叙事散文，往往不是把答案直接告诉你，而是留下一连串引人深思的问号。今天学习${author}的《${title}》，老师想给大家布置一份“小说侦探档案”，请大家化身文学评判家，深入文本内部寻找解谜线索！`;
      taskChain = `设计“任务一：绘制人物心理演变折线图” -> “任务二：解构关键情节冲突与转折点” -> “任务三：提炼小说时代社会隐喻”三步任务支架。`;
      question = `主问题导学：结合课文核心切片，请同学们以四人小组为单位展开探究：如果把小说中这场关键的情节冲突移去，人物的性格塑造是否还能立得住？为什么？`;
      answer = `生：我们组认为立不住。因为正是在这场极端矛盾冲突中，人物内心的犹豫、挣挣与最终的抉择才被逼迫出来，展现出人性的复杂与真实。`;
      feedback = `分析得太精彩了！文学创作讲究“文似看山不喜平”，没有冲突就没有人物的灵魂高光。请大家把刚才这位同学提到的关键词，工整地批注在课本第XX页右侧的空白处。`;
      keyPoint = `掌握主问题探究法，能够结合情节冲突与环境烘托，深层次剖析典型人物的心理发展与精神特质。`;
      mainBoard = `《${title}》人物命运与矛盾冲突谱系\n【主问题驱动】：冲突何以塑造灵魂？\n┌─ 平静表象 ── 生活沉潜\n├─ 矛盾爆发 ── 抉择拷问（教学核心点）\n└─ 精神升华 ── 破茧重生\n【写作启示】：聚焦矛盾 · 刻画鲜活`;
    } else if (isExpository || isArgumentative) {
      leadIn = `同学们上课，请坐！在这个信息爆炸的时代，如何一眼看穿事物的本质？清晰的逻辑架构正是最强有力的思维武器。今天我们一同研读${author}的《${title}》，去探寻作者是如何用严丝合缝的逻辑网征服读者的。`;
      taskChain = `设计“任务一：提取核心观点与分论点金字塔” -> “任务二：辨析论证方法/说明顺序的排布匠心” -> “任务三：拟写一篇反驳微评论”三阶支架。`;
      question = `主问题思辨：请大家深入研读第X段至第Y段，思考作者为何先列举现象A，再论述原因B，最后才揭示规律C？这个顺序如果颠倒过来，会破坏怎样的认知逻辑链条？`;
      answer = `生：颠倒之后就不符合“由表及里、由浅入深”的认知规律。现在的顺序让读者先产生共鸣，再探寻原由，逻辑层层紧扣，更具说服力。`;
      feedback = `归纳得极为精炼！这就是“逻辑的力量”。说明与思辨文的魅力就在于如抽丝剥茧般引人入胜。请大家看黑板上的这幅思维导图，我们清晰地看到了论证的逻辑链条！`;
      keyPoint = `通过问题链引导学生绘制论述行文逻辑思维导图，理解由表及里、由浅入深的逻辑论证结构。`;
      mainBoard = `《${title}》逻辑链条思维建构\n【主问题引领】：行文顺序背后的逻辑之链\n┌─ 现象引入（表象感知）\n├─ 机制剖析（本质探寻 · 核心切片）\n└─ 价值推演（未来反思）\n【思辨素养】：由表及里 · 格物致知`;
    } else {
      // General
      leadIn = `同学们好，请坐！语文学习最有趣的地方，就在于通过小切口去发现大世界。今天我们学习${author}的《${title}》，老师设计了一份“课堂探究任务单”，看看哪位同学能够率先攻破今天的三大核心关卡！`;
      taskChain = `设计“任务一：词语寻宝（找典型字词）” -> “任务二：意象解码（破译情感密码）” -> “任务三：微课迁移（学以致用实践）”。`;
      question = `任务核心攻坚：请同学们研读文本切片，聚焦主问题——“作者写景的笔法究竟奇在何处？”请至少提取文中的三个不同观察视角加以论证。`;
      answer = `生：作者分别从俯视与仰视、远景与近景、动态与静态三个维度展开，多感官交融，形成了立体画卷。`;
      feedback = `太棒了！多角度观察与多感官描写正是写景散文的精髓所在。大家请把这三个角度补充在黑板右侧的思维支架中！`;
      keyPoint = `在主问题探究中掌握多视角、多维度的文本细读策略，提升结构化思维与批判性思考能力。`;
      mainBoard = `《${title}》微任务立体研读\n【主问题聚焦】：多维视角绘宏篇\n┌─ 仰视与俯视 ── 空间层次\n├─ 动境与静境 ── 虚实结合（核心突破）\n└─ 视觉与听觉 ── 通感交融\n【一得】：立体描摹 · 笔底生波`;
    }

    return {
      ...baseLesson,
      goldenSlice: {
        ...baseLesson.goldenSlice,
        sliceTitle: `【主问题微任务方案】以核心问题链推动学生思维进阶`,
        oneGain: `一课一得：掌握“主问题穿引+微任务链”的文本深度解读与自主合作探究法。`
      },
      speedPlan: {
        ...baseLesson.speedPlan,
        keyPoints: keyPoint,
        difficulties: `理解主问题背后所勾连的行文脉络与深层思想意蕴，完成从浅层感知到高阶思维的跨越。`
      },
      verbatimScript: {
        ...baseLesson.verbatimScript,
        importStage: {
          teacherLines: leadIn,
          actionNotes: '神采奕奕，语气沉稳自信，板书主问题标题，调动考官对课堂学生活动的期待。'
        },
        deepDiveStage: {
          ...baseLesson.verbatimScript.deepDiveStage,
          title: '二、任务驱动，破译内核（主问题探究切片）',
          readingGuidance: taskChain,
          teacherQuestion: question,
          studentAnswer: answer,
          teacherFeedback: feedback
        }
      },
      blackboard: {
        ...baseLesson.blackboard,
        mainBoard: mainBoard
      }
    };
  }

  // Variant 3: 考场速通与核心切片冲刺型
  if (variantId === 3) {
    const leadIn = `上课！同学们好，请坐！“温故而知新，可以为师矣。”在上节课中，我们初读了${author}的《${title}》，梳理了整体框架。这节课，我们直奔主题，把目光聚焦在全篇最具代表性的核心段落上，展开我们的10分钟深度研读！请同学们翻开课本第XX页……`;
    const question = `考点核心直击：请大家用3分钟时间默读核心切片，根据考卷要求，思考并归纳：该片段中运用的核心表现手法是什么？它是如何为表现文章主旨服务的？`;
    const answer = `生：该片段运用了借景抒情（或对比烘托/层层递进）的手法，通过关键语句的表现力，深化了文章的核心主题。`;
    const feedback = `归纳极为准确，语言精炼到位！这就告诉我们，答题和赏析都要紧扣手法与情感的双向绑定。请同学们看黑板，我们把这个公式记录下来：手法标靶 + 文本印证 + 情感归宿！`;
    const mainBoard = `《${title}》考场高分结构化板书\n【课题定位】：${author} · 《${title}》\n┌─ 核心切片：${baseLesson.goldenSlice.sliceRange}\n├─ 技法提炼：手法精当 · 语言典范\n└─ 主旨升华：一课一得 · 紧扣考纲\n【考官点拨】：讲练结合 · 结构清晰`;

    return {
      ...baseLesson,
      goldenSlice: {
        ...baseLesson.goldenSlice,
        sliceTitle: `【考场速通方案】直奔评分核心点，精准切片讲深讲透`,
        oneGain: `一课一得：精准突破考卷规定考点，实现“导入1分半-切片5分钟-小结与板书3分半”黄金配比。`
      },
      speedPlan: {
        ...baseLesson.speedPlan,
        keyPoints: `精准把握试题考查要求中的核心切片，讲练结合，在10分钟内展现出扎实的学科教学基本功。`,
        difficulties: `板书与试讲口述的高效同步协同，确保10分钟不超时、不抢步、不踩雷。`
      },
      verbatimScript: {
        ...baseLesson.verbatimScript,
        importStage: {
          teacherLines: leadIn,
          actionNotes: '教态端庄干练，声音洪亮清晰，1分钟内干净利索切入核心，不拖泥带水。'
        },
        deepDiveStage: {
          ...baseLesson.verbatimScript.deepDiveStage,
          title: '二、考点聚焦，精讲练评（考场速通研读切片）',
          readingGuidance: '严格按照教资面试评分标准，讲清核心手法的概念、文本落脚点及考场问答模板。',
          teacherQuestion: question,
          studentAnswer: answer,
          teacherFeedback: feedback
        }
      },
      blackboard: {
        ...baseLesson.blackboard,
        mainBoard: mainBoard
      }
    };
  }

  return baseLesson;
}

// Merge custom user edits on top of the lesson
export function applyCustomLessonEdits(lesson: Lesson, custom: LessonCustomData | null): Lesson {
  if (!custom) return lesson;

  return {
    ...lesson,
    goldenSlice: {
      ...lesson.goldenSlice,
      sliceTitle: custom.sliceTitle || lesson.goldenSlice.sliceTitle,
      sliceRange: custom.sliceRange || lesson.goldenSlice.sliceRange,
    },
    speedPlan: {
      ...lesson.speedPlan,
      keyPoints: custom.keyPoints || lesson.speedPlan.keyPoints,
      difficulties: custom.difficulties || lesson.speedPlan.difficulties,
    },
    verbatimScript: {
      ...lesson.verbatimScript,
      importStage: {
        ...lesson.verbatimScript.importStage,
        teacherLines: custom.importScript || lesson.verbatimScript.importStage.teacherLines,
      },
      deepDiveStage: {
        ...lesson.verbatimScript.deepDiveStage,
        teacherQuestion: custom.teacherQuestion || lesson.verbatimScript.deepDiveStage.teacherQuestion,
        studentAnswer: custom.studentAnswer || lesson.verbatimScript.deepDiveStage.studentAnswer,
        teacherFeedback: custom.teacherFeedback || lesson.verbatimScript.deepDiveStage.teacherFeedback,
      }
    },
    blackboard: {
      ...lesson.blackboard,
      mainBoard: custom.mainBoard || lesson.blackboard.mainBoard,
    }
  };
}
