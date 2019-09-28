// funtions necessary to run Instagram Bot
const insta = require('instagram-private-api');
const Bluebird = require('bluebird');
const fs = require('fs');


const ig = new insta.IgApiClient();

//Login Function
const login = async function (igUsername,igPassword,cb) {
  ig.state.generateDevice(process.env.IG_USERNAME=igUsername);
  ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD=igPassword);
 }
 

//Post Photo Function
const igSendImage = function(igUsername,igPassword,imageFileName,photoDescription,photoLocation){
  //Get local stored photo
  const imagePath = './uploads/'+imageFileName;
 
   (async () => {
    await login(igUsername,igPassword);
    const { latitude, longitude, searchQuery } = {
      latitude: 0.0,
      longitude: 0.0,
      // not required
      searchQuery: photoLocation,
    };
    // Get the place, If searchQuery is undefined, you'll get the nearest places to your location
    
    const locations = await ig.search.location(latitude, longitude, searchQuery);
    const mediaLocation = locations[0];
    await ig.publish.photo({
      // read the file into a Buffer     
      file: await Bluebird.fromCallback(cb => fs.readFile(imagePath, cb)),
      location: mediaLocation,
      caption: photoDescription 
    });  
    console.log('Image published');
    return true;
    })();
  };
    
  // Send message to followers Funtion
  const igDmFollowers = function(igUsername,igPassword,igMessage){
     (async () => {
        await login(igUsername,igPassword);
        //GET ACCOUNT FOLLOWERS (by username and then ID)
        const followersFeed = await ig.feed.accountFollowers();
        const followersThread =  await followersFeed.items();
        const followerUsername = followersThread[0].username;
        let userId = await ig.user.getIdByUsername(followerUsername);
        let thread = ig.entity.directThread([userId.toString()]);
    
        //Get number of friends
        const friendIds = followersThread.map(x => x.username);
        for (let i = 0; i < friendIds.length; i++) {
            userId = await ig.user.getIdByUsername(friendIds[i]);
            thread = ig.entity.directThread([userId.toString()]);
            await thread.broadcastText(igMessage); 
        }
        console.log('Message: \'', igMessage, '\' sent to ', friendIds.length, ' followers.')
        return  friendIds.length;
        })();
    };

   
//funtions to export
module.exports.igSendImage=igSendImage;
module.exports.igDmFollowers=igDmFollowers;
// module.exports.igLogin=login;