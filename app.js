var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var sqlite3 = require('sqlite3').verbose()
var cookieParser = require('Cookie-parser');
var mu = require('mu2');
var models = require('./models');
const bcrypt = require('bcrypt');

// Create new express server
var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}));
mu.root = __dirname
var server = require('http').Server(app);
var io = require('socket.io')(server);
//app.use(cookieParser());
// GET for stylesheet
app.get('/imgs/grey.jpg', function(request, response) {
  response.writeHead(200, {'Content-type' : 'image/gif'});
    var img = fs.readFileSync('./imgs/grey.jpg');
    response.end(img, 'binary');
});

// GET for stylesheet
app.get('/playlist.css', function(request, response) {
  response.writeHead(200, {'Content-type' : 'text/css'});
    var fileContents = fs.readFileSync('./playlist.css', {encoding: 'utf8'});
    response.write(fileContents);
	response.end();
});


app.get('/music-app.js', function(request, response) {
	response.writeHead(200, {'Content-type' : 'application/javascript'});
		 
		var fileContents = fs.readFileSync('./music-app.js', {encoding: 'utf8'});
    response.write(fileContents);
	response.end();
  
});

app.get('/login', function(request, response) {
	response.writeHead(200, {'Content-Type' : 'text/html'});
    fs.readFile(__dirname + '/login.html', function(err, data) {
        response.end(data);
  
	})
});
app.get('/evil/', function(request, response) {
	response.writeHead(401, {'Content-Type' : 'text/html'});
    response.end('unauthorzied access please signup to get access!');
});

app.get('/library', function(request, response) {
	response.writeHead(200, {'Content-Type' : 'text/html'});
	
	
	var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	console.log(session_Key);
	
	models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
                //console.log(user_auth.id);
				if (user_auth.id !== undefined) {
					
					fs.readFile(__dirname + '/playlist.html', function(err, data) {
					response.end(data);
				});
									
				}else
				{
					response.redirect('/login');
				}
			
            });
	
	
    
  
});


app.get('/playlists', function(request, response) {
	response.writeHead(200, {'Content-Type' : 'text/html'});
	
	var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	console.log(session_Key);
	
	models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
                //console.log(user_auth.id);
				if (user_auth.id !== undefined) {
					
					 fs.readFile(__dirname + '/playlist.html', function(err, data) {
					response.end(data);
  
					});
									
				}else
				{
					response.redirect('/login');
				}
			
            });
	
   
});

app.get('/search', function(request, response) {
	response.writeHead(200, {'Content-Type' : 'text/html'});
	 
	var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	console.log(session_Key);
	
	models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
                //console.log(user_auth.id);
				if (user_auth.id !== undefined) {
					
					fs.readFile(__dirname + '/playlist.html', function(err, data) {
					response.end(data);
					});
									
				}else
				{
					response.redirect('/login');
				}
			
            });   
  

});

var crypto = require('crypto');

var generateToken = function() {
     var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};




app.post('/login', function(req, response) {
    var user_name = req.body.username;
    var password = req.body.password;
    console.log("post received: %s %s", user_name, password);
	//bcrypt.compare(password, hash, function(err, res) {
	 models.User.findOne({
                where: {
                    username: user_name,
					
                }
            }).then(function(login) {
				//console.log();
				bcrypt.compare(password, login.userpassword, function(err, res) {
				if (res) {
					
					var token=generateToken();
					//console.log(token);
					//console.log(login.id);
					
					models.session.create({
						
						sessionKey: token,
						sessionUser: login.id,
						
					});
					
					response.set('Set-Cookie', 'sessionKey=' + token);
					response.redirect('/');
					console.log("Successfully logged into the website!");

				} else {
					console.log("The user credential do not match!");
					response.redirect('/login');
					
				}
            });    
				
            });
		

});
app.get('/', function(request, response) {
    var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	console.log(session_Key);
	
	models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
                //console.log(user_auth.id);
				if (user_auth.id !== undefined) {
					
					var stream = mu.compileAndRender('playlist.html');
					stream.pipe(response);				
				}else
				{
					response.redirect('/login');
				}
			
            });
        

});
var g_jsonbject;
var requestApi = function (req, res, next) {
	
	
	var sessionStr = req.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	//console.log(session_Key);
	
	models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
               // console.log(user_auth.sessionUser);
				if (user_auth.id !== undefined) {
					var users={};
					var userPlaylist=[];
					models.Playlist.findAll({include: [
						{model :models.User, where: {id:user_auth.sessionUser}
						}
						 
						]}).then(function(playlists){
							users.playlists=playlists.map(function(playlist){
								
								users.playlists=(playlist.get({plain: true}));
								return (playlist.get({plain: true}));
							});
							//console.log("this is user playlist length "+users.playlists.length);
							for (var k = 0; k < users.playlists.length; k++)
							{
								//console.log(users.playlists[k].id);
								userPlaylist.push(users.playlists[k].id);
								
							}
							
							
						//return res.jsonp(outlets);
					}).then(function() {
					
					//console.log("this is user playlist  " +userPlaylist.length);
					
					var jsonobjectPlaylists = {};
						var playlists = [];
					
						
						
						
						models.Playlist.findAll( {where: {
    id: userPlaylist}, include: [ models.songs] })		
						.then(function(playlists) {
							
								
							jsonobjectPlaylists.playlists=playlists.map(function(playlist){
								
								jsonobjectPlaylists.playlists=(playlist.get({plain: true}));
								return (playlist.get({plain: true}));
							});
							//console.log(jsonobjectPlaylists.playlists[1].songs.length);
							var array=[];
							for (var i = 0; i < jsonobjectPlaylists.playlists.length; i++)
							{
								delete jsonobjectPlaylists.playlists[i].createdAt;
								delete jsonobjectPlaylists.playlists[i].updatedAt;
								for (var j = 0; j < jsonobjectPlaylists.playlists[i].songs.length; j++)
								{
									array.push(jsonobjectPlaylists.playlists[i].songs[j].id);
									delete jsonobjectPlaylists.playlists[i].songs[j].title;
									delete jsonobjectPlaylists.playlists[i].songs[j].album;
									delete jsonobjectPlaylists.playlists[i].songs[j].duration;
									delete jsonobjectPlaylists.playlists[i].songs[j].updatedAt;
									delete jsonobjectPlaylists.playlists[i].songs[j].createdAt;
									delete jsonobjectPlaylists.playlists[i].songs[j].SongsPlaylists;
									delete jsonobjectPlaylists.playlists[i].songs[j].artist;
									delete jsonobjectPlaylists.playlists[i].songs[j];
									
									
								}
								
								jsonobjectPlaylists.playlists[i].songs=[];
								jsonobjectPlaylists.playlists[i].songs=array;
								array=[];			
								
							}
							g_jsonbject=JSON.stringify(jsonobjectPlaylists);							
							req.requestApi=JSON.stringify(jsonobjectPlaylists);
							next();
						});
					
					});				
				}else
				{
					response.redirect('/login');
				}
			
            });
	
	
		
		
}
io.on('connection', function(socket) {
			
	socket.emit('receivePlaylist', g_jsonbject);
	
});


app.use(requestApi);
app.get('/api/playlists', function(req, res) {
	res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(req.requestApi);
  
});

app.get('/api/songs', function(request, response) {
	response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');	
		
		var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	console.log(session_Key);
	
	models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
                //console.log(user_auth.id);
				if (user_auth.id !== undefined) {
					
					var jsonobjectSongs = {};
					var songs = [];
					
					models.songs.findAll()		
					.then(function(songs) {
								
						jsonobjectSongs.songs=songs.map(function(song){
							
							jsonobjectSongs.songs=(song.get({plain: true}));
							
							return (song.get({plain: true}));
						});
						for (var i = 0; i < jsonobjectSongs.songs.length; i++)
						{
							delete jsonobjectSongs.songs[i].createdAt;
							delete jsonobjectSongs.songs[i].updatedAt;
							
						}
						
						
						response.end(JSON.stringify(jsonobjectSongs));
					});
					
								
				}else
				{
					response.redirect('/login');
				}
			
            });
		
		
		
  
});


app.post('/api/playlists/', function(request, response) {
	
	response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		
		console.log(request.body);
		response.send(request.params[':id']);
		response.end();
  
});

app.post('/api/playlists/:id', function(request, response) {
	
	var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
		
		console.log(request.body.song);
		console.log(request.params.id);
		
		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
               // console.log(user_auth.sessionUser);
				if (user_auth.id !== undefined) {
					var users={};
					var userPlaylist=[];
					models.Playlist.findAll({include: [
						{model :models.User, where: {id:user_auth.sessionUser}
						}
						 
						]}).then(function(){
									models.Playlist.findOne({where:{id:request.params.id}}
					).then(function(play){
						//songs_Array=playlists[0].songs;
						//console.log(play);
						models.songs.findOne({where:{id:request.body.song}}).then(function(song){ 
						play.addSong(song);
										
					}).then(function(){
						
						response.redirect('/api/playlists');
						
						
						
					});
				
			});
							
							
		});
	}
	else
	{
		response.redirect('/login');
		
	}
	
		
		
		
	});	
  
});

app.del('/api/playlists/:id', function(request, response) {
	console.log(request.body);

		console.log('the  delete is executed');
		
		console.log(request.body.song);
		console.log(request.params.id);
		
		var sessionStr = request.headers.cookie;
		var str_length=sessionStr.length;
		var session_Key= sessionStr.substring(11, str_length);
		
		
		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		
		models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
               // console.log(user_auth.sessionUser);
				if (user_auth.id !== undefined) {
					var users={};
					var userPlaylist=[];
					models.Playlist.findAll({include: [
						{model :models.User, where: {id:user_auth.sessionUser}
						}
						 
						]}).then(function(){
									models.Playlist.findOne({where:{id:request.params.id}}
					).then(function(play){
						//songs_Array=playlists[0].songs;
						//console.log(play);
						models.songs.findOne({where:{id:request.body.song}}).then(function(song){ 
						play.removeSong(song);
										
					}).then(function(){
						
						response.end();
						
						
						
					});
				
			});
							
							
		});
	}
	else
	{
		response.redirect('/login');
		
	}
	
		
		
		
	});	
		
		
		
		
			
		
  
});


app.get('/api/users', function (request, response) {
	
	var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
	
	response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');	
		
		
		models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
               // console.log(user_auth.sessionUser);
				if (user_auth.id !== undefined) {
					var users={};
					var userPlaylist=[];
					models.Playlist.findAll({include: [
						{model :models.User, where: {id:user_auth.sessionUser}
						}
						 
						]}).then(function(){
							var jsonobjectSongs = {};
		var users = [];
		
		models.User.findAll()		
        .then(function(songs) {
					
			jsonobjectSongs.users=songs.map(function(song){
				
				jsonobjectSongs.users=(song.get({plain: true}));
				
                return (song.get({plain: true}));
            });
			for (var i = 0; i < jsonobjectSongs.users.length; i++)
			{
				delete jsonobjectSongs.users[i].createdAt;
				delete jsonobjectSongs.users[i].updatedAt;
				delete jsonobjectSongs.users[i].userpassword;
				
			}
			
			
			response.end(JSON.stringify(jsonobjectSongs));
        });
									
							
							
		});
	}
	else
	{
		response.redirect('/login');
		
	}
	
		
		
		
	});	
		
		
    
    
});


app.post('/api/playlists/:id/users', function(request, response) {
	
	var sessionStr = request.headers.cookie;
	var str_length=sessionStr.length;
	var session_Key= sessionStr.substring(11, str_length);
		
		
		console.log(request.params.id);
		console.log(request.body.user);
		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		models.session.findOne({
                where: {
                    sessionKey: session_Key,
                }
            }).then(function(user_auth) {
				
               // console.log(user_auth.sessionUser);
				if (user_auth.id !== undefined) {
					var users={};
					var userPlaylist=[];
					models.Playlist.findAll({include: [
						{model :models.User, where: {id:user_auth.sessionUser}
						}
						 
						]}).then(function(){
									models.Playlist.findOne({where:{id:request.params.id}}
					).then(function(play){
						//console.log(play);
						models.User.findOne({where:{id:request.body.user}}).then(function(user){ 
						//console.log(user);
						play.addUser(user);
										
					}).then(function(){
						
						response.redirect('/api/playlists');
						
						
						
					});
				
			});
							
							
		});
	}
	else
	{
		response.redirect('/login');
		
	}
	
		
		
		
	});	
	
  //response.end('all working and good!');
});



/* Routing Demo */
// Match parameters
// matches:
// http://localhost:3000/songs/dd/
// http://localhost:3000/songs/11/


// Match parameters with regex
// matches:
// http://localhost:3000/songs/num/11/ (but not dd)
/*app.get('/songs/num/:songId([0-9]+)/', function (request, response) {
    console.log(request.params);
    response.send(request.params['songId']);
});*/

/* Initial Database demo */
// (must comment out previous one)
// Example of a *bad* way of getting a song from disk.
// Loading the entire library from a single file.
/*app.get('/songs/file/:songId([0-9]+)/', function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/json');
    // Have to load everything into memory
    fs.readFile(__dirname + '/songs.json', function(err, data) {
        // This loads the entire song library into memory...
        // Imagine you're an engineer at Spotify. This might cost you your internship!
        var music_data = JSON.parse(data);
        var songIdParam = request.params['songId'];
        var response_data = JSON.stringify(music_data['songs'][songIdParam]);
        response.send(response_data);
    });
});*/

// Better way - using a DB.
/*app.get('/songs/db/:songId([0-9]+)/', function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/json');
    // only load into memory what is needed for the request
    var query = "SELECT * FROM songs WHERE id = " + request.params['songId'];
    console.log(query);
    db.all(query, function(err, rows) {
        console.log(rows);
        response.send(JSON.stringify(rows[0]))
    });
});*/

/* Database GET demo */
/*app.get('/demos/backend-apps/', function(request, response) {

  
  // modify this page to fetch the data from the DB and populate that
  // into the HTML using a templating engine
  var query = "SELECT title, artist FROM songs";
  db.all(query, function(err, rows) {
      var stream = mu.compileAndRender('index.html', {songs: rows })
      stream.pipe(response);
  });

});*/

/* Database POST demo */
/*app.post('/demos/backend-apps/', function(request, response) {
  var songTitle = request.body['song-name'];


  var query = `INSERT INTO songs (id, album, title, artist, duration) VALUES (2000, "Some Album", "${songTitle}", "Some Artist", "222")`;
  console.log(query);
  db.run(query)

  var query = "SELECT * FROM songs";
  db.all(query, function(err, rows) {
      var songs = rows.map(function(item) {
          return {
              title: item.title,
              artist: item.artist
          }
      });
      // In this case, "songs" is our "context" object.
      var stream = mu.compileAndRender('index.html', {songs: songs, header: "header.html"})
      stream.pipe(response);
  });
});*/


app.listen(3000, function () {
  console.log('Example app listening on port 3000! Open and accepting connections until someone kills this process');
});
