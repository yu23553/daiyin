(function () {
  const KEY = "daiyin-thai-v1";

  function dateKey(date) {
    const d = date || new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function parseKey(key) {
    const parts = key.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function addDays(n, fromKey) {
    const base = fromKey ? parseKey(fromKey) : new Date();
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  function zeroPending() {
    return { xp: 0, listenCorrect: 0, listenTotal: 0, speakGood: 0, speakTotal: 0, sessions: 0 };
  }

  function blank() {
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
      ledger: {},
      deviceId: "",
      synced: false,
      dirty: false,
      updatedAt: ""
    };
  }

  function readDeviceId() {
    const key = "daiyin-device-v1";
    try {
      let id = localStorage.getItem(key);
      if (!id || !/^[a-z0-9]{8,40}$/i.test(id)) {
        id = Date.now().toString(16) + Math.random().toString(16).slice(2, 10);
        localStorage.setItem(key, id);
      }
      return id;
    } catch (err) {
      return "localdevice";
    }
  }

  function ensureLedger() {
    const id = readDeviceId();
    state.deviceId = id;
    if (!state.ledger || typeof state.ledger !== "object" || Array.isArray(state.ledger)) state.ledger = {};
    if (!state.ledger[id]) {
      const hasRows = Object.keys(state.ledger).length > 0;
      const hasLocal = state.xp || state.stats.listenTotal || state.stats.speakTotal || state.stats.sessions;
      if (!hasRows && hasLocal && !state.synced) {
        state.ledger[id] = {
          xp: state.xp,
          listenCorrect: state.stats.listenCorrect,
          listenTotal: state.stats.listenTotal,
          speakGood: state.stats.speakGood,
          speakTotal: state.stats.speakTotal,
          sessions: state.stats.sessions
        };
      } else {
        state.ledger[id] = zeroPending();
      }
    }
    return id;
  }

  function sumLedger(ledger) {
    const stats = blank().stats;
    let xp = 0;
    Object.keys(ledger || {}).forEach(function (id) {
      const row = ledger[id] || {};
      xp += row.xp || 0;
      stats.listenCorrect += row.listenCorrect || 0;
      stats.listenTotal += row.listenTotal || 0;
      stats.speakGood += row.speakGood || 0;
      stats.speakTotal += row.speakTotal || 0;
      stats.sessions += row.sessions || 0;
    });
    if (stats.listenCorrect > stats.listenTotal) stats.listenTotal = stats.listenCorrect;
    if (stats.speakGood > stats.speakTotal) stats.speakTotal = stats.speakGood;
    return { xp: xp, stats: stats };
  }

  let state = blank();
  let seq = 0;

  function save(opts) {
    state.updatedAt = new Date().toISOString();
    if (!opts || !opts.silent) {
      seq += 1;
      state.dirty = true;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) { /* private mode */ }
    if (!opts || !opts.silent) {
      if (window.Account && Account.onLocalSave) Account.onLocalSave();
    }
  }

  function adopt(data, keepDirty) {
    const next = data || blank();
    state = Object.assign(blank(), next);
    state.stats = Object.assign(blank().stats, next.stats || {});
    state.streak = Object.assign(blank().streak, next.streak || {});
    state.pending = Object.assign(zeroPending(), next.pending || {});
    state.srs = next.srs && typeof next.srs === "object" ? next.srs : {};
    state.awards = next.awards && typeof next.awards === "object" ? next.awards : {};
    state.lessons = next.lessons && typeof next.lessons === "object" ? next.lessons : {};
    state.offline = next.offline && typeof next.offline === "object" ? next.offline : {};
    try {
      state.phonics = JSON.parse(JSON.stringify(next.phonics && typeof next.phonics === "object" ? next.phonics : {}));
    } catch (err) {
      state.phonics = {};
    }
    if (!state.phonics.passed || typeof state.phonics.passed !== "object") state.phonics.passed = {};
    if (!state.phonics.srs || typeof state.phonics.srs !== "object") state.phonics.srs = {};
    state.synced = !!next.synced;
    state.deviceId = typeof next.deviceId === "string" ? next.deviceId : "";
    try {
      state.ledger = JSON.parse(JSON.stringify(next.ledger && typeof next.ledger === "object" ? next.ledger : {}));
    } catch (err) {
      state.ledger = {};
    }
    state.dirty = keepDirty ? !!next.dirty : false;
    ensureLedger();
    if (!keepDirty) save({ silent: true });
  }

  function applyState(next) {
    adopt(next, false);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      adopt(JSON.parse(raw), true);
    } catch (err) {
      state = blank();
    }
  }

  function dayNumber() {
    if (!state.profile) return 1;
    const diff = Math.round((parseKey(dateKey()) - parseKey(state.profile.startedAt)) / 86400000);
    return Math.max(1, diff + 1);
  }

  function cycleIndex() {
    return (dayNumber() - 1) % 14;
  }

  function todayLesson() {
    if (!state.profile) return window.THAI.lesson("tones");
    const id = window.THAI.plans[state.profile.goal][cycleIndex()];
    return window.THAI.lesson(id);
  }

  function agenda() {
    const lesson = todayLesson();
    const minutes = state.profile ? state.profile.minutes : 25;
    const tasks = [
      {
        id: "lesson",
        kicker: "听说课",
        title: lesson.title,
        detail: "听词、听辨、听句，然后开口",
        minutes: 12,
        mode: "lesson",
        lessonId: lesson.id
      }
    ];
    if (minutes >= 25) {
      if (lesson.dialogueId) {
        const talk = window.THAI.dialogue(lesson.dialogueId);
        tasks.push({
          id: "talk",
          kicker: "对话",
          title: talk.title,
          detail: "对方说完后，选择并说出下一句",
          minutes: 8,
          mode: "talk",
          dialogueId: talk.id
        });
      } else {
        tasks.push({
          id: "listen",
          kicker: "听辨",
          title: "再听一轮声调",
          detail: "只听声音，选择意思",
          minutes: 6,
          mode: "listen",
          lessonId: lesson.id
        });
      }
    }
    if (minutes >= 40) {
      tasks.push({
        id: "review",
        kicker: "复习",
        title: "再听一遍到期的词",
        detail: "若没有到期的词，则做一组声调听辨",
        minutes: 8,
        mode: "review"
      });
    }
    return tasks;
  }

  function isDone(taskId) {
    const today = state.awards[dateKey()] || {};
    return !!today["task:" + taskId];
  }

  function touchStreak() {
    const today = dateKey();
    if (state.streak.last === today) return;
    const yesterday = addDays(-1);
    state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
    state.streak.last = today;
  }

  // 累计打卡：有过学习奖励 / 离线完成 / 已记入 streak 的不重复日期数。
  function checkInTotal() {
    const days = {};
    Object.keys(state.awards || {}).forEach(function (key) {
      const bag = state.awards[key];
      if (bag && typeof bag === "object" && Object.keys(bag).length) days[key] = true;
    });
    Object.keys(state.offline || {}).forEach(function (key) {
      const bag = state.offline[key];
      if (!bag || typeof bag !== "object") return;
      if (Object.keys(bag).some(function (id) { return !!bag[id]; })) days[key] = true;
    });
    if (state.streak && state.streak.last) days[state.streak.last] = true;
    return Object.keys(days).length;
  }

  function checkedInToday() {
    const today = dateKey();
    if (state.streak && state.streak.last === today) return true;
    const awards = state.awards && state.awards[today];
    if (awards && typeof awards === "object" && Object.keys(awards).length) return true;
    const offline = state.offline && state.offline[today];
    if (offline && typeof offline === "object" && Object.keys(offline).some(function (id) { return !!offline[id]; })) return true;
    return false;
  }

  function award(key, xp) {
    const today = dateKey();
    state.awards[today] = state.awards[today] || {};
    if (state.awards[today][key]) return 0;
    state.awards[today][key] = true;
    state.xp += xp;
    ensureLedger();
    state.ledger[state.deviceId].xp += xp;
    touchStreak();
    save();
    return xp;
  }

  function ensureCard(id) {
    if (!state.srs[id]) {
      state.srs[id] = { ease: 2.3, reps: 0, lapses: 0, interval: 0, due: dateKey() };
    }
    return state.srs[id];
  }

  function grade(id, ok) {
    const card = ensureCard(id);
    if (ok) {
      card.reps += 1;
      card.interval = card.reps === 1 ? 1 : Math.max(1, Math.round(card.interval * card.ease));
      card.ease = Math.min(2.8, card.ease + 0.08);
      card.due = addDays(card.interval);
      if (card.reps >= 3) {
        card.retired = true;
        card.due = "9999-12-31";
      }
    } else {
      card.lapses += 1;
      card.reps = 0;
      card.interval = 0;
      card.retired = false;
      card.ease = Math.max(1.5, card.ease - 0.2);
      card.due = dateKey();
    }
    card.touched = new Date().toISOString();
    save();
  }

  function dueWords() {
    const today = dateKey();
    return window.THAI.allWords().filter(function (word) {
      const card = state.srs[word.id];
      return card && !(card.retired || card.reps >= 3) && card.due <= today;
    });
  }

  function masteredCount() {
    return Object.keys(state.srs).filter(function (id) {
      const card = state.srs[id];
      return card.reps >= 2 && card.interval >= 3;
    }).length;
  }

  function noteListen(ok) {
    ensureLedger();
    state.stats.listenTotal += 1;
    state.ledger[state.deviceId].listenTotal += 1;
    if (ok) {
      state.stats.listenCorrect += 1;
      state.ledger[state.deviceId].listenCorrect += 1;
    }
    save();
  }

  function noteSpeak(good) {
    ensureLedger();
    state.stats.speakTotal += 1;
    state.ledger[state.deviceId].speakTotal += 1;
    if (good) {
      state.stats.speakGood += 1;
      state.ledger[state.deviceId].speakGood += 1;
    }
    save();
  }

  function noteSession() {
    ensureLedger();
    state.stats.sessions += 1;
    state.ledger[state.deviceId].sessions += 1;
    save();
  }

  function onboard(draft) {
    state.profile = {
      goal: draft.goal,
      minutes: Number(draft.minutes),
      particle: draft.particle,
      startedAt: dateKey(),
      onboarded: true,
      profileAt: new Date().toISOString()
    };
    save();
  }

  function setProfile(partial) {
    if (!state.profile) return;
    Object.keys(partial).forEach(function (key) {
      state.profile[key] = partial[key];
    });
    if (partial.minutes) state.profile.minutes = Number(partial.minutes);
    state.profile.profileAt = new Date().toISOString();
    save();
  }

  function toggleOffline(id) {
    const today = dateKey();
    state.offline[today] = state.offline[today] || {};
    state.offline[today][id] = !state.offline[today][id];
    if (state.offline[today][id]) touchStreak();
    save();
  }

  function offlineOn(id) {
    const today = state.offline[dateKey()] || {};
    return !!today[id];
  }

  function markLesson(id) {
    state.lessons[id] = dateKey();
    save();
  }

  function accuracy() {
    if (!state.stats.listenTotal) return null;
    return Math.round(100 * state.stats.listenCorrect / state.stats.listenTotal);
  }

  function reset() {
    state = blank();
    save({ silent: true });
  }

  function snapshotPending() {
    return Object.assign(zeroPending(), state.pending || {});
  }

  function consumePending(sent) {
    const pending = snapshotPending();
    Object.keys(pending).forEach(function (key) {
      pending[key] = Math.max(0, (pending[key] || 0) - ((sent && sent[key]) || 0));
    });
    state.pending = pending;
    save({ silent: true });
  }

  function settle(serverState) {
    ensureLedger();
    const id = state.deviceId;
    const current = Object.assign(zeroPending(), state.ledger[id]);
    applyState(serverState || blank());
    const row = Object.assign(zeroPending(), state.ledger[id]);
    let extra = false;
    Object.keys(zeroPending()).forEach(function (key) {
      const more = Math.max(0, (current[key] || 0) - (row[key] || 0));
      if (more) {
        row[key] += more;
        extra = true;
      }
    });
    state.ledger[id] = row;
    const sum = sumLedger(state.ledger);
    state.xp = sum.xp;
    state.stats = sum.stats;
    state.synced = true;
    state.dirty = extra;
    save({ silent: true });
    if (extra && window.Account && Account.onLocalSave) Account.onLocalSave();
  }

  function phonicsBag() {
    if (!state.phonics || typeof state.phonics !== "object") state.phonics = {};
    if (!state.phonics.passed || typeof state.phonics.passed !== "object") state.phonics.passed = {};
    if (!state.phonics.srs || typeof state.phonics.srs !== "object") state.phonics.srs = {};
    return state.phonics;
  }

  function phonicsPass(id) {
    const bag = phonicsBag();
    if (!bag.passed[id]) bag.passed[id] = dateKey();
    if (bag.passed.l2a && bag.passed.l2b && bag.passed.l2c) bag.passed.l2 = dateKey();
    const steps = ["l1", "l2", "l3", "l4", "l5"];
    let fresh = false;
    if (steps.every(function (key) { return bag.passed[key]; }) && !bag.doneAt) {
      bag.doneAt = dateKey();
      fresh = true;
    }
    save();
    return fresh;
  }

  function phonicsMiss(id, payload) {
    const bag = phonicsBag();
    const card = bag.srs[id] || { ease: 2.3, reps: 0, lapses: 0, interval: 0, due: dateKey() };
    card.reps = 0;
    card.interval = 0;
    card.lapses = (card.lapses || 0) + 1;
    card.ease = Math.max(1.5, (card.ease || 2.3) - 0.15);
    card.due = dateKey();
    card.payload = payload || card.payload || {};
    bag.srs[id] = card;
    save();
  }

  function phonicsGrade(id, ok) {
    const bag = phonicsBag();
    const card = bag.srs[id];
    if (!card) return;
    if (ok) {
      card.reps = (card.reps || 0) + 1;
      card.interval = card.reps === 1 ? 1 : Math.max(1, Math.round((card.interval || 1) * (card.ease || 2.3)));
      card.ease = Math.min(2.8, (card.ease || 2.3) + 0.08);
      card.due = addDays(card.interval);
    } else {
      card.lapses = (card.lapses || 0) + 1;
      card.reps = 0;
      card.interval = 0;
      card.ease = Math.max(1.5, (card.ease || 2.3) - 0.2);
      card.due = dateKey();
    }
    save();
  }

  function phonicsDue() {
    const bag = phonicsBag();
    const today = dateKey();
    return Object.keys(bag.srs).filter(function (id) {
      const card = bag.srs[id];
      return card && card.due <= today;
    }).map(function (id) {
      return { id: id, card: bag.srs[id] };
    });
  }

  function cycleDays() {
    const index = cycleIndex();
    const start = state.profile ? addDays(Math.floor((dayNumber() - 1) / 14) * 14, state.profile.startedAt) : dateKey();
    const goal = state.profile ? state.profile.goal : "travel";
    return window.THAI.plans[goal].map(function (id, i) {
      return {
        lesson: window.THAI.lesson(id),
        date: addDays(i, start),
        today: i === index,
        day: i + 1
      };
    });
  }

  load();

  window.Store = {
    get: function () { return state; },
    dateKey: dateKey,
    dayNumber: dayNumber,
    cycleIndex: cycleIndex,
    todayLesson: todayLesson,
    agenda: agenda,
    isDone: isDone,
    award: award,
    checkInTotal: checkInTotal,
    checkedInToday: checkedInToday,
    grade: grade,
    dueWords: dueWords,
    card: function (id) { return state.srs[id] || null; },
    masteredCount: masteredCount,
    noteListen: noteListen,
    noteSpeak: noteSpeak,
    noteSession: noteSession,
    onboard: onboard,
    setProfile: setProfile,
    toggleOffline: toggleOffline,
    offlineOn: offlineOn,
    markLesson: markLesson,
    lessonSeen: function (id) { return !!state.lessons[id]; },
    accuracy: accuracy,
    reset: reset,
    cycleDays: cycleDays,
    knownCount: function () { return Object.keys(state.srs).length; },
    exportState: function () {
      ensureLedger();
      return JSON.parse(JSON.stringify(state));
    },
    seq: function () { return seq; },
    snapshotPending: snapshotPending,
    consumePending: consumePending,
    settle: settle,
    applyState: applyState,
    phonics: phonicsBag,
    phonicsPass: phonicsPass,
    phonicsMiss: phonicsMiss,
    phonicsGrade: phonicsGrade,
    phonicsDue: phonicsDue,
    phonicsSave: function () { save(); }
  };
})();
