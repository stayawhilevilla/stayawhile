// Dashboard rendering functionality

let currentUser = null;

// Fetch booking data for user
async function loadUserBookings() {
  try {
    // Get user ID from local storage, fallback to '1' if not found
    const userId = localStorage.getItem('userId');
    console.log("[Dashboard] Using user ID:", userId);
    
    const res = await fetch(`/api/bookings/user/${userId}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("[Dashboard] Bookings data:", data);
    return data.data || data;
  } catch (err) {
    console.warn("[Dashboard] Could not load bookings:", err.message);
    return [];
  }
}

// Update user info display


function updateUserInfo(user) {
  console.log("Updating user info with:", user);
  
  if (!user) {
    console.error("No user data provided to updateUserInfo");
    return;
  }
  
  // Try multiple selectors for better reliability
  const userInfoDiv = document.querySelector('[style*="padding: 16px"]') ||
                      document.getElementById('user-nav-info') ||
                      document.querySelector('.user-info');
  
  if (!userInfoDiv) {
    console.error("User info navigation element not found");
    return;
  }
  
  // Safely extract user data with validation
  const userName = user?.firstName || user?.name;
  const userEmail = user?.email;
  
  console.log(`Setting user info: Name="${userName}", Email="${userEmail}"`);
  
  userInfoDiv.innerHTML = `
    <div>Hi, ${userName}</div>
    <div>${userEmail}</div>
  `;
}

function populatePropertyCards(bookings) {
  console.log("[Dashboard] Populating property cards with bookings:", bookings);
  
  // Validate bookings data
  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
    console.warn("[Dashboard] No bookings data available to populate property cards");
    return;
  }

  const firstBooking = bookings[0];
  if (!firstBooking || !firstBooking.property) {
    console.warn("[Dashboard] First booking or property data is missing");
    return;
  }

  const property = firstBooking.property;
  
  // Update nearby heading with validation
  const nearbyHeading = document.getElementById("nearby-properties-heading");
  if (nearbyHeading) {
    try {
      const cityName = property.address?.city || "Unknown Location";
      nearbyHeading.innerHTML = `Explore more places in <span class="text-gold">${cityName}</span>`;
      console.log(`[Dashboard] Updated nearby heading for city: ${cityName}`);
    } catch (error) {
      console.error("[Dashboard] Error updating nearby heading:", error);
    }
  } else {
    console.warn("[Dashboard] Nearby heading element not found");
  }

  // Update stays section with validation
  const staysElement = document.getElementById("stays");
  if (staysElement) {
    try {
      const propertyCard = createPropertyCard(firstBooking);
      if (propertyCard) {
        staysElement.innerHTML = propertyCard.outerHTML;
        console.log("[Dashboard] Successfully populated stays section");
      }
    } catch (error) {
      console.error("[Dashboard] Error creating property card:", error);
    }
  } else {
    console.warn("[Dashboard] Stays element not found");
  }

  // Initialize nearby properties with validation
  if (property) {
    try {
      initNearbyProperties(property);
    } catch (error) {
      console.error("[Dashboard] Error initializing nearby properties:", error);
    }
  }

  // Populate booking details for the first booking
  try {
    populateBookingDetails(firstBooking);
  } catch (error) {
    console.error("[Dashboard] Error populating booking details:", error);
  }
}

// Populate booking details section
function populateBookingDetails(booking) {
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
}

// Update a property card with booking data
function updatePropertyCard(booking, cardIndex) {
  const card = document.querySelectorAll(".grid.mb-5 li")[cardIndex];
  if (!card) return;

  const property = booking.property || {};
  const title = property.title || property.name || "Property";
  const image =
    property.picture || property.image || property.images?.[0] || "";
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const reviews = property.reviews?.total || property.reviews || 0;
  const link = `/destinations/villa.html?id=${property.id || booking.id}`;

  // Update elements
  const nameDisplay = card.querySelector("#property-name-display");
  const propertyLink = card.querySelector("#property-link");
  const propertyImage = card.querySelector("#property-image");
  const bedroomsSpan = card.querySelector("#property-bedrooms");
  const bathroomsSpan = card.querySelector("#property-bathrooms");
  const reviewsSpan = card.querySelector("#property-reviews");

  if (nameDisplay) nameDisplay.textContent = title;
  if (propertyLink) propertyLink.href = link;
  if (propertyImage && image) {
    // Use thumbnail if original is null, otherwise use original
    const imageUrl = image.original || image.thumbnail;
    if (imageUrl) {
      propertyImage.src = imageUrl;
      propertyImage.alt = title;

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
          ${baseUrl}?w=3840&q=75 3840w
        `;
        propertyImage.srcset = srcset;
      }
    }
  }
  if (bedroomsSpan) bedroomsSpan.textContent = bedrooms;
  if (bathroomsSpan) bathroomsSpan.textContent = bathrooms;
  if (reviewsSpan) reviewsSpan.textContent = reviews;
}

// Create a new property card element
function createPropertyCard(booking) {
  console.log("spc", booking)
  const property = booking.property || {};
  const title = property.title || property.name || "Property";
  const image =
    property.pictures?.[0] || property.picture || property.image || "";

  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const reviews = property.reviews?.total || property.reviews || 0;
  const link = `/stays.html?id=${property._id || booking.id}`;
  

  const cardTemplate = `
    <li class="group">
      <div class="pb-[125%] relative group overflow-hidden">
        <a
          title="View property details"
          target="_blank"
          class="absolute inset-0 z-10"
          href="${link}"
          ><span class="sr-only">Go to property details</span></a
        >
        <div class="absolute inset-0">
          <div
            class="text-wrap bg-gradient-to-t from-black lg:from-transparent to-transparent lg:bg-black/50 absolute h-1/2 bottom-0 left-0 z-[5] w-full lg:h-full text-white lg:group-hover:bg-transparent transition-all duration-500"
          >
            <div
              class="p-[20px] absolute bottom-0 w-full lg:group-hover:backdrop-blur-[2px] lg:group-hover:bg-dark/50 transition-all duration-500"
            >
              <p
                class="pointer-events-none mt-2 block truncate text-sm uppercase tracking-[0.2em] mb-1 text-white"
              >
                ${title}
              </p>
              <div class="text-sm mb-0 font-light">
                <div
                  class="flex text-xs items-center justify-between space-x-4"
                >
                  <div class="inline-flex">
                    <svg
                      width="52px"
                      height="38px"
                      viewBox="0 0 52 38"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="stroke-current h-4 w-4 mr-2"
                    >
                      <g
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <g
                          transform="translate(-468.000000, -710.000000)"
                        >
                          <g
                            transform="translate(247.000000, 680.000000)"
                          >
                            <g
                              transform="translate(22.000000, 24.000000)"
                            >
                              <g
                                transform="translate(199.000000, 6.000000)"
                              >
                                <path
                                  d="M3.7132,14.6936 L2.5002,21.2346"
                                ></path>
                                <path d="M43,14.5 L48,14.5"></path>
                                <path d="M9,14.5 L4,14.5"></path>
                                <path></path>
                                <polygon
                                  points="51.5 23.5 0.5 23.5 0.5 21.5 51.5 21.5"
                                ></polygon>
                                <polyline
                                  points="1.5 24 1.5 33.09 1.5 37.5 4.5 37.5 4.5 33.5 48.5 33.5 48.5 37.5 50.5 37.5 50.5 33.09 50.5 24"
                                ></polyline>
                                <path d="M48.5,14 L48.5,3"></path>
                                <path d="M3.5,3 L3.5,14"></path>
                                <path d="M5.5,3 L5.5,14"></path>
                                <path d="M46.5,3 L46.5,14"></path>
                                <polygon
                                  points="49.5 2.5 2.5 2.5 2.5 0.5 49.5 0.5"
                                ></polygon>
                                <path
                                  d="M42.5161,15.3308 C42.5811,15.9268 42.1131,16.4978 41.4691,16.5838 C36.9191,17.0948 32.2871,17.0948 27.7381,16.5838 C27.0941,16.4998 26.6261,15.9268 26.6911,15.3308 C26.9541,12.8298 27.2161,10.3278 27.4791,7.8298 C27.5441,7.2318 28.0491,6.5828 28.6091,6.4048 C32.5861,5.1308 36.6211,5.1308 40.5981,6.4048 C41.1591,6.5848 41.6641,7.2328 41.7291,7.8298 C41.9911,10.3308 42.2541,12.8308 42.5161,15.3308 L42.5161,15.3308 Z"
                                ></path>
                                <path
                                  d="M25.3088,15.3308 C25.3738,15.9268 24.9058,16.4978 24.2618,16.5838 C19.7118,17.0948 15.0808,17.0948 10.5308,16.5838 C9.8878,16.4998 9.4188,15.9268 9.4838,15.3308 C9.7468,12.8298 10.0088,10.3278 10.2718,7.8298 C10.3368,7.2318 10.8418,6.5828 11.4018,6.4048 C15.3788,5.1308 19.4138,5.1308 23.3908,6.4048 C23.9508,6.5818 24.4568,7.2328 24.5218,7.8298 C24.7838,10.3308 25.0458,12.8308 25.3088,15.3308 L25.3088,15.3308 Z"
                                ></path>
                                <path
                                  d="M48.2868,14.6936 L49.4998,21.2346"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    ${bedrooms} Bedrooms
                  </div>
                  <div class="inline-flex">
                    <svg
                      width="22px"
                      height="40px"
                      viewBox="0 0 22 40"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="stroke-current h-4 w-4 mr-2"
                    >
                      <g
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          transform="translate(-573.000000, -708.000000)"
                        >
                          <g
                            transform="translate(247.000000, 680.000000)"
                          >
                            <g
                              transform="translate(22.000000, 24.000000)"
                            >
                              <g
                                transform="translate(304.000000, 4.000000)"
                              >
                                <path
                                  d="M16.7661,30.3019 L18.3031,37.8239 C18.3031,38.7489 17.6561,39.4999 16.8541,39.4999 L5.0611,39.4999 C4.2601,39.4999 3.6111,38.7489 3.6111,37.8239 L5.1711,30.1889"
                                ></path>
                                <path
                                  d="M1.3539,18.6615 L1.3539,6.3185 C1.3539,5.2935 2.2019,4.4635 3.2479,4.4635 L4.2209,4.4635"
                                ></path>
                                <path
                                  d="M17.6722,4.4633 L18.6672,4.4633 C19.7132,4.4633 20.5622,5.2933 20.5622,6.3183 L20.5622,18.6613"
                                ></path>
                                <path
                                  d="M21.5,20.1483 C21.5,20.6093 21.073,25.7123 17.872,28.8483 C16.256,30.4313 14.692,34.7753 10.941,34.7753 C7.189,34.7753 5.658,30.3883 4.028,28.7923 C0.851,25.6833 0.5,20.6063 0.5,20.1483 C0.5,19.3083 1.021,18.6283 1.666,18.6283 L20.333,18.6283 C20.978,18.6283 21.5,19.3083 21.5,20.1483 L21.5,20.1483 Z"
                                ></path>
                                <path
                                  d="M3.7171,18.6279 C2.8181,16.9439 2.2961,13.3539 2.2961,11.1889 C2.2961,5.2839 6.1751,0.4999 10.9581,0.4999 C15.7401,0.4999 19.6181,5.2839 19.6181,11.1889 C19.6181,13.3479 19.0991,16.9319 18.2071,18.6119"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    ${bathrooms} Bathrooms
                  </div>
                </div>
              </div>
              <div class="mt-2 text-xs">
                <span class="tracking-widest mr-3">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 16 16"
                    class="inline-block text-gold"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                    ></path>
                  </svg>
                  ${reviews} Reviews
                </span>
              </div>
            </div>
          </div>
          <div
            class="absolute inset-0 duration-7500 ease-out group-hover:scale-110"
          >
            <img
              alt="${title}"
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              class="object-cover object-center"
              sizes="(max-width: 768px) 360px, (max-width: 1020px) 310px, 270px"
              srcset="${image.original || image.thumbnail || image}"
              src="${image.original || image.thumbnail || image}"
              style="
                position: absolute;
                height: 100%;
                width: 100%;
                inset: 0px;
                color: transparent;
              "
            />
          </div>
        </div>
      </div>
    </li>
  `;

  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = cardTemplate;
  return tempDiv.firstElementChild;
}

// Fetch current user data
async function loadCurrentUser() {
  try {
    // Get user ID from local storage, fallback to '1' if not found
    const userId = localStorage.getItem('userId');
    console.log("[Dashboard] Loading user data for ID:", userId);
    
    const res = await fetch(`/api/users/${userId}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const user = data.data || data.user || data;
    currentUser = user;
    updateUserInfo(user);
    return user;
  } catch (err) {
    console.warn("[Dashboard] Could not load user:", err.message);
    return null;
  }
}

// Populate recently viewed properties with fetched data
function populateRecentlyViewed(properties) {
  const propertyGrid = document.getElementById("recently-viewed");

  console.log(properties.length);
  for (let i = 0; i < properties.length; i++) {
    const newCard = createRecentlyViewedCard(properties[i]);
    propertyGrid.appendChild(newCard);
  }
}

// Update a recently viewed property card
function updateRecentlyViewedCard(property, card) {
  const prop = property.property || property;
  const title = prop.title || prop.name || "Property";
  const image = prop.pictures?.[0] || prop.picture || prop.image || "";
  const bedrooms = prop.bedrooms || 0;
  const bathrooms = prop.bathrooms || 0;
  const reviews = prop.reviews?.total || prop.reviews || 0;
  const link = `/destinations/villa.html?id=${prop._id}`;

  // Update elements
  const nameDisplay = card.querySelector("#property-name-display");
  const propertyLink = card.querySelector("#property-link");
  const propertyImage = card.querySelector('img[data-nimg="fill"]');
  const bedroomsSpan = card.querySelector("#property-bedrooms");
  const bathroomsSpan = card.querySelector("#property-bathrooms");
  const reviewsSpan = card.querySelector("#property-reviews");

  if (nameDisplay) nameDisplay.textContent = title;
  if (propertyLink) propertyLink.href = link;
  if (propertyImage && image) {
    const imageUrl = image.original || image;
    propertyImage.src = imageUrl;
    propertyImage.alt = title;
  }
  if (bedroomsSpan) bedroomsSpan.textContent = bedrooms;
  if (bathroomsSpan) bathroomsSpan.textContent = bathrooms;
  if (reviewsSpan) reviewsSpan.textContent = reviews;
}

// Create a new recently viewed property card
function createRecentlyViewedCard(property) {
  const prop = property.property || property;
  const title = prop.title || prop.name || "Property";
  const image = prop.pictures?.[0] || prop.picture || prop.image || "";
  const bedrooms = prop.bedrooms || 0;
  const bathrooms = prop.bathrooms || 0;
  const reviews = prop.reviews?.total || prop.reviews || 0;
  const link = `/destinations/villa.html?id=${prop._id}`;

  const cardTemplate = `
    <li class="group">
      <div class="pb-[125%] relative group overflow-hidden">
        <a
          title="View property details"
          target="_blank"
          class="absolute inset-0 z-10"
          href="${link}"
          ><span class="sr-only">Go to property details</span></a
        >
        <div class="absolute inset-0">
          <div
            class="text-wrap bg-gradient-to-t from-black lg:from-transparent to-transparent lg:bg-black/50 absolute h-1/2 bottom-0 left-0 z-[5] w-full lg:h-full text-white lg:group-hover:bg-transparent transition-all duration-500"
          >
            <div
              class="p-[20px] absolute bottom-0 w-full lg:group-hover:backdrop-blur-[2px] lg:group-hover:bg-dark/50 transition-all duration-500"
            >
              <p
                class="pointer-events-none mt-2 block truncate text-sm uppercase tracking-[0.2em] mb-1 text-white"
              >
                ${title}
              </p>
              <div class="text-sm mb-0 font-light">
                <div
                  class="flex text-xs items-center justify-between space-x-4"
                >
                  <div class="inline-flex">
                    <svg
                      width="52px"
                      height="38px"
                      viewBox="0 0 52 38"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="stroke-current h-4 w-4 mr-2"
                    >
                      <g
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <g
                          transform="translate(-468.000000, -710.000000)"
                        >
                          <g
                            transform="translate(247.000000, 680.000000)"
                          >
                            <g
                              transform="translate(22.000000, 24.000000)"
                            >
                              <g
                                transform="translate(199.000000, 6.000000)"
                              >
                                <path
                                  d="M3.7132,14.6936 L2.5002,21.2346"
                                ></path>
                                <path d="M43,14.5 L48,14.5"></path>
                                <path d="M9,14.5 L4,14.5"></path>
                                <path></path>
                                <polygon
                                  points="51.5 23.5 0.5 23.5 0.5 21.5 51.5 21.5"
                                ></polygon>
                                <polyline
                                  points="1.5 24 1.5 33.09 1.5 37.5 4.5 37.5 4.5 33.5 48.5 33.5 48.5 37.5 50.5 37.5 50.5 33.09 50.5 24"
                                ></polyline>
                                <path d="M48.5,14 L48.5,3"></path>
                                <path d="M3.5,3 L3.5,14"></path>
                                <path d="M5.5,3 L5.5,14"></path>
                                <path d="M46.5,3 L46.5,14"></path>
                                <polygon
                                  points="49.5 2.5 2.5 2.5 2.5 0.5 49.5 0.5"
                                ></polygon>
                                <path
                                  d="M42.5161,15.3308 C42.5811,15.9268 42.1131,16.4978 41.4691,16.5838 C36.9191,17.0948 32.2871,17.0948 27.7381,16.5838 C27.0941,16.4998 26.6261,15.9268 26.6911,15.3308 C26.9541,12.8298 27.2161,10.3278 27.4791,7.8298 C27.5441,7.2318 28.0491,6.5828 28.6091,6.4048 C32.5861,5.1308 36.6211,5.1308 40.5981,6.4048 C41.1591,6.5848 41.6641,7.2328 41.7291,7.8298 C41.9911,10.3308 42.2541,12.8308 42.5161,15.3308 L42.5161,15.3308 Z"
                                ></path>
                                <path
                                  d="M25.3088,15.3308 C25.3738,15.9268 24.9058,16.4978 24.2618,16.5838 C19.7118,17.0948 15.0808,17.0948 10.5308,16.5838 C9.8878,16.4998 9.4188,15.9268 9.4838,15.3308 C9.7468,12.8298 10.0088,10.3278 10.2718,7.8298 C10.3368,7.2318 10.8418,6.5828 11.4018,6.4048 C15.3788,5.1308 19.4138,5.1308 23.3908,6.4048 C23.9508,6.5818 24.4568,7.2328 24.5218,7.8298 C24.7838,10.3308 25.0458,12.8308 25.3088,15.3308 L25.3088,15.3308 Z"
                                ></path>
                                <path
                                  d="M48.2868,14.6936 L49.4998,21.2346"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    ${bedrooms} Bedrooms
                  </div>
                  <div class="inline-flex">
                    <svg
                      width="22px"
                      height="40px"
                      viewBox="0 0 22 40"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      class="stroke-current h-4 w-4 mr-2"
                    >
                      <g
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          transform="translate(-573.000000, -708.000000)"
                        >
                          <g
                            transform="translate(247.000000, 680.000000)"
                          >
                            <g
                              transform="translate(22.000000, 24.000000)"
                            >
                              <g
                                transform="translate(304.000000, 4.000000)"
                              >
                                <path
                                  d="M16.7661,30.3019 L18.3031,37.8239 C18.3031,38.7489 17.6561,39.4999 16.8541,39.4999 L5.0611,39.4999 C4.2601,39.4999 3.6111,38.7489 3.6111,37.8239 L5.1711,30.1889"
                                ></path>
                                <path
                                  d="M1.3539,18.6615 L1.3539,6.3185 C1.3539,5.2935 2.2019,4.4635 3.2479,4.4635 L4.2209,4.4635"
                                ></path>
                                <path
                                  d="M17.6722,4.4633 L18.6672,4.4633 C19.7132,4.4633 20.5622,5.2933 20.5622,6.3183 L20.5622,18.6613"
                                ></path>
                                <path
                                  d="M21.5,20.1483 C21.5,20.6093 21.073,25.7123 17.872,28.8483 C16.256,30.4313 14.692,34.7753 10.941,34.7753 C7.189,34.7753 5.658,30.3883 4.028,28.7923 C0.851,25.6833 0.5,20.6063 0.5,20.1483 C0.5,19.3083 1.021,18.6283 1.666,18.6283 L20.333,18.6283 C20.978,18.6283 21.5,19.3083 21.5,20.1483 L21.5,20.1483 Z"
                                ></path>
                                <path
                                  d="M3.7171,18.6279 C2.8181,16.9439 2.2961,13.3539 2.2961,11.1889 C2.2961,5.2839 6.1751,0.4999 10.9581,0.4999 C15.7401,0.4999 19.6181,5.2839 19.6181,11.1889 C19.6181,13.3479 19.0991,16.9319 18.2071,18.6119"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    ${bathrooms} Bathrooms
                  </div>
                </div>
              </div>
              <div class="mt-2 text-xs">
                <span class="tracking-widest mr-3">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 16 16"
                    class="inline-block text-gold"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                    ></path>
                  </svg>
                  ${reviews} Reviews
                </span>
              </div>
            </div>
          </div>
          <div
            class="absolute inset-0 duration-7500 ease-out group-hover:scale-110"
          >
            <img
              alt="${title}"
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              class="object-cover object-center"
              sizes="(max-width: 768px) 360px, (max-width: 1020px) 310px, 270px"
              src="${image.original || image}"
              style="
                position: absolute;
                height: 100%;
                width: 100%;
                inset: 0px;
                color: transparent;
              "
            />
          </div>
        </div>
      </div>
    </li>
  `;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cardTemplate;
  return tempDiv.firstElementChild;
}

// Fetch properties from API and print to console
async function fetchProperties() {
  console.log("🔍 fetchProperties() called - starting API request...");
  try {
    console.log(
      "🌐 Making request to: /api/properties/price/high-to-low",
    );
    const res = await fetch(
      "/api/properties/price/high-to-low",
      {
        headers: { Accept: "application/json" },
      },
    );
    console.log("📡 Response status:", res.status, res.statusText);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const properties = data.data || data;
    const firstFour = Array.isArray(properties)
      ? properties.slice(0, 4)
      : properties;
    console.log("🏠 PROPERTIES FROM API (first 4):", firstFour);

    // Show the name of the first property
    if (firstFour.length > 0) {
      const firstProp = firstFour[0].property || firstFour[0];
      console.log(
        "📝 FIRST PROPERTY NAME:",
        firstProp.title || firstProp.name || "No title found",
      );
    }

    // Populate the recently viewed properties section
    populateRecentlyViewed(firstFour);

    return firstFour;
  } catch (err) {
    console.error("❌ ERROR in fetchProperties:", err.message);
    console.warn("[Dashboard] Could not load properties:", err.message);
    return [];
  }
}

function initNearbyProperties(property) {
  console.log("[Dashboard] Initializing nearby properties for:", property);
  
  if (!property || !property.address?.city) {
    console.warn("[Dashboard] Property or city information missing for nearby properties");
    return;
  }

  const currentCity = property.address.city;
  const currentId = property._id;
  console.log(`[Dashboard] Looking for properties in city: ${currentCity}, excluding ID: ${currentId}`);

  // Fetch all properties from API to find nearby ones
  fetch("/api/properties")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((allProperties) => {
      console.log("[Dashboard] Raw properties data:", allProperties);
      
      let properties = Array.isArray(allProperties)
        ? allProperties
        : [allProperties];

      console.log(`[Dashboard] Processing ${properties.length} properties`);

      // Filter properties in the same city (excluding current property)
      const nearbyProperties = properties.filter(
        (prop) =>
          prop.address?.city === currentCity &&
          prop._id !== currentId &&
          prop.pictures &&
          prop.pictures.length > 0,
      );

      // Render the nearby properties
      renderNearbyProperties(nearbyProperties);
    })
    .catch((error) => {
      console.error("Error loading nearby properties:", error);
    });
}

function renderNearbyProperties(properties) {
  let nearbyPropertiesPopulate = document.getElementById(
    "nearby-properties-populate",
  );

  console.log("🎯 PROPERTIES PASSED TO RENDER:", properties);
  console.log("📊 PROPERTIES LENGTH:", properties?.length);
  console.log("🏠 DOM ELEMENT:", nearbyPropertiesPopulate);

  let html = "";
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    console.log("🏠 PROPERTY [" + i + "]:", property);
    const title = property.title || property.nickname || "Property";
    console.log("📝 TITLE:", title);

    const location =
      `${property.address?.city || ""}, ${property.address?.state || ""}`.trim();
    console.log("📍 LOCATION:", location);
    const imageUrl =
      property.pictures?.[0]?.original || property.pictures?.[0]?.url || "";
    console.log("🖼️ IMAGE URL:", imageUrl);
    const propertyUrl = `/destinations/villa.html?id=${property._id}`;
    console.log("🔗 PROPERTY URL:", propertyUrl);

    html += `
      <li class="w-full lg:w-1/4 mb-5 lg:mb-0 h-[400px] sm:h-[35vw] group relative lg:static second">
        <div class="w-full img-clipped overflow-hidden lg:brightness-[0.6] lg:absolute h-full left-0 top-0 lg:group-hover:brightness-[1]">
          <img
            alt="${title}"
            loading="lazy"
            decoding="async"
            data-nimg="fill"
            class="object-cover object-center"
            sizes="(max-width: 1023px) 100vw, 96vw"
            srcset="
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl}w
            "
            src="${imageUrl}"
            style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
          />
        </div>
        <div class="hidden lg:block img-outer relative lg:absolute w-full overflow-hidden h-full left-0 top-0 -z-[2] lg:group-hover:z-[2] transition-transform duration-7500 ease-out group-hover:scale-105">
          <img
            alt="${title}"
            loading="lazy"
            decoding="async"
            data-nimg="fill"
            class="object-cover object-center"
            sizes="(max-width: 1023px) 100vw, 96vw"
            srcset="
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl},
              ${imageUrl}w
            "
            src="${imageUrl}"
            style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
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
  }
  console.log("html", html)
  console.log(nearbyPropertiesPopulate);
  nearbyPropertiesPopulate.innerHTML += html;
}

// Initialize dashboard
async function initDashboard() {
  console.log("[Dashboard] Initializing dashboard...");
  
  try {
    await loadCurrentUser();
    const bookings = await loadUserBookings();
    console.log("📋 BOOKINGS:", bookings); // Debug bookings

    // Populate property cards first
    populatePropertyCards(bookings);

    // Then fetch and populate additional properties
    await fetchProperties();

    // Initialize form interactive elements
    initGuestCounter();
    initBedroomCounter();
    initSearchButton();
    
    console.log("[Dashboard] Dashboard initialization complete");
  } catch (error) {
    console.error("[Dashboard] Error during dashboard initialization:", error);
  }
}

// Expose functions globally
window.initDashboard = initDashboard;
window.loadCurrentUser = loadCurrentUser;
window.loadUserBookings = loadUserBookings;
window.fetchProperties = fetchProperties;
window.populatePropertyCards = populatePropertyCards;
window.populateRecentlyViewed = populateRecentlyViewed;
window.currentUser = currentUser;

function initGuestCounter() {
  const numberWrappers = document.querySelectorAll('#sticky-form-container .number-wrapper');
  let guestWrapper = null;

  numberWrappers.forEach(wrapper => {
    const label = wrapper.querySelector('.number-label');
    if (label && label.textContent.trim().toLowerCase() === 'guests') {
      guestWrapper = wrapper;
    }
  });

  if (!guestWrapper) { console.warn('[Dashboard] Guest wrapper not found'); return; }

  const span = guestWrapper.querySelector('.number-buttons span');
  if (!span) { console.warn('[Dashboard] Guest span not found'); return; }

  // Fix button positioning: make them relative so clicks register inside an auto-height wrapper
  const allBtns = guestWrapper.querySelectorAll('.number-buttons button');
  allBtns.forEach(b => {
    b.style.position = 'relative';
    b.style.top = 'auto';
    b.style.left = 'auto';
    b.style.right = 'auto';
    b.style.zIndex = '10';
  });

  let plusBtn = null, minusBtn = null;
  allBtns.forEach(b => {
    if (b.textContent.trim() === '+') plusBtn = b;
    if (b.textContent.trim() === '-') minusBtn = b;
  });

  if (!plusBtn || !minusBtn) { console.warn('[Dashboard] Guest +/- buttons not found'); return; }

  let count = parseInt(span.textContent) || 2;
  const maxGuests = 20;

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    count = count < maxGuests ? count + 1 : 1;
    span.textContent = count;
  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    count = count > 1 ? count - 1 : maxGuests;
    span.textContent = count;
  });
}

function initBedroomCounter() {
  const numberWrappers = document.querySelectorAll('#sticky-form-container .number-wrapper');
  let bedroomWrapper = null;

  numberWrappers.forEach(wrapper => {
    const label = wrapper.querySelector('.number-label');
    if (label && label.textContent.trim().toLowerCase() === 'bedrooms') {
      bedroomWrapper = wrapper;
    }
  });

  if (!bedroomWrapper) { console.warn('[Dashboard] Bedroom wrapper not found'); return; }

  const span = bedroomWrapper.querySelector('.number-buttons span');
  if (!span) { console.warn('[Dashboard] Bedroom span not found'); return; }

  // Fix button positioning: make them relative so clicks register inside an auto-height wrapper
  const allBtns = bedroomWrapper.querySelectorAll('.number-buttons button');
  allBtns.forEach(b => {
    b.style.position = 'relative';
    b.style.top = 'auto';
    b.style.left = 'auto';
    b.style.right = 'auto';
    b.style.zIndex = '10';
  });

  let plusBtn = null, minusBtn = null;
  allBtns.forEach(b => {
    if (b.textContent.trim() === '+') plusBtn = b;
    if (b.textContent.trim() === '-') minusBtn = b;
  });

  if (!plusBtn || !minusBtn) { console.warn('[Dashboard] Bedroom +/- buttons not found'); return; }

  let count = span.textContent.trim().toLowerCase() === 'all' ? 0 : (parseInt(span.textContent) || 0);
  const maxBedrooms = 10;

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    count = count < maxBedrooms ? count + 1 : 1;
    span.textContent = count === 0 ? 'All' : count;
  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    count = count > 0 ? count - 1 : maxBedrooms;
    span.textContent = count === 0 ? 'All' : count;
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
            const locationName = button.id.replace(/-\d+$/, '');
            selectedDestinations.push(locationName);
        }
    });

    const dest = selectedDestinations.length > 0 ? selectedDestinations.join(',') : 'all';
    const arrival = document.getElementById(':r1:-form-item')?.value || '';
    const departure = document.getElementById(':r2:')?.value || '';

    let guests = '2';
    let bedrooms = 'All';
    const numberWrappers = document.querySelectorAll('#sticky-form-container .number-wrapper');
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
      submitBtn.innerHTML = `
        <svg
          width="auto"
          viewBox="0 0 120 30"
          class="fill-current"
          style="height: 0.8rem !important; z-index: 2; position: relative"
        >
          <circle cx="15" cy="15" r="15">
            <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="60" cy="15" r="9" fill-opacity="0.3">
            <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="105" cy="15" r="15">
            <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
          </circle>
        </svg>
      `;
    }

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
