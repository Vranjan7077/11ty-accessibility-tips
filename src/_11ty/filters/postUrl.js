module.exports = function postUrl(posts, title) {
    const post = posts.find((p) => p.data.title === title);
    return post ? post.url : '#';
};
