# FastAPI: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites


This course is for a person who can use a terminal but may be new to Python
and backend work. You need:

- a computer and a text editor;
- Python 3.11 or newer;
- a terminal;
- basic comfort with folders and commands;
- patience to read an error message before changing code.

The first project uses an in-memory list so the learner can understand HTTP
before learning database administration. The later project uses SQLite locally
and leaves a clear boundary for PostgreSQL in a hosted environment.



## Reading order

1. [Learning Map](01-learning-map.md)
2. [Why Python And Web Framework History](02-why-python-and-web-framework-history.md)
3. [Installation Venv And Project Layout](03-installation-venv-and-project-layout.md)
4. [Values Types And Control Flow](04-values-types-and-control-flow.md)
5. [Reading Python Errors And Tracebacks](04a-reading-python-errors-and-tracebacks.md)
6. [Text Strings And F Strings](04b-text-strings-and-f-strings.md)
7. [Functions Scope And Composition](05-functions-scope-and-composition.md)
8. [Collections Comprehensions And Datastructures](06-collections-comprehensions-and-datastructures.md)
9. [Classes And Objects In Python](06a-classes-and-objects-in-python.md)
10. [Modules Packages And Dependencies](07-modules-packages-and-dependencies.md)
11. [Exceptions Context Managers And Errors](08-exceptions-context-managers-and-errors.md)
12. [Decorators And Generators Explained](08a-decorators-and-generators-explained.md)
13. [Typing Dataclasses And Model Design](09-typing-dataclasses-and-model-design.md)
14. [Files Paths Json And Configuration](10-files-paths-json-and-configuration.md)
15. [Http Urls Headers And Json Contracts](11-http-urls-headers-and-json-contracts.md)
16. [Calling Another Api With Httpx](11a-calling-another-api-with-httpx.md)
17. [First Fastapi Application](12-first-fastapi-application.md)
18. [Pydantic Validation And Schemas](13-pydantic-validation-and-schemas.md)
19. [Dependency Injection And Application Layers](14-dependency-injection-and-application-layers.md)
20. [Routing Query Path And Body Inputs](15-routing-query-path-and-body-inputs.md)
21. [Crud Services And Safe Errors](16-crud-services-and-safe-errors.md)
22. [Sqlite Sql And Repository Boundaries](17-sqlite-sql-and-repository-boundaries.md)
23. [Postgresql Migrations And Transactions](18-postgresql-migrations-and-transactions.md)
24. [Authentication Authorization And Api Security](19-authentication-authorization-and-api-security.md)
25. [Async Work Workers And Background Jobs](20-async-work-workers-and-background-jobs.md)
26. [Testing Openapi And Contracts](21-testing-openapi-and-contracts.md)
27. [Logging Observability Docker And Deployment](22-logging-observability-docker-and-deployment.md)
28. [Capstone Study Notes Api](23-capstone-study-notes-api.md)
29. [Glossary Practice And Checklist](24-glossary-practice-and-checklist.md)

## A-to-Z coverage map


| Letter | Topic | Simple question |
| --- | --- | --- |
| A | API and application | What promise does the program make? [First Fastapi Application](12-first-fastapi-application.md) |
| B | Basics and booleans | How does Python hold a value? [Values Types And Control Flow](04-values-types-and-control-flow.md) |
| C | Collections and CRUD | How do we create, read, update, and delete? [Collections Comprehensions And Datastructures](06-collections-comprehensions-and-datastructures.md) |
| D | Dependencies and data | What does this function need? [Collections Comprehensions And Datastructures](06-collections-comprehensions-and-datastructures.md) |
| E | Exceptions and errors | What happens when work fails? [Exceptions Context Managers And Errors](08-exceptions-context-managers-and-errors.md) |
| F | FastAPI and functions | How does a URL call Python code? [Why Python And Web Framework History](02-why-python-and-web-framework-history.md) |
| G | GET and good boundaries | How do we read safely? [Functions Scope And Composition](05-functions-scope-and-composition.md) |
| H | HTTP and headers | How do computers speak? [Http Urls Headers And Json Contracts](11-http-urls-headers-and-json-contracts.md) |
| I | Input validation | How do we reject nonsense early? [Typing Dataclasses And Model Design](09-typing-dataclasses-and-model-design.md) |
| J | JSON and JSON Schema | How do we exchange structured data? [Files Paths Json And Configuration](10-files-paths-json-and-configuration.md) |
| K | Keys and idempotency | Can a repeated request create a duplicate? [Async Work Workers And Background Jobs](20-async-work-workers-and-background-jobs.md) |
| L | Logging and layers | How do we find the first broken boundary? [Dependency Injection And Application Layers](14-dependency-injection-and-application-layers.md) |
| M | Modules and models | How do files and data shapes fit together? [Modules Packages And Dependencies](07-modules-packages-and-dependencies.md) |
| N | Null, `None`, and names | What does missing mean? [Values Types And Control Flow](04-values-types-and-control-flow.md) |
| O | OpenAPI and ownership | How can another programmer use the API? [Dependency Injection And Application Layers](14-dependency-injection-and-application-layers.md) |
| P | Pydantic and persistence | Where do rules and stored data live? [Pydantic Validation And Schemas](13-pydantic-validation-and-schemas.md) |
| Q | Query parameters | How do we filter or paginate? [Functions Scope And Composition](05-functions-scope-and-composition.md) |
| R | Responses and repositories | What shape comes back? [Learning Map](01-learning-map.md) |
| S | Security and status codes | Who may do what, and what happened? [Http Urls Headers And Json Contracts](11-http-urls-headers-and-json-contracts.md) |
| T | Tests and transactions | How do we prove behavior? [Sqlite Sql And Repository Boundaries](17-sqlite-sql-and-repository-boundaries.md) |
| U | URLs and user input | Which values are untrusted? [Http Urls Headers And Json Contracts](11-http-urls-headers-and-json-contracts.md) |
| V | Virtual environments and versioning | How do we keep dependencies separate? [Modules Packages And Dependencies](07-modules-packages-and-dependencies.md) |
| W | Workers and webhooks | What work should happen later? [Async Work Workers And Background Jobs](20-async-work-workers-and-background-jobs.md) |
| X | XML and external formats | How do we handle a non-JSON partner? [Learning Map](01-learning-map.md) |
| Y | YAML configuration | Where should environment settings live? [Files Paths Json And Configuration](10-files-paths-json-and-configuration.md) |
| Z | Zero-to-deployed API | Can someone run and operate it? [Learning Map](01-learning-map.md) |



## Diagram library

- [source, interpreter, virtual environment, packages, process, and terminal](images/python-runtime-and-venv.svg)
- [client, HTTP, ASGI, route, model, service, repository, and response](images/python-request-to-response.svg)
- [path/body input, FastAPI binding, Pydantic failure or route execution](images/python-fastapi-route-validation.svg)
- [JSON, model validation, typed object, response schema, and error](images/python-pydantic-schema-flow.svg)
- [route, dependency, service, repository, database/provider](images/python-layered-api.svg)
- [local SQLite and hosted PostgreSQL behind one repository contract](images/python-sqlite-postgresql-boundary.svg)
- [client, token/session, API, authorization, data, and denied path](images/python-authentication-security-boundary.svg)
- [request, queue, worker, progress, retry, cancellation, and result](images/python-async-worker-job-flow.svg)
- [code, tests, OpenAPI, client, failure, and correction loop](images/python-testing-openapi-loop.svg)
- [lockfile, build, container, environment, health, smoke test, and rollback](images/python-deployment-health.svg)
- [The last line tells you what went wrong. The lines above show the path the program walked. Find the line from your own file, fix one thing, and run again.](images/python-reading-a-traceback.svg)
- [A string is a necklace of numbered letters. Methods like strip and split give back new strings. An f-string fills values into a sentence.](images/python-strings-and-f-strings.svg)
- [A class describes what every object has and can do. Each object keeps its own data. self is how a method refers to the object it is working on.](images/python-classes-and-objects.svg)
- [A decorator wraps a function to add behavior. A generator uses yield to hand back one value at a time. FastAPI uses both: @app.get registers routes, and yield dependencies clean up.](images/python-decorators-and-generators.svg)
- [When your app calls another service, protect it: set a timeout, check the status, keep the API key secret, and have a safe fallback ready.](images/python-calling-another-api.svg)

## Sources and version record

Python 3.11+; examples use Python 3.11 syntax and Pydantic 2 conventions. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://docs.python.org/3/tutorial/)

- [Official reference](https://fastapi.tiangolo.com/tutorial/)

## Portable specification

[Generation blueprint](00-fastapi-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

