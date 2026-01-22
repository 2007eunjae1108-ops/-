const cardList = document.getElementById("cardList");
const addBtn = document.getElementById("addBtn");

const detail = document.getElementById("detail");
const backBtn = document.getElementById("backBtn");
const detailTitle = document.getElementById("detailTitle");
const detailIncome = document.getElementById("detailIncome");
const detailExpense = document.getElementById("detailExpense");
const detailBalance = document.getElementById("detailBalance");

const incomeText = document.getElementById("incomeText");
const incomeAmount = document.getElementById("incomeAmount");
const addIncomeBtn = document.getElementById("addIncome");

const expenseText = document.getElementById("expenseText");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpense");

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");

let cards = [];
let periodIndex = 0;
let periods = [
  { start: "12.01", end: "01.19", cards: [] },
  { start: "01.20", end: "02.28", cards: [] },
];
let currentIndex = null;

// 상단 화살표 버튼
const periodText = document.getElementById("periodText");
const arrowButtons = document.querySelectorAll(".period .arrow");

arrowButtons[0].onclick = () => {
  if (periodIndex > 0) periodIndex--;
  loadPeriod();
};
arrowButtons[1].onclick = () => {
  if (periodIndex < periods.length - 1) periodIndex++;
  loadPeriod();
};

// 데이터 저장/로드
function saveData() {
  localStorage.setItem("periods", JSON.stringify(periods));
}

function loadData() {
  const saved = localStorage.getItem("periods");
  if (saved) {
    periods = JSON.parse(saved);

    // 기존 카드 데이터가 있어도 수입/지출 배열 초기화
    periods.forEach((period) => {
      period.cards.forEach((card) => {
        if (!Array.isArray(card.incomes)) card.incomes = [];
        if (!Array.isArray(card.expenses)) card.expenses = [];
      });
    });
  }
  loadPeriod();
}

function loadPeriod() {
  periodText.innerText = `${periods[periodIndex].start} ~ ${periods[periodIndex].end}`;
  cards = periods[periodIndex].cards;
  renderCards();
  if (currentIndex !== null) updateSummary();
}

loadData();

// 카드 렌더
function renderCards() {
  cardList.innerHTML = "";
  cards.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card-title">${card.title}</div>
      <div class="card-summary">
        <span>수입 ${card.income}</span>
        <span>지출 ${card.expense}</span>
        <span>잔액 ${card.income - card.expense}</span>
      </div>
    `;
    el.onclick = () => openDetail(index);
    cardList.appendChild(el);
  });
}

// 상세 화면 열기
function openDetail(index) {
  currentIndex = index;
  const card = cards[index];

  detailTitle.innerText = card.title;
  detailIncome.innerText = `수입 ${card.income}`;
  detailExpense.innerText = `지출 ${card.expense}`;
  detailBalance.innerText = `잔액 ${card.income - card.expense}`;

  cardList.classList.add("hidden");
  detail.classList.remove("hidden");
  requestAnimationFrame(() => detail.classList.add("show"));
  updateSummary();
}

// 상세 내역 갱신
function updateSummary() {
  const card = cards[currentIndex];

  // 수입 합계
  card.income = card.incomes.reduce((sum, i) => sum + i.amount, 0);
  detailIncome.innerText = `수입 ${card.income}`;

  // 지출 합계
  card.expense = card.expenses.reduce((sum, i) => sum + i.amount, 0);
  detailExpense.innerText = `지출 ${card.expense}`;

  detailBalance.innerText = `잔액 ${card.income - card.expense}`;

  // 수입 리스트
  incomeList.innerHTML = "";
  card.incomes.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = `${item.text}: ${item.amount}`;

    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.style.marginLeft = "8px";
    delBtn.onclick = () => {
      card.incomes.splice(i, 1);
      updateSummary();
      saveData();
    };

    li.appendChild(delBtn);
    incomeList.appendChild(li);
  });

  // 지출 리스트
  expenseList.innerHTML = "";
  card.expenses.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = `${item.text}: ${item.amount}`;

    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.style.marginLeft = "8px";
    delBtn.onclick = () => {
      card.expenses.splice(i, 1);
      updateSummary();
      saveData();
    };

    li.appendChild(delBtn);
    expenseList.appendChild(li);
  });
}

// 수입 추가
addIncomeBtn.onclick = () => {
  const text = incomeText.value.trim();
  const amount = Number(incomeAmount.value);
  if (!text || !amount) return;

  cards[currentIndex].incomes.push({ text, amount });
  incomeText.value = "";
  incomeAmount.value = "";
  updateSummary();
  saveData();
};

// 지출 추가
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

// 뒤로가기
backBtn.onclick = () => {
  detail.classList.remove("show");
  setTimeout(() => {
    detail.classList.add("hidden");
    cardList.classList.remove("hidden");
    renderCards();
  }, 400);
};

// 카드 추가
addBtn.onclick = () => {
  const title = prompt("카드 제목 입력");
  if (!title) return;

  cards.push({
    title,
    income: 0,
    expense: 0,
    incomes: [],
    expenses: [],
  });

  renderCards();
  saveData();
};

renderCards();
