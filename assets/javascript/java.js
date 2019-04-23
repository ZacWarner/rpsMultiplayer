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
    var play1Score = 0;
    var play2Score = 0;
    var yourName = prompt("whats your name?")


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
                    yourPlayer2();

                    yourPlayer = 2;
                    $("#controlBoard").empty();
                    var h5 = $("<h5>").addClass("card-title").attr("id", "directionsTitle").html("Good Luck!");
                    var p = $("<p>").addClass("card-text").attr("id", "directionsInfo").html("The game will keep going until someone leaves!");
                    var btn = $("<button>").addClass("btn btn-warning").attr("id", "leaveGame").html("Leave Game?");
                    $("#controlBoard").append(h5, p, btn);
                }
            }

            else {
                database.ref("/players/player1").set(true);
                yourPlayer1();
                yourPlayer = 1;
                $("#controlBoard").empty();
                var h5 = $("<h5>").addClass("card-title").attr("id", "directionsTitle").html("Welcome to my Rock Paper Scissors Game!");
                var p = $("<p>").addClass("card-text").attr("id", "directionsInfo").html("We still need: 1 more players to join!");
                var btn = $("<button>").addClass("btn btn-warning").attr("id", "leaveGame").html("Leave Game?");
                $("#controlBoard").append(h5, p, btn);
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

    //update to show your player!
    function yourPlayer1() {
        $("#player1Board, #player2Board").empty();
        var div = $("<div>").addClass("m-4 text-center");
        var p = $("<p>").html("Your player one!");
        var p2 = $("<p>").html("waiting on one more person to join!");
        div.append(p, p2);

        $("#player1Board").append(div);
    };

    function yourPlayer2() {
        $("#player1Board, #player2Board").empty();
        var div = $("<div>").addClass("m-4 text-center");
        var p = $("<p>").html("Your player Two!");
        var p2 = $("<p>").html("waiting on one more person to join!");
        div.append(p, p2);
        $("#player2Board").append(div);
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

            gameStart();
            console.log(yourPlayer);
            leaveGameBtn(yourPlayer);
        }

        else if (player1Rdy === false && player2Rdy === false) {
            var playerNumNeeded = 2;
            playGameBtn(playerNumNeeded);
        }

        else {
            var playerNumNeeded = 1;
            playGameBtn(playerNumNeeded);
        }

    });

    //gamestart countdown
    function gameStart() {
        $("#playBoard").empty();
        var time = 6;
        play1Score = 0;
        play2Score = 0;
        console.log("start")
        console.log(time)
        var intervalId = setInterval(function () {
            $("#playBoard").empty();
            time--;
            var h2 = $("<h2>").addClass("text-center text-danger").html(time);
            $("#playBoard").append(h2);

            if (time === 0) {
                clearInterval(intervalId);
                database.ref("/choices/player1pick").set(false);
                database.ref("/choices/player2pick").set(false);

                playerChoices(yourPlayer);

                var h2 = $("<h2>").addClass("text-center text-danger").html("Time to choose!");
                $("#playBoard").append(h2);

            };

        }, 1000);
    };

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
                play1Score++;
                showWinner(result, player1pick, player2pick);
            }

            else {

                var result = "p2Wins";
                play2Score++;
                showWinner(result, player1pick, player2pick);
            }

            database.ref("/choices/player1pick").set(false);
            database.ref("/choices/player2pick").set(false);

            setTimeout(function () {
                playerChoices(yourPlayer);
            }, 1000 * 5);


        });

    };

    //creates join game button on start
    function playGameBtn(numPlayers) {
        $("#controlBoard").empty();
        var h5 = $("<h5>").addClass("card-title").attr("id", "directionsTitle").html("Welcome to my Rock Paper Scissors Game!");
        var p = $("<p>").addClass("card-text").attr("id", "directionsInfo").html("We still need: " + numPlayers + " more players to join!");

        if (yourPlayer === 0) {
            var btn = $("<button>").addClass("btn btn-primary").attr("id", "playGame").html("Click to play!");
            $("#controlBoard").append(h5, p, btn);

        }
        else if (yourPlayer === 1 || yourPlayer === 2) {

            var btn = $("<button>").addClass("btn btn-warning").attr("id", "leaveGame").html("Leave Game?");
            $("#controlBoard").append(h5, p, btn);
        }
        else {
            $("#controlBoard").append(h5, p);
        }
    };

    //creates a leave game button
    function leaveGameBtn(yourPlayer) {
        $("#controlBoard").empty();
        var h5 = $("<h5>").addClass("card-title").attr("id", "directionsTitle").html("Good Luck!");
        var p = $("<p>").addClass("card-text").attr("id", "directionsInfo").html("The game will keep going until someone leaves!");

        if (yourPlayer === 1 || yourPlayer === 2) {
            var btn = $("<button>").addClass("btn btn-warning").attr("id", "leaveGame").html("Leave Game?");
            $("#controlBoard").append(h5, p, btn);

        }
        else {

            $("#controlBoard").append(h5, p);
        };
    };

    //click function for leave Game Button
    $(document).on("click", "#leaveGame", function () {
        console.log(yourPlayer);
        if (yourPlayer === 1) {
            database.ref("/players/player1").set(false);
            $("#controlBoard").empty();
            $("#player1Board").empty();
            yourPlayer = 0;

        }

        else if (yourPlayer === 2) {
            database.ref("/players/player2").set(false);
            $("#controlBoard").empty();
            $("#player2Board").empty();
            yourPlayer = 0;
        }
    });

    //function to update playboard with winner
    function showWinner(result, player1pick, player2pick) {
        $("#playBoard").empty();
        if (result === "tie") {
            var div = $("<div>").addClass("my-4 text-center");
            var p = $("<p>").html("Tie! You both picked " + player1pick);
            var h5 = $("<h5>").html("Player 1: <small class='text-success font-weight-bolder'>" + play1Score + "</small> Player 2: <small class='text-success font-weight-bolder'>" + play2Score + "</small>");
            div.append(p, h5);
            $("#playBoard").append(div);
        }

        else if (result === "p1Wins") {
            var div = $("<div>").addClass("my-4 text-center");
            var p = $("<p>").html("Player ones " + player1pick + " beats player two's " + player2pick + "!!!");
            var h5 = $("<h5>").html("Player 1: <small class='text-success font-weight-bolder'>" + play1Score + "</small> Player 2: <small class='text-success font-weight-bolder'>" + play2Score + "</small>");
            div.append(p, h5);
            $("#playBoard").append(div);
        }

        else if (result === "p2Wins") {

            var div = $("<div>").addClass("my-4 text-center");
            var p = $("<p>").html("Player two's " + player2pick + " beats player one's " + player1pick + "!!!");
            var h5 = $("<h5>").html("Player 1: <small class='text-success font-weight-bolder'>" + play1Score + "</small> Player 2: <small class='text-success font-weight-bolder'>" + play2Score + "</small>");
            div.append(p, h5);
            $("#playBoard").append(div);
        };

    }

    //chat box
    var chatBoxRef = database.ref("/chatBox");

    $(document).on("click", "#button-addon2", function () {
        var yourChat = $("#chatBoxInput").val().trim();
        var userName = yourName;

        chatBoxRef.push({
            name: userName,
            chat: yourChat,
        });

        $("#chatBoxInput").val("")

    });

    $(document).on("click", "#chatClear", function () {
        $("#chatBox").empty();
    });

    chatBoxRef.on("child_added", function (childSnapshot) {
        var userName = childSnapshot.val().name;
        var chat = childSnapshot.val().chat;
        var p = $("<p>").html("<mark>" + userName + ":</mark> " + chat);
        $("#chatBox").append(p);

    });

});