console.log('Client-side code running');

const dmSubmitButton = document.getElementById('dmSubmit');
const imageSubmitButton = document.getElementById('imageSubmit');


dmSubmitButton.addEventListener('click',function(e){
    alert('Message Sent');
});

imageSubmitButton.addEventListener('click',function(e){
    alert('Image Posted');
});