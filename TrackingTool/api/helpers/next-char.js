module.exports = {
  friendlyName: 'NextChar',


  description: 'Return the next column name in Excel',
  sync: true,


  inputs: {
    letter: {
      type: 'string',
      example: 'A',
      required: true
    }
  },


  fn: function (input, exits) {
    var c = input.letter
    var u = c.toUpperCase();
    if (sails.helpers.same(u, 'Z')) {
      var txt = '';
      var i = u.length;
      while (i--) {
        txt += 'A';
      }
      exits.success(txt + 'A');
    } else {
      var p = "";
      var q = "";
      if (u.length > 1) {
        p = u.substring(0, u.length - 1);
        q = String.fromCharCode(p.slice(-1).charCodeAt(0));
      }
      var l = u.slice(-1).charCodeAt(0);
      var z = sails.helpers.nextLetter(l);
      if (z === 'A') {
        exits.success(p.slice(0, -1) + sails.helpers.nextLetter(q.slice(-1).charCodeAt(0)) + z);
      } else {
        console.log(p+z)
        exits.success(p + z);
      }
    }
  }
}
