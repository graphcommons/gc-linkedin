"use strict";

var https = require("https");
var Promise = require("promise");

var getUserInfoFromLinkedIn = function (id, accessToken) {
  return new Promise(function(resolve, reject) {
    var options = {
      host: "api.linkedin.com",
      port: 443,
      path: "/v1/people/~:(id,num-connections,picture-url,positions,location,public-profile-url,industry,first-name,last-name,formatted-name,headline,specialties,summary)?format=json",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    };

    var req = https.request(options, function (res) {
      var total_response = "";
      res.setEncoding("utf8");

      res.on("data", function (chunk) {
        total_response += chunk;
      });

      res.on("end", function() {
        resolve(JSON.parse(total_response));
      });
    });

    req.end();

    req.on("error", function() {
      console.log("some error maybe");
      reject();
    });
  });
};

var prepareGraphSignals = function (userInfo) {
  var actions = [];
  actions.push({
    "action": "node_create",
    "type": "Member",
    "name": userInfo.formattedName,
    "reference": userInfo.publicProfileUrl,
    "image": userInfo.pictureUrl,
    "description": userInfo.summary,
    "properties": {
      "linkedin_id": userInfo.id,
      "headline": userInfo.headline,
      "connections": userInfo.numConnections
    }
  });

  actions.push({
    "action": "edge_create",
    "from_type": "Member",
    "from_name": userInfo.formattedName,
    "to_type": "Industry",
    "to_name": userInfo.industry,
    "name": "WORKED_IN"
  });

  userInfo.positions.values.forEach(function (position) {
    actions.push({
      "action": "edge_create",
      "from_type": "Member",
      "from_name": userInfo.formattedName,
      "to_type": "Company",
      "to_name": position.company.name,
      "name": "HELD_POSITION",
      "properties": {
        "is_current": position.isCurrent,
        "start_date": position.startDate.year + " - " + position.startDate.month
      }
    });
  });

  return JSON.stringify({
    signals: actions
  });
};

var sendToGraphCommons = function(userInfo) {

  return new Promise(function(resolve, reject) {
    var signals = prepareGraphSignals(userInfo);

    var options = {
      host: "graphcommons.com",
      port: 443,
      path: "/api/v1/graphs/" + process.env.GC_GRAPH_ID + "/add",
      method: "PUT",
      headers: {
        "Authentication": process.env.GC_API_KEY,
        "Content-Type": "application/json"
      }
    };

    var req = https.request(options, function (res) {
      var total_response = "";

      res.setEncoding("utf8");

      res.on("data", function(chunk) {
        total_response += chunk;
      });

      res.on("end", function() {
        resolve(JSON.parse(total_response));
      });
    });

    req.write(signals);
    req.end();

    req.on("error", function() {
      console.log("error here");
      reject();
    });
  });
};

var scrapeUserInfo = function (id, accessToken) {
  getUserInfoFromLinkedIn(id, accessToken).then(sendToGraphCommons).then(function() {
    console.log("this should be ok now");
  });
};


module.exports = scrapeUserInfo;
