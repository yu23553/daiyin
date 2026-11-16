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

  function thaiVoice() {
    return voices.find(function (voice) {
      return /th(-|_)?TH/i.test(voice.lang) || /thai/i.test(voice.name);
    });
  }

  function stop() {
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
    const voice = thaiVoice();
    const rate = opts.slow ? 0.72 : 0.92;

    if (voice && window.speechSynthesis) {
      return new Promise(function (resolve) {
        const utter = new SpeechSynthesisUtterance(clean);
        currentUtterance = utter;
        utter.lang = "th-TH";
        utter.voice = voice;
        utter.rate = rate;
        let settled = false;
        const finish = function (ok) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(ok);
        };
        const timer = setTimeout(function () { finish(true); }, 12000);
        utter.onend = function () { finish(true); };
        utter.onerror = function () { finish(false); };
        window.speechSynthesis.speak(utter);
      });
    }

    const url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=" + encodeURIComponent(clean);
    return new Promise(function (resolve) {
      const audio = new Audio(url);
      let settled = false;
      let started = false;
      const finish = function (ok) {
        if (settled) return;
        settled = true;
        clearTimeout(waitTimer);
        clearTimeout(capTimer);
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
      audio.onended = function () { finish(true); };
      audio.onerror = function () { finish(false); };
      audio.play().then(function () {
        audio.playbackRate = opts.slow ? 0.78 : 1;
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
