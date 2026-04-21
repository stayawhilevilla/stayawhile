// Reserve page rendering functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get("id");
  const nights = urlParams.get("nights");
  const guests = urlParams.get("guests");

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

    console.log("Booking summary updated");
  } catch (error) {
    console.error("Error updating booking summary:", error);
  }
}

async function loadPropertyDetails(propertyId) {
  try {
    // Fetch property data from API
    const response = await fetch(
      `/api/properties/${propertyId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to load property details");
    }

    const property = await response.json();
    console.log("Full address:", property.address.full);
    
    // Store property data globally for later use
    window.propertyData = property;

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
    const imageElements =
      document.querySelectorAll("[data-property-image]") ||
      document.querySelectorAll(".property-image");
    
    imageElements.forEach((element, index) => {
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
        // For img elements
        if (element.tagName === "IMG") {
          element.src = imageUrl;
          element.alt = property.title || property.nickname || "Property image";
        }
        // For div elements with background images
        else {
          element.style.backgroundImage = `url(${imageUrl})`;
          element.style.backgroundSize = "cover";
          element.style.backgroundPosition = "center";
        }
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

    console.log("Property information updated");
  } catch (error) {
    console.error("Error updating property info:", error);
  }
}

function updatePricingDisplay(property, nights) {
  try {
    const basePrice =
      property.prices.basePrice || property.basePrice || property.price || 0;
    const cleaningFee =
      property.prices.cleaningFee || property.cleaningFee || 0;

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

    Object.entries(priceElements).forEach(([selector, value]) => {
      const elements =
        document.querySelectorAll(`[data-${selector}]`) ||
        document.querySelectorAll(`.${selector}`);
      elements.forEach((element) => {
        if (element) element.textContent = value;
      });
    });
  } catch (error) {
    console.error("Error updating pricing display:", error);
  }
}

function handleReserveSubmit(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const bookingData = {
    propertyId: urlParams.get("id"),
    nights: urlParams.get("nights"),
    guests: urlParams.get("guests"),
  };

  alert("Booking request submitted! We will contact you soon.");
}

document.addEventListener("DOMContentLoaded", () => {
  const reserveForm =
    document.querySelector("#reserve-form") ||
    document.querySelector(".reserve-form") ||
    document.querySelector('form[id="details"]');

  if (reserveForm) {
    reserveForm.addEventListener("submit", function (event) {
      event.preventDefault();
      
      populateDropboxData();
      
      const detailsForm = document.getElementById('details');
      if (detailsForm) {
        detailsForm.style.display = 'none';
      }
      
      // Show the dropbox section
      const dropboxSection = document.getElementById('dropbox');
      if (dropboxSection) {
        dropboxSection.style.display = 'block';
        
        // Gradual smooth scroll for mobile compatibility
        setTimeout(() => {
          // Check if mobile device
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          
          if (isMobile) {
            // Mobile: Use gradual scroll animation
            const startPosition = window.pageYOffset;
            const distance = -startPosition;
            const duration = 800; // 800ms for smooth gradual scroll
            
            let start = null;
            function animation(currentTime) {
              if (start === null) start = currentTime;
              const timeElapsed = currentTime - start;
              const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
              window.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            // Easing function for smooth animation
            function easeInOutQuad(t, b, c, d) {
              t /= d/2;
              if (t < 1) return c/2*t*t + b;
              t--;
              return -c/2 * (t*(t-2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
          } else {
            // Desktop: Use smooth scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          
          // Fallback instant scroll
          setTimeout(() => {
            if (window.pageYOffset > 0) {
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }
          }, 1000);
        }, 150);
      }
    });
  }
});

function populateDropboxData() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("id") || '';
    const nights = urlParams.get("nights") || '';
    const guests = urlParams.get("guests") || '';
    const arrival = urlParams.get("arrival") || '';
    const departure = urlParams.get("departure") || '';
    
    const formData = {};
    const form = document.getElementById('details');
    
    if (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const value = input.value || '';
        const name = input.name || input.id || input.className;
        formData[name] = value;
      });
    }
    
    const propertyData = window.propertyData || {};
    
    const pricingData = {
      basePrice: document.querySelector('[data-base-price]')?.textContent || '',
      accommodationTotal: document.querySelector('[data-accommodation-total]')?.textContent || '',
      cleaningFee: document.querySelector('[data-cleaning-fee]')?.textContent || '',
      damageWaiver: document.querySelector('[data-damage-waiver]')?.textContent || '',
      taxAmount: document.querySelector('[data-tax-amount]')?.textContent || '',
      processingFee: document.querySelector('[data-processing-fee]')?.textContent || '',
      totalAmount: document.querySelector('[data-total-amount]')?.textContent || ''
    };
    
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
        checkIn: arrival || formData.checkIn || '',
        checkOut: departure || formData.checkOut || '',
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
    
    window.bookingData = bookingSummary;
    
    populateBookingDocuments(bookingSummary);
    
  } catch (error) {
    console.error('❌ Error populating dropbox data:', error);
  }
}

function populateBookingDocuments(bookingData) {
  try {
    const guestNameElement = document.querySelector('.guest-name');
    if (guestNameElement && bookingData.guest.name) {
      guestNameElement.textContent = bookingData.guest.name;
    }
    
    const propertyAddressElement = document.querySelector('.property-address');
    console.log(window.propertyData)
    if (propertyAddressElement && window.propertyData && window.propertyData.address) {
      propertyAddressElement.textContent = window.propertyData.address.full;
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
      footerGuestNameElement.textContent = `GUEST NAME:  ${bookingData.guest.name}`;
      console.log('✅ Footer guest name updated:', bookingData.guest.name);
    }
    
    // Populate footer date
    const footerDateElement = document.querySelector('.footer p:nth-child(3)');
    if (footerDateElement) {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      footerDateElement.textContent = `DATE: ${currentDate}`;
      console.log('✅ Footer date updated:', currentDate);
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
    
    // Populate signature section date
    const signatureDateElement = document.querySelector('.signature-phone').previousElementSibling;
    if (signatureDateElement && signatureDateElement.textContent.includes('Date:')) {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      signatureDateElement.textContent = `Date: ${currentDate}`;
      console.log('✅ Signature date updated:', currentDate);
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
