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

    //function for choice
    $(document).on("click", ".choice", function () {
        var picked = $(this).attr("id");
        database.ref("/choices").once("value").then(function (playerSnapshot) {
            var playerPick = "/player" + yourPlayer + "pick";
            if (yourPlayer === 1) {
                var hasPicked = playerSnapshot.val().player1pick;
            }
            else if (yourPlayer === 2) {
                var hasPicked = playerSnapshot.val().player2pick;
            };

            if (hasPicked === false) {

                var playerChoice = "/player" + yourPlayer + "choice";
                database.ref("/choices" + playerChoice).set(picked);
                database.ref("/choices" + playerPick).set(true);
                waitingOnPlayer(yourPlayer);
            };
        });
    });

    $(document).on("click", "#reset", function () {
        database.ref("/players/player1").set(false);
        database.ref("/players/player2").set(false);
    });

    //function for a waiting screen
    function waitingOnPlayer(yourPlayer) {
        $("#player1Board, #player2Board").empty();
        var div = $("<div>").addClass("m-4 text-center");
        var p = $("<p>").html("waiting for other player to pick!");
        div.append(p);
        if (yourPlayer === 1) {
            $("#player1Board").append(div);
        }

        else if (yourPlayer === 2) {
            $("#player2Board").append(div);
        }
    };

    //function to show choices
    function playerChoices(yourPlayer) {
        $("#player1Board, #player2Board").empty();
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

    //checks for both players picks!
    database.ref("/choices").on("value", function (snapshot) {
        var player1pick = snapshot.val().player1pick;
        var player2pick = snapshot.val().player2pick;

        if (player1pick === true && player2pick === true) {
            var result = whoWon();
        }

    });

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
    function whoWon() {
        database.ref("/choices").once("value").then(function (playerSnapshot) {
            var player1pick = playerSnapshot.val().player1choice;
            var player2pick = playerSnapshot.val().player2choice;

            if (player1pick === player2pick) {
                var result = "tie";
                showWinner(result, player1pick, player2pick);
            }

            else if ((player1pick === "rock" && player2pick === "scissors") ||
                (player1pick === "paper" && player2pick === "rock") ||
                (player1pick === "scissors" && player2pick === "paper")) {
                var result = "p1Wins";
                showWinner(result, player1pick, player2pick);
            }

            else {
                var result = "p2Wins";
                showWinner(result, player1pick, player2pick);
            }

            database.ref("/choices/player1pick").set(false);
            database.ref("/choices/player2pick").set(false);

            setTimeout(function () {
                playerChoices(yourPlayer);
            }, 1000 * 5);


        });

    };

    //function to update playboard with winner
    function showWinner(result, player1pick, player2pick) {
        $("#playBoard").empty();
        if (result === "tie") {
            var div = $("<div>").addClass("my-4 text-center");
            var p = $("<p>").html("Tie! You both picked " + player1pick);
            div.append(p);
            $("#playBoard").append(div);
        }

        else if (result === "p1Wins") {
            var div = $("<div>").addClass("my-4 text-center");
            var p = $("<p>").html("Player ones " + player1pick + " beats player two's " + player2pick + "!!!");
            div.append(p);
            $("#playBoard").append(div);
        }

        else if (result === "p2wins") {
            var div = $("<div>").addClass("my-4 text-center");
            var p = $("<p>").html("Player two's " + player2pick + " beats player one's " + player1pick + "!!!");
            div.append(p);
            $("#playBoard").append(div);
        };

    }

    //function to update scores

});