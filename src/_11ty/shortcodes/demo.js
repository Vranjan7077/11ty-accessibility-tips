module.exports = function demo(url) {
    return `<div class="example example--border">
            <div class="example__ribbon example__ribbon--tr">
                <span class="example__title">Demo</span>
            </div>
            <div class="example__content example__content--medium">
                <iframe class="example__frame" src="${url}"></iframe>
            </div>
       </div>`;
};
