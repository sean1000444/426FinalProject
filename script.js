// Page Loads
jwt = ""
first = ""
last = ""

async function getAllAuthors() {
    return await pubRoot.get();
}

async function goToLoginPage(event) {
    $("#root").empty().append(
        "Login Page <br>" +
        "<div class=\"login-container\">" +
        "<input id=\"username-field\" placeholder=\"Username\" name=\"username\"> <br>" +
        "<input id=\"password-field\" placeholder=\"Password\" name=\"password\"> <br>" +
        "<button id=\"submit-login-info\">Submit</button>" +
        "</div>" +
        "<button id=\"create-new-account\">Create New Account</button>" +
        "<p>Currently logged in user: " + jwt + "</p>" +
        "<button id=\"available-movies-button\">See Available Movies Sample</button>"
    );
}

//<img src = ${result.Poster} - this is the code to add the image. For some reason, it was covering up the input field.
let ctr;
const renderResultWidget = function (result) {
    // search result widget - needs to contain name of movie, year?, and pic
    let search_result = `<div class = "resultbox" id = "${result.Title}">
    <p class=\"resultTitle\">${result.Title} - ${result.Year}</p>
    <input class=\"rating-input\" type=\"text\" placeholder=\"0 to 5\">
    <button class=\"rating-button\" id = "${ctr}">Submit</button>
    <button class=\"see-average-rating-button\">See Average Rating</button> <br>
    </div>`;
    // console.log(ctr);
    ctr++;
    return search_result;
}

const renderAllResults = function (result) {
    ctr = 0;
    result.forEach(function (element) {
        $('#root').append(renderResultWidget(element));
    })
}

function goToSearchResultsPage(event, results) {
    // results should be a promise. Event included to grab user id?
    $("#root").empty().append(
        '<h2>Search Results</h2>' + 
        '<button id=\"back-to-home-button\">Back to Home Page</button><br>' +
        '<br>'
    );
    results.then(result => {
        renderAllResults(result.data.Search);

        // event handlers for things involving the results.
        $(document).on('click', '.rating-button', submitRating);
    })
}

async function seeAvailableMovies() {
    const availableMoviesResult = await axios ({
        method: 'get',
        url: 'http://localhost:3000/public/movies'
    })

    let availableMovies = availableMoviesResult['data']['result'].slice(0, 11);
    console.log(availableMovies)

    if ($("#root").find("#movieContainer").length == 0) {
        $("#root").append(
            "<div id=\"movieContainer\"></div>"
        )
        availableMovies.forEach(movie => {
            $("#movieContainer").append(
                "<div>" + movie + "</div>"
            )
        });
    }
}

async function goToAccountInfoPage() {
    auth = "Bearer " + jwt
    
    const userRatingsKeys = await axios ({
        method: 'get',
        url: 'http://localhost:3000/user/movies/', 
        headers: { Authorization: auth }
    })
    const userRatings = await axios ({
        method: 'get',
        url: 'http://localhost:3000/user/movies', 
        headers: { Authorization: auth }
    })
    let userRatingsInfo = userRatings['data']['result']
    let userRatingsKeysInfo = userRatingsKeys['data']['result']
    console.log(userRatingsInfo);
    console.log(userRatingsKeys);

    $("#root").empty().append(
        "Account Info Page<br>" +
        "<p>Current User: " + first + " " + last + "<\p>" +
        "<button id=\"back-to-home-button\">Back to Home Page</button><br>"
    );

    $("#root").append(
        "Your ratings: <br>"
    )

    userRatingsKeysInfo.forEach(key => {
        $("#root").append(
            key + ": " + userRatingsInfo[key]['rating'] + "<br>"
        )
    });
}

function goToHomePage() {
    $("#root").empty().append(
        "Home Page <br>" +
        "<button id=\"account-info-button\">Account Info</button> <br>" +
        "<button id=\"logout-button\">Logout</button> <br>" +
        "<input id=\"search-bar\" type=\"text\" placeholder=\"Search\">" +
        "<button id=\"search-button\">Submit</button> <br>"
    );
    var countries = movieData;
    
    var input = document.getElementById("search-bar");
    
    autocomplete({
        input: input,
        fetch: function(text, update) {
            text = text.toLowerCase();
            // you can also use AJAX requests instead of preloaded data
            var suggestions = countries.filter(n => n.label.toLowerCase().startsWith(text))
            update(suggestions);
        },
        onSelect: function(item) {
            input.value = item.label;
        }
    });
}

function goToCreateNewAccountPage(event) {
    $("#root").empty().append(
        "New Account Page<br>" +
        "<form>" +
        "<input id=\"first\" type=\"text\" placeholder=\"First Name\"><br>" +
        "<input id=\"last\" type=\"text\" placeholder=\"Last Name\"><br>" +
        "<input id=\"email\" type=\"text\" placeholder=\"Email\"><br>" +
        "<input id=\"pass\" type=\"text\" placeholder=\"Password\"><br>" +
        "</form>" +
        "<button id=\"submit-new-account-info\" type=\"button\">Create New Account</button> <br>" +
        "<button id=\"back-to-login-page\">Go Back to Login Page</button>"
    );
}

async function submitLoginInfo(event) {
    // Get the pieces of info (will have to use submit with the Create New Account, so figure that out, then implement the info grab)
    // Check against DB to see if these are correct
    username = $("#username-field").val();
    pass = $("#password-field").val();
    const result = await axios ({
        method: 'post',
        url: 'http://localhost:3000/account/login', 
        data: {
            'name': username,
            'pass': pass
        }
    })
    jwt = result["data"]["jwt"]
    first = result["data"]["data"]["first"]
    last = result["data"]["data"]["last"]
    // If so, transfer to new page
    goToHomePage();
}

async function submitNewAccountInfo(event) {
    let first =  $("#first").val();
    let last =  $("#last").val();
    let email =  $("#email").val();
    let pass =  $("#pass").val();
    // Save the information to the DB
    const result = await axios ({
        method: 'post',
        url: 'http://localhost:3000/account/create', 
        data: {
            'name': email,
            'pass': pass,
            'data': {
                first: first,
                last: last
            }
        }
    })
    console.log(result);
    goToLoginPage();
}



async function submitRating(event) {
    let idnum = $(event.target).attr('id');
    // console.log(idnum);
    movieName = $(event.target).closest(".resultbox").attr('id'); // the id associated with each result is the movie name. Can change if need
    console.log(movieName);
    movieRating = parseInt(document.getElementsByClassName('rating-input')[idnum].value);
    console.log(movieRating);
    auth = "Bearer " + jwt

    // Update user's info
    const userResult = await axios ({
        method: 'post',
        url: 'http://localhost:3000/user/movies/' + movieName, 
        data: {
            data: {
                rating: movieRating
            }
        },
        headers: { Authorization: auth }
    })

    // Update private's info
    // First get what is currently there (bc merge isn't working)
    try {
        const privateMovieRatingsReturn = await axios ({
            method: 'get',
            url: 'http://localhost:3000/private/movies/' + movieName + '/ratings', 
            headers: { Authorization: auth }
        })
        privateMovieRatingsArray = privateMovieRatingsReturn['data']['result'];
    } catch (error) {
        console.log("Ignore that last GET error, it was handled")
        privateMovieRatingsArray = []
    }
        
    // Then update the value with the new information
    privateMovieRatingsArray[privateMovieRatingsArray.length] = movieRating;
    const privateResult = await axios ({
        method: 'post',
        url: 'http://localhost:3000/private/movies/' + movieName + '/ratings', 
        data: {
            "data": privateMovieRatingsArray
        },
        headers: { Authorization: auth }
    })
}

async function seeAverageRating(event) {
    movieName = $ ( event.target ).closest(".resultbox").attr('id') // Get the info from the thing being rated
    console.log(movieName)
    auth = "Bearer " + jwt

    // First get what is currently there (bc merge isn't working)
    let averageRating;
    try {
        const privateMovieRatingsReturn = await axios ({
            method: 'get',
            url: 'http://localhost:3000/private/movies/' + movieName + '/ratings', 
            headers: { Authorization: auth }
        })
        privateMovieRatingsArray = privateMovieRatingsReturn['data']['result'];
        averageRating = (privateMovieRatingsArray.reduce((total, num) => total + num) / privateMovieRatingsArray.length).toFixed(2)
    } catch (error) {
        console.log("Ignore that last GET error, it was handled")
        averageRating = "There are no ratings for this movie yet"
    }

    if ($ ( event.target ).parent().find(".avgRating").length == 0) {
        $ ( event.target ).parent().append("<p class=\"avgRating\">Average Rating: " + averageRating + "</p>")
    } else {
        $ ( event.target ).parent().find(".avgRating").empty().append("<p class=\"avgRating\">Average Rating: " + averageRating + "</p>")
    }
}

async function getResults(input) {
    let search_url = "https://movie-database-imdb-alternative.p.rapidapi.com/?page=1&r=json&s=" + input;
    const result = await axios({
        method: 'GET',
        url: search_url,
        async: true, // might not need this.
        crossDomain: true,
        headers: {
            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
		    "x-rapidapi-key": "efefb9429cmsh849d8389675588ap137245jsndaead439332c"
        }
    });
    return result;
    // result is currently wrapped inside a promise.
};

async function submitSearch(event) {
    // Used for deleting items
    // auth = "Bearer " + jwt
    // const result = await axios ({
    //     method: 'delete',
    //     url: 'http://localhost:3000/private/movies/Batman Begins',
    //     data: {
    //         data: {
    //             ratings: "3"
    //         }
    //     },
    //     headers: { Authorization: auth }
    // })

    var input = document.getElementById("search-bar").value;
    let result = getResults(input);
    goToSearchResultsPage(event, result);
}


function logout(event) {
    jwt = "Logged Out";
    first = "";
    last = "";
    goToLoginPage();
}


// ORIGINAL PAGE LOAD
$(function () {
    const $root = $('#root');
    jwt = "";
    first = "";
    last = "";

    goToLoginPage();

    // Login page
    $root.on("click", "#submit-login-info", submitLoginInfo);
    $root.on("click", "#create-new-account", goToCreateNewAccountPage);
    $root.on("click", "#available-movies-button", seeAvailableMovies);

    //New account page
    $root.on("click", "#submit-new-account-info", submitNewAccountInfo);
    $root.on("click", "#back-to-login-page", goToLoginPage);

    // Home page
    $root.on("click", "#search-button", submitSearch);
    $root.on("click", "#submit-rating-button", submitRating);
    $root.on("click", ".see-average-rating-button", seeAverageRating);
    $root.on("click", "#account-info-button", goToAccountInfoPage);
    $root.on("click", "#logout-button", logout);

    // Account Info and Search Results pages
    $root.on("click", "#back-to-home-button", goToHomePage);
})