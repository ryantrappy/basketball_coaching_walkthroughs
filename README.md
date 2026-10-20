# Second Read

A basketball playbook for experienced players, with separate Offense, Defense, and Inbounds views in one static React app. Built with React, TypeScript, Vite, and SVG. No authentication, backend, API keys, database, analytics, or runtime third-party requests. Fonts ship with the app.

Twenty-two interactive lessons, each with four animated steps, tactical reads, a common mistake, a practice constraint, coaching references, and related concepts.

- **Offense (10):** pick-and-pop, pick-and-roll, short roll, Spain pick-and-roll, drive-and-kick spacing, dribble handoff, empty-corner pick-and-roll, ghost screen, 45 cut, and hammer action.
- **Defense (6):** drop coverage, switching ball screens, blitz and rotate, ICE the side screen, low-man tag and X-out, and closeout containment.
- **Inbounds (6):** baseline box cross-screen, box screen-the-screener, stack releases, inbounder give-and-go, sideline zipper entry, and sideline screen-and-slip.

Use the header navigation to switch views. Each library groups plays into expandable types, such as Ball screens, Help & rotations, or Baseline (BLOB). One category opens at a time; selecting a related lesson, following a bookmark, or using browser history reveals the current lesson’s category automatically. The category buttons support Enter and Space. The app remembers your most recent lesson on each side during the session. Related concepts can link across all three sections. Inbounds lessons include the throw-in spot, an identified inbounder and safety, and conditional entry routes. Defense lessons emphasize the defenders in cyan and let you isolate their coordinated responsibilities.

## Development

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Static deployment

```sh
npm run build
```

The build runs strict TypeScript checks for application code, lesson data, tests, and build configuration before bundling. Run `npm run typecheck` to check types without producing assets.

Serve the generated `dist/` directory with any static web server. All asset paths are relative, so it also works under a subdirectory. Offense lessons use hashes such as `#spain`; defense uses `#defense/drop-coverage`. Inbounds plays use hashes such as `#inbounds/box-cross`. All views are bookmarkable and support browser back/forward, so no server-side route handling is needed. `npm run preview` serves a local preview of the build.

## Self-host with Docker

The host needs Docker Engine and the Docker Compose plugin. On `trappserv.er`, clone or copy this repository, then run from its root:

```sh
docker compose up -d --build
```

Open [http://trappserv.er:8080](http://trappserv.er:8080). For a different host port:

```sh
SECOND_READ_PORT=8090 docker compose up -d --build
```

You can also set `SECOND_READ_PORT=8090` in a local `.env` file so subsequent Compose commands use the same port. An existing reverse proxy can forward to the configured host port.

The multi-stage Dockerfile installs the locked dependencies, type-checks the project, and builds React in a Node build stage, then copies only the generated static assets into the Nginx runtime image. No host Node installation, API keys, database, or persistent volumes are needed. The image includes an HTTP health check; Compose restarts the container unless explicitly stopped. Nginx revalidates the entry page and caches hashed assets so a rebuilt deployment loads the updated app. Nginx is a deployment choice, not an application requirement: a Node HTTP server or another static host can serve `dist/` too. The app has no server-side rendering or API requiring a Node runtime.

Update after changing or pulling the source:

```sh
docker compose up -d --build
```

Inspect status and logs, or stop the site:

```sh
docker compose ps
docker compose logs -f second-read
docker compose down
```

To validate the configuration without starting containers:

```sh
docker compose config --quiet
```

## Editing lessons

- `src/concepts.ts`: the original six lessons, combined lesson list, and source references.
- `src/offenseConcepts.ts`: the additional offensive lessons.
- `src/defenseConcepts.ts`: defensive lesson copy and animation frames.
- `src/inboundsConcepts.ts`: baseline and sideline lesson copy, throw-in setup, and animation frames.
- `src/lessonHelpers.ts`: shared frame and step constructors.
- `src/main.tsx`: React UI, SVG court, playback, and interaction logic.
- `src/ConceptMenu.tsx`: accessible category dropdowns and play selection.
- `src/passingReads.ts`: conditional ball routes, their opening reads, and the step at which they appear.
- `src/inboundsReads.ts`: entry options and safety outlets, included in the passing-read lookup.
- `src/defensiveReads.ts`: defender assignments, descriptions, and when to show them. Defender indices are 6–10, representing x1–x5.
- `src/types.ts`: shared domain types for lessons, player coordinates, steps, and decisions.
- `src/styles.css`: layout and visual design.

Frames use a 600 × 470 SVG view box, with the basket at the top. Each has ten player coordinates: offense 1–5, then their defenders x1–x5. `ball` identifies the offensive player holding the ball. Optional `pass: [from, to]` draws a dashed passing lane. Player positions and ball possession interpolate between frames. Inbounds lessons add `inbound: { edge, player, spot, safety }`. They use an expanded view box to show the passer outside the boundary. The entry-pass overlay remains anchored at the original throw-in spot after the inbounder steps onto the court; the give-and-go instead compares the wing receiver’s return-pass options after the entry catch. Optional `screens` maps step indices to the players setting screens. The court is schematic, not a scale regulation court. Diagrams show an illustrative possession, not a full simulation of defensive decisions. Coaching copy is original; source links provide further study.

## Controls

Play/pause, reset, previous/next step, 0.25×–1.5× speed, and a continuous timeline. Select an individual step to jump to it. Defense, movement paths, and passing reads can be hidden independently. At the decision point, lettered ball routes show the example pass in orange and alternate reads in blue. Select a route to isolate it and read the coverage that opens it. The final frame keeps these pre-pass choices visible for comparison. Dashed destination markers show where moving receivers are going; solid blue routes indicate keeping the ball to drive. On Defense, `Assignments` highlights coordinated jobs rather than alternate passes. Select a job to highlight its defender and movement. Defensive identities stay x1–x5 even when they switch matchups. `Show offense` can hide offensive markers while preserving the defenders. Arrow keys step and Space plays/pauses when focus is outside a control. Escape closes the expanded board or guide. Dialogs keep keyboard focus inside and return it on close.

## Checks

```sh
npm run build
npx playwright install chromium
npm test
```

Alternatively, use installed Chrome: `PLAYWRIGHT_CHANNEL=chrome npm test`. Tests cover playback ending, speed selection, scrubbing, overlays, coverage expansion, related navigation, all lessons, mobile overflow, dialog keyboard focus, conditional ball routes with isolation and toggles, all twenty-two lesson routes, defensive assignment isolation, cross-view navigation, history, defensive and inbounds mobile layouts, baseline/sideline category dropdowns, the entry-to-return pass sequence, keyboard category controls, and automatic category reveal. The Playwright config starts Vite automatically when needed.
