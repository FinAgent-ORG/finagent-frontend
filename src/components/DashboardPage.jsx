"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { chatApi, expenseApi, insightsApi } from "@/src/lib/api-client.js";
import { sanitizeLines, sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Groceries", "Rent", "Healthcare", "Other"];

export default function DashboardPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { setError } = useAppError();
  const [totals, setTotals] = useState({ today: 0, month: 0, year: 0 });
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState({ insights: [], suggestions: [] });
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "Other", description: "", currency: "INR" });

  async function refresh() {
    setError("");

    try {
      const [nextTotals, nextExpenses, nextInsights] = await Promise.all([
        expenseApi.getTotals(),
        expenseApi.listExpenses(),
        insightsApi.getSummary(),
      ]);

      setTotals(nextTotals);
      setExpenses(nextExpenses);
      setInsights({
        insights: sanitizeLines(nextInsights.insights ?? []),
        suggestions: sanitizeLines(nextInsights.suggestions ?? []),
      });
    } catch (error) {
      if (error.status === 401) {
        router.replace("/signin");
        return;
      }
      setError(sanitizeText(error.message));
    }
  }

  useEffect(() => {
    if (!loading && user) {
      refresh();
    }
  }, [loading, user]);

  async function handleExpenseSubmit(event) {
    event.preventDefault();
    setExpenseLoading(true);

    try {
      await expenseApi.createExpense({
        amount: Number(expenseForm.amount),
        currency: expenseForm.currency,
        category: expenseForm.category,
        description: expenseForm.description,
      });
      setExpenseForm({ amount: "", category: "Other", description: "", currency: "INR" });
      await refresh();
    } catch (error) {
      setError(sanitizeText(error.message));
    } finally {
      setExpenseLoading(false);
    }
  }

  async function handleChatSubmit(event) {
    event.preventDefault();
    if (!chatMessage.trim()) {
      return;
    }

    const outgoing = { role: "user", text: sanitizeText(chatMessage) };
    const nextHistory = [...chatHistory, outgoing];
    setChatHistory((current) => [...current, outgoing]);
    setChatMessage("");
    setChatLoading(true);

    try {
      const response = await chatApi.sendMessage({
        message: outgoing.text,
        history: nextHistory,
      });

      setChatHistory((current) => [...current, { role: "assistant", text: sanitizeText(response.response) }]);
      await refresh();
    } catch (error) {
      setError(sanitizeText(error.message));
      setChatHistory((current) => [
        ...current,
        { role: "assistant", text: "I could not complete that request right now." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  if (loading || !user) {
    return (
      <section className="panel session-message">
        <div className="eyebrow">Session</div>
        <h1>Loading your workspace...</h1>
      </section>
    );
  }

  return (
    <section className="dashboard-grid">
      <section className="panel dashboard-section span-4 stack">
        <div>
          <div className="eyebrow">Identity</div>
          <h2 className="card-title">Welcome back</h2>
          <p className="muted">{user.email}</p>
        </div>
        <div className="stat">
          <span className="stat-label">Today</span>
          <strong>{totals.today.toFixed(2)} INR</strong>
        </div>
        <div className="stat">
          <span className="stat-label">This month</span>
          <strong>{totals.month.toFixed(2)} INR</strong>
        </div>
        <div className="stat">
          <span className="stat-label">This year</span>
          <strong>{totals.year.toFixed(2)} INR</strong>
        </div>
      </section>

      <section className="panel dashboard-section span-8">
        <div className="eyebrow">Expenses</div>
        <h2 className="card-title">Capture a new expense</h2>
        <form className="expense-form" onSubmit={handleExpenseSubmit}>
          <div className="expense-form-grid">
            <input
              min="0.01"
              onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
              placeholder="Amount"
              required
              step="0.01"
              type="number"
              value={expenseForm.amount}
            />
            <select
              onChange={(event) => setExpenseForm((current) => ({ ...current, category: event.target.value }))}
              value={expenseForm.category}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <input
            maxLength={500}
            onChange={(event) => setExpenseForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Description"
            required
            type="text"
            value={expenseForm.description}
          />
          <button className="button" disabled={expenseLoading} type="submit">
            {expenseLoading ? "Saving..." : "Save Expense"}
          </button>
        </form>
      </section>

      <section className="panel dashboard-section span-6">
        <div className="eyebrow">Chat</div>
        <h2 className="card-title">Ask FinAgent</h2>
        <div className="chat-log">
          {chatHistory.map((item, index) => (
            <div className={`bubble ${item.role}`} key={`${item.role}-${index}`}>
              {item.text}
            </div>
          ))}
          {chatLoading ? <div className="bubble assistant">FinAgent is thinking...</div> : null}
        </div>
        <form className="chat-form" onSubmit={handleChatSubmit}>
          <input
            className="chat-input"
            onChange={(event) => setChatMessage(event.target.value)}
            placeholder="Try: I spent 250 on groceries"
            type="text"
            value={chatMessage}
          />
          <button className="button" disabled={chatLoading} type="submit">
            {chatLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>

      <section className="panel dashboard-section span-6 stack">
        <div>
          <div className="eyebrow">Insights</div>
          <h2 className="card-title">What changed</h2>
          <ul className="clean">
            {insights.insights.map((line) => (
              <li className="list-item" key={line}>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow">Suggestions</div>
          <h2 className="card-title">What to do next</h2>
          <ul className="clean">
            {insights.suggestions.map((line) => (
              <li className="list-item" key={line}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel dashboard-section span-12">
        <div className="eyebrow">Ledger</div>
        <h2 className="card-title">Recent expenses</h2>
        <ul className="clean">
          {expenses.map((expense) => (
            <li className="list-item" key={expense.id}>
              {sanitizeText(expense.description)} | {expense.category} | {Number(expense.amount).toFixed(2)}{" "}
              {sanitizeText(expense.currency)} | {expense.expense_date}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
