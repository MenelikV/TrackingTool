module.exports = {


  friendlyName: 'Table display',


  description: 'Display the table, finally',

  exits: {

    success: {
      viewTemplatePath: 'pages/table/available-data',
      description: 'Display the table'
    },

  },

  fn: async function (inputs, exits) {
     var data = await Data.find();
     if(data){
       headers = Object.keys(data[0]);
       // Remove some fields
       hidden_fields = ["id", "createdAt", "updatedAt"]
       for(var k=0; k<hidden_fields.length; k++){
        var index = headers.indexOf(hidden_fields[k]);
        if (index > -1) {
          headers.splice(index, 1);
        }
       }
     }
     else{
       // Test Headers
       headers = ["TEST1", "TEST3", "TEST4"]
     }
    return exits.success({data:data, headers:headers});
  }

};
