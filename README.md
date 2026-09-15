# پنل سیستم معاملاتی

وب‌اپلیکیشن مدیریت سیستم معاملاتی با Next.js + Supabase.

## قابلیت‌ها

- ✅ **احراز هویت**: Email/Password + Magic Link + OAuth (Google)
- ✅ **چک‌لیست روزانه**: ۴ دسته ورودی (بدنی/فکری/اطلاعاتی/قوانین)
- ✅ **سیستم معاملاتی**: ذخیره قوانین ثابت
- ✅ **ممنوعیت‌ها**: لیست کارهای ممنوعه
- ✅ **ژورنال**: ثبت معاملات با بعد روانی و اطلاعاتی
- ✅ **آمار و روند**: نرخ برد، پایبندی، ارزیابی سیستمی
- ✅ **RLS**: هر کاربر فقط داده‌های خودش
- ✅ **RTL + تم تیره**: با فونت وزیرمتر

## راه‌اندازی

### ۱. نصب وابستگی‌ها

```bash
npm install
```

### ۲. راه‌اندازی Supabase

```bash
# نصب Supabase CLI (اگر نداری)
npm i -g supabase

# راه‌اندازی محلی
supabase init
supabase start

# یا ایجاد پروژه ابری در https://supabase.com
```

### ۳. تنظیم متغیرهای محیطی

`.env.local` رو با اطلاعات پروژه Supabase پر کن:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### ۴. اجرای مایگریشن‌ها

```bash
supabase db reset  # برای محیط محلی
# یا فایل‌های supabase/migrations/*.sql رو در Supabase Dashboard اجرا کن
```

### ۵. اجرای پروژه

```bash
npm run dev
```

## ساختار پروژه

```
src/
├── app/
│   ├── (auth)/         # صفحات احراز هویت
│   ├── (app)/          # صفحات محافظت‌شده
│   └── auth/callback/  # callback مسیر احراز هویت
├── hooks/              # React hooks برای CRUD داده‌ها
├── lib/                # Supabase client/server + ثابت‌ها
└── types/              # Type‌های TypeScript
```

## دیپلوی

### Vercel (پیشنهادی)

```bash
npm run build
```

پروژه رو به Vercel متصل کن و متغیرهای محیطی رو در Vercel Dashboard تنظیم کن.

## تکنولوژی‌ها

- [Next.js 15](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vazirmatn Font](https://fontsource.org/fonts/vazirmatn)
