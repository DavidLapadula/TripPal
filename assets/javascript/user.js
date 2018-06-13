$(document).ready(function () {


    //Selectors
    var profileCollapseButton = $('.navbar-toggler');
    var profileCollapseContent = $('#navbarNavAltMarkup');
    var profilePicInput = $('#profile-pic-input');
    var clearProfilePicBtn = $('#clear-file-input');
    var submitProfilePic = $('#submit-profile-pic-btn');


    var logOutBtn = $('#log-out-btn');
    var profileTopBtn = $('#profile-top-btn');
    var calendarTopBtn = $('#calendar-top-btn');
    var userHeader = $('#user-header');
    var changeStartDate = $('#change-start-date');
    var changeEndDate = $('#change-end-date');
    var changeCountryInput = $('#change-coutry-input');
    var changeCityInput = $('#change-city-input');
    var changeInfoBtn = $('#change-info-btn');
    var destinationLabel = $('#destination-label');

    //Hide the submit profile picture button on page load
    submitProfilePic.hide(); 

    //Global variable updated with the file for the profile picture whenever the input form is updated
    var selectedFile; 

    //Navbar collapse function
    profileCollapseButton.click(function () {
        event.preventDefault();
        var isAnimated = profileCollapseContent.hasClass('animated fadeInDown');
        !isAnimated ? profileCollapseContent.addClass('animated fadeInDown') : profileCollapseContent.removeClass('animated fadeInDown');
    });

    //Change the Date Modal      
    //Date picker
    var from_$input = changeStartDate.pickadate(),
        from_picker = from_$input.pickadate('picker')

    var to_$input = changeEndDate.pickadate(),
        to_picker = to_$input.pickadate('picker');

    //Change the color of the button based on which page you have  
    profileTopBtn.click(function () {
        event.preventDefault();
        profileTopBtn.addClass('tan-background').removeClass('navy-background');
        calendarTopBtn.addClass('navy-background').removeClass('tan-background');
    });
    calendarTopBtn.click(function () {
        event.preventDefault();
        calendarTopBtn.addClass('tan-background').removeClass('navy-background');
        profileTopBtn.addClass('navy-background').removeClass('tan-background');
    });

    // File Uploader  
    profilePicInput.change(function (event) {
        selectedFile = event.target.files[0]; // This is the file to submit to firebase
        console.log(selectedFile)
        
        var fieldVal = $(this).val();
        
        // Only show the button if there is a file in the field
        if (fieldVal !== "") {
            submitProfilePic.show();
        } else {
            submitProfilePic.hide();
        }; 

        //Make the text of the input field whatever file you have chosen
        if (fieldVal != undefined || fieldVal != "") {
            $(this).next(".custom-file-label").text(fieldVal);
        } 
    });    

    clearProfilePicBtn.click(function () {
        // Hide the button and clear the text when the clear function is chosen
        submitProfilePic.hide();
        profilePicInput.next().text('');
    }); 
    
    submitProfilePic.click(function () {
        event.preventDefault();
        //file submitted to firebase
        console.log(selectedFile); 
          
        
        //empty function for submitting the profile picture
        //Do not need to worry about the user submitting nothing because the button only shows whwn something is there
    });


});   