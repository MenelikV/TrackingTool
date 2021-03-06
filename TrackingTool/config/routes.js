/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗ 
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  'GET /': {
    action: 'view-homepage-or-redirect',
    locals: {
      layout: 'layouts/layout-home'
    }
  },

  'GET /welcome': {
    view: 'pages/dashboard/welcome'
  },

  '/upload': {
    view: 'pages/account/upload-files'
  },

  'POST /account/file/upload': 'account/FileController.upload',

  'POST /account/file/search': 'account/FileController.search',

  'POST /account/file/delete': 'accout/FileController.delete',

  'POST /account/admin/search': 'account/AdminController.search',

  'POST /account/file/validate': 'account/FileController.validate',

  'GET /account/file/download/:id': 'account/FileController.download', // Download function disabled

  'POST /account/file/validate': 'account/FileController.validate',

  'POST /account/file/update/:id': 'account/FileController.update',

  'POST /account/file/edit': 'account/FileController.edit',

  'POST /account/admin/approve': 'account/AdminController.approve',

  'POST /account/admin/reject': 'account/AdminController.reject',

  'POST /account/admin/changeRights': 'account/AdminController.changeRights',

  'POST /account/admin/changeStyle/:id': 'account/AdminController.changeStyle',

  'GET /account/admin/restore': 'account/AdminController.restore',

  'GET /stats/connect': 'StatsController.connect',

  'POST /table/data': 'account/FileController.getData',

  'GET /requests': {
    //view: 'pages/account/view-requests',
    controller: 'account/AdminController',
    action: 'view'
  },

  'GET /stats': {
    controller: 'StatsController',
    action: 'view'
  },

  'GET /keys': {
    controller: 'account/AdminController',
    action: 'view_keys'
  },

  'GET /subscriptions/subscribeToNotifications' : {
    controller: "SubscriptionController",
    action: 'subscribeToNotifications'
  },

  'GET /subscription/socketDisconnect' : {
    controller: "SubscriptionController",
    action: 'socketDisconnect'
  },

  'GET /subscriptions': {
    controller: 'NotificationController',
    action: 'view'
  },

  'GET /files': {
    view: 'pages/account/view-files',
    controller: 'account/FileController',
    action: 'view'
  },

  'GET /results': {
    view: 'pages/account/view-results'
  },

  'POST /ctr/import': 'ctr/CtrController.import',

  'GET /ctr': "ctr/CtrController.view",
  
  'GET /contact': {
    view: 'pages/contact',
  },

  'GET /signup': {
    action: 'entrance/view-signup',
  },
  
  'GET /email/confirm': {
    action: 'entrance/confirm-email'
  },
  'GET /email/confirmed': {
    view: 'pages/entrance/confirmed-email'
  },

  'GET /login': {
    action: 'entrance/view-login'
  },
  'GET /password/forgot': {
    action: 'entrance/view-forgot-password'
  },
  'GET /password/new': {
    action: 'entrance/view-new-password'
  },

  'GET /account': {
    action: 'account/view-account-overview'
  },
  'GET /account/password': {
    action: 'account/view-edit-password'
  },
  'GET /account/profile': {
    action: 'account/view-edit-profile'
  },
  'GET /table': {
    controller: "table",
    action: "view-available-data",
    locals: {
      layout: "layouts/layout-table"
    }
  },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/v1/account/logout': {
    action: 'account/logout'
  },
  'PUT   /api/v1/account/update-password': {
    action: 'account/update-password'
  },
  'PUT   /api/v1/account/update-profile': {
    action: 'account/update-profile'
  },
  'PUT   /api/v1/entrance/login': {
    action: 'entrance/login'
  },
  'POST  /api/v1/entrance/signup': {
    action: 'entrance/signup'
  },
  'POST  /api/v1/entrance/send-password-recovery-email': {
    action: 'entrance/send-password-recovery-email'
  },
  'POST  /api/v1/entrance/update-password-and-login': {
    action: 'entrance/update-password-and-login'
  },
  'POST  /api/v1/deliver-contact-form-message': {
    action: 'deliver-contact-form-message'
  },


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/logout': '/api/v1/account/logout',

};
