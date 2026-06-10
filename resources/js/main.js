/* =========================================================
   MAIN APPLICATION ENTRY POINT
========================================================= */
document.addEventListener("DOMContentLoaded", async function () {

  /* =====================================================
     SECTION FILE CONFIGURATION
  ===================================================== */
  const sectionFiles = [
    ["areas-section",    "./resources/sections/areas.html"],
    ["mission-section",  "./resources/sections/mission.html"],
    ["team-section",     "./resources/sections/team.html"],
    ["audience-section", "./resources/sections/audience.html"],
    ["topics-section",   "./resources/sections/topics.html"],
    ["partners-section", "./resources/sections/partners.html"],
    ["contact-section",  "./resources/sections/contact.html"]
  ];

  /* =====================================================
     DYNAMIC SECTION LOADER
  ===================================================== */
  for (const [targetId, filePath] of sectionFiles) {
    await window.loadSectionFile(targetId, filePath);
  }

  /* =====================================================
     INITIALISE SITE FEATURES
  ===================================================== */
  initialiseAccordions();
  initialiseNavigationLinks();
  initialiseMobileMenu();
  initialiseContactForm();

  /* =====================================================
     HANDLE DIRECT URL HASHES
  ===================================================== */
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    setTimeout(() => {
      openSection(hash);
    }, 250);
  }

});

/* =========================================================
   ACCORDION SECTION FUNCTIONALITY
========================================================= */
function initialiseAccordions() {

  const accordions = document.querySelectorAll("details.content-section");

  accordions.forEach((section) => {
    section.addEventListener("toggle", function () {
      if (section.open) {
        accordions.forEach((other) => {
          if (other !== section) {
            other.removeAttribute("open");
          }
        });
      }
    });
  });

  window.openSection = function (id) {
    const target = document.getElementById(id);
    if (!target) return;

    accordions.forEach((section) => {
      if (section !== target) {
        section.removeAttribute("open");
      }
    });

    if (target.tagName.toLowerCase() === "details") {
      target.setAttribute("open", "");
    }

    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

}

/* =========================================================
   HELPER: LOAD A SINGLE SECTION FILE INTO A PLACEHOLDER
   Exposed on window for testing/mocking.
========================================================= */
window.loadSectionFile = async function (targetId, filePath) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      console.error(`Failed to load ${filePath}: ${response.status}`);
      return;
    }
    target.innerHTML = await response.text();

    if (targetId === "contact-section") {
      initialiseContactForm();
    }

  } catch (err) {
    console.error(`Error loading ${filePath}:`, err);
  }
};

/* =========================================================
   NAVIGATION LINK HANDLERS
========================================================= */
function initialiseNavigationLinks() {

  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionId = this.dataset.section;
      if (!sectionId) return;
      openSection(sectionId);
      closeMobileMenu();
    });
  });

}

/* =========================================================
   MOBILE MENU INITIALISATION
========================================================= */
function initialiseMobileMenu() {

  document.querySelectorAll("[data-mobile-menu-toggle]").forEach((button) => {
    button.addEventListener("click", function () {
      toggleMobileMenu();
    });
  });

  document.querySelectorAll("[data-mobile-close]").forEach((link) => {
    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });

  document.querySelectorAll(".mobile-dropdown-toggle").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const dropdown = button.closest(".mobile-dropdown");
      if (!dropdown) return;

      const isOpen = dropdown.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  window.toggleMobileMenu = function () {
    const mobileMenu = document.getElementById("mobileMenu");
    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");

    const btn = document.querySelector(".mobile-menu-btn");
    if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };
}

/* =========================================================
   CLOSE MOBILE MENU
========================================================= */
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (!mobileMenu) return;

  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");

  const btn = document.querySelector(".mobile-menu-btn");
  if (btn) btn.setAttribute("aria-expanded", "false");

  document.querySelectorAll(".mobile-dropdown").forEach((dropdown) => {
    dropdown.classList.remove("open");
  });

  document.querySelectorAll(".mobile-dropdown-toggle").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

/* =========================================================
   CONTACT FORM HANDLER
========================================================= */
function initialiseContactForm() {

  const btn = document.getElementById("ct-submit-btn");
  if (!btn) {
    console.warn("Contact form button not found.");
    return;
  }

  function sanitizeInput(str) {
    if (!str) return "";
    return String(str).replace(/<[^>]*>?/gm, "");
  }

  btn.addEventListener("click", function (ev) {
    ev.preventDefault();

    const emailInput  = document.getElementById("ct-email");
    const nameInput   = document.getElementById("ct-name");
    const reasonInput = document.getElementById("ct-reason");
    const msgInput    = document.getElementById("ct-message");

    const email   = emailInput  ? sanitizeInput(emailInput.value.trim())  : "";
    const name    = nameInput   ? sanitizeInput(nameInput.value.trim())   : "";
    const reason  = reasonInput ? sanitizeInput(reasonInput.value)        : "";
    const message = msgInput    ? sanitizeInput(msgInput.value.trim())    : "";

    if (!email) {
      alert("Please enter your email address.");
      if (emailInput) emailInput.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      if (emailInput) emailInput.focus();
      return;
    }

    if (!reason) {
      alert("Please select a reason for reaching out.");
      if (reasonInput) reasonInput.focus();
      return;
    }

    const subject = "TechConnect Enquiry: " + reason;

    let body = "";
    if (name)    body += "Name: "    + name    + "\n";
                 body += "Email: "   + email   + "\n";
                 body += "Reason: "  + reason  + "\n\n";
    if (message) body += "Message:\n" + message;

    const mailto = "mailto:hello@techconnectlearninghub.org"
                 + "?subject=" + encodeURIComponent(subject)
                 + "&body="    + encodeURIComponent(body);

    window.location.href = mailto;
  });

}