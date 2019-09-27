const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const express = require('express');

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const publicDirectoryPath = path.join(__dirname, '/public');

app.use(express.static(publicDirectoryPath));

const port = 2000;
let loggedIn = false;

//require Instagram Function Module - PostImage & DM Followers
const igFunc = require('./igFunctions.js');





// const upload = multer({dest: __dirname + '/uploads'});


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
  

  igFunc.igLogin(req.body.igUsername,req.body.igPassword)
    
})


app.post('/afterLogin',urlencodedParser, function (req, res) {
  
  console.log(loggedIn);
})



   ///////////////////////////////////
  //        Image Post Page        //
 ///////////////////////////////////
app.get('/imagePost',function (req, res) {
    res.render('/imagePost'); 
})

//get image to post
//get text message 
app.post('/imagePost',upload.single('photoPost'), function (req, res) {

   if(req.file) {
        // res.json(req.file);
        console.log('FILE.NAME: ',req.file.filename);
        console.log('original.NAME: ',req.file.originalname);
        console.log('Photo Description: ',req.body.photoPostDescription);
        console.log('Photo Location: ',req.body.photoPostLocation);
       
    }
    else throw 'error';
    
     igFunc.igSendImage(req.file.filename,req.body.photoPostDescription,req.body.photoPostLocation); 
  })

   ///////////////////////////////////
  //      DM Followers Page        //
 ///////////////////////////////////
app.get('/dmFollowers',function (req, res) {
  res.render('/dmFollowers'); 
})

//get text message 
app.post('/dmFollowers',urlencodedParser, function (req, res) {
  igFunc.igDmFollowers(req.body.dmMessage); 
 })


   ///////////////////////////////////
  //         Message Sent          //
 ///////////////////////////////////
app.get('/client.js',function(req,res){
    res.sendFile(path.join(__dirname + '/client.js'));
});
app.get('/igFunctions.js',function(req,res){
  res.sendFile(path.join(__dirname + '/igFunctions.js')); 
});




   ///////////////////////////////////
  //         Start Server          //
 ///////////////////////////////////
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

