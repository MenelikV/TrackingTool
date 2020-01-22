/**
 * SubscriptionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  subscribe: async function (req, res) {
    console.log("boday! ", req.body);
    let new_subs = req.body["subs"];

    let user_id = req.me["id"];
    await Subscription.destroy({
      user_id: user_id
    });

    if (!new_subs) return res.redirect("/subscriptions");
    let created_subs = await Subscription.createEach(new_subs).fetch();

    return res.status(200).send();
  }

};
