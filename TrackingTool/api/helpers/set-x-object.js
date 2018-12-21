module.exports = {
    friendlyName: 'setXObject',

    description: '',
    inputs: {
        xObject:{
            type: 'ref',
            required: true
        },
        gsName: {
            type: 'ref',
            required: true
        },
        font: {
            type: 'ref',
            required: true,
        },
        tmMatrix: {
            type: 'ref',
            required: true
        },
        text: {
            type: 'string',
            required: true
        }
    },
    sync: true,

    fn: function(req, exits){
        req.xObject.getContextContext()
                    .q()
                    .gs(req.gsName)
                    .BT()
                    .k(0,0,0,0.3)
                    .Tf(req.font, req.tmMatrix.lesserFontSize)
                    .Tm(req.tmMatrix.a, req.tmMatrix.b, req.tmMatrix.c, req.tmMatrix.e, req.tmMatrix.f)
                    .Tj(req.text)
                    .ET()
                    .Q()
    }
}