const fs=require('node:fs');
const m=JSON.parse(fs.readFileSync('src/content.model.json','utf8'));
m.practicalPanel.runnerUnavailable='Runner unavailable for {language}. Reading and assignments remain available. Code execution requires a separately provisioned sandbox with no network, secrets, or host mounts.';
delete m.practicalPanel.runnerUnavailableFor;
let p='src/features/learning/PracticalPanel.tsx',s=fs.readFileSync(p,'utf8');s=s.replace('content as copy }','content as copy, formatContent }').replace("copy.practicalPanel.runnerUnavailableFor + challenge.language + '. Reading and assignments remain available. Code execution requires a separately provisioned sandbox with no network, secrets, or host mounts.'",'formatContent(copy.practicalPanel.runnerUnavailable, { language: challenge.language })');fs.writeFileSync(p,s);
p='src/features/watch/WatchView.tsx';s=fs.readFileSync(p,'utf8');s="import { formatSize } from '../../shared/format.js'\n"+s;s=s.replace('formatBytes(selectedFile.size)','formatSize(selectedFile.size)');s=s.slice(0,s.indexOf('\nconst formatBytes ='));fs.writeFileSync(p,s+'\n');
fs.writeFileSync('src/content.model.json',JSON.stringify(m,null,2)+'\n');
