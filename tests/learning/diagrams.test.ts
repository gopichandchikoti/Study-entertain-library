import test from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { layoutFlowchart, layoutSequence, parseDiagram } from '../../src/features/diagrams/diagramModel'

const content = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../study-content')

async function* markdownFiles(directory: string): AsyncGenerator<string> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) yield* markdownFiles(full)
    else if (entry.name.endsWith('.md')) yield full
  }
}

test('flowchart reader keeps labels, shapes, edge labels, and chains', () => {
  const model = parseDiagram(
    'flowchart TD\n  R["Read request"] --> C{"Cache hit?"}\n  C -->|"yes"| A["Answer"]\n  C -->|no| D[("Database")] --> A',
  )
  assert.equal(model?.kind, 'flowchart')
  if (model?.kind !== 'flowchart') return
  assert.equal(model.vertical, true)
  assert.deepEqual(
    model.nodes.map((node) => [node.id, node.shape]),
    [
      ['R', 'box'],
      ['C', 'decision'],
      ['A', 'box'],
      ['D', 'database'],
    ],
  )
  assert.deepEqual(
    model.edges.map((edge) => edge.label),
    ['', 'yes', 'no', ''],
  )
})

test('a long left-to-right chain is stacked so it stays readable', () => {
  const model = parseDiagram(
    'flowchart LR\n' +
      Array.from({ length: 8 }, (_, index) => `  N${index}["Step number ${index}"]`).join('\n') +
      '\n' +
      Array.from({ length: 7 }, (_, index) => `  N${index} --> N${index + 1}`).join('\n'),
  )
  assert.equal(model?.kind, 'flowchart')
  if (model?.kind !== 'flowchart') return
  const layout = layoutFlowchart(model)
  assert.ok(layout.width <= 900, 'width ' + layout.width)
  assert.ok(
    layout.nodes.every(
      (node) => node.x >= 0 && node.y >= 0 && node.x + node.width <= layout.width && node.y + node.height <= layout.height,
    ),
  )
})

test('a loop in the graph does not stop layout', () => {
  const model = parseDiagram('flowchart LR\n  A --> B\n  B --> C\n  C --> A')
  assert.equal(model?.kind, 'flowchart')
  if (model?.kind !== 'flowchart') return
  assert.equal(layoutFlowchart(model).edges.length, 3)
})

test('sequence reader reads participants and messages', () => {
  const model = parseDiagram(
    'sequenceDiagram\n  participant U as User\n  participant A as API\n  U->>A: GET /notes\n  A-->>U: 200 list',
  )
  assert.equal(model?.kind, 'sequence')
  if (model?.kind !== 'sequence') return
  assert.deepEqual(
    model.participants.map((participant) => participant.label),
    ['User', 'API'],
  )
  assert.deepEqual(
    model.messages.map((message) => message.dashed),
    [false, true],
  )
  assert.equal(layoutSequence(model).rows.length, 2)
})

test('unsupported syntax falls back instead of drawing a wrong picture', () => {
  assert.equal(parseDiagram('pie title Pets\n  "Dogs": 3'), null)
  assert.equal(parseDiagram('flowchart LR\n  subgraph one\n  A --> B\n  end'), null)
})

test('every diagram in every course can be drawn', async () => {
  let blocks = 0
  const failures: string[] = []
  for await (const file of markdownFiles(content)) {
    for (const match of (await readFile(file, 'utf8')).matchAll(/^```mermaid\r?\n([\s\S]*?)^```/gm)) {
      blocks++
      if (!parseDiagram(match[1]))
        failures.push(path.relative(content, file) + ': ' + match[1].split('\n').slice(0, 2).join(' | '))
    }
  }
  assert.ok(blocks > 100, 'expected the course diagrams, found ' + blocks)
  assert.deepEqual(failures, [])
})
