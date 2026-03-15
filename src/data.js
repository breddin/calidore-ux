// ── Issue Modal Data ────────────────────────────────────────────
export const DATA = {
  'TR-003': {
    title: 'Trailer TR-003 — Brake Failure',
    div: 'Asset Division',
    assigned: 'D. Kowalski',
    ref: 'ASSET-2024-TR003',
    tl: { flag: 50.5, resolve: 101.5, total: 152 },
    events: [
      { type: 'DROP',   ts: '12/18 07:00', loc: 'Yard — Bay 4',       note: 'Flagged during pre-trip inspection · Driver #12' },
      { type: 'NOTIFY', ts: '12/20 09:30', loc: 'Maintenance Queue',   note: 'Brake failure confirmed — grounded · D. Kowalski' },
      { type: 'RETURN', ts: '12/24 15:00', loc: 'Active Fleet',        note: 'Brake replacement complete · D. Kowalski' }
    ],
    costs: [
      { item: 'Downtime — Revenue Loss (6 days)', days: 6,    rate: 600,  total: 3600 },
      { item: 'Parts — Brake System',             days: null, rate: null, total: 780 },
      { item: 'Labor — Repair (8 hrs)',            days: null, rate: null, total: 240 },
      { item: 'Administrative / Tow',             days: null, rate: null, total: 60 }
    ],
    billed: 0, absorbed: 4680,
    recs: [
      'Implement weekly brake inspection schedule',
      'Add preventive alerts at 80% service interval',
      'Track invoice processing time to reduce resolution lag',
      'Fleet-wide brake check for TR-003 class'
    ],
    staffNote: 'D. Kowalski — 1 maintenance person managing 23 trailers. Invoice processing automation recommended.'
  },
  'LB-4825': {
    title: 'Load LB-4825 — Margin At Risk',
    div: 'Brokerage Division',
    assigned: 'J. Ramírez (Dispatcher)',
    ref: 'BROK-2024-4825',
    tl: { flag: 5.8, resolve: 20.5, total: 26.3 },
    events: [
      { type: 'DROP',   ts: '12/21 08:10', loc: 'NY → Boston Lane', note: 'Load tendered via P44 — rate $1,750' },
      { type: 'NOTIFY', ts: '12/21 14:00', loc: 'Dispatch Review',   note: 'Flagged: margin 9% — below 15% threshold · J. Ramírez' },
      { type: 'RETURN', ts: '12/22 10:30', loc: 'Delivered',         note: 'Load delivered — margin locked at 9%' }
    ],
    costs: [
      { item: 'Gross Rate (P44)',                        days: null, rate: null, total: 1750 },
      { item: 'Carrier Cost',                            days: null, rate: null, total: 1592 },
      { item: 'Margin Captured',                         days: null, rate: null, total: 158 },
      { item: 'Opportunity Loss vs Target ($350)',        days: null, rate: null, total: 192 }
    ],
    billed: 158, absorbed: 192,
    recs: [
      'Set hard margin floor of 15% before tendering',
      'Enable real-time rate benchmarking via P44',
      'Flag sub-threshold loads before acceptance',
      'Review NY→Boston lane rates consistently'
    ],
    staffNote: 'J. Ramírez — dispatcher managing 214 active loads. Automated rate floor enforcement recommended.'
  }
};

// ── Score Bar Channel Data ──────────────────────────────────────
export const CHANNELS = [
  { name: 'EDI Loads',   sub: '98 loads · 21.4%',  score: 4.4 },
  { name: 'Project 44',  sub: '72 loads · 18.9%',  score: 3.9 },
  { name: 'Macropoint',  sub: '44 loads · 16.2%',  score: 3.4 },
  { name: 'Asset Loads', sub: '30 loads · 14.8%',  score: 2.8 }
];

// ── AI Agent Tier Configuration ─────────────────────────────────
export const AGENT_TIERS = {
  fleet: {
    color: '#4A6FA5',
    icon:  '◈',
    sublbl: 'FLEET OPTIMIZER · ASSET INTELLIGENCE',
    desc:   'Analyzes fleet utilization, maintenance backlog, and downtime cost — identifies highest-leverage repair sequencing and capacity recovery actions.',
    scenarios: [
      {
        id: 'f1', label: 'Maintenance Prioritization',
        prompt: '23 of 30 trailers are flagged. One maintenance person (D. Kowalski) is managing all invoices, scheduling, and repairs. Analyze the backlog and recommend a repair sequencing strategy to maximize fleet uptime within current staffing.',
        response: `FLEET OPTIMIZER ANALYSIS — Maintenance Backlog (23/30 Trailers)

PRIORITY ASSESSMENT

The core constraint isn't parts availability — it's single-point human dependency. D. Kowalski cannot simultaneously process invoices, schedule vendors, and manage 23 simultaneous repair tracks. The backlog compounds daily at approximately $608/day in lost revenue.

RECOMMENDED REPAIR SEQUENCE

Tier 1 — Immediate dispatch (revenue recovery):
  → TR-003 Brake Failure: $4,680 absorbed. Safety-critical. Subcontract to authorized shop TODAY. Do not wait for internal queue.
  → TR-022 DOT Grounded: $2,940 absorbed + regulatory liability accumulating. File DOT extension request within 24 hrs, schedule inspection same day.
  → TR-007 Refrigeration: $3,810 absorbed. Temperature-sensitive loads at risk. Escalate to refrigeration specialist, not general maintenance.

Tier 2 — Schedule within 5 business days:
  → TR-015 Air Suspension: $2,100. Parts lead time is typically 2-3 days — order immediately while Tier 1 is processing.
  → TR-011, TR-027 Scheduled: Bundle with a single vendor visit to compress labor costs.

Tier 3 — Monitor and batch:
  → TR-024, TR-018: Non-critical. Schedule in the next maintenance cycle. Flag for automated check-in at 30 days.

STAFFING LEVERAGE POINT
Invoice processing is consuming 40%+ of D. Kowalski's time. A $200/month invoicing automation tool would free approximately 15 hrs/week — enough to cut average resolution time from 6.5 days to under 2 days. Net ROI: $18,240/month recovered vs. $200/month cost.

UPTIME RECOVERY POTENTIAL
Executing Tier 1 alone restores 3 trucks within 7 days: +$5,400/week revenue. Full backlog clearance (6 weeks at current pace, 3 weeks with subcontracting) restores $18,240/month.`
      },
      {
        id: 'f2', label: 'Fleet Utilization Gap',
        prompt: '21 of 30 trucks active. Miles/truck at 7,800 vs 10,000 target. Miles/driver at 6,500 vs 10,000 target. Identify the root causes and a recovery plan.',
        response: `FLEET OPTIMIZER ANALYSIS — Utilization Gap (70% Uptime)

ROOT CAUSE DECOMPOSITION

The 7,800 mi/truck vs 10,000 target gap breaks down into two distinct problems — they require different interventions:

1. AVAILABILITY gap (trucks not running): 9 trailers offline due to maintenance. This alone accounts for ~1,800 mi/truck shortfall. The maintenance backlog IS the primary utilization lever.

2. EFFICIENCY gap (trucks running but underloaded): Miles/driver at 6,500 vs 10,000 signals route inefficiency, not just availability. Drivers are completing loads but deadheading or sitting between assignments.

DRIVER EFFICIENCY ANALYSIS
  → 6,500 mi/driver implies ~35% deadhead or idle time between loads.
  → At current revenue ($41K/truck/month), each idle day costs approximately $550.
  → Root cause: load assignments are reactive. Drivers wait for dispatch rather than pre-positioned for next load.

RECOVERY PLAN — 90 Days

Days 1-30 (Availability):
  Restore 3 trucks via Tier 1 maintenance (see maintenance analysis).
  Target: 24/30 trucks active → +$9,000/week revenue.

Days 31-60 (Efficiency):
  Implement forward load assignment: dispatch next load before current delivery completes.
  Target: reduce idle time from 35% to 20%. Miles/driver to 8,200.

Days 61-90 (Optimization):
  ELD integration (currently offline) enables route analytics.
  Estimated miles/truck improvement: 7,800 → 9,200 (+18%).
  Monthly revenue impact: +$110K from asset division alone.`
      },
      {
        id: 'f3', label: 'DOT Compliance Risk',
        prompt: 'TR-022 is grounded due to overdue DOT inspection. What is the compliance risk exposure and what is the immediate remediation playbook?',
        response: `FLEET OPTIMIZER ANALYSIS — DOT Compliance Risk (TR-022)

RISK EXPOSURE SUMMARY

Operating a grounded trailer on public roads carries:
  → Per-violation fines: $16,000–$25,000 (FMCSA out-of-service violations)
  → CSA score impact: OOS violations add 10+ severity points, visible to shippers for 24 months
  → Insurance premium risk: Carriers with elevated CSA scores face 15-30% surcharge at renewal
  → Shipper relationship risk: Large shippers (especially EDI partners) auto-flag carriers above CSA thresholds

TR-022 is currently generating $2,940/month in downtime cost. The regulatory risk multiplier is 8-10x that figure if a single misstep occurs.

IMMEDIATE REMEDIATION PLAYBOOK

Hour 0-4:
  1. Confirm TR-022 is physically secured in yard — do not allow any movement under any circumstances.
  2. Pull the last inspection report. Identify which specific items caused the overdue status.
  3. Contact a CVSA-certified inspection station. Request a same-day or next-business-day slot.

Day 1-2:
  4. If inspection items require repair: complete repairs BEFORE scheduling inspection. Do not attempt inspection on a failing vehicle.
  5. Document all repair work with technician sign-off and parts receipts.

Day 3-5:
  6. Pass annual inspection. Retain certificate in cab and dispatch system.
  7. Update internal compliance tracker. Set 60-day pre-expiry automated alert for all fleet units.

SYSTEMIC FIX
TR-022 is a symptom of no proactive compliance tracking. A $30/month fleet compliance SaaS (e.g., Samsara compliance module) would auto-flag inspection expiry 90/60/30 days in advance across all 30 units — eliminating this class of risk entirely.`
      }
    ],
    thinking: [
      'Activating Fleet Optimizer agent...',
      'Loading asset division data (30 trucks, 23 flagged)...',
      'Analyzing maintenance cost vectors...',
      'Mapping repair sequencing constraints...',
      'Calculating downtime recovery potential...',
      'Synthesizing fleet intelligence response...'
    ]
  },

  rate: {
    color: '#2A9D8F',
    icon:  '⬡',
    sublbl: 'RATE ANALYST · MARGIN INTELLIGENCE',
    desc:   'Diagnoses margin leakage across load channels, models rate floor enforcement, and identifies the highest-value pricing interventions available this period.',
    scenarios: [
      {
        id: 'r1', label: 'Margin Floor Enforcement',
        prompt: 'Gross margin is 18.4% against a 22% target. P44 and Macropoint loads are consistently coming in below 15%. Model the impact of enforcing a hard 15% floor and identify which loads to decline.',
        response: `RATE ANALYST ANALYSIS — Margin Floor Enforcement

CURRENT STATE DIAGNOSIS

The 3.6-point margin gap (18.4% vs 22%) is not uniform — it is concentrated in two channels:

  EDI:        21.4% margin → ABOVE floor. No intervention needed.
  P44:        18.9% margin → Marginally compliant. Pressure-test rate cards.
  Macropoint: 16.2% margin → Below sustainable threshold on many loads.
  Asset:      14.8% margin → Below floor. Structural issue (maintenance cost absorption).

The Macropoint channel is your primary intervention target.

MARGIN FLOOR MODELING

If a 15% hard floor was enforced on Macropoint loads this month:
  → Estimated loads declined: 8-11 of 44 (those below 15%)
  → Revenue impact: -$52K gross, -$8K net margin (loads were negative-margin or near-zero after overhead)
  → Net effect: POSITIVE. Declining sub-floor loads frees dispatcher capacity for higher-margin work.

If 15% floor applied to P44:
  → Estimated loads declined: 3-4 of 72 (edge cases only)
  → Negligible volume impact. Enforce immediately.

IMPLEMENTATION STEPS

1. P44 floor enforcement (this week): Configure rate acceptance rules in P44 dashboard. Set minimum margin at 15.5% (buffer for fuel variance). Estimated gain: $12K-$18K/month.

2. Macropoint renegotiation (this month): Contact top 5 Macropoint shippers. Present lane-level margin data. Renegotiate or exit lanes below $2.20/mile effective margin. Estimated gain: $23K/month.

3. Asset load pricing (30-60 days): Asset loads at 14.8% are absorbing maintenance costs invisibly. Separate maintenance cost tracking from load margin. Price asset loads at 18% minimum floor. Estimated gain: $7K/month.

TOTAL ADDRESSABLE MARGIN RECOVERY: ~$41,000/month
Timeline to full capture: 60 days with consistent enforcement.`
      },
      {
        id: 'r2', label: 'Lane Rate Optimization',
        prompt: 'The NY → Boston lane via P44 is consistently tendered at $1,750 with 9% margin. What is the correct rate and how should we negotiate with shippers on repeat lanes?',
        response: `RATE ANALYST ANALYSIS — NY → Boston Lane (P44)

LANE ECONOMICS BREAKDOWN

Current state (LB-4825 is representative):
  Gross rate:    $1,750
  Carrier cost:  $1,592 (91% of rate)
  Margin:        $158   (9.0%)
  Target margin: $350   (20%)

The carrier cost structure suggests either: (a) you're accepting spot loads that should be contract, or (b) the lane carrier selection is not benchmarked against current market.

MARKET RATE ANALYSIS (NY → Boston, ~215 miles)

DAT/P44 benchmark for this lane (Q1 2026):
  Spot rate range: $1,920 - $2,180
  Contract rate:   $1,750 - $1,900

YOUR RATE OF $1,750 IS AT THE FLOOR OF THE CONTRACT RANGE.

This means either: the shipper has negotiated an advantageous rate that hasn't been renegotiated in 12+ months, or you're accepting spot loads at a rate that should only apply to committed volume.

NEGOTIATION PLAYBOOK

Step 1 — Segment the lane:
  Pull all NY→Boston loads in last 6 months. Identify the top 3 shippers by volume.

Step 2 — Anchor on market data:
  "Our P44 benchmark shows this lane clearing at $1,980 spot average. We've been servicing at $1,750 as a preferred partner rate — we need to bring this to $1,980 or restructure to a committed volume agreement at $1,850."

Step 3 — Offer a value exchange:
  Offer 98% on-time commitment + EDI integration in exchange for $1,850 rate. This moves the relationship from cost-center to preferred-carrier status.

Step 4 — Walk-away threshold:
  If shipper cannot meet $1,800 minimum, decline and reallocate carrier capacity to $2,100+ lanes. The opportunity cost of this lane at $1,750 is $350/load × estimated 8 loads/month = $2,800/month.`
      },
      {
        id: 'r3', label: 'Sub-margin Load Audit',
        prompt: 'Run a full audit of which channels and load types are dragging margin below target, and what the 30-day action plan is to close the gap.',
        response: `RATE ANALYST ANALYSIS — Full Sub-Margin Load Audit

MARGIN WATERFALL (This Month)

Total revenue: $2.14M at 18.4% = $393.8K gross margin
Target:        $2.14M at 22.0% = $470.8K gross margin
GAP:           $77.0K/month

SOURCE OF GAP BY CHANNEL:
  Macropoint loads:      -$34K  (16.2% vs 22% target on $384K revenue)
  Asset loads:           -$15K  (14.8% vs 22% target, partially maintenance-driven)
  P44 sub-threshold:     -$12K  (3-4 loads/month at <12% with high carrier cost)
  24/7 call overhead:    -$12K  (absorbed dispatcher time that isn't priced into loads)
  Idle truck carrying cost: -$4K

PRIORITY ACTIONS — 30-DAY PLAN

Week 1:
  □ Enable P44 rate floor alert at 15% — auto-flag before acceptance
  □ Pull Macropoint loads below 15% for the last 30 days. Identify repeat shippers.
  □ Separate asset maintenance cost from load margin in reporting

Week 2:
  □ Contact top 3 Macropoint shippers (account for ~60% of sub-margin volume)
  □ Present benchmark data. Renegotiate or issue 30-day rate increase notice.
  □ For P44: configure hard reject on loads <14.5% (allows 0.5% buffer)

Week 3:
  □ Reprice asset loads — add $0.08/mile surcharge tagged to current maintenance cost recovery
  □ Implement carrier cost benchmarking on all loads >$2,000 gross

Week 4:
  □ Review results. Estimate: 12-15 loads declined or repriced
  □ Projected margin improvement: +$41K/month (3.1 margin points)
  □ Revised run rate: 21.5% — within 0.5 pts of 22% target`
      }
    ],
    thinking: [
      'Activating Rate Analyst agent...',
      'Scanning channel margin data across EDI, P44, Macropoint, Asset...',
      'Benchmarking current rates against lane market data...',
      'Modeling margin floor enforcement scenarios...',
      'Calculating per-channel leakage and recovery potential...',
      'Generating rate optimization response...'
    ]
  },

  ops: {
    color: '#d4a843',
    icon:  '◇',
    sublbl: 'OPS ADVISOR · OPERATIONAL INTELLIGENCE',
    desc:   'Analyzes operational bottlenecks across dispatch, call volume, staffing, and technology — identifies automation opportunities and headcount efficiency gains.',
    scenarios: [
      {
        id: 'o1', label: '24/7 Call Volume Analysis',
        prompt: '328 calls/week are handled manually. No 24/7 call system is in place. Dispatcher J. Ramírez is absorbing this volume alongside managing 214 active loads. Analyze the impact and recommend a solution.',
        response: `OPS ADVISOR ANALYSIS — 24/7 Call Volume (328 calls/week)

LOAD ON J. RAMÍREZ

328 calls/week = 46.9 calls/day, 7 days/week.
At average 4-5 minutes per call, that's 3.5-4 hours/day absorbed by call handling alone.
J. Ramírez is also managing 214 active loads. Standard dispatcher capacity: 80-100 loads.
AT 214 LOADS, J. RAMÍREZ IS ALREADY OPERATING AT 2X SUSTAINABLE CAPACITY — BEFORE CALLS.

CALL CLASSIFICATION (estimated from industry benchmarks):
  Load status inquiries: ~52% (170 calls/week) → fully automatable
  ETA / tracking updates: ~21% (69 calls/week) → automatable via tracking integration
  Issue escalations:     ~15% (49 calls/week) → requires human
  New load requests:     ~12% (39 calls/week) → semi-automatable with intake form

AUTOMATION POTENTIAL: 70-75% of call volume

RECOMMENDED SOLUTION STACK

Phase 1 (Week 1-2) — Zero-cost quick wins:
  → Add load status self-service link to all P44/EDI confirmation emails
  → Set up auto-reply with tracking link for inbound email inquiries
  Estimated call reduction: -22%

Phase 2 (Month 1) — IVR + tracking integration:
  → Implement basic IVR: "Press 1 for load status, Press 2 for ETA, Press 3 for urgent issues"
  → Connect to Macropoint/P44 for live status reads
  → Cost: $150-400/month (Twilio-based or dedicated TMS IVR)
  Estimated call reduction: -50% additional

Phase 3 (Month 2-3) — Full 24/7 coverage:
  → Add after-hours answering service for escalations only (49 calls/week at ~$1.20/call = $295/month)
  → J. Ramírez handles business hours only

TOTAL IMPACT:
  Call volume J. Ramírez handles: 328/week → 49/week (85% reduction)
  Dispatcher capacity freed: ~3 hours/day
  Cost: ~$500-700/month
  Revenue impact: freed dispatcher capacity = ability to handle 40+ additional loads/month at current margin`
      },
      {
        id: 'o2', label: 'Dispatcher Headcount Analysis',
        prompt: 'One dispatcher is managing 214 loads across EDI, P44, and Macropoint. Industry standard is 80-100 loads per dispatcher. Analyze the risk and provide a scaling plan.',
        response: `OPS ADVISOR ANALYSIS — Dispatcher Capacity Risk

CURRENT STATE (CRITICAL)

J. Ramírez is carrying 214 loads against an 80-100 load standard.
That's 2.1-2.7x sustainable dispatcher capacity.

RISK MANIFESTATION — what you're already seeing:
  → Avg resolution time: 29 hrs (target <24 hrs) — slippage from overload
  → Macropoint response rate: 79% (vs. 97% for EDI) — attention triage happening
  → 328 calls/week absorbed manually — no bandwidth for proactive management
  → Asset loads: 6.2h avg response — dispatcher is not actively working this channel

THE HIDDEN COST OF SINGLE DISPATCHER DEPENDENCY
If J. Ramírez leaves, takes sick leave, or burns out:
  → 214 loads go unmanaged within 24 hours
  → Conservative estimate: $180K revenue at risk in a 72-hour gap
  → Recruiting and training a replacement: 4-8 weeks
  → Key-person concentration on $1.93M/month in brokerage revenue is the #1 operational risk in this business

SCALING PLAN — three options:

Option A — Hire 1 additional dispatcher:
  Cost: $55-70K salary + benefits (~$80K total)
  Capacity relief: distribute 100 loads, enabling J. Ramírez to operate at standard capacity
  Timeline: 6-8 weeks to hire and train

Option B — Automate to extend J. Ramírez's effective capacity:
  Resolve 24/7 call automation (see call analysis) → frees 3 hrs/day
  Enable P44 auto-acceptance for loads meeting margin floor → removes 20-30 manual decisions/day
  Effective capacity: 160-180 loads at 80% of stress level
  Cost: $500-800/month
  Timeline: 2-4 weeks

Option C — Hybrid (recommended):
  Implement automation (Option B) immediately — 2-4 weeks
  Begin hiring for dispatcher #2 in parallel — 6-8 weeks
  At current growth (+$60K/month revenue trend), a second dispatcher pays for itself in ~3 months

RECOMMENDATION: Option C. The automation buys you time and reduces burn. The hire eliminates key-person risk and enables growth.`
      },
      {
        id: 'o3', label: 'ELD & Integration Gap',
        prompt: 'ELD tracking and 24/7 call system are both shown as offline in the tech stack. What is the operational and compliance impact, and what is the integration priority order?',
        response: `OPS ADVISOR ANALYSIS — Technology Gap Assessment

CURRENT TECH STACK STATUS
  ✓ EDI — Active         ✓ Project 44 — Active
  ✓ Macropoint — Active  ✓ Motiv App — Active
  ✓ Load Building — Active
  ✗ ELD Tracking — OFFLINE
  ✗ 24/7 Call System — OFFLINE

IMPACT ASSESSMENT

ELD Offline:
  COMPLIANCE: ELD mandate applies to all CMV drivers operating on interstate commerce. Operating without ELD compliance is a FMCSA violation. Each driver without compliant ELD = $1,000-$16,000 per violation.
  OPERATIONAL: Without ELD data, you cannot: (a) proactively monitor HOS status, (b) receive automated breakdown alerts, (c) validate driver location for customer inquiries, (d) generate IFTA fuel reports automatically.
  CURRENT WORKAROUND COST: Dispatchers manually calling drivers for location = absorbed into 328 calls/week volume.

24/7 Call System Offline:
  OPERATIONAL: J. Ramírez is personally absorbing 328 calls/week (see call analysis). This is a $500/month problem being solved by burning out your only dispatcher.
  REVENUE RISK: Missed calls during off-hours = missed load opportunities and customer dissatisfaction. Macropoint score of 3.4/5 is partly attributable to after-hours response failures.

INTEGRATION PRIORITY ORDER

Priority 1 — ELD (Weeks 1-2):
  Regulatory exposure makes this non-negotiable.
  Recommendation: Samsara or KeepTruckin (now Motive) ELD. ~$35/vehicle/month for 21 active trucks = $735/month.
  Compliance risk eliminated. Driver location visibility enabled.

Priority 2 — 24/7 Call System (Weeks 2-4):
  $500-700/month. Frees 3 hrs/day of dispatcher time.
  See call analysis for full implementation detail.

Priority 3 — ELD ↔ TMS Integration (Month 2):
  Once ELD is running, integrate GPS/HOS data into load management system.
  Enables proactive exception management — dispatcher handles exceptions, not status checks.

TOTAL INTEGRATION COST: ~$1,400-1,500/month
OPERATIONAL VALUE RECOVERED: ~$28K/month (call burden + compliance risk mitigation + dispatcher efficiency)`
      }
    ],
    thinking: [
      'Activating Ops Advisor agent...',
      'Loading operational data (328 calls/wk, 214 loads, 40 headcount)...',
      'Analyzing dispatcher capacity and bottlenecks...',
      'Modeling automation vs. headcount trade-offs...',
      'Scanning technology integration gaps...',
      'Generating operational advisory response...'
    ]
  }
};
