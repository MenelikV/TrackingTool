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
        Delivery_Date: {
            type: "string",
            defaultsTo: ""
        }
    },
    datastore: "ctr"
}