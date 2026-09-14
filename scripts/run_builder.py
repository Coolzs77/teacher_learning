# -*- coding: utf-8 -*-
"""
Full Database Builder for Junior High Chinese Teacher Qualification Interview
Generates src/data/lessonsData.ts containing all 146 lessons across 6 volumes.
"""
import sys, json, os, re, pypdf

sys.stdout.reconfigure(encoding='utf-8')

# Import our previously defined data
from dump_toc import * if os.path.exists('dump_toc.py') else None

# Let's import BOOKS list and DETAILED_LESSONS
exec(open('scripts/build_full_database.py', 'r', encoding='utf-8').read())
