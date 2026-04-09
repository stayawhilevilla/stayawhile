const host = window.location.hostname;

if (host.startsWith("bookings.")) {
  window.location.href = "/sign-in.html";
}

// Index Render - Load first 8 properties from API
document.addEventListener("DOMContentLoaded", async function () {
  initListingNav();
  initGuestCounter();
  initBedroomCounter();
  initSearchButton();
  try {
    // Fetch properties in two ranges: 1-4 and 5-8
    const [firstRangeResponse, secondRangeResponse] = await Promise.all([
      fetch("/api/properties/range?start=1&end=4"),
      fetch("/api/properties/range?start=5&end=8"),
    ]);

    if (!firstRangeResponse.ok || !secondRangeResponse.ok) {
      throw new Error("Failed to load properties from API");
    }

    const firstRange = await firstRangeResponse.json();
    const secondRange = await secondRangeResponse.json();

    // Combine both ranges
    let properties = [
      ...(Array.isArray(firstRange) ? firstRange : [firstRange]),
      ...(Array.isArray(secondRange) ? secondRange : [secondRange]),
    ];

    console.log("Properties loaded from API:", properties);
    console.log("Total properties found:", properties.length);

    // Update property cards with dynamic data
    const propertyCards = document.querySelectorAll(
      'li[class*="w-full lg:w-1/4"]',
    );

    properties.forEach((property, index) => {
      if (propertyCards[index]) {
        const card = propertyCards[index];

        // Find the text elements in this card
        const titleElement = card.querySelector(
          ".pointer-events-none.mt-2.block",
        );
        const locationElement = card.querySelector(
          ".pointer-events-none.block:not(.mt-2)",
        );

        // Extract property info
        const title = property.nickname || property.title || "Property";
        const location =
          `${property.address?.city}, ${property.address?.state}` || "Location";

        // Update text content
        if (titleElement) {
          titleElement.textContent = title;
          console.log(`Updated card ${index + 1} title:`, title);
        }

        if (locationElement) {
          locationElement.textContent = location;
          console.log(`Updated card ${index + 1} location:`, location);
        }

        // Update link href if property has _id
        const linkElement = card.querySelector('a[href*="/destinations/"]');
        if (linkElement && property._id) {
          linkElement.href = `/destinations/villa.html?id=${property._id}`;
        }

        // Update image if property has pictures
        const imgElements = card.querySelectorAll("img");
        if (
          imgElements.length > 0 &&
          property.pictures &&
          property.pictures.length > 0
        ) {
          const imageUrl =
            property.pictures[0].original || property.pictures[0].thumbnail;
          if (imageUrl) {
            imgElements.forEach((img) => {
              img.src = imageUrl;
              img.alt = title;
              img.srcset = ""; // Clear srcset for simplicity
            });
            console.log(`Updated card ${index + 1} image:`, imageUrl);
          }
        }

        // Update image alt attributes
        imgElements.forEach((img) => {
          img.alt = title;
        });
      }
    });

    console.log("Successfully updated property cards with data from API");
  } catch (error) {
    console.error("Error loading properties:", error);
  }
});

function initListingNav() {
  const menu = document.getElementById("site-nav-menu");
  const toggle = document.getElementById("site-nav-toggle");
  if (!menu || !toggle) return;

  // Define SVG states
  const hamburgerSvg = `<svg width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none" class="h-full w-full"><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 0 3 L 20 3"></path><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 0 10 L 20 10" opacity="1"></path><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 7 17 L 20 17"></path></svg>`;

  const closeSvg = `<svg width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="none" class="h-full w-full"><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 3 17 L 17 3"></path><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 0 10 L 20 10" opacity="0"></path><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 3 3 L 17 17"></path></svg>`;

  toggle.addEventListener("click", () => {
    // Toggle scale-y classes for slide animation
    const isOpen = menu.classList.contains("scale-y-100");
    const menuItems = menu.querySelectorAll("li");

    if (isOpen) {
      // Close menu
      menu.classList.remove("scale-y-100");
      menu.classList.add("scale-y-0");
      menu.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      toggle.innerHTML = hamburgerSvg;

      // Hide navigation items
      menuItems.forEach((item, index) => {
        item.classList.remove("translate-y-0", "opacity-100");
        item.classList.add("translate-y-[-100%]", "opacity-0");
      });
    } else {
      // Open menu
      menu.classList.remove("scale-y-0");
      menu.classList.add("scale-y-100");
      menu.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      toggle.innerHTML = closeSvg;

      // Show navigation items with staggered animation
      menuItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.remove("translate-y-[-100%]", "opacity-0");
          item.classList.add("translate-y-0", "opacity-100");
        }, index * 50); // 50ms stagger for each item
      });
    }
  });
}

function initGuestCounter() {
  const numberWrappers = document.querySelectorAll('.number-wrapper');
  let guestWrapper = null;
  
  numberWrappers.forEach(wrapper => {
    const label = wrapper.querySelector('.number-label');
    if (label && label.textContent.trim().toLowerCase() === 'guests') {
      guestWrapper = wrapper;
    }
  });

  if (!guestWrapper) return;

  const buttons = guestWrapper.querySelectorAll('.number-buttons button');
  if (buttons.length < 2) return;
  
  let plusBtn, minusBtn;
  if (buttons[0].textContent.includes('+')) {
      plusBtn = buttons[0];
      minusBtn = buttons[1];
  } else {
      plusBtn = buttons[1];
      minusBtn = buttons[0];
  }
  
  const span = guestWrapper.querySelector('.number-buttons span');

  if (!plusBtn || !minusBtn || !span) return;

  let count = parseInt(span.textContent) || 2;
  const maxGuests = 20;

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (count < maxGuests) {
      count++;
    } else {
      count = 1;
    }
    span.textContent = count;
  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (count > 1) {
      count--;
    } else {
      count = maxGuests;
    }
    span.textContent = count;
  });
}

function initBedroomCounter() {
  const numberWrappers = document.querySelectorAll('.number-wrapper');
  let bedroomWrapper = null;
  
  numberWrappers.forEach(wrapper => {
    const label = wrapper.querySelector('.number-label');
    if (label && label.textContent.trim().toLowerCase() === 'bedrooms') {
      bedroomWrapper = wrapper;
    }
  });

  if (!bedroomWrapper) return;

  const buttons = bedroomWrapper.querySelectorAll('.number-buttons button');
  if (buttons.length < 2) return;
  
  let plusBtn, minusBtn;
  if (buttons[0].textContent.includes('+')) {
      plusBtn = buttons[0];
      minusBtn = buttons[1];
  } else {
      plusBtn = buttons[1];
      minusBtn = buttons[0];
  }
  
  const span = bedroomWrapper.querySelector('.number-buttons span');

  if (!plusBtn || !minusBtn || !span) return;

  let count = span.textContent.trim().toLowerCase() === 'all' ? 10 : (parseInt(span.textContent) || 10);

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (count < 10) {
      count++;
    } else {
      count = 1;
    }
    span.textContent = count === 10 ? 'All' : count;
  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (count > 1) {
      count--;
    } else {
      count = 10;
    }
    span.textContent = count === 10 ? 'All' : count;
  });
}

function initSearchButton() {
  const searchForm = document.querySelector('#sticky-form-container form');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload so loader stays visible

    // Collect data
    const selectedDestinations = [];
    const checkboxButtons = document.querySelectorAll('button[role="checkbox"]');
    checkboxButtons.forEach(button => {
        if (button.getAttribute('data-state') === 'checked') {
            // Clean up ID like "Beverly Hills-0" to "Beverly Hills"
            const locationName = button.id.replace(/-\d+$/, '');
            selectedDestinations.push(locationName);
        }
    });

    const dest = selectedDestinations.length > 0 ? selectedDestinations.join(',') : 'all';
    const arrival = document.getElementById(':r1:-form-item')?.value || '';
    const departure = document.getElementById(':r2:')?.value || '';

    let guests = '2';
    let bedrooms = 'All';
    const numberWrappers = document.querySelectorAll('.number-wrapper');
    numberWrappers.forEach(wrapper => {
      const label = wrapper.querySelector('.number-label');
      if (label && label.textContent.trim().toLowerCase() === 'guests') {
        guests = wrapper.querySelector('span')?.textContent || '2';
      }
      if (label && label.textContent.trim().toLowerCase() === 'bedrooms') {
        bedrooms = wrapper.querySelector('span')?.textContent || 'All';
      }
    });

    const submitBtn = searchForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      // Replace button contents with SVG block.
      // We explicitly removed style="display: none" so it actually shows up!
      submitBtn.innerHTML = `
        <svg
          width="auto"
          
          viewBox="0 0 120 30"
          class="fill-current"
          style="height: 0.8rem !important; z-index: 2; position: relative; margin: 0px auto;"
        >
          <circle cx="15" cy="15" r="15">
            <animate
              attributeName="r"
              from="15"
              to="15"
              begin="0s"
              dur="0.8s"
              values="15;9;15"
              calcMode="linear"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            ></animate>
          </circle>
          <circle cx="60" cy="15" r="9" fill-opacity="0.3">
            <animate
              attributeName="r"
              from="9"
              to="9"
              begin="0s"
              dur="0.8s"
              values="9;15;9"
              calcMode="linear"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            ></animate>
          </circle>
          <circle cx="105" cy="15" r="15">
            <animate
              attributeName="r"
              from="15"
              to="15"
              begin="0s"
              dur="0.8s"
              values="15;9;15"
              calcMode="linear"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </svg>
      `;
    }

    // Navigate to destinations.html after 2 seconds
    setTimeout(() => {
      const queryParams = new URLSearchParams({
        dest: dest,
        arrival: arrival,
        departure: departure,
        guests: guests,
        bedrooms: bedrooms
      });
      window.location.href = `/destinations.html?${queryParams.toString()}`;
    }, 2000);
  });
}
