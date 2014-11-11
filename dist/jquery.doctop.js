/*! doctop - v0.0.1 - 2014-11-11
* https://github.com/times/doctop
* Copyright (c) 2014 Ændrew Rininsland; Licensed MIT */
/*jshint -W083*/
/*global getSlug,console*/
(function ($) {

  // Static method.
  $.doctop = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.doctop.options, options);

    // Return something awesome.
    $.ajax({
      url: options.url,
      type: 'GET',
      cache: false,
      crossDomain: true,
      success: function(res) {
        var root = $(res)
                    .filter('#contents')
                    .children()
                    .not('style'); // Don't need no stylesheets hurr!

        var sections = root.filter('h1');
        var outline = {};
        for (var i = 0; i < sections.length; i++) {
          var children;
          if (i+1 <= sections.length) {
            children = root.filter(sections[i]).after().nextUntil(sections[i+1]).filter(function(){return $(this).text().trim() !== '';});
          }

          var slug = getSlug($(sections[i]).text(), {separator: '_'});
          outline[slug] = children;
        }

        options.callback.call(outline, outline);
      }
    });
  };

  // Static method default options.
  $.doctop.options = {
    callback: function(res) {console.log('You forgot to specify a callback...'); console.dir(res);},
    url: ''
  };

}(jQuery));
