# 📋 CoSA Student Database: Templates & Review Workflow

This document outlines the GitHub issue/PR templates and the review workflow implemented for the CoSA Student Database project.

---

## 🎯 Overview

We've established a set of GitHub templates to:
* ✅ Ensure contributors provide complete context (**what**, **why**, and **how**).
* ✅ Encourage screenshots and demos for UI changes.
* ✅ Standardize the review process with automatic maintainer assignment.
* ✅ Save review time by making all submissions self-explanatory.

---

## 📦 Pull Request (PR) Template

Our PR template is designed to capture all necessary information for a smooth review.

### Key Features:
* **Why This Change?** section to explain the reasoning and intent behind the PR.
* **Screenshots / Video** section for visual confirmation of UI changes.
* **Comprehensive Checklist** covering testing, documentation, and coding standards.
* **Deployment Notes** to flag any special instructions for releases.

### Sections Include:
1.  📌 Related Issue
2.  ✨ Changes Introduced
3.  🤔 Why This Change?
4.  🖼️ Screenshots / Video
5.  🧪 Testing
6.  📝 Documentation Updates
7.  ✅ Checklist
8.  🚀 Deployment Notes

---

## 🐛 Issue Templates

We provide several templates to handle different types of issues effectively. These are located in the `.github/ISSUE_TEMPLATE/` directory.

### Available Templates:

#### 1. Bug Report (`bug_report.md`)
For reporting defects. It includes fields for environment details, reproduction steps, impact assessment, and evidence collection (screenshots, console logs).

#### 2. Feature Request (`feature_request.md`)
For suggesting new ideas. It structures the proposal with a problem statement, a proposed solution, success metrics, and an impact assessment.

#### 3. Style Enhancement (`style_enhancement.md`)
For proposing UI/UX improvements. It focuses on design consistency, accessibility, and visual mockups.

#### 4. Documentation (`documentation.md`) - **Suggestion for a new template**
For tracking documentation-related tasks, such as correcting typos, adding examples, or writing new guides.

---

## 👥 Review Workflow

We use a `CODEOWNERS` file to automate the assignment of reviewers, ensuring that the right people see the right PRs.

### CODEOWNERS File
**Location:** `.github/CODEOWNERS`

This file automatically assigns reviewers based on which files are changed:
* **Global Owners:** `* @harshitap1305 @sakshi1755` (All PRs will be assigned to maintainers)
* **Frontend Code:** `/client/src/components/`, `/client/src/pages/`
* **Backend Code:** `/server/routes/`, `/server/controllers/`, `/server/models/`
* **Configuration:** `package.json`, `package-lock.json`
* **Documentation:** `*.md`
* **GitHub Actions & Templates:** `/.github/`

---

## 🚀 Benefits

### For Contributors:
* Clear guidance on what information to provide.
* Less back-and-forth communication with maintainers.
* A faster and more predictable approval process.

### For Maintainers:
* PRs and issues are self-explanatory and easy to understand.
* Reviewers are assigned automatically, streamlining the workflow.
* Information is collected consistently, making it easier to triage issues.

### For the Project:
* Higher quality of contributions.
* Better tracking and prioritization of issues.
* Improved documentation and overall project health.

---

## 📝 Usage Guidelines

### When Creating a Pull Request:
1.  Use the template to provide complete context.
2.  Always include screenshots or a recording for UI changes.
3.  Explain the "why" behind your changes, not just the "what."
4.  Ensure all relevant items in the checklist are completed.

### When Creating an Issue:
1.  Choose the most appropriate template for your purpose (Bug, Feature, etc.).
2.  Fill out all relevant sections with as much detail as possible.
3.  Provide clear, reproducible steps for bug reports.
4.  Include screenshots and error messages where applicable.

---

## 📞 Support

For any questions about these templates or the review process, please:
* Create an issue using the appropriate template.
* Contact the maintainers directly: @harshitap1305, @sakshi1755.