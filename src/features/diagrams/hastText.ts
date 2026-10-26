type HastLike = { type?: string; value?: string; children?: HastLike[] }

/** Joins the text of a hast node (a fenced code block as react-markdown sees it), ignoring any highlight markup around it. */
export const hastText = (node: HastLike | undefined): string =>
  !node ? '' : node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(hastText).join('')
