function createEditInput(event){
    let element = $ ( event.target );
    element.parent().append("<textarea class=\"new-edit-input\">" +
            element.parent().find(".tweet-body").text() + "</textarea>" +
            "<button class=\"new-edit-save-button\">Submit</button>")
}

async function sendEdit(event){
    let element = $ ( event.target );
    let newEdit = element.siblings(".new-edit-input").val();
    let tweetId = element.parent().find(".id").text()
    const result = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + tweetId,
        withCredentials: true,
        data: {
            "body": newEdit
        },
    });
}

async function deleteTweet(event){
    let element = $ ( event.target );
    let tweetId = element.parent().find(".id").text()
    const result = await axios({
        method: 'delete',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + tweetId,
        withCredentials: true,
      })
}

function createRetweetInput(event){
    let element = $ ( event.target );
    element.parent().append("<textarea class=\"new-retweet-input\">" +
            "Enter your retweet message here...</textarea>" +
            "<button class=\"new-retweet-save-button\">Submit</button>")
}

async function sendRetweet(event){
    let element = $ ( event.target );
    let newReply = element.siblings(".new-retweet-input").val();
    let tweetId = element.parent().find(".id").text()
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": tweetId,
            "body": newReply
        },
    })
}

function createNewReplyInput(event){
    let element = $ ( event.target );
    element.parent().append("<textarea class=\"new-reply-input\">" +
            "Enter your reply here...</textarea>" +
            "<button class=\"new-reply-save-button\">Submit</button>")
}

async function replyToTweet(event){
    let element = $ ( event.target );
    let newReply = element.siblings(".new-reply-input").val();
    let tweetId = element.parent().find(".id").text()
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": tweetId,
          "body": newReply
        },
    })
}

function createNewPostInput(event){
    let element = $ ( event.target );
    element.parent().append("<textarea class=\"new-post-input\">" +
            "Enter your tweet here...</textarea>" +
            "<button class=\"new-post-save-button\">Submit</button>")
}

async function saveNewPost(event) {
    let element = $ ( event.target );
    let newPost = element.siblings(".new-post-input").val();
    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: newPost
        }
    });
}

async function toggleLiked(event){
    let thisTweet = $ ( event.target ).parent();
    let likeSymbol = thisTweet.find(".liked-symbol");
    let likedCount = thisTweet.find(".like-count");
    let currentLikedCount = parseInt(thisTweet.find(".like-count").text());
    let tweetId = thisTweet.find(".id").text()
    if (likeSymbol.hasClass("unliked")) {
        likedCount.text(currentLikedCount + 1);
        const result = await axios({
            method: 'put',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + tweetId + '/like',
            withCredentials: true,
        });
    } else {
        likedCount.text(currentLikedCount - 1);
        const result = await axios({
            method: 'put',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + tweetId + '/unlike',
            withCredentials: true,
        });
    }
    likeSymbol.toggleClass("unliked");
}

async function loadTweets(){
    const $tweetContainer = $('#tweet-container');
    const fiftyTweets = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    // Format the information into the html
    fiftyTweets.data.forEach(tweet => {
        let stringBuilder = "<div class=\"tweet\">" +
            "<h4>" + tweet["author"] + "</h4>" +
            "<p class=\"id unliked\">" + tweet["id"] + "</p>" +
            "<p class=\"tweet-body\">" + tweet["body"] + "</p>" +
            "<p><span class=\"liked-symbol unliked\">&#10004;</span> " +
            "<span>Like Count: <span class=\"like-count\">" + tweet["likeCount"] + "</span> </span>" +
            "<span>Retweet Count: <span class=\"rt-count\">" + tweet["retweetCount"] + "</span> </span></p>" +
            "<button class=\"like-button\">Like Button</button>" + 
            "<button class=\"rt-button\">Retweet Button</button><br>" +
            "<button class=\"reply-button\">Reply Button</button>";
        if(tweet["isMine"]) {
            stringBuilder += "<button class=\"edit-button\">Edit</button>" + 
            "<button class=\"delete-button\">Delete</button>";
        }
        stringBuilder += ("</div>");
        $tweetContainer.append(stringBuilder);
    });
}

// Page load
$(function() {
    // Load and render the tweets
    const $root = $('#root');
    loadTweets();
    $root.on("click", ".like-button", toggleLiked);
    $root.on("click", ".new-post-button", createNewPostInput);
    $root.on("click", ".new-post-save-button", saveNewPost);
    $root.on("click", ".reply-button", createNewReplyInput);
    $root.on("click", ".new-reply-save-button", replyToTweet);
    $root.on("click", ".rt-button", createRetweetInput);
    $root.on("click", ".new-retweet-save-button", sendRetweet);
    $root.on("click", ".delete-button", deleteTweet);
    $root.on("click", ".edit-button", createEditInput);
    $root.on("click", ".new-edit-save-button", sendEdit);
}) 