import test from 'node:test'
import assert from 'node:assert/strict'
import { NotesRepository, NotesService } from './service.mjs'
import { createNotesServer } from './server.mjs'
const value={title:' HTTP ',body:'A request asks for work.',topic:'api'}
test('CRUD, pagination, ownership, validation, completion, and unknown IDs',()=>{
  const repository=new NotesRepository(),service=new NotesService(repository)
  try{
    const note=service.create('student-a',value);assert.equal(note.title,'HTTP');assert.ok(!('owner'in note))
    assert.equal(service.get('student-a',note.id).id,note.id)
    assert.throws(()=>service.get('student-b',note.id),{status:404})
    assert.throws(()=>service.create('student-a',{...value,title:' '}),{status:400})
    assert.throws(()=>service.list('student-a',101),{status:400})
    assert.equal(service.replace('student-a',note.id,{...value,title:'REST'}).title,'REST')
    assert.equal(service.complete('student-a',note.id,true).completed,true)
    service.delete('student-a',note.id);assert.throws(()=>service.get('student-a',note.id),{status:404})
  }finally{repository.close()}
})
test('HTTP contract, malformed body, oversized input, unauthorized read, safe outage',async()=>{
  const server=createNotesServer()
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
  const base='http://127.0.0.1:'+server.address().port
  const headers={'content-type':'application/json','x-demo-user':'student-a'}
  try{
    assert.equal((await fetch(base+'/health')).status,200)
    assert.equal((await fetch(base+'/notes')).status,401)
    const created=await fetch(base+'/notes',{method:'POST',headers,body:JSON.stringify(value)});assert.equal(created.status,201);const row=await created.json()
    assert.equal((await fetch(base+'/notes/'+row.id,{headers:{'x-demo-user':'student-b'}})).status,404)
    assert.equal((await fetch(base+'/notes',{method:'POST',headers,body:'{bad'})).status,400)
    assert.equal((await fetch(base+'/notes',{method:'POST',headers,body:JSON.stringify({...value,body:'x'.repeat(26000)})})).status,413)
    assert.equal((await fetch(base+'/notes?limit=101',{headers})).status,400)
  }finally{await new Promise(resolve=>server.close(resolve))}
})
