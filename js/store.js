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

  function blank() {
    return {
      profile: null,
      xp: 0,
      streak: { count: 0, last: "" },
      stats: { listenCorrect: 0, listenTotal: 0, speakGood: 0, speakTotal: 0, sessions: 0 },
      srs: {},
      awards: {},
      lessons: {},
      offline: {}
    };
  }

  let state = blank();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) { /* private mode */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      state = Object.assign(blank(), data);
      state.stats = Object.assign(blank().stats, data.stats || {});
      state.streak = Object.assign(blank().streak, data.streak || {});
      state.srs = data.srs || {};
      state.awards = data.awards || {};
      state.lessons = data.lessons || {};
      state.offline = data.offline || {};
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

  function award(key, xp) {
    const today = dateKey();
    state.awards[today] = state.awards[today] || {};
    if (state.awards[today][key]) return 0;
    state.awards[today][key] = true;
    state.xp += xp;
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
    } else {
      card.lapses += 1;
      card.reps = 0;
      card.interval = 0;
      card.ease = Math.max(1.5, card.ease - 0.2);
      card.due = dateKey();
    }
    save();
  }

  function dueWords() {
    const today = dateKey();
    return window.THAI.allWords().filter(function (word) {
      const card = state.srs[word.id];
      return card && card.due <= today;
    });
  }

  function masteredCount() {
    return Object.keys(state.srs).filter(function (id) {
      const card = state.srs[id];
      return card.reps >= 2 && card.interval >= 3;
    }).length;
  }

  function noteListen(ok) {
    state.stats.listenTotal += 1;
    if (ok) state.stats.listenCorrect += 1;
    save();
  }

  function noteSpeak(good) {
    state.stats.speakTotal += 1;
    if (good) state.stats.speakGood += 1;
    save();
  }

  function noteSession() {
    state.stats.sessions += 1;
    save();
  }

  function onboard(draft) {
    state.profile = {
      goal: draft.goal,
      minutes: Number(draft.minutes),
      particle: draft.particle,
      startedAt: dateKey(),
      onboarded: true
    };
    save();
  }

  function setProfile(partial) {
    if (!state.profile) return;
    Object.keys(partial).forEach(function (key) {
      state.profile[key] = partial[key];
    });
    if (partial.minutes) state.profile.minutes = Number(partial.minutes);
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
    save();
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
    knownCount: function () { return Object.keys(state.srs).length; }
  };
})();
