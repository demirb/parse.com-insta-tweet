var _ = require('underscore');

module.exports = {
    startBackgroundJob: function (request, status) {
        startBackgroundJob(request, status);
    }
};

function getTweetsFromLocation(urlLink) {
    var tweetPromise = new Parse.Promise();

    var oauth = require('cloud/libs/oauth.js');
    var sha = require('cloud/libs/sha1.js'); 

    // Source: https://github.com/sreejithbnaick/Twitter-OAuth-1.1-Signature-Generator-js

    var consumerSecret = "enteryourstringhere"; // TODO Add your own
    var tokenSecret = "enteryourstringhere";  // TODO Add your own
    var oauth_consumer_key = "enteryourstringhere";   // TODO Add your own
    var oauth_token = "enteryourstringhere"; // TODO Add your own

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };

    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
        "method": "GET",
        "action": urlLink,
        "parameters": params
    };

    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    // console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    // console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    // console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    // console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
        method: 'GET',
        url: urlLink,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": 'OAuth oauth_consumer_key="' + oauth_consumer_key + '", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="' + oauth_token + '", oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            var promises = [];
            var tweets = JSON.parse(httpResponse.text);

            _.each(tweets.statuses, function(tweet) {
                var tweetId = tweet.id_str;
                var createdAt = new Date(tweet.created_at);
                var tweetText = tweet.text;
                var retweetCount = tweet.retweet_count;
                var favoriteCount = tweet.favorite_count;
                var name = tweet.user.name;
                var screenName = tweet.user.screen_name;
                var profilePicture = tweet.user.profile_image_url;
                var isReply = tweet.in_reply_to_status_id;
                var isMentioned = tweet.entities.user_mentions.length;
                var isRT = tweet.retweeted_status;

                function doSomethingWithTweet() {
                    var promise = new Parse.Promise();
                    // I am doing something with the twitter content
                    promise.resolve();
                    return promise;
                }
                
                promises.push(doSomethingWithTweet());

            });

            Parse.Promise.when(promises).then(function() {
                tweetPromise.resolve();
            }, function(error) {
                tweetPromise.reject();
            });
        },
        error: function(httpResponse) {
            response.error('Request failed with response ' + httpResponse.status + ' , ' + JSON.stringify(httpResponse));
            tweetPromise.reject();
        }
    });
    return tweetPromise;
}

function getTweetsFrom(screen_name, count) {
    var oauth = require('cloud/libs/oauth.js');
    var sha = require('cloud/libs/sha1.js'); 

    var tweetPromise = new Parse.Promise();

    var urlLink = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+screen_name+'&count='+count;

    var consumerSecret = "enteryourstringhere"; // TODO Add your own
    var tokenSecret = "enteryourstringhere";  // TODO Add your own
    var oauth_consumer_key = "enteryourstringhere";   // TODO Add your own
    var oauth_token = "enteryourstringhere"; // TODO Add your own

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };

    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
        "method": "GET",
        "action": urlLink,
        "parameters": params
    };

    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    // console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    // console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    // console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    // console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
        method: 'GET',
        url: urlLink,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": 'OAuth oauth_consumer_key="' + oauth_consumer_key + '", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="' + oauth_token + '", oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            var promises = [];
            var tweets = JSON.parse(httpResponse.text);
            var userId = '';

            if (screen_name === "elonmusk") { //TODO change the screen name to your tweet screen name
                userId = "UoJtTrEdty";  //TODO change the id
            } else if (screen_name === "boredelonmusk") { //TODO change the screen name to your tweet screen name
                userId = "fOYCZdAtno";   //TODO change the id            
            }

            _.each(tweets, function(tweet) {
                var retweetCount = tweet.retweet_count;
                var favoriteCount = tweet.favorite_count;
                var createdAt = new Date(tweet.created_at);
                var tweetId = tweet.id_str;
                var tweetText = tweet.text;
                var name = tweet.user.name;
                var screenName = tweet.user.screen_name;
                var profilePicture = tweet.user.profile_image_url;
                var isReply = tweet.in_reply_to_status_id;
                var cardText = tweetText.trim();

                function doSomethingWithThisTweet() {
                    var promise = new Parse.Promise();
                    // I am doing something with the twitter content
                    promise.resolve();
                    return promise;
                }
                
                promises.push(doSomethingWithThisTweet());
            });

            Parse.Promise.when(promises).then(function() {
                tweetPromise.resolve();
            }, function(error) {
                tweetPromise.reject();
            });
        },
        error: function(httpResponse) {
            console.log('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
            tweetPromise.reject();
        }
    });

    return tweetPromise;
}


function getInstagramPostsFromLocation(locationId) {
    var promise = new Parse.Promise();

    var instaModule = require('cloud/libs/instagram-v1-1.0.js');
    instaModule.initialize('7bc0d3fdghbk74dsatın90edbb4cd9de'); // TODO Change
    instaModule.setAccessToken('217473186.7bc0d3f.4c6c208612554a2487b46b5212233879'); // TODO Change

    instaModule.getRecentMediaByLocation(locationId, {
        count: '15',
    }).then(function(httpResponse) {
        var promises = [];

        var data = httpResponse.data.data;

        var ts = Math.floor( (new Date().getTime() - (24 * 60 * 60 * 1000)) / 1000) ;
        var timestamp = ts.toString();

        _.each(data, function(post) {
            var type = post.type;
            var createdAt = post.created_time;
            var location = post.location.name;
            var commentCount = post.comments.count;
            var likeCount = post.likes.count;
            var instaId = post.id;
               
            function doSomethingWithThisInstagram() {
                var promise = new Parse.Promise();
                // I am doing something with the Instagram content
                promise.resolve();
                return promise;
            }
            
            promises.push(doSomethingWithThisInstagram());

        });

        if (promises.length == 0) {
            promise.resolve();
        } else {
            Parse.Promise.when(promises).then(function() {
                promise.resolve();
            }, function(err) {
                promise.reject();
            });
        }

    }, function(error) {
        promise.reject();
    });

    return promise;
}

function startBackgroundJob(request, status) {
    var promises = [];

    var instagramLocations = [r
        "612117313", // Stanford, Computer Science
        "43275355", // Caltech, Computer Science
        "467863457", // Tokyo uni, Computer Science
        "3457633" // Harvard, Computer Science
    ];

    var urlLink = 'https://api.twitter.com/1.1/search/tweets.json?q=%3F&geocode=39.891838,32.783348,1.8km&count=100';

    // Get from twitter
    promises.push(getTweetsFrom('elonmusk', 15));
    promises.push(getTweetsFrom('boredelonmusk', 15));
    promises.push(getTweetsFromLocation(urlLink));

    // Get from instagram
    _.each(instagramLocations, function(locationId) {
        promises.push(getInstagramPostsFromLocation(locationId));
    });

    Parse.Promise.when(promises).then(function() {
        status.success("Backgroundjob completed");
    }, function(error) {
        status.success("Backgroundjob error occured ");
    });
}
