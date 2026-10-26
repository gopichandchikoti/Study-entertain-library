=== 09
@@picture
Some things are just facts: a point on a map (x and y), a day of the week, a coin that is either heads or tails. You do not change the point. You make a new one. A **record** is a short way to write down such a fact in Java. An **enum** is a fixed list of choices, like the seven days.

Both help you say exactly what you mean, and both help Java catch mistakes for you.
@@diagram
flowchart LR
    R["record Point(int x, int y)"] --> V["Point 3,4: equal to any other 3,4"]
    E["enum Day: MON, TUE, WED..."] --> C["Only a listed day is allowed"]
@@goal
- Write a record and an enum.
- Explain value equality in simple words.
- Know when a normal changeable class is a better choice.
@@words
- **record**: a short way to write a class that only holds data.
- **enum**: a type with a fixed list of allowed values.
- **value object**: a small object that is defined by its content, like a point.
- **immutable**: cannot be changed after it is created.
- **equality**: two things count as the same because their content is the same.
- **canonical constructor**: the main constructor of a record, where you can add checks.
@@why
Writing a class just to hold data used to take many lines. Records make this one line, with equals, hashCode, and toString built in. Enums stop mistakes like typing "Mondey".
@@c1 A record is a data card
`record Note(int id, String title) {}` is complete. It gives you a constructor, getters (`note.title()`), `equals`, and a readable `toString`. Records are immutable: you cannot change a field once it is made.
@@c2 Value equality
Two records with the same content are equal: `new Point(3, 4).equals(new Point(3, 4))` is `true`. This is how we compare things like money or coordinates: by what they hold, not by where they live in memory.
@@c3 Check inside the record
You can add a check in the constructor: if the title is blank, throw an error. Now a bad `Note` cannot exist. A record checks its data once, at the door.
@@c4 Enums list the choices
`enum Status { TODO, DOING, DONE }` allows only these three values. If someone types `Status.FINISHED`, Java says "that does not exist" before the program runs. Enums can have their own methods too, such as `isOpen()`.
@@example Status of a note
```java
record Note(int id, String title, Status status) {
    Note {
        if (title.isBlank()) throw new IllegalArgumentException("blank title");
    }
}
enum Status { TODO, DOING, DONE }

Note n = new Note(1, "Math", Status.TODO);
Note done = new Note(n.id(), n.title(), Status.DONE);  // a new note, not a change
```
We do not change `n`. We make a new note with the new status. That makes it safe to share a `Note` anywhere.
@@use
1. A `Money(amount, currency)` record in a shop.
2. A `Direction` enum with NORTH, SOUTH, EAST, WEST in a game.
3. A `Coordinates(lat, lon)` record for a map.
@@wrong
Mistakes: using a record for something that must change a lot (like a shopping cart that adds items), thinking the things inside a record are also frozen (a list inside can still change!), and using plain strings like "done" instead of an enum, which allows typos.

=== 10
@@picture
A library has shelves of different kinds. One shelf keeps books in the order they arrived (a **List**). One drawer has cards and never allows two of the same (a **Set**). One catalog lets you find a book by its code (a **Map**).

Java gives you these shelves, called **collections**. And **generics** are the labels on the shelves: `List<Note>` means "a list that only holds Notes". If you try to put in a banana, Java stops you.
@@diagram
flowchart LR
    L["List: ordered, repeats ok"]
    S["Set: no repeats"]
    M["Map: key to value"]
    G["Generics: List of Note"] --> L
    G --> S
    G --> M
@@goal
- Choose between List, Set, and Map.
- Read and write generic types like `List<String>` and `Map<Integer, Note>`.
- Loop through collections and know when each is fast.
@@words
- **collection**: a container that holds many items.
- **List**: items in order. Repeats allowed.
- **Set**: items with no repeats.
- **Map**: a lookup from a key to a value.
- **generics**: telling Java what type a container holds, written in `< >`.
- **iterate**: go through the items one by one.
@@why
Real programs work with many things: a list of students, a set of tags, a table of prices. Choosing the right container makes code both easy to read and fast.
@@c1 List keeps the order
`List<String> names = new ArrayList<>(); names.add("Ana");`. Items are in the order you added them, and you can ask for position 0, 1, 2. The same name can appear twice. Use a list when order matters.
@@c2 Set keeps things unique
`Set<String> tags = new HashSet<>();` If you add "java" twice, it is stored once. Use a set to remove duplicates or to ask "have I seen this before?" very quickly.
@@c3 Map finds by key
`Map<Integer, Note> byId = new HashMap<>(); byId.put(1, note);` Then `byId.get(1)` finds it immediately. It is like a dictionary: look up the word, get the meaning. Each key has exactly one value.
@@c4 Generics keep things safe
`List<Note>` promises that only notes go in and only notes come out. Without it, you would have to guess and cast, and a surprise could crash the program. The label `<Note>` lets Java check for you before the program runs.
@@example Count words
```java
Map<String, Integer> counts = new HashMap<>();
for (String word : List.of("cat", "dog", "cat")) {
    counts.merge(word, 1, Integer::sum);
}
System.out.println(counts);   // {cat=2, dog=1}
```
For each word we add 1 to its count. The map remembers one number per word.
@@use
1. A `List` of homework tasks in the order due.
2. A `Set` of student ids that already submitted.
3. A `Map` from product code to price.
@@wrong
Mistakes: using a List and searching it again and again when a Map would find the answer instantly, changing a list while looping over it (Java will complain), and forgetting that a `HashSet` or `HashMap` does not keep a promised order. If the order matters, use a List, or a `LinkedHashMap`.

=== 11
@@picture
An empty seat in a bus is different from a seat with a sign that says "empty". In Java, the special value `null` means "there is nothing here". If you ask something that is not there to do something, Java throws a `NullPointerException`, which is a famous crash.

Smart programmers do two things: they check for missing values at the door, and they use `Optional` to say clearly, "this answer might be empty".
@@diagram
flowchart LR
    A["Input arrives"] --> B{"null or blank?"}
    B -->|"Yes"| C["Reject with a clear message"]
    B -->|"No"| D["Clean it: trim spaces"]
    D --> E["Use it safely"]
@@goal
- Explain `null` and why it causes crashes.
- Use `Optional` to handle "maybe nothing".
- Check and clean input at the edge of your program.
@@words
- **null**: a marker meaning "no object here".
- **NullPointerException**: the crash when you use something that is null.
- **Optional**: a box that either holds a value or is empty.
- **blank**: empty, or only spaces.
- **normalize**: clean up and make a standard form, like trimming spaces.
- **validation**: checking that data follows the rules.
@@why
Missing data is normal. A form is left empty, a record is not found, a field is not sent. If code does not plan for it, the program crashes at the worst time.
@@c1 null means nothing is there
`String name = null;` Then `name.length()` crashes, because there is nobody to ask. Imagine asking an empty seat its name. Always ask: "can this be null?"
@@c2 Optional says "maybe"
Instead of returning `null` from `findById`, return `Optional<Note>`. The caller sees in the type: "might be empty". They must handle it: `.orElse(...)`, `.ifPresent(...)`, or `.orElseThrow()`.
@@c3 Clean before you check
A title of `"   "` (just spaces) looks full but is empty. First `trim()` it, then check `isBlank()`. Doing it the other way round lets bad data through. Tidying the data first is called normalizing.
@@c4 Check at the door
Check inputs where they enter your program: web requests, files, forms. Inside the program you can then trust the data. Do not hide real bugs by catching every error and pretending it was "just missing data". Zero is also a real value, and `0` is not `null`.
@@example Finding a note
```java
Optional<Note> found = repository.findById(7);
String title = found
    .map(Note::title)
    .orElse("No such note");
System.out.println(title);
```
If note 7 exists, we print its title. If not, we print "No such note". There is no crash either way.
@@use
1. A login form rejects a blank username.
2. A search for a student by id returns "not found" when there is no such student.
3. An update that leaves out the title keeps the old title.
@@wrong
Mistakes: returning null for "not found" and forgetting the caller must check, calling `.get()` on an empty Optional (it crashes!), checking for blank before trimming, and treating "unknown id" and "invalid title" as the same problem. They are different and need different messages.

=== 12
@@picture
When you play a video game and fall into a hole, the game does not just turn off. It shows "You fell! Try again". An exception in Java is like falling into a hole: something unexpected happened, normal flow stops, and Java looks for someone who knows what to do.

A good program expects things to go wrong: a missing file, a bad number, an offline database. It catches the problem, cleans up, and gives a helpful message.
@@diagram
flowchart TD
    T["try: do the work"] --> OK{"Did it work?"}
    OK -->|"Yes"| D["Done"]
    OK -->|"No: exception"| C["catch: handle it"]
    D --> F["finally: always clean up"]
    C --> F
@@goal
- Use `try`, `catch`, and `finally`.
- Tell checked from unchecked exceptions.
- Use try-with-resources and write safe error messages.
@@words
- **exception**: an object that describes a problem.
- **throw**: raise an exception.
- **catch**: handle an exception.
- **finally**: a block that always runs.
- **try-with-resources**: automatically closes files and connections.
- **stack trace**: a list of the calls that led to the error.
@@why
Without good error handling, one small problem becomes a crash or, even worse, quietly wrong data. With it, the program tells the user what happened and stays safe.
@@c1 try and catch
```java
try {
    int n = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("That is not a number");
}
```
The risky code goes in `try`. If it throws, `catch` runs instead of crashing.
@@c2 Clean up always
If you open a file, you must close it, even when something goes wrong. `try-with-resources` does this for you: `try (var reader = Files.newBufferedReader(path)) { ... }`. The reader is closed automatically at the end, success or failure.
@@c3 Checked and unchecked
A **checked** exception, like `IOException`, is one Java forces you to deal with. An **unchecked** one, like `IllegalArgumentException`, usually means "the programmer made a mistake". Use unchecked ones for bad arguments and checked ones for things the outside world can do to you, like a missing file.
@@c4 Safe messages for outsiders
Do not show a user the raw error with file paths or SQL. Catch it, write the full details in a private log, and send a short, friendly message with an error code. Keep the original exception as the **cause**, so no information is lost for the developers.
@@example Translating an error
```java
try {
    return repository.findById(id);
} catch (SQLException e) {
    log.error("DB failed for id " + id, e);               // details, privately
    throw new ServiceUnavailableException("Please try again later", e);
}
```
The user sees "Please try again later". The team sees the whole story in the log.
@@use
1. A calculator catches "divide by zero" and shows a friendly message.
2. A file reader always closes the file, even if reading fails.
3. A web service turns a database problem into a clean "503 try again" reply.
@@wrong
Mistakes: an empty `catch` that hides the problem, catching everything with `Exception` and pretending it is fine, forgetting to close resources, and showing internal details to users. Never swallow an error silently.

=== 13
@@picture
Words and time look easy until you meet the real world. Some letters, like "é" or emojis, take more than one byte. And "5 pm" is a different moment in Tokyo than in New York. A calendar date, like "March 3", has no clock and no place at all.

Java has careful tools for text and time. When you pick the right one, strange bugs just do not happen.
@@diagram
flowchart LR
    A["A calendar day: LocalDate"] --> D["Birthday, store schedule day"]
    B["An exact moment: Instant"] --> E["When something happened"]
    C["A moment in a place: ZonedDateTime"] --> F["Show to a person in their zone"]
@@goal
- Choose `LocalDate`, `Instant`, or `ZonedDateTime` for the right job.
- Format and parse dates safely.
- Explain strings, characters, encoding, and Unicode in simple words.
@@words
- **LocalDate**: a date with no time and no place, like 2026-10-11.
- **Instant**: one exact moment on the world's timeline.
- **time zone**: the rules for local time in a place.
- **encoding**: the rule for turning text into bytes, such as UTF-8.
- **Unicode**: the huge list of all letters, symbols, and emojis.
- **locale**: language and region settings, like how to write a date.
@@why
Wrong time handling causes real problems: meetings on the wrong day, bills charged twice, and ages that are off by one. Choosing the right type removes most of them.
@@c1 Pick the right time type
A birthday is a `LocalDate`: it has no clock. "The moment this note was saved" is an `Instant`. "Show it as 3 pm in Paris" needs a `ZonedDateTime` with a time zone. If you pick the wrong one, you get the wrong answer in some part of the world.
@@c2 Time zones must be named
Never guess the zone. Say it: `ZoneId.of("Europe/Paris")`. Daylight-saving changes make days with 23 or 25 hours, and only a real zone knows about them. Store the exact moment (Instant), and show it in the user's zone.
@@c3 Parse and format with a pattern
`LocalDate.parse("2026-10-11")` reads the standard format. For other styles, use `DateTimeFormatter.ofPattern("dd/MM/yyyy")`. Always state the pattern so there is no guessing between 03/04 meaning March 4 or April 3.
@@c4 Text is more than letters
A Java `String` holds Unicode text. The number of characters you see is not always the string's length, because an emoji can use two slots. When saving text to a file, say the encoding: `StandardCharsets.UTF_8`. It works for every language.
@@example A schedule day
```java
LocalDate day = LocalDate.of(2026, 10, 11);
Instant saved = Instant.now();
ZonedDateTime paris = saved.atZone(ZoneId.of("Europe/Paris"));
System.out.println(day + " saved at " + paris);
```
The store's "trading day" is a `LocalDate`. The save time is an `Instant`. When we show it to someone in Paris, we convert it with their zone.
@@use
1. A school stores each student's birthday as a `LocalDate`.
2. A chat app saves each message's `Instant` and shows it in the reader's time zone.
3. A text file of names in many languages is saved as UTF-8 so no letters break.
@@wrong
Mistakes: storing a date as plain text without a format, mixing `LocalDate` and `Instant` without thinking, adding 24 hours to mean "tomorrow" (daylight saving can break it), and saving text without an encoding, which turns letters into question marks.

=== 14
@@picture
Imagine a conveyor belt in a factory. Items move along. One worker removes the broken ones (filter). Another paints each item red (map). A last worker counts them (reduce). You do not walk back and forth between workers. You just describe the line and let the items flow.

A Java **stream** is a conveyor belt for data, and a **lambda** is a tiny worker described in one short line: `x -> x * 2`.
@@diagram
flowchart LR
    A["List of numbers"] --> B["filter: keep even ones"]
    B --> C["map: double each"]
    C --> D["collect: make a new list"]
@@goal
- Write simple lambdas and method references.
- Use `filter`, `map`, and `collect` on a stream.
- Decide when a plain loop is clearer.
@@words
- **lambda**: a short, nameless function like `x -> x + 1`.
- **method reference**: a shorter way to point to a method, like `String::length`.
- **stream**: a pipeline of steps run on a collection.
- **filter**: keep only the items that match.
- **map**: change each item into something else.
- **collector**: gathers the stream results into a list, set, or map.
@@why
Loops with lots of lines for simple tasks like "keep the long names and shout them" are noisy. Streams let you say what you want in a few readable lines.
@@c1 A lambda is a tiny function
`(a, b) -> a + b` means "given a and b, return a plus b". You can pass it to other methods, like telling a robot "do this to each item".
@@c2 A stream is a pipeline
```java
List<String> shout = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .toList();
```
Read it like a sentence: "From names, keep the long ones, make them uppercase, and give me a list."
@@c3 Do not hide side effects
A stream step should not secretly change things outside, like adding to some other list or printing in the middle. Keep each step simple and pure so the pipeline is easy to trust and to change.
@@c4 Loops are okay too
If the stream gets long and hard to read, a plain `for` loop is better. The goal is clear code, not fancy code. Use streams for simple "filter, change, collect" jobs.
@@example Even squares
```java
List<Integer> result = List.of(1, 2, 3, 4, 5, 6).stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .toList();
System.out.println(result);   // [4, 16, 36]
```
Keep the even numbers (2, 4, 6) and then square each. We never wrote a loop, and the code reads like the idea.
@@use
1. Find all students who scored above 80 and list their names.
2. Add up the price of every item in a basket.
3. Group orders by the day they were placed.
@@wrong
Mistakes: using a stream when a simple loop is clearer, putting complicated multi-line logic inside a lambda, changing a variable from inside a lambda (Java does not allow most of that), and using the same stream twice (a stream can be consumed only once).

=== 15
@@picture
Most real programs do not live alone. They read files, talk to other computers over the web, and save data in a database. These are all the outside world, and the outside world can be slow, broken, or even dangerous.

For each door to the outside, Java has a standard tool: `Files` for files, `HttpClient` for the web, and **JDBC** for databases. For each one, we follow the same safe habits: check the input, set a time limit, and close what we open.
@@diagram
flowchart LR
    P["Your program"] --> F["Files: read and write"]
    P --> H["HttpClient: call a web service"]
    P --> J["JDBC: talk to a database"]
    J --> D[("Database")]
@@goal
- Read and write files safely with `Files` and `Path`.
- Make a web request with a time limit.
- Use JDBC with `?` parameters and transactions.
@@words
- **Path**: the address of a file.
- **JSON**: a simple text format for data, like `{"title": "Math"}`.
- **HttpClient**: Java's built-in tool for calling web services.
- **JDBC**: Java's standard way to talk to databases.
- **PreparedStatement**: a SQL command with safe `?` slots for values.
- **transaction**: a group of database changes that all succeed or all fail.
@@why
Programs that only live in memory forget everything when they stop. To be useful, they must save data and talk to others, and do it safely.
@@c1 Files: stay inside the fence
```java
Path root = Path.of("notes").toAbsolutePath().normalize();
Path file = root.resolve(name).normalize();
if (!file.startsWith(root)) throw new IllegalArgumentException("bad path");
String text = Files.readString(file, StandardCharsets.UTF_8);
```
A name like `../secret.txt` tries to climb out of the folder. We clean the path and check that it is still inside the fence.
@@c2 The web: always set a time limit
`HttpClient` sends requests. Set a timeout so one slow server cannot freeze your program: `HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(5))`. Then check the status code before trusting the answer.
@@c3 JDBC: use the ? slots
Never glue user text into SQL. Write `SELECT * FROM notes WHERE id = ?` and then give the value separately. This stops a famous attack called SQL injection, where a user types SQL as their "name".
@@c4 Transactions and cleanup
To save a note and its tag together, use one transaction: either both are saved or neither. Always close connections (try-with-resources does it), because a database has only a limited number of connections to hand out.
@@example Safe database read
```java
String sql = "SELECT title FROM notes WHERE id = ?";
try (PreparedStatement ps = connection.prepareStatement(sql)) {
    ps.setInt(1, id);
    try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? Optional.of(rs.getString("title")) : Optional.empty();
    }
}
```
The `?` is a safe slot. `setInt` fills it. Both the statement and result are closed automatically.
@@use
1. A program reads a list of students from a file.
2. A weather app calls a web service with a 5-second timeout.
3. A shop saves orders in a database inside a transaction.
@@wrong
Mistakes: building SQL by joining strings, opening a file path directly from user input, forgetting timeouts on web calls, leaving connections open, and loading a huge file fully into memory when you could read it in pieces.

=== 16
@@picture
Think about a kitchen with many cooks. If each cook has their own counter and ingredients, they work in peace. But if two cooks reach for the last egg at the same time, there is a problem. Who gets it? What if both think they did?

Threads are cooks: they let Java do several things at once. The tricky part is sharing. This lesson is about sharing safely, using turn-taking rules, and about keeping the number of cooks under control.
@@diagram
flowchart LR
    R["Many tasks arrive"] --> E["Executor: a fixed team of workers"]
    E --> T1["Thread 1"]
    E --> T2["Thread 2"]
    E --> T3["Thread 3"]
    T1 --> S["Shared counter: needs a lock"]
@@goal
- Explain a thread and a race condition.
- Use `synchronized`, atomics, and executors.
- Explain why we keep the number of tasks and threads bounded.
@@words
- **thread**: one path of work running at the same time as others.
- **race condition**: the result depends on whose turn comes first by luck.
- **lock**: a rule that lets only one thread in at a time.
- **atomic**: an operation that cannot be split in the middle.
- **executor**: a manager that runs tasks with a limited team of threads.
- **future**: a ticket for a result that will come later.
@@why
Modern computers have many cores, and servers handle many visitors at once. Using threads well makes programs fast. Using them badly makes bugs that appear only sometimes and are very hard to find.
@@c1 A race: two cooks, one scoreboard
Two threads each do: read the score (5), add one, write it back (6). If both read 5 at the same time, both write 6, and one point disappears! The whole read-add-write should happen as one step.
@@c2 Turn-taking tools
`synchronized` is like a bathroom door lock: only one thread inside at a time. `AtomicInteger` does the read-add-write as one safe step: `counter.incrementAndGet()`. A lock must protect the whole rule, not just part of it.
@@c3 Use executors, not new threads everywhere
```java
ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> result = pool.submit(() -> compute());
```
A pool is a team of four workers. Tasks wait in line when all are busy. This stops your program from creating thousands of threads and running out of memory.
@@c4 Stop politely
To cancel a task, you ask it to stop (`interrupt`) and it must notice, clean up, and exit. Always shut down the pool when finished (`pool.shutdown()`). Newer Java also has virtual threads, very light threads for programs that mostly wait for the network.
@@example Fixing the counter
```java
AtomicInteger score = new AtomicInteger();
Runnable add = () -> { for (int i = 0; i < 1000; i++) score.incrementAndGet(); };
// run add on two threads: the final score is always 2000
```
With a plain `int` and `score++`, the answer might be 1,874 or 1,990. With `AtomicInteger`, it is always 2,000.
@@use
1. A web server answers many visitors at once with a pool of threads.
2. A program downloads ten files in parallel and waits for all of them.
3. A counter of "visitors today" uses an atomic number.
@@wrong
Mistakes: sharing changeable data without any lock, locking too little or too much (slow and can freeze: a deadlock), starting an unlimited number of threads, and forgetting to shut down the executor, so the program never ends. When in doubt, share less.
