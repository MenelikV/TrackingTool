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
          if(results===undefined){results = [{MSN:8254, CTR:true, DeliveryDate: ""}]}
  
  
          return res.view('pages/table/ctr-table', {me: req.me, ctr: results} )
  
  
      });
  
    },

    import: async function(req, res){
        // TODO Read the excel file and update the DB accordingly
        console.log(req.file("files"))
        res.status(200)
        return res.redirect("/pages/table/ctr-table")
    }
  
  }
  