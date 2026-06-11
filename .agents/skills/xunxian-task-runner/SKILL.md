---
name: xunxian-task-runner
description: Execute one scoped task for the Xunxian Wendao project. Use when the user asks Codex to implement or complete a specific Xunxian Wendao task, milestone, phase item, or PRD item while preserving project scope and reporting in the required task format.
---

# Xunxian Task Runner

Use this skill when executing a single Task for the "Xunxian Wendao" project.

## Required Workflow

1. Read `docs/WEB_PRD.md` before making any implementation decision.
2. Execute exactly one Task per turn unless the user explicitly changes the scope.
3. Do not implement future phases early.
4. Do not create Unity files.
5. Do not reference image assets that do not exist in the repository.
6. Keep changes limited to the current Task and the files required for that Task.
7. Run `npm run build` before reporting completion.
8. If `npm run build` fails, fix the failure before considering the Task complete.
9. Report completion using the fixed template in `references/task-report-template.md`.

## Reporting

Load `references/task-report-template.md` when preparing the final response. Keep every heading from the template, even when a section is "none".

Optionally validate a draft report with:

```bash
node skills/xunxian-task-runner/scripts/verify-task-report.js <report-file>
```

The script also accepts report text from stdin.
