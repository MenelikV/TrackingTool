module.exports = {
  friendlyName: 'Table Crawler',


  description: 'Return a personalized greeting based on the provided name.',
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
    // TODO Move this code elsewhere ?
    var res = "<table table-bordered><tr>"
    res += "<th>Test n°</th>"
    res += "<th>Hp (ft)</th>"
    res += "<th>W/delta (tons)</th>"
    res += "<th>Mach</th>"
    res += "<th>D Specific Range (%)</th>"
    res += "</tr>"
    var data = input.sheet[input.start].v
    var idx = input.start;
    var start_idx = input.start;
    while (data !== "") {
      res += "<tr>"
      res += sails.helpers.tdWrap(data)
      // Beware special formatting
      idx = sails.helpers.columnShift(start_idx)
      res += Numbers.parseFloat(sails.helpers.tdWrap(input.sheet[idx].v)).toFixed(0)
      idx = sails.helpers.columnShift(idx)
      res += Numbers.parseFloat(sails.helpers.tdWrap(input.sheet[idx].v)).toFixed(0)
      idx = sails.helpers.columnShift(idx)
      // Mach Formatting, 3 numbers after the 
      res += Numbers.parseFloat(sails.helpers.tdWrap(input.sheet[idx].v)).toFixed(3)
      idx = sails.helpers.columnShift(idx)
      // DSR Formatting
      res += Numbers.parseFloat(sails.helpers.tdWrap(input.sheet[idx].v)).toFixed(2)
      start_idx = sails.helpers.rowShift(start_idx);
      console.log("DEBUGGGGGGGG")
      console.log(start_idx)
      data = input.sheet[start_idx].v;
      console.log(data === "")
      console.log(data === "\n")
      res += "</tr>"
    }
    res+="</table>"
    exits.success(res);
  },
}
