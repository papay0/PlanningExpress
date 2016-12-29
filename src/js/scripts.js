ics_sources = [
    // {url:'ics/ADECal.ics',event_properties:{color:'blue', editable: false}},
    // {url:'ics/cloud.ics',event_properties:{color:'red', editable: false}},
    {url:'https://www.etud.insa-toulouse.fr/planning/index.php?gid=380%20384&wid=1&ics=1&planex=2',event_properties:{color:'green', editable: false}}
    // https://www.etud.insa-toulouse.fr/planning/index.php?gid=380%20384%20554&wid=1&ics=1&planex=2
]
// {url:'samples/32c3.ics'},
// {url:'samples/daily_recur.ics',event_properties:{className:['daily-recur'], url:'http://recurring.events.example.org/'}}


function data_req (url, callback) {
    req = new XMLHttpRequest()
    req.addEventListener('load', callback)
    req.open('GET', url)
    req.send()
}

function add_recur_events() {
    if (sources_to_load_cnt < 1) {
        $('#calendar').fullCalendar('addEventSource', expand_recur_events)
    } else {
        setTimeout(add_recur_events, 30)
    }
}

function load_ics(ics){
    data_req(ics.url, function(){
        $('#calendar').fullCalendar('addEventSource', fc_events(this.response, ics.event_properties))
        sources_to_load_cnt -= 1
    })
}

$('#calendar').fullCalendar({
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
    },
    
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    locale: 'fr',
    defaultView: 'agendaWeek',
    eventLimit: true, // allow "more" link when too many events
    googleCalendarApiKey: 'AIzaSyA81JdGA7DKjYHRoo37CL06J5bXSq5pnFQ',
    events: 
        {
            googleCalendarId: 'amicale-insat.fr_rhkmvfoa1edmsi4p3j87v4668c@group.calendar.google.com'
        },
    /*events: [{
        title: 'event1',
        start: '2016-12-28'
        }, {
        title: 'event2',
        start: '2010-01-05',
        end: '2010-01-07'
        }, {
        title: 'event3',
        start: '2010-01-09T12:30:00',
        allDay: false // will make the time show
    }]*/
});
sources_to_load_cnt = ics_sources.length
for (ics of ics_sources) {
    load_ics(ics)
}
add_recur_events()
	