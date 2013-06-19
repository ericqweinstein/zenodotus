'use strict';

$(function() {
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

