module.exports = {
    friendlyName: 'CTR Table Crawler',
  
  
    description: 'Crawl the Excel file to get all CTR, MSN and Delivery Dates',
    sync: true,
  
  
    inputs: {
      start: {
        type: 'ref',
        description: 'Start Index',
        required: true
      },
      sheet: {
        type: 'ref',
        description: 'Working Excel Worksheet',
        required: true
      },
    },
  
  
    fn: function (input, exits) {
      var moment = require("moment")
      var res = {}
      res["MSN"] = []
      res["Delivery_Date"] = []
      res["CTR"] = []
      var data = input.sheet[input.start].v
      var idx = input.start;
      var start_idx = input.start;
      while (data !== "") {
        res['MSN'].push(data);
        idx = sails.helpers.columnShift(start_idx)
        res['Delivery_Date'].push(moment(input.sheet[idx].w).format("DD/MM/YYYY"));
        idx = sails.helpers.columnShift(idx)
        if(input.sheet[idx].v === "YES"){
          res["CTR"].push("y")
        }
        else{
          res["CTR"].push("")
        }
        start_idx = sails.helpers.rowShift(start_idx);
        data = input.sheet[start_idx] !== undefined ? input.sheet[start_idx].v : ""; 
      }
      exits.success(res);
    },
  }
  