=== 00
@@picture
Imagine you are going to build a lemonade stand. Before you buy a single lemon, you would ask some questions. Who will buy lemonade? How many cups will we sell on a hot day? What if we run out of cups? What if it rains?

System design is exactly this, but for apps and websites. Instead of lemons and cups, we think about screens, servers, and data. We ask the questions first, and we draw the plan before we build.

This course is like a ladder. Each lesson is one step, and every step is small. If you go in order, you will never be lost.
@@diagram
flowchart LR
    A["Ask: who uses it?"] --> B["Count: how much?"]
    B --> C["Draw: the boxes"]
    C --> D["Test: what breaks?"]
    D --> E["Explain: why this plan"]
@@goal
- Name the five questions you ask before building anything.
- Follow the study routine: read, draw, explain, review.
- Know what "good enough" looks like at the end of the course.
@@words
- **system**: a group of parts that work together to do a job, like the parts of a bicycle.
- **component**: one part of a system, such as the database or the app.
- **trade-off**: you get something good and you give up something else.
@@why
Big apps are built by many people over many months. If everyone just starts typing code, the pieces do not fit together. A plan on paper is cheap to change; a finished app is expensive to change.
@@c1 The five questions
Every design starts with the same five questions. **Who** is using it? **What** do they need to do? **How much** will they do it? **What can go wrong?** And finally, **what is the simplest plan that works?** If you can answer these five, you already think like a system designer.
@@c2 Draw before you build
A drawing of boxes and arrows is the cheapest way to find a mistake. Erasing an arrow takes one second. Rewriting a month of code takes a month. So we draw first, argue about the drawing, and only then build.
@@c3 Use a notebook
Keep a design notebook. For every lesson write three things: a picture, a number, and one sentence that begins with "I chose this because...". Looking back at your notebook next week is the best way to remember.
@@c4 Practice in small loops
Read a little, close the page, and explain it out loud like you are teaching a friend. If you get stuck, that is the exact spot to read again. Come back after a day, a week, and a month. Remembering gets stronger each time you try.
@@example A lemonade stand plan
Ten friends will visit your stand each hour. Each person buys one cup. That is 10 cups per hour, so one pitcher (8 cups) lasts about 48 minutes. Now you know when to refill. You did a design with only counting! Real systems do the same thing with bigger numbers: users, requests, and storage.
@@use
1. A student plans a school notes app: who will use it, how many notes, what could break.
2. A small shop owner decides whether their online store needs one server or many.
3. A team reviews a drawing together and finds a missing "what if the database is down?" box before writing code.
@@wrong
The most common mistake is to skip the questions and jump to fancy tools. Another is to draw a giant plan with every box you have ever heard of. Big plans are harder to build and harder to fix. If a simple plan answers the five questions, stop there.

=== 01
@@picture
Think of a restaurant. There is a front door where people come in, a waiter who takes orders, a kitchen that makes food, and a storeroom for ingredients. Each place has its own job, and each one knows who it talks to.

A software system is a restaurant for data. The **screen** is the front door, the **app** is the waiter, the **database** is the storeroom, and the **workers** are the cooks. If we know who owns each room, nothing gets lost.
@@diagram
flowchart LR
    U["Visitor"] --> W["App (the waiter)"]
    W --> D[("Database (the storeroom)")]
    W --> Q["Waiting line"]
    Q --> K["Workers (the cooks)"]
@@goal
- Explain what a system, a component, and a boundary are.
- Trace one request from the screen to the data and back.
- Tell the difference between "simple" and "complicated" designs.
@@words
- **system**: many parts working together to do one job.
- **component**: one part of the system with one clear job.
- **boundary**: the line between two parts, like a door. Things cross it only in agreed ways.
- **request**: a message that asks the system to do something.
- **state**: the information the system remembers, like your saved notes.
- **owner**: the one part that is in charge of a piece of data.
@@why
When everything is tangled in one pile, changing one thing breaks another thing. Giving each part a clear job and a clear door makes changes safer. But splitting too much has a cost too: more doors means more walking. We want just enough parts.
@@c1 A monolith is one big building
A monolith is an app that is built and shipped as one piece. It is not bad! A school with all classrooms under one roof is easy to run. A well-organized monolith has tidy rooms inside, so each part has clear owners, and nobody needs to cross a street to talk.
@@c2 Split only for a real reason
We pull a part out into its own service when it needs to grow alone or be released alone. For example, a photo-resizing helper that needs ten times more computers than the rest. If there is no such reason, keeping it inside is easier and cheaper.
@@c3 An outbox is a safe to-do note
Imagine you save a new note and must also tell another team. If the telling fails, the note exists but nobody knows. An outbox is a sticky note you put in the same drawer, in the same moment, as the note itself. Later a helper reads the sticky notes and sends the messages.
@@c4 Reading and writing can be separated
Some apps read data a million times for each write. CQRS is a fancy name for using one path for reading and another for writing, so each can be built for its job. It is helpful in a few cases and extra work in most, so start without it.
@@example Follow one tap
You tap "Save note". 1) The screen sends a request. 2) The app checks that the title is not empty. 3) The app writes the note to the database. 4) The app puts a message "note saved" in the waiting line. 5) A worker sends a notification. 6) The app tells you "Saved!". Each step has one owner, and each arrow is a door.
@@use
1. A to-do app with one app and one database, organized in tidy folders.
2. A shop that moves "send email receipts" into a worker so checkout stays fast.
3. A game company that puts chat in a separate service because chat needs to grow much faster than the rest.
@@wrong
A common mistake is to build ten tiny services before you have ten problems. Each service needs its own setup, monitoring, and release. Another mistake is two parts both thinking they own the same data, so they overwrite each other. Give every piece of data exactly one owner.

=== 02
@@picture
Planning a school bus route is a lot like planning an app. You ask: how many children ride? What time do they have to arrive? How many seats does one bus have? From the answers you learn how many buses you need.

For apps we do the same with **requests**. If 1,200 people each press a button once a minute, that is 1,200 divided by 60, so 20 requests every second. You did not need to build anything to learn that number!
@@diagram
flowchart LR
    A["Users: 1200"] --> B["Each acts once per minute"]
    B --> C["1200 / 60 = 20 per second"]
    C --> D["Busy time: maybe 3x = 60 per second"]
@@goal
- Tell "what it must do" apart from "how well it must do it".
- Turn users and actions into requests per second.
- Estimate storage and write down which numbers are guesses.
@@words
- **functional requirement**: something the system must do, like "save a note".
- **quality requirement**: how well it must do it, like "answer in under half a second".
- **RPS**: requests per second, a measure of how busy the system is.
- **latency**: how long one request takes, from start to finish.
- **availability**: the part of the time the system is up and working.
- **peak**: the busiest moment, which is usually much higher than average.
@@why
If you guess wrong about size, you either build a giant machine nobody needs or a tiny one that falls over on day one. A few minutes of counting makes the guess much smarter.
@@c1 Two kinds of requirements
"The app lets me save a note" is what it does. "Saving takes less than one second and works 99.9 percent of the time" is how well it does it. Always write both kinds, because a note app that takes 30 seconds to save is technically working but nobody will use it.
@@c2 Average is not peak
If a shop sells 100 cups all day, that is not 100 every hour. Most might be sold between noon and 1 pm. Systems must survive the busy hour, not the quiet average. A good rule is to multiply the average by two or three to guess the peak, and then measure the real number later.
@@c3 Estimate storage with multiplication
Storage is how many things times how big each one is times how long you keep it. One million notes at 2 kilobytes each is 2 gigabytes. Write down your numbers and say which are guesses. Guesses are fine, as long as you label them as guesses.
@@c4 Start with the smallest plan
After you count, ask: can one normal machine do this? One machine can often handle hundreds of requests per second. If your number is 20, you probably do not need ten servers. The best plan is the smallest one that meets the numbers you wrote down.
@@example Counting a notes app
Say 10,000 students use the app. On a school day, 1,000 are online at the same time. Each one saves or reads a note about once every 20 seconds. That is 1,000 divided by 20, or 50 requests per second. If a note is 2 KB and each student keeps 200 notes, storage is 10,000 times 200 times 2 KB, which is 4 GB. One database server can hold that comfortably.
@@use
1. A concert ticket site counts how many people click "buy" in the first minute.
2. A photo app estimates storage, because photos are much bigger than text.
3. A school app checks that exam-day traffic is not 10 times higher than normal.
@@wrong
Mistake one: using the average and forgetting the busy hour. Mistake two: writing a number with no unit, such as "1000" (per second? per day?). Mistake three: presenting a guess as a fact. Always write the unit, and write "assumption" next to numbers you did not measure.

=== 03
@@picture
A big app is made of the same few building blocks, like a box of LEGO. There is the **client** (the screen), the **API** (the front desk), a **database** (the storeroom), a **cache** (a sticky note), a **queue** (a waiting line), **workers** (helpers), a **load balancer** (a traffic guard), and **object storage** (a garage for big files).

Once you know what each block is for, a big diagram stops being scary. It is just these blocks, in different places.
@@diagram
flowchart LR
    C["Client"] --> G["Load balancer"]
    G --> A["API servers"]
    A --> K["Cache"]
    A --> D[("Database")]
    A --> Q["Queue"]
    Q --> W["Workers"]
    W --> O[("Object storage")]
@@goal
- Say what each building block is for in one sentence.
- Pick the blocks a simple app really needs.
- Draw a basic system from memory.
@@words
- **client**: the app or website a person uses.
- **API**: the front desk that takes requests and gives answers.
- **database**: the storeroom where information is kept for a long time.
- **cache**: a quick copy of data that is nearby.
- **queue**: a waiting line for jobs.
- **load balancer**: a guard that spreads visitors across servers.
@@why
Without common names for the blocks, two people can never agree on a plan. With them, one drawing explains a whole system in a minute.
@@c1 API and database: the core pair
Most apps need only these two. The API receives requests and applies rules. The database remembers things after the app restarts. A notes app with only an API and a database can serve thousands of people.
@@c2 Cache and queue: fast and patient
A cache makes repeat questions fast. A queue makes slow jobs patient. Add a cache when reading is slow. Add a queue when a job takes too long to finish before the user leaves the page.
@@c3 Load balancer and many servers
When one server is not enough, we run several copies and put a load balancer in front. It is like a host at a restaurant who sends each group to a table with free seats. If one server breaks, the host just stops sending people there.
@@c4 Object storage for big files
Photos, videos, and PDFs are big. We keep them in object storage, which is like a huge garage built for big things, and keep only a short address (a link) in the database. This keeps the database small and fast.
@@example Which blocks does a photo-sharing app need?
Users upload photos: **object storage** for the pictures. Users see their feed: **API** and **database** for the list. The feed is read much more than written: add a **cache**. Photos need small thumbnails: put the job in a **queue** and let **workers** resize them. Many users: a **load balancer** in front of several API servers.
@@use
1. A blog uses just an API and a database.
2. An online shop adds a queue so emails are sent after checkout.
3. A video site stores videos in object storage and shows them from a nearby copy.
@@wrong
It is tempting to add every block "just in case". Each block is something that can break, costs money, and must be watched. A cache with bad rules can show old data. A queue with no size limit can fill up memory. Add a block only when you can name the problem it solves.

=== 04
@@picture
When you type a web address, a lot happens in a split second, like a relay race. First your computer looks up the number for the name, the way you look up a phone number. Then it makes a safe connection, and then it sends your message.

Each runner in this race has a different job, and each one can be slow or break. A good designer knows who the runners are and sets a time limit so the race never goes on forever.
@@diagram
flowchart LR
    A["Name: notes.example.com"] --> B["DNS finds the number"]
    B --> C["TCP opens a connection"]
    C --> D["TLS makes it private"]
    D --> E["HTTP sends the request"]
    E --> F["Server replies"]
@@goal
- Explain DNS, TCP, TLS, and HTTP as steps of one trip.
- Say why every call needs a time limit.
- Explain why retries must be careful.
@@words
- **DNS**: the phone book that turns a name into a number address.
- **TCP**: a careful way to send data so nothing is lost or mixed up.
- **TLS**: a lock that scrambles messages so strangers cannot read them.
- **HTTP**: the language browsers and servers use to ask and answer.
- **timeout**: the longest we are willing to wait.
- **retry**: trying again after a failure.
@@why
Each step in the trip solves a different problem: finding, connecting, hiding, and asking. If you do not know the steps, a slow web page is a mystery. If you do, you can say exactly where the time went.
@@c1 DNS is the phone book
Computers find each other by numbers like 203.0.113.7, but people remember names. DNS is the service that turns the name into the number. It does not decide who may see your data. It only finds the address.
@@c2 TLS is the lock
The little padlock in the browser means TLS is on. It scrambles the message so nobody in the middle can read it, and it proves the server is the real one. But TLS does not know if you are allowed to read a certain note. That is still the app's job.
@@c3 Always set a timeout
Imagine waiting at a door for a friend who never comes. A timeout is a rule that says "I will wait five seconds, then I go on." Without it, one slow helper can freeze the whole app, because everyone is stuck waiting.
@@c4 Retry carefully
If a call fails, trying again can help. But if a thousand callers all retry at the same moment, they can knock the helper down again. So we wait a little longer each time (backoff) and add a bit of randomness (jitter). We also only retry actions that are safe to do twice.
@@example Why does the page take 3 seconds?
Looking at the trip: DNS 50 ms, connection 100 ms, TLS 100 ms, the server thinks 2,500 ms, the reply 250 ms. The slow part is clearly the server. Without breaking the trip into steps, you might have blamed the internet.
@@use
1. A phone app sets a 10-second limit for loading a feed and then shows "try again".
2. A server calls a payment helper with a 3-second timeout and a safe retry.
3. A team measures each step of a slow page to find the real slow step.
@@wrong
Waiting forever is the biggest mistake. Retrying instantly and without limit is the second. And the third is believing TLS makes a request safe. TLS protects the road, not the destination. The app must still check who is asking and what they may do.

=== 05
@@picture
An API is a menu in a restaurant. The menu lists what you can order, and how to ask for it. You do not walk into the kitchen. You say "I would like the soup" and the waiter brings it.

For an app, the menu is a list of **endpoints** like "GET /notes" (show me the notes) and "POST /notes" (make a new note). The rules about what to send and what comes back are called a **contract**. If both sides keep the contract, different people can build different parts and everything still fits.
@@diagram
flowchart LR
    A["Client asks: GET /notes?limit=20"] --> B["API checks the contract"]
    B --> C["Service does the work"]
    C --> D["Answer: 200 and a list of 20"]
@@goal
- Read and write a simple API contract.
- Pick the right method and status code.
- Explain pagination, versioning, and idempotency in plain words.
@@words
- **endpoint**: one address on the API that does one job.
- **method**: the action word: GET reads, POST creates, PUT or PATCH changes, DELETE removes.
- **status code**: a number that tells how the request went, like 200 (ok) or 404 (not found).
- **pagination**: giving a long list in small pages.
- **idempotent**: doing it twice gives the same result as doing it once.
- **contract**: the written promise about what is sent and what comes back.
@@why
When many apps use the same API, a surprise change breaks them all. A clear contract, written down and tested, lets people change what is inside without breaking those outside.
@@c1 Pick the right method
GET only looks, never changes. POST creates something new. PUT replaces the whole thing, PATCH changes part of it, and DELETE removes it. Using the right word helps everyone guess how it behaves, and helps computers decide what is safe to repeat.
@@c2 Status codes are traffic lights
200 means ok. 201 means "created". 400 means "your request is wrong". 401 means "who are you?". 403 means "I know you, but no". 404 means "I cannot find it". 500 means "my fault, something broke". A good API uses the right one, so the caller knows what to do next.
@@c3 Give lists in pages
If you have a million notes, you do not send a million in one answer. You send 20 at a time and say how to get the next 20. This keeps answers small and fast. Always have a limit, and always sort in a steady order so pages do not repeat.
@@c4 Make retries safe with a key
Suppose a "create order" call times out. Did it work or not? If the client retries and it worked, you now have two orders! An idempotency key is a unique number the client sends with the request. The server remembers it, and if it sees the same key again, it returns the first answer instead of creating a new order.
@@example Creating a note safely
The client sends POST /notes with a title and an idempotency key "abc-123". The server saves the note and replies 201 with the new note's address. The reply gets lost. The client retries with the same key "abc-123". The server sees it already did that, and replies with the same note. One note, no duplicate.
@@use
1. A weather app calls GET /forecast?city=Paris.
2. A payment page uses an idempotency key so you are never charged twice.
3. A mobile app keeps using version 1 of the API while a new version 2 is being tested.
@@wrong
Mistakes: a GET that secretly changes data, a list with no limit, an error that shows the raw database message, and a change that removes a field old apps still use. Add new things, and remove old things only after telling everyone.

=== 06
@@picture
A database is like a very organized school office. Every student has a file card with the same boxes: name, class, birthday. Cards are kept in drawers, each card has a unique number, and a rule says you cannot write two cards with the same number.

Choosing a database is choosing which kind of office you need. Most of the time, the tidy office with file cards (a relational database) is the right pick.
@@diagram
flowchart TD
    Q{"What does the data look like?"} -->|"Tidy rows"| R["Relational: PostgreSQL"]
    Q -->|"Key to value"| K["Key-value: Redis"]
    Q -->|"Flexible shapes"| D["Document: MongoDB"]
    Q -->|"Search by words"| S["Search engine"]
    Q -->|"Big files"| O["Object storage"]
@@goal
- Describe tables, rows, keys, and indexes in plain words.
- Choose between relational, key-value, document, search, and object storage.
- Explain who owns data and why migrations matter.
@@words
- **table**: a grid of rows and columns, like a spreadsheet.
- **primary key**: the unique number that identifies one row.
- **foreign key**: a number in one table that points to a row in another table.
- **index**: a quick-lookup list, like the index at the back of a book.
- **constraint**: a rule the database enforces, like "no two users with the same email".
- **migration**: a numbered step that changes the table design safely.
@@why
Data lives longer than code. People will still want their notes next year. A good data design keeps the facts correct and makes the questions we ask quick to answer.
@@c1 Tables, keys, and links
A "users" table has one row per person. A "notes" table has one row per note, and each note stores the user's id. That id is a foreign key. It lets the database say "this note belongs to that user" without copying the user's name into every note.
@@c2 Indexes make searching quick
Without an index, finding a note by title means reading every note. With an index, the database jumps straight to it, like using the back-of-book index. But an index costs space, and every write must update it too. So add indexes for the searches you really do.
@@c3 Constraints guard the data
Rules in the app can be forgotten or skipped. Rules in the database cannot. Mark a column "not null" or "unique" and the database will refuse bad data, even if two requests arrive at the exact same time.
@@c4 Pick the store for the job
Tidy facts: relational. Fast lookups of small values: key-value. Flexible, changing shapes: document. Searching words: a search engine. Photos and videos: object storage. When unsure, start relational. It can do most jobs and you can add other stores later.
@@example Where does a photo go?
A user uploads a profile picture. The picture file goes to object storage and gets an address like "photos/42.jpg". The database row for the user stores only that short address. The database stays small and fast, and the photo can be served by a system built for big files.
@@use
1. A school stores students and classes in related tables.
2. A game keeps current scores in a key-value store because it must be fast.
3. A shop uses a search engine so customers can type "red shoes" and find them.
@@wrong
Mistakes: copying the same fact into many tables so they disagree, forgetting an index and making searches crawl, putting huge files inside database rows, and changing table designs by hand in production. Use migrations: numbered, reviewed steps that can be repeated on every computer.
