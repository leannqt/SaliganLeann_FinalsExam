# Git and GitHub steps (Task 5)

You must run these yourself in **Git Bash or CMD** (the exam does not accept website uploads). Replace the placeholders. Take screenshots of the push and of `git log`.

## 0. One-time setup
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 1. Initialize and make commits in stages
```bash
cd path/to/gastos
git init
git branch -M main

# Commit 1: structure and styles
git add index.html assets/css assets/images
git commit -m "Add project structure, dashboard page, styles, and images"

# Commit 2: remaining pages and JavaScript
git add pages assets/js
git commit -m "Add transactions, add-expense, and budget pages with JavaScript features"

# Commit 3: documentation
git add README.md PROMPT_LOG.md docs
git commit -m "Add README, prompt log, and screenshots folder"
```
After you take your app screenshots and put them in `docs/screenshots/`:
```bash
git add docs/screenshots
git commit -m "Add application screenshots"
```

## 2. Create the GitHub repository
On github.com click **New repository**, name it `gastos-expense-tracker`, keep it **Public** (or add your instructor as a collaborator), and do **not** add a README (you already have one).

## 3. Connect and push
```bash
git remote add origin https://github.com/YOUR-USERNAME/gastos-expense-tracker.git
git push -u origin main
```
If asked to sign in, use the browser prompt or a Personal Access Token as the password.

## 4. Verify and capture evidence
```bash
git log --oneline
git status
git remote -v
```
Screenshot 1: the terminal showing the successful `git push`.
Screenshot 2: the output of `git log --oneline` (and/or the GitHub commits page).
Then open the repository URL in your browser and confirm every file and folder is there.
