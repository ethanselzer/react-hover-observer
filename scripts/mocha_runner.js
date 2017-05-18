var jsdom = require('jsdom');

const { JSDOM } = jsdom;
const { window } = new JSDOM();

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};

require('babel-core/register');
