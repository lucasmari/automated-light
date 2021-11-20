describe('Navigation', () => {
  before(() => {
    cy.visit('/');
  });

  // Games
  it('successfully navigates to Games', () => {
    cy.get('.games-nav').click();
    cy.url().should('include', '/games');
  });

  it('should contain correct elements', () => {
    cy.get('h1').contains('Games');
    cy.get(':nth-child(1) > div > h3').should('have.text', 'Portal 2');
    cy.get(':nth-child(2) > div > h3').should('have.text', 'No Man\'s Sky');
    cy.get(':nth-child(3) > div > h3').should('have.text', 'The Stanley Parable');
    cy.get(':nth-child(4) > div > h3').should('have.text', 'Papers, Please');
  });

  // Contact
  it('successfully navigates to Contact', () => {
    cy.get('.contact-nav').click();
    cy.url().should('include', '/contact');
  });

  it('should contain correct elements', () => {
    cy.get('h1').should('have.text', 'Contact');
    cy.get('.content-container > :nth-child(3)').should('have.text', 'Email: easter.egg@email.com');
    cy.get('.content-container > :nth-child(4)').should('have.text', 'Tel: 0118 999 881 999 119 7253');
  });

  // About
  it('successfully navigates to About', () => {
    cy.get('.about-nav').click();
    cy.url().should('include', '/about');
  });

  it('should contain correct elements', () => {
    cy.get('h1').should('have.text', 'About');
    cy.get('.content-container > :nth-child(3)').should('have.text', 'This is an easter egg site...');
  });

  // Home
  it('successfully navigates back to Home', () => {
    cy.get('.home').click();
    cy.url().should('include', '/news/1');
  });

  it('should contain correct elements', () => {
    cy.get('h1').should('have.text', 'News');
    cy.get('p').should('have.text', 'No news...');
  });
});
