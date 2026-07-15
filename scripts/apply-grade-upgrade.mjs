import { readFileSync, writeFileSync } from 'node:fs';

function patch(path, operations) {
  let source = readFileSync(path, 'utf8');
  const original = source;
  for (const [search, replacement, label] of operations) {
    if (source.includes(replacement)) continue;
    if (!source.includes(search)) throw new Error(`${path}: missing ${label}`);
    source = source.replace(search, replacement);
  }
  if (source !== original) writeFileSync(path, source);
}

patch('client/src/lib/familyCurriculum.ts', [
  ["import { getTomorrowLessons } from './tomorrowLessons';", "import { getTomorrowLessons } from './tomorrowLessons';\nimport { getGradeCurriculum } from './gradeCurriculum';", 'grade curriculum import'],
  ['  age: number;\n  photo: string;', '  age: number;\n  grade: 3 | 5 | 7;\n  photo: string;', 'learner grade field'],
  ['    age: 13,\n    photo:', '    age: 13,\n    grade: 7,\n    photo:', 'Linda grade'],
  ['    age: 11,\n    photo:', '    age: 11,\n    grade: 5,\n    photo:', 'Adam grade'],
  ['    age: 9,\n    photo:', '    age: 9,\n    grade: 5,\n    photo:', 'Judy grade'],
  ['    age: 7,\n    photo:', '    age: 7,\n    grade: 3,\n    photo:', 'Noah grade'],
  ['return [...makeCoreLessons(learner), ...makeInterestLessons(learner), ...getTomorrowLessons(learner), ...makeWeeklyLessons(learner)];', 'return [...getGradeCurriculum(learner), ...makeCoreLessons(learner), ...makeInterestLessons(learner), ...getTomorrowLessons(learner), ...makeWeeklyLessons(learner)];', 'grade lessons in curriculum'],
]);

patch('client/src/lib/children.ts', [
  ['gradeLevel: 1 | 2 | 3 | 4 | 5 | 6;', 'gradeLevel: 3 | 5 | 7;', 'grade union'],
  ['gradeLevel: 6,', 'gradeLevel: 7,', 'Linda grade'],
  ['gradeLevel: 4,', 'gradeLevel: 5,', 'Adam grade'],
  ['gradeLevel: 3,\n    difficulty: \'easy\',\n    dadToneAr: \'يا جودي بطلتي\'', 'gradeLevel: 5,\n    difficulty: \'medium\',\n    dadToneAr: \'يا جودي بطلتي\'', 'Judy grade'],
  ['gradeLevel: 1,', 'gradeLevel: 3,', 'Noah grade'],
]);

patch('client/src/components/ChildSelector.tsx', [
  ["{'⭐'.repeat(Math.min(child.gradeLevel, 5))}\n        <span className=\"mr-1 arabic-text\">المستوى {child.gradeLevel}</span>", "{'⭐'.repeat(Math.min(child.gradeLevel, 5))}\n        <span className=\"mr-1 arabic-text\">الصف {child.gradeLevel}</span>", 'grade label'],
  ['اختر اسمك وأدخل رقمك السري �', 'اختر اسمك وأدخل رقمك السري 🔐', 'broken lock icon'],
]);

console.log('Applied real grade profiles and grade-aligned curriculum.');
// Validation trigger: 2026-07-16
