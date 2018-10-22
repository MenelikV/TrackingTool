/**
 * AdminUserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    uploadFile : function(req, res){

		req.file('file').upload({
            // Change directory to corresponding local one
            
			dirname : 'C:/Users/vmasiero/Documents/GitHub/TrackingTool/TrackingTool/.tmp/files'
			
		},function(err, file){
			if(err) console.log(err);
			res.json({"status" : "file upload successfully" , "file" :file});
		});
	}

};

