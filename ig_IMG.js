const insta = require('instagram-private-api');
// import {insta} from 'instagram-private-api';


const Bluebird = require('bluebird');
const fs = require('fs');

// User Data
// const igUser='eugenio.insta.test@gmail.com';
// const igPassword='instatest12345';

const igUser='nitevakos@tympe.net';
const igPassword='instatest12345';
// Photo Data
const path = './img/1.jpg';
const imgCaption = 'Pic 1'
const imgLocation = 'Aveiro'


const igSendImage = function(){
  const ig = new insta.IgApiClient();

  //Login Function
  async function login() {
    ig.state.generateDevice(process.env.IG_USERNAME=igUser);
    ig.state.proxyUrl = process.env.IG_PROXY;
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD=igPassword);
  }

  (async () => {
    await login();
    const { latitude, longitude, searchQuery } = {
      latitude: 0.0,
      longitude: 0.0,
      // not required
      searchQuery: imgLocation,
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
      file: await Bluebird.fromCallback(cb => fs.readFile(path, cb)),
      location: mediaLocation,
      caption: imgCaption 
    });  
    console.log('Image published');
    })();
  };

module.exports.igSendImage=igSendImage();