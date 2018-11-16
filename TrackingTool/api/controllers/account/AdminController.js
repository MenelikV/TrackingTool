/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  view: async function (req, res) {

    User.find({
      isApproved: 'false'
    }).exec(function (err, results) {

      if (err) {
        res.send('error')
      }
      return res.view('pages/account/view-requests', {
        me: req.me,
        result: results
      })

    });

  },

  approve: async function (req, res) {
    //Approving the user
    User.update({
      id: req.param('id')
    }).set({
      isApproved: 'true'
    }).exec(function (err, updatedUser) {
      if (err) {
        res.send('could not approve')
      }

      res.status(200)
      return res.send("Sucessful Operation")

    })

  },

  reject: async function (req, res) {
    //Approving the user
    User.update({
      id: req.param('id')
    }).set({
      isApproved: 'rejected'
    }).exec(function (err, updatedUser) {
      if (err) {
        res.send('could not approve')
      }
      console.log('rejected!')
      res.status(200)
      return res.send("Sucessful Operation")

    })

  },

  changeRights: function (req, res) {

  if (req.body["isSuperAdmin"]){
    User.update({
      id: req.param('id')
    }).set({ 
      isSuperAdmin: true,
      isBasicUser: false
    }).exec(function (err, updatedUser) {
      if (err) {
        res.send('could not change rights')
      }
      console.log('now admin!')
      res.status(200)
      return res.send("Sucessful Operation")
    })
  }

  else if (req.body["isBasicUser"]){
    console.log('true for basic!')
    User.update({
      id: req.param('id')
    }).set({
      isBasicUser: true,
      isSuperAdmin: false
    }).exec(function (err, updatedUser) {
      if (err) {
        res.send('could not change rights')
      }
      console.log('now basic user!')
      res.status(200)
      return res.send("Sucessful Operation")
    })
  }


  }

}
