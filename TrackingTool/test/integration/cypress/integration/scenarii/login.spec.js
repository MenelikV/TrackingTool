/// <reference types="Cypress" />

describe("Simple Login", function(){
    it("Fisrt Tests", function(){
        cy.visit("/")
        cy.get(".btn.btn-outline-light").click()
        cy.get(':nth-child(1) > .form-control').type("mvero-ext@assystemtechnologies.com")
        cy.get(':nth-child(2) > .form-control').type("TEST2")
        cy.get('.btn').click()
        // Invalid Login, a text should appear
        cy.get('.text-danger')
        cy.location().should((loc) => {
            expect(loc.pathname).to.eq("/login")
        })
        cy.get(':nth-child(2) > .form-control').type('{backspace}')
        // Login should be valid now
        cy.get('.btn').click()
        // Admin Loggin
        cy.location().should((loc) => {
            expect(loc.pathname).to.eq("/welcome")
        })
    })
})