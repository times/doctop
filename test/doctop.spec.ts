import Doctop from '../src/doctop.ts';
import * as chai from 'chai';

let should: Chai.Should = chai.should();

/* tslint:disable:no-unused-expression */
describe('doctop', () => {
  describe('basic operation', () => {
    it('should be able to grab a document with no other arguments', (done: MochaDone) => {
      new Doctop({
        callback: (data: any): void => {
          console.log(data);
          should.exist(data);
          done();
        },
        url: 'https://docs.google.com/document/d/148QB7J1Sn6OgK0pXLdwanNX4kVq5lytmeRptxxWrjkc/pub',
      });
    });
  });
});

// (function($) {
//   /*
//     ======== A Handy Little QUnit Reference ========
//     http://api.qunitjs.com/
//
//     Test methods:
//       module(name, {[setup][ ,teardown]})
//       test(name, callback)
//       expect(numberOfAssertions)
//       stop(increment)
//       start(decrement)
//     Test assertions:
//       ok(value, [message])
//       equal(actual, expected, [message])
//       notEqual(actual, expected, [message])
//       deepEqual(actual, expected, [message])
//       notDeepEqual(actual, expected, [message])
//       strictEqual(actual, expected, [message])
//       notStrictEqual(actual, expected, [message])
//       throws(block, [expected], [message])
//   */
//
//   module('jQuery.doctop');
//
//   test('parses correctly with fancy output', function(assert) {
//     var data = $.Deferred();
//     var done = assert.async();
//
//     $.doctop({
//       url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
//       callback: function(d) {
//         data.resolve(d);
//       },
//       preserveFormatting: false,
//       fancyOutput: true
//     });
//
//     data.then(function(d){
//       expect(9);
//
//       var topLevel = Object.keys(d.copy);
//
//       assert.strictEqual(topLevel.length, 3, 'Should be three top-level elements.');
//       assert.strictEqual(d.copy['h1-1'].children['p_0'].content, 'This is a paragraph of text', 'Should read: "This is a paragraph of text"');
//       assert.strictEqual(d.copy['h1-1'].children['p_1'].content, 'this is another paragraph', 'Should read: "this is another paragraph"');
//       assert.strictEqual(d.copy['h1-1'].children['h2-1'].children['p_0'].content, 'this should be a child of h2-1, which should be a child of h1-1', 'Should read: "this should be a child of h2-1, which should be a child of h1-1"');
//       assert.strictEqual(d.copy['h1-1'].children['h2-1'].children['h3-1'].children['p_0'].content, 'This should be a child of h3-1, which should be a child of h2-1', 'Should read: "This should be a child of h3-1, which should be a child of h2-1"');
//       assert.strictEqual(d.copy['h1-2'].children['p_0'].content, 'This should be a child of h1-2, which itself should be in the top level of the object.', 'Should read: "This should be a child of h1-2, which itself should be in the top level of the object."');
//       assert.strictEqual(d.copy['h1-2'].children['h3-2'].children['p_0'].content, 'This should be a child of h3-2, which should be a child of h1-2', 'Should read: "This should be a child of h3-2, which should be a child of h1-2"');
//       assert.strictEqual(d.copy['h1-3'].children['p_0'].content, 'This should be a child of h1-3', 'Should read: "This should be a child of h1-3"');
//       assert.strictEqual(d.copy['h1-3'].children['p_1'].content, 'Anothre child of h1-3', 'Should read: "Anothre child of h1-3"');
//
//       done();
//     });
//   });
//
//   test('parses correctly without preserveFormatting (not-so-fancy output)', function(assert) {
//     var data = $.Deferred();
//     var done = assert.async();
//
//     $.doctop({
//       url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
//       callback: function(d) {
//         data.resolve(d);
//       },
//       preserveFormatting: false,
//       fancyOutput: false
//     });
//
//     data.then(function(d){
//       expect(9);
//
//       var topLevel = Object.keys(d.copy);
//
//       assert.strictEqual(topLevel.length, 3, 'Should be three top-level elements.');
//       assert.strictEqual(d.copy['h1-1']['p_0'], 'This is a paragraph of text', 'Should read: "This is a paragraph of text"');
//       assert.strictEqual(d.copy['h1-1']['p_1'], 'this is another paragraph', 'Should read: "this is another paragraph"');
//       assert.strictEqual(d.copy['h1-1']['h2-1']['p_0'], 'this should be a child of h2-1, which should be a child of h1-1', 'Should read: "this should be a child of h2-1, which should be a child of h1-1"');
//       assert.strictEqual(d.copy['h1-1']['h2-1']['h3-1']['p_0'], 'This should be a child of h3-1, which should be a child of h2-1', 'Should read: "This should be a child of h3-1, which should be a child of h2-1"');
//       assert.strictEqual(d.copy['h1-2']['p_0'], 'This should be a child of h1-2, which itself should be in the top level of the object.', 'Should read: "This should be a child of h1-2, which itself should be in the top level of the object."');
//       assert.strictEqual(d.copy['h1-2']['h3-2']['p_0'], 'This should be a child of h3-2, which should be a child of h1-2', 'Should read: "This should be a child of h3-2, which should be a child of h1-2"');
//       assert.strictEqual(d.copy['h1-3']['p_0'], 'This should be a child of h1-3', 'Should read: "This should be a child of h1-3"');
//       assert.strictEqual(d.copy['h1-3']['p_1'], 'Anothre child of h1-3', 'Should read: "Anothre child of h1-3"');
//
//       done();
//     });
//   });
//
//   test('parses correctly with preserveFormatting (not-so-fancy output)', function(assert) {
//     var data = $.Deferred();
//     var done = assert.async();
//
//     $.doctop({
//       url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
//       callback: function(d) {
//         data.resolve(d);
//       },
//       preserveFormatting: true
//     });
//
//     data.then(function(d){
//       expect(9);
//
//       var topLevel = Object.keys(d.copy);
//
//       assert.strictEqual(topLevel.length, 3, 'Should be three top-level elements.');
//       assert.strictEqual(d.copy['h1-1']['p_0'], 'This is a paragraph of text', 'Should read: "This is a paragraph of text"');
//       assert.strictEqual(d.copy['h1-1']['p_1'], 'this is another paragraph', 'Should read: "this is another paragraph"');
//       assert.strictEqual(d.copy['h1-1']['h2-1']['p_0'], 'this should be a child of h2-1, which should be a child of h1-1', 'Should read: "this should be a child of h2-1, which should be a child of h1-1"');
//       assert.strictEqual(d.copy['h1-1']['h2-1']['h3-1']['p_0'], 'This should be a <em>child</em> of h3-1, which should be a <em>child</em> of h2-1', 'Should read: "This should be a <em>child</em> of h3-1, which should be a <em>child</em> of h2-1"');
//       assert.strictEqual(d.copy['h1-2']['p_0'], 'This should be a <em>child</em> of h1-2, which itself should be in the <strong>top level</strong> of the object.', 'Should read: "This should be a <em>child</em> of h1-2, which itself should be in the <strong>top level</strong> of the object."');
//       assert.strictEqual(d.copy['h1-2']['h3-2']['p_0'], 'This should be a child of h3-2, which should be a child of h1-2', 'Should read: "This should be a child of h3-2, which should be a child of h1-2"');
//       assert.strictEqual(d.copy['h1-3']['p_0'], 'This should be a child of h1-3', 'Should read: "This should be a child of h1-3"');
//       assert.strictEqual(d.copy['h1-3']['p_1'], 'Anothre child of h1-3', 'Should read: "Anothre child of h1-3"');
//
//       done();
//     });
//   });
//
//
//   test('can get Tabletop data correctly (fancy output)', function(assert){
//     var data = $.Deferred();
//     var done = assert.async();
//
//     $.doctop({
//       url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
//       tabletop_url: 'https://docs.google.com/spreadsheets/d/1u5u9VhFKIDItumQrOsqW01d2htQGfJrlyuzONolSDcM/pubhtml',
//       callback: function(d) {
//         data.resolve(d);
//       },
//       fancyOutput: true
//     });
//
//     data.then(function(d){
//       expect(3);
//       assert.strictEqual(typeof d.data, 'object', 'There should be a data object.');
//       assert.strictEqual(typeof d.data.data, 'object', 'There should be a Tabletop data object.');
//       assert.strictEqual(typeof d.data.tabletop, 'object', 'There should be a Tabletop object.');
//
//       done();
//     });
//   });
//
//   test('it preserves hierarchy', function(assert) { // Thanks to @radiocontrolled for the test case document.
//     var data = $.Deferred();
//     var done = assert.async();
//
//     $.doctop({
//       url: 'https://docs.google.com/document/d/1VEd8vih-KgNgYTSj8ueCejsC83DPO764Dzmj1PRBsuk/pub',
//       callback: function(d) {
//         data.resolve(d);
//       },
//       preserveFormatting: true,
//       fancyOutput: false
//     });
//
//     data.then(function(d){
//       expect(3);
//       assert.strictEqual(typeof d.copy['Title of the piece'], 'object', 'Should be one top-level element.');
//       assert.strictEqual(Object.keys(d.copy['Title of the piece']).length, 6, 'Should be six second-level elements.');
//       assert.notStrictEqual(d.copy['Title of the piece']['One']['p_0'].match(/<span style="overflow: hidden; display: inline-block; margin: 0\.00px 0\.00px; border: 0\.00px solid #000000; transform: rotate\(0\.00rad\) translateZ\(0px\); -webkit-transform: rotate\(0\.00rad\) translateZ\(0px\); width: 200\.00px; height: 200\.00px;"><img alt="200x200\.gif" src=".*?" style="width: 200\.00px; height: 200\.00px; margin-left: 0\.00px; margin-top: 0\.00px; transform: rotate\(0\.00rad\) translateZ\(0px\); -webkit-transform: rotate\(0\.00rad\) translateZ\(0px\);" title=""><\/span>/), null, 'There should be a PNG.');
//
//       done();
//     });
//   });
//
//   test('it can navigate complex hierarchies', function(assert) {
//     var data = $.Deferred();
//     var done = assert.async();
//
//     $.doctop({
//       url: 'https://docs.google.com/document/d/148QB7J1Sn6OgK0pXLdwanNX4kVq5lytmeRptxxWrjkc/pub',
//       callback: function(d) {
//         data.resolve(d);
//       },
//       preserveFormatting: true,
//       fancyOutput: false
//     });
//
//     data.then(function(d){
//       expect(10);
//       assert.strictEqual(Object.keys(d.copy).length, 2, 'Should be two first-level elements.');
//       assert.strictEqual(Object.keys(d.copy['Top Level']).length, 3, 'There should be three second level items in the first top-level element.');
//       assert.strictEqual(typeof d.copy['Top Level']['Second Level_0'], 'object', 'There should be an enumerated second level object in the first top-level element.');
//       assert.strictEqual(typeof d.copy['Top Level']['Second Level_0']['Third Level'], 'object', 'There should be a third level object in the second second-level object of the first top-level object.');
//       assert.strictEqual(typeof d.copy['Top Level']['Second Level_0']['Third Level']['Fourth Level'], 'object', 'There should be a fourth-level object in the third level object in the second second-level object of the first top-level object.');
//       assert.strictEqual(typeof d.copy['Top Level']['Second Level']['p_0'], 'string', 'There should be a paragraph in the first second-level object of the first top-level object.');
//
//       assert.strictEqual(Object.keys(d.copy['Top Level_0']).length, 2, 'There should be two second level items in the second top-level element.');
//       assert.strictEqual(typeof d.copy['Top Level_0']['Second Level'], 'object', 'There should be a second level item in the second top-level element.');
//       assert.strictEqual(typeof d.copy['Top Level_0']['Second Level']['Fourth Level'], 'object', 'There should be a fourth-level item in the second-level object in second top-level element.');
//       assert.strictEqual(typeof d.copy['Top Level_0']['Third Level'], 'object', 'There should be a third level item in the second top-level element.');
//
//       done();
//     });
//   });
//
//   // ArchieML tests
//   if (typeof window.archieml === 'object') {
//     test('it can parse ArchieML', function(assert) {
//       var data = $.Deferred();
//       var done = assert.async();
//
//       $.doctop({
//         url: 'https://docs.google.com/document/d/1KmBlq8ulcDgvfieTjEG1KGq16tadT8-nKVt3MF0wOP0/pub',
//         callback: function(d) {
//           data.resolve(d);
//         },
//         archieml: true
//       });
//
//       data.then(function(d){
//         expect(10);
//         assert.strictEqual(d.copy.archie.array.length, 2, 'Should be two elements in "array".');
//         assert.strictEqual(d.copy.archie['google-link'], 'This is a <a href="http://www.nytimes.com">link</a>.', 'Links should parse properly.');
//         assert.strictEqual(d.copy.archie['heading1'], 'Heading 1', 'Headings should parse properly.');
//         assert.strictEqual(d.copy.archie['heading2'], 'Heading 2', 'Headings should parse properly.');
//         assert.strictEqual(d.copy.archie['heading3'], 'Heading 3', 'Headings should parse properly.');
//         assert.strictEqual(d.copy.archie['heading4'], 'Heading 4', 'Headings should parse properly.');
//         assert.strictEqual(d.copy.archie['heading5'], 'Heading 5', 'Headings should parse properly.');
//         assert.strictEqual(d.copy.archie['heading6'], 'Heading 6', 'Headings should parse properly.');
//         assert.strictEqual(d.copy.archie['heading-link'], '<a href="#h.rinwzq4psmlj">Link to heading 1</a>', 'Heading links should parse as text.');
//         assert.strictEqual(d.copy.archie['smart-quotes'], '<a href="http://www.nytimes.com">nytimes.com</a>', 'Smart quotes should be removed.');
//         done();
//       });
//     });
//   }
// }(jQuery));
/* tslint:enable:no-unused-expression */
