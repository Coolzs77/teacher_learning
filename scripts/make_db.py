# -*- coding: utf-8 -*-
"""
High-fidelity curriculum database builder for PEP Junior High Chinese
"""
import sys
import os
import json

base_dir = r"e:\workspace\teacher_learning"
out_dir = os.path.join(base_dir, "js", "data")
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "textbook-db.js")

# We will define a structured function that returns full data for each grade
print("Writing build script...")
