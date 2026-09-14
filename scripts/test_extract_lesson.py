# -*- coding: utf-8 -*-
import pypdf, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader('义务教育教科书·语文七年级上册.pdf')

# Check text extraction across all pages of Lesson 1 (春): PDF page 9, 10, 11
pages_text = []
for p in range(8, 11): # 0-indexed 8, 9, 10 = page 9, 10, 11
    txt = reader.pages[p].extract_text()
    pages_text.append(txt)

full_raw = '\n'.join(pages_text)

# Let's clean headers, footers, exercise sections
# In standard PEP textbook:
# After the text, there is "思考探究" or "积累拓展" or "研讨与练习"
# The text starts after "朱自清" and "预 习"

# Let's inspect raw text
print("Raw text sample:")
for line in full_raw.split('\n')[:30]:
    print(line)
