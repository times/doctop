# Doctop

A jQuery plugin for consuming Google Docs via JSON

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/times/jquery-doctop/master/dist/jquery.doctop.min.js
[max]: https://raw.github.com/times/jquery-doctop/master/dist/jquery.doctop.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/doctop.min.js"></script>
<script>
  $.doctop({
    url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
    callback: function(d){console.dir(d);}
  });
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
