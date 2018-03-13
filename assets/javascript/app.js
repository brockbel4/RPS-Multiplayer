//Declaring variables
var wins = 0;
var losses = 0;
var ties = 0;
var playerOne = "";
var playerTwo = "";
var choiceOne = "";
var choiceTwo = "";



//This function will detect the click and report the choice
$(".choices").on("click", function(e){
    choiceOne = $(this).text();
    console.log(choiceOne);
});