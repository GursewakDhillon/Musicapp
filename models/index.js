"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(null, null, null,{dialect: 'sqlite', storage: 'music.db'})
//console.log(fs);
//console.log(path);
//console.log(Sequelize);
//console.log(sequelize);

var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
	console.log(model);
    db[model.name] = model;
	
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
	  db[modelName].associate(db);
	  console.log(db[modelName]);
	
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
