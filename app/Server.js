//Madisen Hallberg
//Full Stack Project
//
//Setup
var mysql = require('mysql');
const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
//supriya

const parser = require('body-parser');
const {body,validationResult} = require('express-validator');
enctype="application/x-www-form-urlencoded";

app.set('main', __dirname + '/components');
app.set('view engine', 'pug');
//supriya
app.use(parser.json());

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

app.get('/search*', function(req,res){
    let searchParam = req.query.query;
    console.log(searchParam)  //supriya
    pool.getConnection(function(err, connection){
        if (err) throw err;
        console.log('SELECT * FROM events where city like "%'+searchParam+'%"');
        connection.query('SELECT * FROM events where city like "%'+searchParam+'%"',
        function(err, result){
            if(err) throw err;
            const data = result;
            console.log(data);
            res.render("main",{events: data});
        });
    })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});