=== 17
@@picture
A database is a very organized filing cabinet. SQL is the language we use to ask it questions: "give me all notes where the title contains Math". SQLite is a tiny, friendly filing cabinet that lives in a single file on your computer, so you can learn without installing anything.

Rule number one: **never glue user text into a SQL command**. Always use `?` slots. It is the difference between a locked and an unlocked door.
@@diagram
flowchart LR
    S["Service"] --> R["Repository"]
    R -->|"SQL with ? slots"| D[("notes.db")]
    D --> R
    R --> S
@@goal
- Create a table and use `INSERT`, `SELECT`, `UPDATE`, and `DELETE`.
- Use parameters to avoid SQL injection.
- Keep SQL inside a repository and use transactions.
@@words
- **SQLite**: a small database stored in one file.
- **SQL**: the language for asking databases to store and find data.
- **table**: a grid of rows and columns.
- **index**: a quick-lookup list for a column.
- **parameter**: a safe slot (`?`) that holds a value.
- **transaction**: a group of changes that succeed or fail together.
@@why
Data in a list or a variable disappears when the program stops. A database keeps it safe, lets many requests share it, and enforces rules.
@@c1 A table and basic SQL
```sql
CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT ''
);
INSERT INTO notes (title) VALUES (?);
SELECT id, title FROM notes WHERE id = ?;
```
`PRIMARY KEY` is the unique id. `NOT NULL` means the column must have a value. Those rules live in the database itself, so they hold even if the app has a bug.
@@c2 Use ? slots
```python
cursor.execute("SELECT title FROM notes WHERE id = ?", (note_id,))
```
Never write `f"... WHERE id = {note_id}"`. If a user types `1 OR 1=1`, they might see everything. With `?`, the database knows the value is only data, never a command.
@@c3 Keep SQL in the repository
```python
class NoteRepository:
    def find(self, note_id: int):
        row = self.conn.execute("SELECT id, title FROM notes WHERE id = ?", (note_id,)).fetchone()
        return None if row is None else Note(*row)
```
The service asks `repo.find(7)`, and never sees SQL. If you switch databases, only the repository changes.
@@c4 Transactions and indexes
`with conn:` wraps changes in a transaction: success commits, a failure rolls back. Add an index on columns you search often, like `CREATE INDEX idx_notes_title ON notes(title);`. Indexes speed up searching but slow writes a little, so add only the ones you need.
@@example Save two things together
```python
with conn:
    conn.execute("INSERT INTO notes (title) VALUES (?)", (title,))
    conn.execute("INSERT INTO tags (note_id, tag) VALUES (?, ?)", (note_id, tag))
```
If the second insert fails, the first is undone. You never end up with a note that is half saved.
@@use
1. A to-do app saves tasks in `todo.db`.
2. A test uses an in-memory SQLite database that disappears after the test.
3. A small site with one user saves data in a single file.
@@wrong
Mistakes: building SQL by joining strings, keeping a connection open forever, sharing one connection between many threads without care, forgetting to commit, and putting SQL in routes. SQLite is great for learning and small apps. Bigger apps with many users usually move to PostgreSQL.

=== 18
@@picture
SQLite is a notebook you keep in your bag. PostgreSQL is a big public library with many librarians: it can serve hundreds of people at once, has strong rules, and does not lose your books when the power goes out. Real apps with many users use PostgreSQL.

Two ideas matter here. First, **connection pools**: a set of ready connections that requests borrow and return. Second, **migrations**: numbered change scripts that update the table design in small, safe steps.
@@diagram
flowchart LR
    A["App requests"] --> P["Connection pool"]
    P --> D[("PostgreSQL")]
    M["Migrations: numbered scripts"] --> D
@@goal
- Explain why a real app moves from SQLite to PostgreSQL.
- Use a pool, and migrations to change tables safely.
- Know what isolation and concurrency mean.
@@words
- **PostgreSQL**: a powerful database server for many users.
- **connection pool**: a set of reusable database connections.
- **migration**: a numbered script that changes the database design.
- **isolation**: how separate transactions stay out of each other's way.
- **concurrency**: many things happening at once.
- **object storage**: a place for big files, with only a link in the database.
@@why
When many people use the app at once, you need a database built for that. And as the app changes, the database design changes too, which must happen safely on every computer.
@@c1 A pool saves time
Opening a database connection takes time. A pool opens a few and lends them out: a request borrows one, uses it, and returns it. The pool has a maximum size, so the database is never swamped. If you forget to return one, the pool runs dry and requests wait.
@@c2 Migrations are numbered steps
```text
001_create_notes.sql
002_add_pinned_column.sql
003_add_title_index.sql
```
A tool applies them in order and remembers which ones ran. Never edit the database by hand in production. Every computer, from your laptop to the real server, follows the same steps.
@@c3 Concurrency and isolation
Two requests may update the same note at once. A transaction with the right isolation level keeps them from corrupting each other. A version column helps: "update only if the version is still 3". If someone else changed it, your update does nothing, and you can tell the user.
@@c4 Big files do not go in rows
Store photos and PDFs in object storage and keep only a link and a few facts (name, size) in the table. This keeps the database fast and the backups small. Check the sizes and types of uploads before saving.
@@example Adding a column safely
You want a `pinned` column. Migration 002: `ALTER TABLE notes ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT FALSE;`. You first deploy this migration, and old code still works because the new column has a default. Later you deploy the new code that uses it.
@@use
1. A school platform with thousands of students uses PostgreSQL.
2. A team runs migrations automatically during every release.
3. A photo app stores files in object storage and links in PostgreSQL.
@@wrong
Mistakes: forgetting to give connections back, editing the live database by hand, a migration that locks a huge table for minutes, and storing big files in the database. Always test a migration on a copy first.

=== 19
@@picture
When you enter a school, a guard checks your ID (authentication). Then you can only go to your own classroom, not the principal's office (authorization). A web API needs both checks, on every request.

The usual way: you log in once and get a **token**, like a wristband. On each request you show the wristband. The API checks that the wristband is real, not expired, and then checks that the thing you ask for belongs to you.
@@diagram
flowchart LR
    L["Log in"] --> T["Get a token"]
    T --> R["Send token with each request"]
    R --> A{"Valid token?"}
    A -->|"No"| X["401 Not signed in"]
    A -->|"Yes"| O{"Is this note yours?"}
    O -->|"No"| F["403 or 404"]
    O -->|"Yes"| D["Return the note"]
@@goal
- Tell authentication from authorization.
- Understand tokens, scopes, and password hashing.
- Know about HTTPS, CORS, CSRF, rate limits, and secrets.
@@words
- **authentication**: proving who you are.
- **authorization**: checking what you may do.
- **token**: a signed pass the client sends with each request.
- **hashing**: scrambling a password so it cannot be read back.
- **CORS**: browser rules about which websites may call your API.
- **rate limit**: a cap on how often someone can ask.
@@why
APIs hold private things. One missing check can show one person's notes to a stranger. Security is not an extra: it is part of the design.
@@c1 Authentication: who are you?
The client sends a username and password over HTTPS. The server checks them (comparing against a **hashed** password, never a plain one) and gives back a token. Passwords are hashed with a slow, salted method such as bcrypt or argon2, so even if the database leaks, the passwords are not readable.
@@c2 Authorization: may you do this?
```python
note = service.find(note_id)
if note.owner_id != current_user.id:
    raise HTTPException(status_code=404)
```
A valid token does not prove that the note is yours. Check ownership on every request. Many APIs answer 404 instead of 403, so strangers cannot even tell that the note exists.
@@c3 The web's safety rules
Use **HTTPS** always, so nobody can read traffic. **CORS** says which websites' scripts may call your API: allow only the ones you trust. **Rate limits** stop robots from guessing passwords. Put secret keys in environment settings and rotate them if they leak.
@@c4 Least privilege
Give each token only the **scopes** it needs: `notes:read` for a reader, `notes:write` for an editor. A service that only reads should not be able to delete. If something is stolen, the damage stays small.
@@example Dependency for the current user
```python
def current_user(token: str = Depends(oauth2_scheme)) -> User:
    user = decode_and_check(token)
    if user is None:
        raise HTTPException(status_code=401, detail="Please sign in")
    return user

@app.get("/notes/{id}")
def read(id: int, user: User = Depends(current_user)): ...
```
Every route that needs a signed-in user declares `Depends(current_user)`, and the check happens in one place.
@@use
1. A notes app where each person sees only their own notes.
2. A login route that limits attempts to 5 per minute.
3. A reader token that can read but cannot delete.
@@wrong
Mistakes: storing plain passwords, putting secrets in code or logs, trusting a role the client claims, forgetting ownership checks, allowing every website in CORS, and tokens that never expire. Security checks must happen on the server, never only in the browser.

=== 20
@@picture
Imagine a waiter in a restaurant. A slow waiter takes your order, walks to the kitchen, stands there until your food is ready, then walks back. Nobody else can order. A smart waiter takes your order, gives it to the kitchen, and goes to serve other tables while the food cooks.

That is what `async` does in Python. When your code has to wait (for a database or another web service), it says `await`, and Python uses the time to handle other requests. For really long jobs, like making a big report, we use a **background worker** and give the visitor a ticket number.
@@diagram
flowchart LR
    R["Request: make a big report"] --> A["API replies 202 with a job id"]
    A --> Q["Queue"]
    Q --> W["Worker does the job"]
    W --> S["Status: done"]
    R2["Client asks: GET /jobs/42"] --> S
@@goal
- Explain `async` and `await` with the waiter story.
- Know when async helps and when it does not.
- Design a background job with a status, retries, and a limit.
@@words
- **async**: marks a function that can pause while waiting.
- **await**: "pause here until this finishes, and let others run".
- **event loop**: the manager that switches between waiting tasks.
- **worker**: a separate process that does jobs from a queue.
- **idempotent**: safe to repeat.
- **cancellation**: asking a task to stop and clean up.
@@why
A server that waits for one slow thing at a time can serve only a few visitors. Async lets one process juggle many waiting tasks. Workers take heavy jobs away from the web process entirely.
@@c1 async and await
```python
@app.get("/weather")
async def weather():
    data = await client.get("https://example.com/weather")
    return data.json()
```
`await` means "I will wait here, but go ahead and serve other requests meanwhile". Use it with libraries made for async (async database drivers, `httpx`).
@@c2 Async does not make heavy math fast
If your function does long calculations, it keeps the chair and nobody else gets a turn. Async helps with *waiting*, not with *working*. For heavy work, use a separate worker process. And never call a slow blocking function (like `time.sleep`) inside `async def`.
@@c3 Background jobs with tickets
The API answers right away with `202 Accepted` and a job id. A worker picks the job from a queue, runs it, and updates the status: queued, running, done, failed. The client asks `GET /jobs/42` to see how it is going.
@@c4 Retries, limits, and cancelling
Workers retry failed jobs a few times with growing waits, and give up to a "failed" list. Jobs must be safe to repeat. Limit the queue size so it cannot fill the memory. When a job is cancelled, it stops and cleans up its files.
@@example A report job
```python
@app.post("/reports", status_code=202)
def start_report(background: BackgroundTasks):
    job_id = create_job_row()
    background.add_task(build_report, job_id)
    return {"job_id": job_id, "status": "queued"}
```
The visitor gets `{"job_id": 42, "status": "queued"}` in a blink. `build_report` runs afterwards. For serious work, use a real queue like Celery or RQ, so jobs survive a restart.
@@use
1. An API that calls a weather service using `await`.
2. A PDF export that runs as a background job.
3. A nightly job that sends email reminders.
@@wrong
Mistakes: blocking calls inside `async def`, thinking `async` makes heavy calculations faster, no limit on the queue, jobs that are not safe to repeat, and no status so the user keeps clicking. Also, background tasks inside the web process are lost if the server restarts, so important jobs need a real queue.

=== 21
@@picture
Before a magician performs for a crowd, they practice many times, including what to do if a trick goes wrong. Tests are your practice. You write small programs that call your API as if they were a real client and check the answers.

FastAPI helps twice: it comes with a test client, and it writes an **OpenAPI** document describing every route. That document is a contract: clients can read it, and tests can compare against it.
@@diagram
flowchart LR
    C["Write code"] --> T["Write tests with pytest"]
    T --> R["Run tests"]
    R -->|"Fail"| F["Read the message and fix"]
    F --> T
    R -->|"Pass"| D["Check /docs and OpenAPI"]
@@goal
- Write tests with pytest and `TestClient`.
- Test both success and failure paths.
- Use fixtures, fake dependencies, and check OpenAPI.
@@words
- **pytest**: a popular Python testing tool.
- **TestClient**: a fake client that calls your app without a real server.
- **fixture**: reusable setup for tests.
- **mock**: a fake helper used in a test.
- **OpenAPI**: a machine-readable description of your API.
- **contract test**: a test that checks replies match the described shape.
@@why
Changing code without tests is like walking in the dark. Tests tell you in seconds if something broke, so you can change things with confidence.
@@c1 A first test
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```
`assert` says "this must be true". If not, the test fails and shows you what differed.
@@c2 Test the sad paths
```python
def test_create_note_rejects_blank_title():
    response = client.post("/notes", json={"title": "   "})
    assert response.status_code == 422
```
Also test: unknown id (404), duplicate (409), too long, not signed in (401), and someone else's note. Bugs love the unusual cases.
@@c3 Fixtures and fakes
```python
@pytest.fixture
def client():
    app.dependency_overrides[get_repo] = lambda: FakeRepository()
    yield TestClient(app)
    app.dependency_overrides.clear()
```
A fixture prepares a clean app with a fake repository for each test and cleans up after. Use made-up data and a separate test database, never the real one.
@@c4 OpenAPI is your contract
Visit `/openapi.json`: FastAPI describes every route, input, and output. Clients can generate code from it. A contract test checks that real replies match. When you change a route, the document changes, which makes accidental breaking changes visible.
@@example Bug found by a test
You change the title limit to 80 and forget to update the service. Your test `test_title_81_chars_rejected` fails: "expected 422, got 201". Before any user sees it, you fix the service. The test paid for itself.
@@use
1. Every pull request runs all tests automatically.
2. A mobile team generates its client from the OpenAPI document.
3. A test uses a fake email sender so no emails are really sent.
@@wrong
Mistakes: only testing the happy path, tests that share state and depend on order, using the real database, tests with no `assert`, and treating a coverage number as proof. A mock cannot prove the real SQL works, so keep a few tests with a real test database.

=== 22
@@picture
Once your app runs on a real server, you cannot look at it directly. You need a dashboard. **Logs** are a diary of what happened. **Metrics** are a scoreboard of numbers. **Health checks** say whether the app is alive and ready.

And to move the app from your laptop to a server without surprises, you pack it into a **Docker container**: a sealed box with your app and everything it needs. The same box runs the same way everywhere.
@@diagram
flowchart LR
    C["Code"] --> D["Docker image: sealed box"]
    D --> R["Run with settings from outside"]
    R --> H{"Health check OK?"}
    H -->|"Yes"| L["Live"]
    H -->|"No"| B["Roll back to the old image"]
@@goal
- Write structured logs with request IDs.
- Add liveness and readiness endpoints.
- Package the app with Docker and plan a rollback and backups.
@@words
- **log**: a written note about an event.
- **structured log**: a log written as fields, like JSON, so tools can search it.
- **metric**: a number measured over time.
- **liveness**: "is the program running?".
- **readiness**: "can it serve visitors, with its database?".
- **Docker image**: a packaged app and its tools.
@@why
Problems on a real server cannot be seen directly. Good signals show you what happened, and a repeatable package means you can fix or undo a release quickly.
@@c1 Logs you can search
```python
logger.info("note_created", extra={"request_id": rid, "note_id": 7})
```
Write what happened and the request id, as fields. Never write passwords, tokens, or private note text in a log. Many people can read logs.
@@c2 Two health checks
`GET /health` returns OK if the process is alive. `GET /ready` checks the database too and returns 503 if it cannot connect. A load balancer uses readiness to stop sending visitors to a server that is not ready.
@@c3 A container
```text
FROM python:3.12-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
This recipe builds an image. Settings like the database address come from environment variables when you run it, not from inside the image. Never put secrets in the image.
@@c4 Roll back and back up
Keep the previous image so you can switch back if the new one fails its health check. Back up the database regularly, and **practice restoring**. A backup you have never restored is only a hope. Also measure: requests per minute, errors, and slow requests.
@@example A bad release
You deploy version 12 and `/ready` returns 503. Your deploy script sees the failure, stops the rollout, and starts version 11 again. Logs with the request id show the new version could not find a setting called DATABASE_URL. You fix the settings and release again.
@@use
1. A dashboard shows errors per minute and the slowest routes.
2. A hosting platform restarts the app if `/health` fails.
3. A team practices restoring a backup every month.
@@wrong
Mistakes: logging secrets, only one health check that says "ok" even when the database is down, secrets inside the Docker image, running as the all-powerful root user, and never testing backups. A `latest` tag for images can hide which version is running, so use version numbers.

=== 23
@@picture
It is time for the big project! You will build a **Study Notes API**: people can create notes, put them in categories, bookmark them, and mark them complete. The API checks logins, saves in a database, has tests, and can be deployed.

Think of it as your final science fair project: it uses everything you learned, one piece at a time, and it works as a whole.
@@diagram
flowchart LR
    C["Client"] --> R["Routes"]
    R --> A["Auth"]
    R --> S["Services"]
    S --> P["Repositories"]
    P --> D[("Database")]
    R --> E["Safe errors and request IDs"]
@@goal
- Plan and build a complete notes API.
- Combine routes, services, repositories, auth, tests, and deployment.
- Know how to extend and review it.
@@words
- **capstone**: a big final project that uses all your skills.
- **bookmark**: a note you want to find again quickly.
- **category**: a group name for notes.
- **auth boundary**: the place where we check who is asking.
- **persistence**: saving data so it survives restarts.
- **definition of done**: a list that says when the work is finished.
@@why
Knowing pieces is not the same as using them together. A capstone shows you the gaps and proves that the pieces fit.
@@c1 Plan on paper
Write the requirements: create, list, update, delete, search, categories, bookmark, complete, and per-user privacy. Write numbers: 100 users, 20 notes each. Draw the layers. Then pick the simplest tools: FastAPI and SQLite first.
@@c2 Build in layers
Start with models and the repository with tests. Add the service and its rules. Then routes. Then login and ownership checks. At every step, a test proves that the new layer works before you go on.
@@c3 Handle the sad paths
Blank title: 422. Unknown note: 404. Duplicate: 409. Not signed in: 401. Someone else's note: 404. Database down: 503. Each has a steady error code and a request id. No stack traces ever reach the user.
@@c4 Ship and review
Add `/health` and `/ready`, put settings in environment variables, move to PostgreSQL with migrations, build a Docker image, and write the rollback plan. Then review the checklist: does every route have a limit, a test, and an ownership check?
@@example The first working slice
`POST /notes` with `{"title": "Fractions"}` returns `201` and `{"id": 1, "title": "Fractions"}`. Then `GET /notes/1` returns the same note, and `GET /notes/999` returns `404`. Three requests prove the core idea works. Everything after is making it safer and richer.
@@use
1. A student turns this into a portfolio project.
2. A team copies the structure for a tasks API.
3. A teacher uses it to see which lessons a student should review.
@@wrong
Mistakes: building everything before testing anything, forgetting the privacy checks, using real people's data in tests, and skipping the deployment plan. Remember: the capstone uses made-up data only.

=== 24
@@picture
This is the dictionary and the checklist for the whole course. When a word is new, look it up here. Each meaning is short and plain. Then use the checklist, like a pilot before takeoff, to see if you are ready to move on.

The best trick: pick a word, close the page, and explain it aloud as if you were teaching a friend who has never programmed.
@@diagram
flowchart LR
    A["Look up the word"] --> B["Say it in your own words"]
    B --> C["Write a tiny example"]
    C --> D["Check with the list"]
@@goal
- Look up any Python or FastAPI word from the course.
- Use the mastery checklist.
- Answer review questions and compare with sample answers.
@@words
- **function**: a named group of steps.
- **dictionary**: a lookup from keys to values.
- **module**: a Python file that holds code.
- **venv**: a private toolbox for one project.
- **route**: a path and method that run a function.
- **Pydantic model**: a form template that checks data.
- **dependency**: something a function receives, often through `Depends`.
- **token**: a signed pass that proves who you are.
@@why
Words are the tools of thinking. When you own the words, you can read any tutorial and talk to any teammate without feeling lost.
@@c1 Mastery checklist
Can you make and activate a venv? Write a function with defaults? Use a list, dict, set? Handle an exception safely? Write a Pydantic model? Make a route with path, query, and body? Explain layers? Write a pytest test? Explain authentication and authorization? If yes, you are ready.
@@c2 Practice question one
"Why does FastAPI return 422 for a blank title?" Answer: the Pydantic model says the title must have at least one character. The data does not match, so FastAPI replies 422 and explains what to fix, and your route function never runs.
@@c3 Practice question two
"Why use `Depends` for a service?" Answer: the route says what it needs, and FastAPI provides it. That makes it easy to replace the service with a fake in tests, and keeps routes short.
@@c4 Spaced review
Come back to each lesson after a day, a week, and a month. Close the page and write the example from memory. Struggling a little is what makes the memory strong.
@@example A self-check
Without looking, write a route `POST /notes` that accepts a title (1 to 80 characters), trims it, saves it through a service, and returns 201 with the saved note. If you can, you have the main skill of this course.
@@use
1. A learner reads the glossary before a quiz.
2. A new teammate uses it to understand code review comments.
3. A teacher uses the checklist to plan a review session.
@@wrong
Mistake: memorizing words without writing code. A word becomes yours only when you use it in a real example. Keep building small things, and keep reading error messages.
