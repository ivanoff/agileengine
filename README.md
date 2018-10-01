# Button searcher

Search similar button in transformed html document by origin button id

## Before starting

Please check your Node.js version. The required version is `8.0.0` or greater

```
$ node -v
v8.12.0
```

## Installation

`git clone https://github.com/ivanoff/agileengine.git`

`cd agileengine`

`npm install`


## Testing (optional)

```
npm test
```

## Usage

```
node find_button.js origin_button_id html_origin html_transformed [html_transformed...]
```

## Example

```
node find_button.js make-everything-ok-button test/static/sample-0-origin.html test/static/sample-1-evil-gemini.html
```

Output result:

```
Try to find make-everything-ok-button id in origin test/static/sample-0-origin.html and similars in test/static/sample-1-evil-gemini.html 
Result:
test/static/sample-1-evil-gemini.html: root[0] > html[3] > body[1] > div[5] > div[9] > div[1] > div[1] > div[5] > div[1] > a
```

## License

Licensed under [MIT License](LICENSE).


## Created by

Dimitry, 2@ivanoff.org.ua .$ curl -A cv ivanoff.org.ua
