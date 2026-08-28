---
trigger: always_on
---

# Playwright Automated Testing Standard (WeDRIVE)

## 1. Directory Structure & Isolation

All automated tests and dependencies MUST be strictly isolated inside the `tests/` folder:

```text
tests/
├── e2e/
│   ├── 01_auth.spec.js           # Login & form validation
│   ├── 02_theme_and_lang.spec.js  # Theme (Day/Night/System) & Language (EN/MS)
│   ├── 03_about_corporate.spec.js# Corporate branding, guarantees, AI trigger
│   └── 04_pricing_glider.spec.js # Segmented control apple slider
├── package.json                  # Isolated npm scripts & dependencies
├── package-lock.json
├── playwright.config.js          # Browser & base URL config
└── node_modules/                 # Local test packages (git-ignored)
```

## 2. Mandatory Test Execution Protocol

After completing any development feature, page update, bug fix, or UI refactoring:
1. Run automated test suite:
   ```bash
   cd tests && npx playwright test
   ```
2. Verify all tests pass (100% pass rate).
3. If any test fails, diagnose whether it is an intentional UI change or a regression:
   - If regression: fix the application code immediately.
   - If intentional UI update: update the test spec locator/assertion accordingly.

## 3. Best Practices for WeDRIVE Test Suites

- **Single Tab & Stable Context**: Do not open unnecessary tabs or spam popups.
- **Login Testing**: Use existing credentials and click sign-in directly (never create duplicate signups).
- **Selectors**: Prefer semantic attributes (`[data-key]`, `id`, `.class`) and avoid brittle XPath selectors.
- **Apple HIG Animations**: Ensure `waitForTimeout` or locator wait handles fluid CSS transition timings (typically ~300ms - 500ms).
