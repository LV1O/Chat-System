module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Add the specPattern to match your test files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',  // This ensures Cypress detects .cy.ts files

    // Ensure Cypress knows where your Angular app is running
    baseUrl: 'http://localhost:4200',  // This should match your Angular app's URL
  },
};
