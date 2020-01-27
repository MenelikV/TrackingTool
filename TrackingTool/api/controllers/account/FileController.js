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
      me: req.me
    })
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

  generate_doc: async function (req, res) {
    moment = require("moment");
    //Get results table data
    let results_obj = JSON.parse(req.query["results_content"]);

    //Get FLHV value
    let flhv_value = await Data.find({
      select: "FLHV"
    }).where({
      id: req.query["data_id"]
    });
    if (!flhv_value) flhv_value = "";
    else flhv_value = _.pluck(flhv_value, "FLHV")[0];

    //Generate number of points value in word format
    let num = parseInt(req.query["num_points"]);
    let numOfPoints_letter = sails.helpers.digitWord(num);

    //Calculation of DSR average and general formatting
    let dsr_values = _.pluck(results_obj["results_data"], "key_4");
    dsr_values = dsr_values.map(i => parseFloat(i));
    let dsr_avg = dsr_values.reduce((a, b) => a + b) / dsr_values.length;
    dsr_avg = dsr_avg.toFixed(3);

    let comp;
    let comp_with_model;

    if (dsr_avg > 0) {
      dsr_avg = "+" + dsr_avg;
      comp = "better than"
      comp_with_model = "improved"

    } else if (dsr_avg < 0) {
      dsr_avg = "-" + dsr_avg;
      comp = "below than"
      comp_with_model = "degradaded"
    } else {
      comp = "on"
      comp_with_model = "mantained"
    }
    dsr_avg = dsr_avg + "%";

    //Flight date formatting
    let flight_date = req.query["flight_date"];
    let dates = flight_date.split("/");
    flight_date = moment().date(dates[0]).month(dates[1]).year(dates[2]).hour(0).minute(0).second(0);
    flight_date = flight_date.format("DD MMMM YYYY");

    //Set weighing full sentence value
    let weighing = req.query["weighing"];
    if (!weighing) weighing = "";
    else if (weighing.toLowerCase() === "before") weighing = "The aircraft was weighed before weighing and recorded fuel used (+APU)";
    else weighing = "The aircraft was weighed after weighing and recorded fuel used (+APU)";

    let template_keys = await TemplateKeys.find();

    let dataset = {};
    let alias_keys = {
      FlightNumber: req.query["flight"],
      NumberOfPoints_Digit: req.query["num_points"],
      NumberOfPoints_Letter: numOfPoints_letter,
      FlightDate: flight_date,
      Fuel_Flowmeters: req.query["fuel_flowmeters"],
      Fuel_Characteristics: req.query["fuel_characteristics"],
      FLHV_Value: flhv_value,
      Weighing: weighing,
      DSR_Average: dsr_avg,
      Comp: comp,
      CompWithModel: comp_with_model,
      results_data: results_obj["results_data"]
    }

    for (let key of template_keys) {
      dataset[key.Alias] = alias_keys[key.Name]
    }
    
    var fs = require('fs');

    req.file("file").upload({}, async function (err, upload) {
      if (err) return res.serverError("Error on upload ", err);
      if (upload === undefined) return res.serverError("Upload did not work");

      let output_name = upload[0].filename.split("_template")[0];
      let filled_template = await sails.helpers.fillTemplate(dataset, upload[0].fd, res, output_name);

      if (filled_template) {
        fs.unlink(upload[0].fd, function (err) {
          if (err) {
            return console.log('Error deleting template from server', err);
          }
          //res.status(200).send();
        });
      } else return res.serverError("Error during template fill ");
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
        if (result[0] === undefined) {
          return res.serverError("Internal Error")
        }
        var path = result[0].path;
        console.log(path)
        // Watermark file Here or not 
        //Including skipper disk
        console.log(result[0].aircraft_id)
        var status = await Data.find({
          id: result[0].aircraft_id
        })
        if (status === undefined) {
          return res.serverError("Unable to find aircraft linked to the file")
        } else {
          if (status.length !== 1) {
            return res.serverError("Not able to download this file")
          }
          console.log(status)
          var rs = status[0].Results_Status;
          var vs = status[0].Validated_Status;
          var text = "";
          if (rs === "Preliminary" && vs === "true") {
            text = "Preliminary Results";
          } else {
            if (!vs.length) {
              text = "Non Validated Data";
            }
          }
          if (text.length) {
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
    moment = require("moment");
    var fs = require('fs');
    var XLSX = require("js-xlsx");
    var config_data = require("./config.json");
    var idendification_data = require("./ident_config.json");
    var pdf_data = require("./pdf_config.json");
    var keys = Object.keys(config_data);
    var pdf_keys = Object.keys(pdf_data);
    var aircraft_data = {};
    req.file("file").upload({}, async function (err, uploads) {
      if (uploads === undefined) {
        return res.serverError("Upload did not work")
      }
      if (uploads.length > 7) {
        return res.serverError('User should only upload 7 files at once');
      }
      // Filter PDF vs XLS* Files
      var pdf_files = uploads.filter(upload => upload.filename.split(".").pop() == "pdf");

      var xls_files = uploads.filter(upload => upload.filename.split(".").pop().indexOf("xls") !== -1);
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
            var sub_keys = Object.keys(config_data[key]);
            for (var l = 0; l < sub_keys.length; l++) {
              sheet = sub_keys[l];
              if (workbook.SheetNames.includes(sheet) !== -1) {
                console.log("A WorkSheet has been found!");
                s = workbook.Sheets[sheet];
                var info_key = Object.keys(config_data[key][sheet]);
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
      });

      console.log("EXCEL DATA---> ", aircraft_data);

      //Before uploading data, check if there already exists a validated entry for this aircraft
      Data.find({
        Aircraft: aircraft_data["Aircraft"],
        MSN: aircraft_data["MSN"],
        Flight: aircraft_data["Flight"],
        Validated_Status: true
      }).exec(async function (err, results) {
        if (err) {
          console.error("Error validating entry ", err);
        }
        //If successful show error message and stop the file upload process
        else if (results.length) {
          return res.serverError("An entry for this flight has already been validated");
        } else {
          var criteria = _.pick(aircraft_data, ["Aircraft", "MSN", "Flight"]);
          // Patching Aircraft in case the flight is weighted after
          if (aircraft_data["Text Weighing"] === "After") {
            aircraft_data["Weighing"] = "After"
          }
          delete aircraft_data["Text_Weighing"]
          // Add Entry to DataBase now
          try {
            var uploaded_entry = await Data.findOrCreate(criteria, criteria);
          } catch (error) {
            console.log("More than one entry found");
            return res.serverError();
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
          aircraft_data["Results_Status"] = "Preliminary"
          // Try to open the CTR DataBase, If MSN not found then set fields to defaut
          var CTR_dict = await CtrTot.find({
            MSN: aircraft_data["MSN"]
          })
          if (CTR_dict.length == 1) {
            CTR_dict = CTR_dict[0]
            aircraft_data["CTR"] = CTR_dict.CTR !== undefined ? CTR_dict.CTR : ""
            aircraft_data["Delivery_Date"] = CTR_dict.Delivery_Date !== undefined ? CTR_dict.Delivery_Date : ""
          } else {
            aircraft_data["CTR"] = ""
            aircraft_data["Delivery_Date"] = ""
          }
          // TRA is filled by hand :/
          aircraft_data["TRA"] = ""
          try {
            var data = await Data.update(uploaded_entry).set(aircraft_data).fetch()
          } catch (error) {
            err = error
          }


          console.log("Finishing processing Files and redirection")
          if (err !== undefined && err !== null) {
            console.log('error uploading files')
            return res.serverError(err);
          }

          console.log("Redirection")
          // if it was successful redirect and display all uploaded files
          var headers = Data.getHeader()
          return res.view("pages/table/upload-results", {
            data: data,
            headers: headers,
            me: req.me
          })

        }
      })

    })

  },

  //Update the TRA comment column in the database
  update_tra_commment: function (req, res) {
    if (!req.body["flight_data"]) return res.status(500).send();

    //Updating the comment in database
    Data.update({
      Aircraft: req.body["flight_data"]["aircraft"],
      MSN: parseInt(req.body["flight_data"]["msn"]),
      Flight: parseInt(req.body["flight_data"]["flight"])
    }).set({
      TRA_Comment: req.body["tra_comment"]
    }).exec(function (err, entry) {
      if (err) {
        return res.serverError('Internal Error, could not update' + err)
      } else {
        return res.status(200).send(req.body["tra_comment"]);
      }
    });
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
          res.serverError('Internal Error, could not update' + err)
        }
      });
      return res.redirect('/files')
    })
  },


  validate: async function (req, res) {
    // Push Data to the server
    console.log("Some data will be pushed back to the server -- ", req.body)
    let sub_aircraft = req.body["aircraft"]["Aircraft"];
    let sub_flight_owner = req.body["aircraft"]["Flight_Owner"];

    var aircraft_data = {}
    aircraft_data["Commentary"] = _.escape(req.body["userCommentary"])
    // Date Formatting if Delivery date field is not empty
    moment = require("moment");
    aircraft_data["Delivery_Date"] = req.body["deliveryDate"].length > 0 ? moment(req.body["deliveryDate"]).format("DD/MM/YYYY") : ''
    var possible_entry = await Data.find(req.body.aircraft)
    if (possible_entry.length == 1) {
      // Update Entry if there is something new
      if (aircraft_data !== possible_entry[0]) {
        var data = await Data.update(req.body.aircraft, aircraft_data).fetch();
      }


      //Generate subscription corresponding ids
      let sub_ids = await Subscription.find().where({
        or: [{
            field_name: "aircraft",
            field_value: possible_entry[0]["Aircraft"]
          },
          {
            field_name: "flight_owner",
            field_value: possible_entry[0]["Flight_Owner"]
          }
        ]
      });

      console.log("SUB IDS", sub_ids);

      // See the whole table with the new entry 
      res.status(200);
      Subscription.publish(_.pluck(sub_ids, 'id'), {
        verb: 'Creation',
        author: req["me"].fullName,
        raw: possible_entry,
        msg: `${req["me"].fullName} has added a new entry for ${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`,
        data: `${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`
      }, req);

      return res.send("Sucessful Operation");
    }

    if (possible_entry.length == 0) {
      // Create new entry
      var data = await Data.create(aircraft_data).fetch();
      Subscription.publish(_.pluck(sub_ids, 'id'), {
        verb: 'Creation',
        author: req["me"].fullName,
        raw: possible_entry,
        msg: `${req["me"].fullName} has added a new entry for ${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`,
        data: `${possible_entry[0].Aircraft} - ${possible_entry[0].MSN} - ${possible_entry[0].Flight}`
      }, req);

      let subs_data = await Notification.create({
        flight_owner: sub_flight_owner,
        aicraft: sub_aircraft,
        user_id: req.me["id"],
        user_name: req.me["fullName"],
        modification: null,
        modificaion_value: null,
        data_id: data.id
      }).fetch();

      console.log("Created notification: ", subs_data);

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
    //console.log("Updating Data Entry")
    //console.log(req.body)
    if (req.body["id"] === "" || req.body["id"] === undefined) {
      // TODO Return an error, internal should not be undefined or an empty string
      return res.serverError("The internal id of the to update row was not found")
    }
    // Escaping for commentary (TODO Validation for other fields as well ?)
    req.body["Commentary"] = _.escape(req.body["Commentary"]);

    //Check for result status update
    let result_update = false;
    if (req.body["prev_result"] !== req.body["Results_Status"]) result_update = true;
    delete req.body["prev_result"];

    //Check for validation status update
    let validation_update = false;
    if (req.body["prev_validated"] !== req.body["Validated_Status"]) validation_update = true;
    delete req.body["prev_validated"];

    // Update Model Entry
    let updated_entry = await Data.update({
      "id": req.body["id"]
    }, req.body).fetch();

    //Generate subscription corresponding ids
    let sub_ids = await Subscription.find().where({
      or: [{
          field_name: "aircraft",
          field_value: updated_entry[0]["Aircraft"]
        },
        {
          field_name: "flight_owner",
          field_value: updated_entry[0]["Flight_Owner"]
        }
      ]
    });

    console.log("RES1VALIDATION UPDATE--->", result_update, validation_update);

    if (result_update) {
      let subs_data = await Notification.create({
        flight_owner: updated_entry[0]["Flight_Owner"],
        aircraft: updated_entry[0]["Aircraft"],
        user_id: req.me["id"],
        user_name: req.me["fullName"],
        modification: "result_status",
        modification_value: req.body["Results_Status"],
        data_id: updated_entry[0]["id"]
      }).fetch();
      //console.log("Result Status notification: ", subs_data);

      Subscription.publish(_.pluck(sub_ids, 'id'), {
        verb: 'Edition',
        author: req["me"].fullName,
        raw: updated_entry,
        msg: `${req["me"].fullName} has modified the results status of ${updated_entry[0].Aircraft} - ${updated_entry[0].MSN} - ${updated_entry[0].Flight}`,
        data: `${updated_entry[0].Aircraft} - ${updated_entry[0].MSN} - ${updated_entry[0].Flight}`
      }, req);
    } else if (validation_update) {
      let sub_data = await Notification.create({
        flight_owner: updated_entry[0]["Flight_Owner"],
        aircraft: updated_entry[0]["Aircraft"],
        user_id: req.me["id"],
        user_name: req.me["fullName"],
        modification: "validated_status",
        modification_value: (req.body["Validated_Status"]) ? "validated" : "not validated",
        data_id: updated_entry[0]["id"]
      }).fetch();
      //console.log("Validated Status notification: ", sub_data);

      Subscription.publish(_.pluck(sub_ids, 'id'), {
        verb: 'Edition',
        author: req["me"].fullName,
        raw: updated_entry,
        msg: `${req["me"].fullName} has modified the validated status of ${updated_entry[0].Aircraft} - ${updated_entry[0].MSN} - ${updated_entry[0].Flight}`,
        data: `${updated_entry[0].Aircraft} - ${updated_entry[0].MSN} - ${updated_entry[0].Flight}`
      }, req);
    }

    console.log('Database was updated');
    // Return Sucess If update was good
    res.status(200)
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

  delete: async function (req, res) {
    console.log(req.body);
    try {
      let destroyed_entry = await Data.destroy(req.body).fetch();

      let sub_ids = await Subscription.find().where({
        or: [{
            field_name: "aircraft",
            field_value: destroyed_entry[0]["Aircraft"]
          },
          {
            field_name: "flight_owner",
            field_value: destroyed_entry[0]["Flight_Owner"]
          }
        ]
      });

      Subscription.publish(_.pluck(sub_ids, 'id'), {
        verb: 'Deletion',
        author: req["me"].fullName,
        raw: destroyed_entry,
        msg: `${req["me"].fullName} has deleted the entry for ${destroyed_entry[0].Aircraft} - ${destroyed_entry[0].MSN} - ${destroyed_entry[0].Flight}`,
        data: `${destroyed_entry[0].Aircraft} - ${destroyed_entry[0].MSN} - ${destroyed_entry[0].Flight}`
      }, req);

      return res.send(200);

    } catch (error) {
      console.log("Error during deletion -> ", error);
      res.status(500);
      return res.send(error);
    }
  }
}
