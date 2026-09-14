import sys, pypdf, glob, json, re

sys.stdout.reconfigure(encoding='utf-8')

books = [
    ('7s', '七年级上册', '义务教育教科书·语文七年级上册.pdf'),
    ('7x', '七年级下册', '义务教育教科书·语文七年级下册.pdf'),
    ('8s', '八年级上册', '义务教育教科书·语文八年级上册.pdf'),
    ('8x', '八年级下册', '义务教育教科书·语文八年级下册.pdf'),
    ('9s', '九年级上册', '义务教育教科书·语文九年级上册.pdf'),
    ('9x', '九年级下册', '义务教育教科书·语文九年级下册.pdf')
]

for bid, bname, fname in books:
    reader = pypdf.PdfReader(fname)
    print(f"\n==================== {bname} ({len(reader.pages)} pages) ====================")
    for p in range(3, 7):
        if p < len(reader.pages):
            text = reader.pages[p].extract_text()
            if text:
                print(f"--- Page {p+1} ---")
                for line in text.split('\n'):
                    line = line.strip()
                    if line:
                        print(line)
