const BASE = 'http://localhost:3000';

async function main() {
  const login = await fetch(BASE + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testguy1@gmail.com', password: 'testguy1' }),
  });
  const loginData = await login.json();
  console.log('LOGIN:', login.status);

  if (!loginData.token) {
    console.log('Login failed:', loginData);
    return;
  }

  const res = await fetch(BASE + '/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginData.token}`,
    },
    body: JSON.stringify({ month: '2026-10' }),
  });

  console.log('INSIGHTS:', res.status);
  console.log(await res.json());
}

main();