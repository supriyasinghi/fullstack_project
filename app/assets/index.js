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
        modal = document.getElementById('myModal');
        modal.style.display = "block";
      }
    })(i);
  }
}
window.onload = function(){
  modalDisplay();
}