# Editing Le Lexique's vocabulary

## Where the words live

Everything is in one file in the `A-Level-French-Edexcel-Vocab-training`
repository:

```
data/corpus.js
```

`app.js` never contains vocabulary. It reads `window.CORPUS` and groups the
entries by `unit`, then by `lesson`, in the order it meets them. So adding a
word is adding one line to that array — nothing else needs touching, and the
unit and lesson lists rebuild themselves.

## One entry

```js
{"id": "U9.1.022",
 "unit": "U9", "unitName": "Politique",
 "lesson": "U9.1", "lessonTitle": "Political parties & spectrum",
 "fr": ["le Rassemblement National (RN)", "le Rassemblement national", "le RN"],
 "en": ["the National Rally", "the main far-right party, renamed from the Front National in 2018"]}
```

Five rules, and that is the whole format:

1. **`fr` is a list of interchangeable forms.** Any of them is accepted when a
   student types the French. The first is the one shown as the answer.
2. **`en` is a list of acceptable meanings.** Same again in the other
   direction. Put the shortest, cleanest gloss first — it is what the student
   reads as the prompt.
3. **`id` must be unique.** The convention is `UNIT.LESSON.NNN`. Nothing
   depends on the numbering being contiguous, so appending `.022`, `.023` and
   so on is safe.
4. **`lesson` decides where it appears.** Reuse an existing lesson id to add
   to that list; invent a new one to create a new lesson.
5. **`lessonTitle` must be spelt identically** on every entry of that lesson —
   the app takes the title from the first entry it meets.

## The file was unreadable, and now is not

`data/corpus.js` was two comment lines followed by **one line of 783 000
characters**. GitHub's web editor will open it, but you cannot find anything
in it, every change shows as "the whole file changed", and one mistyped comma
breaks the entire site with no clue where.

The `corpus.js` in this folder is the same data with **one entry per line** —
3 500 lines instead of 3. I checked it entry for entry against the original:
`JSON.stringify(before) === JSON.stringify(after)` is true, and the app loads
it with no error. From now on you can search it for `Rassemblement`, edit the
line you find, and the GitHub diff shows one line changed.

## Three ways to add words

**One or two words — edit on GitHub.** Open `data/corpus.js`, press `.` or
click the pencil, find a nearby line, copy it, change the `id`, `fr` and `en`.
Commit. GitHub Pages republishes in about a minute.

**A batch — paste a block.** Put the new lines just before the closing `];`
at the end of the file. `U9-additions.js` in this folder is exactly that: 48
lines you can paste as they stand.

**A whole unit — go back to the workbook.** The corpus was generated from
*ALevel French Vocabulary — Master 2026.xlsx*. If you are adding thirty words
it is less error-prone to add them to the spreadsheet and have the file
regenerated from it than to hand-edit JSON. Send me the sheet and I will
regenerate.

After any edit, the safest check is to open the site and watch the unit card:
if the count went up by what you added, the file parsed. If the page is blank,
the JSON is broken — almost always a missing comma between entries, or a
straight quote inside a French phrase that needs escaping as `\"`.

## What I have added for U9.1

The political parties list was a museum piece. It taught the **UDF** (folded
into the MoDem in 2007), the **UMP** (renamed Les Républicains in 2015) and the
**Front National** (renamed Rassemblement National in 2018), and had no LR, no
RN, no LFI, no Renaissance and no Écologistes. A student revising from it would
name three parties that no longer exist.

**48 new entries**, taking the lesson from 21 words to 69:

- **14 parties** — RN, Reconquête !, UDR, Les Républicains, Renaissance,
  Horizons, MoDem, UDI, Nouvelle Énergie, LFI, Nouveau Front Populaire, Place
  Publique, Les Écologistes, EELV. Each gloss says what the party *is*, and
  names the former title where there is one, so the old entries and the new
  ones agree rather than contradicting each other.
- **24 pieces of lexis** — the words you need to *talk* about the parties, which
  is where the marks actually are: *un bloc, une mouvance, un transfuge, une
  scission, le ralliement, se rallier à, l'ancrage local, l'investiture,
  investir un candidat, une primaire, une alliance tactique, un sondage, être en
  tête des sondages, la recomposition politique, le clivage gauche-droite, une
  fracture, la majorité présidentielle, un sortant, le centre droit, le centre
  gauche, la droite traditionnelle, la gauche radicale, un parti attrape-tout.*
- **10 leaders** — Bardella, Le Pen, Zemmour, Ciotti, Retailleau, Lisnard,
  Mélenchon, Faure, Glucksmann, Roussel. **Every gloss carries a year**, so in
  2028 it is obvious which ones need checking.

**Four corrections** to existing entries, each an exact find-and-replace in
`U9-corrections.txt`. One of them is a real bug rather than an update:

```
U9.1.018   "fr": ["de gauche"]
           "en": ["to be right-wing", "left-wing", "être de droite"]
```

The French and the English are the wrong way round, and *être de droite* is
sitting in the English list. A student typing the correct answer would be
marked wrong.

## What I deliberately did not add

Your notes carried claims that will not survive the year: who is topping the
polls, who has strengthened their local anchoring, who has "officially entered
the race". None of that is in the cards. Vocabulary that goes stale in a term
is worse than no vocabulary, because a student learns it and then says it in an
exam. Party names and the lexis around them are stable; the standings are not.

Two names to check before you commit, because my information and your notes
disagree, and I would rather you decided than have me pick silently:

- **UDR.** Your note calls it *Union de la Droite Nationale*. I have it as
  *Union des Droites pour la République*. The entry currently uses the second,
  with the acronym in the `fr` list either way, so the abbreviation is accepted
  regardless. Change the long form if yours is right.
- **Nouvelle Énergie** I could only confirm as a movement rather than a
  registered party; the gloss says "a pro-business centre-right party", which
  may be a shade too strong.

## Files here

| | |
|---|---|
| `corpus.js` | drop-in replacement — 3 492 entries, one per line, additions and corrections already applied |
| `U9-additions.js` | just the 48 new lines, if you would rather paste them yourself |
| `U9-corrections.txt` | the four find-and-replace fixes, exact text |

## Verified

- The patched corpus loads in the real app: **3 492 entries**, U9.1 shows
  **69 mots**, no JavaScript error, no 404.
- The reformatted file is identical to the original data entry for entry.
- Eight of the new entries — including *Reconquête*, *Les Écologistes*,
  *Bardella*, *l'ancrage local* — render in the lesson list through the app's
  own screens, not just in the data.
- The four corrections each matched exactly once, so nothing else was touched.
