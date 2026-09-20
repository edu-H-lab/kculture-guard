(function (root) {
  "use strict";
  function assetUrl(path) {
    return String(path || "").replace(/\.(png|jpe?g)(\?[^#]*)?$/i, ".webp$2");
  }
  root.assetUrl = assetUrl;
})(typeof window !== "undefined" ? window : globalThis);
