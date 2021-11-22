describe('News', () => {
  before(() => {
    cy.task('clearNews');
    cy.task('clearUsers');
    cy.visit('/');
  });

  after(() => {
    cy.task('clearNews');
    cy.task('clearUsers');
  });

  it('should contain correct elements', () => {
    cy.get('h1').should('have.text', 'News');
    cy.get('p').should('have.text', 'No news...');
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

  it('successfully creates news', () => {
    cy.fixture('news').then((news) => {
      cy.wrap(news).each((n) => {
        cy.get('.content-subcontainer > div > .MuiButtonBase-root').click();
        cy.get('#title').type(n.title).should('have.value', n.title);
        cy.get('#body').type(n.body).should('have.value', n.body);
        cy.get('.MuiDialogActions-root > :nth-child(1)').click();
      });
    });
  });

  it('should contain news', () => {
    cy.fixture('news').then((news) => {
      cy.fixture('user').then((user) => {
        // eslint-disable-next-line consistent-return
        cy.wrap(news).each((n) => {
          cy.get(`.content-container > :nth-child(${n.child}) > .news > div > h3`).should('have.text', n.title);
          cy.get(`.content-container > :nth-child(${n.child}) > .news > div > :nth-child(2)`).should('have.text', n.body);
          cy.get(`.content-container > :nth-child(${n.child}) > .news > div > :nth-child(3)`).should('have.text', `Posted by: ${user.name}`);

          if (n.child === 4) {
            return false;
          }
        });
      });
    });
  });

  it('successfully goes to next page', () => {
    cy.get('.pagination > :nth-child(2)').click();
    cy.url().should('include', '/news/2');
  });

  it('should contain more news', () => {
    cy.fixture('news').then((news) => {
      cy.fixture('user').then((user) => {
        cy.get('.content-container > :nth-child(2) > .news > div > h3').should('have.text', news[3].title);
        cy.get('.content-container > :nth-child(2) > .news > div > :nth-child(2)').should('have.text', news[3].body);
        cy.get('.content-container > :nth-child(2) > .news > div > :nth-child(3)').should('have.text', `Posted by: ${user.name}`);
      });
    });
  });

  it('successfully goes back', () => {
    cy.get('.pagination > :nth-child(1)').click();
    cy.url().should('include', '/news/1');
  });
});
