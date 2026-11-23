(function () {
  // 词库按等级拆包后，补全课也按等级惰性构建：某级词库载入后，才把该级尚未成课的词补成课。
  var built = {};

  function usedIds() {
    var byId = {};
    (window.LEXICON ? LEXICON.words : []).forEach(function (word) { byId[word.id] = word; });
    var used = {};
    COURSE.lessons.forEach(function (lesson) {
      (lesson.words || []).forEach(function (id) {
        var word = byId[id];
        if (word && word.level === lesson.level) used[id] = true;
      });
    });
    return used;
  }

  window.COURSE_COVER = {
    build: function (level) {
      if (!window.COURSE || !window.LEXICON || built[level]) return;
      built[level] = true;
      var used = usedIds();
      var groups = {};
      var order = [];
      LEXICON.words.forEach(function (word) {
        if (word.level !== level || used[word.id]) return;
        if (!groups[word.scene]) {
          groups[word.scene] = [];
          order.push(word.scene);
        }
        groups[word.scene].push(word);
      });
      var added = [];
      var n = 0;
      order.forEach(function (scene) {
        var list = groups[scene];
        var size = 10;
        var part = 0;
        var parts = Math.ceil(list.length / size);
        for (var i = 0; i < list.length; i += size) {
          part += 1;
          n += 1;
          var slice = list.slice(i, i + size);
          var lines = slice.map(function (word) {
            return { th: word.exThai, ro: word.exRoman, zh: word.exZh, kind: word.kind === "q" ? "q" : "s" };
          });
          var talk = slice.slice(0, 6).map(function (word, index) {
            return { g: index % 2 ? "f" : "m", th: word.exThai, ro: word.exRoman, zh: word.exZh, kind: word.kind === "q" ? "q" : "s" };
          });
          added.push({
            id: "ls-" + level.toLowerCase() + "-cov-" + n,
            level: level,
            title: scene + " · 第 " + part + " 课",
            aim: parts > 1
              ? "本课学习「" + scene + "」的第 " + part + " 组词。宜先认读，再跟读例句。本级词都会在课程里出现。"
              : "本课学习「" + scene + "」里尚未单独成课的词。宜先认读，再跟读例句。",
            words: slice.map(function (word) { return word.id; }),
            talk: talk,
            lines: lines
          });
        }
      });
      COURSE.lessons = COURSE.lessons.concat(added);
    }
  };
})();
