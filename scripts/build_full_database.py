# -*- coding: utf-8 -*-
"""
Full Comprehensive Database Builder for Junior High Chinese Teacher Interview Preparation
Covers all 6 PEP textbooks: 7A, 7B, 8A, 8B, 9A, 9B.
Generates e:/workspace/teacher_learning/js/data/textbook-db.js
"""
import json
import os
import sys

base_dir = r"e:\workspace\teacher_learning"
out_file = os.path.join(base_dir, "js", "data", "textbook-db.js")
print("Target file:", out_file)
