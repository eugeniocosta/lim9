const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const express = require('express');

const upload = multer({dest: __dirname + '/uploads'});
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const publicDirectoryPath = path.join(__dirname, '/public');

app.use(express.static(publicDirectoryPath));

const port = 2000;

//require Instagram Function Module - PostImage & DM Followers
const igFunc = require('./igFunctions.js');

   ///////////////////////////////////
  //         Index Page            //
 ///////////////////////////////////
app.get('/',function(req,res){
   res.render('/index');  
});

// app.post('./index.html',function (req,res){
//   const name = req.body.name;
//   console.log(name); 
// })

   ///////////////////////////////////
  //        Image Post Page        //
 ///////////////////////////////////
app.get('/imagePost',function (req, res) {
    res.render('/imagePost'); 
    //  igFunc.igSendImage(); 
})

//get image to post
//get text message 
app.post('/imagePost',upload.single('photoPost'), function (req, res) {
   console.log(req.body);
   console.log(req.file.filename);
   

   if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
    
  // igFunc.igDmFollowers(req.body.dmMessage); 
})

   ///////////////////////////////////
  //      DM Followers Page        //
 ///////////////////////////////////
app.get('/dmFollowers',function (req, res) {
  res.render('/dmFollowers'); 
  //igFunc.igDmFollowers(teste); 
})

//get text message 
app.post('/dmFollowers',urlencodedParser, function (req, res) {
  // console.log(req.body.dmMessage);
  igFunc.igDmFollowers(req.body.dmMessage); 
})


   ///////////////////////////////////
  //         Message Sent          //
 ///////////////////////////////////


// app.get('/css/app.css',function(req,res){
//     res.sendFile(path.join(__dirname + '/css/app.css')); 
// }); 

app.get('/client.js',function(req,res){
    res.sendFile(path.join(__dirname + '/client.js'));
});
app.get('/igFunctions.js',function(req,res){
  res.sendFile(path.join(__dirname + '/igFunctions.js')); 
});





//Start Server
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

