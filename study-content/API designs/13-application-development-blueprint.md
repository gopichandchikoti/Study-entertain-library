# Application Development Blueprint

## The big idea in plain words {#picture}

Deploying is carrying a tested lunch box to another classroom without spilling it.

## What you will be able to do {#outcomes}

Read this after the previous numbered lesson. Use synthetic notes and local exercise data. By the end you should explain the following scope without copying:

Teach problem statement, requirements, contract-first design, vertical slices, deployment, operations, ADRs, and definition of done.

## Words to know {#vocabulary}

- **artifact**: the finished, versioned package made by a build.

- **rollback**: going back to the last version that worked.

- **restore**: bringing data back from a backup.

## Why this idea exists {#history}

Building by hand on every machine makes each release a little different. A versioned package, settings kept outside it, quick checks, and a way back make releases repeatable.

## Concept 1 {#concept-1}

artifact means the finished, versioned package made by a build. Ship the exact package you tested.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 2 {#concept-2}

Keep secrets in the deployment settings, not in the code.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 3 {#concept-3}

Run quick smoke checks right after a release.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Concept 4 {#concept-4}

A backup only counts if you have practiced restoring it.

Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.

## Going deeper: the technical walkthrough {#walkthrough}

### Capstone: Study Notes API


Build these endpoints:

```text
GET    /notes
GET    /notes/{id}
POST   /notes
PUT    /notes/{id}
PATCH  /notes/{id}/completion
DELETE /notes/{id}
```

Requirements:

- bounded pagination and stable ordering;
- title/body/topic validation;
- authenticated owner can read and change their notes;
- duplicate create behavior is explicit;
- missing note is a safe `404`;
- storage is behind a repository;
- database failure is a retryable `503`;
- OpenAPI and curl examples are included;
- unit, route, integration, and authorization tests exist.



## Worked scenario {#worked-scenario}

A new release fails its readiness check. What should you do?

The justified choice is **Stop the rollout and go back to the version that worked**. Select **rollback-release** in the structured practical and explain why. Alternatives ignore a requirement, cross a trust boundary, or invent success.

### Structured decision contract

```json

{
  "decision": "rollback-release",
  "justification": "The artifact and rollback boundary must preserve the declared contract and ownership.",
  "failureBehavior": "Expose a safe failure and recover through the boundary owner."
}

```

Decision selects one declared behavior. Justification explains the boundary. FailureBehavior explains the observable error and recovery owner. These fields never execute commands. Required terms and minimum lengths form a basic practice rubric, not semantic grading.

## Step-by-step flow and matching picture {#flow}

```mermaid
flowchart LR
    N0["validation"]
    N1["transaction"]
    N2["insert"]
    N3["generated ID"]
    N4["`201` response"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

![validation, transaction, insert, generated ID, and `201` response](images/07-create-schedule-row-sequence.svg)

```mermaid
flowchart LR
    N0["source"]
    N1["Gradle checks"]
    N2["artifact"]
    N3["environment"]
    N4["health check"]
    N5["smoke test"]
    N6["rollback"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

![source, Gradle checks, artifact, environment, health check, smoke test, and rollback](images/10-build-and-deployment-flow.svg)

```mermaid
flowchart LR
    N0["requirements leading to monolith"]
    N1["cache"]
    N2["queue"]
    N3["event"]
    N4["or service split"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

![requirements leading to monolith, cache, queue, event, or service split](images/12-system-design-decision-map.svg)

## Three real-life uses {#use-cases}

1. A personal learner applies this rule to one synthetic note and checks the result.
2. A team changes the boundary while preserving its shared request and response contract.
3. A deployed library handles concurrent requests and reports failures through safe errors and correlated signals.

## What can go wrong, and how to stay safe {#failure-security}

Change databases in steps that old and new code can both handle. An external dependency needs an owner, size limit, deadline, cleanup, and recovery path. Return a stable error code rather than raw exceptions. Redact credentials and private bodies in diagnostics.

The abstraction improves artifact reasoning but adds configuration and lifecycle work. Keep a simpler implementation when it meets the requirement. Measure the limiting resource before adding services, queues, or caches.

## Practice lab and expected observation {#practice}

1. Predict the scenario decision before opening Practical. Explain each rejected alternative.
2. Run a relevant example above in an isolated exercise project. Record the expected result, then change one input to an invalid or boundary value. A failed assertion or deliberate error should replace silent success.
3. Submit the structured decision. Initially the checks fail. After selecting rollback-release and writing an explanation and failure plan, all three pass. Follow the indicated review section for missed checks.

### Broken example to debug

```json

{"decision":"trust-client","justification":"","failureBehavior":""}

```

This ignores the responsible boundary and gives no reasoning or recovery. Correct the fields rather than changing the validator.

## Checkpoint and definition of done {#checkpoint}

- [ ] Define artifact and rollback without looking.
- [ ] Trace input to owner and output.
- [ ] Explain one failure and one alternative.
- [ ] Pass at least four assignment questions.
- [ ] Pass every practical check and submit.
- [ ] Explain the concept again tomorrow.

## Sources, versions, and safe commands {#sources}

HTTP semantics; educational contracts, not an audit of the unavailable TM Schedule repository. Review date: 2026-10-02. The supplied blueprint is the teaching source; official landing pages were checked where reachable. No provider or original TM Schedule deployment was tested.

- [Official reference](https://www.rfc-editor.org/rfc/rfc9110)

- [Official reference](https://spec.openapis.org/oas/v3.1.0.html)

[Course reading order](README.md) · [Previous lesson](12-system-design-and-design-patterns.md) · [Next lesson](14-practice-labs.md)

```study-quiz

{
  "schemaVersion": 1,
  "lessonId": "api-design/13-application-development-blueprint",
  "title": "Assignment: Application Development Blueprint",
  "passPercentage": 80,
  "questions": [
    {
      "id": "q1",
      "sectionId": "concept-1",
      "prompt": "In Application Development Blueprint, what does artifact mean?",
      "options": [
        {
          "id": "a",
          "text": "the finished, versioned package made by a build",
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
      "explanation": "artifact means the finished, versioned package made by a build.",
      "reviewLabel": "Review concept 1"
    },
    {
      "id": "q2",
      "sectionId": "concept-2",
      "prompt": "In Application Development Blueprint, which rule is correct for checkpoint 2?",
      "options": [
        {
          "id": "a",
          "text": "Trust client-side checks instead of the server rule.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "Keep secrets in the deployment settings, not in the code.",
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
      "explanation": "Keep secrets in the deployment settings, not in the code.",
      "reviewLabel": "Review concept 2"
    },
    {
      "id": "q3",
      "sectionId": "concept-3",
      "prompt": "In Application Development Blueprint, which rule is correct for checkpoint 3?",
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
          "text": "Run quick smoke checks right after a release.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "d",
          "text": "Skip the stated boundary, limit, or ownership check.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "c",
      "explanation": "Run quick smoke checks right after a release.",
      "reviewLabel": "Review concept 3"
    },
    {
      "id": "q4",
      "sectionId": "concept-4",
      "prompt": "In Application Development Blueprint, which rule is correct for checkpoint 4?",
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
          "text": "A backup only counts if you have practiced restoring it.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        }
      ],
      "correctOptionId": "d",
      "explanation": "A backup only counts if you have practiced restoring it.",
      "reviewLabel": "Review concept 4"
    },
    {
      "id": "q5",
      "sectionId": "worked-scenario",
      "prompt": "A new release fails its readiness check. What should you do?",
      "options": [
        {
          "id": "a",
          "text": "Stop the rollout and go back to the version that worked",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "b",
          "text": "Delete the backups",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "Hide the health page",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "d",
          "text": "Update every library to 'latest'",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "a",
      "explanation": "Stop the rollout and go back to the version that worked. Change databases in steps that old and new code can both handle.",
      "reviewLabel": "Review the worked scenario"
    }
  ]
}

```

```study-practical

{
  "schemaVersion": 1,
  "challengeId": "api-design/13-application-development-blueprint/decision",
  "lessonId": "api-design/13-application-development-blueprint",
  "title": "Practical: Application Development Blueprint",
  "language": "json",
  "mode": "structured",
  "instructions": "A new release fails its readiness check. What should you do? Return an object with decision (choose from rollback-release, skip-check, unbounded-work, trust-client), justification (at least 40 characters; include artifact and rollback), and failureBehavior (at least 25 characters; include failure and recover while explaining the error and recovery). These are structured reasoning checks, not code execution or an official grade.",
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
        "decision": "rollback-release",
        "justification": "The artifact and rollback boundary must preserve the declared contract and ownership.",
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

