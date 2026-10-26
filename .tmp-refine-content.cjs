const fs=require('node:fs');
const model=JSON.parse(fs.readFileSync('src/content.model.json','utf8'));
function edit(file,from,to){let s=fs.readFileSync(file,'utf8');if(!s.includes(from))return;fs.writeFileSync(file,s.replaceAll(from,to));}
delete model.app.standard; edit('src/App.tsx','readingScale === copy.app.standard',"readingScale === 'standard'");
delete model.lessonStepper.assignment2; edit('src/features/learning/LessonStepper.tsx','s.id === copy.lessonStepper.assignment2',"s.id === 'assignment'");
delete model.markdownPreview; edit('src/features/markdown/MarkdownPreview.tsx',"import { content as copy } from '../../content.js'\n",'');edit('src/features/markdown/MarkdownPreview.tsx','copy.markdownPreview.noopenerNoreferrer',"'noopener noreferrer'");
delete model.settingsView.studyLibraryAccountJson; edit('src/features/auth/SettingsView.tsx','copy.settingsView.studyLibraryAccountJson',"'study-library-account.json'");
model.settingsView.verified='verified';edit('src/features/auth/SettingsView.tsx',"user.emailVerified?'verified':",'user.emailVerified?copy.settingsView.verified:');
model.common={ light:'light', dark:'dark', note:'NOTE', text:'TEXT', library:'Library', bytes:'{value0} B', kilobytes:'{value0} KB', megabytes:'{value0} MB', fileCount:{one:'{count} file',other:'{count} files'},noteCount:{one:'{count} note',other:'{count} notes'} };
for(const f of ['src/App.tsx','src/features/guest/GuestView.tsx','src/features/markdown/SplitEditor.tsx'])edit(f,"value0: theme === 'dark' ? 'light' : 'dark'","value0: theme === 'dark' ? copy.common.light : copy.common.dark");
edit('src/App.tsx',"selectedFile.previewKind === 'markdown' ? 'NOTE' : 'TEXT'","selectedFile.previewKind === 'markdown' ? copy.common.note : copy.common.text");
edit('src/App.tsx',"const formatCount = (value: number, label: string): string => `${value} ${label}${value === 1 ? '' : 's'}`",`const formatCount = (value: number, label: 'note' | 'file'): string => {
  const forms = label === 'note' ? copy.common.noteCount : copy.common.fileCount
  const category = new Intl.PluralRules(copy.locale).select(value)
  return formatContent(category === 'one' ? forms.one : forms.other, { count: value.toLocaleString(copy.locale) })
}`);
model.practicalPanel.running='Running…';edit('src/features/learning/PracticalPanel.tsx',"'Running…'",'copy.practicalPanel.running');
model.testResults.summary='{passed} passed, {failed} failed';
model.testResults.status={queued:'queued',running:'running',completed:'completed',cancelled:'cancelled',unavailable:'unavailable',failed:'failed',passed:'passed',blocked:'blocked'};
edit('src/features/learning/TestResults.tsx','content as copy }','content as copy, formatContent }');
edit('src/features/learning/TestResults.tsx',"run.summary.passed + ' passed, ' + run.summary.failed + ' failed' : run.status",'formatContent(copy.testResults.summary, { passed: run.summary.passed, failed: run.summary.failed }) : copy.testResults.status[run.status]');
edit('src/features/learning/TestResults.tsx','{test.status}','{copy.testResults.status[test.status]}');
model.diagramModel.flowchart='Flowchart: ';model.diagramModel.then=', then ';
edit('src/features/diagrams/diagramModel.ts',"'Flowchart: '",'copy.diagramModel.flowchart');edit('src/features/diagrams/diagramModel.ts',".join(', then ')",'.join(copy.diagramModel.then)');
edit('src/features/watch/WatchView.tsx',"?? 'Library'",'?? copy.common.library');
const section='#### Section {number}\n\nMarkdown is plain text that turns into formatted documents. This paragraph only exists to make the sample long enough to scroll, so you can try the scroll sync button.';
model.sampleMarkdown.section=section;
fs.writeFileSync('src/features/markdown/sampleMarkdown.ts',`import { content as copy, formatContent } from '../../content.js'
export const sampleMarkdown = formatContent(copy.sampleMarkdown.welcomeToTheMarkdownPreviewTypeOnTheLeftAnd, {
  value0: Array.from({ length: 6 }, (_, index) => formatContent(copy.sampleMarkdown.section, { number: index + 1 })).join('\\n\\n'),
})
`);
fs.writeFileSync('src/features/markdown/untitled.ts',`import { content as copy, formatContent } from '../../content.js'

// Compare generated names rather than parsing an English-specific prefix.
export const nextUntitledName = (names: string[]): string => {
  const used = new Set(names.map(name => name.trim().toLocaleLowerCase(copy.locale)))
  let number = 1
  let candidate = formatContent(copy.untitled.untitledValue, { value0: number })
  while (used.has(candidate.toLocaleLowerCase(copy.locale))) {
    candidate = formatContent(copy.untitled.untitledValue, { value0: ++number })
  }
  return candidate
}
`);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);}
for(const f of walk('src').filter(f=>/\.tsx?$/.test(f)&&!f.endsWith('content.ts'))){let s=fs.readFileSync(f,'utf8');if(s.includes('content as copy')){s=s.replace(/\.toLocaleDateString\(\)/g,'.toLocaleDateString(copy.locale)').replace(/\.toLocaleString\(\)/g,'.toLocaleString(copy.locale)').replace(/\.toLocaleString\(undefined,/g,'.toLocaleString(copy.locale,');fs.writeFileSync(f,s);}}
fs.writeFileSync('src/content.model.json',JSON.stringify(model,null,2)+'\n');
