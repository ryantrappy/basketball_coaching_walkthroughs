---
name: web-artifacts-builder
description: "Build complex, standalone HTML artifacts with React, TypeScript, Tailwind CSS, and shadcn/ui, including state management and bundling into one shareable HTML file. Use for multi-component web artifacts; simpler single-file HTML does not need this scaffolding."
license: Complete terms in LICENSE.txt
---

## Codex compatibility

Use available Codex file, shell, web, and preview tools. Resolve bundled resources relative to this skill directory; keep project inputs and generated outputs in the workspace. Check dependencies before running helpers; use a project-local environment for missing packages. Return artifacts with clickable absolute file links and inspect visual outputs before delivery. See [environment details](../CODEX-COMPATIBILITY.md) when needed.


# Web Artifacts Builder

To build a standalone frontend HTML artifact in this workspace, follow these steps. Use the initializer only for a new project; preserve the structure and package manager of an existing app.
1. Initialize the frontend repo using `scripts/init-artifact.sh`
2. Develop your artifact by editing the generated code
3. Bundle all code into a single HTML file using `scripts/bundle-artifact.sh`
4. Build and verify the artifact
5. Open a browser preview and link the generated file

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Design & Style Guidelines

VERY IMPORTANT: To avoid what is often referred to as "AI slop", avoid using excessive centered layouts, purple gradients, uniform rounded corners, and Inter font.

## Quick Start

### Step 1: Initialize Project

Run the initialization script to create a new React project:
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

This creates a fully configured project with:
- ✅ React + TypeScript (via Vite)
- ✅ Tailwind CSS 3.4.1 with shadcn/ui theming system
- ✅ Path aliases (`@/`) configured
- ✅ 40+ shadcn/ui components pre-installed
- ✅ All Radix UI dependencies included
- ✅ Parcel configured for bundling (via .parcelrc)
- ✅ Node 18+ compatibility (auto-detects and pins Vite version)

### Step 2: Develop Your Artifact

To build the artifact, edit the generated files. See **Common Development Tasks** below for guidance.

### Step 3: Bundle to Single HTML File

To bundle the React app into a single HTML artifact:
```bash
bash scripts/bundle-artifact.sh
```

This creates `bundle.html` - a self-contained artifact with all JavaScript, CSS, and dependencies inlined. Open this file in an available browser preview and share its absolute file link in Codex.

**Requirements**: Your project must have an `index.html` in the root directory.

**What the script does**:
- Installs bundling dependencies (parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline)
- Creates `.parcelrc` config with path alias support
- Builds with Parcel (no source maps)
- Inlines all assets into single HTML using html-inline

### Step 4: Share Artifact with User

Open the bundled HTML using an available browser preview. Share a clickable absolute file link; do not claim it is an inline interactive artifact unless the current interface supports that.

### Step 5: Testing and preview

Run the relevant build and inspect the bundled HTML in an available browser. Check the main interactions and browser errors before delivery. Use Playwright when available for repeatable checks. If browser tooling is unavailable, report the checks completed and the unverified behavior. Resolve script paths against this skill directory, even after changing into the generated project.

## Reference

- **shadcn/ui components**: https://ui.shadcn.com/docs/components