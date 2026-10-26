=== 17
@@picture
Your desk at school has two places for things. There is a small spot right in front of you for what you are using this very second (that is the **stack**). And there is a big shelf behind you for things you want to keep for later (that is the **heap**).

Java manages both for you. When nothing points to an object any more, a helper called the **garbage collector** removes it from the shelf. But the helper cannot close the door to a borrowed library room, which means files and database connections still need you.
@@diagram
flowchart LR
    S["Stack: current steps and local values"] -->|"points to"| H["Heap: objects that live longer"]
    H --> G["Garbage collector: frees unused objects"]
    P["Pool: borrowed connections"] -.->|"you must return them"| X["Not freed by the collector"]
@@goal
- Explain stack, heap, and garbage collection with the desk analogy.
- Spot a memory leak and a connection leak.
- Measure before trying to speed anything up.
@@words
- **stack**: the tidy area that tracks the method calls happening now.
- **heap**: the big area where objects live.
- **garbage collection**: Java automatically freeing objects nobody uses.
- **memory leak**: holding on to objects you no longer need.
- **connection pool**: a set of ready database connections to borrow.
- **profiling**: measuring where a program spends time or memory.
@@why
Slow or crashing programs often have nothing to do with the language itself. They happen because something is held too long or grows without a limit. Knowing where things live helps you find these problems.
@@c1 Stack and heap
When a method runs, its local variables sit on the stack. When it finishes, they vanish. Objects created with `new` live on the heap. The stack holds only the "address" of the object. That is why many variables can point to the same object.
@@c2 The garbage collector cleans up
When no variable can reach an object any more, the collector may remove it. You do not call `delete`. But if a long-lived list keeps pointing to old objects, they stay forever. This is a **leak**: not forgotten by Java, but still held by you.
@@c3 Some things the collector cannot close
Files, network sockets, and database connections are borrowed from the operating system or from a pool. The collector will not return them. You must close them yourself, using try-with-resources. If you forget, the pool runs dry and the app freezes.
@@c4 Measure first
Do not guess what is slow. Use a profiler or simple timers to find the real bottleneck. A cache with no size limit is a common leak: it grows until memory is full. Give every cache a maximum size and a rule for what to drop.
@@example A leaking list
```java
static final List<byte[]> keep = new ArrayList<>();
void handle() {
    keep.add(new byte[1_000_000]);   // never removed!
}
```
Every call adds a megabyte that stays forever. After a thousand requests, that is a gigabyte, and the program runs out of memory. Fix: do not keep what you do not need, or limit the size.
@@use
1. A server watches its memory chart and sees it keep growing: a leak.
2. A web app returns database connections after every request, so the pool never runs dry.
3. A team uses a profiler to find that one slow loop used most of the time.
@@wrong
Mistakes: guessing instead of measuring, keeping everything in a static list, forgetting to close connections, and calling `System.gc()` hoping it fixes things (it does not). The cure is to be careful about what you hold and for how long.

=== 18
@@picture
In a school, some rooms are open to everyone (the hall), some only to students (classrooms), and some only to teachers (the staff room). A building is easier to manage when each room's door says who may enter.

Java does this with **packages** (folders for your classes) and **visibility** words: `public`, `protected`, `private`, and the default "package-private". They decide who may use what.
@@diagram
flowchart TD
    A["public: everyone can use it"] --> B["protected: this package and children"]
    B --> C["package-private: this package only"]
    C --> D["private: this class only"]
@@goal
- Organize code into packages.
- Pick `public`, `private`, or package-private on purpose.
- Describe modules and why circular dependencies are a problem.
@@words
- **package**: a folder-like group of related classes.
- **public**: anyone may use it.
- **private**: only the same class may use it.
- **package-private**: only classes in the same package may use it.
- **module**: a bigger bundle that decides what it shares with other modules.
- **dependency cycle**: A needs B and B needs A.
@@why
When everything is public, any code can use any other code and nothing can ever be changed safely. Hiding things gives you freedom to change the inside later.
@@c1 Packages are folders with names
`package com.school.notes;` at the top of a file places it in a group. Related classes live together: `notes`, `users`, `billing`. Package names are written in lowercase.
@@c2 The four visibility levels
`private` is the tightest, then package-private (no word), then `protected`, then `public`. Start with the tightest level that works. You can always open a door later, but closing a door that others are using is hard.
@@c3 Keep a small public face
A package should show only the few classes others really need, and hide the helpers. That small public surface is the promise you must keep. Everything hidden can change freely.
@@c4 Avoid cycles
If package `notes` needs `users` and `users` needs `notes`, they are tangled: you cannot understand or test either alone. Draw the arrows between packages. Arrows should go in one direction. Java modules (`module-info.java`) can make these boundaries strict for larger projects.
@@example Hide the helper
```java
package com.school.notes;

public class NoteService {          // public: others use it
    public void save(Note note) { validate(note); /* ... */ }
    private void validate(Note note) { /* only used inside */ }
}
```
Other packages can call `save`, but cannot call `validate`. We can rewrite `validate` tomorrow without breaking anyone.
@@use
1. A library has one public class to use and many hidden helper classes.
2. A project is split into `web`, `service`, and `repository` packages with arrows pointing one way.
3. A company shares a module with only the classes other teams may use.
@@wrong
Mistakes: making everything `public` "just in case", putting every class in one package, and creating cycles between packages. A simple rule: if you are not sure it needs to be public, make it private.

=== 19
@@picture
Cooking a big meal is easier with a shopping list and a recipe. A **build tool** like Gradle is your shopping list and recipe for a Java project. It knows which libraries to fetch (dependencies), how to compile, how to run tests, and how to pack the final program.

Instead of doing these steps by hand every time, you type one command, and Gradle does them all in the same way on every computer.
@@diagram
flowchart LR
    B["build.gradle: the recipe"] --> D["Download dependencies"]
    D --> C["Compile"]
    C --> T["Run tests"]
    T --> J["Package into a JAR"]
@@goal
- Explain what Gradle does and its main tasks.
- Add a dependency and understand its scope.
- Keep secrets out of the build and make builds repeatable.
@@words
- **build tool**: a program that compiles, tests, and packages your project.
- **Gradle**: a popular Java build tool.
- **dependency**: a library your project needs.
- **repository**: a place that stores libraries to download.
- **task**: one named step of the build, like `test`.
- **artifact**: the finished result of a build, like a JAR file.
@@why
Without a build tool, every developer has different library versions and different steps, and "it works on my machine" becomes a daily sentence. A build file makes everything the same.
@@c1 One command does it all
`./gradlew build` compiles, runs tests, and makes the JAR. `./gradlew test` runs only the tests. The `gradlew` file is a small helper that downloads the right Gradle version, so you do not even need to install it.
@@c2 Dependencies come from repositories
In `build.gradle` you write: `implementation 'org.slf4j:slf4j-api:2.0.13'`. Gradle downloads that library from a repository like Maven Central. Different scopes mean: `implementation` for normal code and `testImplementation` for tests only.
@@c3 Repeatable builds
Always say the exact version of each library. "Latest" changes without warning and can break your project overnight. A lock or fixed version means the same build today, next month, and on a teammate's computer.
@@c4 Keep secrets out
Never write passwords or API keys into `build.gradle` or any file you share. Load them from the environment on the machine that needs them. The build artifact should be the same for every environment.
@@example A small build file
```groovy
plugins { id 'java' }
repositories { mavenCentral() }
dependencies {
    implementation 'com.google.guava:guava:33.2.1-jre'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}
test { useJUnitPlatform() }
```
This tells Gradle: it is a Java project, get libraries from Maven Central, use Guava in the app, and use JUnit only for tests.
@@use
1. A team builds the same JAR on every developer's laptop and on the build server.
2. A project upgrades one library version in one line and reruns the tests.
3. A build server runs `./gradlew build` for every change.
@@wrong
Mistakes: using "latest" versions, adding libraries "just in case" (each one is code you must trust and update), putting secrets in the build file, and not running tests in the build. A broken test should stop the build.

=== 20
@@picture
Before a school play, everyone rehearses. The actors practice the happy ending, but a good director also asks, "What if the curtain gets stuck? What if someone forgets a line?" and rehearses those too.

Tests are the rehearsals for your code. You write small programs that call your code and check the answer. If something breaks later, the rehearsal fails and tells you before the audience sees.
@@diagram
flowchart LR
    A["Arrange: set up data"] --> B["Act: call the code"]
    B --> C["Assert: check the result"]
    C --> D["Also test the failure case"]
@@goal
- Write a JUnit test using arrange, act, assert.
- Test failures and edge cases, not only the happy path.
- Explain mocks, coverage, and debugging steps.
@@words
- **test**: a small program that checks that code works.
- **JUnit**: the most popular Java testing library.
- **assertion**: a check, such as "the answer must be 5".
- **fixture**: prepared data or setup for a test.
- **mock**: a fake helper used in a test.
- **coverage**: how much of your code the tests ran.
@@why
Fixing a bug in one place often breaks something somewhere else. A set of tests that runs in seconds tells you right away.
@@c1 Arrange, act, assert
```java
@Test
void trimsTheTitle() {
    Note note = new Note("  Math  ");        // arrange and act
    assertEquals("Math", note.title());      // assert
}
```
Set things up, do the one thing you want to test, and check the result. One test, one idea, and a clear name.
@@c2 Test the sad paths
```java
@Test
void rejectsBlankTitle() {
    assertThrows(IllegalArgumentException.class, () -> new Note("   "));
}
```
Many bugs hide in the unusual cases: empty, very big, negative, missing. A good test suite checks them on purpose.
@@c3 Mocks and fakes
A mock replaces a slow or risky helper (like a real email server) so the test is fast and safe. But a mock cannot prove the real thing works. So also keep a few tests that use the real database or service in a safe test setup.
@@c4 Coverage is a hint, not a score
Coverage tells how many lines the tests ran. A test with no assertion can give 100 percent and prove nothing. Aim for meaningful checks, and use a debugger or print statements to follow what the code does when a test fails.
@@example Test and fix
A test says `expected: 5 but was: 4`. You look at the code: the loop runs `i < 5` instead of `i <= 5`. You fix the one character, run the test again, and it turns green. Your test pointed straight at the problem.
@@use
1. A school grading program has tests for passing, failing, and missing scores.
2. A shop checks that discount code "SAVE10" works and that a fake code does not.
3. Before a release, the whole test suite runs in 30 seconds.
@@wrong
Mistakes: only testing when everything goes well, tests that depend on each other's order, tests that use real private data, and tests with no assertion. Also, do not change a test just to make it pass when the code is the part that is wrong.

=== 21
@@picture
Imagine a bank with a front door and a vault. The guard at the door checks every person, and nobody gets into the vault unless they are on the list. Even someone with a perfect uniform is checked, because uniforms can be faked.

In programs, "uniforms" are the data that comes from outside: forms, URLs, files. We never trust them. We check each one, we give each part only the power it needs, and we never leave keys lying around.
@@diagram
flowchart LR
    I["Outside input"] --> V["Check and clean it"]
    V --> A{"Allowed to do this?"}
    A -->|"Yes"| W["Do the work safely"]
    A -->|"No"| X["Refuse"]
@@goal
- Explain SQL injection and path traversal in simple words.
- Keep secrets safe and avoid logging private data.
- Separate "who are you?" from "may you do this?".
@@words
- **SQL injection**: tricking a program into running SQL a user typed.
- **path traversal**: using `../` to climb out of an allowed folder.
- **deserialization**: turning bytes back into objects, which is risky for untrusted data.
- **secret**: a password or key that must stay private.
- **authentication**: proving who you are.
- **authorization**: checking what you may do.
@@why
Attackers do not break in through clever magic. They try the doors we forgot to lock. Most problems come from trusting input that should have been checked.
@@c1 SQL injection
If you build SQL like `"... WHERE name = '" + name + "'"` and a user types `' OR '1'='1`, the query now matches everybody! Use `PreparedStatement` with `?` so the database treats the user's text only as data, never as commands.
@@c2 Path traversal
A file name such as `../../etc/passwd` tries to reach files outside your folder. Clean the path, then check that the result is still inside the allowed root. Reject anything else before opening the file.
@@c3 Secrets and logs
Keep passwords and keys in environment settings or a secrets manager, never inside code that is shared. And never print them: logs are read by many people. Also be careful with deserialization: reading objects from untrusted bytes can run harmful code, so prefer plain JSON with a fixed shape.
@@c4 Identity and permission
Authentication checks who you are. Authorization checks if this person may read this note. Check both on every request, on the server. Hiding a button in the screen is not a lock.
@@example Safe versus unsafe
Unsafe: `"SELECT * FROM users WHERE name = '" + name + "'"`
Safe: `"SELECT * FROM users WHERE name = ?"` and then `ps.setString(1, name)`. If a user types `' OR '1'='1`, it is just a strange name, and no rows match.
@@use
1. A login page uses prepared statements so nobody can inject SQL.
2. A download service refuses file names that try to leave its folder.
3. A server reads its database password from a protected setting, not from the code.
@@wrong
Mistakes: trusting the browser, glueing SQL from user text, printing passwords in logs, hard-coding keys, and giving every part of the program full powers. The safe habit: assume every input is hostile until it has been checked.

=== 22
@@picture
A restaurant has a clear flow: the waiter takes the order (controller), the chef follows the recipe (service), the pantry manager fetches ingredients (repository), and the recipe cards and food are the domain (the notes, the rules). Each person talks only to the next in line.

A Java backend is organized in the same way. Arrows go one way, and each layer has one job.
@@diagram
flowchart LR
    C["Controller: web requests"] --> S["Service: business rules"]
    S --> R["Repository: storage"]
    R --> D[("Database")]
    S --> M["Domain: Note, rules"]
@@goal
- Name the layers: controller, service, repository, domain.
- Keep dependencies pointing one way.
- Place configuration and tests where they belong.
@@words
- **controller**: receives web requests and sends back responses.
- **service**: applies the business rules.
- **repository**: reads and writes data.
- **domain**: the core classes and rules, like `Note`.
- **configuration**: settings that change between places.
- **layer**: one level of the program with one job.
@@why
When everything is in one class, nobody can find or change anything. A clear structure means a new teammate can find "where is the rule about blank titles?" in seconds.
@@c1 Controller: the front desk
It turns a web request into a method call and the result into a response. It does no business thinking. It only translates between the web world and your program.
@@c2 Service: the rules
`NoteService.create(title)` trims, checks, and decides. It does not know about HTTP or SQL. That is why it can be tested without a web server or a database.
@@c3 Repository: the storage helper
It hides database details behind an interface like `NoteRepository`. The service asks for `save` and `findById`. How it is done (SQL? memory?) is not the service's business.
@@c4 One direction only
Controller calls service, service calls repository. Never the other way. Folders can mirror the layers: `web`, `service`, `repository`, `domain`. Keep configuration (database address, ports) outside of the code, and tests next to the layer they check.
@@example Follow "create note"
`POST /notes` arrives at the controller. The controller calls `service.create("Math")`. The service trims and checks the title and calls `repository.save(note)`. The repository saves and returns the saved note. The service returns it, and the controller sends `201 Created`.
@@use
1. A to-do backend with `web`, `service`, `repository`, and `domain` folders.
2. A shop backend where the same service works for the website and the phone app.
3. A project where tests use an in-memory repository for speed.
@@wrong
Mistakes: SQL inside controllers, business rules inside repositories, services that depend on the web framework, and layers calling "upwards". If you cannot test a service without a database, the layers are mixed up.

=== 23
@@picture
Building a house from nothing means cutting every plank. Building from a kit is much faster. Spring is a kit for Java servers. It brings ready-made pieces for web requests, databases, and settings so you can focus on your own rules.

The important truth: Spring does not replace Java. Your classes are still plain Java classes. Spring just creates them (as **beans**), connects them to each other (**dependency injection**), and runs them when web requests come.
@@diagram
flowchart LR
    A["You write plain Java classes"] --> B["Spring creates them as beans"]
    B --> C["Spring injects what each needs"]
    C --> D["Web requests reach your controller"]
@@goal
- Explain what Spring adds and what stays plain Java.
- Explain beans and dependency injection in simple words.
- Read common annotations like `@RestController` and `@Service`.
@@words
- **Spring Boot**: a tool that sets up a Spring application with sensible defaults.
- **bean**: an object that Spring creates and manages for you.
- **dependency injection**: Spring hands each class what it needs, so you do not create it yourself.
- **annotation**: a label starting with `@` that tells Spring what a class is for.
- **profile**: a named set of settings, like `dev` or `prod`.
- **MVC**: the pattern for web controllers, models, and views.
@@why
Writing web servers from scratch is repeated work. Spring does the repeated parts the same way for everyone, so teams can move faster and new people can read the code.
@@c1 Spring adds plumbing
It handles HTTP, JSON, database connections, and settings. Everything else, your classes, rules, and tests, is still plain Java. If you understand Java, you already understand most of a Spring app.
@@c2 Beans and injection
```java
@Service
class NoteService {
    private final NoteRepository repository;
    NoteService(NoteRepository repository) { this.repository = repository; }
}
```
`@Service` says "Spring, please manage this." The constructor asks for a `NoteRepository`. Spring finds one and hands it over. You never write `new`.
@@c3 Annotations are labels
`@RestController` says "this class answers web requests". `@GetMapping("/notes")` says "this method handles GET /notes". `@Repository` and `@Service` label the other layers. They are instructions for Spring, not magic.
@@c4 Profiles change settings
A `dev` profile might use an in-memory database, and `prod` uses PostgreSQL. You change which one runs with a setting, not by editing code. Keep secrets out of the code, as always.
@@example A tiny endpoint
```java
@RestController
class NoteController {
    private final NoteService service;
    NoteController(NoteService service) { this.service = service; }

    @GetMapping("/notes/{id}")
    Note get(@PathVariable int id) { return service.find(id); }
}
```
When someone asks `GET /notes/7`, Spring calls `get(7)` and turns the returned `Note` into JSON.
@@use
1. A school builds an API for homework with Spring Boot in an afternoon.
2. A team swaps the real database for an in-memory one in tests just by changing the profile.
3. A new developer finds the controller by looking for `@RestController`.
@@wrong
Mistakes: believing Spring does the thinking for you (security and rules are still yours), putting business logic in the controller, field injection that makes classes hard to test, and not learning the plain Java underneath. Learn Java first and Spring will make sense.

=== 24
@@picture
In this final project you build a real little service from start to finish: a **Study Notes service**. You can create notes, list them, change them, and delete them (CRUD). You check the input, save to storage, handle errors, and test it all.

It is like the final model you build in science class: you use every idea you learned along the way, in one project.
@@diagram
flowchart LR
    R["HTTP request"] --> C["Controller"]
    C --> S["Service: validate and decide"]
    S --> P["Repository"]
    P --> D[("Storage")]
    C --> E["Safe error replies"]
@@goal
- Build and test a small CRUD service.
- Combine validation, layers, errors, and persistence.
- Add health checks, logging, and a rollback plan.
@@words
- **CRUD**: Create, Read, Update, Delete.
- **capstone**: the big final project that uses all your skills.
- **persistence**: saving data so it survives a restart.
- **health check**: a quick endpoint saying "I am alive and ready".
- **error code**: a short, steady code for a type of problem.
- **request ID**: a unique number to follow one request through the logs.
@@why
Knowing the pieces is not the same as using them together. A capstone proves that the pieces fit, and shows you what you still need to review.
@@c1 Plan first
Write the requirements: create a note with a title and body, list notes, update, delete. Write the numbers: one user, a few hundred notes. Draw the layers. Only then write code.
@@c2 Build from the inside out
Start with the `Note` record and its checks. Then the repository interface with an in-memory version. Then the service with tests. Last, the controller. This way, each piece works before the next sits on top of it.
@@c3 Handle the sad paths
Blank title: `400` with a clear message. Unknown id: `404`. Storage down: `503` with "try again". Never show stack traces. Every error has a steady code and a request ID that matches a private log line.
@@c4 Make it ready to run
Add a health endpoint, settings from the environment, a real database through a profile, and a script to build and run. Write down how to roll back, and how to restore the data from a backup.
@@example The first test
```java
@Test
void createsNoteAndFindsIt() {
    NoteService service = new NoteService(new InMemoryNoteRepository());
    Note saved = service.create("Math", "Fractions");
    assertEquals("Math", service.find(saved.id()).title());
}
```
This test runs in milliseconds. It proves create and find work together without any database.
@@use
1. A student turns the capstone into a portfolio project.
2. A team uses the same structure for a different service, such as tasks.
3. A teacher uses the capstone to see which lessons a student should review.
@@wrong
Mistakes: building everything at once with no tests, forgetting error cases, showing raw errors, and skipping the plan for running it for real. Also remember that the capstone uses made-up data. Never test with real people's information.

=== 25
@@picture
A glossary is a dictionary for this course. When you meet a word you do not know, look here. Each word has a short meaning in plain language. At the end there is a checklist, like a pilot's pre-flight list, and a few practice questions with answers.

The best way to use it: pick a word, close the page, and explain it aloud to an imaginary friend. If you can do that, you know the word.
@@diagram
flowchart LR
    A["Look up a word"] --> B["Explain it in your own words"]
    B --> C["Write a tiny example"]
    C --> D["Check with the list"]
@@goal
- Look up any Java word from the course.
- Use the mastery checklist before moving on.
- Answer review questions and compare them with sample answers.
@@words
- **class**: a blueprint for objects.
- **object**: one real thing made from a class.
- **interface**: a promise of actions.
- **method**: a named group of steps.
- **exception**: an object describing a problem.
- **collection**: a container for many items.
- **stream**: a pipeline for processing items.
- **thread**: one line of work that runs at the same time as others.
@@why
Learning is easier when you own the words. This lesson is your quick reference, and also a final check.
@@c1 The mastery checklist
Can you explain JDK, JVM, and compiler? Write a class with private fields? Use List, Set, and Map? Handle an exception safely? Write a test? Avoid SQL injection? Explain layers? If yes, you are ready for the next level.
@@c2 Practice question one
"What is the difference between `==` and `.equals` for strings?" Answer: `==` asks whether two variables point at the very same object. `.equals` asks whether the words inside are the same. Use `.equals` to compare text.
@@c3 Practice question two
"Why use an interface for a repository?" Answer: so the service depends on a promise, not on a particular database. This lets us use a fake in tests and the real one in production without changing the service.
@@c4 Spaced review
Come back to each lesson after a day, a week, and a month. Try the example from memory. If you cannot, read the lesson again for just that part. This is the fastest way to remember.
@@example A self-check
Write a `Note` record with a check for a blank title, a `List<Note>`, and a method that returns the notes whose titles contain a word. If you can write it without looking, you have the skills of this course.
@@use
1. A student reads the glossary before a Java quiz.
2. A new teammate uses it to understand code review comments.
3. A teacher uses the checklist for a final conversation with students.
@@wrong
Mistake: memorizing definitions without writing code. The words only become yours when you use them. Keep writing small programs and keep reading error messages.
