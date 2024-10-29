// cypress/integration/login.spec.js
describe("Login Page", () => {
  it("successfully loads", () => {
    cy.visit("/login"); // Adjust the URL if needed
  });

  it("allows user to log in", () => {
    cy.visit("/login");

    // Find the email and password input fields and type into them
    cy.get("#email").type("test@test.com");
    cy.get("#password").type("testing");

    // Click the login button
    cy.get("#button-login").click();

    // Ensure that the loading state appears
    cy.get("#button-login").contains("Loading...").should("exist");

    // Mocking login request success and redirect to home
    // You should see if there's any success message or the user is redirected
    cy.url().should("include", "/home");
  });

  it("displays error for invalid credentials", () => {
    cy.visit("/login");

    // Type wrong credentials
    cy.get("#email").type("test@test.com");
    cy.get("#password").type("testing123");
    // Click the login button
    cy.get("#button-login").click();
    // Check if the alert or error message is displayed
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Credenciales incorrectas");
    });
  });
});
