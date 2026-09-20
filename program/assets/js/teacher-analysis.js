/**
 * 교사용 분석 (1·2단계: AI 없이 코드로 계산)
 *
 * 생각친구 2차 설계(①떠올리기 ②생각하기 ③나와 연결) 기록을 반 전체로 모아
 *  ① 수업 한눈에 보기
 *  ② 우리 반 생각 지도 — 단계별 보기 선택과 학생이 직접 쓴 말
 *  ③ 수업 목표 개념, 얼마나 드러났을까? (teacher-target-ideas.js)
 *  ④ 생각친구와 생각을 이어 간 과정 — 참여 방식과 대표 사례
 *  ⑤ AI 분석 (3단계에서 채움)
 *
 * 숫자는 모두 코드가 셉니다. teacher-tools.js 가 renderHTML(item, rows, config, helpers)로 부릅니다.
 */
(function () {
  "use strict";

  const STEP_META = [
    { type: "fact", label: "① 떠올리기" },
    { type: "concept", label: "② 생각하기" },
    { type: "transfer", label: "③ 나와 연결" }
  ];

  const MODES = [
    { id: "own", label: "내 말로 썼어요" },
    { id: "both", label: "보기 + 내 말" },
    { id: "choice", label: "보기만 골랐어요" },
    { id: "skip", label: "건너뛰었어요" }
  ];

  function escapeHtml(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function clean(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function questionsFor(activity) {
    const GQ = window.ThinkFriendQuestions;
    return GQ && typeof GQ.get === "function" ? GQ.get(activity) : null;
  }

  function turnsOf(rec) {
    if (!rec) return [];
    if (Array.isArray(rec.thinkingFriendTurns) && rec.thinkingFriendTurns.length) return rec.thinkingFriendTurns;
    const tf = rec.thinkFriend || {};
    return Array.isArray(tf.thinkingFriendTurns) ? tf.thinkingFriendTurns : [];
  }

  /** 기록 하나에서 ①②③ 단계별 답 {picked, text, skipped, stuck} */
  function stepAnswers(rec) {
    const guided = rec?.thinkFriend?.guided?.answers;
    const turns = turnsOf(rec);
    return STEP_META.map((meta, i) => {
      const g = Array.isArray(guided) ? guided[i] : null;
      const turn = turns.find((t) => t && t.strategy === meta.type) || turns[i] || null;
      if (g) {
        return {
          picked: (g.picked || []).map(clean).filter(Boolean),
          text: clean(g.text),
          skipped: !!g.skipped,
          stuck: Number(g.stuck) || 0
        };
      }
      if (!turn) return { picked: [], text: "", skipped: true, stuck: 0 };
      const picked = Array.isArray(turn.picked) ? turn.picked.map(clean).filter(Boolean) : [];
      let text = "";
      if (turn.source === "free_response") {
        const raw = clean(turn.answer);
        text = picked.length ? clean(raw.split(" / ").slice(1).join(" / ")) : raw;
      }
      return { picked, text, skipped: !!turn.skipped || (!picked.length && !text), stuck: 0 };
    });
  }

  function modeOf(ans) {
    if (!ans || ans.skipped) return "skip";
    if (ans.text && ans.picked.length) return "both";
    if (ans.text) return "own";
    return "choice";
  }

  function finalOf(rec, helpers) {
    if (helpers && typeof helpers.thoughtOf === "function") return clean(helpers.thoughtOf(rec));
    return clean(rec?.finalAnswer || rec?.finalSummary || rec?.reflectionText || "");
  }

  function isEdited(rec) {
    if (!rec) return false;
    if (rec.studentEdited) return true;
    const summary = clean(rec.finalSummary || rec.thinkFriend?.finalSummary);
    const fin = clean(rec.finalAnswer || rec.thinkFriend?.finalAnswer);
    return !!(summary && fin && summary !== fin);
  }

  function responseKind(rec) {
    if (rec?.audioUrl || rec?.responseType === "voice" || rec?.inputMode === "voice") return "voice";
    return "text";
  }

  /** 학생이 한 말 전체(고른 보기 + 직접 쓴 말) */
  function ownWordsOf(steps) {
    return steps.map((s) => s.picked.concat(s.text ? [s.text] : []).join(" ")).join(" ");
  }

  /** 수업 목표 개념 하나가 드러났는지 (낱말 기준, 참고용) */
  function ideaMatched(idea, text, picks, steps) {
    const t = String(text || "");
    if (!idea) return false;
    if (idea.step && Array.isArray(steps)) {
      const si = STEP_META.findIndex((m) => m.type === idea.step);
      if (si >= 0 && steps[si] && !steps[si].skipped) return true;
    }
    if ((idea.exact || []).some((w) => (picks || []).indexOf(w) >= 0)) return true;
    if (!t) return false;
    if ((idea.any || []).some((kw) => t.indexOf(kw) >= 0)) return true;
    const groups = idea.all || [];
    return groups.length > 0 && groups.every((group) => group.some((kw) => t.indexOf(kw) >= 0));
  }

  /** 최종 문장에서 학생이 직접 쓴 말을 <mark>로 표시 */
  function highlightTyped(finalText, steps) {
    const text = String(finalText || "");
    const marked = new Array(text.length).fill(false);
    steps.forEach((s) => {
      if (!s.text) return;
      const core = s.text.replace(/[.!?~]+$/g, "").replace(/(요|이요)$/, "");
      [s.text, core].forEach((frag) => {
        if (frag.length < 2) return;
        let from = 0;
        while (from < text.length) {
          const at = text.indexOf(frag, from);
          if (at < 0) break;
          for (let i = at; i < at + frag.length; i += 1) marked[i] = true;
          from = at + frag.length;
        }
      });
    });
    let html = "";
    let open = false;
    for (let i = 0; i < text.length; i += 1) {
      if (marked[i] && !open) { html += '<mark class="tan-own">'; open = true; }
      if (!marked[i] && open) { html += "</mark>"; open = false; }
      html += escapeHtml(text[i]);
    }
    if (open) html += "</mark>";
    return html;
  }

  /** 활동 하나의 반 전체 분석값 */
  function analyze(item, rows, config, helpers) {
    const isComplete = helpers && helpers.isCompleteRecord ? helpers.isCompleteRecord : (rec) => !!rec;
    const recordFor = helpers && helpers.recordFor
      ? helpers.recordFor
      : (records, activity) => (records || []).find((r) => r && r.activity === activity) || null;
    const entry = questionsFor(item.activity);

    const all = rows.map((row) => {
      const rec = recordFor(row.records, item.activity);
      return { row, rec, complete: isComplete(rec) };
    });
    const done = all.filter((e) => e.complete).map((e) => {
      const steps = stepAnswers(e.rec);
      return { ...e, steps, finalText: finalOf(e.rec, helpers), edited: isEdited(e.rec) };
    });
    const missing = all.filter((e) => !e.complete);

    const kinds = { text: 0, voice: 0 };
    done.forEach((e) => { kinds[responseKind(e.rec)] += 1; });

    // 단계별 생각 지도
    const stepMaps = STEP_META.map((meta, si) => {
      const step = entry && entry.steps ? entry.steps[si] : null;
      const tally = {};
      (step ? step.choices : []).forEach((c) => { tally[c] = []; });
      const typed = [];
      const modes = { own: 0, both: 0, choice: 0, skip: 0 };
      done.forEach((e) => {
        const ans = e.steps[si];
        modes[modeOf(ans)] += 1;
        ans.picked.forEach((p) => {
          if (!tally[p]) tally[p] = [];
          tally[p].push(e.row.student);
        });
        if (ans.text) typed.push({ student: e.row.student, text: ans.text });
      });
      const choices = Object.keys(tally)
        .map((label) => ({ label, students: tally[label], count: tally[label].length }))
        .sort((a, b) => b.count - a.count);
      return { meta, question: step ? step.q : "", choices, typed, modes };
    });

    // 수업 목표 개념
    let coverage = null;
    const T = window.TeacherTargetIdeas;
    const ideasEntry = T && typeof T.get === "function" ? T.get(item.activity) : null;
    if (ideasEntry) {
      const texts = done.map((e) => ({
        e,
        text: ownWordsOf(e.steps),
        picks: e.steps.reduce((acc, s) => acc.concat(s.picked), []),
        steps: e.steps
      }));
      coverage = {
        entry: ideasEntry,
        status: T.status,
        ideas: ideasEntry.ideas.map((idea) => {
          const students = texts.filter((x) => ideaMatched(idea, x.text, x.picks, x.steps)).map((x) => x.e.row.student);
          return { ...idea, students, count: students.length };
        })
      };
    }

    const writers = done.filter((e) => e.steps.some((s) => s.text));
    const skippers = done.filter((e) => e.steps.some((s) => s.skipped));
    const stuckers = done.filter((e) => e.steps.some((s) => s.stuck));
    const editors = done.filter((e) => e.edited);
    const cases = writers
      .slice()
      .sort((a, b) => b.steps.filter((s) => s.text).length - a.steps.filter((s) => s.text).length)
      .slice(0, 4);

    return {
      entry, total: rows.length, done, missing, kinds, stepMaps, coverage,
      writers, skippers, stuckers, editors, cases
    };
  }

  function studentName(s) {
    return `${escapeHtml(s.number)}번 ${escapeHtml(s.name)}`;
  }

  function statTile(label, value, sub) {
    return `
      <div class="tan-stat">
        <span class="tan-stat-label">${escapeHtml(label)}</span>
        <strong class="tan-stat-value">${value}</strong>
        ${sub ? `<span class="tan-stat-sub">${sub}</span>` : ""}
      </div>
    `;
  }

  function overviewHTML(a) {
    const n = a.done.length || 1;
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">1</span>수업 한눈에 보기</h4>
        <div class="tan-stats">
          ${statTile("가치수호록 완료", `${a.done.length}<small> / ${a.total}명</small>`,
            a.missing.length ? `미작성 ${a.missing.length}명` : "모두 완료")}
          ${statTile("자기 말로 답한 학생", `${a.writers.length}<small>명</small>`,
            `완료 학생의 ${Math.round((a.writers.length / n) * 100)}%`)}
          ${statTile("정리 문장을 스스로 고친 학생", `${a.editors.length}<small>명</small>`, "")}
          ${statTile("응답 방식", `글 ${a.kinds.text} · 말 ${a.kinds.voice}`, "")}
        </div>
        ${a.missing.length ? `
          <details class="tan-more">
            <summary>아직 쓰지 않은 학생 보기</summary>
            <p>${a.missing.map((e) => studentName(e.row.student)).join(", ")}</p>
          </details>` : ""}
      </section>
    `;
  }

  function stepMapHTML(sm, doneCount) {
    const max = Math.max(1, ...sm.choices.map((c) => c.count));
    const top = sm.choices[0];
    const zero = sm.choices.filter((c) => !c.count).map((c) => escapeHtml(c.label));
    return `
      <div class="tan-step">
        <p class="tan-step-head"><span class="tan-step-tag">${escapeHtml(sm.meta.label)}</span> ${escapeHtml(sm.question)}</p>
        ${top && top.count ? `<p class="tan-lead">가장 많이 고른 답은 <strong>${escapeHtml(top.label)}</strong>(${top.count}명)이에요.${zero.length ? ` 아무도 고르지 않은 보기: ${zero.join(", ")}` : ""}</p>` : ""}
        <ul class="tan-bars">
          ${sm.choices.map((c) => `
            <li class="${c.count ? "" : "is-zero"}">
              <div class="tan-bar-row">
                <span class="tan-bar-label">${escapeHtml(c.label)}</span>
                <span class="tan-bar-track"><span style="width:${Math.round((c.count / max) * 100)}%"></span></span>
                <span class="tan-bar-count">${c.count}명</span>
              </div>
              ${c.count ? `<p class="tan-bar-names">${c.students.map(studentName).join(", ")}</p>` : ""}
            </li>
          `).join("")}
        </ul>
        ${sm.typed.length ? `
          <div class="tan-typed">
            <p class="tan-typed-title">✏️ 보기 밖에서 직접 쓴 말 ${sm.typed.length}개</p>
            <ul>${sm.typed.map((t) => `<li><strong>${studentName(t.student)}</strong> ${escapeHtml(t.text)}</li>`).join("")}</ul>
          </div>` : ""}
        ${sm.modes.skip ? `<p class="tan-skip">이 질문을 건너뛴 학생 ${sm.modes.skip}명 / ${doneCount}명</p>` : ""}
      </div>
    `;
  }

  function thinkingMapHTML(a) {
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">2</span>우리 반 생각 지도</h4>
        ${a.entry ? `<p class="tan-question">핵심 질문 “${escapeHtml(a.entry.core)}”</p>` : ""}
        <div class="tan-steps">${a.stepMaps.map((sm) => stepMapHTML(sm, a.done.length)).join("")}</div>
      </section>
    `;
  }

  function coverageHTML(a) {
    const cov = a.coverage;
    if (!cov) return "";
    const n = a.done.length || 1;
    const low = cov.ideas.filter((idea) => idea.count / n < 0.2);
    const lead = low.length
      ? `이번 활동에서 아직 거의 드러나지 않은 생각은 <strong>${low.map((i) => escapeHtml(i.label)).join(", ")}</strong>이에요. 다음 수업에서 이 부분을 이야기해 보면 좋아요.`
      : "수업 목표 개념이 고르게 드러났어요.";
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">3</span>수업 목표 개념, 얼마나 드러났을까?
          ${cov.status === "draft" ? `<span class="tan-soon">초안</span>` : ""}</h4>
        <p class="tan-lead">${lead}</p>
        <ul class="tan-ideas">
          ${cov.ideas.map((idea) => {
            const pct = Math.round((idea.count / n) * 100);
            const lowCls = idea.count / n < 0.2 ? " is-low" : "";
            return `
              <li class="tan-idea${lowCls}">
                <div class="tan-idea-top">
                  <strong>${escapeHtml(idea.label)}</strong>
                  <span class="tan-idea-count">${idea.count}명 <small>(${pct}%)</small></span>
                </div>
                <span class="tan-bar-track"><span style="width:${pct}%"></span></span>
                <p class="tan-idea-desc">${escapeHtml(idea.desc)}</p>
                ${idea.count ? `
                  <details class="tan-more"><summary>말한 학생 보기</summary>
                    <p>${idea.students.map(studentName).join(", ")}</p>
                  </details>` : ""}
              </li>
            `;
          }).join("")}
        </ul>
        <p class="tan-note">
          근거: ${escapeHtml(cov.entry.source)}${cov.entry.guideNote ? ` · 지도 중점: ${escapeHtml(cov.entry.guideNote)}` : ""}<br />
          학생이 ①②③에서 고른 보기와 직접 쓴 말에 관련 낱말이 있는지로 센 참고용 숫자예요.
          다른 말로 표현한 생각은 빠질 수 있어서, AI 분석 단계에서 뜻으로 다시 판단할 예정이에요.
        </p>
      </section>
    `;
  }

  function modeBarHTML(modes, total) {
    return `
      <div class="tan-level-bar">
        ${MODES.filter((m) => modes[m.id]).map((m) => `
          <span class="tan-lv tan-mode--${m.id}" style="flex:${modes[m.id]}" title="${escapeHtml(m.label)} ${modes[m.id]}명">${modes[m.id]}</span>
        `).join("") || ""}
      </div>
    `;
  }

  function caseHTML(e) {
    return `
      <article class="tan-case">
        <div class="tan-case-top">
          <strong>${studentName(e.row.student)}</strong>
          <span class="tan-case-shift">${e.edited ? `<span class="tan-chip tan-mode--own">정리 문장을 직접 고침</span>` : ""}</span>
        </div>
        <ol class="tan-flow">
          ${e.steps.map((s, i) => `
            <li>
              <span class="tan-step-tag">${escapeHtml(STEP_META[i].label)}</span>
              ${s.skipped ? `<span class="tan-muted">건너뜀</span>` : ""}
              ${s.picked.map((p) => `<span class="tan-pick">${escapeHtml(p)}</span>`).join("")}
              ${s.text ? `<mark class="tan-own">${escapeHtml(s.text)}</mark>` : ""}
            </li>
          `).join("")}
        </ol>
        <p class="tan-case-label">가치수호록에 남긴 문장</p>
        <p class="tan-case-text">${highlightTyped(e.finalText, e.steps)}</p>
      </article>
    `;
  }

  function processHTML(a) {
    const n = a.done.length;
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">4</span>생각친구와 생각을 이어 간 과정</h4>
        <p class="tan-lead">
          ${n}명 중 <strong>${a.writers.length}명</strong>이 한 번 이상 보기 밖의 자기 말로 답했어요.
          ${a.skippers.length ? `질문을 건너뛴 학생은 ${a.skippers.length}명` : "건너뛴 학생은 없었고"}${a.stuckers.length ? `, 생각친구의 도움 질문을 받은 학생은 ${a.stuckers.length}명이에요.` : "요."}
        </p>
        <div class="tan-levels">
          ${a.stepMaps.map((sm) => `
            <div class="tan-level-row"><span>${escapeHtml(sm.meta.label)}</span>${modeBarHTML(sm.modes, n)}</div>
          `).join("")}
          <ul class="tan-legend">
            ${MODES.map((m) => `<li><i class="tan-mode--${m.id}"></i>${escapeHtml(m.label)}</li>`).join("")}
          </ul>
        </div>
        ${a.skippers.length || a.stuckers.length ? `
          <details class="tan-more">
            <summary>살펴볼 학생 보기 (건너뜀·막힘)</summary>
            ${a.skippers.length ? `<p>건너뜀: ${a.skippers.map((e) => studentName(e.row.student)).join(", ")}</p>` : ""}
            ${a.stuckers.length ? `<p>도움 질문 받음: ${a.stuckers.map((e) => studentName(e.row.student)).join(", ")}</p>` : ""}
          </details>` : ""}
        <p class="tan-note">
          <mark class="tan-own">노란 표시</mark>는 학생이 보기를 고르지 않고 직접 쓰거나 말한 부분이에요.
          가치수호록 문장은 학생의 답으로 생각친구가 정리한 뒤 학생이 확인한 것이라, 노란 부분이 학생 스스로의 표현이에요.
        </p>
        ${a.cases.length ? `<h5 class="tan-sub">자기 말로 답한 사례</h5><div class="tan-cases">${a.cases.map(caseHTML).join("")}</div>` : ""}
      </section>
    `;
  }

  // =====================================================================
  // ⑤ AI 분석 (3단계) — 버튼을 누를 때만 Gemini 한 번 호출
  // 학생 이름은 보내지 않고 s1, s2 … 로만 보낸다. 결과의 학생 id·근거는 서버에서 검증한다.
  // =====================================================================
  const AI_LEVELS = [
    { id: "관찰", cls: "observe", desc: "본 것·한 것을 말했어요" },
    { id: "이유", cls: "reason", desc: "까닭을 말했어요" },
    { id: "비교", cls: "compare", desc: "다른 것과 견주어 말했어요" },
    { id: "적용", cls: "apply", desc: "내 생활·오늘날에 이어 봤어요" }
  ];
  // 학급 + 활동별 상태. 결과는 Firebase(학급 공유)와 이 기기(localStorage)에 저장한다.
  const LAST = {};     // key → { a, item, payload, idMap, accMap, studentSigs, sig, classKey, activity }
  const RESULTS = {};  // key → { doc, source: "firebase" | "local" | "fresh", saved: "cloud" | "local" | "" }
  const ERRORS = {};   // key → { message }
  const PENDING = {};
  const LOADING = {};
  const LOADED = {};
  const FORCE = {};
  const LOCAL_PREFIX = "kculture_teacher_analysis_v1";

  function keyOf(classKey, activity) {
    return `${classKey || "local"}::${activity}`;
  }

  function strHash(str) {
    let h = 2166136261;
    const t = String(str || "");
    for (let i = 0; i < t.length; i += 1) {
      h ^= t.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function aiPayload(item, a) {
    const idMap = {};
    const accMap = {};
    const studentSigs = {};
    const students = a.done.map((e, i) => {
      const id = `s${i + 1}`;
      idMap[id] = e.row.student;
      accMap[id] = String(e.row.student.accountId || `${e.row.student.number}`);
      const body = {
        steps: e.steps.map((st) => ({ picked: st.picked, text: st.text, skipped: st.skipped })),
        final: e.finalText
      };
      studentSigs[accMap[id]] = strHash(JSON.stringify(body));
      return { id, ...body };
    });
    const sig = strHash(Object.keys(studentSigs).sort().map((k) => `${k}:${studentSigs[k]}`).join("|"));
    return { payload: { activity: item.activity, students }, idMap, accMap, studentSigs, sig };
  }

  /** 저장된 분석의 s1·s2 … 를 지금 학급 명단의 학생으로 다시 잇는다 */
  function idMapFromDoc(doc, a) {
    const byAcc = {};
    a.done.concat(a.missing).forEach((e) => {
      byAcc[String(e.row.student.accountId || `${e.row.student.number}`)] = e.row.student;
    });
    const out = {};
    Object.keys((doc && doc.accMap) || {}).forEach((id) => {
      out[id] = byAcc[doc.accMap[id]] || { number: "?", name: "(명단에 없는 학생)", accountId: doc.accMap[id] };
    });
    return out;
  }

  /** 분석한 뒤 새로 쓰거나 고친 기록 수 */
  function staleInfo(doc, last) {
    const saved = (doc && doc.studentSigs) || {};
    const now = last.studentSigs || {};
    let added = 0;
    let changed = 0;
    Object.keys(now).forEach((acc) => {
      if (!(acc in saved)) added += 1;
      else if (saved[acc] !== now[acc]) changed += 1;
    });
    return { added, changed, stale: added + changed > 0 };
  }

  function readLocal(key) {
    try {
      const raw = localStorage.getItem(`${LOCAL_PREFIX}::${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeLocal(key, doc) {
    try { localStorage.setItem(`${LOCAL_PREFIX}::${key}`, JSON.stringify(doc)); } catch (_) {}
  }

  function newer(x, y) {
    if (!x) return y;
    if (!y) return x;
    return String(x.savedAt || "") >= String(y.savedAt || "") ? x : y;
  }

  /** 처음 열 때 저장된 분석을 불러온다 (Firebase → 이 기기) */
  function loadSaved(key) {
    const last = LAST[key];
    if (!last || LOADED[key] || LOADING[key]) return;
    LOADING[key] = true;
    const local = readLocal(key);
    const FB = window.KCultureFirebase;
    const cloud = FB && typeof FB.loadAnalysis === "function" && last.classKey
      ? FB.loadAnalysis(last.classKey, last.activity).catch(() => null)
      : Promise.resolve(null);
    cloud.then((remote) => {
      LOADING[key] = false;
      LOADED[key] = true;
      if (RESULTS[key] && RESULTS[key].source === "fresh") return;
      const doc = newer(remote, local);
      if (doc && doc.result && doc.result.ok) {
        RESULTS[key] = { doc, source: doc === remote ? "firebase" : "local", saved: doc === remote ? "cloud" : "local" };
      }
      repaintAi(key);
    });
  }

  function saveDoc(key, doc) {
    writeLocal(key, doc);
    const last = LAST[key];
    const FB = window.KCultureFirebase;
    if (!FB || typeof FB.saveAnalysis !== "function" || !last || !last.classKey) {
      return Promise.resolve(false);
    }
    return FB.saveAnalysis(last.classKey, last.activity, doc).catch(() => false);
  }

  function namesOf(ids, idMap) {
    return (ids || []).map((id) => idMap[id]).filter(Boolean).map(studentName).join(", ");
  }

  /**
   * 생각의 깊이: AI 판단 위에 선생님이 고친 것을 얹는다.
   * 고친 내용(doc.edits)은 학생 계정번호로 저장하고, 그 학생 기록이 바뀌면 자동으로 AI 판단으로 돌아간다.
   */
  function effectiveDepth(res, entry, key) {
    const doc = (entry && entry.doc) || {};
    const edits = doc.edits || {};
    const sigs = (LAST[key] && LAST[key].studentSigs) || {};
    return (res.depth || []).map((d) => {
      const acc = (doc.accMap || {})[d.id];
      const e = acc ? edits[acc] : null;
      const valid = e && e.level && AI_LEVELS.some((lv) => lv.id === e.level) && e.sig === sigs[acc];
      return valid
        ? { ...d, level: e.level, aiLevel: d.level, edited: e.level !== d.level }
        : { ...d, aiLevel: d.level, edited: false };
    });
  }

  const OPEN_DEPTH = {}; // key → Set(level) 펼쳐 둔 목록

  function aiDepthHTML(res, idMap, entry, key) {
    const depth = effectiveDepth(res, entry, key);
    const groups = AI_LEVELS.map((lv) => ({ ...lv, items: depth.filter((d) => d.level === lv.id) }));
    const total = groups.reduce((n, g) => n + g.items.length, 0) || 1;
    const top = groups.slice().sort((x, y) => y.items.length - x.items.length)[0];
    const editedCount = depth.filter((d) => d.edited).length;
    const open = OPEN_DEPTH[key] || new Set();
    return `
      <div class="tan-ai-part">
        <h5 class="tan-sub">① 생각의 깊이 ${editedCount ? `<span class="tan-edited-tag">✏️ 선생님이 ${editedCount}명 고침</span>` : ""}</h5>
        <p class="tan-lead">가장 많은 학생이 <strong>${escapeHtml(top.id)}</strong>(${top.items.length}명) 수준으로 답했어요.</p>
        <div class="tan-level-bar tan-ai-depth">
          ${groups.filter((g) => g.items.length).map((g) => `<span class="tan-lv tan-depth--${g.cls}" style="flex:${g.items.length}" title="${escapeHtml(g.id)} ${g.items.length}명">${escapeHtml(g.id)} ${g.items.length}</span>`).join("")}
        </div>
        <p class="tan-muted tan-depth-help">목록을 펼쳐 학생 옆 단계를 누르면 선생님 판단으로 고칠 수 있어요. 고친 내용은 함께 저장돼요.</p>
        <ul class="tan-ai-levels">
          ${groups.map((g) => `
            <li>
              <span class="tan-chip tan-depth--${g.cls}">${escapeHtml(g.id)}</span>
              <span class="tan-muted">${escapeHtml(g.desc)} · ${g.items.length}명 (${Math.round((g.items.length / total) * 100)}%)</span>
              ${g.items.length ? `
                <details class="tan-more" data-tan-depth-group="${escapeHtml(key)}|${escapeHtml(g.id)}"${open.has(g.id) ? " open" : ""}><summary>학생과 근거 보기</summary>
                  <ul class="tan-ai-evidence">
                    ${g.items.map((d) => `
                      <li class="tan-depth-row${d.edited ? " is-edited" : ""}">
                        <div>
                          <strong>${idMap[d.id] ? studentName(idMap[d.id]) : ""}</strong>
                          ${d.evidence ? `“${escapeHtml(d.evidence)}”` : `<span class="tan-muted">(근거 문장 확인 안 됨)</span>`}
                          ${d.edited ? `<span class="tan-edited-note">✏️ 선생님이 고침 (AI: ${escapeHtml(d.aiLevel)})</span>` : ""}
                        </div>
                        <div class="tan-depth-pick" role="group" aria-label="생각의 깊이 고치기">
                          ${AI_LEVELS.map((lv) => `<button type="button" class="tan-depth-btn tan-depth--${lv.cls}${lv.id === d.level ? " is-on" : ""}" data-tan-depth-set="${escapeHtml(key)}|${escapeHtml(d.id)}|${escapeHtml(lv.id)}" aria-pressed="${lv.id === d.level}">${escapeHtml(lv.id)}</button>`).join("")}
                          ${d.edited ? `<button type="button" class="tan-depth-undo" data-tan-depth-set="${escapeHtml(key)}|${escapeHtml(d.id)}|">AI 판단으로</button>` : ""}
                        </div>
                      </li>`).join("")}
                  </ul>
                </details>` : ""}
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  /** 선생님이 한 학생의 생각의 깊이를 고친다 (level 이 빈 값이면 AI 판단으로 되돌림) */
  function setDepth(key, sid, level) {
    const entry = RESULTS[key];
    const last = LAST[key];
    if (!entry || !entry.doc || !last) return;
    const doc = entry.doc;
    const acc = (doc.accMap || {})[sid];
    if (!acc) return;
    const ai = ((doc.result && doc.result.depth) || []).find((d) => d.id === sid);
    const next = { ...doc, edits: { ...(doc.edits || {}) }, savedAt: new Date().toISOString() };
    if (!level || (ai && ai.level === level)) delete next.edits[acc];
    else next.edits[acc] = { level, sig: (last.studentSigs || {})[acc] || "", at: next.savedAt };
    if (!OPEN_DEPTH[key]) OPEN_DEPTH[key] = new Set();
    const before = effectiveDepth(doc.result, entry, key).find((d) => d.id === sid);
    if (before) OPEN_DEPTH[key].add(before.level);
    if (level) OPEN_DEPTH[key].add(level);
    entry.doc = next;
    entry.saved = "local";
    repaintAi(key);
    saveDoc(key, next).then((ok) => {
      if (!RESULTS[key] || RESULTS[key].doc !== next) return;
      RESULTS[key].saved = ok ? "cloud" : "local";
      repaintAi(key);
    });
  }

  function aiDivergentHTML(res, idMap) {
    const list = res.divergent || [];
    return `
      <div class="tan-ai-part">
        <h5 class="tan-sub">② 우리 반에서 나온 다른 생각</h5>
        ${list.length ? `
          <div class="tan-ai-cards">
            ${list.map((d) => `
              <article class="tan-ai-idea">
                <strong>${idMap[d.id] ? studentName(idMap[d.id]) : ""}</strong>
                <p class="tan-ai-quote">“${escapeHtml(d.quote)}”</p>
                <p class="tan-muted">${escapeHtml(d.why)}</p>
              </article>
            `).join("")}
          </div>
          ${res.discussion ? `<p class="tan-ai-discuss">💬 토론거리 · ${escapeHtml(res.discussion)}</p>` : ""}
        ` : `<p class="tan-muted">이번에는 특별히 다른 관점이 보이지 않았어요.</p>`}
      </div>
    `;
  }

  function aiIdeasHTML(res, idMap, a) {
    const cov = a.coverage;
    if (!cov) return "";
    const n = a.done.length || 1;
    const hits = {};
    (res.ideaHits || []).forEach((h) => { hits[h.ideaId] = h.ids || []; });
    const nameToId = {};
    Object.keys(idMap).forEach((id) => { nameToId[`${idMap[id].number}|${idMap[id].name}`] = id; });
    return `
      <div class="tan-ai-part">
        <h5 class="tan-sub">③ 목표 개념 다시 보기 <span class="tan-muted">(낱말 기준 → 뜻 기준)</span></h5>
        <ul class="tan-ideas">
          ${cov.ideas.map((idea) => {
            // AI는 낱말이 달라도 뜻이 같은 학생을 '더 찾는' 역할 — 낱말 기준 학생은 그대로 두고 더하기만 한다.
            // AI가 이 개념을 답에서 빠뜨렸으면 0명으로 보지 않고 '판단 없음'으로 둔다.
            const judged = Object.prototype.hasOwnProperty.call(hits, idea.id);
            const aiIds = hits[idea.id] || [];
            const wordIds = idea.students.map((st) => nameToId[`${st.number}|${st.name}`]).filter(Boolean);
            const added = aiIds.filter((id) => wordIds.indexOf(id) < 0);
            const total = wordIds.length + added.length;
            const pct = Math.round((total / n) * 100);
            return `
              <li class="tan-idea${total / n < 0.2 ? " is-low" : ""}">
                <div class="tan-idea-top">
                  <strong>${escapeHtml(idea.label)}</strong>
                  <span class="tan-idea-count">${judged ? `${idea.count}명 → <b>${total}명</b>` : `<b>${idea.count}명</b>`} <small>(${pct}%)</small></span>
                </div>
                <span class="tan-bar-track"><span style="width:${pct}%"></span></span>
                ${added.length ? `<p class="tan-idea-desc">다른 말로 표현해서 새로 찾은 학생: ${namesOf(added, idMap)}</p>` : ""}
                ${!judged ? `<p class="tan-idea-desc">AI가 이 개념은 판단하지 않았어요. 낱말 기준 숫자를 그대로 보여 줘요.</p>` : ""}
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    `;
  }

  /** 수업에 바로 쓸 수 있는 부분: 추가 질문 + 추천 활동 (눈에 띄게 맨 위에) */
  function aiLessonHTML(res) {
    const c = res.coach || {};
    const qs = c.questions || [];
    if (!qs.length && !c.activity) return "";
    return `
      <div class="tan-ai-lesson">
        <p class="tan-ai-lesson-kicker">✨ 분석을 바탕으로, 다음 수업에 바로 써 보세요</p>
        ${qs.length ? `
          <h5 class="tan-ai-lesson-title">💬 수업에 적용할 추가 질문</h5>
          <ol class="tan-ai-lesson-questions">${qs.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol>` : ""}
        ${c.activity ? `
          <h5 class="tan-ai-lesson-title">🧩 추천 활동</h5>
          <p class="tan-ai-lesson-activity">${escapeHtml(c.activity)}</p>` : ""}
      </div>
    `;
  }

  function aiCoachHTML(res) {
    const c = res.coach || {};
    if (!c.summary) return "";
    return `
      <div class="tan-ai-part">
        <h5 class="tan-sub">④ AI 교사 코치 · 우리 반 응답의 특징</h5>
        <p class="tan-lead">${escapeHtml(c.summary)}</p>
      </div>
    `;
  }

  function savedLabel(entry) {
    if (!entry || !entry.doc) return "";
    const when = (entry.doc.analyzedAt || entry.doc.savedAt) ? new Date(entry.doc.analyzedAt || entry.doc.savedAt) : null;
    const t = when && !isNaN(when) ? `${when.getMonth() + 1}월 ${when.getDate()}일 ${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}` : "";
    const where = entry.saved === "cloud" ? "☁️ 학급에 저장됨" : (entry.saved === "local" ? "💾 이 기기에만 저장됨" : "");
    return [t ? `${t} 분석` : "", where].filter(Boolean).join(" · ");
  }

  function aiBodyHTML(key) {
    const last = LAST[key];
    if (!last) return "";
    if (PENDING[key]) {
      return `<p class="tan-lead">🤖 우리 반 답을 읽고 분석하는 중이에요… (10~30초)</p>`;
    }
    const entry = RESULTS[key];
    if (entry && entry.doc && entry.doc.result && entry.doc.result.ok) {
      const res = entry.doc.result;
      const idMap = idMapFromDoc(entry.doc, last.a);
      const st = staleInfo(entry.doc, last);
      return `
        <div class="tan-ai-savebar${st.stale ? " is-stale" : ""}">
          <span>${escapeHtml(savedLabel(entry))}</span>
          ${st.stale ? `
            <strong>분석한 뒤 ${st.added ? `새로 쓴 기록 ${st.added}개` : ""}${st.added && st.changed ? ", " : ""}${st.changed ? `고친 기록 ${st.changed}개` : ""}가 있어요.</strong>
            <button type="button" class="btn tan-ai-run" data-tan-ai-run="${escapeHtml(key)}" data-force="1">🔄 다시 분석해서 반영하기</button>` : ""}
        </div>
        ${aiDepthHTML(res, idMap, entry, key)}
        ${aiDivergentHTML(res, idMap)}
        ${aiIdeasHTML(res, idMap, last.a)}
        ${aiCoachHTML(res)}
        ${aiLessonHTML(res)}
        <p class="tan-note">
          AI 결과는 참고용이에요. 학생 이름은 AI에 보내지 않았고, 근거 문장은 학생이 실제로 한 말에 있는 것만 보여 줘요.
          ${res.analyzedCount ? `분석한 기록 ${res.analyzedCount}개.` : ""}
          ${entry.saveError ? `<span class="tan-ai-error">학급 저장에 실패해서 이 기기에만 저장했어요.</span>` : ""}
          <button type="button" class="tan-ai-rerun" data-tan-ai-run="${escapeHtml(key)}" data-force="1">다시 분석</button>
        </p>
      `;
    }
    if (LOADING[key]) {
      return `<p class="tan-lead">저장된 분석을 찾는 중이에요…</p>`;
    }
    const err = ERRORS[key];
    return `
      ${err ? `<p class="tan-ai-error">${escapeHtml(err.message || "AI 분석을 하지 못했어요. 잠시 뒤 다시 눌러 주세요.")}</p>` : ""}
      <div class="tan-ai-grid">
        ${[
          ["생각의 깊이", "관찰 · 이유 · 비교 · 적용으로 반 전체 분포를 보여 줘요."],
          ["우리 반에서 나온 다른 생각", "많은 친구와 다른 관점을 골라 토론거리로 제안해요."],
          ["목표 개념 다시 보기", "낱말이 달라도 뜻이 같은 생각을 찾아 3번 결과를 다시 세어요."],
          ["수업에 적용할 추가 질문", "우리 반 응답을 바탕으로 다음 수업에 쓸 질문과 활동을 추천해요."]
        ].map(([t, d]) => `<div class="tan-ai-card"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(d)}</p></div>`).join("")}
      </div>
      <div class="tan-ai-actions">
        <button type="button" class="btn tan-ai-run tan-ai-run--cta" data-tan-ai-run="${escapeHtml(key)}">🤖 AI로 분석하기</button>
        <span class="tan-muted">학생 이름은 보내지 않아요. 분석 결과는 학급에 저장돼서 다음에 다시 볼 수 있어요.</span>
      </div>
    `;
  }

  function aiSectionHTML(item, a, classKey) {
    const key = keyOf(classKey, item.activity);
    const built = aiPayload(item, a);
    LAST[key] = { a, item, classKey: classKey || "", activity: item.activity, ...built };
    if (!LOADED[key]) setTimeout(() => loadSaved(key), 0);
    return `
      <section class="tan-block tan-block--ai" id="tanAi" data-tan-ai-key="${escapeHtml(key)}">
        <h4 class="tan-title"><span class="tan-num">5</span>AI 분석</h4>
        <div class="tan-ai-body">${aiBodyHTML(key)}</div>
      </section>
    `;
  }

  function repaintAi(key) {
    if (typeof document === "undefined") return;
    const secs = document.querySelectorAll("#tanAi");
    secs.forEach((sec) => {
      if (sec.getAttribute("data-tan-ai-key") !== key) return;
      const body = sec.querySelector(".tan-ai-body");
      if (body) body.innerHTML = aiBodyHTML(key);
    });
  }

  function runAi(key) {
    const last = LAST[key];
    if (!last || PENDING[key]) return;
    PENDING[key] = true;
    delete ERRORS[key];
    repaintAi(key);
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 60000) : null;
    fetch("/api/teacher-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({}, last.payload, { force: !!FORCE[key] })),
      signal: controller ? controller.signal : undefined
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false, message: "AI 분석 서버에 연결하지 못했어요. 생각친구 서버가 켜져 있는지 확인해 주세요." }))
      .then((res) => {
        if (timer) clearTimeout(timer);
        PENDING[key] = false;
        if (!res || !res.ok) {
          ERRORS[key] = { message: (res && res.message) || "" };
          repaintAi(key);
          return;
        }
        const doc = {
          activity: last.activity,
          sig: last.sig,
          studentSigs: last.studentSigs,
          accMap: last.accMap,
          result: res,
          // 다시 분석해도 선생님이 고친 것은 이어 간다 (그 학생 기록이 그대로일 때만 적용됨)
          edits: (RESULTS[key] && RESULTS[key].doc && RESULTS[key].doc.edits) || {},
          analyzedAt: new Date().toISOString(),
          savedAt: new Date().toISOString()
        };
        RESULTS[key] = { doc, source: "fresh", saved: "local" };
        repaintAi(key);
        saveDoc(key, doc).then((ok) => {
          if (!RESULTS[key] || RESULTS[key].doc !== doc) return;
          RESULTS[key].saved = ok ? "cloud" : "local";
          RESULTS[key].saveError = !ok && !!last.classKey && !!(window.KCultureFirebase && window.KCultureFirebase.isReady && window.KCultureFirebase.isReady());
          repaintAi(key);
        });
      });
  }

  if (typeof document !== "undefined" && !window.__tanAiBound) {
    window.__tanAiBound = true;
    document.addEventListener("toggle", (ev) => {
      const el = ev.target;
      const tag = el && el.getAttribute ? el.getAttribute("data-tan-depth-group") : "";
      if (!tag) return;
      const cut = tag.lastIndexOf("|");
      const key = tag.slice(0, cut);
      const lv = tag.slice(cut + 1);
      if (!OPEN_DEPTH[key]) OPEN_DEPTH[key] = new Set();
      if (el.open) OPEN_DEPTH[key].add(lv); else OPEN_DEPTH[key].delete(lv);
    }, true);
    document.addEventListener("click", (ev) => {
      const setBtn = ev.target && ev.target.closest ? ev.target.closest("[data-tan-depth-set]") : null;
      if (setBtn) {
        ev.preventDefault();
        const parts = setBtn.getAttribute("data-tan-depth-set").split("|");
        const level = parts.pop();
        const sid = parts.pop();
        setDepth(parts.join("|"), sid, level);
        return;
      }
      const btn = ev.target && ev.target.closest ? ev.target.closest("[data-tan-ai-run]") : null;
      if (!btn) return;
      ev.preventDefault();
      const key = btn.getAttribute("data-tan-ai-run");
      FORCE[key] = btn.getAttribute("data-force") === "1";
      runAi(key);
    });
  }

  // =====================================================================
  // 수업 전체 흐름 — 14개 활동을 수업 순서대로 모아 반 전체 변화를 본다
  // =====================================================================
  const SHORT = {
    taegeukgi: "태극기", mugunghwa: "무궁화", anthem: "애국가", money: "화폐", hangul: "한글",
    hanok: "한옥", dancheong: "단청", hanbok: "한복", bibimbap: "비빔밥", holiday: "명절",
    yut: "윷놀이", ttakji: "딱지", minyo: "민요", talchum: "탈춤"
  };
  const FLOW_DOCS = {};   // key → 학급(Firebase)에서 불러온 분석
  const FLOW_LOADED = {}; // classKey → true
  let FLOW_LAST = null;

  function depthFromDoc(doc, studentSigs) {
    const edits = doc.edits || {};
    return ((doc.result && doc.result.depth) || []).map((d) => {
      const acc = (doc.accMap || {})[d.id];
      const e = acc ? edits[acc] : null;
      const ok = e && e.level && AI_LEVELS.some((lv) => lv.id === e.level) && e.sig === (studentSigs || {})[acc];
      return { acc, level: ok ? e.level : d.level, edited: !!(ok && e.level !== d.level) };
    }).filter((d) => d.acc);
  }

  function flowRows(catalog, rows, helpers) {
    const classKey = helpers && helpers.classKey;
    return catalog.map((item) => {
      const a = analyze(item, rows, {}, helpers);
      const n = a.done.length;
      const key = keyOf(classKey, item.activity);
      const row = { item, key, n, total: a.total, short: SHORT[item.activity] || item.label };
      if (!n) return row;
      row.writersPct = Math.round((a.writers.length / n) * 100);
      row.ideaPct = a.coverage && a.coverage.ideas.length
        ? Math.round((a.coverage.ideas.reduce((sum, i) => sum + i.count / n, 0) / a.coverage.ideas.length) * 100)
        : null;
      const built = aiPayload(item, a);
      const doc = newer(newer(FLOW_DOCS[key], readLocal(key)), RESULTS[key] && RESULTS[key].doc);
      if (doc && doc.result && doc.result.ok) {
        const depth = depthFromDoc(doc, built.studentSigs);
        const counts = {};
        AI_LEVELS.forEach((lv) => { counts[lv.id] = 0; });
        depth.forEach((d) => { counts[d.level] = (counts[d.level] || 0) + 1; });
        const m = depth.length || 1;
        row.analyzed = true;
        row.depthN = depth.length;
        row.counts = counts;
        row.reasonUpPct = Math.round(((depth.length - counts["관찰"]) / m) * 100);
        row.byAcc = {};
        depth.forEach((d) => { row.byAcc[d.acc] = d; });
        row.stale = staleInfo(doc, built).stale;
        row.edited = depth.filter((d) => d.edited).length;
      }
      return row;
    });
  }

  function loadFlowDocs(classKey) {
    const FB = window.KCultureFirebase;
    if (!classKey || FLOW_LOADED[classKey] || !FB || typeof FB.listAnalyses !== "function") return;
    FLOW_LOADED[classKey] = true;
    FB.listAnalyses(classKey).then((map) => {
      let changed = false;
      Object.keys(map || {}).forEach((activity) => {
        const doc = map[activity];
        if (doc && doc.result && doc.result.ok) {
          FLOW_DOCS[keyOf(classKey, activity)] = doc;
          changed = true;
        }
      });
      if (changed) repaintFlow();
    }).catch(() => {});
  }

  function repaintFlow() {
    if (!FLOW_LAST || typeof document === "undefined") return;
    const el = document.getElementById("tanFlow");
    if (el) el.outerHTML = renderFlowHTML(FLOW_LAST.catalog, FLOW_LAST.rows, FLOW_LAST.helpers);
  }

  const LV_CLS = { "관찰": "observe", "이유": "reason", "비교": "compare", "적용": "apply" };

  function flowDepthHTML(list) {
    const analyzed = list.filter((r) => r.analyzed);
    const first = analyzed[0];
    const last = analyzed[analyzed.length - 1];
    let lead = "아직 AI로 분석한 활동이 없어요. 활동별 화면에서 「AI로 분석하기」를 누르면 여기에 모여요.";
    if (analyzed.length === 1) {
      lead = `지금은 <strong>${escapeHtml(first.short)}</strong> 활동 하나만 분석했어요. 두 개 이상 분석하면 변화를 비교해 보여 줘요.`;
    } else if (analyzed.length > 1) {
      const diff = last.reasonUpPct - first.reasonUpPct;
      lead = `이유 이상(이유·비교·적용)으로 답한 학생이 처음 분석한 <strong>${escapeHtml(first.short)}</strong> ${first.reasonUpPct}%에서
        최근 분석한 <strong>${escapeHtml(last.short)}</strong> ${last.reasonUpPct}%로 ${diff > 0 ? `<strong>${diff}%p 늘었어요.</strong>` : diff < 0 ? `${-diff}%p 줄었어요.` : "같아요."}`;
    }
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">2</span>생각의 깊이, 활동마다 어떻게 달라졌을까?</h4>
        <p class="tan-lead">${lead}</p>
        <ul class="tan-legend tan-flow-legend">
          ${AI_LEVELS.map((lv) => `<li><i class="tan-depth--${lv.cls}"></i>${escapeHtml(lv.id)}</li>`).join("")}
        </ul>
        <ul class="tan-flow-rows">
          ${list.map((r) => `
            <li class="tan-flow-row">
              <span class="tan-flow-name">${escapeHtml(r.short)}</span>
              ${r.analyzed ? `
                <span class="tan-level-bar tan-flow-bar" role="img" aria-label="${escapeHtml(r.short)}: ${AI_LEVELS.map((lv) => `${lv.id} ${r.counts[lv.id]}명`).join(", ")}">
                  ${AI_LEVELS.filter((lv) => r.counts[lv.id]).map((lv) => `<span class="tan-lv tan-depth--${lv.cls}" style="flex:${r.counts[lv.id]}" title="${escapeHtml(r.short)} · ${escapeHtml(lv.id)} ${r.counts[lv.id]}명 (${Math.round((r.counts[lv.id] / (r.depthN || 1)) * 100)}%)">${r.counts[lv.id]}</span>`).join("")}
                </span>
                <span class="tan-flow-val">이유 이상 <strong>${r.reasonUpPct}%</strong>
                  ${r.stale ? `<em class="tan-flow-flag" title="분석한 뒤 새로 쓰거나 고친 기록이 있어요">새 기록</em>` : ""}
                  ${r.edited ? `<em class="tan-flow-flag tan-flow-flag--edit" title="선생님이 고친 판단 ${r.edited}명">✏️${r.edited}</em>` : ""}
                </span>` : `
                <span class="tan-flow-empty">${r.n ? `AI 분석 전 · 기록 ${r.n}명` : "아직 기록 없음"}</span>
                <span class="tan-flow-val">${r.n ? `<button type="button" class="tan-ai-rerun" data-value-open-activity="${escapeHtml(r.item.activity)}">분석하러 가기</button>` : ""}</span>`}
            </li>
          `).join("")}
        </ul>
        <p class="tan-note">
          활동마다 질문과 난이도가 달라서, 이 흐름은 “학생들이 점점 더 깊게 생각했다”는 증거라기보다 수업을 돌아보는 참고 자료예요.
          선생님이 고친 판단이 반영된 숫자예요.
        </p>
      </section>
    `;
  }

  function flowExpressionHTML(list) {
    const withData = list.filter((r) => r.n);
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">3</span>참여와 표현의 흐름 <span class="tan-muted">(AI 없이 코드로 계산)</span></h4>
        <div class="tan-flow-table-wrap">
          <table class="tan-flow-table">
            <thead><tr><th scope="col">활동</th><th scope="col">가치수호록 완료</th><th scope="col">자기 말로 답한 학생</th><th scope="col">목표 개념 평균</th></tr></thead>
            <tbody>
              ${withData.map((r) => `
                <tr>
                  <th scope="row">${escapeHtml(r.short)}</th>
                  <td>${r.n} / ${r.total}명</td>
                  <td><span class="tan-mini"><span style="width:${r.writersPct}%"></span></span>${r.writersPct}%</td>
                  <td>${r.ideaPct == null ? "-" : `<span class="tan-mini"><span style="width:${r.ideaPct}%"></span></span>${r.ideaPct}%`}</td>
                </tr>
              `).join("") || `<tr><td colspan="4">아직 기록이 없어요.</td></tr>`}
            </tbody>
          </table>
        </div>
        <p class="tan-note">목표 개념 평균은 활동마다 4개 개념이 드러난 비율(낱말 기준)의 평균이에요.</p>
      </section>
    `;
  }

  function flowStudentsHTML(list, rows) {
    const cols = list.filter((r) => r.analyzed);
    if (!cols.length) return "";
    const body = rows.map((row) => {
      const s = row.student;
      const acc = String(s.accountId || `${s.number}`);
      const cells = cols.map((c) => c.byAcc[acc] || null);
      const judged = cells.filter(Boolean);
      const up = judged.filter((d) => d.level !== "관찰").length;
      return `
        <tr>
          <th scope="row">${studentName(s)}</th>
          ${cells.map((d, i) => d
            ? `<td><span class="tan-cell tan-depth--${LV_CLS[d.level]}${d.edited ? " is-edited" : ""}" title="${escapeHtml(cols[i].short)} · ${escapeHtml(d.level)}${d.edited ? " (선생님이 고침)" : ""}">${escapeHtml(d.level)}</span></td>`
            : `<td><span class="tan-cell tan-cell--none" title="${escapeHtml(cols[i].short)} · 분석된 기록 없음">—</span></td>`).join("")}
          <td class="tan-flow-sum">${judged.length ? `${up} / ${judged.length}` : "-"}</td>
        </tr>
      `;
    }).join("");
    return `
      <section class="tan-block">
        <h4 class="tan-title"><span class="tan-num">4</span>학생별 생각의 깊이</h4>
        <p class="tan-lead">AI로 분석한 활동만 모았어요. 오른쪽 숫자는 이유 이상으로 답한 활동 수예요. ✏️ 표시는 선생님이 고친 판단이에요.</p>
        <div class="tan-flow-table-wrap">
          <table class="tan-flow-table tan-flow-students">
            <thead><tr><th scope="col">학생</th>${cols.map((c) => `<th scope="col">${escapeHtml(c.short)}</th>`).join("")}<th scope="col">이유 이상</th></tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderFlowHTML(catalog, rows, helpers) {
    FLOW_LAST = { catalog, rows, helpers };
    const classKey = helpers && helpers.classKey;
    if (classKey && !FLOW_LOADED[classKey]) setTimeout(() => loadFlowDocs(classKey), 0);
    const list = flowRows(catalog, rows, helpers);
    const withData = list.filter((r) => r.n).length;
    const analyzed = list.filter((r) => r.analyzed).length;
    return `
      <div class="tan-wrap" id="tanFlow">
        <section class="tan-block">
          <h4 class="tan-title"><span class="tan-num">1</span>수업 전체 한눈에 보기</h4>
          <div class="tan-stats">
            ${statTile("기록이 있는 활동", `${withData}<small> / ${list.length}개</small>`, "")}
            ${statTile("AI로 분석한 활동", `${analyzed}<small> / ${withData}개</small>`, analyzed < withData ? "분석하지 않은 활동은 아래에서 바로 갈 수 있어요" : "모두 분석했어요")}
            ${statTile("등록 학생", `${rows.length}<small>명</small>`, "")}
          </div>
        </section>
        ${flowDepthHTML(list)}
        ${flowExpressionHTML(list)}
        ${flowStudentsHTML(list, rows)}
      </div>
    `;
  }

  if (typeof document !== "undefined" && !window.__tanFlowBound) {
    window.__tanFlowBound = true;
    document.addEventListener("click", (ev) => {
      const btn = ev.target && ev.target.closest ? ev.target.closest("[data-value-open-activity]") : null;
      if (!btn) return;
      ev.preventDefault();
      if (typeof window.__openTeacherActivityAnalysis === "function") {
        window.__openTeacherActivityAnalysis(btn.getAttribute("data-value-open-activity"));
      }
    });
  }

  function renderHTML(item, rows, config, helpers) {
    const a = analyze(item, rows, config, helpers);
    if (!a.done.length) {
      return `<p class="tval-empty">아직 이 활동의 가치수호록을 쓴 학생이 없어서 분석할 내용이 없어요.</p>`;
    }
    return `
      <div class="tan-wrap">
        ${overviewHTML(a)}
        ${thinkingMapHTML(a)}
        ${coverageHTML(a)}
        ${processHTML(a)}
        ${aiSectionHTML(item, a, helpers && helpers.classKey)}
      </div>
    `;
  }

  window.TeacherAnalysis = { analyze, renderHTML, renderFlowHTML, stepAnswers, ideaMatched, highlightTyped };
})();
