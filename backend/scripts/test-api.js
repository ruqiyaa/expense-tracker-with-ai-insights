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
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text.slice(0, 300); }
  console.log(`${method} ${path} -> ${res.status}`, data);
  return data;
}

async function main() {
  const creds = { email: 'testguy1@gmail.com', password: 'testguy1' };

  // log in, or register if the user doesn't exist yet
  let auth = await call('POST', '/auth/login', creds);
  if (!auth.token) {
    auth = await call('POST', '/auth/register', { name: 'Test', ...creds });
  }
  const token = auth.token;

  const food = await call('POST', '/categories', { name: 'Food' }, token);
  const travel = await call('POST', '/categories', { name: 'Travel' }, token);

  await call('POST', '/expenses', { amount: 250, description: 'Lunch', date: '2026-10-10', category_id: food.id }, token);
  await call('POST', '/expenses', { amount: 500, description: 'Auto and metro', date: '2026-10-12', category_id: travel.id }, token);
  await call('POST', '/expenses', { amount: 100, description: 'Misc', date: '2026-10-15' }, token);

  await call('GET', '/expenses', null, token);
  await call('GET', '/summary?month=2026-10', null, token);
}

main();