const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');

let flightbuttons = [];
let flights =[]
let current_seats = [];
let current_flight_to_display = [];

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

let selection = '';




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
  // TODO: everything in here!
  fetch('/users', {
    method: 'POST',
    body: JSON.stringify({
      givenName: document.getElementById('givenName').value,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

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