import { readFileSync, writeFileSync } from 'node:fs';

const path = 'client/src/lib/familyCurriculum.ts';
let source = readFileSync(path, 'utf8');
const original = source;

if (!source.includes("import { getTomorrowLessons } from './tomorrowLessons';")) {
  source = `import { getTomorrowLessons } from './tomorrowLessons';\n${source}`;
}

const current = 'return [...makeCoreLessons(learner), ...makeInterestLessons(learner), ...makeWeeklyLessons(learner)];';
const replacement = 'return [...makeCoreLessons(learner), ...makeInterestLessons(learner), ...getTomorrowLessons(learner), ...makeWeeklyLessons(learner)];';

if (!source.includes(replacement)) {
  if (!source.includes(current)) throw new Error('Could not find getCurriculum return statement');
  source = source.replace(current, replacement);
}

if (source === original) {
  console.log('Tomorrow lessons already integrated.');
} else {
  writeFileSync(path, source);
  console.log('Integrated lessons for 2026-07-17.');
}
