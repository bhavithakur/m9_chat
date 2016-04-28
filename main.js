var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var formidable = require('formidable');
var    util = require('util');
var fs   = require('fs-extra');
var imgTitle = "";


app.get('/', function(req, res) {
    res.sendFile('/index.html',{root:"E:"});
});
app.get('/u', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
  res.end(form); 
}); 


app.post('/upload', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
    imgTitle = fields.title;	
  });
  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = 'C:\\inetpub\\wwwroot\\MedLink\\images\\';

    fs.copy(temp_path, new_location + imgTitle, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
      }
    });
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
    socket.on('disconnect', function(){
    console.log('user disconnected');
  });

 socket.on('chat_message', function(msg){
    io.emit('chat_message', msg);
    console.log("Chat sent"+msg);

  });
 
});

http.listen(3232, function() {
    console.log('listening on *:3232');
});



    
 







