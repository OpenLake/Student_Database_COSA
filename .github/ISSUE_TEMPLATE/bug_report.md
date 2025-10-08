---
name: Bug Report
about: Report unexpected behavior or errors in the CoSA Student Database
title: "Bug: [Short Description]"
labels: bug
assignees: harshitap1305, sakshi1755
---

## 🐞 Describe the Bug
*A clear, one-sentence summary of the issue.*  
Example: "Admin users get a 403 error when trying to delete a student record."

---

## 🔍 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Enter '....'
4. See error

**Example:**
1. Log in as an administrator.
2. Navigate to the 'All Students' page.
3. Click the 'Delete' button on any student row.
4. A "Forbidden" error alert appears.

---

## ✅ Expected vs 🚫 Actual Behavior
- **Expected:** What should happen?  
  Example: "A confirmation modal should appear, and the student should be deleted upon confirmation."
- **Actual:** What happens instead?  
  Example: "A 403 Forbidden error is shown, and the student record remains."

---

## 📸 Screenshots & Evidence
*(Please attach any relevant details)*  
- [ ] Screenshot(s) of the error message or incorrect UI  
- [ ] Console errors (Press F12 → Console tab)  
- [ ] Network logs (Press F12 → Network tab, showing the failed request)  
- [ ] Screen recording (if the bug involves a complex interaction)

**Console Error Example:**
```bash
POST https://api.studentdb.com/students/delete/123 403 (Forbidden)
