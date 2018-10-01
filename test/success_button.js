'use strict';
var chai = require('chai');
var expect = chai.expect;

const Parser = require('../lib/parser');
let parser;

describe('Parser findSuccessButton', () => {

  const buttonId = 'test';
  const origin = './test/static/test0-origin.html';

  beforeEach(() => {
    parser = new Parser();
  })

  afterEach(() => {
    parser = undefined;
  })

  it('Empty parameters', async () => {
    const result = await parser.findSimilars(buttonId, origin, [ './test/static/test1-simple.html' ]);
    console.log(result)
  })

})