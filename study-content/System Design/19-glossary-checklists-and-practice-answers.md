# Glossary Checklists And Practice Answers

## The big idea in plain words {#picture}

A glossary is the dictionary at the back of a book. When a word is new, you look it up. This one is for system design, and every word has a short, plain meaning.

Below it you will find checklists, like a pilot's checklist before takeoff, and some practice questions with worked answers so you can test yourself.

```mermaid
flowchart LR
    A["Read a word"] --> B["Say it in your own words"]
    B --> C["Use it in a drawing"]
    C --> D["Check with the list"]
```

## What you will be able to do {#outcomes}

By the end of this lesson you will be able to:

- Look up any system design word quickly.
- Use a checklist before saying "this design is done".
- Answer practice questions and compare with worked answers.

## Words to know {#vocabulary}

- **availability**: how often the system is up and working.
- **latency**: how long one request takes.
- **throughput**: how many requests are finished per second.
- **cache**: a quick copy of data.
- **queue**: a waiting line for jobs.
- **replica**: an extra copy.
- **shard**: one slice of a big dataset.
- **idempotent**: safe to do twice.

## Why this idea exists {#history}

Words are the tools of thinking. When you own the words, you can have clear conversations and read any design document without getting lost.

## Concept 1: The "before you say done" checklist {#concept-1}

Did I write requirements and numbers? Do I know the bottleneck? Does each box have an owner? What happens when each box fails? How do I watch it? How do I deploy and go back? If you can answer these, your design is in good shape.

## Concept 2: Practice answer: a link shortener {#concept-2}

Needs: create a short link and open it fast. Numbers: 1 million creates per day is about 12 per second; opens are 10 times more, about 120 per second. Plan: API, database, cache for popular links. Risk: reading is the bottleneck, so cache. Rejected: sharding, not needed yet.

## Concept 3: Practice answer: a notification system {#concept-3}

Needs: send a message to many people without slowing the main app. Plan: the app puts a notification job in a queue; workers send it by email or push. Safety: retries with limits, a dead-letter box, and a unique key so nobody gets the same message twice.

## Concept 4: Spaced review {#concept-4}

Review each lesson after one day, one week, and one month. Cover the page, draw the diagram from memory, and say the five questions. The effort of remembering is what makes it stick.

## A self-check {#example}

Pick any app you use daily. In two minutes, write: three things it must do, one quality goal, one number, one failure, and the simplest set of boxes. If you can, you have the skill of system design.

## Going deeper: the technical walkthrough {#walkthrough}

- **prerequisite**: something you need to know first, before the next thing makes sense.

- **checkpoint**: a question you answer from memory, without peeking.

- **contract**: a clear promise about what goes in and what comes out.

- **runtime**: the helper program that actually runs your code.

- **framework**: a ready-made skeleton that calls your code at the right moments.

- **tradeoff**: a good thing you get in exchange for a cost you accept.

- **type**: a description of what kind of values are allowed.

- **reference**: a pointer to an object, not the object itself.

- **validation**: checking real data against a rule.

- **parameter**: a named slot where a function receives an input.

- **return**: the answer a function hands back.

- **scope**: the part of the program where a name can be seen.

- **list**: items in order; the same item can appear twice.

- **set**: a bag of items where each one appears only once.

- **map**: a lookup table that connects each key to one value.

- **class**: a blueprint that describes the data and actions of something.

- **object**: one real thing built from a class.

- **invariant**: a rule that must always be true for the object.

- **interface**: a list of actions that something promises to offer.

- **adapter**: a piece that connects the promise to a real tool.

- **substitutability**: swapping one piece for another without breaking the promise.

- **null**: a marker meaning 'there is no value here'.

- **optional**: a box that may hold a value or may be empty.

- **normalization**: turning different ways of writing the same thing into one standard form.

- **exception**: a problem that interrupts the normal flow of a program.

- **safeError**: a short message that is safe to show to the person who asked.

- **cause**: the deeper problem that explains a surface problem.

- **instant**: one exact moment on the world's timeline.

- **localDate**: a calendar day with no time zone attached.

- **encoding**: the rule for turning text into bytes and back.

- **module**: one piece of code with clear things it takes in and gives out.

- **package**: a bundle of modules with a version number.

- **lockfile**: a file that records the exact versions you installed.

- **environment**: the settings given to a program by the place it runs.

- **profile**: a named set of settings, such as dev or production.

- **secret**: a password or key that must never be made public.

- **method**: the action word of a request, like GET or POST.

- **header**: extra information that travels with a message.

- **status**: a number in the reply that says how it went.

- **route**: a rule that sends a method and a path to a piece of code.

- **binding**: turning parts of a request into inputs for your code.

- **middleware**: a step that runs around every request.

- **schema**: a written description of the shape and limits of data.

- **businessRule**: a rule about what is allowed in your app.

- **authorization**: deciding what a person is allowed to do.

- **transaction**: a group of changes that all succeed or all get undone.

- **index**: a quick-lookup list a database keeps beside your data.

- **parameter**: a value sent separately from the SQL text.

- **idempotency**: doing the same action again has no extra effect.

- **outbox**: a to-do note saved in the same step as the main change.

- **isolation**: how separate changes at the same time are kept from tangling.

- **authentication**: proving who someone is.

- **authorization**: checking what that person may do with specific data.

- **leastPrivilege**: giving only the access a job really needs.

- **fixture**: prepared test data or setup.

- **unitTest**: a small test of one rule.

- **integrationTest**: a test that checks several real parts together.

- **log**: a written note about something that happened.

- **metric**: a number that counts or measures something over time.

- **trace**: the path one request took through many parts.

- **artifact**: the finished, versioned package made by a build.

- **rollback**: going back to the last version that worked.

- **restore**: bringing data back from a backup.

- **eventLoop**: the manager that decides what runs next while others wait.

- **queue**: a waiting line for jobs, with a size limit.

- **cancellation**: asking work to stop and clean up after itself.

- **path**: the address that points to a file.

- **buffer**: a chunk of raw data held in memory.

- **backpressure**: telling the sender to slow down when the receiver is full.

- **race**: a result that depends on lucky timing.

- **executor**: a manager that runs a limited number of tasks.

- **interruption**: a polite request for a running task to stop.

- **heap**: the big area of memory where objects live.

- **stack**: the small tidy area that tracks the calls happening right now.

- **leak**: holding on to something long after it is useful.

- **DNS**: the phone book that turns a name into an address.

- **TLS**: the lock that scrambles messages and proves who the server is.

- **deadline**: the total time allowed for the whole job.

- **functionalRequirement**: something the system must do.

- **qualityRequirement**: how fast, safe, or reliable it must be while doing it.

- **RPS**: requests per second.

- **TTL**: how long a saved copy is allowed to be used.

- **cacheAside**: check the cache, fetch from the source on a miss, then save a copy.

- **stampede**: many requests all rebuilding the same missing value at once.

- **replica**: an extra copy of data or of a running service.

- **shard**: one slice of a dataset that is split across machines.

- **hotKey**: one popular key that gets far more traffic than the rest.

- **backoff**: waiting longer and longer between retries.

- **circuitBreaker**: a switch that stops calling something that keeps failing.

- **bulkhead**: separate compartments so one failure cannot sink the whole ship.

- **monolith**: an app that is built and shipped as one piece.

- **port**: a doorway where your app talks to the outside.

- **saga**: a chain of steps where each step has an 'undo' step.

- **host**: the application managing the model and user experience.

- **client**: the connector maintaining access to an MCP server.

- **server**: the program exposing controlled tools and context.

- **requestId**: the value matching a response to a request.

- **notification**: a message with no ID and no matching response.

- **method**: the declared operation being requested.

- **capability**: a supported protocol feature.

- **negotiation**: agreeing on compatible behavior.

- **metadata**: context accompanying a request.

- **stdio**: a process input/output message channel.

- **StreamableHTTP**: an HTTP transport for MCP request/response and optional streaming.

- **framing**: rules separating complete messages.

- **tool**: a named operation with a checked input schema.

- **resource**: context chosen and read through a controlled URI.

- **prompt**: a user-selected reusable message template.

- **workflowState**: a durable task’s progress and result.

- **connectionState**: the lifetime of a pipe or stream.

- **applicationState**: persistent records used by business rules.

### Practice labs


1. Design a lunch-menu app for one classroom and reject unnecessary services.
2. Estimate peak RPS and storage for a note library.
3. Draw a browser-to-database request with a timeout path.
4. Choose a relational table, cache key, and queue boundary for a schedule.
5. Design a retry-safe export job.
6. List three failures and the user-visible result for each.
7. Choose a backup plan and state RPO/RTO.
8. Review a system for leaked secrets and unbounded input.
9. Compare a modular monolith with two microservices and name the cost.
10. Present the Study Library design in ten minutes using the review order.



### Definition of done


- [ ] I start with users and requirements instead of a favorite technology.
- [ ] I can estimate traffic, storage, bandwidth, and latency.
- [ ] I can explain the owner and purpose of every major component.
- [ ] I can choose database, cache, queue, and object storage boundaries.
- [ ] I can explain consistency, transactions, retries, and idempotency.
- [ ] I can draw a failure path and a recovery path.
- [ ] I can define security boundaries and safe logs.
- [ ] I can name useful metrics and a health check.
- [ ] I can explain deployment, backup, restore, and rollback.
- [ ] I can state a trade-off and the evidence that would change it.



## Worked scenario {#worked-scenario}

You understand how to ask for data with GET, but you cannot explain how the server checks incoming data. What should you study next?

The justified choice is **Practice sending bad data and see how the server checks it**. Select **review-validation** in the structured practical and explain why. Alternatives ignore a requirement, cross a trust boundary, or invent success.

### Structured decision contract

```json

{
  "decision": "review-validation",
  "justification": "The prerequisite and checkpoint boundary must preserve the declared contract and ownership.",
  "failureBehavior": "Expose a safe failure and recover through the boundary owner."
}

```

Decision selects one declared behavior. Justification explains the boundary. FailureBehavior explains the observable error and recovery owner. These fields never execute commands. Required terms and minimum lengths form a basic practice rubric, not semantic grading.

## Step-by-step flow and matching picture {#flow}

```mermaid
flowchart LR
    N0["You tap a button"]
    N1["The front door"]
    N2["The app (API)"]
    N3["The data"]
    N4["A waiting line"]
    N5["Helpers (workers)"]
    N6["Notes about everything"]
    N7["The answer returns"]
    N0 --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
    N6 --> N7
```

![user, edge, API, data, queue, worker, and signals](images/system-design-big-picture-request-flow.svg)

## Three real-life uses {#use-cases}

1. Before a design review, a team goes through the checklist.
2. A student studies the glossary every Friday.
3. A new teammate reads the glossary to understand the whiteboard on day one.

## What can go wrong, and how to stay safe {#failure-security}

Mistake: memorizing words without drawing anything. A word only becomes yours when you can use it on a picture of a real system. Another mistake is treating the checklist as a form to tick without thinking.

## Practice lab and expected observation {#practice}

1. Predict the scenario decision before opening Practical. Explain each rejected alternative.
2. Run a relevant example above in an isolated exercise project. Record the expected result, then change one input to an invalid or boundary value. A failed assertion or deliberate error should replace silent success.
3. Submit the structured decision. Initially the checks fail. After selecting review-validation and writing an explanation and failure plan, all three pass. Follow the indicated review section for missed checks.

### Broken example to debug

```json

{"decision":"trust-client","justification":"","failureBehavior":""}

```

This ignores the responsible boundary and gives no reasoning or recovery. Correct the fields rather than changing the validator.

## Checkpoint and definition of done {#checkpoint}

- [ ] Define prerequisite and checkpoint without looking.
- [ ] Trace input to owner and output.
- [ ] Explain one failure and one alternative.
- [ ] Pass at least four assignment questions.
- [ ] Pass every practical check and submit.
- [ ] Explain the concept again tomorrow.

## Sources, versions, and safe commands {#sources}

Workload figures are assumptions until measured. Review date: 2026-10-02. The supplied blueprint is the teaching source; official landing pages were checked where reachable. No provider or original TM Schedule deployment was tested.

- [Official reference](https://www.postgresql.org/docs/current/)

- [Official reference](https://opentelemetry.io/docs/)

[Course reading order](README.md) · [Previous lesson](18b-design-a-chat-app-step-by-step.md)

```study-quiz

{
  "schemaVersion": 1,
  "lessonId": "system-design/19-glossary-checklists-and-practice-answers",
  "title": "Assignment: Glossary Checklists And Practice Answers",
  "passPercentage": 80,
  "questions": [
    {
      "id": "q1",
      "sectionId": "concept-1",
      "prompt": "In Glossary Checklists And Practice Answers, what does prerequisite mean?",
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
          "text": "something you need to know first, before the next thing makes sense",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "d",
          "text": "A diagnostic credential intended for public logs",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "c",
      "explanation": "prerequisite means something you need to know first, before the next thing makes sense.",
      "reviewLabel": "Review concept 1"
    },
    {
      "id": "q2",
      "sectionId": "concept-2",
      "prompt": "In Glossary Checklists And Practice Answers, which rule is correct for checkpoint 2?",
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
          "text": "Guess the output first, then look at the answer.",
          "explanation": "This preserves the definition and boundary described in the lesson."
        }
      ],
      "correctOptionId": "d",
      "explanation": "Guess the output first, then look at the answer.",
      "reviewLabel": "Review concept 2"
    },
    {
      "id": "q3",
      "sectionId": "concept-3",
      "prompt": "In Glossary Checklists And Practice Answers, which rule is correct for checkpoint 3?",
      "options": [
        {
          "id": "a",
          "text": "When a test fails, it points to the idea you are missing.",
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
      "explanation": "When a test fails, it points to the idea you are missing.",
      "reviewLabel": "Review concept 3"
    },
    {
      "id": "q4",
      "sectionId": "concept-4",
      "prompt": "In Glossary Checklists And Practice Answers, which rule is correct for checkpoint 4?",
      "options": [
        {
          "id": "a",
          "text": "Trust client-side checks instead of the server rule.",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "A practice score in this app is just a helper, not an official exam grade.",
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
      "explanation": "A practice score in this app is just a helper, not an official exam grade.",
      "reviewLabel": "Review concept 4"
    },
    {
      "id": "q5",
      "sectionId": "worked-scenario",
      "prompt": "You understand how to ask for data with GET, but you cannot explain how the server checks incoming data. What should you study next?",
      "options": [
        {
          "id": "a",
          "text": "Jump straight to advanced deployment",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "b",
          "text": "Copy an answer without trying it",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        },
        {
          "id": "c",
          "text": "Practice sending bad data and see how the server checks it",
          "explanation": "This preserves the definition and boundary described in the lesson."
        },
        {
          "id": "d",
          "text": "Switch frameworks so the problem goes away",
          "explanation": "This changes the declared meaning or bypasses the responsible boundary."
        }
      ],
      "correctOptionId": "c",
      "explanation": "Practice sending bad data and see how the server checks it. Come back to a topic after a break; remembering it is better practice than just re-reading it.",
      "reviewLabel": "Review the worked scenario"
    }
  ]
}

```

```study-practical

{
  "schemaVersion": 1,
  "challengeId": "system-design/19-glossary-checklists-and-practice-answers/decision",
  "lessonId": "system-design/19-glossary-checklists-and-practice-answers",
  "title": "Practical: Glossary Checklists And Practice Answers",
  "language": "json",
  "mode": "structured",
  "instructions": "You understand how to ask for data with GET, but you cannot explain how the server checks incoming data. What should you study next? Return an object with decision (choose from review-validation, skip-check, unbounded-work, trust-client), justification (at least 40 characters; include prerequisite and checkpoint), and failureBehavior (at least 25 characters; include failure and recover while explaining the error and recovery). These are structured reasoning checks, not code execution or an official grade.",
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
        "decision": "review-validation",
        "justification": "The prerequisite and checkpoint boundary must preserve the declared contract and ownership.",
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

