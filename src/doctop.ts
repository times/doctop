/*
 * Doctop — consume Google Docs over XHR
 *
 * Copyright (c) 2015 Ændrew Rininsland, The Times and Sunday Times
 * Licensed under the MIT license.
 */

import {merge} from 'lodash';
import {get} from 'axios';

// import {Promise} from 'es6-promise';
import * as cheerio from 'cheerio';
import * as archieml from 'archieml';

export default class Doctop {
  private options: IDoctopOptions = {
    archieml: true,
    cache: false,
    callback: function(): void { console.log('You forgot to specify a callback.'); },
    preserveFormatting: true,
    simpleKeys: false,
    staticExport: false,
    url: undefined,
  };

  private parsed: CheerioStatic;
  private root: Cheerio;
  private tree: any;

  constructor(options: IDoctopOptions) {
    this.options = merge(this.options, options);
    get(options.url).then((res: axios.Response) => {
      this.parsed = cheerio.load(res.data);
      this.root = this.cleanGoogleDocHTML(this.parsed.root());
      this.tree = this.parseDOMIntoTree(this.root);

      let archie: any;

      if (this.options.archieml && typeof archieml === 'object') {
        archie = this._parseArchieML(this._cleanGDoc(this.parsed.root()));

        // remove smart quotes from inside tags
        archie = archie.replace(/<[^<>]*>/g, function(match: string): string {
          return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
        });

        this.tree.archie = archieml.load(archie);
      }

      // Fire user callback.
      this.options.callback.call(this.tree, {copy: this.tree});
    })
    .catch((err: any) => {
      console.log(err);
    });
  }

  /**
   * Clean out the gross Google Docs markup
   *
   * @param {Object} res HTML Object
   * @returns {Object} jQuery object
   */
  public cleanGoogleDocHTML(res: Cheerio): Cheerio {
    let root: Cheerio = this._cleanGDoc(res);
    let $: CheerioStatic = this.parsed;

    // replace spans with proper <strong> and <em> elements.
    if (this.options.preserveFormatting || this.options.fancyOutput) {
      let textStyles: string = this.options.staticExport ?
        res.filter('style').first().html() : res.filter('#contents').children('style').first().html();
      let boldClass: RegExpExecArray = /(\.[a-z0-9]+?)\{[^{}]*?font-weight:bold[^{}]*?\}/gi.exec(textStyles);
      let italicClass: RegExpExecArray = /(\.[a-z0-9]+?)\{[^{}]*?font-style:italic[^{}]*?\}/gi.exec(textStyles);

      if (boldClass && boldClass.length > 0) {
        root.find('span' + boldClass[1]).each(function(i: number, v: CheerioElement): void {
          $(v).replaceWith('<strong>'  + $(v).html() + '</strong>');
        });
      }

      if (italicClass && italicClass.length >  0) {
        root.find('span' + italicClass[1]).each(function(i: number, v: CheerioElement): void {
          $(v).replaceWith('<em>' + $(v).html() + '</em>');
        });
      }
    }

  //   // strip out all the stupid class-less <span> tags
  //   // @TODO re-add this.
  //
  //   // $.grep(root.find('span'), function(v){
  //   //   if ($(v).text().length > 0) {
  //   //     $(v).replaceWith(v.innerHTML);
  //   //     return true;
  //   //   }
  //   // });
  //
    // remove &nbsp; and Unicode 160
    root.each(function(i: number, v: CheerioElement): void {
      let el: Cheerio = $(v);
      el.html(el.html().replace(/(?:\x0A|&nbsp;)/gi, ' '));
    });

    // finally, remove all empty tags.
    $('span:not(:has(*))').remove();

    return root;
  };

  /**
   * Walk through the DOM, sorting elements hierarchically.
   *
   * @param {Object} root jQuery Object
   * @returns {Object} DocTop tree
   */
  private parseDOMIntoTree(root: Cheerio): IDoctopTree {
    // let options: IDoctopOptions = this.options;

    // DEBUGGING
    return root;

    //
    // /**
    //  * Return either an empty object or detailed object based on fancyOutput.
    //  *
    //  * @private
    //  * @param {Object} tree A partial DocTop tree parent
    //  * @param {Object} node A DOM node
    //  * @returns {Object} Either empty or detailed based on fancyOutput
    //  */
    // function _returnNode(tree: Cheerio, node: Cheerio): IDoctopFancy | {} {
    //   if (options.fancyOutput) {
    //     return {
    //       children: {},
    //       content: node.text().trim(),
    //       depth: Number(node.get(0).tagName.toUpperCase().replace('H', '')) - 1,
    //       index: Object.keys(tree).length,
    //       tag: node.get(0).tagName,
    //     };
    //   } else {
    //     return {};
    //   }
    // }
    //
    // /**
    //  * Parse `<p>` tags as fancy object, HTML or text, in that order.
    //  *
    //  * @private
    //  * @param {Object} node A HTML DOM node
    //  * @param {Object} currentTree A partial DocTop tree parent
    //  */
    // function _returnParagraph(node: Cheerio, currentTree: Cheerio): IDoctopFancy| string {
    //   if (options.fancyOutput) {
    //     return {
    //       content: node.text(),
    //       content_html: node.html(),
    //       index: Object.keys(currentTree).length,
    //       tag: node.get(0).tagName,
    //     };
    //   } else if (options.preserveFormatting) {
    //     return node.html();
    //   } else {
    //     return node.text();
    //   }
    // }
    //
    // /**
    //  * Prevent duplicates of existing keys.
    //  *
    //  * @param {String} key Current key
    //  * @param {Object} tree Current tree
    //  * @returns {String} Updated key name
    //  */
    // function _enumerateKey(key: string, tree: Array<CheerioElement>): string {
    //   let i: number = 0;
    //   while (typeof tree[key] !== 'undefined') {
    //     key = key + '_' + i;
    //     i++;
    //   }
    //
    //   return key;
    // }
    //
    // // Begin the main DOM walker!
    //
    // let tree: IDoctopTree = {};
    // let currentTree: any = tree;
    // let currentLevel: number = 1;
    // let i: number = 0;
    // let ptagi: number = 0;
    // let node: CheerioElement = root.get(0);
    // let tagName: string, key: string, lastTree: any;
    // let $: CheerioStatic = this.parsed;
    //
    // while (node && $(node).nodeType === 1) {
    //   tagName = node.tagName.toLowerCase();
    //
    //   // Handle headers
    //   switch (tagName) {
    //     case 'h1':
    //     case 'h2':
    //     case 'h3':
    //     case 'h4':
    //     case 'h5':
    //     case 'h6':
    //       key = options.simpleKeys ? tagName + '_' + i : node.textContent.trim();
    //       if (tagName === 'h1') { // is top level
    //         key = _enumerateKey(key, tree);
    //         tree[key] = _returnNode(tree, node);
    //         currentTree = options.fancyOutput ? tree[key].children : tree[key];
    //         lastTree = currentTree;
    //         i++;
    //       } else {
    //         if (currentLevel >= Number(tagName.substr(1))) { // go up a level; same level
    //           key = _enumerateKey(key, lastTree);
    //           lastTree[key] = _returnNode(lastTree, node);
    //           currentTree = options.fancyOutput ? lastTree[key].children : lastTree[key];
    //         } else if (currentLevel < Number(tagName.substr(1))) { // go down a level
    //           key = _enumerateKey(key, currentTree);
    //           currentTree[key] = _returnNode(currentTree, node);
    //           currentTree = options.fancyOutput ? currentTree[key].children : currentTree[key];
    //         }
    //       }
    //
    //       currentLevel = Number(tagName.substr(1)); // assign currentLevel to the level of the current tag.
    //     break;
    //
    //     // Handle paragraphs
    //     default:
    //       if (node.innerHTML !== '<span></span>') {
    //         ptagi = Object.keys(currentTree).length > 0 ? Object.keys(currentTree).length : 0;
    //         key = tagName + '_' + ptagi;
    //         currentTree[key] = _returnParagraph(node, currentTree);
    //       }
    //     break;
    //   } // end switch
    //
    //   // Move to the next element
    //   node = node.nextElementSibling;
    // } // end while
    //
    // return tree;
  }; // end this._parseDOMIntoTree

  /**
   * Parse a DOM object for ArchieML
   *
   * @param {Array} root Array of jQuery objects
   * @returns {Object} Parsed ArchieML document
   */
  private _parseArchieML(root: Cheerio): any {
    // Parse each tag according to ArchieML rules.
    // Modified from: https://github.com/newsdev/archieml-js/blob/master/examples/google_drive.js
    let $: CheerioStatic = this.parsed;

    let tagHandlers: any = {
      _base: function (tag: CheerioElement): string {
        let str: string = '';
        let func: any;

        if (typeof tag.tagName !== 'undefined') {
          if (tag.children.length) {
            $(tag.children).each(function(i: number, child: CheerioElement): void {
              func = tagHandlers[child.tagName.toLowerCase()];
              if (func) {
                str += func(child);
              }
            });
          } else {
            str += $(tag).text();
          }

        } else { // top level
          $(tag).each(function(i: number, child: CheerioElement): void {
            func = tagHandlers[child.tagName.toLowerCase()];
            if (func) {
              str += func(child);
            }
          });
        }

        return str;
      },

      text: function (textTag: CheerioElement): string {
        return $(textTag).text();
      },

      span: function (spanTag: CheerioElement): string {
        return tagHandlers._base(spanTag);
      },

      p: function (pTag: CheerioElement): string {
        return tagHandlers._base(pTag) + '\n';
      },

      a: function (aTag: CheerioElement): string {
        let href: string = $(aTag).attr('href');
        if (href === undefined) {
          return '';
        }

        // extract real URLs from Google's tracking
        // from: http://www.google.com/url?q=http%3A%2F%2Fwww.nytimes.com...
        // to: http://www.nytimes.com...
        if (href && href.indexOf('?q=') > -1) {
          href = href.substr(href.indexOf('q=') + 2, href.indexOf('&') > - 1 ? href.indexOf('&') - 3 : undefined);
          href = decodeURIComponent(href);
        }

        let str: string = '<a href="' + href + '">';
        str += $(aTag).text(); // TODO //tagHandlers._base(aTag);
        str += '</a>';

        return str;
      },

      li: function (tag: string): string {
        return '* ' + tagHandlers._base(tag) + '\n';
      },
    };

    ['ul', 'ol'].forEach(function(tag: string): void {
      tagHandlers[tag] = tagHandlers.span;
    });

    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(tag: string): void {
      tagHandlers[tag] = tagHandlers.p;
    });

    // Now run each tag through each handler; return.
    return tagHandlers._base(root);
  };

  private _cleanGDoc(res: Cheerio): Cheerio {
    let root: Cheerio;
    if (this.options.staticExport) {
      root = res
              .not('meta')
              .not('style')
              .not('title');
    } else {
      root = res.filter('#contents')
        .children()
        .not('style'); // don't need no stylesheets hurr!
    }

    return root;
  };
}


interface IDoctopOptions {
  callback: any;
  url: string;
  preserveFormatting?: boolean;
  simpleKeys?: boolean;
  cache?: boolean;
  staticExport?: boolean;
  fancyOutput?: boolean;
  archieml?: boolean;
}

interface IDoctopTree {

}

interface IDoctopResponse {

}

interface IDoctopFancy {
  content: string;
  content_html: string;
  index: number;
  tag: string;
}
