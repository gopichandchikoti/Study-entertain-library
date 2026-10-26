import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// Plain-language lesson files: "=== 07" starts a lesson, "@@name optional-title" starts a section inside it.
const parsePlain = (text) => {
  const lessons = {},
    parts = text.split(/^=== (\S+)[^\S\n]*$/m)
  for (let i = 1; i < parts.length; i += 2) {
    const sections = {},
      bits = parts[i + 1].split(/^@@(\w+)[^\S\n]*(.*)$/m)
    for (let j = 1; j < bits.length; j += 3) sections[bits[j]] = { arg: bits[j + 1].trim(), body: bits[j + 2].trim() }
    lessons[parts[i]] = sections
  }
  return lessons
}
const wrapText = (text, max) => {
  const lines = []
  let line = ''
  for (const word of String(text).split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      lines.push(line)
      line = word
    } else line = (line + ' ' + word).trim()
  }
  if (line) lines.push(line)
  return lines
}
async function generateStudyCourses() {
  const path = await import('node:path')
  const base = path.resolve(root, 'study-content')
  const definitions = [
    ['FastAPI', '00-fastapi-course-blueprint.md', 'python-first-api'],
    ['Java', '00-java-course-blueprint.md', 'java'],
    ['Node.js', '00-nodejs-course-blueprint.md', 'nodejs'],
    ['Spring Boot', '00-spring-boot-course-blueprint.md', 'spring-boot'],
    ['API designs', '16-api-design-course-blueprint.md', 'api-design'],
    ['System Design', '20-system-design-course-blueprint.md', 'system-design'],
    ['MCP servers', '22-mcp-course-blueprint.md', 'mcp'],
  ]
  const topics = JSON.parse(await fs.readFile(root + '/course-authoring/topics.json', 'utf8'))
  const mappings = JSON.parse(await fs.readFile(root + '/course-authoring/mappings.json', 'utf8'))
  const sources = JSON.parse(await fs.readFile(root + '/course-authoring/sources.json', 'utf8'))
  const supplements = JSON.parse(await fs.readFile(root + '/course-authoring/supplements.json', 'utf8'))
  const codingTasks = JSON.parse(await fs.readFile(root + '/course-authoring/coding-tasks.json', 'utf8'))
  const registry = [],
    courses = [],
    bq = String.fromCharCode(96),
    fence = bq.repeat(3)
  const write = async (rel, text) => {
    const dest = path.join(base, rel)
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, text, 'utf8')
  }
  const link = (p) => encodeURI(p).replace(/#/g, '%23')
  const titleOf = (p) =>
    p
      .replace(/\.md$/, '')
      .replace(/^\d{2}[a-z]?-/, '')
      .replaceAll('-', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  const escape = (t) =>
    String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
  const diagramLabels = (pic) =>
    pic
      .replace(/^(a |complete )/i, '')
      .replace(/ and /g, ', ')
      .split(/,\s*/)
      .map((s) => s.replace(/\|/g, '').trim())
      .filter(Boolean)
      .slice(0, 12)
  const mermaid = (labels) =>
    [
      fence + 'mermaid',
      'flowchart LR',
      ...labels.map((l, i) => '    N' + i + '["' + l.replaceAll('"', "'") + '"]'),
      ...labels.slice(1).map((_, i) => '    N' + i + ' --> N' + (i + 1)),
      fence,
    ].join('\n')
  const svg = (name, picture) => {
    const labels = diagramLabels(picture),
      title = titleOf(name.replace('.svg', '.md'))
    const nodes = labels
      .map((label, i) => {
        const col = i % 4,
          row = Math.floor(i / 4),
          x = 40 + col * 290,
          y = 115 + row * 165
        const words = label.split(' '),
          lines = []
        let line = ''
        for (const word of words) {
          if ((line + ' ' + word).trim().length > 20) {
            lines.push(line)
            line = word
          } else line = (line + ' ' + word).trim()
        }
        if (line) lines.push(line)
        return (
          '<g><rect x="' +
          x +
          '" y="' +
          y +
          '" width="250" height="120" rx="10" fill="#fffdf8" stroke="' +
          (/error|deni|failure|cancel|warning/i.test(label) ? '#b34f2e' : '#1e6b68') +
          '" stroke-width="3"/><text x="' +
          (x + 125) +
          '" y="' +
          (y + 32) +
          '" text-anchor="middle" font-size="21" fill="#1d2523">' +
          lines
            .map((t, j) => '<tspan x="' + (x + 125) + '" dy="' + (j === 0 ? '0' : '26') + '">' + escape(t) + '</tspan>')
            .join('') +
          '</text></g>'
        )
      })
      .join('')
    const arrows = labels
      .slice(1)
      .map((_, i) => {
        const col = i % 4,
          row = Math.floor(i / 4),
          x = 40 + col * 290,
          y = 115 + row * 165
        return col < 3
          ? '<path d="M ' +
              (x + 250) +
              ' ' +
              (y + 60) +
              ' H ' +
              (x + 282) +
              '" stroke="#1e6b68" stroke-width="3" marker-end="url(#arrow)" fill="none"/>'
          : '<path d="M ' +
              (x + 125) +
              ' ' +
              (y + 120) +
              ' V ' +
              (y + 142) +
              ' H 22 V ' +
              (y + 200) +
              ' H 32" stroke="#1e6b68" stroke-width="3" marker-end="url(#arrow)" fill="none"/>'
      })
      .join('')
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-labelledby="title desc"><title id="title">' +
      escape(title) +
      '</title><desc id="desc">' +
      escape(picture) +
      '</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#1e6b68"/></marker></defs><rect width="1200" height="700" fill="#f4f0e7"/><text x="40" y="55" font-family="sans-serif" font-size="28" fill="#1d2523">' +
      escape(title) +
      '</text><g font-family="sans-serif">' +
      arrows +
      nodes +
      '</g><text x="40" y="670" font-family="sans-serif" font-size="19" fill="#1d2523">Legend: teal = normal flow · coral = error or trust check · arrows = messages or decisions</text></svg>\n'
    )
  }
  // Hand-drawn diagram specs: cards with a short label and a one-line plain explanation, optional third item 'warn' for problem steps.
  const diagramSpecs = {}
  for (const name of (await fs.readdir(root + '/course-authoring')).filter((n) => /^diagrams(\..+)?\.json$/.test(n)).sort())
    Object.assign(diagramSpecs, JSON.parse(await fs.readFile(root + '/course-authoring/' + name, 'utf8')))
  const richSvg = (name, spec) => {
    const steps = spec.steps.slice(0, 8),
      cardW = 255,
      cardH = 200
    const pos = (i) => ({ col: i % 4, row: Math.floor(i / 4), x: 40 + (i % 4) * 290, y: 95 + Math.floor(i / 4) * 255 })
    const color = (s) => (s[2] === 'warn' ? '#b34f2e' : '#1e6b68')
    const cards = steps
      .map((s, i) => {
        const { x, y } = pos(i),
          labelLines = wrapText(s[0], 17).slice(0, 2),
          noteLines = wrapText(s[1], 25).slice(0, 5),
          noteY = y + 64 + labelLines.length * 26
        return (
          '<g><rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          cardW +
          '" height="' +
          cardH +
          '" rx="14" fill="#fffdf8" stroke="' +
          color(s) +
          '" stroke-width="3"/><circle cx="' +
          (x + 30) +
          '" cy="' +
          (y + 30) +
          '" r="16" fill="' +
          color(s) +
          '"/><text x="' +
          (x + 30) +
          '" y="' +
          (y + 36) +
          '" text-anchor="middle" font-size="18" font-weight="700" fill="#ffffff">' +
          (i + 1) +
          '</text><text x="' +
          (x + 56) +
          '" y="' +
          (y + 36) +
          '" font-size="22" font-weight="700" fill="#1d2523">' +
          labelLines
            .map((t, j) => '<tspan x="' + (x + 56) + '" dy="' + (j === 0 ? '0' : '26') + '">' + escape(t) + '</tspan>')
            .join('') +
          '</text><text x="' +
          (x + 18) +
          '" y="' +
          noteY +
          '" font-size="17" fill="#3b4744">' +
          noteLines
            .map((t, j) => '<tspan x="' + (x + 18) + '" dy="' + (j === 0 ? '0' : '22') + '">' + escape(t) + '</tspan>')
            .join('') +
          '</text></g>'
        )
      })
      .join('')
    const arrows = steps
      .slice(1)
      .map((_, i) => {
        const { col, x, y } = pos(i),
          n = pos(i + 1)
        return col < 3
          ? '<path d="M ' +
              (x + cardW) +
              ' ' +
              (y + cardH / 2) +
              ' H ' +
              (x + 286) +
              '" stroke="#1e6b68" stroke-width="3" marker-end="url(#arrow)" fill="none"/>'
          : '<path d="M ' +
              (x + cardW / 2) +
              ' ' +
              (y + cardH) +
              ' V ' +
              (y + cardH + 26) +
              ' H 22 V ' +
              (n.y + cardH / 2) +
              ' H 36" stroke="#1e6b68" stroke-width="3" marker-end="url(#arrow)" fill="none"/>'
      })
      .join('')
    const captionLines = wrapText(spec.caption, 120).slice(0, 2)
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-labelledby="title desc"><title id="title">' +
      escape(spec.title) +
      '</title><desc id="desc">' +
      escape(spec.caption) +
      '</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#1e6b68"/></marker></defs><rect width="1200" height="700" fill="#f4f0e7"/><text x="40" y="55" font-family="sans-serif" font-size="30" font-weight="700" fill="#1d2523">' +
      escape(spec.title) +
      '</text><g font-family="sans-serif">' +
      arrows +
      cards +
      '</g><text font-family="sans-serif" font-size="20" fill="#1d2523">' +
      captionLines.map((t, j) => '<tspan x="40" y="' + (625 + j * 28) + '">' + escape(t) + '</tspan>').join('') +
      '</text></svg>\n'
    )
  }
  for (const [folder, bp, slug] of definitions) {
    const plainDir = root + '/course-authoring/plain',
      plainNames = (await fs.readdir(plainDir)).filter((n) => n.startsWith(slug + '.') && n.endsWith('.md')).sort(),
      plainAll = {}
    for (const name of plainNames)
      Object.assign(plainAll, parsePlain((await fs.readFile(plainDir + '/' + name, 'utf8')).replace(/^﻿/, '')))
    const extras = Object.entries(plainAll)
      .filter(([, s]) => s.meta)
      .map(([prefix, s]) => ({ prefix, ...JSON.parse(s.meta.body) }))
    const body = await fs.readFile(root + '/course-blueprints/' + bp, 'utf8'),
      contractAt = body.search(/^## .*Fresh.machine generation contract/m),
      contract = body.slice(contractAt)
    const tree = contract.match(/\x60{3}text\n([\s\S]*?)\x60{3}/g).find((s) => s.includes(folder + '/'))
    const files = [...tree.matchAll(/(?:\|--|\x60--|\+--) ([^\n]+\.md)/g)].map((m) => m[1])
    for (const extra of extras) {
      const at = files.indexOf(extra.after)
      files.splice(at < 0 ? files.length : at + 1, 0, extra.file)
    }
    const diagrams = [...contract.matchAll(/^\| \x60([^\x60]+\.svg)\x60 \| (.*?) \| (.*?) \|$/gm)].map((m) => ({
      name: m[1],
      picture: m[2],
      lessons: m[3],
    }))
    for (const extra of extras)
      for (const name of extra.diagrams ?? [])
        diagrams.push({ name, picture: diagramSpecs[name].caption, lessons: '`' + extra.prefix + '`' })
    const scopes = Object.fromEntries(
      [...contract.matchAll(/^\| \x60([^\x60]+\.md)\x60 \| (.*?) \|$/gm)].map((m) => [m[1], m[2]]),
    )
    const sourceSections = [...body.slice(0, contractAt).matchAll(/^## (.*)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map((m) => ({
      title: m[1],
      body: m[2],
    }))
    await fs.mkdir(base + '/' + folder + '/images', { recursive: true })
    await write(folder + '/' + bp, body)
    for (const d of diagrams)
      await write(
        folder + '/images/' + d.name,
        diagramSpecs[d.name] ? richSvg(d.name, diagramSpecs[d.name]) : svg(d.name, d.picture),
      )
    const lessons = files.filter((f) => f !== 'README.md' && f !== bp),
      lessonPaths = []
    for (let index = 0; index < lessons.length; index++) {
      const file = lessons[index],
        prefix = file.split('-')[0],
        numeric = Number(prefix),
        key = Number.isFinite(numeric) ? numeric : prefix
      const extra = extras.find((e) => e.file === file),
        plain = plainAll[prefix] ?? {}
      const map = mappings[folder],
        topicKey = map.topics[key] ?? 'learning',
        topic = extra
          ? {
              key: prefix,
              analogy: extra.reason,
              reason: extra.reason,
              terms: extra.terms,
              facts: extra.facts,
              scenario: extra.scenario,
              choices: extra.choices,
              expected: extra.expected,
            }
          : topics[topicKey],
        sectionIndices = map.sources[key] ?? [0]
      let sections = extra ? [] : sectionIndices.map((i) => sourceSections[i]).filter(Boolean)
      if (folder === 'API designs' && ['03', '04'].includes(prefix)) {
        const javaBody = await fs.readFile(root + '/course-blueprints/00-java-course-blueprint.md', 'utf8')
        const javaSections = [
          ...javaBody.slice(0, javaBody.search(/^## .*Fresh.machine/m)).matchAll(/^## (.*)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm),
        ].map((m) => ({ title: m[1], body: m[2] }))
        sections = (prefix === '03' ? [5, 6, 7, 8] : [9, 10, 11, 12, 13, 15, 16]).map((i) => javaSections[i])
      }
      if (folder === 'API designs' && prefix === '05') {
        const springBody = await fs.readFile(root + '/course-blueprints/00-spring-boot-course-blueprint.md', 'utf8')
        sections = [
          ...springBody
            .slice(0, springBody.search(/^## .*Fresh.machine/m))
            .matchAll(/^## (.*)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm),
        ]
          .map((m) => ({ title: m[1], body: m[2] }))
          .filter((_, i) => [5, 6, 7, 8, 13].includes(i))
      }
      const supplement = supplements[slug + '/' + prefix]
      const title = titleOf(file),
        lessonId = slug + '/' + file.replace(/\.md$/, '').toLowerCase(),
        terms = Object.entries(topic.terms)
      const related = diagrams.filter(
        (d) => d.lessons.includes(bq + prefix + bq) || d.lessons.includes(bq + file.replace(/\.md$/, '') + bq),
      )
      if (!related.length) related.push(diagrams[0])
      const scope = extra?.scope ?? scopes[file] ?? 'Explain the course vocabulary, prerequisites, and recall workflow.'
      const questions = Array.from({ length: 5 }, (_, i) => {
        const correctIndex = (index + i) % 4,
          term = terms[i % terms.length]
        const prompt =
          i === 0
            ? 'In ' + title + ', what does ' + term[0] + ' mean?'
            : i === 4
              ? topic.scenario
              : 'In ' + title + ', which rule is correct for checkpoint ' + (i + 1) + '?'
        const correct = i === 0 ? term[1] : i === 4 ? topic.choices[0] : topic.facts[i]
        const wrong =
          i === 0
            ? [
                'A permission granted by a hidden browser control',
                'An unlimited provider operation with no ownership',
                'A diagnostic credential intended for public logs',
              ]
            : i === 4
              ? topic.choices.slice(1)
              : [
                  'Trust client-side checks instead of the server rule.',
                  'Hide the failure by returning a fabricated successful result.',
                  'Skip the stated boundary, limit, or ownership check.',
                ]
        let other = 0
        const options = Array.from({ length: 4 }, (_, j) => ({
          id: ['a', 'b', 'c', 'd'][j],
          text: j === correctIndex ? correct : wrong[other++],
          explanation:
            j === correctIndex
              ? 'This preserves the definition and boundary described in the lesson.'
              : 'This changes the declared meaning or bypasses the responsible boundary.',
        }))
        return {
          id: 'q' + (i + 1),
          sectionId: i === 4 ? 'worked-scenario' : 'concept-' + (i + 1),
          prompt,
          options,
          correctOptionId: options[correctIndex].id,
          explanation:
            i === 0 ? term[0] + ' means ' + term[1] + '.' : i === 4 ? topic.choices[0] + '. ' + topic.facts[4] : topic.facts[i],
          reviewLabel: 'Review ' + (i === 4 ? 'the worked scenario' : 'concept ' + (i + 1)),
        }
      })
      const quiz = { schemaVersion: 1, lessonId, title: 'Assignment: ' + title, passPercentage: 80, questions }
      const practical = {
        schemaVersion: 1,
        challengeId: lessonId + '/decision',
        lessonId,
        title: 'Practical: ' + title,
        language: 'json',
        mode: 'structured',
        instructions:
          topic.scenario +
          ' Return an object with decision (choose from ' +
          [topic.expected, 'skip-check', 'unbounded-work', 'trust-client'].join(', ') +
          '), justification (at least 40 characters; include ' +
          Object.keys(topic.terms).slice(0, 2).join(' and ') +
          '), and failureBehavior (at least 25 characters; include failure and recover while explaining the error and recovery). These are structured reasoning checks, not code execution or an official grade.',
        starterCode: JSON.stringify({ decision: '', justification: '', failureBehavior: '' }, null, 2),
        entryPoint: 'answer',
        publicExamples: [
          { input: { decision: 'skip-check', justification: '', failureBehavior: '' }, expected: { passed: false } },
          {
            input: {
              decision: topic.expected,
              justification:
                'The ' +
                Object.keys(topic.terms).slice(0, 2).join(' and ') +
                ' boundary must preserve the declared contract and ownership.',
              failureBehavior: 'Show a safe failure and recover through the responsible owner.',
            },
            expected: { passed: true },
          },
        ],
        publicTestIds: ['decision', 'explanation', 'failure-plan'],
        reviewSections: { decision: 'worked-scenario', explanation: 'concept-2', 'failure-plan': 'failure-security' },
        limits: { timeMs: 2000, memoryMb: 128, outputBytes: 20000 },
      }
      const codeTask = codingTasks[slug + '/' + prefix]
      if (codeTask) {
        const language =
          slug === 'java' || slug === 'spring-boot' ? 'java' : slug === 'python-first-api' ? 'python' : 'typescript'
        Object.assign(practical, {
          challengeId: lessonId + '/coding',
          title: 'Practical: ' + codeTask.title,
          language,
          mode: 'function',
          instructions:
            codeTask.instructions +
            ' A disposable isolated code runner is required; this installation never executes learner code on the host.',
          starterCode: codeTask.starters[language],
          entryPoint: codeTask.entryPoint,
          publicExamples: codeTask.examples,
          publicTestIds: codeTask.testIds,
          reviewSections: Object.fromEntries(codeTask.testIds.map((id) => [id, codeTask.review])),
        })
      }
      registry.push({
        challenge: practical,
        tests: [
          { id: 'decision', field: 'decision', equals: topic.expected, sectionId: 'worked-scenario' },
          {
            id: 'explanation',
            field: 'justification',
            minLength: 40,
            includesWords: Object.keys(topic.terms).slice(0, 2),
            sectionId: 'concept-2',
          },
          {
            id: 'failure-plan',
            field: 'failureBehavior',
            minLength: 25,
            includesWords: ['failure', 'recover'],
            sectionId: 'failure-security',
          },
        ],
      })
      const narrative = [
        '# ' + title,
        '## The big idea in plain words {#picture}',
        plain.picture?.body ?? topic.analogy,
        ...(plain.diagram ? [fence + 'mermaid\n' + plain.diagram.body + '\n' + fence] : []),
        '## What you will be able to do {#outcomes}',
        plain.goal
          ? 'By the end of this lesson you will be able to:\n\n' + plain.goal.body
          : 'Read this after the previous numbered lesson. Use synthetic notes and local exercise data. By the end you should explain the following scope without copying:\n\n' +
            scope,
        '## Words to know {#vocabulary}',
        ...(plain.words ? [plain.words.body] : terms.map(([term, meaning]) => '- **' + term + '**: ' + meaning + '.')),
        '## Why this idea exists {#history}',
        plain.why?.body ?? topic.reason,
        ...topic.facts.slice(0, 4).flatMap((fact, i) => {
          const c = plain['c' + (i + 1)]
          return c
            ? ['## Concept ' + (i + 1) + ': ' + c.arg + ' {#concept-' + (i + 1) + '}', c.body]
            : [
                '## Concept ' + (i + 1) + ' {#concept-' + (i + 1) + '}',
                i === 0 ? terms[0][0] + ' means ' + terms[0][1] + '. ' + fact : fact,
                'Apply this rule to the Study Notes boundary before choosing syntax. Name the input, owner, and observable result. The scenario below gives a concrete decision to check.',
              ]
        }),
        ...(plain.example ? ['## ' + (plain.example.arg || 'An everyday example') + ' {#example}', plain.example.body] : []),
        '## Going deeper: the technical walkthrough {#walkthrough}',
        ...sections.flatMap((s) => [
          '### ' + s.title.replace(/^\d+\. /, ''),
          s.body.replace(/^## /gm, '### ').replace(/localhost:8080|localhost:3000/g, 'localhost:8000'),
        ]),
        ...(supplement
          ? [
              '### Focused implementation',
              supplement.text,
              fence + supplement.language,
              supplement.code,
              fence,
              'Read the imports, then the values and checks, then the operation, and finally the result or cleanup. Java Example programs compile as Example.java. Python uses Python 3.11+. JavaScript ESM runs as example.mjs. Framework snippets run inside the generated project.',
            ]
          : []),
        '## Worked scenario {#worked-scenario}',
        topic.scenario,
        'The justified choice is **' +
          topic.choices[0] +
          '**. Select **' +
          topic.expected +
          '** in the structured practical and explain why. Alternatives ignore a requirement, cross a trust boundary, or invent success.',
        '### Structured decision contract',
        fence + 'json',
        JSON.stringify(
          {
            decision: topic.expected,
            justification:
              'The ' +
              Object.keys(topic.terms).slice(0, 2).join(' and ') +
              ' boundary must preserve the declared contract and ownership.',
            failureBehavior: 'Expose a safe failure and recover through the boundary owner.',
          },
          null,
          2,
        ),
        fence,
        'Decision selects one declared behavior. Justification explains the boundary. FailureBehavior explains the observable error and recovery owner. These fields never execute commands. Required terms and minimum lengths form a basic practice rubric, not semantic grading.',
        '## Step-by-step flow and matching picture {#flow}',
        ...related.flatMap((d) => [
          mermaid(diagramSpecs[d.name] ? diagramSpecs[d.name].steps.map((s) => s[0]) : diagramLabels(d.picture)),
          '![' + d.picture + '](' + link('images/' + d.name) + ')',
        ]),
        '## Three real-life uses {#use-cases}',
        plain.use?.body ??
          '1. A personal learner applies this rule to one synthetic note and checks the result.\n2. A team changes the boundary while preserving its shared request and response contract.\n3. A deployed library handles concurrent requests and reports failures through safe errors and correlated signals.',
        '## What can go wrong, and how to stay safe {#failure-security}',
        ...(plain.wrong
          ? [plain.wrong.body]
          : [
              topic.facts[4] +
                ' An external dependency needs an owner, size limit, deadline, cleanup, and recovery path. Return a stable error code rather than raw exceptions. Redact credentials and private bodies in diagnostics.',
              'The abstraction improves ' +
                Object.keys(topic.terms)[0] +
                ' reasoning but adds configuration and lifecycle work. Keep a simpler implementation when it meets the requirement. Measure the limiting resource before adding services, queues, or caches.',
            ]),
        '## Practice lab and expected observation {#practice}',
        ...(codeTask
          ? [
              codeTask.instructions,
              'The language starter and public examples appear in Practical. Run is unavailable until a trusted isolated worker is configured. Reading and assignment review still work; this lesson does not claim code-test completion.',
            ]
          : []),
        '1. Predict the scenario decision before opening Practical. Explain each rejected alternative.\n2. Run a relevant example above in an isolated exercise project. Record the expected result, then change one input to an invalid or boundary value. A failed assertion or deliberate error should replace silent success.\n3. Submit the structured decision. Initially the checks fail. After selecting ' +
          topic.expected +
          ' and writing an explanation and failure plan, all three pass. Follow the indicated review section for missed checks.',
        '### Broken example to debug',
        fence + 'json',
        '{"decision":"trust-client","justification":"","failureBehavior":""}',
        fence,
        'This ignores the responsible boundary and gives no reasoning or recovery. Correct the fields rather than changing the validator.',
        '## Checkpoint and definition of done {#checkpoint}',
        '- [ ] Define ' +
          terms[0][0] +
          ' and ' +
          terms[1][0] +
          ' without looking.\n- [ ] Trace input to owner and output.\n- [ ] Explain one failure and one alternative.\n- [ ] Pass at least four assignment questions.\n- [ ] Pass every practical check and submit.\n- [ ] Explain the concept again tomorrow.',
        '## Sources, versions, and safe commands {#sources}',
        sources[folder][0] +
          '. Review date: 2026-10-02. The supplied blueprint is the teaching source; official landing pages were checked where reachable. No provider or original TM Schedule deployment was tested.',
        ...sources[folder].slice(1).map((url) => '- [Official reference](' + url + ')'),
        '[Course reading order](README.md)' +
          (index > 0 ? ' · [Previous lesson](' + link(lessons[index - 1]) + ')' : '') +
          (index + 1 < lessons.length ? ' · [Next lesson](' + link(lessons[index + 1]) + ')' : ''),
        fence + 'study-quiz',
        JSON.stringify(quiz, null, 2),
        fence,
        fence + 'study-practical',
        JSON.stringify(practical, null, 2),
        fence,
        '',
      ]
      if (file.includes('glossary'))
        narrative.splice(
          narrative.indexOf('## Going deeper: the technical walkthrough {#walkthrough}') + 1,
          0,
          ...Object.values(topics).flatMap((t) =>
            Object.entries(t.terms).map(([term, def]) => '- **' + term + '**: ' + def + '.'),
          ),
        )
      if (file === 'INDEX-READING-CHECKLIST.md')
        narrative.splice(
          2,
          0,
          lessons.map((p) => '- [ ] [' + titleOf(p) + '](' + link(p) + ')').join('\n'),
          'Review after one day, one week, and one month. Explain the rule before rerunning the example.',
        )
      if (file.includes('TM-SCHEDULE') || file.includes('tm-schedule'))
        narrative.splice(
          2,
          0,
          '**Case-study provenance:** the original TM Schedule source and endpoint contract were not supplied. These are illustrative schedule flows with synthetic data, not a verified inventory of that private application.',
        )
      await write(folder + '/' + file, narrative.join('\n\n'))
      lessonPaths.push(folder + '/' + file)
    }
    const alphabet = sourceSections.find((s) => s.title.includes('A-to-Z'))
    const glossaryMap = (alphabet?.body ?? '').replace(/^\| ([A-Z]) \| (.*?) \| (.*?) \|$/gm, (_, letter, concept, question) => {
      const words = concept
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3)
      const best = lessons
        .map((file) => ({
          file,
          score: words.filter((w) => (file + ' ' + (scopes[file] ?? '')).toLowerCase().includes(w)).length,
        }))
        .sort((a, b) => b.score - a.score)[0].file
      return '| ' + letter + ' | ' + concept + ' | ' + question + ' [' + titleOf(best) + '](' + link(best) + ') |'
    })
    await write(
      folder + '/README.md',
      [
        '# ' + folder + ': course reading order',
        'A portable beginner course with examples, failure cases, diagrams, recall questions, and structured practical exercises.',
        '## How to study',
        'Read one lesson, predict its result, try the example, mark it read, answer five questions, and review mistakes. Pass at least 80%, then complete the structured practical. Scores stay in this browser; they are not official grades.',
        '## Prerequisites',
        sourceSections.find((s) => /Audience/.test(s.title))?.body ??
          'Basic terminal and JSON familiarity. Use synthetic data and an isolated exercise project.',
        '## Reading order',
        lessons.map((file, i) => i + 1 + '. [' + titleOf(file) + '](' + link(file) + ')').join('\n'),
        '## A-to-Z coverage map',
        glossaryMap,
        '## Diagram library',
        diagrams.map((d) => '- [' + d.picture + '](' + link('images/' + d.name) + ')').join('\n'),
        '## Sources and version record',
        sources[folder][0] +
          '. Checked on 2026-10-02. Examples need their declared runtime and dependencies. Original TM Schedule source is unavailable; capacity figures are assumptions.',
        ...sources[folder].slice(1).map((url) => '- [Official reference](' + url + ')'),
        '## Portable specification',
        '[Generation blueprint](' +
          link(bp) +
          ') · [Replication guide](../Study%20Material%20Replication/00-study-material-replication-guide.md)',
        '## Validate',
        'From the application directory run ' +
          bq +
          'pnpm courses:validate' +
          bq +
          ' and ' +
          bq +
          'pnpm test:learning' +
          bq +
          '. Execute code only in isolated exercise projects, never in the web process.',
        '',
      ].join('\n\n'),
    )
    courses.push({ folder, blueprint: bp, markdown: files, diagrams: diagrams.map((d) => d.name), lessons: lessonPaths })
  }
  await write(
    'Study Material Replication/00-study-material-replication-guide.md',
    await fs.readFile(root + '/course-blueprints/00-study-material-replication-guide.md', 'utf8'),
  )
  await write(
    'Python First API/README.md',
    '# Python First API\n\nThe supplied Python blueprint calls its exact generated course FastAPI. Follow [FastAPI reading order](../FastAPI/README.md). This index preserves the alternate name without duplicating lessons.\n',
  )
  await write(
    'Python First API/00-python-first-api-course.md',
    await fs.readFile(root + '/course-blueprints/00-fastapi-course-blueprint.md', 'utf8'),
  )
  await write(
    'README.md',
    '# Study courses\n\n' +
      courses.map((c) => '- [' + c.folder + '](' + link(c.folder + '/README.md') + ')').join('\n') +
      '\n\nStart with pnpm dev:local. Content stays separate from application source. Examples are synthetic educational code, not personal data.\n',
  )
  await fs.mkdir(root + '/server/learning', { recursive: true })
  await fs.writeFile(root + '/server/learning/course-registry.json', JSON.stringify(registry, null, 2) + '\n')
  await fs.writeFile(root + '/course-authoring/course-manifest.json', JSON.stringify(courses, null, 2) + '\n')
  console.log(
    JSON.stringify({
      courses: courses.length,
      markdownPaths: courses.reduce((n, c) => n + c.markdown.length, 0),
      svgPaths: courses.reduce((n, c) => n + c.diagrams.length, 0),
      lessons: registry.length,
    }),
  )
}
await generateStudyCourses()
