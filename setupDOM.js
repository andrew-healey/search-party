require("@babel/register")();
const {JSDOM} = require('jsdom');
const window = (new JSDOM('')).window;
global.document = window.document;
global.window=window;
global.navigator = { userAgent: 'node.js' };
