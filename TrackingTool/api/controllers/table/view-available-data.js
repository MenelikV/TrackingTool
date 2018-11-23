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
       var headers = Object.keys(data[0]).slice(2)
     }
     else{
       var headers = []
     }
     data = data.map(d => Object.values(d).slice(2))
     var visible_headers = Data.getVisibleFields()
    return exits.success({data:data, headers:headers, search:false, visible_headers: visible_headers});
  }

};
