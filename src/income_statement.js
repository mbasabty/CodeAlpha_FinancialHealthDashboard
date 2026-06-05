function loadIncomeChart() {
  Papa.parse('../data/income_statement.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const rows = results.data;

      const labels   = rows.map(r => r.month);
      const revenue  = rows.map(r => Number(r.revenue));
      const expenses = rows.map(r => Number(r.expenses));

      new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Revenue',  data: revenue,  borderColor: '#3266ad' },
            { label: 'Expenses', data: expenses, borderColor: '#e24b4a' }
          ]
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadIncomeChart();
});