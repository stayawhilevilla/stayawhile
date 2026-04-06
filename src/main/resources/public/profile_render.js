// profile_render.js - Logic for displaying user data on profile.html

// Helper function to get value or fallback
function val(v) {
  return v && String(v).trim() ? String(v).trim() : null;
}

// Update field display
function setField(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const span = field.querySelector(".field-value");
  if (!span) return;
  if (value) {
    span.textContent = value;
    span.classList.remove("empty");
  } else {
    span.textContent = "Not provided";
    span.classList.add("empty");
  }
}

// Set input value
function setInput(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.tagName === "TEXTAREA") el.value = value || "";
  else el.value = value || "";
}

// Populate page from API user object
function populateUser(u) {
  /* ── Nested objects ── */
  const ci = u.contactInfo || {}; // contactInfo object
  const addr = ci.address || {}; // contactInfo.address object

  /* ── Full name ── */
  const firstName = val(u.firstName) || val(u.first_name) || "";
  const lastName = val(u.lastName) || val(u.last_name) || "";
  const middleName = val(u.middleName) || val(u.middle_name) || "";
  const fullName =
    (firstName + " " + lastName).trim() ||
    val(u.full_name) ||
    val(u.fullName) ||
    val(u.name) ||
    val(u.username) ||
    "User";

  /* ── Basic Information — display fields ── */
  setField("field-name", fullName);
  setField("field-bio", val(u.bio));
  setField("field-gender", val(u.gender));
  setField(
    "field-accessibility",
    val(u.accessibilityNeeds) || val(u.accessibility_needs),
  );

  // Date of birth
  let dobDisplay = null;
  const rawDob = val(u.dateOfBirth) || val(u.date_of_birth);
  if (rawDob) {
    const d = new Date(rawDob);
    dobDisplay = !isNaN(d)
      ? d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : rawDob;
  }
  setField("field-dob", dobDisplay);

  /* ── Contact — read from contactInfo object ── */
  const phone =
    val(ci.mobileNumber) ||
    val(ci.mobile_number) ||
    val(ci.phoneNumber) ||
    val(ci.phone) ||
    val(u.phone) ||
    val(u.mobile);

  const email = val(ci.emailAddress) || val(ci.email) || val(u.email);

  const emergency =
    val(ci.emergencyContactName) ||
    val(ci.emergency_contact_name) ||
    val(ci.emergencyContact) ||
    val(u.emergency_contact);

  const emergencyPhone =
    val(ci.emergencyContactPhone) ||
    val(ci.emergency_contact_phone) ||
    val(ci.emergencyPhone);

  const street =
    val(addr.street) || val(addr.address_line1) || val(addr.line1);
  const street2 =
    val(addr.line2) || val(addr.address_line2) || val(addr.apt);
  const city = val(addr.city);
  const state = val(addr.state);
  const zip =
    val(addr.postalCode) ||
    val(addr.postal_code) ||
    val(addr.zip);

  /* ── Contact display fields ── */
  setField("field-mobile", phone);
  setField("field-email", email);
  setField("field-emergency", emergency);
  setField("field-address", street && city ? `${street}, ${city}` : street || city || null);

  /* ── Contact modal inputs ── */
  setInput("mobile-phone", phone);
  setInput("emergency-name", emergency);
  setInput("emergency-phone", emergencyPhone);
  setInput("address-line1", street);
  setInput("address-line2", street2);
  setInput("address-city", city);
  setInput("address-zip", zip);

  // Email inside contact modal read-only display
  const emailDisplay = document.querySelector(
    '#contact-modal p[style*="font-size:14px"]',
  );
  if (emailDisplay && email) emailDisplay.textContent = email;
}

// Fetch user from API
async function loadUser() {
  try {
    const res = await fetch("/api/users/1", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("[Profile] Raw API response:", data);
    const user = data.data || data.user || data;
    console.log("[Profile] User object used for population:", user);
    window.currentUser = user; // cache for save merging
    populateUser(user);
  } catch (err) {
    console.warn("[Profile] Could not load user from API:", err.message);
  }
}

// PUT the complete user object
async function putUser(mergedUser) {
  const res = await fetch("/api/users/1", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(mergedUser),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${errText}`);
  }
  return res.json().catch(() => ({}));
}

// Helper to get input value
function g(id) {
  return (document.getElementById(id)?.value || "").trim() || null;
}

// Initialize profile page
function initProfilePage() {
  loadUser();
}

// Expose functions globally for HTML access
window.currentUser = {};
window.setField = setField;
window.setInput = setInput;
window.putUser = putUser;
window.val = val;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initProfilePage);
