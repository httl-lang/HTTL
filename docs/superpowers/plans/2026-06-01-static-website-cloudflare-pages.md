# Static HTTL Website on Cloudflare Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `packages/httl-website` from a server-rendered Next.js app into a fully static site deployable on Cloudflare Pages, by moving the HTTL language server + request execution into a browser Web Worker and turning the demo API into static JSON.

**Architecture:** The HTTL language server (`httl-lsp`, built on `httl-core`) currently runs in Node behind a WebSocket. We make `httl-core` runtime-portable by injecting an HTTP client (Node `http` for CLI/VSCode, browser `fetch` for the web), give `httl-lsp` a browser entry point that runs over a `MessagePort`, host it in a Web Worker the editor talks to, replace the Next.js API routes with static JSON files, and switch the build to `output: 'export'`.

**Tech Stack:** TypeScript, Next.js 15 (App Router) + Nextra 4, Monaco + `monaco-languageclient`, `vscode-languageserver/browser`, Jest (ts-jest, ESM), Cloudflare Pages static hosting.

---

## Background facts (read before starting)

- `httl-core` and `httl-lsp` are consumed by the website **as built `dist/`**, not source (the website tsconfig has no path alias to their `src`). **Every change to their `src` requires rebuilding `dist`** with `npm run build` in that package. Build `httl-core` before `httl-lsp` (lsp depends on core's emitted types).
- The single seam for outbound HTTP is `RuntimeExecutor.httpRequest` → `HttpClient.request` (`packages/httl-core/src/runtime/executors/runtime-executor.ts:95`). We inject the client through `IHttlContext` so the Node path is byte-for-byte unchanged.
- Node-only modules left in the browser bundle (the unused Node `HttpClient`, `dotenv`, `path`) are handled with webpack `resolve.fallback`/polyfills — they are imported but never executed in the browser.
- Jest config: `packages/httl-core/jest.config.js` (ts-jest ESM preset, `testEnvironment: 'node'`, `testMatch: **/*.(spec|test).ts`). Tests live next to source as `*.spec.ts`. Node 20 provides global `fetch`, `Response`, `Headers`.
- Run all `httl-core` jest commands from `packages/httl-core`. The package has no per-test script; use `npx jest <path>`.

## File structure (what gets created / modified)

**httl-core (`packages/httl-core/src/`)**
- Create `runtime/http/http-client.types.ts` — `IHttpClient` interface + `HttpRequestOptions` re-export point.
- Create `runtime/http/node-http-client.ts` — `NodeHttpClient` adapter wrapping the existing static `HttpClient`.
- Create `runtime/http/fetch-http-client.ts` — `FetchHttpClient` (browser, `fetch`-based).
- Create `runtime/http/fetch-http-client.spec.ts` — unit tests.
- Create `runtime/http/http-response.spec.ts` — unit tests for the new `fromFetch` factory + byte sizing.
- Modify `runtime/http/http-response.ts` — `import type http`; `Buffer.byteLength` → `TextEncoder`; add `HttpResponse.fromFetch`.
- Modify `httl.ts` — add `httpClient` to `HttlOptions`/`IHttlContext`/`Httl`; guard `dotenv`.
- Modify `runtime/executors/runtime-executor.ts` — use `this.runtime.context.httpClient`.
- Modify `index.ts` — export `IHttpClient`, `FetchHttpClient`, `NodeHttpClient`.

**httl-lsp (`packages/httl-lsp/src/`)**
- Create `configure-server.ts` — environment-neutral server wiring (providers + capabilities), takes a `_Connection` and `{ httpClient }`.
- Create `browser.ts` — browser entry: builds a browser connection and calls `configureServer`.
- Modify `httl-language-server.ts` — delegate to `configureServer`; keep Node default behaviour.
- Modify `package.json` — add `"browser"`/`exports` entry for the browser build.

**httl-website (`packages/httl-website/`)**
- Create `src/components/editor/httl-extension/lsp.worker.ts` — worker hosting the browser language server.
- Modify `src/components/editor/httl-extension/httl-language-client.ts` — worker transport instead of WebSocket.
- Modify `src/components/editor/httl-extension/extension.ts` — drop WebSocket/activation URLs.
- Modify `next.config.mjs` — `output: 'export'`, drop `redirects()`, add browser fallbacks/polyfills for the worker bundle.
- Create `public/api/spec.json`, `public/api/users` (collection), `public/api/users/1` — static demo data.
- Create `public/_redirects`, `public/_headers` — Cloudflare routing/content-type.
- Modify `src/components/quick-run/examples.tsx` — GET-only examples.
- Delete `src/pages/api/lsp.ts`, `src/middleware.ts`, `src/lib/logging/*`, `src/app/api/auth/`, `src/app/api/users/`, `src/app/api/spec.json/`, `src/app/api/_constants.ts`.
- Add dev dep `path-browserify` (+ `@types/path-browserify`).

---

## Milestone 1 — `httl-core` browser HTTP support

### Task 1: Make response byte-sizing environment-agnostic

**Files:**
- Modify: `packages/httl-core/src/runtime/http/http-response.ts:28-49` (`HttpSize`)
- Test: `packages/httl-core/src/runtime/http/http-response.spec.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `packages/httl-core/src/runtime/http/http-response.spec.ts`:

```ts
import { HttpSize } from './http-response';

describe('HttpSize.sizeOf', () => {
  it('counts UTF-8 byte length of headers and data without Buffer', () => {
    const size = HttpSize.sizeOf({
      headers: ['Content-Type', 'application/json'],
      data: 'héllo', // 'é' is 2 bytes in UTF-8 => 6 bytes total
    });

    expect(size.data).toBe(6);
    expect(size.headers).toBe('Content-Type'.length + 'application/json'.length);
    expect(size.totalFormatted).toBe('40 bytes');
  });

  it('handles empty data', () => {
    const size = HttpSize.sizeOf({ headers: [], data: '' });
    expect(size.data).toBe(0);
    expect(size.headers).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `packages/httl-core`): `npx jest src/runtime/http/http-response.spec.ts -t "without Buffer"`
Expected: FAIL — current code uses `Buffer.byteLength`, which works in Node, so this test may actually PASS for sizing but the goal is removing the Buffer dependency. If it passes, still proceed to Step 3 to remove `Buffer` (verify by the test continuing to pass after the edit).

- [ ] **Step 3: Replace `Buffer.byteLength` with `TextEncoder`**

In `packages/httl-core/src/runtime/http/http-response.ts`, add a tiny helper and use it in `HttpSize.sizeOf`:

```ts
const utf8ByteLength = (value: string): number => new TextEncoder().encode(value).length;
```

Change the two `Buffer.byteLength(...)` calls inside `HttpSize.sizeOf`:

```ts
const headersSize = headers.reduce((acc, curr) => acc + utf8ByteLength(curr), 0);
const dataSize = data ? utf8ByteLength(data) : 0;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/runtime/http/http-response.spec.ts`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add packages/httl-core/src/runtime/http/http-response.ts packages/httl-core/src/runtime/http/http-response.spec.ts
git commit -m "refactor(core): byte-size responses with TextEncoder instead of Buffer"
```

---

### Task 2: Add `HttpResponse.fromFetch` factory

**Files:**
- Modify: `packages/httl-core/src/runtime/http/http-response.ts:1` (imports), add static factory
- Test: `packages/httl-core/src/runtime/http/http-response.spec.ts` (extend)

- [ ] **Step 1: Write the failing test**

Append to `packages/httl-core/src/runtime/http/http-response.spec.ts`:

```ts
import { HttpResponse } from './http-response';

describe('HttpResponse.fromFetch', () => {
  it('builds a response from fetch result data', () => {
    const response = HttpResponse.fromFetch({
      requestUrl: 'https://example.com/users/1',
      requestMethod: 'GET',
      requestHeaders: { accept: 'application/json' },
      requestBody: undefined,
      status: 200,
      statusText: 'OK',
      responseHeaders: [['content-type', 'application/json']],
      data: '{"id":1}',
      totalMs: 12.5,
    });

    expect(response.isError()).toBe(false);
    expect(response.statusCode).toBe(200);
    expect(response.statusMessage).toBe('OK');
    expect(response.res.data).toBe('{"id":1}');
    expect(response.res.headers).toEqual([['content-type', 'application/json']]);
    expect(response.req.method).toBe('GET');
    expect(response.req.url).toBe('https://example.com/users/1');
    expect(response.timings.total).toBe(12.5);
    expect(response.timings.totalFormatted).toBe('12.50');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/runtime/http/http-response.spec.ts -t fromFetch`
Expected: FAIL — `HttpResponse.fromFetch is not a function`.

- [ ] **Step 3: Implement the factory**

In `packages/httl-core/src/runtime/http/http-response.ts`:

1. Change the Node import to type-only so it is erased from browser bundles:

```ts
import type http from 'http';
```

2. Add this static method to the `HttpResponse` class (alongside `ok`/`error`):

```ts
public static fromFetch(input: {
  requestUrl: string;
  requestMethod: string;
  requestHeaders: object;
  requestBody: string | undefined;
  status: number;
  statusText: string;
  responseHeaders: [string, string][];
  data: string;
  totalMs: number;
}): HttpResponse {
  const response = new HttpResponse();

  const sortedHeaders = [...input.responseHeaders]
    .sort((a, b) => a[0].localeCompare(b[0]));

  Object.assign(response, {
    statusCode: input.status,
    statusMessage: input.statusText,
    httpVersion: '1.1',
    warnings: [],

    req: {
      method: input.requestMethod,
      url: input.requestUrl,
      headers: input.requestHeaders,
      body: input.requestBody,
    },

    res: {
      headers: sortedHeaders,
      data: input.data,
      size: HttpSize.sizeOf({
        headers: input.responseHeaders.flat(),
        data: input.data,
      }),
    },

    timings: {
      dnsLookup: undefined,
      tcpConnection: undefined,
      tlsHandshake: undefined,
      firstByte: undefined,
      contentTransfer: undefined,
      total: input.totalMs,
      totalFormatted: input.totalMs.toFixed(2),
    },
  });

  return response;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/runtime/http/http-response.spec.ts`
Expected: PASS (all tests in file).

- [ ] **Step 5: Commit**

```bash
git add packages/httl-core/src/runtime/http/http-response.ts packages/httl-core/src/runtime/http/http-response.spec.ts
git commit -m "feat(core): add HttpResponse.fromFetch for browser execution"
```

---

### Task 3: Define `IHttpClient` and the Node adapter

**Files:**
- Create: `packages/httl-core/src/runtime/http/http-client.types.ts`
- Create: `packages/httl-core/src/runtime/http/node-http-client.ts`

- [ ] **Step 1: Create the interface**

Create `packages/httl-core/src/runtime/http/http-client.types.ts`:

```ts
import { HttpResponse } from './http-response';
import { HttpRequestOptions } from './http-client';
import { HttlUrl } from '../../common/url';

export interface IHttpClient {
  request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse>;
}
```

- [ ] **Step 2: Create the Node adapter**

Create `packages/httl-core/src/runtime/http/node-http-client.ts`:

```ts
import { HttpClient, HttpRequestOptions } from './http-client';
import { HttpResponse } from './http-response';
import { IHttpClient } from './http-client.types';
import { HttlUrl } from '../../common/url';

export class NodeHttpClient implements IHttpClient {
  public request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse> {
    return HttpClient.request(url, options);
  }
}
```

- [ ] **Step 3: Verify it compiles**

Run (from `packages/httl-core`): `npx tsc --noEmit -p tsconfig.json`
Expected: no new errors referencing these files.

- [ ] **Step 4: Commit**

```bash
git add packages/httl-core/src/runtime/http/http-client.types.ts packages/httl-core/src/runtime/http/node-http-client.ts
git commit -m "feat(core): introduce IHttpClient interface and NodeHttpClient adapter"
```

---

### Task 4: Implement `FetchHttpClient`

**Files:**
- Create: `packages/httl-core/src/runtime/http/fetch-http-client.ts`
- Test: `packages/httl-core/src/runtime/http/fetch-http-client.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/httl-core/src/runtime/http/fetch-http-client.spec.ts`:

```ts
import { FetchHttpClient } from './fetch-http-client';

describe('FetchHttpClient', () => {
  const makeResponse = (body: string) =>
    new Response(body, {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('performs a GET and maps the response', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(makeResponse('{"id":1}'));

    const client = new FetchHttpClient();
    const response = await client.request('https://example.com/users/1', {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/users/1',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(response.isError()).toBe(false);
    expect(response.statusCode).toBe(200);
    expect(response.res.data).toBe('{"id":1}');
    expect(response.res.headers).toContainEqual(['content-type', 'application/json']);
    expect(typeof response.timings.total).toBe('number');
  });

  it('sends a string body for POST', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(makeResponse('{}'));

    const client = new FetchHttpClient();
    await client.request('https://example.com/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"name":"x"}',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/users',
      expect.objectContaining({ method: 'POST', body: '{"name":"x"}' }),
    );
  });

  it('returns an error response when fetch rejects', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const client = new FetchHttpClient();
    const response = await client.request('https://blocked.example.com', {
      method: 'GET',
      headers: {},
    });

    expect(response.isError()).toBe(true);
    expect(String(response.error)).toContain('Failed to fetch');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/runtime/http/fetch-http-client.spec.ts`
Expected: FAIL — `Cannot find module './fetch-http-client'`.

- [ ] **Step 3: Implement `FetchHttpClient`**

Create `packages/httl-core/src/runtime/http/fetch-http-client.ts`:

```ts
import { constants } from '../../common/constants';
import { HttpRequestOptions } from './http-client';
import { HttpResponse } from './http-response';
import { IHttpClient } from './http-client.types';
import { HttlUrl } from '../../common/url';

export class FetchHttpClient implements IHttpClient {
  public async request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse> {
    const httlUrl = typeof url === 'string' ? HttlUrl.parse(url) : url;
    const finalUrl = httlUrl.fullUrl;

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(options.headers ?? {})) {
      if (value !== undefined && value !== null) {
        headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
      }
    }
    headers['User-Agent'] = constants.HTTP_AGENT_NAME;

    const body = typeof options.body === 'string' ? options.body : undefined;

    const start = performance.now();
    try {
      const res = await fetch(finalUrl, {
        method: options.method.toUpperCase(),
        headers,
        body,
        redirect: 'follow',
      });

      const data = await res.text();
      const totalMs = performance.now() - start;

      const responseHeaders: [string, string][] = [];
      res.headers.forEach((value, key) => responseHeaders.push([key, value]));

      return HttpResponse.fromFetch({
        requestUrl: finalUrl,
        requestMethod: options.method.toUpperCase(),
        requestHeaders: headers,
        requestBody: body,
        status: res.status,
        statusText: res.statusText,
        responseHeaders,
        data,
        totalMs,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request error';
      return HttpResponse.error(message);
    }
  }
}
```

> Note: `options.body` may be a `FormData` (Node `form-data`). Multipart is out of scope in the browser — only string bodies are sent; a `FormData` body is dropped (`body` stays `undefined`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/runtime/http/fetch-http-client.spec.ts`
Expected: PASS (all three tests).

- [ ] **Step 5: Commit**

```bash
git add packages/httl-core/src/runtime/http/fetch-http-client.ts packages/httl-core/src/runtime/http/fetch-http-client.spec.ts
git commit -m "feat(core): add FetchHttpClient for in-browser request execution"
```

---

### Task 5: Inject the HTTP client through the context

**Files:**
- Modify: `packages/httl-core/src/httl.ts` (`HttlOptions`, `IHttlContext`, `Httl`, `EnvironmentVariables`)
- Modify: `packages/httl-core/src/runtime/executors/runtime-executor.ts:95-97`
- Test: `packages/httl-core/src/httl.spec.ts`

- [ ] **Step 1: Write the failing test**

Replace `packages/httl-core/src/httl.spec.ts` with:

```ts
import Httl from './httl';
import { NodeHttpClient } from './runtime/http/node-http-client';
import { IHttpClient } from './runtime/http/http-client.types';

describe('httl', () => {
  it('defaults to the Node http client', () => {
    const httl = new Httl({ workdir: '' });
    expect(httl.httpClient).toBeInstanceOf(NodeHttpClient);
  });

  it('uses an injected http client', () => {
    const fake: IHttpClient = { request: jest.fn() };
    const httl = new Httl({ workdir: '', httpClient: fake });
    expect(httl.httpClient).toBe(fake);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/httl.spec.ts`
Expected: FAIL — `httpClient` does not exist on `Httl`.

- [ ] **Step 3: Add `httpClient` to options/context/class and guard dotenv**

In `packages/httl-core/src/httl.ts`:

1. Add imports near the top:

```ts
import { IHttpClient } from "./runtime/http/http-client.types";
import { NodeHttpClient } from "./runtime/http/node-http-client";
```

2. Extend `HttlOptions`:

```ts
export interface HttlOptions {
  workdir: string;
  httpClient?: IHttpClient;
}
```

3. Add `httpClient` to `IHttlContext`:

```ts
export interface IHttlContext {
  workdir: string;
  httpClient: IHttpClient;
  compiler: HttlCompiler;
  runtime: HttlRuntime;
  env: EnvironmentVariables;
  load(fileUri: string): HttlDocument;
  hasDefaultHttlFile(): boolean;
}
```

4. Add the field to the `Httl` class and initialise it in the constructor body (after `this.workdir = options.workdir;`):

```ts
public readonly httpClient: IHttpClient;
```

```ts
this.httpClient = options.httpClient ?? new NodeHttpClient();
```

5. Make `EnvironmentVariables.refresh()` browser-safe:

```ts
public refresh() {
  const isNode = typeof process !== 'undefined' && !!process.versions?.node;
  if (this.workdir && isNode) {
    try {
      dotenv.config({ path: Path.toAbsolutePath(this.workdir, '.env') });
    } catch {
      // no filesystem available (browser) — ignore
    }
  }
}
```

- [ ] **Step 4: Route `httpRequest` through the injected client**

In `packages/httl-core/src/runtime/executors/runtime-executor.ts`, replace the body of `httpRequest`:

```ts
public async httpRequest(url: HttlUrl, options: HttpRequestOptions): Promise<HttpResponse> {
  return await this.runtime.context.httpClient.request(url, options);
}
```

(The `HttpClient` import at the top can stay; it is no longer the call site but other code paths may reference the type. Leaving it avoids unrelated churn.)

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx jest src/httl.spec.ts`
Expected: PASS (both tests).
Run the full suite to confirm no regressions: `npx jest`
Expected: all pre-existing tests still PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/httl-core/src/httl.ts packages/httl-core/src/runtime/executors/runtime-executor.ts packages/httl-core/src/httl.spec.ts
git commit -m "feat(core): inject http client via context; guard dotenv for browser"
```

---

### Task 6: Export browser symbols and rebuild `dist`

**Files:**
- Modify: `packages/httl-core/src/index.ts`

- [ ] **Step 1: Export the new public symbols**

Append to `packages/httl-core/src/index.ts`:

```ts
export * from './runtime/http/http-client.types'
export { NodeHttpClient } from './runtime/http/node-http-client'
export { FetchHttpClient } from './runtime/http/fetch-http-client'
```

- [ ] **Step 2: Build `dist`**

Run (from `packages/httl-core`): `npm run build`
Expected: `tsc --build` completes with no errors; `dist/runtime/http/fetch-http-client.js` exists.

- [ ] **Step 3: Verify the full test suite once more**

Run (from `packages/httl-core`): `npx jest`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/httl-core/src/index.ts packages/httl-core/dist
git commit -m "build(core): export browser http clients and rebuild dist"
```

> If `dist/` is gitignored in this repo, skip staging it and instead note that consumers rebuild on install. Check with `git check-ignore packages/httl-core/dist` before committing.

---

## Milestone 2 — `httl-lsp` browser entry point

### Task 7: Extract environment-neutral server wiring

**Files:**
- Create: `packages/httl-lsp/src/configure-server.ts`
- Modify: `packages/httl-lsp/src/httl-language-server.ts`

- [ ] **Step 1: Create `configure-server.ts`**

This holds the capability/provider wiring currently inside `HttlLanguageServer`, but takes an already-created connection and optional http client. It imports only from the environment-neutral `vscode-languageserver` base package (NOT `/node`).

Create `packages/httl-lsp/src/configure-server.ts`:

```ts
import {
  _Connection,
  InitializeParams,
  InitializeResult,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
} from 'vscode-languageserver';

import Httl, { IHttpClient } from 'httl-core';
import { HttlCompletionProvider } from './providers/httl-completion-provider';
import { HttlDocumentsProvider } from './providers/httl-documents-provider';
import { HttlDiagnosticsProvider } from './providers/httl-diagnostics-provider';
import { HttlCommandsExecutor } from './providers/httl-commands-executor';
import { HttlFormattingProvider } from './providers/httl-formatting-provider';

export interface ConfigureServerOptions {
  httpClient?: IHttpClient;
}

export function configureServer(connection: _Connection, options: ConfigureServerOptions = {}) {
  let hasConfigurationCapability = false;
  let hasWorkspaceFolderCapability = false;
  let workdir = '/';

  connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    workdir = params.workspaceFolders?.[0]?.uri ?? '/';

    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        documentFormattingProvider: true,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['.', ':', '@', '/'],
          workDoneProgress: true,
          completionItem: { labelDetailsSupport: true },
        },
        diagnosticProvider: {
          identifier: 'httl',
          workDoneProgress: true,
          interFileDependencies: false,
          workspaceDiagnostics: false,
        },
      },
    };

    if (hasWorkspaceFolderCapability) {
      result.capabilities.workspace = { workspaceFolders: { supported: true } };
    }

    return result;
  });

  connection.onInitialized(() => {
    if (hasConfigurationCapability) {
      connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }

    const httl = new Httl({ workdir, httpClient: options.httpClient });

    const documents = new HttlDocumentsProvider(connection, httl);
    new HttlDiagnosticsProvider(connection, documents);
    new HttlCompletionProvider(connection, documents);
    new HttlCommandsExecutor(connection, documents);
    new HttlFormattingProvider(connection, documents);
  });

  return connection;
}
```

> Verify the provider import paths/signatures against the current `httl-language-server.ts` (constructors take `(connection, ...)`). If any provider constructor differs, match it exactly.

- [ ] **Step 2: Make the Node server delegate to `configureServer`**

Rewrite `packages/httl-lsp/src/httl-language-server.ts` to keep its existing public shape (default export, `new HttlLanguageServer(reader?, writer?)`, `.start()`, `.stop()`) but delegate wiring:

```ts
import {
  createConnection,
  ProposedFeatures,
  _Connection,
} from 'vscode-languageserver/node';

import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from 'vscode-ws-jsonrpc';

import { configureServer } from './configure-server';

export default class HttlLanguageServer {
  public readonly connection: _Connection;

  constructor(reader?: WebSocketMessageReader, writer?: WebSocketMessageWriter) {
    this.connection = createConnection(ProposedFeatures.all, reader, writer);
    configureServer(this.connection);

    process.on('SIGINT', () => {
      this.stop();
      process.exit(0);
    });
  }

  public start() {
    this.connection.listen();
  }

  public stop() {
    this.connection.dispose();
  }
}
```

- [ ] **Step 3: Build to verify Node path still compiles**

Run (from `packages/httl-lsp`): `npm run build`
Expected: `tsc --build` succeeds; `dist/configure-server.js` and `dist/httl-language-server.js` exist.

- [ ] **Step 4: Smoke-test the Node server still instantiates**

Run (from `packages/httl-lsp`): `node -e "const S=require('./dist/httl-language-server').default; new S(); console.log('ok')"`
Expected: prints `ok` (server constructs without throwing; it will not listen without a transport, which is fine).

- [ ] **Step 5: Commit**

```bash
git add packages/httl-lsp/src/configure-server.ts packages/httl-lsp/src/httl-language-server.ts packages/httl-lsp/dist
git commit -m "refactor(lsp): extract neutral configureServer; node server delegates to it"
```

---

### Task 8: Add the browser entry point

**Files:**
- Create: `packages/httl-lsp/src/browser.ts`
- Modify: `packages/httl-lsp/package.json`

- [ ] **Step 1: Create the browser server**

Create `packages/httl-lsp/src/browser.ts`:

```ts
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from 'vscode-languageserver/browser';

import { FetchHttpClient } from 'httl-core';
import { configureServer } from './configure-server';

/**
 * Start the HTTL language server inside a Web Worker.
 * Call this from the worker's top-level scope, passing `self`.
 */
export function startBrowserServer(workerScope: DedicatedWorkerGlobalScope = self as any) {
  const reader = new BrowserMessageReader(workerScope);
  const writer = new BrowserMessageWriter(workerScope);
  const connection = createConnection(reader, writer);

  configureServer(connection, { httpClient: new FetchHttpClient() });

  connection.listen();
  return connection;
}
```

- [ ] **Step 2: Expose the browser entry from the package**

In `packages/httl-lsp/package.json`, add an `exports` map so the website can import `httl-lsp/browser` from `dist`:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  },
  "./browser": {
    "types": "./dist/browser.d.ts",
    "default": "./dist/browser.js"
  }
},
```

(Keep the existing `"main"`/`"types"` fields for backward compatibility.)

- [ ] **Step 3: Build**

Run (from `packages/httl-lsp`): `npm run build`
Expected: `dist/browser.js` and `dist/browser.d.ts` are produced.

> If the build errors that `vscode-languageserver/browser` types are missing, confirm `vscode-languageserver` is a dependency (it is, transitively via the existing import). The `/browser` subpath ships in the same package.

- [ ] **Step 4: Commit**

```bash
git add packages/httl-lsp/src/browser.ts packages/httl-lsp/package.json packages/httl-lsp/dist
git commit -m "feat(lsp): add browser entry point that runs over a worker MessagePort"
```

---

## Milestone 3 — Website worker wiring

### Task 9: Add the LSP Web Worker

**Files:**
- Create: `packages/httl-website/src/components/editor/httl-extension/lsp.worker.ts`

- [ ] **Step 1: Create the worker**

Create `packages/httl-website/src/components/editor/httl-extension/lsp.worker.ts`:

```ts
import { startBrowserServer } from 'httl-lsp/browser';

startBrowserServer(self as unknown as DedicatedWorkerGlobalScope);
```

- [ ] **Step 2: Commit**

```bash
git add packages/httl-website/src/components/editor/httl-extension/lsp.worker.ts
git commit -m "feat(website): add LSP web worker entry"
```

> This task has no runtime verification on its own; it is exercised by Tasks 10–12 + the Milestone 3 build check (Task 13).

---

### Task 10: Switch the language client to a worker transport

**Files:**
- Modify: `packages/httl-website/src/components/editor/httl-extension/httl-language-client.ts`

- [ ] **Step 1: Replace WebSocket transport with worker transport**

Rewrite `httl-language-client.ts` to accept a `Worker` and use `monaco-languageclient`'s browser message transports:

```ts
'use client';

import type vscode from "vscode";

import { MonacoLanguageClient } from 'monaco-languageclient';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser.js';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient/browser.js';

export class HttlLanguageClient {
  private declare client: MonacoLanguageClient;

  constructor(
    private readonly worker: Worker,
    private readonly vscodeApi: typeof vscode,
  ) { }

  public async start() {
    const reader = new BrowserMessageReader(this.worker);
    const writer = new BrowserMessageWriter(this.worker);

    this.client = this.createLanguageClient({ reader, writer });
    await this.client.start();
  }

  public async sendRun(documentUri: string, selection: string) {
    return await this.sendRequest("run", documentUri, { selection });
  }

  private async sendRequest(type: string, documentUri: string, data?: Object) {
    return await this.client.sendRequest(`custom/request:${type.toLowerCase()}`, { ...data, documentUri });
  }

  private createLanguageClient(messageTransports: MessageTransports): MonacoLanguageClient {
    const client = new MonacoLanguageClient({
      name: 'HTTL Language Client',
      clientOptions: {
        documentSelector: ['httl'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      messageTransports,
    });

    client.registerProposedFeatures();
    return client;
  }
}
```

> The exact import path for `BrowserMessageReader/Writer` on the client side may be `vscode-languageserver-protocol/browser.js` (shipped with `monaco-languageclient`'s deps). If module resolution fails at build, try `monaco-languageclient/tools` exports or `vscode-jsonrpc/browser.js`. Resolve during the Task 13 build check.

- [ ] **Step 2: Commit**

```bash
git add packages/httl-website/src/components/editor/httl-extension/httl-language-client.ts
git commit -m "feat(website): drive language client over a web worker instead of websocket"
```

---

### Task 11: Spawn the worker from the extension activation

**Files:**
- Modify: `packages/httl-website/src/components/editor/httl-extension/extension.ts:9-33`

- [ ] **Step 1: Replace WebSocket/activation URL logic with a worker**

In `extension.ts`, change the `activate()` function so it creates the worker and passes it to the client (remove `lspUrl`, `lspActivationUrl`, and the `fetch` warm-up):

```ts
export async function activate() {
  if (initialized) {
    throw new Error('Extension already activated');
  }

  initialized = true;

  const extApi = await registerHttlConfig();

  const worker = new Worker(
    new URL('./lsp.worker.ts', import.meta.url),
    { type: 'module', name: 'httl-lsp' },
  );

  const lsp = new HttlLanguageClient(worker, extApi);
  const commands = new HttlCommands(extApi, lsp);

  await lsp.start();

  return {
    client: lsp,
    commands,
  };
}
```

Leave `registerHttlConfig()` and the `HttlExtensionApi` interface unchanged.

- [ ] **Step 2: Commit**

```bash
git add packages/httl-website/src/components/editor/httl-extension/extension.ts
git commit -m "feat(website): spawn LSP worker on extension activation"
```

---

### Task 12: Add browser bundle fallbacks/polyfills

**Files:**
- Modify: `packages/httl-website/next.config.mjs:29-40` (webpack block)
- Modify: `packages/httl-website/package.json` (add `path-browserify`)

- [ ] **Step 1: Install the path polyfill**

Run (from repo root): `npm install -D path-browserify @types/path-browserify -w httl-website`
Expected: both added to `packages/httl-website/package.json` devDependencies.

- [ ] **Step 2: Extend the webpack config**

In `packages/httl-website/next.config.mjs`, expand the `!isServer` branch so the Node-only modules that remain in the (unused) Node http client and `dotenv` resolve in the browser/worker bundle:

```js
webpack(config, { isServer, webpack }) {
  if (!isServer) {
    config.resolve.mainFields = ['browser', 'module', 'main', 'exports'];
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
      vm: false,
      http: false,
      https: false,
      tls: false,
      net: false,
      zlib: false,
      os: false,
      crypto: false,
      stream: false,
      'form-data': false,
      path: 'path-browserify',
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    );
  }

  return config;
},
```

> `process/browser` ships with webpack's deps in most Next setups; if resolution fails, `npm install -D process -w httl-website`. The Node `HttpClient` is bundled but never invoked in the browser (the worker injects `FetchHttpClient`), so these stubs only need to satisfy import-time resolution.

- [ ] **Step 3: Commit**

```bash
git add packages/httl-website/next.config.mjs packages/httl-website/package.json packages/httl-website/package-lock.json
git commit -m "build(website): add browser fallbacks/polyfills for the LSP worker bundle"
```

---

### Task 13: Build-and-run check for the worker LSP (still on dev server)

This is an integration checkpoint — no unit test. It verifies Milestones 1–3 before we remove the server.

- [ ] **Step 1: Ensure dependent dist is current**

Run (from repo root): `npm run build -w httl-core && npm run build -w httl-lsp`
Expected: both succeed.

- [ ] **Step 2: Start the dev server**

Run (from `packages/httl-website`): `npm run dev`
Expected: Next.js starts on `http://localhost:3000` with no module-resolution errors in the terminal.

- [ ] **Step 2a (if worker URL fails to bundle):** If the terminal shows an error resolving `./lsp.worker.ts` or `httl-lsp/browser`, confirm: (a) `httl-lsp` `dist/browser.js` exists, (b) the `exports` map in `httl-lsp/package.json` is correct, (c) the worker import uses `new URL('./lsp.worker.ts', import.meta.url)`. Fix and restart.

- [ ] **Step 3: Manual verification in the browser**

Open `http://localhost:3000`. In the QuickRun editor:
- Editor loads (no infinite "...Loading").
- Type `get ` and trigger completion (Ctrl+Space) — completion list appears (proves the worker LSP is connected).
- Introduce a syntax error — a diagnostic squiggle appears.
- Select the "Simple GET request" example and click Run — a real response renders in the ResponseViewer (this still hits the dev server's `/api/users` route at this point).

Expected: all four behaviours work. If Run fails with a CORS/network error against same-origin `/api/users`, capture the console error for Task 17 (it should succeed same-origin).

- [ ] **Step 4: No commit** (verification only). If fixes were needed, commit them with message `fix(website): worker LSP integration fixes`.

---

## Milestone 4 — Static conversion

### Task 14: Create static demo API JSON

**Files:**
- Create: `packages/httl-website/public/api/spec.json`
- Create: `packages/httl-website/public/api/users` (collection, extension-less)
- Create: `packages/httl-website/public/api/users/1`

- [ ] **Step 1: Copy the spec data and bake the server URL**

Copy the current `src/app/api/spec.json/data.json` to `public/api/spec.json`. Then set `servers[0].url` to the production origin (the route used to set this dynamically):

Edit `public/api/spec.json` so the first server entry reads:

```json
"servers": [
  { "url": "https://httl.dev/api" }
]
```

(Preserve all other fields exactly as in `data.json`.)

- [ ] **Step 2: Create the users collection file**

Copy `src/app/api/users/data.json` to `packages/httl-website/public/api/users` (a file literally named `users`, no extension), containing the same JSON array.

- [ ] **Step 3: Create the single-user file used by the demo**

Create `packages/httl-website/public/api/users/1` containing the `id: 1` object:

```json
{
  "id": 1,
  "username": "jdoe",
  "email": "jdoe@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

> The demo only references user `1`. Other IDs are intentionally omitted (documented trade-off).

- [ ] **Step 4: Add a Cloudflare `_headers` rule for JSON content-type**

Create `packages/httl-website/public/_headers`:

```
/api/users
  Content-Type: application/json
/api/users/*
  Content-Type: application/json
```

(`spec.json` already gets the right type from its `.json` extension.)

- [ ] **Step 5: Commit**

```bash
git add packages/httl-website/public/api packages/httl-website/public/_headers
git commit -m "feat(website): add static demo API JSON for cloudflare pages"
```

---

### Task 15: Remove server-only code

**Files:**
- Delete: `packages/httl-website/src/pages/api/lsp.ts`
- Delete: `packages/httl-website/src/middleware.ts`
- Delete: `packages/httl-website/src/lib/logging/` (whole dir)
- Delete: `packages/httl-website/src/app/api/auth/`
- Delete: `packages/httl-website/src/app/api/users/`
- Delete: `packages/httl-website/src/app/api/spec.json/`
- Delete: `packages/httl-website/src/app/api/_constants.ts`

- [ ] **Step 1: Confirm no remaining imports of the logging lib**

Run (from `packages/httl-website`): `npx grep -r "lib/logging" src` — or use the editor search. Expected: zero matches except inside the files about to be deleted.

> The only importers of `@/lib/logging/*` are the API route handlers, `middleware.ts`, and `pages/api/lsp.ts` — all deleted in this task. If grep shows another importer, stop and reassess.

- [ ] **Step 2: Delete the files**

Run (from `packages/httl-website`):

```bash
git rm src/pages/api/lsp.ts
git rm src/middleware.ts
git rm -r src/lib/logging
git rm -r src/app/api/auth
git rm -r src/app/api/users
git rm -r "src/app/api/spec.json"
git rm src/app/api/_constants.ts
```

> If `src/pages/` is now empty except `_error.js`, leave `_error.js` in place (it is a valid static error page).

- [ ] **Step 3: Verify nothing else references the removed routes in code**

Run (from `packages/httl-website`): search `src` for `api/auth` and `_constants` and `withLogging`. Expected: no matches in `src` (the `examples.tsx` string references to `/api/...` URLs are data, handled in Task 16).

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(website): remove server-only API routes, middleware, and logging"
```

---

### Task 16: Reduce demo examples to working GET-only set

**Files:**
- Modify: `packages/httl-website/src/components/quick-run/examples.tsx`

- [ ] **Step 1: Replace the examples with GET-only entries**

Rewrite `examples.tsx` keeping only the examples that work against static JSON:

```ts
export const examples = [
  {
    title: 'GET request using OpenAPI spec',
    code: `@spec: ${window.location.host}/api/spec.json

# Press Ctrl+Space | Option+Esc to see available paths and methods
get /users/1`
  },
  {
    title: 'Simple GET request',
    code: `get ${window.location.host}/api/users`
  }
];
```

> The previous `post /auth` + `put /users/1` examples are removed because the static site has no dynamic backend (documented trade-off). `get /users/1` resolves against the spec's `servers[0].url`; for the demo to work same-origin during local testing, see Task 17 note on the spec server URL.

- [ ] **Step 2: Commit**

```bash
git add packages/httl-website/src/components/quick-run/examples.tsx
git commit -m "feat(website): reduce demo to GET-only examples that work statically"
```

---

### Task 17: Switch to static export and finalize Cloudflare config

**Files:**
- Modify: `packages/httl-website/next.config.mjs` (add `output: 'export'`, remove `redirects()`)
- Create: `packages/httl-website/public/_redirects`

- [ ] **Step 1: Enable static export and drop the unsupported redirect**

In `packages/httl-website/next.config.mjs`:
- Add `output: 'export',` to `nextConfig`.
- Remove the entire `async redirects() { ... }` block (redirects require a server and are unsupported under `output: 'export'`).

The `nextConfig` object becomes:

```js
const nextConfig = {
  output: 'export',
  compiler: {
    styledComponents: true,
  },
  webpack(config, { isServer, webpack }) {
    // ...unchanged from Task 12...
  },
};
```

- [ ] **Step 2: Recreate the `/docs` redirect as a Cloudflare rule**

Create `packages/httl-website/public/_redirects`:

```
/docs  /docs/introduction/about-httl  302
```

- [ ] **Step 3: Build the static site**

Run (from `packages/httl-website`): `npm run build`
Expected: build completes and produces `packages/httl-website/out/` containing `index.html`, the `docs/` tree, and `api/` assets. No errors about server-only features (API routes, middleware, headers/redirects in `next.config`).

- [ ] **Step 3a (if build complains about dynamic routes):** Nextra's `[[...mdxPath]]` must statically enumerate pages. If `next build` errors that the route is missing `generateStaticParams`, confirm Nextra 4 is generating it (it does by default via `nextra/pages`); if a custom override is needed, add `export const dynamicParams = false;` to `src/app/(docs)/docs/[[...mdxPath]]/page.jsx` and re-run.

- [ ] **Step 4: Serve and verify the static output**

Run (from `packages/httl-website`): `npx serve out -l 3001` (or any static server)
Open `http://localhost:3001` and verify:
- Home page renders; QuickRun editor loads.
- Completion + diagnostics work (worker LSP).
- Both GET examples Run and return data from the static `/api/*` files.
- A docs page renders (e.g. `http://localhost:3001/docs/introduction/about-httl`).

> Same-origin note: when served from `localhost:3001`, the example `@spec` points at `${window.location.host}/api/spec.json` = `localhost:3001/api/spec.json` (static ✓). But the spec's `servers[0].url` is baked to `https://httl.dev/api`, so `get /users/1` will resolve to `https://httl.dev/...` and only work once deployed (or will hit CORS locally). For pure local verification, temporarily point `servers[0].url` at `window.location` is NOT possible in a static file — verify `get /api/users` (absolute same-origin) locally, and rely on the deployed environment to verify the spec-based example. Document this in the PR.

- [ ] **Step 5: Commit**

```bash
git add packages/httl-website/next.config.mjs packages/httl-website/public/_redirects
git commit -m "build(website): static export for cloudflare pages; move /docs redirect to _redirects"
```

---

### Task 18: Final regression pass

- [ ] **Step 1: Re-run the core test suite**

Run (from `packages/httl-core`): `npx jest`
Expected: all PASS (Node path unchanged).

- [ ] **Step 2: Confirm the VSCode/CLI Node path still builds**

Run (from repo root): `npm run build -w httl-core && npm run build -w httl-lsp`
Expected: both succeed (proves the Node server refactor in Task 7 didn't break the non-browser consumers).

- [ ] **Step 3: Final static build**

Run (from `packages/httl-website`): `npm run build`
Expected: `out/` regenerates cleanly.

- [ ] **Step 4: Commit any fixes** with `fix(website): final static-export regressions` if needed.

---

## Self-review notes (author)

- **Spec coverage:** LSP→worker (Tasks 7–13), browser HTTP/CORS execution (Tasks 1–6, 13, 17), demo API→static JSON incl. dropped dynamic endpoints (Tasks 14–16), `output: 'export'` + redirect move (Task 17), middleware/logging removal (Task 15), testing (Tasks 1–6 unit + 13/17/18 integration). All spec sections mapped.
- **Trade-offs from spec are encoded:** total-time-only timings (Task 2 factory sets sub-timings `undefined`), no multipart in browser (Task 4 note), GET-only demo (Task 16), single user-id file (Task 14).
- **Type consistency:** `IHttpClient.request(url, options)` is defined once (Task 3) and consumed identically in `NodeHttpClient` (Task 3), `FetchHttpClient` (Task 4), `RuntimeExecutor` (Task 5), and `Httl.httpClient` (Task 5). `HttpResponse.fromFetch` input shape (Task 2) matches the call site in `FetchHttpClient` (Task 4). `configureServer(connection, { httpClient })` (Task 7) matches both the Node (Task 7) and browser (Task 8) callers.
- **Known integration-discovery points (flagged inline, not placeholders):** exact client-side `BrowserMessageReader/Writer` import path (Task 10), `process/browser` availability (Task 12), Nextra static-params (Task 17). Each has a concrete fallback instruction.
