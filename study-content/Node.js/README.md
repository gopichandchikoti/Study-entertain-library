# Node.js: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites


You need a terminal and basic programming curiosity. Knowing a little browser
JavaScript helps but is not required. Use Node.js 22 or a current LTS release,
pnpm, a text editor, and fake data.



## Reading order

1. [Learning Map](01-learning-map.md)
2. [Why Node And Javascript Runtime History](02-why-node-and-javascript-runtime-history.md)
3. [Installation Npm Pnpm And Project Layout](03-installation-npm-pnpm-and-project-layout.md)
4. [Javascript Values Functions And Objects](04-javascript-values-functions-and-objects.md)
5. [Typescript Runtime Types And Schemas](05-typescript-runtime-types-and-schemas.md)
6. [Esm Commonjs Modules And Packages](06-esm-commonjs-modules-and-packages.md)
7. [Event Loop Tasks And Microtasks](07-event-loop-tasks-and-microtasks.md)
8. [Promises Async Await And Timeouts](08-promises-async-await-and-timeouts.md)
9. [Timers Aborts And Resource Lifecycles](09-timers-aborts-and-resource-lifecycles.md)
10. [Files Paths Buffers And Safe Io](10-files-paths-buffers-and-safe-io.md)
11. [Http Urls Headers And Raw Server](11-http-urls-headers-and-raw-server.md)
12. [Express Routing And Json](12-express-routing-and-json.md)
13. [Middleware Errors And Request Lifecycle](13-middleware-errors-and-request-lifecycle.md)
14. [Runtime Validation And Configuration](14-runtime-validation-and-configuration.md)
15. [Rest Api Contracts And Pagination](15-rest-api-contracts-and-pagination.md)
16. [Databases Pools And Repositories](16-databases-pools-and-repositories.md)
17. [Streams Backpressure And Large Files](17-streams-backpressure-and-large-files.md)
18. [Authentication Authorization And Node Security](18-authentication-authorization-and-node-security.md)
19. [Errors Retries Graceful Shutdown And Signals](19-errors-retries-graceful-shutdown-and-signals.md)
20. [Testing Unit Http And Integration](20-testing-unit-http-and-integration.md)
21. [Logging Metrics Tracing And Health](21-logging-metrics-tracing-and-health.md)
22. [Performance Workers Queues And Webhooks](22-performance-workers-queues-and-webhooks.md)
23. [Deployment Docker And Rollback](23-deployment-docker-and-rollback.md)
24. [Capstone Study Notes Api](24-capstone-study-notes-api.md)
25. [Glossary Practice And Checklist](25-glossary-practice-and-checklist.md)

## A-to-Z coverage map


| Letter | Topic | Question to answer |
| --- | --- | --- |
| A | Async and APIs | What work waits, and what promise is made? [Promises Async Await And Timeouts](08-promises-async-await-and-timeouts.md) |
| B | Buffers and backpressure | How do bytes move without unlimited memory? [Files Paths Buffers And Safe Io](10-files-paths-buffers-and-safe-io.md) |
| C | CommonJS and configuration | How do modules and settings load? [Esm Commonjs Modules And Packages](06-esm-commonjs-modules-and-packages.md) |
| D | Dependencies and debugging | What does the program need and how do we inspect it? [Learning Map](01-learning-map.md) |
| E | Event loop and errors | What runs later and what can fail? [Event Loop Tasks And Microtasks](07-event-loop-tasks-and-microtasks.md) |
| F | Files, fetch, and functions | How does Node access the outside world? [Installation Npm Pnpm And Project Layout](03-installation-npm-pnpm-and-project-layout.md) |
| G | Globals and graceful shutdown | What is shared and how does the process stop? [Errors Retries Graceful Shutdown And Signals](19-errors-retries-graceful-shutdown-and-signals.md) |
| H | HTTP and headers | How does the server speak? [Http Urls Headers And Raw Server](11-http-urls-headers-and-raw-server.md) |
| I | Input validation and identity | Which values and users can be trusted? [Runtime Validation And Configuration](14-runtime-validation-and-configuration.md) |
| J | JSON and jobs | How do data and background work fit? [Installation Npm Pnpm And Project Layout](03-installation-npm-pnpm-and-project-layout.md) |
| K | Keys and keep-alive | How are secrets and connections managed? [Http Urls Headers And Raw Server](11-http-urls-headers-and-raw-server.md) |
| L | Logging and lifecycle | How can an operator see the process? [Timers Aborts And Resource Lifecycles](09-timers-aborts-and-resource-lifecycles.md) |
| M | Modules and middleware | How is code composed and request work shared? [Esm Commonjs Modules And Packages](06-esm-commonjs-modules-and-packages.md) |
| N | npm and Node runtime | How are packages installed and scripts run? [Why Node And Javascript Runtime History](02-why-node-and-javascript-runtime-history.md) |
| O | Observability and ownership | Who can diagnose a failure? [Timers Aborts And Resource Lifecycles](09-timers-aborts-and-resource-lifecycles.md) |
| P | Promises and performance | How do we avoid blocking the loop? [Promises Async Await And Timeouts](08-promises-async-await-and-timeouts.md) |
| Q | Queues and query parameters | How are bursts and filters bounded? [Databases Pools And Repositories](16-databases-pools-and-repositories.md) |
| R | REST and routing | What resources and paths exist? [Express Routing And Json](12-express-routing-and-json.md) |
| S | Streams, security, and status | How do bytes, trust, and outcomes work? [Files Paths Buffers And Safe Io](10-files-paths-buffers-and-safe-io.md) |
| T | TypeScript and testing | How do we catch mistakes before deployment? [Installation Npm Pnpm And Project Layout](03-installation-npm-pnpm-and-project-layout.md) |
| U | URLs and untrusted input | How are paths and URLs validated? [Http Urls Headers And Raw Server](11-http-urls-headers-and-raw-server.md) |
| V | Validation and versioning | How can a contract evolve? [Runtime Validation And Configuration](14-runtime-validation-and-configuration.md) |
| W | Workers and webhooks | Where does CPU or later work run? [Performance Workers Queues And Webhooks](22-performance-workers-queues-and-webhooks.md) |
| X | eXternal services | What if another provider is slow? [Learning Map](01-learning-map.md) |
| Y | YAML and your environment | Where do deployment values live? [Runtime Validation And Configuration](14-runtime-validation-and-configuration.md) |
| Z | Zero-downtime shutdown | How does a release finish current work? [Errors Retries Graceful Shutdown And Signals](19-errors-retries-graceful-shutdown-and-signals.md) |



## Diagram library

- [browser JavaScript, V8, Node runtime, OS APIs, and server process](images/node-browser-to-runtime.svg)
- [call stack, event loop, timers, microtasks, I/O, and blocking CPU warning](images/node-event-loop-tasks.svg)
- [source modules, package exports, lockfile, dependency, and runtime](images/node-module-and-package-boundary.svg)
- [client, raw HTTP server, URL, route, response, and socket lifecycle](images/node-http-request-flow.svg)
- [request ID, JSON parser, auth, route, error handler, response](images/node-express-middleware-chain.svg)
- [runtime schema, service, repository, database, and error](images/node-validation-service-repository.svg)
- [producer, readable stream, transform, writable stream, slow consumer, and pause](images/node-stream-backpressure.svg)
- [client, TLS, token/session, API, authorization, database, denied path](images/node-authentication-security-boundary.svg)
- [API, queue, worker, retry, dead letter, webhook, and result](images/node-worker-queue-flow.svg)
- [lockfile, checks, build, container, environment, health, smoke, rollback](images/node-deployment-health.svg)

## Sources and version record

Node 22 baseline; ESM modules. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://nodejs.org/api/)

## Portable specification

[Generation blueprint](00-nodejs-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

