const form = document.getElementById('auth-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const switchText = document.getElementById('switch-text');
const switchLink = document.getElementById('switch-link');

let mode = 'login'; // or 'register'

// Already logged in? Skip this page.
if (localStorage.getItem('token')) {
  window.location.href = '/dashboard.html';
}

// Switch between Log in and Register
switchLink.addEventListener('click', (event) => {
  event.preventDefault();
  mode = mode === 'login' ? 'register' : 'login';

  const isRegister = mode === 'register';
  nameInput.hidden = !isRegister;
  formTitle.textContent = isRegister ? 'Create account' : 'Log in';
  submitBtn.textContent = isRegister ? 'Register' : 'Log in';
  switchText.textContent = isRegister ? 'Already have an account?' : 'New here?';
  switchLink.textContent = isRegister ? 'Log in' : 'Create an account';
  message.textContent = '';
});

// Submit the form
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';

  const body = {
    email: emailInput.value,
    password: passwordInput.value,
  };
  if (mode === 'register') body.name = nameInput.value;

  try {
    const res = await fetch(`/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.error || 'Something went wrong';
      return;
    }

    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard.html';
  } catch (err) {
    message.textContent = 'Cannot reach the server';
  }
});