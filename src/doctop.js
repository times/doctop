/*
 * Doctop — consume Google Docs over XHR
 *
 * Copyright (c) 2015 Ændrew Rininsland, The Times and Sunday Times
 * Licensed under the MIT license.
 */
"use strict";
/// <reference path="../node_modules/axios/axios.d.ts" />
var lodash_1 = require('lodash');
var axios_1 = require('axios');
// import {Promise} from 'es6-promise';
// import * as cheerio from 'cheerio';
// import * as archieml from 'archieml';
var default_1 = (function () {
    function default_1(options) {
        this.options = {
            archieml: true,
            cache: false,
            callback: function () { console.log('You forgot to specify a callback.'); },
            preserveFormatting: true,
            simpleKeys: false,
            staticExport: false,
            url: undefined,
        };
        this.options = lodash_1.merge(this.options, options);
        console.dir(this.options);
        axios_1.get(options.url).then(function (res) {
            console.log(res);
            // this.parsed = cheerio.load(res.data);
            // this.root = this.cleanGoogleDocHTML(this.parsed);
            // this.tree = this.parseDOMIntoTree(this.root);
            //
            // let archie: any;
            //
            // if (this.options.archieml && typeof archieml === 'object') {
            //   archie = this._parseArchieML(this._cleanGDoc(res));
            //
            //   // remove smart quotes from inside tags
            //   archie = archie.replace(/<[^<>]*>/g, function(match: string): string {
            //     return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
            //   });
            //
            //   this.tree.archie = archieml.load(archie);
            // }
            //
            // this._doCallbacks(this.tree);
        })
            .catch(function (res) {
            console.log(res);
        });
    }
    return default_1;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
