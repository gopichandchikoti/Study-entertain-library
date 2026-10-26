=== 09
@@picture
Imagine labeling every box in your closet: "winter clothes", "toys", "books". Anyone, including future you, can see what is inside without opening it. Type hints are labels like that for your code: `name: str` says "this should be text".

Python does not force the labels, but helpers like your editor and FastAPI read them. And dataclasses are a quick way to make a "data card" class, with almost no code.
@@diagram
flowchart LR
    A["name: str"] --> B["Editor warns about mistakes"]
    A --> C["FastAPI checks incoming data"]
    D["@dataclass Note"] --> E["Auto init, repr, compare"]
@@goal
- Write type hints for parameters and return values.
- Use `Optional`, unions, and generics in plain forms.
- Write a dataclass and know where Pydantic fits.
@@words
- **type hint**: a label for the type a value should have.
- **union**: "this or that", written `int | str`.
- **Optional**: "a value or None", written `str | None`.
- **dataclass**: a short way to define a class that holds data.
- **protocol**: a description of what methods an object must have.
- **runtime validation**: checking real data while the program runs.
@@why
As programs grow, you forget what each function expects. Hints answer that question in the code itself, and tools can spot mistakes before you even run.
@@c1 Hints for functions
```python
def total(prices: list[float], tax: float = 0.0) -> float:
    return sum(prices) * (1 + tax)
```
Parameters have `: type` and the answer has `-> type`. Hints are for people and tools. Python itself does not stop you if you break them.
@@c2 Maybe-values
`title: str | None` means "text or nothing". When a value can be `None`, you must check before using it. Hints make that visible. Older code writes `Optional[str]`, which means the same.
@@c3 Dataclasses: data cards
```python
from dataclasses import dataclass

@dataclass
class Note:
    id: int
    title: str
    pinned: bool = False
```
You get `__init__`, a readable printout, and `==` comparison for free. `Note(1, "Math")` just works. Add `frozen=True` to make it unchangeable.
@@c4 Hints are not checks
Hints do not check the data that arrives from the outside, such as JSON from a client. For that you need runtime validation, which is exactly what Pydantic does in FastAPI (next lessons). Remember: hints help the programmer; Pydantic helps the program.
@@example A safe pair
```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(3, 4)
print(p)          # Point(x=3, y=4)
print(p == Point(3, 4))   # True
```
Two points with the same numbers are equal, and since it is frozen you cannot change `p.x` by accident.
@@use
1. A function that says in its hints that it needs a list of numbers.
2. A `Note` dataclass shared by the service and the tests.
3. FastAPI reading the hints on a route to check the incoming data.
@@wrong
Mistakes: thinking hints are enforced at runtime, forgetting to handle `None` after writing `| None`, using a changeable default in a dataclass (use `field(default_factory=list)` instead), and confusing dataclasses with Pydantic models: they look alike but do different jobs.

=== 10
@@picture
Programs often need to read and save files, read settings, and talk in JSON, which is the common text format of the web. JSON looks like a Python dictionary: `{"title": "Math", "pinned": true}`.

Files can be risky. A visitor might try to ask for `../secret.txt` to climb out of the allowed folder. So we use careful tools: `pathlib` for paths, `json` for JSON, and environment variables for secrets.
@@diagram
flowchart LR
    A["Name from the user"] --> B["Join with a safe root folder"]
    B --> C{"Still inside the root?"}
    C -->|"Yes"| D["Read the file"]
    C -->|"No"| E["Reject"]
@@goal
- Read and write files with `pathlib` and `with`.
- Read and write JSON.
- Use environment variables for settings and secrets.
@@words
- **path**: the address of a file.
- **pathlib**: Python's tidy tool for working with paths.
- **JSON**: a text format for data, like `{"a": 1}`.
- **encoding**: how text becomes bytes; use UTF-8.
- **environment variable**: a setting given to the program from outside.
- **secret**: a password or key that must not be shared.
@@why
Real apps save data and need settings that change between your laptop and the real server. Doing this safely stops leaks and break-ins.
@@c1 Files with pathlib
```python
from pathlib import Path

path = Path("notes") / "math.txt"
text = path.read_text(encoding="utf-8")
path.write_text("New text", encoding="utf-8")
```
The `/` joins path pieces on any computer. Always give the encoding so special letters work.
@@c2 Stay inside the fence
```python
root = Path("notes").resolve()
target = (root / name).resolve()
if root not in target.parents:
    raise ValueError("Not allowed")
```
`resolve()` cleans up `..` tricks. We then check that the final path is still inside our root folder. Anything outside is refused before opening.
@@c3 JSON in and out
```python
import json

data = json.loads('{"title": "Math"}')   # text to dict
text = json.dumps({"title": "Math"})     # dict to text
```
JSON `true` becomes Python `True`, `null` becomes `None`. It is how your API and its clients talk.
@@c4 Settings from outside
```python
import os
DATABASE_URL = os.environ["DATABASE_URL"]
```
Passwords and addresses are kept in environment variables, not in the code. This way the same code runs on your laptop and on the real server, with different settings. If a needed setting is missing, fail at start with a clear message instead of pretending.
@@example A safe notes reader
```python
def read_note(name: str) -> str:
    root = Path("notes").resolve()
    target = (root / f"{name}.txt").resolve()
    if root not in target.parents:
        raise ValueError("Invalid note name")
    return target.read_text(encoding="utf-8")
```
`read_note("math")` works. `read_note("../../secret")` is refused.
@@use
1. A script reads a list of names from a text file.
2. An app loads its database address from an environment variable.
3. An API saves a note as JSON in a file for a demo.
@@wrong
Mistakes: building paths by gluing strings with `+`, opening a path from user input without checks, saving passwords in the code, and reading a huge file all at once. For big files, read a piece at a time.

=== 11
@@picture
When your browser opens a website, it sends a message called an **HTTP request**. It is like a letter: it has an address (the URL), an action word (like GET), some notes on the envelope (headers), and sometimes a letter inside (the body). The server reads it and sends back a reply with a number (the status code) and its own content.

Most APIs send and receive **JSON**. When you understand this letter exchange, FastAPI is easy, because FastAPI is just a clever way of reading these letters for you.
@@diagram
flowchart LR
    C["Client"] -->|"GET /notes/7"| S["Server"]
    S -->|"200 OK and JSON body"| C
@@goal
- Read a URL and name its parts.
- Use methods, status codes, headers, and JSON bodies correctly.
- Explain what a contract is and why retries need care.
@@words
- **URL**: the address of something on the web.
- **method**: the action: GET, POST, PUT, PATCH, DELETE.
- **status code**: a number telling how the request went.
- **header**: extra information about the message.
- **body**: the main content, often JSON.
- **contract**: the agreed shape of requests and replies.
@@why
Clients and servers are written by different people at different times. A clear, shared agreement lets them work together without ever meeting.
@@c1 Parts of a URL
`https://api.example.com/notes/7?show=full` has: the scheme (`https`), the host (`api.example.com`), the path (`/notes/7`), and the query (`show=full`). The path says *what*, the query adds *options*.
@@c2 Methods say what you want
GET reads. POST creates. PUT replaces. PATCH changes part. DELETE removes. GET must not change anything, so it is safe to repeat.
@@c3 Status codes are traffic lights
200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Not Signed In, 403 Not Allowed, 404 Not Found, 422 Invalid Data, 500 Server Problem. Using the right one tells the client what to do next.
@@c4 Headers, bodies, and retries
`Content-Type: application/json` says the body is JSON. A body is only used with POST, PUT, and PATCH. If a POST times out, the client might retry and create a duplicate, so important creates need a unique request key. Lists should come in pages with a limit, like `?limit=20`.
@@example One full exchange
```text
POST /notes
Content-Type: application/json

{"title": "Math"}

--- reply ---
201 Created
{"id": 7, "title": "Math"}
```
The client asked to create a note. The server replied 201 and sent the new note with its id.
@@use
1. A phone app requests `GET /weather?city=Paris`.
2. A signup form sends `POST /users` with JSON.
3. A page asks for `GET /notes?limit=20&offset=40` to see the third page.
@@wrong
Mistakes: using GET to change data, always replying 200 even for errors, sending a list with no limit, and putting passwords in the URL, because URLs are saved in logs and history. Secrets go in headers or bodies over HTTPS.

=== 12
@@picture
Let us make our first web service! With FastAPI, a complete API can fit in a few lines. You write a function, add a label (called a decorator) that says "this answers GET requests at /health", and you are done.

A second program called **uvicorn** acts like a doorman: it listens for visitors and passes their requests to your FastAPI app. FastAPI even creates a free, clickable manual of your API at `/docs`.
@@diagram
flowchart LR
    V["Visitor"] --> U["uvicorn: the doorman"]
    U --> F["FastAPI app"]
    F --> R["Your route function"]
    R --> J["JSON reply"]
@@goal
- Create a FastAPI app and a health route.
- Run it with uvicorn and open `/docs`.
- Understand startup and what a route function is.
@@words
- **FastAPI**: a Python tool for making web APIs.
- **uvicorn**: a server that runs your app.
- **route**: a path plus a method that runs a function.
- **decorator**: a label above a function, starting with `@`.
- **/docs**: the automatic interactive manual.
- **health endpoint**: a tiny route that says "I am alive".
@@why
A first working request is a big win. Once that works, every other feature is a small step on top.
@@c1 The smallest app
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```
`app` is your service. `@app.get("/health")` says: "when someone asks GET /health, run this function". The returned dictionary becomes JSON.
@@c2 Run it
```text
uvicorn app.main:app --reload
```
`app.main:app` means "in the file `app/main.py`, use the variable `app`". `--reload` restarts the server when you edit code, which is great while learning. Visit `http://127.0.0.1:8000/health`.
@@c3 Free documentation
Open `http://127.0.0.1:8000/docs`. FastAPI built a web page listing your routes, with a "Try it out" button for each. You never have to write it. It stays correct because it is made from your code.
@@c4 Startup and structure
Put setup (like opening a database pool) in a lifespan or startup function, and keep routes thin: they receive a request and call other functions. As the app grows, you will split it into folders, which we do in later lessons.
@@example A greeting route
```python
@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"Hello, {name}!"}
```
Visit `/hello/Ava` and you get `{"message": "Hello, Ava!"}`. FastAPI took `Ava` from the URL and gave it to your function.
@@use
1. A health route that a server uses to check the app is alive.
2. A school API with `GET /students`.
3. A tiny prototype to test an idea in ten minutes.
@@wrong
Mistakes: running `python main.py` instead of uvicorn, forgetting to activate the venv, typing the wrong `module:variable` for uvicorn, and putting all logic inside route functions. Keep routes short.

=== 13
@@picture
When a visitor fills out a form, they can type anything: a number where you want words, an empty title, a title as long as a book. Pydantic is like a careful librarian who looks at every form before it goes to the shelves. It checks each box against rules you wrote, fixes what it can ("12" becomes 12), and rejects what it cannot.

You describe the shape of your data once, as a class. FastAPI uses it to check incoming data, to shape the reply, and to write the documentation.
@@diagram
flowchart LR
    J["JSON from client"] --> P["Pydantic model checks it"]
    P -->|"Valid"| O["Typed object for your code"]
    P -->|"Invalid"| E["422 error with details"]
@@goal
- Write a Pydantic model with fields and limits.
- Use request models and response models.
- Read a 422 error message.
@@words
- **Pydantic**: a library that checks data against a model.
- **BaseModel**: the class you extend to make a model.
- **field**: one named piece of data with rules.
- **schema**: the written description of the shape and rules of data.
- **response model**: the shape of what you send back.
- **422**: the status for "your data is not valid".
@@why
Never trust data from outside. Checking it by hand in every route is long and easy to forget. A model does it once, reliably.
@@c1 A model is a form template
```python
from pydantic import BaseModel, Field

class NoteIn(BaseModel):
    title: str = Field(min_length=1, max_length=80)
    body: str = ""
    pinned: bool = False
```
This says: `title` must be 1 to 80 characters, `body` is optional text, `pinned` defaults to False.
@@c2 Use it in a route
```python
@app.post("/notes", status_code=201)
def create_note(note: NoteIn):
    return {"id": 1, **note.model_dump()}
```
FastAPI reads the JSON body, checks it with `NoteIn`, and gives you a good, typed `note`. If the data is wrong, your function never runs.
@@c3 Read the error
If a client sends `{"title": ""}`, FastAPI replies 422 with details such as `"String should have at least 1 character"` and the place (`body.title`). The error message tells the client exactly what to fix. You wrote no error code!
@@c4 Response models protect secrets
```python
class NoteOut(BaseModel):
    id: int
    title: str

@app.get("/notes/{id}", response_model=NoteOut)
```
The reply includes only `id` and `title`, even if your internal object has other fields such as an owner's email or a password hash. This keeps private data from leaking by mistake.
@@example Whitespace title
A client sends `{"title": "   "}`. Length is 3, so the model accepts it. Add a validator that trims and rejects empty text: now `"   "` becomes `""` and is refused. Checks that depend on rules of your business belong in a service or validator, not just in the type.
@@use
1. A signup route that checks email and password length.
2. A response model that hides an internal `owner_id`.
3. An API that reports exactly which field was wrong.
@@wrong
Mistakes: using one model for everything (input, output, database) so secrets leak, no length limits so someone sends a million characters, trusting the type hint alone for business rules, and forgetting that a valid ID does not prove the user owns the record.

=== 14
@@picture
A restaurant has roles: a waiter (takes orders), a chef (cooks), and a pantry helper (fetches ingredients). FastAPI apps work best with the same split: **routes** talk to the web, **services** apply the rules, and **repositories** talk to the database.

FastAPI also has a neat helper called **dependency injection**: instead of each route building the things it needs, you declare what you need with `Depends(...)`, and FastAPI hands it over, just like a waiter who says "I need a chef" and one appears.
@@diagram
flowchart LR
    R["Route"] -->|"Depends"| S["Service"]
    S --> P["Repository"]
    P --> D[("Database")]
@@goal
- Split code into routes, services, and repositories.
- Use `Depends` to get a service or a database session.
- Override a dependency in tests.
@@words
- **dependency injection**: giving a function the things it needs instead of making them inside.
- **Depends**: FastAPI's way to ask for a dependency.
- **service**: the part that holds business rules.
- **repository**: the part that reads and writes data.
- **layer**: one level with one job.
- **override**: replace a dependency, usually in a test.
@@why
If routes contain SQL and rules, you cannot test the rules without starting everything. Layers and injection make each part small and replaceable.
@@c1 Three layers
The **route** receives the request and returns the reply. The **service** decides: "is the title valid? is this a duplicate?". The **repository** knows SQL. Each layer only calls the one below it.
@@c2 Depends hands things over
```python
def get_service() -> NoteService:
    return NoteService(SqliteNoteRepository())

@app.get("/notes/{id}")
def read(id: int, service: NoteService = Depends(get_service)):
    return service.find(id)
```
The route asks for a `service`. FastAPI calls `get_service()` and passes the result in. The route never builds it.
@@c3 Swap parts in tests
```python
app.dependency_overrides[get_service] = lambda: NoteService(FakeRepository())
```
In a test, tell FastAPI to use a fake repository. Now the route runs against a list in memory, with no database. Fast and safe.
@@c4 Own your transactions
One request should use one database session, opened at the start and closed (or rolled back) at the end. Dependencies can do this with `yield`: set up, give it to the route, then clean up afterwards. This is better than opening connections everywhere.
@@example Why layers help
Your boss says: "Titles must not be longer than 80 characters." You change one line in the service. The route and repository do not change. A test for the service runs in one millisecond using a fake repository.
@@use
1. A service that is shared by a web route and a command-line tool.
2. A test that replaces the real database with an in-memory fake.
3. A dependency that checks the login and gives the route the current user.
@@wrong
Mistakes: SQL inside routes, business rules inside repositories, global variables for the database, and a service that imports FastAPI (so it can no longer be tested alone). If a layer knows about two other layers, it is probably doing too much.

=== 15
@@picture
A request carries information in several places, like a package with a label, a note on the outside, and a letter inside. FastAPI can read each place for you: the **path** (`/notes/7`), the **query** (`?limit=10`), the **headers**, and the **body** (JSON).

You just name the parameter and give it a type. FastAPI looks in the right place, converts the value, and refuses bad input.
@@diagram
flowchart LR
    R["Request"] --> P["Path: /notes/7"]
    R --> Q["Query: ?limit=10"]
    R --> H["Header: X-Request-ID"]
    R --> B["Body: JSON"]
@@goal
- Read path, query, header, and body inputs.
- Add pagination, filters, and sorting.
- Limit input sizes and think about API versions.
@@words
- **path parameter**: a variable part of the URL, like the 7 in `/notes/7`.
- **query parameter**: an option after `?`, like `limit=10`.
- **header**: extra information on the request.
- **body**: the main JSON content.
- **pagination**: giving long lists in small pages.
- **versioning**: putting `/v1/` in the path to allow changes later.
@@why
Clients need many ways to say what they want. Putting each kind of information in its proper place keeps APIs predictable.
@@c1 Path and query
```python
@app.get("/notes/{note_id}")
def get_note(note_id: int): ...

@app.get("/notes")
def list_notes(limit: int = 20, offset: int = 0): ...
```
`note_id` comes from the path and must be a whole number. `limit` and `offset` come from the query, with defaults. `GET /notes?limit=5&offset=10` works.
@@c2 Body and headers
```python
@app.post("/notes")
def create(note: NoteIn, x_request_id: str | None = Header(default=None)): ...
```
A Pydantic model parameter is read from the JSON body. `Header(...)` reads a header. FastAPI knows where to look by the kind of parameter.
@@c3 Bound everything
Always limit page size: `limit: int = Query(20, ge=1, le=100)` means between 1 and 100. Without a limit, someone asks for a million rows and your server struggles. Sort in a steady order so pages do not overlap.
@@c4 Version your API
Put a version in the path, like `/v1/notes`. Later, `/v2/notes` can change things without breaking apps that still use v1. Add new fields freely, but removing or renaming is a breaking change.
@@example Filtered list
```python
@app.get("/v1/notes")
def list_notes(q: str | None = None, limit: int = Query(20, le=100)):
    return service.search(q, limit)
```
`GET /v1/notes?q=math&limit=5` returns up to 5 notes that match "math".
@@use
1. A shop that lists products 20 at a time with `?page=2`.
2. A notes search that uses `?q=word`.
3. A mobile app that stays on `/v1` while a new `/v2` is tested.
@@wrong
Mistakes: no limit on page size, putting secrets in query strings, changing the meaning of a field without a new version, and mixing up path and query (the path says *which one*, the query says *how to show*).

=== 16
@@picture
CRUD stands for Create, Read, Update, Delete. These four actions are the heart of most apps: add a note, look at notes, edit a note, remove a note. In this lesson we build all four, and we plan carefully for the sad cases: the note is not there, the title is a duplicate, or something unexpected breaks.

Good APIs speak clearly even when things go wrong. They use the right status code, a short message, and a code that machines can understand.
@@diagram
flowchart TD
    R["Request"] --> V{"Valid data?"}
    V -->|"No"| E1["400 or 422"]
    V -->|"Yes"| F{"Does it exist?"}
    F -->|"No"| E2["404 Not found"]
    F -->|"Yes"| OK["Do it and reply 200 or 201"]
@@goal
- Build create, read, update, and delete routes.
- Return not found, conflict, and unexpected errors safely.
- Add a request ID to every reply and log.
@@words
- **CRUD**: Create, Read, Update, Delete.
- **404**: not found.
- **409**: conflict, for example a duplicate title.
- **exception handler**: code that turns an exception into a reply.
- **request ID**: a unique number that follows one request.
- **normalization**: cleaning input into a standard form.
@@why
CRUD is the foundation. Handling errors well is what separates a toy from something people can trust.
@@c1 The four routes
`POST /notes` creates (201). `GET /notes/{id}` reads (200 or 404). `PUT` or `PATCH /notes/{id}` updates. `DELETE /notes/{id}` removes (204). Each route calls the service and nothing else.
@@c2 Clean input first
Trim the title before checking it. `"  Math  "` becomes `"Math"`; `"   "` becomes `""` and is refused. Do this once in the service, so every route behaves the same.
@@c3 Specific errors
Define your own errors: `NoteNotFound`, `DuplicateTitle`. A handler turns each into a reply: 404 and 409. For anything unexpected, return a general 500 with a request ID, and put the real details in the private log. Never show a stack trace.
@@c4 Request IDs
Give each request an ID (a middleware can do this) and put it in the response header and in every log line. When a user says "it failed", they give you the ID and you find the exact story in seconds.
@@example A duplicate title
```python
@app.exception_handler(DuplicateTitle)
def handle_duplicate(request, exc):
    return JSONResponse(status_code=409, content={"code": "duplicate_title", "message": "A note with this title already exists."})
```
The client sees a clear 409 with a steady code `duplicate_title`, which the app can use to show a friendly message.
@@use
1. A notes app with add, list, edit, and delete.
2. A signup route that returns 409 when the email is already used.
3. A support team that asks for the request ID to find a problem.
@@wrong
Mistakes: replying 200 with an error message inside, one catch-all error for everything, leaking exception text, and forgetting that "delete twice" should still behave sensibly. Decide: is the second delete a 404 or also a success? Write it down.
