describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('includes correct path', () => {
    cy.url().should('include', '/news/1');
  });

  it('should contain correct elements', () => {
    cy.get('.home-img').should('exist');
    cy.get('.home').should('have.text', 'Easter Egg');
    cy.get('.games-nav').should('have.text', 'Games');
    cy.get('.contact-nav').should('have.text', 'Contact');
    cy.get('.about-nav').should('have.text', 'About');
    cy.get('input').should('have.value', '');
    cy.get('button').should('exist');
    cy.get('.search-container').should('exist');
    cy.get('.nav').find('.signin').should('have.text', 'Sign In');
  });
});
