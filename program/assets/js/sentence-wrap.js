/**
 * 문장 단위 줄바꿈 (앱 전체)
 *
 * CSS만으로는 "어절 단위"까지만 줄을 바꿀 수 있고, "문장 단위"는 할 수 없다.
 * 그래서 화면에 글이 그려질 때마다 한 요소 안의 여러 문장을 문장마다 <span class="sent">로 묶는다.
 *  - 기본: .sent 는 inline-block → 자리가 모자라면 문장 통째로 다음 줄로 넘어간다.
 *          (한 문장이 한 줄보다 길 때만 그 문장 안에서 어절 단위로 줄을 바꾼다)
 *  - .sent-lines 안: .sent 가 block → 자리가 넉넉해도 한 문장에 한 줄씩 (가치수호책 정리 문장 등)
 *
 * 문장 끝: 한글 뒤의 . ! ? (따옴표·괄호가 붙어도 됨) 다음에 띄어쓰기가 올 때.
 *   "2026. 9. 19." 같은 날짜, "1. 태극기" 같은 번호는 숫자 뒤라서 나누지 않는다.
 * 제외: 입력칸, 코드, 그림(svg/canvas), 직접 고치는 글(contenteditable), .no-sent-wrap
 */
(function () {
  "use strict";

  const BOUNDARY = /((?:[가-힣][.!?]+|[!?]+)["”’')\]]*)(\s+)(?=[^\s\d.,!?])/g;
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE",
    "SVG", "CANVAS", "VIDEO", "AUDIO", "IFRAME", "NOSCRIPT", "TEMPLATE"]);
  const BREAK_TAGS = new Set(["BR", "DIV", "P", "UL", "OL", "LI", "TABLE", "SECTION", "ARTICLE", "HR"]);

  function skipped(el) {
    if (!el || el.nodeType !== 1) return true;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.namespaceURI && el.namespaceURI.indexOf("svg") >= 0) return true;
    if (el.isContentEditable) return true;
    if (el.classList && el.classList.contains("sent")) return true;
    if (el.closest && el.closest(".no-sent-wrap, svg, textarea, [contenteditable='true']")) return true;
    return false;
  }

  function hasBoundary(text) {
    BOUNDARY.lastIndex = 0;
    return BOUNDARY.test(text);
  }

  /** 요소 하나: 바로 아래 글자 안에 문장 경계가 있으면 문장마다 묶는다 */
  function wrapElement(el) {
    if (skipped(el)) return;
    const kids = Array.from(el.childNodes);
    if (!kids.some((n) => n.nodeType === 3 && hasBoundary(n.nodeValue))) return;

    const groups = [[]];     // 문장 묶음
    const between = [];      // 묶음 사이에 둘 공백/줄바꿈 노드 (groups[i] 뒤)
    const cur = () => groups[groups.length - 1];
    const cut = (sepNode) => {
      between[groups.length - 1] = sepNode;
      groups.push([]);
    };

    kids.forEach((node) => {
      if (node.nodeType === 3) {
        const text = node.nodeValue;
        BOUNDARY.lastIndex = 0;
        let last = 0;
        let m;
        while ((m = BOUNDARY.exec(text))) {
          const end = m.index + m[1].length;
          cur().push(document.createTextNode(text.slice(last, end)));
          cut(document.createTextNode(m[2]));
          last = end + m[2].length;
        }
        if (last < text.length) cur().push(document.createTextNode(text.slice(last)));
      } else if (node.nodeType === 1 && BREAK_TAGS.has(node.tagName)) {
        cut(node);
      } else {
        cur().push(node);
      }
    });

    const real = groups.filter((g) => g.some((n) => n.nodeType !== 3 || n.nodeValue.trim()));
    if (real.length < 2) return;

    const frag = document.createDocumentFragment();
    groups.forEach((g, i) => {
      if (g.some((n) => n.nodeType !== 3 || n.nodeValue.trim())) {
        const span = document.createElement("span");
        span.className = "sent";
        g.forEach((n) => span.appendChild(n));
        frag.appendChild(span);
      } else {
        g.forEach((n) => frag.appendChild(n));
      }
      if (between[i]) frag.appendChild(between[i]);
    });
    el.textContent = "";
    el.appendChild(frag);
  }

  function processTree(root) {
    if (!root || root.nodeType !== 1 || skipped(root)) return;
    wrapElement(root);
    const all = root.querySelectorAll("*");
    for (let i = 0; i < all.length; i += 1) wrapElement(all[i]);
  }

  let queue = new Set();
  let scheduled = false;
  function flush() {
    scheduled = false;
    const list = Array.from(queue);
    queue = new Set();
    list.forEach((el) => { if (el.isConnected) processTree(el); });
  }
  function enqueue(el) {
    if (!el || el.nodeType !== 1) return;
    queue.add(el);
    if (!scheduled) {
      scheduled = true;
      (window.requestAnimationFrame || setTimeout)(flush);
    }
  }

  function start() {
    if (!document.body) return;
    processTree(document.body);
    const mo = new MutationObserver((muts) => {
      muts.forEach((mu) => {
        if (mu.type !== "childList") return;
        mu.addedNodes.forEach((n) => {
          if (n.nodeType === 1) enqueue(n);
          else if (n.nodeType === 3 && n.parentNode) enqueue(n.parentNode);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  window.SentenceWrap = { processTree, wrapElement };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
