function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function setText(testid, text) {
  const el = document.querySelector(`[data-testid="${testid}"]`);
  if (el) el.textContent = text;
}

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function initNavActive() {
  const path = location.pathname.split("/").pop() || "index.html";
  $all('[data-testid="nav-link"]').forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
}

function initClock() {
  const el = $('[data-testid="clock"]');
  if (!el) return;
  const tick = () => el.textContent = new Date().toLocaleString();
  tick();
  setInterval(tick, 1000);
}

function initCounter() {
  const out = $('[data-testid="counter-value"]');
  const inc = $('[data-testid="counter-inc"]');
  const dec = $('[data-testid="counter-dec"]');
  if (!out || !inc || !dec) return;
  let n = 0;
  const render = () => out.textContent = String(n);
  inc.addEventListener("click", () => { n++; render(); });
  dec.addEventListener("click", () => { n--; render(); });
  render();
}

function initTabs() {
  const root = $('[data-testid="tabs-root"]');
  if (!root) return;

  const tabs = $all('[role="tab"]', root);
  const panels = $all('[role="tabpanel"]', root);

  function activate(id) {
    tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.tab === id ? "true" : "false"));
    panels.forEach(p => p.classList.toggle("hidden", p.dataset.panel !== id));
  }

  tabs.forEach(t => t.addEventListener("click", () => activate(t.dataset.tab)));
  activate(tabs[0]?.dataset.tab || "a");
}

function initModal() {
  const openBtn = $('[data-testid="open-modal"]');
  const backdrop = $('[data-testid="modal-backdrop"]');
  const closeBtn = $('[data-testid="close-modal"]');
  const confirmBtn = $('[data-testid="confirm-modal"]');
  if (!openBtn || !backdrop || !closeBtn || !confirmBtn) return;

  function open() {
    backdrop.style.display = "flex";
    backdrop.setAttribute("aria-hidden", "false");
    confirmBtn.focus();
  }
  function close() {
    backdrop.style.display = "none";
    backdrop.setAttribute("aria-hidden", "true");
    openBtn.focus();
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  confirmBtn.addEventListener("click", () => {
    setText("modal-result", "Confirmed ✅");
    close();
  });
}

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function initForm() {
  const form = $('[data-testid="contact-form"]');
  if (!form) return;

  const email = $('[data-testid="email"]');
  const topic = $('[data-testid="topic"]');
  const message = $('[data-testid="message"]');

  const alertOk = $('[data-testid="alert-ok"]');
  const alertErr = $('[data-testid="alert-err"]');
  const errList = $('[data-testid="error-list"]');
  const submit = $('[data-testid="submit"]');
  const reset = $('[data-testid="reset"]');

  function clearAlerts() {
    hide(alertOk); hide(alertErr);
    errList.innerHTML = "";
  }

  function showErrors(errors) {
    clearAlerts();
    show(alertErr);
    errors.forEach(e => {
      const li = document.createElement("li");
      li.textContent = e;
      errList.appendChild(li);
    });
  }

  function showSuccess() {
    clearAlerts();
    show(alertOk);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submit.disabled = true;
    clearAlerts();

    const errors = [];
    const em = (email.value || "").trim();
    const tp = topic.value;
    const msg = (message.value || "").trim();

    if (!em) errors.push("Email is required.");
    else if (!isEmail(em)) errors.push("Email must be valid (e.g., name@example.com).");

    if (!tp) errors.push("Topic is required.");
    if (!msg) errors.push("Message is required.");
    else if (msg.length < 10) errors.push("Message must be at least 10 characters.");

    // Simulate async submit latency for testing
    setTimeout(() => {
      submit.disabled = false;
      if (errors.length) showErrors(errors);
      else showSuccess();
    }, 450);
  });

  reset?.addEventListener("click", () => {
    form.reset();
    clearAlerts();
  });
}

function initTableFilter() {
  const input = $('[data-testid="filter-input"]');
  const rows = $all('[data-testid="table-row"]');
  const empty = $('[data-testid="table-empty"]');
  if (!input || rows.length === 0 || !empty) return;

  function apply() {
    const q = (input.value || "").trim().toLowerCase();
    let shown = 0;
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      const match = !q || text.includes(q);
      r.style.display = match ? "" : "none";
      if (match) shown++;
    });
    empty.classList.toggle("hidden", shown !== 0);
  }

  input.addEventListener("input", apply);
  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  initNavActive();
  initClock();
  initCounter();
  initTabs();
  initModal();
  initForm();
  initTableFilter();
});
