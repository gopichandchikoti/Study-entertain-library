import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseLessonExercises } from '../src/features/learning/lessonExerciseParser.js'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  base = path.join(root, 'study-content')
type Manifest = { folder: string; blueprint: string; markdown: string[]; diagrams: string[]; lessons: string[] }
const courses = JSON.parse(await readFile(path.join(root, 'course-authoring/course-manifest.json'), 'utf8')) as Manifest[]
const failures: string[] = [],
  exerciseIds = new Set<string>()
let markdownCount = 0,
  diagramCount = 0,
  lessons = 0,
  questions = 0
for (const course of courses) {
  for (const name of course.markdown) {
    const rel = course.folder + '/' + name,
      text = await readFile(path.join(base, rel), 'utf8').catch(() => null)
    if (text === null) {
      failures.push('Missing: ' + rel)
      continue
    }
    markdownCount++
    if (course.lessons.includes(rel)) {
      const parsed = parseLessonExercises(text)
      if (parsed.error || !parsed.quiz || !parsed.practical) failures.push(rel + ': ' + (parsed.error ?? 'Missing exercises'))
      else {
        if (exerciseIds.has(parsed.quiz.lessonId)) failures.push('Duplicate lesson ID: ' + parsed.quiz.lessonId)
        exerciseIds.add(parsed.quiz.lessonId)
        lessons++
        questions += parsed.quiz.questions.length
      }
      if (text.length < 4500 || !text.includes('mermaid') || !text.includes('images/') || !text.includes('{#failure-security}'))
        failures.push(rel + ': incomplete lesson recipe')
    }
    let fence: { char: string; size: number } | null = null
    for (const line of text.split(/\r?\n/)) {
      const marker = line.match(/^ {0,3}(\x60{3,}|~{3,})(.*)$/)
      if (fence) {
        if (marker && marker[1][0] === fence.char && marker[1].length >= fence.size && !marker[2].trim()) fence = null
        continue
      }
      if (marker) {
        fence = { char: marker[1][0], size: marker[1].length }
        continue
      }
      for (const match of line.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
        const href = match[1].split('#')[0]
        if (!href || /^(?:https?:|mailto:)/.test(href)) continue
        const target = path.resolve(path.dirname(path.join(base, rel)), decodeURIComponent(href))
        if (!target.startsWith(base + path.sep) || !(await stat(target).catch(() => null)))
          failures.push(rel + ': broken link ' + href)
      }
    }
    if (fence) failures.push(rel + ': unbalanced fence')
  }
  const readme = await readFile(path.join(base, course.folder, 'README.md'), 'utf8')
  if ((readme.match(/^\| [A-Z] \|/gm) ?? []).length !== 26) failures.push(course.folder + ': A-to-Z coverage is incomplete')
  for (const image of course.diagrams) {
    const text = await readFile(path.join(base, course.folder, 'images', image), 'utf8').catch(() => '')
    if (
      !text.includes('viewBox="0 0 1200 700"') ||
      !text.includes('<title') ||
      !text.includes('<marker') ||
      /<script|<foreignObject|https?:\/\//.test(text.replace('http://www.w3.org/2000/svg', ''))
    )
      failures.push(course.folder + ': invalid local SVG ' + image)
    else diagramCount++
  }
}
console.log(JSON.stringify({ courses: courses.length, markdownCount, diagramCount, lessons, questions, failures }, null, 2))
if (failures.length) process.exitCode = 1
