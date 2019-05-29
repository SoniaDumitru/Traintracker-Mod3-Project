//Relevant DOM Manipulation //
const stationContainer = document.createElement("ul");
const pageBody = document.querySelector("body");
pageBody.append(stationContainer);

//Fetches initial station data and sends it to getUnique //
function fetchData() {
  // fetch('https://cors-anywhere.herokuapp.com/http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=ba92028c4ac34d1c89d827de312bb41d&rt=red&outputType=JSON', {mode: 'cors'})
  fetch(
    "https://cors-anywhere.herokuapp.com/https://data.cityofchicago.org/resource/8pix-ypme.json",
    { mode: "cors" }
  ) //station name and id
    .then(resp => resp.json())
    .then(parsedJson => getUnique(parsedJson));
}

// arrT - arrival time;
// staId - station id
// staNm - station name
// isApp - approaching?
// rt - route
// http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=4ba28f6b2b8843bf9cef1c0fcc05f874&rt=red&outputType=JSON

//Removes duplicate station names and sends to fetchNewData

function getUnique(arr, station_descriptive_name) {
  const unique = arr
    .map(e => e["station_descriptive_name"])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  fetchNewData(unique);
}

function fetchNewData(array) {
  var newData = [];
  for (var i = 0; i < array.length; i++) {
    var station_name = fetchProperty(array[i], "station_descriptive_name");
    var map_id = fetchProperty(array[i], "map_id");

    var tempJSON = {};
    tempJSON.station_descriptive_name = station_name;
    tempJSON.map_id = map_id;

    newData.push(tempJSON);
  }
  renderStations(newData);
}
fetchData();

//Renders list of stations //
function renderStations(newData) {
  for (let station of newData) {
    let station_div = document.createElement("div");
    station_div.class = station;
    station_div.setAttribute("id", station.map_id);
    station_div.innerHTML = station.station_descriptive_name;
    station_div.addEventListener(
      "click",
      event => grabArrivals(event, station),
      { once: true }
    );
    stationContainer.append(station_div);
  }
}

function grabArrivals(event, station) {
  event.preventDefault();
  // event.currentTarget.removeEventListener(event.type, arguments.callee);
  fetch(
    "https://cors-anywhere.herokuapp.com/http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=ba92028c4ac34d1c89d827de312bb41d&max=6&mapid=" +
      station.map_id +
      "&outputType=JSON",
    { mode: "cors" }
  )
    .then(resp => resp.json())
    .then(arrivals => showArrivals(arrivals));
}

function showArrivals(arrivals) {
  let arrivalCard = document.createElement("ul");
  for (arrival of arrivals.ctatt.eta) {
    let arrivalListing = document.createElement("li");
    let currentDate = new Date();
    let currentTime = currentDate.getTime();
    let etaDate = new Date(arrival.arrT);
    let etaTime = etaDate.getTime();
    let arrivalTime = Math.round((etaTime - currentTime) / 1000 / 60);

    arrivalListing.innerText = `Destination: ${
      arrival.destNm
    } ETA: ${arrivalTime} minutes`;
    let stationDiv = document.getElementById(arrival.staId);

    arrivalCard.append(arrivalListing);
    stationDiv.append(arrivalCard);
  }
  let commentForm = document.createElement("form");
  let commentInput = document.createElement("input");
  let commentButton = document.createElement("button");
  commentButton.innerHTML = "submit";
  commentInput.placeholder = "What's new at this station?";
  commentForm.append(commentInput, commentButton);
  arrivalCard.append(commentForm);
  commentForm.addEventListener("submit", event =>
    submitComment(event, station_div)
  );
}

function submitComment(event, station_div) {
  event.preventDefault();
  fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      content: commentInput.value,
      stationNum: station_div.id
    })
  });
}
//lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=ba92028c4ac34d1c89d827de312bb41d&max=6&mapid=40360&outputType=JSON
//Helper function for fetchNewData
function fetchProperty(data, property) {
  for (var key in data) {
    if (key === property) {
      return data[key];
    }
  }
}
// Event Listeners//

// arrT - arrival time;
// staId - station id
// staNm - station name
// isApp - approaching?
// rt - route
// http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=4ba28f6b2b8843bf9cef1c0fcc05f874&rt=red&outputType=JSON
// http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=ba92028c4ac34d1c89d827de312bb41d&rt=red&outputType=JSON
//
