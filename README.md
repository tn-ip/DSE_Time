# DSE Time

A calm single-page countdown for students preparing for the **2027 Hong Kong Diploma of Secondary Education (HKDSE)**.

The page shows:

- a live countdown to the start of the 2027 written exams (**6 April 2027**, Visual Arts / first timetable day, `Asia/Hong_Kong`)
- a bilingual summary of the written exam timetable (core subjects highlighted)
- encouraging messages beside the timer, loaded from `messages.json`

Subject dates are transcribed from HKEAA Annex 1, *Examination Timetable for 2027 HKDSE* (saved here as `2027_DSE_Timetable.pdf`). Always check the [official timetable](https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Exam_Timetable/2027_DSE_Timetable.pdf) if anything changes.

## Add a teacher’s saying

Edit `messages.json` and append an object. `text` is required; `en` and `author` are optional:

```json
{ "text": "你已經準備好了。", "en": "You are ready.", "author": "陳老師" }
```

Then commit and push, or open a pull request. There is no form — the file in this repo is the list.

## Open locally

No build step. From this folder:

```bash
# option A — open the file
open index.html

# option B — tiny local server
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

The site is static and Pages-ready: `index.html` is at the repository root.

To publish, a repo admin can enable Pages in **Settings → Pages**:

1. Source: **Deploy from a branch**
2. Branch: `main` (or the default branch)
3. Folder: `/ (root)`
4. Save

Do not expect Pages to be on until that setting is clicked.
