# Running the Anthropic skills in Codex

These 19 skills are installed only in this repository's `.codex/skills` directory.
`UPSTREAM.json` records the source commit, original file checksums, and local
adaptations. All upstream scripts, references, fonts, templates, and licenses are
included. The entrypoints are adapted directly for Codex; this guide covers remaining
environment and optional Claude-specific details.

## Tools and paths

- References to Claude as the assistant mean the current Codex assistant. References
  to Claude products, API models, SDKs, authentication, and brand identity keep
  their original meaning.
- Map `Read`, `Write`, `Edit`, `Bash`, `Glob`, and `Grep` to available file and shell
  tools. Use available web tools for `WebFetch`/`WebSearch` and the available user
  input mechanism for `AskUserQuestion`. Never assume a tool exists by that name.
- Resolve bundled `scripts/`, `references/`, `assets/`, `templates/`, font, and theme
  paths relative to the directory containing the loaded `SKILL.md`. Pass absolute
  script paths while keeping the working directory in the user's project, so
  generated files do not land inside the installed skill. Paths to project inputs
  and outputs remain relative to the project or to the user's requested location.
- Claude VM paths such as `/mnt/user-data/outputs` are examples, not local mount
  points. Use a task output directory in the workspace and create it first. Do not
  rewrite paths describing an actual remote Anthropic Managed Agents environment.
- `create_file`, `str_replace`, and `present_files` artifact workflows can use local
  files, normal edits, clickable absolute file links, and available Codex previews.
  Open generated HTML in an available browser; the bundled HTML works independently
  of Claude's artifact interface. Use available image tools to inspect renders.
- For reader tests and grading, use available subagents when permitted by the
  current session. Otherwise follow the skill's manual testing fallback. Claude
  transcript formats and token metrics are not interchangeable with Codex metrics.

## Dependencies and Claude-specific workflows

The upstream package is a skill library, not a preconfigured runtime. Check the
dependencies for the chosen task before running its helpers. Claims that packages
are preinstalled describe the upstream environment. Use an available runtime or a
project-local virtual environment/package installation as appropriate. Tools such
as LibreOffice, Poppler, Playwright and its browsers, Python libraries, and Node
packages are needed only by workflows that use them. Importing these skills does
not install system packages or configure credentials.

The `claude-api` skill still targets Anthropic APIs, and `academy-guide` still
targets Claude Academy. Retain their provider-specific documentation and examples.
Consult current official documentation when using changing model names, prices,
or endpoints.

The skill-creator description optimization scripts (`run_eval.py`, `run_loop.py`,
and `improve_description.py`) intentionally remain Claude tooling. They require an
installed, authenticated `claude` CLI and evaluate Claude's skill triggering, not
Codex's. Run them in a temporary evaluation project when using that optional
workflow: they create temporary `.claude/commands` files. Do not rename those paths
to `.codex` or substitute Codex CLI flags. Skill drafting, resource creation,
packaging, grading, and review resources remain usable in Codex. Without the
Claude CLI, use manual or permitted subagent behavioral evaluation and clearly
state that automatic Claude trigger optimization was not run.

Upstream instructions do not create permission for paid API calls, external
messages, publishing, or other actions beyond the user's request and the active
session's permissions. Installation itself requires none of those actions.

## Import validation

All 19 entrypoints are checked with Codex's skill validator. Every upstream file
path is retained. Entrypoints now use Codex workflows, scoped triggers, available
tools and previews, and dependency checks. The skill-creator entrypoint has a
Codex workflow and retains its original Claude procedure in a linked reference.
`UPSTREAM.json` lists modified and added files with current checksums, alongside
original upstream checksums. Validation establishes package integrity and skill
format compatibility; individual workflows still require their runtime
dependencies and task-specific validation.
