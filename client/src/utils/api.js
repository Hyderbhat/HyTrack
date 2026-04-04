let authToken = null;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function setApiToken(token) {
  authToken = token || null;
}

async function request(method, path, body) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `${method} ${path} failed: ${res.status}`;

    try {
      const payload = await res.json();
      message = payload.error || payload.message || message;
    } catch {
      const text = await res.text();
      message = text || message;
    }

    throw new Error(message);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const api = {
  get(path) {
    return request('GET', path);
  },
  post(path, body) {
    return request('POST', path, body);
  },
  patch(path, body) {
    return request('PATCH', path, body);
  },
};
