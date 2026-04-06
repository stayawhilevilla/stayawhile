const host = window.location.hostname;

if (host.startsWith("bookings.")) {
  window.location.href = "/sign-in.html";
}

// Index Render - Load first 8 properties from API
document.addEventListener("DOMContentLoaded", async function () {
  initListingNav();
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
