describe('Connection Status', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Dashboard Loading and Rendering', () => {
    it('should load the dashboard successfully', () => {
      cy.get('body').should('be.visible');
      cy.get('header').should('be.visible');
    });

    it('should display main dashboard sections', () => {
      cy.contains('Dashboard Metrics').should('be.visible');
      cy.contains('Visualization').should('be.visible');
      cy.contains('Entity Details').should('be.visible');
      cy.contains('Entity List').should('be.visible');
    });

    it('should show loading states initially', () => {
      cy.get('[class*="animate-pulse"]').should('exist');
    });
  });

  describe('Real-time Features', () => {
    it('should show real-time mode indicator', () => {
      cy.contains('Real-Time Mode - Entities Updating Dynamically').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.get('header').should('be.visible');
      cy.contains('Wraithwatch Command Center').should('be.visible');
    });

    it('should adapt to desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.get('header').should('be.visible');
      cy.contains('Wraithwatch Command Center').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
    });

    it('should have accessible button elements', () => {
      cy.get('button').should('have.length.at.least', 1);
    });

    it('should have proper alt text for images', () => {
      cy.get('img[alt="Wraithwatch"]').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load within reasonable time', () => {
      cy.visit('/', { timeout: 10000 });
      cy.get('body').should('be.visible');
    });

    it('should show loading states appropriately', () => {
      cy.get('[class*="animate-pulse"]').should('exist');
    });
  });
}); 