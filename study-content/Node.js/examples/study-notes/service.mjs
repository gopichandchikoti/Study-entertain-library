import { DatabaseSync } from 'node:sqlite'
export class NoteError extends Error { constructor(status,code,message){super(message);this.status=status;this.code=code} }
export class NotesRepository {
  constructor(file=':memory:'){
    this.db=new DatabaseSync(file)
    this.db.exec('PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY, owner TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, topic TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0);')
  }
  list(owner,limit,offset){return this.db.prepare('SELECT id,title,body,topic,completed FROM notes WHERE owner=? ORDER BY id LIMIT ? OFFSET ?').all(owner,limit,offset)}
  find(id){return this.db.prepare('SELECT * FROM notes WHERE id=?').get(id)}
  create(owner,value){
    const row=this.db.prepare('INSERT INTO notes(owner,title,body,topic) VALUES (?,?,?,?)').run(owner,value.title,value.body,value.topic)
    return this.find(Number(row.lastInsertRowid))
  }
  replace(id,value){this.db.prepare('UPDATE notes SET title=?,body=?,topic=? WHERE id=?').run(value.title,value.body,value.topic,id);return this.find(id)}
  complete(id,value){this.db.prepare('UPDATE notes SET completed=? WHERE id=?').run(value?1:0,id);return this.find(id)}
  delete(id){this.db.prepare('DELETE FROM notes WHERE id=?').run(id)}
  close(){this.db.close()}
}
export function cleanNote(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw new NoteError(400,'INVALID_NOTE','A note object is required.')
  const limits={title:120,body:20000,topic:60},out={}
  for(const [field,max]of Object.entries(limits)){
    if(typeof value[field]!=='string'||!value[field].trim()||value[field].length>max)throw new NoteError(400,'INVALID_NOTE','Check the note text and field limits.')
    out[field]=value[field].trim()
  }
  return out
}
export class NotesService{
  constructor(repository){this.repository=repository}
  public(row){return {id:row.id,title:row.title,body:row.body,topic:row.topic,completed:Boolean(row.completed)}}
  get(owner,id){
    const row=this.repository.find(id)
    if(!row||row.owner!==owner)throw new NoteError(404,'NOTE_NOT_FOUND','The note was not found.')
    return this.public(row)
  }
  create(owner,input){return this.public(this.repository.create(owner,cleanNote(input)))}
  replace(owner,id,input){this.get(owner,id);return this.public(this.repository.replace(id,cleanNote(input)))}
  complete(owner,id,value){this.get(owner,id);if(typeof value!=='boolean')throw new NoteError(400,'INVALID_COMPLETION','Completion must be true or false.');return this.public(this.repository.complete(id,value))}
  delete(owner,id){this.get(owner,id);this.repository.delete(id)}
  list(owner,limit=20,offset=0){
    if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0)throw new NoteError(400,'INVALID_PAGE','Use limit 1–100 and a nonnegative offset.')
    return this.repository.list(owner,limit,offset).map(row=>({...row,completed:Boolean(row.completed)}))
  }
}
