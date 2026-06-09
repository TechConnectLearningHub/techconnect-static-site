const fs = require('fs');

// Helper: load main.js into the jsdom document as if it were a browser script
function loadMainScript() {
  const scriptContent = fs.readFileSync(
    './resources/js/main.js',
    'utf8'
  );

  // Append as a script element so functions attach to the global window
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = scriptContent;
  document.head.appendChild(script);
}

beforeEach(() => {
  // reset DOM
  document.body.innerHTML = '';
});

test('initialiseAccordions allows only one open at a time and openSection works', () => {
  // Setup: two details elements
  const d1 = document.createElement('details');
  d1.className = 'content-section';
  d1.id = 'sec1';
  const d2 = document.createElement('details');
  d2.className = 'content-section';
  d2.id = 'sec2';
  document.body.appendChild(d1);
  document.body.appendChild(d2);

  loadMainScript();

  // initialiseAccordions is defined by the script
  expect(typeof initialiseAccordions).toBe('function');
  initialiseAccordions();

  // Open sec1 programmatically
  d1.setAttribute('open', '');
  // Trigger toggle event
  d1.dispatchEvent(new Event('toggle'));

  // sec2 should be closed
  expect(d2.hasAttribute('open')).toBe(false);

  // Test openSection API
  window.openSection('sec2');
  expect(d2.hasAttribute('open')).toBe(true);
  expect(d1.hasAttribute('open')).toBe(false);
});

test('mobile menu toggle and closeMobileMenu work', () => {
  const mobile = document.createElement('div');
  mobile.id = 'mobileMenu';
  document.body.appendChild(mobile);

  loadMainScript();

  // initialiseMobileMenu should have been defined
  expect(typeof initialiseMobileMenu).toBe('function');
  initialiseMobileMenu();

  // toggleMobileMenu defined on window
  expect(typeof window.toggleMobileMenu).toBe('function');

  // Toggle open
  window.toggleMobileMenu();
  expect(mobile.classList.contains('open')).toBe(true);

  // Close
  closeMobileMenu();
  expect(mobile.classList.contains('open')).toBe(false);
});

test('contact form initialisation builds mailto when form valid', () => {
  // Create form elements expected by initialiseContactForm
  const btn = document.createElement('button');
  btn.id = 'ct-submit-btn';
  document.body.appendChild(btn);

  const email = document.createElement('input');
  email.id = 'ct-email';
  email.value = 'user@example.com';
  document.body.appendChild(email);

  const name = document.createElement('input');
  name.id = 'ct-name';
  name.value = 'Test User';
  document.body.appendChild(name);

  const reason = document.createElement('select');
  reason.id = 'ct-reason';
  const opt = document.createElement('option');
  opt.value = 'support';
  opt.selected = true;
  reason.appendChild(opt);
  document.body.appendChild(reason);

  const message = document.createElement('textarea');
  message.id = 'ct-message';
  message.value = 'Hello world';
  document.body.appendChild(message);

  loadMainScript();

  // Prevent navigation side-effect
  delete window.location;
  window.location = { href: '' };

  // Prevent alert from blocking tests
  window.alert = jest.fn();

  // initialiseContactForm should be available now
  expect(typeof initialiseContactForm).toBe('function');
  initialiseContactForm();

  // Click button
  btn.click();

  // Expect mailto set
  expect(window.location.href.startsWith('mailto:')).toBe(true);
});

test('loadSectionFile fetches and injects HTML into placeholder', async () => {
  // Create placeholder
  const placeholder = document.createElement('div');
  placeholder.id = 'test-section';
  document.body.appendChild(placeholder);

  // Mock fetch to return sample HTML
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    text: () => Promise.resolve('<div>Loaded content</div>')
  }));

  // Ensure loader exists by loading script
  loadMainScript();

  // Call the exposed loader
  await window.loadSectionFile('test-section', './resources/sections/test.html');

  // Expect placeholder to be updated
  expect(placeholder.innerHTML).toContain('Loaded content');

  // Cleanup mock
  global.fetch = undefined;
});
