# PROMPT_LOG.md

Project: **Gastos – Student Expense Tracker** (CC211 Finals Laboratory Exam)

> ⚠️ **Student note:** Replace the technique names below with the exact names used in your class notes, and fill in the "TO RUN" entries by actually running the prompt and recording the real result. Your instructor will ask you to explain each entry.

---

## Entry 1: Project planning

| Field | Details |
| --- | --- |
| Technique or framework | Role prompting + Context/Constraints + Output format specification (RTCF: Role, Task, Context, Format) |
| Purpose | Read the exam paper and produce a complete, scoped project (Task 1 definition, files, docs). |
| Exact prompt | "help me create this little project, accomplishing everytask given in the file, use lovable, the connector for visuals." *(attached: CC211_FINALS_LAB_EXAM.docx)* |
| Result summary | The AI read the exam file, chose an expense tracker, defined the scope (4 pages, 7 JS features), generated the folder structure, code, README, and this log. |
| Evaluation | Correct: all required files and Bootstrap/HTML/CSS/JS stack; Lovable used for visuals. Missing: my name/section, real screenshots, and the Git commands, which must be done by me. Lovable generates React, which violates the "HTML, CSS, JavaScript, Bootstrap" rule. |
| Improvement | Used Lovable only as a visual reference and rebuilt the app in plain HTML/CSS/JS/Bootstrap. Added placeholders for my details. |

## Entry 2: Visual prototype in Lovable

| Field | Details |
| --- | --- |
| Technique or framework | Constraint-based prompting + Specification with concrete examples (few-shot style sample data) |
| Purpose | Get a visual reference for layout, colors, and components before coding. |
| Exact prompt | Design a visual prototype (UI mockup, sample data only, no backend) for "Gastos", a student expense tracker web app for Filipino college students. Goal: a modern, friendly, trustworthy look. Visual identity: primary deep teal (#0F766E), accent warm amber (#F59E0B), soft off-white background (#F8FAFC), dark slate text (#0F172A). Rounded cards (12px), generous spacing, Inter-style sans-serif font, peso sign (₱) for all amounts. Fully responsive for mobile, tablet, desktop, with a top navbar that collapses to a hamburger on mobile. Pages: 1. Dashboard: greeting, 3 summary cards, a doughnut chart of spending by category, and a "Recent expenses" list of 5 items. 2. Transactions: search box, category filter dropdown, sort dropdown, and a table of expenses with an empty state. 3. Add Expense: a form with description, amount, category, date, optional note, with inline validation messages and a green success toast. 4. Budget & Insights: monthly budget input, progress bar that turns amber then red, and 3 short tips cards. Sample data: Food, Transport, School Supplies, Load/Data, Entertainment with realistic Philippine amounts (e.g., Jollibee lunch ₱120, jeepney fare ₱24, bond paper ₱85, GCash load ₱50). Make keyboard focus rings clearly visible and keep text contrast accessible. |
| Result summary | Lovable created a React + Tailwind prototype. Preview: https://id-preview--88fd0f48-b3e8-4e90-baaa-3adb1ab9c74f.lovable.app |
| Evaluation | *(Fill in after viewing the preview: what matched the color palette, layout, pages; what was missing.)* Stack mismatch: React/Tailwind is not allowed for the final submission. |
| Improvement | Reused only the visual direction (palette, card style, page list). Implemented the doughnut idea as accessible category progress bars to avoid an extra chart library. |

## Entry 3: Application build

| Field | Details |
| --- | --- |
| Technique or framework | Task decomposition / prompt chaining (structure → CSS → JS → pages) + Constraints |
| Purpose | Build separate HTML, CSS, JS files with Bootstrap, localStorage, validation, and accessibility. |
| Exact prompt | *(Paste the exact build prompt you gave, or use this one)* "Build a frontend-only expense tracker called Gastos using HTML, CSS, JavaScript, and Bootstrap 5. Requirements: 4 pages with working navbar; localStorage; search, filter, sort, delete; a validated add-expense form with clear messages; budget page with progress states; separate files (index.html, pages/, assets/css/style.css, assets/js/script.js); accessible labels, visible focus, responsive layout. Output the full code per file." |
| Result summary | Generated 4 HTML pages, one stylesheet, one script, and SVG images. |
| Evaluation | Correct: navigation, validation, persistence, responsive layout (tested at 1280/768/375 px). Errors found: sample dates could fall outside the current month; amber text had poor contrast. |
| Improvement | Revised: dates generated within the current month; amber used only as a background with dark text. |

## Entry 4: Testing and debugging

| Field | Details |
| --- | --- |
| Technique or framework | Chain-of-thought / step-by-step verification + Self-critique |
| Purpose | Check every Task 4 item and find defects. |
| Exact prompt | "Test this app step by step: empty form, invalid form, valid form, search with no results, delete, budget over limit, and layout at 375/768/1280 px. List each check, the expected result, the actual result, and any fixes needed." |
| Result summary | A checklist of 12 tests, all passing after two fixes (see README testing table). |
| Evaluation | Correct: all items covered. Missing: testing on a real phone and in Firefox. |
| Improvement | *(Do this manually on your own device and note it in the README.)* |

---

## Additional techniques to run and record (TO RUN)

Use the techniques your class covered. For each, run the prompt, then copy the real output summary and your evaluation into a table like the ones above.

| Technique | Suggested prompt (adapt it) |
| --- | --- |
| Zero-shot | "Write the CSS for a responsive card grid for an expense tracker." |
| One/Few-shot | "Here are two examples of my error messages: 'Enter what you spent on.' and 'Amount must be greater than ₱0.' Write five more in the same style for the budget form." |
| Chain-of-thought | "Explain step by step how my `totalsByCategory()` function computes category totals, then identify any bug." |
| Role / persona | "Act as an accessibility auditor. Review my add-expense form against WCAG 2.1 AA and list issues." |
| Iterative refinement | "Improve the empty state on the Transactions page: shorter text, clearer next action." |
| Persona + audience | "Rewrite my README intro for a first-year student with no coding background." |
| Self-consistency / critique | "Review your own code for bugs and edge cases, then give a corrected version." |
| ReAct / tool use | "Use Lovable to preview the design, then list what to adjust in my CSS." |

> Match these to your class's exact list (for example CRISPE, RACE, RISEN, CO-STAR, or others) and add any that are missing.
