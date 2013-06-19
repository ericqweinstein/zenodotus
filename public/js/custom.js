'use strict';

$(function() {

  /* AJAX request for handling error
  // messages displayed inside modals.

  // Bind to the submit event on the login form
  $('body').on('submit', '#loginForm', function(e) {
    // Store the form
    var $form = $(this);

    // Disable inputs for the duration of the AJAX request
    var $inputs = $form.find('input, button');
    var serializedData = $form.serialize();
    $inputs.prop('disabled', true);

    // Send request
    var request = $.post('/login', serializedData, function(response) {
      console.log('Response: ' + response);
    });

    // Callback handler called on success
    // 
    // This may actually be the worst thing I have ever done
    request.done(function(response, textStatus, jqXHR) {
      if (response === 'Incorrect username/password combination.') {
        $('#password-error').html(response);
      } else {
        window.location.replace('/');
      }
    });

    // Callback handler called on failure
    request.fail(function(jqXHR, textStatus, errorThrown) {
      console.log('An error occurred: ' + errorThrown);
    });

    // Callback handler called no matter what
    request.always(function() {
      // Reenable the form inputs
      $inputs.prop('disabled', false);
    });

    // Prevent default handling of form
    e.preventDefault();
  }); */

  // Open all external links in new windows.

  $('a').each(function() {
    var a = new RegExp('/' + window.location.host + '/');
    if (!a.test(this.href)) {
      $(this).click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(this.href, '_blank');
      });
    }
  });

  // Settings dropdown
  $('.dropdown-toggle').dropdown();
});

