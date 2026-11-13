import "dotenv/config";
import { Bot, InlineKeyboard, Keyboard } from "grammy";

// ================== НАСТРОЙКИ ==================
// Тексты и цены меняй здесь. Разметка: <b>жирный</b>, <i>курсив</i>.

const WELCOME =
  "Привет! 👋 Меня зовут Софья Игоревна, и я более 5 лет помогаю школьникам разобраться в физике и подготовиться к экзаменам на лучшие баллы.\n\n" +
  "Здесь можно узнать обо мне и о формате занятий, а также записаться на бесплатную вводную встречу 👇";

// Разделы главного меню. Порядок здесь = порядок кнопок.
const SECTIONS: Record<string, { button: string; text: string }> = {
  about: {
    button: "👩‍🏫 Обо мне",
    text: `👩‍🏫 <b>Обо мне</b>

Меня зовут Софья Игоревна, я репетитор по физике. Больше 5 лет готовлю учеников к экзаменам и контрольным по физике.

Я закончила магистратуру и бакалавриат в области наноматериалов. Работала в лаборатории Сколково инженером по механическим испытаниям на производстве медицинских изделий. Поэтому всегда стараюсь показать, где физика работает в реальной жизни и где она может пригодиться в дальнейшем.

Моя цель — чтобы ученик не просто нарешивал задачи, а <b>понимал физику</b>, увлёкся ей и перестал бояться предмета.

🏆 <b>Результаты учеников за прошлый год</b>
ОГЭ: 37/39 (5), 33/39 (5), 26/39 (4)
МЦКО: 5`,
  },
  lessons: {
    button: "💻 Как проходят уроки",
    text: `💻 <b>Как проходят уроки</b>

— онлайн в Zoom, урок длится 60 минут
— работаем на интерактивной доске и в симуляторах экспериментов
— после каждого урока — домашнее задание с подробной проверкой и комментариями
— между уроками я на связи: можно задать вопрос по домашке или школьной теме

Первая встреча бесплатная: познакомимся, проверим уровень, обсудим цели и план подготовки.`,
  },
  parents: {
    button: "👨‍👩‍👧 Для родителей",
    text: `👨‍👩‍👧 <b>Для родителей</b>

У ученика есть личный кабинет с расписанием, домашними заданиями и прогрессом.

У вас тоже будет доступ, чтобы видеть результаты и динамику.

Основное общение будет вестись лично с учеником (сдача домашек, планирование уроков), но если у вас будут ко мне вопросы — я всегда на связи.`,
  },
  rules: {
    button: "📋 Правила работы",
    text: `📋 <b>Правила работы со мной</b>

— Домашнее задание после каждого урока обязательно. Без домашних заданий с учениками не работаю.
— В процессе работы ученик должен зарегистрироваться на онлайн-доске и в зуме. Для этого у ученика должен быть личный почтовый адрес или доступ к родительскому.
- На уроках нужна тетрадь 49 или 96 листов и калькулятор.
- Уроки могут задерживаться при необходимости по договоренности с учеником. Оплата сверх времени не требуется.`,
  },
};

const CLASSES: Record<string, { title: string; description: string; price: string }> = {
  "7": {
    title: "7 класс",
    description:
      "Разбираем базу: работа с физическими величинами, оформление задач, система СИ. Далее изучаем механику, давление, работу и энергию. Закрываем пробелы и учимся решать задачи. Если есть запрос на олимпиадные задачи, сразу обговариваем это и начинаем погружаться в теорию решения сложных задач.",
    price: "1500 ₽ / 60 мин",
  },
  "8": {
    title: "8 класс",
    description:
      "В течение года плотно разбираем тепловые и электрические явления, готовимся к контрольным, решаем задачи, при необходимости смотрим школьные домашки. Если планируется сдача ОГЭ в 9 классе, начинаем решать первые задачи из пробников.",
    price: "1500 ₽ / 60 мин",
  },
  "9": {
    title: "9 класс (ОГЭ)",
    description: "Системная подготовка к ОГЭ: теория, все типы заданий, лабораторная работа на реальном оборудовании.",
    price: "2000 ₽ / 60 мин",
  },
  uni: {
    title: "Студент",
    description: "Помощь с выполнением лабораторных работ и подготовкой к контрольным.",
    price: "от 1000 ₽ / 60 мин",
  },
};

// Раздел «Стоимость» — собирается автоматически из CLASSES, цены меняй только там
 SECTIONS.prices = {
     button: "💰  Стоимость",
     text:
        "💰  <b>Стоимость занятий</b>\n\n" +
         Object.values(CLASSES)
         .map((c) => `<b>${c.title}</b> — ${c.price}`)
         .join("\n") +
         "\n\n🎁  Первая вводная встреча бесплатная.",
          };

const BOOK_TEXT = "📝 <b>Запись на занятия</b>\n\nВыберите класс:";

const TRIAL_NOTE =
  "Первая встреча бесплатная: познакомимся, проверим уровень, обсудим цели и план подготовки.";

const THANKS =
  "Спасибо! 🙌 Заявка отправлена.\n" +
  "Я напишу вам в ближайшее время, чтобы договориться о времени вводной встречи.";

// ================================================

const token = process.env.BOT_TOKEN;
const adminId = Number(process.env.ADMIN_CHAT_ID);
const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
const sheetsSecret = process.env.SHEETS_SECRET;
if (!token) throw new Error("Не задан BOT_TOKEN в .env");

const bot = new Bot(token);

// Ученики без @username: ждём от них номер телефона (класс храним, пока не пришлёт)
const pendingContact = new Map<number, string>();

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- Клавиатуры ----------

const menuKeyboard = () => {
  const kb = new InlineKeyboard();
  const entries = Object.entries(SECTIONS);
  entries.forEach(([id, s], i) => {
    kb.text(s.button, `sec:${id}`);
    if (i % 2 === 1) kb.row(); // по две кнопки в ряд
  });
  return kb.row().text("📝 Записаться на занятие", "book");
};

const sectionKeyboard = () =>
  new InlineKeyboard().text("📝 Записаться на занятие", "book").row().text("← В меню", "menu");

const classesKeyboard = () => {
  const kb = new InlineKeyboard();
  for (const [id, c] of Object.entries(CLASSES)) kb.text(c.title, `class:${id}`).row();
  return kb.text("← В меню", "menu");
};

const classKeyboard = (id: string) =>
  new InlineKeyboard()
    .text("✅ Записаться на бесплатную встречу", `trial:${id}`)
    .row()
    .text("← Другой класс", "book")
    .text("← В меню", "menu");

// ---------- Уведомление тебе ----------

async function notifyAdmin(
  user: { id: number; first_name: string; last_name?: string; username?: string },
  classId: string,
  phone?: string,
) {
  if (!adminId) {
    console.warn("ADMIN_CHAT_ID не задан — уведомление не отправлено");
    return;
  }
  const name = escapeHtml([user.first_name, user.last_name].filter(Boolean).join(" "));
  const lines = [
    "🔔 <b>Новая заявка на вводную встречу</b>",
    "",
    `👤 <a href="tg://user?id=${user.id}">${name}</a>`,
    user.username ? `💬 @${user.username}` : null,
    phone ? `📱 ${escapeHtml(phone)}` : null,
    `🎓 ${CLASSES[classId]?.title ?? "класс не указан"}`,
  ].filter(Boolean);
  await bot.api.sendMessage(adminId, lines.join("\n"), { parse_mode: "HTML" });
}

// ---------- Запись в Google-таблицу ----------

type LeadUser = { id: number; first_name: string; last_name?: string; username?: string };

async function saveLead(user: LeadUser, classId: string, phone?: string) {
  if (!sheetsUrl) return; // таблица не настроена — просто пропускаем
  const res = await fetch(sheetsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: sheetsSecret,
      name: [user.first_name, user.last_name].filter(Boolean).join(" "),
      username: user.username ?? "",
      phone: phone ?? "",
      classTitle: CLASSES[classId]?.title ?? "",
    }),
  });
  const text = (await res.text()).trim();
  if (!res.ok || text !== "ok") throw new Error(`Google Sheets ответил: ${res.status} ${text.slice(0, 200)}`);
}

// Уведомление + таблица. Если что-то сломалось, ученик всё равно видит «Спасибо».
async function handleLead(user: LeadUser, classId: string, phone?: string) {
  const [notify, save] = await Promise.allSettled([
    notifyAdmin(user, classId, phone),
    saveLead(user, classId, phone),
  ]);
  if (notify.status === "rejected") console.error("Не отправилось уведомление:", notify.reason);
  if (save.status === "rejected") {
    console.error("Не сохранилось в таблицу:", save.reason);
    if (adminId) {
      await bot.api
        .sendMessage(adminId, "⚠️ Заявка выше не сохранилась в Google-таблицу — проверь настройки скрипта.")
        .catch(() => {});
    }
  }
}

// ---------- Обработчики ----------

// /start — главное меню
bot.command("start", async (ctx) => { await ctx.reply(WELCOME, { reply_markup: menuKeyboard() });
// Уведомление тебе, что кто-то зашёл (свои заходы не присылаем)
const user = ctx.from; if (!adminId || !user || ctx.chat.id === adminId) return;
 const name = escapeHtml([user.first_name, user.last_name].filter(Boolean).join(" "));
  const source = ctx.match; // метка из ссылки t.me/бот?start=avito
   const lines = [
       "👀  <b>Кто-то зашёл в бота</b>",
        "",
        `👤  <a href="tg://user?id=${user.id}">${name}</a>`,
         user.username ? 💬  @${user.username} : null,
          source ? 📍  Источник: ${escapeHtml(source)} : null,
          ].filter(Boolean);
   await bot.api
    .sendMessage(adminId, lines.join("\n"), { parse_mode: "HTML", disable_notification: true })
    .catch((err) => console.error("Не отправилось уведомление о входе:", err));
});

// /id — чтобы узнать свой chat id для ADMIN_CHAT_ID
bot.command("id", (ctx) => ctx.reply(`Ваш chat id: ${ctx.chat.id}`));

// Вернуться в меню
bot.callbackQuery("menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: menuKeyboard() });
});

// Разделы: обо мне, уроки, родителям, правила
bot.callbackQuery(/^sec:(\w+)$/, async (ctx) => {
  const s = SECTIONS[ctx.match[1]];
  await ctx.answerCallbackQuery();
  if (!s) return;
  await ctx.editMessageText(s.text, { parse_mode: "HTML", reply_markup: sectionKeyboard() });
});

// Запись — выбор класса
bot.callbackQuery("book", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(BOOK_TEXT, { parse_mode: "HTML", reply_markup: classesKeyboard() });
});

// Выбрали класс — описание и цена
bot.callbackQuery(/^class:(\w+)$/, async (ctx) => {
  const id = ctx.match[1];
  const c = CLASSES[id];
  await ctx.answerCallbackQuery();
  if (!c) return;
  await ctx.editMessageText(
    `🎓 <b>${c.title}</b>\n\n${c.description}\n\n💰 <b>Стоимость урока:</b> ${c.price}\n\n🎁 ${TRIAL_NOTE}`,
    { parse_mode: "HTML", reply_markup: classKeyboard(id) },
  );
});

// Записаться на вводную встречу
bot.callbackQuery(/^trial:(\w+)$/, async (ctx) => {
  const classId = ctx.match[1];
  await ctx.answerCallbackQuery();

  if (ctx.from.username) {
    // Есть @username — тебе есть куда написать, сразу шлём заявку
    await handleLead(ctx.from, classId);
    await ctx.editMessageText(THANKS, {
      reply_markup: new InlineKeyboard().text("← В меню", "menu"),
    });
  } else {
    // Нет @username — просим номер, иначе с ним сложно связаться
    pendingContact.set(ctx.from.id, classId);
    await ctx.editMessageText("Почти готово!");
    await ctx.reply("Чтобы я могла с вами связаться, отправьте, пожалуйста, номер телефона кнопкой ниже 👇", {
      reply_markup: new Keyboard().requestContact("📱 Отправить номер").resized().oneTime(),
    });
  }
});

// Получили контакт
bot.on("message:contact", async (ctx) => {
  const classId = pendingContact.get(ctx.from.id) ?? "";
  pendingContact.delete(ctx.from.id);
  await handleLead(ctx.from, classId, ctx.message.contact.phone_number);
  await ctx.reply(THANKS, { reply_markup: { remove_keyboard: true } });
});

bot.catch((err) => console.error("Ошибка бота:", err.error));

bot.start({ onStart: (me) => console.log(`Бот @${me.username} запущен`) });