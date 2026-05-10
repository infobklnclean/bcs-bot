const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: true });

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────

const T = {
  ru: {
    askLang:        "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName:        "👤 Введи своё имя и фамилию:",
    welcome:        (n) => `👋 Привет, *${n}*!\n\n🏢 *BCS Quality Control*\n\nУкажи адрес объекта:`,
    askAddress:     "📍 Адрес объекта (или /skip):",
    chooseService:  "🧹 Выбери тип уборки:",
    photoBefore:    (s) => `${s}\n\n📸 *Шаг 1 — Фото ДО*\nСфотографируй каждую зону ДО начала.\nМин. 3 фото: кухня, ванная, общий вид.\n⬆️ Отправляй фото в чат`,
    startNoPhoto:   "▶️ Начать без фото",
    startPhoto:     (n) => `▶️ Начать уборку (фото: ${n})`,
    photoBeforeGot: (n) => `📸 Фото ДО: ${n} шт. Отправь ещё или начни:`,
    step2:          (s, bar) => `*${s}*\n${bar}\n\nВыбери зону:`,
    zoneTitle:      (name, bar) => `📍 *${name}*\n${bar}\n\n🔴 критично  ⬜ стандарт`,
    allDone:        "📸 Все зоны ✅ → Фото ПОСЛЕ",
    photoAfter:     "✅ *Все зоны выполнены!*\n\n📸 *Шаг 3 — Фото ПОСЛЕ*\nФото с тех же точек что и «до».\n⬆️ Отправляй фото в чат",
    photoAfterGot:  (n) => `📸 Фото ПОСЛЕ: ${n} шт. Отправь ещё или продолжи:`,
    gotoCrit:       "✅ К финальной проверке",
    gotoCritN:      (n) => `✅ К финальной проверке (фото: ${n})`,
    critTitle:      (n, bar) => `📸 Фото ПОСЛЕ: ${n} шт\n\n🔍 *Шаг 4 — Финальная проверка*\n${bar}\n\nПроверь каждый пункт перед сдачей:`,
    finishBtn:      "🏁 Завершить и отправить отчёт",
    finished:       (n, s, dur, addr, b, a) => `🎉 *Заказ завершён!*\n\n👤 ${n}\n📅 ${new Date().toLocaleString("ru-RU")}\n⏱ ${dur} мин\n🧹 ${s}\n📍 ${addr}\n📸 До: ${b} | После: ${a}\n\n✅ Отчёт отправлен менеджеру\nСпасибо! 💪`,
    newOrder:       "🔄 Новый заказ",
    newOrderMsg:    "🏠 Адрес нового объекта (или /skip):",
    back:           "← Назад к зонам",
    zoneDone:       "✅ Зона готова →",
    inProgress:     (d,t) => `⏳ ${d}/${t}`,
    rptHdr:         (n, u, addr, s, lang, dur) => `📋 *ОТЧЁТ*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${n} (@${u})\n🌐 ${lang}\n📍 ${addr}\n🧹 ${s}\n⏱ ${dur} мин\n📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n`,
    rptPhoto:       (b, a) => `━━━━━━━━━━━━━━━━━━━━\n📸 До: ${b} шт | После: ${a} шт\n✅ Critical check: пройден`,
    rptZones:       "Зоны:",
    lblBefore:      "📸 *Фото ДО:*",
    lblAfter:       "📸 *Фото ПОСЛЕ:*",
    earlyFinishBtn: "🏁 Завершить заказ",
    warningTitle:   "⚠️ *Внимание! Не все пункты выполнены*\n\nВы не убрали следующее:\n",
    warningFooter:  "\n❗️ Убедитесь что всё доделано на месте, *не уходя с заказа*.\n\nЕсли всё готово — нажмите подтвердить.",
    confirmFinish:  "✅ Подтвердить завершение",
    goBackBtn:      "← Вернуться и доделать",
  },
  en: {
    askLang:        "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName:        "👤 Enter your first and last name:",
    welcome:        (n) => `👋 Hello, *${n}*!\n\n🏢 *BCS Quality Control*\n\nEnter property address:`,
    askAddress:     "📍 Property address (or /skip):",
    chooseService:  "🧹 Choose cleaning type:",
    photoBefore:    (s) => `${s}\n\n📸 *Step 1 — Photos BEFORE*\nPhoto each zone BEFORE starting.\nMin 3: kitchen, bathroom, overview.\n⬆️ Send photos to chat`,
    startNoPhoto:   "▶️ Start without photos",
    startPhoto:     (n) => `▶️ Start cleaning (photos: ${n})`,
    photoBeforeGot: (n) => `📸 Before photos: ${n}. Send more or start:`,
    step2:          (s, bar) => `*${s}*\n${bar}\n\nSelect a zone:`,
    zoneTitle:      (name, bar) => `📍 *${name}*\n${bar}\n\n🔴 critical  ⬜ standard`,
    allDone:        "📸 All zones ✅ → Photos AFTER",
    photoAfter:     "✅ *All zones complete!*\n\n📸 *Step 3 — Photos AFTER*\nSame spots as before.\n⬆️ Send photos to chat",
    photoAfterGot:  (n) => `📸 After photos: ${n}. Send more or continue:`,
    gotoCrit:       "✅ Go to final check",
    gotoCritN:      (n) => `✅ Final check (photos: ${n})`,
    critTitle:      (n, bar) => `📸 After photos: ${n}\n\n🔍 *Step 4 — Final Check*\n${bar}\n\nVerify each item before finishing:`,
    finishBtn:      "🏁 Complete & send report",
    finished:       (n, s, dur, addr, b, a) => `🎉 *Order complete!*\n\n👤 ${n}\n📅 ${new Date().toLocaleString("en-US")}\n⏱ ${dur} min\n🧹 ${s}\n📍 ${addr}\n📸 Before: ${b} | After: ${a}\n\n✅ Report sent to manager\nGreat work! 💪`,
    newOrder:       "🔄 New order",
    newOrderMsg:    "🏠 New property address (or /skip):",
    back:           "← Back to zones",
    zoneDone:       "✅ Zone done →",
    inProgress:     (d,t) => `⏳ ${d}/${t}`,
    rptHdr:         (n, u, addr, s, lang, dur) => `📋 *REPORT*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${n} (@${u})\n🌐 ${lang}\n📍 ${addr}\n🧹 ${s}\n⏱ ${dur} min\n📅 ${new Date().toLocaleString("en-US")}\n━━━━━━━━━━━━━━━━━━━━\n`,
    rptPhoto:       (b, a) => `━━━━━━━━━━━━━━━━━━━━\n📸 Before: ${b} | After: ${a}\n✅ Critical check: passed`,
    rptZones:       "Zones:",
    lblBefore:      "📸 *Photos BEFORE:*",
    lblAfter:       "📸 *Photos AFTER:*",
    earlyFinishBtn: "🏁 Finish order",
    warningTitle:   "⚠️ *Warning! Not all tasks are done*\n\nYou have not completed:\n",
    warningFooter:  "\n❗️ Please make sure everything is finished *before leaving the property*.\n\nIf everything is done — tap confirm.",
    confirmFinish:  "✅ Confirm completion",
    goBackBtn:      "← Go back and finish",
  },
  uz: {
    askLang:        "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName:        "👤 Ism va familiyangizni kiriting:",
    welcome:        (n) => `👋 Salom, *${n}*!\n\n🏢 *BCS Quality Control*\n\nOb'ekt manzilini kiriting:`,
    askAddress:     "📍 Ob'ekt manzili (yoki /skip):",
    chooseService:  "🧹 Tozalash turini tanlang:",
    photoBefore:    (s) => `${s}\n\n📸 *1-qadam — OLDIN suratlar*\nHar zonani tozalashdan OLDIN suratlang.\nKamida 3: oshxona, hammom, umumiy.\n⬆️ Suratlarni chatga yuboring`,
    startNoPhoto:   "▶️ Suratsiz boshlash",
    startPhoto:     (n) => `▶️ Boshlash (surat: ${n})`,
    photoBeforeGot: (n) => `📸 Oldin suratlari: ${n} ta. Yana yuboring yoki:`,
    step2:          (s, bar) => `*${s}*\n${bar}\n\nZonani tanlang:`,
    zoneTitle:      (name, bar) => `📍 *${name}*\n${bar}\n\n🔴 muhim  ⬜ standart`,
    allDone:        "📸 Barcha zonalar ✅ → KEYIN suratlar",
    photoAfter:     "✅ *Barcha zonalar bajarildi!*\n\n📸 *3-qadam — KEYIN suratlar*\nAvvalgi nuqtalardan surat oling.\n⬆️ Suratlarni chatga yuboring",
    photoAfterGot:  (n) => `📸 Keyin suratlari: ${n} ta. Yana yuboring yoki:`,
    gotoCrit:       "✅ Yakuniy tekshiruvga o'tish",
    gotoCritN:      (n) => `✅ Yakuniy tekshiruv (surat: ${n})`,
    critTitle:      (n, bar) => `📸 Keyin suratlari: ${n} ta\n\n🔍 *4-qadam — Yakuniy tekshiruv*\n${bar}\n\nHar bandni tekshiring:`,
    finishBtn:      "🏁 Yakunlash va hisobot yuborish",
    finished:       (n, s, dur, addr, b, a) => `🎉 *Buyurtma yakunlandi!*\n\n👤 ${n}\n📅 ${new Date().toLocaleString("ru-RU")}\n⏱ ${dur} daqiqa\n🧹 ${s}\n📍 ${addr}\n📸 Oldin: ${b} | Keyin: ${a}\n\n✅ Hisobot menejeriga yuborildi\nRahmat! 💪`,
    newOrder:       "🔄 Yangi buyurtma",
    newOrderMsg:    "🏠 Yangi ob'ekt manzili (yoki /skip):",
    back:           "← Zonalarga qaytish",
    zoneDone:       "✅ Zona bajarildi →",
    inProgress:     (d,t) => `⏳ ${d}/${t}`,
    rptHdr:         (n, u, addr, s, lang, dur) => `📋 *HISOBOT*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${n} (@${u})\n🌐 ${lang}\n📍 ${addr}\n🧹 ${s}\n⏱ ${dur} daqiqa\n📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n`,
    rptPhoto:       (b, a) => `━━━━━━━━━━━━━━━━━━━━\n📸 Oldin: ${b} ta | Keyin: ${a} ta\n✅ Tekshiruv: o'tdi`,
    rptZones:       "Zonalar:",
    lblBefore:      "📸 *Oldin suratlari:*",
    lblAfter:       "📸 *Keyin suratlari:*",
    earlyFinishBtn: "🏁 Buyurtmani yakunlash",
    warningTitle:   "⚠️ *Diqqat! Barcha bandlar bajarilmagan*\n\nQuyidagilar bajarilmadi:\n",
    warningFooter:  "\n❗️ Ob'ektdan *ketmasdan oldin* hamma narsani tugatganingizga ishoning.\n\nHamma narsa tayyor bo'lsa — tasdiqlang.",
    confirmFinish:  "✅ Yakunlashni tasdiqlash",
    goBackBtn:      "← Orqaga va tugatish",
  },
};

const LANG_NAMES = { ru: "🇷🇺 Русский", en: "🇺🇸 English", uz: "🇺🇿 O'zbek" };

const SERVICES = {
  ru: { deep: "🧹 Deep Cleaning", regular: "🏠 Regular Standard", moveinout: "📦 Move In/Out", postconstruction: "🔨 Post Construction" },
  en: { deep: "🧹 Deep Cleaning", regular: "🏠 Regular Standard", moveinout: "📦 Move In/Out", postconstruction: "🔨 Post Construction" },
  uz: { deep: "🧹 Chuqur tozalash", regular: "🏠 Standart", moveinout: "📦 Kirish/Chiqish", postconstruction: "🔨 Qurilishdan keyin" },
};

// ─── CHECKLISTS — SHORT LABELS ────────────────────────────────────────────────
// Each item: { ru, en, uz, critical }
// MAX ~28 chars per label so it fits in Telegram button

const ZONES = ["Kitchen", "Bathroom", "Bedroom", "Living Room", "Hallway", "Windows"];

const ZONE_LABELS = {
  ru: { Kitchen: "🍳 Кухня", Bathroom: "🚿 Ванная", Bedroom: "🛏 Спальня", "Living Room": "🛋 Гостиная", Hallway: "🚪 Коридор", Windows: "🪟 Окна" },
  en: { Kitchen: "🍳 Kitchen", Bathroom: "🚿 Bathroom", Bedroom: "🛏 Bedroom", "Living Room": "🛋 Living Room", Hallway: "🚪 Hallway", Windows: "🪟 Windows" },
  uz: { Kitchen: "🍳 Oshxona", Bathroom: "🚿 Hammom", Bedroom: "🛏 Yotoqxona", "Living Room": "🛋 Mehmonxona", Hallway: "🚪 Koridor", Windows: "🪟 Derazalar" },
};

const CHECKLISTS = {
  deep: {
    Kitchen: [
      { ru: "Плита — снаружи и изнутри",         en: "Stove — outside & inside",       uz: "Plita — tashqi va ichki",        critical: true  },
      { ru: "Духовка — противни и решётки",       en: "Oven — trays & racks",           uz: "Pech — tegachlar va panjaralar", critical: true  },
      { ru: "Холодильник — изнутри",              en: "Fridge — inside",                uz: "Muzlatgich — ichidan",           critical: false },
      { ru: "Вытяжка и фильтры",                  en: "Hood & filters",                 uz: "Ventilyatsiya va filtrlar",      critical: false },
      { ru: "Фасады шкафов — ручки и петли",      en: "Cabinets — doors & handles",     uz: "Shkaflar — eshiklar va tutqich", critical: false },
      { ru: "Микроволновка — внутри и снаружи",   en: "Microwave — inside & out",       uz: "Mikrotolqinli — ichidan",        critical: false },
      { ru: "Раковина и кран — до блеска",        en: "Sink & faucet — polished",       uz: "Lavabo va kran — yaltiroq",      critical: true  },
      { ru: "Пол и плинтусы",                     en: "Floor & baseboards",             uz: "Pol va plintuslar",              critical: false },
    ],
    Bathroom: [
      { ru: "Кафель — известковый налёт",         en: "Tiles — limescale removed",      uz: "Kafel — ohak dog'lari",          critical: true  },
      { ru: "Унитаз — снаружи и под ободком",     en: "Toilet — outside & under rim",   uz: "Unitaz — tashqi va ostidan",     critical: true  },
      { ru: "Душ/ванна — мыльный налёт",          en: "Shower/tub — soap scum",         uz: "Dush/vanna — ko'pik izlari",     critical: true  },
      { ru: "Зеркало — без разводов",             en: "Mirror — no streaks",            uz: "Oyna — chiziqsiz",               critical: false },
      { ru: "Все поверхности и полки",            en: "All surfaces & shelves",         uz: "Barcha yuzalar va javonlar",     critical: false },
      { ru: "Пол и плинтусы",                     en: "Floor & baseboards",             uz: "Pol va plintuslar",              critical: false },
    ],
    Bedroom: [
      { ru: "Пыль — вся мебель и поверхности",   en: "Dust — all furniture & surfaces", uz: "Chang — mebel va yuzalar",       critical: false },
      { ru: "Матрас — пылесос",                   en: "Mattress — vacuumed",            uz: "Matras — changsos",              critical: false },
      { ru: "Окна — изнутри",                     en: "Windows — inside",               uz: "Derazalar — ichidan",            critical: false },
      { ru: "Плинтусы и вентиляция",              en: "Baseboards & vents",             uz: "Plintuslar va ventilyatsiya",    critical: false },
      { ru: "Пол/ковёр — пылесос и мытьё",       en: "Floor/carpet — vacuum & mop",    uz: "Pol/gilam — changsos va yuv",    critical: true  },
    ],
    "Living Room": [
      { ru: "Пыль — мебель, полки, декор",        en: "Dust — furniture & decor",       uz: "Chang — mebel va dekor",         critical: false },
      { ru: "Диван и подушки — пылесос",          en: "Sofa & cushions — vacuum",       uz: "Divan va yostiqlar — changsos",  critical: false },
      { ru: "ТВ и техника — пыль",                en: "TV & electronics — dust",        uz: "TV va texnika — chang",          critical: false },
      { ru: "Пол — особенно углы",                en: "Floor — focus on corners",       uz: "Pol — burchaklarga e'tibor",     critical: true  },
    ],
    Hallway: [
      { ru: "Входная дверь и ручка",              en: "Front door & handle",            uz: "Kirish eshigi va tutqich",       critical: false },
      { ru: "Пол и плинтусы",                     en: "Floor & baseboards",             uz: "Pol va plintuslar",              critical: false },
      { ru: "Зеркало",                            en: "Mirror",                         uz: "Oyna",                           critical: false },
    ],
    Windows: [
      { ru: "Стёкла изнутри — без разводов",      en: "Glass inside — no streaks",      uz: "Oynalar ichidan — chiziqsiz",    critical: true  },
      { ru: "Рамы и подоконники",                 en: "Frames & sills",                 uz: "Ramalar va tokchalar",           critical: false },
      { ru: "Жалюзи / занавеси — пыль",           en: "Blinds / curtains — dust",       uz: "Jaluzin / pardalar — chang",     critical: false },
    ],
  },
  regular: {
    Kitchen: [
      { ru: "Плита — снаружи",                    en: "Stove — outside",                uz: "Plita — tashqidan",              critical: true  },
      { ru: "Столешница и поверхности",           en: "Countertop & surfaces",          uz: "Stolüsti va yuzalar",            critical: false },
      { ru: "Раковина и кран",                    en: "Sink & faucet",                  uz: "Lavabo va kran",                 critical: true  },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: false },
      { ru: "Мусор — вынести",                    en: "Trash — taken out",              uz: "Axlat — olib chiqish",           critical: false },
    ],
    Bathroom: [
      { ru: "Унитаз — дезинфекция",               en: "Toilet — disinfected",           uz: "Unitaz — dezinfeksiya",          critical: true  },
      { ru: "Раковина и кран",                    en: "Sink & faucet",                  uz: "Lavabo va kran",                 critical: true  },
      { ru: "Зеркало",                            en: "Mirror",                         uz: "Oyna",                           critical: false },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: false },
    ],
    Bedroom: [
      { ru: "Пыль с поверхностей",                en: "Dust surfaces",                  uz: "Yuzalardan chang",               critical: false },
      { ru: "Пол/ковёр — пылесос и мытьё",       en: "Floor/carpet — vacuum & mop",    uz: "Pol/gilam — changsos va yuv",    critical: true  },
    ],
    "Living Room": [
      { ru: "Пыль с поверхностей",                en: "Dust surfaces",                  uz: "Yuzalardan chang",               critical: false },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: true  },
    ],
    Hallway: [
      { ru: "Пол — подмести и вымыть",            en: "Floor — sweep & mop",            uz: "Pol — supurish va yuvish",       critical: false },
    ],
    Windows: [
      { ru: "Подоконники",                        en: "Window sills",                   uz: "Tokchalar",                      critical: false },
    ],
  },
  moveinout: {
    Kitchen: [
      { ru: "Духовка и плита — изнутри полная",   en: "Oven & stove — full inside",     uz: "Pech va plita — to'liq ichki",   critical: true  },
      { ru: "Холодильник — изнутри",              en: "Fridge — inside",                uz: "Muzlatgich — ichidan",           critical: true  },
      { ru: "Все шкафы — внутри и снаружи",       en: "All cabinets — inside & out",    uz: "Barcha shkaflar — ichki/tashqi", critical: true  },
      { ru: "Вытяжка",                            en: "Hood",                           uz: "Ventilyatsiya",                  critical: false },
      { ru: "Пол и плинтусы",                     en: "Floor & baseboards",             uz: "Pol va plintuslar",              critical: false },
    ],
    Bathroom: [
      { ru: "Все поверхности — полная дезинфекция", en: "All surfaces — full disinfect", uz: "Barcha yuzalar — dezinfeksiya", critical: true  },
      { ru: "Плесень и налёт — удалить",          en: "Mold & limescale — removed",     uz: "Mog'or va ohak — ketkazish",     critical: true  },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: false },
    ],
    Bedroom: [
      { ru: "Шкафы и полки — изнутри",            en: "Wardrobes & shelves — inside",   uz: "Shkaflar va javonlar — ichki",   critical: true  },
      { ru: "Пол — пылесос и мытьё",              en: "Floor — vacuum & mop",           uz: "Pol — changsos va yuvish",       critical: true  },
      { ru: "Окна",                               en: "Windows",                        uz: "Derazalar",                      critical: false },
    ],
    "Living Room": [
      { ru: "Все поверхности — полная чистка",    en: "All surfaces — full clean",      uz: "Barcha yuzalar — to'liq tozalash", critical: false },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: true  },
    ],
    Hallway: [
      { ru: "Входная дверь — снаружи и изнутри",  en: "Front door — outside & inside",  uz: "Kirish eshigi — ikki tomon",     critical: false },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: false },
    ],
    Windows: [
      { ru: "Все стёкла изнутри",                 en: "All glass — inside",             uz: "Barcha oynalar — ichidan",       critical: true  },
      { ru: "Рамы и подоконники",                 en: "Frames & sills",                 uz: "Ramalar va tokchalar",           critical: false },
    ],
  },
  postconstruction: {
    Kitchen: [
      { ru: "Строительная пыль — все поверхности", en: "Construction dust — all surfaces", uz: "Qurilish changi — barcha yuzalar", critical: true },
      { ru: "Техника — снять защитные плёнки",    en: "Appliances — remove films",      uz: "Texnika — plyonkalarni olish",   critical: false },
      { ru: "Пол — обезжириватель",               en: "Floor — degreaser",              uz: "Pol — yog'sizlantirgich",        critical: true  },
    ],
    Bathroom: [
      { ru: "Затирка и раствор — остатки убрать", en: "Grout & mortar — residue off",   uz: "Grout va tsement — qoldiqlar",   critical: true  },
      { ru: "Новая сантехника — протереть",       en: "New plumbing — wipe down",       uz: "Yangi santexnika — artish",      critical: false },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: true  },
    ],
    Bedroom: [
      { ru: "Пыль — 2 этапа, все поверхности",   en: "Dust — 2 rounds, all surfaces",  uz: "Chang — 2 bosqich, barcha yuzalar", critical: true },
      { ru: "Пол — пылесос и мытьё",              en: "Floor — vacuum & mop",           uz: "Pol — changsos va yuvish",       critical: true  },
    ],
    "Living Room": [
      { ru: "Горизонтальные поверхности — 2x",   en: "Horizontal surfaces — 2x wipe",  uz: "Gorizontal yuzalar — 2 marta",   critical: true  },
      { ru: "Пол — обезжириватель",               en: "Floor — degreaser",              uz: "Pol — yog'sizlantirgich",        critical: true  },
    ],
    Hallway: [
      { ru: "Строительный мусор — убрать",        en: "Construction debris — removed",  uz: "Qurilish axlati — olib chiqish", critical: true  },
      { ru: "Пол",                                en: "Floor",                          uz: "Pol",                            critical: false },
    ],
    Windows: [
      { ru: "Стёкла — наклейки и цемент убрать", en: "Glass — stickers & cement off",  uz: "Oynalar — stikerlar va tsement", critical: true  },
      { ru: "Стёкла и рамы — вымыть",            en: "Glass & frames — washed",        uz: "Oynalar va ramalar — yuvish",    critical: true  },
    ],
  },
};

const CRITICAL_FINAL = {
  ru: [
    "Унитаз — нет запаха и загрязнений",
    "Плита/духовка — очищена",
    "Полы вымыты во всех зонах",
    "Фото до и после — загружены",
    "Раковина — без налёта",
    "Химикаты смыты, нет запаха",
    "Мусор — вынесен",
    "Зеркала — без разводов",
  ],
  en: [
    "Toilet — no smell, no dirt",
    "Stove/oven — cleaned",
    "Floors mopped in all zones",
    "Before & after photos — uploaded",
    "Sink — no limescale",
    "Chemicals rinsed, no smell",
    "Trash — taken out",
    "Mirrors — no streaks",
  ],
  uz: [
    "Unitaz — hid yo'q, kir yo'q",
    "Plita/pech — tozalangan",
    "Barcha zonalarda pol yuvilgan",
    "Oldin va keyin suratlari — yuklangan",
    "Lavabo — ohaklardan toza",
    "Kimyoviy moddalar yuvib tashlangan",
    "Axlat — olib chiqilgan",
    "Oynalar — chiziq yo'q",
  ],
};

// ─── SESSION & HELPERS ────────────────────────────────────────────────────────

const sessions = {};
const cleaners = {}; // chatId → { name, lang }

function sess(id) {
  if (!sessions[id]) sessions[id] = { step: "idle", service: null, zoneIdx: 0, checked: {}, photoBefore: [], photoAfter: [], criticalDone: {}, startedAt: null, address: null };
  return sessions[id];
}
function resetSess(id) { sessions[id] = null; return sess(id); }
function lang(id)  { return (cleaners[id] && cleaners[id].lang) || "ru"; }
function name(id)  { return (cleaners[id] && cleaners[id].name) || ""; }
function tr(id, key, ...a) { const fn = T[lang(id)][key]; return typeof fn === "function" ? fn(...a) : fn; }
function bar(done, total)  { const f = total ? Math.round(done/total*8) : 0; return "█".repeat(f) + "░".repeat(8-f) + ` ${done}/${total}`; }

// ─── KEYBOARDS ────────────────────────────────────────────────────────────────

const langKbd = () => ({ inline_keyboard: [
  [{ text: "🇷🇺 Русский", callback_data: "L_ru" }],
  [{ text: "🇺🇸 English", callback_data: "L_en" }],
  [{ text: "🇺🇿 O'zbek",  callback_data: "L_uz" }],
]});

function svcKbd(id) {
  return { inline_keyboard: Object.entries(SERVICES[lang(id)]).map(([k,v]) => [{ text: v, callback_data: `S_${k}` }]) };
}

function zonesKbd(id, s) {
  const l = lang(id);
  const rows = ZONES.map((z, i) => {
    const items = (CHECKLISTS[s.service] || {})[z] || [];
    const ch    = s.checked[z] || [];
    const done  = ch.filter(Boolean).length;
    const icon  = done === items.length ? "✅" : done > 0 ? "🔄" : "⬜";
    return [{ text: `${icon} ${ZONE_LABELS[l][z]} (${done}/${items.length})`, callback_data: `Z_${i}` }];
  });
  const allDone = ZONES.every(z => {
    const items = (CHECKLISTS[s.service] || {})[z] || [];
    return (s.checked[z] || []).filter(Boolean).length === items.length;
  });
  if (allDone) rows.push([{ text: tr(id, "allDone"), callback_data: "PHOTO_AFTER" }]);
  // Always show early finish button
  rows.push([{ text: tr(id, "earlyFinishBtn"), callback_data: "EARLY_FINISH" }]);
  return { inline_keyboard: rows };
}

function checkKbd(id, s, zone) {
  const l     = lang(id);
  const items = (CHECKLISTS[s.service] || {})[zone] || [];
  if (!s.checked[zone]) s.checked[zone] = Array(items.length).fill(false);
  const ch   = s.checked[zone];
  const rows = items.map((item, i) => {
    const icon  = ch[i] ? "✅" : item.critical ? "🔴" : "⬜";
    const label = item[l] || item.ru;
    return [{ text: `${icon} ${label}`, callback_data: `C_${i}` }];
  });
  const done = ch.filter(Boolean).length;
  rows.push([
    { text: tr(id, "back"),       callback_data: "BACK_ZONES" },
    { text: done === items.length ? tr(id, "zoneDone") : tr(id, "inProgress", done, items.length), callback_data: "BACK_ZONES" },
  ]);
  return { inline_keyboard: rows };
}

function critKbd(id, s) {
  const l     = lang(id);
  const items = CRITICAL_FINAL[l];
  const rows  = items.map((item, i) => [{ text: `${s.criticalDone[i] ? "✅" : "⬜"} ${item}`, callback_data: `K_${i}` }]);
  if (items.every((_, i) => s.criticalDone[i])) rows.push([{ text: tr(id, "finishBtn"), callback_data: "FINISH" }]);
  return { inline_keyboard: rows };
}

// ─── REPORT ───────────────────────────────────────────────────────────────────

async function sendReport(id, s, user) {
  if (!ADMIN_ID) return;
  const l   = lang(id);
  const svc = SERVICES[l][s.service];
  const dur = s.startedAt ? Math.round((Date.now() - s.startedAt) / 60000) : "—";
  const nm  = name(id) || user.first_name;

  // Zones summary
  let zonesText = "";
  for (const z of ZONES) {
    const items = (CHECKLISTS[s.service] || {})[z] || [];
    if (!items.length) continue;
    const done  = (s.checked[z]||[]).filter(Boolean).length;
    const icon  = done === items.length ? "✅" : "⚠️";
    zonesText += `${icon} ${ZONE_LABELS["ru"][z]}: ${done}/${items.length}\n`;
  }

  // Incomplete items list
  let missedText = "";
  for (const z of ZONES) {
    const items = (CHECKLISTS[s.service] || {})[z] || [];
    const ch    = s.checked[z] || [];
    const missed = items.filter((_, i) => !ch[i]);
    if (missed.length) {
      missedText += `\n*${ZONE_LABELS["ru"][z]}:*\n`;
      missed.forEach(item => { missedText += `  • ${item.ru}\n`; });
    }
  }

  const photoStatus = s.photoAfter.length === 0
    ? "❌ Фото ПОСЛЕ — не загружены!"
    : `✅ Фото ПОСЛЕ: ${s.photoAfter.length} шт`;

  const txt =
    `📋 *ОТЧЁТ О ЗАКАЗЕ*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 ${nm} (@${user.username||"—"})\n` +
    `📍 ${s.address||"—"}\n` +
    `🧹 ${svc}\n` +
    `⏱ ${dur} мин\n` +
    `📅 ${new Date().toLocaleString("ru-RU")}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Зоны:*\n${zonesText}` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📸 Фото ДО: ${s.photoBefore.length} шт\n` +
    `${photoStatus}\n` +
    (missedText
      ? `━━━━━━━━━━━━━━━━━━━━\n⚠️ *Не выполнено:*${missedText}`
      : `━━━━━━━━━━━━━━━━━━━━\n✅ Все пункты выполнены\n`);

  await bot.sendMessage(ADMIN_ID, txt, { parse_mode: "Markdown" });
  if (s.photoBefore.length) {
    await bot.sendMessage(ADMIN_ID, "📸 *Фото ДО:*", { parse_mode: "Markdown" });
    for (const f of s.photoBefore) await bot.sendPhoto(ADMIN_ID, f);
  }
  if (s.photoAfter.length) {
    await bot.sendMessage(ADMIN_ID, "📸 *Фото ПОСЛЕ:*", { parse_mode: "Markdown" });
    for (const f of s.photoAfter) await bot.sendPhoto(ADMIN_ID, f);
  }
}

// ─── ZONE VIEW ────────────────────────────────────────────────────────────────

async function showZone(id, msgId, s) {
  const l    = lang(id);
  const zone = ZONES[s.zoneIdx];
  if (!s.checked[zone]) s.checked[zone] = Array(((CHECKLISTS[s.service]||{})[zone]||[]).length).fill(false);
  const done  = s.checked[zone].filter(Boolean).length;
  const total = ((CHECKLISTS[s.service]||{})[zone]||[]).length;
  const text  = tr(id, "zoneTitle", ZONE_LABELS[l][zone], bar(done, total));
  await bot.editMessageText(text, { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: checkKbd(id, s, zone) });
}

async function showZones(id, msgId, s) {
  const l      = lang(id);
  const svcNm  = SERVICES[l][s.service];
  const total  = ZONES.reduce((acc, z) => acc + ((CHECKLISTS[s.service]||{})[z]||[]).length, 0);
  const done   = ZONES.reduce((acc, z) => acc + (s.checked[z]||[]).filter(Boolean).length, 0);
  await bot.editMessageText(tr(id, "step2", svcNm, bar(done, total)), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: zonesKbd(id, s) });
}

// ─── /start ───────────────────────────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const id = msg.chat.id;
  resetSess(id);
  if (cleaners[id] && cleaners[id].name) {
    const s = sess(id);
    s.step = "addr";
    s.startedAt = Date.now();
    await bot.sendMessage(id, tr(id, "welcome", name(id)), { parse_mode: "Markdown" });
  } else {
    await bot.sendMessage(id, T.ru.askLang, { reply_markup: langKbd() });
  }
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

bot.on("message", async (msg) => {
  const id = msg.chat.id;
  const s  = sess(id);

  if (msg.photo) {
    const fid = msg.photo[msg.photo.length - 1].file_id;
    if (s.step === "photo_before") {
      s.photoBefore.push(fid);
      await bot.sendMessage(id, tr(id, "photoBeforeGot", s.photoBefore.length), { reply_markup: { inline_keyboard: [[{ text: tr(id, "startPhoto", s.photoBefore.length), callback_data: "START_CLEAN" }]] } });
    } else if (s.step === "photo_after") {
      s.photoAfter.push(fid);
      await bot.sendMessage(id, tr(id, "photoAfterGot", s.photoAfter.length), { reply_markup: { inline_keyboard: [[{ text: tr(id, "gotoCritN", s.photoAfter.length), callback_data: "CRIT" }]] } });
    }
    return;
  }

  if (!msg.text || msg.text.startsWith("/start")) return;

  if (s.step === "name") {
    cleaners[id].name = msg.text.trim();
    s.step = "addr";
    s.startedAt = Date.now();
    await bot.sendMessage(id, tr(id, "welcome", name(id)), { parse_mode: "Markdown" });
    return;
  }
  if (s.step === "addr") {
    if (msg.text !== "/skip") s.address = msg.text.trim();
    s.step = "svc";
    await bot.sendMessage(id, tr(id, "chooseService"), { reply_markup: svcKbd(id) });
  }
});

// ─── CALLBACKS ────────────────────────────────────────────────────────────────

bot.on("callback_query", async (q) => {
  const id    = q.message.chat.id;
  const msgId = q.message.message_id;
  const data  = q.data;
  const s     = sess(id);
  await bot.answerCallbackQuery(q.id);

  // Language
  if (data.startsWith("L_")) {
    const l = data.slice(2);
    cleaners[id] = { lang: l, name: null };
    s.step = "name";
    await bot.editMessageText(T[l].askName, { chat_id: id, message_id: msgId });
    return;
  }

  // Service
  if (data.startsWith("S_")) {
    const key = data.slice(2);
    Object.assign(s, { service: key, checked: {}, photoBefore: [], photoAfter: [], criticalDone: {}, step: "photo_before", zoneIdx: 0 });
    await bot.editMessageText(tr(id, "photoBefore", SERVICES[lang(id)][key]), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(id, "startNoPhoto"), callback_data: "START_CLEAN" }]] } });
    return;
  }

  // Start cleaning (after photo before or skipped)
  if (data === "START_CLEAN") {
    s.step = "zones";
    await showZones(id, msgId, s);
    return;
  }

  // Select zone by index
  if (data.startsWith("Z_")) {
    s.zoneIdx = parseInt(data.slice(2));
    s.step = "checklist";
    await showZone(id, msgId, s);
    return;
  }

  // Toggle checklist item
  if (data.startsWith("C_")) {
    const i    = parseInt(data.slice(2));
    const zone = ZONES[s.zoneIdx];
    if (!s.checked[zone]) s.checked[zone] = Array(((CHECKLISTS[s.service]||{})[zone]||[]).length).fill(false);
    s.checked[zone][i] = !s.checked[zone][i];
    await showZone(id, msgId, s);
    return;
  }

  // Back to zones list
  if (data === "BACK_ZONES") {
    s.step = "zones";
    await showZones(id, msgId, s);
    return;
  }

  // Early finish — check for incomplete items and warn
  if (data === "EARLY_FINISH") {
    const l = lang(id);
    const incomplete = [];
    for (const zone of ZONES) {
      const items = (CHECKLISTS[s.service] || {})[zone] || [];
      const ch = s.checked[zone] || [];
      items.forEach((item, i) => {
        if (!ch[i]) incomplete.push(`• ${ZONE_LABELS[l][zone]}: ${item[l] || item.ru}`);
      });
    }
    if (incomplete.length === 0) {
      // All done — go straight to photo after
      s.step = "photo_after";
      s.photoAfter = [];
      await bot.editMessageText(tr(id, "photoAfter"), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(id, "gotoCrit"), callback_data: "CRIT" }]] } });
    } else {
      const list = incomplete.slice(0, 15).join("\n"); // cap at 15 items to avoid message too long
      const extra = incomplete.length > 15 ? `\n...и ещё ${incomplete.length - 15} пунктов` : "";
      const txt = tr(id, "warningTitle") + list + extra + tr(id, "warningFooter");
      await bot.editMessageText(txt, {
        chat_id: id, message_id: msgId, parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [
          [{ text: tr(id, "confirmFinish"), callback_data: "FINISH_FORCED" }],
          [{ text: tr(id, "goBackBtn"),     callback_data: "BACK_ZONES"    }],
        ]},
      });
    }
    return;
  }

  // Forced finish (confirmed despite incomplete)
  if (data === "FINISH_FORCED") {
    const dur = s.startedAt ? Math.round((Date.now() - s.startedAt) / 60000) : "—";
    const nm  = name(id) || q.from.first_name;
    await bot.editMessageText(tr(id, "finished", nm, SERVICES[lang(id)][s.service], dur, s.address||"—", s.photoBefore.length, s.photoAfter.length), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(id, "newOrder"), callback_data: "NEW" }]] } });
    await sendReport(id, s, q.from);
    resetSess(id);
    return;
  }

  // Go to photo after
  if (data === "PHOTO_AFTER") {
    s.step = "photo_after";
    s.photoAfter = [];
    await bot.editMessageText(tr(id, "photoAfter"), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(id, "gotoCrit"), callback_data: "CRIT" }]] } });
    return;
  }

  // Go to critical check
  if (data === "CRIT") {
    s.step = "critical";
    const done  = Object.values(s.criticalDone).filter(Boolean).length;
    const total = CRITICAL_FINAL[lang(id)].length;
    const photoWarning = s.photoAfter.length === 0
      ? "\n⚠️ *Фото ПОСЛЕ не загружены!* Не забудь отправить фото.\n"
      : `\n✅ Фото ПОСЛЕ: ${s.photoAfter.length} шт\n`;
    const title = `📸 Фото ПОСЛЕ: ${s.photoAfter.length} шт${photoWarning}\n🔍 *Шаг 4 — Финальная проверка*\n${bar(done, total)}\n\nПроверь каждый пункт перед сдачей:`;
    await bot.editMessageText(title, { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: critKbd(id, s) });
    return;
  }

  // Toggle critical item
  if (data.startsWith("K_")) {
    const i = parseInt(data.slice(2));
    s.criticalDone[i] = !s.criticalDone[i];
    const done  = Object.values(s.criticalDone).filter(Boolean).length;
    const total = CRITICAL_FINAL[lang(id)].length;
    await bot.editMessageText(tr(id, "critTitle", s.photoAfter.length, bar(done, total)), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: critKbd(id, s) });
    return;
  }

  // Finish order
  if (data === "FINISH") {
    const dur = s.startedAt ? Math.round((Date.now() - s.startedAt) / 60000) : "—";
    const nm  = name(id) || q.from.first_name;
    await bot.editMessageText(tr(id, "finished", nm, SERVICES[lang(id)][s.service], dur, s.address||"—", s.photoBefore.length, s.photoAfter.length), { chat_id: id, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(id, "newOrder"), callback_data: "NEW" }]] } });
    await sendReport(id, s, q.from);
    resetSess(id);
    return;
  }

  // New order
  if (data === "NEW") {
    const s2 = resetSess(id);
    s2.step = "addr";
    s2.startedAt = Date.now();
    await bot.sendMessage(id, tr(id, "newOrderMsg"));
  }
});

console.log("🤖 BCS Bot v3 started (RU/EN/UZ)...");
