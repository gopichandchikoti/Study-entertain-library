import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { NotesRepository,NotesService,NoteError } from './service.mjs'
export function createNotesServer(repository=new NotesRepository()){
  const service=new NotesService(repository)
  const server=http.createServer(async(req,res)=>{
    const send=(status,body)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(body===undefined?undefined:JSON.stringify(body))}
    try{
      const url=new URL(req.url,'http://localhost')
      if(req.method==='GET'&&url.pathname==='/health'){send(200,{status:'ok',mode:'local-demo'});return}
      // Synthetic identity for a loopback-only teaching server, not production authentication.
      const owner=req.headers['x-demo-user']
      if(!['student-a','student-b'].includes(owner))throw new NoteError(401,'DEMO_IDENTITY_REQUIRED','Choose one synthetic demo user.')
      const match=url.pathname.match(/^\/notes\/([1-9][0-9]*)(\/completion)?$/)
      let body=null
      if(['POST','PUT','PATCH'].includes(req.method)){
        if(!req.headers['content-type']?.startsWith('application/json'))throw new NoteError(415,'JSON_REQUIRED','Send application/json.')
        let bytes=0;const chunks=[]
        for await(const chunk of req){bytes+=chunk.length;if(bytes>25000)throw new NoteError(413,'BODY_TOO_LARGE','Body is limited to 25,000 bytes.');chunks.push(chunk)}
        try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new NoteError(400,'INVALID_JSON','Send valid JSON.')}
      }
      if(req.method==='GET'&&url.pathname==='/notes')send(200,service.list(owner,Number(url.searchParams.get('limit')??20),Number(url.searchParams.get('offset')??0)))
      else if(req.method==='POST'&&url.pathname==='/notes')send(201,service.create(owner,body))
      else if(match&&req.method==='GET'&&!match[2])send(200,service.get(owner,Number(match[1])))
      else if(match&&req.method==='PUT'&&!match[2])send(200,service.replace(owner,Number(match[1]),body))
      else if(match&&req.method==='PATCH'&&match[2])send(200,service.complete(owner,Number(match[1]),body?.completed))
      else if(match&&req.method==='DELETE'&&!match[2]){service.delete(owner,Number(match[1]));send(204)}
      else throw new NoteError(404,'ROUTE_NOT_FOUND','Route not found.')
    }catch(error){send(error instanceof NoteError?error.status:503,{code:error instanceof NoteError?error.code:'STORE_UNAVAILABLE',message:error instanceof NoteError?error.message:'The note store is unavailable.'})}
  })
  server.on('close',()=>repository.close())
  return server
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const server=createNotesServer(new NotesRepository(process.env.NOTES_DB??'notes.sqlite'))
  server.listen(8000,'127.0.0.1',()=>console.log('Synthetic course API on http://127.0.0.1:8000'))
  const stop=()=>{server.close();setTimeout(()=>process.exit(1),5000).unref()}
  process.on('SIGTERM',stop);process.on('SIGINT',stop)
}
