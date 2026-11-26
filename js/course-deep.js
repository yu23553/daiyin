(function () {
  if (!window.COURSE) return;
  function line(th, ro, zh, kind) { return { th: th, ro: ro, zh: zh, kind: kind || "s" }; }
  function turn(g, th, ro, zh, kind) { var item = { g: g, th: th, ro: ro, zh: zh }; if (kind) item.kind = kind; return item; }
  var added = [
    {
      id: "ls-a1-weather",
      level: "A1",
      title: "问天气",
      aim: "问天气时宜先问今天怎样，再决定带不带伞。",
      words: ["a2d-weather", "a2d-rain", "a2d-umbrella", "a1d-today", "a1d-hotfood", "a1d-coldfood"],
      talk: [
      turn("f", "วันนี้อากาศเป็นยังไง{p}", "wan-níi aa-gàat bpen yang-ngai {pr}", "今天天气怎么样？", "q"),
      turn("m", "ร้อน{p} อาจจะมีฝน{p}", "rón {pr} àat-jà mii fǒn {pr}", "热。可能会有雨。"),
      turn("f", "ต้องเอาร่มไหม{p}", "dtɔ̂ɔng ao rôm mǎi {pr}", "要带伞吗？", "q"),
      turn("m", "เอาดีกว่า{p}", "ao dii gwàa {pr}", "带比较好。")
      ],
      lines: [
      line("อากาศร้อนไหม{p}", "aa-gàat rón mǎi {pr}", "天气热吗？", "q"),
      line("มีฝน{p}", "mii fǒn {pr}", "有雨。", "s"),
      line("เอาร่มด้วย{p}", "ao rôm dûai {pr}", "顺便带伞。", "s")
      ]
    },
    {
      id: "ls-a1-shopask",
      level: "A1",
      title: "在店里问",
      aim: "在店里宜先说要找什么，再问有没有和多少钱。",
      words: ["a1d-want", "a1d-have", "a1d-price", "a1d-cheap", "a1d-expensive", "a1d-buy"],
      talk: [
      turn("f", "มีน้ำไหม{p}", "mii náam mǎi {pr}", "有水吗？", "q"),
      turn("m", "มี{p} ขวดละสิบบาท{p}", "mii {pr} khùat lá sìp bàat {pr}", "有。一瓶十铢。"),
      turn("f", "แพงไปหน่อย{p}", "phɛɛng bpai nɔ̀i {pr}", "有点贵。"),
      turn("m", "ลดได้ไหม{p}", "lót dâai mǎi {pr}", "能便宜点吗？", "q")
      ],
      lines: [
      line("มีไหม{p}", "mii mǎi {pr}", "有吗？", "q"),
      line("เท่าไหร่{p}", "thâo-rài {pr}", "多少钱？", "q"),
      line("ขอลองดู{p}", "khɔ̌ɔ lɔɔng duu {pr}", "请让我看看。", "s")
      ]
    },
    {
      id: "ls-a1-directions",
      level: "A1",
      title: "问怎么走",
      aim: "问路时宜说目的地，再问远不远、怎么走。",
      words: ["a1-where", "a1d-near", "a1d-far", "a1d-left", "a1d-right", "a1d-walk"],
      talk: [
      turn("f", "ตลาดอยู่ที่ไหน{p}", "dtà-làat yùu thîi-nǎi {pr}", "市场在哪里？", "q"),
      turn("m", "ตรงไปแล้วเลี้ยวขวา{p}", "dtrong bpai lɛ́ɛo líiao khwǎa {pr}", "直走再右转。"),
      turn("f", "ไกลไหม{p}", "glai mǎi {pr}", "远吗？", "q"),
      turn("m", "ไม่ไกล{p} เดินได้{p}", "mâi glai {pr} dəən dâai {pr}", "不远。可以走。")
      ],
      lines: [
      line("อยู่ที่ไหน{p}", "yùu thîi-nǎi {pr}", "在哪里？", "q"),
      line("เลี้ยวซ้าย{p}", "líiao sáai {pr}", "向左转。", "s"),
      line("ใกล้แล้ว{p}", "glâi lɛ́ɛo {pr}", "已经近了。", "s")
      ]
    },
    {
      id: "ls-a1-feel",
      level: "A1",
      title: "说身体感觉",
      aim: "说不舒服时宜说哪里不舒服，并说要不要休息。",
      words: ["a1d-hungry", "a1d-thirsty", "a1d-sleep", "a1d-full", "a1d-drink", "a1-water"],
      talk: [
      turn("m", "หิวแล้ว{p}", "hǐu lɛ́ɛo {pr}", "饿了。"),
      turn("f", "กินข้าวก่อนไหม{p}", "gin khâao gɔ̀ɔn mǎi {pr}", "先吃饭吗？", "q"),
      turn("m", "กระหายด้วย{p}", "grà-hǎai dûai {pr}", "也渴。"),
      turn("f", "ขอน้ำหน่อย{p}", "khɔ̌ɔ náam nɔ̀i {pr}", "请给我水。")
      ],
      lines: [
      line("หิวไหม{p}", "hǐu mǎi {pr}", "饿吗？", "q"),
      line("ง่วงนิดหน่อย{p}", "ngûang nít-nɔ̀i {pr}", "有点困。", "s"),
      line("พักก่อน{p}", "phák gɔ̀ɔn {pr}", "先休息。", "s")
      ]
    },
    {
      id: "ls-a1-phone",
      level: "A1",
      title: "打电话约",
      aim: "打电话时宜先报自己是谁，再说想约什么时候。",
      words: ["a1d-phone", "a2d-call", "a1d-tomorrow", "a1d-evening", "a1d-ok", "a1d-wait"],
      talk: [
      turn("f", "สวัสดี{p} ฉันมาลี{p}", "sà-wàt-dii {pr} chǎn maa-lii {pr}", "你好。我是玛丽。"),
      turn("m", "ว่างไหมพรุ่งนี้เย็น{p}", "wâang mǎi phrûng-níi yen {pr}", "明天傍晚有空吗？", "q"),
      turn("f", "ว่าง{p} เจอกันกี่โมง{p}", "wâang {pr} jəə gan gìi moong {pr}", "有空。几点见？", "q"),
      turn("m", "ห้าโมงได้ไหม{p}", "hâa moong dâai mǎi {pr}", "五点可以吗？", "q")
      ],
      lines: [
      line("โทรหาหน่อย{p}", "thoo hǎa nɔ̀i {pr}", "请打个电话找我。", "s"),
      line("พรุ่งนี้ว่างไหม{p}", "phrûng-níi wâang mǎi {pr}", "明天有空吗？", "q"),
      line("ได้{p} รอสาย{p}", "dâai {pr} rɔɔ sǎai {pr}", "可以。等你电话。", "s")
      ]
    },
    {
      id: "ls-a1-home",
      level: "A1",
      title: "在家里",
      aim: "在家里宜能说房间位置，并请别人帮忙开关。",
      words: ["a1d-door", "a1d-window", "a1d-open", "a1d-close", "a1d-kitchen", "a1d-toilet"],
      talk: [
      turn("f", "ห้องน้ำอยู่ที่ไหน{p}", "hɔ̂ɔng-náam yùu thîi-nǎi {pr}", "洗手间在哪里？", "q"),
      turn("m", "อยู่ข้างใน{p}", "yùu khâang-nai {pr}", "在里面。"),
      turn("f", "ช่วยเปิดหน้าต่างหน่อย{p}", "chûai bpèrt nâa-dtàang nɔ̀i {pr}", "请帮我开窗。"),
      turn("m", "ได้{p} ปิดประตูด้วยไหม{p}", "dâai {pr} bpìt bprà-dtuu dûai mǎi {pr}", "好。要顺便关门吗？", "q")
      ],
      lines: [
      line("เปิดไฟ{p}", "bpèrt fai {pr}", "开灯。", "s"),
      line("ปิดประตู{p}", "bpìt bprà-dtuu {pr}", "关门。", "s"),
      line("ครัวอยู่ตรงนั้น{p}", "khrua yùu dtrong nán {pr}", "厨房在那边。", "s")
      ]
    },
    {
      id: "ls-a2-bank",
      level: "A2",
      title: "去银行办事",
      aim: "在银行宜说明要取钱还是转账，并确认金额。",
      words: ["a1d-bank", "a2d-withdraw", "a2d-transfer", "a2d-atm", "a2d-cash", "a2d-passport"],
      talk: [
      turn("f", "อยากถอนเงิน{p}", "yàak thɔ̌ɔn-ngən {pr}", "想取钱。"),
      turn("m", "กี่บาท{p}", "gìi bàat {pr}", "多少铢？", "q"),
      turn("f", "สองพัน{p} โอนได้ไหม{p}", "sɔ̌ɔng phan {pr} oon dâai mǎi {pr}", "两千。能转账吗？", "q"),
      turn("m", "ได้{p} โชว์บัตรหน่อย{p}", "dâai {pr} choo bàt nɔ̀i {pr}", "可以。请出示证件。")
      ],
      lines: [
      line("ถอนเงิน{p}", "thɔ̌ɔn-ngən {pr}", "取钱。", "s"),
      line("เอทีเอ็มอยู่ไหน{p}", "ee-thii-em yùu nǎi {pr}", "取款机在哪？", "q"),
      line("โอนเรียบร้อยแล้ว{p}", "oon rîap-rɔ́ɔi lɛ́ɛo {pr}", "已经转好了。", "s")
      ]
    },
    {
      id: "ls-a2-clinic2",
      level: "A2",
      title: "看诊所",
      aim: "看病时宜说症状多久了，并问药怎么吃。",
      words: ["a2d-clinic", "a2d-fever", "a2d-cough", "a2d-medicine", "a2d-doctor", "a2d-allergy"],
      talk: [
      turn("f", "เป็นไข้มาสองวัน{p}", "bpen khâi maa sɔ̌ɔng wan {pr}", "发烧两天了。"),
      turn("m", "ไอด้วยไหม{p}", "ai dûai mǎi {pr}", "也咳嗽吗？", "q"),
      turn("f", "ไอ{p} แพ้ยาอะไรไหม{p}", "ai {pr} phɛ́ɛ yaa à-rai mǎi {pr}", "咳嗽。对什么药过敏吗？", "q"),
      turn("m", "ไม่แพ้{p}", "mâi phɛ́ɛ {pr}", "不过敏。")
      ],
      lines: [
      line("ปวดหัว{p}", "bpùat hǔa {pr}", "头疼。", "s"),
      line("กินยาหลังอาหาร{p}", "gin yaa lǎng aa-hǎan {pr}", "饭后吃药。", "s"),
      line("พักผ่อนให้พอ{p}", "phák-phɔ̀ɔn hâi phɔɔ {pr}", "要充分休息。", "s")
      ]
    },
    {
      id: "ls-a2-post",
      level: "A2",
      title: "寄包裹",
      aim: "寄东西时宜说寄到哪里，并问几天到。",
      words: ["a2d-post", "a2d-package", "a2d-deliver", "a2d-address", "a2d-receive", "a1d-many"],
      talk: [
      turn("f", "อยากส่งพัสดุ{p}", "yàak sòng phát-sà-dù {pr}", "想寄包裹。"),
      turn("m", "ส่งไปที่ไหน{p}", "sòng bpai thîi-nǎi {pr}", "寄到哪里？", "q"),
      turn("f", "ไปกรุงเทพ{p} กี่วันถึง{p}", "bpai grung-thêep {pr} gìi wan thʉ̌ng {pr}", "去曼谷。几天到？", "q"),
      turn("m", "ประมาณสามวัน{p}", "bprà-maan sǎam wan {pr}", "大概三天。")
      ],
      lines: [
      line("ส่งด่วนไหม{p}", "sòng dùan mǎi {pr}", "要寄快递吗？", "q"),
      line("เขียนที่อยู่ให้ชัด{p}", "khǐan thîi-yùu hâi chát {pr}", "地址请写清楚。", "s"),
      line("เก็บใบเสร็จไว้{p}", "gèp bai-sèt wái {pr}", "请留好收据。", "s")
      ]
    },
    {
      id: "ls-a2-laundry",
      level: "A2",
      title: "送洗衣",
      aim: "送洗衣时宜说明件数和何时取回。",
      words: ["a2d-laundry", "a2d-wash", "a2d-dry", "a2d-clothes", "a1d-tomorrow", "a2d-receive"],
      talk: [
      turn("f", "อยากซักเสื้อ{p}", "yàak sák sʉ̂a {pr}", "想洗衣服。"),
      turn("m", "กี่ตัว{p}", "gìi dtua {pr}", "几件？", "q"),
      turn("f", "ห้าตัว{p} พรุ่งนี้รับได้ไหม{p}", "hâa dtua {pr} phrûng-níi ráp dâai mǎi {pr}", "五件。明天能取吗？", "q"),
      turn("m", "ได้{p} เย็นนี้พร้อม{p}", "dâai {pr} yen níi phrɔ́ɔm {pr}", "可以。傍晚就好。")
      ],
      lines: [
      line("ซักรีด{p}", "sák-rîit {pr}", "洗衣熨烫。", "s"),
      line("อย่าใส่สารฟอกขาว{p}", "yàa sài sǎan-fɔ̂ɔk-khǎao {pr}", "不要用漂白剂。", "s"),
      line("มารับเย็นนี้{p}", "maa ráp yen níi {pr}", "傍晚来取。", "s")
      ]
    },
    {
      id: "ls-a2-sim",
      level: "A2",
      title: "办手机卡",
      aim: "办卡时宜说要打电话还是上网，并问套餐。",
      words: ["a2d-sim", "a2d-charge", "a2d-password", "a2d-wifi", "a1d-phone", "a2d-openhours"],
      talk: [
      turn("f", "ขอซิมหน่อย{p}", "khɔ̌ɔ sim nɔ̀i {pr}", "请给我一张手机卡。"),
      turn("m", "เน็ตเท่าไหร่ต่อเดือน{p}", "nét thâo-rài dtɔ̀ɔ dʉan {pr}", "每月流量多少钱？", "q"),
      turn("f", "ห้าร้อยพอไหม{p}", "hâa-rɔ́ɔi phɔɔ mǎi {pr}", "五百够吗？", "q"),
      turn("m", "พอ{p} เปิดเครื่องได้เลย{p}", "phɔɔ {pr} bpèrt khrʉ̂ang dâai ləəi {pr}", "够。可以直接开机。")
      ],
      lines: [
      line("เติมเงิน{p}", "dtəəm ngən {pr}", "充值。", "s"),
      line("รหัสผ่านคืออะไร{p}", "rá-hàt-phàan khʉʉ à-rai {pr}", "密码是什么？", "q"),
      line("ชาร์จแบตก่อน{p}", "cháat bɛ̀ɛt gɔ̀ɔn {pr}", "先充电。", "s")
      ]
    },
    {
      id: "ls-a2-return",
      level: "A2",
      title: "退换货",
      aim: "退换时宜带收据，并说明原因。",
      words: ["a2d-returnitem", "a2d-exchange", "a2d-receipt", "a2d-guarantee", "a2d-size", "a2d-fit"],
      talk: [
      turn("f", "ขอเปลี่ยนไซส์{p}", "khɔ̌ɔ bplìan sai {pr}", "想换尺码。"),
      turn("m", "มีใบเสร็จไหม{p}", "mii bai-sèt mǎi {pr}", "有收据吗？", "q"),
      turn("f", "มี{p} ตัวนี้เล็กไป{p}", "mii {pr} dtua níi lék bpai {pr}", "有。这件太小。"),
      turn("m", "ลองไซส์ใหญ่กว่านี้{p}", "lɔɔng sai yài gwàa níi {pr}", "试试大一号。")
      ],
      lines: [
      line("ขอคืนของ{p}", "khɔ̌ɔ khʉʉn-khɔ̌ɔng {pr}", "想退货。", "s"),
      line("รับประกันกี่เดือน{p}", "ráp-bprà-gan gìi dʉan {pr}", "保修几个月？", "q"),
      line("พอดีแล้ว{p}", "phɔɔ-dii lɛ́ɛo {pr}", "正好了。", "s")
      ]
    },
    {
      id: "ls-b1-opinion",
      level: "B1",
      title: "谈看法",
      aim: "谈看法时宜先说观点，再补一句理由。",
      words: ["b1d-think", "b1d-agree", "b1d-disagree", "b1d-reason", "a2d-because", "b1d-opinion"],
      talk: [
      turn("f", "คิดว่าที่นี่ดี{p}", "khít-wâa thîi-nîi dii {pr}", "我觉得这里不错。"),
      turn("m", "เห็นด้วย{p} เพราะเงียบ{p}", "hěn-dûai {pr} phrɔ́ ngîap {pr}", "同意。因为安静。"),
      turn("f", "แต่ราคาแพงไปไหม{p}", "dtɛ̀ɛ raa-khaa phɛɛng bpai mǎi {pr}", "但价钱是不是偏贵？", "q"),
      turn("m", "ก็จริง{p}", "gɔ̂ɔ jing {pr}", "也是。")
      ],
      lines: [
      line("คิดว่ายังไง{p}", "khít-wâa yang-ngai {pr}", "你怎么看？", "q"),
      line("ไม่เห็นด้วยนะ{p}", "mâi-hěn-dûai ná {pr}", "我不太同意。", "s"),
      line("เหตุผลคืออะไร{p}", "hèet-phǒn khʉʉ à-rai {pr}", "理由是什么？", "q")
      ]
    },
    {
      id: "ls-b1-compare",
      level: "B1",
      title: "做比较",
      aim: "比较时宜说出两边差别，并说更偏向哪边。",
      words: ["b1d-compare", "b1d-better", "b1d-worse", "b1d-same", "b1d-different", "b1d-advantage"],
      talk: [
      turn("m", "อันนี้ดีกว่าอันนั้น{p}", "an-níi dii-gwàa an-nán {pr}", "这个比那个好。"),
      turn("f", "ต่างกันตรงไหน{p}", "dtàang-gan dtrong nǎi {pr}", "差别在哪里？", "q"),
      turn("m", "อันนี้เงียบกว่า{p}", "an-níi ngîap gwàa {pr}", "这个更安静。"),
      turn("f", "งั้นเอาอันนี้{p}", "ngán ao an-níi {pr}", "那就这个。")
      ],
      lines: [
      line("เหมือนกันไหม{p}", "mʉ̌ʉan-gan mǎi {pr}", "一样吗？", "q"),
      line("ข้อดีคือราคา{p}", "khɔ̂ɔ-dii khʉʉ raa-khaa {pr}", "优点是价格。", "s"),
      line("ดีที่สุดแล้ว{p}", "dii thîi-sùt lɛ́ɛo {pr}", "已经是最好的了。", "s")
      ]
    },
    {
      id: "ls-b1-plan",
      level: "B1",
      title: "说计划",
      aim: "说计划时宜用 จะ / กำลังจะ，并说明准备什么。",
      words: ["b1d-plan", "b1d-prepare", "b1d-hope", "b1d-expect", "a2d-aboutto", "a1d-tomorrow"],
      talk: [
      turn("f", "กำลังจะไปเที่ยว{p}", "gam-lang-jà bpai thîao {pr}", "正打算去玩。"),
      turn("m", "เตรียมอะไรแล้วบ้าง{p}", "dtriiam à-rai lɛ́ɛo bâang {pr}", "准备了什么？", "q"),
      turn("f", "จองตั๋วแล้ว{p}", "jɔɔng dtǔa lɛ́ɛo {pr}", "票订好了。"),
      turn("m", "หวังว่าอากาศจะดี{p}", "wǎng wâa aa-gàat jà dii {pr}", "希望天气好。")
      ],
      lines: [
      line("มีแผนไหม{p}", "mii phɛ̌ɛn mǎi {pr}", "有计划吗？", "q"),
      line("คาดว่าเสร็จพรุ่งนี้{p}", "khâat-wâa sèt phrûng-níi {pr}", "预计明天完成。", "s"),
      line("เป้าหมายชัดแล้ว{p}", "bpâo-mǎai chát lɛ́ɛo {pr}", "目标已经清楚。", "s")
      ]
    },
    {
      id: "ls-b1-emotion",
      level: "B1",
      title: "说情绪",
      aim: "说情绪时宜点明感受，并说明原因或请求。",
      words: ["b1d-worry", "b1d-relax", "b1d-excited", "b1d-bored", "b1d-happy", "b1d-sad"],
      talk: [
      turn("m", "กังวลนิดหน่อย{p}", "gang-won nít-nɔ̀i {pr}", "有点担心。"),
      turn("f", "ทำไม{p}", "tham-mai {pr}", "为什么？", "q"),
      turn("m", "งานยังไม่เสร็จ{p}", "ngaan yang mâi sèt {pr}", "工作还没做完。"),
      turn("f", "ผ่อนคลายก่อนนะ{p}", "phɔ̀ɔn-khlaai gɔ̀ɔn ná {pr}", "先放松一下。")
      ],
      lines: [
      line("ตื่นเต้นมาก{p}", "dtʉ̀ʉn-dtên mâak {pr}", "很兴奋。", "s"),
      line("เบื่อแล้ว{p}", "bʉ̀ʉa lɛ́ɛo {pr}", "已经腻了。", "s"),
      line("เสียใจด้วย{p}", "sǐa-jai dûai {pr}", "我很难过。", "s")
      ]
    },
    {
      id: "ls-b1-problem",
      level: "B1",
      title: "说问题与办法",
      aim: "谈问题时宜说原因，再提出一个办法。",
      words: ["b1d-problem", "b1d-cause", "b1d-solution", "b1d-fix", "b1d-improve", "b1d-result"],
      talk: [
      turn("f", "มีปัญหาตรงนี้{p}", "mii bpan-hǎa dtrong níi {pr}", "这里有问题。"),
      turn("m", "สาเหตุคืออะไร{p}", "sǎa-hèet khʉʉ à-rai {pr}", "原因是什么？", "q"),
      turn("f", "ระบบช้า{p}", "rá-bòp cháa {pr}", "系统慢。"),
      turn("m", "ลองแก้แบบนี้{p}", "lɔɔng gɛ̂ɛ bɛ̀ɛp níi {pr}", "试试这样改。")
      ],
      lines: [
      line("ทางแก้มีไหม{p}", "thaang-gɛ̂ɛ mii mǎi {pr}", "有解决办法吗？", "q"),
      line("ผลออกมาดี{p}", "phǒn ɔ̀ɔk maa dii {pr}", "结果不错。", "s"),
      line("ต้องปรับปรุง{p}", "dtɔ̂ɔng bprap-bprung {pr}", "需要改进。", "s")
      ]
    },
    {
      id: "ls-b1-story",
      level: "B1",
      title: "讲一段经历",
      aim: "讲经历时宜交代时间地点，并用 เคย / แล้ว 串起来。",
      words: ["b1d-ever", "b1d-experience", "b1d-travel", "b1d-trip", "b1d-recently", "a1d-remember"],
      talk: [
      turn("m", "เมื่อเร็ว ๆ นี้เคยไปเชียงใหม่{p}", "mʉ̂a-reo-reo-níi khəəi bpai chiang-mài {pr}", "最近去过清迈。"),
      turn("f", "เป็นยังไงบ้าง{p}", "bpen yang-ngai bâang {pr}", "怎么样？", "q"),
      turn("m", "อากาศดี{p} ทริปสนุก{p}", "aa-gàat dii {pr} thíp sà-nùk {pr}", "天气好。行程好玩。"),
      turn("f", "ยังจำได้ไหม{p}", "yang jam dâai mǎi {pr}", "还记得吗？", "q")
      ],
      lines: [
      line("ไม่เคยไป{p}", "mâi-khəəi bpai {pr}", "没去过。", "s"),
      line("ประสบการณ์ดี{p}", "bprà-sòp-gaan dii {pr}", "体验不错。", "s"),
      line("เล่าให้ฟังหน่อย{p}", "lâo hâi fang nɔ̀i {pr}", "讲给我听听。", "s")
      ]
    },
    {
      id: "ls-b2-negotiate",
      level: "B2",
      title: "谈条件",
      aim: "谈条件时宜先摆出限度，再问能否折中。",
      words: ["b2d-negotiate", "b2d-condition", "b2d-compromise", "b2d-budget", "b2d-deadline", "b2d-proposal"],
      talk: [
      turn("f", "งบประมาณจำกัด{p}", "ngóp-bprà-maan jam-gàt {pr}", "预算有限。"),
      turn("m", "เงื่อนไขคือส่งภายในสัปดาห์นี้{p}", "ngʉ̂an-khǎi khʉʉ sòng phaai-nai sàp-daa níi {pr}", "条件是本周内交付。"),
      turn("f", "ประนีประนอมได้ไหม{p}", "bprà-nii-bprà-nɔɔm dâai mǎi {pr}", "能折中吗？", "q"),
      turn("m", "ถ้าขยายกำหนดส่งได้นิดหนึ่ง{p}", "thâa khá-yǎai gam-nòt-sòng dâai nít nʉ̀ng {pr}", "如果截止日期能放宽一点。")
      ],
      lines: [
      line("ข้อเสนอนี้รับได้ไหม{p}", "khɔ̂ɔ-sà-nǒə níi ráp dâai mǎi {pr}", "这个提案能接受吗？", "q"),
      line("เจรจาอีกครั้ง{p}", "jee-rá-jaa ìik khráng {pr}", "再谈一轮。", "s"),
      line("ยอมลดราคาได้{p}", "yɔɔm lót raa-khaa dâai {pr}", "可以接受降价。", "s")
      ]
    },
    {
      id: "ls-b2-clarify",
      level: "B2",
      title: "澄清误会",
      aim: "澄清时宜先复述对方意思，再说明自己的点。",
      words: ["b2d-clarify", "b2d-emphasize", "b2d-ambiguous", "b2d-precise", "b2d-context", "b1d-explain"],
      talk: [
      turn("m", "ขอชี้แจงหน่อย{p}", "khɔ̌ɔ chíi-jɛɛng nɔ̀i {pr}", "请允许我澄清一下。"),
      turn("f", "หมายความว่าไง{p}", "mǎai-khwaam wâa ngai {pr}", "是什么意思？", "q"),
      turn("m", "ประเด็นหลักคือคุณภาพ{p}", "bprà-den-làk khʉʉ khun-ná-phâap {pr}", "要点是质量。"),
      turn("f", "งั้นชัดขึ้น{p}", "ngán chát khʉ̂n {pr}", "那就清楚多了。")
      ],
      lines: [
      line("พูดคลุมเครือไป{p}", "phûut khlum-khrʉa bpai {pr}", "说得有点含糊。", "s"),
      line("เน้นอีกที{p}", "nén ìik thii {pr}", "再强调一次。", "s"),
      line("ในบริบทนี้{p}", "nai bɔɔ-rí-bòt níi {pr}", "在这个背景下。", "s")
      ]
    },
    {
      id: "ls-b2-risk",
      level: "B2",
      title: "谈风险与影响",
      aim: "谈风险时宜说可能后果，并提出监控办法。",
      words: ["b2d-risk", "b2d-impact", "b2d-consequence", "b2d-monitor", "b2d-adjust", "b2d-alternative"],
      talk: [
      turn("f", "มีความเสี่ยงด้านเวลา{p}", "mii khwaam-sǐiang dâan wee-laa {pr}", "有时间风险。"),
      turn("m", "ผลกระทบคืออะไร{p}", "phǒn-grá-thóp khʉʉ à-rai {pr}", "影响是什么？", "q"),
      turn("f", "อาจส่งงานช้า{p}", "àat sòng ngaan cháa {pr}", "可能交工晚。"),
      turn("m", "งั้นติดตามทุกวัน{p}", "ngán dtìt-dtaam thúk wan {pr}", "那就每天跟进。")
      ],
      lines: [
      line("ทางเลือกอื่นมีไหม{p}", "thaang-lʉ̂ak ʉ̀ʉn mii mǎi {pr}", "有别的方案吗？", "q"),
      line("ปรับแผนได้{p}", "bpràp phɛ̌ɛn dâai {pr}", "可以调整计划。", "s"),
      line("ผลที่ตามมาชัด{p}", "phǒn thîi dtaam maa chát {pr}", "后果很清楚。", "s")
      ]
    },
    {
      id: "ls-b2-process",
      level: "B2",
      title: "说流程与审批",
      aim: "说流程时宜按步骤讲，并说明谁批准。",
      words: ["b2d-procedure", "b2d-submit", "b2d-approve", "b2d-reject", "b2d-permission", "b2d-regulation"],
      talk: [
      turn("f", "ต้องยื่นเอกสารก่อน{p}", "dtɔ̂ɔng yʉ̂ʉn èek-gà-sǎan gɔ̀ɔn {pr}", "要先提交材料。"),
      turn("m", "ใครอนุมัติ{p}", "khrai à-nú-mát {pr}", "谁批准？", "q"),
      turn("f", "ผู้จัดการ{p}", "phûu-jàt-gaan {pr}", "经理。"),
      turn("m", "ถ้าระเบียบอนุญาตก็ได้{p}", "thâa rá-bìap à-nú-yâat gɔ̂ɔ dâai {pr}", "如果规章允许就可以。")
      ],
      lines: [
      line("ขั้นตอนถัดไป{p}", "khân-dtɔɔn thát bpai {pr}", "下一步。", "s"),
      line("ถูกปฏิเสธแล้ว{p}", "thùuk bpà-dtì-sèet lɛ́ɛo {pr}", "已经被拒了。", "s"),
      line("ขออนุญาตก่อน{p}", "khɔ̌ɔ à-nú-yâat gɔ̀ɔn {pr}", "先请许可。", "s")
      ]
    },
    {
      id: "ls-b2-argue",
      level: "B2",
      title: "有理有据地反驳",
      aim: "反驳时宜先承认一点，再摆证据。",
      words: ["b2d-argue", "b2d-evidence", "b2d-persuade", "b2d-nevertheless", "b2d-incontrast", "b2d-evaluate"],
      talk: [
      turn("m", "เข้าใจประเด็นคุณ{p}", "khâo-jai bprà-den khun {pr}", "我理解你的点。"),
      turn("f", "แต่หลักฐานชี้คนละทาง{p}", "dtɛ̀ɛ làk-thǎan chíi khon lá thaang {pr}", "但证据指向另一边。"),
      turn("m", "ตรงกันข้าม ตัวเลขขึ้น{p}", "dtrong-gan-khâam dtua-lêek khʉ̂n {pr}", "相反，数字在涨。"),
      turn("f", "งั้นประเมินใหม่{p}", "ngán bprà-məən mài {pr}", "那就重新评估。")
      ],
      lines: [
      line("ถึงกระนั้นก็ยังเสี่ยง{p}", "thʉ̌ng-grà-nán gɔ̂ɔ yang sǐiang {pr}", "尽管如此仍有风险。", "s"),
      line("โน้มน้าวด้วยข้อมูล{p}", "nóom-náao dûai khɔ̂ɔ-muun {pr}", "用数据来说服。", "s"),
      line("โต้แย้งได้มีเหตุผล{p}", "dtôo-yáeng dâai mii hèet-phǒn {pr}", "反驳要有道理。", "s")
      ]
    },
    {
      id: "ls-b2-strategy",
      level: "B2",
      title: "谈策略取舍",
      aim: "谈策略时宜说优先事项，并说明取舍。",
      words: ["b2d-strategy", "b2d-priority", "b2d-tradeoff", "b2d-implement", "b2d-efficient", "b2d-flexible"],
      talk: [
      turn("f", "ลำดับความสำคัญคือคุณภาพ{p}", "lam-dàp-khwaam-sǎm-khan khʉʉ khun-ná-phâap {pr}", "优先是质量。"),
      turn("m", "แลกกับเวลาได้ไหม{p}", "lɛ̂ɛk-gàp wee-laa dâai mǎi {pr}", "能用时间换吗？", "q"),
      turn("f", "ยืดหยุ่นได้บ้าง{p}", "yʉ̂ʉt-yùn dâai bâang {pr}", "可以有一点灵活。"),
      turn("m", "งั้นดำเนินการตามนี้{p}", "ngán dam-nəən-gaan dtaam níi {pr}", "那就按这个执行。")
      ],
      lines: [
      line("กลยุทธ์ชัดไหม{p}", "glà-yút chát mǎi {pr}", "策略清楚吗？", "q"),
      line("ต้องมีประสิทธิภาพ{p}", "dtɔ̂ɔng mii bprà-sìt-thí-phâap {pr}", "必须高效。", "s"),
      line("ปรับได้ตามสถานการณ์{p}", "bpràp dâai dtaam sà-thǎa-ná-gaan {pr}", "可按情况调整。", "s")
      ]
    }
  ];
  COURSE.lessons = COURSE.lessons.concat(added);
})();
