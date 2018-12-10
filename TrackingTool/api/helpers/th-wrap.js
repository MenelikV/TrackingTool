module.exports = {
  friendlyName: 'TH Wrapper',


  description: 'Return html formatted string.',
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
    exits.success('<th style="text-align: center" class="text-center">' + input.field + "</th>\n")
  }
}
