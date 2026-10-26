# Lifecycle Discovery And Capabilities

## The big idea in plain words {#picture}

Capabilities are a menu: do not order a dish that this server does not serve.

## What you will be able to do {#outcomes}

Read this after the previous numbered lesson. Use synthetic notes and local exercise data. By the end you should explain the following scope without copying:

Modern metadata, legacy initialize, version negotiation, capability discovery, shutdown, and compatibility.

## Words to know {#vocabulary}

- **capability**: a supported protocol feature.

- **negotiation**: agreeing on compatible behavior.

- **metadata**: context accompanying a request.

## Why this idea exists {#history}

Protocol revisions differ. Older initialization-based connections and newer self-contained requests cannot be assumed interchangeable without an explicit compatibility plan.

## Concept 1 {#concept-1}

capability means a supported protocol feature. Pin the protocol revision used by a client and server.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 2 {#concept-2}

Check a capability before invoking an optional feature.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 3 {#concept-3}

Legacy initialization and modern request metadata are different models.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 4 {#concept-4}

Stateless protocol requests can still access persistent application state.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Going deeper: the technical walkthrough {#walkthrough}

### Lifecycle and capability discovery


Older clients may begin with `initialize`, negotiate a protocol version, and
exchange capabilities. Modern requests carry required context explicitly. In
both cases, a client and server need a compatibility plan.

Capabilities should be narrow. A server that exposes one read tool does not
need to claim it can write files, sample models, or subscribe to every event.
Reject unsupported versions with a clear error and record the selected version.



### Focused implementation

Pin the wire revision. The supplied course targets 2026-07-28 self-contained requests with per-request capabilities. The 2025-11-25 initialization handshake is a different path; do not combine the models by guesswork. Unsupported features need a supported fallback or a safe rejection. Optional extensions require explicit support checks.

```json

{ "exercise": "compatibility-plan", "modernRevision": "2026-07-28", "legacyRevision": "2025-11-25", "unsupportedFeature": "reject-or-supported-fallback" }

```

Read the imports, then the values and checks, then the operation, and finally the result or cleanup. Java Example programs compile as Example.java. Python uses Python 3.11+. JavaScript ESM runs as example.mjs. Framework snippets run inside the generated project.

## Worked scenario {#worked-scenario}

A client does not advertise an optional feature. Choose the server behavior.

The justified choice is **Do not invoke it; use a supported path or safe error**. Select **respect-capability** in the structured practical and explain why. Alternatives ignore a requirement, cross a trust boundary, or invent success.

### Structured decision contract

```json

{
  "decision": "respect-capability",
  "justification": "The capability and negotiation boundary must preserve the declared contract and ownership.",
  "failureBehavior": "Expose a safe failure and recover through the boundary owner."
}

```

Decision selects one declared behavior. Justification explains the boundary. FailureBehavior explains the observable error and recovery owner. These fields never execute commands. Required terms and minimum lengths form a basic practice rubric, not semantic grading.

## Step-by-step flow and matching picture {#flow}

```mermaid
flowchart LR
    N0["per-request metadata beside legacy initialization/session state"]
```

![per-request metadata beside legacy initialization/session state](images/mcp-modern-stateless-vs-legacy-stateful.svg)

```mermaid
flowchart LR
    N0["discovery"]
    N1["capability check"]
    N2["operation"]
    N3["shutdown"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
```

![discovery, capability check, operation, and shutdown](images/mcp-lifecycle-versioning-and-capabilities.svg)

## Three real-life uses {#use-cases}

1. A personal learner applies this rule to one synthetic note and checks the result.
2. A team changes the boundary while preserving its shared request and response contract.
3. A deployed library handles concurrent requests and reports failures through safe errors and correlated signals.

## What can go wrong, and how to stay safe {#failure-security}

Reject unsupported versions rather than guessing. An external dependency needs an owner, size limit, deadline, cleanup, and recovery path. Return a stable error code rather than raw exceptions. Redact credentials and private bodies in diagnostics.

The abstraction improves capability reasoning but adds configuration and lifecycle work. Keep a simpler implementation when it meets the requirement. Measure the limiting resource before adding services, queues, or caches.

## Practice lab and expected observation {#practice}

1. Predict the scenario decision before opening Practical. Explain each rejected alternative.
2. Run a relevant example above in an isolated exercise project. Record the expected result, then change one input to an invalid or boundary value. A failed assertion or deliberate error should replace silent success.
3. Submit the structured decision. Initially the checks fail. After selecting respect-capability and writing an explanation and failure plan, all three pass. Follow the indicated review section for missed checks.

### Broken example to debug

```json

{"decision":"trust-client","justification":"","failureBehavior":""}

```

This ignores the responsible boundary and gives no reasoning or recovery. Correct the fields rather than changing the validator.

## Checkpoint and definition of done {#checkpoint}

- [ ] Define capability and negotiation without looking.
- [ ] Trace input to owner and output.
- [ ] Explain one failure and one alternative.
- [ ] Pass at least four assignment questions.
- [ ] Pass every practical check and submit.
- [ ] Explain the concept again tomorrow.

## Sources, versions, and safe commands {#sources}

MCP revision 2026-07-28; initialization-based revision 2025-11-25 is discussed separately. Review date: 2026-10-02. The supplied blueprint is the teaching source; official landing pages were checked where reachable. No provider or original TM Schedule deployment was tested.

- [Official reference](https://modelcontextprotocol.io/specification/2026-07-28)

- [Official reference](https://www.jsonrpc.org/specification)

[Course reading order](README.md) · [Previous lesson](03-json-rpc-messages.md) · [Next lesson](05-state-and-stateless-design.md)

```study-quiz

{
  "schemaVersion": 1,
  "lessonId": "mcp/04-lifecycle-discovery-and-capabilities",
  "title": "Assignment: Lifecycle Discovery And Capabilities",
  "passPercentage": 80,
  "questions": [
    {
      "id": "q1",
      "sectionId": "concept-1",
      "prompt": "In Lifecycle Discovery And Capabilities, what does capability mean?",
      "options": [
        {
          "id": "a",
          "text": "a supported protocol feature",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "b",
          "text": "A permission granted by a hidden browser control",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "An unlimited provider operation with no ownership",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "d",
          "text": "A diagnostic credential intended for public logs",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "a",
      "explanation": "capability means a supported protocol feature.",
      "reviewLabel": "Review concept 1"
    },
    {
      "id": "q2",
      "sectionId": "concept-2",
      "prompt": "In Lifecycle Discovery And Capabilities, which rule is correct for checkpoint 2?",
      "options": [
        {
          "id": "a",
          "text": "Trust client-side checks instead of the server rule.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "Check a capability before invoking an optional feature.",
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
      "explanation": "Check a capability before invoking an optional feature.",
      "reviewLabel": "Review concept 2"
    },
    {
      "id": "q3",
      "sectionId": "concept-3",
      "prompt": "In Lifecycle Discovery And Capabilities, which rule is correct for checkpoint 3?",
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
          "text": "Legacy initialization and modern request metadata are different models.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "d",
          "text": "Skip the stated boundary, limit, or ownership check.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "c",
      "explanation": "Legacy initialization and modern request metadata are different models.",
      "reviewLabel": "Review concept 3"
    },
    {
      "id": "q4",
      "sectionId": "concept-4",
      "prompt": "In Lifecycle Discovery And Capabilities, which rule is correct for checkpoint 4?",
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
          "text": "Stateless protocol requests can still access persistent application state.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        }
      ],
      "correctOptionId": "d",
      "explanation": "Stateless protocol requests can still access persistent application state.",
      "reviewLabel": "Review concept 4"
    },
    {
      "id": "q5",
      "sectionId": "worked-scenario",
      "prompt": "A client does not advertise an optional feature. Choose the server behavior.",
      "options": [
        {
          "id": "a",
          "text": "Do not invoke it; use a supported path or safe error",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "b",
          "text": "Invoke it and hope",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "Treat absence as blanket permission",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "d",
          "text": "Write a custom incompatible result without negotiation",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "a",
      "explanation": "Do not invoke it; use a supported path or safe error. Reject unsupported versions rather than guessing.",
      "reviewLabel": "Review the worked scenario"
    }
  ]
}

```

```study-practical

{
  "schemaVersion": 1,
  "challengeId": "mcp/04-lifecycle-discovery-and-capabilities/decision",
  "lessonId": "mcp/04-lifecycle-discovery-and-capabilities",
  "title": "Practical: Lifecycle Discovery And Capabilities",
  "language": "json",
  "mode": "structured",
  "instructions": "A client does not advertise an optional feature. Choose the server behavior. Return an object with decision (choose from respect-capability, skip-check, unbounded-work, trust-client), justification (at least 40 characters; include capability and negotiation), and failureBehavior (at least 25 characters; include failure and recover while explaining the error and recovery). These are structured reasoning checks, not code execution or an official grade.",
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
        "decision": "respect-capability",
        "justification": "The capability and negotiation boundary must preserve the declared contract and ownership.",
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

