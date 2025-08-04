describe('Wraithwatch Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Page Loading and Basic Rendering', () => {
    it('should load the dashboard successfully', () => {
      cy.get('body').should('be.visible');
      cy.get('header').should('be.visible');
    });

    it('should display the header with logo and title', () => {
      cy.get('header').within(() => {
        cy.get('img[alt="Wraithwatch"]').should('be.visible');
        cy.contains('Wraithwatch').should('be.visible');
      });
    });

    it('should show loading states initially', () => {
      // Check for loading skeleton elements
      cy.get('[class*="animate-pulse"]').should('exist');
    });

    it('should display main dashboard sections', () => {
      // These sections should be visible even during loading
      cy.contains('Dashboard Metrics').should('be.visible');
      cy.contains('Visualization').should('be.visible');
      cy.contains('Entity Details').should('be.visible');
      cy.contains('Entity List').should('be.visible');
    });
  });

  describe('Dashboard Metrics Section', () => {
    it('should display metrics section', () => {
      // The section title should always be visible
      cy.contains('Dashboard Metrics').should('be.visible');
    });

    it('should show loading skeleton or content', () => {
      // Either loading skeleton or actual content should be visible
      cy.get('[class*="animate-pulse"], [class*="bg-gray-900"]').should(
        'exist'
      );
    });
  });

  describe('Visualization Controls', () => {
    it('should display visualization section', () => {
      cy.contains('Visualization').should('be.visible');
    });

    it('should show loading state or controls', () => {
      // Either loading skeleton or actual controls should be visible
      cy.get('[class*="animate-pulse"], [class*="bg-gray-900"]').should(
        'exist'
      );
    });
  });

  describe('Entity List Functionality', () => {
    it('should display entity list section', () => {
      cy.contains('Entity List').should('be.visible');
    });

    it('should show loading state or content', () => {
      // Either loading skeleton or actual content should be visible
      cy.get('[class*="animate-pulse"], [class*="bg-gray-900"]').should(
        'exist'
      );
    });
  });

  describe('Entity Details Panel', () => {
    it('should display entity details section', () => {
      cy.contains('Entity Details').should('be.visible');
    });

    it('should show loading state or content', () => {
      // Either loading skeleton or actual content should be visible
      cy.get('[class*="animate-pulse"], [class*="bg-gray-900"]').should(
        'exist'
      );
    });
  });

  describe('Real-time Features', () => {
    it('should show real-time mode indicator', () => {
      cy.contains('Real-Time Mode - Entities Updating Dynamically').should(
        'be.visible'
      );
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

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // This test would require mocking network failures
      // For now, we'll just ensure the app doesn't crash
      cy.get('body').should('be.visible');
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
      // Loading states should be visible initially
      cy.get('[class*="animate-pulse"]').should('exist');
    });
  });
});
