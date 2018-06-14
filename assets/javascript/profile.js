import { database } from "./userlogin.js"; // import the file
export { PopulateSummaryTable, addRowToSummaryTable };
   
    
var currentTempDiv = null;
var startDateProfile = null; 
var endDateProfile = null;
var assignedDateSummaryTable = null; 
var profileMap = null;
var changeInfoBtn = null; 
 
$(document).ready(function () {
  
  //Selectors
  //Display the current temperature
  currentTempDiv = $('#current-temp-div');

  //Display the duration of the trip
  startDateProfile = $('#start-date-profile');
  endDateProfile = $('#end-date-profile');

  //Table for displaying the homepage activities list
  assignedDateSummaryTable = document.getElementById("profile-page-activities");
 
  //Google map display on the profile page
  profileMap = $('#profile-map');
  var destinationLat;
  var destinationLon;
 

});


// Populate the profile page with the full list of assigned activities
// June 12: This may not need to be a promise, since the resolve doesn't return anything?
function PopulateSummaryTable(listOfItems) {

    // https://stackoverflow.com/questions/48240858/how-to-sort-array-of-object-by-key
  // Sort the array of objects by the date that the user wants to do them
  listOfItems.sort((a,b) => b.assignedDate < a.assignedDate ? 1 : -1);

  return new Promise((resolve, reject) => {

    // I'll probably have to clear the existing table data before updating it
    // Then I'll have to loop for each object in the listOfItems

    console.log('running PopulateSummaryTable');
    //console.log(listOfItems);

    // loop through all of the items and add them to the table
    // item refers to the Firebase key for the activity entry
    // June 12 To Do: sort the list of items by date before outputting to the screen
    for (var item in listOfItems) {
      //console.log('building info to add row for index: ' + item);
      var rowInfoToPass = {};
      rowInfoToPass['category'] = listOfItems[item].category;
      rowInfoToPass['description'] = listOfItems[item].description;
      rowInfoToPass['url'] = listOfItems[item].url;
      rowInfoToPass['assignedDate'] = listOfItems[item].assignedDate;

      //rowInfoToPass['dbref'] = item; // note necessary on the summary table
      //console.log(rowInfoToPass);
      addRowToSummaryTable(rowInfoToPass);
    }  

    resolve();
  });
};

 
/* Add an item to the summary of assigned items
 takes an object with the following parameters:
  Assigned Date
  Category
  Description
  URL
*/
var addRowToSummaryTable = function (rowInfo) {

  console.log('running addRowToSummaryTable: ' + rowInfo.description);

  var row = assignedDateSummaryTable.insertRow();
  row.className = 'dynamic-row';
  //row.setAttribute('dbref',rowInfo.dbref); // Not necessary on the profile page

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2); 

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

  cell3.innerHTML = rowInfo.assignedDate;
};  