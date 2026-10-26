=== 07
@@picture
Suppose your teacher keeps asking you, "What is 12 times 12?" The first time you work it out. After that you write "144" on a sticky note and stick it on your desk. Now you do not need to calculate again. You just look at the note.

A cache is that sticky note. The slow place (the database) holds the true answer. The cache holds a quick copy. The only risk is that the answer changes and your sticky note says the old thing.
@@diagram
flowchart TD
    R["Someone asks for a note"] --> H{"Is it in the cache?"}
    H -->|"Yes: hit"| A["Answer right away"]
    H -->|"No: miss"| D[("Ask the database")]
    D --> F["Save a copy in the cache"]
    F --> A
@@goal
- Explain cache hit, miss, and "stale" (out of date).
- Describe cache-aside: look, fetch, fill.
- Pick a sensible freshness time (TTL) and know when to throw a copy away.
@@words
- **cache**: a quick copy of data kept close to where it is needed.
- **hit**: the copy was in the cache.
- **miss**: the copy was not in the cache.
- **TTL**: "time to live", how long a copy is allowed to be used.
- **stale**: out of date.
- **invalidation**: removing or refreshing a copy when the real data changes.
@@why
Some questions are asked again and again and the answer rarely changes: a product page, a profile picture, a list of countries. Doing the slow work every time is wasteful. A quick copy saves time and lets the database rest.
@@c1 A cache is only a copy
The database is the boss. The cache is the helper. If the cache is wiped, nothing is lost; we just fetch from the database again. Never keep the only copy of something important in a cache.
@@c2 The key must include who may see it
A cache stores things under a name, called a key. If the key is just "my-notes", then Maria could get Tom's notes! Always include the user (or any other rule that decides who may see it) in the key, like "notes:user42".
@@c3 TTL: how old is too old?
A TTL says "this copy is good for 60 seconds, then we fetch fresh". A short TTL means fresher data but more database work. A long TTL means faster but older data. Pick it by asking: what is the worst thing that happens if someone sees a one-minute-old answer?
@@c4 Throw the copy away when data changes
When someone edits a note, remove its cache entry right away. The next reader gets a miss and fills in a fresh copy. Waiting for the TTL to run out would be okay for some data, but for a bank balance it is not.
@@example The popular video
A video is watched 100,000 times an hour. Its title and description rarely change. The first viewer causes a miss and the app loads it from the database and saves a copy for 5 minutes. The next 99,999 viewers get the copy instantly. The database did one job instead of 100,000.
@@use
1. A news site caches the front page for 30 seconds.
2. An online shop caches product details but never caches the "items in your cart" for other people.
3. A game caches the top-10 scoreboard and refreshes it every few seconds.
@@wrong
Danger 1: stale data, when a cache keeps old information too long. Danger 2: a stampede, when a popular copy expires and thousands of people ask the database at the same instant. A fix is to let just one request rebuild it while the others wait or use the slightly old copy. Danger 3: a cache with no size limit that eats all the memory. Pick a size and a rule for what to remove first.

=== 08
@@picture
At a busy bakery you place an order, get a number, and sit down. You do not stand at the counter blocking everyone while the cake bakes. When your number is called, you collect it.

A queue works like that number system. The app takes your request, writes it on a ticket, and puts the ticket in a line. Workers pick tickets one at a time and do the slow job. Visitors are never stuck waiting.
@@diagram
flowchart LR
    A["App takes the request"] --> Q["Queue: the line of tickets"]
    Q --> W["Worker does the slow job"]
    W --> R["Result saved"]
    W -->|"keeps failing"| X["Dead-letter box for a human"]
@@goal
- Explain producer, queue, and worker.
- Tell a command from an event.
- Know why retries, a dead-letter box, and a size limit are needed.
@@words
- **queue**: a line of jobs waiting their turn.
- **producer**: whoever puts jobs in the line.
- **worker**: whoever takes jobs out and does them.
- **event**: a message saying "this happened", like "note saved".
- **command**: a message saying "please do this".
- **dead-letter queue**: a special box for jobs that failed too many times.
@@why
Some jobs are slow: making a report, sending a thousand emails, resizing photos. If the visitor must wait for them, the page feels broken. And when traffic suddenly spikes, a queue lets the workers work at a steady pace instead of falling over.
@@c1 Hand off the slow part
The visitor needs only a quick "we got it" answer. The slow part happens in the background. The API replies with status 202, which means "accepted", and a ticket number for checking progress.
@@c2 Commands and events
"Send the welcome email" is a command: someone is asked to do something. "User signed up" is an event: a fact that other parts may care about. Events are great because many listeners can react without the sender knowing about them.
@@c3 Failures are normal
A worker might crash, or an email server might be down. So the job goes back into the line and tries again after a wait. If it fails five times, it moves to the dead-letter box and an alert tells a human. Jobs are never silently lost.
@@c4 Keep the line short on purpose
If jobs arrive faster than workers can finish, the line grows forever and memory runs out. Set a size limit. When the line is full, say "please try later" instead of crashing. This is called backpressure: pushing back gently when we are too busy.
@@example Resizing photos
You upload a picture. The app saves the original and puts a ticket "resize photo 42" in the queue. It replies "uploaded!" in a blink. A worker later makes the small, medium, and large versions. If the worker crashes halfway, the ticket returns to the line and another worker finishes it.
@@use
1. A store sends order emails from a queue after checkout.
2. A video site converts uploads into different qualities in the background.
3. A bank sends daily statements as thousands of small jobs, not one giant job.
@@wrong
Mistakes: a retry that makes the same job happen twice (so jobs must be safe to repeat), a queue with no size limit, forgetting the dead-letter box so failing jobs retry forever, and not showing any status so users wonder "did it work?".

=== 09
@@picture
Imagine a class has one big whiteboard with the score, and many students copy the score into their notebooks. When the teacher changes the score, the notebooks are a few seconds behind. If you look at a notebook, you might see the old score.

Databases with copies are the same. A write goes to the main copy first and reaches the others slightly later. This delay is the heart of this whole lesson.
@@diagram
flowchart LR
    W["Write: score = 10"] --> P[("Primary copy")]
    P -->|"a moment later"| R1[("Replica 1")]
    P -->|"a moment later"| R2[("Replica 2")]
    U["Reader"] --> R2
@@goal
- Explain what a transaction (all-or-nothing) is.
- Tell strong consistency from eventual consistency.
- Explain why we cannot "undo everything" across many services.
@@words
- **transaction**: a group of changes that all happen or none happen.
- **ACID**: four promises of a safe transaction: all-or-nothing, correct, separate, and saved.
- **replica**: a copy of the data on another machine.
- **replication lag**: the small delay before a copy catches up.
- **strong consistency**: everyone always sees the newest data.
- **eventual consistency**: everyone will see the newest data soon, but maybe not instantly.
@@why
When many people change data at the same time, or the data lives on many machines, strange things can happen: lost updates, double charges, old answers. Consistency rules tell us what to expect.
@@c1 A transaction is a sealed envelope
Moving 10 dollars from Ann to Ben is two steps: take from Ann, give to Ben. If the computer stops between the steps, 10 dollars vanish! A transaction packs both steps into one sealed envelope. Either both happen, or neither does.
@@c2 Copies can be behind
Read copies help many people read at once. But right after you save a note, a read from a copy that has not caught up might not show it. A common fix: for a short time after a write, send that user's reads to the main copy ("read your own writes").
@@c3 Two people, one thing
If Ann and Ben both edit the same note, the second save can silently erase the first. A version number helps: "I am editing version 3". If the note is now version 4, the save is refused and Ben is asked to look again.
@@c4 Across services there is no magic rollback
A transaction works inside one database. When an order touches payments, shipping, and email (three services), no single rollback exists. Instead we use a saga: each step has an "undo step". If shipping fails, we run "refund payment". It is more work, so use one database when you can.
@@example A bank transfer
Ann sends 10 dollars to Ben. The bank starts a transaction. It subtracts 10 from Ann, adds 10 to Ben, and then commits. If the power fails between the steps, the database rolls back and both balances stay as they were. Nobody loses money.
@@use
1. A shop reduces stock and creates an order in one transaction.
2. A social app shows a "like" count that may be a few seconds behind, which is fine.
3. A travel site uses a saga: book flight, book hotel, and if the hotel fails, cancel the flight.
@@wrong
Mistakes: assuming a replica is always current, assuming a timeout means a write failed (it may have succeeded!), and assuming you can wrap many services in one transaction. Decide for each feature: must it be exactly current, or is "soon" good enough? Then write that choice down.

=== 10
@@picture
When a lunch line gets too long, a school has two choices. It can hire a faster lunch lady (bigger machine), or it can open more serving lines (more machines). Opening more lines is cheaper and can go on and on, but now kids must be sent to the right line.

That is scaling. A bigger machine is called **vertical** scaling. More machines is **horizontal** scaling. Splitting the data across machines is called **sharding**.
@@diagram
flowchart TD
    M["Measure: what runs out first?"] --> V["Bigger machine: vertical"]
    M --> H["More machines: horizontal"]
    M --> C["Copies for reading: replicas"]
    M --> S["Slices of data: shards"]
@@goal
- Tell vertical from horizontal scaling.
- Explain replicas and shards in simple words.
- Spot a hot key and know that autoscaling is not magic.
@@words
- **vertical scaling**: giving one machine more power.
- **horizontal scaling**: adding more machines.
- **replica**: an extra copy of data or a running app.
- **shard**: one slice of a big dataset.
- **partition key**: the value that decides which shard a piece of data goes to.
- **hot key**: one key that gets far more traffic than the others.
@@why
One machine has a limit. Before it gets full, we need a plan. But scaling adds cost and complication, so we only do it when measurement says we must.
@@c1 Bigger or more?
Making one machine bigger is the easiest first step. It has a limit, though, and if it breaks everything stops. Adding more machines has no hard limit and survives failures, but your app must be built so any machine can answer any request (stateless).
@@c2 Copies help reading
If most people only read, add replicas. They share the reading work. But remember lag: replicas can be a moment behind. Replicas do not help if the problem is too many writes.
@@c3 Shards slice the data
When one database cannot hold all the data, we slice it. For example, users A to M go to shard 1 and N to Z go to shard 2. A rule called the partition key decides where each row goes. Pick a key that spreads people out evenly.
@@c4 Beware of the hot key
If one celebrity has ten million followers, the shard that holds them is busy while the others nap. This is a hot key. Adding machines will not fix it. We need to spread that one popular key, for example by caching it or splitting it into several keys.
@@example Slicing a user table
A table with 100 million users is too big for one machine. We shard by user id: id modulo 4 gives 0, 1, 2, or 3, and each number is one shard. User 42 goes to shard 2 (because 42 divided by 4 leaves 2). A small router remembers the rule.
@@use
1. A website adds three more app servers behind a load balancer on sale day.
2. A report page reads from replicas so the main database stays free for writes.
3. A chat service shards messages by conversation id.
@@wrong
Mistakes: scaling before measuring, picking a shard key that puts everything in one shard, forgetting how to move data when you add a shard, and forgetting that a bigger machine still has one point of failure. Measure first, then change one thing, then measure again.

=== 11
@@picture
When a car gets a flat tire, a careful driver has a spare, knows how to change it, and stops driving on a bad tire. A system that is reliable does the same: it expects things to break and has a plan.

Reliable does not mean "never breaks". It means "when it breaks, it breaks gently, tells the truth, and recovers fast".
@@diagram
flowchart LR
    C["Call a helper"] --> T{"Answer in time?"}
    T -->|"Yes"| OK["Use the answer"]
    T -->|"No"| R["Wait, then retry a few times"]
    R --> B{"Still failing?"}
    B -->|"Yes"| X["Circuit breaker: stop calling for a while"]
    X --> F["Show a safe fallback message"]
@@goal
- Use timeouts, retries, backoff, and jitter correctly.
- Explain a circuit breaker and a bulkhead.
- Describe a fallback that is honest, not a fake success.
@@words
- **timeout**: the longest time we wait.
- **backoff**: waiting longer between each retry.
- **jitter**: adding a random bit to the wait so everyone does not retry together.
- **circuit breaker**: a switch that stops calls to something that keeps failing.
- **bulkhead**: separate compartments so one leak cannot sink the whole ship.
- **graceful degradation**: working a little less well instead of not at all.
@@why
In a system with many parts, something is always broken somewhere. A tiny failure can grow into a big outage if everyone keeps pounding on the broken part. Good habits stop the spread.
@@c1 Retry, but not forever
Retry when the problem might go away, like a short network hiccup. Stop after a few tries. Only retry actions that are safe to repeat, or give them a unique key so repeating is harmless.
@@c2 Add waiting and a pinch of randomness
First retry after 1 second, then 2, then 4. Adding a random bit means ten thousand clients do not all retry at the exact same moment. This is the difference between a gentle knock and a stampede.
@@c3 The circuit breaker
At home, a circuit breaker switches off power when something is wrong so the wires do not burn. In software, when a helper fails again and again, the breaker "opens" and calls stop for a while. Every so often one test call checks if the helper is better. If so, the breaker closes.
@@c4 Fallback, but be honest
If the recommendations helper is down, show popular items instead. That is a good fallback. But if the database is down, do not show an empty list that looks like "you have no notes". That would frighten people. Say clearly: "We cannot load your notes right now. Please try again."
@@example The weather widget
A news site shows weather from another service. One day the weather service is slow. Without a timeout, every news page waits and the entire site slows down. With a 1-second timeout and a breaker, the site shows "weather unavailable" in the corner and everything else loads at normal speed.
@@use
1. A shop retries payments carefully using a unique request key.
2. A video site shows lower quality when the network is poor.
3. An app keeps a separate pool of workers for emails so a flood of emails cannot block checkout.
@@wrong
Mistakes: no timeout, unlimited retries, retrying actions that are not safe to repeat, and fallbacks that hide real failure. A "successful" empty answer can be worse than an error, because nobody knows anything went wrong.

=== 12
@@picture
A school has doors, guards, and keys. Visitors sign in at the front desk, students carry ID cards, teachers have keys to their classrooms only, and the principal's office is locked. Nobody has more access than they need.

Security in apps is the same. We decide **who you are**, **what you may do**, and we keep secrets locked away. Most importantly, we never trust the browser, because anyone can change what the browser sends.
@@diagram
flowchart LR
    B["Browser: not trusted"] --> G["Gateway: HTTPS and rate limits"]
    G --> A["API: who are you?"]
    A --> Z["Is this record yours?"]
    Z --> D[("Data")]
@@goal
- Tell authentication from authorization.
- Explain least privilege and why secrets stay on the server.
- Know what must never appear in logs.
@@words
- **authentication**: proving who you are, like showing your ID.
- **authorization**: checking what you are allowed to do, like checking the guest list.
- **least privilege**: giving only the access needed for the job.
- **encryption**: scrambling data so only the right person can read it.
- **secret**: a password or key that must stay private.
- **threat**: a way something bad could happen.
@@why
Apps hold private things: messages, photos, money. One missing check can show one person's data to everybody. We think like a villain for a few minutes so we can block the doors they would try.
@@c1 Who are you, and what can you do?
Authentication answers "who are you?" with a password or token. Authorization answers "may you open this note?" A person can be logged in and still not be allowed to see someone else's note. Both checks are needed on every request.
@@c2 Hiding a button is not security
A button can be hidden on the screen, but anyone can still send the request by hand. The check must happen on the server, where the person cannot change the code.
@@c3 Keep secrets in a safe place
Passwords and keys do not belong in the code, in the browser, or in a link. They live in protected settings on the server, and only the parts that really need them can read them. If a key leaks, replace it right away.
@@c4 Give only what is needed
A service that only reads notes should not have permission to delete them. If it gets hacked, the damage is small. Also, check any web address a visitor gives you, so your server cannot be tricked into visiting private places.
@@example The wrong note
Tom is logged in and asks for GET /notes/57. The app checks: is Tom signed in? Yes. Does note 57 belong to Tom? No, it belongs to Maria. The answer is "not found" (404). Tom learns nothing, not even that note 57 exists.
@@use
1. A bank asks for a second code when you log in from a new phone.
2. A school app lets teachers see only their own classes.
3. A server's database password is read from protected settings, never written in the code.
@@wrong
Mistakes: trusting the browser, putting passwords in code that is shared, giving one master key to everything, and writing private data into logs. Logs are read by many people, so they must never contain passwords, tokens, or private messages.

=== 13
@@picture
A car has a dashboard: a speedometer, a fuel gauge, and warning lights. You do not need to open the engine to know something is wrong. A good system has a dashboard too.

We use three tools to see inside. **Logs** are a diary of what happened. **Metrics** are a scoreboard of numbers. **Traces** are an itinerary that shows the path of one request. A shared **request ID** ties all three together.
@@diagram
flowchart LR
    R["Request with an ID"] --> L["Logs: diary"]
    R --> M["Metrics: scoreboard"]
    R --> T["Traces: itinerary"]
    M --> A["Alert to a person"]
    A --> RB["Runbook: what to do"]
@@goal
- Explain logs, metrics, and traces with one example.
- Tell liveness from readiness.
- Describe a useful alert and a short incident review.
@@words
- **log**: a written note about something that happened.
- **metric**: a number counted over time, like errors per minute.
- **trace**: a map of one request's trip through many parts.
- **SLO**: a goal for how good the service should be, like "99.9 percent of requests succeed".
- **alert**: a message that tells a person to act.
- **runbook**: a short "if this happens, do this" guide.
@@why
Without a dashboard, you learn about a problem when users complain. With one, you often know first and can fix it before most people notice.
@@c1 Follow one request with an ID
Give every request a unique ID and put it into every log line. When a user says "my save failed", you search that ID and see every step the request took, from start to the exact line that broke.
@@c2 Look at slow cases, not only the average
Say 99 requests take 1 second and 1 request takes 100 seconds. The average looks fine at about 2 seconds, but one person is very unhappy. Look at the slowest few percent (the 95th or 99th percentile) to see how bad it gets.
@@c3 Alive is not the same as ready
Liveness asks, "Is the program running?" Readiness asks, "Can it actually serve people right now, with its database connected?" A running app that cannot reach its database is alive but not ready, and the load balancer should stop sending visitors to it.
@@c4 Alerts need an owner and a next step
An alert that wakes someone up must say what is wrong and what to check first. After every big problem, hold a calm review: what happened, why, and what will we change? Blame nobody. Fix the system.
@@example The slow checkout
Customers say checkout is slow. The metrics dashboard shows the delay started at 2:15 pm. Traces show the slow part is the payment helper. Logs with the request ID show that helper timed out three times. The team adds a timeout and a fallback, and the delay disappears.
@@use
1. A website shows a dashboard of requests per second and errors.
2. A phone app sends crash reports so developers can see what broke.
3. An on-call engineer follows a runbook to restart a stuck worker.
@@wrong
Mistakes: logging private data, logging nothing useful ("error happened"), measuring only averages, and alerts so noisy that people ignore them. A good alert is rare, clear, and means "do something now".
