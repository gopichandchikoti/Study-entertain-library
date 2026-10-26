=== 04a
@@meta
{
  "file": "04a-reading-python-errors-and-tracebacks.md",
  "after": "04-values-types-and-control-flow.md",
  "scope": "Teach how to read a Python traceback from the bottom, tell common error types apart, and follow a calm method for debugging with print and the debugger.",
  "reason": "Every Python programmer sees errors all the time. Reading a traceback calmly turns a long scary message into a map that points straight to the problem.",
  "terms": {"traceback": "the list of calls that led to an error, shown when a program crashes", "syntaxError": "a mistake in how the code is written, found before the line runs", "typeError": "using a value in a way its type does not allow", "debugging": "finding and fixing the cause of a bug"},
  "facts": ["A traceback is read from the bottom, where the final error type and message are shown.", "SyntaxError means the code is not written correctly, for example a missing colon.", "TypeError means a value of the wrong type was used, such as adding text to a number.", "A NameError means a name is used before it was given a value or is spelled wrongly.", "Change one thing at a time when fixing a bug, and run the program again after each change."],
  "scenario": "Your script crashes with a long traceback. Where should you look first?",
  "choices": ["At the last line for the error type and message, then at the nearest line from your own file", "At the first line only", "Delete the whole file", "Ignore it and run the script again"],
  "expected": "read-traceback-bottom",
  "diagrams": ["python-reading-a-traceback.svg"]
}
@@picture
When your bike makes a strange noise, a good mechanic does not panic. They listen, find where the noise comes from, and fix that one part. A Python error message is the bike's strange noise, and the traceback is the way to find where it comes from.

The big secret is that **you read a traceback from the bottom up**. The very last line tells you what went wrong. The lines above show the path the program walked before it fell.
@@diagram
flowchart TD
    A["Program crashes"] --> B["Read the LAST line: error type and message"]
    B --> C["Look at the nearest line from YOUR file"]
    C --> D["Guess the cause"]
    D --> E["Change one thing and run again"]
@@goal
- Read a traceback from the bottom.
- Recognize SyntaxError, NameError, TypeError, ValueError, and KeyError.
- Debug with print statements and a calm four-step method.
@@words
- **traceback**: the list of calls shown when a program crashes.
- **SyntaxError**: the code is written wrongly.
- **NameError**: a name was used that does not exist.
- **TypeError**: a value of the wrong type was used.
- **KeyError**: a dictionary key is missing.
- **debugger**: a tool to pause the program and look inside.
@@why
Beginners often feel stuck when they see red text. Programmers who read it carefully fix most bugs in minutes, and learn something each time.
@@c1 Read the last line first
```text
Traceback (most recent call last):
  File "app.py", line 5, in <module>
    print(total + "dollars")
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```
The last line says: you tried to add a number (`int`) and text (`str`). The line above it says where: `app.py`, line 5.
@@c2 Common errors in plain words
`SyntaxError`: the code is not written properly, like a missing `:`. `NameError`: you used a name that does not exist (maybe a typo). `TypeError`: wrong type, like `"a" + 1`. `ValueError`: right type, wrong value, like `int("abc")`. `KeyError`: that key is not in the dictionary. `IndexError`: that position is not in the list.
@@c3 Follow the path
The lines above the last one show each function that was running, from the oldest at the top to the newest at the bottom. Look for the line from your own file. Lines inside libraries are rarely the real cause. The mistake is almost always in how your code used them.
@@c4 A calm debugging method
1) Read the last line. 2) Open the file and line it names. 3) Add `print(variable)` just before to see what the values really are, or use the debugger with `breakpoint()`. 4) Change one thing and run again. If you change many things at once, you will never know which one fixed it.
@@example Fix the sum
`total + "dollars"` fails because `total` is a number. Two fixes: `str(total) + " dollars"` or better, `f"{total} dollars"`. Run again: it prints `12 dollars`. The error is gone, and you learned a rule: numbers and text need to be converted before joining.
@@use
1. A student fixes a missing colon after reading `SyntaxError`.
2. A developer uses `print(note)` to see why a value is `None`.
3. A team adds request ids to errors so they can find the right traceback in the logs.
@@wrong
Mistakes: reading from the top and getting lost, ignoring the message, changing five things at once, and hiding errors with an empty `except:`. Hiding an error does not remove it. It just removes the clue.

=== 04b
@@meta
{
  "file": "04b-text-strings-and-f-strings.md",
  "after": "04a-reading-python-errors-and-tracebacks.md",
  "scope": "Teach strings, quotes, indexing and slicing, common methods like strip and split, f-strings for formatting, and joining text.",
  "reason": "Almost every program works with text: names, titles, messages, and JSON. Knowing the few most useful string tools makes everyday code short and clear.",
  "terms": {"string": "a piece of text inside quotes", "fString": "a string that starts with f and puts values inside curly braces", "slice": "a piece of a string or list taken with a start and end", "method": "an action a value can do, written after a dot"},
  "facts": ["Strings in Python cannot be changed; methods return a new string.", "An f-string puts values into text using curly braces, like f'Hello {name}'.", "strip removes spaces from both ends, and split breaks a string into a list.", "Counting starts at 0, so text[0] is the first character.", "The join method glues a list of strings together using a separator."],
  "scenario": "A user types '  Math  ' as a title. How do you clean it before saving?",
  "choices": ["Call strip() to remove the extra spaces", "Save it exactly as typed", "Multiply it by two", "Convert it to a number"],
  "expected": "strip-the-title",
  "diagrams": ["python-strings-and-f-strings.svg"]
}
@@picture
A string is a necklace of letters. Each bead (character) sits in a numbered place, starting at zero. You can look at one bead, take a piece of the necklace, or make a new necklace by joining pieces. But you cannot paint a bead on the old necklace. Python strings never change. Every action gives you a new one.

The handiest trick is the **f-string**: you write text with blank spaces in curly braces, and Python fills them in.
@@diagram
flowchart LR
    A["name = Ava"] --> C["f-string: Hello, {name}!"]
    B["age = 10"] --> C
    C --> D["Hello, Ava!"]
@@goal
- Create strings with single, double, and triple quotes.
- Use indexing, slicing, and methods like `strip`, `lower`, `split`, and `join`.
- Format text with f-strings.
@@words
- **string**: text in quotes.
- **index**: the number of a character, starting at 0.
- **slice**: a piece taken with `[start:end]`.
- **method**: an action written after a dot, like `.upper()`.
- **f-string**: a string starting with `f` that fills in `{values}`.
- **immutable**: cannot be changed after it is made.
@@why
Text is everywhere: titles, names, messages, URLs, JSON. Cleaning and shaping text is one of the most common jobs a program does.
@@c1 Make strings
```python
a = "double quotes"
b = 'single quotes'
c = """a long text
that has many lines"""
```
Both single and double quotes work. Use triple quotes for many lines. Use a backslash for special characters, like `\n` for a new line.
@@c2 Indexing and slicing
```python
word = "python"
word[0]      # 'p'
word[-1]     # 'n' (the last)
word[0:3]    # 'pyt' (from 0 up to, not including, 3)
len(word)    # 6
```
Negative numbers count from the end. A slice stops just before its end number.
@@c3 Useful methods
```python
"  Math  ".strip()          # 'Math'
"Hello".lower()             # 'hello'
"a,b,c".split(",")          # ['a', 'b', 'c']
"-".join(["a", "b", "c"])   # 'a-b-c'
"hello".replace("l", "L")   # 'heLLo'
```
Each one returns a *new* string. The original does not change. That is why you must save the result: `title = title.strip()`.
@@c4 f-strings fill in blanks
```python
name = "Ava"
points = 12.5
print(f"{name} scored {points:.1f} points")   # Ava scored 12.5 points
print(f"Total: {2 + 3}")                      # Total: 5
```
Anything in `{ }` is calculated and inserted. `:.1f` means "one digit after the decimal point". It is much easier than gluing strings with `+`.
@@example Clean and shout
```python
title = "  intro to python  "
clean = title.strip().title()
print(f"New note: {clean}")     # New note: Intro To Python
```
We chain the methods: remove spaces, capitalize each word, and then put the result in a message.
@@use
1. A form trims spaces from every title before saving.
2. A program splits "a,b,c" from a file into a list.
3. A greeting uses an f-string to say hello to each user by name.
@@wrong
Mistakes: calling `title.strip()` and forgetting to save the result, joining a number and text with `+` (use an f-string), forgetting that slices stop before the end number, and building SQL with an f-string (never do that: use `?` slots).

=== 06a
@@meta
{
  "file": "06a-classes-and-objects-in-python.md",
  "after": "06-collections-comprehensions-and-datastructures.md",
  "scope": "Teach classes, objects, __init__, self, methods, attributes, and simple inheritance in Python with a small notes example, and when a dataclass or plain function is enough.",
  "reason": "FastAPI, Pydantic, and many libraries are built from classes. Understanding what a class, an object, and self mean makes their code readable instead of mysterious.",
  "terms": {"classDefinition": "a blueprint that describes what an object knows and can do", "instance": "one real object built from a class", "selfParameter": "the first parameter of a method, which means this object", "attribute": "a variable that belongs to an object"},
  "facts": ["A class is a blueprint, and an object is one thing built from it.", "The __init__ method runs when a new object is created and sets up its attributes.", "The first parameter of a method is called self and refers to the object itself.", "Each object keeps its own copy of its attributes.", "A dataclass is a shorter way to write a class that mostly holds data."],
  "scenario": "You need a small class that just holds an id, a title, and a pinned flag. What is the simplest choice?",
  "choices": ["A dataclass with three fields", "A giant class with many unrelated methods", "Three separate global variables", "A class with no attributes"],
  "expected": "use-dataclass",
  "diagrams": ["python-classes-and-objects.svg"]
}
@@picture
A class is a cookie cutter. An object is one cookie. You can make many cookies with one cutter, and each cookie can have its own sprinkles. The cutter says "every cookie has a shape and can be eaten". Each cookie has its own particular decorations.

In Python, you write the cutter with the word `class`. You make cookies by calling the class like a function: `Note("Math")`.
@@diagram
flowchart LR
    C["class Note: the cutter"] --> A["note1 = Note Math"]
    C --> B["note2 = Note Science"]
    A --> T["title: Math"]
    B --> U["title: Science"]
@@goal
- Write a class with `__init__` and methods.
- Explain `self` in plain words.
- Choose between a class, a dataclass, and a plain function.
@@words
- **class**: a blueprint for objects.
- **object / instance**: one real thing made from a class.
- **attribute**: a variable that belongs to an object.
- **method**: a function that belongs to a class.
- **self**: the object that a method is working on.
- **inheritance**: a child class that gets what its parent has.
@@why
Classes group data and the actions on that data in one place. The libraries you use in this course, like FastAPI and Pydantic, ask you to write classes, so you need to read them with ease.
@@c1 A first class
```python
class Note:
    def __init__(self, title):
        self.title = title

    def shout(self):
        return self.title.upper()

n = Note("math")
print(n.title)     # math
print(n.shout())   # MATH
```
`__init__` runs when you write `Note("math")`. It sets up the object's attributes. Methods are functions inside the class.
@@c2 What is self?
`self` is the object itself. When you call `n.shout()`, Python quietly passes `n` as `self`. So inside the method, `self.title` means "this note's title". Another note has its own `self` and its own title.
@@c3 Each object has its own data
```python
a = Note("Math")
b = Note("Science")
a.title = "Algebra"
print(b.title)     # Science (not changed)
```
Changing one object does not change the other, just as decorating one cookie does not decorate the others.
@@c4 Inheritance and when to use classes
```python
class Pinned(Note):
    def shout(self):
        return "PINNED: " + super().shout()
```
A child class gets everything from its parent and can replace parts. But do not use classes everywhere. For data only, use a `@dataclass` or a Pydantic model. For one job, a plain function is simpler. Use a class when data and actions belong together.
@@example Protect a rule
```python
class Note:
    def __init__(self, title):
        if not title.strip():
            raise ValueError("Title cannot be empty")
        self.title = title.strip()
```
Now it is impossible to build a `Note` with an empty title, because the check runs every time an object is created.
@@use
1. A `BankAccount` class that refuses to go below zero.
2. A Pydantic `NoteIn` model, which is a class that checks data.
3. A `Student` class that keeps a name and a list of grades.
@@wrong
Mistakes: forgetting `self` as the first parameter, forgetting `self.` before attribute names inside methods, sharing a list between all objects by writing it at the class level, and building a giant class that does too many jobs.

=== 08a
@@meta
{
  "file": "08a-decorators-and-generators-explained.md",
  "after": "08-exceptions-context-managers-and-errors.md",
  "scope": "Explain decorators as wrappers that add behavior to a function, with the @app.get label as the main example, and generators with yield that produce values one at a time, including FastAPI dependencies that use yield.",
  "reason": "The @app.get label and the yield used in FastAPI dependencies look like magic until you see the simple idea underneath. Understanding them makes FastAPI code easy to read.",
  "terms": {"decorator": "a label above a function that wraps it and adds behavior", "generator": "a function that gives back values one at a time using yield", "yieldKeyword": "pauses a function, hands back a value, and remembers where it stopped", "wrapper": "a function that goes around another function"},
  "facts": ["A decorator is a function that takes a function and returns a new one with extra behavior.", "The line @app.get('/health') registers the function below it as the handler for that path.", "A generator produces values one at a time and uses little memory.", "The yield keyword pauses the function and remembers where it stopped.", "In FastAPI, a dependency that uses yield sets something up, gives it to the route, and then cleans up afterwards."],
  "scenario": "You want a database session opened for each request and always closed afterwards, even after an error. What fits best?",
  "choices": ["A dependency that uses yield and closes the session after it", "Open a global session once and never close it", "Open the session inside every route by hand without closing", "Skip the session"],
  "expected": "yield-dependency",
  "diagrams": ["python-decorators-and-generators.svg"]
}
@@picture
Imagine you give a gift to a friend. You can wrap it in pretty paper. The gift inside is the same, but now it has a ribbon. A **decorator** is wrapping paper for a function: it goes around the function and adds something, like a log message or a registration, without changing the function inside.

A **generator** is a vending machine that gives you one snack at a time instead of dumping all snacks at once. The magic word is `yield`: "here is one; I will remember where I stopped".
@@diagram
flowchart LR
    F["Your function"] --> W["Decorator wraps it"]
    W --> R["Same function, with extra behavior"]
    G["Generator: yield 1"] --> H["yield 2"] --> I["yield 3"]
@@goal
- Explain what `@something` above a function does.
- Write a tiny decorator.
- Explain `yield` and how FastAPI uses it for cleanup.
@@words
- **decorator**: a function that wraps another function.
- **wrapper**: the new function that surrounds the old one.
- **generator**: a function that produces values one at a time.
- **yield**: give back one value and pause.
- **iterator**: something you can loop over one item at a time.
- **dependency with yield**: setup, then give, then cleanup.
@@why
Two things in FastAPI look strange to beginners: the `@app.get(...)` lines and the `yield` in database dependencies. Once you know these two ideas, nothing in FastAPI is a mystery.
@@c1 A decorator is a wrapper
```python
def loud(func):
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@loud
def add(a, b):
    return a + b

add(2, 3)     # prints "calling add", returns 5
```
`@loud` above `add` means `add = loud(add)`. We get a new `add` that prints first, then does the real work.
@@c2 @app.get is a decorator too
`@app.get("/health")` takes your function and *registers* it: "when GET /health arrives, call this". The function itself is unchanged; FastAPI just remembers it. Decorators are a neat way to attach extra meaning to a function.
@@c3 Generators give one at a time
```python
def count_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

for number in count_to(3):
    print(number)     # 1, 2, 3
```
Each time the loop asks for the next value, the function runs until `yield`, hands back the value, and freezes. Next time, it continues right after the `yield`. It never builds the full list, so it saves memory.
@@c4 yield in FastAPI dependencies
```python
def get_session():
    session = open_session()
    try:
        yield session          # give it to the route
    finally:
        session.close()        # always runs afterwards
```
The route gets `session`, uses it, and when the request ends, FastAPI resumes the function after `yield`, and the `finally` block closes the session. This pattern is perfect for database sessions and any resource that needs cleanup.
@@example Timing a function
```python
import time
def timed(func):
    def wrapper(*a, **k):
        start = time.time()
        result = func(*a, **k)
        print(f"{func.__name__} took {time.time() - start:.3f}s")
        return result
    return wrapper
```
Put `@timed` above any function, and it prints how long that function took, without editing the function itself.
@@use
1. A `@login_required` decorator that checks the user before running a route.
2. A generator that reads a huge file one line at a time.
3. A FastAPI dependency that opens and closes a database session.
@@wrong
Mistakes: forgetting to `return` the result inside a wrapper (the function then returns nothing), forgetting `finally` so cleanup is skipped after an error, and thinking a generator is a list (you can only loop through it once). Convert with `list(...)` if you need a list.

=== 11a
@@meta
{
  "file": "11a-calling-another-api-with-httpx.md",
  "after": "11-http-urls-headers-and-json-contracts.md",
  "scope": "Teach how a Python program acts as a client: sending GET and POST requests with httpx, reading status codes and JSON, setting timeouts, handling errors, and not leaking secrets.",
  "reason": "Real programs call other services all the time, such as weather, payments, and maps. Doing it safely with time limits and error checks keeps your own app from freezing or breaking.",
  "terms": {"httpxClient": "a tool for sending web requests from Python", "timeout": "the longest time to wait for a reply", "statusCheck": "looking at the status code before trusting the answer", "apiKey": "a secret code that proves your app may use another service"},
  "facts": ["httpx can send GET and POST requests and read the reply as JSON.", "Always set a timeout so a slow service cannot freeze your app.", "Check the status code, because a reply can arrive and still be an error.", "Keep API keys in environment variables, never in the code or in logs.", "Retry only calls that are safe to repeat, and wait a little longer each time."],
  "scenario": "A weather service sometimes takes a very long time to answer. What should your code do?",
  "choices": ["Set a timeout and show a clear fallback message if it passes", "Wait forever", "Retry instantly in an endless loop", "Invent a weather answer"],
  "expected": "set-timeout",
  "diagrams": ["python-calling-another-api.svg"]
}
@@picture
Until now our API was the restaurant kitchen: others asked it for food. Now our program is the one that orders from another kitchen. Maybe it wants the weather, a map, or a payment. Our program becomes the **client**.

In Python, a friendly tool called `httpx` sends the request and brings back the answer. But the other kitchen can be slow, closed, or give a strange answer, so we protect ourselves with time limits and checks.
@@diagram
flowchart LR
    A["Your app"] -->|"GET with timeout"| B["Other service"]
    B -->|"Status and JSON"| C{"Status OK?"}
    C -->|"Yes"| D["Use the data"]
    C -->|"No"| E["Safe fallback message"]
@@goal
- Send a GET and POST request with `httpx`.
- Read the status code and JSON reply.
- Use timeouts, error handling, and keep API keys secret.
@@words
- **client**: the program that sends the request.
- **httpx**: a Python library for sending web requests.
- **timeout**: the longest time we will wait.
- **status code**: the number in the reply that says how it went.
- **API key**: a secret code for using someone else's service.
- **fallback**: a safe plan when the call fails.
@@why
Almost every app uses other services. If you call them carelessly, one slow service can freeze your whole app, and one mistake with a key can cost money or leak data.
@@c1 A simple GET
```python
import httpx

response = httpx.get("https://api.example.com/weather", params={"city": "Paris"}, timeout=5.0)
response.raise_for_status()
data = response.json()
print(data["temperature"])
```
`params` adds `?city=Paris` to the address. `.json()` turns the reply into a dictionary. `raise_for_status()` raises an error if the status is 400 or higher.
@@c2 Always set a timeout
Without `timeout`, a slow service can make your code wait for a very long time, and your own visitors wait with it. Five seconds is a common limit. When it passes, httpx raises `httpx.TimeoutException`, and you can answer, "weather not available right now".
@@c3 POST with JSON and a secret key
```python
import os
key = os.environ["WEATHER_API_KEY"]
r = httpx.post("https://api.example.com/notes",
               json={"title": "Math"},
               headers={"Authorization": f"Bearer {key}"},
               timeout=5.0)
```
The key comes from an environment variable. It is never typed into the code, never printed, and never put into a log.
@@c4 Handle failures kindly
```python
try:
    ...
except httpx.TimeoutException:
    return {"weather": "unavailable"}
except httpx.HTTPStatusError as err:
    log.warning("provider error %s", err.response.status_code)
    return {"weather": "unavailable"}
```
Catch the specific errors, log the facts (without secrets), and return a friendly fallback. Retry only calls that are safe to repeat, wait longer each time, and stop after a few tries.
@@example A weather route that never freezes
```python
@app.get("/weather/{city}")
def weather(city: str):
    try:
        r = httpx.get(PROVIDER, params={"city": city}, timeout=3.0)
        r.raise_for_status()
        return {"temperature": r.json()["temp"]}
    except (httpx.TimeoutException, httpx.HTTPStatusError):
        raise HTTPException(status_code=503, detail="Weather is not available right now")
```
If the provider is slow or broken, our visitors wait 3 seconds at most and get a clear message.
@@use
1. A shop calls a payment service to charge a card.
2. A news app fetches headlines from another API.
3. A school dashboard reads the weather for a trip.
@@wrong
Mistakes: no timeout, trusting the reply without checking the status, printing API keys, retrying actions that are not safe to repeat (like charging a card), and letting the visitor see the other service's raw error text. Also, if a visitor can give you a web address to fetch, check it carefully, so your server is not tricked into visiting private places.
