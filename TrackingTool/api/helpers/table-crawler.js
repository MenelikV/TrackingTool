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
    var res = '<table class="table-bordered"><tr>'
    res += sails.helpers.thWrap("Test n°")
    res += sails.helpers.thWrap("Hp (ft)")
    res += sails.helpers.thWrap("W/delta (tons)")
    res += sails.helpers.thWrap("Mach")
    res += sails.helpers.thWrap("D Specific Range (%)")
    res += "</tr>"
    var data = input.sheet[input.start].v
    var idx = input.start;
    var start_idx = input.start;
    while (data !== "") {
      res += "<tr>"
      res += sails.helpers.tdWrap(data)
      // Beware special formatting
      idx = sails.helpers.columnShift(start_idx)
      res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(0))
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(0))
      idx = sails.helpers.columnShift(idx)
      // Mach Formatting, 3 numbers after the 
      res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(3))
      idx = sails.helpers.columnShift(idx)
      // DSR Formatting
      res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(2))
      start_idx = sails.helpers.rowShift(start_idx);
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
