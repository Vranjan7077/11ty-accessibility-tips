function score(current, candidate) {
    let points = 0;
    const currentTopics = current.topicsList || [];
    const candidateTopics = candidate.data.topicsList || [];
    currentTopics.forEach((topic) => {
        if (candidateTopics.includes(topic)) points += 3;
    });

    const currentTech = current.technologies || [];
    const candidateTech = candidate.data.technologies || [];
    currentTech.forEach((tech) => {
        if (candidateTech.includes(tech)) points += 2;
    });

    if (current.type && current.type === candidate.data.type) points += 1;

    return points;
}

module.exports = function relatedPosts(posts, current, limit = 3) {
    if (!posts || !current) return [];

    return posts
        .filter((post) => post.url !== current.url)
        .map((post) => ({ post, points: score(current, post) }))
        .filter((entry) => entry.points > 0)
        .sort((a, b) => b.points - a.points || b.post.date - a.post.date)
        .slice(0, limit)
        .map((entry) => entry.post);
};
