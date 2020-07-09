'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');

const PORT = process.env.PORT || 8000;
let url = require('url');



const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?

  let flight_to_return;


  for (let flightObject of Object.entries(flights)) {
    if (flightObject[0] === flightNumber)

    {
      console.log("found flight");

    console.log(flightObject[0])
    console.log(flightObject[1])
    flight_to_return = flightObject;

    }
  }




  // console.log(flight_to_return);
  // console.log(flightObject);
  res.status(200).send({flight_to_return:flight_to_return});

  //console.log('REAL FLIGHT: ', allFlights.includes(flightNumber));
};

const renderSeatSelect = (req, res) => 
{
  let url1 = getFormattedUrl(req);
  console.log(url1+"/dave");
  //http://localhost:8000/flights/SA123
  const allFlights = Object.keys(flights);

  let allflightsWithLinks = allFlights.map(element => {
  return {flight:element, link:url1+"/flights/"+element}
  }  
  );

  
  
  console.log(allflightsWithLinks);
    res.status(200).render('pages/seat-select', {flights:allflightsWithLinks});
}

const returnAllFlights = (req, res) => 
{
  const allFlights = Object.keys(flights);

    res.status(200).send({allFlights:allFlights});
}



function getFormattedUrl(req) {
  return url.format({
      protocol: req.protocol,
      host: req.get('host')
  });
}

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/flights/:flightNumber', handleFlight)
  .get('/seat-select', renderSeatSelect)
  .get('/all-flights', returnAllFlights)

  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
