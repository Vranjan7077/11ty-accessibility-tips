module.exports = function sortedByTitle(collectionApi) {
    return collectionApi
        .getFilteredByTag('post')
        .sort(function (a, b) {
            return a.data.title.localeCompare(b.data.title);
        });
};
