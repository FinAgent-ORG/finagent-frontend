"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BUSINESS_CATEGORIES, DEFAULT_BUSINESS_CATEGORY } from "@/src/constants/categories.js";
import { BRAND } from "@/src/constants/branding.js";
import { expenseApi } from "@/src/lib/api-client.js";
import { sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function DashboardPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { setError } = useAppError();
  const [totals, setTotals] = useState({ today: 0, month: 0, year: 0 });
  const [expenses, setExpenses] = useState([]);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: DEFAULT_BUSINESS_CATEGORY,
    description: "",
    currency: "INR",
  });
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
      setExpenseForm({ amount: "", category: DEFAULT_BUSINESS_CATEGORY, description: "", currency: "INR" });
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
      setExtractionNotes(["Imported extracted company expenses into your operating history."]);
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
        <div className="eyebrow">Company session</div>
        <h1>Loading your NexaFlow workspace...</h1>
      </section>
    );
  }

  return (
    <section className="dashboard-grid">
      <section className="panel dashboard-section span-4 stack corner-accent account-card">
        <div>
          <div className="eyebrow">Company profile</div>
          <h2 className="card-title">Business Dashboard</h2>
          <p className="account-email meta">{user.email}</p>
        </div>
        <div className="stat-grid stat-grid-strong">
          <div className="stat stat-strong">
            <span className="stat-label">Today spend</span>
            <strong>{totals.today.toFixed(2)} INR</strong>
          </div>
          <div className="stat stat-strong">
            <span className="stat-label">Monthly spend</span>
            <strong>{totals.month.toFixed(2)} INR</strong>
          </div>
          <div className="stat stat-strong">
            <span className="stat-label">Annual spend</span>
            <strong>{totals.year.toFixed(2)} INR</strong>
          </div>
        </div>
        <p className="muted">
          Once company activity builds up, Business Intelligence and
          {" "}
          {BRAND.assistantRole}
          {" "}
          can summarize patterns and recommend next steps.
        </p>
      </section>

      <section className="panel dashboard-section span-8 stack expense-capture-card">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Expense operations</div>
            <h2 className="card-title">Capture a company expense or import one from a file.</h2>
            <p className="muted">
              Enter an amount and description manually, or attach a file to extract candidate company expense records.
            </p>
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
              {BUSINESS_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <input
            maxLength={500}
            onChange={(event) => setExpenseForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Expense description"
            required={!attachment}
            type="text"
            value={expenseForm.description}
          />
          <label className="attachment-field">
            <span className="field-label">Attach invoice or file</span>
            <input
              accept="image/*,.pdf,.txt,.csv,.json"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setAttachment(nextFile);
                setExtractedExpenses([]);
                setExtractionNotes(nextFile ? ["File ready. Submit to extract company expense candidates."] : []);
              }}
              type="file"
            />
            <span className="muted">Supports images, PDFs, text, CSV, and JSON expense imports.</span>
          </label>
          <button className="button" disabled={expenseLoading} type="submit">
            {expenseLoading ? "Processing..." : attachment ? "Extract Company Expenses" : "Save Company Expense"}
          </button>
        </form>
      </section>

      {extractedExpenses.length || extractionNotes.length ? (
      <section className="panel dashboard-section span-7 stack">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Document intake</div>
            <h2 className="card-title">Extracted company expenses</h2>
          </div>
          {extractedExpenses.length ? (
            <button className="button secondary" disabled={extracting} onClick={handleImportExtracted} type="button">
              {extracting ? "Importing..." : "Import Extracted Records"}
            </button>
          ) : null}
        </div>
        <ul className="clean">
          {extractedExpenses.length ? null : (
            <li className="empty-state">
              <strong>No extracted items yet</strong>
              <p>Add records manually, or attach an invoice, bank export, or image to extract company expense candidates.</p>
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
      ) : null}

      {extractedExpenses.length || extractionNotes.length ? (
      <section className="panel dashboard-section span-5 stack corner-accent">
        <div>
          <div className="eyebrow">Review notes</div>
          <h2 className="card-title">Extraction notes</h2>
        </div>
        <ul className="clean">
          {extractionNotes.length ? null : (
            <li className="empty-state">
              <strong>Waiting for a file</strong>
              <p>Upload an invoice, screenshot, PDF, or export file to analyze company expenses.</p>
            </li>
          )}
          {extractionNotes.map((line) => (
            <li className="list-item" key={line}>
              <span className="item-pill ai">AI intake</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
      ) : null}

      <section className="panel dashboard-section span-12">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Company ledger</div>
            <h2 className="card-title">Recent company expenses</h2>
          </div>
          <span className="summary-chip">{expenses.length} records</span>
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
              <strong>No company expenses yet</strong>
              Add your first company record above to start building your operational history and intelligence timeline.
            </li>
          )}
        </ul>
      </section>
    </section>
  );
}
