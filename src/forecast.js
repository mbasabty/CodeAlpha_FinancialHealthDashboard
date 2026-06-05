function linearRegression(values) {
  const n = values.length;
  const sumX = values.reduce((s, _, i) => s + i, 0);
  const sumY = values.reduce((s, v) => s + v, 0);
  const sumXY = values.reduce((s, v, i) => s + i * v, 0);
  const sumX2 = values.reduce((s, _, i) => s + i * i, 0);

  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function generateForecast(values, monthsAhead = 3) {
  const { slope, intercept } = linearRegression(values);
  const n = values.length;

  return Array.from({ length: monthsAhead }, (_, i) => {
    const predicted = slope * (n + i) + intercept;
    return Math.round(predicted);
  });
}

function loadForecastChart() {
  Papa.parse('../data/income_statement.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const rows = results.data.filter(r => r.month);

      const historicLabels   = rows.map(r => r.month);
      const historicRevenue  = rows.map(r => Number(r.revenue));
      const historicExpenses = rows.map(r => Number(r.expenses));
      const historicNet      = rows.map(r => Number(r.net_income));

      const forecastLabels   = ['Jul', 'Aug', 'Sep'];
      const forecastRevenue  = generateForecast(historicRevenue);
      const forecastExpenses = generateForecast(historicExpenses);
      const forecastNet      = generateForecast(historicNet);

      const allLabels = [...historicLabels, ...forecastLabels];

      const revenueFull  = [...historicRevenue,  ...Array(3).fill(null)];
      const expensesFull = [...historicExpenses, ...Array(3).fill(null)];
      const netFull      = [...historicNet,       ...Array(3).fill(null)];

      const revenueForecastFull  = [...Array(historicLabels.length - 1).fill(null), historicRevenue.at(-1),  ...forecastRevenue];
      const expensesForecastFull = [...Array(historicLabels.length - 1).fill(null), historicExpenses.at(-1), ...forecastExpenses];
      const netForecastFull      = [...Array(historicLabels.length - 1).fill(null), historicNet.at(-1),      ...forecastNet];

      new Chart(document.getElementById('forecastChart'), {
        type: 'line',
        data: {
          labels: allLabels,
          datasets: [
            {
              label: 'Revenue (Actual)',
              data: revenueFull,
              borderColor: '#3266ad',
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            },
            {
              label: 'Revenue (Forecast)',
              data: revenueForecastFull,
              borderColor: '#3266ad',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            },
            {
              label: 'Expenses (Actual)',
              data: expensesFull,
              borderColor: '#e24b4a',
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            },
            {
              label: 'Expenses (Forecast)',
              data: expensesForecastFull,
              borderColor: '#e24b4a',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            },
            {
              label: 'Net Income (Actual)',
              data: netFull,
              borderColor: '#1d9e75',
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            },
            {
              label: 'Net Income (Forecast)',
              data: netForecastFull,
              borderColor: '#1d9e75',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 4,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });

      updateForecastKPIs(forecastRevenue, forecastExpenses, forecastNet);
    }
  });
}

function updateForecastKPIs(revenue, expenses, net) {
  document.getElementById('forecastRevenue').textContent  = '$' + revenue.reduce((a, b) => a + b, 0).toLocaleString();
  document.getElementById('forecastExpenses').textContent = '$' + expenses.reduce((a, b) => a + b, 0).toLocaleString();
  document.getElementById('forecastNet').textContent      = '$' + net.reduce((a, b) => a + b, 0).toLocaleString();
}

document.addEventListener('DOMContentLoaded', function() {
  loadForecastChart();
});