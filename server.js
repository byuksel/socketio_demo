var http = require('http');
var io = require('socket.io');

var mypage = '<html>                                       \
   <head>                                                  \
    <script src="/socket.io/socket.io.js"></script>        \
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script> \
  </head>                                                  \
  <body>                                                   \
    <script>                                               \
      var socket = io.connect();                           \
     socket.on("message", function(data){                  \
        $("#message").append(data);                        \
     });                                                   \
     $(document).ready(function(){                         \
        $("#text").keypress(function(e){                   \
            if(e.which == 13) {  var k = $("#text").val()+"<br>" ;                          \
           socket.emit("client_data", k);}  \
        });                                                \
     });                                                   \
    </script>                                              \
    <div>Please send a message</div>                       \
 <textarea id="text"></textarea>                           \
    <div id="message"></div>                               \
  </body>                                                  \
</html>'

var server = http.createServer(function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(mypage);
  response.end();
});

server.listen(process.env.PORT || 8001);
var listener = io.listen(server);

listener.sockets.on('connection', function(socket){
  // Broadcast a user's message to everyone else in the room
  socket.on('client_data', function (data) {
    listener.sockets.emit('message', data);
  });
});


