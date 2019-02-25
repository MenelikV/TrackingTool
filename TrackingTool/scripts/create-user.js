module.exports = {

    description: 'Create an new user with some rights',
    friendlyName: 'CreateUser',
  
    inputs: {
      fullName: {
        description: 'Full Name of the new user',
        type: 'string',
        defaultsTo: 'John_Doe'
      },
      external:{
          description: "Boolean to tell if the personn is a subcontractor from Airbus",
          type: "bool",
          defaultsTo: false
      },
      isSuperAdmin: {
          description: "Boolean to tell if the personn is an admin",
          type: "bool",
          defaultsTo: false
      },
      randomPass: {
          description: "Hard or light password",
          type: "bool",
          defaultsTo: false
      },
      isBasicUser: {
          description: "Is the user part of High Speed Performance Team",
          type: "bool",
          defaultsTo: false
      }
    },
  
    fn: async function (inputs, exits) {
        // Generate the mail
        console.log(inputs)
        name = inputs.fullName.split("_")
        if(name.length !== 2){
            console.error(`Problem with name ${inputs.fullName}`)
            return exits.error(`Problem with name ${inputs.fullName}`)
        }
        else{
            firstName = name[0]
            LastName = name[1]
        }
        if(inputs.external){
            var mail = `${firstName.toLowerCase()}.${LastName.toLowerCase()}.external@airbus.com`
        }
        else{
            var mail = `${firstName.toLowerCase()}.${LastName.toLowerCase()}@airbus.com`
        }
        if(inputs.randomPass){
            // Simple random string generation
            var pass = (Math.random()+6).toString(36).substring(10);
        }
        else{
            var pass = firstName.toLowerCase()
        }
        console.log(pass)
        var hashed_pass = await sails.helpers.passwords.hashPassword(pass)
        await User.findOrCreate({fullName: inputs.fullName}, {
            emailAddress: mail,
            fullName: inputs.fullName.replace(/_/gm, " "),
            isSuperAdmin: inputs.isSuperAdmin,
            isBasicUser: inputs.isBasicUser,
            isApproved: true,
            password: hashed_pass,
          })
  
      return exits.success();
  
    }
  };