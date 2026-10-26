# API Designs Textbook

A beginner-friendly course for learning Java, Spring Boot, REST APIs, testing, databases, and system design by studying the real TM Schedule - Recovery Areas application.

This is written for a reader who knows little or nothing about backend development. It starts with the words and pictures, then slowly moves into source code and architecture decisions.

## What you will learn

By the end, you should be able to:

- Explain what a client, server, API, HTTP request, response, database, and deployment are.
- Read Java code and understand classes, records, interfaces, collections, exceptions, streams, and dependency injection.
- Build a small REST API with Spring Boot.
- Design request and response JSON contracts.
- Validate input and return useful errors without leaking secrets.
- Store data safely with SQL and parameterized JDBC.
- Write unit, controller, integration, and end-to-end tests.
- Choose an architecture and design pattern based on a real use case.
- Trace one click in the React UI all the way to Oracle and back.
- Explain exactly how every API in TM Schedule works today.

## Start here

Read in this order:

1. [00 - Start Here](00-START-HERE.md)
2. [01 - Computer, Network, HTTP, and API Basics](01-computers-http-api-basics.md)
3. [02 - REST, JSON, and HTTP Contracts](02-rest-json-and-http.md)
4. [03 - Java From Zero](03-java-from-zero.md)
5. [04 - Java OOP and Modern Java](04-java-oop-and-modern-java.md)
6. [05 - Spring Boot From Zero](05-spring-boot-from-zero.md)
7. [06 - TM Schedule Architecture](06-tm-schedule-architecture.md)
8. [07 - Folder Structure and Domain Model](07-folder-structure-and-domain-model.md)
9. [TM Schedule API By API](TM-SCHEDULE-API-BY-API.md)
10. [09 - Database, SQL, JDBC, and Oracle](09-database-sql-jdbc-oracle.md)
11. [10 - Validation, Errors, Security, and Reliability](10-validation-errors-security.md)
12. [11 - Testing APIs](11-testing-apis.md)
13. [12 - System Design and Design Patterns](12-system-design-and-design-patterns.md)
14. [13 - Application Development Blueprint](13-application-development-blueprint.md)
15. [14 - Practice Labs](14-practice-labs.md)
16. [15 - Glossary and Cheat Sheets](15-glossary-and-cheat-sheets.md)
17. [16 - API Design Course Blueprint](16-api-design-course-blueprint.md)

The final blueprint is the broad reference. The API-by-API file is the detailed reference for this application.

## Diagram library

All diagrams are in the `images` folder. The filenames intentionally say what each image explains.

- [01 API request lifecycle](images/01-api-request-lifecycle.svg)
- [02 TM Schedule end-to-end flow](images/02-tm-schedule-end-to-end-flow.svg)
- [03 layered API architecture](images/03-layered-api-architecture.svg)
- [04 profile and repository selection](images/04-profile-and-repository-selection.svg)
- [05 Oracle database relationships](images/05-oracle-database-relationships.svg)
- [06 read schedule sequence](images/06-read-schedule-sequence.svg)
- [07 create schedule row sequence](images/07-create-schedule-row-sequence.svg)
- [08 error handling flow](images/08-error-handling-flow.svg)
- [09 testing pyramid for this application](images/09-testing-pyramid-for-this-application.svg)
- [10 build and deployment flow](images/10-build-and-deployment-flow.svg)
- [11 Java and Spring Boot concept map](images/11-java-and-spring-boot-concept-map.svg)
- [12 system design decision map](images/12-system-design-decision-map.svg)

The Markdown files also contain Mermaid flowcharts. The SVG files are standalone images that can be opened in a browser or inserted into other documents.

## The real applications

The source repositories studied by this textbook are:

- API: `/Users/gchikoti/Documents/Barn new apps/TM-Schedule/TM-schedule-API`
- UI: `/Users/gchikoti/Documents/Barn new apps/TM-Schedule/TM-schedule-UI`

The API is Java 17 and Spring Boot 3.1.3. The UI is React 19, TypeScript, Redux Toolkit Query, Webpack 5, and Module Federation.

## Safe local commands

API, from the API repository:

```bash
bash ./gradlew test
bash ./gradlew jacocoTestCoverageVerification
bash ./gradlew clean test bootWar
```

UI, from the UI repository:

```bash
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build:dev
pnpm build:prod
```

Local API health check:

```bash
curl -i http://localhost:8080/tm-schedule/actuator/health
```

Do not place database passwords, tokens, or production data in these notes or shell history.

## A note about "perfect"

Backend development is not memorizing every framework feature. It is practicing a repeatable loop:

1. Understand the user problem.
2. Draw the data and request flow.
3. Define a small contract.
4. Implement one vertical slice.
5. Test the happy path and the failure paths.
6. Observe the running system.
7. Improve the design when real evidence says it needs improvement.

Use the labs and explain each topic out loud in your own words. That is how knowledge becomes usable.
