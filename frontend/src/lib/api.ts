const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('formiq_token');
}

export function setToken(token: string) {
  localStorage.setItem('formiq_token', token);
}

export function clearToken() {
  localStorage.removeItem('formiq_token');
  localStorage.removeItem('formiq_user');
  localStorage.removeItem('formiq_org');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

// Auth
export const api = {
  auth: {
    register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request<any>('/auth/me'),
    refreshApiKey: () => request<any>('/auth/refresh-api-key', { method: 'POST' }),
  },
  documents: {
    upload: (formData: FormData) => request<any>('/documents/upload', { method: 'POST', body: formData }),
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any>(`/documents${qs}`);
    },
    get: (id: string) => request<any>(`/documents/${id}`),
    updateFields: (id: string, fields: Record<string, any>) =>
      request<any>(`/documents/${id}/fields`, { method: 'PATCH', body: JSON.stringify({ fields }) }),
    approve: (id: string) => request<any>(`/documents/${id}/approve`, { method: 'POST' }),
    delete: (id: string) => request<any>(`/documents/${id}`, { method: 'DELETE' }),
  },
  templates: {
    list: () => request<any[]>('/templates'),
    get: (id: string) => request<any>(`/templates/${id}`),
    create: (body: any) => request<any>('/templates', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request<any>(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<any>(`/templates/${id}`, { method: 'DELETE' }),
  },
  records: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any>(`/records${qs}`);
    },
    get: (id: string) => request<any>(`/records/${id}`),
    exportUrl: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return `${BASE_URL}/records/export${qs}&token=${getToken()}`;
    },
  },
  org: {
    usage: () => request<any>('/org/usage'),
    members: () => request<any[]>('/org/members'),
    invite: (body: any) => request<any>('/org/invite', { method: 'POST', body: JSON.stringify(body) }),
    updateMember: (id: string, body: any) => request<any>(`/org/members/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    removeMember: (id: string) => request<any>(`/org/members/${id}`, { method: 'DELETE' }),
    profile: () => request<any>('/org/profile'),
    updateProfile: (body: any) => request<any>('/org/profile', { method: 'PATCH', body: JSON.stringify(body) }),
    webhook: () => request<any>('/webhooks'),
    setWebhook: (body: any) => request<any>('/webhooks', { method: 'PUT', body: JSON.stringify(body) }),
    testWebhook: () => request<any>('/webhooks/test', { method: 'POST' }),
  },
  billing: {
    getPlans: () => request<any>('/billing/plans'),
    createCheckoutSession: (planCode: string) =>
      request<{ url: string }>('/billing/create-checkout-session', { method: 'POST', body: JSON.stringify({ planCode }) }),
    cancelSubscription: () =>
      request<{ message: string }>('/billing/cancel-subscription', { method: 'POST', body: JSON.stringify({}) }),
  },
};
