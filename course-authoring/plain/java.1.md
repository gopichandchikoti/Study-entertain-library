=== 01
@@picture
Learning Java is like learning to ride a bike. You do not read a book about bikes for a month and then ride. You get on, wobble, fall, and try again. Every small ride teaches your body something new.

This course works the same way. In every lesson you read a little, guess what a piece of code will do, run it, and see if you were right. When you are wrong, that is the best moment to learn, because now you know exactly which idea is missing.
@@diagram
flowchart LR
    A["Read a little"] --> B["Guess the result"]
    B --> C["Run the code"]
    C --> D["Compare"]
    D --> E["Review the missed idea"]
    E --> A
@@goal
- Follow the study loop: read, guess, run, compare, review.
- Know the order of the topics and why that order helps.
- Know what you will have built at the end.
@@words
- **program**: a list of instructions a computer follows.
- **code**: the words we write to make the program.
- **run**: tell the computer to follow the instructions.
- **bug**: a mistake in the code. Every programmer makes them!
- **prerequisite**: something to learn first.
@@why
Trying to memorize everything at once does not work. Small loops of "try, check, fix" build real skill, and you remember much longer than if you only read.
@@c1 Start with tiny programs
Your first programs will be just a few lines. That is perfect. Small programs are easy to understand, and when something breaks, there are only a few places to look.
@@c2 Guess before you run
Before pressing run, say what you think will happen. If you are right, great! If you are wrong, you just found something to learn. Guessing makes your brain pay attention.
@@c3 Errors are helpers
When Java prints an error, it is not scolding you. It is pointing at the line where something is wrong. Read it slowly: it often tells you almost exactly what to fix.
@@c4 Come back later
Your brain keeps what it needs. Look at old lessons after a day, a week, and a month. Try the exercise again without peeking. The little struggle of remembering is what makes it stick.
@@example Your first guess
Look at this line: `System.out.println(2 + 3);` What will it print? If you guessed 5, you are right. What about `System.out.println("2" + "3");`? It prints 23, because the quote marks make them words, and words are joined side by side. If you guessed wrong, that is great. Now you know the difference between numbers and text.
@@use
1. A student writes a small program that adds up prices in a shopping list.
2. A teacher uses a short program to calculate class averages.
3. A game uses many little rules, each written and tested on its own.
@@wrong
The biggest mistake is copying code without understanding it. It works today and breaks tomorrow, and you will not know why. Another mistake is skipping the exercises. Reading feels like learning, but trying is what makes it real.

=== 02
@@picture
Long ago, if you wrote a program for one kind of computer, it would not work on another. It was like a book written in a language only one town understood. Programmers had to rewrite everything for every kind of machine.

Java had a clever idea: "Write once, run anywhere." You write your program in Java. Java turns it into a special middle language. Then a small helper program on each computer, the **JVM**, understands the middle language. The same program runs on Windows, Mac, and Linux.
@@diagram
flowchart LR
    A["Your Java code"] --> B["Compiler"]
    B --> C["Bytecode: a middle language"]
    C --> W["JVM on Windows"]
    C --> M["JVM on Mac"]
    C --> L["JVM on Linux"]
@@goal
- Explain the problem Java was made to solve.
- Say what portable, compiled, and typed mean in simple words.
- Know when another language might be a better choice.
@@words
- **portable**: able to run on many kinds of computers.
- **JVM**: the Java Virtual Machine, the helper that runs Java programs.
- **bytecode**: the middle language Java is turned into.
- **compiled**: translated before running.
- **typed language**: every value has a label for what kind of thing it is.
- **release**: a new version of Java, which comes out twice a year.
@@why
Programs get big, and people on big teams need a language that catches mistakes early and works everywhere. Java was designed for that.
@@c1 Write once, run anywhere
Java does not make a program for one computer. It makes bytecode, which any computer with a JVM can run. Think of it like a recipe written in one language and a cook in each kitchen who understands it.
@@c2 Java checks your work early
Java is a typed language. If you try to put a word into a box meant for numbers, Java tells you before the program starts. It is like a teacher checking your homework before you hand it in.
@@c3 Java takes care of memory
In some older languages the programmer had to clean up memory by hand and forgetting caused crashes. Java has a garbage collector that tidies up memory that is no longer used, like a helper who throws away old papers.
@@c4 No language is best for everything
Java is great for big, long-lasting programs like banking, online shops, and Android apps. Python is nice for quick scripts and data work. JavaScript is for web pages. Choose the tool that fits the job, and remember that all of them are good at something.
@@example The same file on two computers
Anna writes `Hello.java` on a Windows laptop. She turns it into `Hello.class`. She emails the `.class` file to Ben, who uses a Mac. Ben runs it with the JVM and sees the same message, without Anna changing anything.
@@use
1. A bank uses Java for programs that must run reliably for many years.
2. Many Android phone apps are written in Java or Kotlin, which also uses the JVM.
3. Big online shops use Java for their servers.
@@wrong
Mistakes: thinking Java and JavaScript are the same (they are very different languages with similar names), thinking a program runs without the JVM installed, and picking Java for a tiny one-time script when a simple script language would be quicker.

=== 03
@@picture
Imagine you write a story in English and want a friend in another country to read it. You give it to a translator, who writes it in a common language. Your friend has a reader that understands that common language.

Java works the same. You write **source code** in a `.java` file. The **compiler** (`javac`) translates it into a `.class` file of **bytecode**. The **JVM** (`java`) reads the bytecode and does what it says. All of the tools together, plus helpers, are the **JDK**.
@@diagram
flowchart LR
    S["Hello.java: source code"] -->|"javac"| B["Hello.class: bytecode"]
    B -->|"java"| J["JVM runs it"]
    J --> O["Output on the screen"]
@@goal
- Tell the JDK, the JVM, and the compiler apart.
- Compile and run a first program.
- Explain `main`, the classpath, and a JAR file.
@@words
- **JDK**: the Java Development Kit, all the tools you need to write and run Java.
- **JVM**: the program that runs bytecode.
- **compiler**: the translator from source code to bytecode.
- **main**: the starting point of a Java program.
- **classpath**: the list of places where Java looks for finished code.
- **JAR**: a zip-like file holding many class files.
@@why
When something fails, you need to know which step failed: writing, translating, or running. Knowing the three steps makes mistakes much easier to find.
@@c1 JDK, JVM, compiler: who does what
The **JDK** is the full toolbox. Inside is the **compiler** (`javac`), which translates, and the **JVM** (`java`), which runs. If you only want to run Java programs, you need the JVM. To write them, you need the whole JDK.
@@c2 The first program
Every Java program begins at a method called `main`. When you run a class, Java looks for `main` and starts there. This is like the first page of a book: reading starts here.
@@c3 Bytecode is the middle language
`javac` checks your code for mistakes. If all is well, it creates `.class` files. These are not meant for humans. They are the instructions in a form the JVM loves.
@@c4 Classpath and JAR files
When your program uses code that lives elsewhere, Java needs to know where to look. The classpath is that list of places. A JAR file bundles many `.class` files into one tidy package so it is easy to share.
@@example Your first program
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```
Save it as `Hello.java`. In the terminal type `javac Hello.java` to compile, then `java Hello` to run. You should see `Hello, world!`. The file name must match the class name, and capital letters matter!
@@use
1. A student compiles and runs a first program to print their name.
2. A team packs their finished program into a JAR file and sends it to a server.
3. A teacher gives students a JAR of a game that runs on any computer with Java installed.
@@wrong
Common mistakes: the file name does not match the class name, forgetting a semicolon (`;`) at the end of a line, mixing up capital and small letters (`Main` is not `main`), and trying to run `java Hello.java` before understanding what compiled means. Read the first error message. It is usually the real one.

=== 04
@@picture
A variable is a labeled box. On the label you write the name, and you also write what kind of thing it may hold: `int age` is a box for whole numbers, `String name` is a box for words. Put something in, take it out, change it, or look at it.

Java is strict about labels. You cannot put a word into a number box. This strictness is a gift: Java stops many mistakes before the program even runs.
@@diagram
flowchart LR
    A["int age = 10"] --> B["Box labeled age holds 10"]
    C["String name = Ava"] --> D["Box labeled name holds Ava"]
    B --> E["age + 1 gives 11"]
@@goal
- Make variables and pick the right type for each.
- Use math, comparison, and logic operators.
- Explain the difference between `==` and `.equals`.
@@words
- **variable**: a labeled box that holds a value.
- **type**: what kind of value a variable can hold, like `int` or `String`.
- **primitive**: a basic value like a number or true/false.
- **reference**: a pointer to an object, like a street address to a house.
- **operator**: a symbol that does something, like `+` or `==`.
- **cast**: changing a value from one type to another.
@@why
Computers are fast but not smart. They need us to say exactly what each piece of data is. Types prevent silly mistakes, like adding a name to a price.
@@c1 Basic types
`int` is for whole numbers like 7. `double` is for numbers with decimals like 3.14. `boolean` is for true or false. `char` is for a single letter. `String` is for words. Pick the one that matches what you are storing.
@@c2 Operators do work
`+ - * /` do math. `==` asks "are these the same?" and `&&` means "and" while `||` means "or". Be careful: `7 / 2` is `3` with `int`, because whole-number math drops the leftover. Use `7 / 2.0` to get `3.5`.
@@c3 Primitive or reference?
A primitive like `int` holds the value itself. A reference, like for `String` or any object, holds an address that points to the object. This explains why `==` on two strings can say "no" even when the words are the same: it checks if the addresses are the same. To compare the words, use `.equals`.
@@c4 Casting and safe changes
Putting a small box into a bigger one is easy: `double d = 5;`. Going the other way loses information, so you must say so: `int n = (int) 3.9;` gives `3`, not 4. Casting cuts off the decimal part. Java makes you say it out loud so it is not an accident.
@@example Words and numbers
```java
int apples = 3;
int oranges = 4;
int fruit = apples + oranges;       // 7
String a = new String("hi");
String b = new String("hi");
System.out.println(a == b);         // false: different objects
System.out.println(a.equals(b));    // true: same words
```
Two different notebooks can both say "hi". They are not the same notebook (`==`), but they have the same words (`.equals`).
@@use
1. A shop program stores prices as numbers and names as text.
2. A game keeps a `boolean isAlive` that is true or false.
3. A school app divides total points by the count to find an average, using decimals.
@@wrong
Mistakes: comparing strings with `==`, dividing two whole numbers and expecting decimals, using a variable before giving it a value, and using a number box that is too small (an `int` cannot hold a huge number). When unsure, print the value and look at it.

=== 05
@@picture
Think of making a sandwich. You follow steps in order. *If* there is no bread, you stop. *For each* slice, you add butter. When you do the same thing again and again, you use a loop. And when you make a sandwich often, you give the whole job a name: "makeSandwich". That name is a method.

Control flow is how a program decides and repeats. Methods are named groups of steps you can use again and again.
@@diagram
flowchart TD
    S["Start"] --> I{"Is age at least 10?"}
    I -->|"Yes"| A["Print: big kid"]
    I -->|"No"| B["Print: little kid"]
    A --> E["End"]
    B --> E
@@goal
- Choose paths with `if` and `switch`.
- Repeat work with `for` and `while`.
- Write and call methods with parameters and return values.
@@words
- **condition**: a question with a yes or no answer.
- **loop**: repeating steps again and again.
- **method**: a named group of steps.
- **parameter**: a named slot for an input to a method.
- **return value**: the answer a method gives back.
- **recursion**: a method that calls itself.
@@why
Without choices and repeats, programs would only do the same thing in the same order. With them, programs can react, count, and work with lists of any size.
@@c1 if: choose a path
`if (age >= 10) { ... } else { ... }`. Java checks the condition. If it is true, it does the first block. Otherwise it does the second. You can chain choices with `else if`. `switch` is handy when you pick among many fixed options, like days of the week.
@@c2 Loops repeat work
`for (int i = 1; i <= 5; i++)` counts from 1 to 5. `while (condition)` repeats as long as the condition stays true. Always make sure something inside the loop eventually makes the condition false, or the loop never ends!
@@c3 Methods give names to steps
```java
static int add(int a, int b) {
    return a + b;
}
```
`a` and `b` are parameters. `return` sends back the answer. Then `add(2, 3)` gives `5`. You can reuse `add` as often as you like, and fix a mistake in only one place.
@@c4 Keep methods small
A good method does one job and has a clear name like `calculateTotal`. Small methods are easy to test and understand. A method that calls itself is recursion: useful, but make sure it has a stopping point, like a countdown that ends at zero.
@@example Counting down
```java
for (int i = 3; i >= 1; i--) {
    System.out.println(i);
}
System.out.println("Go!");
```
This prints 3, 2, 1, and then Go! The loop starts at 3 and subtracts one each time. When `i` becomes 0, the condition `i >= 1` is false and the loop stops.
@@use
1. A program decides if a student passes: if score is at least 50, print "Pass".
2. A loop adds up every price in a shopping list.
3. A method `isLeapYear(year)` is used in many places, written only once.
@@wrong
Mistakes: an endless loop because the counter never changes, being off by one (`<` versus `<=`), a very long method that does ten jobs, and forgetting `return`, so the method gives nothing back. When a loop misbehaves, print the counter on each turn to watch it.

=== 06
@@picture
A class is a blueprint for a house. It says: "Every house has a color, a door, and a way to open the door." An object is one real house built from the blueprint. You can build many houses from one blueprint, and each one can have its own color.

In Java, **fields** are what the object knows (its color), and **methods** are what it can do (open the door). By hiding the fields behind methods, we keep objects safe: nobody can paint the door a color that does not exist.
@@diagram
flowchart LR
    C["class Note: the blueprint"] --> O1["object: Note Math"]
    C --> O2["object: Note Science"]
    O1 --> P["private title"]
    O1 --> M["public rename(...)"]
@@goal
- Write a class with fields, a constructor, and methods.
- Create objects with `new`.
- Use `private` and methods to protect rules.
@@words
- **class**: a blueprint that describes what something knows and can do.
- **object**: one real thing made from a class.
- **field**: a variable that belongs to an object.
- **constructor**: a special method that builds a new object.
- **encapsulation**: hiding the inside and offering safe doors.
- **invariant**: a rule that must always be true, like "a title is never blank".
@@why
If anyone can change anything inside an object, rules get broken and bugs are hard to find. Hiding the data and offering safe methods means that the object protects itself.
@@c1 Classes and objects
`class Note { ... }` describes notes. `new Note("Math")` makes one. Each object has its own copy of the fields. Changing one note does not change another, just like painting one house does not paint the whole street.
@@c2 The constructor builds a good object
The constructor runs when you use `new`. Its job is to make sure the new object starts out valid. If the title is blank, it can refuse by throwing an error. Then no broken note can ever exist.
@@c3 Private fields, public methods
Mark fields `private` so only the class itself can touch them. Offer `public` methods for the safe actions. `rename("Science")` can check for a blank title before changing, so the rule can never be skipped.
@@c4 Objects have a life
An object is created, used, and eventually forgotten. When nothing points to it anymore, Java's garbage collector cleans it up. Whoever creates something special, like a file connection, must also close it.
@@example A safe Note
```java
public class Note {
    private String title;

    public Note(String title) {
        rename(title);
    }

    public void rename(String newTitle) {
        if (newTitle == null || newTitle.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        this.title = newTitle.trim();
    }

    public String title() { return title; }
}
```
Whether you create a note or rename it, the same check runs. A note with a blank title can never exist.
@@use
1. A `BankAccount` object that refuses to let the balance go below zero.
2. A `Student` class with a name and a list of grades.
3. A game's `Player` object that keeps its health between 0 and 100.
@@wrong
Mistakes: making every field public so any code can break the rules, forgetting to check the input in the constructor, and building giant classes that do everything. If a class has more than one clear job, split it.

=== 07
@@picture
There are two ways to build new things from old things. One is **"is a"**: a Dog *is an* Animal, so it gets all animal abilities for free. The other is **"has a"**: a Car *has an* Engine and asks it to start.

Both are useful, but "has a" is more flexible. If a car has an engine, you can swap the engine for a better one. If a Dog is-an Animal forever, you cannot easily change that later.
@@diagram
flowchart TD
    A["Animal: speak()"] --> D["Dog: says Woof"]
    A --> C["Cat: says Meow"]
    X["Car"] -->|"has a"| E["Engine"]
@@goal
- Explain inheritance with "is a" and composition with "has a".
- Use `extends` and method overriding.
- Explain polymorphism and why we often choose composition.
@@words
- **inheritance**: a child class gets what its parent class has.
- **override**: a child gives its own version of a parent's method.
- **polymorphism**: one call, many behaviors, depending on the real object.
- **composition**: an object that uses other objects to do its work.
- **abstract class**: a half-finished class that cannot be created directly.
- **substitutability**: a child can stand in for its parent without breaking anything.
@@why
We want to reuse code without copying it. But using inheritance carelessly can tie classes tightly together, so that changing a parent breaks many children.
@@c1 Inheritance: is a
```java
class Animal { String speak() { return "..."; } }
class Dog extends Animal {
    @Override String speak() { return "Woof"; }
}
```
`Dog` gets everything `Animal` has, and `@Override` replaces `speak`. Use inheritance only when the child really *is* a kind of the parent.
@@c2 Polymorphism: many shapes
`Animal pet = new Dog(); pet.speak();` The variable says Animal but the object is a Dog, so you hear "Woof". The same call works for cats, birds, and animals not yet invented. The code that calls `speak()` does not need to change.
@@c3 Composition: has a
A `Car` can keep an `Engine` inside and call `engine.start()`. If you want an electric engine later, you hand the car a different engine. The car's code does not change. It is like swapping batteries in a toy.
@@c4 Keep the parent's promise
A child must keep the promises of its parent. If every Animal can `speak()`, then a Fish that throws an error when asked to speak breaks the promise. This idea is called substitutability. When a child does not fit, choose composition instead.
@@example Many animals, one loop
```java
List<Animal> pets = List.of(new Dog(), new Cat());
for (Animal pet : pets) {
    System.out.println(pet.speak());
}
```
This prints "Woof" and then "Meow". The loop does not care about the kind of animal. Each animal answers in its own way.
@@use
1. A drawing program calls `draw()` on many kinds of shapes in one loop.
2. A game has a `Player` that has a `Weapon`, and swaps weapons any time.
3. A payments class has a `PaymentMethod` that can be a card or a wallet.
@@wrong
Mistakes: using inheritance only to reuse a few lines, building tall family trees that are hard to follow, and overriding a method so that it breaks the parent's rules. A good motto: "prefer has-a to is-a unless is-a is really true."

=== 08
@@picture
A wall socket has a certain shape. Any plug that fits will work: a lamp, a phone charger, a fan. The socket does not care which one. It only cares that the plug has the right shape.

A Java **interface** is the shape of the socket. It lists what is needed. Different classes can fit it in different ways. The code that uses the socket does not know or care which plug it got.
@@diagram
flowchart LR
    S["NoteService"] --> I["interface NoteRepository"]
    I --> M["InMemoryRepository"]
    I --> D["DatabaseRepository"]
@@goal
- Write an interface and implement it in two classes.
- Explain abstract classes and sealed types in simple words.
- Use fake implementations to make tests easy.
@@words
- **interface**: a list of actions that a class promises to provide.
- **implements**: a class says "I keep this promise".
- **abstract class**: a partly built class meant to be extended.
- **sealed**: a type that only allows a fixed list of children.
- **default method**: an interface method that already has a body.
- **test double**: a fake piece used in a test instead of the real one.
@@why
When your rules are tied to one specific database, you cannot test them without that database. With an interface, you can plug in a simple fake for tests and the real thing for production.
@@c1 An interface is a promise
```java
interface NoteRepository {
    void save(Note note);
    Optional<Note> findById(int id);
}
```
It says what must be possible but not how. Any class that `implements NoteRepository` must provide both methods.
@@c2 Many classes, one promise
`InMemoryNoteRepository` keeps notes in a list. `DatabaseNoteRepository` stores them in a real database. Both fit the interface, so `NoteService` works with either one, and you can change the choice without touching the service.
@@c3 Fakes make tests easy
In a test, give the service the in-memory version. No database to set up, the test is fast and always the same. This is called a test double. It replaces the outside world, not the rule you are testing.
@@c4 Sealed and abstract: closed families
An abstract class is a half-built class that children complete. A sealed type says "only these children are allowed", like the fixed list `Circle`, `Square`, `Triangle`. Then Java can warn you if you forget to handle one of them.
@@example Same service, two repositories
```java
NoteService test = new NoteService(new InMemoryNoteRepository());
NoteService real = new NoteService(new DatabaseNoteRepository(connection));
```
The service code is identical. In the tests we use the first line. In the real app we use the second.
@@use
1. A `Payment` interface with `CardPayment` and `WalletPayment` classes.
2. A logger interface with a console version and a file version.
3. A test that runs without internet because the email sender is a fake.
@@wrong
Mistakes: creating an interface for every class even when there is only ever one version, making the fake behave differently from the real one so tests prove nothing, and forgetting that an interface cannot fix a class that does not keep the promise properly.
