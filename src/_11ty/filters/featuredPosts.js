const FEATURED_TYPES = ['guide', 'pattern', 'checklist'];

module.exports = function featuredPosts(posts, limit = 4) {
    if (!posts) return [];
    return posts.filter((post) => FEATURED_TYPES.includes(post.data.type)).slice(0, limit);
};
