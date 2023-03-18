module.exports = function sortedByDate(collectionApi) {
    return collectionApi
        .getAll()
        .filter(function (item) {
            let extension = item.inputPath.split('.').pop();
            return extension === 'md';
        })
        .sort(function (a, b) {
            return a.data.date - b.data.date;
        });
};
