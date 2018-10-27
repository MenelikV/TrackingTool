module.exports = {
    attributes: {
        Aircraft: {
            type: "string",
            required: true,
            description: "Aircraft",
            example: "A320-251N"
        },
        MSN: {
            type: "number",
            required: true,
        },
        Flight: {
            type: "number",
            required: true,
        },
        Flight_Owner: {
            type: "string"
        },
        Flight_Date: {
            type: "string",
        },
        Fuel_Flowmeters: {
            type: "string",
            isIn: ["Massic", "Volumic"]
        },
        Fuel_Characteristics:  {
            type: "string",
            isIn: ["Measured", "Estimated"]
        },
        Weighing: {
            type: "string",
            isIn: ["Before", "After", "Not Weighed"]
        },
        Results: {
            type: "string",
            defaultsTo: ""
        },
        Airline: {
            type: "string"
        },
        Tabulated_Results: {
            type: "string"
        },
        Parameters_Validation: {
            type: "string"
        },
        Fleet_Follow_Up: {
            type: "string"
        },
        TRA: {
            type: "string"
        },
        CTR: {
            type: "string",
            defaultsTo: ""
        },
        Results_Status: {
            type: "string",
            isIn: ["Preliminary", "Definitive", "Investigation Ongoing"],
            defaultsTo: "Preliminary"
        },
        Validated_Status: {
            type: "string",
            defaultsTo: ""
        },
    },
    datasore: "data",
    getHeader: function(){
        return ["CTR", "Results_Status", "Validated_Status", "Aircraft", "MSN","Flight", "Flight_Date", "Results", "Airline", "Tabulated_Results", "Parameters_Validation", "Fleet_Follow_Up", "Flight_Owner", "Fuel_Flowmeters", "Fuel_Characteristics", "Weighing"]
  },
  pdfFields: function () {
    return ["Airline", "Tabulated_Results", "Parameters_Validation","Fleet_Follow_Up"]
  }
}