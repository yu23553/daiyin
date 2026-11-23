(function () {
  if (!window.COURSE) return;

  function line(th, ro, zh, kind) {
    return { th: th, ro: ro, zh: zh, kind: kind || "s" };
  }
  function turn(g, th, ro, zh, kind) {
    var item = { g: g, th: th, ro: ro, zh: zh };
    if (kind) item.kind = kind;
    return item;
  }

  var extra = {
    "ls-a1-meet": [
      line("ผมชื่อสมชาย{p}", "phǒm chʉ̂ʉ sǒm-chaai {pr}", "我叫颂猜。"),
      line("มาจากจีน{p}", "maa jàak jiin {pr}", "我来自中国。"),
      line("แล้วเจอกัน{p}", "lɛ́ɛo jəə gan {pr}", "回头见。")
    ],
    "ls-a1-eat": [
      line("ขอก๋วยเตี๋ยวหนึ่งชาม{p}", "khɔ̌ɔ gǔai-dtǐao nʉ̀ng chaam {pr}", "请给我一碗面。"),
      line("เผ็ดไหม{p}", "phèt mǎi {pr}", "辣吗？", "q"),
      line("ทั้งหมดห้าสิบบาท{p}", "tháng-mòt hâa-sìp bàat {pr}", "一共五十铢。")
    ],
    "ls-a1-time": [
      line("ตอนนี้แปดโมงเช้า{p}", "dtɔɔn-níi bpàet moong cháao {pr}", "现在是早上八点。"),
      line("อีกครึ่งชั่วโมง{p}", "ìik khrʉ̂ng chûa-moong {pr}", "再过半小时。"),
      line("ไปกี่โมง{p}", "bpai gìi moong {pr}", "几点去？", "q"),
      line("ไปสิบโมง{p}", "bpai sìp moong {pr}", "十点去。"),
      line("ขออีกสิบนาที{p}", "khɔ̌ɔ ìik sìp naa-thii {pr}", "请再给十分钟。")
    ],
    "ls-a1-family": [
      line("พ่ออยู่บ้าน{p}", "phɔ̂ɔ yûu bâan {pr}", "爸爸在家。"),
      line("แม่ไปตลาด{p}", "mɛ̂ɛ bpai dtà-làat {pr}", "妈妈去市场了。"),
      line("มีลูกชายหนึ่งคน{p}", "mii lûuk chaai nʉ̀ng khon {pr}", "有一个儿子。"),
      line("มีลูกสาวหนึ่งคน{p}", "mii lûuk sǎao nʉ̀ng khon {pr}", "有一个女儿。"),
      line("เพื่อนบ้านมาหา{p}", "phʉ̂an-bâan maa hǎa {pr}", "邻居来找我们。")
    ],
    "ls-a1-place": [
      line("ห้องน้ำอยู่ที่ไหน{p}", "hɔ̂ɔng-náam yûu thîi-nǎi {pr}", "洗手间在哪里？", "q"),
      line("อยู่ชั้นหนึ่ง{p}", "yûu chán nʉ̀ng {pr}", "在一楼。"),
      line("ทางออกอยู่ตรงนี้{p}", "thaang ɔ̀ɔk yûu dtrong níi {pr}", "出口在这里。"),
      line("ขึ้นบันได{p}", "khʉ̀n ban-dai {pr}", "上楼梯。"),
      line("ลิฟต์อยู่ข้างใน{p}", "líp yûu khâang-nai {pr}", "电梯在里面。")
    ],
    "ls-a1-rest": [
      line("หิวน้ำ{p}", "hǐu náam {pr}", "想喝水。"),
      line("ง่วงนิดหน่อย{p}", "ngûang nít-nɔ̀i {pr}", "有一点困。"),
      line("ปวดหัว{p}", "bpùat hǔa {pr}", "头疼。"),
      line("พักนิดหนึ่ง{p}", "phák nít nʉ̀ng {pr}", "休息一下。"),
      line("เดี๋ยวดีขึ้น{p}", "dǐao dii khʉ̂n {pr}", "过一会儿会好一些。")
    ],
    "ls-a2-taxi": [
      line("ไปโรงแรมนี้{p}", "bpai roong-rɛɛm níi {pr}", "去这家酒店。"),
      line("ไม่ไกล{p}", "mâi glai {pr}", "不远。"),
      line("ค่าโดยสารเท่าไหร่{p}", "khâa dooi-sǎan thâo-rài {pr}", "车费多少？", "q")
    ],
    "ls-a2-room": [
      line("ห้องนี้ว่าง{p}", "hɔ̂ɔng níi wâang {pr}", "这间房空着。"),
      line("มีไวไฟ{p}", "mii wai-fai {pr}", "有无线网。"),
      line("พรุ่งนี้มาดูได้{p}", "phrûng-níi maa duu dâai {pr}", "明天可以来看。")
    ],
    "ls-a2-way": [
      line("เลี้ยวขวา{p}", "líiao khwǎa {pr}", "向右转。"),
      line("แล้วตรงไป{p}", "lɛ́ɛo dtrong bpai {pr}", "然后一直走。"),
      line("อยู่ฝั่งตรงข้าม{p}", "yûu fàng dtrong-khâam {pr}", "在对面。"),
      line("เดินห้านาที{p}", "dəən hâa naa-thii {pr}", "走五分钟。"),
      line("ขอบคุณมาก{p}", "khɔ̀ɔp-khun mâak {pr}", "非常感谢。")
    ],
    "ls-a2-meet": [
      line("บ่ายนี้ว่างไหม{p}", "bàai níi wâang mǎi {pr}", "今天下午有空吗？", "q"),
      line("บ่ายนี้ไม่ว่าง{p}", "bàai níi mâi wâang {pr}", "今天下午没空。"),
      line("เย็นนี้ได้{p}", "yen níi dâai {pr}", "今天傍晚可以。"),
      line("เจอกันห้าโมง{p}", "jəə gan hâa moong {pr}", "五点见。"),
      line("ถ้าสายจะโทร{p}", "thâa sǎai jà thoo {pr}", "如果晚到，我会打电话。")
    ],
    "ls-a2-clinic": [
      line("เป็นมาตั้งแต่เมื่อเช้า{p}", "bpen maa tâng-dtɛ̀ɛ mʉ̂a cháao {pr}", "从今天早上开始就不舒服。"),
      line("ไปโรงพยาบาลไหม{p}", "bpai roong-phá-yaa-baan mǎi {pr}", "去医院吗？", "q"),
      line("ไม่ไป{p}", "mâi bpai {pr}", "不去。"),
      line("กินยาหลังอาหาร{p}", "gin yaa lǎng aa-hǎan {pr}", "饭后吃药。"),
      line("พรุ่งนี้มาอีก{p}", "phrûng-níi maa ìik {pr}", "明天再来。")
    ],
    "ls-a2-weather": [
      line("ลมแรง{p}", "lom rɛɛng {pr}", "风很大。"),
      line("พกร่มไปด้วย{p}", "phók rôm bpai dûai {pr}", "把伞带上。"),
      line("รอฝนหยุดก่อน{p}", "rɔɔ fǒn yùt gɔ̀ɔn {pr}", "等雨停再走。"),
      line("แดดออกแล้ว{p}", "dɛ̀ɛt ɔ̀ɔk lɛ́ɛo {pr}", "太阳出来了。"),
      line("ไปได้แล้ว{p}", "bpai dâai lɛ́ɛo {pr}", "可以走了。")
    ],
    "ls-b1-like": [
      line("ชอบเพลงมากกว่าหนัง{p}", "chɔ̂ɔp phleeeng mâak gwàa nǎng {pr}", "比起电影，我更喜欢歌。"),
      line("เพราะฟังตอนทำงานได้{p}", "phrɔ́ fang dtɔɔn tham ngaan dâai {pr}", "因为工作时也能听。"),
      line("คุณชอบอะไร{p}", "khun chɔ̂ɔp à-rai {pr}", "你喜欢什么？", "q")
    ],
    "ls-b1-past": [
      line("เคยไปสองครั้ง{p}", "khəəi bpai sɔ̌ɔng khráng {pr}", "去过两次。"),
      line("ครั้งที่สองปีนี้{p}", "khráng thîi sɔ̌ɔng bpii níi {pr}", "第二次是今年。"),
      line("ยังจำทางได้{p}", "yang jam thaang dâai {pr}", "路还记得。")
    ],
    "ls-b1-plan": [
      line("อาทิตย์หน้าตั้งใจพัก{p}", "aa-thít nâa dtâng-jai phák {pr}", "下星期打算休息。"),
      line("ควรจองที่ก่อน{p}", "khuan jɔɔng thîi gɔ̀ɔn {pr}", "应该先订地方。"),
      line("ถ้าฝนตกจะเลื่อน{p}", "thâa fǒn dtòk jà lʉ̂an {pr}", "如果下雨就改期。"),
      line("เตรียมร่มไว้{p}", "dtriiam rôm wái {pr}", "把伞准备好。"),
      line("หวังว่าจะไปได้{p}", "wǎng wâa jà bpai dâai {pr}", "希望能去成。")
    ],
    "ls-b1-feel": [
      line("รู้สึกดีขึ้น{p}", "rúu-sʉ̀k dii khʉ̂n {pr}", "感觉好一些了。"),
      line("เมื่อเช้ากังวล{p}", "mʉ̂a cháao gang-won {pr}", "早上还在担心。"),
      line("ตอนนี้ใจเย็นแล้ว{p}", "dtɔɔn-níi jai-yen lɛ́ɛo {pr}", "现在冷静下来了。"),
      line("เพราะได้พัก{p}", "phrɔ́ dâai phák {pr}", "因为休息过了。"),
      line("ขอบคุณที่ฟัง{p}", "khɔ̀ɔp-khun thîi fang {pr}", "谢谢你听我说。")
    ],
    "ls-b1-view": [
      line("อีกด้านหนึ่งก็มีเหตุผล{p}", "ìik dâan nʉ̀ng gɔ̂ mii hèet-phǒn {pr}", "另一方面也有道理。"),
      line("ฉันเห็นด้วยบางส่วน{p}", "chǎn hěn dûai baang sùan {pr}", "我部分同意。"),
      line("ตรงนี้ยังไม่แน่ใจ{p}", "dtrong níi yang mâi nɛ̂ɛ-jai {pr}", "这一点还不确定。"),
      line("ขอก่อนตัดสินใจ{p}", "khɔ̌ɔ gɔ̀ɔn dtàt-sǐn-jai {pr}", "决定之前再想一想。"),
      line("คุณคิดว่าไง{p}", "khun khít wâa ngai {pr}", "你怎么看？", "q")
    ],
    "ls-b1-study": [
      line("วันนี้ฝึกสิบนาที{p}", "wan-níi fʉ̀k sìp naa-thii {pr}", "今天练十分钟。"),
      line("พูดตามประโยค{p}", "phûut dtaam bprà-yòok {pr}", "跟着句子说。"),
      line("คำนี้ยังไม่ชัด{p}", "kham níi yang mâi chát {pr}", "这个词还不清楚。"),
      line("ขอให้พูดช้า{p}", "khɔ̌ɔ hâi phûut cháa {pr}", "请说慢一点。"),
      line("อาทิตย์หน้าทบทวนข้อที่ผิด{p}", "aa-thít nâa thóp-thuan khɔ̂ɔ thîi phìt {pr}", "下星期复习错的地方。")
    ],
    "ls-b2-price": [
      line("งบมีจำกัด{p}", "ngóp mii jam-gàt {pr}", "预算有限。"),
      line("ถ้าราคานี้รับได้{p}", "thâa raa-khaa níi ráp dâai {pr}", "如果是这个价钱，可以接受。"),
      line("ต่ำกว่านี้ไม่ได้{p}", "dtàm gwàa níi mâi dâai {pr}", "不能再低了。")
    ],
    "ls-b2-problem": [
      line("ของใช้ครั้งแรกก็พัง{p}", "khɔ̌ɔng chái khráng rɛ̂ɛk gɔ̂ phang {pr}", "第一次用就坏了。"),
      line("ซ่อมไม่คุ้ม{p}", "sɔ̂ɔm mâi khúm {pr}", "修不划算。"),
      line("ขอเปลี่ยนของใหม่{p}", "khɔ̌ɔ bplìan khɔ̌ɔng mài {pr}", "想换一件新的。")
    ],
    "ls-b2-why": [
      line("ขั้นแรกคือรถติด{p}", "khân rɛ̂ɛk khʉʉ rót dtìt {pr}", "第一步原因是堵车。"),
      line("เลยออกจากบ้านช้า{p}", "ləəi ɔ̀ɔk jàak bâan cháa {pr}", "所以出门晚了。"),
      line("ไม่ได้ตั้งใจมาสาย{p}", "mâi dâai dtâng-jai maa sǎai {pr}", "不是故意晚到。"),
      line("ผลคือประชุมเริ่มแล้ว{p}", "phǒn khʉʉ bprà-chum rə̂əm lɛ́ɛo {pr}", "结果是会已经开始了。"),
      line("ครั้งหน้าจะออกก่อน{p}", "khráng nâa jà ɔ̀ɔk gɔ̀ɔn {pr}", "下一次会提前出门。")
    ],
    "ls-b2-talk": [
      line("ทางแรกเร็วกว่า{p}", "thaang rɛ̂ɛk reo gwàa {pr}", "第一种更快。"),
      line("ทางที่สองชัดกว่า{p}", "thaang thîi sɔ̌ɔng chát gwàa {pr}", "第二种更清楚。"),
      line("ได้อย่างเสียอย่าง{p}", "dâai yàang sǐa yàang {pr}", "有得也有失。"),
      line("ฉันเอนไปทางที่สอง{p}", "chǎn een bpai thaang thîi sɔ̌ɔng {pr}", "我倾向第二种。"),
      line("คุณเอนไปทางไหน{p}", "khun een bpai thaang nǎi {pr}", "你倾向哪一种？", "q")
    ],
    "ls-b2-delay": [
      line("เลื่อนหนึ่งชั่วโมงพอไหม{p}", "lʉ̂an nʉ̀ng chûa-moong phɔɔ mǎi {pr}", "推迟一小时可以吗？", "q"),
      line("ครึ่งชั่วโมงก็ได้{p}", "khrʉ̂ng chûa-moong gɔ̂ dâai {pr}", "半小时也可以。"),
      line("ตรงนี้ยอมได้นิดหนึ่ง{p}", "dtrong níi yɔɔm dâai nít nʉ̀ng {pr}", "这一点可以让一点。"),
      line("อีกจุดหนึ่งยอมไม่ได้{p}", "ìik jùt nʉ̀ng yɔɔm mâi dâai {pr}", "另一点不能让。"),
      line("งั้นตกลงตามนี้{p}", "ngán dtòk-long dtaam níi {pr}", "那就按这个定。")
    ],
    "ls-b2-handle": [
      line("อย่าเพิ่งตัดสิน{p}", "yàa phə̂əng dtàt-sǐn {pr}", "先不要马上做决定。"),
      line("ขอดูหลักฐานก่อน{p}", "khɔ̌ɔ duu làk-thǎan gɔ̀ɔn {pr}", "先看一下依据。"),
      line("ถ้าซ่อมไม่ได้ให้เปลี่ยน{p}", "thâa sɔ̂ɔm mâi dâai hâi bplìan {pr}", "如果修不好，就更换。"),
      line("แจ้งลูกค้าตามตรง{p}", "jɛ̂ɛng lûuk-kháa dtaam dtrong {pr}", "如实告诉客户。"),
      line("ขั้นต่อไปคือหาของใหม่{p}", "khân dtɔ̀ɔ bpai khʉʉ hǎa khɔ̌ɔng mài {pr}", "下一步是找一件新的。")
    ]
  };

  COURSE.lessons.forEach(function (lesson) {
    var more = extra[lesson.id];
    if (more) lesson.lines = lesson.lines.concat(more);
  });

  var added = [
    {
      id: "ls-a1-fruit",
      level: "A1",
      title: "买水果",
      aim: "买水果时宜先说要哪一种，再问几公斤。问句末尾，女性用 คะ。",
      words: ["a1g-melon", "a1g-pineapple", "a1g-papaya", "a1g-guava", "a1g-grape", "a1g-howmanykilo"],
      talk: [
        turn("f", "ขอแตงโมหนึ่งลูก{p}", "khɔ̌ɔ dtɛɛng-moo nʉ̀ng lûuk {pr}", "请给我一个西瓜。"),
        turn("m", "เอาสับปะรดด้วยไหม{p}", "ao sàp-bpà-rót dûai mǎi {pr}", "要再加一个菠萝吗？", "q"),
        turn("f", "เอาครึ่งลูก{p} มะละกอกี่กิโล{p}", "ao khrʉ̂ng lûuk {pr} má-lá-gɔɔ gìi gì-loo {pr}", "要半个。木瓜几公斤？", "q"),
        turn("m", "หนึ่งกิโล{p} ฝรั่งหวาน{p}", "nʉ̀ng gì-loo {pr} fà-ràng wǎan {pr}", "一公斤。番石榴甜。"),
        turn("f", "ขอองุ่นด้วย{p}", "khɔ̌ɔ à-ngùn dûai {pr}", "再要一些葡萄。"),
        turn("m", "ได้{p} รวมแล้วยี่สิบบาท{p}", "dâai {pr} ruam lɛ́ɛo yîi-sìp bàat {pr}", "可以。一共二十铢。")
      ],
      lines: [
        line("ขอแตงโม{p}", "khɔ̌ɔ dtɛɛng-moo {pr}", "请给我西瓜。"),
        line("สับปะรดหวานไหม{p}", "sàp-bpà-rót wǎan mǎi {pr}", "菠萝甜吗？", "q"),
        line("มะละกอกี่กิโล{p}", "má-lá-gɔɔ gìi gì-loo {pr}", "木瓜几公斤？", "q"),
        line("หนึ่งกิโล{p}", "nʉ̀ng gì-loo {pr}", "一公斤。"),
        line("ฝรั่งสด{p}", "fà-ràng sòt {pr}", "番石榴新鲜。"),
        line("ขอองุ่นหน่อย{p}", "khɔ̌ɔ à-ngùn nɔ̀i {pr}", "请给我一点葡萄。"),
        line("ครึ่งกิโลพอ{p}", "khrʉ̂ng gì-loo phɔɔ {pr}", "半公斤就够。"),
        line("ใส่ถุงให้ด้วย{p}", "sài thǔng hâi dûai {pr}", "请帮我装袋。")
      ]
    },
    {
      id: "ls-a1-bus",
      level: "A1",
      title: "坐公交车",
      aim: "上车前宜确认这一站，下车前宜说下一站。",
      words: ["a2-bus", "a2b-bustop", "a2-ticket", "a1g-geton", "a1g-getoff", "a2b-nextstop"],
      talk: [
        turn("f", "ป้ายรถเมล์อยู่ที่ไหน{p}", "bpàai rót-mee yûu thîi-nǎi {pr}", "公交站在哪里？", "q"),
        turn("m", "อยู่ตรงนี้{p} ขึ้นรถได้{p}", "yûu dtrong níi {pr} khʉ̀n rót dâai {pr}", "就在这里。可以上车。"),
        turn("f", "ตั๋วเท่าไหร่{p}", "dtǔa thâo-rài {pr}", "票多少钱？", "q"),
        turn("m", "ยี่สิบบาท{p}", "yîi-sìp bàat {pr}", "二十铢。"),
        turn("f", "ป้ายหน้าลงได้ไหม{p}", "bpàai nâa long dâai mǎi {pr}", "下一站能下吗？", "q"),
        turn("m", "ได้{p} ลงรถตรงป้ายนี้{p}", "dâai {pr} long rót dtrong bpàai níi {pr}", "可以。就在这一站下。")
      ],
      lines: [
        line("รถเมล์มาแล้ว{p}", "rót-mee maa lɛ́ɛo {pr}", "公交车来了。"),
        line("ขึ้นรถตรงนี้{p}", "khʉ̀n rót dtrong níi {pr}", "在这里上车。"),
        line("ขอตั๋วหนึ่งใบ{p}", "khɔ̌ɔ dtǔa nʉ̀ng bai {pr}", "请给我一张票。"),
        line("ป้ายนี้นานไหม{p}", "bpàai níi naan mǎi {pr}", "这一站还要很久吗？", "q"),
        line("ป้ายหน้าลง{p}", "bpàai nâa long {pr}", "下一站下。"),
        line("ลงรถได้ไหม{p}", "long rót dâai mǎi {pr}", "可以下车吗？", "q"),
        line("ขอบคุณ{p}", "khɔ̀ɔp-khun {pr}", "谢谢。"),
        line("ป้ายรถเมล์อยู่ซ้าย{p}", "bpàai rót-mee yûu sáai {pr}", "公交站在左边。")
      ]
    },
    {
      id: "ls-a1-drink",
      level: "A1",
      title: "点一杯喝的",
      aim: "点饮料时宜说明冷热，并说明要不要糖。",
      words: ["a2b-icetea", "a2b-icecoffee", "a1g-hotwater", "a1g-warmwater", "a1g-nosugar", "a1g-lesssweet"],
      talk: [
        turn("f", "ขอชาเย็นแก้วหนึ่ง{p}", "khɔ̌ɔ chaa-yen gɛ̂ɛo nʉ̀ng {pr}", "请给我一杯冰奶茶。"),
        turn("m", "หวานน้อยไหม{p}", "wǎan nɔ́ɔi mǎi {pr}", "少甜吗？", "q"),
        turn("f", "ไม่ใส่น้ำตาล{p}", "mâi sài náam-dtaan {pr}", "不加糖。"),
        turn("m", "กาแฟเย็นด้วยไหม{p}", "gaa-fɛɛ-yen dûai mǎi {pr}", "要再加一杯冰咖啡吗？", "q"),
        turn("f", "ไม่เอา{p} ขอน้ำร้อน{p}", "mâi ao {pr} khɔ̌ɔ náam-rɔ̂ɔn {pr}", "不要。请给我热水。"),
        turn("m", "น้ำอุ่นก็มี{p}", "náam-ùn gɔ̂ mii {pr}", "也有温水。")
      ],
      lines: [
        line("ขอชาเย็น{p}", "khɔ̌ɔ chaa-yen {pr}", "请给我冰奶茶。"),
        line("กาแฟเย็นหวานน้อย{p}", "gaa-fɛɛ-yen wǎan nɔ́ɔi {pr}", "冰咖啡少甜。"),
        line("ไม่ใส่น้ำตาล{p}", "mâi sài náam-dtaan {pr}", "不加糖。"),
        line("ขอน้ำร้อน{p}", "khɔ̌ɔ náam-rɔ̂ɔn {pr}", "请给我热水。"),
        line("น้ำอุ่นได้ไหม{p}", "náam-ùn dâai mǎi {pr}", "可以要温水吗？", "q"),
        line("ได้{p}", "dâai {pr}", "可以。"),
        line("แก้วนี้ร้อน{p}", "gɛ̂ɛo níi rɔ́ɔn {pr}", "这杯是热的。"),
        line("ขอบคุณ{p}", "khɔ̀ɔp-khun {pr}", "谢谢。")
      ]
    },
    {
      id: "ls-a1-shop",
      level: "A1",
      title: "买日用品",
      aim: "买日用品时宜先说要什么，付钱后宜要收据。",
      words: ["a1g-tissue", "a1g-detergent", "a1g-battery", "a1g-bulb", "a2n-bag2", "a2-receipt"],
      talk: [
        turn("f", "ขอทิชชู่หนึ่งห่อ{p}", "khɔ̌ɔ thít-chûu nʉ̀ng hɔ̀ɔ {pr}", "请给我一包纸巾。"),
        turn("m", "ผงซักฟอกอยู่ชั้นสอง{p}", "phǒng-sák-fɔ̂ɔk yûu chán sɔ̌ɔng {pr}", "洗衣粉在二楼。"),
        turn("f", "ขอถ่านด้วย{p} หลอดไฟมีไหม{p}", "khɔ̌ɔ thàan dûai {pr} lɔ̀ɔt-fai mii mǎi {pr}", "再要电池。有灯泡吗？", "q"),
        turn("m", "มี{p} ใส่ถุงพลาสติกไหม{p}", "mii {pr} sài thǔng phlaat-sà-dtìk mǎi {pr}", "有。要装塑料袋吗？", "q"),
        turn("f", "ใส่ถุง{p} ขอบิลด้วย{p}", "sài thǔng {pr} khɔ̌ɔ bin dûai {pr}", "装袋。请给收据。"),
        turn("m", "ได้{p} นี่ใบเสร็จ{p}", "dâai {pr} nîi bai-sèt {pr}", "可以。这是收据。")
      ],
      lines: [
        line("ขอทิชชู่{p}", "khɔ̌ɔ thít-chûu {pr}", "请给我纸巾。"),
        line("ผงซักฟอกอันนี้{p}", "phǒng-sák-fɔ̂ɔk an-níi {pr}", "要这袋洗衣粉。"),
        line("ถ่านเท่าไหร่{p}", "thàan thâo-rài {pr}", "电池多少钱？", "q"),
        line("หลอดไฟอยู่ไหน{p}", "lɔ̀ɔt-fai yûu nǎi {pr}", "灯泡在哪里？", "q"),
        line("ขอถุงพลาสติก{p}", "khɔ̌ɔ thǔng phlaat-sà-dtìk {pr}", "请给我一个塑料袋。"),
        line("ขอบิล{p}", "khɔ̌ɔ bin {pr}", "请给收据。"),
        line("นี่ใบเสร็จ{p}", "nîi bai-sèt {pr}", "这是收据。"),
        line("ขอบคุณ{p}", "khɔ̀ɔp-khun {pr}", "谢谢。")
      ]
    },
    {
      id: "ls-a1-hungry",
      level: "A1",
      title: "说饿了累了",
      aim: "说身体状况时宜先说饿、渴或困。若需要休息，可直接提出。",
      words: ["a1-hungry", "a1g-thirsty", "a1g-sleepy", "a2-full", "a1g-sweat", "a1g-restbit"],
      talk: [
        turn("m", "หิวมาก{p}", "hǐu mâak {pr}", "很饿。"),
        turn("f", "กระหายน้ำไหม{p}", "grà-hǎai náam mǎi {pr}", "渴吗？", "q"),
        turn("m", "กระหาย{p} เหงื่อออก{p}", "grà-hǎai {pr} ngʉ̀a ɔ̀ɔk {pr}", "渴。出汗了。"),
        turn("f", "กินก่อนนะ{p} พักนิดหนึ่ง{p}", "gin gɔ̀ɔn ná {pr} phák nít nʉ̀ng {pr}", "先吃。休息一下。"),
        turn("m", "อิ่มแล้ว{p} แต่ง่วง{p}", "ìm lɛ́ɛo {pr} dtɛ̀ɛ ngûang {pr}", "饱了。可是困。"),
        turn("f", "งั้นพักก่อน{p}", "ngán phák gɔ̀ɔn {pr}", "那就先休息。")
      ],
      lines: [
        line("หิว{p}", "hǐu {pr}", "饿了。"),
        line("กระหายน้ำ{p}", "grà-hǎai náam {pr}", "口渴。"),
        line("เหงื่อออก{p}", "ngʉ̀a ɔ̀ɔk {pr}", "出汗了。"),
        line("ง่วงไหม{p}", "ngûang mǎi {pr}", "困吗？", "q"),
        line("ง่วงนิดหน่อย{p}", "ngûang nít-nɔ̀i {pr}", "有一点困。"),
        line("อิ่มแล้ว{p}", "ìm lɛ́ɛo {pr}", "饱了。"),
        line("พักนิดหนึ่ง{p}", "phák nít nʉ̀ng {pr}", "休息一下。"),
        line("เดี๋ยวไปต่อ{p}", "dǐao bpai dtɔ̀ɔ {pr}", "过一会儿再走。")
      ]
    },
    {
      id: "ls-a1-home",
      level: "A1",
      title: "在家里",
      aim: "在家里找东西时宜先说在哪个房间，再说开灯或锁门。",
      words: ["a1g-kitchen", "a2n-stairs", "a1g-turnon", "a1g-turnoff", "a1g-lockdoor", "a1g-doorbell"],
      talk: [
        turn("f", "ห้องครัวอยู่ไหน{p}", "hɔ̂ɔng-khrua yûu nǎi {pr}", "厨房在哪里？", "q"),
        turn("m", "ขึ้นบันได{p} แล้วเลี้ยวซ้าย{p}", "khʉ̀n ban-dai {pr} lɛ́ɛo líiao sáai {pr}", "上楼梯，然后向左转。"),
        turn("f", "เปิดไฟหน่อย{p}", "bpə̀ət fai nɔ̀i {pr}", "请开灯。"),
        turn("m", "ได้{p} กริ่งดัง{p}", "dâai {pr} grìng dang {pr}", "好。门铃响了。"),
        turn("f", "ใครมา{p}", "khrai maa {pr}", "谁来了？", "q"),
        turn("m", "เพื่อน{p} ปิดไฟก่อนออก{p} ล็อกประตูด้วย{p}", "phʉ̂an {pr} bpìt fai gɔ̀ɔn ɔ̀ɔk {pr} lɔ́k bprà-dtuu dûai {pr}", "朋友。出门前关灯，并把门锁上。")
      ],
      lines: [
        line("ห้องครัวอยู่ชั้นล่าง{p}", "hɔ̂ɔng-khrua yûu chán lâang {pr}", "厨房在楼下。"),
        line("ขึ้นบันได{p}", "khʉ̀n ban-dai {pr}", "上楼梯。"),
        line("เปิดไฟ{p}", "bpə̀ət fai {pr}", "开灯。"),
        line("ปิดไฟได้ไหม{p}", "bpìt fai dâai mǎi {pr}", "能关灯吗？", "q"),
        line("กดกริ่ง{p}", "gòt grìng {pr}", "按门铃。"),
        line("ใครเคาะประตู{p}", "khrai khɔ̀ bprà-dtuu {pr}", "谁在敲门？", "q"),
        line("ล็อกประตู{p}", "lɔ́k bprà-dtuu {pr}", "锁门。"),
        line("ออกแล้วปิดไฟ{p}", "ɔ̀ɔk lɛ́ɛo bpìt fai {pr}", "出门后把灯关了。")
      ]
    },
    {
      id: "ls-a2-post",
      level: "A2",
      title: "寄一个包裹",
      aim: "寄包裹时宜说地址、邮编和重量。易碎的物品须先说明。",
      words: ["a2b-parcel", "a2n-address", "a2g-postcode", "a2g-weight", "a2g-fragile", "a1n-send"],
      talk: [
        turn("f", "ส่งพัสดุนี้ได้ไหม{p}", "sòng phát-sà-dù níi dâai mǎi {pr}", "能寄这个包裹吗？", "q"),
        turn("m", "ได้{p} ที่อยู่ครบไหม{p}", "dâai {pr} thîi-yùu khróp mǎi {pr}", "可以。地址全吗？", "q"),
        turn("f", "ครบ{p} นี่รหัสไปรษณีย์{p}", "khróp {pr} nîi rá-hàt bprai-sà-nii {pr}", "全。这是邮编。"),
        turn("m", "น้ำหนักเท่าไหร่{p}", "náam-nàk thâo-rài {pr}", "多重？", "q"),
        turn("f", "หนึ่งกิโล{p} แตกง่าย{p}", "nʉ̀ng gì-loo {pr} dtɛ̀ɛk ngâai {pr}", "一公斤。易碎。"),
        turn("m", "ได้{p} จะเขียนไว้บนกล่อง{p}", "dâai {pr} jà khǐan wái bon glɔ̀ɔng {pr}", "好。我会写在盒子上。")
      ],
      lines: [
        line("ส่งพัสดุ{p}", "sòng phát-sà-dù {pr}", "寄包裹。"),
        line("ที่อยู่นี่{p}", "thîi-yùu nîi {pr}", "地址在这里。"),
        line("รหัสไปรษณีย์เท่าไหร่{p}", "rá-hàt bprai-sà-nii thâo-rài {pr}", "邮编是多少？", "q"),
        line("น้ำหนักหนึ่งกิโล{p}", "náam-nàk nʉ̀ng gì-loo {pr}", "重一公斤。"),
        line("อันนี้แตกง่าย{p}", "an-níi dtɛ̀ɛk ngâai {pr}", "这个易碎。"),
        line("เขียนไว้ด้วย{p}", "khǐan wái dûai {pr}", "请一并写上。"),
        line("ส่งวันนี้ได้ไหม{p}", "sòng wan-níi dâai mǎi {pr}", "今天能寄出吗？", "q"),
        line("ได้{p}", "dâai {pr}", "可以。")
      ]
    },
    {
      id: "ls-a2-money",
      level: "A2",
      title: "付钱和找零",
      aim: "付钱时宜说明付现金还是刷卡。若需要零钱，可先提出。",
      words: ["a2n-change", "a2g-coin", "a2g-smallmoney", "a2-fit", "a2n-cash", "a2g-cardpay"],
      talk: [
        turn("m", "จ่ายเงินสด{p}", "jàai ngən sòt {pr}", "付现金。"),
        turn("f", "มีเงินย่อยไหม{p}", "mii ngən yɔ̂i mǎi {pr}", "有零钱吗？", "q"),
        turn("m", "มีเหรียญ{p} ทอนพอดี{p}", "mii rǐan {pr} thɔɔn phɔɔ-dii {pr}", "有硬币。找零刚好。"),
        turn("f", "จ่ายบัตรได้ไหม{p}", "jàai bàt dâai mǎi {pr}", "能刷卡吗？", "q"),
        turn("m", "ได้{p} ไม่ต้องทอน{p}", "dâai {pr} mâi dtɔ̂ɔng thɔɔn {pr}", "可以。不用找零。"),
        turn("f", "ขอบิลด้วย{p}", "khɔ̌ɔ bin dûai {pr}", "请给收据。")
      ],
      lines: [
        line("จ่ายเงินสด{p}", "jàai ngən sòt {pr}", "付现金。"),
        line("จ่ายบัตรได้ไหม{p}", "jàai bàt dâai mǎi {pr}", "能刷卡吗？", "q"),
        line("ขอเงินย่อย{p}", "khɔ̌ɔ ngən yɔ̂i {pr}", "请给零钱。"),
        line("มีเหรียญไหม{p}", "mii rǐan mǎi {pr}", "有硬币吗？", "q"),
        line("ทอนพอดี{p}", "thɔɔn phɔɔ-dii {pr}", "找零刚好。"),
        line("ไม่ต้องทอน{p}", "mâi dtɔ̂ɔng thɔɔn {pr}", "不用找零。"),
        line("เงินทอนนี่{p}", "ngən thɔɔn nîi {pr}", "这是找的钱。"),
        line("ขอบคุณ{p}", "khɔ̀ɔp-khun {pr}", "谢谢。")
      ]
    },
    {
      id: "ls-a2-laundry",
      level: "A2",
      title: "把衣服送去洗",
      aim: "送洗衣服时宜说明污渍，并问什么时候能取。",
      words: ["a2g-laundry", "a2g-wash", "a2g-iron", "a2g-stain", "a2g-readywhen", "a2g-pickup"],
      talk: [
        turn("f", "ซักผ้านี้ได้ไหม{p}", "sák phâa níi dâai mǎi {pr}", "能洗这件衣服吗？", "q"),
        turn("m", "ได้{p} มีคราบตรงนี้{p}", "dâai {pr} mii khrâap dtrong níi {pr}", "可以。这里有污渍。"),
        turn("f", "รีดผ้าด้วย{p} ได้เมื่อไหร่{p}", "rîit phâa dûai {pr} dâai mʉ̂a-rài {pr}", "请一并熨。什么时候好？", "q"),
        turn("m", "พรุ่งนี้เย็น{p}", "phrûng-níi yen {pr}", "明天傍晚。"),
        turn("f", "มารับเอง{p}", "maa ráp eeng {pr}", "我自己来取。"),
        turn("m", "ได้{p} เก็บบิลไว้{p}", "dâai {pr} gèp bin wái {pr}", "好。把单据留着。")
      ],
      lines: [
        line("ไปร้านซักผ้า{p}", "bpai ráan sák phâa {pr}", "去洗衣店。"),
        line("ซักผ้านี้{p}", "sák phâa níi {pr}", "洗这件。"),
        line("มีคราบ{p}", "mii khrâap {pr}", "有污渍。"),
        line("รีดผ้าด้วยไหม{p}", "rîit phâa dûai mǎi {pr}", "要一并熨吗？", "q"),
        line("ได้เมื่อไหร่{p}", "dâai mʉ̂a-rài {pr}", "什么时候好？", "q"),
        line("พรุ่งนี้เย็น{p}", "phrûng-níi yen {pr}", "明天傍晚。"),
        line("มารับเอง{p}", "maa ráp eeng {pr}", "我自己来取。"),
        line("เก็บบิลไว้{p}", "gèp bin wái {pr}", "把单据留着。")
      ]
    },
    {
      id: "ls-a2-battery",
      level: "A2",
      title: "手机没电了",
      aim: "手机快没电时宜先说明，再借用充电器。用完须归还。",
      words: ["a2b-charger", "a2g-cable", "a2g-powerbank", "a2g-dead", "a2g-lowbat", "a2g-borrow"],
      talk: [
        turn("m", "แบตหมด{p}", "bɛ̀ɛt mòt {pr}", "没电了。"),
        turn("f", "มีที่ชาร์จไหม{p}", "mii thîi cháat mǎi {pr}", "有充电器吗？", "q"),
        turn("m", "มีสายชาร์จ{p} ขอยืมได้{p}", "mii sǎai cháat {pr} khɔ̌ɔ yʉʉm dâai {pr}", "有充电线。可以借。"),
        turn("f", "แบตใกล้หมดเหมือนกัน{p}", "bɛ̀ɛt glâi mòt mʉ̌an gan {pr}", "我的也快没电了。"),
        turn("m", "ใช้แบตสำรองก่อน{p}", "chái bɛ̀ɛt sǎm-rɔɔng gɔ̀ɔn {pr}", "先用充电宝。"),
        turn("f", "ขอบคุณ{p} เดี๋ยวคืน{p}", "khɔ̀ɔp-khun {pr} dǐao khʉʉn {pr}", "谢谢。我回头还你。")
      ],
      lines: [
        line("แบตหมด{p}", "bɛ̀ɛt mòt {pr}", "没电了。"),
        line("แบตใกล้หมด{p}", "bɛ̀ɛt glâi mòt {pr}", "快没电了。"),
        line("ขอที่ชาร์จหน่อย{p}", "khɔ̌ɔ thîi cháat nɔ̀i {pr}", "请借我充电器。"),
        line("มีสายชาร์จไหม{p}", "mii sǎai cháat mǎi {pr}", "有充电线吗？", "q"),
        line("ใช้แบตสำรอง{p}", "chái bɛ̀ɛt sǎm-rɔɔng {pr}", "用充电宝。"),
        line("ขอยืมได้ไหม{p}", "khɔ̌ɔ yʉʉm dâai mǎi {pr}", "能借用吗？", "q"),
        line("เดี๋ยวคืน{p}", "dǐao khʉʉn {pr}", "回头还你。"),
        line("ขอบคุณ{p}", "khɔ̀ɔp-khun {pr}", "谢谢。")
      ]
    },
    {
      id: "ls-a2-hair",
      level: "A2",
      title: "预约理发",
      aim: "理发前宜先预约。到店后宜说明剪短多少，或要求与上次一样。",
      words: ["a2g-haircut", "a2g-washhair", "a2g-short2", "a2g-sameas", "a2-appt", "a2n-bookverb"],
      talk: [
        turn("f", "จองตัดผมได้ไหม{p}", "jɔɔng dtàt phǒm dâai mǎi {pr}", "能预约理发吗？", "q"),
        turn("m", "ได้{p} ช่วงบ่ายว่าง{p}", "dâai {pr} chûang bàai wâang {pr}", "可以。下午有空。"),
        turn("f", "ขอสั้นหน่อย{p} สระผมด้วย{p}", "khɔ̌ɔ sân nɔ̀i {pr} sà-rà phǒm dûai {pr}", "请剪短一点，并洗头。"),
        turn("m", "เหมือนเดิมไหม{p}", "mʉ̌an dəəm mǎi {pr}", "和上次一样吗？", "q"),
        turn("f", "เหมือนเดิม{p} นัดสองโมง{p}", "mʉ̌an dəəm {pr} nát sɔ̌ɔng moong {pr}", "和上次一样。约两点。"),
        turn("m", "จดไว้แล้ว{p}", "jòt wái lɛ́ɛo {pr}", "记下了。")
      ],
      lines: [
        line("ขอจองตัดผม{p}", "khɔ̌ɔ jɔɔng dtàt phǒm {pr}", "想预约理发。"),
        line("ช่วงไหนว่าง{p}", "chûang nǎi wâang {pr}", "哪段时间有空？", "q"),
        line("ช่วงบ่ายได้{p}", "chûang bàai dâai {pr}", "下午可以。"),
        line("สั้นหน่อย{p}", "sân nɔ̀i {pr}", "剪短一点。"),
        line("เหมือนเดิม{p}", "mʉ̌an dəəm {pr}", "和上次一样。"),
        line("สระผมด้วย{p}", "sà-rà phǒm dûai {pr}", "请一并洗头。"),
        line("นัดสองโมง{p}", "nát sɔ̌ɔng moong {pr}", "约两点。"),
        line("ขอบคุณ{p}", "khɔ̀ɔp-khun {pr}", "谢谢。")
      ]
    },
    {
      id: "ls-a2-rainday",
      level: "A2",
      title: "下雨就改约",
      aim: "雨大时宜先说明，再提出改期或留在家里。",
      words: ["a2b-rainheavy", "a2n-storm", "a2n-bringumb", "a2n-reschedule", "a2-postpone", "a2g-stayhome"],
      talk: [
        turn("m", "ฝนตกหนัก{p}", "fǒn dtòk nàk {pr}", "雨下得很大。"),
        turn("f", "มีพายุไหม{p}", "mii phaa-yú mǎi {pr}", "有风暴吗？", "q"),
        turn("m", "มี{p} พกร่มก็ยังเปียก{p}", "mii {pr} phók rôm gɔ̂ yang bpìak {pr}", "有。带伞也会湿。"),
        turn("f", "งั้นเลื่อนนัด{p}", "ngán lʉ̂an nát {pr}", "那就改约定。"),
        turn("m", "อยู่บ้านก่อน{p} พรุ่งนี้ค่อยไป{p}", "yùu bâan gɔ̀ɔn {pr} phrûng-níi khɔ̂i bpai {pr}", "先待在家里。明天再去。"),
        turn("f", "ได้{p} เดี๋ยวแจ้งเขา{p}", "dâai {pr} dǐao jɛ̂ɛng khǎo {pr}", "好。我去告诉他。")
      ],
      lines: [
        line("ฝนตกหนัก{p}", "fǒn dtòk nàk {pr}", "下大雨。"),
        line("มีพายุ{p}", "mii phaa-yú {pr}", "有风暴。"),
        line("พกร่มไปด้วย{p}", "phók rôm bpai dûai {pr}", "把伞带上。"),
        line("เลื่อนนัดได้ไหม{p}", "lʉ̂an nát dâai mǎi {pr}", "能改约定吗？", "q"),
        line("อยู่บ้านก่อน{p}", "yùu bâan gɔ̀ɔn {pr}", "先待在家里。"),
        line("พรุ่งนี้ค่อยไป{p}", "phrûng-níi khɔ̂i bpai {pr}", "明天再去。"),
        line("แจ้งเขาด้วย{p}", "jɛ̂ɛng khǎo dûai {pr}", "也告诉他一声。"),
        line("ถนนน้ำท่วม{p}", "thà-nǒn náam thûam {pr}", "路面积水了。")
      ]
    },
    {
      id: "ls-b1-shopcmp",
      level: "B1",
      title: "比较两家店",
      aim: "比较时宜说出哪一家更近、更便宜，或质量更好，并补一句值不值得。",
      words: ["b2n-compare", "b1g-cheaper", "b1g-nearer", "b1g-betterquality", "b1n-service2", "b1b-worth"],
      talk: [
        turn("f", "เปรียบเทียบสองร้านนี้หน่อย{p}", "bprìap-thîap sɔ̌ɔng ráan níi nɔ̀i {pr}", "比较一下这两家店。"),
        turn("m", "ร้านนี้ถูกกว่า{p} แต่อีกร้านใกล้กว่า{p}", "ráan níi thùuk gwàa {pr} dtɛ̀ɛ ìik ráan glâi gwàa {pr}", "这家更便宜。另一家更近。"),
        turn("f", "คุณภาพดีกว่าไหม{p}", "khun-ná-phâap dii gwàa mǎi {pr}", "质量更好吗？", "q"),
        turn("m", "ดีกว่า{p} บริการก็ดี{p}", "dii gwàa {pr} bɔɔ-rí-gaan gɔ̂ dii {pr}", "更好。服务也不错。"),
        turn("f", "คุ้มไหม{p}", "khúm mǎi {pr}", "值得吗？", "q"),
        turn("m", "คุ้ม{p} ฉันเลือกร้านที่ใกล้{p}", "khúm {pr} chǎn lʉ̂ak ráan thîi glâi {pr}", "值得。我选近的那家。")
      ],
      lines: [
        line("เปรียบเทียบสองร้าน{p}", "bprìap-thîap sɔ̌ɔng ráan {pr}", "比较两家店。"),
        line("ร้านนี้ถูกกว่า{p}", "ráan níi thùuk gwàa {pr}", "这家更便宜。"),
        line("ร้านนี้ใกล้กว่า{p}", "ráan níi glâi gwàa {pr}", "这家更近。"),
        line("คุณภาพดีกว่าไหม{p}", "khun-ná-phâap dii gwàa mǎi {pr}", "质量更好吗？", "q"),
        line("บริการช้า{p}", "bɔɔ-rí-gaan cháa {pr}", "服务慢。"),
        line("อันนี้คุ้ม{p}", "an-níi khúm {pr}", "这个值得。"),
        line("อันนั้นไม่คุ้ม{p}", "an nán mâi khúm {pr}", "那个不值得。"),
        line("ฉันเลือกร้านนี้{p}", "chǎn lʉ̂ak ráan níi {pr}", "我选这家。")
      ]
    },
    {
      id: "ls-b1-latewhy",
      level: "B1",
      title: "解释为什么迟到",
      aim: "迟到时宜先道歉，再说人已经在路上，并说明还需要多久。",
      words: ["b1g-latein", "b1g-ontheway", "b1g-outoftime", "a2n-callback", "b1n-sorryfeel", "b1g-maketime"],
      talk: [
        turn("m", "ขอโทษ{p} มาสาย{p}", "khɔ̌ɔ-thôot {pr} maa sǎai {pr}", "对不起，我迟到了。"),
        turn("f", "อยู่ระหว่างทางไหม{p}", "yûu rá-wàang thaang mǎi {pr}", "你在路上吗？", "q"),
        turn("m", "อยู่{p} เวลาไม่พอจริงๆ{p}", "yûu {pr} wee-laa mâi phɔɔ jing jing {pr}", "在。时间确实不够。"),
        turn("f", "อีกนานไหม{p}", "ìik naan mǎi {pr}", "还要很久吗？", "q"),
        turn("m", "อีกสิบนาที{p} เดี๋ยวโทรกลับ{p}", "ìik sìp naa-thii {pr} dǐao thoo glàp {pr}", "再要十分钟。我回头打给你。"),
        turn("f", "ได้{p} หาเวลาคุยต่อ{p}", "dâai {pr} hǎa wee-laa khui dtɔ̀ɔ {pr}", "好。再找时间接着谈。")
      ],
      lines: [
        line("ขอโทษที่มาสาย{p}", "khɔ̌ɔ-thôot thîi maa sǎai {pr}", "对不起，来晚了。"),
        line("กำลังอยู่ระหว่างทาง{p}", "gam-lang yûu rá-wàang thaang {pr}", "正在路上。"),
        line("เวลาไม่พอ{p}", "wee-laa mâi phɔɔ {pr}", "时间不够。"),
        line("อีกกี่นาที{p}", "ìik gìi naa-thii {pr}", "还要几分钟？", "q"),
        line("อีกสิบนาที{p}", "ìik sìp naa-thii {pr}", "再要十分钟。"),
        line("เดี๋ยวโทรกลับ{p}", "dǐao thoo glàp {pr}", "我回头打给你。"),
        line("รู้สึกผิดจริงๆ{p}", "rúu-sʉ̀k phìt jing jing {pr}", "真的觉得过意不去。"),
        line("ไว้หาเวลาใหม่{p}", "wái hǎa wee-laa mài {pr}", "另找时间。")
      ]
    },
    {
      id: "ls-b1-weekend",
      level: "B1",
      title: "安排周末",
      aim: "约周末时宜先问对方有没有空，再说是当天往返还是过夜。",
      words: ["b1c-thisweekend", "b1g-nextweekend", "a2c-oneday", "b1g-iffree", "b1n-invite", "b1g-pack"],
      talk: [
        turn("f", "สุดสัปดาห์นี้ว่างไหม{p}", "sùt sàp-daa níi wâang mǎi {pr}", "这个周末有空吗？", "q"),
        turn("m", "ว่าง{p} ชวนไปไหน{p}", "wâang {pr} chuan bpai nǎi {pr}", "有空。约去哪里？", "q"),
        turn("f", "ไปเช้าเย็นกลับ{p}", "bpai cháao yen glàp {pr}", "当天去当天回。"),
        turn("m", "สุดสัปดาห์หน้าได้ไหม{p}", "sùt sàp-daa nâa dâai mǎi {pr}", "下周末可以吗？", "q"),
        turn("f", "ได้{p} ถ้าว่างฉันไปด้วย{p}", "dâai {pr} thâa wâang chǎn bpai dûai {pr}", "可以。如果有空我就一起去。"),
        turn("m", "งั้นจัดกระเป๋าวันศุกร์{p}", "ngán jàt grà-bpǎo wan sùk {pr}", "那就星期五收拾行李。")
      ],
      lines: [
        line("สุดสัปดาห์นี้ว่างไหม{p}", "sùt sàp-daa níi wâang mǎi {pr}", "这个周末有空吗？", "q"),
        line("สุดสัปดาห์หน้าว่าง{p}", "sùt sàp-daa nâa wâang {pr}", "下周末有空。"),
        line("ชวนไปด้วย{p}", "chuan bpai dûai {pr}", "约你一起去。"),
        line("ไปเช้าเย็นกลับ{p}", "bpai cháao yen glàp {pr}", "当天往返。"),
        line("ถ้าว่างบอกด้วย{p}", "thâa wâang bɔ̀ɔk dûai {pr}", "有空的话告诉我。"),
        line("จัดกระเป๋าวันศุกร์{p}", "jàt grà-bpǎo wan sùk {pr}", "星期五收拾行李。"),
        line("อย่าลืมร่ม{p}", "yàa lʉʉm rôm {pr}", "别忘了伞。"),
        line("เจอกันเช้าวันเสาร์{p}", "jəə gan cháao wan sǎo {pr}", "星期六早上见。")
      ]
    },
    {
      id: "ls-b1-advise",
      level: "B1",
      title: "劝朋友先休息",
      aim: "劝人休息时宜先说出自己的担心，再提出具体的做法。",
      words: ["b1g-restfirst", "b1g-dontpush", "b1n-sleepenough", "b1g-tiredmind", "b1g-worried", "b1b-takecare2"],
      talk: [
        turn("f", "ช่วงนี้เหนื่อยใจ{p}", "chûang níi nʉ̀ai-jai {pr}", "这段时间心里累。"),
        turn("m", "ฉันเป็นห่วง{p} พักก่อนค่อยทำ{p}", "chǎn bpen hùang {pr} phák gɔ̀ɔn khɔ̂i tham {pr}", "我担心你。先休息再做。"),
        turn("f", "งานยังไม่เสร็จ{p}", "ngaan yang mâi sèt {pr}", "工作还没做完。"),
        turn("m", "อย่าฝืน{p} นอนให้พอ{p}", "yàa fʉ̌ʉn {pr} nɔɔn hâi phɔɔ {pr}", "不要硬撑。把觉睡够。"),
        turn("f", "ได้{p} วันนี้เลิกก่อน{p}", "dâai {pr} wan-níi lêek gɔ̀ɔn {pr}", "好。今天先停。"),
        turn("m", "ดูแลสุขภาพด้วย{p}", "duu-lɛɛ sùk-khà-phâap dûai {pr}", "也注意身体。")
      ],
      lines: [
        line("เหนื่อยใจ{p}", "nʉ̀ai-jai {pr}", "心里累。"),
        line("ฉันเป็นห่วง{p}", "chǎn bpen hùang {pr}", "我担心你。"),
        line("พักก่อนค่อยทำ{p}", "phák gɔ̀ɔn khɔ̂i tham {pr}", "先休息再做。"),
        line("อย่าฝืน{p}", "yàa fʉ̌ʉn {pr}", "不要硬撑。"),
        line("นอนให้พอ{p}", "nɔɔn hâi phɔɔ {pr}", "睡够。"),
        line("ดื่มน้ำเยอะๆ{p}", "dʉ̀ʉm náam yə́ yə́ {pr}", "多喝水。"),
        line("ดูแลสุขภาพ{p}", "duu-lɛɛ sùk-khà-phâap {pr}", "注意身体。"),
        line("พรุ่งนี้ค่อยทำต่อ{p}", "phrûng-níi khɔ̂i tham dtɔ̀ɔ {pr}", "明天再继续。")
      ]
    },
    {
      id: "ls-b1-hard",
      level: "B1",
      title: "说学习上的困难",
      aim: "说困难时宜先指出还不懂的地方，再请对方解释，并约定再练。",
      words: ["b1g-confused", "b1c-notunderstand", "b2-explain", "b1n-practice", "b1g-weak", "b1g-slow"],
      talk: [
        turn("f", "บทนี้ฉันสับสน{p}", "bòt níi chǎn sàp-sǒn {pr}", "这一课我搞混了。"),
        turn("m", "ตรงไหนยังไม่เข้าใจ{p}", "dtrong nǎi yang mâi jâo-jai {pr}", "哪里还不懂？", "q"),
        turn("f", "จุดอ่อนคือวรรณยุกต์{p} ขอให้อธิบาย{p}", "jùt ɔ̀ɔn khʉʉ wan-ná-yúk {pr} khɔ̌ɔ hâi à-thí-baai {pr}", "薄弱的是声调。请解释一下。"),
        turn("m", "พูดช้าลง{p} แล้วฝึกตาม{p}", "phûut cháa long {pr} lɛ́ɛo fʉ̀k dtaam {pr}", "说慢一点，然后跟着练。"),
        turn("f", "ช้าลงอีกได้ไหม{p}", "cháa long ìik dâai mǎi {pr}", "能再慢一点吗？", "q"),
        turn("m", "ได้{p} ฝึกอีกสองรอบ{p}", "dâai {pr} fʉ̀k ìik sɔ̌ɔng rɔɔp {pr}", "可以。再练两遍。")
      ],
      lines: [
        line("ฉันสับสน{p}", "chǎn sàp-sǒn {pr}", "我搞混了。"),
        line("ยังไม่เข้าใจ{p}", "yang mâi jâo-jai {pr}", "还不懂。"),
        line("ช่วยอธิบายหน่อย{p}", "chûai à-thí-baai nɔ̀i {pr}", "请解释一下。"),
        line("จุดอ่อนคือตรงนี้{p}", "jùt ɔ̀ɔn khʉʉ dtrong níi {pr}", "薄弱的是这里。"),
        line("พูดช้าลง{p}", "phûut cháa long {pr}", "说慢一点。"),
        line("ฝึกตามได้ไหม{p}", "fʉ̀k dtaam dâai mǎi {pr}", "能跟着练吗？", "q"),
        line("ใกล้แล้ว{p}", "glâi lɛ́ɛo {pr}", "很接近了。"),
        line("ลองใหม่อีกครั้ง{p}", "lɔɔng mài ìik khráng {pr}", "再试一次。")
      ]
    },
    {
      id: "ls-b1-disagree",
      level: "B1",
      title: "说出不同的看法",
      aim: "看法不同时宜先说出自己同意的部分，再说不同意的部分，并问对方怎么看。",
      words: ["b1g-disagree", "b1b-agreepart", "b2n-ontheother", "b1b-thinkthat", "b1g-youthink", "b1g-makesense"],
      talk: [
        turn("m", "ฉันคิดว่าแบบนี้เร็วกว่า{p}", "chǎn khít wâa bɛ̀ɛp níi reo gwàa {pr}", "我觉得这样更快。"),
        turn("f", "มีเหตุผล{p} แต่ฉันเห็นด้วยบางส่วน{p}", "mii hèet-phǒn {pr} dtɛ̀ɛ chǎn hěn dûai baang sùan {pr}", "有道理。可是我只同意一部分。"),
        turn("m", "ตรงไหนไม่เห็นด้วย{p}", "dtrong nǎi mâi hěn dûai {pr}", "哪里不同意？", "q"),
        turn("f", "อีกด้านหนึ่งช้ากว่า{p} แต่ชัดกว่า{p}", "ìik dâan nʉ̀ng cháa gwàa {pr} dtɛ̀ɛ chát gwàa {pr}", "另一方面更慢，可是更清楚。"),
        turn("m", "คุณคิดว่าไง{p}", "khun khít wâa ngai {pr}", "你怎么看？", "q"),
        turn("f", "ฉันไม่เห็นด้วยทั้งหมด{p} ขอคิดก่อน{p}", "chǎn mâi hěn dûai tháng-mòt {pr} khɔ̌ɔ khít gɔ̀ɔn {pr}", "我并非全部同意。让我先想一下。")
      ],
      lines: [
        line("ฉันคิดว่าแบบนี้ดีกว่า{p}", "chǎn khít wâa bɛ̀ɛp níi dii gwàa {pr}", "我觉得这样更好。"),
        line("คุณคิดว่าไง{p}", "khun khít wâa ngai {pr}", "你怎么看？", "q"),
        line("มีเหตุผล{p}", "mii hèet-phǒn {pr}", "有道理。"),
        line("เห็นด้วยบางส่วน{p}", "hěn dûai baang sùan {pr}", "部分同意。"),
        line("ตรงนี้ไม่เห็นด้วย{p}", "dtrong níi mâi hěn dûai {pr}", "这一点不同意。"),
        line("อีกด้านหนึ่งก็สำคัญ{p}", "ìik dâan nʉ̀ng gɔ̂ sǎm-khan {pr}", "另一方面也很重要。"),
        line("ยังไม่ตัดสิน{p}", "yang mâi dtàt-sǐn {pr}", "还没决定。"),
        line("ไว้คุยต่อ{p}", "wái khui dtɔ̀ɔ {pr}", "以后再谈。")
      ]
    },
    {
      id: "ls-b2-split",
      level: "B2",
      title: "商量怎么分账",
      aim: "分账时宜先说自己出哪一部分，再说明怎么转账，并问收据要不要分开。",
      words: ["b2g-splitbill", "b2g-mypartpay", "b2g-yourpartpay", "b2g-transferme", "b2g-round", "b2g-receiptsplit"],
      talk: [
        turn("f", "หารค่าอาหารกัน{p}", "hǎan khâa aa-hǎan gan {pr}", "饭钱分开算。"),
        turn("m", "ส่วนนี้ฉันออก{p} ส่วนนั้นคุณออก{p}", "sùan níi chǎn ɔ̀ɔk {pr} sùan nán khun ɔ̀ɔk {pr}", "这一份我来。那一份你来。"),
        turn("f", "ปัดเศษได้ไหม{p}", "bpàt sèet dâai mǎi {pr}", "零头可以抹掉吗？", "q"),
        turn("m", "ได้{p} โอนมาที่บัญชีนี้{p}", "dâai {pr} oon maa thîi ban-chii níi {pr}", "可以。转到这个账户。"),
        turn("f", "ขอใบเสร็จแยก{p}", "khɔ̌ɔ bai-sèt yɛ̂ɛk {pr}", "请把收据分开开。"),
        turn("m", "ได้{p} เดี๋ยวส่งให้{p}", "dâai {pr} dǐao sòng hâi {pr}", "可以。我稍后发给你。")
      ],
      lines: [
        line("หารค่าอาหาร{p}", "hǎan khâa aa-hǎan {pr}", "把饭钱分开算。"),
        line("ส่วนนี้ฉันออก{p}", "sùan níi chǎn ɔ̀ɔk {pr}", "这一份我来付。"),
        line("ส่วนนั้นคุณออก{p}", "sùan nán khun ɔ̀ɔk {pr}", "那一份你来付。"),
        line("ปัดเศษได้ไหม{p}", "bpàt sèet dâai mǎi {pr}", "零头可以抹掉吗？", "q"),
        line("โอนมาที่บัญชีนี้{p}", "oon maa thîi ban-chii níi {pr}", "转到这个账户。"),
        line("ขอใบเสร็จแยก{p}", "khɔ̌ɔ bai-sèt yɛ̂ɛk {pr}", "请分开开收据。"),
        line("ยอดนี้ตรงไหม{p}", "yɔ̂ɔt níi dtrong mǎi {pr}", "这个金额对吗？", "q"),
        line("ตรง{p} ขอบคุณ{p}", "dtrong {pr} khɔ̀ɔp-khun {pr}", "对。谢谢。")
      ]
    },
    {
      id: "ls-b2-misread",
      level: "B2",
      title: "把误会解释清楚",
      aim: "有误会时宜先承认理解不一致，再换一种说法，直到双方理解一致。",
      words: ["b2g-misread", "b2g-notwhatimeant", "b2g-letmesay", "b2g-inotherwords", "b2g-clearnow", "b2g-sorrymix"],
      talk: [
        turn("m", "เราเข้าใจไม่ตรงกัน{p}", "rao jâo-jai mâi dtrong gan {pr}", "我们的理解不一致。"),
        turn("f", "คุณหมายความว่าอะไร{p}", "khun mǎai-khwaam wâa à-rai {pr}", "你的意思是什么？", "q"),
        turn("m", "ไม่ได้หมายความอย่างนั้น{p} ขอพูดใหม่{p}", "mâi dâai mǎai-khwaam yàang nán {pr} khɔ̌ɔ phûut mài {pr}", "我不是那个意思。我换个说法。"),
        turn("f", "พูดอีกแบบคืออะไร{p}", "phûut ìik bɛ̀ɛp khʉʉ à-rai {pr}", "换一种说法是什么？", "q"),
        turn("m", "พูดอีกแบบคือเลื่อนได้ แต่ไม่ยกเลิก{p}", "phûut ìik bɛ̀ɛp khʉʉ lʉ̂an dâai {pr} dtɛ̀ɛ mâi yók-lə̂ək {pr}", "换一种说法就是可以改期，但不是取消。"),
        turn("f", "ตอนนี้ตรงกันแล้ว{p} ขอโทษที่ทำให้สับสน{p}", "dtɔɔn-níi dtrong gan lɛ́ɛo {pr} khɔ̌ɔ-thôot thîi tham hâi sàp-sǒn {pr}", "现在一致了。抱歉让你糊涂了。")
      ],
      lines: [
        line("เข้าใจไม่ตรงกัน{p}", "jâo-jai mâi dtrong gan {pr}", "理解不一致。"),
        line("ไม่ได้หมายความอย่างนั้น{p}", "mâi dâai mǎai-khwaam yàang nán {pr}", "我不是那个意思。"),
        line("ขอพูดใหม่{p}", "khɔ̌ɔ phûut mài {pr}", "我换个说法。"),
        line("พูดอีกแบบคืออะไร{p}", "phûut ìik bɛ̀ɛp khʉʉ à-rai {pr}", "换一种说法是什么？", "q"),
        line("นั่นหมายความว่าเลื่อนได้{p}", "nân mǎai-khwaam wâa lʉ̂an dâai {pr}", "那就是说可以改期。"),
        line("ไม่ใช่ยกเลิก{p}", "mâi châi yók-lə̂ək {pr}", "不是取消。"),
        line("ตอนนี้ตรงกันแล้ว{p}", "dtɔɔn-níi dtrong gan lɛ́ɛo {pr}", "现在理解一致了。"),
        line("ขอโทษที่ทำให้สับสน{p}", "khɔ̌ɔ-thôot thîi tham hâi sàp-sǒn {pr}", "抱歉让你糊涂了。")
      ]
    },
    {
      id: "ls-b2-job",
      level: "B2",
      title: "商量要不要换工作",
      aim: "商量去留时宜先列出好处和坏处，再说明还没有决定。",
      words: ["b2g-consider", "b2g-stayjob", "b2g-newjob", "b2n-advantage", "b2n-disadvantage", "b2g-notyetdecide"],
      talk: [
        turn("f", "กำลังพิจารณางานใหม่{p}", "gam-lang phí-jaa-rá-naa ngaan mài {pr}", "我正在考虑一份新工作。"),
        turn("m", "ข้อดีคืออะไร{p}", "khɔ̂ɔ-dii khʉʉ à-rai {pr}", "好处是什么？", "q"),
        turn("f", "เงินเดือนดีกว่า{p} ข้อเสียคือไกล{p}", "ngən dʉan dii gwàa {pr} khɔ̂ɔ-sǐa khʉʉ glai {pr}", "工资更好。坏处是远。"),
        turn("m", "อยู่ที่เดิมก่อนได้ไหม{p}", "yûu thîi dəəm gɔ̀ɔn dâai mǎi {pr}", "可以先留在原来的工作吗？", "q"),
        turn("f", "ยังไม่ตัดสินใจ{p}", "yang mâi dtàt-sǐn-jai {pr}", "还没做决定。"),
        turn("m", "งั้นขอเวลาคิด{p} อย่าเพิ่งตอบ{p}", "ngán khɔ̌ɔ wee-laa khít {pr} yàa phə̂əng dtɔ̀ɔp {pr}", "那就给自己时间。先不要回复。")
      ],
      lines: [
        line("กำลังพิจารณา{p}", "gam-lang phí-jaa-rá-naa {pr}", "正在考虑。"),
        line("งานใหม่มีข้อดี{p}", "ngaan mài mii khɔ̂ɔ-dii {pr}", "新工作有好处。"),
        line("ข้อเสียคือไกล{p}", "khɔ̂ɔ-sǐa khʉʉ glai {pr}", "坏处是远。"),
        line("อยู่ที่เดิมก่อนไหม{p}", "yûu thîi dəəm gɔ̀ɔn mǎi {pr}", "先留在原来的工作吗？", "q"),
        line("ยังไม่ตัดสินใจ{p}", "yang mâi dtàt-sǐn-jai {pr}", "还没做决定。"),
        line("ขอเวลาคิด{p}", "khɔ̌ɔ wee-laa khít {pr}", "请给我时间考虑。"),
        line("ข้อเสนอนี้คงไว้ถึงศุกร์{p}", "khɔ̂ɔ-sà-nə̌ə níi khong wái thʉ̌ng sùk {pr}", "这个机会保留到星期五。"),
        line("ศุกร์ค่อยตอบ{p}", "sùk khɔ̂i dtɔ̀ɔp {pr}", "星期五再回复。")
      ]
    },
    {
      id: "ls-b2-lost",
      level: "B2",
      title: "处理丢了的东西",
      aim: "东西丢失时宜说明最后一次看到的地点，再留下联系方式，并去失物招领处登记。",
      words: ["b2g-lostitem2", "b2g-lastseen", "b2g-describe", "b2g-contact", "b2g-reportlost", "b2g-foundoffice"],
      talk: [
        turn("m", "ของหายระหว่างทาง{p}", "khɔ̌ɔng hǎai rá-wàang thaang {pr}", "路上把东西弄丢了。"),
        turn("f", "เห็นครั้งสุดท้ายที่ไหน{p}", "hěn khráng sùt-tháai thîi nǎi {pr}", "最后一次在哪里看到？", "q"),
        turn("m", "บนรถเมล์{p} กระเป๋าสีดำ{p}", "bon rót-mee {pr} grà-bpǎo sǐi dam {pr}", "在公交车上。黑色的包。"),
        turn("f", "บอกลักษณะอีกที{p} เบอร์ติดต่อเท่าไหร่{p}", "bɔ̀ɔk lák-sà-nà ìik thii {pr} bəə dtìt-dtɔ̀ɔ thâo-rài {pr}", "再描述一下特征。联系电话是多少？", "q"),
        turn("m", "เบอร์นี้นะ{p} แจ้งของหายไว้แล้ว{p}", "bəə níi ná {pr} jɛ̂ɛng khɔ̌ɔng hǎai wái lɛ́ɛo {pr}", "是这个号码。已经挂失了。"),
        turn("f", "ไปห้องของหายได้{p} ถ้าเจอจะโทร{p}", "bpai hɔ̂ɔng khɔ̌ɔng hǎai dâai {pr} thâa jəə jà thoo {pr}", "可以去失物招领处。找到了会打电话。")
      ],
      lines: [
        line("ของหายระหว่างทาง{p}", "khɔ̌ɔng hǎai rá-wàang thaang {pr}", "路上把东西弄丢了。"),
        line("เห็นครั้งสุดท้ายบนรถ{p}", "hěn khráng sùt-tháai bon rót {pr}", "最后一次是在车上看到的。"),
        line("บอกลักษณะได้ไหม{p}", "bɔ̀ɔk lák-sà-nà dâai mǎi {pr}", "能描述一下特征吗？", "q"),
        line("กระเป๋าสีดำ{p}", "grà-bpǎo sǐi dam {pr}", "黑色的包。"),
        line("เบอร์ติดต่อนี่{p}", "bəə dtìt-dtɔ̀ɔ nîi {pr}", "联系电话是这个。"),
        line("แจ้งของหาย{p}", "jɛ̂ɛng khɔ̌ɔng hǎai {pr}", "办理挂失。"),
        line("ห้องของหายอยู่ไหน{p}", "hɔ̂ɔng khɔ̌ɔng hǎai yûu nǎi {pr}", "失物招领处在哪里？", "q"),
        line("ถ้าเจอโทรหาฉัน{p}", "thâa jəə thoo hǎa chǎn {pr}", "找到了请打给我。")
      ]
    },
    {
      id: "ls-b2-changeplan",
      level: "B2",
      title: "说明行程有变动",
      aim: "行程变动时宜先说出原计划和新时间，再说明谁会受到影响，并和各方确认。",
      words: ["b2g-changeplan", "b2g-originalplan", "b2g-newtime", "b2g-whoaffected", "b2g-notify", "b2g-confirmall"],
      talk: [
        turn("f", "ขอปรับแผน{p}", "khɔ̌ɔ bpràp phɛ̌ɛn {pr}", "想调整计划。"),
        turn("m", "แผนเดิมคืออะไร{p}", "phɛ̌ɛn dəəm khʉʉ à-rai {pr}", "原计划是什么？", "q"),
        turn("f", "เดิมคือเก้าโมง{p} เวลาใหม่คือสิบโมง{p}", "dəəm khʉʉ gâao moong {pr} wee-laa mài khʉʉ sìp moong {pr}", "原来是九点。新时间是十点。"),
        turn("m", "ใครได้รับผล{p}", "khrai dâai ráp phǒn {pr}", "谁会受到影响？", "q"),
        turn("f", "ทั้งทีม{p} แจ้งทุกคนแล้ว{p}", "tháng thiim {pr} jɛ̂ɛng thúk khon lɛ́ɛo {pr}", "整个小组。已经通知每一个人了。"),
        turn("m", "ยืนยันกับทุกฝ่ายอีกที{p}", "yʉʉn-yan gàp thúk fàai ìik thii {pr}", "再和各方确认一次。")
      ],
      lines: [
        line("ขอปรับแผน{p}", "khɔ̌ɔ bpràp phɛ̌ɛn {pr}", "想调整计划。"),
        line("แผนเดิมคือเก้าโมง{p}", "phɛ̌ɛn dəəm khʉʉ gâao moong {pr}", "原计划是九点。"),
        line("เวลาใหม่คือสิบโมง{p}", "wee-laa mài khʉʉ sìp moong {pr}", "新的时间是十点。"),
        line("ใครได้รับผล{p}", "khrai dâai ráp phǒn {pr}", "谁会受到影响？", "q"),
        line("แจ้งทุกคน{p}", "jɛ̂ɛng thúk khon {pr}", "通知每一个人。"),
        line("ยืนยันกับทุกฝ่าย{p}", "yʉʉn-yan gàp thúk fàai {pr}", "和各方确认。"),
        line("ถ้ามีอะไรเปลี่ยนบอกด้วย{p}", "thâa mii à-rai bplìan bɔ̀ɔk dûai {pr}", "如果再有变动，请告诉我。"),
        line("รับทราบ{p}", "ráp-sâap {pr}", "知道了。")
      ]
    },
    {
      id: "ls-b2-confirm",
      level: "B2",
      title: "把话说清楚再确认",
      aim: "确认时宜把要点再说一遍。若有错，须马上改正，并写成依据。",
      words: ["b2g-confirmagain", "b2g-samepage", "b2g-writeit", "b2g-ifwrong", "b2g-finalcheck", "b2n-confirmdeal"],
      talk: [
        turn("m", "ขอยืนยันอีกครั้ง{p}", "khɔ̌ɔ yʉʉn-yan ìik khráng {pr}", "请再确认一次。"),
        turn("f", "เข้าใจตรงกัน{p} เวลาคือสองโมง{p}", "jâo-jai dtrong gan {pr} wee-laa khʉʉ sɔ̌ɔng moong {pr}", "理解一致。时间是下午两点。"),
        turn("m", "ถ้าผิดขอแก้ทันที{p}", "thâa phìt khɔ̌ɔ gɛ̂ɛ than-thii {pr}", "如果错了，请马上改。"),
        turn("f", "ถูกแล้ว{p} เขียนไว้เป็นหลักฐาน{p}", "thùuk lɛ́ɛo {pr} khǐan wái bpen làk-thǎan {pr}", "对了。写下来作为依据。"),
        turn("m", "ตรวจขั้นสุดท้ายก่อน{p}", "dtrùat khân sùt-tháai gɔ̀ɔn {pr}", "先做最后核对。"),
        turn("f", "ตกลงตามนี้{p}", "dtòk-long dtaam níi {pr}", "就按这个定。")
      ],
      lines: [
        line("ขอยืนยันอีกครั้ง{p}", "khɔ̌ɔ yʉʉn-yan ìik khráng {pr}", "请再确认一次。"),
        line("เข้าใจตรงกันไหม{p}", "jâo-jai dtrong gan mǎi {pr}", "理解一致吗？", "q"),
        line("เข้าใจตรงกัน{p}", "jâo-jai dtrong gan {pr}", "理解一致。"),
        line("เขียนไว้เป็นหลักฐาน{p}", "khǐan wái bpen làk-thǎan {pr}", "写下来作为依据。"),
        line("ถ้าผิดขอแก้ทันที{p}", "thâa phìt khɔ̌ɔ gɛ̂ɛ than-thii {pr}", "如果错了，马上改。"),
        line("ตรวจขั้นสุดท้าย{p}", "dtrùat khân sùt-tháai {pr}", "做最后核对。"),
        line("ขาดอีกจุดหนึ่ง{p}", "khàat ìik jùt nʉ̀ng {pr}", "还少一点。"),
        line("ตกลงตามนี้{p}", "dtòk-long dtaam níi {pr}", "就按这个定。")
      ]
    }
  ];

  COURSE.lessons = COURSE.lessons.concat(added);
})();
