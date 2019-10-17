require('dotenv').config()
var mqtt = require('mqtt');
var hostname = "mqtt://localhost:1883";
var client  = mqtt.connect(hostname);
var tools = require('./tools');
client.on('connect', function () {
    console.log("[Snips Log] Connected to MQTT broker " + hostname);
    client.subscribe('hermes/#');
});

client.on('message', function (topic, message) {
    if (topic === "hermes/asr/startListening") {
        onListeningStateChanged(true);
    } else if (topic === "hermes/asr/stopListening") {
        onListeningStateChanged(false);
    } else if (topic.match(/hermes\/hotword\/.+\/detected/g) !== null) {
        onHotwordDetected()
    } else if (topic.match(/hermes\/intent\/.+/g) !== null) {
        onIntentDetected(JSON.parse(message));
    }
});

function onIntentDetected(intent) {
    console.log("[Snips Log] Intent detected: " + JSON.stringify(intent));
}

function onHotwordDetected() {
    console.log("[Snips Log] Hotword detected");
}

function onListeningStateChanged(listening) {
    console.log("[Snips Log] " + (listening ? "Start" : "Stop") + " listening");
}

const { withHermes } = require('hermes-javascript');
withHermes(hermes => {
    const dialog = hermes.dialog();

    //start Deezer flow response
    dialog.flow('corentoulf:play-flow', (msg,flow) => {
        console.log(msg)
        flow.end()
        return 'C\'est parti, on met les Watt'
    })

    //global Velov state response
    dialog.flow('corentoulf:velov-global-state', handler)
    // dialog.flow('corentoulf:velov-global-state', (msg,flow) => {
    //     console.log(msg)
    //     tools.getStationStatus()
    //         .then(function(stationStatus){
    //             console.log(stationStatus);
    //             flow.end()
    //             return 'test';//stationStatus;
    //         })
    //         .catch(function(e){ 
    //             console.log(e);
    //             flow.end()
    //             return 'Hum. Je crois qu\'on a déraillé là...';
    //         });
    // })
    // dialog.on('corentoulf:loopend', msg => {
    //     console.log(msg)
    //     dialog.publish('end_session', {
    //         sessionId: msg.sessionId,
    //         text: 'Au revoir !'
    //     })
    // })
})

function handler (msg, flow) {
    console.log(msg)
    tools.getStationStatus()
        .then(function(stationStatus){
            console.log(stationStatus);
            flow.end()
            return 'test';//stationStatus;
        })
        .catch(function(e){ 
            console.log(e);
            flow.end()
            return 'Hum. Je crois qu\'on a déraillé là...';
        });
    /* Register the same intent and handler as a possible continuation (loop). */
    flow.continue('corentoulf:velov-global-state', handler)
    /* If "loopende", well, end the loop. */
    // flow.continue('corentoulf:loopend', (msg, flow) => {
    //     flow.end()
    //     return 'Au revoir'
    // })
    /* If not recognized, register witze as the next possible intent and loop. */
    flow.notRecognized((msg, flow) => {
        flow.continue('corentoulf:velov-global-state', handler)
    })
    //return witz
}


///////////\\\\\\\\\\\\\\\\\
// function handler (msg, flow) {
//     console.log(msg)
//     const witz = handleWitze(msg)
//     /* Register the same intent and handler as a possible continuation (loop). */
//     flow.continue('udsnips:witze', handler)
//     /* If "loopende", well, end the loop. */
//     flow.continue('udsnips:loopende', (msg, flow) => {
//         flow.end()
//         return 'Auf wiedersehen'
//     })
//     /* If not recognized, register witze as the next possible intent and loop. */
//     flow.notRecognized((msg, flow) => {
//         flow.continue('udsnips:witze', handler)
//     })

//     return witz
// }
// dialog.flow('udsnips:witze', handler)