module.exports = {
  friendlyName: 'TH Wrapper',


  description: 'Return a personalized greeting based on the provided name.',
  sync: true,


  inputs: {
    field: {
      type: 'string',
      example: 'Field',
      description: 'Wrapping content in a th tag',
      required: true
    }
  },


  fn: function (input, exits) {
    exits.success("<th>" + input.field + "</th>\n")
  }
}
