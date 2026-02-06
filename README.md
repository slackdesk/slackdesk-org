# Slackdesk QA Playground

A deterministic, static test-bed for designing and validating a **team-adoptable UI test framework**.

This project provides a stable, reproducible target for UI automation and framework experimentation, without backend dependencies, flaky data, or environmental noise.

Live example (if hosted):  
https://slackdesk.org/

---

## Purpose

QA teams adopt test frameworks when they are:

- deterministic in CI
- easy to author and review
- debuggable when failures occur
- governed by clear conventions

The Slackdesk QA Playground exists to **prove those principles** against a controlled, static site before applying them to real-world applications.

---

## Design goals

- **No backend required**  
  All behavior is client-side and deterministic.

- **Stable selectors everywhere**  
  Every interactive element includes a `data-testid`.

- **Human-readable test intent**  
  Each section includes “Test Notes / Hints” describing expected behavior.

- **Framework-agnostic**  
  Works equally well with Playwright, Cypress, Selenium, or custom runners.

---

## Pages

### `/index.html`

Landing page with:
- navigation links
- live clock (read-only UI)
- counter widget (simple state changes)

**Use cases**
- smoke tests
- navigation validation
- basic click → state assertions

---

### `/playground.html`

Primary testing surface containing:

- **Contact form**
  - required fields
  - email validation
  - minimum message length
  - simulated async submit (450ms)

- **Modal dialog**
  - open / close
  - backdrop click
  - confirm action updates page state

- **Tabs**
  - proper ARIA roles
  - `aria-selected` state management

- **Accordion**
  - native `<details>` element
  - deterministic open/close behavior

- **Filterable table**
  - client-side filtering
  - deterministic empty state

- **File download**
  - static file for download verification

**Use cases**
- validation testing (error + success)
- UI state transitions
- accessibility selector usage
- file download handling

---

## Selector conventions

Recommended selector priority:

1. Accessibility selectors  
   - `getByRole()`
   - `getByLabel()`
2. Test IDs  
   - `data-testid`
3. Text or CSS selectors (last resort)

**Guidelines**
- Avoid brittle CSS selectors
- Avoid text selectors where UI copy may change
- Prefer selectors that reflect user intent

---

## Test notes / hints pattern

Each component includes a visible note section that:

- documents expected behavior
- highlights edge cases
- guides test authors
- is itself testable via `data-testid`

This enables:
- enforcing documentation standards
- asserting that requirements exist
- future automation of test scaffolding

---

## Project structure

site/
index.html
playground.html
assets/
qa-playground.css
qa-playground.js
sample.txt


---

## Running locally

No dependencies required.

From the project root:

```bash
python3 -m http.server 8080
Open in a browser:

http://127.0.0.1:8080/

http://127.0.0.1:8080/playground.html

Deployment
This is plain HTML/CSS/JS and can be hosted on any static platform:

nginx / Apache

GitHub Pages

Netlify

Cloudflare Pages

VPS static hosting

Deployment checklist
index.html and playground.html are in the web root

/assets/ is publicly accessible

The following URLs load without errors:

/playground.html

/assets/qa-playground.css

/assets/qa-playground.js

/assets/sample.txt

Suggested smoke test coverage
Minimum recommended smoke suite:

Home page loads

Navigation: Home → Playground

Counter increments and decrements

Form validation errors appear for invalid input

Form success appears for valid input

Modal confirm updates result indicator

Tab switching shows correct panel

Table filtering shows rows and empty state

File download initiates successfully

Extending the playground
New components should remain:

deterministic

isolated

stable across runs

free of external network dependencies

Good candidates:

multi-step wizards (static state)

toast notifications

accessibility examples

client-side validation patterns

Avoid:

randomized values

time-based assertions

live APIs

non-deterministic animations

License
Choose a license appropriate to your goals:

MIT — permissive and simple

Apache-2.0 — explicit patent grant

Maintainer notes
When using this playground to develop a QA framework:

enforce selector policy early

default to trace and screenshot artifacts

introduce reusable flows (e.g. ContactFlow, ModalFlow)

keep tests readable and reviewable

optimize for CI stability before scale