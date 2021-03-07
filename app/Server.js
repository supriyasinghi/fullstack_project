//Madisen Hallberg
//Full Stack Project
//
//Setup
var calendar = require('./newgoo');

var mysql = require('mysql');
const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });
const {body,validationResult} = require('express-validator');
const { eventNames } = require('process');
const { check } = require('yargs');
enctype="application/x-www-form-urlencoded";

app.set('main', __dirname + '/app');
app.set('view engine', 'pug');

app.use(parser.json());
app.use(express.static('assets'))
app.use(express.static('stylesheets'))

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
      res.render("main",{
        title: "Events",
        heading: "Event Planner",
        events: data});
    })
  });
})

app.get('/search*', function(req,res){
  let searchParam = req.query.query;
  pool.getConnection(function(err, connection){
    if (err) throw err;
    // connection.query('SELECT * FROM events where city like "%'+searchParam+'%"',
    connection.query(
      'SELECT *'+
      ' FROM events'+ 
      ' WHERE eventname LIKE "%'+searchParam+'%"' +
      ' OR city LIKE "%'+searchParam+'%"'+
      ' OR country LIKE "%'+searchParam+'%"'+
      ' OR address1 LIKE "%'+searchParam+'%"',

      function(err, result){
        if(err) throw err;
        const data = result;
        console.log(data);
        res.render("main",{
          title: "Events",
          heading: "Events Search List",
          events: data});
        // res.render("main",{events: data});
    });
  })
})

//specific event card view on click of add button from main page.
app.get('/card*', function(req,res){
  //let card = req.query.query
  let searchParam = req.query.query;
  console.log(`EVENT NAME: ${searchParam}`)
  pool.getConnection(function(err, connection){
    if (err) throw err;
    //pattern--> connection.query(sql,function(err,result){});
    connection.query(
      'SELECT *'+
      ' FROM events'+ 
      ' WHERE eventname like "%'+searchParam+'%"',
    	function(err, result){
        if(err) throw err;
        const data = result;
        console.log(data);
        res.render("card",{
          title: "Event-Schedule",
          heading: "Schedule Event",
          events: data});
      });
  })
})

//add event to calendar
app.post('/card*', urlencodedParser, async(req, res, next) => {

  let searchParam = req.query.query;
  console.log(`EVENT NAME: ${searchParam}`)
  pool.getConnection(function(err, connection){
    if (err) throw err;
    //pattern--> connection.query(sql,function(err,result){});
    connection.query(
      'SELECT *'+
      ' FROM events'+ 
      ' WHERE eventname like "%'+searchParam+'%"',
    	function(err, result){
        if(err) throw err;
        const data = result;
        console.log(data);

   //Get data from contact-form input-fields
   let start = req.body.start;
   let end = req.body.end;
   let notes = req.body.notes;

   console.log(typeof calendar.add(start, end, notes, data));

})

//Route to contact us page.
app.get('/contact', async(req, res) => {
    res.render("contact", {
       title: "Contact Us",
       heading: "Contact Form",
    });
})

app.get('/submit',function(req,res){
    res.render('contact');  //check what file name will come, index or contact
});

app.post('/submit', urlencodedParser, async(req, res, next) => {
  let d = new Date()
  let contact_date= d.getTime()
  //Get data from contact-form input-fields
  let contact_name = req.body.name;
  let contact_email = req.body.email;
  let contact_message;
  let contact_signup;

  //validate
  if (req.body.message != '')
    contact_message = req.body.message;
  else contact_message = 'No Feedback was submitted'
  
  if (req.body.signup == true){
    contact_signup = 'yes';
  }
  else contact_signup = 'No';

//Contact up form validation
  console.group('==========Form Submission==========')
  // console.log('Name : ', contact_name)
  // console.log('Email : ', contact_email)
  console.log(`New Data in Contact Us`)
  console.log(`Name: ${contact_name}`)
  console.log(`Email: ${contact_email}`)
  console.log(`Message: ${contact_message}`)
  console.log(`Signup: ${contact_signup}`)
  console.log(`Date: ${contact_date}`)
  console.groupEnd()

  pool.getConnection(function(err, connection){
    if (err) throw  err;
    console.log("connected");
    const insert_sql ="INSERT INTO contactus "+
                      "(`cname`,`email`,`message`,`signup`,`date`)"+
                      " VALUES ("+
                      "'"+contact_name+
                      "','"+contact_email+
                      "','"+contact_message+
                      "','"+contact_signup+
                      "','"+contact_date+
                      "')";
    connection.query(insert_sql, function(err, result){
      if(err) throw err;
      console.log("Contact-Us Entry created");
    });

    res.render("submit",{
      title: "Thanks",
      heading: "Form Submitted",
      subheading1 : `Thankyou '${contact_name}' for contacting us.`,
      subheading2 : `We will get back to you at '${contact_email}' as soon as possible.`,
    });
  })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});