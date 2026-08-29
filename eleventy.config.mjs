import fg from 'fast-glob';
import path from 'node:path';
import { createRequire } from 'node:module';
import pluginRss from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import EleventyNavigationPlugin from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

const require = createRequire(import.meta.url);
const markdown = require('./src/_11ty/markdownIt');

const configDir = './src/_11ty';
const isServe = process.env.ELEVENTY_RUN_MODE === 'serve';

function registerFromGlob(globPattern, register, loader = require) {
    fg.sync(globPattern).forEach((filePath) => {
        register(path.parse(filePath).name, loader('./' + filePath));
    });
}

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(EleventyNavigationPlugin);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        widths: [400, 800, 1200, 'auto'],
        formats: ['avif', 'webp', 'jpeg'],
        outputDir: './public/assets/img/optimized/',
        urlPath: '/assets/img/optimized/',
        htmlOptions: {
            imgAttributes: {
                loading: 'lazy',
                decoding: 'async',
                sizes: '(min-width: 48rem) 48rem, 100vw',
            },
        },
    });

    eleventyConfig.setLibrary('md', markdown);

    registerFromGlob(`${configDir}/collections/[^_]*.js`, eleventyConfig.addCollection.bind(eleventyConfig));
    registerFromGlob(`${configDir}/filters/[^_]*.js`, eleventyConfig.addFilter.bind(eleventyConfig));
    registerFromGlob(`${configDir}/shortcodes/[^_]*.js`, eleventyConfig.addShortcode.bind(eleventyConfig));
    registerFromGlob(`${configDir}/transforms/[^_]*.js`, eleventyConfig.addTransform.bind(eleventyConfig));

    eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

    eleventyConfig.addPassthroughCopy({ './src/assets': 'assets' });
    eleventyConfig.addPassthroughCopy({ './src/css/main.css': 'assets/css/main.css' });
    eleventyConfig.addWatchTarget('./src/_includes/sass');
    eleventyConfig.addWatchTarget('./src/css');

    eleventyConfig.setServerOptions({
        port: 3000,
        liveReload: true,
        domDiff: true,
    });

    if (isServe) {
        eleventyConfig.addTransform('prettier', async function (content) {
            if ((this.page.outputPath || '').endsWith('.html')) {
                const { default: prettier } = await import('prettier');
                return prettier.format(content, {
                    parser: 'html',
                    printWidth: 512,
                    tabWidth: 2,
                    bracketSameLine: true,
                });
            }
            return content;
        });
    }

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
    };
}
