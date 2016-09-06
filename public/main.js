


// the people object will hold all of the online users.  it will match the socket id with the username
var people = {};

var statusUpdate = function(msg){
  $('#status-bar').text(msg);
  console.log('running');
}

// create a socket for the chatbox
var socket = io();
$('#message-input').submit(function(){
  var msg = $('#m').val();
  var user;

  if(!people[socket.id]){
    user = "anon";
  }
  else user = people[socket.id];
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
  console.log()
  socket.emit('chat message', {user: user, msg:msg});
  // $('#chat-container').append($('<li>').text(user + ': ' + msg));
  $('#m').val('');
  $('#m').focus();
  return false;
});

socket.on('chat message', function(data){
  console.log(data);

  $('#chat-list').append($('<li>').text(data.user + ': ' + data.msg).addClass('list-group-item'));
});

// $('#getMessages-btn').on('click', function(e){
//   var userMsg = $('#user-msg').val()
//   $.ajax({
//     url:"/getmessage/" + userMsg,
//     type:"GET",
//     success: function(){
//       console.log('getted');
//     },
//     error: function(){
//       console.log('asdf');
//     }
// })
//   $('#user-msg').val('');
//   e.preventDefault();
// });



// on signing up, send an ajax post request to the server
$('#signup-btn').on('click', function(e){
  var username = $('#username-signup').val();
  var pw = $('#password-signup').val();
  console.log(username, pw);

  $.ajax({
    url:"/signup",
    type: 'POST',
    data: {
      name: username,
      password: pw
    },
    success: function(data){
      console.log('done');
      statusUpdate('sign-up successful');
      // $('#status-bar').text('sign-up successful');
    },
    error: function(){
      console.log('error');
      statusUpdate('sign-up unsuccessful (possibly a duplicate or something else)');
      // $('#status-bar').text('sign-up unsuccessful');
    }
  })
  $('#username-signup').val('');
  $('#password-signup').val('');

  // stay on the same page.
  e.preventDefault();
})


// on logging in, send an ajax get request to the server
$('#login-btn').on('click', function(e){
  var loginUserName = $('#username-login').val();
  var pw = $('#password-login').val();

  $.ajax({
    url:"/login",
    type: "POST",
    data: {
      name: loginUserName,
      password: pw
    },
    success: function(name){
      // if a name is returned, match it with the socket id, if not, have the user try again
      if(name){
        people[socket.id] = name;
        statusUpdate('login successful');
      }
      else statusUpdate('login unsuccessful (possibly an incorrect username or password');
    },
    error: function(){
      statusUpdate('login error');

    }
  })
  $('#username-login').val('');
  $('#password-login').val('');
  // stay on the same page.
  e.preventDefault();

})
