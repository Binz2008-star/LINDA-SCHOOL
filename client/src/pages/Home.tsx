import ChildSelector from '@/components/ChildSelector';
import LessonScreen from '@/components/LessonScreen';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import QuizModeSelector from '@/components/QuizModeSelector';
import ResultsScreen from '@/components/ResultsScreen';
import ScoreHistory from '@/components/ScoreHistory';
import SubjectSelector from '@/components/SubjectSelector';
import { useScoreHistory } from '@/hooks/useScoreHistory';
import { useWeakTopics } from '@/hooks/useWeakTopics';
import { useXPSystem } from '@/hooks/useXPSystem';
import { ChildId, CHILDREN, getChild } from '@/lib/children';
import { QuizQuestion, quizQuestions } from '@/lib/quizData';
import { motion } from 'framer-motion';
import { BarChart2, Home as HomeIcon, LogOut, Star, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

type QuizState = 'mode-selection' | 'subject-selection' | 'lesson' | 'quiz' | 'results' | 'stats';
type QuizMode = 'mixed' | 'arabic' | 'english' | 'subject' | 'daily';

const DIFFICULTY_ORDER: Record<QuizQuestion['difficulty'], number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [activeChild, setActiveChild] = useState<ChildId | null>(null);
  const [state, setState] = useState<QuizState>('mode-selection');
  const [mode, setMode] = useState<QuizMode>('mixed');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ index: number; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [lastXPEarned, setLastXPEarned] = useState(0);
  const [levelBeforeQuiz, setLevelBeforeQuiz] = useState(1);

  const child = activeChild ? getChild(activeChild) : CHILDREN.linda;
  const isMale = activeChild ? ['adam', 'noah'].includes(activeChild) : false;

  const {
    history,
    addScore,
    clearHistory,
    bestScore,
    averageScore,
    totalQuizzes,
    streak,
  } = useScoreHistory(child.storageKey);

  const {
    level,
    levelTitleAr,
    levelTitleEn,
    xpInCurrentLevel,
    xpForNextLevel,
    newlyUnlocked,
    addQuizXP,
    addStreakAchievement,
    clearNewlyUnlocked,
  } = useXPSystem(child.storageKey, isMale);

  const prevLevel = useRef(level);
  const { weakTopics, reviewDue, recordAnswer, accuracyFor } = useWeakTopics(child.storageKey);

  if (!activeChild) {
    return <ChildSelector onSelect={setActiveChild} />;
  }

  const allowedDifficulty = DIFFICULTY_ORDER[child.difficulty];

  const selectQuestions = ({
    count,
    language,
    subject,
  }: {
    count: number;
    language?: 'ar' | 'en';
    subject?: string;
  }): QuizQuestion[] => {
    let pool = quizQuestions.filter(question => {
      const matchesLanguage = !language || question.language === language;
      const matchesSubject = !subject || question.subject === subject;
      const matchesDifficulty = DIFFICULTY_ORDER[question.difficulty] <= allowedDifficulty;
      return matchesLanguage && matchesSubject && matchesDifficulty;
    });

    // Never leave a lesson empty. If the foundation pool is too small, add the
    // next difficulty gradually, but keep the selected subject/language.
    if (pool.length < Math.min(4, count)) {
      pool = quizQuestions.filter(question => {
        const matchesLanguage = !language || question.language === language;
        const matchesSubject = !subject || question.subject === subject;
        return matchesLanguage && matchesSubject && question.difficulty !== 'hard';
      });
    }

    return shuffle(pool).slice(0, Math.min(count, pool.length));
  };

  const preparePractice = (selectedMode: QuizMode, subject?: string) => {
    setMode(selectedMode);
    setSelectedSubject(subject ?? null);

    const selectedQuestions = selectQuestions({
      count: selectedMode === 'english' ? 7 : 8,
      language: selectedMode === 'arabic' ? 'ar' : selectedMode === 'english' ? 'en' : undefined,
      subject,
    });

    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setState('lesson');
  };

  const handleSelectMode = (selectedMode: QuizMode) => {
    if (selectedMode === 'subject') {
      setMode(selectedMode);
      setState('subject-selection');
      return;
    }
    preparePractice(selectedMode);
  };

  const handleSelectSubject = (subject: string) => {
    preparePractice('subject', subject);
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    if (showResult) return;

    setAnswers(previous => [...previous, { index: selectedIndex, correct: isCorrect }]);
    setShowResult(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      recordAnswer(
        currentQuestion.subject,
        currentQuestion.lesson ?? currentQuestion.subject,
        isCorrect
      );
    }
  };

  const finishPractice = () => {
    const correct = answers.filter(answer => answer.correct).length;
    const total = answers.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const modeLabel =
      mode === 'subject' && selectedSubject
        ? selectedSubject
        : mode === 'arabic'
          ? 'عربي'
          : mode === 'english'
            ? 'English'
            : mode === 'daily'
              ? 'درس اليوم'
              : 'متنوع';

    addScore({
      score,
      correct,
      total,
      mode: modeLabel,
      subject: selectedSubject ?? undefined,
    });

    setLevelBeforeQuiz(prevLevel.current);
    addQuizXP(score, streak);
    addStreakAchievement(streak);

    const baseXP = Math.round(score * 0.5);
    const streakBonus = Math.min(streak * 5, 20);
    const perfectBonus = score === 100 ? 25 : 0;
    setLastXPEarned(baseXP + streakBonus + perfectBonus);
    setState('results');
  };

  const handleContinue = () => {
    if (!showResult) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(index => index + 1);
      setShowResult(false);
      return;
    }

    finishPractice();
  };

  const handleRestart = () => {
    prevLevel.current = level;
    clearNewlyUnlocked();
    setState('mode-selection');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedSubject(null);
    setLastXPEarned(0);
  };

  const handleSwitchChild = () => {
    setActiveChild(null);
    handleRestart();
  };

  const handleShare = () => {
    const correctCount = answers.filter(answer => answer.correct).length;
    const percentage = answers.length > 0
      ? Math.round((correctCount / answers.length) * 100)
      : 0;
    const text = `🎓 ${child.nameAr} أكمل درساً وتدريباً وحصل على ${percentage}%. الأهم أنه تعلّم وشرح الفكرة خطوة بخطوة.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const correctCount = answers.filter(answer => answer.correct).length;
  const lessonSubject = selectedSubject
    ?? (mode === 'arabic' ? 'اللغة العربية' : mode === 'english' ? 'English' : null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-shrink-0">
              <img
                src={child.photo}
                alt={child.nameAr}
                onError={event => {
                  (event.target as HTMLImageElement).style.display = 'none';
                }}
                className={`w-10 h-10 rounded-full object-cover ring-2 ${child.colorRing}`}
              />
            </div>
            <div>
              <h1 className={`text-base font-bold ${child.colorText} leading-tight arabic-text`} dir="rtl">
                {child.emoji} مدرسة {child.nameAr}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${child.colorText}`}>
                  Lv.{level} {levelTitleAr}
                </span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${child.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
                  />
                </div>
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            {state === 'mode-selection' && (
              <button
                onClick={() => setState('stats')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 text-sm min-h-[44px]"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">التقدم</span>
              </button>
            )}
            {!['mode-selection', 'results'].includes(state) && (
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm min-h-[44px]"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </button>
            )}
            <button
              onClick={handleSwitchChild}
              title="تغيير الطفل"
              className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-100 text-gray-500 min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {state === 'mode-selection' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-9 text-center" dir="rtl">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-xl mx-auto mb-5">
                <div className="relative">
                  <img
                    src={child.photo}
                    alt={child.nameAr}
                    onError={event => {
                      const image = event.target as HTMLImageElement;
                      image.style.display = 'none';
                      const fallback = image.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    className={`w-28 h-28 rounded-full object-cover shadow-xl ring-4 ${child.colorRing}`}
                  />
                  <div
                    style={{ display: 'none' }}
                    className={`w-28 h-28 rounded-full items-center justify-center text-6xl bg-gradient-to-br ${child.color} shadow-xl ring-4 ${child.colorRing}`}
                  >
                    {child.emoji}
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <h2 className={`text-3xl md:text-4xl font-bold arabic-text ${child.colorText}`}>
                    أهلاً يا {child.nameAr}
                  </h2>
                  <p className="text-gray-600 mt-2 arabic-text">
                    اليوم سنتعلم الفكرة أولاً، ثم نتدرب عليها بهدوء.
                  </p>
                </div>
              </div>

              {weakTopics.length > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm arabic-text">
                  📚 سنراجع معاً: <strong>{weakTopics.map(topic => topic.lesson).join('، ')}</strong>
                </div>
              )}
              {reviewDue.length > 0 && weakTopics.length === 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm arabic-text">
                  🔔 حان وقت مراجعة: <strong>{reviewDue.map(topic => topic.lesson).join('، ')}</strong>
                </div>
              )}
            </div>

            <QuizModeSelector onSelectMode={handleSelectMode} />
          </motion.div>
        )}

        {state === 'subject-selection' && (
          <SubjectSelector onSelectSubject={handleSelectSubject} onBack={handleRestart} />
        )}

        {state === 'lesson' && (
          <LessonScreen
            child={child}
            subject={lessonSubject}
            questionCount={questions.length}
            onStartPractice={() => setState('quiz')}
            onBack={handleRestart}
          />
        )}

        {state === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8" dir="rtl">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Star className="w-7 h-7 text-yellow-400" />
                تقدم {child.nameAr}
              </h2>
              <p className="text-gray-500">هذه البيانات خاصة بهذا الحساب فقط.</p>
            </div>
            <ScoreHistory
              history={history}
              bestScore={bestScore}
              averageScore={averageScore}
              totalQuizzes={totalQuizzes}
              streak={streak}
              onClear={clearHistory}
            />
          </motion.div>
        )}

        {state === 'quiz' && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={questions.length}
              correctCount={correctCount}
            />

            <QuizCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
              isAnswered={showResult}
              selectedAnswer={showResult ? answers[currentQuestionIndex]?.index : undefined}
              showResult={showResult}
              weakTopics={weakTopics.map(topic => `${topic.subject} ${topic.lesson}`)}
              accuracyOnTopic={accuracyFor(
                currentQuestion.subject,
                currentQuestion.lesson ?? currentQuestion.subject
              )}
              childProfile={child}
            />

            {showResult && (
              <div className="flex justify-center" dir="rtl">
                <button
                  onClick={handleContinue}
                  className={`bg-gradient-to-r ${child.color} text-white font-bold py-3 px-8 rounded-xl min-h-[50px] shadow-lg active:scale-95 transition-transform arabic-text`}
                >
                  {currentQuestionIndex < questions.length - 1
                    ? 'فهمت الشرح — السؤال التالي'
                    : 'فهمت — اعرض نتيجة التدريب'}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {state === 'results' && (
          <ResultsScreen
            correctCount={correctCount}
            totalCount={answers.length}
            xpEarned={lastXPEarned}
            newLevel={level > levelBeforeQuiz ? level : undefined}
            levelTitleAr={levelTitleAr}
            levelTitleEn={levelTitleEn}
            xpInCurrentLevel={xpInCurrentLevel}
            xpForNextLevel={xpForNextLevel}
            newlyUnlocked={newlyUnlocked}
            onRestart={handleRestart}
            onShare={handleShare}
          />
        )}
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm arabic-text" dir="rtl">
          مدرسة عائلية لليندا وآدم وجودي ونوح — نبدأ من الفهم، لا من الامتحان.
        </div>
      </footer>
    </div>
  );
}
