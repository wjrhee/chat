var CryptoJS = require('crypto-js');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/chat',{
  logging: true
});

// user database with the user name, and passwords
var User = db.define('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
},{
  hooks: {

    // encrypt the password before it is stored

    beforeValidate: function hashPassword(user){
      var newPass = CryptoJS.SHA3(user.password);
      var encrypted = newPass.toString(CryptoJS.enc.Base64);
      user.password = encrypted;
    }
  },
  classMethods: {
    // a class method that takes in a password and returns the hashed version.
    returnEncrypted: function(password){
      var newPass = CryptoJS.SHA3(password);
      var encrypted = newPass.toString(CryptoJS.enc.Base64);
      return encrypted;
    }

  }
})

var Message = db.define('Message', {
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Message.belongsTo(User);

//set up table for messages and link to users

module.exports = {
  User: User,
  Message: Message
};
