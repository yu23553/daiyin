(function () {
  const API_ORIGIN = "https://daiyin-study.netlify.app";
  const SESSION_KEY = "daiyin-account-v1";
  let session = null;
  let status = "off";
  let timer = 0;
  let chain = Promise.resolve();
  let epoch = 0;

  function apiUrl() {
    if (location.hostname.endsWith(".netlify.app")) return "/api/account";
    return API_ORIGIN + "/api/account";
  }

  function readSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (saved && saved.username && saved.token) session = saved;
      else session = null;
    } catch (err) {
      session = null;
    }
    status = session ? "syncing" : "off";
  }

  function writeSession(next) {
    session = next;
    try {
      if (!next) localStorage.removeItem(SESSION_KEY);
      else localStorage.setItem(SESSION_KEY, JSON.stringify({ username: next.username, token: next.token }));
    } catch (err) { /* private mode */ }
    status = next ? "syncing" : "off";
  }

  function notify() {
    window.dispatchEvent(new CustomEvent("daiyin-sync"));
  }

  function enqueue(task) {
    const run = chain.then(task, task);
    chain = run.then(function () {}, function () {});
    return run;
  }

  function post(action, extra) {
    const payload = Object.assign({
      action: action,
      username: session && session.username,
      token: session && session.token
    }, extra || {});
    return fetch(apiUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          const err = new Error(data.error || "账号没有连上。");
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  function applyResult(data) {
    if (!data || !data.state) return;
    if (data.reset) Store.applyState(data.state);
    else Store.settle(data.state);
    status = "saved";
    notify();
  }

  function failStatus(err) {
    status = "error";
    notify();
    return err;
  }

  function loginWith(kind, draft) {
    const my = ++epoch;
    clearTimeout(timer);
    const uploaded = Store.exportState();
    return enqueue(function () {
      return post(kind, { username: draft.username.trim(), password: draft.password, state: uploaded }).then(function (data) {
        if (my !== epoch) return data;
        writeSession({ username: data.username, token: data.token });
        applyResult(data);
        return data;
      }).catch(function (err) {
        if (my === epoch) failStatus(err);
        throw err;
      });
    });
  }

  function pushNow() {
    if (!session) return Promise.resolve();
    const my = epoch;
    status = "syncing";
    notify();
    return enqueue(function () {
      let spins = 0;
      function once() {
        if (!session || my !== epoch) return null;
        if (spins >= 8) {
          schedulePush();
          return null;
        }
        spins += 1;
        const seq = Store.seq();
        const uploaded = Store.exportState();
        return post("push", { state: uploaded }).then(function (data) {
          if (!session || my !== epoch) return data;
          if (data.reset || Store.seq() === seq) {
            applyResult(data);
            return data;
          }
          return once();
        });
      }
      return once();
    }).catch(function (err) {
      if (my === epoch) failStatus(err);
      throw err;
    });
  }

  function schedulePush() {
    if (!session) return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      pushNow().catch(function () {});
    }, 700);
  }

  function pullNow() {
    if (!session) return Promise.resolve();
    const my = epoch;
    const seq = Store.seq();
    status = "syncing";
    return enqueue(function () {
      if (!session || my !== epoch) return null;
      return post("pull").then(function (data) {
        if (!session || my !== epoch) return data;
        if (Store.seq() !== seq) {
          schedulePush();
          return data;
        }
        applyResult(data);
        return data;
      }).catch(function (err) {
        if (my === epoch) failStatus(err);
        throw err;
      });
    });
  }

  function wipe() {
    if (!session) {
      Store.reset();
      notify();
      return Promise.resolve(true);
    }
    const my = ++epoch;
    clearTimeout(timer);
    status = "syncing";
    notify();
    return enqueue(function () {
      if (!session) return false;
      return post("wipe").then(function (data) {
        if (my !== epoch) return false;
        applyResult(data);
        return true;
      }).catch(function (err) {
        if (my === epoch) failStatus(err);
        throw err;
      });
    });
  }

  function logout() {
    const current = session;
    const my = ++epoch;
    clearTimeout(timer);
    writeSession(null);
    notify();
    if (!current) return Promise.resolve();
    return enqueue(function () {
      return fetch(apiUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "logout", username: current.username, token: current.token })
      }).catch(function () {}).then(function () {
        if (my === epoch) status = "off";
      });
    });
  }

  function statusLabel() {
    if (!session) return "未登录 · 进度仅保存在本机";
    if (status === "syncing") return "正在同步到云端";
    if (status === "error") return "云端未连上 · 本机进度仍可用";
    return "已同步到云端";
  }

  function syncNow() {
    if (!session) return Promise.resolve();
    const local = Store.exportState();
    const start = (!local.synced || local.dirty) ? pushNow() : pullNow();
    return start;
  }

  readSession();

  window.Account = {
    session: function () { return session; },
    status: function () { return status; },
    statusLabel: statusLabel,
    apiHost: function () { return API_ORIGIN.replace(/^https?:\/\//, ""); },
    onLocalSave: schedulePush,
    login: function (draft) { return loginWith("login", draft); },
    signup: function (draft) { return loginWith("signup", draft); },
    logout: logout,
    wipe: wipe,
    pull: pullNow,
    syncNow: syncNow
  };

  if (session) {
    const local = Store.exportState();
    const start = (!local.synced || local.dirty) ? pushNow() : pullNow();
    start.catch(function () {});
  }
})();
