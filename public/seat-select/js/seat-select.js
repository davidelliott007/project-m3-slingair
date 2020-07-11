const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');

let flightbuttons = [];
let flights =[]
let current_seats = [];
let current_flight_to_display = [];
let confirmed_flight_info = [];
let selection = '';

function loadUpFlightButtons()
{
  console.log("loadUpFlightButtons ")
  fetch(`/all-flights`)
  .then((res) => res.json())
  .then((data) => {

    flights = data.allFlights;
    flights.forEach(element =>
      flightbuttons.push(document.getElementById(element))
      );

    
    flightbuttons.forEach(element =>
      {
        element.addEventListener("click", flightClicked)
      });

  });
}

loadUpFlightButtons();

const renderSeats = () => {
  document.querySelector('.form-container').style.display = 'block';
 
  const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement('ol');
    row.classList.add('row');
    row.classList.add('fuselage');
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement('li');

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      let seat_from_array = current_seats.find(element => element.id === seatNumber);

      if (seat_from_array.isAvailable)
{
  seat.innerHTML = seatAvailable;

}
else{
  seat.innerHTML = seatOccupied;

}

      // TODO: render the seat availability based on the data...
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms['seats'].elements['seat'];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove('selected');
        }
      });
      document.getElementById(seat.value).classList.add('selected');
      document.getElementById('seat-number').innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  console.log('toggleFormContent: ', flightNumber);
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
  renderSeats();
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  console.log("hellllo");

  console.log(current_flight_to_display);
  fetch('/postConfirmedFlight', {
    method: 'POST',
    body: JSON.stringify({
      givenName: document.getElementById('givenName').value,
      surname: document.getElementById('surname').value,
      email: document.getElementById('email').value,
      selection: selection,
      flightnumber: current_flight_to_display
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  
  .then((data) => {

  console.log("gto back from DB:")
  console.log(data);
  let email_response = data.confirmed_data.email;
  let givenName_response = data.confirmed_data.givenName;
  let selection_response = data.confirmed_data.selection;
  let surname_response = data.confirmed_data.surname;
  let flightnumber_response =  data.confirmed_data.flightnumber;

    console.log(window.location.host);

    let host_area = "http://"+window.location.host+`/confirmed/${email_response}/${givenName_response}/${selection_response}/${surname_response}/${flightnumber_response}`;


  window.location.assign(host_area);
  // fetch(`/confirmed/${email_response}/${givenName_response}/${selection_response}/${surname_response}/`)
  
})


  // .get('/confirmed/:email/:givename/:selection/:surname', renderConfirmed)
  }


function flightClicked()
{
  // console.log(event);
  //console.log(event.target.id)

  fetch(`/flights/${event.target.id}`)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    current_seats = data.flight_to_return[1];
    current_flight_to_display = data.flight_to_return[0];

     console.log(current_flight_to_display);

     seatsDiv.querySelectorAll('*').forEach(n => n.remove());
    renderSeats();

  });

}

//flightInput.addEventListener('blur', toggleFormContent);


function myFunction()
{
  console.log("hello myfuction");



}