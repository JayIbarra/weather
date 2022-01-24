// wite a fetch request
// Log the response in the console 

fetch('website')
    .then(function(res) {
        return res.json();
    })
    .then(function(response) {
        console.log(response);
    })

fetch(website)
    .then(response => response.json()
    .then(data => console.log(data));