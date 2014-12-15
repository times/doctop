/*
 * Doctop — consume Google Docs via JavaScript
 *
 * Copyright (c) 2014 Ændrew Rininsland, The Times and Sunday Times
 * Licensed under the MIT license.
 */
(function ($) {

  // Static method.
  $.doctop = function (options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.doctop.options, options);

    // Return something awesome.
    $.ajax({
      url: options.url,
      type: 'GET',
      cache: options.cache,
      crossDomain: true,
      success: function(res) {
        var root = $(res)
                    .filter('#contents')
                    .children()
                    .not('style'); // Don't need no stylesheets hurr!


        // Replace spans with proper <strong> and <em> elements.
        if (options.preserveFormatting === true) {
          var textStyles = $(res).filter('#contents').children('style')[0].innerHTML;
          var boldClass = /(\.[a-z0-9]+?)\{[^{}]*?font-weight:bold[^{}]*?\}/gi.exec(textStyles);
          var italicClass = /(\.[a-z0-9]+?)\{[^{}]*?font-style:italic[^{}]*?\}/gi.exec(textStyles);

          if (boldClass && boldClass.length > 0) {
            root.find('span' + boldClass[1]).each(function(i, v){
              $(v).replaceWith('<strong>'  + v.innerHTML + '</strong>');
            });
          }

          if (boldClass && italicClass.length >  0) {
            root.find('span' + italicClass[1]).each(function(i, v){
              $(v).replaceWith('<em>' + v.innerHTML + '</em>');
            });
          }

        }

        // Strip out all the stupid class-less <span> tags
        $.grep(root.find('span'), function(v){
          if (!$(v).hasClass('*')) {
            if ($(v).text().length > 0) {
              $(v).replaceWith(v.innerHTML);
              return true;
            }
          }
        });

        // Remove &nbsp; and Unicode 160
        root.each(function(i, v){
          v.innerHTML = v.innerHTML.replace(/(?:\x0A|&nbsp;)/gi, ' ');
        });

        // Begin the main DOM walker!

        var tree = {};
        var currentTree = tree;
        var i = 0;
        var node = root[0];
        var tagName, key;

        while (node && node.nodeType === 1) {
          tagName = node.tagName.toLowerCase();

          // Handle headers
          switch(tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              key = options.simpleKeys ? tagName + '_' + i : getSlug(node.textContent.trim(), {separator: '_'});
              if (tagName === 'h1') {
                tree[key] = {
                  index: Object.keys(tree).length,
                  content: node.textContent.trim(),
                  children: {}
                };

                currentTree = tree[key].children;
              } else {
                currentTree[key] = {
                  index: Object.keys(currentTree).length,
                  content: node.textContent.trim(),
                  children: {}
                };

                currentTree = currentTree[key].children;
              }
            break;

            // Handle paragraphs
            default:
              if (node.innerHTML !== '<span></span>') {
                i = Object.keys(currentTree).length > 0 ? Object.keys(currentTree).length : 0;
                key = tagName + '_' + i;

                currentTree[key] = {
                  content: $(node).text(),
                  content_html: node.innerHTML,
                  index: Object.keys(currentTree).length
                };
              }
            break;
          }

          // Move to the next element
          node = node.nextElementSibling;
        }

        // Add Tabletop to output if requested
        if (typeof options.tabletop_url !== 'undefined' && typeof Tabletop !== 'undefined') {
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
            options.callback.call(tree, {copy: tree, data: ttdata});
          });

        // Otherwise return tree
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
    tabletop_proxy: undefined,
    tabletop_simplesheet: false,
    preserveFormatting: true,
    simpleKeys: false,
    cache: true
  };

}(jQuery));
