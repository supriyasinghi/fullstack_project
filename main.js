var mysql = require('mysql');
const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const con = mysql.createConnection({
    host: "localhost",
    user: "eventplanner",
    password: "eventplanner",
    database: "events"
});

app.get('/', async(req, res) => {
    
    con.connect(function(err){
        if (err) throw err;
        con.query("SELECT * FROM events", function(err, result, fields){
            if(err) throw err;
            const data = result;
            console.log(data);
            res.render("main", {events: data});
        })
    });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});