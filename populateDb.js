var fs = require('fs');
var models = require('./models');
const bcrypt = require('bcrypt');


models.sequelize.sync({force: true}).then(function() {

    fs.readFile('./songs.json', function(err, data) {
        var music_data = JSON.parse(data);
        var songs = music_data['songs'];

        songs.forEach(function(song) {
            console.log(song);
            models.songs.create({
                title: song.title,
                album: song.album,
                artist: song.artist,
                duration: song.duration,
            });
        });
    });

	fs.readFile('./playlists.json', function(err, data) {
        var music_data = JSON.parse(data);
        var playlists = music_data['playlists'];
		//console.log(playlists);
        
		var counter=0;
        playlists.forEach(function(playlist) {
            var songsArrayArray;
			models.Playlist.create({
                name: playlist.name,
            }).then(function(play){
				songsArray=playlists[play.id-1].songs;
				for (var i=0; i<songsArray.length; i++){ 
						models.songs.findOne({where:{id:songsArray[i]}}).then(function(song){ 
						play.addSong(song);
								
					});
				};
			});	
			
			
        });
		
    });
	fs.readFile('./User.json', function(err, data) {
        var music_data = JSON.parse(data);
        var users = music_data['Users'];
		//console.log(users.length);

        users.forEach(function(user) {
            console.log(user);
			bcrypt.hash(user.userpassword, 10, function(err, hash) {
			  
			
            models.User.create({
                username: user.username,
                userpassword: hash,
                
            }).then(function(user){
				
				console.log(user.id === 1);
				if (user.id === 1)
				{
						var playId=[1,3];
						for (var i=0; i<2; i++){ 
						models.Playlist.findOne({where:{id:playId[i]}}).then(function(playlist){ 
							console.log(playlist.name);
							user.addPlaylist(playlist);
							
						}); 
					}
					
				}
				if (user.id === 2)
				{
						var playId=[2,3];
						for (var i=0; i<2; i++){ 
						models.Playlist.findOne({where:{id:playId[i]}}).then(function(playlist){ 
							console.log(playlist.name);
							user.addPlaylist(playlist);
							
						}); 
					}
					
				}
				
			});
        });
    })
	
});
});