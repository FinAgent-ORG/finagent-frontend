const GATEWAY_URL = (import.meta.env.VITE_GATEWAY_URL ?? "").replace(/\/$/, "");

async function request(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let detail = "Request failed.";
    try {
      const payload = await response.json();
      detail = payload.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const authApi = {
  signup: (body) => request("/api/v1/auth/signup", { method: "POST", body }),
  signin: (body) => request("/api/v1/auth/login", { method: "POST", body }),
  me: (token) => request("/api/v1/auth/me", { token }),
};

export const expenseApi = {
  createExpense: (token, body) => request("/api/v1/expenses", { method: "POST", token, body }),
  listExpenses: (token) => request("/api/v1/expenses", { token }),
  getTotals: (token) => request("/api/v1/expenses/totals", { token }),
};

export const insightsApi = {
  getSummary: (token) => request("/api/v1/insights/summary", { token }),
};

export const chatApi = {
  sendMessage: (token, body) => request("/api/v1/chat/messages", { method: "POST", token, body }),
};
