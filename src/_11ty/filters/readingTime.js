const WORDS_PER_MINUTE = 200;

module.exports = function readingTime(content) {
    if (!content) return 1;
    const text = String(content).replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
