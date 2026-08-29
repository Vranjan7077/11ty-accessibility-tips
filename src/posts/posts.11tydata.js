function slugify(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

module.exports = {
    layout: 'layouts/partials/post.njk',
    author: 'Anonymous',
    tags: ['post'],
    eleventyComputed: {
        permalink: (data) => {
            if (data.type === 'resource' || !data.topicsList || !data.topicsList.length) {
                return `/${slugify(data.title)}/index.html`;
            }
            return `/topics/${slugify(data.topicsList[0])}/${slugify(data.title)}/index.html`;
        },
        topicsList: (data) => {
            if (Array.isArray(data.topics)) return data.topics.filter(Boolean);
            if (typeof data.topics === 'string' && data.topics.trim()) return [data.topics.trim()];
            return [];
        },
        type: (data) => {
            if (data.type) return data.type;
            const topics = Array.isArray(data.topics) ? data.topics : [data.topics];
            return topics.includes('Blog') ? 'resource' : 'tip';
        },
        eleventyNavigation: (data) => {
            const primaryTopic = data.topicsList && data.topicsList.length ? data.topicsList[0] : null;
            return {
                key: data.title,
                title: data.title,
                parent: data.type === 'resource' ? 'Resources' : primaryTopic || 'Tips',
                excerpt: data.description,
            };
        },
    },
};
