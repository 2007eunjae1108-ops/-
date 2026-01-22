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
const detailIncome = document.getElementById("detailIncome");
const detailExpense = document.getElementById("detailExpense");
const detailBalance = document.getElementById("detailBalance");

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
const addIncomeBtn = document.getElementById("addIncome");
const addExpenseBtn = document.getElementById("addExpense");
const incomeText = document.getElementById("incomeText");
const incomeAmount = document.getElementById("incomeAmount");
const expenseText = document.getElementById("expenseText");
const expenseAmount = document.getElementById("expenseAmount");

const summaryTab = document.getElementById("summaryTab");
const incomeTab = document.getElementById("incomeTab");
const expenseTab = document.getElementById("expenseTab");
const tabBtns = document.querySelectorAll(".tab-btn");

let periods = [];
let periodIndex = 0;
let cards = [];
let currentIndex = null;
let deleteMode = false;

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
  if (currentIndex !== null) updateSummary();
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
        <span>수입 ${card.income}</span>
        <span>지출 ${card.expense}</span>
        <span>잔액 ${card.income - card.expense}</span>
      </div>
    `;
    if (deleteMode) el.classList.remove("selected");
    el.onclick = () => {
      if (deleteMode) {
        if (el.classList.contains("selected")) el.classList.remove("selected");
        else el.classList.add("selected");
      } else openDetail(index);
    };
    cardList.appendChild(el);
  });
}

// 카드 추가
addBtn.onclick = () => {
  const title = prompt("카드 제목 입력");
  if (!title) return;
  const card = { title, income: 0, expense: 0, incomes: [], expenses: [] };
  cards.push(card);
  periods[periodIndex].cards = cards;
  renderCards();
  saveData();
};

// 삭제 버튼
deleteBtn.onclick = () => {
  deleteMode = !deleteMode;
  renderCards();
  if (!deleteMode) {
    const selected = document.querySelectorAll(".card.selected");
    selected.forEach((el) => {
      if (confirm("삭제하시겠습니까?")) {
        const idx = Array.from(cardList.children).indexOf(el);
        cards.splice(idx, 1);
        periods[periodIndex].cards = cards;
        renderCards();
        saveData();
      } else el.classList.remove("selected");
    });
  }
};

// 상세 화면 열기
function openDetail(index) {
  currentIndex = index;
  const card = cards[index];
  detailTitle.innerText = card.title;
  detail.classList.remove("hidden");
  requestAnimationFrame(() => detail.classList.add("show"));
  showTab("summary");
  updateSummary();
}

// 뒤로가기
backBtn.onclick = () => {
  detail.classList.remove("show");
  setTimeout(() => detail.classList.add("hidden"), 400);
};

// 탭
tabBtns.forEach((btn) => (btn.onclick = () => showTab(btn.dataset.tab)));
function showTab(tab) {
  tabBtns.forEach((b) => b.classList.remove("active"));
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add("active");
  summaryTab.classList.add("hidden");
  incomeTab.classList.add("hidden");
  expenseTab.classList.add("hidden");
  if (tab === "summary") summaryTab.classList.remove("hidden");
  if (tab === "income") incomeTab.classList.remove("hidden");
  if (tab === "expense") expenseTab.classList.remove("hidden");
}

// 총합계 업데이트
function updateSummary() {
  const card = cards[currentIndex];
  card.income = card.incomes.reduce((s, i) => s + i.amount, 0);
  card.expense = card.expenses.reduce((s, i) => s + i.amount, 0);
  detailIncome.innerText = card.income.toLocaleString();
  detailExpense.innerText = card.expense.toLocaleString();
  detailBalance.innerText = (card.income - card.expense).toLocaleString();

  incomeList.innerHTML = "";
  card.incomes.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = `${item.text}: ${item.amount.toLocaleString()}`;
    const btn = document.createElement("button");
    btn.innerText = "－";
    btn.style.background = "#000";
    btn.style.color = "#fff";
    btn.style.borderRadius = "8px";
    btn.onclick = () => {
      card.incomes.splice(i, 1);
      updateSummary();
      saveData();
    };
    li.appendChild(btn);
    incomeList.appendChild(li);
  });

  expenseList.innerHTML = "";
  card.expenses.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerText = `${item.text}: ${item.amount.toLocaleString()}`;
    const btn = document.createElement("button");
    btn.innerText = "－";
    btn.style.background = "#000";
    btn.style.color = "#fff";
    btn.style.borderRadius = "8px";
    btn.onclick = () => {
      card.expenses.splice(i, 1);
      updateSummary();
      saveData();
    };
    li.appendChild(btn);
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

// 날짜 편집
periodText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    saveEditedPeriod();
  }
});
periodText.addEventListener("blur", saveEditedPeriod);
function saveEditedPeriod() {
  const value = periodText.innerText.trim();
  if (/^\d{2}\.\d{2}\s*~\s*\d{2}\.\d{2}$/.test(value)) {
    const [start, end] = value.split("~").map((s) => s.trim());
    periods[periodIndex].start = start;
    periods[periodIndex].end = end;
    periodText.innerText = `${start} ~ ${end}`;
    saveData();
  } else {
    alert("날짜 형식: 01.01 ~ 01.31");
    periodText.innerText = `${periods[periodIndex].start} ~ ${periods[periodIndex].end}`;
  }
}

// 화살표
prevPeriod.onclick = () => {
  if (periodIndex > 0) {
    periodIndex--;
    loadPeriod();
  }
};
nextPeriod.onclick = () => {
  if (periodIndex < periods.length - 1) {
    periodIndex++;
    loadPeriod();
  }
};

// 새 기간 추가
addPeriodBtn.onclick = () => {
  const start = prompt("새 기간 시작(예:01.01)");
  const end = prompt("새 기간 종료(예:01.31)");
  if (!start || !end) return;
  periods.push({ start, end, cards: [] });
  periodIndex = periods.length - 1;
  loadPeriod();
};

// 초기 로드
loadPeriod();
