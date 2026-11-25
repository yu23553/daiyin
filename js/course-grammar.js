(function () {
  if (!window.COURSE) return;
  function line(th, ro, zh, kind) { return { th: th, ro: ro, zh: zh, kind: kind || "s" }; }
  function turn(g, th, ro, zh, kind) { var item = { g: g, th: th, ro: ro, zh: zh }; if (kind) item.kind = kind; return item; }
  var added = [
    {
      id: "ls-gr-polite-1",
      level: "grammar",
      title: "礼貌词 · 第 1 课",
      aim: "男性句尾用 ครับ；女性陈述用 ค่ะ，问句用 คะ。对陌生人和长辈不宜省略。",
      words: ["gr-polite-m", "gr-polite-f", "gr-polite-fq", "gr-reg-phom", "gr-reg-chan", "a1-hello"],
      talk: [
      turn("m", "สวัสดีครับ", "sà-wàt-dii khráp", "你好。（男）"),
      turn("f", "สวัสดีค่ะ", "sà-wàt-dii khâ", "你好。（女）"),
      turn("f", "สบายดีไหมคะ", "sà-baai dii mǎi khá", "你好吗？（女问）", "q"),
      turn("m", "สบายดีครับ", "sà-baai dii khráp", "很好。（男）")
      ],
      lines: [
      line("ขอบคุณครับ", "khɔ̀ɔp-khun khráp", "谢谢。（男）", "s"),
      line("ขอบคุณค่ะ", "khɔ̀ɔp-khun khâ", "谢谢。（女）", "s"),
      line("ใช่ไหมคะ", "châi mǎi khá", "是吗？（女问）", "q")
      ]
    },
    {
      id: "ls-gr-neg-1",
      level: "grammar",
      title: "否定 · 第 1 课",
      aim: "ไม่ 否定陈述；อย่า 表示禁止或劝阻。อย่า 不用于单纯事实否定。",
      words: ["gr-neg", "gr-dont", "a1d-go", "a1-eat", "a1d-open", "a1d-speak"],
      talk: [
      turn("f", "ไม่ไปค่ะ", "mâi bpai khâ", "不去。"),
      turn("m", "อย่าเปิด{p}", "yàa bpèrt {pr}", "别开。"),
      turn("f", "ไม่พูดดัง{p}", "mâi phûut dang {pr}", "不大声说。"),
      turn("m", "อย่าลืมกุญแจ{p}", "yàa lʉʉm gun-jɛɛ {pr}", "别忘了钥匙。")
      ],
      lines: [
      line("ไม่กินเผ็ด{p}", "mâi gin phèt {pr}", "不吃辣。", "s"),
      line("อย่าไป{p}", "yàa bpai {pr}", "别去。", "s"),
      line("ยังไม่เสร็จ{p}", "yang mâi sèt {pr}", "还没做完。", "s")
      ]
    },
    {
      id: "ls-gr-q-1",
      level: "grammar",
      title: "是非问 · 第 1 课",
      aim: "ไหม 构成是非问；或用 หรือ 表示确认/选择。回答可用 ใช่ / ไม่ / ได้。",
      words: ["gr-q-mai", "gr-q-rue", "a1d-yes", "a1d-no", "a1d-ok", "a1d-hungry"],
      talk: [
      turn("f", "หิวไหม{p}", "hǐu mǎi {pr}", "饿吗？", "q"),
      turn("m", "หิว{p}", "hǐu {pr}", "饿。"),
      turn("f", "ไปหรือเปล่า{p}", "bpai rʉ̌ʉ bplào {pr}", "去还是不去？", "q"),
      turn("m", "ไปได้{p}", "bpai dâai {pr}", "可以去。")
      ],
      lines: [
      line("ว่างไหม{p}", "wâang mǎi {pr}", "有空吗？", "q"),
      line("ใช่ไหม{p}", "châi mǎi {pr}", "是吗？", "q"),
      line("หรือยัง{p}", "rʉ̌ʉ yang {pr}", "好了没有？", "q")
      ]
    },
    {
      id: "ls-gr-q-2",
      level: "grammar",
      title: "疑问词 · 第 1 课",
      aim: "อะไร / ที่ไหน / เมื่อไร / ใคร 放在相应信息缺口处；语序通常不变。",
      words: ["gr-q-what", "gr-q-where", "gr-q-when", "gr-q-who", "a1-name", "a1d-live"],
      talk: [
      turn("m", "นี่อะไร{p}", "nîi à-rai {pr}", "这是什么？", "q"),
      turn("f", "อยู่ที่ไหน{p}", "yùu thîi-nǎi {pr}", "在哪里？", "q"),
      turn("m", "เมื่อไรไป{p}", "mʉ̂a-rai bpai {pr}", "什么时候去？", "q"),
      turn("f", "ใครมา{p}", "khrai maa {pr}", "谁来？", "q")
      ],
      lines: [
      line("ชื่ออะไร{p}", "chʉ̂ʉ à-rai {pr}", "叫什么名字？", "q"),
      line("ไปที่ไหน{p}", "bpai thîi-nǎi {pr}", "去哪里？", "q"),
      line("ใครบอก{p}", "khrai bɔ̀ɔk {pr}", "谁说的？", "q")
      ]
    },
    {
      id: "ls-gr-q-3",
      level: "grammar",
      title: "疑问词 · 第 2 课",
      aim: "ทำไม 问原因；ยังไง 问方式；กี่ 问数量，后接量词或时间单位。",
      words: ["gr-q-why", "gr-q-how", "gr-q-howmany", "a2d-because", "a1d-many", "a1d-wait"],
      talk: [
      turn("f", "ทำไมช้า{p}", "tham-mai cháa {pr}", "为什么慢？", "q"),
      turn("m", "เพราะรถติด{p}", "phrɔ́ rót-dtìt {pr}", "因为堵车。"),
      turn("f", "ไปยังไง{p}", "bpai yang-ngai {pr}", "怎么去？", "q"),
      turn("m", "รอกี่นาที{p}", "rɔɔ gìi naa-thii {pr}", "等几分钟？", "q")
      ],
      lines: [
      line("ทำไมไม่มา{p}", "tham-mai mâi maa {pr}", "为什么不来？", "q"),
      line("ทำยังไงดี{p}", "tham yang-ngai dii {pr}", "怎么办好？", "q"),
      line("กี่คน{p}", "gìi khon {pr}", "几个人？", "q")
      ]
    },
    {
      id: "ls-gr-clf-1",
      level: "grammar",
      title: "量词 · 第 1 课",
      aim: "泰语常说「名词 + 数词 + 量词」。人用 คน，书用 เล่ม，动物/衣服常用 ตัว。",
      words: ["gr-clf-khon", "gr-clf-lem", "gr-clf-tua", "gr-clf-an", "a1d-friend", "a1d-child"],
      talk: [
      turn("f", "เพื่อนสองคน{p}", "phʉ̂an sɔ̌ɔng khon {pr}", "两个朋友。"),
      turn("m", "หนังสือหนึ่งเล่ม{p}", "nǎng-sʉ̌ʉ nʉ̀ng lêm {pr}", "一本书。"),
      turn("f", "แมวสองตัว{p}", "mɛɛo sɔ̌ɔng dtua {pr}", "两只猫。"),
      turn("m", "อันนี้หนึ่งอัน{p}", "an-níi nʉ̀ng an {pr}", "这个要一个。")
      ],
      lines: [
      line("สามคน{p}", "sǎam khon {pr}", "三个人。", "s"),
      line("กี่เล่ม{p}", "gìi lêm {pr}", "几本？", "q"),
      line("เสื้อสองตัว{p}", "sʉ̂a sɔ̌ɔng dtua {pr}", "两件衣服。", "s")
      ]
    },
    {
      id: "ls-gr-clf-2",
      level: "grammar",
      title: "量词 · 第 2 课",
      aim: "ใบ 常用于张/片状；问「几个」时用 กี่ + 量词。点餐也常用量词。",
      words: ["gr-clf-bai", "gr-clf-chan", "gr-q-howmany", "a1-water", "a1-rice", "a1d-egg"],
      talk: [
      turn("f", "น้ำสองใบ{p}", "náam sɔ̌ɔng bai {pr}", "两瓶/杯水（视容器）。"),
      turn("m", "ข้าวหนึ่งจาน{p}", "khâao nʉ̀ng jaan {pr}", "一盘饭。"),
      turn("f", "ไข่กี่ใบ{p}", "khài gìi bai {pr}", "几个蛋？", "q"),
      turn("m", "ห้าใบ{p}", "hâa bai {pr}", "五个。")
      ],
      lines: [
      line("กี่ใบ{p}", "gìi bai {pr}", "几张/个？", "q"),
      line("อีกหนึ่งจาน{p}", "ìik nʉ̀ng jaan {pr}", "再来一盘。", "s"),
      line("ใบนี้{p}", "bai níi {pr}", "这一张。", "s")
      ]
    },
    {
      id: "ls-gr-asp-1",
      level: "grammar",
      title: "体貌 · 第 1 课",
      aim: "แล้ว 表完成/变化；ยัง / ยังไม่ 表仍在持续或尚未；กำลัง 表正在进行。",
      words: ["gr-asp-laeo", "gr-asp-yang", "gr-asp-yangmai", "gr-asp-kamlang", "a1-eat", "a1d-go"],
      talk: [
      turn("m", "กินแล้ว{p}", "gin lɛ́ɛo {pr}", "吃过了。"),
      turn("f", "ยังไม่ไป{p}", "yang mâi bpai {pr}", "还没去。"),
      turn("m", "กำลังเรียน{p}", "gam-lang rian {pr}", "正在学习。"),
      turn("f", "ยังรออยู่{p}", "yang rɔɔ yùu {pr}", "还在等。")
      ],
      lines: [
      line("เสร็จแล้ว{p}", "sèt lɛ́ɛo {pr}", "做完了。", "s"),
      line("ยังไม่ถึง{p}", "yang mâi thʉ̌ng {pr}", "还没到。", "s"),
      line("กำลังพูด{p}", "gam-lang phûut {pr}", "正在说。", "s")
      ]
    },
    {
      id: "ls-gr-asp-2",
      level: "grammar",
      title: "体貌 · 第 2 课",
      aim: "จะ 表将要；เคย 表曾经有过经历。เคย 常与 ไหม 连用询问经历。",
      words: ["gr-asp-ja", "gr-asp-khoei", "a1d-tomorrow", "b1d-never", "a1d-go", "a1d-know"],
      talk: [
      turn("f", "จะไปพรุ่งนี้{p}", "jà bpai phrûng-níi {pr}", "明天要去。"),
      turn("m", "เคยไปไหม{p}", "khəəi bpai mǎi {pr}", "去过吗？", "q"),
      turn("f", "ไม่เคย{p}", "mâi khəəi {pr}", "没去过。"),
      turn("m", "จะบอกทีหลัง{p}", "jà bɔ̀ɔk thii lǎng {pr}", "稍后再说。")
      ],
      lines: [
      line("จะทำอะไร{p}", "jà tham à-rai {pr}", "要做什么？", "q"),
      line("เคยเห็น{p}", "khəəi hěn {pr}", "见过。", "s"),
      line("ไม่เคยรู้{p}", "mâi khəəi rúu {pr}", "从没听说过。", "s")
      ]
    },
    {
      id: "ls-gr-serial-1",
      level: "grammar",
      title: "串动与方向 · 第 1 课",
      aim: "ไป / มา 可表方向或结果趋向；เอา…ไป 表示把某物带走。多个动词常直接连用。",
      words: ["gr-dir-pai", "gr-dir-maa", "gr-serial-ao", "a1d-take", "a1d-give", "a1d-return"],
      talk: [
      turn("f", "เอากุญแจไป{p}", "ao gun-jɛɛ bpai {pr}", "把钥匙带走。"),
      turn("m", "เอาน้ำมา{p}", "ao náam maa {pr}", "把水拿来。"),
      turn("f", "เดินไปซื้อ{p}", "dəən bpai sʉ́ʉ {pr}", "走去买。"),
      turn("m", "กลับมาแล้ว{p}", "glàp maa lɛ́ɛo {pr}", "已经回来了。")
      ],
      lines: [
      line("เอาไปให้{p}", "ao bpai hâi {pr}", "拿去给。", "s"),
      line("พาไปด้วย{p}", "phaa bpai dûai {pr}", "顺便带去。", "s"),
      line("วิ่งมา{p}", "wîng maa {pr}", "跑过来。", "s")
      ]
    },
    {
      id: "ls-gr-hai-1",
      level: "grammar",
      title: "使役 ให้ · 第 1 课",
      aim: "ให้ 可表给予、受益（替别人做），或使役（让某人做）。注意与 ขอ 请求连用。",
      words: ["gr-serial-hai", "a1d-help", "a1d-please", "a1d-open", "a1d-wait", "a2d-call"],
      talk: [
      turn("f", "ช่วยเปิดให้หน่อย{p}", "chûai bpèrt hâi nɔ̀i {pr}", "请帮我打开。"),
      turn("m", "ให้เขารอ{p}", "hâi khǎo rɔɔ {pr}", "让他等。"),
      turn("f", "ขอให้โทรมา{p}", "khɔ̌ɔ hâi thoo maa {pr}", "请让（对方）打来。"),
      turn("m", "ทำให้เสร็จ{p}", "tham hâi sèt {pr}", "做到完成。")
      ],
      lines: [
      line("ให้ฉันดู{p}", "hâi chǎn duu {pr}", "让我看看。", "s"),
      line("ทำให้ชัด{p}", "tham hâi chát {pr}", "弄清楚。", "s"),
      line("อย่าให้สาย{p}", "yàa hâi sǎai {pr}", "别让（事情）延误。", "s")
      ]
    },
    {
      id: "ls-gr-comp-1",
      level: "grammar",
      title: "比较 · 第 1 课",
      aim: "กว่า 表比较级；ที่สุด 表最高级。มากกว่า / น้อยกว่า 常搭配程度。",
      words: ["gr-comp-kwa", "gr-comp-thisut", "gr-comp-maak", "a1d-good", "a1d-expensive", "a1d-near"],
      talk: [
      turn("f", "อันนี้ดีกว่า{p}", "an-níi dii gwàa {pr}", "这个更好。"),
      turn("m", "แพงกว่านั้น{p}", "phɛɛng gwàa nán {pr}", "比那个贵。"),
      turn("f", "ใกล้ที่สุด{p}", "glâi thîi-sùt {pr}", "最近。"),
      turn("m", "ชอบมากกว่า{p}", "chɔ̂ɔp mâak gwàa {pr}", "更喜欢。")
      ],
      lines: [
      line("ถูกกว่าไหม{p}", "thùuk gwàa mǎi {pr}", "更便宜吗？", "q"),
      line("ดีที่สุด{p}", "dii thîi-sùt {pr}", "最好。", "s"),
      line("น้อยกว่านี้{p}", "nɔ́ɔi gwàa níi {pr}", "比这个少。", "s")
      ]
    },
    {
      id: "ls-gr-clause-1",
      level: "grammar",
      title: "从句 · 第 1 课",
      aim: "ที่ 引导定语从句；ว่า 引导「说/想/知道」后的内容从句。",
      words: ["gr-rel-thi", "gr-comp-waa", "a1d-know", "a1d-see", "b1d-think", "a1d-person"],
      talk: [
      turn("f", "คนที่มาคือเพื่อน{p}", "khon thîi maa khʉʉ phʉ̂an {pr}", "来的人是朋友。"),
      turn("m", "รู้ว่าเขาไปแล้ว{p}", "rúu wâa khǎo bpai lɛ́ɛo {pr}", "知道他已经走了。"),
      turn("f", "คิดว่าดี{p}", "khít wâa dii {pr}", "觉得不错。"),
      turn("m", "บ้านที่เงียบ{p}", "bâan thîi ngîap {pr}", "安静的那间房。")
      ],
      lines: [
      line("ที่ฉันชอบ{p}", "thîi chǎn chɔ̂ɔp {pr}", "我喜欢的。", "s"),
      line("บอกว่ามาช้า{p}", "bɔ̀ɔk wâa maa cháa {pr}", "说是来晚了。", "s"),
      line("เห็นว่าใช่{p}", "hěn wâa châi {pr}", "看来是对的。", "s")
      ]
    },
    {
      id: "ls-gr-time-1",
      level: "grammar",
      title: "时间表达 · 第 1 课",
      aim: "ตอน / เมื่อ 表示时段或「当…时」；ก่อน / หลัง / ระหว่าง 表先后与期间。",
      words: ["gr-time-dtɔɔn", "gr-time-mua", "gr-time-kɔɔn", "gr-time-lang", "gr-time-raang", "a1d-now"],
      talk: [
      turn("f", "ตอนเช้าไปทำงาน{p}", "dtɔɔn-cháao bpai tham-ngaan {pr}", "早上去上班。"),
      turn("m", "เมื่อถึงแล้วโทร{p}", "mʉ̂a thʉ̌ng lɛ́ɛo thoo {pr}", "到了再打电话。"),
      turn("f", "ก่อนกินล้างมือ{p}", "gɔ̀ɔn gin láang mʉʉ {pr}", "吃前洗手。"),
      turn("m", "หลังเลิกงาน{p}", "lǎng lə̂ək ngaan {pr}", "下班后。")
      ],
      lines: [
      line("ตอนนี้ยุ่ง{p}", "dtɔɔn-níi yûng {pr}", "现在忙。", "s"),
      line("ระหว่างทาง{p}", "rá-wàang thaang {pr}", "在路上。", "s"),
      line("ก่อนนอน{p}", "gɔ̀ɔn nɔɔn {pr}", "睡前。", "s")
      ]
    },
    {
      id: "ls-gr-time-2",
      level: "grammar",
      title: "时间表达 · 第 2 课",
      aim: "时间短语常放句首或句末；问时间用 กี่โมง / เมื่อไร，回答要带上午下午等时段词。",
      words: ["a1d-morning", "a1d-evening", "gr-q-when", "gr-q-howmany", "a1d-tomorrow", "a1d-today"],
      talk: [
      turn("f", "กี่โมงแล้ว{p}", "gìi moong lɛ́ɛo {pr}", "几点了？", "q"),
      turn("m", "สองโมงเย็น{p}", "sɔ̌ɔng moong yen {pr}", "下午两点。"),
      turn("f", "เมื่อไรเจอกัน{p}", "mʉ̂a-rai jəə gan {pr}", "什么时候见？", "q"),
      turn("m", "พรุ่งนี้เช้า{p}", "phrûng-níi cháao {pr}", "明天早上。")
      ],
      lines: [
      line("วันนี้เย็น{p}", "wan-níi yen {pr}", "今天傍晚。", "s"),
      line("ตอนเที่ยงว่าง{p}", "dtɔɔn-thîang wâang {pr}", "中午有空。", "s"),
      line("อีกสองชั่วโมง{p}", "ìik sɔ̌ɔng chûa-moong {pr}", "再过两小时。", "s")
      ]
    },
    {
      id: "ls-gr-reg-1",
      level: "grammar",
      title: "语域与人称 · 第 1 课",
      aim: "ผม / ดิฉัน 偏正式；ฉัน 更通用。คุณ 礼貌对称；ท่าน 更敬。句尾礼貌词与人称应匹配场合。",
      words: ["gr-reg-phom", "gr-reg-chan", "gr-reg-dichan", "gr-reg-khun", "gr-reg-thaan", "gr-polite-m"],
      talk: [
      turn("m", "ผมชื่อสมชายครับ", "phǒm chʉ̂ʉ sǒm-chaai khráp", "我叫颂猜。"),
      turn("f", "ดิฉันมาจากจีนค่ะ", "dì-chǎn maa jàak jiin khâ", "我来自中国。"),
      turn("m", "คุณสบายดีไหมครับ", "khun sà-baai dii mǎi khráp", "您还好吗？", "q"),
      turn("f", "เชิญท่านนั่งค่ะ", "chəən thâan nâng khâ", "请您坐。")
      ],
      lines: [
      line("ฉันไม่แน่ใจ{p}", "chǎn mâi nâe-jai {pr}", "我不确定。", "s"),
      line("ขอบคุณท่าน{p}", "khɔ̀ɔp-khun thâan {pr}", "谢谢您。", "s"),
      line("ผมขอโทษครับ", "phǒm khɔ̌ɔ-thôot khráp", "对不起。（男）", "s")
      ]
    },
    {
      id: "ls-gr-part-1",
      level: "grammar",
      title: "语气助词 · 第 1 课",
      aim: "นะ 缓和语气；สิ 催促或加强肯定；ล่ะ 提起话题或反问；เหรอ 表惊讶确认。",
      words: ["gr-part-na", "gr-part-si", "gr-part-la", "gr-part-roe", "a1d-go", "a1d-ok"],
      talk: [
      turn("f", "ไปกันนะ{p}", "bpai gan ná {pr}", "我们走吧。"),
      turn("m", "รีบสิ{p}", "rîip sì {pr}", "快点啊。"),
      turn("f", "แล้วคุณล่ะ{p}", "lɛ́ɛo khun lâ {pr}", "那你呢？", "q"),
      turn("m", "ไปเหรอ{p}", "bpai rə̌ə {pr}", "要去啊？", "q")
      ],
      lines: [
      line("ค่อย ๆ นะ{p}", "khôi-khôi ná {pr}", "慢慢来哦。", "s"),
      line("กินสิ{p}", "gin sì {pr}", "吃吧。", "s"),
      line("จริงเหรอ{p}", "jing rə̌ə {pr}", "真的吗？", "q")
      ]
    }
  ];
  COURSE.lessons = COURSE.lessons.concat(added);
})();
