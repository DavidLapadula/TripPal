
export { 
    GetUserInfoFromFirebasePromise,
    GetUserInfoFromFirebase,
    url,
    StoreNewActivityItemIntoFirebase,
    ReadAllPossibleActivitiesForUser,
    StoreNewActivityItemIntoFirebasePromise,
    StoreActivityReferenceToSpecificDate,
    ReadAllAssignedActivitiesForUser,
    GetActivityInfoByKey,
    GetAllAssignedActivityInfo,
    ReadAssignedActivitiesForUserOnSpecificDate,  // Used to get all activities for a specific date. Should be run when the calendar is clicked
    RemoveSelectedActivityFromDate,
    RemoveSelectedActivity,
    RemoveSelectedActivityFromDateAssignments, 
    UpdateTripDatesLocation
};

import { database } from "./userlogin.js"; // import the file

// https://www.youtube.com/watch?v=s6SH72uAn3Q&t=16s
// http://jsfiddle.net/mkjh2ev5/839/


// This should return an object of the user's information
const GetUserInfoFromFirebasePromise = (database, user) => {

    // Return as a promise, as there are a few steps necessary
    // we need to get the information based on the user's Google id
    return new Promise((resolve, reject) => {

        console.log('inside GetUserInfoFromFirebasePromise');
        var returnVal = null;
        let userObject = {
            googleUserID: user.uid
        }; 

        var usersRef = database.ref('/users/' + user.uid);

        usersRef.once("value").then((snapshot) => {

            if (snapshot.numChildren() >= 1) {
                console.log(`User is already in TripPal Database`);

                //console.log(snapshot.val());
                snapshot.forEach(function (data) {
                    console.log(data.key + ": " + data.val());
                    returnVal = data;
                    userObject[data.key] = data.val();
                })

                return new Promise(function (resolve, reject) {
                    console.log('new promise after looping through user items');
                    resolve(userObject);
                })
            }
            else {
                console.log('user is not in firebase database');
                returnVal = 'faiilure!!!';

                return new Promise(function (resolve, reject) {
                    reject('no user!!!!!!');
                })
            }
        })
            .then(function (returnVal) {

                console.log(`.then: User is already in TripPal Database ${returnVal}`);
                resolve(returnVal);
            })
    });
};

// I think I will need to rewrite this as a promise, with the usersRef.once being a part of the .then
function GetUserInfoFromFirebase(database, user) {
    console.log('GetUserInfoFromFirebase');
    console.log(`DoesUserExistInFirebase: ${user.uid}`);

    var usersRef = database.ref('/users/' + user.uid);
    let returnVal = null;


    usersRef.once("value").then((snapshot) => {
        //console.log(snapshot.val());
        snapshot.forEach(function (data) {
            console.log(data.key + ": " + data.val());
            returnVal = data;
        });

        if (snapshot.numChildren() >= 1) {
            console.log(`User is already in TripPal Database`);
        }

    }).then(() => {

        console.log('about to return ' + returnVal);
        return returnVal;
    });
}

const url = "some constant text goes here";

/*
To do, remove database as a parameter from the various functions, as it is already imported from userlogin.js

*/

// This gets all the possible activities that the user has added from their research
// These items are all displayed in one master table and then the user can assign any of them to a specific date
const ReadAllPossibleActivitiesForUser = (database) => {

    return new Promise((resolve, reject) => {

        var user = firebase.auth().currentUser;
        var usersRef = database.ref('/allresearchitems/' + user.uid);
        var objectOfAllActivities = {};

        usersRef.once("value").then((snapshot) => {

            console.log(snapshot.numChildren() + ' records found');
            snapshot.forEach(function (data) {
                //console.log(data.key + ": " + data.val());
                objectOfAllActivities[data.key] = data.val();
            })

            return new Promise(function (resolve, reject) {
                //console.log('now returning all of the research records');
                resolve(objectOfAllActivities); // resolves to the .then, which returns it
            })
        })
            .then(function (returnVal) {

                console.log('Returning items from ReadAllPossibleActivitiesForUser:');
                //console.log(returnVal);            
                resolve(returnVal);
            })
    });
};


// Store a new item to the "All Things" list
const StoreNewActivityItemIntoFirebase = (database, item) => {

    var user = firebase.auth().currentUser;

    // Add the date/time so we can know when the item was added to the list
    item['addedOn'] = firebase.database.ServerValue.TIMESTAMP
    database.ref('/allresearchitems/' + user.uid).push(item)

};

// Store a new item to the "All Things" list
const StoreNewActivityItemIntoFirebasePromise = (database, item) => {

    return new Promise((resolve, reject) => {

        var user = firebase.auth().currentUser;
        var usersRef = database.ref('/allresearchitems/' + user.uid);

        // Add the date/time so we can know when the item was added to the list
        item['addedOn'] = firebase.database.ServerValue.TIMESTAMP
        database.ref('/allresearchitems/' + user.uid).push(item)
        resolve();
    });
};


// Create a new entry in the table that associated items from the master activity
const StoreActivityReferenceToSpecificDate = (dateVal, activityRef) => {

    /* to do
        Need to be able to check if the entry already exists, and only add it it doesn't already
    */

    console.log('called StoreActivityReferenceToSpecificDate to add new date association');
    return new Promise((resolve, reject) => {

        var newItem = {};
        var user = firebase.auth().currentUser;
        var usersRef = database.ref('/selectedForDay/' + user.uid + '/' + dateVal);

        newItem['activityRef'] = activityRef;
        newItem['addedReferenceOnDate'] = firebase.database.ServerValue.TIMESTAMP; // Probably don't need to know when the reference was added, but keep for now

        // Add the date/time so we can know when the item was added to the list
        database.ref('/selectedForDay/' + user.uid + '/' + dateVal).push(newItem);
        console.log(`The clicked item has now been stored under /selectedForDay/${user.uid}/${dateVal}`);
        resolve();
    });
};

// This function will read all of the activities that have been assigned to dates by the user
// This result of this function can then be used to obtain the activity data from the allresearchitems content
const ReadAllAssignedActivitiesForUser = () => {

    return new Promise((resolve, reject) => {

        console.log('running ReadAssignedActivitiesForUser');

        var user = firebase.auth().currentUser;
        var usersRef = database.ref('/selectedForDay/' + user.uid);
        var objectOfAllActivities = {};

        usersRef
            .once("value")
            .then((snapshot) => {

                console.log(snapshot.numChildren() + ' specific Dates have activities associated with them for this user');
                snapshot.forEach(function (data) {

                    objectOfAllActivities[data.key] = data.val();
                });

                console.log(objectOfAllActivities, "before resolve");

                return resolve(objectOfAllActivities);
                //  new Promise(function (resolve, reject) {
                //     //console.log('now returning all of the assigned date records');
                //     resolve(objectOfAllActivities); // resolves to the .then, which returns it
                // })
            });
        // .then(function (returnVal) {

        //     console.log('Returning items from ReadAssignedActivitiesForUser:');
        //     console.log(returnVal);
        //     resolve(returnVal);
        // });
    });
};


// This function get the information about the activity located by the given key
const GetActivityInfoByKey = (keyValueToFind, assignedDate) => {

    console.log(`    start: GetActivityInfoByKey for ${keyValueToFind} on ${assignedDate}`);

    var user = firebase.auth().currentUser;
    var usersRef = database.ref('/allresearchitems/' + user.uid + '/' + keyValueToFind);
    var returnObject = {};
    returnObject['assignedDate'] = assignedDate; //pass from the key of the item in the previous function
    returnObject['activityRef'] = keyValueToFind;
    
    console.log('GetActivityInfoByKey before usersref');

    return usersRef
        .once("value")
        .then((snapshot) => {
            console.log('GetActivityInfoByKey in snapshot');
            snapshot.forEach(function (data) {

                returnObject[data.key] = data.val();
            })

            console.log('GetActivityInfoByKey just before return', returnObject);
            console.log(`    end:   GetActivityInfoByKey for ${keyValueToFind} on ${assignedDate}`, returnObject);
            return returnObject;
        });


};


// this function does a lookup for all the assigned activities and returns the information so that it can be populated on the page
function GetAllAssignedActivityInfo(listOfItems) {

    // Ultimately, I want this function to return an array of objects which I can use to easily update a table


    return new Promise((resolve, reject) => {

        // To do: I'll probably have to clear the existing table data before updating it
        // Then I'll have to loop for each object in the listOfItems

        console.log('running GetAllAssignedActivityInfo to get a list of all activites assigned to any day');
        //console.log(listOfItems);

        // loop through all of the items and add them to the table
        // item refers to the Firebase key for the activity entry
        // https://hackernoon.com/explaining-the-basics-of-the-javascript-object-keys-object-values-and-object-entries-methods-a10070cae63a
        // https://stackoverflow.com/questions/26711243/promise-resolve-vs-new-promiseresolve

        var allAssignedActivities = [];
        let activityPromises = [];
        for (var item in listOfItems) {

            console.log(item);
            // Each item represents a day
            // each day will have multiple activities listed
            // For each of those activities, we need to get the activity information from another table

            var activityReferenceKeys = Object.values(listOfItems[item]);
            for (var activityReference in activityReferenceKeys) {

                // for each key, obtain the information about the activity and then add it to the list
                // June 12: probably this function below doesn't need to be a promise?
                activityPromises.push(
                    GetActivityInfoByKey(activityReferenceKeys[activityReference].activityRef, item)
                        .then((activityInfo) => {

                            allAssignedActivities.push(activityInfo);
                        })
                );
            }

        }
        // https://stackoverflow.com/questions/28921127/how-to-wait-for-a-javascript-promise-to-resolve-before-resuming-function
        Promise.all(activityPromises)
            .then((results) => {

                console.log('finishing GetAllAssignedActivityInfo');
                resolve(allAssignedActivities);
            })


    });  


};

const ReadAssignedActivitiesForUserOnSpecificDate = (selectedDate) => {

    console.log(`running ReadAssignedActivitiesForUserOnSpecificDate for ${selectedDate}`);

    var user = firebase.auth().currentUser;
    var usersRef = database.ref('/selectedForDay/' + user.uid + '/' + selectedDate);
    var allActivitiesForThisDate = [];

    return usersRef
        .once("value")
        .then((snapshot) => {

            let activityPromises = [];
            console.log('ReadAssignedActivitiesForUserOnSpecificDate: ' + snapshot.numChildren() + ' activities are assigned ' + selectedDate + ' for this user');
            snapshot.forEach(function (data) {

                // Obtain the reference key for the activity
                var temp = data.val();
                var activityRef = temp.activityRef

                // The result of each of these promises is an object containing the detailed activity info for a specific activity reference
                activityPromises.push(
                    GetActivityInfoByKey(activityRef, selectedDate)
                );
 
            });

            // https://stackoverflow.com/questions/28921127/how-to-wait-for-a-javascript-promise-to-resolve-before-resuming-function
            // I can return the Promise.all because it is an array of all the promise results,
            // which is the detailed information about each activity
            console.log('GetAllAssignedActivityInfo: returning the activities assigned to ' + selectedDate);
            return Promise.all(activityPromises);

        });
};

// This function will remove the activity from the specified date
function RemoveSelectedActivityFromDate(selectedDate, activityRef) {

    // https://stackoverflow.com/questions/45386560/remove-item-using-its-location-or-key-in-firebase-react
    // Note: If there are duplicate activities on the same date, this will delete them all. Not just one
    
    var user = firebase.auth().currentUser;
    var activityReference = database.ref('/selectedForDay/' + user.uid + '/' + selectedDate);
    
    var key_to_delete = activityRef;
    var query = activityReference.orderByChild('activityRef').equalTo(key_to_delete);
    query.on('child_added', function(snapshot)
    {
        console.log('Deleting record' + '/selectedForDay/' + user.uid + '/' + selectedDate + '.activityRef: ' + key_to_delete);
        snapshot.ref.remove();
    });
}

// This function will remove the activity from the master list
// after this function is run, we also have to remove any assignments with that ref
// from the table of date-assigned acitivities
function RemoveSelectedActivity(activityRef) {

    var user = firebase.auth().currentUser;
    var usersRef = database.ref('/allresearchitems/' + user.uid).child(activityRef);
    
    console.log('Deleting record' + '/allresearchitems/'+user.uid+'/'+activityRef);
    usersRef.remove()
}

// This function will remove the activity reference from any Date where it is assigned
// This is run after an activity is deleted from the "all activities" list
function RemoveSelectedActivityFromDateAssignments(activityRef) {
  
    var user = firebase.auth().currentUser;
    var activityReference = database.ref('/selectedForDay/' + user.uid);
    
    var key_to_delete = activityRef;
    var query = activityReference.orderByChild('activityRef').equalTo(key_to_delete);
    query.on('child_added', function(snapshot)
    { 
        // I am commenting this out for the comment because this function is not yet working
        //snapshot.ref.remove();
    });
}   

// This function is used to update the database if the user
// The parameter is an object with the updated values 
function UpdateTripDatesLocation(changedValues) {

    var user = firebase.auth().currentUser;
    var myuserID = user.uid;    

    console.log(`Updating the user's travel date/time/location/etc.`, changedValues);
 
    if ((changedValues.changeStartDate !== '') && (changedValues.changeEndDate !== '') ) {
        firebase.database().ref('/users/' + myuserID + '/endDate/').set(changedValues.changeEndDate); 
        firebase.database().ref('/users/' + myuserID + '/startDate/').set(changedValues.changeStartDate); 

        firebase.database().ref('/users/' + myuserID + '/startDate/').on('value', function (snapshot) {
            document.getElementById('start-date-profile').innerText = snapshot.val(); 
        }); 

        firebase.database().ref('/users/' + myuserID + '/endDate/').on('value', function (snapshot) {
            document.getElementById('end-date-profile').innerText = snapshot.val(); 
        });  
 

    }

    if ((changedValues.changeCountry !== '') && (changedValues.changeCity !== '') ) {
        firebase.database().ref('/users/' + myuserID + '/cityLocation/').set(changedValues.changeCity); 
        firebase.database().ref('/users/' + myuserID + '/countryLocation/').set(changedValues.changeCountry); 

        firebase.database().ref('/users/' + myuserID).on('value', function (snapshot) {
            var newCity  = snapshot.val().cityLocation; 
            var newCountry  = snapshot.val().countryLocation; 
            var locationName = newCity + ', ' + newCountry;
            document.getElementById('destination-label').innerText = locationName; 
 
        }); 

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
        getWeather(changedValues.changeCity, changedValues.changeCountry); //used this to test that the API call works. We can populate this with the user's location
    } 


};


 
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