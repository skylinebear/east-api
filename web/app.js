/* EASTCREA v4 — Complete Interaction Layer */

/* ── Copy Button ──────────────────────────────────────────── */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-copy-target]");
  if (!btn) return;
  const ids = (btn.dataset.copyTarget || "").split(",").map(s => s.trim()).filter(Boolean);
  const text = ids.map(id => document.getElementById(id)?.textContent || "").join("");
  try {
    await navigator.clipboard.writeText(text);
    const prev = btn.textContent;
    btn.textContent = "copied";
    setTimeout(() => { btn.textContent = prev; }, 1400);
  } catch { btn.textContent = "!"; }
});

/* ── Generic Tab Switching ────────────────────────────────── */
document.querySelectorAll("[data-tabs]").forEach(tabGroup => {
  const key = tabGroup.dataset.tabs;
  const tabs = tabGroup.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll(`[data-panel="${key}"]`);
  const activate = (tab) => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    panels.forEach(p => { p.hidden = (p.dataset.tabContent !== tab.dataset.tab); });
  };
  tabs.forEach(tab => tab.addEventListener("click", () => activate(tab)));
  if (tabs[0]) activate(tabs[0]);
});

/* ── Setting Nav (button-based tab switching) ─────────────── */
document.querySelectorAll(".setting-nav").forEach(nav => {
  const items = nav.querySelectorAll("a[data-target], button[data-target]");
  const activate = (item) => {
    items.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    const target = item.dataset.target;
    if (target) {
      document.querySelectorAll("[data-setting-panel]").forEach(panel => {
        panel.hidden = (panel.dataset.settingPanel !== target);
      });
    }
  };
  items.forEach(item => item.addEventListener("click", (e) => {
    if (item.tagName === "A") e.preventDefault();
    activate(item);
  }));
  if (items[0]) items[0].classList.add("active");
});

/* ── Filter Chips ─────────────────────────────────────────── */
document.querySelectorAll("[data-filter-group]").forEach(group => {
  const chips = group.querySelectorAll("[data-filter]");
  const tbodySelector = group.dataset.filterGroup;
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      if (!tbodySelector) return;
      const tbody = document.querySelector(tbodySelector);
      if (!tbody) return;
      tbody.querySelectorAll("tr").forEach(row => {
        if (!filter || filter === "all") { row.hidden = false; return; }
        row.hidden = !(row.dataset.filter || "").split(" ").includes(filter);
      });
    });
  });
});

/* ── Search ───────────────────────────────────────────────── */
document.querySelectorAll("[data-search-target]").forEach(input => {
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    const tbody = document.querySelector(input.dataset.searchTarget);
    if (!tbody) return;
    tbody.querySelectorAll("tr").forEach(row => {
      row.hidden = q ? !row.textContent.toLowerCase().includes(q) : false;
    });
  });
});

/* ── Modal ────────────────────────────────────────────────── */
document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");
  if (openBtn) {
    document.getElementById(openBtn.dataset.openModal)?.classList.add("open");
    return;
  }
  const closeBtn = e.target.closest("[data-close-modal]");
  if (closeBtn) { closeBtn.closest(".modal-backdrop")?.classList.remove("open"); return; }
  const closeX = e.target.closest(".modal-close");
  if (closeX) { closeX.closest(".modal-backdrop")?.classList.remove("open"); return; }
  const backdrop = e.target.closest(".modal-backdrop");
  if (backdrop && e.target === backdrop) backdrop.classList.remove("open");
});

/* ── Topup Amount Select ──────────────────────────────────── */
document.querySelectorAll(".topup-option").forEach(opt => {
  opt.addEventListener("click", () => {
    document.querySelectorAll(".topup-option").forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    const ci = document.querySelector("#topup-custom");
    if (ci) ci.value = opt.dataset.amount || "";
  });
});

/* ── Chat Interface ───────────────────────────────────────── */
const chatSend = document.querySelector(".chat-send-btn");
const chatInput = document.querySelector(".chat-input-bar textarea");
const chatMessages = document.querySelector(".chat-messages");
const MOCK = [
  "收到，正在分析…\n\n根据您的输入，建议从以下维度思考：\n\n1. 梳理核心诉求，明确优先级\n2. 结合现有数据横向对比\n3. 提炼关键结论并输出可执行建议\n\n如需深入某个方向，请告诉我。",
  "好的，整理如下：\n\n• 效率与成本之间的平衡\n• 团队协作流程是否顺畅\n• 工具链选型是否符合长期规划\n\n建议优先处理最核心的阻塞点，其余逐步迭代。",
  "理解您的需求，可分三步推进：\n\n第一步：明确边界，厘清哪些必须解决；\n第二步：制定最小可行方案，快速验证；\n第三步：收集反馈，持续优化。\n\n这样可以在控制风险的前提下保持节奏。",
  "关键在于如何平衡短期效果与长期价值。\n\n短期优先交付可见成果，建立信任；\n长期关注架构可扩展性和知识积累。\n\n两者并不矛盾，关键是节奏的把握。",
];
let midx = 0;
function appendMsg(role, content) {
  if (!chatMessages) return;
  const w = document.createElement("div");
  w.className = `chat-msg ${role}`;
  const r = document.createElement("span");
  r.className = "chat-msg-role";
  r.textContent = role === "user" ? "你" : "助手";
  const b = document.createElement("div");
  b.className = "chat-bubble";
  b.textContent = content;
  w.appendChild(r); w.appendChild(b);
  chatMessages.appendChild(w);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
if (chatSend && chatInput) {
  const send = () => {
    const t = chatInput.value.trim();
    if (!t) return;
    appendMsg("user", t);
    chatInput.value = ""; chatInput.style.height = "";
    setTimeout(() => { appendMsg("assistant", MOCK[midx++ % MOCK.length]); }, 500 + Math.random() * 700);
  };
  chatSend.addEventListener("click", send);
  chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + "px";
  });
}
document.querySelectorAll(".chat-session-item").forEach(i => {
  i.addEventListener("click", () => {
    document.querySelectorAll(".chat-session-item").forEach(x => x.classList.remove("active"));
    i.classList.add("active");
  });
});
document.querySelector("#new-chat-btn")?.addEventListener("click", () => {
  if (!chatMessages) return;
  chatMessages.innerHTML = "";
  appendMsg("assistant", "你好！我是 EASTCREA 助手，有什么可以帮助您？");
  document.querySelectorAll(".chat-session-item").forEach(x => x.classList.remove("active"));
});

/* ── Playground ───────────────────────────────────────────── */
const pgSend = document.querySelector("#playground-send");
if (pgSend) {
  pgSend.addEventListener("click", () => {
    const model = document.querySelector("#pg-model")?.value || "gpt-4o";
    const input = document.querySelector("#pg-input")?.value || "";
    const temp = document.querySelector("#pg-temp")?.value || "0.7";
    const sys = document.querySelector("#pg-system")?.value || "";
    const respEl = document.querySelector("#playground-response");
    const jsonEl = document.querySelector("#playground-json");
    if (!respEl) return;
    const req = { model, temperature: parseFloat(temp), messages: [] };
    if (sys) req.messages.push({ role: "system", content: sys });
    if (input) req.messages.push({ role: "user", content: input });
    if (jsonEl) jsonEl.textContent = JSON.stringify(req, null, 2);
    respEl.textContent = "正在发送请求…";
    const rt = document.querySelector('[data-tab="response"]');
    if (rt) rt.click();
    const RS = [
      "根据您的请求，分析结果：\n\n团队本周最常用的模型：\n1. GPT-4o（42%）\n2. Claude 3.7 Sonnet（31%）\n3. Gemini 2.5 Pro（17%）\n4. Qwen Max（10%）\n\n建议重点关注 GPT-4o 与 Claude 的成本优化空间。",
      "分析完成，关键发现：\n\n过去一周调用模式显示工作日高峰特征，周三周四请求量最大。主要集中在 10:00–12:00 和 15:00–18:00。\n\n建议设置请求配额和分时策略以优化成本。",
    ];
    setTimeout(() => {
      respEl.textContent = `// Response from ${model}\n// Temperature: ${temp}\n// Latency: ${(0.6 + Math.random() * 1.2).toFixed(2)}s\n\n` + RS[Math.floor(Math.random() * RS.length)];
    }, 1000 + Math.random() * 800);
  });
  const ts = document.querySelector("#pg-temp"), td = document.querySelector("#pg-temp-display");
  if (ts && td) ts.addEventListener("input", () => { td.textContent = ts.value; });
}

/* ── Range Slider Labels ──────────────────────────────────── */
document.querySelectorAll("input[type=range][data-display]").forEach(sl => {
  const dp = document.querySelector(`#${sl.dataset.display}`);
  if (dp) { dp.textContent = sl.value; sl.addEventListener("input", () => { dp.textContent = sl.value; }); }
});
