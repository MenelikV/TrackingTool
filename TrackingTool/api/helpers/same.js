module.exports = {
  friendlyName: 'Is it the same ?',


  description: 'helper function',
  sync: true,


  inputs: {
    str: {
      type: 'string',
      description: "Some String",
      required: true
    },
    char: {
      type: 'string',
      description: "Some Char",
      required: true
    }
  },


  fn: function (input, exits) {
    var str = input.str;
    var char = input.char;
    var i = str.length;
    while (i--) {
      if (str[i] !== char) {
        exits.success(false);
      }
    }
    exits.success(true);
  }
}
