const API_ROOT = 'http://127.0.0.1:8000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function authFetch(url, options = {}) {
  const headers = getAuthHeaders();
  const fullUrl = `${API_ROOT}${url}`;

  const res = await fetch(fullUrl, { ...options, headers });
  if (res.status === 401) {
    // Optionally implement token refresh here
    alert("Session expired. Please log in again.");
    window.location.href = 'login.html';
    return;
  }

  return res.json();
}
