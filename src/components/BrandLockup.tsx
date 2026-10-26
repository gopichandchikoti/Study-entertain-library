import { BookOpen } from './icons'
import { content as copy } from '../content.js'

/** The product mark and name, with a short line saying which area of the app this is. */
export function BrandLockup({ subtitle }: { subtitle: string }) {
  return (
    <div className="brand-lockup">
      <div className="brand-mark" aria-hidden="true">
        <BookOpen size={20} />
      </div>
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h1>{copy.app.secondBrain}</h1>
      </div>
    </div>
  )
}
