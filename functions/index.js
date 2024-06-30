const functions = require("firebase-functions");

// Firebase function can be called in two different ways:
// 1. HTTP request and 2. HTTP callable

// HTTP request example
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  response.send(number.toString());
});

