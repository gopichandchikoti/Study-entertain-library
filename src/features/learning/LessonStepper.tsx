import { content as copy } from '../../content.js'
import { BookOpen, ListChecks, Code2 } from '../../components/icons'
import type { LessonStage } from './learningTypes'
export function LessonStepper({
  stage,
  read,
  quizPassed,
  onStage,
}: {
  stage: LessonStage
  read: boolean
  quizPassed: boolean
  onStage: (stage: LessonStage) => void
}) {
  const steps = [
    { id: 'lesson' as const, label: copy.lessonStepper.lesson, icon: BookOpen, locked: false },
    { id: 'assignment' as const, label: copy.lessonStepper.assignment, icon: ListChecks, locked: !read },
    { id: 'practical' as const, label: copy.lessonStepper.practical, icon: Code2, locked: !quizPassed },
  ]
  return (
    <nav className="lesson-stepper" aria-label={copy.lessonStepper.learningSteps}>
      {steps.map((s, i) => (
        <button
          type="button"
          key={s.id}
          aria-current={stage === s.id ? 'step' : undefined}
          disabled={s.locked}
          title={
            s.locked
              ? s.id === 'assignment'
                ? copy.lessonStepper.markTheLessonReadFirst
                : copy.lessonStepper.passTheAssignmentFirst
              : s.label
          }
          onClick={() => onStage(s.id)}
        >
          <s.icon size={17} />
          <span>{s.label}</span>
          <small>
            {i + 1}
            {copy.lessonStepper.text3}
          </small>
        </button>
      ))}
    </nav>
  )
}
