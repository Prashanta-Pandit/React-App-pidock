const functions = require("firebase-functions");

// HTTP request example
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  response.send(number.toString());
});

exports.toMagpies = functions.https.onRequest((request, response)=>{
  response.redirect("https://magpies.online/");
});
