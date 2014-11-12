# Doctop

A jQuery plugin for consuming Google Docs via JSON

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/times/jquery-doctop/master/dist/jquery.doctop.min.js
[max]: https://raw.github.com/times/jquery-doctop/master/dist/jquery.doctop.js

Create a Google Docs document, using the "Heading 1" format to denote sections of the document.
Publish it to the web via File->Publish to the web->Publish.

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/doctop.min.js"></script>
<script>
  $.doctop({
    url: 'https://docs.google.com/document/d/1_zs07o2m1BQisqWT5WEk_aC4TFl9nIZgufc9IYeL64Y/pub',
    callback: function(d){console.dir(d);},
  });
</script>
```

Returns:

```
{
  "copy": {
    "h1-1": [
      "This is a paragraph of text",
      "this is another paragraph",
      "h2-1",
      "this should be a child of h2-1, which should be a child of h1-1",
      "h3-1",
      "This should be a child of h3-1, which should be a child of h2-1"
    ],
    "h1-2": [
      "This should be a child of h1-2, which itself should be in the top level of the object.",
      "h3-2",
      "This should be a child of h3-2, which should be a child of h1-2"
    ],
    "h1-3": [
      "This should be a child of h1-3",
      "Another child of h1-3"
    ]
  }
}
```

## Documentation

### Options

#### url (required)

The full URL of a published Google Doc. In Google Docs, go "File->Publish to the Web->Publish"
to get this URL.

#### callback (required)

Asynchronous callback for the data. Takes one argument, the response, containing copy and any Tabletop data.
The `this` context is the contents of `response.copy`.

#### tabletop_url

If you have Tabletop.js included on the page, you can supply a published Google Sheets URL
in order to only need one callback. The Tabletop response will be in the "data" key of the returned object,
i.e, spreadsheet data in `data.data`, Tabletop object in `data.tabletop`.

#### returnJquery (default: `false`)

This returns non-H1 elements as jQuery objects instead of either HTML or text.

#### simpleKeys (default: `false`)

Instead of creating keys for the sections that are the slugified version of the H1 text,
return keys in the format `section_0` — this may be desirable if you have journalists
who enjoy arbitrarily changing the H1 text on you!

#### preserveFormatting (not implemented yet!)

This will attempt to preserve text formatting from Google Docs. It will yield messier
output because Google Docs loves to wrap everything under the sun in a `<span>` tag.
Defaults to `false`.

## Examples

_(Coming soon)_

## Roadmap/ToDos

+ Add the preserveFormatting option
+ Add support for other heading tags (h2-6)
+ Unit tests all up in hurr / up in hurr

## Release History

### 0.0.1 — initial release.
