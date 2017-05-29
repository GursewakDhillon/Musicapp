"use strict";

module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define("session", {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	sessionKey: {
            type: DataTypes.STRING,
            field: 'sessionKey'
        
	}, 
  sessionUser: {
            type: DataTypes.STRING,
            field: 'sessionUser'
        }
  },{
    classMethods: {
      associate: function(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        Session.belongsTo(models.User, {
          onDelete: "CASCADE",
		  //through: 'UsersPlaylists',
          foreignKey: 'sessionUser'
		  });
		
      }
    }
  });

  return Session;
};