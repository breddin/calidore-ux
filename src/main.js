import { openModal, closeModal, switchTab as switchModalTab } from './modal.js';
import { openAgent, closeAgent, switchAgentTier, renderAgentTier, selectScenario, runAgent } from './agent.js';
import { tick, scrollToSec, setTab, applyFilter, selectDiv, renderScoreBars } from './dashboard.js';
import { initCharts } from './charts.js';

// ── Expose to global scope for inline onclick handlers ─────────────
window.openModal      = openModal;
window.closeModal     = closeModal;
window.switchTab      = switchModalTab;   // modal tab switcher
window.openAgent      = openAgent;
window.closeAgent     = closeAgent;
window.switchAgentTier= switchAgentTier;
window.selectScenario = selectScenario;
window.runAgent       = runAgent;
window.scrollToSec    = scrollToSec;
window.setTab         = setTab;           // dashboard topbar tab filter
window.applyFilter    = applyFilter;
window.selectDiv      = selectDiv;

// ── Keyboard / focus listeners ─────────────────────────────────────
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeModal(); closeAgent(); }
});

document.getElementById('mask').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── Bootstrap ──────────────────────────────────────────────────────
initCharts();
renderScoreBars();
renderAgentTier();
setInterval(tick, 1000);
tick();
