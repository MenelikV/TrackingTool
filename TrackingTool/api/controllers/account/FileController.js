/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {

  view: function (req, res) {
    // New aircraft if the last created entry, if it exists, display it
    var headers = Data.getHeader();
    return res.view("pages/table/upload-results", {
      data: [req.aircraft_data],
      headers: headers,
      me: req.me})
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

  download: async function (req, res) {
    //Finding file through id on the URL and selecting file path
    File.find({
      id: req.param('id')
    }).exec(async function (err, result) {
      if (err) {
        res.send('error')
      } else if (result == undefined) {
        res.send('notfound')
      } else {
        if (result[0] === undefined) { return res.serverError("Internal Error") }
        var path = result[0].path;
        console.log(path)
        // Watermark file Here or not 
        //Including skipper disk
        console.log(result[0].aircraft_id)
        var status  =  await Data.find({id: result[0].aircraft_id})
        if(status===undefined){
          return res.serverError("Unable to find aircraft linked to the file")
        }
        else{
          if(status.length !== 1){return res.serverError("Not able to download this file")}
          console.log(status)
          var rs = status[0].Results_Status
          var vs = status[0].Validated_Status
          var text = ""
          if(rs === "Preliminary" && vs === "true"){
            text = "Preliminary Results"
          }
          else{
            if(!vs.length){
              text = "Non Validated Data"
            }
          }
          if(text.length){
            // Watermark PDF
            console.log("PDF Should be Watermarked")
            try {
              var path = sails.helpers.watermark(path, text)
            } catch (error) {
              console.error(error)
            }
          }
          
          var SkipperDisk = require('skipper-disk');
          var fileAdapter = SkipperDisk();
          // Tell the browser we are handling a PDF File
          res.setHeader('Content-Type', 'application/pdf');
          fileAdapter.read(path).on('error', function (err) {
            res.send('path error');
          })
            .pipe(res);
          

        }
      }
    })
  },


  upload: async function (req, res) {
    var fs = require('fs')
    var XLSX = require("js-xlsx")
    var config_data = require("./config.json")
    var idendification_data = require("./ident_config.json")
    var pdf_data = require("./pdf_config.json")
    var keys = Object.keys(config_data)
    var pdf_keys = Object.keys(pdf_data)
    var aircraft_data = {}
    req.file("file").upload(async function (err, uploads) {
      if (uploads === undefined) {
        return res.serverError("Upload did not work")
      }
      if (uploads.length > 7) {
        return res.serverError('User should only upload 7 files at once');
      }
      // Filter PDF vs XLS* Files
      var pdf_files = uploads.filter(upload => upload.filename.split(".").pop() == "pdf")

      var xls_files = uploads.filter(upload => upload.filename.split(".").pop().indexOf("xls") !== -1)
      // Handle Excel Files First
      xls_files.forEach(file => {
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k]
          var r = RegExp(`${key}`, "g")
          if (r.exec(file.filename) !== null) {
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
        fs.unlink(file.fd, function (err) {
          if (err) {
            return console.log('Could not delete excel file', err);
          }
        });
      })
      var criteria = _.pick(aircraft_data, ["Aircraft", "MSN", "Flight"])
      // Add Entry to DataBase now
      try{
        var uploaded_entry = await Data.findOrCreate(criteria, criteria)
      }
      catch(error){
        console.log("More than one entry found")
        return res.serverError(err)
      }
      //aircraft_data = {}
      console.log("Handling PDF Files")
      for (const file of pdf_files) {

        for (const k of pdf_keys) {
          if (file.filename.toLowerCase().indexOf(k) !== -1) {
            aircraft_data[pdf_data[k]] = file.fd
            // Create a file entry in the Fike DataBase
            var createdFileEntry = await File.create({
              filename: k,
              path: file.fd,
              aircraft_id: uploaded_entry.id
            }).fetch()
            aircraft_data[pdf_data[k] + "_id"] = createdFileEntry.id;
          }
        }
      }
      // Default Value
      aircraft_data["Validated_Status"] = ""
      aircraft_data["Results_Status"] = ""
      // Try to open the CTR DataBase, If MSN not found then set fields to defaut
      var CTR_dict = await CtrTot.find({ MSN: aircraft_data["MSN"] })
      if (CTR_dict.length == 1) {
        CTR_dict = CTR_dict[0]
        aircraft_data["CTR"] = CTR_dict.CTR !== undefined ? CTR_dict.CTR : ""
        aircraft_data["Delivery_Date"] = CTR_dict.Delivery_Date !== undefined ? CTR_dict.Delivery_Date : ""
      }
      else {
        aircraft_data["CTR"] = uploaded_entry["CTR"]
        aircraft_data["Delivery_Date"] = uploaded_entry["Delivery_Date"]
      }
      aircraft_data["Commentary"] = uploaded_entry["Commentary"]
      // TRA is filled by hand :/
      aircraft_data["TRA"] = ""
      try{
      var data = await Data.update(uploaded_entry).set(aircraft_data).fetch()}
      catch(error){
        err = error
      }


      console.log("Finishing processing Files and redirection")
      if (err !== undefined && err !== null) {
        console.log('error uploading files')
        return res.serverError(err)
      }
      console.log("Redirection")
      // if it was successful redirect and display all uploaded files
      var headers = Data.getHeader()
      return res.view("pages/table/upload-results", {
        data: data,
        headers: headers,
        me: req.me})
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
        res.send("Upload did not work")
        return res.view("/welcome")
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
          res.serverError('Internal Error, could not update' + err)
        }
      });
      return res.redirect('/files')
    })
  },


  validate: async function (req, res) {
    // Push Data to the server
    console.log("Some data will be pushed back to the server")
    var aircraft_data = {}
    aircraft_data["Commentary"] = _.escape(req.body["userCommentary"])
    // Date Formatting if Delivery date field is not empty
    moment = require("moment")
    aircraft_data["Delivery_Date"] = req.body["deliveryDate"].length > 0 ? moment(req.body["deliveryDate"]).format("DD/MM/YYYY") : ''
    var possible_entry = await Data.find(req.body.aircraft)
    if (possible_entry.length == 1) {
      // Update Entry if there is something new
      if (aircraft_data !== possible_entry[0]) {
        await Data.update(req.body.aircraft, aircraft_data);
      }
      // See the whole table with the new entry 
      res.status(200)
      Data.publish(_.pluck(possible_entry, 'id'), {
        verb: 'Creation',
        author: req["me"].fullName,
        raw: possible_entry,
        msg: `${req["me"].fullName} has added ${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`,
        data: `${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`
      }, req);
      return res.send("Sucessful Operation")
    }
    if (possible_entry.length == 0) {
      // Create new entry
      var data = await Data.create(aircraft_data).fetch();
      Data.publish(_.pluck(data, 'id'), {
        verb: 'Creation',
        author: req["me"].fullName,
        raw: data,
        msg: `${req["me"].fullName} has added ${data[0].Aircraft} - ${data[0].MSN} - ${data[0].Flight}`,
        data: `${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`
      }, req);
      // See the whole table with the new entry 
      res.status(200)
      return res.send("Sucessful Operation")
    }
    if (possible_entry.length > 1) {
      // DataBase Error, Refuse Upload
      console.log("There is a problem with the DataBase")
      console.log("Entries found:")
      console.log(possible_entry)
      res.status(500)
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
    // Escaping for commentary (TODO Validation for other fields as well ?)
    req.body["Commentary"] = _.escape(req.body["Commentary"])
    var old = await Data.find({"id": req.body["id"]})
    var _old = old[0]
    // Update Model Entry
    var data = await Data.update({
      "id": req.body["id"]
    }, req.body).fetch()
    var _data = data[0]
    console.log('Database was updated')
    // Return Sucess If update was good
    res.status(200)
    var to_publish = false
    for(let field of ["Validated_Status", "CTR", "Fuel_Characteristics"]){
      if(_old[field] != _data[field])
      {
        to_publish = true
      }
    }
    if(_old["Results_Status"] != _data["Results_Status"] & _data["Results_Status"] === "Definitive"){
      to_publish = true
    }
    if(to_publish){
      Data.publish(_.pluck(data, 'id'), {
        verb: 'Edition',
        author: req["me"].fullName,
        raw: req.body,
        msg: `${req["me"].fullName} has edited ${data[0].Aircraft} - ${data[0].MSN} - ${data[0].Flight}`,
        data: `${data[0].Aircraft} - ${data[0].MSN} - ${data[0].Flight}`
      }, req);
    }
    else{
      Data.publish(_.pluck(data, 'id'), {
        verb: '',
        author: req["me"].fullName,
        raw: req.body,
        msg: `${req["me"].fullName} has edited ${data[0].Aircraft} - ${data[0].MSN} - ${data[0].Flight}`,
        data: `${data[0].Aircraft} - ${data[0].MSN} - ${data[0].Flight}`
      }, req);
    }
    return res.send("Sucessful Operation")
  },

  getData: async function (req, res) {
    console.log(req.body)
    var draw = parseInt(req.body["draw"])
    var data = await Data.find({})
    for (var i = 0; i < data.length; i++) {
      data["DT_RowId"] = data["id"]
    }
    res.status(200)
    return res.send({
      recordsTotal: data.length,
      recordsFiltered: data.length,
      draw: draw,
      data: data,
    })
  },

  delete: async function(req, res){
    console.log(req.body);
    try{
      await Data.destroy(req.body)
      res.status(200);
      Data.publish(_.pluck([req.body], 'id'), {
        verb: 'Deletion',
        author: req["me"].fullName,
        raw: req.body,
        msg: `${req["me"].fullName} has deleted ${req.body.Aircraft} - ${req.body.MSN} - ${req.body.Flight}`,
        data: ""
      }, req);
      return res.send("Successful Operation");
    }
    catch(error){
      res.status(500);
      return res.send(error);
    }
  },
  getApiData: async function(req, res){
    var data = await Data.find();
    var headers = Data.getHeader()
    var visible_headers = Data.getVisibleFields()
   return res.send({data:data, headers:headers, search:false, visible_headers: visible_headers});
  }
}
