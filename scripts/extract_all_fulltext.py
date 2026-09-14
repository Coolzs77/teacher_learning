# -*- coding: utf-8 -*-
import pypdf, sys, json, re, os

sys.stdout.reconfigure(encoding='utf-8')

# Import BOOKS from scripts/build_full_database.py
with open('scripts/build_full_database.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Execute up to BOOKS definition
local_vars = {}
exec(code, local_vars)
BOOKS = local_vars['BOOKS']

# Test PDF loading
for b in BOOKS:
    pdf_file = b['file']
    reader = pypdf.PdfReader(pdf_file)
    print(f"Book {b['name']}: {len(reader.pages)} PDF pages")
    
    # Collect all lessons
    flat_lessons = []
    for u in b['units']:
        for l in u['lessons']:
            flat_lessons.append({
                'title': l[0],
                'author': l[1],
                'genre': l[2],
                'star': l[3],
                'start_page': l[4],
                'page_cnt': l[5],
                'unit': u['unit']
            })
            
    # Calculate exact page span
    for i in range(len(flat_lessons)):
        curr = flat_lessons[i]
        start_p = curr['start_page']
        if i + 1 < len(flat_lessons):
            next_p = flat_lessons[i+1]['start_page']
            # If next_p is greater than start_p, end page is next_p - 1
            if next_p > start_p:
                end_p = next_p - 1
            else:
                end_p = start_p + curr['page_cnt'] - 1
        else:
            end_p = start_p + curr['page_cnt'] - 1
        curr['end_page'] = max(start_p, end_p)

    print(f"  Total lessons in {b['name']}: {len(flat_lessons)}")
    for l in flat_lessons[:3]:
        print(f"    - {l['title']}: p.{l['start_page']}~{l['end_page']} (PDF: {l['start_page']+b['offset']}~{l['end_page']+b['offset']})")
