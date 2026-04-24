"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { expenseApi } from "@/src/lib/api-client.js";
import { sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Groceries", "Rent", "Healthcare", "Other"];

export default function DashboardPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { setError } = useAppError();
  const [totals, setTotals] = useState({ today: 0, month: 0, year: 0 });
  const [expenses, setExpenses] = useState([]);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "Other", description: "", currency: "INR" });
  const [attachment, setAttachment] = useState(null);
  const [extractedExpenses, setExtractedExpenses] = useState([]);
  const [extractionNotes, setExtractionNotes] = useState([]);

  async function refresh() {
    setError("");

    try {
      const [nextTotals, nextExpenses] = await Promise.all([expenseApi.getTotals(), expenseApi.listExpenses()]);
      setTotals(nextTotals);
      setExpenses(nextExpenses);
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
    setError("");

    try {
      if (attachment) {
        const extraction = await expenseApi.extractExpenses(attachment);
        setExtractedExpenses(extraction.expenses ?? []);
        setExtractionNotes(extraction.notes ?? []);
        return;
      }

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

  async function handleImportExtracted() {
    if (!extractedExpenses.length) {
      return;
    }

    setExtracting(true);
    setError("");

    try {
      await Promise.all(
        extractedExpenses.map((expense) =>
          expenseApi.createExpense({
            amount: Number(expense.amount),
            category: expense.category,
            currency: expense.currency,
            description: expense.description,
            expense_date: expense.expense_date || undefined,
          }),
        ),
      );
      setAttachment(null);
      setExtractedExpenses([]);
      setExtractionNotes(["Imported extracted expenses into your ledger."]);
      await refresh();
    } catch (error) {
      setError(sanitizeText(error.message));
    } finally {
      setExtracting(false);
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
      <section className="panel dashboard-section span-12 dashboard-hero">
        <div className="dashboard-summary">
          <div>
            <div className="eyebrow">Dashboard</div>
            <h1 className="card-title">A cleaner command center for expense capture and review.</h1>
            <p className="muted">
              Add expenses manually, import them from files, and keep your running ledger visible while the assistant
              stays close by for quick questions.
            </p>
          </div>
          <div className="summary-strip">
            <span className="summary-chip">{user.email}</span>
            <span className="summary-chip">INR ledger</span>
            <span className="summary-chip">Receipt import ready</span>
          </div>
        </div>
        <div className="hero-side-stack">
          <div className="assistant-spotlight">
            <div className="assistant-spotlight-head">
              <div>
                <div className="eyebrow">Assistant</div>
                <h2 className="card-title">Chat has first-class space now.</h2>
              </div>
              <span className="item-pill ai">Ready</span>
            </div>
            <p className="muted">
              Use the floating assistant to ask about category changes, recent spending patterns, or what to log next.
            </p>
            <div className="assistant-sample-list">
              <span className="summary-chip">Summarize my grocery spend this month</span>
              <span className="summary-chip">What changed most this week?</span>
              <span className="summary-chip">Help me log a transport expense</span>
            </div>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
            <span className="meta-label">Today</span>
            <span className="metric-value">{totals.today.toFixed(2)}</span>
            <span className="metric-trend">Live daily spend</span>
            </div>
            <div className="metric-card">
            <span className="meta-label">This month</span>
            <span className="metric-value">{totals.month.toFixed(2)}</span>
            <span className="metric-trend positive">Primary tracking window</span>
            </div>
            <div className="metric-card">
            <span className="meta-label">This year</span>
            <span className="metric-value">{totals.year.toFixed(2)}</span>
            <span className="metric-trend">Long-range balance context</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel dashboard-section span-7 stack">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Expense capture</div>
            <h2 className="card-title">Add a transaction or import one from a file.</h2>
            <p className="muted">Enter an amount and description yourself, or attach a file to extract candidate expenses.</p>
          </div>
        </div>
        <form className="expense-form" onSubmit={handleExpenseSubmit}>
          <div className="expense-form-grid">
            <input
              min="0.01"
              onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
              placeholder="Amount"
              required={!attachment}
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
            required={!attachment}
            type="text"
            value={expenseForm.description}
          />
          <label className="attachment-field">
            <span className="field-label">Attach receipt or file</span>
            <input
              accept="image/*,.pdf,.txt,.csv,.json"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setAttachment(nextFile);
                setExtractedExpenses([]);
                setExtractionNotes(nextFile ? ["Attachment ready. Submit to extract expense candidates."] : []);
              }}
              type="file"
            />
            <span className="muted">Supports images, PDFs, text, CSV, and JSON imports.</span>
          </label>
          <button className="button" disabled={expenseLoading} type="submit">
            {expenseLoading ? "Processing..." : attachment ? "Extract Expenses" : "Save Expense"}
          </button>
        </form>
      </section>

      <section className="panel dashboard-section span-5 stack">
        <div>
          <div className="eyebrow">Account</div>
          <h2 className="card-title">Workspace</h2>
          <p className="muted">{user.email}</p>
        </div>
        <div className="stat-grid">
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
        </div>
        <p className="muted">
          Once this ledger has some activity, the Insights page and assistant can summarize trends and suggest next
          steps.
        </p>
      </section>

      <section className="panel dashboard-section span-7 stack">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Attachment flow</div>
            <h2 className="card-title">Extracted expenses</h2>
          </div>
          {extractedExpenses.length ? (
            <button className="button secondary" disabled={extracting} onClick={handleImportExtracted} type="button">
              {extracting ? "Importing..." : "Import Extracted Expenses"}
            </button>
          ) : null}
        </div>
        <ul className="clean">
          {extractedExpenses.length ? null : (
            <li className="empty-state">
              <strong>No extracted items yet</strong>
              Add expenses manually, or attach a receipt, bank export, or image to extract expense candidates.
            </li>
          )}
          {extractedExpenses.map((item, index) => (
            <li className="list-item" key={`${item.description}-${index}`}>
              <div className="split-row">
                <div>
                  <strong>{sanitizeText(item.description)}</strong>
                  <div className="item-meta">
                    <span className="item-pill">{item.category}</span>
                    <span>{item.expense_date || "today"}</span>
                    <span>confidence {Math.round((item.confidence ?? 0) * 100)}%</span>
                  </div>
                </div>
                <span className="amount positive">
                  {Number(item.amount).toFixed(2)} {item.currency}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel dashboard-section span-5 stack">
        <div>
          <div className="eyebrow">Notes</div>
          <h2 className="card-title">Extraction notes</h2>
        </div>
        <ul className="clean">
          {extractionNotes.length ? null : (
            <li className="empty-state">
              <strong>Waiting for an upload</strong>
              Upload a receipt, screenshot, PDF, or export file to analyze expenses.
            </li>
          )}
          {extractionNotes.map((line) => (
            <li className="list-item" key={line}>
              <span className="item-pill ai">AI extraction</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel dashboard-section span-12">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Ledger</div>
            <h2 className="card-title">Recent expenses</h2>
          </div>
          <span className="summary-chip">{expenses.length} entries</span>
        </div>
        <ul className="clean">
          {expenses.length ? (
            expenses.map((expense) => (
              <li className="list-item" key={expense.id}>
                <div className="ledger-row">
                  <div>
                    <strong>{sanitizeText(expense.description)}</strong>
                    <div className="ledger-meta">
                      <span className="item-pill">{expense.category}</span>
                      <span>{expense.expense_date}</span>
                      <span>{sanitizeText(expense.currency)}</span>
                    </div>
                  </div>
                  <span className="amount">
                    {Number(expense.amount).toFixed(2)} {sanitizeText(expense.currency)}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="empty-state">
              <strong>No expenses yet</strong>
              Add your first transaction above to start building the ledger and insight history.
            </li>
          )}
        </ul>
      </section>
    </section>
  );
}
