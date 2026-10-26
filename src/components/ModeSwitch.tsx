import { content as copy } from '../content.js'
import { useSlidingIndicator } from '../hooks/useSlidingIndicator'
import { AudioLines, FileText, PlayCircle } from './icons'
import type { AppMode } from '../@types'

const modes: { id: AppMode; label: string; icon?: typeof FileText }[] = [
  { id: 'study', label: copy.modeSwitch.study },
  { id: 'watch', label: copy.modeSwitch.watch, icon: PlayCircle },
  { id: 'music', label: copy.modeSwitch.music, icon: AudioLines },
  { id: 'markdown', label: copy.modeSwitch.markdown, icon: FileText },
]

export function ModeSwitch({ mode, onMode }: { mode: AppMode; onMode: (mode: AppMode) => void }) {
  const indicator = useSlidingIndicator<HTMLDivElement>(
    'mode-switch',
    modes.findIndex((entry) => entry.id === mode),
  )
  return (
    <div className="shell-mode-switch" ref={indicator} role="tablist" aria-label={copy.modeSwitch.appModes}>
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={mode === id ? 'is-active' : ''}
          type="button"
          role="tab"
          aria-selected={mode === id}
          onClick={() => {
            if (mode !== id) onMode(id)
          }}
        >
          {Icon && <Icon size={15} />}
          {label}
        </button>
      ))}
    </div>
  )
}
