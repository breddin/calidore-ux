// Chart.js is loaded globally from CDN in index.html
/* global Chart */

export function initCharts() {
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: { color: '#7a99bb', boxWidth: 10, padding: 14, font: { family: 'DM Sans', size: 10 } }
      }
    },
    scales: {
      x: { ticks: { color: '#a0b5cc', font: { family: 'DM Sans', size: 10 } }, grid: { color: '#f0f5fc' }, border: { color: '#dce6f5' } },
      y: { ticks: { color: '#a0b5cc', font: { family: 'DM Sans', size: 10 } }, grid: { color: '#f0f5fc' }, border: { color: '#dce6f5' } }
    }
  };

  // Revenue & Margin Trend
  new Chart(document.getElementById('revChart'), {
    type: 'line',
    data: {
      labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      datasets: [
        {
          label: 'Revenue ($K)', data: [1820, 1910, 1980, 2050, 2090, 2140],
          borderColor: '#1a4fd8', backgroundColor: 'rgba(26,79,216,.1)', borderWidth: 2, tension: .4,
          fill: true, yAxisID: 'y', pointRadius: 3, pointBackgroundColor: '#1a4fd8',
          pointBorderColor: '#fff', pointBorderWidth: 2
        },
        {
          label: 'Margin %', data: [16.8, 17.1, 17.8, 18.0, 18.2, 18.4],
          borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,.08)', borderWidth: 2, tension: .4,
          fill: true, yAxisID: 'y1', pointRadius: 3, pointBackgroundColor: '#0d9488',
          pointBorderColor: '#fff', pointBorderWidth: 2
        },
        {
          label: 'Target 22%', data: [22, 22, 22, 22, 22, 22],
          borderColor: 'rgba(239,68,68,.4)', borderDash: [5, 4], borderWidth: 1.5,
          tension: 0, yAxisID: 'y1', pointRadius: 0
        }
      ]
    },
    options: {
      ...baseOpts,
      plugins: {
        ...baseOpts.plugins,
        tooltip: {
          callbacks: {
            label: (c) => c.datasetIndex === 0
              ? c.dataset.label + ': $' + c.parsed.y + 'K'
              : c.dataset.label + ': ' + c.parsed.y + '%'
          }
        }
      },
      scales: {
        x: baseOpts.scales.x,
        y: {
          ...baseOpts.scales.y, position: 'left',
          title: { display: true, text: 'Revenue ($K)', color: '#a0b5cc', font: { family: 'DM Sans', size: 10 } }
        },
        y1: {
          ...baseOpts.scales.y, position: 'right', min: 0, max: 30,
          title: { display: true, text: 'Margin %', color: '#a0b5cc', font: { family: 'DM Sans', size: 10 } },
          grid: { drawOnChartArea: false, color: '#f0f5fc' }
        }
      }
    }
  });

  // Performance Score Trend
  new Chart(document.getElementById('csatChart'), {
    type: 'line',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'EDI', data: [4.3, 4.3, 4.4, 4.4, 4.3, 4.4],
          borderColor: '#1a4fd8', backgroundColor: 'rgba(26,79,216,.08)', fill: true,
          borderWidth: 2, tension: .4, pointRadius: 3, pointBackgroundColor: '#1a4fd8',
          pointBorderColor: '#fff', pointBorderWidth: 2
        },
        {
          label: 'P44', data: [3.8, 3.7, 3.9, 3.9, 3.8, 3.9],
          borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,.06)', fill: true,
          borderWidth: 2, tension: .4, pointRadius: 3, pointBackgroundColor: '#7c3aed',
          pointBorderColor: '#fff', pointBorderWidth: 2
        },
        {
          label: 'Macropoint', data: [3.3, 3.2, 3.1, 3.3, 3.2, 3.4],
          borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.06)', fill: true,
          borderWidth: 2, tension: .4, pointRadius: 3, pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff', pointBorderWidth: 2
        },
        {
          label: 'Asset', data: [2.9, 2.8, 2.7, 2.8, 2.7, 2.8],
          borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.05)', fill: true,
          borderWidth: 2, tension: .4, pointRadius: 3, pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff', pointBorderWidth: 2
        }
      ]
    },
    options: {
      ...baseOpts,
      plugins: {
        ...baseOpts.plugins,
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.y.toFixed(1) + '/5.0' } }
      },
      scales: {
        x: baseOpts.scales.x,
        y: { ...baseOpts.scales.y, min: 0, max: 5, ticks: { ...baseOpts.scales.y.ticks, stepSize: .5 } }
      }
    }
  });

  // Cost Leakage Doughnut
  new Chart(document.getElementById('costChart'), {
    type: 'doughnut',
    data: {
      labels: ['Margin Leakage', '24/7 Call Overhead', 'Maintenance Downtime', 'Idle Trucks'],
      datasets: [{
        data: [41000, 28000, 18200, 14400],
        backgroundColor: ['#ef4444', '#f59e0b', '#1a4fd8', '#bfdbfe'],
        borderWidth: 0, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#7a99bb', boxWidth: 10, padding: 10, font: { family: 'DM Sans', size: 10 } } },
        tooltip: {
          callbacks: {
            label: (c) => {
              const t = c.dataset.data.reduce((a, b) => a + b, 0);
              return c.label + ': $' + (c.parsed / 1000).toFixed(0) + 'K (' + ((c.parsed / t) * 100).toFixed(0) + '%)';
            }
          }
        }
      },
      cutout: '68%'
    }
  });
}
