/**
 * 初中语文教师资格证面试备课与试讲训练 · 核心引擎 (app.js)
 * 纯前端驱动、真实学习路径优先、彻底去除宣传口号、说人话做实事
 */

(function () {
  "use strict";

  // 全局应用状态
  const APP_STATE = {
    currentTab: "home",
    selectedLesson: null,
    currentWizardStep: 1, // 1~7 步骤
    currentReaderView: "text", // text | pdf
    readerFontSize: "font-md",

    selectedBookId: "all",
    selectedGenre: "all",
    selectedStatus: "all",
    searchKeyword: "",
    favoritesOnly: false,

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

    // 提示模式当前步
    promptCurrentIndex: 0,

    // 本地持久化数据
    userData: {
      favorites: [],
      lessonProgress: {}, // { [lessonId]: { read: true, designed: true, teachTries: 1 } }
      lessonStatus: {},   // { [lessonId]: 'unlearned' | 'learning' | 'completed' }
      myLessonPlans: {},
      examCount: 0,
      sparringCount: 0,
      todayChecklist: [false, false, false, false, false]
    }
  };

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
      console.warn("Audio warning:", e);
    }
  }

  // 本地存储
  const STORAGE_KEY = "CHINESE_TEACHER_APP_DATA_V3";
  function loadUserData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("CHINESE_TEACHER_APP_DATA_V2");
      if (saved) {
        APP_STATE.userData = Object.assign(APP_STATE.userData, JSON.parse(saved));
        if (!APP_STATE.userData.lessonProgress) APP_STATE.userData.lessonProgress = {};
        if (!APP_STATE.userData.lessonStatus) APP_STATE.userData.lessonStatus = {};
        if (!APP_STATE.userData.todayChecklist) APP_STATE.userData.todayChecklist = [false, false, false, false, false];
      }
    } catch (e) {
      console.error("Failed to load storage:", e);
    }
  }

  function saveUserData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE.userData));
      updateGlobalBadges();
    } catch (e) {
      console.error("Failed to save storage:", e);
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function getDaysToExam() {
    const now = new Date();
    const diffTime = EXAM_TARGET_DATE - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // DOM 就绪启动
  document.addEventListener("DOMContentLoaded", () => {
    loadUserData();
    initUI();
    renderDashboard();
    renderTextbooks();
    renderStructured();
    renderDefense();
    renderStudyPlan();
    renderSavedPlans();
    bindEvents();
  });

  function initUI() {
    const days = getDaysToExam();
    const badge = document.getElementById("exam-countdown-badge");
    if (badge) badge.innerHTML = `<span>⏳ 距12月面试还有</span><strong>${days}</strong><span>天</span>`;
    updateGlobalBadges();
  }

  function updateGlobalBadges() {
    const favCount = APP_STATE.userData.favorites.length;
    const examCount = APP_STATE.userData.examCount || 0;
    const favBadge = document.getElementById("header-fav-badge");
    if (favBadge) favBadge.textContent = `${favCount} 篇收藏`;
    const examBadge = document.getElementById("header-exam-badge");
    if (examBadge) examBadge.textContent = `${examCount} 次试讲`;
  }

  // 移动端抽屉导航
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

  const TAB_TITLE_MAP = {
    "home": "今天学什么",
    "workbench": "课文备课工作台",
    "textbooks": "统编六册课文库",
    "teach-modes": "试讲训练 (四模式)",
    "sparring": "师生互动练习",
    "mock-exam": "教学设计草稿",
    "structured": "结构化问答",
    "defense": "考官答辩",
    "study-plan": "备考排期",
    "saved": "我的教案与收藏"
  };

  window.switchTab = function (tabName) {
    APP_STATE.currentTab = tabName;
    closeMobileSidebar();

    document.querySelectorAll(".sidebar-nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    document.querySelectorAll(".tab-view").forEach(view => {
      view.classList.toggle("active", view.id === `tab-view-${tabName}`);
    });

    const titleEl = document.getElementById("current-view-title");
    if (titleEl) titleEl.textContent = TAB_TITLE_MAP[tabName] || "备考学习";

    if (tabName === "home") renderDashboard();
    if (tabName === "textbooks") renderTextbooks();
    if (tabName === "saved") renderSavedPlans();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.selectSidebarBook = function (bookId) {
    APP_STATE.selectedBookId = bookId;
    document.querySelectorAll(".sidebar-subnav-item").forEach(item => {
      item.classList.toggle("active", item.id === `subnav-${bookId}`);
    });
    document.querySelectorAll(".chip-book").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.book === bookId);
    });
    renderTextbooks();
  };

  // 1. 首页逻辑
  function renderDashboard() {
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

  window.startRandomExamSimulation = function () {
    if (!window.TEXTBOOK_DB || !window.TEXTBOOK_DB.lessons) return;
    const highFreqs = window.TEXTBOOK_DB.lessons.filter(l => l.priority === "★★★★★");
    const pool = highFreqs.length > 0 ? highFreqs : window.TEXTBOOK_DB.lessons;
    const randomLesson = pool[Math.floor(Math.random() * pool.length)];

    if (confirm(`🎲 考场电脑抽题完毕！\n\n您抽到的面试题目为：\n《${randomLesson.title}》（${randomLesson.author} · ${randomLesson.gradeName}）\n\n是否立即进入考场备课？`)) {
      startMockExamWithLesson(randomLesson.fullId);
    }
  };

  // ===================================================================
  // 核心：单篇课文步进式学习工作台 (Step-by-step Guided Workbench)
  // ===================================================================

  window.openLessonWorkbench = function (lessonId, initialStep = 1) {
    if (!window.TEXTBOOK_DB) return;
    const lesson = window.TEXTBOOK_DB.lessons.find(l => l.fullId === lessonId);
    if (!lesson) return;

    APP_STATE.selectedLesson = lesson;
    APP_STATE.currentWizardStep = initialStep;
    APP_STATE.currentReaderView = "text";

    // 标记为正在学
    if (!APP_STATE.userData.lessonStatus[lessonId] || APP_STATE.userData.lessonStatus[lessonId] === "unlearned") {
      APP_STATE.userData.lessonStatus[lessonId] = "learning";
      saveUserData();
    }

    const container = document.getElementById("workbench-container");
    if (!container) return;

    switchTab("workbench");
    const titleEl = document.getElementById("current-view-title");
    if (titleEl) titleEl.textContent = `《${lesson.title}》· 备课与试讲`;

    // 读取该课课文正文与PDF页码
    const textData = window.LESSON_TEXTS_DB && window.LESSON_TEXTS_DB[lesson.fullId] 
      ? window.LESSON_TEXTS_DB[lesson.fullId] 
      : (window.getLessonTextContent ? window.getLessonTextContent(lesson.fullId) : null);

    const pdfPage = textData && textData.pdfPage ? textData.pdfPage : (lesson.page + 7);
    const pdfUrl = encodeURI(lesson.pdfFileName) + `#page=${pdfPage}`;

    const isFav = APP_STATE.userData.favorites.includes(lesson.fullId);

    // 渲染工作台主结构
    container.innerHTML = `
      <!-- 课文头部与返回 -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <button class="btn-academic" onclick="switchTab('textbooks')">← 选其他课文</button>
          <h2 style="font-family:var(--font-serif); font-size:20px; font-weight:700;">《${lesson.title}》</h2>
          <span style="font-size:13px; color:var(--text-muted);">${lesson.author} · ${lesson.gradeName} · ${lesson.genre}</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-academic" onclick="toggleFavorite('${lesson.fullId}'); this.textContent = APP_STATE.userData.favorites.includes('${lesson.fullId}') ? '★ 已收藏' : '☆ 收藏';">
            ${isFav ? "★ 已收藏" : "☆ 收藏"}
          </button>
          <button class="btn-academic primary" onclick="startMockExamWithLesson('${lesson.fullId}')">
            去考场模拟 ⏱️
          </button>
        </div>
      </div>

      <!-- 步骤导航向导条 (Step Wizard Bar) -->
      <div class="step-wizard-bar">
        <button class="wizard-step-btn ${initialStep === 1 ? 'active' : ''}" id="wbtn-1" onclick="switchWizardStep(1)">
          <span class="step-idx">1</span> 读课文原文
        </button>
        <button class="wizard-step-btn ${initialStep === 2 ? 'active' : ''}" id="wbtn-2" onclick="switchWizardStep(2)">
          <span class="step-idx">2</span> 搞懂主要内容
        </button>
        <button class="wizard-step-btn ${initialStep === 3 ? 'active' : ''}" id="wbtn-3" onclick="switchWizardStep(3)">
          <span class="step-idx">3</span> 选出10分钟重点
        </button>
        <button class="wizard-step-btn ${initialStep === 4 ? 'active' : ''}" id="wbtn-4" onclick="switchWizardStep(4)">
          <span class="step-idx">4</span> 确定这节课教什么
        </button>
        <button class="wizard-step-btn ${initialStep === 5 ? 'active' : ''}" id="wbtn-5" onclick="switchWizardStep(5)">
          <span class="step-idx">5</span> 课堂师生怎么说
        </button>
        <button class="wizard-step-btn ${initialStep === 6 ? 'active' : ''}" id="wbtn-6" onclick="switchWizardStep(6)">
          <span class="step-idx">6</span> 整理草稿与板书
        </button>
        <button class="wizard-step-btn ${initialStep === 7 ? 'active' : ''}" id="wbtn-7" onclick="switchWizardStep(7)">
          <span class="step-idx">7</span> 试讲练习 (4模式)
        </button>
      </div>

      <!-- 步骤 1：读课文 (双重视图：纯净正文 + 原版PDF嵌入) -->
      <div class="wizard-stage-content ${initialStep === 1 ? 'active' : ''}" id="wstage-1">
        <div class="academic-card">
          <div class="card-title">
            <span>第一步：在网页内通读课文（先别急着备课，先看课文写了什么）</span>
            <div class="reader-view-tabs">
              <button class="reader-view-tab active" id="rv-tab-text" onclick="switchReaderView('text')">📝 纯净正文阅读</button>
              <button class="reader-view-tab" id="rv-tab-pdf" onclick="switchReaderView('pdf')">📄 教材原版PDF对照（第${lesson.page}页）</button>
            </div>
          </div>

          <!-- 视图 A：纯净正文 -->
          <div id="reader-view-text-panel">
            <div class="reader-box">
              <div style="text-align:center; margin-bottom:16px;">
                <h3 style="font-family:var(--font-serif); font-size:20px; font-weight:700;">${lesson.title}</h3>
                <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${lesson.author}</div>
              </div>
              ${renderLessonTextHtml(textData, lesson)}
            </div>
          </div>

          <!-- 视图 B：内置教材原版 PDF 嵌入 -->
          <div id="reader-view-pdf-panel" style="display:none;">
            <div class="embedded-pdf-wrapper">
              <iframe src="${pdfUrl}" class="embedded-pdf-iframe" title="教材原版PDF预览"></iframe>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:6px;">
              💡 提示：如部分浏览器对本地嵌入 PDF 有拦截，可直接点击工具栏或查看纯净文本。
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:16px;">
            <button class="btn-academic primary" onclick="switchWizardStep(2)">
              我已经读完课文了，下一步：搞懂内容 →
            </button>
          </div>
        </div>
      </div>

      <!-- 步骤 2：读懂它 (用一句话概括) -->
      <div class="wizard-stage-content ${initialStep === 2 ? 'active' : ''}" id="wstage-2">
        <div class="academic-card">
          <h3 class="card-title">第二步：用一句话说说这篇课文主要写了什么？</h3>
          <p style="font-size:13.5px; color:var(--text-secondary); line-height:1.6;">
            不要把问题想得太复杂。先试着用你自己的话说一说：
          </p>

          <div class="think-box">
            <label style="font-weight:600; font-size:13px;">请先自己想想并试着写一句：</label>
            <textarea rows="3" placeholder="例如：这篇文章主要写了作者在春天看到的……，表达了作者对……"></textarea>
            <button class="tip-reveal-btn" onclick="toggleTipReveal('tip-content-2')">
              👉 点我看老师是怎么概括的
            </button>
            <div class="tip-reveal-content" id="tip-content-2">
              <strong>老师的简明概括：</strong><br>
              ${lesson.mainContent}<br><br>
              <strong>为什么写这篇课文：</strong>${lesson.emotion}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="btn-academic" onclick="switchWizardStep(1)">← 上一步：重读课文</button>
            <button class="btn-academic primary" onclick="switchWizardStep(3)">下一步：确定10分钟讲哪里 →</button>
          </div>
        </div>
      </div>

      <!-- 步骤 3：选重点 (10分钟讲什么 vs 绝对不讲什么) -->
      <div class="wizard-stage-content ${initialStep === 3 ? 'active' : ''}" id="wstage-3">
        <div class="academic-card">
          <h3 class="card-title">第三步：10分钟到底讲哪里？（极关键，严禁贪多！）</h3>
          <p style="font-size:14px; color:var(--text-secondary); line-height:1.7;">
            很多考生第一次试讲挂科，就是因为<strong>“试图在10分钟里把整篇课文从头讲到尾”</strong>。考官只要听前3分钟，发现你讲不完，就会直接扣分。必须学会取舍：
          </p>

          <div class="tradeoff-box-yes">
            <div style="font-weight:700; margin-bottom:4px;">✅ 10分钟只讲这一个核心切片：</div>
            <div>${lesson.sampleFocus || lesson.interviewKeyPoint}</div>
            <div style="margin-top:6px; font-size:12.5px; color:#1F452E;">
              <strong>为什么选这里？</strong>因为这一段修辞最丰富、动词最传神，最容易带假想学生开展“指名朗读、品味关键词、顺势追问”。
            </div>
          </div>

          <div class="tradeoff-box-no">
            <div style="font-weight:700; margin-bottom:4px;">❌ 10分钟绝对不要讲什么（避坑清醒剂）：</div>
            <div>${getLessonNotToTeachWarning(lesson)}</div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="btn-academic" onclick="switchWizardStep(2)">← 上一步</button>
            <button class="btn-academic primary" onclick="switchWizardStep(4)">下一步：确定教学目标 →</button>
          </div>
        </div>
      </div>

      <!-- 步骤 4：定目标 (用大白话说，先别背套话) -->
      <div class="wizard-stage-content ${initialStep === 4 ? 'active' : ''}" id="wstage-4">
        <div class="academic-card">
          <h3 class="card-title">第四步：这节课你想让学生学会什么？</h3>
          <p style="font-size:14px; color:var(--text-secondary); line-height:1.7;">
            很多同学一看到“三维教学目标”就头大。先别去死记那些专业大词，用平时说话的方式想一想：<strong>“讲完这10分钟，学生下课能带走哪两个具体收获？”</strong>
          </p>

          <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:16px; margin:14px 0; font-size:14px; line-height:1.8;">
            <div>
              <strong>① 语言知识上（教学生品析）：</strong><br>
              ${lesson.teachingDesign.targets.knowledge}
            </div>
            <div style="margin-top:10px;">
              <strong>② 思想情感上（带学生体会）：</strong><br>
              ${lesson.teachingDesign.targets.emotion}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="btn-academic" onclick="switchWizardStep(3)">← 上一步</button>
            <button class="btn-academic primary" onclick="switchWizardStep(5)">下一步：看看老师怎么说台词 →</button>
          </div>
        </div>
      </div>

      <!-- 步骤 5：师生对话与台词示范 (自然、接地气) -->
      <div class="wizard-stage-content ${initialStep === 5 ? 'active' : ''}" id="wstage-5">
        <div class="academic-card">
          <h3 class="card-title">第五步：老师到底应该怎么说？（真实口语台词示范）</h3>
          <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:12px;">
            别讲得像在读论文！照着下面的话念出声，看看有亲和力的语文老师是怎么说话的：
          </p>

          <div class="classroom-dialogue-block">
            <!-- 导入台词 -->
            <div class="speech-bubble teacher">
              <strong>【开场导入（1分钟内结束）】</strong><br>
              “同学们好，请坐！上课前，大家先回忆一下，平时在你眼里，春天是什么样子的？……有同学说鸟语花香、天气暖和。那在著名作家朱自清先生的笔下，春天又是怎样的风貌呢？今天，我们就一起翻开课本第2页，走进课文《${lesson.title}》。（顺手在黑板正上方写下课题和作者）”
            </div>

            <!-- 第一个问题 -->
            <div class="speech-bubble teacher">
              <strong>【提出核心主问题（千万别问太大）】</strong><br>
              “请同学们自由大声朗读第4段，圈画出作者描写春花时用到的颜色词和比喻句。注意思考：这些词句好在哪里？”
              <div style="font-size:12px; color:var(--color-gold); margin-top:4px;">
                💡 为什么这么问？如果直接问‘大家觉得春花美不美’，学生只会答‘美’，没法接话；问具体颜色和修辞，学生才能翻课本找依据。
              </div>
            </div>

            <!-- 学生4种反应与老师怎么接 -->
            <div style="margin-top:8px;">
              <h4 style="font-size:14px; font-weight:bold; color:var(--text-primary); margin-bottom:8px;">
                👨‍🎓 模拟学生4种不同回答，你该怎么接？
              </h4>

              <!-- 场景A：答得很好 -->
              <div class="speech-bubble student" style="margin-bottom:8px;">
                <strong>情况 A：学生回答完全正确</strong><br>
                学生小明：“老师，我找到了‘红的像火，粉的像霞，白的像雪’，这里用了排比和比喻，写出了花很多很艳！”<br>
                <div style="margin-top:6px; color:var(--color-green-primary); font-weight:600;">
                  老师接话示范：“小明找得真准确，请坐！大家看这三个比喻，不仅写出了色彩的丰富，还按照由浓到淡的视觉层次来写。那老师再追问一句……”
                </div>
              </div>

              <!-- 场景B：答得比较浅/只有半句 -->
              <div class="speech-bubble student" style="margin-bottom:8px;">
                <strong>情况 B：学生回答很短/只有半句</strong><br>
                学生小华：“老师，我觉得‘闹’这个字写得好。”<br>
                <div style="margin-top:6px; color:var(--color-green-primary); font-weight:600;">
                  老师接话示范：“小华有一双善于发现细节的眼睛！‘闹’字确实是点睛之笔。那老师想请问，明明是在写蜜蜂的声音，为什么作者不用‘叫’，而要用‘闹’呢？同桌之间讨论一下……”
                </div>
              </div>

              <!-- 场景C：答非所问或有些走偏 -->
              <div class="speech-bubble student">
                <strong>情况 C：学生答偏了</strong><br>
                学生小军：“老师，我觉得是因为春天有蜜蜂可以采蜂蜜吃。”<br>
                <div style="margin-top:6px; color:var(--color-green-primary); font-weight:600;">
                  老师接话示范：“小军同学非常热爱生活，还想到了香甜的蜂蜜！不过我们再仔细看看原文，满树的桃花和嗡嗡的蜜蜂，是不是把原本安静的春天写得像过节一样热闹？这就叫‘化静为动’……”
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="btn-academic" onclick="switchWizardStep(4)">← 上一步</button>
            <button class="btn-academic primary" onclick="switchWizardStep(6)">下一步：整理简案与板书 →</button>
          </div>
        </div>
      </div>

      <!-- 步骤 6：写简案与板书 -->
      <div class="wizard-stage-content ${initialStep === 6 ? 'active' : ''}" id="wstage-6">
        <div class="academic-card">
          <h3 class="card-title">第六步：黑板板书与草稿纸怎么写？</h3>
          <p style="font-size:14px; color:var(--text-secondary); line-height:1.7;">
            草稿纸只是提纲，字迹工整、自己看得清即可。黑板板书按“左脉络、中重点、右主旨”布局：
          </p>

          <div class="blackboard-view">
            <div style="text-align:center; font-size:18px; margin-bottom:12px; color:var(--color-chalk-yellow);">
              《${lesson.title}》 ${lesson.author}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">
              <div>
                <div style="color:var(--color-chalk-yellow); margin-bottom:4px;">【整体图景】</div>
                <div>春草图 · 萌发<br>春花图 · 争艳<br>春风图 · 和煦</div>
              </div>
              <div style="border-left:1px dashed rgba(255,255,255,0.2); border-right:1px dashed rgba(255,255,255,0.2); padding:0 10px;">
                <div style="color:var(--color-chalk-yellow); margin-bottom:4px;">【春花图品析】</div>
                <div>色：火、霞、雪（比喻）<br>态：你不让我我不让你（拟人）<br>声：嗡嗡地闹着（以动写静）</div>
              </div>
              <div>
                <div style="color:var(--color-chalk-yellow); margin-bottom:4px;">【情感升华】</div>
                <div>赞美生机<br>向往希望</div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:16px;">
            <button class="btn-academic" onclick="switchWizardStep(5)">← 上一步</button>
            <button class="btn-academic primary" onclick="switchWizardStep(7)">最后一步：去试讲训练 🚀</button>
          </div>
        </div>
      </div>

      <!-- 步骤 7：四种试讲模式 (实战开口) -->
      <div class="wizard-stage-content ${initialStep === 7 ? 'active' : ''}" id="wstage-7">
        <div class="academic-card">
          <h3 class="card-title">第七步：开口试讲！选择最适合你当前水平的模式</h3>
          <p style="font-size:14px; color:var(--text-secondary); line-height:1.7;">
            别怕卡壳，每一个优秀的老师都是从磕磕绊绊念稿子开始的。循序渐进练习：
          </p>

          <div class="teach-modes-grid">
            <div class="teach-mode-card" style="border-top:3px solid var(--color-green-primary);" onclick="startFollowAlongMode()">
              <div class="mode-name">① 跟练模式（有提示，跟着读）</div>
              <div class="mode-desc">屏幕显示一段示范台词，你大声念一段，先习惯把自己的声音放出来。</div>
              <button class="btn-academic primary" style="font-size:12.5px;">开始大声跟读 →</button>
            </div>

            <div class="teach-mode-card" style="border-top:3px solid var(--color-gold);" onclick="startPromptMode()">
              <div class="mode-name">② 提示模式（卡住点一下提示）</div>
              <div class="mode-desc">自己试着讲，讲到一半卡壳时点击【提示我】，老教师给你提个醒。</div>
              <button class="btn-academic" style="font-size:12.5px;">开始提示练习 →</button>
            </div>

            <div class="teach-mode-card" style="border-top:3px solid var(--color-blue);" onclick="startIndependentMode()">
              <div class="mode-name">③ 独立练习（10分钟只计时）</div>
              <div class="mode-desc">面对镜子或屏幕，不看任何提示，自己从头讲到尾，测试时间控制。</div>
              <button class="btn-academic" style="font-size:12.5px;">进入10分钟计时 →</button>
            </div>

            <div class="teach-mode-card" style="border-top:3px solid var(--color-red);" onclick="startMockExamWithLesson('${lesson.fullId}')">
              <div class="mode-name">④ 考场模拟（备课+试讲+答辩）</div>
              <div class="mode-desc">完整25分钟考场实战，检验手写简案与从容试讲的综合水平。</div>
              <button class="btn-academic gold" style="font-size:12.5px;">进入考场全流程 →</button>
            </div>
          </div>

          <!-- 跟练/提示交互区域 -->
          <div id="interactive-practice-area" style="display:none; margin-top:20px; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:18px;">
            <div id="practice-interactive-content"></div>
          </div>
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 渲染课文段落 HTML
  function renderLessonTextHtml(textData, lesson) {
    if (textData && textData.paragraphs && textData.paragraphs.length > 0) {
      return textData.paragraphs.map(p => `
        <div class="reader-para ${p.highlight ? 'core-highlight' : ''}">
          ${p.text}
        </div>
      `).join("");
    }
    if (textData && textData.rawText) {
      return `<div class="reader-para" style="white-space:pre-line;">${textData.rawText}</div>`;
    }
    return `<div class="reader-para">${lesson.mainContent}</div>`;
  }

  // 步骤切换
  window.switchWizardStep = function (stepIdx) {
    APP_STATE.currentWizardStep = stepIdx;
    document.querySelectorAll(".wizard-step-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx + 1 === stepIdx);
    });
    document.querySelectorAll(".wizard-stage-content").forEach((stage, idx) => {
      stage.classList.toggle("active", idx + 1 === stepIdx);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 阅读器切换：纯净文字 vs 原版教材PDF嵌入
  window.switchReaderView = function (viewType) {
    APP_STATE.currentReaderView = viewType;
    document.getElementById("rv-tab-text").classList.toggle("active", viewType === "text");
    document.getElementById("rv-tab-pdf").classList.toggle("active", viewType === "pdf");
    document.getElementById("reader-view-text-panel").style.display = viewType === "text" ? "block" : "none";
    document.getElementById("reader-view-pdf-panel").style.display = viewType === "pdf" ? "block" : "none";
  };

  // 折叠提示展开
  window.toggleTipReveal = function (contentId) {
    const el = document.getElementById(contentId);
    if (el) {
      const isHidden = el.style.display === "none" || !el.style.display;
      el.style.display = isHidden ? "block" : "none";
    }
  };

  // 辅导模式1：大声跟练
  window.startFollowAlongMode = function () {
    const area = document.getElementById("interactive-practice-area");
    const content = document.getElementById("practice-interactive-content");
    if (!area || !content) return;

    area.style.display = "block";
    const lesson = APP_STATE.selectedLesson || { title: "《春》" };

    content.innerHTML = `
      <div style="font-size:15px; font-weight:700; margin-bottom:10px;">
        📢 跟练模式：大声把下面每一句台词读出来
      </div>
      <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:14px; font-size:14.5px; line-height:1.75; margin-bottom:12px;">
        “同学们好，请坐！上课前，大家回想一下，在你眼里春天是什么样子的？今天我们一起来看看朱自清笔下的春天有何不同，请看黑板——《${lesson.title}》。”
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12.5px; color:var(--text-muted);">读完这句，是不是觉得开口并没有那么难？</span>
        <button class="btn-academic primary" onclick="playChime(659.25, 'sine', 0.2); alert('很棒！声音宏亮，教态自然。可以尝试进入模式2或模式3！');">
          我读完了 ✓
        </button>
      </div>
    `;
  };

  // 辅导模式2：提示模式
  window.startPromptMode = function () {
    const area = document.getElementById("interactive-practice-area");
    const content = document.getElementById("practice-interactive-content");
    if (!area || !content) return;

    area.style.display = "block";
    APP_STATE.promptCurrentIndex = 0;

    const prompts = [
      "第1步：新课导入 —— 亲切问好，以生活体验引出课题，在黑板正上方写好题目和作者。",
      "第2步：整体感知 —— 提出朗读要求，明确告诉学生今天重点研读核心段落（如春花图）。",
      "第3步：精读核心 —— 提出第一个具体问题，问学生写了哪些颜色和修辞，留出思考停顿。",
      "第4步：启发追问 —— 假想学生小明回答了，肯定其答案并顺势追问这个动词好在哪里。",
      "第5步：课堂小结 —— 师生共同回顾板书重点，布置分层作业，下课致谢鞠躬。"
    ];

    function showPrompt(idx) {
      content.innerHTML = `
        <div style="font-size:15px; font-weight:700; margin-bottom:10px;">
          💡 提示模式（当前第 ${idx + 1} / ${prompts.length} 步）
        </div>
        <div style="background:#FFFFFF; border-left:4px solid var(--color-gold); padding:12px 14px; font-size:14px; line-height:1.7; margin-bottom:12px;">
          ${prompts[idx]}
        </div>
        <div style="display:flex; justify-content:space-between;">
          <button class="btn-academic" ${idx === 0 ? 'disabled' : ''} onclick="window.prevPrompt(${idx})">上一环节</button>
          <button class="btn-academic primary" onclick="window.nextPrompt(${idx})">
            ${idx + 1 === prompts.length ? '完成全流程练习 🎉' : '讲完这句，下一步 →'}
          </button>
        </div>
      `;
    }

    window.nextPrompt = function (idx) {
      if (idx + 1 < prompts.length) {
        showPrompt(idx + 1);
      } else {
        alert("太棒了！你已经顺利走完了这篇课文的完整试讲流程！");
      }
    };

    window.prevPrompt = function (idx) {
      if (idx > 0) showPrompt(idx - 1);
    };

    showPrompt(0);
  };

  // 模式3：独立计时
  window.startIndependentMode = function () {
    switchTab("mock-exam");
  };

  function getLessonNotToTeachWarning(lesson) {
    if (lesson.genre.includes("散文")) {
      return "千万不要把全文所有景物全部讲完！10分钟绝对不够！也不要花超过1分钟去介绍作者生平背景，更不要在字词拼音上纠缠太久。";
    } else if (lesson.genre.includes("小说")) {
      return "不要从头到尾复述故事全过程！不要分析所有人物，抓1个最典型的人物动作或肖像细节深入剖析即可。";
    } else if (lesson.genre.includes("说明")) {
      return "不要把课文讲成科学课！重点讲说明方法（打比方、列数字）以及说明文语言的准确性。";
    } else if (lesson.genre.includes("议论")) {
      return "不要陷在具体事例细节里出不来！重点讲论点是什么、用了什么论证方法、论证思路是怎样推进的。";
    } else if (lesson.genre.includes("文言")) {
      return "千万不要逐字逐句做机械字面翻译！抓住两到三个关键字词，把时间留给朗读节奏和探究作者风骨。";
    }
    return "10分钟时间极短，千万不要试图讲完所有段落，只选1个核心切片深入互动即可。";
  }

  // ===================================================================
  // 2. 课文库渲染
  // ===================================================================

  function renderTextbooks() {
    const grid = document.getElementById("textbooks-lessons-grid");
    if (!grid || !window.TEXTBOOK_DB) return;

    let filtered = window.TEXTBOOK_DB.lessons.filter(l => {
      const status = APP_STATE.userData.lessonStatus[l.fullId] || "unlearned";
      if (APP_STATE.selectedStatus !== "all" && status !== APP_STATE.selectedStatus) return false;
      if (APP_STATE.selectedBookId !== "all" && l.grade !== APP_STATE.selectedBookId) return false;
      if (APP_STATE.selectedGenre !== "all" && !l.genre.includes(APP_STATE.selectedGenre)) return false;
      if (APP_STATE.favoritesOnly && !APP_STATE.userData.favorites.includes(l.fullId)) return false;
      if (APP_STATE.searchKeyword) {
        const kw = APP_STATE.searchKeyword.toLowerCase();
        const inTitle = l.title.toLowerCase().includes(kw);
        const inAuthor = l.author.toLowerCase().includes(kw);
        if (!inTitle && !inAuthor) return false;
      }
      return true;
    });

    const countEl = document.getElementById("textbook-filter-count");
    if (countEl) countEl.textContent = `共 ${filtered.length} 篇`;

    grid.innerHTML = filtered.map(l => {
      const isFav = APP_STATE.userData.favorites.includes(l.fullId);
      const status = APP_STATE.userData.lessonStatus[l.fullId] || "unlearned";
      let statusTag = `<span style="font-size:11.5px; color:var(--text-muted);">未学习</span>`;
      if (status === "learning") statusTag = `<span style="font-size:11.5px; color:var(--color-gold); font-weight:600;">正在学</span>`;
      if (status === "completed") statusTag = `<span style="font-size:11.5px; color:var(--color-green-primary); font-weight:600;">已试讲</span>`;

      return `
        <div class="lesson-card" onclick="openLessonWorkbench('${l.fullId}')">
          <div class="lesson-card-header">
            <div>
              <h3 style="font-size:17px;">《${l.title}》</h3>
              <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">${l.gradeName} · ${l.author}</div>
            </div>
            <span class="lesson-genre-pill">${l.genre}</span>
          </div>
          <div class="lesson-card-body">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-size:11px; color:var(--color-gold);">${l.priority}</span>
              ${statusTag}
            </div>
            <p style="font-size:13px; color:var(--text-secondary); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              ${l.mainContent}
            </p>
          </div>
          <div class="lesson-card-footer" onclick="event.stopPropagation()">
            <span style="font-size:12px; color:var(--text-muted);">原书第${l.page}页</span>
            <div style="display:flex; gap:6px;">
              <button class="btn-academic" style="padding:2px 8px; font-size:12px;" onclick="toggleFavorite('${l.fullId}'); event.stopPropagation();">
                ${isFav ? "★ 已收藏" : "☆ 收藏"}
              </button>
              <button class="btn-academic primary" style="padding:2px 10px; font-size:12px;" onclick="openLessonWorkbench('${l.fullId}'); event.stopPropagation();">
                学习这篇 →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

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
  // 3. 备课与计时器
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

    document.getElementById("exam-sheet-lesson-title").textContent = `《${lesson.title}》`;
    document.getElementById("exam-sheet-author").textContent = lesson.author;
    document.getElementById("exam-sheet-grade").textContent = lesson.gradeName;

    const savedPlan = APP_STATE.userData.myLessonPlans[lesson.fullId];
    if (savedPlan) {
      document.getElementById("sheet-input-targets").value = savedPlan.targets || "";
      document.getElementById("sheet-input-points").value = savedPlan.points || "";
      document.getElementById("sheet-input-flow").value = savedPlan.flow || "";
      document.getElementById("sheet-input-blackboard").value = savedPlan.blackboard || "";
    } else {
      document.getElementById("sheet-input-targets").value = `1. 读准生字词，品读赏析文中的修辞手法（${lesson.sampleFocus ? lesson.sampleFocus.slice(0, 30) : ''}）\n2. 体会作者在文中寄托的情感与思想`;
      document.getElementById("sheet-input-points").value = `【教学重点】：抓住核心语段朗读品析（${lesson.sampleFocus ? lesson.sampleFocus.slice(0, 20) : ''}）`;
      document.getElementById("sheet-input-flow").value = `1. 导入（1分钟）：生活情境引出课题，在黑板写课题《${lesson.title}》与作者\n2. 初读（1.5分钟）：学生自由朗读，明确今天重点研读的核心段落\n3. 精读（5分钟）：\n   主问题：作者写这一段抓住了哪些细节？（指名回答、追问接话、板书核心词）\n4. 小结（1.5分钟）：师生共同回顾黑板板书\n5. 作业（1分钟）：分层作业与礼貌下课`;
      document.getElementById("sheet-input-blackboard").value = `【课题】：${lesson.title} ${lesson.author}\n【主板书】：梳理脉络关键词\n【副板书】：修辞手法品析`;
    }

    resetPrepTimer();
    resetTeachTimer();
  };

  function updatePrepTimerDisplay() {
    const el = document.getElementById("prep-timer-display");
    if (el) el.textContent = formatTime(APP_STATE.prepTimer.remainingSeconds);
  }

  window.togglePrepTimer = function () {
    const btn = document.getElementById("btn-prep-toggle");
    if (APP_STATE.prepTimer.isRunning) {
      clearInterval(APP_STATE.prepTimer.intervalId);
      APP_STATE.prepTimer.isRunning = false;
      if (btn) btn.textContent = "继续倒计时";
    } else {
      APP_STATE.prepTimer.isRunning = true;
      if (btn) btn.textContent = "暂停";
      APP_STATE.prepTimer.intervalId = setInterval(() => {
        if (APP_STATE.prepTimer.remainingSeconds > 0) {
          APP_STATE.prepTimer.remainingSeconds--;
          updatePrepTimerDisplay();
          if (APP_STATE.prepTimer.remainingSeconds === 60) {
            playChime(440, "sine", 0.5);
            alert("⏰ 备课时间还剩最后 1 分钟！请整理好草稿要点与板书。");
          }
        } else {
          clearInterval(APP_STATE.prepTimer.intervalId);
          APP_STATE.prepTimer.isRunning = false;
          playChime(880, "triangle", 1.0);
          alert("🔔 备课时间到！请整理教案纸，点击进入【开始试讲】。");
          if (btn) btn.textContent = "开始倒计时";
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
    if (btn) btn.textContent = "开始倒计时";
  };

  function updateTeachTimerDisplay() {
    const el = document.getElementById("teach-timer-display");
    const phaseEl = document.getElementById("teach-current-phase-hint");
    const sec = APP_STATE.teachTimer.remainingSeconds;
    const elapsed = 10 * 60 - sec;

    if (el) el.textContent = formatTime(sec);

    if (phaseEl) {
      if (elapsed <= 60) {
        phaseEl.innerHTML = `📍 <strong>导入新课（0-1m）：</strong>问好，引出课题，在黑板上方写好课题和作者。`;
      } else if (elapsed <= 150) {
        phaseEl.innerHTML = `📍 <strong>初读感知（1-2.5m）：</strong>自读扫清生字词，明确今天重点研读的核心段落。`;
      } else if (elapsed <= 450) {
        phaseEl.innerHTML = `📍 <strong>精读品析（2.5-7.5m，核心）：</strong>核心主问题驱动，指名回答，追问接话，板书关键词。`;
      } else if (elapsed <= 540) {
        phaseEl.innerHTML = `📍 <strong>小结拓展（7.5-9m）：</strong>师生共同回顾黑板板书，升华情感。`;
      } else {
        phaseEl.innerHTML = `📍 <strong>布置作业（9-10m）：</strong>布置作业，向评委席鞠躬致谢结束试讲。`;
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
            playChime(523.25, "sine", 0.4);
          } else if (APP_STATE.teachTimer.remainingSeconds === 60) {
            playChime(659.25, "sine", 0.6);
          }
        } else {
          clearInterval(APP_STATE.teachTimer.intervalId);
          APP_STATE.teachTimer.isRunning = false;
          playChime(987.77, "triangle", 1.2);
          alert("🏁 10分钟试讲时间到！请向考官鞠躬致谢：‘各位评委老师，我的试讲完毕，谢谢老师！’");
          if (btn) btn.textContent = "开始试讲";
          APP_STATE.userData.examCount = (APP_STATE.userData.examCount || 0) + 1;
          if (APP_STATE.selectedLesson) {
            APP_STATE.userData.lessonStatus[APP_STATE.selectedLesson.fullId] = "completed";
          }
          saveUserData();
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
    if (btn) btn.textContent = "开始试讲";
  };

  window.saveCurrentLessonPlan = function () {
    if (!APP_STATE.selectedLesson) {
      alert("请先选择一篇课文！");
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
    alert(`🎉 《${APP_STATE.selectedLesson.title}》简案草稿已保存！`);
  };

  // ===================================================================
  // 4. 师生互动练习
  // ===================================================================

  window.sendTeacherLine = function (customText) {
    const input = document.getElementById("sparring-user-input");
    const text = customText || (input ? input.value.trim() : "");
    if (!text) return;
    if (input) input.value = "";

    appendDialogue("teacher", "执教老师（我）", text);

    setTimeout(() => {
      generateInteractiveStudentResponse(text);
    }, 700);
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

  function generateInteractiveStudentResponse(prompt) {
    let studentResp = "";
    let teacherCoachTip = "";

    if (prompt.includes("读") || prompt.includes("朗读")) {
      studentResp = "（全班大声齐读该语段，读完后教室安静下来。）";
      teacherCoachTip = "学生朗读完毕后，先肯定优点：‘同学们读得整齐响亮！’紧接着立刻抛出你的核心问题，切忌沉默冷场。";
    } else if (prompt.includes("颜色") || prompt.includes("词") || prompt.includes("哪")) {
      studentResp = "学生小林举手：“老师，我找到了文中的红、粉、白，还有‘赶趟儿’这个词！”";
      teacherCoachTip = "学生找到了具体词语，一定要先复述肯定：‘小林找得很敏锐！’然后追问：‘这个词好在哪里呢？’";
    } else if (prompt.includes("为什么") || prompt.includes("怎么理解")) {
      studentResp = "学生小赵举手：“老师，我觉得作者用这个词是为了把景色写得更有生机。”";
      teacherCoachTip = "学生给出了宏观感受，接下来带大家聚焦微观字眼：‘那大家看，他是怎么写出这份生机的？’";
    } else {
      studentResp = "学生有些犹豫，小明站起来说：“老师，我觉得这句话读起来很顺口。”";
      teacherCoachTip = "学生回答比较笼统时，不要批评，给学生‘搭个梯子’：‘顺口是因为句子句式整齐，我们再看看修辞……’";
    }

    appendDialogue("student", "模拟学生", studentResp);
    playChime(523.25, "sine", 0.15);

    // 显示现场点评
    const card = document.getElementById("sparring-eval-card");
    const report = document.getElementById("sparring-eval-report");
    if (card && report) {
      card.style.display = "block";
      report.innerHTML = `
        <div style="font-size:13.5px; line-height:1.7;">
          <div style="margin-bottom:6px;"><strong>针对你刚才说的这一句：</strong>“${prompt}”</div>
          <div style="background:var(--bg-primary); border-left:3px solid var(--color-green-primary); padding:10px 12px; border-radius:var(--radius-sm);">
            💡 <strong>老教师现场支招：</strong>${teacherCoachTip}
          </div>
        </div>
      `;
    }
  }

  // ===================================================================
  // 5. 辅助视图数据渲染
  // ===================================================================

  function renderStructured() {
    const list = document.getElementById("structured-questions-list");
    if (!list || !window.STRUCTURED_DB) return;
    list.innerHTML = window.STRUCTURED_DB.questions.map((q, idx) => `
      <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:14px; margin-bottom:12px;">
        <div style="font-weight:700; font-size:14.5px; margin-bottom:4px;">${idx + 1}. ${q.title}</div>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">类型：${q.category} · 思路：${q.framework}</div>
        <button class="btn-academic" style="font-size:12px; padding:2px 8px;" onclick="
          const el = document.getElementById('ans-st-${q.id}');
          el.style.display = el.style.display === 'none' ? 'block' : 'none';
        ">查看示范作答</button>
        <div id="ans-st-${q.id}" style="display:none; margin-top:10px; font-size:13.5px; line-height:1.7; background:#FFFFFF; padding:12px; border-radius:4px; border-left:3px solid var(--color-green-primary);">
          ${q.modelAnswer}
        </div>
      </div>
    `).join("");
  }

  function renderDefense() {
    const list = document.getElementById("defense-questions-list");
    if (!list || !window.DEFENSE_DB) return;
    list.innerHTML = window.DEFENSE_DB.categories.map(cat => `
      <div style="margin-bottom:16px;">
        <h4 style="font-size:15px; color:var(--color-green-primary); margin-bottom:8px;">${cat.category}</h4>
        ${cat.questions.map(q => `
          <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); padding:12px 14px; border-radius:var(--radius-sm); margin-bottom:8px;">
            <div style="font-weight:600; font-size:13.5px;">问：${q.question}</div>
            <div style="font-size:13px; line-height:1.65; color:var(--text-secondary); margin-top:6px;">
              <strong>答题要领：</strong>${q.answerLogic}<br>
              <strong>参考回答：</strong>${q.modelAnswer.slice(0, 120)}...
            </div>
          </div>
        `).join("")}
      </div>
    `).join("");
  }

  function renderStudyPlan() {
    const timeline = document.getElementById("plan-stages-timeline");
    if (!timeline || !window.STUDY_PLAN_DB) return;
    timeline.innerHTML = window.STUDY_PLAN_DB.stages.map(s => `
      <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:14px; margin-bottom:12px;">
        <div style="font-weight:700; color:var(--color-green-primary); margin-bottom:4px;">${s.name} (${s.duration})</div>
        <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${s.goal}</div>
      </div>
    `).join("");
  }

  function renderSavedPlans() {
    const plansContainer = document.getElementById("saved-plans-container");
    const favsContainer = document.getElementById("saved-favs-container");

    if (plansContainer) {
      const plans = Object.values(APP_STATE.userData.myLessonPlans);
      if (plans.length === 0) {
        plansContainer.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:13px;">暂无保存的教案草稿。在任何课文备课时点击“保存我的草稿”即可保存在这里。</div>`;
      } else {
        plansContainer.innerHTML = plans.map(p => `
          <div style="background:var(--bg-card-warm); border:1px solid var(--border-color); padding:12px 14px; border-radius:var(--radius-sm); margin-bottom:10px;">
            <div style="font-weight:700; font-size:14.5px;">《${p.lessonTitle}》教案提纲</div>
            <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:6px;">保存于：${p.updatedAt}</div>
            <div style="font-size:13px; color:var(--text-secondary); white-space:pre-line; max-height:80px; overflow:hidden;">${p.targets}</div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
              <button class="btn-academic" onclick="startMockExamWithLesson('${p.lessonId}')">加载到草稿纸</button>
              <button class="btn-academic" onclick="deleteLessonPlan('${p.lessonId}')" style="color:#C0392B;">删除</button>
            </div>
          </div>
        `).join("");
      }
    }

    if (favsContainer && window.TEXTBOOK_DB) {
      const favs = window.TEXTBOOK_DB.lessons.filter(l => APP_STATE.userData.favorites.includes(l.fullId));
      if (favs.length === 0) {
        favsContainer.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:13px;">暂无收藏课文。</div>`;
      } else {
        favsContainer.innerHTML = favs.map(l => `
          <div class="lesson-card" onclick="openLessonWorkbench('${l.fullId}')">
            <div class="lesson-card-header">
              <h3>《${l.title}》</h3>
              <span class="lesson-genre-pill">${l.genre}</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${l.author} · ${l.gradeName}</div>
          </div>
        `).join("");
      }
    }
  }

  window.deleteLessonPlan = function (lid) {
    if (confirm("确定要删除这篇草稿吗？")) {
      delete APP_STATE.userData.myLessonPlans[lid];
      saveUserData();
      renderSavedPlans();
    }
  };

  function bindEvents() {
    const searchInput = document.getElementById("textbook-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        APP_STATE.searchKeyword = e.target.value.trim();
        renderTextbooks();
      });
    }

    document.querySelectorAll(".chip-status").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-status").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedStatus = btn.dataset.status;
        renderTextbooks();
      });
    });

    document.querySelectorAll(".chip-book").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-book").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedBookId = btn.dataset.book;
        renderTextbooks();
      });
    });

    document.querySelectorAll(".chip-genre").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-genre").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        APP_STATE.selectedGenre = btn.dataset.genre;
        renderTextbooks();
      });
    });

    const favOnlyBtn = document.getElementById("btn-toggle-fav-filter");
    if (favOnlyBtn) {
      favOnlyBtn.addEventListener("click", () => {
        APP_STATE.favoritesOnly = !APP_STATE.favoritesOnly;
        favOnlyBtn.classList.toggle("active", APP_STATE.favoritesOnly);
        favOnlyBtn.textContent = APP_STATE.favoritesOnly ? "★ 仅看收藏开启" : "☆ 仅看收藏";
        renderTextbooks();
      });
    }

    document.querySelectorAll(".quick-spar-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sendTeacherLine(btn.dataset.prompt);
      });
    });
  }

})();
