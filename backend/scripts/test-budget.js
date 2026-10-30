const BASE = 'http://localhost:3000';

async function call(method, path, body, token) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  console.log(`${method} ${path} -> ${res.status}`, data);
}

async function main() {
  const login = await fetch(BASE + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'YOUR_EMAIL', password: 'YOUR_PASSWORD' }),
  });
  const { token } = await login.json();

  await call('GET', '/budgets?month=2026-10', null, token);
  await call('PUT', '/budgets', { month: '2026-10', amount: 4000 }, token);
  await call('GET', '/budgets?month=2026-10', null, token);
  await call('PUT', '/budgets', { month: '2026-10', amount: 5000 }, token);
  await call('GET', '/budgets?month=2026-10', null, token);
  await call('PUT', '/budgets', { month: '2026-10', amount: 'lots' }, token);
}

main();