import { SAFE_ID } from './learningTypes.js'
type MarkdownNode = {
  type: string
  value?: string
  depth?: number
  children?: MarkdownNode[]
  data?: { hProperties?: Record<string, unknown> }
}
export function remarkSectionAnchors() {
  return (tree: MarkdownNode): void => {
    const visit = (node: MarkdownNode): void => {
      if (node.type === 'heading' && node.children?.length) {
        const last = node.children[node.children.length - 1]
        const marker = last.type === 'text' ? last.value?.match(/ \{#([^}]+)\}\s*$/) : null
        if (marker && SAFE_ID.test(marker[1])) {
          last.value = last.value!.slice(0, marker.index)
          node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: marker[1] } }
        }
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}
export const sectionDomId = (id: string): string => 'user-content-' + id
