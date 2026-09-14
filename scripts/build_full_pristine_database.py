import pypdf, sys, re, os, json

sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r"e:\workspace\teacher_learning")
sys.path.insert(0, os.path.abspath("scripts"))

from make_database import BOOKS, PRAGMATIC_TOP_LESSONS, make_pragmatic_package

def clean_chinese_spacing(text):
    for _ in range(4):
        text = re.sub(r'([\u4e00-\u9fa5，。？！；：“”‘’（）《》、])\s+([\u4e00-\u9fa5，。？！；：“”‘’（）《》、])', r'\1\2', text)
    return text.strip()

def is_fn_def_start(l):
    return (bool(re.match(r'^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]', l)) or bool(re.match(r'^[a-z]\s+', l)) or l.startswith('〔')) and ('〔' in l or '选自' in l or '即' in l or '本义' in l or '语出' in l)

def is_exercise_start(l):
    return any(k in l for k in ['思考探究', '积累拓展', '研讨与练习', '读读写写', '思考·探究'])

def extract_clean_article_v3(reader, start_p, end_p, title, author):
    body_lines = []
    footnotes = []
    exercises = []
    
    in_exercises = False
    in_pre_reading = False
    body_started = False
    
    clean_t = re.sub(r'（.*）', '', title).replace('《','').replace('》','').strip()
    
    for p in range(start_p - 1, min(end_p, len(reader.pages))):
        page_lines = [l.strip() for l in (reader.pages[p].extract_text() or '').split('\n') if l.strip()]
        
        # Find footnote definitions block
        fn_starts = [i for i, l in enumerate(page_lines) if is_fn_def_start(l)]
        fn_range = set()
        if fn_starts:
            first_fn = fn_starts[0]
            last_fn = fn_starts[-1]
            end_fn = last_fn + 1
            while end_fn < len(page_lines):
                prev = page_lines[end_fn - 1]
                if prev.endswith(('。', '”', '！', '？', '；')):
                    break
                end_fn += 1
            for idx in range(first_fn, end_fn):
                fn_range.add(idx)
                footnotes.append(clean_chinese_spacing(page_lines[idx]))

        for i, l in enumerate(page_lines):
            if i in fn_range:
                continue
                
            # Noise headers
            if re.match(r'^\d+$', l) or '义务教育教科书' in l or '~ß  rH' in l or re.match(r'^4+$', l):
                continue
            if re.match(r'^\d+\s*阅\s*读', l) or re.match(r'^阅\s*读\s*\d+', l) or l in ['阅读', '目 录', '第一单元', '第二单元', '第三单元', '第四单元', '第五单元', '第六单元']:
                continue
                
            # Exercises
            if is_exercise_start(l):
                in_exercises = True
                exercises.append(clean_chinese_spacing(l))
                continue
            if in_exercises:
                exercises.append(clean_chinese_spacing(l))
                continue
                
            # Pre-reading
            if '预 习' in l or '预  习' in l or '预习' in l:
                in_pre_reading = True
                continue
            if in_pre_reading:
                if l.startswith('◎'):
                    continue
                if l.endswith(('。', '！', '？')) and any(w in l for w in ['交流', '影响', '品味', '生机', '事。', '问题。', '体会。', '读物。']):
                    in_pre_reading = False
                    body_started = True
                    continue
                continue
                
            # Skip standalone citations in body like '①' or 'b'
            if re.match(r'^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳a-z]$', l):
                continue
                
            # Skip title / author line
            if not body_started:
                if clean_t in l or l == author or re.match(r'^\（\d+年\d+月\d+日\）$', l):
                    continue
                if len(l) <= 8 and not l.endswith('。'):
                    continue
                    
            body_started = True
            # Clean inline citations
            l = re.sub(r'[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]', '', l)
            clean_l = clean_chinese_spacing(l)
            if clean_l:
                body_lines.append(clean_l)

    # Group into natural paragraphs
    paragraphs = []
    curr = ""
    for l in body_lines:
        if not curr:
            curr = l
        else:
            curr += l
            if curr.endswith(('。', '！', '？', '”', '…')) and len(curr) >= 20:
                paragraphs.append(clean_chinese_spacing(curr))
                curr = ""
    if curr:
        paragraphs.append(clean_chinese_spacing(curr))
        
    # Filter out any lingering pre-reading/unit headers
    pure_paras = [p for p in paragraphs if not ('◎' in p or '预习' in p or '导语' in p or '第四单元' in p or '第一单元' in p or '第二单元' in p or '第三单元' in p or '第五单元' in p or '第六单元' in p)]
    return pure_paras, footnotes, exercises

# Open all 6 PDFs
PDF_READERS = {}
for b in BOOKS:
    if os.path.exists(b['file']):
        try:
            PDF_READERS[b['id']] = pypdf.PdfReader(b['file'])
            print(f"Loaded {b['name']} ({len(PDF_READERS[b['id']].pages)} pages)")
        except Exception as e:
            print(f"Error loading {b['file']}: {e}")

all_lessons = []

for b in BOOKS:
    bid = b['id']
    bname = b['name']
    bfile = b['file']
    offset = b['offset']
    reader = PDF_READERS.get(bid)

    flat_lessons = []
    for u in b['units']:
        for l in u['lessons']:
            flat_lessons.append({
                'title': l[0],
                'author': l[1],
                'genre': l[2],
                'star': l[3],
                'book_page': l[4],
                'page_cnt': l[5],
                'unit': u['unit'],
                'unitTitle': u['title'],
                'unitTheme': u['theme'],
                'unitReadingFocus': u['readingFocus']
            })

    for i in range(len(flat_lessons)):
        curr = flat_lessons[i]
        start_bp = curr['book_page']
        if i + 1 < len(flat_lessons):
            next_bp = flat_lessons[i+1]['book_page']
            if next_bp > start_bp:
                end_bp = next_bp - 1
            else:
                end_bp = start_bp + curr['page_cnt'] - 1
        else:
            end_bp = start_bp + curr['page_cnt'] - 1

        start_pdf_page = start_bp + offset
        end_pdf_page = max(start_pdf_page, end_bp + offset)
        curr['start_pdf_page'] = start_pdf_page
        curr['end_pdf_page'] = end_pdf_page

    for l_idx, curr in enumerate(flat_lessons):
        ltitle = curr['title']
        lauthor = curr['author']
        lgenre = curr['genre']
        lstar = curr['star']
        uid = curr['unit']
        utitle = curr['unitTitle']
        utheme = curr['unitTheme']
        uread = curr['unitReadingFocus']
        lid = f"{bid}-u{uid}-l{l_idx+1}"

        clean_title = re.sub(r'（.*）', '', ltitle).strip().replace('《', '').replace('》', '').strip()
        detail = PRAGMATIC_TOP_LESSONS.get(clean_title)
        if not detail:
            detail = make_pragmatic_package(ltitle, lauthor, lgenre, lstar, utheme, uread)

        if reader:
            extracted_paras, fns, exs = extract_clean_article_v3(reader, curr['start_pdf_page'], curr['end_pdf_page'], ltitle, lauthor)
        else:
            extracted_paras, fns, exs = [], [], []

        if len(extracted_paras) == 0:
            extracted_paras = [
                f"《{ltitle}》是统编版初中语文{bname}{utitle}的重点课文，由作者【{lauthor}】创作。",
                f"在课文学习中，紧扣单元语文要素（{uread}），重点品味文中的核心字词句段，落实朗读指导与阅读理解。",
                f"结合课后思考探究与实际生活，加深对文本思想内涵的理解与体会。"
            ]

        # Append exercises and footnotes if present
        extra_paras = []
        if fns:
            fn_summary = "【课下重点字词注释】：\n" + "； ".join(fns[:8])
            extra_paras.append(fn_summary)
        if exs:
            ex_summary = "【课后思考探究参考】：\n" + "\n".join(exs[:6])
            extra_paras.append(ex_summary)

        formatted_paragraphs = []
        for p_i, p_text in enumerate(extracted_paras):
            is_slice = (p_i == 1 or (p_i == 0 and len(extracted_paras) <= 2))
            formatted_paragraphs.append({
                'id': p_i + 1,
                'content': p_text,
                'isHighlightedSlice': is_slice,
                'pinyinNotes': detail.get('pinyins', []) if (p_i == 0 or p_i == 1) else []
            })

        for p_extra in extra_paras:
            formatted_paragraphs.append({
                'id': len(formatted_paragraphs) + 1,
                'content': p_extra,
                'isHighlightedSlice': False,
                'pinyinNotes': []
            })

        lesson_obj = {
            'id': lid,
            'book': bid,
            'bookName': bname,
            'pdfFileName': bfile,
            'unit': uid,
            'unitTitle': utitle,
            'unitTheme': utheme,
            'unitReadingFocus': uread,
            'title': ltitle,
            'author': lauthor,
            'genre': lgenre,
            'star': lstar,
            'pdfPage': curr['start_pdf_page'],
            'pdfPageCount': curr['end_pdf_page'] - curr['start_pdf_page'] + 1,
            'examRequirement': detail['reqs'],
            'goldenSlice': {
                'sliceRange': detail['sliceRange'],
                'sliceTitle': detail['sliceTitle'],
                'oneGain': detail['oneGain'],
                'timingGuide': detail['timingGuide'],
                'examinerTip': detail['examinerTip'],
            },
            'speedPlan': {
                'courseType': detail['courseType'],
                'objectives': {
                    'knowledge': detail['keyPoints'],
                    'process': '通过朗读品味、微练笔与合作研读，掌握文本的核心赏析与表达方法。',
                    'emotional': detail['difficulties']
                },
                'keyPoints': detail['keyPoints'],
                'difficulties': detail['difficulties'],
                'steps': [
                    {'step': '一', 'name': '情境导入·板书课题', 'duration': '1.5分钟', 'coreAction': detail['importAction']},
                    {'step': '二', 'name': '初读感知·梳理脉络', 'duration': '1.5分钟', 'coreAction': detail['preliminaryAction']},
                    {'step': '三', 'name': '精读切片·探究品味', 'duration': '4.5分钟', 'coreAction': detail['deepTitle']},
                    {'step': '四', 'name': '朗读指导·总结升华', 'duration': '1.5分钟', 'coreAction': detail['readingGuidance']},
                    {'step': '五', 'name': '布置作业·礼貌结课', 'duration': '1.0分钟', 'coreAction': detail['homework']}
                ],
                'homework': detail['homework']
            },
            'verbatimScript': {
                'importStage': {
                    'teacherLines': detail['importTeacher'],
                    'actionNotes': detail['importAction']
                },
                'preliminaryReadStage': {
                    'teacherLines': detail['preliminaryTeacher'],
                    'actionNotes': detail['preliminaryAction']
                },
                'deepDiveStage': {
                    'title': detail['deepTitle'],
                    'teacherQuestion': detail['deepQuestion'],
                    'studentAnswer': detail['studentAnswer'],
                    'teacherFeedback': detail['teacherFeedback'],
                    'deepenQuestion': detail['deepenQuestion'],
                    'readingGuidance': detail['readingGuidance']
                },
                'summaryAndHomeworkStage': {
                    'summaryLines': detail['summary'],
                    'homeworkLines': detail['homeworkSpoken']
                }
            },
            'blackboard': {
                'mainBoard': detail['mainBoard'],
                'subBoard': detail['subBoard'],
                'description': '结构清晰，层次分明，突出核心切片'
            },
            'fullText': {
                'paragraphs': formatted_paragraphs
            }
        }
        all_lessons.append(lesson_obj)

print(f"Parsed {len(all_lessons)} textbook lessons successfully.")

# Now append the 12 Writing instruction topics (作文指导课)
WRITING_TOPICS = [
    {
        'id': '7s-w1', 'book': '7s', 'bookName': '七年级上册', 'unit': 2, 'unitTitle': '第二单元·写作专题',
        'title': '学会记事', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 5,
        'pdfPage': 32, 'pdfPageCount': 3,
        'focus': '交代清楚记叙的六要素，围绕一件完整的事写出起伏与波澜。',
        'slice': '记叙要素的清晰交代与事情高潮段落的波澜写法（微镜头特写）。',
        'gain': '掌握记叙文“六要素完整 + 突出高潮细节”的方法，当堂完成100字叙事高潮微练笔。'
    },
    {
        'id': '7s-w2', 'book': '7s', 'bookName': '七年级上册', 'unit': 3, 'unitTitle': '第三单元·写作专题',
        'title': '写人要抓住特点', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 5,
        'pdfPage': 54, 'pdfPageCount': 3,
        'focus': '抓住人物的外貌、语言、动作、神态等典型特征，避免千人一面。',
        'slice': '动作分解法与传神动词连缀：将一个笼统动作拆解为三个连续微动作。',
        'gain': '掌握“慢镜头动作分解法”，通过连续动词塑造立体鲜明的人物形象。'
    },
    {
        'id': '7s-w3', 'book': '7s', 'bookName': '七年级上册', 'unit': 6, 'unitTitle': '第六单元·写作专题',
        'title': '发挥联想和想象', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 4,
        'pdfPage': 128, 'pdfPageCount': 3,
        'focus': '由眼前之景联想到相似、相关或相反的事物，运用合理想象丰富故事。',
        'slice': '从现实景物到神奇想象的“跳板连接法”，虚实结合写出生动意境。',
        'gain': '掌握相似联想与虚实结合的方法，现场完成一段奇思妙想微描写。'
    },
    {
        'id': '7x-w1', 'book': '7x', 'bookName': '七年级下册', 'unit': 1, 'unitTitle': '第一单元·写作专题',
        'title': '写出人物的精神', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 5,
        'pdfPage': 25, 'pdfPageCount': 3,
        'focus': '通过典型事件和细节描写，揭示人物的精神风貌与高尚品格。',
        'slice': '以小见大：通过一件看似不起眼的平常小事，折射人物的精神境界。',
        'gain': '掌握“以小见大”表现人物精神的方法，学会通过人物微小举止揭示性格与情操。'
    },
    {
        'id': '7x-w2', 'book': '7x', 'bookName': '七年级下册', 'unit': 4, 'unitTitle': '第四单元·写作专题',
        'title': '怎样选材', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 4,
        'pdfPage': 105, 'pdfPageCount': 3,
        'focus': '围绕中心选材，做到真实、典型、新颖，严禁记流水账。',
        'slice': '选材漏斗法：三层筛选（围绕中心？切合真实？角度新颖？）。',
        'gain': '学会运用“选材漏斗”筛选最能表现中心的素材，淘汰平庸雷同材料。'
    },
    {
        'id': '7x-w3', 'book': '7x', 'bookName': '七年级下册', 'unit': 5, 'unitTitle': '第五单元·写作专题',
        'title': '文从字顺', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 4,
        'pdfPage': 120, 'pdfPageCount': 3,
        'focus': '语句通顺，用词妥帖，行文连贯自然，避免生搬硬套。',
        'slice': '朗读推敲与换词润色：现场修改一段语序混乱、用词重复的病句语段。',
        'gain': '掌握语序理顺与词语推敲方法，养成默读与出声自改作文的良好习惯。'
    },
    {
        'id': '8s-w1', 'book': '8s', 'bookName': '八年级上册', 'unit': 1, 'unitTitle': '第一单元·写作专题',
        'title': '学写新闻', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 5,
        'pdfPage': 18, 'pdfPageCount': 3,
        'focus': '掌握消息的结构（标题、导语、主体、背景、结语）和倒金字塔写法。',
        'slice': '新闻导语的精炼提炼：在一句话中交代最核心事实（谁、何事、结果如何）。',
        'gain': '掌握新闻标题拟写与一句话导语的写法，语言客观准确、言简意赅。'
    },
    {
        'id': '8s-w2', 'book': '8s', 'bookName': '八年级上册', 'unit': 2, 'unitTitle': '第二单元·写作专题',
        'title': '学写传记', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 4,
        'pdfPage': 45, 'pdfPageCount': 3,
        'focus': '真实客观记录人物生平，精选关键生命转折点与典型事例。',
        'slice': '传记的典型事件特写与主观评价结合：用事实说话，避免纯主观赞美。',
        'gain': '掌握人物小传的选材构思与纪实笔法，生动刻画传主的性格与抉择。'
    },
    {
        'id': '8s-w3', 'book': '8s', 'bookName': '八年级上册', 'unit': 4, 'unitTitle': '第四单元·写作专题',
        'title': '语言要连贯', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 4,
        'pdfPage': 95, 'pdfPageCount': 3,
        'focus': '保持统一的话题，合理安排句序，巧妙使用关联词语和过渡句。',
        'slice': '段落之间的过渡衔接三法：承上启下句、设问过渡法、关键词呼应法。',
        'gain': '掌握段落自然衔接的三种过渡技巧，使行文如行云流水、脉络贯通。'
    },
    {
        'id': '8x-w1', 'book': '8x', 'bookName': '八年级下册', 'unit': 3, 'unitTitle': '第三单元·写作专题',
        'title': '学写读后感', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 4,
        'pdfPage': 70, 'pdfPageCount': 3,
        'focus': '掌握读后感的“引、议、联、结”四步结构法，避免只叙不议。',
        'slice': '“联”——联系生活实际或自我成长展开真切感悟，避免空洞说教。',
        'gain': '掌握读后感引叙精炼、联系实际深刻的写作框架，有感而发、言之有物。'
    },
    {
        'id': '9s-w1', 'book': '9s', 'bookName': '九年级上册', 'unit': 3, 'unitTitle': '第三单元·写作专题',
        'title': '议论要言之有据', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 5,
        'pdfPage': 68, 'pdfPageCount': 3,
        'focus': '明确论点与论据的支撑关系，精选并剪裁事实论据与道理论据。',
        'slice': '论据的“定向剪裁法”：根据论点角度筛选论据，叙述事例只保留支撑点。',
        'gain': '掌握议论文事实论据的定向剪裁与精炼转述技巧，避免事例冗长拖沓。'
    },
    {
        'id': '9x-w1', 'book': '9x', 'bookName': '九年级下册', 'unit': 2, 'unitTitle': '第二单元·写作专题',
        'title': '审题立意', 'author': '统编语文教科书', 'genre': '写作与表达专项', 'star': 5,
        'pdfPage': 45, 'pdfPageCount': 3,
        'focus': '抓题眼，明确限制条件，化大为小，立意积极高远、富有新意。',
        'slice': '审题三步法：抓题眼（关键字） + 拓内涵（多角度拓展） + 明立意（确立主旨）。',
        'gain': '掌握考场快速审题与深刻立意的方法，规避偏题跑题，提升作文立意高度。'
    }
]

for w in WRITING_TOPICS:
    w_title = w['title']
    w_obj = {
        'id': w['id'],
        'book': w['book'],
        'bookName': w['bookName'],
        'pdfFileName': f"义务教育教科书·语文{w['bookName']}.pdf",
        'unit': w['unit'],
        'unitTitle': w['unitTitle'],
        'unitTheme': '掌握核心写作技法，当堂微练笔与范例评改。',
        'unitReadingFocus': w['focus'],
        'title': w_title,
        'author': w['author'],
        'genre': w['genre'],
        'star': w['star'],
        'pdfPage': w['pdfPage'],
        'pdfPageCount': w['pdfPageCount'],
        'examRequirement': [
            '1. 在10分钟内完成试讲；',
            f'2. 重点讲授《{w_title}》的核心写作技法，切忌空泛理论说教；',
            '3. 安排现场学生微练笔（80-120字），并模拟互动点评与修改；',
            '4. 配合教学进程进行规范的板书设计（含升华对比范例）。'
        ],
        'goldenSlice': {
            'sliceRange': w['slice'],
            'sliceTitle': f"《{w_title}》核心技法突破与微练笔",
            'oneGain': w['gain'],
            'timingGuide': '情境审题1.5分钟 -> 技法点拨与范例对比3.0分钟 -> 现场微练笔2.5分钟 -> 展评升华2.0分钟 -> 小结作业1.0分钟',
            'examinerTip': '作文试讲最忌整节课念理论！必须有生动的例文对比，现场示范改动一个动词或细节，展现评改下水文功底。'
        },
        'speedPlan': {
            'courseType': '写作专题指导课',
            'objectives': {
                'knowledge': f"明确《{w_title}》的写作要领，掌握核心技法公式。",
                'process': '通过例文对比辨析与现场微片段练笔，体验由浅入深修改润色的全过程。',
                'emotional': '激发写作自信心，养成用心观察、真实表达的良好文风。'
            },
            'keyPoints': w['slice'],
            'difficulties': '将抽象的写作技法转化为具体的修改行动，在微练笔中写出富有表现力的句子。',
            'steps': [
                {'step': '一', 'name': '创设情境·审题导入', 'duration': '1.5分钟', 'coreAction': '以生活常见写作痛点导入，板书课题，明确本次写作专题。'},
                {'step': '二', 'name': '范例比照·技法切片', 'duration': '3.0分钟', 'coreAction': '出示平淡例文与精彩例文对比，归纳1~2个通俗易懂的写作公式。'},
                {'step': '三', 'name': '片段微写·随堂练笔', 'duration': '2.5分钟', 'coreAction': '布置80-120字现场片段微练笔，巡视观察并模拟指导。'},
                {'step': '四', 'name': '展示互评·改词升华', 'duration': '2.0分钟', 'coreAction': '模拟李同学发言，师生共同在黑板上进行换词修改与升华评议。'},
                {'step': '五', 'name': '小结口诀·布置大作', 'duration': '1.0分钟', 'coreAction': '总结写作口诀，布置课后扩写大作文作业，礼貌结课。'}
            ],
            'homework': '必做：将课堂上的微片段描写扩充为一篇600字左右的完整习作；选做：同桌互换用红笔圈画传神细节。'
        },
        'verbatimScript': {
            'importStage': {
                'teacherLines': f'“同学们好，请坐！许多同学写作文时常苦恼于‘提起笔来千言万语，落到纸上平淡如水’。今天这节作文专题课，我们一起来攻克《{w_title}》，学习如何用生动的笔触写出传神好文章！（板书课题：{w_title}）”',
                'actionNotes': '教态亲切鼓励，规范工整板书课题。'
            },
            'preliminaryReadStage': {
                'teacherLines': '“首先请大家看大屏幕上的这一组对比例文：左边是普通习作片段，右边是名家经典语段。请大家默读一分钟，思考：为什么右边的文字能让人如见其人、如临其境？”',
                'actionNotes': '手势引导大屏幕，观察学生阅读反馈。'
            },
            'deepDiveStage': {
                'title': f"《{w_title}》核心技法点拨与当堂练笔",
                'teacherQuestion': '“请前排李同学来分享一下，两段对比，你发现了什么秘密？”',
                'studentAnswer': '“老师，左边句子只写‘他很着急’，右边却把‘跺脚、擦汗、来回踱步’三个细节连起来写，特别具象生动！”',
                'teacherFeedback': '“李同学拥有一双敏锐的慧眼！（板书：慢动作分解 · 动词连缀）抽象的形容词往往苍白，而具象的动作却千钧有力。只要把一个动作拆解为三个连续小动作，画面就立刻鲜活起来。”',
                'deepenQuestion': '“现在轮到大家小试身手了！请拿出写作本，选择一个身边的生活场景，运用我们刚刚提炼的技法，限时2分钟，写一段80~120字的微描写。动笔开始！”',
                'readingGuidance': '“时间到。请前排张同学大声朗读你刚写完的精彩片段！全班同学边听边数一数他用了哪几个传神的动词。”'
            },
            'summaryAndHomeworkStage': {
                'summaryLines': f'“今天我们一起解锁了《{w_title}》的核心技法。好文章不仅要用心观察，更要运用妙法精准表达。（完善板书）”',
                'homeworkLines': '“课后请大家将今天的微片段扩写为一篇600字作文，并与同桌互批交流。下课，同学们再见！”'
            }
        },
        'blackboard': {
            'mainBoard': f"{w_title}\n┌───────────────────────────────┐\n│  【审题与立意】 抓准题眼 · 确立中心   │\n│  【核心技法】 细节分解 · 动词连缀    │\n│  【修改示范】 改前：笼统平淡           │\n│              改后：具象生动 · 以形传神│\n│  【写作素养】 用心观察 · 真情表达    │\n└───────────────────────────────┘",
            'subBoard': ['一课一得 · 慢动作分解法', '换词润色：推敲传神动词', '避免假大空，写真实细节'],
            'description': '清晰呈现技法提炼与例文修改对比'
        },
        'fullText': {
            'paragraphs': [
                {
                    'id': 1,
                    'content': f"【写作专题目标】：本专题聚焦《{w_title}》，旨在指导初中生突破写作中的常见短板，提升观察敏锐度与语言表达素养。",
                    'isHighlightedSlice': False
                },
                {
                    'id': 2,
                    'content': f"【核心技法阐释】：{w['focus']} 在写作过程中，要善于捕捉最富有特征的细节，通过细致的描摹与恰当的手法，将抽象的事理与情感具象化、可视化。",
                    'isHighlightedSlice': True
                },
                {
                    'id': 3,
                    'content': f"【例文对比与剖析】：\n【普通写法】：他站在讲台上，心里非常紧张，半天说不出话来。\n【精彩写法】：他两手紧紧攥着讲台边缘，指节泛白，嘴唇微微颤抖着，额角渗出一层细密的汗珠，喉结上下滚动了几次，才挤出一声微弱的呼喊。",
                    'isHighlightedSlice': True
                },
                {
                    'id': 4,
                    'content': "【微练笔任务提示】：请从生活经验中选取一个熟悉的场景（如：考场发卷前的一刻、体育课接力赛冲刺瞬间、冬日清晨母亲热牛奶的细节），运用所学技法写一段80~120字的动作或细节微片段。",
                    'isHighlightedSlice': False
                }
            ]
        }
    }
    all_lessons.append(w_obj)

print(f"Total lessons generated (including 12 writing topics): {len(all_lessons)}")

ts_content = f"""import {{ Lesson }} from '../types';

export const LESSONS_DATA: Lesson[] = {json.dumps(all_lessons, ensure_ascii=False, indent=2)};
"""

with open('src/data/lessonsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully generated pristine src/data/lessonsData.ts ({os.path.getsize('src/data/lessonsData.ts')} bytes)")
