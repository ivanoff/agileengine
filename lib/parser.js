'use strict';
var fs = require('fs');
var path = require('path');
const html2json = require('html2json').html2json;

module.exports = class Parser {

/**
 * Get filename, check if file exists. Return promisified json from html
 * @param {string} file - path to file
 * @return {Promise} resolve - json object
 * @return {Promise} reject - file not found or file read error
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
 * @param {object} obj - html file as json object
 * @param {function} checkFunction - function to check if obj is fits to request
 * @param {array} result - list of founded pathes
 * @param {array} path - tags path to object obj
 */
  deepSearch(obj, checkFunction, result, path = []) {
    if(!obj || !obj.child) return;
    const checked = checkFunction(obj, [...path, obj.tag])
    if(checked) result.push(checked);
    if(obj.child && obj.child.length) {
      for(let i=0; i<obj.child.length; i++) {
        const add = obj.child.length>1? `[${i}]` : '';
        this.deepSearch(obj.child[i], checkFunction, result, [...path, (obj.tag || obj.node) + add]);
      }
    }
  }

/**
 * Check functions
 * @return {function} - function to check
 * @param {object} obj - object to check
 * @param {object} result - result to return in case of success
 */

// Check function for origin button by button's id
  isOriginButton(id) {
    return (obj) => {
      return obj.attr && obj.attr.id == id && obj;
    }
  }

// Check for modifiyed button by origin object
  isSuccessButton(originObj) {
    return (obj, result) => {
      if(!obj.attr) return;
      const anyMatch = obj.attr.id == originObj.attr.id || obj.attr.href == originObj.attr.href;
      return anyMatch && result;
    }
  }

/**
 * Find id in origin html file, then return similar object from transformer files
 * @param {string} id - id of object in origin html file
 * @param {string} origin - path to origin html file
 * @param {array of string} tranformed - list of transformed html files
 * @return {Promise} resolve - array of addresses
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
