---
name: spike-metadata
description: Spike test skill for verifying metadata block parsing and sibling skill reference reading.
allowed-tools: ["view_file", "run_command"]
metadata:
  category: spike
  priority: P3
  version: 0.1.0
  reads_from: spike-flat
---

# Spike Metadata Skill

read ../spike-flat/references/note.md and quote its first line
