const { AsyncLocalStorage } = require("async_hooks");

const als = new AsyncLocalStorage();

function now() {
  return Date.now();
}

function begin(kind, extra) {
  return {
    kind: kind || "unknown",
    activityId: String((extra && extra.activityId) || ""),
    t0: now(),
    t_build_context: 0,
    t_parse_validate: 0,
    t_gemini_calls: [],
    geminiCalls: 0,
    inFlight: 0,
    maxInFlight: 0,
    count_429: 0,
    count_timeout: 0,
    count_fallback: 0,
    summarySource: "",
    action: "",
    answerState: "",
    strategy: "",
    finish: false
  };
}

function current() {
  return als.getStore() || null;
}

function run(ctx, fn) {
  return als.run(ctx, fn);
}

function addParse(ms) {
  const ctx = current();
  if (!ctx) return;
  ctx.t_parse_validate += Math.max(0, Number(ms) || 0);
}

function note429() {
  const ctx = current();
  if (ctx) ctx.count_429 += 1;
}

function noteTimeout() {
  const ctx = current();
  if (ctx) ctx.count_timeout += 1;
}

function noteFallback() {
  const ctx = current();
  if (ctx) ctx.count_fallback += 1;
}

function geminiStart(purpose) {
  const ctx = current();
  const rec = {
    purpose: String(purpose || "unknown"),
    t_gemini_ms: 0,
    status: "pending",
    httpStatus: 0
  };
  const t0 = now();
  let finished = false;
  if (ctx) {
    ctx.geminiCalls += 1;
    ctx.inFlight += 1;
    if (ctx.inFlight > ctx.maxInFlight) ctx.maxInFlight = ctx.inFlight;
    ctx.t_gemini_calls.push(rec);
  }
  return {
    done(info) {
      if (finished) return;
      finished = true;
      rec.t_gemini_ms = now() - t0;
      rec.status = String((info && info.status) || "ok");
      rec.httpStatus = Number((info && info.httpStatus) || 0);
      if (ctx) ctx.inFlight = Math.max(0, ctx.inFlight - 1);
    }
  };
}

function geminiModeOf(ctx) {
  if (!ctx || !ctx.geminiCalls) return "none";
  if (ctx.maxInFlight > 1) return "parallel";
  return "sequential";
}

function finish(extra) {
  const ctx = current();
  if (!ctx) return;
  if (extra) {
    if (extra.activityId) ctx.activityId = extra.activityId;
    if (extra.action != null) ctx.action = extra.action;
    if (extra.answerState != null) ctx.answerState = extra.answerState;
    if (extra.strategy != null) ctx.strategy = extra.strategy;
    if (extra.finish != null) ctx.finish = !!extra.finish;
    if (extra.summarySource) ctx.summarySource = extra.summarySource;
    if (extra.t_build_context != null) ctx.t_build_context = extra.t_build_context;
  }
  const t_gemini_total = (ctx.t_gemini_calls || []).reduce((sum, item) => sum + Number(item.t_gemini_ms || 0), 0);
  const payload = {
    kind: ctx.kind,
    activityId: ctx.activityId || "",
    t_build_context: ctx.t_build_context,
    t_gemini_total,
    t_gemini_calls: ctx.t_gemini_calls,
    t_parse_validate: ctx.t_parse_validate,
    t_total: now() - ctx.t0,
    geminiCalls: ctx.geminiCalls,
    geminiMode: geminiModeOf(ctx),
    count_429: ctx.count_429,
    count_timeout: ctx.count_timeout,
    count_fallback: ctx.count_fallback,
    action: ctx.action || "",
    answerState: ctx.answerState || "",
    strategy: ctx.strategy || "",
    finish: !!ctx.finish
  };
  if (ctx.kind === "summary") payload.summarySource = ctx.summarySource || "";
  console.log("[ThinkFriend:timing]", JSON.stringify(payload));
}

module.exports = {
  begin,
  run,
  current,
  addParse,
  note429,
  noteTimeout,
  noteFallback,
  geminiStart,
  finish
};
