let incomeData = [];

const quarters = {
  Q1: ['Jan', 'Feb', 'Mar'],
  Q2: ['Apr', 'May', 'Jun']
};

function filterRows(rows, period) {
  if (period === 'all') return rows;
  return rows.filter(r => quarters[period].includes(r.month));
}

function formatCurrency(value) {
  return 'R' + Number(value).toLocaleString();
}

function updateKPIs(rows) {
  const totalRevenue  = rows.reduce((s, r) => s + Number(r.revenue), 0);
  const totalExpenses = rows.reduce((s, r) => s + Number(r.expenses), 0);
  const totalNet      = rows.reduce((s, r) => s + Number(r.net_income), 0);

  document.getElementById('kpiRevenue').textContent  = formatCurrency(totalRevenue);
  document.getElementById('kpiExpenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('kpiNetIncome').textContent = formatCurrency(totalNet);
}

let revenueChart, balanceChart, cashFlowChart;

function loadIncomeChart(period = 'all') {
  Papa.parse('./data/income_statement.csv', {
    download: true,
    header: true,
    complete: function(results) {
      incomeData = results.data.filter(r => r.month);
      const rows = filterRows(incomeData, period);

      updateKPIs(rows);

      const data = {
        labels: rows.map(r => r.month),
        datasets: [
          { label: 'Revenue',  data: rows.map(r => Number(r.revenue)),  borderColor: '#3266ad', fill: false },
          { label: 'Expenses', data: rows.map(r => Number(r.expenses)), borderColor: '#e24b4a', fill: false }
        ]
      };

      if (revenueChart) revenueChart.destroy();
      revenueChart = new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: data,
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  });
}

function loadBalanceChart(period = 'all') {
  Papa.parse('./data/balance_sheet.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const rows = filterRows(results.data.filter(r => r.month), period);

      const assets = rows.reduce((s, r) => s + Number(r.assets), 0);
      document.getElementById('kpiAssets').textContent = formatCurrency(assets / rows.length);

      const data = {
        labels: rows.map(r => r.month),
        datasets: [
          { label: 'Assets',      data: rows.map(r => Number(r.assets)),      backgroundColor: '#3266ad' },
          { label: 'Liabilities', data: rows.map(r => Number(r.liabilities)), backgroundColor: '#e24b4a' },
          { label: 'Equity',      data: rows.map(r => Number(r.equity)),      backgroundColor: '#1d9e75' }
        ]
      };

      if (balanceChart) balanceChart.destroy();
      balanceChart = new Chart(document.getElementById('balanceChart'), {
        type: 'bar',
        data: data,
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  });
}

function loadCashFlowChart(period = 'all') {
  Papa.parse('./data/cash_flow.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const rows = filterRows(results.data.filter(r => r.month), period);

      const data = {
        labels: rows.map(r => r.month),
        datasets: [
          { label: 'Operating', data: rows.map(r => Number(r.operating)), backgroundColor: '#3266ad' },
          { label: 'Investing', data: rows.map(r => Number(r.investing)), backgroundColor: '#e24b4a' },
          { label: 'Financing', data: rows.map(r => Number(r.financing)), backgroundColor: '#1d9e75' }
        ]
      };

      if (cashFlowChart) cashFlowChart.destroy();
      cashFlowChart = new Chart(document.getElementById('cashFlowChart'), {
        type: 'bar',
        data: data,
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  });
}

function loadAll(period) {
  loadIncomeChart(period);
  loadBalanceChart(period);
  loadCashFlowChart(period);
}

document.addEventListener('DOMContentLoaded', function() {
  loadAll('all');

  document.getElementById('periodFilter').addEventListener('change', function() {
    loadAll(this.value);
  });
});