//Relevant DOM Manipulation //

const stationContainer = document.createElement("ul");
stationContainer.setAttribute("id", "stationContainer");
const pageBody = document.querySelector("body");
pageBody.append(stationContainer);
let stationMarker = document.querySelectorAll("div");

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
    if (station_div.innerHTML.includes("blue")) {
      station_div.style.color = "blue";
    }
    station_div.addEventListener(
      "click",
      event => grabArrivals(event, station),
      {
        // once: true
      }
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
  let stationDiv = document.getElementById(arrivals.ctatt.eta[0].staId);
  let title = stationDiv.firstChild;
  title.addEventListener("click", event => clearDiv(event, stationDiv), {
    once: true
  });

  let arrivalCard = document.createElement("ul");
  arrivalCard.setAttribute("class", "arrivalCard");
  for (arrival of arrivals.ctatt.eta) {
    let arrivalListing = document.createElement("li");
    let currentDate = new Date();
    let currentTime = currentDate.getTime();
    let etaDate = new Date(arrival.arrT);
    let etaTime = etaDate.getTime();
    let arrivalTime = Math.round((etaTime - currentTime) / 1000 / 60);

    arrivalListing.innerHTML = `Destination: ${arrival.destNm} ETA: ${
      arrival.isApp == 1
        ? "Approaching"
        : arrivalTime + " " + "minutes" && arrivalTime < 0
        ? "Delayed"
        : arrivalTime + " " + "minutes"
    }`;

    arrivalCard.append(arrivalListing);
    stationDiv.append(arrivalCard);
  }
  let stationNumber = stationDiv.id;
  let commentContainer = document.createElement("ul");
  fetch("http://localhost:3000/api/v1/comments/")
    .then(resp => resp.json())
    .then(comments =>
      comments.forEach(comment => {
        if (comment.stationNum == stationNumber) {
          let commentLi = document.createElement("li");
          commentLi.innerHTML = comment.content;
          commentContainer.style.border = "thick solid #0000FF";
          commentContainer.append(commentLi);
          arrivalCard.append(commentContainer);
        }
      })
    );
  let commentForm = document.createElement("form");
  let commentInput = document.createElement("input");
  let commentButton = document.createElement("button");
  commentButton.innerHTML = "submit";
  commentInput.placeholder = "What's new at this station?";
  commentForm.append(commentInput, commentButton);
  arrivalCard.append(commentForm);
  commentForm.addEventListener("submit", event =>
    submitComment(event, commentInput, stationNumber)
  );
  // closeButton = document.createElement("button");
  // closeButton.innerHTML = "X";
  // stationDiv.append(closeButton);
}

// function showComments(comments, stationNumber) {
//   comments.forEach(comment => {
//     if (comment.stationNum == stationNumber) {
//       let commentLi = document.createElement("li");
//       commentLi.innerHTML = comment.content;
//
//       arrivalCard.append(commentLi);
//     }
//   });
// }

function clearDiv(event, stationDiv) {
  event.preventDefault();
  stationDiv.removeChild(stationDiv.childNodes[1]);
}
function submitComment(event, commentInput, stationNumber) {
  event.preventDefault();

  fetch("http://localhost:3000/api/v1/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      content: commentInput.value,
      stationNum: stationNumber
    })
  });
  let newComment = document.createElement("li");
  newComment.innerHTML = commentInput.value;
  event.target.parentElement.append(newComment);
  debugger;
  event.target.reset();
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

function filterAll(c) {
  if (c == "all") {
    stationContainer.innerHTML = "";
    fetchData();
  }
}
function filterOrange(c) {
  let orangeLine = [];
  let allStations = Array.from(stationContainer.childNodes);
  debugger;
  let orangeStations = allStations.filter(station =>
    station.innerHTML.includes("orange")
  );
  // allStations.forEach(childNode => {
  //   if (childNode.innerText.includes("orange")) {
  //     orangeLine.push(childNode.id);
  //   }
  // });
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
//
