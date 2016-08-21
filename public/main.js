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
  $('#message').append($('<li>').text(people[socket.id] + ': ' + msg));
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

$('#decode').on('click', function(){
  console.log(x);
  // decode(x);
})
