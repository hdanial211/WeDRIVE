---
name: context7
description: Retrieve live, version-specific library documentation, modern API patterns, and code examples via Context7 MCP to eliminate hallucinations and outdated code.
---

# Context7 Live Documentation & API Skill

This skill guides the agent to query real-time, version-specific documentation using Context7 MCP or `ctx7` before writing code for external libraries.

---

## 1. When to Use Context7

Always invoke Context7 when:
- Working with third-party libraries (e.g. `@supabase/supabase-js`, `flatpickr`, `@playwright/test`, `animejs`).
- Implementing newly released features, SDK updates, or cloud configurations.
- Resolving unexpected deprecation errors or verifying modern parameter schemas.

---

## 2. Best Practices

1. **Specify Exact Library & Topic**:
   - Query format: `library_name topic_or_function` (e.g. `supabase js auth signUp`, `flatpickr minDate range plugin`, `playwright locator assert`).
2. **Version Pinning**:
   - Cross-check with package versions in the repository to fetch the exact documentation for that release.
3. **Zero Deprecated Syntax**:
   - Replace outdated callback patterns with modern Promise/Async-Await methods as recommended by Context7 live specs.
