/**
 * StatsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  view: async function (req, res) {
    let days = (req.params["days"]) ? parseInt(req.params["days"]) : 30;
    moment = require("moment");
    let current_date = moment().hour(0).minute(0).second(0);
    current_date = current_date.add(-days, "days");

    let full_stats = [];

    for (let i = 0; i <= days; i++) {
      let connection_data = {};

      let total_connections = await Stats.count({
        "connection_date": current_date.format("YYYY-MM-DD")
      });

      connection_data[current_date.format("YYYY-MM-DD")] = total_connections;
      full_stats.push(connection_data);

      current_date.add(1, ("days"));
    }

    return res.view('pages/statistics', {
      me: req.me,
      stats: full_stats
    })
  },

  connect: async function (req, res) {
    moment = require("moment");
    let current_date = moment().format("YYYY-MM-DD");
    //var io = require('sails.io.js')( require('socket.io-client') );
    let id_user = req.me.id;

    let user_subs = await Subscription.find({
      select: "id"
    }).where({
      user_id: id_user
    });

    Stats.find({
      id_user: id_user,
      connection_date: current_date

    }).exec(async function (err, result) {
      if (err) {
        console.error("Error updating statistics");
        return;
      } else if (!result.length) {
        let new_connection = await Stats.create({
          id_user: id_user,
          connection_date: current_date
        }).fetch();
        console.log("New user connection: ", new_connection);

      } else {
        console.log("User has previously logged in today: ", result);
        return;
      }

    })
  }
}
