module.exports = function sortedByDate(collectionApi) {
    return collectionApi
        .getFilteredByTag('post')
        .filter(function (post) {
            return post.data.type !== 'resource';
        })
        .sort(function (a, b) {
            return b.date - a.date;
        });
};
