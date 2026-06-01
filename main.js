/* ══════════════════════════════════════════════════════════════
   SMMC G4 — ASUSTeK  |  main.js
   All JS from TP_ComponentTemplate.html + hero particle engine
   ══════════════════════════════════════════════════════════════ */

/* ── Reduced-motion 全域偵測（多處共用） ───────────────── */
var prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
if (window.matchMedia) {
  try {
    window.matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', function (e) { prefersReducedMotion = e.matches; });
  } catch (e) { /* 舊版 Safari 無 addEventListener */ }
}

/* ── Theme ─────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
let dark = false;
themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  themeBtn.textContent = dark ? '☀️' : '🌙';
  try { localStorage.setItem('asus-theme', dark ? 'dark' : 'light'); } catch (e) {}
});

/* ── Language ───────────────────────────────────────────── */
function setLang(lang) {
  document.body.setAttribute('data-lang', lang);
  document.getElementById('btnEN').classList.toggle('active', lang === 'en');
  document.getElementById('btnZH').classList.toggle('active', lang === 'zh');
  document.getElementById('btnEN').setAttribute('aria-pressed', lang === 'en');
  document.getElementById('btnZH').setAttribute('aria-pressed', lang === 'zh');
  try { localStorage.setItem('asus-lang', lang); } catch (e) {}
}

/* ── Nav (side drawer) ──────────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const sideNav    = document.getElementById('sideNav');
const navOverlay = document.getElementById('navOverlay');
let navOpen = false;

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    navOpen = !navOpen;
    sideNav.classList.toggle('open', navOpen);
    navOverlay.classList.toggle('visible', navOpen);
    menuBtn.classList.toggle('open', navOpen);
    menuBtn.setAttribute('aria-expanded', navOpen);
  });
}

function closeNav() {
  navOpen = false;
  if (sideNav) sideNav.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('visible');
  if (menuBtn) { menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }
}

function navClick(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  if (window.innerWidth < 900) closeNav();
}

/* ── Scroll to section helper ──────────────────────────── */
function getHeaderH() {
  var h = document.querySelector('header');
  /* header is hidden (translateY) on hero page, so treat it as 0 there */
  if (h && !h.classList.contains('hero-hidden')) return h.offsetHeight || 0;
  return 0;
}
function scrollToSection(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var top = el.getBoundingClientRect().top + window.scrollY - getHeaderH();
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}
function smoothNav(anchorEl, id) {
  navClick(anchorEl);
  setTimeout(() => scrollToSection(id), 10);
}

/* ── Bilingual tables & lifecycle bar ─────────────────── */
function syncSpecialElements() {
  const lang = document.body.getAttribute('data-lang') || 'en';
  document.querySelectorAll('.comp-table.en').forEach(t => { t.style.display = (lang === 'en') ? '' : 'none'; });
  document.querySelectorAll('.comp-table.zh').forEach(t => { t.style.display = (lang === 'zh') ? '' : 'none'; });
  document.querySelectorAll('.lc-stage.en').forEach(t => { t.style.display = (lang === 'en') ? '' : 'none'; });
  document.querySelectorAll('.lc-stage.zh').forEach(t => { t.style.display = (lang === 'zh') ? '' : 'none'; });
}

/* ── Left dot nav ──────────────────────────────────────── */
function updateDots() {
  const scrollY = window.scrollY + window.innerHeight * 0.45;
  const sIds = ['overview','s1-bizlines','s2-corpchain','s3-resources','s4-competencies','s5-dynamic'];
  let activeId = 'overview';
  for (const id of sIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) activeId = id;
  }
  document.querySelectorAll('.snb-dot[data-target]').forEach(dot => {
    dot.classList.toggle('active', dot.getAttribute('data-target') === activeId);
  });
}
window.addEventListener('scroll', updateDots, { passive: true });

/* ── Escape to close ───────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMember(); closeAudioPanel(); }
});

/* ── Member Modal (from footer範本.html) ── */
const members = {
  'May': {
    id: '114212501',
    chapters: [
      { tp: 'TP0', en: 'Recent News',                              zh: '近期新聞' },
      { tp: 'TP1', en: 'Competitor Analysis (Static & Dynamic)',   zh: '競爭對手分析（靜態與動態）' },
      { tp: 'TP2', en: 'Dynamic Capabilities',                     zh: '動態能力' },
      { tp: 'TP3', en: 'Product Diversification',                  zh: '產品多角化' },
      { tp: 'TPF', en: 'Web Design',                               zh: '網頁設計' },
    ],
    intro: 'https://youtu.be/Otlapcx6XgQ',
    photo: 'https://res.cloudinary.com/dqijqhwjo/image/upload/q_auto/f_auto/v1777281199/%E6%88%AA%E5%9C%96_2026-04-27_%E4%B8%8B%E5%8D%884.17.32_jnw2ox.png'
  },
  'Atherine': {
    id: '113212513',
    chapters: [
      { tp: 'TP0', en: 'Company History',                         zh: '公司發展歷程' },
      { tp: 'TP1', en: 'Competitor Analysis (Static & Dynamic)',   zh: '競爭對手分析（靜態與動態）' },
      { tp: 'TP2', en: 'Key Resources',                            zh: '關鍵資源' },
      { tp: 'TP3', en: 'Future Challenges & Suggestions',          zh: '未來挑戰與建議' },
      { tp: 'TPF', en: 'Web Design',                               zh: '網頁設計' },
    ],
    intro: 'https://youtu.be/F2b4cfav9Gs',
    photo: 'https://res.cloudinary.com/dqijqhwjo/image/upload/q_auto/f_auto/v1777281199/%E6%88%AA%E5%9C%96_2026-04-27_%E4%B8%8B%E5%8D%884.13.46_tkxnrr.png'
  },
  'Fanny': {
    id: '111212002',
    chapters: [
      { tp: 'TP0', en: 'Vision / Mission / Values',                                  zh: '願景／使命／價值觀' },
      { tp: 'TP1', en: "Porter's Five Forces",                                       zh: '五力分析' },
      { tp: 'TP2', en: 'Core Competencies, Complementary Assets & Key Partners',     zh: '核心競爭力、互補性資產與關鍵合作夥伴' },
      { tp: 'TP3', en: 'Geographical Expansion',                                     zh: '地理區域擴張' },
      { tp: 'TPF', en: 'Web Design',                                                 zh: '網頁設計' },
    ],
    intro: 'https://youtu.be/KH_Vc1Q-HRQ',
    photo: 'https://res.cloudinary.com/dqijqhwjo/image/upload/q_auto/f_auto/v1777281199/%E6%88%AA%E5%9C%96_2026-04-27_%E4%B8%8B%E5%8D%884.16.57_oslyka.png'
  },
  'Allen Huang': {
    id: '111212021',
    chapters: [
      { tp: 'TP0', en: 'Organizational Structure & Management',    zh: '組織架構與管理團隊' },
      { tp: 'TP1', en: 'Industry Value Chain',                      zh: '產業鏈' },
      { tp: 'TP2', en: 'Key Resources',                            zh: '關鍵資源' },
      { tp: 'TP3', en: 'Market Entry Modes',                       zh: '市場進入模式' },
      { tp: 'TPF', en: 'Web Design',                               zh: '網頁設計' },
    ],
    intro: 'https://youtu.be/0nQ1Z9M3CjI',
    photo: 'https://res.cloudinary.com/dqijqhwjo/image/upload/q_auto/f_auto/v1777281199/%E6%88%AA%E5%9C%96_2026-04-27_%E4%B8%8B%E5%8D%884.20.56_oxgdod.png'
  },
  'Wesley': {
    id: '113212522',
    chapters: [
      { tp: 'TP0', en: 'Financial Performance 2021–2025',          zh: '財務表現 2021–2025' },
      { tp: 'TP1', en: 'Macro Environment Analysis (PESTEL)',      zh: '總體環境分析（PESTEL）' },
      { tp: 'TP2', en: 'Corporate Value Chain',                    zh: '企業價值鏈' },
      { tp: 'TP3', en: 'Vertical Integration',                     zh: '垂直整合' },
      { tp: 'TPF', en: 'Web Design',                               zh: '網頁設計' },
    ],
    intro: 'https://youtu.be/gA13ak9cHeM',
    photo: 'https://res.cloudinary.com/dqijqhwjo/image/upload/q_auto/f_auto/v1777281199/%E6%88%AA%E5%9C%96_2026-04-27_%E4%B8%8B%E5%8D%884.16.28_e4bays.png'
  },
  'Datou': {
    id: '111212011',
    chapters: [
      { tp: 'TP0', en: 'Product Portfolios',                       zh: '產品組合' },
      { tp: 'TP1', en: 'Industry Lifecycle & Recent News',         zh: '產業生命週期與近期新聞' },
      { tp: 'TP2', en: 'Core Businesses / Product Lines',          zh: '核心業務與產品線' },
      { tp: 'TP3', en: 'HTML Production',                          zh: 'HTML 製作' },
      { tp: 'TPF', en: 'Web Design & Build',                       zh: '網頁設計與架設' },
    ],
    intro: 'https://youtu.be/xoqapUGvzQA',
    photo: 'https://res.cloudinary.com/dqijqhwjo/image/upload/q_auto/f_auto/v1777281018/%E6%88%AA%E5%9C%96_2026-04-27_%E4%B8%8B%E5%8D%884.06.16_kjrwrb.png'
  },
};

const modalLabels = {
  id:       { en: '🎓 Student ID',          zh: '🎓 學號' },
  chapters: { en: '📋 Responsible Sections', zh: '📋 負責章節' },
  intro:    { en: '🎬 Self Introduction',    zh: '🎬 自我介紹' },
};

function openMember(name) {
  const m    = members[name];
  const lang = document.body.getAttribute('data-lang') || 'en';
  const L    = (key) => modalLabels[key][lang];
  const avatarHTML = m.photo
    ? `<img src="${m.photo}" alt="${name}" class="member-avatar-img" />`
    : `<div class="member-avatar">${name.charAt(0).toUpperCase()}</div>`;
  const introHTML = m.intro
    ? `<div class="member-row"><span class="member-row-label">${L('intro')}</span><a href="${m.intro}" target="_blank" rel="noopener" style="color:var(--asus-blue);text-decoration:underline;">▶ ${lang === 'zh' ? '觀看自我介紹' : 'Watch Introduction'}</a></div>`
    : `<div class="member-row"><span class="member-row-label">${L('intro')}</span><span style="color:var(--text-label);font-style:italic;">${lang === 'zh' ? '（影片待上傳）' : '(Video coming soon)'}</span></div>`;
  const chaptersHTML = Array.isArray(m.chapters)
    ? m.chapters.map(c => `<span style="display:block;"><strong style="color:var(--asus-blue);font-family:var(--font-en);font-size:.9em;">${c.tp ? c.tp + '｜' : ''}</strong>${(c[lang] || c.en || '')}</span>`).join('')
    : (typeof m.chapters === 'object' ? m.chapters[lang] : m.chapters);
  document.getElementById('modalContent').innerHTML = `
    ${avatarHTML}
    <div class="member-modal-name">${name}</div>
    <div class="member-row"><span class="member-row-label">${L('id')}</span><span>${m.id}</span></div>
    <div class="member-row"><span class="member-row-label">${L('chapters')}</span><span>${chaptersHTML}</span></div>
    ${introHTML}
  `;
  document.getElementById('memberModal').style.display = 'flex';
}

function closeMember() {
  document.getElementById('memberModal').style.display = 'none';
}

document.getElementById('memberModal').addEventListener('click', function(e) {
  if (e.target === this) closeMember();
});

/* ── Professor Modal (from footer範本.html, no particles) ── */
function profChipClick(e) {
  const chip = e.currentTarget;
  const rect = chip.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 3;
  ripple.style.cssText = `
    position:fixed; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${e.clientX - size/2}px; top:${e.clientY - size/2}px;
    background:radial-gradient(circle, rgba(240,192,64,0.55) 0%, rgba(200,155,0,0.2) 40%, transparent 70%);
    transform:scale(0); z-index:9999;
    animation: profChipRipple 0.7s cubic-bezier(.2,.8,.4,1) forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 750);
  setTimeout(() => openProfessor(), 120);
}

function openProfessor() {
  const lang = document.body.getAttribute('data-lang') || 'en';
  document.getElementById('prof-label-pos').textContent    = lang === 'zh' ? '任職單位' : 'INSTITUTION';
  document.getElementById('prof-val-pos').textContent      = lang === 'zh' ? '國立暨南國際大學　管理學院' : 'National Chi Nan University, School of Management';
  document.getElementById('prof-label-course').textContent = lang === 'zh' ? '授課課程' : 'COURSE';
  document.getElementById('prof-val-course').textContent   = lang === 'zh' ? '國際策略管理' : 'International Strategic Management';
  document.getElementById('prof-label-link').textContent   = lang === 'zh' ? '個人頁面' : 'PROFILE LINK';
  const modal = document.getElementById('professorModal');
  modal.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    modal.classList.add('open');
  }));
}

function closeProfessor() {
  const modal = document.getElementById('professorModal');
  const card  = document.getElementById('profCard');
  card.style.transition = 'transform 0.3s ease, opacity 0.25s ease';
  card.style.transform  = 'scale(0.85) translateY(30px)';
  card.style.opacity    = '0';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('open');
    card.style.transform = '';
    card.style.opacity   = '';
    card.style.transition = '';
  }, 280);
}

document.getElementById('professorModal').addEventListener('click', function(e) {
  if (e.target === this || e.target === document.getElementById('profOverlayBg')) closeProfessor();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMember(); closeProfessor(); }
});

/* ════════════════════════════════════════════════════════════
   AUDIO GUIDE ENGINE  (exact from template)
   ════════════════════════════════════════════════════════════ */
var audioScripts = {
  en: {
    'overview': [
      "Welcome to the ASUS Strategic Management report by Group 4.",
      "This interactive webpage presents our comprehensive analysis of ASUSTeK Computer Inc.",
      "Use the navigation menu to explore each section of the report."
    ]
  ,
      's1-bizlines': [
        "Section 1: Core Businesses and Product Lines.",
        "ASUS operates across multiple major business lines, including consumer notebooks and desktops, commercial and enterprise solutions, gaming products under the ROG and TUF brands, components and peripherals, and an emerging AI infrastructure division.",
        "The consumer segment remains the largest revenue contributor, while the AI and data center segment represents the highest growth opportunity."
      ],
      's2-corpchain': [
        "Section 2: Corporate Value Chain.",
        "ASUS's value chain spans R&D and product design, component procurement, manufacturing coordination, marketing, and after-sales service.",
        "The company leverages a fabless model, outsourcing production to contract manufacturers while retaining control over design, brand, and software integration."
      ],
      's3-resources': [
        "Section 3: Key Resources.",
        "ASUS's key resources include its strong R&D capabilities, established global brand equity, and deep relationships with component suppliers such as NVIDIA and Intel.",
        "Additional critical resources include its global distribution network, proprietary software platforms, and experienced engineering talent."
      ],
      's4-competencies': [
        "Section 4: Core Competencies, Complementary Assets, and Key Partners.",
        "ASUS's core competencies lie in hardware design excellence, system integration, and the ability to deliver high-performance products across multiple price tiers.",
        "Key strategic partners include NVIDIA for GPU supply, major ODM manufacturers, and cloud platform providers for enterprise AI solutions."
      ],
      's5-dynamic': [
        "Section 5: Dynamic Capabilities.",
        "ASUS demonstrates dynamic capabilities through three major mechanisms: organizational restructuring of its IS Business Group, redeployment of existing talent into new high-growth areas, and internal platformization across product lines.",
        "These capabilities allow ASUS to sense emerging opportunities in AI infrastructure, seize them through rapid organizational pivots, and reconfigure resources to sustain competitive advantage in a fast-changing environment."
      ]
    },
  zh: {
    'overview': [
      "歡迎來到第四組的華碩電腦股份有限公司策略管理報告。",
      "本互動網頁呈現我們對華碩的完整策略分析。",
      "請使用導覽選單探索報告的各個章節。"
    ]
  }
,
      's1-bizlines': [
        "第一節：核心業務與產品線。",
        "華碩的主要業務涵蓋消費型筆電與桌機、商務企業解決方案、ROG 與 TUF 電競品牌、零組件與周邊，以及新興的 AI 基礎設施業務。",
        "消費性產品仍是最大營收來源，AI 與資料中心業務則代表最高成長潛力。"
      ],
      's2-corpchain': [
        "第二節：企業價值鏈。",
        "華碩的價值鏈涵蓋研發設計、零組件採購、製造協調、行銷與售後服務。",
        "公司採用無廠模式，將生產外包給代工廠商，同時保留設計、品牌與軟體整合的核心主導權。"
      ],
      's3-resources': [
        "第三節：關鍵資源。",
        "華碩的關鍵資源包括強大的研發能力、成熟的全球品牌資產，以及與 NVIDIA、Intel 等零組件供應商的深厚合作關係。",
        "其他重要資源還包括全球配銷網路、自有軟體平台，以及豐富的工程人才。"
      ],
      's4-competencies': [
        "第四節：核心競爭力、互補性資產與關鍵合作夥伴。",
        "華碩的核心競爭力在於硬體設計卓越性、系統整合能力，以及跨多個價位區間提供高效能產品的能力。",
        "關鍵策略合作夥伴包括 NVIDIA 的 GPU 供應、主要 ODM 製造商，以及企業 AI 解決方案的雲端平台夥伴。"
      ],
      's5-dynamic': [
        "第五節：動態能力。",
        "華碩透過三大機制展現動態能力：IS 事業群的組織重組、將既有人才重新部署至高成長領域，以及跨產品線的內部平台化。",
        "這些能力讓華碩得以感知 AI 基礎設施的新興機會，透過快速的組織轉型加以掌握，並重新配置資源，在快速變動的市場中維持競爭優勢。"
      ]
    };

var agSectionOrder = ['overview', 's1-bizlines', 's2-corpchain', 's3-resources', 's4-competencies', 's5-dynamic'];
var ag = { active:false, playing:false, paused:false, sectionId:null, idx:0, speed:1.0, globalMode:false, utterance:null, speedChanging:false };
var agSpeeds = [0.8, 1.0, 1.25, 1.5];

function agLang() { return document.body.getAttribute('data-lang') || 'en'; }
function agScript(sid) { var lang=agLang(); return (audioScripts[lang]&&audioScripts[lang][sid])?audioScripts[lang][sid]:[]; }

function agSectionName(sid) {
  var names = {
    'overview':        { en:'Overview',              zh:'報告總覽' },
    's1-bizlines':     { en:'Core Businesses',       zh:'核心業務與產品線' },
    's2-corpchain':    { en:'Corporate Value Chain', zh:'企業價值鏈' },
    's3-resources':    { en:'Key Resources',         zh:'關鍵資源' },
    's4-competencies': { en:'Core Competencies',     zh:'核心能力與關鍵夥伴' },
    's5-dynamic':      { en:'Dynamic Capabilities',  zh:'動態能力' }
  };
  return names[sid] ? names[sid][agLang()] : sid;
}

function agUpdateUI() {
  var gbtn=document.getElementById('globalAudioBtn');
  if(gbtn) gbtn.classList.toggle('playing', ag.playing&&!ag.paused);
  var ppbtn=document.getElementById('audioPlayPauseBtn');
  if(ppbtn) ppbtn.textContent=(ag.playing&&!ag.paused)?'⏸':'▶';
  document.querySelectorAll('.section-audio-btn').forEach(function(btn){
    var sid=btn.getAttribute('data-section');
    if(sid===ag.sectionId&&ag.playing&&!ag.paused) btn.classList.add('playing');
    else btn.classList.remove('playing');
  });
  var script=agScript(ag.sectionId);
  var prog=document.getElementById('audioProgressText');
  if(prog) prog.textContent=(script.length?(ag.idx+1)+'/'+script.length:'0/0');
}

function agUpdatePreview(text) {
  var el=document.getElementById('audioTextPreview');
  if(!el) return;
  el.textContent=text||'—';
  el.style.fontFamily=(agLang()==='zh')?'var(--font-zh)':'var(--font-en)';
}

function agUpdateSectionName() {
  var el=document.getElementById('audioSectionName');
  if(el&&ag.sectionId) el.textContent=agSectionName(ag.sectionId);
}

function agSpeak(idx) {
  var script=agScript(ag.sectionId);
  if(!script.length||idx>=script.length) {
    if(ag.globalMode) {
      var curPos=agSectionOrder.indexOf(ag.sectionId);
      if(curPos>=0&&curPos<agSectionOrder.length-1) {
        ag.sectionId=agSectionOrder[curPos+1]; ag.idx=0;
        agUpdateSectionName(); agUpdateUI(); _barReset(); _barStart();
        setTimeout(function(){agSpeak(0);},80); return;
      }
    }
    ag.playing=false; ag.paused=false; ag.idx=0; ag.globalMode=false;
    agUpdateUI(); agUpdatePreview(''); return;
  }
  ag.idx=idx;
  var text=script[idx];
  agUpdatePreview(text); agUpdateUI();
  var isZh=(agLang()==='zh');
  var naturalText=text;
  if(isZh) { naturalText=naturalText.replace(/(\d),(?=\d{3})/g,'$1').replace(/,/g,'').replace(/\s+/g,' ').trim(); }
  else { naturalText=naturalText.replace(/(\d),(?=\d{3})/g,'$1').replace(/([.!?])\s*/g,'$1  ').replace(/\s+/g,' ').trim(); }

  var utter=new SpeechSynthesisUtterance(naturalText);
  utter.lang=isZh?'zh-TW':'en-US'; utter.rate=ag.speed*0.92; utter.pitch=isZh?1.05:1.08;
  var voices=window.speechSynthesis.getVoices();
  var preferred=(function(){
    var priorities=isZh?['Siri','Google 普通話','Google 國語','Meijia','美佳','Tingting','婷婷','Microsoft Hanhan','Microsoft Zhiwei']:['Siri','Google UK English Female','Google US English','Samantha','Karen','Moira','Microsoft Zira','Microsoft Jenny','Microsoft Aria'];
    for(var i=0;i<priorities.length;i++) for(var j=0;j<voices.length;j++) if(voices[j].name.indexOf(priorities[i])!==-1) return voices[j];
    var langPrefix=isZh?'zh':'en';
    for(var k=0;k<voices.length;k++) if(voices[k].lang.indexOf(langPrefix)===0) return voices[k];
    return null;
  })();
  if(preferred) utter.voice=preferred;

  utter.onend=function(){if(ag.speedChanging)return;if(ag.playing&&!ag.paused)agSpeak(idx+1);};
  utter.onerror=function(e){if(e.error!=='interrupted')console.warn('SpeechSynthesis error:',e.error);};
  ag.utterance=utter;

  (function(){
    var script2=agScript(ag.sectionId); var total=script2?script2.length:1;
    var fromPct=(idx/total)*100; var toPct=((idx+1)/total)*100;
    var isZhText=(agLang()==='zh');
    var words=isZhText?text.replace(/\s/g,'').length:text.split(' ').length;
    var wpm=(isZhText?220:100)*ag.speed; var estMs=(words/wpm)*60000+400;
    utter.onstart=function(){_barSetSentence(fromPct,toPct,estMs);if(!_raf)_barStart();};
  })();
  window.speechSynthesis.speak(utter);
}

function agStart(sectionId,fromIdx,globalMode) {
  window.speechSynthesis.cancel(); _barReset();
  ag.sectionId=sectionId; ag.idx=fromIdx||0; ag.playing=true; ag.paused=false; ag.globalMode=globalMode||false;
  var panel=document.getElementById('audioPlayerPanel');
  if(panel) panel.classList.add('visible');
  ag.active=true; agUpdateSectionName(); agUpdateUI();
  window.speechSynthesis.cancel();
  setTimeout(function(){agSpeak(ag.idx);},50);
}

function openAudioPanel() { var panel=document.getElementById('audioPlayerPanel'); if(panel) panel.classList.add('visible'); ag.active=true; }

function closeAudioPanel() {
  stopAudio(); var panel=document.getElementById('audioPlayerPanel');
  if(panel) panel.classList.remove('visible');
  ag.active=false; ag.sectionId=null;
  agUpdateUI(); agUpdatePreview('');
  var el=document.getElementById('audioSectionName'); if(el) el.textContent='';
}

function toggleGlobalAudio() {
  if(ag.playing&&!ag.paused) { window.speechSynthesis.pause(); ag.paused=true; ag.playing=false; agUpdateUI(); }
  else if(ag.paused) { window.speechSynthesis.resume(); ag.paused=false; ag.playing=true; agUpdateUI(); }
  else { agStart('overview',0,true); }
}

function playSectionAudio(sectionId,event) {
  if(event){event.stopPropagation();event.preventDefault();}
  if(ag.active&&ag.sectionId===sectionId) {
    if(ag.playing&&!ag.paused){window.speechSynthesis.pause();ag.paused=true;ag.playing=false;agUpdateUI();return;}
    else if(ag.paused){window.speechSynthesis.resume();ag.paused=false;ag.playing=true;agUpdateUI();return;}
  }
  agStart(sectionId,0);
}

function togglePlayPause() {
  if(!ag.sectionId) return;
  if(ag.playing&&!ag.paused){window.speechSynthesis.pause();ag.paused=true;ag.playing=false;}
  else if(ag.paused){window.speechSynthesis.resume();ag.paused=false;ag.playing=true;}
  else{ag.playing=true;ag.paused=false;window.speechSynthesis.cancel();setTimeout(function(){agSpeak(ag.idx);},50);}
  agUpdateUI();
}

function stopAudio() { window.speechSynthesis.cancel(); ag.playing=false; ag.paused=false; ag.idx=0; agUpdateUI(); agUpdatePreview(''); }

function cycleSpeed() {
  var ci=agSpeeds.indexOf(ag.speed); var ni=(ci+1)%agSpeeds.length; ag.speed=agSpeeds[ni];
  document.getElementById('audioSpeedBtn').textContent=ag.speed+'\u00d7';
  if(ag.playing&&!ag.paused){
    var savedIdx=ag.idx; var savedSid=ag.sectionId;
    ag.speedChanging=true; ag.playing=false; window.speechSynthesis.cancel();
    setTimeout(function(){ag.speedChanging=false;ag.sectionId=savedSid;ag.idx=savedIdx;ag.playing=true;ag.paused=false;agSpeak(savedIdx);},100);
  }
}

/* ── Progress bar ── */
var _raf=null,_barSentenceStart=null,_barSentenceDur=null,_barSentenceFrom=0,_barSentenceTo=0,_barPausedAt=null;
function _barTick(){var fill=document.getElementById('audioProgressFill');if(!fill)return;if(_barSentenceStart===null||_barSentenceDur===null){_raf=requestAnimationFrame(_barTick);return;}if(_barPausedAt!==null){fill.style.width=_barPausedAt+'%';_raf=requestAnimationFrame(_barTick);return;}var elapsed=performance.now()-_barSentenceStart;var t=Math.min(elapsed/_barSentenceDur,1);fill.style.width=(_barSentenceFrom+(_barSentenceTo-_barSentenceFrom)*t).toFixed(3)+'%';_raf=requestAnimationFrame(_barTick);}
function _barStart(){if(_raf)cancelAnimationFrame(_raf);_barPausedAt=null;_raf=requestAnimationFrame(_barTick);}
function _barReset(){if(_raf)cancelAnimationFrame(_raf);_raf=null;_barSentenceStart=_barSentenceDur=null;_barSentenceFrom=_barSentenceTo=0;_barPausedAt=null;var f=document.getElementById('audioProgressFill');if(f)f.style.width='0%';}
function _barPause(){var f=document.getElementById('audioProgressFill');_barPausedAt=f?parseFloat(f.style.width):0;}
function _barResume(){if(_barPausedAt!==null&&_barSentenceDur!==null){var frac=(_barPausedAt-_barSentenceFrom)/(_barSentenceTo-_barSentenceFrom||1);_barSentenceStart=performance.now()-frac*_barSentenceDur;}_barPausedAt=null;}
function _barSetSentence(fromPct,toPct,durationMs){_barSentenceFrom=fromPct;_barSentenceTo=toPct;_barSentenceStart=performance.now();_barSentenceDur=durationMs*0.92;_barPausedAt=null;}

/* Prev / Next sentence */
function agPrevSentence(){if(!ag.active)return;ag.speedChanging=true;window.speechSynthesis.cancel();ag.speedChanging=false;ag.playing=true;ag.paused=false;agSpeak(Math.max(0,ag.idx-1));}
function agNextSentence(){if(!ag.active)return;var script=agScript(ag.sectionId);ag.speedChanging=true;window.speechSynthesis.cancel();ag.speedChanging=false;ag.playing=true;ag.paused=false;agSpeak(Math.min((script.length||1)-1,ag.idx+1));}

/* Lang switch — stop audio */
var _basSetLang=setLang;
setLang=function(lang){
  var wasActive=ag.active,wasSid=ag.sectionId,wasIdx=ag.idx,wasPlaying=ag.playing&&!ag.paused;
  if(ag.playing||ag.paused){ag.speedChanging=true;window.speechSynthesis.cancel();ag.speedChanging=false;ag.playing=false;ag.paused=false;}
  _basSetLang(lang); syncSpecialElements(); agUpdateSectionName();
  if(wasActive&&wasPlaying&&wasSid){setTimeout(function(){ag.sectionId=wasSid;ag.idx=wasIdx;ag.active=true;ag.playing=true;ag.paused=false;agUpdateUI();agSpeak(wasIdx);},120);}
};

/* Chrome keep-alive */
setInterval(function(){if(ag.playing&&!ag.paused&&window.speechSynthesis.paused)window.speechSynthesis.resume();},5000);
window.addEventListener('pagehide',function(){window.speechSynthesis.cancel();});

/* ── Interactive JS ── */
function toggleAccordion(card){card.classList.toggle('open');}
function switchTab(group,panelId,btn){btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('[id^="'+group+'-"]').forEach(p=>p.classList.remove('active'));var target=document.getElementById(group+'-'+panelId);if(target)target.classList.add('active');}
function selectBcg(type,el){var colors={star:'#2E8B57',qm:'#C89B00',cow:'#00539B',dog:'#58585A'};var ids=['bcg-star','bcg-qm','bcg-cow','bcg-dog'];ids.forEach(function(id){var el2=document.getElementById(id);if(el2)el2.style.outline='none';});if(el)el.style.outline='3px solid '+(colors[type]||'#00539B');}

/* Animate TCE meters */
function animateMeters(){var meters=document.querySelectorAll('.tce-meter-fill');meters.forEach(m=>{var w=m.getAttribute('data-width');if(w&&m.style.width==='0px'||m.style.width===''){m.style.width=w+'%';}});}
window.addEventListener('load',()=>setTimeout(animateMeters,400));
window.addEventListener('scroll',animateMeters,{passive:true,once:true});

/* Drag audio panel */
(function(){
  function initDrag(){
    var panel=document.getElementById('audioPlayerPanel'); var header=document.getElementById('audioPanelHeader');
    if(!panel||!header)return;
    var dragging=false,ox=0,oy=0,pid=null;
    function down(e){
      if(e.target.closest('.audio-player-close'))return;
      dragging=true;
      var r=panel.getBoundingClientRect();
      ox=e.clientX-r.left;oy=e.clientY-r.top;
      panel.classList.add('dragging');document.body.style.userSelect='none';
      pid=e.pointerId;
      if(header.setPointerCapture && pid!=null){try{header.setPointerCapture(pid);}catch(_){}}
    }
    function move(e){
      if(!dragging)return;
      e.preventDefault(); /* 拖曳時避免頁面跟著捲動（觸控） */
      var x=Math.max(0,Math.min(e.clientX-ox,window.innerWidth-panel.offsetWidth));
      var y=Math.max(0,Math.min(e.clientY-oy,window.innerHeight-panel.offsetHeight));
      panel.style.left=x+'px';panel.style.top=y+'px';panel.style.right='auto';panel.style.bottom='auto';
    }
    function up(){
      if(!dragging)return;
      dragging=false;panel.classList.remove('dragging');document.body.style.userSelect='';
      if(header.releasePointerCapture && pid!=null){try{header.releasePointerCapture(pid);}catch(_){}}
      pid=null;
    }
    if(window.PointerEvent){
      header.style.touchAction='none';
      header.addEventListener('pointerdown',down);
      document.addEventListener('pointermove',move,{passive:false});
      document.addEventListener('pointerup',up);
      document.addEventListener('pointercancel',up);
    } else {
      /* 舊瀏覽器退回滑鼠事件 */
      header.addEventListener('mousedown',down);
      document.addEventListener('mousemove',move);
      document.addEventListener('mouseup',up);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initDrag); else initDrag();
})();

/* Intersection observer scroll-reveal */
(function(){
  var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');e.target.querySelectorAll('.count-up').forEach(function(el){if(!el.dataset.done)animateCountUp(el);});io.unobserve(e.target);}});},{threshold:0.12});
  function attach(){document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-stagger,.tl-content').forEach(function(el){io.observe(el);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach); else attach();
})();

function animateCountUp(el){el.dataset.done='1';var target=parseFloat(el.getAttribute('data-target'));var prefix=el.getAttribute('data-prefix')||'';var suffix=el.getAttribute('data-suffix')||'';var decimals=(target%1!==0)?1:0;var duration=1200;var start=null;function step(ts){if(!start)start=ts;var progress=Math.min((ts-start)/duration,1);var eased=1-Math.pow(1-progress,3);var current=(target*eased).toFixed(decimals);el.textContent=prefix+current+suffix;if(progress<1)requestAnimationFrame(step);else el.textContent=prefix+target.toFixed(decimals)+suffix;}requestAnimationFrame(step);}

/* ════════════════════════════════════════════════════════════
   HERO PARTICLE CANVAS
   ════════════════════════════════════════════════════════════ */
function initHeroCanvas() {
  var canvas=document.getElementById('heroCanvas');
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  function resize(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;}
  resize(); window.addEventListener('resize',resize);
  var N=55, pts=[];
  for(var i=0;i<N;i++) pts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:.5+Math.random()*2,vx:(Math.random()-.5)*.22,vy:-.1-Math.random()*.2,a:.1+Math.random()*.5,p:Math.random()*Math.PI*2});
  var MAX=130;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.p+=.018;if(p.y<-10)p.y=canvas.height+10;if(p.x<-10)p.x=canvas.width+10;if(p.x>canvas.width+10)p.x=-10;});
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x;var dy=pts[i].y-pts[j].y;var d=Math.sqrt(dx*dx+dy*dy);if(d<MAX){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(0,150,255,'+(1-d/MAX)*.07+')';ctx.lineWidth=1;ctx.stroke();}}
    pts.forEach(function(p){var g=.5+.5*Math.sin(p.p);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(100,180,255,'+(p.a*g)+')';ctx.fill();});
    if(!prefersReducedMotion) requestAnimationFrame(draw);
  }
  draw();
}

/* ── Hero staggered entrance ── */
function initHeroAnims() {
  var seq = [
    document.querySelector('.hero-logo-wrap'),
    document.querySelector('.hero-zh'),
    document.querySelector('.hero-en'),
    document.querySelector('.hero-rule'),
    document.querySelector('.hero-meta'),
    document.querySelector('.hero-scroll')
  ];
  seq.forEach(function(el,i){ if(!el)return; setTimeout(function(){ el.classList.add('in'); }, 200+i*160); });
}

/* ── Init on DOM ready ── */
document.addEventListener('DOMContentLoaded', function() {
  initHeroCanvas();
  initHeroAnims();
});

/* ════════════════════════════════════════════════════════════
   PAGE 2 — OVERVIEW JS  (snap + reveal + card nav)
   ════════════════════════════════════════════════════════════ */

/* Re-init DOMContentLoaded to include Page 2 */
document.addEventListener('DOMContentLoaded', function() {
  initOverviewSnap();
  initOverviewReveal();
});

/* Card click → smooth scroll to chapter (overridden below by window.ovCardClick) */
function ovCardClick(el, targetId) {
  var target = document.getElementById(targetId);
  if (!target) return;
  window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
}

/* Snap-to-overview on downward scroll from hero-page
   · Wheel DOWN while hero is visible → snap to overview
   · Scrolling UP                     → normal, no forced snap  */
function initOverviewSnap() {
  var heroPage     = document.getElementById('hero-page');
  var overviewPage = document.getElementById('overview-page');
  if (!heroPage || !overviewPage) return;
  /* 尊重使用者「減少動態效果」偏好：完全交還原生捲動 */
  if (prefersReducedMotion) return;

  var snapping    = false;
  var COOLDOWN_MS = 700;
  var DELTA_MIN   = 12; /* 過濾觸控板微小慣性，避免誤觸劫持捲動 */

  function isOnHero() {
    var rect = heroPage.getBoundingClientRect();
    /* 僅在 hero 幾乎貼齊頂端時才接管，離開後不再干擾 */
    return rect.top > -40 && rect.top < (window.innerHeight * 0.4);
  }
  function doSnap() {
    if (snapping) return;
    snapping = true;
    var top = overviewPage.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    setTimeout(function() { snapping = false; }, COOLDOWN_MS);
  }

  window.addEventListener('wheel', function(e) {
    if (snapping) return;
    if (e.deltaY > DELTA_MIN && isOnHero()) { e.preventDefault(); doSnap(); }
  }, { passive: false });

  var touchStartY = 0;
  window.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', function(e) {
    if (snapping) return;
    if ((touchStartY - e.changedTouches[0].clientY) > 40 && isOnHero()) doSnap();
  }, { passive: true });
}

/* Reveal animations for overview-page elements */
function initOverviewReveal() {
  var page = document.getElementById('overview-page');
  if (!page) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  var topInner = page.querySelector('.ov-top-inner');
  if (topInner) io.observe(topInner);

  page.querySelectorAll('.ov-card').forEach(function(card, i) {
    card.style.transition =
      'opacity .55s ' + (i * 0.07) + 's cubic-bezier(.22,1,.36,1),' +
      'transform .55s ' + (i * 0.07) + 's cubic-bezier(.22,1,.36,1),' +
      'box-shadow .32s cubic-bezier(.22,1,.36,1)';
    io.observe(card);
  });
}

/* ════════════════════════════════════════════════════════════
   HERO VIDEO CAROUSEL
   策略：只預載「下一支」，播第 N 支時才開始載 N+1 支，
   避免頻寬被後面的影片搶走導致當前影片播完還沒載好。
   ════════════════════════════════════════════════════════════ */
(function() {
  var vids  = Array.from(document.querySelectorAll('.hero-vid'));
  var dots  = Array.from(document.querySelectorAll('.hvd'));
  if (!vids.length) return;

  var current = 0;
  var loaded  = new Array(vids.length).fill(false);

  // 強制載入指定 index 的影片（只載一次）
  function preloadVid(idx) {
    if (loaded[idx]) return;
    loaded[idx] = true;
    vids[idx].preload = 'auto';
    vids[idx].load();
  }

  function safePlay(vid) {
    vid.muted = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', '');
    var p = vid.play();
    if (p && typeof p.catch === 'function') p.catch(function(){});
  }

  function goTo(idx) {
    var prev = current;
    current  = idx;

    // 先顯示新影片（fade-in），再 pause 舊的（避免黑畫面）
    vids[current].classList.add('active');
    dots[current].classList.add('active');
    safePlay(vids[current]);

    setTimeout(function() {
      vids[prev].classList.remove('active');
      dots[prev].classList.remove('active');
      vids[prev].pause();
      vids[prev].currentTime = 0;
    }, 80);

    // 開始播第 current 支時，順手預載下一支
    preloadVid((current + 1) % vids.length);

    var canvas = document.getElementById('heroCanvas');
    if (canvas) canvas.style.opacity = '0.35';
  }

  // 第 0 支直接載入並播放；同時預載第 1 支
  preloadVid(0);
  preloadVid(1);
  safePlay(vids[0]);

  // Auto-advance
  vids.forEach(function(vid, i) {
    vid.addEventListener('ended', function() {
      goTo((i + 1) % vids.length);
    });
    vid.addEventListener('error', function() {
      if (i === current) goTo((i + 1) % vids.length);
      else vid.style.display = 'none';
    });
  });

  // Dot click
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); });
  });
})();

/* ════════════════════════════════════════════════════════════
   HEADER — hide on hero, reveal on scroll
   ════════════════════════════════════════════════════════════ */
(function() {
  var header    = document.querySelector('header');
  var heroPage  = document.getElementById('hero-page');
  if (!header || !heroPage) return;

  function checkHeader() {
    var heroBottom = heroPage.getBoundingClientRect().bottom;
    if (heroBottom > 80) {
      header.classList.add('hero-hidden');
    } else {
      header.classList.remove('hero-hidden');
    }
  }

  checkHeader();
  window.addEventListener('scroll', checkHeader, { passive: true });
})();

/* ════════════════════════════════════════════════════════════
   ovCardClick — card nav uses same precise offsetTop scroll
   ════════════════════════════════════════════════════════════ */
window.ovCardClick = function(el, targetId) {
  var target = document.getElementById(targetId);
  if (!target) return;
  var headerH = (document.querySelector('header') || {}).offsetHeight || 0;
  var top = target.getBoundingClientRect().top + window.scrollY - headerH;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

/* ════════════════════════════════════════════════════════════
   TP0 · Company Overview — JS
   Append this block to the bottom of main.js
   ════════════════════════════════════════════════════════════ */

/* ── Smooth scroll helper (used by TP0 jump pills & chapter nav) ─ */
function smoothScrollTo(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var top = el.getBoundingClientRect().top + window.scrollY - (getHeaderH() + 12);
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

/* ── scrollToSection alias for TP2 compatibility ─────────── */
function scrollToSection(id) { smoothScrollTo(id); }


/* ── IntersectionObserver — fires .reveal animations ─────────── */
(function() {
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function() { el.classList.add('visible'); }, delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  /* Observe on DOMContentLoaded; re-observe any added later */
  function observeReveals() {
    document.querySelectorAll('.reveal:not(.observed)').forEach(function(el) {
      el.classList.add('observed');
      io.observe(el);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeReveals);
  } else {
    observeReveals();
  }
  /* Also run once after a short delay in case sections added after load */
  setTimeout(observeReveals, 800);
})();

/* ── S4 · Org tab switcher ────────────────────────────────────── */
function switchOrgTab(btn, tabId) {
  btn.closest('.org-tabs').querySelectorAll('.org-tab').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  /* panels are siblings of .org-tabs inside .org-panels wrapper */
  var panels = document.querySelectorAll('.org-panel');
  panels.forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('org-tab-' + tabId);
  if (target) target.classList.add('active');
}

/* ── S5 · Product year switcher ───────────────────────────────── */
/*
  productData shape:
  {
    2021: [ { pct: 60, val: '60%' }, { pct: 20, val: '20%' }, ... ],
    ...
  }
  Update this object with your actual data.
*/
var productData = {
  2021: [ { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' } ],
  2022: [ { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' } ],
  2023: [ { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' } ],
  2024: [ { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' } ],
  2025: [ { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' }, { pct: 0, val: '—%' } ]
};

function switchProductYear(btn, year) {
  document.querySelectorAll('.py-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var data = productData[year];
  if (!data) return;
  document.querySelectorAll('.product-card').forEach(function(card, i) {
    var d = data[i];
    if (!d) return;
    var bar = card.querySelector('.product-bar');
    var val = card.querySelector('.product-bar-val');
    if (bar) { bar.style.width = '0%'; setTimeout(function() { bar.style.width = d.pct + '%'; }, 30); }
    if (val) { val.textContent = d.val; }
  });
}

/* Animate bars when S5 scrolls into view */
(function() {
  var s5 = document.getElementById('tp0-s5');
  if (!s5) return;
  var fired = false;
  var io5 = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      document.querySelectorAll('.product-bar').forEach(function(bar) {
        var pct = bar.getAttribute('data-pct') || '0';
        setTimeout(function() { bar.style.width = pct + '%'; }, 200);
      });
      io5.disconnect();
    }
  }, { threshold: 0.2 });
  io5.observe(s5);
})();

/* ── S6 · Finance tab switcher ────────────────────────────────── */
function switchFinTab(btn, tabId) {
  btn.closest('.fin-tabs').querySelectorAll('.fin-tab').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  var panels = document.querySelectorAll('.fin-panel');
  panels.forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('fin-tab-' + tabId);
  if (target) target.classList.add('active');
}



/* ═══════════════════════════════════════════════════════════════
   PATCH JS — 貼到 main.js 最底部（tp0-scripts.js 之後）
   1. toggleNavChapter()  — 展開/收合子選單
   2. smoothNavSub()      — 子項目點擊跳轉 + 標記 active
   3. Scroll-spy          — 自動偵測當前章節 & 子區塊，更新 nav
   ═══════════════════════════════════════════════════════════════ */

/* ── 1. 展開 / 收合子選單 ─────────────────────────────────── */
function toggleNavChapter(chapterId) {
  var toggle  = document.querySelector('#nav-chapter-' + chapterId + ' .nav-chapter-toggle');
  var subList = document.getElementById('nav-sub-' + chapterId);
  if (!toggle || !subList) return;
  var isOpen = subList.classList.contains('open');
  document.querySelectorAll('.nav-sub-list.open').forEach(function(l) { l.classList.remove('open'); });
  document.querySelectorAll('.nav-chapter-toggle[aria-expanded="true"]').forEach(function(t) { t.setAttribute('aria-expanded','false'); });
  if (!isOpen) {
    subList.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }
}

/* ── 2. 子項目跳轉 ───────────────────────────────────────── */
function smoothNavSub(el, targetId) {
  /* 標記 active */
  document.querySelectorAll('.nav-sub-item').forEach(function(i) {
    i.classList.remove('active');
  });
  el.classList.add('active');

  /* 跳轉 */
  smoothScrollTo(targetId);

  /* 手機版：關側邊欄 */
  if (window.innerWidth < 900) closeNav();
}

/* ── 3. Scroll-spy — 自動偵測章節 & 子區塊 ──────────────── */
/*
  監測的節點結構：
  章節頂層 IDs（控制哪個 nav-chapter 展開）：
    tp0-page, tp1-page, tp2-page, tp3-page, conclusion-page

  TP0 子區塊 IDs（控制哪個 nav-sub-item 高亮）：
    tp0-s1 ~ tp0-s6

  之後 TP1~3 / Conclusion 補充子區塊時，只要在 spySections 裡加入即可
*/

var spyMap = [
  /* [ sectionId, chapterId, subId ] */
  /* Hero & Overview — 不展開任何章節 */
  ['hero-page',      null,          null],
  ['overview-page',  null,          null],
  /* TP0 */
  ['tp0-page',       'tp0',         'tp0-page'],
  ['tp0-s1',         'tp0',         'tp0-s1'],
  ['tp0-s2',         'tp0',         'tp0-s2'],
  ['tp0-s3',         'tp0',         'tp0-s3'],
  ['tp0-s4',         'tp0',         'tp0-s4'],
  ['tp0-s5',         'tp0',         'tp0-s5'],
  ['tp0-s6',         'tp0',         'tp0-s6'],
  /* TP1–3 & Conclusion — 子區塊待補 */
  ['tp1-page',       'tp1',         'tp1-page'],
  ['tp2-page',       'tp2',         'tp2-page'],
  ['tp3-page',       'tp3',         'tp3-page'],
  ['conclusion-page','conclusion',  'conclusion-page'],
];

var _spyLastChapter = null;
var _spyLastSub     = null;

function runScrollSpy() {
  var scrollY   = window.scrollY + window.innerHeight * 0.35;
  var best      = null;

  for (var i = 0; i < spyMap.length; i++) {
    var el = document.getElementById(spyMap[i][0]);
    if (!el) continue;
    if (el.getBoundingClientRect().top + window.scrollY <= scrollY) {
      best = spyMap[i];
    }
  }

  if (!best) return;
  var chapterId = best[1];
  var subId     = best[2];

  /* ── 章節展開 ── */
  if (chapterId !== _spyLastChapter) {
    _spyLastChapter = chapterId;

    /* 收合全部 */
    document.querySelectorAll('.nav-sub-list').forEach(function(l) { l.classList.remove('open'); });
    document.querySelectorAll('.nav-chapter-header').forEach(function(h) { h.setAttribute('aria-expanded','false'); });
    document.querySelectorAll('.nav-chapter-header').forEach(function(h) { h.classList.remove('active'); });

    /* 展開目前章節 */
    if (chapterId) {
      var subList = document.getElementById('nav-sub-' + chapterId);
      var header  = document.querySelector('#nav-chapter-' + chapterId + ' .nav-chapter-header');
      if (subList) subList.classList.add('open');
      if (header)  { header.setAttribute('aria-expanded','true'); header.classList.add('active'); }
    }
  }

  /* ── 子項目高亮 ── */
  if (subId !== _spyLastSub) {
    _spyLastSub = subId;
    document.querySelectorAll('.nav-sub-item').forEach(function(i) { i.classList.remove('active'); });
    if (subId) {
      /* 找到 href 包含 subId 的 nav-sub-item */
      var target = document.querySelector('.nav-sub-item[href="#' + subId + '"]');
      if (target) target.classList.add('active');
    }
  }
}

/* Scroll-spy throttled */
var _spyTicking = false;
window.addEventListener('scroll', function() {
  if (!_spyTicking) {
    requestAnimationFrame(function() { runScrollSpy(); _spyTicking = false; });
    _spyTicking = true;
  }
}, { passive: true });

/* 初始執行一次 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runScrollSpy);
} else {
  setTimeout(runScrollSpy, 200);
}

/* ════════════════════════════════════════════════════════
   TP0 — Company History Timeline
   ════════════════════════════════════════════════════════ */
const tp0HistoryData = [
  { year: 1990, en: { era: '🏗️ Foundation', title: 'ASUS Incorporated', body: 'ASUS was incorporated in April with a paid-in capital of NT$30 million and became a direct customer of Intel (U.S.A.).' }, zh: { era: '🏗️ 公司創立', title: '華碩電腦股份有限公司成立', body: '華碩於4月正式設立，資本額新台幣3,000萬元，並成為英特爾（美國）的直接客戶。' } },
  { year: 1994, en: { era: '🔁 Rebranding', title: 'Renamed ASUSTeK & EISA 486 Motherboard', body: 'The company changed its name to ASUSTeK Computer Inc. and officially launched the EISA 486 motherboard.' }, zh: { era: '🔁 品牌更名', title: '更名華碩電腦，推出EISA 486主機板', body: '公司正式更名為華碩電腦股份有限公司，並推出EISA 486主機板正式上市。' } },
  { year: 1996, en: { era: '📈 IPO', title: 'Listed on Taiwan Stock Exchange', body: 'ASUS officially went public on the Taiwan Stock Exchange (TWSE).' }, zh: { era: '📈 股票上市', title: '於台灣證券交易所掛牌上市', body: '華碩正式於台灣證券交易所（TWSE）掛牌上市。' } },
  { year: 1997, en: { era: '🌍 Global Expansion', title: 'International Service Centers Established', body: 'Set up customer service centers in China, Netherlands, USA, Czech Republic, Australia, and Japan.' }, zh: { era: '🌍 國際佈局', title: '海外客服中心相繼設立', body: '於中國、荷蘭、美國、捷克、澳洲及日本等地設立客戶服務中心。' } },
  { year: 2000, en: { era: '🤝 Customer Service', title: 'ASUS Royal Club Launched', body: 'Established the ASUS Royal Club, providing 24/7 technology support and customer service.' }, zh: { era: '🤝 客戶服務', title: '華碩皇家俱樂部成立', body: '成立華碩皇家俱樂部，提供全天候技術支援與客戶服務。' } },
  { year: 2001, en: { era: '📱 Mobile & Growth', title: 'First 3G Phone & Top-10 Notebook Brand', body: 'Launched the first ASUS 3G phone (J100) and became one of the Top-10 notebook brands globally.' }, zh: { era: '📱 行動裝置', title: '首款3G手機上市，躋身全球十大筆電品牌', body: '推出首款華碩3G翻蓋手機（J100），並躋身全球十大筆記型電腦品牌之列。' } },
  { year: 2003, en: { era: '🏭 Industrial Tech', title: 'Entry into Industrial Computing', body: 'ASUS entered the industrial computer field, expanding beyond consumer electronics.' }, zh: { era: '🏭 工業電腦', title: '進軍工業電腦領域', body: '華碩正式進入工業電腦領域，業務範疇從消費性電子延伸至工業應用。' } },
  { year: 2005, en: { era: '🎮 Gaming', title: 'Republic of Gamers (ROG) Founded', body: 'ROG — the only ASUS sub-brand — was established for high-performance gaming hardware.' }, zh: { era: '🎮 電競品牌', title: '玩家共和國（ROG）電競子品牌成立', body: '玩家共和國（ROG）正式成立，為華碩旗下唯一子品牌，專注高效能電競硬體。' } },
  { year: 2007, en: { era: '🔀 Restructuring', title: 'Spin-off Pegatron; Eee PC Launched', body: 'ASUS divided its brand-name and OEM/ODM businesses (establishing Pegatron), and launched the iconic Eee PC.' }, zh: { era: '🔀 組織分割', title: '品牌業務與代工業務分割；Eee PC 上市', body: '華碩正式分割品牌業務與OEM/ODM業務（和碩聯合成立），同期推出Eee PC。' } },
  { year: 2011, en: { era: '☁️ Cloud Strategy', title: 'ASUS Private Cloud Launched', body: 'Launched "ASUS Private Clouding" in 2011, and announced the ASUS Cloud strategy at the 2014 Cloud Day event.' }, zh: { era: '☁️ 雲端策略', title: '私有雲服務啟動', body: '2011年推出「ASUS私有雲端」，並於2014年華碩雲端日正式發表雲端策略。' } },
  { year: 2015, en: { era: '🏬 Retail & VR', title: 'First Retail Stores & ROG VR Pavilion', body: 'Opened first experiential shop in Taipei\'s Syntrend Space and launched the first ROG VR amusement pavilion.' }, zh: { era: '🏬 零售擴張', title: '首間體驗店開幕，推出ROG VR電競館', body: '於台北三創生活園區開設首間體驗店，推出首個ROG VR電競館；2016年在東京開設旗艦店。' } },
  { year: 2017, en: { era: '🤖 Smart Robotics', title: 'Zenbo Smart Robot Unveiled', body: 'Unveiled Zenbo Smart Robot usage scenarios, marking ASUS\'s entry into home AI robotics.' }, zh: { era: '🤖 智慧機器人', title: 'Zenbo 智慧機器人發表', body: '發表Zenbo智慧機器人多項應用場景，標誌華碩進軍家用AI機器人領域。' } },
  { year: 2018, en: { era: '🧠 AI & E-sports', title: 'First AI Smartphone & ROG Phone', body: 'Launched AI smartphone ZenFone 5, and the first gaming phone "ROG Phone" in Taiwan.' }, zh: { era: '🧠 AI與電競手機', title: '首款AI手機及ROG Phone上市', body: '推出首款AI智慧型手機ZenFone 5，並發表首款電競手機「ROG Phone」。' } },
  { year: 2024, en: { era: '🤖 AI Transformation', title: 'AI PCs, ROG Ally & AI Server Surge', body: 'Launched first-gen AI Laptops; expanded ROG Ally handheld ecosystem; AI Server revenue grew over 50% YoY.' }, zh: { era: '🤖 AI轉型元年', title: 'AI筆電、ROG Ally與AI伺服器爆發', body: '推出第一代AI筆電；擴展ROG Ally掌機生態系；AI伺服器年增逾50%，確立AI基礎設施為重要成長支柱。' } },
  { year: 2025, en: { era: '🌐 IS BG Founded', title: 'Infrastructure Solutions BG Established', body: 'Founded IS BG to integrate Sovereign AI, Physical AI, and Smart City solutions. Established Data Center Business Unit (DC BU).' }, zh: { era: '🌐 基礎方案事業群', title: '基礎方案事業群（IS BG）正式成立', body: '成立IS BG，整合主權AI、實體AI與智慧城市解決方案；設立資料中心事業部（DC BU）。' } },
  { year: 2026, en: { era: '🚀 Next-Gen AI', title: 'CES 2026: WiFi 8, Copilot+ PCs & ROG Strix', body: 'Showcased WiFi 8 and next-gen Copilot+ PCs targeting >30% market share. Launched ROG Strix G16 and G18 gaming laptops.' }, zh: { era: '🚀 AI PC與次世代電競', title: 'CES 2026：WiFi 8、Copilot+ PC 與 ROG Strix', body: '展示WiFi 8及新一代Copilot+ PC，目標市占率逾30%；發表ROG Strix G16與G18電競筆電。' } },
];

function buildTP0TimelineDots() {
  const c = document.getElementById('chDots');
  if (!c) return;
  c.innerHTML = tp0HistoryData.map((d, i) =>
    `<button class="ch-dot${i === 0 ? ' active' : ''}" onclick="updateTimeline(${i})" title="${d.year}"></button>`
  ).join('');
}

function updateTimeline(idx) {
  idx = parseInt(idx);
  const lang = document.body.getAttribute('data-lang') || 'en';
  const d = tp0HistoryData[idx]; if (!d) return;
  const t = d[lang];
  const yr = document.getElementById('timelineYearDisplay');
  const era = document.getElementById('chEra');
  const title = document.getElementById('chTitle');
  const body = document.getElementById('chBody');
  const range = document.getElementById('timelineRange');
  if (yr) yr.textContent = d.year;
  if (era) era.textContent = t.era;
  if (title) title.textContent = t.title;
  if (body) body.textContent = t.body;
  if (range) range.value = idx;
  document.querySelectorAll('.ch-dot').forEach((dot, i) => dot.classList.toggle('active', i === idx));
  const card = document.getElementById('chCard');
  if (card) { card.classList.remove('animate'); void card.offsetWidth; card.classList.add('animate'); }
}

document.addEventListener('DOMContentLoaded', () => {
  buildTP0TimelineDots();
  s2BuildDots();
  s2UpdateCaption(0);
  updateTimeline(0);
  s2StartAuto();
});

/* ════════════════════════════════════════════════════════
   TP0 — News Modal
   ════════════════════════════════════════════════════════ */
const tp0NewsData = {
  n1: {
    en: { date: 'March 30, 2026', tag: '📣 Market Share', title: 'ASUS Commercial PCs Top Taiwan Market Share for 22 Consecutive Years',
      source: '<a href="https://press.asus.com/tw/news/press-releases/asus-expertbook-p5-g2-ai-laptop/" target="_blank" rel="noopener">ASUS Press Release ↗</a>',
      body: [
        { head: 'Record Market Share', text: 'According to IDC, ASUS commercial PCs have topped Taiwan\'s market share 19 times. In 2025, commercial laptops achieved 32.2% market share (22 consecutive years); commercial desktops led at 40.1%.' },
        { head: 'New AI Flagship: ExpertBook P5 G2', text: 'ExpertBook P5 G2 (PM5406): up to AMD Ryzen™ AI 9 HX with 55 TOPS NPU, up to 96GB RAM, 3TB PCIe® 4.0 dual SSD.' },
        { head: 'AI & Security Features', text: 'ASUS-exclusive AI ExpertMeet for real-time transcription, Microsoft Copilot, FIDO2 biometric login, dTPM 2.0, 5-year BIOS update support.' },
        { head: 'Durability & Pricing', text: 'MIL-STD 810H military-grade. Starting at NT$40,900. DaaS leasing and small-batch customisation available for SMEs.' },
      ]
    },
    zh: { date: '2026年3月30日', tag: '📣 市佔率', title: '華碩商用電腦2025市佔稱冠！連續22年蟬聯台灣年度冠軍',
      source: '<a href="https://press.asus.com/tw/news/press-releases/asus-expertbook-p5-g2-ai-laptop/" target="_blank" rel="noopener">華碩新聞稿 ↗</a>',
      body: [
        { head: '創紀錄市佔', text: '據IDC最新報告，商用筆電以32.2%市佔率連續22年蟬聯年度冠軍；商用桌機亦以40.1%領先全台。' },
        { head: '全新AI旗艦：ExpertBook P5 G2', text: '最高搭載AMD Ryzen™ AI 9 HX、55 TOPS NPU，最高96GB記憶體、3TB PCIe® 4.0雙SSD。' },
        { head: 'AI應用與資安防護', text: '搭載AI ExpertMeet即時轉錄翻譯；整合Microsoft Copilot，內建FIDO2生物辨識、dTPM 2.0，五年BIOS更新支援。' },
        { head: '耐用性與售價', text: '符合MIL-STD 810H美軍規，建議售價$40,900起，提供DaaS租賃服務與少量客製。' },
      ]
    }
  },
  n2: {
    en: { date: 'April 2, 2026', tag: '🏢 Corporate Strategy', title: 'ASUS Establishes Infrastructure Solutions Business Group on Its 37th Anniversary',
      source: '<a href="https://cmnews.com.tw/article/newsyoudeservetoknow-2c1f4647-2e1b-11f1-89f3-57d2aff4371f" target="_blank" rel="noopener">Cmoney News ↗</a>',
      body: [
        { head: 'New Business Group Founded', text: 'Co-CEOs S.Y. Hsu and Samson Hu announced IS BG on ASUS\'s 37th anniversary — consolidating enterprise-grade capabilities for end-to-end solutions.' },
        { head: 'Strategic Focus', text: 'IS BG integrates AI PCs, AI Infrastructure, Sovereign AI, Physical AI, and Smart City. Three business units established within one month of founding.' },
        { head: 'Leadership Expansion', text: 'Chao Guo-wei, former NUC BU GM, joined IS BG to lead the Data Center Business Unit — bringing a 100-person team from Intel.' },
        { head: 'Strategic Outlook', text: 'IS BG is one of four core BGs in ASUS\'s AI transformation. The team targets revenue growth multiples as the AI market expands.' },
      ]
    },
    zh: { date: '2026年4月2日', tag: '🏢 企業策略', title: '華碩成立37週年宣布新基礎方案事業群（IS BG）加速AI全面轉型',
      source: '<a href="https://cmnews.com.tw/article/newsyoudeservetoknow-2c1f4647-2e1b-11f1-89f3-57d2aff4371f" target="_blank" rel="noopener">CMoney ↗</a>',
      body: [
        { head: '新事業群成立', text: '兩位共同執行長透過內部信宣布成立IS BG，整合企業級專業能力，提供端到端解決方案。' },
        { head: '策略定位', text: 'IS BG整合AI PC、AI基礎設施、主權AI、實體AI與智慧城市解決方案，成立滿月已建立三大事業單位。' },
        { head: '人才擴充', text: '原NUC事業部總經理趙國維加入，領導資料中心事業部（DC BU），帶領從英特爾接手的百人團隊。' },
        { head: '後續發展', text: 'IS BG為華碩AI轉型策略四大支柱之一，目標業績倍數成長。' },
      ]
    }
  },
  n3: {
    en: { date: 'As of April 1, 2026', tag: '📊 Stock & Financials', title: 'ASUS (2357): Fundamentals, Shareholding & Technical Analysis',
      source: 'Market Research Compilation',
      body: [
        { head: '📈 Fundamentals', text: 'Market cap NT$421.2B. After-tax ROE 7.4%, P/E 11.5. Feb 2026 revenue NT$54.35B (+19.12% YoY); Jan 2026 NT$67.94B (+79.97% YoY).' },
        { head: '🏦 Institutional Shareholding', text: 'Foreign -265, Investment trusts +370, Dealers +5, Combined +111. Close NT$567. Government funds net buy +196.' },
        { head: '📉 Technical Analysis', text: 'Close NT$532 (+1.33%). Above MA5 & MA10, below MA20 & MA60 — mid-term consolidation. Support ~NT$500, resistance ~NT$580.' },
        { head: '⚠️ Risk Notes', text: 'Monitor volume sustainability and monthly revenue trend. Key risks: intensifying competition and technology integration challenges.' },
      ]
    },
    zh: { date: '截至2026年4月1日', tag: '📊 股票與財務', title: '華碩(2357)：基本面、籌碼面與技術面表現',
      source: '市場研究彙整',
      body: [
        { head: '📈 基本面', text: '總市值4211.7億元。稅後ROE 7.4%，本益比11.5。2026年2月543.5億元（年增19.12%）；1月679.4億元（年增79.97%）。' },
        { head: '🏦 籌碼面', text: '外資-265、投信+370、自營商+5，合計+111，收盤567元。官股買賣超+196，持股比率0.86%。' },
        { head: '📉 技術面', text: '收盤532元（漲1.33%）。高於MA5與MA10，低於MA20與MA60，中期整理格局。支撐約500元，壓力約580元。' },
        { head: '⚠️ 風險提示', text: '注意量能續航、月營收變化及AI業務進展。潛在風險：市場競爭加劇與技術整合挑戰。' },
      ]
    }
  }
};

function openTP0News(key) {
  const lang = document.body.getAttribute('data-lang') || 'en';
  const d = tp0NewsData[key][lang];
  const bodyHTML = d.body.map(b => `
    <div class="tp0-modal-item">
      <div class="tp0-modal-item-head">${b.head}</div>
      <div class="tp0-modal-item-text">${b.text}</div>
    </div>`).join('');
  document.getElementById('tp0NewsContent').innerHTML = `
    <div class="tp0-modal-meta">
      <span class="tp0-modal-tag">${d.tag}</span>
      <span class="tp0-modal-date">${d.date}</span>
    </div>
    <h2 class="tp0-modal-title">${d.title}</h2>
    <p class="tp0-modal-source">${lang === 'en' ? 'Source' : '來源'}：${d.source}</p>
    <div class="tp0-modal-body">${bodyHTML}</div>`;
  document.getElementById('tp0NewsModal').classList.add('open');
}
function closeTP0News(e) {
  if (e === null || e.target === document.getElementById('tp0NewsModal'))
    document.getElementById('tp0NewsModal').classList.remove('open');
}

/* ════════════════════════════════════════════════════════
   TP0 — VMV Modal
   ════════════════════════════════════════════════════════ */
const tp0VMVData = {
  vision: {
    en: { icon: '🌟', title: 'Vision — to-be', tagline: '"In Search of Incredible"',
      body: 'ASUS aspires to be a world-admired, innovative leading technology enterprise for the new digital era. Guided by "In Search of Incredible," we continuously drive invention through innovation — creating unparalleled digital life experiences.' },
    zh: { icon: '🌟', title: '願景 — to-be', tagline: '「追尋無與倫比」',
      body: '華碩致力成為數位新世代備受推崇的科技創新領導企業。追求「追尋無與倫比」的品牌精神，持續以創新驅動發明，打造無與倫比的數位生活體驗。' }
  },
  mission: {
    en: { icon: '🎯', title: 'Mission — to-do', tagline: '"Human-Centred · Experience First"',
      body: 'ASUS\'s mission is to provide users worldwide with outstanding experiences through innovative products — allowing technology to truly improve human life. We emphasise Human-Centred and Experience First, pursuing perfect quality and humanised applications.' },
    zh: { icon: '🎯', title: '使命 — to-do', tagline: '「以人為本」・「體驗至上」',
      body: '華碩的使命是以創新產品和解決方案，為全球使用者提供卓越的體驗，讓科技真正改善人類生活。強調「以人為本」與「體驗至上」，追求完美品質與人性化應用。' }
  },
  values: {
    en: { icon: '💎', title: 'Values — to-behave', tagline: 'ASUS DNA',
      items: [
        { name: '① Sincerity & Pragmatism 崇本務實', desc: 'Emphasis on solid technical foundations and a pragmatic attitude — pursuing perfect quality and reliability.' },
        { name: '② Lean Thinking 精實思維', desc: 'Continuously improving processes and efficiency through Lean Six Sigma principles — conserving resources and streamlining costs.' },
        { name: '③ Innovation & Aesthetics 創新惟美', desc: 'Pursuing innovation and beauty like artists — creating solutions that are aesthetically refined and practically useful, with customer needs at the core.' }
      ]
    },
    zh: { icon: '💎', title: '核心價值 — to-behave', tagline: '華碩企業文化基因（ASUS DNA）',
      items: [
        { name: '① 崇本務實', desc: '強調紮實的技術基礎與務實態度，追求完美品質與可靠性。' },
        { name: '② 精實思維', desc: '持續改善流程與效率，結合精實六標準差原則，節省資源並精簡成本。' },
        { name: '③ 創新惟美', desc: '如藝術家般追求創新與美學，打造兼具美感與實用的解決方案，並以客戶需求為核心。' }
      ]
    }
  }
};

function openTP0VMV(key) {
  const lang = document.body.getAttribute('data-lang') || 'en';
  const d = tp0VMVData[key][lang];
  let bodyHTML = '';
  if (d.body) {
    bodyHTML = `<div class="tp0-modal-item"><div class="tp0-modal-item-text">${d.body}</div></div>`;
  } else if (d.items) {
    bodyHTML = d.items.map(it => `
      <div class="tp0-modal-item">
        <div class="tp0-modal-item-head">${it.name}</div>
        <div class="tp0-modal-item-text">${it.desc}</div>
      </div>`).join('');
  }
  document.getElementById('tp0VMVContent').innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;">
      <span style="font-size:36px;">${d.icon}</span>
      <div>
        <h2 class="tp0-modal-title">${d.title}</h2>
        <p style="font-size:14px;font-weight:600;color:var(--text-secondary);font-style:italic;">${d.tagline}</p>
      </div>
    </div>
    <div class="tp0-modal-body">${bodyHTML}</div>`;
  document.getElementById('tp0VMVModal').classList.add('open');
}
function closeTP0VMV(e) {
  if (e === null || e.target === document.getElementById('tp0VMVModal'))
    document.getElementById('tp0VMVModal').classList.remove('open');
}

/* refresh timeline on lang change */
const _origSetLangTP0 = setLang;
setLang = function(lang) {
  _origSetLangTP0(lang);
  const range = document.getElementById('timelineRange');
  if (range) updateTimeline(parseInt(range.value));
  s2UpdateCaption(s2Current);
};

/* ════ S1 Accordion ════ */
function s1Toggle(key) {
  const item = document.getElementById('s1-n' + key);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.s1-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ════ S3 Panel select ════ */
function s3Select(key, el) {
  document.querySelectorAll('.s3-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.s3-pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const pane = document.getElementById('s3-pane-' + key);
  if (pane) pane.classList.add('active');
}

/* ════════════════════════════════════════════════════════
   S2 — Carousel (auto-play, no timeline sync)
   ════════════════════════════════════════════════════════ */
let s2Current = 0;
let s2Timer = null;

/* ════ Magazine Split — S1 ════ */
function magSelect(key, btn) {
  /* Update list buttons */
  document.querySelectorAll('.mag-item').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');

  /* Fade out current story, fade in new */
  const current = document.querySelector('.mag-story.active');
  const next = document.getElementById('mag-story-' + key);
  if (!next || current === next) return;

  if (current) {
    current.style.opacity = '0';
    current.style.transform = 'translateX(-10px)';
    setTimeout(() => {
      current.classList.remove('active');
      current.style.opacity = '';
      current.style.transform = '';
      next.style.opacity = '0';
      next.style.transform = 'translateX(14px)';
      next.classList.add('active');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.style.transition = 'opacity .3s ease, transform .3s cubic-bezier(.22,1,.36,1)';
          next.style.opacity = '1';
          next.style.transform = 'translateX(0)';
        });
      });
    }, 200);
  } else {
    next.classList.add('active');
  }
}

/* ════ S2 Carousel — with caption update ════ */
function s2BuildDots() {
  const c = document.getElementById('s2Dots');
  if (!c) return;
  const slides = document.querySelectorAll('.s2-slide');
  c.innerHTML = Array.from(slides).map((_, i) =>
    `<button class="s2-cdot${i === 0 ? ' active' : ''}" onclick="s2GoTo(${i})" aria-label="Slide ${i+1}"></button>`
  ).join('');
}

function s2UpdateCaption(idx) {
  const slides = document.querySelectorAll('.s2-slide');
  const slide = slides[idx];
  if (!slide) return;
  const lang = document.body.getAttribute('data-lang') || 'en';
  const yr = document.getElementById('s2CaptionYear');
  const txt = document.getElementById('s2CaptionText');
  if (yr) yr.textContent = slide.dataset.year || '';
  if (txt) txt.textContent = lang === 'zh'
    ? (slide.dataset.captionZh || '')
    : (slide.dataset.captionEn || '');
}

function s2GoTo(idx) {
  const slides = document.querySelectorAll('.s2-slide');
  const dots   = document.querySelectorAll('.s2-cdot');
  if (!slides.length) return;
  slides[s2Current].classList.remove('active');
  if (dots[s2Current]) dots[s2Current].classList.remove('active');
  s2Current = (idx + slides.length) % slides.length;
  slides[s2Current].classList.add('active');
  if (dots[s2Current]) dots[s2Current].classList.add('active');
  s2UpdateCaption(s2Current);
}

function s2Prev() { clearInterval(s2Timer); s2GoTo(s2Current - 1); s2StartAuto(); }
function s2Next() { clearInterval(s2Timer); s2GoTo(s2Current + 1); s2StartAuto(); }

function s2StartAuto() {
  clearInterval(s2Timer);
  s2Timer = setInterval(() => s2GoTo(s2Current + 1), 4500);
}


/* ════════════════════════════════════════════════════════
   S5 — SVG Pie Chart
   ════════════════════════════════════════════════════════ */
const S5_DATA = {
  0: { // 2021
    year: '2021',
    slices: [
      { pct: 64, label_en: 'System (PC)', label_zh: '系統產品', color: '#00539B' },
      { pct: 34, label_en: 'Open Platform', label_zh: '開放平台', color: '#0099CC' },
      { pct: 2,  label_en: 'Other', label_zh: '其他', color: '#8aafcc' },
    ]
  },
  1: { // 2022
    year: '2022',
    slices: [
      { pct: 67, label_en: 'System (PC)', label_zh: '系統產品', color: '#00539B' },
      { pct: 32, label_en: 'Open Platform', label_zh: '開放平台', color: '#0099CC' },
      { pct: 1,  label_en: 'Other', label_zh: '其他', color: '#8aafcc' },
    ]
  },
  2: { // 2023
    year: '2023',
    slices: [
      { pct: 63, label_en: 'System (PC)', label_zh: '系統產品', color: '#00539B' },
      { pct: 36, label_en: 'Open Platform', label_zh: '開放平台', color: '#0099CC' },
      { pct: 1,  label_en: 'Other', label_zh: '其他', color: '#8aafcc' },
    ]
  },
  3: { // 2024
    year: '2024',
    slices: [
      { pct: 60, label_en: 'System (PC)', label_zh: '系統產品', color: '#00539B' },
      { pct: 38, label_en: 'Open Platform', label_zh: '開放平台', color: '#0099CC' },
      { pct: 2,  label_en: 'AIoT', label_zh: 'AIoT', color: '#00A651' },
    ]
  },
  4: { // 2025
    year: '2025',
    slices: [
      { pct: 52, label_en: 'System (PC)', label_zh: '系統產品', color: '#00539B' },
      { pct: 28, label_en: 'Open Platform', label_zh: '開放平台', color: '#0099CC' },
      { pct: 18, label_en: 'ISG (AI Server)', label_zh: 'ISG 基礎設施', color: '#E4002B' },
      { pct: 2,  label_en: 'AIoT', label_zh: 'AIoT', color: '#00A651' },
    ]
  }
};

let s5ActiveSlice = -1;

function s5DrawPie(idx) {
  const data = S5_DATA[idx];
  if (!data) return;
  const lang = document.body.getAttribute('data-lang') || 'en';
  const svg = document.getElementById('s5PieG');
  const legend = document.getElementById('s5PieLegend');
  const yearEl = document.getElementById('s5YearDisplay');
  const cval = document.getElementById('s5PieCVal');
  const clabel = document.getElementById('s5PieCLabel');
  if (!svg) return;

  if (yearEl) yearEl.textContent = data.year;

  const R = 118, R_INNER = 64;
  let paths = '';
  let startAngle = -Math.PI / 2;

  data.slices.forEach((sl, i) => {
    const angle = (sl.pct / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = Math.cos(startAngle) * R, y1 = Math.sin(startAngle) * R;
    const x2 = Math.cos(endAngle) * R, y2 = Math.sin(endAngle) * R;
    const ix1 = Math.cos(startAngle) * R_INNER, iy1 = Math.sin(startAngle) * R_INNER;
    const ix2 = Math.cos(endAngle) * R_INNER, iy2 = Math.sin(endAngle) * R_INNER;
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z'
    ].join(' ');
    paths += `<path d="${d}" fill="${sl.color}" opacity="0.92" stroke="var(--surface)" stroke-width="2"
      style="cursor:pointer;transition:opacity .2s,transform .15s"
      onmouseenter="s5SliceHover(${i},${idx})"
      onmouseleave="s5SliceOut()"
      onclick="s5SliceClick(${i},${idx})" />`;
    startAngle = endAngle;
  });
  svg.innerHTML = paths;

  // Legend
  legend.innerHTML = data.slices.map((sl, i) => {
    const label = lang === 'zh' ? sl.label_zh : sl.label_en;
    return `<div class="s5-pie-leg-row" onclick="s5SliceClick(${i},${idx})">
      <span class="s5-pie-leg-dot" style="background:${sl.color}"></span>
      <span>${label}</span>
      <span class="s5-pie-leg-val">${sl.pct}%</span>
    </div>`;
  }).join('');

  // Center default: total
  if (cval) cval.textContent = '100%';
  if (clabel) clabel.textContent = lang === 'zh' ? '全部事業群' : 'All BGs';
}

function s5SliceHover(sliceIdx, yearIdx) {
  const data = S5_DATA[yearIdx];
  const lang = document.body.getAttribute('data-lang') || 'en';
  const sl = data.slices[sliceIdx];
  const cval = document.getElementById('s5PieCVal');
  const clabel = document.getElementById('s5PieCLabel');
  if (cval) cval.textContent = sl.pct + '%';
  if (clabel) clabel.textContent = lang === 'zh' ? sl.label_zh : sl.label_en;
  // Highlight
  const paths = document.querySelectorAll('#s5PieG path');
  paths.forEach((p, i) => { p.style.opacity = i === sliceIdx ? '1' : '0.45'; });
}
function s5SliceOut() {
  const paths = document.querySelectorAll('#s5PieG path');
  paths.forEach(p => { p.style.opacity = '0.92'; });
  const rangeEl = document.getElementById('s5YearRange');
  const idx = rangeEl ? parseInt(rangeEl.value) : 0;
  const data = S5_DATA[idx];
  const lang = document.body.getAttribute('data-lang') || 'en';
  const cval = document.getElementById('s5PieCVal');
  const clabel = document.getElementById('s5PieCLabel');
  if (cval) cval.textContent = '100%';
  if (clabel) clabel.textContent = lang === 'zh' ? '全部事業群' : 'All BGs';
}
function s5SliceClick(sliceIdx, yearIdx) {
  s5SliceHover(sliceIdx, yearIdx);
}

function s5UpdateYear(val) {
  const idx = parseInt(val);
  s5DrawPie(idx);
}

// Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('s5PieSvg')) s5DrawPie(0);
});

/* ═══════════════════════════════════════════════════════════════
   TP1 · INTERACTIVE JAVASCRIPT
   ═══════════════════════════════════════════════════════════════ */

/* ── S1: PESTEL Flip Cards ───────────────────────────────────── */
function tp1Flip(el) {
  el.classList.toggle('flipped');
}

/* ── S2: Value Chain Node Interaction ───────────────────────── */
function tp1VcShow(stage) {
  // Toggle nodes active state
  ['up','mid','down'].forEach(function(s) {
    var n = document.getElementById('vc-node-' + s);
    if (n) n.classList.toggle('active', s === stage);
  });
  // Hide all panels + placeholder
  ['up','mid','down'].forEach(function(s) {
    var d = document.getElementById('vc-detail-' + s);
    if (d) d.style.display = 'none';
  });
  var ph = document.getElementById('vc-placeholder');
  if (ph) ph.style.display = 'none';

  // Show selected — toggle off if already active
  var detail = document.getElementById('vc-detail-' + stage);
  var node   = document.getElementById('vc-node-' + stage);
  if (detail) {
    var alreadyOpen = detail.getAttribute('data-open') === '1';
    if (alreadyOpen) {
      detail.style.display = 'none';
      detail.setAttribute('data-open', '0');
      if (node) node.classList.remove('active');
      if (ph) ph.style.display = '';
    } else {
      detail.style.display = '';
      detail.setAttribute('data-open', '1');
    }
  }
}

function tp1VcClose() {
  ['up','mid','down'].forEach(function(s) {
    var d = document.getElementById('vc-detail-' + s);
    if (d) { d.style.display = 'none'; d.setAttribute('data-open','0'); }
    var n = document.getElementById('vc-node-' + s);
    if (n) n.classList.remove('active');
  });
  var ph = document.getElementById('vc-placeholder');
  if (ph) ph.style.display = '';
}

/* ── S3: Competitor Accordion ───────────────────────────────── */
function tp1AccToggle(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var isOpen = el.classList.contains('open');
  // close all
  document.querySelectorAll('.tp1-accord-item').forEach(function(i) { i.classList.remove('open'); });
  // open if was closed
  if (!isOpen) el.classList.add('open');
}

/* ── S3: Radar Chart ─────────────────────────────────────────── */
var tp1RadarData = {
  asus:   { label: 'ASUS',   color: '#00539B', vals: [95, 90, 88, 92, 85] },
  msi:    { label: 'MSI',    color: '#E4002B', vals: [75, 85, 60, 70, 65] },
  acer:   { label: 'Acer',   color: '#2E8B57', vals: [70, 65, 80, 75, 72] },
  lenovo: { label: 'Lenovo', color: '#E8A000', vals: [85, 70, 92, 88, 80] }
};
var tp1RadarAxes = ['R&D', 'Gaming', 'Brand', 'Supply Chain', 'AI'];

function tp1RadarPt(cx, cy, r, angle) {
  var rad = (angle - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function tp1RadarDraw(company) {
  var svg = document.getElementById('tp1RadarSvg');
  if (!svg) return;
  var cx = 140, cy = 140, maxR = 100, n = tp1RadarAxes.length;
  var data = tp1RadarData[company];
  if (!data) return;

  svg.innerHTML = '';

  // Background circles
  [20,40,60,80,100].forEach(function(pct) {
    var r = maxR * pct / 100;
    var pts = [];
    for (var i = 0; i < n; i++) { var p = tp1RadarPt(cx,cy,r,i*(360/n)); pts.push(p[0]+','+p[1]); }
    var poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill','none');
    poly.setAttribute('stroke','var(--border)');
    poly.setAttribute('stroke-width','1');
    svg.appendChild(poly);
  });

  // Axis lines + labels
  for (var i = 0; i < n; i++) {
    var angle = i * (360/n);
    var outer = tp1RadarPt(cx,cy,maxR,angle);
    var line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',cx); line.setAttribute('y1',cy);
    line.setAttribute('x2',outer[0]); line.setAttribute('y2',outer[1]);
    line.setAttribute('stroke','var(--border)'); line.setAttribute('stroke-width','1');
    svg.appendChild(line);

    var lp = tp1RadarPt(cx,cy,maxR+18,angle);
    var text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',lp[0]); text.setAttribute('y',lp[1]);
    text.setAttribute('text-anchor','middle'); text.setAttribute('dominant-baseline','middle');
    text.setAttribute('font-size','9'); text.setAttribute('fill','var(--text-secondary)');
    text.setAttribute('font-family','var(--font-en)');
    text.textContent = tp1RadarAxes[i];
    svg.appendChild(text);
  }

  // Data polygon
  var pts = [];
  for (var j = 0; j < n; j++) {
    var r = maxR * data.vals[j] / 100;
    var p = tp1RadarPt(cx,cy,r,j*(360/n));
    pts.push(p[0]+','+p[1]);
  }
  var fill = document.createElementNS('http://www.w3.org/2000/svg','polygon');
  fill.setAttribute('points', pts.join(' '));
  fill.setAttribute('fill', data.color.replace('#','') === data.color ? data.color : data.color);
  fill.setAttribute('fill-opacity','0.18');
  fill.setAttribute('stroke', data.color);
  fill.setAttribute('stroke-width','2');
  svg.appendChild(fill);

  // Data dots
  for (var k = 0; k < n; k++) {
    var r2 = maxR * data.vals[k] / 100;
    var p2 = tp1RadarPt(cx,cy,r2,k*(360/n));
    var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx',p2[0]); circle.setAttribute('cy',p2[1]);
    circle.setAttribute('r','4'); circle.setAttribute('fill',data.color);
    svg.appendChild(circle);
  }

  // Center label
  var cl = document.createElementNS('http://www.w3.org/2000/svg','text');
  cl.setAttribute('x',cx); cl.setAttribute('y',cy+3);
  cl.setAttribute('text-anchor','middle'); cl.setAttribute('font-size','11');
  cl.setAttribute('font-weight','700'); cl.setAttribute('fill',data.color);
  cl.setAttribute('font-family','var(--font-en)');
  cl.textContent = data.label;
  svg.appendChild(cl);

  // Legend
  var legend = document.getElementById('tp1RadarLegend');
  if (legend) {
    legend.innerHTML = '<div class="tp1-radar-legend-item"><span class="tp1-radar-legend-dot" style="background:'+data.color+'"></span><span>'+data.label+' — '+tp1RadarAxes.map(function(a,i){return a+': '+data.vals[i]}).join(' · ')+'</span></div>';
  }
}

function tp1RadarShow(company, btn) {
  document.querySelectorAll('.tp1-rtab').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  tp1RadarDraw(company);
}

// Init radar on page load / when section enters view
(function() {
  var tried = false;
  function tryInit() {
    if (tried) return;
    var svg = document.getElementById('tp1RadarSvg');
    if (svg) { tried = true; tp1RadarDraw('asus'); }
  }
  document.addEventListener('DOMContentLoaded', tryInit);
  window.addEventListener('load', tryInit);
  setTimeout(tryInit, 800);
})();

/* ── S4: Competitive Dynamics Tabs ──────────────────────────── */
function tp1DynShow(panel, btn) {
  ['actions','responses','balance'].forEach(function(p) {
    var el = document.getElementById('dyn-'+p);
    if (el) el.style.display = p === panel ? '' : 'none';
  });
  document.querySelectorAll('.tp1-dtab').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
}

/* ── S5: Five Forces Accordion + Pentagon ───────────────────── */
function tp1ForceOpen(force) {
  var fcard = document.getElementById('fcard-' + force);
  if (!fcard) return;
  var isOpen = fcard.classList.contains('active');

  // Close all
  document.querySelectorAll('.tp1-fcard').forEach(function(c) { c.classList.remove('active'); });

  // Open if was closed
  if (!isOpen) fcard.classList.add('active');

  // Highlight pentagon dot
  ['rivalry','suppliers','buyers','entrants','subs'].forEach(function(f) {
    var dot = document.getElementById('pdot-' + f);
    if (dot) {
      dot.setAttribute('r', f === force && !isOpen ? '11' : '8');
      dot.setAttribute('fill', f === force && !isOpen ? '#E4002B' : 'var(--asus-blue)');
    }
  });
}

/* ── S6: Lifecycle tooltip ───────────────────────────────────── */
var tp1LcData = {
  edgeai: {
    title: { en: 'Edge AI & AIoT Solutions', zh: 'Edge AI / AIoT 解決方案' },
    stage: { en: '🌱 Early Growth Stage', zh: '🌱 早期成長階段' },
    stageColor: '#2E8B57',
    en: 'Demand expanding rapidly. Applications: smart manufacturing (AISVision, AISEHS), healthcare (LU800 wireless ultrasound), smart retail & parking. This is ASUS\'s fastest-growing new frontier.',
    zh: '需求快速擴張中。應用涵蓋：智慧製造（AISVision、AISEHS）、智慧醫療（LU800無線超音波）、智慧零售與停車。是華碩目前成長速度最快的新疆界。',
    kpis: []
  },
  gaming: {
    title: { en: 'Gaming Laptops / AI PC / Creator', zh: '電競筆電 / AI PC / 創作者產品' },
    stage: { en: '📈 Growth Stage', zh: '📈 成長期' },
    stageColor: '#2E8B57',
    en: 'Growth rate significantly higher than overall PC market. ROG holds 30%+ global gaming laptop share and ~50% of the high-end RTX 4080/4090 segment. Copilot+ AI PC represents the next growth wave.',
    zh: '增速顯著高於整體PC市場。ROG掌握全球電競筆電市占30%+，以及高階RTX 4080/4090市場的約50%。Copilot+ AI PC 代表下一波成長浪潮。',
    kpis: [
      { label: 'ROG Global Share', v: '30%+' }, { label: 'High-end RTX Segment', v: '~50%' }, { label: 'Copilot+ PC Share', v: '25%+' }
    ]
  },
  consumer: {
    title: { en: 'Consumer Laptops', zh: '一般消費型筆電' },
    stage: { en: '📊 Maturity → Mild Recovery', zh: '📊 成熟期→溫和復甦' },
    stageColor: '#00539B',
    en: 'Mature market experiencing mild recovery driven by post-pandemic WFH persistence and Windows 10 EOL upgrade cycles. ASUS achieved +20% YoY in Q1 2026 — the fastest among top vendors.',
    zh: '成熟市場，受疫後遠距工作維持需求與Windows 10支援終止換機潮帶動，出現溫和復甦。華碩2026 Q1達成+20%年增，五大品牌最高。',
    kpis: [
      { label: 'Q1 2026 YoY', v: '+20%' }, { label: 'Market +', v: '+3.2%' }
    ]
  },
  mobo: {
    title: { en: 'Motherboards & Components', zh: '主機板 / 電腦零組件' },
    stage: { en: '📦 Late Maturity + AI Sub-Growth', zh: '📦 成熟後期 + AI 子市場成長' },
    stageColor: '#00539B',
    en: 'Core segment in late maturity phase — but AI server demand is spawning new high-growth sub-segments. ASUS holds global #1 in motherboards and GPUs, though Gigabyte gained single-digit share in 2024.',
    zh: '核心市場處於成熟後期，但 AI 伺服器需求正在零組件領域拓展新成長子市場。華碩主機板與顯示卡全球第一，但 2024 年出現個位數市占轉移至技嘉。',
    kpis: [
      { label: 'Global MB Rank', v: '#1' }
    ]
  }
};

function tp1LcShow(segment) {
  var d = tp1LcData[segment];
  if (!d) return;
  var lang = document.body.getAttribute('data-lang') || 'en';
  var tooltip = document.getElementById('tp1LcTooltip');
  var content = document.getElementById('tp1LcTooltipContent');
  if (!tooltip || !content) return;

  var kpisHtml = '';
  if (d.kpis && d.kpis.length) {
    kpisHtml = '<div class="tp1-lc-tooltip-kpis">' +
      d.kpis.map(function(k){ return '<span class="tp1-lc-tooltip-kpi"><strong>'+k.v+'</strong> '+k.label+'</span>'; }).join('') +
      '</div>';
  }

  content.innerHTML =
    '<div class="tp1-lc-tooltip-title">' + (lang === 'zh' ? d.title.zh : d.title.en) + '</div>' +
    '<div class="tp1-lc-tooltip-stage" style="color:' + d.stageColor + '">' + (lang === 'zh' ? d.stage.zh : d.stage.en) + '</div>' +
    '<p>' + (lang === 'zh' ? d.zh : d.en) + '</p>' +
    kpisHtml;

  tooltip.style.display = '';
}

/* ══ TP1 (from TP1.html) ══════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   AUDIO GUIDE — Web Speech API  (TP1 ASUS Research)
   ═══════════════════════════════════════════════════════════ */

var audioScripts = {
  en: {
    'hero': [
      "Welcome to the ASUS Term Project 1 research report.",
      "This report covers five key sections: PESTEL macro analysis, industry value chain, competitor analysis, Porter's Five Forces, and industry lifecycle with recent news.",
      "Use the Audio Guide button on each section to hear a summary, or press the header button to play all sections in order."
    ],

    /* ── TP0: Company Overview ── */
    'tp0-s1': [
      "This is ASUS Recent News.",
      "In Q1 2026, ASUS reported a core operating profit surge of 72% year-over-year, with a quarterly EPS of NT$13.2. This reflects strong AI server demand and disciplined cost management.",
      "On May 29, 2026, ASUS's cloud AI subsidiary — Taiwan AI Cloud — was listed on the emerging stock market. Its annualized revenue run-rate exceeds NT$10 billion, signaling rapid scaling in sovereign AI infrastructure.",
      "In Q1 2026, ASUS launched the ExpertBook P5 G2 with up to AMD Ryzen AI 9 HX, 55 TOPS NPU, and MIL-STD 810H military-grade durability. It retained its 22nd consecutive year as Taiwan's top commercial PC brand.",
      "On April 2, 2026, ASUS announced the formation of the IS Business Group on its 37th anniversary. Led by Hsu Yu-chia and Chu Pei-lan, the IS BG covers AI PCs, AI Infrastructure, Sovereign AI, Physical AI, and Smart City. Within one month, three business units were established and a 100-person Data Center team joined.",
      "As of April 1, 2026, ASUS stock closed at NT$567, with a market cap of NT$421 billion. January 2026 revenue grew 79.97% year-over-year, driven by server demand. Institutional investors showed net buying momentum, led by investment trusts."
    ],
    'tp0-s2': [
      "This is ASUS Key Milestones.",
      "ASUS was founded in 1989 by four engineers in Taipei, beginning as a motherboard manufacturer for IBM-compatible PCs.",
      "In 2004, ASUS debuted at Computex with the Vento desktop, establishing its presence as a full consumer PC brand. In 2005, the Republic of Gamers sub-brand was born, dedicated to high-performance gaming.",
      "In 2007, the Eee PC revolutionized mobile computing, reaching global users at an unprecedented price point. This product pioneered the netbook category.",
      "By 2024, ASUS launched its first generation of AI Laptops and saw AI server revenue grow over 50% year-over-year. In 2026, the IS Business Group was established, marking ASUS's full entry into enterprise AI at scale."
    ],
    'tp0-s3': [
      "This is ASUS Vision, Mission, and Values.",
      "ASUS's vision is captured in its brand spirit: In Search of Incredible. The company aspires to be a world-admired innovative technology enterprise for the new digital era, continuously driving invention through innovation.",
      "ASUS's mission centers on Human-Centred and Experience First. It aims to provide outstanding experiences through innovative products and solutions — allowing technology to truly improve human life.",
      "ASUS's three core values are: Sincerity and Pragmatism, which emphasizes solid technical foundations and perfect quality; Lean Thinking, which applies Lean Six Sigma principles to continuously improve efficiency and conserve resources; and Innovation and Aesthetics, which pursues solutions that are both beautifully designed and practically useful."
    ],
    'tp0-s4': [
      "This is Strategic Architecture of ASUSTeK.",
      "ASUS operates a dual co-CEO structure, with Hsu Sheng-yueh overseeing consumer and AI business, and Samson Hu overseeing commercial and enterprise segments. This governance model enables fast decision-making across diverse business units.",
      "The organizational structure is divided into four strategic pillars: Open Platform Systems covering PCs and servers; the ROG and TUF gaming ecosystem; the ExpertBook commercial line; and the newly established IS Business Group targeting AI infrastructure.",
      "ASUS maintains a global network spanning over 70 countries, with R&D hubs in Taipei, Shanghai, and California. The company employs nearly 5,000 world-class R&D engineers and holds a significant patent portfolio."
    ],
    'tp0-s5': [
      "This is Business Groups and Net Sales Mix from 2021 to 2025.",
      "ASUS's revenue is divided into three major business groups: System Products — which includes notebooks, desktops, and servers — accounting for approximately 52% of total revenue; Open Platform Products, covering motherboards and graphics cards, at around 30%; and IoT and Service Solutions, the fastest-growing segment at 18%.",
      "From 2021 to 2024, the System Products share gradually declined as the PC market normalized after pandemic peaks. However, AI server demand reversed this trend sharply in 2025, with ISG reported separately for the first time.",
      "The product roadmap shows ASUS accelerating through three phases: Performance and Specialisation in 2022–23; the AI Transformation year in 2024 with first-gen AI Laptops; and Ubiquitous AI and Sustainability in 2025, targeting over 30% Copilot+ PC market share and integrating ESG into core R&D."
    ],
    'tp0-s6': [
      "This is 2021 to 2025 Full Cyclical Transformation.",
      "ASUS experienced a complete financial cycle across five years. In 2021, the demand boom from pandemic-driven remote work pushed annual EPS to NT$59.97 — a historic high.",
      "In 2022 and into 2023, an inventory shock hit the PC market as demand normalized. EPS swung negative in Q4 2022, reaching a low of minus NT$5.15. This period tested ASUS's ability to manage supply chains and cost structures.",
      "From Q3 2023, ASUS executed a sharp rebound with EPS swinging over 761% in a single quarter, driven by product mix improvement and lean inventory management.",
      "By 2025, ASUS achieved a new record annual EPS of NT$59.99 — essentially matching its 2021 peak — this time powered not by consumer demand alone but by AI infrastructure growth. This full-cycle recovery demonstrates ASUS's structural resilience."
    ],

    /* ── TP1: External Analysis ── */
    's1-pestel': [
      "Section 1 covers PESTEL macro environment analysis for ASUS.",
      "The Political factor focuses on US–China tech tensions, which directly affect ASUS's semiconductor supply chain and market access.",
      "Economically, the PC market is highly cyclical. Recessions lead to demand decline, and currency fluctuations affect pricing and margins.",
      "Socially, rising gaming culture and remote work trends increase demand for high-performance devices. ASUS ROG directly benefits from these shifts.",
      "Technologically, this is the most critical factor. AI and high-performance computing drive continuous product innovation. Failure to innovate leads directly to elimination.",
      "On the environmental side, ESG has become a market entry threshold, affecting brand image and investor evaluation.",
      "Finally, legal factors such as data privacy regulations and intellectual property protection are essential in the highly competitive tech industry."
    ],
    's2-valuechain': [
      "Section 2 analyzes the industry value chain across upstream, midstream, and downstream stages.",
      "Upstream suppliers include core processor giants like NVIDIA, AMD, and Intel, who hold absolute bargaining dominance. ASUS maintains strategic inventory of over 77 billion NT dollars to secure priority chip allocation.",
      "In the midstream, ASUS operates an asset-light model — outsourcing manufacturing to ODM partners like Pegatron, Quanta, and Foxconn, while focusing on brand, R&D, and product design.",
      "Downstream, ASUS reaches consumers through global distributors like Synnex, e-commerce platforms, and brand direct stores. For B2B, ASUS sells AI servers through system integrators to enterprise data centers.",
      "The key strategic insight is the Smile Curve. ASUS deliberately occupies both high-value ends — upstream R&D and downstream brand — while outsourcing the low-margin manufacturing middle to ODM partners."
    ],
    's3-competitor': [
      "Section 3 covers competitor analysis and competitive dynamics.",
      "In market commonality, ASUS competes directly with Lenovo, HP, Dell, Acer, MSI, and Gigabyte across global PC, gaming, and components markets.",
      "ASUS achieved 16% year-over-year shipment growth in Q3 2024 — the fastest among top PC vendors — and holds over 25% share in the Copilot+ AI PC segment.",
      "ROG dominates over 30% of the worldwide gaming laptop market, and approximately 50% of the high-end segment with RTX 4080 and 4090 configurations.",
      "In terms of resource similarity, ASUS shares deep engineering culture with MSI and Gigabyte, and comparable global brand management structures with Acer.",
      "ASUS's competitive strategy is speed-driven and proactive: high-frequency product releases, early CPU and GPU adoption, sub-brand differentiation through ROG, and flexible supply chains for first-mover advantage.",
      "Competitors like Dell, HP, and Lenovo respond with enterprise contracts, after-sales service, and organizational scale — shifting competition from single product wins to integrated IT solutions."
    ],
    's4-fiveforces': [
      "Section 4 applies Porter's Five Forces framework to the PC industry.",
      "Rivalry among existing competitors is HIGH. The market is a mature red ocean. ASUS counters through ROG sub-brand premium, leapfrog innovation like the dual-screen Zenbook DUO, and comprehensive AI layout including Copilot+ PC and AI servers.",
      "The threat of substitutes is MEDIUM. Smartphones and tablets pose moderate risk. ASUS defends through ecosystem expansion — Zenfone, ROG Phone, AIoT — and servitization through the Device as a Service model.",
      "The threat of new entrants is LOW. Barriers include 5,000 world-class R&D engineers, 12 consecutive years as Taiwan's Best Global Brand, and sales in over 70 countries.",
      "Supplier bargaining power is POLARIZED. Core chip giants like NVIDIA, Intel, and AMD hold high power. ASUS responds with deep alliances, including co-building the Taiwania 4 AI supercomputer with NVIDIA.",
      "Buyer bargaining power is effectively managed LOW, through ROG brand loyalty, green value-added services for enterprise ESG goals, and global after-sales service networks with dissatisfaction rates below 8%."
    ],
    's5-lifecycle': [
      "Section 5 covers the industry lifecycle and recent financial news.",
      "Edge AI and AIoT solutions are in Early Growth stage — the fastest-velocity frontier for ASUS, spanning smart manufacturing, healthcare, retail, and parking.",
      "Gaming laptops, AI PCs, and creator products are in the Growth stage. ROG holds over 30% global gaming laptop share, and ASUS secured first-mover advantage in the Copilot+ AI PC category.",
      "Consumer laptops are in the Mature stage, but experiencing mild recovery driven by the Windows 10 end-of-support upgrade cycle. In Q1 2026, ASUS led all vendors with 20% year-over-year growth.",
      "Motherboards and GPU components are in Late Maturity, but AI server demand is creating new growth sub-segments.",
      "For full-year 2024 financials: ASUS reported consolidated revenue of NT$738.9 billion, pre-tax profit of NT$55 billion, and after-tax profit of NT$48.2 billion.",
      "In Q1 2026, global PC shipments reached 63.3 million units, up 3.2% year over year. ASUS outpaced all rivals with 20% growth, driven by memory pre-stocking and Windows 10 migration."
    ],

    /* ── TP2: Internal Resources ── */
    's1-bizlines': [
      "This is ASUS Core Businesses and Product Lines.",
      "ASUS operates across five major business lines. System Products — notebooks, desktops, and workstations — contribute about 52% of total revenue and remain the foundation of the company.",
      "Open Platform Products, including motherboards and graphics cards, account for approximately 30% of revenue. ASUS holds the global number one position in motherboard market share.",
      "The IoT and Service Solutions segment, at 18%, is the fastest-growing division. It encompasses AI PCs, the IS Business Group, and emerging enterprise cloud services.",
      "ROG and TUF gaming products, as sub-brands under System Products, represent ASUS's premium positioning and highest brand loyalty. ROG holds over 30% of the global gaming laptop market."
    ],
    's2-corpchain': [
      "This is ASUS Internal Corporate Value Chain.",
      "ASUS's value chain begins with R&D and product design — the highest value-added activity. With nearly 5,000 engineers, ASUS develops proprietary thermal, display, and AI integration technologies.",
      "Component procurement is managed through strategic alliances with NVIDIA, AMD, Intel, and Samsung. ASUS maintains over NT$77 billion in strategic inventory to secure priority chip allocation.",
      "Manufacturing is handled through an asset-light, fabless model. Production is outsourced to ODM partners including Pegatron, Quanta, and Foxconn, while ASUS retains control over design and quality standards.",
      "Distribution spans both B2C channels — global distributors, e-commerce, and brand stores — and B2B channels through system integrators for enterprise AI server deployments.",
      "After-sales service and DaaS leasing complete the value chain, enabling ASUS to build recurring revenue streams and improve customer lifetime value."
    ],
    's3-resources': [
      "This is ASUS Key Resources — Tangible and Intangible.",
      "ASUS's tangible resources include its global manufacturing partnerships, NT$77 billion strategic inventory, state-of-the-art R&D centers in Taipei, Shanghai, and California, and a growing portfolio of AI server hardware.",
      "Intangible resources are equally critical. ASUS has maintained Taiwan's Best Global Brand designation for 12 consecutive years, building strong brand equity in both consumer and enterprise markets.",
      "Human capital is a core resource. Nearly 5,000 world-class R&D engineers drive continuous product innovation. The company also holds a large intellectual property portfolio covering display, thermal, and AI chip integration technologies.",
      "Strategic partnerships with NVIDIA — including co-building the Taiwania 4 AI supercomputer — represent another form of critical resource that is difficult for competitors to replicate."
    ],
    's4-competencies': [
      "This is ASUS Core Competencies, Complementary Assets, and Key Partners.",
      "ASUS's primary core competency is hardware design excellence — the ability to integrate cutting-edge components into products that balance performance, thermal management, and aesthetics across multiple price tiers.",
      "System integration capability is a second competency: ASUS can combine AI chips, software platforms, and proprietary firmware into seamless user experiences, a skill critical for both consumer AI PCs and enterprise AI infrastructure.",
      "Complementary assets include the ROG brand ecosystem, global after-sales service infrastructure with sub-8% dissatisfaction rates, and the DaaS platform for enterprise Device as a Service offerings.",
      "Key strategic partners include NVIDIA for GPU supply and AI server co-development, major ODM manufacturers for flexible production capacity, Microsoft for Copilot+ integration, and cloud platform providers for enterprise AI solutions."
    ],
    's5-dynamic': [
      "This is ASUS Dynamic Capabilities — Internal Reconstruction Logic.",
      "Dynamic capabilities describe a firm's ability to sense, seize, and reconfigure resources in response to changing environments. ASUS demonstrates all three dimensions.",
      "Sensing: ASUS identified the AI infrastructure wave early, repositioning before competitors. The formation of the IS Business Group in 2026 reflects this foresight, targeting sovereign AI, physical AI, and smart city markets.",
      "Seizing: ASUS rapidly deployed talent from the former Intel NUC business unit — over 100 engineers — into the Data Center BU within weeks of the announcement. This speed of organizational pivoting is a key competitive advantage.",
      "Reconfiguring: ASUS restructured its product roadmap to embed AI capabilities across all segments. From Copilot+ AI PCs to liquid-cooled AI supercomputers, resources were reallocated toward high-growth AI markets while maintaining legacy PC profitability."
    ],

    /* ── TP3: Growth Strategy ── */
    'tp3-s1': [
      "This is Vertical Integration.",
      "ASUS pursues vertical integration both upstream and downstream. Upstream, ASUS has developed in-house AI server design, liquid cooling technology, and data center architecture capabilities — moving beyond its traditional role as a hardware assembler.",
      "Downstream integration is visible through ASUS's expansion into software platforms, DaaS leasing services, and the Taiwan AI Cloud subsidiary. This shifts ASUS from a product company toward a solutions provider.",
      "The key rationale for vertical integration is margin improvement and competitive differentiation. By controlling more of the value chain, ASUS reduces dependency on intermediaries and creates switching costs for enterprise customers.",
      "The risk of over-integration is also acknowledged: ASUS must balance control with flexibility, avoiding excessive fixed costs in a market where technology generations change every 18 to 24 months."
    ],
    'tp3-s2': [
      "This is Horizontal and Product Diversification.",
      "ASUS's diversification strategy spans multiple dimensions. Product diversification is most visible in the expansion from consumer PCs into AI servers, edge AI devices, AIoT solutions, healthcare technology, and smart city platforms.",
      "The ROG gaming ecosystem represents successful related diversification — extending from gaming laptops into monitors, peripherals, smartphones, and esports partnerships, creating a self-reinforcing brand community.",
      "ASUS is also diversifying into services through DaaS, cloud AI infrastructure, and enterprise IT management tools. This service layer provides recurring revenue that stabilizes ASUS against PC market cyclicality.",
      "The Ansoff Matrix analysis shows ASUS operating across all four quadrants: deepening existing products in existing markets, launching new products in existing markets, entering new geographic markets, and pioneering new product-market combinations in AI infrastructure."
    ],
    'tp3-s3': [
      "This is Geographical Expansion.",
      "ASUS currently operates in over 70 countries, with primary revenue concentration in Asia Pacific, Europe, and North America. The next growth frontier is emerging markets — particularly Southeast Asia, India, and the Middle East.",
      "In Southeast Asia, ASUS has strengthened its presence through localized marketing, education partnerships, and SME-focused ExpertBook programs. Indonesia and Vietnam represent key growth markets.",
      "India is a strategic priority. ASUS is expanding its retail and service network, leveraging India's booming technology adoption and government digitalization initiatives. Local assembly partnerships are being explored to navigate import duties.",
      "The Middle East and sovereign AI markets represent a new geographic dimension. ASUS's IS Business Group is actively targeting government data center projects in the Gulf region, positioning ASUS as a sovereign AI infrastructure provider."
    ],
    'tp3-s4': [
      "This is Market Entry Modes — Greenfield, Alliance, Joint Venture, and M&A.",
      "ASUS employs multiple market entry strategies depending on the target market's characteristics. Greenfield investment is used for R&D centers and service hubs in key markets, giving ASUS full control over operations and intellectual property.",
      "Strategic alliances are the most frequently used mode. The co-development of the Taiwania 4 AI supercomputer with NVIDIA exemplifies how alliances allow ASUS to share R&D costs and accelerate technology development beyond its own capabilities.",
      "Joint ventures are used selectively for market entry in regions with regulatory barriers or where local market knowledge is critical. Taiwan AI Cloud's collaboration with government entities reflects this approach.",
      "Mergers and acquisitions remain a potential tool for rapid capability acquisition, particularly in AI software, cloud services, and specialized enterprise IT segments where organic development would be too slow."
    ],
    'tp3-s5': [
      "This is Future Challenges and Suggestions.",
      "ASUS faces four major future challenges. First, intensifying competition in AI infrastructure from established hyperscalers like Dell, HPE, and Lenovo, all of which are aggressively entering the AI server market.",
      "Second, supply chain concentration risk remains high. ASUS's dependence on NVIDIA GPUs and TSMC-manufactured chips creates vulnerability to geopolitical disruptions and allocation shortages.",
      "Third, the transition from product company to solutions provider requires organizational transformation. ASUS must develop software, service, and consultancy capabilities that are fundamentally different from its hardware engineering DNA.",
      "Our strategic suggestions: ASUS should accelerate software platform development for AI PCs and enterprise AI management; deepen sovereign AI partnerships in emerging markets; diversify chip supplier relationships beyond NVIDIA; and invest in talent development for cloud and AI services."
    ],

    /* ── Conclusion ── */
    'concl-s1': [
      "This is Key Findings from TP0 through TP3.",
      "From TP0, ASUS has completed a full financial cycle — from the 2021 peak EPS of NT$59.97, through the 2022–23 inventory shock, to a new record of NT$59.99 in 2025. This recovery is structurally different: it is AI-driven, not merely demand-driven.",
      "From TP1, the external environment shows ASUS operating in a highly competitive, cyclical market where AI is the primary technological disruption. The Five Forces analysis confirms that ASUS's moat lies in its brand equity, R&D scale, and strategic supplier alliances.",
      "From TP2, ASUS's internal strengths center on design excellence, a fabless asset-light model, and rapidly developing dynamic capabilities in AI infrastructure. The IS Business Group is the most significant organizational pivot in ASUS's recent history.",
      "From TP3, ASUS's growth strategy is multi-dimensional: vertical integration into software and services, product diversification into AI and IoT, geographical expansion into emerging markets, and alliance-driven market entry for sovereign AI projects."
    ],
    'concl-s2': [
      "This is Business Model Canvas for ASUSTeK Computer.",
      "ASUS's value proposition spans three dimensions: high-performance consumer products for gamers and creators, enterprise AI infrastructure solutions, and software-enabled services through DaaS and Taiwan AI Cloud.",
      "Key customer segments include global consumer PC buyers, enterprise data center operators, government sovereign AI projects, SMEs seeking device leasing solutions, and the gaming community.",
      "Key activities encompass hardware R&D and system integration, supply chain management, brand marketing, after-sales service, and cloud AI platform development.",
      "Revenue streams are diversifying from traditional one-time hardware sales toward service subscriptions, device leasing, and AI infrastructure project revenues. This shift improves revenue predictability and reduces cyclicality.",
      "Key partnerships with NVIDIA, TSMC, ODM manufacturers, and cloud platform providers form the backbone of ASUS's operational model, enabling it to scale rapidly without proportionate capital investment."
    ],
    'concl-s3': [
      "This is Strategic Recommendations.",
      "Based on our analysis, we offer three primary strategic recommendations for ASUS.",
      "First, accelerate the IS Business Group's enterprise AI platform. ASUS should invest in software layers — AI management tools, sovereign AI dashboards, and edge orchestration platforms — to transform its hardware competency into a full-stack solutions capability.",
      "Second, deepen geographic diversification in emerging markets. India, Southeast Asia, and the Gulf region represent the highest growth opportunities for both consumer AI PCs and sovereign AI infrastructure. Localization and government partnerships should be prioritized.",
      "Third, manage supply chain resilience proactively. ASUS should diversify its GPU and chip supplier base, explore co-investment in chip packaging with TSMC, and build buffer inventory strategies that balance working capital with supply security.",
      "In summary, ASUS stands at a pivotal moment. It has the brand, engineering talent, and AI momentum to become a global AI solutions leader — but only if it executes the transition from hardware manufacturer to technology platform provider with discipline and speed."
    ]
  },

  zh: {
    'hero': [
      "歡迎收聽華碩 TP1 研究報告語音導覽。",
      "本報告涵蓋五大章節：PESTEL總體環境分析、產業價值鏈、競爭者分析、波特五力分析，以及產業生命週期與最新財務新聞。",
      "您可以點擊各章節的語音按鈕收聽摘要，或使用Header的語音導覽按鈕依序播放所有章節。"
    ],

    /* ── TP0: Company Overview ── */
    'tp0-s1': [
      "這是華碩最新重大消息。",
      "2026年第一季，華碩本業獲利年增72%，單季EPS達13.2元。此結果反映AI伺服器強勁需求與嚴格的成本管理能力。",
      "2026年5月29日，華碩旗下雲端AI子公司台智雲正式登錄興櫃。年化營收超過百億元，顯示主權AI基礎設施業務快速規模化。",
      "2026年第一季，華碩發表ExpertBook P5 G2，搭載最高AMD Ryzen AI 9 HX處理器、55 TOPS NPU，符合MIL-STD 810H美軍規標準，連續第22年蟬聯台灣商用電腦年度冠軍。",
      "2026年4月2日，華碩宣布於創立37週年成立IS BG，由許祐嘉與朱培蘭領軍，涵蓋AI PC、AI基礎設施、主權AI、實體AI與智慧城市。成立滿月即建立三大事業單位，趙國維帶領百人團隊加入資料中心業務。",
      "截至2026年4月1日，華碩收盤價567元，總市值4,210億元。2026年1月營收年增79.97%，主因伺服器需求帶動。三大法人合計淨買超，投信持續買進動能強勁。"
    ],
    'tp0-s2': [
      "這是華碩重要里程碑。",
      "華碩於1989年由四位工程師在台北創立，初期專注IBM相容PC的主機板製造。",
      "2004年，華碩在Computex展出Vento桌機，確立消費性全品牌地位。2005年，ROG玩家共和國正式創立，專為高效能電競而生。",
      "2007年，Eee PC以前所未有的平價顛覆行動運算，開創筆記型電腦的新品類。",
      "2024年，華碩推出第一代AI筆電，AI伺服器年增逾50%。2026年，IS BG正式成立，標誌著華碩全面進軍企業AI市場。"
    ],
    'tp0-s3': [
      "這是成為什麼、做什麼、如何行動。",
      "華碩的願景以品牌精神「追尋無與倫比」為核心，致力成為數位新世代備受推崇的科技創新領導企業，持續以創新驅動發明。",
      "華碩的使命強調「以人為本」與「體驗至上」，透過創新產品和解決方案，為全球使用者提供卓越體驗，讓科技真正改善人類生活。",
      "三大核心價值為：崇本務實，強調紮實技術基礎與完美品質；精實思維，運用精實六標準差持續改善效率、節省資源；創新惟美，如藝術家般追求兼具美感與實用的解決方案。"
    ],
    'tp0-s4': [
      "這是華碩戰略架構解析。",
      "華碩採雙共同執行長制，徐世昱負責消費性與AI業務，胡書賓負責商用與企業端。此治理模式能快速推動多元事業群的決策。",
      "組織架構分為四大策略支柱：Open Platform Systems涵蓋PC與伺服器；ROG與TUF電競生態；ExpertBook商用系列；以及新成立的IS BG，鎖定AI基礎設施。",
      "華碩在全球逾70個國家設有通路，研發中心分布台北、上海與加州，擁有近5,000位世界級研發工程師與豐厚的專利組合。"
    ],
    'tp0-s5': [
      "這是事業群與淨營收佔比2021至2025。",
      "華碩營收分為三大事業群：系統產品（筆電、桌機、伺服器）佔約52%；開放平台（主機板、顯示卡）佔約30%；IoT與服務解決方案則佔18%，成長最快速。",
      "2021至2024年間，系統產品佔比隨PC市場常態化而略降。然而2025年AI伺服器需求急速提升，ISG首度獨立揭露，大幅扭轉結構趨勢。",
      "產品藍圖顯示三個階段：2022–23年效能提升與產品特化；2024年AI轉型元年，推出第一代AI筆電；2025年全面AI化與永續，目標Copilot+ PC市占逾30%，並將ESG納入研發核心。"
    ],
    'tp0-s6': [
      "這是2021至2025完整財務週期轉型。",
      "華碩經歷一個完整的五年財務週期。2021年，疫情推動遠距工作需求爆發，年度EPS達59.97元，創歷史新高。",
      "2022至2023年，PC市場需求正常化引發庫存衝擊。2022年第四季EPS轉負，最低達負5.15元，考驗華碩的供應鏈管理與成本結構調整能力。",
      "2023年第三季起，華碩展開急速反彈，單季EPS回升幅度逾761%，主因產品組合改善與庫存精實管理奏效。",
      "2025年，華碩年度EPS達59.99元，幾乎與2021年高峰持平，但這次的驅動力來自AI基礎設施成長，而非單純的消費需求。此一完整週期復甦，充分展現華碩的結構性韌性。"
    ],

    /* ── TP1: External Analysis ── */
    's1-pestel': [
      "第一節介紹華碩的PESTEL總體環境分析。",
      "政治面：美中科技衝突直接影響華碩的半導體供應鏈穩定性與全球市場進入門檻。",
      "經濟面：PC市場高度循環性，景氣衰退會導致需求下滑，匯率波動也影響定價策略與利潤空間。",
      "社會面：電競文化崛起與遠距工作需求提升高效能設備需求，華碩ROG品牌直接從中受益，疫後需求仍維持一定水準。",
      "科技面：這是最關鍵的因素。AI與高效能運算驅動持續創新，產品生命週期短，不創新直接被淘汰。",
      "環境面：ESG已成為市場進入門檻，影響品牌形象與投資人評價。",
      "法律面：資料保護法規與智慧財產權保護，是科技產業不可忽視的高影響因素。"
    ],
    's2-valuechain': [
      "第二節分析PC與伺服器產業的上中下游價值鏈。",
      "上游供應商包括NVIDIA、AMD、Intel等核心處理器廠商，擁有絕對議價強勢。華碩保留逾774億元戰略庫存以確保優先拿貨權。",
      "中游方面，華碩採取輕資產策略，將製造外包給和碩、廣達、鴻海等ODM夥伴，自身專注品牌、研發與產品設計。",
      "下游通路方面，B2C透過聯強等代理商、電商與品牌直營店觸及消費者。B2B則透過系統整合商，將AI伺服器佈建至企業資料中心。",
      "關鍵策略洞察是微笑曲線：華碩刻意佔據高附加價值的兩端—上游研發與下游品牌—同時將低毛利的中游製造外包給ODM夥伴。"
    ],
    's3-competitor': [
      "第三節涵蓋競爭者分析與競爭動態。",
      "市場共同性方面，華碩在全球PC、電競與零組件市場，直接與聯想、惠普、戴爾、宏碁、微星及技嘉競爭。",
      "2024年第三季，華碩出貨年增16%，是主要廠商中增幅最快的，並在Copilot+ AI PC細分市場取得超過25%的市佔率。",
      "ROG主導全球電競筆電市場逾30%，在搭載RTX 4080和4090的高階電競細分市場更佔約50%。",
      "資源相似性方面，華碩與微星、技嘉共享深厚的工程師文化，與宏碁在全球品牌管理架構上高度相似。",
      "華碩的競爭策略以速度為核心：高頻率新品上市、搶先導入新處理器、透過ROG次品牌差異化，以及靈活供應鏈爭取先行者優勢。",
      "戴爾、惠普、聯想等競爭者則以企業合約、售後服務與組織規模回應，將競爭從產品勝負轉向整合IT解決方案的全面較量。"
    ],
    's4-fiveforces': [
      "第四節運用波特五力框架分析PC產業結構。",
      "現有競爭者的競爭程度：高。市場屬於成熟紅海。華碩的三大反制策略為ROG次品牌溢價、躍進式創新如雙螢幕Zenbook DUO，以及涵蓋Copilot+ PC與AI伺服器的全方位AI佈局。",
      "替代品威脅：中。智慧手機與平板對傳統PC有一定替代風險。華碩以擴張生態系（Zenfone、ROG Phone、AIoT）及DaaS服務化轉型防禦。",
      "新進入者威脅：低。進入門檻極高，護城河包括近5,000位研發菁英、連續12度台灣最佳國際品牌，以及遍布70多個國家的銷售網絡。",
      "供應商議價能力：兩極化。NVIDIA、Intel、AMD等晶片大廠擁有高議價力，華碩以深度結盟應對，包括與NVIDIA合作建置台灣杉四號AI超算。",
      "買方議價能力：有效壓低。ROG品牌信仰降低消費者價格敏感度；企業端以DPP數位產品護照協助ESG達標；全球售後服務網絡讓各地區不滿意度均低於8%。"
    ],
    's5-lifecycle': [
      "第五節介紹產業生命週期分析與最新財務動態。",
      "Edge AI與AIoT解決方案處於早期成長階段，是華碩目前成長速度最快的領域，應用涵蓋智慧製造、智慧醫療、智慧零售與停車。",
      "電競筆電、AI PC與創作者產品處於成長期。ROG全球電競筆電市佔超30%，Copilot+ AI PC市場亦取得先行者優勢。",
      "一般消費型筆電處於成熟期，但受Windows 10支援終止帶動的換機潮影響，正經歷溫和復甦。2026年第一季，華碩以20%增幅居全球廠商之冠。",
      "主機板與電腦零組件處於成熟後期，但AI伺服器需求正在零組件領域拓展新的成長子市場。",
      "2024年全年財務：華碩合併營收達7,389億元，稅前淨利550億元，稅後淨利482億元。",
      "2026年第一季，全球PC出貨達6,330萬台，年增3.2%，華碩以年增20%超越所有競爭對手，主因記憶體漲價備貨效應與Windows 10升級換機潮。"
    ],

    /* ── TP2: Internal Resources ── */
    's1-bizlines': [
      "這是核心業務與產品線。",
      "華碩擁有五大主要業務線。系統產品——筆電、桌機與工作站——貢獻約52%的總營收，是公司的核心支柱。",
      "開放平台產品包括主機板與顯示卡，佔約30%的營收。華碩在全球主機板市場保持第一的地位。",
      "IoT與服務解決方案佔18%，是成長最快的部門，涵蓋AI PC、IS事業群以及新興的企業雲端服務。",
      "ROG與TUF電競次品牌代表華碩最高溢價定位，ROG在全球電競筆電市場佔有逾30%的份額。"
    ],
    's2-corpchain': [
      "這是ASUS內部企業價值鏈。",
      "華碩的價值鏈始於研發與產品設計，這是最高附加價值的活動。近5,000位工程師開發自有熱管、顯示與AI整合技術。",
      "零組件採購透過與NVIDIA、AMD、Intel、Samsung的策略聯盟管理。華碩保留逾774億元戰略庫存，確保優先拿貨權。",
      "製造採輕資產無廠模式，將生產外包給和碩、廣達、鴻海等ODM夥伴，同時保留設計與品質標準的核心主導權。",
      "通路方面，B2C透過全球代理商、電商與品牌直營店觸及消費者；B2B則透過系統整合商，將企業AI伺服器佈建至資料中心。",
      "售後服務與DaaS租賃完成價值鏈，讓華碩能建立經常性收入來源，提升客戶終身價值。"
    ],
    's3-resources': [
      "這是關鍵資源——有形與無形。",
      "華碩的有形資源包括全球製造夥伴網絡、774億元戰略庫存、台北、上海與加州的頂尖研發中心，以及持續擴張中的AI伺服器硬體組合。",
      "無形資源同樣關鍵。華碩連續12年獲得台灣最佳國際品牌殊榮，在消費者與企業市場均擁有強大的品牌資產。",
      "人力資本是核心資源。近5,000位世界級研發工程師驅動持續創新，公司在顯示、熱管理與AI晶片整合技術方面也擁有豐厚的智慧財產組合。",
      "與NVIDIA的策略夥伴關係——包括共同打造台灣杉四號AI超算——是競爭對手難以複製的另一種關鍵資源。"
    ],
    's4-competencies': [
      "這是核心競爭力、互補性資產與關鍵合作夥伴。",
      "華碩的首要核心競爭力是硬體設計卓越性——能夠跨多個價位區間，將尖端零組件整合為兼顧效能、散熱與美學的產品。",
      "系統整合能力是第二項核心競爭力：華碩能將AI晶片、軟體平台與自有韌體整合為無縫的使用體驗，無論對消費性AI PC還是企業AI基礎設施，這都是關鍵能力。",
      "互補性資產包括ROG品牌生態系、全球售後服務基礎設施（不滿意度低於8%），以及針對企業端的DaaS裝置即服務平台。",
      "關鍵策略合作夥伴包括：NVIDIA的GPU供應與AI伺服器共同開發、主要ODM製造商提供彈性產能、Microsoft的Copilot+整合，以及企業AI解決方案的雲端平台夥伴。"
    ],
    's5-dynamic': [
      "這是動態能力——內部重建邏輯。",
      "動態能力描述企業在環境變化中感知、把握與重新配置資源的能力。華碩在三個維度上均有充分展現。",
      "感知能力：華碩提前識別AI基礎設施浪潮，在競爭對手之前完成轉型佈局。2026年IS BG的成立，正是這種前瞻洞察的體現，目標鎖定主權AI、實體AI與智慧城市市場。",
      "把握能力：華碩迅速將前Intel NUC事業部的逾百名工程師部署至資料中心事業部，整個過程僅花數週。這種組織轉型速度是重要的競爭優勢。",
      "重新配置：華碩重組產品藍圖，將AI能力嵌入所有業務線。從Copilot+ AI PC到液冷AI超算，資源全面向高成長AI市場傾斜，同時維持傳統PC業務的獲利穩定性。"
    ],

    /* ── TP3: Growth Strategy ── */
    'tp3-s1': [
      "這是垂直整合。",
      "華碩同時推動上游與下游的垂直整合。上游方面，華碩已建立自主的AI伺服器設計、液冷技術與資料中心架構能力，超越傳統的硬體組裝者角色。",
      "下游整合體現在軟體平台、DaaS租賃服務與台智雲子公司的擴張，推動華碩從產品公司轉型為解決方案供應商。",
      "垂直整合的核心邏輯是毛利提升與競爭差異化。透過掌控更多價值鏈環節，華碩降低對中間商的依賴，並為企業客戶創造轉換成本。",
      "然而過度整合的風險同樣不可忽視：在技術世代每18至24個月更迭一次的市場中，華碩必須在控制力與靈活性之間取得平衡。"
    ],
    'tp3-s2': [
      "這是水平多角化與產品多元化。",
      "華碩的多角化策略跨越多個維度。產品多元化最為顯著：從消費性PC擴展至AI伺服器、邊緣AI設備、AIoT解決方案、醫療科技與智慧城市平台。",
      "ROG電競生態系代表成功的相關多角化——從電競筆電延伸至螢幕、周邊、智慧手機與電競贊助，形成自我強化的品牌社群。",
      "華碩也透過DaaS、雲端AI基礎設施與企業IT管理工具，逐步跨入服務領域。此一服務層提供經常性收入，緩解PC市場循環性帶來的獲利波動。",
      "依Ansoff矩陣分析，華碩同時在四個象限布局：深化現有市場的現有產品、在現有市場推出新產品、進入新地理市場，以及在AI基礎設施領域開拓全新的產品市場組合。"
    ],
    'tp3-s3': [
      "這是地理擴張。",
      "華碩目前布局超過70個國家，主要營收集中於亞太、歐洲與北美。下一個成長前沿是新興市場——尤其是東南亞、印度與中東。",
      "在東南亞，華碩透過本地化行銷、教育夥伴關係與ExpertBook中小企業方案強化布局，印尼與越南是關鍵成長市場。",
      "印度是策略重點。華碩持續擴大零售與服務網絡，借助印度蓬勃的科技採用率與政府數位化計畫，並評估在地組裝夥伴關係以應對進口關稅。",
      "中東與主權AI市場代表全新的地理面向。華碩IS BG積極爭取海灣地區政府資料中心建設案，將華碩定位為主權AI基礎設施供應商。"
    ],
    'tp3-s4': [
      "這是市場進入模式——綠地投資、聯盟、合資與併購。",
      "華碩依目標市場特性採用多元的進入策略。綠地投資用於在關鍵市場設立研發中心與服務據點，讓華碩對營運與智慧財產擁有完全掌控。",
      "策略聯盟是最常用的模式。與NVIDIA共同打造台灣杉四號AI超算，充分說明聯盟如何讓華碩分擔研發成本，並加速超越自身能力邊界的技術發展。",
      "合資模式則選擇性地用於存在法規障礙、或需要在地市場知識的地區進入。台智雲與政府機構的合作正體現此一做法。",
      "併購是快速取得能力的潛在工具，特別適用於AI軟體、雲端服務與專業企業IT等有機發展速度過慢的領域。"
    ],
    'tp3-s5': [
      "這是未來挑戰與建議。",
      "華碩面臨四大未來挑戰。第一，AI基礎設施競爭加劇：Dell、HPE、聯想等IT巨頭均積極進軍AI伺服器市場，競爭格局日趨激烈。",
      "第二，供應鏈集中風險依然偏高。華碩對NVIDIA GPU與台積電晶片的高度依賴，使其面對地緣政治衝突與產能分配短缺時仍有脆弱性。",
      "第三，從產品公司轉型為解決方案供應商需要組織深層重塑。軟體、服務與顧問能力，與華碩的硬體工程DNA在本質上截然不同。",
      "我們的策略建議：加速AI PC與企業AI管理工具的軟體平台發展；深化新興市場的主權AI夥伴關係；分散晶片供應商依賴以降低NVIDIA集中風險；投資雲端與AI服務的人才培育。"
    ],

    /* ── Conclusion ── */
    'concl-s1': [
      "這是TP0至TP3的核心發現。",
      "從TP0來看，華碩完成了一個完整的財務週期——從2021年EPS高峰59.97元，經歷2022–23年庫存衝擊，再到2025年刷新紀錄的59.99元。這次復甦在結構上截然不同：驅動力是AI，而非單純的需求周期。",
      "從TP1來看，外部環境顯示華碩身處高度競爭且循環性強的市場，AI是首要的科技顛覆力量。五力分析確認華碩的護城河在於品牌資產、研發規模與策略性供應商聯盟。",
      "從TP2來看，華碩的內部優勢集中在設計卓越性、輕資產無廠模式，以及在AI基礎設施領域快速發展的動態能力。IS事業群是華碩近年最重大的組織轉型。",
      "從TP3來看，華碩的成長策略是多維的：向下游軟體與服務進行垂直整合、向AI與IoT多元化產品、拓展新興市場地理布局，以及以聯盟驅動主權AI市場進入。"
    ],
    'concl-s2': [
      "這是ASUSTeK電腦的商業模式九宮格。",
      "華碩的價值主張涵蓋三個面向：針對遊戲玩家與創作者的高效能消費產品、企業AI基礎設施解決方案，以及透過DaaS與台智雲提供的軟體賦能服務。",
      "主要客群包括：全球消費性PC買家、企業資料中心運營商、政府主權AI專案、尋求設備租賃的中小企業，以及電競社群。",
      "關鍵活動涵蓋硬體研發與系統整合、供應鏈管理、品牌行銷、售後服務，以及雲端AI平台的持續開發。",
      "營收來源正從傳統一次性硬體銷售，多元化轉向服務訂閱、設備租賃與AI基礎設施專案收入，此一轉型提升了收入可預測性，並降低循環性風險。",
      "與NVIDIA、台積電、ODM製造商及雲端平台夥伴的關鍵合作關係，構成華碩營運模式的骨幹，使其能夠在不需等比例資本投入的前提下快速規模化。"
    ],
    'concl-s3': [
      "這是策略建議。",
      "基於我們的分析，我們提出三大主要策略建議。",
      "第一，加速IS事業群的企業AI平台建設。華碩應投資軟體層——AI管理工具、主權AI儀表板與邊緣協調平台——將硬體競爭力轉化為全堆疊解決方案能力。",
      "第二，深化新興市場的地理多元化。印度、東南亞與海灣地區對消費性AI PC與主權AI基礎設施均代表最高成長機會，應優先推動本地化與政府夥伴關係。",
      "第三，主動管理供應鏈韌性。華碩應分散GPU與晶片供應商組合，探索與台積電共同投資晶片封裝的可能性，並建立兼顧營運資金效率與供應安全的緩衝庫存策略。",
      "綜合而言，華碩正站在關鍵轉折點。憑藉品牌、工程人才與AI發展動能，它具備成為全球AI解決方案領導者的潛力——但前提是必須以紀律與速度，堅定執行從硬體製造商轉型為科技平台供應商的策略。"
    ]
  }
};

var agSectionOrder = ['hero', 's1-pestel', 's2-valuechain', 's3-competitor', 's4-fiveforces', 's5-lifecycle'];

/* ── State ── */
var ag = {
  active: false, playing: false, paused: false,
  sectionId: null, idx: 0, speed: 1.0,
  globalMode: false, utterance: null
};
var agSpeeds = [0.8, 1.0, 1.25, 1.5];

function agLang() {
  return document.body.getAttribute('data-lang') || 'en';
}

function agScript(sid) {
  var lang = agLang();
  return (audioScripts[lang] && audioScripts[lang][sid]) ? audioScripts[lang][sid] : [];
}

function agSectionName(sid) {
  var names = {
    'hero':            { en: 'Introduction',                  zh: '報告簡介' },
    /* TP0 */
    'tp0-s1':          { en: 'Recent News',                   zh: '最新消息' },
    'tp0-s2':          { en: 'Company History',               zh: '公司歷史' },
    'tp0-s3':          { en: 'Vision / Mission / Values',     zh: '願景使命' },
    'tp0-s4':          { en: 'Org Structure',                 zh: '組織架構' },
    'tp0-s5':          { en: 'Product Portfolios',            zh: '產品組合' },
    'tp0-s6':          { en: 'Financial Performance',         zh: '財務表現' },
    /* TP1 */
    's1-pestel':       { en: 'PESTEL Analysis',               zh: 'PESTEL 總體分析' },
    's2-valuechain':   { en: 'Industry Value Chain',          zh: '產業價值鏈' },
    's3-competitor':   { en: 'Competitor Analysis',           zh: '競爭者分析' },
    's4-fiveforces':   { en: "Porter's Five Forces",          zh: '波特五力分析' },
    's5-lifecycle':    { en: 'Lifecycle & News',              zh: '生命週期與新聞' },
    /* TP2 */
    's1-bizlines':     { en: 'Core Businesses',               zh: '核心業務與產品線' },
    's2-corpchain':    { en: 'Corporate Value Chain',         zh: '企業價值鏈' },
    's3-resources':    { en: 'Key Resources',                 zh: '關鍵資源' },
    's4-competencies': { en: 'Core Competencies',             zh: '核心能力與關鍵夥伴' },
    's5-dynamic':      { en: 'Dynamic Capabilities',          zh: '動態能力' },
    /* TP3 */
    'tp3-s1':          { en: 'Vertical Integration',          zh: '垂直整合' },
    'tp3-s2':          { en: 'Product Diversification',       zh: '產品多角化' },
    'tp3-s3':          { en: 'Geographical Expansion',        zh: '地理擴張' },
    'tp3-s4':          { en: 'Market Entry Modes',            zh: '市場進入模式' },
    'tp3-s5':          { en: 'Future Challenges',             zh: '未來挑戰與建議' },
    /* Conclusion */
    'concl-s1':        { en: 'Key Findings',                  zh: '核心發現' },
    'concl-s2':        { en: 'Business Model Canvas',         zh: '商業模式九宮格' },
    'concl-s3':        { en: 'Strategic Recommendations',     zh: '策略建議' }
  };
  return names[sid] ? names[sid][agLang()] : sid;
}

/* ── UI 更新 ── */
function agUpdateUI() {
  var gbtn = document.getElementById('globalAudioBtn');
  if (gbtn) {
    if (ag.playing && !ag.paused) gbtn.classList.add('playing');
    else gbtn.classList.remove('playing');
  }
  var ppbtn = document.getElementById('audioPlayPauseBtn');
  if (ppbtn) ppbtn.textContent = (ag.playing && !ag.paused) ? '⏸' : '▶';
  document.querySelectorAll('.section-audio-btn').forEach(function(btn) {
    var sid = btn.getAttribute('data-section');
    if (sid === ag.sectionId && ag.playing && !ag.paused) btn.classList.add('playing');
    else btn.classList.remove('playing');
  });
  var script = agScript(ag.sectionId);
  var prog = document.getElementById('audioProgressText');
  if (prog) prog.textContent = (script.length ? (ag.idx + 1) + ' / ' + script.length : '0 / 0');
}

function agUpdatePreview(text) {
  var el = document.getElementById('audioTextPreview');
  if (el) el.textContent = text || '—';
}

function agUpdateSectionName() {
  var el = document.getElementById('audioSectionName');
  if (el && ag.sectionId) el.textContent = agSectionName(ag.sectionId);
}

/* ── Core speak ── */
function agSpeak(idx) {
  var script = agScript(ag.sectionId);
  if (!script.length || idx >= script.length) {
    if (ag.globalMode) {
      var curPos = agSectionOrder.indexOf(ag.sectionId);
      if (curPos >= 0 && curPos < agSectionOrder.length - 1) {
        var nextSid = agSectionOrder[curPos + 1];
        ag.sectionId = nextSid;
        ag.idx = 0;
        agUpdateSectionName();
        agUpdateUI();
        setTimeout(function() { agSpeak(0); }, 80);
        return;
      }
    }
    ag.playing = false; ag.paused = false; ag.idx = 0; ag.globalMode = false;
    agUpdateUI(); agUpdatePreview('');
    return;
  }
  ag.idx = idx;
  var text = script[idx];
  agUpdatePreview(text);
  agUpdateUI();

  var isZh = (agLang() === 'zh');
  /* 自然停頓處理：數字千分位去除，句末加空格讓引擎換氣 */
  var naturalText = text;
  if (isZh) {
    naturalText = naturalText.replace(/(\d),(?=\d{3})/g, '$1').replace(/,/g, '').replace(/\s+/g, ' ').trim();
  } else {
    naturalText = naturalText.replace(/(\d),(?=\d{3})/g, '$1').replace(/([.!?])\s*/g, '$1  ').replace(/\s+/g, ' ').trim();
  }

  var utter = new SpeechSynthesisUtterance(naturalText);
  utter.lang  = isZh ? 'zh-TW' : 'en-US';
  utter.rate  = ag.speed * 0.92;
  utter.pitch = isZh ? 1.05 : 1.08;

  /* 偏好聲音選擇 */
  var voices = window.speechSynthesis.getVoices();
  var preferred = (function() {
    var priorities = isZh
      ? ['Siri', 'Google 普通話', 'Google 國語', 'Meijia', '美佳', 'Tingting', '婷婷', 'Microsoft Hanhan', 'Microsoft Zhiwei']
      : ['Siri', 'Google UK English Female', 'Google US English', 'Samantha', 'Karen', 'Moira', 'Microsoft Zira', 'Microsoft Jenny', 'Microsoft Aria'];
    for (var i = 0; i < priorities.length; i++)
      for (var j = 0; j < voices.length; j++)
        if (voices[j].name.indexOf(priorities[i]) !== -1) return voices[j];
    var langPrefix = isZh ? 'zh' : 'en';
    for (var k = 0; k < voices.length; k++)
      if (voices[k].lang.indexOf(langPrefix) === 0) return voices[k];
    return null;
  })();
  if (preferred) utter.voice = preferred;

  utter.onend = function() {
    if (ag.playing && !ag.paused) { agSpeak(idx + 1); }
  };
  utter.onerror = function(e) {
    if (e.error !== 'interrupted') { console.warn('SpeechSynthesis error:', e.error); }
  };
  ag.utterance = utter;
  window.speechSynthesis.speak(utter);
}

/* ── Public controls ── */
function agStart(sectionId, fromIdx, globalMode) {
  window.speechSynthesis.cancel();
  ag.sectionId  = sectionId;
  ag.idx        = fromIdx || 0;
  ag.playing    = true;
  ag.paused     = false;
  ag.globalMode = globalMode || false;

  var panel = document.getElementById('audioPlayerPanel');
  if (panel) panel.classList.add('visible');
  ag.active = true;
  agUpdateSectionName();
  agUpdateUI();

  window.speechSynthesis.cancel();
  setTimeout(function() { agSpeak(ag.idx); }, 50);
}

function openAudioPanel() {
  var panel = document.getElementById('audioPlayerPanel');
  if (panel) panel.classList.add('visible');
  ag.active = true;
}

function closeAudioPanel() {
  stopAudio();
  var panel = document.getElementById('audioPlayerPanel');
  if (panel) panel.classList.remove('visible');
  ag.active = false; ag.sectionId = null;
  agUpdateUI();
  agUpdatePreview('');
  var el = document.getElementById('audioSectionName');
  if (el) el.textContent = '';
}

function toggleGlobalAudio() {
  if (ag.playing && !ag.paused) {
    window.speechSynthesis.pause();
    ag.paused = true; ag.playing = false;
    agUpdateUI();
  } else if (ag.paused) {
    window.speechSynthesis.resume();
    ag.paused = false; ag.playing = true;
    agUpdateUI();
  } else {
    agStart('hero', 0, true);
  }
}

function playSectionAudio(sectionId, event) {
  if (event) { event.stopPropagation(); event.preventDefault(); }
  if (ag.active && ag.sectionId === sectionId) {
    if (ag.playing && !ag.paused) {
      window.speechSynthesis.pause();
      ag.paused = true; ag.playing = false;
      agUpdateUI(); return;
    } else if (ag.paused) {
      window.speechSynthesis.resume();
      ag.paused = false; ag.playing = true;
      agUpdateUI(); return;
    }
  }
  agStart(sectionId, 0);
}

function togglePlayPause() {
  if (!ag.sectionId) return;
  if (ag.playing && !ag.paused) {
    window.speechSynthesis.pause();
    ag.paused = true; ag.playing = false;
  } else if (ag.paused) {
    window.speechSynthesis.resume();
    ag.paused = false; ag.playing = true;
  } else {
    ag.playing = true; ag.paused = false;
    window.speechSynthesis.cancel();
    setTimeout(function() { agSpeak(ag.idx); }, 50);
  }
  agUpdateUI();
}

function stopAudio() {
  window.speechSynthesis.cancel();
  ag.playing = false; ag.paused = false; ag.idx = 0;
  agUpdateUI(); agUpdatePreview('');
}

function restartAudio() {
  if (!ag.sectionId) return;
  window.speechSynthesis.cancel();
  ag.playing = true; ag.paused = false; ag.idx = 0;
  agUpdateUI();
  setTimeout(function() { agSpeak(0); }, 50);
}

function cycleSpeed() {
  var ci = agSpeeds.indexOf(ag.speed);
  var ni = (ci + 1) % agSpeeds.length;
  ag.speed = agSpeeds[ni];
  document.getElementById('audioSpeedBtn').textContent = ag.speed + '\u00d7';
  if (ag.playing && !ag.paused) {
    var curIdx = ag.idx;
    window.speechSynthesis.cancel();
    setTimeout(function() { agSpeak(curIdx); }, 50);
  }
}

/* 語言切換時：若正在播放或暫停，自動用新語言從當前句重播 */
(function() {
  var _origSetLang = window.setLang || function(){};
  window.setLang = function(lang) {
    var wasPlaying = ag.playing && !ag.paused;
    var wasPaused  = ag.paused;
    var savedSid   = ag.sectionId;
    var savedIdx   = ag.idx;

    /* 先取消舊語音 */
    window.speechSynthesis.cancel();
    ag.playing = false;
    ag.paused  = false;

    /* 切換 DOM 語言 */
    _origSetLang(lang);
    agUpdateSectionName();
    agUpdatePreview('');

    /* 若之前正在播放或暫停，用新語言從同一句重播 */
    if ((wasPlaying || wasPaused) && savedSid) {
      ag.sectionId = savedSid;
      ag.idx       = savedIdx;
      ag.playing   = true;
      ag.paused    = false;
      ag.active    = true;
      agUpdateUI();
      setTimeout(function() { agSpeak(savedIdx); }, 120);
    } else {
      agUpdateUI();
    }
  };
})();

/* Chrome keep-alive */
setInterval(function() {
  if (ag.playing && !ag.paused && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}, 5000);

window.addEventListener('pagehide', function() { window.speechSynthesis.cancel(); });
/* ══════════════════════════════════════════════════════════════
   品質強化（後加）：TTS 預熱、鍵盤可操作性、偏好記憶
   ══════════════════════════════════════════════════════════════ */

/* ── 1. TTS：預熱語音清單 ──
   getVoices() 首次常回傳空陣列，導致第一句用到機械預設音。
   先觸發載入，並監聽 voiceschanged，讓 agSpeak 能選到正確語言的聲音。 */
(function warmUpVoices() {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', function () {
      window.speechSynthesis.getVoices();
    });
  } catch (e) {}
})();

/* ── 2. 鍵盤可操作性 ──
   許多互動掛在 <div onclick> 上，鍵盤 Tab 不到、Enter/Space 也無法觸發。
   這裡為「非原生互動元素」補上 role/tabindex 與 Enter/Space 啟動，
   讓鍵盤與螢幕報讀者也能操作。SVG 內的圖表互動先略過（語意需另行處理）。 */
(function enableKeyboardActivation() {
  function enhance() {
    var nativeSel = 'a,button,input,select,textarea,summary,label,' +
                    '[role="button"],[role="tab"],[role="link"],[role="menuitem"]';
    document.querySelectorAll('[onclick]').forEach(function (el) {
      if (el.matches(nativeSel)) return;     // 原生可操作元素不動
      if (el.closest('svg')) return;          // 圖表內互動另行處理
      if (el.dataset.kbdReady) return;        // 避免重複綁定
      el.dataset.kbdReady = '1';
      if (!el.hasAttribute('role'))     el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', enhance);
  else enhance();
})();

/* ── 3. 載入時套用記憶的主題與語言偏好 ──
   主題：優先用使用者上次選擇，否則跟隨系統 prefers-color-scheme。
   語言：沿用使用者上次選擇（預設仍為頁面初始的 EN）。 */
(function applySavedPrefs() {
  /* 主題 */
  try {
    var savedTheme = localStorage.getItem('asus-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var useDark = savedTheme ? (savedTheme === 'dark') : !!prefersDark;
    if (useDark) {
      dark = true;
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeBtn) themeBtn.textContent = '☀️';
    }
  } catch (e) {}
  /* 語言 */
  try {
    var savedLang = localStorage.getItem('asus-lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      var applyLang = function () { if (typeof window.setLang === 'function') window.setLang(savedLang); };
      if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', applyLang);
      else applyLang();
    }
  } catch (e) {}
})();

/* ── 統一「🔊 Audio / 導覽」按鈕位置：一律貼齊該標題列最右邊 ──
   現況有兩種結構：
   (A) 按鈕在 display:flex 的 <h2> 內，緊貼標題文字（未靠右）；
   (B) TP3 的 <h2> 非 flex，按鈕內聯在標題後。
   且部分按鈕帶 inline margin-left:12px，純 CSS 會被蓋掉。
   這裡用 JS 確保每顆按鈕的容器是一條撐滿的 flex 列，並以 margin-left:auto 推到最右。 */
(function unifyAudioButtons() {
  function run() {
    document.querySelectorAll('.section-audio-btn').forEach(function (btn) {
      var parent = btn.parentElement;
      if (!parent) return;

      /* 確保按鈕的容器是一條垂直置中的 flex 列 */
      var pcs = getComputedStyle(parent);
      if (pcs.display !== 'flex' && pcs.display !== 'inline-flex') {
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
      } else if (!parent.style.alignItems) {
        parent.style.alignItems = 'center';
      }

      /* 若容器本身又是某個 flex 容器的子項（如 TP3 的 h2），讓它撐滿整列，
         才能把按鈕推到內容區的最右緣，而不是只到標題文字尾端 */
      var gp = parent.parentElement;
      if (gp) {
        var gcs = getComputedStyle(gp);
        if (gcs.display === 'flex' || gcs.display === 'inline-flex') {
          parent.style.flex = '1 1 auto';
          parent.style.width = '100%';
          parent.style.minWidth = '0';
        }
      }

      /* 推到最右（以 inline 設定，蓋過任何 inline margin-left:12px） */
      btn.style.marginLeft = 'auto';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

/* ══════════════════════════════════════════════════════════════
   APPENDIX（後加）：Glossary 搜尋/篩選 + Team 卡片生成
   ══════════════════════════════════════════════════════════════ */

/* ── Glossary 名詞資料（本報告實際用到的架構與概念） ── */
/* 依類別分組：外部 → 內部 → 成長 → 商模 → 通用，與篩選按鈕順序一致 */
var apxGlossary = [

  /* ── 外部分析 External Environment （10） ── */
  { en: 'PESTEL Analysis', zh: 'PESTEL 分析', cat: 'ext',
    defEn: 'A framework scanning Political, Economic, Social, Technological, Environmental and Legal forces in the macro-environment.',
    defZh: '掃描總體環境中政治、經濟、社會、科技、環境與法律六大外部力量的分析架構。' },
  { en: 'Industry Value Chain', zh: '產業價值鏈', cat: 'ext',
    defEn: 'The sequence of activities an industry performs to turn inputs into end products, used to locate where value is created.',
    defZh: '產業將投入轉化為最終產品的活動序列，用來定位價值在哪一段被創造。' },
  { en: "Porter's Five Forces", zh: '波特五力分析', cat: 'ext',
    defEn: 'Assesses industry attractiveness via rivalry, new entrants, substitutes, and buyer & supplier bargaining power.',
    defZh: '以現有競爭、潛在進入者、替代品、買方與供應商議價力，評估產業吸引力的架構。' },
  { en: 'Product Life Cycle', zh: '產品生命週期', cat: 'ext',
    defEn: 'The stages a product passes through — introduction, growth, maturity, decline — shaping strategy at each phase.',
    defZh: '產品歷經導入、成長、成熟、衰退各階段，並據此調整對應策略。' },
  { en: 'Competitor Analysis', zh: '競爭者分析', cat: 'ext',
    defEn: 'Comparing rivals across capabilities and positioning to understand relative competitive standing.',
    defZh: '比較對手的能力與定位，以理解自身相對的競爭位置。' },
  { en: 'SWOT Analysis', zh: 'SWOT 分析', cat: 'ext',
    defEn: 'Summarizes internal Strengths & Weaknesses against external Opportunities & Threats.',
    defZh: '彙整內部優勢、劣勢與外部機會、威脅的綜合分析工具。' },
  { en: 'Bargaining Power of Buyers', zh: '買方議價能力', cat: 'ext',
    defEn: 'How much pressure customers can put on price, quality and terms.',
    defZh: '顧客對價格、品質與條件能施加多少壓力。' },
  { en: 'Bargaining Power of Suppliers', zh: '供應商議價能力', cat: 'ext',
    defEn: 'How much leverage input providers (e.g. chip makers) hold over the firm.',
    defZh: '上游供應者（如晶片廠）對企業握有多少籌碼。' },
  { en: 'Threat of Substitutes', zh: '替代品威脅', cat: 'ext',
    defEn: 'The risk that different products meet the same customer need (e.g. tablets vs laptops).',
    defZh: '不同產品滿足相同需求所帶來的風險（如平板取代筆電）。' },
  { en: 'Barriers to Entry', zh: '進入障礙', cat: 'ext',
    defEn: 'Obstacles — capital, brand, scale, technology — that deter new competitors.',
    defZh: '阻擋新競爭者的門檻，如資本、品牌、規模與技術。' },

  /* ── 內部分析 Internal Analysis （12） ── */
  { en: 'Business Lines', zh: '事業線', cat: 'int',
    defEn: 'The distinct product/market segments a firm operates, e.g. consumer PCs, gaming, components, AI infrastructure.',
    defZh: '企業經營的各個產品／市場區隔，如消費型 PC、電競、零組件、AI 基礎設施。' },
  { en: 'Corporate Value Chain', zh: '企業價值鏈', cat: 'int',
    defEn: "A firm's own primary and support activities (R&D, procurement, marketing, service) that build competitive advantage.",
    defZh: '企業自身的主要與支援活動（研發、採購、行銷、售後），用以建立競爭優勢。' },
  { en: 'Key Resources (RBV)', zh: '關鍵資源（資源基礎觀點）', cat: 'int',
    defEn: 'Valuable, rare, hard-to-imitate and organized resources that underpin sustained competitive advantage.',
    defZh: '具價值、稀少、難模仿且被妥善組織的資源，是持續競爭優勢的基礎（VRIO）。' },
  { en: 'Core Competencies', zh: '核心競爭力', cat: 'int',
    defEn: 'The unique bundle of skills and know-how a firm does better than rivals and can leverage across markets.',
    defZh: '企業勝過對手、且能跨市場運用的獨特技能與專業組合。' },
  { en: 'Complementary Assets', zh: '互補性資產', cat: 'int',
    defEn: 'Supporting assets (distribution, brand, partners) needed to commercialize a core capability successfully.',
    defZh: '將核心能力成功商業化所需的配套資產，如通路、品牌、合作夥伴。' },
  { en: 'Dynamic Capabilities', zh: '動態能力', cat: 'int',
    defEn: "A firm's ability to sense opportunities, seize them, and reconfigure resources in fast-changing environments.",
    defZh: '企業在快速變動環境中，感知機會、掌握機會並重新配置資源的能力。' },
  { en: 'Sensing · Seizing · Reconfiguring', zh: '感知 · 掌握 · 重組', cat: 'int',
    defEn: "Teece's three micro-foundations of dynamic capabilities.",
    defZh: 'Teece 提出之動態能力的三項微觀基礎。' },
  { en: 'VRIO Framework', zh: 'VRIO 架構', cat: 'int',
    defEn: 'Tests whether a resource is Valuable, Rare, costly to Imitate, and Organized to exploit.',
    defZh: '檢驗資源是否具價值、稀少、難模仿且組織能善用之，以判斷競爭優勢。' },
  { en: 'Economies of Scale', zh: '規模經濟', cat: 'int',
    defEn: 'Unit cost falls as output volume rises, a key advantage in hardware manufacturing.',
    defZh: '產量越大、單位成本越低，是硬體製造的關鍵優勢。' },
  { en: 'Economies of Scope', zh: '範疇經濟', cat: 'int',
    defEn: 'Cost savings from sharing resources across multiple product lines.',
    defZh: '跨多條產品線共用資源所產生的成本節省。' },
  { en: 'Brand Equity', zh: '品牌權益', cat: 'int',
    defEn: 'The commercial value derived from customer perception of a brand (e.g. ROG).',
    defZh: '由顧客對品牌（如 ROG）認知所衍生的商業價值。' },
  { en: 'R&D Intensity', zh: '研發強度', cat: 'int',
    defEn: 'R&D spending as a share of revenue, signaling commitment to innovation.',
    defZh: '研發支出占營收比重，反映企業對創新的投入程度。' },

  /* ── 成長策略 Growth Strategy （14） ── */
  { en: 'Vertical Integration', zh: '垂直整合', cat: 'growth',
    defEn: 'Expanding control upstream (suppliers) or downstream (distribution) along the value chain.',
    defZh: '沿價值鏈往上游（供應）或下游（通路）延伸掌控範圍。' },
  { en: 'Horizontal / Product Diversification', zh: '水平／產品多角化', cat: 'growth',
    defEn: 'Growth by adding new products or entering related businesses at the same value-chain level.',
    defZh: '在價值鏈同一層級增加新產品或跨入相關事業以求成長。' },
  { en: 'Geographical Expansion', zh: '地理區域擴張', cat: 'growth',
    defEn: 'Extending operations into new regional or national markets.',
    defZh: '將營運延伸至新的區域或國家市場。' },
  { en: 'Ansoff Matrix', zh: '安索夫矩陣', cat: 'growth',
    defEn: 'Maps growth options across existing/new products and existing/new markets.',
    defZh: '以「既有／新」產品與「既有／新」市場交叉，呈現成長路徑的矩陣。' },
  { en: 'Market Entry Modes', zh: '市場進入模式', cat: 'growth',
    defEn: 'Ways to enter a market — greenfield, alliance, joint venture or M&A — trading off control vs speed/risk.',
    defZh: '進入市場的方式——自行設立、策略聯盟、合資、併購——在控制權與速度／風險間取捨。' },
  { en: 'Greenfield Investment', zh: '自行設立（綠地投資）', cat: 'growth',
    defEn: 'Building new operations from scratch in a market, giving full control but slower and higher-risk.',
    defZh: '在市場中從零建立新營運，控制權最高但較慢、風險較高。' },
  { en: 'Joint Venture / Strategic Alliance', zh: '合資／策略聯盟', cat: 'growth',
    defEn: 'Sharing resources or ownership with a partner to enter or develop a market together.',
    defZh: '與夥伴共享資源或股權，共同進入或開拓市場。' },
  { en: 'M&A', zh: '併購', cat: 'growth',
    defEn: 'Acquiring or merging with another firm to gain capabilities, market access or scale quickly.',
    defZh: '透過收購或合併，快速取得能力、市場或規模。' },
  { en: 'Market Penetration', zh: '市場滲透', cat: 'growth',
    defEn: 'Selling more existing products to existing markets (Ansoff, lowest risk).',
    defZh: '在既有市場銷售更多既有產品（安索夫矩陣中風險最低）。' },
  { en: 'Market Development', zh: '市場開發', cat: 'growth',
    defEn: 'Taking existing products into new markets or segments.',
    defZh: '將既有產品帶入新市場或新客群。' },
  { en: 'Product Development', zh: '產品開發', cat: 'growth',
    defEn: 'Creating new products for existing markets.',
    defZh: '為既有市場開發新產品。' },
  { en: 'Related Diversification', zh: '相關多角化', cat: 'growth',
    defEn: 'Expanding into businesses that share technology, channels or know-how.',
    defZh: '跨入與現有事業共享技術、通路或know-how的業務。' },
  { en: 'Forward / Backward Integration', zh: '前向／後向整合', cat: 'growth',
    defEn: 'Forward = toward customers/distribution; backward = toward suppliers/inputs.',
    defZh: '前向＝往顧客／通路端；後向＝往供應／投入端整合。' },
  { en: 'Strategic Alliance', zh: '策略聯盟', cat: 'growth',
    defEn: 'A cooperative agreement between firms that stops short of a merger.',
    defZh: '企業間的合作協議，但未達合併程度。' },

  /* ── 商業模式 Business Model （6） ── */
  { en: 'Business Model Canvas', zh: '商業模式九宮格', cat: 'model',
    defEn: 'A one-page view of how a firm creates, delivers and captures value across nine building blocks.',
    defZh: '以九大要素，一頁呈現企業如何創造、傳遞與獲取價值的工具。' },
  { en: 'Value Proposition', zh: '價值主張', cat: 'model',
    defEn: 'The bundle of benefits a firm promises to deliver to a customer segment.',
    defZh: '企業對特定客群承諾提供的利益組合。' },
  { en: 'Customer Segments', zh: '客戶區隔', cat: 'model',
    defEn: 'The distinct groups of people or organizations a firm aims to serve.',
    defZh: '企業鎖定服務的不同人群或組織。' },
  { en: 'Revenue Streams', zh: '收益流', cat: 'model',
    defEn: 'The ways a firm earns money from each customer segment.',
    defZh: '企業從各客群賺取收入的方式。' },
  { en: 'Key Partnerships', zh: '關鍵合作夥伴', cat: 'model',
    defEn: 'The network of suppliers and partners that make the business model work.',
    defZh: '使商業模式運作的供應商與夥伴網絡。' },
  { en: 'Cost Structure', zh: '成本結構', cat: 'model',
    defEn: 'All costs incurred to operate the business model.',
    defZh: '營運商業模式所產生的全部成本。' },

  /* ── 通用名詞 General Terms （7） ── */
  { en: 'Fabless / ODM / OEM', zh: '無廠／ODM／OEM', cat: 'general',
    defEn: 'Fabless: designs but outsources production. ODM: designs & makes for others. OEM: makes to a client\u2019s design.',
    defZh: '無廠：自行設計但外包生產；ODM：替他人設計並製造；OEM：依客戶設計代工製造。' },
  { en: 'AI Infrastructure / Data Center', zh: 'AI 基礎設施／資料中心', cat: 'general',
    defEn: 'Servers and systems for AI training/inference — ASUS\u2019s highest-growth emerging segment.',
    defZh: '用於 AI 訓練／推論的伺服器與系統——華碩成長性最高的新興業務。' },
  { en: 'CAGR', zh: '年複合成長率', cat: 'general',
    defEn: 'Compound Annual Growth Rate — the smoothed annual growth over a period.',
    defZh: '一段期間內平滑後的年化成長率。' },
  { en: 'Market Share', zh: '市場占有率', cat: 'general',
    defEn: 'A firm\u2019s sales as a percentage of total market sales.',
    defZh: '企業銷售額占整體市場銷售額的比例。' },
  { en: 'Gross / Operating Margin', zh: '毛利率／營業利益率', cat: 'general',
    defEn: 'Profitability ratios showing how much of revenue remains after costs.',
    defZh: '顯示扣除成本後營收留存比例的獲利指標。' },
  { en: 'Supply Chain', zh: '供應鏈', cat: 'general',
    defEn: 'The full flow from raw materials and components to the finished product.',
    defZh: '從原料、零組件到成品的完整流程。' },
  { en: 'ESG', zh: 'ESG（環境社會治理）', cat: 'general',
    defEn: 'Environmental, Social and Governance criteria used to assess sustainability.',
    defZh: '用以評估企業永續性的環境、社會與公司治理準則。' }
];

var apxCatLabel = {
  ext:     { en: 'External', zh: '外部' },
  int:     { en: 'Internal', zh: '內部' },
  growth:  { en: 'Growth',   zh: '成長' },
  model:   { en: 'Model',    zh: '商模' },
  general: { en: 'General',  zh: '通用' }
};

function apxEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

(function initGlossary() {
  function run() {
    var grid  = document.getElementById('apxGlossaryGrid');
    var empty = document.getElementById('apxGlossaryEmpty');
    var input = document.getElementById('apxGlossarySearch');
    var chips = document.getElementById('apxGlossaryChips');
    if (!grid) return;
    var activeCat = 'all';

    function render() {
      var q = (input && input.value ? input.value : '').trim().toLowerCase();
      var html = '', shown = 0;
      apxGlossary.forEach(function (t) {
        if (activeCat !== 'all' && t.cat !== activeCat) return;
        if (q) {
          var hay = (t.en + ' ' + t.zh + ' ' + t.defEn + ' ' + t.defZh).toLowerCase();
          if (hay.indexOf(q) === -1) return;
        }
        shown++;
        var cl = apxCatLabel[t.cat] || { en: t.cat, zh: t.cat };
        html +=
          '<div class="apx-term-card" data-cat="' + apxEsc(t.cat) + '">' +
            '<div class="apx-term-head">' +
              '<div>' +
                '<div class="apx-term-en">' + apxEsc(t.en) + '</div>' +
                '<div class="apx-term-zh">' + apxEsc(t.zh) + '</div>' +
              '</div>' +
              '<span class="apx-term-cat"><span class="en">' + apxEsc(cl.en) + '</span><span class="zh">' + apxEsc(cl.zh) + '</span></span>' +
            '</div>' +
            '<div class="apx-term-def en">' + apxEsc(t.defEn) + '</div>' +
            '<div class="apx-term-def zh" style="font-family:var(--font-zh);">' + apxEsc(t.defZh) + '</div>' +
          '</div>';
      });
      grid.innerHTML = html;
      if (empty) empty.style.display = shown ? 'none' : 'block';
    }

    if (input) input.addEventListener('input', render);
    if (chips) chips.addEventListener('click', function (e) {
      var btn = e.target.closest('.apx-chip');
      if (!btn) return;
      chips.querySelectorAll('.apx-chip').forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      activeCat = btn.getAttribute('data-cat') || 'all';
      render();
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

(function initTeamGrid() {
  function run() {
    var grid = document.getElementById('apxTeamGrid');
    if (!grid || typeof members === 'undefined') return;
    var html = '';
    // Explicit display order: top row (women) then bottom row (men), per spec.
    var ORDER = ['May', 'Atherine', 'Fanny', 'Allen Huang', 'Wesley', 'Datou'];
    var names = ORDER.filter(function (n) { return members[n]; });
    Object.keys(members).forEach(function (n) { if (names.indexOf(n) === -1) names.push(n); });
    names.forEach(function (name) {
      var m = members[name];
      var chs = Array.isArray(m.chapters)
        ? m.chapters
        : (m.chapters
            ? [{ tp: '', en: (m.chapters.en || m.chapters), zh: (m.chapters.zh || m.chapters) }]
            : []);
      var rolesHtml = chs.map(function (c) {
        var tp = c.tp ? '<span class="apx-member-tp">' + apxEsc(c.tp) + '</span>' : '';
        return '<div class="apx-member-role-item">' + tp +
                 '<span class="apx-member-role">' +
                   '<span class="en">' + apxEsc(c.en || '') + '</span>' +
                   '<span class="zh" style="font-family:var(--font-zh);">' + apxEsc(c.zh || '') + '</span>' +
                 '</span>' +
               '</div>';
      }).join('');
      var photo = m.photo
        ? '<img class="apx-member-photo" src="' + m.photo + '" alt="' + apxEsc(name) + '" loading="lazy" />'
        : '<div class="apx-member-photo-ph">' + apxEsc(name.charAt(0).toUpperCase()) + '</div>';
      var video = m.intro
        ? '<a class="apx-member-video" href="' + apxEsc(m.intro) + '" target="_blank" rel="noopener">' +
            '<span class="en">▶ Watch intro</span><span class="zh" style="font-family:var(--font-zh);">▶ 觀看自我介紹</span></a>'
        : '<div class="apx-member-video-soon"><span class="en">Video coming soon</span><span class="zh" style="font-family:var(--font-zh);">影片待上傳</span></div>';
      html +=
        '<div class="apx-member-card">' +
          photo +
          '<div class="apx-member-name">' + apxEsc(name) + '</div>' +
          '<div class="apx-member-id">' + apxEsc(m.id || '') + '</div>' +
          '<div class="apx-member-role-label"><span class="en">Responsible Sections</span><span class="zh" style="font-family:var(--font-zh);">負責章節</span></div>' +
          '<div class="apx-member-roles">' + rolesHtml + '</div>' +
          video +
        '</div>';
    });
    grid.innerHTML = html;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

/* ══════════════════════════════════════════════════════════════
   INTERACTIVE LAB（後加）
   ══════════════════════════════════════════════════════════════ */
(function initLab() {
  function run() {
    var lab = document.getElementById('appendix-lab');
    if (!lab) return;
    var isZh = function () { return (document.body.getAttribute('data-lang') || 'en') === 'zh'; };

    /* ── 分頁切換 ── */
    var tabs = lab.querySelectorAll('.lab-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
        var key = tab.getAttribute('data-lab');
        lab.querySelectorAll('.lab-panel').forEach(function (p) { p.hidden = true; p.classList.remove('active'); });
        var panel = document.getElementById('lab-' + key);
        if (panel) { panel.hidden = false; panel.classList.add('active'); }
      });
    });

    /* ── 五力評分器 ── */
    var forces = [
      { id: 'rivalry',   en: 'Competitive Rivalry',      zh: '現有競爭', icon: '⚔️', def: 5 },
      { id: 'entrants',  en: 'Threat of New Entrants',   zh: '新進入者威脅', icon: '🚪', def: 2 },
      { id: 'substitute',en: 'Threat of Substitutes',    zh: '替代品威脅', icon: '🔄', def: 3 },
      { id: 'buyers',    en: 'Buyer Power',              zh: '買方議價力', icon: '🛒', def: 4 },
      { id: 'suppliers', en: 'Supplier Power',           zh: '供應商議價力', icon: '🏭', def: 4 }
    ];
    var scores = {};
    forces.forEach(function (f) { scores[f.id] = f.def; });
    var forcesCtl = document.getElementById('forcesControls');
    function buildForces() {
      if (!forcesCtl) return;
      var zh = isZh(), html = '';
      forces.forEach(function (f) {
        html += '<div class="lab-force-row">';
        html += '<div class="lab-force-name">' + f.icon + ' <span>' + (zh ? f.zh : f.en) + '</span><b data-sc="' + f.id + '">' + scores[f.id] + '/5</b></div>';
        html += '<div class="lab-force-stars" data-force="' + f.id + '">';
        for (var i = 1; i <= 5; i++) html += '<button type="button" class="lab-star' + (i <= scores[f.id] ? ' on' : '') + '" data-v="' + i + '" aria-label="' + i + '">' + i + '</button>';
        html += '</div></div>';
      });
      forcesCtl.innerHTML = html;
    }
    function updateForces() {
      var sum = 0; forces.forEach(function (f) { sum += scores[f.id]; });
      var avg = sum / forces.length;
      document.getElementById('forcesAvg').textContent = avg.toFixed(1);
      var zh = isZh(), v;
      if (avg >= 4) v = zh ? '高度競爭、產業吸引力低' : 'Intense — low industry attractiveness';
      else if (avg >= 3) v = zh ? '中等壓力、需差異化' : 'Moderate — differentiation needed';
      else v = zh ? '壓力較低、相對有利' : 'Mild — relatively favorable';
      document.getElementById('forcesVerdict').textContent = v;
      drawRadar();
    }
    function drawRadar() {
      var svg = document.getElementById('forcesRadar'); if (!svg) return;
      var cx = 130, cy = 130, R = 92, n = forces.length, zh = isZh();
      function pt(i, rad) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]; }
      var g = '';
      for (var ring = 1; ring <= 5; ring++) {
        var pts = [];
        for (var i = 0; i < n; i++) { var p = pt(i, R * ring / 5); pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); }
        g += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="var(--border)" stroke-width="1"></polygon>';
      }
      for (var i = 0; i < n; i++) { var pe = pt(i, R); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + pe[0].toFixed(1) + '" y2="' + pe[1].toFixed(1) + '" stroke="var(--border)"></line>'; }
      var dp = [];
      for (var i = 0; i < n; i++) { var p = pt(i, R * scores[forces[i].id] / 5); dp.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); }
      g += '<polygon points="' + dp.join(' ') + '" fill="rgba(194,24,91,.22)" stroke="#C2185B" stroke-width="2"></polygon>';
      for (var i = 0; i < n; i++) { var p = pt(i, R * scores[forces[i].id] / 5); g += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5" fill="#C2185B"></circle>'; }
      for (var i = 0; i < n; i++) { var lp = pt(i, R + 16); g += '<text x="' + lp[0].toFixed(1) + '" y="' + lp[1].toFixed(1) + '" text-anchor="middle" font-size="9.5" fill="var(--text-secondary)">' + (zh ? forces[i].zh : forces[i].en.split(' ')[0]) + '</text>'; }
      svg.innerHTML = g;
    }
    if (forcesCtl) {
      forcesCtl.addEventListener('click', function (e) {
        var btn = e.target.closest('.lab-star'); if (!btn) return;
        var wrap = btn.closest('.lab-force-stars'); var fid = wrap.getAttribute('data-force');
        var v = +btn.getAttribute('data-v'); scores[fid] = v;
        wrap.querySelectorAll('.lab-star').forEach(function (s) { s.classList.toggle('on', +s.getAttribute('data-v') <= v); });
        var b = forcesCtl.querySelector('b[data-sc="' + fid + '"]'); if (b) b.textContent = v + '/5';
        updateForces();
      });
    }

    /* ── VRIO 資源分析器 ── */
    /* 四道關卡：V 價值, R 稀少, I 難以模仿, O 組織能否善用 */
    var vrioRes = [
      { id: 'rog', icon: '🎮', en: 'ROG Brand Equity', zh: 'ROG 品牌權益',
        descEn: 'The Republic of Gamers brand commands premium pricing and fierce loyalty in the high-end gaming segment.',
        descZh: 'ROG 玩家共和國品牌在高階電競市場享有溢價能力與極高忠誠度。',
        ans: { v: true, r: true, i: true, o: true },
        whyEn: ['Valuable: lets ASUS charge a premium and defend margins.', 'Rare: few rivals own a gaming brand with this status.', 'Hard to imitate: brand equity is built over many years and cannot be bought quickly.', 'Organized: ASUS backs it with esports sponsorship, a dedicated product line and marketing.'],
        whyZh: ['有價值：使華碩能收取溢價、守住利潤。', '稀少：能擁有此地位電競品牌的對手極少。', '難以模仿：品牌權益需多年累積，無法快速買到。', '善用組織：華碩以電競贊助、專屬產品線與行銷全力支撐。'] },
      { id: 'fabless', icon: '🏭', en: 'Fabless / Asset-light Model', zh: '無廠／輕資產模式',
        descEn: 'ASUS outsources manufacturing to ODM/EMS partners (Pegatron, Compal), keeping capital tied up in design rather than factories.',
        descZh: '華碩將製造外包給 ODM/EMS 夥伴（和碩、仁寶），把資本集中在設計而非廠房。',
        ans: { v: true, r: false, i: false, o: true },
        whyEn: ['Valuable: lowers capital intensity and adds flexibility.', 'NOT rare: most PC brands (HP, Dell, Acer) use the same outsourcing model.', 'Stops at the Rarity gate → competitive parity, not an advantage.'],
        whyZh: ['有價值：降低資本密集度、提高彈性。', '不稀少：多數 PC 品牌（HP、Dell、宏碁）都採同樣外包模式。', '在「稀少性」關卡止步 → 屬於競爭等位，而非優勢。'] },
      { id: 'supply', icon: '🔗', en: 'NVIDIA / Intel / AMD Ties', zh: '與 NVIDIA／Intel／AMD 的關係',
        descEn: 'Long-standing supplier relationships secure early access to leading GPUs and CPUs for AI servers and gaming.',
        descZh: '長期的供應商關係，確保能優先取得 AI 伺服器與電競所需的頂尖 GPU 與 CPU。',
        ans: { v: true, r: true, i: false, o: true },
        whyEn: ['Valuable: early chip access is critical in the AI race.', 'Rare: only a handful of tier-1 partners get this priority.', 'Imitable: rivals can negotiate similar deals over time, so the edge is temporary.', 'Result: temporary competitive advantage.'],
        whyZh: ['有價值：在 AI 競賽中，優先取得晶片至關重要。', '稀少：能獲此優先權的一線夥伴屈指可數。', '可被模仿：對手假以時日也能談到類似條件，優勢僅屬暫時。', '結論：暫時性競爭優勢。'] },
      { id: 'rd', icon: '🔬', en: 'In-house R&D & Patents', zh: '自有研發與專利',
        descEn: 'Sustained R&D investment and a deep patent portfolio in thermal design, motherboards and AI systems.',
        descZh: '持續的研發投入，以及在散熱設計、主機板與 AI 系統上的深厚專利組合。',
        ans: { v: true, r: true, i: true, o: true },
        whyEn: ['Valuable: drives product differentiation and quality leadership.', 'Rare: the accumulated know-how and patents are not widely held.', 'Hard to imitate: protected by patents and years of tacit engineering knowledge.', 'Organized: an established R&D structure turns it into shipping products.'],
        whyZh: ['有價值：驅動產品差異化與品質領先。', '稀少：累積的技術know-how與專利並非人人擁有。', '難以模仿：受專利與多年隱性工程知識保護。', '善用組織：成熟的研發體系能將其轉化為實際產品。'] },
      { id: 'scale', icon: '📦', en: 'Global Scale & Distribution', zh: '全球規模與通路',
        descEn: 'A worldwide distribution network and purchasing scale across 140+ markets.',
        descZh: '橫跨 140 多個市場的全球通路網絡與採購規模。',
        ans: { v: true, r: false, i: false, o: true },
        whyEn: ['Valuable: scale lowers cost and widens reach.', 'NOT rare: major rivals operate at comparable global scale.', 'Stops at the Rarity gate → competitive parity.'],
        whyZh: ['有價值：規模降低成本、擴大觸及。', '不稀少：主要對手同樣具備相當的全球規模。', '在「稀少性」關卡止步 → 競爭等位。'] }
    ];
    var vrioGateDefs = [
      { k: 'v', icon: '💎', en: 'Valuable?', zh: '有價值？', subEn: 'Does it exploit an opportunity or neutralize a threat?', subZh: '能把握機會或抵禦威脅嗎？' },
      { k: 'r', icon: '💠', en: 'Rare?', zh: '稀少？', subEn: 'Do few competitors possess it?', subZh: '只有少數對手擁有嗎？' },
      { k: 'i', icon: '🛡️', en: 'Hard to Imitate?', zh: '難以模仿？', subEn: 'Is it costly for others to copy?', subZh: '別人複製的代價高嗎？' },
      { k: 'o', icon: '⚙️', en: 'Organized to Exploit?', zh: '組織能善用？', subEn: 'Is the firm set up to capture its value?', subZh: '公司是否有條件發揮其價值？' }
    ];
    /* 判定：依序套用四道關卡，第一個「否」決定結果 */
    var vrioVerdicts = {
      disadvantage: { en: 'Competitive Disadvantage', zh: '競爭劣勢', color: '#C0392B' },
      parity:       { en: 'Competitive Parity',       zh: '競爭等位', color: '#7F8C8D' },
      temporary:    { en: 'Temporary Advantage',      zh: '暫時性競爭優勢', color: '#E67E22' },
      unused:       { en: 'Unused Advantage',         zh: '未被善用的優勢', color: '#2980B9' },
      sustained:    { en: 'Sustained Advantage',      zh: '持久性競爭優勢', color: '#1F9E5A' }
    };
    function vrioEvaluate(a) {
      if (a.v === false) return 'disadvantage';
      if (a.v == null) return null;
      if (a.r === false) return 'parity';
      if (a.r == null) return null;
      if (a.i === false) return 'temporary';
      if (a.i == null) return null;
      if (a.o === false) return 'unused';
      if (a.o == null) return null;
      return 'sustained';
    }
    var vrioState = { resId: 'rog', ans: { v: null, r: null, i: null, o: null }, revealed: false };
    var vrioResEl = document.getElementById('vrioResources');
    var vrioGatesEl = document.getElementById('vrioGates');

    function curRes() { return vrioRes.filter(function (r) { return r.id === vrioState.resId; })[0]; }

    function buildVrioResources() {
      if (!vrioResEl) return;
      var zh = isZh(), html = '';
      vrioRes.forEach(function (r) {
        html += '<button type="button" class="lab-vrio-res' + (r.id === vrioState.resId ? ' active' : '') + '" data-res="' + r.id + '">' +
                r.icon + ' <span>' + (zh ? r.zh : r.en) + '</span></button>';
      });
      vrioResEl.innerHTML = html;
    }
    function buildVrioGates() {
      if (!vrioGatesEl) return;
      var zh = isZh(), html = '';
      vrioGateDefs.forEach(function (g, idx) {
        var val = vrioState.ans[g.k];
        html += '<div class="lab-vrio-gate" data-gate="' + g.k + '">';
        html += '<div class="lab-vrio-gate-q"><span class="lab-vrio-gate-n">' + (idx + 1) + '</span>' + g.icon + ' <b>' + (zh ? g.zh : g.en) + '</b><span class="lab-vrio-gate-sub">' + (zh ? g.subZh : g.subEn) + '</span></div>';
        html += '<div class="lab-vrio-gate-btns">';
        html += '<button type="button" class="lab-vrio-yn yes' + (val === true ? ' on' : '') + '" data-gate="' + g.k + '" data-v="yes">' + (zh ? '是' : 'Yes') + '</button>';
        html += '<button type="button" class="lab-vrio-yn no' + (val === false ? ' on' : '') + '" data-gate="' + g.k + '" data-v="no">' + (zh ? '否' : 'No') + '</button>';
        html += '</div></div>';
      });
      vrioGatesEl.innerHTML = html;
    }
    function renderVrioVerdict() {
      var zh = isZh();
      var badge = document.getElementById('vrioBadge');
      var vname = document.getElementById('vrioVerdictName');
      var pathEl = document.getElementById('vrioPath');
      var explEl = document.getElementById('vrioExplain');
      var res = vrioEvaluate(vrioState.ans);
      // path chips for the four gates
      var chips = '';
      vrioGateDefs.forEach(function (g) {
        var val = vrioState.ans[g.k];
        var cls = val === true ? 'yes' : (val === false ? 'no' : 'na');
        var mark = val === true ? '✓' : (val === false ? '✕' : '·');
        chips += '<span class="lab-vrio-chip ' + cls + '">' + g.k.toUpperCase() + ' ' + mark + '</span>';
      });
      pathEl.innerHTML = chips;
      if (!res) {
        badge.textContent = '—'; badge.style.background = 'var(--border)'; badge.style.color = 'var(--text-label)';
        vname.innerHTML = '<span class="' + (zh ? 'zh' : 'en') + '"' + (zh ? ' style="font-family:var(--font-zh);"' : '') + '>' + (zh ? '回答上方關卡後顯示判定' : 'Answer the gates to see the verdict') + '</span>';
        explEl.innerHTML = '';
        return;
      }
      var vd = vrioVerdicts[res];
      badge.textContent = (zh ? vd.zh : vd.en);
      badge.style.background = vd.color; badge.style.color = '#fff';
      vname.innerHTML = '';
      // explanation: if revealed, show the model answer for the chosen resource
      if (vrioState.revealed) {
        var r = curRes();
        var modelRes = vrioEvaluate(r.ans);
        var mvd = vrioVerdicts[modelRes];
        var why = (zh ? r.whyZh : r.whyEn);
        var list = '<ul class="lab-vrio-why' + (zh ? ' zh' : '') + '"' + (zh ? ' style="font-family:var(--font-zh);"' : '') + '>';
        why.forEach(function (w) { list += '<li>' + w + '</li>'; });
        list += '</ul>';
        var match = (modelRes === res);
        var head = '<div class="lab-vrio-model-head" style="color:' + mvd.color + '">' +
                   (zh ? '參考解答：' : 'Model answer: ') + (zh ? mvd.zh : mvd.en) +
                   (match ? ' <span class="lab-vrio-match yes">' + (zh ? '✓ 與你一致' : '✓ matches you') + '</span>'
                          : ' <span class="lab-vrio-match no">' + (zh ? '↺ 與你不同' : '↺ differs from you') + '</span>') +
                   '</div>';
        explEl.innerHTML = head + list;
      } else {
        explEl.innerHTML = '<div class="lab-vrio-hint' + (zh ? ' zh' : '') + '"' + (zh ? ' style="font-family:var(--font-zh);"' : '') + '>' +
          (zh ? '這是你的判定。按「顯示參考解答」比對華碩的實際情況與理由。' : 'This is your verdict. Hit "Reveal model answer" to compare with ASUS\'s real case and reasoning.') + '</div>';
      }
    }
    function renderVrioAll() { buildVrioResources(); buildVrioGates(); renderVrioVerdict(); }

    if (vrioResEl) {
      vrioResEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.lab-vrio-res'); if (!btn) return;
        vrioState.resId = btn.getAttribute('data-res');
        vrioState.ans = { v: null, r: null, i: null, o: null };
        vrioState.revealed = false;
        renderVrioAll();
      });
    }
    if (vrioGatesEl) {
      vrioGatesEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.lab-vrio-yn'); if (!btn) return;
        var g = btn.getAttribute('data-gate'); var v = btn.getAttribute('data-v') === 'yes';
        vrioState.ans[g] = v;
        buildVrioGates(); renderVrioVerdict();
      });
    }
    var vrioRevealBtn = document.getElementById('vrioReveal');
    if (vrioRevealBtn) vrioRevealBtn.addEventListener('click', function () {
      vrioState.revealed = true;
      // fill in any unanswered gates with the model answer so a verdict shows
      var r = curRes();
      vrioGateDefs.forEach(function (g) { if (vrioState.ans[g.k] == null) vrioState.ans[g.k] = r.ans[g.k]; });
      renderVrioAll();
    });

    /* 初始繪製 */
    buildForces();
    updateForces();
    renderVrioAll();

    /* 語言切換時重繪文字相關圖（掛在語言按鈕上） */
    ['btnEN', 'btnZH'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', function () {
        setTimeout(function () { buildForces(); updateForces(); renderVrioAll(); }, 30);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
