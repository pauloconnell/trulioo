const express = require("express");
const app = express();
var request = require("request");
var trulioo = require("trulioo-embedid-middleware");



//actual list can be saved to MongoDB or JSON file
//var fs      = require("fs");
//var data=fs.readFileSync("list.json");


// our default array of Strata wishes
const dreams = [
  "Replace fences",
  "Cut down big pine trees",
  "Tesla solar roof"
];



// make all the files in 'public' available
app.use(express.static("public"));
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });


const truliooMiddleware = require('trulioo-embedid-middleware')({ 
apiKey: process.env.BE2 });  
const port = 8080; 
// truliooMiddleware will fetch accesstoken and handle it
app.use(truliooMiddleware); 
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 

app.get("/", (req, response) => {
//   var options = {  // this was used to establish initial connection to get API key
//   method: 'GET',
//   url: 'https://api.globaldatacompany.com/connection/v1/sayhello/name'
// };

var options = {
  method: 'GET',
  url: 'https://api.globaldatacompany.com/connection/v1/testauthentication'
};

  
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log("server.js response.connection.eventsCount is ", response.connection._eventsCount)
  console.log("inside initial server request ",response.connection.authorized);
  console.log(" connection secureEstablished? authorized? ",response.connection._secureEstablished, response.connection.authorized)
  
});
  response.sendFile(__dirname + "/views/index.html");
});



//  NODE Middleware handles ID Tokens in header AUTOMATICLY
// initial connection set up...now connect to 'experience' with keys:

// app.post(process.cwd+'/trulioo-api/embidids/tokens/:publicKey', (req, res)=>{
//   var options = {
//     method: 'post',
//     url: "https://api-gateway-admin.trulioo.com/embedids/tokens",
//     headers:{
//         "Content-Type": "application/json",
//         "cache-control": "no-cache",
//         "x-trulioo-api-key":process.env.BE,
//       }
    
//   }         
//          });
  




// set up simple api to handle unique transId to call with
app.post("/api",(req, res)=>{
  console.log("Server.js 77 recieved from front end ", req.headers, req.body, Object.keys(req));
  var transId=req.experienceTransactionId;
  console.log("transId is ", transId);
  //if(req.body.sendBackUrl){
  //  transId=req.body.sendBackUrl;
  //  }
  if(!transId){
    console.log("failed verification");
    return res.send("verification failed");
  }else{
    var options = {
    method: 'GET',
    url: 'https://gateway.trulioo.com/experienceTransaction/'+transId,
    headers: {

    }
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(" 87 server.js response keys are  ", Object.keys(response));
    console.log("inside request  Server.js 88 result is :", response.transactionResult);
    //document.getElementById("trulioo")=body;
    console.log("body is ", body);
    response.send(response.transactionResult);
  });
 }  
});

//send data from 
app.post("https://gateway.trulioo.com/trial/verifications/v1/verify?",(req,res)=>{
  console.log(res);
  
});

 

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  


  response.json(dreams);
});

// listen for requests :)
//const listener = app.listen(process.env.PORT, () => {
//  console.log("Your app is listening on port " + listener.address().port);
//});
