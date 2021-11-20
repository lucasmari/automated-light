Cypress.Commands.add('signup', (name, email, password) => {
  cy.get('.signin').click();
  cy.get('.MuiDialogActions-root > :nth-child(2)').click();
  cy.get('#name').type(name).should('have.value', name);
  cy.get('#email').type(email).should('have.value', email);
  cy.get('#password').type(password).should('have.value', password);
  cy.get('.MuiDialogActions-root > :nth-child(1)').click();
});

Cypress.Commands.add('signin', (email, password) => {
  cy.get('.signin').click();
  cy.get('.MuiDialogActions-root > :nth-child(2)').click();
  cy.get('#email').type(email).should('have.value', email);
  cy.get('#password').type(password).should('have.value', password);
  cy.get('.MuiDialogActions-root > :nth-child(1)').click();
});
