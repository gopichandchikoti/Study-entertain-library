import { content as copy } from '../../content.js'
import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { json } from '@codemirror/lang-json'
import type { PracticeLanguage } from './learningTypes'
export function CodeEditor({
  value,
  language,
  onChange,
}: {
  value: string
  language: PracticeLanguage
  onChange: (value: string) => void
}) {
  const initialValue = useRef(value)
  const host = useRef<HTMLDivElement>(null),
    view = useRef<EditorView | null>(null),
    change = useRef(onChange)
  useEffect(() => {
    change.current = onChange
  }, [onChange])
  useEffect(() => {
    if (!host.current) return
    const lang =
      language === 'python'
        ? python()
        : language === 'java'
          ? java()
          : language === 'json'
            ? json()
            : language === 'text'
              ? []
              : javascript({ typescript: language === 'typescript' })
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: initialValue.current,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          highlightActiveLine(),
          lang,
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            'aria-label': copy.codeEditor.practicalSolutionEditor,
            'aria-describedby': 'editor-help',
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) change.current(update.state.doc.toString())
          }),
        ],
      }),
    })
    view.current = editor
    return () => {
      view.current = null
      editor.destroy()
    }
  }, [language])
  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
  }, [value])
  return (
    <>
      <p id="editor-help" className="learning-hint">
        {copy.codeEditor.tabIndentsPressEscapeThenTabToLeaveTheEditor}
      </p>
      <div className="learning-editor" ref={host} />
    </>
  )
}
