const referenceDate = new Date(2026, 3, 21);
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const mamaCycle = [
  {
    key: "sleep",
    badge: "Sleep Morning",
    short: "Rest",
    description: "Resting today, sleeping in the morning after night shift.",
  },
  {
    key: "rest",
    badge: "Rest Day",
    short: "Rest",
    description: "Full day at home to relax.",
  },
  {
    key: "work",
    badge: "Night Work",
    short: "Work",
    description: "Night shift at work.",
  },
];

const papaCycle = [
  {
    key: "sleep",
    badge: "Sleep Morning",
    short: "Rest",
    description: "Resting today, sleeping in the morning after night shift.",
  },
  {
    key: "rest",
    badge: "Rest Day",
    short: "Rest",
    description: "Full day demalys at home.",
  },
  {
    key: "day",
    badge: "Day Shift",
    short: "Den",
    description: "Day shift at work.",
  },
  {
    key: "night",
    badge: "Night Shift",
    short: "Noch",
    description: "Night shift at work.",
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

let visibleMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayOffset(date) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((normalizeDate(date) - referenceDate) / dayMs);
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
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
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

  if (isSameDay(date, referenceDate)) {
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
  dayName.textContent = weekdayLabels[date.getDay()];

  dayInfo.append(dayNumber, dayName);

  const badge = document.createElement("div");
  badge.className = "status-badge";
  badge.textContent = state.badge;

  const copy = document.createElement("div");
  copy.className = "status-copy";
  copy.textContent = state.description;

  top.append(dayInfo, badge);
  cell.append(top, copy);

  return cell;
}

function renderCalendar(container, cycle, monthDate) {
  container.innerHTML = "";

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    container.appendChild(createEmptyCell());
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const state = getCycleState(date, cycle);
    container.appendChild(createDayCell(date, state));
  }
}

function renderHeader() {
  monthTitle.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  todayDate.textContent = formatHeaderDate(referenceDate);
  todayMama.textContent = getCycleState(referenceDate, mamaCycle).description;
  todayPapa.textContent = getCycleState(referenceDate, papaCycle).description;
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
