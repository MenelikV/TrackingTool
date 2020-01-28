module.exports = {
  friendlyName: 'SearchSheet',


  description: 'Search a given sheet for a given parameter. Return parameters value.',
  sync: true,

  inputs: {
    sheet: {
      type: 'ref',
      required: true
    },
    value_reg: {
      type: 'ref',
      required: true
    }
  },


  fn: function (input, exits) {
    //SO script
    let reg_value = input.value_reg;
    let array_sheet = input.sheet;
    let match_text;
    let match_col;
    let match_row;
    var match;

    for (let i = 0; i < array_sheet.length; i++) {
      match = false;
      let current_row = array_sheet[i];
      for (let j = 0; j < current_row.length; j++) {
        if (match === true) break;
        let current_val = current_row[j];
        if (reg_value.test(current_val)) {
          match = true;
          match_text = current_val;
          match_col = j;
        }
      }
      if (match === true) {
        match_row = i;
        break;
      }
    }

    if (match) {
      let match_value = array_sheet[match_row + 2][match_col];
      exits.success(match_value);
    } else {
      exits.success(false);
    }

  }
}
