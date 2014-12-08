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

  test('parses correctly', function(assert) {
    var data = $.Deferred();
    var done = assert.async();

    $.doctop({
      url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
      callback: function(d) {
        data.resolve(d);
      }
    });

    data.then(function(d){
      expect(4);
      // console.dir(d);
      var topLevel = Object.keys(d.copy);
      assert.strictEqual(topLevel.length, 3, 'Should be three top-level elements.');

      assert.strictEqual(d.copy['h1-1'].length, 6, 'First section should have 6 children.');
      assert.strictEqual(d.copy['h1-2'].length, 3, 'Second section should have 3 children.');
      assert.strictEqual(d.copy['h1-3'].length, 2, 'Third section should have 2 children.');

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
      expect(3);
      assert.strictEqual(typeof d.data, 'object', 'There should be a data object.');
      assert.strictEqual(typeof d.data.data, 'object', 'There should be a Tabletop data object.');
      assert.strictEqual(typeof d.data.tabletop, 'object', 'There should be a Tabletop object.');
      done();
    });
  });
}(jQuery));
