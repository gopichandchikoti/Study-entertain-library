# Spring Boot: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites


You should understand Java variables, methods, classes, records, interfaces,
exceptions, and collections. You should also know basic HTTP and JSON. You do
not need to know every Spring annotation before starting.

Use Java 17 or newer, Gradle, a terminal, and fake data. Do not put passwords,
production database details, or personal records in the course project.



## Reading order

1. [Learning Map](01-learning-map.md)
2. [Why Spring And Spring Boot History](02-why-spring-and-spring-boot-history.md)
3. [Create A Versioned Boot Project](03-create-a-versioned-boot-project.md)
4. [Startup Application Context And Auto Configuration](04-startup-application-context-and-auto-configuration.md)
5. [Beans Component Scanning And Lifecycle](05-beans-component-scanning-and-lifecycle.md)
6. [Dependency Injection And Configuration](06-dependency-injection-and-configuration.md)
7. [Properties Profiles And Secrets](07-properties-profiles-and-secrets.md)
8. [Spring Mvc Routing And Controllers](08-spring-mvc-routing-and-controllers.md)
9. [Request Binding Jackson And Json](09-request-binding-jackson-and-json.md)
10. [Validation And Boundary Rules](10-validation-and-boundary-rules.md)
11. [Services Domain Rules And Repositories](11-services-domain-rules-and-repositories.md)
12. [Jdbc Jpa And Persistence Choices](12-jdbc-jpa-and-persistence-choices.md)
13. [Transactions Locking And Idempotency](13-transactions-locking-and-idempotency.md)
14. [Problem Detail Errors And Exception Advice](14-problem-detail-errors-and-exception-advice.md)
15. [Spring Security Authentication And Authorization](15-spring-security-authentication-and-authorization.md)
16. [Database Migrations And Data Lifecycle](16-database-migrations-and-data-lifecycle.md)
17. [Spring Mvc Versus Webflux](17-spring-mvc-versus-webflux.md)
18. [Actuator Openapi And Health](18-actuator-openapi-and-health.md)
19. [Unit Web And Mockmvc Testing](19-unit-web-and-mockmvc-testing.md)
20. [Integration Tests And Testcontainers](20-integration-tests-and-testcontainers.md)
21. [Logging Metrics Tracing And Shutdown](21-logging-metrics-tracing-and-shutdown.md)
22. [Packaging Deployment And Rollback](22-packaging-deployment-and-rollback.md)
23. [Spring Architecture Patterns And Trade Offs](23-spring-architecture-patterns-and-trade-offs.md)
24. [Capstone Study Notes Api](24-capstone-study-notes-api.md)
25. [Glossary Practice And Checklist](25-glossary-practice-and-checklist.md)

## A-to-Z coverage map


| Letter | Topic | Question to answer |
| --- | --- | --- |
| A | Application context and auto-configuration | What does Boot create at startup? [Startup Application Context And Auto Configuration](04-startup-application-context-and-auto-configuration.md) |
| B | Beans and build files | Which objects are managed? [Beans Component Scanning And Lifecycle](05-beans-component-scanning-and-lifecycle.md) |
| C | Controllers and configuration | Who owns HTTP and settings? [Startup Application Context And Auto Configuration](04-startup-application-context-and-auto-configuration.md) |
| D | Dependency injection | How does a class receive its needs? [Dependency Injection And Configuration](06-dependency-injection-and-configuration.md) |
| E | Exceptions and environment | How are failures and values handled? [Properties Profiles And Secrets](07-properties-profiles-and-secrets.md) |
| F | Filters and profiles | Which request and configuration rules apply? [Beans Component Scanning And Lifecycle](05-beans-component-scanning-and-lifecycle.md) |
| G | Gradle and gateways | How is the app built and entered? [Create A Versioned Boot Project](03-create-a-versioned-boot-project.md) |
| H | HTTP and health | Is the process alive and ready? [Actuator Openapi And Health](18-actuator-openapi-and-health.md) |
| I | Inversion of control | Why does Spring create collaborators? [Why Spring And Spring Boot History](02-why-spring-and-spring-boot-history.md) |
| J | JDBC and JSON | How do Java objects meet data and wire formats? [Request Binding Jackson And Json](09-request-binding-jackson-and-json.md) |
| K | Kotlin awareness | What changes if a team uses Kotlin? [Learning Map](01-learning-map.md) |
| L | Logging and lifecycle | How do we see startup and shutdown? [Startup Application Context And Auto Configuration](04-startup-application-context-and-auto-configuration.md) |
| M | MVC and migrations | How are web layers and schema changes organized? [Database Migrations And Data Lifecycle](16-database-migrations-and-data-lifecycle.md) |
| N | `@RequestBody` and nulls | How is input bound and checked? [Request Binding Jackson And Json](09-request-binding-jackson-and-json.md) |
| O | OpenAPI and observability | How can humans and tools understand the API? [Actuator Openapi And Health](18-actuator-openapi-and-health.md) |
| P | Profiles, properties, and `ProblemDetail` | How do environments differ safely? [Properties Profiles And Secrets](07-properties-profiles-and-secrets.md) |
| Q | Queries and queues | Which work is direct and which is later? [Learning Map](01-learning-map.md) |
| R | Repositories and REST | Where does persistence stop? [Services Domain Rules And Repositories](11-services-domain-rules-and-repositories.md) |
| S | Services, security, and Spring context | Where do rules and permissions live? [Spring Security Authentication And Authorization](15-spring-security-authentication-and-authorization.md) |
| T | Transactions and testing | Which work commits together? [Transactions Locking And Idempotency](13-transactions-locking-and-idempotency.md) |
| U | URLs and untrusted input | What must be validated? [Spring Mvc Routing And Controllers](08-spring-mvc-routing-and-controllers.md) |
| V | Validation and versioning | How do contracts evolve? [Validation And Boundary Rules](10-validation-and-boundary-rules.md) |
| W | WebFlux versus MVC | Which web model fits the workload? [Spring Mvc Versus Webflux](17-spring-mvc-versus-webflux.md) |
| X | XML and external configuration | How do older systems integrate? [Startup Application Context And Auto Configuration](04-startup-application-context-and-auto-configuration.md) |
| Y | YAML and your deployment | Where do runtime values come from? [Properties Profiles And Secrets](07-properties-profiles-and-secrets.md) |
| Z | Zero-downtime thinking | What happens during a release? [Learning Map](01-learning-map.md) |



## Diagram library

- [main class, context, component scan, auto-configuration, embedded server](images/spring-boot-startup-context.svg)
- [controller, service, repository beans and constructor injection](images/spring-boot-bean-injection.svg)
- [HTTP request, DispatcherServlet, binding, controller, service, response](images/spring-mvc-request-flow.svg)
- [properties, environment, profile selection, beans, and secret boundary](images/spring-boot-config-profiles.svg)
- [request body, validation, service rule, advice, and safe error](images/spring-validation-error-flow.svg)
- [DTO, service, repository, JDBC/JPA adapter, database](images/spring-repository-data-boundary.svg)
- [transaction, business row, outbox row, worker, and event](images/spring-transaction-outbox.svg)
- [request, security filters, identity, authorization, controller, denial](images/spring-security-filter-boundary.svg)
- [health, metrics, logs, traces, dependency readiness, operator](images/spring-actuator-observability.svg)
- [unit, web slice, integration, Testcontainers, and end-to-end tests](images/spring-testing-layers.svg)
- [build, artifact, environment, deploy, health, smoke, rollback](images/spring-deployment-health.svg)
- [blocking MVC path versus non-blocking reactive path and data driver choice](images/spring-mvc-vs-webflux.svg)

## Sources and version record

Java 17; runnable project pins Spring Boot 3.1.3 for the supplied course baseline. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://docs.spring.io/spring-boot/index.html)

## Portable specification

[Generation blueprint](00-spring-boot-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

