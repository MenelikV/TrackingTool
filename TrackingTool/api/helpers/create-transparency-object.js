module.exports = {
    friendlyName: "createTransparencyObject",
    sync: true,
    description: "",
    inputs: {
        pdfWriter: {
            type: 'ref'
        }
    },
    fn: function(inputs,exits){
        var objCxt = inputs.pdfWriter.getObjectsContext();
        var gsId = objCxt.startNewIndirectObject();
        var dict = objCxt.startDictionary()
        dict.writeKey("type");
        dict.writeNameValue("ExtGState");
        dict.writeKey("ca");
        objCxt.writeNumber(0.5);
        objCxt.endLine();
        objCxt.endDictionary(dict);
        exits.success(gsId)
    }
}