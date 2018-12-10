module.exports = {
  friendlyName: 'Next Letter',


  description: 'Returns the next letter in alphabet',
  sync: true,


  inputs: {
    letter: {
      type: 'number',
      example: 2,
      required: true
    }
  },


  fn: function (input, exits) {
    var l = input.letter
    if (l < 90) {
      exits.success(String.fromCharCode(l + 1));
    }
    else {
      exits.success('A');
    }
  }
}
