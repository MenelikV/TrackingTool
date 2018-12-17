/// <reference types="Cypress" />

describe("Unauthorized Login", function(){
    it("Login with a false password", function(){
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
        cy.visit("/welcome")
        cy.location().should((loc) => {
            expect(loc.pathname).to.eq("/login")
        })
        cy.visit('/table')
        cy.location().should((loc) => {
            expect(loc.pathname).to.eq("/login")
        })
    })
})