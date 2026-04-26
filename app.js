const roleBadge = document.getElementById('roleBadge');
const roleSelect = document.getElementById('roleSelect');
const form = document.getElementById('tripForm');
const summary = document.getElementById('summary');
const daysContainer = document.getElementById('days');
const budgetBreakdown = document.getElementById('budgetBreakdown');
const generateBtn = document.getElementById('generateBtn');

const ACTIVITIES = [
  'Coffee + neighborhood walk',
  'Top landmark visit',
  'Local lunch spot',
  'Museum or cultural stop',
  'Scenic sunset point',
  'Dinner reservation',
];

const COST_DISTRIBUTION = {
  lodging: 0.4,
  food: 0.25,
  transport: 0.15,
  activities: 0.15,
  misc: 0.05,
};

function getRoleFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  return role === 'edit' ? 'edit' : 'view';
}

function setRole(role) {
  const canEdit = role === 'edit';
  roleBadge.textContent = canEdit ? 'Edit Mode' : 'View Mode';
  roleSelect.value = role;

  [...form.elements].forEach((field) => {
    if (field.tagName === 'BUTTON') return;
    field.disabled = !canEdit;
  });

  generateBtn.disabled = !canEdit;
  document.querySelectorAll('.addActivityBtn').forEach((btn) => {
    btn.disabled = !canEdit;
  });
}

function getDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = [];

  for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
    days.push(new Date(day));
  }

  return days;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function createItineraryDates(startDate, endDate) {
  const dates = getDateRange(startDate, endDate);
  if (!dates.length || dates.length > 21) {
    throw new Error('Trip length must be between 1 and 21 days.');
  }
  return dates;
}

function pickActivities(index) {
  return [
    ACTIVITIES[index % ACTIVITIES.length],
    ACTIVITIES[(index + 2) % ACTIVITIES.length],
    ACTIVITIES[(index + 4) % ACTIVITIES.length],
  ];
}

function renderDays(dates) {
  daysContainer.innerHTML = '';
  const template = document.getElementById('dayTemplate');

  dates.forEach((date, index) => {
    const card = template.content.cloneNode(true);
    card.querySelector('h3').textContent = `Day ${index + 1} · ${formatDate(date)}`;

    const list = card.querySelector('.activities');
    pickActivities(index).forEach((activity) => {
      const li = document.createElement('li');
      li.textContent = activity;
      list.appendChild(li);
    });

    card.querySelector('.addActivityBtn').addEventListener('click', (event) => {
      event.preventDefault();
      const custom = prompt('Add a custom activity');
      if (!custom) return;
      const li = document.createElement('li');
      li.textContent = custom;
      list.appendChild(li);
    });

    daysContainer.appendChild(card);
  });
}

function renderBudget(totalBudget, dayCount, travelers) {
  budgetBreakdown.innerHTML = '';

  Object.entries(COST_DISTRIBUTION).forEach(([label, ratio]) => {
    const cost = Math.round(totalBudget * ratio);
    const line = document.createElement('p');
    line.textContent = `${label[0].toUpperCase()}${label.slice(1)}: $${cost.toLocaleString()}`;
    budgetBreakdown.appendChild(line);
  });

  const perDay = Math.round(totalBudget / dayCount);
  const perTraveler = Math.round(totalBudget / travelers);
  const detail = document.createElement('p');
  detail.className = 'small muted';
  detail.textContent = `~$${perDay.toLocaleString()}/day · ~$${perTraveler.toLocaleString()} per traveler`;
  budgetBreakdown.appendChild(detail);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  try {
    const destination = document.getElementById('destination').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const travelers = Number(document.getElementById('travelers').value);
    const budget = Number(document.getElementById('budget').value);

    if (!destination || !startDate || !endDate || travelers < 1 || budget < 0) {
      throw new Error('Please complete all fields with valid values.');
    }

    const dates = createItineraryDates(startDate, endDate);
    renderDays(dates);
    renderBudget(budget, dates.length, travelers);

    summary.classList.remove('muted');
    summary.textContent = `${destination} · ${dates.length} day itinerary for ${travelers} traveler${travelers > 1 ? 's' : ''}.`;

    setRole(roleSelect.value);
  } catch (error) {
    summary.classList.add('muted');
    summary.textContent = error.message;
    daysContainer.innerHTML = '';
    budgetBreakdown.textContent = 'No itinerary yet.';
  }
});

roleSelect.addEventListener('change', (event) => {
  const role = event.target.value;
  const url = new URL(window.location.href);
  url.searchParams.set('role', role);
  window.history.replaceState({}, '', url);
  setRole(role);
});

(function init() {
  const today = new Date();
  const weekOut = new Date();
  weekOut.setDate(today.getDate() + 4);

  document.getElementById('startDate').valueAsDate = today;
  document.getElementById('endDate').valueAsDate = weekOut;

  const initialRole = getRoleFromQuery();
  setRole(initialRole);

  if (initialRole === 'edit') {
    form.requestSubmit();
  }
})();
