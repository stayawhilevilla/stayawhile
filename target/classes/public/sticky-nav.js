// SCROLL BEHAVIOR - Change element style on scroll
document.addEventListener("DOMContentLoaded", function () {
  initListingNav();
  

  // Scroll behavior variables
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isVisible = false;

  // Function to update sticky form visibility
  function updateStickyForm() {
    const scrollY = window.scrollY;

    // When user scrolls down below 10px
    if (scrollY > 10 && !isVisible) {
      document.getElementById("sticky-form-nav").style.backgroundColor =
        "black";
      isVisible = true;
    }
    // When user scrolls back above 10px
    else if (scrollY <= 10 && isVisible) {
      // Add your logic here for scrolling above 10px
      // Example: stickyContainer.classList.remove('scrolled');
      document.getElementById("sticky-form-nav").style.backgroundColor =
        "transparent";
      isVisible = false;
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  // Request animation frame for smooth performance
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyForm);
      ticking = true;
    }
  }

  // Handle scroll events
  window.addEventListener("scroll", requestTick);

  // Initialize on load
  updateStickyForm();

  console.log(
    "🎯 Scroll behavior template ready - customize your logic in updateStickyForm()",
  );
});

// Mobile Dropdown Functionality for Destinations and Concierge
function initMobileDropdowns() {
    
  // Wait for DOM to be fully ready
  document.addEventListener("DOMContentLoaded", function () {
    // Get all mobile navigation buttons (the ones with lg:hidden)
    const mobileNavButtons = document.querySelectorAll("button.lg\\:hidden");

    mobileNavButtons.forEach((button) => {
      const buttonText = button.textContent.trim();

      // Only handle Destinations and Concierge buttons
      if (
        buttonText.includes("Destinations") ||
        buttonText.includes("Concierge")
      ) {
        button.addEventListener("click", function (e) {
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

initMobileDropdowns();

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
      console.log("Okay")
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

// Initialize mobile dropdowns
