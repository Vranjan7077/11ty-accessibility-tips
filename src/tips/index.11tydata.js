module.exports = {
    eleventyComputed: {
        eleventyNavigation: function (data) {
            if (data.pagination && data.pagination.pageNumber > 0) {
                return undefined;
            }
            return { key: 'Tips', title: 'Tips', order: 2 };
        },
    },
};
