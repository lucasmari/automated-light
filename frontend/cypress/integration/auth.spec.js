describe('Authentication', () => {
  before(() => {
    cy.task('clearUsers');
    cy.visit('/');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('csrf', 'jwt_access', 'signed_in');
    Cypress.Cookies.debug(true);
  });

  after(() => {
    cy.task('clearUsers');
  });

  const name = 'Lucas';
  const email = 'lucas@email.com';
  const password = '123456';

  it('successfully signs up', () => {
    cy.signup(name, email, password);
  });

  it('successfully signs in', () => {
    cy.signin(email, password);
  });

  it('successfully signs out', () => {
    cy.get('.signout').click();
  });

  it('should contain correct cookies', () => {
    cy.getCookies()
      .should('have.length', 3)
      .then((cookies) => {
        expect(cookies[0]).to.have.property('name', 'jwt_access');
        expect(cookies[0]).to.have.property('value');
        expect(cookies[0]).to.have.property('domain', 'localhost');
        expect(cookies[0]).to.have.property('path', '/');
        expect(cookies[0]).to.have.property('httpOnly', true);
        expect(cookies[0]).to.have.property('sameSite', 'strict');

        expect(cookies[1]).to.have.property('name', 'csrf');
        expect(cookies[1]).to.have.property('value');
        expect(cookies[1]).to.have.property('domain', 'localhost');
        expect(cookies[1]).to.have.property('path', '/');
        expect(cookies[1]).to.have.property('httpOnly', false);
        expect(cookies[1]).to.have.property('sameSite', 'strict');

        expect(cookies[2]).to.have.property('name', 'signed_in');
        expect(cookies[2]).to.have.property('value', '');
        expect(cookies[2]).to.have.property('domain', 'localhost');
        expect(cookies[2]).to.have.property('path', '/');
        expect(cookies[2]).to.have.property('httpOnly', false);
        expect(cookies[2]).to.have.property('sameSite', 'strict');
      });
  });
});
