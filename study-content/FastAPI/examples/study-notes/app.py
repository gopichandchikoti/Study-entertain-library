"""Synthetic, loopback-only lesson API. Demo identities are not authentication."""
import sqlite3
from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import FastAPI, Header, HTTPException, Query
from pydantic import BaseModel, Field, field_validator

class NoteInput(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    body: str = Field(min_length=1, max_length=20_000)
    topic: str = Field(min_length=1, max_length=60)

    @field_validator("title", "body", "topic")
    @classmethod
    def not_blank(cls, value: str) -> str:
        clean = value.strip()
        if not clean:
            raise ValueError("Text must not be blank")
        return clean

class Completion(BaseModel):
    completed: bool

class Repository:
    def __init__(self) -> None:
        self.db = sqlite3.connect(":memory:", check_same_thread=False)
        self.db.row_factory = sqlite3.Row
        self.db.execute("CREATE TABLE notes(id INTEGER PRIMARY KEY, owner TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, topic TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)")

    def close(self) -> None:
        self.db.close()

def public(row: sqlite3.Row) -> dict[str, object]:
    value = dict(row)
    del value["owner"]
    value["completed"] = bool(value["completed"])
    return value

def demo_owner(value: str | None) -> str:
    if value not in {"student-a", "student-b"}:
        raise HTTPException(status_code=401, detail="Synthetic demo identity required")
    return value

def create_app() -> FastAPI:
    # Created at lifespan startup; closing a client releases its owned connection.
    @asynccontextmanager
    async def lifespan(api: FastAPI):
        api.state.repository = Repository()
        try:
            yield
        finally:
            api.state.repository.close()

    api = FastAPI(title="Local Demo Study Notes", lifespan=lifespan)

    def owned(note_id: int, owner: str) -> sqlite3.Row:
        row = api.state.repository.db.execute("SELECT * FROM notes WHERE id = ? AND owner = ?", (note_id, owner)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Note not found")
        return row

    @api.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "mode": "synthetic-demo"}

    @api.get("/notes")
    def list_notes(x_demo_user: Annotated[str | None, Header()] = None, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0)) -> list[dict[str, object]]:
        owner = demo_owner(x_demo_user)
        rows = api.state.repository.db.execute("SELECT * FROM notes WHERE owner = ? ORDER BY id LIMIT ? OFFSET ?", (owner, limit, offset)).fetchall()
        return [public(row) for row in rows]

    @api.post("/notes", status_code=201)
    def create_note(body: NoteInput, x_demo_user: Annotated[str | None, Header()] = None) -> dict[str, object]:
        owner = demo_owner(x_demo_user)
        db = api.state.repository.db
        with db:
            cursor = db.execute("INSERT INTO notes(owner,title,body,topic) VALUES (?,?,?,?)", (owner, body.title, body.body, body.topic))
        return public(owned(cursor.lastrowid, owner))

    @api.get("/notes/{note_id}")
    def get_note(note_id: int, x_demo_user: Annotated[str | None, Header()] = None) -> dict[str, object]:
        return public(owned(note_id, demo_owner(x_demo_user)))

    @api.put("/notes/{note_id}")
    def replace_note(note_id: int, body: NoteInput, x_demo_user: Annotated[str | None, Header()] = None) -> dict[str, object]:
        owner = demo_owner(x_demo_user)
        owned(note_id, owner)
        with api.state.repository.db as db:
            db.execute("UPDATE notes SET title=?,body=?,topic=? WHERE id=? AND owner=?", (body.title, body.body, body.topic, note_id, owner))
        return public(owned(note_id, owner))

    @api.patch("/notes/{note_id}/completion")
    def complete_note(note_id: int, body: Completion, x_demo_user: Annotated[str | None, Header()] = None) -> dict[str, object]:
        owner = demo_owner(x_demo_user)
        owned(note_id, owner)
        with api.state.repository.db as db:
            db.execute("UPDATE notes SET completed=? WHERE id=? AND owner=?", (int(body.completed), note_id, owner))
        return public(owned(note_id, owner))

    @api.delete("/notes/{note_id}", status_code=204)
    def delete_note(note_id: int, x_demo_user: Annotated[str | None, Header()] = None) -> None:
        owner = demo_owner(x_demo_user)
        owned(note_id, owner)
        with api.state.repository.db as db:
            db.execute("DELETE FROM notes WHERE id=? AND owner=?", (note_id, owner))
    return api

app = create_app()
