// Reserve page rendering functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get("id");
  const nights = urlParams.get("nights");
  const guests = urlParams.get("guests");

  console.log("Reserve page parameters:", { propertyId, nights, guests });

  // Update booking summary fields
  updateBookingSummary(propertyId, nights, guests);

  // Load property details
  if (propertyId) {
    loadPropertyDetails(propertyId);
  }
});

function updateBookingSummary(propertyId, nights, guests) {
  try {
    // Update nights display with "Nights x" format
    const nightsElement =
      document.querySelector("[data-booking-nights]") ||
      document.querySelector(".booking-nights") ||
      document.getElementById("booking-nights");
    if (nightsElement && nights) {
      nightsElement.textContent = `${nights} Nights x`;
    }

    // Update guests input field value
    const guestsInput =
      document.querySelector("[data-booking-guests]") ||
      document.querySelector(".booking-guests") ||
      document.getElementById("booking-guests");
    if (guestsInput && guests) {
      guestsInput.value = guests;
    }

    // Update guests display text (if there are other display elements)
    const guestsDisplayElements =
      document.querySelectorAll("[data-booking-guests-display]") ||
      document.querySelectorAll(".booking-guests-display");
    guestsDisplayElements.forEach((element) => {
      if (element && guests) {
        element.textContent = guests;
      }
    });

    // Update property ID display (if needed)
    const propertyIdElement =
      document.querySelector("[data-property-id]") ||
      document.querySelector(".property-id") ||
      document.getElementById("property-id");
    if (propertyIdElement && propertyId) {
      propertyIdElement.textContent = propertyId;
    }

    // Update booking summary text
    const summaryText =
      document.querySelector(".booking-summary-text") ||
      document.querySelector("[data-booking-summary]");
    if (summaryText && nights && guests) {
      summaryText.textContent = `${nights} nights, ${guests} guests`;
    }

    console.log("Booking summary updated:", { nights, guests });
  } catch (error) {
    console.error("Error updating booking summary:", error);
  }
}

async function loadPropertyDetails(propertyId) {
  try {
    // Fetch property data from API
    const response = await fetch(
      `http://localhost/api/properties/${propertyId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to load property details");
    }

    const property = await response.json();
    console.log("Property details loaded:", property);

    // Update property information on the page
    updatePropertyInfo(property);
  } catch (error) {
    console.error("Error loading property details:", error);

    // Show error message to user
    const errorElement =
      document.querySelector(".error-message") ||
      document.getElementById("error-message");
    if (errorElement) {
      errorElement.textContent =
        "Unable to load property details. Please try again.";
      errorElement.style.display = "block";
    }
  }
}

function updatePropertyInfo(property) {
  try {
    // Update property name
    const propertyNameElements =
      document.querySelectorAll("[data-property-name]") ||
      document.querySelectorAll(".property-name");
    propertyNameElements.forEach((element) => {
      if (element && property.title) {
        element.textContent = property.title;
      } else if (element && property.nickname) {
        element.textContent = property.nickname;
      }
    });

    // Update property location
    const locationElements =
      document.querySelectorAll("[data-property-location]") ||
      document.querySelectorAll(".property-location");
    locationElements.forEach((element) => {
      if (element && property.address) {
        const location =
          `${property.address.city || ""}, ${property.address.state || ""}`.trim();
        element.textContent = location;
      }
    });

    // Update property image
    console.log("Property picture:", property.picture);
    console.log("Property pictures:", property.pictures);
    const imageElements =
      document.querySelectorAll("[data-property-image]") ||
      document.querySelectorAll(".property-image");
    console.log("Found image elements:", imageElements.length);
    
    imageElements.forEach((element, index) => {
      console.log(`Processing image element ${index}:`, element);
      
      // Handle both single picture object and pictures array
      let imageUrl = null;
      
      if (property.picture && property.picture.thumbnail) {
        // Single picture object with thumbnail
        imageUrl = property.picture.thumbnail;
      } else if (property.pictures && property.pictures.length > 0) {
        // Pictures array
        imageUrl = property.pictures[0].original ||
                   property.pictures[0].url ||
                   property.pictures[0];
      } else if (property.picture && property.picture.url) {
        // Single picture object with url
        imageUrl = property.picture.url;
      }
      
      if (imageUrl) {
        console.log("Setting image URL:", imageUrl);
        
        // For img elements
        if (element.tagName === "IMG") {
          element.src = imageUrl;
          element.alt = property.title || property.nickname || "Property image";
          console.log("Updated IMG element with src:", imageUrl);
        }
        // For div elements with background images
        else {
          element.style.backgroundImage = `url(${imageUrl})`;
          element.style.backgroundSize = "cover";
          element.style.backgroundPosition = "center";
          console.log("Updated DIV element with background image:", imageUrl);
        }
      } else {
        console.log("No valid image URL found");
      }
    });

    // Update beds and baths information
    const bedElements = document.querySelectorAll("span") || [];
    bedElements.forEach((element) => {
      if (element.textContent.includes("Bed")) {
        const bedrooms = property.beds || property.bedrooms || property.bedroomCount || 0;
        element.innerHTML = `${bedrooms}<!-- -->\n                        Bed`;
      }
    });

    const bathElements = document.querySelectorAll("span") || [];
    bathElements.forEach((element) => {
      if (element.textContent.includes("Bath")) {
        const bathrooms = property.bathrooms || property.baths || property.bathroomCount || 0;
        element.innerHTML = `${bathrooms}<!-- -->\n                        Bath`;
      }
    });

    // Update guests max attribute and label
    const maxGuests = property.accommodates || property.guests || 12;
    const guestsInput =
      document.querySelector("[data-booking-guests]") ||
      document.querySelector(".booking-guests") ||
      document.getElementById("booking-guests");
    if (guestsInput) {
      guestsInput.max = maxGuests;
    }

    // Update guests label to show max guests
    const guestsLabel =
      document.querySelector('label[for=":Rtaqlbbbbbb5da:-form-item"]') ||
      document.querySelector(".guests-label") ||
      document.querySelector("label");
    if (guestsLabel && guestsLabel.textContent.includes("Guests")) {
      guestsLabel.textContent = `Guests (Max ${maxGuests})`;
    }

    // Calculate and display pricing
    if (property.prices) {
      updatePricingDisplay(
        property,
        parseInt(
          document.querySelector("[data-booking-nights]")?.textContent || "1",
        ),
      );
    }

    console.log("Property information updated", {
      maxGuests,
      beds: property.bedrooms,
      baths: property.bathrooms,
    });
  } catch (error) {
    console.error("Error updating property info:", error);
  }
}

function updatePricingDisplay(property, nights) {
  try {
    // Debug the full property structure
    console.log("Full property object:", property);
    console.log("Property.prices:", property.prices);
    console.log("Property.prices.cleaningFee:", property.prices?.cleaningFee);
    console.log("Property.cleaningFee:", property.cleaningFee);

    const basePrice =
      property.prices.basePrice || property.basePrice || property.price || 0;
    const cleaningFee =
      property.prices.cleaningFee || property.cleaningFee || 0;

    // Log cleaning fee for debugging
    console.log("Cleaning fee from API:", cleaningFee);
    console.log("Base price from API:", basePrice);

    // Calculate totals
    const accommodationTotal = basePrice * nights;
    const damageWaiver = accommodationTotal * 0.05;
    const taxRate = 0.08; // 8%
    const taxAmount =
      (accommodationTotal + cleaningFee + damageWaiver) * taxRate;
    const processingFee =
      (accommodationTotal + cleaningFee + damageWaiver + taxAmount) * 0.029 +
      0.3;
    const total =
      accommodationTotal +
      cleaningFee +
      damageWaiver +
      taxAmount +
      processingFee;

    // Format currency
    function formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    // Update pricing elements
    const priceElements = {
      "base-price": formatCurrency(basePrice),
      "accommodation-total": formatCurrency(accommodationTotal),
      "cleaning-fee": formatCurrency(cleaningFee),
      "damage-waiver": formatCurrency(damageWaiver),
      "tax-amount": formatCurrency(taxAmount),
      "processing-fee": formatCurrency(processingFee),
      "total-amount": formatCurrency(total),
    };

    console.log("Formatted cleaning fee:", priceElements["cleaning-fee"]);

    Object.entries(priceElements).forEach(([selector, value]) => {
      const elements =
        document.querySelectorAll(`[data-${selector}]`) ||
        document.querySelectorAll(`.${selector}`);
      elements.forEach((element) => {
        if (element) element.textContent = value;
      });
    });

    console.log("Pricing display updated", { taxRate: taxRate * 100 });
  } catch (error) {
    console.error("Error updating pricing display:", error);
  }
}

// Form submission handler
function handleReserveSubmit(event) {
  event.preventDefault();

  // Get booking data
  const urlParams = new URLSearchParams(window.location.search);
  const bookingData = {
    propertyId: urlParams.get("id"),
    nights: urlParams.get("nights"),
    guests: urlParams.get("guests"),
    // Add form fields as needed
  };

  console.log("Reserve form submitted:", bookingData);

  // Here you would typically send this to your booking API
  // For now, just show a success message
  alert("Booking request submitted! We will contact you soon.");
}

// Add form submission listener
document.addEventListener("DOMContentLoaded", () => {
  console.log('🔧 DOM loaded, setting up form listener...');
  
  const reserveForm =
    document.querySelector("#reserve-form") ||
    document.querySelector(".reserve-form") ||
    document.querySelector('form[id="details"]');

  console.log('📝 Reserve form found:', reserveForm);

  if (reserveForm) {
    reserveForm.addEventListener("submit", function (event) {
      console.log('🚀 Form submit event triggered!');
      event.preventDefault();
      
      console.log('📊 About to populate dropbox data...');
      // Populate dropbox with booking details
      populateDropboxData();
      
      // Hide the details form
      const detailsForm = document.getElementById('details');
      if (detailsForm) {
        detailsForm.style.display = 'none';
        console.log('✅ Details form hidden');
      } else {
        console.log('❌ Details form not found');
      }
      
      // Show the dropbox section
      const dropboxSection = document.getElementById('dropbox');
      if (dropboxSection) {
        dropboxSection.style.display = 'block';
        console.log('✅ Dropbox section shown');
      } else {
        console.log('❌ Dropbox section not found');
      }
      
      console.log("🎉 Form submission complete - showing dropbox, hiding details form");
    });
  } else {
    console.log('❌ No reserve form found!');
  }
});

// Function to populate dropbox with booking and property data
function populateDropboxData() {
  try {
    console.log('🚀 Starting dropbox data population...');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("id") || '';
    const nights = urlParams.get("nights") || '';
    const guests = urlParams.get("guests") || '';
    
    console.log('📋 URL Parameters:', { propertyId, nights, guests });
    
    // Get form data
    const formData = {};
    const form = document.getElementById('details');
    console.log('📝 Form found:', form);
    
    if (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      console.log('🔍 Found inputs:', inputs.length);
      inputs.forEach(input => {
        const value = input.value || '';
        const name = input.name || input.id || input.className;
        formData[name] = value;
        console.log(`📊 Input ${name}: "${value}"`);
      });
    }
    
    // Get property data from window (if available from previous fetch)
    const propertyData = window.propertyData || {};
    console.log('🏠 Property data:', propertyData);
    
    // Get pricing data from the page
    const pricingData = {
      nights: document.querySelector('[data-booking-nights]')?.textContent || '',
      basePrice: document.querySelector('[data-base-price]')?.textContent || '',
      accommodationTotal: document.querySelector('[data-accommodation-total]')?.textContent || '',
      cleaningFee: document.querySelector('[data-cleaning-fee]')?.textContent || '',
      processingFee: document.querySelector('[data-processing-fee]')?.textContent || '',
      damageWaiver: document.querySelector('[data-damage-waiver]')?.textContent || '',
      taxAmount: document.querySelector('[data-tax-amount]')?.textContent || '',
      totalAmount: document.querySelector('[data-total-amount]')?.textContent || ''
    };
    
    console.log('💰 Pricing data:', pricingData);
    
    // Create booking summary object
    const bookingSummary = {
      property: {
        id: propertyId,
        name: propertyData.title || propertyData.nickname || '',
        address: propertyData.address || {},
        beds: propertyData.beds || '',
        bathrooms: propertyData.bathrooms || '',
        accommodates: propertyData.accommodates || ''
      },
      booking: {
        nights: nights,
        guests: guests,
        checkIn: formData.checkIn || '',
        checkOut: formData.checkOut || '',
        nightlyRate: pricingData.basePrice,
        accommodationTotal: pricingData.accommodationTotal,
        cleaningFee: pricingData.cleaningFee,
        processingFee: pricingData.processingFee,
        damageWaiver: pricingData.damageWaiver,
        taxAmount: pricingData.taxAmount,
        totalAmount: pricingData.totalAmount
      },
      guest: {
        name: formData.firstName && formData.lastName ? 
               `${formData.firstName.trim()} ${formData.lastName.trim()}` : 
               (formData.guestName || ''),
        email: formData.email || '',
        phone: formData.phone || ''
      }
    };
    
    // Store booking data for potential use
    window.bookingData = bookingSummary;
    
    console.log('✅ Dropbox data populated:', bookingSummary);
    
    // Populate the HTML elements with the data
    populateBookingDocuments(bookingSummary);
    
  } catch (error) {
    console.error('❌ Error populating dropbox data:', error);
  }
}

// Function to populate HTML documents with booking data
function populateBookingDocuments(bookingData) {
  try {
    console.log('📄 Populating booking documents...');
    
    // Populate booking confirmation table using specific classnames
    const guestNameElement = document.querySelector('.guest-name');
    if (guestNameElement && bookingData.guest.name) {
      guestNameElement.textContent = bookingData.guest.name;
      console.log('✅ Guest name updated:', bookingData.guest.name);
    }
    
    const propertyAddressElement = document.querySelector('.property-address');
    if (propertyAddressElement && bookingData.property.address) {
      const address = `${bookingData.property.address.city || ''}, ${bookingData.property.address.state || ''}`.trim();
      propertyAddressElement.textContent = address || '';
      console.log('✅ Property address updated:', address);
    }
    
    const checkDatesElement = document.querySelector('.check-dates');
    if (checkDatesElement) {
      const dates = bookingData.booking.checkIn && bookingData.booking.checkOut ? 
                    `${bookingData.booking.checkIn} - ${bookingData.booking.checkOut}` : '';
      checkDatesElement.textContent = dates;
      console.log('✅ Check-in/out dates updated:', dates);
    }
    
    const guestsCountElement = document.querySelector('.guests-count');
    if (guestsCountElement) {
      guestsCountElement.textContent = bookingData.booking.guests || '';
      console.log('✅ Guests count updated:', bookingData.booking.guests);
    }
    
    const nightlyRateElement = document.querySelector('.nightly-rate');
    if (nightlyRateElement) {
      nightlyRateElement.textContent = bookingData.booking.nightlyRate || '';
      console.log('✅ Nightly rate updated:', bookingData.booking.nightlyRate);
    }
    
    const stayLengthElement = document.querySelector('.stay-length');
    if (stayLengthElement) {
      const stayLength = bookingData.booking.nights ? `${bookingData.booking.nights} Nights` : '';
      stayLengthElement.textContent = stayLength;
      console.log('✅ Length of stay updated:', stayLength);
    }
    
    const taxAmountElement = document.querySelector('.tax-amount');
    if (taxAmountElement) {
      taxAmountElement.textContent = bookingData.booking.taxAmount || '';
      console.log('✅ Tax amount updated:', bookingData.booking.taxAmount);
    }
    
    const cleaningFeeElement = document.querySelector('.cleaning-fee');
    if (cleaningFeeElement) {
      cleaningFeeElement.textContent = bookingData.booking.cleaningFee || '';
      console.log('✅ Cleaning fee updated:', bookingData.booking.cleaningFee);
    }
    
    const processingFeeElement = document.querySelector('.processing-fee');
    if (processingFeeElement) {
      processingFeeElement.textContent = bookingData.booking.processingFee || '';
      console.log('✅ Processing fee updated:', bookingData.booking.processingFee);
    }
    
    const totalAmountElement = document.querySelector('.total-amount');
    if (totalAmountElement) {
      totalAmountElement.textContent = bookingData.booking.totalAmount || '';
      console.log('✅ Total amount updated:', bookingData.booking.totalAmount);
    }
    
    const securityDepositElement = document.querySelector('.security-deposit');
    if (securityDepositElement) {
      securityDepositElement.textContent = '$0';
      console.log('✅ Security deposit updated: $0');
    }
    
    const paymentStatusElement = document.querySelector('.payment-status');
    if (paymentStatusElement) {
      paymentStatusElement.textContent = 'PENDING';
      console.log('✅ Payment status updated: PENDING');
    }
    
    // Populate footer guest name in the first document
    const footerGuestNameElement = document.querySelector('.footer-guest-name');
    if (footerGuestNameElement && bookingData.guest.name) {
      footerGuestNameElement.textContent = `GUEST NAME: &nbsp; ${bookingData.guest.name}`;
      console.log('✅ Footer guest name updated:', bookingData.guest.name);
    }
    
    // Populate rental agreement guest name
    const rentalGuestNameElement = document.querySelector('.rental-guest-name');
    if (rentalGuestNameElement && bookingData.guest.name) {
      rentalGuestNameElement.textContent = bookingData.guest.name;
      console.log('✅ Rental agreement guest name updated:', bookingData.guest.name);
    }
    
    // Populate signature section guest name
    const signatureGuestNameElement = document.querySelector('.signature-guest-name');
    if (signatureGuestNameElement && bookingData.guest.name) {
      signatureGuestNameElement.textContent = bookingData.guest.name;
      console.log('✅ Signature guest name updated:', bookingData.guest.name);
    }
    
    // Populate signature section phone
    const signaturePhoneElement = document.querySelector('.signature-phone');
    if (signaturePhoneElement && bookingData.guest.phone) {
      signaturePhoneElement.textContent = `Phone # (during stay): ${bookingData.guest.phone}`;
      console.log('✅ Signature phone updated:', bookingData.guest.phone);
    }
    
    console.log('📋 All booking documents populated successfully!');
    
  } catch (error) {
    console.error('❌ Error populating booking documents:', error);
  }
}
