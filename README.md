# mds-assignment4 — FLOW/LAB

An interactive field manual on Kanban and flow metrics, built with **React 18**
and **JavaScript**. [Vite](https://vite.dev) bundles it.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev       # development server with hot reload
npm test          # unit tests (Vitest)
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
index.html                 FLOW/LAB entry (home page)
src/
  shared/
    components/Blueprint.jsx   Wireframe frame with "+" corner marks
    styles/design-system.css   "Industry" design-system tokens and classes
  kanban/
    App.jsx                    Page shell: header, current chapter, overlays
    config/                    Course content and settings (no logic):
                               chapters, board, questions, glossary, rewards…
    domain/                    Business rules as plain JS classes, no React:
      KanbanBoard.js             board moves, WIP limits, blocked cards, item age
      FlowSimulation.js          seeded daily flow simulation and its metrics
      TeamCycleData.js           cycle time, percentile and throughput of team data
      CsvImporter.js             CSV parsing and date handling (H12)
      LearnerProgress.js         XP ledger, levels, ranks and badges
      ReviewPlanner.js           wrong answers grouped by chapter (H14)
      CertificateRenderer.js     PNG certificate drawn on a canvas (H14)
    state/
      flowLabReducer.js          every state change, as a pure reducer
      createActions.js           commands for components (+ side effects)
      FlowLabContext.jsx         provider: reducer, autosave, timers, Escape key
      ProgressStorage.js         localStorage persistence ("flowlab-v1" format)
      selectors.js               derived data (current chapter, progress…)
    components/                  Reusable UI: layout, overlays, common widgets
    chapters/                    One folder per chapter, one component per piece
      scrumban/                  Kanban inside the Sprint + Sprint flow challenge (H15)
    styles/flowlab.css           App styles built on the design-system tokens
```

Dependencies point one way: **components → state → domain → config**. The
domain classes don't import React, so they can be unit tested on their own
(`*.test.js` next to each file).

Saved progress uses the same `flowlab-v1` localStorage format as the previous
single-file version, so learners keep their XP, badges and answers.

## Deploy to Netlify

`netlify.toml` runs `npm run build` and publishes `dist/`.
