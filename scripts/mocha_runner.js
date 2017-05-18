var jsdom = require('jsdom');

const { JSDOM } = jsdom;
const { window } = new JSDOM();

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};

process.env.BABEL_ENV = 'cjs';
require('babel-core/register');
