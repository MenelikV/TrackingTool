/**
 * File.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    filename: {
      type: 'string'
    },

    path:{
      type: 'string',
      required: true
    },
    aircraft_id: {
      type: "number",
      required: true
    }
  },

};