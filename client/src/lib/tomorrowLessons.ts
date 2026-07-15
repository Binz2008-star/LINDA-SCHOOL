import type { LearnerProfile, SchoolLesson } from './familyCurriculum';
import { getGradeCurriculum } from './gradeCurriculum';

/**
 * The former one-day lesson slot is now the learner's persistent grade class pack.
 * Keeping this adapter preserves the existing curriculum pipeline while making
 * grade-aligned classes available in every account without duplicating routing.
 */
export function getTomorrowLessons(learner: LearnerProfile): SchoolLesson[] {
  return getGradeCurriculum(learner);
}
