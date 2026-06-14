const USER_KEY = 'ideavalidator_user';
const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

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

export const googleLogin = async (credential) => {
  const response = await fetch(`${API_BASE}/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Google login failed');
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('ideavalidator_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const analyzeIdea = async (ideaId, force = false) => {
  const url = force ? `${API_BASE}/ideas/${ideaId}/analyze?force=true` : `${API_BASE}/ideas/${ideaId}/analyze`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to analyze idea');
  return data;
};

export const getReport = async (ideaId) => {
  const response = await fetch(`${API_BASE}/ideas/${ideaId}/report`, {
    headers: getAuthHeaders(),
    cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to get report');
  return data;
};

export const generateValidation = async (ideaId, force = false) => {
  const url = force ? `${API_BASE}/ideas/${ideaId}/validate?force=true` : `${API_BASE}/ideas/${ideaId}/validate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to generate validation');
  return data;
};

export const getValidation = async (ideaId) => {
  const response = await fetch(`${API_BASE}/ideas/${ideaId}/validation`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to get validation');
  return data;
};

export const getComparison = async () => {
  const response = await fetch(`${API_BASE}/ideas/compare`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to get comparison data');
  return data;
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to send reset link');
  return data;
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Invalid or expired OTP');
  return data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, new_password: newPassword })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to reset password');
  return data;
};
