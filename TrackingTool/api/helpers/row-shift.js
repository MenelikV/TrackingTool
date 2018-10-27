module.exports = {
  friendlyName: 'Excel Row Shifting',


  description: 'Return the name of the next row',
  sync: true,


  inputs: {
    idx: {
      type: 'string',
      example: 'A23',
      description: 'Current Index in Excel Sheet',
      required: true
    }
  },


  fn: function (input, exits) {
    var idx_number = parseInt(input.idx.match(/\d+/)[0])
    var idx_stripped = input.idx.replace(idx_number, '')
    exits.success(idx_stripped + String(idx_number + 1))
  }
}
