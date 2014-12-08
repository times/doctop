/*
 * doctop
 *
 * Copyright (c) 2014 Ændrew Rininsland, The Times and Sunday Times
 * Licensed under the MIT license.
 */
/*jshint -W083*/
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

          var slug = options.simpleKeys ? 'section_' + i : getSlug($(sections[i]).text(), {separator: '_'});
          if (options.preserveFormatting === false && options.returnJquery === false) {
            var childElements = [];
            children.each(function(){
              childElements.push($(this).text());
            });
            outline[slug] = childElements;
          } else if (options.preserveFormatting === false && options.returnJquery === true) {
            outline[slug] = children;
          } else if (options.preserveFormatting === true && options.returnJquery === false) {
            //TODO
          } else if (options.preserveFormatting === true && options.returnJquery === true) {
            //TODO
          }

        }

        if (typeof options.tabletop_url !== 'undefined' && typeof Tabletop !== 'undefined') { // Grab Tabletop.js dataset as well
          var tabletopData = new $.Deferred();
          Tabletop.init({
            key: options.tabletop_url,
            simpleSheet: options.tabletop_simplesheet,
            proxy: options.tabletop_proxy,
            callback: function(data, tt) {
              tabletopData.resolve({data: data, tabletop: tt});
            }
          });

          $.when(tabletopData).done(function(ttdata){
            options.callback.call(outline, {copy: outline, data: ttdata});
          });

        } else {
          options.callback.call(outline, {copy: outline});
        }
      }
    });
  };

  // Static method default options.
  $.doctop.options = {
    callback: function(res) {console.log('You forgot to specify a callback...'); console.dir(res);},
    url: '',
    tabletop_url: undefined,
    tabletop_proxy: undefined,
    tabletop_simplesheet: false,
    preserveFormatting: false,
    returnJquery: false,
    simpleKeys: false
  };

}(jQuery));
