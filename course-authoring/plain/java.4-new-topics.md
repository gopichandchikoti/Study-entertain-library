=== 03a
@@meta
{
  "file": "03a-reading-error-messages-and-stack-traces.md",
  "after": "03-jdk-jvm-compiler-and-first-program.md",
  "scope": "Teach how to read compiler errors, runtime exceptions, and stack traces, and a simple method for finding and fixing a bug.",
  "reason": "Every programmer sees errors every day. Learning to read them calmly turns a scary red wall of text into a map that points to the problem.",
  "terms": {"compileError": "a mistake Java finds before the program runs", "runtimeError": "a problem that happens while the program is running", "stackTrace": "the list of method calls that led to an error", "debugging": "finding and fixing the cause of a bug"},
  "facts": ["A compile error stops the program from being built and names the file and line to look at.", "A runtime exception happens while the program runs, such as dividing by zero or using null.", "A stack trace lists the calls from the newest at the top to the oldest at the bottom.", "The most useful line is usually the first one that mentions your own code.", "Change one thing at a time when fixing a bug, and run the program again after each change."],
  "scenario": "Your program crashes with a long red stack trace. Where do you look first?",
  "choices": ["At the error type and message, then at the first line that names your own file and line number", "At the very last line only", "Nowhere, just rewrite everything", "At the color of the text"],
  "expected": "read-trace",
  "diagrams": ["java-reading-a-stack-trace.svg"]
}
@@picture
When a car shows a warning light, it does not mean the car hates you. It is giving you a clue. Java error messages are the same. They are the program's way of saying, "Here is exactly where I got confused."

At first the red text looks like a scary wall. But it has a simple shape: the **kind of problem**, a **short message**, and a **list of places** the program was visiting. Once you know where to look, you can fix most bugs in minutes.
@@diagram
flowchart TD
    E["Exception: type and message"] --> L["List of calls: stack trace"]
    L --> Y["First line in YOUR code"]
    Y --> F["Open that file and line"]
    F --> G["Guess the cause, fix, run again"]
@@goal
- Tell a compile error from a runtime error.
- Read a stack trace from the top and find your own code.
- Follow a calm four-step method to fix a bug.
@@words
- **compile error**: Java found a mistake before running.
- **runtime exception**: a problem that happens while running.
- **stack trace**: the list of calls that led to the error.
- **line number**: the spot in a file where the problem was noticed.
- **debugger**: a tool that lets you pause a program and look inside.
- **reproduce**: make the bug happen again on purpose so you can study it.
@@why
Beginners often panic or guess wildly. Programmers who read the message first fix problems in a fraction of the time, and they learn from every bug.
@@c1 Compile errors: found early
```text
Hello.java:3: error: ';' expected
    System.out.println("Hi")
                            ^
```
It names the file, the line, and even points with `^`. The error is often on the line just before the point shown, as a missing semicolon. Fix the first error first, because later ones may just be echoes.
@@c2 Runtime errors: found while running
```text
Exception in thread "main" java.lang.NullPointerException:
    Cannot invoke "String.length()" because "name" is null
    at Greeter.greet(Greeter.java:7)
    at Main.main(Main.java:4)
```
The first line says what and why: `name` was null. The lines starting with `at` show where.
@@c3 Reading a stack trace
The top `at` line is where it happened. The next is who called that, and so on, down to `main`. Look for the first line with your own class names (like `Greeter.java:7`). Lines from Java's own packages (`java.base`, `org.springframework`) are usually not the real problem.
@@c4 A calm debugging method
1) Read the message. 2) Open the file and line. 3) Make a guess about the cause and test it with a print statement or a debugger. 4) Change one thing and run again. If you change five things at once, you cannot tell which one helped.
@@example Fix the greeting
Above, line 7 of `Greeter.java` uses `name.length()`, and `name` is null because `Main` passed nothing. Either check `if (name == null)` first or pass a real name from `Main`. After the change, the program prints `Hello, Ava!` and the error is gone.
@@use
1. A student finds a missing semicolon by reading the compile error.
2. A developer follows a stack trace to a line where a list was empty.
3. A team adds a request ID to errors so they can find the right stack trace in the logs.
@@wrong
Mistakes: ignoring the message, fixing the last error instead of the first, changing many things at once, and deleting code until the error "goes away" without knowing why. Another trap: swallowing the exception with an empty `catch`, which hides the very clue you needed.

=== 05a
@@meta
{
  "file": "05a-arrays-and-looping-over-data.md",
  "after": "05-control-flow-and-methods.md",
  "scope": "Teach arrays, indexes, for-each loops, 2D grids, common mistakes like off-by-one and ArrayIndexOutOfBounds, and when to use a List instead.",
  "reason": "Arrays are the simplest way to store many items in a row. Learning them, and the loops that walk through them, is the base for working with data of any size.",
  "terms": {"array": "a row of boxes of the same type, each with a number called an index", "index": "the number of a box in an array, starting at zero", "length": "how many boxes an array has", "forEach": "a loop that visits each item without using the index"},
  "facts": ["An array has a fixed size that is set when it is created.", "The first box has index 0, and the last box has index length minus one.", "Using an index outside the array throws ArrayIndexOutOfBoundsException.", "A for-each loop is the simplest way to visit every item when you do not need the index.", "When the size needs to grow or shrink, use a List such as ArrayList."],
  "scenario": "An array has 5 items and your loop runs while i <= 5. What happens?",
  "choices": ["It crashes with an index out of bounds error at i equal to 5", "It prints 6 items", "It silently skips the last item", "It makes the array bigger"],
  "expected": "avoid-off-by-one",
  "diagrams": ["java-array-boxes-and-index.svg"]
}
@@picture
Picture an egg carton with six cups in a row. Each cup holds one egg, and each cup has a position: first, second, third... Programmers count from zero, so the first cup is number 0, and the last is number 5.

An **array** is that egg carton. All the cups hold the same kind of thing, and the carton's size is fixed when you buy it. You can look into any cup quickly if you know its number.
@@diagram
flowchart LR
    A["Index 0: 5"] --- B["Index 1: 8"] --- C["Index 2: 3"] --- D["Index 3: 9"] --- E["Index 4: 1"]
@@goal
- Create arrays and read or change items by index.
- Loop with `for` and with for-each.
- Avoid off-by-one mistakes and know when to use a List.
@@words
- **array**: a fixed-size row of boxes holding the same type.
- **index**: the number of a box, starting at 0.
- **length**: the number of boxes (`array.length`, with no parentheses).
- **for-each loop**: a loop that visits every item for you.
- **2D array**: an array of arrays, like a grid or a chessboard.
- **off-by-one error**: going one box too far or stopping one too soon.
@@why
Almost every program works with many similar things: scores, prices, pixels, names. Arrays and loops are the first and simplest way to handle them.
@@c1 Make an array and use it
```java
int[] scores = {5, 8, 3, 9, 1};
System.out.println(scores[0]);      // 5, the first
scores[2] = 10;                      // change the third box
System.out.println(scores.length);  // 5
```
The square brackets say "array". `scores[2]` means "the box with index 2".
@@c2 Walk through with a loop
```java
for (int i = 0; i < scores.length; i++) {
    System.out.println(scores[i]);
}
```
The loop starts at 0 and stops before `length`. Notice `<` and not `<=`. The last valid index is `length - 1`.
@@c3 For-each is simpler
```java
int total = 0;
for (int score : scores) {
    total += score;
}
```
Read it as "for each score in scores". No index to get wrong. Use it whenever you only need the values, not the positions.
@@c4 Fixed size, or a List?
An array cannot grow. If you need to add or remove items, use `ArrayList`. A 2D array, such as `int[][] grid = new int[3][3];`, is like a tic-tac-toe board: `grid[row][column]`. And remember the `ArrayIndexOutOfBoundsException`: it means you looked in a box that does not exist.
@@example Find the biggest score
```java
int best = scores[0];
for (int s : scores) {
    if (s > best) best = s;
}
System.out.println("Best: " + best);
```
Start by assuming the first one is the best. Then check every score, and if one is bigger, it becomes the new best. At the end `best` holds the biggest.
@@use
1. A class stores 30 test scores and finds the average.
2. A game uses a 2D array for the squares of a board.
3. A weather program keeps daily temperatures in an array and finds the hottest day.
@@wrong
Mistakes: using `<=` instead of `<` and falling off the end (off-by-one), forgetting that counting starts at zero, trying to make an array longer, and writing `length()` instead of `length` for arrays. For text, `length()` has parentheses, but for arrays it does not.

=== 06a
@@meta
{
  "file": "06a-static-final-and-this-explained.md",
  "after": "06-classes-objects-and-encapsulation.md",
  "scope": "Explain static versus instance members, final variables and classes, the this keyword, and constants, using simple analogies and short examples.",
  "reason": "The words static, final, and this appear in nearly every Java file. Beginners often copy them without knowing what they mean, which causes confusing errors.",
  "terms": {"staticMember": "something that belongs to the class itself, shared by all objects", "instanceMember": "something that belongs to one particular object", "finalVariable": "a variable that can be set only once", "thisKeyword": "a word that means the current object"},
  "facts": ["A static field or method belongs to the class and is shared by every object of that class.", "An instance field belongs to one object, and each object has its own copy.", "A final variable can be given a value only once.", "The word this refers to the current object, and helps when a parameter has the same name as a field.", "A static method cannot use instance fields directly because it does not belong to any one object."],
  "scenario": "You want a counter that tracks how many Note objects have been created in total. What should it be?",
  "choices": ["A static field in the Note class", "An instance field that every note copies", "A local variable in the constructor", "A final field set to zero"],
  "expected": "use-static-counter",
  "diagrams": ["java-static-versus-instance.svg"]
}
@@picture
Think of a school. Each student has their own name and their own backpack. Those belong to *each student*. But the school has one bell and one school name that everyone shares. That belongs to *the school itself*.

In Java, the things each object owns are **instance** members. The things shared by the whole class are **static** members. Another word, **final**, means "once set, never changed", like a name written in permanent marker.
@@diagram
flowchart LR
    C["class Student"] --> S["static: schoolName, shared by all"]
    C --> A["object Ava: her own name"]
    C --> B["object Ben: his own name"]
@@goal
- Explain static versus instance in plain words.
- Use `final` for constants and for safer variables.
- Use `this` to point to the current object.
@@words
- **static**: belongs to the class itself and is shared.
- **instance**: belongs to one object.
- **final**: can be given a value only once.
- **constant**: a final static value that never changes, like `MAX_SIZE`.
- **this**: the current object.
- **utility method**: a static method that does a job without needing an object, like `Math.max`.
@@why
Mixing up static and instance is one of the most common beginner errors, with messages like "non-static variable cannot be referenced from a static context". Understanding the idea once clears up a lot of confusion.
@@c1 Instance: each object has its own
```java
class Student {
    String name;            // each student has their own
}
Student a = new Student(); a.name = "Ava";
Student b = new Student(); b.name = "Ben";
```
Changing `a.name` does not change `b.name`. Two different backpacks.
@@c2 Static: one copy for the class
```java
class Student {
    static int count = 0;       // one number, shared
    Student() { count++; }
}
```
Every `new Student()` adds one to the same `count`. You read it with the class name: `Student.count`. Methods can be static too, like `Math.max(3, 8)`: you do not need a Math object.
@@c3 final: set once
`final int maxPages = 100;` can never be changed after this. A common pattern for constants: `static final int MAX_TITLE = 80;`. Capital letters with underscores are the habit for constants. A `final` class cannot be extended, and a `final` method cannot be overridden.
@@c4 this: the current object
```java
class Note {
    private String title;
    Note(String title) {
        this.title = title;   // field = parameter
    }
}
```
Both the field and the parameter are called `title`. `this.title` is the field of this object. A static method has no "this", because it does not belong to one object, which explains that confusing error message.
@@example Counting students
```java
Student a = new Student();
Student b = new Student();
System.out.println(Student.count);   // 2
```
The count lives in the class, so it is 2 no matter which student you ask. If `count` were not static, each student would have their own count of 1.
@@use
1. A `Math` class with utility methods such as `max` and `sqrt`.
2. A `MAX_TITLE_LENGTH` constant used in many places.
3. A counter that tracks how many objects have been created.
@@wrong
Mistakes: making a field static just to avoid an error (it then becomes shared by everyone!), changing static data from many threads without a lock, and using `final` and thinking the object inside can never change. A `final List` means the variable always points to the same list, but you can still add things to the list.

=== 08a
@@meta
{
  "file": "08a-design-patterns-singleton-factory-builder-observer.md",
  "after": "08-interfaces-abstract-types-and-sealed-choices.md",
  "scope": "Introduce four common design patterns in plain words: singleton, factory, builder, and observer, with short Java examples and cautions.",
  "reason": "Design patterns are named solutions to problems that many programmers meet again and again. Knowing the names helps you read other people's code and talk about design clearly.",
  "terms": {"singleton": "a class that allows only one object to exist", "factory": "a method that creates objects so the caller does not use new directly", "builder": "a helper that makes an object step by step with named settings", "observer": "a pattern where listeners are told when something changes"},
  "facts": ["A singleton allows exactly one instance, but too many singletons make code hard to test.", "A factory hides which exact class is created behind a simple method.", "A builder is helpful when an object has many optional settings.", "In the observer pattern, the subject keeps a list of listeners and notifies them of changes.", "Patterns are tools, not goals, and the simplest code that works is usually best."],
  "scenario": "A class has ten settings and most are optional, so constructors become confusing. Which pattern helps?",
  "choices": ["The builder pattern with named steps", "A singleton", "Ten constructors with different orders", "Making every field public"],
  "expected": "use-builder",
  "diagrams": ["java-four-design-patterns.svg"]
}
@@picture
Cooks do not invent a way to fold a paper bag each time. They use known tricks with names. Programmers too have well-known tricks for common problems, called **design patterns**. When someone says "use a factory", everyone understands the idea right away.

In this lesson we meet four friendly ones: **Singleton** (just one), **Factory** (a maker), **Builder** (step-by-step assembly), and **Observer** (a notification list).
@@diagram
flowchart LR
    S["Singleton: only one"] --- F["Factory: makes things"]
    F --- B["Builder: assembles step by step"]
    B --- O["Observer: tells listeners"]
@@goal
- Describe singleton, factory, builder, and observer in your own words.
- Write a small example of each.
- Know the cost of each and when not to use it.
@@words
- **design pattern**: a named, reusable solution to a common problem.
- **singleton**: a class with only one object.
- **factory**: something that creates objects for you.
- **builder**: assembles an object step by step.
- **observer**: a listener that is told when something changes.
- **subject**: the thing that is watched in the observer pattern.
@@why
Patterns give us a shared vocabulary. They also warn us about the downsides, because every pattern also adds some complexity.
@@c1 Singleton: exactly one
```java
class Settings {
    private static final Settings INSTANCE = new Settings();
    private Settings() {}
    static Settings get() { return INSTANCE; }
}
```
The constructor is private, so nobody else can call `new Settings()`. It is like the school bell: there is just one. But be careful: global single objects make tests harder, so use them rarely.
@@c2 Factory: a maker method
```java
static Shape create(String kind) {
    return switch (kind) {
        case "circle" -> new Circle();
        case "square" -> new Square();
        default -> throw new IllegalArgumentException(kind);
    };
}
```
The caller asks for a "circle" and does not need to know which class is used. This makes it easy to add new kinds in one place.
@@c3 Builder: many options, clear code
```java
Note note = new NoteBuilder()
    .title("Math")
    .tag("homework")
    .pinned(true)
    .build();
```
Instead of a long constructor like `new Note("Math", null, true, false, 3)`, which nobody can read, the builder names each setting. `build()` checks the rules and gives you the finished object.
@@c4 Observer: tell the listeners
```java
interface Listener { void onSaved(Note note); }
class NoteStore {
    private final List<Listener> listeners = new ArrayList<>();
    void add(Listener l) { listeners.add(l); }
    void save(Note n) { /* ... */ listeners.forEach(l -> l.onSaved(n)); }
}
```
The store keeps a list of listeners and tells all of them when a note is saved. The store does not know what they do: one sends an email, another updates a counter.
@@example A notification when a note is saved
Create a `NoteStore`. Add one listener that prints "Saved Math" and another that adds one to a counter. When `save` is called, both run. Later you can add a third listener without touching `NoteStore` at all.
@@use
1. A game has one `Settings` object that all parts read.
2. A drawing app creates shapes using a factory.
3. A form with many optional fields uses a builder.
@@wrong
Mistakes: using a pattern because it sounds smart (not because there is a problem), singletons that hide dependencies and make tests hard, builders for classes with only two fields, and observers that forget to remove listeners, which causes memory leaks. If a plain constructor is clear, keep it.

=== 10a
@@meta
{
  "file": "10a-equals-hashcode-and-sorting.md",
  "after": "10-collections-and-generics.md",
  "scope": "Explain why equals and hashCode must go together, how HashSet and HashMap use them, and how to sort with Comparable and Comparator.",
  "reason": "Collections need to know when two objects count as the same and how to put them in order. If equals, hashCode, or the sort rule are wrong, sets lose items and lists come out in a strange order.",
  "terms": {"equalsMethod": "the method that decides whether two objects count as the same", "hashCode": "a number made from an object so collections can find it quickly", "comparator": "a rule that says which of two objects comes first", "naturalOrder": "the default way things sort, such as numbers from small to large"},
  "facts": ["If two objects are equal, they must give the same hashCode.", "HashSet and HashMap use hashCode first to find the right spot and equals to confirm the match.", "Records and enums already have correct equals and hashCode.", "A Comparator lets you sort by any rule, such as by title or by date.", "Never change a field that is used in hashCode while the object is inside a HashSet."],
  "scenario": "Two Note objects have the same id and title, but a HashSet keeps both. What is the most likely cause?",
  "choices": ["The class does not override equals and hashCode", "The set is too small", "Strings cannot be compared", "The notes are too long"],
  "expected": "override-equals-hashcode",
  "diagrams": ["java-equals-hashcode-and-sorting.svg"]
}
@@picture
Suppose you have two cards that both say "Ava, age 10". Are they the same card or two copies? In real life you might say "same person". But Java, by default, says "different", because they are two different pieces of paper.

You must teach Java what "the same" means for your own classes. That teaching is called **equals**. A second method, **hashCode**, is like a quick label that lets collections find things in a flash. And a **Comparator** tells Java how to put things in order.
@@diagram
flowchart LR
    A["Two Note objects"] --> H{"Same hashCode?"}
    H -->|"No"| D["Different"]
    H -->|"Yes"| E{"equals says same?"}
    E -->|"Yes"| S["Same: set keeps one"]
    E -->|"No"| D
@@goal
- Explain `==` versus `equals`.
- Explain why `equals` and `hashCode` go together.
- Sort a list with `Comparable` and `Comparator`.
@@words
- **equals**: decides if two objects count as the same.
- **hashCode**: a number that helps collections find objects quickly.
- **hash collection**: a `HashSet` or `HashMap`, which use hashCode.
- **Comparable**: an interface saying "I know my natural order".
- **Comparator**: a separate rule for ordering, so you can sort in many ways.
- **record**: a data class that gets correct equals and hashCode for free.
@@why
Without correct `equals` and `hashCode`, a `HashSet` may keep duplicates and a `HashMap` may fail to find a key you just stored. Bugs like these are confusing, because nothing crashes: the answers are just quietly wrong.
@@c1 == and equals are different
`==` asks "are these the very same object in memory?" `equals` asks "do these count as the same thing?" For your own class, `equals` starts out the same as `==` until you override it.
@@c2 equals and hashCode are a pair
```java
@Override public boolean equals(Object o) {
    return o instanceof Note n && id == n.id && title.equals(n.title);
}
@Override public int hashCode() {
    return Objects.hash(id, title);
}
```
The rule: if two objects are equal, they must have the same hashCode. A hash collection uses the hashCode to jump to the right "drawer", and then equals to check the match inside the drawer. Break the pair and the lookup goes to the wrong drawer.
@@c3 Records do it for you
`record Note(int id, String title) {}` already has correct `equals` and `hashCode` that compare all fields. That is one more reason to use records for simple data.
@@c4 Sorting with Comparator
```java
notes.sort(Comparator.comparing(Note::title));
notes.sort(Comparator.comparing(Note::id).reversed());
```
A `Comparator` says how to order. You can sort by title, then by id, or backwards. `Comparable` is for one built-in "natural" order, like numbers or alphabetical order. Comparator is the flexible tool.
@@example A set that keeps too many
```java
Set<Note> set = new HashSet<>();
set.add(new Note(1, "Math"));
set.add(new Note(1, "Math"));
System.out.println(set.size());   // 2 if Note is a normal class without equals; 1 for a record
```
Without equals and hashCode, Java sees two different objects. With them (or with a record) it sees the same note and stores it once.
@@use
1. A set of unique student records.
2. A map where a custom `ProductKey` object finds a price.
3. A list of names sorted alphabetically, then by age.
@@wrong
Mistakes: overriding `equals` but not `hashCode`, using fields that change in hashCode (the object gets lost in the set), comparing with `==` for objects, and a Comparator that is not consistent, such as subtracting numbers that may overflow. Use `Integer.compare` instead of subtraction.
