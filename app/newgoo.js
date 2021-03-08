module.exports = {
    add: 
    function addEvent(start, end, note, new_event){
        const { google } = require('googleapis')
        
        const {OAuth2} = google.auth
        
        const oAuth2Client = new OAuth2(
            '927694328250-1a84f2t1sgcian5ctjbe9eu7s3kp1u8l.apps.googleusercontent.com',
            'q7NRCo_E8UsIJ3JIQSqL9ZTm'
        )
    
        oAuth2Client.setCredentials({
            refresh_token:
                '1//045Q_2Gzgm-Y9CgYIARAAGAQSNwF-L9IrZUHqY7nWE4IdQhB2r-lGEjQJoM3YUK_wRnBT1gl_qYG7DKClIVy1IcU93vyjFVt0Pp4',
        })
    
        const calendar = google.calendar({version: 'v3', auth: oAuth2Client })
    
        const eventStartTime = new Date(start)
    
        const eventEndTime = new Date(end)

        const address = new_event.address1 + ' ' + new_event.city + ', ' + new_event.zipcode + ' ' + new_event.country
    
        const event = {
            summary: event.eventname,
            location: address,
            description: notes,
            start: {
                dateTime: eventStartTime,
                timeZone: 'America/Denver',
            },
            end: {
                dateTime: eventEndTime,
                timeZone: 'America/Denver',
            },
            colorId: 1,
    
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
                        { calendarId: 'primary', resource: event },
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

