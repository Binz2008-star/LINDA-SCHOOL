import ChildSelector from '@/components/ChildSelector';
import LessonScreen from '@/components/LessonScreen';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import QuizModeSelector from '@/components/QuizModeSelector';
import ResultsScreen from '@/components/ResultsScreen';
import RewardsScreen from '@/components/RewardsScreen';
import ScoreHistory from '@/components/ScoreHistory';
import SubjectSelector from '@/components/SubjectSelector';
import { useRewards } from '@/hooks/useRewards';
import { useScoreHistory } from '@/hooks/useScoreHistory';
import { useWeakTopics } from '@/hooks/useWeakTopics';
import { useXPSystem } from '@/hooks/useXPSystem';
import { ChildId, ChildProfile, CHILDREN, getChild } from '@/lib/children';
import { getDailyQuestions, getQuestionsBySubject, QuizQuestion } from '@/lib/quizData';
import { motion } from 'framer-motion';
import { BarChart2, Gift, Home as HomeIcon, LogOut, MessageCircle, Star, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

function ChildAvatar({ child, className }: { child: ChildProfile; className: string }) {
  const [err, setErr] = useState(false);
  if (!err) {
    return (
      <img
        src={child.photo}
        alt={child.nameAr}
        onError={() => setErr(true)}
        className={className}
      />
    );
  }
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br ${child.color} text-3xl`}>
      {child.emoji}
    </div>
  );
}

type QuizState = 'mode-selection' | 'subject-selection' | 'quiz' | 'results' | 'stats' | 'lessons' | 'rewards';
type QuizMode = 'mixed' | 'arabic' | 'english' | 'subject' | 'daily';

const WHATSAPP_NUMBER = '0528688396';

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

  const child = activeChild ? getChild(activeChild) : CHILDREN['linda'];
  const isMale = activeChild ? ['adam', 'noah'].includes(activeChild) : false;
  const { availableCoins, addXP: addRewardXP } = useRewards(child.storageKey);

  const { history, addScore, clearHistory, bestScore, averageScore, totalQuizzes, streak } = useScoreHistory();
  const {
    level, levelTitleAr, levelTitleEn, xpInCurrentLevel, xpForNextLevel,
    newlyUnlocked, addQuizXP, addStreakAchievement, clearNewlyUnlocked,
  } = useXPSystem(child.storageKey, isMale);
  const prevLevel = useRef(level);
  const { weakTopics, reviewDue, recordAnswer, accuracyFor } = useWeakTopics(child.storageKey);

  // Show child selector first
  if (!activeChild) {
    return <ChildSelector onSelect={(id) => setActiveChild(id)} />;
  }

  const handleSelectMode = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    if (selectedMode === 'subject') {
      setState('subject-selection');
      return;
    }
    let selectedQuestions: QuizQuestion[] = [];
    if (selectedMode === 'mixed') {
      selectedQuestions = getDailyQuestions(10);
    } else if (selectedMode === 'arabic') {
      selectedQuestions = getDailyQuestions(8, 'ar');
    } else if (selectedMode === 'english') {
      selectedQuestions = getDailyQuestions(7, 'en');
    } else if (selectedMode === 'daily') {
      selectedQuestions = getDailyQuestions(10);
    }
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setState('quiz');
  };

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    const qs = getQuestionsBySubject(subject).sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(qs);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setState('quiz');
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    const newAnswers = [...answers, { index: selectedIndex, correct: isCorrect }];
    setAnswers(newAnswers);
    setShowResult(true);
    if (currentQuestion) {
      recordAnswer(currentQuestion.subject, currentQuestion.lesson ?? currentQuestion.subject, isCorrect);
    }
    // Navigation is handled by onNext inside QuizCard — no auto-advance here
  };

  const handleFinishQuiz = (finalAnswers: { index: number; correct: boolean }[]) => {
    const correct = finalAnswers.filter(a => a.correct).length;
    const total = finalAnswers.length;
    const score = Math.round((correct / total) * 100);
    const modeLabel =
      mode === 'subject' && selectedSubject ? selectedSubject :
        mode === 'arabic' ? 'عربي' :
          mode === 'english' ? 'English' :
            mode === 'daily' ? 'يومي' : 'Mixed';
    addScore({ score, correct, total, mode: modeLabel, subject: selectedSubject ?? undefined });
    setLevelBeforeQuiz(prevLevel.current);
    addQuizXP(score, streak);
    addStreakAchievement(streak);
    const baseXP = Math.round(score * 0.5);
    const streakBonus = Math.min(streak * 5, 20);
    const perfectBonus = score === 100 ? 25 : 0;
    const totalXP = baseXP + streakBonus + perfectBonus;
    setLastXPEarned(totalXP);
    addRewardXP(totalXP);
    setState('results');
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

  const handleShare = () => {
    const correctCount = answers.filter(a => a.correct).length;
    const percentage = Math.round((correctCount / answers.length) * 100);
    const text = `🎉 ${child.nameAr} حصل${isMale ? '' : 'ت'} على ${percentage}% في تحدي التعلم! هل تستطيع التفوق عليّ؟ 🚀`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const correctCount = answers.filter(a => a.correct).length;

  const today = new Date();
  const dateLabel = today.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* Child avatar */}
            <div className="relative flex-shrink-0">
              <ChildAvatar child={child} className={`w-10 h-10 rounded-full object-cover ring-2 ${child.colorRing}`} />
            </div>
            <div>
              <h1 className={`text-base font-bold ${child.colorText} leading-tight arabic-text`} dir="rtl">
                {child.emoji} {child.nameAr}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${child.colorText}`}>Lv.{level} {levelTitleAr}</span>
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
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setState('stats')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 font-medium text-sm min-h-[44px]"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">النتائج</span>
              </motion.button>
            )}
            {(state === 'quiz' || state === 'subject-selection' || state === 'stats') && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm min-h-[44px]"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </motion.button>
            )}
            {/* Rewards button */}
            {state === 'mode-selection' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setState('rewards')}
                className={`relative flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors ${child.colorText} text-sm min-h-[44px]`}
                title="مكافآتي"
              >
                <Gift className="w-4 h-4" />
                {availableCoins > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center">
                    {availableCoins > 9 ? '9+' : availableCoins}
                  </span>
                )}
              </motion.button>
            )}
            {/* Switch child button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setActiveChild(null);
                setState('mode-selection');
                setQuestions([]);
                setAnswers([]);
              }}
              title="تغيير الطفل"
              className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 text-sm min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {state === 'mode-selection' && (
          <motion.div
            key="mode-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <div className="mb-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                {/* Child hero card */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto">
                  <div className="relative flex-shrink-0">
                    <ChildAvatar child={child} className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover shadow-xl ring-4 ${child.colorRing}`} />
                    <span className="absolute -bottom-1 -right-1 text-2xl">{child.interestEmoji}</span>
                  </div>
                  <div className="text-center sm:text-right" dir="rtl">
                    <h2 className={`text-3xl md:text-4xl font-bold arabic-text ${child.colorText}`}>أهلاً يا {child.nameAr}! 💙</h2>
                    <p className="text-base text-gray-500 mt-1 arabic-text">{child.dadToneAr} — بابا فخور فيك!</p>
                    <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${child.colorLight} ${child.colorText} border ${child.colorBorder}`} dir="rtl">
                      <span>{child.interestEmoji}</span>
                      <span>{child.interest}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-lg text-gray-600 max-w-2xl mx-auto arabic-text" dir="rtl">
                  كل سؤال يجعلك أذكى! 🌟 العلم رحلة رائعة — هيا نبدأ
                </p>
                {/* Weak topics reminder */}
                {weakTopics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium arabic-text"
                    dir="rtl"
                  >
                    <span>📚</span>
                    <span>{isMale ? 'يحتاج مراجعة' : 'تحتاجين مراجعة'}: <strong>{weakTopics.map(t => t.lesson).join('، ')}</strong></span>
                  </motion.div>
                )}
                {reviewDue.length > 0 && weakTopics.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm font-medium arabic-text"
                    dir="rtl"
                  >
                    <span>🔔</span>
                    <span>حان وقت مراجعة: <strong>{reviewDue.map(t => t.lesson).join('، ')}</strong></span>
                  </motion.div>
                )}
                {streak > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold"
                  >
                    🔥 {streak} {streak === 1 ? 'يوم' : 'أيام'} متتالية!
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Lessons entry button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 flex justify-center"
            >
              <button
                onClick={() => setState('lessons')}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white text-lg
                  bg-gradient-to-r ${child.color} shadow-lg shadow-gray-200 active:scale-95 transition-all
                  w-full max-w-md justify-center`}
              >
                <span className="text-2xl">📚</span>
                <span className="arabic-text">دروس {child.nameAr} التعليمية</span>
                <Star className="w-5 h-5 fill-white/80" />
              </button>
            </motion.div>

            {/* Mode Selector */}
            <QuizModeSelector onSelectMode={handleSelectMode} />

            {/* WhatsApp Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex justify-center"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('🎯 ذكّرني بالاختبار اليومي!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-green-200 min-h-[44px]"
              >
                <MessageCircle className="w-5 h-5" />
                تفعيل تذكير WhatsApp اليومي
              </a>
            </motion.div>
          </motion.div>
        )}

        {state === 'lessons' && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LessonScreen
              child={child}
              onBack={() => setState('mode-selection')}
            />
          </motion.div>
        )}

        {state === 'subject-selection' && (
          <motion.div
            key="subject-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SubjectSelector
              onSelectSubject={handleSelectSubject}
              onBack={handleRestart}
            />
          </motion.div>
        )}

        {state === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Star className="w-7 h-7 text-yellow-400" />
                إحصائياتك
              </h2>
              <p className="text-gray-500">تتبّع تقدّمك ونتائجك</p>
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
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Progress */}
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={questions.length}
              correctCount={correctCount}
            />

            {/* Quiz Card — next/finish buttons are inside the card */}
            <QuizCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setShowResult(false);
                } else {
                  setState('results');
                }
              }}
              isAnswered={showResult}
              isLast={currentQuestionIndex === questions.length - 1}
              selectedAnswer={
                showResult ? answers[currentQuestionIndex]?.index : undefined
              }
              showResult={showResult}
              weakTopics={weakTopics.map(t => `${t.subject} ${t.lesson}`)}
              accuracyOnTopic={accuracyFor(currentQuestion.subject, currentQuestion.lesson ?? currentQuestion.subject)}
              childProfile={child}
            />
          </motion.div>
        )}

        {state === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
              childProfile={child}
            />
          </motion.div>
        )}

        {state === 'rewards' && (
          <RewardsScreen
            child={child}
            onBack={() => setState('mode-selection')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm space-y-3">
          <p>صُنع بـ ❤️ لأبطالنا — لينيدا وآدم وجودي ونوح 💙</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            تواصل عبر WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
