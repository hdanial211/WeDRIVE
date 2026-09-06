---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify & Token Optimization Rule

This project has a persistent Graphify knowledge graph at `graphify-out/`.

### Mandatory Guidelines:
1. **Never read whole folders or scan codebase files recursively:** In every new tab or conversation session, do NOT use bulk file reading or explore directories blindly. This wastes context tokens.
2. **Use Graphify MCP First:** Always use `graphify` MCP tools (`query_graph`, `get_node`, `get_neighbors`, `shortest_path`) or inspect `graphify-out/graph.json` / `graphify-out/GRAPH_TREE.html` to locate the exact symbol, component, or file.
3. **Targeted Reading Only:** Only read the specific 1-2 lines or target files that need modifications.
4. **Update after Code Changes:** After modifying code files, run `graphify update .` to keep the knowledge graph current without consuming AI API tokens.
