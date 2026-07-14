# 🌟 Linda's Quiz App — تطبيق لينيدا للتعلم

> تطبيق تعليمي تفاعلي مصمم خصيصاً لـ **لينيدا** 💙  
> يجمع بين الذكاء الاصطناعي ونظام المكافآت والمراجعة الذكية لبناء الثقة بالنفس.

---

## ✨ المميزات

### 🤖 بابا المعلم — ذكاء اصطناعي بشخصية أبوية
- بعد كل إجابة، يشرح لكِ بابا السبب بأسلوب حنون ودافئ
- يستخدم أمثلة من الحياة اليومية
- يتكيّف مع نقاط ضعفكِ ويشرح بتفصيل أكثر حيث تحتاجين

### 🎮 نظام XP والمستويات
- اكسبي نقاط XP بعد كل اختبار
- 10 مستويات: من "مبتدئة" إلى "ملكة المعرفة 👑"
- 12 إنجاز قابل للفتح

### 📊 تتبع المواضيع الضعيفة
- التطبيق يتذكر المواضيع التي تجدين فيها صعوبة
- يذكّركِ بمراجعتها (Spaced Repetition)
- يظهر دقتكِ في كل موضوع

### 📚 أنواع الاختبارات
- **مختلط** — أسئلة متنوعة
- **عربي / إنجليزي** — حسب اللغة
- **حسب المادة** — اختاري ما تريدين
- **سؤال اليوم** — يتغير كل يوم

---

## 🚀 النشر على Netlify (مجاني)

1. اضغط هنا ⬇️  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Binz2008-star/LINDA-SCHOOL)

2. أو يدوياً:
   - اذهبي إلى [netlify.com](https://netlify.com)
   - اضغطي **"Add new site" → "Import an existing project"**
   - اختاري هذا الـ repo من GitHub
   - Build command: `npm install -g pnpm && pnpm install && pnpm run build`
   - Publish directory: `dist/public`
   - اضغطي **Deploy**

---

## 🔑 إضافة DeepSeek AI (اختياري)

التطبيق يعمل بدون API key، لكن لتفعيل شرح بابا الذكي:

1. احصل على مفتاح مجاني من [platform.deepseek.com](https://platform.deepseek.com)
2. في Netlify → Site settings → Environment variables
3. أضف: `VITE_DEEPSEEK_API_KEY` = مفتاحك

---

## 💻 التشغيل المحلي

```bash
pnpm install
pnpm dev
```

---

*صُنع بكل الحب لـ لينيدا 💙 — بابا فخور فيكِ دائماً*
