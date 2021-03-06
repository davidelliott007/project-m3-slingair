'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let { flights } = require('./test-data/flightSeating');
let confirmed_booking = [];

const { v4: uuidv4 } = require('uuid');const PORT = process.env.PORT || 8000;
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
const renderConfirmedWithUUID = (req, res) => 
{

  // let url1 = getFormattedUrl(req);

  console.log("renderConfirmed");
  // console.log(url1);
   console.log(req.params);

   let found = confirmed_booking.find(element => element.uuid === req.params.uuid);

   console.log(found);
   
   if (found === undefined)
   {
    res.status(404).send('Sorry!  Flight booking cannot be found in our database');
   }
   else
   {
    res.status(200).render('pages/confirmed', {confirmedDetails: found});
   }
  
}

const renderConfirmed = (req, res) => 
{

  // let url1 = getFormattedUrl(req);

  console.log("renderConfirmed");
  // console.log(url1);
  // console.log(req.params);


    res.status(200).render('pages/confirmed', {confirmedDetails: req.params});
}


const postConfirmedFlight = (req, res) => 
{ 
  let new_uuid = uuidv4();
  console.log(new_uuid);

    let confirmed = {
    givenName: req.body.givenName,
    surname: req.body.surname,
    email: req.body.email,
    selection: req.body.selection,
    flightnumber: req.body.flightnumber,
    uuid: new_uuid}



    confirmed_booking.push(confirmed);
  
    console.log("put into confirmed booking DB:");
    console.log(confirmed_booking[confirmed_booking.length -1 ]);

    // res.status(201).send({confirmed_data:confirmed_booking[confirmed_booking.length -1 ]})

    res.status(201).send({confirmed_data:confirmed_booking[confirmed_booking.length -1 ].uuid})


    //.render('pages/confirmed');
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
  .get('/confirmed/:uuid',renderConfirmedWithUUID)
  .post('/postConfirmedFlight', postConfirmedFlight)

  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
  
  // .get('/confirmed/:email/:givename/:selection/:surname/:flightnumber',renderConfirmed)
