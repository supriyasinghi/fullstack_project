module.exports = {
    addToCal: 
    //function addEvent(start, end, notes, event){
    function addEvent(start, end, notes, address, eventname){
        const { google } = require('googleapis')
        const {OAuth2} = google.auth
        //madisen
         const oAuth2Client = new OAuth2(
             '927694328250-1a84f2t1sgcian5ctjbe9eu7s3kp1u8l.apps.googleusercontent.com',
             'q7NRCo_E8UsIJ3JIQSqL9ZTm'
         )
         oAuth2Client.setCredentials({
             refresh_token:
                 '1//045Q_2Gzgm-Y9CgYIARAAGAQSNwF-L9IrZUHqY7nWE4IdQhB2r-lGEjQJoM3YUK_wRnBT1gl_qYG7DKClIVy1IcU93vyjFVt0Pp4',
         })
        //supriya
        /*const oAuth2Client = new OAuth2(
            '506165811687-5ahuaskflivg7qst5t4rmhopo6f4be00.apps.googleusercontent.com',
            'xkJKZ6bBWev4VrVHrF-iEvBC'
        )
        oAuth2Client.setCredentials({
          refresh_token: 
          '1//04UB6L0AR9IK2CgYIARAAGAQSNwF-L9Irxmr0rNqX1z_vSu9EU5DVUiJhHpDG_H8SeIywxLZkQv0C3FppMLHlKSzFpfgdzy7nV0w',
        })*/
    
        const calendar = google.calendar({version: 'v3', auth: oAuth2Client })
        const eventStartTime = new Date(start)
        const eventEndTime = new Date(end)
        const cal_event = {
            summary: eventname,
            location: address,
            description: notes,
            colorId: 1,
            start: {
                dateTime: eventStartTime,
                timeZone: 'America/Denver',
            },
            end: {
                dateTime: eventEndTime,
                timeZone: 'America/Denver',
            },
        }
        calendar.freebusy.query(
            {
                resource: {
                    timeMin: eventStartTime,
                    timeMax: eventEndTime,
                    timeZone: 'America/Denver',
                    items: [{id: 'primary'}],
                },
            },
            (err, res) => {
                if(err) return console.error('Free Busy Query Error: ', err)
    
                const eventsArr = res.data.calendars.primary.busy
    
                if(eventsArr.length === 0)
                    return calendar.events.insert(
                        { calendarId: 'primary', resource: cal_event },
                        err => {
                            if(err) return console.error('Calendar Event Creation Error ', err)
                            return console.log('Calendar Event Created.')
                        }
                    )
                return console.log('Sorry I am Busy')
            }
        )
    }    
}