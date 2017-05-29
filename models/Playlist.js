"use strict";

module.exports = function(sequelize, DataTypes) {
  var Playlist = sequelize.define("Playlist", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        Playlist.belongsToMany(models.songs, {
          onDelete: "CASCADE",
		  through: 'SongsPlaylists',
          //foreignKey: 'id'
		  });
		  
		  Playlist.belongsToMany(models.User, {
          onDelete: "CASCADE",
		  through: 'UsersPlaylists',
          
		  });
		
      }
    }
  });

  return Playlist;
};