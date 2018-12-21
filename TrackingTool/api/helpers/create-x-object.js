module.exports = {
  friendlyName: 'setXObject',

  description: '',
  inputs: {
    tmMatrix: {
      type: 'ref',
      required: true
    },
    objectCache: {
      type: 'ref',
      required: true
    },
    watermarkText: {
      type: 'ref',
      required: true
    },
    font: {
      type: 'ref',
      required: true,
    },
    pageDimensions: {
      type: 'ref',
      required: true
    },
    pdfWriter: {
      type: 'string',
      required: true
    }
  },
  sync: true,

  fn: function (req, exits) {
    //Check if we have created an object for this page size already
    let cachedObject = req.objectCache[`${pageDimensions[2]} ${pageDimensions[3]}`];
    if (cachedObject) {
      exits.success({
        xObject: cachedObject,
        objectCache: objectCache
      });
    }

    //Get the correct text matrix to display the text diagnoally across the page from corner to corner
    //This caters for portrait, landscape and anything in between


    //Create the transparency object
    var gsId = sails.helpers.createTransparencyObject(pdfWriter);

    //Create a "page object" that we can later assign the transparency object to
    var xObject = req.pdfWriter.createFormXObject(0, 0, pageDimensions[2], pageDimensions[3]);

    //Add the graphic state to the "page object" and get the name back
    var gsName = sails.helpers.assignGsStateToResource(xObject, gsId);

    //Write the text to the "page object"
    sails.helpers.setXObject(xObject, gsName, font, tmMatrix, watermarkText);
    req.pdfWriter.endFormXObject(xObject);

    //Save the page size object to the cache
    req.objectCache[`${pageDimensions[2]} ${pageDimensions[3]}`] = xObject;

    return {
      xObject: xObject,
      objectCache: objectCache
    };
  }
}