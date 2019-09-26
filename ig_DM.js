// funtion responsable for sending DMs
import {insta} from 'instagram-private-api'; 

// User Data
const igUser='nitevakos@tympe.net';
const igPassword='instatest12345';
const igMessage = 'New Text';

//async Funtion
const ig_FollowersDM = async () => {
  const ig = new insta.IgApiClient();

   //Login Function
  async function login() {
    ig.state.generateDevice(process.env.IG_USERNAME=igUser);
    ig.state.proxyUrl = process.env.IG_PROXY;
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD=igPassword);
  }
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
    return;
  })()
};
//run program
ig_FollowersDM();