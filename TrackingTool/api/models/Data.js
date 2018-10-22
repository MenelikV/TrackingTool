module.exports = {
    attributes: {
        Aircraft: {
            type: "string",
            required: true,
            description: "Aircraft",
            example: "A320-251N"
        },
        Msn: {
            type: "number",
            required: true,
        },
        Flight: {
            type: "number",
            required: true,
        },
        FlightDate: {
            type: "string",
        },
        FuelFlowmeters: {
            type: "string",
            isIn: ["Massic", "Volumic"]
        },
        FuelCharacteristics:  {
            type: "string",
            isIn: ["Measured", "Estimated"]
        },
        Weighing: {
            type: "string",
            isIn: ["Before", "After", "Not Weighed"]
        },
        Results: {
            type: "string"
        },
        AircraftIdentification: {
            type: "string"
        },
        Airline: {
            type: "string"
        },
        TabulatedResults: {
            type: "string"
        },
        ParametersValidation: {
            type: "string"
        },
        FleetFollowUp: {
            type: "string"
        },
        TRA: {
            type: "string"
        },
        CTR: {
            type: "boolean",
            defaultsTo: false
        },
        ResultsStatus: {
            type: "string",
            isIn: ["Preliminary", "Definitive", "Investigation Ongoing"],
            defaultsTo: "Preliminary"
        },
        ValidatedStatus: {
            type: "boolean",
            defaultsTo: false
        }
    },
    datasore: "data"
}