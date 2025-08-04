describe('Smoke Test', () => {
  it('should load the homepage successfully', () => {
    const baseUrl = Cypress.config('baseUrl');
    cy.visit(baseUrl);
    cy.get('body').should('be.visible');
  });

  it('should display the main dashboard elements', () => {
    cy.visit('/');

    // Check for main dashboard sections
    cy.contains('Dashboard Metrics').should('be.visible');
    cy.contains('Visualization').should('be.visible');
    cy.contains('Entity Details').should('be.visible');
    cy.contains('Entity List').should('be.visible');
  });

  it('should show the header with logo and title', () => {
    cy.visit('/');

    // Check header elements
    cy.get('header').should('be.visible');
    cy.get('img[alt="Wraithwatch"]').should('be.visible');
    cy.contains('Wraithwatch').should('be.visible');
  });

  it('should display the chat button', () => {
    cy.visit('/');

    // Check for chat button
    cy.get('button[aria-label="Open chat with Nazgul"]').should('be.visible');
  });

  it('should show loading states initially', () => {
    cy.visit('/');

    // Initially should show loading states
    cy.get('[class*="animate-pulse"]').should('exist');
  });

  it('should be responsive on different screen sizes', () => {
    cy.visit('/');

    // Test mobile viewport
    cy.viewport('iphone-x');
    cy.get('header').should('be.visible');

    // Test desktop viewport
    cy.viewport(1920, 1080);
    cy.get('header').should('be.visible');
  });
});
