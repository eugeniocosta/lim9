// Server instagram Bot - 2019

//requiments
const insta = require('instagram-private-api');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const express = require('express');
const igFunc = require('./igFunctions'); //require Instagram Function Module - PostImage & DM Followers

//constants
const ig = new insta.IgApiClient();
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const publicDirectoryPath = path.join(__dirname, '/public');
const port = 4000;

let loggedIn = false;
let igUsername,igPassword;

app.use(express.static(publicDirectoryPath));


//save uploaded file as .jpg
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });



   ///////////////////////////////////
  //         Index Page            //
 ///////////////////////////////////
app.get('/',function(req,res){
   res.render('/index');   
});

//Log in as user
app.post('/login',urlencodedParser, function (req, res) {
  igUsername=req.body.igUsername;
  igPassword=req.body.igPassword;
  // igFunc.igLogin(igUsername,igPassword)
  login(igUsername,igPassword);
  (async   () =>{
    await login(igUsername,igPassword)
    if ( loggedIn) { 
          console.log('good login');
          res.sendFile(path.join(__dirname,'./public/main.html'));
        }else{
          console.log('bad login');
          res.sendFile(path.join(__dirname,'./public/badLogin.html'));
        }
  })()
})


const login = async function (igUsername,igPassword) {
  ig.state.generateDevice(process.env.IG_USERNAME=igUsername);
  ig.state.proxyUrl = process.env.IG_PROXY;
  try{
    session=await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD=igPassword);
    loggedIn = true;
    console.log('Logged in as:',igUsername);   
  } catch (error) {
    loggedIn = false;
  }
 };
 
    ///////////////////////////////////
   //        Image Post Page        //
  ///////////////////////////////////

// //get image,description and location to post
app.post('/imagePost',upload.single('photoPost'), function (req, res) {
   if(req.file) {
        console.log('FILE.NAME: ',req.file.filename);
        console.log('original.NAME: ',req.file.originalname);
        console.log('Photo Description: ',req.body.photoPostDescription);
        console.log('Photo Location: ',req.body.photoPostLocation);     
    }
    else throw 'error';
    igFunc.igSendImage(igUsername,igPassword,req.file.filename,req.body.photoPostDescription,req.body.photoPostLocation); 
  })

   ///////////////////////////////////
  //      DM Followers Page        //
 ///////////////////////////////////
 
app.post('/dmFollowers',urlencodedParser, function (req, res) {
  
  (async function () {
    console.log('\n\n',await  igFunc.igDmFollowers(igUsername,igPassword,req.body.dmMessage));
  })()
})

   ///////////////////////////////////
  //          Send FIles           //
 ///////////////////////////////////
app.get('/client.js',function(req,res){
    res.sendFile(path.join(__dirname + '/client.js'));
});
app.get('/igFunctions.js',function(req,res){
  res.sendFile(path.join(__dirname + '/igFunctions.js')); 
});
app.get('/instagramLogo.jpg',function(req,res){
  res.sendFile(path.join(__dirname + '/img/instagramLogo.jpg')); 
});


   ///////////////////////////////////
  //         Start Server          //
 ///////////////////////////////////
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});