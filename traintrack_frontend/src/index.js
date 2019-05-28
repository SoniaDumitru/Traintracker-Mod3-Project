function fetchData() {
fetch('https://cors-anywhere.herokuapp.com/http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=ba92028c4ac34d1c89d827de312bb41d&rt=red&outputType=JSON', {mode: 'cors'})
.then(resp => resp.json())
.then(parsedJson => console.log(parsedJson))
}
fetchData()
// arrT - arrival time;
// staId - station id
// staNm - station name
// isApp - approaching?
// rt - route
// http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=4ba28f6b2b8843bf9cef1c0fcc05f874&rt=red&outputType=JSON
