'use strict';
var fs = require('fs');
var path = require('path');
const html2json = require('html2json').html2json;

module.exports = class Parser {

/**
 * Get filename, check if file exists. Return promisified json from html
 */
  async getHtmlFileAsObj(file) {
    const fullPath = file.match(/^\//) ? file :  path.join(__dirname, '../', file );
    return new Promise((resolve, reject) => {
      fs.exists(fullPath, exists => {
        if(!exists) return reject('file not found');
        fs.readFile(fullPath,(err, data) => err? reject(err) : resolve(html2json(data.toString())));
      });
    });
  }

/**
 * Deeply checks if checkFunction has passed, then obj has necessary data and this data added to result array
 */
  deepSearch(obj, checkFunction, result, path = []) {
    if(!obj || !obj.child) return;
    const checked = checkFunction(obj, [...path, obj.tag])
    if(checked) result.push(checked);
    if(obj.child && obj.child.length) {
      for(let i=0; i<obj.child.length; i++) {
        const add = obj.child.length>1? `[${i}]` : '';
        this.deepSearch(obj.child[i], checkFunction, result, [...path, obj.tag + add]);
      }
    }
  }

// Check for origin button
  isOriginButton(id) {
    return (obj) => {
      return obj.attr && obj.attr.id == id && obj;
    }
  }

// Check for modifiyed button
  isSuccessButton(originObj) {
    return (obj, result) => {
      if(!obj.attr) return;
      const anyMatch = obj.attr.id == originObj.attr.id || obj.attr.href == originObj.attr.href;
      return anyMatch && result;
    }
  }

/**
 * Find id in origin html file, then return similar object from transformer files
 */
  async findSimilars(id, origin, transformed) {
    this.originId = id;
    let resultOrigin = [];
    let result = {};

    const pageDataOrigin = await this.getHtmlFileAsObj(origin);
    this.deepSearch(pageDataOrigin, this.isOriginButton(id), resultOrigin);
    if(!resultOrigin.length) throw(new Error(`${id} not found in ${origin}`))

    for(let page of transformed) {
      try{
        const pageData = await this.getHtmlFileAsObj(page);
        if(pageData) {
          result[page] = [];
          this.deepSearch(pageData, this.isSuccessButton(resultOrigin[0]), result[page]);
        } else {
          result[page] = ['file not found'];
        }
      }
      catch(err) {
        result[page] = [err];
      }
    }

    return result;
  }

}
