/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: function(req, res) {
        File.find().exec(function(err, files){
            if(err){
                res.send(500, {error: 'DB error'});
            }
            if(files==undefined){
              res.send('no files found');
            }
            return res.view('pages/account/view-files', {result:files});
        })
    },
 
    search: function(req,res) {
      //Search for files by the MSN 
      var results = File.find({
        aircraft: req.param('aircraft').toUpperCase()}).exec(function(err,results){
         
        if (err) {return res.serverError(err)}
        
        //If successful show corresponding files in a table
        if(results !== undefined){
          return res.view('pages/account/view-results', {result: results})
        }   
      })
    },
    fields: function(req, res) {
      var _fields = ["Results", "Identification", "Tabulated Results","Airline", "Fleet Follow-Up", "Aircraft Identitifcation", "Parameter Validation"]
      return res.view("/pages/account/upload-files", {fields: _fields})
    },

    pdf_fields: function(){
      return _fields.slice(3)
    },

    crawl_table: function (start, sheet, res)
    {
        res['Test n°'] = []
        res['Hp (ft)'] = []
        res["W/delta (tons)"] = []
        res["Mach"] = []
        res["D Specific Range (%)"] = []
        var data = sheet[start].v
        var idx = start;
        var start_idx = start;
        while(data !== "")
        {
            res['Test n°'].push(data);
            idx = column_shift(start_idx)
            res['Hp (ft)'].push(sheet[idx].v);
            idx = column_shift(idx)
            res["W/delta (tons)"].push(sheet[idx].v)
            idx = column_shift(idx)
            res["Mach"].push(sheet[idx])
            idx = column_shift(idx)
            res["D Specific Range (%)"].push(sheet[idx].v)
            start_idx = row_shift(start_idx);
            data = sheet[start_idx].v;
        }
    },

    column_shift: function(idx)
    {
        idx_number = idx.match(/\d+/)[0]
        idx_stripped = idx.replace(idx_number, '')
        next_idx = nextChar(idx_stripped)
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
            var z = nextLetter(l);
            if(z==='A'){
                return p.slice(0,-1) + nextLetter(q.slice(-1).charCodeAt(0)) + z;
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

    identification_crawl: function(err, file){
      console.log("I am in the indentifacation crawl")
      return file.filename;
    },
    pdf_crawl: function(err, file){
      console.log("PDF Crawl")
      return "<a href="+file.filename+">";

    },
    results_crawl: function(err, file){
      console.log("I am in the results crawml function")
      console.log(file.filename)
      return file.filename;
    },

    upload: function(req, res) {
      // TODO
      var XLSX = require("js-xlsx")
      var config_data = require("./config.json")
      var idendification_data = require("./ident_config.json")
      var dirname = 'C:/Users/mvero-ext/Documents/GitHub/TrackingTool/TrackingTool/.tmp/uploads'
      res = {}
      res.push(req.file("Results").upload(dirname, this.results_crawl(err, file)))
      res.push(req.file("Identification").upload(dirname, this.identification_crawl(err, file)))
      var pdf_field_list = this.pdf_fields()
      for(var i=0; i<pdf_field_list.length; i++){
        req.file(pdf_field_list[i]).upload(dirname, this.pdf_crawl)
      }
      if (err) { 
        console.log('error uploading files')
        return res.serverError(err) }       

      // if it was successful redirect and display all uploaded files
        return res.redirect('/files');
    },
  }