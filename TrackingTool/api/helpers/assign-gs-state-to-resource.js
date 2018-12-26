module.exports = {
    friendlyName: "assignGsStateToResource",
    description: "",
    sync: true,
    inputs: {
        xObject: {
            type: 'ref'
        },
        gsId: {
            type: 'ref'
        }
    },
    fn: function(inputs, exits){
        var resourcesDict = inputs.xObject.getResourcesDictinary(); // This is not a typo =~=
        exits.success(resourcesDict.addExtGStateMapping(inputs.gsId))
    }
}