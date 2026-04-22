const AUTH_API = import.meta.env.VITE_AUTH_API_URL ?? "";
const EXPENSE_API = import.meta.env.VITE_EXPENSE_API_URL ?? "";
const INSIGHTS_API = import.meta.env.VITE_INSIGHTS_API_URL ?? "";
const CHAT_API = import.meta.env.VITE_CHAT_API_URL ?? "";

async function request(baseUrl, path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
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
  signup: (body) => request(AUTH_API, "/api/v1/auth/signup", { method: "POST", body }),
  signin: (body) => request(AUTH_API, "/api/v1/auth/login", { method: "POST", body }),
  me: (token) => request(AUTH_API, "/api/v1/auth/me", { token }),
};

export const expenseApi = {
  createExpense: (token, body) => request(EXPENSE_API, "/api/v1/expenses", { method: "POST", token, body }),
  listExpenses: (token) => request(EXPENSE_API, "/api/v1/expenses", { token }),
  getTotals: (token) => request(EXPENSE_API, "/api/v1/expenses/totals", { token }),
};

export const insightsApi = {
  getSummary: (token) => request(INSIGHTS_API, "/api/v1/insights/summary", { token }),
};

export const chatApi = {
  sendMessage: (token, body) => request(CHAT_API, "/api/v1/chat/messages", { method: "POST", token, body }),
};
