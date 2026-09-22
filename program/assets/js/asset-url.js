/**
 * 이미지 경로: webp 우선, 없으면 png/jpg로 자동 대체
 *
 * - assetUrl(path): png/jpg → webp (용량 절약용 기본 URL)
 * - 로드 실패 시 document capture 단계에서 확장자를 바꿔 재시도
 * - pickAssetUrl(path, cb): CSS 배경 등에서 실제로 열리는 URL 고르기
 */
(function (root) {
  "use strict";

  var EXT_RE = /\.(webp|png|jpe?g)(\?[^#]*)?$/i;

  function splitPath(path) {
    var s = String(path || "");
    var m = s.match(EXT_RE);
    if (!m) return null;
    return {
      base: s.slice(0, m.index),
      ext: String(m[1] || "").toLowerCase(),
      query: m[2] || ""
    };
  }

  function withExt(parts, ext) {
    return parts.base + "." + ext + parts.query;
  }

  function assetUrl(path) {
    var parts = splitPath(path);
    if (!parts) return String(path || "");
    if (parts.ext === "png" || parts.ext === "jpg" || parts.ext === "jpeg") {
      return withExt(parts, "webp");
    }
    return String(path || "");
  }

  function assetFallbacks(path) {
    var parts = splitPath(path);
    if (!parts) return [];
    var order;
    if (parts.ext === "webp") order = ["png", "jpg", "jpeg"];
    else if (parts.ext === "png") order = ["webp", "jpg", "jpeg"];
    else order = ["webp", "png"];
    return order.map(function (ext) {
      return withExt(parts, ext);
    });
  }

  function candidatesFor(path) {
    var preferred = assetUrl(path);
    var list = [preferred].concat(assetFallbacks(preferred));
    // 원본이 png인데 webp가 없을 수도 있으니 원본도 후보에 포함
    var raw = String(path || "");
    if (raw && list.indexOf(raw) < 0) list.push(raw);
    var out = [];
    var seen = {};
    list.forEach(function (u) {
      if (!u || seen[u]) return;
      seen[u] = true;
      out.push(u);
    });
    return out;
  }

  function nextFallback(img) {
    var tried = String(img.getAttribute("data-asset-tried") || "")
      .split("|")
      .filter(Boolean);
    var current = img.getAttribute("src") || "";
    if (current && tried.indexOf(current) < 0) tried.push(current);
    var pool = candidatesFor(current || img.getAttribute("data-asset-src") || "");
    for (var i = 0; i < pool.length; i += 1) {
      if (tried.indexOf(pool[i]) < 0) {
        tried.push(pool[i]);
        img.setAttribute("data-asset-tried", tried.join("|"));
        img.src = pool[i];
        return true;
      }
    }
    return false;
  }

  function onError(ev) {
    var el = ev.target;
    if (!el || el.tagName !== "IMG") return;
    if (el.getAttribute("data-asset-no-fallback") === "1") return;
    if (nextFallback(el)) {
      try {
        ev.stopPropagation();
      } catch (_) {}
    }
  }

  function install(doc) {
    doc = doc || (typeof document !== "undefined" ? document : null);
    if (!doc || doc.documentElement.getAttribute("data-asset-fallback") === "1") return;
    doc.documentElement.setAttribute("data-asset-fallback", "1");
    doc.addEventListener("error", onError, true);
  }

  function pickAssetUrl(pathOrList, cb) {
    var list = Array.isArray(pathOrList) ? pathOrList.slice() : candidatesFor(pathOrList);
    var i = 0;
    function tryNext() {
      if (i >= list.length) {
        if (typeof cb === "function") cb("");
        return;
      }
      var url = list[i];
      i += 1;
      var img = new Image();
      img.onload = function () {
        if (typeof cb === "function") cb(url);
      };
      img.onerror = tryNext;
      img.src = url;
    }
    tryNext();
  }

  root.assetUrl = assetUrl;
  root.assetFallbacks = assetFallbacks;
  root.assetCandidates = candidatesFor;
  root.pickAssetUrl = pickAssetUrl;
  root.installAssetFallback = install;

  if (typeof document !== "undefined") install(document);
})(typeof window !== "undefined" ? window : globalThis);
