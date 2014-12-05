/*
 * doctop
 *
 * Copyright (c) 2014 Ændrew Rininsland, The Times and Sunday Times
 * Licensed under the MIT license.
 */
/*jshint -W083*/
/*global getSlug,console,Tabletop*/
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

        var tree = {};
        var currentTree = tree;
        var i = 0;
        var node = root[0];
        var tagName, key;

        while (node && node.nodeType === 1) {
          tagName = node.tagName.toLowerCase();

          switch(tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              key = options.simpleKeys ? tagName + '_' + i : getSlug(node.textContent.trim(), {separator: '_'});
              if (tagName === 'h1') {
                currentTree = tree[key] = {};
              } else {
                currentTree = currentTree[key] = {};
              }
            break;

            default:
              if (node.innerHTML !== '<span></span>') {
                i = typeof currentTree.length > 0 ? currentTree.length : 0;
                key = tagName + '_' + i;
                if (options.preserveFormatting === false && options.returnJquery === false) {
                  currentTree[key] = $(node).text();
                } else if (options.preserveFormatting === false && options.returnJquery === true) {
                  currentTree[key] = $(node);
                } else if (options.preserveFormatting === true && options.returnJquery === false) {
                  //TODO
                } else if (options.preserveFormatting === true && options.returnJquery === true) {
                  //TODO
                }
              }
            break;
          }

          // Move to the next element
          node = node.nextElementSibling;
        }

        if (typeof options.tabletop_url !== 'undefined' && typeof Tabletop !== 'undefined') { // Grab Tabletop.js dataset as well
          var tabletopData = new $.Deferred();
          Tabletop.init({
            key: options.tabletop_url,
            simpleSheet: false,
            callback: function(data, tt) {
              tabletopData.resolve({data: data, tabletop: tt});
            }
          });

          $.when(tabletopData).done(function(ttdata){
            options.callback.call(tree, {copy: tree, data: ttdata});
          });

        } else {
          options.callback.call(tree, {copy: tree});
        }
      }
    });
  };

  // Static method default options.
  $.doctop.options = {
    callback: function(res) {console.log('You forgot to specify a callback...'); console.dir(res);},
    url: '',
    tabletop_url: undefined,
    preserveFormatting: false,
    returnJquery: false,
    simpleKeys: false
  };

}(jQuery));
