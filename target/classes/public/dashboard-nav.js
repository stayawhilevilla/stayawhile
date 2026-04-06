function initListingNav() {
  const menu = document.getElementById("site-nav-menu");
  const toggle = document.getElementById("site-nav-toggle");
  if (!menu || !toggle) return;

  // Define SVG states
  const hamburgerSvg = `<svg class="uitk-icon uitk-icon-loyalty-lowtier uitk-icon-large uitk-icon-default-theme" aria-label="Samuel" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Samuel</title><path fill-rule="evenodd" d="M11.94 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" clip-rule="evenodd" fill="white"></path><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4 12a8 8 0 1 1 13.779 5.532A7.977 7.977 0 0 0 11.939 15a7.976 7.976 0 0 0-5.779 2.468A7.972 7.972 0 0 1 4 12zm3.704 6.75A7.963 7.963 0 0 0 12 20c1.55 0 2.996-.44 4.221-1.203A5.983 5.983 0 0 0 11.94 17c-1.653 0-3.15.669-4.236 1.75z" clip-rule="evenodd" fill="white"></path></svg>`;

  const closeSvg = `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="none" class="h-full w-full"><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 6 18 L 18 6"></path><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 0 12 L 24 12" opacity="0"></path><path fill="transparent" stroke-width="2" stroke="white" stroke-linecap="round" d="M 6 6 L 18 18"></path></svg>`;

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

// Mobile Dropdown Functionality for Destinations and Concierge
function initMobileDropdowns() {
  // Wait for DOM to be fully ready
  document.addEventListener("DOMContentLoaded", function () {
    // Get all mobile navigation buttons (the ones with lg:hidden)
    const mobileNavButtons = document.querySelectorAll("button.lg\\:hidden");

    mobileNavButtons.forEach((button) => {
      const buttonText = button.textContent.trim();

      // Only handle Destinations, Concierge, and My Stays buttons
      if (
        buttonText.includes("Destinations") ||
        buttonText.includes("Concierge") ||
        buttonText.includes("My Stays")
      ) {
        button.addEventListener("click", function (e) {
          // Special handling for My Stays - navigate directly
          if (buttonText.includes("My Stays")) {
            window.location.href = "/stays.html";
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          // Find the parent span and its dropdown ul
          const parentSpan = this.closest("span");
          if (parentSpan) {
            const dropdown = parentSpan.querySelector("ul");
            if (dropdown) {
              // Check current state
              const isCurrentlyHidden = dropdown.classList.contains("hidden");

              // Close all other dropdowns first
              const allDropdowns = document.querySelectorAll(
                ".relative > span > ul",
              );
              const allArrows = document.querySelectorAll(
                "button.lg\\:hidden svg",
              );

              allDropdowns.forEach((d) => {
                if (d !== dropdown) {
                  d.classList.add("hidden");
                  d.style.display = "";
                  d.style.transform = "";
                  d.style.position = "";
                  d.style.background = "";
                  d.style.padding = "";
                  d.style.width = "";
                  d.style.marginTop = "";

                  // Reset list items
                  const listItems = d.querySelectorAll("li");
                  listItems.forEach((li) => {
                    li.classList.add("hidden");
                    li.style.display = "";
                  });
                }
              });

              allArrows.forEach((arrow) => {
                arrow.style.transform = "rotate(0deg)";
              });

              if (isCurrentlyHidden) {
                // Show this dropdown
                dropdown.classList.remove("hidden");
                dropdown.style.display = "block";
                dropdown.style.position = "static";
                dropdown.style.background = "transparent";
                dropdown.style.padding = "1rem";
                dropdown.style.width = "100%";
                dropdown.style.marginTop = "0.5rem";
                dropdown.style.transform = "scaleY(1)";
                dropdown.style.transformOrigin = "top";
                dropdown.style.transition =
                  "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";

                // Make all list items visible
                const listItems = dropdown.querySelectorAll("li");
                listItems.forEach((li) => {
                  li.classList.remove("hidden");
                  li.style.display = "block";
                });

                // Rotate arrow
                const arrow = this.querySelector("svg");
                if (arrow) {
                  arrow.style.transform = "rotate(180deg)";
                  arrow.style.transition = "transform 0.3s ease";
                }
              } else {
                // Hide this dropdown
                dropdown.classList.add("hidden");
                dropdown.style.display = "";
                dropdown.style.transform = "";
                dropdown.style.position = "";
                dropdown.style.background = "";
                dropdown.style.padding = "";
                dropdown.style.width = "";
                dropdown.style.marginTop = "";

                // Hide list items
                const listItems = dropdown.querySelectorAll("li");
                listItems.forEach((li) => {
                  li.classList.add("hidden");
                  li.style.display = "";
                });

                // Reset arrow
                const arrow = this.querySelector("svg");
                if (arrow) {
                  arrow.style.transform = "rotate(0deg)";
                }
              }
            }
          }
        });
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".relative")) {
        const dropdowns = document.querySelectorAll(".relative > span > ul");
        const arrows = document.querySelectorAll("button.lg\\:hidden svg");

        dropdowns.forEach((dropdown) => {
          dropdown.classList.add("hidden");
          dropdown.style.display = "";
          dropdown.style.transform = "";
          dropdown.style.position = "";
          dropdown.style.background = "";
          dropdown.style.padding = "";
          dropdown.style.width = "";
          dropdown.style.marginTop = "";

          // Reset list items
          const listItems = dropdown.querySelectorAll("li");
          listItems.forEach((li) => {
            li.classList.add("hidden");
            li.style.display = "";
          });
        });

        arrows.forEach((arrow) => {
          arrow.style.transform = "rotate(0deg)";
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initListingNav();
  initMobileDropdowns();
});
