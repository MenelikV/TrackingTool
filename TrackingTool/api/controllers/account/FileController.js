/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: function(req, res) {
        Data.find().exec(function(err, files){
            if(err){
                res.send(500, {error: 'DB error'});
            }
            if(files==undefined){
              res.send('no files found');
            }

            return res.view('pages/account/view-files', {result:files, me:req.me});
        })
    },

 
    search: function(req,res) {
      //Search for files by the MSN 
      
      var results = File.find({
        aircraft: req.param('aircraft').toUpperCase()}).exec(function(err,results){
         
        if (err) {return res.serverError(err)}
        

       
          console.log('THESE ARE THE RESULTS ...> '+results[0])
          return res.view('pages/account/view-results', {result: results, me: req.me, msn: req.param('aircraft')})
        

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


    upload: function(req, res) {
      req.file('file').upload({
          //Change according to local dirname
          dirname: 'C:/Users/vmasiero/Documents/GitHub/TrackingTool/TrackingTool/.tmp/uploads'
        }, function(err, uploads) {

          if(uploads.length > 5) {
            return res.send('Maximum 5 files can be uploaded')
          }
          //Upload multiple files
          uploads.forEach(file => {  
            //Get doctype of uploaded file          
            var data = file.filename.slice(file.filename.length-9,file.filename.length-4)
            console.log(data) 
            //Set doctype depending on the number
            if(data.includes('1'))
              {data = 'TabulatedResults'}
            
            if(data.includes('2'))
              {data = 'Airline'}
            
            if(data.includes('3'))
              {data = 'Fleet'}
            
            if(data.includes('4'))
              {data = 'AircraftID'}
            
            if(data.includes('5'))
              {data = 'Parameters'}
            //Create each file with corresponding parameters
            File.create({
              path: file.fd, 
              filename: file.filename,
              aircraft: file.filename.slice(0, file.filename.length-9),
              doc: data        
            }).exec(function(err, file) {              
              if (err) 
              { console.log('error in file')
                return res.serverError(err)
              }           
          }); 
        })          
          if (err) { 
            console.log('error uploading files')
            return res.serverError(err) }       
          //if (uploads.length === 0) { return res.badRequest('No file was uploaded') }

          // if it was successful redirect and display all uploaded files
            return res.redirect('/files');
      })
    },


    update: function (req,res) {
      console.log(req.param('id'));
   
      //Upload and create new PDF file (edit to match the temp branch version)
      req.file('file').upload({dirname: 'C:/Users/vmasiero/Documents/GitHub/TrackingTool/TrackingTool/.tmp/uploads'},function (err, upload) {
        if (err){
          res.send('error')
        }
  
        var file = upload[0]
        
        //Get doctype of uploaded file          
        var data = file.filename.slice(file.filename.length - 9, file.filename.length - 4)
        console.log(data)
        //Set doctype depending on the number
        if (data.includes('1')) { data = 'TabulatedResults' }
  
        if (data.includes('2')) { data = 'Airline' }
  
        if (data.includes('3')) { data = 'Fleet' }
  
        if (data.includes('4')) { data = 'AircraftID' }
  
        if (data.includes('5')) { data = 'Parameters' }
        //Create each file with corresponding parameters
  
        File.create({
          path: file.fd,
          filename: file.filename,
          aircraft: file.filename.slice(0, file.filename.length - 9),
          doc: data
        }).exec(function (err, newfile) {
          if (err) {
             res.send('err')
          }
        })
        
        //Assing the path of new file to a variable
        var new_path = file.fd;
        console.log('NEW= '+new_path)
  
        //Find the aircraft with the ID passed through the URL and update its file path with new one
        Data.update({id: req.param('id')}).set({entry:new_path}).exec( function (err, datafile){
  
          if(err){
            res.send('error')
          }
         console.log(datafile)
          
        })
  
   
        return res.redirect('/files')
      })

    }



  }