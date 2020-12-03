// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var request = require("request");

// our default array of dreams
const dreams = [
  "Replace fences",
  "Cut down big pine trees",
  "Tesla solar roof"
];



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, response) => {
  var options = {
  method: 'GET',
  url: 'https://api.globaldatacompany.com/connection/v1/sayhello/name'
};

var options = {
  method: 'GET',
  url: 'https://api.globaldatacompany.com/connection/v1/testauthentication'
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
  
  
request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log("inside request ",body);
  //document.getElementById("trulioo")=body;
});
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  


  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
