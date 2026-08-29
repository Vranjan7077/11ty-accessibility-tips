const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

let markdown = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
};

const md = markdownIt(markdown).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
        placement: 'after',
        class: 'heading-anchor',
        safariReaderFix: true,
        symbol: '#',
        level: [2, 3],
    }),
});

const defaultImageRule =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    token.attrSet('loading', 'lazy');
    token.attrSet('decoding', 'async');
    return defaultImageRule(tokens, idx, options, env, self);
};

module.exports = md;
