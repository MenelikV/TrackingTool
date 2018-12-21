module.exports = {
    friendlyName: 'Rename',
  
  
    description: 'Modify an existing absolute path in order to rename a file.',
    sync: true,
  
  
    inputs: {
      path: {
        type: 'string',
        required: true
      },
      newName: {
          type: 'string',
          required: true
      }
    },
  
  
    fn: function (input, exits) {
      const path = require("path")
      var dir = path.dirname(input.path)
      var ext = path.extname(input.path)
      var newName = input.newName
      if(!newName.endsWith(ext)){
          newName+=ext
      }
      var res = path.join([dir, newName])
      exits.success(res)
    }
  }
  