# -*- coding: utf-8 -*-
"""
Database builder for 6 junior high Chinese textbooks.
Generates comprehensive curriculum database js/data/textbook-db.js
"""
import os
import json

out_dir = r"e:\workspace\teacher_learning\js\data"
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "textbook-db.js")
print("Target file:", out_file)
