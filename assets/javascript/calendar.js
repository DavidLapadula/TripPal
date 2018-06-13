$(document).ready(function () {

    //Swtiches
    var removeFullList = false; 
    var removeSelectedDay = false; 
    var addDateActivity = false; 
    var associatedDate; 
  
    //Calendar the map is attached to. Only worked with vanilla JS
    calendarPickDate = document.getElementById("calendar-pick-date");

    //Buttons
    removeDailyActivityBtn = $('#remove-daily-activity-btn'); 
    addActivityBtn = $('#add-activity-btn');
    removeActivityBtn = $('#remove-activity-btn');
    uploadProfileBtn = $('#upload-profile-btn');
    
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
    currentDayActivitiesTable = $('#current-day-activities');
    fullActivitiesTable = document.getElementById("full-activities-table"); 

    // Initializes the calendar
    var calendar = new Kalendae({
        attachTo: calendarPickDate,
        months:1, 
        mode:'single',
    });

    //Functions to manipulate the full list of activities. Vanilla JS was the easiest way to make this work. 
    var addFullList = function () {
        var row = fullActivitiesTable.insertRow(); 
        row.className = 'dynamic-row'; 
        var cell1 = row.insertCell(0);  
        var cell2 = row.insertCell(1);  
        cell1.innerHTML = addActivityInput.value; 
        newEventTd = document.createElement('p'); //Append a paragraph to the <td> element and add a hyperlink if a URL is included
        if (addURLInput.value !== '') {
            newanchor = document.createElement('a')
            newanchor.setAttribute('target', '_blank')
            newanchor.setAttribute('href', addURLInput.value); 
            newanchor.text = addEventInput.value; 
            newEventTd.appendChild(newanchor); 
        } else {
            newEventTd.innerHTML = addEventInput.value; 
        } 
        cell2.appendChild(newEventTd);   
    };     

     //Function for getting the date
     calendar.subscribe('change', function (date) {
        selectedDate = this.getSelected();
        associatedDate = moment(selectedDate).format('MMMM Do YYYY'); // one of the items that get's stored in the local storage value
        });  

    //When you click the add acitivity button, all other features are turned off and associated colors are as well
    addActivityBtn.click(function () {
        $('#full-activities-table tbody').removeClass();
        $('#current-day-activities tbody').removeClass();
        $('#current-day-activities tbody').removeClass();
        addDateActivity = false; 
        removeSelectedDay = false; 
        removeFullList = false; 

    })
    
    // Button that adds row to the full list table. Allows the user to leave out data, but not submit a blank form
    addFullListBtn.click(function () {
        event.preventDefault(); 
        if (addEventInput.value !== '') { //Allow user to not ignore some fields, but require at least an event in order to add it to the list
            addFullList();
        }
        addActivityInput.value = ''; 
        addEventInput.value = ''; 
        addURLInput.value = '';  
    });  

    //Toggle that allows the user to delete a row from the full activities list. Changes the color to red.
    removeActivityBtn.click(function() {
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

    //Toggle that allows user to associate activity with date. Changes the color to green 
    $('.k-in-month').click(function () {
        $('#full-activities-table tbody').addClass("text-success").removeClass("text-danger");
            removeFullList = false;  // Allows for only one of the functions to be active at once
            addDateActivity = true;   
    }) 
  
    //Allows the user to delete a row, only if the switch set by the button is on and the add date activity is disabled
    $("#full-activities-table").on('click', '.dynamic-row', function(){
        // Behaviour of the row determined by which switch is on
        if (removeFullList) {
            $(this).remove();  
        }
        if (addDateActivity) {
            $(this).removeClass("text-success").clone().appendTo($('#current-day-activities tbody'));  
            var addedRows = JSON.parse(localStorage.getItem("Event Rows")) || []; //Stores the added rows in local storage
            addedRows.push(this.innerHTML + associatedDate);  
            localStorage.setItem("Event Rows", JSON.stringify(addedRows));
            console.log($(this)); // I put this in the console to show what the jquery object will give you, if that would make it easier than using the inner HTML of the element when pushing to 'addedRows'
        }
        //Turn both switches off after the row has been clicked and return colors to normal
        removeFullList = false;  
        addDateActivity = false;  
        $('#full-activities-table tbody').removeClass("text-success text-danger");
    });    
     
    //Toggle that changes the switch that allows the user to delete a row. Changes the color to red if the switch is on. 
    removeDailyActivityBtn.click(function() { 
        event.preventDefault(); 
    $('#current-day-activities tbody').toggleClass("text-danger");
        if (!removeSelectedDay) {
             removeSelectedDay = true; 
        } else {
            removeSelectedDay = false; 
        }   
    });     

    //Allows the user to delete a row from the current day, only if the switch set by the button is on
    $("#current-day-activities").on('click', '.dynamic-row', function(){
    if(removeSelectedDay) {
    $(this).remove();
    }
    $('#current-day-activities tbody').removeClass("text-danger");
    removeSelectedDay = false; 
    });   


    //Function for querying search items
    searchActivityBtn.click(function() {
        event.preventDefault(); 
        searchActivitiesUl.empty()
        var search = $('#search-activities-input').val();   
        var apiKEY = '2389b3d267eb4f7eb652b54ef0011326'; 
        var queryURL = `https://newsapi.org/v2/everything?q=${search}&sortBy=relevancy&apiKey=${apiKEY}`; 
        $.ajax({ 
          url : queryURL, 
          method: 'GET', 
          dataType: 'json'
        }).then(function(response){
            if (search !== '') {
                for (var i = 0; i < 5; i ++) {
                    articleNum =  Math.floor(Math.random()* response.articles.length); 
                    articleIndex = response.articles[articleNum]; 
                    queryResult = $('<li>'); 
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



}); 
