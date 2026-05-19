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

    ["values-section", "./resources/sections/values.html"],

    ["approach-section", "./resources/sections/approach.html"],

    ["audience-section", "./resources/sections/audience.html"],

    ["topics-section", "./resources/sections/topics.html"],

    ["team-section", "./resources/sections/team.html"],

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
  for (const [targetId, filePath] of sectionFiles) {

    /* Find placeholder div */
    const target = document.getElementById(targetId);

    /* Skip if div does not exist */
    if (!target) continue;

    try {

      /* Fetch external html file */
      const response = await fetch(filePath);

      /* Handle fetch/http errors */
      if (!response.ok) {

        console.error(
          `Failed to load ${filePath}: ${response.status}`
        );

        continue;
      }

      /* Convert response to html text */
      target.innerHTML = await response.text();

    } catch (error) {

      /* Handle unexpected fetch errors */
      console.error(
        `Error loading ${filePath}:`,
        error
      );

    }

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

  /* =====================================================
     HANDLE DIRECT URL HASHES
  ===================================================== */
  /*
    Example:
    #mission
    #contact

    Automatically opens matching accordion section.
  */
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

  /*
    Toggle menu buttons:
    - Hamburger icon
    - Close icon
  */
  document.querySelectorAll(
    "[data-mobile-menu-toggle]"
  ).forEach((button) => {

    button.addEventListener("click", function () {

      toggleMobileMenu();

    });

  });

  /*
    Mobile menu navigation links
    automatically close menu after click.
  */
  document.querySelectorAll(
    "[data-mobile-close]"
  ).forEach((link) => {

    link.addEventListener("click", function () {

      closeMobileMenu();

    });

  });

  /* =====================================================
     GLOBAL MENU TOGGLE FUNCTION
  ===================================================== */
  window.toggleMobileMenu = function () {

    /* Find mobile menu */
    const mobileMenu =
      document.getElementById("mobileMenu");

    /* Stop if menu missing */
    if (!mobileMenu) return;

    /* Toggle open class */
    mobileMenu.classList.toggle("open");

  };

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

}