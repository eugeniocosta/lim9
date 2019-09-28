console.log('Client-side code running');

const button = document.getElementById('submit');

button.addEventListener('click',function(e){
    console.log('button clicked');  
});
var name = "<%= name %>";

console.log(name);
