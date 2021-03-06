var cardEvent;
var searchParam;
var btn = document.getElementById('myBtn');

document.addEventListener('keyup', function(e){
  searchParam = document.getElementById('search').value;
  if(e.key==='Enter'){
    console.log(searchParam);
    var search_url =  '/search?query='+ searchParam;
    window.location.href = search_url
  }
})

//modal window
var modal;
var btn = document.getElementsByClassName('selectable');
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event){
  if(event.target == modal){
    modal.style.display = "none";
  }
}

function modalDisplay(){
  var table = document.getElementById('tableId');
  var rows = table.rows;
  for (var i = 0; i < rows.length; i ++){
    rows[i].onclick = (function(){
      return function(){
        //display modal
        modal = document.getElementById('myModal');
        modal.style.display = "block";

        //set modal data
        var data = JSON.parse(this.id);
        console.log(data);
        document.getElementById('event_name').innerHTML = data.name;
        //address
        document.getElementById('address').innerHTML = data.address1;
        document.getElementById('address_2').innerHTML = data.city+', '+data.state+' '+data.zipcode;
        document.getElementById('country').innerHTML = data.country;
        //hours
        document.getElementById('hours').innerHTML = data.open+' - '+data.close;
        //image
        document.getElementById('website').href=data.website;
        document.getElementById('img').src= data.link;
      }
    })(i);
  }
}
window.onload = function(){
  modalDisplay();
}

function insertAfter(referenceNode, newNode){
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}