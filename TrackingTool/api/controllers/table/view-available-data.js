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
     var headers = Data.getHeader();
     let vis_headers = ["Aircraft", "MSN", "Flight", "Airline", "Flight Date", "Fuel Flowmeters", "Fuel Characteristics", "Weighing", "Results", "Aircraft Identification", "Airline Tables", "Tabulated Results", "Parameters Validation", "Fleet Follow Up", "TRA", "TRA Comment", "CTR", "Results Status", "Data Validated Status", "Commentary", "Delivery Date", "Trailing Cone"];
     var visible_headers = Data.getVisibleFields();

    return exits.success({data:data, headers:headers, search:false, visible_headers: vis_headers});
  }

};
