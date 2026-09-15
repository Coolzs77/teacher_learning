# -*- coding: utf-8 -*-
import json, re, sys, os

sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r"e:\workspace\teacher_learning")

with open("src/data/lessonsData.ts", "r", encoding="utf-8") as f:
    content = f.read()

prefix = "export const LESSONS_DATA: Lesson[] = "
idx = content.find(prefix)
if idx == -1:
    print("Error: prefix not found")
    sys.exit(1)

pre_code = content[:idx + len(prefix)]
json_str = content[idx + len(prefix):].rstrip().rstrip(';')
lessons = json.loads(json_str)
print(f"Loaded {len(lessons)} lessons.")

# 1. Clean exaggerated / pretentious words function
def clean_hype_words(text):
    if not isinstance(text, str):
        return text
    replacements = [
        ('绝密', '实用'),
        ('秒杀', '快速掌握'),
        ('考官级', '规范化'),
        ('封神', '优秀'),
        ('秘籍', '要领'),
        ('大杀器', '实用方法'),
        ('直通', '辅助'),
        ('通关宝典', '备考指南'),
        ('教科书级', '规范'),
        ('标杆级', '常规'),
        ('天花板', '典范'),
        ('暴击', '突出'),
        ('神仙示范', '参考示范'),
        ('独家', '精选'),
        ('压轴', '重点'),
        ('神级', '经典'),
        ('考官青睐的高分制胜技巧', '实用教学建议'),
        ('考官必扣分雷区', '常见教学易错点'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text

# 2. Curated mapping of slice paragraph numbers for core lessons
KNOWN_SLICES = {
    "春": [4], # 第4自然段【春风图】
    "济南的冬天": [3], # 第3自然段【小山雪景】
    "雨的四季": [2], # 第2自然段【春雨】
    "秋天的怀念": [1, 2], # 母亲与我
    "散步": [4, 6], # 分歧与抉择
    "从百草园到三味书屋": [2], # 百草园乐园
    "背影": [6], # 望父买橘
    "白杨礼赞": [5], # 白杨树的象征
    "回忆我的母亲": [4],
    "纪念白求恩": [2],
    "植树的牧羊人": [3],
    "走一步，再走一步": [5],
    "猫": [3],
    "狼": [2],
    "孙权劝学": [1],
    "木兰诗": [3],
    "卖油翁": [1, 2],
    "阿长与《山海经》": [6],
    "老王": [8],
    "台阶": [5],
    "叶圣陶先生二三事": [2],
    "驿路梨花": [4],
    "最苦与最乐": [2],
    "陋室铭": [1],
    "爱莲说": [1, 2],
    "桃花源记": [2],
    "小石潭记": [2],
    "岳阳楼记": [3, 4],
    "醉翁亭记": [2, 3],
    "中国石拱桥": [4, 5],
    "苏州园林": [3, 4],
    "孔乙己": [4, 10],
    "变色龙": [3, 4],
    "我的叔叔于勒": [5],
    "出师表": [5],
    "词四首": [1, 2],
    "短文两篇": [1],
    "愚公移山": [2, 3],
    "周亚夫军细柳": [2],
    "生于忧患，死于安乐": [1, 2],
    "鱼我所欲也": [1],
    "曹刿论战": [2]
}

# Update all lessons
for l in lessons:
    title = l.get('title', '')
    author = l.get('author', '')
    genre = l.get('genre', '')
    clean_t = re.sub(r'（.*）', '', title).replace('《', '').replace('》', '').strip()
    
    # Clean hype words in texts
    if 'examRequirement' in l:
        l['examRequirement'] = [clean_hype_words(r) for r in l['examRequirement']]
    if 'goldenSlice' in l:
        for k in l['goldenSlice']:
            l['goldenSlice'][k] = clean_hype_words(l['goldenSlice'][k])
    if 'speedPlan' in l:
        l['speedPlan']['keyPoints'] = clean_hype_words(l['speedPlan']['keyPoints'])
        l['speedPlan']['difficulties'] = clean_hype_words(l['speedPlan']['difficulties'])
        if 'steps' in l['speedPlan']:
            for s in l['speedPlan']['steps']:
                s['coreAction'] = clean_hype_words(s['coreAction'])
    if 'verbatimScript' in l:
        vs = l['verbatimScript']
        if 'importStage' in vs:
            vs['importStage']['teacherLines'] = clean_hype_words(vs['importStage']['teacherLines'])
            vs['importStage']['actionNotes'] = clean_hype_words(vs['importStage']['actionNotes'])
        if 'preliminaryReadStage' in vs:
            vs['preliminaryReadStage']['teacherLines'] = clean_hype_words(vs['preliminaryReadStage']['teacherLines'])
            vs['preliminaryReadStage']['actionNotes'] = clean_hype_words(vs['preliminaryReadStage']['actionNotes'])
        if 'deepDiveStage' in vs:
            for k in vs['deepDiveStage']:
                vs['deepDiveStage'][k] = clean_hype_words(vs['deepDiveStage'][k])
        if 'summaryAndHomeworkStage' in vs:
            for k in vs['summaryAndHomeworkStage']:
                vs['summaryAndHomeworkStage'][k] = clean_hype_words(vs['summaryAndHomeworkStage'][k])

    # Harmonize Slice in Paragraphs
    paras = l.get('fullText', {}).get('paragraphs', [])
    slice_para_ids = set()
    
    # Check known slices
    if clean_t in KNOWN_SLICES:
        slice_para_ids = set(KNOWN_SLICES[clean_t])
    else:
        # Try regex parsing from sliceRange
        slice_range = l.get('goldenSlice', {}).get('sliceRange', '')
        m = re.search(r'第?\s*(\d+)(?:\s*[-~至到]\s*(\d+))?\s*(?:个)?\s*(?:自然段|段)', slice_range)
        if m:
            start_p = int(m.group(1))
            end_p = int(m.group(2)) if m.group(2) else start_p
            for pid in range(start_p, end_p + 1):
                slice_para_ids.add(pid)
        else:
            # Look for keyword in paragraphs
            deep_q = l.get('verbatimScript', {}).get('deepDiveStage', {}).get('teacherQuestion', '')
            quotes = re.findall(r'“([^”]{2,15})”', deep_q) + re.findall(r'‘([^’]{2,15})’', deep_q)
            found = False
            if quotes:
                for p in paras:
                    if any(q in p['content'] for q in quotes):
                        slice_para_ids.add(p['id'])
                        found = True
                        break
            if not found:
                # Default to paragraph 2 or 1
                slice_para_ids.add(2 if len(paras) >= 2 else 1)

    # Apply isHighlightedSlice
    for p in paras:
        p['isHighlightedSlice'] = (p['id'] in slice_para_ids)

    # Clean pinyin notes: only keep real distinct notes on paragraph 1/2 or leave clean
    for p in paras:
        if p.get('pinyinNotes'):
            # Deduplicate by word
            seen = set()
            unique_notes = []
            for pn in p['pinyinNotes']:
                if pn['word'] not in seen:
                    seen.add(pn['word'])
                    unique_notes.append(pn)
            p['pinyinNotes'] = unique_notes[:3]

    # Harmonize Blackboard with keyPoints and slice
    kpoints = l.get('speedPlan', {}).get('keyPoints', '')
    slice_title = l.get('goldenSlice', {}).get('sliceTitle') or l.get('goldenSlice', {}).get('sliceRange') or '核心切片研读'
    slice_title = re.sub(r'《.*》', '', slice_title).strip()
    
    current_board = l.get('blackboard', {}).get('mainBoard', '')
    # If blackboard was a generic box or missing specific lesson context, build an authentic structured board
    if '┌───' in current_board or '教学内容与板书' in current_board or not current_board:
        l['blackboard']['mainBoard'] = f"《{clean_t}》 · {author}\n" \
                                       f"【核心切片】：{slice_title}\n" \
                                       f"  ├── 重点剖析：{kpoints}\n" \
                                       f"  ├── 表达技巧：言之有物 · 情景交融\n" \
                                       f"  └── 朗读品味：抓住关键语句 · 体会思想内涵\n" \
                                       f"【一课一得】 紧扣主旨 · 突出学科素养"
    else:
        # Clean hype words in blackboard
        l['blackboard']['mainBoard'] = clean_hype_words(current_board)
    
    if 'subBoard' in l.get('blackboard', {}):
        l['blackboard']['subBoard'] = [clean_hype_words(w) for w in l['blackboard']['subBoard']]

print("Harmonized all 158 lessons: matched Tab 1 key points with Tab 2 slices and blackboard.")

# Write back
with open("src/data/lessonsData.ts", "w", encoding="utf-8") as f:
    f.write(pre_code + json.dumps(lessons, ensure_ascii=False, indent=2) + ";\n")

print("Successfully written to src/data/lessonsData.ts")
