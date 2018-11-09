module.exports = {
    friendlyName: 'Extract The Required Dictionary',
  
  
    description: 'Extract a sub dictionary from the input object',
    sync: true,
  
  
    inputs: {
      aircraft: {
        type: 'ref',
        description: "Aircraft object",
        required: true
      },
    },
  
  
    fn: function (input, exits) {
      console.log("Extracting the minimal required keys from the aircraft object");
      exits.success({
          Flight:input.aircraft["Flight"],
          MSN: input.aircraft["MSN"],
          Flight_Date: input.aircraft["Flight_Date"],
          Aircraft: input.aircraft["Aircraft"]
    })
    }
}
  