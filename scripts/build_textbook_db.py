# -*- coding: utf-8 -*-
"""
Compiler script to assemble all grades into e:/workspace/teacher_learning/js/data/textbook-db.js
"""
import os
import sys
import json

from data_7 import get_grade_7a_units, get_grade_7b_units
from data_8 import get_grade_8a_units, get_grade_8b_units
from data_9 import get_grade_9a_units, get_grade_9b_units

base_dir = r"e:\workspace\teacher_learning"
out_dir = os.path.join(base_dir, "js", "data")
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "textbook-db.js")

def generate_default_teaching_design(lesson):
    title = lesson["title"]
    author = lesson.get("author", "佚名")
    genre = lesson.get("genre", "现代文")
    interview_focus = lesson.get("interviewKeyPoint", "")
    sample_focus = lesson.get("sampleFocus", "重点语段品析")
    main_content = lesson.get("mainContent", "")
    emotion = lesson.get("emotion", "")
    
    # 3D Targets
    if "文言" in genre:
        knowledge = f"积累重点文言实词、虚词与特殊句式，能够准确断句朗读并熟读成诵《{title}》。"
        process = f"通过‘读通-读懂-读美’三读法与小组合作探究，抓{sample_focus}，体会文言文简约传神的语言特点。"
        emotion_target = f"感悟古人{emotion or '的高尚情操与智慧'}，增强对中华优秀传统文化的认同与自豪。"
        lead_in = f"‘同学们，古人云“文以载道”。今天，让我们跨越千年的时空长河，走进{author}的名篇《{title}》，共同领略先贤的文采与风骨。（板书课题、作者）’"
        initial_read = f"‘请大家自由放声朗读课文，注意读准字音，划出停顿节奏。请第一大组开火车朗读，其余同学认真倾听。（指名读并纠正字音停顿）好，读得字正腔圆！请大家结合课下注释，小组同桌之间互相疏通文意。（板书重点文言字词）’"
        deep_dive = f"‘书读百遍，其义自见。请大家精读核心语段，围绕主问题展开探究：文中哪些词句最能体现{interview_focus}？请大家做圈点批注。4人小组交流！\n（走下讲台巡视指引）\n第3组小李同学找得非常敏锐……这个词用得传神，写出了……我们顺着小李的思考进一步追问……全班齐读这一句，读出文言气韵！’"
        summary = f"‘同学们，短短的一篇《{title}》，不仅留下了千古传诵的文辞，更彰显了古人的高风亮节。让我们带着这份敬意，合上课本，尝试全班背诵！’"
        homework = f"‘作业：1. 背诵并准确默写课文；2. 结合生活实际，写一段150字左右的文言读书心得。下课！（鞠躬致意）’"
    elif "诗" in genre or "词" in genre:
        knowledge = f"掌握《{title}》的韵律节奏与重音停连，理解诗歌字面意与意象内涵，背诵并默写全诗。"
        process = f"运用诵读品味法与意象还原法，聚焦{sample_focus}，体会情景交融与炼字艺术。"
        emotion_target = f"体会诗人{emotion or '的真挚情感'}，提高古典诗词审美情趣与人文素养。"
        lead_in = f"‘“诗缘情而绮靡”。古典诗词是中华文学宝库中的璀璨明珠。今天让我们伴着幽远琴声，走进{author}的《{title}》。（板书课题、作者）’"
        initial_read = f"‘请同学们听老师范读，注意划出重音与节拍。请全班齐读，要求声音洪亮、节奏整齐。（板书诗眼与核心意象）’"
        deep_dive = f"‘诗歌讲究炼字炼句，意在言外。请大家默读诗作，思考：诗中哪个字或哪一幅画面最能触动你的心弦？{interview_focus}。同桌交流，展开品析。\n（巡视倾听）课代表小王同学敏锐地抓住了这个词……运用了……手法，写出了……请大家带着这种情感，再次动情诵读！’"
        summary = f"‘言有尽而意无穷。全诗借景抒怀，情意绵长。让我们化身诗人，当堂熟读成诵！’"
        homework = f"‘作业：1. 准确默写全诗；2. 发挥想象，将诗中精美意象扩写为一篇200字优美写景散文。下课！（鞠躬）’"
    elif "说明" in genre:
        knowledge = f"明确说明对象《{title}》及其特征，掌握举例子、列数字、作比较等常见说明方法。"
        process = f"梳理文章条理清晰的说明顺序，品析限制性修饰词语，体会说明文语言的严谨准确与生动性。"
        emotion_target = f"感受科学求实精神与人类智慧创造，激发热爱科学、探索未知世界的兴趣。"
        lead_in = f"‘同学们，生活中处处有科学。今天我们跟随{author}的笔触，共同探究《{title}》的奥秘。（板书课题）’"
        initial_read = f"‘请大家快速默读全文，圈出文章的说明对象是什么？它具有怎样的核心特征？作者是按怎样的说明顺序展开介绍的？（学生回答后板书特征与顺序）’"
        deep_dive = f"‘说明文不仅要讲清楚事理，还要语言准确。请大家研读{sample_focus}，思考：这里运用了哪些说明方法？文中的修饰限定词能否删去？为什么？四人小组讨论！\n（点名回答）小张同学分析得非常透彻：“大约”表示推测估计，删去就变成了绝对断定，正体现了说明文语言的严密与客观！’"
        summary = f"‘通过本节课的学习，我们不仅掌握了说明方法与语言特点，更感受到了严谨求实的科学态度。’"
        homework = f"‘作业：运用今天学到的说明方法与准确语言，向大家介绍生活中的一个小物件（150字）。下课！（鞠躬）’"
    elif "议论" in genre or "演讲" in genre:
        knowledge = f"掌握生字词，找出文章中心论点与分论点，理清论述思路。"
        process = f"通过合作研讨，分析举例论证、道理论证、对比论证等方法，体会论证逻辑的严密性与说服力。"
        emotion_target = f"领悟{emotion or '作者的崇高思想与社会责任感'}，培养独立思考与批判性思辨能力。"
        lead_in = f"‘思想的力量是无穷的。今天，让我们聆听思想者的声音，共同研读{author}的《{title}》。（板书课题）’"
        initial_read = f"‘请同学们快速浏览课文，用双横线画出全文的中心论点，并梳理出作者是从哪几个方面展开论证的。（板书论点与论证思路）’"
        deep_dive = f"‘好的议论文既有深刻的观点，又有雄辩的论据。请大家研读{sample_focus}，思考：作者在这里运用了什么论据？采用了哪些论证方法？论证了什么观点？同桌交流讨论。\n（师生互动）小李同学找出了正反对比论证……使得论述更有说服力！’"
        summary = f"‘文以明理，行以践志。作者严密的论说逻辑不仅启迪我们的智慧，更指引我们的人生方向。’"
        homework = f"‘作业：结合课文核心论点，写一段200字微议论，谈谈你的现实思考。下课！（鞠躬）’"
    elif "小说" in genre or "戏剧" in genre:
        knowledge = f"梳理小说/剧本的情节脉络，把握典型环境描写与人物核心矛盾冲突。"
        process = f"抓住人物的外貌、动作、语言、心理细节，分析立体的人物形象，探究小说反映的社会现实主题。"
        emotion_target = f"领悟作者对{emotion or '人性与社会命运'}的深切关照，树立正确的价值观与同理心。"
        lead_in = f"‘文学是人学。在跌宕起伏的故事中，我们总能照见真实的人性。今天让我们走进{author}笔下的经典世界——《{title}》。（板书课题、作者）’"
        initial_read = f"‘请大家快速默读课文，理清故事的开端、发展、高潮和结局。故事主要围绕哪几个核心人物展开？（板书情节主线与人物关系）’"
        deep_dive = f"‘细节是小说的灵魂。请大家细读{sample_focus}，圈画出描写人物语言、动作、神态的精彩词句，在旁边做批注：这表现了人物怎样的内心活动与性格特征？4人小组讨论。\n（师生共探）小陈同学抓住了这个动作细节……演出了人物内心的矛盾挣扎……这正是社会环境压迫下的必然结果！’"
        summary = f"‘一次相遇，折射社会沧桑。作者以敏锐的眼光解剖人性，呼唤真善美的回归。’"
        homework = f"‘作业：选择文中的一个人物，为他/她写一段150字的心灵独白。下课！（鞠躬）’"
    else: # 散文等
        knowledge = f"积累生字词，梳理散文的叙事写景线索，理解文章核心内容。"
        process = f"抓住关键句段和富于表现力的动词、修辞，通过朗读品味法，体会以小见大、情景交融的写作手法。"
        emotion_target = f"体会作者字里行间流淌的{emotion or '深挚情感'}，培养发现生活之美与感恩关爱的心灵品性。"
        lead_in = f"‘生活中并不缺少美，而是缺少发现美的眼睛。今天让我们跟随大师{author}的步伐，共同翻开《{title}》。（板书课题、作者）’"
        initial_read = f"‘请同学们自由放声朗读课文，思考文章围绕什么线索展开？抒发了怎样的情感？（梳理脉络并板书）’"
        deep_dive = f"‘散文的美在于细腻传神的语言。请大家精读{sample_focus}，找出打动你的词句进行圈点批注，探讨：作者是如何表达真情实感的？\n（巡视点拨）小赵同学找到了这个精妙的比喻……全班带着这种温情齐读！’"
        summary = f"‘一草一木皆有情。作者用真挚的笔墨为我们展现了动人的画卷，愿我们也能在平凡生活中采撷诗意。’"
        homework = f"‘作业：摘抄文中的优美句子；观察生活中的一处平凡场景写一段细节描写。下课！（鞠躬）’"

    return {
        "targets": {
            "knowledge": knowledge,
            "process": process,
            "emotion": emotion_target
        },
        "keyPoint": f"抓住关键语句与核心细节，分析{sample_focus}的艺术表达手法。",
        "difficultPoint": f"理解文章的深层主旨与作者寄托的{emotion or '思想情感'}，学以致用迁移写作。",
        "teachingMethod": "朗读品析法、主问题导学法、圈点批注法、合作探究法",
        "flow10min": {
            "p1_leadIn": {
                "time": "0-1分钟",
                "name": "创设情境，激趣导入",
                "teacherScript": lead_in,
                "studentAction": "进入情境，明确本课课题与学习目标。",
                "purpose": "创设情境，集中学生课堂注意力，激发探究期待。"
            },
            "p2_initialRead": {
                "time": "1-3分钟",
                "name": "初读课文，整体感知",
                "teacherScript": initial_read,
                "studentAction": "朗读课文，圈点勾画生字词，理清文章基本脉络与核心要素。",
                "purpose": "落实朗读基本功，扫清文字障碍，从宏观上把握课文整体框架。"
            },
            "p3_deepDive": {
                "time": "3-8分钟",
                "name": f"精读品析，重点探究（聚焦{sample_focus}）",
                "teacherScript": deep_dive,
                "studentAction": "独立默读圈点批注，四人小组交流探讨，代表汇报发言，深入品味语言文字之美。",
                "purpose": "教资面试试讲核心拿分点：突出学生主体地位，体现以读促悟、抓词析句的特级教师风范。"
            },
            "p4_summary": {
                "time": "8-9分钟",
                "name": "拓展延展，课堂小结",
                "teacherScript": summary,
                "studentAction": "梳理板书脉络，领悟文本深层精神内涵，实现情感升华。",
                "purpose": "由文及人，归纳升华，落实立德树人与情感态度价值观目标。"
            },
            "p5_homework": {
                "time": "9-10分钟",
                "name": "分层作业，下课致谢",
                "teacherScript": homework,
                "studentAction": "记录分层作业，起立向老师道别。",
                "purpose": "体现分层评价导向，规范完成面试全流程礼仪。"
            }
        },
        "blackboardDesign": {
            "title": f"{title} · {author}",
            "left": f"【线索结构】\n  整体感知\n  层层推进\n  脉络清晰",
            "center": f"【精读研析】\n  {sample_focus}\n  细节捕捉 · 语言品鉴\n  修辞生动 · 动静相映",
            "right": f"【主旨升华】\n  {emotion or '精神丰碑 · 陶冶情操'}\n  文以载道"
        },
        "defensePrep": [
            {
                "question": f"请问你这节课的教学重点是什么？你是如何通过10分钟试讲突破重点的？",
                "answer": f"各位评委老师好。本节课的教学重点是引导学生品析{sample_focus}，掌握{genre}的鉴赏方法。在10分钟试讲中，我没有平均用力，而是把最核心的3-8分钟黄金时间留给重点段落。首先通过设计核心主问题引导学生自主默读并做圈点批注；其次组织四人小组合作交流，让学生在互动碰撞中加深理解；最后通过教师启发式追问与感情朗读点拨，使学生不仅理解了字面意思，更深入体会到了作者寄寓其中的深厚情感，切实落实了学生的主体地位。"
            },
            {
                "question": f"如果在这节课的探究环节，有学生回答出现了偏差，你会怎样处理？",
                "answer": f"评委老师好。课堂上的‘生成性错误’是极其宝贵的教学资源。面对学生的偏差，我绝不会简单粗暴地打断或否定，而是遵循‘赏识肯定+启发点拨’的原则：第一，首先肯定学生敢于举手、积极思考的勇气，保护学生的发言积极性；第二，引导学生再次回归文本，找到出现偏差的语句，抓住关键动词或上下文语境进行再推敲；第三，适时把问题抛给全班同学，通过同伴启发或教师搭梯子追问，引导该生自己发现并修正理解，在纠错中真正学会独立思考与阅读品析的方法。"
            }
        ]
    }

def main():
    books = [
        {
            "id": "7A",
            "name": "七年级上册",
            "pdf": "义务教育教科书·语文七年级上册.pdf",
            "theme": "初入初中·四季景物·亲情与生命·修身立德·人与动物·想象与寓言",
            "units": get_grade_7a_units()
        },
        {
            "id": "7B",
            "name": "七年级下册",
            "pdf": "义务教育教科书·语文七年级下册.pdf",
            "theme": "杰出人物·爱国情怀·平民凡人·传统美德·哲思感悟·科幻探险",
            "units": get_grade_7b_units()
        },
        {
            "id": "8A",
            "name": "八年级上册",
            "pdf": "义务教育教科书·语文八年级上册.pdf",
            "theme": "新闻活动·传记风采·山川之美·至爱亲情·建筑与科学·圣贤仁勇",
            "units": get_grade_8a_units()
        },
        {
            "id": "8B",
            "name": "八年级下册",
            "pdf": "义务教育教科书·语文八年级下册.pdf",
            "theme": "民俗风情·事理科学·经典诗文·演讲探究·天地游记·先秦思辨",
            "units": get_grade_8b_units()
        },
        {
            "id": "9A",
            "name": "九年级上册",
            "pdf": "义务教育教科书·语文九年级上册.pdf",
            "theme": "诗海探究·议论文风度·名胜登临·社会小说·立论与驳论·古典英雄",
            "units": get_grade_9a_units()
        },
        {
            "id": "9B",
            "name": "九年级下册",
            "pdf": "义务教育教科书·语文九年级下册.pdf",
            "theme": "家国浩气·中外小说·大义风骨·文艺鉴赏·戏剧天地·治国安邦",
            "units": get_grade_9b_units()
        }
    ]

    all_lessons = []
    
    for b in books:
        for u in b["units"]:
            for l in u["lessons"]:
                l["grade"] = b["id"]
                l["gradeName"] = b["name"]
                l["pdfFileName"] = b["pdf"]
                l["unitNumber"] = u["unit"]
                l["unitTheme"] = u["theme"]
                l["unitCoreLiteracy"] = u["coreLiteracy"]
                l["fullId"] = f"{b['id']}-u{u['unit']}-l{l['lessonNo']}"
                
                # Check if custom teachingDesign exists
                if "teachingDesign" not in l:
                    l["teachingDesign"] = generate_default_teaching_design(l)
                
                all_lessons.append(l)

    print(f"Total books: {len(books)}")
    print(f"Total lessons loaded: {len(all_lessons)}")

    # Construct the Javascript file
    js_content = "/**\n * PEP Junior High School Chinese Complete Curriculum Database\n"
    js_content += " * Automatically generated from verified textbook contents in e:/workspace/teacher_learning\n */\n\n"
    js_content += "window.TEXTBOOK_DB = {\n"
    js_content += f"  generatedAt: '{json.dumps(os.path.basename(out_file))}',\n"
    js_content += f"  totalLessons: {len(all_lessons)},\n"
    js_content += f"  books: {json.dumps(books, ensure_ascii=False, indent=2)},\n"
    js_content += f"  lessons: {json.dumps(all_lessons, ensure_ascii=False, indent=2)}\n"
    js_content += "};\n"

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Successfully generated {out_file} with size: {os.path.getsize(out_file)} bytes")

if __name__ == "__main__":
    main()
