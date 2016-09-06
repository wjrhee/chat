var express = require('express');
var router = express.Router();
var path = require('path');
var models = require('../models/db');
var User = models.User;
var Message = models.Message;
var bcrypt = require('bcryptjs');


router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// route for getting all messages from a specific user
router.get('/getmessage/:user', function(req, res, next){

  Message.findAll({
    include: [{
      model: User,
      where: {
        name: req.params.user
      }
    }]
    })
  .then(function(item){
    console.log(item);
  })

})

// route for posting messages
router.post('/message', function(req, res, next){
  Message.create({
    message: req.body.message
  })
  .then(function(createdMessage){
    User.findOne({where:{name:req.body.name}})
    .then(function(user){
      return createdMessage.setUser(user);
    })

  })
  .catch(next);
  res.send('hello');
})

// route for creating an account

router.post('/signup', function(req, res, next){
  console.log(req.body);
  User.findOrCreate({
    where: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(function(){
    res.redirect('../');
  })
  .catch(next);

})

// router for logging in.

router.post('/login', function(req, res, next){

// search the database for the specified user
  User.findOne({
    where: {
      name: req.body.name
    }
  })
  .then(function(foundUser){
    // check hashed submitted password against the password in the database
    var foundUserName = null;
    var checkPass = bcrypt.hashSync(req.body.password, foundUser.salt);
    if (checkPass === foundUser.password){
      console.log('found!');
      foundUserName = foundUser.name;
    }
    else {
      console.log('nope');
    }
    // if the passwords match, the username is returned, if not, null is returned
    res.send(foundUserName);

  })

  .catch(function(err){
    console.log('user name does not exist');
    next(err);
  });
})

module.exports = router;
