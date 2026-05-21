````md
# Git & GitHub Cheat Sheet 🚀

## Table of Contents

1. Git Basics
2. Repository Setup
3. Branching
4. Commit Standards
5. Working with Remote
6. Fork Workflow
7. Pull Requests
8. Syncing Forks
9. Undo & Recovery
10. Naming Conventions
11. Recommended Workflow
12. Useful Commands

---

# 1. Git Basics

## Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
````

## Check Config

```bash
git config --list
```

---

# 2. Repository Setup

## Clone Repository

```bash
git clone https://github.com/user/repo.git
```

Clone specific branch:

```bash
git clone -b branch-name https://github.com/user/repo.git
```

## Initialize New Repository

```bash
git init
```

## Check Status

```bash
git status
```

## Add Files

Add all files:

```bash
git add .
```

Add specific file:

```bash
git add file.ts
```

## Commit Changes

```bash
git commit -m "feat: add login page"
```

---

# 3. Branching

## Create Branch

```bash
git checkout -b feature/auth-login
```

OR

```bash
git switch -c feature/auth-login
```

## Switch Branch

```bash
git checkout main
```

OR

```bash
git switch main
```

## List Branches

```bash
git branch
```

## Delete Branch

```bash
git branch -d feature/auth-login
```

Force delete:

```bash
git branch -D feature/auth-login
```

---

# 4. Commit Standards

# Conventional Commits

## Format

```text
type(scope): message
```

Example:

```text
feat(auth): add google login
fix(api): handle null response
docs(readme): update installation guide
```

---

## Common Commit Types

| Type     | Purpose                 |
| -------- | ----------------------- |
| feat     | New feature             |
| fix      | Bug fix                 |
| docs     | Documentation           |
| style    | Formatting only         |
| refactor | Code improvement        |
| test     | Tests                   |
| chore    | Maintenance             |
| perf     | Performance improvement |
| build    | Build changes           |
| ci       | CI/CD changes           |

---

## Good Commit Messages ✅

```text
feat(cart): add quantity selector
fix(login): prevent empty password submit
docs(api): add auth examples
```

## Bad Commit Messages ❌

```text
update stuff
fix bug
changes
final
```

---

# 5. Working with Remote

## Add Remote

```bash
git remote add origin https://github.com/user/repo.git
```

## View Remotes

```bash
git remote -v
```

## Push Branch

```bash
git push origin feature/auth-login
```

## Push First Time

```bash
git push -u origin feature/auth-login
```

## Pull Latest Changes

```bash
git pull origin main
```

## Fetch Changes

```bash
git fetch origin
```

---

# 6. Fork Workflow

# Step 1: Fork Repository

* Open repository on GitHub
* Click `Fork`

This creates:

```text
original/repo -> your/repo
```

---

# Step 2: Clone Fork

```bash
git clone https://github.com/your-username/repo.git
```

---

# Step 3: Add Upstream Remote

```bash
git remote add upstream https://github.com/original-owner/repo.git
```

Verify:

```bash
git remote -v
```

Expected:

```text
origin    https://github.com/your-username/repo.git
upstream  https://github.com/original-owner/repo.git
```

---

# Step 4: Create Feature Branch

```bash
git checkout -b feature/add-navbar
```

---

# Step 5: Make Changes

```bash
git add .
git commit -m "feat(navbar): add responsive navbar"
```

---

# Step 6: Push to Your Fork

```bash
git push origin feature/add-navbar
```

---

# Step 7: Create Pull Request

* Open your fork on GitHub
* Click `Compare & pull request`
* Select:

  * Base repo = original repository
  * Head repo = your fork branch

---

# 7. Pull Requests (PR)

# PR Naming Standards

## PR Title Format

```text
type(scope): short description
```

Examples:

```text
feat(auth): add JWT authentication
fix(ui): correct mobile sidebar overlap
docs(readme): improve setup instructions
```

---

# PR Description Template

```md
## Summary

Short explanation of changes.

## Changes Made

- Added login form
- Added validation
- Added API integration

## Screenshots

Add screenshots if UI changed.

## Testing

- [x] Tested locally
- [x] Mobile responsive
- [x] No console errors

## Related Issue

Closes #12
```

---

# PR Best Practices ✅

## Keep PR Small

Good:

```text
Add login validation
```

Bad:

```text
Entire auth system + dashboard + refactor
```

---

## One Purpose Per PR

PR should solve ONE problem only.

---

## Rebase Before PR

```bash
git fetch upstream
git rebase upstream/main
```

---

## Test Before PR

Always verify:

* Build passes
* No lint errors
* No console errors
* Features work properly

---

## Write Clear Descriptions

Avoid:

```text
updated stuff
```

Use:

```text
Added JWT refresh token support
```

---

# PR Review Etiquette

## As Author

* Respond politely
* Fix requested changes
* Keep discussion technical

## As Reviewer

* Suggest improvements
* Avoid personal comments
* Explain WHY something should change

---

# 8. Syncing Forks

## Fetch Latest Upstream

```bash
git fetch upstream
```

## Merge Upstream Main

```bash
git checkout main
git merge upstream/main
```

## Push Updated Main

```bash
git push origin main
```

---

# 9. Undo & Recovery

## Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

## Undo Last Commit (Remove Changes)

```bash
git reset --hard HEAD~1
```

---

## Restore File

```bash
git restore file.ts
```

---

## Remove File from Staging

```bash
git reset file.ts
```

---

## View Commit History

```bash
git log
```

Compact:

```bash
git log --oneline
```

---

# 10. Naming Conventions

# Branch Naming

## Feature

```text
feature/login-page
feature/add-payment-gateway
```

## Fix

```text
fix/navbar-overflow
fix/auth-token-expiry
```

## Refactor

```text
refactor/api-client
```

## Docs

```text
docs/setup-guide
```

---

# File Naming

## React Components

```text
UserCard.tsx
LoginForm.tsx
```

## Hooks

```text
useAuth.ts
useDebounce.ts
```

## Utilities

```text
formatDate.ts
apiClient.ts
```

---

# Environment Variables

```text
NEXT_PUBLIC_API_URL
DATABASE_URL
JWT_SECRET
```

---

# 11. Recommended Workflow

# Team Workflow

## Daily Flow

```bash
git checkout main
git pull origin main

git checkout -b feature/new-feature

# make changes

git add .
git commit -m "feat(module): add new feature"

git push origin feature/new-feature
```

Create PR → Review → Merge

---

# Open Source Workflow

```text
Fork Repo
↓
Clone Fork
↓
Add Upstream
↓
Create Branch
↓
Commit Changes
↓
Push to Fork
↓
Create PR
↓
Review
↓
Merge
```

---

# 12. Useful Commands

## Stash Changes

```bash
git stash
```

Restore stash:

```bash
git stash pop
```

---

## Rename Branch

```bash
git branch -m old-name new-name
```

---

## Show Differences

```bash
git diff
```

---

## Cherry Pick Commit

```bash
git cherry-pick commit-hash
```

---

## Clean Untracked Files

```bash
git clean -fd
```

---

## Tags

Create tag:

```bash
git tag v1.0.0
```

Push tag:

```bash
git push origin v1.0.0
```

---

# Git Flow Example 🚀

```bash
# clone repo
git clone repo-url

# create branch
git checkout -b feature/add-auth

# make changes

# add files
git add .

# commit
git commit -m "feat(auth): add login API"

# push
git push origin feature/add-auth

# create PR
```

---

# Golden Rules ✅

* Pull before starting work
* Never commit directly to `main`
* Use meaningful commit messages
* Keep PRs small
* Rebase frequently
* Review code carefully
* Test before push
* Never push secrets

---

# Common Mistakes ❌

## Force Push to Main

```bash
git push --force
```

Avoid on shared branches.

---

## Huge PRs

Hard to review and maintain.

---

## Bad Commit Messages

```text
fix
update
done
```

---

## Mixing Multiple Features

One branch = one feature/fix.

---

# Quick Reference ⚡

## Clone

```bash
git clone url
```

## Create Branch

```bash
git checkout -b branch-name
```

## Add

```bash
git add .
```

## Commit

```bash
git commit -m "message"
```

## Push

```bash
git push origin branch-name
```

## Pull

```bash
git pull origin main
```

## Fetch

```bash
git fetch
```

## Merge

```bash
git merge branch-name
```

## Rebase

```bash
git rebase main
```

## Stash

```bash
git stash
```

## Pop Stash

```bash
git stash pop
```

## Delete Branch

```bash
git branch -d branch-name
```

---

```
```
