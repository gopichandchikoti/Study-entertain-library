# System Design: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites


This course is for a beginner who can read a simple API description. By the
end you can:

- separate functional and quality requirements;
- estimate traffic, storage, bandwidth, latency, and availability;
- draw a request and data flow;
- choose APIs, databases, caches, queues, workers, and replicas deliberately;
- reason about consistency, transactions, retries, and idempotency;
- design security, observability, deployment, backups, and recovery;
- review trade-offs and explain a design in an interview or design document.



## Reading order

1. [Learning Map](00-learning-map.md)
2. [System Design Foundations](01-system-design-foundations.md)
3. [Requirements And Capacity Estimation](02-requirements-and-capacity-estimation.md)
4. [Architecture Building Blocks](03-architecture-building-blocks.md)
5. [Networking And Web Requests](04-networking-and-web-requests.md)
6. [Load Balancers Cdns And Api Gateways](04a-load-balancers-cdns-and-api-gateways.md)
7. [Apis And Contracts](05-apis-and-contracts.md)
8. [Rate Limiting And Fair Sharing](05a-rate-limiting-and-fair-sharing.md)
9. [Data Modeling And Databases](06-data-modeling-and-databases.md)
10. [Search And Indexing Explained](06a-search-and-indexing-explained.md)
11. [Caching](07-caching.md)
12. [Queues Events And Background Work](08-queues-events-and-background-work.md)
13. [Consistency Transactions And Distributed Data](09-consistency-transactions-and-distributed-data.md)
14. [Cap Theorem And Picking Sides](09a-cap-theorem-and-picking-sides.md)
15. [Scaling And Partitioning](10-scaling-and-partitioning.md)
16. [Unique Ids And Consistent Hashing](10a-unique-ids-and-consistent-hashing.md)
17. [Reliability And Failure Handling](11-reliability-and-failure-handling.md)
18. [Security And Privacy](12-security-and-privacy.md)
19. [Observability And Operations](13-observability-and-operations.md)
20. [Deployment Cloud And Disaster Recovery](14-deployment-cloud-and-disaster-recovery.md)
21. [Common Architecture Patterns](15-common-architecture-patterns.md)
22. [Design Interview And Review Method](16-design-interview-and-review-method.md)
23. [Tm Schedule End To End Case Study](17-tm-schedule-end-to-end-case-study.md)
24. [Application Architecture Cookbook And Decision Guide](18-application-architecture-cookbook-and-decision-guide.md)
25. [Design A Url Shortener Step By Step](18a-design-a-url-shortener-step-by-step.md)
26. [Design A Chat App Step By Step](18b-design-a-chat-app-step-by-step.md)
27. [Glossary Checklists And Practice Answers](19-glossary-checklists-and-practice-answers.md)

## A-to-Z coverage map


| Letter | Topic | Question to answer |
| --- | --- | --- |
| A | Availability and architecture | How often must the service work? [Requirements And Capacity Estimation](02-requirements-and-capacity-estimation.md) |
| B | Bottlenecks and backups | What fills first, and how do we recover? [Scaling And Partitioning](10-scaling-and-partitioning.md) |
| C | Capacity and caching | How much work and reuse exist? [Requirements And Capacity Estimation](02-requirements-and-capacity-estimation.md) |
| D | Data modeling and disaster recovery | What is authoritative and how is it restored? [Data Modeling And Databases](06-data-modeling-and-databases.md) |
| E | Events and estimation | What can happen later, and what are the numbers? [Requirements And Capacity Estimation](02-requirements-and-capacity-estimation.md) |
| F | Failure modes and fan-out | What breaks and how many dependencies are called? [Caching](07-caching.md) |
| G | Gateways and graceful degradation | Where is the edge and what can be reduced? [Reliability And Failure Handling](11-reliability-and-failure-handling.md) |
| H | Health and horizontal scaling | How do we detect and add instances? [Scaling And Partitioning](10-scaling-and-partitioning.md) |
| I | Indexes and idempotency | How do reads stay fast and writes safe? [Apis And Contracts](05-apis-and-contracts.md) |
| J | Jobs | Which work belongs to a worker? [Learning Map](00-learning-map.md) |
| K | Keys and queues | What identifies data and waits for capacity? [Architecture Building Blocks](03-architecture-building-blocks.md) |
| L | Latency and load balancing | How is time divided and traffic shared? [Requirements And Capacity Estimation](02-requirements-and-capacity-estimation.md) |
| M | Metrics and multi-region | What do we measure and where can the service run? [Observability And Operations](13-observability-and-operations.md) |
| N | Networking and normalization | How do requests travel and data stay clear? [Networking And Web Requests](04-networking-and-web-requests.md) |
| O | Observability and ownership | Who sees a failure and who fixes it? [Observability And Operations](13-observability-and-operations.md) |
| P | Partitioning and privacy | How can data be split and protected? [Scaling And Partitioning](10-scaling-and-partitioning.md) |
| Q | Queues and quotas | How do we control bursts and expensive work? [Architecture Building Blocks](03-architecture-building-blocks.md) |
| R | Reliability and replication | How do we survive a failed component? [Scaling And Partitioning](10-scaling-and-partitioning.md) |
| S | Security, sharding, and consistency | What is protected and what can be stale? [Consistency Transactions And Distributed Data](09-consistency-transactions-and-distributed-data.md) |
| T | Transactions and timeouts | What commits together and how long may it wait? [Networking And Web Requests](04-networking-and-web-requests.md) |
| U | Users and use cases | What does a person need to do? [Learning Map](00-learning-map.md) |
| V | Versioning and validation | How do components change safely? [Apis And Contracts](05-apis-and-contracts.md) |
| W | Workers and web requests | Which path is synchronous? [Architecture Building Blocks](03-architecture-building-blocks.md) |
| X | eXternal dependencies | What happens when another service is slow? [Learning Map](00-learning-map.md) |
| Y | Yield and recovery objectives | When should the system shed work? [Reliability And Failure Handling](11-reliability-and-failure-handling.md) |
| Z | Zero-trust boundaries | What must be checked at every hop? [Learning Map](00-learning-map.md) |



## Diagram library

- [user, edge, API, data, queue, worker, and signals](images/system-design-big-picture-request-flow.svg)
- [user jobs to requirements, numbers, components, and trade-offs](images/system-design-requirements-to-architecture.svg)
- [DNS, TLS, gateway, load balancer, API, cache, and database](images/system-design-browser-to-api-request.svg)
- [presentation, application, domain, persistence, and infrastructure](images/system-design-api-layered-architecture.svg)
- [workload questions leading to relational, key-value, document, search, or object storage](images/system-design-database-choice-map.svg)
- [cache hit, miss, database read, fill, write, and invalidation](images/system-design-cache-aside-flow.svg)
- [command, queue, worker, progress, result, retry, and dead letter](images/system-design-async-job-queue-flow.svg)
- [timeout, safe retry, backoff, circuit breaker, and fallback](images/system-design-reliable-request-flow.svg)
- [primary, replicas, partition keys, routing, lag, and failover](images/system-design-sharding-and-replication.svg)
- [browser, gateway, API, database, object store, worker, and trust checks](images/system-design-security-boundaries.svg)
- [request ID producing logs, metrics, traces, alerts, and an incident](images/system-design-observability-three-pillars.svg)
- [build, deploy, health, backup, restore, region failure, and rollback](images/system-design-deployment-and-disaster-recovery.svg)
- [complete schedule read/write path and failure branches](images/system-design-tm-schedule-e2e.svg)
- [requirement questions leading to the smallest suitable architecture](images/system-design-architecture-decision-tree.svg)
- [The gateway checks every request, the load balancer shares the work between app copies, and the CDN keeps copies of files near the visitor so they arrive fast.](images/system-design-load-balancer-cdn-gateway.svg)
- [Every request spends a token. Tokens refill slowly. A quick burst is allowed, but nobody can take more than their fair share for long.](images/system-design-rate-limiter-token-bucket.svg)
- [Instead of reading every note for each search, we build an index in advance, like the index in the back of a book. Then a search is just a quick lookup.](images/system-design-search-inverted-index.svg)
- [If two copies cannot talk, we must pick: stay correct and say 'wait', or keep answering and fix differences later. Pick by feature: money must be exact, likes can be a little old.](images/system-design-cap-choice.svg)
- [Machines and keys are placed on a circle. A key belongs to the first machine you meet clockwise. When a machine is added, only the keys next to it move, not everything.](images/system-design-consistent-hashing-ring.svg)
- [Creating a link saves it in the database. Opening a link checks the cache first, because most traffic is opening, and then redirects the visitor to the long address.](images/system-design-url-shortener-flow.svg)
- [The message is saved first so it is never lost. Online friends get it through their open connection. Offline friends get a push notification and fetch it when they return.](images/system-design-chat-message-flow.svg)

## Sources and version record

Workload figures are assumptions until measured. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://www.postgresql.org/docs/current/)

- [Official reference](https://opentelemetry.io/docs/)

## Portable specification

[Generation blueprint](20-system-design-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

