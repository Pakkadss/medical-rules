// รวมข้อมูลจากไฟล์ย่อยทั้งหมดเข้ามาไว้ที่นี่
const menuData = {
  "home": {
    name: "หน้าแรก",
    title: "หน้าแรก",
    desc: "ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูลและกฎระเบียบแพทย์ (MEDICAL RULES)",
    subMenus: {
      "home_main": { name: "หน้าหลัก", isHome: true }
    }
  },
  "rules": rulesData,
  "practice": practiceData,
  "hospital_use": hospitalData,
  "story_rules": storyData,
  "blacklist_rules": blacklistData,
  "fee_rules": feeData
};

let currentMainKey = "rules";
let currentSubKey = "doctor_rules";

const mainNavEl = document.getElementById('mainNav');
const subNavEl = document.getElementById('subNav');
const pageTitleEl = document.getElementById('pageTitle');
const pageDescriptionEl = document.getElementById('pageDescription');
const contentListEl = document.getElementById('contentList');
const sectionCountEl = document.getElementById('sectionCount');
const searchInputEl = document.getElementById('searchInput');
const emptyStateEl = document.getElementById('emptyState');

function init() {
  renderMainNav();
  renderSubNav(currentMainKey);
  renderContent();

  searchInputEl.addEventListener('input', renderContent);
}

function renderMainNav() {
  mainNavEl.innerHTML = '';
  Object.keys(menuData).forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = menuData[key].name;
    if (key === currentMainKey) btn.classList.add('active');
    btn.onclick = () => {
      currentMainKey = key;
      currentSubKey = Object.keys(menuData[key].subMenus)[0];
      searchInputEl.value = '';
      renderMainNav();
      renderSubNav(currentMainKey);
      renderContent();
    };
    mainNavEl.appendChild(btn);
  });
}

function renderSubNav(mainKey) {
  subNavEl.innerHTML = '';
  const subMenus = menuData[mainKey].subMenus;
  Object.keys(subMenus).forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = subMenus[key].name;
    if (key === currentSubKey) btn.classList.add('active');
    btn.onclick = () => {
      currentSubKey = key;
      searchInputEl.value = '';
      renderSubNav(mainKey);
      renderContent();
    };
    subNavEl.appendChild(btn);
  });
}

function renderContent() {
  const currentMenu = menuData[currentMainKey];
  const currentSub = currentMenu.subMenus[currentSubKey];

  pageTitleEl.textContent = currentMenu.title;
  pageDescriptionEl.textContent = currentMenu.desc;

  if (currentSub && currentSub.isHome) {
    sectionCountEl.textContent = "";
    contentListEl.innerHTML = `<div class="home-placeholder"><h2>หน้าแรก</h2><p style="margin-top:8px;">ไม่มีเนื้อหาในหน้านี้</p></div>`;
    emptyStateEl.style.display = 'none';
    return;
  }

  const keyword = searchInputEl.value.trim().toLowerCase();
  const allItems = currentSub ? currentSub.items : [];
  
  const filtered = allItems.filter(item => 
    item.label.toLowerCase().includes(keyword) || 
    item.rules.some(r => r.toLowerCase().includes(keyword))
  );

  sectionCountEl.textContent = `แสดง ${filtered.length} จาก ${allItems.length} ข้อ`;

  contentListEl.innerHTML = '';

  if (filtered.length === 0) {
    emptyStateEl.style.display = 'block';
    return;
  }

  emptyStateEl.style.display = 'none';

  if (currentSub.sectionHeader && !keyword) {
    const mainHeader = document.createElement('h2');
    mainHeader.className = 'section-main-title';
    mainHeader.textContent = currentSub.sectionHeader;
    contentListEl.appendChild(mainHeader);
  }

  if (currentSub.image && !keyword) {
    const imgCard = document.createElement('div');
    imgCard.className = 'card image-card';
    imgCard.innerHTML = `<img src="${currentSub.image}" alt="${currentSub.imageAlt || 'รูปภาพประกอบ'}" class="section-image" />`;
    contentListEl.appendChild(imgCard);
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const rulesHtml = item.rules.map(r => `<span>${r}</span>`).join('<br><br>');
    const penaltyBox = item.penalty ? `<div class="notice-box ${item.isDanger ? 'danger' : ''}">${item.penalty}</div>` : '';

    card.innerHTML = `
      <div class="rule-inline">
        <span class="rule-label">${item.label}</span>
        <div class="rule-text">${rulesHtml}</div>
      </div>
      ${penaltyBox}
    `;

    contentListEl.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', init);