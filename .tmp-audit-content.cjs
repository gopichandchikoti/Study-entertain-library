const fs=require('node:fs'), path=require('node:path'), ts=require('typescript');
function files(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(d,e.name)):[path.join(d,e.name)]);}
for(const f of files('src').filter(f=>/\.tsx?$/.test(f)&&!f.endsWith('content.ts'))){
 let s=fs.readFileSync(f,'utf8');
 if(s.startsWith('import { content')){s=s.replace(/^import \{ content/,'import { content as copy').replace(/\bcontent\.([a-zA-Z]+)\./g,'copy.$1.');fs.writeFileSync(f,s);}
}
const model=JSON.parse(fs.readFileSync('src/content.model.json','utf8'));
for(const [section,entries] of Object.entries(model)) if(typeof entries==='object') for(const [key,value] of Object.entries(entries)) console.log(`${section}.${key}: ${JSON.stringify(value)}`);
console.log('\nREMAINING STRINGS');
for(const f of files('src').filter(f=>/\.tsx?$/.test(f)&&!f.endsWith('.d.ts'))){
 const s=fs.readFileSync(f,'utf8'), ast=ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true);
 function visit(n){if((ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))&&/[a-zA-Z]/.test(n.text)&&!ts.isLiteralTypeNode(n.parent)&&!ts.isImportDeclaration(n.parent)){
 const p=n.parent;
 if(ts.isConditionalExpression(p)||ts.isArrayLiteralExpression(p)||ts.isPropertyAssignment(p)||ts.isJsxExpression(p)||ts.isTemplateSpan(p))console.log(f+':'+(ast.getLineAndCharacterOfPosition(n.getStart()).line+1)+' '+n.getText(ast));
 }ts.forEachChild(n,visit);}visit(ast);
}
