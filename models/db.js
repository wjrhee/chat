// var CryptoJS = require('crypto-js');
var bcrypt = require('bcryptjs')
var Sequelize = require('sequelize');
//
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
  },
  salt: {
    type: Sequelize.STRING
  }
},{
  hooks: {
    // encrypt the password before it is stored

    beforeValidate: function hashPassword(user){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      user.salt = salt;
    }
  }
})

var Message = db.define('Message', {
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

//  link messages to users
Message.belongsTo(User);


module.exports = {
  User: User,
  Message: Message
};
