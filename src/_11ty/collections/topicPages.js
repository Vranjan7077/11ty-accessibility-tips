const PAGE_SIZE = 6;

function slugify(topic) {
    return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function urlFor(slug, pageIndex) {
    return pageIndex === 0 ? '/topics/' + slug + '/' : '/topics/' + slug + '/' + pageIndex + '/';
}

module.exports = function topicPages(collectionApi) {
    const posts = collectionApi.getFilteredByTag('post').filter(function (post) {
        return post.data.type !== 'resource' && post.data.topicsList && post.data.topicsList.length;
    });

    const bySlug = {};
    posts.forEach(function (post) {
        post.data.topicsList.forEach(function (topic) {
            const slug = slugify(topic);
            if (!bySlug[slug]) bySlug[slug] = { labelCounts: {}, posts: [] };
            bySlug[slug].posts.push(post);
            bySlug[slug].labelCounts[topic] = (bySlug[slug].labelCounts[topic] || 0) + 1;
        });
    });

    const pages = [];

    Object.keys(bySlug)
        .sort()
        .forEach(function (slug) {
            const group = bySlug[slug];
            const label = Object.keys(group.labelCounts).sort(function (a, b) {
                return group.labelCounts[b] - group.labelCounts[a] || a.localeCompare(b);
            })[0];
            const topicPosts = group.posts.sort(function (a, b) {
                return a.data.title.localeCompare(b.data.title);
            });
            const totalPages = Math.max(1, Math.ceil(topicPosts.length / PAGE_SIZE));

            for (let i = 0; i < totalPages; i++) {
                pages.push({
                    topic: label,
                    pageNumber: i,
                    pageSize: PAGE_SIZE,
                    totalPages: totalPages,
                    totalItems: topicPosts.length,
                    posts: topicPosts.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
                    url: urlFor(slug, i),
                    prevUrl: i > 0 ? urlFor(slug, i - 1) : null,
                    nextUrl: i < totalPages - 1 ? urlFor(slug, i + 1) : null,
                });
            }
        });

    return pages;
};
