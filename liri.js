require("dotenv").config();
var axios = require("axios");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var moment = require('moment');


        
            
            
// Takes in all of the command line arguments
var nodeArgs = process.argv;

WhatToDo(nodeArgs);

function WhatToDo(nodeArgs) {

    var firstArg = nodeArgs[2];

    if (firstArg == "movie-this") {

        var movieName = "";

        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {
                movieName = movieName + "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];

            }
        }

        movieDetails(movieName);

    }

    else if (firstArg == "concert-this") {

        var artistorband = nodeArgs[3];
        eventDetails(artistorband);

    }

    else if (firstArg == "spotify-this-song") {

        var songName = "The Sign";
        var itemNum = 9;
        if (nodeArgs[3]) {
            songName = nodeArgs[3];
            itemNum = 0;
        }

        songDetails(songName, itemNum);

    }

    else if (firstArg == "do-what-it-says") {

        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
            dataArr = ["Placeholder", "Placeholder"].concat(dataArr);

            WhatToDo(dataArr);


        });



    }

}

function movieDetails(movieName) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);

            for (i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source == "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[i].Value);  //JSON.stringify(response.data.Ratings)
                }
            }

            console.log("Country(s) of Production: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    );

}

function eventDetails(artistorband) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + artistorband + "/events?app_id=" + keys.artist.api_key + "&date=upcoming";

    axios.get(queryUrl).then(
        function (response) {
            //console.log(response.data);
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Date Of Event: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
        }
    );

}

function songDetails(songName, itemNum) {

    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            /*for (i = 0; i < response.tracks.items.length; i++) {
                console.log(response.tracks.items[i].artists[0].name);
                console.log(i+" \n");
            }*/

            console.log("Artist(s): " + response.tracks.items[itemNum].artists[0].name);
            console.log("Song Name: " + response.tracks.items[itemNum].name);
            console.log("Preview URL: " + response.tracks.items[itemNum].preview_url);
            console.log("Album Name: " + response.tracks.items[itemNum].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });

}