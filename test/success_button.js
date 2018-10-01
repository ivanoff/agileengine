'use strict';
var chai = require('chai');
var expect = chai.expect;

const Parser = require('../lib/parser');
let parser;

describe('Parser findSimilars', () => {

  const buttonId = 'test';
  const origin = './test/static/test0-origin.html';
  const pages = [
    './test/static/test1-simple.html'
  ];

  beforeEach(() => {
    parser = new Parser();
  })

  afterEach(() => {
    parser = undefined;
  })

  it('Has property with page name key', async () => {
    const result = await parser.findSimilars(buttonId, origin, [ pages[0] ]);
    expect(result).to.have.property(pages[0]);
  })

  it('Result is array of array', async () => {
    const result = await parser.findSimilars(buttonId, origin, [ pages[0] ]);
    expect(Array.isArray(result[pages[0]])).is.true;
    expect(Array.isArray(result[pages[0]][0])).is.true;
  })

  it('Is deep eql to expected object', async () => {
    const result = await parser.findSimilars(buttonId, origin, [ pages[0] ]);
    expect(result[pages[0]]).is.deep.eql( [ [ 'root[0]', 'html[3]', 'body[1]', 'div[1]', 'a' ] ] );
  })

})