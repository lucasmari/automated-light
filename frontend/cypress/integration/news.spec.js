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

  const name = 'Lucas';
  const email = 'lucas@email.com';
  const password = '123456';

  const news = [
    { child: 2, title: 'Awesome news 1', body: 'Wow, amazing easter egg 1' },
    { child: 3, title: 'Awesome news 2', body: 'Wow, amazing easter egg 2' },
    { child: 4, title: 'Awesome news 3', body: 'Wow, amazing easter egg 3' },
    { title: 'Awesome news 4', body: 'Wow, amazing easter egg 4' },
  ];

  it('should contain correct elements', () => {
    cy.get('h1').should('have.text', 'News');
    cy.get('p').should('have.text', 'No news...');
  });

  it('successfully signs up', () => {
    cy.signup(name, email, password);
  });

  it('successfully signs in', () => {
    cy.signin(email, password);
  });

  it('successfully creates news', () => {
    cy.wrap(news).each((n) => {
      cy.get('.content-subcontainer > div > .MuiButtonBase-root').click();
      cy.get('#title').type(n.title).should('have.value', n.title);
      cy.get('#body').type(n.body).should('have.value', n.body);
      cy.get('.MuiDialogActions-root > :nth-child(1)').click();
    });
  });

  it('should contain news', () => {
    // eslint-disable-next-line consistent-return
    cy.wrap(news).each((n) => {
      cy.get(`.content-container > :nth-child(${n.child}) > .news > div > h3`).should('have.text', n.title);
      cy.get(`.content-container > :nth-child(${n.child}) > .news > div > :nth-child(2)`).should('have.text', n.body);
      cy.get(`.content-container > :nth-child(${n.child}) > .news > div > :nth-child(3)`).should('have.text', `Posted by: ${name}`);

      if (n.child === 4) {
        return false;
      }
    });
  });

  it('successfully goes to next page', () => {
    cy.get('.pagination > :nth-child(2)').click();
    cy.url().should('include', '/news/2');
  });

  it('should contain more news', () => {
    cy.get('.content-container > :nth-child(2) > .news > div > h3').should('have.text', news[3].title);
    cy.get('.content-container > :nth-child(2) > .news > div > :nth-child(2)').should('have.text', news[3].body);
    cy.get('.content-container > :nth-child(2) > .news > div > :nth-child(3)').should('have.text', `Posted by: ${name}`);
  });

  it('successfully goes back', () => {
    cy.get('.pagination > :nth-child(1)').click();
    cy.url().should('include', '/news/1');
  });
});
