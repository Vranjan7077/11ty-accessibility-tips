const wcagCriteria = require('../../_data/wcagCriteria.json');

const PRINCIPLES = {
    1: 'Perceivable',
    2: 'Operable',
    3: 'Understandable',
    4: 'Robust',
};

const PRINCIPLE_ORDER = ['Perceivable', 'Operable', 'Understandable', 'Robust'];

module.exports = function wcagIndex(collectionApi) {
    const posts = collectionApi.getFilteredByTag('post');

    const byCode = {};
    posts.forEach(function (post) {
        (post.data.wcag || []).forEach(function (code) {
            if (!byCode[code]) byCode[code] = [];
            byCode[code].push(post);
        });
    });

    const byPrinciple = {};
    Object.keys(byCode)
        .sort()
        .forEach(function (code) {
            const principle = PRINCIPLES[code.split('.')[0]] || 'Other';
            if (!byPrinciple[principle]) byPrinciple[principle] = [];
            byPrinciple[principle].push({
                code: code,
                name: wcagCriteria[code] ? wcagCriteria[code].name : code,
                level: wcagCriteria[code] ? wcagCriteria[code].level : null,
                posts: byCode[code].sort(function (a, b) {
                    return a.data.title.localeCompare(b.data.title);
                }),
            });
        });

    return PRINCIPLE_ORDER.filter(function (principle) {
        return byPrinciple[principle];
    }).map(function (principle) {
        return { principle: principle, criteria: byPrinciple[principle] };
    });
};
