// Initialize Firebase
var config = {
    apiKey: "AIzaSyAxtPXNhR6E1OKVhAcUMQ9PgzAIj0OwE_g",
    authDomain: "rockpaperscissors-chaines.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-chaines.firebaseio.com",
    projectId: "rockpaperscissors-chaines",
    storageBucket: "rockpaperscissors-chaines.appspot.com",
    messagingSenderId: "976820851044"
  };
  firebase.initializeApp(config);
//Declaring variables

var data = firebase.database();
var userOneRef = data.ref("current/playerOne");
var userTwoRef = data.ref("current/playerTwo");
var userArrRef = data.ref("players");
var stateRef = data.ref('current/state');
var messagesRef = data.ref('messages');
var userOne, userOneChoice, userOneWins, userOneLosses, userTwo, userTwoChoice, userTwoWins, userTwoLosses, currentUser, state;

// This function will detect the click and report the choice
$(document).ready(function () {

    generateGameBoard();


    // Hide chatbox
    $('#chatbox').hide();

    // Handling Data Changes

    // Player1 name changes:
    userOneRef.child('user').on("value", function (snapshot) {
        userOne = snapshot.val();

        if (userOne) {
            userArrRef.child(userOne).on('value', function(snapshot2) {
                userOneWins = snapshot2.child('wins').val();
                userOneLosses = snapshot2.child('losses').val();
                $('#playerOneWinloss').html('<span class="winloss"> Wins: ' + userOneWins + ' - Losses: ' + userOneLosses + '</span>');
            })
            $("#userOneName").val(userOne).prop("disabled", true);
        } else {
            $("#userOneName").val("")
            if(currentUser) {
                $("#userOneName").prop('disabled', true);
            } else {
                $("#userOneName").prop('disabled', false);
            }
        }
        if(userOne && userTwo) {
            stateRef.set('waitingChoiceBoth');
        } else {
            stateRef.set("waitingPlayers");
        }
    });

    
    // Player2 name changes:
    userTwoRef.child('user').on("value", function (snapshot) {
        userTwo = snapshot.val();

        if (userTwo) {
            userArrRef.child(userTwo).on('value', function(snapshot2) {
                userTwoWins = snapshot2.child('wins').val();
                userTwoLosses = snapshot2.child('losses').val();
                $('#playerTwoWinloss').html('<span class="winloss"> Wins: ' + userTwoWins + ' - Losses: ' + userTwoLosses + '</span>');
            })
            $("#userTwoName").val(userTwo).prop("disabled", true);
        } else {
            $("#userTwoName").val("");
            if(currentUser) {
                $("#userTwoName").prop('disabled', true);
            } else {
                $("#userTwoName").prop('disabled', false);
            }
        }
        if(userOne && userTwo) {
            stateRef.set('waitingChoiceBoth');
        } else {
            stateRef.set("waitingPlayers");
        }
    });

    //Choice changes: 
    userOneRef.child('choice').on('value', function(snapshot) {
        userOneChoice = snapshot.val();
        if(userTwoChoice && userOneChoice) {
            stateRef.set("showingResults");
        } else if(userOneChoice) {
            stateRef.set("waitingChoiceTwo");
        }
    })

    userTwoRef.child('choice').on('value', function(snapshot) {
        userTwoChoice = snapshot.val();
        if(userOneChoice && userTwoChoice) {
            stateRef.set("showingResults");
        } else if(userTwoChoice) {
            stateRef.set("waitingChoiceOne");
        }
    })

    // State Change
    stateRef.on('value', function(snapshot) {
        state = snapshot.val();
        stateChange();
    })

    //Messages change
    messagesRef.on('child_added', function(snapshot) {
        $('#messages').append('<p>' +  snapshot.val() + '</p>');
    })

    $('#chatbox').submit(function(e) {
        e.preventDefault();
        messagesRef.push($('#chatbox input[type="text"]').val());
    })
    $("#userOneForm").submit(function (e) {
        e.preventDefault();
        currentUser = "playerOne";
        // get the value and store to the right variable
        userOne = $(this).children("input[type='text']").val().trim();
        userArrRef.child(userOne).once("value").then(function (snapshot) {
            userArrRef.child(userOne).set({
                wins: 0,
                losses: 0
            });
        });

        userOneRef.set({
            user: userOne
        });
        $("#userOneName").val(userOne).prop("disabled", true);
        $("#userTwoName").prop("disabled", true);
        $('#chatbox').show();
        // push to database

        // remove option from local machine
        data.ref("current/playerOne").onDisconnect().set({
            choice: "",
            user: ""
        });
    });

    $("#userTwoForm").submit(function (e) {
        e.preventDefault();
        currentUser = "playerTwo";
        // get the value and store to the right variable
        userTwo = $(this).children("input[type='text']").val().trim();
        userArrRef.child(userTwo).once("value").then(function (snapshot) {
            userArrRef.child(userTwo).set({
                wins: 0,
                losses: 0
            });
        });

        userTwoRef.set({
            user: userTwo
        });
        $("#userTwoName").val(userTwo).prop("disabled", true);
        $("#userOneName").prop("disabled", true);
        $('#chatbox').show();
        // push to database

        // remove option from local machine
        data.ref("current/playerTwo").onDisconnect().set({
            choice: "",
            user: ""
        });
    });
    // runs the game
    function updateGameBoard() {
        
    }

    function generateGameBoard() {
        console.log(currentUser);
        if(currentUser === "playerOne") {
            $('#playerOneBoard').html('<h2>Player One</h2><ul id="choiceList"><li><a class="choice">Rock</a></li><li><a class="choice">Paper</a></li><li><a class="choice">Scissors</a></li></ul>');
            $("#playerTwoBoard").html('<h2>Player Two</h2>');
        } else if(currentUser === "playerTwo") {
            $('#playerOneBoard').html('<h2>Player One</h2>');
            $('#playerTwoBoard').html('<h2>Player Two</h2><ul id="choiceList"><li><a class="choice">Rock</a></li><li><a class="choice">Paper</a></li><li><a class="choice">Scissors</a></li></ul>');
        }

        $('.choice').click(function(e) {
            console.log($(this).text());
            data.ref('current/' + currentUser + '/choice').set($(this).text());
            $("#choiceList").html($(this).text());
        })
    }

    function stateChange() {
        switch(state) {
            case 'waitingPlayers':
                $('#notification').text("Waiting on players to join");
                break;
            case 'waitingChoiceBoth':
                generateGameBoard();
                $('#notification').text("Waiting on players to make their choices");
                break;
            case 'waitingChoiceOne':
                $('#notification').text('Waiting on ' + userOne + ' to make their choice');
                break;
            case 'waitingChoiceTwo':
                $('#notification').text('Waiting on ' + userTwo + ' to make their choice');
                break;
            case 'showingResults': 
                $('#notification').text("");
                runGame();
                break;
        }
    }

    function runGame() {
        $("#playerOneBoard").html('<h2>Player One</h2>' + userOneChoice);
        $("#playerTwoBoard").html('<h2>Player Two</h2>' + userTwoChoice);
        if(userOneChoice === userTwoChoice) {
            //Is a tie
        } else if( (userOneChoice === "Rock" && userTwoChoice === "Scissors" ) || 
                   (userOneChoice === "Scissors" && userTwoChoice === "Paper" ) || 
                   (userOneChoice === "Paper" && userTwoChoice === "Rock")) {
            // Player 1 wins
            userOneWins += 1;
            userTwoLosses += 1;
            userArrRef.child(userOne + '/wins').set(userOneWins);
            userArrRef.child(userTwo + '/losses').set(userTwoLosses);
        } else {
            // Player 2 wins
            userTwoWins += 1;
            userOneLosses += 1;
            userArrRef.child(userOne + '/losses').set(userTwoWins);
            userArrRef.child(userTwo + '/wins').set(userOneLosses);
        }
        setTimeout(resetGame, 2000);
    }

    function resetGame() {
        userOneRef.child('choice').set('');
        userTwoRef.child('choice').set('');
        stateRef.set('waitingChoiceBoth');
    }
});