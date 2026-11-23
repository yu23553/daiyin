(function () {
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const TONE_NAME = { mid: "中平", low: "低平", fall: "高降", high: "高平", rise: "低升" };
  const TONE_MARK = { mid: "无标记", low: "à", fall: "â", high: "á", rise: "ǎ" };
  const TONE_IPA = { mid: "中平，不标附加符号", low: "低调", fall: "降调", high: "高调", rise: "升调" };

  const TONES = [
    { id: "mid", thai: "มา", roman: "maa", zh: "来", memo: "没有符号就是中平。来是 มา maa。" },
    { id: "low", thai: "ป่า", roman: "bpàa", zh: "森林", memo: "à 表示低平。森林是 ป่า bpàa。" },
    { id: "fall", thai: "ผ้า", roman: "phâa", zh: "布", memo: "â 表示高降。布是 ผ้า phâa。" },
    { id: "high", thai: "ม้า", roman: "máa", zh: "马", memo: "á 表示高平。马是 ม้า máa。" },
    { id: "rise", thai: "หมา", roman: "mǎa", zh: "狗", memo: "ǎ 表示低升。狗是 หมา mǎa。" }
  ];

  const CONS = [
    { id: "g", pb: "g", th: "ก", cls: "mid", batch: "a", ipa: "k", alt: "" },
    { id: "j", pb: "j", th: "จ", cls: "mid", batch: "a", ipa: "tɕ", alt: "" },
    { id: "d", pb: "d", th: "ด", cls: "mid", batch: "a", ipa: "d", alt: "" },
    { id: "dt", pb: "dt", th: "ต", cls: "mid", batch: "a", ipa: "t", alt: "" },
    { id: "b", pb: "b", th: "บ", cls: "mid", batch: "a", ipa: "b", alt: "" },
    { id: "bp", pb: "bp", th: "ป", cls: "mid", batch: "a", ipa: "p", alt: "" },
    { id: "q", pb: "", th: "อ", cls: "mid", batch: "a", ipa: "ʔ", alt: "", label: "零声母" },
    { id: "kh", pb: "kh", th: "ข", cls: "high", batch: "b", ipa: "kʰ", alt: "低辅音字母 ค 也读 kh。" },
    { id: "ch", pb: "ch", th: "ฉ", cls: "high", batch: "b", ipa: "tɕʰ", alt: "低辅音字母 ช 也读 ch。" },
    { id: "th", pb: "th", th: "ถ", cls: "high", batch: "b", ipa: "tʰ", alt: "低辅音字母 ท 也读 th。" },
    { id: "ph", pb: "ph", th: "ผ", cls: "high", batch: "b", ipa: "pʰ", alt: "低辅音字母 พ 也读 ph。" },
    { id: "f", pb: "f", th: "ฝ", cls: "high", batch: "b", ipa: "f", alt: "低辅音字母 ฟ 也读 f。" },
    { id: "s", pb: "s", th: "ส", cls: "high", batch: "b", ipa: "s", alt: "低辅音字母 ซ 也读 s。" },
    { id: "h", pb: "h", th: "ห", cls: "high", batch: "b", ipa: "h", alt: "" },
    { id: "ng", pb: "ng", th: "ง", cls: "low", batch: "c", ipa: "ŋ", alt: "" },
    { id: "n", pb: "n", th: "น", cls: "low", batch: "c", ipa: "n", alt: "" },
    { id: "m", pb: "m", th: "ม", cls: "low", batch: "c", ipa: "m", alt: "" },
    { id: "y", pb: "y", th: "ย", cls: "low", batch: "c", ipa: "j", alt: "" },
    { id: "r", pb: "r", th: "ร", cls: "low", batch: "c", ipa: "r", alt: "" },
    { id: "l", pb: "l", th: "ล", cls: "low", batch: "c", ipa: "l", alt: "" },
    { id: "w", pb: "w", th: "ว", cls: "low", batch: "c", ipa: "w", alt: "" }
  ];

  const VOWELS = [
    { id: "a", short: "a", long: "aa", shortThai: "กะ", shortRo: "gà", shortZh: "与；和", longThai: "กา", longRo: "gaa", longZh: "乌鸦", ipa: "a / aː" },
    { id: "i", short: "i", long: "ii", shortThai: "ปิด", shortRo: "bpìt", shortZh: "关", longThai: "ปี", longRo: "bpii", longZh: "年", ipa: "i / iː" },
    { id: "u", short: "u", long: "uu", shortThai: "คุณ", shortRo: "khun", shortZh: "您", longThai: "ปู", longRo: "bpuu", longZh: "螃蟹", ipa: "u / uː" },
    { id: "ue", short: "ʉ", long: "ʉʉ", shortThai: "ถึง", shortRo: "thʉ̌ng", shortZh: "到", longThai: "มือ", longRo: "mʉʉ", longZh: "手", ipa: "ɯ / ɯː" },
    { id: "e", short: "e", long: "ee", shortThai: "เจ็ด", shortRo: "jèt", shortZh: "七", longThai: "เลข", longRo: "lêek", longZh: "数字", ipa: "e / eː" },
    { id: "ae", short: "ɛ", long: "ɛɛ", shortThai: "แกะ", shortRo: "gɛ̀", shortZh: "羊", longThai: "แม่", longRo: "mɛ̂ɛ", longZh: "妈妈", ipa: "ɛ / ɛː" },
    { id: "o", short: "o", long: "oo", shortThai: "โต๊ะ", shortRo: "dtó", shortZh: "桌子", longThai: "โต", longRo: "dtoo", longZh: "长大", ipa: "o / oː" },
    { id: "oh", short: "ɔ", long: "ɔɔ", shortThai: "เกาะ", shortRo: "gɔ̀", shortZh: "岛", longThai: "พ่อ", longRo: "phɔ̂ɔ", longZh: "爸爸", ipa: "ɔ / ɔː" },
    { id: "er", short: "ə", long: "əə", shortThai: "เลอะ", shortRo: "lə́", shortZh: "弄脏", longThai: "เธอ", longRo: "thəə", longZh: "你（口语）", ipa: "ə / əː" }
  ];

  const LONG_VOWELS = [
    { id: "aa", label: "aa" },
    { id: "ii", label: "ii" },
    { id: "uu", label: "uu" },
    { id: "ʉʉ", label: "ʉʉ" },
    { id: "ee", label: "ee" },
    { id: "ɛɛ", label: "ɛɛ" },
    { id: "oo", label: "oo" },
    { id: "ɔɔ", label: "ɔɔ" },
    { id: "əə", label: "əə" }
  ];

  const ONSETS = ["kh", "ch", "th", "ph", "ng", "bp", "dt", "g", "j", "d", "b", "f", "h", "s", "m", "n", "l", "r", "w", "y"];
  const VOWEL_KEYS = ["ʉʉ", "ɛɛ", "ɔɔ", "əə", "aa", "ii", "uu", "ee", "oo", "ʉa", "ia", "ua", "ai", "ao", "am", "ʉ", "ɛ", "ɔ", "ə", "a", "i", "u", "e", "o"];

  function toneOf(syl) {
    const s = String(syl || "");
    if (/[àèìòù]|\u0300/.test(s)) return "low";
    if (/[âêîôû]|\u0302/.test(s)) return "fall";
    if (/[áéíóú]|\u0301/.test(s)) return "high";
    if (/[ǎěǐǒǔ]|\u030c/.test(s)) return "rise";
    return "mid";
  }

  function stripTone(syl) {
    return String(syl || "").normalize("NFD").replace(/[\u0300\u0301\u0302\u030c]/g, "").normalize("NFC");
  }

  function parseSyllable(syl) {
    const tone = toneOf(syl);
    const plain = stripTone(syl);
    let onset = "";
    let rest = plain;
    for (let i = 0; i < ONSETS.length; i += 1) {
      if (plain.indexOf(ONSETS[i]) === 0) {
        onset = ONSETS[i];
        rest = plain.slice(onset.length);
        break;
      }
    }
    let cluster = "";
    if (/^[rl]/.test(rest) && /[aeiouɛɔəʉ]/.test(rest.slice(1))) {
      cluster = rest.charAt(0);
      rest = rest.slice(1);
    }
    let vowel = "";
    let final = rest;
    for (let i = 0; i < VOWEL_KEYS.length; i += 1) {
      if (rest.indexOf(VOWEL_KEYS[i]) === 0) {
        vowel = VOWEL_KEYS[i];
        final = rest.slice(vowel.length);
        break;
      }
    }
    return { raw: String(syl || ""), tone: tone, onset: onset, cluster: cluster, vowel: vowel, final: final };
  }

  function onsetOf(syl) {
    const part = parseSyllable(syl);
    if (!part.onset && part.vowel) return "q";
    return part.onset;
  }

  function consById(id) {
    for (let i = 0; i < CONS.length; i += 1) if (CONS[i].id === id) return CONS[i];
    return null;
  }

  function a1Words() {
    const list = (window.LEXICON && LEXICON.words) || [];
    return list.filter(function (word) { return word.level === "A1" && word.thai && word.roman; });
  }

  function exampleFor(onsetId) {
    const words = a1Words();
    for (let i = 0; i < words.length; i += 1) {
      const first = String(words[i].roman).split(/[\s-]+/)[0];
      if (onsetOf(first) === onsetId) return words[i];
    }
    return null;
  }

  function applyTone(vowel, tone) {
    const marks = { low: "\u0300", fall: "\u0302", high: "\u0301", rise: "\u030c" };
    const base = String(vowel || "").normalize("NFD").replace(/[\u0300\u0301\u0302\u030c]/g, "");
    const mark = marks[tone] || "";
    if (!mark) return base.normalize("NFC");
    const found = base.match(/[aeiouɛɔəʉ]/);
    if (!found) return base.normalize("NFC");
    const i = found.index;
    return (base.slice(0, i + 1) + mark + base.slice(i + 1)).normalize("NFC");
  }

  function toneMarkChar(cls, tone) {
    if (cls === "mid") return { mid: "", low: "่", fall: "้", high: "๊", rise: "๋" }[tone];
    if (cls === "high") {
      if (tone === "rise") return "";
      if (tone === "low") return "่";
      if (tone === "fall") return "้";
      return null;
    }
    if (tone === "mid") return "";
    if (tone === "fall") return "่";
    if (tone === "high") return "้";
    return null;
  }

  function buildThai(cons, vowel, tone) {
    if (!cons || LONG_VOWELS.every(function (item) { return item.id !== vowel; })) return { ok: false, reason: "拼读器使用九个长元音。" };
    const mark = toneMarkChar(cons.cls, tone);
    if (mark == null) return { ok: false, reason: "这个声母在长元音上写不出「" + TONE_NAME[tone] + "」。请换一个声调。" };
    const c = cons.th + mark;
    let thai = "";
    if (vowel === "aa") thai = c + "า";
    else if (vowel === "ii") thai = c + "ี";
    else if (vowel === "uu") thai = c + "ู";
    else if (vowel === "ʉʉ") thai = c + "ือ";
    else if (vowel === "ee") thai = "เ" + c;
    else if (vowel === "ɛɛ") thai = "แ" + c;
    else if (vowel === "oo") thai = "โ" + c;
    else if (vowel === "ɔɔ") thai = c + "อ";
    else if (vowel === "əə") thai = "เ" + c + "อ";
    return { ok: !!thai, thai: thai, roman: (cons.pb || "") + applyTone(vowel, tone) };
  }

  function shuffle(list) {
    const next = list.slice();
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
    }
    return next;
  }

  function playButtons(thai) {
    const q = encodeURIComponent(thai || "");
    return '<button type="button" class="btn btn-ghost say-play" data-act="speak" data-thai="' + q + '">▶ 听</button>' +
      '<button type="button" class="btn btn-ghost say-play" data-act="speak" data-slow="1" data-thai="' + q + '">▶ 慢速</button>';
  }

  function ipaFold(text) {
    return '<details class="ipa-fold"><summary>可选：国际音标</summary><p>此栏只供对照。认读本站词卡时只使用 Paiboon+。</p><p>' + esc(text) + "</p></details>";
  }

  function passedMap(bag) {
    return (bag && bag.passed) || {};
  }

  function openLesson(id, bag) {
    const p = passedMap(bag);
    if (id === "l1" || id === "letters" || id === "review" || id === "point" || id === "report") return true;
    if (id === "l2" || id === "l2a") return !!p.l1;
    if (id === "l2b") return !!p.l2a;
    if (id === "l2c") return !!p.l2b;
    if (id === "l3") return !!p.l2;
    if (id === "l4") return !!p.l3;
    if (id === "l5") return !!p.l4;
    return false;
  }

  function lessonMeta() {
    return [
      ["l1", "第一课", "5 个声调"],
      ["l2", "第二课", "21 个声母"],
      ["l3", "第三课", "长短元音"],
      ["l4", "第四课", "音节拼读"],
      ["l5", "第五课", "综合自测"]
    ];
  }

  function home(ui, bag) {
    const steps = ["l1", "l2", "l3", "l4", "l5"];
    const doneCount = steps.filter(function (id) { return bag.passed && bag.passed[id]; }).length;
    const lock = '<svg class="lock-icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.2" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
    const rows = lessonMeta().map(function (item) {
      const on = openLesson(item[0], bag);
      const title = esc(item[1] + " · " + item[2]);
      if (!on) return '<article class="ph-lesson is-locked"><p class="ph-lesson-name">' + lock + title + "</p></article>";
      return '<article class="ph-lesson"><p class="ph-lesson-name">' + title + '</p><button type="button" class="btn btn-primary" data-act="phonics-open" data-id="' + item[0] + '">开始学习</button></article>';
    }).join("");
    const report = bag.report ? '<button type="button" class="btn" data-act="phonics-open" data-id="report">查看最近一次自测</button>' : "";
    return '<div class="page"><div class="ph-head"><h1>音标入门</h1><p class="ph-progress">已完成：' + doneCount + " / 5</p></div>" +
      '<p class="muted ph-lead">按第一课到第五课顺序解锁学习。</p>' +
      '<p class="muted">符号与词卡上的 Paiboon+ 相同：无标记为中平，à 为低调，â 为降调，á 为高调，ǎ 为升调。</p>' +
      '<div class="ph-lessons">' + rows + "</div>" +
      '<div class="ph-actions"><button type="button" class="btn" data-act="phonics-open" data-id="review">复习音标错题</button>' + report + "</div>" +
      '<section class="card ph-letters"><h2>泰文字母（可选）</h2><p class="muted">书写学习不属于主线五课；阅读背词卡片请以 Paiboon+ 注音为准。</p><button type="button" class="btn" data-act="phonics-open" data-id="letters">打开字母页</button></section></div>';
  }

  function tonePage(ui, bag) {
    const cards = TONES.map(function (tone) {
      return '<article class="card ph-card"><p class="pos">' + esc(TONE_NAME[tone.id]) + '</p><p class="roman">' + esc(TONE_MARK[tone.id]) + '</p><p class="th" lang="th">' + esc(tone.thai) + " " + esc(tone.roman) + "</p><p>" + esc(tone.zh) + "</p><p class=\"hint\">" + esc(tone.memo) + "</p>" +
        '<div class="row" style="margin-top:10px">' + playButtons(tone.thai) + "</div>" + ipaFold(TONE_IPA[tone.id]) + "</article>";
    }).join("");
    const drill = ui.quiz && ui.quiz.kind === "l1" ? drillHtml(ui.quiz) : '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="l1">听音选声调</button>';
    return '<div class="page"><p class="muted" style="margin-top:12px">第一课</p><h1>5 个声调</h1><p class="hint">ม้า máa 是高平，หมา mǎa 是低升。符号标在元音的第一个字母上。</p><div class="grid" style="margin-top:14px">' + cards + "</div><div style=\"margin-top:16px\">" + drill + "</div></div>";
  }

  function consPage(ui, bag) {
    const batch = ui.batch || "a";
    const names = { a: "中辅音", b: "高辅音", c: "低辅音" };
    const tabs = ["a", "b", "c"].map(function (id) {
      const opened = openLesson("l2" + id, bag);
      if (!opened) return '<button type="button" class="chip" data-act="phonics-locked">' + names[id] + "</button>";
      return '<button type="button" class="chip' + (batch === id ? " is-on" : "") + '" data-act="phonics-batch" data-id="' + id + '">' + names[id] + "</button>";
    }).join("");
    const cards = CONS.filter(function (item) { return item.batch === batch; }).map(function (item) {
      const word = exampleFor(item.id);
      const ex = word ? '<p class="hint">A1 例词：<span lang="th">' + esc(word.thai) + "</span> " + esc(word.roman) + " " + esc(word.zh) + "</p>" : '<p class="hint">本批先记这个写法。</p>';
      const letter = ui.showLetter ? '<p class="thai-xl" lang="th" style="font-size:56px">' + esc(item.th) + "</p>" : "";
      const label = item.label || item.pb || "零声母";
      return '<article class="card ph-card"><p class="pos">' + esc(names[item.batch]) + '</p><p class="roman">' + esc(label) + "</p>" + letter +
        '<button type="button" class="btn" data-act="phonics-toggle-letter">' + (ui.showLetter ? "收起泰文字母" : "显示泰文字母") + "</button>" +
        (item.alt ? '<p class="hint">' + esc(item.alt) + "</p>" : "") + ex +
        (word ? '<div class="row" style="margin-top:10px">' + playButtons(word.thai) + "</div>" : "") +
        ipaFold(item.ipa) + "</article>";
    }).join("");
    const drillId = "l2" + batch;
    const drill = ui.quiz && ui.quiz.kind === drillId ? drillHtml(ui.quiz) : '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="' + drillId + '">听音匹配声母</button>';
    return '<div class="page"><p class="muted" style="margin-top:12px">第二课</p><h1>21 个声母</h1><p class="hint">先完成中辅音，再打开高辅音，最后打开低辅音。主线看 Paiboon 写法。</p><div class="row" style="margin-top:12px">' + tabs + '</div><div class="grid" style="margin-top:14px">' + cards + "</div><div style=\"margin-top:16px\">" + drill + "</div></div>";
  }

  function vowelPage(ui) {
    const cards = VOWELS.map(function (item) {
      return '<article class="card ph-card"><p class="pos">短 / 长</p><p class="roman">' + esc(item.short) + " · " + esc(item.long) + '</p><div class="row"><div><p class="th" lang="th">' + esc(item.shortThai) + "</p><p class=\"ipa\">" + esc(item.shortRo) + "</p><p>" + esc(item.shortZh) + '</p><div class="row">' + playButtons(item.shortThai) + '</div></div><div><p class="th" lang="th">' + esc(item.longThai) + "</p><p class=\"ipa\">" + esc(item.longRo) + "</p><p>" + esc(item.longZh) + '</p><div class="row">' + playButtons(item.longThai) + "</div></div></div><p class=\"hint\">长音在 Paiboon 里把元音字母写两遍。</p>" + ipaFold(item.ipa) + "</article>";
    }).join("");
    const drill = ui.quiz && ui.quiz.kind === "l3" ? drillHtml(ui.quiz) : '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="l3">听音分辨长短</button>';
    return '<div class="page"><p class="muted" style="margin-top:12px">第三课</p><h1>长短元音</h1><p class="hint">长短可以区分词义。先听一对，再做练习。</p><div class="grid" style="margin-top:14px">' + cards + "</div><div style=\"margin-top:16px\">" + drill + "</div></div>";
  }

  function builder(ui) {
    const build = ui.build || { onset: "g", vowel: "aa", tone: "mid" };
    const cons = consById(build.onset) || CONS[0];
    const made = buildThai(cons, build.vowel, build.tone);
    const onsetChips = CONS.map(function (item) {
      const label = item.pb || "อ";
      return '<button type="button" class="chip' + (build.onset === item.id ? " is-on" : "") + '" data-act="ph-build" data-key="onset" data-val="' + item.id + '">' + esc(label) + "</button>";
    }).join("");
    const vowelChips = LONG_VOWELS.map(function (item) {
      return '<button type="button" class="chip' + (build.vowel === item.id ? " is-on" : "") + '" data-act="ph-build" data-key="vowel" data-val="' + item.id + '">' + esc(item.label) + "</button>";
    }).join("");
    const toneChips = ["mid", "low", "fall", "high", "rise"].map(function (id) {
      return '<button type="button" class="chip' + (build.tone === id ? " is-on" : "") + '" data-act="ph-build" data-key="tone" data-val="' + id + '">' + esc(TONE_NAME[id]) + "</button>";
    }).join("");
    const result = made.ok
      ? '<p class="thai-xl" lang="th" style="font-size:64px">' + esc(made.thai) + '</p><p class="roman">' + esc(made.roman) + '</p><div class="row">' + playButtons(made.thai) + "</div>"
      : '<p class="roman">' + esc((cons.pb || "") + applyTone(build.vowel, build.tone)) + '</p><p class="hint">' + esc(made.reason) + "</p>";
    return '<section class="card"><h2>拼一个音节</h2><p class="hint">选择声母、长元音和声调。写得出来的音节可以听。</p><p class="muted" style="margin-top:10px">声母</p><div class="row" style="flex-wrap:wrap">' + onsetChips + '</div><p class="muted">元音</p><div class="row" style="flex-wrap:wrap">' + vowelChips + '</div><p class="muted">声调</p><div class="row" style="flex-wrap:wrap">' + toneChips + "</div><div style=\"margin-top:12px\">" + result + "</div></section>";
  }

  function deckCard(ui) {
    const deck = ui.deck || [];
    if (!deck.length) return "";
    if (ui.deckDone) return '<section class="card"><h2>本课音节已读完</h2><p class="muted">第四课可以记为完成。</p><button type="button" class="btn btn-primary" data-act="phonics-pass" data-id="l4">完成本课</button></section>';
    const card = deck[ui.index] || deck[0];
    const faceFront = '<div class="face face-front"><p class="roman" style="font-size:40px">' + esc(card.syl) + '</p><span class="badge">Paiboon+</span><p class="hint">点击卡片听发音、看释义</p></div>';
    const faceBack = '<div class="face face-back"><p class="zh-lg">' + esc(card.zh) + '</p><p class="th" lang="th">' + esc(card.thai) + '</p><p class="ipa">' + esc(card.roman) + '</p><p class="hint">整词发音</p><div class="row">' + playButtons(card.thai) + '</div><p class="hint flip-hint">点击卡片收回</p></div>';
    return '<p class="day-progress">音节 ' + (ui.index + 1) + " / " + deck.length + '</p><div class="flip' + (ui.flipped ? " is-back" : "") + '" data-act="phonics-flip"><div class="flip-inner">' + faceFront + faceBack + '</div></div><div class="actions"><button type="button" class="btn btn-primary" data-act="phonics-next">下一张</button></div>';
  }

  function readPage(ui) {
    return '<div class="page"><p class="muted" style="margin-top:12px">第四课</p><h1>音节拼读</h1>' + builder(ui) + '<div class="stage" style="padding-top:18px">' + deckCard(ui) + "</div></div>";
  }

  function pointPage(ui, bag) {
    const point = ui.point || parseSyllable("");
    const cons = consById(point.onset ? point.onset : (point.vowel ? "q" : ""));
    const vowelPair = VOWELS.filter(function (item) { return item.short === point.vowel || item.long === point.vowel; })[0];
    const length = vowelPair && vowelPair.long === point.vowel ? "长音" : vowelPair ? "短音" : "复合或带尾音的元音";
    const play = ui.pointThai ? '<div class="row" style="margin-top:10px">' + playButtons(ui.pointThai) + "</div>" : "";
    const vowelLink = openLesson("l3", bag) ? '<button type="button" class="btn" data-act="phonics-open" data-id="l3">打开元音课</button>' : '<p class="hint">完成声母课后可进入元音课。</p>';
    return '<div class="page"><p class="muted" style="margin-top:12px">这个音节</p><h1 class="roman">' + esc(point.raw) + "</h1>" +
      '<section class="card"><p class="pos">声调</p><h2>' + esc(TONE_NAME[point.tone] || "") + " · " + esc(TONE_MARK[point.tone] || "") + '</h2><button type="button" class="btn" data-act="phonics-open" data-id="l1">打开声调课</button></section>' +
      '<section class="card" style="margin-top:12px"><p class="pos">声母</p><h2>' + esc(cons ? (cons.pb || "零声母") : (point.onset || "—")) + "</h2>" + (cons ? '<p class="hint" lang="th">' + esc(cons.th) + "</p>" : "") + (cons && cons.alt ? '<p class="hint">' + esc(cons.alt) + "</p>" : "") + "</section>" +
      '<section class="card" style="margin-top:12px"><p class="pos">元音</p><h2>' + esc(point.vowel || "—") + '</h2><p class="hint">' + esc(length) + "。长音把元音字母写两遍。</p>" + vowelLink + "</section>" + play + ipaFold(TONE_IPA[point.tone] || "") + "</div>";
  }

  function lettersPage() {
    const cards = CONS.map(function (item) {
      const word = exampleFor(item.id);
      return '<article class="card"><p class="thai-xl" lang="th" style="font-size:48px">' + esc(item.th) + '</p><p class="roman">' + esc(item.pb || "零声母") + '</p><p class="hint">' + esc(item.cls === "mid" ? "中辅音" : item.cls === "high" ? "高辅音" : "低辅音") + "</p>" +
        (word ? '<p class="hint"><span lang="th">' + esc(word.thai) + "</span> " + esc(word.zh) + "</p>" + playButtons(word.thai) : "") + "</article>";
    }).join("");
    return '<div class="page"><h1>泰文字母</h1><p class="hint">本页不计入五课进度，也不发放成就。词卡认读仍看 Paiboon+。</p><div class="grid" style="margin-top:14px">' + cards + "</div></div>";
  }

  function drillHtml(quiz) {
    if (quiz.done) {
      const rate = quiz.total ? Math.round(100 * quiz.correct / quiz.total) : 0;
      return '<section class="card"><h2>答对 ' + quiz.correct + " / " + quiz.total + "</h2><p class=\"hint\">正确率 " + rate + "%。" + (quiz.passed ? "本课已完成。" : "达到 80% 后本课完成，可再做一次。") + "</p>" +
        (quiz.wrongs.length ? "<p>记入复习的题：</p><ul>" + quiz.wrongs.map(function (item) { return "<li>" + esc(item.answerLabel) + "</li>"; }).join("") + "</ul>" : "<p>没有错题。</p>") +
        '<button type="button" class="btn" data-act="phonics-drill" data-id="' + esc(quiz.kind) + '">再做一次</button></section>';
    }
    const item = quiz.items[quiz.index];
    const options = item.options.map(function (opt) {
      let cls = "quiz-option";
      if (quiz.picked) {
        if (opt.id === item.answer) cls += " is-on";
        else if (opt.id === quiz.picked) cls += " is-bad";
      }
      const act = quiz.picked ? "" : ' data-act="ph-answer" data-id="' + esc(opt.id) + '"';
      return '<button type="button" class="' + cls + '"' + act + ">" + esc(opt.label) + "</button>";
    }).join("");
    return '<section class="card"><p class="muted">' + (quiz.index + 1) + " / " + quiz.items.length + "</p><h2>" + esc(item.prompt) + '</h2><div class="row" style="margin:10px 0">' + playButtons(item.thai) + "</div>" + options +
      (quiz.picked ? '<p class="hint">答案：' + esc(item.answerLabel) + '</p><button type="button" class="btn btn-primary" data-act="ph-next">下一题</button>' : "") + "</section>";
  }

  function makeDrill(kind) {
    let items = [];
    if (kind === "l1") {
      items = shuffle(TONES).map(function (tone) {
        return {
          thai: tone.thai,
          prompt: "听一听，选出声调。",
          answer: tone.id,
          answerLabel: TONE_NAME[tone.id] + " " + TONE_MARK[tone.id],
          options: ["mid", "low", "fall", "high", "rise"].map(function (id) { return { id: id, label: TONE_NAME[id] + " " + TONE_MARK[id] }; })
        };
      });
    } else if (kind === "l2a" || kind === "l2b" || kind === "l2c") {
      const batch = kind.slice(2);
      const pool = CONS.filter(function (item) { return item.batch === batch; });
      items = shuffle(pool).slice(0, 5).map(function (item) {
        const word = exampleFor(item.id);
        const others = shuffle(pool.filter(function (one) { return one.id !== item.id; })).slice(0, 3);
        const options = shuffle([item].concat(others)).map(function (one) {
          return { id: one.id, label: one.pb || "零声母" };
        });
        return {
          thai: word ? word.thai : item.th,
          prompt: "听一听，选出声母。",
          answer: item.id,
          answerLabel: (item.pb || "零声母") + " " + item.th,
          options: options
        };
      });
    } else if (kind === "l3") {
      items = shuffle(VOWELS).slice(0, 6).map(function (item) {
        const long = Math.random() < 0.5;
        return {
          thai: long ? item.longThai : item.shortThai,
          prompt: "听一听，分辨长短。",
          answer: long ? "long" : "short",
          answerLabel: long ? "长音 " + item.long : "短音 " + item.short,
          options: [{ id: "short", label: "短元音 " + item.short }, { id: "long", label: "长元音 " + item.long }]
        };
      });
    }
    return { kind: kind, items: items, index: 0, correct: 0, total: items.length, wrongs: [], picked: "", done: false, passed: false };
  }

  function makeExam() {
    const words = shuffle(a1Words()).slice(0, 12);
    const romanItems = words.slice(0, 3).map(function (word) {
      const options = shuffle([word].concat(shuffle(a1Words().filter(function (one) { return one.id !== word.id; })).slice(0, 3)));
      return {
        type: "roman",
        thai: word.thai,
        prompt: "听一听，选出 Paiboon。",
        answer: word.roman,
        answerLabel: word.roman + " " + word.zh,
        options: options.map(function (one) { return { id: one.roman, label: one.roman }; })
      };
    });
    const toneItems = shuffle(TONES).slice(0, 3).map(function (tone) {
      return {
        type: "tone",
        thai: tone.thai,
        prompt: "听一听，判断声调。",
        answer: tone.id,
        answerLabel: TONE_NAME[tone.id],
        options: ["mid", "low", "fall", "high", "rise"].map(function (id) { return { id: id, label: TONE_NAME[id] }; })
      };
    });
    const lengthItems = shuffle(VOWELS).slice(0, 3).map(function (item) {
      const long = Math.random() < 0.5;
      return {
        type: "length",
        thai: long ? item.longThai : item.shortThai,
        prompt: "听一听，辨析长短元音。",
        answer: long ? "long" : "short",
        answerLabel: long ? "长音 " + item.longRo : "短音 " + item.shortRo,
        options: [{ id: "short", label: "短 " + item.shortRo }, { id: "long", label: "长 " + item.longRo }]
      };
    });
    const items = shuffle(romanItems.concat(toneItems, lengthItems));
    return { kind: "l5", items: items, index: 0, correct: 0, total: items.length, wrongs: [], picked: "", done: false, passed: false };
  }

  function reportHtml(report) {
    if (!report) return '<div class="page"><h1>还没有自测记录</h1></div>';
    const rows = (report.wrongs || []).map(function (item) {
      return "<li>" + esc(item.prompt) + " · 答案 " + esc(item.answerLabel) + "</li>";
    }).join("");
    return '<div class="page"><h1>拼读自测报告</h1><p class="muted">' + esc(report.at || "") + "</p><section class=\"card\"><h2>答对 " + report.correct + " / " + report.total + "</h2><p>听音选 Paiboon " + report.byType.roman.ok + " / " + report.byType.roman.n + "</p><p>声调判断 " + report.byType.tone.ok + " / " + report.byType.tone.n + "</p><p>长短元音 " + report.byType.length.ok + " / " + report.byType.length.n + "</p>" +
      (rows ? "<p>错题已进入音标复习。</p><ul>" + rows + "</ul>" : "<p>这次没有错题。</p>") + "</section></div>";
  }

  function examPage(ui) {
    const body = ui.quiz && ui.quiz.kind === "l5" ? drillHtml(ui.quiz) : '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="l5">开始综合自测</button>';
    return '<div class="page"><p class="muted" style="margin-top:12px">第五课</p><h1>综合拼读自测</h1><p class="hint">题型包括听音选 Paiboon、判断声调和分辨长短元音。错题进入单独的复习卡。</p><div style="margin-top:14px">' + body + "</div></div>";
  }

  function reviewPage(ui, bag) {
    const due = window.Store ? Store.phonicsDue() : [];
    if (!due.length) return '<div class="page"><h1>音标复习</h1><p class="muted">今天没有到期的错题。</p></div>';
    const current = due[0];
    const payload = current.card.payload || {};
    const front = '<div class="face face-front"><p class="hint">' + esc(payload.prompt || "听一听，回忆答案。") + '</p>' +
      (payload.thai ? '<div class="row">' + playButtons(payload.thai) + "</div>" : "") + '<span class="badge">Paiboon+</span><p class="hint">点击卡片看答案</p></div>';
    const revealed = '<div class="face face-back"><p class="zh-lg">' + esc(payload.answerLabel || "") + "</p>" +
      (payload.thai ? '<div class="row">' + playButtons(payload.thai) + '</div>' : "") + '<p class="hint flip-hint">点击卡片收回</p></div>';
    return '<div class="page"><h1>音标复习</h1><p class="muted">到期 ' + due.length + ' 张。这组复习不计入词本掌握。</p><div class="stage"><div class="flip' + (ui.flipped ? " is-back" : "") + '" data-act="phonics-flip"><div class="flip-inner">' +
      front + revealed + '</div></div><div class="actions"><button type="button" class="btn btn-primary" data-act="ph-grade" data-ok="1" data-id="' + esc(current.id) + '">认识</button><button type="button" class="btn btn-warn" data-act="ph-grade" data-ok="0" data-id="' + esc(current.id) + '">不认识</button></div></div></div>';
  }

  function render(ui, bag) {
    const lesson = ui.lesson || "";
    if (!lesson) return home(ui, bag);
    if (lesson === "l1") return tonePage(ui, bag);
    if (lesson === "l2") return consPage(ui, bag);
    if (lesson === "l3") return vowelPage(ui);
    if (lesson === "l4") return readPage(ui);
    if (lesson === "l5") return examPage(ui);
    if (lesson === "point") return pointPage(ui, bag);
    if (lesson === "letters") return lettersPage();
    if (lesson === "review") return reviewPage(ui, bag);
    if (lesson === "report") return reportHtml(bag.report);
    return home(ui, bag);
  }

  function a1Deck() {
    return a1Words().slice(0, 8).map(function (word) {
      const syl = String(word.roman).split(/[\s-]+/)[0];
      return { syl: syl, thai: word.thai, roman: word.roman, zh: word.zh };
    });
  }

  window.PHONICS = {
    render: render,
    openLesson: openLesson,
    parseSyllable: parseSyllable,
    makeDrill: makeDrill,
    makeExam: makeExam,
    a1Deck: a1Deck,
    toneOf: toneOf,
    buildThai: buildThai,
    TONE_NAME: TONE_NAME
  };
})();
