/* ได้ยิน curriculum: tones, politeness, and survival talk. Script is the source of truth. */
(function () {
  const lessons = [
    {
      id: "tones",
      no: "๑",
      title: "五个声调",
      blurb: "泰语里不少词只靠声调区分。声调尚未听清时，多记单词反而容易混淆。",
      promise: "听辨「不、新、吗、木头」四个不同的声音",
      dialogueId: null,
      tips: [
        "五个声调为中、低、降、高、升。降调由高向低，升调先低后高。",
        "罗马音中，à 表示低，â 表示降，á 表示高，ǎ 表示升，无符号为中平。",
        "bp、dt 对应不送气的 ป、ต，不要读成英语的 p、t。kh、ph、th 送气，其中 th 不是英语的 th。"
      ],
      words: [
        { id: "t-mai-no", thai: "ไม่", roman: "mâi", zh: "不", tone: "降", confuse: "mai", tip: "音短，调由高向低。多用于否定后面的词。" },
        { id: "t-mai-new", thai: "ใหม่", roman: "mài", zh: "新的", tone: "低", confuse: "mai", tip: "低调，不要上扬。表示新的、新来的。" },
        { id: "t-mai-wood", thai: "ไม้", roman: "mái", zh: "木头", tone: "高", confuse: "mai", tip: "高而短。与「不」最容易混淆。" },
        { id: "t-mai-q", thai: "ไหม", roman: "mǎi", zh: "吗", tone: "升", confuse: "mai", tip: "用于句尾，相当于「吗」。先低后高。丝绸也读这个音。" },
        { id: "t-maa", thai: "มา", roman: "maa", zh: "来", tone: "中", confuse: "maa", tip: "中平，不升不降。表示来、过来。" },
        { id: "t-maa-horse", thai: "ม้า", roman: "máa", zh: "马", tone: "高", confuse: "maa" },
        { id: "t-maa-dog", thai: "หมา", roman: "mǎa", zh: "狗", tone: "升", confuse: "maa", tip: "与「来」只差声调。升调先低后高。" },
        { id: "t-khaa-leg", thai: "ขา", roman: "khǎa", zh: "腿", tone: "升", confuse: "khaa" },
        { id: "t-khaa-gal", thai: "ข่า", roman: "khàa", zh: "南姜", tone: "低", confuse: "khaa", tip: "市场里常见。音长，为低调。" },
        { id: "t-khaa-price", thai: "ค่า", roman: "khâa", zh: "价钱", tone: "降", confuse: "khaa", tip: "问价时表示价钱。调由高向低。" },
        { id: "t-khaa-trade", thai: "ค้า", roman: "kháa", zh: "做买卖", tone: "高", confuse: "khaa" },
        { id: "t-paa-forest", thai: "ป่า", roman: "pàa", zh: "森林", tone: "低", confuse: "paa" },
        { id: "t-paa-aunt", thai: "ป้า", roman: "pâa", zh: "阿姨", tone: "降", confuse: "paa", tip: "用于称呼年长女性，为降调。若读成高调，则变成「爸爸」。" },
        { id: "t-paa-dad", thai: "ป๊า", roman: "páa", zh: "爸爸", tone: "高", confuse: "paa", tip: "口语中用于称呼爸爸，为高平调。" }
      ],
      listens: [
        { thai: "ไม่", roman: "mâi", zh: "不", wordId: "t-mai-no", options: ["不", "新的", "木头", "吗"] },
        { thai: "ใหม่", roman: "mài", zh: "新的", wordId: "t-mai-new", options: ["新的", "不", "木头", "吗"] },
        { thai: "ไม้", roman: "mái", zh: "木头", wordId: "t-mai-wood", options: ["木头", "不", "新的", "马"] },
        { thai: "ไหม", roman: "mǎi", zh: "吗", wordId: "t-mai-q", options: ["吗", "不", "新的", "木头"] },
        { thai: "มา", roman: "maa", zh: "来", wordId: "t-maa", options: ["来", "马", "狗", "不"] },
        { thai: "ม้า", roman: "máa", zh: "马", wordId: "t-maa-horse", options: ["马", "狗", "来", "新的"] },
        { thai: "หมา", roman: "mǎa", zh: "狗", wordId: "t-maa-dog", options: ["狗", "来", "马", "吗"] },
        { thai: "ค่า", roman: "khâa", zh: "价钱", wordId: "t-khaa-price", options: ["价钱", "腿", "南姜", "做买卖"] },
        { thai: "ป้า", roman: "pâa", zh: "阿姨", wordId: "t-paa-aunt", options: ["阿姨", "爸爸", "森林", "来"] },
        { thai: "ป๊า", roman: "páa", zh: "爸爸", wordId: "t-paa-dad", options: ["爸爸", "阿姨", "森林", "马"] }
      ],
      sentences: [
        {
          thai: "ไม่ใช่",
          roman: "mâi châi",
          zh: "不是",
          note: "ใช่ 表示「是」，为降调。否定时在前面加 ไม่。",
          options: ["不是", "是的", "新的", "不知道"]
        },
        {
          thai: "หมาไม่มา",
          roman: "mǎa mâi maa",
          zh: "狗不来",
          note: "三个声调相连：升、降、中。可先慢速听，再跟读。",
          options: ["狗不来", "马过来了", "不是狗", "新来的"]
        },
        {
          thai: "ค่าเท่าไหร่",
          roman: "khâa thâo-rài",
          zh: "多少钱",
          note: "两个降调相连。后半句在市场和出租车上都很常见。",
          options: ["多少钱", "太贵了", "可以便宜吗", "这是新的"]
        },
        {
          thai: "มาใหม่",
          roman: "maa mài",
          zh: "新来的",
          note: "中调后接低调。第二字不要听成「木头」。",
          options: ["新来的", "不来", "马过来", "木头来了"]
        }
      ],
      speaks: [
        { zh: "说「不」", thai: "ไม่", roman: "mâi", keys: ["ไม่"] },
        { zh: "说句尾的「吗」", thai: "ไหม", roman: "mǎi", keys: ["ไหม"] },
        { zh: "说「狗」", thai: "หมา", roman: "mǎa", keys: ["หมา"] },
        { zh: "说「多少钱」", thai: "ค่าเท่าไหร่", roman: "khâa thâo-rài", keys: ["เท่าไหร่"] }
      ]
    },
    {
      id: "polite",
      no: "๒",
      title: "礼貌词",
      blurb: "与陌生人交谈时，句尾的 ครับ 或 ค่ะ 表示正在对对方说话，并带有礼貌。",
      promise: "问候、道谢和道歉时，使用与自己相应的礼貌词",
      dialogueId: "greet",
      tips: [
        "男性句尾用 ครับ，问句同样用 ครับ。",
        "女性陈述用 ค่ะ，问句用 คะ。二者声调不同。",
        "สวัสดี 既可用于见面，也可用于道别。"
      ],
      words: [
        { id: "p-hello", thai: "สวัสดี", roman: "sà-wàt-dii", zh: "你好 / 再见", tone: "低·低·中", tip: "对陌生人和长辈不宜省略。离开时也可以使用。" },
        { id: "p-khrap", thai: "ครับ", roman: "khráp", zh: "男生礼貌词", tone: "高", tip: "没有具体词义，附在句尾。声调高而短。" },
        { id: "p-kha", thai: "ค่ะ", roman: "khâ", zh: "女生陈述礼貌词", tone: "降", tip: "用于陈述、道谢和回应，为降调。" },
        { id: "p-khaq", thai: "คะ", roman: "khá", zh: "女生问句礼貌词", tone: "高", tip: "用于问句末尾，为高平调。不要读成降调的 ค่ะ。" },
        { id: "p-thanks", thai: "ขอบคุณ", roman: "khàwp-khun", zh: "谢谢", tone: "低·中" },
        { id: "p-ok", thai: "ไม่เป็นไร", roman: "mâi-bpen-rai", zh: "没关系", tone: "降·中·中", tip: "对方道谢或道歉时，常用这句回应。" },
        { id: "p-sorry", thai: "ขอโทษ", roman: "khǎw-thôht", zh: "对不起", tone: "升·降", tip: "挡路、没有听懂或打断对方时，可先说这句。" },
        { id: "p-welcome", thai: "ยินดี", roman: "yin-dii", zh: "乐意", tone: "中·中", tip: "ยินดีครับ 或 ยินดีค่ะ 用于回应道谢，也出现在「很高兴认识你」中。" }
      ],
      listens: [
        { thai: "สวัสดีครับ", roman: "sà-wàt-dii khráp", zh: "你好（男生说）", wordId: "p-hello", options: ["你好（男生说）", "谢谢", "对不起", "没关系"] },
        { thai: "สวัสดีค่ะ", roman: "sà-wàt-dii khâ", zh: "你好（女生说）", wordId: "p-hello", options: ["你好（女生说）", "多少钱", "不是", "随便道别"] },
        { thai: "ขอบคุณครับ", roman: "khàwp-khun khráp", zh: "谢谢", wordId: "p-thanks", options: ["谢谢", "对不起", "没关系", "你好"] },
        { thai: "ไม่เป็นไรค่ะ", roman: "mâi-bpen-rai khâ", zh: "没关系", wordId: "p-ok", options: ["没关系", "谢谢", "不是", "多少钱"] },
        { thai: "ขอโทษครับ", roman: "khǎw-thôht khráp", zh: "对不起", wordId: "p-sorry", options: ["对不起", "谢谢", "你好", "可以"] },
        { thai: "คะ", roman: "khá", zh: "女生用来提问的礼貌词", wordId: "p-khaq", options: ["女生用来提问的礼貌词", "女生用来陈述的礼貌词", "男生礼貌词", "谢谢"] },
        { thai: "ค่ะ", roman: "khâ", zh: "女生用来陈述的礼貌词", wordId: "p-kha", options: ["女生用来陈述的礼貌词", "女生用来提问的礼貌词", "不", "新的"] }
      ],
      sentences: [
        { thai: "สวัสดี{p}", roman: "sà-wàt-dii {pr}", zh: "你好", note: "先把礼貌词说准确，再补充其他内容。", options: ["你好", "谢谢", "对不起", "我不会"] },
        { thai: "ขอบคุณ{p}", roman: "khàwp-khun {pr}", zh: "谢谢", options: ["谢谢", "没关系", "你好", "多少钱"] },
        { thai: "ไม่เป็นไร{p}", roman: "mâi-bpen-rai {pr}", zh: "没关系", options: ["没关系", "对不起", "不是", "再见"] },
        { thai: "ขอโทษ{p}", roman: "khǎw-thôht {pr}", zh: "对不起", options: ["对不起", "谢谢", "可以吗", "我不知道"] }
      ],
      speaks: [
        { zh: "问候对方，并加上礼貌词", thai: "สวัสดี{p}", roman: "sà-wàt-dii {pr}", keys: ["สวัสดี"] },
        { zh: "说谢谢", thai: "ขอบคุณ{p}", roman: "khàwp-khun {pr}", keys: ["ขอบคุณ"] },
        { zh: "说对不起", thai: "ขอโทษ{p}", roman: "khǎw-thôht {pr}", keys: ["ขอโทษ"] }
      ]
    },
    {
      id: "survive",
      no: "๓",
      title: "基本应对",
      blurb: "与本地人交谈时，最初最有用的不是语法，而是报出姓名、说明只会一点，以及请对方说慢一些。",
      promise: "能够独立说出姓名、表示没听懂，并请对方放慢",
      dialogueId: "greet",
      tips: [
        "男性自称 ผม，女性自称 ฉัน。称呼陌生人用 คุณ。",
        "没有听懂时应当停下来说明，不宜点头表示已经明白。",
        "ช้าๆ 中的 ๆ 表示将「慢」再说一次。"
      ],
      words: [
        { id: "s-i-m", thai: "ผม", roman: "phǒm", zh: "我（男生）", tone: "升" },
        { id: "s-i-f", thai: "ฉัน", roman: "chǎn", zh: "我（女生）", tone: "升" },
        { id: "s-you", thai: "คุณ", roman: "khun", zh: "你（礼貌）", tone: "中" },
        { id: "s-name", thai: "ชื่อ", roman: "chêu", zh: "名字", tone: "降" },
        { id: "s-what", thai: "อะไร", roman: "à-rai", zh: "什么", tone: "低·中" },
        { id: "s-understand", thai: "เข้าใจ", roman: "khâo-jai", zh: "明白", tone: "降·中", tip: "ไม่เข้าใจ = 不明白。" },
        { id: "s-speak", thai: "พูด", roman: "phûut", zh: "说", tone: "降" },
        { id: "s-slow", thai: "ช้า", roman: "cháa", zh: "慢", tone: "高" },
        { id: "s-little", thai: "นิดหน่อย", roman: "nít-nòi", zh: "一点点", tone: "高·低" },
        { id: "s-thai", thai: "ภาษาไทย", roman: "phaa-sǎa thai", zh: "泰语", tone: "中·升·中" }
      ],
      listens: [
        { thai: "คุณชื่ออะไรครับ", roman: "khun chêu à-rai khráp", zh: "你叫什么名字", wordId: "s-name", options: ["你叫什么名字", "你好吗", "你去哪里", "多少钱"] },
        { thai: "ไม่เข้าใจค่ะ", roman: "mâi khâo-jai khâ", zh: "我不明白", wordId: "s-understand", options: ["我不明白", "没关系", "我明白", "说得很好"] },
        { thai: "พูดช้าๆ ได้ไหมครับ", roman: "phûut cháa-cháa dâai mǎi khráp", zh: "能说慢一点吗", wordId: "s-slow", options: ["能说慢一点吗", "能再说一次吗", "你叫什么", "我不会说泰语"] },
        { thai: "พูดอีกทีได้ไหมคะ", roman: "phûut ìik-thii dâai mǎi khá", zh: "能再说一次吗", wordId: "s-speak", options: ["能再说一次吗", "能说慢一点吗", "写下来好吗", "明天见"] },
        { thai: "พูดภาษาไทยได้นิดหน่อย", roman: "phûut phaa-sǎa thai dâai nít-nòi", zh: "泰语只会说一点点", wordId: "s-little", options: ["泰语只会说一点点", "泰语说得很好", "我不会听", "请说英语"] },
        { thai: "สบายดีไหมครับ", roman: "sà-baai dii mǎi khráp", zh: "你好吗", wordId: "s-what", options: ["你好吗", "你叫什么", "去哪里", "多少钱"] }
      ],
      sentences: [
        { thai: "{i}ชื่อมาร์ค{p}", roman: "{ir} chêu máak {pr}", zh: "我叫马克", note: "练习时可将 มาร์ค 换成自己的名字。这里用示范名，是为了把句子说完整。", options: ["我叫马克", "你叫什么", "我不会", "谢谢"] },
        { thai: "คุณชื่ออะไร{q}", roman: "khun chêu à-rai {qr}", zh: "你叫什么名字", options: ["你叫什么名字", "你好吗", "你去哪", "你吃什么"] },
        { thai: "ไม่เข้าใจ{p} ช่วยพูดช้าๆ หน่อยได้ไหม{q}", roman: "mâi khâo-jai {pr} chûay phûut cháa-cháa nòi dâai mǎi {qr}", zh: "我不明白，能说慢一点吗", note: "与本地人交谈时，这是最常用的一句。", options: ["我不明白，能说慢一点吗", "请再说一遍价钱", "我听懂了", "没关系"] },
        { thai: "พูดภาษาไทยได้นิดหน่อย{p}", roman: "phûut phaa-sǎa thai dâai nít-nòi {pr}", zh: "我只会一点点泰语", options: ["我只会一点点泰语", "我会说泰语", "我不说泰语", "你的泰语很好"] }
      ],
      speaks: [
        { zh: "说明自己叫马克", thai: "{i}ชื่อมาร์ค{p}", roman: "{ir} chêu máak {pr}", keys: ["ชื่อ"] },
        { zh: "问：你叫什么名字？", thai: "คุณชื่ออะไร{q}", roman: "khun chêu à-rai {qr}", keys: ["ชื่อ", "อะไร"] },
        { zh: "说：我不明白，请说慢一点", thai: "ไม่เข้าใจ{p} ช่วยพูดช้าๆ หน่อยได้ไหม{q}", roman: "mâi khâo-jai {pr} chûay phûut cháa-cháa nòi dâai mǎi {qr}", keys: ["ไม่เข้าใจ", "ช้า"] }
      ]
    },
    {
      id: "numbers",
      no: "๔",
      title: "数字和价钱",
      blurb: "旅行中最容易听错的是数字。宜先听清单个数字，再听「五十铢」「一百铢」这样的完整说法。",
      promise: "不借助手势也能听清数字，并能询问价格",
      dialogueId: "market",
      tips: [
        "询问价格时，最常用的完整句子是 อันนี้เท่าไหร่。",
        "计数时需要量词。一盘用 จาน，一块用 ชิ้น，一瓶用 ขวด。",
        "市场里的 ชิ้นละห้าสิบ 表示「每件五十」。ละ 表示「每」。"
      ],
      words: [
        { id: "n0", thai: "ศูนย์", roman: "sǔun", zh: "0", tone: "升" },
        { id: "n1", thai: "หนึ่ง", roman: "nùeng", zh: "1", tone: "低", tip: "位于量词前时，读音往往又轻又短。" },
        { id: "n2", thai: "สอง", roman: "sǎawng", zh: "2", tone: "升" },
        { id: "n3", thai: "สาม", roman: "sǎam", zh: "3", tone: "升" },
        { id: "n4", thai: "สี่", roman: "sìi", zh: "4", tone: "低", tip: "为低调，不要读成汉语的「四」。" },
        { id: "n5", thai: "ห้า", roman: "hâa", zh: "5", tone: "降" },
        { id: "n6", thai: "หก", roman: "hòk", zh: "6", tone: "低" },
        { id: "n7", thai: "เจ็ด", roman: "jèt", zh: "7", tone: "低" },
        { id: "n8", thai: "แปด", roman: "bpàet", zh: "8", tone: "低", tip: "声母为不送气的 bp，不是英语的 p。" },
        { id: "n9", thai: "เก้า", roman: "gâo", zh: "9", tone: "降" },
        { id: "n10", thai: "สิบ", roman: "sìp", zh: "10", tone: "低" },
        { id: "n20", thai: "ยี่สิบ", roman: "yîi-sìp", zh: "20", tone: "降·低", tip: "二十用 ยี่สิบ，不用 สองสิบ。" },
        { id: "n100", thai: "ร้อย", roman: "ráwy", zh: "100", tone: "高" },
        { id: "n-baht", thai: "บาท", roman: "bàat", zh: "铢", tone: "低" },
        { id: "n-howmuch", thai: "เท่าไหร่", roman: "thâo-rài", zh: "多少", tone: "降·降" },
        { id: "n-howmany", thai: "กี่", roman: "gîi", zh: "几", tone: "降" },
        { id: "n-exp", thai: "แพง", roman: "phaeng", zh: "贵", tone: "中" },
        { id: "n-cheap", thai: "ถูก", roman: "thùuk", zh: "便宜 / 对", tone: "低", tip: "同一个词。谈论价格时表示便宜，判断对错时表示「对」。" }
      ],
      listens: [
        { thai: "หนึ่ง", roman: "nùeng", zh: "1", wordId: "n1", options: ["1", "2", "3", "10"] },
        { thai: "สี่", roman: "sìi", zh: "4", wordId: "n4", options: ["4", "5", "8", "10"] },
        { thai: "ห้า", roman: "hâa", zh: "5", wordId: "n5", options: ["5", "9", "4", "50"] },
        { thai: "เก้า", roman: "gâo", zh: "9", wordId: "n9", options: ["9", "5", "8", "1"] },
        { thai: "ยี่สิบ", roman: "yîi-sìp", zh: "20", wordId: "n20", options: ["20", "12", "2", "21"] },
        { thai: "ห้าสิบ", roman: "hâa-sìp", zh: "50", wordId: "n5", options: ["50", "15", "5", "90"] },
        { thai: "หนึ่งร้อย", roman: "nùeng ráwy", zh: "100", wordId: "n100", options: ["100", "120", "10", "1000"] },
        { thai: "เท่าไหร่", roman: "thâo-rài", zh: "多少", wordId: "n-howmuch", options: ["多少", "太贵", "便宜", "一百"] },
        { thai: "แพงไป", roman: "phaeng bpai", zh: "太贵了", wordId: "n-exp", options: ["太贵了", "很便宜", "多少钱", "可以"] }
      ],
      sentences: [
        { thai: "อันนี้เท่าไหร่{q}", roman: "an-níi thâo-rài {qr}", zh: "这个多少钱", options: ["这个多少钱", "这个太贵了", "我要这个", "一共五十"] },
        { thai: "ห้าสิบบาท{p}", roman: "hâa-sìp bàat {pr}", zh: "五十铢", options: ["五十铢", "十五铢", "五百铢", "五铢"] },
        { thai: "แพงไปหน่อย{p}", roman: "phaeng bpai nòi {pr}", zh: "有点贵", options: ["有点贵", "很便宜", "多少钱", "我不要了"] },
        { thai: "หนึ่งร้อยยี่สิบบาท{p}", roman: "nùeng ráwy yîi-sìp bàat {pr}", zh: "一百二十铢", options: ["一百二十铢", "一百铢", "二十铢", "两百铢"] }
      ],
      speaks: [
        { zh: "问：这个多少钱？", thai: "อันนี้เท่าไหร่{q}", roman: "an-níi thâo-rài {qr}", keys: ["เท่าไหร่"] },
        { zh: "说：五十铢", thai: "ห้าสิบบาท{p}", roman: "hâa-sìp bàat {pr}", keys: ["ห้าสิบ"] },
        { zh: "说：有点贵", thai: "แพงไปหน่อย{p}", roman: "phaeng bpai nòi {pr}", keys: ["แพง"] }
      ]
    },
    {
      id: "food",
      no: "๕",
      title: "点餐",
      blurb: "点餐要用完整的句子，不能只说菜名。说出 ขอ 或 เอา，对方才知道这是在点餐。",
      promise: "能够点一份饭、说明辣度，并请对方结账",
      dialogueId: "food",
      tips: [
        "ข้าวผัด 是炒饭。ผัดไทย 才是通常所说的泰式炒河粉。二者都要能听辨。",
        "ไม่เผ็ด 表示不辣，เผ็ดน้อย 表示微辣，เผ็ดไป 表示太辣。",
        "用餐后可说 เช็คบิลได้ไหม。更口语的说法是 เก็บตังค์ได้ไหม。"
      ],
      words: [
        { id: "f-rice", thai: "ข้าว", roman: "khâao", zh: "饭", tone: "降" },
        { id: "f-fried", thai: "ข้าวผัด", roman: "khâao-phàt", zh: "炒饭", tone: "降·低" },
        { id: "f-padthai", thai: "ผัดไทย", roman: "phàt-thai", zh: "泰式炒河粉", tone: "低·中", tip: "这不是炒饭。炒饭是 ข้าวผัด。" },
        { id: "f-chicken", thai: "ไก่", roman: "gài", zh: "鸡", tone: "低" },
        { id: "f-water", thai: "น้ำ", roman: "náam", zh: "水", tone: "高" },
        { id: "f-plain", thai: "น้ำเปล่า", roman: "náam-bplào", zh: "白开水", tone: "高·低" },
        { id: "f-ice", thai: "น้ำแข็ง", roman: "náam-khǎeng", zh: "冰", tone: "高·升" },
        { id: "f-spicy", thai: "เผ็ด", roman: "phèt", zh: "辣", tone: "低" },
        { id: "f-yummy", thai: "อร่อย", roman: "à-ròi", zh: "好吃", tone: "低·降" },
        { id: "f-want", thai: "อยาก", roman: "yàak", zh: "想要", tone: "低" },
        { id: "f-eat", thai: "กิน", roman: "gin", zh: "吃", tone: "中" },
        { id: "f-take", thai: "เอา", roman: "ao", zh: "要（口语）", tone: "中", tip: "点餐和取物时最常用。" },
        { id: "f-ask", thai: "ขอ", roman: "khǎw", zh: "请给我", tone: "升", tip: "比 เอา 略为客气。" },
        { id: "f-plate", thai: "จาน", roman: "jaan", zh: "盘（量词）", tone: "中" },
        { id: "f-bill", thai: "เช็คบิล", roman: "chék-bin", zh: "买单", tone: "借词" }
      ],
      listens: [
        { thai: "ข้าวผัด", roman: "khâao-phàt", zh: "炒饭", wordId: "f-fried", options: ["炒饭", "泰式炒河粉", "白饭", "水"] },
        { thai: "ผัดไทย", roman: "phàt-thai", zh: "泰式炒河粉", wordId: "f-padthai", options: ["泰式炒河粉", "炒饭", "鸡肉", "冰"] },
        { thai: "น้ำเปล่า", roman: "náam-bplào", zh: "白开水", wordId: "f-plain", options: ["白开水", "冰", "辣", "好吃"] },
        { thai: "ไม่เผ็ด", roman: "mâi phèt", zh: "不辣", wordId: "f-spicy", options: ["不辣", "太辣", "微辣", "好吃"] },
        { thai: "อร่อยมาก", roman: "à-ròi mâak", zh: "非常好吃", wordId: "f-yummy", options: ["非常好吃", "太辣了", "买单", "我不要了"] },
        { thai: "เช็คบิล", roman: "chék-bin", zh: "买单", wordId: "f-bill", options: ["买单", "菜单", "打包", "好吃"] },
        { thai: "รับอะไรดีคะ", roman: "ráp à-rai dii khá", zh: "您想要点什么", wordId: "f-ask", options: ["您想要点什么", "一共多少钱", "好了请慢用", "不辣对吗"] }
      ],
      sentences: [
        { thai: "ขอข้าวผัดไก่หนึ่งจาน{q}", roman: "khǎw khâao-phàt gài nùeng jaan {qr}", zh: "请来一盘鸡肉炒饭", options: ["请来一盘鸡肉炒饭", "请来一份泰式炒河粉", "不要鸡肉", "饭多少钱"] },
        { thai: "ไม่เผ็ดนะ{p}", roman: "mâi phèt ná {pr}", zh: "不要辣", note: "นะ 用于缓和语气，并表示向对方确认。", options: ["不要辣", "微辣", "太辣了", "很好吃"] },
        { thai: "น้ำเปล่าเย็นหนึ่งขวด{p}", roman: "náam-bplào yen nùeng khùat {pr}", zh: "一瓶冰的白开水", options: ["一瓶冰的白开水", "一杯热咖啡", "不要冰", "买单"] },
        { thai: "เช็คบิลได้ไหม{q}", roman: "chék-bin dâai mǎi {qr}", zh: "可以买单吗", options: ["可以买单吗", "可以打包吗", "可以不辣吗", "可以便宜吗"] }
      ],
      speaks: [
        { zh: "点一盘鸡肉炒饭", thai: "ขอข้าวผัดไก่หนึ่งจาน{q}", roman: "khǎw khâao-phàt gài nùeng jaan {qr}", keys: ["ข้าวผัด"] },
        { zh: "说不要辣", thai: "ไม่เผ็ดนะ{p}", roman: "mâi phèt ná {pr}", keys: ["ไม่เผ็ด"] },
        { zh: "请对方买单", thai: "เช็คบิลได้ไหม{q}", roman: "chék-bin dâai mǎi {qr}", keys: ["เช็คบิล"] }
      ]
    },
    {
      id: "taxi",
      no: "๖",
      title: "问路和坐车",
      blurb: "司机语速较快，但所用句子比较固定。需要能说出目的地，听懂左右转，并会说在这里停车。",
      promise: "能够说明乘车目的地，并听懂直行、左转和到达",
      dialogueId: "taxi",
      tips: [
        "出租车不宜套用市场里的议价方式。价格不合适时，可以换一辆，或先询问大约多少钱。",
        "左转是 เลี้ยวซ้าย，右转是 เลี้ยวขวา，直行是 ตรงไป。",
        "到达后可说 จอดตรงนี้ได้ไหม，意思是「可以在这里停车吗」。"
      ],
      words: [
        { id: "x-go", thai: "ไป", roman: "bpai", zh: "去", tone: "中", tip: "声母不送气，接近汉语「不」的声母。" },
        { id: "x-where", thai: "ที่ไหน", roman: "thîi-nǎi", zh: "哪里", tone: "降·升" },
        { id: "x-straight", thai: "ตรงไป", roman: "dtrong-bpai", zh: "直走", tone: "中·中" },
        { id: "x-turn", thai: "เลี้ยว", roman: "lîao", zh: "转弯", tone: "降" },
        { id: "x-left", thai: "ซ้าย", roman: "sáai", zh: "左", tone: "高" },
        { id: "x-right", thai: "ขวา", roman: "khwǎa", zh: "右", tone: "升" },
        { id: "x-near", thai: "ใกล้", roman: "glâi", zh: "近", tone: "降" },
        { id: "x-far", thai: "ไกล", roman: "glai", zh: "远", tone: "中" },
        { id: "x-stop", thai: "จอด", roman: "jàwt", zh: "停", tone: "低" },
        { id: "x-arrive", thai: "ถึง", roman: "thǔeng", zh: "到达", tone: "升" },
        { id: "x-siam", thai: "สยาม", roman: "sà-yǎam", zh: "暹罗（商圈）", tone: "低·升", tip: "在曼谷，这是练习中最常用的目的地。" },
        { id: "x-hotel", thai: "โรงแรม", roman: "roong-raem", zh: "酒店", tone: "中·中" },
        { id: "x-airport", thai: "สนามบิน", roman: "sà-nǎam-bin", zh: "机场", tone: "低·升·中" },
        { id: "x-station", thai: "สถานีรถไฟ", roman: "sà-thǎa-nii rót-fai", zh: "火车站", tone: "低·升·中 · 高·中" }
      ],
      listens: [
        { thai: "จะไปไหนครับ", roman: "jà bpai nǎi khráp", zh: "要去哪里", wordId: "x-where", options: ["要去哪里", "多少钱", "到了", "左转"] },
        { thai: "ตรงไป", roman: "dtrong bpai", zh: "直走", wordId: "x-straight", options: ["直走", "左转", "右转", "停下"] },
        { thai: "เลี้ยวซ้าย", roman: "lîao sáai", zh: "左转", wordId: "x-left", options: ["左转", "右转", "直走", "很近"] },
        { thai: "เลี้ยวขวา", roman: "lîao khwǎa", zh: "右转", wordId: "x-right", options: ["右转", "左转", "很远", "停车"] },
        { thai: "ใกล้ไหมครับ", roman: "glâi mǎi khráp", zh: "近吗", wordId: "x-near", options: ["近吗", "远吗", "到了吗", "多少钱"] },
        { thai: "ถึงแล้วครับ", roman: "thǔeng láew khráp", zh: "到了", wordId: "x-arrive", options: ["到了", "出发", "请上车", "左转"] },
        { thai: "จอดตรงนี้ได้ไหมครับ", roman: "jàwt dtrong-níi dâai mǎi khráp", zh: "可以停这里吗", wordId: "x-stop", options: ["可以停这里吗", "可以便宜吗", "可以再走一点吗", "去机场吗"] },
        { thai: "สนามบิน", roman: "sà-nǎam-bin", zh: "机场", wordId: "x-airport", options: ["机场", "酒店", "火车站", "市场"] }
      ],
      sentences: [
        { thai: "ไปสยามได้ไหม{q}", roman: "bpai sà-yǎam dâai mǎi {qr}", zh: "去暹罗可以吗", options: ["去暹罗可以吗", "暹罗远吗", "在暹罗停", "暹罗多少钱"] },
        { thai: "เลี้ยวซ้ายข้างหน้า{p}", roman: "lîao sáai khâang-nàa {pr}", zh: "前面左转", options: ["前面左转", "前面右转", "一直直走", "已经到了"] },
        { thai: "โรงแรมอยู่ที่ไหน{q}", roman: "roong-raem yùu thîi-nǎi {qr}", zh: "酒店在哪里", options: ["酒店在哪里", "去酒店", "酒店很近", "我有预订"] },
        { thai: "จอดตรงนี้ได้ไหม{q}", roman: "jàwt dtrong-níi dâai mǎi {qr}", zh: "停这里可以吗", options: ["停这里可以吗", "再往前一点", "我到了谢谢", "去机场"] }
      ],
      speaks: [
        { zh: "问司机能不能去暹罗", thai: "ไปสยามได้ไหม{q}", roman: "bpai sà-yǎam dâai mǎi {qr}", keys: ["สยาม", "ได้ไหม"] },
        { zh: "说：前面左转", thai: "เลี้ยวซ้ายข้างหน้า{p}", roman: "lîao sáai khâang-nàa {pr}", keys: ["ซ้าย"] },
        { zh: "说：停这里可以吗", thai: "จอดตรงนี้ได้ไหม{q}", roman: "jàwt dtrong-níi dâai mǎi {qr}", keys: ["จอด"] }
      ]
    },
    {
      id: "market",
      no: "๗",
      title: "市场问价",
      blurb: "议价要按顺序说。先说有点贵，再问能否少一些，对方才容易回应。",
      promise: "听懂「每件多少钱」，并能按买东西的方式议价",
      dialogueId: "market",
      tips: [
        "ชิ้นละห้าสิบ 表示每件五十。应先听 ละ 后面的数字。",
        "议价顺序是：อันนี้เท่าไหร่，然后 แพงไปหน่อย，再问 ลดได้ไหม。",
        "一开始就要求免费，对方会认为并非认真购买。"
      ],
      words: [
        { id: "m-this", thai: "อันนี้", roman: "an-níi", zh: "这个", tone: "中·高" },
        { id: "m-piece", thai: "ชิ้น", roman: "chín", zh: "件 / 块", tone: "高" },
        { id: "m-per", thai: "ละ", roman: "lá", zh: "每", tone: "高", tip: "ชิ้นละ 表示每件。" },
        { id: "m-down", thai: "ลด", roman: "lót", zh: "降价", tone: "高" },
        { id: "m-take", thai: "เอา", roman: "ao", zh: "我要", tone: "中" },
        { id: "m-two", thai: "สองชิ้น", roman: "sǎawng chín", zh: "两件", tone: "升·高" },
        { id: "m-can", thai: "ได้", roman: "dâai", zh: "可以 / 行", tone: "降", tip: "对方说 ได้ค่ะ，表示同意。" },
        { id: "m-free", thai: "ฟรี", roman: "frii", zh: "免费", tone: "借词", tip: "能听懂即可。议价时不宜用它作为第一句。" }
      ],
      listens: [
        { thai: "อันนี้เท่าไหร่คะ", roman: "an-níi thâo-rài khá", zh: "这个多少钱", wordId: "m-this", options: ["这个多少钱", "这个我要了", "太贵了", "两件"] },
        { thai: "ชิ้นละห้าสิบบาท", roman: "chín lá hâa-sìp bàat", zh: "每件五十铢", wordId: "m-per", options: ["每件五十铢", "一共五十铢", "每件十五铢", "每件五百铢"] },
        { thai: "ลดได้ไหมคะ", roman: "lót dâai mǎi khá", zh: "能便宜一点吗", wordId: "m-down", options: ["能便宜一点吗", "能包起来吗", "能看一看吗", "能刷卡吗"] },
        { thai: "สี่สิบได้ค่ะ", roman: "sìi-sìp dâai khâ", zh: "四十可以", wordId: "m-can", options: ["四十可以", "十四可以", "四百可以", "不能便宜"] },
        { thai: "เอาสองชิ้นครับ", roman: "ao sǎawng chín khráp", zh: "我要两件", wordId: "m-two", options: ["我要两件", "我要十二件", "每件两铢", "不要了"] },
        { thai: "แพงไปหน่อยค่ะ", roman: "phaeng bpai nòi khâ", zh: "有点贵", wordId: "n-exp", options: ["有点贵", "很便宜", "正好", "免费吧"] }
      ],
      sentences: [
        { thai: "ชิ้นละห้าสิบบาท{p}", roman: "chín lá hâa-sìp bàat {pr}", zh: "每件五十铢", options: ["每件五十铢", "一共五十铢", "每件五铢", "五十件"] },
        { thai: "แพงไปหน่อย ลดได้ไหม{q}", roman: "phaeng bpai nòi lót dâai mǎi {qr}", zh: "有点贵，能少一点吗", options: ["有点贵，能少一点吗", "太便宜了", "我不要了", "这个免费吗"] },
        { thai: "สี่สิบได้ไหม{q}", roman: "sìi-sìp dâai mǎi {qr}", zh: "四十可以吗", note: "可以直接提出价格，语气宜轻，不宜像质问。", options: ["四十可以吗", "十四可以吗", "四百可以吗", "可以免费吗"] },
        { thai: "ได้{p} เอาสองชิ้น", roman: "dâai {pr} ao sǎawng chín", zh: "好，我要两件", options: ["好，我要两件", "好，我不要了", "两件多少钱", "每件两铢"] }
      ],
      speaks: [
        { zh: "说：有点贵，能少一点吗？", thai: "แพงไปหน่อย ลดได้ไหม{q}", roman: "phaeng bpai nòi lót dâai mǎi {qr}", keys: ["ลด", "แพง"] },
        { zh: "还价到四十", thai: "สี่สิบได้ไหม{q}", roman: "sìi-sìp dâai mǎi {qr}", keys: ["สี่สิบ"] },
        { zh: "说明要两件", thai: "เอาสองชิ้น{p}", roman: "ao sǎawng chín {pr}", keys: ["สอง"] }
      ]
    },
    {
      id: "repair",
      no: "๘",
      title: "答应与改期",
      blurb: "交谈继续下去后，常会出现「明天」「有空吗」「一起去」。没听懂时可以请对方重复；听懂之后，也要能答应或改期。",
      promise: "受到邀请时，能够答应或改期，而不是只说不会",
      dialogueId: "repair",
      tips: [
        "没有听懂时，可说 ขอโทษ ไม่เข้าใจ ช่วยพูดช้าๆ หน่อยได้ไหม。",
        "只说 ไม่ 会显得生硬。宜说明原因，例如 ไม่ว่าง。",
        "对方称赞泰语说得好时，可先说 ไม่เก่ง พูดได้นิดหน่อย，再道谢。"
      ],
      words: [
        { id: "r-again", thai: "อีกที", roman: "ìik-thii", zh: "再一次", tone: "低·中" },
        { id: "r-write", thai: "เขียน", roman: "khǐan", zh: "写", tone: "升" },
        { id: "r-help", thai: "ช่วย", roman: "chûay", zh: "帮忙 / 请", tone: "降" },
        { id: "r-tmr", thai: "พรุ่งนี้", roman: "phrûng-níi", zh: "明天", tone: "降·高" },
        { id: "r-free", thai: "ว่าง", roman: "wâang", zh: "有空", tone: "降" },
        { id: "r-together", thai: "ด้วยกัน", roman: "dûay-gan", zh: "一起", tone: "降·中" },
        { id: "r-later", thai: "วันหลัง", roman: "wan-lǎng", zh: "改天", tone: "中·低" },
        { id: "r-next", thai: "คราวหน้า", roman: "khraao-nâa", zh: "下次", tone: "中·降" },
        { id: "r-soft", thai: "นะ", roman: "ná", zh: "语气软化", tone: "高", tip: "没有具体词义。放在句尾，可使拒绝或请求不那么生硬。" },
        { id: "r-today", thai: "วันนี้", roman: "wan-níi", zh: "今天", tone: "中·高" },
        { id: "r-how", thai: "เป็นยังไง", roman: "bpen yang-ngai", zh: "怎么样", tone: "中·中·中", tip: "วันนี้เป็นยังไงบ้าง 用于询问近况。" }
      ],
      listens: [
        { thai: "พรุ่งนี้", roman: "phrûng-níi", zh: "明天", wordId: "r-tmr", options: ["明天", "今天", "后天", "改天"] },
        { thai: "วันนี้", roman: "wan-níi", zh: "今天", wordId: "r-today", options: ["今天", "明天", "现在", "上次"] },
        { thai: "ว่างไหมคะ", roman: "wâang mǎi khá", zh: "有空吗", wordId: "r-free", options: ["有空吗", "饿了吗", "懂了吗", "近吗"] },
        { thai: "ไปด้วยกันไหมคะ", roman: "bpai dûay-gan mǎi khá", zh: "一起去吗", wordId: "r-together", options: ["一起去吗", "自己去吗", "去哪里", "明天去"] },
        { thai: "ไว้วันหลังนะคะ", roman: "wái wan-lǎng ná khá", zh: "那就改天吧", wordId: "r-later", options: ["那就改天吧", "那就今天吧", "明天见", "没关系"] },
        { thai: "ช่วยเขียนให้หน่อยได้ไหมครับ", roman: "chûay khǐan hâi nòi dâai mǎi khráp", zh: "能帮我写一下吗", wordId: "r-write", options: ["能帮我写一下吗", "能说慢一点吗", "能再说一次吗", "能便宜一点吗"] },
        { thai: "วันนี้เป็นยังไงบ้างครับ", roman: "wan-níi bpen yang-ngai bâang khráp", zh: "今天怎么样", wordId: "r-how", options: ["今天怎么样", "今天去哪", "今天多少钱", "今天没空"] }
      ],
      sentences: [
        { thai: "พรุ่งนี้ไปด้วยกันไหม{q}", roman: "phrûng-níi bpai dûay-gan mǎi {qr}", zh: "明天一起去吗", options: ["明天一起去吗", "今天一起去吗", "明天去哪里", "明天有空吗"] },
        { thai: "พรุ่งนี้{i}ไม่ว่าง{p}", roman: "phrûng-níi {ir} mâi wâang {pr}", zh: "我明天没空", options: ["我明天没空", "我明天有空", "我明天不去吃饭", "明天再说一次"] },
        { thai: "ไว้วันหลังนะ{p}", roman: "wái wan-lǎng ná {pr}", zh: "那就改天吧", options: ["那就改天吧", "那就现在吧", "谢谢你", "我不明白"] },
        { thai: "ช่วยเขียนให้หน่อยได้ไหม{q}", roman: "chûay khǐan hâi nòi dâai mǎi {qr}", zh: "能帮我写一下吗", note: "地名和价格看文字，比只靠听更不容易出错。", options: ["能帮我写一下吗", "能说慢一点吗", "能便宜一点吗", "能一起去吗"] }
      ],
      speaks: [
        { zh: "说明明天没有空", thai: "พรุ่งนี้{i}ไม่ว่าง{p}", roman: "phrûng-níi {ir} mâi wâang {pr}", keys: ["ไม่ว่าง"] },
        { zh: "把约定改到以后", thai: "ไว้วันหลังนะ{p}", roman: "wái wan-lǎng ná {pr}", keys: ["วันหลัง"] },
        { zh: "请对方写下来", thai: "ช่วยเขียนให้หน่อยได้ไหม{q}", roman: "chûay khǐan hâi nòi dâai mǎi {qr}", keys: ["เขียน"] }
      ]
    }
  ];

  const dialogues = [
    {
      id: "greet",
      title: "与邻居问候",
      place: "公寓走廊",
      local: "隔壁的阿姨",
      localParticle: "female",
      goal: "问候并介绍姓名。对方称赞时，先谦辞，再道谢。",
      repair: {
        thai: "ไม่ค่อยเข้าใจค่ะ พูดอีกทีได้ไหมคะ",
        roman: "mâi khâwy khâo-jai khâ phûut ìik-thii dâai mǎi khá",
        zh: "我不太明白，再说一次好吗？"
      },
      lines: [
        { who: "local", thai: "สวัสดีค่ะ", roman: "sà-wàt-dii khâ", zh: "你好。" },
        {
          who: "you",
          prompt: "先问候，并说明自己叫马克",
          options: [
            { ok: true, thai: "สวัสดี{p} {i}ชื่อมาร์ค{p}", roman: "sà-wàt-dii {pr} {ir} chêu máak {pr}", zh: "你好，我叫马克", note: "包含问候、姓名和礼貌词，对方可以继续交谈。" },
            { ok: false, thai: "มาร์ค", roman: "máak", zh: "马克", note: "只说名字，对方无法判断这是在问候、在称呼别人，还是在自言自语。" },
            { ok: true, thai: "สวัสดี{p}", roman: "sà-wàt-dii {pr}", zh: "你好", note: "可以用来开始交谈。若以后还会见面，最好补上姓名。" }
          ]
        },
        { who: "local", thai: "ยินดีที่ได้รู้จักค่ะ คุณพูดภาษาไทยเก่งมาก", roman: "yin-dii thîi dâai rúu-jàk khâ khun phûut phaa-sǎa thai gèng mâak", zh: "很高兴认识你。你泰语说得很好。" },
        {
          who: "you",
          prompt: "对方在称赞，应如何回应",
          options: [
            { ok: true, thai: "ไม่เก่ง{p} พูดได้นิดหน่อย", roman: "mâi gèng {pr} phûut dâai nít-nòi", zh: "不好，只会一点点", note: "受到称赞时，本地人常先谦辞。这样说，交谈可以继续。" },
            { ok: true, thai: "ขอบคุณ{p}", roman: "khàwp-khun {pr}", zh: "谢谢", note: "这样回答是礼貌的。若希望更接近日常交谈，可先说 ไม่เก่ง，再道谢。" },
            { ok: false, thai: "ใช่ เก่งมาก", roman: "châi gèng mâak", zh: "对，很厉害", note: "顺着称赞自己，交谈会显得尴尬。" }
          ]
        },
        { who: "local", thai: "เก่งแล้วค่ะ", roman: "gèng láew khâ", zh: "已经很不错了。" },
        {
          who: "you",
          prompt: "结束这轮问候",
          options: [
            { ok: true, thai: "ขอบคุณ{p}", roman: "khàwp-khun {pr}", zh: "谢谢", note: "简短即可，意思已经完整。" },
            { ok: false, thai: "บาย", roman: "bai", zh: "bye", note: "朋友之间可以使用。初次见邻居时，ขอบคุณ 或 สวัสดี 更为妥当。" }
          ]
        }
      ],
      recap: [
        { thai: "สวัสดี{p}", zh: "开始问候" },
        { thai: "{i}ชื่อ...{p}", zh: "介绍姓名" },
        { thai: "ไม่เก่ง{p} พูดได้นิดหน่อย", zh: "受到称赞时谦辞" },
        { thai: "ขอบคุณ{p}", zh: "结束问候" }
      ]
    },
    {
      id: "taxi",
      title: "坐车去暹罗",
      place: "路边",
      local: "出租车司机",
      localParticle: "male",
      goal: "说明目的地，听懂大约价格，上车，到达后道谢。",
      repair: {
        thai: "ไม่ค่อยเข้าใจครับ พูดอีกทีได้ไหมครับ",
        roman: "mâi khâwy khâo-jai khráp phûut ìik-thii dâai mǎi khráp",
        zh: "我不太明白，再说一次好吗？"
      },
      lines: [
        { who: "local", thai: "สวัสดีครับ จะไปไหนครับ", roman: "sà-wàt-dii khráp jà bpai nǎi khráp", zh: "你好，去哪里？" },
        {
          who: "you",
          prompt: "要去暹罗",
          options: [
            { ok: true, thai: "สวัสดี{p} ไปสยามได้ไหม{q}", roman: "sà-wàt-dii {pr} bpai sà-yǎam dâai mǎi {qr}", zh: "你好，去暹罗可以吗", note: "ไป 加地点，再加 ได้ไหม，司机就能知道是在询问能否前往。" },
            { ok: false, thai: "สยาม", roman: "sà-yǎam", zh: "暹罗", note: "只说地名，对方仍需追问。应补上 ไป 和 ได้ไหม。" },
            { ok: true, thai: "ไปสยาม{p}", roman: "bpai sà-yǎam {pr}", zh: "去暹罗", note: "这样说可以使用。加上 ได้ไหม，语气更接近商量。" }
          ]
        },
        { who: "local", thai: "ได้ครับ ประมาณหนึ่งร้อยบาทครับ ขึ้นเลยครับ", roman: "dâai khráp bprà-maan nùeng ráwy bàat khráp khûn loei khráp", zh: "可以。大概一百铢。上车吧。" },
        {
          who: "you",
          prompt: "价格可以接受，准备出发",
          options: [
            { ok: true, thai: "ถ้างั้นไปเลย{p}", roman: "thâa-ngán bpai loei {pr}", zh: "那走吧", note: "ถ้างั้น 表示「那就」。用在听到价格之后很合适。" },
            { ok: false, thai: "แพงไป ลดได้ไหม{q}", roman: "phaeng bpai lót dâai mǎi {qr}", zh: "太贵了，能少吗", note: "市场可以议价。出租车通常按计价器收费，或先说明大约价格。若不合适，换一辆比议价更常见。" },
            { ok: true, thai: "ไปเลย{p} ขอบคุณ{p}", roman: "bpai loei {pr} khàwp-khun {pr}", zh: "走吧，谢谢", note: "简短，意思清楚。" }
          ]
        },
        { who: "local", thai: "ถึงแล้วครับ", roman: "thǔeng láew khráp", zh: "到了。" },
        {
          who: "you",
          prompt: "下车并结束交谈",
          options: [
            { ok: true, thai: "ขอบคุณ{p}", roman: "khàwp-khun {pr}", zh: "谢谢", note: "到达后道谢即可。若要指定停车位置，再说 จอดตรงนี้ได้ไหม。" },
            { ok: true, thai: "ขอบคุณ{p} จอดตรงนี้ได้ไหม{q}", roman: "khàwp-khun {pr} jàwt dtrong-níi dâai mǎi {qr}", zh: "谢谢，停这里可以吗", note: "已经确定停车位置时，用这句。" }
          ]
        }
      ],
      recap: [
        { thai: "ไปสยามได้ไหม{q}", zh: "说明目的地" },
        { thai: "ประมาณหนึ่งร้อยบาท", zh: "听懂大约价格" },
        { thai: "ถ้างั้นไปเลย{p}", zh: "同意出发" },
        { thai: "ถึงแล้ว", zh: "听懂「到了」" }
      ]
    },
    {
      id: "food",
      title: "在饭摊点餐",
      place: "街边饭摊",
      local: "摊主",
      localParticle: "female",
      goal: "点菜、说明不辣、要一瓶水，并听懂对方递上食物时的用语。",
      repair: {
        thai: "ไม่ค่อยเข้าใจค่ะ พูดอีกทีได้ไหมคะ",
        roman: "mâi khâwy khâo-jai khâ phûut ìik-thii dâai mǎi khá",
        zh: "我不太明白，再说一次好吗？"
      },
      lines: [
        { who: "local", thai: "สวัสดีค่ะ รับอะไรดีคะ", roman: "sà-wàt-dii khâ ráp à-rai dii khá", zh: "你好，想要点什么？" },
        {
          who: "you",
          prompt: "要一盘不辣的鸡肉炒饭",
          options: [
            { ok: true, thai: "ขอข้าวผัดไก่หนึ่งจาน{q} ไม่เผ็ดนะ{p}", roman: "khǎw khâao-phàt gài nùeng jaan {qr} mâi phèt ná {pr}", zh: "请来一盘鸡肉炒饭，不要辣", note: "ขอ 之后依次说出菜名、数量和辣度，摊主就不必再追问。" },
            { ok: false, thai: "ข้าวผัดไก่", roman: "khâao-phàt gài", zh: "鸡肉炒饭", note: "只说菜名，作用只相当于读菜单。点餐应说出 ขอ 或 เอา。" },
            { ok: true, thai: "เอาข้าวผัดไก่{p} ไม่เผ็ด", roman: "ao khâao-phàt gài {pr} mâi phèt", zh: "要鸡肉炒饭，不辣", note: "这样说可以使用。若要更清楚，可补上 หนึ่งจาน。" }
          ]
        },
        { who: "local", thai: "ได้ค่ะ น้ำอะไรดีคะ", roman: "dâai khâ náam à-rai dii khá", zh: "好。喝什么？" },
        {
          who: "you",
          prompt: "要一瓶冰水",
          options: [
            { ok: true, thai: "น้ำเปล่าเย็นหนึ่งขวด{p}", roman: "náam-bplào yen nùeng khùat {pr}", zh: "一瓶冰的白开水", note: "饮料宜说全：种类、是否加冰、数量。" },
            { ok: false, thai: "น้ำ", roman: "náam", zh: "水", note: "范围太宽。加冰、加热还是加糖，对方仍需追问。" }
          ]
        },
        { who: "local", thai: "เชิญค่ะ อร่อยไหมคะ", roman: "chern khâ à-ròi mǎi khá", zh: "请用。好吃吗？" },
        {
          who: "you",
          prompt: "好吃，准备结账",
          options: [
            { ok: true, thai: "อร่อยมาก{p} เช็คบิลได้ไหม{q}", roman: "à-ròi mâak {pr} chék-bin dâai mǎi {qr}", zh: "很好吃，可以买单吗", note: "先回答「好不好吃」，再提出结账。" },
            { ok: false, thai: "เช็คบิล", roman: "chék-bin", zh: "买单", note: "意思大致清楚，但没有回答「好不好吃」，语气也偏生硬。宜补上 อร่อย 和 ได้ไหม。" }
          ]
        }
      ],
      recap: [
        { thai: "รับอะไรดีคะ", zh: "听到这句即可点餐" },
        { thai: "ขอ...หนึ่งจาน ไม่เผ็ดนะ{p}", zh: "菜名、数量、辣度" },
        { thai: "เชิญค่ะ", zh: "递上食物时对方会说" },
        { thai: "เช็คบิลได้ไหม{q}", zh: "买单" }
      ]
    },
    {
      id: "market",
      title: "在夜市议价",
      place: "夜市摊位",
      local: "卖纪念品的阿姨",
      localParticle: "female",
      goal: "询问价格，说明偏贵，提出一个数字，并确认购买。",
      repair: {
        thai: "ไม่ค่อยเข้าใจค่ะ พูดอีกทีได้ไหมคะ",
        roman: "mâi khâwy khâo-jai khâ phûut ìik-thii dâai mǎi khá",
        zh: "我不太明白，再说一次好吗？"
      },
      lines: [
        { who: "local", thai: "สวัสดีค่ะ สนใจอะไรคะ", roman: "sà-wàt-dii khâ sǒn-jai à-rai khá", zh: "你好，看点什么？" },
        {
          who: "you",
          prompt: "拿起一件物品，询问价格",
          options: [
            { ok: true, thai: "อันนี้เท่าไหร่{q}", roman: "an-níi thâo-rài {qr}", zh: "这个多少钱", note: "指着物品询问，是市场里最稳妥的第一句。" },
            { ok: false, thai: "ลดได้ไหม{q}", roman: "lót dâai mǎi {qr}", zh: "能便宜吗", note: "尚未听到价格就开始议价，对方难以回应。应先问 เท่าไหร่。" }
          ]
        },
        { who: "local", thai: "ชิ้นละห้าสิบบาทค่ะ", roman: "chín lá hâa-sìp bàat khâ", zh: "每件五十铢。" },
        {
          who: "you",
          prompt: "希望价格低一些",
          options: [
            { ok: true, thai: "แพงไปหน่อย{p} ลดได้ไหม{q}", roman: "phaeng bpai nòi {pr} lót dâai mǎi {qr}", zh: "有点贵，能少吗", note: "先评价，再提出请求。摊主对这个顺序很熟悉。" },
            { ok: true, thai: "สี่สิบได้ไหม{q}", roman: "sìi-sìp dâai mǎi {qr}", zh: "四十可以吗", note: "可以直接提出价格，语气宜轻，不宜像质问。" },
            { ok: false, thai: "ฟรีได้ไหม{q}", roman: "frii dâai mǎi {qr}", zh: "可以免费吗", note: "第一次开口就要求免费，对方会认为并非认真购买。" }
          ]
        },
        { who: "local", thai: "สี่สิบได้ค่ะ เอาไหมคะ", roman: "sìi-sìp dâai khâ ao mǎi khá", zh: "四十可以。要吗？" },
        {
          who: "you",
          prompt: "购买两件",
          options: [
            { ok: true, thai: "ได้{p} เอาสองชิ้น", roman: "dâai {pr} ao sǎawng chín", zh: "好，要两件", note: "先表示同意，再说明数量。" },
            { ok: false, thai: "สอง", roman: "sǎawng", zh: "二", note: "只说数字不够清楚。说出 เอาสองชิ้น，对方才知道要两件。" }
          ]
        },
        { who: "local", thai: "แปดสิบบาทค่ะ ขอบคุณค่ะ", roman: "bpàet-sìp bàat khâ khàwp-khun khâ", zh: "八十铢。谢谢。" }
      ],
      recap: [
        { thai: "อันนี้เท่าไหร่{q}", zh: "先询问价格" },
        { thai: "ชิ้นละ...", zh: "听懂「每件」" },
        { thai: "แพงไปหน่อย ลดได้ไหม{q}", zh: "再提出议价" },
        { thai: "เอาสองชิ้น", zh: "说明要几件" }
      ]
    },
    {
      id: "repair",
      title: "没听清时的邀约",
      place: "咖啡馆",
      local: "刚认识的朋友",
      localParticle: "female",
      goal: "没有听懂时先请对方重复。听懂之后，可以答应，也可以改期。",
      repair: {
        thai: "ไม่ค่อยเข้าใจค่ะ พูดอีกทีได้ไหมคะ",
        roman: "mâi khâwy khâo-jai khâ phûut ìik-thii dâai mǎi khá",
        zh: "我不太明白，再说一次好吗？"
      },
      lines: [
        { who: "local", thai: "พรุ่งนี้ไปกินข้าวด้วยกันไหมคะ", roman: "phrûng-níi bpai gin khâao dûay-gan mǎi khá", zh: "明天一起去吃饭吗？" },
        {
          who: "you",
          prompt: "没有听清",
          options: [
            { ok: true, thai: "ขอโทษ{p} ไม่เข้าใจ ช่วยพูดช้าๆ หน่อยได้ไหม{q}", roman: "khǎw-thôht {pr} mâi khâo-jai chûay phûut cháa-cháa nòi dâai mǎi {qr}", zh: "对不起，我不明白，能说慢一点吗", note: "说出这句后，对方通常会放慢。这比猜测着说 ใช่ 更为稳妥。" },
            { ok: false, thai: "ใช่{p}", roman: "châi {pr}", zh: "是的", note: "没有听懂时不宜猜「是」，否则可能答应一件并不清楚的事。" },
            { ok: true, thai: "พูดอีกทีได้ไหม{q}", roman: "phûut ìik-thii dâai mǎi {qr}", zh: "能再说一次吗", note: "可以使用。若对方仍然说得很快，可改说 ช้าๆ。" }
          ]
        },
        { who: "local", thai: "พรุ่งนี้ ไปกินข้าว ด้วยกัน ไหมคะ", roman: "phrûng-níi bpai gin khâao dûay-gan mǎi khá", zh: "明天，一起，吃饭，吗？" },
        {
          who: "you",
          prompt: "明天没有空",
          options: [
            { ok: true, thai: "พรุ่งนี้{i}ไม่ว่าง{p} ไว้วันหลังนะ{p}", roman: "phrûng-níi {ir} mâi wâang {pr} wái wan-lǎng ná {pr}", zh: "我明天没空，改天吧", note: "拒绝时说明以后再约，交谈可以继续。" },
            { ok: true, thai: "ได้{p} ไปด้วยกัน", roman: "dâai {pr} bpai dûay-gan", zh: "好，一起去", note: "如果确实有空，可以直接答应。" },
            { ok: false, thai: "ไม่", roman: "mâi", zh: "不", note: "只说 ไม่ 过于生硬。宜说明 ไม่ว่าง，或提出 วันหลัง。" }
          ]
        },
        { who: "local", thai: "ได้ค่ะ ไว้คราวหน้านะคะ", roman: "dâai khâ wái khraao-nâa ná khá", zh: "好，那就下次。" },
        {
          who: "you",
          prompt: "结束这次交谈",
          options: [
            { ok: true, thai: "ได้{p} ขอบคุณนะ{p}", roman: "dâai {pr} khàwp-khun ná {pr}", zh: "好，谢谢", note: "นะ 可使道谢的语气不那么生硬。" },
            { ok: false, thai: "บาย", roman: "bai", zh: "bye", note: "可以结束交谈，但没有回应对方所说的「下次」。" }
          ]
        }
      ],
      recap: [
        { thai: "ไม่เข้าใจ ช่วยพูดช้าๆ หน่อยได้ไหม{q}", zh: "没听懂时请对方放慢" },
        { thai: "พรุ่งนี้{i}ไม่ว่าง{p}", zh: "说明没有空，不宜只说不" },
        { thai: "ไว้วันหลังนะ{p}", zh: "改期" },
        { thai: "ไว้คราวหน้า", zh: "听懂「下次」" }
      ]
    }
  ];

  const phrases = [
    {
      id: "open",
      title: "开始交谈",
      items: [
        { thai: "สวัสดี{p}", roman: "sà-wàt-dii {pr}", zh: "你好 / 再见", note: "对陌生人、店员和邻居，宜先说这句。" },
        { thai: "{i}ชื่อ...{p}", roman: "{ir} chêu ... {pr}", zh: "我叫……", note: "姓名用自己的。声调暂时不准也可以，礼貌词不宜省略。" },
        { thai: "คุณชื่ออะไร{q}", roman: "khun chêu à-rai {qr}", zh: "你叫什么", note: "对方回答后，可说 ยินดีที่ได้รู้จัก{p}。" },
        { thai: "สบายดีไหม{q}", roman: "sà-baai dii mǎi {qr}", zh: "你好吗", note: "用于比较熟悉的人。第一次买东西时不必询问。" }
      ]
    },
    {
      id: "fix",
      title: "没有听懂时",
      items: [
        { thai: "ขอโทษ{p} ไม่เข้าใจ", roman: "khǎw-thôht {pr} mâi khâo-jai", zh: "对不起，我不明白", note: "应先停下来说明。点头表示已经听懂，后面会更难回应。" },
        { thai: "ช่วยพูดช้าๆ หน่อยได้ไหม{q}", roman: "chûay phûut cháa-cháa nòi dâai mǎi {qr}", zh: "能说慢一点吗", note: "本地人通常愿意放慢语速。" },
        { thai: "พูดอีกทีได้ไหม{q}", roman: "phûut ìik-thii dâai mǎi {qr}", zh: "能再说一次吗", note: "可以与上一句连着说。" },
        { thai: "ช่วยเขียนให้หน่อยได้ไหม{q}", roman: "chûay khǐan hâi nòi dâai mǎi {qr}", zh: "能写一下吗", note: "地名、站名和价格，看文字更准确。" }
      ]
    },
    {
      id: "eat",
      title: "吃饭",
      items: [
        { thai: "ขอเมนูหน่อย{q}", roman: "khǎw meh-nuu nòi {qr}", zh: "请给我菜单", note: "没有菜单的摊位，可直接说 ขอ 加菜名。" },
        { thai: "ไม่เผ็ดนะ{p}", roman: "mâi phèt ná {pr}", zh: "不要辣", note: "想要微辣时说 เผ็ดน้อย{p}。" },
        { thai: "อร่อยมาก{p}", roman: "à-ròi mâak {pr}", zh: "很好吃", note: "对方问 อร่อยไหม 时，用这句回答。" },
        { thai: "เช็คบิลได้ไหม{q}", roman: "chék-bin dâai mǎi {qr}", zh: "可以买单吗", note: "也可以说 เก็บตังค์ได้ไหม{q}。" }
      ]
    },
    {
      id: "move",
      title: "问路坐车",
      items: [
        { thai: "...อยู่ที่ไหน{q}", roman: "... yùu thîi-nǎi {qr}", zh: "……在哪里", note: "地点放在句首。" },
        { thai: "ไป...ได้ไหม{q}", roman: "bpai ... dâai mǎi {qr}", zh: "去……可以吗", note: "对出租车司机和摩托车司机都可以使用。" },
        { thai: "เลี้ยวซ้าย / เลี้ยวขวา / ตรงไป", roman: "lîao sáai / lîao khwǎa / dtrong bpai", zh: "左 / 右 / 直走", note: "三个方向宜一起听辨，不宜只记其中一个。" },
        { thai: "จอดตรงนี้ได้ไหม{q}", roman: "jàwt dtrong-níi dâai mǎi {qr}", zh: "停这里可以吗", note: "到达后再加 ขอบคุณ{p}。" }
      ]
    },
    {
      id: "buy",
      title: "问价",
      items: [
        { thai: "อันนี้เท่าไหร่{q}", roman: "an-níi thâo-rài {qr}", zh: "这个多少钱", note: "先指出物品，再询问。" },
        { thai: "แพงไปหน่อย{p}", roman: "phaeng bpai nòi {pr}", zh: "有点贵", note: "议价的第一句先不报数字。" },
        { thai: "ลดได้ไหม{q}", roman: "lót dâai mǎi {qr}", zh: "能少一点吗", note: "紧接在上一句之后。" },
        { thai: "เอาอันนี้{p}", roman: "ao an-níi {pr}", zh: "我要这个", note: "决定购买后再说。" }
      ]
    },
    {
      id: "close",
      title: "结束交谈",
      items: [
        { thai: "ขอบคุณ{p}", roman: "khàwp-khun {pr}", zh: "谢谢", note: "用于店员、司机，以及帮助过自己的人。" },
        { thai: "ไม่เป็นไร{p}", roman: "mâi-bpen-rai {pr}", zh: "没关系", note: "对方道谢或道歉时，用这句回应。" },
        { thai: "ไว้วันหลังนะ{p}", roman: "wái wan-lǎng ná {pr}", zh: "那就改天", note: "无法赴约时使用，表示以后再约。" },
        { thai: "แล้วเจอกัน{p}", roman: "láew jer gan {pr}", zh: "回头见", note: "用于道别，并表示以后还会见面。" }
      ]
    }
  ];

  const plans = {
    travel: ["tones", "polite", "numbers", "taxi", "food", "market", "survive", "repair", "taxi", "market", "food", "numbers", "repair", "tones"],
    life: ["tones", "polite", "survive", "food", "numbers", "market", "repair", "taxi", "food", "survive", "market", "repair", "polite", "tones"],
    chat: ["tones", "polite", "survive", "repair", "food", "survive", "market", "numbers", "repair", "taxi", "polite", "food", "repair", "tones"]
  };

  const planNotes = {
    travel: "旅行计划先听准声调、礼貌词和数字，再练习乘车、点餐和问价。请对方重复的练习，安排在能够问路之后。",
    life: "生活计划从问候和「请说慢一点」开始，接着练习吃饭和买东西。交通用语安排在日常句子之后。",
    chat: "交谈计划宜尽早练习没听懂时的应对，以及改期。能够说出「没有空、改天、只会一点点」之后，与本地人的交谈才容易继续。"
  };

  const goals = [
    { id: "travel", title: "旅行应对", text: "乘车、点餐、问价、问路。听懂对方的下一句，自己也能把意思说完整。" },
    { id: "life", title: "在当地生活", text: "邻居、饭摊和市场。每天练习几句可以反复使用的完整句子。" },
    { id: "chat", title: "与本地人交谈", text: "礼貌词、谦辞、邀约和改期。重点是听懂对方的话，并作出回应。" }
  ];

  function lesson(id) {
    return lessons.find(function (item) { return item.id === id; }) || null;
  }

  function dialogue(id) {
    return dialogues.find(function (item) { return item.id === id; }) || null;
  }

  function allWords() {
    const list = [];
    lessons.forEach(function (item) {
      item.words.forEach(function (word) {
        list.push(Object.assign({}, word, { lessonId: item.id, lessonTitle: item.title }));
      });
    });
    return list;
  }

  window.THAI = {
    lessons: lessons,
    dialogues: dialogues,
    phrases: phrases,
    plans: plans,
    planNotes: planNotes,
    goals: goals,
    lesson: lesson,
    dialogue: dialogue,
    allWords: allWords,
    word: function (id) {
      return allWords().find(function (item) { return item.id === id; }) || null;
    }
  };
})();
