
// Can qe use this for when entering the location?
// https://developers.google.com/maps/documentation/javascript/places-autocomplete
// for UI items?
// https://materializecss.com/collections.html#!
// https://firebase.googleblog.com/2016/01/keeping-our-promises-and-callbacks_76.html

// https://blog.cloud66.com/an-overview-of-es6-modules-in-javascript/
// https://www.kaplankomputing.com/blog/tutorials/javascript/understanding-imports-exports-es6/

import {
    url,
    GetUserInfoFromFirebase,
    GetUserInfoFromFirebasePromise,
    StoreNewActivityItemIntoFirebase,
    ReadAllPossibleActivitiesForUser,
    ReadAllAssignedActivitiesForUser,
    GetAllAssignedActivityInfo
} from "./database.js"; // import the file

//import { PopulateProfileUserInfo } from "./user.js"; // import the file
import { PopulateSummaryTable, addRowToSummaryTable } from "./profile.js"; // import the file
import { PopulateFullActivityListOnPagePromise } from "./calendar.js"; // import the file
export { database, DeterminePresentHTMLPage }; // So that other javascript files can use the reference
//console.log("url: " + url);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA3n9ua8KMzYs6ERJsshgfjYfP-3rye0bA",
    authDomain: "trippal-75742.firebaseapp.com",
    databaseURL: "https://trippal-75742.firebaseio.com",
    projectId: "trippal-75742",
    storageBucket: "trippal-75742.appspot.com",
    messagingSenderId: "902599624066"
};
firebase.initializeApp(config);

console.log('it begins...');
var database = firebase.database();
var localUser = null;
var userRef = null;
var user = null;

// https://firebase.google.com/docs/reference/js/firebase.auth.Auth
var provider = new firebase.auth.GoogleAuthProvider();


$(document).ready(function () {
    console.log("Page loaded");
    //var user = firebase.auth().currentUser;
    //console.log('page loaded: current user is' + user);

});


// Runs anytime the login state changes
// https://stackoverflow.com/questions/40821116/how-to-solve-firebase-onauthstatechanged-firing-2x-initialization-and-resolutio
//The onAuthStateChanged will always trigger on initialization. However, it should not fire again unless there is a change in the current 
//Firebase Id token (sign out or new sign in event). However, keep in mind that firebase Id tokens are refreshed every hour or so, so this 
//will trigger constantly every hour when the token is refreshed. You can add logic in the listener to check if the user has changed and 
//ignore if the same user is still logged in. If you notice any other behavior, please notify the Firebase teams to fix it.


// This same event is run on page load for all of our pages
// the handling of what to do (tables to load, etc.) specific to each page is handled within
firebase.auth().onAuthStateChanged(function (user) {



    if (user) { // If the user is already logged in

        console.log('Start User Authorization State has changed:' + user.email);

        // June 10, 7pm Here is where I need to a a string of promises
        // Check if user is in firebase
        // Add to firebase if not
        // Load user info if they are
        // populate the page with the user's info


        GetUserInfoFromFirebasePromise(database, user)
            .then(function (returneduserObject) {



                // Only update tables specific to the page
                let presentHTMLPage = DeterminePresentHTMLPage();
                if (presentHTMLPage == 'calendar.html') {

                    // get the user's profile info and populate it on the page
                    console.log('Populate User Info on Page');
                    PopulateProfileUserInfo(returneduserObject);

                    console.log('about to call ReadAllPossibleActivitiesForUser');

                    // Rewrote these the proper way after a discussion with Uzair
                    ReadAllPossibleActivitiesForUser(database)
                        .then(PopulateFullActivityListOnPagePromise);

                }
                else if (presentHTMLPage == 'profile.html') {

                    // https://html5hive.org/how-to-chain-javascript-promises/

                    // get the user's profile info and populate it on the page
                    console.log('Populate User Info on Page');
                    PopulateProfileUserInfo(returneduserObject);

                    // Attempted correction at promise chaining after discussion with Uzair
                    console.log('about to read all the assigned date records in a promise chain');
                    ReadAllAssignedActivitiesForUser()     // get the ids of any activities associated with dates for the user
                        .then(GetAllAssignedActivityInfo) // using the keys from the previous function, retrieve the detailed info about each activity
                        .then(PopulateSummaryTable)       // Update the table that summarizes all assigned activities
                        .then(() => {
                            console.log('We should have the summary table updated now');
                        });
                }
                else {
                    console.log('loaded index.html, the main login page');

                    console.log(returneduserObject);

                    // If the user is already logged in, navigate away from this page
                    if (returneduserObject.googleUserID != null) {
                        console.log('user is already logged in. Navigating to another page');
                        redirect('profile.html');
                    }
                }
            });


        console.log('End of User Authorization State has changed:' + user.email);
    }
    else { // No user is logged in
        if (userRef) userRef.off();
        userRef = null;
        //redirect('index.html'); // If the user is logged out, always go to the start page

        //document.getElementById('userLink').innerText = '';
        //document.getElementById('profilepic').src = '';        
    }
});



function PopulateProfileUserInfo(userInfoObject) {

    console.log('user info object: ', userInfoObject);

    document.getElementById('user-header').innerText = userInfoObject.name;

    if (userInfoObject.googlePhotoUrl) {
        document.getElementById('user-image').src = userInfoObject.googlePhotoUrl;
        console.log('now')
    } else {
        document.getElementById('user-image').classList.remove("d-inline");
        document.getElementById('user-image').style.display = 'none';
        console.log('hey')

    }

    // For now, if the Location info is empty, prompt the user to click on their name to set it
    if ((userInfoObject.cityLocation == '') && (userInfoObject.countryLocation == '') || (userInfoObject.cityLocation == undefined) && (userInfoObject.countryLocation == undefined)) {

        document.getElementById('destination-label').innerText = "Click your name!";
        document.getElementById('current-temp-div').innerText = '--';
        initAutocomplete(0, 0)
    }
    else {

        let locationName = userInfoObject.cityLocation + ', ' + userInfoObject.countryLocation;
        document.getElementById('destination-label').innerText = locationName;
        var cityAPI = (userInfoObject.cityLocation);
        var countryAPI = (userInfoObject.countryLocation);

        var getWeather = function (city, country) {
            var APIKEY = '&appid=74adba7da79a4c943ca3b1bec036d74d';
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city},${country}${APIKEY}`;
            $.ajax({
                url: queryURL,
                method: 'Get'
            }).then(function (response) {
                document.getElementById('current-temp-div').innerText = response.main.temp.toFixed();
                var destinationLat = response.coord.lat;
                var destinationLon = response.coord.lon;
                initAutocomplete(destinationLat, destinationLon);
            });
        };
        getWeather(cityAPI, countryAPI); //used this to test that the API call works. We can populate this with the user's location

    }

    //function for gettin the map 
    function initAutocomplete(latitude, longitude) {
        var map = new google.maps.Map(document.getElementById('profile-map'), {
            center: { lat: latitude, lng: longitude },
            zoom: 13,
            mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        var position = { lat: latitude, lng: longitude };

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }





    // Only update tables specific to the page
    let presentHTMLPage = DeterminePresentHTMLPage();
    if (presentHTMLPage == 'profile.html') {
        // Still need to convert the date format to how we want it displayed.
        // Either here or when we get it from the calendar popup originally
        if (((userInfoObject.cityLocation == undefined) || (userInfoObject.countryLocation == undefined)) || ((userInfoObject.cityLocation == '') && (userInfoObject.countryLocation == ''))) {

            // If no location is given yet (happens if you log in using Google and not email)
            document.getElementById('start-date-profile').innerText = 'To be determined!';
            document.getElementById('end-date-profile').innerText = 'To be determined!';
        }
        else {

            document.getElementById('start-date-profile').innerText = userInfoObject.startDate;
            document.getElementById('end-date-profile').innerText = userInfoObject.endDate;
        }
    }

} 

// In some cases, we need to know which page we're on before running certain code
function DeterminePresentHTMLPage() {

    // https://stackoverflow.com/questions/5817505/is-there-any-method-to-get-the-url-without-query-string/5817566
    var url = [location.protocol, '//', location.host, location.pathname].join('');
    var spliturl = url.split('/');
    var result = spliturl[spliturl.length - 1]

    console.log('You are presently looking at the page: ' + result);

    return result;
}

function generateRandomNumber() {
    return new Promise(function (resolve, reject) {
        var randomNumber = Math.floor((Math.random() * 10) + 1)

        if (randomNumber <= 5) {
            resolve(randomNumber)
        } else {
            reject(randomNumber)
        }
    })
}

function getCurrentUser() {
    return new Promise(function (resolve, reject) {
        var randomNumber = Math.floor((Math.random() * 10) + 1)

        var userpage = localStorage.getItem("lastPage");

        if (userpage.length() > 0) {
            resolve(userpage)
        } else {
            reject('No page found')
        }
    })
}

// This function will use an email address/password to log in
// If the user doesn't already exist, they will be added
function emailLoginExistingUser() {

    var userEmail = document.getElementById("email-input-logIn").value;
    var userPass = document.getElementById("password-input-logIn").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error : " + errorMessage);
    });
}

// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
function emailLoginNewuser() {

    var startDate = document.getElementById("start-date-input").value;
    var endDate = document.getElementById("end-date-input").value;
    var countryLocation = document.getElementById("country-input").value;
    var cityLocation = document.getElementById("city-input").value;
    var userName = document.getElementById("name-input").value;
    var userEmail = document.getElementById("email-input").value;
    var userPass = document.getElementById("password-input").value;

    // If no user exists in the Firebase database, we have to add one
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
        .then(function (user) {

            console.log(user);
            // To add the users to the table with 
            var usersRef = database.ref('/users');

            console.log('adding a new user: ' + user.uid); // changed from just uid? June 12
            usersRef.child(user.uid).set({                 // also changed here
                name: userName,
                email: userEmail,
                startDate: startDate,
                endDate: endDate,
                countryLocation: countryLocation,
                cityLocation: cityLocation,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

            console.log(`New user ${userName} added with reference ${user.uid}`);
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log("Error adding new person to database : " + errorMessage);
        });
}


// login via Google. No modal is required, as a built-in popup is used
$('#google-log-in').on('click', function (event) {
    console.log('Google login attempt');
    var addnewuser = null;
    var userinfo = null;

    event.preventDefault();
    firebase.auth().signInWithPopup(provider).then(function (result) {
    })
        .then(function (user) {

            console.log('A');

            userinfo = firebase.auth().currentUser;
            var name, email, photoUrl, uid, emailVerified;

            name = userinfo.displayName;
            email = userinfo.email;
            photoUrl = userinfo.photoURL;
            emailVerified = userinfo.emailVerified;
            uid = userinfo.uid; // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.

            // 3pm June 9: move this to a new then. Need to test that it works
            // addnewuser = DoesUserExistInFirebase(userinfo.uid);
            // if(addnewuser == null) {
            //     addnewuser = true;
            // }

        })


        .then(() => {
            console.log('new .then');
            addnewuser = DoesUserExistInFirebase(userinfo.uid);
            if (addnewuser == null) {
                addnewuser = true;
            }
        })


        .then(function (user) {

            console.log('B');

            console.log(`addnewuser is: ${addnewuser}`);
            if (addnewuser) {
                var userinfo = firebase.auth().currentUser;
                var name, email, photoUrl, uid, emailVerified;

                name = userinfo.displayName;
                email = userinfo.email;
                photoUrl = userinfo.photoURL;
                emailVerified = userinfo.emailVerified;
                uid = userinfo.uid; // The user's ID, unique to the Firebase project. Do NOT use
                // this value to authenticate with your backend server, if
                // you have one. Use User.getToken() instead.


                // Add the new Google user to our Firebase database
                // database.ref('/users').push({
                // name: name,
                // email: email,
                // userid: uid,
                // dateAdded: firebase.database.ServerValue.TIMESTAMP
                // });

                // To add the users to the table with 
                var usersRef = database.ref('/users');

                console.log('adding a new user: ' + uid);
                usersRef.child(uid).set({
                    name: name,
                    email: email,
                    googlePhotoUrl: photoUrl,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                });


                console.log(`New Google user ${name} added with reference ${uid}`);

            }
            else
                console.log('Not adding new user');


        })

        .then(() => {
            // change to the profile page
            console.log('changing to profile.html');
            redirect('profile.html');

        })

        .catch(function (error) {
            console.log(error);
        });
});  


// Based on the user id from the login (shown in the Firebase users page), check to see if they are already in our database
function DoesUserExistInFirebase(uid) {

    console.log(`DoesUserExistInFirebase: ${uid}`);

    var usersRef = database.ref('/users/' + uid);
    usersRef.once("value").then((snapshot) => {
        console.log(snapshot.val());
        snapshot.forEach(function (data) {
            console.log(data.key);
        });

        if (snapshot.numChildren() >= 1) {
            console.log(`User is already in TripPal Database`);
            returnVal = false; // False means don't add a new user; they already exist
        }

    }).then(() => {

        console.log('about to return ' + returnVal);
        return returnVal;
    });
}


// Login via email, for existing users
$('#logIn-submit-button').on('click', function (event) {
    console.log('email login attempt');
    event.preventDefault();
    emailLoginExistingUser(); 
    $('#logInModal').modal('toggle');
});

// Login a new user via email
$('#form-submit-button').on('click', function (event) {
    console.log('email login attempt');
    event.preventDefault();
    emailLoginNewuser();
    $('#myModal').modal('toggle');
});

// We still need to add a logout button
$('#log-out-btn').on('click', function (event) {
    console.log('user logged out');
    $('#profile-modal').modal('toggle');
    event.preventDefault();
    firebase.auth().signOut();
    redirect('index.html');
});

function redirect(url) {
    window.location.href = url;
}


