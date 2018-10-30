/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: function(req, res) {
      // New aircraft if the last created entry, if it exists, display it
      if (aircraft_data === {}){res.send("No data found")}
      else{
        var headers = Data.getHeader();

        return res.view("pages/table/upload-results", { data: [aircraft_data], headers: headers })
      }
    },
 
    search: function(req,res) {
      //Search for files by the MSN 
      var results = File.find({
        aircraft: req.param('aircraft').toUpperCase()}).exec(function(err,results){
         
        if (err) {return res.serverError(err)}
        
        //If successful show corresponding files in a table
        if(results[0] == undefined) {
          return res.send('no data')
        }
        if(results !== undefined){
          return res.view('pages/account/view-results', {result: results, me:req.me})
        }   
      })
    },

    download: function (req, res) {
      //Finding file through id on the URL and selecting file path
      File.find({ id: req.param('id')}).exec(function (err, result) {
        if (err) { 
          res.send('error')
        }
  
        else if (result == undefined) {
          res.send('notfound')
        }
  
        else {
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
      req.file("file").upload({
      }, async function (err, uploads) {
        if (uploads === undefined) {
          return res.send("Upload did not work")
        }
        if(uploads.length > 7){
          return res.send("Maximum 7 files can be uploaded")
        }
        // Filter PDF vs XLS* Files
        var pdf_files = uploads.filter(upload => upload.filename.split(".").pop() == "pdf")
        var xls_files =  uploads.filter(upload => upload.filename.split(".").pop().indexOf("xls") !== -1)
        // Handle Excel Files First
        xls_files.forEach(file => {
          for(var k=0; k<keys.length; k++){
            var key = keys[k]
            if(file.filename.indexOf(key) !== -1){
               // Try to open the file, if it fails then report to the server
               try{workbook = XLSX.readFile(file.fd);}
               catch(error){err=error}
               var sub_keys = Object.keys(config_data[key])
               for(var l = 0; l < sub_keys.length; l++){
                 sheet = sub_keys[l];
                 if(workbook.SheetNames.includes(sheet) !== -1){
                   console.log("A WorkSheet has been found!")
                   s = workbook.Sheets[sheet]
                   var info_key = Object.keys(config_data[key][sheet])
                   var info = config_data[key][sheet];
                   for(var m=0; m<info_key.length; m++){
                        var prop = info_key[m];
                        if(prop==="Results"){
                            console.log("Crawling the table")
                            // Getting the info for the table is really diffrenet from the other properties
                            aircraft_data[prop] = sails.helpers.tableCrawler(info[prop], s)
                        }
                        else
                        {
                            console.log("Crawling Data")
                            if(sheet === "identification")
                            {
                              console.log(idendification_data)
                              console.log(prop)
                              console.log(s[info[prop]].v)
                              aircraft_data[prop] = idendification_data[prop][s[info[prop]].v]
                            }
                            else
                            {
                              aircraft_data[prop] = s[info[prop]].v
                            }
                   }}}
                 }
               }
            }
        })
        console.log("Handling PDF Files")
        for(const file of pdf_files){
          
          for(const k of pdf_keys){
            if (file.filename.toLowerCase().indexOf(k) !== -1) {
              aircraft_data[pdf_data[k]] = file.fd
              // Create a file entry in the Fike DataBase
              var createdFileEntry = await File.create({path: file.fd}).fetch()
              aircraft_data[pdf_data[k]+"_id"] = createdFileEntry.id;
          }
        }}
        // Default Value
        aircraft_data["Validated_Status"] = "Preliminary"
        // TRA is filled by hand :/
        aircraft_data["TRA"] = ""
        console.log("Finishing processing Files and redirection")
        console.log(err !== undefined && err!== null)
        console.log(err)
        if (err !== undefined && err !== null) { 
            console.log('error uploading files')
            return res.serverError(err) }       
        console.log("Redirection")
        // if it was successful redirect and display all uploaded files
        return res.redirect('/files');
      }
      )

    },

    validate: async function(req, res){
      // Push Data to the server
      console.log("Some data will be pushed back to the server")
       
       var a = await Data.create(aircraft_data)
      // See the whole table with the new entry 
      return res.redirect("/table")
    }
  }
