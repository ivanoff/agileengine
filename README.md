#Button searcher

Search similar button in transformed html document by origin button id

## Installation

Please check your Node.js version. The required version is `8.0.0` or greater

```
$ node -v
v8.12.0
```

`git clone https://github.com/ivanoff/agileengine.git`

`cd agileengine`

`npm install`

## Usage

```
node ${path.basename(__filename)} origin_button_id html_origin html_transformed [html_transformed...]
```

## Example

```
node ${path.basename(__filename)} make-everything-ok-button test/static/sample-0-origin.html test/static/sample-1-evil-gemini.html
```

## License

Licensed under [MIT License](LICENSE).


## Created by

Dimitry, 2@ivanoff.org.ua .$ curl -A cv ivanoff.org.ua
