/**
 * Loads data.json and renders all properties as destination cards in the grid.
 * Based on property_render.js but adapted for multiple destination listings.
 */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Normalise a tag for comparison: lowercase + collapse special chars to spaces
function normalizeTag(t) {
  return String(t)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")  // replace /, ', etc. with space
    .replace(/\s+/g, " ")          // collapse multiple spaces
    .trim();
}

function normalizeDescriptionText(s) {
  return String(s).replace(/\r\n/g, "\n").replace(/\\n/g, "\n").trim();
}

function getPublicDescriptionSections(data) {
  const pd = data.publicDescription || {};
  const spec = [
    { heading: null, text: pd.summary },
    { heading: "The Space", text: pd.space },
    { heading: "Guest Access", text: pd.access },
    { heading: "Neighborhood", text: pd.neighborhood },
    { heading: "Other Things to Note", text: pd.notes },
    { heading: "Getting Around", text: pd.transit },
    { heading: "Guest Interactions", text: pd.interactionWithGuests },
    { heading: "House Rules", text: pd.houseRules },
  ];
  const out = [];
  for (const { heading, text } of spec) {
    if (typeof text !== "string" || text.trim().length <= 2) continue;
    const t = normalizeDescriptionText(text);
    if (t.length <= 2) continue;
    if (/^T[a-z0-9]{3,},?$/i.test(t)) continue;
    out.push({ heading, text: t });
  }
  return out;
}

function buildDescription(data) {
  const sections = getPublicDescriptionSections(data);
  return (
    sections
      .map((s) => (s.heading ? `${s.heading}\n\n${s.text}` : s.text))
      .join("\n\n") ||
    data.title ||
    ""
  );
}

function renderTestimonialStars(rating) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 5)));
  const starSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="inline-block text-gold" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>`;
  return Array.from({ length: n }, () => starSvg).join("");
}

function getAverageRating(testimonials) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) return 0;
  const validRatings = testimonials
    .map((t) => Number(t.rating))
    .filter((r) => !isNaN(r) && r > 0 && r <= 5);
  if (validRatings.length === 0) return 0;
  const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
  return sum / validRatings.length;
}

function getReviewCount(reviews) {
  if (reviews && typeof reviews.total === "number") {
    return reviews.total;
  }
  return 0;
}

function generateImageSrcset(imageUrl) {
  if (!imageUrl) return "";
  const baseUrl = imageUrl.split("?")[0];
  const params = imageUrl.includes("?") ? imageUrl.split("?")[1] : "";

  const sizes = [
    16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
    3840,
  ];
  const srcset = sizes
    .map((size) => `${baseUrl}?w=${size}&q=75 ${size}w`)
    .join(", ");

  return srcset;
}

function renderDestinationCard(data, index) {
  const title = escapeHtml(data.title || data.nickname || "Property");
  const nickname = escapeHtml(data.nickname || "");
  const bedrooms = data.bedrooms || 0;
  const bathrooms = data.bathrooms || 0;
  const accommodates = data.accommodates || 0;
  const description = buildDescription(data);
  const averageRating = data.reviews ? data.reviews.avg : 0;
  const reviewCount = getReviewCount(data.reviews);

  // Get primary image
  const primaryImage =
    data.pictures && data.pictures.length > 0
      ? data.pictures[0].original || data.pictures[0].url || ""
      : "";

  const imageUrl = primaryImage.replace(/"/g, "&quot;");
  const srcset = generateImageSrcset(primaryImage);
  const slug = data.slug || data._id || "";

  // Generate destination URL
  const destinationUrl = data._id
    ? `/destinations/villa.html?id=${data._id}`
    : "#";

  return `
                <li class="group">
                  <div class="pb-[125%] relative group overflow-hidden">
                    <a
                      title="Click here"
                      target="_blank"
                      class="absolute inset-0 z-10"
                      href="${destinationUrl}"
                      ><span class="sr-only">Go to Click here</span></a
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
                            ${nickname}
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
                                ${bedrooms} ${bedrooms === 1 ? "Bedroom" : "Bedrooms"}
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
                                ${bathrooms} ${bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                              </div>
                            </div>
                          </div>
                          ${
                            reviewCount > 0
                              ? `
                          <div class="mt-2 text-xs">
                            <span class="tracking-widest mr-3" 
                              >${renderTestimonialStars(averageRating)} <span style="margin: 0px 4px;"></span>  ${reviewCount} Reviews</span
                            >
                          </div>`
                              : ""
                          }
                        </div>
                      </div>
                      <div
                        class="absolute inset-0 duration-7500 ease-out group-hover:scale-110"
                      >
                        ${
                          imageUrl
                            ? `
                        <img
                          alt="${title}"
                          loading="lazy"
                          decoding="async"
                          data-nimg="fill"
                          class="object-cover object-center"
                          sizes="(max-width: 768px) 360px, (max-width: 1020px) 310px, 270px"
                          srcset="${srcset}"
                          src="${imageUrl}?w=3840&q=75"
                          style="
                            position: absolute;
                            height: 100%;
                            width: 100%;
                            inset: 0px;
                            color: transparent;
                          "
                        />`
                            : ""
                        }
                      </div>
                    </div>
                  </div>
                </li>`;
}

async function initDestinations() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const destParam    = urlParams.get("dest");
    const guestsParam  = urlParams.get("guests");
    const bedroomsParam = urlParams.get("bedrooms");
    const tagsParam    = urlParams.get("tags");

    console.log("dest:", destParam, "guests:", guestsParam,
                "bedrooms:", bedroomsParam, "tags:", tagsParam);

    const response = await fetch("/api/properties");
    if (!response.ok) throw new Error("Failed to load properties");
    let allProperties = await response.json();
    if (!Array.isArray(allProperties)) allProperties = [allProperties];

    // Build filter criteria
    const allowedDests = destParam && destParam.toLowerCase() !== "all" && destParam.trim() !== ""
      ? destParam.toLowerCase().split(",").map((c) => c.trim())
      : null;

    const allowedTags = tagsParam
      ? tagsParam.split(",").map((t) => normalizeTag(t)).filter(Boolean)
      : null;

    const hasFilter = allowedDests || allowedTags || guestsParam || bedroomsParam;

    if (!hasFilter) {
      console.log(`Loading all ${allProperties.length} destinations`);
      renderDestinations(allProperties);
      return;
    }

    const destinations = allProperties.filter((p) => {
      const city     = (p.address?.city || "").toLowerCase();
      const propTags = (p.tags || []).map((tag) => normalizeTag(tag));

      // --- Destination (city / collection tag) filter ---
      if (allowedDests) {
        const destMatch = allowedDests.some((dest) => {
          if (dest === "sa beach suites")       return propTags.includes("sa beach suites");
          if (dest === "malibu sand and suites") return propTags.includes("malibu sand and suites");
          return city === dest;
        });
        if (!destMatch) return false;
      }

      // --- Amenity tags filter (property must have ALL selected tags) ---
      if (allowedTags && allowedTags.length > 0) {
        const hasAll = allowedTags.every((tag) => propTags.includes(tag));
        if (!hasAll) return false;
      }

      // --- Bedrooms filter (exact match; skipped when param is absent, "all", or 0) ---
      if (bedroomsParam && bedroomsParam.toLowerCase() !== "all") {
        const required = parseInt(bedroomsParam);
        if (required > 0) {
          const actual = parseInt(p.bedrooms) || 0;
          console.log("Bedrooms — property:", actual, "required:", required);
          if (actual !== required) return false;
        }
      }

      // --- Guests filter (must accommodate at least N guests) ---
      if (guestsParam) {
        const required = parseInt(guestsParam);
        const actual   = parseInt(p.accommodates) || 0;
        console.log("Guests — property:", actual, "required:", required);
        if (actual < required) return false;
      }

      return true;
    });

    if (destinations.length > 0) {
      console.log(`Found ${destinations.length} properties matching filters`);
      renderDestinations(destinations);
    } else {
      console.log("No properties matched the current filters");
      showNoResultsMessage();
    }
  } catch (error) {
    console.error("Error initializing destinations:", error);
  }
}

async function loadAllProperties() {
  const response = await fetch("/api/properties");
  if (!response.ok) throw new Error("Failed to load all properties");
  const allProperties = await response.json();
  const destinations = Array.isArray(allProperties)
    ? allProperties
    : [allProperties];

  if (!destinations.length) {
    console.error("No destination data found from API");
    return;
  }

  console.log(`Loading ${destinations.length} destinations from API`);
  renderDestinations(destinations);
}

function showNoResultsMessage() {
  const destinationGrid = document.getElementById("destination-grid");
  const noResultsMessage = document.getElementById("no-results-message");

  if (destinationGrid && noResultsMessage) {
    destinationGrid.style.display = "none";
    noResultsMessage.style.display = "flex";
  }
}

function renderDestinations(destinations) {
  const destinationGrid = document.getElementById("destination-grid");
  const noResultsMessage = document.getElementById("no-results-message");

  if (!destinationGrid) {
    console.error("Destination grid container not found");
    return;
  }

  // Hide no results message and show grid
  if (noResultsMessage) {
    noResultsMessage.style.display = "none";
  }
  destinationGrid.style.display = "grid";

  // Sort destinations: first those without reviews, then by menuOrder, then by title
  const sortedDestinations = destinations.sort((a, b) => {
    const reviewCountA = getReviewCount(a.reviews);
    const reviewCountB = getReviewCount(b.reviews);

    // Properties without reviews come first
    if (reviewCountA === 0 && reviewCountB > 0) return -1;
    if (reviewCountA > 0 && reviewCountB === 0) return 1;

    // If both have reviews or both don't have reviews, sort by menuOrder
    const orderA = a.menuOrder || 999;
    const orderB = b.menuOrder || 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Finally, sort by title
    return (a.title || a.nickname || "").localeCompare(
      b.title || b.nickname || "",
    );
  });

  // Generate HTML for all destination cards
  const destinationsHtml = sortedDestinations
    .map((destination, index) => renderDestinationCard(destination, index))
    .join("");

  // Update the grid with destination cards
  destinationGrid.innerHTML = destinationsHtml;

  console.log(`Rendered ${sortedDestinations.length} destination cards`);
}

document.addEventListener("DOMContentLoaded", () => {
  initDestinations();
});
