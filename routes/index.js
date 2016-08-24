var express = require('express');
var router = express.Router();
var path = require('path');
var models = require('../models/db');
var User = models.User;
var Message = models.Message;


router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../views', 'index.html'));

});

router.get('/getmessage/:user', function(req, res, next){

  console.log(req.params.user);
  console.log(User);

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

router.post('/signup', function(req, res, next){
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
// router will take the username and password as params

router.get('/login/:userName/:pw', function(req, res, next){

// search the database for the specified user
  User.findOne({
    where: {
      name: req.params.userName
    }
  })
  .then(function(foundUser){
    // if the user is found, check if the password matches.
    // the password is hashed on the client side and then again on the server side
    // the real password is never sent to the server
    var foundUserName = null;
    var checkPass = User.returnEncrypted(req.params.pw);
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
