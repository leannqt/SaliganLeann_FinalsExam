# Gastos – Student Expense Tracker

A responsive, frontend-only web app that helps college students log daily expenses, set a monthly budget, and see where their allowance goes.

- **Student name:** `YOUR FULL NAME`
- **Section:** `YOUR SECTION`
- **Course:** CC211 – Application Development and Emerging Technologies (Finals Laboratory Exam, A.Y. 2025–2026)
- **Institution:** Polytechnic College of Botolan – Institute of Computing Studies

> This is a **frontend demonstration**. There is no server or login. Data is stored only in your browser's `localStorage`.

## Task 1: Project Definition

 Item  Description

 Project title  Gastos – Student Expense Tracker 
 Problem / need  Many students run out of allowance before the month ends because they do not record small daily purchases (fare, food, load, school supplies). 
 Target users  Filipino college students who manage a weekly or monthly allowance.
 Objectives  1) Let users record and review expenses quickly. 2) Show spending per category. 3) Warn users when they approach their monthly budget. 4) Provide a clean, accessible, mobile-friendly interface. 
 Main features Dashboard summary, add expense form with validation, searchable/sortable/filterable transaction table, delete with confirmation, CSV export, monthly budget with status colors and daily allowance, restore sample data. 
 Pages  `index.html` (Dashboard), `pages/transactions.html`, `pages/add-expense.html`, `pages/budget.html` 

## Features

1. Add / delete records saved to `localStorage` (data stays after refresh).
2. Search, filter by category, and sort(newest, oldest, highest, lowest).
3. Calculations: monthly total, remaining budget, per-category percentages, daily allowance for the rest of the month.
4. Budget status: progress bar turns teal → amber (75%+) → red (100%+).
5. Form validation with specific messages, `aria-invalid`, focus on first error, and toast feedback.
6. CSV export of the currently visible expenses.
7. Accessibility: skip link, labeled inputs, visible focus ring, semantic landmarks, table captions, `aria-live` regions, reduced-motion support.

## Technologies

HTML5, CSS3, JavaScript (ES6), Bootstrap 5.3.3, Bootstrap Icons 1.11.3, Google Font *Plus Jakarta Sans*. Bootstrap components used: navbar, cards, grid, forms, table, badges, progress bars, modal, toasts.

## Project Structure

```
LeannSaligan_FinalLabExam_CC211/
├── index.html
├── pages/
│   ├── transactions.html
│   ├── add-expense.html
│   └── budget.html
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   └── images/ (logo.svg, hero.svg)
├── docs/screenshots/
├── README.md
└── PROMPT_LOG.md
```

## How to Open and Use

1. Download or clone the repository.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox). An internet connection is needed to load Bootstrap and the font from CDNs.
3. Go to Add expense, fill in the form, and press Save expense.
4. Open Transactions to search, filter, sort, delete, or export.
5. Open Budget to set your monthly limit. Use Restore sample data to reset.

## AI Tools Used and Contributions

| Tool  Contribution 

| Claude (Anthropic)  Planned the project, generated the HTML/CSS/JS structure, validation logic, and documentation drafts. 
| Lovable  Produced a visual prototype of the layout and color scheme used as a design reference. Lovable outputs React/Tailwind, so its code was not used; the final app was rebuilt in plain HTML/CSS/JS/Bootstrap as the exam requires. 

I reviewed, tested, and can explain all submitted code. See `PROMPT_LOG.md` for prompts and evaluations.

## Testing Performed and Corrections Made

 Test | Result | Issue found / correction 

 1  Navigation between all 4 pages (desktop + mobile hamburger)  Pass 
 2  Form: empty submit  Pass  Shows 3 required-field errors and focuses the first one. 
 3  Form: invalid values (`ab`, `-5`)  Pass  Specific messages shown for description and amount. 
 4  Form: valid submit  Pass  Record appears in Transactions after save. 
 5  Search / filter / sort Pass 
 6  Search with no match  Pass 
Empty-state message displays instead of a blank table. 
 7 | Delete with confirmation modal | Pass 
 8 | Budget below 100 and over-spend (₱600 budget)  Pass  Bar turns red and shows "Over budget"; remaining shows a negative value in red. 
 9 | localStorage persistence after refresh  Pass  Fixed: sample data is seeded only when no saved data exists, so deleted items do not return. 
 10  Responsive check at 1280, 768, 375 px  Pass  No horizontal overflow; the table scrolls inside its own container on small screens. 
 11  Browser console Pass  No errors.
 12  Colour contrast  Fixed  Amber is used only as a background with dark text, never as text on white. 

Manual fixes recorded during development:

- Initial sample dates could fall in the previous month and made the dashboard look empty → dates are now generated inside the current month.
- Typed user text is inserted with `escapeHTML()` to avoid broken markup.

## Known Limitations

- Frontend only: data lives in one browser and is lost if site data is cleared.
- No real login, user accounts, or syncing across devices.
- Bootstrap and fonts load from CDNs, so the first load needs internet.
- Only the current month is summarized on the dashboard.
- No edit-expense feature (delete and re-add instead).

## Credits

- [Bootstrap 5](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/) – MIT License
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) – Google Fonts, SIL Open Font License
- Logo and hero illustration: original SVGs created for this project
- AI assistance: Claude (Anthropic) and Lovable
