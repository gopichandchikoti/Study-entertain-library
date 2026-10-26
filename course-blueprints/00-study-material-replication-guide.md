# Study Material Replication Guide

This file is a complete instruction manual for a new coding agent on a new
machine. The new machine may have no copy of this repository, no personal
books, no database, no images, and no previous conversation. The agent must be
able to create a clean, useful study library by reading this document alone.

The explanation uses small words on purpose. Think of the study library as a
school bookshelf:

- a **course folder** is one shelf;
- a **Markdown file** is one lesson book;
- a **README** is the shelf sign;
- a **diagram** is a picture that explains movement or relationships;
- a **practice lab** is a small exercise the student can do;
- a **checklist** proves that the student can explain the lesson.

## 1. The goal

Create portable study material for these subjects:

1. API design and REST APIs.
2. MCP servers. The existing folder is called `MCP servers`; if someone says
   NCP, first check whether they mean MCP, the Model Context Protocol.
3. System design.
4. Java.
5. Spring Boot.
6. Python First API, using Python and FastAPI.
7. Node.js.

Also create this replication guide so another agent can repeat the same work.
The guides are educational documents, not a copy of private books or a copy of
production data.

## 2. What was found in the original study root

The existing study root used three main course folders:

| Course folder | Markdown files | Standalone SVG diagrams | Main subjects |
| --- | ---: | ---: | --- |
| `API designs` | 18 before this addition | 12 | HTTP, REST, Java, Spring Boot, SQL, testing, and application design |
| `MCP servers` | 23 before this addition | 17 | MCP roles, JSON-RPC, transports, tools, resources, security, and operations |
| `System Design` | 21 before this addition | 14 | requirements, capacity, networking, data, scaling, reliability, and deployment |

That is 62 existing course Markdown files and 43 standalone SVG diagrams. The
course folders contain SVG diagrams rather than photographs. The Markdown also
contains Mermaid diagrams and plain `text` or `ascii` diagrams. No separate
Python course folder was present in the audited study root, so the new machine
must create `Python First API` from the guide below. After this addition, the
three original folders contain 19, 24, and 22 Markdown files. The three
blueprints added to those folders plus the five guides in the new Java, Spring
Boot, Python First API, Node.js, and replication folders make eight portable
guides in total.

The application itself has additional Markdown about running the library,
replication, operations, and project memory. Those files describe the bookshelf
software. The course files describe the subjects on the bookshelf. Keep those
two jobs separate.

## 3. The writing pattern to copy

Every good lesson in the existing collection follows almost the same path:

1. Start with a child-friendly picture.
2. Define the important words.
3. Explain why the idea exists.
4. Show the request, data, or program flow step by step.
5. Connect the idea to one realistic example, usually a small schedule API.
6. Show a short code or HTTP example.
7. Explain a failure and a trade-off.
8. Give a practice exercise.
9. End with a small checklist the learner can answer without copying.

Use short sections. Use numbered filenames when a reading order matters. Put a
course map in `00-learning-map.md` when the course has many lessons. Put a
course README beside the lessons. Use a final glossary and practice lesson for
large courses.

The tone is friendly but technically honest. Explain a large word immediately.
For example: "A transaction is a promise that a group of database changes acts
like one safe action." Do not hide important failure cases just because the
reader is a beginner.

## 4. What each new course file must contain

Each subject blueprint is a **standalone course generator**, not only a short
study summary. A new agent can receive one blueprint by itself. That one file
must tell the agent how to create the subject folder, every ordered Markdown
lesson, the image folder, every local SVG diagram, the examples, the labs, and
the validation checks. The agent must not require any old folder, old image, or
previous conversation.

These are the portable blueprint files:

```text
API designs/16-api-design-course-blueprint.md
MCP servers/22-mcp-course-blueprint.md
System Design/20-system-design-course-blueprint.md
Java/00-java-course-blueprint.md
Spring Boot/00-spring-boot-course-blueprint.md
Python First API/00-python-first-api-course.md
Node.js/00-nodejs-course-blueprint.md
Study Material Replication/00-study-material-replication-guide.md
```

A new agent must create the generated lesson files immediately from the
blueprint manifest. It may later split a long lesson into smaller files, but it
must preserve the listed order and coverage. Do not make the new student depend
on a path from the old computer.

Every course file must have:

- a one-minute explanation;
- audience and prerequisites;
- learning outcomes;
- an A-to-Z topic map;
- a recommended order;
- a real running example;
- code, JSON, SQL, or HTTP examples where useful;
- at least one Mermaid flowchart;
- failure cases and trade-offs;
- practice labs;
- a definition-of-done checklist;
- safe local commands;
- a short version note and source list.

The blueprint must also contain:

- an exact target tree with every filename in reading order;
- a lesson manifest mapping every file to its required concepts;
- an SVG manifest naming every image and describing its boxes and arrows;
- a per-lesson recipe requiring explanations, code, use cases, failures,
  Mermaid/text flowcharts, a matching SVG, labs, and checkpoints;
- an explanation of why the language or framework exists, what it improved,
  what it costs, and when another choice is better;
- a fresh-machine validation gate that counts paths and checks broken links.

## 5. The portable folder tree

The new agent should create a content root like this. The root can be anywhere;
the path must not be hard-coded to the original user's home directory.

```text
study-root/
+-- API designs/
|   +-- 16-api-design-course-blueprint.md
|   +-- images/
+-- MCP servers/
|   +-- 22-mcp-course-blueprint.md
|   +-- images/
+-- System Design/
|   +-- 20-system-design-course-blueprint.md
|   +-- images/
+-- Java/
|   +-- 00-java-course-blueprint.md
+-- Spring Boot/
|   +-- 00-spring-boot-course-blueprint.md
+-- Python First API/
|   +-- 00-python-first-api-course.md
+-- Node.js/
|   +-- 00-nodejs-course-blueprint.md
+-- Study Material Replication/
    +-- 00-study-material-replication-guide.md
```

The application should receive this root through `STUDY_CONTENT_DIR`, or use a
parent directory above the application when that is the local convention. Do
not put study files in `src`, `public`, `dist`, `node_modules`, or a generated
build directory.

## 6. How diagrams are used

The original collection uses diagrams to answer "where does the message go?"
or "which thing owns this data?" It does not use decoration as a substitute for
teaching.

The 43 existing SVG diagrams fall into these useful families:

- request and response lifecycles;
- end-to-end application flows;
- layered controller/service/repository architecture;
- sequence diagrams for reads and writes;
- database relationships and data choices;
- decision trees for architecture selection;
- error-handling paths;
- testing pyramids and observability loops;
- build, deployment, and disaster recovery flows;
- MCP roles, JSON-RPC, lifecycle, tools, resources, transports, OAuth,
  security boundaries, long-running work, and state layers;
- system-design cache, queue, replication, sharding, reliability, and security
  flows.

Use this rule for a new diagram:

```text
one picture = one question
boxes = programs, stores, or people
arrows = messages or ownership
labels = the important action
red or warning path = a failure or security boundary
```

Use Mermaid inside Markdown first because it is easy to copy to a new machine.
The new agent must then create a matching standalone SVG from the blueprint's
image manifest. No SVG is transferred from this machine. The new SVG is a
local text file generated by the agent with boxes, arrows, labels, and a
`viewBox`; it must not depend on a downloaded image, font, screenshot, or
private asset. Never leave a broken image link. If an SVG viewer is unavailable,
the Mermaid or plain-text diagram must still teach the same flow.

Recommended diagram names for the new subjects:

```text
api-request-lifecycle.svg
api-layered-boundary.svg
api-error-and-validation-flow.svg
spring-boot-request-lifecycle.svg
python-fastapi-request-flow.svg
node-event-loop-and-request-flow.svg
system-design-requirements-to-architecture.svg
mcp-host-client-server.svg
```

Do not use private screenshots, real credentials, personal file names, or
unlicensed media as course assets. A diagram made from boxes and labels is
safer and clearer.

## 7. Course coverage contract

The new guides must cover these topics, even if a later agent splits them into
more lessons.

### API design

HTTP, URLs, methods, status codes, headers, JSON, REST resources, CRUD,
validation, errors, pagination, filtering, versioning, OpenAPI, idempotency,
authentication, authorization, rate limiting, transactions, testing,
observability, deployment, and API documentation.

### MCP servers

Host, model, client, server, JSON-RPC, request IDs, notifications, lifecycle,
capabilities, modern stateless metadata, legacy initialization, stdio,
Streamable HTTP, tools, resources, prompts, elicitation, roots, sampling,
progress, cancellation, subscriptions, tasks, authentication, OAuth,
authorization, trust boundaries, errors, testing, observability, deployment,
state ownership, and architecture decisions.

### System design

Users, functional requirements, non-functional requirements, capacity
estimation, latency, availability, networking, DNS, load balancing, APIs,
databases, indexes, transactions, caches, queues, workers, events, consistency,
replication, sharding, scaling, rate limits, reliability, retries, timeouts,
idempotency, security, privacy, logs, metrics, traces, deployment, backups,
disaster recovery, architecture patterns, and design reviews.

### Java

JDK, JVM, compilation, Gradle, variables, types, operators, control flow,
methods, classes, objects, encapsulation, inheritance, interfaces, records,
enums, collections, generics, null, `Optional`, exceptions, dates and time,
strings, lambdas, streams, file I/O, HTTP, JSON, JDBC, concurrency, testing,
packages, visibility, memory, and backend project structure.

### Spring Boot

Boot startup, auto-configuration, application context, beans, dependency
injection, component annotations, Spring MVC, routing, binding, Jackson,
validation, service layers, repositories, configuration properties, profiles,
logging, error handling, `ProblemDetail`, transactions, JDBC, JPA concepts,
Actuator, OpenAPI, Spring Security concepts, unit tests, MockMvc, integration
tests, Testcontainers concepts, metrics, packaging, deployment, and
production hardening.

### Python First API

Python installation, virtual environments, variables, functions, collections,
modules, exceptions, typing, dataclasses, files, JSON, HTTP, FastAPI routes,
Pydantic models, dependency injection, validation, CRUD, SQLite/PostgreSQL
boundaries, authentication concepts, error responses, async work, tests,
OpenAPI, logging, Docker, deployment, and API security.

### Node.js

Runtime, V8, JavaScript and TypeScript basics, npm/pnpm, ESM, modules, the event
loop, promises, async/await, timers, filesystem, paths, URLs, environment
variables, HTTP, streams, buffers, Express, routing, middleware, validation,
errors, REST, databases, authentication, testing, logging, performance,
security, graceful shutdown, Docker, deployment, and worker boundaries.

## 8. A plain-language explanation for the new agent

The new agent should follow this order:

1. Make an empty folder.
2. Make one folder for each subject.
4. Give the new agent one subject blueprint at a time, if the chat limit is
   small. Each blueprint is complete on its own.
5. The agent creates the subject folder and its `images` folder before writing
   the lessons.
6. The agent creates every Markdown path in the blueprint manifest in order.
7. The agent creates every SVG from the written image description; no image is
   pasted into the conversation.
8. Each lesson starts with a simple story, defines words, and explains why the
   idea exists.
9. Each lesson includes code, a real-time use case, a failure, a flowchart, an
   image reference, a lab, and a checkpoint.
10. The agent adds README links only after the target files exist.
11. The agent checks every link, code fence, Mermaid block, SVG path, and topic
   mapping.
12. The agent reports which commands and documentation checks actually ran.

Do not assume the new agent can open an old file. Do not write "see the file on
the other machine." Copy the necessary explanation into the new document.
Relative links inside the new content root are allowed because the new agent
creates both sides of the link.

## 9. Safe creation workflow

Use this workflow on a fresh machine:

1. Install a current LTS Node.js release, pnpm, Git, and the tools needed by
   the chosen examples. Install Java 17 if the Java or Spring course will run.
2. Choose a study root and set `STUDY_CONTENT_DIR` for the library application.
3. Create the folder tree above.
4. Give the relevant subject blueprint to the new agent. The agent creates the
   complete course from that one file; no other course folder is required.
5. Create only synthetic examples such as `examples/hello-api` if runnable
   code is needed. Do not copy private study files.
6. Add Mermaid diagrams and generate the manifest SVGs locally from text.
7. Run the checks below and the subject-specific checks in the blueprint.
8. Record changes in a feature log or changelog.

### Single-blueprint handoff prompt

Use this prompt before attaching one subject blueprint:

```text
You are creating one complete educational course in an empty study root. The
attached Markdown blueprint is the only source you will receive. Do not ask
for the old repository, folders, images, screenshots, or another course. Read
the blueprint completely, create its main folder and images folder, create every
Markdown file in its exact manifest order, and generate every SVG locally from
the image descriptions. Every lesson must contain a plain-language explanation,
history and reason for the technology, code, real-time use cases, Mermaid or
text flow, matching SVG, failure/security analysis, trade-offs, labs, and
checkpoints. Do not make placeholders. Validate all paths and links, then
report the exact files and commands checked.
```

## 10. Validation checklist

A course is ready when all of these are true:

- [ ] The main Markdown file opens by itself.
- [ ] The first paragraph explains the subject in plain language.
- [ ] The reading order is clear.
- [ ] Every major word is defined before it is used.
- [ ] At least one request, data, or program flow is drawn.
- [ ] Code examples use safe fake values.
- [ ] Failure behavior is explained.
- [ ] At least three practice tasks exist.
- [ ] A learner can tell when they are done.
- [ ] Internal links point to files that exist.
- [ ] Code fences have a language label where possible.
- [ ] No absolute home-directory paths are required.
- [ ] No secrets, private books, database dumps, or real media are included.
- [ ] The content root remains separate from application source code.

For the Study Library application, run the relevant checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

For a course that contains Java, Python, or Node examples, run only the
commands for examples that actually exist. Report missing runtimes honestly.
Do not claim that a diagram rendered, a server started, or a test passed unless
it was checked.

## 11. Prompt for a new agent

Paste this message before giving the new agent this guide:

```text
You are creating a portable study library in an empty directory. You have no
access to my old computer or old files. Read the attached replication guide as
the complete specification. Create the folders and self-contained course
Markdown files it names. Do not invent a dependency on an old absolute path.
Use beginner-friendly explanations, Mermaid diagrams, safe examples, failure
cases, practice labs, and checklists. Create files first, then run the narrowest
available validation. Report exactly what was created and what was checked.
Do not copy private content, secrets, database dumps, or unlicensed media.
```

## 12. Observed source inventory

These are the Markdown lesson names observed before the new blueprints were
added. Preserve the names when reproducing the original bookshelf. The API
course has a visible number gap between `07` and `09`; do not silently invent
an old `08` lesson.

### API designs

```text
README.md
00-START-HERE.md
01-computers-http-api-basics.md
02-rest-json-and-http.md
03-java-from-zero.md
04-java-oop-and-modern-java.md
05-spring-boot-from-zero.md
06-tm-schedule-architecture.md
07-folder-structure-and-domain-model.md
09-database-sql-jdbc-oracle.md
10-validation-errors-security.md
11-testing-apis.md
12-system-design-and-design-patterns.md
13-application-development-blueprint.md
14-practice-labs.md
15-glossary-and-cheat-sheets.md
INDEX-READING-CHECKLIST.md
TM-SCHEDULE-API-BY-API.md
```

### MCP servers

```text
README.md
00-learning-map.md
01-mcp-in-one-picture.md
02-people-programs-and-roles.md
03-json-rpc-messages.md
04-lifecycle-discovery-and-capabilities.md
05-state-and-stateless-design.md
06-transports-stdio-and-streamable-http.md
07-tools.md
08-resources-and-prompts.md
09-client-features-elicitation-roots-and-sampling.md
10-multi-round-work-progress-cancellation-and-subscriptions.md
11-authentication-authorization-and-oauth.md
12-security-and-trust-boundaries.md
13-errors-testing-and-observability.md
14-build-an-mcp-server.md
15-build-an-mcp-client-and-host.md
16-end-to-end-tm-schedule-example.md
17-deployment-and-operations.md
18-architecture-cookbook-and-decision-guide.md
19-glossary-checklists-and-practice.md
20-sources-and-version-notes.md
21-advanced-utilities-and-extension-map.md
```

### System Design

```text
README.md
00-learning-map.md
01-system-design-foundations.md
02-requirements-and-capacity-estimation.md
03-architecture-building-blocks.md
04-networking-and-web-requests.md
05-apis-and-contracts.md
06-data-modeling-and-databases.md
07-caching.md
08-queues-events-and-background-work.md
09-consistency-transactions-and-distributed-data.md
10-scaling-and-partitioning.md
11-reliability-and-failure-handling.md
12-security-and-privacy.md
13-observability-and-operations.md
14-deployment-cloud-and-disaster-recovery.md
15-common-architecture-patterns.md
16-design-interview-and-review-method.md
17-tm-schedule-end-to-end-case-study.md
18-application-architecture-cookbook-and-decision-guide.md
19-glossary-checklists-and-practice-answers.md
```

The three original READMEs provide the lesson order and image maps. The new
blueprints add a portable summary for each subject; they do not replace the
existing detailed lessons.

## 13. Final handoff checklist

Before sharing the documents with another agent, confirm:

- the replication guide is included;
- every subject has one main course file;
- the subject names are clear;
- the guide lists the full folder tree;
- diagrams have a purpose and a fallback;
- all examples use portable paths;
- the new machine can start without the old repository;
- validation results are written down;
- any missing runtime or browser feature is stated plainly.

The most important promise is simple: a reader should not need to guess what to
create next.
