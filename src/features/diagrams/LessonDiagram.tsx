import { useId, useMemo } from 'react'
import {
  DIAGRAM_LINE_HEIGHT,
  describeDiagram,
  layoutFlowchart,
  layoutSequence,
  parseDiagram,
  type DiagramModel,
  type PlacedNode,
} from './diagramModel'
import './Diagram.css'

const textLines = (lines: string[], x: number, centerY: number) =>
  lines.map((line, index) => (
    <tspan key={index} x={x} y={centerY + (index - (lines.length - 1) / 2) * DIAGRAM_LINE_HEIGHT}>
      {line}
    </tspan>
  ))

function NodeShape({ node }: { node: PlacedNode }) {
  const { x, y, width, height } = node
  if (node.shape === 'decision')
    return (
      <polygon
        className="diagram-node"
        points={`${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`}
      />
    )
  if (node.shape === 'database') {
    const rim = 8
    return (
      <g className="diagram-node-group">
        <path
          className="diagram-node"
          d={`M ${x} ${y + rim} A ${width / 2} ${rim} 0 0 1 ${x + width} ${y + rim} V ${y + height - rim} A ${width / 2} ${rim} 0 0 1 ${x} ${y + height - rim} Z`}
        />
        <path className="diagram-rim" d={`M ${x} ${y + rim} A ${width / 2} ${rim} 0 0 0 ${x + width} ${y + rim}`} />
      </g>
    )
  }
  return <rect className="diagram-node" x={x} y={y} width={width} height={height} rx={node.shape === 'round' ? height / 2 : 10} />
}

function Flowchart({ model }: { model: Extract<DiagramModel, { kind: 'flowchart' }> }) {
  const arrowId = useId().replace(/:/g, '') + '-arrow'
  const layout = useMemo(() => layoutFlowchart(model), [model])
  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ maxWidth: layout.width }}
      role="img"
      aria-label={describeDiagram(model)}
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="diagram-arrowhead" />
        </marker>
      </defs>
      {layout.edges.map((edge, index) => (
        <path
          key={index}
          className={edge.dashed ? 'diagram-edge is-dashed' : 'diagram-edge'}
          d={edge.path}
          markerEnd={`url(#${arrowId})`}
        />
      ))}
      {layout.nodes.map((node) => (
        <g key={node.id}>
          <NodeShape node={node} />
          <text className="diagram-text" textAnchor="middle" dominantBaseline="central">
            {textLines(node.lines, node.x + node.width / 2, node.y + node.height / 2)}
          </text>
        </g>
      ))}
      {layout.edges
        .filter((edge) => edge.label)
        .map((edge, index) => {
          const width = edge.label.length * 6.6 + 12
          return (
            <g key={index}>
              <rect
                className="diagram-label-box"
                x={edge.labelX - width / 2}
                y={edge.labelY - 10}
                width={width}
                height={20}
                rx={5}
              />
              <text className="diagram-label" x={edge.labelX} y={edge.labelY} textAnchor="middle" dominantBaseline="central">
                {edge.label}
              </text>
            </g>
          )
        })}
    </svg>
  )
}

function Sequence({ model }: { model: Extract<DiagramModel, { kind: 'sequence' }> }) {
  const arrowId = useId().replace(/:/g, '') + '-arrow'
  const layout = useMemo(() => layoutSequence(model), [model])
  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ maxWidth: layout.width }}
      role="img"
      aria-label={describeDiagram(model)}
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="diagram-arrowhead" />
        </marker>
      </defs>
      {layout.columns.map((column) => (
        <g key={column.id}>
          <line className="diagram-lifeline" x1={column.x} x2={column.x} y1={76} y2={layout.height - 10} />
          <rect className="diagram-node" x={column.x - column.boxWidth / 2} y={22} width={column.boxWidth} height={54} rx={10} />
          <text className="diagram-text" textAnchor="middle" dominantBaseline="central">
            {textLines(column.lines, column.x, 49)}
          </text>
        </g>
      ))}
      {layout.rows.map((row, index) => (
        <g key={index}>
          {row.self ? (
            <path
              className={row.dashed ? 'diagram-edge is-dashed' : 'diagram-edge'}
              d={`M ${row.x1} ${row.y} h 36 v 22 h -36`}
              markerEnd={`url(#${arrowId})`}
            />
          ) : (
            <line
              className={row.dashed ? 'diagram-edge is-dashed' : 'diagram-edge'}
              x1={row.x1}
              x2={row.x2 + (row.x2 > row.x1 ? -2 : 2)}
              y1={row.y}
              y2={row.y}
              markerEnd={`url(#${arrowId})`}
            />
          )}
          <text className="diagram-label" textAnchor={row.self ? 'start' : 'middle'}>
            {row.labelLines.map((line, lineIndex) => (
              <tspan
                key={lineIndex}
                x={row.self ? row.x1 + 44 : (row.x1 + row.x2) / 2}
                y={row.y - 9 - (row.labelLines.length - 1 - lineIndex) * 14 + (row.self ? 18 : 0)}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Draws a lesson's flowchart or sequence diagram; shows the source as code when it uses syntax this small reader does not support. */
export function LessonDiagram({ source }: { source: string }) {
  const model = useMemo(() => parseDiagram(source), [source])
  if (!model)
    return (
      <pre className="diagram-fallback">
        <code>{source}</code>
      </pre>
    )
  return (
    <figure className="lesson-diagram">
      {model.kind === 'flowchart' ? <Flowchart model={model} /> : <Sequence model={model} />}
    </figure>
  )
}
