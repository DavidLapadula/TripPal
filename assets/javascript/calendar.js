$(document).ready(function () {

    //Selectors

    //Pick date and selected day column
    calendarPickDate = $('#calendar-pick-date'); 
    removeDailyActivityBtn = $('#remove-daily-activity-btn'); 
    currentDayActivitiesTable = $('#current-day-activities');
    
    //All Activities column
    addActivityBtn = $('add-activity-btn');
    removeActivityBtn = $('remove-activity-btn');
    
    //Modal For adding activities to the full list
    addActivityInput = $('add-activity-input');
    addEventInput = $('add-event-input');
    addURLInput = $('add-url-input');
    addFullListBtn = $('add-full-list-btn');

    //Search column
    searchActivityBtn = $('#search-activity-btn')
    clearListBtn = $('#clear-list-btn')
    searchActivitiesInput = $('#search-activities-input')
    searchActivitiesUl = $('#search-activities-ul')


}); 
