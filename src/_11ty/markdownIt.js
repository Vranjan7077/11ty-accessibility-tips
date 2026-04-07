const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

let markdown = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
};

module.exports = markdownIt(markdown).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
        placement: 'after',
        class: 'heading-anchor',
        safariReaderFix: true,
        symbol: '#',
        level: [2, 3],
    }),
});
