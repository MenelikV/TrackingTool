module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',

  viewTemplatePath: 'pages/faq',
  exits: {

    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/faq'
    }
  },
  render : async function (inputs, exits) {
    var data = await Data.findOne({Flight:2});
    if(!data){
      return exits.notFound("The Flight was NOT Found");
    }
    exits.view("profile", {data});
    // TODO
  }

};
