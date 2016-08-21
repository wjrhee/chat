var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/db');

router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
  // res.send('hello');
});

router.post('/login', function(req, res, next){
  res.send('hello');
})
router.post('/signup', function(req, res, next){
  // console.log(User);
  User.findOrCreate({
    where: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(function(){
    res.redirect('/');

  })
  .catch(next);

})
router.get('/login/:userName/:pw', function(req, res, next){
  console.log(req.params.userName);
  console.log(req.params.pw);
  // res.send('hello');
  User.findOne({
    where: {
      name: req.params.userName
    }
  })
  .then(function(foundUser){
    // pw = req.params.pw;
    // console.log(foundUser);
    var checkPass = User.returnEncrypted(req.params.pw);
    if (checkPass === foundUser.password){
      console.log('found!');
    }
    else {
      console.log('nope');
    }
    // need to send to database using getter method? and hash with the getter?

  })
  .then(function(){
    res.send('hello');
  })
  .catch(next);

  // User.find();
  // search for user and verify the password.
  // search for user
  // hash password with client side key  then hash again on the server side and check to see if the password matches the password stored for the user.
  //
})

module.exports = router;
