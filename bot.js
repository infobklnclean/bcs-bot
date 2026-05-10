const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID;

const bot = new TelegramBot(TOKEN, { polling: true });

// ─── ПЕРЕВОДЫ ─────────────────────────────────────────────────────────────────

const T = {
  ru: {
    askLang: "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName: "👤 Как тебя зовут? Введи имя и фамилию:",
    welcome: (name) => `👋 Привет, *${name}*!\n\n🏢 *BCS Quality Control*\nСистема контроля качества\n\nУкажи адрес объекта:`,
    askAddress: "📍 Укажи адрес объекта (или /skip):",
    chooseService: "🧹 Выбери тип уборки:",
    photoBeforeTitle: (svc) => `${svc}\n\n📸 *Шаг 1 — Фото ДО уборки*\n\nСделай фото каждой зоны ДО начала работы.\n\nМинимум 3 фото:\n• Кухня (плита + раковина)\n• Ванная (унитаз + душ)\n• Общий вид\n\n⬆️ Отправляй фото прямо в этот чат`,
    startWithoutPhoto: "▶️ Начать без фото",
    startCleaning: (n) => `▶️ Начать уборку (фото: ${n})`,
    step2title: (svc, bar) => `${svc}\n\n📋 *Шаг 2 — Уборка по зонам*\n${bar}\n\nВыбери зону:`,
    photoReceived: (n) => `📸 Фото ДО получено (${n} шт)\n\nОтправь ещё или нажми:`,
    photoAfterReceived: (n) => `📸 Фото ПОСЛЕ получено (${n} шт)\n\nОтправь ещё или нажми:`,
    startCleaningBtn: (n) => `▶️ Начать уборку (фото: ${n})`,
    gotoCriticalBtn: (n) => `✅ К финальной проверке (фото: ${n})`,
    allZonesDone: "📸 Все зоны готовы → Фото ПОСЛЕ",
    photoAfterTitle: `✅ *Все зоны выполнены!*\n\n📸 *Шаг 3 — Фото ПОСЛЕ уборки*\n\nСделай фото с тех же точек что и «до»\n\n⬆️ Отправляй фото прямо в этот чат`,
    gotoCritical: "✅ Перейти к финальной проверке",
    criticalTitle: (n, bar) => `📸 Фото ПОСЛЕ: ${n} шт\n\n🔍 *Шаг 4 — Финальная проверка*\n${bar}\n\nПроверь каждый пункт:`,
    finishBtn: "🏁 Завершить заказ и отправить отчёт",
    finished: (name, svc, dur, addr, before, after) =>
      `🎉 *Заказ завершён!*\n\n👤 Клинер: ${name}\n📅 ${new Date().toLocaleString("ru-RU")}\n⏱ Время: ${dur} мин\n🧹 Тип: ${svc}\n📍 Адрес: ${addr}\n📸 Фото до: ${before} шт\n📸 Фото после: ${after} шт\n\n✅ Отчёт отправлен менеджеру BCS\n\nСпасибо за работу! 💪`,
    newOrder: "🔄 Новый заказ",
    newOrderPrompt: "🏠 Укажи адрес нового объекта (или /skip):",
    criticalHint: "🔴 — критичный (обязателен)\n⬜ — стандартный",
    backZones: "← Назад",
    zoneDone: "✅ Зона выполнена",
    zoneProgress: (d, t) => `⏳ ${d}/${t}`,
    reportHeader: (name, user, addr, svc, lang, dur) =>
      `📋 *ОТЧЁТ О ЗАКАЗЕ*\n━━━━━━━━━━━━━━━━━━━━\n👤 Клинер: ${name} (@${user})\n🌐 Язык: ${lang}\n📍 Адрес: ${addr}\n🧹 Тип: ${svc}\n⏱ Время: ${dur} мин\n📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n`,
    reportPhoto: (b, a) => `━━━━━━━━━━━━━━━━━━━━\n📸 Фото до: ${b} шт | После: ${a} шт\n✅ Critical check: пройден`,
    photoBefore: "📸 *Фото ДО:*",
    photoAfterLbl: "📸 *Фото ПОСЛЕ:*",
    notePhotoBefore: (n) => `✅ Фото ДО: ${n} шт\n\n`,
    noteNoPhoto: "⚠️ Фото ДО не добавлены\n\n",
    zoneReport: "Зоны:",
  },
  en: {
    askLang: "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName: "👤 What's your name? Enter first and last name:",
    welcome: (name) => `👋 Hello, *${name}*!\n\n🏢 *BCS Quality Control*\nQuality control system\n\nEnter the property address:`,
    askAddress: "📍 Enter property address (or /skip):",
    chooseService: "🧹 Choose cleaning type:",
    photoBeforeTitle: (svc) => `${svc}\n\n📸 *Step 1 — Photos BEFORE cleaning*\n\nTake photos of each area BEFORE starting.\n\nMin 3 photos:\n• Kitchen (stove + sink)\n• Bathroom (toilet + shower)\n• General view\n\n⬆️ Send photos to this chat`,
    startWithoutPhoto: "▶️ Start without photos",
    startCleaning: (n) => `▶️ Start cleaning (photos: ${n})`,
    step2title: (svc, bar) => `${svc}\n\n📋 *Step 2 — Clean by zones*\n${bar}\n\nSelect a zone:`,
    photoReceived: (n) => `📸 BEFORE photo received (${n})\n\nSend more or tap:`,
    photoAfterReceived: (n) => `📸 AFTER photo received (${n})\n\nSend more or tap:`,
    startCleaningBtn: (n) => `▶️ Start cleaning (photos: ${n})`,
    gotoCriticalBtn: (n) => `✅ Final check (photos: ${n})`,
    allZonesDone: "📸 All zones done → Photos AFTER",
    photoAfterTitle: `✅ *All zones complete!*\n\n📸 *Step 3 — Photos AFTER cleaning*\n\nTake photos from the same spots as before\n\n⬆️ Send photos to this chat`,
    gotoCritical: "✅ Go to final check",
    criticalTitle: (n, bar) => `📸 After photos: ${n}\n\n🔍 *Step 4 — Final check*\n${bar}\n\nVerify each item:`,
    finishBtn: "🏁 Complete order & send report",
    finished: (name, svc, dur, addr, before, after) =>
      `🎉 *Order complete!*\n\n👤 Cleaner: ${name}\n📅 ${new Date().toLocaleString("en-US")}\n⏱ Duration: ${dur} min\n🧹 Type: ${svc}\n📍 Address: ${addr}\n📸 Before: ${before} | After: ${after}\n\n✅ Report sent to BCS manager\n\nGreat work! 💪`,
    newOrder: "🔄 New order",
    newOrderPrompt: "🏠 Enter address for new order (or /skip):",
    criticalHint: "🔴 — critical (required)\n⬜ — standard",
    backZones: "← Back",
    zoneDone: "✅ Zone complete",
    zoneProgress: (d, t) => `⏳ ${d}/${t}`,
    reportHeader: (name, user, addr, svc, lang, dur) =>
      `📋 *ORDER REPORT*\n━━━━━━━━━━━━━━━━━━━━\n👤 Cleaner: ${name} (@${user})\n🌐 Language: ${lang}\n📍 Address: ${addr}\n🧹 Type: ${svc}\n⏱ Duration: ${dur} min\n📅 ${new Date().toLocaleString("en-US")}\n━━━━━━━━━━━━━━━━━━━━\n`,
    reportPhoto: (b, a) => `━━━━━━━━━━━━━━━━━━━━\n📸 Before: ${b} | After: ${a}\n✅ Critical check: passed`,
    photoBefore: "📸 *Photos BEFORE:*",
    photoAfterLbl: "📸 *Photos AFTER:*",
    notePhotoBefore: (n) => `✅ Before photos: ${n}\n\n`,
    noteNoPhoto: "⚠️ No before photos\n\n",
    zoneReport: "Zones:",
  },
  uz: {
    askLang: "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName: "👤 Ismingiz nima? Ism va familiyangizni kiriting:",
    welcome: (name) => `👋 Salom, *${name}*!\n\n🏢 *BCS Quality Control*\nSifat nazorat tizimi\n\nOb'ekt manzilini kiriting:`,
    askAddress: "📍 Ob'ekt manzilini kiriting (yoki /skip):",
    chooseService: "🧹 Tozalash turini tanlang:",
    photoBeforeTitle: (svc) => `${svc}\n\n📸 *1-qadam — Tozalashdan OLDIN suratlar*\n\nHar bir zonani OLDIN suratlang.\n\nKamida 3 surat:\n• Oshxona (plita + lavabo)\n• Hammom (unitaz + dush)\n• Umumiy ko'rinish\n\n⬆️ Suratlarni shu chatga yuboring`,
    startWithoutPhoto: "▶️ Suratsiz boshlash",
    startCleaning: (n) => `▶️ Boshlash (surat: ${n})`,
    step2title: (svc, bar) => `${svc}\n\n📋 *2-qadam — Zonalar bo'yicha tozalash*\n${bar}\n\nZonani tanlang:`,
    photoReceived: (n) => `📸 OLDIN surati qabul qilindi (${n} ta)\n\nYana yuboring yoki:`,
    photoAfterReceived: (n) => `📸 KEYIN surati qabul qilindi (${n} ta)\n\nYana yuboring yoki:`,
    startCleaningBtn: (n) => `▶️ Boshlash (surat: ${n})`,
    gotoCriticalBtn: (n) => `✅ Yakuniy tekshiruv (surat: ${n})`,
    allZonesDone: "📸 Barcha zonalar tayyor → KEYIN suratlar",
    photoAfterTitle: `✅ *Barcha zonalar bajarildi!*\n\n📸 *3-qadam — Tozalashdan KEYIN suratlar*\n\nOldingi nuqtalardan surat oling\n\n⬆️ Suratlarni shu chatga yuboring`,
    gotoCritical: "✅ Yakuniy tekshiruvga o'tish",
    criticalTitle: (n, bar) => `📸 Keyin suratlari: ${n} ta\n\n🔍 *4-qadam — Yakuniy tekshiruv*\n${bar}\n\nHar bir bandni tekshiring:`,
    finishBtn: "🏁 Buyurtmani yakunlash va hisobot yuborish",
    finished: (name, svc, dur, addr, before, after) =>
      `🎉 *Buyurtma yakunlandi!*\n\n👤 Tozalovchi: ${name}\n📅 ${new Date().toLocaleString("ru-RU")}\n⏱ Vaqt: ${dur} daqiqa\n🧹 Turi: ${svc}\n📍 Manzil: ${addr}\n📸 Oldin: ${before} ta | Keyin: ${after} ta\n\n✅ Hisobot BCS menejeriga yuborildi\n\nRahmat! 💪`,
    newOrder: "🔄 Yangi buyurtma",
    newOrderPrompt: "🏠 Yangi ob'ekt manzilini kiriting (yoki /skip):",
    criticalHint: "🔴 — muhim (majburiy)\n⬜ — standart",
    backZones: "← Orqaga",
    zoneDone: "✅ Zona bajarildi",
    zoneProgress: (d, t) => `⏳ ${d}/${t}`,
    reportHeader: (name, user, addr, svc, lang, dur) =>
      `📋 *BUYURTMA HISOBOTI*\n━━━━━━━━━━━━━━━━━━━━\n👤 Tozalovchi: ${name} (@${user})\n🌐 Til: ${lang}\n📍 Manzil: ${addr}\n🧹 Turi: ${svc}\n⏱ Vaqt: ${dur} daqiqa\n📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n`,
    reportPhoto: (b, a) => `━━━━━━━━━━━━━━━━━━━━\n📸 Oldin: ${b} ta | Keyin: ${a} ta\n✅ Muhim tekshiruv: o'tdi`,
    photoBefore: "📸 *Oldin suratlari:*",
    photoAfterLbl: "📸 *Keyin suratlari:*",
    notePhotoBefore: (n) => `✅ Oldin suratlari: ${n} ta\n\n`,
    noteNoPhoto: "⚠️ Oldin suratlari yo'q\n\n",
    zoneReport: "Zonalar:",
  },
};

const LANG_NAMES = { ru: "🇷🇺 Русский", en: "🇺🇸 English", uz: "🇺🇿 O'zbek" };

const SERVICES = {
  ru: { deep: "🧹 Deep Cleaning", regular: "🏠 Regular Standard", moveinout: "📦 Move In / Move Out", postconstruction: "🔨 Post Construction" },
  en: { deep: "🧹 Deep Cleaning", regular: "🏠 Regular Standard", moveinout: "📦 Move In / Move Out", postconstruction: "🔨 Post Construction" },
  uz: { deep: "🧹 Chuqur tozalash", regular: "🏠 Standart tozalash", moveinout: "📦 Kirish / Chiqish", postconstruction: "🔨 Qurilishdan keyin" },
};

const CHECKLISTS = {
  deep: {
    "🍳 Kitchen": [
      { ru: "Обезжирить и вымыть плиту изнутри и снаружи", en: "Degrease and clean stove inside and out", uz: "Plitani ichidan va tashqaridan yog'sizlantirish", critical: true },
      { ru: "Очистить духовку, включая противни и решётки", en: "Clean oven including trays and racks", uz: "Pechni tozalash (tegachlar va panjaralar)", critical: true },
      { ru: "Вымыть холодильник изнутри, включая уплотнители", en: "Clean fridge inside including seals", uz: "Muzlatgichni ichidan tozalash (zichlashlar bilan)", critical: false },
      { ru: "Обработать вытяжку и фильтры", en: "Clean exhaust hood and filters", uz: "Ventilyatsiya va filtrlarni tozalash", critical: false },
      { ru: "Протереть все фасады, ручки и петли шкафов", en: "Wipe all cabinet doors, handles and hinges", uz: "Shkaf eshiklari, tutqichlari va piroqlarini artish", critical: false },
      { ru: "Очистить микроволновку изнутри и снаружи", en: "Clean microwave inside and out", uz: "Mikrotolqinli pechni tozalash", critical: false },
      { ru: "Почистить раковину и смеситель до блеска", en: "Polish sink and faucet to a shine", uz: "Lavabo va kranini yaltiratib tozalash", critical: true },
      { ru: "Вымыть пол и плинтусы", en: "Mop floor and clean baseboards", uz: "Pol va plintuslarni yuvish", critical: false },
    ],
    "🚿 Bathroom": [
      { ru: "Удалить известковый налёт с кафеля и стекла", en: "Remove limescale from tiles and glass", uz: "Kafel va oynadan ohak dog'larini ketkazish", critical: true },
      { ru: "Дезинфицировать унитаз снаружи и под ободком", en: "Disinfect toilet outside and under rim", uz: "Unitazni dezinfeksiyalash", critical: true },
      { ru: "Очистить душевую кабину / ванну от налёта", en: "Clean shower/bathtub from soap scum", uz: "Dush kabinasi / vannani tozalash", critical: true },
      { ru: "Вымыть зеркало без разводов", en: "Clean mirror without streaks", uz: "Oynani chiziqsiz yuvish", critical: false },
      { ru: "Протереть все поверхности и полки", en: "Wipe all surfaces and shelves", uz: "Barcha yuzalar va javonlarni artish", critical: false },
      { ru: "Вымыть пол и плинтусы", en: "Mop floor and clean baseboards", uz: "Pol va plintuslarni yuvish", critical: false },
    ],
    "🛏 Bedroom": [
      { ru: "Протереть пыль со всех поверхностей и мебели", en: "Dust all surfaces and furniture", uz: "Barcha yuzalar va mebeldan changini artish", critical: false },
      { ru: "Пропылесосить матрас", en: "Vacuum the mattress", uz: "Matrasni changsos bilan tozalash", critical: false },
      { ru: "Вымыть окна изнутри", en: "Clean windows from inside", uz: "Derazalarni ichidan yuvish", critical: false },
      { ru: "Протереть плинтусы и вентиляционные решётки", en: "Wipe baseboards and vents", uz: "Plintuslar va ventilyatsiya panjaralarini artish", critical: false },
      { ru: "Пропылесосить ковёр / вымыть пол", en: "Vacuum carpet / mop floor", uz: "Gilam changsos / pol yuvish", critical: true },
    ],
    "🛋 Living Room": [
      { ru: "Протереть пыль с мебели, полок и декора", en: "Dust furniture, shelves and decor", uz: "Mebel, javon va dekordan changini artish", critical: false },
      { ru: "Пропылесосить диван и подушки", en: "Vacuum sofa and cushions", uz: "Divan va yostiqlarni changsos bilan tozalash", critical: false },
      { ru: "Очистить телевизор и технику от пыли", en: "Dust TV and electronics", uz: "Televizor va texnikadan changini artish", critical: false },
      { ru: "Вымыть пол, уделить внимание углам", en: "Mop floor, focus on corners", uz: "Polni yuvish, burchaklarga e'tibor berish", critical: true },
    ],
    "🚪 Hallway": [
      { ru: "Протереть входную дверь и дверную ручку", en: "Wipe front door and handle", uz: "Kirish eshigi va tutqichini artish", critical: false },
      { ru: "Вымыть пол и плинтусы", en: "Mop floor and baseboards", uz: "Pol va plintuslarni yuvish", critical: false },
      { ru: "Протереть зеркало", en: "Clean mirror", uz: "Oynani artish", critical: false },
    ],
    "🪟 Windows": [
      { ru: "Вымыть стёкла изнутри без разводов", en: "Clean glass inside without streaks", uz: "Oynalarni ichidan chiziqsiz yuvish", critical: true },
      { ru: "Протереть рамы и подоконники", en: "Wipe frames and window sills", uz: "Ramalar va tokchalarni artish", critical: false },
      { ru: "Очистить жалюзи / вытереть пыль с занавесей", en: "Clean blinds / dust curtains", uz: "Jaluzini tozalash / pardadan changini artish", critical: false },
    ],
  },
  regular: {
    "🍳 Kitchen": [
      { ru: "Протереть плиту снаружи", en: "Wipe stove exterior", uz: "Plitani tashqaridan artish", critical: true },
      { ru: "Протереть все поверхности и столешницу", en: "Wipe all surfaces and countertop", uz: "Barcha yuzalar va stolüstini artish", critical: false },
      { ru: "Почистить раковину и смеситель", en: "Clean sink and faucet", uz: "Lavabo va kranini tozalash", critical: true },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: false },
      { ru: "Вынести мусор", en: "Take out trash", uz: "Axlatni olib chiqish", critical: false },
    ],
    "🚿 Bathroom": [
      { ru: "Дезинфицировать унитаз", en: "Disinfect toilet", uz: "Unitazni dezinfeksiyalash", critical: true },
      { ru: "Протереть раковину и смеситель", en: "Wipe sink and faucet", uz: "Lavabo va kranini artish", critical: true },
      { ru: "Вымыть зеркало", en: "Clean mirror", uz: "Oynani yuvish", critical: false },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: false },
    ],
    "🛏 Bedroom": [
      { ru: "Протереть пыль с поверхностей", en: "Dust surfaces", uz: "Yuzalardan changini artish", critical: false },
      { ru: "Пропылесосить / вымыть пол", en: "Vacuum / mop floor", uz: "Changsos / pol yuvish", critical: true },
    ],
    "🛋 Living Room": [
      { ru: "Протереть пыль", en: "Dust surfaces", uz: "Changini artish", critical: false },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: true },
    ],
    "🚪 Hallway": [
      { ru: "Подмести / вымыть пол", en: "Sweep / mop floor", uz: "Supurish / pol yuvish", critical: false },
    ],
    "🪟 Windows": [
      { ru: "Протереть подоконники", en: "Wipe window sills", uz: "Tokchalarni artish", critical: false },
    ],
  },
  moveinout: {
    "🍳 Kitchen": [
      { ru: "Полная очистка духовки и плиты изнутри", en: "Full oven and stove cleaning inside", uz: "Pech va plitani ichidan to'liq tozalash", critical: true },
      { ru: "Вымыть холодильник изнутри", en: "Clean fridge inside", uz: "Muzlatgichni ichidan yuvish", critical: true },
      { ru: "Очистить все шкафы внутри и снаружи", en: "Clean all cabinets inside and out", uz: "Barcha shkaflarni tozalash", critical: true },
      { ru: "Обработать вытяжку", en: "Clean exhaust hood", uz: "Ventilyatsiyani tozalash", critical: false },
      { ru: "Вымыть пол и плинтусы", en: "Mop floor and baseboards", uz: "Pol va plintuslarni yuvish", critical: false },
    ],
    "🚿 Bathroom": [
      { ru: "Полная дезинфекция всех поверхностей", en: "Full disinfection of all surfaces", uz: "Barcha yuzalarni dezinfeksiyalash", critical: true },
      { ru: "Удаление плесени и налёта", en: "Remove mold and limescale", uz: "Mog'or va ohak dog'larini ketkazish", critical: true },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: false },
    ],
    "🛏 Bedroom": [
      { ru: "Очистить шкафы и полки изнутри", en: "Clean wardrobes and shelves inside", uz: "Shkaf va javonlarni ichidan tozalash", critical: true },
      { ru: "Пропылесосить и вымыть пол", en: "Vacuum and mop floor", uz: "Changsos va pol yuvish", critical: true },
      { ru: "Вымыть окна", en: "Clean windows", uz: "Derazalarni yuvish", critical: false },
    ],
    "🛋 Living Room": [
      { ru: "Полная очистка всех поверхностей", en: "Full cleaning of all surfaces", uz: "Barcha yuzalarni to'liq tozalash", critical: false },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: true },
    ],
    "🚪 Hallway": [
      { ru: "Протереть входную дверь снаружи и изнутри", en: "Wipe front door outside and inside", uz: "Kirish eshigini tozalash", critical: false },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: false },
    ],
    "🪟 Windows": [
      { ru: "Вымыть все окна изнутри", en: "Clean all windows inside", uz: "Barcha derazalarni yuvish", critical: true },
      { ru: "Протереть рамы и подоконники", en: "Wipe frames and sills", uz: "Ramalar va tokchalarni artish", critical: false },
    ],
  },
  postconstruction: {
    "🍳 Kitchen": [
      { ru: "Удалить строительную пыль со всех поверхностей", en: "Remove construction dust from all surfaces", uz: "Barcha yuzalardan qurilish changini ketkazish", critical: true },
      { ru: "Очистить технику от защитных плёнок", en: "Remove protective films from appliances", uz: "Texnikadan himoya plyonkalarini olib tashlash", critical: false },
      { ru: "Вымыть пол с обезжиривателем", en: "Mop floor with degreaser", uz: "Polni yog'sizlantirgich bilan yuvish", critical: true },
    ],
    "🚿 Bathroom": [
      { ru: "Удалить остатки затирки и раствора", en: "Remove grout and mortar residue", uz: "Grout va tsement qoldiqlarini ketkazish", critical: true },
      { ru: "Протереть новую сантехнику", en: "Wipe new plumbing fixtures", uz: "Yangi santexnikani artish", critical: false },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: true },
    ],
    "🛏 Bedroom": [
      { ru: "Протереть пыль со всех поверхностей (2 этапа)", en: "Dust all surfaces (2 rounds)", uz: "Barcha yuzalardan changini artish (2 bosqich)", critical: true },
      { ru: "Пропылесосить и вымыть пол", en: "Vacuum and mop floor", uz: "Changsos va pol yuvish", critical: true },
    ],
    "🛋 Living Room": [
      { ru: "Двойная протирка всех горизонтальных поверхностей", en: "Double wipe all horizontal surfaces", uz: "Barcha gorizontal yuzalarni ikki marta artish", critical: true },
      { ru: "Вымыть пол с обезжиривателем", en: "Mop floor with degreaser", uz: "Polni yog'sizlantirgich bilan yuvish", critical: true },
    ],
    "🚪 Hallway": [
      { ru: "Убрать строительный мусор", en: "Remove construction debris", uz: "Qurilish axlatini olib chiqish", critical: true },
      { ru: "Вымыть пол", en: "Mop floor", uz: "Polni yuvish", critical: false },
    ],
    "🪟 Windows": [
      { ru: "Удалить наклейки и цемент со стёкол", en: "Remove stickers and cement from glass", uz: "Oynalardan stikerlar va tsementni ketkazish", critical: true },
      { ru: "Вымыть стёкла и рамы", en: "Clean glass and frames", uz: "Oynalar va ramalarni yuvish", critical: true },
    ],
  },
};

const CRITICAL_FINAL = {
  ru: ["Унитаз дезинфицирован (нет запаха, нет загрязнений)", "Плита / духовка очищена", "Полы вымыты во всех зонах", "Фото «до» и «после» загружены", "Раковина без налёта", "Химикаты смыты, нет запаха", "Мусор вынесен", "Зеркала без разводов"],
  en: ["Toilet disinfected (no smell, no dirt)", "Stove / oven cleaned", "Floors mopped in all zones", "Before and after photos uploaded", "Sink free of limescale", "Chemicals rinsed, no smell", "Trash taken out", "Mirrors streak-free"],
  uz: ["Unitaz dezinfeksiyalangan (hid yo'q, kir yo'q)", "Plita / pech tozalangan", "Barcha zonalarda pol yuvilgan", "Oldin va keyin suratlari yuklangan", "Lavabo ohaklardan tozalangan", "Kimyoviy moddalar yuvib tashlangan", "Axlat olib chiqilgan", "Oynalarda chiziq yo'q"],
};

// ─── СЕССИИ И ХЕЛПЕРЫ ────────────────────────────────────────────────────────

const sessions = {};
const cleaners = {}; // chatId → { name, lang }

function getSession(chatId) {
  if (!sessions[chatId]) sessions[chatId] = { step: "idle", service: null, zones: [], currentZone: null, checked: {}, photoBefore: [], photoAfter: [], criticalDone: {}, startedAt: null, address: null };
  return sessions[chatId];
}
function resetSession(chatId) { sessions[chatId] = null; return getSession(chatId); }
function getLang(chatId) { return (cleaners[chatId] && cleaners[chatId].lang) || "ru"; }
function getName(chatId) { return (cleaners[chatId] && cleaners[chatId].name) || ""; }
function tr(chatId, key, ...args) { const lang = getLang(chatId); const fn = T[lang][key]; return typeof fn === "function" ? fn(...args) : fn; }
function progressBar(done, total) { const f = total ? Math.round((done / total) * 8) : 0; return "█".repeat(f) + "░".repeat(8 - f) + ` ${done}/${total}`; }
function getItemText(item, lang) { return item[lang] || item.ru; }

// ─── КЛАВИАТУРЫ ───────────────────────────────────────────────────────────────

function langKeyboard() {
  return { inline_keyboard: [
    [{ text: "🇷🇺 Русский", callback_data: "lang_ru" }],
    [{ text: "🇺🇸 English", callback_data: "lang_en" }],
    [{ text: "🇺🇿 O'zbek", callback_data: "lang_uz" }],
  ]};
}

function serviceKbd(chatId) {
  const lang = getLang(chatId);
  return { inline_keyboard: Object.entries(SERVICES[lang]).map(([k, v]) => [{ text: v, callback_data: `svc_${k}` }]) };
}

function zonesKbd(chatId, session) {
  const rows = session.zones.map(zone => {
    const items = CHECKLISTS[session.service][zone];
    const ch = session.checked[zone] || [];
    const done = ch.filter(Boolean).length;
    const icon = done === items.length ? "✅" : done > 0 ? "🔄" : "⬜";
    return [{ text: `${icon} ${zone} (${done}/${items.length})`, callback_data: `zone_${zone}` }];
  });
  const allDone = session.zones.every(z => (session.checked[z] || []).filter(Boolean).length === CHECKLISTS[session.service][z].length);
  if (allDone) rows.push([{ text: tr(chatId, "allZonesDone"), callback_data: "goto_photo_after" }]);
  return { inline_keyboard: rows };
}

function checklistKbd(chatId, session, zone) {
  const lang = getLang(chatId);
  const items = CHECKLISTS[session.service][zone];
  if (!session.checked[zone]) session.checked[zone] = Array(items.length).fill(false);
  const ch = session.checked[zone];
  const rows = items.map((item, i) => {
    const icon = ch[i] ? "✅" : item.critical ? "🔴" : "⬜";
    const label = getItemText(item, lang).slice(0, 40);
    return [{ text: `${icon} ${label}`, callback_data: `chk_${i}_${zone}` }];
  });
  const done = ch.filter(Boolean).length;
  rows.push([
    { text: tr(chatId, "backZones"), callback_data: "back_zones" },
    { text: done === items.length ? tr(chatId, "zoneDone") : tr(chatId, "zoneProgress", done, items.length), callback_data: done === items.length ? "zone_complete" : "zone_incomplete" },
  ]);
  return { inline_keyboard: rows };
}

function criticalKbd(chatId, session) {
  const lang = getLang(chatId);
  const items = CRITICAL_FINAL[lang];
  const rows = items.map((item, i) => [{ text: `${session.criticalDone[i] ? "✅" : "⬜"} ${item}`, callback_data: `crit_${i}` }]);
  if (items.every((_, i) => session.criticalDone[i])) rows.push([{ text: tr(chatId, "finishBtn"), callback_data: "finish_order" }]);
  return { inline_keyboard: rows };
}

// ─── ОТЧЁТ ───────────────────────────────────────────────────────────────────

async function sendReport(chatId, session, user) {
  if (!ADMIN_ID) return;
  const lang = getLang(chatId);
  const svc = SERVICES[lang][session.service];
  const dur = session.startedAt ? Math.round((Date.now() - session.startedAt) / 60000) : "—";
  const name = getName(chatId) || user.first_name;
  let zones = "";
  for (const z of session.zones) {
    const ch = session.checked[z] || [];
    zones += `${z}: ${ch.filter(Boolean).length}/${CHECKLISTS[session.service][z].length}\n`;
  }
  const text = tr(chatId, "reportHeader", name, user.username || "—", session.address || "—", svc, LANG_NAMES[lang], dur) + `${tr(chatId, "zoneReport")}\n${zones}` + tr(chatId, "reportPhoto", session.photoBefore.length, session.photoAfter.length);
  await bot.sendMessage(ADMIN_ID, text, { parse_mode: "Markdown" });
  if (session.photoBefore.length > 0) { await bot.sendMessage(ADMIN_ID, tr(chatId, "photoBefore"), { parse_mode: "Markdown" }); for (const f of session.photoBefore) await bot.sendPhoto(ADMIN_ID, f); }
  if (session.photoAfter.length > 0) { await bot.sendMessage(ADMIN_ID, tr(chatId, "photoAfterLbl"), { parse_mode: "Markdown" }); for (const f of session.photoAfter) await bot.sendPhoto(ADMIN_ID, f); }
}

// ─── /start ───────────────────────────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  resetSession(chatId);
  if (cleaners[chatId] && cleaners[chatId].name) {
    const s = getSession(chatId);
    s.step = "await_address";
    s.startedAt = Date.now();
    await bot.sendMessage(chatId, tr(chatId, "welcome", getName(chatId)), { parse_mode: "Markdown" });
  } else {
    await bot.sendMessage(chatId, T.ru.askLang, { reply_markup: langKeyboard() });
  }
});

// ─── СООБЩЕНИЯ ───────────────────────────────────────────────────────────────

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const session = getSession(chatId);

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    if (session.step === "photo_before") {
      session.photoBefore.push(fileId);
      await bot.sendMessage(chatId, tr(chatId, "photoReceived", session.photoBefore.length), { reply_markup: { inline_keyboard: [[{ text: tr(chatId, "startCleaningBtn", session.photoBefore.length), callback_data: "start_cleaning" }]] } });
    } else if (session.step === "photo_after") {
      session.photoAfter.push(fileId);
      await bot.sendMessage(chatId, tr(chatId, "photoAfterReceived", session.photoAfter.length), { reply_markup: { inline_keyboard: [[{ text: tr(chatId, "gotoCriticalBtn", session.photoAfter.length), callback_data: "goto_critical" }]] } });
    }
    return;
  }

  if (!msg.text || msg.text.startsWith("/start")) return;

  if (session.step === "await_name") {
    cleaners[chatId].name = msg.text.trim();
    session.step = "await_address";
    session.startedAt = Date.now();
    await bot.sendMessage(chatId, tr(chatId, "welcome", getName(chatId)), { parse_mode: "Markdown" });
    return;
  }

  if (session.step === "await_address") {
    if (msg.text !== "/skip") session.address = msg.text.trim();
    session.step = "select_service";
    await bot.sendMessage(chatId, tr(chatId, "chooseService"), { reply_markup: serviceKbd(chatId) });
  }
});

// ─── CALLBACK ─────────────────────────────────────────────────────────────────

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;
  const session = getSession(chatId);
  await bot.answerCallbackQuery(query.id);

  if (data.startsWith("lang_")) {
    const lang = data.replace("lang_", "");
    cleaners[chatId] = { lang, name: null };
    getSession(chatId).step = "await_name";
    await bot.editMessageText(T[lang].askName, { chat_id: chatId, message_id: msgId });
    return;
  }

  if (data.startsWith("svc_")) {
    const key = data.replace("svc_", "");
    Object.assign(session, { service: key, zones: Object.keys(CHECKLISTS[key]), checked: {}, photoBefore: [], photoAfter: [], criticalDone: {}, step: "photo_before" });
    await bot.editMessageText(tr(chatId, "photoBeforeTitle", SERVICES[getLang(chatId)][key]), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(chatId, "startWithoutPhoto"), callback_data: "start_cleaning" }]] } });
    return;
  }

  if (data === "start_cleaning") {
    session.step = "zones";
    const total = session.zones.reduce((s, z) => s + CHECKLISTS[session.service][z].length, 0);
    await bot.editMessageText(tr(chatId, "step2title", SERVICES[getLang(chatId)][session.service], progressBar(0, total)), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: zonesKbd(chatId, session) });
    return;
  }

  if (data.startsWith("zone_")) {
    const zone = data.replace("zone_", "");
    session.currentZone = zone;
    session.step = "checklist";
    if (!session.checked[zone]) session.checked[zone] = Array(CHECKLISTS[session.service][zone].length).fill(false);
    const done = session.checked[zone].filter(Boolean).length;
    const total = CHECKLISTS[session.service][zone].length;
    await bot.editMessageText(`*${zone}*\n${progressBar(done, total)}\n\n${tr(chatId, "criticalHint")}`, { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: checklistKbd(chatId, session, zone) });
    return;
  }

  if (data.startsWith("chk_")) {
    const parts = data.split("_");
    const idx = parseInt(parts[1]);
    const zone = parts.slice(2).join("_");
    if (!session.checked[zone]) session.checked[zone] = Array(CHECKLISTS[session.service][zone].length).fill(false);
    session.checked[zone][idx] = !session.checked[zone][idx];
    const done = session.checked[zone].filter(Boolean).length;
    const total = CHECKLISTS[session.service][zone].length;
    await bot.editMessageText(`*${zone}*\n${progressBar(done, total)}\n\n${tr(chatId, "criticalHint")}`, { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: checklistKbd(chatId, session, zone) });
    return;
  }

  if (data === "back_zones" || data === "zone_complete" || data === "zone_incomplete") {
    session.step = "zones";
    const total = session.zones.reduce((s, z) => s + CHECKLISTS[session.service][z].length, 0);
    const done = session.zones.reduce((s, z) => s + (session.checked[z] || []).filter(Boolean).length, 0);
    await bot.editMessageText(tr(chatId, "step2title", SERVICES[getLang(chatId)][session.service], progressBar(done, total)), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: zonesKbd(chatId, session) });
    return;
  }

  if (data === "goto_photo_after") {
    session.step = "photo_after";
    session.photoAfter = [];
    await bot.editMessageText(tr(chatId, "photoAfterTitle"), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(chatId, "gotoCritical"), callback_data: "goto_critical" }]] } });
    return;
  }

  if (data === "goto_critical") {
    session.step = "critical";
    const done = Object.values(session.criticalDone).filter(Boolean).length;
    const total = CRITICAL_FINAL[getLang(chatId)].length;
    await bot.editMessageText(tr(chatId, "criticalTitle", session.photoAfter.length, progressBar(done, total)), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: criticalKbd(chatId, session) });
    return;
  }

  if (data.startsWith("crit_")) {
    const idx = parseInt(data.replace("crit_", ""));
    session.criticalDone[idx] = !session.criticalDone[idx];
    const done = Object.values(session.criticalDone).filter(Boolean).length;
    const total = CRITICAL_FINAL[getLang(chatId)].length;
    await bot.editMessageText(tr(chatId, "criticalTitle", session.photoAfter.length, progressBar(done, total)), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: criticalKbd(chatId, session) });
    return;
  }

  if (data === "finish_order") {
    const dur = session.startedAt ? Math.round((Date.now() - session.startedAt) / 60000) : "—";
    await bot.editMessageText(tr(chatId, "finished", getName(chatId) || query.from.first_name, SERVICES[getLang(chatId)][session.service], dur, session.address || "—", session.photoBefore.length, session.photoAfter.length), { chat_id: chatId, message_id: msgId, parse_mode: "Markdown", reply_markup: { inline_keyboard: [[{ text: tr(chatId, "newOrder"), callback_data: "new_order" }]] } });
    await sendReport(chatId, session, query.from);
    resetSession(chatId);
    return;
  }

  if (data === "new_order") {
    const s = resetSession(chatId);
    s.step = "await_address";
    s.startedAt = Date.now();
    await bot.sendMessage(chatId, tr(chatId, "newOrderPrompt"));
  }
});

console.log("🤖 BCS Quality Bot started (RU/EN/UZ)...");
