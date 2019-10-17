require('dotenv').config()
var request = require('request');
var moment = require('moment');

module.exports = {
    //JC DECAUX
    //CHARMETTES => 6044
    //PART DIEU => 3003 (galerie lafayette)
    //Part DIEU => 3087 (bas de la rue Eugène deruelle)
    //Angle Juliette Récamier => 6028
    //derrière part dieu => 3015
    getStationStatus : function(){
        return new Promise((resolve, reject) => {
            var favStation = [6044,3101,3003,3087,6028];
            var stationStatus = [];
            var apiKeyVelov = process.env.JC_DECAUX_API_KEY
            stationStatus.push('Il y a');
            // réussir une fois sur deux
            favStation.forEach(function(station){
                try{
                    request('https://api.jcdecaux.com/vls/v3/stations/'+station+'?contract=lyon&apiKey='+apiKeyVelov, function (error, response, stationInfo) {
                        //console.log('error:', error); // Print the error if one occurred
                        error ? reject(error) : "";
                        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        //console.log('body:', stationInfo); // Print the HTML for the Google homepage.
                        stationInfo = JSON.parse(stationInfo)
                        let num = stationInfo.number
                        let bikes = stationInfo.totalStands.availabilities.bikes;
                        let stands = stationInfo.totalStands.availabilities.stands;
                        let name = stationInfo.name;
                        let lastUpdate = moment(stationInfo.lastUpdate).format('HH:mm:ss (MM/DD)');
                        stationStatus.push(+bikes+' vélos '+stands+ ' places à '+name.split(' - ')[1].split(' / ').join(' '));
                        stationStatus.length == favStation.length ? resolve(stationStatus.join(',')) : "";
                    });
                }
                catch(e){console.log(e)}
                
            });       
            return(stationStatus);
        })
    }
}

