import { content as copy } from '../../content.js'
import { CheckCircle2, RotateCcw } from '../../components/icons'
import type { LessonQuiz, QuizScore } from './learningTypes'
export function AssignmentPanel({
  quiz,
  answers,
  score,
  onAnswer,
  onSubmit,
  onRetry,
  onReview,
  onPractical,
}: {
  quiz: LessonQuiz
  answers: Record<string, string>
  score: QuizScore | null
  onAnswer: (question: string, option: string) => void
  onSubmit: () => void
  onRetry: () => void
  onReview: (section: string) => void
  onPractical: () => void
}) {
  const answered = quiz.questions.filter((q) => q.options.some((o) => o.id === answers[q.id])).length
  return (
    <section className="assignment-panel" aria-label={copy.assignmentPanel.lessonAssignment}>
      <h2>{quiz.title}</h2>
      <p className="learning-hint">
        {copy.assignmentPanel.personalPracticeFiveQuestions}
        {quiz.passPercentage}
        {copy.assignmentPanel.toPass}
      </p>
      <progress value={answered} max={5} aria-label={copy.assignmentPanel.questionsAnswered} />
      <p>
        {answered}
        {copy.assignmentPanel.of5Answered}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (answered === 5 && !score) onSubmit()
        }}
      >
        {quiz.questions.map((q, i) => (
          <fieldset key={q.id} className="quiz-question">
            <legend>
              <small>
                {copy.assignmentPanel.question}
                {i + 1}
                {copy.assignmentPanel.of5}
              </small>
              {q.prompt}
            </legend>
            {q.options.map((option) => (
              <label key={option.id} className={answers[q.id] === option.id ? 'is-selected' : ''}>
                <input
                  type="radio"
                  name={q.id}
                  disabled={Boolean(score)}
                  value={option.id}
                  checked={answers[q.id] === option.id}
                  onChange={() => onAnswer(q.id, option.id)}
                />
                <span>{option.text}</span>
              </label>
            ))}
            {score && (
              <div className="quiz-feedback">
                <strong>
                  {answers[q.id] === q.correctOptionId ? copy.assignmentPanel.correct : copy.assignmentPanel.reviewNeeded}
                </strong>
                <p>
                  {copy.assignmentPanel.yourAnswer}
                  {q.options.find((o) => o.id === answers[q.id])?.text}
                  {copy.assignmentPanel.correctAnswer}
                  {q.options.find((o) => o.id === q.correctOptionId)?.text}
                  {copy.assignmentPanel.text}
                </p>
                <p>{q.explanation}</p>
                <ul>
                  {q.options
                    .filter((o) => o.explanation)
                    .map((o) => (
                      <li key={o.id}>
                        {o.text}
                        {copy.assignmentPanel.text2}
                        {o.explanation}
                      </li>
                    ))}
                </ul>
                {answers[q.id] !== q.correctOptionId && (
                  <button type="button" disabled={false} onClick={() => onReview(q.sectionId)}>
                    {q.reviewLabel}
                  </button>
                )}
              </div>
            )}
          </fieldset>
        ))}
        {!score && (
          <button className="learning-primary" type="submit" disabled={answered !== 5}>
            {copy.assignmentPanel.submitAssignment}
          </button>
        )}
      </form>
      {score && (
        <>
          <div className="learning-score" role="status">
            <CheckCircle2 size={20} />
            <strong>
              {score.points}
              {copy.assignmentPanel.text5}
              {score.percentage}
              {copy.assignmentPanel.text3}
            </strong>
            <span>{score.passed ? copy.assignmentPanel.assignmentPassed : copy.assignmentPanel.reviewAndRetry}</span>
          </div>
          <div className="learning-actions">
            <button type="button" onClick={onRetry}>
              <RotateCcw size={16} />
              {copy.assignmentPanel.retryAssignment}
            </button>
            {score.passed && (
              <button className="learning-primary" type="button" onClick={onPractical}>
                {copy.assignmentPanel.continueToPractical}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
