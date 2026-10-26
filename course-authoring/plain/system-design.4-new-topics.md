=== 04a
@@meta
{
  "file": "04a-load-balancers-cdns-and-api-gateways.md",
  "after": "04-networking-and-web-requests.md",
  "scope": "Explain load balancers, health checks, CDNs, caching at the edge, and API gateways in plain words with one traffic example.",
  "reason": "One server can only serve so many people, and servers far from a visitor are slow. A load balancer shares visitors among servers, a CDN keeps copies of files close to people, and a gateway is a single front door that checks every request.",
  "terms": {"loadBalancer": "a traffic guard that sends each visitor to a server that is free", "CDN": "a network of helper servers around the world that keep copies of files near visitors", "gateway": "a single front door that checks and routes every request", "healthCheck": "a quick question asking a server, are you okay?"},
  "facts": ["A load balancer spreads requests over several servers and skips any server that fails its health check.", "A CDN is best for files that look the same for everyone, like images and style sheets.", "A gateway can check logins and apply limits before a request reaches the app.", "If a server remembers a visitor only in its own memory, a load balancer can send that visitor to a server that has forgotten them.", "The load balancer itself must not become the one single point of failure, so there are usually at least two."],
  "scenario": "A big sale makes traffic jump to ten times the normal level, mostly for product images. What helps most?",
  "choices": ["Run several app copies behind a load balancer and serve images from a CDN", "Buy one giant server and hope", "Make every visitor wait in a single line", "Store images inside each database row"],
  "expected": "balance-and-cdn",
  "diagrams": ["system-design-load-balancer-cdn-gateway.svg"]
}
@@picture
Imagine a supermarket with ten checkout lanes and one person at the door pointing shoppers to the shortest line. If a lane closes because the cashier is sick, the pointing person stops sending people there. That person is a **load balancer**.

Now imagine you live in Australia and the only copy of a popular poster is in a shop in Canada. Every time you want to see it, it travels around the world. A **CDN** is like putting a copy of that poster in a shop in your own city.

And a **gateway** is the receptionist at the front of a building: she checks who you are and tells you which floor to go to.
@@diagram
flowchart LR
    V["Visitors"] --> G["Gateway: checks and routes"]
    G --> L["Load balancer"]
    L --> A1["App copy 1"]
    L --> A2["App copy 2"]
    L --> A3["App copy 3"]
    V -->|"images and files"| C["CDN: copies near you"]
@@goal
- Say what a load balancer, a CDN, and a gateway each do.
- Explain health checks and why servers should not "remember" visitors alone.
- Choose which of the three solves a given traffic problem.
@@words
- **load balancer**: a guard that spreads visitors across servers.
- **health check**: a quick "are you okay?" question sent to each server.
- **CDN**: a world-wide set of helpers that keep copies of files near people.
- **edge**: the place close to the visitor, far from your main servers.
- **gateway**: the single front door for all requests.
- **stateless**: a server that does not remember visitors between requests.
@@why
When a site becomes popular, one server gets tired and slow. Adding more servers helps only if something shares the work, and sending large files from far away makes pages feel slow.
@@c1 The load balancer shares the work
Visitors talk to the load balancer, not directly to servers. It picks a server using a simple rule, like "the one with the fewest people" or "take turns". Every few seconds it asks each server "are you okay?" (a health check). A server that does not answer is skipped until it recovers.
@@c2 Servers should be forgetful
If server A remembers that you logged in, and the next request goes to server B, B does not know you. So we keep the memory somewhere shared (a database or a shared cache) and let servers be "stateless". Then any server can answer any visitor.
@@c3 A CDN puts copies near people
Images, videos, and style files are the same for everybody. A CDN keeps copies in many cities. A visitor in Paris gets the file from Paris, not from a server far away. It is faster and your own servers get a rest. Private, personal data should not be put on a public CDN.
@@c4 The gateway is the front door
All requests come through one door where we check the login, apply limits, and send each request to the right place. This keeps rules in one spot instead of copying them into every service. Run two or more load balancers and gateways, so that the door itself is never the single thing that can break.
@@example Sale day
Normally 100 people visit each minute. On sale day, 1,000 do. You add four more app servers behind the load balancer. Product pictures, which are 80 percent of the data sent, come from the CDN. The app servers only handle the 20 percent that is personal: carts and orders. The site stays fast.
@@use
1. A news site puts its pictures on a CDN so readers anywhere get them quickly.
2. A shop adds app servers before a holiday and removes them afterwards.
3. A company puts login checks in a gateway so every service is protected the same way.
@@wrong
Mistakes: keeping a login only in one server's memory, forgetting health checks so visitors get sent to a dead server, putting private files on a public CDN, and having just one load balancer. Also remember that a CDN can show an old copy until it expires or is cleared.

=== 05a
@@meta
{
  "file": "05a-rate-limiting-and-fair-sharing.md",
  "after": "05-apis-and-contracts.md",
  "scope": "Explain rate limits, token buckets, fair use, 429 responses, and retry-after hints with a simple analogy.",
  "reason": "One noisy visitor, or one buggy program, can use up all the capacity and leave everyone else waiting. A rate limit gives every visitor a fair share and protects the system.",
  "terms": {"rateLimit": "a rule that says how many requests someone may make in a period of time", "tokenBucket": "a bucket that fills with tokens over time, and each request spends one", "throttle": "to slow someone down instead of stopping them completely", "retryAfter": "a hint that says how many seconds to wait before trying again"},
  "facts": ["A rate limit protects the system and keeps usage fair between visitors.", "A token bucket allows a short burst of requests but keeps the average rate under the limit.", "When a visitor goes over the limit, the API answers with status 429, which means too many requests.", "The reply can include a Retry-After hint so well-behaved clients wait the right time.", "The limit must be counted per visitor, such as per user or per key, not for everyone together."],
  "scenario": "A buggy program sends 5,000 requests per second from a single account. What should the API do?",
  "choices": ["Answer 429 with a Retry-After hint for that account only", "Slow down everyone else too", "Crash so the problem goes away", "Ignore the limit because the account is signed in"],
  "expected": "limit-per-account",
  "diagrams": ["system-design-rate-limiter-token-bucket.svg"]
}
@@picture
At a water fountain at school, if one kid drinks and drinks, the others wait forever. So the teacher says: "Everyone gets one drink, then goes to the back of the line." That is **rate limiting**: a fair rule that stops one person from using all of something.

A good way to picture it is a **bucket of tokens**. Every second the bucket gets a new token, up to a maximum. Each request spends one token. If the bucket is empty, you wait until it fills a little.
@@diagram
flowchart LR
    R["Request arrives"] --> T{"Token in the bucket?"}
    T -->|"Yes"| P["Spend a token and answer"]
    T -->|"No"| X["Reply 429: too many requests"]
    F["New token added every second"] --> T
@@goal
- Explain why we limit how often someone can ask.
- Describe a token bucket with numbers.
- Reply to over-limit callers politely with 429 and Retry-After.
@@words
- **rate limit**: the most requests a visitor may make in a certain time.
- **token bucket**: a bucket that refills with tokens over time. Each request costs one.
- **burst**: a short quick rush of requests.
- **429**: the status code meaning "too many requests".
- **Retry-After**: a hint that says how long to wait.
- **throttle**: slow someone down instead of blocking them.
@@why
Without limits, a bug, a bot, or a greedy user can take all the power and everyone else suffers. Limits also protect your database and your bill.
@@c1 Fair shares for all
We count requests for each visitor separately, for example per user account or per API key. One heavy user hits only their own limit, and everyone else carries on normally.
@@c2 The token bucket
Say the bucket holds 10 tokens and gets 1 new token each second. You can make 10 quick requests (a burst) and then about one per second. The average stays under the limit but short rushes are allowed, like a real person clicking quickly.
@@c3 Say "slow down", politely
When the bucket is empty, answer with 429 and add a Retry-After hint, for example "wait 5 seconds". Well-behaved programs wait. Without the hint, they might retry right away and make things worse.
@@c4 Where to put the limit
Put it at the front door (the gateway) so a flood is stopped before it uses the app. Keep the counters in something fast and shared, like a cache, so every server agrees on how many tokens a visitor has left. Some actions, like logging in or sending a text message, need much stricter limits than normal reading.
@@example A login limit
You allow 5 login attempts per minute for each account. A robot tries a password 1,000 times. After 5 tries the server says 429. The robot is stuck, and the real owner of the account can still log in after a short wait.
@@use
1. A weather API gives free users 60 requests per minute.
2. A bank limits password guesses to stop people from trying many passwords.
3. A chat app limits messages per second to stop spam.
@@wrong
Mistakes: one global limit for all visitors, so one person slows everyone, limits that are only in the browser, and no hint about when to retry. Also be careful: if many visitors share one address (like a school network), counting by address can be unfair. Prefer counting by account or key.

=== 06a
@@meta
{
  "file": "06a-search-and-indexing-explained.md",
  "after": "06-data-modeling-and-databases.md",
  "scope": "Explain how searching words works with an inverted index, tokens, ranking, and why a search engine is separate from the main database.",
  "reason": "Finding a word inside millions of notes by reading each one is far too slow. A search index remembers which notes contain each word, so the answer is one quick lookup.",
  "terms": {"invertedIndex": "a list that shows, for each word, which documents contain it", "token": "one word or piece of text after splitting", "ranking": "sorting results so the best matches come first", "reindex": "rebuilding the search index after data changes"},
  "facts": ["An inverted index is like the index at the back of a book: word to pages.", "Text is split into tokens and cleaned up, for example made lowercase, before it is indexed.", "Ranking puts the most useful results first, using ideas such as how often a word appears.", "The search index is a copy of the data; the main database is still the true source.", "When data changes, the search index must be updated, so it may be a moment behind."],
  "scenario": "Customers type words to find products among ten million items, and the database search is too slow. What helps?",
  "choices": ["Add a search index that is fed from the database", "Read every product description on every search", "Ask customers to type exact product IDs", "Remove the database"],
  "expected": "add-search-index",
  "diagrams": ["system-design-search-inverted-index.svg"]
}
@@picture
Look at the back of a school book. There is an index: "volcano: pages 12, 45, 101". If you want to know where volcanoes are mentioned, you do not read the whole book. You look up "volcano" and jump straight to the pages.

A search engine builds exactly that kind of index for all your notes, products, or messages. It lists every word and the places where it appears. Then searching is just a quick look-up.
@@diagram
flowchart LR
    D["Notes in the database"] --> T["Split into words"]
    T --> I["Index: word to notes"]
    Q["User types: cat food"] --> L["Look up each word"]
    I --> L
    L --> R["Rank and show the best"]
@@goal
- Explain an inverted index with a book-index analogy.
- Describe tokens, ranking, and "a moment behind".
- Decide when you need a search engine and when a normal database search is enough.
@@words
- **index**: a quick-lookup list.
- **inverted index**: for every word, the list of places it appears.
- **token**: one word after the text is split up.
- **ranking**: sorting results so the best match is first.
- **typo tolerance**: finding "banana" even when someone types "bananna".
- **reindex**: rebuilding the index after changes.
@@why
Normal databases are great at exact matches ("find user 42"). People search with messy words ("cheap red shoes"). Search engines are built for that.
@@c1 Build the index in advance
When a note is saved, the search system splits the text into words, makes them lowercase, and removes tiny words like "the". For each word it remembers the note ids. Doing the hard work in advance makes the search itself fast.
@@c2 Look up each word
For "cat food", find the notes for "cat" and the notes for "food", then keep the ones that appear in both. This is like finding the pages in a book where both words appear.
@@c3 Rank the results
Of 5,000 matches, people look only at the first few. Ranking decides the order: notes that use the word many times, have it in the title, or are newer might come first. Good ranking is what makes search feel smart.
@@c4 The index is a copy
The main database stays the source of truth. The search index is a copy built for searching. After a change, the index updates a moment later. If the index is broken, you can rebuild it from the database. For small apps, a simple database search is often enough. Add a search engine only when you need speed on lots of text.
@@example Searching notes
A student searches "photosynthesis diagram". The search finds notes containing "photosynthesis" (notes 5, 18, 77) and "diagram" (notes 18, 40, 77). Notes 18 and 77 have both, and 77 has the words in its title, so 77 is shown first.
@@use
1. An online shop lets people search for products by words.
2. A mail app lets you search all your old emails quickly.
3. A help site suggests articles as you type your question.
@@wrong
Mistakes: using the search index as the only copy of the data, forgetting to update it when data changes, and showing private notes of other users in results. Search results must follow the same permission rules as everything else.

=== 09a
@@meta
{
  "file": "09a-cap-theorem-and-picking-sides.md",
  "after": "09-consistency-transactions-and-distributed-data.md",
  "scope": "Explain the CAP idea in plain words: when the network between copies breaks, choose between always answering and always being correct, with examples.",
  "reason": "When data lives on several machines and the line between them breaks, you cannot give both the newest answer and an answer every time. Knowing this lets you choose on purpose instead of by accident.",
  "terms": {"partition": "a break in the network so machines cannot talk to each other", "consistency": "everyone sees the same, newest data", "availability": "every request gets an answer", "tradeoff": "a good thing you get in exchange for a cost you accept"},
  "facts": ["A network partition means some machines cannot talk to each other for a while.", "During a partition you must choose: refuse some requests to stay correct, or answer with possibly old data.", "A bank balance should choose being correct, even if some requests are refused.", "A social media like-counter can choose being available, because a slightly old number is harmless.", "When there is no partition, you can usually have both good speed and good data."],
  "scenario": "Two data centers lose their connection. A bank app must show an account balance. What should it prefer?",
  "choices": ["Stay correct: refuse or delay until the balance is certain", "Show any number, even a wrong one", "Allow withdrawals on both sides with no checks", "Pretend nothing is wrong"],
  "expected": "prefer-correct",
  "diagrams": ["system-design-cap-choice.svg"]
}
@@picture
Two friends, Ana and Ben, each keep a copy of the class score on a notepad. They talk on walkie-talkies to keep the notepads the same. Suddenly the walkie-talkies stop working! Now someone asks Ana for the score, but she cannot check with Ben.

Ana has two choices. She can say, "I am not sure, wait until we can talk" (correct, but no answer). Or she can say, "Last time I knew it was 10" (an answer, but maybe old). This tiny story is the whole idea behind the CAP theorem.
@@diagram
flowchart TD
    P["Network breaks between copies"] --> C{"What do we choose?"}
    C -->|"Be correct"| A["Refuse or wait: no answer for now"]
    C -->|"Always answer"| B["Answer with possibly old data"]
@@goal
- Explain a network partition with a simple story.
- Describe the choice between being correct and always answering.
- Pick a side for different features and say why.
@@words
- **partition**: the connection between machines breaks.
- **consistency**: everyone sees the same, newest data.
- **availability**: every request gets some answer.
- **CAP**: a short name for the rule: during a partition, choose consistency or availability.
- **eventual consistency**: copies will agree soon, not instantly.
- **conflict**: two different changes to the same thing at the same time.
@@why
Networks do break. When your data is on several machines, you will one day face the choice. It is much better to decide calmly in advance than to find out in the middle of an outage.
@@c1 Partitions happen
Cables fail, a data center loses power, a software bug blocks traffic. For a while, some machines cannot reach others. Systems with copies must be ready for this.
@@c2 Choose correct or answering
If you choose **correct**, a machine that cannot confirm the latest data says "try again later". If you choose **always answering**, it answers with what it knows and fixes any differences afterwards. Neither is right for everything.
@@c3 Different features, different choices
Money, tickets, and stock counts must be exact, so choose correct. Likes, view counts, and "last seen" can be a bit old, so choose answering. Many apps use both, feature by feature.
@@c4 Fix the differences later
When you choose to keep answering, the two sides may accept different changes. Later, when they talk again, they must fix conflicts: perhaps "the newest change wins", or the two changes are merged, or a person decides. Plan this ahead.
@@example The last concert ticket
One ticket remains. The connection between two data centers breaks. If both sides keep selling, two people buy the same ticket. A ticket shop should choose correctness: one side sells, the other says "please try again in a moment". A few people wait, but nobody is double-charged.
@@use
1. Banks choose correctness for balances and transfers.
2. Social apps choose answering for like counts.
3. Shopping carts often choose answering, then merge items later so nothing is lost.
@@wrong
Mistakes: believing you can always have everything, never deciding, and using one choice for every feature. Also, do not forget the happy case: when the network is fine, you can usually give both fast and correct answers. The choice only matters during a break.

=== 10a
@@meta
{
  "file": "10a-unique-ids-and-consistent-hashing.md",
  "after": "10-scaling-and-partitioning.md",
  "scope": "Explain how to create unique ids in many machines at once and how consistent hashing keeps data moves small when machines are added or removed.",
  "reason": "When many machines create ids or hold data, two machines must not make the same id, and adding a machine must not force us to move almost all of the data.",
  "terms": {"uuid": "a very long random id that is almost impossible to repeat", "hashing": "turning any value into a number in a repeatable way", "hashRing": "a circle of numbers where machines and keys are placed", "rebalance": "moving some data when machines are added or removed"},
  "facts": ["A UUID is generated without asking a central place, so many machines can create ids at the same time.", "A hash turns a key into a number, and the same key always gives the same number.", "With a simple 'number modulo machines' rule, adding one machine moves almost all the data.", "Consistent hashing places machines and keys on a circle so only a small part of the data moves when machines change.", "Ids that are in time order are easier for databases to store than fully random ones."],
  "scenario": "You have 4 cache machines and add a 5th. You do not want almost every key to move. What helps?",
  "choices": ["Consistent hashing, so only a small part of the keys move", "Rename every key", "Use the 'key modulo machines' rule and accept the move", "Turn off the cache"],
  "expected": "consistent-hashing",
  "diagrams": ["system-design-consistent-hashing-ring.svg"]
}
@@picture
When a classroom of 30 students lines up, each one gets a unique number. But what if ten classrooms line up at once, in different places? How do we make sure two students in different rooms do not get the same number? And when a new classroom joins, how do we move as few students as possible?

These are two real problems in big systems: **making unique ids** and **sharing data among machines in a way that is easy to change**.
@@diagram
flowchart LR
    K["Key: user42"] --> H["Hash: turn into a number"]
    H --> R["Place on the ring"]
    R --> M["Walk clockwise to the next machine"]
@@goal
- Explain UUIDs and time-ordered ids simply.
- Explain a hash and why "modulo" moves too much data.
- Describe consistent hashing with a clock face.
@@words
- **UUID**: a long random id that is practically never repeated.
- **hash**: a repeatable way to turn any value into a number.
- **modulo**: the remainder after division, such as 10 mod 4 is 2.
- **hash ring**: a circle of numbers used to place machines and keys.
- **rebalance**: moving data when machines change.
- **virtual node**: a machine placed at many spots on the ring to share data more evenly.
@@why
Giving ids and placing data are tasks every big system does. If we choose a poor rule, adding a single machine can cause a huge, slow reshuffle and an outage.
@@c1 Unique ids without a boss
If every machine had to ask one central machine for the next number, that machine would be a bottleneck. A UUID is a long random number that machines can make alone. The chance of two being the same is so small that we ignore it.
@@c2 Time-ordered ids are friendlier
Totally random ids spread new records all over the database, which can be slower. Ids that start with the time (and then have random parts) keep new records near each other. Some systems also include a machine number so ids never clash.
@@c3 A hash turns keys into numbers
A hash function takes "user42" and gives a number, always the same one. Using "hash modulo number of machines", you pick a machine: with 4 machines, key number 47 goes to machine 3 (47 mod 4 is 3). Add a fifth machine and 47 mod 5 is 2, so that key must move to machine 2. For most keys the answer changes, so most data must move!
@@c4 The ring: move only what is needed
Imagine a clock face. Put each machine at some spot on the clock. Put each key on the clock using its hash. A key belongs to the first machine you meet going clockwise. If you add a machine, it takes over only the keys between it and the machine before it. Everything else stays. Putting each machine at many spots (virtual nodes) makes the sharing more even.
@@example Adding a cache machine
Four cache machines hold 1,000,000 keys. With the modulo rule, adding a fifth machine moves about 800,000 keys, and the cache is nearly empty, so the database gets flooded. With the ring, the new machine takes about 200,000 keys, one fifth, and the rest stay put.
@@use
1. A distributed cache uses a ring to decide which machine stores each key.
2. A database creates unique order ids with the time, a machine number, and a counter.
3. A file storage system spreads files across many disks and adds disks easily.
@@wrong
Mistakes: using one central counter for all ids, using the modulo rule when machines change often, and having the hash put too many keys on one machine (a hot spot). Virtual nodes and good key choices help to spread things evenly.

=== 18a
@@meta
{
  "file": "18a-design-a-url-shortener-step-by-step.md",
  "after": "18-application-architecture-cookbook-and-decision-guide.md",
  "scope": "Walk through a complete design of a short-link service: requirements, numbers, API, data, short codes, caching, failures, and trade-offs.",
  "reason": "Following one complete design from first question to final trade-offs shows how all the ideas in the course fit together.",
  "terms": {"shortCode": "the few characters at the end of a short link", "redirect": "a reply that tells the browser to go to another address", "readHeavy": "a workload where reading happens far more than writing", "collision": "two things getting the same code by accident"},
  "facts": ["A short-link service is read-heavy: links are opened far more often than they are created.", "The short code can be made from a unique id turned into letters and numbers.", "The server answers an open request with a redirect, status 301 or 302, pointing to the long address.", "A cache holds popular links so most opens never reach the database.", "A collision check or a unique database rule makes sure two links never share a code."],
  "scenario": "Opening a short link must be very fast, and most traffic is opens. What is the best first improvement?",
  "choices": ["Cache popular codes in memory in front of the database", "Shard the database right away", "Generate a new code for every open", "Store codes in the browser only"],
  "expected": "cache-hot-links",
  "diagrams": ["system-design-url-shortener-flow.svg"]
}
@@picture
You have a very long web address like https://example.com/articles/2026/10/how-to-build-a-treehouse-that-lasts?ref=newsletter. You want to share it in a text message. A short link like https://sho.rt/aB3x9 is much nicer, and it takes the visitor to the same place.

We will design this service from nothing, step by step, using the method from the course: ask, count, draw, find the weak spot, and explain.
@@diagram
flowchart LR
    U["Visitor opens sho.rt/aB3x9"] --> A["API"]
    A --> C{"Code in the cache?"}
    C -->|"Yes"| R["Redirect to the long link"]
    C -->|"No"| D[("Database lookup")]
    D --> F["Fill the cache"]
    F --> R
@@goal
- Walk through all steps of a complete small design.
- Do the number estimates yourself.
- Explain which parts to keep simple and which to improve first.
@@words
- **short code**: the few letters and numbers at the end of the short link.
- **redirect**: a reply that says "go to this other address".
- **read-heavy**: far more reads than writes.
- **collision**: two links getting the same code.
- **base62**: writing a number using 62 symbols: 0-9, a-z, and A-Z.
- **expiry**: a date after which a link stops working.
@@why
A short-link service is small enough to design in an hour but has real problems: lots of reads, unique codes, and caching. It is the "hello world" of system design.
@@c1 Step 1: What must it do?
Two jobs: **create** a short link from a long one, and **open** a short link to go to the long one. Quality goals: opening should take under 100 milliseconds, and a link must never point to the wrong place. A non-goal for now: statistics dashboards.
@@c2 Step 2: Count
Say 1 million new links per day. That is 1,000,000 divided by 86,400 seconds, about 12 creates per second. If each link is opened 10 times, that is 120 opens per second, with a busy hour maybe 3 times more, about 360 per second. A link record is about 500 bytes, so 1 million per day for 5 years is 1,825 million records, near 900 GB. One good database can handle it, but we will plan for growth.
@@c3 Step 3: Make the short code
Give every link a unique number (1, 2, 3...). Write that number in base62: with 7 characters we get 62 to the power of 7, about 3.5 trillion codes, far more than we need. The database has a unique rule on the code, so if two codes ever clash, one request is told to try again.
@@c4 Step 4: Draw and speed it up
API and database make the first drawing. Reads are most of the traffic, so we add a cache: popular codes are answered from memory. A cache miss reads the database and fills the cache. Opening replies with a redirect. Writing goes to the database only. If the cache fails, the service is slower but still correct.
@@example What if the database is down?
Opening a link that is in the cache still works. A link not in the cache gets "please try again soon". Creating a link says "try again" too. We never invent a link or say "link not found" when the real problem is the database being down.
@@use
1. Social media posts use short links to save space.
2. Marketing emails use short links to count clicks.
3. QR codes point to short links so the printed code never has to change.
@@wrong
Mistakes: guessable codes that let people walk through every link (add randomness for private links), allowing links to bad addresses, and forgetting rate limits so robots create millions of links. Also decide what happens to expired or deleted links: a clear "gone" answer is better than silence.

=== 18b
@@meta
{
  "file": "18b-design-a-chat-app-step-by-step.md",
  "after": "18a-design-a-url-shortener-step-by-step.md",
  "scope": "Walk through a chat design: live connections, message storage, delivery to offline users, ordering, read receipts, and scaling by conversation.",
  "reason": "Chat shows how live connections, queues, storage, and ordering work together, and it is a favorite example for learning real-time design.",
  "terms": {"websocket": "a connection that stays open so the server can push messages to you at any time", "fanout": "sending one message to many receivers", "ordering": "keeping messages in the order they were sent inside a conversation", "pushNotification": "a message sent to a phone that is not currently open in the app"},
  "facts": ["A websocket keeps a connection open so new messages can appear without asking again and again.", "Messages are saved first, so they are never lost if a receiver is offline.", "Messages are ordered inside one conversation, not across the whole world.", "A queue helps with fanout when a message goes to many people in a group.", "Sharding by conversation id keeps all messages of one chat together on one shard."],
  "scenario": "A friend is offline when you send a message. What should the chat system do?",
  "choices": ["Save the message and deliver it, plus a push notification, when they come back", "Throw the message away", "Keep the sender waiting until the friend returns", "Send it to a random person"],
  "expected": "store-and-deliver",
  "diagrams": ["system-design-chat-message-flow.svg"]
}
@@picture
When you send a message to a friend, it feels like magic: it appears on their screen in a blink. Under the hood, a lot of careful work makes sure the message is saved, arrives, arrives only once, and stays in the right order.

We will design a small chat app using the course method. The key new idea is a **live connection**: instead of the phone asking "any news?" every second, the connection stays open and the server can call out the moment a new message arrives.
@@diagram
flowchart LR
    S["Sender's phone"] --> G["Chat server"]
    G --> DB[("Save the message")]
    G --> O{"Is the receiver online?"}
    O -->|"Yes"| R["Push through the open connection"]
    O -->|"No"| N["Queue a push notification"]
@@goal
- Explain live connections, saving first, and delivery to offline friends.
- Explain why ordering is per conversation.
- Describe how to grow the chat by splitting on conversation.
@@words
- **websocket**: a connection that stays open so the server can send you messages at any time.
- **fanout**: sending one message to many receivers, as in a group.
- **ordering**: messages appear in the order they were sent.
- **delivered / read**: two different statuses: arrived on the phone, and seen by the person.
- **push notification**: an alert sent to a phone when the app is closed.
- **presence**: showing whether someone is online.
@@why
People expect chat to be instant, never lose messages, and keep order. Those three promises touch connections, storage, and queues, so chat is a great way to review everything you learned.
@@c1 Open connections for instant messages
Normal web requests are like sending letters: you ask, they answer. A websocket is like a phone call that stays on. The server can speak first. Each chat server keeps thousands of such calls open, so we run many servers, and we need a shared place to know who is connected to which server.
@@c2 Save first, send second
When a message arrives, we write it to the database before telling anyone. If the receiver is offline or the server crashes, the message is safe. When the receiver comes back, their phone asks: "give me everything after message 1042."
@@c3 Keep order inside one conversation
Nobody needs messages from all over the world in one global order. We only need each chat to be in order. So each message gets a number within its conversation (1, 2, 3...). We can also split data by conversation id, so one chat's messages live together, which makes reading a chat's history quick.
@@c4 Groups and notifications use a queue
A message to a group of 500 people is 500 deliveries. We put those jobs in a queue and let workers do them. Offline members get a push notification through the same queue. If a delivery fails, it is retried a few times and not lost. Delivery steps like "sent", "delivered", "read" are saved as small status updates.
@@example Sending "Hi!"
Ana sends "Hi!" to Ben. The chat server gives it number 7 in their conversation, saves it, and replies "sent" to Ana. Ben is online, so the server pushes it through his open connection. His phone shows it and replies "delivered". When Ben opens the chat, the app sends "read" back, and Ana sees two ticks.
@@use
1. A school group chat for a class project.
2. A customer-support chat on a shop's website.
3. In-game chat that must work for thousands of players at once.
@@wrong
Mistakes: sending without saving, showing messages in different orders to different people, forgetting that a receiver may be offline, and storing messages forever with no rules. Also, chat messages are private, so every read must check that the person belongs to the conversation.
