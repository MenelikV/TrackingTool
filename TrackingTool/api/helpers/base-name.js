module.exports = {
  friendlyName: 'Get the basename',
  sync: true,


  description: 'Return the basename of a path',


  inputs: {
    path: {
      type: 'string',
      example: 'C:\\Users\\',
      description: 'File/Folder Path',
      required: true
    }
  },


  fn: function (input, exits) {
    exits.success(input.path.split(/[\\/]/).pop());
  }
}
