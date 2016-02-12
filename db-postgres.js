'use strict';

var Promise = require('promise');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL;

pg.connect(connectionString, function (err, client, done) {

  if (err) {
    done();
    return;
  }

  var query = client.query('CREATE TABLE IF NOT EXISTS members(id text PRIMARY KEY, created_at timestamp)');

  query.on('end', function () {
    done();
  });
});

function putItem (id) {
  return new Promise(function (resolve, reject) {
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();
        return reject();
      }

      var query = client.query('INSERT INTO members VALUES($1, now())', [ id ]);

      query.on('end', function() {
        done();
        return resolve();
      });
    });
  });
}

function getItem (id) {
  return new Promise(function (resolve, reject) {
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        done();
        return reject();
      }

      var results = [];
      var query = client.query("SELECT * FROM members WHERE id=($1)", [id]);

      query.on('row', function (row) {
        results.push(row);
      });

      query.on('end', function() {
        done();
        return resolve(results.length > 0);
      })
    });
  });
}

module.exports = {
  put: putItem,
  get: getItem
};
