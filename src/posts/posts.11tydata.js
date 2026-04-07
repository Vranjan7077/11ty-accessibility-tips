module.exports = {
    layout: 'layouts/partials/post.njk',
    permalink: '/{{ title | slug }}/index.html',
    author: 'Anonymous',
    tags: ['post'],
    eleventyComputed: {
        eleventyNavigation: (data) => ({
            key: data.title,
            title: data.title,
            parent: 'Tips',
            excerpt: data.description,
        }),
    },
};
