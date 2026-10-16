const token = localStorage.getItem('token');
if (!token) window.location.href = '/';

const monthInput = document.getElementById('month');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const message = document.getElementById('message');

// Start with the current month and today's date
const today = new Date().toISOString().slice(0, 10);
dateInput.value = today;
monthInput.value = today.slice(0, 7);

// ---------- helper: talk to the API with the token attached ----------
async function api(path, method = 'GET', body) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('not logged in');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

function showError(err) {
  message.textContent = err.message;
}

// ---------- load things onto the page ----------
async function loadUser() {
  const data = await api('/me');
  document.getElementById('welcome').textContent = data.user.email + ' ';
}

async function loadCategories() {
  const categories = await api('/categories');
  categorySelect.innerHTML = '';

  const none = document.createElement('option');
  none.value = '';
  none.textContent = 'No category';
  categorySelect.appendChild(none);

  for (const c of categories) {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.name;
    categorySelect.appendChild(option);
  }
}

async function loadSummary() {
  const s = await api(`/summary?month=${monthInput.value}`);
  document.getElementById('total').textContent = `Total: ₹${s.total} (${s.count} expenses)`;

  const list = document.getElementById('summary-list');
  list.innerHTML = '';
  for (const row of s.byCategory) {
    const li = document.createElement('li');
    li.textContent = `${row.category}: ₹${row.total}`;
    list.appendChild(li);
  }
}

async function loadExpenses() {
  const expenses = await api(`/expenses?month=${monthInput.value}`);
  const list = document.getElementById('expense-list');
  list.innerHTML = '';

  if (expenses.length === 0) {
    list.textContent = 'No expenses this month.';
    return;
  }

  for (const e of expenses) {
    const li = document.createElement('li');

    const info = document.createElement('div');
    info.textContent = `₹${e.amount} · ${e.description || '(no description)'}`;
    const sub = document.createElement('div');
    sub.className = 'muted';
    sub.textContent = `${e.date} · ${e.category || 'Uncategorized'}`;
    info.appendChild(sub);

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.className = 'small danger';
    del.addEventListener('click', async () => {
      try {
        await api(`/expenses/${e.id}`, 'DELETE');
        refresh();
      } catch (err) { showError(err); }
    });

    li.appendChild(info);
    li.appendChild(del);
    list.appendChild(li);
  }
}

async function refresh() {
  message.textContent = '';
  try {
    await Promise.all([loadSummary(), loadExpenses()]);
  } catch (err) { showError(err); }
}

// ---------- forms ----------
document.getElementById('category-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.getElementById('category-name');
  try {
    await api('/categories', 'POST', { name: input.value });
    input.value = '';
    await loadCategories();
  } catch (err) { showError(err); }
});

document.getElementById('expense-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await api('/expenses', 'POST', {
      amount: parseFloat(document.getElementById('amount').value),
      description: document.getElementById('description').value,
      date: dateInput.value,
      category_id: categorySelect.value ? Number(categorySelect.value) : null,
    });
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    // jump to the month of the expense we just added so it's visible
    monthInput.value = dateInput.value.slice(0, 7);
    refresh();
  } catch (err) { showError(err); }
});

monthInput.addEventListener('change', refresh);

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/';
});

// ---------- start ----------
loadUser();
loadCategories();
refresh();