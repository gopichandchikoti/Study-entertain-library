import { content as copy } from '../../content.js'
// Small, dependency-free reader and layout for the two diagram kinds used in the study lessons:
// Mermaid-style `flowchart` and `sequenceDiagram`. Anything else returns null so the caller can show the source instead.

export type NodeShape = 'box' | 'decision' | 'database' | 'round'
export type FlowNode = { id: string; label: string; shape: NodeShape }
export type FlowEdge = { from: string; to: string; label: string; dashed: boolean }
export type FlowchartModel = { kind: 'flowchart'; vertical: boolean; nodes: FlowNode[]; edges: FlowEdge[] }
export type SequenceMessage = { from: string; to: string; label: string; dashed: boolean }
export type SequenceModel = { kind: 'sequence'; participants: { id: string; label: string }[]; messages: SequenceMessage[] }
export type DiagramModel = FlowchartModel | SequenceModel

const decode = (text: string): string =>
  text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/^"(.*)"$/s, '$1')
    .trim()

const shapeOpeners: { open: string; close: string; shape: NodeShape }[] = [
  { open: '[(', close: ')]', shape: 'database' },
  { open: '((', close: '))', shape: 'round' },
  { open: '[[', close: ']]', shape: 'box' },
  { open: '[', close: ']', shape: 'box' },
  { open: '{', close: '}', shape: 'decision' },
  { open: '(', close: ')', shape: 'round' },
]

type NodeScan = { id: string; label: string | null; shape: NodeShape | null; end: number }

const scanNode = (text: string, start: number): NodeScan | null => {
  const id = /^[A-Za-z0-9_]+/.exec(text.slice(start))
  if (!id) return null
  let at = start + id[0].length
  const opener = shapeOpeners.find((candidate) => text.startsWith(candidate.open, at))
  if (!opener) return { id: id[0], label: null, shape: null, end: at }
  at += opener.open.length
  let closeAt: number
  if (text[at] === '"') {
    const quoteEnd = text.indexOf('"', at + 1)
    if (quoteEnd < 0) return null
    closeAt = text.indexOf(opener.close, quoteEnd + 1)
  } else closeAt = text.indexOf(opener.close, at)
  if (closeAt < 0) return null
  return { id: id[0], label: decode(text.slice(at, closeAt)), shape: opener.shape, end: closeAt + opener.close.length }
}

const linkPattern = /^\s*(-\.->|-\.-|==>|===|-->|---)/
// A link that carries its own text, such as `-. blocks .->` or `-- yes -->`.
const textLinkPattern = /^\s*(?:(-\.)\s+(.+?)\s+\.->|--\s+(.+?)\s+-->)/

const parseFlowchart = (lines: string[]): FlowchartModel | null => {
  const header = /^(?:flowchart|graph)\s*(LR|RL|TD|TB|BT)?\s*$/i.exec(lines[0].trim())
  if (!header) return null
  const nodes = new Map<string, FlowNode>(),
    edges: FlowEdge[] = []
  const remember = (scan: NodeScan): void => {
    const known = nodes.get(scan.id)
    if (!known) nodes.set(scan.id, { id: scan.id, label: scan.label ?? scan.id, shape: scan.shape ?? 'box' })
    else if (scan.label !== null) {
      known.label = scan.label
      known.shape = scan.shape ?? known.shape
    }
  }
  for (const raw of lines.slice(1)) {
    const line = raw.replace(/%%.*$/, '').trim()
    if (!line || /^(classDef|class|style|linkStyle|click|direction)\b/.test(line)) continue
    if (/^(subgraph|end)\b/.test(line)) return null
    for (const statement of line.split(/;(?=(?:[^"]*"[^"]*")*[^"]*$)/)) {
      const text = statement.trim()
      if (!text) continue
      let first = scanNode(text, 0)
      if (!first) return null
      remember(first)
      let at = first.end
      while (at < text.length) {
        const worded = textLinkPattern.exec(text.slice(at)),
          link = worded ?? linkPattern.exec(text.slice(at))
        if (!link) {
          if (text.slice(at).trim()) return null
          break
        }
        at += link[0].length
        let label = worded ? decode(worded[2] ?? worded[3]) : ''
        const labelMatch = worded ? null : /^\s*\|(.*?)\|/.exec(text.slice(at))
        if (labelMatch) {
          label = decode(labelMatch[1])
          at += labelMatch[0].length
        }
        while (text[at] === ' ') at++
        const next = scanNode(text, at)
        if (!next) return null
        remember(next)
        edges.push({ from: first.id, to: next.id, label, dashed: worded ? Boolean(worded[1]) : link[1].startsWith('-.') })
        first = next
        at = next.end
      }
    }
  }
  if (!nodes.size) return null
  return { kind: 'flowchart', vertical: !/^(LR|RL)$/i.test(header[1] ?? 'TD'), nodes: [...nodes.values()], edges }
}

const parseSequence = (lines: string[]): SequenceModel | null => {
  const participants = new Map<string, string>(),
    messages: SequenceMessage[] = []
  const touch = (id: string): void => {
    if (!participants.has(id)) participants.set(id, id)
  }
  for (const raw of lines.slice(1)) {
    const line = raw.replace(/%%.*$/, '').trim()
    if (!line || /^(autonumber|activate|deactivate|note|end)\b/i.test(line)) continue
    if (/^(alt|else|opt|loop|par|and|rect|critical|break)\b/i.test(line)) return null
    const declared = /^(?:participant|actor)\s+([A-Za-z0-9_]+)(?:\s+as\s+(.+))?$/i.exec(line)
    if (declared) {
      participants.set(declared[1], decode(declared[2] ?? declared[1]))
      continue
    }
    const message = /^([A-Za-z0-9_]+)\s*(-->>|->>|-->|->|--x|-x)\s*\+?-?([A-Za-z0-9_]+)\s*:\s*(.*)$/.exec(line)
    if (!message) return null
    touch(message[1])
    touch(message[3])
    messages.push({ from: message[1], to: message[3], label: decode(message[4]), dashed: message[2].startsWith('--') })
  }
  if (!messages.length) return null
  return { kind: 'sequence', participants: [...participants].map(([id, label]) => ({ id, label })), messages }
}

export const parseDiagram = (source: string): DiagramModel | null => {
  const lines = source.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('%%'))
  if (!lines.length) return null
  const kind = lines[0].trim().split(/\s+/)[0].toLowerCase()
  if (kind === 'flowchart' || kind === 'graph') return parseFlowchart(lines)
  if (kind === 'sequencediagram') return parseSequence(lines)
  return null
}

// ---------- layout ----------

export type PlacedNode = FlowNode & { x: number; y: number; width: number; height: number; lines: string[] }
export type PlacedEdge = { path: string; label: string; labelX: number; labelY: number; dashed: boolean }
export type FlowchartLayout = { width: number; height: number; nodes: PlacedNode[]; edges: PlacedEdge[] }

const FONT = 14,
  CHAR = 7.4,
  LINE = 18,
  MAX_CHARS = 22

export const wrapLabel = (label: string, maxChars = MAX_CHARS): string[] => {
  const lines: string[] = []
  for (const part of label.split('\n')) {
    let line = ''
    for (const word of part.split(/\s+/).filter(Boolean)) {
      if (line && (line + ' ' + word).length > maxChars) {
        lines.push(line)
        line = word
      } else line = line ? line + ' ' + word : word
    }
    lines.push(line)
  }
  return lines.length ? lines : ['']
}

const measure = (node: FlowNode): { width: number; height: number; lines: string[] } => {
  const lines = wrapLabel(node.label),
    textWidth = Math.max(...lines.map((line) => line.length)) * CHAR
  const decision = node.shape === 'decision'
  return {
    lines,
    width: Math.max(96, Math.ceil(textWidth + (decision ? 76 : 36))),
    height: lines.length * LINE + (decision ? 38 : 24) + (node.shape === 'database' ? 10 : 0),
  }
}

const assignLayers = (model: FlowchartModel): Map<string, number> => {
  const outgoing = new Map<string, string[]>(model.nodes.map((node) => [node.id, []]))
  for (const edge of model.edges) outgoing.get(edge.from)?.push(edge.to)
  const state = new Map<string, 1 | 2>(),
    forward: FlowEdge[] = []
  const visit = (id: string): void => {
    state.set(id, 1)
    for (const edge of model.edges.filter((candidate) => candidate.from === id)) {
      if (state.get(edge.to) === 1) continue
      forward.push(edge)
      if (!state.has(edge.to)) visit(edge.to)
    }
    state.set(id, 2)
  }
  for (const node of model.nodes) if (!state.has(node.id)) visit(node.id)
  const layer = new Map<string, number>(model.nodes.map((node) => [node.id, 0]))
  for (let pass = 0; pass < model.nodes.length; pass++) {
    let changed = false
    for (const edge of forward) {
      const wanted = (layer.get(edge.from) ?? 0) + 1
      if (wanted > (layer.get(edge.to) ?? 0)) {
        layer.set(edge.to, wanted)
        changed = true
      }
    }
    if (!changed) break
  }
  return layer
}

const arrange = (model: FlowchartModel, vertical: boolean): FlowchartLayout => {
  const layers = assignLayers(model),
    depth = Math.max(...layers.values()) + 1
  const sized = new Map(model.nodes.map((node) => [node.id, { ...node, ...measure(node), x: 0, y: 0 } as PlacedNode]))
  const rows: PlacedNode[][] = Array.from({ length: depth }, () => [])
  for (const node of model.nodes) rows[layers.get(node.id) ?? 0].push(sized.get(node.id) as PlacedNode)
  const position = new Map<string, number>()
  rows.forEach((row) => row.forEach((node, index) => position.set(node.id, index)))
  for (let index = 1; index < depth; index++) {
    const average = (node: PlacedNode): number => {
      const parents = model.edges
        .filter((edge) => edge.to === node.id && (layers.get(edge.from) ?? 0) < index)
        .map((edge) => position.get(edge.from) ?? 0)
      return parents.length ? parents.reduce((sum, value) => sum + value, 0) / parents.length : (position.get(node.id) ?? 0)
    }
    rows[index].sort((a, b) => average(a) - average(b))
    rows[index].forEach((node, order) => position.set(node.id, order))
  }
  const gapAcross = vertical ? 30 : 26,
    gapBetween = vertical ? 54 : 70,
    pad = 16
  const spanOf = (row: PlacedNode[]): number =>
    row.reduce((sum, node) => sum + (vertical ? node.width : node.height), 0) + gapAcross * (row.length - 1)
  const widest = Math.max(...rows.map(spanOf))
  const thickness = rows.map((row) => Math.max(...row.map((node) => (vertical ? node.height : node.width))))
  let cursor = pad
  rows.forEach((row, index) => {
    let offset = pad + (widest - spanOf(row)) / 2
    for (const node of row) {
      if (vertical) {
        node.x = offset
        node.y = cursor + (thickness[index] - node.height) / 2
        offset += node.width + gapAcross
      } else {
        node.x = cursor + (thickness[index] - node.width) / 2
        node.y = offset
        offset += node.height + gapAcross
      }
    }
    cursor += thickness[index] + gapBetween
  })
  const width = vertical ? widest + pad * 2 : cursor - gapBetween + pad,
    height = vertical ? cursor - gapBetween + pad : widest + pad * 2
  const edges: PlacedEdge[] = model.edges.map((edge) => {
    const a = sized.get(edge.from) as PlacedNode,
      b = sized.get(edge.to) as PlacedNode
    const forwardEdge = (layers.get(edge.to) ?? 0) > (layers.get(edge.from) ?? 0)
    let sx: number, sy: number, tx: number, ty: number, path: string
    if (vertical) {
      sx = a.x + a.width / 2
      sy = forwardEdge ? a.y + a.height : a.y + a.height / 2
      tx = b.x + b.width / 2
      ty = forwardEdge ? b.y : b.y + b.height / 2
      const bend = (ty - sy) / 2
      path = forwardEdge
        ? `M ${sx} ${sy} C ${sx} ${sy + bend}, ${tx} ${ty - bend}, ${tx} ${ty}`
        : `M ${a.x + a.width} ${sy} C ${a.x + a.width + 70} ${sy}, ${b.x + b.width + 70} ${ty}, ${b.x + b.width} ${ty}`
    } else {
      sx = forwardEdge ? a.x + a.width : a.x + a.width / 2
      sy = a.y + a.height / 2
      tx = forwardEdge ? b.x : b.x + b.width / 2
      ty = forwardEdge ? b.y + b.height / 2 : b.y + b.height
      const bend = (tx - sx) / 2
      path = forwardEdge
        ? `M ${sx} ${sy} C ${sx + bend} ${sy}, ${tx - bend} ${ty}, ${tx} ${ty}`
        : `M ${sx} ${a.y + a.height} C ${sx} ${a.y + a.height + 60}, ${tx} ${b.y + b.height + 60}, ${tx} ${b.y + b.height}`
    }
    let labelX = (sx + tx) / 2,
      labelY = (sy + ty) / 2
    const from = layers.get(edge.from) ?? 0,
      to = layers.get(edge.to) ?? 0
    if (forwardEdge && to - from > 1) {
      // Skipping layers: swing around the outside of the nodes in between instead of cutting through them.
      const between = rows.slice(from + 1, to).flat()
      if (vertical) {
        const lane = Math.max(a.x + a.width, ...between.map((node) => node.x + node.width)) + 34
        path = `M ${a.x + a.width} ${a.y + a.height / 2} C ${lane} ${a.y + a.height / 2}, ${lane} ${b.y + b.height / 2}, ${b.x + b.width} ${b.y + b.height / 2}`
        labelX = lane
        labelY = (a.y + b.y + b.height) / 2
      } else {
        const lane = Math.max(a.y + a.height, ...between.map((node) => node.y + node.height)) + 34
        path = `M ${a.x + a.width / 2} ${a.y + a.height} C ${a.x + a.width / 2} ${lane}, ${b.x + b.width / 2} ${lane}, ${b.x + b.width / 2} ${b.y + b.height}`
        labelX = (a.x + b.x + b.width) / 2
        labelY = lane
      }
    }
    return { path, label: edge.label, labelX, labelY, dashed: edge.dashed }
  })
  const reachX = Math.max(width, ...edges.map((edge) => edge.labelX + 60)),
    reachY = Math.max(height, ...edges.map((edge) => edge.labelY + 24))
  return { width: vertical ? reachX : width, height: vertical ? height : reachY, nodes: [...sized.values()], edges }
}

export const layoutFlowchart = (model: FlowchartModel, maxWidth = 900): FlowchartLayout => {
  const natural = arrange(model, model.vertical)
  // A long left-to-right chain becomes unreadably small on a phone, so stack it top to bottom instead.
  return !model.vertical && natural.width > maxWidth ? arrange(model, true) : natural
}

export type SequenceLayout = {
  width: number
  height: number
  columns: { id: string; label: string; x: number; lines: string[]; boxWidth: number }[]
  rows: { y: number; x1: number; x2: number; label: string; labelLines: string[]; dashed: boolean; self: boolean }[]
}

export const layoutSequence = (model: SequenceModel): SequenceLayout => {
  const step = Math.max(150, Math.min(210, Math.floor(860 / model.participants.length))),
    top = 22,
    headerHeight = 54
  const columns = model.participants.map((participant, index) => {
    const lines = wrapLabel(participant.label, 18)
    return {
      ...participant,
      x: step / 2 + index * step,
      lines,
      boxWidth: Math.min(step - 16, Math.max(84, Math.max(...lines.map((line) => line.length)) * CHAR + 24)),
    }
  })
  const xOf = (id: string): number => columns.find((column) => column.id === id)?.x ?? 0
  let y = top + headerHeight + 40
  const rows = model.messages.map((message) => {
    const self = message.from === message.to,
      labelLines = wrapLabel(
        message.label,
        Math.max(18, Math.floor((self ? step : Math.abs(xOf(message.to) - xOf(message.from))) / CHAR) - 2),
      )
    const row = {
      y: y + (labelLines.length - 1) * 14,
      x1: xOf(message.from),
      x2: xOf(message.to),
      label: message.label,
      labelLines,
      dashed: message.dashed,
      self,
    }
    y += labelLines.length * 14 + (self ? 52 : 38)
    return row
  })
  return { width: step * model.participants.length, height: y + 20, columns, rows }
}

export const describeDiagram = (model: DiagramModel): string =>
  model.kind === 'flowchart'
    ? copy.diagramModel.flowchart + model.nodes.map((node) => node.label.replace(/\n/g, ' ')).join(copy.diagramModel.then)
    : copy.diagramModel.sequenceDiagramBetween + model.participants.map((participant) => participant.label).join(', ')

export { FONT as DIAGRAM_FONT_SIZE, LINE as DIAGRAM_LINE_HEIGHT }
