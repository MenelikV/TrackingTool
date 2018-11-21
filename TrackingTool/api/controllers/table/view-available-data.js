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
     if (data.length){
       var headers = Object.keys(data[0])
     }
     else{
       var headers = []
     }
     var liste = []
     for(var i=0; i<data.length; i++){
       liste.push(Object.values(data[i]))
     }
    return exits.success({data:data, headers:headers, liste:liste, search:false});
  }

};
