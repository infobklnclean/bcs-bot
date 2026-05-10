const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID; // куда слать отчёты

const bot = new TelegramBot(TOKEN, { polling: true });

// ─── ДАННЫЕ ───────────────────────────────────────────────────────────────────

const SERVICES = {
  deep: "🧹 Deep Cleaning",
  regular: "🏠 Regular Standard",
  moveinout: "📦 Move In / Move Out",
  postconstruction: "🔨 Post Construction",
};

const CHECKLISTS = {
  deep: {
    "🍳 Кухня": [
      { text: "Обезжирить и вымыть плиту изнутри и снаружи", critical: true },
      { text: "Очистить духовку, включая противни и решётки", critical: true },
      { text: "Вымыть холодильник изнутри, включая уплотнители", critical: false },
      { text: "Обработать вытяжку и фильтры", critical: false },
      { text: "Протереть все фасады, ручки и петли шкафов", critical: false },
      { text: "Очистить микроволновку изнутри и снаружи", critical: false },
      { text: "Почистить раковину и смеситель до блеска", critical: true },
      { text: "Вымыть пол и плинтусы", critical: false },
    ],
    "🚿 Ванная": [
      { text: "Удалить известковый налёт с кафеля и стекла", critical: true },
      { text: "Дезинфицировать унитаз снаружи и под ободком", critical: true },
      { text: "Очистить душевую кабину / ванну от налёта", critical: true },
      { text: "Вымыть зеркало без разводов", critical: false },
      { text: "Протереть все поверхности и полки", critical: false },
      { text: "Вымыть пол и плинтусы", critical: false },
    ],
    "🛏 Спальня": [
      { text: "Протереть пыль со всех поверхностей", critical: false },
      { text: "Пропылесосить матрас", critical: false },
      { text: "Вымыть окна изнутри", critical: false },
      { text: "Протереть плинтусы и вентиляционные решётки", critical: false },
      { text: "Пропылесосить ковёр / вымыть пол", critical: true },
    ],
    "🛋 Гостиная": [
      { text: "Протереть пыль с мебели, полок и декора", critical: false },
      { text: "Пропылесосить диван и подушки", critical: false },
      { text: "Очистить телевизор и технику от пыли", critical: false },
      { text: "Вымыть пол, уделить внимание углам", critical: true },
    ],
    "🚪 Коридор": [
      { text: "Протереть входную дверь и дверную ручку", critical: false },
      { text: "Вымыть пол и плинтусы", critical: false },
      { text: "Протереть зеркало", critical: false },
    ],
    "🪟 Окна": [
      { text: "Вымыть стёкла изнутри без разводов", critical: true },
      { text: "Протереть рамы и подоконники", critical: false },
      { text: "Очистить жалюзи / вытереть пыль с занавесей", critical: false },
    ],
  },
  regular: {
    "🍳 Кухня": [
      { text: "Протереть плиту снаружи", critical: true },
      { text: "Протереть все поверхности и столешницу", critical: false },
      { text: "Почистить раковину и смеситель", critical: true },
      { text: "Вымыть пол", critical: false },
      { text: "Вынести мусор", critical: false },
    ],
    "🚿 Ванная": [
      { text: "Дезинфицировать унитаз", critical: true },
      { text: "Протереть раковину и смеситель", critical: true },
      { text: "Вымыть зеркало", critical: false },
      { text: "Вымыть пол", critical: false },
    ],
    "🛏 Спальня": [
      { text: "Протереть пыль с поверхностей", critical: false },
      { text: "Пропылесосить / вымыть пол", critical: true },
    ],
    "🛋 Гостиная": [
      { text: "Протереть пыль", critical: false },
      { text: "Вымыть пол", critical: true },
    ],
    "🚪 Коридор": [
      { text: "Подмести / вымыть пол", critical: false },
    ],
    "🪟 Окна": [
      { text: "Протереть подоконники", critical: false },
    ],
  },
  moveinout: {
    "🍳 Кухня": [
      { text: "Полная очистка духовки и плиты изнутри", critical: true },
      { text: "Вымыть холодильник изнутри", critical: true },
      { text: "Очистить все шкафы внутри и снаружи", critical: true },
      { text: "Обработать вытяжку", critical: false },
      { text: "Вымыть пол и плинтусы", critical: false },
    ],
    "🚿 Ванная": [
      { text: "Полная дезинфекция всех поверхностей", critical: true },
      { text: "Удаление плесени и налёта", critical: true },
      { text: "Вымыть пол", critical: false },
    ],
    "🛏 Спальня": [
      { text: "Очистить шкафы и полки изнутри", critical: true },
      { text: "Пропылесосить и вымыть пол", critical: true },
      { text: "Вымыть окна", critical: false },
    ],
    "🛋 Гостиная": [
      { text: "Полная очистка всех поверхностей", critical: false },
      { text: "Вымыть пол", critical: true },
    ],
    "🚪 Коридор": [
      { text: "Протереть входную дверь снаружи и изнутри", critical: false },
      { text: "Вымыть пол", critical: false },
    ],
    "🪟 Окна": [
      { text: "Вымыть все окна изнутри", critical: true },
      { text: "Протереть рамы и подоконники", critical: false },
    ],
  },
  postconstruction: {
    "🍳 Кухня": [
      { text: "Удалить строительную пыль со всех поверхностей", critical: true },
      { text: "Очистить технику от защитных плёнок", critical: false },
      { text: "Вымыть пол с обезжиривателем", critical: true },
    ],
    "🚿 Ванная": [
      { text: "Удалить остатки затирки и раствора", critical: true },
      { text: "Протереть новую сантехнику", critical: false },
      { text: "Вымыть пол", critical: true },
    ],
    "🛏 Спальня": [
      { text: "Протереть пыль со всех поверхностей (2 этапа)", critical: true },
      { text: "Пропылесосить и вымыть пол", critical: true },
    ],
    "🛋 Гостиная": [
      { text: "Двойная протирка всех горизонтальных поверхностей", critical: true },
      { text: "Вымыть пол с обезжиривателем", critical: true },
    ],
    "🚪 Коридор": [
      { text: "Убрать строительный мусор", critical: true },
      { text: "Вымыть пол", critical: false },
    ],
    "🪟 Окна": [
      { text: "Удалить наклейки и цемент со стёкол", critical: true },
      { text: "Вымыть стёкла и рамы", critical: true },
    ],
  },
};

const CRITICAL_FINAL = [
  "Унитаз дезинфицирован (нет запаха, нет загрязнений)",
  "Плита / духовка очищена",
  "Полы вымыты во всех зонах",
  "Фото «до» и «после» загружены",
  "Раковина без налёта",
  "Химикаты смыты, нет запаха",
  "Мусор вынесен",
  "Зеркала без разводов",
];

// ─── СОСТОЯНИЯ ПОЛЬЗОВАТЕЛЕЙ ──────────────────────────────────────────────────

const sessions = {}; // chatId → session

function getSession(chatId) {
  if (!sessions[chatId]) {
    sessions[chatId] = {
      step: "idle",
      service: null,
      zones: [],
      currentZone: null,
      checked: {},       // zone → [bool, bool, ...]
      photoBefore: [],
      photoAfter: [],
      criticalDone: {},  // index → bool
      startedAt: null,
      address: null,
      name: null,
    };
  }
  return sessions[chatId];
}

function resetSession(chatId) {
  sessions[chatId] = null;
  getSession(chatId);
}

// ─── КЛАВИАТУРЫ ───────────────────────────────────────────────────────────────

function serviceKeyboard() {
  return {
    inline_keyboard: Object.entries(SERVICES).map(([key, name]) => [
      { text: name, callback_data: `svc_${key}` },
    ]),
  };
}

function zonesKeyboard(session) {
  const zones = session.zones;
  const rows = zones.map((zone) => {
    const items = CHECKLISTS[session.service][zone];
    const checked = session.checked[zone] || [];
    const done = checked.filter(Boolean).length;
    const total = items.length;
    const allDone = done === total;
    const icon = allDone ? "✅" : done > 0 ? "🔄" : "⬜";
    return [{ text: `${icon} ${zone} (${done}/${total})`, callback_data: `zone_${zone}` }];
  });

  const allZonesDone = zones.every((z) => {
    const items = CHECKLISTS[session.service][z];
    const checked = session.checked[z] || [];
    return checked.filter(Boolean).length === items.length;
  });

  if (allZonesDone) {
    rows.push([{ text: "📸 Все зоны готовы → Фото ПОСЛЕ", callback_data: "goto_photo_after" }]);
  }

  return { inline_keyboard: rows };
}

function checklistKeyboard(session, zone) {
  const items = CHECKLISTS[session.service][zone];
  const checked = session.checked[zone] || Array(items.length).fill(false);
  session.checked[zone] = checked;

  const rows = items.map((item, i) => {
    const icon = checked[i] ? "✅" : item.critical ? "🔴" : "⬜";
    const label = item.text.length > 38 ? item.text.slice(0, 38) + "…" : item.text;
    return [{ text: `${icon} ${label}`, callback_data: `chk_${zone}_${i}` }];
  });

  const done = checked.filter(Boolean).length;
  const total = items.length;
  const allDone = done === total;

  rows.push([
    { text: "← Назад к зонам", callback_data: "back_zones" },
    {
      text: allDone ? "✅ Зона выполнена" : `⏳ ${done}/${total}`,
      callback_data: allDone ? "zone_complete" : "zone_incomplete",
    },
  ]);

  return { inline_keyboard: rows };
}

function criticalKeyboard(session) {
  const rows = CRITICAL_FINAL.map((item, i) => {
    const icon = session.criticalDone[i] ? "✅" : "⬜";
    return [{ text: `${icon} ${item}`, callback_data: `crit_${i}` }];
  });

  const allDone = CRITICAL_FINAL.every((_, i) => session.criticalDone[i]);
  if (allDone) {
    rows.push([{ text: "🏁 Завершить заказ и отправить отчёт", callback_data: "finish_order" }]);
  }

  return { inline_keyboard: rows };
}

// ─── ПРОГРЕСС ─────────────────────────────────────────────────────────────────

function progressBar(done, total) {
  const filled = total ? Math.round((done / total) * 8) : 0;
  return "█".repeat(filled) + "░".repeat(8 - filled);
}

// ─── ОТЧЁТ АДМИНИСТРАТОРУ ────────────────────────────────────────────────────

async function sendReport(session, user) {
  if (!ADMIN_ID) return;

  const svcName = SERVICES[session.service];
  const duration = session.startedAt
    ? Math.round((Date.now() - session.startedAt) / 60000)
    : "—";

  let zonesReport = "";
  for (const zone of session.zones) {
    const items = CHECKLISTS[session.service][zone];
    const checked = session.checked[zone] || [];
    const done = checked.filter(Boolean).length;
    zonesReport += `${zone}: ${done}/${items.length}\n`;
  }

  const text =
    `📋 *ОТЧЁТ О ЗАВЕРШЁННОМ ЗАКАЗЕ*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 Контрактор: ${user.first_name} ${user.last_name || ""} (@${user.username || "—"})\n` +
    `📍 Адрес: ${session.address || "не указан"}\n` +
    `🧹 Тип: ${svcName}\n` +
    `⏱ Время работы: ${duration} мин\n` +
    `📅 Дата: ${new Date().toLocaleString("ru-RU")}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Зоны:*\n${zonesReport}` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📸 Фото до: ${session.photoBefore.length} шт\n` +
    `📸 Фото после: ${session.photoAfter.length} шт\n` +
    `✅ Critical check: пройден`;

  await bot.sendMessage(ADMIN_ID, text, { parse_mode: "Markdown" });

  // Пересылаем фото
  if (session.photoBefore.length > 0) {
    await bot.sendMessage(ADMIN_ID, "📸 *Фото ДО:*", { parse_mode: "Markdown" });
    for (const fileId of session.photoBefore) {
      await bot.sendPhoto(ADMIN_ID, fileId);
    }
  }
  if (session.photoAfter.length > 0) {
    await bot.sendMessage(ADMIN_ID, "📸 *Фото ПОСЛЕ:*", { parse_mode: "Markdown" });
    for (const fileId of session.photoAfter) {
      await bot.sendPhoto(ADMIN_ID, fileId);
    }
  }
}

// ─── /start ───────────────────────────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  resetSession(chatId);
  const session = getSession(chatId);
  session.step = "select_service";
  session.startedAt = Date.now();

  await bot.sendMessage(
    chatId,
    `👋 Привет, *${msg.from.first_name}*!\n\n` +
      `🏢 *BCS Quality Control*\n` +
      `Система контроля качества\n\n` +
      `Укажи адрес объекта (или нажми /skip):`,
    { parse_mode: "Markdown" }
  );
  session.step = "await_address";
});

// ─── ТЕКСТОВЫЕ СООБЩЕНИЯ ─────────────────────────────────────────────────────

bot.on("message", async (msg) => {
  if (!msg.text && !msg.photo) return;
  const chatId = msg.chat.id;
  const session = getSession(chatId);

  // Фото
  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    if (session.step === "photo_before") {
      session.photoBefore.push(fileId);
      await bot.sendMessage(
        chatId,
        `📸 Фото ДО получено (${session.photoBefore.length} шт)\n\nОтправь ещё или нажми кнопку ниже:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: `▶️ Начать уборку (фото: ${session.photoBefore.length})`, callback_data: "start_cleaning" }],
            ],
          },
        }
      );
    } else if (session.step === "photo_after") {
      session.photoAfter.push(fileId);
      await bot.sendMessage(
        chatId,
        `📸 Фото ПОСЛЕ получено (${session.photoAfter.length} шт)\n\nОтправь ещё или нажми кнопку ниже:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: `✅ Перейти к финальной проверке (фото: ${session.photoAfter.length})`, callback_data: "goto_critical" }],
            ],
          },
        }
      );
    }
    return;
  }

  if (!msg.text) return;

  // /skip
  if (msg.text === "/skip" || session.step === "await_address") {
    if (msg.text !== "/skip") {
      session.address = msg.text;
    }
    session.step = "select_service";
    await bot.sendMessage(chatId, "🧹 Выбери тип уборки:", {
      parse_mode: "Markdown",
      reply_markup: serviceKeyboard(),
    });
  }
});

// ─── CALLBACK QUERY ───────────────────────────────────────────────────────────

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;
  const session = getSession(chatId);

  await bot.answerCallbackQuery(query.id);

  // Выбор сервиса
  if (data.startsWith("svc_")) {
    const key = data.replace("svc_", "");
    session.service = key;
    session.zones = Object.keys(CHECKLISTS[key]);
    session.checked = {};
    session.photoBefore = [];
    session.photoAfter = {};
    session.criticalDone = {};
    session.step = "photo_before";

    await bot.editMessageText(
      `${SERVICES[key]}\n\n` +
        `📸 *Шаг 1 — Фото ДО уборки*\n\n` +
        `Сделай и отправь фото каждой зоны ДО начала работы.\n\n` +
        `Минимум 3 фото:\n` +
        `• Кухня (плита + раковина)\n` +
        `• Ванная (унитаз + душ)\n` +
        `• Общий вид\n\n` +
        `⬆️ Отправляй фото прямо в этот чат`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "▶️ Начать уборку без фото", callback_data: "start_cleaning" }],
          ],
        },
      }
    );
    return;
  }

  // Начать уборку
  if (data === "start_cleaning") {
    session.step = "zones";
    const photoNote =
      session.photoBefore.length > 0
        ? `✅ Фото ДО: ${session.photoBefore.length} шт\n\n`
        : `⚠️ Фото ДО не добавлены\n\n`;

    await bot.editMessageText(
      `${SERVICES[session.service]}\n\n` +
        photoNote +
        `📋 *Шаг 2 — Уборка по зонам*\n\n` +
        `Выбери зону и отмечай выполненные пункты.\n` +
        `Когда все зоны готовы — появится кнопка перехода к фото ПОСЛЕ.`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: zonesKeyboard(session),
      }
    );
    return;
  }

  // Открыть зону
  if (data.startsWith("zone_")) {
    const zone = data.replace("zone_", "");
    session.currentZone = zone;
    session.step = "checklist";
    const items = CHECKLISTS[session.service][zone];
    const checked = session.checked[zone] || Array(items.length).fill(false);
    session.checked[zone] = checked;
    const done = checked.filter(Boolean).length;
    const total = items.length;

    await bot.editMessageText(
      `*${zone}*\n` +
        `${progressBar(done, total)} ${done}/${total}\n\n` +
        `🔴 — критичный пункт (обязателен)\n` +
        `⬜ — стандартный пункт\n\n` +
        `Нажимай на каждый пункт чтобы отметить выполнение:`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: checklistKeyboard(session, zone),
      }
    );
    return;
  }

  // Отметить пункт чек-листа
  if (data.startsWith("chk_")) {
    const parts = data.split("_");
    // chk_zone_index — но zone может содержать _ и emoji, поэтому берём последний элемент как index
    const idx = parseInt(parts[parts.length - 1]);
    const zone = parts.slice(1, parts.length - 1).join("_");
    if (!session.checked[zone]) {
      session.checked[zone] = Array(CHECKLISTS[session.service][zone].length).fill(false);
    }
    session.checked[zone][idx] = !session.checked[zone][idx];
    const checked = session.checked[zone];
    const done = checked.filter(Boolean).length;
    const total = CHECKLISTS[session.service][zone].length;

    await bot.editMessageText(
      `*${zone}*\n` +
        `${progressBar(done, total)} ${done}/${total}\n\n` +
        `🔴 — критичный пункт (обязателен)\n` +
        `⬜ — стандартный пункт\n\n` +
        `Нажимай на каждый пункт чтобы отметить выполнение:`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: checklistKeyboard(session, zone),
      }
    );
    return;
  }

  // Назад к зонам
  if (data === "back_zones" || data === "zone_complete" || data === "zone_incomplete") {
    if (data === "zone_complete" && session.currentZone) {
      // Отмечаем зону как выполненную (все галочки)
    }
    session.step = "zones";
    const zones = session.zones;
    const totalItems = zones.reduce((s, z) => s + CHECKLISTS[session.service][z].length, 0);
    const doneItems = zones.reduce((s, z) => {
      const ch = session.checked[z] || [];
      return s + ch.filter(Boolean).length;
    }, 0);

    await bot.editMessageText(
      `${SERVICES[session.service]}\n\n` +
        `📋 *Прогресс по зонам*\n` +
        `${progressBar(doneItems, totalItems)} ${doneItems}/${totalItems}\n\n` +
        `Выбери следующую зону:`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: zonesKeyboard(session),
      }
    );
    return;
  }

  // Перейти к фото ПОСЛЕ
  if (data === "goto_photo_after") {
    session.step = "photo_after";
    session.photoAfter = [];

    await bot.editMessageText(
      `✅ *Все зоны выполнены!*\n\n` +
        `📸 *Шаг 3 — Фото ПОСЛЕ уборки*\n\n` +
        `Сделай фото с тех же точек что и «до»:\n` +
        `• Кухня (плита + раковина)\n` +
        `• Ванная (унитаз + душ)\n` +
        `• Все остальные зоны\n\n` +
        `⬆️ Отправляй фото прямо в этот чат`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Перейти к финальной проверке", callback_data: "goto_critical" }],
          ],
        },
      }
    );
    return;
  }

  // Финальная проверка Critical Misses
  if (data === "goto_critical") {
    session.step = "critical";

    await bot.editMessageText(
      `📸 Фото ПОСЛЕ: ${session.photoAfter.length} шт\n\n` +
        `🔍 *Шаг 4 — Финальная проверка*\n\n` +
        `Пройдись по объекту и проверь каждый пункт.\n` +
        `Все пункты должны быть отмечены ✅ перед сдачей заказа:`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: criticalKeyboard(session),
      }
    );
    return;
  }

  // Отметить critical пункт
  if (data.startsWith("crit_")) {
    const idx = parseInt(data.replace("crit_", ""));
    session.criticalDone[idx] = !session.criticalDone[idx];

    const doneCount = Object.values(session.criticalDone).filter(Boolean).length;
    const total = CRITICAL_FINAL.length;

    await bot.editMessageText(
      `🔍 *Финальная проверка*\n` +
        `${progressBar(doneCount, total)} ${doneCount}/${total}\n\n` +
        `Пройдись по объекту и проверь каждый пункт:`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: criticalKeyboard(session),
      }
    );
    return;
  }

  // Завершить заказ
  if (data === "finish_order") {
    const duration = session.startedAt
      ? Math.round((Date.now() - session.startedAt) / 60000)
      : "—";

    await bot.editMessageText(
      `🎉 *Заказ завершён!*\n\n` +
        `📅 ${new Date().toLocaleString("ru-RU")}\n` +
        `⏱ Время работы: ${duration} мин\n` +
        `🧹 Тип: ${SERVICES[session.service]}\n` +
        `📍 Адрес: ${session.address || "не указан"}\n` +
        `📸 Фото до: ${session.photoBefore.length} шт\n` +
        `📸 Фото после: ${session.photoAfter.length} шт\n\n` +
        `✅ Отчёт отправлен менеджеру BCS\n\n` +
        `Спасибо за работу! 💪`,
      {
        chat_id: chatId,
        message_id: msgId,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Новый заказ", callback_data: "new_order" }],
          ],
        },
      }
    );

    // Отправляем отчёт администратору
    await sendReport(session, query.from);

    resetSession(chatId);
    return;
  }

  // Новый заказ
  if (data === "new_order") {
    resetSession(chatId);
    const session2 = getSession(chatId);
    session2.step = "await_address";
    session2.startedAt = Date.now();
    await bot.sendMessage(chatId, "🏠 Укажи адрес нового объекта (или /skip):");
    return;
  }
});

console.log("🤖 BCS Quality Bot запущен...");
