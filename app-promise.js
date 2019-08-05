const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a:{
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather.',
      string: true
    }
  })
  .help()
  .alias('help','h')
  .argv;

  var add = encodeURIComponent(argv.address);
  var geocodeURL = `http://www.mapquestapi.com/geocoding/v1/address?key=dbF5bGTGP2Ee5egPzknrOTyHxtoMVSHF&location=${add}`

  axios.get(geocodeURL).then(function(response){
    if(response.data.info == undefined || response.data.info.statuscode == 400)
    {
      throw new Error('Unable to find that address');
    }
    console.log(`${response.data.results[0].locations[0].adminArea5}, ${response.data.results[0].locations[0].adminArea3}, ${response.data.results[0].locations[0].adminArea1}`);
    var weatherURL = `https://api.darksky.net/forecast/9b6468e60dc6dd413b78ed235a868941/${JSON.stringify(response.data.results[0].locations[0].latLng.lat)},${JSON.stringify(response.data.results[0].locations[0].latLng.lng)}/`
    axios.get(weatherURL).then(function(response){
      if(response.data.code == 400 || response == undefined)
      {
        throw new Error('Unable to fetch weather');
      }
        console.log(`It is Currently ${JSON.stringify(response.data.currently.temperature)}. It feels like ${JSON.stringify(response.data.currently.apparentTemperature)}`);
    }).catch(function(e){
      console.log(e.message);
    })
  }).catch(function(e){
    if(e.code == 'ENOTFOUND')
    {
      console.log('Unable to connet to API servers');
    }
    else
    {
      console.log(e.message);
    }
  })
