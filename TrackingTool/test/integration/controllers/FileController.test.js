describe("Login and Accessing Data From an Admin Count", function(done){
    it("Should be able to login", function (done){
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
    it("Should view the data now", function(done){
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
    it("Should be able to upload data now", function(done){
        const request = require("supertest")
        var agent = request.agent(sails.hoos.http.app)
     // TODO
    })

})