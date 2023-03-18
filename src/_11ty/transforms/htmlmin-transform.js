const htmlmin = require('html-minifier');

module.exports = function htmlMinTransform(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeTagWhitespace: true,
        });
        return minified;
    }

    return content;
};
