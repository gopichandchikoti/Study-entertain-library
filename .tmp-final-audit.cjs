const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
function files(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(d,e.name)):[path.join(d,e.name)]);}
for(const f of files('src').filter(f=>/\.tsx?$/.test(f)&&!f.endsWith('.d.ts'))){
 const s=fs.readFileSync(f,'utf8'),ast=ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true);
 function visit(n){if((ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))&&/[A-Za-z]{2,}\s+[A-Za-z]{2,}|[A-Za-z]{2,}[.:!?…]$/.test(n.text))console.log(f+':'+(ast.getLineAndCharacterOfPosition(n.getStart()).line+1)+' '+n.getText(ast));ts.forEachChild(n,visit);}visit(ast);
}
