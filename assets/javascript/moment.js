// Initialize Firebase
var config = {
    apiKey: "AIzaSyAbCzY5CA4pcqfXaylkgEaoxGmnUksM8eE",
    authDomain: "trainschedule-5feb6.firebaseapp.com",
    databaseURL: "https://trainschedule-5feb6.firebaseio.com",
    projectId: "trainschedule-5feb6",
    storageBucket: "trainschedule-5feb6.appspot.com",
    messagingSenderId: "20478595893"
  };
  firebase.initializeApp(config);

// create global database var for easier coding
var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grab user input and format the train start in moment js proper format (returned as string)
    var trainName = $("#train-name-input").val().trim();
    var dest = $("#destination-input").val().trim();
    var trainStart = $("#start-input").val().trim();
    var trainRate = $("#rate-input").val().trim();

    // Create local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: dest,
        start: trainStart,
        rate: trainRate,
    };

    // Upload train data to the database
    console.log("train added coming");
    
    database.ref().push(newTrain);
    console.log("train added")

    // Log user input everything to console
    console.log(trainName.name);
    console.log(dest.destination);
    console.log(trainStart.start);
    console.log(trainRate.rate);

    // alert("Train successfully added");

    // Clear all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
    return false;
});

// Create Firebase event for adding trains to the database and a row in the html table when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var dest = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainRate = childSnapshot.val().rate;

    // Employee Info
    console.log(trainName);
    console.log(dest);
    console.log(trainStart);
    console.log(trainRate);

    // make sure time of user input comes before current time for calculations by subtracting a year
    var firstTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // take the difference in time between the current time and the converted time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // take the modulus for next train calculations
    var tRemainder = diffTime % trainRate;
    console.log(tRemainder);

    // find the minutes until next train by subtracting remainder
    var tMinutesTillTrain = trainRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // find the time of the next train by adding the minutes until next to the current time.
    var trainArival = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(trainArival).format("hh:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(dest),
        $("<td>").text(trainRate),
        $("<td>").text(trainArival),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});