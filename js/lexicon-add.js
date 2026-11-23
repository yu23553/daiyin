(function () {
  if (!window.LEXICON) return;
  var seen = {};
  LEXICON.words.forEach(function (word) {
    seen[word.thai] = 1;
    seen["id:" + word.id] = 1;
  });

  function put(level, rows) {
    rows.forEach(function (row) {
      var id = row[0];
      var scene = row[1];
      var pos = row[2];
      var thai = row[3];
      var roman = row[4];
      var zh = row[5];
      if (!id || !thai || seen[thai] || seen["id:" + id]) return;
      seen[thai] = 1;
      seen["id:" + id] = 1;
      var exTh;
      var exRo;
      var exZh;
      var kind = "s";
      var tip = "";
      if (row.length >= 9) {
        exTh = row[6];
        exRo = row[7];
        exZh = row[8];
        kind = row[9] || "s";
        tip = row[10] || "";
      } else {
        kind = row[6] || "s";
        tip = row[7] || "";
        if (pos === "动词") {
          exTh = "ตอนนี้" + thai + "{p}";
          exRo = "dtɔɔn-níi " + roman + " {pr}";
          exZh = "现在" + zh + "。";
        } else if (pos === "说法" || pos === "招呼" || pos === "副词" || pos === "连词") {
          exTh = thai + "{p}";
          exRo = roman + " {pr}";
          exZh = zh + "。";
        } else if (pos === "形容词") {
          exTh = "นี่" + thai + "{p}";
          exRo = "nîi " + roman + " {pr}";
          exZh = "这个" + zh + "。";
        } else {
          exTh = "นี่" + thai + "{p}";
          exRo = "nîi " + roman + " {pr}";
          exZh = "这是" + zh + "。";
        }
      }
      LEXICON.words.push({
        id: id,
        level: level,
        scene: scene,
        pos: pos,
        thai: thai,
        roman: roman,
        zh: zh,
        exThai: exTh,
        exRoman: exRo,
        exZh: exZh,
        kind: kind,
        tip: tip
      });
    });
  }

  window.LEXICON_PUT = put;
})();
