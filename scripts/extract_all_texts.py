# -*- coding: utf-8 -*-
"""
Test full text extraction across all 6 textbooks
"""
import pypdf, sys, json, re, os

sys.stdout.reconfigure(encoding='utf-8')

# Read make_database.py to get BOOKS
with open('scripts/make_database.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Execute up to BOOKS
namespace = {}
# Only take BOOKS definition part
books_code = code[:code.find('DETAILED_MAP =')]
exec(books_code, namespace)
BOOKS = namespace['BOOKS']

def clean_lesson_text(pdf_reader, start_pdf_page, end_pdf_page, lesson_title):
    paragraphs = []
    current_para = ""
    in_notes = False
    in_exercises = False

    exercise_paras = []
    note_paras = []

    for p in range(start_pdf_page - 1, min(end_pdf_page, len(pdf_reader.pages))):
        page_text = pdf_reader.pages[p].extract_text() or ''
        lines = page_text.split('\n')
        
        for raw_line in lines:
            line = raw_line.strip()
            if not line:
                continue
            # Filter noise / header / footer lines
            if re.match(r'^\d+$', line): # pure page number
                continue
            if '义务教育教科书' in line or '人 民 教 育 出 版 社' in line or '~ß  rH' in line:
                continue
            if line in ['阅读', '目 录', '目  录', '第一单元', '第二单元', '第三单元', '第四单元', '第五单元', '第六单元', '活动·探究', '任务一', '任务二', '任务三']:
                continue
            if re.match(r'^[I|V|X]+\s*目\s*录', line):
                continue
            
            # Check for footnotes
            if re.match(r'^[①②③④⑤⑥⑦⑧⑨⑩]', line) or line.startswith('〔') or line.startswith('a '):
                note_paras.append(line)
                continue

            # Check for exercise start
            if '思考探究' in line or '积累拓展' in line or '研讨与练习' in line or '阅读提示' in line:
                in_exercises = True
                if current_para:
                    paragraphs.append(current_para)
                    current_para = ""
                exercise_paras.append(line)
                continue

            if in_exercises:
                exercise_paras.append(line)
                continue

            # Regular text lines
            # Check if this line looks like a paragraph start (e.g. starts with indent or dialogue quote)
            # In PDF text extraction, lines within a paragraph are separated by newline.
            # If current_para is long and previous line ended with period/question/exclamation, start new para
            if current_para:
                last_char = current_para[-1]
                if last_char in ['。', '！', '？', '”', '…', '：'] and (raw_line.startswith('  ') or raw_line.startswith('\u2003') or raw_line.startswith('\u3000') or len(current_para) > 100):
                    paragraphs.append(current_para)
                    current_para = line
                else:
                    current_para += line
            else:
                current_para = line

    if current_para:
        paragraphs.append(current_para)

    # Clean paragraphs
    final_paras = []
    for p in paragraphs:
        p_clean = p.strip()
        if len(p_clean) >= 2:
            final_paras.append(p_clean)

    # Append exercise section if exists
    if exercise_paras:
        ex_text = ' '.join(exercise_paras)
        if len(ex_text) > 15:
            final_paras.append(f"【课后思考探究与研讨】：{ex_text[:350]}...")

    # Append footnotes if exists
    if note_paras:
        nt_text = ' ； '.join(note_paras[:5])
        if len(nt_text) > 10:
            final_paras.append(f"【课下注释摘录】：{nt_text}")

    return final_paras

# Test extraction for first book
b = BOOKS[0]
reader = pypdf.PdfReader(b['file'])
print("Testing extraction on Book 1...")
all_l = []
for u in b['units']:
    for l in u['lessons']:
        all_l.append(l)

for i in range(min(5, len(all_l))):
    l = all_l[i]
    title = l[0]
    start_p = l[4] + b['offset']
    next_p = all_l[i+1][4] + b['offset'] if i+1 < len(all_l) else (start_p + l[5])
    end_p = next_p - 1 if next_p > start_p else (start_p + l[5] - 1)
    paras = clean_lesson_text(reader, start_p, end_p, title)
    print(f"Lesson: {title}, Pages: {start_p}~{end_p}, Paragraphs count: {len(paras)}, Total chars: {sum(len(p) for p in paras)}")
    print(f"  First para: {paras[0][:60]}...")
    print(f"  Last para: {paras[-1][:60]}...")
