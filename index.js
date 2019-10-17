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
    dialog.flow('corentoulf:play-flow', (msg,flow) => {
        console.log(msg)
        flow.end()
        return 'C\'est parti, on met les Watt'
    })

    dialog.flow('corentoulf:velov-global-state', (msg,flow) => {
        console.log(msg)
        
        tools.getStationStatus().then(function(stationStatus){
            console.log(stationStatus);
            flow.end()
            return 'stationStatus'
        })
        .catch(function(e){ 
            console.log(e);
            flow.end()
            return 'Hum. Je crois qu\'on a déraillé là...'
        });
    })
    
})
