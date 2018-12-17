/// <reference types="Cypress" />
var mail;
describe("Admin should grant access to a new user", function(){
    it("Make a request", function(){
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
       
    })
    it("Admin Logs in and view the request page", function(){
        cy.visit("/")
        cy.get(':nth-child(1) > .nav-link').click()
        cy.get(':nth-child(1) > .form-control').type("mvero-ext@assystemtechnologies.com")
        cy.get(':nth-child(2) > .form-control').type("TEST")
        cy.get('.btn').click()
        cy.get('.btn').click()
        // Admin is logged in
        cy.get(':nth-child(3) > #header-account-menu-link').click()
        cy.get('[href="/requests"]').click()
        // It should go to the requests page :)
        cy.location().should((loc) => {
            expect(loc.pathname).to.eq("/requests")
        })
    })
    it("Admin plays with dots", function(){
        // Check the viewer / admin / basic user dots
        var table = cy.get('#example')
        var first_row = table.rows[0]
        var admin_cell = first_row.cells[2]
        var basic_user_cell = first_row.cells[3]
        var viewer_cell = first_row.cells[4]
        viewer_cell.click()
    })
    it("Admin search through the table", function(){
        //TODO
    })
    it("Admin finally the request", function(){
        //TODO
    })
})