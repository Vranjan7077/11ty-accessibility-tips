module.exports = {
    eleventyComputed: {
        eleventyNavigation: function (data) {
            if (data.pagination && data.pagination.pageNumber > 0) {
                return undefined;
            }
            return { key: 'Resources', title: 'Resources', order: 5 };
        },
    },
};
