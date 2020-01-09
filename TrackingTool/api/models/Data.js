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
        Airline: {
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
        Aircraft_Identification:{
            type: "string"
        },
        Aircraft_Identification_id:{
            type: "string"
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
        Data_Validated_Status: {
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
    //datastore: "data",
    getHeader: function(){
        return Object.keys(this.attributes)
  },
  pdfFields: function () {
    return ["Aircraft_Identification", "Airline", "Tabulated_Results", "Parameters_Validation","Fleet_Follow_Up"]
  },
  getVisibleFields: function(){
    var visible_headers = Object.keys(this.attributes)
    for(let name of ["createdAt", "updatedAt", "id", "Aircraft_Identification_id",  "Airline_id", "Tabulated_Results_id", "Parameters_Validation_id", "Fleet_Follow_Up_id"]){
        visible_headers.splice(visible_headers.indexOf(name), 1)
      }
    visible_headers = visible_headers.map(l => l.replace(/_/g, ' '))
    return visible_headers
  }
}
