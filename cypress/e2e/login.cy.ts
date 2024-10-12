describe('Log In Page', () => {

  // Before each test visit the login page
  beforeEach(() => {
    cy.visit('/login');  // login page URL
  });

  // Test successful login
  it('logs in with valid credentials', () => {
    // valid email and password
    cy.get('input[name=email]').type('Lora'); // Enter the valid username 'Lora'
    cy.get('input[name=password]').type('1');  // Enter the valid password '1'
    cy.get('button[type=submit]').click();  // Click the submit button

    // Makes sure user is taken to groups page
    cy.url().should('include', '/groups');

    // localStorage has the correct username and role
    cy.window().then((window) => {
      expect(window.localStorage.getItem('username')).to.equal('Lora');  // Adjusted to expect 'Lora'
      expect(window.localStorage.getItem('role')).to.exist;  // Check role exists
    });
  });

  // Test failed login with incorrect credentials
  it('shows error on invalid credentials', () => {
    // Enter an invalid email and password
    cy.get('input[name=email]').type('invaliduser@example.com');
    cy.get('input[name=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();

    // Error Message
    cy.get('.error-message').should('contain', 'Invalid username or password');
  });
});
