module.exports = {
  friendlyName: 'Excel Column Shifting',


  description: 'Return the next column.',
  sync: true,


  inputs: {
    idx: {
      type: 'string',
      example: 'B24',
      description: 'Current Index in Excel Sheet',
      required: true
    }
  },


  fn: function (input, exits) {

    idx_number = input.idx.match(/\d+/)[0]

    idx_stripped = input.idx.replace(idx_number, '')

    next_idx = sails.helpers.nextChar(idx_stripped)

    exits.success(next_idx + idx_number)
  }
}
