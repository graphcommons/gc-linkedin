"use strict";

var db = require("../db.js");

var Member = function (obj) {
  this._data = obj;
  this._saved = false;
  this.id = obj.id;
};

Member.prototype.save = function(callback) {
  this._data.positions.values = "temp";
  db.put(this._data, function (err){
    console.dir(err);
    callback(err);
  }).key("members/" + this.id);
};

Member.findById = function (id, callback) {
  db.get("members/" + id).on(function (data, field) {
    console.log(data);
    console.log(field);
    debugger;
    var member;
    if (!data) {
      member = new Member({id: id});
    }
    else {
      member = new Member(data);
      member._saved = true;
    }
    callback(null, member);
  });
};

Member.findByObject = function (obj, callback) {
  db.get("members/" + obj.id, function (err, memberObj) {

    var member;
    if (!memberObj) {
      member = new Member(normalizeObj(obj));
    }
    else {
      member = new Member(memberObj);
      member._saved = true;
    }

    callback(null, member);
  });
};

module.exports = Member;
