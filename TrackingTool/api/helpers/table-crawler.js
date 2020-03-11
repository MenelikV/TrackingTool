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
      if ((Number.parseFloat(input.sheet[idx].v).toFixed(0)) !== "NaN") res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(0));
      else  res += sails.helpers.tdWrap("/");

      idx = sails.helpers.columnShift(idx)

      if ((Number.parseFloat(input.sheet[idx].v).toFixed(0)) !== "NaN") res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(0));
      else  res += sails.helpers.tdWrap("/");

      idx = sails.helpers.columnShift(idx)
      // Mach Formatting, 3 numbers after the 
      if ((Number.parseFloat(input.sheet[idx].v).toFixed(3)) !== "NaN") res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(3));
      else  res += sails.helpers.tdWrap("/");

      idx = sails.helpers.columnShift(idx)
      // DSR Formatting
      if ((Number.parseFloat(input.sheet[idx].v).toFixed(2)) !== "NaN") res += sails.helpers.tdWrap(Number.parseFloat(input.sheet[idx].v).toFixed(2));
      else  res += sails.helpers.tdWrap("/");

      start_idx = sails.helpers.rowShift(start_idx);
      data = input.sheet[start_idx].v;
      res += "</tr>"
    }
    res += "</table>"
    exits.success(res);
  },
}
