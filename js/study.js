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
      filter: "全部",
      voice: "both",
      preferCloudTts: false
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
  let studyStamp = 0;
  const legacyBook = { a1: "A1", a2: "A2", b1: "B1", b2: "B2", food: "A1", shop: "A2" };
  let migrated = false;
  if (legacyBook[local.bookId]) {
    local.bookId = legacyBook[local.bookId];
    migrated = true;
  }
  const nextRecent = (local.recent || []).map(function (id) { return legacyBook[id] || id; });
  if (nextRecent.join("|") !== (local.recent || []).join("|")) {
    local.recent = nextRecent;
    migrated = true;
  }
  if (!local.voice) {
    local.voice = "both";
    migrated = true;
  }
  if (!local.courseProgress || typeof local.courseProgress !== "object") {
    local.courseProgress = {};
    migrated = true;
  }
  if (!local.lessonNotes || typeof local.lessonNotes !== "object") {
    local.lessonNotes = {};
    migrated = true;
  }
  if (["A1", "A2", "B1", "B2", "grammar", "phonics"].indexOf(local.courseLevel) < 0) {
    local.courseLevel = "A1";
    migrated = true;
  }
  // 各课程轨道每日课量：A1–B2 / 语法用 dailyLessons；音标用 dailyPhonics（均 1–5）。
  if (!(Number(local.dailyLessons) >= 1 && Number(local.dailyLessons) <= 5)) {
    local.dailyLessons = 1;
    migrated = true;
  }
  if (!(Number(local.dailyPhonics) >= 1 && Number(local.dailyPhonics) <= 5)) {
    local.dailyPhonics = 1;
    migrated = true;
  }
  if (local.mode !== "card" && local.mode !== "hear-word" && local.mode !== "hear-sent") {
    local.mode = "card";
    migrated = true;
  }
  if (local.order !== "new" && local.order !== "review" && local.order !== "mix") {
    local.order = "review";
    migrated = true;
  }
  if (migrated) saveLocal();

  function resolvedTheme() {
    if (local.theme === "system" && window.matchMedia) return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return local.theme === "dark" ? "dark" : "light";
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", resolvedTheme());
  }

  function themeLabel() {
    if (local.theme === "system") return "跟随系统";
    return local.theme === "dark" ? "深色" : "浅色";
  }

  applyTheme();
  if (window.matchMedia) {
    const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = function () { if (local.theme === "system") applyTheme(); };
    if (themeQuery.addEventListener) themeQuery.addEventListener("change", onTheme);
    else if (themeQuery.addListener) themeQuery.addListener(onTheme);
  }

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

  function lexList() {
    return (window.LEXICON && LEXICON.words) || [];
  }

  // 词库按等级拆成四个小包，按需下载。进首页只下当前等级，其余在切换词本、打开课程等级、查词时再下。
  const lexStatus = {};
  const lexPromises = {};

  function lexReady(level) {
    return lexStatus[level] === "ready";
  }

  function allLexReady() {
    return levelOrder().every(lexReady);
  }

  function lexSuffix() {
    return window.RT_VERSION ? "?v=" + window.RT_VERSION : "";
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      const node = document.createElement("script");
      node.src = src;
      node.onload = function () { resolve(true); };
      node.onerror = function () { resolve(false); };
      document.head.appendChild(node);
    });
  }

  function afterLexLoad(level) {
    sceneOrderCache = null;
    if (window.COURSE_COVER && window.COURSE_COVER.build) window.COURSE_COVER.build(level);
    WORD = allWords();
  }

  function lexLoadProgress(levels) {
    const list = levels || levelOrder();
    const ready = list.filter(lexReady).length;
    const failed = list.some(function (lv) { return lexStatus[lv] === "error"; });
    const loading = list.some(function (lv) { return lexStatus[lv] === "loading"; });
    return {
      ready: ready,
      total: list.length,
      width: list.length ? Math.round(100 * ready / list.length) : 0,
      failed: failed,
      loading: loading || (ready < list.length && !failed)
    };
  }

  function setBootStatus(message) {
    const node = document.getElementById("boot-zh");
    if (node && message) node.textContent = message;
  }

  function loadLex(level) {
    if (lexReady(level)) return Promise.resolve(true);
    if (lexPromises[level]) return lexPromises[level];
    lexStatus[level] = "loading";
    setBootStatus("正在下载词库 " + level + "…");
    lexPromises[level] = loadScript("js/lexpack-" + level.toLowerCase() + ".js" + lexSuffix()).then(function (ok) {
      if (ok && window.LEXICON_PARTS && window.LEXICON_PARTS[level]) {
        lexStatus[level] = "ready";
        afterLexLoad(level);
        return true;
      }
      lexStatus[level] = "error";
      lexPromises[level] = null;
      return false;
    });
    return lexPromises[level];
  }

  function lexLevelsUpTo(level) {
    const order = levelOrder();
    const index = order.indexOf(level);
    return index < 0 ? order.slice() : order.slice(0, index + 1);
  }

  function loadLexUpTo(level) {
    const need = lexLevelsUpTo(level).filter(function (lv) { return !lexReady(lv); });
    if (!need.length) return Promise.resolve(true);
    return Promise.all(need.map(loadLex)).then(function (results) { return results.every(Boolean); });
  }

  // 后台静默下载，完成后刷新页面；正在下载或已失败的不重复触发，避免渲染循环。
  function kickLexUpTo(level) {
    const need = lexLevelsUpTo(level).filter(function (lv) { return !lexStatus[lv]; });
    if (!need.length) return;
    Promise.all(need.map(loadLex)).then(function (results) {
      if (results.some(Boolean)) draw();
    });
  }

  function bookNeedLevel(book) {
    if (!book || book.id === "phonics") return "";
    if (book.id === "star" || book.wordIds) return "B2";
    const level = book.levelId || "";
    return levelOrder().indexOf(level) >= 0 ? level : "";
  }

  // 等级解锁须看前一级的词，所以「备好」指本级及之前各级都已下载。
  function bookPending(book) {
    const level = bookNeedLevel(book);
    if (!level) return false;
    return !lexLevelsUpTo(level).every(lexReady);
  }

  function wantBook(book, done) {
    if (!bookPending(book)) {
      if (done) done();
      return;
    }
    toast("正在下载词库，请稍候");
    loadLexUpTo(bookNeedLevel(book) || "A1").then(function (ok) {
      if (ok) {
        draw();
        if (done) done();
      } else {
        toast("词库下载失败，请检查网络后再试");
      }
    });
  }

  let fsiPromise = null;
  function loadFsi() {
    if (window.FSI) return Promise.resolve(true);
    if (fsiPromise) return fsiPromise;
    fsiPromise = loadScript("js/fsi.js" + lexSuffix()).then(function (ok) {
      if (ok && window.FSI) {
        WORD = allWords();
        return true;
      }
      fsiPromise = null;
      return false;
    });
    return fsiPromise;
  }

  let phonicsPromise = null;
  function loadPhonics() {
    if (window.PHONICS) return Promise.resolve(true);
    if (phonicsPromise) return phonicsPromise;
    phonicsPromise = loadScript("js/phonics.js" + lexSuffix()).then(function (ok) {
      if (ok && window.PHONICS) return true;
      phonicsPromise = null;
      return false;
    });
    return phonicsPromise;
  }

  function cardFromLex(word) {
    return {
      id: word.id,
      thai: word.thai,
      roman: word.roman,
      zh: word.zh,
      pos: word.pos,
      level: word.level,
      scene: word.scene,
      tip: word.tip || "",
      kind: word.kind || "n",
      exThai: word.exThai,
      exRoman: word.exRoman,
      exZh: word.exZh,
      gloss: "zh"
    };
  }

  function toneName(syllable) {
    if (/[àèìòù]|\u0300/.test(syllable)) return "低";
    if (/[âêîôû]|\u0302/.test(syllable)) return "降";
    if (/[áéíóú]|\u0301/.test(syllable)) return "高";
    if (/[ǎěǐǒǔ]|\u030c/.test(syllable)) return "升";
    return "中";
  }

  function toneLine(roman) {
    return String(roman || "").split(/[\s-]+/).filter(Boolean).map(toneName).join(" · ");
  }

  function fillParticle(text, gender, kind) {
    const th = gender === "f" ? (kind === "q" ? "คะ" : "ค่ะ") : "ครับ";
    const ro = gender === "f" ? (kind === "q" ? "khá" : "khâ") : "khráp";
    return String(text || "").replace(/\{p\}/g, th).replace(/\{pr\}/g, ro);
  }

  function spokenLines(word) {
    if (!word.exThai) {
      return (word.examples || []).map(function (line) {
        return { thai: line.thai, roman: line.roman || "", zh: line.zh || "", who: "" };
      });
    }
    const has = word.exThai.indexOf("{p}") >= 0;
    const genders = has ? ["m", "f"] : [""];
    return genders.map(function (gender) {
      const thai = fillParticle(word.exThai, gender || "m", word.kind);
      const roman = fillParticle(word.exRoman, gender || "m", word.kind);
      let who = gender === "f" ? "女" : gender === "m" ? "男" : "";
      if (!who && thai.indexOf("ครับ") >= 0) who = "男";
      if (!who && (thai.indexOf("ค่ะ") >= 0 || thai.indexOf("คะ") >= 0)) who = "女";
      return { thai: thai, roman: roman, zh: word.exZh, who: who };
    });
  }

  function allWords() {
    const map = {};
    lexList().forEach(function (word) { map[word.id] = cardFromLex(word); });
    ["tones", "polite", "survive", "numbers", "food", "taxi", "market", "repair"].forEach(function (id) {
      lessonWords(id).forEach(function (word) {
        if (!map[word.id]) map[word.id] = word;
      });
    });
    ["A1", "A2", "B1", "B2"].forEach(function (level) {
      fsiWords(level).forEach(function (word) {
        if (!map[word.id]) map[word.id] = word;
      });
    });
    return map;
  }

  let WORD = allWords();

  const BOOKS = [
    { id: "A1", level: "A1", topic: "等级", title: "A1 基础", desc: "问候｜数字｜时间｜家人｜物品｜动作", levelId: "A1" },
    { id: "A2", level: "A2", topic: "等级", title: "A2 进阶", desc: "出行｜问路｜租房｜预约｜采购｜就医｜天气｜行程", levelId: "A2" },
    { id: "B1", level: "B1", topic: "等级", title: "B1 提高", desc: "喜好｜感受｜计划｜经历｜看法", levelId: "B1" },
    { id: "B2", level: "B2", topic: "等级", title: "B2 精通", desc: "说明｜讨论｜解释｜商量｜复杂情况", levelId: "B2" }
  ];

  function sceneBooks() {
    const seen = {};
    const list = [];
    lexList().forEach(function (word) {
      const id = word.level + "-" + word.scene;
      if (seen[id]) return;
      seen[id] = true;
      list.push({
        id: id,
        level: word.level,
        topic: "话题",
        title: word.level + " · " + word.scene,
        desc: word.scene,
        levelId: word.level,
        scene: word.scene
      });
    });
    return list;
  }

  function phonicsBook() {
    return { id: "phonics", level: "音标", topic: "音标", title: "音标入门", desc: "声调｜声母｜元音｜拼读", levelId: "" };
  }

  function grammarBook() {
    return { id: "grammar", level: "语法", topic: "语法", title: "语法学习", desc: "常用句式与助词", levelId: "" };
  }

  function courseTrackTitle(id) {
    if (id === "phonics") return phonicsBook().title;
    if (id === "grammar") return grammarBook().title;
    const book = BOOKS.filter(function (item) { return item.id === id; })[0];
    return book ? book.title : id;
  }

  function courseCurrentBadge(on) {
    if (!on) return "";
    return '<p class="course-current"><span class="course-current-check" aria-hidden="true">✓</span>当前课程</p>';
  }

  function bookById(id) {
    if (id === "phonics") return phonicsBook();
    if (id === "grammar") return grammarBook();
    if (id === "star") return { id: "star", level: "生词", topic: "生词", title: "生词本", desc: "单独收藏的词" };
    const custom = (local.custom || []).filter(function (book) { return book.id === id; })[0];
    if (custom) return { id: custom.id, level: "自建", topic: "自建", title: custom.title, desc: "自己整理的词本", wordIds: custom.wordIds || [] };
    return BOOKS.filter(function (book) { return book.id === id; })[0] || sceneBooks().filter(function (book) { return book.id === id; })[0] || BOOKS[0];
  }

  function bookWords(book) {
    if (book.id === "star") return local.stars.map(function (id) { return WORD[id]; }).filter(Boolean);
    if (book.wordIds) return book.wordIds.map(function (id) { return WORD[id]; }).filter(Boolean);
    if (book.scene && book.levelId) {
      return lexList().filter(function (word) {
        return word.level === book.levelId && word.scene === book.scene;
      }).map(cardFromLex);
    }
    if (book.levelId) return lexList().filter(function (word) { return word.level === book.levelId; }).map(cardFromLex);
    if (book.fsi) return fsiWords(book.fsi);
    const list = [];
    (book.from || []).forEach(function (id) { lessonWords(id).forEach(function (word) { list.push(word); }); });
    return list;
  }

  const UI = {
    view: "home",
    bookId: local.bookId || "A1",
    queue: [],
    index: 0,
    flipped: false,
    noteOpen: false,
    done: false,
    round: { known: 0, unknown: 0 },
    misses: {},
    freshIds: [],
    ask: null,
    query: "",
    picked: {},
    authMode: "login",
    authError: "",
    authBusy: false,
    quiz: null,
    draftName: "",
    lessonId: "",
    notesOpen: false,
    phonics: { lesson: "", pane: "", studyKind: "", studyIndex: 0, studyDone: false, batch: "a", quiz: null, deck: [], index: 0, flipped: false, deckDone: false, showLetter: false, build: { onset: "g", vowel: "aa", tone: "mid" }, point: null, pointThai: "" },
    nav: [],
    courseLevel: local.courseLevel || "A1",
    courseFilter: "全部",
    coursePane: "",
    courseFocus: "",
    courseMode: "",
    courseTrack: "",
    courseDone: false,
    homeSlide: 0,
    openBook: "",
    booksSeries: "",
    bucket: "",
    courseUnit: "",
    lexQuery: "",
    sayLesson: "",
    sayAt: 0,
    sayMode: "listen",
    sayPhase: "",
    sayResult: null
  };
  let saySpoken = "";
  let sayRun = 0;
  let sayHolding = false;
  const sayAudio = { stream: null, ctx: null, rec: null, timer: 0, raf: 0 };

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  // 设置页等复杂含义旁的 ⓘ：点开短说明（商用 App 风，不堆长文）。
  const INFO_TIPS = {
    "cloud-tts": "打开后优先用云端语音读泰语；关闭则优先本机语音，失败时再自动改用云端。",
    quiz: "短测几个词，给出建议起始等级（A1 / A2 / B1）。",
    backup: "导出或导入本机的学习进度、笔记与词本设置。不会自动上传云端。",
    voice: "例句句尾礼貌词：男生用 ครับ，女生用 ค่ะ。可选只显示一种或两种都显示。"
  };

  function infoMark(id) {
    const text = INFO_TIPS[id] || "";
    if (!text) return "";
    return '<button type="button" class="info-mark" data-act="info-open" data-info="' + esc(id) + '" aria-label="说明" aria-expanded="false">ⓘ</button>';
  }

  function hideInfoPop() {
    const pop = document.getElementById("info-pop");
    if (pop) pop.hidden = true;
    document.querySelectorAll(".info-mark[aria-expanded='true']").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function showInfoPop(anchor, text) {
    let pop = document.getElementById("info-pop");
    if (!pop) {
      pop = document.createElement("div");
      pop.id = "info-pop";
      pop.className = "info-pop";
      pop.setAttribute("role", "dialog");
      pop.hidden = true;
      document.body.appendChild(pop);
    }
    pop.textContent = text;
    pop.hidden = false;
    document.querySelectorAll(".info-mark[aria-expanded='true']").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
    if (anchor) anchor.setAttribute("aria-expanded", "true");
    const pad = 12;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(280, window.innerWidth - pad * 2);
    pop.style.width = width + "px";
    pop.style.left = "0px";
    pop.style.top = "0px";
    const size = pop.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - size.width / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - size.width - pad));
    let top = rect.bottom + 8;
    if (top + size.height > window.innerHeight - pad) {
      top = Math.max(pad, rect.top - size.height - 8);
    }
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }

  let playToken = 0;
  let playingButton = null;
  let playingHorn = null;

  function hornMarkup(thai) {
    const q = encodeURIComponent(thai || "");
    return '<button type="button" class="horn" data-act="speak" data-thai="' + q + '" aria-label="朗读"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="horn-body" d="M4 9v6h3.5L13 19.5v-15L7.5 9H4z"/><path class="horn-wave" d="M16 9.2c1.2.8 1.8 1.7 1.8 2.8s-.6 2-1.8 2.8"/><path class="horn-wave horn-wave-2" d="M18.2 7c1.8 1.3 2.8 2.8 2.8 5s-1 3.7-2.8 5"/></svg></button>';
  }

  function clearHorn() {
    if (!playingHorn) return;
    playingHorn.classList.remove("is-playing");
    playingHorn.removeAttribute("aria-pressed");
    playingHorn = null;
  }

  function armHorn(button) {
    clearHorn();
    if (!button) return;
    let horn = button.classList.contains("horn") ? button : null;
    if (!horn) {
      const scope = button.closest(".roman-line") || button.closest(".say-row") || (button.classList.contains("fab") ? document.querySelector(".face-front") : null);
      horn = scope ? scope.querySelector(".horn") : null;
    }
    if (!horn) return;
    horn.classList.add("is-playing");
    horn.setAttribute("aria-pressed", "true");
    playingHorn = horn;
  }

  function paintPlayButton(button) {
    if (!button || button.querySelector(".play-bars")) return;
    const label = String(button.textContent || "").replace(/^▶\s*/, "").trim();
    button.textContent = "";
    button.insertAdjacentHTML("beforeend", '<span class="play-tri" aria-hidden="true">▶</span><span class="play-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="play-label"></span><i class="play-bar"></i>');
    button.querySelector(".play-label").textContent = label;
  }

  function endPlay(button) {
    const node = button || playingButton;
    if (node) {
      node.classList.remove("is-playing");
      node.removeAttribute("aria-pressed");
      const bar = node.querySelector(".play-bar");
      if (bar) bar.style.width = "0%";
      if (node === playingButton) playingButton = null;
    }
    clearHorn();
  }

  function speak(thai, gender, slow, button) {
    if (!thai || !window.Speech) return;
    if (button && button.classList.contains("is-playing")) {
      playToken += 1;
      Speech.stop();
      endPlay(button);
      return;
    }
    const token = ++playToken;
    endPlay();
    if (button && button.classList.contains("say-play")) {
      paintPlayButton(button);
      button.classList.add("is-playing");
      button.setAttribute("aria-pressed", "true");
      playingButton = button;
    }
    armHorn(button);
    const tip = window.Speech.maybeTip && Speech.maybeTip();
    if (tip) toast(tip);
    Speech.speak(thai, {
      gender: gender || "",
      slow: !!slow,
      preferCloud: !!local.preferCloudTts,
      onProgress: function (ratio) {
        if (token !== playToken || !button) return;
        const bar = button.querySelector(".play-bar");
        if (bar) bar.style.width = Math.round(Math.max(0, Math.min(1, ratio)) * 100) + "%";
      }
    }).then(function (ok) {
      if (token !== playToken) return;
      endPlay(button);
      if (!ok) toast("没有播放出来。请检查网络；也可在设置中查看朗读说明。");
    });
  }

  function romanBits(roman, thai) {
    const word = encodeURIComponent(thai || "");
    const bits = String(roman || "").split(/(\s+)/).map(function (part) {
      if (!part || /^\s+$/.test(part)) return esc(part);
      return part.split("-").map(function (syl) {
        return '<button type="button" class="syl" data-act="speak" data-thai="' + word + '" title="听这个读音">' + esc(syl) + "</button>";
      }).join('<span class="syl-dash">-</span>');
    }).join("");
    return '<span class="roman-line">' + bits + hornMarkup(thai) + "</span>";
  }

  function current() {
    return UI.queue[UI.index] || null;
  }

  function levelOrder() {
    return ["A1", "A2", "B1", "B2"];
  }

  function wordMastered(id) {
    const card = Store.card(id);
    return !!(card && card.reps >= 2 && card.interval >= 3);
  }

  function wordRetired(id) {
    const card = Store.card(id);
    return !!(card && (card.retired || card.reps >= 3));
  }

  function levelComplete(levelId) {
    const words = lexList().filter(function (word) { return word.level === levelId; });
    return words.length > 0 && words.every(function (word) { return wordMastered(word.id); });
  }

  function isLocked(book) {
    if (!book || !book.levelId) return false;
    const index = levelOrder().indexOf(book.levelId);
    if (index <= 0) return false;
    return !levelComplete(levelOrder()[index - 1]);
  }

  function isLevelBook(book) {
    return !!(book && BOOKS.some(function (item) { return item.id === book.id; }));
  }

  function bookProgress(book) {
    if (book && book.id === "phonics") {
      const bag = Store.phonics();
      const steps = ["l1", "l2", "l3", "l4", "l5"];
      const mastered = steps.filter(function (id) { return bag.passed && bag.passed[id]; }).length;
      return {
        total: 5,
        mastered: mastered,
        locked: false,
        status: mastered === 5 ? "done" : mastered ? "active" : "",
        width: Math.round(100 * mastered / 5)
      };
    }
    const words = bookWords(book);
    let mastered = 0;
    let seen = 0;
    words.forEach(function (word) {
      if (Store.card(word.id)) seen += 1;
      if (wordMastered(word.id)) mastered += 1;
    });
    const total = words.length;
    const locked = isLocked(book) && !isLevelBook(book);
    let status = "";
    if (locked) status = "lock";
    else if (total && mastered === total) status = "done";
    else if (seen > 0 || savedSession(book.id)) status = "active";
    return {
      total: total,
      mastered: mastered,
      locked: locked,
      status: status,
      width: total ? Math.round(100 * mastered / total) : 0
    };
  }

  function rememberBook(id) {
    const book = bookById(id);
    UI.bookId = id;
    local.bookId = id;
    const track = book.scene ? book.levelId : (book.levelId || "");
    if (levelOrder().indexOf(track) >= 0) {
      local.recent = [track].concat((local.recent || []).filter(function (item) { return item !== track; })).slice(0, 3);
    }
    saveLocal();
  }

  function savedSession(bookId) {
    const saved = (local.openStudy || {})[bookId];
    if (!saved || !saved.ids || !saved.ids.length) return null;
    if (saved.index >= saved.ids.length) return null;
    return saved;
  }

  function saveStudy() {
    if (UI.courseMode) return;
    if (UI.view !== "study" || UI.done || !UI.queue.length) return;
    local.openStudy = local.openStudy || {};
    local.openStudy[UI.bookId] = {
      ids: UI.queue.map(function (word) { return word.id; }),
      index: UI.index,
      known: UI.round.known,
      unknown: UI.round.unknown,
      misses: UI.misses,
      freshIds: UI.freshIds || []
    };
    saveLocal();
  }

  function clearStudy() {
    if (UI.courseMode) return;
    if (local.openStudy && local.openStudy[UI.bookId]) {
      delete local.openStudy[UI.bookId];
      saveLocal();
    }
  }

  function restoreStudy(bookId) {
    const saved = savedSession(bookId);
    if (!saved) return false;
    const queue = saved.ids.map(function (id) { return WORD[id]; });
    if (queue.some(function (word) { return !word; })) return false;
    rememberBook(bookId);
    UI.queue = queue;
    UI.freshIds = saved.freshIds || [];
    UI.index = saved.index;
    UI.flipped = false;
    UI.done = false;
    UI.noteOpen = false;
    UI.ask = null;
    UI.round = { known: saved.known || 0, unknown: saved.unknown || 0 };
    UI.misses = saved.misses || {};
    UI.view = "study";
    return true;
  }

  function startStudy(bookId) {
    UI.courseMode = "";
    UI.courseTrack = "";
    UI.courseDone = false;
    const requested = bookId || UI.bookId;
    const requestedBook = bookById(requested);
    if (requested === "phonics") {
      if (!window.PHONICS) {
        toast("音标下载中，请稍候");
        loadPhonics().then(function (ok) {
          if (ok) startStudy("phonics");
          else toast("音标下载失败，请检查网络后再试");
        });
        return;
      }
      rememberBook("phonics");
      UI.phonics.lesson = "";
      UI.phonics.quiz = null;
      UI.view = "phonics";
      return;
    }
    if (bookPending(requestedBook)) {
      wantBook(requestedBook);
      return;
    }
    if (isLocked(requestedBook) && !isLevelBook(requestedBook)) {
      toast("完成前置等级词本后解锁。");
      return;
    }
    if (restoreStudy(requested)) return;
    rememberBook(requested);
    const book = bookById(UI.bookId);
    const words = bookWords(book);
    const today = Store.dateKey();
    const reviewN = Math.max(0, local.dailyReview != null ? Number(local.dailyReview) : Math.round(local.dailyNew * Number(local.reviewRatio)));
    const pool = words.filter(function (word) { return !wordRetired(word.id); });
    const due = pool.filter(function (word) {
      const card = Store.card(word.id);
      return card && card.due <= today;
    }).slice(0, reviewN || pool.length);
    const fresh = pool.filter(function (word) { return !Store.card(word.id); }).slice(0, local.dailyNew);
    let queue = arrangeQueue(due, fresh, studyOrder());
    if (!queue.length) queue = pool.slice(0, local.dailyNew);
    if (!queue.length) {
      toast("这本词书的词都已完全掌握，不必再复习。");
      return;
    }
    UI.queue = queue;
    UI.freshIds = fresh.map(function (word) { return word.id; });
    UI.index = 0;
    UI.flipped = false;
    UI.done = false;
    UI.noteOpen = false;
    UI.ask = null;
    UI.round = { known: 0, unknown: 0 };
    UI.misses = {};
    UI.view = "study";
    saveStudy();
  }

  function studyMode() {
    if (local.mode === "hear-word" || local.mode === "hear-sent") return local.mode;
    return "card";
  }

  function studyOrder() {
    if (local.order === "new" || local.order === "mix") return local.order;
    return "review";
  }

  function arrangeQueue(due, fresh, order) {
    if (order === "new") return fresh.concat(due);
    if (order === "mix") {
      const out = [];
      const n = Math.max(due.length, fresh.length);
      for (let i = 0; i < n; i += 1) {
        if (i < due.length) out.push(due[i]);
        if (i < fresh.length) out.push(fresh[i]);
      }
      return out;
    }
    return due.concat(fresh);
  }

  function startLesson(id) {
    const lesson = findLesson(id);
    if (!lesson) return;
    if (lessonLocked(lesson)) {
      toast("完成上一单元后解锁。");
      return;
    }
    const words = courseWordList(lesson);
    if (!words.length) {
      toast("本课还没有生词。");
      return;
    }
    const rec = courseRec(lesson.id);
    rec.started = true;
    local.courseProgress[lesson.id] = rec;
    saveLocal();
    beginCourseQueue(words.slice(), "learn", lesson.id);
  }

  function dayLog() {
    const today = Store.dateKey();
    if (!local.dayLog || local.dayLog.date !== today) {
      local.dayLog = { date: today, newIds: [], reviewIds: [], seconds: 0, lessons: [] };
    }
    local.dayLog.newIds = local.dayLog.newIds || [];
    local.dayLog.reviewIds = local.dayLog.reviewIds || [];
    local.dayLog.lessons = local.dayLog.lessons || [];
    local.dayLog.seconds = Number(local.dayLog.seconds) || 0;
    return local.dayLog;
  }

  function reviewPlan() {
    return Math.max(0, local.dailyReview != null ? Number(local.dailyReview) : Math.round(Number(local.dailyNew) * Number(local.reviewRatio)));
  }

  function studySeconds() {
    const log = dayLog();
    let extra = 0;
    if (studyStamp && UI.view === "study" && !UI.courseMode) extra = Math.round((Date.now() - studyStamp) / 1000);
    return log.seconds + Math.max(0, extra);
  }

  function studyTimeLabel() {
    const sec = studySeconds();
    const min = Math.floor(sec / 60);
    if (sec > 0 && min < 1) return "1 min";
    return min + " min";
  }

  function flushStudyClock() {
    if (!studyStamp) return;
    const log = dayLog();
    const delta = Math.round((Date.now() - studyStamp) / 1000);
    studyStamp = 0;
    if (delta > 0 && delta < 3 * 60 * 60) {
      log.seconds += delta;
      saveLocal();
    }
  }

  function tallyCard(word) {
    if (!word || UI.courseMode || !WORD[word.id]) return;
    const log = dayLog();
    const id = word.id;
    if ((UI.freshIds || []).indexOf(id) >= 0) {
      if (log.newIds.indexOf(id) < 0) log.newIds.push(id);
    } else if (log.newIds.indexOf(id) < 0 && log.reviewIds.indexOf(id) < 0) {
      log.reviewIds.push(id);
    }
    saveLocal();
  }

  function openSummary() {
    flushStudyClock();
    UI.view = "summary";
    UI.done = false;
    UI.queue = [];
    UI.courseMode = "";
    UI.courseTrack = "";
    UI.nav = [{ view: "home", bookId: UI.bookId, lessonId: "", ph: "", unit: 0, pane: "", focus: "", open: "" }];
    draw();
  }

  function finishIfNeeded() {
    if (UI.index < UI.queue.length) return false;
    const learning = UI.courseMode === "learn" && UI.courseTrack && findLesson(UI.courseTrack);
    const reviewing = !!UI.courseMode && !learning;
    UI.done = true;
    if (learning) {
      const rec = courseRec(UI.courseTrack);
      rec.started = true;
      rec.done = true;
      local.courseProgress[UI.courseTrack] = rec;
      const log = dayLog();
      if (log.lessons.indexOf(UI.courseTrack) < 0) log.lessons.push(UI.courseTrack);
      UI.courseDone = true;
    } else if (reviewing) {
      UI.courseDone = true;
    }
    local.rounds = (local.rounds || []).concat([{
      date: Store.dateKey(),
      known: UI.round.known,
      unknown: UI.round.unknown
    }]).slice(-60);
    saveLocal();
    clearStudy();
    Store.award("practice:cards", 16);
    Store.noteSession();
    if (!reviewing) {
      openSummary();
      return true;
    }
    UI.courseMode = "";
    UI.courseTrack = "";
    return false;
  }

  function advance() {
    UI.index += 1;
    UI.flipped = false;
    UI.noteOpen = false;
    if (finishIfNeeded()) return;
    saveStudy();
    draw();
    speakCurrent();
  }

  function speakCurrent() {
    const word = current();
    if (!word || UI.done || UI.view !== "study") return;
    const mode = studyMode();
    if (mode !== "hear-word" && mode !== "hear-sent") return;
    const ask = currentAsk();
    if (!ask || ask.pick >= 0) return;
    speak(ask.thai, ask.gender ? { gender: ask.gender } : {});
  }

  function markKnown() {
    const word = current();
    if (!word) return;
    tallyCard(word);
    if (WORD[word.id]) Store.grade(word.id, true);
    UI.round.known += 1;
    advance();
  }

  function markUnknown() {
    const word = current();
    if (!word) return;
    tallyCard(word);
    if (WORD[word.id]) Store.grade(word.id, false);
    UI.round.unknown += 1;
    UI.misses[word.id] = (UI.misses[word.id] || 0) + 1;
    if (UI.misses[word.id] < 3) UI.queue.push(word);
    if (WORD[word.id] && local.stars.indexOf(word.id) < 0) {
      local.stars.push(word.id);
      saveLocal();
    }
    advance();
  }

  function presentAfter(before) {
    noteNav(before);
    if (UI.view === "study" && !UI.courseMode && !UI.done && !studyStamp) studyStamp = Date.now();
    draw();
    if (UI.view === "study") speakCurrent();
  }

  function leaveStudy() {
    if (UI.view !== "study") return;
    flushStudyClock();
    UI.courseDone = false;
    if (UI.courseMode) {
      UI.courseMode = "";
      UI.courseTrack = "";
      return;
    }
    saveStudy();
  }

  function toggleStar(id) {
    if (!WORD[id]) return;
    const at = local.stars.indexOf(id);
    if (at >= 0) local.stars.splice(at, 1);
    else local.stars.push(id);
    saveLocal();
    toast(at >= 0 ? "已从生词本移出。" : "已加入生词本。");
    draw();
  }

  function saveNote(id, text) {
    if (!WORD[id]) return;
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

  function atSectionRoot() {
    if (UI.view === "home" || UI.view === "profile") return true;
    if (UI.view === "books" && !UI.booksSeries && !String(UI.lexQuery || "").trim()) return true;
    if (UI.view === "course" && !UI.lessonId && !UI.coursePane && !UI.courseUnit) return true;
    return false;
  }

  function canBack() {
    return !atSectionRoot() && UI.nav.length > 0;
  }

  function goBack(swipeDx) {
    if (atSectionRoot()) return false;
    const frame = UI.nav.pop();
    if (!frame) return false;
    const swiping = typeof swipeDx === "number";
    let sheet = null;
    if (swiping) {
      const main = document.querySelector(".main-slot > .main");
      if (main && main.parentNode) {
        sheet = main;
        main.parentNode.removeChild(main);
      }
    }
    if (UI.view === "study") leaveStudy();
    stopSayCapture();
    UI.view = frame.view;
    UI.bookId = frame.bookId;
    local.bookId = frame.bookId;
    UI.lessonId = frame.lessonId || "";
    UI.phonics.lesson = frame.ph || "";
    UI.phonics.pane = frame.phPane || "";
    UI.unit = frame.unit || 0;
    UI.coursePane = frame.pane || "";
    UI.courseFocus = frame.focus || "";
    UI.openBook = frame.open || "";
    UI.booksSeries = frame.series || "";
    UI.bucket = frame.bucket || "";
    UI.courseUnit = frame.cu || "";
    navMotion = swiping ? "cut" : "back";
    draw();
    if (sheet) finishSwipe(sheet, swipeDx);
    return true;
  }

  function finishSwipe(sheet, fromX) {
    const slot = document.querySelector(".main-slot");
    if (!slot) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = slot.clientWidth || window.innerWidth || 1;
    const start = Math.max(0, Math.min(width, fromX));
    sheet.classList.add("swipe-sheet");
    sheet.style.transition = "none";
    sheet.style.transform = "translate3d(" + start + "px,0,0)";
    slot.classList.add("is-swiping");
    slot.appendChild(sheet);
    if (reduce) {
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
      slot.classList.remove("is-swiping");
      return;
    }
    const remain = 1 - start / width;
    const ms = Math.max(160, Math.round(280 * remain));
    window.requestAnimationFrame(function () {
      sheet.style.transition = "transform " + ms + "ms cubic-bezier(0.22, 0.61, 0.36, 1)";
      sheet.style.transform = "translate3d(100%,0,0)";
    });
    let gone = false;
    function done(event) {
      if (gone) return;
      if (event && event.target !== sheet) return;
      gone = true;
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
      slot.classList.remove("is-swiping");
    }
    sheet.addEventListener("transitionend", done);
    window.setTimeout(done, ms + 80);
  }

  function backButton() {
    return '<button type="button" class="back-key" data-act="back" aria-label="返回"><svg viewBox="0 0 22 24" aria-hidden="true"><path d="M18 1.2 L2 12 L18 22.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
  }

  function snapshot() {
    return {
      view: UI.view,
      bookId: UI.bookId,
      lessonId: UI.lessonId,
      ph: UI.phonics.lesson,
      phPane: (UI.phonics && UI.phonics.pane) || "",
      unit: UI.unit,
      pane: UI.coursePane || "",
      focus: UI.courseFocus || "",
      open: UI.openBook || "",
      series: UI.booksSeries || "",
      bucket: UI.bucket || "",
      cu: UI.courseUnit || ""
    };
  }

  function noteNav(before) {
    const now = snapshot();
    if (now.view === before.view && now.bookId === before.bookId && now.lessonId === before.lessonId && now.ph === before.ph && now.unit === before.unit && now.pane === (before.pane || "") && now.focus === (before.focus || "") && (now.open || "") === (before.open || "") && (now.series || "") === (before.series || "") && (now.bucket || "") === (before.bucket || "") && (now.cu || "") === (before.cu || "")) return;
    UI.nav.push(before);
    if (UI.nav.length > 40) UI.nav.shift();
  }

  // 音标可计「课」：单元内最小完成单元（声调 5 课、声母 3 批、后三单元各 1 课）。
  const PHONICS_COURSE_IDS = ["l1a", "l1b", "l1c", "l1d", "l1e", "l2a", "l2b", "l2c", "l3", "l4", "l5"];

  function dailyPhonicsGoal() {
    const n = Number(local.dailyPhonics);
    if (n >= 1 && n <= 5) return n;
    return 1;
  }

  function phonicsCoursesDoneToday() {
    const bag = Store.phonics();
    const today = Store.dateKey();
    const passed = bag.passed || {};
    return PHONICS_COURSE_IDS.filter(function (id) { return passed[id] === today; }).length;
  }

  function phonicsCoursesPending() {
    const bag = Store.phonics();
    const passed = bag.passed || {};
    return PHONICS_COURSE_IDS.filter(function (id) { return !passed[id]; });
  }

  function dailyCourseGoal() {
    const n = Number(local.dailyLessons);
    if (n >= 1 && n <= 5) return n;
    return 1;
  }

  function phonicsWheelInner() {
    const current = dailyPhonicsGoal();
    const pending = phonicsCoursesPending().length;
    return [1, 2, 3, 4, 5].map(function (count) {
      const days = pending ? Math.ceil(pending / count) : 0;
      return '<button type="button" class="wheel-item' + (count === current ? " is-on" : "") + '" data-act="wheel-pick" data-kind="phonics" data-lessons="' + count + '">每天 ' + count + " 课" + (days ? "，约 " + days + " 天" : "") + "</button>";
    }).join("");
  }

  function loadOptions() {
    return [[5, 10], [5, 15], [10, 20], [10, 30], [15, 30], [20, 40], [20, 60]];
  }

  function daysFor(book, dailyNew) {
    const progress = bookProgress(book);
    const left = Math.max(0, progress.total - progress.mastered);
    if (!left) return 0;
    return Math.ceil(left / Math.max(1, dailyNew));
  }

  function navIcon(view) {
    const svg = '<svg class="nav-ico" viewBox="0 0 24 24" aria-hidden="true">';
    if (view === "home") {
      return svg +
        '<path d="M4.2 11.2 12 4.4l7.8 6.8v7.4a1.4 1.4 0 0 1-1.4 1.4h-4.1v-5.1H9.7v5.1H5.6a1.4 1.4 0 0 1-1.4-1.4z" fill="currentColor" opacity=".14"/>' +
        '<path d="M4.2 11.2 12 4.4l7.8 6.8v7.4a1.4 1.4 0 0 1-1.4 1.4h-4.1v-5.1H9.7v5.1H5.6a1.4 1.4 0 0 1-1.4-1.4z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>' +
        '<circle cx="12" cy="11.2" r="1.15" fill="currentColor"/></svg>';
    }
    if (view === "books") {
      return svg +
        '<path d="M5.2 5.4c2.2-.5 4.1.1 5.6 1.3v12.1c-1.6-1-3.5-1.5-5.6-1.1z" fill="currentColor" opacity=".16"/>' +
        '<path d="M18.8 5.4c-2.2-.5-4.1.1-5.6 1.3v12.1c1.6-1 3.5-1.5 5.6-1.1z" fill="currentColor" opacity=".1"/>' +
        '<path d="M12 6.6c-1.6-1.1-3.6-1.6-6-1.2v12.8c2.4-.4 4.4.1 6 1.2 1.6-1.1 3.6-1.6 6-1.2V5.4c-2.4-.4-4.4.1-6 1.2z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>' +
        '<path d="M12 6.6v12.8" fill="none" stroke="currentColor" stroke-width="1.55"/></svg>';
    }
    if (view === "course") {
      return svg +
        '<path d="M5 7h9.8a2.2 2.2 0 0 1 2.2 2.2v4.2a2.2 2.2 0 0 1-2.2 2.2H9.4L6.2 18.3V15.4H5A2.2 2.2 0 0 1 2.8 13.2V9.2A2.2 2.2 0 0 1 5 7z" fill="currentColor" opacity=".14"/>' +
        '<path d="M5 7h9.8a2.2 2.2 0 0 1 2.2 2.2v4.2a2.2 2.2 0 0 1-2.2 2.2H9.4L6.2 18.3V15.4H5A2.2 2.2 0 0 1 2.8 13.2V9.2A2.2 2.2 0 0 1 5 7z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>' +
        '<path d="M6.6 10.2h7.2M6.6 12.6h4.8" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/></svg>';
    }
    if (view === "stats") {
      return svg +
        '<rect x="4.2" y="13.2" width="3.2" height="6.6" rx="1" fill="currentColor" opacity=".16"/>' +
        '<rect x="10.4" y="9.2" width="3.2" height="10.6" rx="1" fill="currentColor" opacity=".16"/>' +
        '<rect x="16.6" y="5.8" width="3.2" height="14" rx="1" fill="currentColor" opacity=".16"/>' +
        '<path d="M5.8 19.8V13.2M12 19.8V9.2M18.2 19.8V5.8" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>';
    }
    return svg +
      '<circle cx="12" cy="8.1" r="3.15" fill="currentColor" opacity=".16"/>' +
      '<circle cx="12" cy="8.1" r="3.15" fill="none" stroke="currentColor" stroke-width="1.55"/>' +
      '<path d="M5.6 19.2c1-3.1 3.3-4.7 6.4-4.7s5.4 1.6 6.4 4.7" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/></svg>';
  }

  function streakIcon() {
    return '<span class="home-streak-ico" aria-hidden="true"><svg viewBox="0 0 48 48"><defs><linearGradient id="rt-flame" x1="12" y1="8" x2="34" y2="42" gradientUnits="userSpaceOnUse"><stop class="flame-stop-a" offset="0"/><stop class="flame-stop-b" offset="1"/></linearGradient></defs><path d="M24.2 6.5c1.8 4.2-.2 7.1-2.1 9.4-1.9 2.3-4.2 4.4-3.5 7.7.4 1.8 1.7 3.2 3.2 4.1-3.1-.2-5.7-2.7-6.2-5.9-.7-4.6 2.1-7.9 4.4-10.8C22.1 8.5 23.2 7.3 24.2 6.5z" fill="url(#rt-flame)"/><path d="M30.8 16.2c.9 3.4-.7 5.8-2.4 7.8-1.5 1.8-3 3.4-2.2 6 .4 1.3 1.4 2.3 2.6 2.9-4.8 1.2-9.1-1.8-10.1-6.5-1.2-5.6 2.6-9.4 5.7-12.7 1.4-1.5 2.9-3 4.1-4.8 1.2 2.4 1.6 4.7 2.3 7.3z" fill="currentColor" opacity=".28"/><path d="M24 40.2c5.7 0 9.8-3.9 9.8-9.2 0-4.4-2.5-6.9-5.1-9.6-1.1 2.6-3.3 3.8-5 5.2-.2-3.4 1.1-5.7 2.6-8.1C22.6 14.8 14.2 20.4 14.2 31c0 5.3 4.1 9.2 9.8 9.2z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg></span>';
  }

  function sideLink(label, view, on, locked) {
    return '<button type="button" class="nav-link' + (on ? " is-on" : "") + (locked ? " is-locked" : "") + '" data-act="' + (locked ? "locked" : "go") + '" data-view="' + view + '"' + (locked ? ' title="完成前置等级词本后解锁"' : "") + ">" + navIcon(view) + "<span>" + esc(label) + "</span></button>";
  }

  function pageTitle() {
    if (UI.view === "home") return "RianThai";
    if (UI.view === "books") {
      if (String(UI.lexQuery || "").trim()) return "查词";
      if (UI.booksSeries === "custom") return "自建词本";
      if (UI.booksSeries) return UI.booksSeries + " 系列";
      return "词库";
    }
    if (UI.view === "progress") return "学习进度";
    if (UI.view === "bucket") return bucketName(UI.bucket);
    if (UI.view === "book" || UI.view === "study") {
      if (UI.view === "book") return viewingBook().title;
      if (UI.view === "study" && UI.courseTrack) {
        if (String(UI.courseTrack).indexOf("unit:") === 0) return "复习本单元";
        const tracked = findLesson(UI.courseTrack);
        if (tracked) return (UI.courseMode === "review" ? "复习 · " : "") + tracked.title;
      }
      return bookById(UI.bookId).title;
    }
    if (UI.view === "plan") return "学习计划设置";
    if (UI.view === "profile") return "设置";
    if (UI.view === "notebook") return "生词本";
    if (UI.view === "stats") return "统计";
    if (UI.view === "quiz") return "测评";
    if (UI.view === "auth") return "登录";
    if (UI.view === "texts") {
      if (UI.unit && window.FSI) {
        const unit = FSI.units.filter(function (item) { return item.n === UI.unit; })[0];
        if (unit && unit.zh) return unit.zh;
      }
      return "分级课文";
    }
    if (UI.view === "coursebook") return courseBook().title;
    if (UI.view === "summary") return "今日小结";
    if (UI.view === "course") {
      if (UI.coursePane === "words") return "本课生词";
      if (UI.coursePane === "notes") return "本课笔记";
      const current = findLesson(UI.lessonId);
      if (current) return current.title;
      if (UI.courseUnit) {
        const unit = findUnit(UI.courseUnit);
        return unit ? unit.title : "课程";
      }
      return "课程";
    }
    if (UI.view === "phonics") {
      if (UI.phonics && UI.phonics.pane === "words") return "本课生词";
      if (UI.phonics && UI.phonics.pane === "notes") return "本课笔记";
      const id = (UI.phonics && UI.phonics.lesson) || "";
      const names = {
        l1: "第一单元 · 声调",
        l1a: "声调 · 第 1 课",
        l1b: "声调 · 第 2 课",
        l1c: "声调 · 第 3 课",
        l1d: "声调 · 第 4 课",
        l1e: "声调 · 第 5 课",
        l2: "第二单元 · 声母",
        l2a: "声母 · 中辅音",
        l2b: "声母 · 高辅音",
        l2c: "声母 · 低辅音",
        l3: "第三单元 · 元音",
        l4: "第四单元 · 拼读",
        l5: "第五单元 · 自测",
        letters: "泰文字母",
        review: "音标复习",
        report: "拼读自测报告",
        point: "音节"
      };
      return names[id] || "音标入门";
    }
    return "RianThai";
  }

  function side() {
    const learn = [
      ["home", "首页"],
      ["books", "词库"],
      ["course", "课程"]
    ];
    const system = [
      ["stats", "统计"],
      ["profile", "设置"]
    ];
    return '<aside class="side"><button type="button" class="logo" data-act="go" data-view="home"><span class="logo-mark" aria-hidden="true">ไ</span><b>RianThai</b></button>' +
      '<p class="side-label">词本分级</p>' +
      BOOKS.map(function (book) {
        const progress = bookProgress(book);
        const paused = savedSession(book.id);
        const on = UI.bookId === book.id || (UI.view === "study" && bookById(UI.bookId).id === book.id);
        const detail = "已掌握 " + progress.mastered + " / " + progress.total + (paused ? " · 本轮 " + paused.index + " / " + paused.ids.length : "");
        return '<button type="button" class="book-btn' + (on ? " is-on" : "") + '" data-act="pick-book" data-id="' + esc(book.id) + '"><strong>' + esc(book.title) + "</strong><small>" + detail + "</small></button>";
      }).join("") +
      '<p class="side-label">学习</p>' +
      learn.map(function (item) { return sideLink(item[1], item[0], UI.view === item[0], false); }).join("") +
      '<p class="side-label">系统</p>' +
      system.map(function (item) { return sideLink(item[1], item[0], UI.view === item[0] || (item[0] === "profile" && UI.view === "plan"), false); }).join("") +
      "</aside>";
  }

  function top(title) {
    const bits = UI.view === "study" ? progressBits() : null;
    const label = pageTitle();
    const root = !canBack();
    return '<header class="content-head' + (root ? " is-root" : "") + '">' + (root ? "" : backButton()) + '<p class="content-title">' + esc(label) + "</p></header>" +
      (bits ? '<div class="progress-block"><div class="progress-meta"><span>' + esc(title || label) + "</span><span>已背 " + bits.seen + " / " + bits.total + " · 剩余 " + bits.left + '</span></div><div class="track"><span style="width:' + bits.width + '%"></span></div></div>' : "");
  }

  function bottomNav() {
    const items = [["home", "首页"], ["books", "词库"], ["course", "课程"], ["profile", "我的"]];
    const underMe = { plan: 1, stats: 1, notebook: 1, texts: 1, quiz: 1 };
    return '<nav class="bottom-nav">' + items.map(function (item) {
      const on = UI.view === item[0] || (item[0] === "profile" && underMe[UI.view]);
      return '<button type="button" data-act="go" data-view="' + item[0] + '"' + (on ? ' class="is-on"' : "") + ">" + navIcon(item[0]) + "<span>" + item[1] + "</span></button>";
    }).join("") + "</nav>";
  }

  function shell(body, title) {
    return '<div class="app">' + side() + '<div class="main-slot"><div class="main">' + top(title) + body + "</div></div></div>" + bottomNav() + fab();
  }

  function fab() {
    if (UI.view !== "study" || studyMode() !== "card") return "";
    const word = current();
    const thai = word ? word.thai : "";
    if (!thai) return "";
    return '<button type="button" class="fab" data-act="speak" data-thai="' + encodeURIComponent(thai) + '" aria-label="朗读">听</button>';
  }

  function statusTag(status) {
    if (status === "lock") return '<span class="state state-lock"><svg class="lock-icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.2" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>未解锁</span>';
    if (status === "done") return '<span class="state state-done">已完成</span>';
    if (status === "active") return '<span class="state state-on">进行中</span>';
    return "";
  }

  function actionLabel(status, bookId) {
    if (savedSession(bookId)) return "继续";
    if (status === "done") return "复习";
    if (status === "active") return "继续";
    return "学习";
  }

  function lockTip(book) {
    if (book.levelId === "A2") return "完成A1基础后解锁本词本";
    if (book.levelId === "B1") return "完成A2进阶后解锁本词本";
    if (book.levelId === "B2") return "完成B1提高后解锁本词本";
    return "完成前置等级词本后解锁";
  }

  function home() {
    const picked = bookById(UI.bookId);
    const current = isLocked(picked) && !isLevelBook(picked) ? bookById("A1") : picked;
    const words = bookWords(current);
    const due = words.filter(function (word) {
      const card = Store.card(word.id);
      return card && !wordRetired(word.id) && card.due <= Store.dateKey();
    }).length;
    const fresh = words.filter(function (word) { return !Store.card(word.id); }).length;
    const newCount = Math.min(fresh, local.dailyNew);
    const progress = bookProgress(current);
    const paused = savedSession(current.id);
    const roundBar = paused ? '<p class="progress-label">本轮已背 ' + paused.index + " / " + paused.ids.length + '</p><div class="mini-track"><span style="width:' + Math.round(100 * paused.index / paused.ids.length) + '%"></span></div>' : "";
    const progressName = current.id === "phonics" ? "已完成 " : "已掌握 ";
    const word = '<button type="button" class="book-jump" data-act="book-open" data-id="' + esc(current.id) + '">' + esc(current.title) + '</button><p class="progress-label">' + progressName + progress.mastered + " / " + progress.total + '</p><div class="mini-track"><span style="width:' + progress.width + '%"></span></div>' +
      roundBar +
      '<div class="today-stats"><div><b>' + newCount + '</b><span>新词</span></div><span class="today-dot" aria-hidden="true">·</span><div><b>' + due + '</b><span>复习</span></div></div>' +
      '<div class="row today-actions"><button type="button" class="btn btn-primary" data-act="start" data-id="' + esc(current.id) + '">' + (actionLabel(progress.status, current.id) === "学习" ? "开始" : actionLabel(progress.status, current.id)) + "</button></div>";
    const slide = UI.homeSlide ? 1 : 0;
    const checked = Store.checkInTotal();
    const lit = Store.checkedInToday();
    return '<div class="page home-page">' +
      '<section class="home-hero" aria-label="RianThai">' +
      '<div class="home-mark" aria-hidden="true">ไ</div>' +
      '<div><p class="home-brand">RianThai</p></div></section>' +
      '<button type="button" class="home-streak-row' + (lit ? " is-lit" : "") + '" data-act="go" data-view="stats" aria-label="查看统计">' + streakIcon() +
      '<div><p class="today-streak-label">累计打卡</p><p class="today-streak-num">' + checked + "<span>天</span></p></div></button>" +
      '<section class="today">' +
      '<div class="today-switch" role="tablist"><button type="button" class="today-tab' + (slide === 0 ? " is-on" : "") + '" data-act="home-slide" data-id="0">单词</button><button type="button" class="today-tab' + (slide === 1 ? " is-on" : "") + '" data-act="home-slide" data-id="1">课程</button></div>' +
      '<div class="today-track" data-home-track><div class="today-slide" data-act="book-open" data-id="' + esc(current.id) + '">' + word + '</div><div class="today-slide">' + homeCourseBlock() + "</div></div></section></div>";
  }

  function courseTrackId() {
    if (local.courseLevel === "phonics") return "phonics";
    if (local.courseLevel === "grammar") return "grammar";
    if (["A1", "A2", "B1", "B2"].indexOf(local.courseLevel) >= 0) return local.courseLevel;
    return "A1";
  }

  function courseBook() {
    const id = courseTrackId();
    local.courseLevel = id;
    UI.courseLevel = id;
    if (id === "phonics") return phonicsBook();
    if (id === "grammar") return grammarBook();
    return BOOKS.filter(function (book) { return book.id === id; })[0] || BOOKS[0];
  }

  function coursePack(level) {
    const lessons = ((window.COURSE && COURSE.lessons) || []).filter(function (lesson) { return lesson.level === level; });
    const done = lessons.filter(function (lesson) { return courseRec(lesson.id).done; }).length;
    const pending = lessons.filter(function (lesson) { return !lessonLocked(lesson) && !courseRec(lesson.id).done; });
    const words = {};
    lessons.forEach(function (lesson) {
      (lesson.words || []).forEach(function (id) { words[id] = true; });
    });
    return {
      lessons: lessons,
      done: done,
      total: lessons.length,
      pending: pending,
      words: Object.keys(words).length
    };
  }

  function courseWordsFor(pack, count) {
    const source = pack.pending.length ? pack.pending : pack.lessons;
    let total = 0;
    source.slice(0, count).forEach(function (lesson) { total += (lesson.words || []).length; });
    return total;
  }

  function homeCourseBlock() {
    const book = courseBook();
    const head = '<div class="today-course"><p class="eyebrow">当前课程</p><button type="button" class="book-jump" data-act="course-open">' + esc(book.title) + '<span class="chev" aria-hidden="true">&gt;</span></button>';
    if (book.id === "phonics") {
      const progress = bookProgress(book);
      const goal = dailyPhonicsGoal();
      const pending = phonicsCoursesPending().length;
      const todayPlan = progress.status === "done" ? 0 : Math.min(goal, pending || goal);
      const todayDone = phonicsCoursesDoneToday();
      const label = progress.status === "done" ? "复习" : progress.status === "active" ? "继续" : "开始";
      return head +
        '<p class="progress-label">单元 ' + progress.mastered + " / " + progress.total + "</p>" +
        '<div class="mini-track"><span style="width:' + progress.width + '%"></span></div>' +
        '<div class="today-stats"><div><b>' + todayPlan + '</b><span>今日课</span></div><span class="today-dot" aria-hidden="true">·</span><div><b>' + todayDone + '</b><span>已完成</span></div></div>' +
        '<div class="row today-actions"><button type="button" class="btn btn-primary" data-act="course-today">' + label + "</button></div></div>";
    }
    const pack = coursePack(book.id);
    const locked = book.id === "grammar" ? false : levelCourseLocked(book.id);
    const per = dailyCourseGoal();
    const todayLessons = Math.min(per, pack.pending.length || pack.total);
    const todayWords = locked ? 0 : courseWordsFor(pack, todayLessons);
    const width = pack.total ? Math.round(100 * pack.done / pack.total) : 0;
    const label = locked ? "未解锁" : (pack.pending.length ? "开始" : "复习");
    return head +
      (locked ? '<p class="progress-label">未解锁</p>' : '<p class="progress-label">' + pack.done + " / " + pack.total + "</p>") +
      '<div class="mini-track"><span style="width:' + (locked ? 0 : width) + '%"></span></div>' +
      '<div class="today-stats"><div><b>' + (locked ? 0 : todayLessons) + '</b><span>今日课</span></div><span class="today-dot" aria-hidden="true">·</span><div><b>' + todayWords + '</b><span>生词</span></div></div>' +
      '<div class="row today-actions"><button type="button" class="btn btn-primary" data-act="' + (locked ? "course-locked" : "course-today") + '">' + label + "</button></div></div>";
  }

  function courseWheel(pack) {
    const current = dailyCourseGoal();
    const items = [1, 2, 3, 4, 5].map(function (count) {
      const days = pack.pending.length ? Math.ceil(pack.pending.length / count) : 0;
      const words = courseWordsFor(pack, count);
      const wordBit = words ? "，约 " + words + " 个生词" : "";
      return '<button type="button" class="wheel-item' + (count === current ? " is-on" : "") + '" data-act="wheel-pick" data-kind="course" data-lessons="' + count + '">每天 ' + count + " 课" + wordBit + (days ? "，需要 " + days + " 天" : "") + "</button>";
    }).join("");
    return '<div class="wheel-wrap"><div class="wheel"><div class="wheel-pad"></div>' + items + '<div class="wheel-pad"></div></div></div>';
  }

  function courseQuotaSection(book) {
    if (book.id === "phonics") {
      return '<section class="card tight" style="margin-top:12px"><h2>每日课量</h2>' +
        '<div class="wheel-wrap"><div class="wheel"><div class="wheel-pad"></div>' + phonicsWheelInner() + '<div class="wheel-pad"></div></div></div></section>';
    }
    const pack = coursePack(book.id);
    return '<section class="card tight" style="margin-top:12px"><h2>每日课量</h2>' + courseWheel(pack) + "</section>";
  }

  function phonicsUnitRows() {
    const bag = Store.phonics();
    const p = bag.passed || {};
    const steps = [
      ["l1", "第一单元 · 5 个声调", function () {
        const n = ["l1a", "l1b", "l1c", "l1d", "l1e"].filter(function (key) { return !!p[key]; }).length;
        return "已完成 " + n + " / 5 课";
      }],
      ["l2", "第二单元 · 21 个声母", function () { return p.l2 ? "已完成" : "未完成"; }],
      ["l3", "第三单元 · 长短元音", function () { return p.l3 ? "已完成" : "未完成"; }],
      ["l4", "第四单元 · 音节拼读", function () { return p.l4 ? "已完成" : "未完成"; }],
      ["l5", "第五单元 · 综合自测", function () { return p.l5 ? "已完成" : "未完成"; }]
    ];
    return steps.map(function (item, index) {
      const id = item[0];
      const opened = window.PHONICS ? PHONICS.openLesson(id, bag) : (id === "l1" || !!p[["", "l1", "l2", "l3", "l4"][index]]);
      if (!opened) {
        return '<div class="unit-row is-locked">' + courseLockIcon() +
          '<span class="grow"><b>' + esc(item[1]) + '</b><small>完成上一单元解锁</small></span>' +
          '<span class="state state-lock">未解锁</span></div>';
      }
      return '<button type="button" class="unit-row" data-act="phonics-open" data-id="' + id + '">' +
        '<span class="grow"><b>' + esc(item[1]) + '</b><small>' + esc(item[2]()) + "</small></span>" +
        '<span class="chev" aria-hidden="true">&gt;</span></button>';
    }).join("");
  }

  function courseTaskPage() {
    const book = courseBook();
    // 首页进入的课程说明页：只保留目录 + 每日课量；换轨道只在「课程」栏。
    if (book.id === "phonics") {
      if (!window.PHONICS) loadPhonics().then(function (ok) { if (ok) draw(); });
      return '<div class="page course-task">' +
        '<section class="card tight"><h2>目录</h2><div class="course-list">' + (phonicsUnitRows() || '<p class="muted">5 单元</p>') + "</div></section>" +
        courseQuotaSection(book) + "</div>";
    }
    kickLexUpTo(book.id === "grammar" ? "A1" : "B2");
    const rows = courseUnits(book.id).map(function (unit, index) { return unitRow(unit, index); }).join("");
    return '<div class="page course-task">' +
      '<section class="card tight"><h2>目录</h2><div class="course-list">' + (rows || '<p class="muted">暂无课时</p>') + "</div></section>" +
      courseQuotaSection(book) + "</div>";
  }

  function phonicsLessonTitle(kind) {
    const titles = ["日常动作", "人物身体", "事物数量", "时间自然", "情感寒暄"];
    const index = Math.max(0, Math.min(4, (String(kind || "l1a").charCodeAt(2) || 97) - 97));
    return "第 " + (index + 1) + " 课 · " + titles[index];
  }

  function phonicsWordsPage(kind) {
    if (!window.PHONICS) return '<div class="page"><h1>本课生词</h1><p class="hint">音标下载中，请稍候…</p></div>';
    const index = Math.max(0, Math.min(4, (String(kind || "l1a").charCodeAt(2) || 97) - 97));
    const words = PHONICS.toneStudyWords(index);
    const rows = words.map(function (word) {
      return '<article class="word-row"><div class="grow"><p class="th" lang="th">' + esc(word.thai) + '</p><p class="ipa">' + esc(word.roman || "") + '</p><p class="muted">' + esc(word.zh) + "</p></div></article>";
    }).join("");
    return '<div class="page course-page"><p class="muted">' + esc(phonicsLessonTitle(kind)) + '</p><h1>本课生词</h1><div class="list" style="margin-top:12px">' + (rows || '<p class="muted">暂无</p>') + "</div></div>";
  }

  function phonicsNotesPage(kind) {
    local.lessonNotes = local.lessonNotes || {};
    const note = local.lessonNotes[kind] || "";
    return '<div class="page course-page"><p class="muted">' + esc(phonicsLessonTitle(kind)) + '</p><h1>本课笔记</h1>' +
      '<label class="field"><span>本课笔记</span><textarea id="course-note" rows="5" placeholder="写下这一课的提醒">' + esc(note) + '</textarea></label>' +
      '<button type="button" class="btn btn-primary" data-act="course-note-save" data-id="' + esc(kind) + '" style="margin-top:12px">保存</button></div>';
  }

  function viewingBook() {
    return bookById(UI.openBook || UI.bookId);
  }

  function bookIntro(book) {
    if (book.desc) return book.desc;
    if (book.wordIds) return "自建词本";
    if (book.scene) return book.scene;
    return "";
  }

  function bookScenes(book) {
    const seen = {};
    const list = [];
    bookWords(book).forEach(function (word) {
      if (!word.scene || seen[word.scene]) return;
      seen[word.scene] = true;
      list.push(word.scene);
    });
    return list;
  }

  function coverLine(book) {
    const core = { A1: "日常基础用词", A2: "出门办事用词", B1: "看法与经历", B2: "讨论与说明" };
    if (core[book.id]) return core[book.id];
    if (book.wordIds) return "自己整理的词";
    return "";
  }

  const COVER_HUE = { A1: 208, A2: 152, B1: 28, B2: 268 };
  let sceneOrderCache = null;

  function scenesOf(level) {
    if (!sceneOrderCache) {
      sceneOrderCache = { A1: [], A2: [], B1: [], B2: [] };
      const seen = {};
      sceneBooks().forEach(function (book) {
        const key = book.levelId + "|" + book.scene;
        if (seen[key] || !sceneOrderCache[book.levelId]) return;
        seen[key] = true;
        sceneOrderCache[book.levelId].push(book.scene);
      });
    }
    return sceneOrderCache[level] || [];
  }

  function coverPaint(book) {
    const level = COVER_HUE[book.id] ? book.id : (book.levelId && COVER_HUE[book.levelId] ? book.levelId : "");
    if (!level) return null;
    const hue = COVER_HUE[level];
    let sat = 52;
    let light = 34;
    let ink = "#f4f7fb";
    if (book.id !== level) {
      const list = scenesOf(level);
      let index = list.indexOf(book.scene);
      if (index < 0) index = Math.max(0, list.length - 1);
      const span = Math.max(1, list.length - 1);
      const step = index / span;
      if (step < 0.55) {
        const t = step / 0.55;
        sat = 34 + t * 16;
        light = 94 - t * 12;
        ink = "hsl(" + hue + " 55% 16%)";
      } else {
        const t = (step - 0.55) / 0.45;
        sat = 40 + t * 16;
        light = 32 - t * 10;
        ink = "#f4f7fb";
      }
    }
    return {
      bg: "hsl(" + hue + " " + Math.round(sat) + "% " + Math.round(light) + "%)",
      ink: ink
    };
  }

  function bookCard(book) {
    const pending = bookPending(book);
    const progress = pending ? { total: 0, mastered: 0, locked: false, status: "", width: 0 } : bookProgress(book);
    const locked = progress.locked;
    const current = book.id === local.bookId;
    const studied = progress.status === "active" || progress.status === "done";
    const line = coverLine(book);
    const blurb = line ? '<p class="desc">' + esc(line) + "</p>" : "";
    const paint = coverPaint(book);
    let actions = "";
    if (!pending && !locked && book.id !== "phonics") {
      const id = esc(book.id);
      const progressBtn = '<button type="button" class="btn btn-primary" data-act="book-progress" data-id="' + id + '">学习进度</button>';
      if (current) actions = '<div class="row book-act">' + progressBtn + "</div>";
      else if (studied) actions = '<div class="row book-act">' + progressBtn + '<button type="button" class="btn" data-act="resume-home" data-id="' + id + '">继续学习</button></div>';
      else actions = '<div class="row book-act"><button type="button" class="btn btn-primary" data-act="start" data-id="' + id + '">学习此书</button></div>';
    }
    const needLevel = bookNeedLevel(book);
    const load = pending && needLevel ? lexLoadProgress(lexLevelsUpTo(needLevel)) : null;
    const stateLine = pending
      ? '<p class="progress-label">' + (load && load.failed ? "词库下载失败，点按重试" : "词库下载中 " + (load ? load.ready + "/" + load.total : "")) + '</p><div class="mini-track"><span style="width:' + (load ? load.width : 8) + '%"></span></div>'
      : '<p class="progress-label">已掌握 ' + progress.mastered + " / " + progress.total + '</p><div class="mini-track"><span style="width:' + progress.width + '%"></span></div>';
    const title = book.scene
      ? '<span class="cover-level">' + esc(book.level || "") + '</span><span class="cover-name">' + esc(book.scene) + "</span>"
      : '<span class="cover-name">' + esc(book.title) + "</span>";
    const face = '<div class="book-face"><h2><button type="button" class="book-name" data-act="book-open" data-id="' + esc(book.id) + '">' + title + "</button></h2>" + blurb + stateLine + "</div>";
    const topBits = (book.scene ? "" : '<span class="pos">' + esc(book.level || "词本") + "</span>") + statusTag(progress.status);
    const top = topBits ? '<div class="card-top">' + topBits + "</div>" : "";
    return '<article class="card book-card' + (paint ? " is-cover" : "") + (locked ? " is-locked has-tip" : "") + '" data-act="book-open" data-id="' + esc(book.id) + '"' + (paint ? ' style="--cover:' + paint.bg + ";--cover-ink:" + paint.ink + '"' : "") + (locked ? ' data-tip="' + esc(lockTip(book)) + '"' : "") + ">" + top + face + actions + "</article>";
  }

  function seriesBooks(level) {
    const main = BOOKS.filter(function (book) { return book.id === level; })[0];
    const topics = sceneBooks().filter(function (book) { return book.levelId === level; });
    return (main ? [main] : []).concat(topics);
  }

  function seriesCard(level) {
    const book = BOOKS.filter(function (item) { return item.id === level; })[0];
    const pending = bookPending(book);
    const progress = pending ? { total: 0, mastered: 0, locked: isLocked(book), status: "", width: 0 } : bookProgress(book);
    const locked = progress.locked;
    const topics = sceneBooks().filter(function (item) { return item.levelId === level; }).length;
    const paint = coverPaint(book);
    const load = pending ? lexLoadProgress(lexLevelsUpTo(level)) : null;
    let stateLine = '<p class="progress-label">已掌握 ' + progress.mastered + " / " + progress.total + '</p><div class="mini-track"><span style="width:' + progress.width + '%"></span></div>';
    if (pending) {
      if (load && load.failed) stateLine = '<p class="progress-label">词库下载失败，点按重试</p>';
      else if (load && load.loading) stateLine = '<p class="progress-label">词库下载中 ' + load.ready + "/" + load.total + '</p><div class="mini-track"><span style="width:' + load.width + '%"></span></div>';
      else stateLine = '<p class="progress-label">点进后查看词本</p>';
    }
    const meta = '<p class="series-meta">' + (topics ? topics + 1 : 1) + " 本</p>";
    return '<article class="card book-card series-card' + (paint ? " is-cover" : "") + (locked ? " is-locked has-tip" : "") + '" data-act="series-open" data-id="' + esc(level) + '"' + (paint ? ' style="--cover:' + paint.bg + ";--cover-ink:" + paint.ink + '"' : "") + (locked ? ' data-tip="' + esc(lockTip(book)) + '"' : "") + '>' +
      '<div class="book-face"><h2><span class="cover-level">' + esc(level) + '</span><span class="cover-name">系列</span></h2>' + meta + stateLine + "</div></article>";
  }

  function customSeriesCard() {
    const count = (local.custom || []).length;
    return '<article class="card book-card series-card series-custom" data-act="series-open" data-id="custom">' +
      '<div class="book-face"><h2><span class="cover-name">自建</span></h2>' +
      '<p class="series-meta">' + count + " 本</p></div></article>";
  }

  function booksCreateCard() {
    return '<article class="card book-create tight"><h2>新建词本</h2>' +
      '<div class="field"><input id="new-book" placeholder="词本名称" value="' + esc(UI.draftName) + '"></div>' +
      '<button type="button" class="btn btn-primary" data-act="create-book" style="margin-top:12px">创建</button></article>';
  }

  function booksPage() {
    const customBooks = (local.custom || []).map(function (book) {
      return { id: book.id, level: "自建", title: book.title, desc: "自建词本", wordIds: book.wordIds || [] };
    });
    const q = String(UI.lexQuery || "").trim();
    const search = '<input class="search lex-search" data-act="lex-search" placeholder="搜索泰语、中文或注音" value="' + esc(UI.lexQuery || "") + '">';
    if (q) {
      kickLexUpTo("B2");
      const hits = lexiconHits(q);
      const rows = hits.map(function (word) {
        return '<article class="word-row lex-hit">' + hornMarkup(word.thai) +
          '<span class="th" lang="th">' + esc(word.thai) + '</span><span class="grow"><b>' + esc(word.zh) + "</b><span>" + esc(word.roman || "") + "</span></span><span class=\"muted\">" + esc(levelLabel(word.level) || word.level || "") + "</span></article>";
      }).join("");
      return '<div class="page"><div class="row"><h1>查词</h1></div>' + search +
        (hits.length ? '<p class="muted">' + hits.length + (hits.length >= 40 ? "+" : "") + " 个结果</p>" : '<p class="muted">无结果</p>') +
        '<div class="list">' + rows + "</div></div>";
    }

    if (!UI.booksSeries) {
      return '<div class="page books-hub"><div class="row"><h1>词本</h1></div>' + search +
        '<div class="grid books-grid series-grid">' + levelOrder().map(seriesCard).join("") + customSeriesCard() + "</div></div>";
    }

    if (UI.booksSeries === "custom") {
      return '<div class="page"><div class="row"><h1>自建词本</h1></div>' + search +
        '<div class="grid books-grid">' + customBooks.map(bookCard).join("") + booksCreateCard() + "</div></div>";
    }

    const list = seriesBooks(UI.booksSeries);
    list.forEach(function (book) {
      const level = bookNeedLevel(book);
      if (level) kickLexUpTo(level);
    });
    return '<div class="page"><div class="row"><h1>' + esc(UI.booksSeries) + '</h1></div>' + search +
      '<div class="grid books-grid">' + list.map(bookCard).join("") + "</div></div>";
  }

  function wheelHtml(book) {
    const reviewNow = local.dailyReview != null ? Number(local.dailyReview) : Math.round(local.dailyNew * Number(local.reviewRatio));
    let best = 0;
    let score = Infinity;
    loadOptions().forEach(function (item, index) {
      const dist = Math.abs(item[0] - local.dailyNew) * 10 + Math.abs(item[1] - reviewNow);
      if (dist < score) {
        score = dist;
        best = index;
      }
    });
    const items = loadOptions().map(function (item, index) {
      const days = daysFor(book, item[0]);
      return '<button type="button" class="wheel-item' + (index === best ? " is-on" : "") + '" data-act="wheel-pick" data-new="' + item[0] + '" data-review="' + item[1] + '">新词 ' + item[0] + "，复习词 " + item[1] + "，需要 " + days + " 天</button>";
    }).join("");
    return '<div class="wheel-wrap"><div class="wheel"><div class="wheel-pad"></div>' + items + '<div class="wheel-pad"></div></div></div>';
  }

  function bookPage() {
    const book = viewingBook();
    if (bookPending(book)) {
      kickLexUpTo(bookNeedLevel(book));
      return '<div class="page"><h1>' + esc(book.title) + '</h1><p class="muted">下载中…</p>' +
        '<div class="row" style="margin-top:12px"><button type="button" class="btn" data-act="book-open" data-id="' + esc(book.id) + '">重试</button></div></div>';
    }
    const progress = bookProgress(book);
    const paused = savedSession(book.id);
    const label = book.id === "phonics" ? "已完成 " : "已掌握 ";
    const round = paused ? '<p class="progress-label">本轮 ' + paused.index + " / " + paused.ids.length + '</p><div class="mini-track"><span style="width:' + Math.round(100 * paused.index / paused.ids.length) + '%"></span></div>' : "";
    let table = "";
    let listTitle = "词表";
    if (book.id === "phonics") {
      listTitle = "单元";
      const bag = Store.phonics();
      const lessons = [["l1", "第一单元 · 声调"], ["l2", "第二单元 · 声母"], ["l3", "第三单元 · 元音"], ["l4", "第四单元 · 拼读"], ["l5", "第五单元 · 自测"]];
      table = lessons.map(function (item) {
        const done = bag.passed && bag.passed[item[0]];
        return '<article class="word-row"><span class="grow">' + esc(item[1]) + '</span><span class="muted">' + (done ? "完成" : "") + '</span><button type="button" class="btn btn-ghost" data-act="phonics-open" data-id="' + item[0] + '">学</button></article>';
      }).join("");
    }
    const intro = bookIntro(book);
    const start = progress.locked
      ? '<p class="muted">' + esc(lockTip(book)) + "</p>"
      : '<div class="row" style="margin-top:12px"><button type="button" class="btn btn-primary" data-act="start" data-id="' + esc(book.id) + '">' + (actionLabel(progress.status, book.id) === "学习" ? "开始" : actionLabel(progress.status, book.id)) + "</button></div>";
    const wheel = book.id === "phonics" ? "" : '<section class="card tight" style="margin-top:14px"><h2>每日词量</h2>' + wheelHtml(book) + "</section>";
    const chart = book.id === "phonics" ? '<section class="card tight" style="margin-top:14px"><h2>' + listTitle + '</h2><div class="lex-list">' + (table || '<p class="muted">暂无</p>') + "</div></section>" : progressBody(book);
    return '<div class="page book-page"><h1>' + esc(book.title) + "</h1>" +
      (intro ? '<p class="muted book-intro">' + esc(intro) + "</p>" : "") +
      '<p class="progress-label">' + label + progress.mastered + " / " + progress.total + '</p><div class="mini-track"><span style="width:' + progress.width + '%"></span></div>' +
      round + start +
      chart +
      wheel + "</div>";
  }

  function splitWords(book) {
    const done = [];
    const learning = [];
    const fresh = [];
    bookWords(book).forEach(function (word) {
      if (wordRetired(word.id)) done.push(word);
      else if (Store.card(word.id)) learning.push(word);
      else fresh.push(word);
    });
    return { done: done, learning: learning, fresh: fresh };
  }

  function ringSvg(parts, total) {
    const r = 42;
    const c = 2 * Math.PI * r;
    if (!total) return '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="42" fill="none" stroke="#c5ced8" stroke-width="14"/></svg>';
    let offset = 0;
    const arcs = parts.map(function (part) {
      if (!part.n) return "";
      const len = c * part.n / total;
      const piece = '<circle cx="60" cy="60" r="42" fill="none" stroke="' + part.color + '" stroke-width="14" stroke-dasharray="' + len.toFixed(2) + " " + (c - len).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '"/>';
      offset += len;
      return piece;
    }).join("");
    return '<svg viewBox="0 0 120 120" aria-hidden="true"><g transform="rotate(-90 60 60)">' + arcs + "</g></svg>";
  }

  function bucketName(id) {
    if (id === "done") return "完全掌握";
    if (id === "learning") return "正在学习";
    return "未学习";
  }

  function bucketWords(book, id) {
    const bag = splitWords(book);
    if (id === "done") return bag.done;
    if (id === "learning") return bag.learning;
    return bag.fresh;
  }

  function progressBody(book) {
    const bag = splitWords(book);
    const slices = [
      { id: "done", n: bag.done.length, color: "#3d9a6a", name: "完全掌握" },
      { id: "learning", n: bag.learning.length, color: "#5b93e6", name: "正在学习" },
      { id: "fresh", n: bag.fresh.length, color: "#c5ced8", name: "未学习" }
    ];
    const total = bag.done.length + bag.learning.length + bag.fresh.length;
    const pct = total ? Math.round(100 * bag.done.length / total) : 0;
    const legend = slices.map(function (item) {
      return '<button type="button" class="ring-jump" data-act="bucket" data-id="' + item.id + '"><span><i class="dot" style="background:' + item.color + '"></i>' + item.name + " · " + item.n + '</span><span class="chev" aria-hidden="true">&gt;</span></button>';
    }).join("");
    return '<section class="card ring-box tight"><div class="ring-wrap">' + ringSvg(slices, total) + '<div class="ring-label"><b>' + pct + '%</b><span>掌握</span></div></div><div class="ring-legend">' + legend + "</div></section>";
  }

  function wordListPage() {
    const book = viewingBook();
    const id = UI.bucket || "fresh";
    const words = bucketWords(book, id);
    const color = id === "done" ? "#3d9a6a" : id === "learning" ? "#5b93e6" : "#c5ced8";
    const rows = words.map(function (word) {
      return '<article class="word-row"><span class="th" lang="th">' + esc(word.thai) + '</span><span class="grow">' + esc(word.roman || "") + " · " + esc(word.zh) + "</span></article>";
    }).join("");
    return '<div class="page book-page"><p class="muted">' + esc(book.title) + '</p><h1><i class="dot" style="background:' + color + '"></i>' + bucketName(id) + " · " + words.length + '</h1><div class="lex-list bucket-list">' + (rows || '<p class="muted">这一部分还没有词。</p>') + "</div></div>";
  }

  function progressPage() {
    const book = viewingBook();
    return '<div class="page book-page"><p class="muted">' + esc(book.title) + '</p><h1>学习进度</h1>' + progressBody(book) + "</div>";
  }

  function studySettings() {
    const modes = [["card", "看词认意"], ["hear-word", "听词选义"], ["hear-sent", "听句选义"]];
    const orders = [["new", "先学新词"], ["review", "先学复习词"], ["mix", "混合学习"]];
    const voices = [["m", "男生 ครับ"], ["f", "女生 ค่ะ"], ["both", "两种都显示"]];
    function picks(list, current, act) {
      return list.map(function (item) {
        const on = String(current) === String(item[0]);
        return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-act="' + act + '" data-val="' + item[0] + '">' + esc(item[1]) + "</button>";
      }).join("");
    }
    return '<section class="card plan-card tight">' +
      "<h2>单词学习模式</h2><div class=\"chips\">" + picks(modes, studyMode(), "set-mode") + "</div>" +
      "<h2>学习顺序</h2><div class=\"chips\">" + picks(orders, studyOrder(), "set-order") + "</div>" +
      "<h2>开口身份" + infoMark("voice") + "</h2><div class=\"chips\">" + picks(voices, local.voice || "both", "set-voice") + "</div></section>";
  }

  function planSettingsPage() {
    return '<div class="page plan-page">' + studySettings() + "</div>";
  }

  function levelLabel(level) {
    const book = BOOKS.filter(function (item) { return item.id === level; })[0];
    return book ? String(book.title).replace(/\s+/g, "") : (level || "");
  }

  function todayNewProgress() {
    const ids = UI.freshIds || [];
    const total = ids.length;
    const seen = {};
    let passed = 0;
    const limit = Math.min(UI.index, UI.queue.length);
    for (let i = 0; i < limit; i += 1) {
      const id = UI.queue[i].id;
      if (ids.indexOf(id) >= 0 && !seen[id]) {
        seen[id] = true;
        passed += 1;
      }
    }
    const word = current();
    const onNew = !!(word && ids.indexOf(word.id) >= 0 && !seen[word.id]);
    return { current: Math.min(total, onNew ? passed + 1 : passed), total: total };
  }

  function askPrompt(word) {
    if (studyMode() === "hear-sent") {
      const line = spokenLines(word)[0];
      if (line && line.thai) {
        return {
          thai: line.thai,
          roman: line.roman || "",
          zh: line.zh || word.zh,
          gender: line.who === "女" ? "f" : line.who === "男" ? "m" : ""
        };
      }
    }
    return { thai: word.thai, roman: word.roman || "", zh: word.zh, gender: "" };
  }

  function buildAsk(word) {
    const prompt = askPrompt(word);
    const seen = {};
    const pool = [];
    function add(zh) {
      const text = String(zh || "").trim();
      if (!text || text === String(prompt.zh || "").trim() || seen[text]) return;
      seen[text] = true;
      pool.push(text);
    }
    (UI.queue || []).forEach(function (item) {
      if (item && item.id !== word.id) add(item.zh);
    });
    lexList().forEach(function (item) {
      if (pool.length >= 24) return;
      if (!word.level || item.level === word.level) add(item.zh);
    });
    const options = shuffle(pool).slice(0, 3);
    options.push(prompt.zh);
    return {
      thai: prompt.thai,
      roman: prompt.roman,
      zh: prompt.zh,
      gender: prompt.gender,
      options: shuffle(options),
      pick: -1
    };
  }

  function currentAsk() {
    const word = current();
    if (!word) return null;
    const key = UI.index + ":" + word.id + ":" + studyMode();
    if (!UI.ask || UI.ask.key !== key) {
      const built = buildAsk(word);
      built.key = key;
      UI.ask = built;
    }
    return UI.ask;
  }

  function hearStudyPage(word, head, starred, note) {
    const ask = currentAsk();
    const picked = ask ? ask.pick : -1;
    const options = (ask ? ask.options : []).map(function (text, index) {
      let cls = "quiz-option";
      if (picked >= 0) {
        if (text === ask.zh) cls += " is-ok";
        else if (index === picked) cls += " is-bad";
      }
      return '<button type="button" class="' + cls + '"' + (picked >= 0 ? " disabled" : ' data-act="choose" data-idx="' + index + '"') + ">" + esc(text) + "</button>";
    }).join("");
    const thaiClass = studyMode() === "hear-sent" ? "th hear-line" : "thai-xl";
    const face = picked >= 0
      ? '<p class="' + thaiClass + '" lang="th">' + esc(ask.thai) + "</p>" +
        (ask.roman ? '<p class="roman">' + romanBits(ask.roman, ask.thai) + "</p>" : "") +
        '<p class="zh-lg">' + esc(ask.zh) + "</p>"
      : '<button type="button" class="hear-play" data-act="speak" data-thai="' + encodeURIComponent(ask.thai) + '"' + (ask.gender ? ' data-gender="' + ask.gender + '"' : "") + ">再听一次</button>" +
        '<p class="hint">' + (studyMode() === "hear-sent" ? "听例句，选择对应的中文。" : "听单词，选择对应的中文。") + "</p>";
    const next = picked >= 0 ? '<button type="button" class="btn btn-primary" data-act="choose-next">下一个</button>' : "";
    return '<div class="stage">' + head + '<div class="hear-card">' + face + '<div class="hear-options">' + options + "</div></div>" +
      '<div class="actions">' + next +
      '<button type="button" class="btn has-tip" data-act="star" data-id="' + esc(word.id) + '" data-tip="加入生词本，后续可以单独复习这些单词">' + (starred ? "已在生词本" : "加入生词本") + "</button>" +
      '<button type="button" class="btn btn-ghost has-tip" data-act="note" data-tip="为本词添加个人学习笔记">笔记</button></div></div>' +
      (UI.noteOpen ? '<div class="modal-back"><form class="card modal" data-note-form><h2>笔记</h2><div class="field"><textarea id="note-text" rows="4" placeholder="写下自己的提醒">' + esc(note) + '</textarea></div><div class="row" style="margin-top:12px"><button class="btn btn-primary" type="submit">保存</button><button type="button" class="btn" data-act="close-note">取消</button></div></form></div>' : "");
  }

  function studyPage() {
    if (!UI.queue.length) {
      return '<div class="stage"><section class="card"><h2>这个词本还没有词</h2><p class="muted">可先在生词本收藏，或换一个词本。</p></section></div>';
    }
    if (UI.done) {
      const back = UI.courseDone
        ? '<button type="button" class="btn btn-primary" data-act="go" data-view="course">回到课程</button>'
        : '<button type="button" class="btn btn-primary" data-act="start">再来一轮</button><button type="button" class="btn" data-act="go" data-view="home">回到首页</button>';
      const note = UI.courseDone ? "本课单词已记入间隔复习。" : "今天的学习已记入打卡。不认识的词在生词本里。";
      return '<div class="modal-back"><section class="card modal"><p class="muted">本轮完成</p><h2>认识 ' + UI.round.known + " · 不认识 " + UI.round.unknown + '</h2><p class="muted">' + note + '</p>' +
        '<div class="row" style="margin-top:16px">' + back + "</div></section></div>";
    }
    const word = current();
    const starred = local.stars.indexOf(word.id) >= 0;
    const note = local.notes[word.id] || "";
    const log = dayLog();
    const head = UI.courseMode
      ? '<p class="day-progress">本课进度：' + (UI.index + 1) + "/" + UI.queue.length + "</p>"
      : '<div class="study-today"><div><b>今日复习</b><span>' + log.reviewIds.length + "/" + reviewPlan() + '</span></div><div><b>今日新词</b><span>' + log.newIds.length + "/" + local.dailyNew + '</span></div><div><b>学习时间</b><span data-study-min>' + studyTimeLabel() + "</span></div></div>";
    const sceneLabel = word.pos || word.scene || "";
    const rankLabel = levelLabel(word.level);
    const tags = (sceneLabel || rankLabel) ? '<p class="card-tags">' +
      (sceneLabel ? '<span class="badge">' + esc(sceneLabel) + "</span>" : "") +
      (sceneLabel && rankLabel ? '<span class="tag-bar">｜</span>' : "") +
      (rankLabel ? '<span class="badge">' + esc(rankLabel) + "</span>" : "") + "</p>" : "";
    if (studyMode() !== "card") return hearStudyPage(word, head, starred, note);
    const examples = spokenLines(word).map(function (line) {
      const gender = line.who === "女" ? "f" : line.who === "男" ? "m" : "";
      return '<div class="say-row"><span class="say-who">' + esc(line.who || "例") + '</span><div class="say-main"><p class="th" lang="th">' + esc(line.thai) + "</p>" +
        (line.roman ? '<p class="ipa">' + romanBits(line.roman, line.thai) + "</p>" : "") +
        (line.zh ? '<p class="say-zh">' + esc(line.zh) + "</p>" : "") + "</div>" +
        '<button type="button" class="btn btn-ghost say-play" data-act="speak" data-gender="' + gender + '" data-thai="' + encodeURIComponent(line.thai) + '">▶ 听这句</button></div>';
    }).join("");
    return '<div class="stage">' + head + '<div class="flip' + (UI.flipped ? " is-back" : "") + '" data-act="flip" role="button" tabindex="0" aria-label="翻转卡片"><div class="flip-inner">' +
      '<div class="face face-front"><p class="thai-xl" lang="th">' + esc(word.thai) + '</p><p class="roman">' + romanBits(word.roman, word.thai) + '</p></div>' +
      '<div class="face face-back">' + tags +
      '<p class="zh-lg">' + esc(word.zh) + "</p>" +
      '<div class="say-list">' + examples + "</div>" +
      (note ? '<p class="muted">笔记：' + esc(note) + "</p>" : "") +
      "</div></div></div>" +
      '<div class="actions"><button type="button" class="btn btn-primary" data-act="known">认识</button>' +
      '<button type="button" class="btn btn-warn" data-act="unknown">不认识</button>' +
      '<button type="button" class="btn" data-act="star" data-id="' + esc(word.id) + '">' + (starred ? "已收藏" : "收藏") + "</button>" +
      '<button type="button" class="btn btn-ghost" data-act="note">笔记</button></div></div>' +
      (UI.noteOpen ? '<div class="modal-back"><form class="card modal" data-note-form><h2>笔记</h2><div class="field"><textarea id="note-text" rows="4" placeholder="笔记">' + esc(note) + '</textarea></div><div class="row" style="margin-top:12px"><button class="btn btn-primary" type="submit">保存</button><button type="button" class="btn" data-act="close-note">取消</button></div></form></div>' : "");
  }

  function summaryPage() {
    const log = dayLog();
    function cell(label, value) {
      return '<div><b>' + label + "</b><span>" + value + "</span></div>";
    }
    const minutes = Math.floor(studySeconds() / 60);
    const time = studySeconds() > 0 && minutes < 1 ? "<1 分" : minutes + " 分";
    return '<div class="page summary-page"><h1>今日小结</h1><div class="study-today">' +
      cell("新词", String(log.newIds.length)) +
      cell("复习", String(log.reviewIds.length)) +
      cell("时间", time) +
      cell("课程", String(log.lessons.length)) +
      "</div>" +
      '<div class="row" style="margin-top:16px"><button type="button" class="btn btn-primary" data-act="go" data-view="home">完成</button></div></div>';
  }

  function notebookPage() {
    if (!allLexReady() && local.stars.some(function (id) { return !WORD[id]; })) kickLexUpTo("B2");
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
      const dayAwards = Store.get().awards[key] || {};
      const studied = (local.rounds || []).some(function (round) { return round.date === key; }) || !!dayAwards["practice:cards"] || !!dayAwards["phonics:practice"] || !!dayAwards["phonics:path"];
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
    if (Store.phonics().doneAt) badges.push("音标入门");
    return '<div class="page"><h1>统计</h1><div class="grid" style="margin-top:16px">' +
      '<section class="card"><p class="muted">连续打卡</p><h2>' + Store.get().streak.count + ' 天</h2></section>' +
      '<section class="card"><p class="muted">累计打卡</p><h2>' + Store.checkInTotal() + ' 天</h2></section>' +
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
    const syncState = Account.status();
    const syncTone = !session ? "off" : syncState === "error" ? "err" : syncState === "syncing" ? "busy" : "ok";
    const notes = Object.keys(local.notes).map(function (id) {
      const word = WORD[id];
      if (!word) return "";
      return '<article class="word-row"><span class="th" lang="th">' + esc(word.thai) + '</span><span class="grow">' + esc(local.notes[id]) + "</span></article>";
    }).filter(Boolean).join("");
    const levelText = local.quizLevel || "未测评";
    const voice = window.Speech && Speech.status ? Speech.status() : { label: "朗读", tip: "", hasLocal: false };
    const noteBody = UI.notesOpen
      ? '<div class="set-notes">' + (notes || '<p class="muted">还没有笔记。学习时可以写下。</p>') + "</div>"
      : "";
    const accountBtns = session
      ? '<button type="button" class="btn" data-act="sync-now">立即同步</button><button type="button" class="btn" data-act="logout">退出登录</button>'
      : '<button type="button" class="btn btn-primary" data-act="go" data-view="auth">登录同步进度</button>';
    return '<div class="page settings-page"><h1 class="settings-title">设置</h1>' +
      '<section class="set-panel set-account">' +
      '<div class="set-account-top"><div><p class="set-kicker">账号</p><h2>' + esc(session ? session.username : "未登录") + '</h2></div>' +
      '<span class="sync-pill is-' + syncTone + '">' + esc(Account.statusLabel()) + "</span></div>" +
      '<div class="set-line"><span class="muted">等级 · ' + esc(levelText) + infoMark("quiz") + '</span><button type="button" class="text-btn" data-act="go" data-view="quiz">测评</button></div>' +
      '<div class="set-actions set-actions-row">' + accountBtns + "</div></section>" +
      '<p class="set-label">外观与朗读</p>' +
      '<section class="set-panel">' +
      '<div class="set-row"><div><p class="set-item-title">深色模式</p><p class="muted">' + themeLabel() + '</p></div>' +
      '<label class="switch"><input type="checkbox" data-act="theme-toggle"' + (resolvedTheme() === "dark" ? " checked" : "") + '><span class="switch-ui"></span></label></div>' +
      '<button type="button" class="text-btn set-inline-link" data-act="theme-system">跟随系统</button>' +
      '<div class="set-divider"></div>' +
      '<div class="set-row"><div><p class="set-item-title">云端朗读' + infoMark("cloud-tts") + '</p><p class="muted">' + esc(voice.label) + '</p></div>' +
      '<label class="switch" title="优先云端" aria-label="优先云端"><input type="checkbox" data-act="tts-cloud"' + (local.preferCloudTts ? " checked" : "") + '><span class="switch-ui"></span></label></div>' +
      "</section>" +
      '<p class="set-label">学习</p>' +
      '<section class="set-panel set-list">' +
      '<button type="button" class="set-link" data-act="go" data-view="stats"><span>学习统计</span><span class="set-chevron" aria-hidden="true">›</span></button>' +
      '<button type="button" class="set-link" data-act="go" data-view="plan"><span>学习计划</span><span class="set-chevron" aria-hidden="true">›</span></button>' +
      '<button type="button" class="set-link" data-act="go" data-view="notebook"><span>生词本</span><span class="set-chevron" aria-hidden="true">›</span></button>' +
      '<button type="button" class="set-link" data-act="go" data-view="texts"><span>分级课文</span><span class="set-chevron" aria-hidden="true">›</span></button>' +
      '<button type="button" class="set-link" data-act="show-notes"><span>' + (UI.notesOpen ? "收起笔记" : "笔记") + '</span><span class="set-chevron" aria-hidden="true">›</span></button>' +
      noteBody +
      "</section>" +
      '<p class="set-label">数据</p>' +
      '<section class="set-panel">' +
      '<div class="set-row set-row-plain"><p class="set-item-title">备份' + infoMark("backup") + '</p></div>' +
      '<div class="set-actions set-actions-row"><button type="button" class="btn" data-act="export-backup">导出</button><button type="button" class="btn" data-act="import-backup">导入</button></div>' +
      '<input id="backup-file" type="file" accept="application/json,.json" data-act="import-file" hidden></section>' +
      '<p class="set-label">关于</p>' +
      '<section class="set-panel">' +
      '<p class="set-item-title">RianThai</p>' +
      '<p class="muted">v' + esc(window.RT_VERSION || "dev") + "</p>" +
      "</section></div>";
  }

  function authPage() {
    const login = UI.authMode === "login";
    return '<div class="auth"><section class="auth-brand"><p class="auth-name">RianThai</p></section>' +
      '<form class="auth-form" data-auth-form><h2>' + (login ? "登录" : "注册") + '</h2><div class="field"><span>用户名</span><input id="acct-user" autocomplete="username"></div>' +
      '<div class="field"><span>密码</span><input id="acct-pass" type="password" autocomplete="' + (login ? "current-password" : "new-password") + '"></div>' +
      '<p class="form-error">' + esc(UI.authError) + "</p>" +
      '<button class="btn btn-primary auth-btn" type="submit"' + (UI.authBusy ? " disabled" : "") + ">" + (login ? "登录" : "注册") + "</button>" +
      '<button type="button" class="btn auth-btn" data-act="auth-mode">' + (login ? "注册" : "已有账号") + "</button>" +
      '<button type="button" class="text-btn" data-act="go" data-view="home">跳过</button></form></div>';
  }

  function quizPage() {
    if (!UI.quiz) UI.quiz = makeQuiz();
    const quiz = UI.quiz;
    if (quiz.done) {
      const book = quiz.level === "B1" ? "B1" : quiz.level === "A2" ? "A2" : "A1";
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
    const pool = shuffle(bookWords(BOOKS[0]).concat(bookWords(BOOKS[1]), bookWords(BOOKS[2])));
    const items = pool.slice(0, 6).map(function (word) {
      const options = [word.zh];
      shuffle(pool).forEach(function (other) {
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

  function findLesson(id) {
    const lessons = (window.COURSE && COURSE.lessons) || [];
    return lessons.filter(function (item) { return item.id === id; })[0] || null;
  }

  function courseRec(id) {
    local.courseProgress = local.courseProgress || {};
    const rec = local.courseProgress[id] || {};
    return { started: !!rec.started, done: !!rec.done };
  }

  function courseWordList(lesson) {
    return (lesson.words || []).map(function (wordId) { return WORD[wordId]; }).filter(Boolean);
  }

  function sentenceCard(lesson, line, index) {
    const kind = lineKind(line);
    return {
      id: "sent:" + lesson.id + ":" + index,
      thai: fillParticle(line.th, "m", kind),
      roman: fillParticle(line.ro, "m", kind),
      zh: line.zh,
      level: lesson.level,
      scene: lesson.title,
      pos: "句子",
      exThai: line.th,
      exRoman: line.ro,
      exZh: line.zh,
      kind: kind
    };
  }

  function lessonState(lesson) {
    const rec = courseRec(lesson.id);
    const today = Store.dateKey();
    const due = courseWordList(lesson).some(function (word) {
      const card = Store.card(word.id);
      return card && !wordRetired(word.id) && card.due <= today;
    });
    if (rec.done && due) return "review";
    if (rec.done) return "done";
    if (rec.started) return "active";
    return "new";
  }

  function lessonStateLabel(state) {
    if (state === "active") return "🟡 学习中";
    if (state === "done") return "✅ 已学完";
    if (state === "review") return "🔁 待复习";
    return "⚪ 未开始";
  }

  function lessonSceneName(lesson) {
    const match = String(lesson.title || "").match(/^(.*) · 第 \d+ 课$/);
    return match ? match[1] : "";
  }

  function courseUnits(level) {
    const lessons = ((window.COURSE && COURSE.lessons) || []).filter(function (lesson) {
      return lesson.level === level;
    });
    const units = [];
    let hand = [];
    function pushHand() {
      const size = 4;
      const parts = Math.ceil(hand.length / size);
      for (let i = 0; i < hand.length; i += size) {
        const part = Math.floor(i / size) + 1;
        units.push({
          id: level + "-talk-" + part,
          level: level,
          title: parts > 1 ? "情景对话 · 第 " + part + " 组" : "情景对话",
          lessons: hand.slice(i, i + size)
        });
      }
      hand = [];
    }
    let current = null;
    lessons.forEach(function (lesson) {
      const scene = lessonSceneName(lesson);
      if (!scene) {
        if (current) {
          units.push(current);
          current = null;
        }
        hand.push(lesson);
        return;
      }
      pushHand();
      if (!current || current.scene !== scene) {
        if (current) units.push(current);
        current = { id: level + "-scene-" + (units.length + 1), level: level, scene: scene, title: scene, lessons: [] };
      }
      current.lessons.push(lesson);
    });
    pushHand();
    if (current) units.push(current);
    return units;
  }

  function courseUnitList() {
    const list = [];
    ["A1", "A2", "B1", "B2"].forEach(function (level) {
      courseUnits(level).forEach(function (unit) { list.push(unit); });
    });
    return list;
  }

  function unitIsOpen(unit) {
    // 语法轨单独按序解锁，不卡住 A1–B2 主线
    const list = unit && unit.level === "grammar" ? courseUnits("grammar") : courseUnitList();
    const index = list.findIndex(function (item) { return item.id === unit.id; });
    if (index <= 0) return true;
    const prev = list[index - 1];
    return prev.lessons.length > 0 && prev.lessons.every(function (lesson) { return courseRec(lesson.id).done; });
  }

  function findUnit(id) {
    if (!id) return null;
    const list = courseUnitList().concat(courseUnits("grammar"));
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function lessonUnit(lesson) {
    if (!lesson) return null;
    const units = courseUnits(lesson.level);
    for (let i = 0; i < units.length; i += 1) {
      if (units[i].lessons.some(function (item) { return item.id === lesson.id; })) return units[i];
    }
    return null;
  }

  function lessonLocked(lesson) {
    if (lesson && lesson.level && !lexLevelsUpTo(lesson.level).every(lexReady)) return true;
    const unit = lessonUnit(lesson);
    return !unit || !unitIsOpen(unit);
  }

  function levelCourseLocked(level) {
    const units = courseUnits(level);
    return !units.length || !unitIsOpen(units[0]);
  }

  function levelUnitsOpen(level) {
    const units = courseUnits(level);
    return units.length > 0 && units.every(unitIsOpen);
  }

  function lessonMatches(lesson, filter) {
    const state = lessonState(lesson);
    if (filter === "待学习") return state === "new" || state === "active";
    if (filter === "待复习") return state === "review";
    if (filter === "已完成") return state === "done";
    return true;
  }

  function courseLockIcon() {
    return '<svg class="course-lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  }

  function beginCourseQueue(queue, mode, trackId) {
    if (!queue.length) {
      toast("还没有可以复习的内容。");
      return;
    }
    UI.courseMode = mode;
    UI.courseTrack = trackId || "";
    UI.courseDone = false;
    UI.ask = null;
    UI.queue = queue;
    UI.freshIds = [];
    UI.index = 0;
    UI.flipped = false;
    UI.done = false;
    UI.noteOpen = false;
    UI.round = { known: 0, unknown: 0 };
    UI.misses = {};
    UI.view = "study";
  }

  function courseReviewQueue(lessons) {
    const seen = {};
    const queue = [];
    lessons.forEach(function (lesson) {
      courseWordList(lesson).forEach(function (word) {
        if (seen[word.id] || wordRetired(word.id)) return;
        seen[word.id] = true;
        queue.push(word);
      });
      (lesson.lines || []).forEach(function (line, index) {
        queue.push(sentenceCard(lesson, line, index));
      });
    });
    return queue;
  }

  function lexiconHits(query) {
    const q = String(query || "").trim().toLowerCase();
    const hits = [];
    if (!q) return hits;
    lexList().forEach(function (word) {
      if (hits.length >= 40) return;
      const blob = (word.thai + "\n" + (word.zh || "") + "\n" + (word.roman || "")).toLowerCase();
      if (blob.indexOf(q) >= 0) hits.push(word);
    });
    return hits;
  }

  function lessonCard(lesson) {
    const state = lessonState(lesson);
    const reviewOn = state !== "new";
    const id = esc(lesson.id);
    const actions = '<button type="button" class="btn btn-primary" data-act="course-learn" data-id="' + id + '">学习</button>' +
      '<button type="button" class="btn" data-act="course-review" data-id="' + id + '"' + (reviewOn ? "" : " disabled") + ">复习</button>" +
      '<button type="button" class="btn" data-act="course-words" data-id="' + id + '">生词</button>' +
      '<button type="button" class="btn" data-act="course-notes" data-id="' + id + '">笔记</button>';
    return '<article class="card course-item tight tone-' + String(lesson.level || "").toLowerCase() + '">' +
      '<div class="course-item-main"><p class="course-state">' + lessonStateLabel(state) + "</p><h2>" + esc(lesson.title) + "</h2>" +
      ((lesson.words || []).length ? '<p class="muted">' + (lesson.words || []).length + " 词</p>" : "") + "</div>" +
      '<div class="course-item-actions">' + actions + "</div></article>";
  }

  function unitRow(unit, index) {
    const open = unitIsOpen(unit);
    const matched = unit.lessons.filter(function (lesson) { return lessonMatches(lesson, UI.courseFilter); });
    const name = "第 " + (index + 1) + " 单元 · " + unit.title;
    if (!open) {
      if (UI.courseFilter === "已完成" || UI.courseFilter === "待复习") return "";
      return '<div class="unit-row is-locked">' + courseLockIcon() + '<span class="grow"><b>' + esc(name) + '</b></span><span class="state state-lock">未解锁</span></div>';
    }
    if (!matched.length) return "";
    const done = unit.lessons.filter(function (lesson) { return courseRec(lesson.id).done; }).length;
    return '<button type="button" class="unit-row" data-act="open-unit" data-id="' + esc(unit.id) + '"><span class="grow"><b>' + esc(name) + '</b><small>已完成 ' + done + " / " + unit.lessons.length + ' 课</small></span><span class="chev" aria-hidden="true">&gt;</span></button>';
  }

  function courseUnitPage(unit) {
    const units = courseUnits(unit.level);
    let index = 0;
    units.forEach(function (item, at) { if (item.id === unit.id) index = at; });
    const done = unit.lessons.filter(function (lesson) { return courseRec(lesson.id).done; }).length;
    const rows = unit.lessons.map(lessonCard).join("");
    return '<div class="page course-page"><p class="muted">第 ' + (index + 1) + " 单元 · 已完成 " + done + " / " + unit.lessons.length + ' 课</p><div class="course-list">' + rows + "</div></div>";
  }

  function coursePage() {
    const lessons = (window.COURSE && COURSE.lessons) || [];
    if (!lessons.length) return '<div class="page"><h1>课程未载入</h1></div>';
    const current = findLesson(UI.lessonId);
    if (current) return courseLesson(current);
    const focus = findLesson(UI.courseFocus);
    if (UI.coursePane === "words" && focus) return courseWordsPage(focus);
    if (UI.coursePane === "notes" && focus) return courseNotesPage(focus);
    const unit = findUnit(UI.courseUnit);
    if (unit && unitIsOpen(unit)) return courseUnitPage(unit);
    if (UI.courseUnit) UI.courseUnit = "";
    return courseHome(lessons);
  }

  function courseHome(lessons) {
    const level = courseTrackId();
    UI.courseLevel = level;
    local.courseLevel = level;
    const filters = ["全部", "待学习", "待复习", "已完成"];
    const levels = BOOKS.map(function (book) {
      const on = book.id === level;
      if (bookPending(book)) {
        kickLexUpTo(book.id);
        const loadFailed = lexLevelsUpTo(book.id).some(function (lv) { return lexStatus[lv] === "error"; });
        return '<article class="course-level tone-' + book.id.toLowerCase() + (on ? " is-on" : "") + '"' + (on ? ' aria-current="true"' : "") + ">" +
          '<button type="button" class="course-level-pick" data-act="course-level" data-id="' + esc(book.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          "<span>" + esc(book.title) + "</span></button>" +
          courseCurrentBadge(on) +
          '<p class="course-meta">' + (loadFailed ? "词库下载失败，点按重试" : "词库下载中…") + "</p></article>";
      }
      const items = lessons.filter(function (lesson) { return lesson.level === book.id; });
      const done = items.filter(function (lesson) { return courseRec(lesson.id).done; }).length;
      const width = items.length ? Math.round(100 * done / items.length) : 0;
      const locked = levelCourseLocked(book.id);
      const review = locked || !levelUnitsOpen(book.id)
        ? ""
        : '<button type="button" class="btn" data-act="course-unit" data-id="' + esc(book.id) + '">复习本单元全部</button>';
      return '<article class="course-level tone-' + book.id.toLowerCase() + (on ? " is-on" : "") + (locked ? " is-locked" : "") + '"' + (on ? ' aria-current="true"' : "") + ">" +
        '<button type="button" class="course-level-pick" data-act="course-level" data-id="' + esc(book.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
        (locked ? courseLockIcon() : "") + "<span>" + esc(book.title) + "</span></button>" +
        courseCurrentBadge(on) +
        (locked ? '<p class="course-lock-tip">完成上一单元后解锁</p><p class="course-meta"><span class="state state-lock">未解锁</span></p>' : '<p class="course-meta">已完成 ' + done + " / " + items.length + " · " + width + '%</p><div class="course-bar" aria-hidden="true"><span style="width:' + width + '%"></span></div>' + review) +
        "</article>";
    }).join("");
    const grammarLessons = lessons.filter(function (lesson) { return lesson.level === "grammar"; });
    const grammarDone = grammarLessons.filter(function (lesson) { return courseRec(lesson.id).done; }).length;
    const grammarWidth = grammarLessons.length ? Math.round(100 * grammarDone / grammarLessons.length) : 0;
    const grammarOn = level === "grammar";
    const grammarCard = '<article class="course-level tone-grammar' + (grammarOn ? " is-on" : "") + '"' + (grammarOn ? ' aria-current="true"' : "") + ">" +
      '<button type="button" class="course-level-pick" data-act="course-level" data-id="grammar" aria-pressed="' + (grammarOn ? "true" : "false") + '"><span>语法学习</span></button>' +
      courseCurrentBadge(grammarOn) +
      '<p class="course-meta">已完成 ' + grammarDone + " / " + grammarLessons.length + " · " + grammarWidth + '%</p>' +
      '<div class="course-bar" aria-hidden="true"><span style="width:' + grammarWidth + '%"></span></div></article>';
    const phonics = bookProgress(phonicsBook());
    const phonicsOn = level === "phonics";
    // 与 A1–B2 等级卡一致：只展示进度，不在卡上再放大按钮；点选等级后用下方列表进入
    const phonicsCard = '<article class="course-level tone-phonics' + (phonicsOn ? " is-on" : "") + '"' + (phonicsOn ? ' aria-current="true"' : "") + ">" +
      '<button type="button" class="course-level-pick" data-act="course-level" data-id="phonics" aria-pressed="' + (phonicsOn ? "true" : "false") + '"><span>音标入门</span></button>' +
      courseCurrentBadge(phonicsOn) +
      '<p class="course-meta">已完成 ' + phonics.mastered + " / " + phonics.total + " · " + phonics.width + '%</p><div class="course-bar" aria-hidden="true"><span style="width:' + phonics.width + '%"></span></div></article>';
    let blocks = "";
    let empty = '<p class="muted">暂无课时</p>';
    if (level === "phonics") {
      blocks = phonicsUnitRows();
      empty = '<p class="muted">5 单元</p>';
    } else if (level === "grammar") {
      kickLexUpTo("A1");
      const pending = !lexLevelsUpTo("A1").every(lexReady);
      blocks = pending ? "" : courseUnits("grammar").map(function (unit, index) { return unitRow(unit, index); }).join("");
      empty = pending ? '<p class="muted">下载中…</p>' : '<p class="muted">暂无课时</p>';
    } else {
      const levelPending = !lexLevelsUpTo(level).every(lexReady);
      blocks = levelPending ? "" : courseUnits(level).map(function (unit, index) { return unitRow(unit, index); }).join("");
      empty = levelPending ? '<p class="muted">下载中…</p>' : empty;
    }
    return '<div class="page course-page">' +
      '<div class="course-levels">' + phonicsCard + grammarCard + levels + "</div>" +
      (level === "phonics" || level === "grammar" ? "" : '<div class="course-filters">' + filters.map(function (name) {
        return '<button type="button" class="chip' + (UI.courseFilter === name ? " is-on" : "") + '" data-act="course-filter" data-id="' + name + '">' + name + "</button>";
      }).join("") + "</div>") +
      '<div class="course-list">' + (blocks || empty) + "</div></div>";
  }

  function courseWordsPage(lesson) {
    let added = false;
    (lesson.words || []).forEach(function (id) {
      if (!WORD[id] || local.stars.indexOf(id) >= 0) return;
      local.stars.push(id);
      added = true;
    });
    if (added) saveLocal();
    const rows = courseWordList(lesson).map(function (word) {
      return '<article class="word-row"><div class="grow"><p class="th" lang="th">' + esc(word.thai) + '</p><p class="ipa">' + esc(word.roman || "") + '</p><p class="muted">' + esc(word.zh) + "</p></div></article>";
    }).join("");
    return '<div class="page course-page"><p class="muted">' + esc(lesson.title) + '</p><h1>本课生词</h1><div class="list" style="margin-top:12px">' + (rows || '<p class="muted">暂无</p>') + "</div></div>";
  }

  function courseNotesPage(lesson) {
    local.lessonNotes = local.lessonNotes || {};
    local.notes = local.notes || {};
    const lessonNote = local.lessonNotes[lesson.id] || "";
    const wordNotes = courseWordList(lesson).filter(function (word) {
      return local.notes[word.id];
    }).map(function (word) {
      return '<article class="word-row"><div class="grow"><p class="th" lang="th">' + esc(word.thai) + " · " + esc(word.zh) + "</p><p>" + esc(local.notes[word.id]) + "</p></div></article>";
    }).join("");
    return '<div class="page course-page"><p class="muted">' + esc(lesson.title) + '</p><h1>本课笔记</h1>' +
      '<label class="field"><span>本课笔记</span><textarea id="course-note" rows="5" placeholder="写下这一课的提醒">' + esc(lessonNote) + '</textarea></label>' +
      '<button type="button" class="btn btn-primary" data-act="course-note-save" data-id="' + esc(lesson.id) + '" style="margin-top:12px">保存</button>' +
      '<h2 class="section-title">生词笔记</h2><div class="list">' + (wordNotes || '<p class="muted">这些生词还没有笔记。学习单词时可以写下。</p>') + "</div></div>";
  }

  function lineKind(line) {
    if (line.kind) return line.kind;
    if (/[?？]$/.test(line.zh || "")) return "q";
    if (/(ไหม|มั้ย|เท่าไหร่|อะไร|ไหน|เมื่อไหร่)/.test(line.th || "")) return "q";
    return "s";
  }

  function lessonSentences(lesson) {
    const out = [];
    (lesson.talk || []).forEach(function (line) {
      const kind = lineKind(line);
      const gender = line.g === "f" ? "f" : "m";
      out.push({
        thai: fillParticle(line.th, gender, kind),
        roman: fillParticle(line.ro, gender, kind),
        zh: line.zh || "",
        gender: gender,
        who: gender === "f" ? "女" : "男"
      });
    });
    const genders = local.voice === "f" ? ["f"] : local.voice === "m" ? ["m"] : ["m", "f"];
    (lesson.lines || []).forEach(function (line) {
      genders.forEach(function (gender) {
        const kind = line.kind || "s";
        out.push({
          thai: fillParticle(line.th, gender, kind),
          roman: fillParticle(line.ro, gender, kind),
          zh: line.zh || "",
          gender: gender,
          who: gender === "f" ? "女" : "男"
        });
      });
    });
    return out;
  }

  function stopSayCapture() {
    sayRun += 1;
    if (sayAudio.timer) clearTimeout(sayAudio.timer);
    if (sayAudio.raf) cancelAnimationFrame(sayAudio.raf);
    sayAudio.timer = 0;
    sayAudio.raf = 0;
    if (sayAudio.rec && sayAudio.rec.state === "recording") {
      try { sayAudio.rec.onstop = null; sayAudio.rec.stop(); } catch (err) { /* ignore */ }
    }
    if (sayAudio.stream) sayAudio.stream.getTracks().forEach(function (track) { track.stop(); });
    if (sayAudio.ctx) {
      try { sayAudio.ctx.close(); } catch (err) { /* ignore */ }
    }
    sayAudio.stream = null;
    sayAudio.ctx = null;
    sayAudio.rec = null;
  }

  function syllableTone(text) {
    const norm = String(text || "").normalize("NFD");
    if (/\u030c/i.test(norm)) return "rise";
    if (/\u0302/.test(norm)) return "fall";
    if (/\u0301/.test(norm)) return "high";
    if (/\u0300/.test(norm)) return "low";
    return "mid";
  }

  function syllableLong(text) {
    const plain = String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return /(aa|ii|uu|ee|oo|ɛɛ|ɔɔ|ʉʉ|əə)/.test(plain);
  }

  function romanWords(roman) {
    return String(roman || "").split(/\s+/).filter(Boolean).map(function (word) {
      const parts = word.split("-").filter(Boolean);
      return {
        text: word,
        syllables: parts.map(function (part) {
          return { tone: syllableTone(part), long: syllableLong(part) };
        })
      };
    });
  }

  function pitchAt(data, start, frame, rate) {
    const minLag = Math.max(1, Math.floor(rate / 400));
    const maxLag = Math.min(frame - 1, Math.floor(rate / 70));
    let best = 0;
    let bestLag = 0;
    for (let lag = minLag; lag <= maxLag; lag += 2) {
      let sum = 0;
      for (let i = 0; i < frame - lag; i += 4) sum += data[start + i] * data[start + i + lag];
      if (sum > best) {
        best = sum;
        bestLag = lag;
      }
    }
    return bestLag ? rate / bestLag : 0;
  }

  function readVoice(buffer) {
    const data = buffer.getChannelData(0);
    const rate = buffer.sampleRate;
    const frame = Math.floor(rate * 0.03);
    const hop = Math.floor(rate * 0.02);
    const energy = [];
    const pitch = [];
    let loud = 0;
    for (let i = 0; i + frame < data.length; i += hop) {
      let sum = 0;
      for (let j = 0; j < frame; j += 2) sum += data[i + j] * data[i + j];
      const rms = Math.sqrt(sum / (frame / 2));
      if (rms > loud) loud = rms;
      energy.push(rms);
      pitch.push(rms > 0.02 ? pitchAt(data, i, frame, rate) : 0);
    }
    const gate = Math.max(0.015, loud * 0.28);
    const hopSec = hop / rate;
    const segs = [];
    let start = -1;
    energy.forEach(function (value, index) {
      if (value >= gate && start < 0) start = index;
      if ((value < gate || index === energy.length - 1) && start >= 0) {
        const end = value < gate ? index : index + 1;
        const dur = (end - start) * hopSec;
        if (dur >= 0.05) {
          const tones = pitch.slice(start, end).filter(function (item) { return item > 70 && item < 420; });
          segs.push({ dur: dur, pitch: tones, energy: energy.slice(start, end) });
        }
        start = -1;
      }
    });
    return { loud: loud, segs: segs };
  }

  function contourOf(pitches, low, high) {
    if (!pitches.length) return "mid";
    const avg = function (list) { return list.reduce(function (sum, item) { return sum + item; }, 0) / list.length; };
    const cut = Math.max(1, Math.ceil(pitches.length / 3));
    const start = avg(pitches.slice(0, cut));
    const end = avg(pitches.slice(-cut));
    const mean = avg(pitches);
    if (end - start > 20 && end > start * 1.12) return "rise";
    if (start - end > 20 && start > end * 1.12) return "fall";
    const span = high - low;
    if (span < 28) return "mid";
    const pos = (mean - low) / span;
    if (pos > 0.66) return "high";
    if (pos < 0.34) return "low";
    return "mid";
  }

  function toneScore(expected, got, range) {
    if (expected === got) return 100;
    if (range < 28) return 70;
    const near = { mid: ["low", "high"], low: ["mid"], high: ["fall", "rise"], fall: ["high"], rise: ["mid", "high"] };
    return (near[expected] || []).indexOf(got) >= 0 ? 70 : 30;
  }

  function alignSegs(segs, count) {
    const list = segs.map(function (seg) {
      return { dur: seg.dur, pitch: seg.pitch.slice(), energy: (seg.energy || []).slice() };
    });
    function splitLongest() {
      let best = -1;
      list.forEach(function (seg, index) {
        if (best < 0 || seg.dur > list[best].dur) best = index;
      });
      const seg = list[best];
      if (!seg || seg.pitch.length < 2) return false;
      let cut = Math.floor(seg.pitch.length / 2);
      if (seg.energy.length >= 4) {
        const start = Math.floor(seg.energy.length * 0.3);
        const end = Math.max(start + 1, Math.ceil(seg.energy.length * 0.7));
        let minAt = start;
        for (let i = start; i < end; i += 1) {
          if (seg.energy[i] < seg.energy[minAt]) minAt = i;
        }
        cut = Math.max(1, Math.min(seg.pitch.length - 1, Math.round(seg.pitch.length * (minAt / seg.energy.length))));
      }
      const ratio = cut / seg.pitch.length;
      const eCut = Math.round(seg.energy.length * ratio);
      list.splice(best, 1,
        { dur: seg.dur * ratio, pitch: seg.pitch.slice(0, cut), energy: seg.energy.slice(0, eCut) },
        { dur: seg.dur * (1 - ratio), pitch: seg.pitch.slice(cut), energy: seg.energy.slice(eCut) });
      return true;
    }
    let guard = 0;
    while (list.length < count && guard < count * 3 && splitLongest()) guard += 1;
    while (list.length > count) {
      let best = 0;
      let bestSum = Infinity;
      for (let i = 0; i < list.length - 1; i += 1) {
        const sum = list[i].dur + list[i + 1].dur;
        if (sum < bestSum) {
          bestSum = sum;
          best = i;
        }
      }
      const first = list[best];
      const second = list[best + 1];
      list.splice(best, 2, {
        dur: first.dur + second.dur,
        pitch: first.pitch.concat(second.pitch),
        energy: first.energy.concat(second.energy)
      });
    }
    return list;
  }

  function scoreUtterance(buffer, roman) {
    const words = romanWords(roman);
    const expected = [];
    words.forEach(function (word, index) {
      word.syllables.forEach(function (syllable) { expected.push({ word: index, tone: syllable.tone, long: syllable.long }); });
    });
    const voice = readVoice(buffer);
    if (voice.loud < 0.012 || !expected.length) {
      return {
        score: 0,
        note: "没有录到声音",
        words: words.map(function (word) { return { text: word.text, level: "bad", hint: "" }; })
      };
    }
    const allPitch = [];
    voice.segs.forEach(function (seg) { seg.pitch.forEach(function (item) { allPitch.push(item); }); });
    const sorted = allPitch.slice().sort(function (a, b) { return a - b; });
    const at = function (ratio) { return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))] : 160; };
    const low = at(0.2);
    const high = at(0.8);
    const range = high - low;
    const aligned = voice.segs.length ? alignSegs(voice.segs, expected.length) : [];
    const shortDurs = [];
    expected.forEach(function (item, index) {
      if (!item.long && aligned[index]) shortDurs.push(aligned[index].dur);
    });
    shortDurs.sort(function (a, b) { return a - b; });
    const shortRef = shortDurs.length ? shortDurs[Math.floor(shortDurs.length / 2)] : 0;
    const marks = expected.map(function (item, index) {
      const seg = aligned[index];
      if (!seg) return { word: item.word, score: 18, hint: "辅音不对" };
      const got = contourOf(seg.pitch, low, high);
      const tone = toneScore(item.tone, got, range);
      let length = 100;
      let hint = "";
      if (item.long) {
        if (shortRef) {
          const ratio = seg.dur / shortRef;
          if (ratio < 1.1) {
            length = 20;
            hint = "元音读短了";
          } else if (ratio < 1.35) length = 70;
        } else if (seg.dur < 0.1) {
          length = 20;
          hint = "元音读短了";
        } else if (seg.dur < 0.15) length = 70;
      }
      let score = Math.round(tone * 0.7 + length * 0.3);
      if (hint === "元音读短了") score = Math.min(score, 42);
      if (!hint && tone < 60) hint = "声调错误";
      if (!hint && score < 55) hint = "辅音不对";
      return { word: item.word, score: score, hint: hint };
    });
    const scored = words.map(function (word, index) {
      const mine = marks.filter(function (mark) { return mark.word === index; });
      const score = mine.length ? Math.round(mine.reduce(function (sum, mark) { return sum + mark.score; }, 0) / mine.length) : 0;
      const worst = mine.slice().sort(function (a, b) { return a.score - b.score; })[0];
      const level = score >= 80 ? "ok" : score >= 55 ? "mid" : "bad";
      return { text: word.text, score: score, level: level, hint: level === "bad" && worst ? worst.hint : "" };
    });
    const total = scored.length ? Math.round(scored.reduce(function (sum, word) { return sum + word.score; }, 0) / scored.length) : 0;
    return { score: total, words: scored };
  }

  function scoreBlob(blob, roman) {
    return blob.arrayBuffer().then(function (bytes) {
      const ctx = new AudioContext();
      return ctx.decodeAudioData(bytes.slice(0)).then(function (audio) {
        ctx.close();
        return scoreUtterance(audio, roman);
      });
    }).catch(function () {
      return { score: 0, words: romanWords(roman).map(function (word) { return { text: word.text, level: "bad", hint: "没有听清录音" }; }) };
    });
  }

  function paintSayWave(analyser, run) {
    const bins = new Uint8Array(analyser.fftSize);
    const bars = [];
    function tick() {
      if (run !== sayRun) return;
      analyser.getByteTimeDomainData(bins);
      let peak = 0;
      for (let i = 0; i < bins.length; i += 1) {
        const value = Math.abs(bins[i] - 128);
        if (value > peak) peak = value;
      }
      bars.push(peak);
      if (bars.length > 36) bars.shift();
      const host = document.getElementById("say-wave");
      if (host) {
        host.innerHTML = bars.map(function (value) {
          return '<i style="height:' + Math.max(8, Math.round(value / 128 * 100)) + '%"></i>';
        }).join("");
      }
      sayAudio.raf = requestAnimationFrame(tick);
    }
    tick();
  }

  function beginSayCapture(line) {
    const run = sayRun;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      sayHolding = false;
      toast("这台设备不能录音。");
      UI.sayPhase = "";
      draw();
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      if (run !== sayRun || !sayHolding) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        if (run === sayRun && UI.sayPhase === "rec") {
          UI.sayPhase = "";
          draw();
        }
        return;
      }
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      let rec;
      try { rec = new MediaRecorder(stream); }
      catch (err) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        ctx.close();
        sayHolding = false;
        toast("这台设备不能录音。");
        UI.sayPhase = "";
        draw();
        return;
      }
      const chunks = [];
      rec.ondataavailable = function (event) { if (event.data && event.data.size) chunks.push(event.data); };
      rec.onstop = function () {
        sayHolding = false;
        stream.getTracks().forEach(function (track) { track.stop(); });
        if (sayAudio.ctx === ctx) sayAudio.ctx = null;
        ctx.close();
        if (run !== sayRun) return;
        UI.sayPhase = "mark";
        draw();
        scoreBlob(new Blob(chunks, { type: rec.mimeType || "audio/webm" }), line.roman).then(function (result) {
          if (run !== sayRun) return;
          UI.sayResult = result;
          UI.sayPhase = "score";
          draw();
        });
      };
      rec.start();
      paintSayWave(analyser, run);
      sayAudio.timer = setTimeout(function () {
        if (rec.state === "recording") rec.stop();
      }, 12000);
      sayAudio.stream = stream;
      sayAudio.ctx = ctx;
      sayAudio.rec = rec;
      if (!sayHolding && rec.state === "recording") rec.stop();
    }).catch(function () {
      if (run !== sayRun) return;
      sayHolding = false;
      toast("需要允许使用麦克风，才能跟读。");
      UI.sayPhase = "";
      draw();
    });
  }

  function holdSay(button) {
    if (sayHolding || UI.sayPhase === "rec" || UI.sayPhase === "mark") return;
    const lesson = findLesson(UI.lessonId);
    const line = lesson && lessonSentences(lesson)[UI.sayAt];
    if (!line) return;
    Speech.stop();
    stopSayCapture();
    sayHolding = true;
    UI.sayPhase = "rec";
    UI.sayResult = null;
    if (button) button.classList.add("is-hold");
    const panel = document.querySelector(".say-page .say-panel");
    if (panel) panel.innerHTML = '<div class="say-wave" id="say-wave" aria-hidden="true"></div><p class="hint">松手后结束并评测</p>';
    beginSayCapture(line);
  }

  function releaseSay() {
    if (!sayHolding) return;
    sayHolding = false;
    const button = document.querySelector(".say-mic");
    if (button) button.classList.remove("is-hold");
    if (sayAudio.rec && sayAudio.rec.state === "recording") {
      if (sayAudio.timer) clearTimeout(sayAudio.timer);
      sayAudio.timer = 0;
      if (sayAudio.raf) cancelAnimationFrame(sayAudio.raf);
      sayAudio.rec.stop();
    }
  }

  function bindSayMic() {
    const button = document.querySelector(".say-page .say-mic");
    if (!button) return;
    function end(event) {
      if (event && button.hasPointerCapture && button.hasPointerCapture(event.pointerId)) {
        try { button.releasePointerCapture(event.pointerId); } catch (err) { /* ignore */ }
      }
      releaseSay();
    }
    button.addEventListener("pointerdown", function (event) {
      if (event.button != null && event.button !== 0) return;
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch (err) { /* ignore */ }
      holdSay(button);
    });
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("contextmenu", function (event) { event.preventDefault(); });
  }

  function maybeSpeakLesson() {
    if (UI.view !== "course" || !UI.lessonId || UI.sayPhase === "rec" || UI.sayPhase === "mark") return;
    const lesson = findLesson(UI.lessonId);
    if (!lesson) return;
    const list = lessonSentences(lesson);
    const line = list[UI.sayAt];
    if (!line) return;
    const token = lesson.id + ":" + UI.sayAt + ":" + line.thai;
    if (saySpoken === token) return;
    saySpoken = token;
    Speech.speak(line.thai, { gender: line.gender });
  }

  function sayResultHtml(result) {
    if (!result) return "";
    const words = result.words.map(function (word) {
      const mark = word.level === "ok" ? "✅" : word.level === "mid" ? "⚠️" : "❌";
      const hint = word.level === "bad" && word.hint ? "<small>" + esc(word.hint) + "</small>" : "";
      return '<span class="say-word is-' + word.level + '">' + mark + " " + esc(word.text) + hint + "</span>";
    }).join("");
    const note = result.note ? '<p class="hint">' + esc(result.note) + "</p>" : "";
    return '<div class="say-score"><b>' + result.score + '</b><span>分</span></div>' + note + '<p class="hint">绿色为读准，黄色为接近，红色需再练。可反复重录。</p><div class="say-words">' + words + "</div>";
  }

  function courseLesson(lesson) {
    if (UI.sayLesson !== lesson.id) {
      UI.sayLesson = lesson.id;
      UI.sayAt = 0;
      UI.sayMode = "listen";
      UI.sayPhase = "";
      UI.sayResult = null;
      saySpoken = "";
      stopSayCapture();
    }
    const list = lessonSentences(lesson);
    if (!list.length) {
      return '<div class="page course-page"><p class="muted">' + esc(lesson.level) + "</p><p>" + esc(lesson.aim) + '</p><button type="button" class="btn btn-primary" data-act="lesson-study" data-id="' + esc(lesson.id) + '">学习本课生词</button></div>';
    }
    const at = Math.max(0, Math.min(UI.sayAt || 0, list.length - 1));
    UI.sayAt = at;
    const line = list[at];
    let panel = "";
    if (UI.sayPhase === "rec") panel = '<div class="say-wave" id="say-wave" aria-hidden="true"></div><p class="hint">松手后结束并评测</p>';
    else if (UI.sayPhase === "mark") panel = '<p class="hint">正在评测</p>';
    else if (UI.sayResult) panel = sayResultHtml(UI.sayResult);
    else panel = '<p class="hint">按住麦克风录音，松手后评测。</p>';
    const horn = '<button type="button" class="horn say-icon" data-act="speak" data-gender="' + line.gender + '" data-thai="' + encodeURIComponent(line.thai) + '" aria-label="听句子"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="horn-body" d="M4 9v6h3.5L13 19.5v-15L7.5 9H4z"/><path class="horn-wave" d="M16 9.2c1.2.8 1.8 1.7 1.8 2.8s-.6 2-1.8 2.8"/><path class="horn-wave horn-wave-2" d="M18.2 7c1.8 1.3 2.8 2.8 2.8 5s-1 3.7-2.8 5"/></svg></button>';
    const mic = '<button type="button" class="say-icon say-mic" aria-label="按住录音"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V20M9 20h6"/></svg></button>';
    return '<div class="page course-page say-page"><p class="say-progress">第 ' + (at + 1) + " / " + list.length + " 句 · " + esc(line.who) + "</p>" +
      '<p class="say-thai" lang="th">' + esc(line.thai) + '</p><p class="say-roman">' + esc(line.roman) + '</p><p class="say-zh">' + esc(line.zh) + "</p>" +
      '<div class="say-actions">' + horn + mic + "</div>" +
      '<div class="say-panel">' + panel + "</div>" +
      '<div class="say-nav"><button type="button" class="btn"' + (at === 0 ? " disabled" : "") + ' data-act="say-prev">上一句</button><button type="button" class="btn"' + (at === list.length - 1 ? " disabled" : "") + ' data-act="say-next">下一句</button></div>' +
      '<button type="button" class="btn btn-primary" data-act="lesson-study" data-id="' + esc(lesson.id) + '">学习本课生词</button></div>';
  }

  function textsPage() {
    if (!window.FSI) {
      loadFsi().then(function (ok) { if (ok) draw(); });
      return '<div class="page"><h1>分级课文</h1><p class="hint">课文下载中，请稍候…</p></div>';
    }
    if (UI.unit) {
      const unit = FSI.units.filter(function (item) { return item.n === UI.unit; })[0];
      if (!unit) return '<div class="page"><h1>没有这一课</h1></div>';
      const lines = (unit.dialog || []).map(function (line) {
        return '<article class="word-row"><div class="grow"><p class="th" lang="th">' + esc(line.thai) + '</p><p class="muted">' + esc(line.roman) + (line.en ? " · " + esc(line.en) : "") + '</p></div><button type="button" class="btn btn-ghost say-play" data-act="speak" data-thai="' + encodeURIComponent(line.thai) + '">▶ 听</button></article>';
      }).join("");
      return '<div class="page"><p class="muted">' + esc(unit.level) + " · 第 " + unit.n + " 课</p><h1>" + esc(unit.zh) + '</h1><p class="muted">' + esc(unit.aim) + "</p><div class=\"list\" style=\"margin-top:14px\">" + (lines || '<p class="muted">这一课请打开原页收听。</p>') + '</div><p style="margin-top:12px"><a href="' + esc(unit.url) + '" target="_blank" rel="noopener">打开原课</a></p></div>';
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

  let pageKey = "";
  let navMotion = "";
  let endSlide = null;

  function currentPageKey() {
    return [UI.view, UI.bookId, UI.lessonId || "", UI.coursePane || "", UI.courseFocus || "", (UI.phonics && UI.phonics.lesson) || "", UI.unit || 0, UI.openBook || "", UI.booksSeries || "", UI.bucket || "", UI.courseUnit || ""].join("|");
  }

  function draw() {
    const root = document.getElementById("app");
    hideInfoPop();
    if (endSlide) endSlide();
    const nextKey = currentPageKey();
    const changed = pageKey !== "" && pageKey !== nextKey;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = changed && !reduce && navMotion !== "cut" ? (navMotion === "back" ? "back" : "forward") : "";
    navMotion = "";
    pageKey = nextKey;
    let outgoing = null;
    if (dir) {
      const current = root.querySelector(".main-slot > .main");
      if (current) outgoing = current.cloneNode(true);
    }
    let html = "";
    if (UI.view === "auth") html = authPage();
    else if (UI.view === "books") html = shell(booksPage());
    else if (UI.view === "book") html = shell(bookPage());
    else if (UI.view === "progress") html = shell(progressPage());
    else if (UI.view === "bucket") html = shell(wordListPage());
    else if (UI.view === "plan") html = shell(planSettingsPage());
    else if (UI.view === "study") html = shell(studyPage(), bookById(UI.bookId).title);
    else if (UI.view === "notebook" || (UI.view === "study" && UI.bookId === "star")) html = shell(notebookPage());
    else if (UI.view === "stats") html = shell(statsPage());
    else if (UI.view === "profile") html = shell(profilePage());
    else if (UI.view === "quiz") html = shell(quizPage());
    else if (UI.view === "texts") html = shell(textsPage());
    else if (UI.view === "course") html = shell(coursePage());
    else if (UI.view === "coursebook") html = shell(courseTaskPage());
    else if (UI.view === "summary") html = shell(summaryPage());
    else if (UI.view === "phonics") {
      if (UI.phonics.pane === "words") html = shell(phonicsWordsPage(UI.phonics.lesson));
      else if (UI.phonics.pane === "notes") html = shell(phonicsNotesPage(UI.phonics.lesson));
      else if (window.PHONICS) {
        UI.phonics.dailyPhonics = dailyPhonicsGoal();
        UI.phonics.phonicsToday = phonicsCoursesDoneToday();
        html = shell(PHONICS.render(UI.phonics, Store.phonics()));
      } else {
        loadPhonics().then(function (ok) { if (ok) draw(); });
        html = shell('<div class="page"><h1>音标入门</h1><p class="hint">音标下载中，请稍候…</p></div>');
      }
    }
    else html = shell(home());
    root.innerHTML = html;
    const title = pageTitle();
    document.title = title === "RianThai" ? "RianThai" : title + " · RianThai";
    const wheel = document.querySelector(".wheel");
    const picked = wheel && wheel.querySelector(".is-on");
    if (wheel && picked) wheel.scrollTop = Math.max(0, picked.offsetTop - (wheel.clientHeight - picked.offsetHeight) / 2);
    bindHomeTrack();
    bindSayMic();
    maybeSpeakLesson();
    const slot = root.querySelector(".main-slot");
    const incoming = slot && slot.querySelector(".main");
    if (!dir || !outgoing || !slot || !incoming) return;
    slot.classList.add("is-sliding");
    outgoing.classList.add("slide-leave", "slide-" + dir);
    incoming.classList.add("slide-enter", "slide-" + dir);
    slot.appendChild(outgoing);
    let settled = false;
    function settle() {
      if (settled) return;
      settled = true;
      if (endSlide === settle) endSlide = null;
      if (outgoing.parentNode) outgoing.parentNode.removeChild(outgoing);
      incoming.classList.remove("slide-enter", "slide-forward", "slide-back", "is-on");
      slot.classList.remove("is-sliding");
    }
    endSlide = settle;
    incoming.addEventListener("transitionend", function (event) {
      if (event.target === incoming && event.propertyName === "transform") settle();
    });
    window.setTimeout(settle, 420);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (settled) return;
        outgoing.classList.add("is-on");
        incoming.classList.add("is-on");
      });
    });
  }

  function bindHomeTrack() {
    const track = document.querySelector("[data-home-track]");
    if (!track) return;
    const slides = track.querySelectorAll(".today-slide");
    const index = UI.homeSlide ? 1 : 0;
    if (slides[index]) track.scrollLeft = slides[index].offsetLeft;
    track.addEventListener("scroll", function () {
      clearTimeout(track._wait);
      track._wait = setTimeout(function () {
        const width = track.clientWidth || 1;
        const next = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
        UI.homeSlide = next;
        const tabs = document.querySelectorAll("[data-act=home-slide]");
        Array.prototype.forEach.call(tabs, function (tab, at) {
          tab.classList.toggle("is-on", at === next);
        });
      }, 60);
    });
  }

  function restoreToneSectionQuiz(kind) {
    if (!/^l1[a-e]$/.test(kind) || !window.PHONICS) return null;
    const row = PHONICS.sectionState(Store.phonics(), kind);
    if (!row.quiz || row.quiz.kind !== kind) return null;
    try {
      return JSON.parse(JSON.stringify(row.quiz));
    } catch (err) {
      return null;
    }
  }

  function syncPhonicsStudyCursor(kind, row) {
    if (!/^l1[a-e]$/.test(String(kind || ""))) {
      UI.phonics.studyKind = "";
      UI.phonics.studyIndex = 0;
      UI.phonics.studyDone = false;
      return;
    }
    const prog = row || (window.PHONICS ? PHONICS.sectionState(Store.phonics(), kind) : { studyIndex: 0, studyDone: false });
    UI.phonics.studyKind = kind;
    UI.phonics.studyIndex = Math.max(0, Math.floor(Number(prog.studyIndex) || 0));
    UI.phonics.studyDone = !!prog.studyDone;
  }

  function persistToneSectionQuiz(quiz) {
    if (!quiz || !/^l1[a-e]$/.test(String(quiz.kind || ""))) return;
    const row = PHONICS.sectionState(Store.phonics(), quiz.kind);
    try {
      row.quiz = JSON.parse(JSON.stringify(quiz));
    } catch (err) {
      row.quiz = quiz;
    }
    Store.phonicsSave();
  }

  function finishPhonicsQuiz(quiz) {
    quiz.done = true;
    quiz.passed = !!(quiz.total && quiz.correct / quiz.total >= 0.8);
    if (quiz.kind === "l5") {
      const by = { roman: { ok: 0, n: 0 }, tone: { ok: 0, n: 0 }, length: { ok: 0, n: 0 } };
      quiz.items.forEach(function (item) {
        const bucket = by[item.type] || by.tone;
        bucket.n += 1;
        if (quiz.wrongs.indexOf(item) < 0) bucket.ok += 1;
      });
      Store.phonics().report = {
        at: Store.dateKey(),
        correct: quiz.correct,
        total: quiz.total,
        byType: by,
        wrongs: quiz.wrongs.map(function (item) { return { prompt: item.prompt, answerLabel: item.answerLabel }; })
      };
      Store.phonicsSave();
    }
    persistToneSectionQuiz(quiz);
    if (!quiz.passed) return;
    const fresh = Store.phonicsPass(quiz.kind);
    const xp = Store.award("phonics:practice", 5);
    toastPhonicsCourseDone(quiz.kind, fresh, xp);
  }

  function toastPhonicsCourseDone(kind, fresh, xp) {
    if (fresh) {
      toast("音标入门已完成，今日打卡已记下。");
      return;
    }
    const id = String(kind || "");
    const counts = PHONICS_COURSE_IDS.indexOf(id) >= 0;
    const done = phonicsCoursesDoneToday();
    const goal = dailyPhonicsGoal();
    if (counts && done >= goal) {
      toast("今日 " + goal + " 课已完成。");
      return;
    }
    if (xp) toast("本组已完成，今日打卡已记下。");
    else if (/^l1[a-e]$/.test(id)) toast("本课已完成。");
  }

  function exportBackup() {
    let study = null;
    try { study = JSON.parse(localStorage.getItem("daiyin-thai-v1") || "null"); } catch (err) { study = null; }
    const payload = { app: "RianThai", version: 1, at: new Date().toISOString(), books: local, study: study };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rianthai-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("备份已导出。");
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const data = JSON.parse(String(reader.result || ""));
        if (!data || data.app !== "RianThai" || !data.books || typeof data.books !== "object") {
          toast("这份备份无法读取。");
          return;
        }
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data.books));
        if (data.study && typeof data.study === "object") localStorage.setItem("daiyin-thai-v1", JSON.stringify(data.study));
        toast("备份已恢复。");
        location.reload();
      } catch (err) {
        toast("这份备份无法读取。");
      }
    };
    reader.readAsText(file);
  }

  function onClick(event) {
    const infoBtn = event.target.closest("[data-act='info-open']");
    if (infoBtn) {
      event.preventDefault();
      event.stopPropagation();
      const id = infoBtn.dataset.info || "";
      const text = INFO_TIPS[id] || infoBtn.dataset.tip || "";
      if (!text) return;
      const pop = document.getElementById("info-pop");
      if (pop && !pop.hidden && infoBtn.getAttribute("aria-expanded") === "true") {
        hideInfoPop();
        return;
      }
      showInfoPop(infoBtn, text);
      return;
    }
    if (!event.target.closest("#info-pop")) hideInfoPop();
    const button = event.target.closest("[data-act]");
    if (!button) return;
    const act = button.dataset.act;
    if (act === "locked") {
      toast("完成前置等级词本后解锁。");
      return;
    }
    if (act === "back") {
      goBack();
      return;
    }
    if (act === "book-open") {
      const target = bookById(button.dataset.id || UI.bookId);
      if (bookPending(target)) {
        wantBook(target, function () {
          const before = snapshot();
          UI.openBook = target.id;
          UI.view = "book";
          noteNav(before);
          draw();
        });
        return;
      }
      const before = snapshot();
      UI.openBook = target.id;
      UI.view = "book";
      noteNav(before);
      draw();
      return;
    }
    if (act === "book-progress") {
      const before = snapshot();
      UI.openBook = button.dataset.id || UI.bookId;
      UI.bucket = "";
      UI.view = "progress";
      noteNav(before);
      draw();
      return;
    }
    if (act === "bucket") {
      const before = snapshot();
      UI.bucket = button.dataset.id || "fresh";
      UI.view = "bucket";
      noteNav(before);
      draw();
      return;
    }
    if (act === "wheel-pick") {
      const wheel = button.closest(".wheel");
      if (wheel) {
        wheel.scrollTop = Math.max(0, button.offsetTop - (wheel.clientHeight - button.offsetHeight) / 2);
        applyWheel(wheel);
      }
      return;
    }
    if (act === "go") {
      const before = snapshot();
      const next = button.dataset.view;
      const sectionSwitch = next === "home" || next === "books" || next === "course" || next === "profile";
      if (UI.view === "study") leaveStudy();
      UI.view = next;
      if (UI.view === "quiz") UI.quiz = null;
      if (next === "course") {
        UI.lessonId = "";
        UI.coursePane = "";
        UI.courseFocus = "";
        UI.courseUnit = "";
      }
      if (next === "phonics") UI.phonics.lesson = "";
      if (UI.view !== "texts") UI.unit = 0;
      if (sectionSwitch) {
        UI.nav = [];
        UI.openBook = "";
        UI.booksSeries = "";
        UI.bucket = "";
        UI.courseUnit = "";
        if (button.closest(".bottom-nav")) navMotion = "cut";
      } else noteNav(before);
      draw();
      return;
    }
    if (act === "series-open") {
      const id = button.dataset.id || "";
      if (!id) return;
      if (id !== "custom" && !BOOKS.some(function (book) { return book.id === id; })) return;
      const before = snapshot();
      UI.booksSeries = id;
      if (id !== "custom") kickLexUpTo(id);
      noteNav(before);
      draw();
      return;
    }
    if (act === "pick-book") {
      const before = snapshot();
      if (UI.view === "study") leaveStudy();
      rememberBook(button.dataset.id);
      if (button.dataset.id === "star") UI.view = "notebook";
      else UI.view = "home";
      noteNav(before);
      draw();
      return;
    }
    if (act === "resume-home") {
      const kind = button.dataset.kind || "word";
      if (kind === "course") {
        const level = button.dataset.id || local.courseLevel || "A1";
        if (level === "phonics" || BOOKS.some(function (book) { return book.id === level; })) {
          UI.courseLevel = level;
          local.courseLevel = level;
          saveLocal();
        }
        UI.homeSlide = 1;
      } else {
        rememberBook(button.dataset.id || local.bookId);
        UI.homeSlide = 0;
      }
      UI.view = "home";
      UI.lessonId = "";
      UI.coursePane = "";
      UI.courseFocus = "";
      UI.openBook = "";
      UI.nav = [];
      navMotion = "cut";
      draw();
      return;
    }
    if (act === "start") {
      const before = snapshot();
      startStudy(button.dataset.id || UI.bookId);
      presentAfter(before);
      return;
    }
    if (act === "lesson") {
      const before = snapshot();
      UI.lessonId = button.dataset.id;
      UI.view = "course";
      noteNav(before);
      draw();
      return;
    }
    if (act === "lesson-study") {
      const before = snapshot();
      startLesson(button.dataset.id);
      presentAfter(before);
      return;
    }
    if (act === "course-level" || act === "course-pick") {
      const pick = button.dataset.id || "";
      if (pick === "phonics" || pick === "grammar" || BOOKS.some(function (book) { return book.id === pick; })) {
        const prev = courseTrackId();
        UI.courseLevel = pick;
        local.courseLevel = pick;
        UI.courseUnit = "";
        saveLocal();
        if (pick !== prev) toast("已设为当前课程：" + courseTrackTitle(pick));
        if (pick === "phonics" && !window.PHONICS) {
          loadPhonics().then(function (ok) { if (ok) draw(); });
        } else if (pick === "grammar") {
          if (!lexLevelsUpTo("A1").every(lexReady)) {
            toast("正在下载词库，请稍候");
            kickLexUpTo("A1");
          }
        } else if (pick !== "phonics" && !lexLevelsUpTo(pick).every(lexReady)) {
          toast("正在下载词库，请稍候");
          kickLexUpTo(pick);
        }
      }
      draw();
      return;
    }
    if (act === "open-unit") {
      const unit = findUnit(button.dataset.id);
      if (!unit || !unitIsOpen(unit)) {
        toast("完成上一单元后解锁。");
        return;
      }
      const before = snapshot();
      UI.courseUnit = unit.id;
      UI.courseLevel = unit.level;
      local.courseLevel = unit.level;
      UI.lessonId = "";
      UI.coursePane = "";
      UI.courseFocus = "";
      UI.view = "course";
      saveLocal();
      noteNav(before);
      draw();
      return;
    }
    if (act === "home-slide") {
      const track = document.querySelector("[data-home-track]");
      const index = Number(button.dataset.id) || 0;
      UI.homeSlide = index;
      const tabs = document.querySelectorAll("[data-act=home-slide]");
      Array.prototype.forEach.call(tabs, function (tab, at) {
        tab.classList.toggle("is-on", at === index);
      });
      if (track) {
        const slide = track.querySelectorAll(".today-slide")[index];
        if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
      }
      return;
    }
    if (act === "course-open") {
      // 首页入口只打开当前课程说明（目录+课量），不切换轨道。
      const before = snapshot();
      UI.view = "coursebook";
      UI.lessonId = "";
      UI.coursePane = "";
      UI.courseUnit = "";
      UI.courseFocus = "";
      if (courseTrackId() === "phonics" && !window.PHONICS) {
        loadPhonics().then(function (ok) { if (ok) draw(); });
      }
      noteNav(before);
      draw();
      return;
    }
    if (act === "course-locked") {
      toast("完成上一单元后解锁。");
      return;
    }
    if (act === "course-today") {
      const book = courseBook();
      if (book.id === "phonics") {
        const before = snapshot();
        local.courseLevel = "phonics";
        UI.courseLevel = "phonics";
        saveLocal();
        if (!window.PHONICS) {
          toast("音标下载中，请稍候");
          loadPhonics().then(function (ok) {
            if (!ok) {
              toast("音标下载失败，请检查网络后再试");
              return;
            }
            UI.phonics.lesson = "";
            UI.phonics.quiz = null;
            UI.view = "phonics";
            noteNav(before);
            draw();
          });
          return;
        }
        UI.phonics.lesson = "";
        UI.phonics.quiz = null;
        UI.view = "phonics";
        noteNav(before);
        draw();
        return;
      }
      if (bookPending(book)) {
        wantBook(book);
        return;
      }
      if (levelCourseLocked(book.id)) {
        toast("完成上一单元后解锁。");
        return;
      }
      const pack = coursePack(book.id);
      const next = pack.pending[0];
      const before = snapshot();
      if (!next) {
        if (!levelUnitsOpen(book.id)) {
          toast("完成上一单元后解锁。");
          return;
        }
        beginCourseQueue(courseReviewQueue(pack.lessons), "review", "unit:" + book.id);
        presentAfter(before);
        return;
      }
      const rec = courseRec(next.id);
      rec.started = true;
      local.courseProgress[next.id] = rec;
      saveLocal();
      UI.lessonId = next.id;
      UI.coursePane = "";
      UI.view = "course";
      noteNav(before);
      draw();
      return;
    }
    if (act === "course-filter") {
      UI.courseFilter = button.dataset.id || "全部";
      draw();
      return;
    }
    if (act === "course-learn") {
      const lesson = findLesson(button.dataset.id);
      if (!lesson) return;
      if (!lexLevelsUpTo(lesson.level).every(lexReady)) {
        toast("正在下载词库，请稍候");
        kickLexUpTo(lesson.level);
        return;
      }
      if (lessonLocked(lesson)) {
        toast("完成上一单元后解锁。");
        return;
      }
      const before = snapshot();
      UI.courseLevel = lesson.level;
      local.courseLevel = lesson.level;
      saveLocal();
      UI.lessonId = lesson.id;
      UI.coursePane = "";
      UI.courseFocus = "";
      UI.view = "course";
      noteNav(before);
      draw();
      return;
    }
    if (act === "course-review") {
      const lesson = findLesson(button.dataset.id);
      if (!lesson) return;
      if (lessonLocked(lesson)) {
        toast("完成上一单元后解锁。");
        return;
      }
      const rec = courseRec(lesson.id);
      if (!rec.started && !rec.done) return;
      const before = snapshot();
      beginCourseQueue(courseReviewQueue([lesson]), "review", lesson.id);
      presentAfter(before);
      return;
    }
    if (act === "course-unit") {
      const book = BOOKS.filter(function (item) { return item.id === button.dataset.id; })[0];
      if (!book) return;
      if (!levelUnitsOpen(book.id)) {
        toast("完成上一单元后解锁。");
        return;
      }
      const items = ((window.COURSE && COURSE.lessons) || []).filter(function (lesson) { return lesson.level === book.id && !lessonLocked(lesson); });
      const before = snapshot();
      beginCourseQueue(courseReviewQueue(items), "review", "unit:" + book.id);
      presentAfter(before);
      return;
    }
    if (act === "course-words" || act === "course-notes") {
      const lesson = findLesson(button.dataset.id);
      if (!lesson) return;
      if (lessonLocked(lesson)) {
        toast("完成上一单元后解锁。");
        return;
      }
      const before = snapshot();
      UI.courseFocus = lesson.id;
      UI.coursePane = act === "course-words" ? "words" : "notes";
      UI.lessonId = "";
      UI.view = "course";
      noteNav(before);
      draw();
      return;
    }
    if (act === "course-note-save") {
      const box = document.getElementById("course-note");
      local.lessonNotes = local.lessonNotes || {};
      local.lessonNotes[button.dataset.id] = box ? String(box.value || "").slice(0, 500) : "";
      saveLocal();
      toast("笔记已保存。");
      return;
    }
    if (act === "flip") {
      UI.flipped = !UI.flipped;
      const node = document.querySelector(".flip");
      if (node) node.classList.toggle("is-back", UI.flipped);
      return;
    }
    if (act === "choose") {
      const ask = currentAsk();
      if (!ask || ask.pick >= 0) return;
      ask.pick = Number(button.dataset.idx);
      draw();
      return;
    }
    if (act === "choose-next") {
      const ask = currentAsk();
      if (!ask || ask.pick < 0) return;
      if (ask.options[ask.pick] === ask.zh) markKnown();
      else markUnknown();
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
      if (sayHolding || UI.sayPhase === "rec" || UI.sayPhase === "mark") return;
      speak(decodeURIComponent(button.dataset.thai || ""), button.dataset.gender || "", button.dataset.slow === "1", button);
      return;
    }
    if (act === "say-prev" || act === "say-next") {
      const lesson = findLesson(UI.lessonId);
      const list = lesson ? lessonSentences(lesson) : [];
      const next = UI.sayAt + (act === "say-next" ? 1 : -1);
      if (next < 0 || next >= list.length) return;
      Speech.stop();
      stopSayCapture();
      UI.sayAt = next;
      UI.sayPhase = "";
      UI.sayResult = null;
      saySpoken = "";
      draw();
      return;
    }
    if (act === "phonics-jump") {
      UI.phonics.point = window.PHONICS ? PHONICS.parseSyllable(button.dataset.syl || "") : null;
      UI.phonics.pointThai = decodeURIComponent(button.dataset.thai || "");
      UI.phonics.lesson = "point";
      UI.view = "phonics";
      draw();
      return;
    }
    if (act === "phonics-locked") {
      const lockedId = button.dataset.id || "";
      toast(/^l1[b-e]$/.test(lockedId) ? "请先完成上一课。" : "请先完成上一单元。");
      return;
    }
    if (act === "phonics-words" || act === "phonics-notes") {
      const id = button.dataset.id || "";
      if (!/^l1[a-e]$/.test(id)) return;
      if (!window.PHONICS) {
        toast("音标下载中，请稍候");
        loadPhonics();
        return;
      }
      if (!PHONICS.openLesson(id, Store.phonics())) {
        toast(/^l1[b-e]$/.test(id) ? "请先完成上一课。" : "请先完成上一单元。");
        return;
      }
      const before = snapshot();
      UI.phonics.lesson = id;
      UI.phonics.pane = act === "phonics-words" ? "words" : "notes";
      UI.phonics.quiz = null;
      UI.view = "phonics";
      noteNav(before);
      draw();
      return;
    }
    if (act === "phonics-open") {
      const id = button.dataset.id || "";
      local.courseLevel = "phonics";
      UI.courseLevel = "phonics";
      saveLocal();
      if (!window.PHONICS) {
        toast("音标下载中，请稍候");
        loadPhonics().then(function (ok) {
          if (!ok) {
            toast("音标下载失败，请检查网络后再试");
            return;
          }
          const beforeLate = snapshot();
          UI.phonics.lesson = id && PHONICS.openLesson(id, Store.phonics()) ? id : "";
          UI.phonics.pane = "";
          UI.phonics.quiz = restoreToneSectionQuiz(UI.phonics.lesson);
          syncPhonicsStudyCursor(UI.phonics.lesson);
          UI.phonics.flipped = false;
          if (UI.phonics.lesson === "l4") {
            UI.phonics.deck = PHONICS.a1Deck();
            UI.phonics.index = 0;
            UI.phonics.deckDone = false;
          }
          UI.view = "phonics";
          noteNav(beforeLate);
          draw();
        });
        return;
      }
      const before = snapshot();
      if (id && !PHONICS.openLesson(id, Store.phonics())) {
        toast(/^l1[b-e]$/.test(id) ? "请先完成上一课。" : (id === "l2b" || id === "l2c" ? "请先完成上一批声母。" : "请先完成上一单元。"));
        return;
      }
      UI.phonics.lesson = id;
      UI.phonics.pane = "";
      UI.phonics.quiz = restoreToneSectionQuiz(id);
      syncPhonicsStudyCursor(id);
      UI.phonics.flipped = false;
      if (id === "l4") {
        UI.phonics.deck = PHONICS.a1Deck();
        UI.phonics.index = 0;
        UI.phonics.deckDone = false;
      }
      UI.view = "phonics";
      noteNav(before);
      draw();
      return;
    }
    if (act === "phonics-batch") {
      const id = "l2" + (button.dataset.id || "a");
      if (!PHONICS.openLesson(id, Store.phonics())) {
        toast("请先完成上一批声母。");
        return;
      }
      UI.phonics.batch = button.dataset.id || "a";
      UI.phonics.quiz = null;
      draw();
      return;
    }
    if (act === "phonics-toggle-letter") {
      UI.phonics.showLetter = !UI.phonics.showLetter;
      draw();
      return;
    }
    if (act === "phonics-study-prev") {
      const kind = button.dataset.id || UI.phonics.lesson;
      if (!/^l1[a-e]$/.test(kind) || !window.PHONICS) return;
      if (button.disabled) return;
      const row = PHONICS.retreatStudy(Store.phonics(), kind);
      syncPhonicsStudyCursor(kind, row);
      Store.phonicsSave();
      draw();
      return;
    }
    if (act === "phonics-study-next") {
      const kind = button.dataset.id || UI.phonics.lesson;
      if (!/^l1[a-e]$/.test(kind) || !window.PHONICS) return;
      const row = PHONICS.advanceStudy(Store.phonics(), kind);
      syncPhonicsStudyCursor(kind, row);
      Store.phonicsSave();
      draw();
      return;
    }
    if (act === "phonics-study-reset") {
      const kind = button.dataset.id || UI.phonics.lesson;
      if (!/^l1[a-e]$/.test(kind) || !window.PHONICS) return;
      const row = PHONICS.resetStudy(Store.phonics(), kind);
      row.quiz = null;
      syncPhonicsStudyCursor(kind, row);
      Store.phonicsSave();
      UI.phonics.quiz = null;
      draw();
      return;
    }
    if (act === "phonics-quiz-dismiss") {
      const kind = button.dataset.id || UI.phonics.lesson;
      if (!/^l1[a-e]$/.test(kind) || !window.PHONICS) return;
      const row = PHONICS.sectionState(Store.phonics(), kind);
      row.quiz = null;
      Store.phonicsSave();
      UI.phonics.quiz = null;
      draw();
      return;
    }
    if (act === "phonics-drill") {
      const drillId = button.dataset.id || "";
      if (!window.PHONICS) {
        toast("音标下载中，请稍候");
        loadPhonics();
        return;
      }
      if (drillId && !PHONICS.openLesson(drillId, Store.phonics())) {
        toast(/^l1[b-e]$/.test(drillId) ? "请先完成上一课。" : (drillId === "l2b" || drillId === "l2c" ? "请先完成上一批声母。" : "请先完成上一单元。"));
        return;
      }
      const before = snapshot();
      UI.view = "phonics";
      if (/^l1[a-e]$/.test(drillId)) UI.phonics.lesson = drillId;
      else if (drillId === "l5" || drillId === "l3") UI.phonics.lesson = drillId;
      else if (/^l2[abc]$/.test(drillId)) {
        UI.phonics.lesson = "l2";
        UI.phonics.batch = drillId.slice(2);
      }
      UI.phonics.pane = "";
      UI.phonics.quiz = drillId === "l5" ? PHONICS.makeExam() : PHONICS.makeDrill(drillId);
      persistToneSectionQuiz(UI.phonics.quiz);
      noteNav(before);
      draw();
      return;
    }
    if (act === "ph-answer") {
      const quiz = UI.phonics.quiz;
      if (!quiz || quiz.picked) return;
      const item = quiz.items[quiz.index];
      quiz.picked = button.dataset.id;
      if (quiz.picked === item.answer) quiz.correct += 1;
      else {
        quiz.wrongs.push(item);
        Store.phonicsMiss("ph:" + (item.type || quiz.kind) + ":" + item.thai + ":" + item.answer, {
          thai: item.thai,
          prompt: item.prompt,
          answerLabel: item.answerLabel
        });
      }
      persistToneSectionQuiz(quiz);
      draw();
      return;
    }
    if (act === "ph-next") {
      const quiz = UI.phonics.quiz;
      if (!quiz) return;
      quiz.picked = "";
      quiz.index += 1;
      if (quiz.index >= quiz.items.length) finishPhonicsQuiz(quiz);
      else persistToneSectionQuiz(quiz);
      draw();
      return;
    }
    if (act === "ph-build") {
      UI.phonics.build[button.dataset.key] = button.dataset.val;
      draw();
      return;
    }
    if (act === "phonics-flip") {
      UI.phonics.flipped = !UI.phonics.flipped;
      const node = document.querySelector(".flip");
      if (node) node.classList.toggle("is-back", UI.phonics.flipped);
      return;
    }
    if (act === "phonics-next") {
      UI.phonics.flipped = false;
      UI.phonics.index += 1;
      if (UI.phonics.index >= UI.phonics.deck.length) UI.phonics.deckDone = true;
      draw();
      return;
    }
    if (act === "phonics-pass") {
      const kind = button.dataset.id || "l4";
      const fresh = Store.phonicsPass(kind);
      const xp = Store.award("phonics:practice", 5);
      toastPhonicsCourseDone(kind, fresh, xp);
      draw();
      return;
    }
    if (act === "ph-grade") {
      Store.phonicsGrade(button.dataset.id, button.dataset.ok === "1");
      UI.phonics.flipped = false;
      draw();
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
      UI.ask = null;
      saveLocal();
      draw();
      return;
    }
    if (act === "set-order") {
      local.order = button.dataset.val;
      saveLocal();
      draw();
      return;
    }
    if (act === "set-voice") {
      local.voice = button.dataset.val;
      saveLocal();
      draw();
      return;
    }
    if (act === "theme-toggle" || act === "import-file" || act === "tts-cloud") return;
    if (act === "theme-system") {
      local.theme = "system";
      applyTheme();
      saveLocal();
      draw();
      return;
    }
    if (act === "sync-now") {
      if (!Account.session()) {
        toast("请先登录后再同步");
        return;
      }
      toast("正在同步…");
      Account.syncNow().then(function () {
        toast(Account.status() === "error" ? "同步失败，请稍后重试" : "同步完成");
        draw();
      }).catch(function () {
        toast("同步失败，请稍后重试");
        draw();
      });
      return;
    }
    if (act === "show-notes") {
      UI.notesOpen = true;
      draw();
      return;
    }
    if (act === "export-backup") {
      exportBackup();
      return;
    }
    if (act === "import-backup") {
      const input = document.getElementById("backup-file");
      if (input) input.click();
      return;
    }
    if (act === "logout") {
      Account.logout();
      toast("已退出登录。本机进度仍在。");
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
      const before = snapshot();
      UI.unit = Number(button.dataset.n || 0);
      noteNav(before);
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

  window.addEventListener("pagehide", function () {
    flushStudyClock();
    saveStudy();
  });
  setInterval(function () {
    if (UI.view !== "study" || UI.courseMode || !studyStamp) return;
    const delta = Math.round((Date.now() - studyStamp) / 1000);
    if (delta >= 15) {
      dayLog().seconds += delta;
      studyStamp = Date.now();
      saveLocal();
    }
    const node = document.querySelector("[data-study-min]");
    if (node) node.textContent = studyTimeLabel();
  }, 15000);
  function bindEdgeBack() {
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let tracking = false;
    let dragging = false;
    function pageMain() {
      return document.querySelector(".main-slot > .main:not(.swipe-sheet)");
    }
    function shiftPage(dx) {
      const main = pageMain();
      const slot = document.querySelector(".main-slot");
      if (!main) return;
      if (slot) slot.classList.add("is-swiping");
      main.style.transition = "none";
      main.style.background = "var(--bg)";
      main.style.boxShadow = "-14px 0 28px rgba(20, 32, 48, 0.1)";
      main.style.transform = "translate3d(" + Math.max(0, dx) + "px,0,0)";
    }
    function releasePage() {
      const main = pageMain();
      const slot = document.querySelector(".main-slot");
      if (!main) {
        if (slot) slot.classList.remove("is-swiping");
        return;
      }
      main.style.transition = "transform 0.22s cubic-bezier(0.22, 0.61, 0.36, 1)";
      main.style.transform = "translate3d(0,0,0)";
      window.setTimeout(function () {
        if (main.parentNode) {
          main.style.transition = "";
          main.style.transform = "";
          main.style.background = "";
          main.style.boxShadow = "";
        }
        if (slot) slot.classList.remove("is-swiping");
      }, 240);
    }
    document.addEventListener("touchstart", function (event) {
      tracking = false;
      dragging = false;
      if (!canBack() || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const slot = document.querySelector(".main-slot");
      const left = slot ? slot.getBoundingClientRect().left : 0;
      if (touch.clientX - left > 28) return;
      const node = event.target;
      if (node.closest && node.closest("input, textarea, select, .today-track, .course-levels, .wheel, .modal-back")) return;
      startX = touch.clientX;
      startY = touch.clientY;
      lastX = touch.clientX;
      lastT = Date.now();
      velocity = 0;
      tracking = true;
    }, { passive: true });
    document.addEventListener("touchmove", function (event) {
      if (!tracking || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (!dragging) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
          tracking = false;
          return;
        }
        if (dx < 10 || dx < Math.abs(dy)) return;
        dragging = true;
      }
      const now = Date.now();
      velocity = (touch.clientX - lastX) / Math.max(1, now - lastT);
      lastX = touch.clientX;
      lastT = now;
      event.preventDefault();
      shiftPage(dx);
    }, { passive: false });
    function finish(event) {
      if (!tracking) return;
      const touch = event.changedTouches && event.changedTouches[0];
      const dx = touch ? touch.clientX - startX : 0;
      const dy = touch ? touch.clientY - startY : 0;
      const shouldBack = dragging && dx > Math.abs(dy) && (dx >= 64 || velocity > 0.45);
      tracking = false;
      dragging = false;
      if (shouldBack) goBack(dx);
      else releasePage();
    }
    document.addEventListener("touchend", finish, { passive: true });
    document.addEventListener("touchcancel", function () {
      tracking = false;
      dragging = false;
      releasePage();
    }, { passive: true });
  }

  document.body.addEventListener("click", onClick);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") hideInfoPop();
  });
  window.addEventListener("resize", hideInfoPop);
  document.body.addEventListener("change", function (event) {
    const input = event.target;
    if (!input || !input.dataset) return;
    if (input.dataset.act === "theme-toggle") {
      local.theme = input.checked ? "dark" : "light";
      applyTheme();
      saveLocal();
      draw();
      return;
    }
    if (input.dataset.act === "tts-cloud") {
      local.preferCloudTts = !!input.checked;
      saveLocal();
      return;
    }
    if (input.dataset.act === "import-file") {
      importBackup(input.files && input.files[0]);
      input.value = "";
    }
  });
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
    const act = event.target.getAttribute("data-act");
    if (act !== "search" && act !== "lex-search") return;
    if (act === "lex-search") UI.lexQuery = event.target.value;
    else UI.query = event.target.value;
    const start = event.target.selectionStart;
    draw();
    const box = document.querySelector("[data-act=" + act + "]");
    if (box) {
      box.focus();
      box.selectionStart = box.selectionEnd = start;
    }
  });
  function applyWheel(wheel) {
    const items = Array.prototype.slice.call(wheel.querySelectorAll(".wheel-item"));
    if (!items.length) return;
    const mid = wheel.scrollTop + wheel.clientHeight / 2;
    let best = items[0];
    let dist = Infinity;
    items.forEach(function (item) {
      const center = item.offsetTop + item.offsetHeight / 2;
      const gap = Math.abs(center - mid);
      if (gap < dist) {
        dist = gap;
        best = item;
      }
    });
    items.forEach(function (item) { item.classList.toggle("is-on", item === best); });
    if (best.dataset.kind === "course") {
      const nextLessons = Number(best.dataset.lessons);
      if (Number(local.dailyLessons) === nextLessons) return;
      local.dailyLessons = nextLessons;
      saveLocal();
      return;
    }
    if (best.dataset.kind === "phonics") {
      const nextPhonics = Number(best.dataset.lessons);
      if (!(nextPhonics >= 1 && nextPhonics <= 5)) return;
      if (Number(local.dailyPhonics) === nextPhonics) return;
      local.dailyPhonics = nextPhonics;
      saveLocal();
      return;
    }
    const nextNew = Number(best.dataset.new);
    const nextReview = Number(best.dataset.review);
    if (local.dailyNew === nextNew && Number(local.dailyReview) === nextReview) return;
    local.dailyNew = nextNew;
    local.dailyReview = nextReview;
    local.reviewRatio = nextNew ? nextReview / nextNew : local.reviewRatio;
    saveLocal();
  }

  document.addEventListener("scroll", function (event) {
    const wheel = event.target;
    if (!wheel || !wheel.classList || !wheel.classList.contains("wheel")) return;
    clearTimeout(wheel._wait);
    wheel._wait = setTimeout(function () { applyWheel(wheel); }, 80);
  }, true);

  window.addEventListener("daiyin-sync", function () {
    if (UI.view === "auth") return;
    draw();
  });

  function loadFonts() {
    if (document.getElementById("site-fonts")) return Promise.resolve();
    const link = document.createElement("link");
    link.id = "site-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Sarabun:wght@400;600;700&display=swap";
    document.head.appendChild(link);
    return new Promise(function (resolve) {
      let settled = false;
      function done() {
        if (settled) return;
        settled = true;
        resolve();
      }
      link.addEventListener("load", done);
      link.addEventListener("error", done);
      window.setTimeout(done, 900);
    });
  }

  function waitFontsReady() {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve();
    return Promise.race([
      document.fonts.ready.then(function () {}, function () {}),
      new Promise(function (resolve) { window.setTimeout(resolve, 700); })
    ]);
  }

  function afterPaint(done) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(done);
    });
  }

  function hideBoot() {
    const boot = document.getElementById("boot");
    if (!boot) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      // 等首页已画在 boot 底下再淡出，避免露出半成品后整页重绘的闪一下。
      afterPaint(function () {
        window.setTimeout(function () {
          boot.classList.add("is-done");
          function remove() {
            if (boot.parentNode) boot.parentNode.removeChild(boot);
          }
          if (reduce) {
            remove();
            return;
          }
          boot.addEventListener("transitionend", remove);
          window.setTimeout(remove, 400);
        }, reduce ? 0 : 120);
      });
    }
    const css = document.getElementById("app-css");
    if (css && css.media === "print" && !css.sheet) {
      css.addEventListener("load", close);
      css.addEventListener("error", close);
      window.setTimeout(close, 800);
      return;
    }
    close();
  }

  // 进首页只下载当前词本与当前课程所在的等级（含之前的等级，用于解锁判断），其余等级用时再下。
  function bootLevels() {
    const id = String(local.bookId || "A1");
    let top = "A1";
    const match = id.match(/^(A1|A2|B1|B2)/);
    if (id === "star" || (local.custom || []).some(function (book) { return book.id === id; })) top = "B2";
    else if (match) top = match[1];
    if (levelOrder().indexOf(local.courseLevel) > levelOrder().indexOf(top)) top = local.courseLevel;
    return lexLevelsUpTo(top);
  }

  // 后台词库齐了：仅在当前页确实依赖未齐等级时才整页重绘，避免进首页后无端闪一下。
  function shouldRedrawForLex() {
    if (UI.view === "books" || UI.view === "book" || UI.view === "bucket" || UI.view === "progress") return true;
    if (UI.view === "study" || UI.view === "quiz" || UI.view === "summary") return true;
    if (UI.view === "course" || UI.view === "coursebook") return true;
    return false;
  }

  function prefetchRestLex() {
    const rest = levelOrder().filter(function (lv) { return !lexStatus[lv]; });
    if (!rest.length) return;
    const run = function () {
      rest.reduce(function (chain, level) {
        return chain.then(function () { return loadLex(level); });
      }, Promise.resolve()).then(function () {
        if (shouldRedrawForLex()) draw();
      });
    };
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 4000 });
    else window.setTimeout(run, 1200);
  }

  try {
    bindEdgeBack();
    const needed = bootLevels();
    const fontsWait = loadFonts().then(waitFontsReady);
    const bootWait = Promise.all(needed.map(loadLex));
    // 词库未齐时不先画首页：否则 0/0 → 真数据 会在 boot 淡出时叠成一次「刷新」。
    Promise.all([bootWait, fontsWait]).then(function (parts) {
      const results = parts[0] || [];
      const ok = results.every(Boolean);
      if (!ok) setBootStatus("词库下载失败，可进入后点按重试");
      draw();
      hideBoot();
      if (ok) prefetchRestLex();
    });
  } catch (err) {
    var bootStatus = document.getElementById("boot-zh");
    if (bootStatus) bootStatus.textContent = "页面没有打开。请刷新后再试";
  }
})();
