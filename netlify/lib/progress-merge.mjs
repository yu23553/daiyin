const PENDING_KEYS = ["xp", "listenCorrect", "listenTotal", "speakGood", "speakTotal", "sessions"];
const STAT_KEYS = ["listenCorrect", "listenTotal", "speakGood", "speakTotal", "sessions"];
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9_-]{1,40}$/i;
const AWARD = /^[a-z0-9_:-]{1,80}$/i;

export function zeroPending() {
  return { xp: 0, listenCorrect: 0, listenTotal: 0, speakGood: 0, speakTotal: 0, sessions: 0 };
}

export function blankProgress() {
  return {
    profile: null,
    xp: 0,
    streak: { count: 0, last: "" },
    stats: { listenCorrect: 0, listenTotal: 0, speakGood: 0, speakTotal: 0, sessions: 0 },
    srs: {},
    awards: {},
    lessons: {},
    offline: {},
    pending: zeroPending(),
    synced: false,
    updatedAt: ""
  };
}

function clampInt(value, max) {
  const n = Math.floor(Number(value) || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.min(max, Math.max(0, n));
}

function cleanPending(raw) {
  const out = zeroPending();
  PENDING_KEYS.forEach(function (key) {
    out[key] = clampInt(raw && raw[key], 5000);
  });
  return out;
}

function cleanStats(raw) {
  const out = blankProgress().stats;
  STAT_KEYS.forEach(function (key) {
    out[key] = clampInt(raw && raw[key], 1000000);
  });
  if (out.listenCorrect > out.listenTotal) out.listenTotal = out.listenCorrect;
  if (out.speakGood > out.speakTotal) out.speakTotal = out.speakGood;
  return out;
}

function cleanProfile(raw) {
  if (!raw || typeof raw !== "object") return null;
  const goal = String(raw.goal || "").slice(0, 24);
  const startedAt = DAY.test(raw.startedAt || "") ? raw.startedAt : "";
  if (!goal || !startedAt) return null;
  const minutes = [15, 25, 40].includes(Number(raw.minutes)) ? Number(raw.minutes) : 25;
  const particle = ["male", "female", "both"].includes(raw.particle) ? raw.particle : "both";
  const profileAt = typeof raw.profileAt === "string" ? raw.profileAt.slice(0, 40) : "";
  return { goal: goal, minutes: minutes, particle: particle, startedAt: startedAt, onboarded: true, profileAt: profileAt };
}

function cleanCard(raw) {
  if (!raw || typeof raw !== "object") return null;
  const due = DAY.test(raw.due || "") ? raw.due : "";
  if (!due) return null;
  const ease = Number(raw.ease);
  return {
    ease: Math.min(3, Math.max(1.3, Number.isFinite(ease) ? ease : 2.3)),
    reps: clampInt(raw.reps, 10000),
    lapses: clampInt(raw.lapses, 10000),
    interval: clampInt(raw.interval, 3650),
    due: due,
    touched: typeof raw.touched === "string" ? raw.touched.slice(0, 40) : ""
  };
}

function cleanSrs(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).slice(0, 800).forEach(function (id) {
    if (!ID.test(id)) return;
    const card = cleanCard(raw[id]);
    if (card) out[id] = card;
  });
  return out;
}

function cleanAwards(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).slice(0, 800).forEach(function (day) {
    if (!DAY.test(day) || !raw[day] || typeof raw[day] !== "object") return;
    const bag = {};
    Object.keys(raw[day]).slice(0, 40).forEach(function (key) {
      if (AWARD.test(key) && raw[day][key]) bag[key] = true;
    });
    if (Object.keys(bag).length) out[day] = bag;
  });
  return out;
}

function cleanLessons(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).slice(0, 80).forEach(function (id) {
    if (ID.test(id) && DAY.test(raw[id] || "")) out[id] = raw[id];
  });
  return out;
}

function cleanOffline(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).slice(0, 800).forEach(function (day) {
    if (!DAY.test(day) || !raw[day] || typeof raw[day] !== "object") return;
    const bag = {};
    Object.keys(raw[day]).slice(0, 20).forEach(function (id) {
      if (ID.test(id) && raw[day][id]) bag[id] = true;
    });
    if (Object.keys(bag).length) out[day] = bag;
  });
  return out;
}

export function sanitizeProgress(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const text = JSON.stringify(src);
  if (text.length > 200000) {
    const err = new Error("学习记录过大，无法保存。");
    err.status = 413;
    throw err;
  }
  const streakLast = DAY.test(src.streak && src.streak.last) ? src.streak.last : "";
  return {
    profile: cleanProfile(src.profile),
    xp: clampInt(src.xp, 1000000),
    streak: { count: clampInt(src.streak && src.streak.count, 10000), last: streakLast },
    stats: cleanStats(src.stats),
    srs: cleanSrs(src.srs),
    awards: cleanAwards(src.awards),
    lessons: cleanLessons(src.lessons),
    offline: cleanOffline(src.offline),
    pending: cleanPending(src.pending),
    ledger: cleanLedger(src.ledger),
    deviceId: typeof src.deviceId === "string" && /^[a-z0-9]{6,40}$/i.test(src.deviceId) ? src.deviceId : "",
    synced: !!src.synced,
    updatedAt: typeof src.updatedAt === "string" ? src.updatedAt.slice(0, 40) : ""
  };
}

function cleanLedger(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).slice(0, 30).forEach(function (id) {
    if (!/^[a-z0-9]{6,40}$/i.test(id)) return;
    const row = zeroPending();
    PENDING_KEYS.forEach(function (key) {
      row[key] = clampInt(raw[id] && raw[id][key], 1000000);
    });
    out[id] = row;
  });
  return out;
}

function sumLedger(ledger) {
  const stats = blankProgress().stats;
  let xp = 0;
  Object.keys(ledger).forEach(function (id) {
    xp += ledger[id].xp;
    STAT_KEYS.forEach(function (key) {
      stats[key] += ledger[id][key];
    });
  });
  if (stats.listenCorrect > stats.listenTotal) stats.listenTotal = stats.listenCorrect;
  if (stats.speakGood > stats.speakTotal) stats.speakTotal = stats.speakGood;
  return { xp: xp, stats: stats };
}

function mergeProfile(stored, incoming) {
  if (!stored) return incoming;
  if (!incoming) return stored;
  if (stored.profileAt && incoming.profileAt) return stored.profileAt >= incoming.profileAt ? stored : incoming;
  if (stored.profileAt) return stored;
  if (incoming.profileAt) return incoming;
  return stored;
}

function mergeStreak(a, b) {
  if (!a.last) return b;
  if (!b.last) return a;
  if (a.last === b.last) return { last: a.last, count: Math.max(a.count, b.count) };
  return a.last > b.last ? a : b;
}

function mergeSrs(a, b) {
  const out = {};
  Object.keys(a).concat(Object.keys(b)).forEach(function (id) {
    if (out[id]) return;
    const left = a[id];
    const right = b[id];
    if (!left) { out[id] = right; return; }
    if (!right) { out[id] = left; return; }
    if (left.touched || right.touched) {
      out[id] = (left.touched || "") >= (right.touched || "") ? left : right;
      return;
    }
    const leftScore = left.reps + left.lapses;
    const rightScore = right.reps + right.lapses;
    out[id] = leftScore >= rightScore ? left : right;
  });
  return out;
}

function mergeFlags(a, b) {
  const out = {};
  [a, b].forEach(function (src) {
    Object.keys(src).forEach(function (day) {
      out[day] = Object.assign(out[day] || {}, src[day]);
    });
  });
  return out;
}

function mergeLessons(a, b) {
  const out = Object.assign({}, a);
  Object.keys(b).forEach(function (id) {
    if (!out[id] || b[id] > out[id]) out[id] = b[id];
  });
  return out;
}

export function mergeProgress(storedRaw, incomingRaw) {
  const stored = sanitizeProgress(storedRaw || blankProgress());
  const incoming = sanitizeProgress(incomingRaw || blankProgress());
  const ledger = cleanLedger(stored.ledger);
  const incomingLedger = cleanLedger(incoming.ledger);
  if (incoming.deviceId && incomingLedger[incoming.deviceId]) {
    const prev = ledger[incoming.deviceId] || zeroPending();
    const next = incomingLedger[incoming.deviceId];
    const row = zeroPending();
    PENDING_KEYS.forEach(function (key) {
      row[key] = Math.max(prev[key], next[key]);
    });
    ledger[incoming.deviceId] = row;
  }
  let stats;
  let xp;
  if (Object.keys(ledger).length) {
    const summed = sumLedger(ledger);
    stats = summed.stats;
    xp = summed.xp;
  } else {
    stats = blankProgress().stats;
    STAT_KEYS.forEach(function (key) {
      if (incoming.synced) stats[key] = stored.stats[key] + incoming.pending[key];
      else stats[key] = Math.max(stored.stats[key], incoming.stats[key]);
    });
    if (stats.listenCorrect > stats.listenTotal) stats.listenTotal = stats.listenCorrect;
    if (stats.speakGood > stats.speakTotal) stats.speakTotal = stats.speakGood;
    xp = incoming.synced ? stored.xp + incoming.pending.xp : Math.max(stored.xp, incoming.xp);
  }
  const merged = {
    profile: mergeProfile(stored.profile, incoming.profile),
    xp: xp,
    streak: mergeStreak(stored.streak, incoming.streak),
    stats: stats,
    srs: mergeSrs(stored.srs, incoming.srs),
    awards: mergeFlags(stored.awards, incoming.awards),
    lessons: mergeLessons(stored.lessons, incoming.lessons),
    offline: mergeFlags(stored.offline, incoming.offline),
    pending: zeroPending(),
    ledger: ledger,
    deviceId: incoming.deviceId || stored.deviceId || "",
    synced: true,
    updatedAt: new Date().toISOString()
  };
  return merged;
}
