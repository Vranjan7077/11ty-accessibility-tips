const htmlmin = require('html-minifier');

module.exports = function htmlMinTransform(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
        content = content.replace(/class="heading-anchor"/g, 'class="heading-anchor" tabindex="-1"');

        let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeOptionalTags: false,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeTagWhitespace: false,
        });
        return minified;
    }

    return content;
};
