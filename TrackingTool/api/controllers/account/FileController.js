/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  view: function (req, res) {
    // New aircraft if the last created entry, if it exists, display it
    if (aircraft_data === {}) {
      res.send("No data found")
    } else {
      var headers = Data.getHeader();
      return res.view("pages/table/upload-results", {
        data: [aircraft_data],
        headers: headers,
        me: req.me
      })
    }

  },

  search: function (req, res) {
    //Search for files by the MSN 
    var results = Data.find({
      MSN: req.param('msn').toUpperCase()
    }).exec(function (err, results) {

      if (err) {
        headers = undefined
        console.log(err)
        return res.view('pages/table/available-data', {
          data: [],
          headers: headers,
          me: req.me,
          msn: req.param('msn'),
          search: true
        })
      }

      //If successful show corresponding files in a table

      if (results !== undefined) {
        headers = Data.getHeader()
        return res.view('pages/table/available-data', {
          data: results,
          headers: headers,
          me: req.me,
          msn: req.param('msn'),
          search: true
        })
      }

      return res.view('pages/table/available-data', {
        data: results,
        headers: undefined,
        me: req.me,
        msn: req.param('msn'),
        search: true
      })


    })
  },

  download: function (req, res) {
    //Finding file through id on the URL and selecting file path
    File.find({
      id: req.param('id')
    }).exec(function (err, result) {
      if (err) {
        res.send('error')
      } else if (result == undefined) {
        res.send('notfound')
      } else {
        var path = result[0].path;
        console.log(path)
        //Including skipper disk
        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();

        fileAdapter.read(path).on('error', function (err) {
            res.send('path error');
          })
          .pipe(res);
      }
    })
  },


  upload: async function (req, res) {
    var XLSX = require("js-xlsx")
    var config_data = require("./config.json")
    var idendification_data = require("./ident_config.json")
    console.log(idendification_data)
    var pdf_data = require("./pdf_config.json")
    var keys = Object.keys(config_data)
    var pdf_keys = Object.keys(pdf_data)
    aircraft_data = {}
    req.file("file").upload({}, async function (err, uploads) {
      if (uploads === undefined) {
        return res.send("Upload did not work")
      }
      if (uploads.length > 7) {
        return res.send("Maximum 7 files can be uploaded")
      }
      // Filter PDF vs XLS* Files
      var pdf_files = uploads.filter(upload => upload.filename.split(".").pop() == "pdf")
      var xls_files = uploads.filter(upload => upload.filename.split(".").pop().indexOf("xls") !== -1)
      // Handle Excel Files First
      xls_files.forEach(file => {
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k]
          if (file.filename.indexOf(key) !== -1) {
            // Try to open the file, if it fails then report to the server
            try {
              workbook = XLSX.readFile(file.fd);
            } catch (error) {
              err = error
            }
            var sub_keys = Object.keys(config_data[key])
            for (var l = 0; l < sub_keys.length; l++) {
              sheet = sub_keys[l];
              if (workbook.SheetNames.includes(sheet) !== -1) {
                console.log("A WorkSheet has been found!")
                s = workbook.Sheets[sheet]
                var info_key = Object.keys(config_data[key][sheet])
                var info = config_data[key][sheet];
                for (var m = 0; m < info_key.length; m++) {
                  var prop = info_key[m];
                  if (prop === "Results") {
                    console.log("Crawling the table")
                    // Getting the info for the table is really diffrenet from the other properties
                    aircraft_data[prop] = sails.helpers.tableCrawler(info[prop], s)
                  } else {
                    console.log("Crawling Data")
                    if (sheet === "identification") {
                      console.log(idendification_data)
                      console.log(prop)
                      console.log(s[info[prop]].v)
                      aircraft_data[prop] = idendification_data[prop][s[info[prop]].v]
                    } else {
                      aircraft_data[prop] = s[info[prop]].v
                    }
                  }
                }
              }
            }
          }
        }
      })
      console.log("Handling PDF Files")
      for (const file of pdf_files) {

        for (const k of pdf_keys) {
          if (file.filename.toLowerCase().indexOf(k) !== -1) {
            aircraft_data[pdf_data[k]] = file.fd
            // Create a file entry in the Fike DataBase
            var createdFileEntry = await File.create({
              filename: k,
              path: file.fd
            }).fetch()
            aircraft_data[pdf_data[k] + "_id"] = createdFileEntry.id;
          }
        }
      }
      // Default Value
      aircraft_data["Validated_Status"] = ""
      aircraft_data["Results_Status"] = "Preliminary"
      // Try to open the CTR registry
      try {
        CTR_dict = require("ctr.json")
      } catch (error) {
        CTR_dict = {}
      }
      aircraft_data["CTR"] = CTR_dict[aircraft_data["MSN"]] !== undefined ? CTR_dict[aircraft_data["MSN"]] : ""
      // TRA is filled by hand :/
      aircraft_data["TRA"] = ""
      console.log("Finishing processing Files and redirection")
      console.log(err !== undefined && err !== null)
      console.log(err)
      if (err !== undefined && err !== null) {
        console.log('error uploading files')
        return res.serverError(err)
      }
      console.log("Redirection")
      // if it was successful redirect and display all uploaded files
      return res.redirect('/files');
    })

  },


  update: function (req, res) {
    //console.log(req.param('id'))

    var pdf_data = require("./pdf_config.json")
    var pdf_keys = Object.keys(pdf_data)

    //Uploading new file
    req.file('file').upload({}, async function (err, upload) {
      if (err) {
        res.send('error')
      }

      if (upload === undefined) {
        return res.send("Upload did not work")
      }

      var file = upload[0];

      File.find({
        id: req.param('id')
      }).exec(function (err, editFile) {
        //Editing the parameter to edit in aircraft_data field
        var k = editFile[0].filename;
        aircraft_data[pdf_data[k]] = file.fd
        aircraft_data[pdf_data[k] + "_id"] = editFile[0].id;

      });

      //Updating the path in File database
      File.update({
        id: req.param('id')
      }).set({
        path: file.fd
      }).exec(function (err, updatedFile) {
        if (err) {
          res.send('could not update')
        }
      });
      return res.redirect('/files')
    })
  },


  validate: async function (req, res) {
    // Push Data to the server
    console.log("Some data will be pushed back to the server")
    aircraft_data["Commentary"] = req.body["userCommentary"]
    aircraft_data["Delivery_Date"] = req.body["deliveryDate"]

    var min_entry = sails.helpers.extractSubDictionary(aircraft_data)
    var possible_entry = await Data.find(min_entry)
    if (possible_entry.length == 1) {
      // Update Entry if there is something new
      if (aircraft_data !== possible_entry[0]) {
        await Data.update(min_entry, aircraft_data);
      }
      // See the whole table with the new entry 
      res.status(200)
      return res.send("Sucessful Operation")
    }
    if (possible_entry.length == 0) {
      // Create new entry
      var a = await Data.create(aircraft_data).fetch();
      console.log(a)
      // See the whole table with the new entry 
      res.status(200)
      return res.send("Sucessful Operation")
    }
    if (possible_entry.length > 1) {
      // DataBase Error, Refuse Upload
      console.log("There is a problem with the DataBase")
      alert('Problem with the internal Database, upload was aborted')
      res.status(200)
      return res.send("Sucessful Operation")
    }
  },

  edit: async function (req, res) {
    // Put this into an async function
    console.log("Updating Data Entry")
    console.log(req.body)
    if (req.body["id"] === "" || req.body["id"] === undefined) {
      // TODO Return an error, internal should not be undefined or an empty string
      return res.serverError("The internal id of the to update row was not found")
    }
    // Update Model Entry
    await Data.update({
      "id": req.body["id"]
    }, req.body)
    console.log('Database was updated')
    // Return Sucess If update was good
    res.status(200)
    return res.send("Sucessful Operation")
  },


  test: function (req, res) {
    console.log(req.body)
    console.log(req.params)
    res.status(200)
    return res.send("Test was okay")
  }
}
