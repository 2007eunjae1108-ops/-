const cardList = document.getElementById("cardList");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const periodText = document.getElementById("periodText");
const prevPeriod = document.getElementById("prevPeriod");
const nextPeriod = document.getElementById("nextPeriod");
const addPeriodBtn = document.querySelector(".fab-add-period");

const detail = document.getElementById("detail");
const backBtn = document.getElementById("backBtn");
const detailTitle = document.getElementById("detailTitle");
const detailIncome = document.getElementById("totalIncome");
const detailExpense = document.getElementById("totalExpense");
const detailBalance = document.getElementById("balance");

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
const addIncomeBtn = document.getElementById("addIncome");
const addExpenseBtn = document.getElementById("addExpense");
const incomeText = document.getElementById("incomeTitle");
const incomeAmount = document.getElementById("incomeAmount");
const expenseText = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");

const summaryTab = document.getElementById("summaryTab");
const incomeTab = document.getElementById("incomeTab");
const expenseTab = document.getElementById("expenseTab");
const tabBtns = document.querySelectorAll(".tab");

let periods = [];
let periodIndex = 0;
let cards = [];
let currentIndex = null;
let deleteMode = false;
let selectedDeleteIndex = null;

// localStorage 로드
const saved = localStorage.getItem("periods");
if (saved) periods = JSON.parse(saved);
else periods = [{ start: "12.01", end: "01.19", cards: [] }];

function saveData() {
  localStorage.setItem("periods", JSON.stringify(periods));
}

function loadPeriod() {
  const period = periods[periodIndex];
  periodText.innerText = `${period.start} ~ ${period.end}`;
  cards = period.cards;
  renderCards();
  saveData();
}

// 카드 렌더
function renderCards() {
  cardList.innerHTML = "";

  cards.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <div class="card-title">${card.title}</div>
      <div class="card-summary">
        <span>수입 ${card.income.toLocaleString()}</span>
        <span>지출 ${card.expense.toLocaleString()}</span>
        <span>잔액 ${(card.income - card.expense).toLocaleString()}</span>
      </div>
    `;

    el.onclick = () => openDetail(index);
    cardList.appendChild(el);
  });
}

// 카드 추가
addBtn.onclick = () => {
  const title = prompt("카드 제목 입력");
  if (!title) return;
  cards.push({ title, income: 0, expense: 0, incomes: [], expenses: [] });
  saveData();
  renderCards();
};

// 상세 열기
function openDetail(index) {
  currentIndex = index;
  detailTitle.innerText = cards[index].title;
  detail.classList.remove("hidden");
  requestAnimationFrame(() => detail.classList.add("show"));
  showTab("summary");
  updateSummary();
}

// 뒤로가기
backBtn.onclick = () => {
  detail.classList.remove("show");
  setTimeout(() => detail.classList.add("hidden"), 300);
};

// 탭
tabBtns.forEach((btn) => {
  btn.onclick = () => showTab(btn.dataset.tab);
});

function showTab(tab) {
  tabBtns.forEach((b) => b.classList.remove("active"));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add("active");

  summaryTab.classList.add("hidden");
  incomeTab.classList.add("hidden");
  expenseTab.classList.add("hidden");

  if (tab === "summary") summaryTab.classList.remove("hidden");
  if (tab === "income") incomeTab.classList.remove("hidden");
  if (tab === "expense") expenseTab.classList.remove("hidden");
}

// ✅ 핵심: 요약 + 리스트 렌더
function updateSummary() {
  const card = cards[currentIndex];

  card.income = card.incomes.reduce((s, i) => s + i.amount, 0);
  card.expense = card.expenses.reduce((s, i) => s + i.amount, 0);

  detailIncome.innerText = card.income.toLocaleString();
  detailExpense.innerText = card.expense.toLocaleString();
  detailBalance.innerText = (card.income - card.expense).toLocaleString();

  // 수입
  // 수입 렌더
  incomeList.innerHTML = "";
  card.incomes.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
    <div class="item-left">
      <div class="item-text">${item.text}</div>
      <div class="item-amount">${item.amount.toLocaleString()}원</div>
    </div>
    <button class="delete-btn">－</button>
  `;

    div.querySelector(".delete-btn").onclick = () => {
      card.incomes.splice(i, 1);
      updateSummary();
      saveData();
    };

    incomeList.prepend(div);
  });

  // 지출
  // 지출 렌더
  expenseList.innerHTML = "";
  card.expenses.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
    <div class="item-left">
      <div class="item-text">${item.text}</div>
      <div class="item-amount">${item.amount.toLocaleString()}원</div>
    </div>
    <button class="delete-btn">－</button>
  `;

    div.querySelector(".delete-btn").onclick = () => {
      card.expenses.splice(i, 1);
      updateSummary();
      saveData();
    };

    expenseList.prepend(div);
  });
}
// ✅ 핵심 수정 ① 수입 → unshift
addIncomeBtn.onclick = () => {
  const text = incomeText.value.trim();
  const amount = Number(incomeAmount.value);
  if (!text || !amount) return;

  cards[currentIndex].incomes.push({ text, amount }); // ✅ 여기서만 위로
  incomeText.value = "";
  incomeAmount.value = "";

  updateSummary();
  saveData();
};

// ✅ 핵심 수정 ② 지출 → unshift
addExpenseBtn.onclick = () => {
  const text = expenseText.value.trim();
  const amount = Number(expenseAmount.value);
  if (!text || !amount) return;

  cards[currentIndex].expenses.push({ text, amount });
  expenseText.value = "";
  expenseAmount.value = "";

  updateSummary();
  saveData();
};

loadPeriod();

