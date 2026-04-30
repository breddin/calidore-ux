# v3_1 Port — Delta Inventory

Comparison of the canonical functional-team prototype `logistics-dashboard-v3_1.html`
(read-only, repo root) against the live Vite source under `src/` + `index.html`.
Step 3 artifact for the `port-html-prototype-to-react` PULSE; pause for review
before any code edits.

## Implementation rules

- **AI features are preserved in their entirety.** The Intelligence sidebar nav group, AI Advisor topbar button, OpsAI Cortex agent panel, and AI-themed CTAs (`→ Ask AI Advisor`, `→ Ask Ops AI`, `→ Fleet AI Analysis`, `→ Rate AI`, `→ Ask Fleet/Rate/Ops AI`) on Tech Stack / Maintenance / Trends / Recommended Actions cards are engineering additions outside the functional team's scope; the AI overlay is canonical and the prototype's structure must accommodate it, not the other way around.

## Open questions

1. **Recommended Actions body copy.** The prototype's body text is more substantive than source ("for 1 maintenance person", "and move to 22% target", "without adding dispatchers or headcount"). Source trimmed those phrases when adding the AI CTA. Should the port restore the prototype's fuller body copy *and* keep the AI CTA span, or accept source's trimmed copy as the AI-overlay's prerogative? Calling this a copy delta vs. an AI-feature interaction. Default recommendation: restore prototype copy, keep CTA — the trim was incidental, not deliberate.
2. **Trends · Revenue & Margin card-action.** Prototype shows `Full report →` (no handler). Source replaced it with `→ Rate AI` AI CTA. Strictly applying the AI-preservation rule favors source. Confirm: is `Full report →` a real future entry point the functional team wants visible alongside the AI CTA, or is it placeholder text the AI CTA correctly supersedes? Default recommendation: drop `Full report →` (treat AI CTA as canonical).
3. **Sidebar warn-KPI text color.** Prototype uses `#f59e0b` (amber-500) for `.sb-kpi-val.warn` text while keeping the bar fill at `#fbbf24` (amber-400) — a deliberate two-tone treatment. Source collapses both to `#fbbf24`, making text and bar identical. Restore the two-tone (revert text to `#f59e0b`)? Default recommendation: yes, follow prototype.

## Architecture finding (carried over from step 2)

- Source-side classes/structure already mirror the prototype 1:1 — port is mechanical (markup edits + targeted CSS tweaks), not a rebuild.
- All design-token color values defined in `src/style.css:4–24` match prototype literals exactly. The variable indirection is purely notational; no visual deltas come from `var(--...)` substitution.
- `src/agent.js` and `src/main.js` were not surveyed for visible content — they drive AI features only and have no prototype counterpart. **Recommend excluding from edit territory** in the post-step-3 PULSE update.
- Charts (`src/charts.js`) data and styling match prototype byte-for-byte (legend colors, dataset values, doughnut cutout 68%). No deltas.
- Modal (`src/modal.js`) HTML shell + dynamic-render template strings match prototype byte-for-byte. No deltas.

---

## Section 0: Shell · Sidebar

**Source files**: `index.html:14–87`, `src/style.css:45–67`

**Deltas**:
1. `.sb-kpi-val.warn` color `#fbbf24` → `#f59e0b` to match prototype's deliberate two-tone (text amber-500, bar amber-400). — color *(see open question #3)*
2. None other. The `Intelligence` nav group + `Fleet AI / Rate AI / Ops AI` links are AI additions, preserved.

**Inline-style hotspots**: 3 × `<div class="sb-bar-fill" style="width:NN%;background:#XXX">` lines (68%/`#f87171`, 84%/`#fbbf24`, 70%/`#fbbf24`) — values match prototype, leave inline.

**AI-feature interactions**: Intelligence nav group + 3 AI links append after the Operations group; no structural change to KPI block below.

**Effort**: S — one CSS line, pending open question #3.

---

## Section 0: Shell · Topbar

**Source files**: `index.html:90–117`, `src/style.css:68–87`

**Deltas**:
1. None. `.tb-title`, `.tb-tabs`, `.tb-badge`, `.tb-sel`, `.tb-clock` all visually identical.

**Inline-style hotspots**: None in topbar markup.

**AI-feature interactions**: `<button class="ai-btn">AI Advisor</button>` between selects and clock — preserved. `.ai-btn` rules in `style.css:84–86` (gradient, IBM Plex Mono, glow on hover) are AI styling, untouched.

**Effort**: S — zero deltas. Verify pass only.

---

## Section 1: Alert bar

**Source files**: `index.html:124–130`, `src/style.css:92–98`

**Deltas**:
1. None. Border, pulse animation, title, body text all match.

**Inline-style hotspots**: One inline `style="color:#1a4fd8;font-weight:600;cursor:pointer"` on the AI CTA span — AI overlay, leave inline.

**AI-feature interactions**: Trailing `<span ... onclick="openAgent('fleet')">→ Ask AI Advisor</span>` appended to `.alert-body`. Preserved.

**Effort**: S — zero deltas.

---

## Section 2: Financial Overview (5 KPI tiles)

**Source files**: `index.html:133–155`, `src/style.css:103–121`

**Deltas**:
1. Tile 2 `.kpi-lbl` text: `"Gross Margin"` → `"Margin vs Target"` to match prototype. — content
2. Tile 5 `.kpi-target` text: `"Target ≤14 ops"` → `"Target ≤ 14 ops"` (add space after `≤`) to match prototype. — content/typography (whitespace)
3. None other. Tile order, icon colors (blue/orange/teal/purple/red), deltas/values all match.

**Inline-style hotspots**: None — all colors/sizes via CSS classes.

**AI-feature interactions**: None.

**Effort**: S — two text edits in `index.html`.

---

## Section 3: Asset Operations (4 KPI tiles)

**Source files**: `index.html:158–164`, `src/style.css:103–121` (shared KPI styles)

**Deltas**:
1. None. All 4 tiles (Active Trucks, Trailers Flagged, Miles/Truck, Miles/Driver) match labels, values, icon colors, target lines, delta classes.

**Inline-style hotspots**: None.

**AI-feature interactions**: None.

**Effort**: S — verify pass only.

---

## Section 4: Division Scorecard

**Source files**: `index.html:167–189`, `src/style.css:137–158`

**Deltas**:
1. None. Both `.div-card` blocks (Brokerage primary / Asset under-optimized) match: header, sub, badge, 4-metric grid, revenue footer with ghost percentage.

**Inline-style hotspots** (carried over from prototype, leave as-is):
- `<div class="dc-met-val" style="color:#16a34a|#d97706|#dc2626">…</div>` × 8 (per-metric red/amber/green)
- `<div class="dc-rev-val" style="color:#16a34a|#d97706">…</div>` × 2

These per-metric color states are data-driven and inline in both files. **Refactor recommendation**: move to status-class modifiers (`.dc-met-val.ok|warn|crit`) in a follow-up — out of scope for this port.

**AI-feature interactions**: None.

**Effort**: S — verify pass only.

---

## Section 5: Tech Stack & Integrations

**Source files**: `index.html:192–203`, `src/style.css:159–166`

**Deltas**:
1. None. 7 chips (4 on / 2 off pattern) match exactly.

**Inline-style hotspots**: None.

**AI-feature interactions**: `<span class="card-action" onclick="openAgent('ops')">→ Ask Ops AI</span>` added to `.card-hdr`. Prototype's header has no action; source's AI CTA fills the right side. Preserved.

**Effort**: S — verify pass only.

---

## Section 6: Maintenance Queue (2/1 split)

**Source files**: `index.html:206–226`, `src/style.css:167–188`

**Deltas**:
1. None. All 8 `.maint-row` entries (4 crit + 4 warn) match IDs, issues, status spills, costs. Invoice Processing side panel matches: Assigned Staff (D. Kowalski), Open Invoices (23), Monthly Downtime ($18,240), red callout copy.

**Inline-style hotspots** (match prototype, leave as-is):
- `style="padding:14px 18px 10px"` and `style="padding:14px 18px 0"` wrappers around card headers (×2)
- `style="margin-bottom:0"` override on inner `.card-hdr`
- `style="font-size:13px;font-weight:700;color:#0e1d3e;margin-bottom:1px"` on D. Kowalski name
- `style="color:#ef4444"` on the two `.inv-big` numbers

These wrapper-padding styles compensate for `.card-bare` having no padding. **Refactor recommendation**: introduce `.card-bare-pad` or move to `.card-bare > .card-hdr` rule — out of scope.

**AI-feature interactions**: `<span class="card-action" onclick="openAgent('fleet')">→ Fleet AI Analysis</span>` in trailer-status header. Preserved.

**Effort**: S — verify pass only.

---

## Section 7: Load Channel Performance

**Source files**: `index.html:229–241`, `src/style.css:189–208`, `src/dashboard.js:26–46` (filter logic)

**Deltas**:
1. None. 4-cell `.ov-strip` (Active Loads / Avg Response / Avg Resolution / Open Issues) and 4 `.ch-card` entries (EDI / P44 / Macropoint / Asset Loads) match scores, sub-stats, accent colors, response/issues rows.

**Inline-style hotspots** (match prototype):
- 4 × `style="color:#1a4fd8|#16a34a|#d97706|#ef4444"` on `.ov-val` cells
- 4 × `style="color:#16a34a|#d97706|#ef4444"` on `.ch-score`
- 3 × `style="color:#d97706|#ef4444"` on `.ch-row-r` for elevated issue counts

Same data-driven status-color leakage as Division Scorecard. Same refactor recommendation; same out-of-scope.

**AI-feature interactions**: None.

**Effort**: S — verify pass only.

---

## Section 8: Trend Analysis (two 2/1 rows)

**Source files**: `index.html:244–252`, `src/charts.js`, `src/dashboard.js:48–56` (`renderScoreBars`), `src/data.js:58–64` (`CHANNELS`), `src/style.css:209–222`

**Deltas**:
1. **Revenue & Margin card-action** — prototype: `<div class="card-action">Full report →</div>`; source: `<span class="card-action" onclick="openAgent('rate')">→ Rate AI</span>`. Per implementation rule, source wins; prototype's `Full report →` is dropped. — content *(see open question #2)*
2. None other. Chart datasets, axis ranges, doughnut cutout 68%, score-bar render, chart-note copy all match.

**Inline-style hotspots**:
- Cost Leakage card has a trailing centered block: `<div style="text-align:center;margin-top:10px"><div style="font-size:22px;font-weight:800;color:#ef4444;letter-spacing:-.03em">$101,600</div><div style="font-size:9px;font-weight:700;color:#a0b5cc;text-transform:uppercase;letter-spacing:.08em;margin-top:2px">Monthly Addressable Leakage</div></div>` — matches prototype exactly. Inline because it's a one-off layout. Leave as-is or extract to `.cost-leak-total` / `.cost-leak-lbl` classes; refactor optional, out of scope.
- `src/dashboard.js:48–56` `renderScoreBars` builds inline `style="color:..."` and `style="width:...%;background:..."` strings — colors via `sc()` helper. Matches prototype's inline JS pattern. Leave as-is.

**AI-feature interactions**:
- Revenue card: `→ Rate AI` (preserved, supersedes prototype's `Full report →`).
- Cost Leakage card: `<span class="card-action" onclick="openAgent('ops')">→ Ops AI</span>` added (prototype has no header action). Preserved.

**Effort**: S — one markup line for delta #1 if open question #2 confirms drop.

---

## Section 9: Issues — Immediate Action Required

**Source files**: `index.html:255–271`, `src/style.css:224–242`

**Deltas**:
1. None. 5 table rows (TR-003 / LB-4825 / TR-007 / LB-4831 / TR-022) match IDs, types, divisions, hours, costs, root causes. Analysis tag on first two. View buttons enabled for first two (modal-bound to `TR-003` / `LB-4825` per `src/data.js:2–56`), disabled for the rest. Footer total `$18,470 · Avg downtime: 128 hrs` and `Export CSV` button match.

**Inline-style hotspots**: Wrapper paddings (`style="padding:14px 18px 0"`, `style="padding:0 4px"`, `style="padding:0 18px 14px"`) on the `.card-bare` — same `.card-bare`-no-padding compensation as Maintenance section. Match prototype.

**AI-feature interactions**: None — `View all →` action is plain (no AI hookup).

**Effort**: S — verify pass only.

---

## Section 10: Recommended Actions (3 quick-win cards)

**Source files**: `index.html:274–279`, `src/style.css:243–252`

**Deltas**:
1. Card 1 `.qw-title`: `"Fleet AI — Maintenance Automation"` — keep AI prefix (rule); confirm body copy. — content/AI
2. Card 2 `.qw-title`: `"Rate AI — Margin Optimization"` — keep AI prefix; *but* prototype title is `"Rate Optimization"`. The AI-prefix variant ("Rate AI — Rate Optimization") would read awkwardly; source's `"Rate AI — Margin Optimization"` is a deliberate engineering rewrite. Accept as-is. — content
3. Card 3 `.qw-title`: `"Ops AI — Call Automation"` — keep; prototype is `"24/7 Call Automation"`. Source's drop of `"24/7"` is an information loss; consider `"Ops AI — 24/7 Call Automation"`. — content
4. **Body copy across all three cards.** — content *(see open question #1)*
   - Card 1: prototype `"Automate invoice processing for 1 maintenance person — recover $18.2K/mo in downtime + cut resolution time by 60%"` vs source `"Automate invoice processing — recover $18.2K/mo in downtime + cut resolution time by 60%."` — source dropped `"for 1 maintenance person"`.
   - Card 2: prototype `"Enforce 15% margin floor + P44 benchmarking on every load — close $41K/mo margin gap and move to 22% target"` vs source `"Enforce 15% margin floor + P44 benchmarking on every load — close $41K/mo gap."` — source dropped `"margin"` before `"gap"` and the `"and move to 22% target"` clause.
   - Card 3: prototype `"Add IVR + load-status self-service — handle 70% of 328 weekly calls without adding dispatchers or headcount"` vs source `"Add IVR + load-status self-service — handle 70% of 328 weekly calls automatically."` — source replaced `"without adding dispatchers or headcount"` with `"automatically"`.
   - Recommendation: merge — restore prototype's fuller phrasing, keep the trailing `<span style="opacity:.8;font-weight:700">→ Ask Fleet/Rate/Ops AI</span>` AI CTAs.
5. None other. 3-card grid, navy/blue/teal background sequence (`.qw-card:nth-child(2|3)` rules), ghost numerals 01/02/03, 17px impact line all match.

**Inline-style hotspots**:
- `style="cursor:pointer"` on each `.qw-card` (×3) — AI handler hookup; leave inline or fold into `.qw-card { cursor: pointer }` (only meaningful if click handler always present). Trivial follow-up.
- `style="opacity:.8;font-weight:700"` on each AI CTA span (×3) — AI overlay, leave inline.

**AI-feature interactions**: Each card is fully clickable (`onclick="openAgent('fleet|rate|ops')"`) and ends with `→ Ask Fleet/Rate/Ops AI` CTA. Both preserved. Title prefixes (`Fleet AI —`, `Rate AI —`, `Ops AI —`) preserved.

**Effort**: M — depends on open question #1; if "merge" is accepted, three string rewrites in `index.html`. If "accept source", verify only.

---

## Section M: Issue-detail Modal

**Source files**: `index.html:285–314` (shell), `src/modal.js` (entire), `src/data.js:2–56` (DATA), `src/style.css:253–342`

**Deltas**:
1. None. Modal mask, header (title + meta), tabs (Analysis / Lifecycle Visual), body grid (timeline + event log on left; cost-summary + cost-table + recommendations + actions on right), foot (staff note + close), Lifecycle pane (Expected vs Actual flows + cost aberrations + impact summary tri-cell) all match the prototype's modal markup and template-string output.

**Inline-style hotspots** (in `src/modal.js`, mirror prototype's inline JS):
- Timeline rows: `style="color:#ef4444"`, `style="background:#ef4444"`, `style="color:#16a34a"`, `style="background:#16a34a"`, `style="color:#0e1d3e;font-weight:700"`, `style="color:#ef4444;font-size:13px"`, `style="padding-top:8px;border-top:1px solid #f4f8fe"`, etc.
- Cost summary: `style="color:#ef4444;font-weight:700"`, `style="color:#16a34a;font-weight:700"`.
- Cost-table item subtext: `style="font-size:10px;color:#a0b5cc"`.
- Lifecycle Visual (`buildLC`): `style="position:relative"`, `style="color:#16a34a"`, `style="color:#ef4444"`, plus div/grid wrappers.

All match prototype byte-for-byte. **Refactor recommendation**: extract per-status modifier classes (`.tl-val.crit|ok`, `.tl-fill.crit|ok`, etc.). Significant cleanup — out of scope for this port.

**AI-feature interactions**: None — modal is a shared issue-detail surface, not AI.

**Effort**: S — verify pass only.

---

## Effort summary

| Section | Effort | Net change |
|---|---|---|
| Sidebar | S | 1 CSS line (pending Q3) |
| Topbar | S | none |
| 1 · Alert | S | none |
| 2 · Financials | S | 2 text edits |
| 3 · Asset KPIs | S | none |
| 4 · Division | S | none |
| 5 · Tech Stack | S | none |
| 6 · Maintenance | S | none |
| 7 · Channels | S | none |
| 8 · Trends | S | 1 line if Q2 confirms drop |
| 9 · Issues | S | none |
| 10 · Recommended Actions | M | 3 title tweaks + 3 body rewrites if Q1 confirms merge |
| Modal | S | none |

**Total port surface**: ~8 markup lines + 1 CSS line, gated by 3 open questions. Zero CSS architectural change. Zero JS-module change beyond the markup-driven edits to `index.html`. `src/agent.js` and `src/main.js` are untouched and can be removed from the PULSE territory.

## Inline-style hotspot summary (for refactor backlog, out of port scope)

1. **Status colors leak as inline `style="color:..."`** in markup wherever a value's red/amber/green state is data-driven: Division Scorecard `.dc-met-val`/`.dc-rev-val`, Channels `.ov-val`/`.ch-score`/`.ch-row-r`, Maintenance `.inv-big`. Refactor to `.{block}.crit|warn|ok` modifier classes.
2. **`.card-bare` padding compensation** via wrapper `<div style="padding:...">` in Maintenance + Issues sections. Refactor: introduce padded variant or scoped child rule.
3. **Modal status colors** baked into `src/modal.js` template strings (timeline values/bars, cost-summary rows, lifecycle boxes). Refactor mirrors #1: per-status modifier classes.
4. **Score-bar inline color** in `src/dashboard.js` `renderScoreBars` — color via `sc()` helper concatenated into `style="..."`. Acceptable as a render-time computed value; not worth refactoring.
5. **Cost Leakage trailing block** in Trends — one-off centered total/label with full inline typography. Optional extract to `.cost-leak-total`/`.cost-leak-lbl`.

None of the above are required for the v3_1 port to ship. They're a follow-up tidiness PR if/when the team wants to remove inline-style leakage.

---

## Implementation log (2026-04-30)

### Decisions applied
- **Q1 (Recommended Actions)**: restored prototype's substantive body copy on all three cards; kept the AI CTA spans intact.
- **Q2 (Trends · Revenue card-action)**: no change — source's `→ Rate AI` CTA preserved as canonical.
- **Q3 (sidebar `.sb-kpi-val.warn`)**: restored two-tone (text `#f59e0b`, bar fill `#fbbf24` already correct).

### Changes made
1. `index.html:141` — `.kpi-lbl` `"Gross Margin"` → `"Margin vs Target"` (Financial Overview tile 2).
2. `index.html:153` — `.kpi-target` `"Target ≤14 ops"` → `"Target ≤ 14 ops"` (Financial Overview tile 5, whitespace).
3. `src/style.css:63` — `.sb-kpi-val.warn{color:#fbbf24}` → `.sb-kpi-val.warn{color:#f59e0b}`.
4. `index.html:276` — Recommended Actions card 1 body: restored `"for 1 maintenance person"` clause.
5. `index.html:277` — Recommended Actions card 2 body: restored `"margin gap and move to 22% target"` clause.
6. `index.html:278` — Recommended Actions card 3 body: restored `"without adding dispatchers or headcount"` clause (replacing source's trim `"automatically"`).

### Bonus consistency check (Q3)
- `.sb-kpi-val.crit` (`#f87171`) — already matches prototype; intentionally **single-tone** (text and bar fill both `#f87171` per Monthly Leakage HTML). No action.
- `.sb-kpi-val.ok` (`#6ee7b7`) — already matches prototype literal. Currently **unused** in markup (no sidebar KPI in `ok` state). No action.
- Conclusion: only `warn` was collapsed; `crit`/`ok` were correct as-is.

### Deviations from inventory
- None. All six edits correspond 1:1 to the deltas in this document. No additional surprises surfaced during execution.

### Untouched (confirmed unchanged)
- `src/agent.js`, `src/main.js` — AI panel logic, no port-relevant content.
- `src/charts.js`, `src/modal.js`, `src/data.js`, `src/dashboard.js` — content already aligns with prototype byte-for-byte; no edits required.
- `src/style.css` outside line 63 — no other CSS deltas; design tokens already match prototype literals.

### Notes for the deploy step
- Visual checkpoints to spot-verify against `logistics-dashboard-v3_1.html` (rendered):
  1. Financial Overview tile 2 reads "Margin vs Target".
  2. Financial Overview tile 5 reads "Target ≤ 14 ops" (with space).
  3. Sidebar Gross Margin number is amber-500 (deeper) above an amber-400 (lighter) progress bar — distinct two-tone.
  4. Recommended Actions card bodies read with the operational substance phrases, AI CTAs still trailing.
- All other sections should be visually unchanged from current Amplify deployment; no regression risk expected outside the four touched regions.
- Inline-style hotspot refactor backlog (above) is intentionally deferred — file as a tidiness follow-up PULSE if/when convenient.
