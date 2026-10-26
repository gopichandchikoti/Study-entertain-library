import assert from 'node:assert/strict'
const receipts=new Map(), outbox=[]
function createOnce(key,value) {
  if(receipts.has(key))return receipts.get(key)
  receipts.set(key,value);outbox.push({key,value});return value
}
assert.equal(createOnce('request-1','note-1'),createOnce('request-1','note-2'))
assert.equal(outbox.length,1)
const source=new Map([['note-1','old']]),cache=new Map()
const read=id=>{if(cache.has(id))return cache.get(id);const value=source.get(id);cache.set(id,value);return value}
assert.equal(read('note-1'),'old')
source.set('note-1','new');assert.equal(read('note-1'),'old')
cache.delete('note-1');assert.equal(read('note-1'),'new')
console.log('Duplicate write and stale-cache simulation passed. Values are synthetic; no performance measurement claimed.')
