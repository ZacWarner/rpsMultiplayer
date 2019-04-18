$(document).ready(function () {

    //initialize firbase
    var config = {
        apiKey: "AIzaSyBU_sJLfL5orizZzA_MF8BaWC1ZDg4TQJ4",
        authDomain: "zacsrpsmultiplayer.firebaseapp.com",
        databaseURL: "https://zacsrpsmultiplayer.firebaseio.com",
        projectId: "zacsrpsmultiplayer",
        storageBucket: "zacsrpsmultiplayer.appspot.com",
        messagingSenderId: "947984651565"
    };
    firebase.initializeApp(config);

    //create database variable
    var database = firebase.database();

    //initialize variables



    //function to check players
    var connectionsRef = database.ref("/connections");

    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snapshot) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#watchers").text(snapshot.numChildren());
    });

    //function to show choices

    //function to calculate winner

    //function to update playboard with winner

    //function to update scores

});