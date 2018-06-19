$(document).ready(function () {

    //Selectors 
  
    var slideshowImages = $('#slideshow-images');
  
    //Sign Up form
    var nameInput = $('#name-input'); 
    var emailInput = $('#email-input');
    var passwordInput = $('#password-input');
    var startDateInput = $('#start-date-input');
    var endDateInput = $('#end-date-input');
    var cityInput = $('#city-input');
    var countryInput = $('#country-input');
    var formSubmitBtn = $('#form-submit-button');

    //General Sign In
    var emailInputLogIn = $('#email-input-logIn');
    var passwordInputlogIn = $('#password-input-logIn');
    var generalLogInBtn = $('#logIn-submit-button');

 
    //Images for slideshow
    var imageSource = ['download.jpg', 'flight.jpg', 'hands.jpg', 'quote.jpg', 'sign.jpg'];

    // Two functions that run the slideshow
    var slideshow = function () {
        slideshowIndex = 0;
        timedInterval = setInterval(changeImage, 3000)
    }
    var changeImage = function () {
        slideshowImages.animate({ opacity: "0.5" }, 100)
        slideshowImages.animate({ opacity: "1" }, 100)
        slideshowImages.attr('src', `assets/images/slideshow/${imageSource[slideshowIndex]}`);
        slideshowIndex++;
        if (slideshowIndex > imageSource.length - 1) {
            slideshowIndex = 0;
        }
    }
    slideshow();

    //Date picker
    var from_$input = $('#start-date-input').pickadate(),
        from_picker = from_$input.pickadate('picker')
  
    var to_$input = $('#end-date-input').pickadate(),
        to_picker = to_$input.pickadate('picker')


    // Check if there’s a “from” or “to” date to start with.
    if (from_picker.get('value')) {
        to_picker.set('min', from_picker.get('select'))
    }
    if (to_picker.get('value')) {
        from_picker.set('max', to_picker.get('select'))
    }

    // When something is selected, update the “from” and “to” limits.
    from_picker.on('set', function (event) {
        if (event.select) {
            to_picker.set('min', from_picker.get('select'))
        }
        else if ('clear' in event) {
            to_picker.set('min', false)
        }
    })
    to_picker.on('set', function (event) {
        if (event.select) {
            from_picker.set('max', to_picker.get('select'))
        }
        else if ('clear' in event) {
            from_picker.set('max', false)
        }
    });


    formSubmitBtn.click(function () {
        event.preventDefault();
        startDateInput.val();
        endDateInput.val();
        nameInput.val();
        countryInput.val();
        cityInput.val();
        passwordInput.val();
        emailInput.val(); 
    });


    //console.log('index.html loaded');
}); 