# API designs: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites


This course is for a beginner who can read JSON and wants to learn backend
architecture. By the end you can:

- explain clients, servers, routes, resources, and contracts;
- choose HTTP methods and status codes deliberately;
- design request and response JSON;
- validate input and return stable errors;
- separate controllers, services, repositories, and external adapters;
- use pagination, filtering, idempotency, authentication, and authorization;
- document an API with OpenAPI;
- test happy paths and failure paths;
- reason about storage, transactions, observability, and deployment.



## Reading order

1. [START HERE](00-START-HERE.md)
2. [Computers Http Api Basics](01-computers-http-api-basics.md)
3. [Rest Json And Http](02-rest-json-and-http.md)
4. [Java From Zero](03-java-from-zero.md)
5. [Java Oop And Modern Java](04-java-oop-and-modern-java.md)
6. [Spring Boot From Zero](05-spring-boot-from-zero.md)
7. [Tm Schedule Architecture](06-tm-schedule-architecture.md)
8. [Folder Structure And Domain Model](07-folder-structure-and-domain-model.md)
9. [Database Sql Jdbc Oracle](09-database-sql-jdbc-oracle.md)
10. [Validation Errors Security](10-validation-errors-security.md)
11. [Testing Apis](11-testing-apis.md)
12. [System Design And Design Patterns](12-system-design-and-design-patterns.md)
13. [Application Development Blueprint](13-application-development-blueprint.md)
14. [Practice Labs](14-practice-labs.md)
15. [Glossary And Cheat Sheets](15-glossary-and-cheat-sheets.md)
16. [INDEX READING CHECKLIST](INDEX-READING-CHECKLIST.md)
17. [TM SCHEDULE API BY API](TM-SCHEDULE-API-BY-API.md)

## A-to-Z coverage map


| Letter | Topic | Beginner question |
| --- | --- | --- |
| A | API actors | Who asks, who answers, and who owns the data? [START HERE](00-START-HERE.md) |
| B | Bodies and boundaries | Which data may cross this doorway? [Database Sql Jdbc Oracle](09-database-sql-jdbc-oracle.md) |
| C | Contracts and CRUD | What promise does each operation make? [Rest Json And Http](02-rest-json-and-http.md) |
| D | Data models | What is a resource and what is its identity? [START HERE](00-START-HERE.md) |
| E | Errors | How can a caller understand failure safely? [Validation Errors Security](10-validation-errors-security.md) |
| F | Filtering and flow | How does one request move through layers? [Java From Zero](03-java-from-zero.md) |
| G | Gateways | Where do TLS, identity, and rate limits live? [START HERE](00-START-HERE.md) |
| H | HTTP | Which method, header, and status fit the action? [Computers Http Api Basics](01-computers-http-api-basics.md) |
| I | Idempotency | What happens if the client retries? [Rest Json And Http](02-rest-json-and-http.md) |
| J | JSON | How do programs exchange structured values? [Rest Json And Http](02-rest-json-and-http.md) |
| K | Keys | Which ID is stable, safe, and useful? [Database Sql Jdbc Oracle](09-database-sql-jdbc-oracle.md) |
| L | Layers | Which code owns HTTP, rules, and storage? [START HERE](00-START-HERE.md) |
| M | Methods | What does `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` mean? [Rest Json And Http](02-rest-json-and-http.md) |
| N | Naming | Can another person guess the route? [Rest Json And Http](02-rest-json-and-http.md) |
| O | OpenAPI | Can a tool and a human read the contract? [START HERE](00-START-HERE.md) |
| P | Pagination and permissions | How do we bound lists and protect records? [START HERE](00-START-HERE.md) |
| Q | Query parameters | How do we search, sort, and filter? [START HERE](00-START-HERE.md) |
| R | REST | When is a resource-oriented design useful? [Rest Json And Http](02-rest-json-and-http.md) |
| S | Security and status | Who may act and what happened? [Computers Http Api Basics](01-computers-http-api-basics.md) |
| T | Testing and transactions | How do we prove the promise? [Database Sql Jdbc Oracle](09-database-sql-jdbc-oracle.md) |
| U | URLs and untrusted input | Which strings need validation? [Computers Http Api Basics](01-computers-http-api-basics.md) |
| V | Versioning | How can the contract change without surprising clients? [START HERE](00-START-HERE.md) |
| W | Webhooks and writes | How do systems notify one another safely? [START HERE](00-START-HERE.md) |
| X | XML and external APIs | How do we adapt another format? [Testing Apis](11-testing-apis.md) |
| Y | YAML | How can an OpenAPI document stay readable? [START HERE](00-START-HERE.md) |
| Z | Zero-trust API | What must be checked at every boundary? [Java From Zero](03-java-from-zero.md) |



## Diagram library

- [client, DNS/TLS, API route, validation, service, database, response, and error branch](images/01-api-request-lifecycle.svg)
- [a schedule click traveling through React, REST, Spring, service, repository, and Oracle](images/02-tm-schedule-end-to-end-flow.svg)
- [controller, application rules, repository port, memory adapter, and SQL adapter](images/03-layered-api-architecture.svg)
- [local profile selecting memory and deployed profile selecting JDBC](images/04-profile-and-repository-selection.svg)
- [store, group, employee, schedule row, and status relationships](images/05-oracle-database-relationships.svg)
- [read request sequence with query parameters and response mapping](images/06-read-schedule-sequence.svg)
- [validation, transaction, insert, generated ID, and `201` response](images/07-create-schedule-row-sequence.svg)
- [malformed input, business error, database outage, and generic safe error paths](images/08-error-handling-flow.svg)
- [unit tests at the base, HTTP tests, integration tests, and browser tests at the top](images/09-testing-pyramid-for-this-application.svg)
- [source, Gradle checks, artifact, environment, health check, smoke test, and rollback](images/10-build-and-deployment-flow.svg)
- [Java language below Spring Boot, MVC, validation, data, and tests](images/11-java-and-spring-boot-concept-map.svg)
- [requirements leading to monolith, cache, queue, event, or service split](images/12-system-design-decision-map.svg)

## Sources and version record

HTTP semantics; educational contracts, not an audit of the unavailable TM Schedule repository. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://www.rfc-editor.org/rfc/rfc9110)

- [Official reference](https://spec.openapis.org/oas/v3.1.0.html)

## Portable specification

[Generation blueprint](16-api-design-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

