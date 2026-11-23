import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { blankProgress, mergeProgress, sanitizeProgress } from "../lib/progress-merge.mjs";

const NAME = /^[\u4e00-\u9fffA-Za-z0-9_]{2,20}$/;
const LOCK_MS = 15 * 60 * 1000;
const SESSION_MS = 400 * 24 * 60 * 60 * 1000;

function fail(status, message) {
  const err = new Error(message);
  err.status = status;
  throw err;
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST, OPTIONS"
    }
  });
}

function userKey(name) {
  return createHash("sha256").update(String(name).toLowerCase()).digest("hex");
}

function normalizeName(name) {
  const value = String(name || "").trim();
  if (!NAME.test(value)) fail(400, "用户名须为 2 到 20 位，可使用中文、字母、数字和下划线。");
  return value;
}

function checkPassword(password) {
  if (typeof password !== "string" || password.length < 6 || password.length > 72) {
    fail(400, "密码须为 6 到 72 位。");
  }
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 32);
}

function sameText(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function publicState(progress) {
  const state = sanitizeProgress(progress || blankProgress());
  state.pending = { xp: 0, listenCorrect: 0, listenTotal: 0, speakGood: 0, speakTotal: 0, sessions: 0 };
  state.synced = true;
  return state;
}

function freshSessions(list) {
  const now = Date.now();
  return (list || []).filter(function (item) {
    return item && item.token && now - item.at < SESSION_MS;
  }).slice(-12);
}

function issueSession(record) {
  const token = randomBytes(32).toString("hex");
  record.sessions = freshSessions(record.sessions);
  record.sessions.push({ token: token, at: Date.now() });
  record.fails = 0;
  record.lockedUntil = 0;
  return token;
}

function assertSession(record, token) {
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    fail(429, "尝试次数过多，请十五分钟后再登录。");
  }
  const sessions = freshSessions(record.sessions);
  record.sessions = sessions;
  const ok = sessions.some(function (item) { return sameText(item.token, String(token || "")); });
  if (!ok) fail(401, "登录已失效，请重新登录。");
}

function noteFailure(record) {
  record.fails = (record.fails || 0) + 1;
  if (record.fails >= 8) {
    record.fails = 0;
    record.lockedUntil = Date.now() + LOCK_MS;
  }
}

async function readRecord(store, key) {
  const found = await store.getWithMetadata(key, { type: "json", consistency: "strong" });
  if (!found || !found.data) return null;
  return { etag: found.etag || "", record: found.data };
}

async function writeRecord(store, key, record, etag) {
  const options = etag ? { onlyIfMatch: etag } : { onlyIfNew: true };
  return store.setJSON(key, record, options);
}

async function updateRecord(store, key, change) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const found = await readRecord(store, key);
    if (!found) return null;
    const next = change(structuredClone(found.record));
    const wrote = await writeRecord(store, key, next, found.etag);
    if (wrote.modified) return next;
  }
  fail(503, "同步没有完成，请再试一次。");
}

async function signup(store, body) {
  const username = normalizeName(body.username);
  checkPassword(body.password);
  const key = userKey(username);
  if (await readRecord(store, key)) fail(409, "这个用户名已经注册。请直接登录。");
  const salt = randomBytes(16);
  const progress = publicState(mergeProgress(blankProgress(), body.state || blankProgress()));
  const record = {
    username: username,
    salt: salt.toString("hex"),
    hash: hashPassword(body.password, salt).toString("hex"),
    fails: 0,
    lockedUntil: 0,
    sessions: [],
    progress: progress
  };
  const token = issueSession(record);
  const wrote = await writeRecord(store, key, record, "");
  if (!wrote.modified) fail(409, "这个用户名已经注册。请直接登录。");
  return { username: username, token: token, state: progress };
}

async function login(store, body) {
  const username = normalizeName(body.username);
  checkPassword(body.password);
  const key = userKey(username);
  let token = "";
  let progress = null;
  let rejected = "";
  const record = await updateRecord(store, key, function (current) {
    if (current.lockedUntil && Date.now() < current.lockedUntil) {
      fail(429, "尝试次数过多，请十五分钟后再登录。");
    }
    const salt = Buffer.from(current.salt, "hex");
    const expected = Buffer.from(current.hash, "hex");
    const actual = hashPassword(body.password, salt);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      noteFailure(current);
      rejected = "用户名或密码不正确。";
      return current;
    }
    progress = publicState(mergeProgress(current.progress, body.state || blankProgress()));
    current.progress = progress;
    token = issueSession(current);
    return current;
  });
  if (!record || rejected) fail(401, rejected || "用户名或密码不正确。");
  return { username: record.username, token: token, state: progress };
}

async function pull(store, body) {
  const username = normalizeName(body.username);
  const key = userKey(username);
  const found = await readRecord(store, key);
  if (!found) fail(401, "登录已失效，请重新登录。");
  assertSession(found.record, body.token);
  return { username: found.record.username, state: publicState(found.record.progress) };
}

async function push(store, body) {
  const username = normalizeName(body.username);
  const key = userKey(username);
  let progress = null;
  const record = await updateRecord(store, key, function (current) {
    assertSession(current, body.token);
    progress = publicState(mergeProgress(current.progress, body.state || blankProgress()));
    current.progress = progress;
    return current;
  });
  if (!record) fail(401, "登录已失效，请重新登录。");
  return { username: record.username, state: progress };
}

async function wipe(store, body) {
  const username = normalizeName(body.username);
  const key = userKey(username);
  const progress = publicState(blankProgress());
  const record = await updateRecord(store, key, function (current) {
    assertSession(current, body.token);
    current.progress = progress;
    return current;
  });
  if (!record) fail(401, "登录已失效，请重新登录。");
  return { username: record.username, state: progress, reset: true };
}

async function logout(store, body) {
  const username = normalizeName(body.username);
  const key = userKey(username);
  await updateRecord(store, key, function (current) {
    current.sessions = freshSessions(current.sessions).filter(function (item) {
      return !sameText(item.token, String(body.token || ""));
    });
    return current;
  });
  return { ok: true };
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "content-type",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-max-age": "86400"
      }
    });
  }
  if (req.method !== "POST") return json(405, { error: "只接受登录和同步请求。" });
  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    return json(400, { error: "请求无法读取。" });
  }
  try {
    const store = getStore({ name: "daiyin-accounts", consistency: "strong" });
    const action = body && body.action;
    if (action === "signup") return json(200, await signup(store, body));
    if (action === "login") return json(200, await login(store, body));
    if (action === "pull") return json(200, await pull(store, body));
    if (action === "push") return json(200, await push(store, body));
    if (action === "wipe") return json(200, await wipe(store, body));
    if (action === "logout") return json(200, await logout(store, body));
    return json(400, { error: "无法识别的操作。" });
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    return json(status, { error: status === 500 ? "同步没有完成，请稍后再试。" : err.message });
  }
}

export const config = { path: "/api/account" };
