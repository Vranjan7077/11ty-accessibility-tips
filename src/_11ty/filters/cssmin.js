const cleanCSS = require('clean-css');

module.exports = function cssmin(code) {
    return new cleanCSS({}).minify(code).styles;
};
