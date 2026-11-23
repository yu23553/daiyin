(function () {
  window.COURSE = {
    lessons: [
      {
        id: "ls-a1-meet",
        level: "A1",
        title: "见面问候",
        aim: "见面时宜先问候，再报出名字。男性句尾用 ครับ，女性陈述用 ค่ะ。",
        words: ["a1-hello", "a1-name", "a1n-nicetomeet", "a1n-from", "a1-i-m", "a1-i-f"],
        talk: [
          { g: "m", th: "สวัสดี{p}", ro: "sà-wàt-dii {pr}", zh: "你好。" },
          { g: "f", th: "สวัสดี{p} ยินดีที่ได้รู้จัก{p}", ro: "sà-wàt-dii {pr} yin-dii thîi dâai rúu-jàk {pr}", zh: "你好。认识你很高兴。" },
          { g: "m", th: "ผมชื่อสมชาย{p} มาจากจีน{p}", ro: "phǒm chʉ̂ʉ sǒm-chaai {pr} maa jàak jiin {pr}", zh: "我叫颂猜。我来自中国。" },
          { g: "f", th: "ฉันชื่อมาลี{p}", ro: "chǎn chʉ̂ʉ maa-lii {pr}", zh: "我叫玛丽。" }
        ],
        lines: [
          { th: "สวัสดี{p}", ro: "sà-wàt-dii {pr}", zh: "你好。", kind: "s" },
          { th: "คุณชื่ออะไร{p}", ro: "khun chʉ̂ʉ à-rai {pr}", zh: "您叫什么名字？", kind: "q" },
          { th: "ยินดีที่ได้รู้จัก{p}", ro: "yin-dii thîi dâai rúu-jàk {pr}", zh: "认识你很高兴。", kind: "s" }
        ]
      },
      {
        id: "ls-a1-eat",
        level: "A1",
        title: "买水买饭",
        aim: "买吃的时宜先说想要什么，再问价钱。问句末尾，女性用 คะ。",
        words: ["a1-water", "a1-rice", "a1-howmuch", "a1n-notspicy", "a1-eat", "a1n-noodle"],
        talk: [
          { g: "f", th: "ขอก๋วยเตี๋ยวหนึ่งชาม{p}", ro: "khɔ̌ɔ gǔai-dtǐao nʉ̀ng chaam {pr}", zh: "请给我一碗面。" },
          { g: "m", th: "เผ็ดไหม{p}", ro: "phèt mǎi {pr}", zh: "辣吗？" },
          { g: "f", th: "ไม่เผ็ด{p} ขอน้ำเปล่าด้วย{p}", ro: "mâi phèt {pr} khɔ̌ɔ náam bplào dûai {pr}", zh: "不辣。再要一瓶水。" },
          { g: "m", th: "ทั้งหมดห้าสิบบาท{p}", ro: "tháng-mòt hâa-sìp bàat {pr}", zh: "一共五十铢。" }
        ],
        lines: [
          { th: "เท่าไหร่{p}", ro: "thâo-rài {pr}", zh: "多少钱？", kind: "q" },
          { th: "ไม่เผ็ด{p}", ro: "mâi phèt {pr}", zh: "不要辣。", kind: "s" },
          { th: "ขอน้ำเปล่า{p}", ro: "khɔ̌ɔ náam bplào {pr}", zh: "请给我一瓶水。", kind: "s" }
        ]
      },
      {
        id: "ls-a2-taxi",
        level: "A2",
        title: "坐车去酒店",
        aim: "上车后宜说明目的地，并请司机在指定地点停车。",
        words: ["a2-taxi", "a2n-hotel", "a2n-stopthere", "a1-howmuch", "a2n-fare", "a1-where"],
        talk: [
          { g: "m", th: "ไปโรงแรมนี้{p}", ro: "bpai roong-rɛɛm níi {pr}", zh: "去这家酒店。" },
          { g: "f", th: "ไกลไหม{p}", ro: "glai mǎi {pr}", zh: "远吗？" },
          { g: "m", th: "ไม่ไกล{p} จอดตรงนี้ได้{p}", ro: "mâi glai {pr} jɔ̀ɔt dtrong níi dâai {pr}", zh: "不远。可以停在这里。" },
          { g: "f", th: "ค่าโดยสารเท่าไหร่{p}", ro: "khâa dooi sǎan thâo-rài {pr}", zh: "车费多少？" }
        ],
        lines: [
          { th: "เรียกแท็กซี่หน่อย{p}", ro: "rîak thɛ́k-sîi nɔ̀i {pr}", zh: "请叫一辆出租车。", kind: "s" },
          { th: "จอดตรงนี้{p}", ro: "jɔ̀ɔt dtrong níi {pr}", zh: "停在这里。", kind: "s" },
          { th: "นานไหม{p}", ro: "naan mǎi {pr}", zh: "要很久吗？", kind: "q" }
        ]
      },
      {
        id: "ls-a2-room",
        level: "A2",
        title: "看出租的房间",
        aim: "看房时宜问租金、水电，并约定下次来看的时间。",
        words: ["a2-rentroom", "a2-rentfee", "a2n-wifi", "a2n-permonth", "a2-free", "a2-lookroom"],
        talk: [
          { g: "f", th: "ห้องนี้ว่างไหม{p}", ro: "hɔ̂ɔng níi wâang mǎi {pr}", zh: "这间房空着吗？" },
          { g: "m", th: "ว่าง{p} ค่าเช่ารวมค่าน้ำค่าไฟ{p}", ro: "wâang {pr} khâa-châo ruam khâa-náam khâa-fai {pr}", zh: "空着。租金含水电。" },
          { g: "f", th: "มีไวไฟไหม{p}", ro: "mii wai-fai mǎi {pr}", zh: "有无线网吗？" },
          { g: "m", th: "มี{p} พรุ่งนี้มาดูได้{p}", ro: "mii {pr} phrûng-níi maa duu dâai {pr}", zh: "有。明天可以来看。" }
        ],
        lines: [
          { th: "ค่าเช่าเท่าไหร่ต่อเดือน{p}", ro: "khâa-châo thâo-rài dtɔ̀ɔ dʉan {pr}", zh: "每月租金多少？", kind: "q" },
          { th: "ขอดูห้องได้ไหม{p}", ro: "khɔ̌ɔ duu hɔ̂ɔng dâai mǎi {pr}", zh: "能看房吗？", kind: "q" },
          { th: "ห้องนี้เงียบ{p}", ro: "hɔ̂ɔng níi ngîap {pr}", zh: "这间房安静。", kind: "s" }
        ]
      },
      {
        id: "ls-b1-like",
        level: "B1",
        title: "说自己的喜好",
        aim: "谈喜好时宜说出比较，并补一句原因。",
        words: ["b1-like", "b1-than", "b1n-travel", "b1n-music", "b1-because", "b1n-favorite"],
        talk: [
          { g: "f", th: "ชอบท่องเที่ยวมากกว่าดูหนัง{p}", ro: "chɔ̂ɔp thɔ̂ɔng-thîao mâak gwàa duu nǎng {pr}", zh: "比起看电影，我更喜欢旅行。" },
          { g: "m", th: "ทำไมชอบ{p}", ro: "tham-mai chɔ̂ɔp {pr}", zh: "为什么喜欢？" },
          { g: "f", th: "เพราะได้เห็นที่ใหม่{p}", ro: "phrɔ́ dâai hěn thîi mài {pr}", zh: "因为能看到新的地方。" },
          { g: "m", th: "ผมชอบเพลง{p} ฟังตอนทำงาน{p}", ro: "phǒm chɔ̂ɔp phleeeng {pr} fang dtɔɔn tham-ngaan {pr}", zh: "我喜欢歌。工作时听。" }
        ],
        lines: [
          { th: "ชอบอันนี้มากกว่า{p}", ro: "chɔ̂ɔp an-níi mâak gwàa {pr}", zh: "更喜欢这个。", kind: "s" },
          { th: "ของโปรดคืออะไร{p}", ro: "khɔ̌ɔng bpròot khʉʉ à-rai {pr}", zh: "最喜欢的是什么？", kind: "q" },
          { th: "น่าสนใจ{p}", ro: "nâa sǒn jai {pr}", zh: "这个有意思。", kind: "s" }
        ]
      },
      {
        id: "ls-b1-past",
        level: "B1",
        title: "说以前的经历",
        aim: "说过去的事时，宜用 เคย 表示曾经做过。",
        words: ["b1-ever", "b1n-firsttime", "b1n-remember2", "b1-ago", "b1n-trip", "b1n-growup"],
        talk: [
          { g: "m", th: "เคยไปเชียงใหม่ไหม{p}", ro: "khəəi bpai chiang-mài mǎi {pr}", zh: "去过清迈吗？" },
          { g: "f", th: "เคย{p} ครั้งแรกเมื่อปีที่แล้ว{p}", ro: "khəəi {pr} khráng rɛ̂ɛk mʉ̂a bpii thîi lɛ́ɛo {pr}", zh: "去过。第一次是去年。" },
          { g: "m", th: "ยังจำได้ไหม{p}", ro: "yang jam dâai mǎi {pr}", zh: "还记得吗？" },
          { g: "f", th: "จำได้{p} อากาศดี{p}", ro: "jam dâai {pr} aa-gàat dii {pr}", zh: "记得。天气很好。" }
        ],
        lines: [
          { th: "เคยไปไหม{p}", ro: "khəəi bpai mǎi {pr}", zh: "去过吗？", kind: "q" },
          { th: "ครั้งแรกจำได้{p}", ro: "khráng rɛ̂ɛk jam dâai {pr}", zh: "第一次还记得。", kind: "s" },
          { th: "เมื่อก่อนเคยอยู่ที่นี่{p}", ro: "mʉ̂a gɔ̀ɔn khəəi yùu thîi nîi {pr}", zh: "以前在这里住过。", kind: "s" }
        ]
      },
      {
        id: "ls-b2-price",
        level: "B2",
        title: "商量价钱",
        aim: "商量时宜先说出自己的限度，再问对方能否接受。",
        words: ["b2-if", "b2n-discount2", "b2n-afford", "b2n-accept2", "b2-bothok", "b2n-confirmdeal"],
        talk: [
          { g: "f", th: "ราคานี้สูงไปหน่อย{p}", ro: "raa-khaa níi sǔung bpai nɔ̀i {pr}", zh: "这个价钱有一点高。" },
          { g: "m", th: "ถ้างบจำกัด ลดได้นิดหนึ่ง{p}", ro: "thâa ngóp jam-gàt lót dâai nít nʉ̀ng {pr}", zh: "如果预算有限，可以再少一点。" },
          { g: "f", th: "ถ้าราคานี้ รับได้{p}", ro: "thâa raa-khaa níi ráp dâai {pr}", zh: "如果是这个价钱，可以接受。" },
          { g: "m", th: "งั้นตกลงตามนี้{p}", ro: "ngán dtòk-long dtaam níi {pr}", zh: "那就按这个定。" }
        ],
        lines: [
          { th: "ขอลดอีกนิดได้ไหม{p}", ro: "khɔ̌ɔ lót ìik nít dâai mǎi {pr}", zh: "能再便宜一点吗？", kind: "q" },
          { th: "ยอมรับได้{p}", ro: "yɔɔm ráp dâai {pr}", zh: "可以接受。", kind: "s" },
          { th: "ถ้าอย่างนั้นก็ได้{p}", ro: "thâa yàang nán gɔ̂ dâai {pr}", zh: "如果那样，也行。", kind: "s" }
        ]
      },
      {
        id: "ls-b2-problem",
        level: "B2",
        title: "说明一件麻烦事",
        aim: "说明麻烦时宜先说发生了什么，再说希望对方怎样处理。",
        words: ["b2-problem", "b2n-cause", "b2n-solve", "b2n-refund", "b2n-apologize", "b2n-nextstep"],
        talk: [
          { g: "m", th: "ของพังตั้งแต่ครั้งแรก{p}", ro: "khɔ̌ɔng phang tâng-dtɛ̀ɛ khráng rɛ̂ɛk {pr}", zh: "东西第一次用就坏了。" },
          { g: "f", th: "ต้องขอโทษจริงๆ{p} จะตรวจให้{p}", ro: "dtɔ̂ɔng khɔ̌ɔ thôot jing jing {pr} jà dtrùat hâi {pr}", zh: "必须认真道歉。我来检查。" },
          { g: "m", th: "ซ่อมไม่ได้ ขอคืนเงินได้ไหม{p}", ro: "sɔ̂ɔm mâi dâai {pr} khɔ̌ɔ khʉʉn ngən dâai mǎi {pr}", zh: "修不好。能退款吗？" },
          { g: "f", th: "ได้{p} ขั้นต่อไปคือเซ็นเอกสาร{p}", ro: "dâai {pr} khân dtɔ̀ɔ bpai khʉʉ sen èek-gà-sǎan {pr}", zh: "可以。下一步是签文件。" }
        ],
        lines: [
          { th: "เกิดปัญหาตั้งแต่แรก{p}", ro: "gə̀ət bpan-hǎa tâng-dtɛ̀ɛ rɛ̂ɛk {pr}", zh: "从一开始就出了问题。", kind: "s" },
          { th: "แก้ยังไงดี{p}", ro: "gɛ̂ɛ yang-ngai dii {pr}", zh: "怎么处理合适？", kind: "q" },
          { th: "สรุปอีกครั้งได้ไหม{p}", ro: "sà-rùp ìik khráng dâai mǎi {pr}", zh: "能再总结一次吗？", kind: "q" }
        ]
      },
      {
        id: "ls-a1-time",
        level: "A1",
        title: "问现在几点",
        aim: "问钟点时宜先说现在，再问几点。女性问句用 คะ。",
        words: ["a1-now", "a1n-whattime", "a1-morning", "a1-8", "a1-minute", "a1-today"],
        talk: [
          { g: "f", kind: "q", th: "ตอนนี้กี่โมง{p}", ro: "dton-níi gìi-moong {pr}", zh: "现在几点？" },
          { g: "m", kind: "s", th: "แปดโมงเช้า{p}", ro: "bpàet moong cháao {pr}", zh: "早上八点。" },
          { g: "f", kind: "q", th: "วันนี้ไปกี่โมง{p}", ro: "wan-níi bpai gìi-moong {pr}", zh: "今天几点去？" },
          { g: "m", kind: "s", th: "ไปเก้าโมง{p}", ro: "bpai gâao moong {pr}", zh: "九点去。" },
          { g: "f", kind: "s", th: "ขออีกห้านาที{p}", ro: "khɔ̌ɔ ìik hâa naa-thii {pr}", zh: "请再给五分钟。" },
          { g: "m", kind: "s", th: "ได้{p}", ro: "dâai {pr}", zh: "可以。" }
        ],
        lines: [
          { th: "ตอนนี้กี่โมง{p}", ro: "dton-níi gìi-moong {pr}", zh: "现在几点？", kind: "q" },
          { th: "แปดโมงเช้า{p}", ro: "bpàet moong cháao {pr}", zh: "早上八点。", kind: "s" },
          { th: "วันนี้ไปกี่โมง{p}", ro: "wan-níi bpai gìi-moong {pr}", zh: "今天几点去？", kind: "q" },
          { th: "ขออีกห้านาที{p}", ro: "khɔ̌ɔ ìik hâa naa-thii {pr}", zh: "请再给五分钟。", kind: "s" },
          { th: "ไปเก้าโมง{p}", ro: "bpai gâao moong {pr}", zh: "九点去。", kind: "s" }
        ]
      },
      {
        id: "ls-a1-family",
        level: "A1",
        title: "介绍家人",
        aim: "介绍家人时宜先说谁在家，再说有几个孩子。",
        words: ["a1-family", "a1-dad", "a1-mom", "a1-child", "a1-friend", "a1n-home2"],
        talk: [
          { g: "m", kind: "s", th: "ครอบครัวอยู่ที่บ้าน{p}", ro: "khrɔ̂ɔp-khrua yûu thîi-bâan {pr}", zh: "家里人在家。" },
          { g: "f", kind: "q", th: "พ่อแม่อยู่ไหม{p}", ro: "phɔ̂ɔ mɛ̂ɛ yûu mǎi {pr}", zh: "爸爸妈妈在吗？" },
          { g: "m", kind: "s", th: "อยู่{p} มีลูกสองคน{p}", ro: "yûu {pr} mii lûuk sɔ̌ɔng khon {pr}", zh: "在。有两个孩子。" },
          { g: "f", kind: "q", th: "เพื่อนมาหาไหม{p}", ro: "phʉ̂an maa hǎa mǎi {pr}", zh: "朋友来找你吗？" },
          { g: "m", kind: "s", th: "มา{p} อยู่ด้วย{p}", ro: "maa {pr} yûu dûai {pr}", zh: "来了。在一起。" },
          { g: "f", kind: "s", th: "ขอบคุณ{p}", ro: "khɔ̀ɔp-khun {pr}", zh: "谢谢。" }
        ],
        lines: [
          { th: "ครอบครัวอยู่ที่บ้าน{p}", ro: "khrɔ̂ɔp-khrua yûu thîi-bâan {pr}", zh: "家里人在家。", kind: "s" },
          { th: "พ่อแม่อยู่ไหม{p}", ro: "phɔ̂ɔ mɛ̂ɛ yûu mǎi {pr}", zh: "爸爸妈妈在吗？", kind: "q" },
          { th: "มีลูกสองคน{p}", ro: "mii lûuk sɔ̌ɔng khon {pr}", zh: "有两个孩子。", kind: "s" },
          { th: "เพื่อนมาหา{p}", ro: "phʉ̂an maa hǎa {pr}", zh: "朋友来找我。", kind: "s" },
          { th: "อยู่ด้วย{p}", ro: "yûu dûai {pr}", zh: "在一起。", kind: "s" }
        ]
      },
      {
        id: "ls-a1-place",
        level: "A1",
        title: "找一个地方",
        aim: "找地方时宜先问在哪里，再确认是这里还是那里。",
        words: ["a1-where", "a1n-here", "a1n-there", "a1n-inside", "a1n-school", "a1n-mall"],
        talk: [
          { g: "f", kind: "q", th: "โรงเรียนอยู่ที่ไหน{p}", ro: "roong-riian yûu thîi-nǎi {pr}", zh: "学校在哪里？" },
          { g: "m", kind: "s", th: "อยู่ที่นี่{p}", ro: "yûu thîi-nîi {pr}", zh: "在这里。" },
          { g: "f", kind: "q", th: "ห้างอยู่ที่นั่นไหม{p}", ro: "hǎang yûu thîi-nân mǎi {pr}", zh: "商场在那里吗？" },
          { g: "m", kind: "s", th: "ใช่{p} อยู่ข้างใน{p}", ro: "châi {pr} yûu khâang-nai {pr}", zh: "是的。在里面。" },
          { g: "f", kind: "q", th: "ไปได้ไหม{p}", ro: "bpai dâai mǎi {pr}", zh: "能去吗？" },
          { g: "m", kind: "s", th: "ได้{p}", ro: "dâai {pr}", zh: "可以。" }
        ],
        lines: [
          { th: "อยู่ที่ไหน{p}", ro: "yûu thîi-nǎi {pr}", zh: "在哪里？", kind: "q" },
          { th: "อยู่ที่นี่{p}", ro: "yûu thîi-nîi {pr}", zh: "在这里。", kind: "s" },
          { th: "อยู่ที่นั่น{p}", ro: "yûu thîi-nân {pr}", zh: "在那里。", kind: "s" },
          { th: "อยู่ข้างใน{p}", ro: "yûu khâang-nai {pr}", zh: "在里面。", kind: "s" },
          { th: "ไปได้ไหม{p}", ro: "bpai dâai mǎi {pr}", zh: "能去吗？", kind: "q" }
        ]
      },
      {
        id: "ls-a1-rest",
        level: "A1",
        title: "说身体不舒服",
        aim: "说身体状况时宜先说现在怎样。若需要休息，可直接提出。",
        words: ["a1n-sick", "a1n-tiredbody", "a1n-rest", "a1-well", "a1-today", "a1-thanks"],
        talk: [
          { g: "f", kind: "q", th: "วันนี้สบายดีไหม{p}", ro: "wan-níi sà-baai-dii mǎi {pr}", zh: "今天好吗？" },
          { g: "m", kind: "s", th: "ไม่สบาย{p} ตัวล้า{p}", ro: "mâi sà-baai {pr} dtua-láa {pr}", zh: "不舒服。身体累。" },
          { g: "f", kind: "q", th: "ป่วยไหม{p}", ro: "bpùai mǎi {pr}", zh: "生病了吗？" },
          { g: "m", kind: "s", th: "ป่วยนิดหน่อย{p}", ro: "bpùai nít-nɔ̀i {pr}", zh: "有一点不舒服。" },
          { g: "f", kind: "s", th: "วันนี้พักผ่อน{p}", ro: "wan-níi phák-phɔ̀ɔn {pr}", zh: "今天休息。" },
          { g: "m", kind: "s", th: "ขอบคุณ{p}", ro: "khɔ̀ɔp-khun {pr}", zh: "谢谢。" }
        ],
        lines: [
          { th: "สบายดีไหม{p}", ro: "sà-baai-dii mǎi {pr}", zh: "你好吗？", kind: "q" },
          { th: "ไม่สบาย{p}", ro: "mâi sà-baai {pr}", zh: "不舒服。", kind: "s" },
          { th: "ตัวล้า{p}", ro: "dtua-láa {pr}", zh: "身体累。", kind: "s" },
          { th: "ป่วยนิดหน่อย{p}", ro: "bpùai nít-nɔ̀i {pr}", zh: "有一点不舒服。", kind: "s" },
          { th: "วันนี้พักผ่อน{p}", ro: "wan-níi phák-phɔ̀ɔn {pr}", zh: "今天休息。", kind: "s" }
        ]
      },
      {
        id: "ls-a2-way",
        level: "A2",
        title: "问路怎么走",
        aim: "问路时宜先说明自己迷路，再请对方指出转弯的地方。",
        words: ["a2-lost", "a2n-whichway", "a2n-turnleft", "a2n-gostraight", "a2-front", "a2n-nearby"],
        talk: [
          { g: "m", kind: "s", th: "หลงทาง{p}", ro: "lǒng-thaang {pr}", zh: "我迷路了。" },
          { g: "f", kind: "q", th: "ไปทางไหน{p}", ro: "bpai thaang-nǎi {pr}", zh: "走哪一条路？" },
          { g: "m", kind: "s", th: "เลี้ยวซ้าย{p} แล้วตรงไป{p}", ro: "líiao-sáai {pr} lɛ́ɛo dtrong-bpai {pr}", zh: "向左转，然后一直走。" },
          { g: "f", kind: "q", th: "อยู่ข้างหน้าไหม{p}", ro: "yûu khâang-nâa mǎi {pr}", zh: "在前面吗？" },
          { g: "m", kind: "s", th: "ใช่{p} อยู่แถวนี้{p}", ro: "châi {pr} yûu thɛ̌ɛo-níi {pr}", zh: "是的。就在这一带。" },
          { g: "f", kind: "s", th: "ขอบคุณ{p}", ro: "khɔ̀ɔp-khun {pr}", zh: "谢谢。" }
        ],
        lines: [
          { th: "หลงทาง{p}", ro: "lǒng-thaang {pr}", zh: "我迷路了。", kind: "s" },
          { th: "ไปทางไหน{p}", ro: "bpai thaang-nǎi {pr}", zh: "走哪一条路？", kind: "q" },
          { th: "เลี้ยวซ้าย{p}", ro: "líiao-sáai {pr}", zh: "向左转。", kind: "s" },
          { th: "ตรงไป{p}", ro: "dtrong-bpai {pr}", zh: "一直走。", kind: "s" },
          { th: "อยู่ข้างหน้า{p}", ro: "yûu khâang-nâa {pr}", zh: "在前面。", kind: "s" }
        ]
      },
      {
        id: "ls-a2-meet",
        level: "A2",
        title: "约定见面时间",
        aim: "约定见面时宜先问哪段时间有空。若会晚到，须先说一声。",
        words: ["a2-free", "a2-busy", "a2b-freetime", "a2b-seeyou2", "a2b-late2", "a2-call"],
        talk: [
          { g: "f", kind: "q", th: "ช่วงไหนว่าง{p}", ro: "chûang-nǎi wâang {pr}", zh: "哪段时间有空？" },
          { g: "m", kind: "s", th: "วันนี้ยุ่ง{p} พรุ่งนี้ว่าง{p}", ro: "wan-níi yûng {pr} phrûng-níi wâang {pr}", zh: "今天忙。明天有空。" },
          { g: "f", kind: "q", th: "เจอกันพรุ่งนี้ได้ไหม{p}", ro: "jəə-gan phrûng-níi dâai mǎi {pr}", zh: "明天能见面吗？" },
          { g: "m", kind: "s", th: "ได้{p} เดี๋ยวโทร{p}", ro: "dâai {pr} dǐao thoo {pr}", zh: "可以。我过一会儿打电话。" },
          { g: "f", kind: "s", th: "จะไปสาย{p}", ro: "jà-bpai-sǎai {pr}", zh: "我会晚到。" },
          { g: "m", kind: "s", th: "ไม่เป็นไร{p} เจอกันพรุ่งนี้{p}", ro: "mâi-bpèn-rai {pr} jəə-gan-phrûng-níi {pr}", zh: "没关系。明天见。" }
        ],
        lines: [
          { th: "ช่วงไหนว่าง{p}", ro: "chûang-nǎi wâang {pr}", zh: "哪段时间有空？", kind: "q" },
          { th: "วันนี้ยุ่ง{p}", ro: "wan-níi yûng {pr}", zh: "今天忙。", kind: "s" },
          { th: "พรุ่งนี้ว่าง{p}", ro: "phrûng-níi wâang {pr}", zh: "明天有空。", kind: "s" },
          { th: "จะไปสาย{p}", ro: "jà-bpai-sǎai {pr}", zh: "我会晚到。", kind: "s" },
          { th: "เจอกันพรุ่งนี้{p}", ro: "jəə-gan-phrûng-níi {pr}", zh: "明天见。", kind: "s" }
        ]
      },
      {
        id: "ls-a2-clinic",
        level: "A2",
        title: "去诊所看病",
        aim: "看病时宜先说哪里不舒服，再问是去诊所还是去医院。",
        words: ["a2b-headache", "a2n-fever2", "a2-hospital", "a2n-clinic", "a2n-pill", "a2b-resthome"],
        talk: [
          { g: "m", kind: "s", th: "ปวดหัว{p} มีไข้{p}", ro: "bpùat-hǔa {pr} mii-khâi {pr}", zh: "头疼，发烧。" },
          { g: "f", kind: "q", th: "ไปคลินิกไหม{p}", ro: "bpai khli-nìk mǎi {pr}", zh: "去诊所吗？" },
          { g: "m", kind: "s", th: "ไป{p} ไม่ไปโรงพยาบาล{p}", ro: "bpai {pr} mâi bpai roong-phá-yaa-baan {pr}", zh: "去诊所。不去医院。" },
          { g: "f", kind: "s", th: "กินยาเม็ดก่อน{p}", ro: "gin yaa-mét gɔ̀ɔn {pr}", zh: "先吃药片。" },
          { g: "m", kind: "q", th: "พักที่บ้านได้ไหม{p}", ro: "phák-thîi-bâan dâai mǎi {pr}", zh: "能在家休息吗？" },
          { g: "f", kind: "s", th: "ได้{p} เดี๋ยวดีขึ้น{p}", ro: "dâai {pr} dǐao dii-khʉ̂n {pr}", zh: "可以。过一会儿会好转。" }
        ],
        lines: [
          { th: "ปวดหัว{p}", ro: "bpùat-hǔa {pr}", zh: "头疼。", kind: "s" },
          { th: "มีไข้{p}", ro: "mii-khâi {pr}", zh: "发烧。", kind: "s" },
          { th: "ไปคลินิกไหม{p}", ro: "bpai khli-nìk mǎi {pr}", zh: "去诊所吗？", kind: "q" },
          { th: "กินยาเม็ดก่อน{p}", ro: "gin yaa-mét gɔ̀ɔn {pr}", zh: "先吃药片。", kind: "s" },
          { th: "พักที่บ้าน{p}", ro: "phák-thîi-bâan {pr}", zh: "在家休息。", kind: "s" }
        ]
      },
      {
        id: "ls-a2-weather",
        level: "A2",
        title: "看天气再出门",
        aim: "出门前宜先看天气。若雨大，可先带伞，等雨停再走。",
        words: ["a2-weather", "a2-hot", "a2-rainverb", "a2b-rainheavy", "a2n-bringumb", "a2n-rainstop"],
        talk: [
          { g: "f", kind: "q", th: "วันนี้อากาศร้อนไหม{p}", ro: "wan-níi aa-gàat rɔ́ɔn mǎi {pr}", zh: "今天天气热吗？" },
          { g: "m", kind: "s", th: "ร้อนมาก{p} แล้วฝนตก{p}", ro: "rɔ́ɔn mâak {pr} lɛ́ɛo fǒn-dtòk {pr}", zh: "很热，而且在下雨。" },
          { g: "f", kind: "q", th: "ฝนตกหนักไหม{p}", ro: "fǒn-dtòk-nàk mǎi {pr}", zh: "雨下得大吗？" },
          { g: "m", kind: "s", th: "หนัก{p} พกร่มได้{p}", ro: "nàk {pr} phók-rôm dâai {pr}", zh: "大。可以带伞。" },
          { g: "f", kind: "q", th: "ฝนหยุดแล้วไหม{p}", ro: "fǒn-yùt-lɛ́ɛo mǎi {pr}", zh: "雨停了吗？" },
          { g: "m", kind: "s", th: "หยุดแล้ว{p} ไปได้{p}", ro: "yùt lɛ́ɛo {pr} bpai dâai {pr}", zh: "停了。可以走了。" }
        ],
        lines: [
          { th: "อากาศร้อน{p}", ro: "aa-gàat rɔ́ɔn {pr}", zh: "天气热。", kind: "s" },
          { th: "ฝนตก{p}", ro: "fǒn-dtòk {pr}", zh: "下雨了。", kind: "s" },
          { th: "ฝนตกหนักไหม{p}", ro: "fǒn-dtòk-nàk mǎi {pr}", zh: "雨下得大吗？", kind: "q" },
          { th: "พกร่ม{p}", ro: "phók-rôm {pr}", zh: "带伞。", kind: "s" },
          { th: "ฝนหยุดแล้ว{p}", ro: "fǒn-yùt-lɛ́ɛo {pr}", zh: "雨停了。", kind: "s" }
        ]
      },
      {
        id: "ls-b1-plan",
        level: "B1",
        title: "说下周的计划",
        aim: "说计划时宜先说打算做什么，再补一句应该先准备什么。",
        words: ["b1-intend", "b1-plan", "b1-hope", "b1-should", "b1n-prepare", "a1n-nextweek"],
        talk: [
          { g: "f", kind: "q", th: "อาทิตย์หน้ามีแผนไหม{p}", ro: "aa-thít-nâa mii phɛ̌ɛn mǎi {pr}", zh: "下星期有计划吗？" },
          { g: "m", kind: "s", th: "ตั้งใจท่องเที่ยว{p}", ro: "dtâng-jai thɔ̂ɔng-thîao {pr}", zh: "打算去旅行。" },
          { g: "f", kind: "q", th: "ควรเตรียมอะไร{p}", ro: "khuan dtriiam à-rai {pr}", zh: "应该准备什么？" },
          { g: "m", kind: "s", th: "เตรียมของก่อน{p}", ro: "dtriiam khɔ̌ɔng gɔ̀ɔn {pr}", zh: "先把东西准备好。" },
          { g: "f", kind: "s", th: "หวังว่าอากาศดี{p}", ro: "wǎng wâa aa-gàat dii {pr}", zh: "希望天气好。" },
          { g: "m", kind: "s", th: "อาทิตย์หน้าไป{p}", ro: "aa-thít-nâa bpai {pr}", zh: "下星期去。" }
        ],
        lines: [
          { th: "มีแผนไหม{p}", ro: "mii phɛ̌ɛn mǎi {pr}", zh: "有计划吗？", kind: "q" },
          { th: "ตั้งใจท่องเที่ยว{p}", ro: "dtâng-jai thɔ̂ɔng-thîao {pr}", zh: "打算去旅行。", kind: "s" },
          { th: "ควรเตรียมก่อน{p}", ro: "khuan dtriiam gɔ̀ɔn {pr}", zh: "应该先准备。", kind: "s" },
          { th: "หวังว่าอากาศดี{p}", ro: "wǎng wâa aa-gàat dii {pr}", zh: "希望天气好。", kind: "s" },
          { th: "อาทิตย์หน้าไป{p}", ro: "aa-thít-nâa bpai {pr}", zh: "下星期去。", kind: "s" }
        ]
      },
      {
        id: "ls-b1-feel",
        level: "B1",
        title: "说今天的感受",
        aim: "说感受时宜先用 รู้สึก，再补一句原因。",
        words: ["b1-feel", "b1-happy", "b1-tired", "b1-worry", "b1-afraid", "b1n-calm"],
        talk: [
          { g: "m", kind: "q", th: "วันนี้รู้สึกยังไง{p}", ro: "wan-níi rúu-sʉ̀k yang-ngai {pr}", zh: "今天感觉怎么样？" },
          { g: "f", kind: "s", th: "เหนื่อย{p} แล้วกังวลนิดหน่อย{p}", ro: "nʉ̀ai {pr} lɛ́ɛo gang-won nít-nɔ̀i {pr}", zh: "累，而且有一点担心。" },
          { g: "m", kind: "q", th: "กลัวอะไร{p}", ro: "glua à-rai {pr}", zh: "怕什么？" },
          { g: "f", kind: "s", th: "เพราะเหนื่อยมาก{p}", ro: "phrɔ́ nʉ̀ai mâak {pr}", zh: "因为很累。" },
          { g: "m", kind: "s", th: "ใจเย็นก่อน{p}", ro: "jai-yen gɔ̀ɔn {pr}", zh: "先冷静一下。" },
          { g: "f", kind: "s", th: "ดีใจที่ได้คุย{p}", ro: "dii-jai thîi dâai khui {pr}", zh: "很高兴能谈一谈。" }
        ],
        lines: [
          { th: "รู้สึกยังไง{p}", ro: "rúu-sʉ̀k yang-ngai {pr}", zh: "感觉怎么样？", kind: "q" },
          { th: "เหนื่อยมาก{p}", ro: "nʉ̀ai mâak {pr}", zh: "很累。", kind: "s" },
          { th: "กังวลนิดหน่อย{p}", ro: "gang-won nít-nɔ̀i {pr}", zh: "有一点担心。", kind: "s" },
          { th: "ใจเย็นก่อน{p}", ro: "jai-yen gɔ̀ɔn {pr}", zh: "先冷静一下。", kind: "s" },
          { th: "ดีใจ{p}", ro: "dii-jai {pr}", zh: "我很高兴。", kind: "s" }
        ]
      },
      {
        id: "ls-b1-view",
        level: "B1",
        title: "说出自己的看法",
        aim: "说看法时宜先说自己怎么想，再问对方是否同意。",
        words: ["b1-think", "b1-agree", "b1n-reason2", "b1n-sameidea", "b1n-depend", "b1-should"],
        talk: [
          { g: "f", kind: "s", th: "ฉันคิดว่าแบบนี้ดีกว่า{p}", ro: "chǎn khít wâa bɛ̀ɛp-níi dii gwàa {pr}", zh: "我觉得这样更好。" },
          { g: "m", kind: "q", th: "เห็นด้วยไหม{p}", ro: "hěn-dûai mǎi {pr}", zh: "同意吗？" },
          { g: "f", kind: "s", th: "เห็นด้วย{p} เพราะว่าง่ายกว่า{p}", ro: "hěn-dûai {pr} phrɔ́-wâa ngâai gwàa {pr}", zh: "同意。因为更简单。" },
          { g: "m", kind: "s", th: "คิดเหมือนกัน{p}", ro: "khít-mʉ̌an-gan {pr}", zh: "想法一样。" },
          { g: "f", kind: "q", th: "แล้วแต่ไหม{p}", ro: "lɛ́ɛo-dtɛ̀ɛ mǎi {pr}", zh: "要看情况吗？" },
          { g: "m", kind: "s", th: "ใช่{p} แล้วแต่{p}", ro: "châi {pr} lɛ́ɛo-dtɛ̀ɛ {pr}", zh: "是的。要看情况。" }
        ],
        lines: [
          { th: "คิดว่าแบบนี้ดีกว่า{p}", ro: "khít wâa bɛ̀ɛp-níi dii gwàa {pr}", zh: "觉得这样更好。", kind: "s" },
          { th: "เห็นด้วยไหม{p}", ro: "hěn-dûai mǎi {pr}", zh: "同意吗？", kind: "q" },
          { th: "เพราะว่าง่ายกว่า{p}", ro: "phrɔ́-wâa ngâai gwàa {pr}", zh: "因为更简单。", kind: "s" },
          { th: "คิดเหมือนกัน{p}", ro: "khít-mʉ̌an-gan {pr}", zh: "想法一样。", kind: "s" },
          { th: "แล้วแต่{p}", ro: "lɛ́ɛo-dtɛ̀ɛ {pr}", zh: "要看情况。", kind: "s" }
        ]
      },
      {
        id: "ls-b1-study",
        level: "B1",
        title: "安排学习",
        aim: "安排学习时宜说本周复习什么，并约定下星期继续练。",
        words: ["b1n-learnthai", "b1n-practice", "b1n-review", "b1n-class", "b1-intend", "a1n-nextweek"],
        talk: [
          { g: "f", kind: "s", th: "ตั้งใจเรียนภาษาไทย{p}", ro: "dtâng-jai riian phaa-sǎa-thai {pr}", zh: "打算学泰语。" },
          { g: "m", kind: "q", th: "ทบทวนที่ห้องเรียนไหม{p}", ro: "thóp-thuan thîi hɔ̂ɔng-riian mǎi {pr}", zh: "在教室复习吗？" },
          { g: "f", kind: "s", th: "ทบทวน{p} แล้วฝึกต่อ{p}", ro: "thóp-thuan {pr} lɛ́ɛo fʉ̀k dtɔ̀ɔ {pr}", zh: "复习，然后继续练。" },
          { g: "m", kind: "q", th: "อาทิตย์หน้ามาอีกไหม{p}", ro: "aa-thít-nâa maa ìik mǎi {pr}", zh: "下星期还来吗？" },
          { g: "f", kind: "s", th: "มา{p} ตั้งใจฝึกทุกวัน{p}", ro: "maa {pr} dtâng-jai fʉ̀k thúk-wan {pr}", zh: "来。打算每天练。" },
          { g: "m", kind: "s", th: "ดี{p} เจอกันที่ห้องเรียน{p}", ro: "dii {pr} jəə-gan thîi hɔ̂ɔng-riian {pr}", zh: "好。在教室见。" }
        ],
        lines: [
          { th: "ตั้งใจเรียนภาษาไทย{p}", ro: "dtâng-jai riian phaa-sǎa-thai {pr}", zh: "打算学泰语。", kind: "s" },
          { th: "ทบทวนก่อน{p}", ro: "thóp-thuan gɔ̀ɔn {pr}", zh: "先复习。", kind: "s" },
          { th: "ฝึกต่อ{p}", ro: "fʉ̀k dtɔ̀ɔ {pr}", zh: "继续练习。", kind: "s" },
          { th: "มาห้องเรียนไหม{p}", ro: "maa hɔ̂ɔng-riian mǎi {pr}", zh: "来教室吗？", kind: "q" },
          { th: "อาทิตย์หน้ามาอีก{p}", ro: "aa-thít-nâa maa ìik {pr}", zh: "下星期再来。", kind: "s" }
        ]
      },
      {
        id: "ls-b2-why",
        level: "B2",
        title: "解释一件事的原因",
        aim: "解释时宜先说发生了什么，再说原因，最后说结果。",
        words: ["b2-happen", "b2-problem", "b2-reason", "b2n-because2", "b2n-therefore", "b2-result"],
        talk: [
          { g: "m", kind: "q", th: "เกิดอะไรขึ้น{p}", ro: "gə̀ət à-rai khʉ̂n {pr}", zh: "发生了什么？" },
          { g: "f", kind: "s", th: "เกิดปัญหา{p}", ro: "gə̀ət bpan-hǎa {pr}", zh: "出了问题。" },
          { g: "m", kind: "q", th: "เหตุผลคืออะไร{p}", ro: "hèet-phǒn khʉʉ à-rai {pr}", zh: "理由是什么？" },
          { g: "f", kind: "s", th: "เนื่องจากรถติด{p}", ro: "nʉ̂ang-jàak rót-dtìt {pr}", zh: "由于堵车。" },
          { g: "m", kind: "s", th: "ดังนั้นเลยมาสาย{p}", ro: "dang-nán ləəi maa sǎai {pr}", zh: "因此才晚到。" },
          { g: "f", kind: "s", th: "เลยเป็นแบบนี้{p}", ro: "ləəi-bpèn-bɛ̀ɛp-níi {pr}", zh: "所以变成这样。" }
        ],
        lines: [
          { th: "เกิดอะไรขึ้น{p}", ro: "gə̀ət à-rai khʉ̂n {pr}", zh: "发生了什么？", kind: "q" },
          { th: "เกิดปัญหา{p}", ro: "gə̀ət bpan-hǎa {pr}", zh: "出了问题。", kind: "s" },
          { th: "เหตุผลคืออะไร{p}", ro: "hèet-phǒn khʉʉ à-rai {pr}", zh: "理由是什么？", kind: "q" },
          { th: "เนื่องจากรถติด{p}", ro: "nʉ̂ang-jàak rót-dtìt {pr}", zh: "由于堵车。", kind: "s" },
          { th: "เลยเป็นแบบนี้{p}", ro: "ləəi-bpèn-bɛ̀ɛp-níi {pr}", zh: "所以变成这样。", kind: "s" }
        ]
      },
      {
        id: "ls-b2-talk",
        level: "B2",
        title: "讨论两种做法",
        aim: "讨论时宜先说出两种做法的不同，再决定要不要先想一想。",
        words: ["b2n-discuss", "b2n-advantage", "b2-different", "b2n-choice", "b2-sure", "b2-thinkfirst"],
        talk: [
          { g: "f", kind: "q", th: "คุยกันได้ไหม{p}", ro: "khui-gan dâai mǎi {pr}", zh: "能谈谈吗？" },
          { g: "m", kind: "s", th: "ได้{p} มีสองทาง{p}", ro: "dâai {pr} mii sɔ̌ɔng thaang {pr}", zh: "可以。有两种做法。" },
          { g: "f", kind: "q", th: "ข้อดีคืออะไร{p}", ro: "khɔ̂ɔ-dii khʉʉ à-rai {pr}", zh: "优点是什么？" },
          { g: "m", kind: "s", th: "ทางนี้ง่ายกว่า{p} อีกทางต่างกัน{p}", ro: "thaang-níi ngâai gwàa {pr} ìik thaang dtàang gan {pr}", zh: "这条更简单。另一条不一样。" },
          { g: "f", kind: "q", th: "แน่ใจไหม{p}", ro: "nɛ̂ɛ-jai mǎi {pr}", zh: "确定吗？" },
          { g: "m", kind: "s", th: "ยังไม่แน่ใจ{p} ขอคิดก่อน{p}", ro: "yang-mâi nɛ̂ɛ-jai {pr} khɔ̌ɔ-khít-gɔ̀ɔn {pr}", zh: "还不确定。让我先想一下。" }
        ],
        lines: [
          { th: "คุยกันได้ไหม{p}", ro: "khui-gan dâai mǎi {pr}", zh: "能谈谈吗？", kind: "q" },
          { th: "ข้อดีคืออะไร{p}", ro: "khɔ̂ɔ-dii khʉʉ à-rai {pr}", zh: "优点是什么？", kind: "q" },
          { th: "สองทางต่างกัน{p}", ro: "sɔ̌ɔng thaang dtàang gan {pr}", zh: "两种做法不一样。", kind: "s" },
          { th: "แน่ใจไหม{p}", ro: "nɛ̂ɛ-jai mǎi {pr}", zh: "确定吗？", kind: "q" },
          { th: "ขอคิดก่อน{p}", ro: "khɔ̌ɔ-khít-gɔ̀ɔn {pr}", zh: "让我先想一下。", kind: "s" }
        ]
      },
      {
        id: "ls-b2-delay",
        level: "B2",
        title: "商量推迟时间",
        aim: "事情延误时宜先说明原因，再提出折中办法，并问对方能否接受。",
        words: ["b2-traffic", "b2n-delay2", "b2n-postpone2", "b2n-compromise", "b2n-accept2", "b2-half"],
        talk: [
          { g: "m", kind: "s", th: "รถติด{p} มีความล่าช้า{p}", ro: "rót-dtìt {pr} mii khwaam-lâa-cháa {pr}", zh: "堵车了。有延误。" },
          { g: "f", kind: "q", th: "เลื่อนได้ไหม{p}", ro: "lʉ̂an dâai mǎi {pr}", zh: "能推迟吗？" },
          { g: "m", kind: "s", th: "ได้{p} เลื่อนหนึ่งชั่วโมง{p}", ro: "dâai {pr} lʉ̂an nʉ̀ng chûa-moong {pr}", zh: "可以。推迟一个小时。" },
          { g: "f", kind: "s", th: "งั้นประนีประนอม{p}", ro: "ngán bprà-nii-bprà-nɔɔm {pr}", zh: "那就折中。" },
          { g: "m", kind: "q", th: "ยอมรับได้ไหม{p}", ro: "yɔɔm-ráp-dâai mǎi {pr}", zh: "可以接受吗？" },
          { g: "f", kind: "s", th: "ยอมรับได้{p} คนละครึ่ง{p}", ro: "yɔɔm-ráp-dâai {pr} khon-lá-khrʉ̂ng {pr}", zh: "可以接受。一人一半。" }
        ],
        lines: [
          { th: "รถติด{p}", ro: "rót-dtìt {pr}", zh: "堵车了。", kind: "s" },
          { th: "มีความล่าช้า{p}", ro: "mii khwaam-lâa-cháa {pr}", zh: "有延误。", kind: "s" },
          { th: "เลื่อนได้ไหม{p}", ro: "lʉ̂an dâai mǎi {pr}", zh: "能推迟吗？", kind: "q" },
          { th: "งั้นประนีประนอม{p}", ro: "ngán bprà-nii-bprà-nɔɔm {pr}", zh: "那就折中。", kind: "s" },
          { th: "ยอมรับได้{p}", ro: "yɔɔm-ráp-dâai {pr}", zh: "可以接受。", kind: "s" }
        ]
      },
      {
        id: "ls-b2-handle",
        level: "B2",
        title: "处理一件突然的事",
        aim: "事情突然变坏时，宜先让对方冷静，再说必须怎么处理，以及下一步是什么。",
        words: ["b2-broken", "b2-repair", "b2-need", "b2-handle", "b2n-nextstep", "b2n-calm2"],
        talk: [
          { g: "f", kind: "s", th: "ของพัง{p}", ro: "khɔ̌ɔng phang {pr}", zh: "东西坏了。" },
          { g: "m", kind: "s", th: "ใจเย็นก่อน{p}", ro: "jai-yen-gɔ̀ɔn {pr}", zh: "先冷静。" },
          { g: "f", kind: "q", th: "ซ่อมได้ไหม{p}", ro: "sɔ̂ɔm dâai mǎi {pr}", zh: "能修吗？" },
          { g: "m", kind: "s", th: "ซ่อมไม่ได้{p} ต้องจัดการวันนี้{p}", ro: "sɔ̂ɔm mâi dâai {pr} dtɔ̂ɔng jàt-gaan wan-níi {pr}", zh: "修不了。必须今天处理。" },
          { g: "f", kind: "q", th: "ขั้นต่อไปคืออะไร{p}", ro: "khân-dtɔ̀ɔ-bpai-khʉʉ à-rai {pr}", zh: "下一步是什么？" },
          { g: "m", kind: "s", th: "ขั้นต่อไปคือหาของใหม่{p}", ro: "khân-dtɔ̀ɔ-bpai-khʉʉ hǎa khɔ̌ɔng mài {pr}", zh: "下一步是找一件新的。" }
        ],
        lines: [
          { th: "ของพัง{p}", ro: "khɔ̌ɔng phang {pr}", zh: "东西坏了。", kind: "s" },
          { th: "ใจเย็นก่อน{p}", ro: "jai-yen-gɔ̀ɔn {pr}", zh: "先冷静。", kind: "s" },
          { th: "ซ่อมได้ไหม{p}", ro: "sɔ̂ɔm dâai mǎi {pr}", zh: "能修吗？", kind: "q" },
          { th: "ต้องจัดการวันนี้{p}", ro: "dtɔ̂ɔng jàt-gaan wan-níi {pr}", zh: "必须今天处理。", kind: "s" },
          { th: "ขั้นต่อไปคืออะไร{p}", ro: "khân-dtɔ̀ɔ-bpai-khʉʉ à-rai {pr}", zh: "下一步是什么？", kind: "q" }
        ]
      }
    ]
  };
})();
