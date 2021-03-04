const { time, timeLog, timeStamp } = require('console');
const {google} = require('googleapis');
require('dotenv').config();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET  = '-08:00';

// Get date-time string for calendar
const dateTimeForCalendar = () => {

    let date = new Date();

    let year = date.getFullYear();  //format = yyyy
    //set month to 2 digit
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    //set date to 2 digit
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    //set hour to 2 digit
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    //set minute to 2 digit
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1 hour
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

let dateTime = dateTimeForCalendar();
console.log(dateTime);
console.log(`Current DateTime= ${Date()}`)


// Event for Google Calendar
let event = {
    'summary': `This is the summary.`,  //event name
    'description': `This is the description.`,
    'start': {
        'dateTime': dateTime['start'],      //event date to occur(with current push time)
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': dateTime['end'],        //event date endtime is +1 hr.
        'timeZone': 'America/Los_Angeles'
    }
};

insertEvent(event)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

// // Get all the events between two dates
// const getEvents = async (dateTimeStart, dateTimeEnd) => {

//     try {
//         let response = await calendar.events.list({
//             auth: auth,
//             calendarId: calendarId,
//             timeMin: dateTimeStart,
//             timeMax: dateTimeEnd,
//             timeZone: 'Asia/Kolkata'
//         });
    
//         let items = response['data']['items'];
//         return items;
//     } catch (error) {
//         console.log(`Error at getEvents --> ${error}`);
//         return 0;
//     }
// };

// //  let start = '2021-02-28T00:45:00.000Z';
// //  let end = '2021-02-28T00:45:00.000Z';

// // getEvents(start, end)
// //     .then((res) => {
// //         console.log(res);
// //     })
// //     .catch((err) => {
// //         console.log(err);
// //     });

// // Delete an event from eventID
// const deleteEvent = async (eventId) => {

//     try {
//         let response = await calendar.events.delete({
//             auth: auth,
//             calendarId: calendarId,
//             eventId: eventId
//         });

//         if (response.data === '') {
//             return 1;
//         } else {
//             return 0;
//         }
//     } catch (error) {
//         console.log(`Error at deleteEvent --> ${error}`);
//         return 0;
//     }
// };

// let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });