(function () {
  let currentAudio = null;
  let currentUtterance = null;
  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }

  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }

  function refreshVoices() {
    if (window.speechSynthesis) voices = window.speechSynthesis.getVoices() || [];
  }

  function thaiList() {
    refreshVoices();
    return voices.filter(function (voice) {
      return /th(-|_)?TH/i.test(voice.lang) || /thai/i.test(voice.name);
    });
  }

  function namedVoice(list, pattern) {
    return list.find(function (voice) { return pattern.test(voice.name + " " + (voice.voiceURI || "")); });
  }

  function thaiVoice(gender) {
    const list = thaiList();
    const female = namedVoice(list, /female|woman|girl|premwadee/i);
    const male = namedVoice(list, /male|man|boy|niwat|pattara/i);
    if (gender === "f") return female || (list.length > 1 && male ? list.find(function (voice) { return voice !== male; }) : null) || list[0] || null;
    if (gender === "m") return male || (list.length > 1 && female ? list.find(function (voice) { return voice !== female; }) : null) || list[0] || null;
    return list[0] || null;
  }

  function voicePitch(gender) {
    const female = thaiVoice("f");
    const male = thaiVoice("m");
    const distinct = !!(female && male && female !== male);
    if (gender === "f") return distinct ? 1.04 : 1.28;
    if (gender === "m") return distinct ? 0.9 : 0.68;
    return 1;
  }

  let ticker = null;

  function clearTicker() {
    if (ticker) clearInterval(ticker);
    ticker = null;
  }

  function stop() {
    clearTicker();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    currentUtterance = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function speak(text, options) {
    const opts = options || {};
    const clean = (text || "").trim();
    if (!clean) return Promise.resolve(false);
    stop();
    const voice = thaiVoice(opts.gender);
    const rate = opts.slow ? 0.72 : 0.92;
    const pitch = opts.gender ? voicePitch(opts.gender) : (typeof opts.pitch === "number" ? opts.pitch : 1);
    let ratio = 0;
    function report(next) {
      ratio = Math.max(ratio, Math.min(0.98, next));
      if (opts.onProgress) opts.onProgress(ratio);
    }
    if (opts.onProgress) opts.onProgress(0);

    if (voice && window.speechSynthesis) {
      return new Promise(function (resolve) {
        const utter = new SpeechSynthesisUtterance(clean);
        currentUtterance = utter;
        utter.lang = "th-TH";
        utter.voice = voice;
        utter.rate = rate;
        utter.pitch = pitch;
        let settled = false;
        const started = Date.now();
        const estimate = Math.max(1200, clean.length * (opts.slow ? 320 : 210));
        const mine = setInterval(function () {
          report((Date.now() - started) / estimate);
        }, 80);
        ticker = mine;
        const finish = function (ok) {
          if (settled) return;
          settled = true;
          if (ticker === mine) clearTicker();
          clearTimeout(timer);
          if (ok && opts.onProgress) opts.onProgress(1);
          resolve(ok);
        };
        const timer = setTimeout(function () { finish(true); }, 15000);
        utter.onboundary = function (event) {
          if (event.charIndex != null && clean.length) report(event.charIndex / clean.length);
        };
        utter.onend = function () { finish(true); };
        utter.onerror = function (event) {
          const reason = event && event.error;
          finish(reason === "interrupted" || reason === "canceled");
        };
        window.speechSynthesis.speak(utter);
      });
    }

    const url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=" + encodeURIComponent(clean);
    return new Promise(function (resolve) {
      const audio = new Audio(url);
      let settled = false;
      let started = false;
      const startedAt = Date.now();
      const estimate = Math.max(1400, clean.length * (opts.slow ? 340 : 230));
      const mine = setInterval(function () {
        report((Date.now() - startedAt) / estimate);
      }, 80);
      ticker = mine;
      const finish = function (ok) {
        if (settled) return;
        settled = true;
        if (ticker === mine) clearTicker();
        clearTimeout(waitTimer);
        clearTimeout(capTimer);
        if (ok && opts.onProgress) opts.onProgress(1);
        if (currentAudio === audio) currentAudio = null;
        resolve(ok);
      };
      const waitTimer = setTimeout(function () {
        if (!started) {
          audio.pause();
          finish(false);
        }
      }, 4500);
      const capTimer = setTimeout(function () {
        audio.pause();
        finish(true);
      }, 15000);
      currentAudio = audio;
      audio.preload = "auto";
      audio.onplaying = function () { started = true; };
      audio.onloadedmetadata = function () {
        if (audio.duration && isFinite(audio.duration) && ticker === mine) clearTicker();
      };
      audio.ontimeupdate = function () {
        if (audio.duration && isFinite(audio.duration)) {
          ratio = Math.min(0.98, audio.currentTime / audio.duration);
          if (opts.onProgress) opts.onProgress(ratio);
        }
      };
      audio.onended = function () {
        if (opts.onProgress) opts.onProgress(1);
        finish(true);
      };
      audio.onerror = function () { finish(false); };
      let speed = opts.slow ? 0.78 : 1;
      if (opts.gender === "m") speed *= 0.82;
      if (opts.gender === "f") speed *= 1.14;
      if (opts.gender) {
        if ("preservesPitch" in audio) audio.preservesPitch = false;
        if ("mozPreservesPitch" in audio) audio.mozPreservesPitch = false;
      }
      audio.playbackRate = speed;
      audio.play().then(function () {
        audio.playbackRate = speed;
      }, function () { finish(false); });
    });
  }

  function canRecognize() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function recognize() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return Promise.reject("unsupported");
    const rec = new Ctor();
    rec.lang = "th-TH";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    return new Promise(function (resolve, reject) {
      let heard = "";
      rec.onresult = function (event) {
        heard = event.results[0][0].transcript || "";
      };
      rec.onerror = function (event) {
        reject(event.error || "error");
      };
      rec.onend = function () { resolve(heard); };
      try {
        rec.start();
      } catch (err) {
        reject("busy");
      }
    });
  }

  window.Speech = {
    speak: speak,
    stop: stop,
    canRecognize: canRecognize,
    recognize: recognize,
    hasThaiVoice: function () { return !!thaiVoice(); }
  };
})();
