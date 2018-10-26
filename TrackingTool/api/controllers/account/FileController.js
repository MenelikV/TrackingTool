/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: function(req, res) {
      // New aircraft if the last created entry, if it exists, display it
      if(new_aircraft === undefined){res.send("No data found")}
      else{
        var headers = Data.getHeader();
        return res.view("pages/table/view-available-data", {result:new_aircraft, headers:headers})}
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

    th_wrap: function(field){
      return "<th>"+field+"</th>\n"
    },

    crawl_table: function (start, sheet)
    {
        new_aircraft = undefined
        aircraft_data["Results"] = "<tr>\n"
        aircraft_data["Results"]+="<th>Test n°</th>\n"
        aircraft_data['Results']+="<th>Hp (ft)</th>\n"
        aircraft_data['Results']+="<th>W/delta (tons)</th>\n"
        aircraft_data["Results"]+="<th>Mach</th>\n"
        aircraft_data["Results"]+="<th>D Specific Range (%)</th>\n"
        aircraft_data["Results"]+="</tr>\n"
        var data = sheet[start].v
        var idx = start;
        var start_idx = start;
        while(data !== "")
        {
          aircraft_data["Results"]+= "<tr>\n"
          aircraft_data["Results"]+=this.th_wrap(data)
          idx = column_shift(start_idx)
          aircraft_data["Results"]+=this.th_wrap(sheet[idx].v)
          idx = column_shift(idx)
          aircraft_data["Results"]+=this.th_wrap(sheet[idx].v)
          idx = column_shift(idx)
          aircraft_data["Results"]+=this.th_wrap(sheet[idx].v)
          idx = column_shift(idx)
          aircraft_data["Results"]+=this.th_wrap(sheet[idx].v)
          start_idx = row_shift(start_idx);
          data = sheet[start_idx].v;
          aircraft_data["Results"]+="</tr>\n"
        }
    },

    column_shift: function(idx)
    {
        idx_number = idx.match(/\d+/)[0]
        idx_stripped = idx.replace(idx_number, '')
        next_idx = this.nextChar(idx_stripped)
        return next_idx+idx_number

    }, 

    row_shift: function(idx)
    {
        idx_number = parseInt(idx.match(/\d+/)[0])
        idx_stripped = idx.replace(idx_number, '')
        return idx_stripped+String(idx_number+1)
    },

    nextChar: function(c) 
    {
        var u = c.toUpperCase();
        if (same(u,'Z')){
            var txt = '';
            var i = u.length;
            while (i--) {
                txt += 'A';
            }
            return (txt+'A');
        } else {
            var p = "";
            var q = "";
            if(u.length > 1){
                p = u.substring(0, u.length - 1);
                q = String.fromCharCode(p.slice(-1).charCodeAt(0));
            }
            var l = u.slice(-1).charCodeAt(0);
            var z = this.nextLetter(l);
            if(z==='A'){
                return p.slice(0,-1) + this.nextLetter(q.slice(-1).charCodeAt(0)) + z;
            } else {
                return p + z;
            }
        }
    },

    nextLetter: function(l){
      if(l<90){
          return String.fromCharCode(l + 1);
      }
      else{
          return 'A';
      }
  },
  
  same: function(str,char){
      var i = str.length;
      while (i--) {
          if (str[i]!==char){
              return false;
          }
      }
      return true;
  },

    create_pdf_link: function(file, field){
      console.log("Create PDF Link")
      return "<a href="+file.filename+">"+field+"</a>";

    },

    upload: function(req, res) {
      var XLSX = require("js-xlsx")
      var config_data = require("./config.json")
      var idendification_data = require("./ident_config.json")
      console.log(idendification_data)
      var pdf_data = require("./pdf_config.json")
      var dirname = 'C:/Users/mvero-ext/Documents/GitHub/TrackingTool/TrackingTool/.tmp/uploads'
      var keys = Object.keys(config_data)
      var pdf_keys = Object.keys(pdf_data)
      aircraft_data = {}
      req.file("file").upload({
        dirname: dirname
      }, function(err, uploads){
        if(uploads.length > 7){
          return res.send("Maximum 7 files can be uploaded")
        }
        // Filter PDF vs XLS* Files
        var pdf_files = uploads.filter(upload => upload.filename.split(".").pop() == "pdf")
        var xls_files =  uploads.filter(upload => upload.filename.split(".").pop().indexOf("xls") !== -1)
        console.log(pdf_files)
        console.log(xls_files)
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
                        if(prop==="table"){
                            console.log("Crawling the table")
                            // Getting the info for the table is really diffrenet from the other properties
                            aircraft_data[prop] = crawl_table(info[prop], s)
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
        var prefix = aircraft_data["Aircraft"]+" MSN "+aircraft_data["MSN"]
        pdf_files.forEach(file => {
            pdf_keys.forEach(k => {
              if(file.filename.indexOf(k) !== -1){
                aircraft_data[pdf_keys[k]] = this.create_pdf_link(file.fd, prefix+pdf_keys[k].replace('_', ' '))
              }
            })
          }
        )
        console.log("A new entry is about to be added to the database")
        // Create Data Entry using spread operator 
        new_aircraft = Data.create.apply(aircraft_data).fetch()
      }
      )
      console.log("Finishing processing Files and redirection")
      if (err) { 
        console.log('error uploading files')
        return res.serverError(err) }       

      // if it was successful redirect and display all uploaded files
        return res.redirect('/files');
    },
  }