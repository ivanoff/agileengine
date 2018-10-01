'use strict';
var path = require('path');
const Parser = require('./lib/parser');
const parser = new Parser();

const argv = process.argv;
const buttonId = argv[2];
const origin = argv[3];
const pages = argv.slice(4);

// show help if no pages or first parameter is --help
if(pages.length < 1 || pages[0].match(/^-{0,2}h(elp)?$/)) {
  help();
}

(async () => {
  console.log(`Try to find ${buttonId} id in origin ${origin} and similars in ${pages.join(', ')} `)
  try {
    const result = await parser.findSimilars(buttonId, origin, pages);
    console.log('Result:');
    for(let page in result) {
      const p = result[page];
      for(let i=0; i<p.length; i++) {
        console.log(`${page}: ${p[i].join(' > ')}`);
      }
    }
  } catch(err) {
    console.log(err);
  }
})();

function help() {
  console.log(`Button searcher
Search similar button in transformed html document by origin button id

Usage:
  node ${path.basename(__filename)} origin_button_id html_origin html_transformed [html_transformed...]

Example:
  node ${path.basename(__filename)} make-everything-ok-button test/static/sample-0-origin.html test/static/sample-1-evil-gemini.html
  `);
  process.exit(0);
}
