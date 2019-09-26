const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const emulateDevice = devices['iPhone 4'];

const igUser='eugenio.insta.test@gmail.com';
const igPassword='instatest12345';

const igPuppeteer= function(){
  (async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 [FBAN/FBIOS;FBAV/202.0.0.55.99;FBBV/135472877;FBDV/iPhone5,2;FBMD/iPhone;FBSN/iOS;FBSV/10.3.3;FBSS/2;FBCR/Telekom.de;FBID/phone;FBLC/de_DE;FBOP/5;FBRV/0]')
  await page.emulate(emulateDevice);
  await page.goto('https://www.instagram.com/accounts/login/');
  // await page.goto(URL, {waitUntil: 'networkidle0'});
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', igUser, {delay: 10});
  await page.type('input[name="password"]', igPassword,{delay: 10});
 // await page.click('button[type="submit"]');
  let loginButton = await page.$x('//div[contains(text(), "Log In")]');
 
  
  if (loginButton.length > 0) {
    await loginButton[0].click();
  }else{
    console.log('Button not found'); 
  }

  
  //save info pop up window
  await page.waitForSelector('#react-root > section > main > div > button');
  let notNowButton = await page.$x('//button[contains(text(),"Not Now")]');
  await notNowButton[0].click();

  //add insta do home screen pop up window
  await page.waitForSelector('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.HoLwm');
  let cancelButton = await page.$x('//button[contains(text(),"Cancel")]');
  await cancelButton[0].click();



  notNowButton = await page.$x('//button[contains(text(),"Not Now")]');
  if (notNowButton.length>0) {
     await notNowButton[0].click();
  }


  //upload button
  await page.waitForSelector('#react-root > section > nav.NXc7H.f11OC > div > div > div.KGiwt > div > div > div.q02Nz._0TPg')
  let newPost = await page.$x('//*[@id="react-root"]/section/nav[2]/div/div/div[2]/div/div/div[3]');

  // if (newPost.length>0) {
  //   await newPost[0].click();}
  

  
  //notifications pop up window
  // await page.waitForSelector('body > div.RnEpo.Yx5HN > div > div > div._08v79')
  // notNowButton = await page.$x('//button[contains(text(),"Not now]');
  // await notNowButton[0].click();



 // file selection

 let test=[];
 
 //input on site
 test[0]=' #react-root > form > input'
 test[1]='#react-root > section > main > section > div.zGtbP > div > div > div > div:nth-child(1) > button > form > input'
 //profile pic
 test[2]=' #react-root > section > main > section > div:nth-child(3) > div._2eEhX > div:nth-child(2) > form > input'
 test[3]='#react-root > section > main > div:nth-child(2) > form > input'
 test[4]='#react-root > section > nav.gW4DF > div > div > form > input'
 test[5]='#react-root > section > nav.NXc7H.f11OC > div > div > form > input'
 test[6]=' #react-root > section > main > section > div:nth-child(3) > div:nth-child(2) > div > article:nth-child(1) > div.eo2As > section.sH9wk._JgwE.eJg28 > div > form > input'

  // const elementHandle = await page.$(test[2]);
  
  // await elementHandle.uploadFile("./img/1.jpg");

//confirm image
// confirmButton = await page.$x('//button[contains(text(),"Save")]');
// if (confirmButton.length>0) {
//    await confirmButton[0].click();
// }else{console.log('no button');
// }
//  await browser.close();
})();};





igPuppeteer();
