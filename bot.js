const TelegramBot = require("node-telegram-bot-api");

const TOKEN    = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID;
const bot      = new TelegramBot(TOKEN, { polling: true });

const T = {
  ru: {
    askName:   "👤 Введи своё имя и фамилию:",
    askPhotos: (name) => `👋 Привет, *${name}*!\n\nОтправь фото:\n• Твоя униформа (чёрный верх, низ, обувь, перчатки)\n• Все средства и оборудование\n\n⬆️ Отправляй фото в чат (можно несколько):`,
    got:       (n) => `📸 ${n} фото получено. Отправь ещё или нажми кнопку:`,
    sendBtn:   "✅ Отправить отчёт",
    sent:      "✅ Отчёт отправлен менеджеру!\n\nХорошей работы 💪",
    newOrder:  "🔄 Новый заказ",
    report:    (name, user) => `📋 *ОТЧЁТ — НАЧАЛО ЗАКАЗА*\n━━━━━━━━━━━━━━━━━━━━\n👷 ${name} (@${user})\n📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━`,
    needPhoto: "⚠️ Сначала отправь хотя бы одно фото!",
  },
  en: {
    askName:   "👤 Enter your first and last name:",
    askPhotos: (name) => `👋 Hi, *${name}*!\n\nSend photos of:\n• Your uniform (black top, bottoms, shoes, gloves)\n• All supplies and equipment\n\n⬆️ Send photos to chat (multiple allowed):`,
    got:       (n) => `📸 ${n} photo(s) received. Send more or tap the button:`,
    sendBtn:   "✅ Send report",
    sent:      "✅ Report sent to manager!\n\nGood luck! 💪",
    newOrder:  "🔄 New order",
    report:    (name, user) => `📋 *REPORT — ORDER START*\n━━━━━━━━━━━━━━━━━━━━\n👷 ${name} (@${user})\n📅 ${new Date().toLocaleString("en-US")}\n━━━━━━━━━━━━━━━━━━━━`,
    needPhoto: "⚠️ Please send at least one photo first!",
  },
  uz: {
    askName:   "👤 Ism va familiyangizni kiriting:",
    askPhotos: (name) => `👋 Salom, *${name}*!\n\nSuratlarni yuboring:\n• Formangiz (qora kiyim, oyoq kiyim, qo'lqop)\n• Barcha vosita va jihozlar\n\n⬆️ Suratlarni chatga yuboring (bir nechtasini):`,
    got:       (n) => `📸 ${n} ta surat qabul qilindi. Yana yuboring yoki tugmani bosing:`,
    sendBtn:   "✅ Hisobotni yuborish",
    sent:      "✅ Hisobot menejerga yuborildi!\n\nYaxshi ish! 💪",
    newOrder:  "🔄 Yangi buyurtma",
    report:    (name, user) => `📋 *HISOBOT — BUYURTMA BOSHLANISHI*\n━━━━━━━━━━━━━━━━━━━━\n👷 ${name} (@${user})\n📅 ${new Date().toLocaleString("ru-RU")}\n━━━━━━━━━━━━━━━━━━━━`,
    needPhoto: "⚠️ Avval kamida bitta surat yuboring!",
  },
};

// ─── SESSION & HELPERS ────────────────────────────────────────────────────────

const sessions = {};
const cleaners = {};

function sess(id) {
  if (!sessions[id]) sessions[id] = { step: "idle", photos: [], photoMsgId: null };
  return sessions[id];
}
function resetSess(id) { sessions[id] = null; return sess(id); }
function lang(id)  { return (cleaners[id] && cleaners[id].lang) || "ru"; }
function uname(id) { return (cleaners[id] && cleaners[id].name) || ""; }
function tr(id, key, ...a) {
  const fn = T[lang(id)][key];
  return typeof fn === "function" ? fn(...a) : fn;
}

const langKbd = { inline_keyboard: [
  [{ text: "🇷🇺 Русский", callback_data: "L_ru" }],
  [{ text: "🇺🇸 English", callback_data: "L_en" }],
  [{ text: "🇺🇿 O'zbek",  callback_data: "L_uz" }],
]};

const startKbd = {
  keyboard: [[{ text: "🚀 Начать / Start / Boshlash" }]],
  resize_keyboard: true,
  persistent: true,
};

// ─── /start ───────────────────────────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const id = msg.chat.id;
  resetSess(id);
  // Set persistent bottom keyboard first
  await bot.sendMessage(id, "👇", { reply_markup: startKbd });
  // Then show language selection as inline keyboard
  await bot.sendMessage(id, "🌐 Выбери язык / Choose language / Tilni tanlang:", { reply_markup: langKbd });
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

bot.on("message", async (msg) => {
  const id = msg.chat.id;
  const s  = sess(id);

  if (msg.photo) {
    if (s.step !== "photos") return;
    s.photos.push(msg.photo[msg.photo.length - 1].file_id);
    const n      = s.photos.length;
    const text   = tr(id, "got", n);
    const markup = { inline_keyboard: [[{ text: tr(id, "sendBtn"), callback_data: "SEND" }]] };
    if (s.photoMsgId) {
      try { await bot.deleteMessage(id, s.photoMsgId); } catch (_) {}
    }
    const sent = await bot.sendMessage(id, text, { reply_markup: markup });
    s.photoMsgId = sent.message_id;
    return;
  }

  if (msg.text === "🚀 Начать / Start / Boshlash") {
    resetSess(id);
    await bot.sendMessage(id, "🌐 Выбери язык / Choose language / Tilni tanlang:", { reply_markup: langKbd });
    return;
  }

  if (!msg.text || msg.text.startsWith("/")) return;

  if (s.step === "name") {
    cleaners[id].name = msg.text.trim();
    s.step = "photos";
    await bot.sendMessage(id, tr(id, "askPhotos", uname(id)), { parse_mode: "Markdown" });
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
    sess(id).step = "name";
    await bot.editMessageText(T[l].askName, { chat_id: id, message_id: msgId });
    return;
  }

  // Send report
  if (data === "SEND") {
    if (!s.photos.length) {
      await bot.answerCallbackQuery(q.id, { text: tr(id, "needPhoto"), show_alert: true });
      return;
    }
    const nm   = uname(id) || q.from.first_name;
    const user = q.from.username || "—";

    // Notify cleaner
    await bot.editMessageText(tr(id, "sent"), {
      chat_id: id, message_id: msgId,
      reply_markup: { inline_keyboard: [[{ text: tr(id, "newOrder"), callback_data: "NEW" }]] },
    });


    // Send report to admin
    if (ADMIN_ID) {
      await bot.sendMessage(ADMIN_ID, tr(id, "report", nm, user), { parse_mode: "Markdown" });
      await bot.sendMessage(ADMIN_ID, "📸 *Фото:*", { parse_mode: "Markdown" });
      for (const f of s.photos) await bot.sendPhoto(ADMIN_ID, f);
    }

    resetSess(id);
    return;
  }

  // New order
  if (data === "NEW") {
    const s2 = resetSess(id);
    s2.step  = "photos";
    await bot.sendMessage(id, tr(id, "askPhotos", uname(id)), { parse_mode: "Markdown" });
  }
});

console.log("🤖 BCS Bot v8 (simple) started...");
