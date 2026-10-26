const fs=require('node:fs'),cp=require('node:child_process');
const manifest=JSON.parse(fs.readFileSync('course-authoring/course-manifest.json','utf8'));
for(const course of manifest)console.log(course.folder,Object.fromEntries(Object.entries(course).map(([k,v])=>[k,Array.isArray(v)?v.length:typeof v])));
const untracked=cp.execFileSync('git',['ls-files','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const allowedDirs=['src/','server/','api/','android/','scripts/','tests/','public/','supabase/','course-authoring/','course-blueprints/','.github/','.codex/agents/'];
const allowedRoot=new Set(['README.md','AGENTS.md','.env.example','.gitignore','.oxlintrc.json','.vscode/mcp.json','index.html','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','render.yaml','tsconfig.app.json','tsconfig.json','tsconfig.server.json','webpack.config.mjs','ADDING_CONTENT.md','APP_DOCUMENTATION.md','AUTH_SETUP.md','AUTH_VALIDATION.md','BUG_FIX_VALIDATION.md','DEPLOYMENT_GUIDE.md','FEATURE_LOG.md','LEARNING_VALIDATION.md','MARKDOWN_VALIDATION.md','OPERATIONS.md','WARNING_FIX_VALIDATION.md','system_design.md']);
const courses=new Set(['study-content/README.md','study-content/Python First API/README.md']);
for(const c of manifest){for(const name of c.markdown)courses.add(`study-content/${c.folder}/${name}`);for(const name of c.diagrams)courses.add(`study-content/${c.folder}/images/${name}`);}
const selected=untracked.filter(f=>allowedRoot.has(f)||allowedDirs.some(d=>f.startsWith(d))||courses.has(f)||manifest.some(c=>f.startsWith(`study-content/${c.folder}/examples/`)));
selected.push('README.md');
const sensitive=/(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-proj-|ghp_|github_pat_|sb_secret_)[A-Za-z0-9_-]{16,})/;
for(const f of selected){const buf=fs.readFileSync(f);if(buf.length>5_000_000)throw new Error('Large staged candidate: '+f);if(sensitive.test(buf.toString('utf8')))throw new Error('Potential secret in '+f);}
console.log('Selected',selected.length,'files');
console.log('Left untracked:',untracked.filter(f=>!selected.includes(f)).join('\n'));
if(process.argv.includes('--stage'))for(let start=0;start<selected.length;start+=50)cp.execFileSync('git',['add','--',...selected.slice(start,start+50)],{stdio:['ignore','pipe','pipe']});
