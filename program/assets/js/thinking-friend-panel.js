/**
 * 공통 ThinkFriendPanel UI
 * 14개 활동이 같은 패널을 쓰고, 내용만 엔진 응답으로 채운다.
 */
(function () {
  "use strict";

  function escapeHtml(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

    function choiceButtons(choices) {
    return (choices || []).map((choice, index) => {
      const id = String(choice.value || choice.id || choice.label || index);
      const label = String(choice.label || choice.value || "");
      const hint = String(choice.hint || "");
      const shown = hint ? `${label} — ${hint}` : label;
      return `<button type="button" class="vrf-choice" data-tf-id="${escapeHtml(id)}" data-tf-label="${escapeHtml(label)}">${escapeHtml(shown)}</button>`;
    }).join("");
  }

  function composeHTML(ui) {
    ui = ui || {};
    const listening = !!ui.listening;
    const said = String(ui.voiceValue || "").trim();
    let voiceBody = "";
    if (listening) voiceBody = `<p class="vrf-listen">듣고 있어요...</p>`;
    else if (said) voiceBody = `<p class="vrf-voice-result">${escapeHtml(said)}</p>`;
    else if (ui.voiceError) voiceBody = `<p class="vrf-soft">지금은 말을 듣지 못했어요. 글로 적어도 괜찮아요.</p>`;
    const speakLabel = listening ? "듣고 있어요..." : (said ? "다시 말하기" : "말로 답하기");
    return `
      <textarea id="vrfTfWriteInput" class="vrf-textarea" rows="3" maxlength="160" placeholder="생각나는 대로 적어 보세요.">${escapeHtml(ui.writeValue || "")}</textarea>
      ${voiceBody}
      <div class="vrf-actions vrf-actions--pair">
        <button type="button" class="vrf-btn vrf-btn--next" id="vrfTfKeepBtn">이대로</button>
        <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfTfSpeakBtn" ${listening ? "disabled" : ""}>${speakLabel}</button>
      </div>
    `;
  }

  function renderHTML(session, ui) {
    const ACTION = (window.ThinkFriendEngine && window.ThinkFriendEngine.ACTION) || {};
    const data = session || {};
    const action = data.action || "";
    const said = String(data.initialAnswer || "").trim();
    let body = "";

    if (data.summaryWaiting) {
      body = `
        <p class="vrf-kicker">잠시만</p>
        <p class="vrf-soft">생각을 정리하는 중이야…</p>
      `;
    } else if (data.summaryTimedOut) {
      body = `
        <p class="vrf-kicker">잠시 멈춤</p>
        <p class="vrf-soft">지금은 정리하기가 조금 늦어졌어.</p>
        <div class="vrf-actions">
          <button type="button" class="vrf-btn vrf-btn--next" id="vrfSummaryRetryBtn">다시 해볼까?</button>
        </div>
      `;
    } else if (action === ACTION.FINISH || action === "FINISH") {
      const draft = String((ui && ui.finalDraft) || data.finalAnswer || data.finalSummary || "").trim();
      if (data.editingFinal) {
        body = `
          <p class="vrf-kicker">내가 고쳐 쓸래</p>
          <textarea id="vrfFinalEdit" class="vrf-textarea" rows="3" maxlength="160">${escapeHtml(draft)}</textarea>
          <div class="vrf-actions vrf-actions--pair">
            <button type="button" class="vrf-btn vrf-btn--save" id="vrfSaveBtn">이대로 저장</button>
            <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfCancelEditBtn">다시 보기</button>
          </div>
        `;
      } else {
        body = `
          <p class="vrf-kicker">네 생각을 이렇게 정리했어.</p>
          <p class="tf-summary">${escapeHtml(data.finalSummary || data.finalAnswer || "")}</p>
          <div class="vrf-actions vrf-actions--pair">
            <button type="button" class="vrf-btn vrf-btn--save" id="vrfSaveBtn">이대로 저장</button>
            <button type="button" class="vrf-btn vrf-btn--ghost" id="vrfEditBtn">내가 고쳐 쓸래</button>
          </div>
        `;
      }
    } else if (action === ACTION.SHOW_CHOICES || action === "SHOW_CHOICES") {
      const kicker = (data.strategy === "confirm" || data.state === "NEED_CONFIRM")
        ? "확인"
        : (data.strategy === "meaning-check")
          ? "골라 볼까?"
          : "추가 질문";
      body = `
        <p class="vrf-kicker">${kicker}</p>
        <h2 class="vrf-title">${escapeHtml(data.question || "하나만 골라 볼까?")}</h2>
        <div class="vrf-choices">${choiceButtons(data.choices)}</div>
      `;
    } else {
      body = `
        <p class="vrf-kicker">추가 질문</p>
        <h2 class="vrf-title">${escapeHtml(data.question || "조금만 더 말해 줄래?")}</h2>
        ${composeHTML(ui)}
      `;
    }

    return `
      <section class="tf-panel" id="thinkFriendPanel">
        ${said ? `<p class="tf-said">내가 말한 것: “${escapeHtml(said)}”</p>` : ""}
        <header class="tf-friend">
          <span class="tf-face" aria-hidden="true">🐻</span>
          <div>
            <p class="tf-name">생각 친구</p>
            <p class="tf-hello">${escapeHtml(data.friendLine || "네 이야기를 잘 들었어!")}</p>
          </div>
        </header>
        ${body}
      </section>
    `;
  }

  window.ThinkFriendPanel = {
    renderHTML
  };
})();
