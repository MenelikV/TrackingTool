module.exports = {
    friendlyName: "Watermark my Results",

    description: "Create a watermark on PDF",
    sync: true,

    inputs:{
        file:{
            type: 'string',
            description: "Absolute path of the file to watermark",
            required: true
        },
        text: {
            type: 'string',
            description: "Watermark Text",
            required: true
        }
    },
    fn : function(res, exits){
        var hummus = require("hummus")
        var output = sails.helpers.rename(res.file, sails.helpers.uuid())
        var pdfWriter = hummus.createWriterModify(res.file, {
            modifiedFilePath: output
        })
        // TODO Include Font
        const font = pdfWriter.getFontForFile("./Arial.ttf")
        const fontSize = 50;
        const WatermarkText = res.text
        var matrixCache = {}
        var objectCache = {}
        var pdfReader = hummus.createReader(res.file)
        const opacity = 0.1
        for(var i = 0; i < pdfReader.getPagesCount(); i++){
            // Pages Dimensions
            const pageDimensions = pdfReader.parsePage(i).getCropBox()
            var result = getTextMatrix(matrixCache, WatermarkText, font, fontSize, pageDimensions[2], pageDimensions[3],
                opacity)
            const tmMatrix = result.tmMatrix
            matrixCache = result.matrixCache

            result = createXObject(tmMatrix, objectCache, WatermarkText, font, pageDimensions, pdfWriter)
            var xObject = result.xObject
            objectCache = result.objectCache

            var pageModifier = new hummus.PDFPageModifier(pdfWriter, i)


            var modifier = pageModifier.startContext().getContext();
            modifier.q()
                    .cm(1,0,0,1,0,35) // Set Current Matrix - scale to 100% both directions, translate 0, 35
                    .doXObject(xObject)
                    .Q()
            pageModifier.endContext().writePage()
        }
        pdfWriter.end()
    }
}