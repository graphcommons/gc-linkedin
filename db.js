"use strict";

var Promise = require("promise");
var fs = require("fs");
var path = require("path");
var file = path.join(__dirname, "db/records.db");
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function () {
  if (!exists) {
    db.run("CREATE TABLE members (id TEXT, created_at INTEGER); CREATE INDEX idx1 ON members(id);")
  }
});

process.on('exit', function() {
  db.close();
  process.exit();
});

process.on('SIGINT', function() {
  db.close();
  process.exit();
});

function putItem (id) {
  return new Promise(function (resolve, reject) {
    db.serialize(function() {
      console.log("about to insert");
      db.run("INSERT INTO members VALUES(?, ?)", [ id, Date.now() ], function (err) {
        if (err) {
          reject();
        }
        else {
          resolve();
        }
      });
    });
  });
}

function getItem (id) {
  return new Promise(function (resolve, reject) {
    db.serialize(function() {
      db.get("SELECT * FROM members WHERE id = ?", [ id ], function (err, row) {
        if (err) {
          reject();
        }
        else {
          resolve(row !== undefined);
        }
      });
    });
  });
}

module.exports = {
  put: putItem,
  get: getItem
};
