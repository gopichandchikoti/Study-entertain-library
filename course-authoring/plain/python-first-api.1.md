=== 01
@@picture
Learning Python and building web APIs is like learning to cook and then running a small restaurant. First you learn to chop, boil, and season (the Python basics). Then you learn how a restaurant works: orders come in, the kitchen makes food, and the waiter brings it back (a web API).

You do not need to know everything before you start. In each lesson you learn one small skill, try it right away, and build on it. By the end you will have a real working service.
@@diagram
flowchart LR
    A["Python basics"] --> B["Functions and data"]
    B --> C["Web ideas: HTTP and JSON"]
    C --> D["FastAPI app"]
    D --> E["Database, tests, deploy"]
@@goal
- Know the order of the course and why it goes that way.
- Follow the study loop: read, guess, try, check, review.
- Know what you will have built by the end.
@@words
- **Python**: a friendly programming language with simple, readable code.
- **API**: a menu of things a program can be asked to do.
- **FastAPI**: a Python tool that makes it easy to build web APIs.
- **bug**: a mistake in the code. Everyone makes them!
- **prerequisite**: something to learn first.
@@why
Trying to learn a big framework without the basics feels like reading a recipe in a language you do not know. A good order makes every new step feel small.
@@c1 Small steps beat big jumps
Each lesson adds only a little. Read it, run the example, and change something to see what happens. A small change that breaks the program teaches you more than a page of reading.
@@c2 Guess first
Before running a line of code, say what you think will happen. If you are right, great. If not, you have found the exact idea to learn next.
@@c3 Errors are clues
Python's error messages are friendly and point to the line with the problem. Read them from the bottom, where the final message lives. Most of the time it tells you what to fix.
@@c4 Come back and rebuild
After a few days, try to write an old example again without looking. It feels hard, and that is good, because the effort of remembering is what makes the skill stick.
@@example Your very first guess
What does `print(2 + 3)` show? It shows `5`. What does `print("2" + "3")` show? It shows `23`, because the quote marks make them text, and text is joined side by side. Were you right? Either way you have learned how Python treats numbers and text differently.
@@use
1. A student writes a small script to add up their pocket money.
2. A teacher builds an API that lists homework for each class.
3. A team builds a service that other apps ask for weather data.
@@wrong
The biggest trap is copying code without understanding it. It works today and breaks tomorrow, and you will not know why. Also do not skip the practice. Reading feels like progress, but typing and running is where the learning happens.

=== 02
@@picture
Python was made to be easy to read, almost like plain English. Instead of lots of symbols and curly braces, Python uses spaces to show which lines belong together. Programmers say "Python reads like pseudocode" because it looks like the plan you would write before coding.

For websites, Python had to learn how to talk to the web. Over the years, different "web languages" came along. FastAPI is the newest friendly one: it is fast, and it checks your data for you.
@@diagram
flowchart LR
    A["Python: easy to read"] --> B["WSGI: older web standard"]
    B --> C["ASGI: newer, can wait for many things at once"]
    C --> D["FastAPI: built on ASGI"]
@@goal
- Explain what makes Python popular and what its costs are.
- Say what an interpreter is.
- Explain WSGI, ASGI, and where FastAPI fits.
@@words
- **interpreter**: a program that reads your Python file and does what it says, line by line.
- **dynamic typing**: Python figures out types while running.
- **type hint**: a note that tells readers what type a value should be.
- **WSGI**: an older standard for Python web servers that handles one request at a time per worker.
- **ASGI**: a newer standard that can handle waiting better.
- **framework**: a ready-made skeleton for building apps.
@@why
People were tired of long, hard-to-read code. Python made programming friendlier. As the web grew, newer tools were needed to handle many visitors at once.
@@c1 Python is easy to read
```python
if age >= 10:
    print("big kid")
else:
    print("little kid")
```
No curly braces. The indented lines (moved in by 4 spaces) belong to the line above. Python uses spaces to show structure, so tidy spacing is part of the code.
@@c2 The interpreter runs your file
You do not compile first. You type `python app.py` and the interpreter reads and runs it. This is quick for trying things out. The trade-off: some mistakes only appear when the line actually runs.
@@c3 Type hints help people and tools
`def greet(name: str) -> str:` says "name is text and the answer is text". Python does not force this by itself, but tools and FastAPI use hints to check and to make documentation. That is a big deal for FastAPI.
@@c4 From WSGI to ASGI
Old Python web servers (WSGI) did one job at a time per worker, so one slow request could hold things up. ASGI lets one worker wait for many things at once, like a waiter who takes more orders while the kitchen is cooking. FastAPI is built on ASGI.
@@example The same idea, two styles
In an old framework you might write many lines to read a number from the URL and check it. In FastAPI you write `def get_note(note_id: int):`, and FastAPI sees `int`, reads the number from the URL, checks it, and returns an error if it is not a number. The hint did the work.
@@use
1. A student uses Python for quick scripts to rename lots of files.
2. A data team uses Python to study numbers and make charts.
3. A startup uses FastAPI to build an API that a phone app talks to.
@@wrong
Mistakes: thinking Python is slow for everything (it is fine for most web work, and heavy work can be done in helpers), believing type hints are enforced by Python itself (they are not; tools and FastAPI check them), and mixing tabs and spaces so the indentation breaks.

=== 03
@@picture
A craftsperson keeps tools for each project in a separate toolbox. A bike repair needs a wrench, and a painting needs brushes. If everything is thrown into one big box, the wrong tool is used and things break.

In Python, a **virtual environment** (venv) is a toolbox for one project. Libraries you install go only into that box. Your project A can use version 1 of a tool while project B uses version 2, with no fights.
@@diagram
flowchart LR
    P["Your project folder"] --> V[".venv: private toolbox"]
    V --> I["pip install fastapi uvicorn"]
    I --> R["Run: uvicorn app.main:app"]
@@goal
- Create and use a virtual environment.
- Install packages with pip and record them.
- Lay out a project with tidy folders.
@@words
- **venv**: a private folder of Python tools for one project.
- **pip**: the tool that downloads and installs Python packages.
- **package**: code written by others that you can install.
- **pyproject.toml**: a file that describes your project and its tools.
- **import**: bringing code from another file or package into yours.
- **requirements**: a list of packages and versions your project needs.
@@why
"It works on my computer" is the most famous sentence in programming. A venv and a list of versions make sure it works on every computer the same way.
@@c1 Make your toolbox
In the project folder type:
```text
python -m venv .venv
.venv\Scripts\activate        (Windows)
source .venv/bin/activate     (Mac and Linux)
```
After activating, your terminal shows `(.venv)` and anything you install goes only into this project.
@@c2 Install with pip
`pip install fastapi uvicorn` downloads those packages into the venv. Then `pip freeze > requirements.txt` writes down exact versions. A teammate runs `pip install -r requirements.txt` and gets the same tools.
@@c3 Pin versions
Say exactly which version you tested: `fastapi==0.115.0`. If you write only "fastapi", the next install might get a newer version that behaves differently. Pinned versions mean repeatable results.
@@c4 A tidy project layout
```text
notes-api/
├── app/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   └── repositories/
├── tests/
├── pyproject.toml
└── .gitignore
```
Code lives in `app/`, tests in `tests/`. Add `.venv` to `.gitignore` so you never share the toolbox, just the list of tools.
@@example First setup
You create a folder `notes-api`, run `python -m venv .venv`, activate it, run `pip install fastapi uvicorn`, and write a file `app/main.py`. A friend copies your folder (without .venv), runs the same two commands from `requirements.txt`, and has the same working project.
@@use
1. A student keeps each homework project in its own venv.
2. A team shares `requirements.txt` so everyone runs the same versions.
3. A server installs from a lock file so the live app matches the tested app.
@@wrong
Mistakes: installing everything globally so projects clash, forgetting to activate the venv, committing the `.venv` folder to git, and installing packages without noting their versions. If `pip` installs into the wrong place, check whether your terminal shows `(.venv)`.

=== 04
@@picture
Python variables are labeled boxes, just like a school locker with a name tag. You write `age = 10` and the locker labeled "age" holds 10. Later you can put 11 in it. Python figures out the kind of thing in the box by itself.

The kinds you meet most are numbers, text (called strings), true or false (booleans), and "nothing" (`None`). With `if` and loops you can make choices and repeat.
@@diagram
flowchart TD
    S["Start"] --> Q{"age >= 10?"}
    Q -->|"True"| A["Print: big kid"]
    Q -->|"False"| B["Print: little kid"]
@@goal
- Use numbers, text, booleans, and `None`.
- Write `if`, `for`, and `while`.
- Understand "truthiness" and common beginner surprises.
@@words
- **variable**: a name that points to a value.
- **string**: text inside quotes, like "hello".
- **boolean**: either `True` or `False`.
- **None**: Python's way of saying "nothing here".
- **condition**: a question with a yes or no answer.
- **loop**: repeating steps.
@@why
Everything in a program is built from these simple parts: values, decisions, and repeats. Once they feel natural, harder topics are much easier.
@@c1 Values and names
```python
name = "Ava"        # str: text
age = 10            # int: whole number
height = 1.35       # float: decimal number
is_student = True   # bool
nothing = None      # no value
```
Names use lowercase and underscores. You can print any of them with `print(name)`.
@@c2 Make decisions with if
```python
if age >= 10:
    print("big kid")
elif age >= 5:
    print("kid")
else:
    print("little kid")
```
Python checks each condition from the top and runs the first one that is true. Indentation (4 spaces) decides which lines belong to which branch.
@@c3 Repeat with loops
```python
for number in range(1, 4):
    print(number)       # 1, 2, 3
```
`range(1, 4)` goes from 1 up to, but not including, 4. A `while` loop repeats as long as its condition is true: make sure something changes so it can stop.
@@c4 Truthy and falsy
In an `if`, Python treats some things as false: `0`, `""` (empty text), `[]` (empty list), and `None`. Everything else counts as true. So `if name:` is true when the name is not empty. It is handy, but be careful: `0` is a real number, and `if count:` is false for zero!
@@example A tiny calculator
```python
total = 0
for price in [3, 4, 5]:
    total = total + price
print("Total:", total)    # Total: 12
```
We start at 0, add each price, and print the sum. You can follow the value of `total` through each turn: 3, 7, 12.
@@use
1. A script that checks if a number is even or odd.
2. A program that adds up all prices in a list.
3. An API that checks if a title is empty before saving a note.
@@wrong
Mistakes: mixing up `=` (put a value in a box) with `==` (ask if two things are equal), forgetting the colon at the end of `if` or `for` lines, wrong indentation, and treating an empty string like `None`. They are different things.

=== 05
@@picture
A function is a small machine. You put something in the input tray, it works inside, and something comes out of the output tray. For example, a machine named `add` takes two numbers and gives back their sum. Once you build the machine, you can use it over and over without rebuilding it.

Functions keep programs tidy. Instead of one huge list of steps, you have many small machines with clear names.
@@diagram
flowchart LR
    I["Input: 2 and 3"] --> F["add(a, b)"]
    F --> O["Output: 5"]
@@goal
- Write functions with parameters, defaults, and return values.
- Understand local scope and what a closure is.
- Keep functions small and easy to test.
@@words
- **function**: a named group of steps.
- **parameter**: a name for an input a function receives.
- **argument**: the actual value you give when calling.
- **return**: hands an answer back to the caller.
- **scope**: where a name can be seen.
- **pure function**: gives the same answer for the same input and changes nothing outside.
@@why
If you copy the same steps in ten places, a fix needs ten changes. If they live in one function, one change fixes everything.
@@c1 Defining and calling
```python
def add(a, b):
    return a + b

print(add(2, 3))    # 5
```
`def` starts the function. `a` and `b` are parameters. `return` sends the answer back. Without `return`, a function gives back `None`.
@@c2 Defaults and keyword arguments
```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Ava")                      # Hello, Ava!
greet("Ava", greeting="Hi")       # Hi, Ava!
```
A default makes a parameter optional. Naming arguments (`greeting="Hi"`) makes calls easy to read. FastAPI uses this idea a lot for query parameters.
@@c3 Scope: names have a home
A variable made inside a function lives only there, like a note on a desk inside a room. Outside, nobody sees it. A function can read things from outside, but changing outside things is a bad habit. Prefer to take inputs and return outputs.
@@c4 Never use a changeable default
Writing `def add_tag(tag, tags=[])` is a famous trap: the same list is shared by every call! Use `None` as the default and make a new list inside: `if tags is None: tags = []`. Small, pure functions are easy to test and trust.
@@example Clean a title
```python
def clean_title(text):
    title = text.strip()
    if not title:
        raise ValueError("Title cannot be empty")
    return title

print(clean_title("  Math  "))     # Math
```
Many routes can now use `clean_title`, and the rule lives in exactly one place.
@@use
1. A function that converts temperatures from Celsius to Fahrenheit.
2. A `clean_title` used by every route that saves a note.
3. A small function tested on its own without starting a web server.
@@wrong
Mistakes: forgetting `return` and getting `None`, using a list as a default value, changing global variables from inside a function, and writing one huge function that does ten jobs. If you struggle to name a function, it probably does too much.

=== 06
@@picture
Python gives you four main shelves. A **list** is a row of things in order, like a line of kids. A **tuple** is a list that is locked: it cannot be changed. A **set** is a bag where nothing appears twice. A **dict** (dictionary) is a lookup: you give a word, you get its meaning.

Picking the right shelf makes code shorter and faster, and says clearly what you mean.
@@diagram
flowchart LR
    L["list: [1, 2, 2]"]
    T["tuple: (1, 2)"]
    S["set: {1, 2}"]
    D["dict: {name: Ava}"]
@@goal
- Use lists, tuples, sets, and dictionaries.
- Write a list comprehension.
- Sort and choose the right structure for the job.
@@words
- **list**: ordered items you can change.
- **tuple**: ordered items you cannot change.
- **set**: unique items with no order.
- **dict**: keys connected to values.
- **comprehension**: a short way to build a list in one line.
- **iterator**: something you can go through one item at a time.
@@why
Real programs hold many things: a list of notes, a set of tags, a dictionary from id to note. Choosing well keeps code clear and quick.
@@c1 List: ordered and changeable
```python
names = ["Ava", "Ben"]
names.append("Cy")
print(names[0])        # Ava (counting starts at 0)
```
Use a list when order matters and when items can change. The same value may appear twice.
@@c2 Dict: look up by key
```python
note = {"id": 1, "title": "Math"}
print(note["title"])       # Math
note["pinned"] = True      # add a new key
```
Dictionaries are everywhere in Python and in JSON, the format most APIs use. `note.get("tags", [])` is a safe way to read a key that might be missing.
@@c3 Set and tuple
`{1, 2, 2}` becomes `{1, 2}`. Sets are great for removing duplicates and for asking "is this in here?" very quickly. A tuple `(3, 4)` is a fixed pair, like a coordinate that should not change.
@@c4 Comprehensions
```python
squares = [n * n for n in range(1, 6)]            # [1, 4, 9, 16, 25]
long_names = [n for n in names if len(n) > 2]
```
Read it as: "make a new list of n times n, for each n in the range". It is a short way to say "loop and collect". Use it for simple jobs. If it gets long, use a normal loop.
@@example Count tags
```python
tags = ["python", "api", "python"]
counts = {}
for tag in tags:
    counts[tag] = counts.get(tag, 0) + 1
print(counts)       # {'python': 2, 'api': 1}
```
A dictionary remembers one number for each tag. `get(tag, 0)` means "the current count, or 0 if we have not seen it".
@@use
1. A list of homework tasks in order.
2. A set of student ids that have handed in the work.
3. A dictionary from product code to price.
@@wrong
Mistakes: using a list and searching it again and again when a dict would be instant, changing a list while looping over it, expecting a set to keep order, and writing a comprehension so long that nobody can read it.

=== 07
@@picture
A big program in one file is like one giant drawer with everything thrown in. A better way: many small files (called **modules**), grouped in folders (called **packages**), each with one job. When you need something, you `import` it, like fetching a tool from a labeled drawer.

You can also use packages written by other people, like FastAPI. That is a superpower. But each outside package is something you trust, so choose with care.
@@diagram
flowchart LR
    A["app/main.py"] -->|"import"| B["app/services/notes.py"]
    B -->|"import"| C["app/repositories/notes.py"]
    A -->|"import"| D["fastapi package"]
@@goal
- Import from your own files and from packages.
- Organize a project into modules and packages.
- Pin dependencies and think about trust.
@@words
- **module**: one Python file that holds code.
- **package**: a folder of modules, with `__init__.py`.
- **import**: use code from another module.
- **dependency**: a package your project needs.
- **lock file**: a record of exact versions installed.
- **circular import**: A imports B and B imports A.
@@why
Without modules, one file grows to thousands of lines and nobody can find anything. With modules, each file is small and has one clear job.
@@c1 Import what you need
```python
from app.services.notes import create_note
import json
```
The first line takes `create_note` from `app/services/notes.py`. The second brings the whole standard `json` module. Use clear names so readers know where things come from.
@@c2 Packages are folders
A folder with an `__init__.py` file is a package. It lets you write `app.services.notes`. In modern Python the file is even optional, but keeping it makes the intention clear.
@@c3 Pin dependencies and be careful
Record exact versions in `requirements.txt` or `pyproject.toml`. A new version can change behavior. Also, each package runs code on your machine, so install only well-known ones and check the name carefully, because attackers publish packages with names almost the same as popular ones.
@@c4 Avoid circles
If `a.py` imports `b.py` and `b.py` imports `a.py`, Python may stop with an import error. The fix is to rethink the design so the arrows go one way, like route to service to repository.
@@example Splitting a file
`main.py` has 500 lines. You move note rules to `services/notes.py` and database code to `repositories/notes.py`. Now `main.py` has 40 lines and each file has one job. A bug in the rules? Open `services/notes.py` and nothing else.
@@use
1. A project with `routes`, `services`, and `repositories` folders.
2. A team shares a `pyproject.toml` so everyone installs the same packages.
3. A script imports `json` and `pathlib` from the standard library without installing anything.
@@wrong
Mistakes: `from module import *` (you cannot tell where names come from), circular imports, unpinned dependencies, and installing a package just because a blog post mentioned it. Add a package only when you can say why you need it.

=== 08
@@picture
Things go wrong in real life: a file is missing, a number is typed as a word, the internet drops. A careful program expects this. When something goes wrong, Python **raises an exception**, like a flag in a game. If nobody catches the flag, the program stops with a message.

Your job is to catch the flags you can handle, clean up after yourself, and send a friendly message when something really went wrong.
@@diagram
flowchart TD
    T["try: do the risky thing"] --> OK{"Worked?"}
    OK -->|"Yes"| D["Continue"]
    OK -->|"No"| E["except: handle the problem"]
    D --> F["finally: always clean up"]
    E --> F
@@goal
- Use `try`, `except`, `finally`, and `raise`.
- Use `with` to open and close things safely.
- Turn Python errors into safe web errors.
@@words
- **exception**: an object that says something went wrong.
- **raise**: start an exception on purpose.
- **try/except**: attempt something and handle a failure.
- **finally**: code that always runs.
- **context manager**: something that sets up and cleans up, used with `with`.
- **traceback**: the list of calls that led to an error.
@@why
Without error handling, one unexpected input crashes your whole server. With it, you can say "that note does not exist" and carry on.
@@c1 try and except
```python
try:
    number = int("abc")
except ValueError:
    print("Please type a number")
```
`int("abc")` fails with `ValueError`. The `except` line catches that exact kind of failure. Name the specific error, not just a general `except:`, so you do not hide other problems.
@@c2 with cleans up for you
```python
with open("notes.txt", encoding="utf-8") as file:
    text = file.read()
```
When the `with` block ends, the file closes, even if an error happened inside. It is like a door that closes itself behind you. Database connections and locks also use `with`.
@@c3 Raise your own errors
```python
def find_note(note_id):
    if note_id not in notes:
        raise NoteNotFound(note_id)
    return notes[note_id]
```
`NoteNotFound` is your own exception class. It says clearly what went wrong. Keep the original error as the cause with `raise NewError() from original`, so no clue is lost.
@@c4 Safe messages for web users
In FastAPI, turn your exceptions into proper replies: not found becomes 404, bad input becomes 400 or 422. Never send raw errors, file paths, or SQL to the user. Log the full details privately, and send a short message with a request ID.
@@example Turn an error into a 404
```python
from fastapi import HTTPException

@app.get("/notes/{note_id}")
def get_note(note_id: int):
    try:
        return service.find(note_id)
    except NoteNotFound:
        raise HTTPException(status_code=404, detail="Note not found")
```
The visitor sees a neat "Note not found". Your logs can hold the full story.
@@use
1. A script that reads a file and says "file not found" in friendly words.
2. An API that returns 404 for an unknown id and 422 for bad input.
3. A function that always closes the database connection using `with`.
@@wrong
Mistakes: an empty `except:` that hides every problem, forgetting to close files (use `with`), showing raw error text to users, and catching an error then pretending everything worked. Never let a failure turn into a fake success.
