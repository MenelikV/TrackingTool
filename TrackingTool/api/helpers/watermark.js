/*

This module writes a transparent watermark/stamp across every page in the supplied pdf.
It writes the watermark from the bottom left to the top right  at the fontSize specified.
If it is calculated that the text is too long to fit then the font size is reduced.


Adapted from:
https://github.com/galkahana/HummusJS/issues/242
https://github.com/AndreMocke91
https://github.com/richard-kurtosys

*/

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
    fn: function(inputs, exits){

        var getTextMatrix = function(matrixCache, text, font, fontSize, pageRight, pageTop) {

            pageTop = pageTop;
            pageRight = pageRight;
            let cachedMatrix = matrixCache[`${pageRight} ${pageTop}`];
        
            if (cachedMatrix) {
                return { tMatrix: cachedMatrix, matrixCache: matrixCache };;
            }
        
            const hypot = Math.hypot(pageTop, pageRight);
            let angle = 0;
            let textDimensions = font.calculateTextDimensions(text, fontSize);
            let lesserFontSize = fontSize;
        
            while (textDimensions.width > hypot * 0.8) {
                fontSize--;
                lesserFontSize = fontSize;
                textDimensions = font.calculateTextDimensions(text, fontSize);
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
        
            return { tMatrix: tMatrix, matrixCache: matrixCache };
            }
        var createTransparencyObject = function(pdfWriter) {
                var objCxt = pdfWriter.getObjectsContext();
                var gsId = objCxt.startNewIndirectObject();
                var dict = objCxt.startDictionary()
                dict.writeKey("type");
                dict.writeNameValue("ExtGState");
                dict.writeKey("ca");
                objCxt.writeNumber(0.5);
                objCxt.endLine();
                objCxt.endDictionary(dict);
                return gsId;
                }
        var assignGsStateToResource = function(xObject, gsId) {
                    var resourcesDict = xObject.getResourcesDictinary(); // This is not a typo =~=
                    return resourcesDict.addExtGStateMapping(gsId);
                    }
        var setXObject = function(xObject, gsName, font, tmMatrix, text) {
                        xObject.getContentContext()
                            .q()
                            .gs(gsName) //Use the graphic state we created earlier
                            .BT() // Begin Text
                            .k(0, 0, 0, 0.3) // Set Color (CMYK, 0-1)
                            .Tf(font, tmMatrix.lesserFontSize) // Set font and font size
                            .Tm(tmMatrix.a, tmMatrix.b, tmMatrix.c, tmMatrix.d, tmMatrix.e, tmMatrix.f) // Set the text matrix to the angle calculated in getTextMatrix
                            .Tj(text) // Write the text
                            .ET() // End Text
                            .Q();
                        }
        var createXObject =  function(tmMatrix, objectCache, watermarkText, font, pageDimensions, pdfWriter) {

                //Check if we have created an object for this page size already
                let cachedObject = objectCache[`${pageDimensions[2]} ${pageDimensions[3]}`];
                if (cachedObject) {
                    return { xObject: cachedObject, objectCache: objectCache };
                }
            
                //Get the correct text matrix to display the text diagnoally across the page from corner to corner
                //This caters for portrait, landscape and anything in between
            
            
                //Create the transparency object
                var gsId = createTransparencyObject(pdfWriter);
            
                //Create a "page object" that we can later assign the transparency object to
                var xObject = pdfWriter.createFormXObject(0, 0, pageDimensions[2], pageDimensions[3]);
            
                //Add the graphic state to the "page object" and get the name back
                var gsName = assignGsStateToResource(xObject, gsId);
            
                //Write the text to the "page object"
                setXObject(xObject, gsName, font, tmMatrix, watermarkText);
                pdfWriter.endFormXObject(xObject);
            
                //Save the page size object to the cache
                objectCache[`${pageDimensions[2]} ${pageDimensions[3]}`] = xObject;
            
                return { xObject: xObject, objectCache: objectCache }
            }
        var hummus = require('hummus');
        var newName = sails.helpers.uuid()
        var output  = sails.helpers.rename(inputs.file, newName)
        var pdfWriter = hummus.createWriterToModify(inputs.file, {
            modifiedFilePath: output,
        });
        const path  = require("path")
        var font = pdfWriter.getFontForFile(path.join(path.dirname(path.dirname(__dirname)), "Arial.ttf"));
        var fontSize = 50;  //Initial font size - may be decreased in getTextMatric if the text is too long to fit the diagonal.
        var watermarkText = inputs.text
        var matrixCache = {};
        var objectCache = {};

        var pdfReader = hummus.createReader(inputs.file);
        for (var i = 0; i < pdfReader.getPagesCount(); ++i) {

            //Get page size [left, bottom, right, top]
            const pageDimensions = pdfReader.parsePage(i).getCropBox();

            //calculate the text size and angle
            var result = getTextMatrix(matrixCache, watermarkText, font, fontSize, pageDimensions[2], pageDimensions[3], 0.1);
            const tmMatrix = result.tMatrix;
            matrixCache = result.matrixCache;

            result = createXObject(tmMatrix, objectCache, watermarkText, font, pageDimensions, pdfWriter);

            var xObject = result.xObject;
            objectCache = result.objectCache;


            //get the page from the pdf in a modifier context
            var pageModifier = new hummus.PDFPageModifier(pdfWriter, i);

            //Write the "page object" onto the existing pdf page.
            var modifier = pageModifier.startContext().getContext();
            modifier.q()
                .cm(1, 0, 0, 1, 0, 35) // Set Current Matrix - scale to 100% (x and y), translate 0,35
                .doXObject(xObject)
                .Q();

            pageModifier.endContext().writePage();

            }
            pdfWriter.end();
            exits.success(output)

    },
    
}