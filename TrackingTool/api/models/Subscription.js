/**
 * Subscription.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "string",
      required: true,
      unique: true
    },

    user_id: {
      type: "number",
      required: true
    },

    field_name: {
      type: "string",
      required: true
    },

    field_value: {
      type: "string",
      required: true
    }

  },

};

