// Depends on ./ical_events.js

recur_events = []

function an_filter(string) {
    // remove non alphanumeric chars
    return string.replace(/[^\w\s]/gi, '')
}

function moment_icaltime(moment, timezone) {
    // TODO timezone
    return new ICAL.Time().fromJSDate(moment.toDate())
}

function expand_recur_events(start, end, timezone, events_callback) {
    events = []
    for (event of recur_events) {
	event_properties = event.event_properties
        expand_recur_event(event, moment_icaltime(start, timezone), moment_icaltime(end, timezone), function(event){
            fc_event(event, function(event){
                events.push(merge_events(event_properties, merge_events({className:['recur-event']}, event)))
            })
        })
    }
    events_callback(events)
}

function containsEvent(events, event, dict) {
    var hash = String(event.end) + String(event.start) + event.title;
    return !!dict[hash]
}

function fc_events(ics, event_properties) {
    events = []
    dict = {}
    ical_events(
        ics,
        function(event){
            fc_event(event, function(event){
                if (!containsEvent(events, event, dict)) {
                    var hash = String(event.end) + String(event.start) + event.title;
                    events.push(merge_events(event_properties, event))
                    dict[hash] = true
                }
            })
        },
        function(event){
            event.event_properties = event_properties
            recur_events.push(event)
        }
    )
    return events
}

function merge_events(e, f) {
    // f has priority
    for (k in e) {
        if (k == 'className') {
            f[k] = [].concat(f[k]).concat(e[k])
        } else if (! f[k]) {
            f[k] = e[k]
        }
    }
    return f
}

function split_colors(colors) {
    try {
        return colors.match(/.{1,3}/g)
    } catch (e) {
        return null
    }
}

function getBackgroundColor(colors) {
    colors = split_colors(colors)
    if (colors)
        return 'rgb('+colors[0]+','+colors[1]+','+colors[2]+')'
    else
        return null
}

function fc_event(event, event_callback) {
    bgColor = getBackgroundColor(event.getFirstPropertyValue('color'))
    e = {
        title:event.getFirstPropertyValue('summary'),
        url:event.getFirstPropertyValue('url'),
        id:event.getFirstPropertyValue('uid'),
        className:['event-'+an_filter(event.getFirstPropertyValue('uid'))],
        allDay:false,
        backgroundColor: bgColor,
        textColor: 'rgb(0,0,0)'
    }
    try {
        e['start'] = event.getFirstPropertyValue('dtstart').toJSDate()
    } catch (TypeError) {
        console.debug('Undefined "dtstart", vevent skipped.')
        return
    }
    try {
        e['end'] = event.getFirstPropertyValue('dtend').toJSDate()
    } catch (TypeError) {
        e['allDay'] = true
    }
    event_callback(e)
}
