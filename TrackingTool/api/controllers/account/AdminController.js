/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  view: async function (req, res) {

    User.find({
      isApproved: false
    }).exec(function (err, results) {

        if(err){
            res.send('error')
        }
        return res.view('pages/account/view-requests', {me: req.me, result: results} )

    });

  },

  approve: async function (req,res) {
    //Approving the user
    User.update({id: req.param('id')}).set({isApproved:true}).exec(function (err, updatedUser){
      if(err){
        res.send('could not approve')
      }

      res.status(200)
      return res.send("Sucessful Operation")
    
    })

  }

}
