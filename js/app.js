(function () {
  const PEOPLE = {
    male: { state: "ครับ", stateRoman: "khráp", q: "ครับ", qRoman: "khráp", i: "ผม", iRoman: "phǒm" },
    female: { state: "ค่ะ", stateRoman: "khâ", q: "คะ", qRoman: "khá", i: "ฉัน", iRoman: "chǎn" }
  };

  const UI = {
    view: "today",
    nav: "today",
    draft: { goal: "travel", minutes: 25, particle: "both" },
    mix: false,
    session: null,
    talk: null,
    fsiLevel: "A0",
    fsiUnit: 1,
    account: false,
    accountBusy: false,
    accountError: "",
    accountDraft: { username: "", password: "" }
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function particleMode() {
    const profile = Store.get().profile;
    return (profile && profile.particle) || UI.draft.particle || "both";
  }

  function personFor(mode) {
    return mode === "female" ? PEOPLE.female : PEOPLE.male;
  }

  function prefs() {
    return Store.get().profile || UI.draft;
  }

  function fill(str, person) {
    const v = person || personFor(particleMode());
    return String(str || "")
      .split("{p}").join(v.state)
      .split("{q}").join(v.q)
      .split("{i}").join(v.i)
      .split("{pr}").join(v.stateRoman)
      .split("{qr}").join(v.qRoman)
      .split("{ir}").join(v.iRoman);
  }

  function show(text) {
    return esc(fill(text));
  }

  function toneOf(syllable) {
    if (/[ǎěǐǒǔ]/.test(syllable)) return "rising";
    if (/[âêîôû]/.test(syllable)) return "falling";
    if (/[áéíóú]/.test(syllable)) return "high";
    if (/[àèìòù]/.test(syllable)) return "low";
    return "mid";
  }

  function romanHtml(roman) {
    return String(roman || "").split(/(\s+|-|\/)/).map(function (part) {
      if (!part || part === "-" || part === "/" || /^\s+$/.test(part)) return esc(part);
      return '<span class="tone-' + toneOf(part) + '">' + esc(part) + "</span>";
    }).join("");
  }

  function thaiBlock(template, cls) {
    const mode = particleMode();
    const main = fill(template, personFor(mode));
    let html = '<p class="thai ' + (cls || "") + '" lang="th">' + esc(main) + "</p>";
    if (mode === "both" && String(template || "").indexOf("{") >= 0) {
      html += '<p class="thai-alt" lang="th">女性说法 ' + esc(fill(template, PEOPLE.female)) + "</p>";
    }
    return html;
  }

  function romanBlock(template) {
    const mode = particleMode();
    let html = '<p class="roman">' + romanHtml(fill(template, personFor(mode))) + "</p>";
    if (mode === "both" && String(template || "").indexOf("{") >= 0) {
      html += '<p class="roman alt">女性 ' + romanHtml(fill(template, PEOPLE.female)) + "</p>";
    }
    return html;
  }

  function playBtn(template, opts) {
    const o = opts || {};
    const person = o.person === "female" ? PEOPLE.female : o.person === "male" ? PEOPLE.male : undefined;
    const text = fill(o.audio || template, person);
    const cls = o.big ? "speaker" : "btn btn-ghost";
    const label = o.label || (o.big ? "听" : "再听");
    return '<button type="button" class="' + cls + '" data-act="play" data-slow="' + (o.slow ? "1" : "0") + '" data-thai="' + encodeURIComponent(text) + '"><span>' + label + "</span></button>";
  }

  function listenControls(template, big) {
    const mode = particleMode();
    const slow = playBtn(template, { label: "慢速", slow: true, person: mode === "female" ? "female" : "male" });
    if (mode === "both" && template && String(template).indexOf("{") >= 0) {
      return '<div class="row">' + playBtn(template, { person: "male", label: "听男性说法", big: !!big }) + playBtn(template, { person: "female", label: "听女性说法" }) + slow + "</div>";
    }
    return '<div class="row">' + playBtn(template, { big: !!big, label: big ? "听" : "再听" }) + slow + "</div>";
  }

  function contour(tone) {
    const d = {
      mid: "M2 18 H70",
      low: "M2 28 H70",
      falling: "M4 6 C 22 8, 40 24, 68 32",
      high: "M2 8 H70",
      rising: "M4 30 C 26 30, 44 12, 68 6"
    }[tone];
    return '<svg class="contour" viewBox="0 0 72 36" aria-hidden="true"><path d="' + d + '"></path></svg>';
  }

  function toneLegend() {
    const items = [
      ["mid", "中", "平", "มา", "来"],
      ["low", "低", "低而长", "ใหม่", "新"],
      ["falling", "降", "由高到低", "ไม่", "不"],
      ["high", "高", "高而平", "ไม้", "木头"],
      ["rising", "升", "先低后高", "ไหม", "吗"]
    ];
    return '<div class="tone-grid">' + items.map(function (item) {
      return '<button type="button" class="tone-card tone-' + item[0] + '" data-act="play" data-thai="' + encodeURIComponent(item[3]) + '">' +
        contour(item[0]) + "<b>" + item[1] + '</b><span class="thai" lang="th">' + item[3] + "</span><small>" + item[2] + " · " + item[4] + "</small></button>";
    }).join("") + "</div>";
  }

  function goalTitle(id) {
    const found = THAI.goals.filter(function (item) { return item.id === id; })[0];
    return found ? found.title : "";
  }

  function offlineItems() {
    const goal = prefs().goal;
    const third = {
      travel: { id: "price", text: "询问一次价格：อันนี้เท่าไหร่" },
      life: { id: "food", text: "点一次餐，并说明是否要辣" },
      chat: { id: "name", text: "询问对方姓名，并说明自己只会一点点泰语" }
    }[goal];
    return [
      { id: "greet", text: "用 สวัสดี 加上礼貌词，向一个人问候" },
      { id: "repair", text: "听不清时说出：ช่วยพูดช้าๆ ได้ไหม" },
      third
    ];
  }

  function cue(ok) {
    const flash = document.getElementById("flash");
    if (flash) {
      flash.className = "";
      void flash.offsetWidth;
      flash.className = ok ? "is-ok" : "is-bad";
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!cue.ctx) cue.ctx = new AC();
      const ac = cue.ctx;
      if (ac.state === "suspended") ac.resume();
      const now = ac.currentTime;
      const notes = ok
        ? [[523.25, 0, 0.11, 0.07], [659.25, 0.08, 0.12, 0.06], [783.99, 0.16, 0.18, 0.045]]
        : [[196, 0, 0.14, 0.05], [155.56, 0.09, 0.18, 0.04]];
      notes.forEach(function (note) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = ok ? "sine" : "triangle";
        osc.frequency.value = note[0];
        gain.gain.setValueAtTime(0.0001, now + note[1]);
        gain.gain.exponentialRampToValueAtTime(note[3], now + note[1] + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note[1] + note[2]);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + note[1]);
        osc.stop(now + note[1] + note[2] + 0.02);
      });
    } catch (err) {}
  }

  function verdict(ok, title, detail) {
    return '<div class="verdict ' + (ok ? "is-ok" : "is-bad") + '" role="status"><span class="verdict-mark" aria-hidden="true">' +
      (ok ? "✓" : "×") + "</span><div><b>" + esc(title) + "</b><span>" + esc(detail) + "</span></div></div>";
  }

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 4600);
  }

  function accountBar() {
    const session = window.Account && Account.session();
    if (!session) {
      return '<div class="account-bar"><span><b class="account-name">未登录</b><small class="account-status">进度只在本机</small></span><button type="button" data-act="account">登录</button></div>';
    }
    return '<div class="account-bar"><span><b class="account-name">' + esc(session.username) + '</b><small class="account-status">' + esc(Account.statusLabel()) + '</small></span><button type="button" data-act="logout">退出</button></div>';
  }

  function accountModal() {
    if (!UI.account) return "";
    const draft = UI.accountDraft;
    return '<div class="modal-back" data-act="close-account"><form class="modal-card" data-account-form data-act="account-card" autocomplete="on">' +
      '<p class="eyebrow">账号</p><h2>登录后，换设备也能继续</h2>' +
      '<p class="muted">学习进度保存在账号中。在其他设备打开本站，用同一用户名和密码登录，即可看到同一份进度。</p>' +
      '<label class="field">用户名<input id="acct-user" name="username" autocomplete="username" maxlength="20" spellcheck="false" value="' + esc(draft.username) + '"></label>' +
      '<label class="field">密码<input id="acct-pass" name="password" type="password" autocomplete="current-password" maxlength="72" value="' + esc(draft.password) + '"></label>' +
      (UI.accountError ? '<p class="form-error">' + esc(UI.accountError) + "</p>" : "") +
      '<div class="row modal-actions"><button class="btn btn-primary" type="submit">登录</button>' +
      '<button class="btn btn-ghost" type="button" data-act="signup">注册</button>' +
      '<button class="btn btn-ghost" type="button" data-act="close-account">取消</button></div>' +
      '<p class="hint">请先注册，再用同一用户名在其他设备登录。退出后，这台设备仍保留当前进度，但不再继续同步。</p></form></div>';
  }

  function sidebar() {
    const items = [
      ["today", "今日", "本日安排"],
      ["plan", "计划", "十四天"],
      ["levels", "分级", "五级"],
      ["words", "单词", "分课"],
      ["listen", "听音", "听辨"],
      ["sentence", "听句", "先译后选"],
      ["speak", "开口", "看中文说"],
      ["talk", "对话", "接续"],
      ["review", "复习", "到期"],
      ["method", "方法", "说明"]
    ];
    const streak = Store.get().streak.count;
    return '<aside class="sidebar">' +
      '<button type="button" class="brand" data-act="play" data-thai="' + encodeURIComponent("ได้ยิน") + '">' +
      '<span class="brand-kicker">先听懂，再开口</span>' +
      '<span class="brand-name" lang="th">ได้ยิน</span>' +
      '<span class="brand-sub">泰语听说</span></button>' +
      '<nav class="nav" aria-label="学习">' +
      items.map(function (item) {
        return '<button type="button" class="nav-btn' + (UI.nav === item[0] ? " is-on" : "") + '" data-act="nav" data-view="' + item[0] + '"><span>' + item[1] + "</span><small>" + item[2] + "</small></button>";
      }).join("") +
      "</nav>" +
      accountBar() +
      '<p class="nav-meta">连续 ' + streak + " 天 · " + Store.get().xp + " 分</p></aside>";
  }

  function shell(content) {
    return '<div class="shell">' + sidebar() + '<main class="main"><div class="wrap">' + content + "</div></main></div>";
  }

  function statsRow() {
    const acc = Store.accuracy();
    return '<div class="stats">' +
      '<div class="stat"><b>' + Store.get().streak.count + "</b><span>连续天数</span></div>" +
      '<div class="stat"><b>' + (acc == null ? "—" : acc + "%") + "</b><span>听辨正确</span></div>" +
      '<div class="stat"><b>' + Store.knownCount() + "</b><span>听过的词</span></div>" +
      '<div class="stat"><b>' + Store.dueWords().length + "</b><span>到期要复习</span></div></div>";
  }

  function prefPicks() {
    const cur = prefs();
    const minutes = [
      [15, "15 分钟", "只完成一节听说课"],
      [25, "25 分钟", "课后加一段对话"],
      [40, "40 分钟", "再复习到期的词"]
    ];
    const particles = [
      ["male", "我是男生", "句尾用 ครับ"],
      ["female", "我是女生", "陈述用 ค่ะ，问句用 คะ"],
      ["both", "两种都练习", "示范同时给出两种说法"]
    ];
    return '<div class="stack">' +
      '<div><p class="eyebrow">学习目的</p><div class="picks">' +
      THAI.goals.map(function (goal) {
        return '<button type="button" class="pick' + (cur.goal === goal.id ? " is-on" : "") + '" data-act="pref" data-field="goal" data-val="' + goal.id + '"><strong>' + esc(goal.title) + "</strong><span>" + esc(goal.text) + "</span></button>";
      }).join("") + "</div></div>" +
      '<div><p class="eyebrow">每天的时间</p><div class="picks picks-3">' +
      minutes.map(function (item) {
        return '<button type="button" class="pick' + (Number(cur.minutes) === item[0] ? " is-on" : "") + '" data-act="pref" data-field="minutes" data-val="' + item[0] + '"><strong>' + item[1] + "</strong><span>" + item[2] + "</span></button>";
      }).join("") + "</div></div>" +
      '<div><p class="eyebrow">开口时使用的礼貌词</p><div class="picks picks-3">' +
      particles.map(function (item) {
        return '<button type="button" class="pick' + (cur.particle === item[0] ? " is-on" : "") + '" data-act="pref" data-field="particle" data-val="' + item[0] + '"><strong>' + item[1] + "</strong><span>" + esc(item[2]) + "</span></button>";
      }).join("") + "</div></div></div>";
  }

  function viewOnboard() {
    return '<section class="onboard"><div class="onboard-copy">' +
      '<p class="eyebrow">ได้ยิน · 泰语听说</p>' +
      '<h1 lang="th">ได้ยิน</h1>' +
      '<p class="lead">先听清声调，再用完整的句子与本地人交谈。字母可以稍后学习。今天应能说出「你好」「听不懂」和「这个多少钱」。</p>' +
      toneLegend() +
      "</div><div class=\"onboard-form\"><h2>确定十四天的安排</h2>" +
      prefPicks() +
      '<button type="button" class="btn btn-primary" data-act="onboard">按此开始十四天</button>' +
      '<p class="hint">未登录时，进度只保存在本机浏览器中。登录后，换设备用同一账号即可继续。礼貌词以后可在计划中修改。</p>' +
      '<button type="button" class="btn btn-ghost" data-act="account">登录或注册</button></div></section>';
  }

  function viewToday() {
    const lesson = Store.todayLesson();
    const sentence = lesson.sentences[0];
    const goal = Store.get().profile.goal;
    const tasks = Store.agenda().map(function (task) {
      const done = Store.isDone(task.id);
      return '<article class="task' + (done ? " is-done" : "") + '"><div><p class="eyebrow">' + esc(task.kicker) + " · " + task.minutes + " 分钟</p><h3>" + esc(task.title) + '</h3><p class="muted">' + esc(task.detail) + "</p></div>" +
        '<button type="button" class="btn ' + (done ? "btn-ghost" : "btn-primary") + '" data-act="start-task" data-id="' + task.id + '">' + (done ? "再做一次" : "开始") + "</button></article>";
    }).join("");
    const checks = offlineItems().map(function (item) {
      return '<button type="button" class="check' + (Store.offlineOn(item.id) ? " is-on" : "") + '" data-act="tick" data-id="' + item.id + '"><span class="box"></span><span>' + esc(item.text) + "</span></button>";
    }).join("");
    return '<header class="page-head"><p class="eyebrow">第 ' + Store.dayNumber() + " 天 · " + esc(goalTitle(goal)) + "</p><h1>" + esc(lesson.promise) + '</h1><p class="lead">' + esc(lesson.blurb) + "</p></header>" +
      statsRow() +
      '<div class="today-grid"><div class="stack"><h2>今天</h2>' + tasks +
      '<section class="card"><h2>若今天有机会开口</h2><p class="muted">下面三句用于真实交谈。完成后可作标记。</p>' + checks + "</section></div>" +
      '<div class="stack"><article class="quote-card"><p class="eyebrow">今日一句 · ' + esc(lesson.title) + '</p><p class="zh zh-lg">' + esc(sentence.zh) + "</p>" +
      listenControls(sentence.thai, true) + thaiBlock(sentence.thai, "thai-lg") + romanBlock(sentence.roman) +
      (sentence.note ? '<p class="hint">' + show(sentence.note) + "</p>" : "") +
      "</article><p class=\"hint\">" + esc(THAI.planNotes[goal]) + "</p></div></div>";
  }

  function viewPlan() {
    const rows = Store.cycleDays().map(function (day) {
      return '<button type="button" class="plan-row' + (day.today ? " is-today" : "") + '" data-act="goto-lesson" data-id="' + day.lesson.id + '">' +
        '<span class="day-no" lang="th">' + day.lesson.no + "</span><span><strong>第 " + day.day + " 天 · " + esc(day.lesson.title) + "</strong><small>" +
        esc(day.date) + (day.today ? " · 今天" : "") + "</small></span></button>";
    }).join("");
    return '<header class="page-head"><p class="eyebrow">计划</p><h1>十四天，只练习听和说</h1><p class="lead">计划按学习目的排课，不按字母表。点某一天可回到该课。更改目的后，从今天起调整顺序；已经听过的内容仍然保留。</p></header>' +
      prefPicks() + '<div class="plan-list">' + rows + "</div>";
  }

  function fsiUnits(levelId) {
    return (window.FSI ? FSI.units : []).filter(function (unit) { return unit.level === levelId; });
  }

  function fsiLine(line) {
    return '<article class="task"><div>' + thaiBlock(line.thai) + romanBlock(line.roman) +
      (line.en ? '<p class="muted">原课文：' + esc(line.en) + "</p>" : "") +
      "</div>" + listenControls(line.thai) + "</article>";
  }

  function viewLevels() {
    if (!window.FSI) {
      return '<header class="page-head"><h1>分级课程没有载入</h1><p class="lead">请刷新页面。若仍没有，说明课程文件没有随网页一起打开。</p></header>';
    }
    const tones = FSI.tones.slice(0, 4).map(function (text) { return "<p>" + esc(text) + "</p>"; }).join("");
    const cards = FSI.levels.map(function (level) {
      const units = fsiUnits(level.id);
      const done = units.filter(function (unit) { return Store.lessonSeen("fsi-" + unit.n); }).length;
      return '<button type="button" class="pick" data-act="fsi-level" data-id="' + level.id + '"><strong>' + esc(level.id) + " · " + esc(level.title) + "</strong><span>" +
        esc(level.range) + " · " + esc(level.days) + " · 已学 " + done + " / " + units.length + "</span></button>";
    }).join("");
    return '<header class="page-head"><p class="eyebrow">分级</p><h1>按五段学习四十课</h1><p class="lead">这一套不取代十四天听说计划。十四天仍从「今日」进入。分级按课文难度排列，原课程本身没有 A0 到 B2 的标记。</p></header>' +
      '<div class="stack"><section class="card"><h2>声调</h2>' + tones +
      '<button type="button" class="btn btn-primary" data-act="start-session" data-mode="lesson" data-lesson="tones">听辨声调</button></section>' +
      '<div><p class="eyebrow">学习计划</p><div class="picks">' + cards + "</div></div>" +
      '<section class="card"><h2>课文从哪里来</h2><p>' + esc(FSI.tones[4]) + "</p></section></div>";
  }

  function viewFsiLevel() {
    const level = FSI.levels.filter(function (item) { return item.id === UI.fsiLevel; })[0] || FSI.levels[0];
    const units = fsiUnits(level.id);
    let day = level.id === "A0" ? 2 : 1;
    const rows = [];
    if (level.id === "A0") {
      rows.push('<button type="button" class="plan-row" data-act="start-session" data-mode="lesson" data-lesson="tones"><span class="day-no">1</span><span><strong>五个声调</strong><small>先听辨，再进入课文</small></span></button>');
    }
    units.forEach(function (unit) {
      const seen = Store.lessonSeen("fsi-" + unit.n);
      rows.push('<button type="button" class="plan-row' + (seen ? " is-done" : "") + '" data-act="fsi-unit" data-n="' + unit.n + '"><span class="day-no">' + day + "</span><span><strong>第 " +
        unit.n + " 课 · " + esc(unit.zh) + "</strong><small>" + (seen ? "已学" : "未学") +
        (unit.sourceTitle ? " · " + esc(unit.sourceTitle) : "") + "</small></span></button>");
      day += 1;
    });
    const review = level.id === "A0"
      ? '<section class="card"><h2>第 ' + day + ' 天 · 复习</h2><p>把第 1–4 课的课文各跟读一遍。听不清的词须回到该课词表。</p></section>'
      : "";
    return '<header class="page-head"><p class="eyebrow">' + esc(level.id) + " · " + esc(level.days) + '</p><h1>' + esc(level.title) + '</h1><p class="lead">' + esc(level.can) + '</p></header>' +
      '<button type="button" class="btn btn-ghost" data-act="nav" data-view="levels">返回分级</button>' +
      '<div class="plan-list">' + rows.join("") + "</div>" + review;
  }

  function viewFsiUnit() {
    const unit = FSI.units.filter(function (item) { return item.n === UI.fsiUnit; })[0];
    if (!unit) return '<header class="page-head"><h1>没有这一课</h1></header><button type="button" class="btn btn-ghost" data-act="nav" data-view="levels">返回分级</button>';
    const seen = Store.lessonSeen("fsi-" + unit.n);
    const dialog = unit.dialog.length
      ? unit.dialog.map(fsiLine).join("")
      : '<p class="hint">这一课在原页是连贯短文，或原页没有载入对白。完整课文须打开原课收听。</p>';
    const vocab = unit.vocab.length
      ? unit.vocab.map(function (word) {
        return '<details class="word"><summary><span class="thai" lang="th">' + esc(word.thai) + "</span><span>" + esc(word.en || "") + "</span></summary><div class=\"word-body\">" +
          romanBlock(word.roman) + listenControls(word.thai) + "</div></details>";
      }).join("")
      : '<p class="hint">这一课的词表须在原课查看。</p>';
    const prev = unit.n > 1 ? '<button type="button" class="btn btn-ghost" data-act="fsi-unit" data-n="' + (unit.n - 1) + '">上一课</button>' : "";
    const next = unit.n < FSI.units.length ? '<button type="button" class="btn btn-ghost" data-act="fsi-unit" data-n="' + (unit.n + 1) + '">下一课</button>' : "";
    return '<header class="page-head"><p class="eyebrow">' + esc(unit.level) + " · 第 " + unit.n + ' 课</p><h1>' + esc(unit.zh) + '</h1><p class="lead">' + esc(unit.aim) + "</p></header>" +
      '<div class="row"><button type="button" class="btn btn-ghost" data-act="fsi-level" data-id="' + unit.level + '">返回本级</button>' +
      '<button type="button" class="btn ' + (seen ? "btn-ghost" : "btn-primary") + '" data-act="fsi-done" data-n="' + unit.n + '">' + (seen ? "已记入进度" : "记入进度") + "</button>" +
      '<a class="btn btn-ghost" href="' + esc(unit.url) + '" target="_blank" rel="noopener">打开原课</a></div>' +
      (unit.sourceTitle ? '<p class="hint">原课标题：' + esc(unit.sourceTitle) + "</p>" : "") +
      '<section class="stack"><h2>课文</h2>' + dialog + "</section>" +
      '<section class="stack"><h2>配套词汇</h2><p class="muted">每课只收一组。词义为原课文英文。</p>' + vocab + "</section>" +
      '<div class="row">' + prev + next + "</div>";
  }

  function wordMark(id) {
    const card = Store.card(id);
    if (!card) return "";
    if (card.reps >= 2 && card.interval >= 3) return '<span class="pill good">已掌握</span>';
    if (card.due <= Store.dateKey()) return '<span class="pill warn">到期</span>';
    return '<span class="pill">听过</span>';
  }

  function viewWords() {
    const blocks = THAI.lessons.map(function (lesson) {
      const words = lesson.words.map(function (word) {
        return '<details class="word"><summary><span class="thai" lang="th">' + esc(word.thai) + "</span><span>" + esc(word.zh) + "</span>" + wordMark(word.id) + "</summary>" +
          '<div class="word-body">' + romanBlock(word.roman) +
          (word.tone ? '<p class="muted">声调 · ' + esc(word.tone) + "</p>" : "") +
          (word.tip ? '<p class="hint">' + show(word.tip) + "</p>" : "") +
          listenControls(word.thai) + "</div></details>";
      }).join("");
      return '<section class="card" id="lesson-' + lesson.id + '"><div class="between"><div><p class="eyebrow">' + lesson.no + (Store.lessonSeen(lesson.id) ? " · 听过" : "") + "</p><h2>" + esc(lesson.title) + "</h2><p class=\"muted\">" + esc(lesson.promise) + '</p></div>' +
        '<button type="button" class="btn btn-primary" data-act="start-session" data-mode="lesson" data-lesson="' + lesson.id + '"' +
        (Store.todayLesson().id === lesson.id ? ' data-task="lesson"' : "") + ">进入本课</button></div>" + words + "</section>";
    }).join("");
    return '<header class="page-head"><p class="eyebrow">单词</p><h1>先听，再记词</h1><p class="lead">每课先学习一小部分。其余安排在听辨和复习中，不必一次记完。</p></header><div class="stack">' + blocks + "</div>";
  }

  function launcher(mode, title, lead) {
    const lessonId = UI.mix ? "" : Store.todayLesson().id;
    return '<header class="page-head"><p class="eyebrow">练习</p><h1>' + title + '</h1><p class="lead">' + lead + "</p></header>" +
      '<div class="launcher">' +
      '<div class="segment" role="group" aria-label="练习范围">' +
      '<button type="button" class="btn ' + (UI.mix ? "btn-ghost" : "btn-primary") + '" data-act="mix" data-val="0">今天这一课</button>' +
      '<button type="button" class="btn ' + (UI.mix ? "btn-primary" : "btn-ghost") + '" data-act="mix" data-val="1">八课混合</button></div>' +
      '<button type="button" class="btn btn-primary" data-act="start-session" data-mode="' + mode + '" data-lesson="' + lessonId + '">开始</button></div>' +
      (mode === "speak" ? '<p class="hint">麦克风仅供参考。须通过 localhost 打开，并允许使用麦克风。无法识别时，听完示范后自行判断即可。</p>' : "");
  }

  function viewListen() {
    return launcher("listen", "听音识意", "不看文字，只听声音，从四个意思中选择。声调接近的词会互相干扰，以便区分。");
  }

  function viewSentence() {
    return launcher("sentence", "听句翻译", "先听完整句，在心里译成中文，再查看选项。选择之后再跟读一遍。翻译正确之后，还须说得顺畅。");
  }

  function viewSpeak() {
    return launcher("speak", "开口", "屏幕上只有中文。先自己说，需要时再听示范、查看罗马音。是否说得顺畅，由自己判断。");
  }

  function viewReview() {
    const due = Store.dueWords();
    const task = Store.agenda().some(function (item) { return item.id === "review"; }) ? "review" : "";
    const list = due.slice(0, 12).map(function (word) {
      return "<li><span class=\"thai\" lang=\"th\">" + esc(word.thai) + "</span> " + esc(word.zh) + "</li>";
    }).join("");
    return '<header class="page-head"><p class="eyebrow">复习</p><h1>' + (due.length ? due.length + " 个词今天到期" : "今天没有到期的词") + '</h1><p class="lead">听对的词间隔更久才再次出现。听错的仍留在今天。新词从明天起进入复习。中断一天，也不会一次堆积过多。</p></header>' +
      (list ? "<ul class=\"due-list\">" + list + "</ul>" : "") +
      '<button type="button" class="btn btn-primary" data-act="start-session" data-mode="review" data-task="' + task + '">' + (due.length ? "开始复习" : "练习声调听辨") + "</button>";
  }

  function viewMethod() {
    return '<header class="page-head"><p class="eyebrow">方法</p><h1>先留下能够说出口的部分</h1><p class="lead">本站只练习听和说。泰文始终可见，但不作为第一关。</p></header>' +
      '<div class="stack">' +
      '<section class="card"><h2>从现有课程中保留的做法</h2><ul class="tips">' +
      "<li>Pimsleur：先听意思，再开口。文字靠后。练习单位是完整句子。</li>" +
      "<li>Glossika：听辨以句子为单位。市场里，对方不会等候把一个词想完。</li>" +
      "<li>间隔重复：听错的词留在当天，听对的词隔几天才再次出现。</li>" +
      "<li>教师常纠正的三点：声调、句尾礼貌词，以及没听懂时不要装作已经听懂。</li></ul></section>" +
      '<section class="card"><h2>本站不采用的做法</h2><ul class="tips">' +
      "<li>连续天数不作惩罚。中断后从当天继续。</li>" +
      "<li>不先教整套字母。字母不能代替出租车上没有听清的那一句。</li>" +
      "<li>不用选择题代替开口。听句之后须跟读。开口练习默认不显示泰文。</li>" +
      "<li>词义正确不等于能够交谈。若缺少礼貌词，或尚未问价就开始议价，对方难以回应。</li></ul></section>" +
      '<section class="card"><h2>内容来源</h2><p>八课都是入门阶段的常用语音：五个声调的最小对立（ไม่ / ใหม่ / ไม้ / ไหม，มา / ม้า / หมา）、ครับ / ค่ะ / คะ、数字和铢、点餐、左右和停车、市场里的「每件多少」，以及没听懂时如何说明。</p>' +
      "<p>这些句子反复出现在口语课和旅行生活中，不是考试词表。罗马音标注声调和送气。以听感和泰文为准，罗马音只作辅助。</p>" +
      toneLegend() +
      "<ul class=\"tips\"><li>à 为低，â 为降，á 为高，ǎ 为升，没有符号表示中平。</li><li>bp、dt 不送气。kh、ph、th 送气。th 不是英语的 th。</li><li>女性问句用 คะ，陈述用 ค่ะ。二者声调不同。</li></ul></section>" +
      '<section class="card"><h2>如何用于和本地人交谈</h2><ul class="tips">' +
      "<li>外出前只听「常用句」中的一组，不必临时翻完整课。</li>" +
      "<li>第一句用 สวัสดี，并加上礼貌词。</li>" +
      "<li>没有听懂时说 ไม่เข้าใจ ช่วยพูดช้าๆ，不宜点头表示已经明白。</li>" +
      "<li>地名和价格听不清时，说 ช่วยเขียนให้หน่อย。</li>" +
      "<li>受到称赞时，先说 ไม่เก่ง พูดได้นิดหน่อย。</li></ul>" +
      '<button type="button" class="btn btn-ghost" data-act="nav" data-view="talk">查看情景和常用句</button></section>' +
      '<section class="card"><h2>分级课文</h2><p>侧栏「分级」另有四十课，取自美国外交学院《泰语基础教程》。课文按 A0 到 B2 分成五段，每天一课。十四天听说计划仍然保留。</p>' +
      '<button type="button" class="btn btn-ghost" data-act="nav" data-view="levels">打开分级</button></section>' +
      '<section class="card"><h2>语音</h2><p>系统有泰语语音时使用本机发音，否则使用在线发音，需要网络。语音识别不作评分。识别经常出错，因此每题都可以自行标记「已经说顺」。</p>' +
      '<p class="hint">直接双击网页时，麦克风可能不可用。请双击 start.bat，再用浏览器打开 http://localhost:8765 。</p></section>' +
      '<section class="card"><h2>账号与进度</h2><p>登录后，学习进度保存在账号中。换一台设备，打开本站并登录同一用户名，即可继续。未登录时，进度只保存在本机浏览器中。</p>' +
      '<p class="hint">清空时，若另一台设备仍留有未同步的记录，下次同步会合并回来，以免进度丢失。</p>' +
      '<button type="button" class="btn btn-ghost" data-act="reset">清空学习记录</button></section></div>';
  }

  function slicePage(arr, page, size) {
    if (!arr || !arr.length) return [];
    const pages = Math.ceil(arr.length / size);
    const p = Math.min(page, Math.max(0, pages - 1));
    return arr.slice(p * size, p * size + size);
  }

  function withOptions(type, item) {
    const options = (item.options || []).map(function (opt) {
      if (typeof opt === "string") return { zh: opt, ok: opt === item.zh };
      return opt;
    });
    return { type: type, item: Object.assign({}, item, { options: options }) };
  }

  function flatten(key, lesson) {
    const pool = lesson ? [lesson] : THAI.lessons;
    const list = [];
    pool.forEach(function (item) {
      item[key].forEach(function (row) { list.push(row); });
    });
    return list;
  }

  function reviewQuestions() {
    const allZh = THAI.allWords().map(function (word) { return word.zh; });
    return Store.dueWords().slice(0, 10).map(function (word) {
      const mates = THAI.allWords().filter(function (item) {
        return item.confuse && item.confuse === word.confuse && item.id !== word.id;
      }).map(function (item) { return item.zh; });
      const uniq = [];
      [word.zh].concat(mates).forEach(function (zh) {
        if (uniq.indexOf(zh) < 0) uniq.push(zh);
      });
      const pool = shuffle(allZh.filter(function (zh) { return uniq.indexOf(zh) < 0; }));
      while (uniq.length < 4 && pool.length) uniq.push(pool.pop());
      return {
        thai: word.thai,
        roman: word.roman,
        zh: word.zh,
        wordId: word.id,
        options: shuffle(uniq.slice(0, 4).map(function (zh) { return { zh: zh, ok: zh === word.zh }; }))
      };
    });
  }

  function hasNextPage(lesson, page) {
    const size = { words: 5, listens: 5, sentences: 3, speaks: 2 };
    return ["words", "listens", "sentences", "speaks"].some(function (key) {
      return lesson[key].length > (page + 1) * size[key];
    });
  }

  function makeSteps(mode, lesson, page) {
    if (mode === "review") {
      const questions = reviewQuestions();
      if (!questions.length) return [{ type: "empty-review" }];
      return questions.map(function (item) { return { type: "listen", item: item }; }).concat([{ type: "summary" }]);
    }
    if (mode === "listen") {
      return shuffle(flatten("listens", lesson)).slice(0, 8).map(function (item) {
        return withOptions("listen", item);
      }).concat([{ type: "summary" }]);
    }
    if (mode === "sentence") {
      return shuffle(flatten("sentences", lesson)).slice(0, 6).map(function (item) {
        return withOptions("sentence", item);
      }).concat([{ type: "summary" }]);
    }
    if (mode === "speak") {
      return shuffle(flatten("speaks", lesson)).slice(0, 6).map(function (item) {
        return { type: "speak", item: item };
      }).concat([{ type: "summary" }]);
    }
    return [{ type: "intro", lesson: lesson, page: page }]
      .concat(slicePage(lesson.words, page, 5).map(function (item) { return { type: "word", item: item }; }))
      .concat(slicePage(lesson.listens, page, 5).map(function (item) { return withOptions("listen", item); }))
      .concat(slicePage(lesson.sentences, page, 3).map(function (item) { return withOptions("sentence", item); }))
      .concat(slicePage(lesson.speaks, page, 2).map(function (item) { return { type: "speak", item: item }; }))
      .concat([{ type: "summary" }]);
  }

  function armAutoplay() {
    const step = UI.session.steps[UI.session.i];
    if (!step || !step.item) return;
    if (step.type === "listen" || step.type === "sentence" || step.type === "word") {
      UI.session.autoplay = fill(step.item.audio || step.item.thai);
    }
  }

  function startSession(mode, lessonId, taskId, page) {
    Speech.stop();
    const lesson = lessonId ? THAI.lesson(lessonId) : null;
    UI.session = {
      mode: mode,
      lessonId: lessonId || null,
      taskId: taskId || null,
      page: page || 0,
      steps: makeSteps(mode, lesson, page || 0),
      i: 0,
      correct: 0,
      total: 0,
      choiceFor: -1,
      choices: null,
      locked: false,
      picked: null,
      showChoices: true,
      peek: "",
      heard: "",
      score: null,
      finished: false,
      gained: 0,
      saved: false,
      selfNote: "",
      listening: false,
      autoplay: null
    };
    UI.view = "session";
    UI.talk = null;
    armAutoplay();
    draw();
  }

  function ensureChoices() {
    const s = UI.session;
    const step = s.steps[s.i];
    if (!step || !step.item || !step.item.options) return;
    if (s.choiceFor !== s.i) {
      s.choices = shuffle(step.item.options.slice());
      s.choiceFor = s.i;
      s.locked = false;
      s.picked = null;
      s.showChoices = step.type !== "sentence";
    }
  }

  function stepHead(label, index, total) {
    const pct = total <= 1 ? 100 : Math.round(index / (total - 1) * 100);
    return '<div class="session-top"><div class="between"><span class="eyebrow">' + label + '</span><span class="muted">' + (index + 1) + " / " + total + '</span></div><div class="bar"><span style="width:' + pct + '%"></span></div></div>';
  }

  function viewIntro(step) {
    const lesson = step.lesson;
    return '<section class="card"><p class="eyebrow">' + lesson.no + " · " + esc(lesson.title) + (step.page ? " · 下一组" : "") + "</p><h2>" + esc(lesson.promise) + "</h2><ul class=\"tips\">" +
      lesson.tips.map(function (tip) { return "<li>" + esc(tip) + "</li>"; }).join("") +
      "</ul>" + (lesson.id === "tones" ? toneLegend() : "") +
      '<button type="button" class="btn btn-primary" data-act="next">开始听</button></section>';
  }

  function viewWord(step, index, total) {
    const word = step.item;
    return '<section class="card">' + stepHead("单词", index, total) + listenControls(word.thai, true) +
      thaiBlock(word.thai, "thai-xl") + romanBlock(word.roman) +
      '<p class="zh zh-lg">' + esc(word.zh) + "</p>" +
      (word.tone ? '<p class="muted">声调 · ' + esc(word.tone) + "</p>" : "") +
      (word.tip ? '<p class="hint">' + show(word.tip) + "</p>" : "") +
      '<div class="row"><button type="button" class="btn btn-primary" data-act="word-next" data-ok="1" data-id="' + word.id + '">已经记住</button>' +
      '<button type="button" class="btn btn-ghost" data-act="word-next" data-ok="0" data-id="' + word.id + '">尚未掌握</button></div></section>';
  }

  function viewChoice(step, index, total, label) {
    const item = step.item;
    const s = UI.session;
    const locked = !!s.locked;
    const right = locked && s.picked != null && s.choices[s.picked] && s.choices[s.picked].ok;
    let choices = "";
    if (step.type === "listen" || s.showChoices) {
      choices = '<div class="choices">' + s.choices.map(function (opt, i) {
        let cls = "choice";
        let mark = String(i + 1);
        if (locked && opt.ok) { cls += " is-right"; mark = "✓"; }
        if (locked && s.picked === i && !opt.ok) { cls += " is-wrong"; mark = "×"; }
        return '<button type="button" class="' + cls + '" data-act="choose" data-ok="' + (opt.ok ? "1" : "0") + '" data-idx="' + i + '" data-keyn="' + (i + 1) + '"' + (locked ? " disabled" : "") + '><span class="choice-key">' + mark + "</span><span>" + esc(opt.zh) + "</span></button>";
      }).join("") + "</div>";
    } else {
      choices = '<button type="button" class="btn btn-primary" data-act="reveal-choices">译完了，查看选项</button>';
    }
    const prompt = step.type === "sentence" ? "先听完整句，在心里译成中文，再查看选项。" : "先不看文字。听到的是哪个意思？";
    let reveal = "";
    if (locked) {
      reveal = verdict(right, right ? "正确" : "不正确", right ? "这句听对了。" : "正确项已标出，请再听一遍。") +
        '<div class="reveal">' +
        thaiBlock(item.thai, "thai-lg") + romanBlock(item.roman) + '<p class="zh">' + esc(item.zh) + "</p>" +
        (item.note ? '<p class="hint">' + show(item.note) + "</p>" : "") +
        (step.type === "sentence" ? '<div class="row"><button type="button" class="btn btn-ghost" data-act="self" data-level="2">跟读已顺</button><button type="button" class="btn btn-ghost" data-act="self" data-level="1">还需再跟</button></div>' : "") +
        (s.selfNote ? '<p class="hint">' + esc(s.selfNote) + "</p>" : "") +
        '<button type="button" class="btn btn-primary" data-act="next">' + (step.type === "sentence" ? "下一句" : "继续") + "</button></div>";
    }
    return '<section class="card' + (locked ? (right ? " is-ok" : " is-bad") : "") + '">' + stepHead(label, index, total) + '<p class="lead">' + prompt + "</p>" +
      listenControls(item.thai, true) + choices + ((step.type === "listen" || s.showChoices) ? '<p class="muted keyhint">键盘 1–4</p>' : "") + reveal + "</section>";
  }

  function viewSpeakStep(step, index, total) {
    const item = step.item;
    const s = UI.session;
    let extra = "";
    if (s.peek === "roman" || s.peek === "thai") extra += romanBlock(item.roman);
    if (s.peek === "thai") extra += thaiBlock(item.thai, "thai-lg");
    const heard = s.heard ? '<p class="hint">识别到：' + esc(s.heard) + "。与关键词大约重合 " + s.score + "%。识别经常不准，请以对照示范后的判断为准。</p>" : "";
    return '<section class="card">' + stepHead("开口", index, total) + '<p class="eyebrow">看中文，自己说出</p><p class="zh zh-lg">' + esc(item.zh) + "</p>" +
      '<div class="row"><button type="button" class="btn btn-primary" data-act="mic">' + (s.listening ? "正在听…" : "我来说") + "</button>" +
      playBtn(item.thai, { label: "听示范" }) + playBtn(item.thai, { label: "慢速", slow: true }) + "</div>" +
      '<div class="row"><button type="button" class="btn btn-ghost btn-small" data-act="peek" data-level="roman">看罗马音</button>' +
      '<button type="button" class="btn btn-ghost btn-small" data-act="peek" data-level="thai">看泰文</button></div>' +
      extra + heard + (s.selfNote ? '<p class="hint">' + esc(s.selfNote) + "</p>" : "") +
      '<div class="row"><button type="button" class="btn btn-primary" data-act="self" data-level="2">已经说顺</button>' +
      '<button type="button" class="btn btn-ghost" data-act="self" data-level="1">尚未说顺</button>' +
      '<button type="button" class="btn btn-ghost" data-act="next">下一题</button></div></section>';
  }

  function summaryCopy(correct, total) {
    if (!total) return "这一组以跟读为主。听过的词从明天起进入复习。";
    const n = Math.round(100 * correct / total);
    if (n >= 85) return "听辨已经稳定。听错的几句再跟读一次即可。";
    if (n >= 60) return "大意已经掌握。声调接近的词，宜单独再听一轮。";
    return "这一组内容较多。可回到单词，只听不看字，每个听三遍。";
  }

  function viewSummary() {
    const s = UI.session;
    const lesson = s.lessonId ? THAI.lesson(s.lessonId) : null;
    const more = s.mode === "lesson" && lesson && hasNextPage(lesson, s.page);
    const pct = s.total ? Math.round(100 * s.correct / s.total) : null;
    return '<section class="card summary"><p class="eyebrow">这一组</p><h2>' + (pct == null ? "跟读已完成" : pct + "% 听对") + '</h2><p class="lead">' + summaryCopy(s.correct, s.total) + "</p>" +
      (s.finished ? '<p class="hint">' + (s.gained ? "今天 +" + s.gained : "这一组今天已经记过。再做一次仍然有用。") + "</p>" : "") +
      '<div class="row">' +
      (s.finished ? "" : '<button type="button" class="btn btn-primary" data-act="finish-session">记入今日</button>') +
      (more ? '<button type="button" class="btn btn-ghost" data-act="next-page">本节还有下一组</button>' : "") +
      '<button type="button" class="btn btn-ghost" data-act="nav" data-view="today">回到今日</button></div></section>';
  }

  function viewEmptyReview() {
    const task = UI.session.taskId === "review" ? "review" : "";
    return '<section class="card"><p class="eyebrow">复习</p><h2>今天没有到期的词</h2><p class="lead">新词从明天起进入复习。若要完成今天的复习，可再听一组声调。</p>' +
      '<button type="button" class="btn btn-primary" data-act="start-session" data-mode="listen" data-lesson="tones" data-task="' + task + '">做一组声调听辨</button></section>';
  }

  function viewSession() {
    const s = UI.session;
    ensureChoices();
    const step = s.steps[s.i];
    const names = { lesson: "听说课", listen: "听音识意", sentence: "听句翻译", speak: "开口", review: "复习" };
    let body = "";
    if (step.type === "intro") body = viewIntro(step);
    else if (step.type === "word") body = viewWord(step, s.i, s.steps.length);
    else if (step.type === "listen") body = viewChoice(step, s.i, s.steps.length, "听音识意");
    else if (step.type === "sentence") body = viewChoice(step, s.i, s.steps.length, "听句翻译");
    else if (step.type === "speak") body = viewSpeakStep(step, s.i, s.steps.length);
    else if (step.type === "empty-review") body = viewEmptyReview();
    else body = viewSummary();
    const lesson = s.lessonId ? THAI.lesson(s.lessonId) : null;
    return '<div class="stack"><div class="between"><p class="eyebrow">' + names[s.mode] + (lesson ? " · " + esc(lesson.title) : "") + '</p>' +
      '<button type="button" class="btn btn-ghost btn-small" data-act="nav" data-view="' + (UI.nav || "today") + '">返回</button></div>' + body + "</div>";
  }

  function pumpLocal() {
    const dialogue = THAI.dialogue(UI.talk.id);
    while (UI.talk.cursor < dialogue.lines.length && dialogue.lines[UI.talk.cursor].who === "local") {
      const line = dialogue.lines[UI.talk.cursor];
      UI.talk.log.push({ who: "local", thai: line.thai, roman: line.roman, zh: line.zh });
      UI.talk.cursor += 1;
      UI.talk.autoplay = line.thai;
    }
  }

  function openTalk(id) {
    Speech.stop();
    UI.talk = {
      id: id,
      cursor: 0,
      log: [],
      done: false,
      bad: {},
      repaired: false,
      hold: false,
      optFor: -1,
      options: null,
      saved: false,
      gained: 0,
      autoplay: null
    };
    UI.session = null;
    UI.view = "talk";
    UI.nav = "talk";
    pumpLocal();
    draw();
  }

  function youOptions() {
    const dialogue = THAI.dialogue(UI.talk.id);
    const line = dialogue.lines[UI.talk.cursor];
    if (!line || line.who !== "you" || UI.talk.hold || UI.talk.done) return [];
    if (UI.talk.optFor !== UI.talk.cursor) {
      UI.talk.options = shuffle(line.options.map(function (opt, i) {
        return Object.assign({}, opt, { _i: i });
      }));
      UI.talk.optFor = UI.talk.cursor;
      UI.talk.bad = {};
      UI.talk.repaired = false;
    }
    return UI.talk.options;
  }

  function viewTalk() {
    if (!UI.talk) {
      const todayId = Store.todayLesson().dialogueId;
      const scenes = THAI.dialogues.map(function (dialogue) {
        return '<button type="button" class="scene" data-act="open-talk" data-id="' + dialogue.id + '"><p class="eyebrow">' + esc(dialogue.place) +
          (dialogue.id === todayId ? " · 今天" : "") + "</p><h3>" + esc(dialogue.title) + "</h3><p>" + esc(dialogue.goal) + '</p><span class="muted">' + esc(dialogue.local) + "</span></button>";
      }).join("");
      const book = THAI.phrases.map(function (group) {
        const items = group.items.map(function (item) {
          return '<article class="phrase">' + listenControls(item.thai) + thaiBlock(item.thai, "thai-lg") + romanBlock(item.roman) +
            '<p class="zh">' + esc(item.zh) + '</p><p class="hint">' + show(item.note) + "</p></article>";
        }).join("");
        return '<section class="card"><h2>' + esc(group.title) + "</h2>" + items + "</section>";
      }).join("");
      return '<header class="page-head"><p class="eyebrow">对话</p><h1>选择下一句</h1><p class="lead">对方说完后，选择一句能够接续的话，再跟着说。选错时，对方会请你再说一次。下面的常用句供外出前收听。</p></header>' +
        '<div class="scene-grid">' + scenes + "</div><div class=\"stack phrase-wrap\">" + book + "</div>";
    }

    const dialogue = THAI.dialogue(UI.talk.id);
    const bubbles = UI.talk.log.map(function (line) {
      return '<div class="bubble ' + line.who + '"><p class="thai" lang="th">' + esc(line.thai) + '</p><p class="roman">' + romanHtml(line.roman) + "</p><p>" + esc(line.zh) + "</p></div>";
    }).join("");
    let foot = "";
    if (UI.talk.done) {
      const recap = dialogue.recap.map(function (item) {
        return '<article class="phrase">' + thaiBlock(item.thai, "thai-lg") + "<p>" + esc(item.zh) + "</p>" + listenControls(item.thai) + "</article>";
      }).join("");
      foot = '<section class="card"><h2>本段要点</h2>' + recap +
        (UI.talk.saved ? '<p class="hint">' + (UI.talk.gained ? "今天 +" + UI.talk.gained : "这一段今天已经记过。") + "</p>" : "") +
        '<div class="row">' +
        (UI.talk.saved ? "" : '<button type="button" class="btn btn-primary" data-act="finish-talk">记入今日</button>') +
        '<button type="button" class="btn btn-ghost" data-act="open-talk" data-id="' + dialogue.id + '">再练一次</button>' +
        '<button type="button" class="btn btn-ghost" data-act="close-talk">返回情景</button></div></section>';
    } else if (UI.talk.hold) {
      foot = '<button type="button" class="btn btn-primary" data-act="continue-talk">听对方回答</button>';
    } else {
      const line = dialogue.lines[UI.talk.cursor];
      const options = youOptions().map(function (opt, i) {
        const person = personFor(particleMode());
        const note = UI.talk.bad[opt._i];
        const alt = particleMode() === "both" && opt.thai.indexOf("{") >= 0 ? '<span class="thai-alt" lang="th">' + esc(fill(opt.thai, PEOPLE.female)) + "</span>" : "";
        return '<button type="button" class="choice talk-choice' + (note ? " is-wrong" : "") + '" data-act="choose-talk" data-idx="' + i + '"' + (note ? " disabled" : "") + '><span class="choice-key">' + (note ? "×" : (i + 1)) + "</span>" +
          '<span class="thai" lang="th">' + esc(fill(opt.thai, person)) + "</span>" +
          '<span class="roman">' + romanHtml(fill(opt.roman, person)) + "</span>" +
          '<span class="muted">' + esc(opt.zh) + "</span>" + alt +
          (note ? '<span class="hint">' + show(note) + "</span>" : "") + "</button>";
      }).join("");
      foot = '<section class="card"><p class="eyebrow">请说出 · ' + esc(line.prompt) + '</p><div class="choices">' + options + "</div>" +
        '<p class="muted">选择一句，再跟着说一遍。意思大体正确、却无法接续的句子，也会被退回。</p></section>';
    }
    const banner = UI.talk.flash === "ok"
      ? verdict(true, "可以接上", "对方会继续说。")
      : UI.talk.flash === "bad"
        ? verdict(false, "这句接不上", "请换一句，或按提示再说。")
        : "";
    return '<div class="stack"><div class="between"><div><p class="eyebrow">' + esc(dialogue.place) + " · " + esc(dialogue.local) + "</p><h1>" + esc(dialogue.title) + "</h1></div>" +
      '<button type="button" class="btn btn-ghost btn-small" data-act="close-talk">返回</button></div>' +
      banner + '<div class="chat-log">' + bubbles + "</div>" + foot + "</div>";
  }

  function chooseTalk(index) {
    const dialogue = THAI.dialogue(UI.talk.id);
    const opt = UI.talk.options[index];
    if (!opt || UI.talk.bad[opt._i]) return;
    const person = personFor(particleMode());
    const thai = fill(opt.thai, person);
    const roman = fill(opt.roman, person);
    UI.talk.log.push({ who: "you", thai: thai, roman: roman, zh: opt.zh });
    if (!opt.ok) {
      UI.talk.flash = "bad";
      cue(false);
      UI.talk.bad[opt._i] = opt.note;
      if (!UI.talk.repaired) {
        UI.talk.repaired = true;
        UI.talk.log.push({ who: "local", thai: dialogue.repair.thai, roman: dialogue.repair.roman, zh: dialogue.repair.zh });
        UI.talk.autoplay = dialogue.repair.thai;
      }
      draw();
      return;
    }
    UI.talk.flash = "ok";
    cue(true);
    UI.talk.cursor += 1;
    UI.talk.hold = true;
    UI.talk.bad = {};
    UI.talk.repaired = false;
    UI.talk.autoplay = thai;
    draw();
  }

  function continueTalk() {
    const dialogue = THAI.dialogue(UI.talk.id);
    UI.talk.hold = false;
    UI.talk.flash = "";
    if (UI.talk.cursor >= dialogue.lines.length) {
      UI.talk.done = true;
      draw();
      return;
    }
    pumpLocal();
    if (UI.talk.cursor >= dialogue.lines.length) UI.talk.done = true;
    draw();
  }

  function scoreSpeech(heard, item) {
    const text = String(heard || "").replace(/\s+/g, "");
    if (!text) return 0;
    const keys = (item.keys || [item.thai]).map(function (key) { return fill(key).replace(/\s+/g, ""); }).filter(Boolean);
    const hit = keys.filter(function (key) { return text.indexOf(key) >= 0; }).length;
    return Math.round(100 * hit / keys.length);
  }

  function nextStep() {
    if (UI.session.i < UI.session.steps.length - 1) UI.session.i += 1;
    UI.session.locked = false;
    UI.session.picked = null;
    UI.session.peek = "";
    UI.session.heard = "";
    UI.session.score = null;
    UI.session.selfNote = "";
    UI.session.listening = false;
    armAutoplay();
    draw();
  }

  function completeCurrentSession() {
    const s = UI.session;
    if (!s || s.saved) return;
    const key = s.taskId ? "task:" + s.taskId : "practice:" + s.mode + ":" + (s.lessonId || "mix") + ":p" + (s.page || 0);
    const xp = s.taskId ? (s.mode === "lesson" ? 30 : 16) : (s.mode === "lesson" && !s.page ? 30 : 12);
    s.gained = Store.award(key, xp);
    if (s.mode === "lesson" && s.lessonId) Store.markLesson(s.lessonId);
    Store.noteSession();
    s.saved = true;
    s.finished = true;
  }

  function go(view) {
    Speech.stop();
    UI.view = view;
    UI.nav = view;
    UI.session = null;
    UI.talk = null;
    draw();
  }

  function onClick(event) {
    const button = event.target.closest("[data-act]");
    if (!button) return;
    const act = button.dataset.act;
    if (act === "play") {
      const text = decodeURIComponent(button.dataset.thai || "");
      document.querySelectorAll(".is-playing").forEach(function (node) { node.classList.remove("is-playing"); });
      button.classList.add("is-playing");
      Speech.speak(text, { slow: button.dataset.slow === "1" }).then(function (ok) {
        button.classList.remove("is-playing");
        if (!ok) toast("没有播放出来。可检查网络，或在系统中安装泰语语音。没有声音时，先看泰文和罗马音。");
      });
      return;
    }
    if (act === "nav") return go(button.dataset.view);
    if (act === "fsi-level") {
      Speech.stop();
      UI.view = "fsi-level";
      UI.nav = "levels";
      UI.fsiLevel = button.dataset.id || "A0";
      UI.session = null;
      UI.talk = null;
      draw();
      return;
    }
    if (act === "fsi-unit") {
      Speech.stop();
      UI.view = "fsi-unit";
      UI.nav = "levels";
      UI.fsiUnit = Number(button.dataset.n);
      UI.session = null;
      UI.talk = null;
      draw();
      return;
    }
    if (act === "fsi-done") {
      Store.markLesson("fsi-" + button.dataset.n);
      toast("这一课已记入进度。登录同一账号后，换设备仍可看见。");
      draw();
      return;
    }
    if (act === "pref") {
      const field = button.dataset.field;
      const value = field === "minutes" ? Number(button.dataset.val) : button.dataset.val;
      if (!Store.get().profile) UI.draft[field] = value;
      else {
        const patch = {};
        patch[field] = value;
        Store.setProfile(patch);
      }
      draw();
      return;
    }
    if (act === "onboard") {
      Store.onboard(UI.draft);
      UI.view = "today";
      UI.nav = "today";
      draw();
      return;
    }
    if (act === "tick") {
      Store.toggleOffline(button.dataset.id);
      draw();
      return;
    }
    if (act === "mix") {
      UI.mix = button.dataset.val === "1";
      draw();
      return;
    }
    if (act === "start-task") {
      const task = Store.agenda().filter(function (item) { return item.id === button.dataset.id; })[0];
      if (!task) return;
      if (task.mode === "talk") openTalk(task.dialogueId);
      else startSession(task.mode, task.lessonId || null, task.id, 0);
      return;
    }
    if (act === "start-session") {
      const mode = button.dataset.mode;
      if (mode === "review" && !Store.dueWords().length && !button.dataset.lesson) {
        startSession("listen", "tones", button.dataset.task || null, 0);
        return;
      }
      startSession(mode, button.dataset.lesson || null, button.dataset.task || null, Number(button.dataset.page || 0));
      return;
    }
    if (act === "goto-lesson") {
      go("words");
      const node = document.getElementById("lesson-" + button.dataset.id);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (act === "next") return nextStep();
    if (act === "word-next") {
      Store.grade(button.dataset.id, button.dataset.ok === "1");
      nextStep();
      return;
    }
    if (act === "reveal-choices") {
      UI.session.showChoices = true;
      draw();
      return;
    }
    if (act === "choose") {
      if (!UI.session || UI.session.locked) return;
      const ok = button.dataset.ok === "1";
      cue(ok);
      UI.session.locked = true;
      UI.session.picked = Number(button.dataset.idx);
      UI.session.total += 1;
      if (ok) UI.session.correct += 1;
      Store.noteListen(ok);
      const step = UI.session.steps[UI.session.i];
      if (step.item && step.item.wordId) Store.grade(step.item.wordId, ok);
      draw();
      return;
    }
    if (act === "peek") {
      UI.session.peek = button.dataset.level;
      draw();
      return;
    }
    if (act === "self") {
      const level = button.dataset.level;
      Store.noteSpeak(level === "2");
      const step = UI.session.steps[UI.session.i];
      if (step.type === "speak" && level === "2") {
        nextStep();
        return;
      }
      UI.session.selfNote = level === "2" ? "这句可以记下。" : "再听慢速，只跟声调，不必逐个辅音。";
      draw();
      return;
    }
    if (act === "mic") {
      if (!UI.session) return;
      if (!Speech.canRecognize()) {
        toast("这只浏览器不能做泰语识别。请听示范，自行判断是否说顺。");
        return;
      }
      const at = UI.session.i;
      UI.session.listening = true;
      draw();
      Speech.recognize().then(function (heard) {
        if (!UI.session || UI.session.i !== at) return;
        UI.session.listening = false;
        UI.session.heard = heard || "（没有识别到声音）";
        UI.session.score = scoreSpeech(heard, UI.session.steps[at].item);
        draw();
      }).catch(function (err) {
        if (!UI.session) return;
        UI.session.listening = false;
        draw();
        toast(err === "not-allowed" ? "需要允许使用麦克风。仍可在听完示范后自行判断。" : "没有识别成功。听完示范后，可标记「已经说顺」或「尚未说顺」。");
      });
      return;
    }
    if (act === "finish-session") {
      completeCurrentSession();
      draw();
      return;
    }
    if (act === "next-page") {
      const lessonId = UI.session.lessonId;
      const page = (UI.session.page || 0) + 1;
      completeCurrentSession();
      startSession("lesson", lessonId, null, page);
      return;
    }
    if (act === "open-talk") return openTalk(button.dataset.id);
    if (act === "close-talk") {
      Speech.stop();
      UI.talk = null;
      UI.view = "talk";
      UI.nav = "talk";
      draw();
      return;
    }
    if (act === "choose-talk") return chooseTalk(Number(button.dataset.idx));
    if (act === "continue-talk") return continueTalk();
    if (act === "finish-talk") {
      UI.talk.gained = Store.award("dialogue:" + UI.talk.id, 18);
      Store.award("task:talk", 0);
      UI.talk.saved = true;
      draw();
      return;
    }
    if (act === "account") {
      UI.account = true;
      UI.accountError = "";
      draw();
      return;
    }
    if (act === "account-card") return;
    if (act === "close-account") {
      UI.account = false;
      UI.accountError = "";
      draw();
      return;
    }
    if (act === "signup") {
      submitAccount("signup");
      return;
    }
    if (act === "logout") {
      Account.logout();
      toast("已退出。这台设备仍保留当前进度，但不再继续同步。");
      draw();
      return;
    }
    if (act === "reset") {
      const loggedIn = window.Account && Account.session();
      const message = loggedIn
        ? "清空这台设备和账号中的学习记录？若另一台设备仍留有未同步的记录，下次同步时会合并回来。"
        : "清空本机浏览器中的学习记录？";
      if (!window.confirm(message)) return;
      const done = function () {
        UI.view = "today";
        UI.nav = "today";
        UI.session = null;
        UI.talk = null;
        draw();
      };
      if (loggedIn) {
        Account.wipe().then(function () { done(); }).catch(function () {
          toast("账号里的进度没有清空。本机记录仍保留。");
        });
        return;
      }
      Store.reset();
      done();
    }
  }

  function readAccountDraft() {
    const user = document.getElementById("acct-user");
    const pass = document.getElementById("acct-pass");
    if (user) UI.accountDraft.username = user.value;
    if (pass) UI.accountDraft.password = pass.value;
  }

  function submitAccount(kind) {
    if (UI.accountBusy) return;
    readAccountDraft();
    const name = String(UI.accountDraft.username || "").trim();
    if (!/^[\u4e00-\u9fffA-Za-z0-9_]{2,20}$/.test(name)) {
      UI.accountError = "用户名须为 2 到 20 位，可使用中文、字母、数字和下划线。";
      draw();
      return;
    }
    if (!UI.accountDraft.password || UI.accountDraft.password.length < 6) {
      UI.accountError = "密码至少 6 位。";
      draw();
      return;
    }
    UI.accountBusy = true;
    document.querySelectorAll(".modal-card button").forEach(function (node) { node.disabled = true; });
    const task = kind === "signup" ? Account.signup(UI.accountDraft) : Account.login(UI.accountDraft);
    task.then(function () {
      UI.accountBusy = false;
      UI.account = false;
      UI.accountError = "";
      UI.accountDraft.password = "";
      toast(kind === "signup" ? "注册完成。此后进度保存在这个账号中。" : "已登录。此后进度保存在这个账号中。");
      draw();
    }).catch(function (err) {
      UI.accountBusy = false;
      UI.accountError = (err && err.message) || "没有完成。";
      draw();
    });
  }

  function onKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (!/^[1-4]$/.test(event.key)) return;
    const button = document.querySelector('[data-keyn="' + event.key + '"]');
    if (button && !button.disabled) button.click();
  }

  let lastStamp = "";
  function afterDraw() {
    const stamp = (Store.get().profile ? UI.view : "onboard") + ":" +
      (UI.session ? UI.session.i + ":" + UI.session.steps.length : "") + ":" +
      (UI.talk ? UI.talk.cursor + ":" + UI.talk.log.length + ":" + (UI.talk.done ? 1 : 0) : "");
    if (stamp !== lastStamp) {
      window.scrollTo(0, 0);
      lastStamp = stamp;
    }
    let say = null;
    if (UI.session && UI.session.autoplay) {
      say = UI.session.autoplay;
      UI.session.autoplay = null;
    } else if (UI.talk && UI.talk.autoplay) {
      say = UI.talk.autoplay;
      UI.talk.autoplay = null;
    }
    if (say) Speech.speak(say);
    const log = document.querySelector(".chat-log");
    if (log) log.scrollTop = log.scrollHeight;
    const names = { today: "今日", plan: "计划", levels: "分级", "fsi-level": "分级", "fsi-unit": "课文", words: "单词", listen: "听音", sentence: "听句", speak: "开口", talk: "对话", review: "复习", method: "方法", session: "练习" };
    document.title = (names[UI.view] || "ได้ยิน") + " · ได้ยิน";
    if (UI.account && document.activeElement === document.body) {
      const user = document.getElementById("acct-user");
      if (user) user.focus();
    }
  }

  function draw() {
    const root = document.getElementById("app");
    let html = "";
    if (!Store.get().profile) html = viewOnboard();
    else if (UI.view === "session" && UI.session) html = shell(viewSession());
    else if (UI.view === "plan") html = shell(viewPlan());
    else if (UI.view === "levels") html = shell(viewLevels());
    else if (UI.view === "fsi-level") html = shell(viewFsiLevel());
    else if (UI.view === "fsi-unit") html = shell(viewFsiUnit());
    else if (UI.view === "words") html = shell(viewWords());
    else if (UI.view === "listen") html = shell(viewListen());
    else if (UI.view === "sentence") html = shell(viewSentence());
    else if (UI.view === "speak") html = shell(viewSpeak());
    else if (UI.view === "talk") html = shell(viewTalk());
    else if (UI.view === "review") html = shell(viewReview());
    else if (UI.view === "method") html = shell(viewMethod());
    else html = shell(viewToday());
    root.innerHTML = html + accountModal();
    afterDraw();
  }

  document.body.addEventListener("click", onClick);
  document.body.addEventListener("submit", function (event) {
    if (!event.target.closest("[data-account-form]")) return;
    event.preventDefault();
    submitAccount("login");
  });
  document.addEventListener("keydown", onKey);
  window.addEventListener("daiyin-sync", function () {
    if (UI.account) return;
    draw();
  });
  draw();
})();
