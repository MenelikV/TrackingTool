module.exports = {
  friendlyName: 'Fill Template',


  description: 'Fill and download an uploaded docx template',
  sync: true,

  inputs: {
    doc_dataset: {
      type: 'ref',
      required: true
    },
    template_path: {
      type: 'string',
      required: true
    },
    res: {
      type: 'ref',
      required: true
    }
  },


  fn: function (input, exits) {
    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');
    var fs = require('fs');
    var path = require('path');
    //Load the docx file as a binary
    var content = fs
      .readFileSync(path.resolve(input.template_path), 'binary');

    var zip = new PizZip(content);
    var doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setData(input.doc_dataset);

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function (error, key) {
            error[key] = value[key];
            return error;
          }, {});
        }
        return value;
      }
      console.log(JSON.stringify({
        error: error
      }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
          return error.properties.explanation;
        }).join("\n");
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    var buf = doc.getZip()
      .generate({
        type: 'nodebuffer'
      });

    //Create file from template in .tmp folder
    let date = new Date();
    let filename = "CTR_" + input.doc_dataset["aircraft"] + "_" + input.doc_dataset["msn"] + '_output-' + date.getTime() + '.docx';
    fs.writeFileSync(path.resolve("./.tmp/uploads/", filename), buf);

    //Download created file and delete from folder
    let donwload_name = "CTR_" + input.doc_dataset["aircraft"] + "_" + input.doc_dataset["msn"] + "_" + input.doc_dataset["flight"] + "_output.docx";
    input.res.download(path.resolve("./.tmp/uploads/", filename), donwload_name, function (err) {
      if (err) {
        console.error("Problem downloading file", err);
        exits.success(false);
      } else fs.unlink(path.resolve("./.tmp/uploads/", filename), function (err_msg) {
        if (err_msg) {
          console.error("Problem deleting file ", err_msg);
          exits.success(false);
        }
      });
    });
    exits.success(true);
  }
}
