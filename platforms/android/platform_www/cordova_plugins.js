cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "@makiwin/cordova-plugin-cookie-manager.cookieManager",
      "file": "plugins/@makiwin/cordova-plugin-cookie-manager/www/cookie_manager.js",
      "pluginId": "@makiwin/cordova-plugin-cookie-manager",
      "clobbers": [
        "cookieManager"
      ]
    },
    {
      "id": "cordova-plugin-firebasex.FirebasePlugin",
      "file": "plugins/cordova-plugin-firebasex/www/firebase.js",
      "pluginId": "cordova-plugin-firebasex",
      "clobbers": [
        "FirebasePlugin"
      ]
    }
  ];
  module.exports.metadata = {
    "@makiwin/cordova-plugin-cookie-manager": "0.0.2",
    "cordova-plugin-firebasex": "18.0.7"
  };
});