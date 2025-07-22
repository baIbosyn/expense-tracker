const form = document.getElementById('expenseForm');
const list = document.getElementById('expenseList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: form.title.value,
    amount: parseFloat(form.amount.value),
    category: form.category.value,
    date: form.date.value,
    note: form.note.value
  };

  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    form.reset();
    loadExpenses();
  } else {
    alert('Ошибка при добавлении');
  }
});

async function loadExpenses() {
  const res = await fetch('/api/expenses');
  const data = await res.json();

  list.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title}: ${item.amount} ₸ [${item.category}]`;
    list.appendChild(li);
  });
}

loadExpenses();

document.getElementById('exportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const month = document.getElementById('monthSelect').value;
  const year = new Date().getFullYear();

  const url = `/api/analytics/export?month=${month}&year=${year}`;

  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${month}-${year}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

async function loadCategoryChart() {
  const chartCanvas = document.getElementById('categoryChart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const year = new Date().getFullYear();

  try {
    const res = await fetch(`/api/analytics/summary-by-category?month=${month}&year=${year}`);
    const data = await res.json();

    console.log("📊 Пришли данные для диаграммы:", data);

    if (!Array.isArray(data) || data.length === 0) {
      chartCanvas.replaceWith(document.createElement("p")).innerText = 'Нет данных для диаграммы';
      return;
    }

    const labels = data.map(item => item._id || "Без категории");
    const values = data.map(item => item.total || 0);

    // Удалим старый график, если он уже есть
    if (window.categoryChartInstance) {
      window.categoryChartInstance.destroy();
    }

    // Создание нового графика
    window.categoryChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Расходы по категориям',
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56',
            '#4BC0C0', '#9966FF', '#FF9F40',
            '#C9CBCF', '#7E57C2', '#26A69A'
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: `Категории расходов — ${month}.${year}`
          }
        }
      }
    });

  } catch (error) {
    console.error("❌ Ошибка загрузки диаграммы:", error);
  }
}

// URL Shortener
document.getElementById('shortenerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalUrl = document.getElementById('originalUrl').value;

  try {
    const res = await fetch('/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ originalUrl })
    });

    const data = await res.json();

    if (data.shortUrl) {
      document.getElementById('shortenedResult').innerHTML = `
        <p>Сокращённая ссылка:</p>
        <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
      `;
    } else {
      document.getElementById('shortenedResult').textContent = 'Ошибка при сокращении';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('shortenedResult').textContent = 'Ошибка при сокращении';
  }
});



loadExpenses();
loadCategoryChart();
