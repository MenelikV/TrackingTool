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

                res.send(500, {error: 'mamaste'});
            }
            return res.view( 'pages/account/view-files', {result:files});
        })
    },


    upload: function(req, res) {
      req.file('file') // this is the name of the file in your multipart form
        .upload({
          dirname: 'C:/Users/vmasiero/Documents/GitHub/TrackingTool/TrackingTool/.tmp/uploads'
        }, function(err, uploads) {

          if (err) { return res.serverError(err) }

          
          if (uploads.length === 0) { return res.badRequest('No file was uploaded') }
 

          File.create({
            path: uploads[0].fd,
            filename: uploads[0].filename,
          }).exec(function(err, file) {
            if (err) { return res.serverError(err) }

            // if it was successful return the registry in the response
            return res.view('pages/account/view-files', {result: uploads});
          })
        })
    },


  }