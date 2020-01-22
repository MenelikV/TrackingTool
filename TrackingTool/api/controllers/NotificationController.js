/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  view: async function (req, res) {
    //Get all aircrafts/owners to fill the subscription list
    let full_aircrafts = await Data.find({
      select: "Aircraft"
    });
    full_aircrafts = full_aircrafts.map(({
      Aircraft
    }) => Aircraft);
    full_aircrafts = [...new Set(full_aircrafts)];

    let full_owners = await Data.find({
      select: "Flight_Owner"
    });
    full_owners = full_owners.map(({
      Flight_Owner
    }) => Flight_Owner);
    full_owners = [...new Set(full_owners)];

    //Get the current user's subscriptions
    let user_id = req.me["id"];
    let user_subs = await Subscription.find({
      select: ["field_name", "field_value"]
    }).where({
      user_id: user_id
    });

    console.log("user subs: ", user_subs);
    let aircraft_subs = [];
    let owner_subs = [];
    for (let i = 0; i < user_subs.length; i++) {
      if (user_subs[i]["field_name"] === "aircraft") {
        aircraft_subs.push({
          aircraft: user_subs[i]["field_value"]
        })
      } else {
        owner_subs.push({
          flight_owner: user_subs[i]["field_value"]
        })
      }
    }

    let aircraft_sub_data = await Notification.find({
      or: aircraft_subs
    });
    aircraft_subs = aircraft_subs.map(({
      aircraft
    }) => aircraft);

    console.log("ownersubs ",owner_subs)
    let owner_sub_data = await Notification.find({
      or: owner_subs
    });
    owner_subs = owner_subs.map(({
      flight_owner
    }) => flight_owner);

    console.log("----> ", owner_sub_data, aircraft_sub_data)
    return res.view("pages/RSS", {
      me: req.me,
      full_aircrafts: full_aircrafts,
      full_owners: full_owners,
      aircraft_sub: aircraft_sub_data,
      aircraft_user_sub: aircraft_subs,
      owner_sub: owner_sub_data,
      owner_user_sub: owner_subs
    })
  }



};
