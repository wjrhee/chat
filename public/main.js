


// the people object will hold all of the online users.  it will match the socket id with the username
var people = {};

// create a socket for the chatbox
var socket = io();
$('#chatbox').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function(msg){
  $.ajax({
    url:"/message",
    type: "POST",
    data: {
      message: msg,
      name: people[socket.id]
    },
    success: function(){
      console.log('message submitted');
    },
    error: function(){
      console.log('error in submitting message');
    }
  })
  $('#message').append($('<li>').text(people[socket.id] + ': ' + msg));
});

$('#getMessages-btn').on('click', function(e){
  var userMsg = $('#user-msg').val()
  $.ajax({
    url:"/getmessage/" + userMsg,
    type:"GET",
    success: function(){
      console.log('getted');
    },
    error: function(){
      console.log('asdf');
    }
})
  e.preventDefault();
});



// on signing in, send an ajax post request to the server
$('#signup-btn').on('click', function(e){
  var username = $('#username-signup').val();
  var pw = CryptoJS.SHA3($('#password-signup').val());
  var encrypted = pw.toString(CryptoJS.enc.Base64);

  $.ajax({
    url:"/signup",
    type: 'POST',
    data: {
      name: username,
      password: encrypted
    },
    success: function(data){
      console.log('done');
    },
    error: function(){
      console.log('error');
    }
  })

  // stay on the same page.
  e.preventDefault();

})


// on logging in, send an ajax get request to the server
$('#login-btn').on('click', function(e){
  var loginUserName = $('#username-login').val();
  var pw = CryptoJS.SHA3($('#password-login').val());
  var encrypted = pw.toString(CryptoJS.enc.Base64);


  $.ajax({
    url:"/login/" + loginUserName + '/' + encrypted,
    type: "GET",
    success: function(name){
      // if a name is returned, match it with the socket id, if not, have the user try again
      if(name) people[socket.id] = name;
      else console.log('username or password incorrect');

      console.log('done');
    },
    error: function(){
      console.log('error');
    }
  })
  // stay on the same page.
  e.preventDefault();

})


// ADD HTML AND CSS AND STORE MESSAGES IN THE DATABASE
// ADD MESSAGES TO THE DATABASE.  CHECK THE AJAX AND FINISH THE EXPRESS ROUTING
