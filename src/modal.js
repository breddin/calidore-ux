import { DATA } from './data.js';

function sc(s) { return s >= 4 ? '#16a34a' : s >= 3 ? '#d97706' : '#ef4444'; }

export function openModal(id) {
  const d = DATA[id];
  document.getElementById('m-title').textContent = d.title;
  document.getElementById('m-meta').innerHTML =
    '<span><strong>' + id + '</strong></span>' +
    '<span>Division: <strong>' + d.div + '</strong></span>' +
    '<span>Assigned: <strong>' + d.assigned + '</strong></span>' +
    '<span>Ref: <strong>' + d.ref + '</strong></span>';

  const fp = Math.min((d.tl.flag / 168) * 100, 100);
  const rp = Math.min((d.tl.resolve / 168) * 100, 100);
  document.getElementById('m-tl').innerHTML =
    '<div class="tl-row"><div class="tl-head"><span class="tl-lbl">Flag → Queue</span><span class="tl-val" style="color:#ef4444">' + d.tl.flag.toFixed(1) + ' hrs</span></div><div class="tl-bar"><div class="tl-fill" style="width:' + fp + '%;background:#ef4444"></div></div><div class="tl-sub">' + (d.tl.flag / 24).toFixed(1) + ' days to enter queue</div></div>' +
    '<div class="tl-row"><div class="tl-head"><span class="tl-lbl">Queue → Resolved</span><span class="tl-val" style="color:#16a34a">' + d.tl.resolve.toFixed(1) + ' hrs</span></div><div class="tl-bar"><div class="tl-fill" style="width:' + rp + '%;background:#16a34a"></div></div><div class="tl-sub">' + (d.tl.resolve / 24).toFixed(1) + ' days in queue</div></div>' +
    '<div class="tl-row" style="padding-top:8px;border-top:1px solid #f4f8fe"><div class="tl-head"><span class="tl-lbl" style="color:#0e1d3e;font-weight:700">Total Downtime</span><span class="tl-val" style="color:#ef4444;font-size:13px">' + d.tl.total.toFixed(1) + ' hrs</span></div><div class="tl-sub">' + (d.tl.total / 24).toFixed(1) + ' days — <span style="color:#ef4444">Target: &lt;2 days</span></div></div>';

  document.getElementById('m-ev').innerHTML = d.events.map(ev =>
    '<div class="ev-item"><div class="ev-head"><div class="ev-type"><div class="ev-dot ' + ev.type.toLowerCase() + '"></div>' + ev.type + '</div><span class="ev-time">' + ev.ts + '</span></div><div class="ev-loc">' + ev.loc + '</div><div class="ev-note">' + ev.note + '</div></div>'
  ).join('');

  const tot = d.costs.reduce((s, c) => s + c.total, 0);
  document.getElementById('m-csum').innerHTML =
    '<div class="c-sum-ttl">Cost Impact</div>' +
    '<div class="c-sum-row"><span>Total Cost</span><span style="color:#ef4444;font-weight:700">$' + tot.toLocaleString() + '</span></div>' +
    '<div class="c-sum-row"><span>Recoverable</span><span style="color:#16a34a;font-weight:700">$' + d.billed.toLocaleString() + '</span></div>' +
    '<div class="c-sum-row tot"><span>Absorbed Loss</span><span>$' + d.absorbed.toLocaleString() + '</span></div>';

  document.getElementById('m-ctbl').innerHTML =
    '<table><thead><tr><th>Item</th><th style="text-align:right">Amount</th></tr></thead><tbody>' +
    d.costs.map(c =>
      '<tr><td><div>' + c.item + '</div>' + (c.days ? '<div style="font-size:10px;color:#a0b5cc">' + c.days + ' days × $' + c.rate + '/day</div>' : '') + '</td><td class="amt">$' + c.total.toLocaleString() + '</td></tr>'
    ).join('') +
    '</tbody></table>';

  document.getElementById('m-recs').innerHTML = d.recs.map(r => '<div class="rec">' + r + '</div>').join('');
  document.getElementById('m-staff').innerHTML =
    '<div class="staff-ttl">Staff Note</div><div class="staff-body">' + d.staffNote + '</div>';

  buildLC(d);
  switchTab('a', document.getElementById('tab-btn-a'));
  document.getElementById('mask').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  document.getElementById('mask').classList.remove('open');
  document.body.style.overflow = '';
}

export function switchTab(n, btn) {
  document.querySelectorAll('.m-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.m-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + n).classList.add('active');
}

function buildLC(d) {
  const tot = d.costs.reduce((s, c) => s + c.total, 0);
  const op = (((d.tl.total / 24) - 2) / 2 * 100).toFixed(0);
  document.getElementById('m-lc').innerHTML =
    '<div class="lc-grid"><div><div class="lc-col-ttl">Expected Flow</div><div class="lc-flow">' +
    [['FLAG', '0 hrs', 'Issue identified'], ['QUEUED', '4 hrs', 'Same-day queue entry'], ['RESOLVED', '48 hrs', 'Returned to service']].map((s, i, a) =>
      '<div class="lc-box ok"><div class="lc-bh"><span class="lc-bn">' + s[0] + '</span><span class="lc-bt" style="color:#16a34a">' + s[1] + '</span></div><div class="lc-bd">' + s[2] + '</div></div>' + (i < a.length - 1 ? '<div class="lc-arrow">↓</div>' : '')
    ).join('') +
    '<div class="lc-sum ok"><div class="lc-s-lbl" style="color:#16a34a">Target</div><div class="lc-s-val" style="color:#16a34a">48 hrs</div><div class="lc-s-sub">2 days</div></div></div></div>' +
    '<div><div class="lc-col-ttl">Actual — ' + d.ref + '</div><div class="lc-flow">' +
    '<div class="lc-box ok"><div class="lc-bh"><span class="lc-bn">FLAG</span><span class="lc-bt" style="color:#16a34a">0 hrs</span></div><div class="lc-bd">' + d.events[0].ts + '</div></div>' +
    '<div class="lc-arrow warn">⚠ ' + d.tl.flag.toFixed(1) + ' hr delay ↓</div>' +
    '<div class="lc-box prob" style="position:relative"><div class="lc-cost">+$' + d.costs[0].total.toLocaleString() + '</div><div class="lc-bh"><span class="lc-bn">QUEUED</span><span class="lc-bt" style="color:#ef4444">' + d.tl.flag.toFixed(1) + ' hrs</span></div><div class="lc-bd">' + d.events[1].ts + '</div></div>' +
    '<div class="lc-arrow">↓</div>' +
    '<div class="lc-box ok"><div class="lc-bh"><span class="lc-bn">RESOLVED</span><span class="lc-bt" style="color:#16a34a">' + d.tl.resolve.toFixed(1) + ' hrs</span></div><div class="lc-bd">' + d.events[2].ts + '</div></div>' +
    '<div class="lc-sum prob"><div class="lc-s-lbl" style="color:#ef4444">Actual</div><div class="lc-s-val" style="color:#ef4444">' + d.tl.total.toFixed(1) + ' hrs</div><div class="lc-s-sub">' + (d.tl.total / 24).toFixed(1) + ' days (+' + op + '% over)</div></div></div></div>' +
    '<div class="ab-list"><div class="ab-title">Cost Aberrations</div>' +
    d.costs.map(c =>
      '<div class="ab-row"><div style="flex:1"><div class="ab-name">' + c.item.split('(')[0].trim() + '</div><div class="ab-det">' + (c.days ? c.days + ' days × $' + c.rate + '/day' : 'One-time') + '</div></div><div class="ab-cost">$' + c.total.toLocaleString() + '</div></div>'
    ).join('') +
    '</div>' +
    '<div class="lc-impact"><div class="lc-im-ttl">Impact Summary</div><div class="lc-im-grid">' +
    '<div class="lc-im-cell"><div class="lc-im-lbl">Extra Downtime</div><div class="lc-im-val">' + (d.tl.total - 48).toFixed(0) + ' hrs</div></div>' +
    '<div class="lc-im-cell"><div class="lc-im-lbl">Total Cost</div><div class="lc-im-val">$' + tot.toLocaleString() + '</div></div>' +
    '<div class="lc-im-cell"><div class="lc-im-lbl">Absorbed Loss</div><div class="lc-im-val">$' + d.absorbed.toLocaleString() + '</div></div>' +
    '</div></div>';
}
