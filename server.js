const express = require("express");
const app = express();
var request = require("request");
var trulioo = require("trulioo-embedid-middleware");



//actual list can be saved to MongoDB or JSON file


// our default array of Strata wishes
const dreams = [
  "Replace fences : Verified",
  "Cut down big pine trees : Verified",
  "Tesla solar roof : Verified"
];



// make all the files in 'public' available
app.use(express.static("public"));
app.use(express.json({limit:'1mb'}));
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });


// install trulioo middleware for node
const truliooMiddleware = require('trulioo-embedid-middleware')({ 
apiKey: process.env.BE });  //NOTE: can switch experience(data fields required ect.) by using other apiKeys like BE2 I used for testing
const port = 8080; 
// truliooMiddleware will handle accesstoken 
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



// set up simple api to handle unique transId to call for verification with
app.post("/api",(req, res)=>{
 
  console.log("Server.js 87 recieved from front end ",req.body );
  var transIdURL=req.body.url;
  console.log("88transId in URL is ", transIdURL);
  if(!transIdURL){
    console.log("failed verification");
    return res.json({"verification": "failed"});
  }else{
    var options = {
    method: 'GET',
    url: transIdURL,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'x-trulioo-api-key': process.env.BE
      }
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log("inside request  Server.js 108 result of verification is :", typeof(body), body);
    let jsonOutput=JSON.parse(body);
    console.log(" body keys are ", Object.keys(jsonOutput));
    
      let responseObject={"verification_Result": jsonOutput.transactionResult};
      // loading up name fields to send back to front end
      responseObject.firstName=jsonOutput.steps[0].inputFields[4].Value;
      responseObject.lastName=jsonOutput.steps[0].inputFields[5].Value;
      console.log("send back to front end: ", responseObject);
      res.json(responseObject);
  });
 }  
});


// just playing around with verification results here: 
// querry below API with firstNameLastName to see if we have thier info:
app.get("/getFields/:name", (req, res)=> {
  var name=req.params.name;
  console.log("inside server.js getFields", name )
  var options = {
    method: 'GET',
    url: "https://gateway.trulioo.com/trial/configuration/v1/testentities/Identity Verification/US",
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'x-trulioo-api-key': process.env.BE
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      let peopleList=JSON.parse(body);
      
      console.log("People List is ", typeof peopleList );
      // iterate through PeopleList to search for our Person
      for (var i=0; i<peopleList.length; i++){
        console.log(peopleList[i]);
        // note convention used here is FirstNameLastName
        let checkName=peopleList[i].PersonInfo.FirstGivenName + peopleList[i].PersonInfo.FirstSurName; 
        console.log("does "+ checkName+" = "+name);
       
        if(checkName==name){
          console.log(name+"passed");
          return res.send(name+" has been verified");  
        }
        
      }
      
                         
      
     
      if(!peopleList[0]){
        res.send("Must verify first, please reset page and complete verification form");
      }
      //res.send(JSON.stringify(peopleList[0]));
    });
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
