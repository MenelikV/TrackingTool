module.exports = {


    
    friendlyName: 'View Files',
  
  
    description: 'View uploaded files',
  
      exits: {
  
      success: {
        viewTemplatePath: 'pages/account/view-files',
      }
  
    },
  
      fn: function(req, res) {
        File.find().exec(function(err,files){
            if(err){
                res.send(500, {error: 'mamaste'});
            }
            return res.view( {result:files});
        })
    }
  
  };