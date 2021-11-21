describe('Authentication', () => {
  before(() => {
    cy.task('clearUsers');
    cy.visit('/');
  });

  beforeEach(() => {
    cy.fixture('cookies').then((cookies) => {
      cy.wrap(cookies).each((cookie) => {
        Cypress.Cookies.preserveOnce(cookie.name);
      });
    });
  });

  after(() => {
    cy.task('clearUsers');
  });

  it('successfully signs up', () => {
    cy.fixture('user').then((user) => {
      cy.signup(user.name, user.email, user.password);
    });
  });

  it('successfully signs in', () => {
    cy.fixture('user').then((user) => {
      cy.signin(user.email, user.password);
    });
  });

  it('successfully signs out', () => {
    cy.get('.signout').click();
  });

  it('should contain correct cookies', () => {
    cy.fixture('cookies').then((cookies) => {
      cy.wrap(cookies).each((cookie) => {
        cy.getCookie(cookie.name)
          .then((c) => {
            expect(c).to.have.property('value');
            expect(c).to.have.property('domain', cookie.domain);
            expect(c).to.have.property('path', cookie.path);
            expect(c).to.have.property('httpOnly', cookie.httpOnly);
            expect(c).to.have.property('sameSite', cookie.sameSite);
          });
      });
    });
  });
});
