import { ChildProfile } from '@/lib/children';
import { getLessonPlan } from '@/lib/lessonData';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Lightbulb, Target } from 'lucide-react';

interface LessonScreenProps {
  child: ChildProfile;
  subject?: string | null;
  questionCount: number;
  onStartPractice: () => void;
  onBack: () => void;
}

export default function LessonScreen({
  child,
  subject,
  questionCount,
  onStartPractice,
  onBack,
}: LessonScreenProps) {
  const lesson = getLessonPlan(subject, child);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className={`h-2 bg-gradient-to-r ${child.color}`} />

        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-7">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${child.color} text-white flex items-center justify-center shadow-md`}>
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className={`text-sm font-semibold ${child.colorText} arabic-text`}>
                درس {child.nameAr}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 arabic-text">
                {lesson.title}
              </h2>
              <p className="text-gray-500 mt-1 arabic-text">{lesson.subtitle}</p>
            </div>
          </div>

          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className={`w-5 h-5 ${child.colorText}`} />
              <h3 className="font-bold text-gray-900 arabic-text">ماذا سنتعلم؟</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {lesson.goals.map(goal => (
                <div key={goal} className="flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 arabic-text">{goal}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-5">
            <h3 className="font-bold text-blue-900 mb-2 arabic-text">الشرح</h3>
            <p className="text-blue-950/80 leading-loose arabic-text">{lesson.explanation}</p>
          </section>

          <section className={`rounded-2xl ${child.colorLight} border ${child.colorBorder} p-5 mb-5`}>
            <h3 className={`font-bold ${child.colorText} mb-2 arabic-text`}>
              {child.interestEmoji} {lesson.exampleTitle}
            </h3>
            <p className="text-gray-800 leading-loose arabic-text">{lesson.example}</p>
          </section>

          <section className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-7">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 mb-1 arabic-text">تذكّر</h3>
                <p className="text-amber-900/80 arabic-text leading-relaxed">{lesson.remember}</p>
              </div>
            </div>
          </section>

          <div className="rounded-2xl bg-violet-50 border border-violet-100 p-4 mb-7 text-center">
            <p className="text-violet-900 arabic-text">{lesson.practicePrompt}</p>
            <p className="text-xs text-violet-600 mt-2 arabic-text">
              التدريب يحتوي على {questionCount} أسئلة، والشرح سيبقى حتى تضغط بنفسك على «فهمت، التالي».
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartPractice}
              className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${child.color} text-white font-bold px-7 py-3 rounded-xl min-h-[48px] shadow-md active:scale-95 transition-transform arabic-text`}
            >
              فهمت الدرس — ابدأ التدريب
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl min-h-[48px] border border-gray-200 text-gray-600 hover:bg-gray-50 arabic-text"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
