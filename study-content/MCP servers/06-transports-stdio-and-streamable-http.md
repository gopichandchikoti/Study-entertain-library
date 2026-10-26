# Transports Stdio And Streamable Http

## The big idea in plain words {#picture}

A transport is the road; JSON-RPC is the language spoken by travelers on it.

## What you will be able to do {#outcomes}

Read this after the previous numbered lesson. Use synthetic notes and local exercise data. By the end you should explain the following scope without copying:

Local stdio, remote Streamable HTTP, framing, stdout/stderr, TLS, streaming, reconnects, and limits.

## Words to know {#vocabulary}

- **stdio**: a process input/output message channel.

- **StreamableHTTP**: an HTTP transport for MCP request/response and optional streaming.

- **framing**: rules separating complete messages.

## Why this idea exists {#history}

Local pipes and remote HTTP have different security and lifecycle needs. The same capability contracts can work over either when framing, authentication, and limits are explicit.

## Concept 1 {#concept-1}

stdio means a process input/output message channel. Stdio protocol messages go to stdout while logs go to stderr.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 2 {#concept-2}

Remote HTTP requires intentional authentication and TLS.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 3 {#concept-3}

Connection loss needs bounded reconnect behavior.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 4 {#concept-4}

An HTTP token does not grant unlimited downstream access.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Going deeper: the technical walkthrough {#walkthrough}

### Transports


### Stdio

The host launches a local server process and exchanges messages over standard
input and output. Logs go to standard error, never standard output, because
standard output is the message channel.

### Streamable HTTP

A remote server accepts HTTP requests, may stream progress, and normally needs
TLS, authentication, rate limits, and origin policy. It must handle connection
loss and repeated requests.

Choose stdio for a local single-user tool. Choose HTTP when a remote service,
multiple clients, or independent deployment is a real requirement.



## Worked scenario {#worked-scenario}

A local stdio server writes a debug banner before its JSON message. What should change?

The justified choice is **Move diagnostics to stderr**. Select **stderr-logs** in the structured practical and explain why. Alternatives ignore a requirement, cross a trust boundary, or invent success.

### Structured decision contract

```json

{
  "decision": "stderr-logs",
  "justification": "The stdio and StreamableHTTP boundary must preserve the declared contract and ownership.",
  "failureBehavior": "Expose a safe failure and recover through the boundary owner."
}

```

Decision selects one declared behavior. Justification explains the boundary. FailureBehavior explains the observable error and recovery owner. These fields never execute commands. Required terms and minimum lengths form a basic practice rubric, not semantic grading.

## Step-by-step flow and matching picture {#flow}

```mermaid
flowchart LR
    N0["host process"]
    N1["stdin"]
    N2["stdout message channel"]
    N3["stderr logs"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
```

![host process, stdin, stdout message channel, and stderr logs](images/mcp-stdio-transport.svg)

```mermaid
flowchart LR
    N0["HTTPS POST"]
    N1["optional stream"]
    N2["token"]
    N3["timeout"]
    N4["reconnect"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

![HTTPS POST, optional stream, token, timeout, and reconnect](images/mcp-streamable-http-transport.svg)

## Three real-life uses {#use-cases}

1. A personal learner applies this rule to one synthetic note and checks the result.
2. A team changes the boundary while preserving its shared request and response contract.
3. A deployed library handles concurrent requests and reports failures through safe errors and correlated signals.

## What can go wrong, and how to stay safe {#failure-security}

Frame sizes and timeouts must be bounded. An external dependency needs an owner, size limit, deadline, cleanup, and recovery path. Return a stable error code rather than raw exceptions. Redact credentials and private bodies in diagnostics.

The abstraction improves stdio reasoning but adds configuration and lifecycle work. Keep a simpler implementation when it meets the requirement. Measure the limiting resource before adding services, queues, or caches.

## Practice lab and expected observation {#practice}

1. Predict the scenario decision before opening Practical. Explain each rejected alternative.
2. Run a relevant example above in an isolated exercise project. Record the expected result, then change one input to an invalid or boundary value. A failed assertion or deliberate error should replace silent success.
3. Submit the structured decision. Initially the checks fail. After selecting stderr-logs and writing an explanation and failure plan, all three pass. Follow the indicated review section for missed checks.

### Broken example to debug

```json

{"decision":"trust-client","justification":"","failureBehavior":""}

```

This ignores the responsible boundary and gives no reasoning or recovery. Correct the fields rather than changing the validator.

## Checkpoint and definition of done {#checkpoint}

- [ ] Define stdio and StreamableHTTP without looking.
- [ ] Trace input to owner and output.
- [ ] Explain one failure and one alternative.
- [ ] Pass at least four assignment questions.
- [ ] Pass every practical check and submit.
- [ ] Explain the concept again tomorrow.

## Sources, versions, and safe commands {#sources}

MCP revision 2026-07-28; initialization-based revision 2025-11-25 is discussed separately. Review date: 2026-10-02. The supplied blueprint is the teaching source; official landing pages were checked where reachable. No provider or original TM Schedule deployment was tested.

- [Official reference](https://modelcontextprotocol.io/specification/2026-07-28)

- [Official reference](https://www.jsonrpc.org/specification)

[Course reading order](README.md) · [Previous lesson](05-state-and-stateless-design.md) · [Next lesson](07-tools.md)

```study-quiz

{
  "schemaVersion": 1,
  "lessonId": "mcp/06-transports-stdio-and-streamable-http",
  "title": "Assignment: Transports Stdio And Streamable Http",
  "passPercentage": 80,
  "questions": [
    {
      "id": "q1",
      "sectionId": "concept-1",
      "prompt": "In Transports Stdio And Streamable Http, what does stdio mean?",
      "options": [
        {
          "id": "a",
          "text": "A permission granted by a hidden browser control",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "An unlimited provider operation with no ownership",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "a process input/output message channel",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "d",
          "text": "A diagnostic credential intended for public logs",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "c",
      "explanation": "stdio means a process input/output message channel.",
      "reviewLabel": "Review concept 1"
    },
    {
      "id": "q2",
      "sectionId": "concept-2",
      "prompt": "In Transports Stdio And Streamable Http, which rule is correct for checkpoint 2?",
      "options": [
        {
          "id": "a",
          "text": "Trust client-side checks instead of the server rule.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "Hide the failure by returning a fabricated successful result.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "Skip the stated boundary, limit, or ownership check.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "d",
          "text": "Remote HTTP requires intentional authentication and TLS.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        }
      ],
      "correctOptionId": "d",
      "explanation": "Remote HTTP requires intentional authentication and TLS.",
      "reviewLabel": "Review concept 2"
    },
    {
      "id": "q3",
      "sectionId": "concept-3",
      "prompt": "In Transports Stdio And Streamable Http, which rule is correct for checkpoint 3?",
      "options": [
        {
          "id": "a",
          "text": "Connection loss needs bounded reconnect behavior.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "b",
          "text": "Trust client-side checks instead of the server rule.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "Hide the failure by returning a fabricated successful result.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "d",
          "text": "Skip the stated boundary, limit, or ownership check.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "a",
      "explanation": "Connection loss needs bounded reconnect behavior.",
      "reviewLabel": "Review concept 3"
    },
    {
      "id": "q4",
      "sectionId": "concept-4",
      "prompt": "In Transports Stdio And Streamable Http, which rule is correct for checkpoint 4?",
      "options": [
        {
          "id": "a",
          "text": "Trust client-side checks instead of the server rule.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "An HTTP token does not grant unlimited downstream access.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "c",
          "text": "Hide the failure by returning a fabricated successful result.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "d",
          "text": "Skip the stated boundary, limit, or ownership check.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "b",
      "explanation": "An HTTP token does not grant unlimited downstream access.",
      "reviewLabel": "Review concept 4"
    },
    {
      "id": "q5",
      "sectionId": "worked-scenario",
      "prompt": "A local stdio server writes a debug banner before its JSON message. What should change?",
      "options": [
        {
          "id": "a",
          "text": "Make the banner longer",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "Add a private token to the banner",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "Move diagnostics to stderr",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "d",
          "text": "Disable message validation",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "c",
      "explanation": "Move diagnostics to stderr. Frame sizes and timeouts must be bounded.",
      "reviewLabel": "Review the worked scenario"
    }
  ]
}

```

```study-practical

{
  "schemaVersion": 1,
  "challengeId": "mcp/06-transports-stdio-and-streamable-http/decision",
  "lessonId": "mcp/06-transports-stdio-and-streamable-http",
  "title": "Practical: Transports Stdio And Streamable Http",
  "language": "json",
  "mode": "structured",
  "instructions": "A local stdio server writes a debug banner before its JSON message. What should change? Return an object with decision (choose from stderr-logs, skip-check, unbounded-work, trust-client), justification (at least 40 characters; include stdio and StreamableHTTP), and failureBehavior (at least 25 characters; include failure and recover while explaining the error and recovery). These are structured reasoning checks, not code execution or an official grade.",
  "starterCode": "{\n  \"decision\": \"\",\n  \"justification\": \"\",\n  \"failureBehavior\": \"\"\n}",
  "entryPoint": "answer",
  "publicExamples": [
    {
      "input": {
        "decision": "skip-check",
        "justification": "",
        "failureBehavior": ""
      },
      "expected": {
        "passed": false
      }
    },
    {
      "input": {
        "decision": "stderr-logs",
        "justification": "The stdio and StreamableHTTP boundary must preserve the declared contract and ownership.",
        "failureBehavior": "Show a safe failure and recover through the responsible owner."
      },
      "expected": {
        "passed": true
      }
    }
  ],
  "publicTestIds": [
    "decision",
    "explanation",
    "failure-plan"
  ],
  "reviewSections": {
    "decision": "worked-scenario",
    "explanation": "concept-2",
    "failure-plan": "failure-security"
  },
  "limits": {
    "timeMs": 2000,
    "memoryMb": 128,
    "outputBytes": 20000
  }
}

```

