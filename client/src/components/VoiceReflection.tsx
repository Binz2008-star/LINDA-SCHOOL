import { LearnerProfile, SchoolLesson } from '@/lib/familyCurriculum';
import { Mic, Play, RotateCcw, ShieldCheck, Square, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  learner: LearnerProfile;
  lesson: SchoolLesson;
  onDone: () => void;
}

type RecorderState = 'idle' | 'requesting' | 'recording' | 'ready' | 'unsupported' | 'denied';

function getPrompt(learner: LearnerProfile, lesson: SchoolLesson): string {
  if (learner.id === 'noah') return `قل بصوتك كلمة أو جملة قصيرة عن ${lesson.title}. لا بأس إن احتجت مساعدة من بابا.`;
  if (learner.id === 'judy') return `اشرحي في نصف دقيقة ما فهمتِه من ${lesson.title}، وأضيفي مثالاً من الرياضة أو الحركة.`;
  if (learner.id === 'adam') return `اشرح الفكرة كأنك تعرض اختراعاً: ما المشكلة، وما الفكرة التي تعلمتها، وكيف يمكن استخدامها؟`;
  return `لخّصي الفكرة بصوتك، ثم اذكري سبباً أو نتيجة أو سؤالاً ما زلتِ تفكرين فيه.`;
}

export default function VoiceReflection({ learner, lesson, onDone }: Props) {
  const prompt = useMemo(() => getPrompt(learner, lesson), [learner, lesson]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const [state, setState] = useState<RecorderState>(() => {
    if (typeof window === 'undefined') return 'unsupported';
    return navigator.mediaDevices?.getUserMedia && 'MediaRecorder' in window ? 'idle' : 'unsupported';
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const removeRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
    setState('idle');
  };

  useEffect(() => () => {
    clearTimer();
    cleanupStream();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const startRecording = async () => {
    setState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        clearTimer();
        cleanupStream();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (!blob.size) {
          setState('idle');
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState('ready');
      };
      recorder.start();
      setSeconds(0);
      setState('recording');
      timerRef.current = window.setInterval(() => {
        setSeconds(current => {
          if (current >= 44) {
            recorder.stop();
            return 45;
          }
          return current + 1;
        });
      }, 1000);
    } catch {
      cleanupStream();
      setState('denied');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const canContinue = state === 'ready' || state === 'unsupported' || state === 'denied';

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start" dir="rtl">
      <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 md:p-7">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${learner.theme.gradient} text-white flex items-center justify-center`}><Mic className="w-7 h-7" /></div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 arabic-text">اشرح بصوتك</h2>
            <p className="text-gray-600 mt-2 leading-loose arabic-text">{prompt}</p>
          </div>
        </div>

        <div className={`rounded-3xl border-2 p-6 text-center ${state === 'recording' ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
          {state === 'recording' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500 text-white mx-auto flex items-center justify-center animate-pulse"><Mic className="w-9 h-9" /></div>
              <p className="mt-4 text-2xl font-black text-red-700">00:{String(seconds).padStart(2, '0')}</p>
              <p className="text-sm text-red-600 mt-2 arabic-text">التسجيل يتوقف تلقائياً بعد 45 ثانية</p>
              <button type="button" onClick={stopRecording} className="mt-5 min-h-[50px] px-6 rounded-xl bg-red-600 text-white font-black arabic-text inline-flex items-center gap-2"><Square className="w-5 h-5" /> أوقف التسجيل</button>
            </>
          ) : state === 'ready' && audioUrl ? (
            <>
              <p className="font-black text-gray-900 arabic-text mb-4">استمع لشرحك قبل المتابعة</p>
              <audio controls src={audioUrl} className="w-full" />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => { removeRecording(); void startRecording(); }} className="min-h-[46px] px-4 rounded-xl bg-blue-50 text-blue-700 font-bold arabic-text inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> أعد التسجيل</button>
                <button type="button" onClick={removeRecording} className="min-h-[46px] px-4 rounded-xl bg-red-50 text-red-700 font-bold arabic-text inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> احذف</button>
              </div>
            </>
          ) : state === 'denied' ? (
            <div><p className="font-black text-amber-900 arabic-text">لم يسمح الجهاز باستخدام الميكروفون.</p><p className="text-sm text-amber-800 mt-2 arabic-text">يمكنك السماح به من إعدادات المتصفح أو متابعة الدرس دون تسجيل.</p></div>
          ) : state === 'unsupported' ? (
            <div><p className="font-black text-gray-800 arabic-text">الميكروفون غير متاح في هذا المتصفح.</p><p className="text-sm text-gray-600 mt-2 arabic-text">تابع الدرس بشكل طبيعي؛ التسجيل ميزة مساعدة وليست حاجزاً.</p></div>
          ) : (
            <button type="button" disabled={state === 'requesting'} onClick={startRecording} className={`min-h-[58px] px-7 rounded-2xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text inline-flex items-center gap-3 disabled:opacity-50`}>
              {state === 'requesting' ? 'نطلب إذن الميكروفون...' : <><Mic className="w-6 h-6" /> ابدأ التسجيل</>}
            </button>
          )}
        </div>

        <button type="button" disabled={!canContinue} onClick={onDone} className={`w-full mt-6 min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text disabled:opacity-40 inline-flex items-center justify-center gap-2`}>
          <Play className="w-5 h-5" /> أكملت شرح الفكرة
        </button>
      </section>

      <aside className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5">
        <ShieldCheck className="w-7 h-7 text-emerald-700" />
        <h3 className="font-black mt-3 text-emerald-950 arabic-text">خصوصية التسجيل</h3>
        <p className="mt-2 leading-loose text-emerald-950/80 arabic-text">التسجيل يبقى مؤقتاً داخل هذه الصفحة. لا يُرفع إلى DeepSeek، ولا يُرسل إلى الخادم، ويُحذف عند مغادرة الدرس أو تحديث الصفحة.</p>
      </aside>
    </div>
  );
}
