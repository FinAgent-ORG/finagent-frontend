async function request(path, { body, method = "GET" } = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(path, {
    method,
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: "same-origin",
  });

  if (!response.ok) {
    let detail = "Request failed.";

    try {
      const payload = await response.json();
      detail = payload.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }

    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const authApi = {
  me: () => request("/api/v1/auth/me"),
  signin: (body) => request("/api/v1/auth/login", { body, method: "POST" }),
  signout: () => request("/api/v1/auth/logout", { method: "POST" }),
  signup: (body) => request("/api/v1/auth/signup", { body, method: "POST" }),
};

export const expenseApi = {
  createExpense: (body) => request("/api/v1/expenses", { body, method: "POST" }),
  extractExpenses: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/api/v1/expenses/extract", { body: formData, method: "POST" });
  },
  getTotals: () => request("/api/v1/expenses/totals"),
  listExpenses: () => request("/api/v1/expenses"),
};

export const insightsApi = {
  getSummary: () => request("/api/v1/insights/summary"),
};

export const chatApi = {
  sendMessage: (body) => request("/api/v1/chat/messages", { body, method: "POST" }),
};
