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
            isIn: ["Massic", "Volumetric"]
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
        Airline_id: {
            type: "string"
        },
        Tabulated_Results: {
            type: "string"
        },
        Tabulated_Results_id: {
            type: "string"
        },
        Parameters_Validation: {
            type: "string"
        },
        Parameters_Validation_id: {
            type: "string"
        },
        Fleet_Follow_Up: {
            type: "string"
        },
        Fleet_Follow_Up_id:{
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
            isIn: ["Preliminary", "Definitive", "Investigation", "In Progress"],
            defaultsTo: "Preliminary"
        },
        Validated_Status: {
            type: "string",
            defaultsTo: ""
        },
        Commentary: {
            type: "string",
            defaultsTo: ""
        },
        Delivery_Date: {
            type: "string",
            defaultsTo: ""
        }
    },
    datastore: "data",
    getHeader: function(){
        return ["CTR", "Results_Status", "Validated_Status", "Aircraft", "MSN","Flight", "Flight_Date", "Delivery_Date", "Results", "Airline", "Tabulated_Results", "Parameters_Validation", "Fleet_Follow_Up", "Flight_Owner", "Fuel_Flowmeters", "Fuel_Characteristics", "Weighing", "TRA", "Commentary"]
  },
  pdfFields: function () {
    return ["Airline", "Tabulated_Results", "Parameters_Validation","Fleet_Follow_Up"]
  },
  getFields: function(){
      return ["Aircraft", "Airline", "Airline_id", "Commentary", "CTR", "Delivery_Date", "Fleet_Follow_Up", "Fleet_Follow_Up_id", "Flight", "Flight_Date", "Flight_Owner", "Fuel_Caracteristic", "Fuel_Flowmeters", "MSN", "Parameters_Validation", "Parameters_Validation_id", "Results", "Results_Status", "Tabulated_Results", "Tabulated_Results_id","TRA", "Validated_Status", "Weighing"]
  }
}
