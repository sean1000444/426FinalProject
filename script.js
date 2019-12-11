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
        "<p>" + jwt + "</p>"
    );
}

function goToSearchResultsPage(event) {
    $("#root").empty().append(
        "Search Results Page (Maybe have this pop up so we don't lose the search) <br>" +
        "<button id=\"back-to-home-button\">Back to Home Page</button><br>" +
        "<a href=\"resultPage.html\">Result Page 1 Link</a><br>" +
        "<a href=\"resultPage.html\">Result Page 2 Link</a><br>" +
        "<a href=\"resultPage.html\">Result Page 3 Link</a><br>"
    );
}

function goToAccountInfoPage() {
    $("#root").empty().append(
        "Account Info Page<br>" +
        "<p>Current User: " + first + " " + last + "<\p>" +
        "<button id=\"back-to-home-button\">Back to Home Page</button><br>"
    );
}

function goToHomePage() {
    $("#root").empty().append(
        "Home Page <br>" +
        "<form>" +
        "<input id=\"search-bar\" type=\"text\" placeholder=\"Search\"> <br>" +
        "</form>" +
        "<button id=\"search-button\">Submit</button> <br>" +
        "<form>" +
        "<input id=nameInput type=\"text\" placeholder=\"Name\">" +
        "<input id=ratingInput type=\"text\" placeholder=\"Rating\">" +
        "</form>" +
        "<button id=\"submit-rating-button\">Submit</button> <br>" +
        "<button id=\"account-info-button\">Account Info</button> <br>" +
        "<button id=\"logout-button\">Logout</button> <br>"
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
    console.log(result)
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

function submitSearch(event) {
    // Get info and use it to augment the following function
    goToSearchResultsPage();
}

async function submitRating(event) {
    // Get the info from the event
    movieName = ""
    movieRating = ""
    // Update user's info
    const userResult = await axios ({
        method: 'post',
        url: 'http://localhost:3000/user/movies/movieName', 
        data: {
            rating: movieRating,
        },
        headers: { Authorization: `Bearer ${jwt}` }
    })
    console.log(userResult);
    
    // Update private's info
    const privateResult = await axios ({
        method: 'post',
        url: 'http://localhost:3000/private/movies/movieName/ratings', 
        data: [movieRating],
        type: "merge",
        headers: { Authorization: `Bearer ${jwt}` }
    })
    console.log(privateResult);
}

function submitSearch(event) {
    // Get info and use it to augment the following function
    goToSearchResultsPage();
}

function logout(event) {
    jwt = "Logged Out";
    goToLoginPage();
}


// ORIGINAL PAGE LOAD
$(function () {
    const $root = $('#root');
    jwt = "";
    first = "";
    last = "";

    // Login page
    $root.on("click", "#submit-login-info", submitLoginInfo);
    $root.on("click", "#create-new-account", goToCreateNewAccountPage);

    //New account page
    $root.on("click", "#submit-new-account-info", submitNewAccountInfo);
    $root.on("click", "#back-to-login-page", goToLoginPage);

    // Home page
    $root.on("click", "#search-button", submitSearch);
    $root.on("click", "#submit-rating-button", submitRating);
    $root.on("click", "#account-info-button", goToAccountInfoPage);
    $root.on("click", "#logout-button", logout);

    // Account Info and Search Results pages
    $root.on("click", "#back-to-home-button", goToHomePage);

    // Search Results page
    //     Deal with however I'm going to do these results

}) 