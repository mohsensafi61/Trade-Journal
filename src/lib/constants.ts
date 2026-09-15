import type { ChecklistSectionDef, SystemFieldDef, ExecCheckDef } from '@/types';

// ─── Checklist Sections ───
export const CHECKLIST_SECTIONS: ChecklistSectionDef[] = [
  {
    id: 'physical',
    title: 'ورودی‌های بدنی و روحی',
    subtitle: 'حالت بدن و ذهنت رو قبل از تحلیل بسنج',
    items: [
      { id: 'sleep', label: 'خواب کافی و باکیفیت داشتم' },
      { id: 'food', label: 'تغذیه‌ام مناسب بوده و قندم افت‌وخیز نداره' },
      { id: 'exercise', label: 'امروز بدنم رو حرکت دادم' },
      { id: 'pain', label: 'درد جسمی یا ناراحتی‌ای که حواسمو پرت کنه ندارم' },
      { id: 'life_stress', label: 'دعوا، مشکل مالی یا کار عقب‌افتاده‌ای ذهنمو درگیر نکرده' },
      { id: 'energy', label: 'انرژی و تمرکز کافی برای تصمیم‌گیری دارم' },
    ],
  },
  {
    id: 'beliefs',
    title: 'ورودی‌های فکری و باورها',
    subtitle: 'با چشمات چارت رو می‌بینی، با باورهات تفسیرش می‌کنی',
    items: [
      { id: 'belief_market', label: 'می‌دونم بازار قابل پیش‌بینی نیست؛ کارم تحلیله نه پیش‌بینی' },
      { id: 'belief_money', label: 'پول برام فقط یک عدده، نه معیار امنیتم' },
      { id: 'belief_self', label: 'مسئولیت نتیجه با خودمه؛ خودمو قربانی بازار نمی‌دونم' },
      { id: 'belief_loss', label: 'استاپ رو هزینه‌ی فرصت می‌دونم، نه شکست' },
      { id: 'belief_profit', label: 'سود رو نتیجه‌ی درست عمل‌کردن به سیستم می‌دونم، نه نبوغ خودم' },
      { id: 'belief_business', label: 'تریدو یک بیزینس می‌بینم، نه قمار' },
      { id: 'belief_values', label: 'امروز دنبال رشد تدریجی‌ام، نه پولدار شدن سریع' },
    ],
  },
  {
    id: 'info',
    title: 'ورودی‌های اطلاعاتی',
    subtitle: 'داده خنثی‌ست؛ این تویی که بهش معنا می‌دی',
    items: [
      { id: 'chart', label: 'نمودار قیمت رو طبق قوانین خودم بررسی کردم (کندل، الگو، لول، تعادل)' },
      { id: 'econ_news', label: 'اخبار اقتصادی مهم امروز رو چک کردم (نرخ بهره، اشتغال، بانک مرکزی)' },
      { id: 'geo_news', label: 'اخبار سیاسی و جهانی مهم رو چک کردم' },
      { id: 'social', label: 'تحت تاثیر شبکه‌های اجتماعی، تحلیل دیگران یا کانال سیگنال نیستم' },
    ],
  },
  {
    id: 'rules',
    title: 'ورودی‌های قوانین و سیستم',
    subtitle: 'بدون قوانین، هر لحظه باید از صفر تصمیم بگیری',
    items: [
      { id: 'entry_clear', label: 'شرایط ورود امروزم دقیقا طبق سیستمم مشخص و قابل تکراره' },
      { id: 'exit_set', label: 'حد ضرر و حد سود رو از قبل تعیین کردم' },
      { id: 'size_ok', label: 'حجم معامله متناسب با ریسک و روانمه' },
      { id: 'stop_rule', label: 'قانون توقفم رو می‌دونم (بعد چند ضرر متوالی دست می‌کشم)' },
      { id: 'time_rule', label: 'می‌دونم امروز تو چه بازه‌ی زمانی تحلیل و ترید می‌کنم' },
      { id: 'pair_rule', label: 'می‌دونم امروز فقط رو چه جفت‌ارز یا کامودیتی تمرکز می‌کنم' },
      { id: 'news_rule', label: 'قانون خبری‌م رو می‌دونم (قبل خبر ترید می‌کنم یا صبر؟)' },
      { id: 'psych_rule', label: 'می‌دونم بعد ضرر و بعد سود دقیقا چیکار باید بکنم' },
    ],
  },
];

// ─── System Fields ───
export const SYSTEM_FIELDS: SystemFieldDef[] = [
  { id: 'entry', label: 'شرایط ورود به بازار', hint: 'دقیقا چه شرایطی باعث ورودت به بازار می‌شه؟ باید شفاف و قابل تکرار باشه.' },
  { id: 'exit', label: 'شرایط خروج از بازار', hint: 'حد ضرر و حد سودت رو چطور تعیین می‌کنی؟' },
  { id: 'sizing', label: 'حجم معامله', hint: 'چه لات‌سایزی وارد می‌شی که هم با روانت سازگار باشه هم با سیستمت؟' },
  { id: 'stop_rule', label: 'قانون توقف', hint: 'بعد از چند معامله‌ی ضررده‌ی متوالی باید دست بکشی؟' },
  { id: 'time_rule', label: 'قانون زمان', hint: 'چه ساعتی تحلیل رو شروع می‌کنی؟ تو کدوم تایم‌فریم چیکار می‌کنی؟' },
  { id: 'instruments', label: 'جفت‌ارز یا کامودیتی', hint: 'دقیقا رو چی معامله می‌کنی؟ نباید هی از این به اون بپری.' },
  { id: 'news_rule', label: 'قانون اخبار', hint: 'قبل از خبرهای مهم چیکار می‌کنی؛ ترید می‌کنی یا صبر؟' },
  { id: 'psych_rule', label: 'قانون روانی', hint: 'بعد از ضرر چیکار می‌کنی؟ بعد از سود چی؟' },
];

// ─── Execution Checks ───
export const EXEC_CHECKS: ExecCheckDef[] = [
  { id: 'exec_button', label: 'دکمه بای/سل رو درست زدم' },
  { id: 'exec_size', label: 'حجم معامله درست وارد شد' },
  { id: 'exec_sl_change', label: 'تغییر استاپ/ریسک‌فری (اگه بود) طبق قانون بود، نه احساس لحظه‌ای' },
  { id: 'exec_reaction', label: 'واکنشم نزدیک استاپ/تی‌پی طبق قوانین بود' },
];

// ─── Fear Options ───
export const FEAR_OPTIONS = [
  'ترس از ضرر',
  'ترس از دست دادن فرصت',
  'ترس از ورود (به‌خاطر ضرر قبلی)',
];

// ─── Seed Forbidden Items ───
export const SEED_FORBIDDEN = [
  'جابه‌جا کردن استاپ‌لاس بعد از ورود',
  'معامله بعد از ۳ ضرر متوالی',
  'ورود تحت تاثیر تحلیل یا سیگنال دیگران',
];

// ─── Nav Links ───
export const NAV_LINKS = [
  { href: '/dashboard', label: 'داشبورد', icon: 'LayoutDashboard' },
  { href: '/checklist', label: 'چک‌لیست روزانه', icon: 'ClipboardCheck' },
  { href: '/system', label: 'سیستم معاملاتی', icon: 'Settings' },
  { href: '/forbidden', label: 'ممنوعیت‌ها', icon: 'Ban' },
  { href: '/journal', label: 'ژورنال', icon: 'BookOpen' },
  { href: '/stats', label: 'آمار و روند', icon: 'BarChart3' },
  { href: '/settings', label: 'تنظیمات', icon: 'Settings2' },
] as const;

// ─── Learning Types ───
export const LEARNING_TYPES = [
  { value: 'pattern', label: 'شناخت الگو یا خطای جدید' },
  { value: 'belief', label: 'به‌روزرسانی یک باور' },
  { value: 'stat', label: 'آمار جدید درباره خودم' },
  { value: 'rule', label: 'نیاز به تغییر یک قانون' },
] as const;
