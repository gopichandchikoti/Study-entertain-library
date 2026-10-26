import { content as copy } from '../../content.js'
import { useState } from 'react'
import type { Theme } from '../../@types'
import { SplitEditor } from './SplitEditor'
import { sampleMarkdown } from './sampleMarkdown'

/** Editor without storage, for sessions that have no account (the shared-password deployment). */
export function LocalMarkdown({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [value, setValue] = useState(sampleMarkdown)
  return (
    <div className="md-workspace files-hidden">
      <div className="md-editor-area">
        <SplitEditor
          value={value}
          onChange={setValue}
          theme={theme}
          onToggleTheme={onToggleTheme}
          toolbarStart={<p className="guest-note">{copy.localMarkdown.thisDeploymentHasNoPersonalAccountsSoFilesCannotBe}</p>}
        />
      </div>
    </div>
  )
}
