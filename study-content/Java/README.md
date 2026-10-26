# Java: course reading order

A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.

## How to study

Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.

## Prerequisites


You need a terminal, a text editor, Java 17 or newer, and curiosity. You do not
need to know Spring, Oracle, or object-oriented programming first. Learn the
language in small steps and run every example.



## Reading order

1. [Learning Map](01-learning-map.md)
2. [Why Java And Language History](02-why-java-and-language-history.md)
3. [Jdk Jvm Compiler And First Program](03-jdk-jvm-compiler-and-first-program.md)
4. [Reading Error Messages And Stack Traces](03a-reading-error-messages-and-stack-traces.md)
5. [Variables Types And Operators](04-variables-types-and-operators.md)
6. [Control Flow And Methods](05-control-flow-and-methods.md)
7. [Arrays And Looping Over Data](05a-arrays-and-looping-over-data.md)
8. [Classes Objects And Encapsulation](06-classes-objects-and-encapsulation.md)
9. [Static Final And This Explained](06a-static-final-and-this-explained.md)
10. [Inheritance Composition And Polymorphism](07-inheritance-composition-and-polymorphism.md)
11. [Interfaces Abstract Types And Sealed Choices](08-interfaces-abstract-types-and-sealed-choices.md)
12. [Design Patterns Singleton Factory Builder Observer](08a-design-patterns-singleton-factory-builder-observer.md)
13. [Records Enums And Value Objects](09-records-enums-and-value-objects.md)
14. [Collections And Generics](10-collections-and-generics.md)
15. [Equals Hashcode And Sorting](10a-equals-hashcode-and-sorting.md)
16. [Null Optional And Validation](11-null-optional-and-validation.md)
17. [Exceptions And Error Design](12-exceptions-and-error-design.md)
18. [Dates Time Strings And Unicode](13-dates-time-strings-and-unicode.md)
19. [Lambdas Streams And Functional Style](14-lambdas-streams-and-functional-style.md)
20. [Files Json Http And Jdbc](15-files-json-http-and-jdbc.md)
21. [Concurrency Threads And Executors](16-concurrency-threads-and-executors.md)
22. [Jvm Memory Resources And Performance](17-jvm-memory-resources-and-performance.md)
23. [Packages Visibility And Modules](18-packages-visibility-and-modules.md)
24. [Gradle Dependencies And Builds](19-gradle-dependencies-and-builds.md)
25. [Testing Debugging And Quality](20-testing-debugging-and-quality.md)
26. [Security And Safe Input](21-security-and-safe-input.md)
27. [Java Backend Project Structure](22-java-backend-project-structure.md)
28. [Java To Spring Boot Bridge](23-java-to-spring-boot-bridge.md)
29. [Capstone Study Notes Service](24-capstone-study-notes-service.md)
30. [Glossary Practice And Checklist](25-glossary-practice-and-checklist.md)

## A-to-Z coverage map


| Letter | Topic | Question to answer |
| --- | --- | --- |
| A | Application and API | What job does this program perform? [Learning Map](01-learning-map.md) |
| B | Build, bytecode, and booleans | How does source become a running program? [Jdk Jvm Compiler And First Program](03-jdk-jvm-compiler-and-first-program.md) |
| C | Classes, conditions, and collections | How are values grouped and chosen? [Classes Objects And Encapsulation](06-classes-objects-and-encapsulation.md) |
| D | Data types and dates | What kind of value is this? [Variables Types And Operators](04-variables-types-and-operators.md) |
| E | Exceptions and enums | How is an unusual path represented? [Records Enums And Value Objects](09-records-enums-and-value-objects.md) |
| F | Fields and functions | Where does state live and what action changes it? [Classes Objects And Encapsulation](06-classes-objects-and-encapsulation.md) |
| G | Generics | How can a collection stay type-safe? [Collections And Generics](10-collections-and-generics.md) |
| H | Heap and stack | Where do objects and method calls live? [Jvm Memory Resources And Performance](17-jvm-memory-resources-and-performance.md) |
| I | Interfaces and inheritance | How can code depend on a promise? [Inheritance Composition And Polymorphism](07-inheritance-composition-and-polymorphism.md) |
| J | JDK, JAR, and JVM | Which tool runs which part? [Learning Map](01-learning-map.md) |
| K | Keywords | What do words such as `final` and `static` mean? [Learning Map](01-learning-map.md) |
| L | Lambdas and lists | How can collection work be expressed clearly? [Lambdas Streams And Functional Style](14-lambdas-streams-and-functional-style.md) |
| M | Methods and memory | What should one method own? [Control Flow And Methods](05-control-flow-and-methods.md) |
| N | Null and naming | How do we represent missing data? [Null Optional And Validation](11-null-optional-and-validation.md) |
| O | Objects and OOP | What does an object protect? [Classes Objects And Encapsulation](06-classes-objects-and-encapsulation.md) |
| P | Packages and records | How are code and data organized? [Records Enums And Value Objects](09-records-enums-and-value-objects.md) |
| Q | Queues and concurrency | How does work wait safely? [Collections And Generics](10-collections-and-generics.md) |
| R | References and resources | What does a variable point to? [Variables Types And Operators](04-variables-types-and-operators.md) |
| S | Strings, streams, SQL, and security | How does data move through a program? [Dates Time Strings And Unicode](13-dates-time-strings-and-unicode.md) |
| T | Tests, threads, and time | How do we prove behavior and schedule work? [Dates Time Strings And Unicode](13-dates-time-strings-and-unicode.md) |
| U | Unicode and user input | How should text be handled? [Dates Time Strings And Unicode](13-dates-time-strings-and-unicode.md) |
| V | Visibility and value objects | Who may call or change this? [Classes Objects And Encapsulation](06-classes-objects-and-encapsulation.md) |
| W | Wrappers and writing files | How do primitive values meet objects? [Files Json Http And Jdbc](15-files-json-http-and-jdbc.md) |
| X | XML and external formats | How does Java talk to older systems? [Learning Map](01-learning-map.md) |
| Y | YAML and build configuration | Where do environment values belong? [Design Patterns Singleton Factory Builder Observer](08a-design-patterns-singleton-factory-builder-observer.md) |
| Z | Zero-to-service project | Can the language become a useful API? [Java Backend Project Structure](22-java-backend-project-structure.md) |



## Diagram library

- [source, compiler, bytecode, classpath, JVM, program, and tests](images/java-source-compiler-jvm-flow.svg)
- [values entering variables, conditions, loops, methods, and results](images/java-types-and-control-flow.svg)
- [class blueprint, object, private state, public method, invariant](images/java-class-object-encapsulation.svg)
- [superclass, subclass, composed collaborator, and interface call](images/java-inheritance-composition-polymorphism.svg)
- [service depending on interface with memory and database adapters](images/java-interface-and-implementation.svg)
- [record data moving through List, Set, Map, and typed methods](images/java-records-collections-generics.svg)
- [try, resource, success, exception, cleanup, and safe caller error](images/java-exception-and-resource-flow.svg)
- [file, JSON, HTTP client, repository, JDBC, and database boundaries](images/java-files-http-jdbc-boundaries.svg)
- [request, executor, task, queue, heap, completion, and cancellation](images/java-thread-executor-and-memory.svg)
- [unit test, HTTP test, Spring bean, controller, service, repository](images/java-testing-and-spring-bridge.svg)
- [Read the first line for the kind of problem, then walk down the list of calls until you reach a line from your own code. That is the place to open and fix.](images/java-reading-a-stack-trace.svg)
- [The boxes are numbered from 0. The last box is length minus one. Asking for a number outside the row causes ArrayIndexOutOfBoundsException.](images/java-array-boxes-and-index.svg)
- [Static things belong to the class and are shared by every object. Instance things belong to one object. final means a value is set once and never changed.](images/java-static-versus-instance.svg)
- [Singleton: only one. Factory: a maker. Builder: step-by-step assembly. Observer: a list of listeners that get told. Use them only when they solve a real problem.](images/java-four-design-patterns.svg)
- [A HashSet uses hashCode to find the right drawer and equals to confirm a match, so the two must agree. A Comparator puts items in the order you choose.](images/java-equals-hashcode-and-sorting.svg)

## Sources and version record

Java 17 baseline; installed validation JDK may be newer. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.

- [Official reference](https://docs.oracle.com/en/java/javase/17/)

## Portable specification

[Generation blueprint](00-java-course-blueprint.md) · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)

## Validate

From the application directory run `pnpm courses:validate` and `pnpm test:learning`. Execute code only in isolated exercise projects, never in the web process.

