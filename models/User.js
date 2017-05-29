"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
            type: DataTypes.STRING,
            field: 'username'
        },
    userpassword: {
            type: DataTypes.STRING,
            field: 'userpassword'
        }
  }, {
    classMethods: {
      associate: function(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        User.belongsToMany(models.Playlist, {
          onDelete: "CASCADE",
		  through: 'UsersPlaylists',
          //foreignKey: 'id'
		  });
		
      }
    }
  });

  return User;
};