const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const loginSection = document.getElementById('login-section');
const formSection = document.getElementById('form-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const applicationForm = document.getElementById('application-form');
const submitBtn = document.getElementById('submit-btn');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

// Check if user is logged in on popup open
document.addEventListener('DOMContentLoaded', async () => {
  const token = await getStoredToken();

  if (token) {
    showFormSection();
    prefillJobUrl();
  } else {
    showLoginSection();
  }
});

// Login functionality
loginBtn.addEventListener('click', async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showLoginError('Please enter email and password');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token
    await chrome.storage.local.set({ token: data.data.token });

    showFormSection();
    prefillJobUrl();
    loginError.textContent = '';
  } catch (error) {
    showLoginError(error.message);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// Logout functionality
logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove('token');
  showLoginSection();
  applicationForm.reset();
});

// Form submission
applicationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = await getStoredToken();
  if (!token) {
    showError('Please login first');
    return;
  }

  const formData = {
    company: document.getElementById('company').value.trim(),
    position: document.getElementById('position').value.trim(),
    status: document.getElementById('status').value,
    job_url: document.getElementById('job_url').value.trim(),
    location: document.getElementById('location').value.trim(),
    salary_range: document.getElementById('salary_range').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    applied_date: new Date().toISOString().split('T')[0],
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';

  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add application');
    }

    showSuccess();
    applicationForm.reset();
    prefillJobUrl();
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Application';
  }
});

// Helper Functions
async function getStoredToken() {
  const result = await chrome.storage.local.get('token');
  return result.token;
}

function showLoginSection() {
  loginSection.classList.remove('hidden');
  formSection.classList.add('hidden');
  loginEmail.value = '';
  loginPassword.value = '';
  loginError.textContent = '';
}

function showFormSection() {
  loginSection.classList.add('hidden');
  formSection.classList.remove('hidden');
}

function showLoginError(message) {
  loginError.textContent = message;
}

function showSuccess() {
  successMessage.classList.remove('hidden');
  errorMessage.textContent = '';
  setTimeout(() => {
    successMessage.classList.add('hidden');
  }, 3000);
}

function showError(message) {
  errorMessage.textContent = message;
  successMessage.classList.add('hidden');
}

async function prefillJobUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      document.getElementById('job_url').value = tab.url;
    }
  } catch (error) {
    console.error('Error getting current tab URL:', error);
  }
}
