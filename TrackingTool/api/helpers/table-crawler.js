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
    var res = "<table><tr>"
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
      idx = sails.helpers.columnShift(start_idx)
      res += sails.helpers.tdWrap(input.sheet[idx].v)
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.tdWrap(input.sheet[idx].v)
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.tdWrap(input.sheet[idx].v)
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.tdWrap(input.sheet[idx].v)
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
