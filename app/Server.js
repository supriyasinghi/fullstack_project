//Madisen Hallberg
//Full Stack Project
//Setup
const calendar = require('./newgoo.js');

var mysql = require('mysql');
const axios = require("axios");
const express = require("express");
var path = require('path')
var serverStatic = require('serve-static')
const app = express();
const port = process.env.PORT || 5000;

const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });
const {body,validationResult} = require('express-validator');
const { eventNames, mainModule } = require('process');
const { check } = require('yargs');
const { typeOf } = require('react-is');
enctype="application/x-www-form-urlencoded";

app.set('views', path.join(__dirname, 'views'));
app.set('assets', path.join(__dirname, 'assets'));
app.set('main', __dirname + '/views');
app.set('view engine', 'pug');

app.use(parser.json());
app.use(express.static('assets'))
app.use(express.static(__dirname));
app.use(serverStatic(path.join(__dirname, 'app')))

const pool = mysql.createPool({
    connectionLimit : 10,
    host: "pxukqohrckdfo4ty.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "y8k6hs82i6kf8ygr",
    password: "rtvqvstv259gqoa1",
    database: "o6x6wct8kqeeydyz"
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
    });
  })
})

//view specific event card on click of add button from main page.
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

//Route to contact us page.
app.get('/contact', async(req, res) => {
    res.render("contact", {
       title: "Contact Us",
       heading: "Contact Form",
    });
})

app.get('/submit',function(req,res){
    res.render('contact'); 
});

app.post('/submit*', urlencodedParser, async(req, res, next) => {
  let current_url = req.url
  console.log(current_url)
  //add event to calendar
  if (current_url==="/submit/addcal") {
    //Get data from card-form input-fields to add in calendar
    searchParam = req.body.cal_event
    let event_id = req.body.event_id
    let start = req.body.start;
    let end = req.body.end;
    let notes = req.body.notes;
    let address = req.body.address;

    console.group('========== Add Event in Calendar ==========')
    console.log(`EVENT NAME: ${searchParam}`)
    console.log(`Location: ${address}`)
    console.log(`Details -> ${start}  -  ${end}`)
    console.log(`Notes= ${notes} `)
    console.groupEnd()

    pool.getConnection(function(err, connection){
      if (err) throw err;
      //pattern--> connection.query(sql,function(err,result){});
      connection.query(
        'SELECT *'+
        ' FROM events'+ 
        ' WHERE eventname="'+searchParam+'"',
        function(err, result){
          if(err) throw err;
          const data = result;
          console.log(`calendar-${data}`);
        });
        console.log(typeOf (calendar.addToCal(start, end, notes, address, searchParam)));
        res.render("submit",{
          title: "Event-Scheduled",
          heading: "Add to Calendar",
          subheading1: `${searchParam} is added to calendar.`,
          subheading2: `${address}`,
          subheading3: `Start Date: ${start}`,
          subheading4: `End Date: ${end}`,
          subheading5: `Notes: ${notes}`
        });
    })
  }
  //contact us page call
  else {
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

      console.group('==========Form Submission==========')
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
  }
})

//about us page
app.get('/about', function(req, res){
  res.render("about", {
    title: "About Us",
    heading: "About Us - Team",
    subheading: "We are your connection with Travel Planner",
  });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});