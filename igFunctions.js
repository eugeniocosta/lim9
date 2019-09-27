const insta = require('instagram-private-api');
const Bluebird = require('bluebird');
const fs = require('fs');

// User Data
// const igUsername='eugenio.insta.test@gmail.com';
// const igPassword='instatest12345';

const igUsername='nitevakos@tympe.net'; 
const igPassword='instatest12345';
//Message
const igMessage = 'New Text';

// Photo Data
// const imagePath = './img/1.jpg';
// const imagePath = './uploads/d92f830511dd152516f0ccc773089d32';

const imgCaption = 'Pic 1'
const imgLocation = 'Aveiro'
const ig = new insta.IgApiClient();

//Login Function
const login = async function (/*igUsername,igPassword*/) {
  ig.state.generateDevice(process.env.IG_USERNAME=igUsername);
  ig.state.proxyUrl = process.env.IG_PROXY;
  callback= await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD=igPassword);
  console.log('Logged in as:',igUsername);
   
}

const igSendImage = function(imageFileName,photoDescription,photoLocation){
  //Get local stored photo
  const imagePath = './uploads/'+imageFileName;
 
   (async () => {
    await login();
    const { latitude, longitude, searchQuery } = {
      latitude: 0.0,
      longitude: 0.0,
      // not required
      searchQuery: photoLocation,
    };
    /**
     * Get the place
     * If searchQuery is undefined, you'll get the nearest places to your location
     * this is the same as in the upload (-configure) dialog in the app
     */
    const locations = await ig.search.location(latitude, longitude, searchQuery);
    /**
     * Get the first venue
     * In the real world you would check the returned locations
     */
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
    
  const igDmFollowers = function(igMessage,status){
     (async () => {
        await login();
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
        status=true;
        return;
        })();
    };

   
//funtions to export
module.exports.igSendImage=igSendImage;
module.exports.igDmFollowers=igDmFollowers;
module.exports.igLogin=login;
