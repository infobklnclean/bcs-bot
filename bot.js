const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN = process.env.ADMIN_CHAT_ID;

const TEXT = {
  ru: {
    askName:   "👤 Введи своё имя и фамилию:",
    askPhotos: (n) => `👋 Привет, *${n}*!\n\nОтправь фото униформы и оборудования:`,
    got:       (n) => `📸 ${n} фото. Отправь ещё или нажми кнопку:`,
    send:      "✅ Отправить отчёт",
    done:      "✅ Отчёт отправлен! Хорошей работы 💪",
    again:     "🔄 Новый заказ",
    noPhoto:   "⚠️ Сначала отправь фото!",
    report:    (n, u) => `📋 *ОТЧЁТ*\n👷 ${n} (@${u})\n📅 ${new Date().toLocaleString("ru-RU")}`,
  },
  en: {
    askName:   "👤 Enter your name:",
    askPhotos: (n) => `👋 Hi, *${n}*!\n\nSend photos of your uniform and equipment:`,
    got:       (n) => `📸 ${n} photo(s). Send more or tap:`,
    send:      "✅ Send report",
    done:      "✅ Report sent! Good luck 💪",
    again:     "🔄 New order",
    noPhoto:   "⚠️ Send at least one photo first!",
    report:    (n, u) => `📋 *REPORT*\n👷 ${n} (@${u})\n📅 ${new Date().toLocaleString("en-US")}`,
  },
  uz: {
    askName:   "👤 Ism va familiyangizni kiriting:",
    askPhotos: (n) => `👋 Salom, *${n}*!\n\nForma va jihozlar suratlarini yuboring:`,
    got:       (n) => `📸 ${n} ta surat. Yana yuboring yoki bosing:`,
    send:      "✅ Hisobotni yuborish",
    done:      "✅ Hisobot yuborildi! Yaxshi ish 💪",
    again:     "🔄 Yangi buyurtma",
    noPhoto:   "⚠️ Avval surat yuboring!",
    report:    (n, u) => `📋 *HISOBOT*\n👷 ${n} (@${u})\n📅 ${new Date().toLocaleString("ru-RU")}`,
  },
};

const sessions = {};
const users    = {};

const s    = (id) => sessions[id] || (sessions[id] = { step: "idle", photos: [], msgId: null });
const reset= (id) => { sessions[id] = { step: "idle", photos: [], msgId: null }; return sessions[id]; };
const l    = (id) => users[id]?.lang || "ru";
const name = (id) => users[id]?.name || "";
const t    = (id, key, ...a) => { const f = TEXT[l(id)][key]; return typeof f === "function" ? f(...a) : f; };

const langKbd = { inline_keyboard: [
  [{ text: "🇷🇺 Русский", callback_data: "L_ru" }],
  [{ text: "🇺🇸 English", callback_data: "L_en" }],
  [{ text: "🇺🇿 O'zbek",  callback_data: "L_uz" }],
]};

const startKbd = { keyboard: [[{ text: "🚀 Start" }]], resize_keyboard: true, persistent: true };

bot.onText(/\/start|🚀 Start/, async (msg) => {
  const id = msg.chat.id;
  reset(id);
  await bot.sendMessage(id, "👇", { reply_markup: startKbd });
  await bot.sendMessage(id, "🌐 Выбери язык / Choose language / Tilni tanlang:", { reply_markup: langKbd });
});

bot.on("message", async (msg) => {
  const id = msg.chat.id;
  const ss = s(id);
  if (msg.text === "🚀 Start") return; // handled by onText

  if (msg.photo) {
    if (ss.step !== "photos") return;
    ss.photos.push(msg.photo[msg.photo.length - 1].file_id);
    const markup = { inline_keyboard: [[{ text: t(id, "send"), callback_data: "SEND" }]] };
    if (ss.msgId) try { await bot.deleteMessage(id, ss.msgId); } catch (_) {}
    const sent = await bot.sendMessage(id, t(id, "got", ss.photos.length), { reply_markup: markup });
    ss.msgId = sent.message_id;
    return;
  }

  if (!msg.text || msg.text.startsWith("/")) return;

  if (ss.step === "name") {
    users[id].name = msg.text.trim();
    ss.step = "photos";
    await bot.sendMessage(id, t(id, "askPhotos", name(id)), { parse_mode: "Markdown" });
  }
});

bot.on("callback_query", async (q) => {
  const id  = q.message.chat.id;
  const mid = q.message.message_id;
  const ss  = s(id);
  await bot.answerCallbackQuery(q.id);

  if (q.data.startsWith("L_")) {
    users[id] = { lang: q.data.slice(2), name: null };
    s(id).step = "name";
    await bot.editMessageText(t(id, "askName"), { chat_id: id, message_id: mid });
    return;
  }

  if (q.data === "SEND") {
    if (!ss.photos.length) { await bot.answerCallbackQuery(q.id, { text: t(id, "noPhoto"), show_alert: true }); return; }
    await bot.editMessageText(t(id, "done"), {
      chat_id: id, message_id: mid,
      reply_markup: { inline_keyboard: [[{ text: t(id, "again"), callback_data: "NEW" }]] },
    });
    if (ADMIN) {
      await bot.sendMessage(ADMIN, t(id, "report", name(id) || q.from.first_name, q.from.username || "—"), { parse_mode: "Markdown" });
      for (const f of ss.photos) await bot.sendPhoto(ADMIN, f);
    }
    reset(id);
    return;
  }

  if (q.data === "NEW") {
    const ss2 = reset(id);
    ss2.step  = "photos";
    await bot.sendMessage(id, t(id, "askPhotos", name(id)), { parse_mode: "Markdown" });
  }
});

console.log("BCS Bot started");
