module.exports = function sortedByTitle(collectionApi) {
    return collectionApi
        .getFilteredByTag('post')
        .filter(function (post) {
            return post.data.type !== 'resource';
        })
        .sort(function (a, b) {
            return a.data.title.localeCompare(b.data.title);
        });
};
