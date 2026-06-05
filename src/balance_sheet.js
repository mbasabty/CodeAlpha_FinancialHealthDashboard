function loadBalanceChart() {
  Papa.parse('../data/balance_sheet.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const rows = results.data;
      new Chart(document.getElementById('balanceChart'), {
        type: 'bar',
        data: {
          labels: rows.map(r => r.month),
          datasets: [
            { label: 'Assets',      data: rows.map(r => Number(r.assets)),      backgroundColor: '#3266ad' },
            { label: 'Liabilities', data: rows.map(r => Number(r.liabilities)), backgroundColor: '#e24b4a' },
            { label: 'Equity',      data: rows.map(r => Number(r.equity)),      backgroundColor: '#1d9e75' }
          ]
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadBalanceChart();
});