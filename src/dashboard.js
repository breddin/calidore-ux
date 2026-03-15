import { CHANNELS } from './data.js';

function sc(s) { return s >= 4 ? '#16a34a' : s >= 3 ? '#d97706' : '#ef4444'; }

export function tick() {
  const n = new Date();
  const el = document.getElementById('tb-clock');
  if (el) el.textContent =
    n.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    n.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function scrollToSec(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function setTab(btn, val) {
  document.querySelectorAll('.tb-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('divFilter').value = val;
  applyFilter();
}

export function applyFilter() {
  const f = document.getElementById('divFilter').value;
  document.getElementById('card-brok').classList.toggle('active', f === 'All Divisions' || f === 'Brokerage Division');
  document.getElementById('card-asset').classList.toggle('active', f === 'All Divisions' || f === 'Asset Division');
  document.querySelectorAll('#ch-grid .ch-card').forEach(c => {
    c.style.display = (f === 'All Divisions' || c.dataset.div === f) ? '' : 'none';
  });
  document.querySelectorAll('#issues-tbl tbody tr').forEach(r => {
    r.style.display = (f === 'All Divisions' || r.dataset.div === f.replace(' Division', '')) ? '' : 'none';
  });
  document.getElementById('ov-issues').textContent =
    ({ 'All Divisions': 24, 'Brokerage Division': 12, 'Asset Division': 13 }[f] || 24);
}

export function selectDiv(d) {
  document.getElementById('divFilter').value = d;
  applyFilter();
  document.querySelectorAll('.tb-tab').forEach((t, i) => {
    t.classList.toggle('active', ['All Divisions', 'Brokerage Division', 'Asset Division'][i] === d);
  });
}

export function renderScoreBars() {
  document.getElementById('score-bars').innerHTML = CHANNELS.map(c =>
    '<div class="score-item">' +
    '<div class="score-row"><div><div class="score-name">' + c.name + '</div><div class="score-sub">' + c.sub + '</div></div>' +
    '<div class="score-val" style="color:' + sc(c.score) + '">' + c.score.toFixed(1) + '</div></div>' +
    '<div class="score-bar"><div class="score-fill" style="width:' + ((c.score / 5) * 100) + '%;background:' + sc(c.score) + '"></div></div>' +
    '</div>'
  ).join('');
}
