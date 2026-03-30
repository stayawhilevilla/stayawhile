/**
 * Loads property_data.json and fills the static destination page template.
 */

/**
 * OptinMonster popups (ids like om-*-optin, classes heimdal-c-canvas) are usually injected via
 * Google Tag Manager or their script from a.omappapi.com. This removes any that still appear.
 */
function blockMarketingOverlays() {
  const remove = () => {
    document.querySelectorAll('[id^="om-"]').forEach((el) => el.remove());
    document.querySelectorAll('.heimdal-c-canvas').forEach((el) => el.remove());
    document
      .querySelectorAll(
        'iframe[src*="omappapi.com"], iframe[src*="optinmonster"]',
      )
      .forEach((el) => el.remove());
  };
  remove();
  let t;
  const obs = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(remove, 0);
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Normalize literal \\n sequences from JSON into newlines. */
function normalizeDescriptionText(s) {
  return String(s)
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n')
    .trim();
}

/**
 * Same order and labels as the live listing: intro paragraph, then h4 + p blocks.
 * (Notes appear before Getting Around, matching the original DOM.)
 */
function getPublicDescriptionSections(data) {
  const pd = data.publicDescription || {};
  const spec = [
    { heading: null, text: pd.summary },
    { heading: 'The Space', text: pd.space },
    { heading: 'Guest Access', text: pd.access },
    { heading: 'Neighborhood', text: pd.neighborhood },
    { heading: 'Other Things to Note', text: pd.notes },
    { heading: 'Getting Around', text: pd.transit },
    { heading: 'Guest Interactions', text: pd.interactionWithGuests },
    { heading: 'House Rules', text: pd.houseRules },
  ];
  const out = [];
  for (const { heading, text } of spec) {
    if (typeof text !== 'string' || text.trim().length <= 2) continue;
    const t = normalizeDescriptionText(text);
    if (t.length <= 2) continue;
    if (/^T[a-z0-9]{3,},?$/i.test(t)) continue;
    out.push({ heading, text: t });
  }
  return out;
}

function sectionsToPlainText(sections) {
  if (!sections.length) return '';
  return sections
    .map((s) => (s.heading ? `${s.heading}\n\n${s.text}` : s.text))
    .join('\n\n');
}

function sectionsToHtml(sections) {
  return sections
    .map((s) => {
      const body = escapeHtml(s.text).replace(/\n/g, '<br>');
      if (s.heading) {
        return `<h4>${escapeHtml(s.heading)}</h4><p>${body}</p>`;
      }
      return `<p>${body}</p>`;
    })
    .join('');
}

function buildDescription(data) {
  const sections = getPublicDescriptionSections(data);
  return sectionsToPlainText(sections) || data.title || '';
}

const AMENITIES_PREVIEW_COUNT = 12;

function initPropertyDescriptionToggle(data) {
  const descEl = document.getElementById('property-description');
  const btn = document.getElementById('property-description-toggle');
  if (!descEl) return;

  const pd = data.publicDescription || {};
  const fullHtml = pd.full || '';

  // Strip HTML tags for teaser text
  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const fullText = stripHtml(fullHtml);
  const summaryRaw = (pd.summary && String(pd.summary).trim()) || '';
  const teaser = summaryRaw || fullText.slice(0, Math.min(500, fullText.length));

  const hasMore = fullText.length > teaser.length + 40 ||
                 (!!summaryRaw && fullText.length > summaryRaw.length + 40);

  const renderTeaser = () => {
    const html = escapeHtml(teaser).replace(/\n/g, '<br>');
    descEl.innerHTML = `<p>${html}</p>`;
  };

  const renderFull = () => {
    descEl.innerHTML = fullHtml;
  };

  if (!hasMore || !fullHtml) {
    renderFull();
    if (btn) btn.closest('p')?.classList.add('hidden');
    return;
  }

  if (btn) btn.closest('p')?.classList.remove('hidden');

  const apply = () => {
    const expanded = btn && btn.dataset.expanded === '1';
    if (expanded) renderFull();
    else renderTeaser();
    if (btn) btn.textContent = expanded ? 'Show Less' : 'Show More';
  };

  if (btn) {
    btn.dataset.expanded = '0';
    btn.onclick = (e) => {
      e.preventDefault();
      btn.dataset.expanded = btn.dataset.expanded === '1' ? '0' : '1';
      apply();
    };
    apply();
  } else {
    renderFull();
  }
}

function initAmenitiesShowMore(amenitiesGrid) {
  const btn = document.getElementById('amenities-show-more');
  if (!btn || !amenitiesGrid) return;

  const children = amenitiesGrid.children;
  if (children.length <= AMENITIES_PREVIEW_COUNT) {
    btn.closest('p')?.classList.add('hidden');
    return;
  }

  btn.closest('p')?.classList.remove('hidden');

  const apply = () => {
    const expanded = btn.dataset.expanded === '1';
    for (let i = 0; i < children.length; i++) {
      if (i >= AMENITIES_PREVIEW_COUNT) children[i].hidden = !expanded;
    }
    btn.textContent = expanded ? 'Show Less' : 'Show More';
  };

  btn.dataset.expanded = '0';
  btn.onclick = (e) => {
    e.preventDefault();
    btn.dataset.expanded = btn.dataset.expanded === '1' ? '0' : '1';
    apply();
  };
  apply();
}

function getIconSlug(name) {
  const n = String(name).trim();
  const map = {
    'Free parking on premises': 'FREE_PARKING',
    'Free parking on street': 'FREE_PARKING',
    'Air conditioning': 'AIR_CONDITIONING',
    Heating: 'HEATING',
    'Hot tub': 'HOT_TUB',
    Kitchen: 'KITCHEN',
    Wifi: 'WIRELESS_INTERNET',
    Internet: 'INTERNET',
    'Wireless Internet': 'WIRELESS_INTERNET',
    TV: 'TV',
    Washer: 'WASHER',
    Dryer: 'DRYER',
    Bathtub: 'BATHTUB',
    'Coffee maker': 'COFFEE_MAKER',
    Dishwasher: 'DISHWASHER',
    Oven: 'OVEN',
    Microwave: 'MICROWAVE',
    Stove: 'STOVE',
    Refrigerator: 'REFRIGERATOR',
    'Dishes and silverware': 'DISHES_AND_SILVERWARE',
    'Patio or balcony': 'PATIO_OR_BALCONY',
    'BBQ grill': 'BBQ_GRILL',
    'Smoke detector': 'SMOKE_DETECTOR',
    'Carbon monoxide detector': 'CARBON_MONOXIDE_DETECTOR',
    'Fire extinguisher': 'FIRE_EXTINGUISHER',
    'First aid kit': 'FIRST_AID_KIT',
    'Hair dryer': 'HAIR_DRYER',
    Hangers: 'HANGERS',
    Iron: 'IRON',
    Shampoo: 'SHAMPOO',
    'Bed linens': 'BED_LINENS',
    'Extra pillows and blankets': 'EXTRA_PILLOWS_AND_BLANKETS',
    'Room-darkening shades': 'ROOM_DARKENING_SHADES',
    Essentials: 'ESSENTIALS',
    'Hot water': 'HOT_WATER',
    'Baby bath': 'BABY_BATH',
    'High chair': 'HIGH_CHAIR',
    'Children’s dinnerware': 'CHILDREN_DINNERWARE',
    "Children's dinnerware": 'CHILDREN_DINNERWARE',
    'Children’s books and toys': 'CHILDREN_BOOKS_AND_TOYS',
    "Children's books and toys": 'CHILDREN_BOOKS_AND_TOYS',
    'Babysitter recommendations': 'BABYSITTER_RECOMMENDATIONS',
    'Accessible-height bed': 'ACCESSIBLE_HEIGHT_BED',
    'Accessible-height toilet': 'ACCESSIBLE_HEIGHT_TOILET',
    'Step-free access': 'STEP_FREE_ACCESS',
    'Path to entrance lit at night': 'PATH_TO_ENTRANCE_LIT_AT_NIGHT',
    'Pack ’n Play/travel crib': 'PACK_N_PLAY_TRAVEL_CRIB',
    'Pack \'n play/travel crib': 'PACK_N_PLAY_TRAVEL_CRIB',
    'Beach essentials': 'BEACH_ESSENTIALS',
  };
  if (map[n]) return map[n];
  return n
    .toUpperCase()
    .replace(/['’]/g, '')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

}


async function initProperty() {
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const requestedId = urlParams.get('id');
    
    // Fetch property data from local API
    const apiUrl = requestedId 
      ? `http://localhost/api/properties/${requestedId}`
      : 'http://localhost/api/properties';
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to load property data');
    
    let propertyData;
    if (requestedId) {
      // Single property requested
      propertyData = await response.json();
    } else {
      // All properties requested, get first one
      const allProperties = await response.json();
      propertyData = Array.isArray(allProperties) ? allProperties[0] : allProperties;
    }
    
    if (!propertyData) {
      console.error('No property data found from API');
      return;
    }
    
    console.log(`Loading property: ${propertyData.title || propertyData.nickname || 'Unknown'}`);
    renderProperty(propertyData);
  } catch (error) {
    console.error('Error initializing property:', error);
  }
}

function renderProperty(data) {
  if (data.title) {
    document.title = data.title;
  }

  const titleEl = document.getElementById('property-title');
  if (titleEl) {
    titleEl.textContent = data.title || '';
  }

  // Load max guests and update property info
  loadMaxGuests(data);

  initPropertyDescriptionToggle(data);

  const statsEl = document.getElementById('property-stats');
  if (statsEl) {
    const columns = statsEl.children;
    const guests = data.accommodates ?? data.guests;
    if (columns.length >= 3) {
      updateStatText(
        columns[0],
        `${data.bedrooms} ${data.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`,
      );
      updateStatText(
        columns[1],
        `${data.bathrooms} ${data.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`,
      );
      updateStatText(
        columns[2],
        `${guests} ${guests === 1 ? 'Guest' : 'Guests'}`,
      );
    }
  }

  const nickEl = document.getElementById('gallery-nickname');
  if (nickEl && data.nickname) {
    nickEl.textContent = data.nickname;
  }

  const locNick = document.getElementById('location-nickname');
  if (locNick && data.nickname) {
    locNick.textContent = data.nickname;
  }

  const addrLink = document.getElementById('property-address-link');
  if (addrLink && data.address) {
    const full = data.address.full || '';
    if (full) {
      addrLink.textContent = full;
      const q = encodeURIComponent(full);
      addrLink.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    }
  }

  const mapIframe = document.getElementById('property-map-iframe');
  if (mapIframe && data.address) {
    const lat = data.address.lat;
    const lng = data.address.lng;
    if (lat != null && lng != null) {
      mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&hl=en&z=15&output=embed`;
    }
  }

  const matterportIframe = document.getElementById('property-matterport-iframe');
  if (matterportIframe) {
    // Try virtualTour.url first, then matterportUrl as fallback
    const matterportUrl = data.virtualTour?.url || data.matterportUrl || '';
    if (matterportUrl) {
      matterportIframe.src = matterportUrl;
    }
  }

  const nearbyHeading = document.getElementById('nearby-properties-heading');
  if (nearbyHeading && data.address && data.address.city) {
    const cityName = data.address.city;
    nearbyHeading.innerHTML = `Nearby Properties in <span class="text-gold">${escapeHtml(cityName)}</span>`;
  }

  const amenitiesGrid = document.getElementById('amenities-grid');
  if (amenitiesGrid && Array.isArray(data.amenities)) {
    const list = data.amenities;
    amenitiesGrid.innerHTML = list
      .map((amenity, index) => {
        // Handle new format with text and icon properties
        const amenityText = amenity.text || amenity; // Fallback to old format
        const amenityIcon = amenity.icon || '';
        const safeName = escapeHtml(amenityText);
        const extra = index >= AMENITIES_PREVIEW_COUNT ? ' hidden' : '';
        
        // Use provided icon URL or fall back to local icon mapping
        const iconSrc = amenityIcon ? amenityIcon : `../icons/${getIconSlug(amenityText)}.svg`;
        const fallbackSrc = amenityIcon || '../icons/ESSENTIALS.svg';
        
        return `
      <div${extra}>
        <div class="flex flex-col">
          <div class="mb-5 max-w-[40px]">
            <div class="aspect-w-1 aspect-h-1">
              <img
                alt="${safeName}"
                loading="lazy"
                class="object-bottom object-contain"
                style="position: absolute; height: 100%; width: 100%; inset: 0px;"
                src="${iconSrc}"
                onerror="this.onerror=null;this.src='${fallbackSrc}'"
              />
            </div>
          </div>
          <p class="text-xs mb-0">${safeName}</p>
        </div>
      </div>`;
      })
      .join('');
    initAmenitiesShowMore(amenitiesGrid);
  }

  const pictures = data.pictures || [];
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && pictures.length) {
    const imgs = pictures.slice(0, 5);
    galleryGrid.innerHTML = imgs
      .map((pic, index) => {
        const url = pic.original || pic.url || '';
        const colSpan =
          index === 0
            ? 'col-span-4 md:col-span-2 row-span-2'
            : 'col-span-2 md:col-span-1 row-span-1';
        const cap = escapeHtml(pic.caption || `Image ${index + 1}`);
        const srcAttr = String(url).replace(/"/g, '&quot;');
        return `
          <button type="button" class="relative aspect-w-1 aspect-h-1 ${colSpan}">
            <img
              alt="${cap}"
              loading="lazy"
              class="object-cover object-center"
              style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
              src="${srcAttr}"
            />
          </button>`;
      })
      .join('');
  }

  initGalleryLightbox(pictures);
  initTestimonials(data);
  initNearbyProperties(data);
}

function initNearbyProperties(currentProperty) {
  const container = document.getElementById('nearby-properties-container');
  if (!container || !currentProperty.address?.city) return;

  const currentCity = currentProperty.address.city;
  const currentId = currentProperty._id;

  // Fetch all properties from API to find nearby ones
  fetch('http://localhost/api/properties')
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

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
            alt="${escapeHtml(title)}"
            loading="lazy"
            decoding="async"
            class="object-cover object-center"
            style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"
            src="${imageUrl}"
          />
        </div>
        <div class="hidden lg:block img-outer relative lg:absolute w-full overflow-hidden h-full left-0 top-0 -z-[2] lg:group-hover:z-[2] transition-transform duration-7500 ease-out group-hover:scale-105">
          <img
            alt="${escapeHtml(title)}"
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
              ${escapeHtml(title)}
            </p>
            <p class="pointer-events-none block text-sm text-white">
              ${escapeHtml(location)}
            </p>
          </div>
        </div>
      </li>
    `;
  }).join('');
}

const TESTIMONIAL_STAR_SVG = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="inline-block text-gold" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>`;

function testimonialImageUrl(t, data) {
  return (
    t.listing?.image?.data?.src ||
    data.testimonialFallbackImage ||
    data.picture?.thumbnail ||
    (data.pictures && data.pictures[0] && data.pictures[0].original) ||
    ''
  );
}

function formatTestimonialDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderTestimonialStars(rating) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 5)));
  return Array.from({ length: n }, () => TESTIMONIAL_STAR_SVG).join('');
}

function initTestimonials(data) {
  const items = data.testimonials;
  if (!Array.isArray(items) || items.length === 0) return;

  const imgEl = document.getElementById('testimonial-image');
  const bodyEl = document.getElementById('testimonial-body');
  const dateEl = document.getElementById('testimonial-date');
  const starsEl = document.getElementById('testimonial-stars');
  const nextBtn = document.getElementById('testimonial-next');
  if (!imgEl || !bodyEl || !dateEl || !starsEl) return;

  let idx = 0;
  const apply = () => {
    const t = items[idx];
    const url = testimonialImageUrl(t, data);
    if (url) {
      imgEl.removeAttribute('srcset');
      imgEl.src = url;
    }
    const alt =
      (t.listing && t.listing.title) || data.nickname || data.title || '';
    if (alt) imgEl.alt = alt;

    const body = String(t.body || '')
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n');
    bodyEl.textContent = body;

    dateEl.textContent = formatTestimonialDate(t.date);
    starsEl.innerHTML = renderTestimonialStars(t.rating);
  };

  apply();

  if (nextBtn && items.length > 1) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      idx = (idx + 1) % items.length;
      apply();
    };
  } else if (nextBtn) {
    nextBtn.classList.add('hidden');
  }
}

function initGalleryLightbox(pictures) {
  const showBtn = document.getElementById('gallery-show-all');
  const section = document.getElementById('gallery-section');
  if (!showBtn || !section || !pictures.length) return;

  let root = document.getElementById('property-gallery-lightbox');
  if (!root) {
    root = document.createElement('div');
    root.id = 'property-gallery-lightbox';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'All property photos');
    root.style.cssText =
      'display:none;position:fixed;inset:0;z-index:200;overflow:auto;-webkit-overflow-scrolling:touch;background:rgba(0,0,0,0.92);padding:64px 16px 24px;box-sizing:border-box;';
    root.innerHTML = `
      <button type="button" data-lb-close aria-label="Close photo gallery" style="position:fixed;top:12px;right:12px;z-index:3;width:48px;height:48px;border:0;border-radius:4px;background:rgba(255,255,255,0.12);color:#fff;font-size:28px;line-height:1;cursor:pointer">×</button>
      <div data-lb-grid style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px"></div>`;
    document.body.appendChild(root);

    const close = () => {
      root.style.display = 'none';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
    const open = () => {
      root.style.display = 'block';
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onEsc);
    };
    function onEsc(e) {
      if (e.key === 'Escape') close();
    }

    root.addEventListener('click', (e) => {
      if (e.target === root) close();
    });
    root.querySelector('[data-lb-close]').addEventListener('click', close);
    showBtn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
    section.addEventListener('click', (e) => {
      if (e.target.closest('#gallery-grid button')) open();
    });
  }

  const grid = root.querySelector('[data-lb-grid]');
  if (grid) {
    grid.innerHTML = pictures
      .map((pic, i) => {
        const url = pic.original || pic.url || '';
        const cap = escapeHtml(pic.caption || `Photo ${i + 1}`);
        const src = String(url).replace(/"/g, '&quot;');
        return `<figure style="margin:0">
  <img src="${src}" alt="${cap}" loading="lazy" style="width:100%;height:auto;display:block;object-fit:cover;border-radius:4px;vertical-align:middle" />
  <figcaption style="font-size:11px;color:#bbb;margin-top:8px;line-height:1.35">${cap}</figcaption>
</figure>`;
      })
      .join('');
  }
}

function updateStatText(container, text) {
  const textTarget = container.querySelector('.flex-col') || container;
  const existingSvg = textTarget.querySelector('svg');
  textTarget.innerHTML = '';
  if (existingSvg) textTarget.appendChild(existingSvg);
  textTarget.appendChild(document.createTextNode(text));
}

function initListingNav() {
  const menu = document.getElementById('site-nav-menu');
  const toggle = document.getElementById('site-nav-toggle');
  if (!menu || !toggle) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('site-nav-open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

function loadMaxGuests(property) {
  try {
    // Guest Counter Functionality
    let guestCount = 2;
    let maxGuests = property.accommodates || 10; // Use property data or default fallback
    const guestDisplay = document.querySelector('.number-buttons span');
    const guestIncrementBtn = document.querySelector('.number-buttons button:first-child');
    const guestDecrementBtn = document.querySelector('.number-buttons button:last-child');
    
    // Store property data for booking calculations
    window.propertyData = property;
    
    // Set property name in multiple places
    const propertyNameEls = document.querySelectorAll('#property-name, #gallery-nickname');
    if (property.nickname) {
      propertyNameEls.forEach(el => {
        if (el) el.textContent = property.nickname;
      });
    }
    
    // Set property title
    const propertyTitleEl = document.getElementById('property-title');
    if (propertyTitleEl && property.title) {
      propertyTitleEl.textContent = property.title;
    }
    
    // Set property description
    const propertyDescEl = document.getElementById('property-description');
    if (propertyDescEl && property.description) {
      propertyDescEl.querySelector('p').textContent = property.description;
    }
    
    // Check for testimonials and show section if exists
    const testimonialsSection = document.getElementById('testimonials-section');
    if (testimonialsSection && property.testimonials && property.testimonials.length > 0) {
      testimonialsSection.classList.remove('hidden');
      console.log('Testimonials found:', property.testimonials.length);
    }
    
    console.log('Max guests set to:', maxGuests);
    
    // Guest counter functions
    function updateGuestDisplay() {
      if (guestDisplay) {
        guestDisplay.textContent = guestCount;
      }
    }
    
    function incrementGuests() {
      if (guestCount < maxGuests) {
        guestCount++;
        updateGuestDisplay();
      }
    }
    
    function decrementGuests() {
      if (guestCount > 1) {
        guestCount--;
        updateGuestDisplay();
      }
    }
    
    // Add event listeners
    if (guestIncrementBtn) {
      guestIncrementBtn.addEventListener('click', incrementGuests);
    }
    
    if (guestDecrementBtn) {
      guestDecrementBtn.addEventListener('click', decrementGuests);
    }
    
    // Initialize display
    updateGuestDisplay();
    
  } catch (error) {
    console.error('Error loading max guests:', error);
  }
}

function calculateBookingTotal(arrivalDate, departureDate, property) {
  // Calculate number of nights
  const nights = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24));
  
  // Get base price from nested prices object (use default if not available)
  const basePrice = property.prices?.basePrice || property.basePrice || property.price || 1732;
  
  // Calculate accommodation total
  const accommodationTotal = basePrice * nights;
  
  // Add cleaning fee from nested prices object (use property value or default)
  const cleaningFee = property.prices?.cleaningFee || property.cleaningFee || 250;
  
  // Calculate damage waiver (5% of accommodation total)
  const damageWaiver = accommodationTotal * 0.05;
  
  // Calculate transient occupancy tax (8% for Los Angeles area)
  const taxRate = 0.08; // 8%
  const taxAmount = (accommodationTotal + cleaningFee + damageWaiver) * taxRate;
  
  // Add credit card processing fee (2.9% + $0.30)
  const processingFeeRate = 0.029;
  const processingFeeFixed = 0.30;
  const processingFee = (accommodationTotal + cleaningFee + damageWaiver + taxAmount) * processingFeeRate + processingFeeFixed;
  
  // Calculate total
  const total = accommodationTotal + cleaningFee + damageWaiver + taxAmount + processingFee;
  
  return {
    nights,
    basePrice,
    accommodationTotal,
    cleaningFee,
    damageWaiver,
    taxAmount,
    taxRate: taxRate * 100,
    processingFee,
    total,
    subtotal: accommodationTotal + cleaningFee + damageWaiver + taxAmount
  };
}

function handleBookingSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const arrivalInput = document.getElementById(':r5:-form-item');
  const departureInput = document.getElementById(':r6:');
  const guestDisplay = document.querySelector('.number-buttons span');
  const errorDiv = document.querySelector('.bg-error');
  
  const arrivalValue = arrivalInput ? arrivalInput.value : '';
  const departureValue = departureInput ? departureInput.value : '';
  const guests = guestDisplay ? parseInt(guestDisplay.textContent) : 2;
  
  // Hide error message initially
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
  
  // Validate dates
  if (!arrivalValue || !departureValue) {
    // Show error message
    if (errorDiv) {
      errorDiv.style.display = 'block';
    }
    return;
  }
  
  // Parse dates
  const arrivalDate = new Date(arrivalValue);
  const departureDate = new Date(departureValue);
  
  if (isNaN(arrivalDate.getTime()) || isNaN(departureDate.getTime())) {
    // Show error message
    if (errorDiv) {
      errorDiv.style.display = 'block';
    }
    return;
  }
  
  if (departureDate <= arrivalDate) {
    // Show error message
    if (errorDiv) {
      errorDiv.style.display = 'block';
    }
    return;
  }
  
  // Get property data
  const property = window.propertyData;
  if (!property) {
    // Show error message
    if (errorDiv) {
      errorDiv.style.display = 'block';
    }
    return;
  }
  
  // Update container classes for scrollable behavior
  const bookingContainer = document.querySelector('.bg-tan.px-5.py-6.lg\\:py-8.lg\\:px-12.relative');
  if (bookingContainer) {
    bookingContainer.className = 'bg-tan px-5 py-6 lg:py-8 lg:px-12 relative max-h-[calc(100vh-7rem)] overflow-y-auto min-h-[500px]';
  }
  
  // Calculate booking total
  const booking = calculateBookingTotal(arrivalDate, departureDate, property);
  
  // Update UI with booking details
  updateBookingUI(booking, property);
  
  // Hide check availability button and show details
  const checkAvailabilityBtn = document.querySelector('button[type="submit"]:not(.hidden)');
  const detailsDiv = document.getElementById('details');
  
  if (checkAvailabilityBtn) {
    checkAvailabilityBtn.style.display = 'none';
  }
  
  if (detailsDiv) {
    detailsDiv.style.display = 'block';
  }
  
  // Hide error message on success
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
  
  console.log('Booking calculated:', booking);
}

function updateBookingUI(booking, property) {
  // Format currency with commas
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  // Update detailed breakdown
  const breakdownContainer = document.querySelector('#details .space-y-2');
  if (breakdownContainer) {
    // Update nights and base price
    const nightsDiv = breakdownContainer.querySelector('.grid.grid-cols-2.gap-5.text-sm');
    if (nightsDiv) {
      nightsDiv.innerHTML = `
        <div>${booking.nights} Nights x</div>
        <div class="text-right">${formatCurrency(booking.basePrice)} / Night</div>
      `;
    }
    
    // Update accommodation fare
    const accommodationDivs = breakdownContainer.querySelectorAll('.grid.grid-cols-2.gap-5.text-sm');
    if (accommodationDivs[1]) {
      accommodationDivs[1].innerHTML = `
        <div class="capitalize">accommodation fare</div>
        <div class="text-right">${formatCurrency(booking.accommodationTotal)}</div>
      `;
    }
    
    // Update cleaning fee
    if (accommodationDivs[2]) {
      accommodationDivs[2].innerHTML = `
        <div class="capitalize">cleaning fee</div>
        <div class="text-right">${formatCurrency(booking.cleaningFee)}</div>
      `;
    }
    
    // Update credit card processing fee
    if (accommodationDivs[3]) {
      accommodationDivs[3].innerHTML = `
        <div class="capitalize">credit card processing</div>
        <div class="text-right">${formatCurrency(booking.processingFee)}</div>
      `;
    }
    
    // Update damage waiver (calculate as 5% of accommodation total)
    if (accommodationDivs[4]) {
      const damageWaiver = booking.accommodationTotal * 0.05; // 5% damage waiver
      accommodationDivs[4].innerHTML = `
        <div class="capitalize">damage waiver</div>
        <div class="text-right">${formatCurrency(damageWaiver)}</div>
      `;
    }
    
    // Update transient occupancy tax
    if (accommodationDivs[5]) {
      accommodationDivs[5].innerHTML = `
        <div class="capitalize">transient occupancy tax</div>
        <div class="text-right">${formatCurrency(booking.taxAmount)}</div>
      `;
    }
  }
  
  // Update total amount (more specific selector)
  const totalDiv = document.querySelector('#details .grid.grid-cols-2.gap-5.text-3xl .text-right');
  if (totalDiv) {
    totalDiv.textContent = formatCurrency(booking.total);
  } else {
    // Fallback selector
    const fallbackTotal = document.querySelector('#details .text-right');
    if (fallbackTotal) {
      fallbackTotal.textContent = formatCurrency(booking.total);
    }
  }
  
  // Update reserve button with base price per night
  const reserveBtn = document.querySelector('#details button[type="submit"] span');
  if (reserveBtn) {
    reserveBtn.textContent = `Reserve for ${formatCurrency(booking.basePrice)}/Night`;
    
    // Add click event listener to the reserve button
    const reserveButton = reserveBtn.parentElement;
    if (reserveButton) {
      reserveButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get property ID from window.propertyData
        const propertyId = window.propertyData?._id || '';
        
        // Get current guest count
        const guestDisplay = document.querySelector('.number-buttons span');
        const guests = guestDisplay ? parseInt(guestDisplay.textContent) : 2;
        
        // Navigate to reserve.html with parameters
        const reserveUrl = `/reserve.html?id=${propertyId}&nights=${booking.nights}&guests=${guests}`;
        window.location.href = reserveUrl;
      });
    }
  }
  
  // You can also update other booking details here if needed
  console.log(`Booking: ${booking.nights} nights at ${formatCurrency(booking.basePrice)}/night`);
  console.log(`Accommodation: ${formatCurrency(booking.accommodationTotal)}`);
  console.log(`Cleaning Fee: ${formatCurrency(booking.cleaningFee)}`);
  console.log(`Tax (${booking.taxRate}%): ${formatCurrency(booking.taxAmount)}`);
  console.log(`Processing Fee: ${formatCurrency(booking.processingFee)}`);
  console.log(`Total: ${formatCurrency(booking.total)}`);
}

// Override the handleFormSubmit function in villa.html
document.addEventListener('DOMContentLoaded', () => {
  // Wait for villa.html script to load
  setTimeout(() => {
    // Find the Check Availability button specifically
    const checkAvailabilityBtn = document.querySelector('button[type="submit"]:not(.hidden)');
    if (checkAvailabilityBtn) {
      // Add click event listener to Check Availability button only
      checkAvailabilityBtn.addEventListener('click', handleBookingSubmit);
    }
    
    // Add event listeners to hide pricing when dates are clicked after calculation
    const arrivalInput = document.getElementById(':r5:-form-item');
    const departureInput = document.getElementById(':r6:');
    const detailsDiv = document.getElementById('details');
    
    function resetBookingState() {
      // Hide details div
      if (detailsDiv) {
        detailsDiv.style.display = 'none';
      }
      
      // Show check availability button
      const checkBtn = document.querySelector('button[type="submit"]:not(.hidden)');
      if (checkBtn) {
        checkBtn.style.display = 'block';
      }
      
      // Hide error message
      const errorDiv = document.querySelector('.bg-error');
      if (errorDiv) {
        errorDiv.style.display = 'none';
      }
      
      // Restore original container classes
      const bookingContainer = document.querySelector('.bg-tan.px-5.py-6.lg\\:py-8.lg\\:px-12.relative');
      if (bookingContainer) {
        bookingContainer.className = 'bg-tan px-5 py-6 lg:py-8 lg:px-12 relative';
      }
    }
    
    if (arrivalInput) {
      arrivalInput.addEventListener('click', () => {
        // Only reset if details are currently visible
        if (detailsDiv && detailsDiv.style.display === 'block') {
          resetBookingState();
        }
      });
    }
    
    if (departureInput) {
      departureInput.addEventListener('click', () => {
        // Only reset if details are currently visible
        if (detailsDiv && detailsDiv.style.display === 'block') {
          resetBookingState();
        }
      });
    }
  }, 500);
});

document.addEventListener('DOMContentLoaded', () => {
  blockMarketingOverlays();
  initListingNav();
  initProperty();
  
});