/**
 * DSE Time — countdown and encouragement messages.
 * Target: 2027 HKDSE written exams, first timetable day (Visual Arts), Hong Kong time.
 *
 * Encouragement copy lives in messages.json (array of { zh, en }).
 */

const EXAM_START = new Date("2027-04-06T08:30:00+08:00");
const EXAM_END = new Date("2027-05-04T18:00:00+08:00");
const RESULTS = new Date("2027-07-14T00:00:00+08:00");
const TZ = "Asia/Hong_Kong";

const FALLBACK_MESSAGES = [
  {
    zh: "一步一步來，已經很了不起了。",
    en: "One step at a time — that already counts for a lot.",
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

function pickMessage(list, excludeIndex) {
  if (list.length === 1) return 0;
  let i = excludeIndex;
  while (i === excludeIndex) {
    i = Math.floor(Math.random() * list.length);
  }
  return i;
}

function showMessage(list, index) {
  const msg = list[index];
  const zh = document.getElementById("message-zh");
  const en = document.getElementById("message-en");
  if (!msg || !zh || !en) return;
  zh.textContent = msg.zh;
  en.textContent = msg.en;
}

function initMessages(list) {
  let index = pickMessage(list, -1);
  showMessage(list, index);

  const btn = document.getElementById("next-message");
  if (!btn) return;
  btn.addEventListener("click", () => {
    index = pickMessage(list, index);
    showMessage(list, index);
  });
}

async function loadMessages() {
  try {
    const res = await fetch("messages.json");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const list = Array.isArray(data)
      ? data.filter((item) => item && item.zh && item.en)
      : [];
    return list.length ? list : FALLBACK_MESSAGES;
  } catch {
    return FALLBACK_MESSAGES;
  }
}

renderCountdown();
setInterval(renderCountdown, 1000);
loadMessages().then(initMessages);
