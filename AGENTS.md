# Agent Rules — Read This First, Every Session

> This file is the single source of truth for agent behaviour.  
> If your tool wants its own rules file (e.g. `.cursorrules`, `.clinerules`), make it a one-line pointer to this file.

---

## Start of Session

1. Read `docs/PROGRESS.md`, then the task file listed under **Next Action**.
2. Run `git status` and `git log -5`. Finish or stash any unfinished work.
3. Run `make test` to confirm the starting state is green.
4. Report the state in **5 lines** before doing anything else.

---

## While Working

- Work on **ONE task at a time**, on branch `task/T-xxx-short-name`.
- Never change `openapi.yaml` by hand — change the Django serializers/views, then run `make contract`.
- Never hand-edit `frontend/src/api/generated/` — it is always auto-generated.
- Business logic lives in `services.py`; reads in `selectors.py`; views stay thin.
- Every service function gets tests. Booking and availability need **80%+ coverage**.
- Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
- No secrets in code. Use env vars listed in `.env.example`.
- Do not install new dependencies without adding a line to `docs/DECISIONS.md`.

---

## End of Session (or When Tokens Are Low)

1. Commit with message: `T-xxx: what changed`.
2. Update the task file checkboxes and notes.
3. Update `docs/PROGRESS.md`: status table + **Next Action** (one precise sentence).
4. Push the branch.

---

## Commands

| Command | Does |
|---|---|
| `make dev` | Run backend and frontend together |
| `make test` | Backend pytest + frontend Vitest |
| `make lint` | Ruff · mypy · ESLint · tsc |
| `make migrate` | Apply Django migrations |
| `make contract` | Regenerate `openapi.yaml` and frontend types |

---

## Session Prompts (Copy & Paste)

### Start of every session (any tool)
```
You are continuing an existing project. Do not start from scratch.
1. Read AGENTS.md, docs/PROGRESS.md, and the task file under Next Action.
2. Run git status and git log -5, then make test. Report the state in 5 lines.
3. Work only on the Next Action task. Follow acceptance criteria exactly.
4. Commit small and often on the task branch.
5. Before you run low on context, do the End of session steps in AGENTS.md.
Ask me only if a requirement is ambiguous.
```

### When tokens are running low
```
Stop adding features. Run the End of session steps now: commit, update the task
file checkboxes, rewrite Next Action in docs/PROGRESS.md as one precise sentence
including any failing test names, and push.
```

### First-ever session
```
Create the repo structure from docs/ARCHITECTURE.md. Write AGENTS.md,
docs/PROGRESS.md, REQUIREMENTS.md, DECISIONS.md, and one file per task in
docs/tasks/ from the task table. Then complete T-001 only.
```
