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
        result: results,
        search: false
      })
    });
  },

  approve: async function (req, res) {
    //Approving the user
    User.update({
      emailAddress: req.param('emailAddress')
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
      emailAddress: req.param('emailAddress')
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

    if (req.body["isSuperAdmin"].length) {
      User.update({
        emailAddress: req.param('emailAddress')
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
    } else if (req.body["isBasicUser"].length) {
      console.log('true for basic!')
      User.update({
        emailAddress: req.param('emailAddress')
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
    } else {
      User.update({
        emailAddress: req.param('emailAddress')
      }).set({
        isSuperAdmin: false,
        isBasicUser: false
      }).exec(function (err, updatedUser) {
        if (err) {
          res.send('could not change rights')
        }
        console.log('now viewer!')
        res.status(200)
        return res.send("Sucessful Operation")
      })
    } 
  },

  search: async function (req, res) {

    User.find({
      emailAddress: req.param('user').toLowerCase()
    }).exec(function (err, results) {
      if (err) {
        res.send('notfound')
      }
      return res.view('pages/account/view-requests', {
        result: results,
        me: req.me,
        search: true,
        email: req.param('user')
      })
    })
  }
}
