// stays_render.js - Logic for displaying booking data on stays.html

// Fetch current user data
async function loadCurrentUser() {
  try {
    // Get user ID from local storage, fallback to '1' if not found
    const userId = localStorage.getItem('userId');
    console.log("[Stays] Loading user data for ID:", userId);
    
    const res = await fetch(`/api/users/${userId}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const user = data.data || data.user || data;
    console.log("[Stays] User data loaded:", user);
    return user;
  } catch (err) {
    console.warn("[Stays] Could not load user:", err.message);
    return null;
  }
}

// Fetch booking data for user
async function loadUserBookings() {
  try {
    // Get user ID from local storage, fallback to '1' if not found
    const userId = localStorage.getItem('userId');
    console.log("[Stays] Loading bookings for user ID:", userId);
    
    const res = await fetch(`/api/bookings/user/${userId}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const bookings = data.data || data;
    console.log("[Stays] Bookings data loaded:", bookings);
    
    // Store data globally for other functions
    window.allBookingsData = Array.isArray(bookings) ? bookings : [bookings];
    return window.allBookingsData;
  } catch (err) {
    console.warn("[Stays] Could not load bookings:", err.message);
    window.allBookingsData = [];
    return [];
  }
}

// Update tab counts based on booking status
function updateTabCounts() {
  if (!window.allBookingsData || !window.allBookingsData.length) return;
  
  let pendingCount = 0;
  let staysCount = 0;
  
  window.allBookingsData.forEach(booking => {
    if (booking.bookingStatus === 'pending' || booking.bookingStatus === 'PENDING') {
      pendingCount++;
    } else if (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'active' || 
               booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'ACTIVE') {
      staysCount++;
    }
  });
  
  // Update tab button text with counts
  const pendingTab = document.getElementById('tab-pending');
  const staysTab = document.getElementById('tab-stays');
  
  if (pendingTab) {
    pendingTab.textContent = `Pending (${pendingCount})`;
  }
  
  if (staysTab) {
    staysTab.textContent = `Stays (0)`;
  }
  
}

// Populate property details with fetched data
function populatePropertyDetails() {
  if (window.allBookingsData && window.allBookingsData.length > 0) {
    const firstBooking = window.allBookingsData[0];
    const booking = firstBooking;
    const property = firstBooking.property;

    if (property) {
      // Update property name in the grid card
      const propertyNameDisplay = document.getElementById(
        "property-name-display",
      );
      if (propertyNameDisplay) {
        propertyNameDisplay.textContent =
          property.nickname || property.title || "Property";
      }

      // Update property link
      const propertyLink = document.getElementById("property-link");
      if (propertyLink && property._id) {
        propertyLink.href = `/destinations/villa.html?id=${property._id}`;
      }

      // Update property image
      const propertyImage = document.getElementById("property-image");
      if (propertyImage && property.picture) {
        // Use thumbnail if original is null, otherwise use original
        const imageUrl =
          property.picture.original || property.picture.thumbnail;
        if (imageUrl) {
          propertyImage.src = imageUrl;
          propertyImage.alt = property.nickname || property.title || "Property";

          // Generate srcset for responsive images using thumbnail
          if (property.pictures && property.pictures.length > 0) {
            const firstImage = property.pictures[0];
            const baseUrl = firstImage.original || firstImage.thumbnail;
            const srcset = `
              ${baseUrl}?w=16&q=75 16w,
              ${baseUrl}?w=32&q=75 32w,
              ${baseUrl}?w=48&q=75 48w,
              ${baseUrl}?w=64&q=75 64w,
              ${baseUrl}?w=96&q=75 96w,
              ${baseUrl}?w=128&q=75 128w,
              ${baseUrl}?w=256&q=75 256w,
              ${baseUrl}?w=384&q=75 384w,
              ${baseUrl}?w=640&q=75 640w,
              ${baseUrl}?w=750&q=75 750w,
              ${baseUrl}?w=828&q=75 828w,
              ${baseUrl}?w=1080&q=75 1080w,
              ${baseUrl}?w=1200&q=75 1200w,
              ${baseUrl}?w=1920&q=75 1920w,
              ${baseUrl}?w=2048&q=75 2048w,
              ${baseUrl}?w=3840&q=75 3840w
            `;
            propertyImage.srcset = srcset;
          }
        }
      }

      const nearbyHeading = document.getElementById(
        "nearby-properties-heading",
      );
      const cityName = property.address.city;
      nearbyHeading.innerHTML = `Explore more places in <span class="text-gold">${cityName}</span>`;

      // Update bedrooms
      const propertyBedrooms = document.getElementById("property-bedrooms");
      if (propertyBedrooms) {
        propertyBedrooms.textContent = property.bedrooms || 4;
      }

      // Update bathrooms
      const propertyBathrooms = document.getElementById("property-bathrooms");
      if (propertyBathrooms) {
        propertyBathrooms.textContent = property.bathrooms || 4.5;
      }

      // Update reviews
      const propertyReviews = document.getElementById("property-reviews");
      if (propertyReviews && property.reviews) {
        propertyReviews.textContent = property.reviews.total || 43;
      }

      // Update property name in the modal
      const propertyName = document.querySelector(".property-name");
      if (propertyName) {
        propertyName.textContent =
          property.title ||
          "Luxurious 7-bedroom villa with AC, WiFi, fitness room in stunning Malibu";
      }

      // Update sleeps info
      const propertySleeps = document.querySelector(".property-sleeps");
      if (propertySleeps) {
        propertySleeps.textContent = `Sleeps ${property.accommodates || 18}`;
      }

      // Update price to show total amount
      const propertyPrice = document.getElementById("property-price");
      if (propertyPrice && booking.totalAmount) {
        propertyPrice.textContent = `$${booking.totalAmount.toLocaleString()}`;
      }

      // Populate booking information
      if (booking) {
        // Format dates for input fields
        const arrivalDate = booking.arrivalDate
          ? new Date(booking.arrivalDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "";

        const departureDate = booking.departureDate
          ? new Date(booking.departureDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "";

        // Calculate number of nights
        const nights =
          booking.arrivalDate && booking.departureDate
            ? Math.ceil(
                (new Date(booking.departureDate) -
                  new Date(booking.arrivalDate)) /
                  (1000 * 60 * 60 * 24),
              )
            : 0;

        // Calculate nightly rate
        const nightlyRate =
          nights > 0 && booking.accommodationFare
            ? (booking.accommodationFare / nights).toFixed(2)
            : "0.00";

        // Update date input fields
        const bookingArrival = document.getElementById("booking-arrival");
        if (bookingArrival) {
          bookingArrival.value = arrivalDate;
        }

        const bookingDeparture = document.getElementById("booking-departure");
        if (bookingDeparture) {
          bookingDeparture.value = departureDate;
        }

        const bookingGuests = document.getElementById("booking-guests");
        if (bookingGuests) {
          bookingGuests.textContent = booking.numberOfGuests || "Loading...";
        }

        const bookingTotal = document.getElementById("booking-total");
        if (bookingTotal && booking.totalAmount) {
          bookingTotal.textContent = `$${booking.totalAmount.toLocaleString()}`;
        }
        initNearbyProperties(property);

        // Update additional fees section
        const feesSection = document.getElementById("additional-fees-section");
        if (feesSection && booking) {
          // Update nights and nightly rate
          const nightsElement = feesSection.querySelector(".grid-cols-2 div");
          if (nightsElement) {
            nightsElement.textContent = `${nights} Nights x`;
          }
          const rateElement = nightsElement.nextElementSibling;
          if (rateElement) {
            rateElement.textContent = `$${nightlyRate} / Night`;
          }

          // Update accommodation fare
          const accommodationElement = feesSection
            .querySelectorAll(".grid-cols-2")[1]
            .querySelector("div:last-child");
          if (accommodationElement && booking.accommodationFare) {
            accommodationElement.textContent = `$${booking.accommodationFare.toFixed(
              2,
            )}`;
          }

          // Update cleaning fee
          const cleaningElement = feesSection
            .querySelectorAll(".grid-cols-2")[2]
            .querySelector("div:last-child");
          if (cleaningElement && booking.cleaningFee) {
            cleaningElement.textContent = `$${booking.cleaningFee.toFixed(2)}`;
          }

          // Update credit card processing fee
          const creditCardElement = feesSection
            .querySelectorAll(".grid-cols-2")[3]
            .querySelector("div:last-child");
          if (creditCardElement && booking.creditCardProcessingFee) {
            creditCardElement.textContent = `$${booking.creditCardProcessingFee.toFixed(
              2,
            )}`;
          }

          // Update damage waiver
          const damageWaiverElement = feesSection
            .querySelectorAll(".grid-cols-2")[4]
            .querySelector("div:last-child");
          if (damageWaiverElement && booking.damageWaiver) {
            damageWaiverElement.textContent = `$${booking.damageWaiver.toFixed(
              2,
            )}`;
          }

          // Update transient occupancy tax
          const taxElement = feesSection
            .querySelectorAll(".grid-cols-2")[5]
            .querySelector("div:last-child");
          if (taxElement && booking.transientOccupancyTax) {
            taxElement.textContent = `$${booking.transientOccupancyTax.toFixed(
              2,
            )}`;
          }

          // Update total
          const totalElement = feesSection.querySelector(
            ".text-3xl .text-right",
          );
          if (totalElement && booking.totalAmount) {
            totalElement.textContent = `$${booking.totalAmount.toFixed(2)}`;
          }

          // Update reserve button
          const reserveButton = feesSection.querySelector(".button span");
          if (reserveButton) {
            reserveButton.textContent = `Reserve for $${nightlyRate}/Night`;
          }
        }
      }
    }
    
    // Populate user initials after data is loaded
    populateUserInitials();
  }
}

// Additional Fees Toggle
function initAdditionalFeesToggle() {
  document
    .getElementById("additional-fees-toggle")
    .addEventListener("click", function () {
      const detailsSection = document.getElementById("additional-fees-section");
      const arrow = document.getElementById("fees-arrow");

      if (detailsSection.style.display === "block") {
        detailsSection.style.display = "none";
        detailsSection.style.opacity = "0";
        detailsSection.style.height = "0";
        detailsSection.style.overflow = "hidden";
        arrow.style.transform = "rotate(0deg)";
      } else {
        detailsSection.style.display = "block";
        detailsSection.style.opacity = "1";
        detailsSection.style.height = "auto";
        detailsSection.style.overflow = "visible";
        arrow.style.transform = "rotate(180deg)";
      }
    });
}

function initNearbyProperties(currentProperty) {
  const container = document.getElementById('nearby-properties-container');
  if (!container || !currentProperty.address?.city) return;

  const currentCity = currentProperty.address.city;
  const currentId = currentProperty._id;

  // Fetch all properties from API to find nearby ones
  fetch('/api/properties')
    .then(response => response.json())
    .then(allProperties => {
      let properties = Array.isArray(allProperties) ? allProperties : [allProperties];

      // Filter properties in the same city (excluding current property)
      const nearbyProperties = properties.filter(prop => 
        prop.address?.city === currentCity && 
        prop._id !== currentId &&
        prop.pictures && prop.pictures.length > 0
      );

      // Get 4 random properties
      const randomProperties = getRandomItems(nearbyProperties, 4);
      
      // Render the nearby properties
      renderNearbyProperties(randomProperties, container);
    })
    .catch(error => {
      console.error('Error loading nearby properties:', error);
    });
}

function renderNearbyProperties(properties, container) {
  const ul = container.querySelector('ul');
  if (!ul || properties.length === 0) {
    container.style.display = 'none';
    return;
  }

  ul.innerHTML = properties.map(property => {
    const title = property.title || property.nickname || 'Property';
    const location = `${property.address?.city || ''}, ${property.address?.state || ''}`.trim();
    const imageUrl = property.pictures?.[0]?.original || property.pictures?.[0]?.url || '';
    const propertyUrl = `/destinations/villa.html?id=${property._id}`;

    return `
      <li class="w-full lg:w-1/4 mb-5 lg:mb-0 h-[400px] sm:h-[35vw] group relative lg:static">
        <div class="w-full img-clipped overflow-hidden lg:brightness-[0.6] lg:absolute h-full left-0 top-0 lg:group-hover:brightness-[1]">
          <img
            alt="${title}"
            loading="lazy"
            decoding="async"
            class="object-cover object-center"
            style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
            src="${imageUrl}"
          />
        </div>
        <div class="hidden lg:block img-outer relative lg:absolute w-full overflow-hidden h-full left-0 top-0 -z-[2] lg:group-hover:z-[2] transition-transform duration-7500 ease-out group-hover:scale-105">
          <img
            alt="${title}"
            loading="lazy"
            decoding="async"
            class="object-cover object-center"
            style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
            src="${imageUrl}"
          />
        </div>
        <div class="text-wrap bg-gradient-to-t from-black lg:from-transparent to-transparent lg:bg-black/50 absolute h-1/2 bottom-0 left-0 z-[5] w-full origin-center lg:w-[25%] lg:h-full text-white lg:group-hover:bg-transparent">
          <a class="absolute inset-0 z-10" href="${propertyUrl}">
            <span class="sr-only">Go to listing</span>
          </a>
          <div class="p-[20px] absolute bottom-0 w-full lg:group-hover:opacity-50 lg:group-hover:backdrop-blur-[2px] lg:group-hover:bg-dark">
            <p class="pointer-events-none mt-2 block truncate text-sm uppercase tracking-[0.2em] mb-1 text-white">
              ${title}
            </p>
            <p class="pointer-events-none block text-sm text-white">
              ${location}
            </p>
          </div>
        </div>
      </li>
    `;
  }).join('');
}


function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Populate user initials from fetched user data
async function populateUserInitials() {
  console.log('populateUserInitials called');
  
  try {
    // Fetch current user data
    const user = await loadCurrentUser();
    const userInitialsElement = document.getElementById('user-initials');
    
    console.log('User data:', user);
    console.log('User initials element found:', !!userInitialsElement);
    
    if (userInitialsElement && user) {
      // Get user initials from first and last name
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      
      console.log('First name:', firstName);
      console.log('Last name:', lastName);
      
      let initials = '';
      if (firstName && lastName) {
        initials = firstName.charAt(0).toUpperCase() + " " + lastName.charAt(0).toUpperCase();
      } else if (firstName) {
        initials = firstName.charAt(0).toUpperCase();
      } else if (lastName) {
        initials = lastName.charAt(0).toUpperCase();
      }
      
      console.log('User initials calculated:', initials);
      console.log('Setting initials to element:', initials);
      userInitialsElement.textContent = initials;
    } else {
      console.log('No user data available or element not found');
      // Fallback to booking data if available
      if (window.allBookingsData && window.allBookingsData.length > 0) {
        const booking = window.allBookingsData[0];
        if (booking.user) {
          const firstName = booking.user.firstName || '';
          const lastName = booking.user.lastName || '';
          let initials = '';
          if (firstName && lastName) {
            initials = firstName.charAt(0).toUpperCase() + " " + lastName.charAt(0).toUpperCase();
          } else if (firstName) {
            initials = firstName.charAt(0).toUpperCase();
          } else if (lastName) {
            initials = lastName.charAt(0).toUpperCase();
          }
          if (userInitialsElement) {
            userInitialsElement.textContent = initials;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error populating user initials:', error);
  }
}

// Initialize stays page functionality
async function initStaysPage() {
  console.log("[Stays] Initializing stays page...");
  
  try {
    // Load data first
    await loadUserBookings();
    console.log("[Stays] Bookings loaded, populating UI...");
    
    // Now populate UI with loaded data
    populatePropertyDetails();
    updateTabCounts();
    await populateUserInitials();
    
    console.log("[Stays] UI populated successfully");
  } catch (error) {
    console.error("[Stays] Error initializing stays page:", error);
  }
  
  // Initialize additional fees toggle
  initAdditionalFeesToggle();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initStaysPage);
