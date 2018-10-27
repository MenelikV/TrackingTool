module.exports = {
  friendlyName: 'Create PDF Link',


  description: 'Create the PDF Link Tag',
  sync: true,


  inputs: {
    file: {
      type: 'ref',
      description: "File Object containing a filename attribute",
      required: true
    },
    field: {
      type: 'string',
      description: "Text which will appear in the link",
      required: true
    }
  },


  fn: function (input, exits) {
    console.log("Create PDF Link")
    exits.success("<a href=" + "file:///**".replace("**", input.file) + " " + 'style="display: block;">' + input.field + "</a>");
  }
}
