/**
 * CtrController
 *
 * @description :: Server-side actions for handling CTRs.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: async function (req, res) {
  
      CtrTot.find({
      }).exec(function (err, results) {
  
          if(err){
              res.send('error')
          }
          if(results===undefined){results = [{MSN:8254, CTR:"y", DeliveryDate: ""}]}
  
  
          return res.view('pages/table/ctr-table', {me: req.me, ctr: results} )
  
  
      });
  
    },

    import: async function(req, res){
        // TODO Read the excel file and update the DB accordingly
        var XLSX = require("js-xlsx")
        var config_data = require("./config.json")
        var s = config_data["MSN"]
        var sheet = "Sheet1"
        req.file("file").upload({
        }, async function (err, uploads) {
          console.log(uploads)
          if (uploads === undefined) {
            return res.send("Upload did not work")
          }
          if (uploads.length > 1) {
            return res.send("Maximum 1 file can be uploaded")
          }
          file = uploads[0]
          try { workbook = XLSX.readFile(file.fd); }
            catch (error) { err = error; return res.send("error") }
        // Get Data from the Excel file
        var new_base = sails.helpers.ctrTableCrawler(s, workbook.Sheets[sheet])
        console.log(new_base)
        for(var i = 0; i<new_base.MSN.length; i++){
          // Update the CtrTot Database
          console.log("Updating the CtrTot DataBase")
          CtrTot.findOrCreate({"MSN": new_base.MSN[i]}, {
            "MSN": new_base.MSN[i],
            "CTR": new_base.CTR[i],
            "Delivery_Date": new_base.Delivery_Date[i]
          }).exec(
            async(err, entry, wasCreated) => {
              if(err) { return res.serverError(err)}
              if(wasCreated){/*A new entry was created, do nothing*/}
              else{
                // Update of an old entry
                await CtrTot.update({"MSN": new_base.MSN[i]}).set({"CTR": new_base.CTR[i], "Delivery_Date": new_base.Delivery_Date[i]})
              }
            }
          )
          // Update the Data Database
          await Data.update({"MSN": new_base.MSN[i]}).set({"CTR": new_base.CTR[i], "Delivery_Date": new_base.Delivery_Date[i]})
        }
        res.status(200)
        // Display the refreshed table
        aircraft = await CtrTot.find()
        return res.redirect("/ctr")
        })
  
  }
}