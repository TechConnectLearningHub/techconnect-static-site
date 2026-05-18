/**
 * ============================================
 * MAIN APPLICATION LOGIC
 * ============================================
 * 
 * This file handles:
 * - Dynamic section loading from HTML files
 * - Accordion/collapsible section interactions
 * - Mobile menu toggle functionality
 * 
 * @author TechConnect Learning Hub
 * @version 1.0.0
 */

/**
 * ============================================
 * SECTION LOADER: Initialize When DOM Ready
 * ============================================
 * 
 * Waits for DOM to fully load, then fetches and
 * injects external HTML sections into the main page
 */
document.addEventListener("DOMContentLoaded", async function () {

  /**
   * Array of section configurations
   * Each entry: [HTML Element ID, File Path]
   * 
   * These divs are placeholders that get populated
   * with external HTML content from the resources/sections folder
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

  /**
   * LOAD EACH HTML SECTION INTO THE PAGE
   * 
   * Iterates through each section file and:
   * 1. Finds the target placeholder div
   * 2. Fetches the external HTML file
   * 3. Injects the content into the placeholder
   * 4. Logs errors if fetch fails
   */
  for (const [targetId, filePath] of sectionFiles) {

    // Find the placeholder container div in the DOM
    const target = document.getElementById(targetId);

    // Skip if placeholder div doesn't exist
    if (!target) continue;

    try {
      // Fetch the external HTML file
      const response = await fetch(filePath);

      // Handle HTTP errors
      if (!response.ok) {
        console.error(`Failed to load ${filePath}: ${response.status}`);
        continue;
      }

      // Convert response to text/HTML
      const html = await response.text();

      // Inject section HTML into the target container
      target.innerHTML = html;
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
    }
  }

  /**
   * INITIALIZE INTERACTIVE FEATURES
   * 
   * Set up all interactive components after
   * sections have been loaded
   */
  initialiseAccordions();
  initialiseMobileMenu();

});

/**
 * ============================================
 * ACCORDION FUNCTIONALITY
 * ============================================
 * 
 * Handles collapsible/expandable sections
 * Ensures only one section is open at a time
 */
function initialiseAccordions() {

  /**
   * Find all accordion/collapsible sections
   * 
   * Uses the <details> HTML element with
   * class "content-section"
   */
  const accordions = document.querySelectorAll("details.content-section");

  /**
   * RESTRICT TO ONE OPEN SECTION AT A TIME
   * 
   * When a section opens, automatically closes
   * all other open sections
   */
  accordions.forEach((section) => {

    section.addEventListener("toggle", function () {

      // When current section opens
      if (section.open) {

        // Close all other sections
        accordions.forEach((other) => {
          if (other !== section) {
            other.removeAttribute("open");
          }
        });

      }

    });

  });

  /**
   * OPEN SECTION FROM NAVIGATION MENU
   * 
   * Allows clicking menu links to open specific
   * sections and scroll to them
   */
  window.openSection = function (id) {

    // Find target accordion section by ID
    const target = document.getElementById(id);

    // Stop if section not found
    if (!target) return;

    // Close all other sections
    accordions.forEach((section) => {
      if (section !== target) {
        section.removeAttribute("open");
      }
    });

    // Open the selected accordion
    if (target.tagName.toLowerCase() === "details") {
      target.setAttribute("open", "");
    }

    // Smooth scroll to section with a slight delay
    // to allow accordion to open first
    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

  };

}

/**
 * ============================================
 * MOBILE MENU FUNCTIONALITY
 * ============================================
 * 
 * Handles mobile side menu open/close toggle
 */
function initialiseMobileMenu() {

  /**
   * TOGGLE MOBILE MENU VISIBILITY
   * 
   * Adds or removes the "open" class which
   * slides the menu in from the right
   */
  window.toggleMobileMenu = function () {

    // Find the mobile menu element
    const mobileMenu = document.getElementById("mobileMenu");

    // Stop if menu element not found
    if (!mobileMenu) return;

    // Toggle "open" class to show/hide menu
    mobileMenu.classList.toggle("open");

  };

}