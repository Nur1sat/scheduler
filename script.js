const anchorDate = new Date(2026, 3, 21);
const currentDate = new Date();
const weekdayLabels = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"];

const mamaCycle = [
  {
    key: "home",
    badge: "Үйде",
    description: "",
  },
  {
    key: "home",
    badge: "Үйде",
    description: "",
  },
  {
    key: "work",
    badge: "Жұмыс",
    description: "",
  },
];

const papaCycle = [
  {
    key: "home",
    badge: "Үйде",
    description: "",
  },
  {
    key: "home",
    badge: "Үйде",
    description: "",
  },
  {
    key: "day",
    badge: "Күндіз",
    description: "",
  },
  {
    key: "night",
    badge: "Түн",
    description: "",
  },
];

const monthTitle = document.getElementById("monthTitle");
const todayDate = document.getElementById("todayDate");
const todayMama = document.getElementById("todayMama");
const todayPapa = document.getElementById("todayPapa");
const mamaCalendar = document.getElementById("mamaCalendar");
const papaCalendar = document.getElementById("papaCalendar");
const mamaWeekdays = document.getElementById("mamaWeekdays");
const papaWeekdays = document.getElementById("papaWeekdays");

let visibleMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayOffset(date) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((normalizeDate(date) - anchorDate) / dayMs);
}

function getCycleState(date, cycle) {
  const offset = getDayOffset(date);
  const index = ((offset % cycle.length) + cycle.length) % cycle.length;
  return cycle[index];
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatHeaderDate(date) {
  return new Intl.DateTimeFormat("kk-KZ", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getMondayFirstIndex(date) {
  return (date.getDay() + 6) % 7;
}

function renderWeekdays(container) {
  container.innerHTML = "";

  weekdayLabels.forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "weekday";
    cell.textContent = label;
    container.appendChild(cell);
  });
}

function createEmptyCell() {
  const cell = document.createElement("div");
  cell.className = "empty-cell";
  return cell;
}

function createDayCell(date, state) {
  const cell = document.createElement("article");
  cell.className = `day-cell status-${state.key}`;

  if (isSameDay(date, currentDate)) {
    cell.classList.add("is-today");
  }

  const top = document.createElement("div");
  top.className = "cell-top";

  const dayInfo = document.createElement("div");

  const dayNumber = document.createElement("div");
  dayNumber.className = "day-number";
  dayNumber.textContent = date.getDate();

  const dayName = document.createElement("div");
  dayName.className = "day-name";
  dayName.textContent = weekdayLabels[getMondayFirstIndex(date)];

  dayInfo.append(dayNumber, dayName);

  const badge = document.createElement("div");
  badge.className = "status-badge";
  badge.textContent = state.badge;

  top.append(dayInfo, badge);
  cell.append(top);

  if (state.description) {
    const copy = document.createElement("div");
    copy.className = "status-copy";
    copy.textContent = state.description;
    cell.append(copy);
  }

  return cell;
}

function renderCalendar(container, cycle, monthDate) {
  container.innerHTML = "";

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let i = 0; i < getMondayFirstIndex(firstDay); i += 1) {
    container.appendChild(createEmptyCell());
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const state = getCycleState(date, cycle);
    container.appendChild(createDayCell(date, state));
  }
}

function renderHeader() {
  monthTitle.textContent = new Intl.DateTimeFormat("kk-KZ", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  todayDate.textContent = formatHeaderDate(currentDate);
  todayMama.textContent = getCycleState(currentDate, mamaCycle).badge;
  todayPapa.textContent = getCycleState(currentDate, papaCycle).badge;
}

function render() {
  renderHeader();
  renderWeekdays(mamaWeekdays);
  renderWeekdays(papaWeekdays);
  renderCalendar(mamaCalendar, mamaCycle, visibleMonth);
  renderCalendar(papaCalendar, papaCycle, visibleMonth);
}

document.getElementById("prevMonth").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  render();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  render();
});

render();
