"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  BUSINESS_CATEGORIES,
  DEFAULT_BUSINESS_CATEGORY,
  mapApiCategoryToUi,
  mapUiCategoryToApi,
} from "@/src/constants/categories.js";
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
      setExpenses(
        nextExpenses.map((expense) => ({
          ...expense,
          category: mapApiCategoryToUi(expense.category),
        })),
      );
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
        setExtractedExpenses(
          (extraction.expenses ?? []).map((expense) => ({
            ...expense,
            category: mapApiCategoryToUi(expense.category),
          })),
        );
        setExtractionNotes(extraction.notes ?? []);
        return;
      }

      await expenseApi.createExpense({
        amount: Number(expenseForm.amount),
        currency: expenseForm.currency,
        category: mapUiCategoryToApi(expenseForm.category),
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
            category: mapUiCategoryToApi(expense.category),
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
      <section className="panel dashboard-section span-12 dashboard-overview">
        <div className="overview-copy">
          <div className="eyebrow">Expense operations</div>
          <h2 className="card-title">Company spend visibility and intake controls</h2>
          <p className="muted">
            Review current expense totals, capture new records, and prepare source documents for import without leaving
            the workspace.
          </p>
        </div>
        <div className="overview-account">
          <span className="meta-label">Active account</span>
          <strong>{user.email}</strong>
          <span className="muted">Records shown below are scoped to this authenticated workspace.</span>
        </div>
      </section>

      <section className="span-12 kpi-row">
        <article className="panel dashboard-section metric-card metric-card-primary">
          <span className="meta-label">Today</span>
          <span className="metric-value">{totals.today.toFixed(2)} INR</span>
          <span className="metric-trend positive">Current day expense intake</span>
        </article>
        <article className="panel dashboard-section metric-card">
          <span className="meta-label">This month</span>
          <span className="metric-value">{totals.month.toFixed(2)} INR</span>
          <span className="metric-trend">Month-to-date company spend</span>
        </article>
        <article className="panel dashboard-section metric-card">
          <span className="meta-label">This year</span>
          <span className="metric-value">{totals.year.toFixed(2)} INR</span>
          <span className="metric-trend">Annual operating spend total</span>
        </article>
      </section>

      <section className="panel dashboard-section span-8 stack expense-capture-card">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Expense intake</div>
            <h2 className="card-title">Capture an expense or prepare a document import</h2>
            <p className="muted">
              Enter an amount and description manually, or attach a source file to extract candidate records for review.
            </p>
          </div>
        </div>
        <form className="expense-form" onSubmit={handleExpenseSubmit}>
          <div className="expense-form-grid">
            <label className="field field-inline">
              <span>Amount</span>
              <input
                min="0.01"
                onChange={(event) => setExpenseForm((current) => ({ ...current, amount: event.target.value }))}
                placeholder="Enter amount"
                required={!attachment}
                step="0.01"
                type="number"
                value={expenseForm.amount}
              />
            </label>
            <label className="field field-inline">
              <span>Category</span>
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
            </label>
          </div>
          <label className="field field-inline">
            <span>Description</span>
            <input
              maxLength={500}
              onChange={(event) => setExpenseForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Describe the expense"
              required={!attachment}
              type="text"
              value={expenseForm.description}
            />
          </label>
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
            <span className="muted">Supported formats: image, PDF, text, CSV, and JSON expense source files.</span>
          </label>
          <button className="button" disabled={expenseLoading} type="submit">
            {expenseLoading ? "Processing..." : attachment ? "Extract Company Expenses" : "Save Company Expense"}
          </button>
        </form>
      </section>

      <section className="panel dashboard-section span-4 stack corner-accent account-card">
        <div>
          <div className="eyebrow">Control notes</div>
          <h2 className="card-title">Operating context</h2>
          <p className="account-email meta">{user.email}</p>
        </div>
        <div className="stat-grid stat-grid-strong">
          <div className="stat stat-strong">
            <span className="stat-label">Advisor</span>
            <strong>{BRAND.assistantRole}</strong>
          </div>
          <div className="stat stat-strong">
            <span className="stat-label">Import mode</span>
            <strong>Review before save</strong>
          </div>
        </div>
        <p className="muted">
          As activity builds up, Expense Analytics and {BRAND.assistantRole} can summarize patterns, anomalies, and
          follow-up actions without changing your core workflow.
        </p>
      </section>

      {extractedExpenses.length || extractionNotes.length ? (
        <section className="panel dashboard-section span-7 stack">
          <div className="section-header">
            <div className="section-header-copy">
              <div className="eyebrow">Document intake</div>
              <h2 className="card-title">Extracted candidate records</h2>
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
              <li className="list-item list-item-data" key={`${item.description}-${index}`}>
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

      <section className="panel dashboard-section span-12 ledger-panel">
        <div className="section-header">
          <div className="section-header-copy">
            <div className="eyebrow">Expense ledger</div>
            <h2 className="card-title">Recent expense activity</h2>
          </div>
          <span className="summary-chip">{expenses.length} records</span>
        </div>
        <div className="table-header">
          <span>Description</span>
          <span>Category / Date / Currency</span>
          <span>Amount</span>
        </div>
        <ul className="clean">
          {expenses.length ? (
            expenses.map((expense) => (
              <li className="list-item list-item-data" key={expense.id}>
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
              <strong>No expense activity yet</strong>
              Add your first company record above to start building your operating history and analytics timeline.
            </li>
          )}
        </ul>
      </section>
    </section>
  );
}
