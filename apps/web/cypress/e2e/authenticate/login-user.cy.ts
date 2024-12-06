describe('Login Form', () => {
  beforeEach(() => {
    // Mengunjungi halaman login
    cy.visit('/user/login');
  });

  it('should display the login form', () => {
    // Memeriksa apakah form login ada
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button').contains('Masuk').should('exist');
  });

  it('should display error when email is empty', () => {
    // Mengirimkan form tanpa email
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();

    // Memastikan pesan error muncul
    cy.get('.text-red-500').should('contain.text', 'Email harap diisi!');
  });

  it('should display error when password is too short', () => {
    // Mengirimkan form dengan password yang terlalu pendek
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('123');
    cy.get('form').submit();

    // Memastikan pesan error muncul
    cy.get('.text-red-500').should('contain.text', 'Password minimal 8 huruf');
  });

  it('should submit form when valid email and password are provided', () => {
    // Mengirimkan form dengan email dan password yang valid
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();

    // Memastikan form berhasil dikirim dan halaman diarahkan ke beranda
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('should toggle password visibility when clicking the eye icon', () => {
    // Mengecek apakah password bisa ditampilkan atau disembunyikan
    const passwordInput = cy.get('input[name="password"]');
    passwordInput.type('password123');
    
    // Pastikan password disembunyikan pada awalnya
    passwordInput.should('have.attr', 'type', 'password');
    
    // Klik icon mata untuk menampilkan password
    cy.get('span').contains('eye').click();
    passwordInput.should('have.attr', 'type', 'text');
    
    // Klik lagi untuk menyembunyikan password
    cy.get('span').contains('eye-slash').click();
    passwordInput.should('have.attr', 'type', 'password');
  });

  it('should submit login with Google when clicking Google login button', () => {
    // Mengklik tombol login dengan Google
    cy.get('button').contains('Masuk dengan Google').click();

    // Memastikan popup Google Sign-In muncul (atau bisa memverifikasi apakah API dipanggil jika digunakan mock/stub)
    cy.window().then((win) => {
      cy.stub(win, 'open').callsFake(() => {}); // Menyembunyikan popup asli untuk tes
    });

    // Verifikasi jika API /user/sign-w-google dipanggil
    cy.intercept('POST', '/user/sign-w-google').as('googleLogin');
    cy.get('button').contains('Masuk dengan Google').click();
    cy.wait('@googleLogin').its('response.statusCode').should('eq', 200);
  });

  it('should redirect to register page when clicking register link', () => {
    // Mengklik link register
    cy.get('a').contains('Register').click();

    // Memastikan URL mengarah ke halaman register
    cy.url().should('include', '/user/register');
  });

  it('should redirect to forgot password page when clicking forgot password link', () => {
    // Mengklik link forgot password
    cy.get('a').contains('Lupa kata sandi?').click();

    // Memastikan URL mengarah ke halaman forgot password
    cy.url().should('include', '/event-organizer/forgot-password');
  });
});
