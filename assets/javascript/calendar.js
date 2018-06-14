import {
    StoreNewActivityItemIntoFirebase,
    StoreNewActivityItemIntoFirebasePromise,
    ReadAllPossibleActivitiesForUser,
    StoreActivityReferenceToSpecificDate,
    ReadAllAssignedActivitiesForUser,
    GetActivityInfoByKey, 
    GetAllAssignedActivityInfo, 
    ReadAssignedActivitiesForUserOnSpecificDate,
    RemoveSelectedActivityFromDate,
    RemoveSelectedActivity,
    RemoveSelectedActivityFromDateAssignments,
    UpdateTripDatesLocation
} from "./database.js"; // import the file

import { database, DeterminePresentHTMLPage } from "./userlogin.js"; // import the file

export { PopulateFullActivityListOnPagePromise };

var removeDailyActivityBtn = null;
var addActivityBtn = null;
var removeActivityBtn = null;
var addActivityInput = null;
var addEventInput = null;
var addURLInput = null;
var addFullListBtn = null;
var searchActivityBtn = null;
var clearListBtn = null;
var searchActivitiesInput = null;
var searchActivitiesUl = null;
var currentDayActivitiesTable = null;
var fullActivitiesTable = null;
var changeInfoBtn = null;


$(document).ready(function () {

    //Swtiches
    var removeFullList = false;
    var removeSelectedDay = false;
    var addDateActivity = false;
    var associatedDate;

    //Calendar the map is attached to. Only worked with vanilla JS
    // calendarPickDate = document.getElementById("calendar-pick-date");
  
    //Buttons
    removeDailyActivityBtn = $('#remove-daily-activity-btn');
    addActivityBtn = $('#add-activity-btn');
    removeActivityBtn = $('#remove-activity-btn');
    changeInfoBtn = $('#change-info-btn');

    //Modal For adding activities to the full list. Needed to use vanilla js in order to update the table properly
    addActivityInput = document.getElementById("add-activity-input");
    addEventInput = document.getElementById("add-event-input");
    addURLInput = document.getElementById("add-url-input");
    addFullListBtn = $('#add-full-list-btn');

    //Search column
    searchActivityBtn = $('#search-activity-btn')
    clearListBtn = $('#clear-list-btn')
    searchActivitiesInput = $('#search-activities-input')
    searchActivitiesUl = $('#search-activities-ul');

    //Tables that new rows are appended to  
    currentDayActivitiesTable = document.getElementById("current-day-activities");
    fullActivitiesTable = document.getElementById("full-activities-table");


    //When you click the add acitivity button, all other features are turned off and associated colors are as well
    addActivityBtn.click(function () {
        $('#full-activities-table tbody').removeClass();
        $('#current-day-activities tbody').removeClass();
        $('#current-day-activities tbody').removeClass();
        addDateActivity = false;
        removeSelectedDay = false;
        removeFullList = false;

    });

    // Button that adds row to the full list table. Allows the user to leave out data, but not submit a blank form
    addFullListBtn.click(function () {
        event.preventDefault();
        console.log('addFullListBtn.click');
        if (addEventInput.value !== '') { //Allow user to not ignore some fields, but require at least an event in order to add it to the list

            console.log('creating a new Activity item');
            var newItem = {
                category: addActivityInput.value,
                description: addEventInput.value,
                url: addURLInput.value
            }
            StoreNewActivityItemIntoFirebasePromise(database, newItem).then(() => {
                console.log('finished storing');
                ReadAllPossibleActivitiesForUser(database).then(function (masterListofActivities) {

                    console.log('about to call PopulateFullActivityListOnPagePromise');
                    PopulateFullActivityListOnPagePromise(masterListofActivities);
                });
            });
            console.log('end of addFullListBtn.click');
        }
        addActivityInput.value = '';
        addEventInput.value = '';
        addURLInput.value = '';
    });

    //Toggle that allows the user to delete a row from the full activities list. Changes the color to red.
    removeActivityBtn.click(function () {
        event.preventDefault();
        $('#full-activities-table tbody').toggleClass("text-danger");
        //Allow user to remove a list and also allows for changing the active function after clicking the button multiple times 
        if (!removeFullList) {
            removeFullList = true; // Allows for only one of the functions to be active at once
            addDateActivity = false;
        } else {
            removeFullList = false;
        }
    })

        // This button, when clicked will take the updated trip info (location, start/end dates)
    // and call a function that updates the user's information accordingly    
    changeInfoBtn.click(function () {
        event.preventDefault();

        // Pass this object to the function for updating the database
        var changedValues = {
            changeStartDate: document.getElementById("change-start-date").value,
            changeEndDate: document.getElementById("change-end-date").value,
            changeCountry: document.getElementById("change-coutry-input").value,
            changeCity: document.getElementById("change-city-input").value,
        };
        UpdateTripDatesLocation(changedValues);

        document.getElementById("change-start-date").value = ""; 
        document.getElementById("change-end-date").value = ""; 
        document.getElementById("change-coutry-input").value = ""; 
        document.getElementById("change-city-input").value = ""; 

    });

    //Toggle that allows user to associate activity with date. Changes the color to green 
    $('.k-in-month').click(function () {
        $('#full-activities-table tbody').addClass("text-success").removeClass("text-danger");
        removeFullList = false;  // Allows for only one of the functions to be active at once
        addDateActivity = true;
    })

    //Allows the user to delete a row, only if the switch set by the button is on and the add date activity is disabled
    $("#full-activities-table").on('click', '.dynamic-row', function () {
        // Behaviour of the row determined by which switch is on
        if (removeFullList) {
                 // This will have to not only remove the activity from the master list, it will
            // also have to remove any references to that activity from the assigned acitivities
            
            // get the attributes from the clicked row, which contain information about which record is to be deleted
            // then just use jQuery to remove the clicked row from the html table
            //RemoveSelectedActivityFromDate($(this).attr('assigneddate'), $(this).attr('dbref'));            

            var referenceToRemove = $(this).attr('dbref');
            console.log('Clicked master row: ', $(this), $(this).attr('dbref'));
            RemoveSelectedActivity(referenceToRemove);
            RemoveSelectedActivityFromDateAssignments(referenceToRemove);
            $(this).remove();
        } 

        if (addDateActivity) { // After selecting a day on the calendar, the user has clicked on the full activities table

            console.log('The clicked activity will be added to the daily list for: ' + localStorage.getItem("Selected Date"));
            console.log('The activity reference is in the allresearchitems table/userid/reference value:', $(this).attr('dbref'));

            /* To do:
                When adding an event to a selected date here, I need to:
                - see if the event entry already exists in the database
                - If it does not exist, add the reference to the item being clicked on under that date.
                  How should I structure it? A JSON array of all the assigned items for the day?
                - Once it has been added to the list for the day, I need to:
                    - read the list back from the database for the selected day
                    - update the current-day-activities table with the content of the selected day
            
            Note: The updating of the table also has to be done on the click of the calendar

            */

            // Promises to get the assigned activities for the selected date, and populate the table
            console.log('---------Promises-----------');

            StoreActivityReferenceToSpecificDate(localStorage.getItem("Selected Date"), $(this).attr('dbref'))
                .then(() => {
                    ReadAssignedActivitiesForUserOnSpecificDate(localStorage.getItem("Selected Date"))
                        .then(PopulateAssignedActivitiesForUserOnSpecificDate)
                });

            console.log('--------------------');

        }
        //Turn both switches off after the row has been clicked and return colors to normal
        removeFullList = false;
        addDateActivity = false;
        $('#full-activities-table tbody').removeClass("text-success text-danger");
    });

    //Toggle that changes the switch that allows the user to delete a row. Changes the color to red if the switch is on. 
    removeDailyActivityBtn.click(function () {
        event.preventDefault();
        $('#current-day-activities tbody').toggleClass("text-danger");
        if (!removeSelectedDay) {
            removeSelectedDay = true;
        } else {
            removeSelectedDay = false;
        }
    });

    //Allows the user to delete a row from the current day, only if the switch set by the button is on
    $("#current-day-activities").on('click', '.dynamic-row', function () {
        if (removeSelectedDay) {
                // get the attributes from the clicked row, which contain information about which record is to be deleted
            // then just use jQuery to remove the clicked row from the html table
            RemoveSelectedActivityFromDate($(this).attr('assigneddate'), $(this).attr('dbref'));
            $(this).remove(); 
        }
        $('#current-day-activities tbody').removeClass("text-danger");
        removeSelectedDay = false;
    });

    //Function for querying search items
    searchActivityBtn.click(function () {
        event.preventDefault();
        searchActivitiesUl.empty()
        var search = $('#search-activities-input').val();
        var apiKEY = '2389b3d267eb4f7eb652b54ef0011326';
        var queryURL = `https://newsapi.org/v2/everything?q=${search}&sortBy=relevancy&apiKey=${apiKEY}`;
        $.ajax({
            url: queryURL,
            method: 'GET', 
            dataType: 'json'
        }).then(function (response) {
            if (search !== '') {
                for (var i = 0; i < 5; i++) {
                    var articleNum = Math.floor(Math.random() * 20);
                    var articleIndex = response.articles[articleNum];
                    var queryResult = $('<li>'); 
                    $('<p>', { 
                        text: articleIndex.description,
                        class: 'mt-2 mr-0 ml-0 mb-0'
                    }).appendTo(queryResult);
                    $('<a>', {
                        href: articleIndex.url,
                        text: 'Visit Article',
                        target: '_blank',
                        class: 'tan-text header-font'
                    }).appendTo(queryResult);
                    queryResult.appendTo(searchActivitiesUl);
                }
            }
        });
        searchActivitiesInput.val('').attr('placeholder', 'search something to do')
    });

    //Clear the search list
    clearListBtn.click(function () {
        event.preventDefault();
        searchActivitiesUl.empty()
        searchActivitiesInput.val('').attr('placeholder', 'search something to do')
    });

    // When the user clicks on the calendar, the selected date is save in localstorage
    // This event listener detects a click on the calendar and will then get the selected
    // date from local storage and use it to populate the "selected day" table
    document.getElementById("calendar-pick-date").addEventListener("click", function () {

        //Reading the selected day from local storage, and then updating the table
        ReadAssignedActivitiesForUserOnSpecificDate(localStorage.getItem("Selected Date"))
            .then(PopulateAssignedActivitiesForUserOnSpecificDate);
    });


});


// This will populate the table showing anything assigned on the selected date
function PopulateAssignedActivitiesForUserOnSpecificDate(listOfItems) {

    return new Promise((resolve, reject) => {

        // I'll probably have to clear the existing table data before updating it
        // Then I'll have to loop for each object in the listOfItems

        console.log('running PopulateAssignedActivitiesForUserOnSpecificDate');
        console.log('    list of items to add to table: ', listOfItems); //this prints as undefined when empty

        // Before we add to the table, clear it's existing content
        document.getElementById("current-day-activities").innerHTML = '';



        // loop through all of the items and add them to the table
        // item refers to the Firebase key for the activity entry
        let i = 0;
        for (var item in listOfItems) {
            //console.log('building info to add row for index: ' + item);
            var rowInfoToPass = {};
            rowInfoToPass['category'] = listOfItems[item].category;
            rowInfoToPass['description'] = listOfItems[item].description;
            rowInfoToPass['url'] = listOfItems[item].url;
            rowInfoToPass['dbref'] = listOfItems[item].activityRef; // activity ref to later remove from date if necessary
            rowInfoToPass['assignedDate'] = listOfItems[item].assignedDate; // Also necessary if we want to remove it from the day

            addRowToSpecificDateTable(rowInfoToPass);
            i++;
        }
        console.log(`    Done. ${i} rows should now have been added to the table`);
        resolve();
    });
};


var addRowToSpecificDateTable = function (rowInfo) {

    console.log('running addRowToSpecificDateTable: ' + rowInfo.description);

    var row = currentDayActivitiesTable.insertRow();
    row.className = 'dynamic-row';
    row.setAttribute('dbref', rowInfo.dbref); // June 11. This attribute will allow us to get the reference for the item which is presently in the master db activities list
    row.setAttribute('assignedDate', rowInfo.assignedDate);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = rowInfo.category;

    var newEventTd = document.createElement('p'); //Append a paragraph to the <td> element and add a hyperlink if a URL is included
    if (rowInfo.url !== '') {
        var newanchor = document.createElement('a')
        newanchor.setAttribute('target', '_blank')
        newanchor.setAttribute('href', rowInfo.url);
        newanchor.text = rowInfo.description;
        newEventTd.appendChild(newanchor);
    } else {
        newEventTd.innerHTML = rowInfo.description;
    }
    cell2.appendChild(newEventTd);

};


// Populate the page with the full list of possible items
function PopulateFullActivityListOnPagePromise(listOfItems) {

    return new Promise((resolve, reject) => {

        // I'll probably have to clear the existing table data before updating it
        // Then I'll have to loop for each object in the listOfItems

        console.log('running PopulateFullActivityListOnPagePromise');
        //console.log(listOfItems);

        // Before we add to the table, clear it's existing content
        document.getElementById("full-activities-table").innerHTML = '';

        // loop through all of the items and add them to the table
        // item refers to the Firebase key for the activity entry
        for (var item in listOfItems) {
            //console.log('building info to add row for index: ' + item);
            var rowInfoToPass = {};
            rowInfoToPass['category'] = listOfItems[item].category;
            rowInfoToPass['description'] = listOfItems[item].description;
            rowInfoToPass['url'] = listOfItems[item].url;
            rowInfoToPass['dbref'] = item;
            //console.log(rowInfoToPass);
            addRowToMasterTable(rowInfoToPass);
        } 

        resolve();
    });
};

// Add an item to the table
var addRowToMasterTable = function (rowInfo) {

    console.log('running addRowToMasterTable: ' + rowInfo.description);

    var row = fullActivitiesTable.insertRow();
    row.className = 'dynamic-row';
    row.setAttribute('dbref', rowInfo.dbref); // June 11. This attribute will allow us to get the reference for the item which is presently in the master db activities list

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = rowInfo.category;

    var newEventTd = document.createElement('p'); //Append a paragraph to the <td> element and add a hyperlink if a URL is included
    if (rowInfo.url !== '') {
        var newanchor = document.createElement('a')
        newanchor.setAttribute('target', '_blank')
        newanchor.setAttribute('href', rowInfo.url);
        newanchor.text = rowInfo.description;
        newEventTd.appendChild(newanchor);
    } else {
        newEventTd.innerHTML = rowInfo.description;
    }
    cell2.appendChild(newEventTd);

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


