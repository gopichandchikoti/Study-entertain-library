import assert from 'node:assert/strict'
export function readSchedule(args,scopes) {
  if(!scopes.includes('schedule:read'))throw new Error('FORBIDDEN')
  if(!args||typeof args.storeNumber!=='string'||!/^[0-9]{1,6}$/.test(args.storeNumber)||typeof args.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(args.date)||!Number.isFinite(Date.parse(args.date+'T00:00:00Z'))||new Date(args.date+'T00:00:00Z').toISOString().slice(0,10)!==args.date)throw new Error('INVALID_INPUT')
  return {storeNumber:args.storeNumber,date:args.date,rows:[],source:'synthetic-adapter'}
}
assert.deepEqual(readSchedule({storeNumber:'100',date:'2026-10-02'},['schedule:read']).rows,[])
assert.throws(()=>readSchedule({storeNumber:'../private',date:'2026-10-02'},['schedule:read']))
assert.throws(()=>readSchedule({storeNumber:'100',date:'2026-02-30'},['schedule:read']))
assert.throws(()=>readSchedule({storeNumber:'100',date:'2026-10-02'},[]))
console.log('Narrow adapter input and scope checks passed. This is not a wire-protocol server.')
