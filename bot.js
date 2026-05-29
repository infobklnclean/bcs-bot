const TelegramBot = require("node-telegram-bot-api");

const TOKEN    = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID;
const bot      = new TelegramBot(TOKEN, { polling: true });

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const T = {
  ru: {
    askLang:    "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName:    "👤 Введи своё имя и фамилию:",
    askClient:  "👤 Укажи имя клиента:",
    changeLang: "🌐 Сменить язык",

    contractMsg:
      `📋 *ВАЖНО — Стандарт компании BCS*\n\n` +
      `Согласно контракту 1099, заказ считается *завершённым и оплачиваемым* только при выполнении всех этапов:\n\n` +
      `1️⃣ Фото униформы\n` +
      `2️⃣ Фото средств и оборудования\n` +
      `3️⃣ Фото ДО → отчёт менеджеру\n` +
      `4️⃣ Фото ПОСЛЕ\n` +
      `5️⃣ Сдача работы клиенту\n\n` +
      `❗️ Без сдачи заказа клиенту — оплата не назначается.\n\nНажми чтобы начать:`,
    contractBtn: "✅ Понял, начинаю",

    // Step 1
    photoExterior:
      `📸 *Шаг 1 — Фото униформы*\n\n` +
      `Сфотографируй себя в полной форме:\n` +
      `• Чёрный верх\n• Чёрный низ\n• Носки\n• Сменная обувь\n• Перчатки\n\n` +
      `⬆️ Отправь фото в чат:`,
    photoExteriorGot: (n) => `📸 Форма: ${n} фото. Отправь ещё или продолжи:`,
    exteriorDone: "✅ Готово → Шаг 2: Оборудование",

    // Step 2
    photoEquip:
      `🧴 *Шаг 2 — Фото оборудования*\n\n` +
      `Сфотографируй все средства и оборудование:\n` +
      `• Моющие средства\n• Пылесос\n• Швабры, тряпки, губки\n\n` +
      `⬆️ Отправь фото в чат:`,
    photoEquipGot: (n) => `🧴 Оборудование: ${n} фото. Отправь ещё или продолжи:`,
    equipDone: "✅ Готово → Шаг 3: Фото ДО",

    // Step 3
    photoBefore:
      `📸 *Шаг 3 — Фото ДО уборки*\n\n` +
      `‼️ Сфотографируй *каждую зону* которую будешь убирать.\n\n` +
      `Обязательно: кухня, ванная, спальня, гостиная, коридор, окна.\n\n` +
      `⬆️ Отправь фото в чат:`,
    photoBeforeGot: (n) => `📸 Фото ДО: ${n} шт. Отправь ещё или продолжи:`,
    beforeDone: (n) => `✅ Готово (${n} фото) → Отправить отчёт №1`,

    // Report 1 sent
    report1Sent:
      `✅ *Отчёт №1 отправлен менеджеру!*\n\n` +
      `Теперь выполняй уборку.\n\n` +
      `Как закончишь — нажми кнопку ниже:`,
    startAfter: "🧹 Уборка завершена → Фото ПОСЛЕ",

    // Step 4
    photoAfter:
      `📸 *Шаг 4 — Фото ПОСЛЕ уборки*\n\n` +
      `Фотографируй с тех же точек что и «до».\n\n` +
      `⬆️ Отправь фото в чат:`,
    photoAfterGot: (n) => `📸 Фото ПОСЛЕ: ${n} шт. Отправь ещё или продолжи:`,
    afterDone: (n) => `✅ Готово (${n} фото) → Шаг 5: Сдача клиенту`,

    // Step 5
    handover:
      `🤝 *Шаг 5 — Сдача работы клиенту*\n\n` +
      `Согласно контракту 1099, ты *обязан* сдать работу клиенту:\n\n` +
      `• Пройдись с клиентом по всем зонам\n` +
      `• Покажи результат уборки\n` +
      `• Получи подтверждение что клиент доволен\n\n` +
      `❗️ Только после подтверждения работа считается завершённой.\n\nКлиент принял работу?`,
    handoverBtn: "✅ Клиент принял работу",

    waitPayment:
      `⏳ *Ожидай оплату*\n\n` +
      `Отчёт №2 отправлен менеджеру ✅\n\n` +
      `🚫 *Не уходи с объекта* пока менеджер не подтвердит получение оплаты.\n\n` +
      `Как только оплата поступит — менеджер напишет тебе сюда.\n\n` +
      `💬 Ожидай сообщения...`,

    paymentConfirmed: (name) =>
      `✅ *Оплата подтверждена!*\n\n👤 ${name} — оплата за заказ получена.\n\nМожешь покинуть объект. Спасибо! 💪`,

    newOrder:    "🔄 Новый заказ",
    newOrderMsg: "👤 Имя клиента для нового заказа:",

    report1Title: (name, user, client) =>
      `📋 *ОТЧЁТ №1 — НАЧАЛО УБОРКИ*\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👷 ${name} (@${user})\n🧑‍💼 Клиент: ${client}\n` +
      `📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 Форма: {ext} шт\n🧴 Оборудование: {eq} шт\n📸 Фото ДО: {bef} шт`,

    report2Title: (name, user, client, dur) =>
      `📋 *ОТЧЁТ №2 — ЗАВЕРШЕНИЕ УБОРКИ*\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👷 ${name} (@${user})\n🧑‍💼 Клиент: ${client}\n⏱ ${dur} мин\n` +
      `📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 Фото ПОСЛЕ: {aft} шт\n✅ Клиент принял работу`,

    payConfirmBtn: (name) => `💳 Подтвердить оплату для ${name}`,
    needPhoto: "⚠️ Сначала отправь хотя бы одно фото!",
  },

  en: {
    askLang:    "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName:    "👤 Enter your first and last name:",
    askClient:  "👤 Enter client name:",
    changeLang: "🌐 Change language",

    contractMsg:
      `📋 *IMPORTANT — BCS Company Standard*\n\n` +
      `Per 1099 contract, an order is *complete and payable* only when all steps are done:\n\n` +
      `1️⃣ Uniform photo\n` +
      `2️⃣ Photo of supplies & equipment\n` +
      `3️⃣ Photos BEFORE → report to manager\n` +
      `4️⃣ Photos AFTER\n` +
      `5️⃣ Client acceptance & sign-off\n\n` +
      `❗️ Without client sign-off — payment is NOT assigned.\n\nTap to begin:`,
    contractBtn: "✅ Understood, let's start",

    photoExterior:
      `📸 *Step 1 — Uniform Photo*\n\n` +
      `Take a photo of yourself in full uniform:\n` +
      `• Black top\n• Black bottoms\n• Socks\n• Indoor shoes\n• Gloves\n\n` +
      `⬆️ Send photo to chat:`,
    photoExteriorGot: (n) => `📸 Uniform: ${n} photo(s). Send more or continue:`,
    exteriorDone: "✅ Done → Step 2: Equipment",

    photoEquip:
      `🧴 *Step 2 — Equipment Photos*\n\n` +
      `Photo all supplies and equipment:\n` +
      `• Cleaning products\n• Vacuum cleaner\n• Mops, cloths, sponges\n\n` +
      `⬆️ Send photos to chat:`,
    photoEquipGot: (n) => `🧴 Equipment: ${n} photo(s). Send more or continue:`,
    equipDone: "✅ Done → Step 3: Before Photos",

    photoBefore:
      `📸 *Step 3 — Photos BEFORE Cleaning*\n\n` +
      `‼️ Photo *every zone* you will be cleaning.\n\n` +
      `Required: kitchen, bathroom, bedroom, living room, hallway, windows.\n\n` +
      `⬆️ Send photos to chat:`,
    photoBeforeGot: (n) => `📸 Before: ${n} photo(s). Send more or continue:`,
    beforeDone: (n) => `✅ Done (${n} photos) → Send Report #1`,

    report1Sent:
      `✅ *Report #1 sent to manager!*\n\n` +
      `Now go ahead and clean.\n\n` +
      `When you're done — tap the button below:`,
    startAfter: "🧹 Cleaning done → Photos AFTER",

    photoAfter:
      `📸 *Step 4 — Photos AFTER Cleaning*\n\n` +
      `Same spots as the before photos.\n\n` +
      `⬆️ Send photos to chat:`,
    photoAfterGot: (n) => `📸 After: ${n} photo(s). Send more or continue:`,
    afterDone: (n) => `✅ Done (${n} photos) → Step 5: Client Handover`,

    handover:
      `🤝 *Step 5 — Client Handover*\n\n` +
      `Per 1099 contract, you *must* hand over work to the client:\n\n` +
      `• Walk through all zones with the client\n` +
      `• Show the cleaning results\n` +
      `• Get their verbal confirmation\n\n` +
      `❗️ Work is only complete after client confirms.\n\nDid the client accept the work?`,
    handoverBtn: "✅ Client accepted the work",

    waitPayment:
      `⏳ *Waiting for Payment*\n\n` +
      `Report #2 sent to manager ✅\n\n` +
      `🚫 *Do NOT leave the property* until the manager confirms payment.\n\n` +
      `Once payment comes through — the manager will message you here.\n\n` +
      `💬 Please wait...`,

    paymentConfirmed: (name) =>
      `✅ *Payment Confirmed!*\n\n👤 ${name} — payment received.\n\nYou may leave the property. Great work! 💪`,

    newOrder:    "🔄 New order",
    newOrderMsg: "👤 Client name for new order:",

    report1Title: (name, user, client) =>
      `📋 *REPORT #1 — CLEANING START*\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👷 ${name} (@${user})\n🧑‍💼 Client: ${client}\n` +
      `📅 ${new Date().toLocaleString("en-US")}\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 Uniform: {ext} photos\n🧴 Equipment: {eq} photos\n📸 Before: {bef} photos`,

    report2Title: (name, user, client, dur) =>
      `📋 *REPORT #2 — CLEANING COMPLETE*\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👷 ${name} (@${user})\n🧑‍💼 Client: ${client}\n⏱ ${dur} min\n` +
      `📅 ${new Date().toLocaleString("en-US")}\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 After: {aft} photos\n✅ Client accepted`,

    payConfirmBtn: (name) => `💳 Confirm payment for ${name}`,
    needPhoto: "⚠️ Please send at least one photo first!",
  },

  uz: {
    askLang:    "🌐 Выбери язык / Choose language / Tilni tanlang:",
    askName:    "👤 Ism va familiyangizni kiriting:",
    askClient:  "👤 Mijoz ismini kiriting:",
    changeLang: "🌐 Tilni o'zgartirish",

    contractMsg:
      `📋 *MUHIM — BCS Kompaniya Standarti*\n\n` +
      `1099 shartnomaga ko'ra, buyurtma faqat barcha bosqichlar bajarilganda *tugallangan va to'lanadi*:\n\n` +
      `1️⃣ Forma suratlari\n` +
      `2️⃣ Jihozlar suratlari\n` +
      `3️⃣ OLDIN suratlari → menejerga hisobot\n` +
      `4️⃣ KEYIN suratlari\n` +
      `5️⃣ Mijozga ishni topshirish\n\n` +
      `❗️ Mijoz qabul qilmasdan — to'lov tayinlanmaydi.\n\nBoshlash uchun bosing:`,
    contractBtn: "✅ Tushundim, boshlayman",

    photoExterior:
      `📸 *1-qadam — Forma suratlari*\n\n` +
      `O'zingizni to'liq formada suratlang:\n` +
      `• Qora yuqori kiyim\n• Qora quyi kiyim\n• Paypoq\n• Almashtiriladigan oyoq kiyim\n• Qo'lqop\n\n` +
      `⬆️ Suratni chatga yuboring:`,
    photoExteriorGot: (n) => `📸 Forma: ${n} surat. Yana yuboring yoki davom eting:`,
    exteriorDone: "✅ Tayyor → 2-qadam: Jihozlar",

    photoEquip:
      `🧴 *2-qadam — Jihozlar suratlari*\n\n` +
      `Barcha vosita va jihozlarni suratlang:\n` +
      `• Tozalash vositalari\n• Changsos\n• Mop, latta, gubkalar\n\n` +
      `⬆️ Suratlarni chatga yuboring:`,
    photoEquipGot: (n) => `🧴 Jihozlar: ${n} surat. Yana yuboring yoki davom eting:`,
    equipDone: "✅ Tayyor → 3-qadam: OLDIN suratlari",

    photoBefore:
      `📸 *3-qadam — Tozalashdan OLDIN suratlari*\n\n` +
      `‼️ Tozalaydigan *har bir zonani* suratlang.\n\n` +
      `Majburiy: oshxona, hammom, yotoqxona, mehmonxona, koridor, derazalar.\n\n` +
      `⬆️ Suratlarni chatga yuboring:`,
    photoBeforeGot: (n) => `📸 Oldin: ${n} surat. Yana yuboring yoki davom eting:`,
    beforeDone: (n) => `✅ Tayyor (${n} surat) → 1-hisobotni yuborish`,

    report1Sent:
      `✅ *1-hisobot menejerga yuborildi!*\n\n` +
      `Endi tozalashni boshlang.\n\n` +
      `Tugatgach — quyidagi tugmani bosing:`,
    startAfter: "🧹 Tozalash tugadi → KEYIN suratlari",

    photoAfter:
      `📸 *4-qadam — Tozalashdan KEYIN suratlari*\n\n` +
      `Avvalgi nuqtalardan surat oling.\n\n` +
      `⬆️ Suratlarni chatga yuboring:`,
    photoAfterGot: (n) => `📸 Keyin: ${n} surat. Yana yuboring yoki davom eting:`,
    afterDone: (n) => `✅ Tayyor (${n} surat) → 5-qadam: Mijozga topshirish`,

    handover:
      `🤝 *5-qadam — Mijozga ishni topshirish*\n\n` +
      `1099 shartnomaga ko'ra, siz mijozga *ishni topshirishingiz shart*:\n\n` +
      `• Mijoz bilan barcha zonalarni aylanib chiqing\n` +
      `• Tozalash natijasini ko'rsating\n` +
      `• Mijoz roziligi bilan tasdiqlang\n\n` +
      `❗️ Faqat mijoz qabul qilgandan so'ng — ish tugallangan hisoblanadi.\n\nMijoz ishni qabul qildimi?`,
    handoverBtn: "✅ Mijoz ishni qabul qildi",

    waitPayment:
      `⏳ *To'lovni kutmoqdamiz*\n\n` +
      `2-hisobot menejerga yuborildi ✅\n\n` +
      `🚫 Menejer to'lovni tasdiqlamaguncha *ob'ektdan ketmang*.\n\n` +
      `To'lov kelgach — menejer bu chatga yozadi.\n\n` +
      `💬 Kutib turing...`,

    paymentConfirmed: (name) =>
      `✅ *To'lov tasdiqlandi!*\n\n👤 ${name} — to'lov qabul qilindi.\n\nOb'ektdan ketishingiz mumkin. Rahmat! 💪`,

    newOrder:    "🔄 Yangi buyurtma",
    newOrderMsg: "👤 Yangi buyurtma uchun mijoz ismi:",

    report1Title: (name, user, client) =>
      `📋 *1-HISOBOT — TOZALASH BOSHLANISHI*\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👷 ${name} (@${user})\n🧑‍💼 Mijoz: ${client}\n` +
      `📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 Forma: {ext} ta\n🧴 Jihozlar: {eq} ta\n📸 Oldin: {bef} ta`,

    report2Title: (name, user, client, dur) =>
      `📋 *2-HISOBOT — TOZALASH YAKUNLANDI*\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👷 ${name} (@${user})\n🧑‍💼 Mijoz: ${client}\n⏱ ${dur} daqiqa\n` +
      `📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 Keyin: {aft} ta\n✅ Mijoz qabul qildi`,

    payConfirmBtn: (name) => `💳 ${name} uchun to'lovni tasdiqlash`,
    needPhoto: "⚠️ Avval kamida bitta surat yuboring!",
  },
};

// ─── SESSION & HELPERS ────────────────────────────────────────────────────────

const sessions       = {};
const cleaners       = {};
const pendingPayment = {};

function sess(id) {
  if (!sessions[id]) sessions[id] = {
    step: "idle",
    photoExterior: [], photoEquip: [], photoBefore: [], photoAfter: [],
    startedAt: null, client: null, photoMsgId: null,
  };
  return sessions[id];
}
function resetSess(id) { sessions[id] = null; return sess(id); }
function lang(id)  { return (cleaners[id] && cleaners[id].lang) || "ru"; }
function uname(id) { return (cleaners[id] && cleaners[id].name) || ""; }
function tr(id, key, ...a) {
  const fn = T[lang(id)][key];
  return typeof fn === "function" ? fn(...a) : fn;
}

function withLangBtn(rows, id) {
  return { inline_keyboard: [...rows, [{ text: tr(id, "changeLang"), callback_data: "CHANGE_LANG" }]] };
}

// ─── SEND REPORT 1 (before cleaning) ─────────────────────────────────────────

async function sendReport1(id, s, user) {
  if (!ADMIN_ID) return;
  const nm  = uname(id) || user.first_name;
  const txt = tr(id, "report1Title", nm, user.username || "—", s.client || "—")
    .replace("{ext}", s.photoExterior.length)
    .replace("{eq}",  s.photoEquip.length)
    .replace("{bef}", s.photoBefore.length);

  await bot.sendMessage(ADMIN_ID, txt, { parse_mode: "Markdown" });

  for (const g of [
    { label: "📸 *Форма/униформа:*",  photos: s.photoExterior },
    { label: "🧴 *Оборудование:*",    photos: s.photoEquip    },
    { label: "📸 *Фото ДО:*",         photos: s.photoBefore   },
  ]) {
    if (!g.photos.length) continue;
    await bot.sendMessage(ADMIN_ID, g.label, { parse_mode: "Markdown" });
    for (const f of g.photos) await bot.sendPhoto(ADMIN_ID, f);
  }
}

// ─── SEND REPORT 2 (after cleaning) ──────────────────────────────────────────

async function sendReport2(id, s, user) {
  if (!ADMIN_ID) return;
  const nm  = uname(id) || user.first_name;
  const dur = s.startedAt ? Math.round((Date.now() - s.startedAt) / 60000) : "—";
  const txt = tr(id, "report2Title", nm, user.username || "—", s.client || "—", dur)
    .replace("{aft}", s.photoAfter.length);

  await bot.sendMessage(ADMIN_ID, txt, {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: [[{ text: tr(id, "payConfirmBtn", nm), callback_data: `PAY_${id}` }]] },
  });
  pendingPayment[`PAY_${id}`] = id;

  if (s.photoAfter.length) {
    await bot.sendMessage(ADMIN_ID, "📸 *Фото ПОСЛЕ:*", { parse_mode: "Markdown" });
    for (const f of s.photoAfter) await bot.sendPhoto(ADMIN_ID, f);
  }
}

// ─── /start ───────────────────────────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const id = msg.chat.id;
  resetSess(id);
  await bot.sendMessage(id, T.ru.askLang, { reply_markup: { inline_keyboard: [
    [{ text: "🇷🇺 Русский", callback_data: "L_ru" }],
    [{ text: "🇺🇸 English", callback_data: "L_en" }],
    [{ text: "🇺🇿 O'zbek",  callback_data: "L_uz" }],
  ]}});
});

bot.onText(/\/lang/, async (msg) => {
  await bot.sendMessage(msg.chat.id, T.ru.askLang, { reply_markup: { inline_keyboard: [
    [{ text: "🇷🇺 Русский", callback_data: "L_ru" }],
    [{ text: "🇺🇸 English", callback_data: "L_en" }],
    [{ text: "🇺🇿 O'zbek",  callback_data: "L_uz" }],
  ]}});
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

bot.on("message", async (msg) => {
  const id = msg.chat.id;
  const s  = sess(id);

  if (msg.photo) {
    const fid = msg.photo[msg.photo.length - 1].file_id;
    const map = {
      photo_exterior: { arr: "photoExterior", gotKey: "photoExteriorGot", btnLabel: (n) => tr(id, "exteriorDone"),    btnCb: "EXTERIOR_DONE" },
      photo_equip:    { arr: "photoEquip",    gotKey: "photoEquipGot",    btnLabel: (n) => tr(id, "equipDone"),       btnCb: "EQUIP_DONE"    },
      photo_before:   { arr: "photoBefore",   gotKey: "photoBeforeGot",   btnLabel: (n) => tr(id, "beforeDone", n),  btnCb: "BEFORE_DONE"   },
      photo_after:    { arr: "photoAfter",    gotKey: "photoAfterGot",    btnLabel: (n) => tr(id, "afterDone",  n),  btnCb: "AFTER_DONE"    },
    };
    const cfg = map[s.step];
    if (cfg) {
      s[cfg.arr].push(fid);
      const n      = s[cfg.arr].length;
      const text   = tr(id, cfg.gotKey, n);
      const markup = withLangBtn([[{ text: cfg.btnLabel(n), callback_data: cfg.btnCb }]], id);
      // Delete old counter message, send fresh one below latest photo
      if (s.photoMsgId) {
        try { await bot.deleteMessage(id, s.photoMsgId); } catch (_) {}
      }
      const sent = await bot.sendMessage(id, text, { reply_markup: markup });
      s.photoMsgId = sent.message_id;
    }
    return;
  }

  if (!msg.text || msg.text.startsWith("/")) return;

  if (s.step === "name") {
    cleaners[id].name = msg.text.trim();
    s.step = "client";
    await bot.sendMessage(id, tr(id, "askClient"), { reply_markup: withLangBtn([], id) });
    return;
  }
  if (s.step === "client") {
    s.client    = msg.text.trim();
    s.startedAt = Date.now();
    s.step      = "contract";
    await bot.sendMessage(id, tr(id, "contractMsg"), {
      parse_mode: "Markdown",
      reply_markup: withLangBtn([[{ text: tr(id, "contractBtn"), callback_data: "CONTRACT_OK" }]], id),
    });
  }
});

// ─── CALLBACKS ────────────────────────────────────────────────────────────────

bot.on("callback_query", async (q) => {
  const id    = q.message.chat.id;
  const msgId = q.message.message_id;
  const data  = q.data;
  const s     = sess(id);

  const langKbd = { inline_keyboard: [
    [{ text: "🇷🇺 Русский", callback_data: "L_ru" }],
    [{ text: "🇺🇸 English", callback_data: "L_en" }],
    [{ text: "🇺🇿 O'zbek",  callback_data: "L_uz" }],
  ]};

  if (data === "CHANGE_LANG") {
    await bot.answerCallbackQuery(q.id);
    await bot.sendMessage(id, T.ru.askLang, { reply_markup: langKbd });
    return;
  }

  if (data.startsWith("L_")) {
    await bot.answerCallbackQuery(q.id);
    const l = data.slice(2);
    const hadName = cleaners[id] && cleaners[id].name;
    cleaners[id] = { lang: l, name: hadName || null };
    if (hadName) {
      sess(id).step = "client";
      await bot.editMessageText(T[l].askClient, { chat_id: id, message_id: msgId });
    } else {
      sess(id).step = "name";
      await bot.editMessageText(T[l].askName, { chat_id: id, message_id: msgId });
    }
    return;
  }

  // Contract OK → Step 1
  if (data === "CONTRACT_OK") {
    await bot.answerCallbackQuery(q.id);
    s.step = "photo_exterior"; s.photoMsgId = null;
    Object.assign(s, { photoExterior: [], photoEquip: [], photoBefore: [], photoAfter: [] });
    await bot.editMessageText(tr(id, "photoExterior"), {
      chat_id: id, message_id: msgId, parse_mode: "Markdown",
      reply_markup: withLangBtn([], id),
    });
    return;
  }

  // Step 1 done → Step 2
  if (data === "EXTERIOR_DONE") {
    if (!s.photoExterior.length) {
      await bot.answerCallbackQuery(q.id, { text: tr(id, "needPhoto"), show_alert: true });
      return;
    }
    await bot.answerCallbackQuery(q.id);
    s.step = "photo_equip"; s.photoMsgId = null;
    await bot.editMessageText(tr(id, "photoEquip"), {
      chat_id: id, message_id: msgId, parse_mode: "Markdown",
      reply_markup: withLangBtn([], id),
    });
    return;
  }

  // Step 2 done → Step 3
  if (data === "EQUIP_DONE") {
    if (!s.photoEquip.length) {
      await bot.answerCallbackQuery(q.id, { text: tr(id, "needPhoto"), show_alert: true });
      return;
    }
    await bot.answerCallbackQuery(q.id);
    s.step = "photo_before"; s.photoMsgId = null;
    await bot.editMessageText(tr(id, "photoBefore"), {
      chat_id: id, message_id: msgId, parse_mode: "Markdown",
      reply_markup: withLangBtn([], id),
    });
    return;
  }

  // Step 3 done → Send Report 1 → show "start cleaning" button
  if (data === "BEFORE_DONE") {
    if (!s.photoBefore.length) {
      await bot.answerCallbackQuery(q.id, { text: tr(id, "needPhoto"), show_alert: true });
      return;
    }
    await bot.answerCallbackQuery(q.id);
    s.step = "cleaning";
    await bot.editMessageText(tr(id, "report1Sent"), {
      chat_id: id, message_id: msgId, parse_mode: "Markdown",
      reply_markup: withLangBtn([[{ text: tr(id, "startAfter"), callback_data: "START_AFTER" }]], id),
    });
    await sendReport1(id, s, q.from);
    return;
  }

  // Cleaning done → Step 4: photos after
  if (data === "START_AFTER") {
    await bot.answerCallbackQuery(q.id);
    s.step = "photo_after"; s.photoMsgId = null;
    await bot.editMessageText(tr(id, "photoAfter"), {
      chat_id: id, message_id: msgId, parse_mode: "Markdown",
      reply_markup: withLangBtn([], id),
    });
    return;
  }

  // Step 4 done → Step 5: handover
  if (data === "AFTER_DONE") {
    if (!s.photoAfter.length) {
      await bot.answerCallbackQuery(q.id, { text: tr(id, "needPhoto"), show_alert: true });
      return;
    }
    await bot.answerCallbackQuery(q.id);
    s.step = "handover";
    await bot.editMessageText(tr(id, "handover"), {
      chat_id: id, message_id: msgId, parse_mode: "Markdown",
      reply_markup: withLangBtn([[{ text: tr(id, "handoverBtn"), callback_data: "HANDOVER_DONE" }]], id),
    });
    return;
  }

  // Handover done → Send Report 2 → wait payment
  if (data === "HANDOVER_DONE") {
    await bot.answerCallbackQuery(q.id);
    s.step = "waiting_payment";
    await bot.editMessageText(tr(id, "waitPayment"), { chat_id: id, message_id: msgId, parse_mode: "Markdown" });
    await sendReport2(id, s, q.from);
    return;
  }

  // Manager confirms payment
  if (data.startsWith("PAY_")) {
    const cleanerId = pendingPayment[data];
    if (!cleanerId) { await bot.answerCallbackQuery(q.id, { text: "Заказ уже закрыт.", show_alert: true }); return; }
    const nm = uname(cleanerId) || "Клинер";
    await bot.sendMessage(cleanerId, tr(cleanerId, "paymentConfirmed", nm), {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [[{ text: tr(cleanerId, "newOrder"), callback_data: "NEW" }]] },
    });
    await bot.editMessageText(
      q.message.text + `\n\n✅ *Оплата подтверждена* — ${new Date().toLocaleString("ru-RU")}`,
      { chat_id: q.message.chat.id, message_id: msgId, parse_mode: "Markdown" }
    );
    delete pendingPayment[data];
    resetSess(cleanerId);
    await bot.answerCallbackQuery(q.id, { text: "✅ Клинер уведомлён!" });
    return;
  }

  // New order
  if (data === "NEW") {
    await bot.answerCallbackQuery(q.id);
    const s2 = resetSess(id);
    s2.step  = "client";
    await bot.sendMessage(id, tr(id, "newOrderMsg"), { reply_markup: withLangBtn([], id) });
  }
});

console.log("🤖 BCS Bot v7 started (RU/EN/UZ)...");
