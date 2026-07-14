import { readFileSync, writeFileSync } from 'node:fs';

const path = 'client/src/components/LessonActivityStudio.tsx';
let source = readFileSync(path, 'utf8');
const original = source;

function replaceOnce(search, replacement, label) {
  if (source.includes(replacement)) return;
  if (!source.includes(search)) throw new Error(`Missing patch target: ${label}`);
  source = source.replace(search, replacement);
}

replaceOnce(
  "import { useSpeech } from '@/hooks/useSpeech';",
  "import VoiceReflection from '@/components/VoiceReflection';\nimport { useSpeech } from '@/hooks/useSpeech';",
  'voice component import',
);

replaceOnce(
  "type StudioStep = 'build' | 'write' | 'draw';",
  "type StudioStep = 'build' | 'write' | 'draw' | 'voice';",
  'studio step type',
);

replaceOnce(
  "  draw: 'ارسم واشرح',\n};",
  "  draw: 'ارسم واشرح',\n  voice: 'اشرح بصوتك',\n};",
  'step labels',
);

replaceOnce(
  "  draw: '🎨',\n};",
  "  draw: '🎨',\n  voice: '🎙️',\n};",
  'step emoji',
);

replaceOnce(
  "  const steps: StudioStep[] = ['build', 'write', 'draw'];",
  "  const steps: StudioStep[] = ['build', 'write', 'draw', 'voice'];",
  'step sequence',
);

replaceOnce(
  'سنرتب فكرة، ثم نكتبها بطريقتنا، ثم نحوّلها إلى رسم أو مخطط.',
  'سنرتب فكرة، ثم نكتبها، ونرسمها، ونشرحها بصوتنا قبل المراجعة القصيرة.',
  'studio description',
);

replaceOnce(
  'grid grid-cols-3 gap-2 mt-6',
  'grid grid-cols-2 md:grid-cols-4 gap-2 mt-6',
  'four-step progress grid',
);

replaceOnce(
  "          {step === 'draw' && <DrawingActivity learner={learner} lesson={lesson} onDone={finishStep} />}\n",
  "          {step === 'draw' && <DrawingActivity learner={learner} lesson={lesson} onDone={finishStep} />}\n          {step === 'voice' && <VoiceReflection learner={learner} lesson={lesson} onDone={finishStep} />}\n",
  'voice step render',
);

if (source === original) {
  console.log('Voice reflection already integrated.');
} else {
  writeFileSync(path, source);
  console.log('Integrated lightweight voice reflection.');
}
