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
    var nextLetter = function(char){
      var l = char
      if (l < 90) {
        return String.fromCharCode(l + 1);
      }
      else {
        return 'A';
      }
    }

    var same = function(str, char){
      var str = str;
    var char = char;
    var i = str.length;
    while (i--) {
      if (str[i] !== char) {
        return (false);
      }
    }
    return (true);
    }

    var nextChar = function(char){
      var c = char
      var u = c.toUpperCase();
      if (same(u, 'Z')) {
        var txt = '';
        var i = u.length;
        while (i--) {
          txt += 'A';
        }
        return (txt + 'A');
      } else {
        var p = "";
        var q = "";
        if (u.length > 1) {
          p = u.substring(0, u.length - 1);
          q = String.fromCharCode(p.slice(-1).charCodeAt(0));
        }
        var l = u.slice(-1).charCodeAt(0);
        var z = nextLetter(l);
        if (z === 'A') {
          return (p.slice(0, -1) + nextLetter(q.slice(-1).charCodeAt(0)) + z);
        } else {
          return (p + z);
        }
      }
    }

    idx_number = input.idx.match(/\d+/)[0]

    idx_stripped = input.idx.replace(idx_number, '')
    next_idx = nextChar(idx_stripped)

    exits.success(next_idx + idx_number)
  }
}
