import pypdf
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/lessons_clean.json', 'r', encoding='utf-8') as f:
    lessons = json.load(f)

by_book = {}
for l in lessons:
    by_book.setdefault(l['pdfFileName'], []).append(l)

results = {}

for pdf, l_list in by_book.items():
    l_list.sort(key=lambda x: x['page'])
    print(f"Processing {pdf} ({len(l_list)} lessons)...")
    try:
        reader = pypdf.PdfReader(pdf)
    except Exception as e:
        print(f"Error opening {pdf}: {e}")
        continue
    total_pages = len(reader.pages)

    for i in range(len(l_list)):
        cur = l_list[i]
        start_book_page = cur['page']
        if i + 1 < len(l_list):
            next_start = l_list[i+1]['page']
            if next_start <= start_book_page:
                end_book_page = start_book_page + 3
            elif next_start - start_book_page > 8:
                end_book_page = start_book_page + 6
            else:
                end_book_page = next_start
        else:
            end_book_page = min(start_book_page + 5, total_pages - 6)

        # PDF page index (0-based)
        start_pdf_idx = max(0, start_book_page + 6)
        end_pdf_idx = min(total_pages, end_book_page + 6)

        pages_text = []
        for p_idx in range(start_pdf_idx, end_pdf_idx):
            p_text = reader.pages[p_idx].extract_text() or ""
            # Clean common textbook headers
            lines = p_text.splitlines()
            cleaned_lines = []
            for line in lines:
                s = line.strip()
                if not s:
                    continue
                # Skip header like '4 阅 读 第一单元'
                if re.match(r'^\d+\s+(阅\s*读|活动·探究)\s+', s):
                    continue
                cleaned_lines.append(s)
            pages_text.append("\n".join(cleaned_lines))

        full_raw_text = "\n\n".join(pages_text).strip()
        
        # Split into paragraphs
        paras = []
        raw_paras = [p.strip() for p in full_raw_text.split("\n\n") if p.strip()]
        for p_idx, p_text in enumerate(raw_paras):
            is_core = False
            # Check if this paragraph contains sample focus keywords or key text
            if cur.get('sampleFocus') and any(w in p_text for w in cur['sampleFocus'].split('，') if len(w) > 1):
                is_core = True
            
            paras.append({
                "id": p_idx + 1,
                "text": p_text,
                "highlight": is_core
            })

        results[cur['fullId']] = {
            "title": cur['title'],
            "author": cur['author'],
            "grade": cur['gradeName'],
            "bookPage": start_book_page,
            "pdfPage": start_book_page + 7,
            "pdfFileName": pdf,
            "paragraphs": paras,
            "rawText": full_raw_text,
            "teachingFocusClip": cur.get('sampleFocus') or cur.get('interviewKeyPoint') or ""
        }

print(f"Total processed lessons: {len(results)}")

# Write to js/data/lesson-texts-db.js
js_content = "/**\n * PEP Junior High School Chinese Complete 146 Lessons Authentic Texts Database\n * Extracted directly from official PEP textbooks (PDF pages and paragraphs)\n */\n\nwindow.LESSON_TEXTS_DB = " + json.dumps(results, ensure_ascii=False, indent=2) + ";\n"

with open('js/data/lesson-texts-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Successfully written js/data/lesson-texts-db.js!")
