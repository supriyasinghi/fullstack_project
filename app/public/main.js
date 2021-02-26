const search = document.getElementById("search");
search.addEventListener('keyup', function(e,req,res){
    if(e.key==='Enter'){
        var search_url =  '/search?query=' + e.value;
        res.redirect(search_url, 301)
        window.location.href = search_url
    }
})
console.log("hello world");