/**
 * 初中语文教师资格证面试智能备考系统 · 核心业务引擎 (app.js)
 * 纯前端驱动、本地存储持久化、真实学习流程优先、拒绝宣传口号
 */

(function () {
  "use strict";

  // 全局应用状态
  const APP_STATE = {
    currentTab: "home",
    selectedLesson: null,
    selectedBookId: "all",
    selectedGenre: "all",
    selectedStatus: "all", // all | unlearned | learning | completed
    searchKeyword: "",
    priorityFilter: "all",
    favoritesOnly: false,

    // 阅读器偏好
    readerTheme: "paper", // paper | white | night
    readerFontSize: "font-md", // font-sm | font-md | font-lg
    readerHighlight: true,

    // 计时器状态
    prepDurationMinutes: 10,
    prepTimer: {
      remainingSeconds: 10 * 60,
      intervalId: null,
      isRunning: false
    },
    teachTimer: {
      remainingSeconds: 10 * 60,
      intervalId: null,
      isRunning: false
    },

    // 1分钟快速导入小练习计时
    quickLeadTimer: {
      remainingSeconds: 60,
      intervalId: null,
      isRunning: false
    },

    // 陪练对话
    sparringDialogues: [],

    // 本地持久化数据
    userData: {
      favorites: [],
      lessonStatus: {}, // { [lessonId]: 'unlearned' | 'learning' | 'completed' }
      myLessonPlans: {},
      examCount: 0,
      sparringCount: 0,
      todayChecklist: [false, false, false, false, false],
      dailyTasks: {},
      lastActiveDate: ""
    }
  };

  // 预计下半年面试时间：2026年12月5日
  const EXAM_TARGET_DATE = new Date(2026, 11, 5);

  // Web Audio 考试提示音
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
      console.warn("Web Audio failed:", e);
    }
  }

  // 本地存储
  const STORAGE_KEY = "CHINESE_TEACHER_APP_DATA_V2";
  function loadUserData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("CHINESE_TEACHER_APP_DATA_V1");
      if (saved) {
        APP_STATE.userData = Object.assign(APP_STATE.userData, JSON.parse(saved));
        if (!APP_STATE.userData.lessonStatus) APP_STATE.userData.lessonStatus = {};
        if (!APP_STATE.userData.todayChecklist) APP_STATE.userData.todayChecklist = [false, false, false, false, false];
      }
    } catch (e) {
      console.error("Failed to load user data:", e);
    }
  }

  function saveUserData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE.userData));
      updateGlobalBadges();
    } catch (e) {
      console.error("Failed to save user data:", e);
    }
  }

  // 格式化时间 mm:ss
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // 计算倒计时天数
  function getDaysToExam() {
    const now = new Date();
    const diffTime = EXAM_TARGET_DATE - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // 初始化应用
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
    const days = getDaysToExam();
    const badge = document.getElementById("exam-countdown-badge");
    const heroDays = document.getElementById("hero-countdown-days");
    if (badge) badge.innerHTML = `<span>⏳ 距12月面试预计还剩</span><strong>${days}</strong><span>天</span>`;
    if (heroDays) heroDays.textContent = days;
    updateGlobalBadges();
  }

  function updateGlobalBadges() {
    const favCount = APP_STATE.userData.favorites.length;
    const examCount = APP_STATE.userData.examCount || 0;

    const favBadge = document.getElementById("header-fav-badge");
    if (favBadge) favBadge.textContent = `${favCount} 篇收藏`;

    const examBadge = document.getElementById("header-exam-badge");
    if (examBadge) examBadge.textContent = `${examCount} 次演练`;

    // 侧边栏全部课文总数
    const totalLessons = window.TEXTBOOK_DB ? window.TEXTBOOK_DB.totalLessons : 146;
    const sideBadge = document.getElementById("sidebar-total-badge");
    if (sideBadge) sideBadge.textContent = totalLessons;
  }

  // 移动端抽屉控制
  window.toggleMobileSidebar = function () {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar && backdrop) {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("active");
    }
  };

  window.closeMobileSidebar = function () {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar && backdrop) {
      sidebar.classList.remove("open");
      backdrop.classList.remove("active");
    }
  };

  // 主导航标签切换
  const TAB_TITLE_MAP = {
    "home": "首页任务",
    "novice": "新手入门 (8步走)",
    "workbench": "课文备课工作台",
    "textbooks": "统编初中教材课文库",
    "mock-exam": "考场备课与试讲演练",
    "templates": "教师试讲常用表达",
    "sparring": "分阶段试讲反馈",
    "genre-templates": "课型教学重点与取舍",
    "structured": "结构化问答真题",
    "defense": "考官答辩与追问",
    "study-plan": "备考规划与打卡",
    "saved": "我的教案与收藏"
  };

  window.switchTab = function (tabName) {
    APP_STATE.currentTab = tabName;
    closeMobileSidebar();

    // 更新侧边栏激活按钮
    document.querySelectorAll(".sidebar-nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // 更新视图
    document.querySelectorAll(".tab-view").forEach(view => {
      view.classList.toggle("active", view.id === `tab-view-${tabName}`);
    });

    // 顶部标题同步
    const titleEl = document.getElementById("current-view-title");
    if (titleEl) titleEl.textContent = TAB_TITLE_MAP[tabName] || "备考学习";

    // 针对特定标签刷新数据
    if (tabName === "home") renderDashboard();
    if (tabName === "textbooks") renderTextbooks();
    if (tabName === "saved") renderSavedPlans();
    if (tabName === "study-plan") renderStudyPlan();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 侧边栏册次快捷选择
  window.selectSidebarBook = function (bookId) {
    APP_STATE.selectedBookId = bookId;
    document.querySelectorAll(".sidebar-subnav-item").forEach(item => {
      item.classList.toggle("active", item.id === `subnav-${bookId}`);
    });
    // 同步课文库中的筛选按钮
    document.querySelectorAll(".chip-book").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.book === bookId);
    });
    renderTextbooks();
  };

  // 1. 首页任务与打卡渲染
  function renderDashboard() {
    const totalLessons = window.TEXTBOOK_DB ? window.TEXTBOOK_DB.totalLessons : 146;
    const preppedCount = Object.keys(APP_STATE.userData.myLessonPlans).length;
    const examCount = APP_STATE.userData.examCount || 0;
    
    // 统计已学习课文数量
    const learnedCount = Object.values(APP_STATE.userData.lessonStatus).filter(st => st === "learning" || st === "completed").length;

    const totalEl = document.getElementById("dash-total-lessons");
    if (totalEl) totalEl.textContent = totalLessons;

    const learnedEl = document.getElementById("dash-learned-lessons");
    if (learnedEl) learnedEl.textContent = learnedCount;

    const preppedEl = document.getElementById("dash-prepped-lessons");
    if (preppedEl) preppedEl.textContent = preppedCount;

    const examEl = document.getElementById("dash-exam-count");
    if (examEl) examEl.textContent = examCount;

    // 今日任务勾选状态同步
    const checklist = APP_STATE.userData.todayChecklist || [false, false, false, false, false];
    checklist.forEach((checked, idx) => {
      const cb = document.getElementById(`check-task-${idx}`);
      if (cb) {
        cb.checked = checked;
        const item = cb.closest(".checklist-item");
        if (item) item.classList.toggle("done", checked);
      }
    });
  }

  // 切换今日清单任务状态
  window.toggleChecklistTask = function (idx) {
    if (!APP_STATE.userData.todayChecklist) {
      APP_STATE.userData.todayChecklist = [false, false, false, false, false];
    }
    const current = !APP_STATE.userData.todayChecklist[idx];
    APP_STATE.userData.todayChecklist[idx] = current;
    saveUserData();

    const cb = document.getElementById(`check-task-${idx}`);
    if (cb) {
      cb.checked = current;
      const item = cb.closest(".checklist-item");
      if (item) item.classList.toggle("done", current);
    }
    if (current) playChime(659.25, "sine", 0.2);
  };

  // 随机抽取课文模拟全真面试
  window.startRandomExamSimulation = function () {
    if (!window.TEXTBOOK_DB || !window.TEXTBOOK_DB.lessons) return;
    // 从五星重点篇目中随机抽取一篇
    const highFreqs = window.TEXTBOOK_DB.lessons.filter(l => l.priority === "★★★★★");
    const pool = highFreqs.length > 0 ? highFreqs : window.TEXTBOOK_DB.lessons;
    const randomLesson = pool[Math.floor(Math.random() * pool.length)];

    if (confirm(`🎲 考场电脑抽题完毕！\n\n您抽到的面试题目为：\n《${randomLesson.title}》（${randomLesson.author} · ${randomLesson.gradeName}）\n\n是否立即进入考场，开始准备简案与试讲？`)) {
      openLessonWorkbench(randomLesson.fullId);
    }
  };

  // ===================================================================
  // 核心：单篇课文双栏学习工作台 (Single Lesson Learning Workbench)
  // ===================================================================

  window.openLessonWorkbench = function (lessonId) {
    if (!window.TEXTBOOK_DB) return;
    const lesson = window.TEXTBOOK_DB.lessons.find(l => l.fullId === lessonId);
    if (!lesson) return;

    APP_STATE.selectedLesson = lesson;

    // 更新用户课文学习状态（若是首次接触，置为正在学）
    if (!APP_STATE.userData.lessonStatus[lessonId] || APP_STATE.userData.lessonStatus[lessonId] === "unlearned") {
      APP_STATE.userData.lessonStatus[lessonId] = "learning";
      saveUserData();
    }

    const container = document.getElementById("workbench-container");
    if (!container) return;

    // 切换到工作台视图
    switchTab("workbench");
    const titleEl = document.getElementById("current-view-title");
    if (titleEl) titleEl.textContent = `《${lesson.title}》· 备课工作台`;

    // 获取课文原文与核心片段数据
    const textData = window.getLessonTextContent ? window.getLessonTextContent(lesson.fullId) : null;
    const isFav = APP_STATE.userData.favorites.includes(lesson.fullId);
    const status = APP_STATE.userData.lessonStatus[lesson.fullId] || "learning";

    // 动态生成根据文体调整的 10 分钟试讲时间轴
    const timelineData = getGenreTimelineData(lesson.genre);

    // 渲染双栏工作台
    container.innerHTML = `
      <!-- 工作台顶部栏 -->
      <div class="workbench-topbar">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <button class="workbench-back-btn" onclick="switchTab('textbooks')">
            ← 返回课文列表
          </button>
          <div class="workbench-lesson-title-area">
            <h2 class="workbench-lesson-title">《${lesson.title}》</h2>
            <span class="workbench-meta-pill">${lesson.author}</span>
            <span class="workbench-meta-pill">${lesson.gradeName} 第${lesson.unitNumber}单元</span>
            <span class="workbench-meta-pill" style="background:var(--color-green-light); color:var(--color-green-primary); font-weight:600;">${lesson.genre}</span>
            <span style="font-size:12px; color:var(--color-gold); font-weight:bold;">${lesson.priority}</span>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <!-- 学习状态快捷切换 -->
          <div style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <span style="color:var(--text-muted);">状态：</span>
            <select class="search-input" style="padding:4px 8px; font-size:12.5px; width:auto;" onchange="setLessonStatus('${lesson.fullId}', this.value)">
              <option value="unlearned" ${status === 'unlearned' ? 'selected' : ''}>未学习</option>
              <option value="learning" ${status === 'learning' ? 'selected' : ''}>正在学习</option>
              <option value="completed" ${status === 'completed' ? 'selected' : ''}>已完成试讲</option>
            </select>
          </div>

          <button class="btn-academic" onclick="toggleFavorite('${lesson.fullId}'); this.textContent = APP_STATE.userData.favorites.includes('${lesson.fullId}') ? '★ 已收藏' : '☆ 收藏';">
            ${isFav ? "★ 已收藏" : "☆ 收藏"}
          </button>
          <button class="btn-academic primary" onclick="startMockExamWithLesson('${lesson.fullId}')">
            去考场模拟 ⏱️
          </button>
        </div>
      </div>

      <!-- 双栏核心内容 -->
      <div class="workbench-split">

        <!-- 左栏：教材原文阅读器 -->
        <div class="reader-panel ${APP_STATE.readerTheme === 'white' ? 'theme-white' : APP_STATE.readerTheme === 'night' ? 'theme-night' : ''}" id="reader-panel-box">
          <!-- 阅读器工具栏 -->
          <div class="reader-toolbar">
            <div class="reader-tools-group">
              <span style="font-weight:600;">📖 课文原文</span>
              <a href="${encodeURI(lesson.pdfFileName)}" target="_blank" style="color:var(--color-green-primary); text-decoration:none; margin-left:6px;" title="在浏览器新标签页中打开统编教材PDF原书第${lesson.page}页">
                原书第${lesson.page}页 ↗
              </a>
            </div>

            <div class="reader-tools-group">
              <!-- 字号调节 -->
              <span style="color:var(--text-muted);">字号：</span>
              <button class="reader-tool-btn ${APP_STATE.readerFontSize === 'font-sm' ? 'active' : ''}" onclick="setReaderFontSize('font-sm')">小</button>
              <button class="reader-tool-btn ${APP_STATE.readerFontSize === 'font-md' ? 'active' : ''}" onclick="setReaderFontSize('font-md')">中</button>
              <button class="reader-tool-btn ${APP_STATE.readerFontSize === 'font-lg' ? 'active' : ''}" onclick="setReaderFontSize('font-lg')">大</button>

              <!-- 底色切换 -->
              <span style="color:var(--text-muted); margin-left:6px;">底色：</span>
              <button class="reader-tool-btn ${APP_STATE.readerTheme === 'paper' ? 'active' : ''}" onclick="setReaderTheme('paper')">宣纸</button>
              <button class="reader-tool-btn ${APP_STATE.readerTheme === 'white' ? 'active' : ''}" onclick="setReaderTheme('white')">纯白</button>
              <button class="reader-tool-btn ${APP_STATE.readerTheme === 'night' ? 'active' : ''}" onclick="setReaderTheme('night')">夜间</button>

              <!-- 高亮开关 -->
              <button class="reader-tool-btn ${APP_STATE.readerHighlight ? 'active' : ''}" style="margin-left:6px;" onclick="toggleReaderHighlight()">
                ${APP_STATE.readerHighlight ? "高亮开" : "高亮关"}
              </button>
            </div>
          </div>

          <!-- 正文滚动区 -->
          <div class="reader-content ${APP_STATE.readerFontSize} ${APP_STATE.readerHighlight ? 'highlight-on' : ''}" id="reader-content-scroll">
            <div style="text-align:center; margin-bottom:18px;">
              <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:700;">${lesson.title}</h3>
              <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">${lesson.author}</p>
            </div>

            ${textData ? textData.paragraphs.map(p => `
              <div class="reader-paragraph ${p.highlight ? 'is-core' : ''}">
                ${p.sectionName ? `<div class="reader-clip-badge">📍 ${p.sectionName}</div>` : ''}
                <p>${p.highlight ? `<mark>${p.text}</mark>` : p.text}</p>
              </div>
            `).join("") : `
              <div class="reader-paragraph">
                <p>${lesson.mainContent}</p>
              </div>
            `}

            <div style="margin-top:24px; padding:12px 14px; background:rgba(58,107,78,0.06); border-radius:var(--radius-sm); font-size:12.5px; color:var(--text-secondary);">
              💡 <strong>阅读提示：</strong>如果需要对照统编教材原文插图、旁批与课后研讨练习，请点击工具栏的【原书第${lesson.page}页 ↗】查阅本地电子课本。
            </div>
          </div>
        </div>

        <!-- 右栏：教法备课指导与实战工作台 -->
        <div class="coach-panel">

          <!-- 模块1：10分钟重点取舍（极重要！） -->
          <div class="academic-card">
            <h3 class="card-title">
              <span>🎯 这篇课文 10 分钟怎么取舍？</span>
            </h3>
            
            <div class="tradeoff-grid">
              <div class="tradeoff-card yes">
                <div class="tradeoff-header">✅ 10分钟适合讲什么（只抓1个切片）</div>
                <div>${lesson.sampleFocus || lesson.interviewKeyPoint}</div>
              </div>
              <div class="tradeoff-card no">
                <div class="tradeoff-header">❌ 10分钟绝对不要讲什么（避坑警告）</div>
                <div>${getLessonNotToTeachWarning(lesson)}</div>
              </div>
            </div>
          </div>

          <!-- 模块2：如果你完全不会讲，照着这几步准备 -->
          <div class="academic-card">
            <h3 class="card-title">
              <span>📝 如果你完全不会讲，照着这几步准备（新手保姆级）</span>
            </h3>
            <div class="novice-stepper" style="margin-top:0;">
              <div class="novice-step-card" style="padding:14px 16px;">
                <div class="step-header" style="margin-bottom:6px;">
                  <div class="step-number">1</div>
                  <div class="step-title" style="font-size:14.5px;">文体判断与这节课的定位</div>
                </div>
                <div class="step-body" style="padding-left:36px; font-size:13.5px;">
                  这篇课文属于<strong>【${lesson.genre}】</strong>。今天这10分钟试讲，不要讲成整篇梳理课，而要定位为：<strong>“抓住核心语段，带学生品析语言与情感的精读片段课”</strong>。
                </div>
              </div>

              <div class="novice-step-card" style="padding:14px 16px;">
                <div class="step-header" style="margin-bottom:6px;">
                  <div class="step-number">2</div>
                  <div class="step-title" style="font-size:14.5px;">确定本节课的2个实在目标</div>
                </div>
                <div class="step-body" style="padding-left:36px; font-size:13.5px;">
                  <div><strong>目标一（语言与技能）：</strong>${lesson.teachingDesign.targets.knowledge}</div>
                  <div style="margin-top:4px;"><strong>目标二（情感与思考）：</strong>${lesson.teachingDesign.targets.emotion}</div>
                </div>
              </div>

              <div class="novice-step-card" style="padding:14px 16px;">
                <div class="step-header" style="margin-bottom:6px;">
                  <div class="step-number">3</div>
                  <div class="step-title" style="font-size:14.5px;">设计一个直奔主题的核心主问题</div>
                </div>
                <div class="step-body" style="padding-left:36px; font-size:13.5px;">
                  <strong>主问题建议：</strong>“请同学们默读核心语段，圈画出最能体现作者情感的词句，结合修辞手法说说好在哪里？”<br>
                  <small style="color:var(--text-muted);">（第一问让学生找原文依据，第二问引导追问为什么好，课堂节奏最自然）</small>
                </div>
              </div>
            </div>
          </div>

          <!-- 模块3：10分钟试讲结构时间轴（随文体动态调整） -->
          <div class="timeline-meter">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="font-family:var(--font-serif); font-size:15.5px; font-weight:700;">⏱️ 10分钟试讲时间分配（${lesson.genre}课型）</h4>
              <span style="font-size:12px; color:var(--color-green-primary); font-weight:600;">核心黄金段占50%时间</span>
            </div>
            <div class="timeline-bar">
              <div class="timeline-segment segment-p1" style="width:${timelineData.p1_pct}%;" title="导入：${timelineData.p1}">导入 ${timelineData.p1_time}</div>
              <div class="timeline-segment segment-p2" style="width:${timelineData.p2_pct}%;" title="初读：${timelineData.p2}">初读 ${timelineData.p2_time}</div>
              <div class="timeline-segment segment-p3" style="width:${timelineData.p3_pct}%;" title="精读核心：${timelineData.p3}">精读核心品析（主阵地） ${timelineData.p3_time}</div>
              <div class="timeline-segment segment-p4" style="width:${timelineData.p4_pct}%;" title="小结：${timelineData.p4}">小结 ${timelineData.p4_time}</div>
              <div class="timeline-segment segment-p5" style="width:${timelineData.p5_pct}%;" title="作业：${timelineData.p5}">作业 ${timelineData.p5_time}</div>
            </div>
            <div class="timeline-legend">
              <span>0:00 导入新课</span>
              <span>1:00 进入文本</span>
              <span>2:30 展开师生核心互动</span>
              <span>7:30 拓展小结</span>
              <span>10:00 礼貌下课</span>
            </div>
          </div>

          <!-- 模块4：教师到底应该说什么？口语化台词示范（说人话、绝无AI腔） -->
          <div class="academic-card">
            <h3 class="card-title">
              <span>💬 站上讲台到底应该怎么说？（教师口语示范）</span>
            </h3>
            <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">
              照着下面的语气和台词读一遍，找一找把课堂交给学生的感觉：
            </p>

            <div class="dialogue-demo-box">
              <!-- 环节1：导入示范 -->
              <div class="dialogue-item">
                <span class="dialogue-role-badge teacher">教师导入</span>
                <div class="dialogue-bubble teacher">
                  “同学们好，请坐！上课前，大家先看大屏幕上的几幅图景（或者回想一下日常生活的经验）……今天，我们跟随作家${lesson.author}的笔触，一同走进课文——请看黑板，今天我们学习《${lesson.title}》。（顺手在黑板上方工整写下课题和作者）”
                  <div class="dialogue-tip">💡 贴士：1分钟内迅速切入课题，课题写完立刻让学生翻开课本，千万不要在导入环节长篇大论。</div>
                </div>
              </div>

              <!-- 环节2：提问与初读示范 -->
              <div class="dialogue-item">
                <span class="dialogue-role-badge teacher">教师提问</span>
                <div class="dialogue-bubble teacher">
                  “请同学们自由朗读课文，把字音读准、句子读顺，同时思考一个问题：作者在这篇文章中，最浓墨重彩描摹的是哪一处景致/哪一个人物细节？把打动你的句子用波浪线画下来。”
                </div>
              </div>

              <!-- 环节3：模拟学生作答与教师追问 -->
              <div class="dialogue-item">
                <span class="dialogue-role-badge student">模拟学生</span>
                <div class="dialogue-bubble student">
                  “老师，我找到了第X段！这里作者写‘……’，我觉得写得特别好，把那种生机/那种感情全写活了！”
                </div>
              </div>

              <div class="dialogue-item">
                <span class="dialogue-role-badge teacher">教师点拨</span>
                <div class="dialogue-bubble teacher">
                  “你的语感非常敏锐，请坐！大家顺着他的发现往下看——作者在这里用了一个非常关键的词句，如果老师把这个字换成普通的词，表达效果有什么不一样呢？同桌之间交流30秒……”
                  <div class="dialogue-tip">💡 贴士：不要只说‘很好请坐’！一定要把学生的答案提炼一句，再顺势追问下一个层次，考官最看重这个！</div>
                </div>
              </div>

              <!-- 环节4：小结与作业示范 -->
              <div class="dialogue-item">
                <span class="dialogue-role-badge teacher">小结与作业</span>
                <div class="dialogue-bubble teacher">
                  “今天这节课，我们通过反复朗读和细细品味，感受到了《${lesson.title}》中语言的魅力与深情。课后请大家完成两项作业：基础作业是把文中的优美句子摘抄在积累本上；拓展作业是仿照课文的描写手法，写一段身边的一处景物或一个生活细节。好，下课！同学们再见。（面向考官鞠躬）各位评委老师，我的试讲到此结束，谢谢老师！”
                </div>
              </div>
            </div>
          </div>

          <!-- 模块5：规范黑板板书建议 -->
          <div class="academic-card">
            <h3 class="card-title">
              <span>📋 黑板板书示范（粉笔字版式）</span>
            </h3>
            <div class="blackboard-box">
              <div style="text-align:center; font-size:18px; margin-bottom:12px;" class="chalk-yellow">
                《${lesson.title}》 ${lesson.author}
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; font-size:13.5px;">
                <div>
                  <div class="chalk-yellow" style="margin-bottom:4px;">【梳理感知】</div>
                  <div class="chalk-white">${lesson.teachingDesign.blackboardDesign.left}</div>
                </div>
                <div style="border-left:1px dashed rgba(255,255,255,0.25); border-right:1px dashed rgba(255,255,255,0.25); padding:0 12px;">
                  <div class="chalk-yellow" style="margin-bottom:4px;">【品析探究】</div>
                  <div class="chalk-white">${lesson.teachingDesign.blackboardDesign.center}</div>
                </div>
                <div>
                  <div class="chalk-yellow" style="margin-bottom:4px;">【主旨升华】</div>
                  <div class="chalk-white">${lesson.teachingDesign.blackboardDesign.right}</div>
                </div>
              </div>
            </div>
            <p style="font-size:12px; color:var(--text-muted); margin-top:8px;">
              💡 <strong>板书黄金法则：</strong>导入时写课题与作者；初读写左侧；精读时边问学生边在中间写下2~3个核心词；总结时写右侧主旨。千万别在最后1分钟集中抄写！
            </p>
          </div>

          <!-- 模块6：三步练一练 -->
          <div class="academic-card" style="border:2px solid var(--color-green-primary); background:#FAFCF9;">
            <h3 class="card-title" style="color:var(--color-green-primary); border-bottom-color:var(--color-green-border);">
              <span>🚀 现在就练一练：三步循序渐进</span>
            </h3>
            
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-top:8px;">
              <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; text-align:center;">
                <div style="font-weight:700; color:var(--text-primary); margin-bottom:4px;">第1步：开嗓朗读</div>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">看着上面的教师台词，大声朗读一遍，克服开口羞怯感。</p>
                <button class="btn-academic" style="width:100%; font-size:12.5px;" onclick="playChime(659.25, 'sine', 0.2); alert('太棒了！只要敢开口说出第一句，你已经战胜了80%的初学者！接下来尝试第2步。');">
                  已完成朗读 ✓
                </button>
              </div>

              <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; text-align:center;">
                <div style="font-weight:700; color:var(--color-green-primary); margin-bottom:4px;">第2步：1分钟导入小练</div>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">不看稿子，用60秒说一遍《${lesson.title}》的新课导入。</p>
                <button class="btn-academic primary" style="width:100%; font-size:12.5px;" id="btn-quick-lead" onclick="toggleQuickLeadTimer()">
                  开始60秒挑战 ⏱️
                </button>
              </div>

              <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; text-align:center;">
                <div style="font-weight:700; color:#8C5611; margin-bottom:4px;">第3步：10分钟完整试讲</div>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">带上简案纸与计时器，完整讲完这篇课文。</p>
                <button class="btn-academic gold" style="width:100%; font-size:12.5px;" onclick="startMockExamWithLesson('${lesson.fullId}')">
                  进入考场试讲 🎯
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 辅助：获取课文“千万不要讲什么”的警示
  function getLessonNotToTeachWarning(lesson) {
    if (lesson.genre.includes("散文")) {
      return "千万不要试图把文中所有景物片段全部讲完！绝对讲不完！也不要在作者生平背景上花费超过1分钟，更不要在字词拼音上纠缠太久。";
    } else if (lesson.genre.includes("小说")) {
      return "不要从头到尾复述故事长篇情节！不要把小说全部人物都拿来分析，抓1个最典型的人物动作或肖像细节深入剖析即可。";
    } else if (lesson.genre.includes("说明")) {
      return "不要把课文当科学科普课来讲！我们是语文课，要重点讲‘说明方法’（打比方、列数字）以及‘说明文语言的准确性与严密性’。";
    } else if (lesson.genre.includes("议论")) {
      return "不要陷在具体事例细节里出不来！重点讲论点是什么、用了什么论证方法（举例/道理论证）、论证思路是怎样层层推进的。";
    } else if (lesson.genre.includes("文言")) {
      return "千万不要逐字逐句做机械字面翻译！抓住两到三个通假字或古今异义字，把时间留给朗读节奏停顿和探究作者的核心情怀。";
    } else if (lesson.genre.includes("诗")) {
      return "不要一字一句生硬翻译诗意！重点带学生读出节拍重音，抓取核心意象，体会诗人当时的心境。";
    }
    return "10分钟时间极短，千万不要试图讲完所有段落，只选1个核心切片深入互动即可。";
  }

  // 辅助：获取各文体动态时间分配
  function getGenreTimelineData(genre) {
    if (genre.includes("文言") || genre.includes("诗")) {
      return {
        p1_time: "1分", p1_pct: 10, p1: "名句起兴导入",
        p2_time: "2分", p2_pct: 20, p2: "读准字音节奏停顿",
        p3_time: "5分", p3_pct: 50, p3: "落实关键实词虚词与主旨品析",
        p4_time: "1分", p4_pct: 10, p4: "当堂成诵与小结",
        p5_time: "1分", p5_pct: 10, p5: "背诵默写分层作业"
      };
    } else if (genre.includes("小说")) {
      return {
        p1_time: "1分", p1_pct: 10, p1: "人物话题导入",
        p2_time: "1.5分", p2_pct: 15, p2: "梳理情节冲突线索",
        p3_time: "5.5分", p3_pct: 55, p3: "抓动作语言细节品析人物性格",
        p4_time: "1分", p4_pct: 10, p4: "探讨社会环境与主题",
        p5_time: "1分", p5_pct: 10, p5: "续写或微写作作业"
      };
    } else {
      // 散文/常规
      return {
        p1_time: "1分", p1_pct: 10, p1: "生活情境激趣导入",
        p2_time: "1.5分", p2_pct: 15, p2: "自读感知与明确研读段落",
        p3_time: "5分", p3_pct: 50, p3: "精读主问题探究与师生互动",
        p4_time: "1.5分", p4_pct: 15, p4: "情感升华与回顾板书",
        p5_time: "1分", p5_pct: 10, p5: "分层作业与下课致谢"
      };
    }
  }

  // 阅读器控制
  window.setReaderFontSize = function (size) {
    APP_STATE.readerFontSize = size;
    const content = document.getElementById("reader-content-scroll");
    if (content) {
      content.className = `reader-content ${size} ${APP_STATE.readerHighlight ? 'highlight-on' : ''}`;
    }
    document.querySelectorAll(".reader-toolbar button").forEach(b => {
      if (b.textContent === '小' && size === 'font-sm') b.classList.add('active');
      else if (b.textContent === '中' && size === 'font-md') b.classList.add('active');
      else if (b.textContent === '大' && size === 'font-lg') b.classList.add('active');
      else if (['小', '中', '大'].includes(b.textContent)) b.classList.remove('active');
    });
  };

  window.setReaderTheme = function (theme) {
    APP_STATE.readerTheme = theme;
    const box = document.getElementById("reader-panel-box");
    if (box) {
      box.className = `reader-panel ${theme === 'white' ? 'theme-white' : theme === 'night' ? 'theme-night' : ''}`;
    }
  };

  window.toggleReaderHighlight = function () {
    APP_STATE.readerHighlight = !APP_STATE.readerHighlight;
    const content = document.getElementById("reader-content-scroll");
    if (content) {
      content.classList.toggle("highlight-on", APP_STATE.readerHighlight);
    }
  };

  // 设置课文学习进度
  window.setLessonStatus = function (lessonId, status) {
    APP_STATE.userData.lessonStatus[lessonId] = status;
    saveUserData();
    renderTextbooks();
    renderDashboard();
  };

  // 60秒快速导入计时器
  window.toggleQuickLeadTimer = function () {
    const btn = document.getElementById("btn-quick-lead");
    if (APP_STATE.quickLeadTimer.isRunning) {
      clearInterval(APP_STATE.quickLeadTimer.intervalId);
      APP_STATE.quickLeadTimer.isRunning = false;
      if (btn) btn.textContent = "继续计时";
    } else {
      APP_STATE.quickLeadTimer.remainingSeconds = 60;
      APP_STATE.quickLeadTimer.isRunning = true;
      if (btn) btn.textContent = "倒计时 60s";
      playChime(523.25, "sine", 0.2);

      APP_STATE.quickLeadTimer.intervalId = setInterval(() => {
        if (APP_STATE.quickLeadTimer.remainingSeconds > 0) {
          APP_STATE.quickLeadTimer.remainingSeconds--;
          if (btn) btn.textContent = `倒计时 ${APP_STATE.quickLeadTimer.remainingSeconds}s`;
        } else {
          clearInterval(APP_STATE.quickLeadTimer.intervalId);
          APP_STATE.quickLeadTimer.isRunning = false;
          playChime(783.99, "triangle", 0.6);
          alert("⏱️ 60秒时间到！你的导入是否控制在1分钟以内了？导入讲得干脆利落，考官的第一印象就会非常好！");
          if (btn) btn.textContent = "再次练习 60s";
        }
      }, 1000);
    }
  };

  // ===================================================================
  // 2. 渲染教材课文库
  // ===================================================================

  function renderTextbooks() {
    const grid = document.getElementById("textbooks-lessons-grid");
    if (!grid || !window.TEXTBOOK_DB) return;

    let filtered = window.TEXTBOOK_DB.lessons.filter(l => {
      // 进度筛选
      const status = APP_STATE.userData.lessonStatus[l.fullId] || "unlearned";
      if (APP_STATE.selectedStatus !== "all" && status !== APP_STATE.selectedStatus) return false;

      // 册次筛选
      if (APP_STATE.selectedBookId !== "all" && l.grade !== APP_STATE.selectedBookId) return false;

      // 文体筛选
      if (APP_STATE.selectedGenre !== "all" && !l.genre.includes(APP_STATE.selectedGenre)) return false;

      // 优先级筛选
      if (APP_STATE.priorityFilter !== "all" && l.priority !== APP_STATE.priorityFilter) return false;

      // 收藏筛选
      if (APP_STATE.favoritesOnly && !APP_STATE.userData.favorites.includes(l.fullId)) return false;

      // 搜索关键词
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
          <p>暂无符合筛选条件的课文，请尝试清除搜索或调整文体/进度筛选。</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(l => createLessonCardHtml(l)).join("");
  }

  // 生成单张课文卡片 HTML
  function createLessonCardHtml(lesson) {
    const isFav = APP_STATE.userData.favorites.includes(lesson.fullId);
    const status = APP_STATE.userData.lessonStatus[lesson.fullId] || "unlearned";

    let statusBadge = `<span style="font-size:11.5px; color:var(--text-muted);">未学习</span>`;
    if (status === "learning") {
      statusBadge = `<span style="font-size:11.5px; color:var(--color-gold); font-weight:600;">📖 正在学</span>`;
    } else if (status === "completed") {
      statusBadge = `<span style="font-size:11.5px; color:var(--color-green-primary); font-weight:600;">✓ 已完成试讲</span>`;
    }

    return `
      <div class="lesson-card" onclick="openLessonWorkbench('${lesson.fullId}')">
        <div class="lesson-card-header">
          <div class="lesson-title-box">
            <h3>《${lesson.title}》</h3>
            <div class="lesson-author-tag">${lesson.gradeName} · 第${lesson.unitNumber}单元 · ${lesson.author}</div>
          </div>
          <span class="lesson-genre-pill">${lesson.genre}</span>
        </div>
        <div class="lesson-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size: 11px; color: var(--color-gold); font-weight:bold;">${lesson.priority} 常考</span>
            ${statusBadge}
          </div>
          <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 13px;">
            ${lesson.mainContent}
          </p>
          <div class="lesson-focus-preview">
            <strong>10分钟重点切片：</strong>${lesson.sampleFocus || lesson.interviewKeyPoint}
          </div>
        </div>
        <div class="lesson-card-footer" onclick="event.stopPropagation()">
          <a class="pdf-link-btn" href="${encodeURI(lesson.pdfFileName)}" target="_blank" title="打开教材原书第${lesson.page}页">
            📄 原书第${lesson.page}页
          </a>
          <div style="display:flex; gap:6px;">
            <button class="btn-academic" style="padding: 3px 8px; font-size:12px;" onclick="toggleFavorite('${lesson.fullId}'); event.stopPropagation();">
              ${isFav ? "★ 已收藏" : "☆ 收藏"}
            </button>
            <button class="btn-academic primary" style="padding: 3px 10px; font-size:12px;" onclick="openLessonWorkbench('${lesson.fullId}'); event.stopPropagation();">
              进入工作台 →
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

  // ===================================================================
  // 3. 考场备课与试讲演练 (Mock Exam)
  // ===================================================================

  window.setPrepDuration = function (mins) {
    APP_STATE.prepDurationMinutes = mins;
    document.getElementById("btn-prep-mode-10").classList.toggle("active", mins === 10);
    document.getElementById("btn-prep-mode-20").classList.toggle("active", mins === 20);
    resetPrepTimer();
  };

  window.startMockExamWithLesson = function (lessonId) {
    if (!window.TEXTBOOK_DB) return;
    const lesson = window.TEXTBOOK_DB.lessons.find(l => l.fullId === lessonId);
    if (!lesson) return;

    APP_STATE.selectedLesson = lesson;
    switchTab("mock-exam");

    // 填充教案纸抬头
    document.getElementById("exam-sheet-lesson-title").textContent = `《${lesson.title}》`;
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
      document.getElementById("sheet-input-targets").value = `1. 知识与能力目标：品读文中的重点词句与修辞手法（${lesson.sampleFocus ? lesson.sampleFocus.slice(0, 30) : ''}）\n2. 过程与方法目标：通过朗读品味与小组合作，学习从多角度描写景物/人物的方法\n3. 情感态度目标：体会作者的思想情感`;
      document.getElementById("sheet-input-points").value = `【教学重点】：抓住核心语段朗读品析（${lesson.sampleFocus ? lesson.sampleFocus.slice(0, 20) : ''}）\n【教学难点】：体会语言运用之精妙与深层情感`;
      document.getElementById("sheet-input-flow").value = `一、导入新课（约1分钟）：\n以日常生活经验或名言引出课题，顺势在黑板上板书《${lesson.title}》与作者。\n\n二、初读感知（约2分钟）：\n学生自由朗读课文，扫清字词，明确今天重点研读的核心段落。\n\n三、精读品析（约5分钟，重中之重）：\n主问题1：……（指名学生回答，复述学生答案并追问）\n主问题2：……（引导朗读重音与停连，板书核心词）\n\n四、课堂小结（约1分钟）：\n师生共同回顾黑板板书，升华主旨。\n\n五、布置作业（约1分钟）：\n布置分层特色作业，面向评委鞠躬致谢。`;
      document.getElementById("sheet-input-blackboard").value = `【课题】：${lesson.title}\n【主板书】：${lesson.teachingDesign ? lesson.teachingDesign.blackboardDesign.left : ''}\n【副板书】：重点字词、写作手法`;
    }

    resetPrepTimer();
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
      if (btn) btn.textContent = "继续备课计时";
    } else {
      APP_STATE.prepTimer.isRunning = true;
      if (btn) btn.textContent = "暂停计时";
      APP_STATE.prepTimer.intervalId = setInterval(() => {
        if (APP_STATE.prepTimer.remainingSeconds > 0) {
          APP_STATE.prepTimer.remainingSeconds--;
          updatePrepTimerDisplay();
          if (APP_STATE.prepTimer.remainingSeconds === 60) {
            playChime(440, "sine", 0.5);
            alert("⏰ 备课时间还剩最后 1 分钟！请抓紧整理板书设计与教学重点。");
          }
        } else {
          clearInterval(APP_STATE.prepTimer.intervalId);
          APP_STATE.prepTimer.isRunning = false;
          playChime(880, "triangle", 1.0);
          alert("🔔 备课时间已到！请整理教案纸，点击进入下方【开始10分钟试讲】开始开口练。");
          if (btn) btn.textContent = "开始备课倒计时";
        }
      }, 1000);
    }
  };

  window.resetPrepTimer = function () {
    clearInterval(APP_STATE.prepTimer.intervalId);
    APP_STATE.prepTimer.isRunning = false;
    APP_STATE.prepTimer.remainingSeconds = APP_STATE.prepDurationMinutes * 60;
    updatePrepTimerDisplay();
    const btn = document.getElementById("btn-prep-toggle");
    if (btn) btn.textContent = "开始备课倒计时";
  };

  // 试讲计时器与阶段指示
  function updateTeachTimerDisplay() {
    const el = document.getElementById("teach-timer-display");
    const phaseEl = document.getElementById("teach-current-phase-hint");
    const sec = APP_STATE.teachTimer.remainingSeconds;
    const elapsed = 10 * 60 - sec;

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
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【导入新课】（0-1分钟）<br><small style="color:var(--text-muted)">亲切问好，以生活体验或诗文引出课题，在黑板正上方写好课题和作者。</small>`;
      } else if (elapsed <= 150) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【初读感知】（1-2.5分钟）<br><small style="color:var(--text-muted)">自读扫清生字词，理清文章脉络，明确本节课重点研读哪个核心语段。</small>`;
      } else if (elapsed <= 450) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【精读品析·核心阵地】（2.5-7.5分钟，重中之重！）<br><small style="color:var(--color-green-primary); font-weight:bold;">核心主问题驱动，提问后停顿，指名学生回答并追问点拨，在黑板中间写核心词。</small>`;
      } else if (elapsed <= 540) {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【小结拓展】（7.5-9分钟）<br><small style="color:var(--text-muted)">由文及人升华主旨，结合黑板板书回顾重点内容。</small>`;
      } else {
        phaseEl.innerHTML = `📍 <strong>当前阶段：</strong>【布置作业与下课】（9-10分钟）<br><small style="color:var(--text-muted)">布置分层特色作业，面向评委席微笑鞠躬致谢，从容结课。</small>`;
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

          if (APP_STATE.teachTimer.remainingSeconds === 5 * 60) {
            playChime(523.25, "sine", 0.4); // 5分钟过半
          } else if (APP_STATE.teachTimer.remainingSeconds === 60) {
            playChime(659.25, "sine", 0.6); // 剩1分钟
          }
        } else {
          clearInterval(APP_STATE.teachTimer.intervalId);
          APP_STATE.teachTimer.isRunning = false;
          playChime(987.77, "triangle", 1.2);
          alert("🏁 10分钟试讲时间到！请向考官鞠躬致谢：‘各位评委老师，我的试讲完毕，谢谢老师！’");
          if (btn) btn.textContent = "开始10分钟试讲";
          APP_STATE.userData.examCount = (APP_STATE.userData.examCount || 0) + 1;
          
          if (APP_STATE.selectedLesson) {
            APP_STATE.userData.lessonStatus[APP_STATE.selectedLesson.fullId] = "completed";
          }
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
    alert(`🎉 《${APP_STATE.selectedLesson.title}》简案已成功保存在本地浏览器！`);
  };

  window.compareStandardPlan = function () {
    if (!APP_STATE.selectedLesson) {
      alert("请先选择一篇课文！");
      return;
    }
    openLessonWorkbench(APP_STATE.selectedLesson.fullId);
  };

  // ===================================================================
  // 4. 分阶段试讲反馈与真实表达诊断 (Sparring)
  // ===================================================================

  window.sendTeacherLine = function (customText) {
    const input = document.getElementById("sparring-user-input");
    const text = customText || (input ? input.value.trim() : "");
    if (!text) return;

    if (input) input.value = "";

    appendDialogue("teacher", "执教老师（我）", text);

    setTimeout(() => {
      generateStudentResponse(text);
    }, 800);
  };

  function appendDialogue(sender, name, content) {
    const stream = document.getElementById("sparring-dialogue-stream");
    if (!stream) return;

    const div = document.createElement("div");
    div.className = "dialogue-item";
    div.innerHTML = `
      <span class="dialogue-role-badge ${sender}">${name}</span>
      <div class="dialogue-bubble ${sender}">${content}</div>
    `;
    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
  }

  function generateStudentResponse(teacherPrompt) {
    let studentResponses = [];

    if (teacherPrompt.includes("读") || teacherPrompt.includes("朗读")) {
      studentResponses = [
        {
          name: "全班同学",
          content: "（全班整齐放声朗读，声音洪亮，在读到关键动词时稍作了停顿，语调富有起伏。）"
        },
        {
          name: "课代表小林",
          content: "老师，读完这一段，我发现这个词应该读重音，因为这里最能表现作者当时的激动心情！"
        }
      ];
    } else if (teacherPrompt.includes("词") || teacherPrompt.includes("修辞") || teacherPrompt.includes("比喻") || teacherPrompt.includes("拟人")) {
      studentResponses = [
        {
          name: "学生小赵",
          content: "老师，我圈画了文中的这一句！这里运用了修辞手法，把景物赋予了人的情态，非常生动！"
        }
      ];
    } else if (teacherPrompt.includes("为什么") || teacherPrompt.includes("情感") || teacherPrompt.includes("怎么理解")) {
      studentResponses = [
        {
          name: "学生小明",
          content: "老师，我觉得作者在这里并不是单纯在写眼前的事物，而是借景抒情，寄托了对生活的热爱！"
        }
      ];
    } else {
      studentResponses = [
        {
          name: "学生小红",
          content: "老师，我赞成刚才同学的看法，而且我发现这个地方用的动词非常特别！"
        }
      ];
    }

    studentResponses.forEach((res, i) => {
      setTimeout(() => {
        appendDialogue("student", res.name, res.content);
        playChime(523.25, "sine", 0.15);
      }, i * 500);
    });

    setTimeout(() => {
      evaluateTeacherDialogue(teacherPrompt);
    }, studentResponses.length * 500 + 300);
  }

  // 针对教师台词输出接地气、尖锐具体的指导
  function evaluateTeacherDialogue(prompt) {
    const reportBox = document.getElementById("sparring-eval-report");
    if (!reportBox) return;

    const tips = [];
    let positiveCount = 0;

    // 检查口头禅
    if (prompt.includes("那么") || prompt.includes("然后") || prompt.includes("就是说")) {
      tips.push("⚠️ <strong>语言精练度：</strong>注意口头禅（如‘那么’、‘然后’）。正式试讲时直接说‘请大家看第3段’比‘那么我们来看第3段’听起来更沉稳从容。");
    } else {
      positiveCount++;
      tips.push("✓ <strong>语言精练度：</strong>没有多余口头拖音，表达干净利落。");
    }

    // 检查是否有启发提问
    if (prompt.includes("为什么") || prompt.includes("结合") || prompt.includes("怎么看") || prompt.includes("哪位同学")) {
      positiveCount++;
      tips.push("✓ <strong>启发性：</strong>问题指向明确，给学生留出了思考与表达的空间。");
    } else {
      tips.push("⚠️ <strong>启发性：</strong>当前更像单向发号施令。试着在提问后接一句：‘作者为什么这样写？大家先同桌交流30秒’。");
    }

    // 检查亲和力
    if (prompt.includes("同学") || prompt.includes("请") || prompt.includes("大家")) {
      positiveCount++;
      tips.push("✓ <strong>亲和力与教态：</strong>语气温和亲切，符合真实初中语文课堂师生氛围。");
    } else {
      tips.push("⚠️ <strong>亲和力与教态：</strong>建议多使用‘同学们’、‘请坐’等课堂规范口语，增加与考官假想学生的互动感。");
    }

    reportBox.innerHTML = `
      <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
        <div style="font-weight:700; color:var(--text-primary); margin-bottom:10px; font-size:15px;">
          👨‍🏫 备考老师给你的现场改进建议：
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:13.5px; line-height:1.65;">
          ${tips.map(t => `<div>${t}</div>`).join("")}
        </div>
      </div>
    `;

    APP_STATE.userData.sparringCount = (APP_STATE.userData.sparringCount || 0) + 1;
    saveUserData();
  }

  // ===================================================================
  // 5. 渲染常用表达、课型突破、结构化、答辩、规划、教案
  // ===================================================================

  function renderTemplates() {
    const container = document.getElementById("templates-scripts-container");
    if (!container || !window.TEMPLATES_DB) return;
    const s = window.TEMPLATES_DB.teacherScripts;

    container.innerHTML = `
      <div class="academic-card">
        <h4 class="card-title">一、新课导入常用口语示范（0-1分钟）</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
          ${s.leadIn.map(item => `
            <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
              <div style="font-weight:bold; color:var(--color-green-primary); margin-bottom:4px; font-size:14.5px;">${item.type}</div>
              <div style="font-size:12.5px; color:var(--color-gold); margin-bottom:8px;">【思路】：${item.formula}</div>
              <div style="font-size:13.5px; line-height:1.65; background:#FFFFFF; padding:12px; border-radius:var(--radius-sm); border-left:3px solid var(--color-green-primary); margin-bottom:10px;">
                ${item.script}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11.5px; color:var(--text-muted);">适用：${item.applicableGenres.join(" / ")}</span>
                <button class="btn-academic" style="padding:2px 8px; font-size:11.5px;" onclick="navigator.clipboard.writeText('${item.script.replace(/'/g, "\\'")}'); alert('已复制到剪贴板！');">复制台词</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="academic-card">
        <h4 class="card-title">二、课堂提问与启发追问技巧（告别“很好请坐”）</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
          ${s.probing.map(item => `
            <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
              <div style="font-weight:bold; color:var(--color-green-primary); margin-bottom:6px; font-size:14.5px;">💡 ${item.strategy}</div>
              <div style="font-size:13.5px; line-height:1.65; background:#FFFFFF; padding:12px; border-radius:var(--radius-sm); border-left:3px solid var(--color-gold);">
                ${item.script}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const genreContainer = document.getElementById("genre-blueprints-container");
    if (genreContainer && window.TEMPLATES_DB) {
      genreContainer.innerHTML = window.TEMPLATES_DB.genreBlueprints.map(g => `
        <div class="academic-card" style="margin-bottom:20px;">
          <div class="card-title">
            <span style="font-size:17px; color:var(--color-green-primary); font-weight:bold;">${g.genre} 10分钟试讲突破方案</span>
            <span class="pill-badge green" style="font-size:12px;">核心文体</span>
          </div>
          <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:14px; border-left:4px solid var(--color-green-primary);">
            <strong>核心原则：</strong>${g.corePrinciple}
          </div>
          
          <h5 style="font-size:14px; font-weight:bold; margin-bottom:8px; color:var(--text-primary);">⏱ 10分钟时间分配建议：</h5>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:13px; margin-bottom:14px;">
            ${Object.entries(g.timeAllocation).map(([t, desc]) => `
              <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); padding:10px; border-radius:4px;">
                <strong style="color:var(--color-green-primary);">${t}</strong>
                <p style="font-size:12px; margin-top:4px; color:var(--text-secondary);">${desc}</p>
              </div>
            `).join("")}
          </div>

          <h5 style="font-size:14px; font-weight:bold; margin-bottom:6px; color:var(--text-primary);">🎯 重点抓手与取舍技巧：</h5>
          <ul style="padding-left:20px; font-size:13px; color:var(--text-secondary); line-height:1.8;">
            ${g.keySkills.map(k => `<li>${k}</li>`).join("")}
          </ul>
          
          <div style="margin-top:12px; font-size:12px; color:var(--text-muted);">
            <strong>代表课文：</strong>${g.representativeLessons.join("、")}
          </div>
        </div>
      `).join("");
    }
  }

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
            this.textContent = isHidden ? '收起示范回答' : '查看示范回答';
          ">
            查看示范回答
          </button>
        </div>
      </div>
    `).join("");
  }

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
        </div>
      `).join("");
    }

    if (checklist && window.STUDY_PLAN_DB) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayTasks = APP_STATE.userData.dailyTasks[todayStr] || {};

      checklist.innerHTML = `
        <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; color:var(--text-muted);">今日打卡日期：<strong>${todayStr}</strong></span>
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
    }
  }

  window.toggleDailyTask = function (taskId, isChecked) {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!APP_STATE.userData.dailyTasks[todayStr]) {
      APP_STATE.userData.dailyTasks[todayStr] = {};
    }
    APP_STATE.userData.dailyTasks[todayStr][taskId] = isChecked;
    saveUserData();
    if (isChecked) playChime(783.99, "sine", 0.2);
  };

  function renderSavedPlans() {
    const plansContainer = document.getElementById("saved-plans-container");
    const favsContainer = document.getElementById("saved-favs-container");

    if (plansContainer) {
      const plans = Object.values(APP_STATE.userData.myLessonPlans);
      if (plans.length === 0) {
        plansContainer.innerHTML = `
          <div style="text-align:center; padding:32px; color:var(--text-muted);">
            暂无自写教案。在任一课文工作台或考场模拟中点击“保存我的简案”即可在此查阅。
          </div>
        `;
      } else {
        plansContainer.innerHTML = plans.map(p => `
          <div class="academic-card" style="margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <h4 style="font-family:var(--font-serif); font-size:16px; font-weight:bold; color:var(--text-primary);">
                《${p.lessonTitle}》10分钟简案
              </h4>
              <span style="font-size:12px; color:var(--text-muted);">${p.updatedAt || ""}</span>
            </div>
            <p style="font-size:13px; color:var(--text-secondary); white-space:pre-line; max-height:100px; overflow:hidden; text-overflow:ellipsis;">
              ${p.targets || ""}
            </p>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px; border-top:1px solid var(--border-subtle); padding-top:8px;">
              <button class="btn-academic" onclick="startMockExamWithLesson('${p.lessonId}')">去考场继续练</button>
              <button class="btn-academic" onclick="deleteLessonPlan('${p.lessonId}')" style="color:#C0392B;">删除</button>
            </div>
          </div>
        `).join("");
      }
    }

    if (favsContainer && window.TEXTBOOK_DB) {
      const favLessons = window.TEXTBOOK_DB.lessons.filter(l => APP_STATE.userData.favorites.includes(l.fullId));
      if (favLessons.length === 0) {
        favsContainer.innerHTML = `<div style="text-align:center; padding:32px; color:var(--text-muted);">暂无收藏课文。在课文库点击“☆ 收藏”添加。</div>`;
      } else {
        favsContainer.innerHTML = favLessons.map(l => createLessonCardHtml(l)).join("");
      }
    }
  }

  window.deleteLessonPlan = function (lessonId) {
    if (confirm("确定要删除这篇自写教案草稿吗？")) {
      delete APP_STATE.userData.myLessonPlans[lessonId];
      saveUserData();
      renderSavedPlans();
    }
  };

  // 绑定事件
  function bindEvents() {
    const searchInput = document.getElementById("textbook-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        APP_STATE.searchKeyword = e.target.value.trim();
        renderTextbooks();
      });
    }

    // 进度状态筛选
    document.querySelectorAll(".chip-status").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-status").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedStatus = btn.dataset.status;
        renderTextbooks();
      });
    });

    // 册次筛选
    document.querySelectorAll(".chip-book").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-book").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedBookId = btn.dataset.book;
        // 同步侧边栏
        document.querySelectorAll(".sidebar-subnav-item").forEach(item => {
          item.classList.toggle("active", item.id === `subnav-${btn.dataset.book}`);
        });
        renderTextbooks();
      });
    });

    // 文体筛选
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

    // 收藏切换
    const favOnlyBtn = document.getElementById("btn-toggle-fav-filter");
    if (favOnlyBtn) {
      favOnlyBtn.addEventListener("click", () => {
        APP_STATE.favoritesOnly = !APP_STATE.favoritesOnly;
        favOnlyBtn.classList.toggle("active", APP_STATE.favoritesOnly);
        favOnlyBtn.textContent = APP_STATE.favoritesOnly ? "★ 仅看收藏已开启" : "☆ 仅看收藏";
        renderTextbooks();
      });
    }

    // 陪练快速话术
    document.querySelectorAll(".quick-spar-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.prompt;
        sendTeacherLine(text);
      });
    });
  }

})();
