const defaultEvents = [
  { name: "octocat/Hello-World", starred: "2024-01-15" },
  { name: "github/docs", starred: "2024-02-02" },
  { name: "octo-org/octo-repo", starred: "2024-03-21" }
];

function sortEvents(events) {
  return [...events].sort((left, right) => {
    const leftTime = new Date(left.starred).getTime();
    const rightTime = new Date(right.starred).getTime();

    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
      return 0;
    }

    if (Number.isNaN(leftTime)) {
      return 1;
    }

    if (Number.isNaN(rightTime)) {
      return -1;
    }

    return rightTime - leftTime;
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function renderEvents(events, listElement) {
  if (typeof document === "undefined" || !listElement) {
    return;
  }

  listElement.innerHTML = "";

  sortEvents(events).forEach((event) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const starDate = formatDate(event.starred);

    link.href = `https://github.com/${event.name}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = event.name;

    item.append(link, document.createTextNode(` — starred ${starDate}`));
    listElement.appendChild(item);
  });
}

async function loadEvents() {
  if (typeof document === "undefined") {
    return defaultEvents;
  }

  const listElement = document.querySelector("#starred");

  if (!listElement) {
    return defaultEvents;
  }

  let events = defaultEvents;

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      events = data;
    }
  } catch (error) {
    console.warn("Using built-in fallback data because the JSON file could not be loaded.", error);
  }

  renderEvents(events, listElement);
}

if (typeof document !== "undefined") {
  loadEvents();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    defaultEvents,
    sortEvents,
    formatDate,
    renderEvents,
    loadEvents
  };
}
