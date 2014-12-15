(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery.doctop');

  test('parses correctly without preserveFormatting', function(assert) {
    var data = $.Deferred();
    var done = assert.async();

    $.doctop({
      url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
      callback: function(d) {
        data.resolve(d);
      },
      preserveFormatting: false
    });

    data.then(function(d){
      expect(9);

      var topLevel = Object.keys(d.copy);

      assert.strictEqual(topLevel.length, 3, 'Should be three top-level elements.');
      assert.strictEqual(d.copy['h1-1'].children['p_0'].content, 'This is a paragraph of text', 'Should read: "This is a paragraph of text"');
      assert.strictEqual(d.copy['h1-1'].children['p_1'].content, 'this is another paragraph', 'Should read: "this is another paragraph"');
      assert.strictEqual(d.copy['h1-1'].children['h2-1'].children['p_0'].content, 'this should be a child of h2-1, which should be a child of h1-1', 'Should read: "this should be a child of h2-1, which should be a child of h1-1"');
      assert.strictEqual(d.copy['h1-1'].children['h2-1'].children['h3-1'].children['p_0'].content, 'This should be a child of h3-1, which should be a child of h2-1', 'Should read: "This should be a child of h3-1, which should be a child of h2-1"');
      assert.strictEqual(d.copy['h1-2'].children['p_0'].content, 'This should be a child of h1-2, which itself should be in the top level of the object.', 'Should read: "This should be a child of h1-2, which itself should be in the top level of the object."');
      assert.strictEqual(d.copy['h1-2'].children['h3-2'].children['p_0'].content, 'This should be a child of h3-2, which should be a child of h1-2', 'Should read: "This should be a child of h3-2, which should be a child of h1-2"');
      assert.strictEqual(d.copy['h1-3'].children['p_0'].content, 'This should be a child of h1-3', 'Should read: "This should be a child of h1-3"');
      assert.strictEqual(d.copy['h1-3'].children['p_1'].content, 'Anothre child of h1-3', 'Should read: "Anothre child of h1-3"');

      done();
    });
  });

  test('parses correctly with preserveFormatting', function(assert) {
    var data = $.Deferred();
    var done = assert.async();

    $.doctop({
      url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
      callback: function(d) {
        data.resolve(d);
      },
      preserveFormatting: true
    });

    data.then(function(d){
      expect(9);

      var topLevel = Object.keys(d.copy);

      assert.strictEqual(topLevel.length, 3, 'Should be three top-level elements.');
      assert.strictEqual(d.copy['h1-1'].children['p_0'].content, 'This is a paragraph of text', 'Should read: "This is a paragraph of text"');
      assert.strictEqual(d.copy['h1-1'].children['p_1'].content, 'this is another paragraph', 'Should read: "this is another paragraph"');
      assert.strictEqual(d.copy['h1-1'].children['h2-1'].children['p_0'].content, 'this should be a child of h2-1, which should be a child of h1-1', 'Should read: "this should be a child of h2-1, which should be a child of h1-1"');
      assert.strictEqual(d.copy['h1-1'].children['h2-1'].children['h3-1'].children['p_0'].content_html, 'This should be a <em>child</em> of h3-1, which should be a <em>child</em> of h2-1', 'Should read: "This should be a <em>child</em> of h3-1, which should be a <em>child</em> of h2-1"');
      assert.strictEqual(d.copy['h1-2'].children['p_0'].content_html, 'This should be a <em>child</em> of h1-2, which itself should be in the <strong>top level</strong> of the object.', 'Should read: "This should be a <em>child</em> of h1-2, which itself should be in the <strong>top level</strong> of the object."');
      assert.strictEqual(d.copy['h1-2'].children['h3-2'].children['p_0'].content, 'This should be a child of h3-2, which should be a child of h1-2', 'Should read: "This should be a child of h3-2, which should be a child of h1-2"');
      assert.strictEqual(d.copy['h1-3'].children['p_0'].content, 'This should be a child of h1-3', 'Should read: "This should be a child of h1-3"');
      assert.strictEqual(d.copy['h1-3'].children['p_1'].content, 'Anothre child of h1-3', 'Should read: "Anothre child of h1-3"');

      done();
    });
  });


  test('can get Tabletop data correctly', function(assert){
    var data = $.Deferred();
    var done = assert.async();

    $.doctop({
      url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
      tabletop_url: 'https://docs.google.com/spreadsheets/d/1u5u9VhFKIDItumQrOsqW01d2htQGfJrlyuzONolSDcM/pubhtml',
      callback: function(d) {
        data.resolve(d);
      }
    });

    data.then(function(d){
      console.log(d);
      expect(3);
      assert.strictEqual(typeof d.data, 'object', 'There should be a data object.');
      assert.strictEqual(typeof d.data.data, 'object', 'There should be a Tabletop data object.');
      assert.strictEqual(typeof d.data.tabletop, 'object', 'There should be a Tabletop object.');
      done();
    });
  });
}(jQuery));
