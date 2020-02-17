/**
 * SubscriptionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  subscribe: async function (req, res) {
    let new_subs = req.body["subs"];

    let user_id = req.me["id"];
    await Subscription.destroy({
      user_id: user_id
    });

    if (!new_subs) return res.redirect("/subscriptions");
    let created_subs = await Subscription.createEach(new_subs).fetch();

    return res.status(200).send();
  },

  subscribeToNotifications: async function (req, res) {
    let id_user = req.me.id;
    let user_subs = await Subscription.find({
      select: "id"
    }).where({
      user_id: id_user
    });

    Subscription.subscribe(req, _.pluck(user_subs, 'id'));
    res.send(200);
  },

};
