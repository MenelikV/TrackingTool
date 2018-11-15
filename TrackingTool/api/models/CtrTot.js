module.exports = {
    attributes: {
        MSN: {
            type: "number",
            required: true,
            unique: true
        },
        CTR: {
            type: "boolean",
            defaultsTo: false,
        },
        DeliveryDate: {
            type: "string",
            defaultsTo: ""
        }
    },
    datastore: "ctr"
}