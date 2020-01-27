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

  add: async function (req, res) {
    if (!req.body) return res.serverError("No data was received.");
    req.body["password"] = await sails.helpers.passwords.hashPassword(req.body["password"]);

    User.create(req.body).exec(function (err, result) {
      if (err) console.log("eerroor ", err);
      else {
        console.log("created user!");
        res.status(200).send();
      }
    })
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
        return res.serverError('Could not delete file. ', err);
      }
    });
    req.file("file").upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images'),
      saveAs: name
    }, async function (err, uploads) {
      if (!uploads) {
        return res.serverError("Upload did not work.")
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
  },


  view_keys: async function (req, res) {
    let full_keys = await TemplateKeys.find({
      select: ["Alias", "Name"]
    });
    //full_keys = _.pluck(full_keys, 'Alias');
    let keys = {};
    for (let key_data of full_keys) {
      keys[key_data.Name] = key_data.Alias;
    }

    console.log("fullkeys---> ", keys);
    res.view('pages/account/edit-keys', {
      me: req.me,
      full_keys: keys
    })
  },

  update_keys: async function (req, res) {
    let update_values = req.body["key_array"];
    if (!update_values) return res.serverError("There was an issue updating the template keys.");

    /////// KEYS MUST BE CREATED FIRST IN templatekeys.db (Name attribute must not change, only alias) //////
    for (let i = 0; i < update_values.length; i++) {
      let current = update_values[i];
      await TemplateKeys.update({
        Alias: current.Alias
      }).where({
        Name: current.Name
      })
    }

    res.send(200);

  }


}
