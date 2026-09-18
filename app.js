/**
 * DSE Time — countdown and encouragement messages.
 * Copy is loaded from messages.json.
 */

const EXAM_START = new Date("2027-04-06T08:30:00+08:00");
const EXAM_END = new Date("2027-05-04T18:00:00+08:00");
const RESULTS = new Date("2027-07-14T00:00:00+08:00");
const TZ = "Asia/Hong_Kong";
const ROTATE_MS = 14000;

const FALLBACK_MESSAGES = [
  {
    text: "一步一步來，已經很了不起了。",
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

function normalizeMessage(item) {
  if (!item || typeof item !== "object") return null;
  const text = String(item.text || item.zh || "").trim();
  if (!text) return null;
  const en = String(item.en || (item.lang === "en" ? item.text : "") || "").trim();
  const author = String(item.author || item.name || "").trim();
  return { text, en, author };
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
  const by = document.getElementById("message-author");
  if (!msg || !zh) return;
  zh.textContent = msg.text;
  if (en) {
    en.hidden = !msg.en;
    en.textContent = msg.en;
  }
  if (by) {
    if (msg.author) {
      by.hidden = false;
      by.textContent = `— ${msg.author}`;
    } else {
      by.hidden = true;
      by.textContent = "";
    }
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initMessages(list) {
  let index = pickMessage(list, -1);
  showMessage(list, index);

  const btn = document.getElementById("next-message");
  const panel = document.querySelector(".hero-note");
  let timer = null;

  const next = () => {
    index = pickMessage(list, index);
    showMessage(list, index);
  };

  const startRotate = () => {
    if (prefersReducedMotion() || list.length < 2) return;
    stopRotate();
    timer = setInterval(next, ROTATE_MS);
  };

  const stopRotate = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (btn) {
    btn.addEventListener("click", () => {
      next();
      startRotate();
    });
  }

  if (panel) {
    panel.addEventListener("mouseenter", stopRotate);
    panel.addEventListener("mouseleave", startRotate);
    panel.addEventListener("focusin", stopRotate);
    panel.addEventListener("focusout", startRotate);
  }

  startRotate();
}

async function loadMessages() {
  try {
    const res = await fetch("messages.json");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const raw = Array.isArray(data) ? data : data.messages;
    const list = (Array.isArray(raw) ? raw : []).map(normalizeMessage).filter(Boolean);
    return list.length ? list : FALLBACK_MESSAGES.map(normalizeMessage);
  } catch {
    return FALLBACK_MESSAGES.map(normalizeMessage);
  }
}

renderCountdown();
setInterval(renderCountdown, 1000);
loadMessages().then(initMessages);
