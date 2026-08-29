module.exports = {
    eleventyComputed: {
        eleventyNavigation: (data) => {
            if (!data.topicPage || data.topicPage.pageNumber > 0) return undefined;
            return {
                key: data.topicPage.topic,
                title: data.topicPage.topic,
                parent: 'Tips',
            };
        },
    },
};
