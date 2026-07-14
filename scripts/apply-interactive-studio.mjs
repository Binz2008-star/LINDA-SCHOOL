import { readFileSync, writeFileSync } from 'node:fs';

const path = 'client/src/pages/SecureFamilySchool.tsx';
let source = readFileSync(path, 'utf8');
const original = source;

function replaceOnce(search, replacement, label) {
  if (source.includes(replacement)) return;
  if (!source.includes(search)) throw new Error(`Could not find patch target: ${label}`);
  source = source.replace(search, replacement);
}

replaceOnce(
  "import InteractiveTools from '@/components/InteractiveTools';",
  "import InteractiveTools from '@/components/InteractiveTools';\nimport LessonActivityStudio from '@/components/LessonActivityStudio';",
  'activity studio import',
);

replaceOnce(
  "useState<'teach' | 'practice' | 'done'>('teach')",
  "useState<'teach' | 'activity' | 'practice' | 'done'>('teach')",
  'lesson phase state',
);

replaceOnce(
  "onClick={() => setPhase('practice')}",
  "onClick={() => setPhase('activity')}",
  'teach to activity transition',
);

replaceOnce(
  'فهمت الدرس — ابدأ التدريب',
  'فهمت الشرح — ابدأ المختبر التفاعلي',
  'lesson call to action',
);

replaceOnce(
  "\n  if (phase === 'practice') return",
  "\n  if (phase === 'activity') return <LessonActivityStudio learner={learner} lesson={lesson} onBack={() => setPhase('teach')} onComplete={() => setPhase('practice')} />;\n\n  if (phase === 'practice') return",
  'interactive activity phase',
);

replaceOnce(
  'if (phase === \'practice\') return <div className="max-w-2xl mx-auto"',
  'if (phase === \'practice\') return <div className="max-w-4xl mx-auto"',
  'practice layout width',
);

replaceOnce(
  'مراجعة الشرح',
  'العودة للشرح',
  'practice back label',
);

replaceOnce(
  'تم حفظ أفضل نتيجة لهذا الدرس. إعادة الدرس تساعدك على الفهم، لكنها لا تضاعف العملات.',
  'أكملت الشرح والمختبر العملي والمراجعة القصيرة. تم حفظ أفضل نتيجة، وإعادة الدرس لا تضاعف العملات.',
  'completion explanation',
);

if (source === original) {
  console.log('Interactive lesson flow is already applied.');
} else {
  writeFileSync(path, source);
  console.log('Applied rich interactive lesson flow to SecureFamilySchool.tsx.');
}
