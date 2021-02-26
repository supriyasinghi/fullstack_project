var mysql = require('mysql');
const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/JS'));
app.engine('html', require('pug').renderFile);

const pool = mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "eventplanner",
    password: "eventplanner",
    database: "events"
});

app.get('/', async(req, res) => {
    pool.getConnection(function(err, connection){
        if (err) throw err;
        connection.query("SELECT * FROM events", function(err, result, fields){
            if(err) throw err;
            const data = result;
            console.log(data);
            res.render("main", {events: data});
        })
    });
})

app.get('/search', function(req,res){
    connection.query('SELECT * FROM events where city like "%'+req.query.key+'%"',
    function(err, result){
        if(err) throw err;
        const data = result;
        console.log(data);
        res.render("main",{events: data});
    });
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});