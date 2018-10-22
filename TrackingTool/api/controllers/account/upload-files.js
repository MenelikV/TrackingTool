module.exports = {


    
  friendlyName: 'Update Files',


  description: 'Update the password for the logged-in user.',

	exits: {

    success: {
      viewTemplatePath: 'pages/account/upload-files',
    }

  },

    fn: function(req, res) {
			console.log('entreeee');
      req.file('file').upload({
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
    }

};
