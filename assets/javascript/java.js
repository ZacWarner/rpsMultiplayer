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
    var yourPlayer = 0;


    //function to check players
    var connectionsRef = database.ref("/connections");
    console.log(connectionsRef);
    var connectedRef = database.ref(".info/connected");
    console.log(connectedRef);
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });


    connectionsRef.on("value", function (snapshot) {

        $("#watchers").text(snapshot.numChildren());
    });

    //assigns you a player on button click.
    $(document).on("click", "#playGame", function () {
        database.ref("/players").once("value").then(function (playerSnapshot) {
            var isPlayer1 = playerSnapshot.val().player1;
            console.log(isPlayer1);
            var isPlayer2 = playerSnapshot.val().player2;
            console.log(isPlayer2);

            if (isPlayer1 === true) {
                if (isPlayer2 === true) {
                    alert("game is full");
                    yourPlayer = 3;
                }
                else {
                    database.ref("/players/player2").set(true);
                    alert("you are player 2");

                    yourPlayer = 2;
                    playerChoices(yourPlayer);
                }
            }

            else {
                database.ref("/players/player1").set(true);
                alert("you are player1");
                yourPlayer = 1;
            }
        });

    });

    //function to show choices
    function playerChoices(yourPlayer) {
        var div = $("<div>");
        var h5 = $("<h5>").addClass("pb-2 border-bottom").html("Choose wisely");
        var rock = $("<p>").addClass("choice").attr("id", "rock").html("Rock!");
        var paper = $("<p>").addClass("choice").attr("id", "paper").html("Paper!");
        var scissors = $("<p>").addClass("choice").attr("id", "scissors").html("Scissors!");
        div.append(h5, rock, paper, scissors);
        if (yourPlayer === 1) {
            $("#player1Board").append(div);
        }

        else if (yourPlayer === 2) {
            $("#player2Board").append(div);
        }
    };

    //check for 2 players
    database.ref("players").on("value", function (snapshot) {
        var player1Rdy = snapshot.val().player1;
        var player2Rdy = snapshot.val().player2;

        if (player1Rdy === true && player2Rdy === true) {
            playerChoices(yourPlayer);
            alert("game Start");
        }
    });

    //function to calculate winner

    //function to update playboard with winner

    //function to update scores

});