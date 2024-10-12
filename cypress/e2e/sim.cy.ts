describe('Login and Group2PageComponent', () => {

    describe('Log In Page', () => {
      beforeEach(() => {
        cy.visit('/login');  // login page URL
      });
  
      it('logs in with valid credentials', () => {
        cy.get('input[name=email]').type('Lora');
        cy.get('input[name=password]').type('1');
        cy.get('button[type=submit]').click();
  
        cy.url().should('include', '/groups');
  
        cy.window().then((window) => {
          expect(window.localStorage.getItem('username')).to.equal('Lora');
          expect(window.localStorage.getItem('role')).to.exist;
        });
      });
  
      it('shows error on invalid credentials', () => {
        cy.get('input[name=email]').type('invaliduser@example.com');
        cy.get('input[name=password]').type('wrongpassword');
        cy.get('button[type=submit]').click();
  
        cy.get('.error-message').should('contain', 'Invalid username or password');
      });
    });
  
    describe('Group2PageComponent', () => {
      beforeEach(() => {
        // Log in first
        cy.visit('/login');
        cy.get('input[name=email]').type('Lora');
        cy.get('input[name=password]').type('1');
        cy.get('button[type=submit]').click();
        cy.url().should('include', '/groups');
  
        // Click "Join" for Group 2 (without visiting the URL directly)
        cy.contains('Group 2').parent().find('button').contains('Join').click();
  
        // Now check if you're in Group 2 page
        cy.url().should('include', '/group2');
      });
  
      it('should load the Group2PageComponent', () => {
        cy.contains('Group 2').should('be.visible');
        cy.contains('Start chatting, Lora!').should('be.visible');
      });
  
      it('should send a message and display it in the chat in real time', () => {
        const messageText = 'Hello Cypress!';
        cy.get('input[placeholder="Type a message!"]').type(messageText);
        cy.get('.icon-button i.fa-paper-plane').click();
        cy.contains(messageText).should('be.visible');
      });
  
      it('should start a video stream when the camera is clicked', () => {
        cy.get('.icon-button i.fa-video').click();
        cy.get('video').should('exist');
      });
  
      it('should delete a message when the trash icon is clicked', () => {
        const messageToDelete = 'Delete this message';

        // Send a message
        cy.get('input[placeholder="Type a message!"]').type(messageToDelete);
        cy.get('.icon-button i.fa-paper-plane').click();
        
        // Ensure the message appears in the chat
        cy.contains(messageToDelete).should('be.visible');

        // Click the trash icon to delete the message
        cy.contains(messageToDelete)
          .parent()
          .find('i.fa-trash-alt')
          .click();
        
        // Wait for a short time to ensure the UI is updated after deletion
        cy.wait(1000); // Ensure that there's enough time for deletion to happen
        
        // Now assert that the message no longer exists
        cy.contains(messageToDelete).should('not.exist');
      });
  
      it('should navigate back to the group list when the back button is clicked', () => {
        cy.get('.icon-button i.fa-arrow-left').click();
        cy.url().should('include', '/groups');
      });
    });
  });
