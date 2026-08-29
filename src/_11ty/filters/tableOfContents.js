module.exports = function tableOfContents(content) {
    if (!content) return [];

    const headingRegex = /<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const text = match[3]
            .replace(/<a[^>]*class="heading-anchor"[\s\S]*?<\/a>/g, '')
            .replace(/<[^>]*>/g, '')
            .trim();
        if (text) headings.push({ level: Number(match[1]), id: match[2], text });
    }

    const toc = [];
    let currentH2 = null;

    headings.forEach((heading) => {
        if (heading.level === 2) {
            currentH2 = { ...heading, children: [] };
            toc.push(currentH2);
        } else if (currentH2) {
            currentH2.children.push(heading);
        } else {
            toc.push({ ...heading, children: [] });
        }
    });

    return toc;
};
