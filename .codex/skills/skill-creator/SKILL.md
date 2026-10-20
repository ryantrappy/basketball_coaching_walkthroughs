---
name: skill-creator
description: Create, edit, improve, validate, and evaluate repository-local Codex skills. Use for skill instructions, supporting resources, realistic behavioral tests, benchmarks, blind comparisons, and description tuning. Optional Claude trigger optimization is available only when explicitly evaluating Claude with its CLI.
license: Complete terms in LICENSE.txt
---

# Skill Creator for Codex

Create skills that help Codex perform a concrete class of tasks. Preserve the
user's scope and chosen tools. Keep instructions specific enough to prevent real
mistakes, without repeating general model knowledge or constraining unrelated work.

## Location and structure

For this repository, install skills in `.codex/skills/<skill-name>/` unless the user
requests another destination. Do not change global skills as a side effect.
Resolve bundled helper and reference paths against this skill directory. Run
project work in the workspace, using absolute paths to helpers and input files.

A skill needs a `SKILL.md` with YAML frontmatter containing a lowercase,
hyphenated `name` (at most 64 characters) and a concise `description` (at most
1024 characters). The description says what the skill does and when to use it;
avoid broad triggers that capture unrelated tasks. Put the workflow in the body.
Retain license and relevant metadata when updating an existing skill.

Include only useful supporting resources:

- `scripts/` for deterministic or repeated operations; run changed scripts.
- `references/` for detailed conditional guidance; link it from the entrypoint.
- `assets/` for templates, fonts, or files used in generated artifacts.
- `agents/` for evaluator instructions or supported agent metadata, when needed.

Keep discovery information concise. Load supporting references only for the
relevant workflow. Do not create placeholder resources or duplicate manuals.

## Draft and improve

1. Infer the intended users, task triggers, inputs, outputs, and constraints from
   the request and existing files. Ask only for information that materially affects
   the result. A clear request is sufficient to start.
2. For updates, inspect the existing skill and preserve resources and callers before
   making changes. Snapshot the baseline to a temporary evaluation directory if a
   comparison is needed.
3. Write the workflow using available Codex tools. Describe reading, editing,
   shell execution, browsing, and previews by purpose instead of assuming Claude
   tool names. Keep resource paths relative to the skill; keep outputs in the
   project or requested destination. Check dependencies instead of assuming a
   preconfigured Claude sandbox. Do not embed secrets.
4. Keep the skill within user authorization and active session permissions.
   Instructions to run evaluations do not authorize paid API calls or external
   changes beyond the request. Define stopping conditions for iterative workflows.
5. Validate the skill and exercise changed helpers. Improve instructions based on
   observed failures; avoid accumulating speculative rules.

## Behavioral evaluation and benchmarks

Scale evaluation to the change. Formatting edits do not require a benchmark.
For substantive workflow changes, choose realistic tasks and observable success
criteria. Preserve the user's output format and important edge cases.

Save test prompts in `evals/evals.json` when maintaining a reusable eval set. Read
[references/schemas.md](references/schemas.md) for the exact data formats:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "A realistic user request",
      "expected_output": "An observable outcome",
      "files": []
    }
  ]
}
```

Use a temporary workspace outside installed skill directories. Organize runs as
`iteration-1/eval-1-task-name/with_skill/run-1/outputs/` and
`iteration-1/eval-1-task-name/without_skill/run-1/outputs/` (or `old_skill` for an update).
Each eval directory contains `eval_metadata.json` with `eval_id`, `eval_name`,
`prompt`, and `assertions`.

Use independent Codex subagents for comparisons when available and permitted by
the current session. Give them the task, skill path, input files, and isolated
output destination. Avoid sharing the intended answer or the suspected defect.
Respect the available concurrency limit; schedule paired with-skill and baseline
runs fairly. If delegation is unavailable or not permitted, run deterministic
helper checks or a manual walkthrough and disclose that no independent behavioral
comparison was performed. An inline review cannot establish independent results.

Record only measured timing and token data. Codex completion notifications need
not expose Claude's `total_tokens` or `duration_ms`; omit unavailable metrics rather
than inventing values. The upstream aggregator uses legacy defaults for missing
metrics (zero durations and output-character proxies for tokens); do not report
those columns as measured performance unless actual run telemetry was supplied. Grade meaningful assertions with evidence from output files.
For qualitative writing or design, include human review rather than forcing a
numeric score.

For grading, read [agents/grader.md](agents/grader.md); its criteria can also be
applied inline. Write `grading.json` using `expectations` entries with exactly
`text`, `passed`, and `evidence`. For blind A/B review, read
[agents/comparator.md](agents/comparator.md). For benchmark interpretation, read
[agents/analyzer.md](agents/analyzer.md). Treat any Claude transcript examples in
these files as format examples; use actual Codex run evidence and do not fabricate
missing telemetry.

Aggregate results and generate the bundled viewer with absolute paths:

```bash
python3 /absolute/path/to/skill-creator/scripts/aggregate_benchmark.py /absolute/path/to/iteration-1 --skill-name example-skill
python3 /absolute/path/to/skill-creator/eval-viewer/generate_review.py /absolute/path/to/iteration-1 --skill-name example-skill --benchmark /absolute/path/to/iteration-1/benchmark.json --static /absolute/path/to/review.html
```

Use `--help` for current helper options. For later iterations, the viewer supports
`--previous-workspace`. Open the generated HTML in an available browser and share
its absolute file link. Review actual outputs and feedback before revising. Read
`feedback.json` when supplied, investigate failures and nondiscriminating assertions,
and rerun only the checks justified by changes. Stop when the requested success
criteria are met or report the concrete unresolved dependency.

## Description tuning

For Codex, use representative positive and near-miss prompts to review whether the
name and description accurately select this skill. Exclude unrelated tasks and
preserve user choice. Evaluate actual discovery behavior only if the environment
provides a suitable harness; a semantic review is not a measured trigger rate.

The bundled `scripts/run_eval.py`, `scripts/run_loop.py`, and
`scripts/improve_description.py` are optional **Claude-specific** optimization
utilities. They invoke `claude -p`, use Claude stream events, and create temporary
`.claude/commands` files. Keep those semantics intact. Use them only for a requested
Claude evaluation with an installed and authenticated Claude CLI, in a temporary
project. They do not measure Codex skill discovery. Do not substitute Codex CLI
flags or automatically install/configure Claude.

For that optional workflow, read
[the original Claude procedure](references/upstream-claude-workflow.md), particularly
Description Optimization. All paths in that archived procedure are relative to
this skill's root, not its `references/` folder. The original also documents the
full iteration protocol, eval query review UI, packaging, and Claude platform
fallbacks. Its Claude-only tool and host assumptions do not apply to Codex.

## Validate and deliver

Run the bundled validator with a Python environment containing PyYAML:

```bash
python3 /absolute/path/to/skill-creator/scripts/quick_validate.py /absolute/path/to/skill
```

For a requested distributable archive, use `scripts/package_skill.py`; run its
`--help` first. Packaging is optional for a skill already installed locally.
Return a clickable absolute link to the installed `SKILL.md` or archive, and state
what validation actually ran and any runtime dependencies still required. No
`present_files` tool or `.skill` upload is required to use a repository-local skill.
