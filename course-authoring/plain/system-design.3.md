=== 14
@@picture
When a school moves a science project from your home to the classroom, you pack it carefully, test that it still works at school, and bring a spare copy in case something breaks. If it breaks in transit, you go back to the version that worked at home.

Deploying software is that trip. We **build** one tested package, **send** it to the servers, **check** it is healthy, and keep a way to **go back**. We also keep **backups**, because someday a disk will fail.
@@diagram
flowchart LR
    B["Build one package"] --> T["Test it"]
    T --> D["Deploy to a few servers"]
    D --> H{"Healthy?"}
    H -->|"Yes"| A["Roll out to everyone"]
    H -->|"No"| RB["Roll back"]
@@goal
- Explain build, artifact, environment, and container.
- Describe a safe rollout and a rollback.
- Explain RPO, RTO, and why restore drills matter.
@@words
- **artifact**: the finished, numbered package that is ready to ship.
- **environment**: a place the app runs, such as test or production.
- **container**: a sealed box holding the app and everything it needs.
- **rollback**: going back to the last working version.
- **RPO**: how much recent data we can afford to lose, measured in time.
- **RTO**: how long we can afford to be down.
@@why
Releasing by hand, from someone's laptop, is how mistakes happen. A repeatable process makes releases boring, and boring is wonderful.
@@c1 One package for every place
Build once, then ship the same package to test and production. Only the settings change (addresses and passwords come from outside). If you rebuild for each place, "it worked in test" means nothing.
@@c2 Roll out slowly
Send the new version to a small group first, watch health checks, and then continue. If errors rise, stop and roll back. This is much safer than switching everything at once.
@@c3 Change the database in small steps
During a rollout, old and new code run at the same time, so the database must work with both. Add a new column first, then change the code, and remove the old column much later. It is like adding a new door before you close the old one.
@@c4 Backups need practice
A backup you never tried to restore is only a hope. Practice bringing back the data and time how long it takes. RPO says how much data you can lose (for example 5 minutes), and RTO says how long you can be down (for example 1 hour). Your backup schedule and your plan must match those numbers.
@@example The bad release
At 3:00 a new version is released to 10 percent of servers. At 3:05 the error graph rises. The team clicks "roll back", and by 3:07 the old version is back. Only a few users saw errors. Later the team fixes the bug and tries again.
@@use
1. A website pushes updates a few times a day with automated checks.
2. A company keeps nightly backups and tests a restore every month.
3. A service runs in two regions, so if one region fails, the other takes over.
@@wrong
Mistakes: building by hand, putting passwords in the package, changing the database in a way old code cannot handle, no rollback plan, and never testing backups. Also, a rollout that cannot be paused is risky. Always have a stop button.

=== 15
@@picture
There are many ways to organize a big app, like many ways to organize a school. One building with clear wings. Many small buildings that talk by phone. A system that passes notes between rooms. None is best for all schools. The skill is choosing the simplest one that fits.

Each pattern is a tool with a price. In this lesson you will learn the price tag of each one.
@@diagram
flowchart TD
    S["Start: modular monolith"] --> Q1{"Parts need to scale or release alone?"}
    Q1 -->|"No"| S
    Q1 -->|"Yes"| M["Split out that part as a service"]
    M --> Q2{"Need to react to things happening?"}
    Q2 -->|"Yes"| E["Use events"]
@@goal
- Compare monolith, microservices, events, CQRS, outbox, saga, and serverless.
- Explain the strangler pattern for moving old systems step by step.
- Choose a pattern and say what it costs.
@@words
- **modular monolith**: one app with tidy, separate parts inside.
- **microservices**: many small apps that talk over the network.
- **event-driven**: parts react to messages that say "this happened".
- **saga**: steps with "undo" steps for each, used across services.
- **strangler pattern**: slowly replacing an old system piece by piece.
- **serverless**: you give code to a provider that runs it only when needed.
@@why
Teams copy what big companies do and end up with a system too complicated for them. Knowing the costs helps you pick only what you need.
@@c1 Start with a modular monolith
One program, with folders that match the parts: users, notes, billing. It is easy to run, test, and change. Most apps never need to leave this stage.
@@c2 Microservices cost a lot
Each service needs its own deployment, monitoring, and database. Calls between them can fail or be slow. They help when separate teams or very different loads need independence. Without that need, they add work.
@@c3 Events and sagas
With events, one part says "order placed" and others react: send email, update stock. The sender does not need to know who listens. For long processes across services, a saga runs the steps and has an undo step for each.
@@c4 Replace old systems slowly
You do not rebuild an old system overnight. With the strangler pattern, you put a front in front of it and move one feature at a time to the new system. Over time, the old one has nothing left to do and can be turned off.
@@example A shop grows up
Year one: one app and one database. Year two: emails and image resizing move to workers with a queue. Year three: search becomes its own service because it needs different hardware. The shop never did a big rewrite. It split pieces out only when a real need appeared.
@@use
1. A startup keeps one codebase while the team is small.
2. A big retailer uses events so inventory, shipping, and billing stay in sync.
3. A company slowly replaces an old billing system using the strangler pattern.
@@wrong
Mistakes: microservices on day one, services that share one database (so they are not really separate), and events with no owner so nobody knows who reacts to what. Draw the arrows. If you cannot draw them, the design is too tangled.

=== 16
@@picture
A design interview is like explaining a science project to a judge. You do not just show the finished model. You explain the problem, show your numbers, describe the steps, point to the weak spots, and say why you did not choose other ideas.

The same steps work for real design reviews at work. They keep a conversation calm, clear, and kind.
@@diagram
flowchart LR
    A["1. Ask questions"] --> B["2. Write requirements"]
    B --> C["3. Estimate numbers"]
    C --> D["4. Draw the simple design"]
    D --> E["5. Find the bottleneck"]
    E --> F["6. Explain trade-offs"]
@@goal
- Follow a six-step method to present any design.
- Think aloud and explain trade-offs.
- Review a design politely and usefully.
@@words
- **bottleneck**: the narrowest part that limits how much can flow, like the neck of a bottle.
- **trade-off**: what you gain and what you give up.
- **assumption**: something we treat as true because we do not know for sure.
- **design review**: a meeting where people check a plan before building it.
- **alternative**: another choice you could have made.
- **non-goal**: something we decide not to do right now.
@@why
Even a great design fails if nobody can follow it. A clear method means that your ideas get understood, your mistakes get caught early, and your team trusts the plan.
@@c1 Ask before drawing
Spend the first few minutes on questions: Who are the users? What are the main actions? How many? What must never go wrong? It is okay to say "I will assume 10,000 users" if nobody tells you.
@@c2 Draw the simplest thing first
Begin with the basic path: client, API, database. Then add one thing at a time and say why: "reads are slow, so I add a cache". The listener can follow every step.
@@c3 Name the weak spot
Say where the design might break: "the database is the bottleneck when writes grow". Showing the weak spot is a sign of strength, not weakness. It tells people you understand the limits.
@@c4 Explain what you did not choose
"I did not use microservices because we have one small team." One sentence on each rejected choice proves you considered options. Also write down non-goals: what we will not build yet.
@@example Five minutes for a link shortener
Ask: how many links per day? Say 1 million. Write: create a short link, open a link, fast opens. Estimate: 12 creates per second, 120 opens per second. Draw: client, API, database, cache. Weak spot: opens, so add a cache. Rejected: sharding, not needed at this size.
@@use
1. A team reviews a drawing before spending months building.
2. An engineer explains a design to a new teammate with six clear steps.
3. A student practices by drawing a known app (like a photo app) from memory.
@@wrong
Mistakes: jumping straight to fancy tools, hiding the weak spots, using words nobody explained, and saying "it depends" without finishing the sentence ("it depends on X, and in our case X is Y, so I choose Z").

=== 17
@@picture
Now let us follow one real-style example from start to finish: a **schedule app** for a store. A manager opens it, sees who is working on which day, and changes a shift. We will trace what happens at every step, from the screen all the way to the database and back, and ask "what if this breaks?" at each stop.

Think of it as a field trip along the whole system. We have seen each stop in earlier lessons. Now we visit them in order.
@@diagram
flowchart LR
    U["Manager taps Save"] --> API["API checks login and input"]
    API --> S["Service applies rules"]
    S --> DB[("Database saves shift")]
    S --> Q["Queue: notify workers"]
    DB --> OK["Reply: saved"]
@@goal
- Trace a full request through every layer.
- Spot where each failure could happen and how to answer it.
- Describe the tests, deployment, and monitoring for the same app.
@@words
- **shift**: one worker's time on the schedule.
- **end to end**: from the first tap to the final saved data.
- **layer**: one level of the app with one job.
- **happy path**: the way things go when nothing breaks.
- **failure path**: what happens when something does break.
- **synthetic data**: made-up data used for practice, not real people's data.
@@why
Concepts become real when you see them work together. A full trip shows how a choice in one place (like a timeout) affects another place (like the screen).
@@c1 The happy path
The manager changes Tuesday's shift and taps Save. The screen sends the request. The API checks the login, checks that the dates make sense, and calls the service. The service saves the shift in the database and replies "saved". The screen shows a green message.
@@c2 The failure paths
What if the date is wrong? The API replies 422 with a friendly message. What if the manager is not allowed to edit this store? 403. What if the database is down? The API replies "try again soon" and does not claim it saved.
@@c3 Test each layer
Unit tests check the rules ("end must be after start"). API tests check the replies. A test with a real database checks that the shift is saved correctly. Tests that make failures happen on purpose check the unhappy paths too.
@@c4 Deploy and watch
The app is built into one package, tested, and rolled out slowly. A request ID follows every save through the logs. A dashboard shows saves per minute and errors. If the error count jumps, an alert tells a person.
@@example A save that times out
The manager taps Save and the reply never arrives. The screen shows "not sure it saved, please check". The manager taps Save again with the same request key. The server sees the key was already used and replies with the saved shift. No duplicate, no confusion.
@@use
1. A restaurant manager changes shifts from a phone.
2. A worker checks next week's hours and gets a cached answer.
3. A nightly job emails each worker their schedule through a queue.
@@wrong
Mistakes: showing "saved" before it really is, forgetting the "not allowed" check on the record, and a screen that gives no hint when a save may have failed. Note: the original schedule application was not supplied, so this lesson uses illustrative flows and made-up data, not a real private system.

=== 18
@@picture
Cooks use recipes. A recipe tells you the ingredients and the steps for a particular dish. Architects have recipes too. A chat app, a photo app, a payment app, and an online store each have a typical shape.

This lesson is a recipe book. For each kind of app we ask the same questions you learned: who, how much, what can break, and what is the simplest plan? Then we write the recipe.
@@diagram
flowchart TD
    A["What kind of app?"] --> B{"Mostly reading?"}
    B -->|"Yes"| C["Add cache and read copies"]
    B -->|"No"| D{"Slow background work?"}
    D -->|"Yes"| E["Add queue and workers"]
    D -->|"No"| F["One app and one database"]
@@goal
- Use the same method on many app types.
- Match a problem (reads, uploads, messages, payments) to a pattern.
- Say what to keep simple for each type.
@@words
- **CRUD**: Create, Read, Update, Delete, the four basic things apps do with data.
- **catalog**: a list of items people can browse, like products.
- **upload**: sending a file from a user to the server.
- **notification**: a message sent to tell someone something.
- **offline-first**: an app that works without internet and syncs later.
- **multi-tenant**: one app serving many separate customers at the same time.
@@why
Most new apps look like one you have seen before. Reusing a known shape saves time and avoids old mistakes.
@@c1 Simple CRUD app
Use an API and a database. Add checks, constraints, and good errors. That is it. Do not add pieces just because you can.
@@c2 Apps with lots of browsing
Catalogs, news, and videos are read far more than written. Add a cache and a CDN (copies of files near users) and use read replicas for the database.
@@c3 Apps with files and slow work
Uploads go straight to object storage. A queue and workers resize, scan, or convert them. The user sees "processing" and then "done". Notifications and emails also use a queue.
@@c4 Apps with money or many customers
Payments need unique request keys so a retry never charges twice, and a record of every step. SaaS apps (software sold to many companies) must keep each customer's data separate and fair: one noisy customer must not slow the others.
@@example Chat in one paragraph
Messages arrive at the API and are saved. Online users are connected by a live connection so new messages appear immediately. If someone is offline, the message waits in the database and a push notification goes through a queue. Messages are sorted by time within each conversation.
@@use
1. An online shop with product pages, a cart, and checkout.
2. A video site with uploads, conversion, and viewing.
3. A notes app that works offline and syncs when the phone reconnects.
@@wrong
Mistakes: copying a giant company's design for a small app, forgetting the failure cases for payments and uploads, and leaving out limits (file size, rate, page size). Every recipe needs a limit for each thing that can grow.

=== 19
@@picture
A glossary is the dictionary at the back of a book. When a word is new, you look it up. This one is for system design, and every word has a short, plain meaning.

Below it you will find checklists, like a pilot's checklist before takeoff, and some practice questions with worked answers so you can test yourself.
@@diagram
flowchart LR
    A["Read a word"] --> B["Say it in your own words"]
    B --> C["Use it in a drawing"]
    C --> D["Check with the list"]
@@goal
- Look up any system design word quickly.
- Use a checklist before saying "this design is done".
- Answer practice questions and compare with worked answers.
@@words
- **availability**: how often the system is up and working.
- **latency**: how long one request takes.
- **throughput**: how many requests are finished per second.
- **cache**: a quick copy of data.
- **queue**: a waiting line for jobs.
- **replica**: an extra copy.
- **shard**: one slice of a big dataset.
- **idempotent**: safe to do twice.
@@why
Words are the tools of thinking. When you own the words, you can have clear conversations and read any design document without getting lost.
@@c1 The "before you say done" checklist
Did I write requirements and numbers? Do I know the bottleneck? Does each box have an owner? What happens when each box fails? How do I watch it? How do I deploy and go back? If you can answer these, your design is in good shape.
@@c2 Practice answer: a link shortener
Needs: create a short link and open it fast. Numbers: 1 million creates per day is about 12 per second; opens are 10 times more, about 120 per second. Plan: API, database, cache for popular links. Risk: reading is the bottleneck, so cache. Rejected: sharding, not needed yet.
@@c3 Practice answer: a notification system
Needs: send a message to many people without slowing the main app. Plan: the app puts a notification job in a queue; workers send it by email or push. Safety: retries with limits, a dead-letter box, and a unique key so nobody gets the same message twice.
@@c4 Spaced review
Review each lesson after one day, one week, and one month. Cover the page, draw the diagram from memory, and say the five questions. The effort of remembering is what makes it stick.
@@example A self-check
Pick any app you use daily. In two minutes, write: three things it must do, one quality goal, one number, one failure, and the simplest set of boxes. If you can, you have the skill of system design.
@@use
1. Before a design review, a team goes through the checklist.
2. A student studies the glossary every Friday.
3. A new teammate reads the glossary to understand the whiteboard on day one.
@@wrong
Mistake: memorizing words without drawing anything. A word only becomes yours when you can use it on a picture of a real system. Another mistake is treating the checklist as a form to tick without thinking.
