var search = document.getElementById("search");

search.addEventListener('keyup', function(e){
    if(e.key === 'Enter'){
        window.location.href = '/search?query=' + e.value;
    }
})