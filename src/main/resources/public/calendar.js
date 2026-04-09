/**
 * Calendar functionality for villa booking
 * Extracted from villa.html for better code organization
 */

// Calendar state variables
let arrivalDate = null;
let departureDate = null;
let currentDisplayMonth = new Date().getMonth();
let currentDisplayYear = new Date().getFullYear();
let sharedPicker = null;

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initCalendar();
});

function initCalendar() {
  let arrivalInput = document.getElementById(":r5:-form-item");
  let departureInput = document.getElementById(":r6:");
  let dateContainer = document.querySelector(".flex.bg-tan.border");

  window.isIndexPage = false;

  if (!arrivalInput || !departureInput || !dateContainer) {
    arrivalInput = document.getElementById(":r1:-form-item");
    departureInput = document.getElementById(":r2:");
    if (arrivalInput) {
        const flexWrapper = arrivalInput.closest('.flex');
        if (flexWrapper) dateContainer = flexWrapper.parentElement;
    }
    window.isIndexPage = true;
  }

  if (!arrivalInput || !departureInput || !dateContainer) {
    console.warn('Calendar inputs not found');
    return;
  }

  // Create shared date picker
  sharedPicker = createSharedDatePicker(dateContainer);
  
  // Add event listeners
  addCalendarEventListeners(arrivalInput, departureInput);
}

// Create shared date picker container
function createSharedDatePicker(dateContainer) {
  const container = document.createElement("div");
  container.className = "custom-datepicker";
  if (window.isIndexPage) {
    container.style.top = "-50px";
  }

  // Add month navigation header
  const navHeader = document.createElement("div");
  navHeader.className = "calendar-nav-header";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.innerHTML = "‹";
  prevButton.className = "calendar-nav-btn";
  prevButton.addEventListener("click", () => navigateMonth(-1));

  const monthYearDisplay = document.createElement("div");
  monthYearDisplay.className = "calendar-month-year";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.innerHTML = "›";
  nextButton.className = "calendar-nav-btn";
  nextButton.addEventListener("click", () => navigateMonth(1));

  navHeader.appendChild(prevButton);
  navHeader.appendChild(monthYearDisplay);
  navHeader.appendChild(nextButton);

  const calendar = document.createElement("div");
  calendar.className = "calendar-grid";

  container.appendChild(navHeader);
  container.appendChild(calendar);
  dateContainer.appendChild(container);

  return { container, calendar, monthYearDisplay };
}

// Month navigation function
function navigateMonth(direction) {
  currentDisplayMonth += direction;

  if (currentDisplayMonth < 0) {
    currentDisplayMonth = 11;
    currentDisplayYear--;
  } else if (currentDisplayMonth > 11) {
    currentDisplayMonth = 0;
    currentDisplayYear++;
  }

  // Refresh calendar with new month
  const selectedDate =
    sharedPicker.activeInput === "arrival" ? arrivalDate : departureDate;
  const minDate =
    sharedPicker.activeInput === "departure" && arrivalDate
      ? new Date(arrivalDate.setDate(arrivalDate.getDate() + 2))
      : null;

  generateCalendar(
    sharedPicker.calendar,
    currentDisplayYear,
    currentDisplayMonth,
    selectedDate,
    minDate,
  );

  // Update month/year display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  sharedPicker.monthYearDisplay.textContent = `${monthNames[currentDisplayMonth]} ${currentDisplayYear}`;
}

// Generate calendar grid
function generateCalendar(
  calendar,
  year,
  month,
  selectedDate,
  minDate = null,
) {
  calendar.innerHTML = "";

  // Add day headers
  const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  dayHeaders.forEach((day) => {
    const header = document.createElement("div");
    header.textContent = day;
    header.style.fontWeight = "bold";
    header.style.textAlign = "center";
    header.style.padding = "4px";
    header.style.fontSize = "12px";
    header.style.color = "#6b7280";
    calendar.appendChild(header);
  });

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.textContent = day;

    const currentDate = new Date(year, month, day);

    // Disable dates before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (currentDate < today) {
      dayButton.disabled = true;
    }

    // Disable dates before arrival date for departure picker
    if (minDate && currentDate < minDate) {
      dayButton.disabled = true;
    }

    // Highlight selected date
    if (
      selectedDate &&
      currentDate.getDate() === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    ) {
      dayButton.style.background = "#fbbf24";
      dayButton.style.color = "white";
    }

    dayButton.addEventListener("click", () => {
      onDateSelect(currentDate, sharedPicker.activeInput || "arrival");
    });

    dayButton.style.cssText = `
      padding: 4px 6px;
      background: white;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border: none;
      border-radius: 4px;
      font-size: 12px;
    `;

    calendar.appendChild(dayButton);
  }
}

// Handle date selection
function onDateSelect(date, type) {
  let arrivalInput = document.getElementById(":r5:-form-item");
  let departureInput = document.getElementById(":r6:");

  if (window.isIndexPage || !arrivalInput) {
    arrivalInput = document.getElementById(":r1:-form-item");
    departureInput = document.getElementById(":r2:");
  }

  if (window.isIndexPage) {
    console.log("Date selected:", date.toISOString());
    if (type === "arrival") {
      arrivalDate = date;
      arrivalInput.value = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else {
      departureDate = date;
      departureInput.value = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    sharedPicker.container.style.display = "none";
    return;
  }

  if (type === "arrival") {
    arrivalDate = date;
    arrivalInput.value = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    sharedPicker.container.style.display = "none";

    // Reset departure date if it's before arrival date
    if (departureDate && departureDate <= arrivalDate) {
      departureDate = null;
      departureInput.value = "";
    }
  } else {
    departureDate = date;
    departureInput.value = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    sharedPicker.container.style.display = "none";
  }

  // Update clear button visibility
  updateClearButtonVisibility();

  // If arrival date is set, automatically show departure picker with 2-day minimum
  if (arrivalDate && type === "arrival") {
    setTimeout(() => {
      const minDepartureDate = new Date(arrivalDate);
      minDepartureDate.setDate(arrivalDate.getDate() + 2); // Add 2 days
      showDatePicker("departure", minDepartureDate);
    }, 100); // Small delay to ensure calendar is closed first
  }
}

// Show date picker for specific input
function showDatePicker(inputType, minDate = null) {
  // Reset display to current month when opening picker
  const today = new Date();
  currentDisplayMonth = today.getMonth();
  currentDisplayYear = today.getFullYear();

  const selectedDate =
    inputType === "arrival" ? arrivalDate : departureDate;

  generateCalendar(
    sharedPicker.calendar,
    currentDisplayYear,
    currentDisplayMonth,
    selectedDate,
    minDate,
  );

  // Update month/year display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  sharedPicker.monthYearDisplay.textContent = `${monthNames[currentDisplayMonth]} ${currentDisplayYear}`;

  sharedPicker.container.style.display = "block";

  // Store which input is active
  sharedPicker.activeInput = inputType;
}

// Add event listeners to calendar inputs
function addCalendarEventListeners(arrivalInput, departureInput) {
  // Arrival input events
  if (arrivalInput) {
    arrivalInput.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showDatePicker("arrival");
    });
    arrivalInput.addEventListener("focus", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showDatePicker("arrival");
    });
    arrivalInput.addEventListener("keydown", (e) => {
      e.preventDefault();
    });
  }

  // Departure input events
  if (departureInput) {
    departureInput.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Always use 2-day minimum for departure
      const minDepartureDate = arrivalDate ? new Date(arrivalDate) : null;
      if (minDepartureDate) {
        minDepartureDate.setDate(arrivalDate.getDate() + 2);
      }
      showDatePicker("departure", minDepartureDate);
    });
    departureInput.addEventListener("focus", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Always use 2-day minimum for departure
      const minDepartureDate = arrivalDate ? new Date(arrivalDate) : null;
      if (minDepartureDate) {
        minDepartureDate.setDate(arrivalDate.getDate() + 2);
      }
      showDatePicker("departure", minDepartureDate);
    });
    departureInput.addEventListener("keydown", (e) => {
      e.preventDefault();
    });
  }

  // Close date pickers when clicking outside
  document.addEventListener("click", (e) => {
    if (sharedPicker && 
        !sharedPicker.container.contains(e.target) &&
        e.target !== arrivalInput &&
        e.target !== departureInput
    ) {
      sharedPicker.container.style.display = "none";
    }
  });
}

// Update clear button visibility
function updateClearButtonVisibility() {
  const clearBtn = document.getElementById("clear-dates-btn");
  if (clearBtn) {
    if (arrivalDate || departureDate) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
  }
}

// Clear dates function
function clearDates(event) {
  event.preventDefault();
  event.stopPropagation();

  let arrivalInput = document.getElementById(":r5:-form-item");
  let departureInput = document.getElementById(":r6:");

  if (window.isIndexPage || !arrivalInput) {
    arrivalInput = document.getElementById(":r1:-form-item");
    departureInput = document.getElementById(":r2:");
  }

  // Clear date variables
  arrivalDate = null;
  departureDate = null;

  // Clear input values
  if (arrivalInput) {
    arrivalInput.value = "";
  }
  if (departureInput) {
    departureInput.value = "";
  }

  // Close shared date picker
  if (sharedPicker) {
    sharedPicker.container.style.display = "none";
  }

  // Hide clear button
  updateClearButtonVisibility();
}

// Make clearDates globally accessible
window.clearDates = clearDates;
