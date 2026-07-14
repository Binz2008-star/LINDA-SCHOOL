import { motion } from 'framer-motion';
import { Award, BarChart2, Flame, Target, Trash2, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ScoreEntry } from '@/hooks/useScoreHistory';
import { Button } from '@/components/ui/button';

interface ScoreHistoryProps {
  history: ScoreEntry[];
  bestScore: number;
  averageScore: number;
  totalQuizzes: number;
  streak: number;
  onClear: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function ScoreHistory({
  history,
  bestScore,
  averageScore,
  totalQuizzes,
  streak,
  onClear,
}: ScoreHistoryProps) {
  const chartData = [...history]
    .reverse()
    .slice(-14)
    .map((e, i) => ({
      name: formatDate(e.date),
      score: e.score,
      index: i,
    }));

  const stats = [
    { label: 'أفضل نتيجة', value: `${bestScore}%`, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'المتوسط', value: `${averageScore}%`, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'إجمالي الاختبارات', value: totalQuizzes, icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'أيام متتالية', value: streak, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex flex-col items-center gap-2`}>
              <Icon className={`w-6 h-6 ${s.color}`} />
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 text-center">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-gray-800">تطور النتائج (آخر 14 اختبار)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'النتيجة']}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#14B8A6"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
                dot={{ r: 4, fill: '#14B8A6' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400">
          <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">أكمل اختبارَين على الأقل لرؤية الرسم البياني</p>
        </div>
      )}

      {/* Recent Attempts */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">آخر المحاولات</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 gap-1 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              مسح السجل
            </Button>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {history.slice(0, 10).map((e, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      e.score >= 80 ? 'bg-green-100 text-green-700' :
                      e.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {e.score}%
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{e.mode}</div>
                    <div className="text-xs text-gray-400">{e.correct}/{e.total} صحيح</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{formatDate(e.date)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
