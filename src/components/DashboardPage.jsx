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
          </label>
          <button className="button" disabled={expenseLoading} type="submit">
            {expenseLoading ? "Processing..." : attachment ? "Extract Expenses" : "Save Expense"}
          </button>
        </form>
      </section>

      <section className="panel dashboard-section span-8 stack">
        <div>
          <div className="eyebrow">Attachment flow</div>
          <h2 className="card-title">Extracted expenses</h2>
          <ul className="clean">
            {extractedExpenses.length ? null : (
              <li className="list-item">
                Add expenses manually, or attach a receipt, bank export, or image to extract expense candidates.
              </li>
            )}
            {extractedExpenses.map((item, index) => (
              <li className="list-item" key={`${item.description}-${index}`}>
                {Number(item.amount).toFixed(2)} {item.currency} | {item.category} | {sanitizeText(item.description)} |{" "}
                {item.expense_date || "today"} | confidence {Math.round((item.confidence ?? 0) * 100)}%
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="eyebrow">Notes</div>
          <h2 className="card-title">Extraction notes</h2>
          <ul className="clean">
            {extractionNotes.length ? null : (
              <li className="list-item">Upload a receipt, screenshot, PDF, or export file to analyze expenses.</li>
            )}
            {extractionNotes.map((line) => (
              <li className="list-item" key={line}>
                {line}
              </li>
            ))}
          </ul>
          {extractedExpenses.length ? (
            <button className="button" disabled={extracting} onClick={handleImportExtracted} type="button">
              {extracting ? "Importing..." : "Import Extracted Expenses"}
            </button>
          ) : null}
        </div>
      </section>

      <section className="panel dashboard-section span-4 stack">
        <div className="eyebrow">Navigation</div>
        <h2 className="card-title">Deeper analysis lives in Insights</h2>
        <p className="muted">
          Use the dedicated Insights tab for AI summaries and suggestions. The chat assistant now stays one click away
          in the floating drawer so this page can stay focused on entry and review.
        </p>
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
