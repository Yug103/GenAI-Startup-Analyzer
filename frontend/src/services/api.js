const USER_KEY = 'ideavalidator_user';
const API_BASE = 'http://localhost:5000/api';

// Sends a POST request to authenticate the user and saves their profile and token on success
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Invalid email or password');
  }

  const data = await response.json();
  const nameParts = (data.user.full_name || '').split(' ');
  const user = {
    firstName: nameParts[0] || 'User',
    lastName: nameParts.slice(1).join(' ') || '',
    email: data.user.email,
    role: 'Founder'
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem('ideavalidator_token', data.token);
  return { token: data.token, user };
};

// Registers a new user with their full name and credentials, then automatically logs them in
export const register = async (firstName, lastName, email, password, role) => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'User';
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create account');
  }

  return login(email, password);
};
