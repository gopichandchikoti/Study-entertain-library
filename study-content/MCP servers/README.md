# MCP servers: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites

Basic terminal and JSON familiarity. Use synthetic data and an isolated exercise project.

## Reading order

1. [Learning Map](00-learning-map.md)
2. [Mcp In One Picture](01-mcp-in-one-picture.md)
3. [People Programs And Roles](02-people-programs-and-roles.md)
4. [Json Rpc Messages](03-json-rpc-messages.md)
5. [Lifecycle Discovery And Capabilities](04-lifecycle-discovery-and-capabilities.md)
6. [State And Stateless Design](05-state-and-stateless-design.md)
7. [Transports Stdio And Streamable Http](06-transports-stdio-and-streamable-http.md)
8. [Tools](07-tools.md)
9. [Resources And Prompts](08-resources-and-prompts.md)
10. [Client Features Elicitation Roots And Sampling](09-client-features-elicitation-roots-and-sampling.md)
11. [Multi Round Work Progress Cancellation And Subscriptions](10-multi-round-work-progress-cancellation-and-subscriptions.md)
12. [Authentication Authorization And Oauth](11-authentication-authorization-and-oauth.md)
13. [Security And Trust Boundaries](12-security-and-trust-boundaries.md)
14. [Errors Testing And Observability](13-errors-testing-and-observability.md)
15. [Build An Mcp Server](14-build-an-mcp-server.md)
16. [Build An Mcp Client And Host](15-build-an-mcp-client-and-host.md)
17. [End To End Tm Schedule Example](16-end-to-end-tm-schedule-example.md)
18. [Deployment And Operations](17-deployment-and-operations.md)
19. [Architecture Cookbook And Decision Guide](18-architecture-cookbook-and-decision-guide.md)
20. [Glossary Checklists And Practice](19-glossary-checklists-and-practice.md)
21. [Sources And Version Notes](20-sources-and-version-notes.md)
22. [Advanced Utilities And Extension Map](21-advanced-utilities-and-extension-map.md)

## A-to-Z coverage map


| Letter | Topic | Question to answer |
| --- | --- | --- |
| A | Authorization and approval | Who may use which capability? [People Programs And Roles](02-people-programs-and-roles.md) |
| B | Boundaries | Where can data or actions cross? [Security And Trust Boundaries](12-security-and-trust-boundaries.md) |
| C | Capabilities and cancellation | What can each side do, and how does work stop? [Lifecycle Discovery And Capabilities](04-lifecycle-discovery-and-capabilities.md) |
| D | Discovery and data | How do clients learn what exists? [Lifecycle Discovery And Capabilities](04-lifecycle-discovery-and-capabilities.md) |
| E | Elicitation and errors | How does the server ask for safe input and report failure? [Json Rpc Messages](03-json-rpc-messages.md) |
| F | Features | What can tools, resources, and prompts represent? [Client Features Elicitation Roots And Sampling](09-client-features-elicitation-roots-and-sampling.md) |
| G | Governance | Who owns the data and the server? [Learning Map](00-learning-map.md) |
| H | Host | Why is the host different from the client? [Mcp In One Picture](01-mcp-in-one-picture.md) |
| I | Initialize and identity | How are old sessions and callers identified? [People Programs And Roles](02-people-programs-and-roles.md) |
| J | JSON-RPC | What message grammar is used? [Json Rpc Messages](03-json-rpc-messages.md) |
| K | Keys and scopes | Which credentials and permissions are needed? [Authentication Authorization And Oauth](11-authentication-authorization-and-oauth.md) |
| L | Lifecycle and logs | What happens from start to shutdown? [Lifecycle Discovery And Capabilities](04-lifecycle-discovery-and-capabilities.md) |
| M | MCP metadata | What does modern per-request context mean? [Lifecycle Discovery And Capabilities](04-lifecycle-discovery-and-capabilities.md) |
| N | Notifications | When is there no response to send? [Json Rpc Messages](03-json-rpc-messages.md) |
| O | OAuth | How does a remote server protect HTTP access? [Authentication Authorization And Oauth](11-authentication-authorization-and-oauth.md) |
| P | Prompts and progress | Who selects a prompt, and how is work reported? [Resources And Prompts](08-resources-and-prompts.md) |
| Q | Questions and quotas | How do we bound expensive requests? [Glossary Checklists And Practice](19-glossary-checklists-and-practice.md) |
| R | Resources and roots | What context may the client choose or expose? [Resources And Prompts](08-resources-and-prompts.md) |
| S | Sampling and security | How can a server ask the host for model help safely? [Client Features Elicitation Roots And Sampling](09-client-features-elicitation-roots-and-sampling.md) |
| T | Tools and tasks | Which actions are allowed, and how does long work continue? [Tools](07-tools.md) |
| U | User consent | Where can a human approve a risky action? [Client Features Elicitation Roots And Sampling](09-client-features-elicitation-roots-and-sampling.md) |
| V | Versioning | How do incompatible clients and servers behave? [Learning Map](00-learning-map.md) |
| W | Workflows and webhooks | How does multi-step work stay understandable? [Learning Map](00-learning-map.md) |
| X | eXtension discipline | How do custom features avoid breaking the core? [Advanced Utilities And Extension Map](21-advanced-utilities-and-extension-map.md) |
| Y | Yield and backpressure | What happens when work is too fast or too large? [Learning Map](00-learning-map.md) |
| Z | Zero-trust adapter | What must be checked even inside a private network? [Authentication Authorization And Oauth](11-authentication-authorization-and-oauth.md) |



## Diagram library

- [user, host, model, client, server, and data source](images/mcp-big-picture-host-client-server.svg)
- [one host connected to several local and remote servers](images/mcp-roles-and-connections.svg)
- [request ID, parameters, response, error, and notification](images/mcp-json-rpc-request-response.svg)
- [per-request metadata beside legacy initialization/session state](images/mcp-modern-stateless-vs-legacy-stateful.svg)
- [discovery, capability check, operation, and shutdown](images/mcp-lifecycle-versioning-and-capabilities.svg)
- [protocol, connection, request, application, user, and workflow state](images/mcp-state-layers.svg)
- [host process, stdin, stdout message channel, and stderr logs](images/mcp-stdio-transport.svg)
- [HTTPS POST, optional stream, token, timeout, and reconnect](images/mcp-streamable-http-transport.svg)
- [list tools, model suggestion, human approval, call, and result](images/mcp-tools-discovery-and-call.svg)
- [application-selected resource and user-selected prompt paths](images/mcp-resources-and-prompts.svg)
- [server asks, host asks user, user answers or declines, server continues](images/mcp-elicitation-multi-round-trip.svg)
- [task creation, progress, cancel/poll, completion, failure, and result](images/mcp-long-running-task-flow.svg)
- [browser, host, authorization server, token, and protected MCP server](images/mcp-authentication-oauth-flow.svg)
- [user consent, host, server, downstream API, private data, and audit](images/mcp-security-trust-boundaries.svg)
- [test, request, logs, metrics, traces, alert, and repair loop](images/mcp-observability-testing-loop.svg)
- [question, tool, schedule API, authorization, result, and approval](images/mcp-tm-schedule-end-to-end.svg)
- [local, remote, task, gateway, or extension decision branches](images/mcp-architecture-decision-tree.svg)

## Sources and version record

MCP revision 2026-07-28; initialization-based revision 2025-11-25 is discussed separately. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://modelcontextprotocol.io/specification/2026-07-28)

- [Official reference](https://www.jsonrpc.org/specification)

## Portable specification

[Generation blueprint](22-mcp-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

