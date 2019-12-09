// UTILITY FUNCTIONS

// Page Loads
function goToAccountInfoPage(event){
    alert(currentUser);
    $("#root").empty().append(
        "Account Info Page<br>" +
        "<button id=\"back-to-home-button\">Back to Home Page</button><br>"
    );
}

function goToLoginPage(event){
    $("#root").empty().append(
        "Login Page <br>" +
        "<div class=\"login-container\">" +
            "<input id=\"username-field\" placeholder=\"Username\" name=\"username\"> <br>" +
            "<input id=\"password-field\" placeholder=\"Password\" name=\"password\"> <br>" +
            "<button id=\"submit-login-info\">Submit</button>" +
        "</div>" +
        "<button id=\"create-new-account\">Create New Account</button>"
    );
}

function goToSearchResultsPage(event){
    $("#root").empty().append(
        "Search Results Page (Maybe have this pop up so we don't lose the search) <br>" +
        "<button id=\"back-to-home-button\">Back to Home Page</button><br>" +
        "<a href=\"resultPage.html\">Result Page 1 Link</a><br>" +
        "<a href=\"resultPage.html\">Result Page 2 Link</a><br>" +
        "<a href=\"resultPage.html\">Result Page 3 Link</a><br>"
    );
}

function goToHomePage(event){
    $("#root").empty().append(
        "Home Page <br>" +
        "<form>" +
            "<input type=\"text\" placeholder=\"Search\"> <br>" +
        "</form>" +
        "<button id=\"search-button\">Submit</button> <br>" +
        "<button id=\"account-info-button\">Account Info</button> <br>" +
        "<button id=\"logout-button\">Logout</button> <br>"
    );
}

function goToCreateNewAccountPage(event){
    $("#root").empty().append(
        "New Account Page<br>" + 
        "<form>" + 
            "<input type=\"text\" placeholder=\"Name\"><br>" + 
            "<input type=\"text\" placeholder=\"Email\"><br>" + 
            "<input type=\"text\" placeholder=\"Password\"><br>" + 
            "<select name=\"Grade\">" + 
                "<option value=\"2\">2</option>" + 
                "<option value=\"3\">3</option>" + 
                "<option value=\"4\">4</option>" + 
                "<option value=\"5\">5</option>" + 
                "<option value=\"6\">6</option>" + 
                "<option value=\"7\">7</option>" + 
                "<option value=\"8\">8</option>" + 
                "<option value=\"9\">9</option>" + 
            "</select><br>" + 
            "<select name=\"Subject\">" + 
                "<option value=\"math\">Math</option>" + 
                "<option value=\"science\">Science</option>" + 
            "</select><br>" + 
        "</form>" + 
        "<button id=\"submit-new-account-info\" type=\"submit\">Create New Account</button> <br>" + 
        "<button id=\"back-to-login-page\" type=\"submit\">Go Back to Login Page</button>"
    );
}

function submitLoginInfo(event){
    // Get the pieces of info (will have to use submit with the Create New Account, so figure that out, then implement the info grab)
    // Check against DB to see if these are correct
        // If so
            // Set new current user
            currentUser = "Sean";
            // Transfer to new page
            goToHomePage();
        // If not alert and keep on the same page
            // alert("Incorrect username or password");
}

function submitNewAccountInfo(event){
    // Save the information to the DB
    // Set new current user
    goToHomePage();
}

function submitSearch(event){
    // Get info and use it to augment the following function
    goToSearchResultsPage();
}
function logout(event){
    currentUser = "";
    goToLoginPage();
}


// ORIGINAL PAGE LOAD
$(function() {
    const $root = $('#root');
    currentUser = "";

    // Login page
    $root.on("click", "#submit-login-info", submitLoginInfo);
    $root.on("click", "#create-new-account", goToCreateNewAccountPage);

    //New account page
    $root.on("click", "#submit-new-account-info", submitNewAccountInfo);
    $root.on("click", "#back-to-login-page", goToLoginPage);
    
    // Home page
    $root.on("click", "#search-button", submitSearch);
    $root.on("click", "#account-info-button", goToAccountInfoPage);
    $root.on("click", "#logout-button", logout);
    
    // Account Info and Search Results pages
    $root.on("click", "#back-to-home-button", goToHomePage);

    // Search Results page
    //     Deal with however I'm going to do these results
    
}) 