module.exports = {
    friendlyName: "getTextMatrix",
    sync: true,
    description: "",
    inputs:{
        matrixCache:{
            type: 'ref',
            required: true
        },
        text: {
            type: 'string',
            required: true
        },
        font: {
            type: 'ref',
            required: true
        },
        fontSize: {
            type: 'number',
            required: true
        },
        pageRight: {
            type: 'ref',
            required: true
        },
        pageTop: {
            type: 'ref',
            required: true
        },
        options: {
            type: 'number'
        }

    },
    fn: function(inputs, exits){

    var pageTop = inputs.pageTop;
    var pageRight = inputs.pageRight;
    let cachedMatrix = inputs.matrixCache[`${pageRight} ${pageTop}`];

    if (cachedMatrix) {
        exits.success({ tMatrix: cachedMatrix, matrixCache: matrixCache })
    }

    const hypot = Math.hypot(pageTop, pageRight);
    let angle = 0;
    let textDimensions = inputs.font.calculateTextDimensions(inputs.text, inputs.fontSize);
    let lesserFontSize = intpus.fontSize;

    while (textDimensions.width > hypot * 0.8) {
        inputs.fontSize--;
        lesserFontSize = inputs.fontSize;
        textDimensions = inputs.font.calculateTextDimensions(inputs.text, inputs.fontSize);
    }

    const textWidth = textDimensions.width;
    const textHeight = textDimensions.height;
    const diagonalOffset = (hypot - textWidth) / 2;

    angle = -(Math.atan(pageTop / pageRight)).toFixed(2);

    const rightOffset = (diagonalOffset * Math.sin(-angle));
    const bottomOffset = (diagonalOffset * Math.cos(-angle));

    let tMatrix = {
        a: Math.cos(angle),
        b: -Math.sin(angle),
        c: Math.sin(angle),
        d: Math.cos(angle),
        e: bottomOffset,
        f: rightOffset,
        lesserFontSize,
    }

    matrixCache[`${pageRight} ${pageTop}`] = tMatrix;

    exits.success({ tMatrix: tMatrix, matrixCache: matrixCache })

    }
}