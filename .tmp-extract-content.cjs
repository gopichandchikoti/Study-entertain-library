const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const model = { locale: 'en', direction: 'ltr', document: { title: 'Second brain | Study library', description: 'A calm local library for learning from your markdown notes and diagrams.' } };
const visibleAttrs = new Set(['title', 'placeholder', 'alt', 'aria-label', 'aria-description', 'aria-valuetext', 'label']);
const walkFiles = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walkFiles(path.join(dir,e.name)) : /\.tsx?$/.test(e.name) && !e.name.endsWith('.d.ts') ? [path.join(dir,e.name)] : []);
function jsxText(text) {
  const lines = text.split(/\r\n|\n|\r/); let last = 0;
  lines.forEach((l,i) => { if (/[^ \t]/.test(l)) last=i; });
  return lines.map((l,i) => { let s=l.replace(/\t/g,' '); if(i) s=s.replace(/^ +/,''); if(i!==lines.length-1) s=s.replace(/ +$/,''); return s && i!==last ? s+' ' : s; }).join('');
}
for (const file of walkFiles('src')) {
  const source=fs.readFileSync(file,'utf8'), ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
  const section=path.basename(file).replace(/\.tsx?$/,'').replace(/^./,s=>s.toLowerCase());
  const entries={}, edits=[]; let usesFormat=false;
  function ref(value) {
    const existing=Object.keys(entries).find(k=>entries[k]===value); if(existing) return `content.${section}.${existing}`;
    let base=value.replace(/\{value\d+\}/g,' value ').replace(/[^a-zA-Z0-9]+/g,' ').trim().split(/\s+/).slice(0,10).map((w,i)=>i?w[0].toUpperCase()+w.slice(1).toLowerCase():w.toLowerCase()).join('') || 'text';
    if (/^\d/.test(base)) base='text'+base;
    let key=base,n=2; while(key in entries) key=base+n++;
    entries[key]=value; return `content.${section}.${key}`;
  }
  function visit(node) {
    const p=node.parent;
    if(ts.isJsxText(node)) { const value=jsxText(node.text); if(value.trim()) edits.push([node.pos,node.end,'{'+ref(value)+'}']); return; }
    if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)||ts.isTemplateExpression(node)) {
      if(ts.isLiteralTypeNode(p)||ts.isImportDeclaration(p)||ts.isExportDeclaration(p)||ts.isImportSpecifier(p)) return;
      const attr=ts.isJsxAttribute(p)?p.name.getText(ast):null;
      let ancestor=p; while(ancestor && !ts.isJsxAttribute(ancestor) && !ts.isStatement(ancestor)) ancestor=ancestor.parent;
      const outerAttr=ancestor&&ts.isJsxAttribute(ancestor)?ancestor.name.getText(ast):null;
      if ((attr && !visibleAttrs.has(attr)) || (outerAttr && !visibleAttrs.has(outerAttr))) { ts.forEachChild(node,visit); return; }
      if(ts.isPropertyAssignment(p)&&p.name===node) return;
      let value=ts.isTemplateExpression(node)?node.head.text+node.templateSpans.map((s,i)=>`{value${i}}`+s.literal.text).join(''):node.text;
      const prop=ts.isPropertyAssignment(p)?p.name.getText(ast):'';
      const field=ts.isCallExpression(p)&&p.expression.getText(ast)==='field'&&p.arguments[1]===node;
      const visible=Boolean(attr||outerAttr||field||/^(label|title|text|tag|description|heading|subtitle|message|error)$/.test(prop));
      const prose=/[a-zA-Z]{2,}[ .,;!?\n][a-zA-Z{]|[a-zA-Z]{2,}[.!?]$/.test(value) && !/^(?:https?:|\/|\.|image\/|text\/|application\/)/.test(value) && !/[{}][^]*[{}]/.test(value.replace(/\{value\d+\}/g,''));
      const short=ts.isConditionalExpression(p)&&/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/.test(value);
      if((visible||prose||short||file.endsWith('sampleMarkdown.ts'))&&value.trim()) {
        let replacement=ref(value);
        if(ts.isTemplateExpression(node)) { usesFormat=true; replacement=`formatContent(${replacement}, { ${node.templateSpans.map((s,i)=>`value${i}: ${s.expression.getText(ast)}`).join(', ')} })`; }
        if(attr) replacement='{'+replacement+'}';
        edits.push([node.getStart(ast),node.end,replacement]);
        if(ts.isTemplateExpression(node)) for(const span of node.templateSpans) { /* nested values are audited separately */ }
        return;
      }
    }
    ts.forEachChild(node,visit);
  }
  visit(ast);
  if(edits.length) {
    model[section]=entries;
    let updated=source; for(const [start,end,value] of edits.sort((a,b)=>b[0]-a[0])) updated=updated.slice(0,start)+value+updated.slice(end);
    let relative=path.relative(path.dirname(file),'src/content').replace(/\\/g,'/'); if(!relative.startsWith('.')) relative='./'+relative;
    updated=`import { content${usesFormat?', formatContent':''} } from '${relative}.js'\n`+updated;
    fs.writeFileSync(file,updated);
    console.log(file, Object.keys(entries).length);
  }
}
fs.writeFileSync('src/content.model.json',JSON.stringify(model,null,2)+'\n');
