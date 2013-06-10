/*
 * AJAX request for handling error
 * messages displayed inside modals.
 */

'use strict';

// Variable to hold our request
var request;
// Bind to the submit event on the login form
$('#loginForm').submit(function(event) {
  // Stop any pending request
  if (request) {
    request.abort();
  }

  // Store the form
  var $form = $(this);

  // Disable inputs for the duration of the AJAX request
  var $inputs = $form.find('input, button');
  $inputs.prop('disabled', true);

  // Send request
  request = $.post('/index#loginForm', function(response) {
    // Test
    console.log('Response: ' + response);
  });

  // Callback handler that will fire on success
  request.done(function(response, textStatus, jqXHR) {
    console.log('Request sent successfully!');
  });

  // Callback handler that will fire on failure
  request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log('An error occurred: ' + textStatus, errorThrown);
  });

  // Callback handler that will be called no matter what
  request.always(function() {
    // Reenable the form inputs
    $inputs.prop('disabled', false);
    console.log('Form inputs have been reenabled.');
  });

  // Finally, prevent default posting of the form
  event.preventDefault();
});

