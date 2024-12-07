describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/user/login');
  });

  it('mengecek apa ada halaman login', () => {
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button').contains('Masuk').should('exist');
  });

  it('memasukan dengan password namun tidak dengan email', () => {
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').type('@googlesign123');
    cy.get('form').submit();

    cy.get('.text-red-500').should('contain.text', 'Email harap diisi!');
  })

  it('memasukan input email dan password dengan valid', () => {
    cy.get('input[name="email"]').type('yusuffadilah58@gmail.com');
    cy.get('input[name="password"]').type('@googlesign123');
    cy.get('form').submit();

    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('menampilkan error jika password kurang dari 8 karakter', () => {
    cy.get('input[name="email"]').type('yusuffadilah58@gmail.com');
    cy.get('input[name="password"]').type('short');
    cy.get('form').submit();

    cy.get('.text-red-500').should('contain.text', 'Password minimal 8 huruf');
  });

  it('login dengan email yang salah', () => {
    cy.get('input[name="email"]').type('wrongemail@example.com');
    cy.get('input[name="password"]').type('@googlesign123');
    cy.get('form').submit();

    cy.contains('Email yang anda masukan salah atau tidak ada').should('be.visible');
  });

});
