module.exports = function(sequelize, DataType) {
    var Song = sequelize.define('songs', {
        album: {
            type: DataType.STRING,
            field: 'album'
        },
        title: {
            type: DataType.STRING,
            field: 'title'
        },
        artist: {
            type: DataType.STRING,
            field: 'artist'
        },
        duration: {
            type: DataType.INTEGER,
            field: 'duration'
        }
    },{
    classMethods: {
      associate: function(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        Song.belongsToMany(models.Playlist, {
          onDelete: "CASCADE",
		  through: 'SongsPlaylists',
		  //foreignKey: 'id'
		  });
      }
    }
  });
	

    return Song;
};
