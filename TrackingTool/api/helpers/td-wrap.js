module.exports = {
    friendlyName: 'TD Wrapper',
  
  
    description: 'Return html formatted string.',
    sync: true,
  
  
    inputs: {
      field: {
        type: 'string',
        example: 'Field',
        description: 'Wrapping content in a td tag',
        required: true
      }
    },
  
  
    fn: function (input, exits) {
      exits.success('<td style="text-align: center; vertical-align: middle;">' + input.field + "</td>\n")
    }
  }