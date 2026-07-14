import type { Lang } from '@/contexts/LangContext';

type Strings = Record<string, Record<Lang, string>>;

export const UI: Strings = {
  // ── Header / nav ──────────────────────────────────────────────
  schoolOf:         { ar: 'مدرسة', en: 'School of' },
  level:            { ar: 'المستوى', en: 'Level' },
  coins:            { ar: 'عملة', en: 'coins' },
  interactiveTool:  { ar: 'الأداة التفاعلية', en: 'Interactive tool' },
  rewards:          { ar: 'المكافآت', en: 'Rewards' },
  noahGames:        { ar: 'ألعاب نوح', en: "Noah's games" },
  lockAccount:      { ar: 'قفل الحساب', en: 'Lock account' },
  home:             { ar: 'الرئيسية', en: 'Home' },

  // ── Dashboard ─────────────────────────────────────────────────
  welcomeBack:      { ar: 'أهلاً بعودتك', en: 'Welcome back' },
  hey:              { ar: 'يا', en: '' },
  dashboardDesc:    { ar: 'حسابك محمي الآن. تعلّم الدرس، استمع لشرح بابا المعلم، وارفع مستواك من عملك الحقيقي.', en: 'Your account is protected. Study the lesson, listen to the explanation, and level up through real work.' },
  completedLessons: { ar: 'دروس مكتملة', en: 'Lessons done' },
  earnedCoins:      { ar: 'عملات المكافآت', en: 'Reward coins' },
  todayPlan:        { ar: 'خطة اليوم', en: "Today's plan" },
  allDone:          { ar: 'أكملت جميع الدروس الحالية', en: 'All current lessons complete!' },
  subjects:         { ar: 'المواد والمسارات', en: 'Subjects & tracks' },
  allSubjects:      { ar: 'كل المواد', en: 'All subjects' },
  interestTrack:    { ar: 'مسار', en: 'Track:' },
  noahGamesSection: { ar: 'ألعاب نوح', en: "Noah's Games" },
  noahGamesDesc:    { ar: 'XP مضاعف لأنك بطل السيارات! ⚡×2', en: 'Double XP because you are the car champion! ⚡×2' },
  noahGamesList:    { ar: 'سباق سيارات • بطاقات • ترتيب • ركن السيارة', en: 'Race quiz • Memory cards • Sort • Park the car' },
  noahGamesCount:   { ar: '4 ألعاب تفاعلية خاصة بنوح', en: '4 interactive games for Noah' },
  playNow:          { ar: 'العب الآن', en: 'Play now' },

  // ── Lesson view ────────────────────────────────────────────────
  backToLessons:    { ar: 'الدروس', en: 'Lessons' },
  backToExplain:    { ar: 'الشرح', en: 'Explanation' },
  backToActivity:   { ar: 'النشاط', en: 'Activity' },
  studiedBefore:    { ar: 'تمت دراسته سابقاً ✓', en: 'Studied before ✓' },
  listenExplain:    { ar: 'اسمع الشرح', en: 'Listen to explanation' },
  whatWeLearn:      { ar: 'ماذا سنتعلم؟', en: 'What will we learn?' },
  explanation:      { ar: 'الشرح', en: 'Explanation' },
  example:          { ar: 'مثال', en: 'Example' },
  remember:         { ar: 'تذكّر', en: 'Remember' },
  goToActivity:     { ar: 'انتقل للنشاط العملي', en: 'Go to activity' },
  quickReview:      { ar: 'مراجعة سريعة', en: 'Quick review' },
  listenQuestion:   { ar: 'اسمع السؤال', en: 'Listen to question' },
  correctAnswer:    { ar: '✅ إجابة صحيحة!', en: '✅ Correct answer!' },
  understandAnswer: { ar: '💡 لنفهم الإجابة:', en: '💡 Let\'s understand the answer:' },
  nextQuestion:     { ar: 'السؤال التالي ←', en: 'Next question →' },
  finishLesson:     { ar: '🏁 انهِ الدرس', en: '🏁 Finish lesson' },
  lessonComplete:   { ar: 'أكملت الدرس يا', en: 'You completed the lesson,' },
  explainActivity:  { ar: 'شرح + نشاط + مراجعة ✓', en: 'Explain + activity + review ✓' },
  backToDashboard:  { ar: 'العودة للدروس', en: 'Back to lessons' },
  repeatLesson:     { ar: 'أعد الدرس', en: 'Repeat lesson' },
  goToReview:       { ar: 'انتقل للمراجعة', en: 'Go to review' },
  skipActivity:     { ar: 'تخطي النشاط', en: 'Skip activity' },

  // ── Activity sub-labels ────────────────────────────────────────
  tapCardsTitle:    { ar: '👆 اضغط على كل بطاقة وتعرّف عليها', en: '👆 Tap each card to learn it' },
  mathCountTitle:   { ar: '🔢 نشاط العد', en: '🔢 Counting activity' },
  countInstruct:    { ar: 'اضغط + حتى تصل إلى', en: 'Tap + until you reach' },
  wellDone:         { ar: '✅ أحسنت!', en: '✅ Well done!' },
  englishMatchTitle:{ ar: '🔤 طابق الكلمة الإنجليزية', en: '🔤 Match the English word' },
  englishMatchHint: { ar: 'اضغط البطاقة لتسمع النطق وترى المعنى', en: 'Tap the card to hear it and see the meaning' },
  wordSortTitle:    { ar: '✍️ نشاط عملي', en: '✍️ Hands-on activity' },
  wordSortHint:     { ar: 'رتّب الكلمات لتكوين الفكرة:', en: 'Arrange the words to form the idea:' },
  wordSortPlaceholder: { ar: 'اضغط الكلمات أدناه…', en: 'Tap the words below…' },
  deleteLast:       { ar: '← حذف', en: 'Delete ←' },

  // ── Access gate ────────────────────────────────────────────────
  chooseChild:      { ar: 'من يدرس الآن؟', en: 'Who is studying now?' },
  enterPin:         { ar: 'أدخل رمز الدخول', en: 'Enter access PIN' },
  parentArea:       { ar: 'منطقة الوالدين', en: 'Parent area' },
  wrongPin:         { ar: 'رمز خاطئ، حاول مجدداً', en: 'Wrong PIN, try again' },

  // ── Footer ─────────────────────────────────────────────────────
  footerText:       { ar: 'مدرسة ليندا وآدم وجودي ونوح — حساب محمي، تعليم حقيقي، ومكافآت بموافقة الأب.', en: 'Linda, Adam, Judy & Noah School — protected accounts, real learning, rewards with parent approval.' },
};

export function s(key: keyof typeof UI, lang: Lang): string {
  return UI[key]?.[lang] ?? UI[key]?.ar ?? key;
}
