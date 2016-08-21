var CryptoJS = require('crypto-js');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/chat',{
  logging: true
});

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
},{
  hooks: {
    beforeValidate: function hashPassword(user){
      var newPass = CryptoJS.SHA3(user.password);
      var encrypted = newPass.toString(CryptoJS.enc.Base64);
      user.password = encrypted;
    }
  },
  classMethods:{
    returnEncrypted: function(password){
      var newPass = CryptoJS.SHA3(password);
      var encrypted = newPass.toString(CryptoJS.enc.Base64);
      return encrypted;

    }
  }

})

module.exports = User;
