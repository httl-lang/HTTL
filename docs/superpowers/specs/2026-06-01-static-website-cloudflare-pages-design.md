# Design: Static HTTL Website on Cloudflare Pages

**Date:** 2026-06-01
**Status:** Approved
**Package:** `packages/httl-website` (with browser-support changes in `httl-core` and `httl-lsp`)

## Goal

Convert the Next.js `httl-website` from a server-rendered app (Node API routes,
WebSocket-hosted LSP, request-logging middleware) into a **fully static** site
that can be deployed on **Cloudflare Pages** with no server runtime.

Two server-coupled subsystems must change:

1. **Language Server (LSP)** — today a `ws` WebSocket server hosting
   `vscode-languageserver/node`. Moves entirely **in-browser into a Web Worker**.
   This covers both language features (completion, diagnostics, formatting) and
   request execution (`httl.run`).
2. **Demo API** (`/api/*`) — today Next.js route handlers with dynamic logic.
   GET endpoints become **static JSON**; dynamic endpoints are dropped.

## Decisions (locked during brainstorming)

- **Run execution:** fully client-side via browser `fetch`. CORS limits accepted
  (the demo targets the site's own origin, so it works).
- **Demo API:** the OpenAPI spec stays a real static asset (`/api/spec.json`,
  loaded same-origin). The user/auth endpoints are **mocked in the playground
  worker** (a `DemoHttpClient` wrapping the fetch client) so all four QuickRun
  examples — including the POST/PUT/auth flows — work with no backend. (Revised
  from the original "GET → static JSON, drop dynamic" after review: dropping the
  dynamic examples lost valuable demos, and worker-side mocking keeps the site
  fully static while restoring them.)
- **Shared-package changes:** "simplest to ship" — bundler aliases + fallbacks +
  a hand-written browser `HttpClient`, no invasive DI refactor of core unless a
  specific file forces it. The Node code paths (CLI, VSCode extension) stay
  byte-for-byte unchanged.
- **Static build:** Next.js `output: 'export'` (no Cloudflare Workers adapter).

## Architecture Overview

Three changes, ordered by difficulty:

1. LSP moves from a WebSocket server to a Web Worker (language features + run).
2. `httl-core` / `httl-lsp` get browser-compatible code paths (fetch-based HTTP,
   no Node built-ins on the hot path).
3. API routes → static JSON; middleware/logging removed; Next.js builds with
   `output: 'export'`.

## Component 1 — LSP in a Web Worker

**Today:**
- `src/components/editor/httl-extension/extension.ts` builds an LSP URL
  (`wss://host/lsp`) and an activation URL (`/api/lsp`).
- `httl-language-client.ts` opens a `ReconnectingWebSocket`, wraps it with
  `WebSocketMessageReader/Writer` (from `vscode-ws-jsonrpc`), and starts a
  `MonacoLanguageClient`.
- `src/pages/api/lsp.ts` is a Next.js Pages-router handler that lazily starts a
  `ws` `WebSocketServer` on `/lsp` and, per connection, instantiates
  `HttlLanguageServer` (from `httl-lsp`, built on `vscode-languageserver/node`).

**New:**
- Add a worker entry: `src/components/editor/httl-extension/lsp.worker.ts`.
  Inside the worker, instantiate the HTTL language server on a **browser
  connection**: `createConnection(new BrowserMessageReader(self), new
  BrowserMessageWriter(self))` from `vscode-languageserver/browser`.
- `httl-lsp` gains a **second entry point** (e.g. `httl-lsp/browser`) that
  constructs the server against the browser connection. The existing Node entry
  (`httl-lsp` default, used by `pages/api/lsp.ts` and the VSCode extension's
  `server.ts`) is left untouched.
- `httl-language-client.ts` is rewired: replace the WebSocket transport with
  `monaco-languageclient`'s `BrowserMessageReader/Writer` over
  `new Worker(new URL('./lsp.worker.ts', import.meta.url), { type: 'module' })`.
- `extension.ts`: remove `lspUrl` / `lspActivationUrl` construction and the
  `fetch(lspActivationUrl)` warm-up; pass the worker (or a worker factory)
  instead.
- **Delete** `src/pages/api/lsp.ts`.

The existing Monaco worker setup in `vscode-services/workers.ts`
(`TextEditorWorker`, `TextMateWorker`) is unaffected and stays.

## Component 2 — Browser-compatible `httl-core`

The run path is `Httl.createDocument(script).run()` →
`RuntimeExecutor.httpRequest` → `HttpClient.request`. It is mostly portable. Node
touchpoints found and their handling:

| Touchpoint | File | Handling |
|---|---|---|
| `http`/`https`/`tls`, `process.hrtime` | `runtime/http/http-client.ts`, `runtime/http/http-timings.ts` | New **`fetch`-based `HttpClient`** + `performance.now()` timings, selected for the worker bundle via a bundler alias. Loses DNS/TCP/TLS sub-timings (browser cannot observe them); total time only. |
| `dotenv` + `process.env` | `httl.ts` (`EnvironmentVariables`) | Browser-safe: skip `dotenv.config`; treat env as empty when there is no real filesystem. |
| `path`, `process.cwd()` | `common/utils.ts` (`Path`) | `path-browserify` polyfill; `createDocument` supplies a virtual path so `process.cwd()` is not reached. |
| `fs.readFileSync` | `document.ts`, `runtime-objects/file.ts`, `httl.ts` | Not on the playground hot path (`createDocument` passes script text inline; no local-file uploads in browser). Bundler `fs: false` fallback. `file()` uploads unsupported in-browser. |
| `form-data` | `runtime-objects/request-body.ts` | Multipart unsupported in-browser for now. Native `FormData` swap is a possible later improvement. |

Approach: bundler aliases + fallbacks in the worker build, plus a hand-written
browser `HttpClient`. The single clean seam is `RuntimeExecutor.httpRequest` →
`HttpClient.request`; the worker bundle resolves `http-client` to the browser
implementation.

**CORS reality (accepted):** the worker's `fetch` can only reach same-origin or
CORS-permissive endpoints. The demo targets the site's own origin, so it works.

## Component 3 — Demo API → static JSON

- `app/api/spec.json/route.ts` → static `public/api/spec.json`. The
  `servers[0].url` value (today set per-request to localhost vs `https://httl.dev/api`)
  is **baked to the production origin at build time** instead.
- `app/api/users/route.ts` (GET) → static `public/api/users` (the JSON array from
  `data.json`).
- `app/api/users/[id]/route.ts` (GET) → static files `public/api/users/1` (and any
  other IDs the demo references), serving the matching JSON object. A Cloudflare
  `_headers` rule sets `Content-Type: application/json` for these extension-less
  files if Cloudflare's default content-type is wrong.
- **Deleted:** `app/api/auth/route.ts` (POST), the POST handler in
  `app/api/users/route.ts`, PUT/DELETE in `app/api/users/[id]/route.ts`,
  `app/api/_constants.ts`, all of `src/lib/logging/*`, `src/middleware.ts`,
  `src/pages/api/lsp.ts`.
- **Demo examples** (`src/components/quick-run/examples.tsx`): keep the two GET
  examples (`get /users/1`, `get /api/users`); drop/rework the `post /auth` +
  `put` examples since the backend logic is gone. Final set is GET-only and fully
  working.

## Component 4 — Build & deploy config

- `next.config.mjs`:
  - Add `output: 'export'`.
  - Remove `async redirects()` (unsupported under static export).
  - Keep Nextra — it prerenders MDX docs to static HTML via `generateStaticParams`
    on the `[[...mdxPath]]` route.
  - Keep the existing client webpack fallbacks (`fs/module/vm: false`) and extend
    with the worker/`path`/`process` shims and the `http-client` browser alias.
- The `/docs` → `/docs/introduction/about-httl` redirect moves to a Cloudflare
  **`public/_redirects`** file.
- Build output is `out/`, which Cloudflare Pages serves. Add `public/_headers` /
  `public/_redirects` as needed.

## Data Flow (after change)

```
User edits in Monaco editor (main thread)
   │  (LSP messages over BrowserMessageReader/Writer)
   ▼
lsp.worker.ts  ──►  HttlLanguageServer (browser connection)
   │                   │
   │                   ├─ completion / diagnostics / formatting  (pure analysis)
   │                   └─ custom/request:run
   │                          │
   │                          ▼
   │                   Httl.createDocument(text).run()
   │                          │
   │                          ▼
   │                   RuntimeExecutor.httpRequest → (browser) HttpClient.request
   │                          │
   │                          ▼  browser fetch (same-origin / CORS-permissive)
   │                   Static JSON under /api/*  (or external API)
   ▼
Response surfaced back to the main thread → ResponseViewer
```

## What Breaks / Trade-offs (explicit)

- Detailed request timings reduced to total-time only.
- Running requests against arbitrary non-CORS external APIs will not work from the
  browser (inherent to client-side execution).
- `file()` uploads and multipart (`form-data`) bodies unsupported in the browser
  playground.
- The 4 demo examples become ~2 GET examples (no live auth/PUT showcase).

## Testing

- **`httl-core`:** existing Jest suite must still pass (the Node code path is
  unchanged). Add a focused smoke test for the browser `HttpClient` against a
  `fetch` mock (status, headers, body, total-time present).
- **Manual / build verification:**
  1. `next build` produces `out/` with no server-only-feature errors.
  2. Serve `out/` statically; docs pages render (including the dynamic
     `[[...mdxPath]]` routes) and the `/docs` redirect works via `_redirects`.
  3. Editor loads; autocomplete, diagnostics, and formatting work in-worker.
  4. The GET demo examples execute and return real responses from the static
     `/api/*` JSON.

## Out of Scope

- Restoring multipart/file-upload support in the browser.
- Any server-side run proxy (Cloudflare Worker) — explicitly rejected in favor of
  fully client-side execution.
- Re-adding request logging/analytics that depended on middleware.
