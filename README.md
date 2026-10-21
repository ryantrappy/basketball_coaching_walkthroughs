# Second Read

A basketball playbook for experienced players, with separate Offense, Defense, Inbounds, and Drills views in one static React app. Built with React, TypeScript, Vite, and SVG. No authentication, backend, API keys, database, analytics, or runtime third-party requests. Fonts ship with the app.

Thirty interactive lessons, each with four animated steps, tactical reads, a common mistake, a practice constraint, coaching references, and related concepts.

- **Offense (15):** pick-and-pop, pick-and-roll, short roll, Spain pick-and-roll, drive-and-kick spacing, dribble handoff, empty-corner pick-and-roll, ghost screen, 45 cut, hammer action, high post and short corner, zone overload, 2-on-1, 3-on-2, and early drag screen.
- **Defense (9):** drop coverage, switching ball screens, blitz and rotate, ICE the side screen, low-man tag and X-out, closeout containment, 2–3 zone shifts, zone rebounding, and transition matchups.
- **Inbounds (6):** baseline box cross-screen, box screen-the-screener, stack releases, inbounder give-and-go, sideline zipper entry, and sideline screen-and-slip.

Use the header navigation to switch views. Each library groups plays into expandable types, such as Ball screens, Help & rotations, or Baseline (BLOB). One category opens at a time; selecting a related lesson, following a bookmark, or using browser history reveals the current lesson’s category automatically. The category buttons support Enter and Space. The app remembers your most recent lesson on each side during the session. Related concepts can link across all three sections. Inbounds lessons include the throw-in spot, an identified inbounder and safety, and conditional entry routes. Defense lessons emphasize the defenders in cyan and let you isolate their coordinated responsibilities.

## Skill drills

The **Drills** section includes 12 sessions, organized by the skill and training goal:

- **Dribbling:** ball control (low-to-high pound, pocket and protect), change direction (crossover exit, split-stance transfer), and change pace (hesitation burst, retreat and re-attack).
- **Shooting:** shooting touch (one-hand ladder, guide-hand quieting), catch and shoot (1–2 catch, hop catch), and pull-ups (one-dribble pull-up, escape dribble into a shot).

Each drill has four animated body phases, front/side views, a mirrored left-hand example, body-region focus, a court setup, footwork and hand close-ups, a working set, a quality check, a common breakdown, a progression, and links to related plays. The diagrams use articulated SVG poses and interpolate the joints and ball as you play, step, slow down, or scrub. Shooting stance and release height are presented as a useful example rather than universal joint angles. The default playback speed is 0.5×.

Bookmark a drill with a hash such as `#drills/one-two`. Browser history works within the practice library and across playbook sections. Drills are bundled and precached with the rest of the playbook for offline use.

## Learning modes

- **Coverage:** compare drop, switch, and blitz on pick-and-roll, pick-and-pop, and empty-corner screens. Empty-corner also includes ICE. Each choice changes defender positions, the four-step explanation, passing options, and trainer feedback.
- **Make the read:** pause at the decision, choose an action, and reveal its feedback and illustrative route. Explanations and paths stay hidden until the choice. Strong, conditional, and high-risk answers distinguish the shown opening from a counter that needs a different defensive commitment. Defensive choices represent connected jobs, so several answers can be sound. These are authored situations, not a defensive simulator or a score predicting whether a shot will go in.
- **Follow a player:** highlight any visible player or defender, dim the others, and follow their responsibilities through the four steps. Smaller transition drills show only the players involved.
- **Zone and transition:** separate categories on both sides of the playbook, with related lessons linking the offense and defense.

## Offline access

The production build precaches the entire playbook, diagrams, trainer, fonts, and icons. Open the site once while connected and wait for **Playbook saved for offline use**. You can then reload and open any lesson without a connection. Installation is optional; use your browser’s install / Add to Home Screen option for a standalone app. Clearing browser site data removes the offline copy. External coaching-reference links still need a connection.

Service workers require HTTPS, except on localhost. Use the HTTPS Cloudflare address when accessing the deployment on `trappserv.er`; direct `http://trappserv.er:8080` serves the site but cannot enable offline caching. Offline support is disabled in Vite development mode. Test the production build with `npm run build && npm start` on localhost instead.

New releases download in the background. An **Update available · reload** button appears after the new worker is ready; the current lesson stays in place until you accept. The worker checks on page focus and reconnection. Accepting an update reloads the page and resets playback. The Node server marks HTML, the manifest, and `sw.js` as `no-cache` so browsers revalidate them. Keep these resources out of any Cloudflare rule that forces a long edge TTL, and purge an existing cached shell when introducing this release. Hashed assets remain available for Cloudflare caching.

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

Serve the generated `dist/` directory with any static web server. All asset paths are relative, so it also works under a subdirectory. Offense lessons use hashes such as `#spain`; defense uses `#defense/drop-coverage`. Inbounds plays use hashes such as `#inbounds/box-cross`. All views are bookmarkable and support browser back/forward, so no server-side route handling is needed. `npm run preview` serves a local Vite preview. To run the production Node server after building, use `npm start` and open `http://localhost:8080`. Set `PORT` to change its listening port.

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

The multi-stage Dockerfile installs the locked dependencies, type-checks the project, builds React, and compiles the TypeScript static server. The production image runs Node as the unprivileged `node` user and serves the build on container port 8080. No Nginx, host Node installation, API keys, database, or persistent volumes are needed. An HTTP health check uses `/healthz`; `restart: unless-stopped` handles process exits and Docker daemon restarts.

For Cloudflare, route your existing proxy or tunnel to the configured host port (8080 by default). The Node server leaves asset cache policy unset and provides ETags for conditional requests. Configure edge caching in Cloudflare; [its default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/) caches common static file extensions but does not cache HTML by default. HTML, the manifest, and the service worker use `no-cache` for offline release updates; avoid overriding that policy with a long edge TTL. `/healthz` is marked `no-store`.


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
- `src/tacticalConcepts.ts` and `src/tacticalReads.ts`: zone and transition lessons and decisions.
- `src/learning.ts`: coverage variations, read feedback, selected-route outcomes, and player responsibilities.
- `src/OfflineStatus.tsx` and `vite.config.ts`: offline status, update prompts, manifest, and precaching.
- `public/icons/`: local app icons.
- `src/lessonHelpers.ts`: shared frame and step constructors.
- `src/main.tsx`: top-level section routing, playbook UI, SVG court, playback, and interaction logic.
- `src/DrillsApp.tsx` and `src/drills.css`: drill library, practice interface, and responsive layout.
- `src/drills.ts` and `src/drillTypes.ts`: typed skill sessions, training goals, body cues, and working sets.
- `src/drillPoses.ts` and `src/MechanicsDiagram.tsx`: articulated body poses, interpolation, mirroring, annotations, and detail diagrams.
- `src/ConceptMenu.tsx`: accessible category dropdowns and play selection.
- `src/passingReads.ts`: conditional ball routes, their opening reads, and the step at which they appear.
- `src/inboundsReads.ts`: entry options and safety outlets, included in the passing-read lookup.
- `src/defensiveReads.ts`: defender assignments, descriptions, and when to show them. Defender indices are 6–10, representing x1–x5.
- `src/types.ts`: shared domain types for lessons, player coordinates, steps, and decisions.
- `src/styles.css`: layout and visual design.
- `server/index.ts`: production Node static server; serves only `dist/`, exposes `/healthz`, and supports GET/HEAD.
- `tsconfig.server.json`: emits the server into `dist-server/`.

Frames use a 600 × 470 SVG view box, with the basket at the top. Each has ten player coordinates: offense 1–5, then their defenders x1–x5. `ball` identifies the player or defender holding the ball. Optional `ballPosition` places a shot in flight. Optional `visiblePlayers` limits smaller drills to the involved players. Optional `pass: [from, to]` draws a dashed passing lane. Player positions and ball possession interpolate between frames. Inbounds lessons add `inbound: { edge, player, spot, safety }`. They use an expanded view box to show the passer outside the boundary. The entry-pass overlay remains anchored at the original throw-in spot after the inbounder steps onto the court; the give-and-go instead compares the wing receiver’s return-pass options after the entry catch. Optional `screens` maps step indices to the players setting screens. The court is schematic, not a scale regulation court. Diagrams show an illustrative possession, not a full simulation of defensive decisions. Coaching copy is original; source links provide further study.

## Controls

Play/pause, reset, previous/next step, 0.25×–1.5× speed, and a continuous timeline. Select an individual step to jump to it. Defense, movement paths, and passing reads can be hidden independently. At the decision point, lettered ball routes show the example pass in orange and alternate reads in blue. Select a route to isolate it and read the coverage that opens it. The final frame keeps these pre-pass choices visible for comparison. Dashed destination markers show where moving receivers are going; solid blue routes indicate keeping the ball to drive. On Defense, `Assignments` highlights coordinated jobs rather than alternate passes. Select a job to highlight its defender and movement. Defensive identities stay x1–x5 even when they switch matchups. `Show offense` can hide offensive markers while preserving the defenders. Arrow keys step and Space plays/pauses when focus is outside a control. Escape closes the expanded board or guide. Dialogs keep keyboard focus inside and return it on close.

## Checks

```sh
npm run build
npx playwright install chromium
npm test
npm run test:server
```

Alternatively, use installed Chrome: `PLAYWRIGHT_CHANNEL=chrome npm test`. Tests cover playback ending, speed selection, scrubbing, overlays, coverage expansion, related navigation, all lessons, mobile overflow, dialog keyboard focus, conditional ball routes with isolation and toggles, all thirty lesson routes, defensive assignment isolation, cross-view navigation, history, defensive and inbounds mobile layouts, baseline/sideline category dropdowns, the entry-to-return pass sequence, keyboard category controls, automatic category reveal, coverage changes, player focus, read-trainer concealment, decision stops, selected outcomes, skill/goal drill navigation, all 48 drill phases, body views, hand mirroring, footwork detail, and drill keyboard controls. The Playwright config starts Vite automatically when needed.

`npm run test:server` builds the project and tests the actual production Node server on port 5180. It verifies HTML/asset delivery, conditional requests, HEAD, missing files, method handling, health checks, React navigation, offline reloads with unvisited lessons, the explicit update/reload flow, and full drill playback and hand mirroring offline. Use `PLAYWRIGHT_CHANNEL=chrome npm run test:server` to run its browser check with installed Chrome.
