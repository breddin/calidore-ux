---
id: port-html-prototype-to-react
title: Port v3_1 prototype look-and-feel into Vite/JS source
priority: P1
status: active
completion: 75
last_touched: 2026-04-30
paths:
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/src/style.css
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/src/dashboard.js
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/src/modal.js
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/src/charts.js
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/src/data.js
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/src/_v3_1-port-notes.md
  - /Volumes/BReddinDocuments/DocumentsHDD/Development/calidore/calidore-ux/index.html
---

# Port v3_1 prototype to Vite/JS source

The Calidore functional team prototyped look-and-feel modifications to
the OpsCommand dashboard's default screen using Claude. The prototype
file is `logistics-dashboard-v3_1.html` at the repo root. The job is
to merge those visual changes into the existing Vite + vanilla JS
source so the next deploy renders the new design.

## Stack reality

This is NOT a React app. The repo is:
- Vite as bundler/dev-server (`package.json` confirms — only `vite`
  as dep, no React)
- `index.html` as the entry point
- `src/*.js` modules: `main.js`, `dashboard.js`, `charts.js`,
  `data.js`, `modal.js`, `agent.js`
- `src/style.css` for styling
- `lambda/` directory for backend (Amplify-deployed Lambda functions —
  OUT OF SCOPE for this PULSE)

Implementation will be HTML/JS/CSS edits, not component refactoring.

## Prototype canon

There are multiple prototype iterations at the repo root:
- `logistics-dashboard-ai.html` — earlier iteration, reference only
- `logistics-dashboard-v3.html` — earlier iteration, reference only
- `logistics-dashboard-v3_1.html` — **canonical, use this as the spec**

Diff between v3 and v3_1 may reveal what the functional team's most
recent thinking was. Optional reference material; don't get lost there.

## Last Stop

Functional team delivered `logistics-dashboard-v3_1.html` as the
canonical design spec. PULSE bootstrapped, focus set, framework
verified. No source-side changes started yet. Current production at
https://main.d3iss5fysy55r.amplifyapp.com still reflects the pre-v3_1
design.

## Next Actions

1. Read `logistics-dashboard-v3_1.html` end-to-end. Identify the
   design's overall structure: which dashboard sections it covers,
   what visual language it uses (typography, spacing, color palette,
   layout patterns).
2. Survey `src/` and `index.html`: where does each dashboard section
   render in the source? Map prototype sections to source files.
3. Produce a delta inventory. For each section, list the visual
   changes needed: typography, spacing, color, layout, content
   additions/removals. Capture in a notes file under `src/`
   (e.g., `src/_v3_1-port-notes.md`) since the prototype HTML is
   read-only.
4. Flag prototype ambiguities — places where the HTML is unclear,
   contradictory, or makes design decisions you can't confidently
   translate to source code.
5. **Pause for review.** Don't start implementing until the delta
   inventory is reviewed and signed off.
6. After review: implement changes section-by-section. The HTML
   prototype is the design contract; do not edit it.
7. Verify locally with `npm run dev` that rendered output matches the
   prototype for each touched section.
8. Push to Amplify; verify the deployed URL matches.
9. Move `logistics-dashboard-v3_1.html` (and earlier iterations) to
   `docs/design/` to clear the repo root.

## What Finishing Looks Like

- Visual diff between `logistics-dashboard-v3_1.html` (rendered) and
  the deployed Amplify URL shows no meaningful differences (modulo
  live data values).
- No regression in unaffected sections.
- All prototype iterations archived to `docs/design/`, not deleted.
- A PR description summarizing what changed, what was intentionally
  not changed, and any prototype-spec ambiguities resolved.
- Functional team signs off on deployed result vs. their prototype.

## Boundary notes

- `lambda/` is OUT OF SCOPE — backend functions, separate concern.
  Focus-lock won't include it.
- `node_modules/` is OUT OF SCOPE for obvious reasons.
- The three `logistics-dashboard-*.html` files at the repo root are
  read-only design references, NOT source to edit.

## Notes

- The current deployed app is OpsCommand — AI Logistics Intelligence,
  with sections including Performance Dashboard, Financial Overview,
  Asset Operations, Division Scorecard, Tech Stack & Integrations,
  Maintenance Queue, Load Channel Performance, Trend Analysis, Issues,
  Recommended Actions, plus an OpsAI Cortex agent panel.
- The prototype likely targets a subset of these sections, not all.
  Scope emerges from the delta inventory in step 1.
- macOS quarantine attribute (`@` in `ls -la`) on the prototype HTML
  may prevent reads. If so, run `xattr -c
  logistics-dashboard-v3_1.html` to clear.
