describe("Login, Viewing Requests, Granting Access and Changing Rights ", function(done){
    it("Login", function (done){
        const request = require("supertest")
        var agent = request.agent(sails.hooks.http.app)
        agent
        .post("/login")
        .send({email: "mvero-ext@assystemtechnologies.com", password: "TEST"})
        .expect("location", "/welcome", done)
        .end(function(err, res){
            console.log("Response from Server"+JSON.stringify(res.body))
            done()
        })
    })
    it("View requests", function(done){
        const request = require("supertest")
        var agent = request.agent(sails.hooks.http.app)
        agent
            .get("/table")
            .expect(200)
            .end(function(err, res){
                console.log("Response from Server"+JSON.stringify(res.body))
                done()
            })
    })
    it("Search for a requesting user", function(done){
        // TODO
    })
    it("Rejecting", function(done){
        const request = require("supertest")
        var agent = request.agent(sails.hoos.http.app)
     // TODO
    })
    it("User should not be able to login", function(done){
        // TODO
    })
    it("Search for a requesting user", function(done){
        // TODO
    })
    it("Changing Right", function(done){
        // TODO
    })
    it("Check change for the new user", function(done){
        // TODO
    })
    it("Search for a requesting user", function(done){
        // TODO
    })
    it("Granting Access", function(done){
        const request = require("supertest")
        var agent = request.agent(sails.hoos.http.app)
     // TODO
    })
})