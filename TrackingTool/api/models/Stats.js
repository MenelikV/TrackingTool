/**
 * Stats.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id_user: {
      type: "number",
      required: true
    },

    connection_date: {
      type: "string",
      required: true
    }

  },

};
