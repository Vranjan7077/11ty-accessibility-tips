const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');
const markdown = require('./src/_11ty/markdownIt');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const NOT_FOUND_PATH = 'public/404.html';

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.setLibrary('md', markdown);

    fg.sync('./src/_11ty/transforms/[^_]*.js').forEach((transformFile) => {
        eleventyConfig.addTransform(path.parse(transformFile).name, require(transformFile));
    });

    fg.sync('./src/_11ty/collections/[^_]*.js').forEach((CollectionFile) => {
        eleventyConfig.addCollection(path.parse(CollectionFile).name, require(CollectionFile));
    });

    fg.sync('./src/_11ty/shortcodes/[^_]*.js').forEach((shortcodeFile) => {
        eleventyConfig.addShortcode(path.parse(shortcodeFile).name, require(shortcodeFile));
    });

    fg.sync('./src/_11ty/filters/[^_]*.js').forEach((filterFile) => {
        eleventyConfig.addFilter(path.parse(filterFile).name, require(filterFile));
    });

    eleventyConfig.addPassthroughCopy({ './src/assets': 'assets' });
    eleventyConfig.addWatchTarget('./src/_includes/sass');
    eleventyConfig.setDataDeepMerge(true);

    eleventyConfig.setBrowserSyncConfig({
        files: ['public/**/*'],
        port: 3000,
        open: true,
    });
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, bs) {
                bs.addMiddleware('*', (req, res) => {
                    if (!fs.existsSync(NOT_FOUND_PATH)) {
                        throw new Error(
                            `Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`
                        );
                    }

                    const content_404 = fs.readFileSync(NOT_FOUND_PATH);
                    // Add 404 http status code in request header.
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            },
        },
    });
    return {
        dir: {
            input: 'src',
            output: 'public',
            data: '_data',
            includes: '_includes',
        },
        pathPrefix: '/',
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        templateFormats: ['md', 'njk'],
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
    };
};
