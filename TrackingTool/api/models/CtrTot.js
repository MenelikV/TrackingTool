module.exports = {
    attributes: {
        MSN: {
            type: "number",
            required: true,
            unique: true
        },
        CTR: {
            type: "string",
            defaultsTo: "",
        },
        Delivery_Date: {
            type: "string",
            defaultsTo: ""
        }
    },
    //datastore: "ctr"
}