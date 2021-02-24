var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "eventplanner",
    password: "eventplanner",
    database: "events"
});

con.connect(function(err){
    if (err) throw err;
    con.query("SELECT * FROM events", function(err, result, fields){
        if(err) throw err;
        console.log(result);
    })
});