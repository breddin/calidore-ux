import { AGENT_TIERS } from './data.js';

// ── Agent state ─────────────────────────────────────────────────
const agState = {
  tier: 'fleet',
  scenario: null,
  streamTimer: null,
  thinkTimer: null,
  outputs: {}
};

// ── Claude model ─────────────────────────────────────────────────
const CLAUDE_MODEL = 'claude-opus-4-5';

// ── Panel open / close ────────────────────────────────────────────
export function openAgent(tier) {
  agState.tier = tier || 'fleet';
  document.getElementById('ag-panel').classList.add('open');
  document.getElementById('ag-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.ag-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tier === agState.tier);
  });
  renderAgentTier();
}

export function closeAgent() {
  document.getElementById('ag-panel').classList.remove('open');
  document.getElementById('ag-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

export function switchAgentTier(tier, btn) {
  agState.tier = tier;
  agState.scenario = null;
  document.querySelectorAll('.ag-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderAgentTier();
}

export function selectScenario(id) {
  agState.scenario = id;
  renderAgentTier();
}

export function renderAgentTier() {
  const t = AGENT_TIERS[agState.tier];
  const c = t.color;

  document.getElementById('ag-tier-sublbl').textContent = t.sublbl;
  document.getElementById('ag-tier-sublbl').style.color = c;
  document.getElementById('ag-tier-txt').textContent = t.desc;

  const list = document.getElementById('ag-scen-items');
  list.innerHTML = t.scenarios.map(s => {
    const active = agState.scenario === s.id;
    return '<div class="ag-scen-item' + (active ? ' active' : '') + '" onclick="selectScenario(\'' + s.id + '\')" style="' + (active ? 'border-color:' + c + ';background:' + hexToRgba(c, .06) + ';' : '') + '">' +
      '<div class="ag-scen-name" style="color:' + (active ? c : '#6a85a5') + '">' + s.label + '</div>' +
      '<div class="ag-scen-preview">' + s.prompt.slice(0, 70) + '…</div>' +
      '</div>';
  }).join('');

  const btn = document.getElementById('ag-run-btn');
  btn.disabled = !agState.scenario;
  if (agState.scenario) {
    btn.style.background = 'linear-gradient(135deg,' + hexToRgba(c, .8) + ',' + c + ')';
    btn.style.color = '#fff';
    btn.style.border = '1px solid ' + c;
    btn.style.boxShadow = '0 0 20px ' + hexToRgba(c, .3);
  } else {
    btn.style.background = ''; btn.style.color = ''; btn.style.border = ''; btn.style.boxShadow = '';
  }

  document.getElementById('ag-idle-icon').textContent = t.icon;
  document.getElementById('ag-idle-icon').style.color = c;

  renderAgentOutput();
}

function renderAgentOutput() {
  const t = AGENT_TIERS[agState.tier];
  const c = t.color;
  const output = document.getElementById('ag-output');
  const queryBar = document.getElementById('ag-query-bar');

  if (agState.scenario) {
    const scen = t.scenarios.find(s => s.id === agState.scenario);
    queryBar.style.display = 'block';
    document.getElementById('ag-query-lbl-color').style.color = c;
    document.getElementById('ag-query-txt').textContent = scen.prompt;
  } else {
    queryBar.style.display = 'none';
  }

  const phase = agState.outputs[agState.tier + ':phase'] || 'idle';

  if (phase === 'idle') {
    output.innerHTML = '<div class="ag-idle"><div class="ag-idle-icon" style="color:' + c + '">' + t.icon + '</div><div class="ag-idle-txt">Select a scenario and run the agent to see agentic analysis grounded in your live operations data.</div></div>';
  } else if (phase === 'thinking') {
    renderThinking(t, c);
  } else if (phase === 'result') {
    renderResult(t, c);
  }
}

function renderThinking(t, c) {
  const output = document.getElementById('ag-output');
  const step = agState.outputs[agState.tier + ':step'] || 0;
  output.innerHTML =
    '<div class="ag-ctx-bar"><strong>Context loaded:</strong> 30 trucks · 23 flagged · $18,240/mo downtime · 214 active loads · margin 18.4% · 328 calls/wk</div>' +
    '<div class="ag-trace-lbl" style="color:' + c + '">AGENT TRACE</div>' +
    t.thinking.map((s, i) => {
      const past = i < step, active = i === step, future = i > step;
      return '<div class="ag-trace-step" style="opacity:' + (future ? 0.15 : 1) + ';animation:' + (i <= step ? 'fadeSlideIn .4s ' + i * .05 + 's both' : 'none') + '">' +
        '<div class="ag-trace-dot" style="background:' + (future ? '#1a2d4a' : c) + ';box-shadow:' + (active ? '0 0 8px ' + c : 'none') + ';animation:' + (active ? 'tracePulse 1s infinite' : 'none') + '"></div>' +
        '<span class="ag-trace-txt" style="color:' + (past ? '#6a85a5' : active ? c : '#4a6080') + '">' + s + '</span></div>';
    }).join('');
}

function renderResult(t, c) {
  const output = document.getElementById('ag-output');
  const scen = t.scenarios.find(s => s.id === agState.scenario);
  if (!scen) return;
  const resultText = agState.outputs[agState.tier + ':text'] || '';
  const agentLabel = { fleet: 'FLEET OPTIMIZER', rate: 'RATE ANALYST', ops: 'OPS ADVISOR' }[agState.tier];
  output.innerHTML =
    '<div class="ag-ctx-bar" style="margin-bottom:12px"><strong>Context loaded:</strong> 30 trucks · 23 flagged · $18,240/mo downtime · 214 active loads · margin 18.4% · 328 calls/wk</div>' +
    '<div class="ag-result-badge" style="background:' + hexToRgba(c, .1) + ';border:1px solid ' + hexToRgba(c, .35) + '">' +
    '<div class="ag-result-dot" style="background:' + c + ';box-shadow:0 0 8px ' + c + '"></div>' +
    '<span class="ag-result-lbl" style="color:' + c + '">' + agentLabel + ' · RESPONSE COMPLETE</span></div>' +
    '<div class="ag-result-text" id="ag-stream-text">' + escHtml(resultText) + '<span class="ag-cursor" id="ag-cursor" style="color:' + c + '">▌</span></div>';
}

export function runAgent() {
  if (!agState.scenario) return;
  const t = AGENT_TIERS[agState.tier];
  const scen = t.scenarios.find(s => s.id === agState.scenario);
  if (!scen) return;

  if (agState.streamTimer) clearInterval(agState.streamTimer);
  if (agState.thinkTimer) clearInterval(agState.thinkTimer);

  agState.outputs[agState.tier + ':phase'] = 'thinking';
  agState.outputs[agState.tier + ':step'] = 0;
  agState.outputs[agState.tier + ':text'] = '';

  const btn = document.getElementById('ag-run-btn');
  btn.disabled = true;
  btn.textContent = '▶ AGENT REASONING...';

  renderAgentOutput();

  let step = 0;
  agState.thinkTimer = setInterval(() => {
    step++;
    agState.outputs[agState.tier + ':step'] = step;
    renderThinking(t, t.color);
    if (step >= t.thinking.length - 1) {
      clearInterval(agState.thinkTimer);
      agState.outputs[agState.tier + ':done'] = false;
      setTimeout(() => callClaudeAPI(t, scen), 500);
    }
  }, 500);
}

// ── System prompt ─────────────────────────────────────────────────
function buildSystemPrompt(tier) {
  const base = `You are an AI operations agent for Calidore Logistics, a freight brokerage and asset trucking company.

LIVE DASHBOARD DATA (March 14, 2026):
Revenue: $2.14M/month | Gross Margin: 18.4% (target: 22%) | Headcount: 40
Active Trucks: 21/30 | Trailers Flagged: 23/30 | Miles/Truck: 7,800 (target: 10,000) | Miles/Driver: 6,500 (target: 10,000)

CHANNEL PERFORMANCE:
  EDI       — Score 4.4/5.0 — 98 loads — 21.4% margin
  Project44 — Score 3.9/5.0 — 72 loads — 18.9% margin
  Macropoint — Score 3.4/5.0 — 44 loads — 16.2% margin
  Asset     — Score 2.8/5.0 — 30 loads — 14.8% margin

ACTIVE MAINTENANCE QUEUE (23 trailers flagged, 1 maintenance person: D. Kowalski):
  TR-003 — Brake Failure        — 6 days down — $4,680 absorbed — CRITICAL
  TR-022 — DOT Inspection Due   — 4 days      — $2,940 absorbed — CRITICAL (regulatory exposure)
  TR-007 — Refrigeration Unit   — 8 days      — $3,810 absorbed — CRITICAL
  TR-015 — Air Suspension       — 3 days      — $2,100 absorbed — WARNING
  TR-011 — Scheduled Maintenance — 1 day      — $890 absorbed   — SCHEDULED
  TR-027 — Tire Replacement     — 2 days      — $1,240 absorbed — SCHEDULED
  TR-024 — Minor Electrical     — 2 days      — $680 absorbed   — WARNING
  TR-018 — Oil Change/Service   — 1 day       — $420 absorbed   — SCHEDULED
  Total monthly downtime cost: ~$18,240 absorbed

KEY OPEN ISSUES:
  INV-2024-0891 — Invoice Processing Backlog — 214 invoices outstanding
  DISP-0012     — 24/7 Call Volume — 328 calls/week handled manually, no IVR system
  RATE-P44-012  — Margin Leakage — P44 loads averaging 9% margins on NY→Boston lane

TECH STACK: EDI=active, Project44=active, Macropoint=active, Motiv=active, LoadBuilding=active | ELD=OFFLINE, 24/7CallSystem=OFFLINE

DISPATCHER: J. Ramírez managing 214 active loads (standard capacity: 80-100 loads).`;

  const tierContext = {
    fleet: '\n\nYOU ARE: Fleet Optimizer — analyze fleet utilization, maintenance sequencing, downtime recovery, and asset operations.',
    rate:  '\n\nYOU ARE: Rate Analyst — analyze margin leakage, lane-level pricing, rate floor enforcement, and channel-by-channel revenue optimization.',
    ops:   '\n\nYOU ARE: Ops Advisor — analyze operational bottlenecks, dispatcher capacity, call volume automation, technology integration gaps, and staffing leverage.'
  };

  return base + tierContext[tier] + '\n\nRESPONSE FORMAT: Be direct and precise. Use the actual unit numbers, percentages, and cost figures from the data above. Structure your response with clearly labeled sections using uppercase headings. Do NOT use markdown formatting (no **, no ##, no backticks). Use arrows (→), dashes, and uppercase text for hierarchy. Keep responses analytical and grounded in the specific data shown above.';
}

// ── Claude API streaming via Vite proxy ───────────────────────────
async function callClaudeAPI(t, scen) {
  agState.outputs[agState.tier + ':phase'] = 'result';
  agState.outputs[agState.tier + ':text'] = '';
  renderAgentOutput();

  const systemPrompt = buildSystemPrompt(agState.tier);

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: scen.prompt }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error((errData.error && errData.error.message) || ('API error ' + response.status));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buf += decoder.decode(chunk.value, { stream: true });

      const lines = buf.split('\n');
      buf = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;

        let evt;
        try { evt = JSON.parse(payload); } catch (e) { continue; }

        if (evt.type === 'content_block_delta' && evt.delta && evt.delta.type === 'text_delta') {
          agState.outputs[agState.tier + ':text'] += evt.delta.text;
          const el = document.getElementById('ag-stream-text');
          if (el) {
            el.innerHTML = escHtml(agState.outputs[agState.tier + ':text']) +
              '<span class="ag-cursor" style="color:' + t.color + '">▌</span>';
            const outEl = document.getElementById('ag-output');
            if (outEl) outEl.scrollTop = outEl.scrollHeight;
          }
        } else if (evt.type === 'message_stop') {
          onStreamComplete(t);
        }
      }
    }
    onStreamComplete(t);
  } catch (err) {
    // Fall back to static demo response on any error (e.g. missing API key in .env)
    startStaticStream(t, scen);
  }
}

// ── Static fallback stream ────────────────────────────────────────
function startStaticStream(t, scen) {
  agState.outputs[agState.tier + ':phase'] = 'result';
  agState.outputs[agState.tier + ':text'] = '';
  agState.outputs[agState.tier + ':done'] = false;
  renderAgentOutput();

  const full = '[DEMO — Add ANTHROPIC_API_KEY to .env for live Claude responses]\n\n' + scen.response;
  let idx = 0;
  agState.streamTimer = setInterval(() => {
    if (idx < full.length) {
      agState.outputs[agState.tier + ':text'] = full.slice(0, idx + 1);
      idx++;
      const el = document.getElementById('ag-stream-text');
      if (el) {
        el.innerHTML = escHtml(agState.outputs[agState.tier + ':text']) +
          '<span class="ag-cursor" style="color:' + t.color + '">▌</span>';
        const outEl = document.getElementById('ag-output');
        if (outEl) outEl.scrollTop = outEl.scrollHeight;
      }
    } else {
      clearInterval(agState.streamTimer);
      onStreamComplete(t);
    }
  }, 5);
}

function onStreamComplete(t) {
  if (agState.outputs[agState.tier + ':done']) return;
  agState.outputs[agState.tier + ':done'] = true;
  const cursor = document.getElementById('ag-cursor');
  if (cursor) cursor.style.display = 'none';
  updateStatusNode(agState.tier, t.color);
  const btn = document.getElementById('ag-run-btn');
  if (btn) { btn.disabled = false; btn.textContent = '▶ RUN AGENT'; }
}

function updateStatusNode(tier, color) {
  const dot = document.getElementById('ag-sd-' + tier);
  const lbl = document.getElementById('ag-sl-' + tier);
  if (dot) { dot.style.background = color; dot.style.boxShadow = '0 0 6px ' + color; }
  if (lbl) { lbl.style.color = color; }
}

// ── Utilities ─────────────────────────────────────────────────────
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

export function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/ {2}/g, '&nbsp;&nbsp;');
}
