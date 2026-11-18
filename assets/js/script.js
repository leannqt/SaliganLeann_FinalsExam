/* ===== Gastos – Student Expense Tracker =====
 * Frontend-only. Data lives in the browser's localStorage.
 * Sections: 1) Storage  2) Helpers  3) Dashboard  4) Transactions
 *           5) Add Expense form  6) Budget page  7) Boot
 */
"use strict";

/* ---------- 1) STORAGE ---------- */
const KEY_EXPENSES = "gastos.expenses";
const KEY_BUDGET = "gastos.budget";
const DEFAULT_BUDGET = 3000;

const CATEGORIES = {
  Food: "Food",
  Transport: "Transport",
  School: "School Supplies",
  Load: "Load / Data",
  Entertainment: "Entertainment",
  Other: "Other",
};

function buildSampleData() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  // Dates stay inside the current month so the dashboard always has data.
  const day = (back) => new Date(y, m, Math.max(1, today.getDate() - back));
  const rows = [
    ["Jollibee lunch", 120, "Food", 0],
    ["Jeepney fare to campus", 24, "Transport", 0],
    ["Bond paper (1 ream)", 85, "School", 1],
    ["GCash load", 50, "Load", 2],
    ["Milk tea with classmates", 95, "Food", 2],
    ["Tricycle fare", 40, "Transport", 3],
    ["Movie night", 250, "Entertainment", 4],
    ["Ballpens and notebook", 110, "School", 5],
    ["Canteen merienda", 60, "Food", 6],
    ["Mobile data promo", 99, "Load", 7],
  ];
  return rows.map((r, i) => ({
    id: "seed-" + i,
    description: r[0],
    amount: r[1],
    category: r[2],
    date: toISODate(day(r[3])),
    note: "",
  }));
}

function loadExpenses() {
  try {
    const raw = localStorage.getItem(KEY_EXPENSES);
    if (raw === null) {
      const seed = buildSampleData();
      saveExpenses(seed);
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read saved expenses:", err);
    return [];
  }
}

function saveExpenses(list) {
  try {
    localStorage.setItem(KEY_EXPENSES, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not save expenses:", err);
  }
}

function loadBudget() {
  const n = Number(localStorage.getItem(KEY_BUDGET));
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_BUDGET;
}

function saveBudget(value) {
  localStorage.setItem(KEY_BUDGET, String(value));
}

/* ---------- 2) HELPERS ---------- */
function toISODate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function peso(n) {
  return "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function isThisMonth(iso) {
  const d = new Date(iso + "T00:00:00");
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function monthExpenses(list) {
  return list.filter((e) => isThisMonth(e.date));
}

function sumAmounts(list) {
  return list.reduce((t, e) => t + Number(e.amount), 0);
}

function totalsByCategory(list) {
  const totals = {};
  list.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
  });
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

function categoryBadge(cat) {
  const label = CATEGORIES[cat] || cat;
  return `<span class="cat-badge cat-${escapeHTML(cat)}">${escapeHTML(label)}</span>`;
}

function budgetState(spent, budget) {
  const pct = (spent / budget) * 100;
  if (pct >= 100) return { cls: "state-over", text: "Over budget", pct };
  if (pct >= 75) return { cls: "state-warn", text: "Almost at your limit", pct };
  return { cls: "state-ok", text: "On track", pct };
}

function renderBudgetBar(bar, spent, budget) {
  const s = budgetState(spent, budget);
  const shown = Math.min(100, Math.round(s.pct));
  bar.className = "progress-bar " + s.cls;
  bar.style.width = shown + "%";
  bar.textContent = Math.round(s.pct) + "%";
  bar.parentElement.setAttribute("aria-valuenow", shown);
  return s;
}

function showToast(message, type) {
  const holder = document.getElementById("toastHolder");
  if (!holder) return;
  const el = document.createElement("div");
  el.className = `toast align-items-center text-bg-${type || "success"} border-0`;
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHTML(message)}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  holder.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 3500 });
  el.addEventListener("hidden.bs.toast", () => el.remove());
  t.show();
}

/* ---------- 3) DASHBOARD ---------- */
function initDashboard() {
  const all = loadExpenses();
  const month = monthExpenses(all);
  const budget = loadBudget();
  const spent = sumAmounts(month);
  const remaining = budget - spent;
  const byCat = totalsByCategory(month);

  document.getElementById("statSpent").textContent = peso(spent);
  const remEl = document.getElementById("statRemaining");
  remEl.textContent = remaining >= 0 ? peso(remaining) : "-" + peso(Math.abs(remaining));
  remEl.classList.toggle("text-danger", remaining < 0);
  document.getElementById("statTop").textContent = byCat.length ? (CATEGORIES[byCat[0][0]] || byCat[0][0]) : "None yet";
  document.getElementById("statCount").textContent = month.length;

  const s = renderBudgetBar(document.getElementById("dashBar"), spent, budget);
  document.getElementById("dashBudgetNote").textContent = `${s.text} — budget ${peso(budget)}`;

  // Category breakdown
  const catList = document.getElementById("catList");
  if (!byCat.length) {
    catList.innerHTML = `<p class="text-muted mb-0">No spending recorded this month.</p>`;
  } else {
    catList.innerHTML = byCat.map(([cat, total]) => {
      const pct = spent ? Math.round((total / spent) * 100) : 0;
      return `<div class="mb-3">
        <div class="d-flex justify-content-between mb-1"><span>${categoryBadge(cat)}</span><span class="amount">${peso(total)} <span class="text-muted fw-normal">(${pct}%)</span></span></div>
        <div class="progress cat-bar" role="progressbar" aria-label="${escapeHTML(CATEGORIES[cat] || cat)} share" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width:${pct}%"></div></div></div>`;
    }).join("");
  }

  // Recent 5
  const recent = [...all].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentEl = document.getElementById("recentList");
  recentEl.innerHTML = recent.length
    ? recent.map((e) => `<li class="recent-item"><div><div class="fw-semibold">${escapeHTML(e.description)}</div>
        <small class="text-muted">${formatDate(e.date)}</small> ${categoryBadge(e.category)}</div>
        <span class="amount">${peso(e.amount)}</span></li>`).join("")
    : `<li class="text-muted">No expenses yet. Add your first one!</li>`;
}

/* ---------- 4) TRANSACTIONS ---------- */
let pendingDeleteId = null;

function initTransactions() {
  const search = document.getElementById("searchInput");
  const filter = document.getElementById("categoryFilter");
  const sort = document.getElementById("sortSelect");
  const body = document.getElementById("txBody");
  const empty = document.getElementById("emptyState");
  const tableWrap = document.getElementById("tableWrap");
  const summary = document.getElementById("txSummary");
  const modalEl = document.getElementById("deleteModal");
  const modal = new bootstrap.Modal(modalEl);

  function getVisible() {
    const q = search.value.trim().toLowerCase();
    const cat = filter.value;
    let list = loadExpenses().filter((e) =>
      (cat === "all" || e.category === cat) &&
      (e.description.toLowerCase().includes(q) || (e.note || "").toLowerCase().includes(q))
    );
    const sorters = {
      newest: (a, b) => b.date.localeCompare(a.date),
      oldest: (a, b) => a.date.localeCompare(b.date),
      highest: (a, b) => b.amount - a.amount,
      lowest: (a, b) => a.amount - b.amount,
    };
    return list.sort(sorters[sort.value]);
  }

  function render() {
    const list = getVisible();
    tableWrap.classList.toggle("d-none", list.length === 0);
    empty.classList.toggle("d-none", list.length !== 0);
    summary.textContent = `${list.length} expense${list.length === 1 ? "" : "s"} shown — total ${peso(sumAmounts(list))}`;
    body.innerHTML = list.map((e) => `<tr>
      <td>${formatDate(e.date)}</td>
      <td>${escapeHTML(e.description)}${e.note ? `<br><small class="text-muted">${escapeHTML(e.note)}</small>` : ""}</td>
      <td>${categoryBadge(e.category)}</td>
      <td class="text-end amount">${peso(e.amount)}</td>
      <td class="text-end"><button type="button" class="btn btn-sm btn-outline-danger" data-id="${escapeHTML(e.id)}"
        aria-label="Delete ${escapeHTML(e.description)}"><i class="bi bi-trash" aria-hidden="true"></i></button></td></tr>`).join("");
  }

  [search, filter, sort].forEach((el) => el.addEventListener("input", render));

  body.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button[data-id]");
    if (!btn) return;
    pendingDeleteId = btn.dataset.id;
    modal.show();
  });

  document.getElementById("confirmDelete").addEventListener("click", () => {
    saveExpenses(loadExpenses().filter((e) => e.id !== pendingDeleteId));
    pendingDeleteId = null;
    modal.hide();
    render();
    showToast("Expense deleted.", "secondary");
  });

  document.getElementById("clearFilters").addEventListener("click", () => {
    search.value = "";
    filter.value = "all";
    sort.value = "newest";
    render();
    search.focus();
  });

  document.getElementById("exportCsv").addEventListener("click", () => {
    const list = getVisible();
    if (!list.length) { showToast("Nothing to export.", "warning"); return; }
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = ["Date,Description,Category,Amount,Note"].concat(
      list.map((e) => [e.date, esc(e.description), esc(CATEGORIES[e.category] || e.category), e.amount, esc(e.note || "")].join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gastos-expenses.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("CSV downloaded.");
  });

  render();
}

/* ---------- 5) ADD EXPENSE FORM ---------- */
function initAddForm() {
  const form = document.getElementById("expenseForm");
  const fields = {
    description: document.getElementById("description"),
    amount: document.getElementById("amount"),
    category: document.getElementById("category"),
    date: document.getElementById("date"),
    note: document.getElementById("note"),
  };
  fields.date.max = toISODate(new Date());
  fields.date.value = toISODate(new Date());

  const rules = {
    description(v) {
      v = v.trim();
      if (!v) return "Enter what you spent on.";
      if (v.length < 3) return "Description must be at least 3 characters.";
      if (v.length > 60) return "Description must be 60 characters or fewer.";
      return "";
    },
    amount(v) {
      if (v.trim() === "") return "Enter the amount in pesos.";
      const n = Number(v);
      if (!Number.isFinite(n)) return "Amount must be a number.";
      if (n <= 0) return "Amount must be greater than ₱0.";
      if (n > 1000000) return "Amount cannot exceed ₱1,000,000.";
      return "";
    },
    category(v) { return v ? "" : "Choose a category."; },
    date(v) {
      if (!v) return "Pick the date of the expense.";
      if (v > toISODate(new Date())) return "Date cannot be in the future.";
      return "";
    },
    note(v) { return v.length > 120 ? "Note must be 120 characters or fewer." : ""; },
  };

  function validateField(name) {
    const input = fields[name];
    const msg = rules[name](input.value);
    const fb = document.getElementById(name + "Feedback");
    input.classList.toggle("is-invalid", !!msg);
    input.classList.toggle("is-valid", !msg && input.value !== "" && name !== "note");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (fb) fb.textContent = msg;
    return !msg;
  }

  Object.keys(fields).forEach((name) => {
    fields[name].addEventListener("blur", () => validateField(name));
    fields[name].addEventListener("input", () => {
      if (fields[name].classList.contains("is-invalid")) validateField(name);
    });
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const results = Object.keys(fields).map(validateField);
    if (results.includes(false)) {
      const firstBad = form.querySelector(".is-invalid");
      if (firstBad) firstBad.focus();
      showToast("Please fix the highlighted fields.", "danger");
      return;
    }
    const list = loadExpenses();
    list.push({
      id: "e-" + Date.now(),
      description: fields.description.value.trim(),
      amount: Math.round(Number(fields.amount.value) * 100) / 100,
      category: fields.category.value,
      date: fields.date.value,
      note: fields.note.value.trim(),
    });
    saveExpenses(list);
    form.reset();
    fields.date.value = toISODate(new Date());
    Object.values(fields).forEach((f) => { f.classList.remove("is-valid", "is-invalid"); f.removeAttribute("aria-invalid"); });
    showToast("Expense saved! You can view it in Transactions.");
    fields.description.focus();
  });
}

/* ---------- 6) BUDGET PAGE ---------- */
function initBudget() {
  const input = document.getElementById("budgetInput");
  const form = document.getElementById("budgetForm");
  const feedback = document.getElementById("budgetFeedback");

  function render() {
    const budget = loadBudget();
    const spent = sumAmounts(monthExpenses(loadExpenses()));
    const remaining = budget - spent;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - now.getDate() + 1;
    const s = renderBudgetBar(document.getElementById("budgetBar"), spent, budget);

    input.value = budget;
    document.getElementById("bSpent").textContent = peso(spent);
    document.getElementById("bBudget").textContent = peso(budget);
    document.getElementById("bRemaining").textContent = remaining >= 0 ? peso(remaining) : "-" + peso(Math.abs(remaining));
    document.getElementById("bStatus").textContent = s.text;
    document.getElementById("bDaily").textContent = remaining > 0 ? peso(remaining / daysLeft) : peso(0);
    document.getElementById("bDaysLeft").textContent = daysLeft;

    const top = totalsByCategory(monthExpenses(loadExpenses()))[0];
    const tips = [];
    tips.push(remaining > 0
      ? `You can spend about ${peso(remaining / daysLeft)} per day for the next ${daysLeft} day(s) and stay within budget.`
      : "You have reached your monthly limit. Try to pause non-essential spending until next month.");
    tips.push(top
      ? `Your biggest category is ${CATEGORIES[top[0]] || top[0]} (${peso(top[1])}). Small cuts here save the most.`
      : "Add a few expenses to see which category costs you the most.");
    tips.push("Try the 50/30/20 idea: needs, wants, and savings. Even ₱20 a day adds up to ₱600 a month.");
    document.getElementById("tipsList").innerHTML = tips.map((t) => `<li class="mb-2">${escapeHTML(t)}</li>`).join("");
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const n = Number(input.value);
    let msg = "";
    if (input.value.trim() === "") msg = "Enter your monthly budget.";
    else if (!Number.isFinite(n) || n < 100) msg = "Budget must be at least ₱100.";
    else if (n > 1000000) msg = "Budget cannot exceed ₱1,000,000.";
    input.classList.toggle("is-invalid", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    feedback.textContent = msg;
    if (msg) { input.focus(); return; }
    saveBudget(n);
    render();
    showToast("Budget updated.");
  });

  document.getElementById("resetData").addEventListener("click", () => {
    if (!confirm("This replaces all your expenses with the sample data. Continue?")) return;
    saveExpenses(buildSampleData());
    localStorage.removeItem(KEY_BUDGET);
    render();
    showToast("Sample data restored.", "secondary");
  });

  render();
}

/* ---------- 7) BOOT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const page = document.body.dataset.page;
  const pages = {
    dashboard: initDashboard,
    transactions: initTransactions,
    add: initAddForm,
    budget: initBudget,
  };
  if (pages[page]) pages[page]();
});
