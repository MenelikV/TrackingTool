/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  view: async function (req, res) {
    User.find({
      isApproved: 'true'
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
      emailAddress: req.param('emailAddress'),
      id: req.param('id')
    }).set({
      isApproved: 'rejected'
    }).exec(function (err, updatedUser) {
      if (err) {
        res.send('could not approve');
      }
      return res.status(200).send();
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
  },

  changeStyle: async function (req, res) {
    var name = req.param('id') + '.png';
    var fs = require('fs')
    fs.unlink('assets/images/' + name, function (err) {
      if (err) {
        return res.serverError('Could not delete file', err);
      }
    });
    req.file("file").upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images'),
      saveAs: name
    }, async function (err, uploads) {
      if (!uploads) {
        return res.serverError("Upload did not work")
      }
      return res.view('pages/account/account-overview', {
        me: req.me
      })
    })
  },

  restore: async function (req, res) {
    const fs = require('fs');
    fs.copyFile('assets/images/default_home.png', 'assets/images/background_home.png', (err) => {
      if (err) throw err;
      console.log('ok home');
    });
    fs.copyFile('assets/images/default_site.png', 'assets/images/background_site.png', (err) => {
      if (err) throw err;
      console.log('ok site');
    });
    fs.copyFile('assets/images/default_Logo.png', 'assets/images/Logo.png', (err) => {
      if (err) throw err;
      console.log('ok logo');
    });
    return res.redirect('/');
  }
}
