(function () {
  const LOCAL_KEY = "daiyin-books-v1";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadLocal() {
    const blank = {
      bookId: "a1",
      dailyNew: 10,
      reviewRatio: 0.4,
      mode: "card",
      stars: [],
      notes: {},
      custom: [],
      quizLevel: "",
      recent: [],
      rounds: [],
      theme: "light",
      filter: "全部"
    };
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || "null");
      return Object.assign(blank, saved || {});
    } catch (err) {
      return blank;
    }
  }

  function saveLocal() {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(local)); } catch (err) { /* ignore */ }
  }

  const local = loadLocal();
  document.documentElement.setAttribute("data-theme", local.theme === "dark" ? "dark" : "light");

  function lessonWords(id) {
    const lesson = window.THAI.lesson(id);
    if (!lesson || !lesson.words) return [];
    return lesson.words.map(function (word) {
      const examples = (lesson.sentences || []).filter(function (sentence) {
        return sentence.thai && sentence.thai.indexOf(word.thai) >= 0;
      }).slice(0, 2).map(function (sentence) {
        return { thai: sentence.thai, zh: sentence.zh };
      });
      if (!examples.length && lesson.sentences && lesson.sentences[0]) {
        examples.push({ thai: lesson.sentences[0].thai, zh: lesson.sentences[0].zh });
      }
      return {
        id: word.id,
        thai: word.thai,
        roman: word.roman,
        ipa: "",
        zh: word.zh,
        pos: posOf(word),
        tone: word.tone || "",
        tip: word.tip || "",
        examples: examples,
        gloss: "zh"
      };
    });
  }

  function posOf(word) {
    const id = word.id || "";
    if (id.indexOf("n") === 0 && /^n\d/.test(id)) return "数词";
    if (id.indexOf("p-") === 0) return "助词";
    if (/礼貌|语气/.test(word.zh || "")) return "助词";
    return "词语";
  }

  function fsiWords(level) {
    if (!window.FSI) return [];
    const out = [];
    FSI.units.filter(function (unit) { return unit.level === level; }).forEach(function (unit) {
      (unit.vocab || []).forEach(function (word, index) {
        if (out.length >= 24) return;
        out.push({
          id: "fsi-" + unit.n + "-" + index,
          thai: word.thai,
          roman: word.roman,
          ipa: word.roman,
          zh: word.en || unit.zh,
          pos: "原课文",
          tone: "",
          tip: unit.aim,
          examples: (unit.dialog || []).slice(0, 1).map(function (line) {
            return { thai: line.thai, zh: line.en || unit.zh };
          }),
          gloss: "en"
        });
      });
    });
    return out;
  }

  function allWords() {
    const map = {};
    ["tones", "polite", "survive", "numbers", "food", "taxi", "market", "repair"].forEach(function (id) {
      lessonWords(id).forEach(function (word) { map[word.id] = word; });
    });
    ["A1", "A2", "B1", "B2"].forEach(function (level) {
      fsiWords(level).forEach(function (word) { map[word.id] = word; });
    });
    return map;
  }

  const WORD = allWords();

  const BOOKS = [
    { id: "a1", level: "A1", topic: "等级", title: "A1 入门", desc: "声调、礼貌词、基本应对", from: ["tones", "polite", "survive"] },
    { id: "a2", level: "A2", topic: "等级", title: "A2 日常", desc: "数字、点餐、问路", from: ["numbers", "food", "taxi"] },
    { id: "b1", level: "B1", topic: "等级", title: "B1 办事", desc: "问价、改期、邀约", from: ["market", "repair"] },
    { id: "b2", level: "B2", topic: "等级", title: "B2 课文词", desc: "分级课文里的一组词", fsi: "B2" },
    { id: "food", level: "专题", topic: "话题", title: "泰国食品", desc: "点餐时反复出现的词", from: ["food"] },
    { id: "shop", level: "专题", topic: "话题", title: "购物问价", desc: "市场和店铺里的说法", from: ["market"] }
  ];

  function bookById(id) {
    if (id === "star") return { id: "star", level: "生词", topic: "生词", title: "生词本", desc: "单独收藏的词" };
    const custom = (local.custom || []).filter(function (book) { return book.id === id; })[0];
    if (custom) return { id: custom.id, level: "自建", topic: "自建", title: custom.title, desc: "自己整理的词本", wordIds: custom.wordIds || [] };
    return BOOKS.filter(function (book) { return book.id === id; })[0] || BOOKS[0];
  }

  function bookWords(book) {
    if (book.id === "star") return local.stars.map(function (id) { return WORD[id]; }).filter(Boolean);
    if (book.wordIds) return book.wordIds.map(function (id) { return WORD[id]; }).filter(Boolean);
    if (book.fsi) return fsiWords(book.fsi);
    const list = [];
    (book.from || []).forEach(function (id) { lessonWords(id).forEach(function (word) { list.push(word); }); });
    return list;
  }

  const UI = {
    view: "home",
    bookId: local.bookId || "a1",
    queue: [],
    index: 0,
    flipped: false,
    noteOpen: false,
    done: false,
    round: { known: 0, unknown: 0 },
    misses: {},
    query: "",
    picked: {},
    authMode: "login",
    authError: "",
    authBusy: false,
    quiz: null,
    draftName: ""
  };

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  function speak(thai) {
    if (!thai || !window.Speech) return;
    Speech.speak(thai).then(function (ok) {
      if (!ok) toast("没有播放出来。可检查网络，或安装泰语语音。");
    });
  }

  function current() {
    return UI.queue[UI.index] || null;
  }

  function rememberBook(id) {
    UI.bookId = id;
    local.bookId = id;
    local.recent = [id].concat((local.recent || []).filter(function (item) { return item !== id; })).slice(0, 4);
    saveLocal();
  }

  function startStudy(bookId) {
    rememberBook(bookId || UI.bookId);
    const book = bookById(UI.bookId);
    const words = bookWords(book);
    const today = Store.dateKey();
    const reviewN = Math.max(0, Math.round(local.dailyNew * Number(local.reviewRatio)));
    const due = words.filter(function (word) {
      const card = Store.card(word.id);
      return card && card.due <= today;
    }).slice(0, reviewN || words.length);
    const fresh = words.filter(function (word) { return !Store.card(word.id); }).slice(0, local.dailyNew);
    let queue = due.concat(fresh);
    if (!queue.length) queue = words.slice(0, local.dailyNew);
    UI.queue = queue;
    UI.index = 0;
    UI.flipped = false;
    UI.done = false;
    UI.noteOpen = false;
    UI.round = { known: 0, unknown: 0 };
    UI.misses = {};
    UI.view = "study";
    draw();
    const word = current();
    if (word && local.mode === "listen") speak(word.thai);
  }

  function finishIfNeeded() {
    if (UI.index < UI.queue.length) return;
    UI.done = true;
    local.rounds = (local.rounds || []).concat([{
      date: Store.dateKey(),
      known: UI.round.known,
      unknown: UI.round.unknown
    }]).slice(-60);
    saveLocal();
    Store.award("practice:cards", 16);
    Store.noteSession();
  }

  function advance() {
    UI.index += 1;
    UI.flipped = false;
    UI.noteOpen = false;
    finishIfNeeded();
    draw();
    const word = current();
    if (word && local.mode === "listen" && !UI.done) speak(word.thai);
  }

  function markKnown() {
    const word = current();
    if (!word) return;
    Store.grade(word.id, true);
    UI.round.known += 1;
    advance();
  }

  function markUnknown() {
    const word = current();
    if (!word) return;
    Store.grade(word.id, false);
    UI.round.unknown += 1;
    UI.misses[word.id] = (UI.misses[word.id] || 0) + 1;
    if (UI.misses[word.id] < 3) UI.queue.push(word);
    if (local.stars.indexOf(word.id) < 0) {
      local.stars.push(word.id);
      saveLocal();
    }
    advance();
  }

  function toggleStar(id) {
    const at = local.stars.indexOf(id);
    if (at >= 0) local.stars.splice(at, 1);
    else local.stars.push(id);
    saveLocal();
    toast(at >= 0 ? "已从生词本移出。" : "已加入生词本。");
    draw();
  }

  function saveNote(id, text) {
    const note = String(text || "").trim().slice(0, 200);
    if (note) local.notes[id] = note;
    else delete local.notes[id];
    saveLocal();
    UI.noteOpen = false;
    toast("笔记已保存。");
    draw();
  }

  function progressBits() {
    const total = UI.queue.length || 1;
    const seen = Math.min(UI.index, UI.queue.length);
    const left = Math.max(0, UI.queue.length - seen);
    return { seen: seen, total: UI.queue.length, left: left, width: Math.round(100 * seen / total) };
  }

  function side() {
    const items = BOOKS.concat([{ id: "star", title: "生词本", desc: local.stars.length + " 个词" }]).concat(local.custom || []);
    return '<aside class="side"><button type="button" class="logo" data-act="go" data-view="home"><b>ได้ยิน</b></button>' +
      '<p class="side-label">词本</p>' +
      items.map(function (book) {
        const meta = book.level ? book.level + " · " + (book.desc || "") : (book.desc || "自建词本");
        return '<button type="button" class="book-btn' + (UI.bookId === book.id ? " is-on" : "") + '" data-act="pick-book" data-id="' + esc(book.id) + '"><strong>' + esc(book.title) + "</strong><small>" + esc(meta) + "</small></button>";
      }).join("") +
      '<p class="side-label">页面</p>' +
      [["home", "首页"], ["books", "词库"], ["plan", "学习计划"], ["stats", "统计"], ["texts", "分级课文"], ["profile", "设置"]].map(function (item) {
        return '<button type="button" class="nav-link' + (UI.view === item[0] ? " is-on" : "") + '" data-act="go" data-view="' + item[0] + '">' + item[1] + "</button>";
      }).join("") +
      "</aside>";
  }

  function top(title) {
    const bits = UI.view === "study" ? progressBits() : null;
    const books = BOOKS.concat([{ id: "star", title: "生词本" }]);
    return '<header class="top"><button type="button" class="logo" data-act="go" data-view="home"><b>ได้ยิน</b><span>泰语背词</span></button>' +
      '<nav class="top-links"><button type="button" data-act="go" data-view="plan"' + (UI.view === "plan" ? ' class="is-on"' : "") + ">学习计划</button>" +
      '<button type="button" data-act="go" data-view="profile"' + (UI.view === "profile" ? ' class="is-on"' : "") + ">设置</button></nav></header>" +
      '<div class="mobile-books">' + books.map(function (book) {
        return '<button type="button" class="chip' + (UI.bookId === book.id ? " is-on" : "") + '" data-act="pick-book" data-id="' + book.id + '">' + esc(book.title) + "</button>";
      }).join("") + "</div>" +
      (bits ? '<div class="progress-block"><div class="progress-meta"><span>' + esc(title || "") + "</span><span>本轮 " + bits.seen + " / " + bits.total + " · 剩余 " + bits.left + '</span></div><div class="track"><span style="width:' + bits.width + '%"></span></div></div>' : "");
  }

  function shell(body, title) {
    return '<div class="app">' + side() + '<div class="main">' + top(title) + body + "</div></div>" + fab();
  }

  function fab() {
    const word = UI.view === "study" ? current() : null;
    const thai = word ? word.thai : "ได้ยิน";
    return '<button type="button" class="fab" data-act="speak" data-thai="' + encodeURIComponent(thai) + '" aria-label="朗读">听</button>';
  }

  function home() {
    const book = bookById(UI.bookId);
    const words = bookWords(book);
    const due = words.filter(function (word) {
      const card = Store.card(word.id);
      return card && card.due <= Store.dateKey();
    }).length;
    const fresh = words.filter(function (word) { return !Store.card(word.id); }).length;
    const recent = (local.recent || []).map(bookById).filter(function (item) { return item && item.title; });
    return '<div class="page"><p class="muted">今日</p><h1>先认词，再开口</h1>' +
      '<div class="grid-2" style="margin-top:16px"><section class="card"><p class="muted">' + esc(book.title) + "</p><h2>新词 " + Math.min(fresh, local.dailyNew) + " · 复习 " + due + '</h2><p class="muted">不认识的词会在本轮稍后再次出现，并进入生词本。</p>' +
      '<div class="row" style="margin-top:14px"><button type="button" class="btn btn-primary" data-act="start">开始今天</button>' +
      '<button type="button" class="btn" data-act="go" data-view="plan">调整计划</button></div></section>' +
      '<section class="card"><p class="muted">打卡</p><h2>连续 ' + Store.get().streak.count + ' 天</h2><p class="muted">已听过的词 ' + Store.knownCount() + " · 生词 " + local.stars.length + '</p>' +
      '<button type="button" class="btn" data-act="go" data-view="stats" style="margin-top:14px">查看统计</button></section></div>' +
      '<h2 style="margin:22px 0 10px">最近词本</h2><div class="grid">' + (recent.length ? recent : BOOKS.slice(0, 3)).map(bookCard).join("") + "</div>" +
      '<h2 style="margin:22px 0 10px">推荐</h2><div class="grid">' + BOOKS.filter(function (item) { return item.topic === "话题" || item.id === "a1"; }).map(bookCard).join("") +
      '<article class="card"><p class="muted">测评</p><h2>词汇定级</h2><p class="muted">做一组选择题，得到建议词本。</p><button type="button" class="btn" data-act="go" data-view="quiz" style="margin-top:12px">开始测评</button></article></div></div>';
  }

  function bookCard(book) {
    const count = bookWords(book).length;
    return '<article class="card"><p class="muted">' + esc(book.level || "词本") + "</p><h2>" + esc(book.title) + "</h2><p class=\"muted\">" + esc(book.desc || "") + " · " + count + ' 词</p>' +
      '<div class="row" style="margin-top:12px"><button type="button" class="btn btn-primary" data-act="start" data-id="' + esc(book.id) + '">学习</button>' +
      '<button type="button" class="btn" data-act="pick-book" data-id="' + esc(book.id) + '">设为当前</button></div></article>';
  }

  function booksPage() {
    const filters = ["全部", "等级", "话题", "自建"];
    const list = BOOKS.filter(function (book) {
      if (local.filter === "全部") return true;
      if (local.filter === "自建") return false;
      return book.topic === local.filter;
    }).concat(local.filter === "全部" || local.filter === "自建" ? (local.custom || []).map(function (book) {
      return { id: book.id, level: "自建", title: book.title, desc: "自建词本", wordIds: book.wordIds || [] };
    }) : []);
    return '<div class="page"><div class="row"><h1>词本</h1></div><div class="chips">' + filters.map(function (name) {
      return '<button type="button" class="chip' + (local.filter === name ? " is-on" : "") + '" data-act="filter" data-id="' + name + '">' + name + "</button>";
    }).join("") + '</div><div class="grid">' + list.map(bookCard).join("") +
      '<article class="card"><h2>新建词本</h2><p class="muted">从生词本勾选单词后，可放入自建词本。</p>' +
      '<div class="field"><input id="new-book" placeholder="词本名称" value="' + esc(UI.draftName) + '"></div>' +
      '<button type="button" class="btn btn-primary" data-act="create-book" style="margin-top:12px">创建</button></article></div></div>';
  }

  function planPage() {
    const news = [5, 10, 20];
    const ratios = [[0.2, "复习较少"], [0.4, "新旧相当"], [0.8, "复习为主"]];
    const modes = [["card", "看词认意"], ["listen", "先听再翻"]];
    function picks(list, current, act) {
      return list.map(function (item) {
        const value = item[0] != null && item.length ? item[0] : item;
        const label = item[1] || (item + " 个新词");
        const on = String(current) === String(value);
        return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-act="' + act + '" data-val="' + value + '">' + esc(label) + "</button>";
      }).join("");
    }
    return '<div class="page"><h1>学习计划</h1><p class="muted">当前词本：' + esc(bookById(UI.bookId).title) + "</p>" +
      '<section class="card" style="margin-top:16px"><h2>每日新词</h2><div class="chips">' + picks(news, local.dailyNew, "set-new") + "</div>" +
      "<h2>复习比例</h2><div class=\"chips\">" + picks(ratios, local.reviewRatio, "set-ratio") + "</div>" +
      "<h2>学习方式</h2><div class=\"chips\">" + picks(modes, local.mode, "set-mode") + "</div>" +
      '<p class="hint">认识的词按间隔往后排。不认识的词留在今天，并在本轮后面再出现。</p></section></div>';
  }

  function studyPage() {
    if (!UI.queue.length) {
      return '<div class="stage"><section class="card"><h2>这个词本还没有词</h2><p class="muted">可先在生词本收藏，或换一个词本。</p></section></div>';
    }
    if (UI.done) {
      return '<div class="modal-back"><section class="card modal"><p class="muted">本轮完成</p><h2>认识 ' + UI.round.known + " · 不认识 " + UI.round.unknown + '</h2><p class="muted">今天的学习已记入打卡。不认识的词在生词本里。</p>' +
        '<div class="row" style="margin-top:16px"><button type="button" class="btn btn-primary" data-act="start">再来一轮</button>' +
        '<button type="button" class="btn" data-act="go" data-view="home">回到首页</button></div></section></div>';
    }
    const word = current();
    const starred = local.stars.indexOf(word.id) >= 0;
    const note = local.notes[word.id] || "";
    const glossLabel = word.gloss === "en" ? "原课文" : "释义";
    const examples = (word.examples || []).map(function (line) {
      return '<div class="example"><p class="th" lang="th">' + esc(line.thai) + "</p><p>" + esc(line.zh) + "</p></div>";
    }).join("");
    const sound = word.ipa ? '<p class="ipa">' + esc(word.ipa) + "</p>" : (word.tone ? '<p class="ipa">声调 · ' + esc(word.tone) + "</p>" : "");
    return '<div class="stage"><div class="flip' + (UI.flipped ? " is-back" : "") + '" data-act="flip" role="button" tabindex="0" aria-label="翻转卡片"><div class="flip-inner">' +
      '<div class="face"><p class="thai-xl" lang="th">' + esc(word.thai) + "</p><p class=\"roman\">" + esc(word.roman) + "</p>" + sound +
      '<p class="hint">点击卡片看释义</p></div>' +
      '<div class="face face-back"><span class="pos">' + esc(word.pos) + '</span><p class="zh-lg">' + esc(word.zh) + "</p><p class=\"hint\">" + glossLabel + "</p>" +
      examples + (note ? '<p class="hint">笔记：' + esc(note) + "</p>" : "") + (word.tip ? '<p class="hint">' + esc(word.tip) + "</p>" : "") +
      "</div></div></div>" +
      '<div class="actions"><button type="button" class="btn btn-primary" data-act="known">认识</button>' +
      '<button type="button" class="btn btn-warn" data-act="unknown">不认识</button>' +
      '<button type="button" class="btn" data-act="star" data-id="' + esc(word.id) + '">' + (starred ? "已在生词本" : "加入生词本") + "</button>" +
      '<button type="button" class="btn btn-ghost" data-act="note">笔记</button></div></div>' +
      (UI.noteOpen ? '<div class="modal-back"><form class="card modal" data-note-form><h2>笔记</h2><div class="field"><textarea id="note-text" rows="4" placeholder="写下自己的提醒">' + esc(note) + '</textarea></div><div class="row" style="margin-top:12px"><button class="btn btn-primary" type="submit">保存</button><button type="button" class="btn" data-act="close-note">取消</button></div></form></div>' : "");
  }

  function notebookPage() {
    const q = UI.query.trim();
    const rows = local.stars.map(function (id) { return WORD[id]; }).filter(function (word) {
      if (!word) return false;
      if (!q) return true;
      return (word.thai + word.zh + word.roman).indexOf(q) >= 0;
    });
    const custom = local.custom || [];
    return '<div class="page"><div class="row"><h1>生词本</h1><button type="button" class="btn btn-primary" data-act="start" data-id="star">复习生词</button></div>' +
      '<input class="search" style="margin:12px 0;width:min(360px,100%)" data-act="search" placeholder="搜索泰语或中文" value="' + esc(UI.query) + '">' +
      '<div class="list">' + (rows.length ? rows.map(function (word) {
        const on = UI.picked[word.id] ? " checked" : "";
        return '<div class="check-row"><input type="checkbox" data-act="pick" data-id="' + esc(word.id) + '"' + on + '><span class="th" lang="th">' + esc(word.thai) + '</span><span class="grow">' + esc(word.zh) + '</span><button type="button" class="text-btn" data-act="star" data-id="' + esc(word.id) + '">移出</button></div>';
      }).join("") : '<p class="muted">还没有生词。学习时点「不认识」或「加入生词本」。</p>') + "</div>" +
      (custom.length && rows.length ? '<div class="row" style="margin-top:14px"><span class="muted">放入自建词本</span>' + custom.map(function (book) {
        return '<button type="button" class="btn" data-act="move-custom" data-id="' + esc(book.id) + '">' + esc(book.title) + "</button>";
      }).join("") + "</div>" : "") +
      (Object.keys(UI.picked).length ? '<button type="button" class="btn" data-act="drop-picked" style="margin-top:12px">移出已选</button>' : "") +
      "</div>";
  }

  function statsPage() {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i -= 1) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = Store.dateKey(d);
      const studied = (local.rounds || []).some(function (round) { return round.date === key; }) || !!(Store.get().awards[key] && Store.get().awards[key]["practice:cards"]);
      days.push({ key: key, on: studied, n: d.getDate() });
    }
    const last7 = days.slice(-7);
    const max = Math.max(1, last7.reduce(function (sum, day) {
      return sum + (local.rounds || []).filter(function (round) { return round.date === day.key; }).reduce(function (n, round) { return n + round.known + round.unknown; }, 0);
    }, 0));
    const bars = last7.map(function (day) {
      const count = (local.rounds || []).filter(function (round) { return round.date === day.key; }).reduce(function (n, round) { return n + round.known + round.unknown; }, 0);
      const h = Math.round(100 * count / max);
      return '<div class="bar" title="' + count + '"><span style="height:' + Math.max(h, count ? 8 : 0) + '%"></span></div>';
    }).join("");
    const badges = [];
    if (Store.get().streak.count >= 1) badges.push("开始打卡");
    if (Store.get().streak.count >= 7) badges.push("连续 7 天");
    if (Store.knownCount() >= 20) badges.push("认过 20 词");
    if (local.quizLevel) badges.push("测评 " + local.quizLevel);
    return '<div class="page"><h1>统计</h1><div class="grid" style="margin-top:16px">' +
      '<section class="card"><p class="muted">连续打卡</p><h2>' + Store.get().streak.count + ' 天</h2></section>' +
      '<section class="card"><p class="muted">学习次数</p><h2>' + Store.get().stats.sessions + '</h2></section>' +
      '<section class="card"><p class="muted">进入复习的词</p><h2>' + Store.knownCount() + "</h2></section></div>" +
      '<section class="card" style="margin-top:14px"><h2>近 7 天学习量</h2><div class="bars" style="margin-top:12px">' + bars + "</div></section>" +
      '<section class="card" style="margin-top:14px"><h2>打卡日历</h2><div class="calendar" style="margin-top:12px">' + days.map(function (day) {
        return '<div class="day' + (day.on ? " is-on" : "") + '">' + day.n + "</div>";
      }).join("") + "</div></section>" +
      '<section class="card" style="margin-top:14px"><h2>成就</h2><div class="badges" style="margin-top:10px">' + (badges.length ? badges.map(function (name) { return '<span class="badge">' + esc(name) + "</span>"; }).join("") : '<span class="muted">完成一轮学习后会出现。</span>') + "</div></section></div>";
  }

  function profilePage() {
    const session = Account.session();
    const notes = Object.keys(local.notes).map(function (id) {
      const word = WORD[id];
      if (!word) return "";
      return '<article class="word-row"><span class="th" lang="th">' + esc(word.thai) + '</span><span class="grow">' + esc(local.notes[id]) + "</span></article>";
    }).join("");
    return '<div class="page"><h1>个人中心</h1><div class="grid-2" style="margin-top:16px"><section class="card"><p class="muted">账号</p><h2>' + esc(session ? session.username : "未登录") + '</h2><p class="muted">' + esc(Account.statusLabel()) + " · 词汇等级 " + esc(local.quizLevel || "未测评") + "</p>" +
      '<div class="row" style="margin-top:12px"><button type="button" class="btn" data-act="theme">' + (local.theme === "dark" ? "切换浅色" : "切换深色") + "</button>" +
      (session ? '<button type="button" class="btn" data-act="logout">退出</button>' : '<button type="button" class="btn btn-primary" data-act="go" data-view="auth">登录</button>') +
      "</div></section><section class=\"card\"><h2>笔记</h2>" + (notes || '<p class="muted">学习时写下的笔记会集中在这里。</p>') + "</section></div>" +
      '<section class="card" style="margin-top:14px"><h2>分级课文</h2><p class="muted">四十课课文仍可按 A0 到 B2 阅读。背词计划使用上面的词本。</p><button type="button" class="btn" data-act="go" data-view="texts" style="margin-top:12px">打开课文</button></section></div>';
  }

  function authPage() {
    const login = UI.authMode === "login";
    return '<div class="auth"><section class="auth-brand"><p class="muted">ได้ยิน</p><h1>先把词认准，再拿去听和说</h1><p class="muted" style="margin-top:12px">词本按 A1、A2、B1、B2 和食品、购物分开。新用户可先做词汇测评，再进入建议词本。</p></section>' +
      '<form class="auth-form" data-auth-form><h2>' + (login ? "登录" : "注册") + '</h2><div class="field"><span>用户名</span><input id="acct-user" autocomplete="username"></div>' +
      '<div class="field"><span>密码</span><input id="acct-pass" type="password" autocomplete="' + (login ? "current-password" : "new-password") + '"></div>' +
      '<p class="form-error">' + esc(UI.authError) + "</p>" +
      '<button class="btn btn-primary" type="submit"' + (UI.authBusy ? " disabled" : "") + ">" + (login ? "登录" : "注册并测评") + "</button>" +
      '<button type="button" class="btn" data-act="auth-mode" style="margin-top:8px">' + (login ? "没有账号，去注册" : "已有账号，去登录") + "</button>" +
      '<button type="button" class="text-btn" data-act="go" data-view="home">先不登录，直接学习</button></form></div>';
  }

  function quizPage() {
    if (!UI.quiz) UI.quiz = makeQuiz();
    const quiz = UI.quiz;
    if (quiz.done) {
      const book = quiz.level === "B1" ? "b1" : quiz.level === "A2" ? "a2" : "a1";
      return '<div class="page"><section class="card"><p class="muted">测评结果</p><h1>' + quiz.level + '</h1><p>答对 ' + quiz.score + " / " + quiz.items.length + "。建议从「" + esc(bookById(book).title) + '」开始。</p>' +
        '<div class="row" style="margin-top:14px"><button type="button" class="btn btn-primary" data-act="start" data-id="' + book + '">学习建议词本</button>' +
        '<button type="button" class="btn" data-act="go" data-view="home">回到首页</button></div></section></div>';
    }
    const item = quiz.items[quiz.i];
    return '<div class="page"><p class="muted">测评 ' + (quiz.i + 1) + " / " + quiz.items.length + '</p><h1 lang="th" class="thai" style="font-size:48px;margin:12px 0">' + esc(item.thai) + "</h1>" +
      item.options.map(function (option, index) {
        return '<button type="button" class="quiz-option" data-act="quiz" data-idx="' + index + '">' + esc(option) + "</button>";
      }).join("") + "</div>";
  }

  function makeQuiz() {
    const pool = bookWords(BOOKS[0]).concat(bookWords(BOOKS[1]), bookWords(BOOKS[2]));
    const items = pool.slice(0, 6).map(function (word) {
      const options = [word.zh];
      pool.forEach(function (other) {
        if (options.length < 4 && options.indexOf(other.zh) < 0) options.push(other.zh);
      });
      return { thai: word.thai, answer: word.zh, options: shuffle(options) };
    });
    return { items: items, i: 0, score: 0, done: false, level: "" };
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

  function textsPage() {
    if (!window.FSI) return '<div class="page"><h1>课文未载入</h1></div>';
    if (UI.unit) {
      const unit = FSI.units.filter(function (item) { return item.n === UI.unit; })[0];
      if (!unit) return '<div class="page"><button class="btn" data-act="unit" data-n="0">返回</button></div>';
      const lines = (unit.dialog || []).map(function (line) {
        return '<article class="word-row"><div class="grow"><p class="th" lang="th">' + esc(line.thai) + '</p><p class="muted">' + esc(line.roman) + (line.en ? " · " + esc(line.en) : "") + '</p></div><button type="button" class="btn" data-act="speak" data-thai="' + encodeURIComponent(line.thai) + '">听</button></article>';
      }).join("");
      return '<div class="page"><button type="button" class="text-btn" data-act="unit" data-n="0">返回分级</button><p class="muted">' + esc(unit.level) + " · 第 " + unit.n + " 课</p><h1>" + esc(unit.zh) + '</h1><p class="muted">' + esc(unit.aim) + "</p><div class=\"list\" style=\"margin-top:14px\">" + (lines || '<p class="muted">这一课请打开原页收听。</p>') + '</div><p style="margin-top:12px"><a href="' + esc(unit.url) + '" target="_blank" rel="noopener">打开原课</a></p></div>';
    }
    return '<div class="page"><h1>分级课文</h1><p class="muted">课文来自公有领域的外交学院泰语基础教程。背词仍用左侧词本。</p><div class="grid" style="margin-top:16px">' +
      FSI.levels.map(function (level) {
        const units = FSI.units.filter(function (unit) { return unit.level === level.id; });
        return '<section class="card"><p class="muted">' + esc(level.id) + "</p><h2>" + esc(level.title) + "</h2><p class=\"muted\">" + esc(level.can) + "</p><div class=\"list\" style=\"margin-top:10px\">" +
          units.map(function (unit) {
            return '<button type="button" class="text-btn" data-act="unit" data-n="' + unit.n + '">第 ' + unit.n + " 课 · " + esc(unit.zh) + "</button>";
          }).join("") + "</div></section>";
      }).join("") + "</div></div>";
  }

  function draw() {
    const root = document.getElementById("app");
    let html = "";
    if (UI.view === "auth") html = authPage();
    else if (UI.view === "books") html = shell(booksPage());
    else if (UI.view === "plan") html = shell(planPage());
    else if (UI.view === "study") html = shell(studyPage(), bookById(UI.bookId).title);
    else if (UI.view === "notebook" || (UI.view === "study" && UI.bookId === "star")) html = shell(notebookPage());
    else if (UI.view === "stats") html = shell(statsPage());
    else if (UI.view === "profile") html = shell(profilePage());
    else if (UI.view === "quiz") html = shell(quizPage());
    else if (UI.view === "texts") html = shell(textsPage());
    else html = shell(home());
    root.innerHTML = html;
    const names = { home: "首页", books: "词库", plan: "计划", study: "背词", notebook: "生词本", stats: "统计", profile: "设置", quiz: "测评", texts: "课文", auth: "登录" };
    document.title = (names[UI.view] || "ได้ยิน") + " · ได้ยิน";
  }

  function onClick(event) {
    const button = event.target.closest("[data-act]");
    if (!button) return;
    const act = button.dataset.act;
    if (act === "go") {
      UI.view = button.dataset.view;
      if (UI.view === "quiz") UI.quiz = null;
      if (UI.view !== "texts") UI.unit = 0;
      draw();
      return;
    }
    if (act === "pick-book") {
      rememberBook(button.dataset.id);
      if (button.dataset.id === "star") UI.view = "notebook";
      else if (UI.view === "study") return startStudy(button.dataset.id);
      draw();
      return;
    }
    if (act === "start") {
      startStudy(button.dataset.id || UI.bookId);
      return;
    }
    if (act === "flip") {
      UI.flipped = !UI.flipped;
      const node = document.querySelector(".flip");
      if (node) node.classList.toggle("is-back", UI.flipped);
      return;
    }
    if (act === "known") return markKnown();
    if (act === "unknown") return markUnknown();
    if (act === "star") return toggleStar(button.dataset.id || (current() && current().id));
    if (act === "note") {
      UI.noteOpen = true;
      draw();
      const box = document.getElementById("note-text");
      if (box) box.focus();
      return;
    }
    if (act === "close-note") {
      UI.noteOpen = false;
      draw();
      return;
    }
    if (act === "speak") {
      speak(decodeURIComponent(button.dataset.thai || ""));
      return;
    }
    if (act === "filter") {
      local.filter = button.dataset.id;
      saveLocal();
      draw();
      return;
    }
    if (act === "set-new") {
      local.dailyNew = Number(button.dataset.val);
      saveLocal();
      draw();
      return;
    }
    if (act === "set-ratio") {
      local.reviewRatio = Number(button.dataset.val);
      saveLocal();
      draw();
      return;
    }
    if (act === "set-mode") {
      local.mode = button.dataset.val;
      saveLocal();
      draw();
      return;
    }
    if (act === "theme") {
      local.theme = local.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", local.theme);
      saveLocal();
      draw();
      return;
    }
    if (act === "logout") {
      Account.logout();
      toast("已退出。本机进度仍在。");
      draw();
      return;
    }
    if (act === "auth-mode") {
      UI.authMode = UI.authMode === "login" ? "signup" : "login";
      UI.authError = "";
      draw();
      return;
    }
    if (act === "create-book") {
      const input = document.getElementById("new-book");
      const title = input ? input.value.trim() : "";
      if (!title) return toast("请先写词本名称。");
      local.custom.push({ id: "c" + Date.now().toString(36), title: title.slice(0, 20), wordIds: [] });
      UI.draftName = "";
      saveLocal();
      toast("词本已建立。");
      draw();
      return;
    }
    if (act === "pick") {
      const id = button.dataset.id;
      if (button.checked) UI.picked[id] = true;
      else delete UI.picked[id];
      return;
    }
    if (act === "drop-picked") {
      local.stars = local.stars.filter(function (id) { return !UI.picked[id]; });
      UI.picked = {};
      saveLocal();
      draw();
      return;
    }
    if (act === "move-custom") {
      const book = (local.custom || []).filter(function (item) { return item.id === button.dataset.id; })[0];
      if (!book) return;
      Object.keys(UI.picked).forEach(function (id) {
        if (book.wordIds.indexOf(id) < 0) book.wordIds.push(id);
      });
      saveLocal();
      toast("已放入「" + book.title + "」。");
      return;
    }
    if (act === "unit") {
      UI.unit = Number(button.dataset.n || 0);
      draw();
      return;
    }
    if (act === "quiz") {
      const quiz = UI.quiz;
      const item = quiz.items[quiz.i];
      if (item.options[Number(button.dataset.idx)] === item.answer) quiz.score += 1;
      quiz.i += 1;
      if (quiz.i >= quiz.items.length) {
        quiz.done = true;
        quiz.level = quiz.score >= 5 ? "B1" : quiz.score >= 3 ? "A2" : "A1";
        local.quizLevel = quiz.level;
        saveLocal();
      }
      draw();
    }
  }

  document.body.addEventListener("click", onClick);
  document.body.addEventListener("submit", function (event) {
    const noteForm = event.target.closest("[data-note-form]");
    if (noteForm) {
      event.preventDefault();
      const word = current();
      const box = document.getElementById("note-text");
      if (word) saveNote(word.id, box ? box.value : "");
      return;
    }
    const auth = event.target.closest("[data-auth-form]");
    if (!auth) return;
    event.preventDefault();
    const username = document.getElementById("acct-user").value.trim();
    const password = document.getElementById("acct-pass").value;
    if (username.length < 2) {
      UI.authError = "用户名至少 2 个字符。";
      draw();
      return;
    }
    if (password.length < 6) {
      UI.authError = "密码至少 6 位。";
      draw();
      return;
    }
    UI.authBusy = true;
    UI.authError = "";
    draw();
    const action = UI.authMode === "signup" ? Account.signup : Account.login;
    action({ username: username, password: password }).then(function () {
      UI.authBusy = false;
      UI.view = UI.authMode === "signup" ? "quiz" : "home";
      UI.quiz = null;
      draw();
    }).catch(function (err) {
      UI.authBusy = false;
      UI.authError = (err && err.message) || "没有完成。请稍后再试。";
      draw();
    });
  });
  document.body.addEventListener("input", function (event) {
    if (!event.target.matches("[data-act=search]")) return;
    UI.query = event.target.value;
    const start = event.target.selectionStart;
    draw();
    const box = document.querySelector("[data-act=search]");
    if (box) {
      box.focus();
      box.selectionStart = box.selectionEnd = start;
    }
  });
  window.addEventListener("daiyin-sync", function () {
    if (UI.view === "auth") return;
    draw();
  });

  draw();
})();
