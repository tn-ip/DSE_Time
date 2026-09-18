/**
 * DSE Time — countdown and encouragement messages.
 * Target: 2027 HKDSE written exams, first timetable day (Visual Arts), Hong Kong time.
 *
 * Add encouragement copy by appending objects to MESSAGES below.
 * Each item: { zh: "中文", en: "English" }
 */

const EXAM_START = new Date("2027-04-06T08:30:00+08:00");
const EXAM_END = new Date("2027-05-04T18:00:00+08:00");
const RESULTS = new Date("2027-07-14T00:00:00+08:00");
const TZ = "Asia/Hong_Kong";

const MESSAGES = [
  {
    zh: "一步一步來，已經很了不起了。",
    en: "One step at a time — that already counts for a lot.",
  },
  {
    zh: "你比自己想像中更接近目標。",
    en: "You are closer than you think.",
  },
  {
    zh: "休息也是備戰的一部分。今晚早點睡。",
    en: "Rest is part of the work. Sleep well tonight.",
  },
  {
    zh: "不必完美，只要今天比昨天更清楚一點。",
    en: "It does not have to be perfect — just a little clearer than yesterday.",
  },
  {
    zh: "考試是一場展示，不是對你整個人的判決。",
    en: "The exam is a snapshot, not a verdict on who you are.",
  },
  {
    zh: "你已經走了很遠。記得為自己喝采。",
    en: "You have already come a long way. Cheer for yourself.",
  },
  {
    zh: "深呼吸。下一題，下一天，你都可以重新開始。",
    en: "Breathe. The next question, the next day — you can begin again.",
  },
  {
    zh: "家人和朋友都在你這邊。你不是一個人。",
    en: "Family and friends are with you. You are not alone.",
  },
];

const pad = (n) => String(n).padStart(2, "0");

const hkNowLabel = (date) =>
  new Intl.DateTimeFormat("zh-HK", {
    timeZone: TZ,
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

function partsUntil(target, now) {
  let ms = target.getTime() - now.getTime();
  if (ms < 0) ms = 0;
  const sec = Math.floor(ms / 1000);
  return {
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
    done: now >= target,
  };
}

function renderCountdown() {
  const now = new Date();
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const statusEl = document.getElementById("countdown-status");
  const nowEl = document.getElementById("hk-now");
  if (!daysEl || !statusEl) return;

  let target = EXAM_START;
  let status =
    "倒數至 2027 年 4 月 6 日上午 8:30（香港時間）· Countdown to 08:30 HKT on 6 Apr 2027";

  if (now >= EXAM_START && now < EXAM_END) {
    target = EXAM_END;
    status = "筆試進行中。願你沉着應考。· Written exams are in progress. You've got this.";
  } else if (now >= EXAM_END && now < RESULTS) {
    target = RESULTS;
    status = "筆試已完成。暫定放榜約 2027 年 7 月 14 日。";
  } else if (now >= RESULTS) {
    status = "2027 文憑試旅程已到放榜。無論結果如何，你已經完成了一件大事。";
  }

  const t = partsUntil(target, now);
  daysEl.textContent = String(t.days);
  hoursEl.textContent = pad(t.hours);
  minutesEl.textContent = pad(t.minutes);
  secondsEl.textContent = pad(t.seconds);
  statusEl.textContent = status;
  if (nowEl) nowEl.textContent = `現在香港時間 Now in Hong Kong: ${hkNowLabel(now)}`;
}

function pickMessage(excludeIndex) {
  if (MESSAGES.length === 1) return 0;
  let i = excludeIndex;
  while (i === excludeIndex) {
    i = Math.floor(Math.random() * MESSAGES.length);
  }
  return i;
}

function showMessage(index) {
  const msg = MESSAGES[index];
  const zh = document.getElementById("message-zh");
  const en = document.getElementById("message-en");
  if (!msg || !zh || !en) return;
  zh.textContent = msg.zh;
  en.textContent = msg.en;
}

function initMessages() {
  let index = pickMessage(-1);
  showMessage(index);

  const btn = document.getElementById("next-message");
  if (!btn) return;
  btn.addEventListener("click", () => {
    index = pickMessage(index);
    showMessage(index);
  });
}

renderCountdown();
setInterval(renderCountdown, 1000);
initMessages();
