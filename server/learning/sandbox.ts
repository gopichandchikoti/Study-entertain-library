import type { PracticeLanguage } from '../../src/features/learning/learningTypes.js'
// No process execution implementation is enabled. Fail closed for every code language.
export const runnerCapabilities = {
  languages: ['json', 'text'] as PracticeLanguage[],
  codeExecution: false as const,
  message: 'Only fixed structured-answer validation is available. Code execution needs a separately audited disposable sandbox.',
}
export function codeSandboxAvailable(_language: PracticeLanguage): boolean {
  return false
}
