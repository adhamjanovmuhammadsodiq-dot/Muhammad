import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'uz_cyrl' | 'ru' | 'en';

export interface Translations {
  appName: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  viewTests: string;
  blitzButton: string;
  blitzDesc: string;
  mistakesButton: string;
  mistakesDesc: string;
  officialBadge: string;
  officialDesc: string;
  testsTitle: string;
  testsSubtitle: string;
  searchPlaceholder: string;
  allSubjects: string;
  allFormats: string;
  navTests: string;
  navResults: string;
  navMistakes: string;
  navRating: string;
  navTeacher: string;
  teacherAdmin: string;
  becomeTeacher: string;
  signIn: string;
  signOut: string;
  startTest: string;
  questionsCount: string;
  minutes: string;
  passingScore: string;
  finishTest: string;
  next: string;
  prev: string;
  submit: string;
  questionMap: string;
  calculator: string;
  scratchpad: string;
  answered: string;
  unanswered: string;
  reviewFlag: string;
  modalFinishTitle: string;
  modalFinishDesc: string;
  yourName: string;
  confirmFinish: string;
  continueSolving: string;
  retake: string;
  printCert: string;
  backToTests: string;
  resultsTitle: string;
  cosmicTheme: string;
}

const DICTIONARY: Record<Language, Translations> = {
  uz: {
    appName: "Bilim Arena",
    tagline: "Professional onlayn ta'lim va imtihon platformasi",
    heroBadge: "O'zbekistonning innovatsion kosmik ta'lim va test arenasi",
    heroTitle: "Bilim Arena — Kuchingizni Kosmik Imtihonda Sinang",
    heroDesc: "DTM standarti, xalqaro olimpiada savollari va kasbiy sertifikatlar. Test davomiyligi: 5 daqiqa. Natijalarni soniyalarda oling.",
    viewTests: "Testlarni ko'rish",
    blitzButton: "Tezkor Blitz (5 daqiqa)",
    blitzDesc: "5 ta tasodifiy savoldan iborat 5 daqiqalik chaqqonlik sinovi.",
    mistakesButton: "Xatolar Banki",
    mistakesDesc: "Avval xato qilgan savollaringizni tahlil qiling va qayta ishlang.",
    officialBadge: "DTM va Milliy Sertifikat",
    officialDesc: "Oliy ta'lim muassasalariga kirish standartidagi rasmiy testlar.",
    testsTitle: "Imtihonlar va Fan Testlari (5 daqiqa)",
    testsSubtitle: "Istalgan testni tanlang va 5 daqiqa ichida o'z bilimingizni sinab ko'ring",
    searchPlaceholder: "Test yoki fanni qidirish...",
    allSubjects: "Barcha fanlar",
    allFormats: "Barcha formatlar",
    navTests: "Testlar",
    navResults: "Natijalarim",
    navMistakes: "Xatolarim",
    navRating: "Reyting",
    navTeacher: "O'qituvchilarga",
    teacherAdmin: "Ustoz (Admin)",
    becomeTeacher: "Ustoz bo'lish",
    signIn: "Kirish",
    signOut: "Chiqish",
    startTest: "Testni boshlash",
    questionsCount: "ta savol",
    minutes: "daqiqa",
    passingScore: "o'tish",
    finishTest: "Yakunlash",
    next: "Keyingi",
    prev: "Oldingi",
    submit: "Topshirish",
    questionMap: "Savollar xaritasi",
    calculator: "Kalkulyator",
    scratchpad: "Qoralama",
    answered: "Belgilangan",
    unanswered: "Belgilanmagan",
    reviewFlag: "Ko'rib chiqish",
    modalFinishTitle: "Testni yakunlaysizmi?",
    modalFinishDesc: "Natijalar serverda tekshirilib hisoblanadi.",
    yourName: "Ismingiz (Sertifikat uchun)",
    confirmFinish: "Ha, yakunlash",
    continueSolving: "Davom ettirish",
    retake: "Qayta topshirish",
    printCert: "Sertifikatni chop etish",
    backToTests: "Barcha testlarga qaytish",
    resultsTitle: "Rasmiy Tekshiruv Natijasi",
    cosmicTheme: "Kosmik rejim"
  },
  uz_cyrl: {
    appName: "Билим Арена",
    tagline: "Профессионал онлайн таълим ва имтиҳон платформаси",
    heroBadge: "Ўзбекистоннинг инновацион космик таълим ва тест аренаси",
    heroTitle: "Билим Арена — Кучингизни Космик Имтиҳонда Синанг",
    heroDesc: "ДТМ стандарти, халқаро олимпиада саволлари ва касбий сертификатлар. Тест давомийлиги: 5 дақиқа. Натижаларни сонияларда олинг.",
    viewTests: "Тестларни кўриш",
    blitzButton: "Тезкор Блиц (5 дақиқа)",
    blitzDesc: "5 та тасодифий саволдан иборат 5 дақиқалик чаққонлик синови.",
    mistakesButton: "Хатолар Банки",
    mistakesDesc: "Аввал хато қилган саволларингизни таҳлил қилинг ва қайта ишланг.",
    officialBadge: "ДТМ ва Миллий Сертификат",
    officialDesc: "Олий таълим муассасаларига кириш стандартидаги расмий тестлар.",
    testsTitle: "Имтиҳонлар ва Фан Тестлари (5 дақиқа)",
    testsSubtitle: "Исталган тестни танланг ва 5 дақиқа ичида ўз билимингизни синаб кўринг",
    searchPlaceholder: "Тест ёки фанни қидириш...",
    allSubjects: "Барча фанлар",
    allFormats: "Барча форматлар",
    navTests: "Тестлар",
    navResults: "Натижаларим",
    navMistakes: "Хатоларим",
    navRating: "Рейтинг",
    navTeacher: "Ўқитувчиларга",
    teacherAdmin: "Устоз (Админ)",
    becomeTeacher: "Устоз бўлиш",
    signIn: "Кириш",
    signOut: "Чиқиш",
    startTest: "Тестни бошлаш",
    questionsCount: "та савол",
    minutes: "дақиқа",
    passingScore: "ўтиш",
    finishTest: "Якунлаш",
    next: "Кейинги",
    prev: "Олдинги",
    submit: "Топшириш",
    questionMap: "Саволлар харитаси",
    calculator: "Калькулятор",
    scratchpad: "Қоралама",
    answered: "Белгиланган",
    unanswered: "Белгиланмаган",
    reviewFlag: "Кўриб чиқиш",
    modalFinishTitle: "Тестни якунлайсизми?",
    modalFinishDesc: "Натижалар серверда текширилиб ҳисобланади.",
    yourName: "Исмингиз (Сертификат учун)",
    confirmFinish: "Ҳа, якунлаш",
    continueSolving: "Давом эттириш",
    retake: "Қайта топшириш",
    printCert: "Сертификатни чоп этиш",
    backToTests: "Барча тестларга қайтиш",
    resultsTitle: "Расмий Текширув Натижаси",
    cosmicTheme: "Космик режим"
  },
  ru: {
    appName: "Билим Арена",
    tagline: "Профессиональная образовательная платформа онлайн-тестирования",
    heroBadge: "Инновационная космическая арена тестирования Узбекистана",
    heroTitle: "Билим Арена — Испытай свои знания в космическом экзамене",
    heroDesc: "Стандарты ГТЦ (DTM), олимпиадные задачи и профессиональные сертификаты. Длительность теста: 5 минут. Результаты за секунды.",
    viewTests: "Посмотреть тесты",
    blitzButton: "Экспресс Блиц (5 минут)",
    blitzDesc: "5 случайных вопросов по разным предметам за 5 минут.",
    mistakesButton: "Банк Ошибок",
    mistakesDesc: "Анализируйте и прорабатывайте вопросы, в которых ошиблись ранее.",
    officialBadge: "DTM и Национальный Сертификат",
    officialDesc: "Официальные тесты формата вступительных экзаменов в ВУЗы.",
    testsTitle: "Экзамены и Тесты (5 минут)",
    testsSubtitle: "Выберите любой тест и проверьте свои знания за 5 минут",
    searchPlaceholder: "Поиск теста или предмета...",
    allSubjects: "Все предметы",
    allFormats: "Все форматы",
    navTests: "Тесты",
    navResults: "Мои результаты",
    navMistakes: "Мои ошибки",
    navRating: "Рейтинг",
    navTeacher: "Учителям",
    teacherAdmin: "Учитель (Админ)",
    becomeTeacher: "Стать учителем",
    signIn: "Войти",
    signOut: "Выйти",
    startTest: "Начать тест",
    questionsCount: "вопросов",
    minutes: "минут",
    passingScore: "проходной",
    finishTest: "Завершить",
    next: "Следующий",
    prev: "Предыдущий",
    submit: "Сдать тест",
    questionMap: "Карта вопросов",
    calculator: "Калькулятор",
    scratchpad: "Черновик",
    answered: "Отвечено",
    unanswered: "Не отвечено",
    reviewFlag: "На проверку",
    modalFinishTitle: "Завершить тестирование?",
    modalFinishDesc: "Результаты будут проверены и подсчитаны на сервере.",
    yourName: "Ваше имя (для сертификата)",
    confirmFinish: "Да, завершить",
    continueSolving: "Продолжить",
    retake: "Пройти снова",
    printCert: "Распечатать сертификат",
    backToTests: "Вернуться ко всем тестам",
    resultsTitle: "Официальный Результат Проверки",
    cosmicTheme: "Космический режим"
  },
  en: {
    appName: "Bilim Arena",
    tagline: "Professional examination and learning platform",
    heroBadge: "Uzbekistan's cosmic examination & testing arena",
    heroTitle: "Bilim Arena — Test Your Intellect in the Cosmic Exam",
    heroDesc: "DTM standardized, Olympiad and professional certification tests. Duration: 5 minutes. Instant verified results in seconds.",
    viewTests: "Browse Tests",
    blitzButton: "Express Blitz (5 mins)",
    blitzDesc: "Rapid-fire 5-question multi-subject challenge in 5 minutes.",
    mistakesButton: "Mistakes Bank",
    mistakesDesc: "Review and re-solve questions you previously got wrong.",
    officialBadge: "DTM & National Certificate",
    officialDesc: "Official entrance examination standard tests for universities.",
    testsTitle: "Exams and Subject Tests (5 mins)",
    testsSubtitle: "Pick any subject test and challenge yourself within 5 minutes",
    searchPlaceholder: "Search tests or subjects...",
    allSubjects: "All Subjects",
    allFormats: "All Formats",
    navTests: "Tests",
    navResults: "My Results",
    navMistakes: "Mistakes",
    navRating: "Leaderboard",
    navTeacher: "For Teachers",
    teacherAdmin: "Teacher (Admin)",
    becomeTeacher: "Switch to Teacher",
    signIn: "Sign In",
    signOut: "Log Out",
    startTest: "Start Test",
    questionsCount: "questions",
    minutes: "minutes",
    passingScore: "passing",
    finishTest: "Finish",
    next: "Next",
    prev: "Previous",
    submit: "Submit Exam",
    questionMap: "Question Map",
    calculator: "Calculator",
    scratchpad: "Scratchpad",
    answered: "Answered",
    unanswered: "Unanswered",
    reviewFlag: "Flagged",
    modalFinishTitle: "Submit Exam?",
    modalFinishDesc: "Answers will be securely verified on the server.",
    yourName: "Your Full Name (for certificate)",
    confirmFinish: "Yes, Submit",
    continueSolving: "Continue",
    retake: "Retake Test",
    printCert: "Print Certificate",
    backToTests: "Back to Catalog",
    resultsTitle: "Official Examination Result",
    cosmicTheme: "Cosmic Mode"
  }
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bilimarena_lang');
      if (saved && (saved === 'uz' || saved === 'uz_cyrl' || saved === 'ru' || saved === 'en')) {
        return saved as Language;
      }
    } catch {}
    return 'uz';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('bilimarena_lang', newLang);
    } catch {}
  };

  const t = DICTIONARY[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
