function loadCashFlowChart() {
    Papa.parse('../data/cash_flow.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const rows = results.data;
      new Chart(document.getElementById('cashFlowChart'), {
        type: 'bar',
        data: {
          labels: rows.map(r => r.month),
          datasets: [
            { label: 'Operating',  data: rows.map(r => Number(r.operating)),  backgroundColor: '#3266ad' },
            { label: 'Investing',  data: rows.map(r => Number(r.investing)),  backgroundColor: '#e24b4a' },
            { label: 'Financing',  data: rows.map(r => Number(r.financing)),  backgroundColor: '#1d9e75' }
          ]
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadCashFlowChart();
});