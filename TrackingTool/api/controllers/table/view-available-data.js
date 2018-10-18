module.exports = {
    friendlyName: 'View available aircraft data',


    description: 'Display a table "DATA" Page',
  
  
    exits: {
  
      success: {
        viewTemplatePath: 'pages/table/available-data'
      }
  
    },
    fn: async function(inputs, exits){
        // var url = require("url");
        // Get the list of data
        var aircrafts = await Data.find({})
        return exits.success({aircrafts: aircrafts})
    }

};