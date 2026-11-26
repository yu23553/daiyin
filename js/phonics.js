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

  // 第一单元 5 课按序解锁：每课学习词 + 约 30 题（本课为主、掺少量他课）。五课都 ≥80% 后记 l1 完成。
  const TONE_SETS = [
    [
      { tone: "mid", thai: "มา", roman: "maa", zh: "来" },
      { tone: "mid", thai: "ดี", roman: "dii", zh: "好" },
      { tone: "mid", thai: "ไป", roman: "bpai", zh: "去" },
      { tone: "mid", thai: "กิน", roman: "gin", zh: "吃" },
      { tone: "mid", thai: "ดู", roman: "duu", zh: "看" },
      { tone: "mid", thai: "กา", roman: "gaa", zh: "乌鸦" },
      { tone: "low", thai: "ป่า", roman: "bpàa", zh: "森林" },
      { tone: "low", thai: "ไก่", roman: "gài", zh: "鸡" },
      { tone: "low", thai: "ไข่", roman: "khài", zh: "蛋" },
      { tone: "low", thai: "ใส่", roman: "sài", zh: "放；穿" },
      { tone: "low", thai: "เปิด", roman: "bpèrt", zh: "开" },
      { tone: "low", thai: "ปิด", roman: "bpìt", zh: "关" },
      { tone: "fall", thai: "บ้าน", roman: "bâan", zh: "家" },
      { tone: "fall", thai: "ห้า", roman: "hâa", zh: "五" },
      { tone: "fall", thai: "ไม่", roman: "mâi", zh: "不" },
      { tone: "fall", thai: "ได้", roman: "dâai", zh: "能；得到" },
      { tone: "fall", thai: "ข้าว", roman: "khâao", zh: "米饭" },
      { tone: "fall", thai: "แม่", roman: "mɛ̂ɛ", zh: "妈妈" },
      { tone: "high", thai: "ม้า", roman: "máa", zh: "马" },
      { tone: "high", thai: "น้า", roman: "náa", zh: "叔／姨" },
      { tone: "high", thai: "ค้า", roman: "kháa", zh: "买卖" },
      { tone: "high", thai: "ป้า", roman: "bpáa", zh: "阿姨" },
      { tone: "high", thai: "เช้า", roman: "cháao", zh: "早上" },
      { tone: "high", thai: "ท้อง", roman: "thóng", zh: "肚子" },
      { tone: "rise", thai: "หมา", roman: "mǎa", zh: "狗" },
      { tone: "rise", thai: "ขาว", roman: "khǎao", zh: "白" },
      { tone: "rise", thai: "หนาว", roman: "nǎao", zh: "冷" },
      { tone: "rise", thai: "หา", roman: "hǎa", zh: "找" },
      { tone: "rise", thai: "ขอ", roman: "khǒɔ", zh: "请给" },
      { tone: "rise", thai: "ผี", roman: "phǐi", zh: "鬼" }
    ],
    [
      { tone: "mid", thai: "นอน", roman: "nɔɔn", zh: "睡" },
      { tone: "mid", thai: "เดิน", roman: "dəən", zh: "走" },
      { tone: "mid", thai: "ฟัง", roman: "fang", zh: "听" },
      { tone: "mid", thai: "พูด", roman: "phûut", zh: "说" },
      { tone: "mid", thai: "อ่าน", roman: "àan", zh: "读" },
      { tone: "mid", thai: "เขียน", roman: "khǐan", zh: "写" },
      { tone: "low", thai: "ปาก", roman: "bpàak", zh: "嘴" },
      { tone: "low", thai: "เจ็บ", roman: "jèp", zh: "疼" },
      { tone: "low", thai: "เด็ก", roman: "dèk", zh: "孩子" },
      { tone: "low", thai: "เป็ด", roman: "bpèt", zh: "鸭子" },
      { tone: "low", thai: "กบ", roman: "gòp", zh: "青蛙" },
      { tone: "low", thai: "จับ", roman: "jàp", zh: "抓" },
      { tone: "fall", thai: "พ่อ", roman: "phɔ̂ɔ", zh: "爸爸" },
      { tone: "fall", thai: "พี่", roman: "phîi", zh: "哥哥／姐姐" },
      { tone: "fall", thai: "เสื้อ", roman: "sûua", zh: "衣服" },
      { tone: "fall", thai: "ใกล้", roman: "glâi", zh: "近" },
      { tone: "fall", thai: "ชื่อ", roman: "chʉ̂ʉ", zh: "名字" },
      { tone: "fall", thai: "ใช่", roman: "châi", zh: "是" },
      { tone: "high", thai: "ฟ้า", roman: "fáa", zh: "天空" },
      { tone: "high", thai: "ช้าง", roman: "cháang", zh: "大象" },
      { tone: "high", thai: "ซ้าย", roman: "sáai", zh: "左" },
      { tone: "high", thai: "ช้า", roman: "cháa", zh: "慢" },
      { tone: "high", thai: "น้ำ", roman: "náam", zh: "水" },
      { tone: "high", thai: "ร้อน", roman: "rón", zh: "热" },
      { tone: "rise", thai: "เขา", roman: "khǎo", zh: "他／山" },
      { tone: "rise", thai: "ฉัน", roman: "chǎn", zh: "我（女）" },
      { tone: "rise", thai: "ผม", roman: "phǒm", zh: "我（男）" },
      { tone: "rise", thai: "หู", roman: "hǔu", zh: "耳朵" },
      { tone: "rise", thai: "สี", roman: "sǐi", zh: "颜色" },
      { tone: "rise", thai: "หัว", roman: "hǔa", zh: "头" }
    ],
    [
      { tone: "mid", thai: "รถ", roman: "rót", zh: "车" },
      { tone: "mid", thai: "เรือ", roman: "rua", zh: "船" },
      { tone: "mid", thai: "บิน", roman: "bin", zh: "飞" },
      { tone: "mid", thai: "จาน", roman: "jaan", zh: "盘子" },
      { tone: "mid", thai: "ชาม", roman: "chaam", zh: "碗" },
      { tone: "mid", thai: "คน", roman: "khon", zh: "人" },
      { tone: "low", thai: "ตัด", roman: "dtàt", zh: "剪；切" },
      { tone: "low", thai: "กฎ", roman: "gòt", zh: "规则" },
      { tone: "low", thai: "สด", roman: "sòt", zh: "新鲜" },
      { tone: "low", thai: "ถูก", roman: "thùuk", zh: "便宜；对" },
      { tone: "low", thai: "กี่", roman: "gìi", zh: "几" },
      { tone: "low", thai: "บาท", roman: "bàat", zh: "铢" },
      { tone: "fall", thai: "มาก", roman: "mâak", zh: "很多" },
      { tone: "fall", thai: "ผ้า", roman: "phâa", zh: "布" },
      { tone: "fall", thai: "ใหม่", roman: "mài", zh: "新" },
      { tone: "fall", thai: "ใหญ่", roman: "yài", zh: "大" },
      { tone: "fall", thai: "ช่วย", roman: "chûai", zh: "帮" },
      { tone: "fall", thai: "ชอบ", roman: "chɔ̂ɔp", zh: "喜欢" },
      { tone: "high", thai: "พริก", roman: "phrík", zh: "辣椒" },
      { tone: "high", thai: "โต๊ะ", roman: "tó", zh: "桌子" },
      { tone: "high", thai: "เท้า", roman: "tháo", zh: "脚" },
      { tone: "high", thai: "นก", roman: "nók", zh: "鸟" },
      { tone: "high", thai: "กุ้ง", roman: "gûng", zh: "虾" },
      { tone: "high", thai: "คิด", roman: "khít", zh: "想" },
      { tone: "rise", thai: "หมอ", roman: "mɔ̌ɔ", zh: "医生" },
      { tone: "rise", thai: "หญิง", roman: "yǐng", zh: "女" },
      { tone: "rise", thai: "ฝน", roman: "fǒn", zh: "雨" },
      { tone: "rise", thai: "สูง", roman: "sǔung", zh: "高" },
      { tone: "rise", thai: "สวย", roman: "sǔai", zh: "漂亮" },
      { tone: "rise", thai: "หิว", roman: "hǐu", zh: "饿" }
    ],
    [
      { tone: "mid", thai: "วัน", roman: "wan", zh: "天；日" },
      { tone: "mid", thai: "เดือน", roman: "dʉan", zh: "月" },
      { tone: "mid", thai: "ปี", roman: "bpii", zh: "年" },
      { tone: "mid", thai: "เย็น", roman: "yen", zh: "傍晚；凉" },
      { tone: "mid", thai: "คืน", roman: "khuuen", zh: "夜晚" },
      { tone: "mid", thai: "ลม", roman: "lom", zh: "风" },
      { tone: "low", thai: "อยาก", roman: "yàak", zh: "想要" },
      { tone: "low", thai: "อ่าน", roman: "àan", zh: "读" },
      { tone: "low", thai: "ออก", roman: "ɔ̀ɔk", zh: "出去" },
      { tone: "low", thai: "อ่อน", roman: "ɔ̀ɔn", zh: "软；弱" },
      { tone: "low", thai: "แดด", roman: "dɛ̀ɛt", zh: "阳光" },
      { tone: "low", thai: "ต่ำ", roman: "dtàm", zh: "低" },
      { tone: "fall", thai: "รู้", roman: "rúu", zh: "知道" },
      { tone: "fall", thai: "พูด", roman: "phûut", zh: "说" },
      { tone: "fall", thai: "ลูก", roman: "lûuk", zh: "孩子；水果" },
      { tone: "fall", thai: "ลูกค้า", roman: "lûuk-kháa", zh: "顾客" },
      { tone: "fall", thai: "กล้วย", roman: "glûai", zh: "香蕉" },
      { tone: "fall", thai: "ส้ม", roman: "sôm", zh: "橙子" },
      { tone: "high", thai: "เล็ก", roman: "lék", zh: "小" },
      { tone: "high", thai: "เพชร", roman: "phét", zh: "钻石" },
      { tone: "high", thai: "เมฆ", roman: "mêek", zh: "云" },
      { tone: "high", thai: "สั้น", roman: "sân", zh: "短" },
      { tone: "high", thai: "รัก", roman: "rák", zh: "爱" },
      { tone: "high", thai: "นม", roman: "nom", zh: "奶" },
      { tone: "rise", thai: "เขียน", roman: "khǐan", zh: "写" },
      { tone: "rise", thai: "ป่วย", roman: "bpuài", zh: "生病" },
      { tone: "rise", thai: "เหนื่อย", roman: "nùeai", zh: "累" },
      { tone: "rise", thai: "ดาว", roman: "daao", zh: "星星" },
      { tone: "rise", thai: "จันทร์", roman: "jan", zh: "月亮" },
      { tone: "rise", thai: "ปลา", roman: "bplaa", zh: "鱼" }
    ],
    [
      { tone: "mid", thai: "จีน", roman: "jiin", zh: "中国" },
      { tone: "mid", thai: "ไทย", roman: "thai", zh: "泰国" },
      { tone: "mid", thai: "ไกล", roman: "glai", zh: "远" },
      { tone: "mid", thai: "ดัง", roman: "dang", zh: "响；有名" },
      { tone: "mid", thai: "ครู", roman: "khruu", zh: "老师" },
      { tone: "mid", thai: "เพื่อน", roman: "phʉ̂an", zh: "朋友" },
      { tone: "low", thai: "เก่ง", roman: "gèng", zh: "厉害" },
      { tone: "low", thai: "แข็ง", roman: "khɛ̌ng", zh: "硬" },
      { tone: "low", thai: "เก่า", roman: "gào", zh: "旧" },
      { tone: "low", thai: "เก็บ", roman: "gèp", zh: "收；存" },
      { tone: "low", thai: "เกิด", roman: "gèrt", zh: "出生" },
      { tone: "low", thai: "กลัว", roman: "gluua", zh: "怕" },
      { tone: "fall", thai: "โกรธ", roman: "gròot", zh: "生气" },
      { tone: "fall", thai: "เสื้อ", roman: "sûua", zh: "衣服" },
      { tone: "fall", thai: "เข้าใจ", roman: "khâo-jai", zh: "明白" },
      { tone: "fall", thai: "ขอบคุณ", roman: "khɔ̀ɔp-khun", zh: "谢谢" },
      { tone: "fall", thai: "เชิญ", roman: "chəən", zh: "请" },
      { tone: "fall", thai: "ลาก่อน", roman: "laa-gɔ̀ɔn", zh: "再见" },
      { tone: "high", thai: "แมว", roman: "mɛɛo", zh: "猫" },
      { tone: "high", thai: "แก้ว", roman: "gɛ̂ɛo", zh: "杯子；玻璃" },
      { tone: "high", thai: "ไม้", roman: "máai", zh: "木头" },
      { tone: "high", thai: "ไม้แข็ง", roman: "máai khɛ̌ng", zh: "硬木" },
      { tone: "high", thai: "น้ำตาล", roman: "náam-dtaan", zh: "糖" },
      { tone: "high", thai: "กาแฟ", roman: "gaa-fɛɛ", zh: "咖啡" },
      { tone: "rise", thai: "สวัสดี", roman: "sà-wàt-dii", zh: "你好" },
      { tone: "rise", thai: "ขอโทษ", roman: "khɔ̌ɔ-thôot", zh: "对不起" },
      { tone: "rise", thai: "หาย", roman: "hǎai", zh: "消失；痊愈" },
      { tone: "rise", thai: "หายใจ", roman: "hǎai-jai", zh: "呼吸" },
      { tone: "rise", thai: "ผอม", roman: "phɔ̌ɔm", zh: "瘦" },
      { tone: "rise", thai: "ถุง", roman: "thǔng", zh: "袋子" }
    ]
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
    // 第一单元五课按序：l1a 常开，其后须完成上一课
    if (id === "l1a") return true;
    if (id === "l1b") return !!p.l1a;
    if (id === "l1c") return !!p.l1b;
    if (id === "l1d") return !!p.l1c;
    if (id === "l1e") return !!p.l1d;
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
      ["l1", "第一单元", "5 个声调"],
      ["l2", "第二单元", "21 个声母"],
      ["l3", "第三单元", "长短元音"],
      ["l4", "第四单元", "音节拼读"],
      ["l5", "第五单元", "综合自测"]
    ];
  }

  function home(ui, bag) {
    const steps = ["l1", "l2", "l3", "l4", "l5"];
    const doneCount = steps.filter(function (id) { return bag.passed && bag.passed[id]; }).length;
    const quota = Math.max(1, Math.min(5, Number(ui.dailyPhonics) || 1));
    const todayDone = Math.max(0, Number(ui.phonicsToday) || 0);
    const lock = '<svg class="lock-icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.2" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
    const rows = lessonMeta().map(function (item) {
      const on = openLesson(item[0], bag);
      const title = esc(item[1] + " · " + item[2]);
      if (!on) return '<article class="ph-lesson is-locked"><p class="ph-lesson-name">' + lock + title + "</p></article>";
      return '<article class="ph-lesson"><p class="ph-lesson-name">' + title + '</p><button type="button" class="btn btn-primary" data-act="phonics-open" data-id="' + item[0] + '">开始学习</button></article>';
    }).join("");
    const report = bag.report ? '<button type="button" class="btn" data-act="phonics-open" data-id="report">查看最近一次自测</button>' : "";
    return '<div class="page"><div class="ph-head"><h1>音标入门</h1><p class="ph-progress">单元 ' + doneCount + " / 5</p></div>" +
      '<p class="progress-label">今日 ' + todayDone + " / " + quota + " 课</p>" +
      '<div class="ph-lessons">' + rows + "</div>" +
      '<div class="ph-actions"><button type="button" class="btn" data-act="phonics-open" data-id="review">错题</button>' + report +
      '<button type="button" class="btn" data-act="phonics-open" data-id="letters">字母</button></div></div>';
  }

  function toneSetKind(letter) {
    return "l1" + letter;
  }

  function isToneDrillKind(kind) {
    return /^l1[a-e]$/.test(String(kind || "")) || kind === "l1";
  }

  const TONE_SECTION_META = [
    { title: "日常动作", tip: "" },
    { title: "人物身体", tip: "" },
    { title: "事物数量", tip: "" },
    { title: "时间自然", tip: "" },
    { title: "情感寒暄", tip: "" }
  ];

  function toneStudyWords(setIndex) {
    const set = TONE_SETS[setIndex] || [];
    const by = { mid: [], low: [], fall: [], high: [], rise: [] };
    set.forEach(function (word) {
      if (by[word.tone]) by[word.tone].push(word);
    });
    const picked = [];
    const used = {};
    // 每调固定取 2 个（顺序稳定，学习页与测验共用同一批）
    ["mid", "low", "fall", "high", "rise"].forEach(function (tone) {
      (by[tone] || []).slice(0, 2).forEach(function (word) {
        picked.push(word);
        used[word.thai] = true;
      });
    });
    // 除基调槽位外再补同组词，拓宽学习面且与测验音标一致
    set.forEach(function (word) {
      if (picked.length >= 15) return;
      if (used[word.thai]) return;
      picked.push(word);
      used[word.thai] = true;
    });
    return picked;
  }

  function toneRefStrip() {
    return TONES.map(function (tone) {
      return '<button type="button" class="chip" data-act="speak" data-thai="' + encodeURIComponent(tone.thai) + '">' +
        esc(TONE_NAME[tone.id]) + " · " + esc(tone.roman) + "</button>";
    }).join("");
  }

  function sectionState(bag, kind) {
    if (!bag.section || typeof bag.section !== "object") bag.section = {};
    if (!bag.section[kind] || typeof bag.section[kind] !== "object") {
      bag.section[kind] = { studyIndex: 0, studyDone: false, quiz: null };
    }
    const row = bag.section[kind];
    // 同步/反序列化偶发把 studyIndex 变成字符串；不能直接清零，否则点「下一个」会跳回首词。
    const n = Number(row.studyIndex);
    row.studyIndex = isFinite(n) && n >= 0 ? Math.floor(n) : 0;
    row.studyDone = !!row.studyDone;
    return row;
  }

  function advanceStudy(bag, kind) {
    const words = toneStudyWords(Math.max(0, Math.min(4, (kind.charCodeAt(2) || 97) - 97)));
    const row = sectionState(bag, kind);
    if (row.studyDone) return row;
    if (row.studyIndex >= words.length - 1) {
      row.studyIndex = words.length - 1;
      row.studyDone = true;
    } else {
      row.studyIndex += 1;
    }
    return row;
  }

  function retreatStudy(bag, kind) {
    const row = sectionState(bag, kind);
    row.studyDone = false;
    if (row.studyIndex > 0) row.studyIndex -= 1;
    return row;
  }

  function resetStudy(bag, kind) {
    const row = sectionState(bag, kind);
    row.studyIndex = 0;
    row.studyDone = false;
    return row;
  }

  // 渲染时优先用会话内游标，避免 save→同步 settle 用旧 phonics 盖掉后闪回首词。
  function studyProgress(ui, bag, kind) {
    const row = sectionState(bag, kind);
    if (ui && ui.studyKind === kind && typeof ui.studyIndex === "number" && isFinite(ui.studyIndex)) {
      return {
        studyIndex: Math.max(0, Math.floor(ui.studyIndex)),
        studyDone: !!ui.studyDone,
        quiz: row.quiz
      };
    }
    return row;
  }

  function tonePage(ui, bag) {
    const passed = (bag && bag.passed) || {};
    const lock = '<svg class="lock-icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.2" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
    const doneCount = ["a", "b", "c", "d", "e"].filter(function (letter) { return !!passed[toneSetKind(letter)]; }).length;
    const sections = ["a", "b", "c", "d", "e"].map(function (letter, index) {
      const kind = toneSetKind(letter);
      const meta = TONE_SECTION_META[index] || { title: "第 " + (index + 1) + " 课", tip: "" };
      const done = !!passed[kind];
      const opened = openLesson(kind, bag);
      const title = (index + 1) + ". " + esc(meta.title);
      const state = done ? "✅ 已完成" : opened ? "🟡 学习中" : "🔒 未解锁";
      if (!opened) {
        return '<article class="card course-item tight tone-phonics is-locked">' +
          '<div class="course-item-main"><p class="course-state">' + state + "</p><h2>" + lock + " " + title + "</h2></div>" +
          '<div class="course-item-actions"><button type="button" class="btn" data-act="phonics-locked" data-id="' + kind + '">锁定</button></div></article>';
      }
      return '<article class="card course-item tight tone-phonics">' +
        '<div class="course-item-main"><p class="course-state">' + state + "</p><h2>" + title + "</h2>" +
        '<p class="muted">' + toneStudyWords(index).length + " 词</p></div>" +
        '<div class="course-item-actions">' +
        '<button type="button" class="btn btn-primary" data-act="phonics-open" data-id="' + kind + '">学习</button>' +
        '<button type="button" class="btn" data-act="phonics-drill" data-id="' + kind + '"' + (done ? "" : " disabled") + ">复习</button>" +
        '<button type="button" class="btn" data-act="phonics-words" data-id="' + kind + '">生词</button>' +
        '<button type="button" class="btn" data-act="phonics-notes" data-id="' + kind + '">笔记</button>' +
        "</div></article>";
    }).join("");
    return '<div class="page course-page"><p class="muted" style="margin-top:8px">第一单元 · 已完成 ' + doneCount + " / 5 课</p>" +
      '<div class="course-list" style="margin-top:12px">' + sections + "</div></div>";
  }

  function toneSectionPage(ui, bag, kind) {
    const letter = String(kind || "l1a").slice(2) || "a";
    const index = Math.max(0, Math.min(4, letter.charCodeAt(0) - 97));
    const meta = TONE_SECTION_META[index] || { title: "本课", tip: "" };
    const words = toneStudyWords(index);
    const prog = studyProgress(ui, bag, kind);
    const passed = (bag && bag.passed) || {};
    const sectionPassed = !!passed[kind];
    const quiz = ui.quiz && ui.quiz.kind === kind ? ui.quiz : null;
    const nextLetter = index < 4 ? String.fromCharCode(97 + index + 1) : "";
    const nextKind = nextLetter ? toneSetKind(nextLetter) : "";
    const nextOpen = nextKind && openLesson(nextKind, bag);
    const nextBtn = nextOpen
      ? '<button type="button" class="btn btn-primary" data-act="phonics-open" data-id="' + nextKind + '">进入第 ' + (index + 2) + " 课</button>"
      : "";
    const backRow = '<div class="row" style="margin-top:16px;flex-wrap:wrap;gap:8px"><button type="button" class="btn" data-act="phonics-open" data-id="l1">返回第一单元</button>' + nextBtn + "</div>";
    const head = '<div class="page"><p class="muted" style="margin-top:12px">第一单元 · 第 ' + (index + 1) + " 课</p>" +
      '<h1>' + esc(meta.title) + "</h1>" +
      '<p class="muted" style="margin-top:10px">五调速记</p><div class="row" style="flex-wrap:wrap;gap:8px;margin-top:8px">' + toneRefStrip() + "</div>";

    // 测验进行中或刚结束：一次一题，进度已持久化
    if (quiz) {
      return head +
        '<section style="margin-top:12px"><h2>测验</h2>' +
        '<div style="margin-top:10px">' + drillHtml(quiz) + "</div></section>" + backRow + "</div>";
    }

    // 学完：可选测验 / 再学 / 返回
    if (prog.studyDone) {
      const quizLabel = sectionPassed ? "再测" : "测验";
      return head +
        '<section class="card tight" style="margin-top:12px"><h2>学完 · ' + words.length + " 词</h2>" +
        (sectionPassed ? '<p class="muted">已通过</p>' : "") +
        '<div class="row" style="margin-top:10px;flex-wrap:wrap;gap:8px">' +
        '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="' + kind + '">' + quizLabel + "</button>" +
        '<button type="button" class="btn" data-act="phonics-study-reset" data-id="' + kind + '">再学</button>' +
        "</div></section>" + backRow + "</div>";
    }

    // 学习：一次一词
    const at = Math.min(prog.studyIndex, Math.max(0, words.length - 1));
    const word = words[at] || words[0];
    const last = at >= words.length - 1;
    const nextLabel = last ? "学完" : "下一个";
    const prevDisabled = at <= 0 ? " disabled" : "";
    return head +
      '<section style="margin-top:16px"><h2>本课学习</h2>' +
      '<p class="day-progress">学习 ' + (at + 1) + " / " + words.length + "</p>" +
      '<div class="stage tone-study-stage">' +
      '<article class="card ph-card tone-study-card">' +
      '<p class="pos">' + esc(TONE_NAME[word.tone] || "") + "</p>" +
      '<p class="th tone-study-thai" lang="th">' + esc(word.thai) + "</p>" +
      '<p class="roman tone-study-roman">' + esc(word.roman) + "</p>" +
      '<p class="tone-study-zh">' + esc(word.zh) + "</p>" +
      '<div class="row tone-study-plays">' + playButtons(word.thai) + "</div>" +
      "</article>" +
      '<div class="actions tone-study-actions">' +
      '<button type="button" class="btn" data-act="phonics-study-prev" data-id="' + kind + '"' + prevDisabled + ">上一个</button>" +
      '<button type="button" class="btn btn-primary" data-act="phonics-study-next" data-id="' + kind + '">' + nextLabel + "</button>" +
      "</div></div></section>" + backRow + "</div>";
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
      const ex = word ? '<p class="muted"><span lang="th">' + esc(word.thai) + "</span> " + esc(word.zh) + "</p>" : "";
      const letter = ui.showLetter ? '<p class="thai-xl" lang="th" style="font-size:56px">' + esc(item.th) + "</p>" : "";
      const label = item.label || item.pb || "零声母";
      return '<article class="card ph-card tight"><p class="pos">' + esc(names[item.batch]) + '</p><p class="roman">' + esc(label) + "</p>" + letter +
        '<button type="button" class="btn" data-act="phonics-toggle-letter">' + (ui.showLetter ? "收起字母" : "字母") + "</button>" +
        ex +
        (word ? '<div class="row" style="margin-top:8px">' + playButtons(word.thai) + "</div>" : "") +
        "</article>";
    }).join("");
    const drillId = "l2" + batch;
    const drill = ui.quiz && ui.quiz.kind === drillId ? drillHtml(ui.quiz) : '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="' + drillId + '">测验</button>';
    return '<div class="page"><p class="muted" style="margin-top:8px">第二单元</p><h1>21 个声母</h1><div class="row" style="margin-top:10px">' + tabs + '</div><div class="grid" style="margin-top:12px">' + cards + "</div><div style=\"margin-top:12px\">" + drill + "</div></div>";
  }

  function vowelPage(ui) {
    const cards = VOWELS.map(function (item) {
      return '<article class="card ph-card tight"><p class="pos">短 / 长</p><p class="roman">' + esc(item.short) + " · " + esc(item.long) + '</p><div class="row"><div><p class="th" lang="th">' + esc(item.shortThai) + "</p><p class=\"ipa\">" + esc(item.shortRo) + "</p><p>" + esc(item.shortZh) + '</p><div class="row">' + playButtons(item.shortThai) + '</div></div><div><p class="th" lang="th">' + esc(item.longThai) + "</p><p class=\"ipa\">" + esc(item.longRo) + "</p><p>" + esc(item.longZh) + '</p><div class="row">' + playButtons(item.longThai) + "</div></div></div></article>";
    }).join("");
    const drill = ui.quiz && ui.quiz.kind === "l3" ? drillHtml(ui.quiz) : '<button type="button" class="btn btn-primary" data-act="phonics-drill" data-id="l3">测验</button>';
    return '<div class="page"><p class="muted" style="margin-top:8px">第三单元</p><h1>长短元音</h1><div class="grid" style="margin-top:12px">' + cards + "</div><div style=\"margin-top:12px\">" + drill + "</div></div>";
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
    return '<section class="card tight"><h2>拼读</h2><p class="muted" style="margin-top:8px">声母</p><div class="row" style="flex-wrap:wrap">' + onsetChips + '</div><p class="muted">元音</p><div class="row" style="flex-wrap:wrap">' + vowelChips + '</div><p class="muted">声调</p><div class="row" style="flex-wrap:wrap">' + toneChips + "</div><div style=\"margin-top:10px\">" + result + "</div></section>";
  }

  function deckCard(ui) {
    const deck = ui.deck || [];
    if (!deck.length) return "";
    if (ui.deckDone) return '<section class="card tight"><h2>本课完成</h2><button type="button" class="btn btn-primary" data-act="phonics-pass" data-id="l4">完成</button></section>';
    const card = deck[ui.index] || deck[0];
    const faceFront = '<div class="face face-front"><p class="roman" style="font-size:40px">' + esc(card.syl) + "</p></div>";
    const faceBack = '<div class="face face-back"><p class="zh-lg">' + esc(card.zh) + '</p><p class="th" lang="th">' + esc(card.thai) + '</p><p class="ipa">' + esc(card.roman) + '</p><div class="row">' + playButtons(card.thai) + "</div></div>";
    return '<p class="day-progress">' + (ui.index + 1) + " / " + deck.length + '</p><div class="flip' + (ui.flipped ? " is-back" : "") + '" data-act="phonics-flip"><div class="flip-inner">' + faceFront + faceBack + '</div></div><div class="actions"><button type="button" class="btn btn-primary" data-act="phonics-next">下一张</button></div>';
  }

  function readPage(ui) {
    return '<div class="page"><p class="muted" style="margin-top:12px">第四单元</p><h1>音节拼读</h1>' + builder(ui) + '<div class="stage" style="padding-top:18px">' + deckCard(ui) + "</div></div>";
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
    return '<div class="page"><h1>泰文字母</h1><div class="grid" style="margin-top:12px">' + cards + "</div></div>";
  }

  function drillHtml(quiz) {
    if (quiz.done) {
      const rate = quiz.total ? Math.round(100 * quiz.correct / quiz.total) : 0;
      const toneDone = /^l1[a-e]$/.test(String(quiz.kind || ""));
      const passHint = toneDone
        ? (quiz.passed ? "本课已通过。" : "达到 80% 后本课通过，可再做一次。")
        : (quiz.passed ? "本课已完成。" : "达到 80% 后本课完成，可再做一次。");
      return '<section class="card"><h2>答对 ' + quiz.correct + " / " + quiz.total + "</h2><p class=\"hint\">正确率 " + rate + "%。" + passHint + "</p>" +
        (quiz.wrongs.length ? "<p>记入复习的题：</p><ul>" + quiz.wrongs.map(function (item) { return "<li>" + esc(item.answerLabel) + "</li>"; }).join("") + "</ul>" : "<p>没有错题。</p>") +
        '<div class="row" style="flex-wrap:wrap;gap:8px;margin-top:10px">' +
        '<button type="button" class="btn" data-act="phonics-drill" data-id="' + esc(quiz.kind) + '">再做一次</button>' +
        (toneDone ? '<button type="button" class="btn" data-act="phonics-quiz-dismiss" data-id="' + esc(quiz.kind) + '">返回本课</button>' : "") +
        "</div></section>";
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

  function toneDrillItems(pool) {
    const options = ["mid", "low", "fall", "high", "rise"].map(function (id) {
      return { id: id, label: TONE_NAME[id] + " " + TONE_MARK[id] };
    });
    return shuffle(pool.slice()).map(function (word) {
      const syl = String(word.roman || "").split(/[\s-]+/).filter(Boolean)[0] || "";
      const tone = word.tone || toneOf(syl);
      return {
        type: "tone",
        thai: word.thai,
        prompt: "听一听，选出「" + word.zh + "」的声调。",
        answer: tone,
        answerLabel: TONE_NAME[tone] + " " + TONE_MARK[tone] + " · " + word.roman + " " + word.zh,
        options: options
      };
    });
  }

  function makeDrill(kind) {
    let items = [];
    if (kind === "l1") kind = "l1a";
    if (/^l1[a-e]$/.test(kind)) {
      const index = Math.max(0, Math.min(4, kind.charCodeAt(2) - 97));
      const set = TONE_SETS[index] || TONE_SETS[0];
      const study = toneStudyWords(index);
      const studyThai = {};
      study.forEach(function (word) { studyThai[word.thai] = true; });
      // 约 22 题来自本课（优先学习词），约 8 题掺其他组，共约 30 题
      const focus = shuffle(set.slice());
      const learned = focus.filter(function (word) { return studyThai[word.thai]; });
      const restSame = focus.filter(function (word) { return !studyThai[word.thai]; });
      const main = learned.concat(restSame).slice(0, 22);
      const outsiders = [];
      TONE_SETS.forEach(function (other, at) {
        if (at === index) return;
        outsiders.push.apply(outsiders, other);
      });
      const mix = shuffle(outsiders).slice(0, Math.max(0, 30 - main.length));
      items = toneDrillItems(main.concat(mix));
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
    return '<div class="page"><p class="muted" style="margin-top:8px">第五单元</p><h1>综合自测</h1><div style="margin-top:12px">' + body + "</div></div>";
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
    if (/^l1[a-e]$/.test(lesson)) return toneSectionPage(ui, bag, lesson);
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
    TONE_NAME: TONE_NAME,
    sectionState: sectionState,
    studyProgress: studyProgress,
    advanceStudy: advanceStudy,
    retreatStudy: retreatStudy,
    resetStudy: resetStudy,
    toneStudyWords: toneStudyWords
  };
})();
