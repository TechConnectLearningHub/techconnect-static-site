/* =========================================================
   MAIN APPLICATION ENTRY POINT
========================================================= */
/*
  Wait until the full HTML document has loaded
  before running any JavaScript functionality.
*/
document.addEventListener("DOMContentLoaded", async function () {

  /* =====================================================
     SECTION FILE CONFIGURATION
  ===================================================== */
  /*
    Array format:
    [placeholder-div-id, html-file-path]

    Each HTML file will be dynamically loaded
    into its matching placeholder div.
  */
  const sectionFiles = [

    ["areas-section", "./resources/sections/areas.html"],

    ["mission-section", "./resources/sections/mission.html"],

    ["team-section", "./resources/sections/team.html"],

    ["audience-section", "./resources/sections/audience.html"],

    ["topics-section", "./resources/sections/topics.html"],

    /* ============================================
      RESOURCES SECTION
    ============================================ */

    ["partners-section", "./resources/sections/partners.html"],

    ["contact-section", "./resources/sections/contact.html"]

  ];

  /* =====================================================
     DYNAMIC SECTION LOADER
  ===================================================== */
  /*
    Loop through every configured section
    and inject external HTML content.
  */
  /* Use a small, testable loader function so fetch can be mocked in tests */
  for (const [targetId, filePath] of sectionFiles) {
    await window.loadSectionFile(targetId, filePath);
  }

  /* =====================================================
     INITIALISE SITE FEATURES
  ===================================================== */

  /*
    Initialise accordion/collapsible sections
  */
  initialiseAccordions();

  /*
    Initialise navigation links using data-section
  */
  initialiseNavigationLinks();

  /*
    Initialise mobile side menu
  */
  initialiseMobileMenu();

  initialiseContactForm();

  /* =====================================================
     HANDLE DIRECT URL HASHES
  ===================================================== */
  /*
    Example:
    #mission
    #contact

    Automatically opens matching accordion section.
  */
 /* Remove ANY hash so page does NOT auto-scroll */
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

  /*
    Find all collapsible sections
    using the details element.
  */
  const accordions =
    document.querySelectorAll("details.content-section");

  /* =====================================================
     ALLOW ONLY ONE OPEN SECTION
  ===================================================== */
  accordions.forEach((section) => {

    section.addEventListener("toggle", function () {

      /*
        If current section opens,
        close all other sections.
      */
      if (section.open) {

        accordions.forEach((other) => {

          if (other !== section) {

            other.removeAttribute("open");

          }

        });

      }

    });

  });

  /* =====================================================
     GLOBAL SECTION OPEN FUNCTION
  ===================================================== */
  /*
    Allows navigation buttons
    to open accordion sections.
  */
  window.openSection = function (id) {

    /* Find target accordion */
    const target = document.getElementById(id);

    /* Stop if section missing */
    if (!target) return;

    /* Close all other accordions */
    accordions.forEach((section) => {

      if (section !== target) {

        section.removeAttribute("open");

      }

    });

    /* Open selected accordion */
    if (target.tagName.toLowerCase() === "details") {

      target.setAttribute("open", "");

    }

    /* Smooth scroll to section */
    setTimeout(() => {

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);

  };

}

/* =========================================================
   Helper: load a single section file into a placeholder
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

    /* If we just injected the contact section, initialise contact behaviour */
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

  /*
    Find all elements using:
    data-section="mission"
  */
  document.querySelectorAll("[data-section]").forEach((link) => {

    /* Add click listener */
    link.addEventListener("click", function (event) {

      /* Prevent normal anchor navigation */
      event.preventDefault();

      /* Read section id from data attribute */
      const sectionId = this.dataset.section;

      /* Stop if missing */
      if (!sectionId) return;

      /* Open matching accordion */
      openSection(sectionId);

      /* Close mobile menu if open */
      closeMobileMenu();

    });

  });

}

/* =========================================================
   MOBILE MENU INITIALISATION
========================================================= */
function initialiseMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const toggleButtons = document.querySelectorAll("[data-mobile-menu-toggle]");
  const closeLinks = document.querySelectorAll("[data-mobile-close]");
  const dropdown = document.querySelector(".mobile-dropdown");
  const dropdownToggle = document.querySelector(".mobile-dropdown-toggle");

  if (!mobileMenu) return;

  function openMobileMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");

    const btn = document.querySelector(".mobile-menu-btn");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  window.closeMobileMenu = function () {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");

    const btn = document.querySelector(".mobile-menu-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  };

  window.toggleMobileMenu = function () {
    if (mobileMenu.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  toggleButtons.forEach((button) => {
    button.addEventListener("click", toggleMobileMenu);
  });

  closeLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", function () {
      const isOpen = dropdown.classList.toggle("open");
      dropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
}

/* =========================================================
   CLOSE MOBILE MENU
========================================================= */
function closeMobileMenu() {

  /* Find mobile menu */
  const mobileMenu =
    document.getElementById("mobileMenu");

  /* Stop if menu missing */
  if (!mobileMenu) return;

  /* Remove open class */
  mobileMenu.classList.remove("open");

  /* Reflect state for assistive tech */
  mobileMenu.setAttribute('aria-hidden', 'true');

  /* Update hamburger button aria-expanded */
  const btn = document.querySelector('.mobile-menu-btn');
  if (btn) btn.setAttribute('aria-expanded', 'false');

}


/* =========================================================
   CONTACT FORM HANDLER
   
   TWO CHANGES NEEDED IN main.js:
   
   1. Inside the section loader for..of loop, after this line:
         target.innerHTML = await response.text();
      Add:
         if (targetId === "contact-section") {
           initialiseContactForm();
         }

   2. Add this full function at the bottom of main.js.
========================================================= */

function initialiseContactForm() {

  const btn = document.getElementById("ct-submit-btn");

  if (!btn) {
    console.warn("Contact form button not found.");
    return;
  }
  /* sanitizes input by stripping tags - safe for mailto body */
  function sanitizeInput(str) {
    if (!str) return "";
    return String(str).replace(/<[^>]*>?/gm, '');
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

    /* Validate email presence */
    if (!email) {
      alert("Please enter your email address.");
      if (emailInput) emailInput.focus();
      return;
    }

    /* Basic email format check */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      if (emailInput) emailInput.focus();
      return;
    }

    /* Validate reason */
    if (!reason) {
      alert("Please select a reason for reaching out.");
      if (reasonInput) reasonInput.focus();
      return;
    }

    /* Build mailto */
    const subject = "TechConnect Enquiry: " + reason;

    let body = "";
    if (name)    body += "Name: "    + name    + "\n";
                 body += "Email: "   + email   + "\n";
                 body += "Reason: "  + reason  + "\n\n";
    if (message) body += "Message:\n" + message;

    const mailto = "mailto:hello@techconnectlearninghub.org"
                 + "?subject=" + encodeURIComponent(subject)
                 + "&body="    + encodeURIComponent(body);

    /* Use location assign to enable tests to stub window.location */
    window.location.href = mailto;

  });

}