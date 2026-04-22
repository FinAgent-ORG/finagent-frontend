import { useEffect, useState } from "react";

import { chatApi, expenseApi, insightsApi } from "../lib/api";
import { sanitizeLines, sanitizeText } from "../lib/sanitize";
import { useAppError } from "../state/AppErrorContext";
import { useAuth } from "../state/AuthContext";

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Groceries", "Rent", "Healthcare", "Other"];

export default function DashboardPage() {
  const { token, user } = useAuth();
  const { setError } = useAppError();
  const [totals, setTotals] = useState({ today: 0, month: 0, year: 0 });
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState({ insights: [], suggestions: [] });
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "Other", description: "", currency: "INR" });

  async function refresh() {
    setError("");
    try {
      const [nextTotals, nextExpenses, nextInsights] = await Promise.all([
        expenseApi.getTotals(token),
        expenseApi.listExpenses(token),
        insightsApi.getSummary(token),
      ]);
      setTotals(nextTotals);
      setExpenses(nextExpenses);
      setInsights({
        insights: sanitizeLines(nextInsights.insights ?? []),
        suggestions: sanitizeLines(nextInsights.suggestions ?? []),
      });
    } catch (error) {
      setError(sanitizeText(error.message));
    }
  }

  useEffect(() => {
    refresh();
  }, [token]);

  async function handleExpenseSubmit(event) {
    event.preventDefault();
    try {
      await expenseApi.createExpense(token, {
        amount: Number(expenseForm.amount),
        currency: expenseForm.currency,
        category: expenseForm.category,
        description: expenseForm.description,
      });
      setExpenseForm({ amount: "", category: "Other", description: "", currency: "INR" });
      await refresh();
    } catch (error) {
      setError(sanitizeText(error.message));
    }
  }

  async function handleChatSubmit(event) {
    event.preventDefault();
    if (!chatMessage.trim()) {
      return;
    }
    const outgoing = { role: "user", text: sanitizeText(chatMessage) };
    setChatHistory((current) => [...current, outgoing]);
    setChatMessage("");
    setChatLoading(true);

    try {
      const response = await chatApi.sendMessage(token, {
        message: outgoing.text,
        history: chatHistory,
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

  return (
    <section className="dashboard-grid">
      <section className="panel span-4 stack">
        <h2>Welcome</h2>
        <p className="muted">{user?.email}</p>
        <div className="stat">
          Today
          <strong>{totals.today.toFixed(2)} INR</strong>
        </div>
        <div className="stat">
          This Month
          <strong>{totals.month.toFixed(2)} INR</strong>
        </div>
        <div className="stat">
          This Year
          <strong>{totals.year.toFixed(2)} INR</strong>
        </div>
      </section>

      <section className="panel span-8">
        <h2>Add Expense</h2>
        <form className="expense-form" onSubmit={handleExpenseSubmit}>
          <div className="expense-form-grid">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              value={expenseForm.amount}
              onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
              required
            />
            <select
              value={expenseForm.category}
              onChange={(event) => setExpenseForm((current) => ({ ...current, category: event.target.value }))}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            maxLength={500}
            placeholder="Description"
            value={expenseForm.description}
            onChange={(event) => setExpenseForm((current) => ({ ...current, description: event.target.value }))}
            required
          />
          <button className="button" type="submit">
            Save Expense
          </button>
        </form>
      </section>

      <section className="panel span-6">
        <h2>Chat</h2>
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
            type="text"
            placeholder="Try: I spent 250 on groceries"
            value={chatMessage}
            onChange={(event) => setChatMessage(event.target.value)}
          />
          <button className="button" type="submit" disabled={chatLoading}>
            {chatLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>

      <section className="panel span-6 stack">
        <div>
          <h2>Insights</h2>
          <ul className="clean">
            {insights.insights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Suggestions</h2>
          <ul className="clean">
            {insights.suggestions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel span-12">
        <h2>Recent Expenses</h2>
        <ul className="clean">
          {expenses.map((expense) => (
            <li key={expense.id}>
              {sanitizeText(expense.description)} | {expense.category} | {Number(expense.amount).toFixed(2)}{" "}
              {sanitizeText(expense.currency)} | {expense.expense_date}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
