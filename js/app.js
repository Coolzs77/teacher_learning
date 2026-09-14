/**
 * 初中语文教师资格证面试智能备考 App · 核心交互引擎 (app.js)
 * 纯前端驱动、即开即用、LocalStorage本地持久化、Web Audio考试音效
 */

(function () {
  "use strict";

  // 全局应用状态
  const APP_STATE = {
    currentTab: "home",
    selectedLesson: null,
    selectedBookId: "all",
    selectedGenre: "all",
    searchKeyword: "",
    priorityFilter: "all",
    favoritesOnly: false,

    // 计时器状态
    prepTimer: {
      totalSeconds: 10 * 60,
      remainingSeconds: 10 * 60,
      intervalId: null,
      isRunning: false
    },
    teachTimer: {
      totalSeconds: 10 * 60,
      remainingSeconds: 10 * 60,
      intervalId: null,
      isRunning: false
    },

    // AI陪练状态
    sparringDialogues: [],
    
    // 本地持久化数据
    userData: {
      favorites: [],
      notes: {},
      myLessonPlans: {},
      examCount: 0,
      sparringCount: 0,
      structuredPracticed: [],
      defensePracticed: [],
      dailyTasks: {},
      lastActiveDate: ""
    }
  };

  // 考试预定日期：2026年12月5日 (初中教资面试常规时间)
  const EXAM_TARGET_DATE = new Date(2026, 11, 5);

  // 简易 Web Audio 提示音（无需外部音频文件）
  function playChime(freq = 587.33, type = "sine", duration = 0.3) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context not supported or allowed:", e);
    }
  }

  // 本地存储存取
  const STORAGE_KEY = "CHINESE_TEACHER_APP_DATA_V1";
  function loadUserData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        APP_STATE.userData = Object.assign(APP_STATE.userData, JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load user data from localStorage:", e);
    }
  }

  function saveUserData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE.userData));
      updateGlobalBadges();
    } catch (e) {
      console.error("Failed to save user data to localStorage:", e);
    }
  }

  // 格式化时间 mm:ss
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // 计算距离考试倒计时天数
  function getDaysToExam() {
    const now = new Date();
    const diffTime = EXAM_TARGET_DATE - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // 页面加载完成后初始化
  document.addEventListener("DOMContentLoaded", () => {
    loadUserData();
    initUI();
    renderDashboard();
    renderTextbooks();
    renderTemplates();
    renderStructured();
    renderDefense();
    renderStudyPlan();
    renderSavedPlans();
    bindEvents();
  });

  function initUI() {
    // 设置倒计时徽章
    const days = getDaysToExam();
    const countdownEl = document.getElementById("exam-countdown-badge");
    if (countdownEl) {
      countdownEl.innerHTML = `<span>⏳ 距12月面试预计还剩</span><strong>${days}</strong><span>天</span>`;
    }
    updateGlobalBadges();
  }

  function updateGlobalBadges() {
    const favCount = APP_STATE.userData.favorites.length;
    const examCount = APP_STATE.userData.examCount || 0;
    const plansCount = Object.keys(APP_STATE.userData.myLessonPlans).length;

    const favBadge = document.getElementById("header-fav-badge");
    if (favBadge) favBadge.textContent = `${favCount} 篇收藏`;

    const examBadge = document.getElementById("header-exam-badge");
    if (examBadge) examBadge.textContent = `${examCount} 次模拟试讲`;
  }

  // 切换主导航标签
  window.switchTab = function (tabName) {
    APP_STATE.currentTab = tabName;

    // 更新导航按钮激活样式
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // 更新视图
    document.querySelectorAll(".tab-view").forEach((view) => {
      view.classList.toggle("active", view.id === `tab-view-${tabName}`);
    });

    // 针对特定标签的刷新
    if (tabName === "home") renderDashboard();
    if (tabName === "saved") renderSavedPlans();
    if (tabName === "study-plan") renderStudyPlan();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1. 渲染首页仪表盘
  function renderDashboard() {
    const totalLessons = window.TEXTBOOK_DB ? window.TEXTBOOK_DB.totalLessons : 146;
    const preppedCount = Object.keys(APP_STATE.userData.myLessonPlans).length;
    const favCount = APP_STATE.userData.favorites.length;
    const examCount = APP_STATE.userData.examCount || 0;
    const sparringCount = APP_STATE.userData.sparringCount || 0;

    const totalEl = document.getElementById("dash-total-lessons");
    if (totalEl) totalEl.textContent = totalLessons;

    const preppedEl = document.getElementById("dash-prepped-lessons");
    if (preppedEl) preppedEl.textContent = preppedCount;

    const examEl = document.getElementById("dash-exam-count");
    if (examEl) examEl.textContent = examCount;

    const sparringEl = document.getElementById("dash-sparring-count");
    if (sparringEl) sparringEl.textContent = sparringCount;

    // 推荐3篇高频五星课文
    const recContainer = document.getElementById("dash-recommended-lessons");
    if (recContainer && window.TEXTBOOK_DB) {
      const highFavs = window.TEXTBOOK_DB.lessons.filter(l => l.priority === "★★★★★").slice(0, 6);
      recContainer.innerHTML = highFavs.map(l => createLessonCardHtml(l)).join("");
    }
  }

  // 2. 渲染教材课文库
  function renderTextbooks() {
    const grid = document.getElementById("textbooks-lessons-grid");
    if (!grid || !window.TEXTBOOK_DB) return;

    let filtered = window.TEXTBOOK_DB.lessons.filter(l => {
      // 册次筛选
      if (APP_STATE.selectedBookId !== "all" && l.grade !== APP_STATE.selectedBookId) return false;
      // 文体筛选
      if (APP_STATE.selectedGenre !== "all" && !l.genre.includes(APP_STATE.selectedGenre)) return false;
      // 优先级筛选
      if (APP_STATE.priorityFilter !== "all" && l.priority !== APP_STATE.priorityFilter) return false;
      // 收藏筛选
      if (APP_STATE.favoritesOnly && !APP_STATE.userData.favorites.includes(l.fullId)) return false;
      // 搜索关键词匹配
      if (APP_STATE.searchKeyword) {
        const kw = APP_STATE.searchKeyword.toLowerCase();
        const inTitle = l.title.toLowerCase().includes(kw);
        const inAuthor = l.author.toLowerCase().includes(kw);
        const inTheme = (l.unitTheme || "").toLowerCase().includes(kw);
        const inFocus = (l.sampleFocus || "").toLowerCase().includes(kw);
        if (!inTitle && !inAuthor && !inTheme && !inFocus) return false;
      }
      return true;
    });

    const countEl = document.getElementById("textbook-filter-count");
    if (countEl) countEl.textContent = `共检索到 ${filtered.length} 篇课文`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size: 32px; margin-bottom: 12px;">📖</div>
          <p>暂无符合筛选条件的课文，请尝试清除搜索或调整文体/册次筛选。</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(l => createLessonCardHtml(l)).join("");
  }

  // 生成单张课文卡片 HTML
  function createLessonCardHtml(lesson) {
    const isFav = APP_STATE.userData.favorites.includes(lesson.fullId);
    const hasMyPlan = !!APP_STATE.userData.myLessonPlans[lesson.fullId];

    return `
      <div class="lesson-card" onclick="openLessonDetail('${lesson.fullId}')">
        <div class="lesson-card-header">
          <div class="lesson-title-box">
            <h3>${lesson.title}</h3>
            <div class="lesson-author-tag">${lesson.gradeName} · 第${lesson.unitNumber}单元 · ${lesson.author}</div>
          </div>
          <span class="lesson-genre-pill">${lesson.genre}</span>
        </div>
        <div class="lesson-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size: 11px; color: var(--color-gold); font-weight:bold;">${lesson.priority} 考频</span>
            ${hasMyPlan ? '<span style="font-size:11px; color:var(--color-green-primary); font-weight:600;">✓ 已备课</span>' : ''}
          </div>
          <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 13px;">
            ${lesson.mainContent}
          </p>
          <div class="lesson-focus-preview">
            <strong>10分钟试讲抓手：</strong>${lesson.sampleFocus || lesson.interviewKeyPoint}
          </div>
        </div>
        <div class="lesson-card-footer" onclick="event.stopPropagation()">
          <a class="pdf-link-btn" href="${encodeURI(lesson.pdfFileName)}" target="_blank" title="在本地浏览器中直接打开统编教材PDF查阅">
            📄 原书第${lesson.page}页
          </a>
          <div style="display:flex; gap:8px;">
            <button class="btn-academic" style="padding: 2px 8px; font-size:12px;" onclick="toggleFavorite('${lesson.fullId}'); event.stopPropagation();">
              ${isFav ? "★ 已收藏" : "☆ 收藏"}
            </button>
            <button class="btn-academic primary" style="padding: 2px 10px; font-size:12px;" onclick="startMockExamWithLesson('${lesson.fullId}'); event.stopPropagation();">
              🎯 去试讲
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 收藏切换
  window.toggleFavorite = function (lessonId) {
    const idx = APP_STATE.userData.favorites.indexOf(lessonId);
    if (idx >= 0) {
      APP_STATE.userData.favorites.splice(idx, 1);
    } else {
      APP_STATE.userData.favorites.push(lessonId);
      playChime(659.25, "sine", 0.2);
    }
    saveUserData();
    renderTextbooks();
    renderDashboard();
    renderSavedPlans();
  };

  // 打开课文详情弹窗 (Drawer)
  window.openLessonDetail = function (lessonId) {
    if (!window.TEXTBOOK_DB) return;
    const lesson = window.TEXTBOOK_DB.lessons.find(l => l.fullId === lessonId);
    if (!lesson) return;

    APP_STATE.selectedLesson = lesson;
    const overlay = document.getElementById("lesson-drawer-overlay");
    const container = document.getElementById("lesson-drawer-container");
    if (!overlay || !container) return;

    const td = lesson.teachingDesign;
    const isFav = APP_STATE.userData.favorites.includes(lesson.fullId);

    container.innerHTML = `
      <div class="drawer-header">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <h2 style="font-family: var(--font-serif); font-size: 22px; color: var(--text-primary);">${lesson.title}</h2>
            <span class="lesson-genre-pill">${lesson.genre}</span>
            <span style="font-size:12px; color:var(--color-gold); font-weight:bold;">${lesson.priority}</span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
            ${lesson.gradeName} · 第${lesson.unitNumber}单元 · 作/选者：${lesson.author} · 
            <a href="${encodeURI(lesson.pdfFileName)}" target="_blank" style="color:var(--color-green-primary); font-weight:500;">
              打开教材原版PDF（第${lesson.page}页）↗
            </a>
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button class="btn-academic" onclick="toggleFavorite('${lesson.fullId}'); this.textContent = APP_STATE.userData.favorites.includes('${lesson.fullId}') ? '★ 已收藏' : '☆ 收藏';">
            ${isFav ? "★ 已收藏" : "☆ 收藏"}
          </button>
          <button class="btn-academic primary" onclick="startMockExamWithLesson('${lesson.fullId}')">
            进入10分钟考场训练
          </button>
          <button class="drawer-close-btn" onclick="closeLessonDrawer()">✕</button>
        </div>
      </div>

      <div class="drawer-body">
        <!-- 子选项卡切换 -->
        <div class="detail-subtabs">
          <button class="detail-subtab-btn active" onclick="switchDetailSubtab('plan')">10分钟试讲教学设计</button>
          <button class="detail-subtab-btn" onclick="switchDetailSubtab('analysis')">AI课文深度剖析</button>
          <button class="detail-subtab-btn" onclick="switchDetailSubtab('blackboard')">规范板书设计</button>
          <button class="detail-subtab-btn" onclick="switchDetailSubtab('defense')">考官答辩预备</button>
        </div>

        <!-- 选项卡1：10分钟试讲教案 -->
        <div id="subtab-view-plan" class="subtab-content active">
          <!-- 教学目标卡 -->
          <div class="academic-card" style="margin-bottom:16px;">
            <h4 class="card-title">（一）初中语文三维教学目标</h4>
            <div style="font-size:14px; line-height:1.8;">
              <p><strong>1. 知识与能力：</strong>${td.targets.knowledge}</p>
              <p><strong>2. 过程与方法：</strong>${td.targets.process}</p>
              <p><strong>3. 情感态度与价值观：</strong>${td.targets.emotion}</p>
            </div>
            <div style="margin-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:13px; background:var(--bg-secondary); padding:10px; border-radius:var(--radius-sm);">
              <div><strong>【教学重点】：</strong>${td.keyPoint}</div>
              <div><strong>【教学难点】：</strong>${td.difficultPoint}</div>
            </div>
          </div>

          <!-- 10分钟试讲分步流程 -->
          <div class="academic-card">
            <h4 class="card-title">（二）10分钟试讲教学过程（严格考场倒计时分配）</h4>
            <div class="teaching-timeline">
              <!-- 0-1m -->
              <div class="timeline-step-box">
                <span class="step-time-badge">${td.flow10min.p1_leadIn.time} · ${td.flow10min.p1_leadIn.name}</span>
                <div class="step-script-quote">${td.flow10min.p1_leadIn.teacherScript}</div>
                <div style="font-size:12px; color:var(--text-secondary);">
                  <strong>学生活动：</strong>${td.flow10min.p1_leadIn.studentAction} | <strong>设计意图：</strong>${td.flow10min.p1_leadIn.purpose}
                </div>
              </div>

              <!-- 1-3m -->
              <div class="timeline-step-box">
                <span class="step-time-badge">${td.flow10min.p2_initialRead.time} · ${td.flow10min.p2_initialRead.name}</span>
                <div class="step-script-quote">${td.flow10min.p2_initialRead.teacherScript}</div>
                <div style="font-size:12px; color:var(--text-secondary);">
                  <strong>学生活动：</strong>${td.flow10min.p2_initialRead.studentAction} | <strong>设计意图：</strong>${td.flow10min.p2_initialRead.purpose}
                </div>
              </div>

              <!-- 3-8m -->
              <div class="timeline-step-box" style="border-left-color: var(--color-gold); background: #FFFDF9;">
                <span class="step-time-badge" style="background:var(--color-gold-light); color:#8C5611;">${td.flow10min.p3_deepDive.time} · ${td.flow10min.p3_deepDive.name}（试讲核心拿分点）</span>
                <div class="step-script-quote" style="border-left-color: var(--color-gold); font-size:14.5px;">${td.flow10min.p3_deepDive.teacherScript}</div>
                <div style="font-size:12px; color:var(--text-secondary);">
                  <strong>学生活动：</strong>${td.flow10min.p3_deepDive.studentAction} | <strong>设计意图：</strong>${td.flow10min.p3_deepDive.purpose}
                </div>
              </div>

              <!-- 8-9m -->
              <div class="timeline-step-box">
                <span class="step-time-badge">${td.flow10min.p4_summary.time} · ${td.flow10min.p4_summary.name}</span>
                <div class="step-script-quote">${td.flow10min.p4_summary.teacherScript}</div>
                <div style="font-size:12px; color:var(--text-secondary);">
                  <strong>学生活动：</strong>${td.flow10min.p4_summary.studentAction} | <strong>设计意图：</strong>${td.flow10min.p4_summary.purpose}
                </div>
              </div>

              <!-- 9-10m -->
              <div class="timeline-step-box">
                <span class="step-time-badge">${td.flow10min.p5_homework.time} · ${td.flow10min.p5_homework.name}</span>
                <div class="step-script-quote">${td.flow10min.p5_homework.teacherScript}</div>
                <div style="font-size:12px; color:var(--text-secondary);">
                  <strong>学生活动：</strong>${td.flow10min.p5_homework.studentAction} | <strong>设计意图：</strong>${td.flow10min.p5_homework.purpose}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 选项卡2：课文深度剖析 -->
        <div id="subtab-view-analysis" class="subtab-content" style="display:none;">
          <div class="academic-card">
            <h4 class="card-title">AI名师深度文本解读</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:14px; line-height:1.7;">
              <div>
                <p><strong>【单元核心语文要素】：</strong>${lesson.unitCoreLiteracy || "暂无"}</p>
                <p style="margin-top:8px;"><strong>【主要内容】：</strong>${lesson.mainContent}</p>
                <p style="margin-top:8px;"><strong>【写作背景】：</strong>${lesson.background}</p>
                <p style="margin-top:8px;"><strong>【作者情感】：</strong>${lesson.emotion}</p>
              </div>
              <div>
                <p><strong>【文本结构层次】：</strong>${lesson.structure}</p>
                <p style="margin-top:8px;"><strong>【语言风格特色】：</strong>${lesson.languageStyle}</p>
                <p style="margin-top:8px;"><strong>【核心写作手法】：</strong>${lesson.technique}</p>
                <p style="margin-top:8px;"><strong>【中考及常考知识点】：</strong>${lesson.zhongkaoPoint}</p>
              </div>
            </div>
            <div style="margin-top:16px; background:var(--color-green-light); border:1px solid var(--color-green-border); padding:12px; border-radius:var(--radius-sm); font-size:13px; color:var(--color-green-primary);">
              <strong>🎯 教资面试10分钟试讲重点建议：</strong>${lesson.interviewKeyPoint}
            </div>
          </div>
        </div>

        <!-- 选项卡3：规范板书设计 -->
        <div id="subtab-view-blackboard" class="subtab-content" style="display:none;">
          <div class="academic-card">
            <h4 class="card-title">考场规范黑板书写排版示意（粉笔画风）</h4>
            <div class="virtual-blackboard">
              <div class="blackboard-title">${td.blackboardDesign.title}</div>
              <div class="blackboard-cols">
                <div class="blackboard-col">${td.blackboardDesign.left}</div>
                <div class="blackboard-col" style="border-left:1px dashed rgba(255,255,255,0.2); border-right:1px dashed rgba(255,255,255,0.2); padding:0 12px;">
                  ${td.blackboardDesign.center}
                </div>
                <div class="blackboard-col">${td.blackboardDesign.right}</div>
              </div>
            </div>
            <p style="font-size:12px; color:var(--text-muted); margin-top:8px;">
              💡 <strong>特级教师板书建议：</strong>试讲开始导入引出课题后，立刻在正上方写下课题和作者；进入初读阶段写左侧脉络提纲；精读阶段边互动边写中间核心字词与手法；总结时补齐右侧主旨升华。切忌讲完全部后集中抄写板书！
            </p>
          </div>
        </div>

        <!-- 选项卡4：考官答辩预备 -->
        <div id="subtab-view-defense" class="subtab-content" style="display:none;">
          <div class="academic-card">
            <h4 class="card-title">针对《${lesson.title}》的考官高频追问与标准应答</h4>
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${td.defensePrep.map((dp, i) => `
                <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
                  <h5 style="font-size:15px; color:var(--text-primary); margin-bottom:8px; font-weight:bold;">
                    问题${i + 1}：${dp.question}
                  </h5>
                  <div style="font-size:14px; line-height:1.7; color:var(--text-secondary); background:#FFFFFF; padding:12px; border-radius:var(--radius-sm); border-left:3px solid var(--color-green-primary);">
                    <strong>参考作答：</strong>${dp.answer}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add("active");
  };

  window.closeLessonDrawer = function () {
    const overlay = document.getElementById("lesson-drawer-overlay");
    if (overlay) overlay.classList.remove("active");
  };

  window.switchDetailSubtab = function (subtab) {
    document.querySelectorAll(".detail-subtab-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", btn.getAttribute("onclick").includes(subtab));
    });
    document.querySelectorAll(".subtab-content").forEach((el) => {
      el.style.display = el.id === `subtab-view-${subtab}` ? "block" : "none";
    });
  };

  // 3. 10分钟考场模拟器逻辑 (备课倒计时 + 试讲倒计时 + 空白教案纸)
  window.startMockExamWithLesson = function (lessonId) {
    if (!window.TEXTBOOK_DB) return;
    const lesson = window.TEXTBOOK_DB.lessons.find(l => l.fullId === lessonId);
    if (!lesson) return;

    APP_STATE.selectedLesson = lesson;
    closeLessonDrawer();
    switchTab("mock-exam");

    // 填充教案纸抬头
    document.getElementById("exam-sheet-lesson-title").textContent = lesson.title;
    document.getElementById("exam-sheet-author").textContent = lesson.author;
    document.getElementById("exam-sheet-grade").textContent = lesson.gradeName;

    // 检查是否有历史保存的教案草稿
    const savedPlan = APP_STATE.userData.myLessonPlans[lesson.fullId];
    if (savedPlan) {
      document.getElementById("sheet-input-targets").value = savedPlan.targets || "";
      document.getElementById("sheet-input-points").value = savedPlan.points || "";
      document.getElementById("sheet-input-flow").value = savedPlan.flow || "";
      document.getElementById("sheet-input-blackboard").value = savedPlan.blackboard || "";
    } else {
      // 默认提供结构化空白模板
      document.getElementById("sheet-input-targets").value = "1. 知识与能力目标：\n2. 过程与方法目标：\n3. 情感态度与价值观目标：";
      document.getElementById("sheet-input-points").value = "【教学重点】：\n【教学难点】：";
      document.getElementById("sheet-input-flow").value = "一、创设情境，激趣导入（0-1分钟）：\n\n二、初读课文，整体感知（1-3分钟）：\n\n三、精读品析，重点探究（3-8分钟）：\n\n四、拓展延伸，课堂小结（8-9分钟）：\n\n五、分层作业，下课致谢（9-10分钟）：";
      document.getElementById("sheet-input-blackboard").value = "【课题】：\n【主板书】：\n【副板书】：";
    }

    // 重置备课计时器为10:00
    resetPrepTimer();
    // 重置试讲计时器为10:00
    resetTeachTimer();
  };

  // 备课计时器
  function updatePrepTimerDisplay() {
    const el = document.getElementById("prep-timer-display");
    if (el) {
      el.textContent = formatTime(APP_STATE.prepTimer.remainingSeconds);
      if (APP_STATE.prepTimer.remainingSeconds <= 60) {
        el.className = "timer-dial danger";
      } else if (APP_STATE.prepTimer.remainingSeconds <= 180) {
        el.className = "timer-dial warning";
      } else {
        el.className = "timer-dial";
      }
    }
  }

  window.togglePrepTimer = function () {
    const btn = document.getElementById("btn-prep-toggle");
    if (APP_STATE.prepTimer.isRunning) {
      clearInterval(APP_STATE.prepTimer.intervalId);
      APP_STATE.prepTimer.isRunning = false;
      if (btn) btn.textContent = "继续备课";
    } else {
      APP_STATE.prepTimer.isRunning = true;
      if (btn) btn.textContent = "暂停计时";
      APP_STATE.prepTimer.intervalId = setInterval(() => {
        if (APP_STATE.prepTimer.remainingSeconds > 0) {
          APP_STATE.prepTimer.remainingSeconds--;
          updatePrepTimerDisplay();
          // 剩余1分钟提示
          if (APP_STATE.prepTimer.remainingSeconds === 60) {
            playChime(440, "sine", 0.5);
            alert("⏰ 备课时间还剩最后 1 分钟！请抓紧整理板书设计与教学重点。");
          }
        } else {
          clearInterval(APP_STATE.prepTimer.intervalId);
          APP_STATE.prepTimer.isRunning = false;
          playChime(880, "triangle", 1.0);
          alert("🔔 10分钟备课时间已到！请整理教案纸，点击进入【10分钟试讲倒计时】开始讲课。");
          if (btn) btn.textContent = "开始备课";
        }
      }, 1000);
    }
  };

  window.resetPrepTimer = function () {
    clearInterval(APP_STATE.prepTimer.intervalId);
    APP_STATE.prepTimer.isRunning = false;
    APP_STATE.prepTimer.remainingSeconds = 10 * 60;
    updatePrepTimerDisplay();
    const btn = document.getElementById("btn-prep-toggle");
    if (btn) btn.textContent = "开始10分钟备课";
  };

  // 试讲计时器
  function updateTeachTimerDisplay() {
    const el = document.getElementById("teach-timer-display");
    const phaseEl = document.getElementById("teach-current-phase-hint");
    const sec = APP_STATE.teachTimer.remainingSeconds;
    const elapsed = 10 * 60 - sec; // 已耗时

    if (el) {
      el.textContent = formatTime(sec);
      if (sec <= 60) {
        el.className = "timer-dial danger";
      } else if (sec <= 180) {
        el.className = "timer-dial warning";
      } else {
        el.className = "timer-dial";
      }
    }

    if (phaseEl) {
      if (elapsed <= 60) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【导入新课】（0-1分钟）<br><small style="color:var(--text-muted)">抓生活体验或诗词名句，引出课题，完成板书第一笔</small>`;
      } else if (elapsed <= 180) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【初读课文·整体感知】（1-3分钟）<br><small style="color:var(--text-muted)">扫清字词、读出节奏、理清文章整体脉络图景</small>`;
      } else if (elapsed <= 480) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【精读品析·重点探究】（3-8分钟，核心黄金段！）<br><small style="color:var(--color-green-primary); font-weight:bold;">主问题导学、抓关键词句圈点批注、小组合作与启发式追问</small>`;
      } else if (elapsed <= 540) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【拓展延伸·课堂小结】（8-9分钟）<br><small style="color:var(--text-muted)">由文及人、升华主旨，结合黑板板书回顾全课</small>`;
      } else {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【布置作业·下课致谢】（9-10分钟）<br><small style="color:var(--text-muted)">布置分层特色作业，面向评委席鞠躬致谢，规范结课</small>`;
      }
    }
  }

  window.toggleTeachTimer = function () {
    const btn = document.getElementById("btn-teach-toggle");
    if (APP_STATE.teachTimer.isRunning) {
      clearInterval(APP_STATE.teachTimer.intervalId);
      APP_STATE.teachTimer.isRunning = false;
      if (btn) btn.textContent = "继续试讲";
    } else {
      APP_STATE.teachTimer.isRunning = true;
      if (btn) btn.textContent = "暂停试讲";
      APP_STATE.teachTimer.intervalId = setInterval(() => {
        if (APP_STATE.teachTimer.remainingSeconds > 0) {
          APP_STATE.teachTimer.remainingSeconds--;
          updateTeachTimerDisplay();

          // 关键节点提示音
          if (APP_STATE.teachTimer.remainingSeconds === 5 * 60) {
            playChime(523.25, "sine", 0.4); // 时间过半
          } else if (APP_STATE.teachTimer.remainingSeconds === 60) {
            playChime(659.25, "sine", 0.6); // 还剩1分钟，提示小结作业
          }
        } else {
          clearInterval(APP_STATE.teachTimer.intervalId);
          APP_STATE.teachTimer.isRunning = false;
          playChime(987.77, "triangle", 1.2);
          alert("🏁 10分钟试讲时间到！请向考官鞠躬致谢并汇报：‘各位评委老师，我的试讲完毕，谢谢老师！’");
          if (btn) btn.textContent = "开始试讲";
          // 统计试讲次数
          APP_STATE.userData.examCount = (APP_STATE.userData.examCount || 0) + 1;
          saveUserData();
          updateGlobalBadges();
        }
      }, 1000);
    }
  };

  window.resetTeachTimer = function () {
    clearInterval(APP_STATE.teachTimer.intervalId);
    APP_STATE.teachTimer.isRunning = false;
    APP_STATE.teachTimer.remainingSeconds = 10 * 60;
    updateTeachTimerDisplay();
    const btn = document.getElementById("btn-teach-toggle");
    if (btn) btn.textContent = "开始10分钟试讲";
  };

  // 保存当前教案纸
  window.saveCurrentLessonPlan = function () {
    if (!APP_STATE.selectedLesson) {
      alert("请先选择一篇课文进行备课！");
      return;
    }
    const lid = APP_STATE.selectedLesson.fullId;
    const plan = {
      lessonId: lid,
      lessonTitle: APP_STATE.selectedLesson.title,
      gradeName: APP_STATE.selectedLesson.gradeName,
      targets: document.getElementById("sheet-input-targets").value,
      points: document.getElementById("sheet-input-points").value,
      flow: document.getElementById("sheet-input-flow").value,
      blackboard: document.getElementById("sheet-input-blackboard").value,
      updatedAt: new Date().toLocaleDateString()
    };
    APP_STATE.userData.myLessonPlans[lid] = plan;
    saveUserData();
    playChime(659.25, "sine", 0.3);
    alert(`🎉 恭喜！《${APP_STATE.selectedLesson.title}》教案已成功保存在本地浏览器 LocalStorage！`);
  };

  // 一键对比名师标准教案
  window.compareStandardPlan = function () {
    if (!APP_STATE.selectedLesson) {
      alert("请先选择一篇课文！");
      return;
    }
    openLessonDetail(APP_STATE.selectedLesson.fullId);
  };

  // 4. AI 教师陪练与课堂六维评价互动系统
  window.sendTeacherLine = function (customText) {
    const input = document.getElementById("sparring-user-input");
    const text = customText || (input ? input.value.trim() : "");
    if (!text) return;

    if (input) input.value = "";

    // 添加教师话语
    appendDialogue("teacher", "执教教师（我）", text);

    // AI 生成学生多样化回答（1秒后模拟作答）
    setTimeout(() => {
      generateStudentResponse(text);
    }, 900);
  };

  function appendDialogue(sender, name, content) {
    const stream = document.getElementById("sparring-dialogue-stream");
    if (!stream) return;

    const bubble = document.createElement("div");
    bubble.className = `bubble ${sender}`;
    bubble.innerHTML = `
      <div class="bubble-sender">${name}</div>
      <div class="bubble-text">${content}</div>
    `;
    stream.appendChild(bubble);
    stream.scrollTop = stream.scrollHeight;

    APP_STATE.sparringDialogues.push({ sender, name, content });
  }

  // 智能生成学生典型回答
  function generateStudentResponse(teacherPrompt) {
    const lessonTitle = APP_STATE.selectedLesson ? APP_STATE.selectedLesson.title : "这篇课文";
    let studentResponses = [];

    // 针对朗读指令
    if (teacherPrompt.includes("读") || teacherPrompt.includes("朗读") || teacherPrompt.includes("齐读")) {
      studentResponses = [
        {
          name: "全班同学",
          content: "（全班整齐放声朗读，声音洪亮，在读到关键动词时稍作了停顿，语调富有起伏。）"
        },
        {
          name: "学生小林（课代表）",
          content: "老师，读完这一段，我发现‘……’这个词应该读重音，因为这里表现了作者最强烈的激动心情！"
        }
      ];
    }
    // 针对词句修辞品析指令
    else if (teacherPrompt.includes("词") || teacherPrompt.includes("修辞") || teacherPrompt.includes("比喻") || teacherPrompt.includes("拟人") || teacherPrompt.includes("句子")) {
      studentResponses = [
        {
          name: "学生小赵（优等生）",
          content: `老师，我圈画了文中的这一句！这里运用了拟人/比喻的修辞手法，把景物赋予了人的情态，形象生动地写出了在《${lessonTitle}》中那种生命蓬勃生长的热闹景象！`
        },
        {
          name: "学生晓玲（发现细节）",
          content: "老师，我补充小赵的回答！我还注意到作者用了一个非常精准的动词，如果换成普通的词，就没有那种扑面而来的动态感和画面感了！"
        }
      ];
    }
    // 针对整体感知/主旨探究
    else if (teacherPrompt.includes("情感") || teacherPrompt.includes("主旨") || teacherPrompt.includes("思想") || teacherPrompt.includes("体会")) {
      studentResponses = [
        {
          name: "学生小陈（感性共鸣）",
          content: "老师，我觉得作者在这里并不是单纯在描写眼前的事物，而是借物抒情，借此寄托了自己对生活的热爱与对未来的坚定希望！"
        },
        {
          name: "学生小王（稍有偏差但有思考）",
          content: "老师，我感觉作者当时心情很矛盾，既有一点点伤感，又有一股不服输的倔强劲儿！"
        }
      ];
    }
    // 通用启发互动
    else {
      studentResponses = [
        {
          name: "学生小明（积极举手）",
          content: "老师，结合上下文我发现，这里的转折非常关键，它承接了上文的情节，又为下文的感情爆发做好了充足的铺垫！"
        },
        {
          name: "学生小丽（同伴互评）",
          content: "我非常赞成小明的看法，而且我觉得作者在这个地方用的句式很特别，读起来朗朗上口！"
        }
      ];
    }

    // 逐一展示回答
    studentResponses.forEach((res, i) => {
      setTimeout(() => {
        appendDialogue("student", res.name, res.content);
        playChime(523.25, "sine", 0.15);
      }, i * 600);
    });

    // 触发评价引擎
    setTimeout(() => {
      evaluateTeacherPerformance(teacherPrompt);
    }, studentResponses.length * 600 + 400);
  }

  // 六维AI诊断打分
  function evaluateTeacherPerformance(prompt) {
    const reportBox = document.getElementById("sparring-eval-report");
    if (!reportBox) return;

    // 简单规则打分模型
    let sFlow = 18;
    let sSubject = 17;
    let sScaffold = 16;
    let sScript = 17;
    let sTime = 18;
    let sRubric = 17;

    const feedbackList = [];

    // 评价规则1：是否具备启发式引导词
    if (prompt.includes("请思考") || prompt.includes("结合") || prompt.includes("为什么") || prompt.includes("怎么理解")) {
      sSubject += 2;
      sScaffold += 2;
      feedbackList.push("✓ 问题设计具有良好思维启发性，有效调动了学生的探究欲。");
    } else {
      feedbackList.push("⚠️ 提问偏指令性，建议增加‘请结合上下文’、‘谈谈你的独特感受’等启发式词汇。");
    }

    // 评价规则2：是否有去背稿感、口语化亲切度
    if (prompt.includes("同学们") || prompt.includes("大家看") || prompt.includes("非常好") || prompt.includes("听老师读")) {
      sScript += 2;
      feedbackList.push("✓ 教学语言亲切自然，教态亲和力强，富有‘特级名师’现场感。");
    } else {
      sScript -= 2;
      feedbackList.push("⚠️ 略带书面背稿感，建议多使用教师亲和口吻拉近与学生的心理距离。");
    }

    // 评价规则3：是否有追问与评价引导
    if (prompt.includes("追问") || prompt.includes("进一步") || prompt.includes("还有没有") || prompt.includes("如果换成")) {
      sScaffold += 2;
      feedbackList.push("✓ 追问意识极佳！能够‘借题发挥、顺学而导’，彻底告别了‘很好请坐’的单一评价。");
    }

    const total = Math.min(100, sFlow + sSubject + sScaffold + sScript + sTime + sRubric);

    reportBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
        <h4 style="font-family:var(--font-serif); font-size:16px; color:var(--text-primary);">本轮互动诊断评分</h4>
        <span style="font-family:var(--font-serif); font-size:24px; font-weight:bold; color:var(--color-green-primary);">${total} <small style="font-size:13px; color:var(--text-muted);">/ 100分</small></span>
      </div>

      <div class="score-dimension-row">
        <span style="font-size:13px; width:130px;">1. 教学流程规范性</span>
        <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(sFlow/20)*100}%;"></div></div>
        <span style="font-size:12px; font-weight:bold;">${sFlow}/20</span>
      </div>
      <div class="score-dimension-row">
        <span style="font-size:13px; width:130px;">2. 学生主体性落实</span>
        <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(sSubject/20)*100}%;"></div></div>
        <span style="font-size:12px; font-weight:bold;">${sSubject}/20</span>
      </div>
      <div class="score-dimension-row">
        <span style="font-size:13px; width:130px;">3. 启发点拨与追问</span>
        <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(sScaffold/20)*100}%;"></div></div>
        <span style="font-size:12px; font-weight:bold;">${sScaffold}/20</span>
      </div>
      <div class="score-dimension-row">
        <span style="font-size:13px; width:130px;">4. 语言亲切去除背稿感</span>
        <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(sScript/20)*100}%;"></div></div>
        <span style="font-size:12px; font-weight:bold;">${sScript}/20</span>
      </div>
      <div class="score-dimension-row">
        <span style="font-size:13px; width:130px;">5. 教资标准达标度</span>
        <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(sRubric/20)*100}%;"></div></div>
        <span style="font-size:12px; font-weight:bold;">${sRubric}/20</span>
      </div>

      <div style="margin-top:14px; background:var(--bg-card-warm); padding:10px 12px; border-radius:var(--radius-sm); font-size:12px; line-height:1.7;">
        <strong style="color:var(--color-green-primary);">专家评委评点：</strong><br>
        ${feedbackList.map(f => `<div>${f}</div>`).join("")}
      </div>
    `;

    APP_STATE.userData.sparringCount = (APP_STATE.userData.sparringCount || 0) + 1;
    saveUserData();
  }

  // 5. 渲染教师万能话术库与八大课型模板
  function renderTemplates() {
    const scriptsContainer = document.getElementById("templates-scripts-container");
    const genreContainer = document.getElementById("genre-blueprints-container");

    if (scriptsContainer && window.TEMPLATES_DB) {
      const s = window.TEMPLATES_DB.teacherScripts;
      scriptsContainer.innerHTML = `
        <div class="academic-card">
          <h4 class="card-title">一、经典导入万能公式（0-1分钟突破）</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
            ${s.leadIn.map(item => `
              <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px;">
                <div style="font-weight:bold; color:var(--color-green-primary); margin-bottom:4px; font-size:14px;">${item.type}</div>
                <div style="font-size:12px; color:var(--color-gold); margin-bottom:6px;">【公式】：${item.formula}</div>
                <div style="font-size:13px; line-height:1.6; background:#FFFFFF; padding:10px; border-radius:4px; border-left:3px solid var(--color-green-primary); margin-bottom:8px;">
                  ${item.script}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:11px; color:var(--text-muted);">适用：${item.applicableGenres.join(" / ")}</span>
                  <button class="btn-academic" style="padding:2px 8px; font-size:11px;" onclick="navigator.clipboard.writeText('${item.script.replace(/'/g, "\\'")}'); alert('已复制话术到剪贴板！');">复制话术</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="academic-card">
          <h4 class="card-title">二、提问与追问艺术（告别“很好请坐”）</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
            ${s.probing.map(item => `
              <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px;">
                <div style="font-weight:bold; color:var(--color-green-primary); margin-bottom:6px; font-size:14px;">💡 ${item.strategy}</div>
                <div style="font-size:13px; line-height:1.6; background:#FFFFFF; padding:10px; border-radius:4px; border-left:3px solid var(--color-gold);">
                  ${item.script}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    if (genreContainer && window.TEMPLATES_DB) {
      genreContainer.innerHTML = window.TEMPLATES_DB.genreBlueprints.map(g => `
        <div class="academic-card" style="margin-bottom:20px;">
          <div class="card-title">
            <span style="font-size:18px; color:var(--color-green-primary); font-weight:bold;">${g.genre} 10分钟试讲突破方案</span>
            <span class="pill-badge green" style="font-size:12px;">核心文体</span>
          </div>
          <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:14px; border-left:4px solid var(--color-green-primary);">
            <strong>核心纲领：</strong>${g.corePrinciple}
          </div>
          
          <h5 style="font-size:14px; font-weight:bold; margin-bottom:8px; color:var(--text-primary);">⏱ 10分钟时间分配黄金时刻表：</h5>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:13px; margin-bottom:14px;">
            ${Object.entries(g.timeAllocation).map(([t, desc]) => `
              <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); padding:10px; border-radius:4px;">
                <strong style="color:var(--color-green-primary);">${t}</strong>
                <p style="font-size:12px; margin-top:4px; color:var(--text-secondary);">${desc}</p>
              </div>
            `).join("")}
          </div>

          <h5 style="font-size:14px; font-weight:bold; margin-bottom:6px; color:var(--text-primary);">🎯 特级教师实战拿分秘笈：</h5>
          <ul style="padding-left:20px; font-size:13px; color:var(--text-secondary); line-height:1.8;">
            ${g.keySkills.map(k => `<li>${k}</li>`).join("")}
          </ul>
          
          <div style="margin-top:12px; font-size:12px; color:var(--text-muted);">
            <strong>教材经典典范课例：</strong>${g.representativeLessons.join("、")}
          </div>
        </div>
      `).join("");
    }
  }

  // 6. 渲染结构化面试题库
  function renderStructured() {
    const list = document.getElementById("structured-questions-list");
    if (!list || !window.STRUCTURED_DB) return;

    list.innerHTML = window.STRUCTURED_DB.questions.map((q, idx) => `
      <div class="academic-card" style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <h4 style="font-family:var(--font-serif); font-size:16px; font-weight:bold; color:var(--text-primary); flex:1;">
            第${idx + 1}题：${q.title}
          </h4>
          <span class="pill-badge gold" style="font-size:11px; white-space:nowrap; margin-left:10px;">${q.category}</span>
        </div>
        <div style="font-size:12px; color:var(--color-green-primary); margin-bottom:12px;">
          <strong>考察维度：</strong>${q.coreAspect} | <strong>解题思维框架：</strong>${q.framework}
        </div>

        <!-- 满分示范作答 -->
        <div id="struct-answer-${q.id}" style="display:none; margin-top:12px; background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
          <div style="font-size:14px; line-height:1.8; color:var(--text-primary); white-space:pre-line; margin-bottom:12px;">
            ${q.modelAnswer}
          </div>
          <div style="background:#FFFFFF; border-left:3px solid var(--color-green-primary); padding:10px 12px; font-size:12px; color:var(--text-secondary); margin-bottom:6px;">
            <strong>考官打分亮点：</strong>${q.keyScorePoints.join("；")}
          </div>
          <div style="background:#FFF9F9; border-left:3px solid #D9534F; padding:8px 12px; font-size:12px; color:#A94442;">
            <strong>考场防坑避险：</strong>${q.pitfalls}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; border-top:1px dashed var(--border-color); padding-top:10px;">
          <span style="font-size:12px; color:var(--text-muted);">建议限时：2分30秒口头作答</span>
          <button class="btn-academic" onclick="
            const el = document.getElementById('struct-answer-${q.id}');
            const isHidden = el.style.display === 'none';
            el.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? '收起满分示范' : '查看满分示范回答';
          ">
            查看满分示范回答
          </button>
        </div>
      </div>
    `).join("");
  }

  // 7. 渲染考官答辩题库
  function renderDefense() {
    const list = document.getElementById("defense-questions-list");
    if (!list || !window.DEFENSE_DB) return;

    list.innerHTML = window.DEFENSE_DB.categories.map(cat => `
      <div class="academic-card" style="margin-bottom:20px;">
        <h3 class="card-title" style="font-size:17px; color:var(--color-green-primary);">
          ${cat.category}
        </h3>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${cat.questions.map(q => `
            <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
              <h5 style="font-size:15px; font-weight:bold; color:var(--text-primary); margin-bottom:8px;">
                ❓ 考官追问：${q.question}
              </h5>
              <div style="font-size:12px; color:var(--color-gold); margin-bottom:8px;">
                <strong>核心应答逻辑：</strong>${q.answerLogic}
              </div>
              <div style="font-size:14px; line-height:1.75; color:var(--text-secondary); background:#FFFFFF; padding:14px; border-radius:var(--radius-sm); border-left:3px solid var(--color-green-primary); white-space:pre-line; margin-bottom:10px;">
                ${q.modelAnswer}
              </div>
              <div style="font-size:12px; color:var(--text-muted);">
                <strong>采分要点：</strong>${q.scoringHighlights.join(" | ")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  // 8. 渲染学习计划与每日打卡
  function renderStudyPlan() {
    const timeline = document.getElementById("plan-stages-timeline");
    const checklist = document.getElementById("daily-checklist-container");

    if (timeline && window.STUDY_PLAN_DB) {
      timeline.innerHTML = window.STUDY_PLAN_DB.stages.map((s, i) => `
        <div class="stage-step-card ${i === 0 ? 'current' : ''}">
          <div class="stage-badge">${s.duration}</div>
          <h4 class="stage-title">${s.name}</h4>
          <p class="stage-desc"><strong>【核心目标】：</strong>${s.goal}</p>
          <ul style="padding-left:18px; font-size:13px; color:var(--text-secondary); line-height:1.8; margin-bottom:12px;">
            ${s.keyTasks.map(t => `<li>${t}</li>`).join("")}
          </ul>
          <div style="font-size:12px; color:var(--color-green-primary); background:var(--color-green-light); padding:8px 10px; border-radius:4px; margin-bottom:8px;">
            <strong>阶段成果：</strong>${s.deliverable}
          </div>
          <div style="font-size:11px; color:var(--text-muted);">
            💡 <strong>备战锦囊：</strong>${s.tips}
          </div>
        </div>
      `).join("");
    }

    if (checklist && window.STUDY_PLAN_DB) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayTasks = APP_STATE.userData.dailyTasks[todayStr] || {};

      checklist.innerHTML = `
        <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; color:var(--text-muted);">今日打卡日期：<strong>${todayStr}</strong></span>
          <span style="font-size:12px; color:var(--color-green-primary); font-weight:bold;" id="checklist-progress-text">已完成 0 / 5 项</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${window.STUDY_PLAN_DB.dailyChecklistTemplate.map(task => {
            const isDone = !!todayTasks[task.id];
            return `
              <label style="display:flex; align-items:center; gap:10px; background:var(--bg-card); padding:10px 14px; border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer;">
                <input type="checkbox" ${isDone ? "checked" : ""} onchange="toggleDailyTask('${task.id}', this.checked)" style="accent-color:var(--color-green-primary); width:16px; height:16px;">
                <span style="font-size:14px; ${isDone ? 'text-decoration:line-through; color:var(--text-muted);' : 'color:var(--text-primary);'}">
                  ${task.label}
                </span>
              </label>
            `;
          }).join("")}
        </div>
      `;

      updateChecklistProgress(todayTasks);
    }
  }

  window.toggleDailyTask = function (taskId, isChecked) {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!APP_STATE.userData.dailyTasks[todayStr]) {
      APP_STATE.userData.dailyTasks[todayStr] = {};
    }
    APP_STATE.userData.dailyTasks[todayStr][taskId] = isChecked;
    saveUserData();
    updateChecklistProgress(APP_STATE.userData.dailyTasks[todayStr]);
    if (isChecked) playChime(783.99, "sine", 0.2);
  };

  function updateChecklistProgress(tasks) {
    const total = 5;
    const done = Object.values(tasks).filter(Boolean).length;
    const textEl = document.getElementById("checklist-progress-text");
    if (textEl) {
      textEl.textContent = `已完成 ${done} / ${total} 项 ${done === total ? '🎉 今日大满贯！' : ''}`;
    }
  }

  // 9. 渲染我的备课手写教案与收藏夹
  function renderSavedPlans() {
    const plansContainer = document.getElementById("saved-plans-container");
    const favsContainer = document.getElementById("saved-favs-container");

    if (plansContainer) {
      const plans = Object.values(APP_STATE.userData.myLessonPlans);
      if (plans.length === 0) {
        plansContainer.innerHTML = `
          <div style="text-align:center; padding:32px; color:var(--text-muted);">
            暂无自定义备课教案。前往【模拟考场】或任选课文点击【去试讲】填写教案纸并保存吧！
          </div>
        `;
      } else {
        plansContainer.innerHTML = plans.map(p => `
          <div class="academic-card" style="margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <h4 style="font-family:var(--font-serif); font-size:16px; font-weight:bold; color:var(--text-primary);">
                《${p.lessonTitle}》10分钟备课教案
              </h4>
              <span style="font-size:12px; color:var(--text-muted);">${p.updatedAt || ""}</span>
            </div>
            <p style="font-size:13px; color:var(--text-secondary); white-space:pre-line; max-height:100px; overflow:hidden; text-overflow:ellipsis;">
              ${p.targets || ""}
            </p>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px; border-top:1px solid var(--border-subtle); padding-top:8px;">
              <button class="btn-academic" onclick="startMockExamWithLesson('${p.lessonId}')">加载至考场继续练</button>
              <button class="btn-academic" onclick="deleteLessonPlan('${p.lessonId}')" style="color:#C0392B;">删除</button>
            </div>
          </div>
        `).join("");
      }
    }

    if (favsContainer && window.TEXTBOOK_DB) {
      const favLessons = window.TEXTBOOK_DB.lessons.filter(l => APP_STATE.userData.favorites.includes(l.fullId));
      if (favLessons.length === 0) {
        favsContainer.innerHTML = `<div style="text-align:center; padding:32px; color:var(--text-muted);">暂无收藏课文。在教材库点击“☆ 收藏”添加。</div>`;
      } else {
        favsContainer.innerHTML = favLessons.map(l => createLessonCardHtml(l)).join("");
      }
    }
  }

  window.deleteLessonPlan = function (lessonId) {
    if (confirm("确定要删除这篇自写教案吗？")) {
      delete APP_STATE.userData.myLessonPlans[lessonId];
      saveUserData();
      renderSavedPlans();
    }
  };

  // 绑定交互事件与检索筛选
  function bindEvents() {
    // 搜索框输入
    const searchInput = document.getElementById("textbook-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        APP_STATE.searchKeyword = e.target.value.trim();
        renderTextbooks();
      });
    }

    // 册次筛选按钮
    document.querySelectorAll(".chip-book").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-book").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedBookId = btn.dataset.book;
        renderTextbooks();
      });
    });

    // 文体筛选按钮
    document.querySelectorAll(".chip-genre").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-genre").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedGenre = btn.dataset.genre;
        renderTextbooks();
      });
    });

    // 考频筛选
    document.querySelectorAll(".chip-priority").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-priority").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.priorityFilter = btn.dataset.priority;
        renderTextbooks();
      });
    });

    // 仅看收藏切换
    const favOnlyBtn = document.getElementById("btn-toggle-fav-filter");
    if (favOnlyBtn) {
      favOnlyBtn.addEventListener("click", () => {
        APP_STATE.favoritesOnly = !APP_STATE.favoritesOnly;
        favOnlyBtn.classList.toggle("active", APP_STATE.favoritesOnly);
        favOnlyBtn.textContent = APP_STATE.favoritesOnly ? "★ 仅看收藏已开启" : "☆ 仅看收藏";
        renderTextbooks();
      });
    }

    // 陪练快速话术点击
    document.querySelectorAll(".quick-spar-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.prompt;
        sendTeacherLine(text);
      });
    });
  }

})();
