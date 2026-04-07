module.exports = function sortedByDate(collectionApi) {
    return collectionApi
        .getFilteredByTag('post')
        .sort(function (a, b) {
            return b.date - a.date;
        });
};
