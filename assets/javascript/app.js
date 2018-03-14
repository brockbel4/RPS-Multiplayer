
// Initialize Firebase
var config = {
    apiKey: "AIzaSyB7K3ly6fuvQnhV-2xxTEyYfpWtmOFDE_0",
    authDomain: "rps-69662.firebaseapp.com",
    databaseURL: "https://rps-69662.firebaseio.com",
    projectId: "rps-69662",
    storageBucket: "rps-69662.appspot.com",
    messagingSenderId: "569260151946"
};
firebase.initializeApp(config);
//Declaring variables
var userOneRef = firebase.database().ref("current/playerOne");
var userTwoRef = firebase.database().ref("current/playerTwo");
var userArrRef = firebase.database().ref("players");
var data = firebase.database();
var userOne, userTwo, currentUser;

//This function will detect the click and report the choice
$(document).ready(function () {
    $(".choices").on("click", function choice(e) {
        choiceOne = $(this).text();
        console.log(choiceOne);
    });
    data.ref("current").once("value").then(function (snapshot) {
        userOne = snapshot.child("playerOne/user").val();
        userTwo = snapshot.child("playerTwo/user").val();
        if (userOne) {
            $("#userOneName").val(userOne).prop("disabled", true);
        }
        if (userTwo) {
            $("#userTwoName").val(userTwo).prop("disabled", true);
        }
    });
    userOneRef.on("value", function (snapshot) {
        userOne = snapshot.child("user").val();
        if (userOne) {
            $("#userOneName").val(userOne).prop("disabled", true);
        } else {
            $("#userOneName").val("").prop("disabled", false);
        }
    });
    userTwoRef.on("value", function (snapshot) {
        userTwo = snapshot.child("user").val();
        if (userTwo) {
            $("#userTwoName").val(userTwo).prop("disabled", true);
        } else {
            $("#userTwoName").val("").prop("disabled", false);
        }
    });
    $("#userOneForm").submit(function (e) {
        e.preventDefault();
        // get the value and store to the right variable
        userOne = $(this).children("input[type='text']").val().trim();
        userArrRef.child(userOne).once("value").then(function (snapshot) {
            if (!snapshot.child(userOne).val()) {
                userArrRef.child(userOne).set({
                    wins: 0,
                    losses: 0
                });
            }
        });

        userOneRef.set({
            user: userOne
        });
        $("#userOneName").val(userOne).prop("disabled", true);
        $("#userTwoName").prop("disabled", true);
        // push to database

        // remove option from local machine
        currentUser = "playerOne";
        data.ref("current/playerOne").onDisconnect().set({
            choice: "",
            user: ""
        });
    });

    $("#userTwoForm").submit(function (e) {
        e.preventDefault();
        // get the value and store to the right variable
        userTwo = $(this).children("input[type='text']").val().trim();
        userArrRef.child(userTwo).once("value").then(function (snapshot) {
            if (!snapshot.child(userTwo).val()) {
                userArrRef.child(userTwo).set({
                    wins: 0,
                    losses: 0
                });
            }
        });

        userTwoRef.set({
            user: userTwo
        });
        $("#userTwoName").val(userTwo).prop("disabled", true);
        $("#userOneName").prop("disabled", true);
        // push to database

        // remove option from local machine
        currentUser = "playerTwo";
        data.ref("current/playerTwo").onDisconnect().set({
            choice: "",
            user: ""
        });
    });
    // runs the game
    function updateGameBoard() {
        
    }

});



// Two user objects user one and two

// once one player is connected make that input un editable for both players

// Inside of each user you will need , "name" "wins" "losses" "choice"

// Connected flag/Waiting for another player