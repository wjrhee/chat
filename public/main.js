var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#message').append($('<li>').text(msg));
});

$('#signup-btn').on('click', function(){
  var username = $('#username-signup').val();

  var ckey = 321;
  var pw = CryptoJS.SHA3($('#password-signup').val());
  // var encrypted = CryptoJS.MD5(pw);
  var encrypted = pw.toString(CryptoJS.enc.Base64);
  // console.log('client side encryption',encrypted);

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

})

$('#login-btn').on('click', function(){
  var loginUserName = $('#username-login').val();

  // var ckey = 321;
  var pw = CryptoJS.SHA3($('#password-login').val());

  var encrypted = pw.toString(CryptoJS.enc.Base64);
  // var urlStr = '/login/' + loginUserName + '/' + encrypted;


  $.ajax({
    url:"/login/" + loginUserName + '/' + encrypted,
    type: "GET",

    success: function(data){
      console.log('done');
    },
    error: function(){
      console.log('error');
    }
  })

})

$('#decode').on('click', function(){
  console.log(x);
  // decode(x);
})
