/// <reference types="Cypress" />
var mail;
describe("A new coming user should be able to sign up", function(){
    it("Sign up", function(){
        cy.visit("/")
        // Create a request
        cy.get(':nth-child(2) > .nav-link').click()
        cy.get('#full-name').type("Full Name")
        let r = Math.random().toString(36).substr(2, 5)
        // mail will be used across several tests
        mail = "test"+r+"@mailaddress.com"
        cy.get('#email-address').type(mail)
        cy.get('#password').type("TEST")
        cy.get('#confirm-password').type("TEST")
        cy.get("#rights").select("Viewer")
        cy.get('#terms-agreement').check()
        cy.get('.btn').click()
        // Wait for the spinner to finish
        cy.get('#load').should('not.be.visible')
        // the sign up should return no error
        cy.get(".ajax-form").get(".text-danger").should("not.be.visible")
        // Successful message should be displayed
        cy.get(".container").get(".text-center").should("be.visible")
    })
})